# Round 2 Verification Pass - 2026-06-03

**Purpose:** Run the second source-to-claim check for the parked June work. This pass asks whether the current page content still supports what `src/data/dimensions.json` attributes to each source URL.

**Run date:** 2026-06-03
**Dashboard state when run:** v5.86 / HEAD `b3fc800`; this pass produces v5.87 for the Carbon Pricing wording cleanup and this doc.
**Mode:** Live web access available. Direct fetch was used first, then web search/open, then PDF extraction where the live URL returned a PDF.
**Scope:** Round 2 dimensions: Major Projects, Fiscal Health, Economic Policy Response, Housing Supply, Ethics & Transparency, Flagship Delivery, Promise Delivery. Cleanup queue: Climate Argus/BHRRC packet, IISD-2030 refresh check, Carbon Pricing PBO/effective-cost wording, Retail Council URL pick.
**Scope discipline:** No autonomous grade moves. No GPA, grade-point mapping, rounding, POCKETBOOK_DIMS, threshold, modifier, penalty, or dimension-model edits.

---

## Verification status by category

| Category | Count | Notes |
|---|---:|---|
| OK | 45 | Current source supports the dashboard claim or source-stack role. Some rows are source-role checks rather than metric-number checks. |
| stale-refresh-candidate | 2 | Carbon Pricing effective-cost wording and PBO carbon-GST note were safe to refresh; both are incorporated in v5.87. |
| URL-upgrade | 2 | Building Canada Act trigger could use the direct project-of-national-interest page; Climate cap status should use the post-MOU PMO implementation agreement if the editor approves. |
| URL-replacement | 3 | Climate Argus/BHRRC are pre-MOU and should not be the post-MOU confirmation sources; Major Projects Angus Reid supports public reaction, not the "mostly pre-existing investment" finding. |
| content-drift-with-grade-implications | 0 | No new grade-moving drift found in this pass. Economic Q1 business-investment evidence was already in v5.83 and remains editor-owned. |
| dead | 0 | No source was found genuinely dead after the fetch ladder. |
| editor-pull pending | 4 | OECD exact text, CHBA exact HMI text, Signal49 product text, and Angus Reid promise/report-card detail should be browser-pulled if the editor wants verbatim text beyond title/source-role confirmation. |

---

## Major Projects

| URL | Dashboard claim checked | Evidence pulled | Status | Recommended action |
|---|---|---|---|---|
| https://www.canada.ca/en/privy-council/major-projects-office/projects/national.html | Official MPO referred-projects list and current cohort anchor. | Direct fetch loaded the current page, modified 2026-05-21. Page title: "Projects referred to the MPO." The current list still contains 15 named projects. | OK | Keep. This is the best current cohort-count anchor. |
| https://www.pm.gc.ca/en/news/news-releases/2025/09/11/prime-minister-carney-announces-first-projects-be-reviewed-new | First tranche announcement and initial investment framing. | Direct fetch. PMO says the first projects represented "more than $60 billion" and that details were on the MPO website. | OK | Keep as tranche-history source. |
| https://www.pm.gc.ca/en/news/news-releases/2025/11/13/prime-minister-carney-announces-second-tranche-nation-building-projects | Second tranche announcement. | Direct fetch. PMO says the second tranche was referred to the MPO and represented "more than $56 billion." | OK | Keep as tranche-history source. |
| https://www.pm.gc.ca/en/news/news-releases/2026/03/12/prime-minister-carney-announces-ambitious-new-plan-defend-build-and | Third tranche / northern strategy projects. | Direct fetch. PMO says new northern projects were being referred to the Major Projects Office. | OK | Keep. |
| https://www.pm.gc.ca/en/news/news-releases/2026/04/09/prime-minister-carney-breaks-ground-contrecoeur-terminal-expansion | Contrecoeur post-designation movement. | Direct fetch. Title says PM "breaks ground" on the Contrecoeur terminal expansion; page says roughly $750M in annual economic benefits. | OK | Keep. |
| https://www.parl.ca/legisinfo/en/bill/45-1/c-5 | Building Canada Act existence and trigger support for national-interest designation / bypass risk. | Direct fetch. LegisInfo says C-5 enacts the Free Trade and Labour Mobility in Canada Act and the Building Canada Act, and received Royal Assent on 2025-06-26. | OK / URL-upgrade | Keep for Act status. Consider adding or swapping trigger support to the direct Canada.ca Building Canada Act / projects-of-national-interest explainer when the editor wants tighter trigger evidence. |
| https://www.fraserinstitute.org/commentary/carneys-major-projects-list-no-cause-celebration | Challenge source for overclaiming / mostly pre-existing investment framing. | Direct fetch blocked by Cloudflare; search/open path surfaced the Fraser article title and claim context. The article is still the right source for the "no cause for celebration" critique. | OK | Keep. |
| https://angusreid.org/major-projects-reaction-canada/ | Public reaction and major-project skepticism; currently also cited in the metric note as if Angus "found" the investment figure was mostly pre-existing. | Direct fetch was inconsistent; web path confirms the article title: "Canadians give mixed reviews to first five proposals." It supports public reaction, not the factual "mostly pre-existing" investment finding. | URL-replacement | Editor cleanup: rewrite the metric note so Fraser carries the "mostly pre-existing" assessment and Angus carries public reaction / mixed reviews. No grade implication. |

