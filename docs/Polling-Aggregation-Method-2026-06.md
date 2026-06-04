# Approval Signal — Aggregation Method (2026-06)

**Status:** Live as of v5.92. Records the polling-aggregation upgrade decided in
the 2026-06 methodology pass (gap-map area 6). The Approval Signal is an ungraded
context card. It is not part of the 11-dimension GPA, so this change does not
touch the frozen GPA math in `src/utils.js`. It does move a published number, so
it is a methodology change with editor sign-off and a changelog entry.

## What changed

Before: a sample-size-weighted mean across polls whose field-end date fell in the
rolling 60-day window. A flat window, so a poll from day 1 counted the same as one
from day 59, and no correction for any firm's standing lean.

After: the same 60-day inclusion window, with two additions.

1. **Recency decay.** Each poll's weight is its sample size times an exponential
   recency factor with a 30-day half-life. A poll loses half its weight every 30
   days, measured from the window's newest edge. A 60-day-old poll keeps about a
   quarter of a same-day poll's weight.
2. **House-effect correction.** Before averaging, each firm's house effect is
   subtracted. The house effect is the firm's standing lean versus other firms
   polling the same weeks, computed separately for approve and disapprove.

## Decisions taken (2026-06 grill)

- Scope: both phases in one pass (recency decay and applied house-effect
  correction), not decay alone.
- Half-life: 30 days.
- House-effect baseline: leave-one-pollster-out, contemporaneous. For each poll,
  the firm's value is compared to the equal-firm-weighted average of other firms
  polling within 45 days. Equal firm weighting stops the most frequent firm from
  defining its own baseline.
- Minimum polls: a firm earns an offset only with at least 3 comparable polls on
  record. Below that it is left neutral (zero offset) until it accumulates more.
- Offsets are computed separately for approve and disapprove.
- Uncertainty interval: deferred to a later pass.

## How the house effect is computed

For each poll, the contemporaneous baseline averages other firms' polls within
`neighborhoodDays` (45), giving each other firm equal weight. The firm's offset is
the mean of (its poll value minus that baseline) across its polls. Offsets are
subtracted from each of that firm's polls before the weighted average, which moves
the estimate toward cross-firm consensus. Firms below the minimum-poll threshold
are neutral. The per-firm offsets are shown in the dashboard drill-down so a reader
can see exactly what was applied.

Parameters live in `src/data/approval-polls.json` (`halfLifeDays`, `houseEffect`),
read by `src/components/ApprovalSignal.jsx`, so the published methodology text and
the math stay in sync.

## Result on the current data (as of 2026-05-30)

Recent window: 5 polls (3 Abacus, 1 Léger, 1 Angus Reid).

| Method | Approve | Disapprove | Net |
|---|---|---|---|
| Old (flat sample-weighted) | 57 | 30 | +27 |
| New (recency + house effects) | 61 | 34 | +26 |

Approve and disapprove each rise about 4 points; net is essentially unchanged. The
window is Abacus-heavy, and Abacus runs low on both approve and disapprove relative
to other firms, so de-housing lifts both toward the multi-firm consensus.

Per-firm house effects over the full poll set:

| Firm | Polls | Approve lean | Disapprove lean | Status |
|---|---|---|---|---|
| Abacus Data | 11 | -4.3 | -6.9 | applied |
| Léger | 5 | -0.7 | +1.2 | applied |
| Angus Reid Institute | 2 | — | — | neutral (n<3) |
| Ipsos | 2 | — | — | neutral (n<3) |
| Innovative Research Group | 1 | — | — | neutral (n<3) |

A positive lean means the firm runs higher than the field on that measure; the lean
is subtracted from that firm's polls.

## Deferred (candidate next passes)

- Uncertainty interval around the aggregate (effective-sample-size based).
- Pollster-quality weighting beyond the minimum-poll gate, once Canadian firm
  accuracy records are available to support it.
- Revisiting the 60-day inclusion window now that recency decay handles fade.
