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

---

## Recently Completed

- Per-Dimension Source Authority Map — built across all 11 graded dimensions, full review complete, integrated 2026-04-18. See [docs/Source-Authority-Map.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Source-Authority-Map.md).

---

## Now

These are the highest-leverage next tasks for the live product.

1. Live review pass
   Review the live dashboard with fresh eyes after the source hardening / confidence pass:
   - main cards
   - compare view
   - methodology tab
   - any wording that still feels off to a skeptical reader

---

## Next

These should happen after the immediate product cleanup.

1. QA gatekeeping review pass
   Run a narrow reflection + review on [docs/QA-Gatekeeping-Rules.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/QA-Gatekeeping-Rules.md) to check whether it still fits the dashboard as it exists now:
   - current scoring workflow
   - confidence calibration
   - source-role discipline
   - probationary dimensions
   Reference the verbatim QA note in [Parking-Lot.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Parking-Lot.md) so the reasoning is preserved exactly.

2. Ethics anchored indicator
   Add at least one semi-quantitative anchor if possible, such as:
   - disclosure completeness score
   - Ethics Commissioner action/recommendation tracking

3. Next-cycle readiness pass
   Focus on operational discipline, not redesign:
   - Economic Policy Response: no movement on announcements alone
   - Affordability Response: scope boundary holds
   - Carbon Pricing / Climate: deconfliction holds
   - Housing Supply: announced != started != completed
   - Major Projects: credit-claiming penalty remains explicit

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