---

## Fiscal Health

| URL | Dashboard claim checked | Evidence pulled | Status | Recommended action |
|---|---|---|---|---|
| https://budget.canada.ca/2025/report-rapport/anx1-en.html | Budget 2025 deficit/fiscal-anchor baseline. | Direct fetch. Budget 2025 says the 2025-26 deficit was expected at $78.3B / 2.5% of GDP and that both fiscal anchors were met. | OK | Keep. |
| https://budget.canada.ca/update-miseajour/2026/report-rapport/anx1-en.html | SEU 2026 improved deficit and anchor status. | Direct fetch. SEU projects a $66.9B 2025-26 deficit and says the government is on track to meet its two fiscal anchors. | OK | Keep. |
| https://www.pbo-dpb.ca/en/publications/NT-2627-001-S--pbo-assessment-spring-economic-update-economic-fiscal-track--evaluation-dpb-mise-jour-economique-printemps-profil-evolution-economique-financiere | PBO economic/fiscal track. | Direct fetch. PBO table shows "Budgetary balance - Spring Economic Update" at -$66.9B in 2025-26. | OK | Keep. |
| https://www.pbo-dpb.ca/en/publications/NT-2627-002-S--pbo-assessment-spring-economic-update-fiscal-anchors-fiscal-sustainability--evaluation-dpb-mise-jour-economique-printemps-cibles-budgetaires-viabilite-financiere | PBO fiscal anchors and trigger source. | Direct fetch. PBO highlights say SEU projections indicate the government is on track to respect both fiscal anchors. | OK | Keep. |
| https://cdhowe.org/publication/fiscal-fantasies-four-incredible-projections-in-the-november-2025-federal-budget/ | Independent caveat source on fiscal projections. | Direct fetch. Page title confirms the C.D. Howe piece: "Fiscal Fantasies: Four Incredible Projections..." | OK | Keep. |
| https://www.canada.ca/en/department-finance/services/publications/annual-financial-report/2025.html | FY 2024-25 debt / public debt charges anchor. | Direct fetch loaded the Annual Financial Report page. Exact snippet extraction timed out on the large page, but the live page is accessible and matches the source role. | OK | Keep. |
| https://www.imf.org/en/publications/cr/issues/2026/01/21/canada-2025-article-iv-consultation-press-release-and-staff-report-573340/ | International fiscal / productivity benchmark. | Direct fetch loaded IMF Canada 2025 Article IV, country report 2026/012. | OK | Keep. |

