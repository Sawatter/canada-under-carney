# Policy Quick-Read Release

**Status:** Live<br>
**Prepared:** 2026-07-25<br>
**Comparison baseline:** live v5.166<br>
**Frozen surfaces:** no grade, threshold, formula, weight, modifier, promise
status, source stack, trigger, or dimension-model change

## What Was Checked

The July 25 observation pass covered the four roadmap items requested after
v5.166:

1. The active Housing disbursement trigger was checked on official Ontario,
   federal, and Toronto publisher pages.
2. Two screenshot-only first-look reader proxies reviewed the live dashboard at
   `375 x 812` and `1280 x 900`.
3. Housing, Defence & Trade, Promise Delivery, Flagship Delivery, and an
   ordinary graded policy were inspected across Briefing, Evidence, History,
   and Method.
4. The findings were converted into one bounded presentation release instead
   of another navigation layer or a scoring change.

AI and browser proxies are defect screens. They are not human usability
evidence and do not close the eight-reader study in the roadmap.

## Housing Hold

The official-page check found no qualifying new public evidence on the surfaces
reviewed as of July 25. The Housing grade stays `D`, and the published
disbursement or construction trigger remains off.

The checked surfaces were:

- [Ontario Development Charge Reduction Program](https://www.ontario.ca/page/development-charge-reduction-program)
- [Ontario DCRP application guidelines and FAQ](https://www.ontario.ca/files/2026-06/mmah-dcrp-application-guidelines-and-faq-en-2026-06-01.pdf)
- [Federal provincial and territorial agreements](https://housing-infrastructure.canada.ca/bcsf-fbcf/provincial-territorial/index-eng.html)
- [Federal BCSF frequently asked questions](https://housing-infrastructure.canada.ca/bcsf-fbcf/faq-eng.html)
- [Federal BCSF announcements](https://housing-infrastructure.canada.ca/bcsf-fbcf/news-nouvelles-eng.html)
- [Canada and Ontario Toronto announcement](https://www.canada.ca/en/housing-infrastructure-communities/news/2026/06/canada-and-ontario-making-homes-more-affordable-in-toronto.html)
- [Ontario Toronto announcement](https://news.ontario.ca/en/release/1007662/ontario_and_canada_making_homes_more_affordable_in_toronto)
- [Toronto Council item MM42.44](https://secure.toronto.ca/council/agenda-item.do?item=2026.MM42.44)
- [North Dundas Direct Delivery announcement](https://www.canada.ca/en/housing-infrastructure-communities/news/2026/07/building-canada-strong-by-investing-in-upgrades-to-water-distribution-in-north-dundas.html)

The Toronto announcements remain conditional on agreements and approvals, and
the Toronto Council item authorizes negotiation and execution rather than
publishing a signed transfer-payment agreement. The North Dundas item is Direct
Delivery, not DCRP. No published signed Canada-Ontario agreement, completed
DCRP project approval, signed Toronto transfer-payment agreement, first payment,
or DCRP construction record was found on the checked pages. This is dated
absence evidence, not proof that an unpublished action does not exist.

## Product Decision

The first-look briefing passed the seven synthetic comprehension questions, but
its equal-looking signal cards did not have equal click targets and its version
label omitted the release date. On a `375 x 812` viewport, the audit-score
control also intersected the fixed bottom navigation.

The policy workspace exposed a larger reading problem. Housing Briefing carried
3,969 visible characters while Evidence carried 4,128, largely because both
views repeated the dated trigger ledger. Defence & Trade showed the same
pattern. Opening a policy also removed the concise authored `nextTrigger` that
was visible on its closed card.

v5.167 makes these bounded changes:

- show the release date beside the version;
- make the full Household Impact signal card open its score explanation;
- keep mobile first-look controls clear of the fixed navigation;
- put the authored next checkpoint beside each opened policy verdict;
- keep the dated trigger ledger in Evidence only;
- place Flagship Delivery's current five-file record in Evidence while keeping
  its Combination Rule in Method; and
- focus the visible policy title when a mobile sheet opens.

The existing four-view routes, legacy links, authored data, and scoring rules
remain unchanged.

## Acceptance Record

The integrated candidate passed:

- `npm run test:data`, including all 56 frozen-score assertions;
- `npm run test:app-shell`, with 69 checks passing;
- `npm run lint`, with zero errors and the existing 290-warning baseline;
- `npm run test:review-handoff`;
- `npm run build`, with a 335,497-byte entry and 349,359-byte initial JS
  graph; and
- `npm run test:browser`, with all 249 Chromium, dark, reduced-motion, mobile,
  routing, deferred-load, and forced-colors checks passing.

Direct browser inspection at `375 x 812` confirmed no horizontal overflow,
aligned secondary signal rows, 44-pixel actions, and first-look controls ending
above the fixed navigation. At `1280 x 900`, the briefing and all secondary
signals remained visible. Housing's next-checkpoint action reached the focused
Evidence ledger, and Flagship Delivery's five-file record appeared in Evidence
instead of Method.

The first GitHub Pages run, `30170849112`, correctly blocked deployment when
Linux font rendering put the mobile action row 7.08 pixels under the fixed
navigation. Mobile row spacing and padding were reduced, and the browser gate
now requires an 8-pixel safety gap rather than accepting edge contact. Claude
rejected the first spacing reduction as too close to the measured Linux
variance, so a second pass added about 12 pixels of fixed-layout headroom for
about 26 pixels total from the original layout, without reducing type or
44-pixel touch targets. A 12-pixel mobile separation also keeps the following
signal cards from entering the nav-obstructed zone. The final revised state
passed the nine focused layout checks and the full 249-test local matrix.

v5.167 is live through product commits `60e8824` and `408e387`, plus
audit-gate correction `16bfa07`. Final Pages run `30181762251` passed its
review-handoff, build, 249-case Ubuntu browser, and deploy jobs. Live Dashboard
Audit run `30181903904` passed `356/356` rendered-content and interaction
checks.

Direct production inspection confirmed v5.167 and the July 25 release date, no
horizontal overflow, working Household open and close behavior, the Housing
next watch, and the Flagship snapshot and Combination Rule in their intended
views.

The prior Live Dashboard Audit run `30180732764` exposed stale audit
assumptions rather than a product defect. Its six failures were corrected by
matching the Household whole-card control and the Flagship Evidence and Method
split. A browser-gate race was also traced to measuring initial geometry after
the app's intentional expander-close smooth scroll. The check now runs before
the interactions it still exercises. Authenticated Claude approved the final
correction.

## Review Record

Four bounded sub-agents covered Housing evidence, first-look comprehension,
four-view workspace behavior, and release risk. Accepted defects became the
candidate fixes above. The real-reader gate and physical-device gaps remain
open.

The authenticated Claude bridge passed a headless smoke check before coding.
Claude's integrated review returned `APPROVED` and raised three non-blocking
cleanup findings. All three were accepted: the Household card's accessible
name now includes its grade and score, stale checkpoint selectors were removed,
and the roadmap again links the standing Housing trigger history. Claude's
focused correction review then returned `APPROVED` with no blocking or
non-blocking defects. After the first Pages run exposed the Linux-only overlap,
Claude returned `REVISE` on the initial spacing fix. That finding was accepted,
and its review of the wider final headroom returned `APPROVED`. Claude's final
audit-gate review also returned `APPROVED`, with no false-pass, lost-interaction,
or hidden-defect finding.

## Physical Device Boundary

Physical iOS edge-swipe and sheet overscroll, Android pull-to-refresh, and
Windows forced-colors checks were not performed. They remain explicit release
exceptions and are not claimed as passes. Chromium forced-colors emulation
remains part of the automated browser gate.

## Roadmap Outcome

This release advances the roadmap's readability and inspectability goals by
putting grade, reason, latest review, and next checkpoint into one short policy
opening while preserving the dated evidence trail one view away. It also
corrects two concrete first-look interactions without changing the product's
scoring boundary.

The August monthly cycle remains the highest-priority scheduled work. The
eight-reader first-look study and the five-policy human workspace observation
remain next because AI proxies cannot establish comprehension.
