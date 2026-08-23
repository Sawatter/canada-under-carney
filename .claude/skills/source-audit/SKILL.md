---
name: source-audit
description: |
  Use this skill when asked to audit existing sources on any dimension of the
  Canada Under Carney dashboard. Triggers on: "audit sources", "check source
  compliance", "run source audit", "are sources threaded correctly", "check
  source families", "verify threading", "source health check".
when_to_use: |
  Any request to review whether existing sources follow the three-component
  standard, check source family distribution, verify threading into metric
  sourceRefs or trigger additionalSources, or run the bias-resistance audit
  script against current dimensions.json.
allowed-tools: Read Grep Glob Bash
---

# Source Audit

## What this skill does
Audits existing sources on one or more dashboard dimensions against the
three-component standard and threading discipline. Produces a finding per
source: compliant, needs threading, wrong family, or flagged for removal.

## Rules before starting
1. Read docs/Source-Authority-Map.md to confirm current family definitions.
2. Read docs/Bias-Resistance-Protocol.md for the threading-first discipline:
   thread existing challenge sources before adding new ones.
3. Read docs/Source-To-Trigger-Followup-2026-05-23.md for the exact-source
   URL discipline: no category pages, no homepages in additionalSources or
   sourceRefs.

## Audit procedure

### Step 1: Run the script
```bash
node "${CLAUDE_SKILL_DIR}/../../../scripts/audit-bias-resistance.mjs"
```
Report: dimensions audited, dimensions flagged, per-dimension family
distribution changes vs prior baseline (6 flagged as of v5.66).

### Step 2: Manual threading check
For each dimension in scope, verify each source in sources[] appears in at
least one of:
- metrics[].sourceRefs[] (v5.61 pattern)
- gradeTriggers.up/down[].additionalSources[] (v5.64 pattern)

If a source is pool-only with no threading, flag it as "unthreaded, consider
for next cycle's threading pass under Discipline B."

### Step 3: URL quality check
For every additionalSources and sourceRefs entry, classify the URL as:
- exact publication / report URL (compliant)
- report-family or series URL (borderline, flag)
- category / listing page (non-compliant, flag for replacement)
- organization homepage (non-compliant, flag for replacement)

### Step 4: Report
Return findings grouped by dimension. For each finding:
- source label
- current URL classification
- threading status
- recommended action: compliant / replace URL / thread into chain / remove

## Reference files
- See references/Source-Evaluation-Standard.md for the three-component standard
- See references/Source-Architecture-Rules.md for family definitions and
  threading rules

## Script location
```bash
# Calls the repo-root script in place; no script copy lives inside the skill.
node "${CLAUDE_SKILL_DIR}/../../../scripts/audit-bias-resistance.mjs"
```