---

## Economic Policy Response

| URL | Dashboard claim checked | Evidence pulled | Status | Recommended action |
|---|---|---|---|---|
| https://www.oecd.org/en/publications/2025/05/oecd-economic-surveys-canada-2025_ee18a269.html | OECD structural productivity context. | Direct fetch blocked. Search confirms the OECD Economic Surveys: Canada 2025 page. Exact source text not captured. | editor-pull pending | Keep, but browser-pull exact productivity quote if used in a future grade packet. |
| https://www150.statcan.gc.ca/n1/daily-quotidien/260227/dq260227a-eng.htm?HPA=1 | Q4 2025 GDP / business-investment baseline and triggers. | Direct fetch. StatCan says business investment rose 0.3% in 2025 and business capital investment edged down 0.1% in Q4. | OK | Keep. |
| https://ised-isde.canada.ca/site/ised/en/canadian-sovereign-ai-compute-strategy | AI compute strategy status / source stack. | Direct fetch. ISED says Budget 2024 announced $2B over five years to launch AI compute initiatives. | OK | Keep. |
| https://budget.canada.ca/2025/report-rapport/intro-en.html | Productivity super-deduction. | Direct fetch. Budget 2025 says the productivity super-deduction reduces Canada's METR from 15.6% to 13.2%. | OK | Keep. |
| https://www.canada.ca/en/treasury-board-secretariat/corporate/reports/annual-reports-parliament-federal-regulatory-management-initiatives/annual-report-2024-2025-fiscal-year-federal-regulatory-management-initiatives.html | Regulatory-management annual report. | Direct fetch loaded the page; it is the Annual Report for the 2024 to 2025 fiscal year. | OK | Keep. |
| https://www.canada.ca/en/intergovernmental-affairs/services/internal-trade.html | Internal Trade Action Plan status. | Direct fetch loaded the Internal Trade portal. It is a broad status/source page rather than a narrow progress table. | OK | Keep, but use a more specific implementation/status page if one appears. |
| https://www.parl.ca/legisinfo/en/bill/45-1/c-5 | Building Canada Act / regulatory-project lever. | Same as Major Projects. C-5 has Royal Assent and enacts the Building Canada Act. | OK | Keep. |
| https://www.canada.ca/en/natural-resources-canada/news/2026/03/canada-secures-30-new-critical-minerals-partnerships-and-unlocks-121-billion-in-mining-project-capital.html | Critical-minerals partnerships and capital figure. | Direct fetch loaded the NRCan release title: "30 new critical minerals partnerships" and "$12.1 billion." | OK | Keep. |
| http://www.csls.ca/ipm.asp | CSLS productivity research source stack. | Direct fetch. CSLS describes the International Productivity Monitor as open-access productivity research with a broad readership. | OK | Keep. |
| https://www.signal49.ca/product/canadas-five-year-business-investment-outlook_mar2026/ | Business investment outlook challenge source. | Direct fetch was inconsistent and later blocked; page title/source role confirmed. Exact report text not captured. | editor-pull pending | Keep as source role. Browser-pull exact investment quote before using in a grade packet. |
| https://www150.statcan.gc.ca/n1/daily-quotidien/260529/dq260529a-eng.htm | Q1 2026 GDP and business-investment metric. | Direct fetch. StatCan says real GDP was unchanged in Q1 2026, real GDP per capita rose 0.2%, and business capital investment fell 0.7%, the fifth consecutive quarterly decline. | OK | Keep. The dashboard's "-3% annualized" is derived from the q/q fall. |
| https://www.csls.ca/reports/csls2025-04.pdf | CSLS additional source for productivity/business investment trigger context. | PDF extraction. The paper says Canada's productivity slowdown is rooted in inadequate business investment, not only absence of policy effort. | OK | Keep. |

---

