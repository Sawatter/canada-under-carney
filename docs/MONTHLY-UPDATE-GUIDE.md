# Monthly Update Guide

> **Read this first.** The canonical monthly process is the [Monthly Cycle Playbook](Monthly-Cycle-Playbook.md). Its section 0, the full-source recertification gate, is mandatory: a monthly cycle cannot close while `npm run source:ledger:check -- docs/Source-Coverage-Ledger-YYYY-MM.md --require-closed` fails. This file used to describe a 30-minute fetch / edit / copy flow that skipped that gate entirely. That flow is retired. What remains below is quick-reference helper material for specific playbook steps.

## What changed

The old guide walked from fetch script to `git push` without the source recertification gate, the grade-review protocol, or the ledger. Following it as written could close a cycle with unrecertified sources. Steps that contradicted the playbook were removed; the table at the bottom says where each one went. The two helpers kept below (the local fetch-script how-to and the history.json snapshot shape) are still accurate, and both sit inside the playbook flow, not instead of it.

## Helper: running the data fetch script locally (playbook section 1)

The playbook's data-review step reads `scripts/output/fetch-report.txt`, normally produced by the `monthly-source-scout` GitHub Actions artifact. To produce the same output locally:

### One-time setup

1. Python 3.9+ installed (`python3 --version`)
2. Node.js 18+ installed (`node --version`)
3. Git installed, repository cloned
4. Run once: `pip3 install -r scripts/requirements.txt`
5. Run once: `npm install`

### Run

```bash
cd canada-under-carney
python3 scripts/fetch-data.py
```

This checks government data endpoints and writes three files to `scripts/output/`:

- `fetch-report.txt` - human-readable summary of which StatCan tables were reachable, which IRCC datasets downloaded, which metrics need manual checking, and the source URL for each data point
- `draft-dimensions.json` - a copy of the current dimension data, useful as an editing scratch file
- `draft-changelog-entry.json` - a changelog-entry template

Treat the output as a scout, not a verdict (playbook section 1): confirm current values on the live source pages before editing dashboard data. Do not copy `draft-dimensions.json` over `src/data/dimensions.json` as a shortcut. Live-data edits go through the playbook's grade review, promise status review, changelog, and meta steps, and the cycle still has to pass the section 0 gate before it closes.

## Helper: history.json snapshot shape

The playbook checklist does not name this step, so it is recorded here. Alongside the changelog and meta edits (playbook sections 5-6), add a per-cycle snapshot at the TOP of `src/data/history.json`:

```json
{
  "month": "YYYY-MM",
  "date": "YYYY-MM-DD",
  "overallGPA": 0.0,
  "pocketbookGPA": 0.0,
  "grades": { "...": "copy current grades by dimension id" },
  "promiseCounts": { "...": "count current promises by status" }
}
```

Read the GPA values and grades from the finished cycle's live data, never from memory. Then run `npm run test:data`.

## Where the old steps live now

| Old guide step | Canonical home |
| --- | --- |
| (was missing) Source recertification | Playbook section 0 - mandatory gate, run first |
| Run fetch script, review report | Playbook section 1 (helper above) |
| Update metric values | Playbook section 1 |
| Grade / trend / status decisions | Playbook section 2 |
| Promise statuses | Playbook section 3 |
| Approval Signal polling | Playbook section 4 |
| Changelog entry | Playbook section 5 |
| meta.json version and dates | Playbook section 6 |
| history.json snapshot | Helper above, alongside playbook sections 5-6 |
| Local preview and build checks | Playbook section 7 |
| Commit and push | Playbook section 8 (plus the pre-push identifier scan in CLAUDE.md) |
| Confirm the live site | Playbook section 9 |
