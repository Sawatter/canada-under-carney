# Shadow Run Workflow

- **Purpose:** Define the monthly workflow for running v2 tri-lens shadow scoring alongside v1, including sequence of operations, QA integration, logging, conflict resolution, and promotion criteria.
- **Status:** Draft — not for public use. Shadow scoring only.
- **Last updated:** 2026-04-15
- **Depends on:** Core-Tri-Lens-Architecture.md, Pilot-Templates.md, Dimension-Applicability-Matrix.md, QA-Gatekeeping-Rules.md, Deconfliction-Matrix.md, MONTHLY-UPDATE-GUIDE.md, v2-Shadow-Test-Plan.md
- **Used by:** Open-Design-Decisions.md

**Relationship to v2-Shadow-Test-Plan.md:** The existing shadow test plan covers two specific v1 structural tests (Promise Delivery GPA removal and Defence & Trade sub-scoring). This workflow is broader — it covers the full tri-lens shadow scoring process for the five pilot dimensions. The two v1 shadow tests should run concurrently within Step 2 of this workflow during the first cycle.

---

## 1. Monthly Cycle Timeline

The v2 shadow cycle runs inside the v1 monthly cycle, not as a separate process. Target: adds ~45-60 minutes to the existing ~30-minute v1 update process.

| Step | Timing | Duration | Description |
|---|---|---|---|
| 1 | Day 1 | 15 min | Data fetch and source scan (shared with v1) |
| 2 | Day 1-3 | 30 min | v1 scoring (existing process, per MONTHLY-UPDATE-GUIDE.md) |
| 3 | Day 3-5 | 30 min | v2 shadow lens scoring for pilot dimensions |
| 4 | Day 5-6 | 15 min | Cross-lens QA and deconfliction check |
| 5 | Day 6-7 | 10 min | Shadow composite computation and v1 comparison |
| 6 | Day 7 | 10 min | Shadow release log entry |
| 7 | Day 14 | 5 min | Publish v1 (v2 remains internal) |
| 8 | Day 15 | 15 min | Post-cycle review: what worked, what didn't, design decisions surfaced |

---

## 2. Step-by-Step Operations

### Step 1: Data Fetch and Source Scan (shared with v1)

This step is unchanged from v1. Run `python3 scripts/fetch-data.py` and scan the 20-source monitoring stack (Tier 1 and Tier 2). No separate v2 data fetch is required.

**v2 addition:** While scanning sources, tag each new piece of evidence with its probable primary lens:
- Is this a new commitment, a change in commitment scope, or a withdrawal? → **Commitment**
- Is this evidence of implementation progress (legislation, authorization, disbursement, operational launch)? → **Execution**
- Is this observed outcome data from a Tier 1 statistical source? → **Outcome**

Tag in your working notes, not in the data files. This tagging is for the v2 shadow process in Step 3.

### Step 2: v1 Scoring (existing process)

Run the v1 monthly update exactly as documented in MONTHLY-UPDATE-GUIDE.md. Apply evidence to all dimensions using canonical scoring sheets. Run QA 3-lane process on any proposed grade changes. Apply deconfliction check.

**v2 addition:** During the first cycle, also run the two v1 shadow tests from v2-Shadow-Test-Plan.md:
- Shadow Test 1: Promise Delivery removed from GPA (compute `calculateShadowGPA()`)
- Shadow Test 2: Defence & Trade sub-scores (compute sub-score grades independently)

These are v1 structural tests, not tri-lens scoring. They run here, not in Step 3.

**Output:** v1 grades finalized for all dimensions. v1 shadow test results recorded.

### Step 3: v2 Shadow Lens Scoring

For each pilot dimension (Immigration, Housing Supply, Fiscal Health, Defence, Trade Diversification):

**3a. Review the evidence tagged in Step 1.** For each piece of new evidence relevant to this dimension:
1. Confirm the primary lens assignment (Commitment / Execution / Outcome)
2. Check whether the evidence has a legitimate secondary role in another lens
3. If secondary role exists, document the different analytical role (per Core-Tri-Lens-Architecture.md Section 5.2)
4. If the different role cannot be clearly articulated, block the evidence from the secondary lens

