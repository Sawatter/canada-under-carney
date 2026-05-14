# Recurring Source Checklist

**Purpose:** Keep the monthly dashboard update from depending on memory. This is the persistent checklist. Each cycle should copy the relevant rows into that month's `Source-Coverage-Ledger-YYYY-MM.md` and mark what was actually checked.

**Scope rule:** A monthly cycle does not need to be a full source recertification. Say which tier was run.

**Ledger rule:** This checklist may bundle source families for readability. The cycle ledger must not. Start each cycle with:

```bash
npm run source:ledger -- YYYY-MM
```

That generator expands bundled rows into source-level rows and pulls the current stalled / abandoned promises from `src/data/dimensions.json`. If a generated quarterly or twice-yearly row is not due that month, mark it `not due` rather than leaving it blank.

## Coverage Tiers

| Tier | Name | What it proves |
|---|---|---|
| 1 | Availability check | The endpoint or page is reachable. |
| 1.5 | Value-diff check | The latest machine-readable value is compared against the value in `dimensions.json`. |
| 2 | Targeted refresh | A known new release or stale metric was reviewed and updated if needed. |
| 3 | Source recertification | The cited value, link, and source role were manually checked against the current source. |
| 4 | Deep research | Active search for new evidence not already in the dashboard. |

## Every Monthly Cycle

Run these before the monthly changelog is drafted.

| Check | Source home | Dashboard area | Current status | What to look for | Update trigger |
|---|---|---|---|---|---|
| Fetch script | `python3 scripts/fetch-data.py` | StatCan, IRCC, Bank of Canada | Automated availability check | Endpoint failures, downloaded IRCC CSVs, Bank of Canada response | Any failure, or any fetched value that differs once value-diff is built |
| StatCan food CPI | Table / Daily CPI release | Affordability Response | Availability check in script | Latest food-store CPI | Food CPI crosses trigger or changes current metric |
| StatCan Labour Force Survey | Monthly LFS release | Economic Policy Response | Availability check in script | Employment change, unemployment rate | Labour-market metric changes materially |
| StatCan population | Table 17-10-0009-01 | Immigration | Availability check in script | Temporary resident share context | TR-share threshold or context changes |
| StatCan housing starts | Table 34-10-0158-01 plus CMHC release | Housing Supply | Availability check in script; CMHC release manual | Six-month trend and monthly SAAR | Starts trend crosses trigger floor |
| StatCan merchandise trade | Table 12-10-0176-01 | Defence & Trade | Availability check in script | U.S. export share / non-U.S. share | Trade-share trigger movement |
| IRCC PR admissions | IRCC open-data CSV | Immigration | Downloaded by script | PR admission pace | PR-target interpretation changes |
| IRCC work and study permits | IRCC open-data CSVs | Immigration | Downloaded by script | Temporary-resident pressure | Permit trends change enough to affect status |
| Bank of Canada FX | Valet `FXCADUSD` | Economic / immigration context | Automated | CAD/USD observation | Context only unless cited metric changes |
| Approval poll scan | Abacus, Leger, Angus Reid Institute | Approval Signal | Automated by `scripts/fetch-data.py` (RSS feeds; filtered for federal-approval-relevant titles; flags new vs cited per pollster) | New direct Carney / federal-government approval poll | Add poll and recalculate 60-day average |
| PBO publication scan | `https://www.pbo-dpb.ca/en/publications` (RSS at `/en/feed.xml`) | Fiscal, affordability, promises | Automated by `scripts/fetch-data.py` (RSS surface; editor still evaluates each release) | New fiscal, costing, or anchor analysis | New PBO release changes a cited metric or promise status |
| Ethics Commissioner reports | `https://ciec-ccie.parl.gc.ca/en/investigations-enquetes/Pages/AllInvestRepAct-TousRapEnqLoi.aspx` | Ethics & Transparency | Manual | New report, examination, or PM-relevant filing | Ethics review status changes |
| Major Projects Office list | `https://www.canada.ca/en/privy-council/major-projects-office/projects/national.html` | Major Projects | Automated by `scripts/fetch-data.py` (page scrape; flags additions / removals vs `projectCohort.projects`) | Denominator, project additions, stage changes | Cohort count or stage evidence changes |
| Stalled / abandoned promise spot-check | `statusSourceUrl` on stalled and abandoned promises | Promise tracker | Manual | Link still works; no new public evidence changes the status | Evidence moves a promise out of stalled / abandoned, or source link breaks |
| Touched-source link check | URLs touched in current edits | Any touched dimension | Manual | 200/working page, value still visible | Broken link or source mismatch |

