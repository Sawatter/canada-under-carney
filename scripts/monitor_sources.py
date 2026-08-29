#!/usr/bin/env python3
"""Monthly source monitor for Canada Under Carney.

Every cycle this surveys each cited source surface for new dimension-relevant
material, classifies what it finds, and writes an editor-adjudicated candidate
packet. It never moves a grade, threshold, status, or any dashboard data.

It is the relevance/triage layer on top of the deterministic pullers in
scripts/fetch-data.py. The split is deliberate:

  fetch-data.py  --json-out scripts/output/fetch-results.json
        |  (RSS, StatCan WDS, IRCC, BoC, LEGISinfo, MPO, Ethics, link-rot)
        v
  monitor_sources.py
        |  reads those results (deterministic tier),
        |  adds a Tavily search fan-out for feed-less / paywalled / blocked
        |  surfaces, runs a Claude relevance pass, and writes:
        |    - monitoring/state.json                (durable per-source state)
        |    - monitoring/candidates/YYYY-MM.json   (structured candidate ledger)
        |    - docs/Source-Monitoring-Candidates-YYYY-MM.md  (editor packet)
        v
  editor adjudicates. No automatic dashboard change happens.

Tiers degrade safely. With no TAVILY_API_KEY the search fan-out is skipped and
the packet says so. With no ANTHROPIC_API_KEY the relevance pass is skipped and
candidates are carried through unclassified, again noted. --dry-run forces both
off so the whole thing runs offline with no secrets.

Usage:
  python3 scripts/monitor_sources.py --rebuild-registry
  python3 scripts/monitor_sources.py --cycle 2026-06 \
      --fetch-results scripts/output/fetch-results.json
  python3 scripts/monitor_sources.py --dry-run --out-suffix -dryrun \
      --fetch-results scripts/fixtures/fetch-results-sample.json
"""

import argparse
import hashlib
import json
import math
import os
import re
import sys
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import urlparse

# --- Paths ---
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
DATA_DIR = PROJECT_DIR / "src" / "data"
DIMENSIONS_FILE = DATA_DIR / "dimensions.json"
APPROVAL_POLLS_FILE = DATA_DIR / "approval-polls.json"
MONITORING_DIR = PROJECT_DIR / "monitoring"
SOURCES_FILE = MONITORING_DIR / "sources.json"
STATE_FILE = MONITORING_DIR / "state.json"
CANDIDATES_DIR = MONITORING_DIR / "candidates"
DOCS_DIR = PROJECT_DIR / "docs"
DEFAULT_FETCH_RESULTS = SCRIPT_DIR / "output" / "fetch-results.json"

DEFAULT_MODEL = "claude-opus-4-8"
SCHEMA_VERSION = 1
TAVILY_ENDPOINT = "https://api.tavily.com/search"
TAVILY_SEARCH_ATTEMPTS = 2
TAVILY_RETRY_DELAY_SECONDS = 1
NORMAL_SURFACE_THRESHOLD = 0.15
EMAIL_RE = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b")
LOCAL_PATH_RE = re.compile(r"(^|[\s(\"'])((?:/Users|/home)/[^\s)\"']+)")

# These keys mirror the result families always emitted by fetch-data.py. A
# blocked source still emits its result with a non-success status, so strict
# completeness checks structure rather than requiring source access to succeed.
DETERMINISTIC_OBJECT_RESULT_FAMILIES = (
    ("Statistics Canada", (
        "statcan_food_cpi",
        "statcan_unemployment",
        "statcan_population",
        "statcan_housing_starts",
        "statcan_trade",
    )),
    ("IRCC", (
        "ircc_permanent_residents",
        "ircc_work_permits_imp",
        "ircc_work_permits_tfwp",
        "ircc_study_permits",
    )),
    ("Bank of Canada", ("boc_fx",)),
    ("PBO", ("pbo_feed",)),
    ("Major Projects Office", ("mpo_page",)),
    ("Ethics Commissioner", ("ethics_reports_page", "ethics_reports_diff")),
)
DETERMINISTIC_LIST_RESULT_FAMILIES = (
    ("pollster feeds", "pollster_feeds", True),
    ("excluded pollster feeds", "excluded_pollster_feeds", True),
    ("policy feeds", "policy_feeds", True),
    ("LEGISinfo", "legisinfo", False),
)
EXPECTED_DETERMINISTIC_FEED_URLS = {
    "pollster_feeds": {
        "https://abacusdata.ca/feed/",
        "https://leger360.com/en/feed/",
        "https://angusreid.org/feed/",
    },
    "excluded_pollster_feeds": {
        "https://www.pollara.com/feed/",
        "https://www.ipsos.com/en-ca/rss.xml",
        "https://innovativeresearch.ca/feed/",
    },
    "policy_feeds": {
        "https://www.cdhowe.org/feed/",
        "https://www.fraserinstitute.org/rss.xml",
        "https://thehub.ca/feed/",
        "https://democracywatch.ca/feed/",
        "https://proof.utoronto.ca/feed/",
        "https://thenarwhal.ca/feed/",
    },
}

# Monitoring methods a source surface can carry.
VALID_METHODS = {"rss", "api", "sitemap", "page_hash", "search_fanout", "manual"}

# Candidate routing labels the relevance pass may assign. These route a
# candidate to a queue; they never decide a grade.
VALID_CLASSIFICATIONS = {
    "metric_update",
    "trigger_watch",
    "source_balance",
    "promise_status",
    "context",
    "irrelevant",
    "manual_browser_pull",
}

# --- Source-family taxonomy (aligned with scripts/audit-bias-resistance.mjs) ---
FAMILY_NAMES = {
    1: "PMO / governing-party messaging",
    2: "Department / press release",
    3: "Operational government data",
    4: "Independent official / watchdog",
    5: "Procedural parliamentary records",
    6: "Parliamentary committee / critique",
    7: "Policy institute",
    8: "Journalism",
    9: "Academic / research / pollsters",
    10: "International benchmark / rating",
    11: "Industry / sector association",
    0: "Unclassified",
}

# Host -> family number. Longest-suffix match wins. Mirrors the domain lists in
# audit-bias-resistance.mjs so the monitor's registry speaks the same taxonomy
# the bias audit uses.
HOST_FAMILY = {
    "pm.gc.ca": 1,
    "liberal.ca": 1,
    "conservative.ca": 1,
    "ndp.ca": 1,
    "budget.canada.ca": 3,
    "statcan.gc.ca": 3,
    "www150.statcan.gc.ca": 3,
    "ircc.canada.ca": 3,
    "open.canada.ca": 3,
    "cmhc-schl.gc.ca": 3,
    "bankofcanada.ca": 3,
    "ised-isde.canada.ca": 2,
    "tc.canada.ca": 2,
    "international.canada.ca": 2,
    "laws-lois.justice.gc.ca": 3,
    "canada.ca": 2,
    "pbo-dpb.ca": 4,
    "oag-bvg.gc.ca": 4,
    "ethicscanada.ca": 4,
    "prciec-rpccie.parl.gc.ca": 4,
    "cer-rec.gc.ca": 4,
    "parl.ca": 5,
    "ourcommons.ca": 6,
    "sencanada.ca": 6,
    "cdhowe.org": 7,
    "fraserinstitute.org": 7,
    "irpp.org": 7,
    "policyoptions.irpp.org": 7,
    "climateinstitute.ca": 7,
    "iisd.org": 7,
    "democracywatch.ca": 7,
    "thehub.ca": 7,
    "macdonaldlaurier.ca": 7,
    "csls.ca": 7,
    "maytree.com": 7,
    "foodbankscanada.ca": 7,
    "signal49.ca": 7,
    "smartprosperity.ca": 7,
    "thebusinesscouncil.ca": 7,
    "canadacode.org": 11,
    "cbc.ca": 8,
    "theglobeandmail.com": 8,
    "thestar.com": 8,
    "nationalpost.com": 8,
    "thenarwhal.ca": 8,
    "nationalobserver.com": 8,
    "hilltimes.com": 8,
    "financialpost.com": 8,
    "theconversation.com": 8,
    "electricautonomy.ca": 8,
    "proof.utoronto.ca": 9,
    "utoronto.ca": 9,
    "dal.ca": 9,
    "abacusdata.ca": 9,
    "leger360.com": 9,
    "angusreid.org": 9,
    "pollara.com": 9,
    "ipsos.com": 9,
    "innovativeresearch.ca": 9,
    "nanos.co": 9,
    "scotiabank.com": 9,
    "imf.org": 10,
    "oecd.org": 10,
    "nato.int": 10,
    "fitchratings.com": 10,
    "moodys.com": 10,
    "spglobal.com": 10,
    "transparencycanada.ca": 10,
    "cfib-fcei.ca": 11,
    "retailcouncil.org": 11,
    "chba.ca": 11,
}

# Friendly publisher names for common hosts. Fallback is the host itself.
PUBLISHER_NAMES = {
    "pm.gc.ca": "Prime Minister's Office",
    "liberal.ca": "Liberal Party of Canada",
    "budget.canada.ca": "Federal Budget",
    "www150.statcan.gc.ca": "Statistics Canada",
    "statcan.gc.ca": "Statistics Canada",
    "ircc.canada.ca": "Immigration, Refugees and Citizenship Canada",
    "open.canada.ca": "Open Government (IRCC open data)",
    "cmhc-schl.gc.ca": "Canada Mortgage and Housing Corporation",
    "bankofcanada.ca": "Bank of Canada",
    "ised-isde.canada.ca": "Innovation, Science and Economic Development Canada",
    "tc.canada.ca": "Transport Canada",
    "international.canada.ca": "Global Affairs Canada",
    "laws-lois.justice.gc.ca": "Justice Laws (consolidated Acts)",
    "pbo-dpb.ca": "Parliamentary Budget Officer",
    "ethicscanada.ca": "Conflict of Interest and Ethics Commissioner",
    "prciec-rpccie.parl.gc.ca": "Public Registry (Ethics Commissioner)",
    "cer-rec.gc.ca": "Canada Energy Regulator",
    "parl.ca": "Parliament of Canada (LEGISinfo)",
    "ourcommons.ca": "House of Commons",
    "cdhowe.org": "C.D. Howe Institute",
    "fraserinstitute.org": "Fraser Institute",
    "policyoptions.irpp.org": "Policy Options (IRPP)",
    "irpp.org": "Institute for Research on Public Policy",
    "climateinstitute.ca": "Canadian Climate Institute",
    "iisd.org": "International Institute for Sustainable Development",
    "democracywatch.ca": "Democracy Watch",
    "thehub.ca": "The Hub",
    "macdonaldlaurier.ca": "Macdonald-Laurier Institute",
    "csls.ca": "Centre for the Study of Living Standards",
    "maytree.com": "Maytree",
    "foodbankscanada.ca": "Food Banks Canada",
    "signal49.ca": "Signal 49",
    "cbc.ca": "CBC News",
    "theglobeandmail.com": "The Globe and Mail",
    "nationalobserver.com": "Canada's National Observer",
    "thenarwhal.ca": "The Narwhal",
    "theconversation.com": "The Conversation Canada",
    "electricautonomy.ca": "Electric Autonomy Canada",
    "proof.utoronto.ca": "PROOF (food insecurity research)",
    "dal.ca": "Dalhousie University",
    "abacusdata.ca": "Abacus Data",
    "leger360.com": "Leger",
    "angusreid.org": "Angus Reid Institute",
    "scotiabank.com": "Scotiabank Economics",
    "imf.org": "International Monetary Fund",
    "oecd.org": "OECD",
    "nato.int": "NATO",
    "transparencycanada.ca": "Transparency International Canada",
    "retailcouncil.org": "Retail Council of Canada",
    "chba.ca": "Canadian Home Builders' Association",
    "canadacode.org": "Canada Grocery Code",
}

# Hosts (or host+section keys) with a known RSS/Atom feed. Mirrors the feed
# lists in fetch-data.py so the registry method matches what is actually pulled.
RSS_FEEDS = {
    "pbo-dpb.ca": "https://www.pbo-dpb.ca/en/feed.xml",
    "abacusdata.ca": "https://abacusdata.ca/feed/",
    "leger360.com": "https://leger360.com/en/feed/",
    "angusreid.org": "https://angusreid.org/feed/",
    "cdhowe.org": "https://www.cdhowe.org/feed/",
    "fraserinstitute.org": "https://www.fraserinstitute.org/rss.xml",
    "thehub.ca": "https://thehub.ca/feed/",
    "democracywatch.ca": "https://democracywatch.ca/feed/",
    "proof.utoronto.ca": "https://proof.utoronto.ca/feed/",
    "thenarwhal.ca": "https://thenarwhal.ca/feed/",
}

