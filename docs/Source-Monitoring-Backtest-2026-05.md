# Source monitoring candidates - 2026-05

> MAY 2026 BACKTEST - calibration only; no grades moved

_Generated 2026-06-14T03:43:40+00:00._

No grades, statuses, thresholds, scoring, or dashboard data were changed by this run. Everything below is a candidate for the editor to look at.

## Run status

| Tier | Status |
| --- | --- |
| adjacent_authorities | enabled (7 hosts) |
| deterministic | intentionally_skipped (--no-deterministic) |
| search_fanout | run (72 hits) |
| classification | run (model claude-opus-4-8) |
| reprocess | relabeled offline: timing fallback + near-dup collapse; no new API/search calls |

**Heads up:**
- Deterministic tier intentionally skipped for a historical/windowed run; live endpoint state cannot be reconstructed for a past window.

## Sources surveyed

65 surfaces in the registry. By method: api 4, page_hash 2, rss 10, search_fanout 49.

### Source-set delta

Active registry for this run: 65 surfaces. Comparison registry: 64 surfaces.

Only in this run's source set: argusmedia-com, business-humanrights-org, icapcarbonaction-com.

Only in the comparison source set: canada-ca-climateaction, electricautonomy-ca.

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
| context | climate-environment | 0.50 | same-publisher-new-item | date-unclear | search_fanout | [Federal assets and services at risk as climate resilience actions lag - Canada.ca](https://www.canada.ca/en/auditor-general/media-room/federal-assets-services-at-risk-as-climate-resilience-actions-lag.html) |
| context | climate-environment | 0.45 | same-publisher-new-item | date-unclear | search_fanout | [Flood hazard mapping too slow to support climate change adaptation - Canada.ca](https://www.canada.ca/en/auditor-general/media-room/flood-hazard-mapping-too-slow-support-climate-change-adaptation.html) |
| context | climate-environment | 0.30 | same-publisher-new-item | published-in-May | search_fanout | [The Office of the Auditor General of Canada will deliver 5 performance audit reports to the House of Commons on Monday, May 4, 2026 - Canada.ca](https://www.canada.ca/en/auditor-general/media-room/office-auditor-general-canada-will-deliver-5-performance-audit-reports-house-commons-monday-may-4-2026.html) |
| context | climate-environment | 0.40 | same-publisher-new-item | date-unclear | search_fanout | [2026 Reports Opening Statement to News Conference Karen Hogan Auditor General of Canada and Jerry V. DeMarco Commissioner of the Environment and Sustainable Development - Canada.ca](https://www.canada.ca/en/auditor-general/media-room/2026-may-reports-opening-statement-news-conference.html) |
| context | defence-trade, economic-policy | 0.60 | same-publisher-new-item | published-in-May | search_fanout | [Canada invests in Arctic infrastructure to bring critical minerals to ...](https://www.canada.ca/en/natural-resources-canada/news/2026/05/canada-invests-in-arctic-infrastructure-to-bring-critical-minerals-to-market-and-strengthen-northern-communities.html) |
| context | defence-trade, economic-policy | 0.40 | same-publisher-new-item | published-in-May | search_fanout | [Government of Canada invests in British Columbia’s forest sector to support jobs and strengthen communities - Canada.ca](https://www.canada.ca/en/natural-resources-canada/news/2026/05/government-of-canada-invests-in-british-columbias-forest-sector-to-support-jobs-and-strengthen-communities0.html) |
| context | defence-trade, economic-policy | 0.45 | same-publisher-new-item | published-in-May | search_fanout | [Ksi Lisims LNG Offtake Agreement Announcement - Canada.ca](https://www.canada.ca/en/natural-resources-canada/news/2026/05/the-honourable-tim-hodgson-minister-of-energy-and-natural-resources-ksi-lisims-lng-offtake-agreement-announcement.html) |
| context | climate-environment, economic-policy | 0.50 | search-only-provisional | date-unclear | search_fanout | [Powering Canada Strong: A National Strategy for an Electrified Canadian Economy](https://natural-resources.canada.ca/energy-sources/electricity-infrastructure/powering-canada-strong-national-strategy-electrified-canadian-economy) |
| context | affordability-response | 0.30 | same-publisher-new-item | date-unclear | search_fanout | [Automatic Tax Filing Consultation Report - Canada.ca](https://www.canada.ca/en/revenue-agency/corporate/about-canada-revenue-agency-cra/transparency-proactive-disclosure-canada-revenue-agency/consultations-engagement-canada-revenue-agency/may-2026-automatic-tax-filing-consultation.html) |
| source_balance | economic-policy, fiscal-health | 0.30 | same-publisher-new-item | date-unclear | search_fanout | [Departmental Results Reports - Canada.ca](https://www.canada.ca/en/treasury-board-secretariat/services/departmental-performance-reports.html) |
| source_balance | economic-policy, fiscal-health | 0.30 | search-only-provisional | date-unclear | search_fanout | [Grants and Contributions - Open Government Portal - Canada.ca](https://search.open.canada.ca/grants) |
| manual_browser_pull | climate-environment, ethics-transparency | 0.15 | same-publisher-new-item | published-in-May | search_fanout | [Friday May 1, 2026 Episode Transcript \| CBC Radio](https://www.cbc.ca/radio/thecurrent/friday-may-1-2026-episode-transcript-9.7185509) |
| context | carbon-pricing | 0.30 | same-publisher-new-item | date-unclear | search_fanout | [EU, Brazil, and China formally launch Open Coalition on ...](https://icapcarbonaction.com/en/news/eu-brazil-and-china-formally-launch-open-coalition-compliance-carbon-markets) |
| context | carbon-pricing | 0.30 | same-publisher-new-item | date-unclear | search_fanout | [UK abolishes Carbon Price Support for power sector](https://icapcarbonaction.com/en/news/uk-abolishes-carbon-price-support-power-sector) |
| context | defence-trade | 0.35 | same-publisher-new-item | date-unclear | search_fanout | [Global Affairs Canada Transformation Implementation Plan (2023 to ...](https://international.canada.ca/en/global-affairs/corporate/transparency/transforming-gac/implementation-plan-2023-2026) |
| context | defence-trade | 0.45 | same-publisher-new-item | date-unclear | search_fanout | [Share your views: Consulting Canadians on a potential free trade agreement with Mercosur](https://international.canada.ca/en/global-affairs/consultations/trade/2025-12-02-mercosur) |
| context | defence-trade | 0.30 | same-publisher-new-item | date-unclear | search_fanout | [Canada’s Arctic - Latest news](https://international.canada.ca/en/global-affairs/campaigns/canada-arctic/latest-news) |
| context | defence-trade | 0.25 | same-publisher-new-item | date-unclear | search_fanout | [G7 Rapid Response Mechanism Annual Report 2025](https://international.canada.ca/en/global-affairs/corporate/reports/rapid-response-mechanism/annual-report-2025) |
| context | climate-environment, major-projects | 0.45 | same-publisher-new-item | date-unclear | search_fanout | [The Alberta-Ottawa pipeline agreement gets Canada off the starting blocks: Heather Exner-Pirot in The Hub \| Macdonald-Laurier Institute](https://macdonaldlaurier.ca/the-alberta-ottawa-pipeline-agreement-gets-canada-off-the-starting-blocks-heather-exner-pirot-in-the-hub) |
| context | climate-environment, defence-trade, economic-policy | 0.35 | same-publisher-new-item | date-unclear | search_fanout | [Canadian coal – From dirty secret to critical mineral: Heather Exner ...](https://macdonaldlaurier.ca/canadian-coal-from-dirty-secret-to-critical-mineral-heather-exner-pirot) |
| context | economic-policy, fiscal-health | 0.50 | same-publisher-new-item | date-unclear | search_fanout | [The Investment illusion – The Canada Strong Fund treats the symptom, not the cause of Canada’s economic malaise: Jerome Gessaroli \| Macdonald-Laurier Institute](https://macdonaldlaurier.ca/the-investment-illusion-the-canada-strong-fund-treats-the-symptom-not-the-cause-of-canadas-economic-malaise-jerome-gessaroli) |
| context | defence-trade | 0.20 | same-publisher-new-item | date-unclear | search_fanout | [Reckless recognition - Canada's Palestinian statehood mistake](https://macdonaldlaurier.ca/reckless-recognition-canadas-palestinian-statehood-mistake-mehdi-moradi) |
| manual_browser_pull | economic-policy, fiscal-health | 0.55 | same-publisher-new-item | published-in-May | search_fanout | [[PDF] Restoring Public Finances: Enabling Effective Government - OECD](https://www.oecd.org/content/dam/oecd/en/publications/reports/2026/05/restoring-public-finances_0c1f7ce5/fbcf9161-en.pdf) |
| context | defence-trade, major-projects | 0.40 | same-publisher-new-item | published-in-May | search_fanout | [Order Paper and Notice Paper No. 120 - May 8, 2026 (45-1) - House of Commons of Canada](https://www.ourcommons.ca/documentviewer/en/45-1/house/sitting-120/order-notice/page-5) |
| manual_browser_pull | ethics-transparency | 0.30 | same-publisher-new-item | published-in-May | search_fanout | [Debates (Hansard) No. 118 - May 6, 2026 (45-1) - House of ...](https://www.ourcommons.ca/documentviewer/en/45-1/house/sitting-118/hansard) |
| manual_browser_pull | fiscal-health, housing-supply | 0.25 | same-publisher-new-item | date-unclear | search_fanout | [[PDF] Scotiabank Q2 2026 Report to Shareholders](https://www.scotiabank.com/content/dam/scotiabank/corporate/quarterly-reports/2026/q2/Q226_Shareholders_Report-EN.pdf) |
| context | climate-environment | 0.40 | same-publisher-new-item | date-unclear | search_fanout | [Canada must rethink how it contributes to international climate finance](https://theconversation.com/canada-must-rethink-how-it-contributes-to-international-climate-finance-283044) |
| context | climate-environment | 0.50 | same-publisher-new-item | date-unclear | search_fanout | [Canada should invest in nature as critical infrastructure](https://theconversation.com/canada-should-invest-in-nature-as-critical-infrastructure-282104) |
| context | carbon-pricing, climate-environment | 0.60 | adjacent-authority-source | date-unclear | search_fanout | [The consequences of weakening Alberta's industrial carbon pricing](https://www.pembina.org/blog/consequences-weakening-albertas-industrial-carbon-pricing) |
| context | climate-environment, economic-policy | 0.35 | adjacent-authority-source | date-unclear | search_fanout | [Business Council welcomes the development of a new National ...](https://www.thebusinesscouncil.ca/publication/business-council-welcomes-the-development-of-a-new-national-electricity-strategy) |
| context | economic-policy, major-projects | 0.45 | adjacent-authority-source | date-unclear | search_fanout | [Government of Canada and Alberta agreement is a step in the right ...](https://www.thebusinesscouncil.ca/publication/government-of-canada-and-alberta-agreement-is-a-step-in-the-right-direction) |
| context | defence-trade | 0.30 | adjacent-authority-source | date-unclear | search_fanout | [When Agendas Align, Opportunities Abound](https://www.thebusinesscouncil.ca/publication/when-agendas-align-opportunities-abound) |
| context | defence-trade, economic-policy | 0.35 | adjacent-authority-source | date-unclear | search_fanout | [The Trade Brief: Same system, new headaches](https://www.thebusinesscouncil.ca/publication/the-trade-briefsame-system-new-headaches) |
| manual_browser_pull | housing-supply | 0.50 | adjacent-authority-source | date-unclear | search_fanout | [[PDF] Housing market monitor - Canada: Home sales increased in April for ...](https://www.nbc.ca/content/dam/bnc/taux-analyses/analyse-eco/logement/economic-news-resale-market.pdf) |
| manual_browser_pull | housing-supply | 0.40 | adjacent-authority-source | date-unclear | search_fanout | [[PDF] Economic News - National Bank](https://www.nbc.ca/content/dam/bnc/taux-analyses/analyse-eco/logement/economic-news-resale-canada.pdf) |

## Borderline (calibration band)

These items surfaced only because this run used the permissive 0.08 calibration threshold instead of the normal 0.15 threshold.

_No borderline candidates landed between the two thresholds._

### Threshold calibration

| Threshold | Would surface |
| --- | --- |
| 0.08 permissive | 35 |
| 0.15 normal | 35 |
| 0.30 stricter | 31 |

## Editor decision required

_Nothing routed to a metric, trigger, or promise queue this run._

## Access failures and browser-pull list

| Surface / item | Method | Detail |
| --- | --- | --- |
| [PDF] Restoring Public Finances: Enabling Effective Government - OECD | manual_browser_pull | see https://www.oecd.org/content/dam/oecd/en/publications/reports/2026/05/restoring-public-finances_0c1f7ce5/fbcf9161-en.pdf |
| [PDF] Housing market monitor - Canada: Home sales increased in April for ... | manual_browser_pull | see https://www.nbc.ca/content/dam/bnc/taux-analyses/analyse-eco/logement/economic-news-resale-market.pdf |
| [PDF] Economic News - National Bank | manual_browser_pull | see https://www.nbc.ca/content/dam/bnc/taux-analyses/analyse-eco/logement/economic-news-resale-canada.pdf |
| Debates (Hansard) No. 118 - May 6, 2026 (45-1) - House of ... | manual_browser_pull | see https://www.ourcommons.ca/documentviewer/en/45-1/house/sitting-118/hansard |
| [PDF] Scotiabank Q2 2026 Report to Shareholders | manual_browser_pull | see https://www.scotiabank.com/content/dam/scotiabank/corporate/quarterly-reports/2026/q2/Q226_Shareholders_Report-EN.pdf |
| Friday May 1, 2026 Episode Transcript \| CBC Radio | manual_browser_pull | see https://www.cbc.ca/radio/thecurrent/friday-may-1-2026-episode-transcript-9.7185509 |

## Suppressed / low-relevance

36 items were routed irrelevant or scored below the surfacing threshold. They are kept in the candidate JSON for audit, not shown here.

---

No grades, statuses, thresholds, scoring, or dashboard data were changed by this run. Everything below is a candidate for the editor to look at.
