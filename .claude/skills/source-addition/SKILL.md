---
name: source-addition
description: |
  Use this skill when asked to add a new source to any dimension of the Canada
  Under Carney dashboard. Triggers on: "add a source", "new source", "add
  Component 1", "add Component 2", "add Component 3", "thread this source",
  "add this URL to the dimension", "add independent challenge".
when_to_use: |
  Any request to add, propose, or evaluate a new source for a dimension's
  sources[] array, sourceRefs[], or additionalSources[]. Also triggers when
  a source is described by family role (watchdog, policy institute, industry
  association) and the request is to add it to a specific dimension.
allowed-tools: Read Grep Glob Bash
---

# Source Addition

## What this skill does
Guides the correct addition of a new source to a dashboard dimension using
the three-component standard. Prevents pool-only additions, generic URL
additions, and ceiling violations.

## Rules before starting
1. Check the source band ceiling. Run:
   ```bash
   node "${CLAUDE_SKILL_DIR}/../../../scripts/audit-bias-resistance.mjs"
   ```
   Any dimension at 10 sources requires a trim-before-add decision.
   Do not add to a dimension at ceiling without explicit editor approval.

2. Read docs/Source-Authority-Map.md. Classify the proposed source by family
   before doing anything else.

3. Apply Discipline B from docs/Bias-Resistance-Protocol.md:
   "Thread existing challenge sources before adding new ones."
   If the dimension already has an unthreaded source in the same family as the
   proposed addition, thread the existing source first instead of adding new.

## Three-component standard

Every source addition requires all three components:

### Component 1: Source identity
- label: short display name (e.g., "PBO Fiscal Analysis")
- url: exact publication URL, not a category page or homepage
- family: one of the 11 defined families in Source-Authority-Map.md
- role: one of measurement / policy / execution / independent-challenge / context

### Component 2: Threading location
Where does this source attach in dimensions.json?
- Option A: metrics[].sourceRefs[], attach to the specific metric whose
  claim this source supports
- Option B: gradeTriggers.up/down[].additionalSources[], attach to the
  specific trigger this source would confirm or contradict

A source that cannot be attached to a specific metric or trigger belongs in
sources[] as pool context only. Pool-only additions do NOT count as
grade-moving evidence and should be noted as such.

### Component 3: Role description
Every threading entry needs a one-line role description explaining what
cross-source verification this source provides.
Example: "Independent fiscal-impact read on levels correction trajectory"

## URL discipline
Exact publication URLs only for threaded sources. Before adding:
- Confirm the URL resolves to a specific report, dataset, or article
- Not a category page (e.g., /insights/, /research/immigration/)
- Not a series index page (e.g., /ipm.asp)
- Not an organization homepage

If no exact publication URL exists, the source may only go in sources[] as
pool context, not into metric or trigger chains.

## After adding
Run:
```bash
(cd "${CLAUDE_SKILL_DIR}/../../.." && npm run test:data)
node "${CLAUDE_SKILL_DIR}/../../../scripts/audit-bias-resistance.mjs"
```
Report: source-band warnings, flagged-dimension count vs prior baseline.
Confirm no new errors.

## Reference files
- See references/Source-Evaluation-Standard.md for the full three-component
  standard with examples
- See references/Source-Architecture-Rules.md for family definitions,
  threading patterns, and ceiling rules