**3b. Score each applicable lens.** Using the pilot template for this dimension (Pilot-Templates.md):
1. Review the current shadow lens grade (or assign initial grades if this is the first cycle)
2. Apply new evidence to each lens independently
3. Check each lens score against the template's grade thresholds
4. Apply modifiers at the lens level (per Core-Tri-Lens-Architecture.md Section 4)
5. Check blocking conditions for each lens
6. Record the shadow lens grade: whole-letter only (A, B, C, D, F)

**3c. Log the lens scoring rationale.** For each lens that changed (or was initially assigned):
- What evidence moved the grade
- Which lens the evidence was primary for
- Whether the evidence was used in any other lens and in what role
- What modifier was applied and why
- Confidence tag for this lens

**First cycle special case:** If this is the first shadow cycle, assign initial lens grades for all three lenses across all five pilot dimensions. Use the v1 grade and existing evidence as the baseline. Decompose the current v1 evidence into its lens components. This initial assignment does not require new evidence — it is a retrospective decomposition of the existing v1 assessment.

### Step 4: Cross-Lens QA and Deconfliction Check

After all pilot dimensions have been scored, run these checks:

**4a. Double-counting check (mechanical).** For each piece of evidence used in more than one lens within a dimension:
- Is the evidence performing a different analytical role in each lens?
- Is that different role documented in the Step 3c log?
- Apply the mechanical test from Core-Tri-Lens-Architecture.md Section 5.4: "If I removed this fact from Lens X, would Lens X's grade change? If I also used it in Lens Y, would removing it from Lens Y change Lens Y's grade?" If yes to both and it is the same observation, one lens must treat it as context only.

**4b. Cross-dimension deconfliction check.** Verify that v2 lens scoring has not introduced new cross-dimension double-counting:
- Defence Execution lens (NATO spending) must remain blocked from Fiscal Health Outcome lens
- Trade Diversification Outcome lens (export share) must remain blocked from Economic Policy Response
- Housing Supply Outcome lens (starts data) must remain blocked from Flagship Delivery scoring
- All deconfliction assignments from Deconfliction-Matrix.md remain in force

**4c. Contradiction check (QA Rule 3 extended).** For each pilot dimension:
- Does the Commitment lens score contradict the Execution lens score? (e.g., high commitment + high execution but low outcome — is this logically consistent or does it suggest misscoring?)
- Does the Execution lens score contradict the Outcome lens score? (e.g., low execution + high outcome — is the outcome attributable to non-federal actors?)
- If contradictions exist, they are not necessarily errors. Document the contradiction and the explanation. Contradictions that cannot be explained are blocking.

**4d. Lens-to-v1 consistency check.** For each pilot dimension:
- Is the shadow composite (Step 5) directionally consistent with the v1 grade?
- If not, why? Document the source of divergence.
- Divergence is expected and valuable — the point of shadow scoring is to surface where the blended v1 grade masks lens-level variation. But large unexplained divergence (>1 full letter) should be flagged for review.

### Step 5: Shadow Composite Computation and v1 Comparison

**5a. Compute shadow composite per pilot dimension.** Using the recommended Option 1 (lens-weighted composite) from Core-Tri-Lens-Architecture.md Section 3.2:
1. Convert each lens letter grade to GPA (A=4.0, B=3.0, C=2.0, D=1.0, F=0.0)
2. Apply dimension-specific weights from the pilot template
3. Compute weighted average
4. Round to nearest whole-letter grade

**5b. Compute shadow Full Policy Audit GPA.** Replace the v1 grades for pilot dimensions with their shadow composites. Keep v1 grades for all non-pilot dimensions. Compute the GPA.

For Defence and Trade Diversification: each sub-construct produces its own shadow composite. Average the two shadow composites to produce a combined Defence & Trade shadow entry for the GPA calculation (mirroring the v1 sub-scoring arithmetic).

**5c. Record the comparison.**

| Dimension | v1 grade | Shadow Commitment | Shadow Execution | Shadow Outcome | Shadow composite | Delta |
|---|---|---|---|---|---|---|
| Immigration | [v1] | [C/E/O] | [C/E/O] | [C/E/O] | [composite] | [v1 - composite] |
| Housing Supply | [v1] | [C/E/O] | [C/E/O] | [C/E/O] | [composite] | [v1 - composite] |
| Fiscal Health | [v1] | [C/E/O] | [C/E/O] | [C/E/O] | [composite] | [v1 - composite] |
| Defence | [v1 sub] | [C/E/O] | [C/E/O] | [C/E/O] | [composite] | [v1 - composite] |
| Trade Diversification | [v1 sub] | [C/E/O] | [C/E/O] | [C/E/O] | [composite] | [v1 - composite] |
| **Shadow GPA** | [v1 GPA] | | | | [shadow GPA] | [delta] |

