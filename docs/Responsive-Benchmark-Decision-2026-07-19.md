# Responsive Benchmark Decision

**Status:** Cross-AI review passed; physical checks explicitly excepted on 2026-07-20 for this session; publication remains an editor action<br>
**Prepared:** 2026-07-19<br>
**Dashboard baseline:** live v5.157<br>
**Local review state:** `codex/july-1-cycle-prep` at `997cacf`<br>
**Frozen surfaces:** no grade, threshold, formula, weight, modifier, promise
status, trigger, or dimension-model change

## Decision

Build one bounded prototype:

1. Add a visible **Jump to the 11 policy grades** link on the Scorecard view.
2. At `640px` and below, keep the trust-critical Dashboard Status summary
   visible and put the remaining status facts and next checks behind one
   disclosure.
3. At `641px` and above, show the six status facts and Next checks.

Do not compact the four headline cards, change the opened-policy navigation,
add a second returning-reader shortcut, or collapse the trust frame in this
prototype. Those ideas either lack evidence or duplicate current behavior.

## Evidence Record

The Perplexity response was useful as a hypothesis list, but it is not an
approval-ready source. Its numbered citations were exported without URLs, it
did not interact with the live app, and two repo claims were wrong: the opened
policy navigation is capped at seven items, not about thirteen, and the
returning-reader notice is conditional rather than always present.

The live production page was rechecked in the Codex in-app Chromium browser on
2026-07-19. The page reported v5.157. After `DOMContentLoaded`, `window.scrollY`
was `0` and positions were read as
`Math.round(element.getBoundingClientRect().top + window.scrollY)`.

| Viewport | Headline cards | Dashboard Status | Policy grade grid |
|---|---:|---:|---:|
| `375x812` | `1,360px` high, starts at `829px` | `972px` high, starts at `2,213px` | starts at `3,370px` |
| `1280x900` | `403px` high, starts at `583px` | `398px` high, starts at `1,011px` | starts at `1,509px` |

These results reproduce the July 19 baseline exactly. Absence of a
returning-reader notice in the fresh browser state is expected and is not proof
of its behavior in other client states.

## Local Prototype Measurement

Local v5.158 was measured with the same DOM method after the implementation and
production build. Pixel values document the tradeoff; they are not pass/fail
thresholds.

| Viewport | Grade jump | Dashboard Status | Policy grade grid | Change from live v5.157 |
|---|---:|---:|---:|---|
| `375x812` | `44px` high, starts at `824px` | `254px` high, starts at `2,269px` | starts at `2,701px` | Status is `718px` shorter; grid starts `669px` earlier. |
| `1280x900` | `44px` high, starts at `579px` | `398px` high, starts at `1,067px` | starts at `1,558px` | Status height is unchanged; grid starts `49px` later. |

The visible jump follows the trust explanation, so it does not bypass the
dashboard's first-time-reader boundary. It adds a small amount of ordinary
scroll on desktop; its purpose is a direct focus-and-scroll route, not a claim
that desktop scroll cost was reduced. On mobile, the status disclosure more
than recovers the added jump-link height. Neither viewport has horizontal
overflow.

## External Pattern Check

