# V2 Scoring Architecture Brief

## Canada Under Carney Dashboard — Next-Stage Design

---

## 1. Current Model Limits

The current dashboard is a disciplined public accountability scorecard. It has canonical scoring sheets, explicit rubric thresholds, deconfliction rules, measure selection controls, and a QA gate that blocks announcement-driven scoring. The March rehearsal held up after source cleanup. These are real achievements, and the model is launchable.

But it is not a performance-management system. The central structural weakness is that each dimension's composite score blends three fundamentally different questions into one grade:

- **What did Carney commit to?** (promise, pledge, stated priority)
- **What did the government actually do?** (legislation, funding, executive action, institutional deployment)
- **What happened in the real world?** (measurable change in conditions the public cares about)

When these three are folded into a single letter grade, the score becomes ambiguous. A "C" on Housing Supply could mean: he made strong commitments but the government has not acted; or the government acted but housing starts have not moved; or he never committed to much in the first place but conditions improved independently. The reader cannot tell which story the grade is telling.

This creates several downstream problems:

**Weighting sensitivity.** The 11 dimensions are not equally important to the public or equally measurable. Defence & Trade carries substantial weight because it has hard data (NATO spend, export share), while Ethics & Transparency is almost entirely qualitative. When both produce letter grades on the same scale, the implicit weighting distorts the overall picture.

**Plus/minus precision limits.** The difference between a C+ and a B- on Climate may come down to a single editorial judgment call about whether a framework announcement counts as a policy decision. The precision of the grade exceeds the precision of the evidence.

**Over-influential dimensions.** Flagship Delivery and Ethics & Transparency both carry probation flags. Their structural instability means they can swing the overall narrative disproportionately.

**Residual editorial judgment.** The QA gate and source hierarchy reduce editorial discretion, but they do not eliminate it. The choice of which measures to weight within a dimension, the application of modifiers, and the decision about whether a policy response is "real" or "performative" all involve analyst judgment.

**Methods review concerns.** Ethics & Transparency and Promise Delivery are the two areas where the methods review flagged the most structural risk. Promise Delivery is already ungraded, which is the right call. Ethics remains graded but on probation.

---

## 2. What a KPI/OKR Model Would Solve

Reorganizing the scoring architecture around three distinct performance lenses would resolve the ambiguity at the center of the current model.

### The Three Lenses

**Commitment lens: Did he do what he said he would do?**
Scores the clarity, specificity, and follow-through of stated commitments. A high commitment score means: the government made clear promises and has not walked them back.

**Execution lens: Did the government authorize, fund, legislate, and implement?**
Scores institutional action. A high execution score means: the government used its authority to act.

**Outcome lens: Did measurable conditions improve?**
Scores real-world results. A high outcome score means: things got better by observable measures.

### Why Separation Matters

**Analytical validity.** Each score answers one clear question with its own evidence base and threshold logic.

**Transparency.** A reader looking at Defence & Trade can see: commitment high, execution moderate, outcome early-stage. That is far more informative than a single "A-."

**Defensibility.** When a score is challenged, the three-lens model identifies exactly where the disagreement lies.

**Temporal stability.** Commitments are set early and change slowly. Execution accumulates over time. Outcomes lag. Separating them naturally accounts for the government's lifecycle stage.

---

## 3. Governance Layer That Carries Over

The following governance features from v1 are infrastructure that v2 must preserve intact:

- **Source hierarchy.** The 5-tier credibility ranking applies regardless of which lens is being scored.
- **QA rules and announcement gate.** An announcement alone cannot move an execution score or an outcome score. The commitment lens is the only place where an announcement might legitimately affect scoring.
- **Deconfliction matrix.** Must be extended: evidence used to score execution on Fiscal Health cannot also score execution on Economic Policy Response without justification.
- **Measure selection rules.** Each lens within a dimension should have its own defined measure set.
- **Correction protocol.** Demonstrated during the March rehearsal. Applies to all three lenses.
- **Dimension definitions.** The 11 graded dimensions define the scope. V2 does not need to redefine boundaries.
- **Shadow-test learnings.** March rehearsal findings about score stability and modifier behavior are baseline calibration data for v2.

These are governance assets, not temporary scaffolding. They solve problems any scoring system must solve.

---

## 4. Dimension Suitability by Lens

