# Core Tri-Lens Architecture

- **Purpose:** Define the three scoring lenses (Commitment, Execution, Outcome), their evidence rules, governance inheritance, composite design, and double-counting prevention for v2 shadow scoring.
- **Status:** Draft — not for public use. Shadow scoring only.
- **Last updated:** 2026-04-15
- **Depends on:** Scoring-Rubric-v1.1.md, QA-Gatekeeping-Rules.md, Deconfliction-Matrix.md, Measure-Selection-Rules.md, V2-Scoring-Architecture-Brief.md
- **Used by:** Dimension-Applicability-Matrix.md, Pilot-Templates.md, Shadow-Run-Workflow.md, Open-Design-Decisions.md

---

## 1. Lens Definitions

### 1.1 Commitment

**Question:** Did the government publicly commit to a specific policy action or target relevant to this dimension?

**What moves this lens:**
- Explicit public commitments with stated targets, timelines, or deliverables
- Platform promises, mandate letters, throne speech items, budget announcements with specificity
- Formal withdrawal or downgrade of a prior commitment

**What does NOT move this lens:**
- Vague aspirational language without specificity ("we will work toward...")
- Re-announcements of existing commitments without new content
- Execution progress (that belongs to the Execution lens)
- Real-world outcome data (that belongs to the Outcome lens)
- Opposition criticism or media commentary about commitment quality

**Grade scale (whole-letter):**

| Grade | Meaning |
|---|---|
| A | Comprehensive commitments with specific targets, timelines, and accountability mechanisms across the dimension's scope |
| B | Substantial commitments covering most of the dimension's scope, with some targets and timelines |
| C | Partial commitments — some areas covered, others absent; targets vague or timelines missing |
| D | Minimal commitments — few specific pledges, broad scope gaps, or material retreats from prior commitments |
| F | No meaningful commitments, or wholesale abandonment of prior commitments without replacement |

### 1.2 Execution

**Question:** Did the government authorize, fund, legislate, and implement the actions required to deliver on commitments in this dimension?

**What moves this lens:**
- Legislation introduced and/or passed
- Treasury Board authorization or equivalent funding approval
- Operational implementation (programs launched, staff deployed, regulations gazetted)
- Procurement and contracting for delivery
- Intergovernmental agreements signed and operational

**What does NOT move this lens:**
- Announcements alone (QA Rule 2: must reach "Authorized" stage or higher)
- Real-world outcome data (that belongs to the Outcome lens)
- The existence of a commitment (that belongs to the Commitment lens)
- Stakeholder satisfaction or perception

**Grade scale (whole-letter):**

| Grade | Meaning |
|---|---|
| A | Commitments authorized, funded, and operationally implemented across the dimension's scope; delivery machinery demonstrably running |
| B | Most commitments have reached implementation stage; minor gaps in funding, staffing, or regulatory completion |
| C | Mixed execution — some commitments implemented, others stalled at legislation or authorization; material delivery gaps |
| D | Minimal execution — most commitments remain at announcement or early legislative stage; funding not disbursed; programs not operational |
| F | No meaningful execution; commitments exist on paper only |

**Implementation ladder integration:** This lens inherits QA Rule 2 directly. Evidence must show movement on the 5-stage implementation ladder (Announced → Legislated → Authorized → Implemented → Outcome observed). Only "Authorized" and above can move the Execution lens grade.

### 1.3 Outcome

**Question:** Did the real-world condition that this dimension measures actually improve?

**What moves this lens:**
- Primary statistical indicators crossing defined thresholds (per Measure-Selection-Rules.md)
- Independent data from Tier 1 sources showing measurable change in the target condition
- Sustained trend data (minimum 2 consecutive data releases in the same direction)

**What does NOT move this lens:**
- Government announcements or commitments (those belong to Commitment)
- Implementation progress (that belongs to Execution)
- Projected or forecasted outcomes without observed data
- Single-month data points in volatile series (per Measure-Selection-Rules.md labeling requirements)
- Outcomes primarily attributable to non-federal actors or external forces (per jurisdictional limits modifier)

**Grade scale (whole-letter):**

| Grade | Meaning |
|---|---|
| A | Primary indicators show sustained improvement crossing the A-threshold defined in Canonical-Scoring-Sheets.md |
| B | Primary indicators show measurable improvement; most thresholds in B-range |
| C | Primary indicators flat or mixed; no sustained deterioration but no clear improvement |
| D | Primary indicators show deterioration or failure to improve from inherited baseline |
| F | Primary indicators show severe deterioration or collapse from inherited baseline |

