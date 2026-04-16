# Shadow Release Log — April 2026 (Initial Decomposition)

- **Purpose:** Retrospective decomposition of existing v1 evidence into initial shadow lens grades for the five pilot constructs. This is Task 1 from Open-Design-Decisions.md — baseline setting, not a real monthly cycle.
- **Status:** Initial decomposition. No new evidence applied. Grades derived from existing Canonical-Scoring-Sheets.md and dimensions.json evidence as of April 2026.
- **Last updated:** 2026-04-15
- **Method:** Option A from Open-Design-Decisions.md Decision 5 — retrospective decomposition of v1 evidence base.

---

## Computation Rules

These rules govern all math in this log and in future shadow cycles.

**1. Lens GPA values (whole-letter only):**
A = 4.0, B = 3.0, C = 2.0, D = 1.0, F = 0.0. No plus/minus in v2.

**2. Raw composite calculation:**
For each pilot dimension, multiply each lens GPA value by the dimension's lens weight (from Pilot-Templates.md) and sum. The result is the raw composite — a decimal value.

**3. Display grade (whole-letter rounding):**
Round the raw composite to the nearest whole-letter grade using midpoints: ≥3.5 → A, ≥2.5 → B, ≥1.5 → C, ≥0.5 → D, <0.5 → F.

**4. Defence & Trade combined:**
Average the two sub-construct raw composites. Round the combined raw value to a display grade using the same midpoint rule.

**5. GPA contribution:**
The shadow Full Policy Audit GPA uses raw composite values (not rounded display grades) for pilot dimensions, to avoid cascading rounding error. Non-pilot dimensions retain their v1 GPA entries (which include plus/minus precision: A-=3.7, C+=2.3, D-=0.7, etc.). The final GPA is rounded to two decimal places for reporting.

**6. Deltas:**
All deltas are computed as (shadow raw composite − v1 GPA entry) for individual dimensions, and (shadow GPA − v1 GPA) for the headline.

---

## Lens Scores

### Individual pilot constructs

| Dimension | v1 grade (GPA) | Commitment | Execution | Outcome | Weights (C/E/O) | Raw composite | Display grade | Delta (raw) |
|---|---|---|---|---|---|---|---|---|
| Immigration | C+ (2.3) | B | B | C | 0.33/0.34/0.33 | 2.67 | B | +0.37 |
| Housing Supply | D (1.0) | C | D | D | 0.15/0.60/0.25 | 1.15 | D | +0.15 |
| Fiscal Health | D (1.0) | D | C | D | 0.15/0.25/0.60 | 1.25 | D | +0.25 |
| Defence | A (4.0 sub) | A | A | B | 0.15/0.60/0.25 | 3.75 | A | -0.25 |
| Trade Diversification | B+ (3.3 sub) | C | C | B | 0.15/0.25/0.60 | 2.60 | B | -0.70 |

### Composite arithmetic verification

- **Immigration:** 3.0(0.33) + 3.0(0.34) + 2.0(0.33) = 0.99 + 1.02 + 0.66 = **2.67** → ≥2.5 → **B** ✓
- **Housing Supply:** 2.0(0.15) + 1.0(0.60) + 1.0(0.25) = 0.30 + 0.60 + 0.25 = **1.15** → <1.5 → **D** ✓
- **Fiscal Health:** 1.0(0.15) + 2.0(0.25) + 1.0(0.60) = 0.15 + 0.50 + 0.60 = **1.25** → <1.5 → **D** ✓
- **Defence:** 4.0(0.15) + 4.0(0.60) + 3.0(0.25) = 0.60 + 2.40 + 0.75 = **3.75** → ≥3.5 → **A** ✓
- **Trade Diversification:** 2.0(0.15) + 2.0(0.25) + 3.0(0.60) = 0.30 + 0.50 + 1.80 = **2.60** → ≥2.5 → **B** ✓

### Defence & Trade combined

| Metric | Value |
|---|---|
| Defence raw composite | 3.75 |
| Trade Diversification raw composite | 2.60 |
| Combined raw (average) | (3.75 + 2.60) / 2 = **3.175** |
| Combined display grade | 3.175 < 3.5 midpoint → **B** |
| v1 grade (GPA) | A- (3.7) |
| Delta (raw) | 3.175 − 3.7 = **-0.525** |

### Shadow Full Policy Audit GPA

Replace pilot dimension v1 GPA entries with raw composites. Keep non-pilot v1 GPA entries unchanged.

