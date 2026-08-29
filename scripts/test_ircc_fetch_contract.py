#!/usr/bin/env python3
"""Test IRCC file parsing and freshness reporting."""

import importlib.util
import sys
import types
import unittest
from pathlib import Path


SCRIPT_DIR = Path(__file__).resolve().parent
FETCH_DATA_PATH = SCRIPT_DIR / "fetch-data.py"


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


class FakeResponse:
    def __init__(self, text, status_code=200):
        self.text = text
        self.status_code = status_code


class IrccFetchContractTests(unittest.TestCase):
    def setUp(self):
        self.original_get = getattr(FETCH_DATA.requests, "get", None)

    def tearDown(self):
        if self.original_get is None:
            delattr(FETCH_DATA.requests, "get")
        else:
            FETCH_DATA.requests.get = self.original_get

    def set_response(self, text, status_code=200):
        FETCH_DATA.requests.get = lambda *_args, **_kwargs: FakeResponse(
            text, status_code
        )

    def test_unsorted_file_uses_maximum_period(self):
        self.set_response(
            "EN_YEAR\tEN_QUARTER\tEN_MONTH\tTOTAL\n"
            "2026\tQ1\tJan\t10\n"
            "2026\tQ2\tJun\t20\n"
            "2018\tQ3\tJul\t5\n"
        )

        result = FETCH_DATA.fetch_ircc_csv("permanent_residents")

        self.assertEqual("success", result["status"])
        self.assertEqual(3, result["rows"])
        self.assertEqual("2026-06", result["latest_period"])
        self.assertTrue(result["last_row"].startswith("2018\tQ3\tJul"))

    def test_invalid_period_fails_instead_of_reporting_freshness(self):
        self.set_response(
            "EN_YEAR\tEN_QUARTER\tEN_MONTH\tTOTAL\n"
            "2026\tQ2\tJun\t20\n"
            "2026\tQ3\tNotAMonth\t30\n"
        )

        result = FETCH_DATA.fetch_ircc_csv("permanent_residents")

        self.assertEqual("malformed_data", result["status"])
        self.assertEqual("1 row(s) have an invalid period", result["error"])

    def test_missing_period_columns_fails(self):
        self.set_response("YEAR\tMONTH\tTOTAL\n2026\tJun\t20\n")

        result = FETCH_DATA.fetch_ircc_csv("permanent_residents")

        self.assertEqual("malformed_data", result["status"])
        self.assertEqual("missing EN_YEAR or EN_MONTH column", result["error"])

    def test_header_without_data_rows_fails(self):
        self.set_response("EN_YEAR\tEN_MONTH\tTOTAL\n")

        result = FETCH_DATA.fetch_ircc_csv("permanent_residents")

        self.assertEqual("malformed_data", result["status"])
        self.assertEqual("no data rows", result["error"])

    def test_empty_response_fails(self):
        self.set_response("")

        result = FETCH_DATA.fetch_ircc_csv("permanent_residents")

        self.assertEqual("malformed_data", result["status"])
        self.assertEqual("empty response", result["error"])

    def test_http_error_is_not_reported_as_success(self):
        self.set_response("not found", status_code=404)

        result = FETCH_DATA.fetch_ircc_csv("permanent_residents")

        self.assertEqual("http_error", result["status"])
        self.assertEqual(404, result["code"])


if __name__ == "__main__":
    unittest.main()
