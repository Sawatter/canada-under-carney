# v2 Shadow Test Plan

**Purpose:** One-cycle shadow validation of two approved v2 changes before promoting to live.

**Status:** Superseded for Promise Delivery — the removal from the scores has already been promoted to the live dashboard. Keep this file as historical validation context unless the broader v2 shadow workflow reopens it.

**Duration:** May 2026 monthly cycle (one cycle)
**Decision date:** After May cycle results are reviewed

---

## Shadow Test 1: Promise Delivery Removed from GPA - Implemented

### Outcome

The shadow test was promoted before the May 2026 cycle. Promise Delivery now carries `excludeFromGPA: true`, no live `grade` field, and an `informationalGrade` retained only for historical/accountability context. The Full Policy Audit and Household Impact calculations filter it out through the shared `gradedOnly()` path in `src/utils.js`.

### What changed in the live product

- Promise Delivery is displayed as `Tracker · No letter grade`.
- The header still shows delivered / total commitment count.
- The Promises tab still displays all 43 commitments with status, evidence, and durability fields.
- The aggregate scores now use 11 graded dimensions, not 12.

### Why promotion was accepted

- The tracker was derivative of the 11 home dimensions and created double-counting risk when treated as a peer score.
- No accountability information was lost because the Promise Tracker remains visible and evidence-backed.
- Removing the grade made the score model cleaner and the public framing easier to explain.

### Remaining maintenance

- Keep promise statuses and evidence links current during monthly cycles.
- Keep Promise Delivery out of aggregate-score math.
- Do not reintroduce A-F grade language on the tracker unless a new methodology decision explicitly reverses the current memo.

---

## Shadow Test 2: Defence & Trade Sub-Scores - Implemented

### Outcome

The sub-score test was promoted before the May 2026 cycle. Defence & Trade remains one combined live file, but the expanded card now exposes separate defence and trade sub-scores, and the dimension data carries a split-promotion tripwire.

### What changes in the data model

- `dimensions.json` carries a `subScores` field on the Defence & Trade dimension:

```json
"subScores": {
  "defence": {
    "grade": "A",
    "rationale": "NATO 2% met and confirmed. $81.8B committed. Shipbuilding contract signed. Procurement advancing.",
    "indicators": ["NATO spending 2.0% GDP", "Procurement milestones on track"]
  },
  "trade": {
    "grade": "B+",
    "rationale": "US export share down to 71.7%. Non-US exports +17.2%. CETA at $134B. Partially market-driven.",
    "indicators": ["US export share 71.7%", "Non-US exports +17.2%", "CETA $134B"]
  }
}
```

- The headline grade (A-) remains computed as the rounded average of the two sub-scores: (4.0 + 3.3) / 2 = 3.65, which rounds to A-

### What changed in the UI

- The expanded Defence & Trade card shows a "Sub-Scores" section:
  - "Defence: A — NATO 2% met, procurement advancing"
  - "Trade Diversification: B+ — US share down, partially market-driven"
- The headline grade chip (A-) remains unchanged
- The "Why This Grade" rationale references the sub-scores

### Current scoring logic

- The headline grade is still the GPA entry for Defence & Trade
- Sub-scores explain the headline but do not independently contribute to aggregate-score math
- The combination rule: headline = average of sub-score GPAs, rounded to nearest standard grade
- If the defence and trade sub-scores move in opposite directions, or diverge by more than 1.0 GPA points (about one full letter grade), for two consecutive monthly review cycles, promote the split shadow into live separate files

### Current monthly workflow

- Each update assesses both sub-scores independently
- The release log records: "Defence sub-score: [X]. Trade sub-score: [Y]. Headline: [Z]. Divergence: [delta]."
- If the live split tripwire fires for two consecutive monthly review cycles, the full split is automatically queued

### Why promotion was accepted

- Sub-scores are independently gradeable with the existing evidence.
- The combined headline remains useful while sub-scores prevent defence from hiding trade movement.
- The split tripwire defines when the combined file breaks.

---

## Shadow Test Timeline

| Date | Action |
|---|---|
| May 1 | Run fetch script, pull new data |
| May 1-7 | Apply evidence to all dimensions using v1.1 rubric and QA rules |
| May 7 | Compute the 11-dimension Full Policy Audit score |
| May 7 | Reassess Defence & Trade sub-scores alongside headline |
| May 7 | Run QA 3-lane process on any proposed grade changes |
| May 8 | Record any live split-tripwire or tracker-boundary observations in release log |
| May 14 | Publish May update |
| May 15 | Review whether any structural item needs reopening |

---

## Decision Criteria Summary

| Structural item | Current rule | Reopen if |
|---|---|---|
| Promise Delivery removal | Implemented as ungraded tracker outside score | A new methodology decision reverses the tracker-only memo |
| Defence & Trade sub-scores | Implemented inside combined file | Split tripwire fires for two consecutive monthly cycles |

---

*v2 Shadow Test Plan v1.0 — April 2026*
*Historical shadow plan. Promise Delivery removal and Defence & Trade sub-scores have been promoted; keep this file as validation context.*
