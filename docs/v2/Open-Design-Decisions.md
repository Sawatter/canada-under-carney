# Open Design Decisions

- **Purpose:** Track unresolved design decisions that require editorial judgment before or during v2 shadow scoring. Each decision includes the options, trade-offs, and a recommendation where one exists.
- **Status:** Living document — updated after each shadow cycle.
- **Last updated:** 2026-04-15
- **Depends on:** Core-Tri-Lens-Architecture.md, Dimension-Applicability-Matrix.md, Pilot-Templates.md, Shadow-Run-Workflow.md, V2-Scoring-Architecture-Brief.md
- **Used by:** Editor (Chris) for design resolution during and after shadow cycles

---

## Decision 1: Publish Separate Lens Scores or Combine Them?

**Question:** If v2 is eventually promoted to public view, should the dashboard show three separate lens grades per dimension, a single combined shadow composite, or both?

**Option A — Separate lens scores only.** Each dimension card shows Commitment, Execution, and Outcome as independent grades. No combined number.
- Pro: Maximum transparency. Readers see exactly where the government is strong and weak.
- Con: Increases visual complexity. Readers may not know which lens to weight. Creates a "pick the number you like" problem.

**Option B — Combined shadow composite only.** Each dimension card shows a single v2 composite grade derived from lens-weighted scoring.
- Pro: Simple. One number per dimension, directly comparable to v1.
- Con: Reintroduces the blending problem that v2 was designed to solve. The composite masks lens variation.

**Option C — Both, with composite as headline (RECOMMENDED).** Dimension card shows the v2 composite as the primary grade, with lens scores available in an expandable detail section.
- Pro: Readers who want simplicity get one number. Readers who want decomposition can expand. Preserves the v2 analytical value without overwhelming the default view.
- Con: Additional UI complexity. Requires clear labeling to avoid confusion between v1 and v2 grades during any transition period.

**Current status:** Unresolved. Decision deferred until at least 2 shadow cycles are complete and the lens-weighted composite has been tested for stability.

**Depends on:** Whether the lens-weighted composite (Option 1 from Core-Tri-Lens-Architecture.md Section 3.2) proves stable and defensible in shadow testing.

---

## Decision 2: Should Commitment Affect Any Public-Facing Composite?

**Question:** The Commitment lens captures whether the government made specific, credible promises. Should commitment scores affect the composite GPA, or should the composite be execution + outcome only?

**Option A — Include Commitment in composite.** Use the lens weights from Pilot-Templates.md (0.15 for most dimensions, 0.33 for Immigration).
- Pro: Commitment matters. A government that makes no promises should score differently from one that makes comprehensive promises and fails to deliver.
- Con: Commitment is structurally stable — governments rarely withdraw published commitments. Including it inflates composites upward and masks execution/outcome failures.

**Option B — Exclude Commitment from composite (execution + outcome only).** Commitment is displayed but does not enter the composite GPA.
- Pro: The composite measures what the government DID and what HAPPENED, not what it SAID. This is the strongest performance signal.
- Con: Commitment is analytically important. Excluding it from the composite reduces it to a cosmetic label.

**Option C — Include Commitment only when it is actively moving (RECOMMENDED).** Default composite uses execution + outcome weights only. If the Commitment lens changes in a cycle (new commitment or withdrawal), include it in that cycle's composite at the weights from Pilot-Templates.md. Otherwise, it is displayed but excluded.
- Pro: Commitment only affects the composite when it represents real change, not structural stability.
- Con: Complex. The composite formula changes cycle to cycle. Harder to explain to readers.

**Current status:** Unresolved. The first shadow cycle should test all three options by computing all three composite variants and comparing results. If the difference between Options A and B is consistently less than 0.3 GPA, the choice may not matter in practice.

---

## Decision 3: Should the Defence / Trade Split Become Permanent?

**Question:** v1 currently displays Defence & Trade as one combined dimension with sub-scores. v2 treats them as separate pilot constructs. Should the split become permanent in v1?

**Option A — Permanent split.** Defence and Trade Diversification become two separate dimensions in v1. GPA calculation uses 12 graded dimensions.
- Pro: Cleanest construct validity. Defence is execution-heavy milestone; Trade is outcome-heavy and externally influenced. They answer different questions.
- Con: Changes the v1 GPA denominator. Defence (A) and Trade (B+) as separate dimensions may shift the headline. Creates a comparability break with the pre-split GPA series.

**Option B — Keep combined with sub-scores (current state).** v1 continues to show Defence & Trade as one dimension with visible sub-scores. v2 treats them separately in shadow only.
- Pro: No v1 disruption. Sub-scores already mitigate the blending problem. GPA series is unbroken.
- Con: The combined dimension is analytically impure. A permanent milestone (NATO 2%) masks trade regression risk.

**Option C — Split in v2 only; keep combined in v1 (RECOMMENDED for now).** v1 maintains the combined dimension. v2 shadow scores Defence and Trade separately. If the v2 shadow scores diverge materially for 2+ cycles, trigger the existing decision gate from v2-Decision-Memo-Defence-Trade.md (>1.0 GPA divergence for 2 consecutive cycles → automatic queue for full split).
- Pro: Preserves v1 stability while testing the split in shadow. Uses the existing decision gate rather than making a premature call.
- Con: Delays a decision that may already be justified by construct analysis.