## Housing Supply

| URL | Dashboard claim checked | Evidence pulled | Status | Recommended action |
|---|---|---|---|---|
| https://www.pbo-dpb.ca/en/news-releases--communiques-de-presse/build-canada-homes-forecast-to-build-26000-units-pbo-maisons-canada-prevoit-de-construire-26-000-unites-selon-le-dpb | BCH 26,000 units. | Direct fetch. PBO says about 26,000 units over five years and a 2.1% increase in completions relative to baseline. | OK | Keep. |
| https://www.cmhc-schl.gc.ca/media-newsroom/news-releases/2026/housing-starts-december-2025 | 2025 starts source and Promise Delivery housing status source. | Direct fetch. CMHC title says housing starts were up 5.6% in 2025 from 2024. | OK | Keep. |
| https://www.cmhc-schl.gc.ca/media-newsroom/news-releases/2026/housing-starts-march-2026 | March 2026 trend / monthly SAAR and starts trigger. | Direct fetch. CMHC says six-month trend decreased to 248,378 units and monthly SAAR was 235,852. | OK | Keep. |
| https://www.pm.gc.ca/en/news/news-releases/2026/03/30/prime-minister-carney-secures-new-partnership-ontario-cut-taxes | Canada-Ontario housing partnership. | Direct fetch. PMO says the full 13% HST would be removed for new Ontario homes valued up to $1M, with up to $130,000 savings. | OK | Keep. |
| https://policyoptions.irpp.org/2026/01/canadian-real-estate-trap/ | Independent housing/productivity context. | Direct fetch loaded the Policy Options article "Repondre a la crise du logement tout en relancant l'economie." | OK | Keep. |
| https://www.canada.ca/en/housing-infrastructure-communities/news/2026/01/build-canada-homes-thousands-of-homes-in-the-pipeline.html | Build Canada Homes pipeline / construction-not-yet-underway trigger context. | Web open succeeded. Page title: "Build Canada Homes: Thousands of Homes in the Pipeline." | OK | Keep. |
| https://www.pbo-dpb.ca/en/publications/RP-2526-020-S--build-canada-homes-outlook-housing-programs-under-budget-2025--maisons-canada-perspectives-entourant-programmes-logement-dans-cadre-budget-2025 | Housing program outlook; 56% spending decline; trigger source. | Direct fetch. PBO says planned housing-program spending falls 56%, from $9.8B in 2025-26 to $4.3B in 2028-29, and BCH adds about 26,000 units. | OK | Keep. |
| https://www.cmhc-schl.gc.ca/media-newsroom/news-releases/2025/cmhc-releases-latest-housing-supply-gaps-report | Housing supply gap benchmark. | Direct fetch loaded the CMHC 2025 supply-gaps release. Exact 430K-480K snippet was not captured in this pass, but page role is correct. | OK | Keep. |
| https://www.chba.ca/2026/04/21/low-builder-confidence-illustrates-need-for-sustained-federal-action-plan-focused-on-homeownership-housing/ | Builder confidence sourceRef: single-family 20.9 and multi-family 13.4. | Direct fetch was inconsistent; search confirms the article and the 20.9 / 13.4 figures. Exact text not captured from the page. | editor-pull pending | Keep, but browser-pull exact CHBA sentence before treating as verbatim. |
| https://www.scotiabank.com/ca/en/about/economics/economics-publications/post.other-publications.housing.housing-news-flash.february-18--2026.html | Market-side housing source. | Direct fetch. Scotiabank title confirms "Canadian Home Sales (January 2026): Housing News Flash." | OK | Keep. |

---

## Ethics & Transparency