| Dimension | Commitment | Execution | Outcome | Notes |
|---|---|---|---|---|
| Defence & Trade | ✅ Suitable | ✅ Suitable | ✅ Suitable (lagging) | Strongest candidate for full three-lens treatment |
| Major Projects | ✅ Suitable | ✅ Suitable | ⚠️ Partial | Outcomes lag years. Credit-claiming penalty migrates to execution lens. |
| Fiscal Health | ✅ Suitable | ✅ Suitable | ✅ Suitable | One of the most data-rich dimensions |
| Economic Policy Response | ✅ Suitable | ✅ Suitable | ⚠️ Partial | Outcome lens requires attribution discount for macroeconomic forces |
| Affordability Response | ✅ Suitable | ✅ Suitable | ⚠️ Partial | Outcome lens carries large attribution discount |
| Carbon Pricing Policy | ✅ Suitable | ✅ Suitable | ⚠️ Partial | Isolating carbon price effect from other factors is methodologically difficult |
| Climate & Environment | ✅ Suitable | ✅ Suitable | ⚠️ Partial to weak | Emissions data lags 1-2 years. Outcome lens structurally limited. |
| Immigration | ✅ Suitable | ✅ Suitable | ✅ Suitable | Unusually good outcome data |
| Housing Supply | ✅ Suitable | ⚠️ Partial | ⚠️ Partial | Both execution and outcome require jurisdictional disclaimers |
| Ethics & Transparency | ⚠️ Partial | ⚠️ Partial | ❌ Not suitable | No credible quantitative outcome metric for ethical governance |
| Flagship Delivery | ✅ Suitable | ✅ Suitable | ⚠️ Partial | Outcome suitability varies by initiative |
| Promise Delivery | ✅ (IS the commitment lens) | ⚠️ Partial | ❌ Not suitable | Remains a tracker, not a graded dimension |

---

## 5. Dimensions Not Suitable for Strict KPI Treatment

### Ethics & Transparency
The most qualitative dimension. Attempts to create hard KPIs would measure bureaucratic process rather than whether the government is behaving honestly. Strict KPI treatment would convert subjective judgments into numbers with false objectivity.

**Recommended v2 treatment:** Bounded qualitative assessment, commitment and execution lenses only. No outcome score. Narrative accountability — showing the work behind the judgment — is more appropriate than a number.

### Promise Delivery
A tracker, not a performance dimension. Converting it into a KPI would require weighting promises against each other, which introduces exactly the kind of editorial judgment the governance layer minimizes.

**Recommended v2 treatment:** Maintain as ungraded tracker. Use it as the commitment inventory feeding commitment-lens scores across graded dimensions.

### Climate & Environment (outcome lens only)
Commitment and execution lenses are scoreable. But emissions outcomes cannot be scored on a mandate-relevant timeline with defensible data.

**Recommended v2 treatment:** Score commitment and execution. Report outcome indicators as contextual data without converting to a grade.

---

## 6. Recommended V2 Structure

**Recommendation: Option B — Add a parallel performance layer above the current model.**

### Why Not Option A (Replace)
The current model works. Replacing it means losing a functioning public product to build something more architecturally pure. That trade-off is not justified.

### Why Not Option C (Split into Separate Products)
Two separate products require two audiences, two update cycles, and two credibility arguments. Any disagreement between an accountability view and a performance view will be read as inconsistency. The operational overhead is significant.

### Why Option B
Option B preserves the current scorecard as the public-facing product. It adds a performance layer underneath that decomposes each dimension's grade into commitment, execution, and outcome sub-scores where the evidence supports it.

- **The letter grades stay.** The public sees the same format.
- **The three-lens decomposition sits behind each grade.** A user who wants depth can see it. A user who wants simplicity gets the letter grade.
- **Dimensions that cannot support all three lenses are honest about it.** Ethics shows commitment and execution only. Climate shows outcome as contextual data.
- **The governance layer applies to both levels.** No new governance is needed.
- **V1 remains operational during v2 development.** No cutover risk.

### Implementation Sequence

1. Launch v1 as-is.
2. Build three-lens decomposition for strongest dimensions first: Defence & Trade, Fiscal Health, Immigration.
3. Extend to partial-outcome dimensions: Major Projects, Economic Policy Response, Housing Supply.
4. Handle qualitative dimensions last: Ethics gets two-lens treatment. Promise Delivery remains tracker.
5. Assess whether composite grades should be mechanically derived from sub-scores or remain analyst-set. Defer this decision.

### What This Achieves

The public gets a simple, readable scorecard. Analysts get a decomposed view showing the reasoning. Governance controls remain in force. Dimensions that resist quantification are treated honestly. The system evolves incrementally without disruptive rebuild.

V1 is the foundation. V2 is the performance layer built on top of it. The architecture grows; nothing is discarded.

---

*V2 Scoring Architecture Brief v1.0 — April 2026*
