# Instagram Pattern Decision

**Status:** Live as v5.160<br>
**Prepared:** 2026-07-21<br>
**Published:** 2026-07-21<br>
**Release commit:** `a1eb18f`<br>
**Production evidence:** Pages run `29884796740` passed and live audit run
`29884939039` passed 530 checks with zero issues<br>
**Research baseline:** live v5.159<br>
**Frozen surfaces:** no grade, threshold, formula, weight, modifier, promise
status, trigger, source, or dimension-model change

## Evidence Boundary

The Perplexity response was treated as research input, not product direction.
It retrieved the tracked-file bundle but did not operate the live dashboard or
a signed-in Instagram client. Its exported citations were unresolved numeric
references without a bibliography, so its Instagram claims are hypotheses
rather than approval evidence.

Codex inspected live v5.159 on 2026-07-21. At `375x812`, the mobile drawer
filled the viewport, the Share target was `44x44` CSS pixels, and the page had
no horizontal overflow. At `1280x900`, the Share target was `93x44` CSS pixels
and the page again had no horizontal overflow. The current browser state also
showed the conditional since-last-visit notice, so its measured grade-grid
position is not a clean first-visit baseline.

Repository inspection confirmed that `DimensionCard.jsx` sent only
`document.title` plus the policy deep link to Web Share, or only the deep link
to the clipboard. The [Web Share API Recommendation](https://www.w3.org/TR/web-share/)
defines `title`, `text`, and `url` as separate share-data fields, so adding a
plain-text context field fits the existing browser contract without new
infrastructure.

## Decision

| Candidate | Decision | Reason |
|---|---|---|
| Context-preserving share text | Published as a bounded v5.160 change | The prior outbound result lost grade, trend, and review-date context even though those facts were already visible in the opened policy. The change reuses the existing control and exact deep link. |
| Local `Pin for later` list | Defer | No reader feedback shows that revisiting a fixed 11-policy grid is costly enough to justify another control and local state. The political-signalling risk remains real when a pin list is screenshotted. |
| Stronger caught-up flow | Reject | `SinceLastVisit`, Dashboard Status, and the finite Change Log already cover the job. |
| Recommendations reset | Reject | The dashboard has no personalized recommendation system to reset. |
| Collaborative collections | Reject | Shared state would require accounts or a backend outside the product boundary. |
| Repost tab | Reject | The scorecard grid already provides the canonical revisit surface. Only the attribution principle transfers to Share text. |
| Denser profile-style grid | Reject | It would remove verdict, trend, and next-check context without a demonstrated scan problem. |
| Stories-style progress | Reject | It duplicates the finite Change Log and would make evidence easier to miss through sequential or swipe-led disclosure. |

## Prototype Contract

- Keep the existing Share button, layout, accessible name, focus behavior,
  history behavior, and `#dim-*` deep link.
- For a graded policy, send `Canada Under Carney performance scorecard`, the
  policy name, `Grade: X`, the plain-language trend, and the card's
  `Policy file reviewed` date.
- For Promise Delivery, say `tracker only` and include the delivered count.
  Never expose its informational grade as a policy grade.
- Pass the context as Web Share `text` and the deep link as Web Share `url`.
  Copy the same text followed by the deep link when Web Share is unavailable.
- When supported, use `navigator.canShare` before opening the native sheet so
  an unsupported text payload can take the clipboard path without first
  consuming the reader's share-button activation. Treat `AbortError` as an
  intentional dismissal and do not overwrite the clipboard.
- Add no storage, account, analytics, network request, dynamic image, visible
  control, animation, or scoring dependency.

Exact graded example:

```text
Canada Under Carney performance scorecard
Housing Supply
Grade: D | Trend: Stable
Policy file reviewed: 2026-07-19
Evidence and grading method:
https://sawatter.github.io/canada-under-carney/#dim-housing-supply
```

## Acceptance And Rollback

- Deterministic tests must cover a graded policy, Promise Delivery, and a
  missing-link failure.
- Browser tests must capture the native-share object and the clipboard fallback
  and confirm the exact deep link survives.
- The full data, app-shell, lint, build, and browser gates must pass. Entry and
  initial-graph bundle budgets must remain below their existing ceilings.
- Desktop `1280x900` and mobile `375x812` must show no visible layout,
  keyboard, focus, dark-theme, reduced-motion, or horizontal-overflow
  regression.
- The editor instructed publication after the detached wording and the
  remaining physical-device observation gap were named. A later moderated
  reader task can test whether people correctly identify the grade, trend,
  date, and evidence destination. The Perplexity report's proposed
  five-person, five-of-five threshold is not adopted because it supplied no
  basis for that exact cutoff.
- Context in the payload reduces ambiguity but does not prevent a recipient
  from cropping, rewriting, or screenshotting the result without its link.
- Roll back to title plus URL if a physical share target drops or mangles the
  text, or if detached wording is repeatedly read as political alignment.

## Review Log

- One Codex sub-agent returned `REVISE` on the research report's draft payload.
  Accepted findings produced the separate tracker wording, `Reviewed` date
  semantics, `navigator.canShare` gate, copy-feedback correction, and browser
  coverage for success, failure, cancellation, and permission denial.
- The first Claude bridge attempt returned no review because its CLI login had
  expired. That attempt did not count as approval.
- After OAuth login, authenticated Claude reviewed the isolated staged patch
  read-only and returned `VERDICT: APPROVED` with no blocking finding.
- Claude's tracker-clipboard coverage note was accepted and added to the pure
  helper test. Its two other notes were not changed: `canShare` receives a
  valid string-only payload under the W3C contract, so a broad speculative
  catch would add an unobserved failure path; rebuilding one tracker callback
  when its inline count object changes has no measurable cost and keeps the
  complete `dim` object in the dependency list.
- No physical iOS or Android share target is available on this host. The editor
  explicitly accepted that observation gap for publication by instructing the
  v5.160 push after it was named. It remains an exception, not a claimed pass.

## Release Outcome

- Commit `a1eb18f` was pushed to `main` on 2026-07-21.
- GitHub Pages run `29884796740` passed its build, review-handoff,
  156-test browser, and deploy jobs.
- The production header reports v5.160. The live Housing Share control measured
  `93x44` CSS pixels with no horizontal overflow.
- Live Dashboard Audit run `29884939039` finished with
  `PASS=530 ISSUE=0 TOTAL=530` across desktop and mobile.
- No grade, threshold, formula, weight, modifier, promise status, source, or
  dimension-model change was part of the release.
