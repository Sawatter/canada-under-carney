#!/usr/bin/env python3
"""Validate manual-dispatch inputs for the monthly source monitor workflow."""

from datetime import date
from pathlib import PurePosixPath
import os
import re
import sys


LABEL_RE = re.compile(r"^[a-z0-9-]+$")
DATE_RE = re.compile(r"^[0-9]{4}-[0-9]{2}-[0-9]{2}$")
SHA_RE = re.compile(r"^[0-9a-f]{40}$")


def valid_seen_ledger_path(value):
    if value == "":
        return True

    path = PurePosixPath(value)
    return (
        value == path.as_posix()
        and not path.is_absolute()
        and len(path.parts) == 3
        and path.parts[0] == "monitoring"
        and path.parts[1] in {"candidates", "backtest"}
        and path.suffix == ".json"
        and all(part not in {"", ".", ".."} for part in path.parts)
    )


def main():
    label = os.environ.get("BACKTEST_LABEL", "")
    if not label:
        return 0

    window_start = os.environ.get("WINDOW_START", "")
    window_end = os.environ.get("WINDOW_END", "")
    registry_ref = os.environ.get("REGISTRY_REF", "")
    seen_ledger_path = os.environ.get("SEEN_LEDGER_PATH", "")
    surface_threshold = os.environ.get("SURFACE_THRESHOLD", "")

    if not LABEL_RE.fullmatch(label):
        print("::error::label must match ^[a-z0-9-]+$")
        return 1
    if not DATE_RE.fullmatch(window_start):
        print("::error::window_start is required and must be YYYY-MM-DD")
        return 1
    if not DATE_RE.fullmatch(window_end):
        print("::error::window_end is required and must be YYYY-MM-DD")
        return 1
    if not SHA_RE.fullmatch(registry_ref):
        print("::error::registry_ref must be a full 40-character commit SHA")
        return 1
    if not valid_seen_ledger_path(seen_ledger_path):
        print(
            "::error::seen_ledger_path must be empty or a single JSON file directly "
            "under monitoring/candidates/ or monitoring/backtest/"
        )
        return 1

    start = date.fromisoformat(window_start)
    end = date.fromisoformat(window_end)
    if start > end:
        print("::error::window_start must be on or before window_end")
        return 1

    try:
        float(surface_threshold)
    except ValueError:
        print("::error::surface_threshold must be numeric")
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
