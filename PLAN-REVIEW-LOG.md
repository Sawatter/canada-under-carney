# Plan Review Log: Native-app-shell visual refresh + dark mode (v5.134 + v5.135)
Act 1 (grill) skipped — headless per editor request; work already complete in working tree. MAX_ROUNDS=5.
Plan locked at PLAN.md; Codex reviews the plan + the actual implementation (read-only).

## Round 1 — Codex
**Findings**
- High: Light mode is not unchanged. The diff changes visible light-mode card shadows/borders/radius in ScoreboardHeader.jsx, DimensionCard.jsx, and the header kicker color in Dashboard.jsx. Fix: roll these out of the dark-mode patch or remove the "light unchanged" constraint with explicit approval.
- High: Dark-mode filled controls fail WCAG AA. `--app-accent: #4f9e7e` is behind white text in active tabs, bottom nav, clear buttons (~3.22:1). Fix: split filled-control accent from decorative accent; use a darker filled token or dark text.
- High: Promise status UI stays as light STATUS_COLORS pills/buttons inside dark panels (`.app-promise-status` inline bg; count buttons use `--status-bg`; dark rule only retints borders). Fix: add dark presentation rules without changing STATUS_COLORS.
- Medium: Source tier badges 1 and 2 missed by dark mode (only tier-3 overridden). Fix: add dark overrides for tier 1 and 2.
- Medium: dark `.dim-section-button { border-color }` flattens the semantic left rails (generic border-color overrides all sides; follow-up rules only set background). Fix: reassert dark `border-left-color` per disclosure type.
- Medium: reduced-motion misses new press transforms (`.theme-toggle:active`, `.dim-drawer-close:active`). Fix: include them in the reduced-motion transform reset.
- Medium: theme persistence stops following OS after first load (React writes localStorage on mount, locking the OS-derived default; storage failure forces light). Fix: validate saved values, separate storage reads from matchMedia, save only on user toggle.

No frozen-surface diff in src/constants.js or src/utils.js. Simpler path suggested: explicit theme-aware classes/tokens for status/tier/stage/disclosure UI, attribute selectors only as fallback.

VERDICT: REVISE

### Claude's response (round 1 — final arbiter)
Accepted (acting on):
- #2 WCAG AA fail (white on `#4f9e7e` = 3.22:1, verified). Split: keep `--app-accent` `#4f9e7e` for text/decorative, add `--app-accent-fill` `#2c7d5b` (white = 5.01:1) for the white-text filled controls (active tab, active bottom-nav, clear-filters).
- #5 dark section-button left rails flattened — contradicts my own "keep wayfinding colours" call. Reasserting brightened `border-left-color` per disclosure variant in dark.
- #6 reduced-motion — adding `.theme-toggle:active` / `.dim-drawer-close:active` to the transform reset.
- #7 theme persistence — init script defaults to OS then overrides with a VALIDATED saved value (matchMedia + storage in separate try blocks); Dashboard writes localStorage ONLY on user toggle (removed the mount effect).
- #4 tier-1/tier-2 summary chips — adding dark overrides for parity with tier-3.
- #3 (partial) — toning the resting `.app-promise-counts button` bg to a dark status-tint via color-mix; STATUS_COLORS unchanged.

Rejected / clarified (with reason):
- #1 "light not unchanged": the changed light-mode shadows/borders/radius (Phase 1 elevation) and kicker recolour (Phase 6) are INTENTIONAL, user-approved visible improvements. The "byte-for-byte unchanged" guarantee applies to the dark-mode + colour-token MECHANICS (phases 6-7), not the whole pass. Fixing PLAN.md wording rather than reverting approved work.
- #3 (partial) the small `.app-promise-status` row pills stay bright — deliberate carve-out, consistent with grade/source/stage chips; small, self-contained, readable. Documented, not changed.

## Round 2 — Codex
**Findings**
- High: the revised dark `.app-promise-counts button` still fails contrast — I toned the background but left `color: var(--status-color)` (AppShell.css:195), so inactive status text on the dark-tinted bg is ~1.34–2.73:1. Fix: also set a bright status text color in dark (per-status or a `--status-text-dark`).
- Low: PLAN.md still describes the old persistence ("useEffect syncs attribute + localStorage") though the code now writes only in toggleTheme. Fix: update the bullet.

Round-1 status: #1 clarified, #2/#4/#5/#6/#7 addressed in code; #3 materially incomplete (the count filter buttons are unreadable in dark).

