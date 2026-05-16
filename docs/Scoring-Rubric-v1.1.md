# Canada Under Carney — Scoring Rubric

## Grading Methodology for Government Performance Assessment

**Version 1.1 · April 2026**
**Clarified:** April 30, 2026

This rubric defines the criteria used to assign grades across the policy dimensions evaluated in the *Canada Under Carney* dashboard. It is designed to make grading decisions transparent, replicable, and defensible. Any reader applying these criteria to the same evidence base should reach a substantially similar grade.

**v1.1 changes from v1.0:** Rubric modifiers operationalized with explicit grade adjustments. Dimension constructs clarified (Affordability Response, Economic Policy Response, Flagship Delivery, Carbon Pricing Policy). Sensitivity analysis framework added. Shadow test protocol for v2 structural changes.
**April 30 clarification pass:** Cross-dashboard threshold wording tightened so grade bands rely less on stand-alone judgment words and more on explicit evidence conditions.

---

## Grade Definitions

### A Range (3.7–4.0): Target Met or Exceeded

The government set a specific, measurable target. It was funded. Independent sources confirm delivery at or near the stated goal. The policy response matches the identified problem at the level the government itself said was necessary. Credit-claiming is supported by evidence.

| Grade | Criteria |
|-------|----------|
| **A** | Target fully met or exceeded. Delivery is independently confirmed, and any caveats do not change the result. Credit-claiming is proportionate to actual contribution. |
| **A-** | Core target is met, but delivery relies on a narrow margin, a partial accounting treatment, or one meaningful caveat that keeps the file short of a clean A. |

---

### B Range (2.7–3.3): Clear Progress With Measurable Execution

Measurable execution is underway, though delivery has not yet matched stated targets. The gap between commitment and result is explainable by timing, jurisdiction, or genuine external constraint rather than by simple inaction or overclaiming. Independent assessment is at least mixed-to-positive.

| Grade | Criteria |
|-------|----------|
| **B+** | Progress is strong enough that one additional cycle on the same path would plausibly reach the target. The remaining gap is small or largely outside federal control. |
| **B** | Measurable execution is underway, at least one core lever is live, and the remaining gap is real but explainable. |
| **B-** | Execution is real but too slow or too small to reach the stated target on the current path. |

---

### C Range (1.7–2.3): Response Exists but Remains Incomplete

A policy framework is in place, but delivery still covers only part of the target or part of the identified problem. Credit-claiming may exceed measurable results. Pace, scale, or follow-through remains inadequate, and some repackaging of pre-existing initiatives may be present.

| Grade | Criteria |
|-------|----------|
| **C+** | A real response exists and some delivery is visible, but it covers only part of what was promised or only part of what the problem requires. |
| **C** | A framework exists, but delivery is still partial, back-loaded, or mixed with repackaged or inherited momentum. |
| **C-** | A nominal response exists, but live execution or measurable impact is still thin. |

---

### D Range (0.7–1.3): Minimal Response or Major Reversal

The response is too small relative to the problem's scale, or a major reversal has occurred without an adequate substitute. The gap between announcements and outcomes is large, and the underlying trajectory is largely unchanged.

| Grade | Criteria |
|-------|----------|
| **D+** | A response is active, but it is clearly undersized relative to the stated problem, or a major reversal is only partly offset by context. |
| **D** | Fewer than the minimum conditions for a C are met. Execution remains thin and the underlying problem is largely unchanged. |
| **D-** | The response covers only a negligible share of the identified need or shortfall. |

---

### F (0.0): No Response or Active Deterioration

The government either took no material action on an acknowledged problem or actively made the inherited condition worse through policy choices. Reserved for cases where inaction or harm is clear and not explained by genuine external constraint.

---

## Operationalized Modifiers

The following modifiers have explicit, defined impacts on grade assignment. Each modifier has a trigger condition and a grade adjustment rule.

### Modifier 1: Timing Fairness

**Trigger:** The dimension involves structural challenges that cannot reasonably be resolved within the government's time in office.

**Rule:** For dimensions tagged "Moves quarterly+" or with lag classification "Long":
- Grade the **policy response and trajectory**, not the current outcome level
- A government that inherited a bad condition and has taken adequate corrective action receives a minimum of C (response exists) even if outcomes have not yet improved
- A government that inherited a bad condition and has NOT taken adequate action is graded on the inadequacy of the response, not the inherited level
- This modifier expires 24 months after the government takes office. After 24 months, outcomes become part of the grade.

**Currently applies to:** Economic Policy Response, Housing, Major Projects

### Modifier 2: Jurisdictional Limits

**Trigger:** The dimension involves policy areas where delivery depends on provincial, municipal, or other non-federal actors.

