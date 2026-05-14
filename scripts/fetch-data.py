#!/usr/bin/env python3
"""
Canada Under Carney — Monthly Data Fetch Script

Checks government data endpoints (Statistics Canada, IRCC, Bank of Canada,
Parliamentary Budget Officer RSS) and generates draft files for human
review. The PBO RSS check surfaces recent publications and flags which
are not yet cited in dimensions.json.

Usage:
    python scripts/fetch-data.py

Outputs (in scripts/output/):
    draft-dimensions.json   — copy of current dimensions for manual edits
    fetch-report.txt        — human-readable source-availability report
"""

import argparse
import json
import os
import re
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, date
from pathlib import Path

try:
    import requests
except ImportError:
    print("ERROR: 'requests' not installed. Run: pip install -r scripts/requirements.txt")
    sys.exit(1)

# --- Paths ---
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
DATA_DIR = PROJECT_DIR / "src" / "data"
OUTPUT_DIR = SCRIPT_DIR / "output"

DIMENSIONS_FILE = DATA_DIR / "dimensions.json"

# --- Statistics Canada WDS API ---
STATCAN_BASE = "https://www150.statcan.gc.ca/t1/tbl1/en/tv.action"

# Vector IDs for specific data points
# These are the most stable way to pull individual series from StatCan
STATCAN_VECTORS = {
    # Food CPI (all-items food purchased from stores, Canada, monthly)
    "food_cpi": {
        "pid": "18-10-0004-01",
        "description": "Consumer Price Index - Food purchased from stores",
        "url": "https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1810000401",
    },
    # Labour Force Survey - unemployment rate, Canada, monthly, seasonally adjusted
    "unemployment": {
        "pid": "14-10-0287-01",
        "description": "Labour force characteristics, monthly, seasonally adjusted",
        "url": "https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1410028701",
    },
    # Population estimates, quarterly
    "population": {
        "pid": "17-10-0009-01",
        "description": "Population estimates, quarterly",
        "url": "https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1710000901",
    },
    # Housing starts (CMHC data via StatCan)
    "housing_starts": {
        "pid": "34-10-0158-01",
        "description": "Canada Mortgage and Housing Corporation, housing starts",
        "url": "https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=3410015801",
    },
    # International merchandise trade by country
    "trade": {
        "pid": "12-10-0176-01",
        "description": "Merchandise imports and exports by country",
        "url": "https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1210017601",
    },
}

# --- IRCC Open Data ---
IRCC_DATASETS = {
    "permanent_residents": {
        "url": "https://www.ircc.canada.ca/opendata-donneesouvertes/data/ODP-PR-Gender.csv",
        "description": "Permanent resident admissions by gender, monthly",
    },
    "work_permits_imp": {
        "url": "https://www.ircc.canada.ca/opendata-donneesouvertes/data/ODP-TR-Work-IMP-PT_program.csv",
        "description": "International Mobility Program work permit holders by province/territory and program, monthly",
    },
    "work_permits_tfwp": {
        "url": "https://www.ircc.canada.ca/opendata-donneesouvertes/data/ODP-TR-Work-TFWP-PT_program.csv",
        "description": "Temporary Foreign Worker Program work permit holders by province/territory and program, monthly",
    },
    "study_permits": {
        "url": "https://www.ircc.canada.ca/opendata-donneesouvertes/data/ODP-TR-Study-IS_PT_study.csv",
        "description": "Study permit holders by province/territory and study level, monthly",
    },
}

# --- Bank of Canada Valet API ---
BOC_BASE = "https://www.bankofcanada.ca/valet/observations"

# --- Parliamentary Budget Officer RSS feed ---
# PBO publishes a public RSS feed of recent reports, costings, and
# analyses. The dashboard cites PBO in 7 dimensions (Fiscal Health,
# Affordability Response, Carbon Pricing Policy, Housing Supply,
# Flagship Delivery, Promise Delivery, Economic Policy Response).
# Surfacing the feed each month flags new releases the editor would
# otherwise have to find by manual page-scan.
PBO_FEED_URL = "https://www.pbo-dpb.ca/en/feed.xml"


def fetch_statcan_table_info(pid):
    """Fetch metadata about a StatCan table to check last update date."""
    clean_pid = pid.replace("-", "")
    url = f"https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid={clean_pid}"
    try:
        resp = requests.get(url, timeout=15)
        if resp.status_code == 200:
            return {"status": "accessible", "url": url}
    except Exception as e:
        return {"status": "error", "error": str(e)}
    return {"status": "http_error", "code": resp.status_code}


def fetch_ircc_csv(dataset_key):
    """Download an IRCC open data CSV and return basic stats."""
    info = IRCC_DATASETS[dataset_key]
    try:
        resp = requests.get(info["url"], timeout=30)
        if resp.status_code == 200:
            lines = resp.text.strip().split("\n")
            return {
                "status": "success",
                "rows": len(lines) - 1,  # exclude header
                "header": lines[0] if lines else "",
                "last_row": lines[-1] if len(lines) > 1 else "",
            }
        return {"status": "http_error", "code": resp.status_code}
    except Exception as e:
        return {"status": "error", "error": str(e)}


