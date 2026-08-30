#!/usr/bin/env python3
"""Test strict producer and consumer source contracts."""

import copy
import hashlib
import importlib.util
import json
import sys
import tempfile
import types
import unittest
from pathlib import Path


SCRIPT_DIR = Path(__file__).resolve().parent
FETCH_DATA_PATH = SCRIPT_DIR / "fetch-data.py"
MONITOR_SOURCES_PATH = SCRIPT_DIR / "monitor_sources.py"
IRCC_TEST_CYCLE = "2027-03"

COMMON_COLUMNS = (
    "EN_YEAR",
    "EN_QUARTER",
    "EN_MONTH",
    "EN_PROVINCE_TERRITORY",
)
EXPECTED_DATASETS = {
    "permanent_residents": {
        "url": (
            "https://www.ircc.canada.ca/opendata-donneesouvertes/data/"
            "ODP-PR-Gender.csv"
        ),
        "specific_columns": ("EN_GENDER",),
    },
    "work_permits_imp": {
        "url": (
            "https://www.ircc.canada.ca/opendata-donneesouvertes/data/"
            "ODP-TR-Work-IMP-PT_program.csv"
        ),
        "specific_columns": (
            "EN_PROGRAM_LEVEL_2",
            "EN_PROGRAM_LEVEL_3",
            "EN_PROGRAM_LEVEL_4",
            "EN_PROGRAM_LEVEL_5",
        ),
    },
    "work_permits_tfwp": {
        "url": (
            "https://www.ircc.canada.ca/opendata-donneesouvertes/data/"
            "ODP-TR-Work-TFWP-PT_program.csv"
        ),
        "specific_columns": (
            "EN_PROGRAM_LEVEL_2",
            "EN_PROGRAM_LEVEL_3",
            "EN_PROGRAM_LEVEL_4",
            "EN_PROGRAM_LEVEL_5",
        ),
    },
    "study_permits": {
        "url": (
            "https://www.ircc.canada.ca/opendata-donneesouvertes/data/"
            "ODP-TR-Study-IS_PT_study.csv"
        ),
        "specific_columns": ("EN_STUDY_LEVEL",),
    },
}
MONTHS = (
    ("Jan", "Q1"),
    ("Feb", "Q1"),
    ("Mar", "Q1"),
    ("Apr", "Q2"),
    ("May", "Q2"),
    ("Jun", "Q2"),
    ("Jul", "Q3"),
    ("Aug", "Q3"),
    ("Sep", "Q3"),
    ("Oct", "Q4"),
    ("Nov", "Q4"),
    ("Dec", "Q4"),
)
UNSORTED_MONTHS = (5, 0, 11, 1, 10, 2, 9, 3, 8, 4, 7, 6)


def dataset_columns(dataset_key):
    contract = EXPECTED_DATASETS[dataset_key]
    return COMMON_COLUMNS + contract["specific_columns"] + ("TOTAL",)


def build_ircc_tsv(dataset_key, month_indexes=range(12), columns=None):
    """Build a valid IRCC TSV fixture for one dataset."""
    columns = tuple(columns or dataset_columns(dataset_key))
    lines = ["\t".join(columns)]
    for month_index in month_indexes:
        month, quarter = MONTHS[month_index]
        values = {
            "EN_YEAR": "2026",
            "EN_QUARTER": quarter,
            "EN_MONTH": month,
            "EN_PROVINCE_TERRITORY": "Ontario",
            "EN_GENDER": "Female",
            "EN_PROGRAM_LEVEL_2": "Program level 2",
            "EN_PROGRAM_LEVEL_3": "Program level 3",
            "EN_PROGRAM_LEVEL_4": "Program level 4",
            "EN_PROGRAM_LEVEL_5": "Program level 5",
            "EN_STUDY_LEVEL": "University",
            "TOTAL": str(100 + month_index),
        }
        lines.append("\t".join(values[column] for column in columns))
    return "\n".join(lines) + "\n"


