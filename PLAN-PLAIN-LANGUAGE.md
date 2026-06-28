# Plan: Plain-language pass across the Canada Under Carney scorecard copy
_Locked via grill — by Claude + Chris. Revised after round 1 of cross-model adversarial review (Comet, standing in for Codex which is out of usage)._

## Current baseline for this spec
Phase 2B is complete and live as v5.138. Source freshness cues now appear inside the existing dimension drawer Sources flow: the Sources affordance shows the newest dated source, and the expanded Sources section explains that the source table is newest-first.

The plain-language pass therefore includes those new strings. The pass should review them for clarity, but must keep source count, freshness, and citation access together in the existing Sources area.

## Goal
Make every reader-facing string on the dashboard understandable at roughly grade 9 (up to grade 10 where a precise term is genuinely load-bearing), without changing any grade, number, threshold, date, or methodology rule. The trigger: readers (and the editor) opening dimension drawers and hitting internal jargon ("up-trigger fired on a B-5yr reading," "split-shadow watch," "fiscal anchors," "primary-homed in") that raises more questions than it answers. Every dimension must read sensibly top-to-bottom when opened.

## Output required from implementation
1. Rewritten dimension copy proposals for all 12 dimensions, with original-to-rewrite tables.
2. A calibration pack for Major Projects and Defence & Trade before scaling.
3. A rendered-order map that shows where each edited field appears in the open drawer.
4. Component-copy proposals for ScoreboardHeader, ScoreDerivation, ApprovalSignal, and shared DimensionCard labels.
5. Promise Delivery tracker-label proposal for the rendered pill only, without renaming `informationalGrade`.
6. Rubric-tab copy proposals.
7. About-tab copy proposals.
8. Shared phrase normalization notes for recurring terms.
9. Sources affordance freshness cue review.
10. Expanded Sources section freshness and table-order helper text review.

## Approach
1. **Map fields to rendered sections first.** Before any rewrite, read `DimensionCard.jsx` and write down (a) which `dimensions.json` field renders in which on-screen section, and (b) the top-to-bottom rendered section order. Both the flow review and the acronym rule depend on the RENDERED order, not the JSON field order. (addresses round-1 flaw 4)
2. **Calibrate the style on TWO dimensions, not one.** (a) **Major Projects** — densest jargon. (b) **Defence & Trade** — the hardest precision case: it embeds workflow-state assertions in frozen-surface fields ("the up-trigger fired on a B-5yr reading"; the "split-shadow watch ... tripwire promotes the dimension to a split scorecard" sentence, whose three facts — divergence is tracked, this is cycle 1, it splits if it persists — are all load-bearing). These two establish the rules for embedded workflow-state language and load-bearing methodological sentences, which Major Projects alone does not exercise. The calibration pack must contain FULL rewritten examples of the Defence hard cases (the split-shadow sentence and the embedded-state plusMinusRationale), not just a note that Defence is included. Editor reviews both line-by-line and locks the style. (flaws 3, 5; round-2 refinement)
3. **Scale via a workflow** that rewrites each remaining dimension in parallel and PRE-SCREENS each rewrite against the precision rule. The pre-screen reduces what reaches the editor; it is NOT a guarantee. Output is proposals, not commits.
4. **Editor reviews EVERY dimension fully** as original→rewrite tables. This line-by-line review is the ONLY real precision gate. (flaw 8)
5. **Order:** 12 dimensions → components (ScoreboardHeader, ScoreDerivation, ApprovalSignal, and the hardcoded reader-facing strings in `DimensionCard.jsx`: the "derivative" tracker note, "Where judgment enters:", "{band} means:", "How this file is scored", section/tag labels, source freshness labels, and source helper text) → Rubric tab → About tab. (flaw 2)
6. **Flow check against the RENDERED drawer, not the JSON.** For each dimension, open the actual rendered drawer in the preview and read it top-to-bottom in screen order; fix any flow stumble (section out of order, term used before it is explained, missing bridge), keeping the current v5.138 drawer order. (flaw 4)
7. **Review new source-freshness copy in the drawer affordance and Sources section.** Preserve the cue that freshness means the most recently dated cited source, not the most important source and not the most recently added source. Preserve the helper text that the full source table is newest-first.
8. **Shared-phrasing normalization pass** after all dimension batches: a bounded sweep of recurring terms and glosses (how "modifier", SAAR, "the editor's judgment", and similar repeated phrases are worded) so the same phrase reads the same across dimensions. Recurring terms only, not a full re-review. (round-2 new issue)
9. **Verify each batch:** `npm run test:data` (STRUCTURAL only — schema, required fields, GPA math, trigger format, frozen-surface invariants; it does NOT and cannot check whether prose preserved meaning), `npm run build`, browser spot-check at desktop + 375px. These are necessary, not sufficient. The editor's review is the precision gate. (flaw 8)

