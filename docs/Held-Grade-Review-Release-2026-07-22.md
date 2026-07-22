# Held-Grade Review Release

**Status:** Live as v5.162<br>
**Prepared:** 2026-07-22<br>
**Published:** 2026-07-22<br>
**Release commit:** `8c87779`<br>
**Comparison baseline:** live v5.161<br>
**Frozen surfaces:** no grade, threshold, formula, weight, modifier, promise status, source stack, trigger, or dimension-model change

## Problem

Policy cards already showed the current verdict, next check, and a date labelled
Reviewed. They did not say what the latest review decided when a grade stayed
put. A reader could see the result and the future trigger, but still had to
reconstruct why the newest evidence did not move the grade.

The existing `lastUpdated` field also carried two jobs. It recorded when policy
data changed and supplied the date displayed as Reviewed. The July 1 cycle
reviewed every policy, but files that needed no data edit kept an older content
date. That made file-update time an unreliable proxy for review time.

## Product Decision

The modernization research initially proposed five app patterns. An
authenticated Claude review returned `REVISE`. It accepted only a narrow
GitHub-style latest-review explanation, rejected a separate AfterShip-style
delivery surface, deferred Plausible-style history comparisons while only two
score cycles exist, and left the Oura and Apple Sports ideas parked.

v5.162 implements only that narrow package. It does not add charts, filters,
delivery stages, watchlists, notifications, or another dashboard view.

## Product Contract

- Ten graded policies whose latest documented review held the grade carry an optional `latestReview` object with `date`, `outcome: "held"`, and one authored summary.
- Economic Policy Response is omitted because its latest review corrected the grade from D to C. Promise Delivery is omitted because it is an ungraded tracker.
- The validator rejects unknown keys, invalid dates or dates later than the release date, tracker use, outcomes other than `held`, copy over 180 characters, grade tokens, and urgency wording.
- Closed cards show `This review`, `Grade held`, and a one-line preview. The full authored reason remains available in the element title and in the opened policy.
- Opened policies show the full reason once in the verdict overview. Housing relies on its existing Decision Brief instead of repeating the compact block.
- Reviewed dates prefer `latestReview.date` and fall back to `lastUpdated`. Shared policy text uses the same rule. Tracker sharing is unchanged.
- Downloaded policy-source JSON includes `latestReview` when present.
- First-paint summary data includes the review object, so the closed cards do not wait for the deferred policy-detail file.

## Evidence Boundary

The July 1 monthly cycle report supports the Major Projects, Fiscal Health,
Affordability, Carbon Pricing, Climate, Immigration, and Flagship holds. The
July 21 frozen-rule adjudication supports Defence and Ethics. The July 22
Housing Decision Brief supports the Housing hold.

The summaries describe what the dated public record supports. They do not say
that an unpublished agreement, review, payment, or construction step cannot
exist. No summary changes a trigger or substitutes for the underlying evidence
record.

## Density Decision

The first integrated mobile treatment displayed every summary in full on every
closed card. Direct inspection measured about 1,014 pixels of repeated review
content across the ten cards, which made the supposedly light treatment too
dominant. The closed-card copy was reduced to a one-line preview, cutting that
measured footprint to about 527 pixels. The full reason remains available when
the policy opens.

## Acceptance Record

- `npm run test:data`: passed, including 56 frozen-score assertions.
- `npm run test:app-shell`: passed, 59 checks across 12 source files.
- `npm run test:review-handoff`: passed.
- `node scripts/audit-bias-resistance.mjs`: completed with the same eight documented pattern flags.
- `npm run lint`: passed with zero errors. The existing 320 inline-colour warnings remain.
- `npm run build`: passed. Entry bundle is 344,900 bytes and the initial JavaScript graph is 357,550 bytes, both within budget.
- Full browser gate: passed, 174 tests across normal, dark, and reduced-motion Chromium.
- Direct desktop inspection: 1280-wide Scorecard, Defence detail, and Housing detail showed equal closed-card heights, no overflow, one expanded review outcome, and no Housing duplication.
- Direct mobile inspection: 375-by-812 Scorecard and Major Projects sheet showed no overflow, full-width sheet containment, body scroll lock, focus restoration on close, readable dark theme, and no desktop policy switcher.
- Local rendered-content audit: passed, 530 checks with zero issues at `1366x900` and `375x812`.
- Independent Standards and Spec staged-diff reviews: passed. The Standards review's one wording finding was accepted and corrected before re-review.
- Authenticated Claude staged-diff review: `VERDICT: APPROVED` with no blocking findings.
- GitHub Pages run `29946680527`: passed its review-handoff, build, 174-test browser, and deploy jobs.
- Production desktop inspection: v5.162 rendered ten held-review previews with no horizontal overflow; Major Projects showed one full review reason and Housing showed one Decision Brief with no duplicate compact outcome.
- Production 375-by-812 inspection: the full-width Major Projects sheet preserved scroll lock, hid the desktop policy switcher, showed one full review reason, and restored body scroll plus card focus on close.
- Live Dashboard Audit run `29946942650`: passed 530 checks with zero issues across desktop and mobile.

## Review Log

Three scoped agents handled data validation, UI and browser coverage, and an
independent product/accessibility/trust review. The independent review returned
`REVISE`. Accepted findings removed the duplicate Housing expanded treatment
and locked the exact ten expected policy IDs in browser coverage. Its Fiscal
wording concern was also corrected to the non-comparative language supported by
the July report. Integration then corrected Defence's exact split-trigger
boundary and tightened Ethics source attribution.

The formal Spec review approved the exact ten-policy scope with no findings.
The Standards review found that this record described the date validation too
broadly; the wording now matches the enforced release-date boundary, and its
re-review approved the candidate. Authenticated Claude review then returned
`VERDICT: APPROVED` after checking all ten summaries against their source
records. Its two product-specific residual risks are queued in the roadmap:
negative fixtures for the new validator branches, and an explicit display
decision before any second policy gains a Decision Brief.

The first full browser rerun failed one new Housing assertion because the test
looked for wording the Decision Brief does not use. The assertion was corrected
to the authored Decision Brief outcome and the focused 12-test matrix passed.
A later full run failed 15 deferred-route checks because the visual-inspection
dev server was still occupying Playwright's preview port. That server was
stopped, and the intended production-preview run passed all 174 tests. Neither
failed run is treated as approval.

## Release Outcome

v5.162 closes the missing part of the Flighty-style sequence for held
grades: current status, why it sits there, what this review decided, and what to
check next. It does so with authored, dated data rather than inferred activity
or a second scoring system. Release commit `8c87779`, Pages run `29946680527`,
direct production inspection, and Live Dashboard Audit run `29946942650` close
the publication gate with no scoring or frozen-surface change.
