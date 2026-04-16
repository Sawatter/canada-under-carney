# Pilot Templates

- **Purpose:** Provide full operational scoring templates for the five pilot constructs, including lens definitions, metrics, source rules, blocking conditions, deconfliction, triggers, and worked examples.
- **Status:** Draft — not for public use. Shadow scoring only.
- **Last updated:** 2026-04-15
- **Depends on:** Core-Tri-Lens-Architecture.md, Dimension-Applicability-Matrix.md, Canonical-Scoring-Sheets.md, Deconfliction-Matrix.md, Measure-Selection-Rules.md, QA-Gatekeeping-Rules.md
- **Used by:** Shadow-Run-Workflow.md, Open-Design-Decisions.md

---

## Common Rules (apply to all pilot templates)

1. **Grade scale:** Whole-letter only (A, B, C, D, F). No plus/minus for v2 pilot lens scores.
2. **Source requirement:** Execution and Outcome lenses must cite at least one Tier 1 or Tier 2 source; Tier 4 alone blocks. **Commitment lens exception:** Canonical government commitment documents (federal budget, throne speech, mandate letters, published platform, departmental plans, gazetted strategies) may move the Commitment lens directly as primary evidence. Press releases, PMO announcements, and ministerial statements remain Tier 4 and cannot move the Commitment lens alone without Tier 1/2 corroboration of the commitment's specificity and scope.
3. **Double-counting rule:** The same fact cannot move more than one lens unless the different analytical role in each lens is explicitly documented in the release log.
4. **Confidence tag:** Each lens carries its own confidence tag (High / Medium / Low).
5. **Blocking conditions:** All 6 QA blocking conditions (Rule 6) apply to each lens independently.
6. **Movement rule:** Every lens grade change requires: (a) specific new evidence, (b) lens-specific criterion met, (c) modifier application rationale if applicable, (d) date.

---

## Pilot 1: Immigration

**v1 status:** C+ (Stable). Federal attribution: 90%. Confidence: High.
**Construct type:** Action + Outcome.
**v2 lens profile:** Full tri-lens (Commitment: Yes, Execution: Yes, Outcome: Yes).
**Composite weights:** 0.33 / 0.34 / 0.33 (equal tri-lens).

### Commitment Lens

**What it measures:** Scope and specificity of federal commitments on immigration levels, processing, integration, and temporary resident management.

**Primary metrics:**
- Immigration Levels Plan: published with specific targets by category (economic, family, refugee, humanitarian)
- Temporary resident reduction targets: specific numbers and timelines
- Processing time commitments: stated service standards

**Allowed sources:** Tier 1 (IRCC operational data, StatsCan), Tier 2 (think tanks analyzing commitment specificity). Tier 4 (PMO announcements) is context only — cannot move the Commitment lens grade unless corroborated by Tier 1/2 analysis of commitment specificity.

**Grade thresholds:**
| Grade | Criteria |
|---|---|
| A | Comprehensive levels plan with category-specific targets, processing standards, and integration commitments, all with timelines |
| B | Levels plan published with most categories covered; some targets lack timelines or specificity |
| C | Partial commitments — levels plan exists but major categories lack targets, or commitments are vague |
| D | Minimal commitments — no levels plan, or plan lacks meaningful targets; material retreats from prior commitments |
| F | No meaningful immigration commitments or wholesale abandonment |

**Blocking conditions (lens-specific):**
- Blocked if commitment evidence is based solely on media reporting of "leaked" plans without official publication
- Blocked if commitment assessment mixes IRCC operational categories with StatsCan population categories

**Upgrade triggers:** New levels plan published with greater specificity; new processing time commitments with measurable targets.
**Downgrade triggers:** Formal withdrawal of prior targets; levels plan delayed or published without category specificity.

### Execution Lens

**What it measures:** Whether committed immigration actions have been authorized, funded, legislated, and operationally implemented.

**Primary metrics:**
- Temporary resident cap: operational enforcement status (announced → legislated → enforced)
- Processing time performance vs. stated service standards
- Integration program funding: authorized and disbursing vs. announced only
- Levels plan adherence: actual admissions vs. plan targets by category

**Allowed sources:** Tier 1 (IRCC quarterly operational reports, StatsCan quarterly population estimates), Tier 2 (policy analysis of implementation status). Tier 3 (media) can corroborate but not lead.

**Grade thresholds:**
| Grade | Criteria |
|---|---|
| A | Levels plan targets operationally met; temporary resident cap enforced; processing times meeting service standards; integration funding disbursing |
| B | Most targets being met; enforcement operational with minor gaps; processing times improving toward standards |
| C | Mixed — some targets met, others stalled; enforcement partially implemented; material gaps in disbursement or processing |
| D | Most commitments remain at announcement or early implementation; enforcement not operational; significant processing backlogs |
| F | No meaningful implementation of stated commitments |

**Implementation ladder application:** Grade requires evidence at "Authorized" stage or higher for the primary commitment. A bill introduced but not passed scores lower than a bill passed and funded.

