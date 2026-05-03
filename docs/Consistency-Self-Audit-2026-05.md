# Consistency Self-Audit — May 2026

Purpose: test whether the dashboard applies the same kind of scoring logic across all live dimensions, not whether every reader will agree with every criterion.

Status: internal methodology audit prompted by Reddit feedback. This is a scoring-governance artifact, not a grade change by itself.

## Audit standard

This audit uses two simple checks:

1. **Consistency:** for each dimension, can we state what would move it up one notch and down one notch in the same kind of evidence language used elsewhere?
2. **Traceability:** can a reader move from `grade -> move trigger -> evidence type -> source home` without hunting through multiple surfaces?

Working product rule after the Reddit pass:

> Trust comes less from pretending the dashboard has no judgment and more from applying the same rule structure across files, then making the judgment and evidence path easy to trace.

## Dimension-by-dimension read

| Dimension | Grade | What moves it up | What moves it down | Trigger style | Consistency read |
|---|---|---|---|---|---|
| Defence & Trade | A- | Funded 3.5% defence path; US export share drops below 68% | NATO spending falls below 2%; US share rises above 73% | Mixed milestone + outcome | **Outlier.** Two constructs with very different evidence shapes sit in one grade. |
| Major Projects | C | >=30% of cohort shows documented post-designation advancement; first full MPO cycle; first use of designation power | Project withdrawal; cohort reverses; framework bypassed | Cohort-progress / implementation | Structurally coherent now, but uses a different cohort ladder than most files. |
| Fiscal Health | D | PBO confidence rises above 25%; Fitch warning removed | Actual downgrade; deficit > $90B without revenue | Threshold + external validation | Consistent. Up/down logic is symmetric and evidence-based. |
| Economic Policy Response | D | AI compute fund actually disburses; business investment turns positive for 2+ quarters | More major announcements without authorization; investment decline worsens | Execution + quarterly outcome | Mostly consistent. Execution threshold is clear, but permitting remains thinner than other lever checks. |
| Affordability Response | D- | New funded benefit > $500/household; mandatory grocery measure enacted | Food CPI > 7%; benefit expires; food insecurity > 12M | Relief-scale + household-pressure thresholds | Consistent, though the benefit trigger is more program-specific than some other files. |
| Carbon Pricing Policy | C | Effective industrial price rises above $40/t; border adjustment plan announced | Effective price falls below $15/t; industrial pricing elimination announced | Instrument-strength threshold | Consistent and one of the cleanest files. |
| Climate & Environment | D | Funded replacement strategy published; ECCC budget restored | Paris withdrawal; additional program eliminations | Framework coherence / reversal | Consistent. Clear framework-based trigger logic. |
| Immigration | C+ | Long-term model published; temporary residents hit 5% target early | Service failure attributable to pullback; contraction reverses | Levels correction + system-management | Consistent, though it blends execution with planning adequacy. |
| Housing Supply | D | Build Canada Homes construction begins and starts exceed 300K annualized | Starts fall below 240K; federal spending declines without offset | Outcome + binding delivery | Consistent. The "announcements do not count as homes" rule matches broader dashboard discipline. |
| Ethics & Transparency | C | Commissioner review finds disclosure adequate; proactive full accounting published | Undisclosed interests; inadequate screening finding; two independent critiques cite a material gap | Governance-process / formal review | Consistent inside its own process lane. This file is judgment-heavy but explicitly bounded. |
| Flagship Delivery | C | At least one flagship file improves one status category under the Combination Rule | At least one flagship file worsens one status category | Combination-rule / derivative implementation | **Outlier.** This is a meta-file whose movement depends on status coding elsewhere. |
| Promise Delivery | Tracker | Delivered count reaches 18/43 without new abandonments | Abandonments rise above 15; housing and climate remain unmoved another cycle | Count-based derivative accountability | **Outlier.** Derivative accountability tracker, intentionally excluded from GPA. |

## What looks consistent

Most of the dashboard now uses a recognizable one-notch pattern:

- a published current grade
- a short list of concrete move-up triggers
- a short list of concrete move-down triggers
- a scope note that says what the file is and is not grading
- a judgment statement that admits where editorial interpretation still enters

That pattern now holds well for:

- Fiscal Health
- Economic Policy Response
- Affordability Response
- Carbon Pricing Policy
- Climate & Environment
- Immigration
- Housing Supply
- Ethics & Transparency

Major Projects is also much stronger after the cohort rewrite. It is still structurally specialized, but it is no longer a brittle first-event file.

## Main outliers

### 1. Defence & Trade is still a mixed-construct grade

This remains the biggest consistency outlier among the live policy files.

- Defence is a milestone-heavy, high-attribution file.
- Trade is a continuous outcome with meaningful external dependence.
- The grade behaves like a defence grade with a trade modifier.

That can be defended, but it should be treated as an explicit exception, not as a normal file.

