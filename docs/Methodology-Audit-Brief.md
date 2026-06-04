# Methodology Audit Brief (reusable)

**Purpose:** a repeatable audit of the dashboard's methods and safeguards against
recognized best practices. Run the research half in an external research AI
(Comet / Perplexity), then do the internal gap-mapping in Claude against the
actual docs. Suggested cadence: quarterly, or after any major methodology change.

**Division of labour:** the external AI researches the field's gold standard per
area (web research is its strength). Claude then maps each finding against our
real files (Scoring-Rubric-v1.1.md, Bias-Resistance-Protocol.md,
Source-Authority-Map.md, approval-polls.json, dimensions.json) and prepares an
editor packet. The editor decides what changes. No frozen-surface or grade
changes flow from the audit automatically.

---

## Research prompt (paste into Comet / Perplexity)

```
ROLE: You are a methodology auditor. Research how this public-scorecard project's
methods compare to recognized best practices in each area below, and produce a
gap report. Research only — do not propose specific grade or threshold values;
the editor decides those. Cite a source for every best-practice claim.

CONTEXT: "Canada Under Carney" is a public, non-partisan dashboard that grades a
federal government across 11 policy areas (A–F letter grades) plus a promise
tracker, with a fully published methodology. It is not a poll, forecast, or
voting guide. For each area I give a one-line sketch of OUR approach; your job is
to find the field's gold standard, say where we likely fall short / meet / exceed
it, and recommend concrete improvements.

AREAS TO AUDIT (research best practice for each, then compare):

1. GRADE RUBRIC. Ours: A–F bands with a published per-dimension "gradeBasis"
   (band criterion + plus/minus rationale). Benchmark: academic rubric design
   (validity, reliability, inter-rater consistency) and think-tank scorecard
   methodologies. Q: is our band/criterion structure defensible and reliable?

2. GRADE TRIGGERS / FALSIFIABILITY. Ours: each dimension publishes explicit
   up/down "triggers" (pre-committed conditions that would move the grade), each
   with one-click evidence. Benchmark: pre-registration, KPI/indicator design,
   falsifiability. Q: is publishing pre-committed move conditions a recognized
   best practice, and are we doing it well?

3. BIAS RESISTANCE. Ours: a "party-symmetry" rule (same evidence must yield the
   same grade under any party) + a source-family balance audit script.
   Benchmark: AllSides / media-bias frameworks, academic bias-mitigation. Q: how
   does party-symmetry + family balancing compare to recognized methods?

4. SOURCE-AUTHORITY TIERING. Ours: a T1–T5 tier map (T1 official … T5
   commentary). Benchmark: IFCN, library source-evaluation (CRAAP), Wikipedia
   reliable-source tiers. Q: is our tiering aligned with established
   source-credibility frameworks?

5. SOURCE VERIFICATION. Ours: a "fetch ladder" (direct fetch → search
   quote-extraction → archive → site-scour → replacement → editor list) with a
   rule that a search snippet confirms a number but never a verbatim sentence.
   Benchmark: IFCN verification standards, the Verification Handbook. Q: does our
   process match professional fact-checking verification?

6. POLLING AGGREGATION (likely our weakest area — scrutinize hardest). Ours: a
   sample-size-weighted mean across polls in a rolling 60-day window, with a
   stated inclusion rule, and NO house-effect adjustment or pollster-quality
   weighting yet. Benchmark: 338Canada, FiveThirtyEight, and academic poll
   aggregation — house-effect de-housing, pollster-quality weighting, recency
   decay, trend estimation, uncertainty intervals. Q: what specifically are we
   missing vs a modern aggregator, and what's the minimum upgrade that would
   materially improve it?

7. MODIFIERS. Ours: named adjustments (External Constraint, Timing Fairness,
   Jurisdictional Limits, a credit-claiming penalty) applied to grades.
   Benchmark: principled adjustment/normalization frameworks in evaluation. Q:
   are discretionary modifiers a defensible practice, and how are they kept
   consistent?

8. COMPOSITE CONSTRUCTS. Ours: one dimension ("Defence & Trade") combines two
   distinct outcomes under a single grade, with a documented "tripwire" to split
   it if the halves diverge for two cycles. Benchmark: composite-index design
   (when to combine vs separate indicators). Q: is combining defensible, and is
   the split rule sound?

9. CHANGE CONTROL. Ours: "frozen surfaces" (grade math, thresholds, weights)
   that can't change without explicit approval, plus versioned changelog
   discipline. Benchmark: research reproducibility, methodology pre-registration,
   version control. Q: is our change-control adequate for a credibility-claiming
   public scorecard?

OUTPUT (per area):
- Best-practice standard (2–4 sentences, with a cited source/link).
- How our approach compares: GAP / MEETS / EXCEEDS.
- One concrete, actionable recommendation (a method to adopt, not a grade value).
Then a one-paragraph synthesis: the 3 highest-impact gaps, ranked.

BOUNDARIES: Research and recommend methods only. Do not prescribe specific grades,
thresholds, or weights. Flag where we already meet or exceed standard, not just
gaps — be balanced. Everything is draft for the editor; nothing is published.
```

---

## Internal gap-mapping (Claude, after the research returns)

For each area, map the external standard to our actual doc and classify
GAP / MEETS / EXCEEDS with the file + line evidence, then prepare an editor
packet. Treat every external recommendation as a claim to check against our
files, not an order. No frozen-surface or grade change without explicit editor
approval. Expected highest-impact gap on first run: polling aggregation (#6) —
we use a plain sample-weighted mean with no house-effect / pollster-quality
weighting.