**Current status:** Deferred to the existing decision gate. The v2 shadow cycle will produce the data needed to trigger or not trigger the split.

**Decision gate (from v2-Decision-Memo-Defence-Trade.md):** If Defence and Trade sub-scores diverge by >1.0 GPA for 2 consecutive monthly cycles, the dimension is automatically queued for full split.

---

## Decision 4: Is Housing Outcome Scoring Too Attribution-Sensitive for Monthly Grading?

**Question:** Housing Supply has the lowest federal attribution in the framework (30%). Is the Outcome lens meaningful at monthly frequency, or should it be scored quarterly or annually?

**Option A — Monthly outcome scoring with attribution qualifier.** Score the Outcome lens monthly using CMHC SAAR data, but always carry the attribution qualifier ("Federal contribution ~30%").
- Pro: Monthly data is available (CMHC publishes monthly). Consistent with other pilot dimensions' cadence.
- Con: Monthly SAAR is volatile. Federal attribution is low enough that monthly outcome movements may be noise, not signal. Risk of false precision.

**Option B — Quarterly outcome scoring.** Score the Outcome lens only when quarterly data is available or when 3-month SAAR trend is established. Monthly data is recorded but does not trigger lens grade reassessment.
- Pro: Reduces volatility. Three-month trend is more defensible for a low-attribution dimension.
- Con: Creates a different cadence from other pilot dimensions. Adds workflow complexity.

**Option C — Annual outcome scoring only.** Score the Outcome lens once per year using annual completions and starts data. Monthly and quarterly data are context only.
- Pro: Annual data is the most defensible for a shared-jurisdiction, lagged outcome. Eliminates monthly noise.
- Con: Too slow for a monthly update cycle. The Outcome lens would be effectively frozen for most of the year.

**Recommendation:** Option A for the first pilot cycle (monthly with attribution qualifier and 3-month trend requirement from Pilot-Templates.md blocking conditions). If the Outcome lens proves too volatile or uninformative after 2 cycles, move to Option B.

**Current status:** Unresolved. Will be tested in the first shadow cycle. The Pilot Template blocking condition ("blocked if assessment uses a single monthly SAAR print without 3-month trend context") provides a practical guard against monthly noise.

---

## Decision 5: How Should Initial Shadow Grades Be Set?

**Question:** The first shadow cycle requires initial lens grades for all pilot dimensions. How should they be derived?

**Option A — Retrospective decomposition of v1 evidence.** Review the existing v1 evidence base for each pilot dimension and assign lens grades based on what that evidence would score under the tri-lens framework.
- Pro: Produces a starting baseline grounded in existing evidence. Makes the first cycle comparison meaningful.
- Con: Retrospective decomposition is subjective — two editors might decompose differently.

**Option B — All lenses start at C (neutral baseline).** Every lens starts at C and moves only on new evidence.
- Pro: Simple. No retrospective judgment required. Forces the first cycle to produce its own evidence base.
- Con: Starting at C for a dimension currently at A- (Defence) or D- (Affordability) creates meaningless first-cycle deltas. Comparison to v1 is uninformative.

**Recommendation:** Option A. The point of the shadow cycle is to test whether tri-lens scoring adds analytical value over blended v1 scoring. Starting from a decomposition of existing evidence makes the comparison meaningful from cycle 1. The decomposition should be documented in the first shadow release log with explicit reasoning.

**Current status:** Resolved (recommendation). This should be treated as the default unless the editor identifies a specific reason to deviate.

---

## Decision 6: Should the Composite Lens Weights Be Fixed or Dimension-Adaptive?

**Question:** Core-Tri-Lens-Architecture.md defines lens weights by dimension type (outcome-led, execution-led, full tri-lens). Should these weights be fixed for all cycles, or should they adapt based on evidence availability?

**Option A — Fixed weights (RECOMMENDED).** Weights are set in Pilot-Templates.md and do not change cycle to cycle.
- Pro: Simple. Comparable across cycles. No judgment required about weight adjustment.
- Con: If evidence for one lens is genuinely unavailable in a cycle (e.g., no new outcome data), the composite still includes a potentially stale lens score at full weight.

**Option B — Adaptive weights.** If no new evidence is available for a lens, reduce its weight and redistribute to the other lenses for that cycle.
- Pro: The composite reflects what is actually known this cycle.
- Con: Complex. Weight changes cycle to cycle make the composite non-comparable. Creates a new source of editorial judgment and potential manipulation.

**Current status:** Resolved (recommendation). Use fixed weights. If a lens has no new evidence in a cycle, the prior cycle's grade carries forward at full weight. This is analogous to how v1 handles dimensions with no new evidence — the grade persists.

---

## Decision 7: What Happens If the Pilot Fails?

**Question:** What are the failure criteria for the v2 pilot, and what happens if the architecture doesn't work?

