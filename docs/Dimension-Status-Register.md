# Dimension Status Register

**Purpose:** Register the structural status of every dimension. The active work queue lives in [Current-Roadmap.md](Current-Roadmap.md); this file prevents old structural concerns from being mistaken for current blockers.

**Last updated:** August 26, 2026

**Next scheduled cycle:** September 1, 2026, per `meta.nextUpdate` in [src/data/meta.json](../src/data/meta.json).

---

## Status Definitions

| Status | Meaning |
|---|---|
| **Stable** | Operational. No structural issues. Minor wording tightening only. |
| **Tightening** | Live and gradeable, but construct, scope, or indicator stack needs sharpening before next cycle. |
| **Probation** | Live but structural weakness identified. Must prove value in next cycle or face removal. |
| **Editor-gated** | A documented decision is open on a frozen methodology or scoring surface. Keep the live model unchanged until the editor records an outcome. |

---

## The Register

### 1. Defence & Trade (A-)

| Field | Value |
|---|---|
| **Status** | Stable with equal-weight sub-scores and split tripwire |
| **Unresolved issue** | Mixed construct remains, but whole-letter sub-score ladders, equal-weight arithmetic, and the split-promotion tripwire make the defence/trade tension reproducible and visible. |
| **What needs doing** | Monitor the live tripwire: if the defence and trade sub-scores move in opposite directions, or differ by more than 1.0 GPA points (about one full letter grade), for two consecutive monthly review cycles, queue the split for promotion to live separate files in the next version. |
| **Before next cycle?** | Monitor only. Full split: no unless the tripwire fires. |
| **Affects** | Live model monitoring |

### 2. Major Projects (C)

| Field | Value |
|---|---|
| **Status** | Editor-gated methodology decision |
| **Unresolved issue** | The cohort denominator, threshold height, and `stageAtReferral` definition and evidence standard remain undecided. The options and current evidence are documented in the [Major Projects Threshold Decision Packet](Major-Projects-Threshold-Decision-Packet-2026-08.md). |
| **What needs doing** | The editor must decide whether and when to adopt a denominator rule, whether threshold values change, and how `stageAtReferral` is defined before any backfill or depth weighting. Keep the current grade, denominator, thresholds, and stage data unchanged until those decisions are recorded. |
| **Before next cycle?** | Editor gate remains open. Do not apply a denominator, threshold, `stageAtReferral`, or resulting grade change automatically. |
| **Affects** | Editor-gated methodology and live model |

### 3. Fiscal Health (C)

| Field | Value |
|---|---|
| **Status** | Improved after Spring Economic Update / PBO anchor assessment |
| **Unresolved issue** | Level vs. trajectory must be clear. Current debt level is manageable and PBO says the anchors are on track, but interest burden, capital-budgeting definitions, and omitted anticipated defence costs remain live caveats. |
| **What needs doing** | Monthly release language must always specify whether data cited is level, trajectory, anchor credibility, or caveat. Watch for any PBO fiscal-anchor update or rating-agency action. |
| **Before next cycle?** | Language tightening: yes. Structural change: no. |
| **Affects** | Live model only |

### 4. Economic Policy Response (C)

| Field | Value |
|---|---|
| **Status** | Declining outcome with action-first correction |
| **Unresolved issue** | Announcement bias remains the main risk. Two levers clear authorization, which sets the current band, while the five-quarter investment decline blocks the next band. |
| **What needs doing** | Enforce QA Gatekeeping Rule 2 during each cycle: evidence must be at "Authorized" stage or higher. Announcements alone cannot move this grade. |
| **Before next cycle?** | Cycle enforcement only. Redefine construct: no. |
| **Affects** | Live model only |

### 5. Affordability Response (D-)

| Field | Value |
|---|---|
| **Status** | Stable with scope boundary |
| **Unresolved issue** | Scope boundary is now explicit, but the evidence stack remains grocery-heavy by design until broader federal household-cost instruments produce clean sourceable metrics. |
| **What needs doing** | Keep rents, utilities, insurance, and transportation out of this dimension unless a future methodology decision expands the construct. |
| **Before next cycle?** | Enforce scope boundary. Indicator expansion: no. |
| **Affects** | Live model only |