## Event-Driven Watch

Do not wait for the next quarterly cycle if one of these events appears. Log the check in the current cycle ledger.

| Watch | Source home | Dashboard area | Event trigger |
|---|---|---|---|
| Sovereign rating actions | Fitch, Moody's, S&P Canada sovereign pages | Fiscal Health | Canada rating downgrade, outlook change, or rating-committee action |
| Climate / carbon policy events | ECCC announcements, federal climate plan pages, Paris Agreement status, carbon-border-adjustment announcements | Climate & Environment, Carbon Pricing Policy | Paris withdrawal, replacement climate strategy, ECCC budget change, carbon border adjustment announcement, or OBPS / fuel-charge policy change |
| Defence / NATO events | NATO releases, PMO defence announcements, National Defence releases | Defence & Trade | Spending-path confirmation, NATO-commitment change, major procurement milestone, or defence-accounting reclassification |
| Major federal announcements | PMO, Finance Canada, department release pages | Any affected dimension | New program launch, funding table, project designation, national-interest designation, or explicit cancellation |
| Bill-status movement | LEGISinfo / Parliament bill pages | Promises, Major Projects, Defence & Trade, Carbon Pricing Policy | Bill introduced, passed, died, amended, or proclaimed where a commitment depends on legislation. Automated by `scripts/fetch-data.py` — each cycle calls LEGISinfo JSON for every cited parl.ca bill and reports current status, latest stage, and royal-assent date. |

## Quarterly Checks

Run these every three monthly cycles, or sooner if a trigger appears.

| Check | Source home | Dashboard area | What to look for |
|---|---|---|---|
| Full `dimensions.json` source link-rot pass | All `sources[].url` | All dimensions | Broken, redirected, or stale URLs. Run via `python3 scripts/fetch-data.py --link-rot` (~30-60s; surfaces broken / blocked URLs and any Wayback snapshot available). |
| Approval excluded-pollster revisit | Pollara, Mainstreet, Ekos, Ipsos, Innovative Research Group | Approval Signal | Any direct Carney approval release missing from the rolling window. Automated by `scripts/fetch-data.py` for Pollara (`/feed/`), Ipsos (`/en-ca/rss.xml`), and Innovative Research (`/feed/`); flags federal-approval-relevant items as `[REVIEW]`. Mainstreet Research and EKOS Politics do not publish a public RSS — remain manual. |
| Rating-agency scan | Fitch, Moody's, S&P | Fiscal Health | Canada sovereign rating action or outlook change |
| NATO interim scan | NATO annual report and press releases | Defence & Trade | Defence-spending verification or communiqué affecting the grade |
| Climate / carbon source scan | Canadian Climate Institute, IISD, ECCC departmental pages, Paris Agreement status | Climate & Environment, Carbon Pricing Policy | New analysis, plan revision, budget change, Paris-status movement, or carbon-pricing implementation change |
| Stalled / abandoned promises | `statusSourceUrl` on stalled and abandoned promises | Promise tracker | Full status recertification, beyond the monthly link / evidence spot-check |
| Ethics / governance independent sources | Democracy Watch, House ETHI, major reporting | Ethics & Transparency | New independent critique, review, or disclosure finding |
| Policy / academic / journalism scan | C.D. Howe, Fraser Institute, IRPP / Policy Options, The Hub, Dalhousie, PROOF, The Conversation Canada, CBC, Globe and Mail, The Narwhal, National Observer | Independent challenge and context across dimensions | New analysis that affects source balance, challenge evidence, or cited context. Automated by `scripts/fetch-data.py` for 6 publishers with usable RSS — C.D. Howe `/feed/`, Fraser `/rss.xml`, The Hub `/feed/`, Democracy Watch `/feed/`, PROOF `/feed/`, The Narwhal `/feed/`. Items tagged `[TOPIC]` (dashboard-relevant theme) vs `[OTHER]`. CCI, IISD, Conversation Canada (atom), Globe and Mail (paywall), CBC (firehose), National Observer: remain manual. |

## Twice-Yearly Checks