# Hosts pulled by a structured API in fetch-data.py.
API_HOSTS = {
    "www150.statcan.gc.ca",
    "statcan.gc.ca",
    "ircc.canada.ca",
    "open.canada.ca",
    "bankofcanada.ca",
    "parl.ca",
}

# Surface keys checked by a page scrape + diff in fetch-data.py.
PAGE_HASH_SURFACES = {
    "canada.ca/privy-council",  # Major Projects Office project list
    "ethicscanada.ca",  # Ethics Commissioner investigation reports
}


# --------------------------------------------------------------------------- #
# small utilities
# --------------------------------------------------------------------------- #
def now_iso():
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def load_json(path, default=None):
    p = Path(path)
    if not p.exists():
        return default
    return json.loads(p.read_text())


def write_json(path, data):
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")


def sha256_short(text):
    return hashlib.sha256(text.encode("utf-8")).hexdigest()[:8]


def scrub_public_text(value):
    """Remove identity-scan tripwires from generated free text.

    Source-monitor snippets can include public contact emails or copied local
    paths. They are not useful evidence, and they make the repo's public-safety
    scans noisy, so redact them before writing packets or ledgers.
    """
    text = "" if value is None else str(value)
    text = EMAIL_RE.sub("[email redacted]", text)
    return LOCAL_PATH_RE.sub(lambda m: f"{m.group(1)}[local path redacted]", text)


def host_of(url):
    try:
        host = (urlparse(url).hostname or "").lower()
    except Exception:
        return ""
    if host.startswith("www."):
        host = host[4:]
    return host


def family_for_host(host):
    if not host:
        return 0
    # exact, then longest registrable-suffix match
    if host in HOST_FAMILY:
        return HOST_FAMILY[host]
    parts = host.split(".")
    for i in range(len(parts)):
        suffix = ".".join(parts[i:])
        if suffix in HOST_FAMILY:
            return HOST_FAMILY[suffix]
    return 0


def surface_key(url):
    """A monitoring surface is one host. The one exception is the bare
    www.canada.ca umbrella, which carries many unrelated department sections, so
    we split it by the first department path segment (Finance vs ECCC vs ...).
    Dedicated subdomains like budget.canada.ca or ircc.canada.ca are already
    one surface and are not split."""
    host = host_of(url)
    if not host:
        return ""
    if host == "canada.ca":
        try:
            path = urlparse(url).path or ""
        except Exception:
            path = ""
        segs = [s for s in path.split("/") if s]
        # drop a leading language segment
        if segs and segs[0] in ("en", "fr"):
            segs = segs[1:]
        if segs:
            return f"{host}/{segs[0]}"
    return host