### 6. Carbon Pricing Policy (C)

| Field | Value |
|---|---|
| **Status** | Stable with deconfliction guardrail |
| **Unresolved issue** | Carbon Pricing / Climate overlap remains possible, but the live scoring guardrails now assign the pricing instrument to Carbon Pricing and the emissions framework to Climate. |
| **What needs doing** | Enforce deconfliction during each cycle. If OBPS tightening is announced, score it in Carbon Pricing. If emissions or climate-framework credibility changes, score that in Climate. |
| **Before next cycle?** | Enforce boundary. Merge into Climate: no. |
| **Affects** | Live model only |

### 7. Climate & Environment (D)

| Field | Value |
|---|---|
| **Status** | Stable |
| **Unresolved issue** | Boundary with Carbon Pricing must hold. Industrial pricing metrics referenced as context only, not grade-moving. |
| **What needs doing** | Monitor deconfliction. If a climate policy change affects both dimensions, the release log must specify which dimension absorbs the grade impact. |
| **Before next cycle?** | Monitor: yes. Structural change: no. |
| **Affects** | Live model only |

### 8. Immigration (C+)

| Field | Value |
|---|---|
| **Status** | Stable |
| **Unresolved issue** | "Framework design" was removed from the construct and moved to a next-trigger. The dimension now grades the correction only. If the government publishes a long-term immigration model, that is the trigger for a potential upgrade. |
| **What needs doing** | Keep grading on management and alignment, not on whether intake should be higher or lower ideologically. The construct is the adequacy of the correction, not the direction. |
| **Before next cycle?** | No action needed unless government publishes long-term model. |
| **Affects** | Live model only |

### 9. Housing Supply (D)

| Field | Value |
|---|---|
| **Status** | Stable |
| **Unresolved issue** | Time horizon matching. Ensure annual need (450K+) is compared to annual delivery, not to monthly or quarterly snapshots. BCH units must be tracked as "announced" until construction starts. |
| **What needs doing** | Enforce language: announced ≠ started ≠ completed. The QA Pack 5 lessons apply directly to this dimension. |
| **Before next cycle?** | Language enforcement: yes. Structural change: no. |
| **Affects** | Live model only |

### 10. Ethics & Transparency (C)

| Field | Value |
|---|---|
| **Status** | Probation |
| **Unresolved issue** | Most subjective dimension. Live metrics now include an official-status anchor set, but adequacy of disclosure remains partly qualitative and inter-rater reliability risk is still highest here. |
| **What needs doing** | Maintain the new event-driven official-status anchor (Commissioner review, blind trust, agreed measure filing, declared screen scope, independent governance review). Do not add a disclosure-completeness score unless a non-editorial official denominator exists. Do not grade-move on media noise — only on Ethics Commissioner actions, formal disclosures, or documented new evidence. |
| **Before next cycle?** | Official-status anchor landed. Monitor for new Commissioner publication, new filing, or documented evidence. |
| **Affects** | Live model only |

### 11. Flagship Delivery (C)

| Field | Value |
|---|---|
| **Status** | Decision landed |
| **Unresolved issue** | Structural overlap risk remains. The July 1 exit test passed, but the dimension still has to keep adding a distinct cross-file execution read without double-counting home-dimension outcomes. |
| **What needs doing** | Apply the published Combination Rule mechanically each cycle and keep the deconfliction check explicit. If a future cycle needs an ad hoc override, contradicts the underlying file-status movement, adds no cross-file execution insight, or breaks deconfliction, hold the existing live grade and queue an explicit editor decision on replacement or demotion. |
| **Before next cycle?** | Apply Combination Rule mechanically: yes. Structural change: no unless a future cycle fails the retention checks. |
| **Affects** | Live model and retention watch |

### 12. Promise Delivery (ungraded tracker)

| Field | Value |
|---|---|
| **Status** | Decision landed |
| **Unresolved issue** | No GPA issue remains. Promise Delivery is intentionally derivative and kept outside the aggregate scores. |
| **What needs doing** | Maintain promise statuses, original-source links, and status-evidence links during the monthly cycle. Keep status changes deconflicted to their home dimensions. |
| **Before next cycle?** | At the next cycle, review promise statuses and the one remaining status-evidence gap, Carbon Border Adjustment Mechanism. No shadow GPA run is required. |
| **Affects** | Accountability tracker only |

