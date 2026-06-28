# Plan: Ambitious Evolution Phase 2
_Locked via grill - by Codex + Chris_

## Goal

Evolve the live Canada Under Carney dashboard in production, not a hidden prototype, while preserving the public-scorecard trust boundary. The work should make the app safer to change, give readers a clean evidence-based reason to return, and add controlled visual and motion polish without changing grades, thresholds, formulas, source stacks, promise statuses, or the dimension model.

## Approach

1. Add a real browser regression harness first.
   - Add Playwright as a dev dependency, Chromium-only at first.
   - Add `npm run test:browser`.
   - Run against a local production build and preview using Playwright's `webServer` config so startup and teardown are owned by the test runner.
   - Use the Vite base path: `http://127.0.0.1:4173/canada-under-carney/`, not `/`.
   - Cover root and `?experience=classic`, desktop and 375px mobile, all five view destinations, no console errors, no horizontal overflow, visible version read from `src/data/meta.json`, and Major Projects `#dim-major-projects-sources` focus/deep-link behavior.
   - Assert the Major Projects source deep link focuses `dim-major-projects-sources-button`, not only the section id.
   - Scope Back/history assertions to app mode. Classic route checks should use direct hash routes and visible active-state assertions, since classic tab clicks do not push URL entries.
   - Keep this as a manual/local gate for one stable release. Do not wire it into required Pages deploy CI yet.

2. Add an evidence-based return loop.
   - Bump `src/data/status.json` to `schemaVersion: 2`.
   - Extend `src/data/status.json` with a typed `nextChecks` array.
   - Update `scripts/validate-status.mjs` in the same commit: allow `nextChecks[]`, keep personalized `watchItems`, `newSinceLastVisit`, and `materialChangesCount` forbidden, validate each item, and recursively scan string fields for urgency/fake-freshness words.
   - Render it through the existing `DashboardStatus` card instead of adding a separate high-noise widget.
   - Include Housing disbursement watch, classic-route exit, and the July 1 monthly cycle, but do not duplicate existing date fields where the component can derive them from `nextScheduledSourceScanAt`.
   - Keep the copy calm: no streaks, badges, countdown pressure, fake urgency, personalization, or dark-pattern retention mechanics.

3. Improve "what changed / what to inspect next" without changing the scoring model.
   - Use the existing `WhatsChanged` tab and `DashboardStatus` surface.
   - Make the return reason editorial and inspectable: latest score/copy changes, next source scan, watch items, and where evidence can be checked.
   - Keep email signup as the humane notification loop.

4. Do deeper visual and motion polish in controlled slices.
   - Use the benchmark trace already recorded in `docs/Prototype-App-Shell-Parking-2026-05.md`.
   - Keep the feel calm, inspectable, editorial, and trustworthy.
   - Use restrained motion only where it clarifies state changes: card press, view transition, opened drawer, status/watch list reveal.
   - Respect reduced-motion. Add source-level `prefers-reduced-motion` checks for any new animated selectors and run the browser smoke once with Playwright `reducedMotion: "reduce"`.
   - Run `npm run test:app-shell` after every motion slice, not only `test:browser`.
   - Avoid redesigning grades, methodology, or evidence hierarchy.

5. Promote the browser harness to CI later.
   - After one stable release where `npm run test:browser` passes locally and live verification does not show rollback-level regressions, add a separate commit to wire it into GitHub Actions.
   - The future CI job must install Chromium explicitly with `npx playwright install --with-deps chromium` and can add cache handling after the first working pass.
   - Prefer a separate browser-test job over blocking deploy with an unproven harness during the first release.

## Key Decisions & Tradeoffs

- Production evolution, not hidden prototype. The app shell is already live, so duplicating it would slow the work and raise parity risk.
- Playwright is allowed as a dev dependency. Chromium-only is enough for the first harness.
- Browser harness is manual first. Immediate CI would give stronger gating but risks flaky deploy blocks before the test proves stable.
- Engagement loop stays evidence-based. No streaks, badges, urgency banners, "come back tomorrow" language, or visit-history personalization.
- Status loop is data-driven from `src/data/status.json`, not hardcoded in the component, and requires a schemaVersion 2 validator update.
- The existing `DashboardStatus` surface is the home for next checks. Do not add a separate promotional module unless the existing card cannot carry the information.

## Risks / Open Questions

- Playwright preview orchestration can add timing flake if the script does not own server startup and teardown cleanly. Use Playwright `webServer` instead of a hand-rolled server lifecycle.
- Focus assertions for Major Projects deep links need to catch the real focus target: `dim-major-projects-sources-button`.
- `status.json` schemaVersion 2 needs validation in the same commit as `nextChecks[]`; otherwise `npm run build` fails.
- The classic-route decision happens on June 29. Until Chris answers the retain/retire question, browser tests must keep covering `?experience=classic`.
- Motion polish can drift into decorative noise. Each motion change needs a reason, `test:app-shell`, default browser smoke, and reduced-motion browser smoke.

## Out Of Scope

- No grade moves.
- No threshold, GPA formula, score rounding, `POCKETBOOK_DIMS`, modifier effect, source-stack, promise-status, or dimension-model changes.
- No new hidden prototype branch.
- No dark-pattern retention mechanics.
- No immediate required CI gate for the first Playwright release.
- No routing change to retire `?experience=classic` until the June 29 exit audit passes and Chris answers the retain/retire question.
