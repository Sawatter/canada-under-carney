# Source Evaluation Standard

Three components are required for every source addition or threading decision.

---

## Component 1 — Source identity

Every source must have:
- label: short display name (e.g., "PBO Fiscal Analysis")
- url: exact publication URL — not a category page, not a homepage
- family: one of the 11 defined families (see Source-Architecture-Rules.md)
- role: one of measurement / policy / execution / independent-challenge / context

### URL discipline
Exact publication URLs only for any source that appears in sourceRefs[] or
additionalSources[]. Before accepting a URL:
- Confirm it resolves to a specific report, dataset, article, or index entry
- Reject: category pages (/insights/, /research/immigration/)
- Reject: series index pages (/ipm.asp without a specific issue)
- Reject: organization homepages

A source with only a category-level URL may only go in sources[] as pool
context. It cannot be threaded into metric or trigger chains.

---

## Component 2 — Threading location

Where does this source attach in dimensions.json?

### Option A — Metric threading (v5.61 pattern)
metrics[].sourceRefs[]
Use when the source directly supports the claim made by a specific metric.
Each sourceRef must have: { label: string, url: string }

### Option B — Trigger threading (v5.64 pattern)
gradeTriggers.up[].additionalSources[] or gradeTriggers.down[].additionalSources[]
Use when the source would confirm or contradict a specific trigger condition.
Each additionalSource must have: { label: string, url: string, role: string }

### Pool-only (no threading)
sources[]
Use when the source provides background context but cannot be attached to a
specific metric claim or trigger condition.
Pool-only sources do NOT count as grade-moving evidence.
They are visible to readers but do not affect the audit script's
grade-moving source count.

---

## Component 3 — Role description

Every threading entry (sourceRefs or additionalSources) needs a one-line role
description explaining the cross-source verification it provides.

Good examples:
- "Independent fiscal-impact read on levels correction trajectory"
- "Supply-side builder-confidence ground truth cross-checking CMHC trend"
- "Federal-independent emissions trajectory projection under current policy"

Bad examples (too generic):
- "Additional source"
- "Context"
- "See also"

The role description is what makes the threading auditable. Without it,
a reader cannot tell why this source was attached to this specific claim.

---

## Discipline B — Thread before adding

From docs/Bias-Resistance-Protocol.md:
"Thread existing challenge sources before adding new ones."

Before proposing a new source addition:
1. Check whether the dimension already has an unthreaded source in the same
   family as the proposed addition.
2. If yes: thread the existing source first.
3. Only after existing sources are threaded: evaluate whether a new source
   adds distinct evidence not already in the chain.

Adding a new source when an existing source of the same family is unthreaded
is token-balancing, not evidentiary improvement.
