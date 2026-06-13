# monitoring/

Durable state for the monthly source monitor. This directory is committed (unlike
`tmp/`, which is gitignored and not durable in GitHub Actions).

The monitor surveys each cited source surface for new dimension-relevant material,
classifies what it finds, and writes an editor-adjudicated candidate packet. It never
moves a grade, threshold, status, or any dashboard data. Every surfaced item is a
candidate for the editor to look at, not a change.

## Files

- `sources.json` — the source registry (watch list). Generated from
  `src/data/dimensions.json` + `src/data/approval-polls.json` by
  `python3 scripts/monitor_sources.py --rebuild-registry`. Hand-editable. Each entry
  records the publisher, home URL, source family, the dimension ids it feeds, the
  monitoring method, and any known access issue.
- `state.json` — per-source runtime state: last checked, last successful check,
  content hash / etag / last-modified where available, last surfaced candidate id,
  and any access issue. `lastSuccessfulCheck` is only advanced when a fetch succeeds.
- `ethics-reports.json` — the Ethics Commissioner investigation-report diff cache,
  migrated here from `tmp/`. `scripts/fetch-data.py` reads and rewrites it each run.
- `candidates/YYYY-MM.json` — the structured candidate ledger for a cycle.

The editor-readable packet for a cycle lives at
`docs/Source-Monitoring-Candidates-YYYY-MM.md`.

See `docs/Source-Monitoring-System.md` for the full architecture, how to run it
locally (including a no-secrets dry-run), and what stays manual.