**Blocking conditions (lens-specific):**
- Blocked if execution assessment relies on IRCC press releases without operational data confirmation
- Blocked if processing time data mixes different application categories

**Upgrade triggers:** Cap enforcement begins producing measurable intake reduction; processing times cross service standard threshold; integration funding reaches disbursement stage.
**Downgrade triggers:** Cap enforcement suspended or delayed; processing backlogs increase; funding authorized but not disbursed for >6 months.

### Outcome Lens

**What it measures:** Whether real-world immigration conditions have measurably changed — population composition, temporary resident stock, labor market integration outcomes.

**Primary metrics:**
- Non-permanent resident stock (total count): StatsCan 17-10-0009-01 (quarterly). THIS IS THE PRIMARY MEASURE. Cannot be mixed with IRCC operational counts.
- Net change in temporary residents quarter-over-quarter
- Immigrant unemployment rate vs. national average (integration proxy)

**Allowed sources:** Tier 1 only for grade-moving evidence (StatsCan population estimates). Tier 2 for context. IRCC operational counts are secondary context, not primary outcome evidence.

**Grade thresholds:**
| Grade | Criteria |
|---|---|
| A | Non-permanent resident stock declining toward stated target; immigrant labor market outcomes improving measurably |
| B | Stock stabilizing with clear downward trajectory; labor market gap narrowing |
| C | Stock flat or mixed signals; no sustained improvement or deterioration |
| D | Stock continuing to grow or no measurable progress toward reduction targets; integration outcomes stagnant |
| F | Stock accelerating growth; integration outcomes deteriorating |

**Modifier application:**
- Timing fairness: Does not apply (immigration is NOT tagged "Moves quarterly+" — federal attribution is 90% and data is quarterly).
- Jurisdictional limits: Does not apply (federal attribution 90%).

**Blocking conditions (lens-specific):**
- Blocked if outcome assessment uses a single quarterly data release without comparison to prior quarter
- Blocked if StatsCan population estimates are mixed with IRCC operational counts in the same assessment

**Upgrade triggers:** Two consecutive quarterly StatsCan releases showing non-permanent resident stock declining.
**Downgrade triggers:** Two consecutive quarterly releases showing stock increasing or flat despite enforcement.

### Deconfliction Across Lenses

| Evidence type | Primary lens | Secondary use | Rule |
|---|---|---|---|
| Levels Plan publication | Commitment | Context for Execution (scope of what must be implemented) | Cannot count publication itself as execution |
| Temporary resident cap legislation passed | Execution | Updates Commitment if cap changes the original target scope | Legislation passage is execution; if it changes the target, that is a separate commitment fact |
| StatsCan quarterly population estimate | Outcome | Context for Execution (whether enforcement is producing results) | Population data is outcome evidence; it cannot move the Execution lens directly |
| IRCC processing time improvement | Execution | Context for Outcome | Processing time is an operational measure (execution); downstream population effects are outcome |
| Promise Tracker: immigration promise fulfilled | Blocked from all v2 lenses | Context only | Promise fulfillment counts are deconflicted to Promise Delivery tracker; cannot move any dimension lens |

### Worked Example

**New fact:** StatsCan releases Q1 2026 population estimates showing non-permanent resident stock declined by 47,000 from Q4 2025, the first quarterly decline since 2021.

**Commitment lens:** No change. This is outcome data, not a commitment. The government's commitment to reduce temporary residents was already scored when the levels plan and cap targets were published. **Role: blocked (outcome data, not commitment evidence).**

**Execution lens:** No direct change. The stock decline may suggest enforcement is working, but the execution lens requires operational evidence of enforcement (e.g., cap enforcement data, visa refusal rates, program operational status), not downstream population effects. **Role: secondary context only.** The release log should note: "Q1 population decline is consistent with cap enforcement being operational, but does not independently confirm enforcement status. Execution lens grade unchanged pending IRCC operational data."

**Outcome lens:** Grade upgrade candidate. This is primary evidence from a Tier 1 source (StatsCan) showing the primary indicator crossing a meaningful threshold. If Q4 2025 also showed decline or stabilization, this is the second consecutive signal, meeting the "sustained trend" requirement. Upgrade from current shadow Outcome grade is justified if QA checks pass. **Role: primary evidence, grade-moving.**

**Double-counting check:** The population decline is used in the Outcome lens only. It appears as context in the Execution assessment but does not move the Execution grade. No double-counting.

---

## Pilot 2: Housing Supply

**v1 status:** D (Stable). Federal attribution: 30% (lowest in framework). Confidence: Medium.
**Construct type:** Mixed (action + outcome).
**v2 lens profile:** Execution-led (Commitment: Partial, Execution: Yes, Outcome: Partial).
**Composite weights:** 0.15 / 0.60 / 0.25 (execution-led).

### Commitment Lens

**What it measures:** Scope and specificity of federal housing supply commitments — targets, funding pledges, regulatory reform promises.

