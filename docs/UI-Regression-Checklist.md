# UI Regression Checklist

Use this before pushing UI changes. A browser-capable agent or human has to run
it. Lint and build do not count as UI verification.

## Policy Detail Workspace

- Desktop 1280px: open Major Projects and confirm the sticky policy-detail
  navigation exposes four sibling views: Briefing, Evidence, History, and
  Method. Only the selected view should be visible, and its control should carry
  the active state.
- Briefing: confirm the verdict, authored lead metrics, why-not-higher and
  why-not-lower explanations, complete up and down trigger band, judgment, and
  latest review are visible without opening another disclosure.
- Evidence: confirm each canonical metric, source, promise, trigger, project,
  and supporting or contrary perspective present for the policy is reachable in
  the one view. Links must keep their source labels and targets.
- History: confirm the policy has one dated sequence rather than separate
  timelines. Housing must also show its dated evidence-review detail in this
  view without duplicating the sequence.
- Method: confirm thresholds, scoring or combination rules, operationalization,
  scope, caveats, and glossary material present for the policy remain visible.
- No panel should reintroduce nested `details`, expandable sub-drawers, or a
  second local navigation hierarchy.

## Special Cases

- Defence & Trade: confirm the Defence and Trade sub-scores remain distinct and
  readable in the workspace. Do not imply that flat lead metrics belong to a
  sub-score unless the data says so.
- Promise Delivery: confirm it remains labelled as an ungraded tracker, uses its
  informational status rather than a GPA grade, and can move through the four
  views without graded-policy-only judgment copy appearing.
- Flagship Delivery: confirm the Combination Rule is readable in Method, the
  underlying records remain available in Evidence, and the dated retention
  review remains visible in the review path.
- Ordinary graded dimension: confirm Major Projects or another policy without a
  special construct follows the same four-view order and does not render empty
  placeholders for optional records it does not have.

## Routing And Input

- Open `#dim-major-projects-evidence` directly and confirm Major Projects opens
  on Evidence with the correct active control. Repeat with Briefing, History,
  and Method deep links.
- Confirm legacy policy-detail links route to the appropriate new sibling view
  rather than opening a missing or blank section.
- Keyboard: confirm a card open focuses the policy title, a direct link focuses
  the selected view control, activating a view keeps focus on that control, Tab
  reaches the other view controls and Close, Enter or Space changes views, and
  Escape closes the workspace.
- History: confirm changing sibling views does not create a broken back-button
  loop, Back closes an app-opened policy once, and Close restores focus to the
  originating card.
- Mobile 375px: confirm the policy detail is full-screen and flush, body scroll
  is locked, the four controls remain reachable, Close and Back work, and no
  desktop margin, border, or horizontal overflow leaks into the sheet.
- Desktop and mobile: confirm long source labels, trigger text, sub-score copy,
  and the Housing evidence review wrap without clipping or horizontal overflow.
- Forced-colors emulation: confirm the active view, focus indicators, links, and
  grade or tracker labels remain distinguishable without relying on colour
  alone.

## First-Look And Shell

- Desktop `1280 x 900`: confirm the Full Policy Audit result is visually
  dominant and the Household, Promise Delivery, and Approval signals remain
  visible in the first viewport with their different roles stated.
- Mobile `375 x 812`: confirm the result, reason, release state, watch, scoring
  boundary, and both inspect routes finish above the fixed bottom navigation
  without horizontal overflow.
- Route checks: activate the policy-file route from Scorecard and from another
  top-level view. It must focus the policy heading without adding a history
  entry. Confirm the scoring-method and release-detail routes reach their
  intended targets.
- Approval Signal: confirm its accessible name includes the approve,
  disapprove, net, and poll-window values, and its detail toggle opens and
  closes.
- Scorecard return: confirm closing a policy returns to the same card and scroll
  position without changing the selected top-level view.

Physical iOS edge-swipe and sheet overscroll, Android pull-to-refresh, and
Windows forced-colors device checks are separate from browser emulation. Do not
record them as passes unless they are performed on those platforms.