| # | Dimension | v1 GPA entry | Shadow GPA entry | Source |
|---|---|---|---|---|
| 1 | Defence & Trade | 3.7 | 3.175 | Shadow combined raw |
| 2 | Major Projects | 2.0 | 2.0 | v1 (not piloted) |
| 3 | Fiscal Health | 1.0 | 1.25 | Shadow raw |
| 4 | Economic Policy Response | 1.0 | 1.0 | v1 (not piloted) |
| 5 | Affordability Response | 0.7 | 0.7 | v1 (not piloted) |
| 6 | Carbon Pricing Policy | 2.0 | 2.0 | v1 (not piloted) |
| 7 | Climate & Environment | 1.0 | 1.0 | v1 (not piloted) |
| 8 | Immigration | 2.3 | 2.67 | Shadow raw |
| 9 | Housing Supply | 1.0 | 1.15 | Shadow raw |
| 10 | Ethics & Transparency | 1.7 | 1.7 | v1 (not piloted) |
| 11 | Flagship Delivery | 1.7 | 1.7 | v1 (not piloted) |
| | **Sum** | **18.1** | **18.345** | |
| | **GPA (÷11)** | **1.65** | **1.67** | |
| | **Headline** | **C-** | **C-** | Both ≥1.65 |
| | **Delta** | | **+0.02** | |

**Verification of net change:**
- Immigration: +0.37
- Housing Supply: +0.15
- Fiscal Health: +0.25
- Defence & Trade: -0.525
- Net change to sum: +0.37 + 0.15 + 0.25 − 0.525 = **+0.245**
- GPA change: +0.245 / 11 = **+0.022** ✓

**Headline finding:** The shadow GPA (1.67) is essentially unchanged from v1 (1.65). Both remain C- under the published threshold rule (C- requires ≥1.65). The tri-lens decomposition does not move the headline — its value is at the dimension level, not the aggregate level.

---

## Dimension Decompositions

### Immigration — v1: C+

**Commitment lens: B**

Evidence decomposition:
- PR target set at 380,000 for 2026-2028 (~0.95% of population) — specific, published in IRCC Levels Plan (canonical commitment document). Covers permanent and temporary streams.
- Temporary resident reduction target: below 5% by end of 2027 — specific target with timeline.
- Student/TFW/asylum stream reform commitments — stated but specificity varies by stream.

Assessment: Substantial commitments covering most of the immigration scope with specific targets and timelines. The gap is the absence of a right-sized long-term model defining what the immigration system should look like after the correction. That prevents an A. Grade: **B**.

Confidence: High.

**Execution lens: B**

Evidence decomposition:
- PR target operationally enforced: 380,000 target in place.
- Temporary resident contraction executing at scale: -53% temp arrivals, -60% student permits. These are operational results, not announcements.
- Population declined by 102,436 in 2025 — first decline since Confederation. This is an outcome fact but it confirms enforcement is operational (secondary context for Execution).
- TFW program tightened operationally.
- What is NOT yet executed: right-sized long-term model (not published), asylum stream reforms (pending).

Assessment: Most commitments have reached implementation stage. The contraction is operationally real — temp arrivals down 53%, student permits down 60%. These are not announcements; they are operational enforcement results confirmed by IRCC data. Minor gaps: asylum reform pending, long-term model not yet designed. Grade: **B**.

Confidence: High.

**Outcome lens: C**

Evidence decomposition:
- Primary indicator (non-permanent resident stock): declined from 3.15M (7.6%) to 2.68M. On trajectory toward 5% target but not yet there.
- Population declined 102,436 (Q4 2025 StatsCan 17-10-0009-01) — first decline since Confederation. This is a structural outcome, not a seasonal blip.
- However: downside risks are materializing. Healthcare staffing shortfalls, agriculture gaps, higher education revenue collapse reported by critics. These are negative outcome effects of the correction.
- Net assessment: primary indicator (stock reduction) is moving in the right direction but has not yet crossed the target threshold. Mixed signals from downstream outcomes.

Assessment: Primary indicator is improving but not yet at target. Downstream negative outcomes partially offset the positive trajectory. No sustained improvement crossing the A or B threshold yet. Grade: **C**.

Confidence: High.

**v1 comparison:** v1 C+ (2.3) vs shadow B (raw 2.67). Delta: +0.37. The shadow composite is slightly higher because the tri-lens decomposition gives Immigration credit for strong commitment and execution separately, whereas the v1 blended grade partially discounts these because the outcome (stock reduction) hasn't fully materialized. This divergence is expected and analytically defensible — it shows Immigration is a case where the government is doing more than the blended grade reflects.