**Rule:**
- The federal government is graded on what it **promised, funded, and executed within its authority**
- It is NOT graded down for provincial non-cooperation it could not reasonably prevent
- It IS graded down for setting federal targets that require provincial action it has not secured through agreements, legislation, or incentives
- Where a federal-provincial partnership exists (e.g., Ontario housing deal), credit is given for the federal contribution only

**Grade adjustment:** If >50% of delivery depends on non-federal actors and no intergovernmental agreement exists, cap the maximum grade at C+ regardless of federal effort.

**Currently applies to:** Housing (municipal zoning, provincial codes), Affordability Response (provincial insurance, utilities)

### Modifier 3: External Constraint

**Trigger:** Genuine external pressures (trade war, global commodity prices, pandemic effects, geopolitical events) affect the dimension.

**Rule:**
- External constraint justifies **slower pace** but not **inaction**
- The modifier applies only to the portion of the policy challenge directly caused by the external factor
- If the government uses external constraint to justify policy reversals that go **beyond** what the constraint required, the modifier does not apply to the excess reversal
- The test: "Would this specific action have been necessary even without the external pressure?" If yes, external constraint does not explain it.

**Grade adjustment:** +0.3 GPA points (approximately one-third of a letter grade) for dimensions where external constraint demonstrably limits achievable outcomes, applied only when the government's response is adequate given the constraint.

**Currently applies to:** Affordability Response (tariff-driven cost increases), Climate & Energy (trade-war justification, partial), Economic Policy Response (global investment climate)

### Modifier 4: Credit-Claiming Penalty

**Trigger:** The government claims credit for outcomes it did not primarily cause — pre-existing projects, pre-existing trends, provincial or private-sector initiatives.

**Rule:**
- The test is counterfactual: "Would this outcome have occurred on a similar timeline without the government's intervention?"
- If the answer is "probably yes," the government does not receive credit for the outcome
- If the answer is "the government accelerated or enabled it," partial credit is given
- If the answer is "this is genuinely new," full credit is given

**Grade adjustment:** -0.3 GPA points (one-third of a letter grade) for dimensions where documented credit-claiming exceeds the counterfactual contribution. Applied only when independent sources (PBO, think tanks, media) have documented the overclaiming.

**Currently applies to:** Major Projects (most projects pre-existing), partially to Defence & Trade (accounting reclassification)

---

## Trigger Sourcing Conventions

Each dimension's `gradeTriggers.up[]` and `gradeTriggers.down[]` arrays specify the events or measurements that would move the grade. Each trigger carries one of three sourcing patterns:

1. **`sourceUrl`** — a specific URL pointing to the source that would carry the evidence (e.g., a PBO assessment page, a StatCan table, a CCI report). Most triggers use this pattern.

