# V2 Scoring Architecture Brief

## Primary Inputs Used

- `Scoring-Rubric-v1.1.md`
- `Canonical-Scoring-Sheets.md`
- `QA-Gatekeeping-Rules.md`
- `Deconfliction-Matrix.md`
- `Measure-Selection-Rules.md`
- `Launch-Recommendation.md`
- `Sensitivity-Analysis.md`
- `Dimension-Status-Register.md`
- `v2-Decision-Memo-Promise-Delivery.md`
- `v2-Decision-Memo-Defence-Trade.md`
- `v2-Shadow-Test-Plan.md`

The current dashboard is now a disciplined public accountability scorecard. It is no longer a loose editorial model. The governance stack is real: published rubric thresholds, canonical scoring sheets, source hierarchy, measure-selection controls, deconfliction rules, QA gatekeeping, shadow testing, and a correction protocol all materially improve defensibility.

At the same time, the current model is still not a true KPI or OKR-style performance management system. Its central unresolved weakness is structural: it still blends commitment, execution, and real-world outcome into single dimension grades and then into a single composite headline.

That means `v1` should be launched and learned from, but `v2` should be designed as a stronger performance layer built on top of the current governance spine rather than as a replacement for it.

## 1. Current Model Limits

The current model now performs well as a public accountability instrument, but it still does several things poorly if judged as a performance management system.

First, it mixes three different questions inside one scoring architecture:
- Did Carney make the commitment?
- Did the government actually authorize, legislate, fund, and implement?
- Did the real-world condition improve?

That blending is the core structural weakness. In the current dashboard, some dimensions are mostly action-based, some are mostly outcome-based, some are mixed, and some are accountability overlays. The result is a composite that is more disciplined than before, but still analytically impure.

Second, the headline remains sensitive to weighting choices and dimension design. The sensitivity analysis shows the equal-weight Full Policy Audit at `1.65 (C-)`, the household-weight view at `1.45 (D+)`, and the attribution-adjusted view at `1.68 (C-)`. That range is too wide to treat the headline as a robust performance verdict. It is still partly a function of editorial weighting choices rather than only of underlying evidence.

Third, the current model still has dimensions that distort the composite:
- `Promise Delivery` is derivative. It adds accountability value, but as a scored dimension it re-counts events already scored elsewhere.
- `Defence & Trade` remains a mixed construct in which a durable defence milestone can mask a trade regression.
- `Flagship Delivery` remains on probation because it draws from home dimensions and must still prove it adds independent value.

Fourth, plus/minus precision is still uneven across the instrument. The launch recommendation already recognized this by moving `Ethics & Transparency` and `Flagship Delivery` to whole-letter display. That was the right correction, but it also exposes the broader issue: some parts of the model still look more numerically exact than the evidence base really supports.

Fifth, a small number of dimensions still rely heavily on editorial judgment even after controls were added. `Ethics & Transparency` is the clearest case: the construct is sharper than before, but the indicator stack remains qualitative, politically charged, and vulnerable to inter-rater variation. `Affordability Response` and `Economic Policy Response` are better bounded than they were, but both still require careful human judgment about scope and about when policy response has moved beyond announcement.

Sixth, the methods concerns have not disappeared; they have been contained. The current system now has answers to announcement bias, metric mixing, and double-counting. What it still does not fully solve is whether a single blended score can fairly represent dimensions where promises, delivery, and outcomes move on different timelines and with different attribution profiles. That is why `v1` is now a disciplined scorecard, but not yet a true performance system.

## 2. What a KPI or OKR Model Would Solve

A stronger model would not simply "score harder." It would separate the current blended question into three distinct lenses:

- `Commitment`: Did he do what he said he would do?
- `Execution`: Did the government authorize, fund, legislate, and implement?
- `Outcome`: Did the measurable condition improve?

That separation would solve several problems at once.

It would improve construct validity. A promise-kept score would no longer be mixed into an outcome score. A policy authorization would no longer be mistaken for a real-world result. A delayed outcome would no longer look like failed execution when the implementation work is actually happening.

It would improve transparency. Readers could see whether a government is strong at announcing, strong at implementing, weak at generating results, or some combination of the three. Right now, those distinctions are often visible only inside the rationales, not in the scoring architecture itself.

It would improve defensibility. A future challenge to the dashboard would be easier to answer if the system could say, for example:
- commitment performance is relatively strong in immigration and defence
- execution performance is mixed in housing and major projects
- outcome performance is weak in affordability and fiscal trajectory