**Primary metrics:**
- Housing starts targets (if stated)
- Funding commitments: total amounts and timelines for housing programs (Housing Accelerator Fund, CMHC financing, etc.)
- Regulatory reform commitments: zoning incentives, federal land release targets

**Allowed sources:** Tier 1 (budget documents, CMHC), Tier 2 (policy analysis). Tier 4 (PMO announcements) is context only.

**Grade thresholds:**
| Grade | Criteria |
|---|---|
| A | Comprehensive targets with specific unit counts, funding amounts, timelines, and accountability mechanisms |
| B | Substantial commitments covering most housing supply levers; some gaps in specificity or timelines |
| C | Partial commitments — some programs announced, but targets are vague, timelines missing, or major supply levers unaddressed |
| D | Minimal commitments — few specific pledges; reliance on existing programs without new targets |
| F | No meaningful housing supply commitments |

**Blocking conditions:** Blocked if commitment assessment credits provincial or municipal pledges as federal commitments.

**Upgrade triggers:** New housing program announced with specific unit targets, funding amounts, and disbursement timelines.
**Downgrade triggers:** Withdrawal or reduction of prior commitments; stated targets reduced without explanation.

### Execution Lens

**What it measures:** Whether federal housing commitments have been authorized, funded, and operationally implemented.

**Primary metrics:**
- Housing Accelerator Fund: applications approved and agreements signed vs. announced total
- CMHC financing programs: loans disbursed vs. authorized
- Federal land identified and transferred for housing development
- 7-stage pipeline status for each major program: Announced → Introduced → Passed → Authorized → Disbursing → Delivering → Completed

**Allowed sources:** Tier 1 (CMHC operational data, PBO program analysis), Tier 2 (think tank implementation assessments). Media reporting of "shovels in the ground" requires CMHC confirmation.

**Grade thresholds:**
| Grade | Criteria |
|---|---|
| A | Major programs past "Disbursing" stage; funding flowing to projects; federal land transfers operational |
| B | Most programs at "Authorized" or "Disbursing"; minor gaps in implementation |
| C | Mixed — some programs disbursing, others still at "Announced" or "Introduced"; material pipeline blockages |
| D | Most programs at announcement or early legislative stage; funding authorized but not disbursed |
| F | No meaningful implementation of housing commitments |

**Implementation ladder:** Enforced strictly. The 7-stage housing pipeline from Measure-Selection-Rules.md is the primary tracking tool. Every program must be tagged with its current stage.

**Blocking conditions:**
- Blocked if execution assessment credits "Announced" programs as implemented
- Blocked if CMHC operational data is more than one quarter old without staleness qualifier

**Upgrade triggers:** Major program moves from "Authorized" to "Disbursing"; federal land transfer completes; Housing Accelerator agreements exceed 50% of target.
**Downgrade triggers:** Program funding lapses without disbursement; major program stalls at "Introduced" for >6 months.

### Outcome Lens

**What it measures:** Whether housing supply conditions have measurably improved — starts, completions, affordability of new supply.

**Primary metric:** Housing starts SAAR (CMHC monthly). Cannot mix SAAR and annual actual totals without labeling.

**Allowed sources:** Tier 1 only for grade-moving evidence (CMHC monthly starts data). Tier 2 for context.

**Grade thresholds (from Canonical-Scoring-Sheets.md):**
| Grade | Criteria |
|---|---|
| A | Starts >450K SAAR sustained |
| B | Starts 350K-450K SAAR sustained |
| C | Starts 280K-350K SAAR sustained |
| D | Starts <280K SAAR |
| F | Starts collapsing below 200K SAAR |

**Modifier application:**
- Jurisdictional limits: Applies with full force. Federal attribution is 30%. If starts improve, the federal share of credit is limited. Outcome lens carries mandatory attribution qualifier: "Federal contribution to outcome is estimated at ~30%. Provincial, municipal, and market factors account for the majority of housing supply variation."
- Timing fairness: Applies. Housing is tagged "Moves quarterly+" with lag "Long". Cannot downgrade Outcome lens below C in first 24 months (expires March 2027) unless deterioration is clearly policy-caused.

**Blocking conditions:**
- Blocked if outcome assessment uses a single monthly SAAR print without 3-month trend context
- Blocked if starts data mixes SAAR and annual actual totals
- Blocked if attribution qualifier is absent

**Upgrade triggers:** Three consecutive monthly SAAR prints above 280K (crossing from D to C range).
**Downgrade triggers:** Three consecutive monthly SAAR prints showing sustained decline; annual completions data showing pipeline shrinkage.

### Deconfliction Across Lenses

