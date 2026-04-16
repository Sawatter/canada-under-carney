# Dimension Applicability Matrix

- **Purpose:** Map all current dimensions to their tri-lens suitability, primary scoring lens, key constraints, and pilot scope.
- **Status:** Draft — not for public use. Shadow scoring only.
- **Last updated:** 2026-04-15
- **Depends on:** Core-Tri-Lens-Architecture.md, V2-Scoring-Architecture-Brief.md, Canonical-Scoring-Sheets.md, Dimension-Status-Register.md
- **Used by:** Pilot-Templates.md, Shadow-Run-Workflow.md, Open-Design-Decisions.md

---

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
| 12 | Flagship Delivery | No | Partial | No | Execution (mechanical) | Synthetic dimension using Combination Rule across 5 home files. On probation — must prove independent value. Overlap risk with home dimensions. | **Exception** |
| — | Promise Delivery | **Yes** | No | No | Commitment (tracker, downstream only) | Leaving GPA. Derivative dimension. Strictly downstream of home-dimension scoring — does not feed back into any lens. Double-counting risk is the reason it left the composite. | **Exception** |

---

## 2. Reading the Table

**Commitment / Execution / Outcome columns:**
- **Yes** = dimension has a clear, gradeable evidence stack for this lens with primary indicators defined
- **Partial** = dimension has some relevant evidence but the lens is secondary, attribution-limited, or evidence-thin
- **No** = lens is not applicable or would produce misleading precision

**Primary lens:** The lens that should carry the most weight in any shadow composite for this dimension. Determined by the dimension's construct type (from Scoring-Rubric-v1.1.md) and the suitability assessment (from V2-Scoring-Architecture-Brief.md Section 4).

**Pilot scope:**
- **Now** = included in the first shadow cycle pilot (Immigration, Housing Supply, Fiscal Health, Defence, Trade Diversification)
- **Later** = suitable for v2 treatment but deferred until the pilot proves the architecture works
- **Exception** = not a standard tri-lens candidate; requires bounded or alternative treatment

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

If these five constructs produce stable, defensible shadow scores through one real cycle, the architecture is viable for extension. If any of them fail, the failure mode will be informative about which design constraints need tightening before extending to the "Later" dimensions.

---

## 4. Exception Dimension Treatment

### Ethics & Transparency

- Remains a bounded qualitative process assessment in v2.
- Does NOT receive tri-lens scoring.
- The current v1 whole-letter grade (C) continues as the only score.
- If a semi-quantitative indicator is developed (e.g., disclosure completeness score, Ethics Commissioner recommendations addressed), a future version may introduce a limited Execution lens. That decision is parked in Open-Design-Decisions.md.

### Flagship Delivery

- Remains on probation.
- The Combination Rule (5-file mechanical scoring) continues to produce its v1 grade.
- Does NOT receive independent tri-lens scoring. The Combination Rule already functions as a synthetic execution lens.
- If Flagship Delivery passes probation after the May 2026 cycle, its relationship to v2 can be reassessed. That decision is parked in Open-Design-Decisions.md.

### Promise Delivery

- Removed from GPA. Operates as an ungraded commitment accountability tracker.
- Does NOT receive tri-lens scoring. Its function is already captured by the Commitment lens across all other dimensions.
- The Promise Tracker tab continues to display 44 commitments with status tags, evidence, and durability classifications.
- **Strictly downstream.** Promise status changes are derived from home-dimension evidence and reflect scoring decisions already made in those dimensions. The tracker does NOT feed back into home-dimension Commitment lens scoring. Editors score the Commitment lens using primary evidence (canonical government documents, Tier 1/2 analysis), then the Promise Tracker is updated to reflect the result. The tracker is a display layer, not a scoring input.

---

## 5. Dimensions Deferred to Later Pilot Waves

These dimensions are all tagged "Execution" as primary lens. They are deferred because they share common challenges that should be addressed after the first pilot proves the base architecture:

| Dimension | Why deferred |
|---|---|
| Major Projects | Credit-claiming penalty and inherited pipeline effects make tri-lens attribution harder than the current pilot cases. |
| Economic Policy Response | Announcement bias is the highest risk in the framework; needs the strongest QA Rule 2 enforcement pattern established first. |
| Affordability Response | Outcome lens would over-attribute federal control over prices. Needs the Housing Supply pilot to establish the pattern for jurisdictional-limit-constrained outcome scoring. |
| Carbon Pricing Policy | Deconfliction with Climate & Environment must hold cleanly in v1 before adding a second scoring axis. |
| Climate & Environment | Outcome lag and multi-causality require cautious treatment. Needs the Trade Diversification pilot to establish the pattern for externally-influenced outcome scoring. |