def slugify(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def normalize_url(url):
    """Stable URL key for cross-surface dedupe.

    Search fan-out can find the same page through multiple source surfaces
    (especially broad hosts such as canada.ca). Dedupe by URL, not by source id.
    """
    if not url:
        return ""
    try:
        parsed = urlparse(url.strip())
    except Exception:
        return (url or "").strip().lower().rstrip("/")
    scheme = (parsed.scheme or "https").lower()
    host = (parsed.hostname or "").lower()
    if host.startswith("www."):
        host = host[4:]
    path = (parsed.path or "").rstrip("/")
    query = f"?{parsed.query}" if parsed.query else ""
    if host:
        return f"{scheme}://{host}{path}{query}"
    return (url or "").strip().lower().rstrip("/")


def parse_dateish(value):
    if not value:
        return None
    text = str(value)
    match = re.search(r"(20\d{2})[-/](\d{1,2})[-/](\d{1,2})", text)
    if not match:
        return None
    try:
        return datetime(int(match.group(1)), int(match.group(2)), int(match.group(3))).date()
    except ValueError:
        return None


# Friendly names for www.canada.ca department sections (first path segment).
CANADA_CA_DEPTS = {
    "department-finance": "Department of Finance (canada.ca)",
    "environment-climate-change": "Environment and Climate Change Canada (canada.ca)",
    "housing-infrastructure-communities": "Housing, Infrastructure and Communities Canada (canada.ca)",
    "immigration-refugees-citizenship": "Immigration, Refugees and Citizenship Canada (canada.ca)",
    "natural-resources-canada": "Natural Resources Canada (canada.ca)",
    "treasury-board-secretariat": "Treasury Board Secretariat (canada.ca)",
    "intergovernmental-affairs": "Intergovernmental Affairs (canada.ca)",
    "revenue-agency": "Canada Revenue Agency (canada.ca)",
    "privy-council": "Privy Council / Major Projects Office (canada.ca)",
    "auditor-general": "Auditor General references (canada.ca)",
    "climateaction": "Climate action (canada.ca)",
    "services": "Services (canada.ca)",
    "campaign": "Campaign pages (canada.ca)",
}


def publisher_for(host, surface):
    if host in PUBLISHER_NAMES:
        return PUBLISHER_NAMES[host]
    if surface in PUBLISHER_NAMES:
        return PUBLISHER_NAMES[surface]
    if surface.startswith("canada.ca/"):
        seg = surface.split("/", 1)[1]
        return CANADA_CA_DEPTS.get(seg, f"{seg.replace('-', ' ').title()} (canada.ca)")
    return host or surface


def method_for(surface, host):
    if host in RSS_FEEDS or surface in RSS_FEEDS:
        return "rss"
    if surface in PAGE_HASH_SURFACES:
        return "page_hash"
    if host in API_HOSTS:
        return "api"
    return "search_fanout"


# --------------------------------------------------------------------------- #
# registry builder  (--rebuild-registry)
# --------------------------------------------------------------------------- #
def _dimension_urls(dim):
    """Yield (url, dimension_id) for every cited URL on one dimension."""
    dim_id = dim.get("id")
    for s in dim.get("sources", []) or []:
        if s.get("url"):
            yield s["url"], dim_id
    for side in ("up", "down"):
        for t in (dim.get("gradeTriggers", {}) or {}).get(side, []) or []:
            if t.get("sourceUrl"):
                yield t["sourceUrl"], dim_id
            for a in t.get("additionalSources", []) or []:
                if a.get("url"):
                    yield a["url"], dim_id
    for m in dim.get("metrics", []) or []:
        for ref in m.get("sourceRefs", []) or []:
            if ref.get("url"):
                yield ref["url"], dim_id
    for p in dim.get("promises", []) or []:
        for key in ("originalSourceUrl", "statusSourceUrl"):
            if p.get(key):
                yield p[key], dim_id
    cohort = dim.get("projectCohort", {}) or {}
    for proj in cohort.get("projects", []) or []:
        if proj.get("sourceUrl"):
            yield proj["sourceUrl"], dim_id


def build_registry(dimensions, approval_polls):
    """Build the source registry from cited URLs in dimensions.json and the
    pollster URLs in approval-polls.json. The dimension mapping is read from the
    data, not guessed, so the registry stays faithful to what is actually cited."""
    surfaces = {}  # surface_key -> record

    def touch(url, dim_id):
        sk = surface_key(url)
        if not sk:
            return
        host = host_of(url)
        rec = surfaces.get(sk)
        if rec is None:
            fam = family_for_host(host)
            rec = {
                "id": slugify(sk),
                "publisher": publisher_for(host, sk),
                "homeUrl": f"https://{host}/" if host else url,
                "family": fam,
                "familyName": FAMILY_NAMES.get(fam, "Unclassified"),
                "dimensions": set(),
                "method": method_for(sk, host),
                "feedUrl": RSS_FEEDS.get(host) or RSS_FEEDS.get(sk),
                "searchDomains": [host] if host else [],
                "citedUrls": set(),
                "accessNote": None,
            }
            surfaces[sk] = rec
        if dim_id:
            rec["dimensions"].add(dim_id)
        rec["citedUrls"].add(url)

    for dim in dimensions:
        for url, dim_id in _dimension_urls(dim):
            touch(url, dim_id)

    # pollster surfaces feed the Approval Signal card (not a graded dimension)
    polls = approval_polls or {}
    poll_lists = [polls.get("polls", []) or []]
    pref = polls.get("preferredPM", {}) or {}
    poll_lists.append(pref.get("polls", []) or [])
    for plist in poll_lists:
        for poll in plist:
            if poll.get("sourceUrl"):
                touch(poll["sourceUrl"], "approval-signal")

    # known access frictions, recorded so the monitor does not pretend a blocked
    # surface was cleanly checked
    access_notes = {
        "prciec-rpccie.parl.gc.ca": "Host intermittently returns 403/503 to command-line fetchers; browser pull may be needed.",
        "theglobeandmail.com": "Paywalled. Search snippets are provisional discovery only.",
        "nationalobserver.com": "Paywalled. Search snippets are provisional discovery only.",
    }

    out = []
    for sk in sorted(surfaces.keys()):
        rec = surfaces[sk]
        host = host_of(next(iter(rec["citedUrls"])))
        rec["dimensions"] = sorted(rec["dimensions"])
        rec["citedUrls"] = sorted(rec["citedUrls"])
        rec["accessNote"] = access_notes.get(host) or access_notes.get(sk)
        out.append(rec)

    return {
        "schemaVersion": SCHEMA_VERSION,
        "generatedAt": now_iso(),
        "generatedFrom": "src/data/dimensions.json + src/data/approval-polls.json",
        "note": (
            "Registry of monitored source surfaces. Regenerate with "
            "`python3 scripts/monitor_sources.py --rebuild-registry` when the "
            "cited source base changes. Hand-edits to access notes, methods, or "
            "search domains are preserved only if you re-apply them after a "
            "rebuild. The monitor never moves grades."
        ),
        "methods": sorted(VALID_METHODS),
        "sources": out,
    }


# --------------------------------------------------------------------------- #
# per-source state
# --------------------------------------------------------------------------- #
def empty_source_state():
    return {
        "lastChecked": None,
        "lastSuccessfulCheck": None,
        "contentHash": None,
        "etag": None,
        "lastModified": None,
        "lastSurfacedCandidateId": None,
        "lastSurfacedFingerprint": None,
        "surfacedFingerprints": [],
        "accessIssue": None,
    }


def load_state(path=STATE_FILE):
    state = load_json(path)
    if not state:
        state = {"schemaVersion": SCHEMA_VERSION, "lastRun": None, "sources": {}}
    state.setdefault("sources", {})
    return state


def mark_checked(state, source_id, ok, content_hash=None, access_issue=None):
    s = state["sources"].setdefault(source_id, empty_source_state())
    stamp = now_iso()
    s["lastChecked"] = stamp
    if ok:
        s["lastSuccessfulCheck"] = stamp  # only advanced on success
        if content_hash is not None:
            s["contentHash"] = content_hash
        s["accessIssue"] = None
    else:
        s["accessIssue"] = access_issue or "fetch failed"
    return s


def already_surfaced(state, candidate):
    """Return true when the same source signal was already shown before.

    Candidate ids include the cycle month, so they are packet-local. The
    fingerprint stays stable across cycles for the same source / discovery /
    URL / title / snippet combination.
    """
    source_state = (state.get("sources") or {}).get(candidate.get("sourceId")) or {}
    seen = set(source_state.get("surfacedFingerprints") or [])
    fp = candidate.get("candidateFingerprint")
    return bool(fp and fp in seen)


def remember_candidate(state, candidate, limit=80):
    source_id = candidate.get("sourceId")
    fp = candidate.get("candidateFingerprint")
    if not source_id or not fp:
        return
    source_state = state["sources"].setdefault(source_id, empty_source_state())
    fingerprints = list(source_state.get("surfacedFingerprints") or [])
    if fp not in fingerprints:
        fingerprints.append(fp)
    source_state["surfacedFingerprints"] = fingerprints[-limit:]
    source_state["lastSurfacedFingerprint"] = fp
    source_state["lastSurfacedCandidateId"] = candidate.get("candidate_id")


def load_seen_ledger(path):
    """Load candidate fingerprints and URLs from a prior candidate ledger."""
    if not path:
        return {"fingerprints": set(), "urls": set()}
    payload = load_json(path, default={}) or {}
    seen = {"fingerprints": set(), "urls": set()}
    for key in ("candidates", "suppressed"):
        for cand in payload.get(key, []) or []:
            if cand.get("candidateFingerprint"):
                seen["fingerprints"].add(cand["candidateFingerprint"])
            if cand.get("url"):
                seen["urls"].add(normalize_url(cand["url"]))
            if cand.get("normalizedUrl"):
                seen["urls"].add(cand["normalizedUrl"])
    return seen


def already_seen_in_ledger(candidate, seen):
    if not seen:
        return False
    fp = candidate.get("candidateFingerprint")
    url = candidate.get("normalizedUrl") or normalize_url(candidate.get("url"))
    return bool((fp and fp in seen.get("fingerprints", set())) or
                (url and url in seen.get("urls", set())))


# --------------------------------------------------------------------------- #
# deterministic tier  (consume scripts/output/fetch-results.json)
# --------------------------------------------------------------------------- #
def expected_deterministic_coverage(dimensions):
    """Return the URL and bill identities fetch-data.py must inspect."""
    link_urls = set()
    legisinfo = set()
    bill_pattern = re.compile(r"bill/(\d+-\d+)/([cs]-\d+)", re.IGNORECASE)

    def add(url, *, bill=True):
        if not isinstance(url, str) or not url.startswith("http"):
            return
        link_urls.add(url)
        hostname = (urlparse(url).hostname or "").lower()
        if bill and (hostname == "parl.ca" or hostname.endswith(".parl.ca")):
            match = bill_pattern.search(url)
            if match:
                legisinfo.add(f"{match.group(1)}/{match.group(2).lower()}")

    for dimension in dimensions or []:
        for source in dimension.get("sources") or []:
            add(source.get("url"))
        triggers = dimension.get("gradeTriggers") or {}
        for side in ("up", "down"):
            for trigger in triggers.get(side) or []:
                if isinstance(trigger, dict):
                    add(trigger.get("sourceUrl"))
        for promise in dimension.get("promises") or []:
            add(promise.get("originalSourceUrl"))
            add(promise.get("statusSourceUrl"))
        for project in (dimension.get("projectCohort") or {}).get("projects") or []:
            add(project.get("sourceUrl"), bill=False)

    return {"link_urls": link_urls, "legisinfo": legisinfo}


def _coverage_delta(label, expected, actual):
    """Describe a coverage mismatch without putting hundreds of URLs in output."""
    missing = sorted(expected - actual)
    unexpected = sorted(actual - expected)
    if not missing and not unexpected:
        return None
    parts = []
    if missing:
        parts.append(f"{len(missing)} missing ({', '.join(missing[:3])})")
    if unexpected:
        parts.append(f"{len(unexpected)} unexpected ({', '.join(unexpected[:3])})")
    return f"{label} coverage mismatch: {'; '.join(parts)}"


def deterministic_success_shape_errors(results):
    """Require the useful payload fields promised by successful fetch results."""
    errors = []

    def has_text(record, field):
        return (isinstance(record, dict) and isinstance(record.get(field), str) and
                bool(record[field].strip()))

    def has_url(record):
        return has_text(record, "url") and record["url"].startswith("http")

    statcan_keys = DETERMINISTIC_OBJECT_RESULT_FAMILIES[0][1]
    for key in statcan_keys:
        value = results.get(key)
        if not isinstance(value, dict) or value.get("status") != "accessible":
            continue
        if not isinstance(value.get("url"), str) or not value["url"].strip():
            errors.append(f"{key} accessible result is missing url")
        references = value.get("dashboard_references")
        if not isinstance(references, list) or not references:
            errors.append(f"{key} accessible result is missing dashboard_references")
        elif any(
                not has_text(reference, "dimension") or
                not has_text(reference, "label") or
                not has_text(reference, "periodDate")
                for reference in references):
            errors.append(f"{key} dashboard_references contains an unusable entry")
        for field in ("metadata", "freshness"):
            nested = value.get(field)
            if (not isinstance(nested, dict) or
                    not isinstance(nested.get("status"), str) or
                    not nested["status"].strip()):
                errors.append(f"{key} accessible result is missing {field} status")
        metadata = value.get("metadata")
        if isinstance(metadata, dict) and metadata.get("status") == "success":
            product_id = metadata.get("productId")
            if (isinstance(product_id, bool) or not isinstance(product_id, int) or
                    product_id <= 0 or not has_text(metadata, "cubeEndDate") or
                    not has_text(metadata, "releaseTime")):
                errors.append(f"{key} metadata success result is missing cube identity")
        freshness = value.get("freshness")
        if (isinstance(freshness, dict) and
                freshness.get("status") == "newer_data_available" and
                (not has_text(freshness, "cubeEndDate") or
                 not has_text(freshness, "latestDashboardReference"))):
            errors.append(f"{key} newer-data result is missing freshness dates")

    ircc_keys = DETERMINISTIC_OBJECT_RESULT_FAMILIES[1][1]
    for key in ircc_keys:
        value = results.get(key)
        if not isinstance(value, dict):
            continue
        status = value.get("status")
        if status == "malformed_data":
            detail = value.get("error")
            suffix = f": {detail}" if isinstance(detail, str) and detail.strip() else ""
            errors.append(f"{key} returned malformed_data{suffix}")
            continue
        if status != "success":
            continue
        rows = value.get("rows")
        if isinstance(rows, bool) or not isinstance(rows, int) or rows <= 0:
            errors.append(f"{key} success result has no positive row count")
        for field in ("header", "last_row", "latest_period"):
            if not isinstance(value.get(field), str) or not value[field].strip():
                errors.append(f"{key} success result is missing {field}")

    boc = results.get("boc_fx")
    if isinstance(boc, dict) and boc.get("status") == "success":
        latest = boc.get("latest")
        observation = latest.get("FXCADUSD") if isinstance(latest, dict) else None
        if (not isinstance(latest, dict) or
                not isinstance(latest.get("d"), str) or not latest["d"].strip() or
                not isinstance(observation, dict) or
                not isinstance(observation.get("v"), str) or not observation["v"].strip()):
            errors.append("boc_fx success result is missing the latest FXCADUSD observation")

    pbo = results.get("pbo_feed")
    if isinstance(pbo, dict) and pbo.get("status") == "success":
        publications = pbo.get("publications")
        count = pbo.get("count")
        if not isinstance(publications, list) or not publications:
            errors.append("pbo_feed success result has no publications")
        if (isinstance(count, bool) or not isinstance(count, int) or
                not isinstance(publications, list) or count != len(publications)):
            errors.append("pbo_feed success result count does not match publications")
        if isinstance(publications, list) and any(
                not has_text(publication, "title") or
                not has_text(publication, "link") or
                not publication["link"].startswith("http") or
                not has_text(publication, "pubDate")
                for publication in publications):
            errors.append("pbo_feed publications contains an unusable entry")

    mpo_page = results.get("mpo_page")
    if isinstance(mpo_page, dict) and mpo_page.get("status") == "success":
        projects = mpo_page.get("projects")
        count = mpo_page.get("count")
        if not isinstance(projects, list) or not projects:
            errors.append("mpo_page success result has no projects")
        if (isinstance(count, bool) or not isinstance(count, int) or
                not isinstance(projects, list) or count != len(projects)):
            errors.append("mpo_page success result count does not match projects")
        if isinstance(projects, list) and any(
                not has_text(project, "display") or
                not isinstance(project.get("tokens"), list) or
                not project["tokens"] or
                any(not isinstance(token, str) or not token.strip()
                    for token in project["tokens"])
                for project in projects):
            errors.append("mpo_page projects contains an unusable entry")

    mpo_diff = results.get("mpo_diff")
    if isinstance(mpo_diff, dict) and mpo_diff.get("status") == "success":
        for field in ("matched", "mpo_only", "cohort_only"):
            if not isinstance(mpo_diff.get(field), list):
                errors.append(f"mpo_diff success result is missing {field}")
        for field in ("mpo_count", "cohort_count"):
            value = mpo_diff.get(field)
            if isinstance(value, bool) or not isinstance(value, int) or value < 0:
                errors.append(f"mpo_diff success result is missing {field}")
        matched = mpo_diff.get("matched")
        if isinstance(matched, list) and any(
                not isinstance(pair, list) or len(pair) != 2 or
                any(not isinstance(name, str) or not name.strip() for name in pair)
                for pair in matched):
            errors.append("mpo_diff matched contains an unusable entry")
        for field in ("mpo_only", "cohort_only"):
            projects = mpo_diff.get(field)
            if isinstance(projects, list) and any(
                    not has_text(project, "display") or
                    not isinstance(project.get("tokens"), list) or
                    not project["tokens"]
                    for project in projects):
                errors.append(f"mpo_diff {field} contains an unusable entry")
        if (isinstance(matched, list) and
                isinstance(mpo_diff.get("mpo_only"), list) and
                isinstance(mpo_diff.get("mpo_count"), int) and
                mpo_diff["mpo_count"] != len(matched) + len(mpo_diff["mpo_only"])):
            errors.append("mpo_diff mpo_count is inconsistent with project rows")
        if (isinstance(matched, list) and
                isinstance(mpo_diff.get("cohort_only"), list) and
                isinstance(mpo_diff.get("cohort_count"), int) and
                mpo_diff["cohort_count"] != len(matched) + len(mpo_diff["cohort_only"])):
            errors.append("mpo_diff cohort_count is inconsistent with project rows")

    ethics_page = results.get("ethics_reports_page")
    if isinstance(ethics_page, dict) and ethics_page.get("status") == "success":
        reports = ethics_page.get("reports")
        count = ethics_page.get("count")
        if (not isinstance(ethics_page.get("url"), str) or
                not ethics_page["url"].strip()):
            errors.append("ethics_reports_page success result is missing url")
        if not isinstance(reports, list) or not reports:
            errors.append("ethics_reports_page success result has no reports")
        if (isinstance(count, bool) or not isinstance(count, int) or
                not isinstance(reports, list) or count != len(reports)):
            errors.append(
                "ethics_reports_page success result count does not match reports")
        if isinstance(reports, list) and any(
                not has_text(report, "title") or not has_url(report)
                for report in reports):
            errors.append("ethics_reports_page reports contains an unusable entry")

    ethics_diff = results.get("ethics_reports_diff")
    if isinstance(ethics_diff, dict) and ethics_diff.get("status") == "success":
        for field in ("additions", "removals"):
            if not isinstance(ethics_diff.get(field), list):
                errors.append(f"ethics_reports_diff success result is missing {field}")
            elif any(
                    not has_text(report, "title") or not has_url(report)
                    for report in ethics_diff[field]):
                errors.append(
                    f"ethics_reports_diff {field} contains an unusable entry")
        current_count = ethics_diff.get("currentCount")
        if (isinstance(current_count, bool) or not isinstance(current_count, int) or
                current_count < 0):
            errors.append("ethics_reports_diff success result is missing currentCount")
        if not isinstance(ethics_diff.get("priorCacheFound"), bool):
            errors.append("ethics_reports_diff success result is missing priorCacheFound")

    for key in EXPECTED_DETERMINISTIC_FEED_URLS:
        value = results.get(key)
        if not isinstance(value, list):
            continue
        for index, entry in enumerate(value):
            if isinstance(entry, dict) and entry.get("status") == "success":
                items = entry.get("items")
                if not isinstance(items, list):
                    errors.append(f"{key}[{index}] success result is missing items")
                    continue
                if any(
                        not has_text(item, "title") or
                        not has_text(item, "link") or
                        not item["link"].startswith("http")
                        for item in items):
                    errors.append(f"{key}[{index}] items contains an unusable entry")
                if key == "policy_feeds":
                    count = entry.get("count")
                    topic_count = entry.get("topic_count")
                    if (isinstance(count, bool) or not isinstance(count, int) or
                            count != len(items) or isinstance(topic_count, bool) or
                            not isinstance(topic_count, int) or
                            not 0 <= topic_count <= count):
                        errors.append(f"{key}[{index}] success counts are inconsistent")
                else:
                    all_count = entry.get("all_count")
                    relevant_count = entry.get("relevant_count")
                    if (isinstance(all_count, bool) or not isinstance(all_count, int) or
                            isinstance(relevant_count, bool) or
                            not isinstance(relevant_count, int) or
                            relevant_count != len(items) or all_count < relevant_count):
                        errors.append(f"{key}[{index}] success counts are inconsistent")
                    if key == "pollster_feeds":
                        new_count = entry.get("new_count")
                        cited_count = entry.get("cited_count")
                        if (isinstance(new_count, bool) or
                                not isinstance(new_count, int) or
                                isinstance(cited_count, bool) or
                                not isinstance(cited_count, int) or
                                new_count + cited_count != relevant_count):
                            errors.append(
                                f"{key}[{index}] citation counts are inconsistent")

    return errors


def deterministic_payload_errors(payload, *, expected_cycle=None,
                                 require_link_rot=False,
                                 expected_link_urls=None,
                                 expected_legisinfo=None):
    """Return structural errors that make a deterministic run incomplete."""
    if not isinstance(payload, dict):
        return ["fetch-results payload is not an object"]

    errors = []
    generated_at = payload.get("generatedAt")
    if not isinstance(generated_at, str) or not generated_at.strip():
        errors.append("generatedAt is missing")
    else:
        try:
            generated_cycle = datetime.fromisoformat(
                generated_at.replace("Z", "+00:00")).strftime("%Y-%m")
        except ValueError:
            errors.append("generatedAt is not a valid ISO timestamp")
        else:
            payload_cycle = payload.get("cycle")
            if isinstance(payload_cycle, str) and generated_cycle != payload_cycle:
                errors.append(
                    f"generatedAt month {generated_cycle} does not match payload cycle "
                    f"{payload_cycle}")

    payload_cycle = payload.get("cycle")
    if not isinstance(payload_cycle, str) or not payload_cycle.strip():
        errors.append("cycle is missing")
    elif not re.fullmatch(r"\d{4}-(?:0[1-9]|1[0-2])", payload_cycle):
        errors.append(f"cycle is invalid: {payload_cycle}")
    elif expected_cycle and payload_cycle != expected_cycle:
        errors.append(
            f"payload cycle {payload_cycle} does not match requested cycle {expected_cycle}")

    if not isinstance(payload.get("linkRot"), bool):
        errors.append("linkRot completion marker is missing")
    elif require_link_rot and payload.get("linkRot") is not True:
        errors.append("linkRot must be true for strict deterministic acceptance")

    results = payload.get("results")
    if not isinstance(results, dict):
        errors.append("results is not an object")
        return errors
    if not results:
        errors.append("results object is empty")
        return errors

    errors.extend(deterministic_success_shape_errors(results))

    for family, keys in DETERMINISTIC_OBJECT_RESULT_FAMILIES:
        missing = [key for key in keys if key not in results]
        if missing:
            errors.append(f"{family} results missing: {', '.join(missing)}")
        for key in keys:
            if key not in results:
                continue
            value = results[key]
            if not isinstance(value, dict):
                errors.append(f"{key} is not an object")
            elif not isinstance(value.get("status"), str) or not value["status"].strip():
                errors.append(f"{key} status is missing")

    for family, key, require_entries in DETERMINISTIC_LIST_RESULT_FAMILIES:
        if key not in results:
            errors.append(f"{family} results missing: {key}")
            continue
        value = results[key]
        if not isinstance(value, list):
            errors.append(f"{key} is not a list")
            continue
        if require_entries and not value:
            errors.append(f"{key} is empty")
            continue
        if any(not isinstance(entry, dict) for entry in value):
            errors.append(f"{key} contains a non-object result")
            continue
        if key != "legisinfo" and any(
                not isinstance(entry.get("status"), str) or not entry["status"].strip()
                for entry in value):
            errors.append(f"{key} contains a result without status")

        expected_feeds = EXPECTED_DETERMINISTIC_FEED_URLS.get(key)
        if expected_feeds is not None:
            actual_feeds = {
                entry.get("url") for entry in value
                if isinstance(entry.get("url"), str) and entry.get("url")
            }
            mismatch = _coverage_delta(key, expected_feeds, actual_feeds)
            if mismatch:
                errors.append(mismatch)

    legisinfo = results.get("legisinfo")
    if isinstance(legisinfo, list) and all(isinstance(entry, dict) for entry in legisinfo):
        actual_legisinfo = {
            f"{entry.get('parl')}/{str(entry.get('bill') or '').lower()}"
            for entry in legisinfo if entry.get("parl") and entry.get("bill")
        }
        if len(actual_legisinfo) != len(legisinfo):
            errors.append("legisinfo contains missing or duplicate bill identities")
        if any(
                not isinstance(entry.get("record"), dict) or
                not isinstance(entry["record"].get("status"), str) or
                not entry["record"]["status"].strip()
                for entry in legisinfo):
            errors.append("legisinfo contains a result without record status")
        if any(
                entry.get("record", {}).get("status") == "success" and (
                    not isinstance(entry["record"].get("url"), str) or
                    not entry["record"]["url"].startswith("http") or
                    not isinstance(entry["record"].get("number_code"), str) or
                    not entry["record"]["number_code"].strip() or
                    not isinstance(entry["record"].get("current_status"), str) or
                    not entry["record"]["current_status"].strip()
                )
                for entry in legisinfo):
            errors.append("legisinfo contains an unusable successful record")
        if expected_legisinfo is not None:
            mismatch = _coverage_delta(
                "legisinfo", set(expected_legisinfo), actual_legisinfo)
            if mismatch:
                errors.append(mismatch)

    mpo_page = results.get("mpo_page")
    mpo_diff = results.get("mpo_diff")
    if isinstance(mpo_page, dict) and mpo_page.get("status") == "success":
        if not isinstance(mpo_diff, dict):
            errors.append("mpo_diff is missing after a successful MPO page fetch")
        elif not isinstance(mpo_diff.get("status"), str) or not mpo_diff["status"].strip():
            errors.append("mpo_diff status is missing")
    elif mpo_diff is not None and not isinstance(mpo_diff, dict):
        errors.append("mpo_diff is not an object")

    if payload.get("linkRot") is True:
        link_rot = results.get("link_rot")
        if not isinstance(link_rot, list):
            errors.append("link_rot results are missing")
        elif not link_rot:
            errors.append("link_rot results are empty")
        elif any(not isinstance(entry, dict) for entry in link_rot):
            errors.append("link_rot contains a non-object result")
        elif any(not isinstance(entry.get("status"), str) or not entry["status"].strip()
                 for entry in link_rot):
            errors.append("link_rot contains a result without status")
        else:
            actual_link_urls = {
                entry.get("url") for entry in link_rot
                if isinstance(entry.get("url"), str) and entry.get("url")
            }
            if len(actual_link_urls) != len(link_rot):
                errors.append("link_rot contains missing or duplicate URL identities")
            if expected_link_urls is not None:
                mismatch = _coverage_delta(
                    "link_rot", set(expected_link_urls), actual_link_urls)
                if mismatch:
                    errors.append(mismatch)

    return errors


def _candidate(cycle, source_id, discovery, title, url, snippet,
               published=None, provisional=False, dims=None):
    clean_title = scrub_public_text(title).strip()[:300]
    clean_snippet = scrub_public_text(snippet).strip()[:600]
    basis = f"{source_id}|{url}|{clean_title}"
    fingerprint_basis = f"{source_id}|{discovery}|{url}|{clean_title}|{clean_snippet}"
    cid = f"{cycle}-{source_id}-{sha256_short(basis)}"
    return {
        "candidate_id": cid,
        "candidateFingerprint": sha256_short(fingerprint_basis),
        "sourceId": source_id,
        "discovery": discovery,
        "title": clean_title,
        "url": url,
        "normalizedUrl": normalize_url(url),
        "publishedDate": published,
        "snippet": clean_snippet,
        "provisional": provisional,
        "sourceRelationship": None,
        "timingConfidence": None,
        # filled by the relevance pass; defaults keep the safety invariant true
        "classification": None,
        "affected_dimensions": sorted(dims) if dims else [],
        "relevance_score": None,
        "reason": None,
        "evidence_limitations": None,
        "requires_editor_review": True,
        "can_move_grade_automatically": False,
    }


def _registry_index(registry):
    return {s["id"]: s for s in registry.get("sources", [])}


def registry_url_host_sets(registry):
    cited_urls = set()
    hosts = set()
    for src in registry.get("sources", []) or []:
        for url in src.get("citedUrls", []) or []:
            cited_urls.add(normalize_url(url))
            h = host_of(url)
            if h:
                hosts.add(h)
        for h in src.get("searchDomains", []) or []:
            h = (h or "").lower()
            if h.startswith("www."):
                h = h[4:]
            if h:
                hosts.add(h)
    return cited_urls, hosts


def load_adjacent_authorities(path):
    data = load_json(path, default={}) or {}
    hosts_by_dim = {}
    for dim_id, hosts in data.items():
        cleaned = []
        for h in hosts or []:
            host = str(h).strip().lower()
            if host.startswith("www."):
                host = host[4:]
            if host:
                cleaned.append(host)
        if cleaned:
            hosts_by_dim[dim_id] = sorted(set(cleaned))
    return hosts_by_dim


def adjacent_registry_entries(adjacent_by_dim, existing_registry):
    existing_hosts = set()
    for src in existing_registry.get("sources", []) or []:
        for h in src.get("searchDomains", []) or []:
            host = (h or "").lower()
            if host.startswith("www."):
                host = host[4:]
            if host:
                existing_hosts.add(host)

    entries = []
    for dim_id, hosts in sorted(adjacent_by_dim.items()):
        for host in hosts:
            if host in existing_hosts:
                continue
            fam = family_for_host(host)
            entries.append({
                "id": f"adjacent-{slugify(dim_id)}-{slugify(host)}",
                "publisher": publisher_for(host, host),
                "homeUrl": f"https://{host}/",
                "family": fam,
                "familyName": FAMILY_NAMES.get(fam, "Unclassified"),
                "dimensions": [dim_id],
                "method": "search_fanout",
                "feedUrl": None,
                "searchDomains": [host],
                "citedUrls": [],
                "accessNote": "Adjacent authority allowlist; not currently cited.",
                "adjacentAuthority": True,
            })
    return entries


def month_label(start_date):
    if not start_date:
        return "window"
    return start_date.strftime("%B")


_MONTH_TO_NUM = {}
for _i, _name in enumerate(
        ["january", "february", "march", "april", "may", "june", "july",
         "august", "september", "october", "november", "december"], start=1):
    _MONTH_TO_NUM[_name] = _i
    _MONTH_TO_NUM[_name[:3]] = _i


def derive_candidate_date(candidate):
    """Best-effort (date, month_only) for a candidate.

    Tavily frequently returns no publishedDate, which would leave every item
    `date-unclear`. Fall back to the date embedded in the URL path (/YYYY/MM/)
    and then to a date in the title ("May 6, 2026", "2026-05-06"). Returns
    (date|None, month_only) where month_only is True when only a year-month was
    recoverable (day unknown).
    """
    d = parse_dateish(candidate.get("publishedDate"))
    if d:
        return d, False
    url = candidate.get("url") or candidate.get("normalizedUrl") or ""
    m = re.search(r"/(20\d{2})/(\d{1,2})/", url)
    if m:
        try:
            return datetime(int(m.group(1)), int(m.group(2)), 1).date(), True
        except ValueError:
            pass
    title = candidate.get("title") or ""
    d = parse_dateish(title)
    if d:
        return d, False
    m = re.search(r"\b([A-Za-z]{3,9})\.?\s+(\d{1,2}),?\s+(20\d{2})\b", title)
    if m and m.group(1).lower() in _MONTH_TO_NUM:
        try:
            return datetime(int(m.group(3)), _MONTH_TO_NUM[m.group(1).lower()],
                            int(m.group(2))).date(), False
        except ValueError:
            pass
    m = re.search(r"\b([A-Za-z]{3,9})\.?\s+(20\d{2})\b", title)
    if m and m.group(1).lower() in _MONTH_TO_NUM:
        try:
            return datetime(int(m.group(2)), _MONTH_TO_NUM[m.group(1).lower()], 1).date(), True
        except ValueError:
            pass
    return None, False


def timing_confidence(candidate, window_start=None, window_end=None):
    if not window_start or not window_end:
        return "date-unclear" if not candidate.get("publishedDate") else "published-date-present"
    derived, month_only = derive_candidate_date(candidate)
    if not derived:
        return "date-unclear"
    if month_only:
        in_window = ((window_start.year, window_start.month)
                     <= (derived.year, derived.month)
                     <= (window_end.year, window_end.month))
    else:
        in_window = window_start <= derived <= window_end
    return f"published-in-{month_label(window_start)}" if in_window else "found-now-window-relevant"


def assign_candidate_labels(candidates, registry, window_start=None, window_end=None,
                            adjacent_hosts=None):
    cited_urls, registry_hosts = registry_url_host_sets(registry)
    adjacent_hosts = set(adjacent_hosts or [])
    for cand in candidates:
        norm = cand.get("normalizedUrl") or normalize_url(cand.get("url"))
        cand["normalizedUrl"] = norm
        host = host_of(cand.get("url"))
        if norm and norm in cited_urls:
            rel = "cited-source-update"
        elif host and host in registry_hosts:
            rel = "same-publisher-new-item"
        elif host and host in adjacent_hosts:
            rel = "adjacent-authority-source"
        else:
            rel = "search-only-provisional"
        cand["sourceRelationship"] = rel
        cand["timingConfidence"] = timing_confidence(cand, window_start, window_end)
        cand["requires_editor_review"] = True
        cand["can_move_grade_automatically"] = False
    return candidates


RELATIONSHIP_PRIORITY = {
    "cited-source-update": 4,
    "same-publisher-new-item": 3,
    "adjacent-authority-source": 2,
    "search-only-provisional": 1,
}


def collapse_candidates_by_url(candidates):
    """Collapse duplicate URLs found through multiple source surfaces."""
    by_url = {}
    passthrough = []
    for cand in candidates:
        norm = cand.get("normalizedUrl") or normalize_url(cand.get("url"))
        if not norm:
            passthrough.append(cand)
            continue
        existing = by_url.get(norm)
        if existing is None:
            cand["normalizedUrl"] = norm
            by_url[norm] = cand
            continue

        dims = set(existing.get("affected_dimensions") or [])
        dims.update(cand.get("affected_dimensions") or [])
        existing["affected_dimensions"] = sorted(dims)
        if not existing.get("snippet") and cand.get("snippet"):
            existing["snippet"] = cand["snippet"]
        current_rel = existing.get("sourceRelationship") or ""
        new_rel = cand.get("sourceRelationship") or ""
        if RELATIONSHIP_PRIORITY.get(new_rel, 0) > RELATIONSHIP_PRIORITY.get(current_rel, 0):
            existing["sourceRelationship"] = new_rel
            existing["sourceId"] = cand.get("sourceId") or existing.get("sourceId")
            existing["discovery"] = cand.get("discovery") or existing.get("discovery")
        if not existing.get("publishedDate") and cand.get("publishedDate"):
            existing["publishedDate"] = cand["publishedDate"]
        if existing.get("timingConfidence") == "date-unclear" and cand.get("timingConfidence"):
            existing["timingConfidence"] = cand["timingConfidence"]

    return list(by_url.values()) + passthrough


def collapse_candidates_by_title(candidates):
    """Collapse near-duplicate items that share a host AND an identical
    normalized title within one run (e.g. canada.ca pages that differ only by a
    trailing path character). Conservative: only same-host, same-title items
    collapse, dims are unioned, the higher score is kept, and the dropped URL is
    preserved in collapsedUrls so nothing is lost. Items that genuinely differ
    in title (e.g. separate ministerial releases about the same event) are left
    alone."""
    seen = {}
    order = []
    for cand in candidates:
        title = re.sub(r"[^a-z0-9]+", " ", (cand.get("title") or "").lower()).strip()
        host = host_of(cand.get("url"))
        if not title or not host:
            order.append(cand)
            continue
        key = (host, title)
        existing = seen.get(key)
        if existing is None:
            seen[key] = cand
            order.append(cand)
            continue
        dims = set(existing.get("affected_dimensions") or []) | set(cand.get("affected_dimensions") or [])
        existing["affected_dimensions"] = sorted(dims)
        if (cand.get("relevance_score") or 0) > (existing.get("relevance_score") or 0):
            existing["relevance_score"] = cand.get("relevance_score")
        urls = existing.setdefault("collapsedUrls", [])
        if cand.get("url") and cand["url"] != existing.get("url") and cand["url"] not in urls:
            urls.append(cand["url"])
    return order


def filter_seen_ledger(candidates, seen):
    if not seen:
        return candidates, []
    kept, skipped = [], []
    for cand in candidates:
        if already_seen_in_ledger(cand, seen):
            skipped.append(cand)
        else:
            kept.append(cand)
    return kept, skipped


def _source_id_and_dims(url, reg_by_surface):
    sk = slugify(surface_key(url))
    rec = reg_by_surface.get(sk)
    dims = rec["dimensions"] if rec else []
    return sk, dims


def candidates_from_fetch_results(results_payload, registry, state, cycle):
    """Turn the deterministic pullers' output into candidates and update state.
    Returns (candidates, access_failures)."""
    candidates = []
    access_failures = []
    if not results_payload:
        return candidates, access_failures

    results = results_payload.get("results", results_payload)
    reg_by_surface = {s["id"]: s for s in registry.get("sources", [])}

    # every URL already cited on the dashboard, so RSS feeds surface only what
    # is genuinely new rather than re-surfacing items we already use
    cited = set()
    for s in registry.get("sources", []):
        for u in s.get("citedUrls", []) or []:
            cited.add((u or "").lower().rstrip("/"))

    def is_new(url):
        return (url or "").lower().rstrip("/") not in cited

    def add(url, discovery, title, snippet, published=None, provisional=False):
        sid, dims = _source_id_and_dims(url, reg_by_surface)
        cand = _candidate(cycle, sid, discovery, title, url, snippet,
                          published=published, provisional=provisional, dims=dims)
        if already_surfaced(state, cand):
            return None
        candidates.append(cand)
        return cand

    # StatCan WDS freshness flags
    for key, val in results.items():
        if not key.startswith("statcan_"):
            continue
        if not isinstance(val, dict):
            continue
        fresh = (val.get("freshness") or {}).get("status")
        url = val.get("url") or ""
        meta = val.get("metadata") or {}
        ok = val.get("status") == "accessible"
        sid = slugify(surface_key(url)) if url else key
        mark_checked(state, sid, ok, access_issue=None if ok else val.get("status"))
        if fresh == "newer_data_available":
            title = f"StatCan {meta.get('cubeTitleEn') or key}: newer release available"
            snippet = (
                f"WDS cubeEndDate {meta.get('cubeEndDate')} is ahead of the period "
                f"cited on the dashboard. Released {meta.get('releaseTime')}."
            )
            add(url, "statcan_wds", title, snippet, published=meta.get("releaseTime"))

    # IRCC failures are retained as access or data-quality exceptions even when
    # the result family is structurally present.
    for key in DETERMINISTIC_OBJECT_RESULT_FAMILIES[1][1]:
        value = results.get(key)
        if not isinstance(value, dict) or value.get("status") == "success":
            continue
        detail = value.get("status") or "missing status"
        if value.get("error"):
            detail = f"{detail}: {value['error']}"
        access_failures.append({
            "surface": key,
            "method": "csv",
            "detail": detail,
        })

    # PBO feed -> publications not already cited
    pbo = results.get("pbo_feed") or {}
    if pbo.get("status") == "success":
        for pub in pbo.get("publications", [])[:30]:
            link = pub.get("link") or ""
            if not link or not is_new(link):
                continue
            add(link, "rss", pub.get("title"), "New PBO publication (not yet cited).",
                published=pub.get("pubDate"))
        # state for the PBO surface
        for s in registry.get("sources", []):
            if "pbo-dpb.ca" in s.get("searchDomains", []):
                mark_checked(state, s["id"], True)
    elif pbo:
        access_failures.append({"surface": "Parliamentary Budget Officer",
                                "method": "rss", "detail": pbo.get("status")})

    # Pollster feeds -> approval-relevant items not already cited.
    # fetch-data.py already filters items to approval-relevant and tags is_cited.
    for entry in results.get("pollster_feeds", []) or []:
        ok = entry.get("status") == "success"
        for item in (entry.get("items") or []):
            link = item.get("link") or ""
            if not link or item.get("is_cited") or not is_new(link):
                continue
            add(link, "rss", item.get("title"),
                f"{entry.get('pollster')} approval-relevant post, not yet cited.",
                published=item.get("pubDate"))
        if not ok:
            access_failures.append({"surface": entry.get("pollster"),
                                    "method": "rss", "detail": entry.get("status")})

    # Policy / journalism feeds -> topic-relevant items not already cited.
    for entry in results.get("policy_feeds", []) or []:
        ok = entry.get("status") == "success"
        for item in (entry.get("items") or []):
            if not item.get("topic_match"):
                continue
            link = item.get("link") or ""
            if not link or not is_new(link):
                continue
            add(link, "rss", item.get("title"),
                f"{entry.get('publisher')} post flagged dashboard-topic-relevant.",
                published=item.get("pubDate"))
        if not ok:
            access_failures.append({"surface": entry.get("publisher"),
                                    "method": "rss", "detail": entry.get("status")})

    # LEGISinfo bill status
    for entry in results.get("legisinfo", []) or []:
        rec = entry.get("record", {}) or {}
        if rec.get("status") == "success":
            url = rec.get("url") or ""
            title = (f"{rec.get('number_code', entry.get('bill', '?'))}: "
                     f"{rec.get('current_status', 'status unknown')}")
            add(url, "legisinfo", title,
                f"Latest stage: {rec.get('latest_stage')}. Ongoing: {rec.get('ongoing_stage')}.")

    # MPO page diff (projects only on the live page, not in the cohort)
    mpo = results.get("mpo_diff") or {}
    if mpo.get("status") == "success":
        mpo_url = "https://www.canada.ca/en/privy-council/major-projects-office/projects/national.html"
        for proj in mpo.get("mpo_only", []) or []:
            name = proj.get("display") if isinstance(proj, dict) else str(proj)
            add(mpo_url, "mpo_diff", f"MPO page lists a project not in the cohort: {name}",
                "Appears on the Major Projects Office page but not in the tracked cohort.")
        mark_checked(state, slugify(surface_key(mpo_url)), True)

    # Ethics Commissioner additions
    ed = results.get("ethics_reports_diff") or {}
    if ed.get("status") == "success":
        for rep in ed.get("additions", []) or []:
            add(rep.get("url") or "", "ethics_diff",
                f"New Ethics Commissioner report listing: {rep.get('title')}",
                "New entry on the investigation-report listing page since the last cache.")
        mark_checked(state, slugify("ethicscanada.ca"), True)
    elif ed:
        access_failures.append({"surface": "Conflict of Interest and Ethics Commissioner",
                                "method": "page_hash", "detail": ed.get("status")})
        mark_checked(state, slugify("ethicscanada.ca"), False,
                     access_issue=ed.get("status"))

    # link-rot: blocked / broken cited URLs become source-health candidates. This
    # is a per-URL liveness probe, not a survey of the surface, so it does NOT
    # mutate per-source state. Letting it would contradict a successful page or
    # feed pull on the same host in the same run (e.g. the Ethics page diff
    # succeeds while one cited Ethics URL 403s).
    for entry in results.get("link_rot", []) or []:
        status = entry.get("status", "")
        if status in ("broken_no_archive", "broken_with_archive",
                      "blocked_no_archive", "blocked_with_archive"):
            url = entry.get("url") or ""
            note = "has Wayback snapshot" if "with_archive" in status else "no Wayback snapshot"
            add(url, "link_rot",
                f"Cited URL {status.split('_')[0]}: {entry.get('label')}",
                f"Link-rot scan flagged this cited URL ({status}, {note}).")

    return candidates, access_failures


# --------------------------------------------------------------------------- #
# search fan-out tier  (Tavily, optional)
# --------------------------------------------------------------------------- #
def _days_since(state, source_id, default=40):
    s = (state.get("sources") or {}).get(source_id) or {}
    last = s.get("lastSuccessfulCheck")
    if not last:
        return default
    try:
        dt = datetime.fromisoformat(last)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        delta = (datetime.now(timezone.utc) - dt).days
        return max(7, min(delta + 2, 120))
    except Exception:
        return default


def search_window_dates(state, source_id, fixed_window=None):
    if fixed_window:
        return fixed_window
    days = _days_since(state, source_id)
    end = datetime.now(timezone.utc).date()
    start = end - timedelta(days=days)
    return start.isoformat(), end.isoformat()


def _request_tavily(requests, payload):
    """Return one usable response, retrying a transient failure once."""
    last_error = None
    for attempt in range(TAVILY_SEARCH_ATTEMPTS):
        transient = False
        try:
            response = requests.post(TAVILY_ENDPOINT, json=payload, timeout=40)
        except requests.RequestException as exc:
            last_error = f"tavily request failed: {exc}"
            transient = True
        except Exception as exc:
            return None, f"tavily request failed: {exc}"
        else:
            if response.status_code != 200:
                last_error = f"tavily http {response.status_code}"
                transient = response.status_code == 429 or 500 <= response.status_code < 600
                if not transient:
                    return None, last_error
            else:
                try:
                    data = response.json()
                except ValueError as exc:
                    last_error = f"tavily json failed: {exc}"
                    transient = True
                else:
                    if isinstance(data, dict) and isinstance(data.get("results"), list):
                        return data, None
                    last_error = "tavily json response is missing a results list"
                    transient = True

        if transient and attempt + 1 < TAVILY_SEARCH_ATTEMPTS:
            time.sleep(TAVILY_RETRY_DELAY_SECONDS)
            continue
        break

    return None, f"{last_error} after {TAVILY_SEARCH_ATTEMPTS} attempts"


def run_search_fanout(registry, state, cycle, api_key, max_results=5,
                      fixed_window=None, adjacent_entries=None):
    """Domain-restricted, time-windowed Tavily queries over feed-less / blocked
    surfaces. Results are provisional discovery, never citation-ready."""
    import requests  # already a project dependency

    candidates = []
    access_failures = []
    reg_by_surface = {s["id"]: s for s in registry.get("sources", [])}

    targets = [s for s in registry.get("sources", [])
               if s.get("method") == "search_fanout" and s.get("searchDomains")]
    targets.extend(adjacent_entries or [])

    for src in targets:
        domains = src.get("searchDomains") or []
        start_date, end_date = search_window_dates(state, src["id"], fixed_window=fixed_window)
        query = (f"{src['publisher']} new report or announcement relevant to "
                 f"{', '.join(src.get('dimensions') or ['federal policy'])}")
        payload = {
            "api_key": api_key,
            "query": query,
            "search_depth": "basic",
            "topic": "general",
            "include_domains": domains,
            "max_results": max_results,
            "start_date": start_date,
            "end_date": end_date,
            "include_answer": False,
            "include_raw_content": False,
        }
        data, error = _request_tavily(requests, payload)
        if error:
            access_failures.append({"surface": src["publisher"],
                                    "method": "search_fanout", "detail": error})
            mark_checked(state, src["id"], False, access_issue=error)
            continue

        hits = data.get("results", []) or []
        for hit in hits:
            cand = _candidate(
                cycle, src["id"], "search_fanout",
                hit.get("title"), hit.get("url"), hit.get("content"),
                published=hit.get("published_date"),
                provisional=True, dims=src.get("dimensions"),
            )
            if src.get("adjacentAuthority"):
                cand["sourceRelationship"] = "adjacent-authority-source"
            if already_surfaced(state, cand):
                continue
            candidates.append(cand)
        mark_checked(state, src["id"], True)

    return candidates, access_failures


# --------------------------------------------------------------------------- #
# relevance pass  (Claude, optional)
# --------------------------------------------------------------------------- #
def build_dimension_context(dimensions):
    """Context for the relevance pass. Deliberately omits current grade, status,
    and trend so the model routes on purpose and evidence, not on the standing
    score."""
    out = []
    for dim in dimensions:
        triggers = dim.get("gradeTriggers", {}) or {}
        out.append({
            "id": dim.get("id"),
            "name": dim.get("name"),
            "purpose": dim.get("whatThisGrades"),
            "metricLabels": [m.get("label") for m in (dim.get("metrics") or []) if m.get("label")],
            "triggerTextsUp": [t.get("text") for t in (triggers.get("up") or []) if t.get("text")],
            "triggerTextsDown": [t.get("text") for t in (triggers.get("down") or []) if t.get("text")],
            "promiseTexts": [p.get("text") for p in (dim.get("promises") or []) if p.get("text")][:12],
        })
    return out


CLASSIFIER_TOOL = {
    "name": "record_classifications",
    "description": "Record a routing label for each candidate. You route candidates to an editor queue. You never decide a grade.",
    "input_schema": {
        "type": "object",
        "properties": {
            "classifications": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "candidate_id": {"type": "string"},
                        "classification": {
                            "type": "string",
                            "enum": sorted(VALID_CLASSIFICATIONS),
                        },
                        "affected_dimensions": {
                            "type": "array", "items": {"type": "string"},
                        },
                        "relevance_score": {"type": "number"},
                        "reason": {"type": "string"},
                        "evidence_limitations": {"type": "string"},
                    },
                    "required": ["candidate_id", "classification",
                                 "affected_dimensions", "relevance_score", "reason"],
                },
            }
        },
        "required": ["classifications"],
    },
}

