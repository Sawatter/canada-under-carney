# Plan: dimension-drawer typography consolidation
_Locked via grill — by Claude + the editor. Revised after Codex rounds 1-3 (narrowed to the verified-visible set)._

## Goal
Fix the small set of genuinely-VISIBLE, verified typography inconsistencies inside the opened dimension detail only (`.dim-drawer`, shared DimensionCard.jsx), and replace the drawer's fragile inline-fontSize + global-attribute-hack sizing with drawer-scoped classes — using namespaced `--dim-fs-*` tokens. CSS + markup only; no frozen-surface, global-token/font/hack, shared-component, or collapsed-card change; no v5.121 / v5.122 regression.

**Honest scope note:** the original audit counted 28 size·weight·family combos, but Codex review established that most are invisible computed-style artifacts on wrapper/container elements (e.g. `.dim-evidence-item` computes 17px but its visible children are 11/13px; `.dim-verdict-kicker/note` are already 14px; the section-button 800 is a wrapper while the h3 renders 700). The genuinely user-visible inconsistencies are few — this plan fixes those and leaves the invisible computed noise alone.

## Drawer-scoped tokens (on `.dim-drawer`, NOT `:root`)
`--dim-fs-numeral:13px` (DM Mono) · `--dim-fs-label:13px` · `--dim-fs-caption:12px` · `--dim-fs-micro:11px` (non-prose badges; documented exception to the 12px prose floor). Global `:root --fs-*` untouched.

## Exact change map (verified visible) — every rule touched
**Visible CSS changes (src/index.css):**
| selector | from | to | visible? |
|---|---|---|---|
| `.dim-headline-commitment-pair dd>strong` (:625) | 15px | `--dim-fs-numeral` 13 | YES — the Target+Result numbers (covers BOTH) |
| `.dim-headline-commitment-title` (:581) | 12px | `--dim-fs-label` 13 | YES (1px) — match the Evidence-snapshot block-head |
| `.dim-source-date-kind` (:1195) | 10px | `--dim-fs-micro` 11 | YES — honors the 12px-prose floor; kills a 10px |

**Visible JSX change (DimensionCard.jsx):**
| line | element | from | to |
|---|---|---|---|
| `:94` | SourceTierBadge | inline 10px | class `dim-tier-badge` → `--dim-fs-micro` 11 (YES, visible) |

**Mechanism migration (NO visible change — same rendered px on both viewports):**
| line | element | from | new class → token | mobile |
|---|---|---|---|---|
| `:1000,:1021,:1038,:1057` | trigger source links | inline 12px | `dim-trigger-link` → `--dim-fs-caption` 12 | `@media(max-width:640px)` +1 (matches the global hack) |
| `:2612` | stage pill | inline 12px | `dim-stage-pill` → `--dim-fs-caption` 12 | `@media(max-width:640px)` +1 |
| `:1033,:1074` | trigger arrows | inline 11px | `dim-trigger-arrow` → `--dim-fs-micro` 11 | **NO override** (hack never bumped 11px) |

The global `[style*="font-size"]` hack (index.css:1662/1677) stays intact for the rest of the app.

## Out of scope (explicit)
- **Body-leak "17→14"** — DROPPED: the verdict prose is already 14px; the 17px is on invisible wrapper containers whose visible children are sized. No-op.
- **`.dim-drawer-title`** — DROPPED: base is 14px (classic/mobile), 16px only in focused desktop; not touching it avoids an unintended 14→16.
- **Section-heading 700-vs-800 weight** — DROPPED: the 800 is on the button wrapper; the visible h3 renders 700. Invisible.
- **Collapsed scorecard card** (DimensionCard.jsx 1431/1443/1463/1473) — outside `.dim-drawer`.
- **Faux-bold / 800 font import** — global + DM Mono imports only `400;500` (no real heavy weight). DEFERRED to a separate app-wide font decision. **Reverses the grill's "add the 800 face" — surface to the editor at sign-off.**
- Shared GradeChip.jsx / TrendArrow.jsx; the global hack; `:root` tokens; non-drawer surfaces; full `dim-*` migration + lint guard; color/spacing/layout; DM Serif title; all frozen surfaces.

## Key decisions & tradeoffs
- **Narrowed to verified-visible** after the audit was shown to over-count invisible computed artifacts.
- **Headline Target + Result both 15→13** (one selector, both numbers); **headline-title 12→13**; **10→11** on the two micro-labels.
- **Inline→class migration** keeps rendered sizes identical (640px +1 override only on the 12px classes; none on 11px) — pure mechanism cleanup that ends reliance on the fragile inline+global-hack path for the drawer.
- **Faux-bold deferred.**
- Pure refactor: computed styles unchanged for EVERY role except the four visible consolidations (headline value 15→13, headline-title 12→13, date-kind 10→11, tier-badge 10→11) at BOTH 1280 and 390px.

## Risks / open questions
- Font-size feeds the MEASURED sticky-head height (DimensionCard.jsx:~1197) → anchor offsets + active-section. The four visible changes are tiny but verify the full v5.121 matrix + assert anchors land below the sticky nav and sticky-head height is unchanged.
- The migrated classes must reproduce 640px sizing exactly (mobile baseline diff).
- Tiny visible deltas to confirm: headline numbers 15→13, headline-title 12→13, two micro-labels 10→11.

## Verification (before "done")
- Re-run the Playwright computed-style sweep at **1280px AND 390px**; diff vs `/tmp/typo-data.json` (desktop) + a new 390px baseline: **unchanged** for every role except the four named consolidations on both viewports.
- v5.121 matrix (Playwright): deep-link routing, mobile focus-trap fwd+reverse, Escape+restore, history Back, tracker→Promises route, classic parity — green. **Plus:** anchors land below the sticky nav; measured sticky-head height unchanged.
- Gates: `test:data`, `test:app-shell`, `lint` (0 errors), `build`.
- Screenshots desktop + mobile: verdict hero, evidence + headline commitment, a source table, an open disclosure section.
- Version bump + changelog (display-only) on ship.
