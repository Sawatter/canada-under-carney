# Inter-Rater Reliability Protocol

- **Purpose:** Turn the dashboard's disclosure that "external inter-rater reliability has not been tested" into something testable. Define the process for a second reader (the rater) to independently apply the published rubric to a subset of dimensions, and the criteria for comparing their grades against the editor's.
- **Status:** Active protocol. First v1 packet prepared; AI packet QA run 2026-06 ([Inter-Rater-Pilot-AI-QA-2026-06.md](Inter-Rater-Pilot-AI-QA-2026-06.md)) surfaced packet fixes; first human run pending those fixes and a willing second reader.
- **Last updated:** 2026-05-13
- **Editor dependencies, not rater materials:** [Scoring-Rubric-v1.1.md](Scoring-Rubric-v1.1.md), [Canonical-Scoring-Sheets.md](Canonical-Scoring-Sheets.md), [QA-Gatekeeping-Rules.md](QA-Gatekeeping-Rules.md), [Plus-Minus-Decision-Rules.md](Plus-Minus-Decision-Rules.md)
- **Used by:** Product Thesis claims about editorial vs. statistical rigor. Methodology tab "Limits of this model" block.

---

## Why this exists

The dashboard grades 11 policy dimensions on a published rubric. The rubric defines bands and modifiers precisely enough that two careful readers starting from the same evidence and the same sheet should land on the same (or near-same) grade — that is the whole point of a rule-governed scorecard as distinct from an editorial opinion column.

Until a second reader actually tries it, that claim is disclosed-but-untested. The Methodology tab discloses this limitation. This protocol operationalizes the test.

---

## AI packet QA vs. human pilot

It is acceptable to run one Claude / AI pass before sending the packet to a human, but only as **packet QA**. The AI reviewer may look for leakage, missing evidence, confusing worksheet instructions, or wording that nudges the rater toward the editor's likely answer.

The AI pass must not be treated as the inter-rater pilot. It does not count as an outside rater, does not establish inter-rater reliability, and should not be reported as a completed reliability test. The first real pilot result should come from a human reader who independently applies the rubric.

Guardrails for the AI QA pass:

- Give the AI only the redacted packet, results template, and this protocol.
- Do not give it the live dashboard, current grades, changelog, Git history, or editor rationale.
- Ask it to review leakage/completeness only; do not ask it to assign grades.
- Use its feedback to fix the packet before sending it to the human rater.

Recommended sequence:

1. Run optional AI packet QA.
2. Fix any leakage or packet-completeness issues.
3. Send the corrected packet to a human rater.
4. Compare the human worksheet against the published dashboard snapshot.

---

## Scope of a v1 run

- **3 dimensions.** Enough to detect systematic disagreement; small enough that a volunteer reader can complete it in a single 2–3 hour session.
- **Suggested sample:** one dimension from each tier of rubric complexity:
  - **One "clean" dimension** where evidence is mostly direct and the modifier decision should be easy to explain. Tests rubric-reading, not evidence-judgment.
  - **One "modifier-sensitive" dimension** where a grade adjustment may plausibly matter. Tests whether the modifier rule is being applied consistently.
  - **One "probation" dimension** (Ethics & Transparency or Flagship Delivery) where whole-letter-only grading applies. Tests the probation discipline.

Do not start with Climate & Environment or Housing Supply — these are the highest-scope, highest-stakes dims and are not the right place to stress-test rater agreement on a first run.

---

## Pre-run setup

The editor prepares a **self-contained shadow-grading packet** for the rater containing, for each dimension in scope:

1. The relevant evidence from `src/data/dimensions.json` — metrics, sources, scope, and gradeTriggers — **but with the current grade, gradeBasis, rationale, judgment fields, active modifier selections, perspectives, and changelog context redacted.**
2. The relevant grade-band thresholds extracted from the canonical scoring sheets.
3. The modifier rules needed for the pilot, without "currently applies to" lines or current editor selections.
4. The plus/minus decision rules, without current-grade examples.
5. The relevant deconfliction rules.
6. Source-role guidance needed to judge source quality.

Do not give the rater the full canonical governance docs during the blind run. Several editor-facing docs necessarily contain current grades, active modifier choices, or release-history context. Those docs can be used to build the redacted packet, but they are not rater materials until after the worksheet is submitted.

The packet must NOT contain:
- The current published grade for the dimension.
- The rationale field, judgment fields, active modifier selections, or perspectives field — these contain editor-side interpretive framing that would bias the rater.
- The QA-Gatekeeping-Rules carry-forward notes — these describe past editorial decisions.

The rater should arrive at a grade using only the self-contained packet and the external source links inside it. Their grade is their independent application of the published rule set.

---

## The grading task the rater performs

For each dimension in the packet, the rater fills out a **shadow-grading worksheet** with the following fields:

