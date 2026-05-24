---
name: scope-guard
description: |
  Frozen-surface integrity check for the Canada Under Carney dashboard.
  Run explicitly before any push via /scope-guard. Verifies that GPA formulas,
  grade-point mappings, POCKETBOOK_DIMS, threshold values, and modifier rules
  have not changed without explicit editor approval.
when_to_use: |
  Run explicitly before every git push. Not auto-invoked. Use /scope-guard.
allowed-tools: Bash
disable-model-invocation: true
---

# Scope Guard

## What this skill does
Runs a frozen-surface integrity check before push. Catches accidental changes
to grade math, GPA weights, threshold values, and dimension model structure.

## Run the check

```bash
bash "${CLAUDE_SKILL_DIR}/scripts/scope-check.sh"
```

## What must pass

- `npm run test:data` exits 0.
- Dimension count remains 12.
- Graded dimension count remains 11.
- Tracker count remains 1.
- Promise Delivery remains excluded from GPA.
- Frozen code/data lines are not changed unless the current turn has explicit editor approval.
- Staged diff has no whitespace errors.
- Staged personal-identifier scan has no unreviewed matches.

## If the check fails

Stop before pushing. Report:
- which frozen surface changed
- whether the current turn includes explicit editor approval
- which command failed
- the smallest safe follow-up

Do not auto-revert user work.
