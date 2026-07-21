# Frozen Rule Adjudication - 2026-07-21

**Scope:** Resolve the three frozen conflicts recorded in `Review-Adjudication-2026-07-19.md` without changing the GPA formula, grade-point mapping, weights, penalty formulas, or 11-graded-plus-1-tracker model. The Defence and Trade decision also removes External Constraint from the active-modifier list and keeps the same market-pressure fact as attribution context, so it cannot override the new whole-letter sub-score arithmetic.

**Release candidate:** v5.159

## Decisions

### Economic Policy Response

**Decision:** Correct `D` to `C` and keep the trend `down`.

The five-lever ledger has one executing lever and one authorized lever. Productivity-tax competitiveness is executing because [Bill C-15](https://www.parl.ca/legisinfo/en/bill/45-1/c-15) received Royal Assent on March 26, 2026 and implemented the productivity super-deduction measures. Interprovincial trade is authorized because [Bill C-5](https://www.parl.ca/legisinfo/en/bill/45-1/c-5) enacted the Free Trade and Labour Mobility in Canada Act. The [official implementation page](https://www.canada.ca/en/one-canadian-economy/services/free-trade-labour-mobility-canada-act.html) records that the Act and regulations came into force on January 1, 2026.

The prior `D` contradicted its own fewer-than-two condition. Rule 3(b) therefore permits a documented correction. This is not an evidence-triggered improvement: no up-trigger fired, business investment still fell for a fifth consecutive quarter, and the trend remains declining. The synchronized boundary is:

- `C`: at least two levers are authorized or executing, but either no lever is executing or business investment has not recorded two consecutive non-declining quarters.
- `D`: fewer than two levers are authorized or executing. Investment can confirm the weak trajectory but does not override the action count while Timing Fairness applies.

**Party-symmetry check:** The same one-executing, one-authorized ledger and five-quarter investment decline would produce `C` under a Conservative, Liberal, NDP, Bloc-supported, or coalition government.

### Defence & Trade

**Decision:** Equal-weight sub-score arithmetic controls. Sub-scores use whole letters only. The headline holds at `A-`.

Each sub-score tests an active `F` condition first. Otherwise the rater takes the highest satisfied band from `A` down to `D`. The two whole-letter grades convert through the existing frozen grade-point table, average equally, and convert through the existing headline cutoffs.

- Defence is `A`: NATO independently confirmed Canada at 2.01% of GDP.
- Trade is `B`: the annual non-U.S. export-share gain was 4.2 points and corridor execution is underway.
- Trade is `B`: its 4.2-point gain with execution meets the whole-letter B condition and falls below the roughly five-point A marker.
- Headline: `(4.0 + 3.0) / 2 = 3.50`, which maps to `A-`.

The judgment text still discloses that the trade shock drove part of the measured gain. This adjudication removes that fact from `activeModifiers` and keeps it as attribution context only; it does not adjust the Trade band or the mechanical headline.

The June 2026 editor decision remains historical fact: Budget 2025's $81.8B five-year envelope was treated as satisfying the narrower B-5yr funded-pathway condition. This adjudication removes wording that incorrectly described the full 3.5% trajectory as appropriated. The spent funded-pathway trigger is retired. Future triggers prompt review of the named sub-score and never override the arithmetic.

The `A` to `B` sub-score gap is exactly 1.0 GPA point. The published split tripwire requires more than 1.0 for two consecutive cycles, so it is not fired. This methodology correction does not count as an evidence-driven opposite-direction cycle.

### Ethics & Transparency

**Decision:** House ETHI Report 5 counts both as the published independent-review component and as one separate institutional critique. The grade holds at `C`.

[House ETHI Report 5](https://www.ourcommons.ca/documentviewer/en/45-1/ETHI/report-5) is dated April 2026 and substantively examines the Prime Minister's divestment obligations and conflict screen. It recommends stronger public reporting for screens. That satisfies the existing component definition for a substantive parliamentary review and is a separate institutional critique alongside Democracy Watch.

The two-source down condition still does not fire because it is now explicitly conditional on no published independent review. The `D` row is synchronized to the same rule. The component count becomes four of five. The grade remains `C` because no full public accounting exists and the next band specifically requires a PM-specific Ethics Commissioner review finding the screen adequate.

The [Ethics Commissioner public registry](https://ciec-ccie.parl.gc.ca/en/public-registry) was checked on July 21, 2026. No PM-specific Commissioner adequacy finding was found. That dated absence is evidence, not proof that no unpublished work exists.

## Economic Full Re-verification

CF-BLOCK-6 put the full Economic Policy Response evidence base back in scope. The July 1 source-coverage ledger was used as the baseline, then the load-bearing sources were reopened on July 21.

| Claim group | July 21 result |
|---|---|
| Business investment and GDP | Statistics Canada directly reports Q1 GDP at 0.0% quarter-over-quarter and business capital investment down 0.7%, the fifth consecutive decline. Derived annualized display wording was replaced with the publisher's direct values. |
| Productivity tax | Budget 2025 supports the projected 15.6% to 13.2% METR change. Bill C-15 supplies the missing enactment evidence. |
| Internal trade | Bill C-5 received Royal Assent, and the official implementation page records that the Act and regulations are in force. The lever remains conservatively `authorized` because its published executing test requires measurable barrier reduction in at least three provinces. |
| AI compute | ISED lists the $2B strategy, open applications, and program envelopes. The cited page does not identify a completed capacity deployment, so the lever remains `announced`. |
| Critical minerals | NRCan supports 30 partnerships and $12.1B in project capital. The live `$121B` typo was corrected. The cited record does not establish the full authorization-and-timeline test, so the lever remains `announced`. |
| Regulatory review | TBS lists about 500 recent and planned actions. The mix does not provide a government-wide burden estimate attributable to the 2025 review, so the lever remains `announced`. |
| Labour market | Statistics Canada supports +88,000 jobs and 6.6% unemployment in May 2026. Context only. |
| R&D and inherited GDP-per-capita context | Automated source identifiers remain unchanged. The OECD rank display is qualified as `last or near-last` to match the source note rather than asserting an unqualified exact rank. |
| Permitting breadth | The official page described the June 24 process to list projects but showed no completed Schedule 1 listing at the July 21 check. This is dated absence evidence only. |
| Independent challenge | CSLS and Signal49 remain corroborating context for the investment trajectory. They do not create the grade correction. |

## QA And History

- **Analyst lane:** Literal application of the current lever and component ledgers.
- **Red-team lane:** Separate Codex sub-agents challenged each conflict. Accepted findings include whole-letter Defence/Trade sub-scores, retiring the spent defence trigger, making the Ethics down condition coherent, preserving `trend: down`, and labeling Economic as a correction.
- **Referee lane:** The integrated decision preserves action-first attribution, uses the same party-symmetry test across files, and does not change the frozen aggregate formula.
- **Bias-resistance audit:** The mechanical audit reports no source-family or critics/defenders flag for the three adjudicated files. Economic and Ethics each retain an asymmetric-sourcing notice for a future event-driven trigger whose honest source is a changing set of legislation, program records, or governance critiques rather than one fixed URL. Those notices are retained instead of attaching a misleading single-source link.
- **Source-ledger boundary:** The closed June 30 ledger is not rewritten to pretend later checks occurred inside its evidence window. Its validator therefore reports seven current URLs added or corrected after close: the TDCF launch, Bill C-15, the corrected CSLS page, the Building Canada Act project-listing page, House ETHI Report 5, Transparency International Canada, and the Ethics Commissioner public registry. The v5.157 correction record and this July 21 adjudication carry those checks until the July evidence ledger is generated during the August 1 cycle.
- **External political-prior review:** No returned inter-rater worksheet is available. Per the published protocol, that absence is disclosed and does not become approval.
- **Different-AI review:** The scoped Claude bridge was attempted after explicit editor authorization, but the workspace's tenant policy rejected the external transfer before a review ran. No Claude verdict was produced, and the refusal is not approval. Three internal read-only reviewers were used to surface and repair defects: the scoring/evidence and audit/tooling passes ended `APPROVED`; the release-integrity pass found no remaining technical defect and ended `REVISE` only because the different-AI gate was still open.
- **Editor release exception:** On 2026-07-21 the editor stated, "I accept the one-time v5.159 different-AI review exception because tenant policy blocked Claude." This closes gate 11 for v5.159 only. It does not convert the blocked Claude attempt into approval or create a standing exception for later releases.
- **Post-release Claude closure:** After publication, Claude was authenticated through the CLI browser flow and reviewed the committed `74177d2..01cfb8c` release range plus deployment-record commit `9099ec8` read-only. It returned `VERDICT: APPROVED` with no release defect. This closes the different-AI evidence gap after publication; it does not retroactively replace the editor exception or imply that Claude approved v5.159 before release. Claude recorded three non-blocking observations: Defence and Trade remain at the exact 1.0 split-tripwire boundary, the coverage audit's text checks establish DOM presence after explicit visibility gates rather than testing visibility for every string, and Claude did not rerun the deterministic suites during its read-only review. The tracked response is [Claude-v5.159-Post-Release-Review-2026-07-21.md](Claude-v5.159-Post-Release-Review-2026-07-21.md).
- **History:** `history.json` is not rewritten. Its July 1 entry records the grade that was actually published on July 1. v5.159 records the correction through `previousGrade`, the changelog, and this adjudication.

## Physical Check Disposition

This release does not change edge gestures, pull-to-refresh handling, forced-colors rules, body locking, or sheet overscroll mechanics. A post-release host inventory again found no connected iOS or Android device, no Xcode simulator or Android SDK/emulator, and no Windows machine or VM. The iOS edge-swipe/sheet-overscroll, Android pull-to-refresh, and Windows forced-colors checks therefore remain explicit physical-environment exceptions, not completed checks. Playwright browser emulation is not counted as physical evidence. Desktop and mobile browser inspection still applies to the added sub-score disclosure content.

## Required Release Gates

1. `npm run test:data`
2. `node scripts/audit-bias-resistance.mjs`
3. `npm run test:review-handoff`
4. Shell syntax and workflow-YAML validation
5. `npm run lint`
6. `npm run build`
7. `npm run test:app-shell`
8. `npm run test:browser`
9. Local production dashboard audit
10. Desktop and mobile inspection of Defence & Trade, Economic Policy Response, Ethics & Transparency, the headline score cards, and the Change Log
11. Scoped Claude adversarial review with an explicit verdict, or an explicit editor release exception if external-transfer policy makes the review impossible
12. Staged diff check, identity scans, scope guard, commit, push, Pages verification, and live version check

## Release Outcome

v5.159 was committed as `01cfb8c` and pushed to `main` on 2026-07-21. GitHub Pages run `29862076550` passed its review-handoff, build, 141-test browser, and deploy jobs on attempt 2. Attempt 1 was cancelled after its Chromium installation step stalled for more than six minutes; the same step completed normally on the fresh runner, with no code change between attempts.

The production header reports v5.159 dated 2026-07-21. Desktop and 375-by-812 mobile inspection confirmed the Defence and Trade arithmetic and stacked sub-score ladders, the Economic C correction with a declining trend, the Ethics four-of-five disclosure result and exact registry links, and the v5.159 Change Log entry. The production coverage audit recorded 530 passes and zero issues.

The local release tree also passed `npm run test:data`, the bias-resistance audit, `npm run test:review-handoff`, shell syntax, workflow-YAML parsing, lint with zero errors and 327 existing warnings, `npm run build`, the 53-check app-shell contract, the 141-test browser matrix, and the 530-row local coverage audit. The frozen aggregate formula, grade-point mapping, weights, penalty formulas, dimension model, and `history.json` remained unchanged.
