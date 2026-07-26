# Mobile Readability Release

**Status:** Release candidate; local gates passed, publication pending<br>
**Prepared:** 2026-07-26<br>
**Comparison baseline:** live v5.167<br>
**Frozen surfaces:** no grade, threshold, formula, weight, modifier, promise
status, source stack, trigger, or dimension-model change

## Reader Signal

The change responds to one concrete mobile-reader report:

> It is a little small without my glasses but zoom in works perfectly.

The report identifies two different facts. Browser zoom remains available and
works, but the default first-look presentation asks readers to start from text
that is too small for comfortable scanning.

## Verified Mechanism

Direct production inspection at `375 x 812` found 50 visible direct-text
elements in the first-look area. Forty-five rendered at 12 pixels or smaller,
36 rendered below 12 pixels, and 10 rendered at 9 pixels. The smallest text
included release metadata, the three grade-boundary explanations, and the
three secondary-signal descriptions.

The later mobile rules in `src/components/AppShell.css` caused the regression.
They overrode the earlier mobile type bump with fixed 9, 10, and 11-pixel
values while preserving three columns for both the grade boundary and
secondary signals.

Sampled foreground and background combinations passed the WCAG AA contrast
ratio for ordinary text. The problem is default reading size and density, not
the sampled colour contrast. WCAG does not set one universal minimum font
size, but it does require text resizing and reflow without losing content or
functionality:

- [Understanding Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text)
- [Understanding Reflow](https://www.w3.org/WAI/WCAG21/Understanding/reflow)
- [Providing controls on the Web page that incrementally change the size of all text](https://www.w3.org/WAI/WCAG22/Techniques/general/G178)

## Product Decision

v5.168 makes a bounded first-look readability change:

- reserve the 12-pixel-equivalent tier for short labels and metadata;
- use at least a 14-pixel-equivalent tier for explanations and actions;
- use a 16-pixel-equivalent tier for mobile secondary-signal titles;
- keep grades and other primary metrics visibly larger;
- replace the mobile three-column grade boundary with full-width rows;
- replace the three narrow mobile secondary-signal cards with full-width
  stacked cards; and
- let narrow-phone content use normal vertical scrolling instead of shrinking
  the briefing to fit above the fixed navigation.

No on-page text-size control is part of this release. A useful control would
need shared type tokens across the complete shell so it changes the whole
reading experience rather than compensating for one dense section. Browser
zoom remains available.

## Acceptance Contract

The mobile gate now checks the first-look surface at `320 x 568`, `375 x 812`,
and `390 x 844`. The result must remain visually dominant, text must meet the
defined practical floors, cards and boundary rows must use the available
width, and the document must not scroll horizontally.

The entire briefing no longer has to finish in the initial phone viewport.
Instead, each action must be reachable through normal vertical scrolling and
must be able to sit fully above the fixed bottom navigation. Initially visible
controls must not be covered.

A separate 200% text-resize check must retain the content, reflow without
two-dimensional scrolling, and keep the first-look controls reachable and
unclipped. Desktop `1280 x 900`, dark theme, reduced motion, and Chromium
forced-colors coverage remain in the release gate.

## Review Record

Three file-disjoint implementation agents covered mobile CSS, browser
regressions, and release metadata. A specification reviewer approved the
integrated candidate.

The first Standards review returned `REVISE` for a scroll-reset race in the
new browser test, incomplete shell coverage at 200% text size, and stale
roadmap wording. All three findings were corrected. The second Standards
review returned `APPROVED`.

Claude's read-only bridge review returned `APPROVED`, then a focused
post-fix review also returned `APPROVED`. Accepted findings added the dark
mobile boundary separator, checked the complete fixed-navigation band for
obstruction, removed an unused test read, and added a normal-size 320-pixel
navigation-label clipping assertion. A suggestion to merge the default-size
and 200% reachability helpers was rejected because they prove different
contracts: complete control visibility at default size, and separate
top-and-bottom reachability after text enlargement.

## Acceptance Record

- `npm run test:data` passed, including 56 frozen-surface assertions.
- `npm run test:app-shell` passed 69 checks.
- `npm run lint` passed with zero errors and 290 existing warnings.
- `npm run test:review-handoff` passed.
- `npm run build` passed from a clean temporary copy. The entry was 335,549
  bytes and the initial JavaScript graph was 349,411 bytes, both inside the
  existing budgets.
- The complete Playwright release matrix passed 252 checks across normal,
  dark, and reduced-motion Chromium profiles. Its forced-colors cases also
  passed.
- The new mobile matrix passed at `320 x 568`, `375 x 812`, and `390 x 844`,
  including default-size navigation clearance and 200% text resize.

## Physical Device Boundary

Physical iOS edge-swipe and sheet overscroll, Android pull-to-refresh, and
Windows forced-colors checks remain explicit release exceptions. They are not
claimed as passes. Chromium forced-colors emulation remains part of the
automated browser gate.

## Roadmap Outcome

This work advances the roadmap's first-look readability goal by correcting a
measured default-size problem without changing score content or methodology.
The August monthly evidence cycle remains the highest-priority scheduled work.
The next first-time-reader check should include older readers and record
whether default size, browser zoom discovery, or both still slow comprehension.
