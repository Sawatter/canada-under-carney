#!/usr/bin/env python3
"""
Canada Under Carney — Monthly Data Fetch Script

Pulls fresh data from government APIs (Statistics Canada, IRCC, Bank of Canada)
and generates a draft update for human review.

Usage:
    python scripts/fetch-data.py

Outputs (in scripts/output/):
    draft-dimensions.json   — current dimensions with auto-updated metric values
    fetch-report.txt        — human-readable summary of what changed
"""

import json
import os
import sys
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
    "temp_residents_work": {
        "url": "https://www.ircc.canada.ca/opendata-donneesouvertes/data/ODP-TFWP-IMP-WorkPermitHolders.csv",
        "description": "Temporary foreign worker permit holders, monthly",
    },
    "temp_residents_study": {
        "url": "https://www.ircc.canada.ca/opendata-donneesouvertes/data/ODP-StudyPermitHolders.csv",
        "description": "Study permit holders, monthly",
    },
}

# --- Bank of Canada Valet API ---
BOC_BASE = "https://www.bankofcanada.ca/valet/observations"


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


def load_dimensions():
    """Load current dimensions.json."""
    with open(DIMENSIONS_FILE, "r") as f:
        return json.load(f)


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

    # Dimension-by-dimension metric status
    lines.append("=" * 60)
    lines.append("  METRIC STATUS BY DIMENSION")
    lines.append("=" * 60)
    lines.append("")

    for dim in dimensions:
        lines.append(f"[{dim['id']}] {dim['name']} — Grade: {dim['grade']}")
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
    lines.append("  - Polling data (check Angus Reid, Leger, Nanos)")
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
        "month": date.today().strftime("%Y-%m"),
        "date": date.today().isoformat(),
        "summary": f"{date.today().strftime('%B %Y')} update: [DESCRIBE CHANGES HERE]",
        "changes": [
            {
                "type": "metric_update",
                "metric": "[METRIC NAME]",
                "from": "[OLD VALUE]",
                "to": "[NEW VALUE]",
                "reason": "[SOURCE AND DATE]",
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