| URL | Dashboard claim checked | Evidence pulled | Status | Recommended action |
|---|---|---|---|---|
| https://www.theglobeandmail.com/politics/article-ethics-screen-carney-brookfield/ | Ethics filing / conflict screen scope. | Direct fetch. Globe says Carney must recuse from more than 100 entities and names Brookfield Asset Management. | OK | Keep. |
| https://www.cbc.ca/news/politics/mark-carney-financial-assets-1.7583443 | Financial assets / blind trust reporting. | Direct fetch. CBC says investments held before the blind trust were publicly disclosed by the Ethics Commissioner and names Brookfield and Stripe holdings. | OK | Keep. |
| https://democracywatch.ca/pm-carneys-ethics-screen-and-blind-trust-are-loophole-filled-unethical-smokescreens/ | Independent governance critique. | Direct fetch. Democracy Watch title says the ethics screen and blind trust are "loophole-filled" smokescreens. | OK | Keep. |
| https://www.ourcommons.ca/documentviewer/en/45-1/ETHI/report-5/page-96 | House ETHI review and committee governance source. | Direct fetch. ETHI report discusses the Conflict of Interest Act review and the PM conflict screen. | OK | Keep. |
| https://ciec-ccie.parl.gc.ca/en/ | Commissioner registry and reviews source. | Direct fetch. Site exposes Public Registry and rules/reviews navigation. No PM-specific review surfaced. | OK | Keep. |
| https://prciec-rpccie.parl.gc.ca/Lists/Declarations/Attachments/43657/Appendix%20Summary%20Statement%20-%20Annexe%20Declaration%20Sommaire.pdf | PM blind-trust summary statement. | PDF extraction. Appendix says divestment into a blind trust under section 27 and lists Brookfield-related asset categories. | OK | Keep. |
| https://prciec-rpccie.parl.gc.ca/Lists/Declarations/Attachments/43653/Annex%20A%20-%20Public%20Declaration%20of%20Agreed%20Measure.pdf | PM Annex A public declaration of agreed measure / screen categories. | PDF extraction. Annex A lists entities screened due to management/oversight roles, Brookfield portfolio-company lobbying records, and cautionary Brookfield-related entities. | OK | Keep. |
| https://transparencycanada.ca/news/canada-slides-to-lowest-ever-ranking-in-corruption-perception-index-le-canada-descend-au-plus-bas-niveau-de-son-histoire-en-matire-de-perception-de-la-corruption | International governance benchmark. | Direct fetch. Title says Canada slid to its lowest-ever ranking in the Corruption Perception Index. | OK | Keep. |
| https://ciec-ccie.parl.gc.ca/ | Trigger source for future Commissioner reviews/findings. | Direct fetch. The root site is live and routes to the Commissioner office. | OK | Keep. |

---

## Flagship Delivery

| URL | Dashboard claim checked | Evidence pulled | Status | Recommended action |
|---|---|---|---|---|
| https://policyoptions.irpp.org/2026/02/competitive-federalism/ | Federalism / delivery challenge source. | Direct fetch. Article title: "Mark Carney and the failure of co-operative federalism in Canada." | OK | Keep. |
| https://policyoptions.irpp.org/2026/03/carney-national-security-dms/ | DM shuffle / delivery-capacity challenge source. | Direct fetch. Article title: "Carney's deputy minister shuffle raises national security questions." | OK | Keep. |
| https://www.pbo-dpb.ca/en/publications/RP-2526-017-S--budget-2025-issues-parliamentarians--budget-2025-enjeux-parlementaires | PBO $94B investment gap and operating-balance caveat. | Direct fetch. PBO says its capital-investment definition is about $94B lower than Budget 2025 and the operating balance remains in deficit under PBO's view. | OK | Keep. |
| https://cdhowe.org/publication/budget-2025-and-the-worsening-public-service-executive-to-rank-and-file-ratio/ | Public-service ratio / capacity challenge source. | Direct fetch. Page title confirms the C.D. Howe source. | OK | Keep. |
| https://thehub.ca/2025/11/17/carneys-budget-has-a-94-billion-gap-in-investment-spending-and-a-shortfall-in-government-operating-balance-pbo/ | Secondary reporting of PBO $94B gap. | Direct fetch blocked, but search confirmed title and PBO framing. | OK | Keep. Exact quote not needed because PBO primary is already live. |