## Key decisions & tradeoffs
- **Target is a comprehension test, not a metric.** "A smart 15-year-old understands it on one read without stopping to ask what a word means" — about grade 9, up to 10 where a term is load-bearing. Flesch-Kincaid is a spot-check guide, not a gate to optimize to.
- **Precision is non-negotiable; plainness comes from GLOSSING, never replacing.** Keep the exact term, number, threshold, and rule; add a short plain gloss. Acceptance test (operational): a neutral reader infers the SAME actor, action, condition, threshold direction, time frame, and uncertainty level from the rewrite as from the original. (round-2 refinement)
- **Protected terms-of-art are frozen, equal to numbers.** Qualitative terms that carry an operational or methodological meaning beyond plain English are never swapped for looser synonyms: "stages" (the MPO stage-gate sequence), "material" (significant enough to change a decision), "partly" (the C+/C boundary word in immigration), "durable", "execution-ready", "binding delivery", and any boundary word that separates one grade band from the next. Build the explicit protected-terms list from the threshold criteria before scaling. Catch-all: any rubric-defined term or trigger term that is not obviously plain English is protected by default, unless the editor overrides. (flaw 6; round-2 refinement)
- **Paired / contrastive constructs are rewritten together, never split.** E.g. "data-gated, not judgment-gated" (economic-policy) — the contrast is the meaning; both halves appear or neither. (flaw 9)
- **Cross-dimension reference sentences** may be reworded but must preserve (a) the boundary direction ("this grade does not cover X; X is covered in Y"), (b) the exact dimension NAME a reader uses to navigate there, and (c) the reason for the split if one is given. A navigation signal ("see Carbon Pricing Policy") is not the same as "we kept it separate." (flaw 10)
- **Acronyms expand on first use WITHIN EACH independently-openable section**, not just once per drawer — because panels open in any order, a reader who opens the threshold panel first must still get the expansion there. Panel-level self-containment, established against the rendered order from step 1. "Output-Based Pricing System (OBPS)" etc.; universal ones (NATO, GDP, U.S., AI) stay bare. (flaw 1)
- **Batch by dimension**; editor reviews every dimension fully; flow is verify-and-tune the v5.121 order.
- The Comet inventory is a **draft of claims to verify, not final copy** (it had false positives, and several of its own rewrites reintroduced banned em dashes). Every rewrite is scrubbed against the live data.
- A workflow generates + pre-screens the rewrites; this is distinct from the cross-model PLAN review (which is what this log records).

## Hard constraints
- Keep source count, freshness, and citation access together in the existing Sources area.
- Do not introduce a standalone source ledger, freshness rail, or new source module as part of this pass.
- Do not imply source freshness changes scores automatically. Source scans, dated citations, and editor-reviewed score changes remain separate concepts.
- Preserve the new source-freshness affordance and newest-first table-order cue unless the editor explicitly approves replacement copy with the same meaning.

## Structured rewrite inventory additions

### Shared source freshness copy
- **Location:** Dimension drawer -> Sources affordance.
- **Current text pattern from v5.138:** `Sources`; `{sources.length} cited`; `newest source: {formatSourceDate(newestDatedSource)}`. Fallback when no dated source exists: `date review pending`.
- **Review goal:** Make sure the cue is plain-language and clearly means "most recently dated cited source," not "most important source" or "most recently added source."
- **Frozen surface:** No, but wording must not change counts, dates, source ordering, or scoring meaning.

### Expanded Sources section helper text
- **Location:** Dimension drawer -> expanded Sources section.
- **Current text pattern from v5.138:** disclosure summary `{sources.length} total · newest source: {formatSourceDate(newestDatedSource)}`; helper row `{sources.length} cited source(s)`; `Newest dated source: {formatSourceDate(newestDatedSource)}`; `Full source table is newest-first.`
- **Review goal:** Confirm "newest source," "newest dated source," and "newest-first" are plain, explicit, and consistent with each other.
- **Frozen surface:** No, but the rewrite must keep the source count, date, and newest-first table-order meaning.

## QA acceptance additions
- The Sources affordance freshness cue has been reviewed for plain language.
- The Sources section order/freshness helper text has been reviewed for plain language.
- Freshness wording does not imply score changes happen automatically.
- The v5.138 source-freshness cue remains inside the existing Sources area rather than moving to a separate source ledger or freshness module.

## Risks / open questions
- **Editorial item (b) — IN scope; exact label decided on the rendered pill.** Relabel Promise Delivery's "informational" indicator. Round-1 review lands on "ungraded" as cleaner, but flags a real nuance: the pill shows a letter-like indicator ("C+") beside the word, so "C+ ungraded" can read as self-contradictory and "ungraded" can imply "not scored YET." Final wording is a calibration call made on the rendered pill. Once chosen, that single label is applied consistently everywhere the status appears. (round-2 new issue) Touches BOTH render sites in `DimensionCard.jsx` (collapsed card + expanded drawer); the JSON field name `informationalGrade` is NOT renamed (would break the `isTracker` logic and the download blob). (flaws 7, open-q b)
- **Editorial item (a) — OUT (deferred to the monthly cycle).** The stale Defence up-trigger ("3.5% defence target gets a funded pathway", which already fired) is a trigger/data decision, not wording. BUT the prose that references it (the plusMinusRationale "the trigger fired" language) IS in scope and must, in plain words, preserve that the trigger fired and is now stale — handled in the Defence calibration case (step 2b).
- **Meaning-drift is the core risk.** Mitigated by the acceptance test + the protected-terms list + the paired-construct rule + full editor review + structural `test:data`. Still the thing most likely to slip.
- **Embedded workflow-state language** (Defence) is the trickiest pattern; calibration case 2b establishes the rule before scaling.

## Out of scope
- No change to any grade, grade-point value, threshold value, number, date, GPA math, modifier rule, `POCKETBOOK_DIMS`, or the dimension model (frozen surfaces).
- No rename of the `informationalGrade` data field (display label only).
- No redesign of the current v5.138 drawer information architecture / section order (verify-and-tune only).
- No standalone source ledger or freshness module.
- The stale-trigger data fix (flagged, deferred to the cycle).
- The dashboard rename (already settled: keep "Canada Under Carney" + the v5.130 clarifier).
- "Full Policy Audit" product name (grandfathered per CLAUDE.md).
