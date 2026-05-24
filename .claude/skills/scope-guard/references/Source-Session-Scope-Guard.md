# Source Session Scope Guard

## Frozen surfaces

Do not change these without explicit current-turn editor approval:
- GPA formulas and headline rounding in src/utils.js
- grade-point mappings in src/constants.js
- POCKETBOOK_DIMS in src/constants.js
- threshold values in dimensions.json or scoring docs
- modifier rules, effects, and penalty formulas
- dimension model count: 11 graded plus 1 tracker

## Push-time checks

Before any push:
1. Run `(cd "${CLAUDE_SKILL_DIR}/../../.." && npm run test:data)`.
2. Run `git diff --cached --check`.
3. Run the staged personal-identifier scan from CLAUDE.md.
4. Confirm no frozen-surface diff is present without explicit approval.

## Allowed without editor approval

- source URL replacements that do not change thresholds or grades
- source family classifier additions
- documentation-only source methodology notes
- validator warnings for existing structured fields
- tests that lock current frozen behavior

## Stop-and-surface cases

- grade math changes
- threshold changes
- modifier effect changes
- POCKETBOOK_DIMS changes
- adding/removing a dimension
- changing Promise Delivery GPA exclusion
