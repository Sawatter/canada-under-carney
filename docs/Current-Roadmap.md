# Current Roadmap

**Purpose:** Keep the next steps explicit so new ideas do not have to live in memory.

**Status:** Active working roadmap for the live dashboard.

**Last updated:** 2026-04-17

---

## Current State

- Inspectability structure is live across the dashboard.
- Ethics & Transparency is normalized to a true whole-letter `C` with GPA `2.0`.
- Flagship Delivery is normalized to a true whole-letter `C` with GPA `2.0`.
- Stale whole-letter scoring references have been cleaned up in current-state docs.
- Cross-dimension drift audit of the 9 non-probationary graded dimensions passed with minor notes.

---

## Now

These are the highest-leverage next tasks for the live product.

1. CompareView consistency pass
   Update the compare surface to use the current inspectability structure instead of the older `rationale || status` path.

2. Methodology panel cleanup
   Reconcile [src/components/Methodology.jsx](/Users/chrissawatsky/Downloads/canada-under-carney/src/components/Methodology.jsx) with the current live model:
   - 11 graded dimensions, not 12
   - Promise Delivery tracked separately
   - whole-letter probation handling explained cleanly

3. Tiny audit-fix pack
   Resolve the small residuals surfaced by the drift audit:
   - Ethics status mismatch in [docs/Dimension-Status-Register.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Dimension-Status-Register.md)
   - clarify `meta.json` `lastUpdated` meaning if needed

4. Live review pass
   Review the live dashboard with fresh eyes after the UI consistency pass:
   - main cards
   - compare view
   - methodology tab
   - any wording that still feels off to a skeptical reader

---

## Next

These should happen after the immediate product cleanup.

1. Source sufficiency audit by dimension
   For each dimension, ask whether the evidence stack is strong enough to justify:
   - the displayed score
   - the displayed confidence
   - the current level of precision

2. Per-dimension source authority map
   After the source sufficiency audit, build a source-role map for each dimension:
   - measurement truth
   - policy truth
   - execution truth
   - independent challenge truth
   - context truth
   Use this to identify what kinds of sources should govern each dimension, then
   build the reflection prompt for a future "source authority by dimension" pass.
   Reference the verbatim note in [Parking-Lot.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Parking-Lot.md) so the full framing is preserved, not just the summary bullets.

3. Ethics anchored indicator
   Add at least one semi-quantitative anchor if possible, such as:
   - disclosure completeness score
   - Ethics Commissioner action/recommendation tracking

4. Next-cycle readiness pass
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