**Outcome lens constraints:**
- The jurisdictional limits modifier from Scoring-Rubric-v1.1.md applies with extra force here. If >50% of outcome variance is non-federal, the Outcome lens must carry an explicit attribution qualifier.
- The timing fairness modifier applies. Dimensions tagged "Moves quarterly+" or lag "Long" cannot be downgraded on Outcome lens in the first 24 months (expires March 2027) unless deterioration is clearly policy-caused.
- Volatile series (monthly trade data, monthly housing starts) must use smoothed or annualized figures, not single-month prints.

---

## 2. Governance Inheritance

All v1 governance controls apply to v2 lens scoring. Nothing is relaxed.

| Control | How it applies to v2 |
|---|---|
| **Source hierarchy (QA Rule 1)** | Execution and Outcome lenses: each score must cite at least one Tier 1 or Tier 2 source. Tier 4 evidence (government press releases) cannot move either lens. **Commitment lens exception:** Canonical government commitment documents — federal budget, throne speech, mandate letters, published platform, departmental plans, and formally gazetted strategies — may move the Commitment lens directly as primary evidence without requiring Tier 1/2 corroboration, because they ARE the commitment. Press releases, PMO announcements, ministerial statements, and media interviews remain Tier 4 and cannot move the Commitment lens alone; they require Tier 1/2 analysis confirming the commitment's specificity and scope before scoring. |
| **Implementation ladder (QA Rule 2)** | Directly governs the Execution lens. Commitment lens is governed by specificity and scope of the commitment, not implementation stage. Outcome lens is governed by observed data, not implementation stage. |
| **Contradiction check (QA Rule 3)** | Applies within each lens AND across lenses. A proposed change to one lens that contradicts the reasoning behind another lens score must be explicitly resolved. |
| **Confidence discipline (QA Rule 4)** | Each lens carries its own confidence tag (High / Medium / Low). Reinterpretation of existing evidence does not justify a confidence change. |
| **Multi-notch protocol (QA Rule 5)** | Applies per lens. A 2-notch move on any single lens requires 2+ independent Tier 1 sources and Referee approval. |
| **Blocking conditions (QA Rule 6)** | All 6 blocking conditions apply to each lens independently. A blocked lens score cannot be published even if the other two lenses pass QA. |
| **Inadmissible arguments (QA Rule 7)** | Applies to all lenses. Perception, reputation, and stakeholder expectation arguments are inadmissible for any lens. |
| **Deconfliction (Deconfliction-Matrix.md)** | Primary metric homes remain unchanged. The same metric keeps its primary home. What v2 adds: within a dimension, evidence must also be assigned a primary LENS. |
| **Measure selection (Measure-Selection-Rules.md)** | Primary measures per dimension are unchanged. Each primary measure is assigned a primary lens in Pilot-Templates.md. |
| **Modifiers (Scoring-Rubric-v1.1.md)** | Timing fairness, jurisdictional limits, external constraint, and credit-claiming penalty apply at the LENS level, not just the dimension level. See Section 4 below. |

---

## 3. Lens Independence and Composite Design

### 3.1 Lenses are scored independently

Each lens receives its own whole-letter grade per dimension. The three lens scores for a dimension are NOT averaged to produce the v1 grade. They exist as a parallel analytical layer.

### 3.2 Shadow composite options

Three composite options are defined for pilot evaluation. One is recommended as the default.

**Option 1 — Lens-weighted composite (RECOMMENDED for pilot)**

For each dimension, compute a shadow composite using lens weights that reflect the dimension's primary analytical character:

| Dimension type | Commitment weight | Execution weight | Outcome weight |
|---|---|---|---|
| Outcome-led (e.g., Fiscal Health) | 0.15 | 0.25 | 0.60 |
| Execution-led (e.g., Housing Supply) | 0.15 | 0.60 | 0.25 |
| Full tri-lens (e.g., Immigration) | 0.33 | 0.34 | 0.33 |
| Split construct (Defence, Trade) | Per sub-construct type above | Per sub-construct type above | Per sub-construct type above |

Convert lens letter grades to GPA (A=4.0, B=3.0, C=2.0, D=1.0, F=0.0) using whole-letter values only, apply weights, and round to nearest whole-letter grade.

**Option 2 — Primary-lens-only composite**

For each dimension, report only the primary lens grade as the shadow composite. Other lenses are recorded for context but do not contribute to the number.

**Option 3 — No composite; lens scores reported separately**

Each dimension shows three independent lens grades with no attempt to combine them.