---

## Promise Delivery

| URL | Dashboard claim checked | Evidence pulled | Status | Recommended action |
|---|---|---|---|---|
| https://liberal.ca/wp-content/uploads/sites/292/2025/04/Canada-Strong.pdf | Original-platform promise source. | PDF extraction. Platform contains original commitments on red tape review, nation-building projects, defence/NATO, climate, housing, and affordability. | OK | Keep. |
| https://www.nato.int/en/news-and-events/articles/news/2026/03/26/nato-secretary-generals-annual-report-shows-significant-increase-in-defence-investment-from-europe-and-canada | NATO 2% delivery status source. | Direct fetch. NATO says all Allies, including Canada in the article framing, met or exceeded the 2% target. | OK | Keep. |
| https://www.cmhc-schl.gc.ca/media-newsroom/news-releases/2026/housing-starts-december-2025 | Housing starts status source. | Same as Housing Supply. CMHC says starts were up 5.6% in 2025. | OK | Keep. |
| https://angusreid.org/carney-one-year-approval-campaign-promises-liberals/ | External report-card context for promise delivery. | Direct fetch blocked. Search confirms title/source role, but exact article text was not captured. | editor-pull pending | Keep as context. Browser-pull exact findings before using them as a metric anchor. |
| https://thenarwhal.ca/mark-carney-climate-change-explainer/ | Climate rollback / abandoned-stalled promise context. | Direct fetch. Narwhal says Carney complicated climate progress, including cancelling the carbon tax and pausing/reworking climate rules. | OK | Keep. |
| https://www.pbo-dpb.ca/en/publications/NT-2627-002-S--pbo-assessment-spring-economic-update-fiscal-anchors-fiscal-sustainability--evaluation-dpb-mise-jour-economique-printemps-cibles-budgetaires-viabilite-financiere | Fiscal-anchor promise moved back in progress. | Same as Fiscal Health. PBO says SEU projections are on track to respect both fiscal anchors. | OK | Keep. |

---

## Executable cleanup queue

### 1. Carbon Pricing PBO citation + effective-cost wording

**Finding:** Evidence verified and incorporated in v5.87.

- PBO source: https://www.pbo-dpb.ca/en/publications/LEG-2324-019-S--eliminating-goods-services-tax-in-respect-carbon-pricing--elimination-taxe-produits-services-relativement-tarification-carbone
- PBO evidence: "$486 million in 2023-24, increasing to $1.015 billion in 2030-31."
- CCI source: https://climateinstitute.ca/news/fact-sheet-canada-industrial-carbon-pricing-systems/
- CCI evidence: "around $10 or less per tonne" against a $95/t carbon price.

**Change made:** `src/data/dimensions.json` now labels the metric "Industrial OBPS (effective cost on total emissions)", changes the value from `~$20/tonne` to `~$10/tonne or less`, and adds metric-level PBO `sourceRefs` plus a note that the displayed `$5.7B` is a rounded multi-year shorthand, not a direct PBO headline.

### 2. Retail Council URL pick

**Finding:** Current dashboard URL is correct.

- Current URL: https://www.retailcouncil.org/topics/food-grocery/truth-of-canadian-grocery-price-inflation/
- Evidence: page title is "The Truth about Canadian Grocery Inflation"; page states RCC monitors food-price conditions and gives industry context on suppliers, margins, and competition.

**Change made:** none. The longer `/topics/food-grocery/...` URL is live and more explicit than the shorter pattern flagged in May.

### 3. Climate Argus/BHRRC to post-MOU source swap

**Finding:** Evidence supports a swap, but the source choice is explicitly editor-owned in the handoff.

