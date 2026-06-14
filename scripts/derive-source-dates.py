#!/usr/bin/env python3
"""Draft source dates for editor review.

Phase 1 only: this writes docs/Source-Dates-Review.md and never edits
src/data/dimensions.json. The resulting table is intentionally conservative:
URL dates and page metadata are proposed; anything unclear is sent to manual
review.
"""

import json
import re
import sys
from dataclasses import dataclass
from datetime import date, datetime, timezone
from email.utils import parsedate_to_datetime
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

import requests

PROJECT_DIR = Path(__file__).resolve().parents[1]
DIMENSIONS_FILE = PROJECT_DIR / "src" / "data" / "dimensions.json"
META_FILE = PROJECT_DIR / "src" / "data" / "meta.json"
OUT_FILE = PROJECT_DIR / "docs" / "Source-Dates-Review.md"

BROWSER_UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15"
)
TIMEOUT = 20
MAX_REDIRECTS = 5
MAX_BYTES = 1_500_000
DATE_KIND_VALUES = {"published", "updated", "as-of"}

PUBLISHED_META = (
    "article:published_time",
    "article:published",
    "datePublished",
    "dcterms.issued",
    "dc.date.issued",
    "dc.date",
    "date",
    "pubdate",
)
UPDATED_META = (
    "article:modified_time",
    "dateModified",
    "dc.date.modified",
    "dcterms.modified",
)
LIVING_HOSTS = {
    "open.canada.ca",
}
MONTH_NAME_TO_NUMBER = {
    "january": 1,
    "february": 2,
    "march": 3,
    "april": 4,
    "may": 5,
    "june": 6,
    "july": 7,
    "august": 8,
    "september": 9,
    "october": 10,
    "november": 11,
    "december": 12,
}


@dataclass
class ProposedDate:
    value: str
    date_kind: str
    how: str
    confidence: str
    needs_manual: bool = False


class DateMetadataParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.meta = []
        self.times = []
        self.visible = []
        self._capture_title = False

    def handle_starttag(self, tag, attrs):
        attrs = {k.lower(): v for k, v in attrs if k}
        if tag.lower() == "meta":
            key = attrs.get("property") or attrs.get("name") or attrs.get("itemprop")
            content = attrs.get("content")
            if key and content:
                self.meta.append((key.strip(), content.strip()))
        elif tag.lower() == "time" and attrs.get("datetime"):
            self.times.append(attrs["datetime"].strip())
        elif tag.lower() == "title":
            self._capture_title = True

    def handle_endtag(self, tag):
        if tag.lower() == "title":
            self._capture_title = False

    def handle_data(self, data):
        if self._capture_title:
            self.visible.append(data)


def load_json(path):
    return json.loads(path.read_text())


def host_of(url):
    try:
        return (urlparse(url).hostname or "").lower()
    except Exception:
        return ""


def is_pdf_url(url):
    return (urlparse(url).path or "").lower().endswith(".pdf")


def markdown_escape(text):
    return str(text or "").replace("|", "\\|").replace("\n", " ").strip()


def valid_date_parts(year, month, day=None):
    try:
        if day is None:
            date(int(year), int(month), 1)
        else:
            date(int(year), int(month), int(day))
        return True
    except ValueError:
        return False


def parse_url_date(url):
    path = urlparse(url).path or ""
    match = re.search(r"/(20\d{2})/([01]?\d)/([0-3]?\d)(?:/|$)", path)
    if match and valid_date_parts(match.group(1), match.group(2), match.group(3)):
        y, m, d = match.groups()
        return f"{int(y):04d}-{int(m):02d}-{int(d):02d}", "url full date"

    match = re.search(r"/daily-quotidien/(\d{2})(\d{2})(\d{2})(?:/|$)", path)
    if match:
        yy, m, d = match.groups()
        year = 2000 + int(yy)
        if valid_date_parts(year, m, d):
            return f"{year:04d}-{int(m):02d}-{int(d):02d}", "url statcan daily"

    month_names = "|".join(MONTH_NAME_TO_NUMBER)
    match = re.search(rf"(?:^|[./_-])({month_names})-(\d{{1,2}})--(20\d{{2}})(?:[./_-]|$)", path.lower())
    if match:
        month_name, d, y = match.groups()
        month = MONTH_NAME_TO_NUMBER[month_name]
        if valid_date_parts(y, month, d):
            return f"{int(y):04d}-{month:02d}-{int(d):02d}", "url month-name"

    match = re.search(r"/(20\d{2})/([01]?\d)(?:/|$)", path)
    if match and valid_date_parts(match.group(1), match.group(2)):
        y, m = match.groups()
        return f"{int(y):04d}-{int(m):02d}", "url month"

    match = re.search(r"(?:/|[-_])(20\d{2})-([01]\d)(?:/|[-_.]|$)", path)
    if match and valid_date_parts(match.group(1), match.group(2)):
        y, m = match.groups()
        return f"{int(y):04d}-{int(m):02d}", "url month"

    return None, None