def build_rss(pub_date):
    """Build one RSS item with a controlled publication date."""
    return (
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
        "<rss><channel><item>"
        "<title>Federal approval update</title>"
        "<link>https://abacusdata.ca/federal-approval-update</link>"
        f"<pubDate>{pub_date}</pubDate>"
        "</item></channel></rss>"
    )


def replace_cell(tsv_text, row_index, column, value):
    """Replace one data cell while preserving the TSV shape."""
    lines = tsv_text.rstrip("\n").split("\n")
    columns = lines[0].split("\t")
    cells = lines[row_index + 1].split("\t")
    cells[columns.index(column)] = value
    lines[row_index + 1] = "\t".join(cells)
    return "\n".join(lines) + "\n"


def load_fetch_data_module():
    """Load the fetcher with a stub requests module."""
    module_name = "ircc_fetch_contract_fetch_data"
    spec = importlib.util.spec_from_file_location(module_name, FETCH_DATA_PATH)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Could not load {FETCH_DATA_PATH}")

    module = importlib.util.module_from_spec(spec)
    original_requests = sys.modules.get("requests")
    sys.modules["requests"] = types.ModuleType("requests")
    try:
        spec.loader.exec_module(module)
    finally:
        if original_requests is None:
            del sys.modules["requests"]
        else:
            sys.modules["requests"] = original_requests
    return module


FETCH_DATA = load_fetch_data_module()


def load_monitor_sources_module():
    """Load the source monitor without running its CLI."""
    module_name = "ircc_fetch_contract_monitor_sources"
    spec = importlib.util.spec_from_file_location(module_name, MONITOR_SOURCES_PATH)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Could not load {MONITOR_SOURCES_PATH}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


MONITOR_SOURCES = load_monitor_sources_module()


class FakeResponse:
    def __init__(self, text, status_code=200):
        self.text = text
        self.content = text.encode("utf-8")
        self.status_code = status_code


