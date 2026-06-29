# App Shell Staged Release Record

**Originally parked:** 2026-05-13

**Reconciled:** 2026-06-25

**Status:** The app shell is live at the root, currently at v5.146. The app-shell release lane is the v5.119 cutover and v5.120 polish, then the v5.121-v5.126 opened-dimension drawer rework. Later releases layered on the same shell include the Kit signup move, clickable Promises card, title clarifier, dark theme, app-card polish, dashboard status card, source-freshness cue, dimension-detail reading-order work, the v5.139-v5.140 plain-language passes, the v5.141 data-driven next-checks strip plus manual Playwright browser smoke, the v5.142 classic-route retirement plus browser-smoke CI gate, the v5.143 sourced grade-move evidence loop, the v5.144 beauty / identity pass, the v5.145 mobile drawer containment fix, and the v5.146 mobile header badge fix. None of those releases changed evidence, grades, thresholds, formulas, weights, promise statuses, or the dimension model. The classic rollback route ended after the June 29, 2026 exit audit passed cleanly; old `?experience=classic` links now open the app shell.

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

The v5.120 release shipped on 2026-06-21 with post-cutover polish for mobile navigation icons, an active-filter return affordance, bottom-navigation re-entry motion, and the viewport-flip body-lock and history fix. It retains semantic navigation with buttons and `aria-current` instead of adopting an APG tab widget. v5.142 ended the classic rollback route after the post-cutover observation passed.

## Public Routes

As of v5.146:

```text
https://sawatter.github.io/canada-under-carney/
https://sawatter.github.io/canada-under-carney/?experience=app
https://sawatter.github.io/canada-under-carney/?experience=classic
```

open the app shell.

Local development uses the same app route:

```bash
npm run dev -- --host 127.0.0.1
```

## Locked Decisions

- **Release sequence:** v5.118 public beta first, then the authorized v5.119 root cutover, then the v5.120 post-cutover polish on 2026-06-21.
- **Classic fallback:** retained through the v5.119 observation period, then retired in v5.142 after the June 29 exit review passed.
- **Source of truth:** production data, evidence components, and scoring logic remain authoritative.
- **Navigation:** browser Back, Forward, direct reload, and section links must work in the app shell.
- **Accessibility:** keyboard focus, focus return, current-state semantics, live result counts, Escape behavior, reduced motion, and mobile safe areas are release gates.
- **Visual direction:** civic, restrained, and readable. It should not feel like a campaign or marketing site.
- **Approval Signal:** label it as public approval and outside the grades.

## Benchmark Pattern Trace

The app-shell and drawer work considered a broad consumer-app and public-interest benchmark set. The implementation did not copy any one app. It translated patterns that fit a calm, inspectable civic scorecard and rejected patterns that would add pressure, clutter, or casino energy.

| Reference set | Pattern used here |
|---|---|
| ChatGPT / Gemini | Calm, low-friction shell, quiet status, and less visual noise around the main task. |
| Apple Weather / Apple Stocks | Glanceable hierarchy for headline score cards, dashboard status, source freshness, and quick evidence cues. |
| WhatsApp / Telegram | Trust through obvious state, direct labels, and low-surprise navigation. |
| TikTok / Instagram / Snapchat / CapCut | Thumb-first ergonomics, touch comfort, and restrained motion. Dark-pattern loops, fake urgency, and addictive pressure were rejected. |
| Google Maps | Layered disclosure: top-level score, then Verdict, Evidence, Triggers, Sources, Why, and Criteria. |
| NYT / The Economist / CBC / Bloomberg | Editorial and data hierarchy. The drawer should feel inspectable, not gamified. |
| GOV.UK / Canada.ca / Bank of Canada / StatsCan | Public-interest trust, plain language, accessibility, and careful separation of source freshness from score review. |
| Linear | Modern product polish, clean cards, clear controls, and interaction states that stay out of the way. |
| Temu | Anti-reference. No clutter, countdowns, fake scarcity, pressure copy, or dense promotional surface. |

## Deterministic Gate

Run:

```bash
npm run test:app-shell
```

The gate checks that:

- The default route uses the app shell.
- Old `?experience=classic` links use the app shell rather than a separate classic branch.
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

## Post-Cutover Observation Period

The live app shell completed its June 29, 2026 route-exit audit on v5.141 with no rollback-level finding. v5.142 retires `?experience=classic` and promotes the Playwright browser smoke into the Pages deploy workflow. v5.143 adds a sourced grade-move evidence loop that reports current-release grade moves only from matching latest-changelog grade items. v5.144 adds the first beauty / identity pass: a richer civic masthead, maple-red accent rails, warmer score and status cards, and mobile bottom-nav polish. v5.145 fixes the mobile drawer containment edge case found during live verification, where route-transition motion could make a fixed drawer size against the scorecard page instead of the viewport. v5.146 fixes the mobile Performance Dashboard badge collision by reserving space for the accent dots and moving the badge below the theme button on phones. The app-shell changes under observation are still the v5.119 cutover and v5.120 polish plus the v5.121-v5.126 drawer rework. v5.127-v5.146 are product, copy, status, source-freshness, visual-polish, docs, browser-smoke, CI, evidence-loop, identity, containment, and mobile-header updates layered on top. The standalone daily observation heartbeat was retired on 2026-06-24 because it was pinned to the stale v5.119 release state.

Exit status:

- Root and `?experience=classic` routes passed at desktop and mobile widths.
- No open P0 or P1 issue.
- No lost evidence route or source path.
- The displayed version and deployed release match.
- The final desktop and mobile matrix covered navigation, focus, responsive layout, history, and evidence access.
- The browser-smoke CI gate now runs before Pages deploy.

### Observation log

