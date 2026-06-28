# Plan: Native-app-shell visual refresh + dark mode (v5.134 + v5.135)
_Reviewed via grill-me-codex (Act 2 only — headless, work already complete in working tree, not pushed)_

## Goal
Make the Canada Under Carney dashboard (React 19 + Vite SPA, deploys to GitHub Pages from `main`) feel like a calm native app shell: real surface elevation, a standard icon close control, tactile micro-interactions, smoother drawer motion, and a properly-designed (non-inverted) dark theme.

Constraints:
- **Phases 1-4 + the kicker recolour are intentional, user-approved VISIBLE light-mode changes** (cards now lift off the page, the kicker is no longer fail-grade red). These deliberately change light mode.
- **The dark-mode + colour-token MECHANICS (phases 6-7) must leave light mode byte-for-byte unchanged** — every dark rule is `[data-theme="dark"]`-scoped, and the `perl` colour-token swaps map to the exact prior hex values. (Clarified after Codex round 1 flagged the blanket "light unchanged" wording as overbroad.)
- **Frozen surfaces** (GPA formulas/weights in `src/utils.js`, grade-point mappings + `STATUS_COLORS`/`GRADES` colour values in `src/constants.js`, thresholds, the 11-graded+1-tracker model) must not be touched.
- Non-partisan-by-construction: no accent may read as a party colour.

Shipped as two version bumps already present in the working tree.

