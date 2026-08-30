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
import errno
import hashlib
import os
import re
import subprocess
import sys
import importlib.util
import tempfile
from contextlib import nullcontext, redirect_stderr, redirect_stdout
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch
from urllib.parse import quote, urlparse

import requests

import monitor_sources as m  # same directory on sys.path[0]

SCRIPT_DIR = Path(__file__).parent
FIXTURE = SCRIPT_DIR / "fixtures" / "fetch-results-sample.json"
DRYRUN_FIXTURE = SCRIPT_DIR / "fixtures" / "fetch-results-dryrun.json"
EMPTY_STATE_FIXTURE = SCRIPT_DIR / "fixtures" / "monitor-state-empty.json"
DRYRUN_ETHICS_PRIOR_CACHE = (
    SCRIPT_DIR / "fixtures" / "ethics-reports-prior.json")
FETCH_DATA_PATH = SCRIPT_DIR / "fetch-data.py"
PRIVACY_SCAN_PATH = SCRIPT_DIR / "privacy_scan.py"
PRE_COMMIT_PATH = SCRIPT_DIR / "git-hooks" / "pre-commit"
WORKFLOW_PATH = SCRIPT_DIR.parent / ".github" / "workflows" / "monthly-source-scout.yml"

CITED_PBO = ("https://www.pbo-dpb.ca/en/news-releases--communiques-de-presse/"
             "build-canada-homes-forecast-to-build-26000-units-pbo-maisons-canada-"
             "prevoit-de-construire-26-000-unites-selon-le-dpb")
CITED_ABACUS = ("https://abacusdata.ca/canadian-politics-carney-government-approval-"
                "and-liberal-lead-reach-new-highs-as-optimism-about-canada-improves/")
CITED_FRASER = ("https://www.fraserinstitute.org/commentary/carney-governments-gst-"
                "plan-new-name-same-flawed-affordability-strategy")
SYNTHETIC_PRIVATE_EMAIL = "private" + "@" + "example.com"
SYNTHETIC_BYPASS_EMAIL = "bypass" + "@" + "example.test"
SYNTHETIC_USER_PATH = "/" + "Users/Alice/private"
SYNTHETIC_HOME_PATH = "/" + "home/runner/private.pem"
FIXTURE_GIT_EMAIL = "fixture" + "@" + "users.noreply.github.com"
SYNTHETIC_ETHICS_KEY = "/en/report/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
SYNTHETIC_ETHICS_PRIOR_CACHE = {
    "sourceUrl": m.ETHICS_REPORTS_URL,
    "reports": [{
        "title": "Previously accepted fixture report",
        "url": "https://www.ethicscanada.ca" + SYNTHETIC_ETHICS_KEY,
    }],
}

_results = []


def check(name, cond):
    _results.append((name, bool(cond)))
    print(("PASS" if cond else "FAIL"), name)


def load(path):
    return json.loads(Path(path).read_text())


def state_unchanged(run):
    return run["stateBytes"] == run["initialStateBytes"]


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


