# Dimension Applicability Matrix

- **Purpose:** Preserve the proposed map of dimensions to tri-lens suitability, primary lens, constraints, and pilot scope.
- **Status:** Historical design artifact. The tri-lens shadow run was closed on 2026-08-26.
- **Last updated:** 2026-08-26
- **Depends on:** Core-Tri-Lens-Architecture.md, V2-Scoring-Architecture-Brief.md, Canonical-Scoring-Sheets.md, Dimension-Status-Register.md
- **Used by:** Historical v2 design review only

---

> **Closure note (2026-08-26):** This matrix records the planned pilot scope.
> It does not govern the live dimension model or scoring process. See
> [V2-Tri-Lens-Closure-Post-Mortem-2026-08-25.md](V2-Tri-Lens-Closure-Post-Mortem-2026-08-25.md).

## 1. Applicability Table

| # | Dimension | Commitment | Execution | Outcome | Primary lens | Key constraint | Pilot scope |
|---|---|---|---|---|---|---|---|
| 1 | Defence (sub-construct) | Partial | **Yes** | Partial | Execution | NATO 2% is a permanent milestone that cannot regress; limits outcome lens sensitivity. Defence is milestone-based, not outcome-variable. | **Now** |
| 2 | Trade Diversification (sub-construct) | Partial | **Yes** | **Yes** | Outcome | US export share is externally influenced (tariffs, commodity prices). Monthly trade data is volatile — must use annualized figures. Attribution is shared. | **Now** |
| 3 | Major Projects | No | **Yes** | No | Execution | Construct is institutional machinery, not downstream economic benefit. Credit-claiming and inherited pipeline effects are major confounders. | Later |
| 4 | Fiscal Health | Partial | Partial | **Yes** | Outcome | Fiscal commitments (deficit targets, fiscal anchors) are thin but real and scoreable. The dimension is fundamentally about trajectory and sustainability. Defence spending and emergency shocks complicate attribution. | **Now** |
| 5 | Economic Policy Response | Partial | **Yes** | No | Execution | Highly vulnerable to announcement bias (QA Rule 2 enforced rigorously). Productivity and investment outcomes lag too much for monthly KPI treatment. | Later |
| 6 | Affordability Response | Partial | **Yes** | No | Execution | Prices driven by global markets, provinces, and monetary policy. Outcome scoring would over-attribute federal control. Jurisdictional cap (C+) applies. | Later |
| 7 | Carbon Pricing Policy | Partial | **Yes** | Partial | Execution | Instrument design is gradeable; emissions effects belong in Climate (deconfliction). Strict outcome treatment creates deconfliction problems. | Later |
| 8 | Climate & Environment | Partial | **Yes** | Partial | Execution | Government can be judged on framework design and reversals now, but emissions and environmental outcomes are lagged, multi-causal, and partly external. | Later |
| 9 | Immigration | **Yes** | **Yes** | **Yes** | Execution + Outcome | Strongest candidate for full tri-lens scoring. Definitions must stay consistent across StatsCan and IRCC sources. High federal attribution (90%). | **Now** |
| 10 | Housing Supply | Partial | **Yes** | Partial | Execution | Federal attribution is lowest in framework (30%). Housing outcomes are shared-jurisdiction and lagged. Outcome scoring must use time-matched measures and carry attribution qualifier. Jurisdictional cap (C+) applies. | **Now** |
| 11 | Ethics & Transparency | No | Partial | No | Bounded qualitative | Weakest candidate for KPI treatment. Evidence is qualitative, event-driven, and politically valenced. Two raters could disagree by one full letter. Confidence: Medium (lowest). | **Exception** |
| 12 | Flagship Delivery | No | Partial | No | Execution (mechanical) | Synthetic dimension using Combination Rule across 5 home files. July 2026 exit test passed. Overlap risk with home dimensions remains structural. | **Exception** |
| — | Promise Delivery | **Yes** | No | No | Commitment (tracker, downstream only) | Leaving GPA. Derivative dimension. Strictly downstream of home-dimension scoring — does not feed back into any lens. Double-counting risk is the reason it left the composite. | **Exception** |

---

## 2. Reading the Table