| Field | What the rater writes |
|---|---|
| Construct (restated) | Their one-sentence restatement of what they think is being graded. If this drifts from the scoring-sheet construct, the first source of rater disagreement is on what's being measured. |
| Band pick | The A–F letter band they place the dimension in, before plus/minus. Must cite the specific band criterion from the rubric that drove the pick. |
| Plus/minus | Plus, flat, minus, or whole-letter-only, with rationale citing the rule included in the packet. If the dim is on whole-letter probation, this field is marked whole-letter-only. |
| Active modifiers | Which modifier rules (Timing fairness, Jurisdictional limits, External constraint, Credit-claiming penalty) they believe apply, with citation. Each active modifier must name the rubric clause that triggered it. |
| Net grade | The final letter after modifiers. |
| Confidence | Low / Medium / High — the rater's own read on whether the grade is stable or borderline. |
| Notes | Anything about the evidence stack, scope, or rubric interpretation that gave the rater trouble. |

---

## Comparison and reporting

After the rater submits their worksheets, the editor compares each rater grade against the published dashboard grade on the same snapshot:

| Comparison field | How it's scored |
|---|---|
| Exact grade match (letter + plus/minus) | 1 point. Perfect agreement. |
| Within one plus/minus step (e.g., B+ vs B) | 0.5 point. Soft agreement. |
| Within one letter band (e.g., B vs B− vs C+) | 0 points; flagged as a real disagreement. Note which rubric clause the rater and editor read differently. |
| Different letter bands (e.g., B vs D) | −1 point. Hard disagreement. Indicates either a rubric ambiguity or a fact-finding disagreement. |
| Same grade but different active-modifier set | 0 point (no grade impact) but flagged for protocol review. The rubric is not being read the same way even if answers coincidentally match. |

### Thresholds for v1

- **Acceptable (no rubric revision triggered):** Aggregate agreement score on the 3-dim pilot is ≥ 1.5 out of 3 (i.e., on average the rater and editor are within one plus/minus step).
- **Rubric revision triggered:** Any hard disagreement (different letter band), OR aggregate score < 1.
- **Protocol revision triggered:** Any case where the rater says their confidence was Low AND they asked for evidence or a clause the packet didn't include. Indicates the shadow-grading packet is incomplete.

---

## What this does not prove

- **It is not Cohen's kappa.** A 3-dimension, single-rater, single-editor run is a sanity check, not a statistically valid inter-rater reliability coefficient. A real psychometric IRR test needs ≥ 2 raters, ≥ 30 items, and documented agreement measures. This protocol is the minimum viable first step; a v2 with a second rater added would bring it closer to a publishable measurement.
- **It does not validate the rubric's content.** It validates whether two readers can apply the rubric consistently. The rubric could still be wrong about what counts as "adequate housing response" even if two readers agreed the grade was D.
- **It does not verify the evidence.** The Source Verification Protocol is a separate pass; this protocol assumes the cited evidence is factually correct.

---

## After a run

The editor publishes, in order of priority:

1. **Results summary** — the aggregate agreement score, each per-dimension comparison, and any hard disagreements flagged.
2. **Any rubric clauses that produced different reads** — these become candidate rubric amendments.
3. **Any packet gaps** — updates to this protocol for v2.
4. **An updated entry in the Methodology tab's "Limits of this model" block** — replacing "External inter-rater reliability has not been tested" with a specific statement of what has been tested and what the agreement score was.

---

## Shadow-grading worksheet template

Copy this for each dimension in the packet. The pilot packet carries the same worksheet shape so rater responses map cleanly into the results template.

```
Dimension:
Rater:
Date:

1. Construct restated in your own words:


2. Band pick before plus/minus:
   Band:
   Threshold clause used:


3. Plus / flat / minus / whole-letter-only:
   Choice:
   Rule or clause used:


4. Active modifiers:
   Timing fairness:
   Jurisdictional limits:
   External constraint:
   Credit-claiming penalty:


5. Final grade:


6. Confidence:
   Low / Medium / High


7. Notes on evidence, source quality, scope, or rubric ambiguity:


```

---

## Related future work

- Second rater added (moves from N=1 to N=2 rater cohort) — enables Cohen's kappa.
- Full-dashboard run across all 11 dimensions once v1 sanity check clears.
- Public posting of the anonymized worksheets so readers can see the rubric in action.

## Current v1 packet

- [Inter-Rater-Pilot-Packet-2026-05.md](Inter-Rater-Pilot-Packet-2026-05.md)
- [Inter-Rater-Pilot-Results-Template-2026-05.md](Inter-Rater-Pilot-Results-Template-2026-05.md)
- [Inter-Rater-Pilot-Reviewer-Invite-2026-05.md](Inter-Rater-Pilot-Reviewer-Invite-2026-05.md)
