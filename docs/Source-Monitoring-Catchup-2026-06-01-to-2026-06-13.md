# Source monitoring candidates - 2026-06

> JUNE 1-13 CATCH-UP - candidates only; deduped vs PR #2

_Generated 2026-06-14T03:43:40+00:00._

No grades, statuses, thresholds, scoring, or dashboard data were changed by this run. Everything below is a candidate for the editor to look at.

## Run status

| Tier | Status |
| --- | --- |
| seen_ledger | loaded (77 fingerprints, 60 URLs) |
| adjacent_authorities | enabled (7 hosts) |
| deterministic | intentionally_skipped (--no-deterministic) |
| search_fanout | run (93 hits) |
| classification | run (model claude-opus-4-8) |
| reprocess | relabeled offline: timing fallback + near-dup collapse; no new API/search calls |

**Heads up:**
- Deterministic tier intentionally skipped for a historical/windowed run; live endpoint state cannot be reconstructed for a past window.

## Sources surveyed

64 surfaces in the registry. By method: api 4, page_hash 2, rss 10, search_fanout 48.

### Label legends

- `cited-source-update`: exact cited URL came back through monitoring.
- `same-publisher-new-item`: same cited publisher/domain, new URL.
- `adjacent-authority-source`: curated adjacent authority host, not currently cited.
- `search-only-provisional`: search discovery outside the cited/allowlisted hosts.
- Timing labels are mechanical, based on source/search publication dates when exposed.

## Deterministic candidates

From the machine-readable pullers in `fetch-data.py` (RSS, StatCan WDS, IRCC, Bank of Canada, LEGISinfo, MPO page, Ethics page, link-rot).

_No deterministic candidates this run._

## Search fan-out candidates (provisional)

Discovery only. Snippets are not citation-ready. Anything grade-relevant needs a browser pull and editor verification before it touches the dashboard.

