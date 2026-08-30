# Current Roadmap

**Purpose:** Keep the next steps explicit so new ideas do not have to live in memory.

**Status:** Active working roadmap for the live dashboard.

**Last updated:** 2026-08-29

---

## Current State

- v5.177 is live at release commit
  `a082446ccc0a93cd8101e20080c21e0e59752306`. It corrects the Defence &
  Trade source contract to StatCan table 12-10-0011-01, corrects the two
  Immigration metrics to new-arrival language and direct official sources, and
  makes IRCC freshness use the maximum valid period instead of the final file
  row. Pages run `33235403800`, artifact `9709757738`, and deployment
  `6152596687` passed. Automatic Live Dashboard Audit run `33235702687`,
  artifact `9709904616`, then recorded `362/362` passing checks against that
  exact deployed commit. Claude returned `VERDICT: APPROVED` after the new IRCC
  contract test was staged. Manual live checks at `1280 x 900` and `390 x 844`
  found no horizontal overflow or console errors in the changed Defence & Trade
  and Immigration Evidence views. The production header reports v5.177. No
  grade, score, promise status, methodology, threshold, formula, weight, or
  dimension-model change was made. The next scheduled evidence update is
  2026-09-01.
- Three outage-era Actions records remain stranded in a contradictory state:
  Pages run `32985532383` at `d6f7c70` and audit runs `32984452288` and
  `32983983025` at `4d0b326` report `queued` but expose zero jobs, check runs,
  or artifacts, with no timestamp movement since creation. On 2026-08-27,
  normal cancellation said they were complete and force-cancellation said they
  were not queued. Later v5.176 deploy and audit runs passed, so these are
  stranded metadata rather than an active release gate. Leave the records
  untouched. If any gains a job or affects checks or queue reporting, escalate
  the contradictory state to GitHub Support and rerun production acceptance.
- Inspectability structure is live across the dashboard.
- Ethics & Transparency is normalized to a true whole-letter `C` with GPA `2.0`.
- Flagship Delivery is normalized to a true whole-letter `C` with GPA `2.0`.
- Stale whole-letter scoring references have been cleaned up in current-state docs.
- Cross-dimension drift audit of the 9 non-probationary graded dimensions passed with minor notes.
- Source sufficiency audit across the 11 graded live dimensions is complete.
- Source-band rebalance is complete: live dimension source arrays now sit inside the 5-8 target band or the documented 10-source ceiling. At-ceiling dimensions use trim-before-add unless the editor explicitly approves a one-off relaxation.
- Hard rule adopted for source edits: missing URL / source-chain fixes can be added directly, but any new analytical source family must go through a reflection pass and Claude review before it is treated as settled.
- AI workflow efficiency protocol is now adopted to make reflection/review escalation explicit and reduce over-reflection on bounded tasks.
- Source hardening pass for the weakest dimensions is complete.
- Confidence calibration check is complete; no rescore was required after hardening.
- Source Authority Map is active and integrated into the governance layer.
- Source Characterization Register is active as the canonical per-source-family record (institution type, ownership/funding, editorial independence, grounded ideological tendency, best-use boundary, strongest SAM-role fit, trust flags) across the graded-dimension and Approval Signal source families. The register's own category summary in [Source-Characterization-Register.md](Source-Characterization-Register.md) is the count of record.
- Tiny audit-fix pack is complete: Ethics is correctly marked as probationary in the register, and `meta.json` now reflects the live package update date.
- QA-Gatekeeping-Rules.md has been amended to cover grade holds with source-stack change, confidence revisits, whole-letter probationary precision, Combination-Rule-driven changes, new analytical source-family additions (new Rule 8), same-family concentration (Rule 6 addition), symmetric confidence revisit (Rule 4 expansion), tier-nuance on government-data vs press-release and advocacy-with-methodology (Rule 1 edge-case notes), and navigation cross-references to SVP, Carry-Forward-Rules, PMDR, Deconfliction-Matrix, and SAM.
- Ethics source chain strengthened, Office of the Ethics Commissioner and PM blind-trust summary statement added to the live Ethics `sources` array as Tier 1 anchors (traceability fix under the new-analytical-source-family hard rule).
- Ethics anchored indicator landed, the live Ethics entry now carries an official-status anchor set (Commissioner review status, blind trust status, agreed measure filing, declared screen scope, independent governance review status) anchored to direct official filings and the Commissioner registry.
- Live review pass of the dashboard is complete; minor copy-staleness in About and the Dashboard footer was corrected in pass.
- SAM Current State Delta fields reconciled for Ethics, Flagship Delivery, and Climate & Environment after source threading landed.
- Pre-cycle readiness guardrails refreshed in the live data for the most failure-prone files: announcement-bias wording tightened in Economic Policy Response, scope/trigger discipline sharpened in Affordability Response, Carbon Pricing / Climate deconfliction cues made more explicit, and Housing stage language now distinguishes announced from not started.
- Independent methods review is complete; methods hold with targeted amendments and no structural defect blocks another full cycle.
- Commitment Traceability Map is active as a governance join layer across 36 commitments in 11 graded dimensions.
- The Major Projects / Flagship Delivery overlap on the MPO two-year-timeline commitment is resolved. Major Projects remains the sole home; Flagship now carries it only as derivative delivery evidence.
- Dimension cards show grade, rationale, scope, metrics, perspectives, and sources on expansion; confidence / attribution / lag metadata lives in dimensions.json and docs but is no longer rendered as on-card pills (pills were removed 2026-04-19 as not self-explanatory to general readers).
- Promise Tracker link coverage is now close to complete: all 43 tracked promises have original-source links, and 42 of 43 have status-evidence links. The remaining status-link gap is Carbon Border Adjustment Mechanism, where no clean launch or framework document has surfaced yet.
- Consistency self-audit is now active in [Consistency-Self-Audit-2026-05.md](Consistency-Self-Audit-2026-05.md); current outliers are tracked as structural exceptions rather than hidden drift.
- Bias-resistance audit infrastructure is live. `scripts/audit-bias-resistance.mjs` runs against the live `dimensions.json` and reports source-family distribution, trigger symmetry, and grade-moving evidence balance across all 11 graded dimensions. The July 21 run flags 8 dimensions for documented patterns, including intentionally event-driven trigger labels on Economic and Ethics rather than misleading single-source links. The audit-script taxonomy recognizes 11 source families including industry/sector associations and the financial-institution-research family that remains in family 9 pending a future family-12 decision.
- Per-criterion operationalization landed for Economic Policy Response (5 core levers enumerated with announced/authorized/executing status), Ethics & Transparency (5 disclosure-machinery components with present-if-X criteria), and Flagship Delivery (full Combination Rule arithmetic published in `gradeBasis`). The v5.163 policy-detail workspace keeps that material visible in Method without another expandable layer.
- Cross-ideological challenge sources are now threaded into specific metric chains and grade triggers for Climate & Environment (Fraser EV-mandate critique, MLI energy-superpower gap, CER Energy Future 2023, OAG 2025 GHG-emissions audit), Affordability Response (Fraser GST critique, CFIB, Retail Council of Canada, Food Banks Canada Hunger Count, Conference Board / Signal49), Economic Policy Response (CSLS Canadian Productivity Review, Conference Board / Signal49), Housing Supply (CHBA Q1 2026 HMI, Scotiabank Economics), Ethics & Transparency (Transparency International Canada, Democracy Watch, House ETHI Report 5), and Immigration (Macdonald-Laurier Institute, Maytree). All threading uses exact publication URLs.
- AI verification methodology is documented in [AI-Verification-Methodology.md](AI-Verification-Methodology.md). Three-model panel approach (one each from different model families), verbatim-quote anti-confabulation rule, convergence cuts (3-of-3 = real signal, 2-of-3 = candidate, 1-of-3 = artifact). The May 2026 panel runs (LaunchSims, Grok, Comet R1, Perplexity, Comet R2) are captured in their respective `docs/*-Review-*.md` files.
- Frozen-surface protection. `src/utils.js` opens with a FROZEN SURFACE comment block naming the four protected functions and the test-update protocol. `scripts/test-gpa-frozen-surface.mjs` runs 56 assertions across 9 test groups and is wired into `npm run test:data` and the prebuild. `scripts/validate-dimensions.mjs` imports `POCKETBOOK_DIMS` from a single source of truth and now warns on malformed `metric.sourceRefs`, `gradeTriggers.additionalSources`, and the `gradeBasis` operationalization structured fields. `eslint.config.js` warns on inline hex color literals in components.
- About page now opens with an editor disclosure (independent business and operations consultant), political affiliation, professional conflicts, funding, AI-assistance disclosure, and recusal policy. The "what this does not grade" list explicitly names Indigenous reconciliation, healthcare federal-provincial transfers, public-sector bargaining, pre-designation pipeline announcements, foreign policy beyond defence/trade, and specific defence procurement contracts, each with a published rationale for exclusion. Past Versions surface points readers to the Change Log, GitHub commit history, the data folder at any commit, and per-cycle closure memos.
- Bundle generator (`npm run bundle`) builds a multi-megabyte markdown bundle of every git-tracked text file in the repo for handing to external AI reviewers. Output writes to `tmp/perplexity-bundle.md` plus copies to `~/Downloads` and `~/Desktop`. The Claude Code `/bundle` slash command wraps this.
- Monthly source monitor is live. `scripts/monitor_sources.py` reads the deterministic pullers in `fetch-data.py` (now via `--json-out`), adds a Tavily search fan-out over the feed-less and blocked surfaces, runs a `claude-opus-4-8` relevance pass that only routes candidates, and writes a candidate ledger plus an editor packet under `monitoring/` and `docs/Source-Monitoring-Candidates-YYYY-MM.md`. State lives in `monitoring/state.json` and `monitoring/sources.json` (registry built from the cited URLs). The Ethics diff cache lives in `monitoring/`. The hardening candidate separates read-only analysis from review-branch publication. Privacy-cleared failed diagnostics remain explicitly not accepted, while successful live analysis may pass five fixed monitoring files to a separate guarded publish job. The workflow never pushes to `main` or moves a grade. The live workflow requires both paid-tier API keys and complete tiers. Missing keys prevent publication. Optional local diagnostics may record skipped tiers, but cannot advance `monitoring/state.json`. Full design in [Source-Monitoring-System.md](Source-Monitoring-System.md). Offline checks: `npm run test:monitor`.
- Dated source stacks are live. Cited sources carry `date` / `dateKind` metadata, and the source-date follow-up gate is closed with zero `needsManualDate` flags. Living pages use `as-of`; updated-only pages use `updated`; static releases and filings use `published`. The source-ordering metadata is display-only and does not move grades, statuses, thresholds, or source order. The review record is [Source-Dates-Review.md](Source-Dates-Review.md).
- The app shell is live at the root (v5.119 cutover, v5.120 post-cutover polish), with the classic rollback route retired in v5.142 after a clean June 29 route-exit audit. v5.120 added mobile navigation icons, a promise active-filter return affordance, bottom-navigation re-entry motion, semantic section navigation, and the viewport-flip body-lock and history fix. The opened-dimension drawer was then reworked across v5.121-v5.126: evidence-leads information architecture with a check-this-grade layer and score-leads hero (v5.121), a headline commitment row showing stated target vs. result (v5.122), a dimension-scoped Promises filter (v5.123), Red Tape Review and Foreign Policy Review promise status-evidence updates (v5.123, v5.125), and a display-only drawer typography pass (v5.126). Later releases layered on Kit signup, clickable Promises, title clarification, dark theme, app-card polish, dashboard status, source freshness, drawer reading order, the v5.139-v5.140 plain-language passes, the v5.141 data-driven next-checks strip and manual Playwright browser smoke, then the v5.142 browser-smoke CI gate. v5.143 adds the sourced grade-move evidence loop, v5.144 adds the first beauty / identity pass, v5.145 fixes mobile drawer containment after that pass, v5.146 fixes the mobile header badge collision, v5.147 makes that header spacing rule cross-viewport with browser-smoke coverage, v5.148 lands the June 30 review follow-through on the live surface, v5.149 adds the full-changelog link (published to `main` with the v5.150 push), and v5.150 is the separate July monthly-cycle factual refresh with no grade moves. The same evening, v5.151 landed the app-workspace release: a fixed desktop sidebar on wide screens that stays visible while a dimension is open (phones keep the bottom navigation, mid-size screens keep the top tabs), an authored one-line verdict on each graded card checked by the data validator so it can never carry a grade letter or urgency wording, a per-card next-check line taken word for word from the existing trigger data, a client-only since-your-last-visit note whose last-seen marker stays on the reader's device, and a deterministic .ics calendar file for the next update in the footer follow block; web push was considered and rejected because a static site would need a third-party push service, which fails the privacy bar. v5.152 then landed the trust surfaces: every up and down trigger shows the date its condition was published, the score-derivation panel carries a matching one-line provenance statement, the Change Log opens on the newest twelve entries with documentation and minor items folded per entry and earlier history behind an explicit button, returning readers who are caught up see one quiet line with the next scheduled update date, and the theme button cycles light, dark, and system. No scoring, formula, threshold, weight, or dimension-model change is part of any of these releases; v5.150 only refreshed factual source data and methodology state, and v5.151 and v5.152 are product and presentation work with no grade moves and no methodology change.
- Repo-local Agent Skills for source workflows are live in `.claude/skills/`: `source-addition`, `source-audit`, `grade-evaluation`, `monthly-cycle`, `bias-resistance-check`, `scope-guard` (explicit-invocation only). Plus the Nate-inspired AI workflow layer: `project-room` (with the four-artifact discipline: source inventory table, conflict log, missing context list, duplicates report) and `ai-question-method`. The scope-guard runs against `origin/main...HEAD` for push-bound commits.
- The optional Perplexity / Comet / Claude Desktop filesystem MCP bridge is paused. A July 19 review found that the non-writable snapshot still copied ignored local identity, personal-context, machine-path, generated-output, test-result, and scratch files; direct modes were write-capable; and public tunnels lacked compatible authentication. The launcher now exits without starting any connector mode, and [Perplexity-MCP-Setup.md](Perplexity-MCP-Setup.md) routes remote review through the tracked-file bundle, rendered evidence pack, and live browser tab. The decision record is [MCP-vs-Scripts-Decision-2026-07-19.md](MCP-vs-Scripts-Decision-2026-07-19.md).
- May source-health recertification (v5.70) refreshed broken source URLs across the Signal49, IRCC Open Data, Maytree, The Narwhal, and ECCC climate-promise entries. June carry-forward freshness candidates logged in [Source-Recertification-2026-05-25.md](Source-Recertification-2026-05-25.md): April 2026 Food CPI, Q1 2026 population data, April 2026 housing starts, March 2026 trade data, PBO fuel-excise-tax note, new approval polling releases.