**Commitment / Execution / Outcome columns:**
- **Yes** = dimension has a clear, gradeable evidence stack for this lens with primary indicators defined
- **Partial** = dimension has some relevant evidence but the lens is secondary, attribution-limited, or evidence-thin
- **No** = lens is not applicable or would produce misleading precision

**Primary lens:** The lens that should carry the most weight in any shadow composite for this dimension. Determined by the dimension's construct type (from Scoring-Rubric-v1.1.md) and the suitability assessment (from V2-Scoring-Architecture-Brief.md Section 4).

**Historical pilot-scope labels:**
- **Now** = was selected for the planned first shadow cycle (Immigration, Housing Supply, Fiscal Health, Defence, Trade Diversification)
- **Later** = was considered suitable for later v2 treatment if the pilot worked
- **Exception** = was not treated as a standard tri-lens candidate

---

## 3. Pilot Group Rationale

The five pilot constructs were selected to test different architectural demands:

| Pilot construct | What it tests |
|---|---|
| Immigration | Full tri-lens scoring — the strongest candidate. Tests whether all three lenses can be scored independently without distortion. |
| Fiscal Health | Outcome-led scoring — tests whether the Outcome lens can carry primary weight when execution evidence is secondary. |
| Housing Supply | Execution-led scoring with cautious outcome treatment — tests attribution limits and jurisdictional cap interaction with lens scoring. |
| Defence | Execution-heavy milestone scoring — tests how a permanent milestone (NATO 2%) behaves under tri-lens where outcome sensitivity is limited. |
| Trade Diversification | Outcome-heavy, attribution-sensitive scoring — tests the hardest outcome case in the pilot: externally influenced, volatile data, shared attribution. |

These five constructs were intended to test whether the architecture was viable
for extension. The real cycle did not occur, so the planned test produced no
result.

---

## 4. Exception Dimension Treatment

### Ethics & Transparency

- Remains a bounded qualitative process assessment in v2.
- Does NOT receive tri-lens scoring.
- The current v1 whole-letter grade (C) continues as the only score.
- A semi-quantitative indicator was the stated prerequisite for any limited Execution lens. That work did not occur in this pilot.

### Flagship Delivery

- Cleared the July 2026 exit test and no longer sits on probation.
- The Combination Rule (5-file mechanical scoring) continues to produce its v1 grade.
- Does NOT receive independent tri-lens scoring. The Combination Rule already functions as a synthetic execution lens.
- Its relationship to v2 was left unresolved. No tri-lens cycle produced evidence for that decision.

### Promise Delivery

- Removed from GPA. Operates as an ungraded commitment accountability tracker.
- Does NOT receive tri-lens scoring. Its function is already captured by the Commitment lens across all other dimensions.
- The Promise Tracker tab continues to display 43 commitments with status tags, evidence, and durability classifications.
- **Strictly downstream.** Promise status changes are derived from home-dimension evidence and reflect scoring decisions already made in those dimensions. The tracker does NOT feed back into home-dimension Commitment lens scoring. Editors score the Commitment lens using primary evidence (canonical government documents, Tier 1/2 analysis), then the Promise Tracker is updated to reflect the result. The tracker is a display layer, not a scoring input.

---

## 5. Dimensions Planned for Later Pilot Waves

These dimensions were tagged "Execution" as the primary lens and were left
outside the planned first cycle. No later pilot wave was run.

| Dimension | Why deferred |
|---|---|
| Major Projects | Credit-claiming penalty and inherited pipeline effects make tri-lens attribution harder than the current pilot cases. |
| Economic Policy Response | Announcement bias is the highest risk in the framework; needs the strongest QA Rule 2 enforcement pattern established first. |
| Affordability Response | Outcome lens would over-attribute federal control over prices. Needs the Housing Supply pilot to establish the pattern for jurisdictional-limit-constrained outcome scoring. |
| Carbon Pricing Policy | Deconfliction with Climate & Environment must hold cleanly in v1 before adding a second scoring axis. |
| Climate & Environment | Outcome lag and multi-causality require cautious treatment. Needs the Trade Diversification pilot to establish the pattern for externally-influenced outcome scoring. |
