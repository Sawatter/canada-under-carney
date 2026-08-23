---
name: monthly-cycle
description: |
  Use this skill for the monthly update workflow on the Canada Under Carney
  dashboard. Triggers on: "monthly update", "run the cycle", "June cycle",
  "start the monthly pass", "update the dashboard for this month",
  "run the source fetch", "monthly source refresh".
when_to_use: |
  Any request to run or plan a monthly dashboard update cycle, including
  source fetching, trigger evaluation, grade review, source-to-trigger audit,
  bias-resistance audit, and changelog entry. Also triggers when asked to
  prepare for a cycle, check what the cycle requires, or run the first-day
  source scout.
allowed-tools: Read Grep Glob Bash
context: fork
---

# Monthly Cycle

## What this skill does
Runs the end-to-end monthly update workflow. Each step has a named output.
The cycle does not end until all steps are documented in the cycle ledger.

## Pre-cycle checklist (from docs/Bias-Resistance-Protocol.md)
Before starting any data work:
- [ ] Source band check: run audit script, note current flagged-dimension count
- [ ] Link-rot scan: `(cd "${CLAUDE_SKILL_DIR}/../../.." && python3 scripts/fetch-data.py --link-rot)`
- [ ] Source-to-trigger carry-forwards from prior cycle reviewed
- [ ] Viewport-check rule noted: any UI commit needs desktop + phone check

## Step 1: Fetch fresh data
The regular cycle starts on the first day of each month and covers the prior
calendar month's available data. Use the GitHub Actions monthly-source-scout
artifact when it exists; otherwise run the scout locally.

```bash
(cd "${CLAUDE_SKILL_DIR}/../../.." && python3 scripts/fetch-data.py)
```
Record in cycle ledger: fetch date, any 404s found, any sources that changed.

## Step 2: Source-to-trigger evaluation
For each of the 11 graded dimensions, record one line:
- trigger fired → grade move (cite source)
- trigger considered, not fired (one-line rationale)
- trigger source not checked this cycle (deferral reason)

This is the discipline from docs/Source-To-Trigger-Audit-2026-05.md.
Do not skip. A cycle without this record cannot claim evidence drove grades.

## Step 3: Grade review
For each dimension where a trigger was evaluated:
- Check gradeBasis.bandCriterion against current evidence
- Check modifier rules (External Constraint, Timing Fairness, etc.)
- If grade moves: apply party-symmetry check from docs/Bias-Resistance-Protocol.md
  "Would the same evidence produce the same grade under a different governing party?"

Grade changes require explicit editor approval. Do not change a grade
autonomously.

## Step 4: Source additions or threading (if any)
If new sources are needed, invoke the source-addition skill discipline:
- Classify by family
- Apply Discipline B: thread existing before adding new
- Confirm exact publication URLs
- Stay within source band ceiling

## Step 5: Bias-resistance audit
```bash
node "${CLAUDE_SKILL_DIR}/../../../scripts/audit-bias-resistance.mjs"
```
Compare flagged-dimension count to prior cycle baseline.
Document any new flags with finding category:
real risk / documented convention / data hygiene / script artifact

## Step 6: Build and verify
```bash
(cd "${CLAUDE_SKILL_DIR}/../../.." && npm run test:data)
(cd "${CLAUDE_SKILL_DIR}/../../.." && npm run build)
```
Browser check at desktop 1280px and phone 390px.
Name the view, viewport, and what was checked.

## Step 7: Changelog and version bump
- Bump meta.json version and lastUpdated
- Add changelog entry at top of src/data/changelog.json
- Changelog entry shape per CLAUDE.md

## Step 8: Scope-guard check
Before any push, invoke /scope-guard explicitly.

## Reference file
- See references/Cycle-Integration-Rules.md for the full cycle integration
  rules and ledger format
