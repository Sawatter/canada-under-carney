# Accessibility Audit — 2026-05 (Phase 1, code inspection)

**Scope:** Tier 1.4 audit pass per `docs/Trust-And-Bias-Resistance-Plan-2026-05.md`. Identifies WCAG AA conformance blockers without shipping fixes. Full WCAG-AA conformance is Tier 3 work.

**Method:** Code inspection of `src/components/*.jsx` and `src/constants.js` against WCAG 2.1 AA criteria. A full axe-core or Lighthouse run against the deployed site is recommended as a follow-on verification pass. This audit identifies the patterns; the tool run quantifies the violations.

**Authoritative source:** WCAG 2.1 AA (`https://www.w3.org/WAI/WCAG21/quickref/?versions=2.1&levels=aa`). The audit checks against the four principles: Perceivable, Operable, Understandable, Robust.

## Findings summary

| # | Issue | Severity | WCAG criterion | Source location |
|---|---|---|---|---|
| 1 | DimensionCard wrapper was clickable but not keyboard-operable | Resolved in v5.40 | 2.1.1 Keyboard | `DimensionCard.jsx:159` |
| 2 | Grade chip color contrast unverified for C+/C-/D+ orange ranges | Resolved in v5.41 | 1.4.3 Contrast (Minimum) | `constants.js` GRADES |
| 3 | TrendArrow Unicode glyphs need aria-labels | Resolved before v5.38 | 1.1.1 Non-text content | `TrendArrow.jsx` |
| 4 | Focus management on dimension drawer not explicitly handled | Clarified in v5.41 (no code fix needed per WAI-ARIA disclosure pattern) | 2.4.3 Focus order | `DimensionCard.jsx` drawer |
| 5 | Several inline disclosure controls styled as divs with onClick | Resolved before v5.38 | 2.1.1 Keyboard, 4.1.2 Name/Role/Value | `DimensionCard.jsx` collapsible toggles |
| 6 | No skip-to-content link | Resolved in v5.41 | 2.4.1 Bypass blocks | `Dashboard.jsx` |
| 7 | Color is the primary indicator for grade and status (with text fallback present) | Informational | 1.4.1 Use of color | `GradeChip.jsx`, status badges |

**Current open findings after v5.41:** All actionable items resolved. Finding 7 (color as primary indicator) remains informational, partially mitigated by letter grades and text labels on status badges. No high-severity findings, no critical violations.

## Detail per finding

### 1. DimensionCard wrapper not keyboard-operable (Resolved in v5.40)

`src/components/DimensionCard.jsx:159` shows `onClick={onClick}` on the card's outer wrapper `<div>`. The whole card is clickable to expand/collapse the drawer, but the wrapper lacks:
- `tabIndex={0}` to make it focusable via keyboard
- `onKeyDown` handler for Enter/Space activation
- `role="button"` to announce its purpose to screen readers

PromiseTracker.jsx and ApprovalSignal.jsx both implement this pattern correctly (role="button" + tabIndex + onKeyDown). DimensionCard should match.

**Impact:** Keyboard-only users cannot expand dimension drawers. This is a primary interaction on the dashboard.

**Resolution:** v5.40 added `role="button"`, `tabIndex={0}`, `aria-expanded`, an explicit accessible label, and an Enter / Space keyboard handler on the wrapper. The handler only fires when focus is on the wrapper itself, so nested drawer buttons keep their own keyboard behavior.

### 2. Grade chip color contrast (Resolved in v5.41)

Computed WCAG contrast ratios in v5.41 found 7 of 12 grade chips failed AA normal-text (4.5:1): B+ (3.78), B (2.93), B- (2.31), C+ (3.15), C (2.47), C- (2.81), and D+ (3.78). A, A-, D, D-, and F passed.

**Resolution:** v5.41 darkened the failing foreground colors in `src/constants.js` GRADES. New palette and ratios (all verified ≥4.5:1):
- A: `#1a7a3a` (4.80:1) — unchanged
- A-: `#2e7d32` (4.56:1) — unchanged
- B+: `#3f6e24` (5.58:1) — was `#558b2f`
- B: `#3a6822` (6.08:1) — was `#689f38`
- B-: `#33621e` (6.66:1) — was `#7cb342`
- C+: `#9a6300` (4.75:1) — was `#c67c00`
- C: `#8d5a00` (5.50:1) — was `#e68a00`
- C-: `#9a4d00` (5.57:1) — was `#ef6c00`
- D+: `#a52c0c` (6.04:1) — was `#d84315`
- D: `#c62828` (4.92:1) — unchanged
- D-: `#b71c1c` (5.75:1) — unchanged
- F: `#880e0e` (7.05:1) — unchanged

Color hierarchy (green → yellow-green → orange → red) preserved. GPA values unchanged (grade math is a frozen surface; color is a visual styling field). The computation script is reproducible: it converts hex to sRGB, applies the WCAG relative-luminance formula, and computes `(L1+0.05)/(L2+0.05)`. A full axe-core run against the deployed site is still recommended as a third-party verification but not required for this finding.

### 3. TrendArrow Unicode glyphs (Resolved before v5.38)

`TrendArrow.jsx` uses `▲` (U+25B2), `▬` (U+25AC), `▼` (U+25BC) per the constants in `constants.js` TREND export. Screen readers may announce these as "black up-pointing triangle" or similar, not as "improving / stable / declining."

**Resolution:** code inspection after the audit found this was already fixed. `TrendArrow.jsx` renders `role="img"`, `aria-label={\`Trend: ${label}\`}`, and a matching `title`. This finding remains in the audit history as a stale-code-inspection catch, not an open issue.

