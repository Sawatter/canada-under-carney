# Comet Review Adjudication — 2026-06-30

## Purpose

Freeze the June 30, 2026 external review and the follow-up adjudication in one repo doc so the project does not have to rely on chat history or memory.

This is not a decision memo saying all changes should happen. It is a working record of:

- what the Comet review claimed
- which claims look right, partly right, or wrong after checking the repo
- what work is worth doing later
- what should stay parked unless stronger evidence appears

## Source

Reviewed on June 30, 2026:

- attached external review: `Canada Under Carney: Deep Product, Methods & Architecture Review`
- repo state as of the June 30, 2026 session

## High-level read

The review is useful. It does not overturn the repo's direction. It mostly reinforces the current stance:

- keep v1 as the live public scorecard
- keep full v2 parked
- tighten a few ambiguous or trust-sensitive surfaces
- do not expand the system just because the docs make expansion possible

The strongest findings are about:

1. composite-score caveats being under-exposed
2. Defence and Trade rule consistency
3. Flagship Delivery probation lacking a crisp exit rule
4. single-editor continuity risk
5. inspectability improvements that can land inside v1 without reviving full v2

## Claim-by-claim adjudication

### 1. The composite headline is still the dashboard's least defensible surface

**Verdict:** Mostly agree

**Why:**

- The repo itself already acknowledges weighting sensitivity in [V2-Scoring-Architecture-Brief.md](V2-Scoring-Architecture-Brief.md).
- The scoreboard cards in [ScoreboardHeader.jsx](../src/components/ScoreboardHeader.jsx) do not currently put that caveat directly beside the headline score.
- The derivation panel already exists and is unusually transparent. The issue is not that the composite is indefensible. The issue is that its limits are still under-exposed to first-time readers.

**Working implication:**

- worth improving disclosure
- not a reason to remove the composite scores

### 2. Defence and Trade is one dimension doing two jobs, and the headline hides that

**Verdict:** Agree

**Why:**

- This matches the repo's own logic in [v2-Decision-Memo-Defence-Trade.md](v2-Decision-Memo-Defence-Trade.md).
- The construct split is real: defence is closer to an execution milestone, trade diversification is a slower and more externally influenced outcome.
- The tripwire wording should be treated as a real consistency check item across live docs and data.

**Working implication:**

- reconcile the tripwire wording everywhere
- do not split the live dimension unless the live split guardrail actually fires

### 3. Flagship Delivery is structurally weak and its probation has no defined exit mechanism

**Verdict:** Agree

**Why:**

- Flagship is openly derivative and meta.
- The roadmap still carries a future decision on whether it stays on probation.
- Probation without a clear pass/fail rule is mushy.

**Working implication:**

- define a real probation exit rule
- do not treat "probation" as a permanent holding pattern

### 4. The governance stack has become self-referentially heavy

**Verdict:** Partly agree

**Why:**

- The repo plainly has a large governance stack.
- The pressure is real enough that [Current-Roadmap.md](Current-Roadmap.md) already warns against new governance/process docs without a concrete active problem.
- But document count alone does not prove waste. A lot of this governance is doing real work: source hierarchy, QA gatekeeping, deconfliction, trigger verification, frozen-surface protection.

**Working implication:**

- simplify the doorway into governance
- do not assume the right answer is broad document deletion

### 5. Score interpretability: the GPA decimal number adds false precision

**Verdict:** Partly agree, with one stale factual claim

**Why:**

- The conceptual concern is fair: decimal averages can imply more precision than the underlying model fully deserves.
- But the specific complaint that the live UI shows two-decimal values like `1.65` and `1.45` is stale.
- Current code in [Dashboard.jsx](../src/components/Dashboard.jsx) already renders the headline scores to one decimal via `.toFixed(1)`.

**Working implication:**

- keep the interpretability question alive
- do not act as if the two-decimal display problem still exists

### 6. The Promise Tracker is under-surfaced on the primary view