---

## Recently Completed

- v5.177 source-contract and September-preparation release - release commit
  `a082446` replaces the incorrect StatCan industry-table binding with the
  principal-trading-partner table, fixes Immigration source attribution and
  wording, fails malformed IRCC data closed, and records the August 28 evidence
  checkpoint without making an editor decision. The 560-row September ledger
  has 531 dated dispositions, 475 cadence deferrals with explicit next-due
  dates, and 29 rows still open through the August 31 boundary. Pages run
  `33235403800`, artifact `9709757738`, and deployment `6152596687` passed.
  Automatic audit run `33235702687`, artifact `9709904616`, matched the exact
  deployed commit and passed `362/362` checks. Desktop and mobile live checks of
  the changed Evidence views also passed. Claude's final binary gate returned
  `VERDICT: APPROVED`.

- Release-audit hardening acceptance - implementation commit `cab562b` makes
  the optional manual target commit control checkout, job concurrency, and the
  deployed-marker comparison. Job-level concurrency keeps a skipped Pages event
  from cancelling an active audit. Missing-marker, browser-lifecycle,
  historical-record, secondary-rationale, and workflow-structure regressions
  now have focused coverage. The final read-only Claude review is preserved in
  [Release-Audit-Hardening-Review-2026-08-28.md](Release-Audit-Hardening-Review-2026-08-28.md).
  Pages run `33228763272` passed. Automatic audit run `33229128825`,
  artifact `9707963341`, and manual exact-commit audit run `33229379418`, artifact
  `9708040440`, each recorded `362/362` passing checks against the exact deployed
  commit. Negative acceptance run `33229384616` used a malformed target and
  failed at checkout as intended instead of silently auditing another commit.
  No user-facing content, grade, score, status, methodology, frozen surface, or
  version changed.

- v5.176 source-record and release-check hardening - release commit `c73ca98`
  names all five Major Projects with post-referral advancement, refreshes the
  monthly source inputs without changing a grade or score, and requires browser
  release checks to bind to the expected deployed commit. Pages run
  `33136261054` and hosted audit run `33136664394` passed. The hosted report
  recorded `362/362` checks against the exact release commit in artifact
  `9672382988`. Desktop and mobile live checks also passed the affected
  first-look and Housing route. Claude independently rechecked the release facts
  and live sanity surfaces and returned `VERDICT: APPROVED`.

- v5.175 mobile first-look correction - release correction `b83fef8` moves the
  Housing watch route into a dedicated mobile action and stacks the first-look
  grids through 640 pixels without changing the watch wording. Pages run
  `32983288985` passed review-handoff, build, 256 browser cases with 2 intentional
  skips, and deploy. Hosted audit run `33011050751`, dispatched at `d6f7c70`,
  then passed `358/358` checks against the live v5.175 deployment from Pages run
  `32983288985` at `4d0b326`, closing the release gate.

- July source-monitor reconciliation and PR close - commit `4d0b326` preserves
  the July packet and ledger without importing older monitoring state. The 67
  surfaced records close as 8 exact matches, 10 superseded records, 44
  family-batch closures, and 5 manual reviews. Final outcomes are 7 dashboard
  incorporations, 2 cycle-report records, 58 no-move decisions, and 0
  unresolved. The 57 suppressed records remain for traceability. PR 30 closed
  without merge on 2026-08-26, and PR 31 was already closed stale.

- v2 tri-lens closure - the deferred first monthly shadow cycle is formally
  closed rather than reconstructed with hindsight. The required post-mortem
  records the operating failure without claiming the untested architecture
  failed. The unused monthly checklist and tri-lens files are historical;
  three definitions still cited by live QA now carry narrow companion status.
  See the [closure post-mortem](v2/V2-Tri-Lens-Closure-Post-Mortem-2026-08-25.md).

- External governance cleanup - the old Trust and Bias Resistance Plan is now
  historical and points to the current protocol, playbook, and gate documents.
  The separate red-team invite remains unsent because no recipient or channel
  is recorded. See the
  [historical plan](Trust-And-Bias-Resistance-Plan-2026-05.md).

- v5.174 count-consistency correction - four remaining stale Major Projects
  statements were corrected, and the cohort guard now reads every policy-card
  sentence instead of selected fields. This advances data consistency without
  changing a grade or score.

- v5.173 release-gate correction - required checks now block publication when
  they fail, and same-day project milestones require an evidence note. This
  advances release discipline without changing a grade or score.

- v5.172 card-consistency correction - Major Projects text was aligned with
  the project list, the climate budget trigger retained its stated baseline,
  and healthy official pages stopped producing false link failures. This
  advances traceability and exposed the need for broader count checks.

- v5.171 project-context and source-link correction - Darlington and McIlvenna
  Bay gained timing context, two Ethics Commissioner links were repaired, and
  source-tier handling followed the institution after its site move. This
  advances evidence inspectability without changing a grade or score.

- v5.170 inherited-date and source-link correction - five project dates were
  corrected so inherited approvals no longer looked like later progress, 17
  moved project links were repaired, and cited links gained an opening check.
  This advances source integrity without changing a grade or score.

- v5.169 August evidence cycle - the July 1-31 evidence window closed across
  the 11 graded files and 43 promises, with no grade or promise-status move.
  The cycle advanced the monthly evidence ledger and retained five named access
  exceptions for the next due check.

- v5.168 mobile-readability release - practical phone type floors, full-width
  signal rows, and fixed-navigation clearance checks improved the first look at
  `320 x 568`, `375 x 812`, and `390 x 844`. The release advanced mobile
  readability and exposed the need for content-shape fixtures.

- v5.167 policy quick-read release - the July 25 pass checked the active Housing
  trigger, first-look hierarchy, and the five-policy four-view workspace before
  making one bounded presentation release. Opened policies now retain their
  authored next checkpoint, dated trigger ledgers live in Evidence instead of
  repeating in Briefing, and Flagship Delivery's current record is separated
  from its Method rule. The release date and Household whole-card interaction
  close two first-look gaps, while mobile first-look controls and sheet focus
  now clear their measured accessibility defects. Pages run `30181762251`
  passed review-handoff, build, 249 browser checks, and deploy. Live Dashboard
  Audit run `30181903904` passed `356/356` checks, and authenticated Claude
  approved the integrated release and final audit-gate correction. This
  advances the roadmap's quick-comprehension and evidence-inspectability goals.
  It exposes two remaining evidence gaps that automation cannot close: the
  eight-reader first-look study and the five-policy human workspace observation.
  No score, grade, trigger, or scoring rule changed.