| Routing | Dimensions | Score | Source relation | Timing | Discovery | Item |
| --- | --- | --- | --- | --- | --- | --- |
| context | climate-environment | 0.35 | same-publisher-new-item | published-in-June | search_fanout | [During Canadian Environment Week, Canada's Environmental ...](https://www.canada.ca/en/environment-climate-change/news/2026/06/during-canadian-environment-week-canadas-environmental-damages-fund-supports-12-new-nature-conservation-and-restoration-projects0.html) |
| context | climate-environment, economic-policy | 0.30 | same-publisher-new-item | published-in-June | search_fanout | [Government of Canada renews support to the International ...](https://www.canada.ca/en/department-finance/news/2026/06/government-of-canada-renews-support-to-the-international-sustainability-standards-board-office-in-montreal.html) |
| manual_browser_pull | affordability-response, defence-trade, economic-policy, fiscal-health, promise-delivery | 0.55 | same-publisher-new-item | found-now-window-relevant | search_fanout | [Briefing binder created for the Minister of Finance and National Revenue and the Deputy Minister of Finance on the occasion of their appearance at the Standing Committee on Finance on February 5, 2026 on Bill C-15, An Act to implement certain provisi - Canada.ca](https://www.canada.ca/en/department-finance/corporate/transparency/briefing-materials/2026/c15-eng.html) |
| promise_status | economic-policy | 0.60 | same-publisher-new-item | published-in-June | search_fanout | [Minister Solomon highlights Canada's National Artificial Intelligence ...](https://www.canada.ca/en/innovation-science-economic-development/news/2026/06/minister-solomon-highlights-canadas-national-artificial-intelligence.html) |
| context | defence-trade, economic-policy | 0.45 | search-only-provisional | date-unclear | search_fanout | [Measures to transform Canada's softwood lumber industry](https://natural-resources.canada.ca/forests-forestry/forest-industry-trade/measures-transform-canada-softwood-lumber-industry) |
| context | climate-environment, economic-policy | 0.30 | same-publisher-new-item | published-in-June | search_fanout | [Canada invests in Newfoundland and Labrador's energy sector](https://www.canada.ca/en/natural-resources-canada/news/2026/06/canada-invests-in-newfoundland-and-labradors-energy-sector.html) |
| context | climate-environment, defence-trade, economic-policy | 0.35 | same-publisher-new-item | published-in-June | search_fanout | [Canada advances forest sector transformation to protect jobs and ...](https://www.canada.ca/en/natural-resources-canada/news/2026/06/canada-advances-forest-sector-transformation-to-protect-jobs-and-strengthen-communities-nationwide.html) |
| context | carbon-pricing, climate-environment | 0.35 | same-publisher-new-item | date-unclear | search_fanout | [Electric Vehicle Affordability Program - Transports Canada](https://tc.canada.ca/en/road-transportation/innovative-technologies/electric-vehicles/electric-vehicle-affordability-program) |
| manual_browser_pull | housing-supply | 0.60 | search-only-provisional | date-unclear | search_fanout | [Housing, Infrastructure and Communities Canada - Build Canada Homes latest announcements](https://housing-infrastructure.canada.ca/bch-mc/news-nouvelles-eng.html) |
| promise_status | housing-supply | 0.80 | same-publisher-new-item | published-in-June | search_fanout | [Canada and Ontario Open Applications for New Development ...](https://www.canada.ca/en/housing-infrastructure-communities/news/2026/06/canada-and-ontario-open-applications-for-new-development-charge-reduction-program0.html) |
| context | housing-supply | 0.50 | same-publisher-new-item | date-unclear | search_fanout | [Consultation on Financial Tools for Citizen-Led Homebuilding and for Infill Housing - Canada.ca](https://www.canada.ca/en/department-finance/programs/consultations/2026/consultation-on-financial-tools-for-citizen-led-homebuilding-and-for-infill-housing.html) |
| promise_status | affordability-response | 0.85 | same-publisher-new-item | published-in-June | search_fanout | [Secretary of State Sarai highlights that Canadians will begin receiving enhanced Canada Groceries and Essentials Benefit starting today - Canada.ca](https://www.canada.ca/en/global-affairs/news/2026/06/secretary-of-state-sarai-highlights-that-canadians-will-begin-receiving-enhanced-canada-groceries-and-essentials-benefit-starting-today.html) |
| promise_status | affordability-response | 0.85 | same-publisher-new-item | published-in-June | search_fanout | [Minister Olszewski and Minister Robertson Highlight that Canadians Will Begin Receiving Enhanced Canada Groceries and Essentials Benefit Starting Today - Canada.ca](https://www.canada.ca/en/prairies-economic-development/news/2026/06/minister-olszewski-and-minister-robertson-highlight-that-canadians-will-begin-receiving-enhanced-canada-groceries-and-essentials-benefit-starting-t.html) |
| context | affordability-response, economic-policy, fiscal-health | 0.55 | same-publisher-new-item | found-now-window-relevant | search_fanout | [Briefing binder created for the Deputy Minister of Finance on the occasion of his appearance at the Standing Committee on Public Accounts on February 9, 2026 on the 2024 and 2025 Public Accounts of Canada - Canada.ca](https://www.canada.ca/en/department-finance/corporate/transparency/briefing-materials/2026/pacp-eng.html) |
| promise_status | affordability-response | 0.75 | same-publisher-new-item | published-in-June | search_fanout | [Secretary of State Sarai to highlight government investments in grocery affordability - Canada.ca](https://www.canada.ca/en/global-affairs/news/2026/06/secretary-of-state-sarai-to-highlight-government-investments-in-grocery-affordability.html) |
| context | affordability-response | 0.30 | same-publisher-new-item | published-in-June | search_fanout | [Government of Canada announces immediate support to strengthen ...](https://www.canada.ca/en/canadian-heritage/news/2026/06/government-of-canada-announces-immediate-support-to-strengthen-canadian-culture-and-ensure-canadian-content-remains-affordable.html) |
| context | affordability-response, economic-policy | 0.50 | same-publisher-new-item | date-unclear | search_fanout | [Briefing binder created for the Minister of Finance and ... - Canada.ca](https://www.canada.ca/en/department-finance/corporate/transparency/briefing-materials/2026/c19-eng.html) |
| manual_browser_pull | affordability-response | 0.70 | search-only-provisional | date-unclear | search_fanout | [[PDF] POVERTY REPORT CARDS - Food Banks Canada](https://content.foodbankscanada.ca/reports/poverty-report-cards_2026_en_full-report.pdf) |
| manual_browser_pull | fiscal-health | 0.40 | same-publisher-new-item | published-in-June | search_fanout | [Press Briefing Transcript: Julie Kozack, Director, Communications ...](https://www.imf.org/en/news/articles/2026/06/04/tr-06042026-imf-regular-briefing-june-4-2026) |
| context | defence-trade | 0.30 | same-publisher-new-item | date-unclear | search_fanout | [Report to Parliament on the Government of Canada's International ...](https://international.canada.ca/en/global-affairs/corporate/reports/international-assistance-report/report-2025) |
| source_balance | climate-environment, defence-trade, immigration | 0.30 | same-publisher-new-item | date-unclear | search_fanout | [Inside Policy \| Macdonald-Laurier Institute](https://macdonaldlaurier.ca/insidepolicy) |
| context | defence-trade, economic-policy | 0.35 | same-publisher-new-item | date-unclear | search_fanout | [The Rupture Cycle - Commodities, geopolitics, and Canada's moment](https://macdonaldlaurier.ca/the-rupture-cycle-commodities-geopolitics-and-canadas-moment-heather-exner-pirot) |
| manual_browser_pull | economic-policy, fiscal-health | 0.50 | same-publisher-new-item | published-in-June | search_fanout | [[PDF] OECD Economic Outlook, Volume 2026 Issue 1 (EN)](https://www.oecd.org/content/dam/oecd/en/publications/reports/2026/06/oecd-economic-outlook-volume-2026-issue-1_8be0dba6/2d1956f0-en.pdf) |
| context | economic-policy, fiscal-health | 0.40 | same-publisher-new-item | date-unclear | search_fanout | [Projected Order of Business - House of Commons of Canada](https://www.ourcommons.ca/DocumentViewer/en/house/latest/projected-business) |
| context | economic-policy | 0.45 | same-publisher-new-item | date-unclear | search_fanout | [[PDF] Scotiabank Forecast: The Tale of Two Economies on Two Different ...](https://www.scotiabank.com/content/dam/scotiabank/sub-brands/scotiabank-economics/english/documents/forecast-tables/forecast20260603.pdf) |
| context | defence-trade, economic-policy | 0.30 | same-publisher-new-item | date-unclear | search_fanout | [The Global Week Ahead: Warsh’s Grand Entrance \| Post](https://www.scotiabank.com/ca/en/about/economics/economics-publications/post.other-publications.global-week-ahead.june-12--2026.html) |
| context | defence-trade, economic-policy, major-projects | 0.45 | same-publisher-new-item | date-unclear | search_fanout | [Strengthening One Canadian Economy through trade and ...](https://tc.canada.ca/en/corporate-services/consultations/strengthening-one-canadian-economy-through-trade-transportation) |
| context | climate-environment, major-projects | 0.55 | same-publisher-new-item | date-unclear | search_fanout | [Canada's 'major projects' should not come at the cost of the ...](https://theconversation.com/canadas-major-projects-should-not-come-at-the-cost-of-the-environment-284174) |
| context | housing-supply | 0.30 | adjacent-authority-source | date-unclear | search_fanout | [[PDF] Economic News - Calgary: Home sales returned to their downward ...](https://www.nbc.ca/content/dam/bnc/taux-analyses/analyse-eco/logement/economic-news-calgary.pdf) |
| context | economic-policy, fiscal-health | 0.35 | adjacent-authority-source | date-unclear | search_fanout | [[PDF] BoC Policy Monitor - National Bank](https://www.nbc.ca/content/dam/bnc/taux-analyses/analyse-eco/boc-policy-monitor.pdf) |

## Editor decision required

| Routing | Dimensions | Item | Why flagged |
| --- | --- | --- | --- |
| promise_status | economic-policy | [Minister Solomon highlights Canada's National Artificial Intelligence ...](https://www.canada.ca/en/innovation-science-economic-development/news/2026/06/minister-solomon-highlights-canadas-national-artificial-intelligence.html) | National AI Strategy 'AI for All' announced by PM Carney bears on the $2B sovereign AI compute strategy promise and potentially the AI compute fund disbursement trigger. Routing to promise_status for editor verification; snippet does not confirm Treasury Board disbursement so the trigger is not asserted. |
| promise_status | housing-supply | [Canada and Ontario Open Applications for New Development ...](https://www.canada.ca/en/housing-infrastructure-communities/news/2026/06/canada-and-ontario-open-applications-for-new-development-charge-reduction-program0.html) | Opening of applications for the Development Charge Reduction Program under the $8.8B Canada-Ontario Partnership bears directly on a tracked housing promise's delivery status. Provisional snippet, so editor should verify the disbursement/implementation detail. |
| promise_status | affordability-response | [Secretary of State Sarai highlights that Canadians will begin receiving enhanced Canada Groceries and Essentials Benefit starting today - Canada.ca](https://www.canada.ca/en/global-affairs/news/2026/06/secretary-of-state-sarai-highlights-that-canadians-will-begin-receiving-enhanced-canada-groceries-and-essentials-benefit-starting-today.html) | First payments of the Canada Groceries and Essentials Benefit beginning to be issued bears directly on a tracked affordability promise's delivery status. A priori 'economic-policy' tag appears mis-routed; this is affordability. |
| promise_status | affordability-response | [Minister Olszewski and Minister Robertson Highlight that Canadians Will Begin Receiving Enhanced Canada Groceries and Essentials Benefit Starting Today - Canada.ca](https://www.canada.ca/en/prairies-economic-development/news/2026/06/minister-olszewski-and-minister-robertson-highlight-that-canadians-will-begin-receiving-enhanced-canada-groceries-and-essentials-benefit-starting-t.html) | Same Canada Groceries and Essentials Benefit first-payment news; bears on the tracked affordability promise delivery status. A priori 'economic-policy' tag appears mis-routed; this is affordability. |
| promise_status | affordability-response | [Secretary of State Sarai to highlight government investments in grocery affordability - Canada.ca](https://www.canada.ca/en/global-affairs/news/2026/06/secretary-of-state-sarai-to-highlight-government-investments-in-grocery-affordability.html) | Advisory marking the first payment of the Canada Groceries and Essentials Benefit bears on the tracked affordability promise delivery status. |

## Access failures and browser-pull list

| Surface / item | Method | Detail |
| --- | --- | --- |
| [PDF] POVERTY REPORT CARDS - Food Banks Canada | manual_browser_pull | see https://content.foodbankscanada.ca/reports/poverty-report-cards_2026_en_full-report.pdf |
| Housing, Infrastructure and Communities Canada - Build Canada Homes latest announcements | manual_browser_pull | see https://housing-infrastructure.canada.ca/bch-mc/news-nouvelles-eng.html |
| Briefing binder created for the Minister of Finance and National Revenue and the Deputy Minister of Finance on the occasion of their appearance at the Standing Committee on Finance on February 5, 2026 on Bill C-15, An Act to implement certain provisi - Canada.ca | manual_browser_pull | see https://www.canada.ca/en/department-finance/corporate/transparency/briefing-materials/2026/c15-eng.html |
| [PDF] OECD Economic Outlook, Volume 2026 Issue 1 (EN) | manual_browser_pull | see https://www.oecd.org/content/dam/oecd/en/publications/reports/2026/06/oecd-economic-outlook-volume-2026-issue-1_8be0dba6/2d1956f0-en.pdf |
| Press Briefing Transcript: Julie Kozack, Director, Communications ... | manual_browser_pull | see https://www.imf.org/en/news/articles/2026/06/04/tr-06042026-imf-regular-briefing-june-4-2026 |

## Suppressed / low-relevance

24 items were routed irrelevant or scored below the surfacing threshold. They are kept in the candidate JSON for audit, not shown here.

## Already seen in comparison ledger

16 candidates matched the supplied seen ledger and were kept out of this packet to avoid duplicating an existing source-monitor PR.

---

No grades, statuses, thresholds, scoring, or dashboard data were changed by this run. Everything below is a candidate for the editor to look at.