Current climate metric sourceRefs:
- Argus: https://www.argusmedia.com/en/news-and-insights/latest-market-news/2750001-canada-set-to-scrap-oil-and-gas-emissions-cap
- BHRRC: https://www.business-humanrights.org/en/latest-news/canada-federal-government-considers-scrapping-emissions-cap-on-the-oil-and-gas-sector-as-part-of-climate-competitiveness-strategy/

Issue: both are pre-MOU or pre-final-decision framing. They support "considering/scrapping likely" more than "post-MOU confirmed."

Stronger candidate, primary:
- PMO Implementation Agreement for the Canada-Alberta MOU: https://www.pm.gc.ca/en/news/backgrounders/2026/05/15/implementation-agreement-canada-alberta-memorandum-understanding
- Evidence: Canada and Alberta confirm Canada has honored its commitment "not to introduce the Oil and Gas Emissions Cap."

Stronger candidate, secondary/challenge:
- IISD statement, "MOU with Alberta puts Canada's commitment to net zero emissions by 2050 firmly out of reach": https://www.iisd.org/media/mou-alberta-puts-canadas-commitment-net-zero-emissions-2050-firmly-out-reach
- Evidence: IISD characterizes the MOU as weakening industrial carbon markets and clean electricity regulations.

**Change made:** none. Recommended editor packet: replace Argus/BHRRC with the PMO implementation agreement as the status source; optionally retain one independent source for critical interpretation if the source band permits.

### 4. IISD-2030 refresh

**Finding:** No same-claim replacement found that is both newer and directly equivalent to the current IISD 2030-target article.

Current URL:
- https://www.iisd.org/articles/insight/critical-next-step-canadas-2030-climate-target

It remains a direct source for the 2030-target test, but it is January 2024 and therefore pre-Carney. Newer IISD materials found in this pass are better for post-MOU policy drift than for the 2030-target claim itself.

Candidate for a separate post-MOU source, not a one-for-one replacement:
- https://www.iisd.org/media/mou-alberta-puts-canadas-commitment-net-zero-emissions-2050-firmly-out-reach

**Change made:** none. Editor call needed: keep the old IISD 2030-target source for target math, and consider adding/replacing a different Climate source with the post-MOU IISD statement if the editor wants a current IISD challenge source.

---

## Could not fully verify

These did not fail URL health, but exact source text still needs a manual browser pull if the editor wants verbatim support:

1. OECD Economic Surveys: Canada 2025 - direct fetch blocked; page/source role confirmed.
2. CHBA Q1 2026 HMI - source and numbers confirmed via search, exact sentence not captured.
3. Signal49 business-investment outlook - title/source role confirmed, exact report text not captured.
4. Angus Reid Carney one-year report card - title/source role confirmed, exact findings not captured.

---

## Roll-up

### Changes incorporated in v5.87

1. Carbon Pricing effective-cost metric refreshed to CCI's current around-$10-or-less wording.
2. Carbon Pricing PBO carbon-GST metric now has a metric-level sourceRef and a clearer annual-trajectory note.
3. This Round 2 verification doc added.
4. `meta.json` and `changelog.json` bumped for the user-visible source-note/metric wording update.

### Editor decisions queued

1. Major Projects source-note cleanup: Fraser carries "mostly pre-existing"; Angus carries public reaction.
2. Building Canada Act trigger URL upgrade to a direct project-of-national-interest explainer.
3. Climate cap source swap: PMO implementation agreement as primary status source; independent post-MOU source optional.
4. IISD source strategy: keep old 2030-target source, or add newer IISD post-MOU statement as a separate policy-drift source.
5. Browser-pull exact text for the four pending sources if they become grade-packet evidence.

## Authority and scope footer

This pass is source-to-claim verification only. It prepares editor packets where the evidence could support a source swap or wording cleanup. It does not move grades, reinterpret thresholds, alter score math, or change the 11-graded-plus-1-tracker model.