- v5.166 secondary-signal alignment correction - live mobile geometry showed
  title offsets of 10, 42, and 26 pixels inside three cards with the same top
  edge. The phone layout now shares six intrinsic rows across the cards, so the
  longest real title or description sets the reading line without fixed-height
  breakpoint guesses. Promise Delivery wraps its metric at the narrowest tested
  width, and all three action labels share a 44-pixel footer line. Independent
  review caught that the first regression assertion aligned result containers
  while the visible Promise number remained 22 pixels lower. The fix top-aligns
  that number and the test now measures both container and visible-child
  geometry. At 390 pixels, all three titles start at 9.5 pixels, descriptions at
  24.75, visible results at 69.68, and action centres 32.13 pixels from the card
  bottom; all cards are 178.08 pixels high with no overflow. Browser regression
  checks compare rendered geometry from 320 through the 640/641 breakpoint.
  Data, 69-check app-shell, build, bundle-budget, lint, 9 focused browser, and
  249-case full browser gates passed. Independent re-review and authenticated
  Claude review both returned `VERDICT: APPROVED`. Claude noted that old
  browsers without subgrid remain readable but lose the cosmetic shared-line
  alignment, and that the base button alignment also improves desktop. Neither
  note changes the release scope or warrants work before a real browser report.
  Initial Pages run `30112929941` then passed its build and 246 existing browser
  checks but exposed a `1.625`-pixel Linux glyph-box variance against the new
  one-pixel rendered-text limit. Exact layout boxes remain capped at one pixel;
  rendered text now allows two pixels and reports the failing property, width,
  spread, and values. The prior 22-pixel visible-result defect remains well
  outside the limit. Focused checks passed with both local and hosted-equivalent
  concurrency, and the full two-worker matrix passed `249/249`. Independent
  re-review and a focused authenticated Claude review approved the portability
  correction. Replacement Pages run `30114357988` passed build, 249 browser
  checks, and deploy. Live Dashboard Audit run `30114654381` then passed
  `356/356` checks. This advances the first-look readability goal and exposes
  no content or scoring change.

- v5.165 Household control correction and local regression - a reader screenshot
  exposed that the shared `grid-area: math` rule created an unintended second
  column inside the mobile Household card. At 390 pixels, the live card measured
  118 pixels wide while the control measured 37 pixels and wrapped to four
  lines. The scoped override restores normal grid placement and full content
  width. The focused desktop and mobile browser checks now assert both the
  44-pixel minimum target and the mobile height ceiling that prevents the
  four-line regression. Data, app-shell, lint, build, six focused browser, and
  246-case browser gates passed; the 15 deferred-request cases affected by the
  documented stale local preview process passed in five fresh batches.
  Independent Codex and Claude reviews approved the correction. Pages run
  `30059642493` passed and Live Dashboard Audit run `30059851691` reported
  `356/356` checks. The production control measures `100 x 44` pixels at a
  390-pixel viewport with no horizontal overflow. This advances the first-look
  readability goal and exposes no broader signal-card layout defect.

- v5.164 first-look release - the approved
  first-look contract now reads one validated authored verdict, a deterministic
  projection of the newest release, and the first published next check. Direct
  inspection at `375 x 812` placed the result, reason, release state, watch,
  scoring boundary, and both inspect routes above the fixed navigation with no
  horizontal overflow. At `1280 x 900`, the complete briefing and the three
  secondary signals fit in the first viewport. This advances the readability
  goal without changing a score or reopening the policy workspace. It exposes
  the timed human comprehension check as the remaining product question. The
  editor explicitly advanced the work before August without displacing the
  monthly cycle. Standards, Spec, and a focused read-only Claude pass approved
  the final candidate after route, timing, touch-target, copy, and
  accessibility corrections. The 246-case browser matrix and 356-row local
  rendered-content check passed with zero issues. Release commit `985765b`
  deployed through Pages run `30055354606`. Its first post-deploy audit exposed
  a fixed-wait race in the audit harness rather than a product-route defect.
  Follow-up `d622df0` now waits for the exact lazy target and fails closed on
  publisher request errors. Two focused agent re-reviews and Claude approved
  the correction. Pages run `30056858119` passed build, the 246-case browser
  gate, and deploy; Live Dashboard Audit run `30057055063` passed `356/356`
  checks. The record is
  [First-Look-Briefing-Release-2026-07-23.md](First-Look-Briefing-Release-2026-07-23.md).

- First-look modernization review - the July 23 live inspection found that v5.163 explains the scorecard before showing its result: at `375 x 812`, the headline row begins near `y=907` and the policy grid near `y=2863`; at `1280 x 900`, the headline row begins near `y=639` and extends beyond the first viewport. Current official product research kept Flighty as the broad model and selected Robinhood Cortex, Apple Health, Axios, incident.io, and Sentry as the new bounded first-look references. This advances the readability goal by turning a renewed user signal into a measurable prototype contract for result, reason, latest change, next checkpoint, and evidence, and it exposes overview hierarchy, headline-role confusion, and freshness comprehension as the next test. Standards and specification agents approved the corrected record, and authenticated Claude approved its second adversarial pass. No dashboard, score, method, or data changed. The decision record is [First-Look-Modernization-Review-2026-07-23.md](First-Look-Modernization-Review-2026-07-23.md).

- v5.163 dimension-content release - the disclosure-heavy opened-policy stack is live as Briefing, Evidence, History, and Method sibling views. Briefing keeps the verdict, lead metrics, why-not explanations, complete trigger band, judgment, and latest review visible without another drawer. Evidence carries the canonical records, History carries one dated sequence plus Housing's evidence-review detail, and Method carries thresholds, rules, operationalization, and scope. This advances the inspectability goal by replacing schema-shaped reading work with a stable answer-first path; it exposed canonical-record findability and history growth as the August observation questions. Release commit `d091fc3`, Pages run `30013234857`, and Live Dashboard Audit run `30013591946` passed. The production header reports v5.163 and the direct production audit reported `PASS=348` and `ISSUE=0`. No scoring or methodology changed. The release record is [Dimension-Briefing-Workspace-Release-2026-07-22.md](Dimension-Briefing-Workspace-Release-2026-07-22.md).

- v5.162 held-review release and validator closeout - ten held grades now carry authored, dated review outcomes while Economic Policy remains on its grade-move record and Promise Delivery remains an ungraded tracker. Pages run `29946680527` and Live Dashboard Audit run `29946942650` passed. On July 23, a fixture-driven regression suite closed the release's validator residual by checking current data plus 23 invalid `latestReview` cases through the production validator. The suite covers tracker misuse, object shape, unknown keys, date boundaries, grade-move ordering, outcome, empty and long copy, three grade-token forms, nine urgency phrases, and the missing-review-or-grade-move rule. This advances the trust and correctness goal by proving rejection behavior, not only successful live data, and unblocks later held-review updates from reusing the schema without an untested guard. Future structured validator branches should receive negative fixtures in the same change rather than creating another deferred residual. No policy data, score, threshold, formula, or frozen surface changed. The release record is [Held-Grade-Review-Release-2026-07-22.md](Held-Grade-Review-Release-2026-07-22.md).

- v5.161 policy decision brief and navigation release - Housing now exposes the July 22 DCRP review as one dated decision: what earned early credit, what limited it, which delivery steps remain unproven, why the trigger stayed off, and what to check next. Misleading hostname-inferred authority tiers were removed while source dates and use labels stayed intact. Desktop Previous and Next controls move across the 11 graded policies with replacement history, focus, and announcement behavior; mobile remains unchanged. Data, frozen-surface, app-shell, lint, build, bundle-budget, 162-test browser, local 530-row audit, Claude, Pages, production interaction, and 530-row live-audit gates passed. Pages run `29933724138` deployed commit `0da9cc5`; Live Dashboard Audit run `29933987972` passed 530 checks with zero issues. No scoring or frozen surface changed. The release record is [Policy-Decision-Brief-Release-2026-07-22.md](Policy-Decision-Brief-Release-2026-07-22.md).

- v5.160 contextual sharing release - the existing Share control now sends a detached, dated scorecard result with the exact policy deep link; Promise Delivery is identified as a tracker instead of exposing its informational grade. Deterministic, app-shell, lint, build, bundle-budget, and 156-test browser gates passed before publication. Pages run `29884796740` deployed commit `a1eb18f`, the live header and Housing Share control were inspected, and Live Dashboard Audit run `29884939039` passed 530 checks with zero issues. The editor instructed publication after the remaining physical iOS and Android share-target observation gap was named, so that gap is recorded as an exception rather than a pass. No scoring or frozen surface changed. The decision record is [Instagram-Pattern-Decision-2026-07-21.md](Instagram-Pattern-Decision-2026-07-21.md).

- v5.159 frozen-rule correction and review-tooling release - three documented scoring conflicts are closed without changing the aggregate formula, weights, penalty formulas, dimension model, or July 1 history snapshot. Economic Policy moves from D to C as a rule-application correction while retaining a declining trend. Defence and Trade use separate whole-letter ladders whose equal-weight A and B average maps to A-. House ETHI Report 5 counts as both the independent-review component and one institutional critique, with Ethics holding at C. The compact Dashboard Status audit now reveals hidden details before checking them, and the unsafe filesystem MCP launcher remains blocked while the tracked-file bundle boundary has regression coverage in CI. Two internal adversarial lanes ended APPROVED; the release-integrity lane found no technical defect and remained REVISE only on the different-AI gate. The original Claude transfer was blocked by tenant policy, so the editor granted a one-time v5.159 exception without treating that refusal as approval. After publication, authenticated Claude reviewed the committed release and deployment record read-only and returned `VERDICT: APPROVED` with no release defect. Local data, frozen-surface, bias-resistance, review-handoff, syntax, workflow, lint, build, 53-check app-shell, 141-test browser, and 530-row audit gates passed. Pages run `29862076550` passed on attempt 2, and the production header and corrected desktop and mobile surfaces were inspected. The adjudication is [Frozen-Rule-Adjudication-2026-07-21.md](Frozen-Rule-Adjudication-2026-07-21.md).

- Responsive benchmark and bounded v5.158 release - the live v5.157 baseline reproduced the reported 3,370px mobile and 1,509px desktop path to the policy grid. Primary-source checks narrowed the benchmark to Apple Stocks as a scan-to-detail reference, Wikipedia as cautionary evidence, and W3C disclosure and bypass guidance; stale or unsupported Perplexity claims were rejected. The live release adds a history-neutral grade jump after the trust explanation and collapses only the mobile Dashboard Status details while keeping the key review dates visible. Three implementation sub-agents informed the work. Two independent post-implementation Codex reviewers returned APPROVED after accepted route, focus, and regression-test fixes. Authenticated Claude plan and implementation reviews also returned APPROVED, followed by APPROVED post-fix and final release passes. The normal, dark, and reduced-motion browser matrix covers the resulting behavior. Pages run `29842717231` passed and the production header reports v5.158. The decision record is [Responsive-Benchmark-Decision-2026-07-19.md](Responsive-Benchmark-Decision-2026-07-19.md).

