# App Shell Staged Release Record

**Originally parked:** 2026-05-13

**Reconciled:** 2026-06-20

**Status:** v5.119 root cutover release. The app shell is the default, with `?experience=classic` retained as the rollback route for this release.

**Public source of record:** `https://sawatter.github.io/canada-under-carney/`

## Why This Exists

The app shell tested whether the dashboard could feel more app-like on a phone while keeping its evidence and scoring rules visible. It is a presentation and interaction lane. It does not change grades, thresholds, formulas, weights, promise statuses, or the dimension model.

The staged release kept the classic dashboard at the root while the app shell was reviewed on the same public data and hosting environment. v5.119 completes the root cutover after the release gates closed.

## Current State

PR #11 completed the second prototype pass on June 20, 2026. It added:

- A compact scorecard and app-style mobile navigation.
- Opened dimension views with Verdict, Why, Triggers, Metrics, Sources, and Rule sections.
- A Promise Delivery tracker variant.
- Promise search, filtering, sorting, grouping, sticky controls, and an empty state.
- Expanded How it works and About panes.

The v5.118 public-beta pass replaced reduced prototype evidence surfaces with production components where the dashboard already had the required behavior. The beta kept the production dimension detail, score derivations, Approval drilldown, Change Log, Methodology, and About content reachable.

The v5.119 release makes that app shell the root experience. It also closes the carried desktop and mobile focus P1s in the shared production dimension detail. Grades, scoring rules, policy data, approval data, promise statuses, thresholds, formulas, weights, and the dimension model are unchanged.

## Public Routes

As of v5.119:

```text
https://sawatter.github.io/canada-under-carney/
https://sawatter.github.io/canada-under-carney/?experience=app
```

open the app shell.

```text
https://sawatter.github.io/canada-under-carney/?experience=classic
```

opens the classic dashboard as the explicit rollback route for this release.

Local development uses the same query values:

```bash
npm run dev -- --host 127.0.0.1
```

## Locked Decisions

- **Release sequence:** v5.118 public beta first, then the authorized v5.119 root cutover.
- **Classic fallback:** keep `?experience=classic` through v5.119. Revisit removal only after the post-cutover observation period.
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
- The default route and `?experience=app` use the app shell.
- `?experience=classic` uses the classic dashboard.
- The public app shell reuses the production evidence components.
- The public path does not truncate metrics with a prototype-only slice.
- URL history, focus handling, current-state semantics, live updates, Escape behavior, and reduced-motion handling are present.

This source-level gate catches accidental contract removal. It does not replace browser or assistive-technology review.

## Beta Release Gates (passed)

The public beta was eligible to merge when these checks passed:

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

## Root Cutover Decision

The editor approved this rule on June 20, 2026:

> Publish the app shell at `?experience=app` while the current root stays stable. Close the parity and accessibility gaps, run browser and Claude reviews, then run Perplexity against the public beta. Make the app shell the root only if the listed gates pass and no P0 or P1 issue remains. Keep `?experience=classic` for one release as rollback.

The v5.119 cutover was authorized after the beta and cutover gates closed with no unresolved P0 or P1 issue. The cutover would have stopped if:

- A grade, threshold, formula, weight, promise status, or dimension-model change appears.
- An evidence route or source link is lost.
- A deterministic, browser, accessibility, Claude, or Perplexity gate fails.
- A P0 or P1 issue remains open.
- The deployed version or commit does not match the reviewed release.

## Carried accessibility gaps (closed in v5.119)

The 2026-06-20 Claude adversarial review (four axes: evidence parity, classic regression, frozen surface, accessibility) found no P0 and no P1 in the scoped beta diff. One net-new app-shell P1 was fixed in the same pass: the Promises status-count pills now carry `role="group"` so their group label is exposed.

The v5.118 beta carried two P1 accessibility gaps from the production `DimensionCard`. v5.119 closes both:

- Desktop focused-detail view: the branch moves focus into detail, closes on Escape, and returns focus to the originating card header.
- Mobile detail modal: the branch contains Tab and Shift+Tab within the drawer while preserving Escape, deep-link focus, and return focus.

Both fixes change the shared production `DimensionCard`, so the cutover review covered classic and app modes. They were held for this versioned root-cutover release rather than merged as a standalone change.

## Review Sequence (passed)

1. Published v5.118 at `?experience=app` with the classic root unchanged.
2. Confirmed the deployed version, commit, app chunk, and classic fallback.
3. Ran the desktop and mobile browser matrix plus the Claude review against the public beta.
4. Ran the Perplexity review against the same public URL and triaged the findings with Codex.
5. Closed the app-shell status-count group-label P1 and the carried desktop and mobile focus P1s. No P0 or P1 issue remains open for cutover.
6. Prepared v5.119 with the app shell at the root and `?experience=classic` retained as the one-release rollback route.

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