VERDICT: REVISE

### Claude's response (round 2 — final arbiter)
Both accepted:
- Count-button text: added `color: color-mix(in srgb, var(--status-color) 48%, #fff)` to the dark resting `.app-promise-counts button` (lightens the status hue toward white for contrast on the dark-tinted bg; STATUS_COLORS untouched). Verified the rendered inactive buttons in the browser. Pressed `[aria-pressed]` keeps the full status-colour fill + white text (authentic selected state, like the chip carve-out).
- PLAN.md persistence bullet updated to describe the toggle-only write (no mount effect).

## Round 3 — Codex
No material findings. Both round-2 issues resolved: PLAN.md persistence description accurate; dark inactive `.app-promise-counts button` now sets darkened bg + brightened status text (Codex recomputed all seven STATUS_COLORS: inactive 5.71–6.72:1, pressed white-on-status ≥5.23:1). STATUS_COLORS unchanged; active-state keeps white text. No new material blocker.

VERDICT: APPROVED

## Resolution — CONVERGED at round 3 (cap was 5)
The review was run on already-implemented work; it drove 8 real fixes across 2 revision rounds before Codex approved:
1. **WCAG AA**: dark filled-control accent split (`--app-accent-fill #2c7d5b`, white text 5.01:1) + count-button status text brightened (5.8–6.7:1). Both were failing (3.22:1 / 1.3–2.7:1).
2. **Correctness**: theme persistence rewritten so an OS-derived default keeps following the OS (was locked in on mount); section-button semantic left rails reasserted in dark (generic border-color had flattened them).
3. **Coverage/polish**: reduced-motion now covers the toggle + close press; tier-1/2 summary chips toned for dark; PLAN.md "light unchanged" wording corrected.

Frozen surfaces confirmed untouched by Codex both rounds (no diff in `src/utils.js` / `src/constants.js`; GPA frozen-surface test still passes). Code was NOT written speculatively during the review — these were fixes to the existing implementation, each logged above with Claude as final arbiter.

## Round 4 — Codex (post-approval follow-up)
During final verification I found a real bug in the (already-approved) theme code: side effects inside the `setState` updater let `data-theme` and React state drift under batched/StrictMode double-invocation. I rewrote it as a `useEffect` syncing the attribute + a mount-ref guard for persistence, and asked Codex to validate.
**Finding** — Medium: the mount-ref guard is still not StrictMode-proof — the dev effect-replay runs setup twice on mount; the second run sees the ref already true and writes `ccc-theme` without a user toggle, defeating the no-lock-in guarantee. `index.html` confirmed correct. VERDICT: REVISE.
### Claude's response (round 4)
Accepted. Replaced the mount-ref with an explicit `userToggledThemeRef` set inside `toggleTheme`; the effect always syncs `data-theme` from state but persists ONLY when that ref is true — so neither initial mount nor StrictMode's replay writes localStorage, while user toggles always do. PLAN.md updated.

## Round 5 — Codex (final)
No material findings. The StrictMode concern is resolved: `userToggledThemeRef` starts false; initial mount + StrictMode replay only sync `data-theme` and do not persist; `toggleTheme` sets the ref before the flip, and the `[theme]` effect is the single place that syncs the attribute and persists an explicit choice. `index.html` validated-saved / OS-fallback / storage-failure handling confirmed clean.

VERDICT: APPROVED

## FINAL RESOLUTION — APPROVED at round 5 (cap = 5)
First convergence at round 3; rounds 4-5 hardened a desync bug Claude found during its own verification (not raised by Codex). Total: 9 real fixes, all logged, Claude final arbiter throughout, Codex read-only every round.
- WCAG AA: split dark filled-control accent (`--app-accent-fill`, 5.01:1) + brightened count-button status text (5.8–6.7:1). Both were failing (3.22:1 / 1.3–2.7:1).
- Correctness: theme persistence rewritten twice to its final StrictMode-safe form (user-toggle ref gates persistence; effect syncs attribute idempotently, killing an attr/state desync); section-button semantic left rails reasserted in dark.
- Coverage/polish: reduced-motion now covers toggle + close press; tier-1/2 chips toned; PLAN.md wording corrected twice.
Frozen surfaces untouched (Codex confirmed no diff in src/utils.js / src/constants.js across all rounds; GPA frozen-surface test passes). No code written speculatively — every change was a fix to the existing, already-built implementation.