### 2. Flagship Delivery is a meta-file, not a home dimension

Its triggers are structurally consistent *with itself*, but not with the core dashboard because:

- it inherits status judgments from other files
- it grades distribution across categories rather than a standalone evidence home
- it adds a second layer of abstraction for the reader

This does not make it invalid. It does make it a category exception.

### 3. Promise Delivery is a tracker exception, not a graded-peer problem

This file is structurally different by design:

- every movement is inherited from promise coding elsewhere
- it is intentionally excluded from GPA and rendered as a tracker
- it carries one up-trigger and two down-triggers because it is a cumulative accountability tally, not a peer dimension
- the consistency question here is presentation discipline, not whether it should still count as a live graded file

The core structural decision was already the right one: keep it separate from the 11 performance grades.

### 4. Housing Supply is no longer a trigger-asymmetry exception

Housing previously sat outside the dashboard's usual 2-up / 2-down pattern.

That has now been corrected:

- the file carries two up-triggers
- the file carries two down-triggers
- both up-triggers now point at live public source homes

The dimension remains long-lag and shared-jurisdictional, but it is no longer a structural trigger-pattern outlier.

## Source-balance finding

Traceability is not only a UI-proximity problem. The underlying source counts are themselves uneven across files:

| Dimension | Source count |
|---|---:|
| Fiscal Health | 5 |
| Carbon Pricing Policy | 5 |
| Immigration | 5 |
| Flagship Delivery | 5 |
| Promise Delivery | 5 |
| Affordability Response | 6 |
| Defence & Trade | 6 |
| Major Projects | 7 |
| Housing Supply | 7 |
| Ethics & Transparency | 7 |
| Climate & Environment | 8 |
| Economic Policy Response | 8 |

That variance matters because a later "sources closer to grades" pass will still feel uneven if some files have three links and others have twelve.

Working rule for the next pass:

- aim for a normal source band of roughly **5 to 8** per live dimension
- keep overloaded files from drifting back into kitchen-sink source lists
- strengthen thin files where the evidence base is currently sparse

## Traceability model status

The main architectural blocker is now fixed.

Every `gradeTriggers.up[]` and `gradeTriggers.down[]` entry now carries structured trigger metadata:

- trigger text
- source label
- optional source URL

So the chain is now:

`grade -> trigger -> source home`

The remaining work is completion, not architecture:

- some triggers are now fully linkable and carry direct URLs
- some are intentionally label-only because they depend on future event-driven sources
- some internal or derived triggers (for example cohort tables or combination-rule tallies) still point to an in-card evidence home rather than a public URL

## Traceability read

The dashboard is in a better place than it was before the Reddit pass, but the traceability standard is still only partly met.

Current strengths:

- every graded file has visible move triggers
- every graded file has a scope note
- most graded files now have a visible judgment line
- the scoring drawer exposes the threshold ladder

Remaining traceability gaps:

1. **Source-link completion is still uneven.** The model can now carry per-trigger URLs, but not every trigger that could be linked has been threaded yet.
2. **Outlier files need stronger explanation.** Defence & Trade, Flagship Delivery, and Promise Delivery behave differently enough that they should be explicitly framed as exceptions.
3. **Internal evidence homes are still a special case.** Cohort-progress and derivative-tally triggers are traceable inside the card, but they still do not behave like simple public-document links.

## Recommended next moves

### Method first

Before another heavy UI pass, keep the consistency standard explicit:

1. Keep `Flagship Delivery` marked as a delivery-capacity meta-file, not a peer to the core home dimensions.
2. Treat `Defence & Trade` as the biggest **structural** mixed-construct exception and make the split-promotion tripwire explicit.
3. Keep `Promise Delivery` clearly framed as a tracker exception rather than a hidden graded file.
4. Keep Housing Supply on the standard 2-up / 2-down pattern and avoid drifting back into announcement-heavy trigger language.
5. Finish the easy trigger-level source URLs before treating the traceability pass as fully complete.

### Product next

Once the method exceptions are named clearly, the next UI work should optimize for traceability:

1. Make purpose and freshness impossible to miss.
2. Keep the one-line judgment surface on every graded card.
3. Move sources closer to the grade and rationale so `grade -> evidence -> source` takes as few clicks as possible.
4. Only do a heavier inline-source pass after the data model can tell the UI which source belongs to which trigger.

## Bottom line

The dashboard is no longer failing on raw threshold vagueness. The sharper issue now is structural:

- most files are reasonably consistent with one another
- three files behave like exceptions, but they do not all damage trust in the same way
- those exceptions need to be named and either justified or redesigned
- full traceability is no longer blocked by the trigger data model, but it is still limited by partial source-link completion and a few internal evidence homes

That is a much healthier problem than the earlier "everything feels subjective" critique. It means the next trust gain is more likely to come from **making exceptions explicit and improving traceability** than from another generic wording pass.