---

### Housing Supply — v1: D

**Commitment lens: C**

Evidence decomposition:
- "500,000 homes/year over next decade" — specific target with timeline. Published in platform and budget.
- Build Canada Homes — program announced with unit targets across 6 sites.
- Canada-Ontario Partnership ($8.8B over 10 years) — specific funding amount and structure.
- Apprenticeship training up to $8,000 — program committed.

Assessment: Partial commitments — several programs announced with funding amounts and unit targets, but the scale of commitment relative to the shortfall (259K starts vs 450K+ needed) is inadequate. The commitments cover some levers (direct build, provincial partnership, training) but not others (zoning reform is shared jurisdiction). The 500K target is ambitious on paper but lacks a credible delivery path. Grade: **C**.

Confidence: Medium.

**Execution lens: D**

Evidence decomposition:
- BCH: 4,000 units announced across 6 sites, construction NOT yet underway as of April 2026. This is "Announced" to "Authorized" at best — not "Disbursing" or "Delivering."
- Ontario Partnership: $8.8B signed (March 30, 2026). Agreement exists but no disbursement or construction results yet. "Authorized" stage.
- Federal housing spending trajectory: declining 56% by 2028-29 (PBO). This directly contradicts the commitment to scale up housing delivery.
- PBO projects BCH delivers 26,000 units over 5 years — 3.7% of shortfall.
- No other provincial agreements beyond Ontario.

Assessment: Most programs remain at announcement or early authorization stage. BCH has not started construction. The Ontario partnership is newly signed with no results. Federal spending is declining, not increasing. The execution story is one of programs announced but not yet delivering at any meaningful scale. Grade: **D**.

Confidence: Medium.

**Outcome lens: D**

Evidence decomposition:
- Primary indicator: Housing starts 259,028 (2025) — firmly in D range (<280K SAAR).
- CMHC annual need: 450,000+. Gap is approximately 190,000 units/year.
- No sustained improvement trend in starts data.

Attribution qualifier: Federal contribution estimated at ~30%. Provincial, municipal, and market factors account for the majority of housing supply variation. The D grade reflects the outcome condition, not exclusively federal performance.

Modifier application:
- Timing fairness: Applies. Housing is tagged "Moves quarterly+" with lag "Long." Cannot downgrade below C in first 24 months. However, current grade IS below C — timing fairness provides a floor of C only if corrective action is taken. Since execution is D (minimal corrective action at scale), the floor does not activate.
- Jurisdictional limits: Non-binding (D is below C+ cap).

Assessment: Starts are firmly in D range. No sustained improvement. The outcome condition has not changed materially. Grade: **D**.

Confidence: Medium.

**v1 comparison:** v1 D (1.0) vs shadow D (raw 1.15). Delta: +0.15. Negligible. The decomposition confirms the v1 grade — Housing Supply is D across execution and outcome, with commitment slightly higher (C) but not enough to move the composite given its 0.15 weight. This is a dimension where blended and decomposed scoring produce the same answer, which is useful validation that v1 is not masking lens-level variation here.

---

### Fiscal Health — v1: D

**Commitment lens: D**

Evidence decomposition:
- "Balance operational budget in 3 years" — stated commitment but stalled. PBO gives 7.5% probability of meeting targets.
- "Reduce civil service by ~40,000" — stated commitment, in progress.
- Middle class income tax cut — delivered (reduces revenue, complicates fiscal anchor).
- Capital gains tax increase cancelled — delivered (reduces revenue, complicates fiscal anchor).
- No binding fiscal anchor with enforcement mechanism. The operating/capital budget split is a framework innovation but not a deficit target.

Assessment: The government has stated a balanced-budget commitment but its own budget projections and PBO analysis show the path is not credible (7.5% probability). Revenue-reducing promises (tax cut, capital gains reversal) directly contradict the fiscal commitment. The operating/capital split is a framing device, not a fiscal anchor. Grade: **D** — stated targets contradicted by own budget projections.

Confidence: High.

**Execution lens: C**

Evidence decomposition:
- Budget 2025 passed with spending levels authorized by Parliament. This is genuine execution — the budget was tabled, debated, and passed.
- Civil service reduction underway (spending review, departmental cuts).
- Tax measures enacted: middle class tax cut and capital gains reversal both implemented.
- Defence spending ($81.8B over 5 years) authorized and disbursing.
- GST rate not changed despite pressure.

