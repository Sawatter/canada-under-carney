# Parking Lot

**Purpose:** Capture ideas that matter but are not blocking the current task.

**Rule:** If an idea is useful but not a "now" task, put it here instead of carrying it in working memory.

**Last updated:** 2026-04-17

---

## Audit Ideas

- Source sufficiency audit by dimension
  Check whether each dimension has enough independent, grade-moving evidence to justify its score, confidence, and precision.

- Per-dimension source authority map
  For each dimension, define the authoritative source roles behind the score:
  - measurement truth
  - policy truth
  - execution truth
  - independent challenge truth
  - context truth
  This should answer not just "how many sources do we have?" but "what kinds of
  verified truth are we claiming, and which sources are allowed to carry each
  kind of claim?"

- Skeptical data scientist reflection pass
  Pressure-test the dashboard as if a critical data scientist reviewed the model, especially:
  - mixed constructs
  - equal-weight averaging
  - plus/minus precision
  - ordinal-to-GPA assumptions
  - confidence calibration

- Reader trust audit
  Ask where a skeptical reader would still feel the dashboard is hand-wavy, overconfident, or internally inconsistent.

---

## Prompt Ideas

- Default reflection prompt for every new Claude task
- Default reflection prompt for every new Codex task
- Reusable source sufficiency audit prompt
- Reusable "source authority by dimension" reflection prompt
- Reusable "skeptical data scientist" reflection prompt
- Reusable live UI smoke-check prompt

---

## Product / UX Ideas

- CompareView overhaul using inspectability fields
- Methodology tab cleanup and simplification
- Small confidence explanation on-card or in methodology
- Possible tag for construct type (`Process`, `Implementation`, `Response`, etc.)
- Better explanation of whole-letter probation dimensions

---

## Methodology Questions

- For each dimension, what are the authoritative sources for the different kinds of truth we are claiming?
  A future source-authority pass should separate:
  - measurement truth: official/admin/statistical source for the core metric
  - policy truth: what the government actually announced, funded, legislated, or implemented
  - execution truth: whether the thing is operational, disbursed, enforced, or still on paper
  - independent challenge truth: watchdogs, auditors, experts, or institutional critics testing the claim
  - context truth: journalism or policy analysis that informs interpretation but should not move the grade by itself

- Should probationary dimensions always collapse plus/minus to the main letter in a single explicit rule?
- Should the `band` field always represent the whole letter, with the display grade carrying the plus/minus, or is mixed modeling acceptable?
- When is a source stack too thin to justify a full letter move?
- How should confidence labels be operationalized beyond `High` / `Medium`?

---

## Future v2 / Structural Questions

- Flagship Delivery probation outcome after one real cycle
- Promise Delivery long-term role in the product
- Defence & Trade full split trigger
- Carbon Pricing / Climate merge question
- Whether a time-series view should appear after enough monthly cycles accumulate