CLASSIFIER_SYSTEM = (
    "You are a triage layer for a non-partisan policy scorecard. You receive new "
    "source material and route each item to an editor queue. You do not decide, "
    "suggest, or imply any grade, score, or status. Your only job is routing.\n\n"
    "For each candidate choose one classification:\n"
    "- metric_update: looks like a refreshed value for a tracked metric.\n"
    "- trigger_watch: bears on a stated grade-move trigger condition.\n"
    "- promise_status: bears on a tracked promise's delivery status.\n"
    "- source_balance: a source-health or source-mix item (dead link, a missing "
    "independent perspective), not new evidence itself.\n"
    "- context: relevant background, not a metric/trigger/promise mover.\n"
    "- manual_browser_pull: relevant but the content needs a human/browser pull "
    "to read (paywalled, JS-rendered, or blocked).\n"
    "- irrelevant: not dimension-relevant.\n\n"
    "affected_dimensions must use dimension ids from the provided context. "
    "relevance_score is 0.0 to 1.0. Be conservative: when unsure between context "
    "and a mover, choose context. Snippets from a search fan-out are provisional "
    "discovery, not verified evidence."
)


def normalize_classifier_rows(rows, chunk_ids, dimension_ids):
    """Validate one tool response before any candidate state is mutated."""
    if not isinstance(rows, list):
        return [], "Claude response classifications is not a list"

    expected_ids = set(chunk_ids)
    normalized = []
    seen_ids = set()
    row_errors = []

    for index, row in enumerate(rows):
        errors = []
        if not isinstance(row, dict):
            row_errors.append(f"row {index} is not an object")
            continue

        candidate_id = row.get("candidate_id")
        if not isinstance(candidate_id, str) or candidate_id not in expected_ids:
            errors.append("candidate_id is missing or outside the requested batch")
        elif candidate_id in seen_ids:
            errors.append("candidate_id is duplicated")

        classification = row.get("classification")
        if classification not in VALID_CLASSIFICATIONS:
            errors.append("classification is invalid")

        raw_dimensions = row.get("affected_dimensions")
        normalized_dimensions = []
        if not isinstance(raw_dimensions, list) or any(
                not isinstance(dimension, str) for dimension in raw_dimensions):
            errors.append("affected_dimensions must be a list of dimension ids")
        else:
            normalized_dimensions = sorted(set(raw_dimensions))
            unknown_dimensions = set(normalized_dimensions) - dimension_ids
            if unknown_dimensions:
                errors.append("affected_dimensions contains an unknown dimension id")
            if classification != "irrelevant" and not normalized_dimensions:
                errors.append("affected_dimensions is empty for a relevant classification")

        raw_score = row.get("relevance_score")
        score = None
        if isinstance(raw_score, bool) or not isinstance(raw_score, (int, float)):
            errors.append("relevance_score must be a number from 0 to 1")
        else:
            score = float(raw_score)
            if not math.isfinite(score) or not 0 <= score <= 1:
                errors.append("relevance_score must be a number from 0 to 1")

        raw_reason = row.get("reason")
        reason = scrub_public_text(raw_reason).strip()[:600]
        if not isinstance(raw_reason, str) or not reason:
            errors.append("reason must be a nonempty string")

        raw_limitations = row.get("evidence_limitations")
        if raw_limitations is not None and not isinstance(raw_limitations, str):
            errors.append("evidence_limitations must be a string when provided")
        limitations = scrub_public_text(raw_limitations).strip()[:400]

        if errors:
            row_errors.append(f"row {index}: {', '.join(errors)}")
            continue

        seen_ids.add(candidate_id)
        normalized.append({
            "candidate_id": candidate_id,
            "classification": classification,
            "affected_dimensions": normalized_dimensions,
            "relevance_score": round(score, 3),
            "reason": reason,
            "evidence_limitations": limitations,
        })

    normalized_ids = {row["candidate_id"] for row in normalized}
    missing = sorted(expected_ids - normalized_ids)
    if row_errors:
        detail = "; ".join(row_errors[:3])
        if len(row_errors) > 3:
            detail += f"; {len(row_errors) - 3} more invalid row(s)"
        return [], f"Claude response contained invalid classifications: {detail}"
    if missing:
        return [], f"Claude response omitted classifications for {len(missing)} candidate(s)"
    return normalized, None


