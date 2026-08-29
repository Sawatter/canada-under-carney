#!/usr/bin/env python3
"""Test the dashboard metric contract used by StatCan freshness checks."""

import copy
import importlib.util
import json
import sys
import types
import unittest
from pathlib import Path


SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent
FETCH_DATA_PATH = SCRIPT_DIR / "fetch-data.py"
DIMENSIONS_PATH = REPO_ROOT / "src" / "data" / "dimensions.json"


def load_fetch_data_module():
    """Load the real fetcher without requiring its unused network dependency."""
    module_name = "statcan_metric_contract_fetch_data"
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


def statcan_metric_contract_errors(dimensions):
    """Return contract errors for missing or unusable StatCan metric bindings."""
    errors = []
    vectors = FETCH_DATA.STATCAN_VECTORS
    if not isinstance(vectors, dict) or not vectors:
        return ["STATCAN_VECTORS must define at least one table"]

    for table_name, table in vectors.items():
        pid = table.get("pid") if isinstance(table, dict) else None
        if not isinstance(pid, str) or not pid.strip():
            errors.append(f"StatCan table {table_name!r} has no pid")
            continue

        references = FETCH_DATA.collect_statcan_dashboard_references(dimensions, pid)
        if not references:
            errors.append(
                f"StatCan table {table_name!r} ({pid}) has no matching metric sourceId"
            )
            continue

        unusable_references = []
        for reference in references:
            freshness = FETCH_DATA.statcan_metadata_refresh_flag(
                {"status": "success", "cubeEndDate": "9999-12-31"},
                [reference],
            )
            if (
                not reference.get("periodDate")
                or freshness.get("status") == "no_dashboard_reference_period"
            ):
                unusable_references.append(reference)

        if unusable_references:
            errors.append(
                f"StatCan table {table_name!r} ({pid}) has one or more matching "
                "metrics without a parseable period"
            )

    return errors


class StatCanMetricContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.dimensions = json.loads(DIMENSIONS_PATH.read_text(encoding="utf-8"))
        cls.table_items = list(FETCH_DATA.STATCAN_VECTORS.items())
        if not cls.table_items:
            raise AssertionError("STATCAN_VECTORS must not be empty")

    def test_current_dimensions_bind_every_table_with_a_parseable_period(self):
        errors = statcan_metric_contract_errors(self.dimensions)
        self.assertEqual([], errors, "\n".join(errors))

    def test_trade_binding_uses_principal_partner_table(self):
        table = FETCH_DATA.STATCAN_VECTORS["trade"]
        self.assertEqual("12-10-0011-01", table["pid"])
        self.assertEqual(
            "https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1210001101",
            table["url"],
        )
        references = FETCH_DATA.collect_statcan_dashboard_references(
            self.dimensions, table["pid"]
        )
        self.assertEqual(2, len(references))

    def test_missing_source_id_binding_fails(self):
        table_name, table = self.table_items[0]
        pid = table["pid"]
        fixture = copy.deepcopy(self.dimensions)
        removed = 0
        for dimension in fixture:
            for metric in dimension.get("metrics") or []:
                if metric.get("sourceId") == pid:
                    metric["sourceId"] = "fixture-missing-statcan-binding"
                    removed += 1

        self.assertGreater(removed, 0, f"positive fixture has no binding for {pid}")
        errors = statcan_metric_contract_errors(fixture)
        self.assertIn(
            f"StatCan table {table_name!r} ({pid}) has no matching metric sourceId",
            errors,
        )

    def test_unparseable_period_fails(self):
        table_name, table = self.table_items[0]
        pid = table["pid"]
        fixture = copy.deepcopy(self.dimensions)
        changed = 0
        for dimension in fixture:
            for metric in dimension.get("metrics") or []:
                if metric.get("sourceId") != pid:
                    continue
                metric["label"] = "Current StatCan observation"
                metric["value"] = "Current value"
                metric["sourceNote"] = "Current table result"
                changed += 1

        self.assertGreater(changed, 0, f"positive fixture has no binding for {pid}")
        errors = statcan_metric_contract_errors(fixture)
        self.assertIn(
            f"StatCan table {table_name!r} ({pid}) has one or more matching "
            "metrics without a parseable period",
            errors,
        )

    def test_valid_period_does_not_mask_invalid_period_for_same_table(self):
        production_binding = next(
            (
                (table_name, table, dimension_index, metric_index)
                for table_name, table in self.table_items
                for dimension_index, dimension in enumerate(self.dimensions)
                for metric_index, metric in enumerate(dimension.get("metrics") or [])
                if metric.get("sourceId") == table["pid"]
            ),
            None,
        )
        self.assertIsNotNone(
            production_binding,
            "positive fixture has no production StatCan metric binding",
        )
        table_name, table, dimension_index, metric_index = production_binding
        pid = table["pid"]
        fixture = copy.deepcopy(self.dimensions)
        fixture_metrics = fixture[dimension_index]["metrics"]
        invalid_metric = copy.deepcopy(fixture_metrics[metric_index])
        invalid_metric["label"] = "Current StatCan observation"
        invalid_metric["value"] = "Current value"
        invalid_metric["sourceNote"] = "Current table result"
        fixture_metrics.append(invalid_metric)

        references = FETCH_DATA.collect_statcan_dashboard_references(fixture, pid)
        valid_references = [
            reference for reference in references if reference.get("periodDate")
        ]
        invalid_references = [
            reference for reference in references if not reference.get("periodDate")
        ]
        self.assertGreaterEqual(len(valid_references), 1)
        self.assertEqual(1, len(invalid_references))

        errors = statcan_metric_contract_errors(fixture)
        self.assertIn(
            f"StatCan table {table_name!r} ({pid}) has one or more matching "
            "metrics without a parseable period",
            errors,
        )


if __name__ == "__main__":
    unittest.main()