- **2026-06-22:** Public root loads as `.app-shell`; `?experience=classic` loads as `.classic-shell`; both show deployed `v5.123` / updated `2026-06-21`. Major Projects `#dim-major-projects-sources` deep link opens Sources and focuses `dim-major-projects-sources-button` in both routes. Mobile 390px smoke check on root and classic shows header, score cards, active Scorecard navigation, and no page-level horizontal overflow. Note: local `v5.124` Red Tape Review promise update was staged but not deployed during this live check.
- **2026-06-24:** Post-merge `v5.126` smoke. Live deploy confirmed: root returns HTTP 200 and the served bundle (`assets/index-D7NLdnQH.js`) contains `"5.126"`. Interactive matrix run against the local dev server on the same `main` (HEAD `52bb80b`) that produced the deploy. App shell and `?experience=classic` both render `v5.126` / updated `2026-06-23`; the five nav destinations (Scorecard, Promises, Changes, Rubric, About) each navigate and set `aria-current` to the active destination. Major Projects `#dim-major-projects-sources` deep link opens the drawer, shows Sources, and focuses `dim-major-projects-sources-button` in the app shell, the classic route, and mobile. Zero console errors in both routes (only the expected `goatcounter: not counting because of: localhost` dev-only warnings). No page-level horizontal overflow at 835px desktop or 375px mobile. Deterministic gates green: `test:data` (56 GPA frozen-surface assertions, 12 dimensions validated), `test:app-shell` (39 checks across 6 source files), `lint` (0 errors; 323 pre-existing inline-hex warnings only). No open P0 or P1. No evidence-route loss. Displayed version matches deploy.
- **2026-06-25:** Pre-exit live route matrix on deployed `v5.128`. Root and `?experience=classic` both render `v5.128` / updated `2026-06-25`. The app shell and classic route were checked at 1280x900 and 375x812 across `#view-scorecard`, `#view-promises`, `#view-changelog`, `#view-methodology`, and `#view-about`. Active navigation matched each destination, horizontal overflow was 0, and console errors were 0. Major Projects `#dim-major-projects-sources` opened Sources and focused `dim-major-projects-sources-button` in both routes and both widths. Mobile drawers exposed `role="dialog"` and `aria-modal="true"`. App-shell click/Back smoke returned Promises to Scorecard at desktop and mobile. Classic tab clicks switch the visible tab without changing the URL, which is legacy behavior. Direct classic hash routes remain clean. No returned inter-rater worksheets were present. Because June 29 has not arrived, this is a clean pre-exit observation rather than the final retain/retire decision.
- **2026-06-28:** Live route matrix on deployed `v5.140`. Root and `?experience=classic` both render the expected shell and visible `v5.140`. The app shell and classic route were checked at 1280x900 and 375x812 across `#view-scorecard`, `#view-promises`, `#view-changelog`, `#view-methodology`, and `#view-about`. Active navigation matched each destination, horizontal overflow was 0, and console errors were 0. Major Projects `#dim-major-projects-sources` opened Sources and focused `dim-major-projects-sources-button` in both routes and both widths. Mobile drawers exposed `role="dialog"` and `aria-modal="true"`. No returned inter-rater worksheets or spreadsheet files were present in the workspace. Because June 29 has not arrived, this is a clean observation rather than the final retain/retire decision.
- **2026-06-28:** Post-v5.141 live check after the data-driven next-checks release. Root and `?experience=classic` both render the expected shell and visible `v5.141` at 1280x900 and 375x812. The live status card exposes the `Next checks` section plus Housing disbursement watch, Classic route exit, and July monthly cycle in all four route/viewport combinations. Horizontal overflow was 0 and console errors were 0. GitHub Pages deploy run `28339387655` completed successfully before the live check. Because June 29 has not arrived, this records a clean observation rather than the final retain/retire decision.
- **2026-06-29:** Final route-exit audit on deployed `v5.141`. Latest Pages deploy run `28340794401` completed successfully, and the live header showed `v5.141`. Root app shell and `?experience=classic` were checked at 1280x900 and 375x812 across `#view-scorecard`, `#view-promises`, `#view-changelog`, `#view-methodology`, and `#view-about`; all 20 route/view/viewport checks showed the expected shell, visible version, active navigation, no horizontal overflow, and no console errors. Major Projects `#dim-major-projects-sources` opened Sources and focused `dim-major-projects-sources-button` in root/classic and desktop/mobile. Mobile drawers exposed `role="dialog"` and `aria-modal="true"`. App-mode Promises card click pushed `#view-promises`, and Back returned to `#view-scorecard` at desktop and mobile. The local Playwright browser smoke also passed 18/18. No returned inter-rater worksheets or spreadsheet files were present in the workspace. No P0, P1, evidence-route, focus, responsive-layout, or deploy/version regression was found. The only remaining exit step is the editor's retain/retire decision for `?experience=classic`.

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
7. Shipped v5.120 post-cutover polish on 2026-06-21. The classic-route decision is set for the post-cutover observation exit.
8. Retired the classic route in v5.142 after the route-exit audit passed and added the Playwright browser smoke to the Pages deploy workflow.

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

## June 21 Perplexity/Codex Triage Status

- Resolved in v5.120: mobile navigation icons, the active-filter return affordance, bottom-navigation re-entry motion, and the viewport-flip body-lock and history fix.
- Decision closed: retain semantic navigation with buttons and `aria-current`. The APG tab-widget pattern was rejected because these views are navigation destinations, and adding tab semantics would create an orphan tabpanel model.
- Deferred: behavioral browser automation. The repository still has no browser test harness for that work.
- P3-B was refuted as a desktop-scroll claim. Only the 641-760px residual remains. P3-C was classified as a non-issue, and the reported contrast issue was refuted: muted-on-white is 5.74:1 and white-on-accent is 9.40:1.
- A Comet keyboard smoke test flagged missing focus rings on the section-expand buttons (WCAG 2.4.7). Checked with a headed-browser keyboard pass: `.dim-section-button` inherits the global `:focus-visible` ring (2px solid #1a73e8) and shows it on keyboard focus, so this was a visual-method false negative, not a defect. No fix. The same smoke run's mobile-trap and focus-in failures were also false negatives (Comet ran at desktop width where the modal trap is off by design, and could not read `document.activeElement`); a Playwright pass with real viewport and native keys confirmed the focus behavior 6/6.