---

## Historical April/May 2026 Checklist Status

These were April and May release-readiness items. Their recorded status is retained as history, not as the current work queue. Recurring controls remain in [Monthly-Cycle-Playbook.md](Monthly-Cycle-Playbook.md).

- [x] **Affordability Response:** Define scope boundary (groceries + tariff costs + targeted relief; NOT rents, utilities, insurance)
- [x] **Economic Policy Response:** Enforce QA Rule 2 (no grade moves on announcements alone)
- [x] **Carbon Pricing / Climate deconfliction:** Confirm boundary holds in release log
- [x] **Ethics & Transparency:** Add one anchored indicator
- [x] **Defence & Trade:** Add reproducible whole-letter sub-scores (Defence: A, Trade: B) and equal-weight headline arithmetic
- [x] **Flagship Delivery:** Apply Combination Rule mechanically to produce grade
- [ ] **Promise Delivery:** The May record does not prove that all 43 tracker statuses were reviewed. The [May 16 source recertification](Source-Recertification-2026-05-16.md) counted 40/43 status-evidence links and three gaps. Subsequent work raised the current count to 42/43; the live row above names the one remaining gap.
- [x] **Fiscal Health:** Spring Economic Update data was incorporated in the May 13 review. See [May-2026-Source-Refresh-Notes.md](May-2026-Source-Refresh-Notes.md).
- [x] **Housing Supply:** Enforce announced ≠ started ≠ completed language
- [x] **Major Projects:** Confirm credit-claiming penalty documented in release log
- [ ] **All dimensions:** No per-release completion record was found for the original check on every cited metric. [Deconfliction-Matrix.md](Deconfliction-Matrix.md) and Rule 6 of [QA-Gatekeeping-Rules.md](QA-Gatekeeping-Rules.md) define the control; the active playbook now requires the check each cycle.

---

## Historical Design Options and Later Triggers

The 2026 tri-lens shadow design is closed. The rows below preserve its outcomes
as history or route still-valid ideas to the live roadmap's existing trigger
conditions. None is active v2 work, and nothing here authorizes a shadow cycle.

| Item | Historical source | Current status |
|---|---|---|
| Promise Delivery as an ungraded tracker | Decision memo, ChatGPT consensus | Implemented in the live model |
| Defence and Trade split | Decision memo, methods panel | Trigger-gated by the live split tripwire |
| Carbon Pricing merge into Climate | Methods panel shadow test A | Closed design option, do not reopen unless a later methodology review forces it |
| Flagship Delivery removal | Methods panel shadow test B | Trigger-gated only if the retention conditions fail |
| Attribution-adjusted headline weighting | Methods panel shadow test C | Closed design option, no active shadow run |
| Regional distribution (provincial breakdowns) | ChatGPT research | Later product candidate, roadmap controls priority |
| Implementation burden dimension | ChatGPT methods panel | Later methodology candidate, editor gate required |
| Durability-weighted promise scoring | Promise Coding Rules | Later methodology candidate, editor gate required |
| Time-series trend charts | Needs 3+ months data | Later product candidate, roadmap controls priority |
| Inter-rater reliability testing | Methods panel | Active protocol is separate from v2, editor follow-up is parked |

---

## 3 Highest Risk Dimensions for Next Monthly Update

1. **Major Projects (C):** The denominator, threshold height, and
   `stageAtReferral` evidence rule remain editor-gated. Keep the live model
   frozen until the editor records an outcome.

2. **Carbon Pricing Policy (C):** The Pack 4 drill blocked this dimension for double-counting. The deconfliction fix must hold under real evidence.

3. **Economic Policy Response (C):** The Pack 2 drill showed how easily AI/minerals announcements can be argued into a grade move. The QA gatekeeping rules must resist announcement bias with real data.

---

*Dimension Status Register v1.0 — April 2026*
*Update this document after every monthly cycle.*
