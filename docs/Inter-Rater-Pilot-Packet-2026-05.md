# Inter-Rater Pilot Packet - May 2026

- **Purpose:** Give an outside rater enough evidence and rules to independently grade three dimensions without seeing the published grade, editor rationale, judgment call, perspectives, or active modifier selection.
- **Status:** AI packet QA complete (2026-06); fixes needed before the first human rater run. See [Inter-Rater-Pilot-AI-QA-2026-06.md](Inter-Rater-Pilot-AI-QA-2026-06.md).
- **Snapshot:** Dashboard data reviewed through 2026-04-30.
- **Important:** This is a frozen snapshot packet. The live dashboard may have moved past this evidence date. Your answers will be compared against the 2026-04-30 snapshot grade, not today's published grade.
- **Rater materials:** This packet is self-contained. Use only this packet and the external source links inside it before submitting the worksheet.

---

## Instructions For The Rater

Please grade each dimension using only this packet and the external source links inside the Source List sections. Before submitting your worksheet, do not open the live dashboard, `src/data/dimensions.json`, the changelog, Git history, beta-feedback docs, canonical scoring docs, current dimension cards, or rationale fields.

Your task is not to decide whether you personally agree with the government's policy direction. Your task is to apply the published scoring rules to the provided evidence and choose the grade that follows from those rules.

For each dimension, submit:

1. Construct restatement in your own words.
2. Letter band before plus/minus.
3. Plus, flat, minus, or whole-letter-only treatment.
4. Active modifiers, if any.
5. Final grade.
6. Confidence: Low, Medium, or High.
7. Any evidence gaps or rubric ambiguities that affected your grade.

---

## What Was Redacted

This packet intentionally removes:

- the current published grade
- the editor's current rationale
- the editor's current `gradeBasis`
- the editor's judgment-call fields
- current active-modifier selections
- perspectives / critics / defenders prose
- changelog entries that reveal grade movement

The packet keeps:

- construct definitions
- grade thresholds
- modifier rules
- deconfliction rules
- raw metrics
- source lists
- one-notch move triggers
- source-role guidance

---

## Shared Grading Rules

### Letter Bands

| Band | General meaning |
|---|---|
| A | Target met or exceeded. Delivery independently confirmed. Caveats do not change the result. |
| B | Clear progress with measurable execution. At least one core lever is live and remaining gap is explainable. |
| C | Response exists but remains incomplete. Delivery is partial, back-loaded, or mixed with inherited momentum. |
| D | Minimal response or major reversal. Response is undersized or execution remains thin. |
| F | No material response or active deterioration. |

### Plus / Minus Rules

Start at the straight letter band.

Plus requires all of:

- the dimension meets its letter threshold and sits above the floor of that band
- at least one primary indicator shows measurable positive momentum toward the next band
- no material caveat undermines the positive signal

Example pattern: a file that barely clears a C threshold but has no measurable movement toward B stays flat C, not C+.

Minus requires any of:

- documented accounting caveats or methodology questions
- one strong sub-file masks weakness elsewhere
- evidence is thinner than other dimensions at the same letter
- the response covers only a negligible share of identified need

Straight letter applies when neither plus nor minus condition is met, or when the dimension is whole-letter-only.

### Modifiers

| Modifier | Trigger | Effect |
|---|---|---|
| Timing fairness | Structural files where outcomes cannot reasonably move within the government's time in office | Grade the policy response and trajectory, not inherited outcome levels. |
| Jurisdictional limits | Delivery depends heavily on provincial, municipal, or other non-federal actors | If more than 50% of delivery depends on non-federal actors and no agreement exists, maximum grade is C+. |
| External constraint | Genuine external pressure affects the dimension | +0.3 GPA only when the government's response is adequate given that constraint. Constraint excuses slower pace, not inaction. |
| Credit-claiming penalty | Government claims credit for outcomes it did not primarily cause | -0.3 GPA where documented overclaiming exceeds counterfactual contribution. |

---

## Dimension 1: Fiscal Health

### Construct

The sustainability of the federal fiscal trajectory and the credibility of the medium-term fiscal plan.

### Type And Attribution

- Type: Outcome
- Attribution: Federal 80%; shared 10%; external 10%
- Primary evidence home: deficit, debt, PBO confidence, credit ratings, debt servicing costs

### Minimum Indicators

- Deficit, absolute and as percent of GDP
- Net debt trajectory
- PBO confidence in medium-term targets
- Sovereign credit rating and outlook
- Debt service costs versus GST revenue

