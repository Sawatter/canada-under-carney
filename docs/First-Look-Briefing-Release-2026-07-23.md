# First-Look Briefing Release

**Status:** Release candidate<br>
**Prepared:** 2026-07-23<br>
**Comparison baseline:** live v5.163<br>
**Frozen surfaces:** no grade, threshold, formula, weight, modifier, promise
status, source order, trigger, or dimension-model change

## Problem

v5.163 made an opened policy easier to read, but the overview still explained
the product before showing its result. On a `375 x 812` screen, the headline
cards began below the first viewport. On desktop, the four equal cards made a
policy grade, a differently weighted grade, a promise count, and public opinion
look more comparable than they are.

## Product Decision

v5.164 replaces that opening stack with one fixed first-look briefing:

1. Full Policy Audit grade and score.
2. One validated, editor-authored reason.
3. The newest release state, selected by a deterministic changelog rule.
4. The next scheduled score update and first published watch item.
5. A visible statement of what affects each grade.
6. Direct routes to the 11 policy files and scoring method.

Household Impact remains available as the same 11 files with four pocketbook
files counted twice. Promise Delivery and Approval remain compact context
signals outside both grades. The existing four-view policy workspace remains
unchanged.

## Data Contract

- `meta.overallVerdictLine` is required, trimmed, single-line, and validated.
  It is never synthesized at render time.
- `buildFirstLookProjection()` reads only the newest changelog entry. It shows
  at most the first two stored grade items, otherwise the first stored
  non-quiet item, or the maintenance-only state when every item is quiet.
- Changelog history remains deferred from the scorecard bundle.
- `selectPrimaryNextCheck()` returns the first stored `status.nextChecks`
  record. The UI does not rank or infer a different watch.
- `resolveNextCheckTiming()` renders a direct date, a date resolved from
  `status.json`, or the authored event-driven label without changing priority.
- `DashboardStatus` is limited to source and review freshness. It does not
  duplicate grade moves or next-check content.

## Accessibility And Navigation

- The briefing is a named section and the secondary signals are a named group.
- Promise Delivery and Approval use native buttons.
- The policy route focuses `policy-grades-heading` in place on Scorecard. From
  another view it returns to Scorecard without adding a history entry.
- The scoring-method route opens and focuses `methodology-safeguards`.
- The release link opens the complete newest changelog entry.
- Mobile actions are at least 44 pixels high and remain above the fixed bottom
  navigation at `375 x 812`.
- Forced-colors treatment keeps the briefing borders, actions, and focus
  indicators visible without relying on gradients.

## Acceptance Record

Completed locally on July 23:

- `npm run test:data` passed, including the first-look helper suite, the
  canonical authored-data validator, 22 invalid validation fixtures, 12
  dimension shape checks, and 56 frozen-score assertions.
- `npm run lint` exited 0 with no errors. Existing warning-only color-token
  findings remain outside this bounded release.
- `npm run test:app-shell` passed 69 checks across 19 source files.
- `npm run build` passed. The entry bundle is 335,056 bytes and the initial
  JavaScript graph is 348,918 bytes, both within budget.
- The 246 listed browser cases passed in 37 fresh-process batches across the
  normal, reduced-motion, and dark projects. The batching avoids the
  long-lived local preview failure already documented for v5.163 without
  reducing the test matrix.
- A dark-mode forced-colors specificity defect found during the gate was fixed.
  The focused-route and surface test then passed in the three browser projects.
- The revised rendered-content audit passed 356 rows with zero issues across
  desktop and mobile widths.
- Direct browser inspection passed at desktop `1280 x 900` and mobile
  `375 x 812`. At mobile width the watch timing is visible, the Household math
  control measures 44 pixels high, and the two inspect actions end at `y=727`,
  above the fixed navigation at `y=747`, with zero horizontal overflow. At
  desktop width the briefing and the three secondary signals end at
  `y=875.2`.
- The policy, method, and release-history routes opened their intended targets.

## Review Record

- Standards round 1 returned `REVISE` for a cross-view policy route, an
  unrendered `dateSource` path, stale architecture and checklist text, and
  public copy that conflicted with the repo wording rules. Those findings were
  corrected with regression coverage. The next Standards pass returned
  `APPROVED`.
- Spec first approved the original contract. Its post-fix pass then returned
  `REVISE` because mobile CSS hid the watch timing and reduced the Household
  math control below 44 pixels. Both defects were corrected and the final Spec
  pass returned `APPROVED`.
- Claude's first broad pass returned `APPROVED` with minor observations.
  Approval's accessible name and the dark-theme promise value contrast were
  improved. The compact mobile metadata and shared secondary-signal heading
  were retained because the core values and scoring roles remain explicit.
- A later broad Claude retry timed out after 600 seconds and counted as no
  review. A focused read-only pass over the final correction surfaces returned
  `APPROVED` with no remaining discrepancy.

Commit, deployment, and production checks must pass before this record changes
to Live. A timeout, missing environment, or unperformed check is not approval.

## Reader-Test Boundary

The approved research decision calls for eight first-time human readers. That
study has not been performed. Independent AI reader-proxy checks may identify
obvious hierarchy failures, but they are not human usability evidence and do
not close the August observation task.

Eight independent screenshot-only reader proxies were run as a defect screen:
four at `375 x 812` and four at `1280 x 900`. Eight of eight identified the grade,
authored reason, Household weighting, non-scoring status of Promises and
Approval, newest release state, Housing watch, and policy-file evidence route.
Two desktop proxies found the repeated score-math button label ambiguous. The
buttons were relabelled by scope as `How is the audit score built?` and `How is
Household built?`. This result does not replace the human acceptance test.

## Roadmap Outcome

This advances the readability goal by making the current result, reason,
release state, next checkpoint, and scoring boundary available before the
policy grid. It exposes a narrower next question: whether first-time human
readers interpret the four signal roles correctly under a timed task.

The August cycle remains the highest-priority scheduled work. Reader
observation should follow without adding charts, personalization, generated
summaries, or another navigation layer.
