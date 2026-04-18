# Dimension Status Register

**Purpose:** Single source of truth for the scoring status of every dimension. Prevents losing track of what needs fixing, what's stable, and what's queued for v2.

**Last updated:** April 2026

---

## Status Definitions

| Status | Meaning |
|---|---|
| **Stable** | Operational. No structural issues. Minor wording tightening only. |
| **Tightening** | Live and gradeable, but construct, scope, or indicator stack needs sharpening before next cycle. |
| **Probation** | Live but structural weakness identified. Must prove value in next cycle or face removal. |
| **v2 Queue** | Structural redesign needed. Decision memo written. Do not change live model yet. |

---

## The Register

### 1. Defence & Trade (A-)

| Field | Value |
|---|---|
| **Status** | v2 Queue |
| **Unresolved issue** | Dual construct: defence ≠ trade diversification. Defence can mask trade regression. |
| **What needs doing** | Implement sub-scoring (Defence: A, Trade: B+) in expanded card. Decision gate: if sub-scores diverge >1.0 GPA for 2 cycles, trigger full split. |
| **Before next cycle?** | Sub-scoring display: yes. Full split: no (shadow only). |
| **Affects** | Live model (sub-score display) + shadow model (split test) |

### 2. Major Projects (C)

| Field | Value |
|---|---|
| **Status** | Stable |
| **Unresolved issue** | Credit-claiming penalty documentation. Must stay explicit that C includes -0.3 penalty (raw = C+). |
| **What needs doing** | Keep penalty evidence tied to specific sources each cycle. Verify no new projects are genuinely MPO-accelerated. |
| **Before next cycle?** | Tighten language in release log: yes. Structural change: no. |
| **Affects** | Live model only |

### 3. Fiscal Health (D)

| Field | Value |
|---|---|
| **Status** | Stable |
| **Unresolved issue** | Level vs. trajectory must be clear. Current debt level is manageable (IMF, IFSD). Trajectory is unsustainable (PBO 7.5%). Grade reflects trajectory, not level. |
| **What needs doing** | Monthly release language must always specify whether data cited is level or trajectory. Watch for April 28 economic update (Finance Minister Champagne). |
| **Before next cycle?** | Language tightening: yes. Structural change: no. |
| **Affects** | Live model only |

### 4. Economic Policy Response (D)

| Field | Value |
|---|---|
| **Status** | Tightening |
| **Unresolved issue** | Announcement bias risk. This dimension was reframed to grade policy response, but the QA drill showed how easily a splashy announcement (AI fund, minerals deal) can be argued into a grade move without implementation evidence. |
| **What needs doing** | Enforce QA Gatekeeping Rule 2: evidence must be at "Authorized" stage or higher. Announcements alone cannot move this grade. TB approval counts. Press releases do not. |
| **Before next cycle?** | Enforce the rule: yes. Redefine construct: no. |
| **Affects** | Live model only |

### 5. Affordability Response (D-)

| Field | Value |
|---|---|
| **Status** | Tightening |
| **Unresolved issue** | Scope definition is still loose. What exactly is graded: grocery policy only? All food affordability? Broader household cost pressure (rents, insurance, utilities, transport)? The rename to "Affordability Response" implies breadth but the metrics are still grocery-heavy. |
| **What needs doing** | Define the scope explicitly: this dimension grades the federal policy response to household cost pressure across groceries, tariff-driven costs, and targeted relief programs. It does NOT grade rents (Housing), utilities (shared jurisdiction), or insurance (provincial). Document this boundary. |
| **Before next cycle?** | Scope definition: yes. Indicator expansion: no (keep grocery-focused for now, expand later with data). |
| **Affects** | Live model only |

### 6. Carbon Pricing Policy (C)

| Field | Value |
|---|---|
| **Status** | Tightening |
| **Unresolved issue** | Overlap with Climate & Environment on industrial carbon pricing metrics. The effective vs. headline price ($20 vs. $95) was moved to Carbon Pricing as primary home, but the boundary needs to hold under pressure. |
| **What needs doing** | Enforce deconfliction: Carbon Pricing owns the pricing instrument. Climate owns the emissions framework. If OBPS tightening is announced, it scores in Carbon Pricing (instrument change). If emissions rise, it scores in Climate (outcome). Publish this rule in the release log. |
| **Before next cycle?** | Enforce boundary: yes. Merge into Climate: no (shadow only per decision memo). |
| **Affects** | Live model + shadow model (merge test) |

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
| **Unresolved issue** | Most subjective dimension. All-qualitative metrics. Lowest inter-rater reliability potential. Construct unified under "PM ethics framework" but still thin. |
| **What needs doing** | Add at least one semi-quantitative indicator: e.g., "disclosure completeness score" (categories disclosed / categories expected). Keep event-driven cadence. Default to Medium confidence. Do not grade-move on media noise — only on Ethics Commissioner actions, formal disclosures, or documented new evidence. |
| **Before next cycle?** | Add indicator if possible. Otherwise hold as is. |
| **Affects** | Live model only |

