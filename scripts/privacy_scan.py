#!/usr/bin/env python3
"""Fail-closed privacy checks for staged Git blobs and monitor artifacts."""

import argparse
import html
import os
import re
import stat
import subprocess
import sys
import unicodedata
from pathlib import Path
from urllib.parse import unquote, urlsplit


POSIX_LOCAL_PATH_PATTERN = re.compile(
    r"/+(?:users|home)/+(?!<)[^\\/\s]", re.IGNORECASE)
OTHER_LOCAL_PATH_PATTERNS = (
    re.compile(
        r"[A-Za-z]:[\\/]Users[\\/][^\\/\s]", re.IGNORECASE),
    re.compile(
        r"\\\\[^\\/\s]+[\\/][^\\/\s]+[\\/]Users[\\/][^\\/\s]",
        re.IGNORECASE),
)
PUBLIC_HTTP_URL_PATTERN = re.compile(
    r"https?://[^\s<>\"']+", re.IGNORECASE)
EMAIL_PATTERN = re.compile(
    r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
PUBLIC_EMAIL_ALLOWLIST = {"github-actions[bot]@users.noreply.github.com"}
SEPARATORS = "\x00\b\t\n\v\f\r\x85\u2028\u2029"
UNICODE_ESCAPE_PATTERN = re.compile(r"\\u([0-9a-fA-F]{4})")
HEX_ESCAPE_PATTERN = re.compile(r"\\x([0-9a-fA-F]{2})")
SIMPLE_ESCAPE_PATTERN = re.compile(r"\\([bfnrt])")
SIMPLE_ESCAPES = {
    "b": "\b",
    "f": "\f",
    "n": "\n",
    "r": "\r",
    "t": "\t",
}
MAX_ESCAPE_LAYERS = 4


class ScanError(RuntimeError):
    """Raised when a scan cannot complete safely."""


def public_http_path_spans(text):
    """Return pathname spans for HTTP URLs with a non-empty host."""
    spans = []
    for match in PUBLIC_HTTP_URL_PATTERN.finditer(text):
        token = match.group(0)
        try:
            parsed = urlsplit(token)
            host = parsed.hostname
        except ValueError:
            continue
        if parsed.scheme.lower() not in {"http", "https"} or not host:
            continue
        authority_end = token.find("://") + 3 + len(parsed.netloc)
        path_end = authority_end + len(parsed.path)
        if path_end > authority_end:
            spans.append((match.start() + authority_end,
                          match.start() + path_end))
    return tuple(spans)


def contains_local_path(text):
    """Detect local paths without treating public URL pathnames as local."""
    public_path_spans = public_http_path_spans(text)
    for match in POSIX_LOCAL_PATH_PATTERN.finditer(text):
        if not any(start <= match.start() and match.end() <= end
                   for start, end in public_path_spans):
            return True
    return any(pattern.search(text) for pattern in OTHER_LOCAL_PATH_PATTERNS)


def normalized_views(data):
    """Return normalized views, including common serialized escape layers."""
    seeds = [data.decode("utf-8", errors="surrogateescape")]
    for encoding in ("utf-16le", "utf-16be", "utf-32le", "utf-32be"):
        try:
            seeds.append(data.decode(encoding))
        except UnicodeDecodeError:
            continue

    separator_spaces = str.maketrans({char: " " for char in SEPARATORS})
    separator_join = str.maketrans({char: None for char in SEPARATORS})
    queue = [
        (unicodedata.normalize("NFKC", seed), 0)
        for seed in seeds
    ]
    known = {value for value, _ in queue}
    views = []
    seen = set()
    cursor = 0
    while cursor < len(queue):
        current, depth = queue[cursor]
        cursor += 1
        if current in seen:
            continue
        seen.add(current)
        views.append(current)

        decoded = unquote(current)
        decoded = UNICODE_ESCAPE_PATTERN.sub(
            lambda match: chr(int(match.group(1), 16)), decoded)
        decoded = HEX_ESCAPE_PATTERN.sub(
            lambda match: chr(int(match.group(1), 16)), decoded)
        decoded = SIMPLE_ESCAPE_PATTERN.sub(
            lambda match: SIMPLE_ESCAPES[match.group(1)], decoded)
        decoded = decoded.replace(r"\/", "/").replace(r"\\", "\\")
        for transformed in (
                decoded,
                html.unescape(decoded),
                current.translate(separator_spaces),
                current.translate(separator_join)):
            normalized = unicodedata.normalize("NFKC", transformed)
            if normalized in known:
                continue
            if depth >= MAX_ESCAPE_LAYERS:
                raise ScanError(
                    "privacy normalization exceeded the safe escape depth")
            known.add(normalized)
            queue.append((normalized, depth + 1))
    return tuple(views)


def load_identity_patterns(root, *, required=False):
    """Load local-only identity regexes and fail on unreadable or invalid entries."""
    path = root / ".identity-patterns"
    try:
        mode = path.lstat().st_mode
    except FileNotFoundError:
        if required:
            raise ScanError("identity-pattern configuration is required")
        return []
    except OSError as exc:
        raise ScanError("identity-pattern configuration is unreadable") from exc
    if not stat.S_ISREG(mode):
        raise ScanError("identity-pattern configuration is not a regular file")
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except (OSError, UnicodeError) as exc:
        raise ScanError("identity-pattern configuration is unreadable") from exc

    patterns = []
    for index, line in enumerate(lines, start=1):
        expression = line.strip()
        if not expression or expression.startswith("#"):
            continue
        try:
            patterns.append((f"private-identity-{index}", re.compile(expression)))
        except re.error as exc:
            raise ScanError("identity-pattern configuration is invalid") from exc
    if required and not patterns:
        raise ScanError("identity-pattern configuration has no active patterns")
    return patterns


def scan_bytes(data, *, include_email, identity_patterns):
    """Return rule identifiers only, never matched private text."""
    findings = set()
    for view in normalized_views(data):
        if contains_local_path(view):
            findings.add("local-machine-path")
        if include_email:
            for match in EMAIL_PATTERN.finditer(view):
                if match.group(0).lower() not in PUBLIC_EMAIL_ALLOWLIST:
                    findings.add("email-address")
        for rule_id, pattern in identity_patterns:
            if pattern.search(view):
                findings.add(rule_id)
    return sorted(findings)


def git_bytes(args, *, cwd):
    try:
        result = subprocess.run(
            ["git", *args], cwd=cwd, check=True, capture_output=True)
    except (OSError, subprocess.CalledProcessError) as exc:
        raise ScanError("Git index data could not be read") from exc
    return result.stdout


def staged_paths(root):
    raw = git_bytes(
        ["diff", "--cached", "--name-only", "-z", "--diff-filter=ACMRT"],
        cwd=root)
    return [os.fsdecode(value) for value in raw.split(b"\0") if value]


def staged_blob(root, path):
    record = git_bytes(["ls-files", "--stage", "-z", "--", path], cwd=root)
    entries = [value for value in record.split(b"\0") if value]
    if len(entries) != 1 or b"\t" not in entries[0]:
        raise ScanError("staged path does not resolve to one index entry")
    metadata, _ = entries[0].split(b"\t", 1)
    fields = metadata.split()
    if len(fields) != 3 or fields[2] != b"0":
        raise ScanError("staged path has an unresolved index state")
    mode, object_id, _ = fields
    if mode in {b"120000", b"160000"}:
        raise ScanError("staged symbolic links and submodules are not scannable")
    return git_bytes(["cat-file", "blob", object_id.decode("ascii")], cwd=root)


def report_findings(findings):
    if not findings:
        print("privacy scan: passed")
        return 0
    for rule_id, source_id in findings:
        print(f"privacy scan: BLOCKED: {rule_id} in {source_id}", file=sys.stderr)
    return 1


def scan_staged(root, *, require_identity_patterns=False):
    if git_bytes(
            ["ls-files", "--stage", "-z", "--", ".identity-patterns"],
            cwd=root):
        raise ScanError("identity-pattern configuration must never be tracked")
    identity_patterns = load_identity_patterns(
        root, required=require_identity_patterns)
    findings = []
    for index, path in enumerate(staged_paths(root), start=1):
        source_id = f"staged item {index}"
        path_bytes = os.fsencode(path)
        for rule_id in scan_bytes(
                path_bytes, include_email=True,
                identity_patterns=identity_patterns):
            findings.append((rule_id, f"{source_id} name"))
        blob = staged_blob(root, path)
        for rule_id in scan_bytes(
                blob, include_email=True,
                identity_patterns=identity_patterns):
            findings.append((rule_id, f"{source_id} content"))
    return report_findings(sorted(set(findings)))


def resolve_artifact(root, raw_path):
    path = Path(raw_path)
    if not path.is_absolute():
        path = root / path
    cursor = path
    while cursor != root and root in cursor.parents:
        if cursor.is_symlink():
            raise ScanError("artifact input contains a symbolic link")
        cursor = cursor.parent
    try:
        resolved = path.resolve(strict=True)
    except OSError as exc:
        raise ScanError("artifact input is missing or unreadable") from exc
    if resolved != root and root not in resolved.parents:
        raise ScanError("artifact input escapes the repository root")
    if not resolved.is_file():
        raise ScanError("artifact input is not a regular file")
    return resolved


def scan_files(root, paths, *, require_identity_patterns=False):
    identity_patterns = load_identity_patterns(
        root, required=require_identity_patterns)
    findings = []
    for index, raw_path in enumerate(paths, start=1):
        source_id = f"artifact item {index}"
        path = resolve_artifact(root, raw_path)
        try:
            data = path.read_bytes()
        except OSError as exc:
            raise ScanError("artifact input could not be read") from exc
        relative_name = os.fsencode(str(path.relative_to(root)))
        for rule_id in scan_bytes(
                relative_name, include_email=True,
                identity_patterns=identity_patterns):
            findings.append((rule_id, f"{source_id} name"))
        for rule_id in scan_bytes(
                data, include_email=True,
                identity_patterns=identity_patterns):
            findings.append((rule_id, f"{source_id} content"))
    return report_findings(sorted(set(findings)))


def parse_args(argv=None):
    parser = argparse.ArgumentParser()
    subparsers = parser.add_subparsers(dest="mode", required=True)
    staged = subparsers.add_parser("staged")
    staged.add_argument("--root", default=".")
    staged.add_argument("--require-identity-patterns", action="store_true")
    files = subparsers.add_parser("files")
    files.add_argument("--root", default=".")
    files.add_argument("--require-identity-patterns", action="store_true")
    files.add_argument("paths", nargs="+")
    return parser.parse_args(argv)


def main(argv=None):
    args = parse_args(argv)
    try:
        root = Path(args.root).resolve(strict=True)
        if not root.is_dir():
            raise ScanError("repository root is not a directory")
        if args.mode == "staged":
            return scan_staged(
                root,
                require_identity_patterns=args.require_identity_patterns)
        return scan_files(
            root, args.paths,
            require_identity_patterns=args.require_identity_patterns)
    except (OSError, ScanError, UnicodeError) as exc:
        print(f"privacy scan: ERROR: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
