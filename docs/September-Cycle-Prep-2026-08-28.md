# September Cycle Preparation - 2026-08-28

**Evidence window:** 2026-08-01 through 2026-08-31
**Latest preparation checkpoint:** 2026-08-29
**Dashboard baseline:** v5.176 repository state at commit `b80c9a0`; the
user-facing v5.176 content last changed at release commit `c73ca98`
**Decision boundary:** Evidence preparation only. No grade, promise-status,
methodology, threshold, or frozen-surface call is made here.

## Current State

The September ledger is generated and structurally valid. Point-in-time checks
through August 29 are recorded. The cycle cannot close before August 31, and
negative findings must be refreshed after the full evidence window ends.

| Work item | Checkpoint result | Remaining gate |
|---|---|---|
| Four IRCC downloads | All four official binaries returned and parsed; freshness now uses the newest dated row rather than file order | Compare the June 2026 permit-holder data during editor-gated September adjudication |
| Moody's sovereign watch | Official Ratings News search returned no matching August action; issuer detail remains sign-in gated | Retain the access exception and do not infer a rating |
| Housing DCRP watch | Three new conditional municipal allocations found; disbursement and construction condition remains unmet | Recheck after August 31 and on any new official event |
| Official publisher sweep | The August 29 pass checked all 29 still-open monthly and event-driven rows; 12 carried a new release, 13 recorded no event observed, 2 remained OK, and 2 were blocked | Refresh every open row after the August 31 boundary, adjudicate the active questions, and keep Major Projects parked |
| Source ledger | 560 rows; 531 have dated dispositions, including 475 rows deferred by cadence; 29 remain open | Close August 29-31, run the September 1 scout, adjudicate candidates, then require all rows closed |
| Policy history | Three chronology defects confirmed | Editor must define date semantics before data correction |
| Monthly scout | The local fail-closed candidate passes its source-contract checks, but hosted workflow security remediation remains under review | The Anthropic account still needs usable API credit before September 1, then the accepted workflow needs a hosted run |

## Source Results

### IRCC

The official Open Government records and their linked IRCC files were checked
live. The Open Government resources redirect to the IRCC binaries and do not
provide independent cached copies.

