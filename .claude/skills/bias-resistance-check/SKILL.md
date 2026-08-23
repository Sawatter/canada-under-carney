---
name: bias-resistance-check
description: |
  Use this skill to run and interpret the bias-resistance audit script against
  the current dimensions.json. Triggers on: "bias check", "run bias audit",
  "check for bias", "audit script", "how many dimensions are flagged",
  "bias-resistance audit", "run the audit script".
when_to_use: |
  Any request to run the audit script, interpret its output, compare flagged
  counts against a prior baseline, or assess whether a new source addition
  changed the family distribution for a dimension.
allowed-tools: Read Bash
---

# Bias-Resistance Check

## What this skill does
Runs the Phase 1 operational bias-resistance audit and interprets the output
against the current baseline and prior findings.

## Run the script
```bash
node "${CLAUDE_SKILL_DIR}/../../../scripts/audit-bias-resistance.mjs"
```

## Interpreting output

Current baseline as of v5.66: 12 dimensions audited, 6 flagged.

The 6 residual flags are pre-existing documented findings, not new problems:
- Carbon Pricing: trigger asymmetry (event-driven convention)
- Immigration: trigger asymmetry and numeric asymmetry
- Housing Supply: press release in grade-moving chain, numeric asymmetry
- Ethics Transparency: down-trigger asymmetry (event-driven convention)
- Flagship Delivery: 80% policy-institute concentration (meta-rollup artifact)
- Promise Delivery: numeric asymmetry (tracker, not graded)

Any count above 6 is a new flag requiring investigation.
Any count below 6 means a prior flag was resolved.

## Finding categories
Per docs/Bias-Resistance-Protocol.md, every flag must be categorized as:
- real risk, requires a shipped fix
- documented convention, honest pattern, surfaced to readers
- data hygiene gap, script domain rules need updating
- script artifact, mechanical rule can't read the methodology-appropriate pattern

## After running
If new flags appear:
1. Read the full flag description
2. Check if it's a new source addition changing family distribution
3. Classify per the four categories above
4. If real risk: propose fix under the source-addition skill discipline

## Script location
```bash
# Calls the repo-root script in place; no script copy lives inside the skill.
node "${CLAUDE_SKILL_DIR}/../../../scripts/audit-bias-resistance.mjs"
# Raw output is gitignored: regenerate on demand
# scripts/output/bias-audit-raw-2026-05.txt
```