| Evidence type | Primary lens | Secondary use | Rule |
|---|---|---|---|
| Housing Accelerator Fund announcement | Commitment | Context for Execution (defines what must be implemented) | Announcement ≠ implementation |
| CMHC reports HAF agreements signed and disbursing | Execution | Context for Outcome (funded programs should eventually produce starts) | Disbursement is execution; starts data is outcome |
| CMHC monthly housing starts SAAR | Outcome | Context for Execution (whether implementation is producing results) | Starts data cannot move Execution lens directly |
| Federal land transfer completed | Execution | Context for Outcome (transferred land should eventually produce units) | Transfer is execution; units built is outcome |
| Flagship Delivery references housing as "Stalled" | Blocked from all Housing v2 lenses | v1 Flagship Delivery only | Deconfliction: Flagship references housing evidence as delivery indicator, not as Housing dimension scoring evidence |

### Worked Example

**New fact:** CMHC reports that the Housing Accelerator Fund has signed agreements covering 112,000 units, reaching 70% of its 160,000-unit target, with $1.2B of $4B disbursed to municipalities.

**Commitment lens:** No change. The HAF's target of 160,000 units was already scored when the commitment was made. This new data is about implementation progress, not a change in commitment scope. **Role: blocked (execution evidence, not commitment evidence).**

**Execution lens:** Grade upgrade candidate. This is primary evidence from a Tier 1 source (CMHC operational data) showing a major program moving from "Authorized" to "Disbursing" at meaningful scale (70% of target agreements signed, $1.2B flowing). This directly answers the execution question: is the government implementing what it committed to? **Role: primary evidence, grade-moving.**

**Outcome lens:** No direct change. Agreements signed and money disbursed do not yet mean housing starts have increased. The Outcome lens waits for CMHC starts data to show movement. **Role: secondary context only.** The release log should note: "HAF disbursement is consistent with future starts improvement but does not constitute outcome evidence. Outcome lens grade unchanged pending starts data."

**Double-counting check:** The HAF disbursement data is used in the Execution lens only. It appears as context in the Outcome assessment but does not move the Outcome grade. No double-counting.

---

## Pilot 3: Fiscal Health

**v1 status:** D (Stable). Federal attribution: 80%. Confidence: High.
**Construct type:** Outcome.
**v2 lens profile:** Outcome-led (Commitment: No, Execution: Partial, Outcome: Yes).
**Composite weights:** 0.15 / 0.25 / 0.60 (outcome-led).

### Commitment Lens

**What it measures:** Specificity and credibility of federal fiscal commitments — deficit targets, fiscal anchors, spending rules.

**Primary metrics:**
- Stated deficit target or fiscal anchor (e.g., deficit-to-GDP ratio target, balanced budget timeline)
- Fiscal rule commitments (spending caps, sunset provisions, debt-to-GDP target)

**Allowed sources:** Tier 1 (Budget documents, Fall Economic Statement, PBO analysis of fiscal plan credibility). Tier 4 (PMO statements) context only.

**Grade thresholds:**
| Grade | Criteria |
|---|---|
| A | Binding fiscal anchor with specific deficit path, timeline, and enforcement mechanism |
| B | Stated deficit target with timeline but no enforcement mechanism; credible fiscal plan assessed by PBO |
| C | Vague fiscal commitments — "return to balance" without timeline or specific path |
| D | No meaningful fiscal target; or stated targets contradicted by own budget projections |
| F | Explicit abandonment of fiscal discipline with no stated path back |

**Note:** This lens is expected to be thin for Fiscal Health. The dimension is fundamentally about outcomes (fiscal trajectory), not about what the government promised on fiscal policy. A low Commitment score is not necessarily a criticism — it may simply reflect that fiscal commitments are structurally less important than fiscal outcomes.

**Blocking conditions:** Blocked if commitment assessment credits aspirational language without specific fiscal targets.

**Upgrade triggers:** Publication of a fiscal anchor with PBO-assessed credibility.
**Downgrade triggers:** Withdrawal of prior fiscal targets; budget projections contradicting stated targets.

### Execution Lens

**What it measures:** Whether fiscal policy actions have been authorized and implemented — spending authorized, revenue measures enacted, fiscal rules operationalized.

**Primary metrics:**
- Budget implementation: spending authorized by Parliament and disbursed vs. announced
- Revenue measures: enacted vs. proposed
- Fiscal rule compliance: whether stated rules (if any) are being followed

**Allowed sources:** Tier 1 (PBO fiscal monitoring, Finance Canada Fiscal Monitor). Tier 2 for context.

**Grade thresholds:**
| Grade | Criteria |
|---|---|
| A | Budget fully implemented; revenue measures enacted; fiscal rules operational and being followed |
| B | Most budget measures implemented; minor gaps in revenue implementation |
| C | Mixed implementation — some measures enacted, others delayed; fiscal rules exist but compliance is partial |
| D | Budget measures largely unimplemented; revenue proposals stalled; fiscal rules not operational |
| F | No meaningful fiscal policy implementation |

**Blocking conditions:**
- Blocked if execution assessment credits announced spending as implemented without TB authorization evidence
- Blocked if PBO projections used are >6 months old without staleness qualifier

**Upgrade triggers:** Major revenue measure enacted; spending program reaches disbursement.
**Downgrade triggers:** Budget measures lapse; promised fiscal rule not introduced after >12 months.