### Grade Thresholds

| Grade | Threshold |
|---|---|
| A | Balanced budget or surplus. Debt-to-GDP declining. PBO confidence above 80%. No rating-pressure warning. |
| B | Deficit below 2% GDP. Published medium-term anchor. PBO confidence 50-80%. No active rating warning. |
| C | Deficit 2-4% GDP. Anchor published, but PBO confidence only 25-50% or at least one rating agency flags a material caveat. |
| D | Deficit above 4% GDP. PBO confidence below 25%. Anchor absent or repeatedly missed. Rating pressure active. |
| F | Actual downgrade or clear fiscal-crisis dynamic. |

### Modifier Guidance

- Apply the External Constraint rule if your reading of the evidence shows a genuine external pressure affected the fiscal trajectory.
- If you apply it, identify which part of the fiscal picture the constraint explains and which part remains a discretionary federal choice.
- Apply the other modifier rules only if the evidence meets their trigger conditions.

### Deconfliction

- Deficit, debt, PBO fiscal confidence, and rating-agency actions are primary-homed here.
- Affordability Response grades the adequacy of household relief programs, not fiscal sustainability.
- NATO spending is primary-homed in Defence & Trade and can appear here only as fiscal context.

### Raw Metrics

| Metric | Value | Source | Notes |
|---|---|---|---|
| Deficit, FY 2025-26 projected | $78.3B | Finance Canada | Budget projection, not actual outturn. |
| Working nominal GDP denominator | about $2.94T | computed | Approximate denominator included only so the rater can apply the deficit-as-percent-of-GDP threshold. |
| Deficit as percent of GDP | about 2.7% | computed | Derived from $78.3B deficit / about $2.94T working denominator. |
| Federal debt, 2024-25 | $1.27T | Finance Canada | Federal debt / accumulated deficit. Different from Budget 2025 net debt concept. |
| Fitch rating | AA+ stable outlook, fiscal concerns noted | Manual rating check | Event-driven source; next update depends on rating-agency action or statement. |
| PBO confidence in targets | 7.5% | PBO | Confidence in stated fiscal targets. |

### Source List

