# Dimension Inspectability Pilot Spec

- **Purpose:** Implementation-ready spec for redesigning a single pilot dimension card so a serious skeptical reader can inspect the grade against its methodology without opening repo docs.
- **Status:** Draft — frozen for first pilot (Affordability Response). No implementation until acceptance criteria are reviewed.
- **Last updated:** 2026-04-16
- **Depends on:** Scoring-Rubric-v1.1.md, Canonical-Scoring-Sheets.md (Affordability entry), Source-Verification-Protocol.md, DimensionCard.jsx current state, dimensions.json Affordability entry
- **Used by:** Future implementation task (separate thread), pilot acceptance review

---

## 1. Problem Statement

The internal methodology (Scoring-Rubric-v1.1 + Canonical-Scoring-Sheets per dimension) is materially stronger than what the current dimension card exposes. A serious reader can infer grade direction but cannot inspect the grade — specifically, cannot see the scoring object, the threshold band that places this grade, the plus/minus rationale that distinguishes it from the next tier, the active modifiers, the scope boundary, or the actual conditions that would move the grade up or down.

This is a **structural inspectability problem**, not a copywriting problem. Adding more prose to the rationale paragraph will not solve it. The card is missing scoring architecture, not words.

---

## 2. Why the Current Affordability Card Is Not Inspectable Enough

Grounded in the actual state of `dimensions.json` (Affordability entry, lines 523-629) and `DimensionCard.jsx` (lines 82-341):

| # | Pattern | Evidence from current repo |
|---|---|---|
| 1 | Narrative rationale replaces scoring structure | `rationale` field is a 4-sentence paragraph asserting "$307 covers <20%" but never surfaces that "<20% coverage" is the scoring-sheet band definition for D. |
| 2 | `nextTrigger` conveys upcoming data releases, not grade-moving conditions | Current value: "Next monthly CPI release (StatsCan). Dalhousie 2027 food price forecast. Competition Bureau grocery investigation update." Scoring sheet actually defines: "Up: New federal benefit >$500/household... Down: Food CPI exceeds 7%, OR grocery benefit expires without replacement, OR food insecurity exceeds 12M." These are different statements serving different reader needs. |
| 3 | Attribution shown as one prose tag | `tags.attribution` = "Mixed (prices external, policy response direct)". Scoring sheet defines numerically: Federal 60% / Shared 20% / External 20%. Card loses the structure. |
| 4 | Modifier state invisible | Scoring sheet says External Constraint modifier is "currently applicable — tariffs add $1,450-$2,000/yr." Card does not indicate any modifier is active. A reader cannot tell whether the grade reflects the modifier or not. |
| 5 | Deconfliction rule invisible | Scoring sheet: "Consumer carbon tax affordability savings ($410-$680/yr) are context only in this dimension — primary-homed in Carbon Pricing Policy." Card's defenders text mentions "The consumer carbon tax elimination was a real cost reduction" — a reader naturally reads this as supporting the grade, but methodologically it should not. |
| 6 | Scope boundary invisible | Scoring sheet: "Scope boundary: Groceries + tariff-driven cost increases + targeted federal relief. NOT rents, NOT utilities, NOT insurance, NOT transportation." Card never tells readers what is explicitly excluded. |
| 7 | Construct definition absent | Scoring sheet opens with: "The adequacy of the federal government's policy response to household cost pressure from groceries, tariffs, and targeted relief programs." Card has no equivalent top-line statement of what is being graded. |

---

## 3. Reader Jobs-to-Be-Done

A serious reader opening this card should be able to answer these questions from the card alone (without opening repo docs):

| # | Question | Current card answer |
|---|---|---|
| 1 | What is being graded here? | Inferable from rationale; not stated directly |
| 2 | Is this graded on conditions, government action, or both? | Inferable from rationale; not tagged structurally |
| 3 | Which evidence primarily drove this grade? | Partially — metrics shown but not labeled by role |
| 4 | Which evidence is context only, not grade-moving? | Not distinguished |
| 5 | What is the threshold rule that places this grade in this band? | Not shown |
| 6 | Why is this grade plus/minus this tier rather than the next? | Not shown |
| 7 | Are any modifiers currently applied? | Not shown |
| 8 | What is explicitly out of scope? | Not shown |
| 9 | What specific new evidence would move the grade up? | Not shown (only news watch) |
| 10 | What specific new evidence would move the grade down? | Not shown (only news watch) |

