# Launch Recommendation

**Decision:** The dashboard is conditionally ready for one public monthly cycle.

**Date:** April 2026

---

## Section 1: Must Do Before First Public Cycle

These are launch-critical. The dashboard should not be promoted publicly until all are complete.

### 1.1 Remove Promise Delivery from the live GPA

**What:** Promise Delivery (C+) becomes an ungraded standalone tracker. The Promise Tracker tab remains unchanged. The 14/44 count stays in the header. But Promise Delivery no longer contributes to the Full Policy Audit GPA.

**Why:** The corrected March rehearsal confirms removing it changes the headline from C- to D+. Keeping a derivative dimension that inflates the headline by re-counting evidence already scored elsewhere is a known methodological distortion. Publishing with it intact — now that we know the effect — would be indefensible if challenged.

**Headline consequence:** Full Policy Audit moves from C- (GPA 1.70, 12 dimensions) to C- (GPA 1.65, 11 dimensions). The letter grade holds under the published threshold rule (C- requires ≥ 1.65), but the GPA dropped 0.05 points and now sits exactly on the boundary. The Household Impact grade moves from D+ (GPA 1.51) to D+ (GPA 1.45).

**Communication:** The release must state: "The dashboard now uses 11 graded dimensions. Promise Delivery is tracked as a standalone accountability tool rather than a scored dimension, because its grade movements are derivative of other dimensions. The Full Policy Audit GPA of 1.65 sits on the C-/D+ boundary; this is disclosed for transparency."

### 1.2 Promote Defence & Trade sub-scores

**What:** The expanded Defence & Trade card displays two sub-scores: Defence (A) and Trade Diversification (B+). The headline grade (A-) remains the GPA entry.

**Why:** The March rehearsal confirmed sub-scores are independently gradeable and source-clean. Trade framing must use annual figures for structural claims, monthly labeled "volatile" per Measure Selection Rules.

**Implementation:** Add `subScores` display to the DimensionCard component for Defence & Trade.

### 1.3 Ethics & Transparency and Flagship Delivery: whole-letter grades only

**What:** These two dimensions use whole-letter grades (C, D, etc.) without plus/minus distinctions. All other dimensions retain plus/minus.

**Why:** Ethics has the weakest indicator stack (all qualitative, medium confidence). Flagship Delivery is on probation. Plus/minus distinctions on these dimensions imply precision the evidence cannot support.

**Current grades affected:**
- Ethics & Transparency: C- → C (whole letter, removes false precision)
- Flagship Delivery: C- → C (whole letter, removes false precision)

**Note:** This changes the GPA slightly. Both move from 1.7 to 2.0, which raises the Full Policy Audit GPA by approximately 0.05.

### 1.4 Plus/minus rules for remaining dimensions

**What:** For the 9 dimensions that retain plus/minus grades, publish explicit decision rules:

- **Plus (+):** The dimension meets the letter-grade threshold AND shows measurable momentum toward the next letter grade. At least one indicator is trending in the positive direction.
- **Minus (-):** The dimension meets the letter-grade threshold but with material caveats — accounting adjustments, partial delivery, execution gaps, or a single strong sub-file masking weakness elsewhere.
- **Straight letter:** The dimension meets the letter-grade threshold without significant upward momentum or downward caveats.

**Example:** Defence & Trade gets A- (not A) because the 2% was achieved partly through accounting reclassification and Canada placed in NATO's bottom third. That is a material caveat on an otherwise met target.

### 1.5 Basic sensitivity analysis

**What:** Run and document three checks:

1. **Jackknife:** Drop each dimension one at a time. Report which dimensions are "swing dimensions" (removal changes headline by >0.3 GPA).
2. **Weighting alternatives:** Compute GPA under equal weight, household weight, and attribution-adjusted weight. Report the range.
3. **Threshold sensitivity:** Shift all grade boundaries by ±0.15. Report how many dimensions change grade.

**Publication:** Keep results internal for first cycle. Publish summary before second cycle. If any check changes the headline grade, disclose immediately.

### 1.6 Ethics & Transparency on probation

**What:** Ethics joins Flagship Delivery on probation. It remains graded (whole letter, C) but must develop an anchored rubric with at least one semi-quantitative indicator before the second cycle.

**Probation condition:** If no anchored indicator is added by the second cycle, Ethics is flagged as "low confidence, qualitative assessment only" in the public card.

---

## Section 2: Should Do Before Second Cycle

These improve the instrument but are not launch-blocking.

