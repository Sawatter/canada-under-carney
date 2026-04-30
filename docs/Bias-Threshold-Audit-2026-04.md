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

## What shipped in the post-third-review build pass (May 1)

After the third reviewer-feedback round, three concrete builds shipped before the May 14 monthly cycle. All three responded to remaining inspectability gaps the scoring drawer alone did not close.

### 1. Headline scores now expose their derivation

Both the Household Impact and Full Policy Audit cards now carry a "How is this score built?" toggle that opens a derivation panel below the scoreboard row. The panel shows: the per-dimension grade, the points (4.0 scale), the weight (×1 or ×2 for pocketbook dims), and the contribution; subtotals for the weighted and unweighted groups; the weighted sum, total weights, and the arithmetic that yields the displayed score and letter grade.

`src/utils.js` was extended with `getOverallDerivation()` and `getPocketbookDerivation()` helpers that produce the per-dim breakdown structure; the existing `calculateOverallGPA` / `calculatePocketbookGPA` were refactored to call into the same builder so the math stays consistent. A new `src/components/ScoreDerivation.jsx` component renders the panel, mirroring the disclosure pattern used by `ApprovalDetail`.

Why this matters: the prior cards showed a letter and a numeric score with no way for a reader to verify the score against the per-dimension grades. The reproducibility critique — same shape as the per-dimension threshold critique resolved earlier in the audit — is now closed at the aggregate level too.

### 2. Major Projects regraded on cohort progress

The Major Projects threshold ladder no longer grades on first-event triggers ("at least one project completes a full MPO cycle"). It now defines the project universe — currently 16 MPO-cohort projects across three tranches (Sept 2025, Nov 2025, Mar 2026) — and grades on % of the cohort that has advanced from `designated` against the new published `stageGates` ladder (designated → reviewed → approved → permitted → under_construction → completed).

A new `projectCohort` field in `dimensions.json` carries the full project list with per-project current stage, stage date, and source URL. The dimension card surfaces a "Project pipeline" section with the headline cohort summary and a collapsible table showing every project sorted by stage. The Source Authority Map's Major Projects entry was updated to mark the project list and stage tracking as live grade-moving fields, with the Sept first tranche, Mar third tranche, and Apr Contrecœur groundbreaking URLs threaded into the live `sources` array.

As of 2026-04-30, 4 of 16 projects (~25%) have advanced ≥1 stage from designated — Contrecœur Terminal under construction since Apr 9 2026; Darlington New Nuclear approved with $3B in committed equity; Mackenzie Valley Highway permitted with construction set for summer 2026; North Coast Transmission Line approved with $139.5M early-works financing. That sits below the 30% threshold required for B; the C grade therefore holds, with the credit-claiming penalty modifier still applied.

Why this matters: the prior threshold ladder hung the entire grade on a single binary trigger and gave the reader no way to ask "how many projects, and what's the score based on?" The new ladder produces a deterministic % readout from a published cohort.

### 3. Confidence / Attribution / Lag glossary in the scoring drawer

The three pills at the top of every dimension's scoring drawer now sit above a "What do these mean?" expandable that reveals one-sentence definitions plus the level cutoffs: Confidence (High = direct measurement against numeric thresholds; Medium = qualitative judgment with mixed evidence; Low = sparse evidence), Attribution (Direct ≥60% federal levers; Mixed 30–60%; Mostly inherited <30%), Lag (Short = monthly/quarterly; Medium = 1–2 year cycles; Long = 5+ year structural).

Why this matters: the pills were governance-internal labels that exposed real metadata to a general reader without any anchor to what the labels meant. The expandable closes the jargon-without-explanation gap without expanding card density by default.

### Common thread

All three builds attack the same underlying critique — that the dashboard's scoring logic was richer internally than what a reader could verify from the live UI. The earlier passes addressed it at the per-dimension threshold level (visible scoring drawer, tighter ladder language); this pass closes it at the headline-score level (derivation panel), at one specific dimension that needed a structural rewrite (Major Projects cohort), and at the metadata-pill level (confidence / attribution / lag glossary).