### Outcome Lens

**What it measures:** The actual fiscal trajectory — deficit, debt, sustainability indicators.

**Primary metric:** Federal budgetary deficit (fiscal year), PBO or Finance Canada. Staleness rule: PBO projections >6 months old must be qualified with publication date.

**Grade thresholds (from Canonical-Scoring-Sheets.md):**
| Grade | Criteria |
|---|---|
| A | Balanced budget or surplus |
| B | Deficit <2% GDP |
| C | Deficit 2-4% GDP |
| D | Deficit >4% GDP |
| F | Deficit spiraling with no credible path to stabilization |

**Level vs. trajectory rule (from Canonical-Scoring-Sheets.md):** Every Outcome lens assessment must specify whether it is grading the current level or the trajectory. A deficit of 4.5% GDP that is shrinking is different from 4.5% GDP that is growing. Both are D on level, but the trajectory assessment should be noted.

**Modifier application:**
- External constraint: May apply if emergency defence spending or shock response is the primary driver of deficit expansion. +0.3 equivalent only if the spending is independently assessed as necessary.
- Credit-claiming penalty: Does not apply to Outcome lens (outcome data is independent of government claims).

**Blocking conditions:**
- Blocked if outcome assessment relies on government budget projections without PBO validation
- Blocked if deficit figure mixes fiscal-year and calendar-year data
- Blocked if level and trajectory are not separately specified

**Upgrade triggers:** PBO projects deficit declining toward 2% GDP threshold; actual fiscal results better than projected.
**Downgrade triggers:** PBO projects deficit increasing; actual results worse than projected; debt-to-GDP ratio rising.

### Deconfliction Across Lenses

| Evidence type | Primary lens | Secondary use | Rule |
|---|---|---|---|
| Government announces deficit target | Commitment | Context for Execution (defines what fiscal actions should achieve) | Announcement of target is commitment; target ≠ implementation |
| Parliament passes budget with spending levels | Execution | Context for Outcome (authorized spending affects future deficit) | Budget passage is execution; actual deficit is outcome |
| PBO releases fiscal sustainability report | Outcome | Context for Execution (PBO assessment may comment on implementation) | PBO deficit/debt projections are outcome; PBO implementation commentary is secondary context for Execution |
| Total federal deficit figure (which may include defence spending as a component) | Outcome (Fiscal Health) | Defence spending level itself is blocked from Fiscal Health; it remains primary to Defence per Deconfliction-Matrix.md | The deficit figure (total deficit as % GDP) is the Fiscal Health outcome measure. The defence spending level (NATO % GDP) is the Defence execution measure. These are different facts: the deficit is an aggregate outcome; defence spending is one input to that aggregate. The deficit can score in Fiscal Health without importing the defence spending figure. If the PBO attributes deficit growth to a specific spending driver, the attribution is context in Fiscal Health — the grade-moving evidence is the deficit figure itself, not the spending line item. |

### Worked Example

**New fact:** PBO releases its April 2026 Fiscal Sustainability Report projecting the federal deficit at 4.8% of GDP for FY2025-26, up from 4.2% projected six months ago, driven primarily by $18B in new defence commitments.

**Commitment lens:** No change. The fiscal commitments (or lack thereof) were already scored based on the budget's stated fiscal targets. PBO's revised projection is outcome data, not a new commitment. **Role: blocked (outcome evidence, not commitment evidence).**

**Execution lens:** Possible context update. The $18B in defence commitments may have moved from "Announced" to "Authorized" (TB approval), which would be relevant execution evidence. But the PBO report itself is an outcome projection. **Role: secondary context.** The release log should check: "Has the $18B in defence spending been authorized (TB) or just announced? If authorized, Execution lens should be updated separately based on the authorization evidence, not based on the PBO projection."

**Outcome lens:** Grade confirmation or downgrade candidate. The deficit at 4.8% GDP is firmly in D territory (>4% GDP). If the prior shadow Outcome grade was already D, this confirms. If it was C (borderline), this is a downgrade. The defence spending driver triggers the external constraint modifier assessment: is the defence spending independently assessed as necessary? If yes, +0.3 equivalent applies, which may hold the grade at D rather than pushing toward F. **Role: primary evidence, grade-moving.**

**Double-counting check:** The grade-moving evidence in Fiscal Health is the total deficit figure (4.8% GDP), not the defence spending line item ($18B). The PBO's attribution of deficit growth to defence spending is context explaining why the deficit grew — it does not import the defence spending figure as primary Fiscal Health evidence. The defence spending level (NATO % GDP) remains primary to Defence per the Deconfliction-Matrix.md. These are different facts: the deficit is an aggregate outcome; defence spending is one input. No double-counting.

---

## Pilot 4: Defence (sub-construct of Defence & Trade)