### 2.1 Anchored Ethics rubric
Add at least one countable indicator: disclosure completeness score (categories disclosed / categories expected), or number of Ethics Commissioner recommendations addressed.

### 2.2 Dimension selection rationale
Publish a short note explaining why these 11 dimensions and not others. Acknowledge gaps (healthcare, justice, Indigenous reconciliation) and state whether they are excluded by design or deferred.

### 2.3 Input/output/outcome tagging
Each dimension's scoring sheet already has a "type" field. Make this visible on the card as a small tag, like the confidence tags. Helps readers understand what the grade measures.

### 2.4 Confidence-level explanation
Add a short tooltip or footer note explaining what "High confidence" and "Medium confidence" mean in practice.

### 2.5 Inter-rater reliability test
If a second human scorer is available, run them on all 11 graded dimensions independently. If not available, defer to Section 3.

---

## Section 3: Inter-Rater Reliability — Honest Disclosure

### If a second scorer IS available:
- Provide them the rubric, scoring sheets, and the same evidence package
- They grade all 11 dimensions independently
- Calculate agreement rate and note any dimensions where grades diverge by >1 letter
- Publish the result

### If a second scorer is NOT available:
The dashboard publishes this disclosure in the About tab and methodology:

> "This dashboard's grades are produced by a single editorial team using a published rubric, documented evidence, and an adversarial QA process. External human inter-rater reliability testing has not yet been completed. The following controls are used to reduce subjectivity: (1) a published scoring rubric with explicit grade thresholds, (2) canonical scoring sheets for every dimension, (3) a 5-tier source hierarchy preventing grade changes from low-quality sources, (4) a QA gatekeeping process with 6 automatic blocking conditions, (5) a deconfliction matrix preventing double-counting, (6) documented modifier rules with explicit grade adjustments, and (7) a correction protocol requiring all grade changes to cite specific evidence and rubric criteria. Independent inter-rater testing is planned for a future cycle."

This is weaker than a second scorer but defensible if disclosed clearly. It does not claim objectivity — it claims disciplined subjectivity with documented controls.

---

## Section 4: What the Launch Version Looks Like

### Dimensions (11 graded + 1 ungraded tracker):

| # | Dimension | Grade | Type |
|---|---|---|---|
| 1 | Defence & Trade | A- (sub-scores: Defence A, Trade B+) | Plus/minus |
| 2 | Major Projects | C | Plus/minus |
| 3 | Fiscal Health | D | Plus/minus |
| 4 | Economic Policy Response | D | Plus/minus |
| 5 | Affordability Response | D- | Plus/minus |
| 6 | Carbon Pricing Policy | C | Plus/minus |
| 7 | Climate & Environment | D | Plus/minus |
| 8 | Immigration | C+ | Plus/minus |
| 9 | Housing Supply | D | Plus/minus |
| 10 | Ethics & Transparency | C | Whole letter (probation) |
| 11 | Flagship Delivery | C | Whole letter (probation) |
| — | Promise Delivery | Ungraded tracker | Not in GPA |

### Headlines (estimated after changes):

**Before (current live):**
- Full Policy Audit: C- (GPA 1.70, 12 dimensions)
- Household Impact: D+ (GPA 1.51)

**After (launch version):**
- Full Policy Audit: C- (GPA 1.65, 11 dimensions)
- Household Impact: D+ (GPA 1.45)

**Boundary note:** The Full Policy Audit GPA of 1.65 sits exactly on the C-/D+ boundary. Under the published threshold rule (C- requires ≥ 1.65), the grade is C-. This is disclosed because any further deterioration in a single dimension would drop the headline to D+. Ethics and Flagship display as whole-letter C but their GPA contribution remains at the evidence-based C- value (1.7) — display simplification does not provide a free GPA upgrade.

---

## Section 5: What We're Disclosing

The launch version includes these published caveats:

1. "This is Version 2 of an iterative scoring system. Methodology is versioned and will continue to improve."
2. "Ethics & Transparency and Flagship Delivery are on probation with medium confidence ratings."
3. "Modifier constants (±0.3, C+ jurisdictional cap, 24-month timing expiry) are editorial judgment rules, not empirically derived. They are labeled provisional and subject to calibration review."
4. "Household Impact weighting is a normative editorial choice: it reflects the judgment that housing, affordability, economic policy, and fiscal health affect daily household life more directly than defence or trade. Readers who disagree with this weighting can use the equal-weight Full Policy Audit headline."
5. Inter-rater disclosure per Section 3 above.

---

*Launch Recommendation v1.0 — April 2026*
