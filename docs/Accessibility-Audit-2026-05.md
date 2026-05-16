# Accessibility Audit — 2026-05 (Phase 1, code inspection)

**Scope:** Tier 1.4 audit pass per `docs/Trust-And-Bias-Resistance-Plan-2026-05.md`. Identifies WCAG AA conformance blockers without shipping fixes. Full WCAG-AA conformance is Tier 3 work.

**Method:** Code inspection of `src/components/*.jsx` and `src/constants.js` against WCAG 2.1 AA criteria. A full axe-core or Lighthouse run against the deployed site is recommended as a follow-on verification pass. This audit identifies the patterns; the tool run quantifies the violations.

**Authoritative source:** WCAG 2.1 AA (`https://www.w3.org/WAI/WCAG21/quickref/?versions=2.1&levels=aa`). The audit checks against the four principles: Perceivable, Operable, Understandable, Robust.

## Findings summary

| # | Issue | Severity | WCAG criterion | Source location |
|---|---|---|---|---|
| 1 | DimensionCard wrapper is clickable but not keyboard-operable | High | 2.1.1 Keyboard | `DimensionCard.jsx:159` |
| 2 | Grade chip color contrast unverified for C+/C-/D+ orange ranges | Medium | 1.4.3 Contrast (Minimum) | `constants.js` GRADES |
| 3 | TrendArrow uses Unicode glyphs without aria-label for screen readers | Medium | 1.1.1 Non-text content | `TrendArrow.jsx` |
| 4 | Focus management on dimension drawer not explicitly handled | Medium | 2.4.3 Focus order | `DimensionCard.jsx` drawer |
| 5 | Several inline buttons styled as divs with onClick (not focusable) | Medium | 2.1.1 Keyboard, 4.1.2 Name/Role/Value | `DimensionCard.jsx` collapsible toggles |
| 6 | No skip-to-content link | Low | 2.4.1 Bypass blocks | `Dashboard.jsx` |
| 7 | Color is the primary indicator for grade and status (no shape/text fallback for color-blind users) | Medium | 1.4.1 Use of color | `GradeChip.jsx`, status badges |

**Total: 7 findings.** 1 high-severity, 5 medium, 1 low. No critical violations (no missing alt text, no form labels missing, no inaccessible iframe content).

## Detail per finding

### 1. DimensionCard wrapper not keyboard-operable (High)

`src/components/DimensionCard.jsx:159` shows `onClick={onClick}` on the card's outer wrapper `<div>`. The whole card is clickable to expand/collapse the drawer, but the wrapper lacks:
- `tabIndex={0}` to make it focusable via keyboard
- `onKeyDown` handler for Enter/Space activation
- `role="button"` to announce its purpose to screen readers

PromiseTracker.jsx and ApprovalSignal.jsx both implement this pattern correctly (role="button" + tabIndex + onKeyDown). DimensionCard should match.

**Impact:** Keyboard-only users cannot expand dimension drawers. This is a primary interaction on the dashboard.

**Fix scope (not this commit):** Add `role="button"`, `tabIndex={0}`, `onKeyDown` handler for Enter/Space, and `aria-expanded={isExpanded}` to the wrapper div. Approximately 5-line change in `DimensionCard.jsx`.

### 2. Grade chip color contrast (Medium)

`src/constants.js` GRADES object defines color/bg pairs. WCAG AA requires:
- 4.5:1 for normal text
- 3:1 for large text (18pt+ or 14pt bold+)

Grade chips appear to be ~12-14pt text. The C-range and D-range chips use orange/red on pale yellow/pink backgrounds:
- `C+`: `#c67c00` on `#fff8e1` (orange on pale yellow)
- `C`: `#e68a00` on `#fff8e1`
- `C-`: `#ef6c00` on `#fff3e0`
- `D+`: `#d84315` on `#fbe9e7`

Material Design's color picker suggests these combinations meet AA at 18pt+ but may fail at smaller sizes. **Unverified without an axe-core run.**

**Fix scope (not this commit):** Run axe-core against the deployed site. If C+/C/C- chip contrast fails at the chip's actual rendered size, darken the foreground (e.g., C+ from #c67c00 to #b06800) or enlarge the chip text.

### 3. TrendArrow Unicode glyphs (Medium)

`TrendArrow.jsx` likely uses `▲` (U+25B2), `▬` (U+25AC), `▼` (U+25BC) per the constants in `constants.js` TREND export. Screen readers may announce these as "black up-pointing triangle" or similar, not as "improving / stable / declining."

**Fix scope (not this commit):** Add `aria-label` to the TrendArrow component matching the trend direction text. The TrendArrow component already exists; this is a single-prop addition.

### 4. Focus management on dimension drawer (Medium)

When a user clicks to expand a dimension drawer, focus does not move into the drawer. When the drawer collapses, focus does not return to the trigger. This is best-practice for disclosure widgets per WAI-ARIA Authoring Practices.

**Impact:** Mostly affects users with motor or cognitive disabilities relying on focus to track interaction state. Screen reader users may need to re-locate the drawer after expanding.

**Fix scope (not this commit):** Add focus handling on isExpanded change. Approximately 10-line change with useRef + useEffect in `DimensionCard.jsx`.

### 5. Inline button-styled divs (Medium)

Several drawer toggles in `DimensionCard.jsx` use `<div onClick={...}>` patterns at lines 441, 910, 989, 1059 etc. for sub-section toggles (glossary, triggers, perspectives, scope). These are styled to look clickable but lack the keyboard/screen-reader semantics of a real `<button>`.

The drawer sub-sections HAVE `aria-expanded` and `aria-controls` (good), but the trigger element should be a `<button>` not a `<div>` to inherit native keyboard behavior.

**Fix scope (not this commit):** Replace `<div onClick={...}>` toggles with `<button>` elements, or add `role="button" + tabIndex + onKeyDown` to the divs. The PromiseTracker pattern is the model.

### 6. No skip-to-content link (Low)

`Dashboard.jsx` does not include a "Skip to main content" link at the top of the page. WCAG 2.4.1 Bypass Blocks requires a mechanism to bypass repeated content (like the dashboard's header and tab navigation) for keyboard users.

**Impact:** Keyboard users must tab through the header on every page load.

**Fix scope (not this commit):** Add a `<a href="#main">Skip to main content</a>` element at the top of Dashboard.jsx, visually hidden but visible on focus. Approximately 15-line CSS + JSX change.

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

**Phase 2 (separate commit, requires explicit approval):** Ship fixes for findings 1, 3, 4, 5 in DimensionCard.jsx. Single commit, scoped to keyboard / screen-reader semantics. Estimated 30-60 min of work.

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