**Verdict:** Partly agree

**Why:**

- The top card in [ScoreboardHeader.jsx](../src/components/ScoreboardHeader.jsx) mainly shows delivered count plus abandoned/stalled counts.
- The fuller tracker experience is deeper in the app.
- But "under-surfaced" overstates it a bit because the tracker is already one of the four headline cards and is clickable.

**Working implication:**

- reasonable product improvement candidate
- not a defect

### 7. The inspectability gap between methodology docs and card content is still real

**Verdict:** Agree

**Why:**

- This matches the repo's own pilot/spec direction.
- A small "why not higher / why not lower" layer would improve reader trust without reviving full v2.

**Working implication:**

- strong candidate for bounded v1 product work

### 8. The single-editor dependency is an existential continuity risk

**Verdict:** Agree

**Why:**

- Red-team review is still not active.
- Inter-rater work is still in fieldwork.
- Continuity / bus-factor work is still incomplete.

**Working implication:**

- this is a real operational risk, not drama

## Weakest-decisions section adjudication

### 1. Flagship Delivery on open-ended probation

**Verdict:** Agree

Same reasoning as above. This is a fair hit.

### 2. Confidence / Attribution / Lag pills appear on every card without default explanation

**Verdict:** Partly agree

**Why:**

- The pills and their explanation live in [DimensionCard.jsx](../src/components/DimensionCard.jsx).
- This is a plausible reader-friction point.
- But the external reviewer did not have a rendered live browser session, so the severity is not fully proven.

### 3. Composite GPA displayed to two decimal places

**Verdict:** Disagree on the factual claim

**Why:**

- current live code shows one decimal, not two

### 4. Approval Signal is given equal visual weight with the scored composites

**Verdict:** Partly agree

**Why:**

- source-wise, yes, it sits in the same four-card row
- whether this genuinely misleads readers is a rendered-experience judgment that should be browser-verified before acting on it

### 5. V2 architecture is documented at implementation depth while explicitly parked

**Verdict:** Mostly agree

**Why:**

- There is enough parked v2 material now that it can create maintenance drag.
- The right response is probably "stop extending and lightly freeze it," not "delete all v2 thinking."

### 6. Single-editor operations with no active redundancy mechanism

**Verdict:** Agree

### 7. Critics / Defenders exists more as a governance balance mechanism than a reader tool

**Verdict:** Partly agree

**Why:**

- This is a credible critique.
- It may still do useful trust work.
- Treat as a framing/copy problem first, not automatic evidence that the section should be removed.

## What looks worth doing later

These are the strongest candidate actions coming out of the review.

### Do soon

1. Reconcile Defence and Trade split-tripwire wording across the live rule surfaces.
2. Define a real Flagship Delivery probation exit rule.
3. Add clearer composite-score caveat language near the headline scores.

### Worth testing

1. Pilot a "why not higher / why not lower" inspectability block on one dimension.
2. Make the Promise Tracker top card slightly more informative at a glance.
3. Re-check whether Approval Signal is visually overweight in the actual rendered browser UI.
4. Re-check whether Confidence / Attribution / Lag metadata is helping or just adding friction.

### Operational follow-up

1. Write the continuity / bus-factor doc.
2. Activate the red-team reviewer if possible.

## What should stay parked for now

1. Full v2 architecture revival
2. Broad architecture redesign driven only by this review
3. Big governance pruning without a more careful audit of what is actually dead weight

## Bottom line

The review is strongest when it points at:

- real rule ambiguity
- real trust-surface weakness
- real continuity risk
- a bounded inspectability improvement

It is weaker when it tries to conclude too much about:

- exact visual weight in the live UI
- the value of every governance document
- features that were inspected from source but not from a working browser session

The correct response is not "change course."

The correct response is:

- tighten the ambiguous parts
- make the headline caveats easier to see
- improve inspectability in a bounded way
- keep full v2 parked
- do not let the system grow just because it can