def classify_candidates(candidates, dim_context, model, api_key, batch_size=12):
    """Run the relevance pass. Returns (classified_candidates, error_or_None).
    Hard-sets the safety invariants regardless of model output."""
    try:
        import anthropic
    except Exception:
        return candidates, "anthropic SDK not installed"

    client = anthropic.Anthropic(api_key=api_key)
    by_id = {c["candidate_id"]: c for c in candidates}
    classified_ids = set()
    dimension_ids = {
        dimension.get("id") for dimension in dim_context
        if isinstance(dimension, dict) and dimension.get("id")
    }
    context_json = json.dumps(dim_context, ensure_ascii=False)

    ids = list(by_id.keys())
    for start in range(0, len(ids), batch_size):
        chunk_ids = ids[start:start + batch_size]
        chunk = [{
            "candidate_id": by_id[i]["candidate_id"],
            "discovery": by_id[i]["discovery"],
            "title": by_id[i]["title"],
            "url": by_id[i]["url"],
            "snippet": by_id[i]["snippet"],
            "provisional": by_id[i]["provisional"],
            "a_priori_dimensions": by_id[i]["affected_dimensions"],
        } for i in chunk_ids]
        user = (
            "Dimension context (route against these; ignore any notion of current "
            "grade, it is not provided on purpose):\n"
            f"{context_json}\n\n"
            "Candidates to route:\n"
            f"{json.dumps(chunk, ensure_ascii=False)}"
        )
        try:
            resp = client.messages.create(
                model=model,
                max_tokens=4096,
                system=CLASSIFIER_SYSTEM,
                tools=[CLASSIFIER_TOOL],
                tool_choice={"type": "tool", "name": "record_classifications"},
                messages=[{"role": "user", "content": user}],
            )
        except Exception as e:
            return candidates, f"Claude request failed: {e}"

        rows = []
        for block in resp.content:
            if getattr(block, "type", None) == "tool_use":
                tool_input = getattr(block, "input", None)
                rows = tool_input.get("classifications", []) if isinstance(
                    tool_input, dict) else None
                break

        normalized_rows, row_error = normalize_classifier_rows(
            rows, chunk_ids, dimension_ids)
        if row_error:
            return candidates, row_error

        for row in normalized_rows:
            cand = by_id[row["candidate_id"]]
            cand["classification"] = row["classification"]
            cand["affected_dimensions"] = row["affected_dimensions"]
            cand["relevance_score"] = row["relevance_score"]
            cand["reason"] = row["reason"]
            cand["evidence_limitations"] = row["evidence_limitations"]
            # safety invariants are never delegated to the model
            cand["requires_editor_review"] = True
            cand["can_move_grade_automatically"] = False
            classified_ids.add(cand["candidate_id"])

    missing = sorted(set(by_id) - classified_ids)
    if missing:
        return (list(by_id.values()),
                f"Claude response omitted classifications for {len(missing)} candidate(s)")

    return list(by_id.values()), None