def complete_ircc_result(result_key):
    """Build one strict synthetic IRCC result for monitor contract tests."""
    contract = m.IRCC_RESULT_CONTRACTS[result_key]
    columns = sorted(contract["required_columns"])
    return {
        "status": "success",
        "dataset_key": contract["dataset_key"],
        "source_url": contract["source_url"],
        "rows": 12,
        "period_count": 12,
        "earliest_period": "2025-09",
        "latest_period": "2026-08",
        "header": "\t".join(columns),
        "columns": columns,
        "response_sha256": "a" * 64,
        "last_row": "\t".join("Synthetic" for _ in columns),
    }


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
        "ircc_permanent_residents": complete_ircc_result(
            "ircc_permanent_residents"),
        "ircc_work_permits_imp": complete_ircc_result(
            "ircc_work_permits_imp"),
        "ircc_work_permits_tfwp": complete_ircc_result(
            "ircc_work_permits_tfwp"),
        "ircc_study_permits": complete_ircc_result("ircc_study_permits"),
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
        "pollster_feeds": [{
            "pollster": "Fixture", "status": "success", "items": [],
            "all_count": 1, "relevant_count": 0, "new_count": 0,
            "cited_count": 0,
        }],
        "excluded_pollster_feeds": [{
            "pollster": "Excluded fixture", "status": "success", "items": [],
            "all_count": 1, "relevant_count": 0,
        }],
        "policy_feeds": [{
            "publisher": "Fixture", "status": "success", "count": 1,
            "topic_count": 0, "items": [{
                "title": "Synthetic non-topic item",
                "link": "https://example.org/synthetic/non-topic",
                "pubDate": "Tue, 01 Sep 2026 09:00:00 -0400",
                "topic_match": False,
            }],
        }],
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
            "status": "success", "url": m.ETHICS_REPORTS_URL, "count": 1,
            "reports": [{
                "title": "Fixture report",
                "url": ("https://www.ethicscanada.ca/en/report/"
                        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"),
            }],
        },
        "ethics_reports_diff": {
            "status": "success", "additions": [], "removals": [],
            "priorCount": 1, "currentCount": 1, "priorCacheFound": True,
            "priorReportKeys": [
                "/en/report/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"],
            "currentReportKeys": [
                "/en/report/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"],
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
        ethics_page = results.get("ethics_reports_page") or {}
        ethics_diff = results.get("ethics_reports_diff") or {}
        if (ethics_page.get("status") == "success" and
                ethics_diff.get("status") == "success"):
            additions = []
            for index, report in enumerate(ethics_diff.get("additions") or []):
                additions.append({
                    "title": report.get("title") or f"Fixture addition {index + 1}",
                    "url": ("https://www.ethicscanada.ca/en/report/"
                            f"fixtureaddition{index + 1}"),
                })
            reports = list(ethics_page.get("reports") or []) + additions
            prior_reports = reports[:-len(additions)] if additions else reports
            ethics_page.update({
                "url": m.ETHICS_REPORTS_URL,
                "count": len(reports),
                "reports": reports,
            })
            ethics_diff.update({
                "additions": additions,
                "removals": [],
                "priorCount": len(reports) - len(additions),
                "currentCount": len(reports),
                "priorReportKeys": [
                    urlparse(report["url"]).path.lower().rstrip("/")
                    for report in prior_reports
                ],
                "currentReportKeys": [
                    urlparse(report["url"]).path.lower().rstrip("/")
                    for report in reports
                ],
            })
    if coverage:
        results.update(json.loads(json.dumps(coverage)))
    return {
        "generatedAt": "2026-09-01T13:17:00+00:00",
        "cycle": "2026-09",
        "linkRot": True,
        "results": results,
    }


def discovery_fetch_payload():
    """Small deterministic payload that exercises each candidate route."""
    return {
        "generatedAt": "2026-06-13T13:17:00+00:00",
        "cycle": "2026-06",
        "linkRot": True,
        "results": {
            "statcan_food_cpi": {
                "status": "accessible",
                "url": "https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1810000401",
                "metadata": {
                    "status": "success",
                    "cubeTitleEn": "Consumer Price Index food fixture",
                    "cubeEndDate": "2026-05-01",
                    "releaseTime": "2026-06-17T08:30",
                },
                "freshness": {"status": "newer_data_available"},
            },
            "pbo_feed": {
                "status": "success",
                "count": 2,
                "publications": [{
                    "title": "Fiscal Sustainability Report 2026",
                    "link": ("https://www.pbo-dpb.ca/en/publications/"
                             "RP-2627-001-S--fiscal-sustainability-report-2026"),
                    "pubDate": "Tue, 09 Jun 2026 13:00:00 GMT",
                }, {
                    "title": "Already cited PBO fixture",
                    "link": CITED_PBO,
                    "pubDate": "Mon, 12 May 2026 13:00:00 GMT",
                }],
            },
            "pollster_feeds": [{
                "pollster": "Abacus Data",
                "status": "success",
                "items": [{
                    "title": "New approval fixture",
                    "link": "https://abacusdata.ca/new-approval-fixture/",
                    "pubDate": "Wed, 11 Jun 2026 10:00:00 GMT",
                    "is_cited": False,
                }, {
                    "title": "Already cited Abacus fixture",
                    "link": CITED_ABACUS,
                    "is_cited": True,
                }],
            }, {
                "pollster": "Leger",
                "status": "http_error",
                "items": [],
            }],
            "policy_feeds": [{
                "publisher": "Fraser Institute",
                "status": "success",
                "items": [{
                    "title": "Federal housing starts versus targets",
                    "link": ("https://www.fraserinstitute.org/studies/"
                             "federal-housing-starts-vs-targets-2026"),
                    "topic_match": True,
                }, {
                    "title": "Already cited Fraser fixture",
                    "link": CITED_FRASER,
                    "topic_match": True,
                }],
            }],
            "legisinfo": [{
                "bill": "c-5",
                "record": {
                    "status": "success",
                    "url": "https://www.parl.ca/legisinfo/en/bill/45-1/c-5",
                    "number_code": "C-5",
                    "current_status": "Royal Assent",
                    "latest_stage": "Royal Assent received",
                    "ongoing_stage": "Completed",
                },
            }],
            "mpo_diff": {
                "status": "success",
                "mpo_only": [{
                    "display": "Cedar LNG Phase 2 expansion",
                    "tokens": ["cedar", "lng", "phase", "2", "expansion"],
                }],
            },
            "ethics_reports_diff": {
                "status": "success",
                "additions": [{
                    "title": "Conflict of Interest Act fixture report",
                    "url": ("https://ciec-ccie.parl.gc.ca/en/investigations-enquetes/"
                            "Pages/ExampleReport-2026.aspx"),
                }],
            },
            "link_rot": [{
                "label": "ECCC fixture",
                "url": ("https://www.canada.ca/en/environment-climate-change/"
                        "corporate/transparency/example-moved.html"),
                "status": "broken_with_archive",
            }],
        },
    }


def run_acceptance_fixture(fetch_payload, *, search_result=([], []),
                           classify_effect=None, api_keys=True,
                           initial_state=None, extra_args=None, strict=True,
                           use_default_state=False, raw_fetch_text=None,
                           raw_fetch_bytes=None, initial_state_bytes=None,
                           seen_ledger_payload=None, raw_seen_text=None,
                           raw_seen_bytes=None, omit_seen_file=False,
                           seen_is_directory=False,
                           carry_forward_payload=None,
                           raw_carry_text=None, raw_carry_bytes=None,
                           omit_carry_file=False, carry_is_directory=False,
                           omit_fetch_file=False, omit_fetch_argument=False,
                           fetch_is_directory=False, cycle="2026-09",
                           packet_failure_write=None, ledger_failure_write=None,
                           omit_initial_state=False, rollback_failure=False,
                           preexisting_recovery_marker=False,
                           recovery_marker_create_failure=False,
                           recovery_marker_clear_failure=False,
                           retry_after_failure=False,
                           output_collision=None, input_collision_option=None,
                           input_collision_case_alias=False,
                           state_alias_kind=None,
                           ethics_prior_cache_payload=None,
                           omit_ethics_prior_cache=False,
                           ethics_prior_cache_is_directory=False):
    """Run the monitor against temporary outputs with both paid calls mocked."""
    with tempfile.TemporaryDirectory() as td:
        root = Path(td)
        fetch_path = root / "fetch-results.json"
        state_path = root / "state.json"
        recovery_marker_path = m.state_recovery_marker_path(state_path)
        ledger_path = root / "candidates.json"
        packet_path = root / "candidates.md"
        seen_ledger_path = root / "seen-ledger.json"
        carry_forward_path = root / "carry-forward.json"
        ethics_prior_cache_path = root / "ethics-prior-cache.json"
        if output_collision == "ledger-state":
            ledger_path = state_path
        elif output_collision == "packet-state":
            packet_path = state_path
        elif output_collision == "ledger-packet":
            packet_path = ledger_path
        elif output_collision == "ledger-recovery-marker":
            ledger_path = recovery_marker_path
        if fetch_is_directory:
            fetch_path.mkdir()
        elif not omit_fetch_file:
            if raw_fetch_bytes is not None:
                fetch_path.write_bytes(raw_fetch_bytes)
            else:
                fetch_path.write_text(
                    raw_fetch_text if raw_fetch_text is not None else
                    json.dumps(fetch_payload))
        if initial_state_bytes is not None:
            state_path.write_bytes(initial_state_bytes)
            try:
                starting_state = json.loads(initial_state_bytes.decode("utf-8"))
            except (UnicodeDecodeError, json.JSONDecodeError):
                starting_state = None
        elif omit_initial_state:
            starting_state = {
                "schemaVersion": 1,
                "lastRun": None,
                "sources": {},
            }
        else:
            starting_state = (
                initial_state if initial_state is not None else
                {
                    "schemaVersion": 1,
                    "lastRun": None,
                    "sources": {},
                    "sentinel": {"token": "preserve-state", "version": 1},
                }
            )
            state_path.write_text(json.dumps(starting_state, separators=(",", ":")) + "\n")
        starting_state_bytes = (
            state_path.read_bytes() if state_path.exists() else None)
        starting_state_mode = (
            state_path.stat().st_mode & 0o777 if state_path.exists() else None)
        invocation_state_path = state_path
        if state_alias_kind == "hardlink":
            invocation_state_path = root / "state-hardlink.json"
            os.link(state_path, invocation_state_path)
        elif state_alias_kind == "symlink":
            invocation_state_path = root / "state-symlink.json"
            invocation_state_path.symlink_to(state_path)
        if preexisting_recovery_marker:
            recovery_marker_path.write_text(
                '{"schemaVersion":1,"status":"fixture-pending"}\n')
            recovery_marker_path.chmod(0o600)
        seen_requested = (
            seen_ledger_payload is not None or raw_seen_text is not None or
            raw_seen_bytes is not None or omit_seen_file or seen_is_directory
        )
        if seen_requested and not omit_seen_file:
            if seen_is_directory:
                seen_ledger_path.mkdir()
            elif raw_seen_bytes is not None:
                seen_ledger_path.write_bytes(raw_seen_bytes)
            else:
                seen_ledger_path.write_text(
                    raw_seen_text if raw_seen_text is not None else
                    json.dumps(seen_ledger_payload))
        carry_requested = (
            carry_forward_payload is not None or raw_carry_text is not None or
            raw_carry_bytes is not None or omit_carry_file or
            carry_is_directory
        )
        if carry_requested and not omit_carry_file:
            if carry_is_directory:
                carry_forward_path.mkdir()
            elif raw_carry_bytes is not None:
                carry_forward_path.write_bytes(raw_carry_bytes)
            else:
                carry_forward_path.write_text(
                    raw_carry_text if raw_carry_text is not None else
                    json.dumps(carry_forward_payload))

        payload_results = fetch_payload.get("results") if isinstance(
            fetch_payload, dict) else None
        ethics_diff = payload_results.get("ethics_reports_diff") if isinstance(
            payload_results, dict) else None
        ethics_prior_requested = (
            isinstance(ethics_diff, dict) and
            ethics_diff.get("priorCacheFound") is True and
            "--no-deterministic" not in (extra_args or [])
        )
        if ethics_prior_requested and not omit_ethics_prior_cache:
            if ethics_prior_cache_is_directory:
                ethics_prior_cache_path.mkdir()
            else:
                prior_keys = ethics_diff.get("priorReportKeys")
                usable_prior_keys = [
                    key for key in (prior_keys or [])
                    if isinstance(key, str) and key.strip()
                ]
                derived_prior_cache = {
                    "sourceUrl": m.ETHICS_REPORTS_URL,
                    "reports": [{
                        "title": f"Previously accepted fixture report {index + 1}",
                        "url": "https://www.ethicscanada.ca" + key,
                    } for index, key in enumerate(usable_prior_keys)],
                }
                ethics_prior_cache_path.write_text(json.dumps(
                    ethics_prior_cache_payload
                    if ethics_prior_cache_payload is not None else
                    (derived_prior_cache if usable_prior_keys else
                     SYNTHETIC_ETHICS_PRIOR_CACHE)))

        env = api_keys if isinstance(api_keys, dict) else {
            "TAVILY_API_KEY": "fixture-tavily-key" if api_keys else "",
            "ANTHROPIC_API_KEY": "fixture-anthropic-key" if api_keys else "",
        }
        classify_side_effect = (classify_effect if classify_effect is not None
                                else AssertionError("classification should not run"))
        stdout = io.StringIO()
        stderr = io.StringIO()
        packet_write_calls = 0
        ledger_write_calls = 0
        real_path_write_text = Path.write_text

        def controlled_write_text(path, *args, **kwargs):
            nonlocal ledger_write_calls, packet_write_calls
            if path == packet_path:
                packet_write_calls += 1
                if packet_write_calls == packet_failure_write:
                    raise OSError(
                        errno.EIO, "fixture packet write failure", str(packet_path))
            if path == ledger_path:
                ledger_write_calls += 1
                if ledger_write_calls == ledger_failure_write:
                    raise OSError(
                        errno.EIO, "fixture ledger write failure", str(ledger_path))
            return real_path_write_text(path, *args, **kwargs)

        output_context = (
            patch.object(Path, "write_text", new=controlled_write_text)
            if (packet_failure_write is not None or
                ledger_failure_write is not None) else nullcontext())
        state_context = (patch.object(m, "STATE_FILE", state_path)
                         if use_default_state else nullcontext())
        rollback_context = (
            patch.object(
                m, "restore_file_snapshot_atomic",
                side_effect=OSError(
                    errno.EIO, "fixture rollback failure", str(state_path)))
            if rollback_failure else nullcontext())
        marker_create_context = (
            patch.object(
                m, "create_state_recovery_marker",
                side_effect=OSError(
                    errno.EIO, "fixture marker create failure",
                    str(recovery_marker_path)))
            if recovery_marker_create_failure else nullcontext())
        marker_clear_context = (
            patch.object(
                m, "clear_state_recovery_marker",
                side_effect=OSError(
                    errno.EIO, "fixture marker clear failure",
                    str(recovery_marker_path)))
            if recovery_marker_clear_failure else nullcontext())
        retry_stdout = io.StringIO()
        retry_stderr = io.StringIO()
        retry_result = None
        retry_search_calls = 0
        retry_classification_calls = 0
        with state_context, output_context, rollback_context, \
                marker_create_context, marker_clear_context, \
                patch.dict(os.environ, env), \
                patch.object(
                    m, "load_fetch_results",
                    wraps=m.load_fetch_results) as fetch_load_mock, \
                patch.object(m, "run_search_fanout", return_value=search_result) as search_mock, \
                patch.object(m, "classify_candidates", side_effect=classify_side_effect) as classify_mock:
            argv = [
                "--cycle", cycle,
                "--ledger-path", str(ledger_path),
                "--packet-path", str(packet_path),
            ]
            if not omit_fetch_argument:
                argv.extend(["--fetch-results", str(fetch_path)])
            if not use_default_state:
                argv.extend(["--state-file", str(invocation_state_path)])
            if strict:
                argv.extend(["--require-keys", "--require-complete"])
            if seen_requested:
                argv.extend(["--seen-ledger", str(seen_ledger_path)])
            if carry_requested:
                argv.extend(["--carry-forward-ledger", str(carry_forward_path)])
            if ethics_prior_requested:
                argv.extend(["--ethics-prior-cache", str(ethics_prior_cache_path)])
            argv.extend(extra_args or [])
            if input_collision_option:
                collision_input_path = recovery_marker_path
                if input_collision_case_alias:
                    collision_input_path = Path(str(recovery_marker_path).swapcase())
                argv.extend([input_collision_option, str(collision_input_path)])
            with redirect_stdout(stdout), redirect_stderr(stderr):
                result = m.main(argv)
            first_search_calls = search_mock.call_count
            first_classification_calls = classify_mock.call_count
            if retry_after_failure:
                with redirect_stdout(retry_stdout), redirect_stderr(retry_stderr):
                    retry_result = m.main(argv)
                retry_search_calls = search_mock.call_count - first_search_calls
                retry_classification_calls = (
                    classify_mock.call_count - first_classification_calls)

        final_state_bytes = (
            state_path.read_bytes() if state_path.exists() else None)
        if state_path.exists():
            try:
                final_state = load(state_path)
            except (UnicodeDecodeError, json.JSONDecodeError):
                final_state = None
        else:
            final_state = None
        return {
            "result": result,
            "ledger": load(ledger_path) if ledger_path.exists() else None,
            "packet": packet_path.read_text() if packet_path.exists() else None,
            "state": final_state,
            "initialState": starting_state,
            "initialStateBytes": starting_state_bytes,
            "initialStateMode": starting_state_mode,
            "stateBytes": final_state_bytes,
            "stateMode": (
                state_path.stat().st_mode & 0o777
                if state_path.exists() else None),
            "stdout": stdout.getvalue(),
            "stderr": stderr.getvalue(),
            "searchCalls": first_search_calls,
            "searchCallKwargs": (
                search_mock.call_args.kwargs if search_mock.call_args else None),
            "classificationCalls": first_classification_calls,
            "fetchLoadCalls": fetch_load_mock.call_count,
            "ledgerWriteCalls": ledger_write_calls,
            "packetWriteCalls": packet_write_calls,
            "recoveryMarkerExists": recovery_marker_path.exists(),
            "recoveryMarkerBytes": (
                recovery_marker_path.read_bytes()
                if recovery_marker_path.exists() else None),
            "recoveryMarkerMode": (
                recovery_marker_path.stat().st_mode & 0o777
                if recovery_marker_path.exists() else None),
            "retryResult": retry_result,
            "retryStdout": retry_stdout.getvalue(),
            "retryStderr": retry_stderr.getvalue(),
            "retrySearchCalls": retry_search_calls,
            "retryClassificationCalls": retry_classification_calls,
            "searchStopOnFailure": [
                call.kwargs.get("stop_on_failure")
                for call in search_mock.call_args_list
            ],
            "argv": tuple(argv),
            "fetchExists": fetch_path.exists(),
            "ledgerExists": ledger_path.exists(),
            "packetExists": packet_path.exists(),
            "stateExists": state_path.exists(),
            "seenLedgerExists": seen_ledger_path.exists(),
            "carryForwardExists": carry_forward_path.exists(),
            "ethicsPriorCacheExists": ethics_prior_cache_path.exists(),
            "root": str(root),
        }


def run_diagnostic_retry_fixture(fetch_payload, *, diagnostic_extra_args,
                                 diagnostic_search_result=([], []),
                                 diagnostic_classify_effect=None,
                                 retry_search_result=([], []),
                                 retry_classify_effect=None):
    """Run a diagnostic and strict retry against one physical state file."""
    with tempfile.TemporaryDirectory() as td:
        root = Path(td)
        fetch_path = root / "fetch-results.json"
        state_path = root / "state.json"
        ethics_prior_cache_path = root / "ethics-prior-cache.json"
        fetch_path.write_text(json.dumps(fetch_payload))
        ethics_prior_cache_path.write_text(json.dumps(
            SYNTHETIC_ETHICS_PRIOR_CACHE))
        initial_state = {
            "schemaVersion": 1,
            "lastRun": "2026-08-01T12:00:00+00:00",
            "sentinel": {"token": "preserve-existing-state", "version": 1},
            "sources": {
                "sentinel-source": {
                    "lastChecked": "2026-08-01T12:00:00+00:00",
                    "lastSuccessfulCheck": "2026-08-01T12:00:00+00:00",
                    "surfacedFingerprints": ["sentinel-fingerprint"],
                    "accessIssue": None,
                },
            },
        }
        state_path.write_text(json.dumps(initial_state, indent=2) + "\n")
        initial_state_bytes = state_path.read_bytes()
        env = {
            "TAVILY_API_KEY": "fixture-tavily-key",
            "ANTHROPIC_API_KEY": "fixture-anthropic-key",
        }

        def invoke(label, *, strict, extra_args, search_result, classify_effect):
            ledger_path = root / f"{label}.json"
            packet_path = root / f"{label}.md"
            before_state_bytes = state_path.read_bytes()
            stdout = io.StringIO()
            stderr = io.StringIO()
            classify_side_effect = (
                classify_effect if classify_effect is not None else
                AssertionError("classification should not run"))
            with patch.dict(os.environ, env), \
                    patch.object(
                        m, "run_search_fanout", return_value=search_result) as search_mock, \
                    patch.object(
                        m, "classify_candidates",
                        side_effect=classify_side_effect) as classify_mock, \
                    redirect_stdout(stdout), redirect_stderr(stderr):
                argv = [
                    "--cycle", "2026-09",
                    "--fetch-results", str(fetch_path),
                    "--state-file", str(state_path),
                    "--ledger-path", str(ledger_path),
                    "--packet-path", str(packet_path),
                    "--ethics-prior-cache", str(ethics_prior_cache_path),
                ]
                if strict:
                    argv.extend(["--require-keys", "--require-complete"])
                argv.extend(extra_args)
                result = m.main(argv)
            final_state_bytes = state_path.read_bytes()
            return {
                "result": result,
                "ledger": load(ledger_path),
                "state": load(state_path),
                "beforeStateBytes": before_state_bytes,
                "stateBytes": final_state_bytes,
                "stdout": stdout.getvalue(),
                "stderr": stderr.getvalue(),
                "searchCalls": search_mock.call_count,
                "searchCallKwargs": (
                    search_mock.call_args.kwargs if search_mock.call_args else None),
                "classificationCalls": classify_mock.call_count,
                "searchStopOnFailure": [
                    call.kwargs.get("stop_on_failure")
                    for call in search_mock.call_args_list
                ],
            }

        diagnostic = invoke(
            "diagnostic",
            strict=False,
            extra_args=diagnostic_extra_args,
            search_result=diagnostic_search_result,
            classify_effect=diagnostic_classify_effect,
        )
        retry = invoke(
            "retry",
            strict=True,
            extra_args=[],
            search_result=retry_search_result,
            classify_effect=retry_classify_effect,
        )
        return {
            "initialState": initial_state,
            "initialStateBytes": initial_state_bytes,
            "diagnostic": diagnostic,
            "retry": retry,
        }


def run_state_write_failure_fixture(fetch_payload, failure_stage, *, existing_state):
    """Exercise one atomic state-write failure through the monitor entry point."""
    with tempfile.TemporaryDirectory() as td:
        root = Path(td)
        fetch_path = root / "fetch-results.json"
        state_path = root / "isolated-state.json"
        recovery_marker_path = m.state_recovery_marker_path(state_path)
        ledger_path = root / "candidates.json"
        packet_path = root / "candidates.md"
        ethics_prior_cache_path = root / "ethics-prior-cache.json"
        fetch_path.write_text(json.dumps(fetch_payload))
        ethics_prior_cache_path.write_text(json.dumps(
            SYNTHETIC_ETHICS_PRIOR_CACHE))

        initial_state_bytes = None
        initial_state_mode = None
        if existing_state:
            initial_state_bytes = (
                b'{"schemaVersion":1,"lastRun":"2026-08-01T12:00:00+00:00",'
                b'"sources":{},"sentinel":"preserve-exact-bytes"}\n'
            )
            state_path.write_bytes(initial_state_bytes)
            state_path.chmod(0o640)
            initial_state_mode = state_path.stat().st_mode & 0o777

        failure_messages = {
            "temp_write": "fixture temp write failure",
            "fsync": "fixture fsync failure",
            "replace": "fixture replace failure",
        }
        failure_message = failure_messages[failure_stage]
        failure = OSError(errno.EIO, failure_message, str(state_path))

        real_named_temporary_file = m.tempfile.NamedTemporaryFile

        class FailingTempFile:
            def __init__(self, handle):
                self._handle = handle
                self.name = handle.name

            def __enter__(self):
                self._handle.__enter__()
                return self

            def __exit__(self, exc_type, exc_value, traceback):
                return self._handle.__exit__(exc_type, exc_value, traceback)

            def write(self, value):
                self._handle.write(value[:16])
                self._handle.flush()
                raise failure

            def flush(self):
                return self._handle.flush()

            def fileno(self):
                return self._handle.fileno()

        def failing_named_temporary_file(*args, **kwargs):
            handle = real_named_temporary_file(*args, **kwargs)
            if kwargs.get("prefix") == f".{state_path.name}.":
                return FailingTempFile(handle)
            return handle

        real_fsync = m.os.fsync
        fsync_calls = 0

        def failing_state_fsync(fd):
            nonlocal fsync_calls
            fsync_calls += 1
            if fsync_calls == 2:
                raise failure
            return real_fsync(fd)

        def failing_state_replace(src, dst):
            if Path(dst).resolve() == state_path.resolve():
                raise failure
            return real_replace(src, dst)

        real_replace = m.os.replace

        if failure_stage == "temp_write":
            fault = patch.object(
                m.tempfile, "NamedTemporaryFile",
                side_effect=failing_named_temporary_file)
        elif failure_stage == "fsync":
            fault = patch.object(m.os, "fsync", side_effect=failing_state_fsync)
        else:
            fault = patch.object(m.os, "replace", side_effect=failing_state_replace)

        stdout = io.StringIO()
        stderr = io.StringIO()
        env = {
            "TAVILY_API_KEY": "fixture-tavily-key",
            "ANTHROPIC_API_KEY": "fixture-anthropic-key",
        }
        with patch.dict(os.environ, env), \
                patch.object(m, "run_search_fanout", return_value=([], [])), \
                patch.object(
                    m, "classify_candidates",
                    side_effect=AssertionError("classification should not run")), \
                fault, redirect_stdout(stdout), redirect_stderr(stderr):
            result = m.main([
                "--cycle", "2026-09",
                "--fetch-results", str(fetch_path),
                "--state-file", str(state_path),
                "--ledger-path", str(ledger_path),
                "--packet-path", str(packet_path),
                "--ethics-prior-cache", str(ethics_prior_cache_path),
                "--require-keys", "--require-complete",
            ])

        return {
            "result": result,
            "initialStateBytes": initial_state_bytes,
            "initialStateMode": initial_state_mode,
            "stateExists": state_path.exists(),
            "stateBytes": state_path.read_bytes() if state_path.exists() else None,
            "stateMode": (
                state_path.stat().st_mode & 0o777 if state_path.exists() else None),
            "recoveryMarkerExists": recovery_marker_path.exists(),
            "tempFiles": sorted(
                path.name for path in root.glob(f".{state_path.name}.*.tmp")),
            "ledger": load(ledger_path) if ledger_path.exists() else None,
            "packet": packet_path.read_text() if packet_path.exists() else None,
            "stdout": stdout.getvalue(),
            "stderr": stderr.getvalue(),
            "root": str(root),
            "expectedError": (
                f"ERROR: could not persist state file {state_path.name}: "
                f"{failure_message}\n"),
            "expectedMetadataError": (
                f"could not persist state file {state_path.name}: "
                f"{failure_message}"),
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
    fixture = discovery_fetch_payload()
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
    injected_feed_url = "https://abacusdata.ca/injected-failed-feed-item"
    failed_feed_fixture = discovery_fetch_payload()
    failed_feed_fixture["results"]["pollster_feeds"][0].update({
        "status": "error",
        "items": [{
            "title": "Injected failed-feed item",
            "link": injected_feed_url,
            "pubDate": "Tue, 01 Sep 2026 09:00:00 -0400",
            "is_cited": False,
        }],
    })
    failed_feed_candidates, failed_feed_access = m.candidates_from_fetch_results(
        failed_feed_fixture, reg,
        {"schemaVersion": 1, "lastRun": None, "sources": {}}, "2026-06")
    check("failed feeds are skipped before candidate extraction",
          injected_feed_url not in {
              candidate["url"] for candidate in failed_feed_candidates
          } and any(failure.get("method") == "rss"
                    for failure in failed_feed_access))
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

    tracking_state = {"schemaVersion": 1, "lastRun": None, "sources": {}}
    tracking_original = m._candidate(
        "2026-08", "tracking-source", "rss", "Stable title",
        "https://example.org/report?utm_source=august", "Stable snippet")
    tracking_variant = m._candidate(
        "2026-09", "tracking-source", "rss", "Stable title",
        "https://example.org/report?utm_source=september", "Stable snippet")
    changed_title = m._candidate(
        "2026-09", "tracking-source", "rss", "Changed title",
        "https://example.org/report?utm_source=september", "Stable snippet")
    changed_snippet = m._candidate(
        "2026-09", "tracking-source", "rss", "Stable title",
        "https://example.org/report?utm_source=september", "Changed snippet")
    m.remember_candidate(tracking_state, tracking_original)
    check("tracking-only URL changes stay suppressed across cycles",
          tracking_original["candidateFingerprint"] !=
          tracking_variant["candidateFingerprint"] and
          m.already_surfaced(tracking_state, tracking_variant))
    check("real title or snippet changes remain eligible",
          not m.already_surfaced(tracking_state, changed_title) and
          not m.already_surfaced(tracking_state, changed_snippet))
    legacy_raw_state = {
        "schemaVersion": 1,
        "lastRun": None,
        "sources": {
            tracking_original["sourceId"]: {
                "surfacedFingerprints": [
                    tracking_original["candidateFingerprint"]],
            },
        },
    }
    check("legacy raw fingerprint state remains compatible",
          m.already_surfaced(legacy_raw_state, tracking_original))

    retention_state = {"schemaVersion": 1, "lastRun": None, "sources": {}}
    current_retention_row = {
        "sourceId": "retention-source",
        "candidateFingerprint": "deadbeef",
        "candidate_id": "2026-09-current",
    }
    carried_retention_rows = [{
        "sourceId": "retention-source",
        "candidateFingerprint": f"{index:08x}",
        "candidate_id": f"2026-09-carried-{index}",
    } for index in range(80)]
    m.remember_accepted_candidates(
        retention_state,
        [current_retention_row] + carried_retention_rows,
        [], 1, 0)
    retained = retention_state["sources"]["retention-source"]
    check("current fingerprint survives an 80-row carry-forward boundary",
          len(retained["surfacedFingerprints"]) == 80 and
          "deadbeef" in retained["surfacedFingerprints"] and
          "00000000" not in retained["surfacedFingerprints"] and
          retained["lastSurfacedFingerprint"] == "deadbeef" and
          retained["lastSurfacedCandidateId"] == "2026-09-current")

    current_only_state = {"schemaVersion": 1, "lastRun": None, "sources": {}}
    current_only_rows = [{
        "sourceId": "current-only-source",
        "candidateFingerprint": f"c{index:07x}",
        "candidate_id": f"2026-09-current-{index}",
    } for index in range(81)]
    m.remember_accepted_candidates(
        current_only_state, current_only_rows, [], len(current_only_rows), 0)
    current_only_retained = current_only_state["sources"]["current-only-source"]
    check("fingerprint cap keeps the newest 80 current rows",
          len(current_only_retained["surfacedFingerprints"]) == 80 and
          "c0000000" not in current_only_retained["surfacedFingerprints"] and
          "c0000050" in current_only_retained["surfacedFingerprints"] and
          current_only_retained["lastSurfacedFingerprint"] == "c0000050")
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

    strict_search_registry = {
        "sources": [
            {
                "id": f"strict-search-{index}",
                "publisher": f"Strict publisher {index}",
                "method": "search_fanout",
                "searchDomains": [f"source-{index}.example.org"],
                "dimensions": ["housing-supply"],
            }
            for index in range(1, 4)
        ],
    }

    def search_hit(index):
        return tavily_response(payload={
            "results": [{
                "title": f"Strict result {index}",
                "url": f"https://source-{index}.example.org/result",
                "content": f"Strict content {index}",
                "published_date": "2026-09-01",
            }],
        })

    strict_stop_state = {"schemaVersion": 1, "sources": {}}
    with patch("requests.post", side_effect=[
            search_hit(1), tavily_response(503), tavily_response(503),
            ]) as post_mock, patch.object(m.time, "sleep") as sleep_mock:
        strict_stop_candidates, strict_stop_failures = m.run_search_fanout(
            strict_search_registry, strict_stop_state, "2026-09", "fixture-key",
            fixed_window=("2026-09-01", "2026-09-30"),
            stop_on_failure=True)
    check("strict search stops after the first exhausted target failure",
          post_mock.call_count == 3 and sleep_mock.call_count == 1 and
          [candidate["sourceId"] for candidate in strict_stop_candidates] ==
          ["strict-search-1"] and
          strict_stop_failures == [{
              "surface": "Strict publisher 2",
              "method": "search_fanout",
              "detail": "tavily http 503 after 2 attempts",
          }] and
          strict_stop_state["sources"]["strict-search-1"][
              "lastSuccessfulCheck"] is not None and
          strict_stop_state["sources"]["strict-search-2"]["accessIssue"] ==
          "tavily http 503 after 2 attempts" and
          "strict-search-3" not in strict_stop_state["sources"])

    diagnostic_search_state = {"schemaVersion": 1, "sources": {}}
    with patch("requests.post", side_effect=[
            search_hit(1), tavily_response(503), tavily_response(503), search_hit(3),
            ]) as post_mock, patch.object(m.time, "sleep") as sleep_mock:
        diagnostic_search_candidates, diagnostic_search_failures = (
            m.run_search_fanout(
                strict_search_registry, diagnostic_search_state, "2026-09",
                "fixture-key", fixed_window=("2026-09-01", "2026-09-30"),
                stop_on_failure=False))
    check("non-strict search continues after an exhausted target failure",
          post_mock.call_count == 4 and sleep_mock.call_count == 1 and
          [candidate["sourceId"] for candidate in diagnostic_search_candidates] ==
          ["strict-search-1", "strict-search-3"] and
          diagnostic_search_failures == [{
              "surface": "Strict publisher 2",
              "method": "search_fanout",
              "detail": "tavily http 503 after 2 attempts",
          }] and
          diagnostic_search_state["sources"]["strict-search-3"][
              "lastSuccessfulCheck"] is not None)

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

    seen_candidates = [{
        "candidateFingerprint": "candidate-fingerprint",
        "url": "https://example.org/candidate-fingerprint-origin",
    }, {
        "candidateFingerprint": "candidate-url-origin",
        "normalizedUrl": "https://example.org/candidate-url",
    }]
    seen_suppressed = [{
        "candidateFingerprint": "suppressed-fingerprint",
        "url": "https://example.org/suppressed-fingerprint-origin",
    }, {
        "candidateFingerprint": "suppressed-url-origin",
        "url": "https://example.org/suppressed-url/",
    }]
    seen_queries = [{
        "candidateFingerprint": "candidate-fingerprint",
        "url": "https://example.org/new-candidate-fingerprint-url",
    }, {
        "candidateFingerprint": "new-candidate-url-fingerprint",
        "url": "https://example.org/candidate-url/",
    }, {
        "candidateFingerprint": "suppressed-fingerprint",
        "url": "https://example.org/new-suppressed-fingerprint-url",
    }, {
        "candidateFingerprint": "new-suppressed-url-fingerprint",
        "url": "https://example.org/suppressed-url",
    }]
    accepted_seen_ledger = {
        "metadata": {"acceptance": {"passed": True}},
        "candidates": seen_candidates,
        "suppressed": seen_suppressed,
    }
    failed_seen_ledger = {
        "metadata": {"acceptance": {"passed": False}},
        "candidates": seen_candidates,
        "suppressed": seen_suppressed,
    }
    legacy_seen_ledger = {
        "metadata": {"normalThreshold": 0.08},
        "tiers": {"deterministic": "failed (legacy diagnostic text)"},
        "candidates": seen_candidates,
        "suppressed": seen_suppressed,
    }
    with tempfile.TemporaryDirectory() as td:
        seen_matrix = {}
        for label, payload in (
                ("accepted", accepted_seen_ledger),
                ("failed", failed_seen_ledger),
                ("legacy", legacy_seen_ledger)):
            ledger = Path(td) / f"{label}.json"
            ledger.write_text(json.dumps(payload))
            loaded_seen, load_error = m.load_seen_ledger(ledger)
            kept, skipped = m.filter_seen_ledger(seen_queries, loaded_seen)
            seen_matrix[label] = (loaded_seen, load_error, kept, skipped)
    expected_seen_fingerprints = {
        "candidate-fingerprint", "candidate-url-origin",
        "suppressed-fingerprint", "suppressed-url-origin",
    }
    expected_seen_urls = {
        "https://example.org/candidate-fingerprint-origin",
        "https://example.org/candidate-url",
        "https://example.org/suppressed-fingerprint-origin",
        "https://example.org/suppressed-url",
    }
    for label in ("accepted", "legacy"):
        loaded_seen, load_error, kept, skipped = seen_matrix[label]
        check(f"{label} seen ledger suppresses both buckets by fingerprint and URL",
              load_error is None and
              loaded_seen["fingerprints"] == expected_seen_fingerprints and
              loaded_seen["urls"] == expected_seen_urls and
              kept == [] and skipped == seen_queries and
              "ignoredReason" not in loaded_seen)
    failed_seen, failed_error, failed_kept, failed_skipped = seen_matrix["failed"]
    check("explicitly failed seen ledger is ignored without inferring other fields",
          failed_error is None and failed_seen == {
              "fingerprints": set(),
              "urls": set(),
              "ignoredReason": "prior ledger acceptance failed",
          } and failed_kept == seen_queries and failed_skipped == [])

    historical_ledgers = sorted(
        list((SCRIPT_DIR.parent / "monitoring" / "candidates").glob("*.json")) +
        list((SCRIPT_DIR.parent / "monitoring" / "backtest").glob("*.json")))
    legacy_ledgers = []
    for ledger in historical_ledgers:
        payload = load(ledger)
        if not isinstance(payload, dict) or not (
                "candidates" in payload or "suppressed" in payload):
            continue
        metadata = payload.get("metadata")
        acceptance = metadata.get("acceptance") if isinstance(metadata, dict) else None
        if not isinstance(acceptance, dict) or "passed" not in acceptance:
            legacy_ledgers.append(ledger)
    check("five historical ledgers remain eligible under the legacy rule",
          len(legacy_ledgers) == 5 and
          all(error is None and "ignoredReason" not in seen
              for seen, error in (m.load_seen_ledger(path)
                                  for path in legacy_ledgers))
          )

    # --- fetch-data.py JSON output compatibility -------------------------- #
    try:
        encoded = json.dumps({"tokens": frozenset(["b", "a"])}, default=fetch_data.json_safe_default)
    except TypeError:
        encoded = ""
    check("fetch-data json_out serializes set-like parser internals",
          encoded == '{"tokens": ["a", "b"]}')

    empty_rss_item = b"<rss><channel><item/></channel></rss>"
    malformed_rss_response = SimpleNamespace(
        status_code=200, content=empty_rss_item)
    with patch.object(
            fetch_data.requests, "get", return_value=malformed_rss_response):
        malformed_pollster_feed = fetch_data.fetch_pollster_feed(
            fetch_data.POLLSTER_FEEDS[0])
        malformed_policy_feed = fetch_data.fetch_policy_feed(
            fetch_data.POLICY_RSS_FEEDS[0])
        malformed_pbo_feed = fetch_data.fetch_pbo_feed()
    expected_malformed_rss = {
        "status": "malformed_data",
        "error": "RSS item is missing title, link, or publication date",
    }
    check("empty pollster RSS items do not count as publisher content",
          malformed_pollster_feed == expected_malformed_rss)
    check("empty policy RSS items do not count as publisher content",
          malformed_policy_feed == expected_malformed_rss)
    check("empty PBO RSS items do not count as publisher content",
          malformed_pbo_feed == expected_malformed_rss)

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

    ethics_query_fixture = """
      <a href="/en/report/16ac877a2bcc8310bfa3f24aed91bf44">
        The Example Report
      </a>
      <a href="/en/report/16ac877a2bcc8310bfa3f24aed91bf44?utm_source=listing">
        The Example Report with tracking
      </a>
    """
    check("Ethics query-string duplicates collapse to one canonical report",
          fetch_data.extract_ethics_report_links(ethics_query_fixture) == [{
              "title": "The Example Report",
              "url": ("https://www.ethicscanada.ca/en/report/"
                      "16ac877a2bcc8310bfa3f24aed91bf44"),
          }])

    ethics_fetch_result = {
        "status": "success",
        "reports": [{
            "title": "The Example Report",
            "url": "https://www.ethicscanada.ca/en/report/16ac877a2bcc8310bfa3f24aed91bf44",
        }],
    }
    invalid_ethics_cache_cases = (
        ("malformed JSON", "{"),
        ("invalid root", "[]"),
        ("empty reports", json.dumps({"reports": []})),
        ("invalid reports", json.dumps({"reports": [{}]})),
        ("duplicate report keys", json.dumps({
            "reports": ethics_fetch_result["reports"] + [{
                "title": "Tracked duplicate",
                "url": (ethics_fetch_result["reports"][0]["url"] +
                        "?utm_source=cache"),
            }],
        })),
    )
    for label, cache_text in invalid_ethics_cache_cases:
        with tempfile.TemporaryDirectory() as td:
            cache_path = Path(td) / "ethics-reports.json"
            cache_path.write_text(cache_text)
            before = cache_path.read_bytes()
            result = fetch_data.diff_ethics_reports_against_cache(
                ethics_fetch_result, cache_path=cache_path)
            after = cache_path.read_bytes()
        check(f"{label} Ethics cache fails closed without overwrite",
              result["status"] == "invalid_cache" and
              result["cachePath"] == "ethics-reports.json" and
              "additions" not in result and before == after)

    with tempfile.TemporaryDirectory() as td:
        cache_path = Path(td) / "ethics-reports.json"
        cache_path.write_text(json.dumps({
            "reports": ethics_fetch_result["reports"] + [{
                "title": "Second Accepted Report",
                "url": ("https://www.ethicscanada.ca/en/report/"
                        "26ac877a2bcc8310bfa3f24aed91bf45"),
            }],
        }))
        before = cache_path.read_bytes()
        suspicious_ethics_result = fetch_data.diff_ethics_reports_against_cache(
            ethics_fetch_result, cache_path=cache_path)
        after = cache_path.read_bytes()
    check("partial Ethics listing cannot shrink or overwrite accepted cache",
          suspicious_ethics_result == {
              "status": "suspicious_removal",
              "error": ("current Ethics report list omitted 1 report(s) from "
                        "the accepted cache"),
              "priorCount": 2,
              "currentCount": 1,
              "missingCount": 1,
              "cachePath": "ethics-reports.json",
          } and before == after)

    second_ethics_report = {
        "title": "Second Accepted Report",
        "url": ("https://www.ethicscanada.ca/en/report/"
                "26ac877a2bcc8310bfa3f24aed91bf45"),
    }
    with tempfile.TemporaryDirectory() as td:
        cache_path = Path(td) / "ethics-reports.json"
        cache_path.write_text(json.dumps({
            "reports": ethics_fetch_result["reports"],
        }))
        exact_ethics_diff = fetch_data.diff_ethics_reports_against_cache({
            "status": "success",
            "reports": ethics_fetch_result["reports"] + [second_ethics_report],
        }, cache_path=cache_path)
    check("Ethics diff emits exact prior and current report keys",
          exact_ethics_diff["status"] == "success" and
          exact_ethics_diff["priorCount"] == 1 and
          exact_ethics_diff["currentCount"] == 2 and
          exact_ethics_diff["priorReportKeys"] == [
              "/en/report/16ac877a2bcc8310bfa3f24aed91bf44"] and
          exact_ethics_diff["currentReportKeys"] == [
              "/en/report/16ac877a2bcc8310bfa3f24aed91bf44",
              "/en/report/26ac877a2bcc8310bfa3f24aed91bf45",
          ] and exact_ethics_diff["additions"] == [second_ethics_report])

    with patch.object(
            fetch_data.requests, "get",
            return_value=SimpleNamespace(
                status_code=200,
                text="<html><a href='/en/report'>Reports</a></html>")):
        zero_link_ethics_page = fetch_data.fetch_ethics_reports_page()
    check("zero-link Ethics page fails as malformed data",
          zero_link_ethics_page == {
              "status": "malformed_data",
              "error": "no Ethics report links found",
              "url": fetch_data.ETHICS_REPORTS_URL,
          })

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

    producer_ircc_keys = set(fetch_data.IRCC_DATASETS)
    producer_ircc_result_keys = {f"ircc_{key}" for key in producer_ircc_keys}
    consumer_ircc_keys = set(m.DETERMINISTIC_OBJECT_RESULT_FAMILIES[1][1])
    literal_ircc_keys = {
        "ircc_permanent_residents",
        "ircc_work_permits_imp",
        "ircc_work_permits_tfwp",
        "ircc_study_permits",
    }
    check("all four producer and monitor IRCC dataset keys match",
          producer_ircc_result_keys == consumer_ircc_keys == literal_ircc_keys)

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

    def ledger_fingerprints(run):
        ledger = run["ledger"] or {}
        rows = (ledger.get("candidates") or []) + (ledger.get("suppressed") or [])
        return {row["candidateFingerprint"] for row in rows}

    def state_fingerprints(state):
        return {
            fingerprint
            for source in (state.get("sources") or {}).values()
            for fingerprint in source.get("surfacedFingerprints") or []
        }

    expected_coverage = m.expected_deterministic_coverage(dims)
    deterministic_coverage = {}
    configured_feed_rows = {
        "pollster_feeds": fetch_data.POLLSTER_FEEDS,
        "excluded_pollster_feeds": fetch_data.EXCLUDED_POLLSTER_FEEDS,
        "policy_feeds": fetch_data.POLICY_RSS_FEEDS,
    }
    for key, urls in m.EXPECTED_DETERMINISTIC_FEED_URLS.items():
        configured_by_url = {row["url"]: row for row in configured_feed_rows[key]}
        deterministic_coverage[key] = []
        for url in sorted(urls):
            name_field = "publisher" if key == "policy_feeds" else "pollster"
            entry = {
                "url": url,
                name_field: configured_by_url[url]["name"],
                "status": "success",
                "items": [],
            }
            if key == "policy_feeds":
                entry.update({
                    "count": 1,
                    "topic_count": 0,
                    "items": [{
                        "title": "Synthetic non-topic item",
                        "link": (f"https://{m.host_of(url)}/synthetic/feed/"
                                 f"{len(deterministic_coverage[key])}"),
                        "pubDate": "Tue, 01 Sep 2026 09:00:00 -0400",
                        "topic_match": False,
                    }],
                })
            else:
                entry.update({"all_count": 1, "relevant_count": 0})
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
        payload_results = payload.get("results") if isinstance(payload, dict) else None
        ethics_diff = payload_results.get("ethics_reports_diff") if isinstance(
            payload_results, dict) else None
        ethics_prior_keys = (
            [SYNTHETIC_ETHICS_KEY]
            if isinstance(ethics_diff, dict) and
            ethics_diff.get("priorCacheFound") is True else None)
        return m.deterministic_payload_errors(
            payload,
            expected_cycle="2026-09",
            require_link_rot=True,
            expected_link_urls=expected_coverage["link_urls"],
            expected_legisinfo=expected_coverage["legisinfo"],
            ethics_prior_report_keys=ethics_prior_keys,
            require_ethics_prior_cache=True,
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

    invalid_state_cases = (
        ("empty object", {"initial_state": {}},
         "state file schemaVersion must equal 1"),
        ("non-object root", {"initial_state": []},
         "state file root is not an object"),
        ("wrong schema", {"initial_state": {
            "schemaVersion": 2, "lastRun": None, "sources": {},
         }}, "state file schemaVersion must equal 1"),
        ("boolean schema", {"initial_state": {
            "schemaVersion": True, "lastRun": None, "sources": {},
         }}, "state file schemaVersion must equal 1"),
        ("floating-point schema", {"initial_state": {
            "schemaVersion": 1.0, "lastRun": None, "sources": {},
         }}, "state file schemaVersion must equal 1"),
        ("missing lastRun", {"initial_state": {
            "schemaVersion": 1, "sources": {},
         }}, "state file lastRun is missing or invalid"),
        ("invalid sources", {"initial_state": {
            "schemaVersion": 1, "lastRun": None, "sources": [],
         }}, "state file sources is not an object"),
        ("invalid fingerprints", {"initial_state": {
            "schemaVersion": 1,
            "lastRun": None,
            "sources": {"fixture-source": {"surfacedFingerprints": [""]}},
         }}, "state file source fixture-source has invalid surfacedFingerprints"),
        ("invalid normalized fingerprints", {"initial_state": {
            "schemaVersion": 1,
            "lastRun": None,
            "sources": {"fixture-source": {
                "surfacedFingerprints": [],
                "surfacedNormalizedFingerprints": ["not-a-fingerprint"],
            }},
         }}, "state file source fixture-source has invalid "
             "surfacedNormalizedFingerprints"),
        ("empty bytes", {"initial_state_bytes": b""},
         "state file is empty: state.json"),
        ("malformed JSON", {"initial_state_bytes": b"{"},
         "state file is malformed JSON at line 1, column 2: state.json"),
        ("invalid UTF-8", {"initial_state_bytes": b"\xff"},
         "state file is not valid UTF-8 at byte offset 0: state.json"),
    )
    for label, fixture_args, expected_error in invalid_state_cases:
        invalid_state_run = run_acceptance_fixture(
            complete_zero_fetch, **fixture_args)
        check(f"{label} state fails before outputs or paid work",
              invalid_state_run["result"] == 1 and
              invalid_state_run["ledger"] is None and
              invalid_state_run["packet"] is None and
              state_unchanged(invalid_state_run) and
              invalid_state_run["searchCalls"] == 0 and
              invalid_state_run["classificationCalls"] == 0 and
              invalid_state_run["fetchLoadCalls"] == 0 and
              invalid_state_run["stdout"] == "" and
              invalid_state_run["stderr"] == f"ERROR: {expected_error}\n" and
              invalid_state_run["root"] not in invalid_state_run["stderr"] and
              "Traceback" not in invalid_state_run["stderr"])

    for collision in (
            "ledger-state", "packet-state", "ledger-packet",
            "ledger-recovery-marker"):
        collision_run = run_acceptance_fixture(
            complete_zero_fetch, output_collision=collision)
        check(f"{collision} output collision fails before paid work",
              collision_run["result"] == 1 and
              state_unchanged(collision_run) and
              collision_run["searchCalls"] == 0 and
              collision_run["classificationCalls"] == 0 and
              collision_run["fetchLoadCalls"] == 0 and
              collision_run["stdout"] == "" and
              collision_run["stderr"] == (
                  "ERROR: candidate ledger, packet, state, and recovery marker "
                  "paths must resolve to four distinct files\n") and
              collision_run["root"] not in collision_run["stderr"] and
              "Traceback" not in collision_run["stderr"])

    expected_monitor_input_options = {
        "--fetch-results",
        "--ethics-prior-cache",
        "--dimensions-file",
        "--approval-file",
        "--sources-file",
        "--seen-ledger",
        "--carry-forward-ledger",
        "--adjacent-file",
        "--compare-sources-file",
    }
    check("monitor input collision registry covers every file input option",
          {option for option, _ in m.MONITOR_INPUT_PATH_OPTIONS} ==
          expected_monitor_input_options)
    for input_option in sorted(expected_monitor_input_options):
        collision_run = run_acceptance_fixture(
            complete_zero_fetch, input_collision_option=input_option)
        check(f"recovery marker collision with {input_option} fails before work",
              collision_run["result"] == 1 and
              collision_run["ledger"] is None and
              collision_run["packet"] is None and
              state_unchanged(collision_run) and
              not collision_run["recoveryMarkerExists"] and
              collision_run["searchCalls"] == 0 and
              collision_run["classificationCalls"] == 0 and
              collision_run["fetchLoadCalls"] == 0 and
              collision_run["stdout"] == "" and
              collision_run["stderr"] == (
                  "ERROR: recovery marker output path must not overlap "
                  f"{input_option} input path\n") and
              collision_run["root"] not in collision_run["stderr"] and
              "Traceback" not in collision_run["stderr"])

    case_alias_collision = run_acceptance_fixture(
        complete_zero_fetch,
        input_collision_option="--compare-sources-file",
        input_collision_case_alias=True,
    )
    check("case alias marker-input collision fails before work",
          case_alias_collision["result"] == 1 and
          case_alias_collision["ledger"] is None and
          case_alias_collision["packet"] is None and
          state_unchanged(case_alias_collision) and
          not case_alias_collision["recoveryMarkerExists"] and
          case_alias_collision["searchCalls"] == 0 and
          case_alias_collision["classificationCalls"] == 0 and
          case_alias_collision["fetchLoadCalls"] == 0 and
          case_alias_collision["stdout"] == "" and
          case_alias_collision["stderr"] == (
              "ERROR: recovery marker output path must not overlap "
              "--compare-sources-file input path\n") and
          case_alias_collision["root"] not in case_alias_collision["stderr"])

    with tempfile.TemporaryDirectory() as hardlink_td:
        hardlink_root = Path(hardlink_td)
        hardlink_source = hardlink_root / "source.json"
        hardlink_alias = hardlink_root / "alias.json"
        hardlink_source.write_text("{}\n")
        os.link(hardlink_source, hardlink_alias)
        check("existing hard-link aliases count as overlapping monitor paths",
              m.monitor_paths_overlap(hardlink_source, hardlink_alias))

    state_alias_errors = {
        "hardlink": (
            "ERROR: monitor state path must not have hard-link aliases: "
            "state-hardlink.json\n"
        ),
        "symlink": (
            "ERROR: monitor state path must not be a symbolic link: "
            "state-symlink.json\n"
        ),
    }
    for alias_kind, expected_error in state_alias_errors.items():
        alias_run = run_acceptance_fixture(
            complete_zero_fetch, state_alias_kind=alias_kind)
        check(f"{alias_kind} state alias fails before monitor work",
              alias_run["result"] == 1 and
              alias_run["ledger"] is None and
              alias_run["packet"] is None and
              state_unchanged(alias_run) and
              not alias_run["recoveryMarkerExists"] and
              alias_run["searchCalls"] == 0 and
              alias_run["classificationCalls"] == 0 and
              alias_run["fetchLoadCalls"] == 0 and
              alias_run["stdout"] == "" and
              alias_run["stderr"] == expected_error and
              alias_run["root"] not in alias_run["stderr"])

    with tempfile.TemporaryDirectory() as parent_alias_td:
        parent_alias_root = Path(parent_alias_td)
        canonical_parent = parent_alias_root / "canonical"
        canonical_parent.mkdir()
        retarget_parent = parent_alias_root / "retargeted"
        retarget_parent.mkdir()
        parent_alias = parent_alias_root / "alias"
        parent_alias.symlink_to(canonical_parent, target_is_directory=True)
        aliased_missing_state = parent_alias / "state.json"
        canonical_missing_state = canonical_parent / "state.json"
        resolved_state, resolved_state_error = m.canonical_monitor_state_path(
            aliased_missing_state)
        check("missing state under a symlinked parent uses one canonical identity",
              resolved_state_error is None and
              resolved_state == canonical_missing_state.resolve() and
              m.monitor_run_lock_path(aliased_missing_state) ==
              m.monitor_run_lock_path(canonical_missing_state) and
              m.state_recovery_marker_path(aliased_missing_state) ==
              m.state_recovery_marker_path(canonical_missing_state))

        retarget_observation = {}

        def retargeting_inner(argv, *, canonical_state_path=None):
            carried_path = Path(canonical_state_path)
            retarget_observation["carriedPath"] = carried_path
            try:
                second_lock_fd = m.acquire_monitor_run_lock(carried_path)
            except BlockingIOError:
                retarget_observation["originalLockHeld"] = True
            else:
                retarget_observation["originalLockHeld"] = False
                m.release_monitor_run_lock(second_lock_fd)
            parent_alias.unlink()
            parent_alias.symlink_to(retarget_parent, target_is_directory=True)
            retarget_observation["rawPathAfterRetarget"] = (
                aliased_missing_state.resolve())
            return 73

        with patch.object(m, "_main_unlocked", side_effect=retargeting_inner):
            retarget_result = m.main([
                "--state-file", str(aliased_missing_state),
            ])
        post_run_lock_fd = m.acquire_monitor_run_lock(canonical_missing_state)
        m.release_monitor_run_lock(post_run_lock_fd)
        check("parent retarget cannot change the state path carried into monitor work",
              retarget_result == 73 and
              retarget_observation["carriedPath"] ==
              canonical_missing_state.resolve() and
              retarget_observation["originalLockHeld"] and
              retarget_observation["rawPathAfterRetarget"] ==
              (retarget_parent / "state.json").resolve() and
              retarget_observation["rawPathAfterRetarget"] !=
              retarget_observation["carriedPath"])

    prior_candidates, _ = m.candidates_from_fetch_results(
        complete_candidate_fetch, reg,
        {"schemaVersion": 1, "lastRun": None, "sources": {}}, "2026-09")
    prior_target = prior_candidates[0]
    prior_target_row = {
        "candidateFingerprint": prior_target["candidateFingerprint"],
        "url": prior_target["url"],
    }
    end_to_end_seen_ledgers = {
        "failed": {
            "metadata": {"acceptance": {"passed": False}},
            "candidates": [prior_target_row],
            "suppressed": [],
        },
        "accepted": {
            "metadata": {"acceptance": {"passed": True}},
            "candidates": [prior_target_row],
            "suppressed": [],
        },
        "nonpersistent": {
            "metadata": {
                "acceptance": {"passed": True},
                "statePersistence": {
                    "eligible": False,
                    "blockers": ["diagnostic run did not advance state"],
                },
            },
            "candidates": [prior_target_row],
            "suppressed": [],
        },
        "legacy": {
            "metadata": {"normalThreshold": 0.08},
            "tiers": {"deterministic": "failed (legacy diagnostic text)"},
            "candidates": [prior_target_row],
            "suppressed": [],
        },
    }
    end_to_end_seen_runs = {
        label: run_acceptance_fixture(
            complete_candidate_fetch,
            search_result=([], []),
            classify_effect=classify_successfully,
            seen_ledger_payload=payload,
        )
        for label, payload in end_to_end_seen_ledgers.items()
    }
    failed_seen_run = end_to_end_seen_runs["failed"]
    failed_seen_rows = (
        failed_seen_run["ledger"]["candidates"] +
        failed_seen_run["ledger"]["suppressed"])
    check("failed prior ledger is ignored and its candidate resurfaces",
          failed_seen_run["result"] == 0 and
          failed_seen_run["ledger"]["tiers"]["seen_ledger"] ==
          "ignored (prior ledger acceptance failed)" and
          failed_seen_run["ledger"]["skippedSeenLedger"] == [] and
          prior_target["candidateFingerprint"] in {
              row["candidateFingerprint"] for row in failed_seen_rows
          })
    nonpersistent_seen_run = end_to_end_seen_runs["nonpersistent"]
    nonpersistent_seen_rows = (
        nonpersistent_seen_run["ledger"]["candidates"] +
        nonpersistent_seen_run["ledger"]["suppressed"])
    check("nonpersistent prior ledger is ignored and its candidate resurfaces",
          nonpersistent_seen_run["result"] == 0 and
          nonpersistent_seen_run["ledger"]["tiers"]["seen_ledger"] ==
          "ignored (prior ledger state persistence failed)" and
          nonpersistent_seen_run["ledger"]["skippedSeenLedger"] == [] and
          prior_target["candidateFingerprint"] in {
              row["candidateFingerprint"]
              for row in nonpersistent_seen_rows
          })
    for label in ("accepted", "legacy"):
        seen_run = end_to_end_seen_runs[label]
        seen_rows = seen_run["ledger"]["candidates"] + seen_run["ledger"]["suppressed"]
        check(f"{label} prior ledger suppresses its candidate end to end",
              seen_run["result"] == 0 and
              seen_run["ledger"]["tiers"]["seen_ledger"] ==
              "loaded (1 fingerprints, 1 URLs)" and
              prior_target["candidateFingerprint"] not in {
                  row["candidateFingerprint"] for row in seen_rows
              } and
              [row["candidateFingerprint"] for row in
               seen_run["ledger"]["skippedSeenLedger"]] ==
              [prior_target["candidateFingerprint"]])

    tracking_legacy_run = run_acceptance_fixture(
        complete_zero_fetch,
        seen_ledger_payload={
            "metadata": {"acceptance": {"passed": True}},
            "candidates": [{
                "url": "https://example.org/report/?utm_source=rss",
                "normalizedUrl": "https://example.org/report?utm_source=rss",
            }],
            "suppressed": [],
        },
    )
    check("legacy tracking-only normalized URLs remain eligible",
          tracking_legacy_run["result"] == 0 and
          tracking_legacy_run["ledger"]["tiers"]["seen_ledger"] ==
          "loaded (0 fingerprints, 1 URLs)")

    invalid_seen_cases = (
        ("missing", {"seen_ledger_payload": {}, "omit_seen_file": True},
         "seen-ledger file not found: seen-ledger.json"),
        ("empty", {"raw_seen_text": ""},
         "seen-ledger file is empty: seen-ledger.json"),
        ("malformed JSON", {"raw_seen_text": "{"},
         "seen-ledger file is malformed JSON at line 1, column 2: "
         "seen-ledger.json"),
        ("invalid UTF-8", {"raw_seen_bytes": b"\xff"},
         "seen-ledger file is not valid UTF-8 at byte offset 0: "
         "seen-ledger.json"),
        ("non-object root", {"raw_seen_text": "[]"},
         "seen-ledger root is not an object"),
        ("invalid metadata", {"seen_ledger_payload": {
            "metadata": [], "candidates": [], "suppressed": [],
         }}, "seen-ledger metadata is not an object"),
        ("invalid acceptance", {"seen_ledger_payload": {
            "metadata": {"acceptance": {"passed": "yes"}},
            "candidates": [], "suppressed": [],
         }}, "seen-ledger acceptance is not true or false"),
        ("null acceptance", {"seen_ledger_payload": {
            "metadata": {"acceptance": {"passed": None}},
            "candidates": [], "suppressed": [],
         }}, "seen-ledger acceptance is not true or false"),
        ("numeric acceptance", {"seen_ledger_payload": {
            "metadata": {"acceptance": {"passed": 0}},
            "candidates": [], "suppressed": [],
         }}, "seen-ledger acceptance is not true or false"),
        ("object acceptance", {"seen_ledger_payload": {
            "metadata": {"acceptance": {"passed": {}}},
            "candidates": [], "suppressed": [],
         }}, "seen-ledger acceptance is not true or false"),
        ("list acceptance", {"seen_ledger_payload": {
            "metadata": {"acceptance": {"passed": []}},
            "candidates": [], "suppressed": [],
         }}, "seen-ledger acceptance is not true or false"),
        ("state persistence without acceptance", {"seen_ledger_payload": {
            "metadata": {"statePersistence": {"eligible": True}},
            "candidates": [], "suppressed": [],
         }}, "seen-ledger state persistence exists without acceptance"),
        ("invalid state persistence", {"seen_ledger_payload": {
            "metadata": {
                "acceptance": {"passed": True},
                "statePersistence": {"eligible": "yes", "blockers": []},
            },
            "candidates": [], "suppressed": [],
         }}, "seen-ledger state persistence is invalid"),
        ("eligible state persistence with blockers", {"seen_ledger_payload": {
            "metadata": {
                "acceptance": {"passed": True},
                "statePersistence": {
                    "eligible": True,
                    "blockers": ["contradictory blocker"],
                },
            },
            "candidates": [], "suppressed": [],
         }}, "seen-ledger eligible state persistence has blockers"),
        ("malformed candidate list", {"seen_ledger_payload": {
            "metadata": {"acceptance": {"passed": True}},
            "candidates": {}, "suppressed": [],
         }}, "seen-ledger candidates is not a list"),
        ("unsafe candidate URL", {"seen_ledger_payload": {
            "metadata": {"acceptance": {"passed": True}},
            "candidates": [{"url": f"file://{SYNTHETIC_HOME_PATH}"}],
            "suppressed": [],
         }}, "seen-ledger candidates[0] has an unsafe url"),
        ("inconsistent normalized URL", {"seen_ledger_payload": {
            "metadata": {"acceptance": {"passed": True}},
            "candidates": [{
                "url": "https://example.org/expected",
                "normalizedUrl": "https://example.org/unrelated",
            }],
            "suppressed": [],
         }}, "seen-ledger candidates[0] has an inconsistent normalizedUrl"),
        ("missing suppression key", {"seen_ledger_payload": {
            "metadata": {"acceptance": {"passed": True}},
            "candidates": [{}], "suppressed": [],
         }}, "seen-ledger candidates[0] has no suppression key"),
    )
    for label, fixture_args, expected_error in invalid_seen_cases:
        invalid_seen_run = run_acceptance_fixture(
            complete_candidate_fetch, **fixture_args)
        check(f"{label} seen-ledger input fails before outputs or paid work",
              invalid_seen_run["result"] == 1 and
              invalid_seen_run["ledger"] is None and
              invalid_seen_run["packet"] is None and
              state_unchanged(invalid_seen_run) and
              invalid_seen_run["searchCalls"] == 0 and
              invalid_seen_run["classificationCalls"] == 0 and
              invalid_seen_run["stdout"] == "" and
              invalid_seen_run["stderr"] == f"ERROR: {expected_error}\n" and
              invalid_seen_run["root"] not in invalid_seen_run["stderr"] and
              "Traceback" not in invalid_seen_run["stderr"])

    private_failure_fetch = json.loads(json.dumps(complete_zero_fetch))
    private_failure_fetch["results"]["ircc_permanent_residents"] = {
        "status": "error",
        "error": (f"certificate under {SYNTHETIC_HOME_PATH} belongs to "
                  f"{SYNTHETIC_PRIVATE_EMAIL}"),
    }
    private_failure_run = run_acceptance_fixture(private_failure_fetch)
    private_failure_outputs = (
        json.dumps(private_failure_run["ledger"], ensure_ascii=False) +
        private_failure_run["packet"] + private_failure_run["stdout"] +
        private_failure_run["stderr"]
    )
    check("access-failure diagnostics redact local paths and emails everywhere",
          private_failure_run["result"] == 1 and
          state_unchanged(private_failure_run) and
          private_failure_run["searchCalls"] == 0 and
          private_failure_run["classificationCalls"] == 0 and
          SYNTHETIC_HOME_PATH not in private_failure_outputs and
          SYNTHETIC_PRIVATE_EMAIL not in private_failure_outputs and
          "[local path redacted]" in private_failure_outputs and
          "[email redacted]" in private_failure_outputs)

    def classify_with_suppressed(candidates, *_args, **_kwargs):
        classify_successfully(candidates)
        if candidates:
            candidates[-1]["classification"] = "irrelevant"
            candidates[-1]["affected_dimensions"] = []
            candidates[-1]["relevance_score"] = 0.01
            candidates[-1]["reason"] = "Fixture suppression"
        return candidates, None

    carry_seed_run = run_acceptance_fixture(
        complete_candidate_fetch,
        search_result=([], []),
        classify_effect=classify_with_suppressed,
    )
    carry_seed_rows = (
        carry_seed_run["ledger"]["candidates"] +
        carry_seed_run["ledger"]["suppressed"]
    )
    carry_rerun = run_acceptance_fixture(
        complete_candidate_fetch,
        search_result=([], []),
        classify_effect=AssertionError("carried candidates must not be reclassified"),
        initial_state=carry_seed_run["state"],
        carry_forward_payload=carry_seed_run["ledger"],
    )
    carry_rerun_rows = (
        carry_rerun["ledger"]["candidates"] +
        carry_rerun["ledger"]["suppressed"]
    )
    check("same-cycle rerun preserves surfaced and suppressed candidates",
          carry_seed_run["result"] == 0 and
          len(carry_seed_run["ledger"]["candidates"]) > 0 and
          len(carry_seed_run["ledger"]["suppressed"]) > 0 and
          carry_rerun["result"] == 0 and
          carry_rerun["ledger"]["counts"]["surfaced"] ==
          carry_seed_run["ledger"]["counts"]["surfaced"] and
          carry_rerun["ledger"]["counts"]["suppressed"] ==
          carry_seed_run["ledger"]["counts"]["suppressed"] and
          {row["candidateFingerprint"] for row in carry_rerun_rows} ==
          {row["candidateFingerprint"] for row in carry_seed_rows})
    check("zero-new-candidate carry rerun skips classification and advances state",
          carry_rerun["classificationCalls"] == 0 and
          carry_rerun["ledger"]["tiers"]["classification"] ==
          "skipped (no candidates)" and
          carry_rerun["ledger"]["metadata"]["acceptance"]["passed"] is True and
          carry_rerun["ledger"]["metadata"]["statePersistence"] == {
              "eligible": True,
              "blockers": [],
          } and
          carry_rerun["stateBytes"] != carry_rerun["initialStateBytes"] and
          "(advanced)" in carry_rerun["stdout"])
    expected_carry_counts = {
        "inputSurfaced": len(carry_seed_run["ledger"]["candidates"]),
        "inputSuppressed": len(carry_seed_run["ledger"]["suppressed"]),
        "carriedSurfaced": len(carry_seed_run["ledger"]["candidates"]),
        "carriedSuppressed": len(carry_seed_run["ledger"]["suppressed"]),
        "deduplicated": 0,
    }
    check("carry-forward tier and metadata expose exact counts",
          carry_rerun["ledger"]["tiers"]["carry_forward"] ==
          f"loaded ({expected_carry_counts['inputSurfaced']} surfaced, "
          f"{expected_carry_counts['inputSuppressed']} suppressed)" and
          carry_rerun["ledger"]["metadata"]["carryForward"] ==
          expected_carry_counts)
    check("carried candidates retain hard editor-review invariants",
          all(row["requires_editor_review"] is True and
              row["can_move_grade_automatically"] is False and
              row["classification"] in m.VALID_CLASSIFICATIONS and
              isinstance(row["relevance_score"], (int, float)) and
              bool(row["reason"])
              for row in carry_rerun_rows))

    carry_third_run = run_acceptance_fixture(
        complete_candidate_fetch,
        search_result=([], []),
        classify_effect=AssertionError(
            "cumulative carried candidates must not be reclassified"),
        initial_state=carry_rerun["state"],
        carry_forward_payload=carry_rerun["ledger"],
    )
    carry_third_rows = (
        carry_third_run["ledger"]["candidates"] +
        carry_third_run["ledger"]["suppressed"]
    )
    check("third same-cycle rerun preserves cumulative carry metadata and rows",
          "carryForward" in carry_rerun["ledger"]["metadata"] and
          carry_third_run["result"] == 0 and
          carry_third_run["classificationCalls"] == 0 and
          carry_third_run["ledger"]["metadata"]["acceptance"]["passed"] is True and
          carry_third_run["ledger"]["metadata"]["carryForward"] ==
          expected_carry_counts and
          {row["candidateFingerprint"] for row in carry_third_rows} ==
          {row["candidateFingerprint"] for row in carry_seed_rows})

    legacy_carry_payload = json.loads(json.dumps(carry_seed_run["ledger"]))
    legacy_carry_payload["metadata"].pop("acceptance")
    legacy_carry_payload["metadata"].pop("statePersistence")
    legacy_carry_run = run_acceptance_fixture(
        complete_zero_fetch,
        search_result=([], []),
        classify_effect=AssertionError("legacy carried rows must not be reclassified"),
        carry_forward_payload=legacy_carry_payload,
    )
    check("fully classified legacy ledger remains eligible for carry-forward",
          legacy_carry_run["result"] == 0 and
          legacy_carry_run["classificationCalls"] == 0 and
          legacy_carry_run["ledger"]["metadata"]["acceptance"]["passed"] is True and
          len(legacy_carry_run["ledger"]["candidates"]) ==
          len(carry_seed_run["ledger"]["candidates"]) and
          len(legacy_carry_run["ledger"]["suppressed"]) ==
          len(carry_seed_run["ledger"]["suppressed"]))

    collision_target = json.loads(json.dumps(carry_seed_rows[0]))
    fingerprint_collision = json.loads(json.dumps(collision_target))
    fingerprint_collision.update({
        "candidate_id": "2026-09-carry-fingerprint-collision",
        "title": "Stale fingerprint carry row",
        "url": "https://example.org/fingerprint-only-collision",
        "normalizedUrl": "https://example.org/fingerprint-only-collision",
        "reason": "Stale fingerprint reason",
    })
    url_collision = json.loads(json.dumps(collision_target))
    url_collision.update({
        "candidate_id": "2026-09-carry-url-collision",
        "candidateFingerprint": "deadbeef",
        "title": "Stale URL carry row",
        "reason": "Stale URL reason",
    })
    collision_payload = {
        "cycle": "2026-09",
        "metadata": {
            "acceptance": {"passed": True},
            "statePersistence": {"eligible": True, "blockers": []},
        },
        "candidates": [fingerprint_collision, url_collision],
        "suppressed": [],
    }
    collision_run = run_acceptance_fixture(
        complete_candidate_fetch,
        search_result=([], []),
        classify_effect=classify_successfully,
        carry_forward_payload=collision_payload,
    )
    collision_rows = (
        collision_run["ledger"]["candidates"] +
        collision_run["ledger"]["suppressed"]
    )
    check("current candidates win fingerprint and normalized URL collisions",
          collision_run["result"] == 0 and
          collision_run["ledger"]["metadata"]["carryForward"] == {
              "inputSurfaced": 2,
              "inputSuppressed": 0,
              "carriedSurfaced": 0,
              "carriedSuppressed": 0,
              "deduplicated": 2,
          } and
          all(row["title"] not in {
              "Stale fingerprint carry row", "Stale URL carry row"
          } for row in collision_rows) and
          any(row["candidateFingerprint"] ==
              collision_target["candidateFingerprint"] and
              row["reason"] == "Fixture classification"
              for row in collision_rows))

    private_carry_row = json.loads(json.dumps(collision_target))
    private_carry_row.update({
        "candidate_id": "2026-09-private-carry-row",
        "candidateFingerprint": "cafebabe",
        "title": (f"Contact {SYNTHETIC_PRIVATE_EMAIL} under "
                  f"{SYNTHETIC_USER_PATH}/title"),
        "url": "https://example.org/private-carry-row",
        "normalizedUrl": "https://example.org/private-carry-row",
        "snippet": (f"Email {SYNTHETIC_PRIVATE_EMAIL} from "
                    f"{SYNTHETIC_HOME_PATH}/snippet"),
        "reason": (f"Review {SYNTHETIC_USER_PATH}/reason and "
                   f"{SYNTHETIC_PRIVATE_EMAIL}"),
        "evidence_limitations": f"Stored at {SYNTHETIC_HOME_PATH}/evidence",
    })
    private_carry_payload = {
        "cycle": "2026-09",
        "metadata": {
            "acceptance": {"passed": True},
            "statePersistence": {"eligible": True, "blockers": []},
        },
        "candidates": [private_carry_row],
        "suppressed": [],
    }
    private_carry_run = run_acceptance_fixture(
        complete_zero_fetch,
        search_result=([], []),
        classify_effect=AssertionError("private carried row must not be reclassified"),
        carry_forward_payload=private_carry_payload,
    )
    private_outputs = (
        json.dumps(private_carry_run["ledger"], ensure_ascii=False) +
        private_carry_run["packet"]
    )
    check("carried free text is scrubbed before regenerated outputs",
          private_carry_run["result"] == 0 and
          SYNTHETIC_PRIVATE_EMAIL not in private_outputs and
          SYNTHETIC_USER_PATH not in private_outputs and
          SYNTHETIC_HOME_PATH not in private_outputs and
          "[email redacted]" in private_outputs and
          "[local path redacted]" in private_outputs)

    valid_carry_payload = {
        "cycle": "2026-09",
        "metadata": {
            "acceptance": {"passed": True},
            "statePersistence": {"eligible": True, "blockers": []},
        },
        "candidates": [json.loads(json.dumps(collision_target))],
        "suppressed": [],
    }
    invalid_carry_cases = (
        ("missing", {"carry_forward_payload": {}, "omit_carry_file": True},
         "carry-forward ledger file not found: carry-forward.json"),
        ("malformed JSON", {"raw_carry_text": "{"},
         "carry-forward ledger is malformed JSON at line 1, column 2: "
         "carry-forward.json"),
        ("non-object root", {"raw_carry_text": "[]"},
         "carry-forward ledger root is not an object"),
        ("failed acceptance", {"carry_forward_payload": {
            **valid_carry_payload,
            "metadata": {
                "acceptance": {"passed": False},
                "statePersistence": {"eligible": True, "blockers": []},
            },
         }}, "carry-forward ledger acceptance did not pass"),
        ("diagnostic non-persistent", {"carry_forward_payload": {
            **valid_carry_payload,
            "metadata": {
                "acceptance": {"passed": True},
                "statePersistence": {
                    "eligible": False,
                    "blockers": ["--no-classify prevents monitor state advancement"],
                },
            },
         }}, "carry-forward ledger state persistence did not pass"),
        ("wrong cycle", {"carry_forward_payload": {
            **valid_carry_payload, "cycle": "2026-08",
         }}, "carry-forward ledger cycle does not match 2026-09"),
        ("malformed candidate list", {"carry_forward_payload": {
            **valid_carry_payload, "candidates": {},
         }}, "carry-forward ledger candidates is not a list"),
        ("unsafe candidate URL", {"carry_forward_payload": {
            **valid_carry_payload,
            "candidates": [{
                **valid_carry_payload["candidates"][0],
                "url": f"file://{SYNTHETIC_USER_PATH}/secret",
                "normalizedUrl": f"file://{SYNTHETIC_USER_PATH}/secret",
            }],
         }}, "carry-forward ledger candidates[0] has an unsafe URL"),
        ("unclassified candidate", {"carry_forward_payload": {
            **valid_carry_payload,
            "candidates": [{
                **valid_carry_payload["candidates"][0],
                "classification": None,
            }],
         }}, "carry-forward ledger candidates[0] has an unsafe classification"),
        ("missing candidate score", {"carry_forward_payload": {
            **valid_carry_payload,
            "candidates": [{
                **valid_carry_payload["candidates"][0],
                "relevance_score": None,
            }],
         }}, "carry-forward ledger candidates[0] has an unsafe relevance_score"),
        ("empty candidate reason", {"carry_forward_payload": {
            **valid_carry_payload,
            "candidates": [{
                **valid_carry_payload["candidates"][0],
                "reason": "  ",
            }],
         }}, "carry-forward ledger candidates[0] has an empty reason"),
        ("missing relevant dimensions", {"carry_forward_payload": {
            **valid_carry_payload,
            "candidates": [{
                **valid_carry_payload["candidates"][0],
                "affected_dimensions": [],
            }],
         }}, "carry-forward ledger candidates[0] has no affected dimensions"),
        ("unknown relevant dimensions", {"carry_forward_payload": {
            **valid_carry_payload,
            "candidates": [{
                **valid_carry_payload["candidates"][0],
                "affected_dimensions": ["not-a-dashboard-dimension"],
            }],
         }}, "carry-forward ledger candidates[0] has unknown affected_dimensions"),
    )
    for label, fixture_args, expected_error in invalid_carry_cases:
        invalid_carry_run = run_acceptance_fixture(
            complete_zero_fetch, **fixture_args)
        check(f"{label} carry-forward input fails before outputs or paid work",
              invalid_carry_run["result"] == 1 and
              invalid_carry_run["ledger"] is None and
              invalid_carry_run["packet"] is None and
              state_unchanged(invalid_carry_run) and
              invalid_carry_run["searchCalls"] == 0 and
              invalid_carry_run["classificationCalls"] == 0 and
              invalid_carry_run["stdout"] == "" and
              invalid_carry_run["stderr"] == f"ERROR: {expected_error}\n" and
              invalid_carry_run["root"] not in invalid_carry_run["stderr"] and
              "Traceback" not in invalid_carry_run["stderr"])

    carry_seen_conflict = run_acceptance_fixture(
        complete_zero_fetch,
        seen_ledger_payload=end_to_end_seen_ledgers["accepted"],
        carry_forward_payload=valid_carry_payload,
    )
    carry_historical_conflict = run_acceptance_fixture(
        complete_zero_fetch,
        carry_forward_payload=valid_carry_payload,
        extra_args=[
            "--no-deterministic",
            "--window-start", "2026-09-01",
            "--window-end", "2026-09-30",
        ],
    )
    for label, conflict_run in (
            ("seen-ledger", carry_seen_conflict),
            ("historical", carry_historical_conflict)):
        check(f"carry-forward rejects {label} mode before paid work",
              conflict_run["result"] == 1 and
              conflict_run["ledger"] is None and
              conflict_run["packet"] is None and
              state_unchanged(conflict_run) and
              conflict_run["searchCalls"] == 0 and
              conflict_run["classificationCalls"] == 0 and
              conflict_run["stdout"] == "" and
              conflict_run["stderr"] ==
              "ERROR: --carry-forward-ledger cannot be combined with "
              "--no-deterministic or --seen-ledger\n")

    dryrun_payload = load(DRYRUN_FIXTURE)
    dryrun_state_payload = load(EMPTY_STATE_FIXTURE)
    dryrun_ethics_prior_cache = load(DRYRUN_ETHICS_PRIOR_CACHE)
    dryrun_state_bytes = EMPTY_STATE_FIXTURE.read_bytes()
    repo_dryrun_outputs = (
        SCRIPT_DIR.parent / "tmp" / "monitor-dryrun-candidates.json",
        SCRIPT_DIR.parent / "tmp" / "monitor-dryrun-candidates.md",
    )
    repo_dryrun_before = {
        path: path.read_bytes() if path.exists() else None
        for path in repo_dryrun_outputs
    }
    dryrun_contract_errors = m.deterministic_payload_errors(
        dryrun_payload,
        expected_cycle="2026-09",
        require_link_rot=True,
        expected_link_urls=expected_coverage["link_urls"],
        expected_legisinfo=expected_coverage["legisinfo"],
        ethics_prior_report_keys=[SYNTHETIC_ETHICS_KEY],
        require_ethics_prior_cache=True,
    )
    dryrun_fixture_run = run_acceptance_fixture(
        dryrun_payload,
        api_keys=False,
        strict=False,
        extra_args=["--dry-run", "--require-complete"],
        initial_state_bytes=dryrun_state_bytes,
    )
    repo_dryrun_after = {
        path: path.read_bytes() if path.exists() else None
        for path in repo_dryrun_outputs
    }
    check("offline dry-run fixture has complete deterministic coverage",
          dryrun_contract_errors == [] and
          dryrun_ethics_prior_cache == SYNTHETIC_ETHICS_PRIOR_CACHE and
          dryrun_state_payload == {
              "schemaVersion": 1,
              "lastRun": None,
              "sources": {},
          })
    check("offline dry-run fixtures execute without paid work",
          dryrun_fixture_run["result"] == 0 and
          dryrun_fixture_run["searchCalls"] == 0 and
          dryrun_fixture_run["classificationCalls"] == 0 and
          dryrun_fixture_run["ledger"]["tiers"] == {
              "deterministic": "run (fetch-results.json)",
              "search_fanout": "skipped (dry-run)",
              "classification": "skipped (dry-run)",
          })
    check("offline dry-run fixture preserves exact state bytes",
          dryrun_fixture_run["initialStateBytes"] == dryrun_state_bytes and
          dryrun_fixture_run["stateBytes"] == dryrun_state_bytes and
          dryrun_fixture_run["ledger"]["metadata"]["statePersistence"] == {
              "eligible": False,
              "blockers": ["--dry-run never advances monitor state"],
          })
    check("offline dry-run writes only requested temporary outputs",
          dryrun_fixture_run["ledgerExists"] and
          dryrun_fixture_run["packetExists"] and
          dryrun_fixture_run["ledger"]["cycle"] == "2026-09" and
          "DRY RUN" in dryrun_fixture_run["packet"] and
          repo_dryrun_after == repo_dryrun_before)

    state_write_failure_labels = {
        "temp_write": "temporary-file write",
        "fsync": "temporary-file fsync",
        "replace": "atomic replacement",
    }
    for failure_stage, label in state_write_failure_labels.items():
        existing_failure = run_state_write_failure_fixture(
            complete_zero_fetch, failure_stage, existing_state=True)
        check(f"{label} failure preserves existing state exactly",
              existing_failure["result"] == 1 and
              existing_failure["stateExists"] and
              existing_failure["stateBytes"] ==
              existing_failure["initialStateBytes"] and
              existing_failure["stateMode"] ==
              existing_failure["initialStateMode"] == 0o640 and
              not existing_failure["recoveryMarkerExists"] and
              existing_failure["tempFiles"] == [])
        check(f"{label} failure reports one scrubbed error and keeps diagnostics",
              existing_failure["stderr"] == existing_failure["expectedError"] and
              existing_failure["root"] not in existing_failure["stderr"] and
              ("/" + "Users/") not in existing_failure["stderr"] and
              ("/" + "home/") not in existing_failure["stderr"] and
              "Traceback" not in existing_failure["stderr"] and
              "(advanced)" not in existing_failure["stdout"] and
              "(not advanced)" in existing_failure["stdout"] and
              existing_failure["ledger"] is not None and
              existing_failure["packet"] is not None and
              existing_failure["ledger"]["metadata"]["acceptance"]["passed"]
              is False and
              existing_failure["ledger"]["metadata"]["acceptance"]["errors"] ==
              [existing_failure["expectedMetadataError"]] and
              existing_failure["ledger"]["metadata"]["statePersistence"] == {
                  "eligible": False,
                  "blockers": [existing_failure["expectedMetadataError"]],
              } and
              existing_failure["expectedMetadataError"] in
              existing_failure["packet"])

        absent_failure = run_state_write_failure_fixture(
            complete_zero_fetch, failure_stage, existing_state=False)
        check(f"{label} failure leaves absent isolated state absent",
              absent_failure["result"] == 1 and
              not absent_failure["stateExists"] and
              absent_failure["stateBytes"] is None and
              absent_failure["stateMode"] is None and
              not absent_failure["recoveryMarkerExists"] and
              absent_failure["tempFiles"] == [] and
              absent_failure["stderr"] == absent_failure["expectedError"] and
              absent_failure["root"] not in absent_failure["stderr"] and
              ("/" + "Users/") not in absent_failure["stderr"] and
              ("/" + "home/") not in absent_failure["stderr"] and
              "Traceback" not in absent_failure["stderr"] and
              "(advanced)" not in absent_failure["stdout"] and
              "(not advanced)" in absent_failure["stdout"] and
              absent_failure["ledger"] is not None and
              absent_failure["packet"] is not None and
              absent_failure["ledger"]["metadata"]["acceptance"]["passed"]
              is False and
              absent_failure["ledger"]["metadata"]["statePersistence"] == {
                  "eligible": False,
                  "blockers": [absent_failure["expectedMetadataError"]],
              })

    producer_failure_cases = {
        "malformed response": (SimpleNamespace(status_code=200, text=""), None,
         {"status": "malformed_data", "error": "empty response"},
         "malformed_data: empty response"),
        "HTTP error": (SimpleNamespace(status_code=503, text="unavailable"), None,
         {"status": "http_error", "code": 503},
         "http_error: HTTP 503"),
        "request exception": (None, RuntimeError("fixture request failure"),
         {"status": "error", "error": "fixture request failure"},
         "error: fixture request failure"),
    }
    producer_consumer_cases = (
        ("permanent_residents", "malformed response"),
        ("permanent_residents", "HTTP error"),
        ("work_permits_imp", "HTTP error"),
        ("work_permits_imp", "request exception"),
        ("work_permits_tfwp", "request exception"),
        ("study_permits", "malformed response"),
    )
    producer_outputs = {}
    for producer_key, label in producer_consumer_cases:
        consumer_key = f"ircc_{producer_key}"
        response, request_error, expected_result, expected_detail = (
            producer_failure_cases[label])
        request_patch = (
            patch.object(fetch_data.requests, "get", side_effect=request_error)
            if request_error else
            patch.object(fetch_data.requests, "get", return_value=response)
        )
        with request_patch:
            producer_result = fetch_data.fetch_ircc_csv(producer_key)
        producer_outputs[(producer_key, label)] = producer_result
        check(f"{consumer_key} producer emits exact {label} contract",
              producer_result == expected_result)

        failed_payload = complete_fetch_payload(
            coverage=deterministic_coverage)
        failed_payload["results"][consumer_key] = producer_result
        failed_run = run_acceptance_fixture(failed_payload)
        check(f"{consumer_key} monitor reports exact {label} tier diagnostic",
              failed_run["ledger"]["tiers"]["deterministic"] ==
              f"failed ({consumer_key} returned {expected_detail})")
        check(f"{consumer_key} monitor records exact {label} access diagnostic",
              failed_run["ledger"]["accessFailures"] == [{
                  "surface": consumer_key,
                  "method": "csv",
                  "detail": expected_detail,
              }])
        check(f"{consumer_key} {label} preserves state and skips paid tiers",
              failed_run["result"] == 1 and
              state_unchanged(failed_run) and
              failed_run["searchCalls"] == 0 and
              failed_run["classificationCalls"] == 0)

    invalid_cycle = run_acceptance_fixture(
        complete_zero_fetch, strict=False, cycle="2026-13")
    check("invalid cycle is a stderr-only invocation error",
          invalid_cycle["result"] == 1 and
          invalid_cycle["ledger"] is None and
          invalid_cycle["packet"] is None and
          state_unchanged(invalid_cycle) and
          invalid_cycle["stateBytes"] == invalid_cycle["initialStateBytes"] and
          invalid_cycle["searchCalls"] == 0 and
          invalid_cycle["classificationCalls"] == 0 and
          invalid_cycle["stdout"] == "" and
          invalid_cycle["stderr"] ==
          "ERROR: --cycle must use YYYY-MM with month 01 through 12: 2026-13\n")

    abbreviation_stdout = io.StringIO()
    abbreviation_stderr = io.StringIO()
    abbreviation_exit = None
    try:
        with redirect_stdout(abbreviation_stdout), \
                redirect_stderr(abbreviation_stderr):
            m._main_unlocked(["--state", "fixture-state.json"])
    except SystemExit as exc:
        abbreviation_exit = exc.code
    check("abbreviated state option cannot bypass the run-lock parser",
          abbreviation_exit == 2 and
          abbreviation_stdout.getvalue() == "" and
          "unrecognized arguments: --state fixture-state.json" in
          abbreviation_stderr.getvalue())

    no_det_default_state = run_acceptance_fixture(
        empty_fetch,
        strict=False,
        use_default_state=True,
        extra_args=[
            "--no-deterministic",
            "--window-start", "2026-06-01",
            "--window-end", "2026-06-30",
        ],
        cycle="2026-06",
    )
    check("no-deterministic rejects the default live state path",
          no_det_default_state["result"] == 1 and
          no_det_default_state["ledger"] is None and
          no_det_default_state["packet"] is None and
          state_unchanged(no_det_default_state) and
          no_det_default_state["stateBytes"] ==
          no_det_default_state["initialStateBytes"] and
          no_det_default_state["stdout"] == "" and
          no_det_default_state["stderr"] ==
          "ERROR: --no-deterministic requires an isolated --state-file, not "
          "monitoring/state.json\n")

    no_det_without_window = run_acceptance_fixture(
        empty_fetch,
        strict=False,
        extra_args=["--no-deterministic"],
        cycle="2026-06",
    )
    check("no-deterministic rejects a missing fixed window",
          no_det_without_window["result"] == 1 and
          no_det_without_window["ledger"] is None and
          no_det_without_window["packet"] is None and
          state_unchanged(no_det_without_window) and
          no_det_without_window["stateBytes"] ==
          no_det_without_window["initialStateBytes"] and
          no_det_without_window["stdout"] == "" and
          no_det_without_window["stderr"] ==
          "ERROR: --no-deterministic requires --window-start and --window-end\n")

    zero_tier_historical = run_acceptance_fixture(
        empty_fetch,
        strict=False,
        extra_args=[
            "--no-deterministic", "--dry-run",
            "--window-start", "2026-06-01",
            "--window-end", "2026-06-30",
        ],
        cycle="2026-06",
    )
    check("zero-tier historical invocation is rejected before outputs",
          zero_tier_historical["result"] == 1 and
          zero_tier_historical["ledger"] is None and
          zero_tier_historical["packet"] is None and
          state_unchanged(zero_tier_historical) and
          zero_tier_historical["stateBytes"] ==
          zero_tier_historical["initialStateBytes"] and
          zero_tier_historical["stdout"] == "" and
          zero_tier_historical["stderr"] ==
          "ERROR: --no-deterministic requires the search tier to remain enabled\n")

    fetch_load_cases = (
        ("missing", {"omit_fetch_file": True},
         "fetch-results file not found: fetch-results.json"),
        ("empty", {"raw_fetch_text": "   \n"},
         "fetch-results file is empty: fetch-results.json"),
        ("malformed", {"raw_fetch_text": "{"},
         "fetch-results file is malformed JSON at line 1, column 2: "
         "fetch-results.json"),
        ("invalid UTF-8", {"raw_fetch_bytes": b"\xff"},
         "fetch-results file is not valid UTF-8 at byte offset 0: "
         "fetch-results.json"),
        ("unreadable", {"fetch_is_directory": True},
         "could not read fetch-results file fetch-results.json: Is a directory"),
    )
    for label, fixture_args, expected_detail in fetch_load_cases:
        load_failure = run_acceptance_fixture(
            complete_zero_fetch, **fixture_args)
        deterministic_status = f"failed ({expected_detail})"
        acceptance_error = (
            "Deterministic tier required but did not complete: "
            f"{deterministic_status}"
        )
        check(f"{label} fetch input writes exact diagnostic artifacts",
              load_failure["result"] == 1 and
              load_failure["ledger"]["tiers"]["deterministic"] ==
              deterministic_status and
              load_failure["ledger"]["accessFailures"] == [{
                  "surface": "fetch-results",
                  "method": "file",
                  "detail": expected_detail,
              }] and
              expected_detail in load_failure["packet"] and
              "## Source registry" in load_failure["packet"])
        check(f"{label} fetch input skips paid work and preserves state",
              state_unchanged(load_failure) and
              load_failure["searchCalls"] == 0 and
              load_failure["classificationCalls"] == 0 and
              load_failure["ledger"]["metadata"]["acceptance"] == {
                  "required": True,
                  "passed": False,
                  "errors": [acceptance_error],
              })
        check(f"{label} fetch input emits no traceback or false state claim",
              load_failure["stderr"] == f"ERROR: {acceptance_error}\n" and
              "Traceback" not in load_failure["stderr"] and
              "advanced" not in
              load_failure["ledger"]["metadata"]["statePersistence"] and
              "(not advanced)" in load_failure["stdout"])

    list_results_payload = complete_fetch_payload(
        coverage=deterministic_coverage)
    list_results_payload["results"] = []
    nested_statcan_payload = complete_fetch_payload(
        coverage=deterministic_coverage)
    nested_statcan_payload["results"]["statcan_food_cpi"]["freshness"] = []
    nested_pbo_payload = complete_fetch_payload(
        coverage=deterministic_coverage)
    nested_pbo_payload["results"]["pbo_feed"]["publications"] = [[]]
    nested_feed_payload = complete_fetch_payload(
        coverage=deterministic_coverage)
    malformed_feed = nested_feed_payload["results"]["pollster_feeds"][0]
    malformed_feed.update({
        "items": [[]],
        "all_count": 1,
        "relevant_count": 1,
        "new_count": 1,
        "cited_count": 0,
    })
    unsafe_payload_cases = (
        ("non-object payload root", [],
         "fetch-results payload is not an object"),
        ("list-shaped results", list_results_payload,
         "results is not an object"),
        ("malformed StatCan nesting", nested_statcan_payload,
         "statcan_food_cpi accessible result is missing freshness status"),
        ("malformed PBO nesting", nested_pbo_payload,
         "pbo_feed publications contains an unusable entry"),
        ("malformed feed nesting", nested_feed_payload,
         "pollster_feeds[0] items contains an unusable entry"),
    )
    for label, payload, payload_error in unsafe_payload_cases:
        malformed_run = run_acceptance_fixture(payload)
        deterministic_status = f"failed ({payload_error})"
        acceptance_error = (
            "Deterministic tier required but did not complete: "
            f"{deterministic_status}"
        )
        check(f"{label} writes one exact deterministic diagnostic",
              malformed_run["result"] == 1 and
              malformed_run["ledgerExists"] and
              malformed_run["packetExists"] and
              malformed_run["ledger"]["tiers"]["deterministic"] ==
              deterministic_status and
              malformed_run["ledger"]["metadata"]["acceptance"]["errors"] ==
              [acceptance_error] and
              malformed_run["ledger"]["accessFailures"] == [])
        check(f"{label} skips unsafe extraction and paid work",
              malformed_run["ledger"]["counts"]["surfaced"] == 0 and
              malformed_run["ledger"]["counts"]["suppressed"] == 0 and
              malformed_run["searchCalls"] == 0 and
              malformed_run["classificationCalls"] == 0 and
              malformed_run["stateBytes"] == malformed_run["initialStateBytes"])
        check(f"{label} emits no traceback",
              malformed_run["stderr"] == f"ERROR: {acceptance_error}\n" and
              "Traceback" not in malformed_run["stderr"] and
              "(not advanced)" in malformed_run["stdout"])

    backtest_candidate = m._candidate(
        "2026-06", "fixture-source", "search_fanout", "Backtest fixture",
        "https://example.org/backtest", "Historical search result",
        provisional=True, dims=["housing-supply"])
    backtest_initial_state = {
        "schemaVersion": 1,
        "lastRun": "2026-05-31T12:00:00+00:00",
        "sentinel": "preserve-backtest-history",
        "sources": {
            "sentinel-source": {
                "surfacedFingerprints": ["historical-sentinel"],
            },
        },
    }
    live_state_before_backtest = m.STATE_FILE.read_bytes()
    accepted_backtest = run_acceptance_fixture(
        empty_fetch,
        search_result=([backtest_candidate], []),
        classify_effect=classify_successfully,
        initial_state=backtest_initial_state,
        omit_fetch_file=True,
        omit_fetch_argument=True,
        extra_args=[
            "--no-deterministic",
            "--window-start", "2026-06-01",
            "--window-end", "2026-06-30",
        ],
        cycle="2026-06",
    )
    live_state_after_backtest = m.STATE_FILE.read_bytes()
    check("fixed-window isolated backtest remains supported",
          accepted_backtest["result"] == 0 and
          accepted_backtest["ledger"]["metadata"]["acceptance"]["passed"] is True and
          accepted_backtest["ledger"]["metadata"]["statePersistence"] == {
              "eligible": True,
              "blockers": [],
          } and
          accepted_backtest["ledger"]["metadata"]["windowStart"] ==
          "2026-06-01" and
          accepted_backtest["ledger"]["metadata"]["windowEnd"] ==
          "2026-06-30" and
          accepted_backtest["ledger"]["metadata"]["noDeterministic"] is True and
          accepted_backtest["ledger"]["tiers"]["deterministic"] ==
          "intentionally_skipped (--no-deterministic)" and
          accepted_backtest["fetchExists"] is False and
          "--fetch-results" not in accepted_backtest["argv"] and
          accepted_backtest["fetchLoadCalls"] == 0 and
          accepted_backtest["searchCalls"] == 1 and
          accepted_backtest["searchCallKwargs"]["stop_on_failure"] is True and
          accepted_backtest["classificationCalls"] == 1 and
          "(advanced)" in accepted_backtest["stdout"])
    check("isolated backtest advances only its state and preserves the sentinel",
          accepted_backtest["stateBytes"] !=
          accepted_backtest["initialStateBytes"] and
          accepted_backtest["state"]["lastRun"] !=
          backtest_initial_state["lastRun"] and
          accepted_backtest["state"]["sentinel"] ==
          backtest_initial_state["sentinel"] and
          accepted_backtest["state"]["sources"]["sentinel-source"] ==
          backtest_initial_state["sources"]["sentinel-source"] and
          live_state_after_backtest == live_state_before_backtest)

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
          state_unchanged(credit_failure))
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
          state_unchanged(empty_failure))

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
          state_unchanged(missing_family))

    check("complete deterministic fixture satisfies strict coverage",
          not strict_payload_errors(complete_zero_fetch))

    missing_latest_period = complete_fetch_payload(
        coverage=deterministic_coverage)
    del missing_latest_period["results"]["ircc_permanent_residents"]["latest_period"]
    missing_latest_errors = strict_payload_errors(missing_latest_period)
    check("IRCC success payload requires latest period",
          any("ircc_permanent_residents success result is missing latest_period" in error
              for error in missing_latest_errors))

    one_period_ircc = complete_fetch_payload(coverage=deterministic_coverage)
    one_period_ircc["results"]["ircc_permanent_residents"].update({
        "rows": 1,
        "period_count": 1,
    })
    one_period_errors = strict_payload_errors(one_period_ircc)
    check("IRCC success payload requires 12 monthly periods",
          any("ircc_permanent_residents success result has fewer than 12" in error
              for error in one_period_errors))

    impossible_ircc_coverage = complete_fetch_payload(
        coverage=deterministic_coverage)
    impossible_ircc_coverage["results"]["ircc_permanent_residents"].update({
        "period_count": 12,
        "earliest_period": "2021-01",
        "latest_period": "2021-02",
    })
    check("IRCC period count must agree with its coverage endpoints",
          any("inconsistent period coverage" in error
              for error in strict_payload_errors(impossible_ircc_coverage)))

    empty_success_feeds = complete_fetch_payload(coverage=deterministic_coverage)
    for key in ("pollster_feeds", "excluded_pollster_feeds", "policy_feeds"):
        for entry in empty_success_feeds["results"][key]:
            entry["items"] = []
            if key == "policy_feeds":
                entry["count"] = 0
                entry["topic_count"] = 0
            else:
                entry["all_count"] = 0
                entry["relevant_count"] = 0
                if key == "pollster_feeds":
                    entry["new_count"] = 0
                    entry["cited_count"] = 0
    empty_feed_errors = strict_payload_errors(empty_success_feeds)
    check("successful publisher feeds require at least one source entry",
          sum("success counts are inconsistent" in error
              for error in empty_feed_errors) == 12)

    inconsistent_ethics_counts = complete_fetch_payload(
        coverage=deterministic_coverage)
    inconsistent_ethics_counts["results"]["ethics_reports_diff"]["currentCount"] = 0
    ethics_count_errors = strict_payload_errors(inconsistent_ethics_counts)
    check("Ethics page and diff must agree on the current report count",
          "Ethics page and diff current counts are inconsistent" in
          ethics_count_errors)

    def strict_feed_case(key):
        payload = complete_fetch_payload(coverage=deterministic_coverage)
        return payload, payload["results"][key][0]

    def has_strict_error(payload, fragment):
        return any(fragment in error for error in strict_payload_errors(payload))

    duplicate_feed_urls, duplicate_feed_entry = strict_feed_case(
        "pollster_feeds")
    duplicate_feed_urls["results"]["pollster_feeds"].append(
        json.loads(json.dumps(duplicate_feed_entry)))
    check("duplicate configured feed URLs fail strict acceptance",
          any("pollster_feeds" in error and "duplicate" in error
              for error in strict_payload_errors(duplicate_feed_urls)))

    wrong_publisher, wrong_publisher_entry = strict_feed_case("policy_feeds")
    wrong_publisher_entry["publisher"] = "Wrong publisher"
    check("wrong feed publisher identity fails strict acceptance",
          has_strict_error(wrong_publisher, "wrong publisher identity"))

    unknown_feed_status, unknown_status_entry = strict_feed_case(
        "excluded_pollster_feeds")
    unknown_status_entry["status"] = "unknown_fixture_status"
    check("unknown feed status fails strict acceptance",
          has_strict_error(unknown_feed_status, "has an unknown status"))

    failed_feed_items, failed_feed_entry = strict_feed_case("pollster_feeds")
    failed_feed_entry.update({
        "status": "error",
        "items": [{
            "title": "Injected failed-feed item",
            "link": "https://abacusdata.ca/injected-failed-feed-item",
            "pubDate": "Tue, 01 Sep 2026 09:00:00 -0400",
            "is_cited": False,
        }],
    })
    check("failed feed results cannot carry candidate items",
          has_strict_error(failed_feed_items, "failed result contains items"))

    missing_pub_date, missing_pub_date_entry = strict_feed_case("policy_feeds")
    del missing_pub_date_entry["items"][0]["pubDate"]
    check("feed item without publication date fails strict acceptance",
          has_strict_error(missing_pub_date, "items contains an unusable entry"))

    duplicate_item_links, duplicate_item_entry = strict_feed_case("policy_feeds")
    duplicate_item_entry["items"].append(
        json.loads(json.dumps(duplicate_item_entry["items"][0])))
    duplicate_item_entry["count"] = 2
    check("duplicate feed item links fail strict acceptance",
          has_strict_error(duplicate_item_links, "contains duplicate item links"))

    wrong_item_host, wrong_item_host_entry = strict_feed_case("policy_feeds")
    wrong_item_host_entry["items"][0]["link"] = (
        "https://wrong-host.example/synthetic/non-topic")
    check("feed item from the wrong host fails strict acceptance",
          has_strict_error(wrong_item_host, "contains an item from the wrong host"))

    invalid_topic_match, invalid_topic_entry = strict_feed_case("policy_feeds")
    invalid_topic_entry["items"][0]["topic_match"] = "false"
    check("policy feed topic_match must be Boolean",
          has_strict_error(invalid_topic_match, "success counts are inconsistent"))

    wrong_topic_count, wrong_topic_count_entry = strict_feed_case("policy_feeds")
    wrong_topic_count_entry["topic_count"] = 1
    check("policy feed topic_count must match its items",
          has_strict_error(wrong_topic_count, "success counts are inconsistent"))

    def add_main_pollster_item(entry, *, is_cited=False):
        feed_host = m.host_of(entry["url"])
        entry.update({
            "all_count": 1,
            "relevant_count": 1,
            "new_count": 0 if is_cited else 1,
            "cited_count": 1 if is_cited else 0,
            "items": [{
                "title": "Synthetic pollster item",
                "link": f"https://{feed_host}/synthetic/pollster-item",
                "pubDate": "Tue, 01 Sep 2026 09:00:00 -0400",
                "is_cited": is_cited,
            }],
        })

    invalid_is_cited, invalid_is_cited_entry = strict_feed_case(
        "pollster_feeds")
    add_main_pollster_item(invalid_is_cited_entry)
    invalid_is_cited_entry["items"][0]["is_cited"] = "false"
    check("main pollster is_cited must be Boolean",
          has_strict_error(
              invalid_is_cited, "citation counts are inconsistent"))

    wrong_new_count, wrong_new_count_entry = strict_feed_case("pollster_feeds")
    add_main_pollster_item(wrong_new_count_entry)
    wrong_new_count_entry["new_count"] = 0
    check("main pollster new_count must match uncited items",
          has_strict_error(wrong_new_count, "citation counts are inconsistent"))

    wrong_cited_count, wrong_cited_count_entry = strict_feed_case(
        "pollster_feeds")
    add_main_pollster_item(wrong_cited_count_entry, is_cited=True)
    wrong_cited_count_entry["cited_count"] = 0
    check("main pollster cited_count must match cited items",
          has_strict_error(
              wrong_cited_count, "citation counts are inconsistent"))

    pollster_over_cap, pollster_over_cap_entry = strict_feed_case(
        "pollster_feeds")
    pollster_over_cap_entry["all_count"] = 16
    check("pollster feed source count cannot exceed its cap",
          has_strict_error(pollster_over_cap, "success counts are inconsistent"))

    policy_over_cap, policy_over_cap_entry = strict_feed_case("policy_feeds")
    policy_host = m.host_of(policy_over_cap_entry["url"])
    policy_over_cap_entry.update({
        "count": 9,
        "topic_count": 0,
        "items": [{
            "title": f"Synthetic policy item {index}",
            "link": f"https://{policy_host}/synthetic/policy-item-{index}",
            "pubDate": "Tue, 01 Sep 2026 09:00:00 -0400",
            "topic_match": False,
        } for index in range(9)],
    })
    check("policy feed item count cannot exceed its cap",
          has_strict_error(policy_over_cap, "success counts are inconsistent"))

    wrong_pbo_host = complete_fetch_payload(coverage=deterministic_coverage)
    wrong_pbo_host["results"]["pbo_feed"]["publications"][0]["link"] = (
        "https://pbo-dpb.ca.evil.example/synthetic/publication")
    check("PBO publications must use the official publisher host",
          has_strict_error(wrong_pbo_host, "link from the wrong host"))

    duplicate_pbo_links = complete_fetch_payload(coverage=deterministic_coverage)
    duplicate_pbo = duplicate_pbo_links["results"]["pbo_feed"]
    duplicate_publication = json.loads(json.dumps(duplicate_pbo["publications"][0]))
    duplicate_publication["link"] += "?utm_source=duplicate"
    duplicate_pbo["publications"].append(duplicate_publication)
    duplicate_pbo["count"] = 2
    check("PBO publications reject duplicate normalized links",
          has_strict_error(
              duplicate_pbo_links, "duplicate normalized links"))

    wrong_ethics_url = complete_fetch_payload(coverage=deterministic_coverage)
    wrong_ethics_url["results"]["ethics_reports_page"]["url"] = (
        "https://wrong-host.example/en/report")
    check("wrong Ethics page URL fails strict acceptance",
          has_strict_error(wrong_ethics_url, "wrong url"))

    successful_page_failed_diff = complete_fetch_payload(
        coverage=deterministic_coverage)
    successful_page_failed_diff["results"]["ethics_reports_diff"] = {
        "status": "error",
        "error": "synthetic diff failure",
    }
    successful_page_failed_diff_run = run_acceptance_fixture(
        successful_page_failed_diff)
    check("successful Ethics page cannot pair with a failed diff",
          has_strict_error(successful_page_failed_diff, "status pair is invalid") and
          successful_page_failed_diff_run["result"] == 1 and
          state_unchanged(successful_page_failed_diff_run) and
          "Traceback" not in successful_page_failed_diff_run["stderr"])

    failed_page_successful_diff = complete_fetch_payload(
        coverage=deterministic_coverage)
    failed_page_successful_diff["results"]["ethics_reports_page"] = {
        "status": "error",
        "error": "synthetic page failure",
        "url": m.ETHICS_REPORTS_URL,
    }
    failed_page_successful_diff_run = run_acceptance_fixture(
        failed_page_successful_diff)
    check("failed Ethics page cannot pair with a successful diff",
          has_strict_error(failed_page_successful_diff, "status pair is invalid") and
          failed_page_successful_diff_run["result"] == 1 and
          state_unchanged(failed_page_successful_diff_run) and
          "Traceback" not in failed_page_successful_diff_run["stderr"])

    duplicate_ethics_reports = complete_fetch_payload(
        coverage=deterministic_coverage)
    duplicate_page = duplicate_ethics_reports["results"]["ethics_reports_page"]
    duplicate_page["reports"].append(
        json.loads(json.dumps(duplicate_page["reports"][0])))
    duplicate_page["count"] = 2
    duplicate_ethics_reports["results"]["ethics_reports_diff"].update({
        "priorCount": 2,
        "currentCount": 2,
    })
    check("duplicate Ethics page reports fail strict acceptance",
          has_strict_error(
              duplicate_ethics_reports, "contains duplicate reports"))

    successful_ethics_removal = complete_fetch_payload(
        coverage=deterministic_coverage)
    removal_diff = successful_ethics_removal["results"]["ethics_reports_diff"]
    removal_diff["removals"] = [{
        "title": "Synthetic removed report",
        "url": "https://www.ethicscanada.ca/en/report/removedfixture",
    }]
    check("successful Ethics diff cannot contain removals",
          has_strict_error(successful_ethics_removal, "contains removals"))

    missing_prior_count = complete_fetch_payload(coverage=deterministic_coverage)
    del missing_prior_count["results"]["ethics_reports_diff"]["priorCount"]
    check("successful Ethics diff requires priorCount",
          has_strict_error(missing_prior_count, "is missing priorCount"))

    invalid_prior_count = complete_fetch_payload(coverage=deterministic_coverage)
    invalid_prior_count["results"]["ethics_reports_diff"]["priorCount"] = -1
    check("successful Ethics diff rejects invalid priorCount",
          has_strict_error(invalid_prior_count, "is missing priorCount"))

    inconsistent_ethics_diff = complete_fetch_payload(
        coverage=deterministic_coverage)
    inconsistent_ethics_diff["results"]["ethics_reports_diff"]["priorCount"] = 0
    check("Ethics prior, addition, and current counts must agree",
          has_strict_error(inconsistent_ethics_diff, "counts are inconsistent"))

    duplicate_ethics_additions = complete_fetch_payload(
        coverage=deterministic_coverage)
    duplicate_addition_page = duplicate_ethics_additions["results"][
        "ethics_reports_page"]
    duplicate_addition = {
        "title": "Synthetic added report",
        "url": "https://www.ethicscanada.ca/en/report/addedfixture",
    }
    duplicate_addition_page.update({
        "count": 2,
        "reports": [
            duplicate_addition,
            {
                "title": "Synthetic other report",
                "url": "https://www.ethicscanada.ca/en/report/otherfixture",
            },
        ],
    })
    duplicate_ethics_additions["results"]["ethics_reports_diff"].update({
        "additions": [duplicate_addition, json.loads(json.dumps(duplicate_addition))],
        "priorCacheFound": False,
        "priorCount": 0,
        "currentCount": 2,
    })
    check("duplicate Ethics additions fail strict acceptance",
          has_strict_error(
              duplicate_ethics_additions, "contains duplicate additions"))

    missing_page_addition = complete_fetch_payload(coverage=deterministic_coverage)
    missing_page_addition["results"]["ethics_reports_diff"].update({
        "additions": [{
            "title": "Synthetic absent report",
            "url": "https://www.ethicscanada.ca/en/report/absentfixture",
        }],
        "priorCacheFound": False,
        "priorCount": 0,
        "currentCount": 1,
    })
    check("Ethics additions must be present on the accepted page",
          has_strict_error(
              missing_page_addition, "additions are missing from the page"))

    wrong_ethics_delta = complete_fetch_payload(coverage=deterministic_coverage)
    wrong_delta_page = wrong_ethics_delta["results"]["ethics_reports_page"]
    existing_report = wrong_delta_page["reports"][0]
    new_report = {
        "title": "Actually new report",
        "url": "https://www.ethicscanada.ca/en/report/actuallynewfixture",
    }
    wrong_delta_page["reports"].append(new_report)
    wrong_delta_page["count"] = 2
    wrong_ethics_delta["results"]["ethics_reports_diff"].update({
        "priorCount": 1,
        "currentCount": 2,
        "priorReportKeys": [
            urlparse(existing_report["url"]).path.lower().rstrip("/")],
        "currentReportKeys": [
            urlparse(existing_report["url"]).path.lower().rstrip("/"),
            urlparse(new_report["url"]).path.lower().rstrip("/"),
        ],
        "additions": [existing_report],
    })
    check("Ethics additions must equal the exact prior-to-current key delta",
          has_strict_error(
              wrong_ethics_delta, "additions do not match the report-key delta"))

    forged_ethics_prior = complete_fetch_payload(coverage=deterministic_coverage)
    forged_page = forged_ethics_prior["results"]["ethics_reports_page"]
    accepted_report = forged_page["reports"][0]
    actual_new_report = {
        "title": "Actual new report hidden by forged prior keys",
        "url": "https://www.ethicscanada.ca/en/report/actualnewfixture",
    }
    forged_page["reports"].append(actual_new_report)
    forged_page["count"] = 2
    forged_ethics_prior["results"]["ethics_reports_diff"].update({
        "priorCacheFound": True,
        "priorCount": 1,
        "currentCount": 2,
        "priorReportKeys": [
            urlparse(actual_new_report["url"]).path.lower().rstrip("/")],
        "currentReportKeys": [
            urlparse(accepted_report["url"]).path.lower().rstrip("/"),
            urlparse(actual_new_report["url"]).path.lower().rstrip("/"),
        ],
        "additions": [accepted_report],
        "removals": [],
    })
    forged_ethics_errors = strict_payload_errors(forged_ethics_prior)
    forged_ethics_run = run_acceptance_fixture(
        forged_ethics_prior,
        ethics_prior_cache_payload=SYNTHETIC_ETHICS_PRIOR_CACHE)
    check("Ethics prior keys are bound to the accepted pre-fetch cache",
          any("prior report keys do not match the pre-fetch cache snapshot" in error
              for error in forged_ethics_errors) and
          forged_ethics_run["result"] == 1 and
          forged_ethics_run["searchCalls"] == 0 and
          forged_ethics_run["classificationCalls"] == 0 and
          state_unchanged(forged_ethics_run))

    missing_ethics_snapshot_errors = m.deterministic_payload_errors(
        complete_zero_fetch,
        expected_cycle="2026-09",
        require_link_rot=True,
        expected_link_urls=expected_coverage["link_urls"],
        expected_legisinfo=expected_coverage["legisinfo"],
        require_ethics_prior_cache=True,
    )
    check("strict Ethics acceptance requires the pre-fetch cache snapshot",
          any("requires a pre-fetch cache snapshot" in error
              for error in missing_ethics_snapshot_errors))

    empty_ethics_snapshot_errors = m.deterministic_payload_errors(
        complete_zero_fetch,
        expected_cycle="2026-09",
        require_link_rot=True,
        expected_link_urls=expected_coverage["link_urls"],
        expected_legisinfo=expected_coverage["legisinfo"],
        ethics_prior_report_keys=[],
        require_ethics_prior_cache=True,
    )
    check("strict Ethics acceptance rejects an empty external snapshot",
          any("snapshot has invalid report keys" in error
              for error in empty_ethics_snapshot_errors) and
          any("requires a pre-fetch cache snapshot" in error
              for error in empty_ethics_snapshot_errors))

    initial_ethics_cache = complete_fetch_payload(coverage=deterministic_coverage)
    initial_ethics_cache["results"]["ethics_reports_diff"].update({
        "priorCacheFound": False,
        "priorCount": 0,
        "priorReportKeys": [],
        "additions": [],
    })
    initial_ethics_errors = strict_payload_errors(initial_ethics_cache)
    initial_ethics_run = run_acceptance_fixture(initial_ethics_cache)
    check("strict Ethics acceptance rejects a payload-only initial baseline",
          any("requires a pre-fetch cache snapshot" in error
              for error in initial_ethics_errors) and
          initial_ethics_run["result"] == 1 and
          initial_ethics_run["searchCalls"] == 0 and
          initial_ethics_run["classificationCalls"] == 0 and
          state_unchanged(initial_ethics_run))

    local_http_failure = complete_fetch_payload(coverage=deterministic_coverage)
    local_http_failure["results"]["ircc_permanent_residents"] = (
        producer_outputs[("permanent_residents", "HTTP error")])
    local_http_run = run_acceptance_fixture(
        local_http_failure,
        api_keys=False,
        strict=False,
    )
    local_http_error = (
        "Deterministic tier required but did not complete: failed "
        "(ircc_permanent_residents returned http_error: HTTP 503)"
    )
    local_http_access_failure = {
        "surface": "ircc_permanent_residents",
        "method": "csv",
        "detail": "http_error: HTTP 503",
    }
    check("local IRCC failure blocks acceptance without require-complete",
          local_http_run["result"] != 0 and
          local_http_run["ledger"]["metadata"]["acceptance"]["required"] is True and
          local_http_run["ledger"]["metadata"]["acceptance"]["passed"] is False and
          local_http_run["ledger"]["metadata"]["acceptance"]["errors"] ==
          [local_http_error])
    check("local IRCC failure records the exact CSV diagnostic",
          local_http_run["ledger"]["accessFailures"] ==
          [local_http_access_failure])
    check("local IRCC failure skips paid tiers and preserves state",
          local_http_run["searchCalls"] == 0 and
          local_http_run["classificationCalls"] == 0 and
          local_http_run["ledger"]["tiers"]["search_fanout"] ==
          "skipped (deterministic preflight failed)" and
          local_http_run["ledger"]["tiers"]["classification"] ==
          "skipped (deterministic preflight failed)" and
          state_unchanged(local_http_run))

    unknown_ircc_status = complete_fetch_payload(coverage=deterministic_coverage)
    unknown_ircc_status["results"]["ircc_permanent_residents"] = {
        "status": "future_failure",
    }
    unknown_ircc_run = run_acceptance_fixture(
        unknown_ircc_status,
        api_keys=False,
        strict=False,
    )
    unknown_ircc_error = (
        "Deterministic tier required but did not complete: failed "
        "(ircc_permanent_residents returned future_failure)"
    )
    unknown_ircc_access_failure = {
        "surface": "ircc_permanent_residents",
        "method": "csv",
        "detail": "future_failure",
    }
    check("future IRCC non-success status fails closed through main",
          unknown_ircc_run["result"] != 0 and
          unknown_ircc_run["ledger"]["metadata"]["acceptance"]["required"] is True and
          unknown_ircc_run["ledger"]["metadata"]["acceptance"]["passed"] is False and
          unknown_ircc_run["ledger"]["metadata"]["acceptance"]["errors"] ==
          [unknown_ircc_error])
    check("future IRCC non-success status records the exact CSV diagnostic",
          unknown_ircc_run["ledger"]["accessFailures"] ==
          [unknown_ircc_access_failure])
    check("future IRCC non-success status skips paid tiers and preserves state",
          unknown_ircc_run["searchCalls"] == 0 and
          unknown_ircc_run["classificationCalls"] == 0 and
          unknown_ircc_run["ledger"]["tiers"]["search_fanout"] ==
          "skipped (deterministic preflight failed)" and
          unknown_ircc_run["ledger"]["tiers"]["classification"] ==
          "skipped (deterministic preflight failed)" and
          state_unchanged(unknown_ircc_run))

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
              state_unchanged(truncated_run))

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
        unusable_run = run_acceptance_fixture(unusable_fetch)
        check(f"unusable {label} entry fails strict acceptance",
              unusable_run["result"] == 1 and
              result_key in unusable_run["ledger"]["tiers"]["deterministic"])
        check(f"unusable {label} entry skips extraction and paid tiers",
              state_unchanged(unusable_run) and
              unusable_run["ledger"]["counts"]["surfaced"] == 0 and
              unusable_run["ledger"]["counts"]["suppressed"] == 0 and
              unusable_run["searchCalls"] == 0 and
              unusable_run["classificationCalls"] == 0)

    truncated_feed_fetch = complete_fetch_payload(coverage=deterministic_coverage)
    del truncated_feed_fetch["results"]["pollster_feeds"][0]["items"]
    truncated_feed = run_acceptance_fixture(
        truncated_feed_fetch, search_result=([], []))
    check("truncated successful feed payload fails strict acceptance",
          truncated_feed["result"] == 1 and
          "pollster_feeds[0]" in truncated_feed["ledger"]["tiers"]["deterministic"])
    check("truncated successful feed payload does not advance state",
          state_unchanged(truncated_feed))

    unusable_feed_fetch = complete_fetch_payload(coverage=deterministic_coverage)
    unusable_feed_fetch["results"]["pollster_feeds"][0].update({
        "items": [{}], "all_count": 1, "relevant_count": 1,
        "new_count": 1, "cited_count": 0,
    })
    unusable_feed = run_acceptance_fixture(unusable_feed_fetch)
    check("unusable successful feed entry fails strict acceptance",
          unusable_feed["result"] == 1 and
          "pollster_feeds[0]" in unusable_feed["ledger"]["tiers"]["deterministic"])
    check("unusable successful feed entry skips extraction and paid tiers",
          state_unchanged(unusable_feed) and
          unusable_feed["ledger"]["counts"]["surfaced"] == 0 and
          unusable_feed["ledger"]["counts"]["suppressed"] == 0 and
          unusable_feed["searchCalls"] == 0 and
          unusable_feed["classificationCalls"] == 0)

    truncated_bill_fetch = complete_fetch_payload(coverage=deterministic_coverage)
    truncated_bill_fetch["results"]["legisinfo"][0]["record"] = {"status": ""}
    truncated_bill = run_acceptance_fixture(
        truncated_bill_fetch, search_result=([], []))
    check("truncated LEGISinfo record fails strict acceptance",
          truncated_bill["result"] == 1 and
          "legisinfo" in truncated_bill["ledger"]["tiers"]["deterministic"])
    check("truncated LEGISinfo record does not advance state",
          state_unchanged(truncated_bill))

    unusable_bill_fetch = complete_fetch_payload(coverage=deterministic_coverage)
    unusable_bill_fetch["results"]["legisinfo"][0]["record"] = {"status": "success"}
    unusable_bill = run_acceptance_fixture(unusable_bill_fetch)
    check("unusable successful LEGISinfo record fails strict acceptance",
          unusable_bill["result"] == 1 and
          "legisinfo" in unusable_bill["ledger"]["tiers"]["deterministic"])
    check("unusable successful LEGISinfo record skips extraction and paid tiers",
          state_unchanged(unusable_bill) and
          unusable_bill["ledger"]["counts"]["surfaced"] == 0 and
          unusable_bill["ledger"]["counts"]["suppressed"] == 0 and
          unusable_bill["searchCalls"] == 0 and
          unusable_bill["classificationCalls"] == 0)

    malformed_legisinfo_records = (
        ("null", None),
        ("scalar", "blocked"),
        ("list", ["blocked"]),
    )
    for label, malformed_record in malformed_legisinfo_records:
        malformed_bill_fetch = complete_fetch_payload(
            coverage=deterministic_coverage)
        malformed_bill_fetch["results"]["legisinfo"][0]["record"] = (
            malformed_record)
        malformed_bill = run_acceptance_fixture(malformed_bill_fetch)
        deterministic_error = (
            "legisinfo contains a result without record status")
        acceptance_error = (
            "Deterministic tier required but did not complete: failed "
            f"({deterministic_error})")
        check(f"{label} LEGISinfo record emits one safe deterministic diagnostic",
              malformed_bill["result"] == 1 and
              malformed_bill["ledger"]["tiers"]["deterministic"] ==
              f"failed ({deterministic_error})" and
              malformed_bill["ledger"]["metadata"]["acceptance"]["errors"] ==
              [acceptance_error] and
              malformed_bill["ledgerExists"] and
              malformed_bill["packetExists"] and
              malformed_bill["stderr"] == f"ERROR: {acceptance_error}\n" and
              "Traceback" not in malformed_bill["stderr"])
        check(f"{label} LEGISinfo record skips extraction, paid tiers, and state",
              malformed_bill["ledger"]["counts"]["surfaced"] == 0 and
              malformed_bill["ledger"]["counts"]["suppressed"] == 0 and
              malformed_bill["searchCalls"] == 0 and
              malformed_bill["classificationCalls"] == 0 and
              state_unchanged(malformed_bill) and
              "(not advanced)" in malformed_bill["stdout"])

    invalid_generated_at_errors = []
    for invalid_generated_at in (
            "2026-09-01X13:17:00",
            "2026-09-01\n13:17:00",
            "2026-09-01\x0013:17:00",
            "2026-09-01"):
        invalid_generated_at_fetch = complete_fetch_payload(
            coverage=deterministic_coverage)
        invalid_generated_at_fetch["generatedAt"] = invalid_generated_at
        invalid_generated_at_errors.append(
            strict_payload_errors(invalid_generated_at_fetch))
    check("generatedAt requires a complete anchored ISO timestamp",
          all(any("generatedAt is not a valid ISO timestamp" in error
                  for error in errors)
              for errors in invalid_generated_at_errors))

    wrong_cycle_fetch = complete_fetch_payload(coverage=deterministic_coverage)
    wrong_cycle_fetch["cycle"] = "2026-08"
    wrong_cycle = run_acceptance_fixture(wrong_cycle_fetch, search_result=([], []))
    check("wrong deterministic payload cycle fails strict acceptance",
          wrong_cycle["result"] == 1 and
          any("requested cycle" in error for error in
              strict_payload_errors(wrong_cycle_fetch)))
    check("wrong deterministic payload cycle does not advance state",
          state_unchanged(wrong_cycle))

    false_link_rot_fetch = complete_fetch_payload(coverage=deterministic_coverage)
    false_link_rot_fetch["linkRot"] = False
    false_link_rot = run_acceptance_fixture(false_link_rot_fetch, search_result=([], []))
    check("strict live payload rejects a false linkRot marker",
          false_link_rot["result"] == 1 and
          any("linkRot must be true" in error for error in
              strict_payload_errors(false_link_rot_fetch)))
    check("false linkRot marker does not advance state",
          state_unchanged(false_link_rot))

    missing_link_rot_fetch = complete_fetch_payload(coverage=deterministic_coverage)
    del missing_link_rot_fetch["results"]["link_rot"]
    missing_link_rot = run_acceptance_fixture(
        missing_link_rot_fetch, search_result=([], []))
    check("strict live payload rejects a missing link scan",
          missing_link_rot["result"] == 1 and
          any("link_rot results are missing" in error for error in
              strict_payload_errors(missing_link_rot_fetch)))
    check("missing link scan does not advance state",
          state_unchanged(missing_link_rot))

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
              state_unchanged(truncated_run))

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
          search_failure["ledger"]["tiers"]["classification"] ==
          "skipped (strict search tier incomplete)" and
          search_failure["ledger"]["metadata"]["acceptance"]["errors"] == [
              "Search fan-out required but did not complete: failed "
              "(1 query errors; 1 hits retained)"
          ] and
          search_failure["searchCallKwargs"]["stop_on_failure"] is True and
          search_failure["classificationCalls"] == 0)
    check("search failure does not advance state",
          state_unchanged(search_failure))

    retry_search_candidate = m._candidate(
        "2026-09", "fixture-source", "search_fanout", "Retry fixture",
        "https://example.org/retry", "Retry search result",
        provisional=True, dims=["housing-supply"])
    paid_failure = [{
        "surface": "Fixture publisher",
        "method": "search_fanout",
        "detail": "tavily http 500",
    }]
    deterministic_tier = "run (fetch-results.json)"
    classification_tier = f"run (model {m.DEFAULT_MODEL})"
    diagnostic_retry_cases = (
        {
            "label": "dry-run",
            "payload": complete_candidate_fetch,
            "args": ["--dry-run"],
            "search": ([], []),
            "classifier": None,
            "retrySearch": ([], []),
            "blockers": ["--dry-run never advances monitor state"],
            "calls": (0, 0),
            "tiers": {
                "deterministic": deterministic_tier,
                "search_fanout": "skipped (dry-run)",
                "classification": "skipped (dry-run)",
            },
            "retrySearchTier": "run (0 hits)",
        },
        {
            "label": "no-classify",
            "payload": complete_candidate_fetch,
            "args": ["--no-classify"],
            "search": ([], []),
            "classifier": None,
            "retrySearch": ([], []),
            "blockers": ["--no-classify prevents monitor state advancement"],
            "calls": (1, 0),
            "tiers": {
                "deterministic": deterministic_tier,
                "search_fanout": "run (0 hits)",
                "classification": "skipped (--no-classify)",
            },
            "retrySearchTier": "run (0 hits)",
        },
        {
            "label": "no-search",
            "payload": complete_candidate_fetch,
            "args": ["--no-search"],
            "search": ([], []),
            "classifier": classify_successfully,
            "retrySearch": ([], []),
            "blockers": ["--no-search prevents monitor state advancement"],
            "calls": (0, 1),
            "tiers": {
                "deterministic": deterministic_tier,
                "search_fanout": "skipped (--no-search)",
                "classification": classification_tier,
            },
            "retrySearchTier": "run (0 hits)",
        },
        {
            "label": "non-strict search failure",
            "payload": complete_zero_fetch,
            "args": [],
            "search": (
                [json.loads(json.dumps(retry_search_candidate))], paid_failure),
            "classifier": classify_successfully,
            "retrySearch": (
                [json.loads(json.dumps(retry_search_candidate))], []),
            "blockers": [
                "Search fan-out tier did not complete: failed "
                "(1 query errors; 1 hits retained)",
            ],
            "calls": (1, 1),
            "tiers": {
                "deterministic": deterministic_tier,
                "search_fanout": "failed (1 query errors; 1 hits retained)",
                "classification": classification_tier,
            },
            "retrySearchTier": "run (1 hits)",
        },
        {
            "label": "non-strict classification failure",
            "payload": complete_candidate_fetch,
            "args": [],
            "search": ([], []),
            "classifier": insufficient_credit,
            "retrySearch": ([], []),
            "blockers": [
                "Classification tier did not complete: failed "
                "(Claude request failed: insufficient credit)",
            ],
            "calls": (1, 1),
            "tiers": {
                "deterministic": deterministic_tier,
                "search_fanout": "run (0 hits)",
                "classification": (
                    "failed (Claude request failed: insufficient credit)"),
            },
            "retrySearchTier": "run (0 hits)",
        },
    )
    for case in diagnostic_retry_cases:
        label = case["label"]
        two_pass = run_diagnostic_retry_fixture(
            case["payload"],
            diagnostic_extra_args=case["args"],
            diagnostic_search_result=case["search"],
            diagnostic_classify_effect=case["classifier"],
            retry_search_result=case["retrySearch"],
            retry_classify_effect=classify_successfully,
        )
        diagnostic = two_pass["diagnostic"]
        retry = two_pass["retry"]
        diagnostic_fingerprints = ledger_fingerprints(diagnostic)
        retry_fingerprints = ledger_fingerprints(retry)
        check(f"{label} is an exit-zero non-mutating diagnostic",
              diagnostic["result"] == 0 and
              diagnostic["ledger"]["metadata"]["acceptance"] == {
                  "required": True,
                  "passed": True,
                  "errors": [],
              } and
              diagnostic["ledger"]["metadata"]["statePersistence"] == {
                  "eligible": False,
                  "blockers": case["blockers"],
              } and
              diagnostic["state"] == two_pass["initialState"] and
              diagnostic["beforeStateBytes"] == two_pass["initialStateBytes"] and
              diagnostic["stateBytes"] == diagnostic["beforeStateBytes"] and
              retry["beforeStateBytes"] == diagnostic["stateBytes"] and
              bool(diagnostic_fingerprints) and
              "(not advanced)" in diagnostic["stdout"])
        check(f"{label} executes the exact diagnostic tier path",
              (diagnostic["searchCalls"],
               diagnostic["classificationCalls"]) == case["calls"] and
              (diagnostic["searchCallKwargs"] is None
               if case["calls"][0] == 0 else
               diagnostic["searchCallKwargs"]["stop_on_failure"] is False) and
              diagnostic["ledger"]["tiers"] == case["tiers"])
        check(f"{label} strict retry resurfaces and persists every fingerprint",
              retry["result"] == 0 and
              retry["ledger"]["metadata"]["acceptance"]["passed"] is True and
              retry["ledger"]["metadata"]["statePersistence"] == {
                  "eligible": True,
                  "blockers": [],
              } and
              retry["searchCalls"] == 1 and
              retry["searchCallKwargs"]["stop_on_failure"] is True and
              retry["classificationCalls"] == 1 and
              retry["ledger"]["tiers"] == {
                  "deterministic": deterministic_tier,
                  "search_fanout": case["retrySearchTier"],
                  "classification": classification_tier,
              } and
              retry_fingerprints == diagnostic_fingerprints and
              retry_fingerprints <= state_fingerprints(retry["state"]) and
              retry["stateBytes"] != retry["beforeStateBytes"] and
              retry["state"]["lastRun"] != two_pass["initialState"]["lastRun"] and
              retry["state"]["sentinel"] == two_pass["initialState"]["sentinel"] and
              retry["state"]["sources"]["sentinel-source"] ==
              two_pass["initialState"]["sources"]["sentinel-source"] and
              "(advanced)" in retry["stdout"])

    zero_candidates = run_acceptance_fixture(complete_zero_fetch, search_result=([], []))
    check("zero-candidate classification skip passes acceptance",
          zero_candidates["result"] == 0 and
          zero_candidates["ledger"]["tiers"]["classification"] == "skipped (no candidates)" and
          zero_candidates["ledger"]["metadata"]["acceptance"]["passed"] is True)
    check("accepted zero-candidate run advances state",
          zero_candidates["state"].get("lastRun") is not None and
          not zero_candidates["recoveryMarkerExists"])
    check("successful monitor output does not leak absolute local paths",
          zero_candidates["root"] not in zero_candidates["stdout"] and
          "candidates: candidates.json" in zero_candidates["stdout"] and
          "packet:     candidates.md" in zero_candidates["stdout"] and
          "state:      state.json (advanced)" in zero_candidates["stdout"])

    with tempfile.TemporaryDirectory() as marker_td:
        exclusive_marker = Path(marker_td) / "state.json.recovery-pending"
        m.create_state_recovery_marker(exclusive_marker)
        first_marker_bytes = exclusive_marker.read_bytes()
        first_marker_mode = exclusive_marker.stat().st_mode & 0o777
        second_create_failed = False
        try:
            m.create_state_recovery_marker(exclusive_marker)
        except FileExistsError:
            second_create_failed = True
        check("recovery marker creation is exclusive and preserves first marker",
              second_create_failed and
              exclusive_marker.read_bytes() == first_marker_bytes and
              exclusive_marker.stat().st_mode & 0o777 == first_marker_mode == 0o600)

    with tempfile.TemporaryDirectory() as lock_td:
        lock_root = Path(lock_td)
        lock_state = lock_root / "state.json"
        lock_state_alias = Path(str(lock_state).swapcase())
        lock_ledger = lock_root / "candidates.json"
        lock_packet = lock_root / "candidates.md"
        lock_fd = m.acquire_monitor_run_lock(lock_state)
        lock_mode = os.fstat(lock_fd).st_mode & 0o777
        try:
            blocked_run = subprocess.run(
                [
                    sys.executable,
                    str(SCRIPT_DIR / "monitor_sources.py"),
                    "--state-file", str(lock_state_alias),
                    "--ledger-path", str(lock_ledger),
                    "--packet-path", str(lock_packet),
                ],
                cwd=SCRIPT_DIR.parent,
                capture_output=True,
                text=True,
                check=False,
            )
        finally:
            m.release_monitor_run_lock(lock_fd)
        retry_lock_fd = m.acquire_monitor_run_lock(lock_state)
        m.release_monitor_run_lock(retry_lock_fd)
        check("active run lock rejects a second process before monitor work",
              lock_mode == 0o600 and
              blocked_run.returncode == 1 and
              blocked_run.stdout == "" and
              blocked_run.stderr == (
                  "ERROR: another source monitor run is active for state file "
                  f"{lock_state_alias.name}\n") and
              m.monitor_run_lock_path(lock_state) ==
              m.monitor_run_lock_path(lock_state_alias) and
              not lock_ledger.exists() and
              not lock_packet.exists() and
              str(lock_root) not in blocked_run.stderr)

    existing_recovery_marker = run_acceptance_fixture(
        complete_zero_fetch,
        preexisting_recovery_marker=True,
    )
    recovery_marker_block_error = (
        "ERROR: unresolved monitor state recovery marker exists: "
        "state.json.recovery-pending. Resolve the prior failed state/output "
        "transaction before rerunning.\n"
    )
    check("existing recovery marker blocks before outputs or paid work",
          existing_recovery_marker["result"] == 1 and
          existing_recovery_marker["ledger"] is None and
          existing_recovery_marker["packet"] is None and
          state_unchanged(existing_recovery_marker) and
          existing_recovery_marker["searchCalls"] == 0 and
          existing_recovery_marker["classificationCalls"] == 0 and
          existing_recovery_marker["fetchLoadCalls"] == 0 and
          existing_recovery_marker["recoveryMarkerExists"] and
          existing_recovery_marker["recoveryMarkerMode"] == 0o600 and
          existing_recovery_marker["stderr"] == recovery_marker_block_error and
          existing_recovery_marker["root"] not in
          existing_recovery_marker["stderr"] and
          "Traceback" not in existing_recovery_marker["stderr"])

    marker_create_failure = run_acceptance_fixture(
        complete_zero_fetch,
        search_result=([], []),
        recovery_marker_create_failure=True,
    )
    marker_create_error = (
        "could not create state recovery marker state.json.recovery-pending: "
        "fixture marker create failure"
    )
    check("recovery marker creation failure preserves state and fails closed",
          marker_create_failure["result"] == 1 and
          state_unchanged(marker_create_failure) and
          not marker_create_failure["recoveryMarkerExists"] and
          marker_create_failure["ledger"]["metadata"]["acceptance"] == {
              "required": True,
              "passed": False,
              "errors": [marker_create_error],
          } and
          marker_create_failure["ledger"]["metadata"]["statePersistence"] == {
              "eligible": False,
              "blockers": [marker_create_error],
          } and
          marker_create_failure["stderr"] ==
          f"ERROR: {marker_create_error}\n" and
          marker_create_failure["root"] not in marker_create_failure["stderr"] and
          "Traceback" not in marker_create_failure["stderr"])

    final_output_fetch = json.loads(json.dumps(complete_zero_fetch))
    final_output_pbo = final_output_fetch["results"]["pbo_feed"]
    final_output_pbo["publications"].append({
        "title": "Synthetic final-output retry publication",
        "link": ("https://www.pbo-dpb.ca/en/publications/"
                 "RP-2627-999-S--final-output-retry-fixture"),
        "pubDate": "Sat, 29 Aug 2026 09:00:00 -0400",
    })
    final_output_pbo["count"] = len(final_output_pbo["publications"])

    final_packet_failure = run_acceptance_fixture(
        final_output_fetch,
        search_result=([], []),
        classify_effect=classify_successfully,
        packet_failure_write=2,
    )
    pending_state_error = "state persistence has not completed"
    check("final packet failure restores state and leaves a pending ledger",
          final_packet_failure["result"] == 1 and
          final_packet_failure["packetWriteCalls"] == 2 and
          final_packet_failure["ledger"]["counts"]["surfaced"] == 1 and
          final_packet_failure["ledger"]["metadata"]["acceptance"] == {
              "required": True,
              "passed": False,
              "errors": [pending_state_error],
          } and
          final_packet_failure["ledger"]["metadata"]["statePersistence"] == {
              "eligible": False,
              "blockers": [pending_state_error],
          } and
          "not accepted" in final_packet_failure["packet"].lower() and
          final_packet_failure["stateBytes"] ==
          final_packet_failure["initialStateBytes"] and
          final_packet_failure["stateMode"] ==
          final_packet_failure["initialStateMode"] and
          not final_packet_failure["recoveryMarkerExists"] and
          final_packet_failure["stderr"] ==
          "ERROR: could not write monitor artifacts: fixture packet write failure\n" and
          final_packet_failure["root"] not in final_packet_failure["stderr"] and
          "Traceback" not in final_packet_failure["stderr"])

    final_ledger_failure = run_acceptance_fixture(
        final_output_fetch,
        search_result=([], []),
        classify_effect=classify_successfully,
        ledger_failure_write=2,
    )
    check("final accepted-ledger failure restores exact prior state",
          final_ledger_failure["result"] == 1 and
          final_ledger_failure["ledgerWriteCalls"] == 2 and
          final_ledger_failure["stateBytes"] ==
          final_ledger_failure["initialStateBytes"] and
          final_ledger_failure["stateMode"] ==
          final_ledger_failure["initialStateMode"] and
          not final_ledger_failure["recoveryMarkerExists"] and
          final_ledger_failure["ledger"]["metadata"]["acceptance"]
          ["passed"] is False and
          final_ledger_failure["stderr"] ==
          "ERROR: could not write monitor artifacts: fixture ledger write failure\n")

    rollback_failure = run_acceptance_fixture(
        final_output_fetch,
        search_result=([], []),
        classify_effect=classify_successfully,
        packet_failure_write=2,
        rollback_failure=True,
        retry_after_failure=True,
    )
    check("rollback failure leaves a marker that blocks same-path retry",
          rollback_failure["result"] == 1 and
          rollback_failure["stateBytes"] !=
          rollback_failure["initialStateBytes"] and
          rollback_failure["recoveryMarkerExists"] and
          rollback_failure["recoveryMarkerMode"] == 0o600 and
          rollback_failure["stderr"] ==
          "ERROR: could not write monitor artifacts: fixture packet write failure\n"
          "ERROR: could not restore the pre-run state after artifact failure: "
          "fixture rollback failure\n" and
          rollback_failure["retryResult"] == 1 and
          rollback_failure["retryStdout"] == "" and
          rollback_failure["retryStderr"] == recovery_marker_block_error and
          rollback_failure["retrySearchCalls"] == 0 and
          rollback_failure["retryClassificationCalls"] == 0 and
          rollback_failure["root"] not in rollback_failure["stderr"] and
          rollback_failure["root"] not in rollback_failure["retryStderr"] and
          "Traceback" not in rollback_failure["stderr"])

    marker_clear_failure = run_acceptance_fixture(
        complete_zero_fetch,
        search_result=([], []),
        recovery_marker_clear_failure=True,
        retry_after_failure=True,
    )
    check("accepted-output marker cleanup failure blocks same-path retry",
          marker_clear_failure["result"] == 1 and
          marker_clear_failure["ledger"]["metadata"]["acceptance"]["passed"]
          is True and
          marker_clear_failure["stateBytes"] !=
          marker_clear_failure["initialStateBytes"] and
          marker_clear_failure["recoveryMarkerExists"] and
          marker_clear_failure["recoveryMarkerMode"] == 0o600 and
          marker_clear_failure["stderr"] ==
          "ERROR: could not clear state recovery marker after accepted output: "
          "fixture marker clear failure\n" and
          marker_clear_failure["retryResult"] == 1 and
          marker_clear_failure["retryStdout"] == "" and
          marker_clear_failure["retryStderr"] == recovery_marker_block_error and
          marker_clear_failure["retrySearchCalls"] == 0 and
          marker_clear_failure["retryClassificationCalls"] == 0 and
          marker_clear_failure["root"] not in marker_clear_failure["stderr"] and
          "Traceback" not in marker_clear_failure["stderr"])

    final_output_retry = run_acceptance_fixture(
        final_output_fetch,
        search_result=([], []),
        classify_effect=classify_successfully,
        initial_state=final_packet_failure["state"],
    )
    check("retry after final output failure resurfaces and persists evidence",
          final_output_retry["result"] == 0 and
          final_output_retry["ledger"]["counts"]["surfaced"] == 1 and
          final_output_retry["classificationCalls"] == 1 and
          final_output_retry["stateBytes"] !=
          final_output_retry["initialStateBytes"])

    absent_state_output_failure = run_acceptance_fixture(
        final_output_fetch,
        search_result=([], []),
        classify_effect=classify_successfully,
        packet_failure_write=2,
        omit_initial_state=True,
    )
    check("final output failure leaves an initially absent state absent",
          absent_state_output_failure["result"] == 1 and
          absent_state_output_failure["initialStateBytes"] is None and
          absent_state_output_failure["stateExists"] is False and
          absent_state_output_failure["stateBytes"] is None and
          not absent_state_output_failure["recoveryMarkerExists"])

    invalid_ethics_fetch = json.loads(json.dumps(complete_zero_fetch))
    invalid_ethics_fetch["results"]["ethics_reports_diff"] = {
        "status": "invalid_cache",
        "error": "existing Ethics reports cache has an invalid structure",
    }
    invalid_ethics_run = run_acceptance_fixture(invalid_ethics_fetch)
    check("invalid Ethics cache fails deterministic acceptance before paid work",
          invalid_ethics_run["result"] == 1 and
          state_unchanged(invalid_ethics_run) and
          invalid_ethics_run["searchCalls"] == 0 and
          invalid_ethics_run["classificationCalls"] == 0 and
          invalid_ethics_run["ledger"]["counts"]["surfaced"] == 0 and
          any("ethics_reports_diff returned invalid_cache" in error
              for error in invalid_ethics_run["ledger"]["metadata"]
              ["acceptance"]["errors"]))

    suspicious_ethics_fetch = json.loads(json.dumps(complete_zero_fetch))
    suspicious_ethics_fetch["results"]["ethics_reports_diff"] = {
        "status": "suspicious_removal",
        "error": "current Ethics report list omitted 1 report(s) from the accepted cache",
        "priorCount": 2,
        "currentCount": 1,
        "missingCount": 1,
    }
    suspicious_ethics_run = run_acceptance_fixture(suspicious_ethics_fetch)
    check("partial Ethics listing fails deterministic acceptance before paid work",
          suspicious_ethics_run["result"] == 1 and
          state_unchanged(suspicious_ethics_run) and
          suspicious_ethics_run["searchCalls"] == 0 and
          suspicious_ethics_run["classificationCalls"] == 0 and
          suspicious_ethics_run["ledger"]["counts"]["surfaced"] == 0 and
          any("ethics_reports_diff returned suspicious_removal" in error
              for error in suspicious_ethics_run["ledger"]["metadata"]
              ["acceptance"]["errors"]))

    malformed_ethics_fetch = json.loads(json.dumps(complete_zero_fetch))
    malformed_ethics_fetch["results"]["ethics_reports_page"] = {
        "status": "malformed_data",
        "error": "no Ethics report links found",
        "url": fetch_data.ETHICS_REPORTS_URL,
    }
    malformed_ethics_fetch["results"]["ethics_reports_diff"] = {
        "status": "malformed_data",
    }
    malformed_ethics_run = run_acceptance_fixture(malformed_ethics_fetch)
    check("malformed Ethics listing fails acceptance before paid work or state",
          malformed_ethics_run["result"] == 1 and
          state_unchanged(malformed_ethics_run) and
          malformed_ethics_run["searchCalls"] == 0 and
          malformed_ethics_run["classificationCalls"] == 0 and
          malformed_ethics_run["ledger"]["counts"]["surfaced"] == 0 and
          any("ethics_reports_page returned malformed_data" in error
              for error in malformed_ethics_run["ledger"]["metadata"]
              ["acceptance"]["errors"]))

    blocked_fetch = complete_fetch_payload(coverage=deterministic_coverage)
    blocked_fetch["results"]["pbo_feed"] = {"status": "http_403"}
    blocked_fetch["results"]["mpo_page"] = {"status": "blocked"}
    del blocked_fetch["results"]["mpo_diff"]
    blocked_run = run_acceptance_fixture(blocked_fetch, search_result=([], []))
    check("non-Ethics blocked deterministic surfaces remain structurally complete",
          blocked_run["result"] == 0 and
          blocked_run["ledger"]["tiers"]["deterministic"].startswith("run (") and
          blocked_run["ledger"]["counts"]["accessFailures"] == 1)

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
    check("incomplete deterministic input skips extraction without suppressing retry",
          failed_retry["result"] == 1 and
          failed_retry["ledger"]["counts"]["surfaced"] == 0 and
          failed_retry["ledger"]["counts"]["suppressed"] == 0 and
          state_unchanged(failed_retry) and
          failed_retry["searchCalls"] == 0 and
          failed_retry["classificationCalls"] == 0 and
          successful_retry["result"] == 0 and
          successful_retry["ledger"]["counts"]["surfaced"] > 0)
    check("successful deterministic retry advances state only once accepted",
          state_unchanged(failed_retry) and
          successful_retry["stateBytes"] != successful_retry["initialStateBytes"] and
          successful_retry["state"].get("lastRun") is not None and
          successful_retry["state"]["sentinel"] ==
          failed_retry["initialState"]["sentinel"])

    dry_failure = run_acceptance_fixture(
        empty_fetch, api_keys=False, extra_args=["--dry-run"])
    check("strict dry-run still rejects incomplete deterministic input",
          dry_failure["result"] == 1 and dry_failure["searchCalls"] == 0 and
          dry_failure["classificationCalls"] == 0)
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
          incomplete_without_key_gate == [
              "Search fan-out required but did not complete: "
              "skipped (TAVILY_API_KEY not set)"
          ])

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
              state_unchanged(invalid_run))

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

    def validate_surface_threshold(value):
        env = {
            "BACKTEST_LABEL": "threshold-contract",
            "WINDOW_START": "2026-08-01",
            "WINDOW_END": "2026-08-31",
            "REGISTRY_REF": "0" * 40,
            "SEEN_LEDGER_PATH": "",
            "SURFACE_THRESHOLD": value,
        }
        output = io.StringIO()
        with patch.dict(os.environ, env, clear=True), redirect_stdout(output):
            result = monitor_inputs.main()
        return result, output.getvalue()

    accepted_thresholds = ("0", "0.08", "0.5", "1", "1e-3")
    check("surface threshold accepts finite values from 0 through 1",
          all(validate_surface_threshold(value) == (0, "")
              for value in accepted_thresholds))

    threshold_error = (
        "::error::surface_threshold must be a finite number from 0 through 1\n")

    def threshold_is_rejected(value):
        return validate_surface_threshold(value) == (1, threshold_error)

    check("surface threshold rejects an empty value",
          threshold_is_rejected(""))
    check("surface threshold rejects nan",
          threshold_is_rejected("nan"))
    check("surface threshold rejects positive infinity",
          threshold_is_rejected("inf"))
    check("surface threshold rejects negative infinity",
          threshold_is_rejected("-inf"))
    check("surface threshold rejects nonnumeric text",
          threshold_is_rejected("not-a-number"))
    check("surface threshold rejects values below zero",
          threshold_is_rejected("-0.0001"))
    check("surface threshold rejects values above one",
          threshold_is_rejected("1.0001"))

    def workflow_section(text, start, end=None):
        if start not in text:
            return ""
        section = text.split(start, 1)[1]
        if end is not None:
            return section.split(end, 1)[0] if end in section else ""
        return section

    workflow = WORKFLOW_PATH.read_text()
    analysis_job_marker = "\n  source-analysis:"
    publish_job_marker = "\n  publish-review:"
    determine_cycle_marker = "- name: Determine cycle month"
    validate_backtest_marker = "- name: Validate backtest inputs"
    privacy_preflight_marker = "- name: Preflight private identity patterns"
    install_dependencies_marker = "- name: Install dependencies"
    prepare_branch_marker = "- name: Prepare review branch"
    fetch_marker = "- name: Run source fetch and link-rot scan"
    live_marker = "- name: Run source monitor (deterministic + search fan-out + relevance pass)"
    generate_ledger_marker = "- name: Generate source ledger"
    validate_ledger_marker = "- name: Validate source ledger coverage"
    registry_marker = "- name: Reconstruct backtest source registry"
    backtest_marker = "- name: Run source monitor backtest"
    guard_marker = "- name: Guard current upload artifacts"
    live_artifact_marker = "- name: Upload live source-scout artifacts"
    backtest_artifact_marker = "- name: Upload backtest source-scout artifacts"
    download_marker = "- name: Download guarded live source-scout artifact"
    publish_guard_marker = "- name: Stage and guard live publish payload"
    pr_marker = "- name: Open or update the review PR"

    checkout_pin = "d23441a48e516b6c34aea4fa41551a30e30af803"
    setup_node_pin = "249970729cb0ef3589644e2896645e5dc5ba9c38"
    setup_python_pin = "ece7cb06caefa5fff74198d8649806c4678c61a1"
    upload_pin = "043fb46d1a93c77aae656e7c1c64a875d1fc6a0a"
    download_pin = "3e5f45b2cfb9172054b4087a40e8e0b5a5461e7c"
    scanner_pin = "80e7ec01716367e1469135ce038f349a777c83c2d7bbdb17e1bd9a1b8767bcf1"

    def workflow_condition(section):
        conditions = [
            line.strip()[3:].strip()
            for line in section.splitlines()
            if line.strip().startswith("if:")
        ]
        return conditions[0] if len(conditions) == 1 else None

    def first_run_command(section):
        lines = section.splitlines()
        for index, line in enumerate(lines):
            if line.strip() != "run: |":
                continue
            for command in lines[index + 1:]:
                if command.strip():
                    return command.strip()
        return None

    def upload_paths(section):
        lines = section.splitlines()
        for index, line in enumerate(lines):
            if line.strip() != "path: |":
                continue
            parent_indent = len(line) - len(line.lstrip())
            paths = []
            for candidate in lines[index + 1:]:
                if not candidate.strip():
                    break
                indent = len(candidate) - len(candidate.lstrip())
                if indent <= parent_indent:
                    break
                paths.append(candidate.strip())
            return tuple(paths)
        return ()

    live_artifact_paths = (
        "scripts/output/fetch-report.txt",
        "scripts/output/fetch-results.json",
        "scripts/output/draft-changelog-entry.json",
        "scripts/output/draft-dimensions.json",
        "docs/Source-Coverage-Ledger-${{ env.CYCLE_MONTH }}.md",
        "docs/Source-Monitoring-Candidates-${{ env.CYCLE_MONTH }}.md",
        "monitoring/candidates/${{ env.CYCLE_MONTH }}.json",
        "monitoring/ethics-reports.json",
        "monitoring/state.json",
    )
    backtest_artifact_paths = (
        "docs/Source-Monitoring-Backtest-${{ env.CYCLE_MONTH }}.md",
        "monitoring/backtest/${{ env.CYCLE_MONTH }}.json",
        "monitoring/backtest/state-${{ env.CYCLE_MONTH }}.json",
        "monitoring/backtest/sources-${{ env.CYCLE_MONTH }}.json",
    )
    live_guard_paths = (
        "scripts/output/fetch-report.txt",
        "scripts/output/fetch-results.json",
        "scripts/output/draft-changelog-entry.json",
        "scripts/output/draft-dimensions.json",
        '"docs/Source-Coverage-Ledger-$cycle_month.md"',
        '"docs/Source-Monitoring-Candidates-$cycle_month.md"',
        '"monitoring/candidates/$cycle_month.json"',
        "monitoring/ethics-reports.json",
        "monitoring/state.json",
    )
    backtest_guard_paths = (
        '"docs/Source-Monitoring-Backtest-$cycle_month.md"',
        '"monitoring/backtest/$cycle_month.json"',
        '"monitoring/backtest/state-$cycle_month.json"',
        '"monitoring/backtest/sources-$cycle_month.json"',
    )
    publish_paths = (
        "monitoring/state.json",
        "monitoring/ethics-reports.json",
        '"monitoring/candidates/$CYCLE_MONTH.json"',
        '"docs/Source-Coverage-Ledger-$CYCLE_MONTH.md"',
        '"docs/Source-Monitoring-Candidates-$CYCLE_MONTH.md"',
    )

    def workflow_contract_errors(text):
        errors = []
        concurrency_contract = (
            "concurrency:\n",
            "group: monthly-source-scout-${{ inputs.label || 'live' }}",
            "cancel-in-progress: false",
        )
        if not all(value in text for value in concurrency_contract):
            errors.append("live review-branch runs are not serialized")
        markers = (
            analysis_job_marker, publish_job_marker,
            privacy_preflight_marker, install_dependencies_marker,
            determine_cycle_marker,
            validate_backtest_marker,
            prepare_branch_marker, fetch_marker, generate_ledger_marker,
            validate_ledger_marker, live_marker, registry_marker,
            backtest_marker, guard_marker, live_artifact_marker,
            backtest_artifact_marker, download_marker, publish_guard_marker,
            pr_marker,
        )
        if any(marker not in text for marker in markers):
            return ["required workflow step marker is missing"]

        analysis_job = workflow_section(
            text, analysis_job_marker, publish_job_marker)
        publish_job = workflow_section(text, publish_job_marker)
        determine_cycle = workflow_section(
            analysis_job, determine_cycle_marker, validate_backtest_marker)
        privacy_preflight = workflow_section(
            analysis_job, privacy_preflight_marker, install_dependencies_marker)
        validate_backtest = workflow_section(
            analysis_job, validate_backtest_marker, prepare_branch_marker)
        prepare = workflow_section(
            analysis_job, prepare_branch_marker, fetch_marker)
        fetch = workflow_section(
            analysis_job, fetch_marker, generate_ledger_marker)
        generate_ledger = workflow_section(
            analysis_job, generate_ledger_marker, validate_ledger_marker)
        validate_ledger = workflow_section(
            analysis_job, validate_ledger_marker, live_marker)
        live = workflow_section(analysis_job, live_marker, registry_marker)
        registry = workflow_section(
            analysis_job, registry_marker, backtest_marker)
        backtest = workflow_section(
            analysis_job, backtest_marker, guard_marker)
        guard = workflow_section(
            analysis_job, guard_marker, live_artifact_marker)
        live_artifact = workflow_section(
            analysis_job, live_artifact_marker, backtest_artifact_marker)
        backtest_artifact = workflow_section(
            analysis_job, backtest_artifact_marker)
        download = workflow_section(
            publish_job, download_marker, publish_guard_marker)
        publish_guard = workflow_section(
            publish_job, publish_guard_marker, pr_marker)
        pr = workflow_section(publish_job, pr_marker)

        analysis_header = analysis_job.split("\n    steps:", 1)[0]
        publish_header = publish_job.split("\n    steps:", 1)[0]
        analysis_permissions = (
            "    if: github.ref == 'refs/heads/main'",
            "    permissions:\n      contents: read\n      pull-requests: read",
        )
        if ("permissions: {}" not in text or
                not all(value in analysis_header
                        for value in analysis_permissions) or
                "contents: write" in analysis_header or
                "pull-requests: write" in analysis_header):
            errors.append("source analysis is not main-only and read-only")
        publish_condition = (
            "needs: source-analysis\n"
            "    if: needs.source-analysis.result == 'success' && "
            "needs.source-analysis.outputs.backtest_mode == 'false' && "
            "github.ref == 'refs/heads/main'"
        )
        if (publish_condition not in publish_header or
                "contents: write" not in publish_header or
                "pull-requests: write" not in publish_header):
            errors.append("publish review is not gated on successful live analysis")

        privacy_preflight_contract = (
            "PRIVATE_IDENTITY_PATTERNS: ${{ secrets.PRIVACY_IDENTITY_PATTERNS }}",
            "cleanup_identity_patterns() {",
            "trap cleanup_identity_patterns EXIT HUP INT TERM",
            'if [ -z "$PRIVATE_IDENTITY_PATTERNS" ]; then',
            "PRIVACY_IDENTITY_PATTERNS is required",
            "umask 077",
            "printf '%s\\n' \"$PRIVATE_IDENTITY_PATTERNS\" > .identity-patterns",
            '[ -L .identity-patterns ] || [ ! -f .identity-patterns ] || [ "$(stat -c \'%a\' .identity-patterns)" != "600" ]',
            f'approved_scanner_sha256="{scanner_pin}"',
            "actual_scanner_sha256=$(sha256sum scripts/privacy_scan.py | awk '{print $1}')",
            'if [ "$actual_scanner_sha256" != "$approved_scanner_sha256" ]; then',
            "python3 scripts/privacy_scan.py files \\",
            "--root . \\",
            "--require-identity-patterns \\",
            "scripts/privacy_scan.py",
        )
        privacy_check = text.find(privacy_preflight_marker)
        protected_steps = (
            text.find(fetch_marker), text.find(live_marker),
            text.find(backtest_marker),
        )
        if (not all(value in privacy_preflight
                    for value in privacy_preflight_contract) or
                first_run_command(privacy_preflight) != "set -euo pipefail" or
                privacy_preflight.count("cleanup_identity_patterns") < 3 or
                privacy_check < 0 or
                any(position < 0 or privacy_check > position
                    for position in protected_steps)):
            errors.append(
                "private identity secret is not validated before fetch and paid tiers")
        if workflow_condition(privacy_preflight) is not None:
            errors.append("private identity preflight can be skipped")

        dynamic_path_names = ("ETHICS_PRIOR_CACHE", "CARRY_FORWARD_LEDGER")
        if any(f"{name}:" in analysis_header for name in dynamic_path_names):
            errors.append("dynamic path has a redundant job-level declaration")
        dynamic_path_contract = (
            ('echo "ETHICS_PRIOR_CACHE=$ETHICS_PRIOR_CACHE" >> "$GITHUB_ENV"',
             fetch),
            ('ethics_prior_cache="${ETHICS_PRIOR_CACHE:-}"', live),
            ('--ethics-prior-cache "$ethics_prior_cache"', live),
            ('echo "CARRY_FORWARD_LEDGER=$CARRY_FORWARD_INPUT" >> "$GITHUB_ENV"',
             prepare),
            ('carry_forward_ledger="${CARRY_FORWARD_LEDGER:-}"', live),
            ('args+=(--carry-forward-ledger "$carry_forward_ledger")', live),
        )
        if any(value not in section
               for value, section in dynamic_path_contract):
            errors.append("dynamic paths are not written and consumed by later steps")

        action_refs = re.findall(
            r"uses:\s+actions/[^@\s]+@([^\s#]+)", text)
        expected_action_refs = (
            checkout_pin, setup_node_pin, setup_python_pin, upload_pin,
            upload_pin, checkout_pin, download_pin,
        )
        if (tuple(action_refs) != expected_action_refs or
                any(not re.fullmatch(r"[0-9a-f]{40}", ref)
                    for ref in action_refs)):
            errors.append("workflow actions are not pinned to exact SHAs")
        checkout_contract = (
            f"actions/checkout@{checkout_pin}",
            "persist-credentials: false",
            "ref: ${{ github.sha }}",
        )
        if (any(analysis_job.count(value) != 1
                for value in checkout_contract) or
                any(publish_job.count(value) != 1
                    for value in checkout_contract) or
                f"actions/setup-node@{setup_node_pin}" not in analysis_job or
                f"actions/setup-python@{setup_python_pin}" not in analysis_job):
            errors.append("checkout and setup actions do not use the reviewed SHA")

        label_guard = '[[ ! "$BACKTEST_LABEL" =~ ^[a-z0-9-]+$ ]]'
        label_assignment = 'cycle_month="$BACKTEST_LABEL"'
        artifact_assignment = (
            'artifact_name="monthly-source-scout-$cycle_month-'
            '$GITHUB_RUN_ID-$GITHUB_RUN_ATTEMPT"')
        if (first_run_command(determine_cycle) != "set -euo pipefail" or
                label_guard not in determine_cycle or
                determine_cycle.find(label_guard) >
                determine_cycle.find(label_assignment) or
                determine_cycle.find(label_assignment) >
                determine_cycle.find(artifact_assignment) or
                "label must match ^[a-z0-9-]+$" not in determine_cycle or
                "exit 1" not in determine_cycle):
            errors.append("backtest label is not validated before artifact path export")

        prepare_contract = (
            'LEDGER="docs/Source-Coverage-Ledger-$CYCLE_MONTH.md"',
            'CANDIDATE_LEDGER="monitoring/candidates/$CYCLE_MONTH.json"',
            'CANDIDATE_PACKET="docs/Source-Monitoring-Candidates-$CYCLE_MONTH.md"',
            'CARRY_FORWARD_INPUT="$RUNNER_TEMP/carry-forward-$CYCLE_MONTH.json"',
            "for REQUIRED_FILE in \\",
            "monitoring/state.json \\",
            "monitoring/ethics-reports.json \\",
            '"$LEDGER" \\',
            '"$CANDIDATE_LEDGER"',
            'if ! git cat-file -e "$observed_branch_sha:$REQUIRED_FILE" 2>/dev/null; then',
            "Existing review branch is missing required continuity file",
            "exit 1",
            'git show "$observed_branch_sha:$CANDIDATE_LEDGER" > "$CARRY_FORWARD_INPUT"',
            'for RESTORE_FILE in monitoring/state.json monitoring/ethics-reports.json "$LEDGER"',
            'git checkout "$observed_branch_sha" -- "$RESTORE_FILE"',
            '"passed": False',
            '"eligible": False',
            '**NOT ACCEPTED.**',
            'echo "CARRY_FORWARD_LEDGER=$CARRY_FORWARD_INPUT" >> "$GITHUB_ENV"',
            'git fetch origin "refs/heads/$BRANCH:refs/remotes/origin/$BRANCH"',
            "if ! pr_details=$(review_pr_details)",
            'if [ "$open_pr_count" -eq 1 ]; then',
            'elif [ "$open_pr_count" -eq 0 ]; then',
            "Starting clean from main.",
            "has more than one open same-repository PR against main",
            "is no longer a draft",
        )
        if not all(line in prepare for line in prepare_contract):
            errors.append("continuity files are not restored independently and fail closed")

        same_repo_pr_contract = (
            "review_pr_details() {",
            'gh pr list \\',
            '--repo "$GITHUB_REPOSITORY"',
            "--base main",
            "--state open",
            "--limit 1000",
            "--json number,isDraft,headRefName,headRepository,isCrossRepository",
            ".headRefName == env.BRANCH",
            ".headRepository.nameWithOwner == env.GITHUB_REPOSITORY",
            ".isCrossRepository == false",
        )
        pr_lookup_end = pr.find("\n          assert_expected_pr_state() {")
        pr_lookup = pr[:pr_lookup_end] if pr_lookup_end >= 0 else ""
        if (any(prepare.count(line) != 1 for line in same_repo_pr_contract) or
                any(pr_lookup.count(line) != 1
                    for line in same_repo_pr_contract)):
            errors.append("open review PR lookup is not restricted to the same repository")

        pr_creation_contract = (
            '--repo "$GITHUB_REPOSITORY"',
            '--head "$GITHUB_REPOSITORY_OWNER:$BRANCH"',
        )
        if not all(line in pr for line in pr_creation_contract):
            errors.append("review PR creation is not restricted to the same repository")

        orphan_start = prepare.find('elif [ "$open_pr_count" -eq 0 ]; then')
        orphan_checkout = prepare.find(
            'git checkout -B "$BRANCH" "$GITHUB_SHA"', orphan_start)
        orphan_pending = prepare.find("write_pending_artifacts", orphan_checkout)
        branch_absent = prepare.find('elif [ "$branch_status" -eq 2 ]; then')
        if (orphan_start < 0 or orphan_checkout < 0 or orphan_pending < 0 or
                branch_absent < 0 or
                not orphan_start < orphan_checkout < orphan_pending < branch_absent):
            errors.append("orphan review branch does not restart cleanly")

        if workflow_condition(prepare) != "env.BACKTEST_LABEL == ''":
            errors.append("review branch preparation is not live-only")
        first_placeholder = prepare.find("\n          write_pending_artifacts\n")
        first_network = prepare.find("git ls-remote --exit-code --heads origin")
        outer_checkout_with_placeholder = (
            'git checkout -B "$BRANCH" "$GITHUB_SHA"\n'
            '            write_pending_artifacts'
        )
        nested_checkout_with_placeholder = (
            'git checkout -B "$BRANCH" "$GITHUB_SHA"\n'
            '              write_pending_artifacts'
        )
        if (first_placeholder < 0 or first_network < 0 or
                first_placeholder > first_network or
                prepare.count(outer_checkout_with_placeholder) != 1 or
                prepare.count(nested_checkout_with_placeholder) != 2):
            errors.append("pending artifacts are not established before network and after checkout")

        branch_status_contract = (
            'git ls-remote --exit-code --heads origin "$BRANCH"',
            "branch_status=$?",
            'if [ "$branch_status" -eq 0 ]; then',
            'elif [ "$branch_status" -eq 2 ]; then',
            "Could not determine whether review branch",
            'exit "$branch_status"',
        )
        branch_lookup = prepare.find(
            'git ls-remote --exit-code --heads origin "$BRANCH"')
        branch_status_capture = prepare.find("branch_status=$?", branch_lookup)
        branch_strict_restore = prepare.find("set -e", branch_status_capture)
        branch_dispatch = prepare.find(
            'if [ "$branch_status" -eq 0 ]; then', branch_strict_restore)
        branch_relaxed = prepare.rfind("set +e", 0, branch_lookup)
        if (not all(line in prepare for line in branch_status_contract) or
                prepare.count("set +e") != 1 or
                not 0 <= branch_relaxed < branch_lookup < branch_status_capture <
                branch_strict_restore < branch_dispatch or
                'if git ls-remote --exit-code --heads origin "$BRANCH"' in prepare):
            errors.append("review branch lookup does not distinguish absence from failure")

        rerun_start = prepare.find('if [ "$branch_status" -eq 0 ]; then')
        rerun_else = prepare.find('elif [ "$branch_status" -eq 2 ]; then')
        carry_export = prepare.find(
            'echo "CARRY_FORWARD_LEDGER=$CARRY_FORWARD_INPUT"', rerun_start)
        if (rerun_start < 0 or rerun_else < 0 or
                not rerun_start < carry_export < rerun_else):
            errors.append("carry-forward ledger is not enabled only for reruns")

        ethics_snapshot_contract = (
            'ETHICS_PRIOR_CACHE="$RUNNER_TEMP/ethics-prior-$CYCLE_MONTH.json"',
            'if [ ! -f monitoring/ethics-reports.json ]; then',
            'if [ -L monitoring/ethics-reports.json ]; then',
            'cp monitoring/ethics-reports.json "$ETHICS_PRIOR_CACHE"',
            'echo "ETHICS_PRIOR_CACHE=$ETHICS_PRIOR_CACHE" >> "$GITHUB_ENV"',
            'python3 scripts/fetch-data.py --link-rot --json-out '
            'scripts/output/fetch-results.json',
        )
        ethics_copy = fetch.find(
            'cp monitoring/ethics-reports.json "$ETHICS_PRIOR_CACHE"')
        fetch_run = fetch.find(
            'python3 scripts/fetch-data.py --link-rot --json-out '
            'scripts/output/fetch-results.json')
        if (not all(line in fetch for line in ethics_snapshot_contract) or
                first_run_command(fetch) != "set -euo pipefail" or
                not 0 <= ethics_copy < fetch_run):
            errors.append("accepted Ethics cache is not snapshotted before fetch")

        candidate_restore = any(
            ("git checkout" in line or "git restore" in line) and
            ("$CANDIDATE_LEDGER" in line or "monitoring/candidates/" in line)
            for line in prepare.splitlines()
        )
        restore_loop_start = prepare.find("for RESTORE_FILE in")
        restore_loop_end = prepare.find("\n              done", restore_loop_start)
        restore_loop = (
            prepare[restore_loop_start:restore_loop_end]
            if restore_loop_start >= 0 and restore_loop_end >= 0 else ""
        )
        candidate_show = (
            'git show "$observed_branch_sha:$CANDIDATE_LEDGER" > '
            '"$CARRY_FORWARD_INPUT"'
        )
        if (candidate_restore or "$CANDIDATE_LEDGER" in restore_loop or
                "monitoring/candidates/" in restore_loop or
                prepare.count(candidate_show) != 1 or
                prepare.count("$CANDIDATE_LEDGER") != 3):
            errors.append("candidate ledger is not isolated as temporary carry-forward input")

        live_carry_contract = (
            'carry_forward_ledger="${CARRY_FORWARD_LEDGER:-}"',
            'if [ -n "$carry_forward_ledger" ]; then',
            'args+=(--carry-forward-ledger "$carry_forward_ledger")',
        )
        if (not all(line in live for line in live_carry_contract) or
                live.count("--carry-forward-ledger") != 1 or
                "--carry-forward-ledger" in backtest):
            errors.append("live carry-forward argument is not rerun-only")
        ethics_consumer_contract = (
            'ethics_prior_cache="${ETHICS_PRIOR_CACHE:-}"',
            'if [ -z "$ethics_prior_cache" ]; then',
            '--ethics-prior-cache "$ethics_prior_cache"',
        )
        if (not all(line in live for line in ethics_consumer_contract) or
                live.count('--ethics-prior-cache "$ethics_prior_cache"') != 1 or
                "--ethics-prior-cache" in backtest):
            errors.append("live monitor is not bound to the accepted Ethics cache snapshot")
        live_output_contract = (
            '--ledger-path "monitoring/candidates/$CYCLE_MONTH.json"',
            '--packet-path "docs/Source-Monitoring-Candidates-$CYCLE_MONTH.md"',
        )
        if (any(live.count(line) != 1 for line in live_output_contract) or
                live.count("--ledger-path") != 1 or
                live.count("--packet-path") != 1):
            errors.append("live monitor output paths are not explicit and canonical")
        if "--fetch-results" in backtest:
            errors.append("historical backtest reads deterministic fetch input")

        critical_sections = {
            "privacy preflight": privacy_preflight,
            "cycle determination": determine_cycle,
            "backtest validation": validate_backtest,
            "branch preparation": prepare,
            "source fetch": fetch,
            "source ledger generation": generate_ledger,
            "source ledger validation": validate_ledger,
            "live monitor": live,
            "registry reconstruction": registry,
            "backtest monitor": backtest,
            "local-path guard": guard,
            "live artifact upload": live_artifact,
            "backtest artifact upload": backtest_artifact,
            "publish artifact download": download,
            "publish payload guard": publish_guard,
            "review PR": pr,
        }
        if any("continue-on-error:" in section
               for section in critical_sections.values()):
            errors.append("a critical workflow step may ignore failures")
        if any(" || true" in section or " || :" in section
               for section in critical_sections.values()):
            errors.append("a critical workflow command may suppress failure")
        no_relaxed_errexit = (
            privacy_preflight, determine_cycle, validate_backtest, fetch,
            generate_ledger,
            validate_ledger, live, registry, backtest, guard, live_artifact,
            backtest_artifact, download, publish_guard, pr,
        )
        if any("set +e" in section or "set +o errexit" in section
               for section in no_relaxed_errexit):
            errors.append("a critical workflow command disables fail-fast mode")

        expected_live_condition = (
            "always() && steps.privacy-guard.outcome == 'success' && "
            "env.BACKTEST_LABEL == ''"
        )
        expected_backtest_condition = (
            "always() && steps.privacy-guard.outcome == 'success' && "
            "env.BACKTEST_LABEL != ''"
        )
        if workflow_condition(guard) != "always()" or "id: privacy-guard" not in guard:
            errors.append("privacy guard is not an always-run named gate")
        if workflow_condition(live_artifact) != expected_live_condition:
            errors.append("live artifact upload is not gated by the privacy result")
        if workflow_condition(backtest_artifact) != expected_backtest_condition:
            errors.append("backtest artifact upload is not gated by the privacy result")

        marker_positions = [text.find(marker) for marker in (
            backtest_marker, guard_marker, live_artifact_marker,
            backtest_artifact_marker, pr_marker,
        )]
        if marker_positions != sorted(marker_positions):
            errors.append("privacy guard and artifact upload steps are out of order")

        actual_live_paths = upload_paths(live_artifact)
        actual_backtest_paths = upload_paths(backtest_artifact)
        if (actual_live_paths != live_artifact_paths or
                actual_backtest_paths != backtest_artifact_paths):
            errors.append("diagnostic artifact paths are not the exact upload sets")
        if (any(path in live_artifact for path in backtest_artifact_paths) or
                any(path in backtest_artifact for path in live_artifact_paths)):
            errors.append("live and backtest artifact scopes are not isolated")
        artifact_name_contract = (
            artifact_assignment,
            "name: ${{ steps.cycle.outputs.artifact_name }}",
            "if-no-files-found: error",
        )
        if (artifact_assignment not in determine_cycle or
                any(live_artifact.count(value) != 1
                    for value in artifact_name_contract[1:]) or
                any(backtest_artifact.count(value) != 1
                    for value in artifact_name_contract[1:]) or
                "monitoring/ethics-reports.json" not in live_artifact):
            errors.append("live artifact is not complete and run-unique")

        if first_run_command(guard) != "set -euo pipefail":
            errors.append("local-path guard does not start in strict shell mode")

        artifact_scan_contract = (
            "python3 scripts/privacy_scan.py files \\",
            "--root . \\",
            "--require-identity-patterns \\",
            '"${FILES[@]}"',
        )
        if not all(value in guard for value in artifact_scan_contract):
            errors.append("local-path guard does not use the shared privacy scanner")
        artifact_arrays = tuple(
            tuple(
                line.strip()
                for line in block.splitlines()
                if line.strip()
            )
            for block in re.findall(
                r"ARTIFACT_FILES=\(\n(.*?)\n\s+\)", guard, re.DOTALL)
        )
        mode_selector = guard.find('if [ -z "$BACKTEST_LABEL" ]; then')
        live_array = guard.find("ARTIFACT_FILES=(")
        mode_else = guard.find("\n          else", live_array)
        backtest_array = guard.find("ARTIFACT_FILES=(", live_array + 1)
        payload_loop = guard.find('for FILE in "${ARTIFACT_FILES[@]}"')
        payload_loop_end = guard.find("\n          done", payload_loop)
        artifact_type_contract = (
            "PRIOR_STEPS_STATUS: ${{ job.status }}",
            'if [ -L "$FILE" ]; then',
            "Current upload artifact is a symbolic link",
            'elif [ -f "$FILE" ]; then',
            'FILES+=("$FILE")',
            'elif [ -e "$FILE" ]; then',
            "Current upload artifact is not a regular file",
            'elif [ "$PRIOR_STEPS_STATUS" = "success" ]; then',
            "Required current upload artifact is missing",
        )
        type_positions = tuple(guard.find(value, payload_loop)
                               for value in artifact_type_contract[1:])
        if (artifact_arrays != (live_guard_paths, backtest_guard_paths) or
                not 0 <= mode_selector < live_array < mode_else <
                backtest_array < payload_loop or
                not all(value in guard for value in artifact_type_contract) or
                not all(position >= 0 for position in type_positions) or
                type_positions != tuple(sorted(type_positions)) or
                not type_positions[-1] < payload_loop_end or
                guard.count("PRIOR_STEPS_STATUS") != 2 or
                guard.count('for FILE in "${ARTIFACT_FILES[@]}"') != 1 or
                "find monitoring" in guard):
            errors.append(
                "privacy guard does not scan the exact current-run artifact payload")

        scanner_hash_contract = (
            f'approved_scanner_sha256="{scanner_pin}"',
            "actual_scanner_sha256=$(sha256sum scripts/privacy_scan.py | awk '{print $1}')",
            'if [ "$actual_scanner_sha256" != "$approved_scanner_sha256" ]; then',
        )
        if (any(text.count(value) != 3 for value in scanner_hash_contract) or
                "--require-identity-patterns" not in privacy_preflight or
                "--require-identity-patterns" not in guard or
                "--require-identity-patterns" not in publish_guard):
            errors.append("hosted scanner is not hash-pinned with private identity rules")
        private_identity_contract = (
            "PRIVATE_IDENTITY_PATTERNS: ${{ secrets.PRIVACY_IDENTITY_PATTERNS }}",
            'if [ -z "$PRIVATE_IDENTITY_PATTERNS" ]; then',
            "PRIVACY_IDENTITY_PATTERNS is required",
            "printf '%s\\n' \"$PRIVATE_IDENTITY_PATTERNS\" > .identity-patterns",
        )
        if (any(privacy_preflight.count(value) != 1
                for value in private_identity_contract) or
                any(guard.count(value) != 1
                for value in private_identity_contract) or
                any(publish_guard.count(value) != 1
                    for value in private_identity_contract) or
                privacy_preflight.count("cleanup_identity_patterns") < 3 or
                guard.count("cleanup_identity_patterns") < 3 or
                publish_guard.count("cleanup_identity_patterns") < 3):
            errors.append("hosted privacy checks lack required private identity rules")
        if (workflow_condition(pr) !=
                "steps.publish-guard.outputs.has_changes == 'true'"):
            errors.append("review PR condition is not guarded by the publish payload")
        required_files_block = (
            "REQUIRED_FILES=(\n"
            "            monitoring/state.json\n"
            "            monitoring/ethics-reports.json\n"
            "            \"monitoring/candidates/$CYCLE_MONTH.json\"\n"
            "            \"docs/Source-Coverage-Ledger-$CYCLE_MONTH.md\"\n"
            "            \"docs/Source-Monitoring-Candidates-$CYCLE_MONTH.md\"\n"
            "          )"
        )
        if (required_files_block not in publish_guard or
                any(publish_guard.count(path) != 1 for path in publish_paths) or
                'git add -- "${REQUIRED_FILES[@]}"' not in publish_guard):
            errors.append("publish payload is not the fixed five-file set")
        staged_safety_contract = (
            "git diff --cached --check",
            "python3 scripts/privacy_scan.py staged --root . --require-identity-patterns",
        )
        staged_scan = publish_guard.find(staged_safety_contract[1])
        staged_cleanup = publish_guard.find(
            "cleanup_identity_patterns", staged_scan)
        staged_check = publish_guard.find(
            staged_safety_contract[0], staged_cleanup)
        has_changes = publish_guard.find(
            'echo "has_changes=true"', staged_check)
        if (not all(line in publish_guard for line in staged_safety_contract) or
                not 0 <= staged_scan < staged_cleanup < staged_check < has_changes or
                ".identity-patterns" in pr):
            errors.append("review PR does not run staged safety checks before commit")

        publish_checkout_contract = (
            f"actions/checkout@{checkout_pin}",
            "fetch-depth: 1",
            "persist-credentials: false",
            "ref: ${{ github.sha }}",
            'if [ "$(git rev-parse HEAD)" != "$GITHUB_SHA" ]; then',
        )
        download_contract = (
            f"actions/download-artifact@{download_pin}",
            "name: ${{ needs.source-analysis.outputs.artifact_name }}",
            "path: .",
        )
        if (not all(value in publish_job
                    for value in publish_checkout_contract) or
                not all(value in download for value in download_contract)):
            errors.append("publish handoff is not pinned to the analyzed SHA and artifact")

        lease_contract = (
            'lease="--force-with-lease=refs/heads/$BRANCH:$OBSERVED_BRANCH_SHA"',
            'lease="--force-with-lease=refs/heads/$BRANCH:"',
            'git push "$lease" -u origin "HEAD:refs/heads/$BRANCH"',
        )
        if not all(value in pr for value in lease_contract):
            errors.append("publish push does not use the observed or expected-absent lease")
        expected_pr_calls = [
            match.start() for match in re.finditer(
                r"\n          assert_expected_pr_state\n", pr)
        ]
        commit_position = pr.find("git commit -m")
        auth_position = pr.find("gh auth setup-git", commit_position)
        push_position = pr.find('git push "$lease"', auth_position)
        if (len(expected_pr_calls) != 2 or
                not expected_pr_calls[0] < commit_position <
                expected_pr_calls[1] < auth_position < push_position or
                "isDraft" not in pr or "is no longer a draft" not in pr):
            errors.append("draft PR state is not checked before commit and push")
        if ("git fetch" in publish_job or "git ls-remote" in publish_job or
                "OBSERVED_BRANCH_SHA=" in pr or
                "observed_branch_sha=" in pr):
            errors.append("publish job refreshes analysis-time branch state")
        return errors

    check("required workflow step markers are present",
          all(marker in workflow for marker in (
              analysis_job_marker, publish_job_marker,
              privacy_preflight_marker, install_dependencies_marker,
              determine_cycle_marker,
              validate_backtest_marker,
              prepare_branch_marker, fetch_marker, generate_ledger_marker,
              validate_ledger_marker, live_marker, registry_marker, backtest_marker,
              guard_marker, live_artifact_marker, backtest_artifact_marker,
              download_marker, publish_guard_marker, pr_marker)))
    analysis_job = workflow_section(
        workflow, analysis_job_marker, publish_job_marker)
    analysis_job_header = analysis_job.split("\n    steps:", 1)[0]
    publish_job = workflow_section(workflow, publish_job_marker)
    privacy_preflight_step = workflow_section(
        workflow, privacy_preflight_marker, install_dependencies_marker)
    determine_cycle_step = workflow_section(
        workflow, determine_cycle_marker, validate_backtest_marker)
    prepare_branch_step = workflow_section(workflow, prepare_branch_marker, fetch_marker)
    generate_ledger_step = workflow_section(
        workflow, generate_ledger_marker, validate_ledger_marker)
    live_step = workflow_section(workflow, live_marker, registry_marker)
    backtest_step = workflow_section(workflow, backtest_marker, guard_marker)
    guard_step = workflow_section(workflow, guard_marker, live_artifact_marker)
    live_artifact_step = workflow_section(
        workflow, live_artifact_marker, backtest_artifact_marker)
    backtest_artifact_step = workflow_section(
        analysis_job, backtest_artifact_marker)
    download_step = workflow_section(
        publish_job, download_marker, publish_guard_marker)
    publish_guard_step = workflow_section(
        publish_job, publish_guard_marker, pr_marker)
    pr_step = workflow_section(publish_job, pr_marker)
    check("backtest label is validated before cycle path export",
          first_run_command(determine_cycle_step) == "set -euo pipefail" and
          determine_cycle_step.find('[[ ! "$BACKTEST_LABEL" =~ ^[a-z0-9-]+$ ]]') <
          determine_cycle_step.find(
              'cycle_month="$BACKTEST_LABEL"') <
          determine_cycle_step.find(
              'artifact_name="monthly-source-scout-$cycle_month-'))
    check("source-ledger workflow reuses an existing cycle ledger",
          'LEDGER="docs/Source-Coverage-Ledger-$CYCLE_MONTH.md"' in generate_ledger_step
          and 'if [[ -f "$LEDGER" ]]' in generate_ledger_step
          and "Using existing source ledger: $LEDGER" in generate_ledger_step)
    check("review-branch reruns restore the in-progress cycle ledger",
          'LEDGER="docs/Source-Coverage-Ledger-$CYCLE_MONTH.md"' in prepare_branch_step
          and '"$LEDGER" \\' in prepare_branch_step
          and 'git checkout "$observed_branch_sha" -- "$RESTORE_FILE"' in
          prepare_branch_step)
    check("source-ledger generation does not force overwrite",
          "--force" not in generate_ledger_step)
    check("source-ledger generation runs before validation",
          0 <= workflow.find(generate_ledger_marker) < workflow.find(validate_ledger_marker))
    check("live workflow explicitly requires API keys and complete tiers",
          "--require-keys" in live_step and "--require-complete" in live_step)
    check("live workflow carries prior candidates only on review-branch reruns",
          'CARRY_FORWARD_LEDGER:' not in analysis_job_header and
          'CANDIDATE_LEDGER="monitoring/candidates/$CYCLE_MONTH.json"' in
          prepare_branch_step and
          'git show "$observed_branch_sha:$CANDIDATE_LEDGER" > "$CARRY_FORWARD_INPUT"' in
          prepare_branch_step and
          '"passed": False' in prepare_branch_step and
          '**NOT ACCEPTED.**' in prepare_branch_step and
          'echo "CARRY_FORWARD_LEDGER=$CARRY_FORWARD_INPUT" >> "$GITHUB_ENV"' in
          prepare_branch_step and
          'carry_forward_ledger="${CARRY_FORWARD_LEDGER:-}"' in live_step and
          'if [ -n "$carry_forward_ledger" ]; then' in live_step and
          'args+=(--carry-forward-ledger "$carry_forward_ledger")' in live_step and
          "--carry-forward-ledger" not in backtest_step)
    check("dynamic workflow paths are written and consumed without job defaults",
          'ETHICS_PRIOR_CACHE:' not in analysis_job_header and
          'CARRY_FORWARD_LEDGER:' not in analysis_job_header and
          'echo "ETHICS_PRIOR_CACHE=$ETHICS_PRIOR_CACHE" >> "$GITHUB_ENV"' in
          workflow and
          'ethics_prior_cache="${ETHICS_PRIOR_CACHE:-}"' in live_step and
          '--ethics-prior-cache "$ethics_prior_cache"' in live_step and
          'echo "CARRY_FORWARD_LEDGER=$CARRY_FORWARD_INPUT" >> "$GITHUB_ENV"' in
          prepare_branch_step and
          'carry_forward_ledger="${CARRY_FORWARD_LEDGER:-}"' in live_step)
    check("privacy secret is validated before fetch and paid tiers",
          all(value in privacy_preflight_step for value in (
              "PRIVATE_IDENTITY_PATTERNS: ${{ secrets.PRIVACY_IDENTITY_PATTERNS }}",
              'if [ -z "$PRIVATE_IDENTITY_PATTERNS" ]; then',
              "umask 077",
              '[ -L .identity-patterns ] || [ ! -f .identity-patterns ] || [ "$(stat -c \'%a\' .identity-patterns)" != "600" ]',
              f'approved_scanner_sha256="{scanner_pin}"',
              "python3 scripts/privacy_scan.py files \\",
              "--require-identity-patterns \\",
              "scripts/privacy_scan.py",
          )) and
          workflow.find(privacy_preflight_marker) < workflow.find(fetch_marker) and
          workflow.find(privacy_preflight_marker) < workflow.find(live_marker) and
          workflow.find(privacy_preflight_marker) < workflow.find(backtest_marker))
    check("backtest workflow explicitly requires API keys and complete tiers",
          "--require-keys" in backtest_step and "--require-complete" in backtest_step)
    check("backtest derives a valid monitor cycle from the fixed window",
          'backtest_cycle="${WINDOW_START:0:7}"' in backtest_step and
          '--cycle "$backtest_cycle"' in backtest_step and
          '--cycle "$BACKTEST_LABEL"' not in backtest_step and
          "--fetch-results" not in backtest_step)
    check("live monitor failure is not ignored",
          "continue-on-error" not in live_step and "||" not in live_step)
    check("live monitor writes only the canonical candidate outputs",
          '--ledger-path "monitoring/candidates/$CYCLE_MONTH.json"' in live_step and
          '--packet-path "docs/Source-Monitoring-Candidates-$CYCLE_MONTH.md"' in
          live_step)
    check("privacy guard runs before both scoped artifact uploads",
          workflow.find(guard_marker) < workflow.find(live_artifact_marker) <
          workflow.find(backtest_artifact_marker) < workflow.find(publish_job_marker) and
          workflow_condition(guard_step) == "always()" and
          "id: privacy-guard" in guard_step)
    check("backtest artifacts exclude accepted live monitor state",
          "monitoring/state.json" not in backtest_artifact_step and
          all(path in backtest_artifact_step for path in backtest_artifact_paths) and
          all(path in live_artifact_step for path in live_artifact_paths))
    check("source analysis is main-only with read permissions",
          "source analysis is not main-only and read-only" not in
          workflow_contract_errors(workflow))
    check("workflow actions use exact reviewed SHAs without persisted credentials",
          "workflow actions are not pinned to exact SHAs" not in
          workflow_contract_errors(workflow) and
          "checkout and setup actions do not use the reviewed SHA" not in
          workflow_contract_errors(workflow))
    check("live artifact is complete and run-unique",
          "live artifact is not complete and run-unique" not in
          workflow_contract_errors(workflow))
    check("publish review requires successful live analysis",
          "publish review is not gated on successful live analysis" not in
          workflow_contract_errors(workflow))
    check("publish handoff uses the analyzed SHA and pinned artifact",
          "publish handoff is not pinned to the analyzed SHA and artifact" not in
          workflow_contract_errors(workflow))
    check("publish payload is exactly five guarded files",
          "publish payload is not the fixed five-file set" not in
          workflow_contract_errors(workflow))
    check("hosted scanners require reviewed bytes and private patterns",
          "hosted scanner is not hash-pinned with private identity rules" not in
          workflow_contract_errors(workflow))
    check("private identity file is removed before authentication",
          "review PR does not run staged safety checks before commit" not in
          workflow_contract_errors(workflow))
    check("publish uses the analysis-time force lease",
          "publish push does not use the observed or expected-absent lease" not in
          workflow_contract_errors(workflow) and
          "publish job refreshes analysis-time branch state" not in
          workflow_contract_errors(workflow))
    check("draft PR state is checked before commit and push",
          "draft PR state is not checked before commit and push" not in
          workflow_contract_errors(workflow))
    workflow_errors = workflow_contract_errors(workflow)
    if workflow_errors:
        print("WORKFLOW CONTRACT ERRORS:", workflow_errors)
    check("workflow control-flow contract passes", workflow_errors == [])
    missing_concurrency = workflow.replace(
        "concurrency:\n"
        "  group: monthly-source-scout-${{ inputs.label || 'live' }}\n"
        "  cancel-in-progress: false\n",
        "",
        1,
    )
    check("workflow contract serializes live review-branch updates",
          missing_concurrency != workflow and
          any("not serialized" in error
              for error in workflow_contract_errors(missing_concurrency)))

    def run_staged_scan(candidate_text=None, identity_pattern=None, *,
                        candidate_bytes=None, working_text=None,
                        candidate_name="candidate.md"):
        with tempfile.TemporaryDirectory() as td:
            subprocess.run(
                ["git", "init", "-q"], cwd=td, check=True,
                capture_output=True, text=True)
            candidate_path = Path(td) / candidate_name
            if candidate_bytes is None:
                candidate_path.write_text(candidate_text)
            else:
                candidate_path.write_bytes(candidate_bytes)
            subprocess.run(
                ["git", "add", candidate_name], cwd=td, check=True,
                capture_output=True, text=True)
            if working_text is not None:
                candidate_path.write_text(working_text)
            if identity_pattern is not None:
                (Path(td) / ".identity-patterns").write_text(identity_pattern)
            return subprocess.run(
                [sys.executable, str(PRIVACY_SCAN_PATH), "staged", "--root", "."],
                cwd=td,
                capture_output=True, text=True)

    plus_prefixed_sensitive_scan = run_staged_scan(
        f"++ contact {SYNTHETIC_BYPASS_EMAIL} at {SYNTHETIC_USER_PATH}\n")
    plus_prefixed_safe_scan = run_staged_scan("++ harmless release note\n")
    check("staged identifier scan checks plus-prefixed added content",
          plus_prefixed_sensitive_scan.returncode == 1 and
          "local-machine-path" in plus_prefixed_sensitive_scan.stderr and
          "email-address" in plus_prefixed_sensitive_scan.stderr and
          SYNTHETIC_USER_PATH not in plus_prefixed_sensitive_scan.stderr and
          SYNTHETIC_BYPASS_EMAIL not in plus_prefixed_sensitive_scan.stderr and
          plus_prefixed_safe_scan.returncode == 0 and
          "privacy scan: passed" in plus_prefixed_safe_scan.stdout)

    unicode_separator_scan = run_staged_scan(
        ("safe\u2028file://" + SYNTHETIC_USER_PATH + " " +
         SYNTHETIC_BYPASS_EMAIL + "\rhidden"))
    check("staged privacy scan blocks Unicode and carriage-return separators",
          unicode_separator_scan.returncode == 1 and
          "local-machine-path" in unicode_separator_scan.stderr and
          "email-address" in unicode_separator_scan.stderr and
          SYNTHETIC_USER_PATH not in unicode_separator_scan.stderr and
          SYNTHETIC_BYPASS_EMAIL not in unicode_separator_scan.stderr)

    json_separator_hidden_path = "file://" + SYNTHETIC_USER_PATH
    json_separator_scans = [
        run_staged_scan(separator.join(json_separator_hidden_path))
        for separator in (r"\b", r"\f", r"\t")
    ]
    check("staged privacy scan joins every common JSON separator escape",
          all(result.returncode == 1 and
              "local-machine-path" in result.stderr
              for result in json_separator_scans))

    local_home_variants = (
        "/" + "users/lower/private",
        "/" + "home/7runner/private",
        "/" + "home/_runner/private",
        "C:" + "\\Users\\7runner\\private",
        "C:" + "\\Users\\_runner\\private",
        "\\" + "\\server\\share\\Users\\_runner\\private",
    )
    local_home_scans = [
        run_staged_scan(path) for path in local_home_variants
    ]
    check("staged privacy scan covers case and valid home-name variants",
          all(result.returncode == 1 and
              "local-machine-path" in result.stderr
              for result in local_home_scans))

    public_web_path_variants = (
        "https://example.org/home/news",
        "http://example.net/users/profile",
        "https://example.org/archive/users/profile",
        quote("https://example.org/home/releases", safe=""),
    )
    public_web_path_scans = [
        run_staged_scan(value) for value in public_web_path_variants
    ]
    check("privacy scan permits public web home and users path segments",
          all(result.returncode == 0 and
              "privacy scan: passed" in result.stdout
              for result in public_web_path_scans))

    placeholder_path_scans = [
        run_staged_scan(value) for value in (
            "/" + "Users/<name>/Downloads/project",
            "/" + "home/<user>/project",
        )
    ]
    check("privacy scan permits explicit local-path placeholders",
          all(result.returncode == 0 and
              "privacy scan: passed" in result.stdout
              for result in placeholder_path_scans))

    true_local_path_variants = (
        SYNTHETIC_HOME_PATH,
        SYNTHETIC_USER_PATH,
        "file://" + SYNTHETIC_HOME_PATH,
        quote(SYNTHETIC_HOME_PATH, safe=""),
        quote(quote(SYNTHETIC_USER_PATH, safe=""), safe=""),
        "https://example.org/news?cache=" + SYNTHETIC_HOME_PATH,
        "https://" + SYNTHETIC_HOME_PATH,
    )
    true_local_path_scans = [
        run_staged_scan(value) for value in true_local_path_variants
    ]
    check("privacy scan still blocks true and encoded local paths",
          all(result.returncode == 1 and
              "local-machine-path" in result.stderr and
              SYNTHETIC_HOME_PATH not in result.stderr and
              SYNTHETIC_USER_PATH not in result.stderr
              for result in true_local_path_scans))

    html_reference_path_scans = [
        run_staged_scan(value)
        for value in (
            "&#47;" + "Users&#47;FixtureUser&#47;private",
            "&#x2f;" + "home&#x2f;runner&#x2f;private",
            "&amp;" + "#47;Users&amp;" + "#47;FixtureUser",
            "&" + "sol;home&" + "sol;runner&" + "sol;private",
        )
    ]
    check("privacy scan blocks HTML character-reference local paths",
          all(result.returncode == 1 and
              "local-machine-path" in result.stderr
              for result in html_reference_path_scans))

    repeated_separator_path_scans = [
        run_staged_scan(value)
        for value in (
            "/" + "Users//FixtureUser/private",
            "//" + "home///runner/private",
        )
    ]
    check("privacy scan blocks repeated POSIX path separators",
          all(result.returncode == 1 and
              "local-machine-path" in result.stderr
              for result in repeated_separator_path_scans))

    identity_scan = run_staged_scan(
        "Private fixture token\n", identity_pattern="fixture token")
    check("staged privacy scan applies local identity patterns",
          identity_scan.returncode == 1 and
          "private-identity-1" in identity_scan.stderr and
          "fixture token" not in identity_scan.stderr.lower())

    with tempfile.TemporaryDirectory() as td:
        artifact_path = Path(td) / "artifact.json"
        artifact_path.write_text("safe\u2028file://" + SYNTHETIC_USER_PATH)
        artifact_scan = subprocess.run(
            [sys.executable, str(PRIVACY_SCAN_PATH), "files", "--root", td,
             str(artifact_path)], capture_output=True, text=True)
    check("artifact privacy scan blocks Unicode-separated file URLs",
          artifact_scan.returncode == 1 and
          "local-machine-path" in artifact_scan.stderr and
          SYNTHETIC_USER_PATH not in artifact_scan.stderr)

    with tempfile.TemporaryDirectory() as td:
        root = Path(td)
        (root / ".identity-patterns").write_text("PrivateToken\n")
        private_artifact = root / "artifact.json"
        private_artifact.write_text(
            "PrivateToken " + SYNTHETIC_BYPASS_EMAIL + "\n")
        private_artifact_scan = subprocess.run(
            [sys.executable, str(PRIVACY_SCAN_PATH), "files",
             "--root", td, "--require-identity-patterns",
             private_artifact.name], capture_output=True, text=True)
    check("artifact privacy scan requires identity rules and checks emails",
          private_artifact_scan.returncode == 1 and
          "private-identity-1" in private_artifact_scan.stderr and
          "email-address" in private_artifact_scan.stderr and
          "PrivateToken" not in private_artifact_scan.stderr and
          SYNTHETIC_BYPASS_EMAIL not in private_artifact_scan.stderr)

    with tempfile.TemporaryDirectory() as td:
        root = Path(td)
        safe_artifact = root / "artifact.json"
        safe_artifact.write_text("{}\n")
        missing_identity_artifact_scan = subprocess.run(
            [sys.executable, str(PRIVACY_SCAN_PATH), "files",
             "--root", td, "--require-identity-patterns",
             safe_artifact.name], capture_output=True, text=True)
    check("required artifact identity configuration fails closed when missing",
          missing_identity_artifact_scan.returncode == 2 and
          "identity-pattern configuration is required" in
          missing_identity_artifact_scan.stderr)

    utf16_scan = run_staged_scan(
        candidate_bytes=SYNTHETIC_USER_PATH.encode("utf-16le"),
        candidate_name="candidate.bin")
    binary_scan = run_staged_scan(
        candidate_bytes=(b"\xff\x01" + SYNTHETIC_USER_PATH.encode("ascii") +
                         b"\x00\xfe"),
        candidate_name="candidate.bin")
    fullwidth_scan = run_staged_scan(
        SYNTHETIC_USER_PATH.replace("/", "\uff0f"))
    check("staged privacy scan blocks UTF-16, binary, and fullwidth paths",
          utf16_scan.returncode == 1 and
          binary_scan.returncode == 1 and
          fullwidth_scan.returncode == 1 and
          all("local-machine-path" in result.stderr for result in (
              utf16_scan, binary_scan, fullwidth_scan)))

    escaped_path = "file://" + SYNTHETIC_USER_PATH
    json_escaped_scan = run_staged_scan(
        '{"path":"' + escaped_path.replace("/", r"\/") + '"}\n')
    unicode_escaped_scan = run_staged_scan(
        SYNTHETIC_USER_PATH.replace("/", r"\u002f"))
    percent_encoded_scan = run_staged_scan(
        escaped_path.replace("/", "%2F"))
    double_encoded_scan = run_staged_scan(
        escaped_path.replace("/", "%252F"))
    percent_utf16_scan = run_staged_scan(
        candidate_bytes=quote(escaped_path, safe="").encode("utf-16le"),
        candidate_name="candidate.bin")
    percent_utf32_scan = run_staged_scan(
        candidate_bytes=quote(escaped_path, safe="").encode("utf-32le"),
        candidate_name="candidate.bin")
    escaped_separator_scan = run_staged_scan(
        r"\r".join(escaped_path))
    check("staged privacy scan decodes serialized local paths",
          all(result.returncode == 1 and
              "local-machine-path" in result.stderr and
              SYNTHETIC_USER_PATH not in result.stderr
              for result in (
                  json_escaped_scan, unicode_escaped_scan,
                  percent_encoded_scan, double_encoded_scan,
                  percent_utf16_scan, percent_utf32_scan,
                  escaped_separator_scan)))
    deep_encoded_path = escaped_path
    for _ in range(5):
        deep_encoded_path = quote(deep_encoded_path, safe="")
    deep_encoded_scan = run_staged_scan(deep_encoded_path)
    check("privacy scan fails closed beyond its escape-depth limit",
          deep_encoded_scan.returncode == 2 and
          "exceeded the safe escape depth" in deep_encoded_scan.stderr and
          SYNTHETIC_USER_PATH not in deep_encoded_scan.stderr)

    indexed_sensitive_scan = run_staged_scan(
        SYNTHETIC_USER_PATH + "\n", working_text="clean working tree\n")
    unstaged_sensitive_scan = run_staged_scan(
        "clean staged content\n", working_text=SYNTHETIC_USER_PATH + "\n")
    check("staged privacy scan reads the index, not the working tree",
          indexed_sensitive_scan.returncode == 1 and
          unstaged_sensitive_scan.returncode == 0)

    with tempfile.TemporaryDirectory() as td:
        subprocess.run(
            ["git", "init", "-q"], cwd=td, check=True,
            capture_output=True, text=True)
        symlink_path = Path(td) / "candidate.md"
        symlink_path.write_text("safe\n")
        subprocess.run(
            ["git", "add", "candidate.md"], cwd=td, check=True,
            capture_output=True, text=True)
        subprocess.run(
            ["git", "-c", "user.name=Fixture", "-c",
             f"user.email={FIXTURE_GIT_EMAIL}", "commit", "-qm",
             "base"], cwd=td, check=True, capture_output=True, text=True)
        symlink_path.unlink()
        os.symlink(SYNTHETIC_USER_PATH, symlink_path)
        subprocess.run(
            ["git", "add", "candidate.md"], cwd=td, check=True,
            capture_output=True, text=True)
        symlink_scan = subprocess.run(
            [sys.executable, str(PRIVACY_SCAN_PATH), "staged", "--root", "."],
            cwd=td, capture_output=True, text=True)
    check("staged privacy scan fails closed on a symlink type change",
          symlink_scan.returncode == 2 and
          "symbolic links" in symlink_scan.stderr and
          SYNTHETIC_USER_PATH not in symlink_scan.stderr)

    with tempfile.TemporaryDirectory() as td:
        (Path(td) / ".identity-patterns").write_text("PrivateToken\n")
        named_artifact = Path(td) / "PrivateToken-report.json"
        named_artifact.write_text("{}\n")
        named_artifact_scan = subprocess.run(
            [sys.executable, str(PRIVACY_SCAN_PATH), "files", "--root", td,
             named_artifact.name], capture_output=True, text=True)
    check("artifact privacy scan checks repository-relative filenames",
          named_artifact_scan.returncode == 1 and
          "private-identity-1" in named_artifact_scan.stderr and
          "PrivateToken" not in named_artifact_scan.stderr)

    with tempfile.TemporaryDirectory() as td:
        root = Path(td)
        subprocess.run(
            ["git", "init", "-q"], cwd=td, check=True,
            capture_output=True, text=True)
        (root / "candidate.md").write_text("PrivateToken\n")
        subprocess.run(
            ["git", "add", "candidate.md"], cwd=td, check=True,
            capture_output=True, text=True)
        os.symlink(root / "missing-pattern-file", root / ".identity-patterns")
        broken_identity_scan = subprocess.run(
            [sys.executable, str(PRIVACY_SCAN_PATH), "staged", "--root", "."],
            cwd=td, capture_output=True, text=True)
    check("privacy scan rejects a broken identity-pattern symlink",
          broken_identity_scan.returncode == 2 and
          "not a regular file" in broken_identity_scan.stderr and
          "PrivateToken" not in broken_identity_scan.stderr)

    with tempfile.TemporaryDirectory() as td:
        root = Path(td)
        subprocess.run(
            ["git", "init", "-q"], cwd=td, check=True,
            capture_output=True, text=True)
        identity_path = root / ".identity-patterns"
        identity_path.write_text("PrivateToken\n")
        subprocess.run(
            ["git", "add", "-f", ".identity-patterns"], cwd=td, check=True,
            capture_output=True, text=True)
        identity_path.write_text("DifferentToken\n")
        tracked_identity_scan = subprocess.run(
            [sys.executable, str(PRIVACY_SCAN_PATH), "staged", "--root", "."],
            cwd=td, capture_output=True, text=True)
    check("privacy scan rejects an indexed identity-pattern file",
          tracked_identity_scan.returncode == 2 and
          "must never be tracked" in tracked_identity_scan.stderr and
          "PrivateToken" not in tracked_identity_scan.stderr and
          "DifferentToken" not in tracked_identity_scan.stderr)

    with tempfile.TemporaryDirectory() as td:
        root = Path(td)
        (root / "scripts" / "git-hooks").mkdir(parents=True)
        (root / "scripts" / "privacy_scan.py").write_bytes(
            PRIVACY_SCAN_PATH.read_bytes())
        hook_copy = root / "scripts" / "git-hooks" / "pre-commit"
        hook_copy.write_bytes(PRE_COMMIT_PATH.read_bytes())
        subprocess.run(
            ["git", "init", "-q"], cwd=td, check=True,
            capture_output=True, text=True)
        (root / ".identity-patterns").write_text("PrivateToken\n")
        staged_secret = root / "candidate.md"
        staged_secret.write_text(SYNTHETIC_USER_PATH + "   \n")
        subprocess.run(
            ["git", "add", "scripts", "candidate.md"], cwd=td, check=True,
            capture_output=True, text=True)
        (root / "scripts" / "privacy_scan.py").write_text(
            "#!/usr/bin/env python3\nraise SystemExit(0)\n")
        hook_result = subprocess.run(
            ["sh", str(hook_copy)], cwd=td, capture_output=True, text=True)
    hook_output = hook_result.stdout + hook_result.stderr
    check("pre-commit hook runs the indexed scanner and leaks no matched text",
          hook_result.returncode == 1 and
          "staged privacy scan failed" in hook_output and
          SYNTHETIC_USER_PATH not in hook_output and
          "whitespace errors" not in hook_output)

    def run_pre_commit_identity_case(identity_text, candidate_text):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            (root / "scripts" / "git-hooks").mkdir(parents=True)
            (root / "scripts" / "privacy_scan.py").write_bytes(
                PRIVACY_SCAN_PATH.read_bytes())
            hook_path = root / "scripts" / "git-hooks" / "pre-commit"
            hook_path.write_bytes(PRE_COMMIT_PATH.read_bytes())
            (root / "candidate.md").write_text(candidate_text)
            if identity_text is not None:
                (root / ".identity-patterns").write_text(identity_text)
            subprocess.run(
                ["git", "init", "-q"], cwd=td, check=True,
                capture_output=True, text=True)
            subprocess.run(
                ["git", "add", "scripts", "candidate.md"], cwd=td,
                check=True, capture_output=True, text=True)
            result = subprocess.run(
                ["sh", str(hook_path)], cwd=td,
                capture_output=True, text=True)
            return result, result.stdout + result.stderr

    missing_identity_hook, missing_identity_output = (
        run_pre_commit_identity_case(None, "safe candidate\n"))
    empty_identity_hook, empty_identity_output = (
        run_pre_commit_identity_case("# no active rule\n", "safe candidate\n"))
    invalid_identity_hook, invalid_identity_output = (
        run_pre_commit_identity_case("[\n", "safe candidate\n"))
    matching_identity_hook, matching_identity_output = (
        run_pre_commit_identity_case("PrivateToken\n", "PrivateToken\n"))
    safe_identity_hook, safe_identity_output = (
        run_pre_commit_identity_case("PrivateToken\n", "safe candidate\n"))
    check("pre-commit hook requires local identity configuration",
          missing_identity_hook.returncode == 1 and
          "identity-pattern configuration is required" in
          missing_identity_output)
    check("pre-commit hook rejects identity configuration with no active rules",
          empty_identity_hook.returncode == 1 and
          "identity-pattern configuration has no active patterns" in
          empty_identity_output)
    check("pre-commit hook rejects invalid identity configuration",
          invalid_identity_hook.returncode == 1 and
          "identity-pattern configuration is invalid" in
          invalid_identity_output)
    check("pre-commit hook blocks private identity matches without leaking text",
          matching_identity_hook.returncode == 1 and
          "private-identity-1" in matching_identity_output and
          "PrivateToken" not in matching_identity_output)
    check("pre-commit hook accepts safe content with required identity rules",
          safe_identity_hook.returncode == 0 and
          "pre-commit: checks passed." in safe_identity_output)

    def run_tampered_scanner_hook(staged_scanner, candidate_text=None):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            (root / "scripts" / "git-hooks").mkdir(parents=True)
            scanner_path = root / "scripts" / "privacy_scan.py"
            scanner_path.write_bytes(PRIVACY_SCAN_PATH.read_bytes())
            hook_path = root / "scripts" / "git-hooks" / "pre-commit"
            hook_path.write_bytes(PRE_COMMIT_PATH.read_bytes())
            subprocess.run(
                ["git", "init", "-q"], cwd=td, check=True,
                capture_output=True, text=True)
            subprocess.run(
                ["git", "add", "scripts"], cwd=td, check=True,
                capture_output=True, text=True)
            subprocess.run(
                ["git", "-c", "user.name=Fixture", "-c",
                 f"user.email={FIXTURE_GIT_EMAIL}", "commit", "-qm",
                 "base scanner"], cwd=td, check=True,
                capture_output=True, text=True)
            staged_paths = ["scripts/privacy_scan.py"]
            if candidate_text is not None:
                (root / "candidate.md").write_text(candidate_text)
                staged_paths.append("candidate.md")
            scanner_path.write_text(staged_scanner)
            subprocess.run(
                ["git", "add", *staged_paths],
                cwd=td, check=True, capture_output=True, text=True)
            return subprocess.run(
                ["sh", str(hook_path)], cwd=td,
                capture_output=True, text=True)

    no_op_scanner_hook = run_tampered_scanner_hook(
        "#!/usr/bin/env python3\nraise SystemExit(0)\n",
        SYNTHETIC_USER_PATH + "\n",
    )
    malformed_scanner_hook = run_tampered_scanner_hook(
        'print("' + SYNTHETIC_USER_PATH + '")\nthis is not valid python\n',
        "safe candidate\n",
    )
    clean_no_op_scanner_hook = run_tampered_scanner_hook(
        "#!/usr/bin/env python3\nraise SystemExit(0)\n")
    no_op_hook_output = no_op_scanner_hook.stdout + no_op_scanner_hook.stderr
    malformed_hook_output = (
        malformed_scanner_hook.stdout + malformed_scanner_hook.stderr)
    clean_no_op_hook_output = (
        clean_no_op_scanner_hook.stdout + clean_no_op_scanner_hook.stderr)
    check("pre-commit hook distrusts a staged scanner replacement",
          no_op_scanner_hook.returncode == 1 and
          malformed_scanner_hook.returncode == 1 and
          clean_no_op_scanner_hook.returncode == 1 and
          "does not match the reviewed hash" in no_op_hook_output and
          "does not match the reviewed hash" in malformed_hook_output and
          "does not match the reviewed hash" in clean_no_op_hook_output and
          SYNTHETIC_USER_PATH not in no_op_hook_output and
          SYNTHETIC_USER_PATH not in malformed_hook_output)

    with tempfile.TemporaryDirectory() as td:
        root = Path(td)
        (root / "scripts" / "git-hooks").mkdir(parents=True)
        scanner_path = root / "scripts" / "privacy_scan.py"
        scanner_bytes = PRIVACY_SCAN_PATH.read_bytes()
        scanner_path.write_bytes(scanner_bytes)
        hook_path = root / "scripts" / "git-hooks" / "pre-commit"
        hook_path.write_bytes(PRE_COMMIT_PATH.read_bytes())
        (root / ".identity-patterns").write_text("PrivateToken\n")
        subprocess.run(
            ["git", "init", "-q"], cwd=td, check=True,
            capture_output=True, text=True)
        subprocess.run(
            ["git", "add", "scripts"], cwd=td, check=True,
            capture_output=True, text=True)
        subprocess.run(
            ["git", "-c", "user.name=Fixture", "-c",
             f"user.email={FIXTURE_GIT_EMAIL}", "commit", "-qm",
             "base scanner"], cwd=td, check=True,
            capture_output=True, text=True)
        replacement_bytes = scanner_bytes + b"\n# reviewed replacement fixture\n"
        current_hash = hashlib.sha256(scanner_bytes).hexdigest()
        replacement_hash = hashlib.sha256(replacement_bytes).hexdigest()
        transition_hook = re.sub(
            r'trusted_scanner_sha256="[0-9a-f]{64}"',
            f'trusted_scanner_sha256="{current_hash}"',
            hook_path.read_text(),
            count=1,
        )
        transition_hook = re.sub(
            r'approved_scanner_sha256="[0-9a-f]{64}"',
            f'approved_scanner_sha256="{replacement_hash}"',
            transition_hook,
            count=1,
        )
        hook_path.write_text(transition_hook)
        scanner_path.write_bytes(replacement_bytes)
        subprocess.run(
            ["git", "add", "scripts"], cwd=td, check=True,
            capture_output=True, text=True)
        reviewed_replacement_hook = subprocess.run(
            ["sh", str(hook_path)], cwd=td,
            capture_output=True, text=True)
        unknown_trusted_hash = hashlib.sha256(
            b"unreviewed committed scanner").hexdigest()
        untrusted_transition_hook = transition_hook.replace(
            f'trusted_scanner_sha256="{current_hash}"',
            f'trusted_scanner_sha256="{unknown_trusted_hash}"',
            1,
        )
        hook_path.write_text(untrusted_transition_hook)
        subprocess.run(
            ["git", "add", "scripts/git-hooks/pre-commit"],
            cwd=td, check=True, capture_output=True, text=True)
        untrusted_committed_hook = subprocess.run(
            ["sh", str(hook_path)], cwd=td,
            capture_output=True, text=True)
    check("pre-commit hook permits a two-hash reviewed scanner transition",
          reviewed_replacement_hook.returncode == 0 and
          "checks passed" in reviewed_replacement_hook.stdout)
    check("pre-commit hook rejects an untrusted committed scanner transition",
          untrusted_committed_hook.returncode == 1 and
          "committed privacy scanner does not match the reviewed hash" in
          (untrusted_committed_hook.stdout + untrusted_committed_hook.stderr))

    with tempfile.TemporaryDirectory() as td:
        root = Path(td)
        (root / "scripts" / "git-hooks").mkdir(parents=True)
        (root / "scripts" / "privacy_scan.py").write_bytes(
            PRIVACY_SCAN_PATH.read_bytes())
        hook_path = root / "scripts" / "git-hooks" / "pre-commit"
        hook_path.write_bytes(PRE_COMMIT_PATH.read_bytes())
        fake_bin = root / "fake-bin"
        fake_bin.mkdir()
        fake_cp = fake_bin / "cp"
        fake_cp.write_text("#!/bin/sh\nexit 74\n")
        fake_cp.chmod(0o755)
        subprocess.run(
            ["git", "init", "-q"], cwd=td, check=True,
            capture_output=True, text=True)
        subprocess.run(
            ["git", "add", "scripts"], cwd=td, check=True,
            capture_output=True, text=True)
        cp_failure_env = {
            **os.environ,
            "PATH": f"{fake_bin}{os.pathsep}{os.environ.get('PATH', '')}",
        }
        cp_failure_hook = subprocess.run(
            ["sh", str(hook_path)], cwd=td, env=cp_failure_env,
            capture_output=True, text=True)
        fake_cp.write_text("#!/bin/sh\nexit 0\n")
        cp_no_op_hook = subprocess.run(
            ["sh", str(hook_path)], cwd=td, env=cp_failure_env,
            capture_output=True, text=True)
    cp_failure_output = cp_failure_hook.stdout + cp_failure_hook.stderr
    cp_no_op_output = cp_no_op_hook.stdout + cp_no_op_hook.stderr
    check("pre-commit hook fails closed when scanner copy fails",
          cp_failure_hook.returncode == 1 and
          "could not be copied" in cp_failure_output)
    check("pre-commit hook verifies copied scanner bytes before execution",
          cp_no_op_hook.returncode == 1 and
          "failed its integrity check" in cp_no_op_output)

    redundant_dynamic_job_env = workflow.replace(
        "      BACKTEST_LABEL: ${{ inputs.label || '' }}\n",
        "      BACKTEST_LABEL: ${{ inputs.label || '' }}\n"
        '      CARRY_FORWARD_LEDGER: ""\n'
        '      ETHICS_PRIOR_CACHE: ""\n',
        1,
    )
    check("workflow contract rejects redundant dynamic path job defaults",
          redundant_dynamic_job_env != workflow and
          any("redundant job-level declaration" in error
              for error in workflow_contract_errors(redundant_dynamic_job_env)))

    missing_ethics_path_export = workflow.replace(
        '          echo "ETHICS_PRIOR_CACHE=$ETHICS_PRIOR_CACHE" >> "$GITHUB_ENV"\n',
        "",
        1,
    )
    missing_carry_path_export = workflow.replace(
        '              echo "CARRY_FORWARD_LEDGER=$CARRY_FORWARD_INPUT" >> "$GITHUB_ENV"\n',
        "",
        1,
    )
    check("workflow contract requires dynamic path writes and later consumption",
          missing_ethics_path_export != workflow and
          missing_carry_path_export != workflow and
          all(any("written and consumed" in error
                  for error in workflow_contract_errors(candidate))
              for candidate in (
                  missing_ethics_path_export, missing_carry_path_export)))

    missing_early_privacy_secret = workflow.replace(
        "          PRIVATE_IDENTITY_PATTERNS: ${{ secrets.PRIVACY_IDENTITY_PATTERNS }}\n",
        "",
        1,
    )
    preflight_start = workflow.find(f"      {privacy_preflight_marker}\n")
    preflight_end = workflow.find(
        "      - name: Install dependencies\n", preflight_start)
    if preflight_start >= 0 and preflight_end > preflight_start:
        preflight_block = workflow[preflight_start:preflight_end]
        without_preflight = (
            workflow[:preflight_start] + workflow[preflight_end:])
        late_insert = without_preflight.find(f"      {guard_marker}\n")
        late_privacy_preflight = (
            without_preflight[:late_insert] + preflight_block +
            without_preflight[late_insert:]
            if late_insert >= 0 else workflow)
    else:
        late_privacy_preflight = workflow
    check("workflow contract requires privacy secret validation before protected work",
          missing_early_privacy_secret != workflow and
          late_privacy_preflight != workflow and
          all(any("before fetch and paid tiers" in error
                  for error in workflow_contract_errors(candidate))
              for candidate in (
                  missing_early_privacy_secret, late_privacy_preflight)))

    unsafe_privacy_preflights = (
        workflow.replace("          umask 077\n", "", 1),
        workflow.replace(
            '          if [ -L .identity-patterns ] || [ ! -f .identity-patterns ] || [ "$(stat -c \'%a\' .identity-patterns)" != "600" ]; then\n',
            "",
            1,
        ),
        workflow.replace(
            "          python3 scripts/privacy_scan.py files \\\n"
            "            --root . \\\n"
            "            --require-identity-patterns \\\n"
            "            scripts/privacy_scan.py\n",
            "",
            1,
        ),
    )
    check("workflow contract requires an owner-only scanned preflight file",
          all(candidate != workflow and
              any("before fetch and paid tiers" in error
                  for error in workflow_contract_errors(candidate))
              for candidate in unsafe_privacy_preflights))

    conditional_privacy_preflights = [
        workflow.replace(
            f"{privacy_preflight_marker}\n",
            f"{privacy_preflight_marker}\n        if: {condition}\n",
            1,
        )
        for condition in ("false", "env.BACKTEST_LABEL == ''")
    ]
    check("workflow contract rejects a conditional privacy preflight",
          all(candidate != workflow and
              any("preflight can be skipped" in error
                  for error in workflow_contract_errors(candidate))
              for candidate in conditional_privacy_preflights))

    whole_monitoring_tree_scan = workflow.replace(
        '          for FILE in "${ARTIFACT_FILES[@]}"; do\n',
        "          if [ -d monitoring ]; then\n"
        "            while IFS= read -r -d '' FILE; do\n"
        "              FILES+=(\"$FILE\")\n"
        "            done < <(find monitoring \\( -type f -o -type l \\) -print0)\n"
        "          fi\n"
        '          for FILE in "${ARTIFACT_FILES[@]}"; do\n',
        1,
    )
    historical_live_payload = workflow.replace(
        '              "monitoring/candidates/$cycle_month.json"\n',
        '              "monitoring/candidates/$cycle_month.json"\n'
        '              "monitoring/candidates/2026-06.json"\n',
        1,
    )
    historical_backtest_payload = workflow.replace(
        '              "monitoring/backtest/sources-$cycle_month.json"\n',
        '              "monitoring/backtest/sources-$cycle_month.json"\n'
        '              "monitoring/backtest/state-2026-06.json"\n',
        1,
    )
    check("workflow contract rejects unrelated historical monitoring scans",
          all(candidate != workflow and
              any("exact current-run artifact payload" in error
                  for error in workflow_contract_errors(candidate))
              for candidate in (
                  whole_monitoring_tree_scan,
                  historical_live_payload,
                  historical_backtest_payload)))

    inverted_payload_selector = workflow.replace(
        '          if [ -z "$BACKTEST_LABEL" ]; then\n',
        '          if [ -n "$BACKTEST_LABEL" ]; then\n',
        1,
    )
    check("workflow contract binds payload arrays to live and backtest modes",
          inverted_payload_selector != workflow and
          any("exact current-run artifact payload" in error
              for error in workflow_contract_errors(inverted_payload_selector)))

    missing_live_payloads = [
        workflow.replace(f"              {path}\n", "", 1)
        for path in (
            '"monitoring/candidates/$cycle_month.json"',
            "monitoring/ethics-reports.json",
            "monitoring/state.json",
        )
    ]
    check("workflow guard requires current candidate state and Ethics payloads",
          all(candidate != workflow and
              any("exact current-run artifact payload" in error
                  for error in workflow_contract_errors(candidate))
              for candidate in missing_live_payloads))

    missing_symlink_rejection = workflow.replace(
        '            if [ -L "$FILE" ]; then\n'
        '              echo "::error::Current upload artifact is a symbolic link: $FILE"\n'
        '              exit 1\n',
        "",
        1,
    )
    missing_non_file_rejection = workflow.replace(
        '            elif [ -e "$FILE" ]; then\n'
        '              echo "::error::Current upload artifact is not a regular file: $FILE"\n'
        '              exit 1\n',
        "",
        1,
    )
    missing_success_requirement = workflow.replace(
        '            elif [ "$PRIOR_STEPS_STATUS" = "success" ]; then\n'
        '              echo "::error::Required current upload artifact is missing: $FILE"\n'
        '              exit 1\n',
        "",
        1,
    )
    check("workflow guard rejects symlinks, non-files, and missing success outputs",
          all(candidate != workflow and
              any("exact current-run artifact payload" in error
                  for error in workflow_contract_errors(candidate))
              for candidate in (
                  missing_symlink_rejection,
                  missing_non_file_rejection,
                  missing_success_requirement)))

    late_backtest_validation = workflow.replace(
        "            if [[ ! \"$BACKTEST_LABEL\" =~ ^[a-z0-9-]+$ ]]; then\n"
        "              echo \"::error::label must match ^[a-z0-9-]+$\"\n"
        "              exit 1\n"
        "            fi\n",
        "",
        1,
    )
    check("workflow contract rejects unguarded backtest artifact labels",
          late_backtest_validation != workflow and
          any("label is not validated" in error
              for error in workflow_contract_errors(late_backtest_validation)))

    missing_staged_whitespace_check = workflow.replace(
        "          git diff --cached --check\n",
        "",
        1,
    )
    check("workflow contract requires staged whitespace checks before branch push",
          missing_staged_whitespace_check != workflow and
          any("staged safety checks" in error
              for error in workflow_contract_errors(missing_staged_whitespace_check)))

    missing_staged_privacy_scan = workflow.replace(
        "          python3 scripts/privacy_scan.py staged --root . --require-identity-patterns\n",
        "",
        1,
    )
    check("workflow contract requires the staged privacy scanner",
          missing_staged_privacy_scan != workflow and
          any("staged safety checks" in error
              for error in workflow_contract_errors(missing_staged_privacy_scan)))

    ignored_restore = workflow.replace(
        '              git checkout "$observed_branch_sha" -- "$RESTORE_FILE"',
        '              git checkout "$observed_branch_sha" -- "$RESTORE_FILE" || true',
        1,
    )
    check("workflow contract rejects ignored continuity restoration",
          ignored_restore != workflow and
          any("suppress failure" in error
              for error in workflow_contract_errors(ignored_restore)))

    stale_rerun_artifact = workflow.replace(
        '            "passed": False,',
        '            "passed": True,',
        1,
    )
    check("workflow contract rejects an accepted rerun placeholder artifact",
          stale_rerun_artifact != workflow and
          any("restored independently" in error
              for error in workflow_contract_errors(stale_rerun_artifact)))

    late_placeholder = workflow.replace(
        "          # Establish a current failed marker before any network or branch step.\n"
        "          write_pending_artifacts\n",
        "",
        1,
    )
    check("workflow contract requires a pending marker before network work",
          late_placeholder != workflow and
          any("before network" in error
              for error in workflow_contract_errors(late_placeholder)))

    missing_ethics_snapshot = workflow.replace(
        '          cp monitoring/ethics-reports.json "$ETHICS_PRIOR_CACHE"\n',
        "",
        1,
    )
    check("workflow contract snapshots the accepted Ethics cache before fetch",
          missing_ethics_snapshot != workflow and
          any("snapshotted before fetch" in error
              for error in workflow_contract_errors(missing_ethics_snapshot)))

    missing_ethics_binding = workflow.replace(
        '            --ethics-prior-cache "$ethics_prior_cache"\n',
        "",
        1,
    )
    check("workflow contract binds the monitor to the Ethics cache snapshot",
          missing_ethics_binding != workflow and
          any("accepted Ethics cache snapshot" in error
              for error in workflow_contract_errors(missing_ethics_binding)))

    collapsed_branch_status = workflow.replace(
        "          branch_status=$?\n",
        "",
        1,
    )
    check("workflow contract distinguishes absent branch from lookup failure",
          collapsed_branch_status != workflow and
          any("distinguish absence" in error
              for error in workflow_contract_errors(collapsed_branch_status)))

    strict_branch_lookup = workflow.replace(
        "          set +e\n"
        "          branch_lookup=$(git ls-remote --exit-code --heads origin \"$BRANCH\" 2>/dev/null)",
        "          branch_lookup=$(git ls-remote --exit-code --heads origin \"$BRANCH\" 2>/dev/null)",
        1,
    )
    check("workflow contract preserves controlled branch lookup status capture",
          strict_branch_lookup != workflow and
          any("distinguish absence" in error
              for error in workflow_contract_errors(strict_branch_lookup)))

    owner_agnostic_pr_lookup = workflow.replace(
        " and .headRepository.nameWithOwner == env.GITHUB_REPOSITORY",
        "",
        2,
    )
    check("workflow contract rejects branch-name-only PR lookups",
          owner_agnostic_pr_lookup != workflow and
          any("same repository" in error
              for error in workflow_contract_errors(owner_agnostic_pr_lookup)))

    cross_repo_pr_lookup = workflow.replace(
        " and .isCrossRepository == false",
        "",
        2,
    )
    check("workflow contract rejects cross-repository PR matches",
          cross_repo_pr_lookup != workflow and
          any("same repository" in error
              for error in workflow_contract_errors(cross_repo_pr_lookup)))

    dead_end_orphan_branch = workflow.replace(
        '            elif [ "$open_pr_count" -eq 0 ]; then\n'
        '              echo "Existing review branch $BRANCH has no open same-repository PR. Starting clean from main."\n'
        '              git checkout -B "$BRANCH" "$GITHUB_SHA"\n'
        '              write_pending_artifacts\n',
        '            elif [ "$open_pr_count" -eq 0 ]; then\n'
        '              echo "::error::Existing review branch has no open PR."\n'
        '              exit 1\n',
        1,
    )
    check("workflow contract recovers a branch left without a PR",
          dead_end_orphan_branch != workflow and
          any("orphan review branch" in error
              for error in workflow_contract_errors(dead_end_orphan_branch)))

    restored_candidate_output = workflow.replace(
        '              git show "$observed_branch_sha:$CANDIDATE_LEDGER" > '
        '"$CARRY_FORWARD_INPUT"\n',
        '              git show "$observed_branch_sha:$CANDIDATE_LEDGER" > '
        '"$CARRY_FORWARD_INPUT"\n'
        '              git checkout "$observed_branch_sha" -- "$CANDIDATE_LEDGER"\n',
        1,
    )
    check("workflow contract rejects restoring the accepted candidate artifact",
          restored_candidate_output != workflow and
          any("temporary carry-forward" in error
              for error in workflow_contract_errors(restored_candidate_output)))

    candidate_in_restore_loop = workflow.replace(
        'for RESTORE_FILE in monitoring/state.json monitoring/ethics-reports.json '
        '"$LEDGER"',
        'for RESTORE_FILE in monitoring/state.json monitoring/ethics-reports.json '
        'monitoring/candidates/$CYCLE_MONTH.json "$LEDGER"',
        1,
    )
    check("workflow contract rejects candidate output in the restore loop",
          candidate_in_restore_loop != workflow and
          any("temporary carry-forward" in error
              for error in workflow_contract_errors(candidate_in_restore_loop)))

    diverted_live_output = workflow.replace(
        '--ledger-path "monitoring/candidates/$CYCLE_MONTH.json"',
        '--ledger-path "$RUNNER_TEMP/candidates-$CYCLE_MONTH.json"',
        1,
    )
    check("workflow contract rejects diverted live monitor output",
          diverted_live_output != workflow and
          any("explicit and canonical" in error
              for error in workflow_contract_errors(diverted_live_output)))

    duplicate_live_output = workflow.replace(
        '--ledger-path "monitoring/candidates/$CYCLE_MONTH.json"\n',
        '--ledger-path "monitoring/candidates/$CYCLE_MONTH.json"\n'
        '            --ledger-path "$RUNNER_TEMP/diverted.json"\n',
        1,
    )
    check("workflow contract rejects duplicate live output options",
          duplicate_live_output != workflow and
          any("explicit and canonical" in error
              for error in workflow_contract_errors(duplicate_live_output)))

    suppressed_live_monitor = workflow.replace(
        '          python3 scripts/monitor_sources.py "${args[@]}"\n',
        '          python3 scripts/monitor_sources.py "${args[@]}" || :\n',
        1,
    )
    check("workflow contract rejects shell suppression on the live monitor",
          suppressed_live_monitor != workflow and
          any("suppress failure" in error
              for error in workflow_contract_errors(suppressed_live_monitor)))

    relaxed_live_monitor = workflow.replace(
        '          python3 scripts/monitor_sources.py "${args[@]}"\n',
        '          set +e\n'
        '          python3 scripts/monitor_sources.py "${args[@]}"\n'
        '          set -e\n',
        1,
    )
    check("workflow contract rejects fail-fast disablement around the live monitor",
          relaxed_live_monitor != workflow and
          any("disables fail-fast" in error
              for error in workflow_contract_errors(relaxed_live_monitor)))

    leaked_live_state = workflow.replace(
        "            monitoring/backtest/state-${{ env.CYCLE_MONTH }}.json\n",
        "            monitoring/backtest/state-${{ env.CYCLE_MONTH }}.json\n"
        "            monitoring/state.json\n",
        1,
    )
    check("workflow contract rejects live state in backtest artifacts",
          leaked_live_state != workflow and
          any("scopes are not isolated" in error
              for error in workflow_contract_errors(leaked_live_state)))

    for marker, label in (
            (privacy_preflight_marker, "privacy preflight"),
            (prepare_branch_marker, "branch preparation"),
            (live_marker, "live monitor"),
            (guard_marker, "local-path guard"),
            (live_artifact_marker, "live artifact upload"),
            (backtest_artifact_marker, "backtest artifact upload")):
        ignored_step_failure = workflow.replace(
            f"{marker}\n",
            f"{marker}\n        continue-on-error: true\n",
            1,
        )
        check(f"workflow contract rejects continue-on-error on {label}",
              ignored_step_failure != workflow and
              any("critical workflow step" in error
                  for error in workflow_contract_errors(ignored_step_failure)))

    fetch_arg_backtest = workflow.replace(
        '            --cycle "$backtest_cycle"\n',
        '            --cycle "$backtest_cycle"\n'
        '            --fetch-results scripts/output/fetch-results.json\n',
        1,
    )
    check("workflow contract rejects deterministic input on a historical backtest",
          fetch_arg_backtest != workflow and
          any("historical backtest" in error
              for error in workflow_contract_errors(fetch_arg_backtest)))

    always_pr = workflow.replace(
        "    if: needs.source-analysis.result == 'success' && "
        "needs.source-analysis.outputs.backtest_mode == 'false' && "
        "github.ref == 'refs/heads/main'",
        "    if: always() && github.ref == 'refs/heads/main'",
        1,
    )
    check("workflow contract rejects always-gated PR creation",
          always_pr != workflow and
          any("successful live analysis" in error
              for error in workflow_contract_errors(always_pr)))

    failure_pr = workflow.replace(
        "    if: needs.source-analysis.result == 'success' && "
        "needs.source-analysis.outputs.backtest_mode == 'false' && "
        "github.ref == 'refs/heads/main'",
        "    if: failure() && github.ref == 'refs/heads/main'",
        1,
    )
    check("workflow contract rejects failure-gated PR creation",
          failure_pr != workflow and
          any("successful live analysis" in error
              for error in workflow_contract_errors(failure_pr)))

    status_cover_pr = workflow.replace(
        "    if: needs.source-analysis.result == 'success' && "
        "needs.source-analysis.outputs.backtest_mode == 'false' && "
        "github.ref == 'refs/heads/main'",
        "    if: success() || failure()",
        1,
    )
    check("workflow contract rejects success-or-failure PR creation",
          status_cover_pr != workflow and
          any("successful live analysis" in error
              for error in workflow_contract_errors(status_cover_pr)))

    success_only_guard = workflow.replace(
        f"{guard_marker}\n        id: privacy-guard\n        if: always()",
        f"{guard_marker}\n        id: privacy-guard\n        if: success()",
        1,
    )
    check("workflow contract requires privacy review after an earlier failure",
          success_only_guard != workflow and
          any("always-run named gate" in error
              for error in workflow_contract_errors(success_only_guard)))

    unguarded_live_upload = workflow.replace(
        "always() && steps.privacy-guard.outcome == 'success' && "
        "env.BACKTEST_LABEL == ''",
        "always() && env.BACKTEST_LABEL == ''",
        1,
    )
    check("workflow contract rejects a live upload without privacy approval",
          unguarded_live_upload != workflow and
          any("live artifact upload" in error
              for error in workflow_contract_errors(unguarded_live_upload)))

    unguarded_backtest_upload = workflow.replace(
        "always() && steps.privacy-guard.outcome == 'success' && "
        "env.BACKTEST_LABEL != ''",
        "always() && env.BACKTEST_LABEL != ''",
        1,
    )
    check("workflow contract rejects a backtest upload without privacy approval",
          unguarded_backtest_upload != workflow and
          any("backtest artifact upload" in error
              for error in workflow_contract_errors(unguarded_backtest_upload)))

    missing_diagnostic_path = workflow.replace(
        "            monitoring/candidates/${{ env.CYCLE_MONTH }}.json\n",
        "",
        1,
    )
    check("workflow contract rejects a missing diagnostic artifact path",
          missing_diagnostic_path != workflow and
          any("diagnostic artifact paths are not the exact upload sets" in error
              for error in workflow_contract_errors(missing_diagnostic_path)))

    guard_start = workflow.find(f"      {guard_marker}\n")
    guard_end = workflow.find(f"      {live_artifact_marker}\n", guard_start)
    guard_block = (
        workflow[guard_start:guard_end]
        if guard_start >= 0 and guard_end > guard_start else "")
    non_strict_guard_block = guard_block.replace(
        "          set -euo pipefail\n"
        "          cleanup_identity_patterns() {\n",
        "          cleanup_identity_patterns() {\n",
        1,
    )
    non_strict_guard = (
        workflow[:guard_start] + non_strict_guard_block + workflow[guard_end:]
        if non_strict_guard_block != guard_block else workflow)
    check("workflow contract requires strict local-path guard shell mode",
          non_strict_guard != workflow and
          any("strict shell mode" in error
              for error in workflow_contract_errors(non_strict_guard)))

    missing_artifact_privacy_scan_block = guard_block.replace(
        "            --require-identity-patterns \\\n",
        "",
        1,
    )
    missing_artifact_privacy_scan = (
        workflow[:guard_start] + missing_artifact_privacy_scan_block +
        workflow[guard_end:]
        if missing_artifact_privacy_scan_block != guard_block else workflow)
    check("workflow contract requires the artifact privacy scanner",
          missing_artifact_privacy_scan != workflow and
          any("shared privacy scanner" in error
              for error in workflow_contract_errors(missing_artifact_privacy_scan)))

    hosted_identity_secret = (
        "          PRIVATE_IDENTITY_PATTERNS: "
        "${{ secrets.PRIVACY_IDENTITY_PATTERNS }}\n")
    hosted_secret_start = workflow.find(hosted_identity_secret, guard_start)
    missing_hosted_identity_secret = (
        workflow[:hosted_secret_start] +
        workflow[hosted_secret_start + len(hosted_identity_secret):]
        if hosted_secret_start >= 0 else workflow
    )
    check("workflow contract requires hosted private identity configuration",
          missing_hosted_identity_secret != workflow and
          any("private identity rules" in error
              for error in workflow_contract_errors(missing_hosted_identity_secret)))

    candidate_only_stage = workflow.replace(
        '          git add -- "${REQUIRED_FILES[@]}"',
        '          git add -- "monitoring/candidates/$CYCLE_MONTH.json"',
        1,
    )
    check("workflow contract rejects candidate-only monitoring staging",
          candidate_only_stage != workflow and
          any("fixed five-file set" in error
              for error in workflow_contract_errors(candidate_only_stage)))
    current_guard_arrays = tuple(
        tuple(line.strip() for line in block.splitlines() if line.strip())
        for block in re.findall(
            r"ARTIFACT_FILES=\(\n(.*?)\n\s+\)", guard_step, re.DOTALL)
    )
    check("privacy guard scans only current live and backtest payloads",
          current_guard_arrays == (live_guard_paths, backtest_guard_paths) and
          'if [ -z "$BACKTEST_LABEL" ]; then' in guard_step and
          "find monitoring" not in guard_step and
          'for FILE in "${ARTIFACT_FILES[@]}"' in guard_step and
          "privacy guard does not scan the exact current-run artifact payload" not in
          workflow_contract_errors(workflow))
    check("review PR stages the cycle ledger",
          '"docs/Source-Coverage-Ledger-$CYCLE_MONTH.md"' in
          publish_guard_step and
          'git add -- "${REQUIRED_FILES[@]}"' in publish_guard_step)
    hook_text = PRE_COMMIT_PATH.read_text()
    hook_approved_match = re.search(
        r'^approved_scanner_sha256="([0-9a-f]{64})"$',
        hook_text,
        re.MULTILINE,
    )
    hook_trusted_match = re.search(
        r'^trusted_scanner_sha256="([0-9a-f]{64})"$',
        hook_text,
        re.MULTILINE,
    )
    actual_scanner_hash = hashlib.sha256(
        PRIVACY_SCAN_PATH.read_bytes()).hexdigest()
    committed_scanner = subprocess.run(
        ["git", "show", "HEAD:scripts/privacy_scan.py"],
        cwd=SCRIPT_DIR.parent, capture_output=True)
    expected_trusted_hash = (
        hashlib.sha256(committed_scanner.stdout).hexdigest()
        if committed_scanner.returncode == 0 else actual_scanner_hash)
    check("local pre-commit approved hash matches the current scanner",
          hook_approved_match is not None and
          hook_approved_match.group(1) == actual_scanner_hash == scanner_pin)
    check("local pre-commit trusted hash matches HEAD or bootstrap scanner",
          hook_trusted_match is not None and
          hook_trusted_match.group(1) == expected_trusted_hash)
    check("local pre-commit hook uses a committed scanner trust anchor",
          "git show HEAD:scripts/privacy_scan.py" in hook_text and
          "trusted_scanner_sha256=" in hook_text and
          "approved_scanner_sha256=" in hook_text and
          "actual_staged_scanner_sha256=" in hook_text and
          "actual_trusted_scanner_sha256=" in hook_text and
          "actual_copied_scanner_sha256=" in hook_text and
          'if ! cp "$staged_scanner_tmp" "$scanner_tmp"; then' in
          hook_text and
          ('python3 "$scanner_tmp" staged --root . '
           '--require-identity-patterns') in hook_text)

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