That is much closer to performance management than the current article-and-stat blend.

It would also improve comparability across dimensions. The current dashboard compares unlike things:
- `Fiscal Health` is mostly outcome
- `Major Projects` is mostly implementation
- `Promise Delivery` is accountability
- `Ethics & Transparency` is process
- `Defence & Trade` is partly execution and partly outcome

Under a KPI or OKR model, those differences would be made explicit rather than buried inside one equal-weight composite.

Most importantly, a tri-lens model would preserve the democratic accountability value of promise tracking without contaminating the performance composite. A government can keep promises but fail on outcomes. It can also improve outcomes while breaking promises. Those are distinct realities and should be visible as distinct scores.

## 3. Governance Layer That Carries Over

The current model has already built the governance layer `v2` needs. These controls should carry over unchanged unless direct testing proves they need revision.

- `Source hierarchy`: The Tier 1 to Tier 5 source rules are essential. They keep the instrument anchored to official data, independent analysis, and corroborated reporting.
- `QA gatekeeping`: The announcement-versus-implementation ladder, contradiction checks, confidence discipline, multi-notch move rules, and automatic blocking conditions are exactly the kind of controls a future performance model still needs.
- `Deconfliction rules`: These are even more important in `v2`, because a multi-lens system increases the number of places the same fact could accidentally score twice.
- `Measure-selection rules`: These should remain intact so that outcome scoring does not drift into mixed windows, mismatched definitions, or opportunistic cherry-picking.
- `Correction protocol`: A v2 model will need at least the same level of auditability when a score changes.
- `Dimension definitions`: The current work defining constructs, boundaries, primary evidence homes, and confounders is not temporary scaffolding. It is the foundation that makes future lens separation possible.
- `Shadow-test learning`: The work already done on `Promise Delivery`, `Defence & Trade`, weighting sensitivity, and precision limits should be treated as architectural evidence, not as side notes.

These should be understood as governance assets, not as `v1` workarounds.

What changes in `v2` is not the control layer. What changes is the scoring architecture sitting on top of it.

## 4. Dimension Suitability by Lens

| Dimension | Commitment suitability | Execution suitability | Outcome suitability | Best scoring lens | Key warning |
|---|---|---|---|---|---|
| Defence & Trade | Medium | High | Medium | Split by sub-construct, not one lens | Defence is an execution-heavy milestone; trade is an externally influenced outcome. Keeping them together creates false precision. |
| Major Projects | Low | High | Low | Execution | The current construct is institutional machinery, not downstream economic benefit. Credit-claiming and inherited pipeline effects remain major confounders. |
| Fiscal Health | Low | Medium | High | Outcome | Fiscal policy choices are executive acts, but the dimension is fundamentally about trajectory and sustainability. Shocks and strategic defence spending complicate attribution. |
| Economic Policy Response | Medium | High | Low | Execution | This dimension is highly vulnerable to announcement bias. Productivity and investment outcomes lag too much for tight monthly KPI treatment. |
| Affordability Response | Medium | High | Low | Execution | Prices are driven by global markets, provinces, and monetary policy. Outcome scoring would over-attribute federal control. |
| Carbon Pricing Policy | Medium | High | Medium | Execution | Instrument design is gradeable; emissions effects belong mostly in Climate. Strict outcome treatment would create deconfliction problems. |
| Climate & Environment | Medium | High | Medium | Execution | The government can be judged on framework design and reversals now, but emissions and environmental outcomes are lagged, multi-causal, and partly external. |
| Immigration | High | High | High | Execution and Outcome | This is one of the strongest candidates for full tri-lens scoring, but definitions must stay consistent across StatsCan and IRCC sources. |
| Housing Supply | Medium | High | Medium | Execution | Federal actions are gradeable, but housing outcomes are shared-jurisdiction and lagged. Outcome scoring should be used carefully and with time-matched measures. |
| Ethics & Transparency | Low | Medium | Low | Bounded qualitative execution/process | This is the weakest candidate for strict KPI treatment. The evidence stack is qualitative and politically valenced. |
| Flagship Delivery | Low | High | Low | Execution | The dimension measures cross-cutting delivery capacity, not policy outcomes. It remains at risk of overlap with home dimensions. |
| Promise Delivery | High | Low | Low | Commitment | This is a commitment tracker, not an independent performance dimension. It should inform accountability visibility, not the main composite. |

Two patterns stand out.

The first is that most current dimensions are better suited to `execution` scoring than to strict `outcome` scoring. That is not a flaw in `v1`; it reflects the reality that federal governments can control authorizations and implementation more directly than real-world conditions.

