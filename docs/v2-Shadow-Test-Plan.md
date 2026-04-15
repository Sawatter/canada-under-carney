# v2 Shadow Test Plan

**Purpose:** One-cycle shadow validation of two approved v2 changes before promoting to live.

**Duration:** May 2026 monthly cycle (one cycle)
**Decision date:** After May cycle results are reviewed

---

## Shadow Test 1: Promise Delivery Removed from GPA

### What changes in the data model

- `dimensions.json`: Add `"excludeFromGPA": true` field to the Promise Delivery dimension
- `history.json`: May snapshot records both 12-dimension GPA (current) and 11-dimension GPA (shadow) side by side
- No dimension is deleted. No data is removed. The Promise Tracker tab is untouched.

### What changes in the UI

- **Nothing visible to the public.** The live dashboard continues showing 12 graded dimensions.
- Internally, the May release log records both GPAs:
  - "12-dimension Full Policy Audit GPA: [X]"
  - "11-dimension shadow GPA (Promise Delivery excluded): [Y]"
  - "Household Impact GPA: unchanged (Promise Delivery was never double-weighted)"

### What changes in the scoring logic

- `utils.js`: Add a `calculateShadowGPA()` function that filters out dimensions where `excludeFromGPA === true`
- The shadow GPA is computed but not displayed on the dashboard
- The Household Impact GPA is unaffected (Promise Delivery was never in the pocketbook-weighted set)

### What changes in the monthly workflow

- After computing the standard 12-dimension GPA, also compute the 11-dimension shadow GPA
- Record both in the release log
- Note any divergence
- Do NOT change any publicly visible grade or GPA

### Evidence that would justify promoting to live

All of these must be true:

1. **GPA divergence is small.** The 11-dimension GPA differs from the 12-dimension GPA by less than 0.15 points. (Expected: Promise Delivery at C+ = 2.3, close to the current 1.70 average, so removing it should lower the GPA slightly — maybe 0.05-0.10 points.)

2. **No information is lost.** The Promise Tracker tab still displays all 44 commitments with statuses, evidence, and durability tags. A reader visiting the dashboard gets the same accountability picture.

3. **No double-counting occurred.** During the May update, no grade movement in a home dimension (Housing, Climate, etc.) was also independently counted in Promise Delivery. If the deconfliction held, the derivative dimension added no unique information.

4. **The release was cleaner.** The monthly workflow was simpler without needing to separately grade Promise Delivery and cross-check it against every home dimension.

### What blocks promotion

- If removing Promise Delivery causes the headline grade to change by a full letter (extremely unlikely but must be checked)
- If a reader or reviewer identifies a specific accountability gap that only the graded dimension captured
- If the Promise Tracker tab proves insufficient as a replacement for the graded dimension (e.g., readers expect a grade chip next to promises)

---

## Shadow Test 2: Defence & Trade Sub-Scores

### What changes in the data model

- `dimensions.json`: Add a `subScores` field to the Defence & Trade dimension:

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

### What changes in the UI

- **Visible change:** The expanded Defence & Trade card shows a new "Sub-Scores" section between the rationale and the metrics:
  - "Defence: A — NATO 2% met, procurement advancing"
  - "Trade Diversification: B+ — US share down, partially market-driven"
- The headline grade chip (A-) remains unchanged
- The "Why This Grade" rationale is updated to reference the sub-scores

### What changes in the scoring logic

- The headline grade is still the GPA entry for Defence & Trade
- Sub-scores are informational — they explain the headline but do not independently contribute to the GPA
- The combination rule: headline = average of sub-score GPAs, rounded to nearest standard grade
- If sub-scores diverge by more than 1.0 GPA points, flag for full split review

### What changes in the monthly workflow

- Each update assesses both sub-scores independently
- The release log records: "Defence sub-score: [X]. Trade sub-score: [Y]. Headline: [Z]. Divergence: [delta]."
- If divergence exceeds 1.0 for two consecutive cycles, the full split is automatically queued

### Evidence that would justify promoting to live

All of these must be true:

1. **Sub-scores are independently gradeable.** The analyst can assign a defence grade and a trade grade without ambiguity using the existing rubric and indicator set.

2. **The combination rule produces a sensible headline.** The averaged sub-score matches or is within one notch of what an analyst would assign to the combined dimension without sub-scoring.

3. **Readers find it useful.** The sub-scores add clarity without confusion. A reader who sees "A- (Defence: A, Trade: B+)" understands more than one who sees "A-" alone.

4. **The divergence monitor works.** If trade data changes in the May cycle, the trade sub-score moves independently and the divergence is logged. The system can detect when the two constructs are pulling apart.

### What blocks promotion

- If the sub-scores create confusion (readers don't understand why A and B+ average to A-)
- If the combination rule produces results that feel arbitrary (e.g., Defence A + Trade C = B-, which satisfies no one)
- If the monthly workflow burden of grading two sub-scores is disproportionate to the clarity gained

---

## Shadow Test Timeline

| Date | Action |
|---|---|
| May 1 | Run fetch script, pull new data |
| May 1-7 | Apply evidence to all dimensions using v1.1 rubric and QA rules |
| May 7 | Compute 12-dimension GPA (live) AND 11-dimension GPA (shadow) |
| May 7 | Assign Defence & Trade sub-scores (shadow) alongside headline |
| May 7 | Run QA 3-lane process on any proposed grade changes |
| May 8 | Record both shadow results in release log |
| May 14 | Publish May update (live model only, no structural changes) |
| May 15 | Review shadow results. Decision: promote, defer, or abandon each shadow test |

---

## Decision Criteria Summary

| Shadow Test | Promote if | Defer if | Abandon if |
|---|---|---|---|
| Promise Delivery removal | GPA divergence <0.15, no info lost, workflow cleaner | Divergence 0.15-0.30 or ambiguous | Divergence >0.30 or clear accountability gap |
| Defence & Trade sub-scores | Sub-scores gradeable, combination sensible, readers find useful | Sub-scores hard to assign or combination feels arbitrary | Creates more confusion than clarity |

---

*v2 Shadow Test Plan v1.0 — April 2026*
*Execute during May 2026 cycle. Decision after results reviewed.*
