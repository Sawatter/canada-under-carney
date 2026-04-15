# v2 Decision Memo: Defence & Trade

**Question:** Should Defence & Trade remain combined in v2?

**Date:** April 2026
**Status:** Decision pending

---

## The Problem

Defence & Trade staples together two fundamentally different constructs. Defence spending is a binary target (NATO 2%: met or not) with direct federal attribution. Trade diversification is a slow-moving structural outcome (US export share, non-US growth) with heavy external dependence on global markets, exchange rates, and partner-country demand.

The diagnostic question — "if defence improved and trade worsened in the same month, how would the current model handle that?" — exposes a real failure mode. The current A- grade is carried almost entirely by the defence achievement. If trade diversification reversed (US share climbing back toward 73%), the A- would mask the regression because the NATO achievement would still anchor the grade.

---

## Option 1: Keep Combined As Is

### Construct clarity
**Poor.** Two unrelated constructs in one grade. Defence spending is an input (what the government spent). Trade diversification is an outcome (where exports went). These have different attribution profiles, different lag structures, and different indicator types.

### Risk of hiding regression
**High.** The NATO 2% achievement is a one-time milestone that will remain "delivered" indefinitely. It cannot regress (spending can fall, but the milestone was achieved). Trade diversification can regress at any time — exchange rate shifts, trade partner changes, or tariff adjustments could push US export share back above 70%. Under the current model, a trade regression would be buried inside a dimension whose anchor metric (NATO 2%) is permanently locked in.

### Readability
Good. "Defence & Trade" is intuitive. Most voters connect the two through the sovereignty narrative. Splitting would create two smaller, less immediately recognizable dimensions.

### Comparability with v1
Perfect. No change means no disruption to historical tracking.

### Maintenance burden
Low. Same as current.

### Score integrity
**Compromised.** The A- is not representative of either construct independently. Defence alone would merit an A. Trade diversification alone would merit a B+ at best (real diversification, but partially market-driven and partially reversible). The blended grade conceals this split.

### Assessment
Keeping the combination is the lowest-disruption option but carries a real measurement integrity risk that will get worse over time as the defence milestone fades from salience and trade becomes the active indicator.

---

## Option 2: Keep Combined with Explicit Sub-Scoring

### How it works
The dimension stays as one entry on the dashboard but displays two sub-scores:
- **Defence sub-score: A** (NATO 2% met, $81.8B committed, procurement advancing)
- **Trade sub-score: B+** (US share down to 71.7%, non-US exports +17.2%, but partially market-driven)

The headline grade (A-) is the average of the two sub-scores, or follows a defined combination rule.

### Construct clarity
**Improved.** Readers can see both constructs and how they contribute. The dual-construct problem is made transparent rather than hidden.

### Risk of hiding regression
**Mitigated.** If trade regresses, the trade sub-score drops visibly. Readers can see the divergence even if the headline grade moves slowly.

### Readability
Good. Sub-scores add detail without adding a new dimension. The "Defence & Trade" label remains familiar. The expanded card already has sections for metrics, rationale, and perspectives — sub-scores fit naturally.

### Comparability with v1
Good. The headline dimension name and grade are preserved. The sub-scores are additive information, not a break in the series.

### Maintenance burden
Moderate. Each monthly update must assess two sub-scores instead of one blended grade. But the indicators are already tracked separately (NATO spending vs. export share), so the actual work increase is the formal sub-score assignment.

### Score integrity
**Good.** The headline grade is still a composite, but the components are visible. A reader can see that A- means "A on defence, B+ on trade" rather than guessing what the blend contains.

### Assessment
This is the minimum viable fix. It solves the transparency problem without the disruption of a full split. The risk of hiding regression is mitigated (not eliminated — the headline can still mask a divergence, but the sub-scores make the divergence visible to anyone who clicks the card).

---

## Option 3: Split into Two Separate Dimensions

### How it works
Defence & Trade becomes two independent dimensions:
- **Defence** (A): NATO spending, procurement, BOREALIS, Arctic sovereignty
- **Trade Diversification** (B+): US export share, non-US export growth, CETA, new agreements

Each contributes independently to the GPA.

### Construct clarity
**Best.** Each dimension has a single, clean construct. Defence grades whether the government met its stated military commitments. Trade grades whether economic dependence on the US is being structurally reduced.

### Risk of hiding regression
**Eliminated.** If trade regresses, the Trade Diversification grade drops visibly and independently affects the GPA. Defence holds its own grade.

### Readability
Slightly worse. The dashboard goes from 11 dimensions (if Promise Delivery is demoted) to 12 again, or from 12 to 13 if Promise Delivery stays. More dimensions can feel cluttered. However, each dimension is cleaner and easier to understand in isolation.

### Comparability with v1
**Broken.** The A- grade disappears from the historical series. It is replaced by two new grades. Trend tracking must note the split. This is a real cost for longitudinal analysis.

### Maintenance burden
Higher. Two independent assessments, two evidence packs, two QA runs. The trade dimension specifically requires more frequent monitoring because export data moves monthly while NATO spending is confirmed annually.

### Score integrity
**Best.** No blending, no hiding, no composite. Each grade means exactly one thing.

### Assessment
This is the methodologically purest option. It eliminates every structural concern. The cost is historical comparability and added complexity.

---

## Comparison Table

| Criterion | Keep as is | Sub-scoring | Full split |
|---|---|---|---|
| Construct clarity | Poor | Good | Best |
| Regression risk | High | Mitigated | Eliminated |
| Readability | Best | Good | Acceptable |
| v1 comparability | Perfect | Good | Broken |
| Maintenance | Low | Moderate | Higher |
| Score integrity | Compromised | Good | Best |

---

## Recommendation

**Option 2: Keep combined with explicit sub-scoring.**

This is the right trade-off between methodological rigor and practical disruption. It solves the transparency problem (readers can see the divergence), mitigates the regression-hiding risk, preserves the familiar dimension name, maintains historical comparability, and adds only moderate maintenance burden.

The sub-scores should be:
- Displayed in the expanded card, under a "Sub-Scores" heading between the rationale and the metrics
- Computed and logged in the monthly update process
- Used as the basis for the headline grade (average of the two, or a defined combination rule)

### Strongest argument against this recommendation

The counter-argument is that sub-scoring is a half-measure. It makes the dual-construct visible but doesn't fix it. The headline A- still blends two unrelated things. If trade diversification drops to a C while defence holds at A, the blended headline might be B+ — which describes neither file accurately. Sub-scoring is transparent but not clean.

### Response to the counter-argument

True, but the alternative (full split) breaks the historical series and adds complexity. The sub-scoring approach makes the compromise explicit. If a future cycle shows the sub-scores diverging by more than one full letter grade, that should trigger a formal review of whether the split is now warranted. The sub-scoring is the monitoring mechanism for the decision to split later.

### Timing

**Implement sub-scoring in the next cycle (May 2026).** This requires only a data model change (add `subScores` to the Defence & Trade dimension in dimensions.json) and a display change in the expanded card. No structural dashboard change. No GPA calculation change. Shadow-test a full split alongside for one cycle. If the sub-scores diverge by more than 1.0 GPA points, promote the full split to v2.

---

## Decision Gate for Full Split

The sub-scoring approach includes a built-in decision gate:

**If the defence and trade sub-scores diverge by more than 1.0 GPA points (approximately one full letter grade) for two consecutive monthly cycles, the dimension is automatically queued for a full split in the next version.**

This means the sub-scoring is not a permanent compromise — it is a monitoring mechanism with a defined trigger for escalation.

---

*Decision Memo v1.0 — April 2026*
