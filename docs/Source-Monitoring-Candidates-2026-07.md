# Source monitoring candidates - 2026-07

_Generated 2026-07-01T15:55:56+00:00._

No grades, statuses, thresholds, scoring, or dashboard data were changed by the
monitor run itself. The later 2026-08-26 cycle closeout below records the final
editor dispositions.

## Run status

| Tier | Status |
| --- | --- |
| deterministic | run (fetch-results.json) |
| search_fanout | run (110 hits) |
| classification | run (model claude-opus-4-8) |

## Cycle closeout - 2026-08-26

PR 30 was reconciled without merging its older monitor state. All 67 surfaced
candidates are closed, and the 57 mechanically suppressed records remain in
the JSON ledger for traceability.

- 7 candidates supplied evidence incorporated into the dashboard: the three
  StatCan updates, Deep Geological Repository, the Building Canada Act project
  list, Build Canada Homes Royal Assent, and the Toronto DCRP announcement.
- 2 candidates were recorded in the July cycle report without a separate
  dashboard move: the Build Canada Homes agency page and the Canada-US
  engagement page.
- 58 candidates closed with no dashboard move. The accepted 44-item context
  batch rests on the July publisher-family recertification and the later August
  review. It is family-level adjudication, not proof that each page was read
  separately.
- The five manual calls closed with no move. The C.D. Howe trade article and
  Retail Conditions Quarterly are context. The EV Affordability Program does
  not replace a climate strategy. Bill C-26 does not establish a signed
  agreement, payment, or construction. The Competition Bureau's June 16 food
  examination and June 22 Sobeys investigation are relevant Affordability
  context, but neither is a required competition measure passed into law or
  crosses another published trigger.
- 0 surfaced candidates remain unresolved. Exact ID lists and the disposition
  rule are in `monitoring/candidates/2026-07.json` under `cycleReview`.

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