| File | HTTP | Shape | Data rows | Latest period |
|---|---:|---|---:|---|
| [Permanent residents](https://www.ircc.canada.ca/opendata-donneesouvertes/data/ODP-PR-Gender.csv) | 200 | 11-column tab-delimited file | 3,867 | 2026-06 |
| [IMP work permits](https://www.ircc.canada.ca/opendata-donneesouvertes/data/ODP-TR-Work-IMP-PT_program.csv) | 200 | 17-column tab-delimited file | 49,150 | 2026-06 |
| [TFWP work permits](https://www.ircc.canada.ca/opendata-donneesouvertes/data/ODP-TR-Work-TFWP-PT_program.csv) | 200 | 17-column tab-delimited file | 6,419 | 2026-06 |
| [Study permits](https://www.ircc.canada.ca/opendata-donneesouvertes/data/ODP-TR-Study-IS_PT_study.csv) | 200 | 11-column tab-delimited file | 5,495 | 2026-06 |

Every row had the expected column count. No blank records or invalid date rows
were found. The prior binary-download exception is resolved. These access and
shape checks do not decide whether the data changes the Immigration grade.

The three temporary-resident downloads contain permit-holder records, including
renewals. The permanent-resident file contains admissions. None reproduces the
dashboard's two new-arrival decline metrics. Those metrics now cite IRCC's
direct January through September 2025 new-arrival counts and are marked for
manual review. The displayed 53% and 60% values did not change.

### Moody's

The official [Ratings News](https://ratings.moodys.com/ratings-news) last-30-day
search returned no result for four Canada sovereign query variants. The
[Ratings Search](https://ratings.moodys.com/ratings/search) redirected to
sign-in. The accessible 2025 Canada event page is too old to establish an
August 2026 rating or outlook.

Disposition: record a dated negative search plus a current-detail access
exception. Do not state that no action occurred, and do not infer the current
rating or outlook.

### Housing DCRP

The live official pages show more conditional selection-stage activity, but no
qualifying disbursement or construction evidence.

| Official item | What it establishes | What remains conditional |
|---|---|---|
| [Vaughan, August 26](https://www.canada.ca/en/housing-infrastructure-communities/news/2026/08/canada-and-ontario-making-homes-more-affordable-in-vaughan.html) | Up to $697.2 million and a named project slate | Canada-Ontario BCSF agreement, due diligence, and municipal TPA |
| [Hamilton, August 26](https://www.canada.ca/en/housing-infrastructure-communities/news/2026/08/canada-and-ontario-making-homes-more-affordable-in-hamilton.html) | $572 million and six named projects | Council action, BCSF agreement, federal approval, due diligence, and municipal TPA |
| [Bradford West Gwillimbury, August 28](https://www.canada.ca/en/housing-infrastructure-communities/news/2026/08/canada-and-ontario-making-homes-more-affordable-in-bradford-west-gwillimbury.html) | Up to $94.8 million and four named projects | Council action, BCSF agreement, federal approval, due diligence, and municipal TPA |

The [federal agreements index](https://housing-infrastructure.canada.ca/bcsf-fbcf/provincial-territorial/index-eng.html)
still says agreements will be posted once reached and lists no Ontario
agreement. The [federal FAQ](https://housing-infrastructure.canada.ca/bcsf-fbcf/faq-eng.html)
says provinces submit priority projects after agreements are signed. The
[Ontario DCRP page](https://www.ontario.ca/page/development-charge-reduction-program)
lists no approval, TPA, payment, or construction register.

Toronto's [development-charges control page](https://www.toronto.ca/city-government/budget-finances/city-finance/development-charges/)
says the amended by-law remains subject to a Transfer Payment Agreement with
Ontario and that more information will follow once the agreement is received.
This is dated support for the hold, not proof that no unpublished agreement
exists.

The [Ontario guidelines](https://www.ontario.ca/files/2026-06/mmah-dcrp-application-guidelines-and-faq-en-2026-06-01.pdf)
say TPAs had to be executed before August 15, 2026. The August 26 and 28
releases still describe them as future conditions. No official amendment or
extension was found. This is an unresolved publisher inconsistency, not proof
that a TPA was signed.

**Trigger assessment:** no signed Canada-Ontario BCSF agreement, completed
federal approval, signed municipal TPA, first payment, or DCRP-attributable
construction was found on the checked pages. The Housing disbursement or
construction condition remains unmet. This dated hold is not proof that no
unpublished action exists, and it does not move the grade automatically.

The separate July starts release exposed a measure conflict. The live Housing
rationale says the dashboard reads CMHC's six-month trend, while
`docs/Measure-Selection-Rules.md` names monthly SAAR as the primary starts
measure. July's SAAR was 229,074 and the trend was 247,377, placing the two
measures on opposite sides of the 240,000 condition. No trigger treatment is
applied until the editor resolves the governing measure.

## August 15-28 Official Sweep

A code-reconciled sweep covered 241 federal archive rows and 63 Ontario archive
rows. It produced 15 new evidence families across 17 official URLs. None of the
new URLs was already in the prep baseline, and all four known DCRP duplicates
were correctly excluded from the new set.

Ten evidence-only families are recorded in the ledger: July CPI, Ontario
infrastructure funding, the tariff-response package, internal-trade execution,
the Q2 current account, the Craig Mine milestone, two conservation outcomes,
Q2 GDP and investment, and the June Fiscal Monitor. They supply current facts
or context but do not make a grade or promise-status decision.

Four questions enter active September adjudication. One remains editor-parked:

1. Whether the Labrador Trough clean-energy package belongs inside the existing
   national-grid promise scope.
2. Whether Housing's 240,000 condition is governed by monthly SAAR or CMHC's
   six-month trend.
3. Whether Ottawa's August 19 page proves construction when it calls the event
   a groundbreaking but also says construction is expected later in 2026 and
   federal funding remains conditional.
4. Whether the new goods-and-services non-U.S. share from State of Trade 2026
   should sit beside or replace the current goods-only measure.
5. How the August 28 Building Canada Act pre-listing notices affect the Major
   Projects cohort. This remains parked with the wider Major Projects rules.

No direct material event was found for Carbon Pricing Policy, Immigration,
Ethics & Transparency, or standalone Flagship Delivery during this sweep.

## August 29 Open-Row Checkpoint

All 29 monthly and event-driven rows that remained open were checked against
their live publisher controls on August 29. This checkpoint does not populate
the ledger's final Result cells because doing so would make the closed-ledger
validator treat the August 31 evidence boundary as complete.

The row reconciliation was computed as 12 `new release found`, 13
`no event observed`, 2 `OK`, and 2 `blocked`, for 29 total rows.

| Checkpoint result | Rows checked |
|---|---|
| `new release found` | CMHC housing starts; Abacus; Innovative Research; Leger; Nanos; EV policy; Finance announcements; PMO defence announcements; PMO major announcements; National Defence releases; ECCC announcements; department release pages |
| `no event observed` | Angus Reid broad approval; Ipsos broad approval; Ethics Commissioner review; 2030 and 2035 climate targets; net-zero commitment; Flagship execution; NATO verification; carbon border adjustment; Paris status; Fitch sovereign action; S&P sovereign action; federal climate plan; OBPS and fuel-charge policy |
| `OK` | 2 Billion Trees control; Major Projects Office national list |
| `blocked` | Full financial disclosure control; official support for the current emissions-cap promise label |

The four official IRCC binaries were rechecked and again returned HTTP 200.
They retained the same valid shapes and June 2026 latest periods recorded above:
3,867 permanent-resident rows, 49,150 IMP rows, 6,419 TFWP rows, and 5,495
study-permit rows. No malformed rows were found. This does not decide the
Immigration grade.

[Moody's Ratings News](https://ratings.moodys.com/ratings-news) returned no
matching Canada sovereign action. The
[issuer search](https://ratings.moodys.com/ratings/search) still redirected to
sign-in, so the current-detail access exception remains `blocked`. This is a
dated negative search, not proof that no action occurred.

The [Ontario DCRP page](https://www.ontario.ca/page/development-charge-reduction-program),
[federal agreements index](https://housing-infrastructure.canada.ca/bcsf-fbcf/provincial-territorial/index-eng.html),
and the Vaughan, Hamilton, and Bradford West Gwillimbury releases were
rechecked. They still do not establish a signed Ontario agreement, completed
federal approval, signed municipal transfer-payment agreement, first payment,
or DCRP-attributable construction. The Housing condition therefore remains a
dated hold as of August 29, not proof of no unpublished action.

The checkpoint preserved the four existing editor questions and surfaced these
additional decisions for the final cycle review:

1. Whether the Abacus and Leger releases enter the approval mean, while the
   Innovative trade-response release remains outside that construct and Nanos
   stays secondary preferred-PM context.
2. Whether the Coast Guard icebreaker contract belongs inside the current
   Defence scope.
3. Whether the official evidence changes the Promise Delivery treatment for
   2 Billion Trees, the emissions cap, or the replaced EV standard.

No grade, promise status, threshold, methodology rule, or frozen surface moved.
Every negative finding must be refreshed after August 31, and the September 1
scout remains open.

## Ledger State

The generated ledger now names its prior-calendar-month evidence window and
includes durable Excluded Evidence and Bias-Resistance Review sections. Its
source rows and order remain stable across month boundaries.

Checkpoint facts, computed by the scripts:

- 560 rows: 63 monthly, 16 event-driven, 137 quarterly, and 344 twice-yearly.
- 531 rows have dated dispositions. Of those, 475 were marked `not due` because
  the July 1 recertification remains current and no early trigger was found.
- 29 monthly or event-driven rows remain open for the full-window pass.
- 186 unique cited URLs across 341 citation surfaces.
- The canonical fetch result was generated on 2026-08-28.
- Link scan checked 150 URLs: 144 live, 6 blocked, 0 broken, and 0 errors.
- Bias-resistance audit flagged 8 of 12 dimensions, the same total recorded for
  the July 21 run in `docs/Current-Roadmap.md`. No exact flag-set comparison was
  completed at this checkpoint.
- The ledger passes the open structural validator. It is expected to fail the
  `--require-closed` gate until the full window is reviewed.

The canonical fetch also flagged newer StatCan periods for CPI, Labour Force
Survey, population, housing starts, and trade. The trade binding was corrected
from an industry table to StatCan table 12-10-0011-01, the principal trading
partner table named in Global Affairs Canada's December 2025 report. These are
September 1 evidence candidates, not automatic dashboard updates.

## History Sequence

The history check found three real defects. No grade call is needed to identify
them, but the correction method needs an editor decision because the repository
does not define what its review and snapshot dates mean.

1. The August report says the cycle closed August 14, but it includes four
   editor decisions dated August 19 and was first committed on August 22 in
   `c680473`. Major Projects records five progressed projects as of August 14
   even though the fifth was accepted by the editor on August 19.
2. `history.json` omits both May and June. The May ledger and summary identify
   May 13, while the playbook calls it May 14. June has a closed source ledger,
   promise recertification, and release records but no snapshot.
3. The April history snapshot dated April 17 already carries Climate at D. The
   grade actually moved in commit `c17f269` on April 15, but the reader-facing
   changelog rolls the grade item into the April 19 publication entry. Without
   explicit effective-date and publication-date semantics, the public sequence
   reads as if the snapshot predates the move.

### Recommended Semantics

Use separate meanings:

- `evidence window` is the policy evidence interval.
- `review date` is when a file's result was finalized, including editor
  adjudication.
- `snapshot date` is when the combined dashboard state became effective.
- `publication date` is when that state or explanation became public.

Two existing rules constrain the correction. `docs/Corrections-Policy.md` says
past changelog entries remain as published, and
`docs/Frozen-Rule-Adjudication-2026-07-21.md` says existing `history.json`
snapshots are not rewritten after a later correction. The default correction
must therefore be additive. Overriding either rule requires an explicit editor
methodology decision, not only a date-label decision.

If the editor accepts the date rule, make these exact additive corrections in
a visible data-correction release:

1. Set the live Major Projects `latestReview.date` to `2026-08-19` and add a
   current correction entry. Do not alter the existing August history snapshot.
2. Add a retrospective note to the August report that distinguishes the August
   14 preparation close, August 19 editor adjudication, and August 22
   publication. Preserve the original header as published.
3. Add a current `type: correction` changelog item that states the August
   snapshot contains an August 19 adjudication despite its August 14 label.
   Follow the Corrections Policy disclosure and About-page link requirements.
4. Insert a May snapshot dated `2026-05-13`, reconstructed from published v5.22
   commit `e61a827`: overall GPA 1.79, household GPA 1.63, grades A-, C, C, D,
   D-, C, D, C+, D, C, C, and tracker C+ in dashboard order. Promise counts
   were 14 Delivered, 13 In Progress, 5 Too Early, 8 Stalled, 3 Abandoned, and
   0 Thwarted. The release was published through Pages run `25821152667`.
5. Insert a June snapshot dated `2026-06-05`, reconstructed from published
   v5.99 commit `67ca1075`: overall GPA 1.79, household GPA 1.63, the same
   dashboard-order grades as May, and promise counts of 14 Delivered, 13 In
   Progress, 5 Too Early, 8 Stalled, 3 Abandoned, and 0 Thwarted. The release
   was published through Pages run `27038571966`.
6. Preserve both existing April changelog entries. Add a current correction
   item stating that the Climate move was effective April 15 and was rolled into
   the April 19 reader-facing publication entry.
7. After May and June are backfilled, add a regression test that rejects a
   missing monthly snapshot for any completed cycle. Add a separate fixture for
   effective, snapshot, and publication date ordering on new records.

Required gates: editor approval of the date semantics, an explicit decision if
the editor wants to override the no-rewrite rules, exact GPA and promise-count
reconstruction in code, and a first-correction schema update. The Corrections
Policy requires `type: "correction"`, but the live first-look validator does not
yet allow that type and the Change Log does not give it an explicit visible
treatment. The policy also requires `affectedDimension`, while this defect
belongs to the history surface. Add and test visible correction handling,
define a supported non-dimension target such as `affectedSurface: "history"`,
record that policy-schema change as a methodology item, and link the recent
correction from About before publishing it. Then run `npm run test:data`,
changelog validation, and a different-AI review.

## Scout Readiness

The scheduled August scout run `30704239994` encountered an Anthropic
insufficient-credit error. The workflow still ended successfully because the
monitor treated classification failure as a warning. That is a release-control
defect.

The hardening candidate makes live and backtest runs fail when required
Tavily search or Anthropic classification does not complete. It also prevents
failed candidates from advancing monitor state, so a retry cannot suppress
unclassified evidence and pass with an empty result. Strict deterministic runs
must match the requested cycle, include every configured feed and cited bill,
and complete the requested link scan against every cited URL. Malformed or
partial classifier rows also fail before candidate state is mutated.

The final race-safety pass adds a host-local exclusive run lock before monitor
input parsing or paid work. A concurrent process using the same case-normalized
resolved state path exits nonzero, so it cannot overwrite accepted output from a
stale state snapshot. The operating system releases that lock when the process
ends.
Existing state paths that are symbolic links or have hard-link aliases are
rejected. A missing state under a symbolic-linked parent is canonicalized once
for locking, marker placement, state writes, and rollback.

The later retry-safety pass adds a separate persistent recovery marker before
accepted state replacement. Accepted outputs or exact rollback clear it. A
failed rollback or marker cleanup leaves it in place, and a same-state retry
stops before deterministic input or paid work until the prior state, packet, and
ledger are reconciled.

Transient Tavily 429, 5xx, network, or JSON failures retry once. An exhausted
retry still fails the cycle. A failed strict deterministic preflight stops
Tavily and Anthropic before paid work. The workflow preserves and commits the
in-progress cycle ledger, and its local-path guard covers that ledger before a
push. The data gate also confirms that every configured StatCan table has a
dashboard metric with the matching `sourceId` and a parseable reference period.

Repository secrets for Tavily and Anthropic exist, but secret presence does not
prove usable Anthropic credit. The September 1 scout remains externally blocked
until the account can complete a classified request. No post-hardening workflow
run has yet proved the live path.

## September 1 Runbook

1. Continue the existing ledger in place after the August 31 boundary. Do not
   rerun the generator or use `--force` after checked rows exist. Manually add
   new exact-source rows and preserve every recorded disposition. The workflow
   must generate a ledger only when the cycle file is missing.
2. Run the canonical fetch and link scan again.
3. Run the scheduled source scout and require search plus classification to
   pass. A warning-only or unclassified packet is a failed run.
4. Review all August candidates and all newer StatCan periods against the
   pre-committed triggers.
5. Recheck Moody's and the official Housing control pages for events after
   August 28.
6. Record excluded evidence and rerun the bias-resistance audit.
7. Put every grade, promise-status, methodology, and frozen-surface judgment to
   the editor.
8. Run the closed-ledger validator, data tests, build, browser checks,
   cross-AI review, and the normal release gates before publication.

## Boundaries

- The retired `docs/v2/verification/ledgers/` files are historical and are not
  part of this cycle.
- Scout candidate JSON is discovery output, not the source-coverage ledger.
- Repeated cadence rows are intentional citation-surface checks, not duplicate
  evidence claims.
- Major Projects, the reader study, and inter-rater follow-up remain parked by
  editor instruction.