- MCP-vs-scripts decision and connector hold - current primary-source research rejected the claim that MCP is obsolete but accepted scripts, direct APIs, CLIs, and skills as this repo's default. The optional filesystem bridge was found outside every product and operations path, while its old snapshot copied ignored local files and its tunnel lacked compatible authentication. The launcher now blocks every connector mode; external review uses targeted files, the tracked-file bundle, rendered evidence, and a live browser tab. Claude returned REVISE on the first adversarial pass, all four findings were corrected, and the second pass returned APPROVED. The record is [MCP-vs-Scripts-Decision-2026-07-19.md](MCP-vs-Scripts-Decision-2026-07-19.md). No dashboard, grade, scoring, source, promise, or frozen surface changed.

- Architectural release package (v5.155) - route-level splitting keeps the Change Log, Promises, Rubric, and About views off the initial scorecard path. A generated grade-change summary preserves first-paint status and returning-reader behavior without loading the full history. DM Sans, DM Mono, and DM Serif Display are local Vite assets. Policy cards own deep links with Back, focus restoration, and Share. A route error boundary contains failed deferred chunks. The manifest-based build gate checks the entry graph and four deferred routes. v5.155 was the expected live version for this package. Its physical iOS edge-swipe and sheet-overscroll checks were not recorded as complete and remain editor-only release checks.
- v5.156 bundle, history, and wording follow-through is live as commit `bd01c46`. The initial graph is 345,966 bytes, down from 535,131 bytes, and the 241,544-byte canonical policy data is deferred without raising either budget. Deterministic parity checks cover 12 dimensions, 43 promise totals and counts, headline GPA inputs, grade moves, and closed-card fields. Four history defects are fixed, and 117 browser tests pass across the default, reduced-motion, and dark Chromium profiles. Meaning-changing readability edits were corrected without changing grades, thresholds, formulas, weights, promise statuses, source stacks, or dimension-model rules. GitHub Pages run `29704209449` passed and the live metadata reports v5.156. The different-AI post-publication review later found no blocker and produced four accepted hardening fixes for v5.157. The review record is [Review-Adjudication-2026-07-19.md](Review-Adjudication-2026-07-19.md).

- v5.157 follow-up is live through commit `faf1bab`. Drawer focus now survives delayed policy-detail loading, retry callbacks are stale-guarded, and the bundle sentinel handles escaped Unicode. Safe readability work is complete for Housing, Ethics, and Promise Delivery. The About page links directly to the continuity plan. August prep corrected the TDCF and CSLS citations and registered House ETHI and Transparency International Canada. The final integrated Claude review approved commit `54e591f` with no blocker after checking the full `d62e1ff..54e591f` diff. Pages run `29708095551` passed, and the live header reports v5.157. No grade, threshold, formula, weight, modifier, trigger, promise status, or dimension-model rule changed.

- App workspace and trust surfaces (v5.151-v5.152) - both landed on 2026-07-01, the same evening as the v5.150 cycle publish. v5.151 made the dashboard read more like an app: the five sections move into a fixed desktop sidebar on wide screens that stays visible while a dimension is open (phones keep the bottom navigation, mid-size screens keep the top tabs), each graded card opens with an authored one-line verdict stored as a validator-checked `verdictLine` field that can never carry a grade letter or urgency wording, each graded card shows a next-check line taken word for word from the existing trigger data, returning readers get a client-only since-your-last-visit note whose last-seen marker stays on the reader's device, and the footer follow block gains a deterministic .ics calendar file for the next update. Web push was considered and rejected: on a static site it would require a third-party push service, which fails the privacy bar. v5.152 added the trust surfaces: every up and down trigger now shows the date its condition was published, the score-derivation panel states in one line that the move rules predate the evidence they now judge, the Change Log opens on the newest twelve entries with documentation and minor items folded per entry and earlier history behind an explicit button, readers who are caught up see one quiet line with the next scheduled update date instead of nothing, and the theme button cycles light, dark, and system. No grade, threshold, formula, weight, promise-status, source-stack, or dimension-model change was part of either release; `src/data/changelog.json` is the authoritative record of both.

- Product evolution and plain-language closeout - v5.129-v5.148 completed the next app-shell polish lane after the drawer rework: the Promises summary card became clickable (v5.129), the title got a clarifier after a reader read it as loaded (v5.130), dimension drawers and explanatory surfaces were rewritten in plainer language (v5.131, v5.139, v5.140), the opened-dimension close button and card polish were tightened (v5.132, v5.134), a stale Carbon Pricing headline figure was corrected with no grade move (v5.133), a dark theme landed (v5.135), dashboard status separated source checking from editor-reviewed score cycles (v5.136), source freshness plus reading-order cues were added to dimension detail (v5.137-v5.138), v5.141 made the next-checks status loop data-driven with a manual Playwright browser smoke, v5.142 retired the classic rollback route while promoting the browser smoke into Pages CI, v5.143 added a sourced grade-move evidence loop that reports current-release grade moves only when matching grade items exist in the latest changelog, v5.144 gave the app shell a calmer civic identity pass, v5.145 fixed the mobile drawer containment edge case found during live verification, v5.146 fixed the mobile Performance Dashboard badge collision, v5.147 applied the same header spacing rule to desktop and added regression coverage, and v5.148 made the review-driven trust fixes visible: composite-score caveats on the two headline score cards, bounded affordability inspectability, clearer Defence & Trade exception wording, and an explicit Flagship probation exit rule. The benchmark pattern trace is now recorded in [Prototype-App-Shell-Parking-2026-05.md](Prototype-App-Shell-Parking-2026-05.md): calm assistant shells, Apple-style glanceability, messenger-style obvious state, thumb-first ergonomics without dark patterns, Maps-style layered disclosure, editorial/data hierarchy, public-sector trust patterns, Linear-like polish, and Temu as the anti-reference. No grade, threshold, formula, weight, promise-status, source-stack, or dimension-model change was part of this lane.

- July 1 monthly cycle (v5.150) - the July factual refresh landed as a separate release after the v5.149 full-changelog-link UI draft. Affordability, Immigration, Housing Supply, and Major Projects all picked up fresher evidence with no grade moves; Approval Signal added the latest Abacus and Léger waves plus June Nanos preferred-PM context while holding Research Co. out on construct grounds; and Flagship Delivery exited probation after passing its first full monthly retention check. Checks passed on `npm run test:data`, `npm run build`, and desktop/mobile browser verification with no page-level overflow.

- Opened-dimension drawer rework (v5.121-v5.126) - on top of the v5.119/v5.120 app-shell cutover, the opened dimension detail was restructured to lead with the evidence that drives each grade and a check-this-grade layer, with a score-leads hero, a unified jump-nav, and plain-language status rewrites (v5.121); a headline commitment row that shows the stated target next to the current result, first applied to Defence's NATO 2% line (v5.122); a dimension-scoped Promises filter so opening a dimension's promises filters the Promises tab to that dimension, plus a Housing promise text/source correction and a Red Tape Review promise status update (v5.123); a Foreign Policy Review promise status-evidence add that kept the promise Too Early (v5.125); and a display-only drawer typography consolidation that namespaced the drawer's font sizing to `--dim-fs-*` tokens and fixed a few visible size inconsistencies, converging through an Act-1 grill plus four Codex rounds (REVISE x3 then APPROVED) before build (v5.126). The locked plan and the Codex review log are archived as [Drawer-Typography-Plan-v5.126.md](Drawer-Typography-Plan-v5.126.md) and [Drawer-Typography-Review-Log-v5.126.md](Drawer-Typography-Review-Log-v5.126.md). No grade, threshold, formula, weight, GPA, source-order, promise-status, or dimension-model change in any of these releases.

- Source-date, monitor, and opened-dimension closeout - v5.113-v5.117 added newest-first source stacks, filled all 99 source dates, repaired the Macdonald-Laurier immigration source link that redirected to an image, adjudicated the June monitor candidate packet, recorded the source-band ceiling decision, and rebuilt the opened-dimension reading surface. C-5 was already reflected in the live files; the Finance tax-cut report became the cleaner Fiscal Health promise source; no grade, threshold, source-order, status, formula, or scoring change happened automatically.

- June 2026 cycle complete and dimension-card redesign shipped, the source-to-trigger pass ran across v5.75-v5.99 (six carry-forward triggers evaluated, all holds; one documented Defence funded-pathway trigger-fire with the grade held A- per [Defence-Funded-Pathway-Memo-2026-05-25.md](Defence-Funded-Pathway-Memo-2026-05-25.md)), with Codex/Comet verification rounds ([Round2-Verification-2026-06.md](Round2-Verification-2026-06.md)) and an external-evidence re-check ([Trigger-Verification-2026-06-09.md](Trigger-Verification-2026-06-09.md)). Separately, the dimension card was rebuilt for concision and an app-style read: score-first card with folded disclosure (v5.100), then the desktop focused-detail view with sticky section nav and exact close-to-grid scroll restore (v5.106-v5.107), then a simpler opened-dimension information architecture (v5.117). Maintenance guardrails landed alongside, the approval-poll aggregation validator and the monthly source-scout workflow (v5.104-v5.105). No grade, threshold, GPA-formula, POCKETBOOK_DIMS, or dimension-model change in the redesign or the re-check.

