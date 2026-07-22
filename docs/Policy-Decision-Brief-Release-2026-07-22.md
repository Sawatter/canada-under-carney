# Policy Decision Brief Release

**Status:** Live as v5.161<br>
**Prepared:** 2026-07-22<br>
**Published:** 2026-07-22<br>
**Release commit:** `0da9cc5`<br>
**GitHub Pages run:** `29933724138`<br>
**Live Dashboard Audit run:** `29933987972` (`PASS=530 ISSUE=0 TOTAL=530`)<br>
**Comparison baseline:** live v5.160<br>
**Frozen surfaces:** no grade, threshold, formula, weight, modifier, promise status, source stack, trigger, or dimension-model change

## Problem

The policy drawer already exposed the grade, threshold, metrics, triggers,
sources, judgment, and scope. It did not show one consequential evidence check
as a single dated decision. Readers had to reconstruct what earned credit, what
limited credit, which steps remained unproven, and why the trigger held.

The source table also displayed a three-tier authority system inferred from web
domains. That presentation did not match the five functional tiers in
`QA-Gatekeeping-Rules.md`. It labelled government news releases and official
statistics alike when both appeared on a federal domain.

## Reference Decisions

Five product references were treated as bounded patterns, not templates:

- Flighty informed the status, reason, and next-check sequence.
- Linear informed quick Previous and Next movement without losing the current workspace.
- Stripe informed the dated evidence trail and summary-first reading order.
- Ground News informed comparison of evidence earning and limiting credit. Political bias meters and forced symmetry were rejected.
- Tide Guide informed hierarchy and finish. Charts were rejected because the dashboard does not have enough score-history depth to justify them.

No sidebar, feed, activity stream, bias score, political-camp comparison,
sparkline, or full dashboard redesign was added.

## Evidence Boundary

The Housing brief records the July 22 Ontario DCRP check. The controlling live
pages were Ontario's DCRP program page, the federal Provincial and Territorial
stream page, the federal FAQ, the federal announcements index, and the federal
and Ontario Toronto releases.

The federal FAQ was modified July 21 and says agreements are being finalized.
The Provincial and Territorial stream page says signed agreements will appear
there once reached, but its agreement section currently lists none. Ontario's
program page says applications are closed and describes assessment criteria,
but does not publish selections, payment agreements, payments, or construction
evidence.

The brief therefore records a dated hold. It does not claim that an unpublished
step cannot exist. The conditional Toronto allocation earns early credit, but
the live disbursement or construction trigger remains off and Housing stays D.

## Product Contract

- `latestEvidenceReview` is optional, validated data for graded policies only.
- The Housing brief shows the trigger, credit, limiting evidence, unproven steps, scorecard read, review outcome, next check, caveat, and dated official-page list.
- Evidence items name their source role explicitly. The UI no longer assigns authority tiers from a hostname.
- The ordinary source table keeps newest-first dates and the existing used-for labels.
- Desktop Previous and Next controls wrap through the 11 graded policies in canonical order. Promise Delivery is excluded.
- A policy switch replaces the current `#dim-*` history entry, resets the new file to the top, focuses its title, and announces the policy and grade.
- Mobile keeps the existing full-screen sheet without Previous and Next controls.

## v5.160 Comparison

At `1280x900`, the controls fit the existing sticky header, the Housing brief
reads before the general evidence snapshot, and no horizontal overflow appears.
At `375x812`, the first screen matches v5.160 and the controls remain absent.
The brief stacks into one column with no horizontal overflow. Dark and
reduced-motion browser projects also pass the targeted checks.

The Housing file gains intentional vertical length. Every other policy keeps
the v5.160 content layout. This is accepted because the added space carries the
decision record that the prototype exists to expose.

## Acceptance Record

- `npm run test:data`: passed.
- `npm run test:app-shell`: passed, 59 checks.
- `npm run build`: passed, including the frozen-surface and bundle-budget checks.
- `npm run lint`: passed with zero errors. Existing inline-colour warnings remain.
- Full browser gate: passed, 162 checks across normal, dark, and reduced-motion projects.
- Local rendered-content and interaction audit: passed, 530 checks with zero issues.
- Authenticated Claude review: `VERDICT: APPROVED` with no blocking defect.
- GitHub Pages run `29933724138`: passed review-handoff, build, 162-test browser, and deploy jobs for commit `0da9cc5`.
- Production inspection: live header reports v5.161; Housing shows the Decision Brief and the three-column Source / Used for / Date table; desktop Next moved Housing to Ethics and focused the new title.
- Live Dashboard Audit run `29933987972`: passed 530 checks with zero issues across `1366x900` desktop and `375x812` mobile.

## Review Log

Claude reviewed the isolated staged diff after confirming the branch, HEAD,
v5.161 metadata, live v5.160 baseline, and the unrelated unstaged
`public/visitor-count.json` file. It found the five release intents satisfied
and no scoring drift, authority-label replacement, history defect, responsive
regression, validator hole, or copy conflict.

Three optional notes were not changed. The source-tier correction remains a
`fix` because it repairs misleading behavior even though the Change Log folds
fixes into its quiet bucket. The two evidence-card accent rails remain
decorative and passed the dark browser and visual checks. The source-substring
app-shell checks remain backed by browser assertions that exercise wrap,
focus, history, mobile absence, source headers, and overflow.

## Release Outcome

v5.161 is live. The release makes one consequential Housing evidence check
readable as a dated decision instead of asking readers to reconstruct it from
separate sections. It also removes authority labels that the data could not
support and lets desktop readers move between policy files without returning
to the grid or filling browser history with one entry per switch.

The production comparison is better than v5.160 on the intended paths. Desktop
gains faster policy review and a clearer Housing evidence trail. Mobile keeps
the existing first screen and full-screen sheet, with no new controls or
horizontal overflow. The added Housing length is intentional and limited to
the policy carrying the review. No scoring or frozen surface changed.
