#!/usr/bin/env python3
"""Lightweight checks for monitor_sources.py. No network, no API keys.

Run: python3 scripts/test_monitor_sources.py  (or `npm run test:monitor`)

These lock the things that matter for a monitor that must never move a grade:
the registry stays faithful to the data, the deterministic parser surfaces new
material and filters already-cited material, per-source state stays honest, and
the no-auto-grade invariants hold on every candidate.
"""
import json
import sys
import importlib.util
import tempfile
from pathlib import Path

import monitor_sources as m  # same directory on sys.path[0]

SCRIPT_DIR = Path(__file__).parent
FIXTURE = SCRIPT_DIR / "fixtures" / "fetch-results-sample.json"
FETCH_DATA_PATH = SCRIPT_DIR / "fetch-data.py"

CITED_PBO = ("https://www.pbo-dpb.ca/en/news-releases--communiques-de-presse/"
             "build-canada-homes-forecast-to-build-26000-units-pbo-maisons-canada-"
             "prevoit-de-construire-26-000-unites-selon-le-dpb")
CITED_ABACUS = ("https://abacusdata.ca/canadian-politics-carney-government-approval-"
                "and-liberal-lead-reach-new-highs-as-optimism-about-canada-improves/")
CITED_FRASER = ("https://www.fraserinstitute.org/commentary/carney-governments-gst-"
                "plan-new-name-same-flawed-affordability-strategy")

_results = []


def check(name, cond):
    _results.append((name, bool(cond)))
    print(("PASS" if cond else "FAIL"), name)


def load(path):
    return json.loads(Path(path).read_text())