The second is that only a subset of dimensions can genuinely sustain all three lenses without distortion. `Immigration` is the clearest candidate. `Housing Supply` and `Climate & Environment` can support partial tri-lens treatment, but only if the outcome side is handled cautiously. `Ethics & Transparency`, `Flagship Delivery`, and `Promise Delivery` should not be forced into a symmetric three-lens framework.

## 5. Dimensions Not Suitable for Strict KPI Treatment

Some dimensions should remain accountability-oriented or bounded-qualitative rather than be forced into rigid KPI scoring.

`Ethics & Transparency` is the clearest case. The current construct is legitimate and should remain visible, but strict KPI treatment would be misleading. The available evidence is event-driven, qualitative, and politically loaded. A future model can improve this with semi-quantitative anchors such as disclosure completeness, but it is still better handled as a bounded qualitative assessment with explicit confidence limits than as a pseudo-precise KPI.

`Flagship Delivery` is also not a clean KPI dimension in the normal sense. It exists to answer a real question about cross-cutting delivery capacity, but it does so by combining evidence from five home files. That makes it inherently synthetic. It can remain useful as an execution lens or probationary dashboard layer, but it should not be treated like a clean single-construct KPI without more evidence that the combination rule adds value independently.

`Promise Delivery` should remain visible, but not as a strict KPI inside the main performance composite. Promise fulfillment is democratically important, but it is a separate accountability function. Trying to treat it as a standard KPI creates double-counting and conflates promise-keeping with policy effectiveness.

`Defence & Trade` in its current combined form is also not suitable for strict KPI treatment. The issue is not that defence or trade are unmeasurable. It is that the combined dimension merges an execution-heavy defence milestone with an outcome-heavy trade diversification story. Until the constructs are fully split, KPI treatment should remain cautious.

More broadly, the lesson is that `v2` should not force every dimension into the same mold. Some should support commitment, execution, and outcome scoring directly. Some should support only one primary lens. Some should remain narrative accountability layers with disciplined evidence rather than hard KPI arithmetic.

## 6. Recommended V2 Structure

`Option B: Add a parallel performance layer above the current model.`

This is the best path because it preserves the credibility and launch-readiness of `v1` while solving the real design problem in stages rather than through a disruptive rebuild.

Option A would be too destructive. Replacing the current model outright would throw a newly stabilized scorecard into another full methodological reset just as its governance controls have started to hold.

Option C is directionally attractive, but premature as the primary move. A full split into separate accountability and performance views may eventually make sense, but the current project is not yet ready to sustain two equally mature top-level products. The immediate need is to add performance architecture without destabilizing the accountability product that is already ready to launch.

The recommended structure for `v2` is:
- keep the current dashboard as the public accountability scorecard
- keep the Promise Tracker as the commitment-accountability layer
- add a shadow or secondary performance architecture that scores selected dimensions through commitment, execution, and outcome lenses
- promote that layer gradually once the lens design proves stable

### First 3 implementation moves

1. Define a tri-lens schema at the scoring-sheet level.
   For every dimension, add fields for `commitment`, `execution`, and `outcome` applicability, along with a rule for whether the dimension supports all three lenses, only one lens, or a bounded qualitative exception.

2. Pilot the lens model on the dimensions most capable of supporting it cleanly.
   Start with `Immigration`, `Housing Supply`, `Fiscal Health`, and the split treatment of `Defence` and `Trade Diversification`. Do not start with `Ethics`, `Flagship Delivery`, or `Promise Delivery`.

3. Run the performance layer in shadow before making it public.
   Use the existing QA, measure-selection, and deconfliction controls. Compare the shadow lens outputs against the live `v1` composite for at least one real cycle before deciding whether any part of the performance layer should become public-facing.

### Transition risks if the shift happens too quickly

1. False precision risk.
   If the dashboard forces all dimensions into commitment, execution, and outcome scoring before the indicator stack is ready, it will produce cleaner-looking numbers with weaker underlying validity, especially in `Ethics & Transparency` and `Flagship Delivery`.

2. Comparability and workflow risk.
   If `v2` is promoted too quickly, the project could lose continuity with the existing score series while also overloading the monthly update workflow with parallel scoring burdens that have not yet been proven worth the cost.

The right strategic stance is therefore conservative but forward-moving: launch `v1` as the disciplined accountability scorecard it has become, and build `v2` as a parallel performance layer that inherits the current governance system rather than replacing it.
