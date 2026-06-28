# Plan Review Log: Ambitious Evolution Phase 2

Act 1 (grill) complete - plan locked with the user. MAX_ROUNDS=5.

## Round 1 - Claude

I have everything needed. This is an adversarial review, and the user instruction is explicit: read-only, no file edits, end with a verdict. Here it is.

---

# Adversarial Plan Review: Ambitious Evolution Phase 2

## Blocker findings

**1. `status.json` watch-list directly collides with the existing validator's explicit prohibition.**
`scripts/validate-status.mjs:110` actively forbids a public watch-list: `if ("newSinceLastVisit" in status || "materialChangesCount" in status || "watchItems" in status)`. The plan's `nextChecks`/`watchQueue` array (step 2) is the exact thing this guard was written to block. Because `prebuild` runs `validate-status.mjs`, `npm run build` will *fail* the moment the field is added. The plan never mentions this guard or a `schemaVersion` bump.
*Fix:* Bump `status.json` to `schemaVersion: 2`, replace the blanket watch-list prohibition with a typed `nextChecks[]` validation rule in the same commit, and keep `watchItems` (the personalized form) forbidden.

**2. The forbidden-urgency scan won't reach the new array - "keep copy calm" is unenforced.**
`scanForbiddenWords` only iterates top-level `Object.entries(status)` over string values (`validate-status.mjs:114`). An array of `{text, date}` objects bypasses it entirely, so "no fake urgency" becomes a vibe, not a gate.
*Fix:* Recurse the urgency-word scan into each `nextChecks[]` item's string fields and date-validate each item's date.

**3. Preview base path will 404 the harness at `/`.**
Vite builds with base `/canada-under-carney/`; `vite preview` serves under that base, not root. A Playwright nav to `http://localhost:4173/` returns 404, and `?experience=classic` must be appended to the *based* URL.
*Fix:* Point all harness URLs at `http://localhost:4173/canada-under-carney/?experience=...`.

## Should-fix gates (missing)

**4. Deep-link assertion targets the wrong element.**
Plan says assert `#dim-major-projects-sources` focus, but the observation log confirms the focused element is `dim-major-projects-sources-button`. A section-id check won't catch focus regressions.
*Fix:* Assert `document.activeElement.id === "dim-major-projects-sources-button"`.

**5. Classic-route navigation has no URL - URL/Back assertions will false-fail there.**
Observation log: "Classic tab clicks switch the visible tab without changing the URL." App mode uses `history.pushState`; classic does not. A uniform "navigate five views by URL + Back" assertion across both routes breaks on classic.
*Fix:* Drive classic views by click/direct-hash and scope `history.pushState`/Back assertions to app mode only.

**6. Reduced-motion is asserted in CSS source but not exercised in the browser.**
`test:app-shell` already source-checks `prefers-reduced-motion` overrides for `.app-shell-view`/`.app-bottom-nav`. New motion (card press, view transition, drawer, status reveal) needs both a new source-contract assertion *and* a Playwright context run with `reducedMotion: 'reduce'`. Plan mentions neither concretely.
*Fix:* Run the browser suite in both default and `reducedMotion:'reduce'` contexts, and add a `@media (prefers-reduced-motion: reduce)` source assertion per new animated selector.

**7. `test:app-shell` is not listed as a gate for the motion slices.**
Motion polish touches shared `DimensionCard.jsx`/`AppShell.css`, which carry the focus-trap and reduced-motion source contracts in `test-app-shell.mjs`. The plan cites the benchmark trace but never names re-running the deterministic gate after each slice.
*Fix:* Make `npm run test:app-shell` a required check after every motion slice.

**8. Version assertion will rot if hardcoded.**
"Visible version" must be checked against `meta.json` programmatically, not a literal string, or it breaks on every monthly bump.
*Fix:* Read `meta.json` version in the test and assert the header matches it.

**9. CI promotion step omits the browser install.**
`npm ci` installs the Playwright package but not the Chromium binary; the later "separate browser-test job" needs `npx playwright install --with-deps chromium` plus caching.
*Fix:* Add the browser-install + cache step to the future CI job spec.