| Reference | Decision | What the primary source supports | What not to claim or copy |
|---|---|---|---|
| [Apple Stocks](https://support.apple.com/en-euro/guide/iphone/iph1ac0b1bc/ios) | Keep narrowly | A compact watchlist shows symbol, name, chart, price, and change; tapping opens charts, detail, and news. | Do not claim it carries "90% of a decision." Apple does not make that claim. Do not compact this dashboard's cards without testing. |
| [The New York Times](https://s23.q4cdn.com/152113917/files/doc_downloads/2024/q3/Q3-2024-Prepared-Remarks-FINAL.pdf) | Defer as a structural reference | The 2024 app redesign exposed more sections through panels and swipes. | It does not establish a lead-then-disclose pattern for this status panel. Current [NYT iOS help](https://thenewyorktimeshelpcenter.helpjuice.com/115003859548-The-New-York-Times-News-App/360007626393-iOS-News-App) also shows that the tab labels cited by Perplexity were stale. |
| [Airbnb](https://www.airbnb.com/help/article/39) | Reject as an anchor | Search uses filters, ranking, lists, and maps across a very large catalogue. | Do not import map, search, save, or browse chrome into a fixed 11-policy scorecard. Airbnb also says map and list results may differ, so identical cross-surface state is not an established lesson. |
| [Wikipedia mobile sections](https://www.mediawiki.org/wiki/Readers/Reader_Growth/Expanded_Mobile_Sections/en) | Keep only as cautionary evidence | Collapsed mobile sections can aid navigation through dense text. | Do not use Wikipedia to justify opening or exposing more by default. Its 2025 auto-expand test reduced session time by 15% and early retention by 1.5%, so Wikimedia stopped the treatment. |
| [W3C disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) | Apply | The control is a button with `aria-expanded`; `aria-controls` may point to the shown or hidden content. | Do not leave hidden links in the accessibility tree or tab order. |
| [W3C bypass technique G123](https://www.w3.org/WAI/WCAG22/Techniques/general/G123.html) | Apply | A link can bypass preceding content when activation moves keyboard focus to the destination. | Do not scroll visually while leaving focus behind. |

## Accepted, Deferred, Rejected

| Finding | Decision | Reason |
|---|---|---|
| Visible grade jump | Accept | It removes the effective scroll cost while keeping the trust explanation ahead of the shortcut. |
| Mobile Dashboard Status disclosure | Accept for prototype | The live block is `972px` high. The summary will keep the evidence-scan, editor-review, and coverage dates visible, so the source-freshness distinction remains in the main path. |
| Desktop Dashboard Status disclosure | Reject for now | The mobile cost does not establish the same reader problem on desktop. Desktop keeps the current six facts and next checks open. |
| Compact headline cards | Defer | It changes four separate content contracts and could make score math harder to find. Test the smaller prototype first. |
| Four-item opened-policy navigation | Reject | The premise is false. The rendered navigation already has at most seven items, fewer on mobile, plus Show all sections. |
| New returning-reader shortcut | Reject | `SinceLastVisit` already appears conditionally and links to the Change Log when grade changes exist. |
| Trust-frame collapse | Reject | It is the first-time reader's main product boundary and was not the largest measured block. |

## Prototype Contract

### Grade Jump

- Render only when the Scorecard overview is visible and no policy detail is
  open.
- Place it after the trust frame and before the headline scoreboard.
- Use a native link with visible text `Jump to the 11 policy grades` and a real
  fallback destination of `#policy-grades-heading`.
- Intercept ordinary activation so it does not add or replace a history entry.
- Focus and scroll, with `behavior: "auto"`, to a new level-two heading named
  `11 policy areas graded A-F, updated monthly.`
- Give that heading `id="policy-grades-heading"` and `tabIndex={-1}`. Keep
  `#scorecard-dimension-grid` unchanged for existing measurements, deep links,
  and desktop return behavior.
- After the jump, the next Tab reaches the first policy-card control.
- Opening a policy after the jump must keep current Back, close, and focus
  restoration behavior.

### Mobile Dashboard Status

- Track `(max-width: 640px)` independently from the drawer's `767px` state.
- At `640px` and below, initially show:
  - the Dashboard Status heading and its source-vs-review explanation;
  - one compact line with evidence-scan date, editor-reviewed cycle date,
    coverage-through date, and grade-move count;
  - one `Show details` button.
- The button uses `type="button"`, `aria-expanded`, and
  `aria-controls="dashboard-status-details"`.
- Expanded text changes to `Hide details`. Focus stays on the button.
- Hidden facts, notes, next checks, and links are absent from the accessibility
  tree and tab order.
- At `641px` and above, omit the button and show the six status facts and Next
  checks regardless of mobile disclosure state.
- Preserve an explicit mobile open choice across a desktop resize and return.
- If a resize would hide the currently focused details descendant, move focus
  to the Dashboard Status heading.
- Use existing color tokens and focus styles. Add no slide, fade, height, or
  smooth-scroll animation.

## Acceptance Criteria

1. The link is visible, announced as a link, and at least `44x44` CSS pixels.
2. Pointer, Enter, and assistive-technology activation focus the policy heading
   and place it near the top of the viewport without changing `location.hash`,
   `history.length`, or `history.state`.
3. The grade jump does not appear on Promises, Changes, Rubric, About, or while
   a policy detail is open.
4. At `375px` and `640px`, status details start hidden and the toggle reports
   `aria-expanded="false"`.
5. At `641px` and `1280px`, the toggle is absent and the six current facts plus
   Next checks remain visible.
6. Enter and Space toggle mobile details, focus remains on the button, and the
   hidden links do not receive Tab focus.
7. Resizing `1280 -> 640 -> 641 -> 375` follows the breakpoint without orphaning
   focus, duplicating listeners, or losing an explicit mobile open choice.
8. The Scorecard has no horizontal overflow at `375`, `640`, `641`, or `1280`.
9. Dark and reduced-motion test profiles pass the same interaction checks.
10. Forced-colors behavior is recorded as an editor-only physical check unless
    a Windows browser is available in the review session.
11. Re-running the live DOM method records the post-change policy-grid and status
    positions. Pixel values are evidence, not brittle test thresholds.
12. `npm run test:data`, `npm run test:app-shell`, `npm run lint`,
    `npm run build`, and `npm run test:browser` pass.

## Files In Scope

- `src/components/Dashboard.jsx`
- `src/components/DashboardStatus.jsx`
- `src/index.css`
- `scripts/test-app-shell.mjs`
- `tests/browser/dashboard-smoke.spec.js`
- `src/data/meta.json`
- `src/data/changelog.json`
- `docs/Current-Roadmap.md`
- this decision record

`ScoreboardHeader.jsx`, `DimensionCard.jsx`, `SinceLastVisit.jsx`, scoring data,
methodology documents, and frozen scoring files are out of scope.

## Review Log

- Perplexity: research input received; missing citations and incorrect repo
  claims were corrected rather than adopted.
- Three Codex sub-agents: evidence, accessibility, and test reviews completed
  read-only on 2026-07-19. Accepted findings are represented above.
- Two fresh Codex adversarial reviewers checked repository standards and the
  requested behavior independently after implementation. The specification
  reviewer moved from REVISE to APPROVED after fixes to the fallback
  destination, measurement record, pointer and Back workflow, responsive focus
  repair, and lower-card mobile return path. The standards reviewer moved from
  REVISE to APPROVED after the canonical no-hash Back path stopped overriding
  card restoration with `#main-content`, and the desktop test proved the lower
  card's focus, scroll position, and viewport visibility after Back. Both final
  reviews report no blocking findings on the local diff.
- The first Claude plan and implementation attempts returned no review because
  the CLI was not logged in. Those attempts did not count as approval.
- After authenticated login, separate read-only Claude plan and implementation
  reviews both returned APPROVED with no blocker. Accepted optional findings
  moved the jump below the trust explanation, made the mobile grade-move wording
  match the detailed status, synchronized disclosure state outside the state
  updater, and extended forced-colors focus styling to the new controls.
- The pending-monitor count remains behind the clearly labelled mobile
  disclosure because the evidence-scan, editor-review, and coverage dates stay
  visible and the measured phone-space reduction is the bounded goal. The
  mobile deep-link close path has no originating card to restore, so it remains
  outside the owned-drawer Back contract.
- Claude's read-only post-fix implementation review returned APPROVED with no
  blocker. Its stale scroll-restoration comment was corrected. Its commit-scope
  warning is accepted: responsive v5.158 files and the separate MCP tooling work
  must not be combined into one commit.
- On 2026-07-21, a final authenticated Claude release review against the fixed
  `997cacf` base returned APPROVED with no blocker. Its repeated commit-scope
  warning is closed through hunk-level roadmap staging. Three optional notes did
  not justify post-approval code churn: the extra effect dependency is harmless,
  the repeated mobile facts preserve the always-visible summary contract, and
  the inline heading color predates this release and passed the dark-mode matrix.

## Physical-Check Exception

On **2026-07-20**, the release gate was re-run on the local `v5.158` tree
from `codex/july-1-cycle-prep` at `997cacf`. The deterministic gates passed
again: `npm run test:data`, `npm run test:app-shell`, `npm run lint`,
`npm run build`, and `npm run test:browser`.

The browser matrix initially failed for an environment reason, not a product
reason: the sandbox could not bind the local preview server to `127.0.0.1:4173`.
Re-running `npm run test:browser` outside the sandbox produced a clean
**138 / 138** pass in the normal, dark, and reduced-motion Chromium projects.

This session did **not** have a physical iOS Safari device, a physical Android
Chrome session, or a Windows browser with forced-colors mode available. Because
those environments were unavailable here, the three manual checks were
**explicitly excepted** rather than silently treated as complete:

- iOS edge-swipe Back and sheet overscroll
- Android pull-to-refresh
- Windows forced-colors

The exception closes the local release gate for this session. It does not turn
those three checks into completed hardware verification, and it does not
publish the release.

## Verification Record

- `npm run test:app-shell`: 53 checks passed.
- `npm run test:data`: passed.
- `npm run lint`: 0 errors; existing warnings remain outside this change.
- `npm run build`: passed.
- `npm run test:browser`: 138 tests passed in normal, dark, and reduced-motion
  Chromium projects after the final review fixes. The 2026-07-20 rerun required
  an unsandboxed local preview-server bind to complete.
- In-app browser: checked at `375x812` and `1280x900`; the `640/641` boundary,
  jump focus, disclosure states, light and dark surfaces, and horizontal
  overflow matched the contract.
- Physical iOS gestures, Android pull-to-refresh, and Windows forced-colors
  were explicitly excepted on 2026-07-20 because this session lacked those
  device/browser environments.
