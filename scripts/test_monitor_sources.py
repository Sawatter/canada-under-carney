#!/usr/bin/env python3
"""Lightweight checks for monitor_sources.py. No network, no API keys.

Run: python3 scripts/test_monitor_sources.py  (or `npm run test:monitor`)

These lock the things that matter for a monitor that must never move a grade:
the registry stays faithful to the data, the deterministic parser surfaces new
material and filters already-cited material, per-source state stays honest, and
the no-auto-grade invariants hold on every candidate.
"""
import json
import io
import os
import sys
import importlib.util
import tempfile
from contextlib import redirect_stderr, redirect_stdout
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

import requests

import monitor_sources as m  # same directory on sys.path[0]

SCRIPT_DIR = Path(__file__).parent
FIXTURE = SCRIPT_DIR / "fixtures" / "fetch-results-sample.json"
FETCH_DATA_PATH = SCRIPT_DIR / "fetch-data.py"
WORKFLOW_PATH = SCRIPT_DIR.parent / ".github" / "workflows" / "monthly-source-scout.yml"

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


def complete_fetch_payload(seed=None, coverage=None):
    """Build a structurally complete deterministic run with no new candidates."""
    results = {
        "statcan_food_cpi": {
            "status": "accessible", "url": "https://example.org/statcan/food",
            "dashboard_references": [{
                "dimension": "Fixture", "label": "Fixture reference",
                "periodDate": "2026-08-01",
            }],
            "metadata": {
                "status": "success", "productId": 1,
                "cubeEndDate": "2026-08-01", "releaseTime": "2026-09-01T08:30",
            },
            "freshness": {"status": "current"},
        },
        "statcan_unemployment": {
            "status": "accessible", "url": "https://example.org/statcan/jobs",
            "dashboard_references": [{
                "dimension": "Fixture", "label": "Fixture reference",
                "periodDate": "2026-08-01",
            }],
            "metadata": {
                "status": "success", "productId": 2,
                "cubeEndDate": "2026-08-01", "releaseTime": "2026-09-01T08:30",
            },
            "freshness": {"status": "current"},
        },
        "statcan_population": {
            "status": "accessible", "url": "https://example.org/statcan/population",
            "dashboard_references": [{
                "dimension": "Fixture", "label": "Fixture reference",
                "periodDate": "2026-08-01",
            }],
            "metadata": {
                "status": "success", "productId": 3,
                "cubeEndDate": "2026-08-01", "releaseTime": "2026-09-01T08:30",
            },
            "freshness": {"status": "current"},
        },
        "statcan_housing_starts": {
            "status": "accessible", "url": "https://example.org/statcan/housing",
            "dashboard_references": [{
                "dimension": "Fixture", "label": "Fixture reference",
                "periodDate": "2026-08-01",
            }],
            "metadata": {
                "status": "success", "productId": 4,
                "cubeEndDate": "2026-08-01", "releaseTime": "2026-09-01T08:30",
            },
            "freshness": {"status": "current"},
        },
        "statcan_trade": {
            "status": "accessible", "url": "https://example.org/statcan/trade",
            "dashboard_references": [{
                "dimension": "Fixture", "label": "Fixture reference",
                "periodDate": "2026-08-01",
            }],
            "metadata": {
                "status": "success", "productId": 5,
                "cubeEndDate": "2026-08-01", "releaseTime": "2026-09-01T08:30",
            },
            "freshness": {"status": "current"},
        },
        "ircc_permanent_residents": {
            "status": "success", "rows": 1, "header": "header", "last_row": "row",
            "latest_period": "2026-06",
        },
        "ircc_work_permits_imp": {
            "status": "success", "rows": 1, "header": "header", "last_row": "row",
            "latest_period": "2026-06",
        },
        "ircc_work_permits_tfwp": {
            "status": "success", "rows": 1, "header": "header", "last_row": "row",
            "latest_period": "2026-06",
        },
        "ircc_study_permits": {
            "status": "success", "rows": 1, "header": "header", "last_row": "row",
            "latest_period": "2026-06",
        },
        "boc_fx": {
            "status": "success",
            "latest": {"d": "2026-09-01", "FXCADUSD": {"v": "0.72"}},
        },
        "pbo_feed": {
            "status": "success", "count": 1,
            "publications": [{
                "title": "Already cited fixture", "link": CITED_PBO,
                "pubDate": "Tue, 01 Sep 2026 09:00:00 -0400",
            }],
        },
        "pollster_feeds": [{"pollster": "Fixture", "status": "success", "items": []}],
        "excluded_pollster_feeds": [{
            "pollster": "Excluded fixture", "status": "success", "items": [],
        }],
        "policy_feeds": [{"publisher": "Fixture", "status": "success", "items": []}],
        "legisinfo": [],
        "mpo_page": {
            "status": "success", "count": 1,
            "projects": [{"display": "Fixture project", "tokens": ["fixture"]}],
        },
        "mpo_diff": {
            "status": "success", "matched": [], "mpo_only": [], "cohort_only": [],
            "mpo_count": 0, "cohort_count": 0,
        },
        "ethics_reports_page": {
            "status": "success", "url": "https://example.org/ethics", "count": 1,
            "reports": [{"title": "Fixture report", "url": "https://example.org/report"}],
        },
        "ethics_reports_diff": {
            "status": "success", "additions": [], "removals": [],
            "currentCount": 1, "priorCacheFound": True,
        },
        "link_rot": [{"url": "https://example.org/live", "status": "live"}],
    }
    if seed:
        for key, value in json.loads(json.dumps(seed.get("results", {}))).items():
            if isinstance(results.get(key), dict) and isinstance(value, dict):
                base = results[key]
                merged = {**base, **value}
                for nested_key in ("metadata", "freshness", "latest"):
                    if (isinstance(base.get(nested_key), dict) and
                            isinstance(value.get(nested_key), dict)):
                        merged[nested_key] = {
                            **base[nested_key], **value[nested_key],
                        }
                results[key] = merged
            else:
                results[key] = value
        fixture_fx = (results.get("boc_fx") or {}).get("latest", {}).get("FXCADUSD")
        if isinstance(fixture_fx, str):
            results["boc_fx"]["latest"]["FXCADUSD"] = {"v": fixture_fx}
        for key in m.DETERMINISTIC_OBJECT_RESULT_FAMILIES[0][1]:
            value = results[key]
            if value.get("freshness", {}).get("status") == "newer_data_available":
                value["freshness"].setdefault(
                    "cubeEndDate", value["metadata"]["cubeEndDate"])
                value["freshness"].setdefault(
                    "latestDashboardReference",
                    value["dashboard_references"][0]["periodDate"],
                )
        mpo_diff = results.get("mpo_diff") or {}
        if mpo_diff.get("status") == "success":
            matched = mpo_diff.get("matched") or []
            mpo_diff["mpo_count"] = len(matched) + len(mpo_diff.get("mpo_only") or [])
            mpo_diff["cohort_count"] = (
                len(matched) + len(mpo_diff.get("cohort_only") or []))
    if coverage:
        results.update(json.loads(json.dumps(coverage)))
    return {
        "generatedAt": "2026-09-01T13:17:00+00:00",
        "cycle": "2026-09",
        "linkRot": True,
        "results": results,
    }