## Lower-risk notes
- `nextScheduledSourceScanAt` is already `2026-07-01`; a "July 1 monthly cycle" entry in `nextChecks` duplicates that source of truth - derive it, don't restate it.
- Plan owns server lifecycle via prose; use Playwright's `webServer` config (`command`, `port: 4173`, `reuseExistingServer`) so startup/teardown is framework-managed, eliminating the timing-flake risk the plan itself flags.

## Frozen-surface assessment
Out-of-scope list is sound and the existing `test-gpa-frozen-surface.mjs` + `coverageThrough === meta.coveragePeriod.end` cross-check (`validate-status.mjs:91`) guard the score and data surfaces well. No frozen-surface violation in the plan as written - the risk is procedural (findings 1, 7), not structural.

The plan's direction is right and the scope discipline is good, but finding #1 is a hard build-breaker the plan is unaware of, and findings #3-#6 would make the harness either fail to run or pass while missing real regressions.

VERDICT: REVISE

### Codex response

Accepted all material findings. The plan now requires `status.json` schemaVersion 2, typed `nextChecks[]`, recursive urgency scanning, base-path-aware Playwright URLs, the correct Major Projects focused button assertion, app-only Back/history checks, reduced-motion browser coverage, `test:app-shell` after motion slices, `meta.json`-driven version assertions, and explicit Chromium install details for later CI promotion.

## Round 2 - Claude

Both my Round 1 blockers and should-fix gates check out against the live code, and I've verified the revision didn't introduce new ones.

# Adversarial Re-Review (Round 2): Ambitious Evolution Phase 2

## Prior blockers - all addressed

**#1 status.json validator collision (hard build-breaker)** - Resolved. Plan step 2 now bumps to `schemaVersion: 2`, adds typed `nextChecks[]`, and updates `validate-status.mjs` *in the same commit* while keeping `watchItems`/`newSinceLastVisit`/`materialChangesCount` forbidden. Verified: `schemaVersion` is hardcoded only in `status.json` and `validate-status.mjs:67` - no hidden test asserts `=== 1`, so the bump is self-contained. `validate-status.mjs` runs under `test:data`/`prebuild`, so the same-commit constraint is real and correctly stated.

**#2 urgency scan can't reach the array** - Resolved. Plan now requires "recursively scan string fields for urgency/fake-freshness words." Matches the gap at `validate-status.mjs:114` (top-level `Object.entries` only).

**#3 preview base-path 404** - Resolved. URLs now point at `http://127.0.0.1:4173/canada-under-carney/`, base-path correct, with `?experience=classic` appended to the based URL.

**#4 deep-link focus target** - Resolved. Asserts `dim-major-projects-sources-button`, not the section id.

**#5 classic-route URL/Back** - Resolved. History/Back assertions scoped to app mode; classic driven by direct hash + visible active-state.

**#6 reduced-motion in-browser** - Resolved. Source-level `prefers-reduced-motion` check per new selector *plus* a Playwright `reducedMotion: "reduce"` run.

**#7 test:app-shell gate** - Resolved. `npm run test:app-shell` required after every motion slice. Script confirmed to exist.

**#8 version assertion** - Resolved. Read from `src/data/meta.json` (currently `5.140`), not a literal.

**#9 CI browser install** - Resolved. Future job specs `npx playwright install --with-deps chromium` + cache, kept as a separate non-blocking job.

**Lower-risk notes** - Both addressed: July 1 entry derived from `nextScheduledSourceScanAt` not restated; server lifecycle moved to Playwright `webServer`.

## New blockers
None material. Verified the surfaces the revision now leans on: `DashboardStatus.jsx` exists and consumes `status.json` (so rendering through the existing card is real, not aspirational); `meta.json` has both `version` and `coveragePeriod.end`; the `coverageThrough === meta.coveragePeriod.end` cross-check at `validate-status.mjs:91` is untouched by the schema bump.

## One non-blocking note (do not need to revise the plan)
`npm run preview` is bare `vite preview` - it serves whatever is in `dist/`. The `webServer` command must build first (e.g. `npm run build && npm run preview`) or the harness silently tests stale output. The plan already says "run against a local production build and preview," so this is an implementation reminder, not a gap in the plan.

Scope discipline holds - no grade, threshold, formula, `POCKETBOOK_DIMS`, source-stack, promise-status, or dimension-model changes; frozen surfaces untouched.

VERDICT: APPROVED