def required_tier_errors(tiers, candidate_count, *, expect_deterministic,
                         expect_search, expect_classification, require_keys,
                         require_complete, tavily_key, anthropic_key):
    """Return fail-closed acceptance errors for explicitly required live tiers."""
    errors = []
    deterministic_status = tiers.get("deterministic", "not_run")
    search_status = tiers.get("search_fanout", "not_run")
    classification_status = tiers.get("classification", "not_run")

    tavily_missing = expect_search and not tavily_key
    anthropic_missing = expect_classification and not anthropic_key

    if require_keys and tavily_missing:
        errors.append("TAVILY_API_KEY required but not set")
    if require_keys and anthropic_missing:
        errors.append("ANTHROPIC_API_KEY required but not set")

    if (require_complete and expect_deterministic and
            not deterministic_status.startswith("run (")):
        errors.append(
            f"Deterministic tier required but did not complete: {deterministic_status}")

    if require_complete and expect_search and not search_status.startswith("run ("):
        if not (require_keys and tavily_missing):
            errors.append(f"Search fan-out required but did not complete: {search_status}")

    classification_complete = classification_status.startswith("run (")
    accepted_empty_skip = (candidate_count == 0 and
                           classification_status == "skipped (no candidates)")
    if (require_complete and expect_classification and
            not classification_complete and not accepted_empty_skip):
        if not (require_keys and anthropic_missing):
            errors.append(
                f"Classification required but did not complete: {classification_status}")

    return errors


