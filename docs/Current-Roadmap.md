# Current Roadmap

**Purpose:** Keep the next steps explicit so new ideas do not have to live in memory.

**Status:** Active working roadmap for the live dashboard.

**Last updated:** 2026-04-18

---

## Current State

- Inspectability structure is live across the dashboard.
- Ethics & Transparency is normalized to a true whole-letter `C` with GPA `2.0`.
- Flagship Delivery is normalized to a true whole-letter `C` with GPA `2.0`.
- Stale whole-letter scoring references have been cleaned up in current-state docs.
- Cross-dimension drift audit of the 9 non-probationary graded dimensions passed with minor notes.
- Source sufficiency audit across the 11 graded live dimensions is complete.
- The weakest current source stacks are Climate & Environment, Flagship Delivery, and Economic Policy Response.
- Hard rule adopted for source edits: missing URL / source-chain fixes can be added directly, but any new analytical source family must go through a reflection pass and Claude review before it is treated as settled.
- AI workflow efficiency protocol is now adopted to make reflection/review escalation explicit and reduce over-reflection on bounded tasks.
- Source hardening pass for the weakest dimensions is complete.
- Confidence calibration check is complete; no rescore was required after hardening.
- Source Authority Map is active and integrated into the governance layer.
- Tiny audit-fix pack is complete: Ethics is correctly marked as probationary in the register, and `meta.json` now reflects the live package update date.
- QA-Gatekeeping-Rules.md has been amended to cover grade holds with source-stack change, confidence revisits, whole-letter probationary precision, Combination-Rule-driven changes, new analytical source-family additions (new Rule 8), same-family concentration (Rule 6 addition), symmetric confidence revisit (Rule 4 expansion), tier-nuance on government-data vs press-release and advocacy-with-methodology (Rule 1 edge-case notes), and navigation cross-references to SVP, Carry-Forward-Rules, PMDR, Deconfliction-Matrix, and SAM.
- Ethics source chain strengthened — Office of the Ethics Commissioner and PM blind-trust summary statement added to the live Ethics `sources` array as Tier 1 anchors (traceability fix under the new-analytical-source-family hard rule).
- Ethics anchored indicator landed — the live Ethics entry now carries an official-status anchor set (Commissioner review status, blind trust status, agreed measure filing, declared screen scope, independent governance review status) anchored to direct official filings and the Commissioner registry.
- Live review pass of the dashboard is complete; minor copy-staleness in About and the Dashboard footer was corrected in pass.
- SAM Current State Delta fields reconciled for Ethics, Flagship Delivery, and Climate & Environment after source threading landed.
- Pre-cycle readiness guardrails refreshed in the live data for the most failure-prone files: announcement-bias wording tightened in Economic Policy Response, scope/trigger discipline sharpened in Affordability Response, Carbon Pricing / Climate deconfliction cues made more explicit, and Housing stage language now distinguishes announced from not started.
- Independent methods review is complete; methods hold with targeted amendments and no structural defect blocks another full cycle.
- Commitment Traceability Map is active as a governance join layer across 36 commitments in 11 graded dimensions.
- The Major Projects / Flagship Delivery overlap on the MPO two-year-timeline commitment is resolved. Major Projects remains the sole home; Flagship now carries it only as derivative delivery evidence.
- Dimension cards now surface confidence, attribution, and lag directly on-card, reducing the need to leave the scorecard to interpret evidence strength.

---

## Recently Completed

- Per-Dimension Source Authority Map — built across all 11 graded dimensions, full review complete, integrated 2026-04-18. See [docs/Source-Authority-Map.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Source-Authority-Map.md).
- QA-Gatekeeping-Rules.md amendments — Rule 1 edge-case notes, Rule 2 carry-forward cross-reference, Rule 4 symmetric confidence revisit, Rule 5 probationary cross-reference, Rule 6 same-family concentration blocking condition, new Rule 8 for analytical source-family additions, and a Companion References section. See [docs/QA-Gatekeeping-Rules.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/QA-Gatekeeping-Rules.md).
- Ethics source-chain strengthening — Office of the Ethics Commissioner and PM blind-trust summary statement added to the Ethics entry's `sources` array in [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json). No grade, GPA, or confidence change.
- Ethics anchored-indicator build — official-status anchor added to the live Ethics entry in [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json). No grade, GPA, confidence, or rubric change.
- Orphan-threading and SAM reconciliation bundle — C.D. Howe threaded into Flagship Delivery critics perspective; SAM Ethics, Flagship, and Climate Current State Deltas brought current; Carbon Pricing rationale/sourceNote wording consistency confirmed.
- Live review pass — code-level pass over main cards, CompareView, Methodology, ScoreboardHeader, PromiseTracker, WhatsChanged, and About; copy-staleness in About ("12 policy dimensions", Official source list, Independent policy list) and the Dashboard footer source list corrected.
- Pre-cycle readiness guardrail refresh — Economic Policy Response now warns more explicitly against announcement bias, Affordability Response carries a concrete next-trigger, Carbon Pricing / Climate deconfliction cues were tightened, and Housing Supply now labels BCH as announced / not started pending actual construction.
- Commitment Traceability Map — built, pilot-reviewed, full-built, and accepted as a published governance join layer. See [docs/Commitment-Traceability-Map.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Commitment-Traceability-Map.md).
- MPO timeline overlap cleanup — removed the duplicate Flagship Delivery promise so the Major Projects two-year-timeline commitment now has a single primary home, consistent with overlap-prevention discipline.
- Headline GPA display precision reduced from two decimals to one on the live dashboard and README (1.70 → 1.7, 1.49 → 1.5). Underlying math, grade bands, sensitivity analysis, and shadow-log methodology retain full precision; the change is display-only and removes false precision the methodology cannot actually support.
- Card metadata surfacing — live DimensionCards now show confidence, attribution, and lag tags directly on-card using the existing dimension metadata.
- Compare tab removed from the live nav. The feature is now parked as a future analyst tool only if it can justify itself beyond duplicating two expanded cards.

---

## Now

No immediate work pending. The product cleanup loop is caught up. Next items are triggered by the next monthly cycle or by a new explicit methodology decision.

---

## Next

These are on deck awaiting their triggers.

1. Next-cycle readiness pass
   Focus on operational discipline, not redesign:
   - Economic Policy Response: no movement on announcements alone
   - Affordability Response: scope boundary holds
   - Carbon Pricing / Climate: deconfliction holds
   - Housing Supply: announced != started != completed
   - Major Projects: credit-claiming penalty remains explicit
   This item is cycle-triggered — runs when the next monthly update is being assembled.
---

## Later

These are valid, but not active now.

1. Decide whether Flagship Delivery stays on probation after one real cycle.
2. Reassess whether Promise Delivery should remain purely an ungraded tracker.
3. Consider whether the `gpaValue` override mechanism in [src/utils.js](/Users/chrissawatsky/Downloads/canada-under-carney/src/utils.js) should be retired if it has no live use.
4. Revisit the need for small rubric maintenance only if later audits surface repeated failure patterns.

---

## Not Now

Do not reopen these unless a later audit forces it.

- Full rubric rewrite
- v2 architecture redesign
- Defence & Trade full split
- Carbon Pricing / Climate merge
- Promise Delivery redesign
- New governance/process docs unless they solve a concrete active problem