- May source-coverage hygiene, v5.23 adds [Source-Coverage-Ledger-2026-05.md](Source-Coverage-Ledger-2026-05.md) so the May work is no longer carried by memory or broad source-refresh language. The ledger separates source availability checks, targeted source refreshes, source recertification, and deep research; records which areas were actually checked; and lists the open coverage gaps. [Recurring-Source-Checklist.md](Recurring-Source-Checklist.md) now defines the persistent monthly / quarterly / twice-yearly source checks for future cycles. The inter-rater packet now says clearly that it uses a frozen 2026-04-30 snapshot, the results template pre-fills the snapshot grades, and the broken House ETHI PDF link was replaced with the working House DocumentViewer report page in both the packet and the live Ethics source list. No grade, score, source value, promise status, threshold, modifier rule, or weighting change.
- May 2026 grade-review resolution, Fiscal Health moved D → C after the Spring Economic Update / PBO anchor assessment showed the fiscal anchors currently on track, with caveats keeping the file out of B. The operational-budget-balance promise moved from Stalled to In Progress. Major Projects was reconciled to the official 15-project MPO list and holds C; Housing Supply reviewed the March CMHC starts dip and holds D because the six-month trend remains above the down-trigger floor. Thresholds, formulas, modifier rules, and weights did not change.
- May 2026 targeted source refresh, source availability checks ran cleanly for the configured Statistics Canada, IRCC open data, and Bank of Canada endpoints. Approval Signal polling, Fiscal Health fiscal metrics, Economic Policy labour-market context, and Affordability food-CPI context were refreshed in the live data. Manual grade-review flags and their resolution are logged in [May-2026-Source-Refresh-Notes.md](May-2026-Source-Refresh-Notes.md).
- App-shell root cutover - PR #11 added dimension detail, Promise Delivery framing, promise controls, mobile navigation, and expanded explainer panes. v5.118 exposed the app shell as a public beta at `?experience=app`, then v5.119 made it the root after the review gates closed. The classic dashboard remains at `?experience=classic` for this release. No grade, threshold, formula, weight, promise status, approval data, policy data, or dimension-model change was part of the cutover.
- Mobile card-spacing polish, v5.19 gives the scorecard dimension grid and accountability tracker grid more vertical breathing room on phones, closing the remaining part of the Reddit feedback that grade cards felt cramped while scrolling. No grade, score, source, promise status, threshold, or methodology change.
- Trigger traceability label polish, v5.18 makes the last visible label-only move triggers explicitly say when their source is event-driven. The data invariant now passes with all 49 triggers resolving to an external URL, internal evidence navigation, or event-driven evidence label. No grade, score, source list, promise status, threshold, or methodology change.
- Promise Delivery tracker-doc reconciliation, stale methodology docs that still described Promise Delivery as `C+`, provisional, or awaiting a shadow GPA removal were reconciled to the live decision. Canonical Scoring Sheets now labels Promise Delivery as an ungraded tracker exception, Dimension Status Register no longer asks for a shadow-removal run, and the beta-feedback follow-up now treats tracker framing as resolved while still watching for stale grade language. No grade, score, source, promise status, methodology, or live dashboard change.
- `gpaValue` override check, the override mechanism in [src/utils.js](../src/utils.js) was investigated and should not be retired. It is still live for Ethics & Transparency and Flagship Delivery, where both display as whole-letter `C` and need an explicit 2.0 score value under the current whole-letter decisions. Retaining the override prevents future cleanup from accidentally changing aggregate-score math. No grade, score, source, promise status, methodology, or live dashboard change.
- Inter-rater pilot packet, the first v1 external-rater packet is prepared for Fiscal Health, Affordability Response, and Ethics & Transparency. It gives a reviewer raw metrics, source lists, source-role guidance, thresholds, deconfliction rules, and one-notch triggers while redacting the published grade, editor rationale, judgment calls, perspectives, and active modifier selections. A matching results template and copy-ready reviewer invite are ready so the first completed worksheets can be recruited and scored consistently. No grade, score, source, promise status, methodology, or live dashboard change.
- Cycle preflight tooling fix, the monthly data-fetch script now handles tracker-only dimensions correctly after Promise Delivery stopped carrying a live `grade` field. Pre-cycle source availability now runs end to end again: the current check confirms Statistics Canada tables, IRCC open-data CSVs, and the Bank of Canada API are reachable, and the generated report labels Promise Delivery as `Tracker: no letter grade (informational C+)` instead of crashing. Generated `scripts/output/` files remain ignored and uncommitted. No grade, score, source, promise status, methodology, or live dashboard change.
- Scoring-boundary disclosure, v5.17 closes the remaining Reddit "measurable versus valuable" critique by adding an About-page section that names what the dashboard scores and what it does not: sourceable federal action, documented commitments, published thresholds, and observable outcomes are in scope; leadership style, symbolic politics, popularity, forecasts, and valuable but weakly evidenced outcomes are not scored. Methodology limits now carry the same boundary in compact form. README no longer advertises the removed Print / Export PDF button. No grade, score, weighting, source, promise status, or rubric threshold change.
- Mobile UX bug-fix bundle, v5.16 makes the post-Reddit trust fixes easier to use on phones. The global trust frame now lives under the dashboard title on every tab, and the unmaintained Print / Export PDF button is gone. Promise evidence chips wrap instead of clipping, promise rows show a clearer Details / Hide affordance, project-pipeline and tab-rail scroll cues make hidden columns/tabs discoverable, closing score/approval drill-downs scrolls back to the scoreboard, trigger-level evidence links now share one style, Approval Signal uses the same footer-action slot as the grade cards, trend arrows now carry screen-reader labels/tooltips, duplicate freshness text was removed, and the previous-grade marker was lifted into the readable font floor. No grade, score, weighting, promise status, source, or methodology change.
- Mobile disclosure placement fix, v5.15 moves the headline-score and Approval Signal drill-downs into the scoreboard flex layout itself. On desktop they still sit below the headline row; on phones they are ordered immediately after the card that opened them, so tapping Household Impact, Full Policy Audit, or Approval Signal no longer reveals the detail after the other headline boxes. No grade, score, weighting, promise status, source, or methodology change.
- Internal traceability pass, v5.14 closes the last known-data evidence-home gap before the next UI-heavy trust pass. Trigger rows that point to evidence inside the dashboard now carry internal refs: Major Projects opens the project pipeline, Flagship Delivery jumps to the home-dimension grid, and Promise Delivery opens the Promises tab. The Promise Delivery card also exposes tracker-only trigger traceability without reviving grade language. Defence & Trade's split tripwire now covers both opposite movement and widening sub-score gaps over two consecutive monthly review cycles. Ethics' governance-critique trigger was rephrased to name the threshold directly. No grade, score, weighting, promise status, or external source change.
- Traceability cleanup follow-on, v5.13 tightens the pass that landed in v5.12 instead of changing course. The consistency audit now reflects the live architecture: Promise Delivery is treated as a tracker exception rather than a hidden graded peer, Housing Supply is no longer described as a 1-up / 2-down outlier, and Defence & Trade now carries an explicit split-promotion tripwire in the live data. Another small batch of easy trigger-level source URLs was threaded for climate, immigration, and housing. No grade, score, weighting, or tracker-status change.
- Trigger traceability pass, v5.12 converts one-notch move triggers from free text into structured objects with per-trigger source labels and, where possible, direct source URLs. The scoring drawer now shows the supporting source directly under each trigger instead of leaving readers to infer which source in the chip list backs which move condition. Thin source stacks were strengthened in Affordability Response, Housing Supply, and Promise Delivery; the previously overloaded Economic Policy stack was thinned back to the same 5-8 source band as the rest of the board; Defence & Trade and Flagship Delivery now frame their exception status more explicitly. No grade, score, or weighting change.
- Reddit trust-feedback pass, v5.11 makes the trust architecture more visible without changing any grades. The Scorecard view now states what the dashboard is and is not for, the header `Updated` date and each card's `Last reviewed` date are harder to miss, and every graded dimension now has both a short card-face `Judgment call` line and a longer scoring-drawer `Where judgment enters` explanation. Follow-up mobile polish keeps the Scorecard framing visible, strengthens `Last reviewed` contrast, and prevents Promise summary labels from clipping on narrow screens. Feedback provenance and remaining follow-ups are logged in [Beta-Feedback-Log.md](Beta-Feedback-Log.md). No grade, score, promise status, source array, rubric, or weighting change.
- Post-third-review build pass, three concrete inspectability builds shipped before the May 14 cycle in response to remaining beta-tester critique. (1) Headline scores now expose their derivation: both Household Impact and Full Policy Audit cards carry a new "How is this score built?" toggle that opens a panel below the scoreboard row, showing the per-dimension grade, points, weight, contribution, subtotals, weighted sum, total weights, and the arithmetic that yields the displayed score and letter grade. New `getOverallDerivation` and `getPocketbookDerivation` helpers in [src/utils.js](../src/utils.js); the existing `calculateOverallGPA` / `calculatePocketbookGPA` now call into the same builder so the math stays consistent. New [src/components/ScoreDerivation.jsx](../src/components/ScoreDerivation.jsx) renders the panel, mirroring the `ApprovalDetail` disclosure pattern. (2) Major Projects regraded on cohort progress, not first-event triggers: the dimension now defines the project universe (15 MPO-cohort projects across 3 tranches, reconciled from 16 on 2026-05-13) and grades on documented post-designation movement rather than same-day promoted-stage labels. New `projectCohort` field in [src/data/dimensions.json](../src/data/dimensions.json) with per-project current stage, stage date, and source URL; threshold ladder rewritten in [docs/Canonical-Scoring-Sheets.md](Canonical-Scoring-Sheets.md) (section 8) to grade on the published `stageGates` ladder (designated → reviewed → approved → permitted → under_construction → completed); a "Project pipeline" section on [src/components/DimensionCard.jsx](../src/components/DimensionCard.jsx) renders the cohort summary and a collapsible per-project table; Source Authority Map's Major Projects entry updated to mark the project list and stage tracking as live grade-moving fields. As of 2026-05-13, 4 projects sit above designated status, but only 2 of 15 (~13%) show later-dated post-designation advancement in the recorded cohort data, keeps the file at C, with the credit-claiming penalty still applied. (3) Confidence / Attribution / Lag glossary in the scoring drawer: each dimension card's drawer now has a "What do these mean?" expandable below the three pills, with one-sentence definitions plus the level cutoffs. Meta version bumped 5.6 → 5.7; new top changelog entry; [Bias-Threshold-Audit-2026-04.md](Bias-Threshold-Audit-2026-04.md) updated with a "post-third-review build pass" section.