The pilot must make questions 1, 2, 4, 5, 6, 7, 8, 9, 10 answerable from the card. Question 3 is partially answered today and can be fully answered with a small data-model addition.

---

## 4. Card vs Methodology Boundary

**Card layer:** Shows the scoring basis for *this* grade. Specific to this dimension, this cycle, this evidence.

**Methodology layer:** Shows the general framework. Letter-grade definitions across all bands, full modifier rules, rater notes, deconfliction rules across the whole dashboard, sensitivity analysis.

### What belongs on the card

| Element | Why |
|---|---|
| Construct (what is being graded) | Required for question 1. One sentence. |
| Scoring type (Action / Outcome / Mixed / etc.) | Required for question 2. Short tag. |
| Current-grade basis (band + plus/minus + modifiers) | Required for questions 5, 6, 7. |
| Primary evidence (grade-moving) | Required for question 3. Existing metrics, relabeled. |
| Context-only evidence (non-grade-moving but present) | Required for question 4. |
| Scope boundary | Required for question 8. |
| Grade-movement triggers (up / down) | Required for questions 9, 10. |

### What stays in methodology

| Element | Why |
|---|---|
| Full rubric letter definitions (A/A-/B+/B/B-/...) | Generic, lives once in the rubric, not repeated per card. |
| Full threshold bands for all grades (A through F) | The card shows the reader where the current grade sits; the full ladder belongs in a deeper view. |
| All four modifier rules in full | The card flags which modifiers are active; the full rules belong in the rubric. |
| Deconfliction matrix in full | The card notes the one deconfliction rule relevant to this dimension; the full matrix belongs in methodology. |
| Sensitivity analysis, shadow tests | Dashboard-level concerns, not per-card. |
| Rater notes | Internal rubric discipline, not reader-facing. |

### Open boundary question

**Does Methodology.jsx currently expose per-dimension scoring sheet content, or only the generic rubric?** This spec assumes the latter based on file naming and the prior diagnosis (which was not confirmed against `Methodology.jsx`). If the per-dimension methodology view does not exist publicly, the pilot implementation will need a companion: a public per-dimension methodology view that exposes the Canonical-Scoring-Sheet content for each dimension. This is flagged as an open question in Section 9.

---

## 5. Proposed Pilot Card Grammar

The order of sections a reader sees in the redesigned Affordability card.

### Layer 1: Summary (always visible)

1. **Dimension name** + trend arrow + previous grade marker (existing)
2. **Grade chip** (existing)
3. **Status line** — one sentence (existing, unchanged)
4. **What this grades** — NEW. One sentence from `construct`. Rendered as a labeled subline under the status, in a small muted style. E.g., *"Grades: adequacy of the federal policy response to household cost pressure."*

### Layer 2: Scoring basis (on expand, first section)