class IrccFetchContractTests(unittest.TestCase):
    def setUp(self):
        self.original_get = getattr(FETCH_DATA.requests, "get", None)
        self.requested_urls = []

    def tearDown(self):
        if self.original_get is None and hasattr(FETCH_DATA.requests, "get"):
            delattr(FETCH_DATA.requests, "get")
        elif self.original_get is not None:
            FETCH_DATA.requests.get = self.original_get

    def set_response(self, text, status_code=200):
        self.requested_urls = []

        def fake_get(url, *_args, **_kwargs):
            self.requested_urls.append(url)
            return FakeResponse(text, status_code)

        FETCH_DATA.requests.get = fake_get

    def fetch_ircc(self, dataset_key, cycle=IRCC_TEST_CYCLE):
        return FETCH_DATA.fetch_ircc_csv(dataset_key, cycle=cycle)

    def test_dataset_keys_urls_and_required_columns_are_exact(self):
        self.assertEqual(set(EXPECTED_DATASETS), set(FETCH_DATA.IRCC_DATASETS))
        for dataset_key, expected in EXPECTED_DATASETS.items():
            with self.subTest(dataset_key=dataset_key):
                actual = FETCH_DATA.IRCC_DATASETS[dataset_key]
                self.assertEqual(expected["url"], actual["url"])
                self.assertEqual(
                    set(dataset_columns(dataset_key)),
                    actual["required_columns"],
                )

    def test_each_dataset_returns_strict_success_metadata(self):
        for dataset_key, expected in EXPECTED_DATASETS.items():
            with self.subTest(dataset_key=dataset_key):
                payload = build_ircc_tsv(dataset_key, UNSORTED_MONTHS)
                self.set_response(payload)

                result = self.fetch_ircc(dataset_key)

                self.assertEqual("success", result["status"])
                self.assertEqual(dataset_key, result["dataset_key"])
                self.assertEqual(expected["url"], result["source_url"])
                self.assertEqual([expected["url"]], self.requested_urls)
                self.assertEqual(12, result["rows"])
                self.assertEqual(12, result["period_count"])
                self.assertEqual("2026-01", result["earliest_period"])
                self.assertEqual("2026-12", result["latest_period"])
                self.assertEqual(payload.splitlines()[0], result["header"])
                self.assertEqual(
                    list(dataset_columns(dataset_key)),
                    result["columns"],
                )
                self.assertEqual(payload.splitlines()[-1], result["last_row"])
                self.assertEqual(
                    hashlib.sha256(payload.encode("utf-8")).hexdigest(),
                    result["response_sha256"],
                )

    def test_missing_dataset_specific_required_columns_fail(self):
        for dataset_key, contract in EXPECTED_DATASETS.items():
            for missing_column in contract["specific_columns"]:
                with self.subTest(
                    dataset_key=dataset_key,
                    missing_column=missing_column,
                ):
                    columns = tuple(
                        column
                        for column in dataset_columns(dataset_key)
                        if column != missing_column
                    )
                    self.set_response(build_ircc_tsv(dataset_key, columns=columns))

                    result = self.fetch_ircc(dataset_key)

                    self.assertEqual("malformed_data", result["status"])
                    self.assertEqual(
                        f"missing required columns: {missing_column}",
                        result["error"],
                    )

    def test_duplicate_header_column_fails(self):
        columns = dataset_columns("permanent_residents") + ("TOTAL",)
        self.set_response(
            build_ircc_tsv("permanent_residents", columns=columns)
        )

        result = self.fetch_ircc("permanent_residents")

        self.assertEqual("malformed_data", result["status"])
        self.assertEqual("duplicate header column", result["error"])

    def test_ragged_row_fails(self):
        payload = build_ircc_tsv("permanent_residents")
        lines = payload.rstrip("\n").split("\n")
        lines[1] = "\t".join(lines[1].split("\t")[:-1])
        self.set_response("\n".join(lines) + "\n")

        result = self.fetch_ircc("permanent_residents")

        self.assertEqual("malformed_data", result["status"])
        self.assertEqual("ragged data row", result["error"])

    def test_blank_required_values_fail_for_each_dataset_schema(self):
        for dataset_key in EXPECTED_DATASETS:
            for blank_column in dataset_columns(dataset_key):
                with self.subTest(
                    dataset_key=dataset_key,
                    blank_column=blank_column,
                ):
                    payload = build_ircc_tsv(dataset_key)
                    self.set_response(replace_cell(payload, 0, blank_column, ""))

                    result = self.fetch_ircc(dataset_key)

                    self.assertEqual("malformed_data", result["status"])
                    self.assertEqual(
                        "blank required identity value",
                        result["error"],
                    )

    def test_invalid_month_fails_instead_of_reporting_freshness(self):
        payload = build_ircc_tsv("permanent_residents")
        self.set_response(replace_cell(payload, 0, "EN_MONTH", "NotAMonth"))

        result = self.fetch_ircc("permanent_residents")

        self.assertEqual("malformed_data", result["status"])
        self.assertEqual("1 row(s) have an invalid period", result["error"])

    def test_month_prefix_is_not_accepted_as_an_official_month(self):
        payload = build_ircc_tsv("permanent_residents")
        self.set_response(replace_cell(payload, 0, "EN_MONTH", "Janitor"))

        result = self.fetch_ircc("permanent_residents")

        self.assertEqual("malformed_data", result["status"])
        self.assertEqual("1 row(s) have an invalid period", result["error"])

    def test_quarter_month_mismatch_fails(self):
        payload = build_ircc_tsv("permanent_residents")
        self.set_response(replace_cell(payload, 0, "EN_QUARTER", "Q4"))

        result = self.fetch_ircc("permanent_residents")

        self.assertEqual("malformed_data", result["status"])
        self.assertEqual(
            "1 row(s) have an inconsistent quarter",
            result["error"],
        )

    def test_fewer_than_twelve_distinct_periods_fails(self):
        self.set_response(
            build_ircc_tsv("permanent_residents", month_indexes=range(11))
        )

        result = self.fetch_ircc("permanent_residents")

        self.assertEqual("malformed_data", result["status"])
        self.assertEqual(
            "fewer than 12 distinct monthly periods",
            result["error"],
        )

    def test_twelve_disconnected_months_do_not_pass_coverage(self):
        payload = build_ircc_tsv("permanent_residents")
        for row_index, year in enumerate(range(2010, 2022)):
            payload = replace_cell(payload, row_index, "EN_YEAR", str(year))
            payload = replace_cell(payload, row_index, "EN_MONTH", "Jan")
            payload = replace_cell(payload, row_index, "EN_QUARTER", "Q1")
        self.set_response(payload)

        result = self.fetch_ircc("permanent_residents")

        self.assertEqual("malformed_data", result["status"])
        self.assertEqual(
            "monthly period coverage is not contiguous",
            result["error"],
        )

    def test_total_must_be_numeric_or_the_official_suppression_marker(self):
        payload = build_ircc_tsv("permanent_residents")
        self.set_response(replace_cell(payload, 0, "TOTAL", "NOT_A_NUMBER"))
        invalid_result = self.fetch_ircc("permanent_residents")

        suppressed_payload = replace_cell(payload, 0, "TOTAL", "--")
        self.set_response(suppressed_payload)
        suppressed_result = self.fetch_ircc("permanent_residents")

        self.assertEqual("malformed_data", invalid_result["status"])
        self.assertEqual(
            "1 row(s) have an invalid TOTAL value",
            invalid_result["error"],
        )
        self.assertEqual("success", suppressed_result["status"])

    def test_missing_period_columns_fails(self):
        self.set_response("YEAR\tMONTH\tTOTAL\n2026\tJun\t20\n")

        result = self.fetch_ircc("permanent_residents")

        self.assertEqual("malformed_data", result["status"])
        self.assertEqual("missing EN_YEAR or EN_MONTH column", result["error"])

    def test_header_without_data_rows_fails(self):
        header = "\t".join(dataset_columns("permanent_residents"))
        self.set_response(header + "\n")

        result = self.fetch_ircc("permanent_residents")

        self.assertEqual("malformed_data", result["status"])
        self.assertEqual("no data rows", result["error"])

    def test_empty_response_fails(self):
        self.set_response("")

        result = self.fetch_ircc("permanent_residents")

        self.assertEqual("malformed_data", result["status"])
        self.assertEqual("empty response", result["error"])

    def test_http_error_is_not_reported_as_success(self):
        self.set_response("not found", status_code=404)

        result = self.fetch_ircc("permanent_residents")

        self.assertEqual("http_error", result["status"])
        self.assertEqual(404, result["code"])

    def test_ircc_reporting_lag_boundary_and_future_are_enforced_by_producer(self):
        payload = build_ircc_tsv("permanent_residents")
        self.set_response(payload)

        boundary = self.fetch_ircc("permanent_residents", cycle="2027-03")
        stale = self.fetch_ircc("permanent_residents", cycle="2027-04")
        future = self.fetch_ircc("permanent_residents", cycle="2026-11")

        self.assertEqual("success", boundary["status"])
        self.assertEqual("malformed_data", stale["status"])
        self.assertEqual(
            "latest monthly period exceeds the 3-month reporting lag",
            stale["error"],
        )
        self.assertEqual("malformed_data", future["status"])
        self.assertEqual("latest monthly period is in the future", future["error"])

    def test_ircc_consumer_rejects_non_20xx_stale_and_future_periods(self):
        self.set_response(build_ircc_tsv("permanent_residents"))
        valid = self.fetch_ircc("permanent_residents")

        non_20xx = copy.deepcopy(valid)
        non_20xx["earliest_period"] = "0000-01"
        non_20xx["latest_period"] = "0000-12"
        non_20xx_errors = MONITOR_SOURCES.deterministic_success_shape_errors(
            {"ircc_permanent_residents": non_20xx}, cycle=IRCC_TEST_CYCLE)
        future_errors = MONITOR_SOURCES.deterministic_success_shape_errors(
            {"ircc_permanent_residents": valid}, cycle="2026-11")

        stale_payload = {
            "generatedAt": "2027-04-01T00:00:00",
            "cycle": "2027-04",
            "linkRot": False,
            "results": {"ircc_permanent_residents": valid},
        }
        stale_errors = MONITOR_SOURCES.deterministic_payload_errors(stale_payload)

        self.assertIn(
            "ircc_permanent_residents success result has invalid period coverage",
            non_20xx_errors,
        )
        self.assertIn(
            "ircc_permanent_residents success latest period is in the future",
            future_errors,
        )
        self.assertIn(
            "ircc_permanent_residents success latest period exceeds the 3-month reporting lag",
            stale_errors,
        )

    def test_rss_producers_accept_rfc_2822_and_iso_dates(self):
        pollster = {
            "name": "Abacus Data",
            "url": "https://abacusdata.ca/feed/",
            "domain": "abacusdata.ca",
        }
        for publication_date in (
                "Fri, 28 Aug 2026 12:00:00 GMT",
                "2026-08-28T12:00:00Z"):
            with self.subTest(publication_date=publication_date):
                self.set_response(build_rss(publication_date))
                result = FETCH_DATA.fetch_pollster_feed(pollster)
                self.assertEqual("success", result["status"])
                self.assertIsNotNone(
                    MONITOR_SOURCES.parse_publication_date(publication_date))

    def test_all_rss_producers_reject_unparseable_dates(self):
        fetchers = (
            ("pbo", lambda: FETCH_DATA.fetch_pbo_feed()),
            ("pollster", lambda: FETCH_DATA.fetch_pollster_feed({
                "name": "Abacus Data",
                "url": "https://abacusdata.ca/feed/",
                "domain": "abacusdata.ca",
            })),
            ("policy", lambda: FETCH_DATA.fetch_policy_feed({
                "name": "C.D. Howe Institute",
                "url": "https://www.cdhowe.org/feed/",
            })),
        )
        for publication_date in (
                "definitely-not-a-date",
                "Fri, 28 Aug 2026 12:00:00 GMT junk",
                "2026-08-28X12:00:00",
                "2026-08-28\n12:00:00"):
            for label, fetcher in fetchers:
                with self.subTest(feed=label, publication_date=publication_date):
                    self.set_response(build_rss(publication_date))
                    result = fetcher()
                    self.assertEqual("malformed_data", result["status"])
                    self.assertEqual(
                        "RSS item has an unparseable publication date",
                        result["error"],
                    )
                    self.assertIsNone(
                        MONITOR_SOURCES.parse_publication_date(publication_date))

        for publication_date in (
                "2026-08-28X12:00:00",
                "2026-08-28\n12:00:00",
                "2026-08-28\x0012:00:00"):
            with self.subTest(parser_date=publication_date):
                self.assertIsNone(
                    FETCH_DATA.parse_publication_date(publication_date))
                self.assertIsNone(
                    MONITOR_SOURCES.parse_publication_date(publication_date))

    def test_rss_consumer_rejects_unparseable_success_items(self):
        results = {
            "pbo_feed": {
                "status": "success",
                "count": 1,
                "publications": [{
                    "title": "Report",
                    "link": "https://www.pbo-dpb.ca/en/publications/report",
                    "pubDate": "not-a-date",
                }],
            },
            "pollster_feeds": [{
                "pollster": "Abacus Data",
                "url": "https://abacusdata.ca/feed/",
                "status": "success",
                "all_count": 1,
                "relevant_count": 1,
                "new_count": 1,
                "cited_count": 0,
                "items": [{
                    "title": "Federal approval update",
                    "link": "https://abacusdata.ca/federal-approval-update",
                    "pubDate": "not-a-date",
                    "is_cited": False,
                }],
            }],
        }

        errors = MONITOR_SOURCES.deterministic_success_shape_errors(results)

        self.assertIn("pbo_feed publications contains an unusable entry", errors)
        self.assertIn("pollster_feeds[0] items contains an unusable entry", errors)

    def test_tracking_fields_are_removed_but_semantic_queries_are_preserved(self):
        cited = "https://abacusdata.ca/poll?article=42"
        tracked = (
            "https://abacusdata.ca/poll?utm_source=rss&article=42&fbclid=a&"
            "gclid=b&mc_cid=c&mc_eid=d"
        )
        semantic_variant = "https://abacusdata.ca/poll?article=42&ref=homepage"
        empty_field_variants = (
            "https://abacusdata.ca/poll?article=42&utm_source=rss&",
            "https://abacusdata.ca/poll?utm_source=rss&&article=42",
        )

        for normalizer in (
                FETCH_DATA.normalize_cited_url,
                MONITOR_SOURCES.normalize_url):
            with self.subTest(normalizer=normalizer.__module__):
                self.assertEqual(normalizer(cited), normalizer(tracked))
                for variant in empty_field_variants:
                    self.assertEqual(normalizer(cited), normalizer(variant))
                self.assertNotEqual(normalizer(cited), normalizer(semantic_variant))
                self.assertIn("ref=homepage", normalizer(semantic_variant))

        cited_urls = FETCH_DATA.collect_cited_pollster_urls(
            {"polls": [{"sourceUrl": cited}], "preferredPM": {"polls": []}},
            "abacusdata.ca",
        )
        self.assertIn(FETCH_DATA.normalize_cited_url(tracked), cited_urls)

    def test_ethics_snapshot_is_read_only_and_binds_prior_report_keys(self):
        prior_key = "/en/report/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        new_key = "/en/report/bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
        prior_url = f"https://www.ethicscanada.ca{prior_key}"
        new_url = f"https://www.ethicscanada.ca{new_key}"
        snapshot = {
            "reports": [{"title": "Prior report", "url": prior_url}],
        }
        with tempfile.TemporaryDirectory() as temp_dir:
            cache_path = Path(temp_dir) / "ethics-prior.json"
            cache_path.write_text(json.dumps(snapshot), encoding="utf-8")
            before = cache_path.read_bytes()
            prior_keys, cache_error = MONITOR_SOURCES.load_ethics_prior_cache(
                cache_path)
            after = cache_path.read_bytes()

        results = {
            "ethics_reports_page": {
                "status": "success",
                "url": MONITOR_SOURCES.ETHICS_REPORTS_URL,
                "count": 2,
                "reports": [
                    {"title": "Prior report", "url": prior_url},
                    {"title": "New report", "url": new_url},
                ],
            },
            "ethics_reports_diff": {
                "status": "success",
                "priorCacheFound": True,
                "priorCount": 1,
                "currentCount": 2,
                "priorReportKeys": [prior_key],
                "currentReportKeys": [prior_key, new_key],
                "additions": [{"title": "New report", "url": new_url}],
                "removals": [],
            },
        }
        accepted = MONITOR_SOURCES.deterministic_success_shape_errors(
            results,
            ethics_prior_report_keys=prior_keys,
            require_ethics_prior_cache=True,
        )
        forged = MONITOR_SOURCES.deterministic_success_shape_errors(
            results,
            ethics_prior_report_keys=[new_key],
            require_ethics_prior_cache=True,
        )
        missing = MONITOR_SOURCES.deterministic_success_shape_errors(
            results, require_ethics_prior_cache=True)

        self.assertIsNone(cache_error)
        self.assertEqual([prior_key], prior_keys)
        self.assertEqual(before, after)
        self.assertEqual([], accepted)
        self.assertIn(
            "ethics_reports_diff prior report keys do not match the pre-fetch cache snapshot",
            forged,
        )
        self.assertIn(
            "ethics_reports_diff requires a pre-fetch cache snapshot",
            missing,
        )

    def test_request_exception_uses_generic_error_contract(self):
        def raise_request_error(*_args, **_kwargs):
            raise RuntimeError("fixture request failure")

        FETCH_DATA.requests.get = raise_request_error

        result = self.fetch_ircc("permanent_residents")

        self.assertEqual(
            {
                "status": "error",
                "error": "fixture request failure",
            },
            result,
        )


if __name__ == "__main__":
    unittest.main()