# --------------------------------------------------------------------------- #
# outputs: candidate ledger JSON + editor packet markdown
# --------------------------------------------------------------------------- #
NO_CHANGE_STATEMENT = (
    "No grades, statuses, thresholds, scoring, or dashboard data were changed by "
    "this run. Everything below is a candidate for the editor to look at."
)


def _suppressed(candidates, threshold=0.15):
    """Split classified candidates into surfaced vs low-relevance/irrelevant."""
    surfaced, suppressed = [], []
    for c in candidates:
        score = c.get("relevance_score")
        cls = c.get("classification")
        if cls == "irrelevant" or (score is not None and score < threshold):
            suppressed.append(c)
        else:
            surfaced.append(c)
    return surfaced, suppressed


def threshold_count(candidates, threshold):
    count = 0
    for c in candidates:
        if c.get("classification") == "irrelevant":
            continue
        score = c.get("relevance_score")
        if score is None or score >= threshold:
            count += 1
    return count


def source_set_delta(registry, compare_registry):
    if not compare_registry:
        return None
    current = {s.get("id") for s in registry.get("sources", []) or []}
    other = {s.get("id") for s in compare_registry.get("sources", []) or []}
    return {
        "activeCount": len(current),
        "compareCount": len(other),
        "onlyActive": sorted(x for x in current - other if x),
        "onlyCompare": sorted(x for x in other - current if x),
    }


def write_candidate_json(path, cycle, tiers, candidates, access_failures, suppressed,
                         skipped_seen=None, metadata=None):
    payload = {
        "schemaVersion": SCHEMA_VERSION,
        "cycle": cycle,
        "generatedAt": now_iso(),
        "tiers": tiers,
        "noChangeStatement": NO_CHANGE_STATEMENT,
        "metadata": metadata or {},
        "counts": {
            "surfaced": len(candidates),
            "suppressed": len(suppressed),
            "accessFailures": len(access_failures),
            "skippedSeenLedger": len(skipped_seen or []),
        },
        "candidates": candidates,
        "suppressed": suppressed,
        "skippedSeenLedger": skipped_seen or [],
        "accessFailures": access_failures,
    }
    write_json(path, payload)


def _md_table(rows, headers):
    out = ["| " + " | ".join(headers) + " |",
           "| " + " | ".join("---" for _ in headers) + " |"]
    for r in rows:
        cells = [str(x if x is not None else "").replace("|", "\\|").replace("\n", " ") for x in r]
        out.append("| " + " | ".join(cells) + " |")
    return "\n".join(out)


def render_packet_md(cycle, tiers, registry, candidates, access_failures,
                     suppressed, dry_run, warnings, title_note=None,
                     surface_threshold=NORMAL_SURFACE_THRESHOLD,
                     normal_threshold=NORMAL_SURFACE_THRESHOLD,
                     skipped_seen=None, source_delta=None,
                     show_borderline=False):
    surveyed = registry.get("sources", [])
    by_method = {}
    for s in surveyed:
        by_method[s["method"]] = by_method.get(s["method"], 0) + 1

    lines = []
    lines.append(f"# Source monitoring candidates - {cycle}")
    lines.append("")
    if title_note:
        lines.append(f"> {title_note}")
        lines.append("")
    if dry_run:
        lines.append("> DRY RUN. The search fan-out and the relevance pass did not run. "
                     "This packet shows the format and the deterministic-tier output only.")
        lines.append("")
    lines.append(f"_Generated {now_iso()}._")
    lines.append("")
    lines.append(NO_CHANGE_STATEMENT)
    lines.append("")

    # run status
    lines.append("## Run status")
    lines.append("")
    lines.append(_md_table(
        [[k, v] for k, v in tiers.items()],
        ["Tier", "Status"],
    ))
    lines.append("")
    if warnings:
        lines.append("**Heads up:**")
        for w in warnings:
            lines.append(f"- {w}")
        lines.append("")

    # sources surveyed
    lines.append("## Sources surveyed")
    lines.append("")
    lines.append(f"{len(surveyed)} surfaces in the registry. By method: " +
                 ", ".join(f"{m} {by_method[m]}" for m in sorted(by_method)) + ".")
    lines.append("")
    if source_delta:
        lines.append("### Source-set delta")
        lines.append("")
        lines.append(
            f"Active registry for this run: {source_delta['activeCount']} surfaces. "
            f"Comparison registry: {source_delta['compareCount']} surfaces."
        )
        if source_delta.get("onlyActive"):
            lines.append("")
            lines.append("Only in this run's source set: " +
                         ", ".join(source_delta["onlyActive"][:30]) +
                         (" ..." if len(source_delta["onlyActive"]) > 30 else "") + ".")
        if source_delta.get("onlyCompare"):
            lines.append("")
            lines.append("Only in the comparison source set: " +
                         ", ".join(source_delta["onlyCompare"][:30]) +
                         (" ..." if len(source_delta["onlyCompare"]) > 30 else "") + ".")
        lines.append("")

    lines.append("### Label legends")
    lines.append("")
    lines.append("- `cited-source-update`: exact cited URL came back through monitoring.")
    lines.append("- `same-publisher-new-item`: same cited publisher/domain, new URL.")
    lines.append("- `adjacent-authority-source`: curated adjacent authority host, not currently cited.")
    lines.append("- `search-only-provisional`: search discovery outside the cited/allowlisted hosts.")
    lines.append("- Timing labels are mechanical, based on source/search publication dates when exposed.")
    lines.append("")

    surfaced_det = [c for c in candidates if c["discovery"] != "search_fanout"]
    surfaced_search = [c for c in candidates if c["discovery"] == "search_fanout"]

    def cand_rows(items):
        rows = []
        for c in items:
            dims = ", ".join(c.get("affected_dimensions") or []) or "-"
            cls = c.get("classification") or "(unclassified)"
            score = c.get("relevance_score")
            score_s = f"{score:.2f}" if isinstance(score, (int, float)) else "-"
            title = c.get("title") or "(no title)"
            link = f"[{title}]({c['url']})" if c.get("url") else title
            rows.append([
                cls,
                dims,
                score_s,
                c.get("sourceRelationship") or "-",
                c.get("timingConfidence") or "-",
                c["discovery"],
                link,
            ])
        return rows

    candidate_headers = ["Routing", "Dimensions", "Score", "Source relation",
                         "Timing", "Discovery", "Item"]

    # deterministic candidates
    lines.append("## Deterministic candidates")
    lines.append("")
    lines.append("From the machine-readable pullers in `fetch-data.py` (RSS, StatCan WDS, "
                 "IRCC, Bank of Canada, LEGISinfo, MPO page, Ethics page, link-rot).")
    lines.append("")
    if surfaced_det:
        lines.append(_md_table(cand_rows(surfaced_det), candidate_headers))
    else:
        lines.append("_No deterministic candidates this run._")
    lines.append("")

    # search fan-out candidates
    lines.append("## Search fan-out candidates (provisional)")
    lines.append("")
    lines.append("Discovery only. Snippets are not citation-ready. Anything grade-relevant "
                 "needs a browser pull and editor verification before it touches the dashboard.")
    lines.append("")
    if surfaced_search:
        lines.append(_md_table(cand_rows(surfaced_search), candidate_headers))
    else:
        lines.append("_No search fan-out candidates this run._")
    lines.append("")

    borderline = []
    if show_borderline and surface_threshold < normal_threshold:
        borderline = [
            c for c in candidates
            if c.get("classification") != "irrelevant"
            and isinstance(c.get("relevance_score"), (int, float))
            and surface_threshold <= c["relevance_score"] < normal_threshold
        ]
        lines.append("## Borderline (calibration band)")
        lines.append("")
        lines.append(
            f"These items surfaced only because this run used the permissive "
            f"{surface_threshold:.2f} calibration threshold instead of the normal "
            f"{normal_threshold:.2f} threshold."
        )
        lines.append("")
        if borderline:
            lines.append(_md_table(cand_rows(borderline), candidate_headers))
        else:
            lines.append("_No borderline candidates landed between the two thresholds._")
        lines.append("")

        lines.append("### Threshold calibration")
        lines.append("")
        lines.append(_md_table(
            [
                [f"{surface_threshold:.2f} permissive", threshold_count(candidates, surface_threshold)],
                [f"{normal_threshold:.2f} normal", threshold_count(candidates, normal_threshold)],
                ["0.30 stricter", threshold_count(candidates, 0.30)],
            ],
            ["Threshold", "Would surface"],
        ))
        lines.append("")

    # editor decision required
    decision = [c for c in candidates
                if c.get("classification") in ("metric_update", "trigger_watch", "promise_status")]
    lines.append("## Editor decision required")
    lines.append("")
    if decision:
        rows = []
        for c in decision:
            rows.append([
                c.get("classification"),
                ", ".join(c.get("affected_dimensions") or []) or "-",
                f"[{c.get('title') or c['url']}]({c['url']})" if c.get("url") else (c.get("title") or ""),
                (c.get("reason") or "").strip() or "-",
            ])
        lines.append(_md_table(rows, ["Routing", "Dimensions", "Item", "Why flagged"]))
    else:
        lines.append("_Nothing routed to a metric, trigger, or promise queue this run._")
    lines.append("")

    # access failures / browser pull
    lines.append("## Access failures and browser-pull list")
    lines.append("")
    browser_pull = sorted(
        [c for c in candidates if c.get("classification") == "manual_browser_pull"],
        key=lambda c: c.get("relevance_score") or 0, reverse=True)
    if access_failures or browser_pull:
        rows = [[f.get("surface"), f.get("method"), f.get("detail")] for f in access_failures]
        for c in browser_pull:
            rows.append([c.get("title") or c["url"], "manual_browser_pull",
                         f"see {c['url']}"])
        lines.append(_md_table(rows, ["Surface / item", "Method", "Detail"]))
    else:
        lines.append("_No access failures recorded this run._")
    lines.append("")

    # suppressed
    lines.append("## Suppressed / low-relevance")
    lines.append("")
    if suppressed:
        lines.append(f"{len(suppressed)} items were routed irrelevant or scored below the "
                     "surfacing threshold. They are kept in the candidate JSON for audit, not "
                     "shown here.")
    else:
        lines.append("_Nothing suppressed this run._")
    lines.append("")

    if skipped_seen:
        lines.append("## Already seen in comparison ledger")
        lines.append("")
        lines.append(
            f"{len(skipped_seen)} candidates matched the supplied seen ledger and were "
            "kept out of this packet to avoid duplicating an existing source-monitor PR."
        )
        lines.append("")

    lines.append("---")
    lines.append("")
    lines.append(NO_CHANGE_STATEMENT)
    lines.append("")
    return "\n".join(lines)


# --------------------------------------------------------------------------- #
# main
# --------------------------------------------------------------------------- #
def default_cycle():
    return datetime.now(timezone.utc).strftime("%Y-%m")