**Failure indicators (any one is sufficient):**
- Lens scores are consistently indistinguishable from v1 blended grades (v2 adds no analytical value)
- Double-counting violations cannot be resolved after 2 cycles
- Lens-level QA burden makes the monthly cycle unsustainable
- Lens scores create false precision (appearing more exact than the evidence supports)
- The editor judges that lens decomposition does not improve the reader's understanding beyond what v1 already provides

**If the pilot fails:**
- The v2 shadow layer is discontinued
- v1 continues as the live public model
- The shadow release logs are retained as architectural learning
- A post-mortem is written documenting what failed and why
- No v2 scores are ever published

**Current status:** Pre-resolved. These criteria are set before the pilot begins so that the decision to continue or discontinue is based on pre-committed standards, not post-hoc rationalization.

---

## Decision 8: Ethics & Transparency — When Does It Get Lens Treatment?

**Question:** Ethics & Transparency is currently an exception case (bounded qualitative, not tri-lens). Under what conditions would it receive even partial lens treatment?

**Prerequisite:** At least one semi-quantitative indicator must be developed. Candidates:
- Disclosure completeness score (percentage of required disclosures filed on time)
- Ethics Commissioner recommendations: percentage addressed within stated timelines
- Proactive disclosure compliance rate

**Threshold for partial lens treatment:** The semi-quantitative indicator must have at least 3 data points (quarters or cycles) before it can anchor a lens grade.

**Most likely lens:** Execution (bounded). If the indicator measures whether the government is following its own transparency commitments, that is an execution question.

**Current status:** Parked until the indicator is developed. This is listed as handoff brief item #4 (before second cycle, June 2026).

---

## Decision 9: Flagship Delivery — Relationship to v2 Architecture

**Question:** Flagship Delivery uses a mechanical Combination Rule across 5 home files. If v2 decomposes those home dimensions into lenses, does Flagship Delivery become redundant?

**Scenario A — Flagship becomes redundant.** If the v2 Execution lens for Defence, Housing, Immigration, Climate, and Major Projects produces clear execution scores, then Flagship Delivery (which already functions as a cross-cutting execution assessment) adds nothing independent.
- Action: Retire Flagship Delivery from v1. Remove probation. The Execution lens across pilot dimensions replaces its function.

**Scenario B — Flagship retains independent value.** If the Combination Rule captures something the individual Execution lenses miss (cross-cutting delivery capacity, patterns across files), Flagship retains value as a synthetic indicator.
- Action: Keep Flagship Delivery in v1 but do not give it tri-lens treatment. It remains a bounded whole-letter grade.

**Current status:** Deferred until Flagship Delivery's probation test in the May 2026 cycle. If the Combination Rule contradicts individual dimension grades, Scenario A is likely. If it adds independent insight, Scenario B is likely.

---

## Recommended Pilot Dimensions for the First Shadow Cycle

1. **Immigration** — full tri-lens (Commitment: Yes, Execution: Yes, Outcome: Yes). Tests the strongest case.
2. **Housing Supply** — execution-led with cautious outcome (Execution: Yes, Outcome: Partial). Tests attribution limits.
3. **Fiscal Health** — outcome-led (Outcome: Yes, Execution: Partial). Tests outcome-primary scoring.
4. **Defence** — execution-heavy milestone (Execution: Yes, Outcome: Partial). Tests milestone-based scoring.
5. **Trade Diversification** — outcome-heavy, externally influenced (Outcome: Yes, Execution: Yes). Tests the hardest attribution case.

These five constructs cover the four major architectural patterns (full tri-lens, execution-led, outcome-led, and milestone) and the two major risk factors (low attribution and external influence). If the architecture works for these five, it can extend to the "Later" dimensions with confidence.

---

## First 3 Implementation Tasks

### Task 1: Set Initial Shadow Lens Grades (before first shadow cycle)

Retrospectively decompose the existing v1 evidence base for all five pilot dimensions into Commitment, Execution, and Outcome lens grades. Use the grade thresholds from Pilot-Templates.md. Document the decomposition rationale in the first shadow release log.

**Estimated effort:** 60-90 minutes.
**Prerequisite:** None. Can be done immediately using existing Canonical-Scoring-Sheets.md evidence.

### Task 2: Run the First Full Shadow Cycle (May 2026)

Execute the Shadow-Run-Workflow.md Steps 1-8 alongside the May v1 update. This is the first real test of whether the tri-lens architecture produces defensible, distinct scores.

**Estimated effort:** 45-60 minutes additional to the v1 cycle.
**Prerequisite:** Task 1 (initial grades set). May data fetch and v1 scoring complete.

### Task 3: Review and Update Design Decisions (after first shadow cycle)

After the first shadow cycle, review each open decision in this document. Update the status of decisions that became clearer. Add any new design questions surfaced during the cycle. Update Pilot-Templates.md if any lens thresholds or blocking conditions proved too tight or too loose.

**Estimated effort:** 30 minutes.
**Prerequisite:** Task 2 complete. Shadow release log from first cycle available.