- Promise status-evidence closeout, 11 additional clean `statusSourceUrl` / `statusSourceLabel` pairs were added to `src/data/dimensions.json`, moving the tracker from 29/43 to 40/43 promises with status-evidence links. New links cover Buy Canadian procurement, Alto high-speed rail, civil-service workforce renewal, sovereign AI compute, Canada Groceries and Essentials Benefit, Buy Canadian food standards, electricity grid interties, biodiversity/nature strategy, net-zero progress, temporary-resident stream reform, and 2 Billion Trees wind-down. Later Red Tape Review and Foreign Policy Review source passes moved coverage to 42/43. One status-source gap remains intentionally blank: Carbon Border Adjustment Mechanism. No grade, score, rubric, or methodology change.
- Monthly-cycle readiness pass, pre-cycle operations docs and scripts were reconciled for the May 14 update. The fetch script now uses live IRCC work/study permit CSV resources, generates an `items[]` changelog template matching the live Change Log component, and describes itself as a source-availability checker rather than an auto-updater. Monthly update docs now point to the full playbook, use current Approval Signal polling rules, and now carry only the three remaining promise status-source gaps as future watch items. Build, lint, fetch-script run, stale-term scan, and data invariant smoke-check all passed. No grade, score, promise-status, or methodology change.
- Promise Delivery tracker leak + public-copy reconciliation, after the late-session dashboard work, the card correctly showed `Tracker · No letter grade` in its collapsed state but could still expose grade-only language when expanded via the inherited `gradeBasis` / grade-trigger render path. DimensionCard now suppresses grade-rationale and grade-trigger sections for `excludeFromGPA` tracker cards, while preserving tracker metrics, promises, sources, perspectives, and inherited context. The Promise Delivery status line was also cleaned to say it is kept separate from the 11 performance grades instead of using reader-facing `GPA` language. Public copy in About/README/DATA-SOURCES/Methodology was reconciled to the live promise-status vocabulary and Approval Signal pollster stack. No score, grade, promise-status, or methodology change.
- Methodology residuals sweep (2026-04-19 late session), one push closing the "out-of-scope" backlog flagged earlier in the day. (1) Per-dimension `lastUpdated` value (already present in dimensions.json) is now rendered on each card as "Last reviewed YYYY-MM-DD" italic footer, so a reader can see per-dim freshness instead of only the single global dashboard date. (2) Approval Signal switched from simple arithmetic mean to sample-size-weighted mean, a poll of n = 2,000 now counts twice one of n = 1,000. Displayed values unchanged (57% / 31% / +26) because sample sizes across the included firms sit in a narrow band; the change is methodological rigor, not display. (3) Spark Insights exclusion verified, confirmed not CRIC-accredited against the CRIC member directory on 2026-04-19, plus documented 6-10 point house-effect gap vs. CRIC firms. Angus Reid Institute and Innovative Research Group inclusion re-framed under an explicit equivalent-transparency exception (both publish full methodology despite not being CRIC members). (4) Nanos preferred-PM added as a secondary signal line inside the existing ApprovalSignal box, 3 recent weeks of Carney/Poilievre preferred-PM numbers (52.1/24.5 most recent), explicitly labelled as a different construct from approve/disapprove and not averaged into the approval mean. (5) Inter-Rater-Reliability-Protocol.md created, 3-dim pilot design, shadow-grading packet spec, worksheet template, comparison scoring rubric, explicit caveats about what a v1 sanity check does and does not prove. (6) Fraser-Concentration-Audit.md created, per-dimension breakdown of Fraser's role in Economic Policy / Major Projects / Promise Delivery, three candidate T2 alternatives for each (C.D. Howe, IRPP, Canada West Foundation, Polimeter), and the path to landing substitutions under QA Rule 8. (7) CTM-T2 source-URL threading batch, all 43 tracked promises received `originalSourceUrl` (up from 17/43 at start of session), and 29/43 received `statusSourceUrl` (up from 10/43). A later closeout pass raised status-evidence coverage to 40/43. (8) Monthly-Cycle-Playbook.md created, 9-section checklist for every recurring monthly task (data review, grade review, promise status, approval signal refresh, changelog, meta bump, build, commit+push, post-cycle). No rubric, grade, or scoring change in this sweep.
- Per-Dimension Source Authority Map, built across all 11 graded dimensions, full review complete, integrated 2026-04-18. See [docs/Source-Authority-Map.md](Source-Authority-Map.md).
- QA-Gatekeeping-Rules.md amendments, Rule 1 edge-case notes, Rule 2 carry-forward cross-reference, Rule 4 symmetric confidence revisit, Rule 5 probationary cross-reference, Rule 6 same-family concentration blocking condition, new Rule 8 for analytical source-family additions, and a Companion References section. See [docs/QA-Gatekeeping-Rules.md](QA-Gatekeeping-Rules.md).
- Ethics source-chain strengthening, Office of the Ethics Commissioner and PM blind-trust summary statement added to the Ethics entry's `sources` array in [src/data/dimensions.json](../src/data/dimensions.json). No grade, GPA, or confidence change.
- Ethics anchored-indicator build, official-status anchor added to the live Ethics entry in [src/data/dimensions.json](../src/data/dimensions.json). No grade, GPA, confidence, or rubric change.
- Orphan-threading and SAM reconciliation bundle, C.D. Howe threaded into Flagship Delivery critics perspective; SAM Ethics, Flagship, and Climate Current State Deltas brought current; Carbon Pricing rationale/sourceNote wording consistency confirmed.
- Live review pass, code-level pass over main cards, CompareView, Methodology, ScoreboardHeader, PromiseTracker, WhatsChanged, and About; copy-staleness in About ("12 policy dimensions", Official source list, Independent policy list) and the Dashboard footer source list corrected.
- Pre-cycle readiness guardrail refresh, Economic Policy Response now warns more explicitly against announcement bias, Affordability Response carries a concrete next-trigger, Carbon Pricing / Climate deconfliction cues were tightened, and Housing Supply now labels BCH as announced / not started pending actual construction.
- Commitment Traceability Map, built, pilot-reviewed, full-built, and accepted as a published governance join layer. See [docs/Commitment-Traceability-Map.md](Commitment-Traceability-Map.md).
- MPO timeline overlap cleanup, removed the duplicate Flagship Delivery promise so the Major Projects two-year-timeline commitment now has a single primary home, consistent with overlap-prevention discipline.
- Headline GPA display precision reduced from two decimals to one on the live dashboard and README (1.70 → 1.7, 1.49 → 1.5). Underlying math, grade bands, sensitivity analysis, and shadow-log methodology retain full precision; the change is display-only and removes false precision the methodology cannot actually support.
- Card metadata surfacing, live DimensionCards now show confidence, attribution, and lag tags directly on-card using the existing dimension metadata.
- Compare tab removed from the live nav. The feature is now parked as a future analyst tool only if it can justify itself beyond duplicating two expanded cards.
- CTM-T1 durability-tag hygiene pass, seven commitments re-tagged in dimensions.json to match PCR tier examples (HOUSING-001 Commitment → Target; HOUSING-002 Commitment → Program; CARBON-002 Commitment → Legislated; MPROJ-001 Commitment → Legislated; AFFORD-002 Commitment → Framework; AFFORD-003 Commitment → Framework; ECONPOL-001 Framework → Program). CTM body notes reconciled and CTM-T1 residual closed. No grade, GPA, or confidence change (durability is display-only metadata).
- Carbon Pricing Policy source-chain hardening, ECCC Output-Based Pricing System landing page threaded into the live Carbon Pricing Policy `sources` array, closing the CARBON-002 direct-source gap flagged by U10 and CTM-T2. Readers clicking into Carbon Pricing Policy now see the statutory OBPS page alongside the existing CCI / IISD challenge sources. No grade, GPA, or confidence change.
- CTM-T2 partial thread pass, single clean in-repo match threaded: Bill C-5 LEGISinfo URL (already cited in Major Projects for MPROJ-001) added to Defence & Trade `sources` array, closing DEFTRADE-002's direct-legislative-source gap. The remaining 22 CTM-T2 items genuinely require external research (original platform URLs, program announcement pages, specific policy framework documents) and are left as explicit residuals. SAM Defence & Trade Current State Delta reconciled. No grade, GPA, or confidence change.
- Source Characterization Register built, 30-family register with institution type, ownership/funding, editorial independence, grounded ideological tendency (only where sourced in external raters or self-description), best-use boundary, strongest SAM-role fit, and trust flags. Closes the source-characterization reflection + deep-research workstream and provides the canonical record that About/README/DATA-SOURCES source-balance views now point to. Flags Fraser Institute concentration on independent-challenge role across three dimensions, Canadian Climate Institute federal-funding disclosure requirement, and CBC institutional descriptor (public broadcaster / Crown corporation) as stronger than any ideological label. No grade, GPA, or confidence change. See [docs/Source-Characterization-Register.md](Source-Characterization-Register.md).
- Household Impact / "Why two grades?" explainer rewrite, plain-language wording replaces the prior methodology-heavy block across the live dashboard (ScoreboardHeader), About, and README. Leads with motivation, names the four household-weighted dimensions in household-experience terms (housing, cost of living, the economy, government spending), notes Promise Delivery is tracked separately, and closes with the divergence signal. One-line subtitles added under "Full Policy Audit" and "Household Impact" score boxes so each explains itself without requiring the reader to read the full paragraph. No grade, GPA, confidence, weighting, or methodology change.
- "Why two grades?" explainer moved off the live dashboard header and parked in the About tab (plus README for GitHub readers). Score-box subtitles remain on the dashboard so each grade card still answers "what is this?" at first glance; the fuller explanation is now one click away in About rather than a block of text under the score row.
- Card metadata pill removal, Confidence, Attribution, and Lag pills were removed from the live DimensionCard on 2026-04-19. The labels were not self-explanatory to general readers and added cognitive load without clearly clarifying the concepts. Underlying metadata remains in dimensions.json and in governance docs; it simply no longer renders as on-card chips. Re-add only if a user-tested treatment meaningfully clarifies the concepts rather than repeating the same pill model.
- Expanded-dimension readability pass, DimensionCard expansion simplified on 2026-04-19 to cut density. The nested Promise Tracker (previously per-promise text + durability + status pill + evidence blurb inside every dimension card) was replaced with a one-line summary pointing readers to the dedicated Promises tab for item-level detail. Scope and "What Was Inherited" are now collapsed behind disclosure toggles inside the expanded state so default expansion shows only the grade-logic content. The repeated italic methodology disclaimer in the Perspectives section was removed; substantive Critics / Defenders content preserved. Core hierarchy retained: Why This Grade → What Would Change This Grade → Sub-Scores (where applicable) → Key Metrics → Perspectives → Promises (summary) → Sources → optional disclosures (Scope, What Was Inherited). No grade, GPA, confidence, source-array, rubric, SAM, CTM, or schema change.
- Promise Tracker link-model pass, on 2026-04-19 the promise schema in `src/data/dimensions.json` was extended with four optional fields per promise: `originalSourceUrl`, `originalSourceLabel`, `statusSourceUrl`, `statusSourceLabel`. The dedicated Promises tab (PromiseTracker) now renders up to two small link chips on each expanded promise row: a blue "Source →" chip pointing to where the promise was originally made, and an amber "Status evidence →" chip pointing to the document that justifies the current status. Durability tag rendering was also restored on the Promises tab row (previously only on the dimension card's nested tracker, which was removed in the readability pass). Initial schema seeding drew from CTM source_document URLs and live sources arrays; the later source-evidence closeout plus Red Tape Review and Foreign Policy Review passes now leaves all 43 promises with original-source links and 42 of 43 with status-evidence links. No grade, GPA, confidence, rubric, SAM, CTM methodology, or SCR change.
- DimensionCard hierarchy pass, on 2026-04-19 the default-expanded dimension card was restructured around the customer's first question ("why is this graded X?") by prioritizing a headline triad. The case-specific rationale now leads the Why This Grade block (regardless of plus/minus vs whole-letter-only dimensions), with the band criterion demoted to a smaller subtitle and active modifiers kept visible but compact. What Would Change This Grade and Interpretive Perspectives were moved behind the same disclosure-toggle pattern already used for Scope and What Was Inherited, both collapsed by default. The methodology-jargon `Construct:` line was removed from the card header; the plain-language status one-liner remains. Core remaining hierarchy: Why This Grade → Key Metrics → Sources → Promises summary → collapsed What Would Change → collapsed Perspectives → collapsed Scope → collapsed What Was Inherited. No grade, GPA, confidence, source-array, rubric, SAM, CTM, dimensions.json, or PromiseTracker change.
- DimensionCard label cleanup, on 2026-04-19 three methodology-flavored labels on the card were renamed to plain English to match the rest of the card's tone: "Interpretive Perspectives" → "Critics and defenders"; "Modifiers:" (inside Why This Grade) → "Adjustments:"; band subtitle "**{band}** band, {bandCriterion}" → "**{band}** means: {bandCriterion}". No structural change, no content change, no methodology change. Copy-only.
- Accessibility pass on disclosure semantics, all four DimensionCard disclosure toggles (Scope, What Would Change This Grade, Critics and defenders, What Was Inherited) now carry `aria-expanded` and `aria-controls`; each revealed content region has a matching `id` and `role="region"`. Disclosure buttons were given `minHeight: 24px` + small vertical padding to meet WCAG 2.5.8 minimum touch-target size. On the Promises tab, each expandable promise row now exposes `role="button"`, `tabIndex={0}`, `aria-expanded`, `aria-controls`, and keyboard Enter/Space handling; the detail region carries a matching `id` and `role="region"`. No visual hierarchy or content change.
- DimensionCard `whatThisGrades` subtitle, on 2026-04-19 a new optional `whatThisGrades` plain-language string field was added to each of the 11 graded dimensions in `src/data/dimensions.json`. The subtitle renders as small italic grey text directly beneath the dimension name and above the status one-liner on both collapsed and expanded card states. Each subtitle is 12-13 words, jargon-free, and stable over time (distinct from the monthly-updated status line). Promise Delivery (ungraded tracker) is not populated. Closes the comprehension gap left by the earlier removal of the methodology-jargon `Construct:` line, readers can now see what each dimension is grading at first glance without having to open Scope or leave the card for the Methodology tab. No grade, GPA, confidence, rubric, or methodology change.
- Subtitle cleanup follow-on, Flagship Delivery's `whatThisGrades` rewritten to explicitly name the five flagship files (defence, housing, major projects, climate, immigration) per Flagship-Delivery-Rules.md, closing the "which five?" ambiguity. Promise Delivery added a parallel tracker-scoped `whatThisGrades` line so every dimension card now has the same name → subtitle → status visual pattern. Two-string edit in dimensions.json; no component code changes required.
- Probation-dimension status-line cleanup, Ethics & Transparency and Flagship Delivery `status` strings trimmed to remove methodology-tail language (leading `PROBATION.` prefix and trailing `Whole-letter grade only, plus/minus precision not supported by evidence` / `Whole-letter grade only, combination rule determines grade mechanically` clauses). Substantive reader-facing state preserved. Methodology context about whole-letter probation and combination-rule mechanics continues to live in Scoring-Rubric-v1.1 and Flagship-Delivery-Rules where it belongs. Effectively closes the dimension-card readability lane, structural work, hierarchy work, label cleanup, subtitle addition, accessibility semantics, subtitle follow-on, and status-line methodology-tail cleanup are all landed. Data-only edit; no code changes.
- Hybrid GPA/score language pass, reader-facing surfaces now use `Score` for the aggregate numeric value and `Grade` for the letter grade; `GPA` is retained only in methodology contexts (Methodology tab, Scoring-Rubric-v1.1, governance docs) and in internal code identifiers (`calculateOverallGPA`, `gpaValue`, `excludeFromGPA`). Specific changes: ScoreboardHeader's two score cards show `Score: 1.7` / `Score: 1.5` instead of `GPA:`; DimensionCard's Promise Delivery pill reads `Tracker · Not scored` instead of `Tracker · Not in GPA`; README's Current Grades table header now reads `Grade Type | Grade | Score` instead of `Grade Type | Score | GPA`. About.jsx was already clean from the prior "Why two grades?" rewrite. No math, schema, methodology, or internal code changes.
- Final first-time-reader framing pass, the Scorecard grid now has a compact orientation block above it: "11 policy areas graded A-F, updated monthly," the trend legend, and "Click any card for the reasoning." This replaced the earlier separate intro / pointer treatment and keeps the onboarding cue adjacent to the grid. No structural, methodological, or schema changes. The lane was paused pending actual user signal; the July 23 first-look request supplied that signal and reopened only the bounded overview-hierarchy test recorded in [First-Look-Modernization-Review-2026-07-23.md](First-Look-Modernization-Review-2026-07-23.md).
- Methodology tab cleanup, the dense single-paragraph modifiers block was restructured into four scannable visual blocks matching the grade-range pattern (short name + one-line explanation + effect), with a new "Grade adjustments" section heading replacing "Operationalized Modifiers (v1.1):". The whole-letter probation paragraph was trimmed to remove the "no hidden C- adjustment behind the public grade" change-log phrasing and renamed to "Whole-letter dimensions" for plainer framing; it now carries only the reader-facing statement. The duplicative full weighting paragraph was replaced with a two-sentence summary that points readers to the About tab for the plain-language breakdown. CTM pointer paragraph preserved unchanged. GPA terminology retained in methodology context per the hybrid language policy. No rubric, methodology, or scoring change.
- Methodology tab "Limits of this model" disclosure, on 2026-04-19 a new small-print `Limits of this model` block was added at the end of the Methodology tab (after the Commitment Traceability pointer) following the skeptical-data-scientist audit pass. Five bulleted disclosures: (1) this is a rule-governed accountability scorecard, not a statistically-validated measurement instrument; (2) aggregate scores use equal-weight averaging of ordinal letter grades converted to a 4.0 scale as a disclosed editorial convention, not a latent-variable model; (3) plus/minus precision reflects editor judgment, with evidence-thin files held to whole letters to prevent false precision; (4) external inter-rater reliability has not been tested, three-lane QA is an internal discipline, not a substitute for independent replication; (5) the two headline scores use the same 11 dimensions with different weights and act as a built-in sensitivity check. Closes the one audit gap flagged as worth closing by the skeptical-data-scientist reflection. No rubric, methodology, scoring, schema, or grade change.
- About.jsx Principles ambiguity fix, the "Non-official sources are drawn from multiple institution types and perspectives, not a single editorial or analytical family" line was reworded to remove the read that it excluded analytical sources. The line now explicitly welcomes think tanks, policy institutes, journalism, and academic research into the stack, with the discipline being that no single family is allowed to dominate. Matches how the Source Authority Map and Source Characterization Register actually operate. Copy-only, no methodology or source-policy change.
- GitHub-link portability fix, on 2026-04-19 all 169 absolute local-filesystem paths in 10 governance docs were converted to repo-relative links. Files fixed: Commitment-Traceability-Map.md, Current-Roadmap.md, Parking-Lot.md, Source-Authority-Map.md, Source-Characterization-Register.md, DATA-SOURCES.md, Product-Thesis.md, QA-Gatekeeping-Rules.md, v2/verification/Claude-Session-Discipline.md, v2/verification/AI-Workflow-Efficiency-Protocol.md. Same-directory references are now bare filenames (e.g., `Promise-Coding-Rules-v1.0.md`), cross-tree references use `../src/...` and `../../` prefixes as appropriate. All 169 links verified resolvable to files that exist. Fixes the GitHub-reader bug where previous doc-to-doc links 404'd because the URLs pointed at a local machine path. No content, methodology, or schema change.
- Dashboard clarity fixes after reader report, on 2026-04-19 three live-dashboard issues were closed: (1) Promise Delivery card no longer shows a letter grade chip that contradicted its "Tracker · Not scored" pill; it now shows a delivered/total count (e.g., 14 / 43 · delivered) in the chip slot, the pill wording is updated to "Tracker · No letter grade," and the card's expanded border uses a neutral ochre rather than the misleading grade-colour; (2) Accountability Tracker section intro rewritten in plain language, explains that Promise Delivery is a running count of government commitments tracked alongside the grades for accountability but kept separate because the same events are already scored inside the graded dimensions; (3) dashboard metadata brought current, `meta.version` 5.4 → 5.5 and `meta.lastUpdated` 2026-04-17 → 2026-04-19 to reflect the live-work recency; (4) changelog rewritten in plain reader language, the new top entry (2026-04-19) names what matters to a reader (approval signal launch, Climate grade move with plain reasons, majority government, gas tax suspension, readability pass) and drops the governance-speak that made the prior entry opaque to non-analysts; prior 2026-04-15 governance entry kept in the file but demoted to second position. Component and data edits only; no rubric, grade, GPA, or schema change.
- Approval Signal ships, on 2026-04-19 a new ungraded Approval Signal card was added as the fourth item in the top scoreboard row, beside Household Impact, Full Policy Audit, and Promises Delivered. Signal displays a 60-day rolling sample-size-weighted mean of PM / government approval across the included pollster set (Léger, Abacus Data, Ipsos, Angus Reid Institute, Innovative Research Group), with delta vs. the prior 60-day window and an expandable drill-down of underlying polls with source links. v1 snapshot: approve 57% / disapprove 31% / net +26 (5 polls in window; trend +4 approve, -2 disapprove vs. prior window). Signal is explicitly outside the scoring model, does NOT feed `calculateOverallGPA` or `calculatePocketbookGPA`, and is labelled as not part of the grades so it is read as public-opinion context, not a performance score. Three-option reasoning (graded dimension / tracker / signal) landed in new [v2-Decision-Memo-Approval-Signal.md](v2-Decision-Memo-Approval-Signal.md). SCR extended with five new pollster entries (S1-S5) under a dedicated "Approval Signal source families (outside GPA)" section. Methodology tab carries a short pointer paragraph to the memo. Data lives in `src/data/approval-polls.json` and is hand-curated on the monthly cycle. Closes the Parking-Lot "Top-of-dashboard popularity / political durability signal" and "Approval / popularity placement explainer" items. No change to any graded dimension's grade, GPA, confidence, rubric, or SAM.

---

## Now

1. **Complete the September evidence cycle after the August 31 boundary.** The
   [August 29 checkpoint](September-Cycle-Prep-2026-08-28.md) rechecked all 29
   still-open monthly and event-driven rows: 12 had a new release, 13 recorded
   no event observed, 2 remained OK, and 2 were blocked. It also rechecked the
   four valid IRCC files, Moody's access exception, and the Housing DCRP hold.
   The valid 560-row ledger still has 531 dated dispositions, including 475
   cadence deferrals, because the checkpoint did not close the August evidence
   window early. The ledger remains open for August 30-31, the September 1
   scout, candidate adjudication, and editor-gated grade or status calls. The
   scout must fail closed, and its Anthropic account needs usable API credit
   before the run. Priority reason: the evidence window cannot be closed early
   or by inference.

---

## Editor Decision

1. **Define review, snapshot, and publication dates.** The September prep found
   that the August report claims an August 14 close while carrying August 19
   editor decisions and first landing on August 22. May and June are missing
   from `history.json`, and the April Climate move is effective April 15 but
   appears as an April 19 grade item. Review the exact additive recommendation in
   [September-Cycle-Prep-2026-08-28.md](September-Cycle-Prep-2026-08-28.md)
   before any correction release. Priority reason: history must not be silently
   rewritten without one durable date rule or an explicit override of the
   existing no-rewrite policies.

2. **Adjudicate seven evidence-scope questions after the final August sweep.**
   Decide whether the Labrador Trough package belongs under the national-grid
   promise, whether Housing's 240,000 condition uses monthly SAAR or the
   six-month trend, whether the August 19 Ottawa page establishes construction,
   and whether State of Trade 2026's goods-and-services share belongs beside or
   instead of the current goods-only measure. Also decide whether the Abacus and
   Leger releases enter the approval mean, whether the Coast Guard icebreaker
   contract belongs inside the current Defence scope, and whether the official
   evidence changes Promise Delivery treatment for 2 Billion Trees, the
   emissions cap, or the replaced EV standard. The Building Canada Act
   pre-listing question remains parked with the wider Major Projects rules.
   Priority reason: the official evidence is recorded, but these scope and
   measure choices cannot be inferred without changing how the dashboard reads
   it.

---

## Editor-Parked (2026-08-28)

On 2026-08-28 the editor explicitly kept these three items parked. They are not
cancelled or completed. Resume them only on later editor instruction.

1. **Major Projects denominator, threshold, and referral-stage rules.** Review
   the
   [August decision packet](Major-Projects-Threshold-Decision-Packet-2026-08.md)
   only when the lane is resumed. The denominator, threshold, and
   `stageAtReferral` questions are frozen and editor-gated. Before any backfill,
   define how a facility-wide approval applies to a later project phase, when
   early physical work crosses a stage boundary, and what counts as major
   federal financing. Five known rows were already above designated at referral
   and also require historical stage research. Priority reason: do not infer
   referral stages or change scoring rules after seeing the result.

2. **Inter-rater clarification and return date.** The editor communication
   record says the final v1 packet was sent on 2026-06-07 and acknowledged on
   2026-07-24. Tracked repository artifacts independently prove the final
   packet was frozen on June 7 and record the July 24 acknowledgement, while
   the results template's send-date field remains blank. The repo does not
   establish whether the later clarification was sent or a return date was
   agreed. Those two follow-ups remain parked. When resumed, record those facts
   before treating the pilot as waiting on a dated return, then process any
   worksheets against the frozen packet.

3. **Combined reader study.** In one sitting, test the first-look briefing with
   four first-time readers at `375 x 812` and four at `1280 x 900`, then run the
   30-second workspace task across Housing, Defence & Trade, Promise Delivery,
   Flagship Delivery, and one ordinary graded dimension. Record first action,
   false clicks, signal-role and freshness confusion, default-size comfort,
   whether readers find the grade, reason, latest change, next checkpoint, and
   complete record, and whether they distinguish announcements from delivery
   evidence. Recruit readers with different political priors and use the
   published perceived-bias survey questions in the same sitting. AI reader
   proxies do not close this item.

---

## Next

1. **Complete source-monitor hardening acceptance.** The first two completed
   2026-08-29 read-only Claude reviews each ended with the literal result
   `VERDICT: REVISE`, so acceptance remains open. A later saved response ended
   with `VERDICT: APPROVED`, but its bridge exit code was not recorded and the
   response does not count as approval. Finding 1 reproduced a local-path false
   positive on ordinary
   public URL pathnames. The working-tree scanner now exempts `home` or `users`
   path segments only inside a public URL pathname that starts with `http://`
   or `https://` and has a non-empty host, while actual, encoded,
   HTML-reference, and repeated-separator local-path forms remain blocked. The
   workflow guard now scans the exact current live or backtest artifact payload,
   not unrelated historical monitoring files. Finding 2's GitHub Actions
   precedence mechanism was rejected against the official runner code. The
   candidate still removes empty job-level Ethics and carry-forward values to
   eliminate ambiguity, then writes and consumes those dynamic paths explicitly.
   Finding 3 was a tolerable cost exposure: the private-rule secret was checked
   after paid work. The candidate now creates an owner-only private file and uses
   the pinned scanner to parse its active regexes before dependency installation,
   branch preparation, fetch, Tavily, or Anthropic work. It removes that file
   before the next step. The existing IRCC, feed, PBO, Ethics,
   normalized-fingerprint, finite-threshold, PR-state, and branch-lease controls
   remain part of the candidate. Missing branch protection for `main` is a
   tolerable repository-level residual, not a blocker for this candidate.
   Parallel code review then found two retry-safety defects: a failed final
   artifact write could leave accepted state advanced, and a prior ledger whose
   acceptance passed but whose state persistence failed could suppress the same
   evidence on retry. The candidate now restores exact pre-run state after a
   final output failure and ignores nonpersistent prior ledgers for deduplication.
   A later parallel retry review found that a failed rollback could still leave
   advanced local state without a durable warning. The candidate now writes a
   persistent recovery marker before state replacement, clears it only after
   accepted outputs or exact rollback, and blocks any same-state retry before
   deterministic input or paid work while the marker remains. A final parallel
   race review found that two processes could both read the old state before the
   late marker existed. The candidate now takes a host-local exclusive run lock
   before monitor input parsing or paid work, rejects a concurrent process using
   the same case-normalized state path, and rejects every output-to-input path
   collision, including capitalization and existing hard-link aliases, before
   work begins. Existing state paths that are symbolic links or have hard-link
   aliases are rejected. Missing state paths under symbolic-linked parents are
   canonicalized once for locking, marker placement, state writes, and rollback.
   A separate privacy review found HTML-reference and repeated-separator bypasses,
   which are now blocked. The later saved Claude response also identified three
   tolerable defense-in-depth gaps. The bootstrap trusted scanner hash now names
   the approved scanner instead of an older internal snapshot. The configured
   local hook now requires a non-empty private identity-rule file. The review
   sequence is now recorded across the active operating documents. Keep the
   current candidate. The complete worktree monitor suite passes 551 checks and
   parses all three workflow files. Keep this item open until post-fix staged
   checks pass, Claude returns a completed approval with a recorded exit code,
   and hosted workflow acceptance passes. Priority reason: inspectable
   working-tree behavior is not release evidence.

---
## Later

These are valid, but not active now.

1. Keep Flagship Delivery only while future cycles pass the published retention checks. If a required check fails, queue an explicit editor decision on replacement or demotion instead of reviving probation. Priority reason: retain the exception only while its evidence test continues to work.
2. Revisit small rubric maintenance only if later audits show a repeated failure pattern. Priority reason: avoid speculative scoring changes.
3. Watch the next few Pages deploys with the browser-smoke CI gate, with attention to runtime cost. Priority reason: the new data boundary needs ordinary production observation after publication.
4. Start the polish lane with shared motion tokens and one reduced-motion source of truth, then consider a bounded card-to-workspace transition. Keep mobile drag-to-dismiss and animated panel changes deferred until the new navigation has ordinary use evidence. Priority reason: motion should clarify the reading transition, not create another interaction layer.
5. Consider explicit metric-to-sub-score provenance for Defence & Trade only if reader observation shows the flat lead metrics are being misread. Do not infer that mapping in the UI from labels or source context. Priority reason: the current data does not encode that relationship, and presentation must not manufacture methodology.
6. Add a reusable Comet review-prompt template if live app-feel review becomes a recurring monthly process. Priority reason: process tooling should follow repeated use, not precede it.
7. Reconsider hero collapse for returning readers after the next live review. Priority reason: it could reduce repeat-visit scroll cost, but it adds client state and hides a trust frame that helped first-time readers.
8. Consider an announcement-watch surface only if the combined human study
   finds observed confusion between announcements and delivery evidence. Until
   then, retain the existing considered-but-held evidence notes. Priority
   reason: do not add schema, interface, and monthly retirement work for a
   reader problem that has not been observed.
9. Reconsider a local read-only MCP adapter only after repeated review work shows that selective reads are materially better than targeted files or the tracked-file bundle. Any return needs a filtered input set, symlink and special-file policy, locked tool dependencies, a disclosure smoke test, local `stdio`, and another different-AI review. Priority reason: do not rebuild an optional access path without measured need.
10. Revisit a secondary-signal subgrid fallback only if an unsupported-browser report shows the cosmetic misalignment still matters in ordinary use. Priority reason: current evergreen browsers support subgrid and older browsers retain readable, functional cards, so a speculative shim ranks below the August cycle.
11. Run one physical-device pass when targets are available: confirm that a
   native share target preserves the detached text and exact deep link, then
   check iOS edge-swipe and sheet overscroll, Android pull-to-refresh, and
   Windows forced-colors. These remain release exceptions, not passes or current
   blockers. Priority reason: browser emulation cannot characterize the native
   platform shell or target-specific share rewriting.
12. Consider an on-page text-size control only if the combined reader study shows that default sizing or browser-zoom discovery remains a real barrier. Tokenize the complete shell before building it so the control changes the whole reading experience rather than one section. Priority reason: the current release fixes the measured default-size problem, while a partial A/A+ control would add another setting without proving that readers need it.
13. Run the foundational methodology audit no later than 2027, or sooner if the scoring rubric moves to a new major version. Priority reason: the scaffold sets an annual editor gate, not a monthly task, and it should not disappear when the May planning file becomes historical.
14. Recruit an outside red-team reviewer for a cycle that changes a published
    grade, as required by the
    [grade-change protocol](Grade-Change-Red-Team-Protocol.md). If no reviewer is
    available when the trigger fires, use the editor-applied party-symmetry line
    and record that the external pass was unavailable. Priority reason: this is
    a grade-change trigger, not standing work.

---

## Not Now

Do not reopen these unless a later audit forces it.

- Full rubric rewrite
- Restarting the closed tri-lens pilot without a new dated baseline, owner,
  contemporaneous cycle, and canonical workflow gate
- Defence & Trade full split unless the canonical tripwire fires: if the defence and trade sub-scores move in opposite directions, or differ by more than 1.0 GPA points (about one full letter grade), for two consecutive monthly review cycles, queue the split for promotion to live separate files in the next version
- Carbon Pricing / Climate merge
- Promise Delivery redesign
- New governance/process docs unless they solve a concrete active problem
