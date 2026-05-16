# Bias-Resistance Review Prompt — 2026-05

Purpose: give Claude a focused review prompt before we turn the bias-resistance idea into dashboard changes. This is a planning / critique artifact only. It does not change grades, sources, thresholds, formulas, or methodology rules.

## Context

The strongest current user concern is not "make the dashboard look less partisan." It is deeper:

> How do we know the methodology itself is not encoding bias through source mix, dimension choice, trigger wording, framing, or update cadence?

The corrected framing is:

- Do not claim the dashboard is bias-free.
- Test whether the scoring system is bias-resistant, traceable, and party-symmetric.
- Separate real-bias testing from perceived-bias testing.
- Do not write a public methodology FAQ until the audits have produced findings.

Core test:

> A skeptical reader does not need to agree with a grade. They should be able to see how the grade was reached.

## What already exists

Do not treat these as blank-slate work:

- Rule chain exists in the data: `gradeBasis`, `scoring.thresholds`, `judgmentCall`, `judgmentDetail`, `gradeTriggers`.
- Source traceability exists in structured trigger sources, source chips, per-cycle source ledgers, and `docs/Source-Authority-Map.md`.
- Skeptic-path ingredients exist: sources, triggers, last reviewed dates, critics / defenders, and "what would move this grade" sections.
- QA rules already block press-release-only grade moves, announcement bias, same-family concentration, contradiction with prior logic, and political-pressure arguments.
- The recurring source ledger and generated monthly source ledger now create a row-level audit trail for what was and was not checked.

The suspected gap is not absence of evidence. The suspected gap is that evidence, rules, source diversity, and counterarguments are scattered across surfaces rather than tested and shown as one auditable chain.

## Proposed audit sequence

Please critique this sequence before anyone implements it.

### Step 1 — Source diversity audit

Create `docs/Source-Diversity-Audit-2026-05.md`.

For each of the 11 graded dimensions, classify cited sources by family:

- Government press / department / PMO announcement
- Government independent or administrative data: PBO, StatCan, CMHC, OAG, Ethics Commissioner, IRCC datasets, Bank of Canada, etc.
- Opposition or parliamentary critique
- Independent policy institute / think tank
- Journalism
- Academic / university research
- International or external benchmark: IMF, OECD, NATO, rating agencies, treaty bodies

Suggested flags:

- More than 60% of cited sources in one family.
- Grade-moving claim rests primarily on government press / department announcement.
- No independent challenge source where the construct requires one.
- Source family present in the source list but not actually attached to a live claim.

Questions for Claude:

- Is this taxonomy right for this dashboard?
- Should "government independent data" be split from "government department data"?
- Is the >60% concentration threshold too loose, too tight, or about right?
- Should the audit count all listed sources, or only sources attached to grade-moving claims?

### Step 2 — Trigger symmetry audit

In the same audit doc, compare every dimension's up-triggers and down-triggers.

Suggested flags:

- One side has numeric / sourceable thresholds while the other is vague.
- One side requires implementation evidence while the other moves on announcement or rhetoric.
- One side has a source URL or internal anchor while the other has only a label.
- Up and down triggers are not comparable in magnitude.

Questions for Claude:

- What is the cleanest operational definition of "symmetric enough"?
- Should trigger symmetry be assessed per trigger pair, or at the dimension level?
- Are any current dimensions structurally allowed to be asymmetric because of their construct?

### Step 3 — Critics / defenders and language symmetry audit

In the same audit doc, read each dimension's `perspectives.critics`, `perspectives.defenders`, `judgmentCall`, and `judgmentDetail`.

Suggested flags:

- Critics and defenders differ by more than 2x in length.
- One side uses specific named sources while the other uses generic phrasing.
- One side is written as fact and the other as advocacy.
- Government wins use active voice while losses use passive voice, or vice versa.
- Hedging adjectives appear mainly on one side.
- The copy anchors to government framing instead of source findings.

Questions for Claude:

- Are the 2x length rule and named-source rule enough, or too mechanical?
- What copy tells should be added to the audit?
- Should this be a manual review only, or should a script pre-compute obvious length / source-count asymmetries?

### Step 4 — Bias-resistance protocol

Only after Steps 1-3 produce findings, create `docs/Bias-Resistance-Protocol.md`.

The protocol should become a recurring cycle gate, not a manifesto. It should include:

- Principles with status: built / partial / new.
- A pre-cycle checklist.
- A post-cycle review template.
- A party-symmetry line for every grade move: "Would the same evidence produce the same grade under a different governing party? Yes / no / explain."
- A public-surface backlog: methodology FAQ, one-thread skeptic path UI, perceived-bias survey.

Questions for Claude:

- Should the protocol be created before the audit as a framing doc, or only after the first audit so it reflects real findings?
- What belongs in the protocol versus the monthly source ledger?
- Should party-symmetry live in the cycle ledger, the changelog, or a separate bias-resistance review?

### Step 5 — Public methodology FAQ

Do not write this first. Build it from audit findings.

Expected FAQ targets:

- Why can one dimension be A-range while another is D-range?
- Why do announcements not count as delivery?
- What would change a grade?
- Why is Approval Signal not part of the grade?
- What does the dashboard refuse to score?
- How do source diversity and independent challenge sources affect confidence?

Questions for Claude:

- What are the first five bias accusations the FAQ should answer?
- Which answers should link to existing data fields rather than adding new prose?
- How do we avoid defensive language that makes the project sound less credible?

## Coding / research work worth running before implementation

Please critique and prioritize these. The point is to make the fix technically grounded, not vibes.

1. **Source-family classifier script**
   - Parse `src/data/dimensions.json`.
   - Extract `sources[]`, `gradeTriggers.*[].sourceUrl`, `projectCohort.projects[].sourceUrl`, and source-bearing metrics if present.
   - Map domains to source families.
   - Output per-dimension source counts and concentration flags.

2. **Trigger-symmetry linter**
   - Parse up/down triggers.
   - Flag missing URLs / internal refs, missing numeric thresholds, vague verbs, and unmatched trigger counts.
   - Human review still decides whether the asymmetry is justified.

3. **Critics / defenders pre-check**
   - Count words, source-name mentions, and URLs in both fields.
   - Flag >2x length imbalance or one-sided source specificity.
   - Manual reviewer then reads for strongest-case fairness.

4. **Judgment-language audit helper**
   - Scan `judgmentCall` and `judgmentDetail` for loaded adjectives, "critics say" / "defenders argue" imbalance, and government-framing tells.
   - This should be a review aid, not an auto-rewriter.

5. **Skeptic-path UI inventory**
   - For each dimension, identify where a reader currently finds: rule, current evidence, judgment, trigger, source, critics, defenders, and last reviewed date.
   - Record missing or scattered pieces before building a new UI.

6. **Traceability click test**
   - Use Playwright or browser inspection to test whether a reader can go from grade -> rule -> evidence -> source in a small number of clicks on desktop and mobile.
   - Record failures by dimension.

7. **Update-cadence asymmetry check**
   - Compare which dimensions get refreshed most often, and whether positive / negative evidence is incorporated at similar speed.
   - This tests a subtle form of bias: attention bias.

8. **Perceived-bias testing mechanism**
   - Draft a tiny survey or feedback form only after the audit fixes land.
   - Do not treat AI reviews as a substitute for real readers.

## External best-practice references worth checking

Use these as research anchors, not as authority theater:

- NIST AI RMF 1.0 for trustworthy-system risk framing and bias governance: https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10
- W3C Data on the Web Best Practices for provenance, data quality, versioning, coverage, and feedback practices: https://www.w3.org/TR/dwbp/
- GOV.UK Service Manual user research guidance for testing what works across different users, not what is merely popular: https://www.gov.uk/service-manual/user-research/how-user-research-improves-service-design
- The Turing Way reproducible research guide for rerunnable data / code / result chains: https://book.the-turing-way.org/reproducible-research/reproducible-research/

Questions for Claude:

- Are these the right research anchors?
- What coding-specific research should be added before implementation?
- Are there civic-data, data-journalism, or public-scorecard standards we should include?

## Hard constraints for the review

- Do not propose grade changes.
- Do not propose threshold changes.
- Do not propose source-array changes yet.
- Do not propose changing GPA weights, `POCKETBOOK_DIMS`, modifier rules, or the 11 graded + 1 tracker model.
- Do not recommend public claims like "bias-free" or "neutral."
- Treat "bias-resistant" and "auditable" as the target.

## Desired output from Claude

Return a structured critique:

1. What in this plan is right.
2. What is missing.
3. What is overbuilt.
4. What should be audited by script versus by human reading.
5. The exact first artifact to build.
6. Whether the source-family taxonomy and flag thresholds are acceptable.
7. A recommended order of operations that avoids writing a public FAQ before we know what the audits show.