Assessment: The government IS executing fiscal policy — it passed a budget, enacted tax changes, and is implementing departmental spending reviews. The execution is real even though the fiscal direction is toward larger deficits, not smaller ones. Execution grades the implementation machinery, not the fiscal direction (that is the Outcome lens). Mixed execution: some measures enacted, others delayed. The fiscal rule (balanced operational budget) exists as a framework but compliance is aspirational. Grade: **C**.

Confidence: High.

**Outcome lens: D**

Evidence decomposition:
- Primary indicator: Deficit $78.3B (nearly doubled from prior year). Firmly in D territory (>4% GDP).
- PBO confidence: 7.5% probability deficit-to-GDP declines as projected.
- Fitch: AA+ with renewed warning. Not yet downgraded, but on negative trajectory.
- Debt servicing ($55.6B) now exceeds GST revenue ($54.4B).
- Net debt: $1.27T.
- IMF/IFSD: current levels manageable, trajectory unsustainable.

Level vs. trajectory: Level is D (deficit >4% GDP). Trajectory is worsening (deficit nearly doubled). Both assessments point to D.

Modifier application:
- External constraint: Defence spending ($81.8B over 5 years) is strategically justified during trade war. However, the gas tax suspension ($2.4B) and other discretionary spending are not externally driven. External constraint applies partially to the defence component but not to the broader fiscal package.

Assessment: Deficit firmly in D range, trajectory worsening, PBO gives 7.5% confidence in targets, Fitch warning, debt service exceeding GST revenue. Grade: **D**.

Confidence: High.

**v1 comparison:** v1 D (1.0) vs shadow D (raw 1.25). Delta: +0.25. The decomposition reveals that fiscal execution (C) is one grade step higher than fiscal commitment (D) and fiscal outcome (D). The government IS implementing fiscal policy; the problem is that the policy itself is producing worsening outcomes and the commitments lack credibility. This is a useful lens decomposition — it shows the failure is in direction and outcome, not in execution machinery.

---

### Defence (sub-construct) — v1 sub-score: A

**Commitment lens: A**

Evidence decomposition:
- NATO 2% GDP spending commitment: stated, reaffirmed, and delivered. This is a canonical commitment (budget document, NATO formal process).
- $81.8B committed over 5 years — specific amount with timeline.
- 3.5% GDP long-term target — aspirational but stated.
- NORAD modernization commitment.
- Procurement commitments (specific equipment programs).

Assessment: Comprehensive commitments with specific targets, timelines, and international accountability mechanisms (NATO). The 3.5% target adds ambition beyond the 2% milestone. Grade: **A**.

Confidence: High.

**Execution lens: A**

Evidence decomposition:
- NATO 2% achieved and confirmed by NATO Secretary General Annual Report (March 26, 2026). This is not a government claim — it is independently verified.
- $81.8B authorized and disbursing (Budget 2025, Ch. 4).
- Procurement advancing (specific milestones cited in DND reports).
- One Canadian Economy Act (Bill C-5) passed — this is primarily trade execution but the defence-adjacent interprovincial barrier removal also contributes.

Implementation ladder: The spending commitment has reached "Outcome observed" — the highest stage. NATO independently confirmed the milestone.

Assessment: 2% target achieved and independently verified. Funding authorized and disbursing. Procurement advancing. This is the strongest execution case in the framework. Grade: **A**.

Confidence: High.

**Outcome lens: B**

Evidence decomposition:
- NATO 2% spending confirmed — but spending is an execution fact, not an outcome fact. The Outcome lens asks: has defence capability improved?
- Evidence of improved alliance standing: NATO confirmation of Canada meeting obligations. This is a measurable outcome (alliance compliance status changed from "not meeting" to "meeting").
- Procurement: advancing but most major equipment programs are not yet delivered. Outcome (capability in hand) is lagging execution (money spent).
- No independent assessment of force readiness improvement beyond the spending milestone.
- The 2% is a permanent milestone that cannot regress under current conditions — this limits outcome lens sensitivity.

Assessment: Alliance standing measurably improved (NATO compliance achieved). However, actual defence capability improvement (equipment delivered, force readiness enhanced) is not yet independently confirmed beyond the spending fact. Spending ≠ capability. Grade: **B** — some outcome indicators improving (alliance standing) but full capability outcomes not yet realized.