**v1 status:** Sub-score A (within Defence & Trade A-). Federal attribution: 85%. Confidence: High.
**Construct type:** Execution-heavy milestone.
**v2 lens profile:** Execution-led (Commitment: Partial, Execution: Yes, Outcome: Partial).
**Composite weights:** 0.15 / 0.60 / 0.25 (execution-led).

### Commitment Lens

**What it measures:** Scope and specificity of federal defence commitments — spending targets, capability pledges, alliance commitments.

**Primary metrics:**
- NATO 2% GDP spending commitment: stated and reaffirmed
- Defence policy update commitments (equipment procurement, force structure, Arctic presence)
- Alliance-specific commitments (NORAD modernization, NATO force contributions)

**Allowed sources:** Tier 1 (DND, NATO Secretary General Annual Report), Tier 2 (defence policy analysis). Tier 4 context only.

**Grade thresholds:**
| Grade | Criteria |
|---|---|
| A | NATO 2% commitment reaffirmed with timeline; comprehensive defence policy update with specific capability targets |
| B | NATO 2% commitment stated but timeline vague; defence policy update covers most capability areas |
| C | NATO commitment acknowledged but hedged; defence policy update partial or delayed |
| D | NATO commitment weakened or qualified; no meaningful defence policy update |
| F | NATO commitment abandoned or materially retreated from |

**Key constraint:** NATO 2% is a permanent milestone commitment that cannot regress under current political conditions. This means the Commitment lens for Defence is structurally stable — it is unlikely to change unless the government actively retreats from the commitment. A stable high Commitment score is the expected state.

**Upgrade triggers:** New capability commitments beyond NATO 2% (e.g., specific procurement with timelines).
**Downgrade triggers:** Formal qualification or retreat from NATO 2%; defence policy update withdrawn.

### Execution Lens

**What it measures:** Whether defence commitments have been funded, authorized, and operationally implemented.

**Primary metrics:**
- Defence spending as % GDP: actual vs. committed (NATO Secretary General Annual Report)
- Procurement milestones: contracts signed, equipment delivered, programs operational
- NORAD modernization: funding authorized and disbursing
- Force deployment commitments met

**Allowed sources:** Tier 1 (NATO Annual Report, DND departmental results). Tier 2 (defence analysis, PBO military spending reports).

**Grade thresholds:**
| Grade | Criteria |
|---|---|
| A | 2% GDP achieved or on verified trajectory; major procurement programs operational; NORAD funding flowing; alliance commitments met |
| B | Spending approaching 2% with credible path; most procurement on track; minor delays |
| C | Spending increasing but 2% not on trajectory; procurement facing material delays; some alliance commitments unmet |
| D | Spending increase minimal; procurement stalled; alliance commitments not being met |
| F | Defence spending declining or frozen; procurement cancelled |

**Key constraint:** This is a milestone-heavy dimension. Once 2% is reached, the Execution grade is structurally anchored. The interesting execution questions are about procurement delivery and operational capability, not the spending percentage itself.

**Blocking conditions:**
- Blocked if execution assessment credits announced procurement as delivered without contract/delivery evidence
- Blocked if spending figure uses a different GDP denominator than NATO's standard calculation

**Upgrade triggers:** 2% achieved in NATO Annual Report; major procurement contract signed; NORAD modernization reaches "Disbursing" stage.
**Downgrade triggers:** Spending trajectory flattens below 2%; major procurement cancelled or delayed >2 years; NORAD funding deferred.

### Outcome Lens

**What it measures:** Whether defence capability and alliance standing have measurably improved.

**Primary metrics:**
- NATO interoperability assessments (if available)
- Force readiness indicators
- Alliance positioning (NATO force contribution relative to peers)

**Allowed sources:** Tier 1 (NATO reports, DND). Tier 2 (defence analysis). This lens will often have thinner evidence than Execution because defence outcomes are harder to measure independently.

**Grade thresholds:**
| Grade | Criteria |
|---|---|
| A | Measurable improvement in force readiness; alliance standing strengthened by independent assessment |
| B | Some outcome indicators improving; alliance standing stable or improving |
| C | Outcome indicators flat; alliance standing unchanged |
| D | Outcome indicators deteriorating; alliance standing weakened |
| F | Defence capability in measurable decline |

**Key constraint:** Defence outcome data is structurally thinner than defence execution data. NATO spending and procurement are observable; "defence capability" is harder to measure at monthly intervals. The Outcome lens for Defence should be scored cautiously and updated less frequently than Execution. Confidence is expected to be Medium for this lens even when the overall dimension confidence is High.

**Blocking conditions:**
- Blocked if outcome assessment relies on government self-assessment of readiness without independent validation
- Blocked if outcome uses spending data (that belongs to Execution)

**Upgrade triggers:** NATO or independent assessment of improved capability or readiness.
**Downgrade triggers:** Independent assessment of declining readiness; operational failure in alliance context.

### Deconfliction Across Lenses