Run after the budget / fiscal update cycle and once mid-year.

| Check | Source home | Dashboard area | What to verify |
|---|---|---|---|
| Full source recertification | Every cited source URL | All dimensions | Link works, cited value still matches, source role still valid |
| Major Projects project-by-project recertification | MPO page plus each project source URL | Major Projects | All 15 projects, stages, stage dates, and advancement counts |
| Promise recertification | All 43 promise status sources | Promise tracker | Delivered / in progress / stalled / abandoned status still holds |
| About-page source-family inventory | About page vs live cited domains | About / trust surface | Every family listed is still cited or intentionally listed |
| Source-role consistency audit | Source Authority Map and Source Characterization Register | Governance docs | Each cited source still has the right role, tier, boundary, and independence characterization |
| Deep source search | PBO, StatCan, department pages, watchdogs, policy institutes, major reporting | All dimensions | New evidence not already in the dashboard |

## Automation Backlog

Build these in this order when source-process work is active.

1. ~~PBO RSS integration in `scripts/fetch-data.py`.~~ **Done.** The fetch script now reads `https://www.pbo-dpb.ca/en/feed.xml` each cycle and flags new publications as `[NEW]` vs `[CITED]` in the fetch report.
2. StatCan value-diff checks, not just availability checks. **Open.** Design: hit the WDS API at `https://www150.statcan.gc.ca/t1/wds/rest/getCubeMetadata` for each cited PID (5 tables) and compare `cubeEndDate` against the dashboard's cited reference period. A newer `cubeEndDate` flags a refresh review. Full per-coordinate value extraction needs a coordinate map per cited series and is a follow-up.
3. ~~LEGISinfo bill-status check for live bill commitments.~~ **Done.** `scripts/fetch-data.py` walks every cited `parl.ca/legisinfo/.../bill/...` URL each cycle, calls the LEGISinfo JSON endpoint per bill, and surfaces current status (e.g. "Royal assent received"), latest completed stage, first-reading date, royal-assent date, and which dashboard dimensions cite the bill. Currently 1 bill tracked (Bill C-5 / One Canadian Economy Act).
4. ~~Major Projects Office page diff against `projectCohort.projects`.~~ **Done.** `scripts/fetch-data.py` now scrapes the MPO page each cycle, extracts project H2 headings, normalizes for ligatures and word-order variants, and prints additions / removals vs the live cohort. Genuine naming-convention differences are surfaced as one "potential addition" + one "potential removal" so the editor can reconcile.
5. ~~Approval-poll release-page scrapers for Abacus, Leger, and Angus Reid Institute.~~ **Done.** All three firms publish public RSS feeds (Abacus `/feed/`, Léger `/en/feed/`, Angus Reid `/feed/`). `scripts/fetch-data.py` pulls each feed, applies a federal-approval-relevance filter that excludes clearly-provincial posts, and tags each item `[CITED]` or `[NEW]` against `src/data/approval-polls.json`.
6. Ethics Commissioner investigation-report page diff. **Open.** `ciec-ccie.parl.gc.ca` blocks at the TCP layer from some networks and has no Wayback snapshot, which makes the page structure hard to probe in advance. When network access is available, design: scrape the report-list page (H2 / report entries), keep a small `tmp/ethics-reports.json` cache, and diff additions / removals each cycle.
7. ~~Archive fallback check: if a cited URL fails, check the Internet Archive / Wayback Machine and record either an official replacement URL or an archived fallback in the cycle ledger.~~ **Done.** `python3 scripts/fetch-data.py --link-rot` walks every cited URL in `src/data/dimensions.json`, hits the Wayback Machine availability API when a URL is unreachable, and prints a per-URL line tagged `[BROKEN]`, `[BROKEN+ARC]`, `[BLOCKED]`, `[BLOCKED+ARC]`, or `[ERROR]` so the editor can see in one pass which links rotted and which have an archive fallback.

## Link-Check Notes

- Source-inventory claims should be checked against live citations before being removed. For example, NRCan is legitimately listed because it is cited in Economic Policy Response as `NRCan — critical minerals partnerships`.
- Some official pages may block plain `curl` while still loading in a normal browser / web fetch. For example, the IMF Article IV page may return 403 to command-line checks.
- When a PDF link breaks but an official HTML viewer exists, prefer the official viewer and log the replacement in that cycle's ledger.
