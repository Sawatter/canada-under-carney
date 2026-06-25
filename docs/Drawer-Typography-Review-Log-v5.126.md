# Plan Review Log: dimension-drawer typography consolidation
Act 1 (grill) complete — plan locked with the editor. MAX_ROUNDS=5. PLAN_FILE=PLAN-TYPOGRAPHY.md.

Grill resolutions:
- Scope = B (tokens + only the affected roles), flagged as the contestable call for Codex.
- Faux-bold = add the real DM Sans/Mono 800 face to the @import.
- Headline-commitment Result value = demote 15→13px (unify metric values).
- 10px → 11px (honor the documented Lighthouse floor); verdict-hero secondary prose 17→14 (16px status line stays the lead).
- Verification = computed-style before/after diff vs /tmp/typo-data.json + the v5.121 focus/deep-link/history matrix + deterministic gates.

## Round 1 — Codex — VERDICT: REVISE
11 findings, code-verified. The crux: "Scope B" wasn't actually drawer-scoped. ACCEPTED essentially all:
- **#1** `--fs-body` already = global 16px (index.css:15) → use namespaced `--dim-fs-*` tokens, never redefine global `--fs-*`.
- **#2** the mobile `[style*="font-size"]` hack (index.css:1677) is GLOBAL (bumps every inline size in Dashboard/Methodology/About/PromiseTracker) → keep it; don't delete.
- **#3** moving inline sizes to classes drops the +1px mobile bump → new classes need explicit mobile overrides + a MOBILE computed-style baseline, not just the desktop one.
- **#4** GradeChip/TrendArrow are shared (ScoreboardHeader/CompareView/WhatsChanged) → leave them out of this drawer-scoped pass.
- **#5** `.dim-source-table-link` 12-vs-14 is INTENTIONAL responsive (desktop-dense table vs mobile-readable card), not an accident → preserve it (split/override), don't flatten.
- **#6** headline `dd>strong` 15px covers BOTH Target and Result → state both shrink to 13.
- **#7** `--dim-fs-micro:11px` doesn't honor the documented 12px floor → make it a documented non-prose badge exception (prose ≥12; badges floor 11; kill 10).
- **#8** the 800 @import is GLOBAL and DM Mono imports only 400;500 (no heavy weight on Google) → the faux-bold fix is global + partly impossible for mono. **DEFER** it as a separate app-wide decision (reverses the grill's "add 800 face" — flag to the editor at sign-off).
- **#9** the `dim-focused-detail-root` override (index.css:1420) beats a base token if left raw 16px → delete/convert it when the base moves to the token.
- **#10** font-size feeds the MEASURED sticky-head height (DimensionCard.jsx:1197) → anchor offsets + active-section; not purely visual → keep the full matrix + assert anchors land below the sticky nav + sticky-head height stable.
- **#11** (meta) the plan as written = C, not B → re-scope to genuinely drawer-only.
Rewrote PLAN-TYPOGRAPHY.md to a truly drawer-scoped change. Re-submitting.

## Round 2 — Codex — VERDICT: REVISE
Round-1 fixes confirmed. 5 new blockers; ACCEPTED all:
- **#1/#3/#4** the inline sizes at DimensionCard.jsx 1431/1443/1463/1473 are the COLLAPSED CARD (scorecard tile), OUTSIDE `.dim-drawer` — tokens defined on `.dim-drawer` can't reach them, my sweep never measured them, and routing the collapsed-card was-X through `.dim-previous-grade-note` would also change color/casing/spacing. → DESCOPE the collapsed card entirely; migrate only the drawer's own inline sizes (94, 1000/1021/1033/1038/1057/1074, 2612); drop the was-X dedup.
- **#2** the global hack's mobile bump is `max-width:640px` (index.css:1662), not 767px → use 640px for the hack-equivalent overrides so 641-767px is unchanged.
- **#5** the role table wasn't backed by concrete selectors → replace with an EXACT selector→token map enumerating every raw-px rule changed; keep the change a bounded, named list, not a broad role sweep.
Rewrote PLAN-TYPOGRAPHY.md: collapsed card out, 640px, enumerated selector map. Re-submitting.

## Round 3 — Codex — VERDICT: REVISE
Scope settled; 4 remaining are factual-accuracy of the change map. Verified each against the actual CSS — Codex right on all:
- **#3 (key)** `.dim-verdict-kicker`/`note` are ALREADY 14px (index.css:404/417); `.dim-evidence-item` (17px) and `.dim-headline-commitment-links` (17px) are CONTAINERS whose visible children are explicitly sized (11/13/12px) → the "17px body leak" is invisible no-ops. The audit over-counted computed-style artifacts as visible inconsistencies. → DROP the body-leak fix.
- **#1** base `.dim-drawer-title` is 14px (classic/mobile), 16px only in focused desktop; changing the base would be an unlisted 14→16 → DROP drawer-title (leave as-is).
- **#2** the global hack only bumps 12-16px inline values, NOT 10/11px → the 640px +1 override must apply ONLY to migrated 12px classes (trigger-link, stage-pill), not the 11px ones (tier-badge, arrow).
- **#4** make the changed-only diff list match actual baseline roles or verification reports false misses.
Also confirmed `.dim-section-button` 800 is a wrapper weight (h3 child renders 700) → likely invisible → DROP the section-heading weight fix.
NARROWED the plan to only the verified-VISIBLE fixes (headline value 15→13, headline-title 12→13, date-kind 10→11, tier-badge 10→11) + the no-visible-change inline→class migration. Re-submitting.

## Round 4 — Codex — VERDICT: APPROVED
"The round-3 scope now matches the code: collapsed card, drawer title, body leaks, section wrapper weight, shared components, global tokens, global hack, and font import are all out of scope. The remaining four visible deltas are real and bounded, and the inline-to-class migrations preserve the existing mobile behavior, including no override for 11px arrows. No material blockers found."

**CONVERGED after Act 1 grill + 4 Codex rounds (REVISE×3 → APPROVED). Implementation gated on editor sign-off. Faux-bold deferral reverses the grill answer — flag to the editor.**
