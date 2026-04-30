# Bias & Threshold Audit — April 2026

Purpose: capture the first post-beta methodology pass on bias, threshold clarity, and inspectability. This memo summarizes what was changed after the first external feedback that the dashboard had "tons of bias baked into it" and insufficient definition on measures and thresholds.

Status: full first hardening pass shipped in product and docs. Further external review still wanted.

## What shipped in this pass

### 1. Carbon Pricing now surfaces the effective industrial price

- Added `Industrial OBPS (effective market price): ~$20/tonne` beside the headline schedule.
- Reworded public-facing copy to reduce value-laden framing around the consumer levy removal.
- Added an in-card scoring drawer that explains the file grades the pricing instrument only, not the wider climate framework.

Why this matters: the old card showed the $95/t headline schedule but hid the live price signal that actually drives the grade.

### 2. Economic Policy now separates response from inherited baseline

- Split metrics into `Response metrics` and `Inherited baseline / context only`.
- Restored visible surface tags for `Mostly inherited baseline` and `Long-lag file`.
- Added an explicit timing-rule note showing that the long-lag treatment expires on March 14, 2027.

Why this matters: the old card risked reading like a verdict on inherited GDP-per-capita weakness rather than on the government's response to it.

### 3. Ethics construct is now officeholder-generic rather than Carney-specific

- Rewrote the construct from "his background" language to "the sitting PM has a financial and professional background that creates non-routine disclosure requirements."
- Replaced the old downgrade trigger wording tied to "Democracy Watch level" with a rule that requires either an official adverse finding or two independent governance critiques citing a material gap.

Why this matters: the old construct undercut the framework's portability claim and made one advocacy organization feel load-bearing.

### 4. All dimensions now have visible scoring drawers

Each drawer now exposes:
- construct
- confidence / attribution / lag
- threshold ladder
- one-notch move triggers
- scope note
- guardrails
- timing-rule note where relevant

Why this matters: internal methodology was richer than public inspectability. The drawer now closes that gap across the dashboard rather than only on a three-file pilot.

### 5. Threshold language was tightened in the canonical scoring sheets and top-level rubric

Updates shipped across all dimensions, with the biggest threshold rewrites on Economic Policy Response, Carbon Pricing Policy, Ethics & Transparency, Housing Supply, Immigration, Climate & Environment, Fiscal Health, Major Projects, and Defence & Trade.

The ladders are still editorial at the margin, but substantially more mechanical than the prior `credible`, `meaningful`, `questioned`, `coherent` style wording.

## What remains open

### A. Economic Policy still needs a cleaner permitting/execution series

The file now carries business-investment, tax-competitiveness, internal-trade, regulatory, and permitting-adjacent checks. The remaining question is narrower: can the dashboard eventually point to a cleaner dedicated federal permitting/execution series rather than using national-interest-designation use as a proxy?

This is the strongest remaining "bias baked in" risk in the audited set.

### B. Ethics still needs a published PM-specific commissioner review

The live stack now includes both Democracy Watch and the House ETHI committee report, so the single-advocacy-source problem is no longer the main gap. The main remaining weakness is that there is still no published PM-specific Ethics Commissioner review.

### C. No independent inter-rater test has been run yet

The dashboard still discloses that external inter-rater reliability has not been tested. The scoring drawer improves inspectability, but it does not substitute for a second reader actually applying the rubric independently.

## Questions for external review

These are the main questions to hand to a reviewer such as Claude:

1. Do the new threshold ladders feel materially more reproducible, or are they still too editor-dependent?
2. Does the new scoring drawer expose the right fields, or is there still hidden logic that a reader cannot inspect?
3. Is Economic Policy now broad enough on tax/regulatory/trade levers, or is the permitting proxy still too thin?
4. Does the revised Ethics stack now feel adequately supported, or is the lack of a commissioner-published review still doing too much work?
5. Are there any remaining phrases in the public copy that read as value judgments instead of method statements?

## Post-review notes

After an external review of this memo and the shipped UI pass:

- Confirmed that the audited dimensions do have populated `tags`, so the scoring drawer's confidence / attribution / lag pills render as intended.
- Added one-notch move triggers into the scoring drawer so readers no longer need to jump between the drawer and the lower card sections to answer "what would change this grade?"
- Generalized the scoring drawer across the rest of the dashboard and tightened the top-level rubric language.
- Added Economic Policy breadth checks for tax, trade, regulatory, and permitting-adjacent levers.
- Added the House ETHI report into the live Ethics challenge stack.

## Suggested next pass

1. Add a cleaner dedicated permitting/execution series to Economic Policy if one becomes available.
2. Seek a published PM-specific Ethics Commissioner review or equivalent formal release.
3. Run the 3-dimension inter-rater pilot described in `docs/Inter-Rater-Reliability-Protocol.md`, then expand to the wider dashboard.
4. Keep tightening any remaining public-facing phrasing that still reads more like editorial verdict than method statement.