**Recommended default:** Option 1 (lens-weighted composite) for the pilot cycle. It produces a single shadow number per dimension that can be compared directly against the v1 grade, which is the primary purpose of shadow testing. If the weighted composite proves unstable or misleading during the pilot, fall back to Option 2.

### 3.3 Shadow GPA

During the pilot, compute a shadow Full Policy Audit GPA using the shadow composites from the pilot dimensions and the live v1 grades for all non-pilot dimensions. This produces a single number for comparison against the live v1 GPA of 1.65.

Do NOT compute a shadow Household Impact GPA during the first pilot. The household weighting scheme should not be applied to the v2 architecture until the pilot proves the lens-weighted composites are stable.

---

## 4. Modifier Application by Lens

v1 modifiers apply at the lens level with the following rules:

| Modifier | Commitment lens | Execution lens | Outcome lens |
|---|---|---|---|
| **Timing fairness** (+floor of C for inherited conditions, expires March 2027) | Does not apply. Commitments are forward-looking. | Applies. Cannot downgrade execution below C if inherited machinery is still being rebuilt. | Applies with full force. Primary purpose of the modifier. |
| **Jurisdictional limits** (cap at C+ if >50% delivery is non-federal and no intergovernmental agreement) | Does not apply. Federal government can commit regardless of jurisdiction. | Applies partially. Execution cap only if the federal share of implementation is genuinely limited. | Applies with full force. Outcome is where jurisdictional limits bite hardest. |
| **External constraint** (+0.3 GPA equivalent when response is adequate given constraint) | Does not apply. | Applies. Government response to external constraint is an execution question. | Does not apply. External constraint means the outcome is not primarily attributable to federal action. |
| **Credit-claiming penalty** (-0.3 GPA equivalent when overclaiming is documented) | Applies. Overclaiming can inflate commitment scores. | Applies with full force. Primary target of the penalty. | Does not apply. Outcome data is independent of government claims. |

---

## 5. Double-Counting Prevention

### 5.1 Core rule

**The same fact cannot score more than one lens unless the spec explicitly documents the different analytical role it plays in each lens.**

This is stricter than v1 deconfliction, which only prevents the same metric from scoring in two dimensions. V2 adds a second axis: the same metric within one dimension must also be assigned a primary lens.

### 5.2 How to apply

For each piece of evidence used in a lens score:

1. **Identify the fact.** What specifically happened or was measured?
2. **Assign the primary lens.** Which lens does this fact most directly answer?
3. **Check cross-lens relevance.** Does this fact have a legitimate secondary role in another lens?
4. **If yes, document the different role.** The Pilot-Templates.md worked examples show the required format.
5. **If the different role cannot be clearly articulated, the fact is blocked from the secondary lens.**

### 5.3 Common cross-lens patterns

| Pattern | Primary lens | Secondary use allowed? | Condition |
|---|---|---|---|
| Government announces a target with a timeline | Commitment | No — cannot also count as execution | Announcement ≠ implementation (QA Rule 2) |
| Legislation is passed | Execution | Partial — can update commitment lens if the legislation changes the scope of the original commitment | Must document the specific change to commitment scope |
| StatsCan releases new data showing improvement | Outcome | No — cannot also count as execution | Outcome data measures the condition, not the government action |
| Government announces AND implements in same cycle | Commitment + Execution | Yes — different facts | The announcement is a commitment fact; the implementation evidence (TB authorization, operational launch) is a separate execution fact |
| A commitment is withdrawn | Commitment (downgrade) | Partial — may affect execution lens if implementation was underway | Must document separately: commitment withdrawal is one fact, halted implementation is a different fact |

### 5.4 Mechanical test

Before publishing any shadow lens score, run this check:

> "If I removed this fact from Lens X, would Lens X's grade change? If I also used it in Lens Y, would removing it from Lens Y change Lens Y's grade?"

If the answer is yes to both, and the fact is the same observation (not two separate observations), then it is double-counted. One lens must treat it as context only.

---

## 6. What This Architecture Does NOT Do

1. It does not replace v1. The live dashboard continues to use v1 grades.
2. It does not require all dimensions to use all three lenses. See Dimension-Applicability-Matrix.md.
3. It does not introduce plus/minus precision for lens scores. Whole-letter only unless a pilot dimension's Pilot Template explicitly justifies finer granularity.
4. It does not change the source hierarchy, QA rules, deconfliction assignments, or measure selection rules.
5. It does not produce a public-facing output. Shadow scoring only until promotion criteria are met (see Shadow-Run-Workflow.md).