Confidence: Medium. Defence outcome evidence is thinner than execution evidence, as expected per Pilot-Templates.md.

**v1 comparison:** v1 sub-score A (4.0) vs shadow A (raw 3.75). Delta: -0.25. Minimal. The decomposition confirms Defence is an A-caliber achievement. The slight discount comes from the Outcome lens (B) recognizing that spending achievement (execution) does not automatically equal capability improvement (outcome). This is exactly the analytical distinction v2 is designed to surface.

---

### Trade Diversification (sub-construct) — v1 sub-score: B+

**Commitment lens: C**

Evidence decomposition:
- $5B Trade Diversification Corridors Fund — announced in Budget 2025, fund structure being designed. Specific commitment with funding amount.
- Buy Canadian procurement strategy — policy framework announced, implementation underway. Moderate specificity.
- Full foreign policy review — announced but not launched. No timeline. Vague.
- No stated US export share reduction target. The government has not committed to a specific diversification outcome threshold.
- Remove interprovincial trade barriers — delivered (One Canadian Economy Act). This is a commitment that was made and fulfilled.

Assessment: General diversification language with some specific instruments (Corridors Fund, Buy Canadian) but no stated US export share target or comprehensive trade diversification strategy with market-specific targets. The interprovincial barrier commitment was specific and delivered, but it is a domestic market commitment, not an export diversification target. Grade: **C** — partial commitments, some areas covered, targets vague or missing for the core diversification question.

Confidence: High.

**Execution lens: C**

Evidence decomposition:
- One Canadian Economy Act: Royal Assent June 26, 2025. Passed and operational — genuine execution at the highest implementation ladder stage.
- $5B Trade Diversification Corridors Fund: announced, fund structure being designed. NO disbursements yet. "Announced" to "Authorized" stage at best.
- Buy Canadian: framework announced, implementation underway across departments. "Implementing" stage but early.
- CETA trade: $134B. Existing agreement in use but utilization rate trend not cited.
- No new trade agreements ratified beyond existing CPTPP/CETA.
- Foreign policy review: not launched. "Announced" stage only.

Assessment: Mixed execution. One major instrument delivered (interprovincial trade reform). Core diversification programs (Corridors Fund, Buy Canadian) are early-stage. No new agreements ratified. The execution story is thinner than the v1 B+ blended grade suggests when commitment and outcome are stripped out. Grade: **C**.

Confidence: High.

**Outcome lens: B**

Evidence decomposition:
- Primary indicator: US export share 71.7% (2025 annual), down from 73%. StatsCan 12-10-0176-01.
- Non-US exports: +17.2% (full-year 2025). Broad-based growth.
- CETA trade: $134B.
- January 2026 monthly: -6.5% (volatile, single month — context only per Measure-Selection-Rules.md, cannot move grade).

Attribution qualifier: US export share decline is jointly determined by federal trade policy, global commodity prices, exchange rates, and private sector decisions. Federal attribution estimated at ~50%. The trade war itself drives some forced diversification — the external constraint is both the problem and part of the solution.

Assessment: Primary indicator showing downward trend in US dependency (73% → 71.7%). Non-US growth is broad-based (+17.2%). This is measurable diversification. However, the degree of federal attribution is uncertain (~50%), and global market conditions (exchange rates, commodity mix, tariff-driven trade diversion) are significant confounders. Grade: **B** — measurable improvement with attribution caveats. Not A because improvement is partially externally driven and share is still above 70%.

Confidence: Medium. Attribution uncertainty.

**v1 comparison:** v1 sub-score B+ (3.3) vs shadow B (raw 2.60). Delta: -0.70. This is the largest divergence in the pilot. The v1 B+ is driven primarily by the outcome data (US share declining, non-US growth strong). The shadow decomposition reveals that commitment (C) and execution (C) are materially weaker than the outcome (B). The government is getting outcome credit for trade diversification without having made specific diversification commitments or executed major diversification programs beyond the interprovincial reform. This is exactly the analytical insight v2 is designed to provide — the outcome may be partially market-driven rather than policy-driven.

---

## QA Results

- **Double-counting violations found:** 0. Each decomposition assigns evidence to one primary lens with documented secondary context uses.
- **Cross-dimension deconfliction violations:** 0. Defence NATO spending stays primary to Defence. Deficit figure stays primary to Fiscal Health. Trade metrics stay primary to Trade Diversification. Promise fulfillment stays blocked from all v2 lenses.
- **Contradictions found and resolved:** 1.
  - Immigration: High Commitment (B) + High Execution (B) + Lower Outcome (C). Resolved: outcomes lag execution in immigration — temp resident stock is declining but has not yet reached the 5% target. Logically consistent.