### 4. Focus management on dimension drawer (Clarified in v5.41 — no code fix needed)

The original audit finding assumed focus should move into the drawer on expand and return to the trigger on collapse. On closer reading of the WAI-ARIA Authoring Practices for the Disclosure (Show/Hide) pattern, that assumption was incorrect for this widget type.

**WAI-ARIA Authoring Practices guidance for disclosure widgets:** when a disclosure widget is collapsed and the user activates the trigger (via Enter, Space, or click), the widget expands and focus stays on the trigger. When the widget is expanded and the user activates the trigger, the widget collapses and focus stays on the trigger. Focus does NOT move into the disclosed content automatically. The user can tab forward to enter the content if desired.

**Current DimensionCard behavior (after v5.40's keyboard fix):** matches the WAI-ARIA disclosure pattern exactly. User tabs to the DimensionCard wrapper, focus on wrapper. Pressing Enter or Space toggles isExpanded and focus stays on the wrapper. Pressing Enter or Space again collapses, focus still on the wrapper. Tab forward enters the drawer content.

**Resolution:** No code change is needed. The original finding was based on an incorrect assumption about the spec's requirements for this widget type. The current behavior is correct per WAI-ARIA Authoring Practices (`https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/`). This finding stays in the audit history as a clarification, not an open issue.

### 5. Inline button-styled divs (Resolved before v5.38)

The initial code-inspection note flagged several drawer toggles in `DimensionCard.jsx` as possible `<div onClick={...}>` patterns. A follow-up read found the relevant glossary, trigger, perspectives, scope, inherited, and cohort-list toggles are now real `<button>` elements.

The drawer sub-sections HAVE `aria-expanded` and `aria-controls` (good), but the trigger element should be a `<button>` not a `<div>` to inherit native keyboard behavior.

**Resolution:** no additional fix is needed for these drawer sub-section toggles. Keep this pattern in future components: use `<button>` for disclosure controls rather than `div` + `onClick`.

### 6. No skip-to-content link (Resolved in v5.41)

`Dashboard.jsx` now includes a "Skip to main content" link at the top of the page, immediately inside the outer wrapper. The link targets `#main-content`, a `tabIndex={-1}` anchor positioned just before the scoreboard row.

**Implementation:** The link is visually hidden by default (positioned off-screen via `left: -9999px`) and becomes visible on focus, positioned at the top-left of the viewport with a blue background. This is the standard "visible-on-focus" skip-link pattern. WCAG 2.4.1 Bypass Blocks is satisfied: keyboard users can bypass the header and tab navigation by activating the skip link on first tab.

### 7. Color as primary indicator (Medium)

GradeChip and status badges use color as the primary distinguishing feature. While the GradeChip also contains the letter grade text (A, B, C, etc.), color-blind users can still parse the grade itself, so this is partial mitigation.

Status badges (`STATUS_COLORS` in constants.js) include text labels with each color (e.g., "✓ Delivered", "⊘ Stalled"). This is good — the symbol + text plus the color makes the status legible without relying solely on color.

**Impact:** Mostly low because letter grades and status labels are also textual. WCAG 1.4.1 specifically requires color not be the ONLY indicator.

**Verification:** No fix needed for status badges (they already have text labels). Grade chips include the letter, so they're acceptable. **This finding stays informational** rather than actionable.

## What the audit confirmed as good

- Drawer sub-section toggles in DimensionCard have `aria-expanded` and `aria-controls`. The disclosure pattern is mostly correct.
- PromiseTracker.jsx implements role="button" + tabIndex + onKeyDown correctly.
- ApprovalSignal.jsx implements onKeyDown correctly.
- ScoreboardHeader.jsx has aria-expanded + aria-controls.
- Status badges include text labels alongside color.
- Headings appear to use semantic levels (h2, h3) in document order.
- No inaccessible iframe content.
- No missing form labels (the dashboard has no traditional forms beyond Buttondown signup).

## Recommended next moves

**Phase 1 (this commit):** Audit complete. Doc published.

**Phase 2 (partly complete):** v5.40 shipped finding 1, the high-severity keyboard blocker. Findings 3 and 5 were already resolved by current code. Finding 4 (focus management) remains a candidate follow-up if keyboard / screen-reader testing shows focus recovery is confusing.

**Phase 3 (deferred to Tier 3):** Full WCAG-AA conformance pass:
- Run axe-core or Lighthouse against the deployed site to quantify contrast violations (finding 2).
- Ship contrast adjustments if any chip fails AA at rendered size.
- Add skip-to-content link (finding 6).
- Publish a public `docs/Accessibility-Statement.md` for the dashboard.

## Limits of this audit

- Code inspection cannot quantify contrast ratios. Run axe-core for that.
- Code inspection cannot detect runtime focus-trap or focus-restore failures. Manual keyboard testing required.
- This audit does NOT include screen reader testing (NVDA, JAWS, VoiceOver). That's manual user-testing work.
- This audit does NOT include the deployed-page assertions of `Lighthouse` accessibility category. Run that separately.

## Coverage

This audit applies to the React SPA at `src/components/*.jsx` as of commit before v5.38. Future component additions need their own a11y review.

## Version history

- **v1.0 (2026-05-16):** Initial code-inspection audit. 7 findings (1 high, 5 medium, 1 informational). No fixes shipped; this is the audit pass only.
- **v1.1 (2026-05-16):** Reconciled after v5.40. DimensionCard keyboard blocker fixed; TrendArrow and drawer-toggle findings reclassified as already resolved by current code. Remaining actionable items: contrast verification, drawer focus management, skip-to-content link.