def load_fetch_data_module():
    spec = importlib.util.spec_from_file_location("fetch_data", FETCH_DATA_PATH)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def load_monitor_input_validator():
    path = SCRIPT_DIR / "validate_monitor_inputs.py"
    spec = importlib.util.spec_from_file_location("validate_monitor_inputs", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def main():
    dims = load(m.DIMENSIONS_FILE)
    approval = load(m.APPROVAL_POLLS_FILE)
    fetch_data = load_fetch_data_module()
    monitor_inputs = load_monitor_input_validator()

    # --- registry build ---------------------------------------------------- #
    reg = m.build_registry(dims, approval)
    sources = reg["sources"]
    check("registry has a sensible number of surfaces", 30 < len(sources) < 200)
    check("every surface method is valid", all(s["method"] in m.VALID_METHODS for s in sources))
    check("every surface family is in the taxonomy", all(s["family"] in m.FAMILY_NAMES for s in sources))
    check("every surface has a stable id", all(s["id"] for s in sources))
    real_ids = {d["id"] for d in dims} | {"approval-signal"}
    stray = sorted({d for s in sources for d in s["dimensions"] if d not in real_ids})
    check("surface dimensions map to real dimension ids", not stray)
    if stray:
        print("   stray dimension ids:", stray)
    rss = [s for s in sources if s["method"] == "rss"]
    check("rss surfaces carry a feedUrl", all(s.get("feedUrl") for s in rss))
    ethics_surface = next((s for s in sources if s["id"] == "ethicscanada-ca"), None)
    check("Ethics migration uses the official-watchdog family",
          bool(ethics_surface) and ethics_surface["family"] == 4)
    check("Ethics migration uses the page-hash monitor",
          bool(ethics_surface) and ethics_surface["method"] == "page_hash")

    # --- deterministic parse over the fixture ------------------------------ #
    fixture = load(FIXTURE)
    state = {"schemaVersion": 1, "lastRun": None, "sources": {}}
    cands, fails = m.candidates_from_fetch_results(fixture, reg, state, "2026-06")
    disc = {c["discovery"] for c in cands}
    for d in ("statcan_wds", "rss", "legisinfo", "mpo_diff", "ethics_diff", "link_rot"):
        check(f"deterministic tier surfaced a {d} candidate", d in disc)

    urls = {c["url"] for c in cands}
    check("already-cited PBO item filtered out", CITED_PBO not in urls)
    check("already-cited Abacus item filtered out", CITED_ABACUS not in urls)
    check("already-cited Fraser item filtered out", CITED_FRASER not in urls)
    check("new PBO publication surfaced",
          any("fiscal-sustainability-report-2026" in (u or "") for u in urls))
    check("new Fraser study surfaced",
          any("federal-housing-starts-vs-targets-2026" in (u or "") for u in urls))
    check("a feed access failure was recorded", any(f.get("method") == "rss" for f in fails))
    check("every candidate has a stable fingerprint",
          all(c.get("candidateFingerprint") for c in cands))

    repeat_state = {"schemaVersion": 1, "lastRun": None, "sources": {}}
    repeated = cands[0]
    m.remember_candidate(repeat_state, repeated)
    cands_after_repeat, _ = m.candidates_from_fetch_results(fixture, reg, repeat_state, "2026-07")
    check("already-surfaced fingerprint is not emitted again",
          repeated["candidateFingerprint"] not in {c.get("candidateFingerprint") for c in cands_after_repeat})

    # --- the invariants that keep the monitor from moving a grade ---------- #
    check("no candidate can move a grade automatically",
          all(c["can_move_grade_automatically"] is False for c in cands))
    check("every candidate requires editor review",
          all(c["requires_editor_review"] is True for c in cands))
    # the fixture holds only deterministic-tier results; those are real signals,
    # not provisional. Search fan-out candidates (not present here) would be.
    check("deterministic candidates are not flagged provisional",
          all(c["provisional"] is False for c in cands))

    # --- per-source state honesty ------------------------------------------ #
    st = {"schemaVersion": 1, "sources": {}}
    m.mark_checked(st, "surface-x", ok=False, access_issue="http 403")
    sx = st["sources"]["surface-x"]
    check("failed check sets lastChecked", sx["lastChecked"] is not None)
    check("failed check does NOT advance lastSuccessfulCheck", sx["lastSuccessfulCheck"] is None)
    check("failed check records the access issue", sx["accessIssue"] == "http 403")
    m.mark_checked(st, "surface-x", ok=True)
    sx = st["sources"]["surface-x"]
    check("later success advances lastSuccessfulCheck", sx["lastSuccessfulCheck"] is not None)
    check("later success clears the access issue", sx["accessIssue"] is None)

    # --- candidate id is stable and safe by default ------------------------ #
    c1 = m._candidate("2026-06", "s", "rss", "t", "https://u", "snip")
    c2 = m._candidate("2026-06", "s", "rss", "t", "https://u", "snip")
    check("candidate id is stable for the same content", c1["candidate_id"] == c2["candidate_id"])
    check("candidate defaults to no auto grade move", c1["can_move_grade_automatically"] is False)
    check("candidate defaults to requires editor review", c1["requires_editor_review"] is True)
    check("candidate fingerprint is stable across cycles",
          c1["candidateFingerprint"] == m._candidate("2026-07", "s", "rss", "t", "https://u", "snip")["candidateFingerprint"])
    sample_email = "accessible" + "@" + "parl.gc.ca"
    sample_path = "/" + "Users/editor/private-note.md"
    scrubbed = m._candidate(
        "2026-06", "s", "rss", "Contact", "https://u",
        f"Write {sample_email} or see {sample_path}")
    check("candidate free text redacts emails before writing",
          sample_email not in scrubbed["snippet"])
    check("candidate free text redacts local paths before writing",
          sample_path not in scrubbed["snippet"])

    start_date, end_date = m.search_window_dates({"sources": {}}, "surface-x")
    check("search fan-out emits Tavily date strings", len(start_date) == 10 and len(end_date) == 10)
    check("search fan-out date range is ordered", start_date <= end_date)
    fixed_start, fixed_end = m.search_window_dates(
        {"sources": {}}, "surface-x", fixed_window=("2026-05-01", "2026-05-31"))
    check("search fan-out fixed window overrides state dates",
          (fixed_start, fixed_end) == ("2026-05-01", "2026-05-31"))

    # --- URL dedupe and mechanical labels --------------------------------- #
    label_registry = {
        "sources": [{
            "id": "finance-canada-ca",
            "searchDomains": ["canada.ca"],
            "citedUrls": ["https://www.canada.ca/en/department-finance/news/cited.html"],
        }]
    }
    dup_a = m._candidate("2026-06", "a", "search_fanout", "A",
                         "https://www.canada.ca/en/news/media-centre/item.html/",
                         "first", published="2026-06-05", dims=["fiscal-health"])
    dup_b = m._candidate("2026-06", "b", "search_fanout", "B",
                         "https://canada.ca/en/news/media-centre/item.html",
                         "", published="2026-06-05", dims=["housing-supply"])
    labeled = m.assign_candidate_labels(
        [dup_a, dup_b], label_registry,
        window_start=m.parse_dateish("2026-06-01"),
        window_end=m.parse_dateish("2026-06-13"),
    )
    collapsed = m.collapse_candidates_by_url(labeled)
    check("same normalized URL collapses across source surfaces", len(collapsed) == 1)
    check("URL dedupe unions affected dimensions",
          set(collapsed[0]["affected_dimensions"]) == {"fiscal-health", "housing-supply"})
    check("same-publisher source relationship assigned mechanically",
          collapsed[0]["sourceRelationship"] == "same-publisher-new-item")
    check("timing confidence assigned from the fixed window",
          collapsed[0]["timingConfidence"] == "published-in-June")

    adjacent_cand = m._candidate("2026-06", "adjacent-x", "search_fanout", "Adj",
                                 "https://pembina.org/report/example", "snippet",
                                 published=None, dims=["climate-environment"])
    m.assign_candidate_labels(
        [adjacent_cand], label_registry,
        window_start=m.parse_dateish("2026-06-01"),
        window_end=m.parse_dateish("2026-06-13"),
        adjacent_hosts={"pembina.org"},
    )
    check("adjacent authority source relationship assigned mechanically",
          adjacent_cand["sourceRelationship"] == "adjacent-authority-source")
    check("missing publication date becomes date-unclear",
          adjacent_cand["timingConfidence"] == "date-unclear")

    # --- threshold and seen-ledger behavior -------------------------------- #
    high = dict(c1, relevance_score=0.3, classification="context")
    low = dict(c1, relevance_score=0.07, classification="context")
    irrelevant = dict(c1, relevance_score=0.9, classification="irrelevant")
    surfaced_t, suppressed_t = m._suppressed([high, low, irrelevant], threshold=0.15)
    check("surface threshold shifts the surfaced/suppressed split",
          high in surfaced_t and low in suppressed_t and irrelevant in suppressed_t)

    with tempfile.TemporaryDirectory() as td:
        ledger = Path(td) / "seen.json"
        ledger.write_text(json.dumps({"candidates": [collapsed[0]], "suppressed": []}))
        seen = m.load_seen_ledger(ledger)
        kept, skipped = m.filter_seen_ledger(collapsed + [adjacent_cand], seen)
    check("seen-ledger suppresses already-seen URLs", collapsed[0] in skipped)
    check("seen-ledger keeps unseen candidates", adjacent_cand in kept)

    # --- fetch-data.py JSON output compatibility -------------------------- #
    try:
        encoded = json.dumps({"tokens": frozenset(["b", "a"])}, default=fetch_data.json_safe_default)
    except TypeError:
        encoded = ""
    check("fetch-data json_out serializes set-like parser internals",
          encoded == '{"tokens": ["a", "b"]}')

    ethics_fixture = """
      <a href="/en/report">Reports</a>
      <a href="/en/report/16ac877a2bcc8310bfa3f24aed91bf44">
        <span>The Example Report</span>
      </a>
      <a href="/en/about">Report an issue</a>
    """
    ethics_reports = fetch_data.extract_ethics_report_links(ethics_fixture)
    check("ethics parser accepts current detail links", ethics_reports == [{
        "title": "The Example Report",
        "url": "https://www.ethicscanada.ca/en/report/16ac877a2bcc8310bfa3f24aed91bf44",
    }])
    check("ethics parser rejects listing and navigation links", len(ethics_reports) == 1)

    # --- classifier never controls the safety flags ------------------------ #
    check("classifier tool schema cannot set the safety flags",
          "can_move_grade_automatically" not in json.dumps(m.CLASSIFIER_TOOL))

    # --- timingConfidence URL/title fallback (no Tavily publishedDate) ----- #
    ws = m.parse_dateish("2026-05-01"); we = m.parse_dateish("2026-05-31")
    check("timing from URL path /2026/05/",
          m.timing_confidence({"url": "https://www.canada.ca/en/x/news/2026/05/a.html",
                               "title": "a", "publishedDate": None}, ws, we) == "published-in-May")
    check("timing from title 'May 6, 2026'",
          m.timing_confidence({"url": "https://www.ourcommons.ca/x",
                               "title": "Hansard No. 118 - May 6, 2026", "publishedDate": None},
                              ws, we) == "published-in-May")
    check("timing out-of-window URL is found-now-window-relevant",
          m.timing_confidence({"url": "https://www.canada.ca/en/x/news/2025/12/z.html",
                               "title": "z", "publishedDate": None}, ws, we) == "found-now-window-relevant")
    check("timing with no recoverable date stays date-unclear",
          m.timing_confidence({"url": "https://example.org/no-date", "title": "no date",
                               "publishedDate": None}, ws, we) == "date-unclear")

    # --- near-duplicate collapse by host + title --------------------------- #
    near = [
        {"url": "https://www.canada.ca/en/x/news/2026/06/p0.html", "title": "Same Title",
         "affected_dimensions": ["climate-environment"], "relevance_score": 0.3},
        {"url": "https://www.canada.ca/en/x/news/2026/06/p.html", "title": "Same Title",
         "affected_dimensions": ["economic-policy"], "relevance_score": 0.4},
        {"url": "https://www.canada.ca/en/x/news/2026/06/q.html", "title": "Different Title",
         "affected_dimensions": ["housing-supply"], "relevance_score": 0.5},
    ]
    collapsed_t = m.collapse_candidates_by_title(near)
    merged = [c for c in collapsed_t if c.get("collapsedUrls")]
    check("near-dup collapse merges same host + title", len(collapsed_t) == 2)
    check("near-dup collapse unions dimensions",
          bool(merged) and set(merged[0]["affected_dimensions"]) == {"climate-environment", "economic-policy"})
    check("near-dup collapse preserves the dropped URL", bool(merged) and bool(merged[0]["collapsedUrls"]))
    check("near-dup collapse leaves distinct titles alone",
          any(c.get("title") == "Different Title" for c in collapsed_t))

    # --- browser-pull list sorted by score in the packet ------------------ #
    bp = [
        {"classification": "manual_browser_pull", "title": "LOW pull", "url": "https://x/low",
         "relevance_score": 0.2, "discovery": "search_fanout", "affected_dimensions": []},
        {"classification": "manual_browser_pull", "title": "HIGH pull", "url": "https://x/high",
         "relevance_score": 0.7, "discovery": "search_fanout", "affected_dimensions": []},
    ]
    packet = m.render_packet_md("2026-06", {}, {"sources": []}, bp, [], [], False, [])
    bp_section = packet.split("## Access failures and browser-pull list", 1)[1].split("## Suppressed", 1)[0]
    check("browser-pull list is sorted by score (high first)",
          bp_section.index("HIGH pull") < bp_section.index("LOW pull"))

    # --- workflow manual-dispatch input guard ----------------------------- #
    check("seen-ledger path allows candidate ledger",
          monitor_inputs.valid_seen_ledger_path("monitoring/candidates/2026-06.json"))
    check("seen-ledger path allows backtest ledger",
          monitor_inputs.valid_seen_ledger_path("monitoring/backtest/2026-06-parity.json"))
    check("seen-ledger path rejects traversal",
          not monitor_inputs.valid_seen_ledger_path("monitoring/candidates/../state.json"))
    check("seen-ledger path rejects nested files",
          not monitor_inputs.valid_seen_ledger_path("monitoring/candidates/archive/2026-06.json"))
    check("seen-ledger path rejects normalized separators",
          not monitor_inputs.valid_seen_ledger_path("monitoring/candidates//2026-06.json"))
    check("seen-ledger path rejects wrong extension",
          not monitor_inputs.valid_seen_ledger_path("monitoring/candidates/2026-06.txt"))
    check("seen-ledger path rejects absolute paths",
          not monitor_inputs.valid_seen_ledger_path("/monitoring/candidates/2026-06.json"))

    failed = [n for n, ok in _results if not ok]
    print()
    if failed:
        print(f"{len(failed)} of {len(_results)} checks FAILED:")
        for n in failed:
            print("  -", n)
        return 1
    print(f"all {len(_results)} checks passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