## Approach (what was actually built)
1. **Surface/elevation token foundation** (`src/index.css :root`): repurposed the previously-unused `--card-*` tokens into a semantic layer — `--surface-page/card/card-tracker/raised/modal/sunken`, `--border-subtle/strong/tracker`, `--accent-tracker`, `--shadow-card/raised/modal`. Wired `ScoreboardHeader.jsx` `cardBase` and `DimensionCard.jsx` computed surface (JS inline styles can reference `var(--…)`) to consume them. Reconciled dimension-card radius 8→12px to match the scoreboard. Shadows use the app's existing green-charcoal `rgba(32,52,44,…)`.
2. **Close control** (`DimensionCard.jsx` + `index.css .dim-drawer-close`): replaced the solid-black `× Close` text pill (v5.132) with an SVG-X icon button — icon + "Close" label on desktop, 44px icon-only circle on mobile (`.dim-drawer-close-label` hidden under the 767px drawer media query). Kept `aria-label`, `:focus-visible` ring, `e.stopPropagation()`.
3. **Micro-interactions**: hover-lift (`@media (hover:hover)`) + `:active` press on `.dimension-card-root` (uses `:has(.dim-card-header-button:active)`), `.dim-section-button`, `.dashboard-tab`, `.app-bottom-nav button`. Card-root inline `transition` extended to include `transform`. All transforms disabled in both `prefers-reduced-motion` blocks (index.css + AppShell.css).
4. **Drawer motion**: desktop focused-detail fade+rise entrance (`@keyframes dimFocusIn`, 200ms); mobile `dimDialogIn` retuned 280→220ms; both in the reduced-motion blocks. Fixed a pre-existing desktop occlusion: the sticky page tab rail now hides via `.app-shell:has(.desktop-focused-detail-wrap) .dashboard-tabs-wrap { display:none }` while a dimension is open, so the drawer's title+close header owns the top and the close stays reachable on scroll.
5. **Spacing/type (safe subset only)**: tokenized a few inline gaps/margins (`var(--space-*)`) that the 640px hack does NOT key on (it matches only `padding:`/`font-size:` inline substrings). Deliberately did NOT do the inline-px→token sweep or rebuild the 640px attribute-selector font hack.
6. **Colour reconciliation**: added `--accent`/`--accent-strong`/`--focus-ring`; `perl`-tokenized `#1565c0`→`var(--accent)` and `#1a73e8`→`var(--focus-ring)` across `index.css` and `AppShell.css` (same values → light unchanged), guarding the token-definition lines. Recoloured the header kicker `#c62828`→`#8a4f12` (it shared the D/fail-grade red); gave it `.dashboard-kicker`.
7. **Dark mode** (the big one):
   - **No-flash init**: a `<script>` in `index.html` sets `data-theme` on `<html>` pre-paint from `localStorage["ccc-theme"]` else `prefers-color-scheme`. Toggle (sun/moon SVG) top-left in the header, state in `Dashboard.jsx` (`useState` seeded from the attribute; a `useEffect` keeps `data-theme` in lockstep with state — idempotent, so attribute and state can never drift — and writes `localStorage` only when the change came from an explicit user toggle (a `userToggledThemeRef` set in `toggleTheme`), never on mount, so an OS-derived default is not locked in and keeps following the OS until the user toggles. Gating on the user-toggle ref (not "after first effect run") stays correct under StrictMode's dev double-invocation of effects). `color-scheme: dark` on the root gives native dark form controls.
   - **Token flip**: a `[data-theme="dark"]` block at the bottom of `index.css` overrides every semantic token + the `--app-*` token block, plus explicit dark values for the hardcoded app-shell chrome (gradient bg, header banner, sticky rail, bottom nav, promise filters).
   - **Inline-colour flip**: React serialises inline hex to `rgb()` in the DOM `style` attribute (verified empirically: `#444`→`rgb(68, 68, 68)`; px values stay literal — which is why the existing 640px font hack uses px). So inline neutral text/background colours are flipped with `[data-theme="dark"] [style*="color: rgb(r, g, b)"]` / `[style*="background: rgb(...)"]` selectors — the same attribute-selector technique the 640px hack already uses, scoped to dark so light is untouched. CSS-rule text greys in `index.css` were `perl`-tokenized to `var(--text-*)` so they flip too.
   - **Grade chips stay frozen**: `GradeChip` got a `.grade-chip` class; all grade-colour flips carry `:not(.grade-chip)`, so the frozen grade colours render authentically as bright light pills on dark. Decorative grade-colour text (rubric range headings, trend arrows, "was X", net caption) IS brightened for contrast.
   - **Coverage**: a parallel source-audit (8 agents) enumerated ~60 light-surface stragglers; all were given dark overrides and re-verified visually across all 5 views at desktop + mobile.

## Key decisions & tradeoffs (the contestable choices — bite here)
- **Attribute-selector `[style*="rgb()"]` flips for inline colours** instead of migrating ~250 inline hex literals to tokens. Rationale: zero light-mode risk on a live site, mirrors the repo's own established pattern. Tradeoff: brittle to exact serialized strings; a missed/oddly-serialized value silently stays light; a future inline-style edit can fall out of coverage. Accepted because the alternative (the inline→token migration) is the known-deferred high-risk refactor.
- **Grade chips left as bright light pills on dark** (via `:not(.grade-chip)`) rather than dark-tinted chips. Keeps frozen grade colours exact; a regression where broad flips first broke the C-/A- chips was caught and fixed with the exclusion.
- **Brightening decorative grade-colour TEXT in dark** (e.g. `rgb(198,40,40)`→`#f0736f`, greens→`#54c06f`, ambers→`#d4a437`). This presents grade colours differently in dark mode — arguably touches "grade colours". Defence: chips (the canonical representation) are untouched; this is contrast-only presentation in dark; light mode unchanged; constants.js values unchanged.
- **Hiding the page tab rail during a desktop dimension takeover** (`:has()`), rather than re-stacking sticky z-indexes. Removes the occlusion but means top-level nav is unavailable until the dimension is closed.
- **Header kicker recolour `#c62828`→`#8a4f12`** — a visible brand change, chosen to de-collide from fail-grade red.
- **Deferred** the inline-px spacing sweep + 640px-hack rebuild (high regression risk, low payoff).
- **Section-header semantic colours kept** (wayfinding) rather than flattened.

## Risks / open questions
- `:has()` and `@media (hover:hover)` browser support (modern only — acceptable for this audience?).
- Attribute-selector flips depend on exact rgb serialization; any inline style whose colour isn't in the enumerated list stays light in dark mode (the audit found ~60; could be a long tail).
- `border-color` on a flipped element sets all four sides — could over-tone an element that has both a grey full-border and a coloured side-border (judged rare).
- Two parallel CSS files (`index.css` base + `AppShell.css` app-experience) and two experiences (`?experience=classic` fallback); dark rules were authored against the live app experience.
- `prefers-reduced-motion` coverage for the new `dimFocusIn`/hover/press — claimed complete; worth an independent check.

## Out of scope
- The inline-px→token spacing migration and 640px-hack rebuild.
- Any change to GPA math, grade-point mappings, thresholds, `POCKETBOOK_DIMS`, the dimension model, or `STATUS_COLORS`/`GRADES` colour values.
- Flattening section-header colours.
- Committing/pushing (left in the working tree for the editor).
