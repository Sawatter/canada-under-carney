#!/usr/bin/env python3
"""Parse GitHub Actions workflow YAML files.

This intentionally stops at YAML syntax. It is not a GitHub Actions emulator.
"""
from pathlib import Path
import sys

try:
    import yaml
except ImportError:
    print("PyYAML is required. Install with: python3 -m pip install -r scripts/requirements.txt")
    sys.exit(1)


PROJECT_DIR = Path(__file__).resolve().parents[1]
WORKFLOW_DIR = PROJECT_DIR / ".github" / "workflows"


def main():
    workflow_files = sorted(WORKFLOW_DIR.glob("*.yml")) + sorted(WORKFLOW_DIR.glob("*.yaml"))
    if not workflow_files:
        print("No GitHub Actions workflow files found.")
        return 0

    failed = []
    for path in workflow_files:
        rel = path.relative_to(PROJECT_DIR)
        try:
            with path.open("r", encoding="utf-8") as handle:
                yaml.safe_load(handle)
        except yaml.YAMLError as exc:
            failed.append((rel, exc))
            print(f"FAIL {rel}")
            print(exc)
        else:
            print(f"PASS {rel}")

    if failed:
        print()
        print(f"{len(failed)} workflow YAML file(s) failed to parse.")
        return 1

    print(f"all {len(workflow_files)} workflow YAML file(s) parsed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