2. **`internalRef`** — an in-app navigation reference (e.g., to the project cohort view, to another dimension's scorecard). Used when the trigger evidence lives elsewhere in the dashboard rather than at an external URL.

3. **Event-driven (no `sourceUrl`, no `internalRef`)** — the trigger carries only a `sourceLabel` ending with `(event-driven)`. This is a deliberate convention for triggers whose source-family is known but whose specific URL varies by event. Examples: "Government of Canada carbon border-adjustment announcement (event-driven)", "Ethics source list / governance critiques (event-driven)", "IRCC service / permit data (event-driven)".

**Why the event-driven pattern exists:** for some triggers, the specific URL only becomes knowable when the event happens. A carbon border-adjustment announcement, when it lands, will live at whichever Department of Finance or PMO URL the government uses. A new Ethics Commissioner screening-inadequacy finding will live at whichever specific report page the Commissioner publishes. Listing a placeholder URL today would either (a) imply a specific source the dashboard cannot pre-commit to, or (b) require updating to a real URL at the moment the event occurs — which is editorial work the dashboard already does in the next cycle's update.

**Why this looks asymmetric in mechanical audits:** because some triggers carry sourceUrl and others carry only sourceLabel ending in `(event-driven)`, a mechanical comparison between a dimension's up-triggers and down-triggers may flag asymmetric sourcing. This is not asymmetric scoring — it is honest labeling of which trigger directions are URL-anchored vs event-driven. The current pattern, surfaced by the May bias-resistance audit, is documented here so readers can interpret the trigger panel correctly.

The audit may, in future cycles, recommend tightening some event-driven triggers to anchored URLs as evidence accumulates. The convention itself is intended to remain.

---

## Dimension Construct Definitions (v1.1)

Each dimension grades a specific, defined construct:

| Dimension | Construct | Type |
|-----------|-----------|------|
| Defence & Trade | Meeting stated defence targets and diversifying trade relationships | Mixed (action + outcome) |
| Major Projects | Creating effective institutional machinery for infrastructure delivery | Implementation |
| Fiscal Health | Fiscal trajectory sustainability and credibility of medium-term plan | Outcome |
| Economic Policy Response | Federal posture on productivity and competitiveness across funding, tax, regulatory, and trade levers | Action (not outcome) |
| Affordability Response | Adequacy of federal policy response to household cost pressure | Action (not price level) |
| Carbon Pricing Policy | Quality of policy handling of carbon pricing instruments | Action |
| Climate & Environment | Scale and coherence of environmental policy framework | Mixed (action + reversal) |
| Immigration | Adequacy of immigration level correction and framework design | Action + outcome |
| Housing | Scale and effectiveness of federal housing policy interventions | Mixed (action + outcome) |
| Ethics & Transparency | Adequacy of disclosure, screening, and conflict management when the officeholder presents non-routine conflict risk | Process |
| Flagship Delivery | Cross-cutting delivery capacity across 5 highest-profile files | Implementation |
| Promise Delivery | Rate of fulfillment of specific stated commitments | Accountability |

---

## Lightweight Sensitivity Analysis

The following sensitivity checks are published alongside the headline grades:

### Check 1: Jackknife (Drop-One-Dimension)

For each dimension, compute the GPA with that dimension removed. If removing any single dimension changes the headline grade by more than 0.3 GPA points, that dimension is flagged as a "swing dimension."

### Check 2: Attribution Weighting (Shadow)

Compute an alternative GPA where each dimension is weighted by attribution:
- Direct: 1.0x
- Mixed: 0.7x
- Mostly inherited: 0.55x

Report the attribution-weighted GPA alongside the equal-weight GPA. If they diverge by more than one letter grade, the dashboard should note the divergence.

### Check 3: Generous vs. Strict Timing

Compute grades under two scenarios:
- **Generous:** All dimensions with "Long" lag receive +0.3 timing adjustment
- **Strict:** No timing adjustment for any dimension

Report the range. This shows how sensitive the headline is to timing assumptions.

### Publication Rule

If any sensitivity check changes the headline grade by a full letter (e.g., D+ to C- or vice versa), the sensitivity result must be disclosed alongside the headline.

---

## Shadow Tests for v2.0 Structural Changes

Three structural changes are being evaluated for a future version. Shadow results are computed but not reflected in the live dashboard.

### Shadow Test A: Carbon Pricing merged into Climate

**What changes:** Carbon Pricing Policy is absorbed into Climate & Environment. The merged dimension grades both the policy framework and the carbon pricing instrument.

### Shadow Test B: Flagship Delivery eliminated

**What changes:** Flagship Delivery is removed. Implementation quality is assessed within each dimension's rubric as a sub-criterion.

### Shadow Test C: Attribution-adjusted weighting as headline

**What changes:** The Full Policy Audit headline uses attribution-weighted GPA instead of equal-weight GPA.

Shadow test results will be published in the May 2026 update.

---

## Grade Movement Rules

Grades change when the underlying evidence changes, not on a fixed schedule.

### Conditions for an Upgrade (+)
- New data shows measurable improvement in the key metric(s) for that dimension
- A major policy action addresses a previously identified gap
- Independent assessment (PBO, CMHC, Fitch, OECD) upgrades its outlook
- A previously stalled commitment shows credible momentum

### Conditions for a Downgrade (-)
- New data shows deterioration in key metric(s)
- A commitment is formally abandoned or scaled back
- Independent assessment downgrades its outlook
- A gap between announcement and delivery widens

### Conditions for No Change (=)
- New data is consistent with the existing trend
- No major policy action has occurred
- The dimension is in a "too early to judge" holding pattern

### Documentation Requirement
Every grade change must be accompanied by: (1) the specific new evidence that triggered the change, (2) which rubric criterion applies, (3) whether any modifier was applied and why, and (4) the date of the change.

---

## Aggregate Grade Calculation

**Household Impact:** Double-weights dimensions most directly affecting household economic life: Fiscal Health, Housing, Affordability Response, and Economic Policy Response.

**Full Policy Audit:** Equal weight across all dimensions.

Both are reported. The choice of weighting is an editorial judgment disclosed transparently.

---

## Cross-Government Portability

This rubric is designed to apply to any Canadian federal government. The grade definitions, modifier rules, and construct definitions do not reference any specific party, PM, or ideology. A future version of this dashboard could track a different government using the same framework without rule changes.

---

*Scoring Rubric v1.1 · April 2026*
*Changes from v1.0: Modifiers operationalized, constructs clarified, sensitivity analysis added, shadow test protocol established.*
