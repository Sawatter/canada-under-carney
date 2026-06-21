# App Shell Staged Release Record

**Originally parked:** 2026-05-13

**Reconciled:** 2026-06-20

**Status:** public beta approved at `?experience=app`. The classic dashboard remains the default.

**Public source of record:** `https://sawatter.github.io/canada-under-carney/`

## Why This Exists

The app shell tests whether the dashboard can feel more app-like on a phone while keeping its evidence and scoring rules visible. It is a presentation and interaction lane. It does not change grades, thresholds, formulas, weights, promise statuses, or the dimension model.

The staged release keeps the current dashboard at the root while the app shell is reviewed on the same public data and hosting environment.

## Current State

PR #11 completed the second prototype pass on June 20, 2026. It added:

- A compact scorecard and app-style mobile navigation.
- Opened dimension views with Verdict, Why, Triggers, Metrics, Sources, and Rule sections.
- A Promise Delivery tracker variant.
- Promise search, filtering, sorting, grouping, sticky controls, and an empty state.
- Expanded How it works and About panes.

The v5.118 public-beta pass replaces reduced prototype evidence surfaces with production components where the dashboard already has the required behavior. The beta must keep the production dimension detail, score derivations, Approval drilldown, Change Log, Methodology, and About content reachable.

## Public Routes

After v5.118 is deployed:

```text
https://sawatter.github.io/canada-under-carney/?experience=app
```

opens the public app-shell beta.

```text
https://sawatter.github.io/canada-under-carney/
https://sawatter.github.io/canada-under-carney/?experience=classic
```

open the classic dashboard. The root stays unchanged during the beta.

Local development uses the same query values:

```bash
npm run dev -- --host 127.0.0.1
```

## Locked Decisions

- **Release sequence:** public beta first. Root cutover is conditional.
- **Classic fallback:** keep `?experience=classic` for the beta and for at least one release after a root cutover.
- **Source of truth:** production data, evidence components, and scoring logic remain authoritative.
- **Navigation:** browser Back, Forward, direct reload, and section links must work in the app shell.
- **Accessibility:** keyboard focus, focus return, current-state semantics, live result counts, Escape behavior, reduced motion, and mobile safe areas are release gates.
- **Visual direction:** civic, restrained, and readable. It should not feel like a campaign or marketing site.
- **Approval Signal:** label it as public approval and outside the grades.

## Deterministic Gate

Run:

```bash
npm run test:app-shell
```

The gate checks that:

- `?experience=app` is available in a production build.
- The default route and `?experience=classic` use the classic dashboard.
- The public app shell reuses the production evidence components.
- The public path does not truncate metrics with a prototype-only slice.
- URL history, focus handling, current-state semantics, live updates, Escape behavior, and reduced-motion handling are present.

This source-level gate catches accidental contract removal. It does not replace browser or assistive-technology review.

## Beta Release Gates

The public beta can merge when these checks pass:

- `npm run test:app-shell`
- `npm run test:data`
- `npm run lint`
- `npm run build`
- Desktop review at 1280px.
- Mobile review at 375px, 390px, and 320px.
- No horizontal overflow at the reviewed widths.
- Major Projects exposes the same evidence sections as its production detail view.
- Promise Delivery remains an ungraded tracker.
- Promise source and status-evidence links remain reachable.
- Browser Back, Forward, direct reload, and scroll restoration work.
- Keyboard focus enters and leaves dimension detail predictably.
- Reduced-motion behavior and mobile safe areas are checked.
- Claude finds no unresolved P0 or P1 issue in the scoped diff.

## Conditional Root Cutover

The editor approved this rule on June 20, 2026:

> Publish the app shell at `?experience=app` while the current root stays stable. Close the parity and accessibility gaps, run browser and Claude reviews, then run Perplexity against the public beta. Make the app shell the root only if the listed gates pass and no P0 or P1 issue remains. Keep `?experience=classic` for one release as rollback.

Root cutover stops if:

- A grade, threshold, formula, weight, promise status, or dimension-model change appears.
- An evidence route or source link is lost.
- A deterministic, browser, accessibility, Claude, or Perplexity gate fails.
- A P0 or P1 issue remains open.
- The deployed version or commit does not match the reviewed release.

## Carried accessibility gaps (closed on the cutover branch)

The 2026-06-20 Claude adversarial review (four axes: evidence parity, classic regression, frozen surface, accessibility) found no P0 and no P1 in the scoped beta diff. One net-new app-shell P1 was fixed in the same pass: the Promises status-count pills now carry `role="group"` so their group label is exposed.

The v5.118 beta carried two P1 accessibility gaps from the production `DimensionCard`. The cutover branch closes both without changing the root route. They remain root-cutover gates until the versioned release is merged and its behavioral checks pass:

- Desktop focused-detail view: the branch moves focus into detail, closes on Escape, and returns focus to the originating card header.
- Mobile detail modal: the branch contains Tab and Shift+Tab within the drawer while preserving Escape, deep-link focus, and return focus.

Both fixes change the shared production `DimensionCard`, so the branch includes classic and app-mode verification. They are held for the versioned root-cutover release rather than a standalone merge.

## Review Sequence

1. Publish v5.118 at `?experience=app` with the classic root unchanged.
2. Confirm the deployed version, commit, app chunk, and classic fallback.
3. Run the browser matrix and Claude review against the public beta.
4. Ask Perplexity to review the same public URL against cited responsive-dashboard and accessibility guidance.
5. Address P0 and P1 findings and repeat affected gates.
6. Prepare a separate root-cutover release with `?experience=classic` retained.

## Frozen During App-Shell Work

Do not change these without explicit approval in the current turn:

- GPA formulas
- grade-point mapping
- headline-score rounding
- `POCKETBOOK_DIMS`
- threshold values
- modifier rules or effects
- dimension count
- current grades
- promise statuses

## June 20 Perplexity/Codex Triage Backlog

- P1-C icon treatment is P3 and is not a root-cutover blocker.
- Deferred: P2-A tab-rail navigation semantics, P2-C mobile filter-pill clearing, P3-A bottom-nav fade, the viewport-flip body-lock/history bug, and behavioral focus automation. The repository has no browser test harness for the last item.
- P2-B was not added because it would create an orphan tabpanel.
- P3-B was refuted as a desktop-scroll claim. Only the 641-760px residual remains. P3-C was classified as a non-issue, and the reported contrast issue was refuted: muted-on-white is 5.74:1 and white-on-accent is 9.40:1.