| Evidence type | Primary lens | Secondary use | Rule |
|---|---|---|---|
| NATO 2% commitment reaffirmed | Commitment | Context for Execution (defines the spending target) | Reaffirmation is commitment; spending level is execution |
| NATO Annual Report shows 2% achieved | Execution | Context for Outcome (spending enables capability) | Spending achievement is execution; capability is outcome |
| Procurement contract signed | Execution | Context for Outcome (procurement should eventually deliver capability) | Contract is execution; delivered capability is outcome |
| NATO spending % GDP | Execution (Defence) | Blocked from Fiscal Health Outcome | Per Deconfliction-Matrix.md: NATO spending is primary to Defence & Trade, blocked from Fiscal Health |

### Worked Example

**New fact:** The NATO Secretary General's April 2026 interim report confirms Canada's defence spending reached 2.0% of GDP in calendar year 2025, up from 1.76% in 2024.

**Commitment lens:** No change. The commitment to reach 2% was already scored. The fact that spending hit the target is execution evidence, not a new commitment. **Role: blocked (execution evidence, not commitment evidence).**

**Execution lens:** Grade upgrade candidate. This is primary evidence from a Tier 1 source (NATO Secretary General) confirming the most important execution milestone in this dimension. The 2% target has been achieved, not merely projected. If the current shadow Execution grade was B (approaching 2%), upgrade to A is justified. **Role: primary evidence, grade-moving.**

**Outcome lens:** No direct change. Spending 2% of GDP does not independently confirm improved defence capability. The Outcome lens requires capability or readiness evidence, not spending data. **Role: blocked (spending is execution, not outcome).** The release log should note: "2% spending achieved confirms execution milestone. Outcome lens awaits independent capability assessment."

**Double-counting check:** The NATO spending figure is used in the Execution lens only. It is explicitly blocked from the Outcome lens (spending ≠ capability) and from Fiscal Health (per Deconfliction-Matrix.md). No double-counting.

---

## Pilot 5: Trade Diversification (sub-construct of Defence & Trade)

**v1 status:** Sub-score B+ (within Defence & Trade A-). Federal attribution: 50%. Confidence: High.
**Construct type:** Outcome-heavy, externally influenced.
**v2 lens profile:** Outcome-led (Commitment: Partial, Execution: Yes, Outcome: Yes).
**Composite weights:** 0.15 / 0.25 / 0.60 (outcome-led).

### Commitment Lens

**What it measures:** Scope and specificity of federal trade diversification commitments — targets for reducing US export dependency, new market agreements, export promotion programs.

**Primary metrics:**
- Stated US export share reduction targets (if any)
- Trade agreement targets: new agreements pursued, existing agreements expanded
- Export promotion program commitments: funding and scope

**Allowed sources:** Tier 1 (Global Affairs Canada, Budget documents), Tier 2 (trade policy analysis). Tier 4 context only.

**Grade thresholds:**
| Grade | Criteria |
|---|---|
| A | Specific US export share reduction target with timeline; comprehensive trade diversification strategy with market-specific targets |
| B | Trade diversification stated as priority with some market-specific actions committed; no specific share target |
| C | General diversification language without specific targets or timelines |
| D | Minimal trade diversification commitments; continued reliance on US-centric trade posture |
| F | No meaningful diversification commitments or active retreat from diversification |

**Blocking conditions:** Blocked if commitment assessment credits sector-specific trade promotion as diversification without evidence it reduces overall US dependency.

**Upgrade triggers:** Publication of a trade diversification strategy with specific market targets and timelines.
**Downgrade triggers:** Formal retreat from diversification language; trade policy pivoting back to US-centric posture.

### Execution Lens

**What it measures:** Whether trade diversification commitments have been implemented — agreements signed, programs operational, institutional capacity deployed.

**Primary metrics:**
- New trade agreements: signed and ratified (not just "in negotiation")
- CPTPP, CETA/EU-region utilization and export growth (are existing agreements producing measurable trade increases?)
- Export promotion programs: funded and operational
- Trade commissioner service: deployed to target markets

**Allowed sources:** Tier 1 (Global Affairs Canada Monthly Trade Reports, StatsCan trade data), Tier 2 (trade policy analysis, business surveys on agreement utilization and export growth).

**Grade thresholds:**
| Grade | Criteria |
|---|---|
| A | New agreements ratified; EU/CETA-region and CPTPP export growth sustained; export promotion programs operational and funded; institutional capacity deployed to target markets |
| B | Most trade actions implemented; EU/CETA-region export growth stable or improving; minor gaps in program delivery |
| C | Mixed — some agreements advancing, others stalled; EU/CETA-region export growth flat; programs announced but not fully operational |
| D | Minimal implementation — no new agreements ratified; EU/CETA-region export growth declining; programs not operational |
| F | Trade policy implementation stalled or reversed |

**Blocking conditions:**
- Blocked if execution assessment credits trade agreements "in negotiation" as implemented
- Blocked if EU/CETA-region export growth data is not available or is more than one year old

