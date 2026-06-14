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
import os
import re
import sys
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
NORMAL_SURFACE_THRESHOLD = 0.15
EMAIL_RE = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b")
LOCAL_PATH_RE = re.compile(r"(^|[\s(\"'])((?:/Users|/home)/[^\s)\"']+)")

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
    "ciec-ccie.parl.gc.ca": 4,
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
    "ciec-ccie.parl.gc.ca": "Conflict of Interest and Ethics Commissioner",
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
    "ciec-ccie.parl.gc.ca",  # Ethics Commissioner investigation reports
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
        "ciec-ccie.parl.gc.ca": "Host intermittently returns 403/503 to command-line fetchers; browser pull may be needed.",
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
        mark_checked(state, slugify("ciec-ccie.parl.gc.ca"), True)
    elif ed:
        access_failures.append({"surface": "Conflict of Interest and Ethics Commissioner",
                                "method": "page_hash", "detail": ed.get("status")})
        mark_checked(state, slugify("ciec-ccie.parl.gc.ca"), False,
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
        try:
            resp = requests.post(TAVILY_ENDPOINT, json=payload, timeout=40)
            if resp.status_code != 200:
                access_failures.append({"surface": src["publisher"],
                                        "method": "search_fanout",
                                        "detail": f"tavily http {resp.status_code}"})
                mark_checked(state, src["id"], False,
                             access_issue=f"tavily http {resp.status_code}")
                continue
            data = resp.json()
        except Exception as e:  # network / json
            access_failures.append({"surface": src["publisher"],
                                    "method": "search_fanout", "detail": str(e)})
            mark_checked(state, src["id"], False, access_issue=str(e))
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


def classify_candidates(candidates, dim_context, model, api_key, batch_size=12):
    """Run the relevance pass. Returns (classified_candidates, error_or_None).
    Hard-sets the safety invariants regardless of model output."""
    try:
        import anthropic
    except Exception:
        return candidates, "anthropic SDK not installed"

    client = anthropic.Anthropic(api_key=api_key)
    by_id = {c["candidate_id"]: c for c in candidates}
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
                rows = block.input.get("classifications", [])
                break

        for row in rows:
            cand = by_id.get(row.get("candidate_id"))
            if not cand:
                continue
            cls = row.get("classification")
            cand["classification"] = cls if cls in VALID_CLASSIFICATIONS else "manual_browser_pull"
            dims = row.get("affected_dimensions") or cand["affected_dimensions"]
            cand["affected_dimensions"] = sorted(set(dims))
            try:
                cand["relevance_score"] = round(float(row.get("relevance_score")), 3)
            except (TypeError, ValueError):
                cand["relevance_score"] = None
            cand["reason"] = scrub_public_text(row.get("reason")).strip()[:600]
            cand["evidence_limitations"] = scrub_public_text(row.get("evidence_limitations")).strip()[:400]
            # safety invariants are never delegated to the model
            cand["requires_editor_review"] = True
            cand["can_move_grade_automatically"] = False

    return list(by_id.values()), None


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
        det_candidates, det_failures = candidates_from_fetch_results(
            results_payload, registry, state, cycle)
        tiers["deterministic"] = f"run ({fetch_path.name})"
    else:
        det_candidates, det_failures = [], []
        tiers["deterministic"] = "not_run (no fetch-results file)"
        warnings.append("Deterministic tier did not run: no fetch-results file. "
                        "Run `fetch-data.py --json-out` first. This is not a clean cycle.")

    candidates = list(det_candidates)
    access_failures = list(det_failures)

    # --- search fan-out tier -------------------------------------------------
    if not do_search:
        tiers["search_fanout"] = "skipped (dry-run)" if args.dry_run else "skipped (--no-search)"
    elif not tavily_key:
        tiers["search_fanout"] = "skipped (TAVILY_API_KEY not set)"
        warnings.append("Search fan-out tier skipped: TAVILY_API_KEY not set. "
                        "Feed-less and blocked surfaces were not surveyed this run.")
        if args.require_keys:
            print("ERROR: TAVILY_API_KEY required but not set", file=sys.stderr)
            return 1
    else:
        search_candidates, search_failures = run_search_fanout(
            registry, state, cycle, tavily_key, fixed_window=fixed_window,
            adjacent_entries=adjacent_entries)
        candidates.extend(search_candidates)
        access_failures.extend(search_failures)
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
    elif not anthropic_key:
        tiers["classification"] = "skipped (ANTHROPIC_API_KEY not set)"
        warnings.append("Relevance pass skipped: ANTHROPIC_API_KEY not set. "
                        "Candidates are carried through unclassified.")
        if args.require_keys:
            print("ERROR: ANTHROPIC_API_KEY required but not set", file=sys.stderr)
            return 1
    elif not candidates:
        tiers["classification"] = "skipped (no candidates)"
    else:
        dim_context = build_dimension_context(dimensions)
        candidates, err = classify_candidates(candidates, dim_context, args.model, anthropic_key)
        if err:
            tiers["classification"] = f"skipped ({err})"
            warnings.append(f"Relevance pass did not complete: {err}. Candidates are unclassified.")
        else:
            tiers["classification"] = f"run (model {args.model})"

    # --- split, write --------------------------------------------------------
    surfaced, suppressed = _suppressed(candidates, threshold=args.surface_threshold)
    state["lastRun"] = now_iso()
    # Remember every processed candidate, including low-relevance suppressions,
    # so unchanged items do not consume editor/model attention again next cycle.
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
    write_json(args.state_file, state)

    print(f"Cycle {cycle}: {len(surfaced)} candidates surfaced, "
          f"{len(suppressed)} suppressed, {len(access_failures)} access failures.")
    print(f"  candidates: {cand_path}")
    print(f"  packet:     {packet_path}")
    print(f"  state:      {args.state_file}")
    for w in warnings:
        print(f"  warning: {w}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
