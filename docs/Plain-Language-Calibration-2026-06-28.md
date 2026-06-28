# Plain-Language Calibration Pack - 2026-06-28

Target version: v5.139

Scope: reader-facing plain-language cleanup for the current dimension drawer. No grade, threshold, date, source URL, source count, GPA math, modifier effect, or dimension-model change.

## Rendered Order Map

The calibration reads each open drawer in this order:

1. Collapsed card: title, current grade or tracker pill, `whatThisGrades`, `status`.
2. Verdict block: `whatThisGrades`, `status`, active threshold row, reviewed date.
3. Evidence snapshot: lead metrics, grade movement, source count and newest dated source, promises.
4. Metrics: metric labels and values.
5. Triggers: up and down conditions, source labels, event notes.
6. Sources: count, newest dated source, newest-first helper, citation labels.
7. Why: `judgmentCall`, `judgmentDetail`, `rationale`, band explanation, plus/minus explanation, sub-score summary.
8. How this grade is built: construct, scope, timing note, thresholds, rules that limit the grade, scoring adjustments, operationalization tables.
9. Dimension-specific sections: project list, promises, perspectives, scope context, glossary where present.

## Shared Calibration Rules

- Keep the exact number, date, threshold, actor, and direction of movement.
- Use "condition" in prose where "trigger" reads like internal machinery, but keep trigger objects structurally unchanged.
- Use "scoring adjustment" in prose where "modifier" reads like internal machinery.
- Use "project list" in prose where "cohort" reads like internal machinery.
- Use "U.S." and "Non-U.S." in reader-facing defence/trade copy.
- Use "newest dated source" for freshness. It means the most recent date attached to a cited source, not the most important source and not an automatic score change.

## Defence & Trade Calibration

| Rendered location | Original wording | v5.139 wording | Meaning-preservation check |
|---|---|---|---|
| Trigger text | US export share drops below 68% | U.S. export share drops below 68% | Same threshold, direction, and metric. Only style changed. |
| Trigger text | US export share reverses above 73% | U.S. export share reverses above 73% | Same threshold, direction, and metric. Only style changed. |
| Metrics | US export share (2025 annual) | U.S. export share (2025 annual) | Same metric and period. |
| Metrics | Non-US exports (2025 annual) | Non-U.S. exports (2025 annual) | Same metric and period. |
| Perspectives, defenders | US export share fell ... and non-US goods exports rose ... | U.S. export share fell ... and non-U.S. goods exports rose ... | Same evidence, same figures, same source family. |
| Trade sub-score rationale | US export share fell ... Non-US goods exports rose ... | U.S. export share fell ... Non-U.S. goods exports rose ... | Same sub-score logic and same figures. |
| Source labels | Publisher - title labels now use plain hyphens instead of em dashes. | Publisher - title | Citation identity and URLs are unchanged. |

Hard-case review:

| Field | Current calibrated wording | Meaning-preservation check |
|---|---|---|
| `judgmentDetail` | Says the 3.5% defence-spending path is funded, the pre-set condition was met in the June 2026 review, the grade still stays at A-, and the defence/trade split is now on a one-cycle divergence watch. | Preserves all three load-bearing facts from the plan: the condition fired, the stale condition no longer discounts the grade, and the split happens only if divergence persists next cycle. |
| `gradeBasis.plusMinusRationale` | Says the A- remains because Canada meets but does not clearly exceed the 2% floor, trade diversification remains partly market-driven, and the trade half is mixed. | Preserves the grade boundary and the reason the B-to-A movement stopped at A-. |

## Major Projects Calibration

| Rendered location | Original wording | v5.139 wording | Meaning-preservation check |
|---|---|---|---|
| Scope note | Progress is measured against the published stages (designated -> reviewed -> approved -> permitted -> under construction -> completed) | Progress is measured against the published stages: designated, reviewed, approved, permitted, under construction, and completed. | Same stage sequence. Removed arrow typography only. |
| Up condition | First use of national interest designation | First use of the national-interest designation | Same legal power. Hyphen makes the compound phrase easier to parse. |
| Down condition | Cohort progress reverses (project moved back to designated from a higher stage) | A project moves back to designated from a higher stage | Same downgrade condition, with "cohort" removed. |
| Rationale | transition after cohort entry | transition after entering the project list | Same timing rule: a stage must move after list entry. |
| Rationale | Documented cohort progress | Documented project-list progress | Same denominator and progress rule. |
| Rationale | credit-claiming penalty modifier | credit-claiming penalty scoring adjustment | Same -0.3 GPA effect, plainer label. |
| Metric source note | national interest designation power | national-interest designation power | Same legal power. Hyphen makes the compound phrase easier to parse. |
| Perspectives, critics | national interest designation has never been used - the MPO's most powerful tool sits on the shelf | national-interest designation has never been used, so the MPO's most powerful tool sits on the shelf | Same evidence and critique, no em dash. |
| Perspectives, defenders | The MPO is less than a year old - judging it on unused powers... | The MPO is less than a year old, so judging it on unused powers... | Same timing-fairness claim, no em dash. |
| Next trigger | First use of national interest designation | First use of the national-interest designation | Same watched event. |
| Project list module | projects in MPO cohort / documented post-designation advancement | projects in the MPO project list / documented progress after being added | Same counts and project-stage rule, less internal language. |

Hard-case review:

| Field | Current calibrated wording | Meaning-preservation check |
|---|---|---|
| `judgmentDetail` | Says this grades the federal delivery process, not whether each project is good policy. Same-day stage labels do not count. Credit claiming can reduce the grade. | Preserves actor, object, timing rule, and credit-claiming penalty. |
| `rationale` | Counts 15 projects, 4 above designated, 2 with documented post-entry progress, 11 still designated, and zero national-interest uses. | Preserves denominator, numerator, percentages, and unused-power claim. |

## Source Freshness Calibration

| Location | Original wording | v5.139 wording | Meaning-preservation check |
|---|---|---|---|
| Sources affordance | newest source: date | newest dated source: date | Makes clear the date is attached to a cited source. Does not imply importance or score movement. |
| Sources affordance fallback | date review pending | no dated source yet | Clearer fallback. Same state: no dated source exists. |
| Expanded Sources helper | newest-first | newest-first | Kept. The full source table remains ordered by source date. |
