# Plan Review Log: Plain-language pass across the scorecard copy
Act 1 (grill) complete — plan locked with the editor. MAX_ROUNDS=5.
Codex was out of usage (resets 2026-06-27 ~21:10); Comet stands in as the cross-model reviewer.

Grill resolved: target (grade 9, up to 10 where load-bearing); precision via glossing not replacing; acronyms expanded first-use per drawer; batch by dimension; full editor review of every dimension; flow = verify-and-tune the v5.121 order; editorial items left as an open question for the reviewer.

## Round 1 — Comet (cross-model, read-only)
VERDICT: REVISE. Ten flaws:
1. Per-drawer acronym "first use" is ambiguous — panels open in any order; a reader can hit a bare acronym before the panel that expands it.
2. Four hardcoded reader-facing strings in DimensionCard.jsx (lines 1894 "derivative", 1884 "Where judgment enters", 1900 "band means", 1912 "How this file is scored") are outside the dimensions.json scope and would survive the pass.
3. Calibrating only on Major Projects misses the hardest precision risk: Defence & Trade plusMinusRationale embeds workflow-state ("up-trigger fired on a B-5yr reading") in a frozen-surface field.
4. "Verify-and-tune the flow" is theater unless the rendered section order is specified — JSON field order != rendered DOM order.
5. The Defence split-shadow / tripwire sentence is the single most confusing string and is load-bearing (tracks divergence, cycle 1, splits if it persists) — not on the jargon list.
6. Several threshold criteria pair numbers with qualitative terms-of-art ("stages", "material", "partly", "durable", "execution-ready", "binding delivery") that a looser synonym would silently widen/narrow.
7. The "informational"->"ungraded" relabel touches two render sites + the download-blob field name; don't rename the data field (breaks isTracker).
8. test:data checks structure only, not prose precision; calling the AI per-rewrite check "adversarial verification" overstates it. The editor review is the real gate.
9. "data-gated / judgment-gated" (economic-policy) is a paired construct; glossing one and dropping the other loses the meaning.
10. Cross-dimension boundary sentences need a rule preserving boundary direction, the navigation name, and the reason for the split.
Open question (b): verdict CHANGE IT to "ungraded" (cleaner signal; "not important" misread of "informational" is the bigger risk).

### Claude's response
Accepted all ten. Refinements logged in PLAN-PLAIN-LANGUAGE.md:
- F1: strengthened to panel-level self-containment (expand on first use within each independently-openable section), established against the rendered order.
- F2/F7: DimensionCard.jsx hardcoded strings added to scope; pill relabel hits both render sites; data field name kept.
- F3/F5: added Defence & Trade as a second calibration case (embedded workflow-state + the split-shadow sentence's three load-bearing facts).
- F4: flow review now done against the rendered drawer in the preview, after mapping fields->sections from DimensionCard.jsx.
- F6: added a protected-terms list (terms-of-art frozen equal to numbers).
- F8: reworded so test:data is explicitly structural-only; the editor review is named the only real precision gate; the workflow check is a pre-screen, not a guarantee.
- F9: paired/contrastive constructs rewritten together or not at all.
- F10: added the cross-dimension reference rule.
Open question (b): kept IN scope but did NOT lock "ungraded" — next to the "C+" indicator it can read as contradictory or as "not scored yet", so the exact wording is a calibration call on the rendered pill. Nothing rejected outright.

## Round 2 — Comet (cross-model, read-only)
VERDICT: REVISE. All 10 round-1 flaws confirmed addressed; 5 and 6 "mostly addressed" with refinements; 3 new issues. (Comet stapled an irrelevant PMO press-release citation to every point — hallucinated padding, ignored.)
- F5: require a FULL rewritten Defence example in the calibration pack, not just inclusion by note.
- F6: add a catch-all — any rubric-defined or trigger term not obviously plain English is protected by default, editor can override.
- New: pick ONE replacement pill label and apply it consistently everywhere the status appears.
- New: add a shared-phrasing normalization pass after the dimension batches (by-dimension batching can leave recurring terms/glosses inconsistent).
- New: operationalize the acceptance test as "same actor, action, condition, threshold direction, time frame, uncertainty level."

### Claude's response
Accepted all five — all genuine tightening, incorporated into PLAN-PLAIN-LANGUAGE.md. Two notes of arbiter judgment: (1) did NOT lock the pill label to "ungraded" (held against Comet's round-1 lean) — it stays a calibration call on the rendered pill, then applied consistently; (2) bounded the shared-phrasing pass to recurring terms only, not a full re-review. Round 2 surfaced only minor refinements (no breaks) — approaching convergence.

## Round 3 — Comet (cross-model, read-only)
VERDICT: APPROVED. All five round-2 changes confirmed genuinely addressed (Defence calibration examples, protected-terms catch-all, operationalized acceptance test, single-label pill rule, shared-phrasing pass). No new material problems.

## Resolution
Converged. Act 1 (grill with the editor) + Act 2 (3 rounds of cross-model adversarial review, Comet standing in for Codex which was out of usage). Awaiting the editor's final sign-off before any code. Build order on sign-off: calibration samples (Major Projects + Defence & Trade) for line-by-line review, then scale.
