# Source monitoring candidates - 2026-06

> DRY RUN. The search fan-out and the relevance pass did not run. This packet shows the format and the deterministic-tier output only.

_Generated 2026-06-13T19:23:21+00:00._

No grades, statuses, thresholds, scoring, or dashboard data were changed by this run. Everything below is a candidate for the editor to look at.

## Run status

| Tier | Status |
| --- | --- |
| deterministic | run (fetch-results-sample.json) |
| search_fanout | skipped (dry-run) |
| classification | skipped (dry-run) |

## Sources surveyed

64 surfaces in the registry. By method: api 4, page_hash 2, rss 10, search_fanout 48.

## Deterministic candidates

From the machine-readable pullers in `fetch-data.py` (RSS, StatCan WDS, IRCC, Bank of Canada, LEGISinfo, MPO page, Ethics page, link-rot).

| Routing | Dimensions | Score | Discovery | Item |
| --- | --- | --- | --- | --- |
| (unclassified) | affordability-response, defence-trade, economic-policy, immigration, promise-delivery | - | statcan_wds | [StatCan Consumer Price Index - Food purchased from stores: newer release available](https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1810000401) |
| (unclassified) | affordability-response, defence-trade, economic-policy, immigration, promise-delivery | - | statcan_wds | [StatCan Population estimates, quarterly: newer release available](https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1710000901) |
| (unclassified) | affordability-response, carbon-pricing, defence-trade, execution-delivery, fiscal-health, housing-supply, immigration, promise-delivery | - | rss | [Fiscal Sustainability Report 2026](https://www.pbo-dpb.ca/en/publications/RP-2627-001-S--fiscal-sustainability-report-2026) |
| (unclassified) | affordability-response, carbon-pricing, defence-trade, execution-delivery, fiscal-health, housing-supply, immigration, promise-delivery | - | rss | [Cost estimate: expanded Build Canada Homes program](https://www.pbo-dpb.ca/en/publications/LEG-2627-010-S--build-canada-homes-expansion) |
| (unclassified) | approval-signal | - | rss | [Carney government approval holds in June Abacus release](https://abacusdata.ca/canadian-politics-carney-approval-june-2026/) |
| (unclassified) | affordability-response, climate-environment, major-projects | - | rss | [New housing-supply analysis: federal starts vs targets](https://www.fraserinstitute.org/studies/federal-housing-starts-vs-targets-2026) |
| (unclassified) | defence-trade, economic-policy, execution-delivery, major-projects, promise-delivery | - | legisinfo | [C-5: Royal Assent](https://www.parl.ca/legisinfo/en/bill/45-1/c-5) |
| (unclassified) | major-projects | - | mpo_diff | [MPO page lists a project not in the cohort: Cedar LNG Phase 2 expansion](https://www.canada.ca/en/privy-council/major-projects-office/projects/national.html) |
| (unclassified) | ethics-transparency | - | ethics_diff | [New Ethics Commissioner report listing: Examination report under the Conflict of Interest Act (June 2026)](https://ciec-ccie.parl.gc.ca/en/investigations-enquetes/Pages/ExampleReport-2026.aspx) |
| (unclassified) | ethics-transparency | - | link_rot | [Cited URL blocked: Ethics & Transparency: Commissioner investigation registry](https://ciec-ccie.parl.gc.ca/en/investigations-enquetes/Pages/AllInvestRepAct-TousRapEnqLoi.aspx) |
| (unclassified) | carbon-pricing, climate-environment, promise-delivery | - | link_rot | [Cited URL broken: Climate & Environment: ECCC transparency page](https://www.canada.ca/en/environment-climate-change/corporate/transparency/example-moved.html) |

## Search fan-out candidates (provisional)

Discovery only. Snippets are not citation-ready. Anything grade-relevant needs a browser pull and editor verification before it touches the dashboard.

_No search fan-out candidates this run._

## Editor decision required

_Nothing routed to a metric, trigger, or promise queue this run._

## Access failures and browser-pull list

| Surface / item | Method | Detail |
| --- | --- | --- |
| Léger | rss | http_error |

## Suppressed / low-relevance

_Nothing suppressed this run._

---

No grades, statuses, thresholds, scoring, or dashboard data were changed by this run. Everything below is a candidate for the editor to look at.
