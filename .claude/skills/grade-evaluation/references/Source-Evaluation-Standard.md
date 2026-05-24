# Source Evaluation Standard

Three components are required for every source addition or threading decision.

---

## Component 1 — Source identity

Every source must have:
- label: short display name (e.g., "PBO Fiscal Analysis")
- url: exact publication URL — not a category page, not a homepage
- family: one of the 11 defined families
- role: one of measurement / policy / execution / independent-challenge / context

### URL discipline
Exact publication URLs only for any source that appears in sourceRefs[] or
additionalSources[]. Before accepting a URL:
- Confirm it resolves to a specific report, dataset, article, or index entry
- Reject: category pages (/insights/, /research/immigration/)
- Reject: series index pages (/ipm.asp without a specific issue)
- Reject: organization homepages

## Component 2 — Threading location

Metric evidence belongs in metrics[].sourceRefs[].
Trigger evidence belongs in gradeTriggers.up/down[].additionalSources[].
Pool context belongs in sources[] only and does not count as grade-moving.

## Component 3 — Role description

Every threading entry needs a one-line role description explaining what
cross-source verification this source provides.