def run_acceptance_fixture(fetch_payload, *, search_result=([], []),
                           classify_effect=None, api_keys=True,
                           initial_state=None, extra_args=None):
    """Run strict acceptance against temp outputs with both paid calls mocked."""
    with tempfile.TemporaryDirectory() as td:
        root = Path(td)
        fetch_path = root / "fetch-results.json"
        state_path = root / "state.json"
        ledger_path = root / "candidates.json"
        packet_path = root / "candidates.md"
        fetch_path.write_text(json.dumps(fetch_payload))
        starting_state = initial_state or {"schemaVersion": 1, "lastRun": None, "sources": {}}
        state_path.write_text(json.dumps(starting_state))

        env = api_keys if isinstance(api_keys, dict) else {
            "TAVILY_API_KEY": "fixture-tavily-key" if api_keys else "",
            "ANTHROPIC_API_KEY": "fixture-anthropic-key" if api_keys else "",
        }
        classify_side_effect = (classify_effect if classify_effect is not None
                                else AssertionError("classification should not run"))
        stdout = io.StringIO()
        stderr = io.StringIO()
        with patch.dict(os.environ, env), \
                patch.object(m, "run_search_fanout", return_value=search_result) as search_mock, \
                patch.object(m, "classify_candidates", side_effect=classify_side_effect) as classify_mock, \
                redirect_stdout(stdout), redirect_stderr(stderr):
            argv = [
                "--cycle", "2026-09",
                "--fetch-results", str(fetch_path),
                "--state-file", str(state_path),
                "--ledger-path", str(ledger_path),
                "--packet-path", str(packet_path),
                "--require-keys",
                "--require-complete",
            ]
            argv.extend(extra_args or [])
            result = m.main(argv)

        return {
            "result": result,
            "ledger": load(ledger_path),
            "state": load(state_path),
            "initialState": starting_state,
            "stdout": stdout.getvalue(),
            "stderr": stderr.getvalue(),
            "searchCalls": search_mock.call_count,
            "classificationCalls": classify_mock.call_count,
        }


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

    search_registry = {
        "sources": [{
            "id": "fixture-search",
            "publisher": "Fixture publisher",
            "method": "search_fanout",
            "searchDomains": ["example.org"],
            "dimensions": ["housing-supply"],
        }],
    }
    success_payload = {
        "results": [{
            "title": "Fixture result",
            "url": "https://example.org/result",
            "content": "Fixture content",
            "published_date": "2026-09-01",
        }],
    }

    def tavily_response(status_code=200, payload=None, json_error=None):
        def parse_json():
            if json_error:
                raise json_error
            return success_payload if payload is None else payload

        return SimpleNamespace(status_code=status_code, json=parse_json)

    transient_search_cases = (
        ("HTTP 429", [tavily_response(429), tavily_response()]),
        ("HTTP 5xx", [tavily_response(503), tavily_response()]),
        ("network", [requests.ConnectionError("temporary connection failure"),
                     tavily_response()]),
        ("JSON", [tavily_response(json_error=ValueError("temporary decode failure")),
                  tavily_response()]),
    )
    for label, responses in transient_search_cases:
        retry_state = {"schemaVersion": 1, "sources": {}}
        with patch("requests.post", side_effect=responses) as post_mock, \
                patch.object(m.time, "sleep") as sleep_mock:
            retry_candidates, retry_failures = m.run_search_fanout(
                search_registry, retry_state, "2026-09", "fixture-key",
                fixed_window=("2026-09-01", "2026-09-30"))
        check(f"transient Tavily {label} failure retries once and succeeds",
              post_mock.call_count == 2 and sleep_mock.call_count == 1 and
              len(retry_candidates) == 1 and not retry_failures and
              retry_state["sources"]["fixture-search"]["lastSuccessfulCheck"] is not None)

    exhausted_state = {"schemaVersion": 1, "sources": {}}
    with patch("requests.post", side_effect=[tavily_response(503),
                                              tavily_response(503)]) as post_mock, \
            patch.object(m.time, "sleep") as sleep_mock:
        exhausted_candidates, exhausted_failures = m.run_search_fanout(
            search_registry, exhausted_state, "2026-09", "fixture-key",
            fixed_window=("2026-09-01", "2026-09-30"))
    check("exhausted Tavily retry remains a reported failure",
          post_mock.call_count == 2 and sleep_mock.call_count == 1 and
          not exhausted_candidates and len(exhausted_failures) == 1 and
          "after 2 attempts" in exhausted_failures[0]["detail"] and
          exhausted_state["sources"]["fixture-search"]["lastSuccessfulCheck"] is None)

    for label, status_code in (("auth", 401), ("non-retryable client", 400)):
        rejected_state = {"schemaVersion": 1, "sources": {}}
        with patch("requests.post", return_value=tavily_response(status_code)) as post_mock, \
                patch.object(m.time, "sleep") as sleep_mock:
            rejected_candidates, rejected_failures = m.run_search_fanout(
                search_registry, rejected_state, "2026-09", "fixture-key",
                fixed_window=("2026-09-01", "2026-09-30"))
        check(f"Tavily {label} failure is immediate and fail-closed",
              post_mock.call_count == 1 and sleep_mock.call_count == 0 and
              not rejected_candidates and len(rejected_failures) == 1)

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

    # --- fail-closed required-tier acceptance ------------------------------ #
    configured_feed_urls = {
        "pollster_feeds": {feed["url"] for feed in fetch_data.POLLSTER_FEEDS},
        "excluded_pollster_feeds": {
            feed["url"] for feed in fetch_data.EXCLUDED_POLLSTER_FEEDS
        },
        "policy_feeds": {feed["url"] for feed in fetch_data.POLICY_RSS_FEEDS},
    }
    check("deterministic feed coverage matches fetch-data configuration",
          m.EXPECTED_DETERMINISTIC_FEED_URLS == configured_feed_urls)

    official_bill_url = "https://www.parl.ca/legisinfo/en/bill/45-1/c-5"
    bare_bill_url = "https://parl.ca/legisinfo/en/bill/45-1/c-6"
    subdomain_bill_url = "https://legisinfo.parl.ca/en/bill/45-1/s-7"
    lookalike_bill_url = "https://parl.ca.example.org/legisinfo/en/bill/45-1/c-99"
    bill_dimensions = [{
        "name": "LEGISinfo host fixture",
        "sources": [
            {"url": official_bill_url},
            {"url": bare_bill_url},
            {"url": subdomain_bill_url},
            {"url": lookalike_bill_url},
        ],
    }]
    producer_bills = {
        f"{entry['parl']}/{entry['bill']}"
        for entry in fetch_data.collect_cited_bills(bill_dimensions)
    }
    check("fetch-data accepts official Parliament bill hosts",
          producer_bills == {"45-1/c-5", "45-1/c-6", "45-1/s-7"})
    check("fetch-data rejects a Parliament lookalike host",
          "45-1/c-99" not in producer_bills)

    bill_coverage = m.expected_deterministic_coverage(bill_dimensions)
    check("LEGISinfo coverage derives bills from the official host",
          bill_coverage["legisinfo"] == {"45-1/c-5", "45-1/c-6", "45-1/s-7"})
    check("non-Parliament bill-like URLs remain in link-rot coverage",
          lookalike_bill_url in bill_coverage["link_urls"])

    def insufficient_credit(candidates, *_args, **_kwargs):
        return candidates, "Claude request failed: insufficient credit"

    def classify_successfully(candidates, *_args, **_kwargs):
        for candidate in candidates:
            candidate["classification"] = "context"
            candidate["relevance_score"] = 0.5
            candidate["reason"] = "Fixture classification"
            candidate["evidence_limitations"] = "Fixture only"
            candidate["requires_editor_review"] = True
            candidate["can_move_grade_automatically"] = False
        return candidates, None

    expected_coverage = m.expected_deterministic_coverage(dims)
    deterministic_coverage = {}
    for key, urls in m.EXPECTED_DETERMINISTIC_FEED_URLS.items():
        deterministic_coverage[key] = []
        for url in sorted(urls):
            entry = {"url": url, "status": "success", "items": []}
            if key == "policy_feeds":
                entry.update({"count": 0, "topic_count": 0})
            else:
                entry.update({"all_count": 0, "relevant_count": 0})
                if key == "pollster_feeds":
                    entry.update({"new_count": 0, "cited_count": 0})
            deterministic_coverage[key].append(entry)
    deterministic_coverage["legisinfo"] = [
        {
            "parl": bill_key.split("/", 1)[0],
            "bill": bill_key.split("/", 1)[1],
            "citations": 1,
            "record": {"status": "blocked"},
        }
        for bill_key in sorted(expected_coverage["legisinfo"])
    ]
    deterministic_coverage["link_rot"] = [
        {"url": url, "status": "live"}
        for url in sorted(expected_coverage["link_urls"])
    ]

    def strict_payload_errors(payload):
        return m.deterministic_payload_errors(
            payload,
            expected_cycle="2026-09",
            require_link_rot=True,
            expected_link_urls=expected_coverage["link_urls"],
            expected_legisinfo=expected_coverage["legisinfo"],
        )

    complete_candidate_fetch = complete_fetch_payload(
        fixture, coverage=deterministic_coverage)
    complete_zero_fetch = complete_fetch_payload(coverage=deterministic_coverage)
    empty_fetch = {
        "generatedAt": "2026-09-01T13:17:00+00:00",
        "cycle": "2026-09",
        "linkRot": True,
        "results": {},
    }

    credit_failure = run_acceptance_fixture(
        complete_candidate_fetch,
        search_result=([], []),
        classify_effect=insufficient_credit,
    )
    check("insufficient-credit classification fails acceptance",
          credit_failure["result"] == 1 and
          credit_failure["ledger"]["tiers"]["classification"].startswith("failed (") and
          credit_failure["ledger"]["metadata"]["acceptance"]["passed"] is False)
    check("classification failure does not advance state",
          credit_failure["state"] == credit_failure["initialState"])
    failed_candidates = (credit_failure["ledger"].get("candidates", []) +
                         credit_failure["ledger"].get("suppressed", []))
    check("failed classification candidates still cannot move grades",
          bool(failed_candidates) and
          all(c["can_move_grade_automatically"] is False and
              c["requires_editor_review"] is True for c in failed_candidates))

    empty_failure = run_acceptance_fixture(empty_fetch, search_result=([], []))
    empty_errors = empty_failure["ledger"]["metadata"]["acceptance"]["errors"]
    check("empty deterministic results fail strict acceptance",
          empty_failure["result"] == 1 and
          empty_failure["ledger"]["tiers"]["deterministic"].startswith("failed (") and
          any("results object is empty" in error for error in empty_errors))
    check("empty deterministic results do not advance state",
          empty_failure["state"] == empty_failure["initialState"])

    missing_family_fetch = complete_fetch_payload(coverage=deterministic_coverage)
    del missing_family_fetch["results"]["ircc_study_permits"]
    missing_family = run_acceptance_fixture(missing_family_fetch, search_result=([], []))
    check("missing deterministic result family fails strict acceptance",
          missing_family["result"] == 1 and
          "IRCC results missing" in missing_family["ledger"]["tiers"]["deterministic"])
    check("failed deterministic preflight skips both paid tiers",
          missing_family["searchCalls"] == 0 and
          missing_family["classificationCalls"] == 0 and
          missing_family["ledger"]["tiers"]["search_fanout"] ==
          "skipped (deterministic preflight failed)" and
          missing_family["ledger"]["tiers"]["classification"] ==
          "skipped (deterministic preflight failed)" and
          missing_family["state"] == missing_family["initialState"])

    check("complete deterministic fixture satisfies strict coverage",
          not strict_payload_errors(complete_zero_fetch))

    missing_latest_period = complete_fetch_payload(
        coverage=deterministic_coverage)
    del missing_latest_period["results"]["ircc_permanent_residents"]["latest_period"]
    missing_latest_errors = strict_payload_errors(missing_latest_period)
    check("IRCC success payload requires latest period",
          any("ircc_permanent_residents success result is missing latest_period" in error
              for error in missing_latest_errors))

    malformed_ircc_fetch = complete_fetch_payload(
        coverage=deterministic_coverage)
    malformed_ircc_fetch["results"]["ircc_permanent_residents"] = {
        "status": "malformed_data",
        "error": "empty response",
    }
    malformed_ircc_run = run_acceptance_fixture(
        malformed_ircc_fetch, search_result=([], []))
    check("malformed IRCC data fails strict acceptance and records the exception",
          malformed_ircc_run["result"] == 1 and
          "returned malformed_data: empty response" in
          malformed_ircc_run["ledger"]["tiers"]["deterministic"] and
          malformed_ircc_run["ledger"]["counts"]["accessFailures"] == 1)
    check("malformed IRCC data does not advance state",
          malformed_ircc_run["state"] == malformed_ircc_run["initialState"])

    truncated_success_cases = (
        ("StatCan", "statcan_food_cpi", {"status": "accessible"}),
        ("IRCC", "ircc_permanent_residents", {"status": "success"}),
        ("Bank of Canada", "boc_fx", {"status": "success"}),
        ("PBO", "pbo_feed", {"status": "success"}),
        ("MPO page", "mpo_page", {"status": "success"}),
        ("MPO diff", "mpo_diff", {"status": "success"}),
        ("Ethics page", "ethics_reports_page", {"status": "success"}),
        ("Ethics diff", "ethics_reports_diff", {"status": "success"}),
    )
    for label, result_key, truncated_value in truncated_success_cases:
        truncated_fetch = complete_fetch_payload(coverage=deterministic_coverage)
        truncated_fetch["results"][result_key] = truncated_value
        truncated_run = run_acceptance_fixture(truncated_fetch, search_result=([], []))
        check(f"truncated {label} success payload fails strict acceptance",
              truncated_run["result"] == 1 and
              result_key in truncated_run["ledger"]["tiers"]["deterministic"])
        check(f"truncated {label} success payload does not advance state",
              truncated_run["state"] == truncated_run["initialState"])

    unusable_entry_cases = (
        ("StatCan", "statcan_food_cpi", {
            "status": "accessible", "url": "https://example.org/statcan",
            "dashboard_references": [{}], "metadata": {"status": "success"},
            "freshness": {"status": "newer_data_available"},
        }),
        ("PBO", "pbo_feed", {
            "status": "success", "count": 1, "publications": [{}],
        }),
        ("MPO page", "mpo_page", {
            "status": "success", "count": 1, "projects": [{}],
        }),
        ("MPO diff", "mpo_diff", {
            "status": "success", "matched": [], "mpo_only": [{}],
            "cohort_only": [], "mpo_count": 1, "cohort_count": 0,
        }),
        ("Ethics page", "ethics_reports_page", {
            "status": "success", "url": "https://example.org/ethics",
            "count": 1, "reports": [{}],
        }),
        ("Ethics diff", "ethics_reports_diff", {
            "status": "success", "additions": [{}], "removals": [],
            "currentCount": 1, "priorCacheFound": True,
        }),
    )
    for label, result_key, unusable_value in unusable_entry_cases:
        unusable_fetch = complete_fetch_payload(coverage=deterministic_coverage)
        unusable_fetch["results"][result_key] = unusable_value
        unusable_run = run_acceptance_fixture(
            unusable_fetch, search_result=([], []),
            classify_effect=classify_successfully)
        check(f"unusable {label} entry fails strict acceptance",
              unusable_run["result"] == 1 and
              result_key in unusable_run["ledger"]["tiers"]["deterministic"])
        check(f"unusable {label} entry does not advance state",
              unusable_run["state"] == unusable_run["initialState"])

    truncated_feed_fetch = complete_fetch_payload(coverage=deterministic_coverage)
    del truncated_feed_fetch["results"]["pollster_feeds"][0]["items"]
    truncated_feed = run_acceptance_fixture(
        truncated_feed_fetch, search_result=([], []))
    check("truncated successful feed payload fails strict acceptance",
          truncated_feed["result"] == 1 and
          "pollster_feeds[0]" in truncated_feed["ledger"]["tiers"]["deterministic"])
    check("truncated successful feed payload does not advance state",
          truncated_feed["state"] == truncated_feed["initialState"])

    unusable_feed_fetch = complete_fetch_payload(coverage=deterministic_coverage)
    unusable_feed_fetch["results"]["pollster_feeds"][0].update({
        "items": [{}], "all_count": 1, "relevant_count": 1,
        "new_count": 1, "cited_count": 0,
    })
    unusable_feed = run_acceptance_fixture(
        unusable_feed_fetch, search_result=([], []),
        classify_effect=classify_successfully)
    check("unusable successful feed entry fails strict acceptance",
          unusable_feed["result"] == 1 and
          "pollster_feeds[0]" in unusable_feed["ledger"]["tiers"]["deterministic"])
    check("unusable successful feed entry does not advance state",
          unusable_feed["state"] == unusable_feed["initialState"])

    truncated_bill_fetch = complete_fetch_payload(coverage=deterministic_coverage)
    truncated_bill_fetch["results"]["legisinfo"][0]["record"] = {"status": ""}
    truncated_bill = run_acceptance_fixture(
        truncated_bill_fetch, search_result=([], []))
    check("truncated LEGISinfo record fails strict acceptance",
          truncated_bill["result"] == 1 and
          "legisinfo" in truncated_bill["ledger"]["tiers"]["deterministic"])
    check("truncated LEGISinfo record does not advance state",
          truncated_bill["state"] == truncated_bill["initialState"])

    unusable_bill_fetch = complete_fetch_payload(coverage=deterministic_coverage)
    unusable_bill_fetch["results"]["legisinfo"][0]["record"] = {"status": "success"}
    unusable_bill = run_acceptance_fixture(
        unusable_bill_fetch, search_result=([], []),
        classify_effect=classify_successfully)
    check("unusable successful LEGISinfo record fails strict acceptance",
          unusable_bill["result"] == 1 and
          "legisinfo" in unusable_bill["ledger"]["tiers"]["deterministic"])
    check("unusable successful LEGISinfo record does not advance state",
          unusable_bill["state"] == unusable_bill["initialState"])

    wrong_cycle_fetch = complete_fetch_payload(coverage=deterministic_coverage)
    wrong_cycle_fetch["cycle"] = "2026-08"
    wrong_cycle = run_acceptance_fixture(wrong_cycle_fetch, search_result=([], []))
    check("wrong deterministic payload cycle fails strict acceptance",
          wrong_cycle["result"] == 1 and
          any("requested cycle" in error for error in
              strict_payload_errors(wrong_cycle_fetch)))
    check("wrong deterministic payload cycle does not advance state",
          wrong_cycle["state"] == wrong_cycle["initialState"])

    false_link_rot_fetch = complete_fetch_payload(coverage=deterministic_coverage)
    false_link_rot_fetch["linkRot"] = False
    false_link_rot = run_acceptance_fixture(false_link_rot_fetch, search_result=([], []))
    check("strict live payload rejects a false linkRot marker",
          false_link_rot["result"] == 1 and
          any("linkRot must be true" in error for error in
              strict_payload_errors(false_link_rot_fetch)))
    check("false linkRot marker does not advance state",
          false_link_rot["state"] == false_link_rot["initialState"])

    missing_link_rot_fetch = complete_fetch_payload(coverage=deterministic_coverage)
    del missing_link_rot_fetch["results"]["link_rot"]
    missing_link_rot = run_acceptance_fixture(
        missing_link_rot_fetch, search_result=([], []))
    check("strict live payload rejects a missing link scan",
          missing_link_rot["result"] == 1 and
          any("link_rot results are missing" in error for error in
              strict_payload_errors(missing_link_rot_fetch)))
    check("missing link scan does not advance state",
          missing_link_rot["state"] == missing_link_rot["initialState"])

    truncated_coverage_cases = (
        ("pollster", "pollster_feeds"),
        ("excluded pollster", "excluded_pollster_feeds"),
        ("policy feed", "policy_feeds"),
        ("link-rot", "link_rot"),
    )
    for label, result_key in truncated_coverage_cases:
        truncated_fetch = complete_fetch_payload(coverage=deterministic_coverage)
        truncated_fetch["results"][result_key].pop()
        truncated_run = run_acceptance_fixture(truncated_fetch, search_result=([], []))
        check(f"truncated {label} coverage fails strict acceptance",
              truncated_run["result"] == 1 and
              any("coverage mismatch" in error for error in
                  strict_payload_errors(truncated_fetch)))
        check(f"truncated {label} coverage does not advance state",
              truncated_run["state"] == truncated_run["initialState"])

    retained_search_candidate = m._candidate(
        "2026-09", "fixture-source", "search_fanout", "Retained hit",
        "https://example.org/retained", "Fixture search result",
        provisional=True, dims=["housing-supply"])
    search_failure = run_acceptance_fixture(
        complete_zero_fetch,
        search_result=([retained_search_candidate], [{
            "surface": "Fixture publisher",
            "method": "search_fanout",
            "detail": "tavily http 500",
        }]),
        classify_effect=classify_successfully,
    )
    check("partial Tavily search failure fails acceptance",
          search_failure["result"] == 1 and
          search_failure["ledger"]["counts"]["surfaced"] == 1 and
          search_failure["ledger"]["tiers"]["search_fanout"].startswith("failed (") and
          search_failure["ledger"]["metadata"]["acceptance"]["passed"] is False)
    check("search failure does not advance state",
          search_failure["state"] == search_failure["initialState"])

    zero_candidates = run_acceptance_fixture(complete_zero_fetch, search_result=([], []))
    check("zero-candidate classification skip passes acceptance",
          zero_candidates["result"] == 0 and
          zero_candidates["ledger"]["tiers"]["classification"] == "skipped (no candidates)" and
          zero_candidates["ledger"]["metadata"]["acceptance"]["passed"] is True)
    check("accepted zero-candidate run advances state",
          zero_candidates["state"].get("lastRun") is not None)

    blocked_fetch = complete_fetch_payload(coverage=deterministic_coverage)
    blocked_fetch["results"]["pbo_feed"] = {"status": "http_403"}
    blocked_fetch["results"]["mpo_page"] = {"status": "blocked"}
    del blocked_fetch["results"]["mpo_diff"]
    blocked_fetch["results"]["ethics_reports_page"] = {"status": "blocked"}
    blocked_fetch["results"]["ethics_reports_diff"] = {"status": "blocked"}
    blocked_run = run_acceptance_fixture(blocked_fetch, search_result=([], []))
    check("blocked deterministic surfaces remain structurally complete",
          blocked_run["result"] == 0 and
          blocked_run["ledger"]["tiers"]["deterministic"].startswith("run (") and
          blocked_run["ledger"]["counts"]["accessFailures"] == 2)

    incomplete_retry_fetch = complete_fetch_payload(
        fixture, coverage=deterministic_coverage)
    del incomplete_retry_fetch["results"]["ircc_study_permits"]
    failed_retry = run_acceptance_fixture(
        incomplete_retry_fetch,
        search_result=([], []),
        classify_effect=classify_successfully,
    )
    successful_retry = run_acceptance_fixture(
        complete_candidate_fetch,
        search_result=([], []),
        classify_effect=classify_successfully,
        initial_state=failed_retry["state"],
    )
    check("incomplete deterministic retry keeps candidates eligible",
          failed_retry["result"] == 1 and
          failed_retry["ledger"]["counts"]["surfaced"] > 0 and
          successful_retry["result"] == 0 and
          successful_retry["ledger"]["counts"]["surfaced"] ==
          failed_retry["ledger"]["counts"]["surfaced"])
    check("successful deterministic retry advances state only once accepted",
          failed_retry["state"] == failed_retry["initialState"] and
          successful_retry["state"].get("lastRun") is not None)

    dry_failure = run_acceptance_fixture(
        empty_fetch, api_keys=False, extra_args=["--dry-run"])
    check("strict dry-run still rejects incomplete deterministic input",
          dry_failure["result"] == 1 and dry_failure["searchCalls"] == 0 and
          dry_failure["classificationCalls"] == 0)
    dry_without_deterministic = run_acceptance_fixture(
        empty_fetch, api_keys=False,
        extra_args=["--dry-run", "--no-deterministic"])
    check("dry-run preserves explicit no-deterministic exemption",
          dry_without_deterministic["result"] == 0 and
          dry_without_deterministic["ledger"]["tiers"]["deterministic"] ==
          "intentionally_skipped (--no-deterministic)")

    missing_keys = run_acceptance_fixture(complete_zero_fetch, api_keys={
        "TAVILY_API_KEY": "fixture-tavily-key",
        "ANTHROPIC_API_KEY": "",
    })
    missing_errors = missing_keys["ledger"]["metadata"]["acceptance"]["errors"]
    check("missing live API keys fail acceptance",
          missing_keys["result"] == 1 and
          any("ANTHROPIC_API_KEY" in error for error in missing_errors))
    check("missing-key preflight blocks all paid tiers",
          missing_keys["searchCalls"] == 0 and
          missing_keys["classificationCalls"] == 0)

    missing_deterministic = m.required_tier_errors(
        {
            "deterministic": "not_run (no fetch-results file)",
            "search_fanout": "run (0 hits)",
            "classification": "skipped (no candidates)",
        },
        0,
        expect_deterministic=True,
        expect_search=True,
        expect_classification=True,
        require_keys=True,
        require_complete=True,
        tavily_key="fixture-key",
        anthropic_key="fixture-key",
    )
    check("missing live deterministic results fail acceptance",
          any("Deterministic tier" in error for error in missing_deterministic))

    incomplete_without_key_gate = m.required_tier_errors(
        {
            "deterministic": "run (fixture.json)",
            "search_fanout": "skipped (TAVILY_API_KEY not set)",
            "classification": "skipped (ANTHROPIC_API_KEY not set)",
        },
        0,
        expect_deterministic=True,
        expect_search=True,
        expect_classification=True,
        require_keys=False,
        require_complete=True,
        tavily_key=None,
        anthropic_key=None,
    )
    check("tier completion fails without the separate key gate",
          len(incomplete_without_key_gate) == 2)

    explicitly_disabled = m.required_tier_errors(
        {
            "deterministic": "intentionally_skipped (--no-deterministic)",
            "search_fanout": "skipped (--no-search)",
            "classification": "skipped (--no-classify)",
        },
        0,
        expect_deterministic=False,
        expect_search=False,
        expect_classification=False,
        require_keys=True,
        require_complete=True,
        tavily_key=None,
        anthropic_key=None,
    )
    check("explicitly disabled tiers are exempt from acceptance", not explicitly_disabled)

    empty_classifier_response = SimpleNamespace(content=[], stop_reason="end_turn")
    fake_anthropic = SimpleNamespace(Anthropic=lambda **_kwargs: SimpleNamespace(
        messages=SimpleNamespace(create=lambda **_call_kwargs: empty_classifier_response)))
    with patch.dict(sys.modules, {"anthropic": fake_anthropic}):
        omitted_candidates, omitted_error = m.classify_candidates(
            [dict(c1)], [], "fixture-model", "fixture-key")
    check("classifier omissions fail completeness",
          bool(omitted_candidates) and
          "omitted classifications" in (omitted_error or ""))
    check("omitted classifier rows cannot move grades",
          all(c["can_move_grade_automatically"] is False and
              c["requires_editor_review"] is True for c in omitted_candidates))

    real_classify_candidates = m.classify_candidates

    def run_classifier_row(row):
        candidate = m._candidate(
            "2026-09", "fixture-source", "search_fanout", "Classifier fixture",
            "https://example.org/classifier", "Fixture search result",
            provisional=True, dims=["housing-supply"])
        response_row = dict(row)
        response_row["candidate_id"] = candidate["candidate_id"]
        response = SimpleNamespace(content=[SimpleNamespace(
            type="tool_use",
            input={"classifications": [response_row]},
        )])
        fake_module = SimpleNamespace(Anthropic=lambda **_kwargs: SimpleNamespace(
            messages=SimpleNamespace(create=lambda **_call_kwargs: response)))
        with patch.dict(sys.modules, {"anthropic": fake_module}):
            return run_acceptance_fixture(
                complete_zero_fetch,
                search_result=([candidate], []),
                classify_effect=real_classify_candidates,
            )

    valid_classifier_row = {
        "classification": "context",
        "affected_dimensions": ["housing-supply"],
        "relevance_score": 0.5,
        "reason": "Relevant housing context.",
    }
    optional_limitations = run_classifier_row(valid_classifier_row)
    check("classifier accepts a valid row without evidence limitations",
          optional_limitations["result"] == 0 and
          optional_limitations["state"].get("lastRun") is not None)

    irrelevant_row = dict(valid_classifier_row)
    irrelevant_row["classification"] = "irrelevant"
    irrelevant_row["affected_dimensions"] = []
    irrelevant_run = run_classifier_row(irrelevant_row)
    check("irrelevant classification may omit affected dimensions",
          irrelevant_run["result"] == 0 and
          irrelevant_run["state"].get("lastRun") is not None)

    missing_classification = dict(valid_classifier_row)
    del missing_classification["classification"]
    invalid_classification = dict(valid_classifier_row, classification="grade_move")
    missing_score = dict(valid_classifier_row)
    del missing_score["relevance_score"]
    string_score = dict(valid_classifier_row, relevance_score="0.5")
    out_of_range_score = dict(valid_classifier_row, relevance_score=1.01)
    missing_reason = dict(valid_classifier_row)
    del missing_reason["reason"]
    empty_reason = dict(valid_classifier_row, reason="   ")
    missing_dimensions = dict(valid_classifier_row)
    del missing_dimensions["affected_dimensions"]
    empty_relevant_dimensions = dict(valid_classifier_row, affected_dimensions=[])
    unknown_dimensions = dict(
        valid_classifier_row, affected_dimensions=["not-a-dashboard-dimension"])
    non_list_dimensions = dict(
        valid_classifier_row, affected_dimensions="housing-supply")
    invalid_classifier_rows = (
        ("missing classification", missing_classification),
        ("invalid classification", invalid_classification),
        ("missing relevance score", missing_score),
        ("nonnumeric relevance score", string_score),
        ("out-of-range relevance score", out_of_range_score),
        ("missing reason", missing_reason),
        ("empty reason", empty_reason),
        ("missing affected dimensions", missing_dimensions),
        ("empty affected dimensions", empty_relevant_dimensions),
        ("unknown affected dimension", unknown_dimensions),
        ("non-list affected dimensions", non_list_dimensions),
    )
    for label, row in invalid_classifier_rows:
        invalid_run = run_classifier_row(row)
        check(f"classifier completeness rejects {label}",
              invalid_run["result"] == 1 and
              invalid_run["ledger"]["tiers"]["classification"].startswith("failed ("))
        check(f"{label} does not advance state",
              invalid_run["state"] == invalid_run["initialState"])

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

    def workflow_section(text, start, end=None):
        if start not in text:
            return ""
        section = text.split(start, 1)[1]
        if end is not None:
            return section.split(end, 1)[0] if end in section else ""
        return section

    workflow = WORKFLOW_PATH.read_text()
    prepare_branch_marker = "- name: Prepare review branch"
    fetch_marker = "- name: Run source fetch and link-rot scan"
    live_marker = "- name: Run source monitor (deterministic + search fan-out + relevance pass)"
    generate_ledger_marker = "- name: Generate source ledger"
    validate_ledger_marker = "- name: Validate source ledger coverage"
    registry_marker = "- name: Reconstruct backtest source registry"
    backtest_marker = "- name: Run source monitor backtest"
    artifact_marker = "- name: Upload source-scout artifacts"
    guard_marker = "- name: Guard committed files for local paths"
    pr_marker = "- name: Open or update the review PR"
    check("required workflow step markers are present",
          all(marker in workflow for marker in (
              prepare_branch_marker, fetch_marker, generate_ledger_marker,
              validate_ledger_marker, live_marker, registry_marker, backtest_marker,
              artifact_marker, guard_marker, pr_marker)))
    prepare_branch_step = workflow_section(workflow, prepare_branch_marker, fetch_marker)
    generate_ledger_step = workflow_section(
        workflow, generate_ledger_marker, validate_ledger_marker)
    live_step = workflow_section(workflow, live_marker, registry_marker)
    backtest_step = workflow_section(workflow, backtest_marker, artifact_marker)
    guard_step = workflow_section(workflow, guard_marker, pr_marker)
    pr_step = workflow_section(workflow, pr_marker)
    check("source-ledger workflow reuses an existing cycle ledger",
          'LEDGER="docs/Source-Coverage-Ledger-$CYCLE_MONTH.md"' in generate_ledger_step
          and 'if [[ -f "$LEDGER" ]]' in generate_ledger_step
          and "Using existing source ledger: $LEDGER" in generate_ledger_step)
    check("review-branch reruns restore the in-progress cycle ledger",
          'LEDGER="docs/Source-Coverage-Ledger-$CYCLE_MONTH.md"' in prepare_branch_step
          and 'git cat-file -e "origin/$BRANCH:$LEDGER"' in prepare_branch_step
          and 'git checkout "origin/$BRANCH" -- "$LEDGER"' in prepare_branch_step)
    check("source-ledger generation does not force overwrite",
          "--force" not in generate_ledger_step)
    check("source-ledger generation runs before validation",
          0 <= workflow.find(generate_ledger_marker) < workflow.find(validate_ledger_marker))
    check("live workflow explicitly requires API keys and complete tiers",
          "--require-keys" in live_step and "--require-complete" in live_step)
    check("backtest workflow explicitly requires API keys and complete tiers",
          "--require-keys" in backtest_step and "--require-complete" in backtest_step)
    check("live monitor failure is not ignored",
          "continue-on-error" not in live_step)
    check("review PR step cannot run after a failed monitor",
          "if: env.BACKTEST_LABEL == ''" in pr_step and "if: always()" not in pr_step)
    check("local-path guard covers the cycle ledger",
          'git status --porcelain -- monitoring docs/Source-Monitoring-Candidates-*.md '
          '"docs/Source-Coverage-Ledger-$CYCLE_MONTH.md"' in guard_step)
    check("review PR stages the cycle ledger",
          'docs/Source-Coverage-Ledger-"$CYCLE_MONTH".md' in pr_step)

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