5. **Why this grade** — REPLACES current rationale paragraph with a structured block containing:
   - **Band:** `D` — per Canonical Scoring Sheet for Affordability, D = federal relief covers <20% of cost increase. Coverage currently ~[X]%.
   - **Plus/minus rationale:** `D-` rather than `D` — per Scoring-Rubric-v1.1 D- definition ("near-total failure; government relief covers a negligible share; structural drivers unaddressed"). Applied here because: [short editorial sentence tying the generic criterion to this dimension's current evidence].
   - **Active modifiers:** External Constraint (+0.3) applied per scoring sheet ("tariffs add $1,450-$2,000/yr"). [OR: "No active modifiers."]
   - **Scoring type:** Action — grades the response, not the price level.

6. **Why not higher / why not lower** — NEW. Two short lines:
   - *Why not C:* At C, relief would cover 20-40% of cost increase. Current ~15%.
   - *Why not F:* At F, there would be no federal affordability response. $307 Groceries Benefit and Grocery Code exist.

7. **What would change this grade** — REPLACES current `nextTrigger` content structure (existing field is kept for news-watch elsewhere or renamed to `nextDataReleases`). Two labeled triggers:
   - *Up one grade:* New federal benefit >$500/household announced AND funded, OR mandatory grocery competition measure enacted.
   - *Down one grade:* Food CPI exceeds 7%, OR grocery benefit expires without replacement, OR food insecurity exceeds 12M.

### Layer 3: Evidence (on expand, second section)

8. **Primary evidence** — NEW label on existing metrics. Shows metrics that moved this grade. Each labeled with verbatim source value and primary role.
9. **Context evidence** — NEW. Shows metrics present on the card but NOT grade-moving for this dimension (deconflicted to other dimensions, or general context). E.g., for Affordability: consumer carbon tax savings ($410-$680/yr, primary-homed in Carbon Pricing Policy).
10. **Scope** — NEW. Two short lines:
    - *In scope:* Groceries, tariff-driven cost increases, targeted federal relief.
    - *Out of scope:* Rents (→ Housing), utilities (shared jurisdiction), insurance (provincial), transportation (mixed).
11. **Attribution:** NEW. Numeric: Federal 60% · Shared 20% · External 20%. Replaces the current single-tag `tags.attribution` prose.

### Layer 4: Supporting context (on expand, third section)

12. **Promise tracker** (existing, unchanged)
13. **Perspectives** (renamed and restructured — see Section 7)
14. **Sources** (existing, unchanged)
15. **What was inherited** (existing, unchanged)

### Recommendation

Layers 1 and 2 are the inspection layer. A reader who stops reading after Layer 2 should still be able to answer most jobs-to-be-done questions. Layers 3 and 4 deepen the inspection and provide accountability context.

---

## 6. Required Data Model Additions

New fields in `src/data/dimensions.json` for the Affordability entry. Each is sourced from `Canonical-Scoring-Sheets.md` or `Scoring-Rubric-v1.1.md`.

### 6a. New fields (structured)

| Field | Type | Example (Affordability) | Source in methodology |
|---|---|---|---|
| `construct` | string | "Adequacy of the federal policy response to household cost pressure from groceries, tariffs, and targeted relief." | Canonical-Scoring-Sheets.md §1 "Construct" |
| `scoringType` | string | "Action" | Canonical-Scoring-Sheets.md §1 "Type" |
| `attribution` | object | `{ federal: 60, shared: 20, external: 20 }` | Canonical-Scoring-Sheets.md §1 "Attribution" |
| `scope` | object | `{ inScope: ["Groceries", "Tariff-driven cost increases", "Targeted federal relief"], outOfScope: [ { item: "Rents", homedIn: "Housing" }, { item: "Utilities", reason: "Shared jurisdiction" }, ... ] }` | Canonical-Scoring-Sheets.md §1 "Scope boundary" |
| `gradeBasis` | object | `{ band: "D", bandCriterion: "Federal relief covers <20% of cost increase", plusMinusRationale: "Near-total failure — coverage ~15%, Grocery Code voluntary", activeModifiers: [ { name: "External Constraint", effect: "+0.3", reason: "Tariffs add $1,450-$2,000/yr per household" } ] }` | Mix of Canonical-Scoring-Sheets grade thresholds + Scoring-Rubric-v1.1 letter definitions |
| `gradeTriggers` | object | `{ up: ["New federal benefit >$500/household announced AND funded", "Mandatory grocery competition measure enacted"], down: ["Food CPI exceeds 7%", "Grocery benefit expires without replacement", "Food insecurity exceeds 12M"] }` | Canonical-Scoring-Sheets.md §1 "One-notch move triggers" |

### 6b. Modifications to existing fields

| Existing field | Change | Reason |
|---|---|---|
| `tags.attribution` | Remove or deprecate | Replaced by structured `attribution` field. Prose tag loses the numeric split. |
| `nextTrigger` | Rename to `nextDataReleases` (or keep, but clarify purpose) | Current content is a news watch; new `gradeTriggers` field serves the inspection role. Two distinct reader needs, kept separate. |
| `metrics` | Add per-metric `role` field with values `"primary"` or `"context"` | Enables the Layer 3 split between primary evidence and context evidence. |

### 6c. Minimum viable addition

If the full data model is too heavy for the pilot, the minimum set that materially closes inspectability is:

1. `construct`
2. `gradeBasis` (including active modifiers)
3. `gradeTriggers` (up and down)
4. `scope.outOfScope`

These four fields alone would answer jobs-to-be-done questions 1, 5, 6, 7, 8, 9, 10. The other additions are valuable but not minimum viable.

---

## 7. Treatment of Perspectives Section

### Recommendation: relabel + subordinate + add interpretive header

**Rationale.** The current "What Critics and Defenders Say" section presents two quote blocks of equal visual weight. A reader absorbs them as two balanced claims, but the methodology determines grade from evidence, not from whichever perspective is more persuasive. Two failure modes:

1. **False balance.** For a dimension where the evidence clearly supports one reading, two equally-sized quote boxes imply two equally-supported positions.
2. **Deconfliction leakage.** In the current Affordability defenders text: "The consumer carbon tax elimination was a real cost reduction." Per the scoring sheet, carbon tax savings are deconflicted to Carbon Pricing Policy — they are context only here. A reader absorbs the defender's point as supporting the Affordability grade, but methodologically it does not.

### Specific changes for the pilot

| Change | Detail |
|---|---|
| **Relabel** | "What Critics and Defenders Say" → "Interpretive perspectives" |
| **Add interpretive header** | One line above the two quote boxes: *"These are positions held by named sources. The grade is determined by the evidence above, not by which perspective is more persuasive."* |
| **Subordinate visually** | Smaller font than primary evidence. Below scope and grade triggers, not adjacent to rationale. |
| **Keep the content** | Do not change what critics and defenders actually say. Keep attribution labels (NDP, Broadbent, etc.). |

### Not recommended

- Do **not** remove the section. The perspective layer serves a real accountability purpose.
- Do **not** merge into rationale. That would conflate methodology reasoning with interpretive positions.
- Do **not** add fact-checking of each perspective. That's scope creep into editorializing.

---

## 8. Acceptance Criteria

The pilot is accepted only when all of these pass.

### 8a. Reader-test acceptance

A serious reader (not a project insider) reads the redesigned Affordability card — and only the card, no repo docs — then correctly answers:

1. **What is this dimension grading?** → Adequacy of federal policy response (not prices).
2. **Is the grade based on conditions, actions, or both?** → Actions (policy response).
3. **Which evidence primarily drove the D- grade?** → Grocery benefit ~$307 vs $1,600+ in cost increases (<20% coverage).
4. **Which evidence on the card is context only, not grade-moving?** → Consumer carbon tax savings (homed in Carbon Pricing).
5. **What is the threshold rule that places this in the D band?** → D = relief covers <20% of cost increase.
6. **Why D- rather than D?** → D- reflects "near-total failure / negligible share" per rubric D- criterion.
7. **Are any modifiers currently applied?** → Yes — External Constraint (+0.3), for tariff-driven costs.
8. **What is explicitly out of scope for this dimension?** → Rents, utilities, insurance, transportation.
9. **What specific new evidence would move the grade up one step?** → Benefit >$500/household announced and funded, or mandatory competition reform.
10. **What would move it down?** → Food CPI >7%, benefit expires without replacement, or food insecurity >12M.

Acceptance threshold: 8 of 10 correct from the card alone. (Allows for Q6 and Q7 being tricky.)

### 8b. Internal-consistency acceptance

- `dimensions.json` Affordability entry contains all new fields listed in §6a.
- Values in new fields match the Canonical-Scoring-Sheet for Affordability verbatim where possible (construct sentence, thresholds, triggers, scope).
- Active modifiers list matches the scoring sheet's "currently applicable" modifiers. If a modifier is listed as active, the grade as displayed must reflect it.
- No claim in Layer 2 (scoring basis) references a figure not present in the metrics or sourceNotes.
- Perspectives section has the new interpretive header.

### 8c. Verification-protocol acceptance

- Every new field in `gradeBasis.plusMinusRationale` and `gradeBasis.activeModifiers` must be traceable to either the Canonical-Scoring-Sheet (for the dimension-specific content) or Scoring-Rubric-v1.1 (for the generic letter definitions).
- If the grade basis claims an active modifier, the `gradeBasis.activeModifiers[*].reason` must cite the scoring-sheet sentence that triggers it.
- Source-Verification-Protocol.md rules continue to apply: if a figure in `gradeBasis` or `gradeTriggers` is not in the evidence pack, it cannot be displayed.

### 8d. Does-not-regress acceptance

- Card length must not exceed 1.5x the current length. If the redesign doubles the card, reconsider whether every new section pulls its weight.
- All currently-working card elements (Promise Tracker, Sources, Inherited) still render correctly.
- Grade display, trend arrow, and previousGrade marker still render as they do today.

---

## 9. Open Questions

These must be resolved before implementation starts.

| # | Question | Why it matters | Who decides |
|---|---|---|---|
| Q1 | Does `Methodology.jsx` currently expose per-dimension scoring sheet content publicly, or only the generic rubric? | If only generic, a companion public methodology view is needed alongside the card redesign. Without it, the card links lead nowhere. | Editor — check `Methodology.jsx` |
| Q2 | Is the External Constraint modifier *actually applied* to the current Affordability D- grade, or only listed as "currently applicable" in the scoring sheet without adjustment? | If scoring sheet says active but grade does not reflect it, the data has a methodology-execution mismatch that must be resolved before the card surfaces it. | Editor — check grade computation against methodology |
| Q3 | What is the exact current coverage percentage? The scoring sheet says D is "<20%." The card's rationale says "less than 20%." Is there a precise number (e.g., "~15%" or "18%") that should be shown in `gradeBasis.bandCriterion`? | The plus/minus rationale depends on knowing how far into the D band this sits. If coverage is 18%, it's borderline D/C; if 5%, it's deep D- territory. | Editor — compute from ~$307 / (cost increase baseline) |
| Q4 | Should "Context evidence" show values, or only labels? | Showing values risks reader confusion (why is this number here if it doesn't move the grade?). Hiding values reduces transparency. | Product decision |
| Q5 | Should `activeModifiers` display the effect size (+0.3) or just presence? | Displaying effect size suggests false precision (grade is not computed numerically from modifiers). Omitting it may understate modifier weight. | Methodology + product decision |
| Q6 | How does this grammar generalize to sub-score dimensions (Defence & Trade)? | Not a blocker for Affordability pilot, but answer determines whether this grammar scales. Flagged for the 3-dimension expansion phase. | Defer to Phase 2 |
| Q7 | Should `nextDataReleases` (news watch) remain on the card at all, or move elsewhere (cycle digest, admin view)? | If retained, it risks overlap with `gradeTriggers`. If removed, readers lose the "when is new data coming" signal. | Product decision |

---

## 10. Recommendation on Expansion

### Should this grammar expand to other dimensions?

**Yes, in phases, contingent on pilot acceptance.**

### Phased path

**Phase 1 (this spec):** Affordability Response only. Validates the grammar works for an Action-type dimension with an active modifier, clear attribution split, and explicit thresholds.

**Phase 2 (after pilot passes acceptance):** Expand to 3 dimensions selected for different failure modes:

| Dimension | Tests |
|---|---|
| **Fiscal Health** | Outcome-type dimension. Tests how the grammar handles a dimension where primary evidence is quantitative outcome data, and where there is a known metric-concept problem (three different debt figures). |
| **Defence & Trade** | Sub-score dimension. Tests how `gradeBasis` and `gradeTriggers` interact with sub-construct scoring (Defence sub-score A, Trade Diversification sub-score B+). |
| **Ethics & Transparency** | Qualitative dimension. Tests the grammar on a dimension where evidence is judgment-based and plus/minus precision was intentionally removed. |

**Phase 3 (after 3-dimension pilot):** If grammar holds across Action, Outcome, Mixed (sub-score), and Process/qualitative dimensions, extend to all 12.

### Not recommended

- Do **not** redesign all 12 dimensions at once based on this spec. The Affordability pilot will surface edge cases that affect grammar choices, and changing all 12 before learning those is high-risk.
- Do **not** let Phase 1 acceptance blur into Phase 2. Accept or reject the pilot explicitly before expanding.

### Cross-phase dependency

Q1 (methodology view exposure) must be resolved before Phase 1 implementation. If the public-facing per-dimension methodology view does not exist, the pilot should include a minimal version of that view — at least for Affordability — so the card's references to scoring-sheet content have a public destination.