def check_boc_series(series_id="FXCADUSD"):
    """Check Bank of Canada Valet API availability."""
    url = f"{BOC_BASE}/{series_id}/json?recent=1"
    try:
        resp = requests.get(url, timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            obs = data.get("observations", [])
            if obs:
                latest = obs[-1]
                return {"status": "success", "latest": latest}
        return {"status": "http_error", "code": resp.status_code}
    except Exception as e:
        return {"status": "error", "error": str(e)}


def fetch_pbo_feed(limit=20):
    """Fetch the PBO RSS feed and return recent publications.

    PBO ships a standard RSS 2.0 feed. We parse <item> elements for
    title, link, and pubDate. The fetch report later compares each link
    against the live dimensions.json so new PBO releases (not already
    cited) are surfaced to the editor for manual evaluation.
    """
    import xml.etree.ElementTree as ET

    try:
        resp = requests.get(
            PBO_FEED_URL,
            timeout=30,
            headers={"User-Agent": "Mozilla/5.0 (Canada Under Carney monthly fetch)"},
        )
        if resp.status_code != 200:
            return {"status": "http_error", "code": resp.status_code}

        root = ET.fromstring(resp.content)
        items = root.findall(".//item")[:limit]
        publications = []
        for item in items:
            title_el = item.find("title")
            link_el = item.find("link")
            pubdate_el = item.find("pubDate")
            title = (title_el.text or "").strip() if title_el is not None else ""
            link = (link_el.text or "").strip() if link_el is not None else ""
            pubdate = (pubdate_el.text or "").strip() if pubdate_el is not None else ""
            publications.append(
                {
                    "title": title or "(untitled)",
                    "link": link,
                    "pubDate": pubdate,
                }
            )
        return {
            "status": "success",
            "count": len(publications),
            "publications": publications,
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}


# --- Pollster RSS surfaces ---
# The dashboard's Approval Signal aggregates polls from Abacus Data,
# Léger, and Angus Reid Institute. The pollster homepages 403 against
# bot-style requests, but each firm publishes a public RSS feed that
# does return 200. Surface recent posts from each feed, filter for
# federal-approval-relevant titles, and flag any that aren't yet
# cited in src/data/approval-polls.json.
POLLSTER_FEEDS = [
    {"name": "Abacus Data", "url": "https://abacusdata.ca/feed/", "domain": "abacusdata.ca"},
    {"name": "Léger", "url": "https://leger360.com/en/feed/", "domain": "leger360.com"},
    {"name": "Angus Reid Institute", "url": "https://angusreid.org/feed/", "domain": "angusreid.org"},
]

# Excluded pollsters — not currently cited in approval-polls.json, but
# the recurring checklist requires a quarterly scan in case they
# publish federal-approval content worth pulling into the dashboard.
# Mainstreet Research and EKOS Politics do not publish a public RSS
# feed and remain manual surfaces.
EXCLUDED_POLLSTER_FEEDS = [
    {"name": "Pollara Strategic Insights", "url": "https://www.pollara.com/feed/", "domain": "pollara.com"},
    {"name": "Ipsos Canada", "url": "https://www.ipsos.com/en-ca/rss.xml", "domain": "ipsos.com"},
    {"name": "Innovative Research Group", "url": "https://innovativeresearch.ca/feed/", "domain": "innovativeresearch.ca"},
]


def _is_approval_relevant(title):
    """Heuristic filter: does this post title look like a federal
    approval / Carney post rather than provincial, marketing-research,
    or unrelated content? Cast wider with the keyword match, then
    actively exclude clearly-provincial posts."""
    t = (title or "").lower().strip()
    if not t:
        return False
    federal_keywords = [
        "carney",
        "federal",
        "liberal",
        "conservative",
        "government approval",
        "pm ",
        "trudeau",
        "poilievre",
        "house majority",
        "house of commons",
        "ottawa",
        "national",
    ]
    if not any(k in t for k in federal_keywords):
        return False
    # Strong federal signal — keep regardless of provincial keywords.
    federal_anchor = any(
        k in t for k in ["carney", "federal", "ottawa", "house of commons",
                         "house majority", "trudeau", "poilievre"]
    )
    if federal_anchor:
        return True
    # Otherwise look for provincial markers and exclude if any apply.
    provincial_markers = [
        # Province-specific party / leader names
        "bc conservatives", "bc ndp", "bc liberal", "bc green",
        "british columbia",
        "ontario pcs", "ontario liberal", "ontario ndp", "ontario green",
        "ford government",
        "quebec liberal", "caq", "quebec premier", "parti québécois",
        "alberta ucp", "alberta ndp", "danielle smith",
        "saskatchewan party",
        "manitoba ndp", "manitoba pcs",
        # Province-leading title prefixes
    ]
    if any(p in t for p in provincial_markers):
        return False
    if t.startswith(("bc ", "ontario ", "quebec ", "alberta ",
                     "saskatchewan ", "manitoba ", "nova scotia ",
                     "new brunswick ", "newfoundland ", "pei ", "nwt ")):
        return False
    return True


def fetch_pollster_feed(pollster, limit=15):
    """Fetch one pollster's RSS feed. Returns recent items filtered
    for federal-approval-relevant titles."""
    import xml.etree.ElementTree as ET
    try:
        resp = requests.get(
            pollster["url"],
            timeout=30,
            headers={"User-Agent": "Mozilla/5.0 (Canada Under Carney monthly fetch)"},
        )
        if resp.status_code != 200:
            return {"status": "http_error", "code": resp.status_code}
        root = ET.fromstring(resp.content)
        items = root.findall(".//item")[:limit]
        all_items = []
        for item in items:
            title_el = item.find("title")
            link_el = item.find("link")
            pubdate_el = item.find("pubDate")
            title = (title_el.text or "").strip() if title_el is not None else ""
            link = (link_el.text or "").strip() if link_el is not None else ""
            pubdate = (pubdate_el.text or "").strip() if pubdate_el is not None else ""
            all_items.append({"title": title, "link": link, "pubDate": pubdate})
        relevant = [i for i in all_items if _is_approval_relevant(i["title"])]
        return {
            "status": "success",
            "all_count": len(all_items),
            "relevant_count": len(relevant),
            "items": relevant,
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}


def collect_cited_pollster_urls(approval_polls, domain):
    """Return lowercase set of poll URLs for one pollster domain that
    are already cited in approval-polls.json."""
    cited = set()
    for p in approval_polls.get("polls", []):
        url = (p.get("sourceUrl") or "").lower().rstrip("/")
        if domain in url:
            cited.add(url)
    for p in (approval_polls.get("preferredPM") or {}).get("polls", []):
        url = (p.get("sourceUrl") or "").lower().rstrip("/")
        if domain in url:
            cited.add(url)
    return cited


def check_pollster_feeds():
    """Walk POLLSTER_FEEDS, fetch each feed, return list of
    {pollster, url, status, items, citation_marks}.

    Loads approval-polls.json for the cited-URL comparison."""
    polls_file = DATA_DIR / "approval-polls.json"
    try:
        approval_polls = json.loads(polls_file.read_text())
    except Exception:
        approval_polls = {"polls": [], "preferredPM": {"polls": []}}

    results = []
    for pollster in POLLSTER_FEEDS:
        rec = fetch_pollster_feed(pollster)
        cited = collect_cited_pollster_urls(approval_polls, pollster["domain"])
        if rec.get("status") == "success":
            for item in rec.get("items", []):
                normalized = item.get("link", "").lower().rstrip("/")
                item["is_cited"] = normalized in cited
            new_count = sum(1 for i in rec.get("items", []) if not i["is_cited"])
            rec["new_count"] = new_count
            rec["cited_count"] = rec.get("relevant_count", 0) - new_count
        results.append({"pollster": pollster["name"], "url": pollster["url"], **rec})
    return results


def check_excluded_pollster_feeds():
    """Walk EXCLUDED_POLLSTER_FEEDS, fetch each feed, surface any
    federal-approval-relevant posts. These pollsters are not currently
    cited in approval-polls.json — the editor decides each cycle
    whether a release crosses the bar for inclusion. The quarterly
    recurring-source-checklist row makes this an editor responsibility
    every three cycles; running it every monthly cycle is cheap and
    just surfaces more signal."""
    results = []
    for pollster in EXCLUDED_POLLSTER_FEEDS:
        rec = fetch_pollster_feed(pollster)
        results.append({"pollster": pollster["name"], "url": pollster["url"], **rec})
    return results


# --- Policy / academic / journalism RSS surfaces ---
# The recurring checklist has a quarterly "policy / academic / journalism
# scan" row covering 11 publishers. Six have working, well-structured
# RSS feeds. The other 5 are blocked (Cloudflare HTML challenge instead
# of feed for CCI, empty channel for IISD, atom-format for Conversation
# Canada needing a different parser, paywalled / firehose for Globe and
# CBC). Run all six each cycle; tag dashboard-topic-relevant items.
POLICY_RSS_FEEDS = [
    {"name": "C.D. Howe Institute", "url": "https://www.cdhowe.org/feed/"},
    {"name": "Fraser Institute", "url": "https://www.fraserinstitute.org/rss.xml"},
    {"name": "The Hub", "url": "https://thehub.ca/feed/"},
    {"name": "Democracy Watch", "url": "https://democracywatch.ca/feed/"},
    {"name": "PROOF (Food Insecurity)", "url": "https://proof.utoronto.ca/feed/"},
    {"name": "The Narwhal", "url": "https://thenarwhal.ca/feed/"},
]


def _is_dashboard_topic_relevant(title):
    """Heuristic filter: does this title look like content the
    dashboard could cite? Federal politics, fiscal policy, climate,
    housing, immigration, defence, trade — the 11 graded dimensions
    plus the promise tracker.

    Used as a tag (`[TOPIC]` vs `[OTHER]`), not a hard exclude —
    every item is surfaced so the editor can see what each org
    is publishing, with topic-matching items called out."""
    t = (title or "").lower().strip()
    if not t:
        return False
    keywords = [
        # Federal / political
        "federal", "ottawa", "carney", "trudeau", "poilievre",
        "house of commons", "minister",
        # Fiscal / economic
        "fiscal", "deficit", "debt", "budget", "tax", "spending",
        "pbo", "imf",
        # Housing
        "housing", "rental", "homeless", "mortgage", "cmhc",
        # Immigration
        "immigration", "ircc", "permanent resident", "temporary resident",
        "asylum", "newcomer",
        # Defence / trade / tariffs
        "defence", "defense", "nato", "tariff", "trade", "export",
        "merchandise trade", "ust",
        # Climate / carbon
        "climate", "carbon", "emissions", "paris agreement", "net zero",
        "obps", "fuel charge",
        # Affordability / food
        "affordability", "food insecurity", "grocery", "cost of living",
        # Ethics / governance
        "ethics commissioner", "conflict of interest", "transparency",
        "lobbying", "ciec",
        # Major projects / energy
        "lng", "pipeline", "critical minerals", "major projects",
        "smr", "small modular reactor",
    ]
    return any(k in t for k in keywords)


def fetch_policy_feed(feed, limit=8):
    """Fetch one policy / journalism RSS feed. Returns recent items
    with a topic-relevance tag applied."""
    import xml.etree.ElementTree as ET
    try:
        resp = requests.get(
            feed["url"],
            timeout=30,
            headers={"User-Agent": "Mozilla/5.0 (Canada Under Carney monthly fetch)"},
        )
        if resp.status_code != 200:
            return {"status": "http_error", "code": resp.status_code}
        # Some endpoints return HTML when challenged — verify XML.
        if not resp.content.lstrip().startswith(b"<?xml") and b"<rss" not in resp.content[:300]:
            return {"status": "not_xml"}
        root = ET.fromstring(resp.content)
        items = root.findall(".//item")[:limit]
        out = []
        for item in items:
            title_el = item.find("title")
            link_el = item.find("link")
            pubdate_el = item.find("pubDate")
            title = (title_el.text or "").strip() if title_el is not None else ""
            link = (link_el.text or "").strip() if link_el is not None else ""
            pubdate = (pubdate_el.text or "").strip() if pubdate_el is not None else ""
            out.append({
                "title": title,
                "link": link,
                "pubDate": pubdate,
                "topic_match": _is_dashboard_topic_relevant(title),
            })
        topic_count = sum(1 for i in out if i["topic_match"])
        return {
            "status": "success",
            "count": len(out),
            "topic_count": topic_count,
            "items": out,
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}


def check_policy_feeds():
    """Walk POLICY_RSS_FEEDS, surface recent items with dashboard-topic
    relevance tags. Editor uses this to spot independent analysis
    relevant to dimension grades."""
    results = []
    for feed in POLICY_RSS_FEEDS:
        rec = fetch_policy_feed(feed)
        results.append({"publisher": feed["name"], "url": feed["url"], **rec})
    return results


# --- LEGISinfo bill-status check ---
# Public JSON endpoint per bill at parl.ca. The dashboard cites
# bills as parl.ca URLs in sources / triggers / promises (currently
# only Bill C-5 / Building Canada Act). Each cycle, we walk those
# citations, pull current status from LEGISinfo, and surface any
# stage / status fields in the fetch report. Stage movement on
# tracked bills can fire Defence & Trade or Major Projects triggers.
LEGISINFO_BILL_URL = "https://www.parl.ca/legisinfo/en/bill/{parl}/{bill}/json"


def collect_cited_bills(dimensions):
    """Walk all cited parl.ca URLs in dimensions.json and return a
    de-duplicated list of {bill, parl, citations} where bill is the
    LEGISinfo bill identifier (e.g. "c-5") and parl is the parliament
    session (e.g. "45-1")."""
    bills = {}
    bill_re = re.compile(r"bill/(\d+-\d+)/([cs]-\d+)", re.IGNORECASE)

    def add(label, url, dim_name):
        if not url or "parl.ca" not in url.lower():
            return
        m = bill_re.search(url)
        if not m:
            return
        parl = m.group(1)
        bill = m.group(2).lower()
        key = f"{parl}/{bill}"
        if key not in bills:
            bills[key] = {"bill": bill, "parl": parl, "citations": []}
        bills[key]["citations"].append({"dim": dim_name, "label": label or "(no label)"})

    for dim in dimensions:
        name = dim.get("name", "?")
        for s in dim.get("sources") or []:
            add(s.get("label"), s.get("url"), name)
        for side in ("up", "down"):
            for t in (dim.get("gradeTriggers") or {}).get(side) or []:
                if isinstance(t, dict):
                    add(t.get("sourceLabel"), t.get("sourceUrl"), name)
        for p in dim.get("promises") or []:
            add(p.get("originalSourceLabel"), p.get("originalSourceUrl"), name)
            add(p.get("statusSourceLabel"), p.get("statusSourceUrl"), name)

    return list(bills.values())


def fetch_legisinfo_status(bill, parl, timeout=15):
    """Fetch one bill's current status from LEGISinfo JSON. Returns
    dict with the fields the fetch report surfaces."""
    url = LEGISINFO_BILL_URL.format(parl=parl, bill=bill)
    try:
        resp = requests.get(
            url,
            timeout=timeout,
            headers={"User-Agent": "Mozilla/5.0 (Canada Under Carney monthly fetch)"},
        )
        if resp.status_code != 200:
            return {"status": "http_error", "code": resp.status_code, "url": url}
        data = resp.json()
        # LEGISinfo returns a list with one bill entry
        if isinstance(data, list) and data:
            item = data[0]
            return {
                "status": "success",
                "url": url,
                "number_code": item.get("NumberCode"),
                "short_title": item.get("ShortTitle") or item.get("ShortTitleEn"),
                "long_title": item.get("LongTitle") or item.get("LongTitleEn"),
                "current_status": item.get("StatusName") or item.get("StatusNameEn"),
                "latest_stage": item.get("LatestCompletedMajorStageName")
                    or item.get("LatestCompletedMajorStageNameEn"),
                "ongoing_stage": item.get("OngoingStageName")
                    or item.get("OngoingStageNameEn"),
                "first_reading": (item.get("PassedHouseFirstReadingDateTime") or "")[:10],
                "royal_assent": (item.get("ReceivedRoyalAssentDateTime") or "")[:10],
            }
        return {"status": "empty", "url": url}
    except Exception as e:
        return {"status": "error", "error": str(e), "url": url}


def check_legisinfo_bills(dimensions):
    """Walk cited bills, call LEGISinfo per bill, return list of
    {bill, parl, citations, status_record}."""
    cited = collect_cited_bills(dimensions)
    results = []
    for entry in cited:
        rec = fetch_legisinfo_status(entry["bill"], entry["parl"])
        results.append({**entry, "record": rec})
    return results


# --- Major Projects Office page diff ---
# The official MPO page is the source of truth for the project cohort
# denominator. The May cycle hit a 16 -> 15 denominator correction
# because the dashboard's projectCohort was out of sync with the MPO
# list. Scraping the page each cycle and diffing against the live
# projectCohort.projects catches drift before it shows up in a grade.
MPO_PAGE_URL = "https://www.canada.ca/en/privy-council/major-projects-office/projects/national.html"

# H2 headings that are page chrome, not projects.
_MPO_BOILERPLATE_H2 = {
    "language selection",
    "search",
    "you are here",
    "projects",
    "menu",
    "subscribe",
    "discover",
    "stay connected",
    "quick facts",
    "latest updates",
    "page details",
    "about this site",
    "about government",
    "contact information",
}


def _mpo_token_set(name):
    """Return a frozenset of normalized tokens for a project name.

    Normalization:
      - Unfold common ligatures (œ -> oe, æ -> ae) so "Contrecœur" and
        "Contrecoeur" become the same token.
      - NFKD-decompose to separate combining accents, drop them.
      - Lowercase, strip non-alphanumeric, collapse whitespace.
      - Drop generic stop words. Keep distinguishing tokens like
        "phase", "1", "2", "expansion" so Phase 1 / Phase 2 don't
        collide.
    """
    import unicodedata
    ligature_unfold = name.replace("œ", "oe").replace("Œ", "oe").replace("æ", "ae").replace("Æ", "ae")
    nfkd = unicodedata.normalize("NFKD", ligature_unfold)
    stripped = "".join(c for c in nfkd if not unicodedata.combining(c))
    cleaned = re.sub(r"[^a-z0-9]+", " ", stripped.lower()).strip()
    drop_tokens = {"the", "of", "and", "a", "project"}
    tokens = frozenset(t for t in cleaned.split() if t not in drop_tokens and len(t) > 1)
    return tokens


def _jaccard(a, b):
    """Jaccard similarity between two token sets."""
    if not a or not b:
        return 0.0
    return len(a & b) / len(a | b)


def fetch_mpo_page_projects(timeout=20):
    """Scrape the Major Projects Office national-projects page and
    extract the project names. Returns dict with `status` and either
    `projects` (list of names) or `error`.

    Strategy: parse all <h2> elements, drop site-chrome headings,
    de-duplicate by normalized name. The MPO page often repeats each
    project H2 in multiple layout blocks; the dedupe collapses those.
    """
    try:
        resp = requests.get(
            MPO_PAGE_URL,
            timeout=timeout,
            headers={"User-Agent": "Mozilla/5.0 (Canada Under Carney monthly fetch)"},
        )
        if resp.status_code != 200:
            return {"status": "http_error", "code": resp.status_code}
    except Exception as e:
        return {"status": "error", "error": str(e)}

    html = resp.text
    raw_h2 = re.findall(r"<h2[^>]*>(.*?)</h2>", html, re.DOTALL | re.IGNORECASE)
    seen_tokens = set()
    projects = []
    for raw in raw_h2:
        text = re.sub(r"<[^>]+>", "", raw)
        text = re.sub(r"\s+", " ", text).strip()
        if not text:
            continue
        lower = text.lower()
        if any(b in lower for b in _MPO_BOILERPLATE_H2):
            continue
        tokens = _mpo_token_set(text)
        if not tokens or tokens in seen_tokens:
            continue
        seen_tokens.add(tokens)
        projects.append({"display": text, "tokens": tokens})

    return {"status": "success", "projects": projects, "count": len(projects)}


def diff_mpo_against_cohort(dimensions, mpo_result):
    """Compare the MPO page project list against the live
    projectCohort.projects in dimensions.json. Returns dict with:
      - matched: list of (mpo_display, cohort_name)
      - mpo_only: projects on MPO page that don't match any cohort entry
      - cohort_only: projects in cohort that don't match any MPO entry
    Matching uses Jaccard similarity on token sets. >=0.5 counts as a
    match. Each MPO project pairs with the cohort entry it overlaps
    with most. Greedy assignment, each side matched at most once.
    """
    if mpo_result.get("status") != "success":
        return {"status": mpo_result.get("status"), "error": mpo_result.get("error")}

    mp_dim = next((d for d in dimensions if d.get("id") == "major-projects"), None)
    cohort = (mp_dim or {}).get("projectCohort", {}).get("projects", [])
    cohort_entries = [
        {"name": p.get("name", "?"), "tokens": _mpo_token_set(p.get("name", ""))}
        for p in cohort
    ]

    mpo_projects = mpo_result.get("projects", [])

    # Score every (mpo, cohort) pair, then greedy-assign highest-scoring
    # pairs first until each side is matched at most once.
    pairs = []
    for i, m in enumerate(mpo_projects):
        for j, c in enumerate(cohort_entries):
            score = _jaccard(m["tokens"], c["tokens"])
            if score >= 0.5:
                pairs.append((score, i, j))
    pairs.sort(reverse=True)

    used_mpo = set()
    used_cohort = set()
    matched = []
    for score, i, j in pairs:
        if i in used_mpo or j in used_cohort:
            continue
        used_mpo.add(i)
        used_cohort.add(j)
        matched.append((mpo_projects[i]["display"], cohort_entries[j]["name"]))

    mpo_only = [
        m["display"] for i, m in enumerate(mpo_projects)
        if i not in used_mpo
    ]
    cohort_only = [
        c["name"] for j, c in enumerate(cohort_entries)
        if j not in used_cohort
    ]

    return {
        "status": "success",
        "matched": matched,
        "mpo_only": mpo_only,
        "cohort_only": cohort_only,
        "mpo_count": mpo_result.get("count", 0),
        "cohort_count": len(cohort_entries),
    }


def check_url_with_wayback(url, timeout=10):
    """Test if URL is reachable. If not, fall back to the Wayback Machine
    and return the closest archived snapshot if one exists.

    Returns dict with `status` one of:
      - "live": URL returned 2xx or 3xx
      - "broken_with_archive": URL unreachable, Wayback snapshot found
      - "broken_no_archive": URL unreachable, no Wayback snapshot
      - "error": Request failed for a reason other than HTTP status
    Optional fields: `http_code`, `wayback_url`, `wayback_timestamp`,
    `error`.
    """
    headers = {"User-Agent": "Mozilla/5.0 (Canada Under Carney monthly fetch)"}
    is_live = False
    http_code = None
    try:
        # Some sites 405 on HEAD, so use GET but with a short timeout and
        # we don't actually consume the body for size reasons.
        resp = requests.get(url, timeout=timeout, headers=headers, stream=True, allow_redirects=True)
        http_code = resp.status_code
        resp.close()
        if 200 <= resp.status_code < 400:
            is_live = True
    except Exception:
        pass

    if is_live:
        return {"status": "live", "http_code": http_code}

    # Distinguish 403 (likely bot-blocked but page exists) from 404 (gone).
    # 403 is logged as "blocked" so an editor knows the page may still
    # load in a real browser.
    bot_blocked = http_code == 403

    # URL appears broken or blocked — try Wayback availability API
    try:
        wb = requests.get(
            "http://archive.org/wayback/available",
            params={"url": url},
            timeout=15,
            headers=headers,
        )
        if wb.status_code == 200:
            data = wb.json()
            closest = (data.get("archived_snapshots") or {}).get("closest") or {}
            if closest.get("available"):
                return {
                    "status": "blocked_with_archive" if bot_blocked else "broken_with_archive",
                    "http_code": http_code,
                    "wayback_url": closest.get("url"),
                    "wayback_timestamp": closest.get("timestamp"),
                }
        return {
            "status": "blocked_no_archive" if bot_blocked else "broken_no_archive",
            "http_code": http_code,
        }
    except Exception as e:
        return {"status": "error", "http_code": http_code, "error": str(e)}


def collect_all_cited_urls(dimensions):
    """Walk every cited URL across dim sources, gradeTriggers, promise
    sources, and projectCohort projects. Returns a de-duplicated list
    of {label, url, context} dicts."""
    entries = []

    def add(label, url, context):
        if url and isinstance(url, str) and url.startswith("http"):
            entries.append({"label": label, "url": url, "context": context})

    for dim in dimensions:
        name = dim.get("name", "?")
        for s in dim.get("sources") or []:
            add(f"{name}: {s.get('label','?')}", s.get("url"), "dim-source")
        triggers = dim.get("gradeTriggers") or {}
        for side in ("up", "down"):
            for t in triggers.get(side) or []:
                if isinstance(t, dict):
                    add(
                        f"{name}: {side} trigger - {t.get('sourceLabel','?')}",
                        t.get("sourceUrl"),
                        f"trigger-{side}",
                    )
        for p in dim.get("promises") or []:
            add(
                f"{name}: promise originalSource ({(p.get('text') or '?')[:40]})",
                p.get("originalSourceUrl"),
                "originalSourceUrl",
            )
            add(
                f"{name}: promise statusSource ({(p.get('text') or '?')[:40]})",
                p.get("statusSourceUrl"),
                "statusSourceUrl",
            )
        cohort = dim.get("projectCohort") or {}
        for proj in cohort.get("projects") or []:
            add(f"{name}: project {proj.get('name','?')}", proj.get("sourceUrl"), "cohort-project")

    seen = set()
    deduped = []
    for entry in entries:
        if entry["url"] in seen:
            continue
        seen.add(entry["url"])
        deduped.append(entry)
    return deduped


def link_rot_scan(dimensions, workers=8):
    """Run link-rot scan with Wayback fallback against every cited URL.
    Uses a small thread pool to keep total wall-clock under 30 seconds
    for ~150 URLs. Returns the results list with each entry annotated
    by check_url_with_wayback."""
    cited = collect_all_cited_urls(dimensions)
    results = []
    with ThreadPoolExecutor(max_workers=workers) as pool:
        future_to_entry = {pool.submit(check_url_with_wayback, e["url"]): e for e in cited}
        for fut in as_completed(future_to_entry):
            entry = future_to_entry[fut]
            try:
                check = fut.result()
            except Exception as e:
                check = {"status": "error", "error": str(e)}
            results.append({**entry, **check})
    return results


def collect_cited_pbo_urls(dimensions):
    """Return lowercase set of PBO URLs currently cited in dimensions.json.

    Walks dim sources, gradeTriggers (up + down), and promise source URLs.
    Used by the fetch report to mark RSS items as [CITED] vs [NEW].
    """
    cited = set()

    def add(url):
        if url and "pbo-dpb.ca" in url.lower():
            cited.add(url.lower().rstrip("/"))

    for dim in dimensions:
        for s in dim.get("sources") or []:
            add(s.get("url"))
        triggers = dim.get("gradeTriggers") or {}
        for side in ("up", "down"):
            for t in triggers.get(side) or []:
                if isinstance(t, dict):
                    add(t.get("sourceUrl"))
        for p in dim.get("promises") or []:
            add(p.get("originalSourceUrl"))
            add(p.get("statusSourceUrl"))

    return cited


def load_dimensions():
    """Load current dimensions.json."""
    with open(DIMENSIONS_FILE, "r") as f:
        return json.load(f)


def get_dimension_label(dim):
    """Return the public scoring label for graded dimensions and trackers."""
    if dim.get("excludeFromGPA"):
        label = "Tracker: no letter grade"
        informational_grade = dim.get("informationalGrade")
        if informational_grade:
            label += f" (informational {informational_grade})"
        return label

    grade = dim.get("grade")
    if grade:
        return f"Grade: {grade}"

    return "Grade: unavailable"


def generate_fetch_report(dimensions, results):
    """Generate a human-readable fetch report."""
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    lines = [
        f"{'=' * 60}",
        f"  DATA FETCH REPORT — {now}",
        f"{'=' * 60}",
        "",
        "This report shows which data sources were checked and their",
        "current status. Use this to identify metrics that need updating.",
        "",
    ]

    # StatCan tables
    lines.append("STATISTICS CANADA TABLES")
    lines.append("-" * 40)
    for key, info in STATCAN_VECTORS.items():
        result = results.get(f"statcan_{key}", {})
        status = result.get("status", "not checked")
        lines.append(f"  [{key}] {info['description']}")
        lines.append(f"    Table: {info['pid']}")
        lines.append(f"    Status: {status}")
        lines.append(f"    URL: {info['url']}")
        lines.append("")

    # IRCC data
    lines.append("IRCC OPEN DATA")
    lines.append("-" * 40)
    for key, info in IRCC_DATASETS.items():
        result = results.get(f"ircc_{key}", {})
        status = result.get("status", "not checked")
        rows = result.get("rows", "?")
        lines.append(f"  [{key}] {info['description']}")
        lines.append(f"    Status: {status} ({rows} rows)")
        if result.get("last_row"):
            lines.append(f"    Latest row: {result['last_row'][:100]}")
        lines.append("")

    # Bank of Canada
    lines.append("BANK OF CANADA")
    lines.append("-" * 40)
    boc = results.get("boc_fx", {})
    lines.append(f"  [exchange_rate] CAD/USD")
    lines.append(f"    Status: {boc.get('status', 'not checked')}")
    if boc.get("latest"):
        lines.append(f"    Latest: {boc['latest']}")
    lines.append("")

    # PBO recent publications via RSS feed
    lines.append("PARLIAMENTARY BUDGET OFFICER (RSS feed)")
    lines.append("-" * 40)
    pbo = results.get("pbo_feed", {})
    if pbo.get("status") == "success":
        cited_pbo = collect_cited_pbo_urls(dimensions)
        new_count = sum(
            1 for pub in pbo.get("publications", [])
            if pub.get("link", "").lower().rstrip("/") not in cited_pbo
        )
        lines.append(
            f"  Status: success ({pbo['count']} recent publications, {new_count} not yet cited)"
        )
        lines.append("")
        lines.append("  Recent PBO publications (newest first):")
        lines.append("")
        for pub in pbo.get("publications", []):
            normalized = pub.get("link", "").lower().rstrip("/")
            marker = "[CITED]" if normalized in cited_pbo else "[NEW]  "
            title = pub.get("title", "(untitled)")[:88]
            lines.append(f"    {marker} {title}")
            if pub.get("pubDate"):
                lines.append(f"             Published: {pub['pubDate']}")
            if pub.get("link"):
                lines.append(f"             URL: {pub['link']}")
            lines.append("")
    else:
        lines.append(f"  Status: {pbo.get('status', 'not checked')}")
        if pbo.get("error"):
            lines.append(f"  Error: {pbo['error']}")
        elif pbo.get("code"):
            lines.append(f"  HTTP code: {pbo['code']}")
    lines.append("")

    # Pollster RSS surfaces
    lines.append("POLLSTER RSS FEEDS")
    lines.append("-" * 40)
    pollster_data = results.get("pollster_feeds") or []
    if not pollster_data:
        lines.append("  No pollster feeds checked.")
    else:
        for entry in pollster_data:
            lines.append(f"  {entry['pollster']} ({entry['url']})")
            if entry.get("status") != "success":
                lines.append(f"    Status: {entry.get('status','?')}")
                if entry.get("error"):
                    lines.append(f"    Error: {entry['error']}")
                lines.append("")
                continue
            lines.append(
                f"    Status: success ({entry.get('all_count', 0)} recent posts, "
                f"{entry.get('relevant_count', 0)} approval-relevant, "
                f"{entry.get('new_count', 0)} not yet cited in approval-polls.json)"
            )
            for item in entry.get("items", []):
                marker = "[CITED]" if item.get("is_cited") else "[NEW]  "
                lines.append(f"    {marker} {item.get('title','(untitled)')[:84]}")
                if item.get("pubDate"):
                    lines.append(f"             Published: {item['pubDate']}")
                if item.get("link"):
                    lines.append(f"             URL: {item['link']}")
                lines.append("")
    lines.append("")

    # Excluded-pollster quarterly revisit — Pollara, Ipsos, Innovative
    lines.append("EXCLUDED POLLSTER RSS FEEDS (quarterly revisit)")
    lines.append("-" * 40)
    excluded_data = results.get("excluded_pollster_feeds") or []
    if not excluded_data:
        lines.append("  No excluded pollster feeds checked.")
    else:
        lines.append(
            "  Surfaces federal-approval-relevant posts from pollsters NOT"
        )
        lines.append(
            "  currently cited. Editor decides each cycle whether to add."
        )
        lines.append(
            "  Mainstreet Research and EKOS Politics: no public RSS — manual."
        )
        lines.append("")
        for entry in excluded_data:
            lines.append(f"  {entry['pollster']} ({entry['url']})")
            if entry.get("status") != "success":
                lines.append(f"    Status: {entry.get('status','?')}")
                if entry.get("error"):
                    lines.append(f"    Error: {entry['error']}")
                lines.append("")
                continue
            lines.append(
                f"    Status: success ({entry.get('all_count', 0)} recent posts, "
                f"{entry.get('relevant_count', 0)} approval-relevant)"
            )
            for item in entry.get("items", []):
                lines.append(f"    [REVIEW] {item.get('title','(untitled)')[:80]}")
                if item.get("pubDate"):
                    lines.append(f"             Published: {item['pubDate']}")
                if item.get("link"):
                    lines.append(f"             URL: {item['link']}")
                lines.append("")
    lines.append("")

    # Policy / academic / journalism RSS feeds
    lines.append("POLICY / ACADEMIC / JOURNALISM RSS FEEDS")
    lines.append("-" * 40)
    policy_data = results.get("policy_feeds") or []
    if not policy_data:
        lines.append("  No policy feeds checked.")
    else:
        lines.append(
            "  Surfaces recent items from independent policy / academic /"
        )
        lines.append(
            "  journalism publishers. [TOPIC] flags dashboard-relevant"
        )
        lines.append(
            "  themes; [OTHER] is surfaced for completeness. CCI, IISD,"
        )
        lines.append(
            "  Conversation Canada, CBC, Globe and Mail, National Observer:"
        )
        lines.append(
            "  not yet automated (HTML challenge / atom / paywall / firehose)."
        )
        lines.append("")
        for entry in policy_data:
            lines.append(f"  {entry['publisher']} ({entry['url']})")
            if entry.get("status") != "success":
                lines.append(f"    Status: {entry.get('status','?')}")
                if entry.get("error"):
                    lines.append(f"    Error: {entry['error']}")
                lines.append("")
                continue
            lines.append(
                f"    Status: success ({entry.get('count', 0)} recent items, "
                f"{entry.get('topic_count', 0)} topic-relevant)"
            )
            for item in entry.get("items", []):
                marker = "[TOPIC]" if item.get("topic_match") else "[OTHER]"
                lines.append(f"    {marker} {item.get('title','(untitled)')[:78]}")
                if item.get("pubDate"):
                    lines.append(f"            Published: {item['pubDate']}")
                if item.get("link"):
                    lines.append(f"            URL: {item['link']}")
                lines.append("")
    lines.append("")

    # LEGISinfo bill status for tracked parl.ca bills
    lines.append("LEGISINFO (Parliament bill status)")
    lines.append("-" * 40)
    legisinfo = results.get("legisinfo") or []
    if not legisinfo:
        lines.append("  No parl.ca bills currently cited in dimensions.json.")
    else:
        lines.append(f"  Bills tracked: {len(legisinfo)}")
        lines.append("")
        for entry in legisinfo:
            rec = entry.get("record", {})
            if rec.get("status") != "success":
                lines.append(
                    f"  [{entry['bill'].upper()}, Parl {entry['parl']}]  fetch failed: "
                    f"{rec.get('status','?')}"
                )
                continue
            lines.append(
                f"  [{rec.get('number_code', entry['bill'].upper())}, Parl {entry['parl']}]  "
                f"{rec.get('short_title','(no short title)')[:80]}"
            )
            if rec.get("current_status"):
                lines.append(f"    Current status: {rec['current_status']}")
            if rec.get("latest_stage"):
                lines.append(f"    Latest completed stage: {rec['latest_stage']}")
            if rec.get("ongoing_stage"):
                lines.append(f"    Ongoing stage: {rec['ongoing_stage']}")
            if rec.get("first_reading"):
                lines.append(f"    First reading: {rec['first_reading']}")
            if rec.get("royal_assent"):
                lines.append(f"    Royal assent: {rec['royal_assent']}")
            cite_dims = sorted({c["dim"] for c in entry["citations"]})
            lines.append(
                f"    Cited in: {', '.join(cite_dims)} ({len(entry['citations'])} place(s))"
            )
            lines.append("")
    lines.append("")

    # Major Projects Office diff
    lines.append("MAJOR PROJECTS OFFICE (page diff)")
    lines.append("-" * 40)
    mpo_page = results.get("mpo_page", {})
    mpo_diff = results.get("mpo_diff", {})
    if mpo_page.get("status") == "success" and mpo_diff.get("status") == "success":
        lines.append(
            f"  MPO page: {mpo_diff['mpo_count']} projects scraped from official list"
        )
        lines.append(
            f"  Dashboard cohort: {mpo_diff['cohort_count']} projects in projectCohort.projects"
        )
        lines.append(f"  Matched: {len(mpo_diff['matched'])}")
        if mpo_diff.get("mpo_only"):
            lines.append("")
            lines.append("  Projects on MPO page but NOT in dashboard cohort (potential additions):")
            for name in mpo_diff["mpo_only"]:
                lines.append(f"    + {name}")
        if mpo_diff.get("cohort_only"):
            lines.append("")
            lines.append("  Projects in dashboard cohort but NOT on MPO page (potential removals):")
            for name in mpo_diff["cohort_only"]:
                lines.append(f"    - {name}")
        if not mpo_diff.get("mpo_only") and not mpo_diff.get("cohort_only"):
            lines.append("")
            lines.append("  Cohort matches the MPO page exactly. No denominator drift.")
    elif mpo_page.get("status") != "success":
        lines.append(f"  MPO page fetch failed: {mpo_page.get('status', 'not checked')}")
        if mpo_page.get("error"):
            lines.append(f"  Error: {mpo_page['error']}")
        elif mpo_page.get("code"):
            lines.append(f"  HTTP code: {mpo_page['code']}")
    else:
        lines.append(f"  MPO diff failed: {mpo_diff.get('error', '?')}")
    lines.append("")

    # Link-rot scan with Wayback fallback (only present when --link-rot was passed)
    if "link_rot" in results:
        lines.append("=" * 60)
        lines.append("  LINK-ROT SCAN (Wayback fallback active)")
        lines.append("=" * 60)
        lines.append("")
        scan = results["link_rot"]
        live = sum(1 for r in scan if r["status"] == "live")
        broken_archive = sum(1 for r in scan if r["status"] == "broken_with_archive")
        broken_no = sum(1 for r in scan if r["status"] == "broken_no_archive")
        blocked_archive = sum(1 for r in scan if r["status"] == "blocked_with_archive")
        blocked_no = sum(1 for r in scan if r["status"] == "blocked_no_archive")
        errors = sum(1 for r in scan if r["status"] == "error")
        lines.append(f"  URLs scanned: {len(scan)}")
        lines.append(f"  Live: {live}")
        lines.append(f"  Broken (404 / 5xx): {broken_archive + broken_no}  ({broken_archive} with Wayback snapshot)")
        lines.append(f"  Blocked (403 — may still load in browser): {blocked_archive + blocked_no}  ({blocked_archive} with Wayback snapshot)")
        lines.append(f"  Errors: {errors}")
        lines.append("")
        non_live = [r for r in scan if r["status"] != "live"]
        if non_live:
            lines.append("  Issues found (review and fix in next cycle):")
            lines.append("")
            for r in sorted(non_live, key=lambda x: (x["status"], x["label"])):
                tag = {
                    "broken_with_archive": "[BROKEN+ARC]",
                    "broken_no_archive":   "[BROKEN]    ",
                    "blocked_with_archive": "[BLOCKED+ARC]",
                    "blocked_no_archive":  "[BLOCKED]   ",
                    "error":                "[ERROR]     ",
                }.get(r["status"], "[?]         ")
                lines.append(f"  {tag} {r['label'][:88]}")
                lines.append(f"           Original URL: {r['url']}")
                if r.get("http_code"):
                    lines.append(f"           HTTP code: {r['http_code']}")
                if r.get("wayback_url"):
                    lines.append(f"           Wayback snapshot ({r.get('wayback_timestamp','?')}): {r['wayback_url']}")
                if r.get("error"):
                    lines.append(f"           Error: {r['error']}")
                lines.append("")
        else:
            lines.append("  All cited URLs returned a live response.")
            lines.append("")

    # Dimension-by-dimension metric status
    lines.append("=" * 60)
    lines.append("  METRIC STATUS BY DIMENSION")
    lines.append("=" * 60)
    lines.append("")

    for dim in dimensions:
        lines.append(f"[{dim['id']}] {dim['name']} - {get_dimension_label(dim)}")
        for m in dim["metrics"]:
            auto = "AUTO" if m.get("automatable") else "MANUAL"
            source = m.get("source", "unknown")
            source_id = m.get("sourceId", "")
            lines.append(f"  {auto:>6} | {m['label']}: {m['value']}")
            if source_id:
                lines.append(f"         Source: {source} ({source_id})")
            else:
                lines.append(f"         Source: {source}")
        lines.append("")

    # Manual update reminders
    lines.append("=" * 60)
    lines.append("  MANUAL UPDATES REQUIRED")
    lines.append("=" * 60)
    lines.append("")
    lines.append("The following metrics require manual checking:")
    lines.append("")

    manual_items = []
    for dim in dimensions:
        for m in dim["metrics"]:
            if not m.get("automatable"):
                manual_items.append(f"  [{dim['id']}] {m['label']}: {m['value']}")

    for item in manual_items:
        lines.append(item)

    lines.append("")
    lines.append("ALWAYS UPDATE MANUALLY:")
    lines.append("  - All grades (editorial judgment per rubric)")
    lines.append("  - All trend arrows (editorial judgment)")
    lines.append("  - All status summaries (editorial judgment)")
    lines.append("  - All promise statuses (editorial judgment)")
    lines.append("  - Fitch/Moody's/S&P ratings (check agency websites)")
    lines.append("  - Approval Signal polls (check Léger, Abacus Data, Ipsos, Angus Reid Institute, Innovative Research Group)")
    lines.append("  - Nanos preferred-PM context (secondary signal only)")
    lines.append("")

    lines.append("NEXT STEPS:")
    lines.append("  1. Review the source URLs above for updated data")
    lines.append("  2. Update values in scripts/output/draft-dimensions.json")
    lines.append("  3. Make grade/trend/status decisions using the rubric")
    lines.append("  4. Copy draft to src/data/dimensions.json")
    lines.append("  5. Update src/data/meta.json (dates)")
    lines.append("  6. Update src/data/changelog.json (what changed)")
    lines.append("  7. Run 'npm run dev' to preview")
    lines.append("  8. Commit and push to deploy")
    lines.append("")

    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="Monthly data fetch for Canada Under Carney")
    parser.add_argument(
        "--link-rot",
        action="store_true",
        help="Run full link-rot scan across every cited URL with Wayback Machine fallback. Adds 30-60s to the run time.",
    )
    args = parser.parse_args()

    print("Canada Under Carney — Monthly Data Fetch")
    print("=" * 45)
    print()

    # Load current data
    if not DIMENSIONS_FILE.exists():
        print(f"ERROR: {DIMENSIONS_FILE} not found")
        sys.exit(1)

    dimensions = load_dimensions()
    print(f"Loaded {len(dimensions)} dimensions from {DIMENSIONS_FILE}")
    print()

    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Fetch data from all sources
    results = {}

    # 1. Check StatCan tables
    print("Checking Statistics Canada tables...")
    for key, info in STATCAN_VECTORS.items():
        print(f"  Checking {key} ({info['pid']})...", end=" ")
        result = fetch_statcan_table_info(info["pid"])
        results[f"statcan_{key}"] = result
        print(result["status"])

    print()

    # 2. Check IRCC data
    print("Checking IRCC open data...")
    for key in IRCC_DATASETS:
        print(f"  Downloading {key}...", end=" ")
        result = fetch_ircc_csv(key)
        results[f"ircc_{key}"] = result
        status = result["status"]
        if status == "success":
            print(f"OK ({result['rows']} rows)")
        else:
            print(f"FAILED ({status})")

    print()

    # 3. Check Bank of Canada
    print("Checking Bank of Canada API...")
    boc_result = check_boc_series()
    results["boc_fx"] = boc_result
    print(f"  Exchange rate: {boc_result['status']}")

    print()

    # 4. Check PBO RSS feed
    print("Checking PBO RSS feed...")
    pbo_result = fetch_pbo_feed(limit=20)
    results["pbo_feed"] = pbo_result
    if pbo_result["status"] == "success":
        cited = collect_cited_pbo_urls(dimensions)
        new_count = sum(
            1 for pub in pbo_result.get("publications", [])
            if pub.get("link", "").lower().rstrip("/") not in cited
        )
        print(
            f"  PBO feed: OK ({pbo_result['count']} recent publications, "
            f"{new_count} not yet cited)"
        )
    else:
        print(f"  PBO feed: FAILED ({pbo_result.get('status', 'unknown')})")

    print()

    # 5. Check pollster RSS feeds for new approval-relevant posts
    print("Checking pollster RSS feeds (Abacus, Léger, Angus Reid Institute)...")
    pollster_results = check_pollster_feeds()
    results["pollster_feeds"] = pollster_results
    for entry in pollster_results:
        if entry.get("status") == "success":
            print(
                f"  {entry['pollster']}: {entry.get('all_count', 0)} recent posts, "
                f"{entry.get('relevant_count', 0)} approval-relevant, "
                f"{entry.get('new_count', 0)} not yet cited"
            )
        else:
            print(f"  {entry['pollster']}: FAILED ({entry.get('status','?')})")

    print()

    # 5b. Check excluded pollsters (quarterly revisit, run each cycle)
    print("Checking excluded pollster RSS feeds (Pollara, Ipsos, Innovative Research)...")
    excluded_results = check_excluded_pollster_feeds()
    results["excluded_pollster_feeds"] = excluded_results
    for entry in excluded_results:
        if entry.get("status") == "success":
            print(
                f"  {entry['pollster']}: {entry.get('all_count', 0)} recent posts, "
                f"{entry.get('relevant_count', 0)} approval-relevant"
            )
        else:
            print(f"  {entry['pollster']}: FAILED ({entry.get('status','?')})")

    print()

    # 5c. Check policy / academic / journalism RSS feeds
    print("Checking policy / academic / journalism RSS feeds...")
    policy_results = check_policy_feeds()
    results["policy_feeds"] = policy_results
    for entry in policy_results:
        if entry.get("status") == "success":
            print(
                f"  {entry['publisher']}: {entry.get('count', 0)} recent posts, "
                f"{entry.get('topic_count', 0)} topic-relevant"
            )
        else:
            print(f"  {entry['publisher']}: FAILED ({entry.get('status','?')})")

    print()

    # 6. Check LEGISinfo bill status for any parl.ca bills cited
    print("Checking LEGISinfo for cited bills...")
    legisinfo_results = check_legisinfo_bills(dimensions)
    results["legisinfo"] = legisinfo_results
    if legisinfo_results:
        for entry in legisinfo_results:
            rec = entry.get("record", {})
            if rec.get("status") == "success":
                print(
                    f"  {rec.get('number_code','?')} (Parl {entry['parl']}): "
                    f"{rec.get('current_status','?')} "
                    f"(cited {len(entry['citations'])}x)"
                )
            else:
                print(
                    f"  {entry['bill'].upper()} (Parl {entry['parl']}): "
                    f"FAILED ({rec.get('status','?')})"
                )
    else:
        print("  No parl.ca bills cited in dimensions.json.")

    print()

    # 7. Check Major Projects Office page denominator
    print("Checking Major Projects Office project list...")
    mpo_page = fetch_mpo_page_projects()
    results["mpo_page"] = mpo_page
    if mpo_page.get("status") == "success":
        diff = diff_mpo_against_cohort(dimensions, mpo_page)
        results["mpo_diff"] = diff
        if diff.get("status") == "success":
            print(
                f"  MPO page: {diff['mpo_count']} projects scraped, "
                f"{len(diff['matched'])} match cohort, "
                f"{len(diff['mpo_only'])} only on MPO, "
                f"{len(diff['cohort_only'])} only in cohort"
            )
        else:
            print(f"  MPO page: scraped but diff failed ({diff.get('error', '?')})")
    else:
        print(f"  MPO page: FAILED ({mpo_page.get('status', 'unknown')})")

    print()

    # 8. Optional link-rot scan with Wayback fallback
    if args.link_rot:
        print("Running link-rot scan with Wayback fallback (this can take 30-60s)...")
        scan = link_rot_scan(dimensions)
        results["link_rot"] = scan
        live = sum(1 for r in scan if r["status"] == "live")
        broken_archive = sum(1 for r in scan if r["status"] == "broken_with_archive")
        broken_no = sum(1 for r in scan if r["status"] == "broken_no_archive")
        blocked_archive = sum(1 for r in scan if r["status"] == "blocked_with_archive")
        blocked_no = sum(1 for r in scan if r["status"] == "blocked_no_archive")
        errors = sum(1 for r in scan if r["status"] == "error")
        print(f"  Scanned {len(scan)} cited URLs.")
        print(f"  Live: {live}")
        print(f"  Broken (404 / 5xx): {broken_archive + broken_no} ({broken_archive} have Wayback snapshot)")
        print(f"  Blocked (403 — may still load in browser): {blocked_archive + blocked_no} ({blocked_archive} have Wayback snapshot)")
        print(f"  Errors: {errors}")
        print()

    # Generate outputs
    # 1. Draft dimensions (copy of current — user edits this)
    draft_path = OUTPUT_DIR / "draft-dimensions.json"
    with open(draft_path, "w") as f:
        json.dump(dimensions, f, indent=2, ensure_ascii=False)
    print(f"Draft dimensions written to {draft_path}")

    # 2. Fetch report
    report = generate_fetch_report(dimensions, results)
    report_path = OUTPUT_DIR / "fetch-report.txt"
    with open(report_path, "w") as f:
        f.write(report)
    print(f"Fetch report written to {report_path}")

    # 3. Draft changelog entry template
    changelog_entry = {
        "date": date.today().isoformat(),
        "summary": f"{date.today().strftime('%B %Y')} update: [DESCRIBE CHANGES HERE]",
        "items": [
            {
                "type": "event",
                "headline": "[WHAT CHANGED]",
                "body": "[PLAIN-LANGUAGE SUMMARY AND SOURCE]",
                "affects": ["[DIMENSION NAME]"],
            }
        ],
    }
    changelog_path = OUTPUT_DIR / "draft-changelog-entry.json"
    with open(changelog_path, "w") as f:
        json.dump(changelog_entry, f, indent=2)
    print(f"Changelog template written to {changelog_path}")

    print()
    print("Done! Next steps:")
    print(f"  1. Read {report_path}")
    print(f"  2. Visit the source URLs to get updated numbers")
    print(f"  3. Edit {draft_path} with new values")
    print(f"  4. Copy to src/data/dimensions.json when ready")
    print()


if __name__ == "__main__":
    main()