def parse_date_value(raw):
    text = unescape(str(raw or "")).strip()
    if not text:
        return None

    iso = re.search(r"\b(20\d{2})-([01]\d)-([0-3]\d)\b", text)
    if iso and valid_date_parts(*iso.groups()):
        y, m, d = iso.groups()
        return f"{int(y):04d}-{int(m):02d}-{int(d):02d}"

    month = re.search(r"\b(20\d{2})-([01]\d)\b", text)
    if month and valid_date_parts(month.group(1), month.group(2)):
        y, m = month.groups()
        return f"{int(y):04d}-{int(m):02d}"

    try:
        parsed = datetime.fromisoformat(text.replace("Z", "+00:00"))
        return parsed.date().isoformat()
    except ValueError:
        pass

    try:
        parsed = parsedate_to_datetime(text)
        return parsed.date().isoformat()
    except (TypeError, ValueError, IndexError, AttributeError):
        return None


def hardened_html_fetch(url):
    session = requests.Session()
    session.max_redirects = MAX_REDIRECTS
    try:
        resp = session.get(
            url,
            timeout=TIMEOUT,
            headers={"User-Agent": BROWSER_UA, "Accept": "text/html,application/xhtml+xml"},
            stream=True,
            allow_redirects=True,
        )
    except requests.RequestException as exc:
        return None, f"fetch failed: {exc.__class__.__name__}"

    content_type = (resp.headers.get("content-type") or "").lower()
    if resp.status_code >= 400:
        resp.close()
        return None, f"http {resp.status_code}"
    if "html" not in content_type:
        resp.close()
        return None, f"non-html content-type: {content_type or 'unknown'}"

    chunks = []
    total = 0
    try:
        for chunk in resp.iter_content(chunk_size=8192):
            if not chunk:
                continue
            total += len(chunk)
            if total > MAX_BYTES:
                resp.close()
                return None, f"html exceeded {MAX_BYTES} byte cap"
            chunks.append(chunk)
    finally:
        resp.close()

    encoding = resp.encoding or "utf-8"
    return b"".join(chunks).decode(encoding, errors="replace"), None


def extract_page_date(html):
    parser = DateMetadataParser()
    parser.feed(html)

    meta = [(key.strip(), value) for key, value in parser.meta]
    by_key = {}
    for key, value in meta:
        by_key.setdefault(key.lower(), []).append(value)

    for key in PUBLISHED_META:
        for value in by_key.get(key.lower(), []):
            parsed = parse_date_value(value)
            if parsed:
                return ProposedDate(parsed, "published", f"page-meta: {key}", "medium")

    for raw in parser.times:
        parsed = parse_date_value(raw)
        if parsed:
            return ProposedDate(parsed, "published", "<time datetime>", "medium")

    for key in UPDATED_META:
        for value in by_key.get(key.lower(), []):
            parsed = parse_date_value(value)
            if parsed:
                return ProposedDate(parsed, "updated", f"page-meta: {key}", "medium")

    modified = re.search(r"Date modified:\s*(20\d{2}-[01]\d-[0-3]\d)", html, re.IGNORECASE)
    if modified:
        parsed = parse_date_value(modified.group(1))
        if parsed:
            return ProposedDate(parsed, "updated", "page text: Date modified", "low")

    return None


