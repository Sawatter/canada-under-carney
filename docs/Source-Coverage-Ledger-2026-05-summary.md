# Source Coverage Ledger Summary - May 2026

**Purpose:** Preserve the original hand-written May 2026 coverage summary, packet spot-check table, open gaps, and recruitment-gate note. The expanded row-by-row ledger lives in [Source-Coverage-Ledger-2026-05.md](Source-Coverage-Ledger-2026-05.md).

**Cycle date:** 2026-05-13
**Live version after cycle:** v5.22
**Coverage level:** Tier 1 availability check plus targeted Tier 2 refresh. No full-dashboard Tier 3 recertification.

## Coverage Tiers

| Tier | Name | Meaning |
|---|---|---|
| 1 | Availability check | Endpoint or source page is reachable. Does not prove the cited value was rechecked. |
| 2 | Targeted refresh | Known new release or known stale metric was manually reviewed and updated if needed. |
| 3 | Source recertification | The cited value, link, and source role were manually checked against the current source. |
| 4 | Deep research | Active search for new sources or evidence not already in the dashboard. |

## May 2026 Coverage Summary

| Area | Coverage | Status | Notes |
|---|---|---|---|
| Statistics Canada configured tables | Tier 1 | Done | `scripts/fetch-data.py` checked food CPI, labour force, population, housing starts, and trade table availability. |
| IRCC configured CSVs | Tier 1 | Done | Permanent residents, IMP work permits, TFWP work permits, and study permits downloaded. |
| Bank of Canada FX | Tier 1 | Done | CAD/USD API returned latest observation. |
| Approval Signal | Tier 2 | Done | Four recent polls were added from Abacus Data, Leger, and Angus Reid Institute. Full pollster-release completeness was not independently recertified. |
| Fiscal Health | Tier 2 plus partial Tier 4 | Done | Spring Economic Update and PBO fiscal-anchor assessment drove Fiscal Health D -> C. |
| Economic Policy Response | Tier 2 | Done | April 2026 Labour Force Survey context updated. |
| Affordability Response | Tier 2 | Done | March 2026 food CPI updated. April CPI release remains scheduled for 2026-05-19. |
| Major Projects | Tier 2 plus partial Tier 4 | Done | Official MPO denominator reconciled to 15 projects. Full one-by-one project deep research was not run. |
| Housing Supply | Tier 2 | Done | CMHC March 2026 starts reviewed. Monthly SAAR dipped below 240K, but six-month trend remained above the down-trigger floor. |
| 43 promises | Partial Tier 2 | Partial | Fiscal-anchor promise moved Stalled -> In Progress. Other promise statuses were not recertified from scratch. |
| Inter-rater pilot sources | Tier 3 spot-check | Done with one fix | The 18 packet URLs were checked before recruitment. House ETHI PDF URL 404'd and was replaced with the working House DocumentViewer report page. |
| Ethics Commissioner investigation registry | Tier 3 spot-check | Done | Investigation Reports page lists Fox Report as latest Act report on 2026-04-08; no Carney-specific examination report listed as of this check. |
| Untouched dimensions | Tier 1 minimum not complete | Open | Defence & Trade, Carbon Pricing, Climate, Immigration, Ethics, and Flagship did not receive a full recertification pass this cycle. |
| About-page source families | Inventory check not complete | Open | About-page source-family list was not rechecked against every live citation family this cycle. |

## Inter-Rater Pre-Send Source Spot-Check

The inter-rater packet uses a frozen 2026-04-30 evidence snapshot. These checks confirm packet links are reachable before sending the packet to a human rater. They do not update the snapshot evidence.

| Dimension | Source | Result | Note |
|---|---|---|---|
| Fiscal Health | Budget 2025 | OK | Source reachable. |
| Fiscal Health | PBO fiscal analysis | OK | Source reachable. |
| Fiscal Health | C.D. Howe fiscal analysis | OK | Source reachable. |
| Fiscal Health | Annual Financial Report FY 2024-25 | OK | Source reachable by GET. HEAD-style check can show Canada.ca error-page behavior, so use GET for future checks. |
| Fiscal Health | IMF Article IV, Jan 2026 | OK | Source reachable in browser/web check. Plain curl may return 403 from IMF bot protection. |
| Affordability Response | StatsCan CPI Feb 2026 | OK | Source reachable. |
| Affordability Response | Dalhousie Food Price Report | OK | Source reachable. |
| Affordability Response | PROOF food insecurity 2024 | OK | Source reachable. |
| Affordability Response | PBO Canada Groceries and Essentials Benefit | OK | Source reachable. |
| Affordability Response | CRA Canada Groceries and Essentials Benefit | OK | Source reachable. |
| Affordability Response | Canada Grocery Code | OK | Source reachable. |
| Ethics & Transparency | Globe and Mail ethics filing | OK | Source reachable. |
| Ethics & Transparency | CBC financial assets | OK | Source reachable. |
| Ethics & Transparency | Democracy Watch critique | OK | Source reachable. |
| Ethics & Transparency | House ETHI report | Fixed | Original PDF URL returned 404. Packet and live Ethics source list now point to the House DocumentViewer Report 5 page. |
| Ethics & Transparency | Ethics Commissioner registry and reviews | OK | Source reachable; Act investigation list did not show a Carney-specific report. |
| Ethics & Transparency | PM blind-trust summary statement | OK | Source reachable. |
| Ethics & Transparency | PM Annex A agreed measure | OK | Source reachable. |

## Open Coverage Gaps

These should not block the inter-rater pilot, but they should shape the next full source recertification pass.

1. Recertify all 15 Major Projects individually against the MPO page and each project-specific source.
2. Recheck all 11 stalled or abandoned promises first, then the remaining promise statuses.
3. Confirm approval-polling completeness across included and excluded pollsters for the current rolling window.
4. Run a Tier 1 link-rot pass on every source URL in `src/data/dimensions.json`.
5. Reconcile the About-page source-family inventory against the live citation surface.
6. Consider automating PBO RSS checks, LEGISinfo status checks, and MPO page diffs before the June cycle.

## Recruitment Gate

The inter-rater packet can be sent after the packet snapshot note, results-template snapshot grades, and House ETHI link fix are committed. A full-dashboard Tier 3 recertification is not required before the pilot because the pilot covers only Fiscal Health, Affordability Response, and Ethics & Transparency.
