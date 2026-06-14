# Source monitoring candidates - 2026-06

_Generated 2026-06-14T01:34:47+00:00._

No grades, statuses, thresholds, scoring, or dashboard data were changed by this run. Everything below is a candidate for the editor to look at.

## Run status

| Tier | Status |
| --- | --- |
| deterministic | run (fetch-results.json) |
| search_fanout | run (69 hits) |
| classification | run (model claude-opus-4-8) |

## Sources surveyed

64 surfaces in the registry. By method: api 4, page_hash 2, rss 10, search_fanout 48.

## Deterministic candidates

From the machine-readable pullers in `fetch-data.py` (RSS, StatCan WDS, IRCC, Bank of Canada, LEGISinfo, MPO page, Ethics page, link-rot).

| Routing | Dimensions | Score | Discovery | Item |
| --- | --- | --- | --- | --- |
| context | ethics-transparency | 0.45 | rss | [House Ethics Committee must recommend many key changes to close secret, unethical lobbying loopholes, and to require effective enforcement](https://democracywatch.ca/house-ethics-committee-must-recommend-many-key-changes-to-close-secret-unethical-lobbying-loopholes-and-to-require-effective-enforcement/) |
| context | ethics-transparency | 0.40 | rss | [Liberals vote against changes to Bill C-25 to stop secret, undemocratic influence of wealthy interests, lobbyists and foreigners in federal elections and policy-making processes](https://democracywatch.ca/liberals-vote-against-changes-to-bill-c-25-to-stop-secret-undemocratic-influence-of-wealthy-interests-lobbyists-and-foreigners-in-federal-elections-and-policy-making-processes/) |
| context | ethics-transparency | 0.40 | rss | [Commissioner of Lobbying has let off 98% of the lobbyists she has found violating the lobbying law or code since 2018](https://democracywatch.ca/commissioner-of-lobbying-has-let-off-98-of-the-lobbyists-she-has-found-violating-the-lobbying-law-or-code-since-2018/) |
| context | ethics-transparency | 0.30 | rss | [Trudeau’s Senate appointment process was as partisan as ever – will PM Carney make it actually independent?](https://democracywatch.ca/trudeaus-senate-appointment-process-was-as-partisan-as-ever-will-pm-carney-make-it-actually-independent/) |
| trigger_watch | defence-trade, economic-policy, execution-delivery, major-projects, promise-delivery | 0.85 | legisinfo | [C-5: Royal assent received](https://www.parl.ca/legisinfo/en/bill/45-1/c-5/json) |

## Search fan-out candidates (provisional)

Discovery only. Snippets are not citation-ready. Anything grade-relevant needs a browser pull and editor verification before it touches the dashboard.

| Routing | Dimensions | Score | Discovery | Item |
| --- | --- | --- | --- | --- |
| context | climate-environment | 0.30 | search_fanout | [PFAS guidance for reporting to the National Pollutant Release Inventory - Canada.ca](https://www.canada.ca/en/environment-climate-change/services/national-pollutant-release-inventory/report/pfas.html) |
| context | defence-trade | 0.40 | search_fanout | [Canada tables legislation to strengthen prohibition on goods ...](https://www.canada.ca/en/global-affairs/news/2026/06/canada-tables-legislation-to-strengthen-prohibition-on-goods-produced-with-forced-labour.html) |
| context | economic-policy, fiscal-health, promise-delivery | 0.50 | search_fanout | [President of the Treasury Board Appearance at the Standing Committee on Government Operations and Estimates (OGGO) – Bill C-15, Budget 2025 Implementation Act, No. 1 – February 2026 - Canada.ca](https://www.canada.ca/en/treasury-board-secretariat/corporate/transparency/briefing-documents-treasury-board-canada-secretariat/parliamentary-committee/president-appearance-oggo-bill-c-15-budget-2025-implementation-february-2026.html) |
| context | economic-policy, promise-delivery | 0.45 | search_fanout | [Canada's National Artificial Intelligence Strategy: AI for All](https://ised-isde.canada.ca/site/ised/en/canadas-national-artificial-intelligence-strategy-ai-all) |
| context | climate-environment | 0.35 | search_fanout | [Canada invests in its first national geothermal energy roadmap](https://www.canada.ca/en/natural-resources-canada/news/2026/06/canada-invests-in-its-first-national-geothermal-energy-roadmap.html) |
| context | affordability-response, climate-environment | 0.30 | search_fanout | [Canada Greener Homes Initiative](https://natural-resources.canada.ca/energy-efficiency/home-energy-efficiency/canada-greener-homes-initiative/canada-greener-homes-initiative) |
| context | fiscal-health | 0.40 | search_fanout | [Comptroller General of Canada Appearance Before the Standing Committee on Public Accounts (PACP): the Public Accounts of Canada – February 9, 2026 - Canada.ca](https://www.canada.ca/en/treasury-board-secretariat/corporate/transparency/briefing-documents-treasury-board-canada-secretariat/briefing-books-comptroller-general-canada/comptroller-general-canada-appearance-before-standing-committee-public-accounts-pacp-february-9-2026.html) |
| context | economic-policy, promise-delivery | 0.40 | search_fanout | [Canada's National Artificial Intelligence Strategy: AI for All](https://ised-isde.canada.ca/site/ised/en/canadas-national-artificial-intelligence-strategy-ai-all) |
| context | housing-supply | 0.35 | search_fanout | [Canada and Prince Edward Island invest in wastewater and ...](https://www.canada.ca/en/housing-infrastructure-communities/news/2026/06/canada-and-prince-edward-island-invest-in-wastewater-and-stormwater-infrastructure-to-support-more-housing-in-alberton.html) |
| context | defence-trade | 0.30 | search_fanout | [Canada tables legislation to strengthen prohibition on goods ...](https://www.canada.ca/en/global-affairs/news/2026/06/canada-tables-legislation-to-strengthen-prohibition-on-goods-produced-with-forced-labour.html) |
| context | fiscal-health | 0.50 | search_fanout | [President of the Treasury Board Appearance at the Standing Committee on Government Operations and Estimates (OGGO) – Bill C-15, Budget 2025 Implementation Act, No. 1 – February 2026 - Canada.ca](https://www.canada.ca/en/treasury-board-secretariat/corporate/transparency/briefing-documents-treasury-board-canada-secretariat/parliamentary-committee/president-appearance-oggo-bill-c-15-budget-2025-implementation-february-2026.html) |
| context | economic-policy | 0.40 | search_fanout | [Canada's National Artificial Intelligence Strategy: AI for All](https://ised-isde.canada.ca/site/ised/en/canadas-national-artificial-intelligence-strategy-ai-all) |
| context | fiscal-health | 0.50 | search_fanout | [President of the Treasury Board Appearance at the Standing Committee on Government Operations and Estimates (OGGO) – Bill C-15, Budget 2025 Implementation Act, No. 1 – February 2026 - Canada.ca](https://www.canada.ca/en/treasury-board-secretariat/corporate/transparency/briefing-documents-treasury-board-canada-secretariat/parliamentary-committee/president-appearance-oggo-bill-c-15-budget-2025-implementation-february-2026.html) |
| context | economic-policy | 0.40 | search_fanout | [Canada's National Artificial Intelligence Strategy: AI for All](https://ised-isde.canada.ca/site/ised/en/canadas-national-artificial-intelligence-strategy-ai-all) |
| context | defence-trade, economic-policy | 0.50 | search_fanout | [Minister Joly reinforces strategic ties with European Commission at Conference of Montreal - Canada.ca](https://www.canada.ca/en/innovation-science-economic-development/news/2026/06/minister-joly-reinforces-strategic-ties-with-european-commission-at-conference-of-montreal.html) |
| context | defence-trade, economic-policy | 0.55 | search_fanout | [Minister Sidhu advances Canada’s trade and economic priorities at Organisation for Economic Co-operation and Development meeting - Canada.ca](https://www.canada.ca/en/global-affairs/news/2026/06/minister-sidhu-advances-canadas-trade-and-economic-priorities-at-organisation-for-economic-co-operation-and-development-meeting.html) |
| promise_status | fiscal-health | 0.60 | search_fanout | [Report on the Impact of Reducing the Lowest Marginal Personal ...](https://www.canada.ca/en/department-finance/services/publications/report-impact-reducing-lowest-marginal-personal-income-tax-rate-non-refundable-tax-credits.html) |
| context | affordability-response | 0.45 | search_fanout | [Government of Canada introduces targeted support to help ...](https://www.canada.ca/en/department-finance/news/2026/06/government-of-canada-introduces-targeted-support-to-help-canadas-airline-sector-weather-global-fuel-market-volatility.html) |
| context | housing-supply | 0.40 | search_fanout | [Canada and Prince Edward Island invest in wastewater and ...](https://www.canada.ca/en/housing-infrastructure-communities/news/2026/06/canada-and-prince-edward-island-invest-in-wastewater-and-stormwater-infrastructure-to-support-more-housing-in-alberton.html) |
| context | economic-policy | 0.35 | search_fanout | [Canada's National Artificial Intelligence Strategy: AI for All](https://ised-isde.canada.ca/site/ised/en/canadas-national-artificial-intelligence-strategy-ai-all) |
| context | defence-trade | 0.30 | search_fanout | [Minister Joly announces a $75 million investment in Canadian Blood Services and Canadian Armed Forces partnership - Canada.ca](https://www.canada.ca/en/innovation-science-economic-development/news/2026/06/minister-joly-announces-a-75-million-investment-in-canadian-blood-services-and-canadian-armed-forces-partnership.html) |
| context | defence-trade | 0.40 | search_fanout | [Minister Joly reinforces strategic ties with European Commission at Conference of Montreal - Canada.ca](https://www.canada.ca/en/innovation-science-economic-development/news/2026/06/minister-joly-reinforces-strategic-ties-with-european-commission-at-conference-of-montreal.html) |
| context | defence-trade | 0.40 | search_fanout | [Minister Sidhu advances Canada’s trade and economic priorities at Organisation for Economic Co-operation and Development meeting - Canada.ca](https://www.canada.ca/en/global-affairs/news/2026/06/minister-sidhu-advances-canadas-trade-and-economic-priorities-at-organisation-for-economic-co-operation-and-development-meeting.html) |
| manual_browser_pull | economic-policy | 0.20 | search_fanout | [Government of Canada and partners invest over $10M to strengthen ...](https://www.canada.ca/en/institutes-health-research/news/2026/06/government-of-canada-and-partners-invest-over-10m-to-strengthen-public-health-systems-through-research.html) |
| context | defence-trade, economic-policy | 0.45 | search_fanout | [The Minister responsible for Canada-U.S. Trade, Intergovernmental ...](https://international.canada.ca/en/global-affairs/corporate/transparency/briefing-documents/parliamentary-committee/2026-04-16-ciit) |
| source_balance | ethics-transparency | 0.20 | search_fanout | [Debates (Hansard) No. 135 - June 12, 2026 (45-1) - House of Commons of Canada](https://www.ourcommons.ca/documentviewer/en/house/latest/hansard) |
| context | affordability-response | 0.25 | search_fanout | [AGRI - Home - House of Commons of Canada - OurCommons.ca](https://www.ourcommons.ca/committees/en/agri) |
| context | fiscal-health, housing-supply | 0.35 | search_fanout | [Perspectives podcast: What's behind the Bank of Canada's fifth ...](https://www.scotiabank.com/ca/en/about/perspectives.podcasts.perspectives.2026-06-bank-of-canada-interest-rate-hold-june.html) |
| manual_browser_pull | fiscal-health | 0.20 | search_fanout | [[PDF] The Inflation Report that Warsh Was Dreaming About - Scotiabank](https://www.scotiabank.com/content/dam/scotiabank/sub-brands/scotiabank-economics/english/documents/scotia-flash/scotiaflash20260610.pdf) |
| manual_browser_pull | fiscal-health | 0.20 | search_fanout | [The Inflation Report that Warsh Was Dreaming About - Scotiabank](https://www.scotiabank.com/ca/en/about/economics/economics-publications/post.other-publications.economic-indicators.scotia-flash.-june-10--2026-.html) |
| context | major-projects | 0.30 | search_fanout | [Public consultation on the future of Billy Bishop Toronto City Airport](https://tc.canada.ca/en/corporate-services/consultations/public-consultation-future-billy-bishop-toronto-city-airport) |
| context | economic-policy | 0.55 | search_fanout | [Canada's 'AI for All' strategy has ambitious growth targets, but it falls ...](https://theconversation.com/canadas-ai-for-all-strategy-has-ambitious-growth-targets-but-it-falls-short-on-workers-and-the-environment-284648) |

## Editor decision required

| Routing | Dimensions | Item | Why flagged |
| --- | --- | --- | --- |
| trigger_watch | defence-trade, economic-policy, execution-delivery, major-projects, promise-delivery | [C-5: Royal assent received](https://www.parl.ca/legisinfo/en/bill/45-1/c-5/json) | Bill C-5 received Royal assent. C-5 is the major-projects/one-review framework legislation; this bears on 'Bills passed', the national-interest designation and MPO triggers, flagship delivery, and related promise-delivery counts. Routed to editor for verification of which trigger conditions/metrics it touches; no grade implied. |
| promise_status | fiscal-health | [Report on the Impact of Reducing the Lowest Marginal Personal ...](https://www.canada.ca/en/department-finance/services/publications/report-impact-reducing-lowest-marginal-personal-income-tax-rate-non-refundable-tax-credits.html) | Bill C-4 reducing the lowest marginal personal income tax rate from 15% to 14.5%/14% bears on the 'Middle class income tax cut' promise tracked under fiscal-health. It is an official report describing the implemented measure, not a metric value refresh. |

## Access failures and browser-pull list

| Surface / item | Method | Detail |
| --- | --- | --- |
| Fraser Institute | rss | http_error |
| Conflict of Interest and Ethics Commissioner | page_hash | http_error |
| Government of Canada and partners invest over $10M to strengthen ... | manual_browser_pull | see https://www.canada.ca/en/institutes-health-research/news/2026/06/government-of-canada-and-partners-invest-over-10m-to-strengthen-public-health-systems-through-research.html |
| [PDF] The Inflation Report that Warsh Was Dreaming About - Scotiabank | manual_browser_pull | see https://www.scotiabank.com/content/dam/scotiabank/sub-brands/scotiabank-economics/english/documents/scotia-flash/scotiaflash20260610.pdf |
| The Inflation Report that Warsh Was Dreaming About - Scotiabank | manual_browser_pull | see https://www.scotiabank.com/ca/en/about/economics/economics-publications/post.other-publications.economic-indicators.scotia-flash.-june-10--2026-.html |

## Suppressed / low-relevance

40 items were routed irrelevant or scored below the surfacing threshold. They are kept in the candidate JSON for audit, not shown here.

---

No grades, statuses, thresholds, scoring, or dashboard data were changed by this run. Everything below is a candidate for the editor to look at.