def is_living_source(url):
    host = host_of(url)
    parsed = urlparse(url)
    path = (parsed.path or "").lower()
    query = (parsed.query or "").lower()
    if host in {"www150.statcan.gc.ca", "statcan.gc.ca"}:
        return "/t1/" in path or "pid=" in query
    if host in LIVING_HOSTS:
        return True
    if host in {"www.parl.ca", "parl.ca"} and ("bill" in path or "legisinfo" in path):
        return True
    if "legisinfo" in path:
        return True
    return False


def propose_source_date(source, as_of_date):
    url = source.get("url") or ""
    if is_living_source(url):
        return ProposedDate(as_of_date, "as-of", "manual: living source", "review")

    if is_pdf_url(url):
        return ProposedDate("", "published", "manual required: PDF skipped", "manual", True)

    url_date, how = parse_url_date(url)
    if url_date:
        confidence = "high" if len(url_date) == 10 else "medium"
        return ProposedDate(url_date, "published", how, confidence)

    html, fetch_error = hardened_html_fetch(url)
    if not html:
        return ProposedDate("", "published", f"manual required: {fetch_error}", "manual", True)

    page_date = extract_page_date(html)
    if page_date:
        return page_date

    return ProposedDate("", "published", "manual required: no page date found", "manual", True)


def iter_sources(dimensions):
    for dim in dimensions:
        for index, source in enumerate(dim.get("sources", []), start=1):
            yield {
                "dimensionId": dim.get("id"),
                "dimension": dim.get("name"),
                "sourceIndex": index,
                "label": source.get("label"),
                "url": source.get("url"),
            }


def render_review_doc(rows, generated_at):
    manual_count = sum(1 for row in rows if row["needsManualDate"])
    lines = [
        "# Source Dates Review",
        "",
        f"Generated: {generated_at}",
        "",
        "Phase 1 draft only. This file proposes dates for source-table review. It does not change `src/data/dimensions.json`, grades, thresholds, statuses, scoring, GPA math, or source order.",
        "",
        f"Sources reviewed: {len(rows)}. Manual-date flags: {manual_count}.",
        "",
        "Chris review gate: correct this table before any `date` / `dateKind` fields are added to `dimensions.json`.",
        "",
        "| Source | Dimension | Proposed date | dateKind | How derived | Confidence |",
        "|---|---|---:|---|---|---|",
    ]
    for row in rows:
        label = markdown_escape(row["label"])
        url = row["url"]
        source = f"[{label}]({url})" if url else label
        proposed = row["date"] or "needs manual date"
        lines.append(
            "| "
            + " | ".join([
                source,
                markdown_escape(row["dimension"]),
                proposed,
                markdown_escape(row["dateKind"]),
                markdown_escape(row["howDerived"]),
                markdown_escape(row["confidence"]),
            ])
            + " |"
        )
    lines.extend([
        "",
        "## Notes",
        "- `published` means URL or page metadata exposed a publication date.",
        "- `updated` means only a modified/update date was exposed. Do not label it as publication.",
        "- `as-of` is for living data/status pages where the page itself updates over time.",
        "- `needs manual date` means the script did not infer a date. It should be browser-checked or hand-set before migration.",
        "",
    ])
    return "\n".join(lines)


def main():
    dimensions = load_json(DIMENSIONS_FILE)
    meta = load_json(META_FILE)
    as_of_date = date.today().isoformat()
    generated_at = datetime.now(timezone.utc).isoformat(timespec="seconds")

    rows = []
    for item in iter_sources(dimensions):
        proposed = propose_source_date(item, as_of_date)
        if proposed.date_kind not in DATE_KIND_VALUES:
            print(f"Invalid dateKind for {item['label']}: {proposed.date_kind}", file=sys.stderr)
            return 1
        rows.append({
            **item,
            "date": proposed.value,
            "dateKind": proposed.date_kind,
            "howDerived": proposed.how,
            "confidence": proposed.confidence,
            "needsManualDate": proposed.needs_manual,
        })

    OUT_FILE.write_text(render_review_doc(rows, generated_at), encoding="utf-8")
    print(f"Wrote {OUT_FILE.relative_to(PROJECT_DIR)}")
    print(f"Sources reviewed: {len(rows)}")
    print(f"Manual-date flags: {sum(1 for row in rows if row['needsManualDate'])}")
    print(f"As-of date for living sources: {as_of_date}")
    if meta.get("version"):
        print(f"Dashboard version context: {meta['version']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