**Upgrade triggers:** New trade agreement ratified; CPTPP/CETA/EU-region export growth measurably increases; export promotion program reaches operational stage.
**Downgrade triggers:** Trade agreement negotiations collapse; EU/CETA-region export growth reverses; programs defunded.

### Outcome Lens

**What it measures:** Whether trade diversification has actually occurred — US export share declining, non-US markets growing.

**Primary metric:** US export share (annual average), StatsCan 12-10-0176-01. Cannot mix annual diversification figures alongside monthly figures without labeling time window. Monthly trade data labeled "volatile."

**Allowed sources:** Tier 1 only for grade-moving evidence (StatsCan annual trade data). Monthly data is Tier 1 but requires volatility labeling and cannot be used alone for grade changes.

**Grade thresholds:**
| Grade | Criteria |
|---|---|
| A | US export share declining sustained below 70%; non-US markets showing measurable growth |
| B | US export share showing downward trend; non-US markets growing but share still above 70% |
| C | US export share flat; no measurable diversification or regression |
| D | US export share increasing; diversification reversing |
| F | US export share at or approaching historical highs; complete failure to diversify |

**Modifier application:**
- External constraint: Applies with full force. Tariffs and commodity prices are major external drivers of trade composition. If the US imposes tariffs that mechanically change trade flows, the external constraint modifier (+0.3 equivalent) applies only if the government's diversification response is assessed as adequate.
- Jurisdictional limits: Partial application. Trade is primarily federal (treaty power), but export composition is influenced by provincial resource economies and private sector decisions.

**Key constraint:** This is the hardest outcome case in the pilot. US export share is influenced by global commodity prices, exchange rates, US tariff policy, and private sector decisions. Federal attribution for the outcome is ~50%. The Outcome lens must always carry an attribution qualifier: "US export share is jointly determined by federal trade policy, global commodity prices, exchange rates, and private sector decisions. Federal attribution is estimated at ~50%."

**Blocking conditions:**
- Blocked if outcome assessment uses monthly trade data without volatility label
- Blocked if annual and monthly data are mixed without time-window labels
- Blocked if attribution qualifier is absent
- Blocked if export share change is attributed to a single commodity price movement without controlling for volume

**Upgrade triggers:** Annual StatsCan data showing US export share declining for two consecutive years; non-US market growth across multiple sectors.
**Downgrade triggers:** Annual data showing US export share increasing; non-US market growth reversing; commodity-driven share changes with no underlying structural diversification.

### Deconfliction Across Lenses

| Evidence type | Primary lens | Secondary use | Rule |
|---|---|---|---|
| Government announces trade diversification strategy | Commitment | Context for Execution | Announcement ≠ implementation |
| New trade agreement ratified | Execution | Context for Outcome (agreement should eventually affect trade flows) | Ratification is execution; trade flow change is outcome |
| StatsCan annual export share data | Outcome | Context for Execution (whether implemented agreements are producing results) | Export share is outcome; cannot move Execution lens directly |
| Monthly trade surplus/deficit | Blocked | Context only, in any lens | Monthly trade data is too volatile for grade-moving evidence per Measure-Selection-Rules.md |
| Trade diversification metrics | Outcome (Trade Diversification) | Blocked from Economic Policy Response | Per Deconfliction-Matrix.md: trade diversification is primary to Defence & Trade, blocked from Economic Policy Response |

### Worked Example

**New fact:** StatsCan releases 2025 annual trade data showing US share of Canadian merchandise exports declined from 75.2% in 2024 to 73.8% in 2025, with EU exports up 12% and Asia-Pacific exports up 8% by value.

**Commitment lens:** No change. This is outcome data showing trade composition changing, not a new commitment by the government. **Role: blocked (outcome evidence, not commitment evidence).**

**Execution lens:** No direct change. The declining US share may be consistent with diversification programs working, but the Execution lens requires evidence of program implementation (agreements ratified, export promotion operational, trade commissioner deployment), not trade flow data. **Role: secondary context only.** The release log should note: "2025 annual data is consistent with diversification execution but does not independently confirm program implementation. Check CPTPP/CETA/EU-region export growth and export promotion program status for execution evidence."

**Outcome lens:** Grade upgrade candidate. This is primary evidence from a Tier 1 source (StatsCan annual data) showing the primary indicator moving in the right direction (US share down 1.4 percentage points) with corroborating evidence from multiple non-US markets (EU +12%, Asia-Pacific +8%). This is structural, not a single-commodity anomaly. **However**, before moving the grade, the attribution qualifier must be assessed: is the US share decline driven by federal policy or by commodity prices, exchange rates, or tariff-induced trade diversion? If at least part of the decline is attributable to diversification policy rather than purely external factors, upgrade is justified with qualifier. **Role: primary evidence, grade-moving (with attribution qualifier).**

**Double-counting check:** The trade composition data is used in the Trade Diversification Outcome lens only. It appears as context in the Execution assessment but does not move the Execution grade. Trade data is blocked from Economic Policy Response per Deconfliction-Matrix.md. No double-counting.