### 11. Flagship Delivery (C)

| Field | Value |
|---|---|
| **Status** | Probation |
| **Unresolved issue** | Overlap with home dimensions. Weighting of 5 flagship files not codified until the Combination Rule was published. Must prove it adds value beyond what individual dimensions already show. |
| **What needs doing** | Run one real cycle using the published Combination Rule and Deconfliction Matrix. If the grade produced by the combination rule matches the analyst's judgment and does not double-count, keep it. If it creates confusion or contradicts home dimension grades, demote or remove in v2. |
| **Before next cycle?** | Apply Combination Rule mechanically: yes. Structural change: no (evaluate after one cycle). |
| **Affects** | Live model (probation) + shadow model (removal test) |

### 12. Promise Delivery (C+)

| Field | Value |
|---|---|
| **Status** | v2 Queue |
| **Unresolved issue** | Derivative dimension. Every grade movement is already captured in a home dimension. Cannot identify independent grade-moving evidence. |
| **What needs doing** | Shadow-remove from GPA for one cycle. Run 11-dimension GPA alongside 12-dimension. If difference is <0.1 GPA points, promote removal to live. Promise Tracker tab remains unchanged. |
| **Before next cycle?** | Shadow calculation: yes. Live change: no. |
| **Affects** | Shadow model only (live model unchanged until decision) |

---

## Master Checklist: Before Next Release

These items must be completed before the May 2026 cycle:

- [ ] **Affordability Response:** Define scope boundary (groceries + tariff costs + targeted relief; NOT rents, utilities, insurance)
- [ ] **Economic Policy Response:** Enforce QA Rule 2 (no grade moves on announcements alone)
- [ ] **Carbon Pricing / Climate deconfliction:** Confirm boundary holds in release log
- [ ] **Ethics & Transparency:** Add one semi-quantitative indicator if available
- [ ] **Defence & Trade:** Add sub-scores (Defence: A, Trade: B+) to expanded card display
- [ ] **Flagship Delivery:** Apply Combination Rule mechanically to produce grade
- [ ] **Promise Delivery:** Run shadow 11-dimension GPA alongside 12-dimension
- [ ] **Fiscal Health:** Incorporate April 28 economic update data
- [ ] **Housing Supply:** Enforce announced ≠ started ≠ completed language
- [ ] **Major Projects:** Confirm credit-claiming penalty documented in release log
- [ ] **All dimensions:** Run deconfliction check on every metric cited in release

---

## v2 Parking Lot

Ideas that are valid but must NOT leak into the live cycle. These are queued for v2 design work only.

| Item | Source | Status |
|---|---|---|
| Promise Delivery → ungraded tracker | Decision memo, ChatGPT consensus | Shadow test first |
| Defence & Trade → full split | Decision memo, methods panel | Only if sub-scores diverge >1.0 |
| Carbon Pricing → merge into Climate | Methods panel shadow test A | Shadow only; merging buries a policy win |
| Flagship Delivery → remove entirely | Methods panel shadow test B | Probation cycle first |
| Attribution-adjusted weighting → headline | Methods panel shadow test C | Shadow only; negligible GPA impact |
| Regional distribution (provincial breakdowns) | ChatGPT research | Future feature, not v2 |
| Implementation burden dimension | ChatGPT methods panel | Future consideration |
| Durability-weighted promise scoring | Promise Coding Rules | Future enhancement |
| Time-series trend charts | Needs 3+ months data | After July 2026 |
| Inter-rater reliability testing | Methods panel | Needs human raters |

---

## 3 Highest Risk Dimensions for Next Monthly Update

1. **Flagship Delivery (C)** — First real test of the Combination Rule. If it produces a confusing or contradictory grade, the probation fails.

2. **Carbon Pricing Policy (C)** — The Pack 4 drill blocked this dimension for double-counting. The deconfliction fix must hold under real evidence.

3. **Economic Policy Response (D)** — The Pack 2 drill showed how easily AI/minerals announcements can be argued into a grade move. The QA gatekeeping rules must resist announcement bias with real data.

---

*Dimension Status Register v1.0 — April 2026*
*Update this document after every monthly cycle.*
