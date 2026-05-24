---
name: grade-evaluation
description: |
  Use this skill when asked whether a grade should move, whether a trigger
  fired, or how current evidence maps to gradeBasis, thresholds, modifiers,
  and party-symmetry rules on the Canada Under Carney dashboard.
when_to_use: |
  Any request to assess a grade, evaluate a trigger, review scoring thresholds,
  compare evidence to band criteria, or prepare an editor approval packet for
  a grade change. Does not autonomously change grades.
allowed-tools: Read Grep Glob Bash
---

# Grade Evaluation

## What this skill does
Evaluates whether current evidence supports keeping or changing a dimension
grade. It prepares a recommendation packet. Grade changes still require
explicit editor approval.

## Rules before starting
1. Read the dimension's `gradeBasis`, `scoring.thresholds`, `gradeTriggers`,
   `metrics`, `judgmentCall`, and `judgmentDetail` in src/data/dimensions.json.
2. Read docs/Scoring-Rubric-v1.1.md for band criteria and modifier rules.
3. Read references/Source-Evaluation-Standard.md if any new evidence source
   is involved.

## Evaluation procedure

### Step 1 — Evidence boundary
State what evidence is being evaluated and whether it is:
- trigger evidence
- metric evidence
- modifier evidence
- context only

### Step 2 — Trigger check
For each relevant trigger, report:
- trigger text
- source checked
- fired / not fired / ambiguous
- one-line rationale

### Step 3 — Threshold check
Compare the evidence to the dimension's published scoring thresholds. Do not
invent new thresholds. If the evidence does not map cleanly, say so.

### Step 4 — Modifier check
Check whether External Constraint, Timing Fairness, Jurisdictional Limits,
or credit-claiming penalties apply. Modifiers explain what counts and what
does not count. They should not soften a grade just because context feels hard.

### Step 5 — Party-symmetry check
Ask: would the same evidence produce the same grade under a different governing
party? If no, identify which rule is asymmetric before recommending a grade.

### Step 6 — Recommendation packet
Return:
- current grade
- recommended grade
- trigger / threshold basis
- sources used
- modifier treatment
- party-symmetry note
- whether editor approval is required

## Hard line
Do not change a grade autonomously. Prepare the packet, then ask for explicit
approval if a grade movement is recommended.

## Reference file
- references/Source-Evaluation-Standard.md