- [Budget 2025](https://budget.canada.ca/2025/report-rapport/anx1-en.html)
- [PBO fiscal analysis](https://www.pbo-dpb.ca/en/publications/RP-2526-017-S--budget-2025-issues-parliamentarians--budget-2025-enjeux-parlementaires)
- [C.D. Howe analysis](https://cdhowe.org/publication/fiscal-fantasies-four-incredible-projections-in-the-november-2025-federal-budget/)
- [Annual Financial Report FY 2024-25](https://www.canada.ca/en/department-finance/services/publications/annual-financial-report/2025.html)
- [IMF Article IV, Jan 2026](https://www.imf.org/en/publications/cr/issues/2026/01/21/canada-2025-article-iv-consultation-press-release-and-staff-report-573340/)

### One-Notch Move Triggers

Up:

- PBO confidence rises above 25%.
- Fitch removes its warning.

Down:

- Actual downgrade.
- Deficit exceeds $90B without new revenue.

### Source-Role Guidance

| Role | Preferred sources |
|---|---|
| Measurement truth | Finance Canada fiscal tables, PBO fiscal confidence metrics |
| Policy truth | Budget 2025 and official fiscal-policy documents |
| Execution truth | Annual Financial Report, realized fiscal outturns, Fiscal Monitor updates |
| Independent challenge truth | PBO, IMF, rating agencies, C.D. Howe, IFSD |
| Context truth | Clearly attributed fiscal commentary |

---

## Dimension 2: Affordability Response

### Construct

The adequacy of the federal policy response to household cost pressure from groceries, tariffs, and targeted relief.

### Type And Attribution

- Type: Action
- Attribution: Federal 60%; shared 20%; external 20%
- Primary evidence home: food CPI, grocery benefit amounts, tariff household cost estimates, food insecurity data

### Scope

In scope:

- groceries
- tariff-driven cost increases
- targeted federal relief

Out of scope:

- rents, primary home is Housing Supply
- utilities, shared jurisdiction
- insurance, provincial
- transportation, mixed jurisdiction

### Minimum Indicators

- Food CPI year-over-year
- Grocery benefit amount per household
- Tariff household cost burden estimate
- Food insecurity population

### Grade Thresholds

| Grade | Threshold |
|---|---|
| A | Federal relief covers more than 80% of the identified annual cost increase, and at least one mandatory competition or market-conduct reform is enacted. |
| B | Federal relief covers 40-80% of the cost increase, and at least one enforceable competition or compliance measure is in force. |
| C | Federal relief covers 20-40% of the cost increase, and targeted programs are live, but the competition response remains voluntary or partial. |
| D | Federal relief covers less than 20% of the cost increase, voluntary or narrow measures dominate, and food insecurity remains elevated or rising. |
| F | No material federal relief or competition response is in place. |

### Modifier Guidance

- External constraint may apply if tariff-driven costs demonstrably exceed what domestic policy can offset.
- External constraint only helps the grade if the federal response is adequate given the constraint.
- Apply Jurisdictional Limits if your reading of the evidence shows more than 50% of delivery depends on non-federal actors and no intergovernmental agreement exists. The federal relief instruments are described in the metrics above; the rater's job is to decide whether the modifier threshold is met.

### Deconfliction

- Food CPI and tariff household cost burden are primary-homed here.
- Housing costs are primary-homed in Housing Supply.
- Consumer carbon tax elimination is primary-homed in Carbon Pricing Policy; household savings can appear here as context.
- Unemployment and LFS data are context only and primary-homed in Economic Policy Response.

### Raw Metrics

| Metric | Value | Source | Notes |
|---|---|---|---|
| Food CPI, stores YoY, Feb 2026 | 4.1% | Statistics Canada | Food purchased from stores rose 4.1% in February 2026. |
| Family of 4 food cost, 2026 | $17,572/yr | Dalhousie | Annual food-cost estimate. |
| Grocery benefit | about $307/household incremental | PBO | Costed federal benefit amount. |
| Food insecure Canadians | about 10M | PROOF | Household food insecurity estimate. |

### Source List

- [StatsCan CPI Feb 2026](https://www150.statcan.gc.ca/n1/daily-quotidien/260316/dq260316a-eng.htm)
- [Dalhousie Food Price Report](https://www.dal.ca/sites/agri-food/research/canada-s-food-price-report-2026.html)
- [PROOF food insecurity 2024](https://proof.utoronto.ca/2025/new-data-on-household-food-insecurity-in-2024/)
- [PBO - Canada Groceries and Essentials Benefit](https://www.pbo-dpb.ca/en/publications/LEG-2526-010-S--canada-groceries-essentials-benefit--allocation-canadienne-epicerie-besoins-essentiels)
- [CRA - Canada Groceries and Essentials Benefit](https://www.canada.ca/en/revenue-agency/services/child-family-benefits/canada-groceries-essentials-benefit.html)
- [Canada Grocery Code official site](https://canadacode.org/)

### One-Notch Move Triggers

Up:

- New federal benefit above $500 per household announced and funded.
- Mandatory grocery competition measure enacted.

Down:

- Food CPI exceeds 7%.
- Grocery benefit expires without replacement.
- Food insecurity exceeds 12M.

### Source-Role Guidance

| Role | Preferred sources |
|---|---|
| Measurement truth | StatsCan food CPI, PBO tariff-burden and benefit-costing, PROOF food insecurity |
| Policy truth | Budget, GST-credit, grocery-benefit, Grocery Code, tariff or relief documents |
| Execution truth | Operational proof that benefits were delivered and the Grocery Code was in force |
| Independent challenge truth | PBO, PROOF, disclosed-methodology affordability analysis, Dalhousie |
| Context truth | Mainstream affordability reporting and retail-concentration coverage |

---

## Dimension 3: Ethics & Transparency

### Construct

The adequacy of the federal ethics framework when the officeholder presents non-routine conflict risk. The current officeholder's financial and professional background sets the specific disclosure demand the framework is being measured against.

### Type And Attribution

- Type: Process
- Attribution: Federal 95%; external 5%
- Primary evidence home: Ethics Commissioner actions, disclosure completeness, conflict screening status, independent reviews

### Minimum Indicators

- Ethics Commissioner review status
- Disclosure completeness
- Conflict screening status
- Independent governance or committee-review status

### Grade Thresholds

| Grade | Threshold |
|---|---|
| A | Full public disclosure. Independent review completed and published. No unresolved framework gap remains. |
| B | Substantial disclosure. Ethics Commissioner review published with findings of adequate screening. Only limited unresolved gaps remain. |
| C | Baseline disclosure and an ethics screen exist, but important completeness questions remain and no independent review has been published. |
| D | Important disclosure gaps remain, no independent review is published, and either an official concern or two independent governance critiques cite a screening or disclosure problem. |
| F | Active concealment or evidence of self-dealing. |

### Modifier Guidance

- Apply each modifier rule independently against the evidence. If you conclude no modifier applies, mark each modifier as "does not apply" with the reason.
- This is a whole-letter-only probation dimension. Do not assign plus/minus precision unless the protocol is changed.

### Deconfliction

- Ethics Commissioner findings and Brookfield disclosure are primary-homed here.
- Brookfield conflict perception may appear in Carbon Pricing Policy only as context.
- No other dimension grades disclosure or conflict of interest.

### Raw Metrics

| Metric | Value | Source | Notes |
|---|---|---|---|
| Ethics Commissioner review | Not published | Office public materials | No PM-specific review found in current public materials. |
| Blind trust status | Established | PM blind-trust summary statement | Summary statement records divestment of listed assets into a blind trust. |
| Agreed measure filing | Filed | Annex A public declaration | Public declaration of agreed measure is published. |
| Conflict screening scope | Declared in Annex A | Annex A public declaration | Annex A lists entities covered by the agreed measure and ethics screen. |
| Committee / governance review | ETHI report published; no Commissioner review | House ETHI report / Commissioner registry | Committee review addresses conflict-screen reporting; PM-specific Commissioner review remains unpublished. |

### Source List

- [Globe and Mail - ethics filing](https://www.theglobeandmail.com/politics/article-ethics-screen-carney-brookfield/)
- [CBC - financial assets](https://www.cbc.ca/news/politics/mark-carney-financial-assets-1.7583443)
- [Democracy Watch critique](https://democracywatch.ca/pm-carneys-ethics-screen-and-blind-trust-are-loophole-filled-unethical-smokescreens/)
- [House ETHI report - Review of the Conflict of Interest Act](https://www.ourcommons.ca/documentviewer/en/45-1/ETHI/report-5/page-96)
- [Office of the Ethics Commissioner - registry and reviews](https://ciec-ccie.parl.gc.ca/en/)
- [PM blind-trust summary statement](https://prciec-rpccie.parl.gc.ca/Lists/Declarations/Attachments/43657/Appendix%20Summary%20Statement%20-%20Annexe%20Declaration%20Sommaire.pdf)
- [PM Annex A public declaration of agreed measure](https://prciec-rpccie.parl.gc.ca/Lists/Declarations/Attachments/43653/Annex%20A%20-%20Public%20Declaration%20of%20Agreed%20Measure.pdf)

### One-Notch Move Triggers

Up:

- Ethics Commissioner publishes a detailed review finding adequate disclosure.
- PM proactively publishes full Brookfield accounting.

Down:

- New evidence of undisclosed interests.
- Ethics Commissioner finds screening inadequate.
- Two or more listed governance sources publish a material disclosure or screening gap finding.

### Source-Role Guidance

| Role | Preferred sources |
|---|---|
| Measurement truth | Not applicable; this is a process and framework file. |
| Policy truth | Office of the Ethics Commissioner filings, official PM disclosure records, commissioner registry entries |
| Execution truth | Published review status, evidence that an ethics screen or blind trust is active |
| Independent challenge truth | Democracy Watch critique, published committee findings, governance-law commentary |
| Context truth | Reporting on Brookfield background, conflict perception, and novelty of the case |

### Rater Warning

Grade the framework, not the person. The question is whether the ethics framework is adequate to the non-routine disclosure demands created by the officeholder's background. Evidence for framework adequacy comes from disclosure, screening, and independent review actions rather than the absence of public concerns alone.

---

## Worksheet Template

Copy once per dimension.

```text
Dimension:
Rater:
Date:

1. Construct restated in your own words:


2. Band pick before plus/minus:
   Band:
   Threshold clause used:


3. Plus / flat / minus / whole-letter-only:
   Choice:
   Rule or clause used:


4. Active modifiers:
   Timing fairness:
   Jurisdictional limits:
   External constraint:
   Credit-claiming penalty:


5. Final grade:


6. Confidence:
   Low / Medium / High


7. Notes on evidence, source quality, scope, or rubric ambiguity:


```

---

## Submission

Return the three completed worksheets before checking the live dashboard, local data files, governance docs, changelog, or Git history. After submission, the editor compares the rater grades against the published snapshot using [Inter-Rater-Pilot-Results-Template-2026-05.md](Inter-Rater-Pilot-Results-Template-2026-05.md).

This packet is frozen to the 2026-04-30 dashboard snapshot. If you check the live dashboard after submitting and see a different grade or newer metric, that means the live dashboard moved forward after the snapshot. It does not change the comparison target for this pilot.