def main(argv=None):
    parser = argparse.ArgumentParser(description="Monthly source monitor for Canada Under Carney")
    parser.add_argument("--cycle", default=default_cycle(), help="Cycle month, YYYY-MM. Defaults to the current month.")
    parser.add_argument("--fetch-results", default=str(DEFAULT_FETCH_RESULTS),
                        help="Path to fetch-data.py --json-out results. Deterministic tier is skipped if absent.")
    parser.add_argument("--dry-run", action="store_true", help="Skip the search and relevance tiers. Runs offline with no secrets.")
    parser.add_argument("--no-search", action="store_true", help="Skip the Tavily search fan-out tier.")
    parser.add_argument("--no-classify", action="store_true", help="Skip the Claude relevance pass.")
    parser.add_argument("--rebuild-registry", action="store_true", help="Rebuild monitoring/sources.json from the data, then exit.")
    parser.add_argument("--out-suffix", default="", help="Suffix for output filenames, e.g. -dryrun.")
    parser.add_argument("--model", default=DEFAULT_MODEL, help="Claude model id for the relevance pass.")
    parser.add_argument("--require-keys", action="store_true", help="Exit non-zero if a needed API key is missing.")
    parser.add_argument(
        "--require-complete", action="store_true",
        help=("Exit non-zero unless expected deterministic, search, and classification "
              "tiers complete. Classification may skip only with zero candidates."))
    parser.add_argument("--dimensions-file", default=str(DIMENSIONS_FILE), help="dimensions.json path override.")
    parser.add_argument("--approval-file", default=str(APPROVAL_POLLS_FILE), help="approval-polls.json path override.")
    parser.add_argument("--sources-file", default=str(SOURCES_FILE), help="Source registry path override.")
    parser.add_argument("--state-file", default=str(STATE_FILE), help="Monitor state path override.")
    parser.add_argument("--ledger-path", default=None, help="Candidate JSON output path override.")
    parser.add_argument("--packet-path", default=None, help="Markdown packet output path override.")
    parser.add_argument("--surface-threshold", type=float, default=NORMAL_SURFACE_THRESHOLD,
                        help="Relevance score threshold for surfacing candidates.")
    parser.add_argument("--window-start", default=None, help="Fixed search window start, YYYY-MM-DD.")
    parser.add_argument("--window-end", default=None, help="Fixed search window end, YYYY-MM-DD.")
    parser.add_argument("--no-deterministic", action="store_true",
                        help="Intentionally skip deterministic fetch-results parsing.")
    parser.add_argument("--seen-ledger", default=None,
                        help="Prior candidate ledger whose fingerprints/URLs should be treated as already seen.")
    parser.add_argument("--adjacent", action="store_true",
                        help="Also search curated adjacent-authority hosts from monitoring/adjacent-authorities.json.")
    parser.add_argument("--adjacent-file", default=str(MONITORING_DIR / "adjacent-authorities.json"),
                        help="Adjacent authority allowlist JSON path.")
    parser.add_argument("--compare-sources-file", default=None,
                        help="Optional registry path to summarize source-set delta.")
    parser.add_argument("--title-note", default=None, help="Banner note rendered near the top of the packet.")
    args = parser.parse_args(argv)

    if args.out_suffix and not re.match(r"^[A-Za-z0-9._-]+$", args.out_suffix):
        print("ERROR: --out-suffix may contain only letters, digits, dot, dash, or underscore",
              file=sys.stderr)
        return 1

    if args.rebuild_registry:
        dimensions = load_json(args.dimensions_file)
        approval = load_json(args.approval_file, default={})
        if not dimensions:
            print(f"ERROR: {args.dimensions_file} not found or empty", file=sys.stderr)
            return 1
        registry = build_registry(dimensions, approval)
        write_json(args.sources_file, registry)
        print(f"Wrote {args.sources_file} with {len(registry['sources'])} source surfaces.")
        return 0

    if (args.window_start and not args.window_end) or (args.window_end and not args.window_start):
        print("ERROR: --window-start and --window-end must be supplied together", file=sys.stderr)
        return 1
    fixed_window = None
    window_start_date = None
    window_end_date = None
    if args.window_start and args.window_end:
        window_start_date = parse_dateish(args.window_start)
        window_end_date = parse_dateish(args.window_end)
        if not window_start_date or not window_end_date or window_start_date > window_end_date:
            print("ERROR: invalid --window-start/--window-end", file=sys.stderr)
            return 1
        fixed_window = (window_start_date.isoformat(), window_end_date.isoformat())

    registry = load_json(args.sources_file)
    if not registry:
        print(f"ERROR: {args.sources_file} not found. Run --rebuild-registry first.", file=sys.stderr)
        return 1

    dimensions = load_json(args.dimensions_file) or []
    state = load_state(args.state_file)
    cycle = args.cycle

    tavily_key = os.environ.get("TAVILY_API_KEY")
    anthropic_key = os.environ.get("ANTHROPIC_API_KEY")
    do_search = not args.dry_run and not args.no_search
    do_classify = not args.dry_run and not args.no_classify
    required_key_preflight_failed = args.require_keys and (
        (do_search and not tavily_key) or
        (do_classify and not anthropic_key)
    )

    warnings = []
    tiers = {}
    skipped_seen = []
    seen = load_seen_ledger(args.seen_ledger)
    if args.seen_ledger:
        tiers["seen_ledger"] = f"loaded ({len(seen['fingerprints'])} fingerprints, {len(seen['urls'])} URLs)"

    adjacent_by_dim = load_adjacent_authorities(args.adjacent_file) if args.adjacent else {}
    adjacent_entries = adjacent_registry_entries(adjacent_by_dim, registry) if adjacent_by_dim else []
    adjacent_hosts = {h for hosts in adjacent_by_dim.values() for h in hosts}
    if args.adjacent:
        tiers["adjacent_authorities"] = f"enabled ({len(adjacent_entries)} hosts)"

    # --- deterministic tier --------------------------------------------------
    fetch_path = Path(args.fetch_results)
    results_payload = None if args.no_deterministic else load_json(fetch_path)
    if args.no_deterministic:
        det_candidates, det_failures = [], []
        tiers["deterministic"] = "intentionally_skipped (--no-deterministic)"
        warnings.append("Deterministic tier intentionally skipped for a historical/windowed run; "
                        "live endpoint state cannot be reconstructed for a past window.")
    elif results_payload:
        expected_coverage = expected_deterministic_coverage(dimensions)
        payload_errors = deterministic_payload_errors(
            results_payload,
            expected_cycle=cycle,
            require_link_rot=args.require_complete,
            expected_link_urls=expected_coverage["link_urls"],
            expected_legisinfo=expected_coverage["legisinfo"],
        )
        if isinstance(results_payload, dict):
            det_candidates, det_failures = candidates_from_fetch_results(
                results_payload, registry, state, cycle)
        else:
            det_candidates, det_failures = [], []
        if payload_errors:
            tiers["deterministic"] = f"failed ({'; '.join(payload_errors)})"
            warnings.append(
                "Deterministic tier payload is incomplete. Parsed results are retained "
                "for diagnosis, but strict acceptance and state advancement are blocked.")
        else:
            tiers["deterministic"] = f"run ({fetch_path.name})"
    else:
        det_candidates, det_failures = [], []
        tiers["deterministic"] = "not_run (no fetch-results file)"
        warnings.append("Deterministic tier did not run: no fetch-results file. "
                        "Run `fetch-data.py --json-out` first. This is not a clean cycle.")

    deterministic_preflight_failed = (
        args.require_complete and
        not args.no_deterministic and
        not tiers["deterministic"].startswith("run (")
    )

    candidates = list(det_candidates)
    access_failures = list(det_failures)

    # --- search fan-out tier -------------------------------------------------
    if not do_search:
        tiers["search_fanout"] = "skipped (dry-run)" if args.dry_run else "skipped (--no-search)"
    elif deterministic_preflight_failed:
        tiers["search_fanout"] = "skipped (deterministic preflight failed)"
        warnings.append("Search fan-out tier skipped before paid work because the "
                        "strict deterministic preflight failed.")
    elif required_key_preflight_failed:
        if not tavily_key:
            tiers["search_fanout"] = "skipped (TAVILY_API_KEY not set)"
            warnings.append("Search fan-out tier skipped: TAVILY_API_KEY not set. "
                            "Feed-less and blocked surfaces were not surveyed this run.")
        else:
            tiers["search_fanout"] = "skipped (required API key preflight failed)"
            warnings.append("Search fan-out tier skipped before paid work because another "
                            "required API key is missing.")
    elif not tavily_key:
        tiers["search_fanout"] = "skipped (TAVILY_API_KEY not set)"
        warnings.append("Search fan-out tier skipped: TAVILY_API_KEY not set. "
                        "Feed-less and blocked surfaces were not surveyed this run.")
    else:
        search_candidates, search_failures = run_search_fanout(
            registry, state, cycle, tavily_key, fixed_window=fixed_window,
            adjacent_entries=adjacent_entries)
        candidates.extend(search_candidates)
        access_failures.extend(search_failures)
        if search_failures:
            tiers["search_fanout"] = (
                f"failed ({len(search_failures)} query errors; "
                f"{len(search_candidates)} hits retained)")
        else:
            tiers["search_fanout"] = f"run ({len(search_candidates)} hits)"

    candidates = assign_candidate_labels(
        candidates, registry, window_start=window_start_date,
        window_end=window_end_date, adjacent_hosts=adjacent_hosts)
    candidates = collapse_candidates_by_url(candidates)
    candidates = collapse_candidates_by_title(candidates)
    candidates, skipped_seen = filter_seen_ledger(candidates, seen)

    # --- relevance pass ------------------------------------------------------
    if not do_classify:
        tiers["classification"] = "skipped (dry-run)" if args.dry_run else "skipped (--no-classify)"
    elif deterministic_preflight_failed:
        tiers["classification"] = "skipped (deterministic preflight failed)"
        warnings.append("Relevance pass skipped before paid work because the strict "
                        "deterministic preflight failed.")
    elif required_key_preflight_failed:
        if not anthropic_key:
            tiers["classification"] = "skipped (ANTHROPIC_API_KEY not set)"
            warnings.append("Relevance pass skipped: ANTHROPIC_API_KEY not set. "
                            "Candidates are carried through unclassified.")
        else:
            tiers["classification"] = "skipped (required API key preflight failed)"
            warnings.append("Relevance pass skipped before paid work because another "
                            "required API key is missing.")
    elif not anthropic_key:
        tiers["classification"] = "skipped (ANTHROPIC_API_KEY not set)"
        warnings.append("Relevance pass skipped: ANTHROPIC_API_KEY not set. "
                        "Candidates are carried through unclassified.")
    elif not candidates:
        tiers["classification"] = "skipped (no candidates)"
    else:
        dim_context = build_dimension_context(dimensions)
        candidates, err = classify_candidates(candidates, dim_context, args.model, anthropic_key)
        if err:
            tiers["classification"] = f"failed ({err})"
            warnings.append(f"Relevance pass did not complete: {err}. Candidates are unclassified.")
        else:
            tiers["classification"] = f"run (model {args.model})"

    # --- split, write --------------------------------------------------------
    surfaced, suppressed = _suppressed(candidates, threshold=args.surface_threshold)
    acceptance_errors = required_tier_errors(
        tiers, len(candidates),
        expect_deterministic=not args.no_deterministic,
        expect_search=do_search,
        expect_classification=do_classify,
        require_keys=args.require_keys,
        require_complete=args.require_complete,
        tavily_key=tavily_key,
        anthropic_key=anthropic_key,
    )
    for error in acceptance_errors:
        warnings.append(f"Required tier acceptance failed: {error}.")

    if not acceptance_errors:
        state["lastRun"] = now_iso()
        # Remember processed candidates only after required tiers pass. Otherwise
        # a retry could suppress failed, unclassified candidates and pass empty.
        for c in surfaced + suppressed:
            remember_candidate(state, c)

    suffix = args.out_suffix
    cand_path = Path(args.ledger_path) if args.ledger_path else CANDIDATES_DIR / f"{cycle}{suffix}.json"
    packet_path = Path(args.packet_path) if args.packet_path else DOCS_DIR / f"Source-Monitoring-Candidates-{cycle}{suffix}.md"

    compare_registry = load_json(args.compare_sources_file) if args.compare_sources_file else None
    delta = source_set_delta(registry, compare_registry)
    metadata = {
        "surfaceThreshold": args.surface_threshold,
        "normalThreshold": NORMAL_SURFACE_THRESHOLD,
        "windowStart": args.window_start,
        "windowEnd": args.window_end,
        "noDeterministic": bool(args.no_deterministic),
        "titleNote": args.title_note,
        "sourceSetDelta": delta,
        "acceptance": {
            "required": bool(args.require_keys or args.require_complete),
            "passed": not acceptance_errors,
            "errors": acceptance_errors,
        },
    }

    write_candidate_json(cand_path, cycle, tiers, surfaced, access_failures, suppressed,
                         skipped_seen=skipped_seen, metadata=metadata)
    packet = render_packet_md(cycle, tiers, registry, surfaced, access_failures,
                              suppressed, args.dry_run, warnings,
                              title_note=args.title_note,
                              surface_threshold=args.surface_threshold,
                              normal_threshold=NORMAL_SURFACE_THRESHOLD,
                              skipped_seen=skipped_seen,
                              source_delta=delta,
                              show_borderline=args.surface_threshold < NORMAL_SURFACE_THRESHOLD)
    packet_path.parent.mkdir(parents=True, exist_ok=True)
    packet_path.write_text(packet)
    if not acceptance_errors:
        write_json(args.state_file, state)

    print(f"Cycle {cycle}: {len(surfaced)} candidates surfaced, "
          f"{len(suppressed)} suppressed, {len(access_failures)} access failures.")
    print(f"  candidates: {cand_path}")
    print(f"  packet:     {packet_path}")
    if acceptance_errors:
        print(f"  state:      {args.state_file} (not advanced)")
    else:
        print(f"  state:      {args.state_file}")
    for w in warnings:
        print(f"  warning: {w}")
    for error in acceptance_errors:
        print(f"ERROR: {error}", file=sys.stderr)
    return 1 if acceptance_errors else 0


if __name__ == "__main__":
    sys.exit(main())