| Routing | Dimensions | Score | Source relation | Timing | Discovery | Item |
| --- | --- | --- | --- | --- | --- | --- |
| metric_update | affordability-response | 0.80 | same-publisher-new-item | published-date-present | statcan_wds | [StatCan Consumer Price Index, monthly, not seasonally adjusted: newer release available](https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1810000401) |
| metric_update | immigration | 0.78 | same-publisher-new-item | published-date-present | statcan_wds | [StatCan Population estimates, quarterly: newer release available](https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1710000901) |
| metric_update | housing-supply | 0.82 | same-publisher-new-item | published-date-present | statcan_wds | [StatCan Canada Mortgage and Housing Corporation, housing starts, all areas, Canada and provinces, seasonally adjusted at annual rates, monthly: newer release available](https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=3410015801) |
| context | fiscal-health | 0.30 | same-publisher-new-item | published-date-present | rss | [IR0936 - TBS](https://www.pbo-dpb.ca/en/information-requests--demandes-information/IR0936) |
| context | immigration | 0.35 | same-publisher-new-item | published-date-present | rss | [IR0933 - IRCC](https://www.pbo-dpb.ca/en/information-requests--demandes-information/IR0933) |
| context | major-projects | 0.30 | same-publisher-new-item | published-date-present | rss | [IR0932 - TC](https://www.pbo-dpb.ca/en/information-requests--demandes-information/IR0932) |
| context | fiscal-health | 0.30 | same-publisher-new-item | published-date-present | rss | [IR0937 - CRA](https://www.pbo-dpb.ca/en/information-requests--demandes-information/IR0937) |
| context | affordability-response, fiscal-health | 0.45 | same-publisher-new-item | published-date-present | rss | [Delivering Automatic Federal Benefits for Low-Income Individuals](https://www.pbo-dpb.ca/en/publications/ES-2627-001-S--delivering-automatic-federal-benefits-low-income-individuals--automatiser-versement-prestations-federales-personnes-faible-revenu) |
| context | major-projects | 0.30 | same-publisher-new-item | published-date-present | rss | [IR0930 - VIA Rail](https://www.pbo-dpb.ca/en/information-requests--demandes-information/IR0930) |
| (unclassified) | execution-delivery, fiscal-health | - | same-publisher-new-item | published-date-present | rss | [Trumps’s Free Trade Distaste is More Than a Bargaining Ploy](https://cdhowe.org/publication/trumpss-free-trade-distaste-is-more-than-a-bargaining-ploy/) |
| context | defence-trade | 0.40 | same-publisher-new-item | published-date-present | rss | [How Can CUSMA Help Reduce US Trade Imbalances?](https://cdhowe.org/publication/how-can-cusma-help-reduce-us-trade-imbalances/) |
| context | fiscal-health | 0.35 | same-publisher-new-item | published-date-present | rss | [Keeping Our Edge: The Benefits of Sound Monetary and Fiscal Policy](https://cdhowe.org/publication/keeping-our-edge-the-benefits-of-sound-monetary-and-fiscal-policy/) |
| context | defence-trade, fiscal-health | 0.40 | same-publisher-new-item | published-date-present | rss | [Canada’s debt crisis will come from Washington](https://cdhowe.org/publication/canadas-debt-crisis-will-come-from-washington/) |
| context | defence-trade | 0.40 | same-publisher-new-item | published-date-present | rss | [North American free trade is gone, dead and buried](https://cdhowe.org/publication/north-american-free-trade-is-gone-dead-and-buried/) |
| context | defence-trade | 0.45 | same-publisher-new-item | published-date-present | rss | [CUSMA renewal deadline passed, U.S. tariffs remain-what it means for Canada and its economy](https://thehub.ca/2026/07/01/cusma-renewal-deadline-passed-u-s-tariffs-remain-what-it-means-for-canada-and-its-economy/) |
| context | major-projects | 0.45 | same-publisher-new-item | published-date-present | rss | [Alberta’s pipeline gambit puts Confederation’s capacity to build to the test](https://thehub.ca/2026/06/30/albertas-pipeline-gambit-puts-confederations-capacity-to-build-to-the-test/) |
| context | major-projects | 0.45 | same-publisher-new-item | published-date-present | rss | [Alberta’s pipeline proposal has become a critical test of Confederation](https://thehub.ca/2026/06/29/albertas-pipeline-proposal-has-become-a-critical-test-of-confederation/) |
| context | climate-environment | 0.35 | same-publisher-new-item | published-date-present | rss | [BMO, First Nations support new direct air carbon capture project: documents](https://thenarwhal.ca/manitoba-deep-sky-support/?utm_source=rss) |
| metric_update | major-projects | 0.70 | cited-source-update | date-unclear | mpo_diff | [MPO page lists a project not in the cohort: Deep Geological Repository](https://www.canada.ca/en/privy-council/major-projects-office/projects/national.html) |
| source_balance | major-projects | 0.60 | cited-source-update | date-unclear | link_rot | [Cited URL blocked: Major Projects: Fraser Institute - MPO assessment](https://www.fraserinstitute.org/commentary/carneys-major-projects-list-no-cause-celebration) |
| source_balance | affordability-response | 0.55 | cited-source-update | date-unclear | link_rot | [Cited URL blocked: Affordability Response: Fraser Institute - GST affordability strategy critique](https://www.fraserinstitute.org/commentary/carney-governments-gst-plan-new-name-same-flawed-affordability-strategy) |
| source_balance | affordability-response | 0.55 | cited-source-update | date-unclear | link_rot | [Cited URL blocked: Affordability Response: Retail Council of Canada - grocery and food](https://www.retailcouncil.org/topics/food-grocery/truth-of-canadian-grocery-price-inflation/) |
| source_balance | climate-environment | 0.55 | cited-source-update | date-unclear | link_rot | [Cited URL blocked: Climate & Environment: Fraser Institute - EV mandate critique](https://www.fraserinstitute.org/commentary/ottawa-should-finally-end-costly-push-evs-canada) |
| source_balance | carbon-pricing | 0.55 | cited-source-update | date-unclear | link_rot | [Cited URL blocked: Carbon Pricing Policy: IISD - Canadian Carbon Pricing Systems: 2025 Review](https://www.iisd.org/publications/report/canadian-carbon-pricing-systems-2025-review) |
| source_balance | climate-environment | 0.55 | cited-source-update | date-unclear | link_rot | [Cited URL blocked: Climate & Environment: IISD - Canada's 2030 climate target](https://www.iisd.org/articles/insight/critical-next-step-canadas-2030-climate-target) |

## Search fan-out candidates (provisional)

Discovery only. Snippets are not citation-ready. Anything grade-relevant needs a browser pull and editor verification before it touches the dashboard.

| Routing | Dimensions | Score | Source relation | Timing | Discovery | Item |
| --- | --- | --- | --- | --- | --- | --- |
| context | climate-environment | 0.40 | same-publisher-new-item | date-unclear | search_fanout | [Canada and Quebec reach an agreement for the recovery and protection of caribou - Canada.ca](https://www.canada.ca/en/environment-climate-change/news/2026/06/canada-and-quebec-reach-an-agreement-for-the-recovery-and-protection-of-caribou.html) |
| context | climate-environment | 0.25 | same-publisher-new-item | date-unclear | search_fanout | [Government of Canada to make an announcement on climate action related to health - Canada.ca](https://www.canada.ca/en/health-canada/news/2026/06/government-of-canada-to-make-an-announcement-on-climate-action-related-to-health.html) |
| context | climate-environment | 0.40 | same-publisher-new-item | date-unclear | search_fanout | [Minister Dabrusin drives climate action, clean growth, and economic competitiveness at MoCA and London Climate Action Week - Canada.ca](https://www.canada.ca/en/environment-climate-change/news/2026/06/minister-dabrusin-drives-climate-action-clean-growth-and-economic-competitiveness-at-moca-and-london-climate-action-week.html) |
| context | climate-environment | 0.35 | same-publisher-new-item | date-unclear | search_fanout | [Government of Canada invests over $17 million to address health impacts from climate change - Canada.ca](https://www.canada.ca/en/health-canada/news/2026/06/government-of-canada-invests-over-17-million-to-address-health-impacts-from-climate-change.html) |
| context | affordability-response, climate-environment | 0.40 | same-publisher-new-item | date-unclear | search_fanout | [Canada drives lower bills and cleaner energy in Quebec, British Columbia, Nova Scotia and Prince Edward Island - Canada.ca](https://www.canada.ca/en/natural-resources-canada/news/2026/06/canada-drives-lower-bills-and-cleaner-energy-in-quebec-british-columbia-nova-scotia-and-prince-edward-island.html) |
| context | climate-environment, promise-delivery | 0.30 | same-publisher-new-item | date-unclear | search_fanout | [Taking action together - Canada's 2026 Annual Report on the 2030 ...](https://www.canada.ca/en/employment-social-development/programs/agenda-2030/2026-annual-report-sdg.html) |
| context | major-projects | 0.50 | same-publisher-new-item | date-unclear | search_fanout | [Building Canada Act - Projects of National Interest - One Canadian Economy - Canada.ca](https://www.canada.ca/en/one-canadian-economy/services/building-canada-act-projects-national-interest.html) |
| context | climate-environment | 0.30 | same-publisher-new-item | date-unclear | search_fanout | [Government of Canada marks launch of modernized National Capital Region District Energy System - Canada.ca](https://www.canada.ca/en/public-services-procurement/news/2026/06/government-of-canada-marks-launch-of-modernized-national-capital-region-district-energy-system.html) |
| context | affordability-response, climate-environment | 0.50 | same-publisher-new-item | date-unclear | search_fanout | [Canada takes action to advance a stronger grid and increase reliable, affordable energy - Canada.ca](https://www.canada.ca/en/natural-resources-canada/news/2026/06/canada-takes-action-to-advance-a-stronger-grid-and-increase-reliable-affordable-energy.html) |
| context | climate-environment | 0.30 | same-publisher-new-item | date-unclear | search_fanout | [Government of Canada invests $21.6 million in first-of-its-kind clean energy project in Manitoba - Canada.ca](https://www.canada.ca/en/natural-resources-canada/news/2026/06/government-of-canada-invests-216-million-in-first-of-its-kind-clean-energy-project-in-manitoba.html) |
| context | climate-environment, economic-policy | 0.30 | same-publisher-new-item | date-unclear | search_fanout | [Backgrounder: Canada invests in energy innovation and efficiency projects in Alberta - Canada.ca](https://www.canada.ca/en/natural-resources-canada/news/2026/06/backgrounder-canada-invests-in-energy-innovation-and-efficiency-projects-in-alberta.html) |
| context | climate-environment | 0.40 | same-publisher-new-item | date-unclear | search_fanout | [Government of Canada announces $17.2 million to support clean energy projects in Nunavut - Canada.ca](https://www.canada.ca/en/natural-resources-canada/news/2026/06/government-of-canada-announces-172-million-to-support-clean-energy-projects-in-nunavut.html) |
| manual_browser_pull | affordability-response, climate-environment | 0.30 | same-publisher-new-item | date-unclear | search_fanout | [Electric Vehicle Affordability Program](https://tc.canada.ca/en/road-transportation/innovative-technologies/electric-vehicles/electric-vehicle-affordability-program) |
| trigger_watch | housing-supply, promise-delivery | 0.70 | same-publisher-new-item | date-unclear | search_fanout | [Legislation passes to boost housing supply and help make housing more attainable for all Canadians - Canada.ca](https://www.canada.ca/en/department-finance/news/2026/06/legislation-passes-to-boost-housing-supply-and-help-make-housing-more-attainable-for-all-canadians.html) |
| context | housing-supply | 0.35 | same-publisher-new-item | date-unclear | search_fanout | [Building Canada Strong by Investing in Regional Wastewater Infrastructure in the RM of St. Clements - Canada.ca](https://www.canada.ca/en/housing-infrastructure-communities/news/2026/06/building-canada-strong-by-investing-in-regional-wastewater-infrastructure-in-the-rm-of-st-clements.html) |
| promise_status | execution-delivery, housing-supply, promise-delivery | 0.85 | same-publisher-new-item | date-unclear | search_fanout | [Government of Canada marks Royal Assent of the Build Canada Homes Act - Canada.ca](https://www.canada.ca/en/housing-infrastructure-communities/news/2026/06/government-of-canada-marks-royal-assent-of-the-build-canada-homes-act.html) |
| context | housing-supply | 0.35 | same-publisher-new-item | date-unclear | search_fanout | [Canada and New Brunswick invest water and sewer infrastructure to support more housing in Campbellton - Canada.ca](https://www.canada.ca/en/housing-infrastructure-communities/news/2026/06/canada-and-new-brunswick-invest-water-and-sewer-infrastructure-to-support-more-housing-in-campbellton.html) |
| manual_browser_pull | housing-supply, promise-delivery | 0.30 | search-only-provisional | date-unclear | search_fanout | [Build Canada Homes](https://housing-infrastructure.canada.ca/bch-mc/index-eng.html) |
| context | defence-trade, economic-policy | 0.30 | same-publisher-new-item | date-unclear | search_fanout | [Real-time dynamic calibration for human-autonomy teams](https://www.canada.ca/en/department-national-defence/programs/defence-ideas/element/innovation-networks/challenge/cognition-and-trust-real-time-dynamic-calibration-for-human-autonomy-teams.html) |
| context | economic-policy, fiscal-health | 0.40 | same-publisher-new-item | date-unclear | search_fanout | [Legislation passes to implement measures from the Spring Economic Update 2026 - Canada.ca](https://www.canada.ca/en/department-finance/news/2026/06/legislation-passes-to-implement-measures-from-the-spring-economic-update-2026.html) |
| context | affordability-response, economic-policy | 0.35 | same-publisher-new-item | date-unclear | search_fanout | [Government of Canada launched the Strategic Response Fund call for proposals to support domestic food security and strengthen Canadian industry - Canada.ca](https://www.canada.ca/en/innovation-science-economic-development/news/2026/06/government-of-canada-launched-the-strategic-response-fund-call-for-proposals-to-support-domestic-food-security-and-strengthen-canadian-industry.html) |
| context | affordability-response | 0.30 | same-publisher-new-item | date-unclear | search_fanout | [Two Nunavut communities strengthen access to traditional foods with new processing facilities - Canada.ca](https://www.canada.ca/en/northern-economic-development/news/2026/06/two-nunavut-communities-strengthen-access-to-traditional-foods-with-new-processing-facilities.html) |
| context | economic-policy | 0.35 | same-publisher-new-item | date-unclear | search_fanout | [Minister Joly to announce investment to ADF Group - Canada.ca](https://www.canada.ca/en/innovation-science-economic-development/news/2026/06/minister-joly-to-announce-investment-to-adf-group.html) |
| context | housing-supply | 0.55 | same-publisher-new-item | date-unclear | search_fanout | [Canada and Ontario Making Homes More Affordable in Toronto - Canada.ca](https://www.canada.ca/en/housing-infrastructure-communities/news/2026/06/canada-and-ontario-making-homes-more-affordable-in-toronto.html) |
| context | economic-policy | 0.30 | search-only-provisional | date-unclear | search_fanout | [News releases - Competition Bureau Canada](https://competition-bureau.canada.ca/how-we-foster-competition/education-and-outreach/news-releases?Open=undefined&wbdisable=true) |
| context | climate-environment | 0.50 | same-publisher-new-item | date-unclear | search_fanout | [Energy minister plans 'nuclear renaissance' with up to 10 reactors built by 2040 \| CBC News](https://www.cbc.ca/news/politics/federal-nuclear-strategy-9.7244509) |
| context | climate-environment | 0.30 | same-publisher-new-item | date-unclear | search_fanout | [Prepartory documents for CEO appearance before House of ... - CER](https://www.cer-rec.gc.ca/en/about/who-we-are-what-we-do/governance/committee-natural-resources-RNNR-briefing-binder-2026/index.html) |
| context | affordability-response, economic-policy | 0.40 | same-publisher-new-item | date-unclear | search_fanout | [The Economic Returns of Accessible and Affordable Child Care in ...](https://csls.ca/research/june-2026-research-paper) |
| context | economic-policy | 0.30 | same-publisher-new-item | date-unclear | search_fanout | [[PDF] The Role of Natural Capital in Explaining the Rise and Fall of Global ...](https://csls.ca/wp-content/uploads/2026/06/CSLS-Research-Report-2025-07.pdf) |
| context | defence-trade | 0.40 | same-publisher-new-item | date-unclear | search_fanout | [Canada's engagement with the United States - Global Affairs Canada](https://international.canada.ca/en/global-affairs/campaigns/canada-us-engagement) |
| context | defence-trade | 0.30 | same-publisher-new-item | date-unclear | search_fanout | [Canada's MAGA moment doesn't undo strategic partnership with ...](https://macdonaldlaurier.ca/canadas-maga-moment-doesnt-undo-strategic-partnership-with-china-raquel-garbers-in-the-washington-examiner) |
| context | defence-trade | 0.30 | same-publisher-new-item | date-unclear | search_fanout | [Power and peril - How Chinese EVs, solar systems, and embedded ...](https://macdonaldlaurier.ca/power-and-peril-how-chinese-evs-solar-systems-and-embedded-technologies-threaten-canadas-national-security) |
| context | economic-policy | 0.40 | same-publisher-new-item | date-unclear | search_fanout | [General assessment of the macroeconomic situation: OECD Economic Outlook, Volume 2026 Issue 1 \| OECD](https://www.oecd.org/en/publications/oecd-economic-outlook-volume-2026-issue-1_2d1956f0-en/full-report/general-assessment-of-the-macroeconomic-situation_fe9bdcd6.html) |
| context | economic-policy | 0.35 | same-publisher-new-item | date-unclear | search_fanout | [From energy shocks to stronger resilience: OECD Economic Outlook ...](https://www.oecd.org/en/publications/oecd-economic-outlook-volume-2026-issue-1_2d1956f0-en/full-report/from-energy-shocks-to-stronger-resilience_761a5995.html) |
| context | major-projects, promise-delivery | 0.30 | same-publisher-new-item | date-unclear | search_fanout | [Journals No. 139A - June 18, 2026 (45-1) - House of Commons of Canada](https://www.ourcommons.ca/documentviewer/en/house/latest-sitting) |
| context | promise-delivery | 0.20 | same-publisher-new-item | date-unclear | search_fanout | [Debates (Hansard) No. 139 - June 18, 2026 (45-1) - House of ...](https://www.ourcommons.ca/documentviewer/en/house/latest/hansard) |
| manual_browser_pull | affordability-response | 0.55 | same-publisher-new-item | date-unclear | search_fanout | [Retail Conditions Quarterly - Spring 2026 - Retail Council of Canada](https://www.retailcouncil.org/research/retail-conditions-quarterly-spring-2026) |
| context | affordability-response, economic-policy | 0.40 | same-publisher-new-item | date-unclear | search_fanout | [Canada's Economy Off to Rocky Start in 2026 - Signal49 Research](https://www.signal49.ca/insights/canadas-economy-off-to-rocky-start-in-2026) |
| context | housing-supply | 0.40 | same-publisher-new-item | date-unclear | search_fanout | [Housing Market Update for June 2026 - Signal49 Research](https://www.signal49.ca/product/housing-market-update_jun2026) |
| context | major-projects | 0.55 | same-publisher-new-item | date-unclear | search_fanout | [19. PIC - Funding for the Hudson Bay Railway and Port of Churchill](https://tc.canada.ca/en/binder/19-pic-funding-hudson-bay-railway-port-churchill) |
| context | defence-trade, major-projects | 0.50 | same-publisher-new-item | date-unclear | search_fanout | [Transportation in Canada annual report 2025](https://tc.canada.ca/en/corporate-services/transparency/corporate-management-reporting/transportation-canada-annual-reports/transportation-canada-annual-report-2025) |
| context | defence-trade, major-projects | 0.60 | same-publisher-new-item | date-unclear | search_fanout | [17. PIC - Canada’s Trade and Transportation Corridors](https://tc.canada.ca/en/binder/17-pic-canada-s-trade-transportation-corridors) |

## Editor decision required

| Routing | Dimensions | Item | Why flagged |
| --- | --- | --- | --- |
| metric_update | affordability-response | [StatCan Consumer Price Index, monthly, not seasonally adjusted: newer release available](https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1810000401) | StatCan CPI table (pid 1810000401) with a cubeEndDate (2026-05) ahead of the dashboard period. CPI is the direct source for the Food CPI (stores, YoY) metric in affordability-response. Verified WDS release, so a refreshed value for a tracked metric. |
| metric_update | immigration | [StatCan Population estimates, quarterly: newer release available](https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1710000901) | StatCan quarterly population estimates (pid 1710000901) with cubeEndDate 2026-04 ahead of the dashboard. Directly feeds the immigration 'Population change (2025)' metric. Verified WDS release of a refreshed tracked metric. |
| metric_update | housing-supply | [StatCan Canada Mortgage and Housing Corporation, housing starts, all areas, Canada and provinces, seasonally adjusted at annual rates, monthly: newer release available](https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=3410015801) | StatCan/CMHC housing starts SAAR table (pid 3410015801) with cubeEndDate 2026-05 ahead of dashboard. Directly maps to the housing-supply 'Housing starts (Apr 2026 trend; SAAR)' metric. Verified WDS release. |
| metric_update | major-projects | [MPO page lists a project not in the cohort: Deep Geological Repository](https://www.canada.ca/en/privy-council/major-projects-office/projects/national.html) | MPO diff shows a project on the official Major Projects Office page not in the tracked cohort. This bears on tracked MPO metrics like projects in the MPO list and designation counts, so route as a metric_update for editor verification. |
| trigger_watch | housing-supply, promise-delivery | [Legislation passes to boost housing supply and help make housing more attainable for all Canadians - Canada.ca](https://www.canada.ca/en/department-finance/news/2026/06/legislation-passes-to-boost-housing-supply-and-help-make-housing-more-attainable-for-all-canadians.html) | Bill C-26 passing, providing $1.7B to provinces/territories to remove residential construction barriers, bears on the housing-supply down/up triggers concerning federal spending trajectory and disbursement, and relates to Promise Delivery (bills passed / housing target). Flagged as trigger_watch for editor review of federal housing contribution and disbursement conditions. No grade implied. |
| promise_status | execution-delivery, housing-supply, promise-delivery | [Government of Canada marks Royal Assent of the Build Canada Homes Act - Canada.ca](https://www.canada.ca/en/housing-infrastructure-communities/news/2026/06/government-of-canada-marks-royal-assent-of-the-build-canada-homes-act.html) | Bill C-20, the Build Canada Homes Act, receiving Royal Assent bears directly on the tracked 'Build Canada Homes' promise status and the housing-supply BCH-related metrics/triggers. Route as promise_status for editor review of delivery status; also relevant to flagship delivery. No status decided here. |

## Access failures and browser-pull list

| Surface / item | Method | Detail |
| --- | --- | --- |
| Fraser Institute | rss | http_error |
| Conflict of Interest and Ethics Commissioner | page_hash | http_error |
| Retail Conditions Quarterly - Spring 2026 - Retail Council of Canada | manual_browser_pull | see https://www.retailcouncil.org/research/retail-conditions-quarterly-spring-2026 |
| Electric Vehicle Affordability Program | manual_browser_pull | see https://tc.canada.ca/en/road-transportation/innovative-technologies/electric-vehicles/electric-vehicle-affordability-program |
| Build Canada Homes | manual_browser_pull | see https://housing-infrastructure.canada.ca/bch-mc/index-eng.html |

## Suppressed / low-relevance

57 items were routed irrelevant or scored below the surfacing threshold. They are kept in the candidate JSON for audit, not shown here.

---

No grades, statuses, thresholds, scoring, or dashboard data were changed by the
monitor run itself. The 2026-08-26 cycle closeout records the final editor
dispositions.