### Step 6: Shadow Release Log Entry

Create a shadow release log entry (separate from the v1 release log). Format:

```
## Shadow Release Log — [Month Year]

### Lens Scores
[Table from Step 5c]

### Evidence Log
[For each pilot dimension: what evidence was used, which lens it was primary for, secondary uses, blocked uses]

### QA Results
- Double-counting violations found: [count and description]
- Cross-dimension deconfliction violations: [count and description]
- Contradictions found and resolved: [count and description]
- Contradictions found and unresolved (blocking): [count and description]

### v1 Comparison
- Shadow GPA vs v1 GPA: [comparison]
- Largest dimension-level divergence: [dimension, delta, explanation]
- Divergence assessment: [expected/unexpected, what it reveals]

### Design Observations
- What worked well in the tri-lens process
- What was hard to score or ambiguous
- Suggested design changes for next cycle
- Open questions surfaced (add to Open-Design-Decisions.md)
```

Store the shadow release log in `docs/v2/shadow-logs/[YYYY-MM].md`.

### Step 7: Publish v1

Publish the v1 update as normal. The v2 shadow results are NOT published. No changes to the live dashboard, `dimensions.json`, or public-facing files.

### Step 8: Post-Cycle Review

Within one day after v1 publication, review the shadow cycle results:

1. **Process review:** Was the workflow manageable? Did it fit within the target time (~45-60 minutes additional)?
2. **Quality review:** Were the lens scores defensible? Were the worked examples in Pilot-Templates.md adequate guides?
3. **Design review:** Did any open design decisions become clearer? Update Open-Design-Decisions.md.
4. **Scope review:** Should any pilot dimension be dropped or should a "Later" dimension be added?

---

## 3. Conflict Resolution Between Lenses

When lens scores appear to conflict (e.g., high Commitment + high Execution + low Outcome), apply this decision tree:

**Is the conflict logically consistent?**
- High Commitment + High Execution + Low Outcome → Consistent. The government committed and implemented, but outcomes haven't materialized yet. This is the expected pattern for lagged dimensions (Housing, Trade). Document and proceed.
- High Commitment + Low Execution + Any Outcome → Consistent. The government committed but hasn't implemented. Common in early-tenure dimensions. Document and proceed.
- Low Commitment + High Execution + High Outcome → Suspicious. How can execution be high without commitment? Check whether inherited programs (from prior government) are being scored as current-government execution. If so, the Execution lens may be miscalibrated.
- Any Commitment + Low Execution + High Outcome → Suspicious. If the government hasn't implemented, how are outcomes improving? Check attribution — the outcome may be driven by non-federal actors or external forces. Apply jurisdictional limits modifier to the Outcome lens.

**If the conflict cannot be explained:**
- The dimension is flagged as "lens conflict unresolved" in the shadow release log
- The shadow composite is computed but marked as provisional
- The conflict is added to Open-Design-Decisions.md for resolution before the next cycle

---

## 4. Promotion Criteria

The shadow layer should NOT be promoted to public view until ALL of the following are met:

1. **Minimum cycles completed:** At least 2 full shadow cycles (not counting the initial retrospective decomposition)
2. **QA stability:** Zero unresolved blocking contradictions in the most recent cycle
3. **Deconfliction clean:** Zero double-counting violations in the most recent cycle
4. **Workflow sustainable:** The additional time burden is manageable and documented as sustainable by the editor
5. **Divergence understood:** Every dimension-level divergence between v1 and shadow composite has been documented and explained
6. **No false precision:** Lens scores are not creating the appearance of more analytical precision than the evidence supports
7. **Editorial judgment:** The editor (Chris) judges that the lens scores add genuine analytical value beyond what the v1 blended grade already communicates

**What promotion looks like (recommendation):**
- Add lens scores as expandable detail within existing dimension cards
- Do NOT replace v1 headline grades with shadow composites
- Do NOT add lens-based GPA as a public headline
- Lens scores are informational context for readers who want to see the decomposition
- v1 grades remain the authoritative public scores until v2 has been stable for 6+ months

**This is a recommendation, not a project rule.** The promotion decision is parked in Open-Design-Decisions.md.