- **Contradictions found and unresolved (blocking):** 0.

---

## v1 Comparison Summary

| Dimension | v1 (GPA) | Shadow raw | Shadow display | Delta (raw) | Assessment |
|---|---|---|---|---|---|
| Immigration | C+ (2.3) | 2.67 | B | +0.37 | Shadow higher — v1 underweights strong execution |
| Housing Supply | D (1.0) | 1.15 | D | +0.15 | Negligible — decomposition confirms v1 |
| Fiscal Health | D (1.0) | 1.25 | D | +0.25 | Slight lift from execution (C) — government IS executing, direction is wrong |
| Defence (sub) | A (4.0) | 3.75 | A | -0.25 | Minimal — outcome lens (B) discounts spending-as-capability |
| Trade Div. (sub) | B+ (3.3) | 2.60 | B | -0.70 | Largest divergence — commitment/execution weakness exposed |
| D&T combined | A- (3.7) | 3.175 | B | -0.525 | Trade weakness pulls combined grade down |
| **Shadow GPA** | **1.65 (C-)** | **1.67** | **C-** | **+0.02** | **Headline unchanged** |

**Divergence assessment:** The shadow GPA (1.67) is essentially unchanged from v1 (1.65). The +0.02 delta is negligible — well within the sensitivity range already documented (v1 range: 1.45-1.68). The gains from Immigration (+0.37), Housing (+0.15), and Fiscal (+0.25) nearly offset the Defence & Trade loss (-0.525).

This means the value of v2 is not at the headline level. The headline stays C-. The value is at the dimension level — specifically:

1. **Trade Diversification** drops the most (-0.70) because the decomposition exposes that commitment and execution are both C while the v1 grade rode the B-level outcome. The government is benefiting from partially market-driven diversification without having committed to or executed a comprehensive diversification strategy.

2. **Immigration** rises the most (+0.37) because the decomposition gives separate credit for B-level commitment and execution that the v1 blended grade partially discounts by mixing in the C-level outcome.

3. **Fiscal Health** reveals a useful Execution/Outcome split — the government IS executing fiscal policy (C), but the direction produces D-level outcomes and the commitments lack credibility (D).

4. **Housing Supply** confirms v1. D across all lenses. No masking.

5. **Defence** confirms v1 at the display level (A) but the raw composite (3.75) is slightly below the v1 sub-score (4.0), reflecting the Outcome lens (B) recognition that spending ≠ capability.

---

## Design Observations

**What worked well:**
1. The lens decomposition for Immigration produced genuinely useful analytical separation. The v1 C+ masks that commitment and execution are both B-caliber while outcome lags at C. That tells a clearer story.
2. The Trade Diversification decomposition is the most analytically valuable result. It reveals that the v1 B+ is driven by outcome data (market-driven diversification) rather than strong commitment or execution. This is the exact kind of insight v2 was designed to provide.
3. The double-counting rules worked — no violations were found, and the deconfliction between Defence spending (Execution) and deficit (Fiscal Outcome) held cleanly.
4. The math layer is tractable. Five dimensions, three lenses each, one composite per dimension, one combined D&T entry, one shadow GPA. Total arithmetic is manageable within a monthly cycle.

**What was hard to score or ambiguous:**
1. The Commitment lens source carve-out worked but the boundary between "canonical government commitment document" and "PMO announcement" will need case-by-case judgment. The budget is clearly canonical; a ministerial press conference citing budget line items is less clear.
2. Fiscal Health Execution (C) required careful thinking — the government IS executing fiscal policy, it is just executing in a direction that produces bad outcomes. Separating "did they implement" from "was it good" is the right analytical distinction but takes discipline.
3. Defence Outcome (B) was the thinnest lens. Defence outcome evidence is inherently sparse at monthly intervals. The Pilot Template's note about scoring this lens cautiously is confirmed.

**Suggested design changes for next cycle:**
- None yet. The architecture performed adequately for the initial decomposition. Reserve judgment until new evidence is applied in the May cycle.

**Open questions surfaced:**
- None blocking. The rounding rule (midpoint, round up) and GPA computation rule (use raw composites) are now documented in the Computation Rules section above.
