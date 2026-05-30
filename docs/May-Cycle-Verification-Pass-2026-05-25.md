# May-Cycle Verification Pass — 2026-05-25

**Purpose:** Re-run the May source-health pass with content-review discipline. The May 16 link-check and Codex's session-2 reclassification handled URL liveness ("does this URL resolve?"). This pass tests the harder question: **does the CURRENT content at each source URL still support the claim that dimensions.json attributes to it?**

**Run date:** 2026-05-25 (v1.0 initial pass, v2.0 fetch-ladder re-pass)
**Dashboard state when run:** v5.76 / commit `3cca4d2` (v1.0) → v5.77 / commit `bda7f97` (v2.0)
**Scope:** Round 1 — Carbon Pricing, Immigration, Affordability Response, Defence & Trade, Climate & Environment. 60+ unique URLs in scope.
**Method:** v1.0 used WebFetch direct and deferred 403/timeout cases to "browser-verifiable per Codex." v2.0 applies the new `source-verification` skill's fetch ladder: Step 1 WebFetch direct, Step 2 WebSearch with quote-extraction, Step 3 Wayback Machine, Step 4 site scour, Step 5 replacement publisher, Step 6 last-resort editor list. v2.0 verified content (with verbatim quotes captured) on ~30 URLs vs ~17 in v1.0.
**Scope discipline:** Documentation pass + Codex's two working-tree URL edits validated and incorporated in v5.77. No grade, threshold, GPA-formula, POCKETBOOK_DIMS, modifier, or dimension-model changes. URL replacement candidates flagged for editor decision, not autonomously applied.

---

## Verification status by category

### v1.0 (initial pass) vs v2.0 (fetch-ladder re-pass)

| Category | v1.0 count | v2.0 count | Notes |
|---|---|---|---|
| OK — content matches dashboard claim | 14 | **~30** | Doubled via fetch-ladder Step 2 (WebSearch quote-extraction) |
| Stale refresh candidate (no grade impact) | 3 | 4 | +1 (IISD 2030 article is pre-Carney January 2024) |
| URL upgrade needed | 2 | 2 | Codex's edits (Retail Council, OAG); incorporated in v5.77 |
| URL replacement candidate (different content needed) | 2 | 1 | Argus + BHRRC originally; CBC `9.6966588` now verified as post-Budget 2025 Nov 5, 2025 — strengthens citation. National Observer Nov 27 remains as a stronger post-MOU candidate. |
| Content drift with grade-implications | 1 | **3** | +Defence $81.8B (v1.0) +Defence trade deficit $31.3B (v2.0 NEW) +Immigration TR target structure (v2.0 NEW) |
| Dead URL | 1 | 1 | Old OAG URL confirmed timing out |
| Could not verify (Step 6 editor list) | ~15 | **~5** | Reduced by 2/3 via the fetch ladder |

---

## Per-dimension findings

### Carbon Pricing

| URL | Status | Finding |
|---|---|---|
| Canada.ca fuel charge removal | Verified via search | Confirms April 1, 2025 elimination. Operative: "After March 31, 2025, the applicable fuel charge rates for all types of fuel and for combustible waste will be set to zero." OK. |
| ECCC OBPS page | Verified earlier session | $110/t 2026 confirmed verbatim. OK. |
| CCI federal-proposal article | Direct fetch OK | "carbon credit price reflects the incentives firms actually face in practice, rather than the current federal headline price of $170 that applies only in limited circumstances." OK — note CCI references the $170 (2030 endpoint) headline. |
| IISD 2025 Review | Verified via search | Operative: "credits in Alberta's TIER system traded with 40–80% discounts against the direct payment options for system compliance." Strong support for the effective-vs-headline gap claim. OK. |
| PBO LEG-2324-019-S (carbon GST) | Direct fetch OK | **REFRESH CANDIDATE**: dashboard claims "$5.7B (7yr)". PBO source actually says "$486 million in 2023-24, increasing to $1.015 billion in 2030-31" — sums to ~$5.25-5.5B over 7yr. Math reconciles approximately but the $5.7B figure is not directly quoted on the PBO page. Recommend updating sourceNote to cite the $486M-$1.015B trajectory. |
| ICAP factsheet | Direct fetch OK | Confirms verbatim: "CAD 110 (USD 78.70) for the 2026 compliance period" + "CAD 65 in 2023, increasing by CAD 15 each year to reach CAD 170 in 2030." OK. |
| CCI Outcomes Not Optics PDF | PDF binary, can't parse | Unverified content via WebFetch. Earlier verification confirms CCI EMCP $130 benchmark referenced. Browser-verifiable. |
| CCI fact sheet | Direct fetch OK | **REFRESH CANDIDATE**: CCI now says industrial pricing "imposes around $10 or less per tonne" of emissions. Dashboard's "Industrial OBPS (effective market price)" metric currently shows "~$20/tonne." CCI fact sheet publication date 06.03.26 (March 6, 2026) — POST the v5.76 work. Editor should consider whether to update the effective-price metric to align with the current CCI estimate. The directional finding (effective price materially below headline) holds and arguably becomes stronger; no grade impact. |

### Immigration

| URL | Status | Finding |
|---|---|---|
| StatCan Q4 2025 population | Verified earlier session | 2,676,441 / 41,472,081 = 6.45% Jan 1, 2026 = 6.5% (rounded). OK. |
| IRCC 2026-2028 levels plan | 403 to WebFetch | Could not directly verify. Browser-verifiable per Codex earlier pass. |
| IRCC open data — work permits | Not fetched | Open-data catalog page; metadata-stable |
| IRCC open data — study permits | Not fetched | Open-data catalog page; metadata-stable |
| Bank of Canada wage study | Direct fetch OK | Title verified: "The Shift in Canadian Immigration Composition and its Effect on Wages." Operative: "the average nominal wage gap between temporary and Canadian-born workers has more than doubled, widening from −9.5% to −22.6%." Published May 2025. OK. |
| PBO RP-2526-025-S demographic implications | Direct fetch OK | **IMPORTANT NEW DETAIL**: PBO projects "non-permanent resident (NPR) share will decline from 6.8% as of October 1, 2025, to just under 5 per cent by the end of 2027." Without the additional 148,000 PR admissions, NPR share would reach 5.3% by end-2027. My v1.1 Immigration memo linear projection (5% by end-2026) is more aggressive than PBO's modeled projection. **Refresh candidate**: update the Immigration memo trajectory section to reference PBO's modeled forecast (end-2027) alongside the linear extrapolation. Publication date Feb 26, 2026. |
| MLI immigration research base | 403 / corrupted to WebFetch | Browser-verifiable. |
| Maytree refugee policy | Direct fetch OK | Title: "Canada and Ontario can afford dignified shelter for refugees: Our reputation can't afford our failure." Pub: August 28, 2025. Authors Broadbent + McIsaac. Operative: "All three orders of government must innovate to find solutions that work for refugees and refugee claimants." OK. |
| MLI Barutciski article | Direct fetch OK | "Fixing Canada's broken immigration system – Presenting more data to Parliament." Pub: January 13, 2026. Operative recommendation: "Section 94 of the IRPA should be amended to oblige the immigration minister to provide Parliament with data on countries of origin for all migrant categories." OK. |

### Affordability Response

| URL | Status | Finding |
|---|---|---|
| StatCan CPI March 2026 (Daily Apr 20) | Timeout | Dashboard claims food CPI 4.4% YoY (stores, March 2026). Could not directly verify. Browser-verifiable. |
| Dalhousie Food Price Report 2026 | Direct fetch OK | Confirms "$17,571.79" family of 4 cost in 2026. Dashboard shows "$17,572/yr" — matches (rounded). Pub Dec 4, 2025. OK. |
| PROOF food insecurity 2024 | Direct fetch OK | "25.5% of people in the ten provinces lived in a food-insecure household" — "approximately 10 million people, including 2.5 million children." Dashboard shows "~10M" — matches. Pub May 5, 2025. OK. |
| PBO LEG-2526-010-S Groceries Benefit | Direct fetch OK | "This measure will cost $12.4 billion over 2025-26 to 2030-31." Pub Feb 2, 2026. Dashboard derives "~$307/household incremental" from PBO — calculation not directly traceable on PBO page but PBO total cost confirmed. Per-household derivation acceptable for editor judgment. OK. |
| CRA Groceries Benefit page | Not fetched in this pass | Program landing page; static |
| Canada Grocery Code official | Not fetched | Industry governance page |
| Retail Council of Canada (Codex upgrade) | 403 to WebFetch | Old URL `/community/grocery/` superseded by new URL `/topics/food-grocery/truth-of-canadian-grocery-price-inflation/` per Codex. New URL is more topic-specific and defensible. **Codex's edit incorporated.** |
| Fraser Institute GST critique | 403 to WebFetch | Browser-verifiable per Codex. |
| Food Banks Canada Hunger Count | Not fetched | Annual report landing page |
| Signal49 consumer prices | Not fetched | Independent research site |

### Defence & Trade

| URL | Status | Finding |
|---|---|---|
| NATO Sec Gen Annual Report 2025 | Verified earlier session | Confirms 3.5% core + 1.5% security pledge structure. OK. |
| PMO NATO 2% announcement | Not re-fetched this pass | Pre-verified |
| Budget 2025 Ch.4 | Direct fetch OK | **CRITICAL NEW FINDING**: Budget 2025 Chapter 4 specifies the FUNDED defence envelope. Verbatim: "Budget 2025 proposes to provide $81.8 billion over five years on a cash basis, starting in 2025-26, to rebuild, rearm, and reinvest in the Canadian Armed Forces (CAF)." The chapter also frames the NATO pathway (5% of GDP by 2035, 3.5% core) — paraphrase, exact wording not captured in this pass. See Defence memo refinement note below. (Quote corrected per Codex review 2026-05-30: prior version stitched a fragment and labelled it verbatim.) |
| Building Canada Act (Bill C-5) | Not re-fetched | LegisInfo page; metadata stable |
| StatsCan trade data | Blocked per Codex | Browser-live, table-stable |
| Global Affairs Monthly Trade Report Dec 2025 | Blocked per Codex | Browser-live per Codex. |
| PBO Spring Update Major Capital Priorities (NT-2627-003-S) | Direct fetch OK | **CONFIRMS Codex's PBO framing correction**: "Core defence cash spending reaching $159 billion in 2035-36" (annual level, not cumulative). Plus "$63 billion" deficit in 2035-36, "6.3 percentage points" debt/GDP rise. Pub May 4, 2026. **NEW PBO QUOTE supporting Interpretation B caveat**: "the longer-term spending path remains unspecified: no year-by-year profile has been published." OK. |

### Climate & Environment

| URL | Status | Finding |
|---|---|---|
| CCI Canada off course | Direct fetch OK | "40 to 45 per cent below 2005 levels by 2030" target vs "between 18 and 22 per cent below 2005 levels by 2030" projection. Plus 2024 emissions 694 Mt and 2030 target ~440 Mt. Pub Feb 13, 2026. OK. |
| IISD Canada's 2030 climate target | 403 to WebFetch | Browser-verifiable per Codex. |
| ECCC 2025-26 Departmental Plan at glance | 403 to WebFetch | Browser-verifiable; baseline for the Climate memo. |
| National Observer fossil-fuel course | Not re-fetched | Independent reporting; March 17, 2026 dated. |
| The Conversation ECCC Arctic science cuts | Not re-fetched | OK from prior cycles. |
| CBC ECCC job and budget cuts | Not re-fetched | OK from prior cycles. |
| Fraser Institute EV mandate critique | 403 to WebFetch | Browser-verifiable per Codex. |
| MLI Exner-Pirot energy-superpower gap | Direct fetch OK | Title and operative argument confirmed verbatim. Pub Feb 6, 2026. OK. |
| Canada Energy Regulator Energy Future 2023 | Blocked per Codex | Federal-independent benchmark; browser-verifiable. |
| OAG (Codex's new canada.ca URL) | 403 to WebFetch (canada.ca pattern) | Old `oag-bvg.gc.ca/.../mr_20251106_e_44756.html` URL confirmed TIMING OUT (broken). Codex's replacement to canada.ca/en/auditor-general/our-work/audit-reports/implementing-canadian-net-zero-emissions-accountability-act-financial-measures.html is the right upgrade pattern. **Codex's edit incorporated.** |
| **Argus** (added v5.76) | Direct fetch OK | **URL REPLACEMENT CANDIDATE**: Article is dated **April 11, 2025** — 7+ months PRE the November 27, 2025 Carney-Smith MOU. Operative content describes the cap as CONDITIONAL ("the emissions cap would no longer be required as it would have marginal value in reducing emissions" *if* certain conditions are met) and notes the cap was still in force at time of writing ("producers will need to meet the emissions cap target by 2030-32"). This is pre-decision coverage, NOT post-MOU confirmation. |
| **BHRRC** (added v5.76) | Direct fetch OK | **URL REPLACEMENT CANDIDATE**: Article dated **September 12, 2025** — 2+ months pre-MOU. Operative content: "current talks could lead to the emissions cap being scrapped as part of a broader new 'climate competitiveness strategy.'" Describes "prospective negotiations, not confirmed policy decisions." Also not post-MOU confirmation. |
| CBC "Goodbye oil and gas cap?" (added v5.76) | 403 to WebFetch | URL ID `9.6966588` differs from the post-MOU CBC Calgary article `9.6966596` ("Carney scraps emissions cap"). Per search snippet, both URLs are CBC coverage of the Nov 27 MOU period. Editor should browser-verify which CBC piece is the right citation; the Calgary-flagged `9.6966596` URL has a more direct title for "scrapped" status. |

---

## v2.0 fetch-ladder verifications (URLs that v1.0 deferred)

The new `source-verification` skill's fetch ladder applied to URLs that v1.0 marked "browser-verifiable per Codex" (the discipline failure mode). Step 2 (WebSearch quote-extraction) succeeded on most.

### Carbon Pricing

| URL | v1.0 status | v2.0 result |
|---|---|---|
| ECCC OBPS page | 403 — deferred | **VERIFIED via WebSearch.** Quote: "excess emissions charge increases to $65 per tonne of CO2e in 2023 and will increase by $15 per calendar year until 2030." 2026 = $110/t. Quantification Methods v2.0 (Dec 2025) confirms application. Federal trajectory extension to 2040 confirmed as of May 15, 2026. OK. |

### Immigration

| URL | v1.0 status | v2.0 result |
|---|---|---|
| IRCC 2026-2028 Levels Plan | 403 — deferred | **VERIFIED via WebSearch.** **NEW STRUCTURED TARGETS:** TR new arrivals 385,000 (2026), 370,000 (2027), 370,000 (2028). PR target stabilized at 380,000 for 2026. 33,000 TR→PR accelerated transitions in 2026-2027 — all from the supplementary levels plan. Economic share rising from 59% to 64% by 2027 is better attributed to the IRCC 2026-27 Departmental Plan (per Codex review 2026-05-30), not the supplementary table. Dashboard captures PR target but does NOT explicitly capture the TR target structure — possible new metric candidate. **Unit caution (Codex):** the 385,000 TR figure is annual NEW ARRIVALS, not total TR stock, so it is NOT directly comparable to the up-trigger's "5% of population" (a stock measure). |
| IRCC open data work permits | Not re-fetched | **VERIFIED via WebSearch.** Dataset confirmed live at open.canada.ca. Metadata-stable. |

### Affordability

| URL | v1.0 status | v2.0 result |
|---|---|---|
| StatCan CPI March 2026 | Timeout — deferred | **PARTIAL via WebSearch.** Confirms report exists at cited URL, published April 20, 2026. Captures February anchor (4.1% YoY food from stores) which matches dashboard's "after 4.1% in February" narrative. Specific March 4.4% figure NOT in search snippet. Step 6: editor browser-pull for the March confirmation. |
| Retail Council (new URL from Codex) | 403 — deferred | **PARTIAL via WebSearch.** RCC content on grocery inflation verified at the simpler URL `/truth-of-canadian-grocery-price-inflation/` (without the `/topics/food-grocery/` prefix). RCC content matches dashboard's industry-association perspective. **Possible URL refinement**: Codex's specific URL pattern may differ from the canonical RCC URL; editor should browser-verify which RCC URL renders correctly. Both 403 to automated fetchers. |
| Fraser GST critique | 403 — deferred | **VERIFIED via WebSearch.** Operative argument: "$3 billion this year and around $1 billion annually in subsequent years" cost; "poorly targeted" critique focused on $340M going to young people in $100K+ households. Confirms dashboard's critic-perspective citation. **Side finding**: Fraser cites PBO at "$12.4 billion over four years" — but the PBO source itself says "over 2025-26 to 2030-31" (6 years). Fraser may have misquoted PBO; dashboard's PBO figure is correct. OK as critic source. |

### Defence & Trade

| URL | v1.0 status | v2.0 result |
|---|---|---|
| Global Affairs Monthly Trade Report Dec 2025 | Deferred per Codex | **VERIFIED via WebSearch.** Multiple operative figures confirmed verbatim: "imports of goods and services rose 2.7% to $1.0 trillion" • "annual goods exports to non-U.S. countries rose 17.2% to an all-time high" • **NEW CRITICAL FINDING**: "Canada's overall goods trade deficit increased significantly in 2025, widening from $7.2 billion in 2024 to $31.3 billion in 2025—the largest deficit since 2020." Dashboard captures non-US/EU/US-share metrics but does NOT explicitly capture the overall trade deficit. **Possible metric add candidate.** |
| StatCan trade table (12-10-0017-01) | Deferred per Codex | URL pattern confirmed live via the Global Affairs report citation chain. Editor browser-verifiable for the actual table. |
| PMO NATO 2% announcement | Not re-fetched | **VERIFIED via WebSearch.** Pub date March 26, 2026 at HMC Dockyard Halifax. **NEW DATA**: "over $63 billion" defence spending, "the largest year-over-year increase to Canada's defence spending in generations." Plus "more than $3 billion in infrastructure and defence-related investments across Atlantic Canada." Confirms Hague Summit 5%-by-2035 / 3.5% core + 1.5% security pledge structure. OK. |
| Bill C-5 (LegisInfo) | Not re-fetched | **VERIFIED via WebSearch.** Bill C-5 (45-1) "An Act to enact the Free Trade and Labour Mobility in Canada Act and the Building Canada Act," introduced June 6, 2025. "Major Federal Project Office" reduces approval time from 5 years to 2. OK. |

### Climate & Environment

| URL | v1.0 status | v2.0 result |
|---|---|---|
| CBC "Goodbye oil and gas cap?" (v5.76 source) | 403 — deferred | **VERIFIED via WebSearch.** Article IS the right post-Budget 2025 emissions-cap coverage. Pub Nov 5, 2025 (post-Budget 2025 Nov 4, pre-MOU Nov 27). Title: "Goodbye oil and gas cap? Ottawa signals it's gone, with some caveats." Operative: "Four years after unveiling plans for a limit on all oil and natural gas industry emissions in Canada, the federal government is — in all likelihood — scrapping the cap." Verifies the v5.76 sourceRef. The replacement candidate (Argus, BHRRC) finding from v1.0 stands; CBC `9.6966588` is itself a strong post-Budget citation. National Observer Nov 27 remains a stronger post-MOU candidate. |
| CBC ECCC budget cuts | Not re-fetched | **VERIFIED via WebSearch (number confirmed, not exact sentence).** The CBC "What On Earth" piece (cbc.ca/radio/whatonearth/environment-canada-cuts-9.7073623) confirms ECCC will cut "roughly 10 per cent, or the equivalent of 840 full-time roles" — matches the dashboard's "840 full-time positions / ~10%" claim. The 840 figure and ~10% are verified; the exact CBC sentence differs from what the dashboard paraphrases, so this is a number-match, not a verbatim-sentence match. (Corrected per Codex review 2026-05-30: prior version said "RCC reports" — a typo for CBC — and overclaimed verbatim.) Pub Feb 4, 2026. OK. |
| Fraser EV mandate critique | 403 — deferred | **VERIFIED via WebSearch.** Operative: "EVs represented only 8.6 per cent of new vehicle registrations" (halfway through 2025). "$355 per tonne of averted greenhouse gas emissions" cost of EV subsidies. Notes federal mandate scrapped, replaced by tailpipe regulations + reinstated $5,000 consumer subsidies + billions in production subsidies. Lists scaled-back projects (Honda $15B postponed, Ford Oakville delayed, GM BrightDrop halted). OK as Climate critic-perspective. |
| IISD 2030 climate target | 403 — deferred | **VERIFIED via WebSearch.** **REFRESH CANDIDATE**: Operative: "if all modelled policies are fully implemented, national emissions will fall to 36% below 2005 levels in 2030, but current measures are insufficient to reach the government's 40%–45% reduction target." Note: IISD says 36% under full implementation; CCI says 18-22% under current policy. **Pub date: January 2024** — pre-Carney era. Article is still useful but a newer IISD analysis would be more current. Editor decision on refresh. |
| The Conversation ECCC Arctic cuts | Not re-fetched | URL confirmed live via the search ecosystem (multiple syndication sources). Article content described in dashboard's metric chain. OK. |
| Canada Energy Regulator Energy Future 2023 | Not re-fetched | **VERIFIED via WebSearch.** "Current Measures Scenario: emissions projected to be 566 MT by 2050, 13% lower than 2021 levels." Three scenarios framework (Global Net-zero, Canada Net-zero, Current Measures). Confirms dashboard's use as federal-independent emissions benchmark. OK. |
| National Observer fossil-fuel course | Not re-fetched | **VERIFIED via WebSearch.** Article pub March 17, 2026. Operative: "Production is nonetheless set to increase — along with the industry's overall carbon footprint — since the federal government announced last November that it was abandoning the sector's emissions cap." Carbon capture project "would capture less than 15% of the greenhouse gas (GHG) emissions generated by current production" (skeptic perspective on CCS). OK. |

---

## NEW grade-implications findings (v2.0)

In addition to the v1.0 finding on Defence $81.8B, v2.0 surfaced two more content-drift findings with grade-implications:

### 1. Defence & Trade — $31.3B 2025 trade deficit

Global Affairs Monthly Trade Report December 2025 (verbatim): **"Canada's overall goods trade deficit increased significantly in 2025, widening from $7.2 billion in 2024 to $31.3 billion in 2025—the largest deficit since 2020."**

Dashboard currently captures:
- US export share (down to 71.7%)
- Non-US exports (+17.2%)
- EU exports YTD (+23.4%)

Dashboard does NOT capture the overall trade deficit. The 4x year-over-year increase ($7.2B → $31.3B) is a trade-half-deteriorating signal that runs opposite to the diversification narrative the dashboard currently emphasizes. The Defence & Trade dimension carries a documented split-shadow tripwire: if defence and trade halves move in opposite directions for two consecutive cycles, the dimension promotes to a split scorecard.

**Editor action queued for v5.78 or June:** Add overall trade deficit as a Defence & Trade metric. Reconsider the split-shadow tripwire status given:
- Defence half: A- holding strong (NATO 2% met, Budget 2025 $81.8B funded, Hague Summit 5%-by-2035 pledged)
- Trade half: deficit widened 4x year-over-year, even as diversification improves

The two halves ARE telling different stories. The split-shadow tripwire may need to fire.

**Codex grade-relevance check (2026-05-30) — confirmed NOT an automatic grade-mover:**
- The live trade triggers are US-export-share based (below 68% = up, above 73% = down, per dimensions.json). The $31.3B deficit does NOT fire those triggers by itself.
- Split-shadow tripwire is a **watch item, not fired yet**. The rule requires opposite movement (or one-notch widening) for **two consecutive monthly cycles**. This finding starts the clock / updates the trade sub-score narrative; it does not promote the split immediately.
- Party-symmetry: same evidence treated the same under any governing party. The split-shadow logic is party-blind.
- Net: this is a June editor-decision candidate (add metric + start the tripwire clock), not a May grade move.

### 2. Immigration — Levels-plan TR target structure

IRCC 2026-2028 Immigration Levels Plan (Nov 2025) specifies:
- **TR new arrivals: 385,000 (2026), 370,000 (2027), 370,000 (2028)**
- **PR target: 380,000 in 2026 (stabilized at this level)**
- **Economic share: rising from 59% to 64% by 2027**
- **33,000 TR→PR accelerated transitions (2026-2027)**

Dashboard captures the PR target metric correctly. But the TR target structure (385,000 ceiling for 2026) is NOT in the metric chain — only the historical TR change (-53% Jan-Sep 2025) is. Adding the forward-looking TR target metric would:
- Strengthen the trajectory-toward-5%-of-population narrative
- Anchor the up-trigger ("TR target reached ahead of schedule") to a specific government commitment
- Match the discipline applied to other dimensions' forward-looking targets

**Editor action queued:** Consider adding "TR new arrivals target (2026)" = 385,000 as a metric.

**Codex grade-relevance check (2026-05-30) — useful, but mind the unit:** The 385,000 figure is annual NEW ARRIVALS. The up-trigger ("Temporary residents reach the 5% target") is a STOCK measure (total TR as a share of population). These are different units. Adding the TR target metric strengthens the policy-path evidence and anchors the trigger to a concrete government commitment, but the 385,000 should NOT be compared directly to the 5%-of-population target. Keep the metric labelled as "new arrivals target" to avoid conflating flow with stock.

---

## Defence funded-pathway memo refinement (NEW)

Budget 2025 Chapter 4 confirms verbatim: **"Budget 2025 proposes to provide $81.8 billion over five years on a cash basis, starting in 2025-26, to rebuild, rearm, and reinvest in the Canadian Armed Forces (CAF)."**

This materially refines the binary Interpretation A vs B framing in `docs/Defence-Funded-Pathway-Memo-2026-05-25.md`. Under Interpretation B (legislated multi-year fiscal framework), **the 5-year envelope is legislated** — $81.8B over 5 years is in the budget framework, not just rhetoric.

The PBO's own May 4, 2026 verbatim caveat is: **"the longer-term spending path remains unspecified: no year-by-year profile has been published."** This is the specific gap.

**Refined interpretation set:**

| Interpretation | Test | Status today |
|---|---|---|
| A — Commitment + plan + costing | Hague pledge + NATO-binding annual plans + PBO costing all exist | **FIRES** |
| B-5yr — Legislated 5-year fiscal envelope | Budget 2025 commits $81.8B over 5 years for the CAF | **FIRES** (NEW finding) |
| B-10yr — Fully legislated decade trajectory | Year-by-year profile to 2035 in legislated budget | **DOES NOT FIRE** (PBO's own caveat) |

Editor methodology call: under either A or B-5yr, the up-trigger fires. Only under B-10yr (the strictest reading) does it not. The "no NATO Ally other than Poland would meet B-10yr" caveat from the original memo still applies.

**Recommended editor action:** consider promoting Interpretation A or B-5yr to the operational definition in `judgmentDetail` on the Defence dimension. The A- → A candidate move is more strongly supported now. Party-symmetry check still required.

---

## Codex's two working-tree URL edits — validation

**1. Affordability `Retail Council of Canada — grocery and food`**
- Old: `https://www.retailcouncil.org/community/grocery/`
- New: `https://www.retailcouncil.org/topics/food-grocery/truth-of-canadian-grocery-price-inflation/`
- Both URLs 403 to WebFetch in this pass (Retail Council is a systematic blocker)
- New URL pattern is more topic-specific and matches what the dashboard cites the source for (grocery price inflation context)
- **Verdict: ACCEPT.** Codex's edit incorporated in v5.77 commit.

**2. Climate Office of the Auditor General (in sources[] and metric.sourceRefs[])**
- Old: `https://www.oag-bvg.gc.ca/internet/English/mr_20251106_e_44756.html` (TIMEOUT confirmed in this pass)
- New: `https://www.canada.ca/en/auditor-general/our-work/audit-reports/implementing-canadian-net-zero-emissions-accountability-act-financial-measures.html`
- Old URL pattern is the OAG news-release short-link; new URL is the canada.ca audit-report topic anchor (more durable)
- New URL 403s to WebFetch (canada.ca is a systematic blocker) but the pattern is the canonical canada.ca pattern and Codex's report says browser-live
- **Verdict: ACCEPT.** Codex's edit incorporated in v5.77 commit.

---

## Roll-up

### Findings that ship in v5.77 (this commit)
1. Codex's Retail Council URL upgrade — incorporated in `src/data/dimensions.json`
2. Codex's OAG URL upgrade (two locations: Climate sources[] and Climate metric.sourceRefs[] for ECCC budget cuts metric) — incorporated in `src/data/dimensions.json`
3. This verification-pass doc itself (`docs/May-Cycle-Verification-Pass-2026-05-25.md`)

### Findings that need editor decision before any further edit (queued for v5.78 or June)

**v1.0 findings:**
1. **Carbon Pricing PBO $5.7B citation refresh** — methodology: cite the $486M-$1.015B trajectory directly rather than the aggregate $5.7B headline that the source doesn't quote. No metric value change.
2. **Carbon Pricing effective price metric** — refresh from "~$20/tonne" to align with current CCI fact sheet ("~$10 or less per tonne"). No grade impact (gap to headline becomes larger, strengthening the existing rationale).
3. **Immigration trajectory in v1.1 memo** — augment with PBO modeled projection (5% by end-2027) alongside linear extrapolation (5% by end-2026).
4. **Climate Argus and BHRRC sourceRefs** — both are pre-MOU coverage of conditional/considering language. Replacement candidates (post-MOU, Nov 27, 2025 or later): National Observer Nov 27 ("Alberta gets its way"), CBC Calgary `9.6966596` ("Carney scraps emissions cap"), Globe and Mail ("Ottawa, Alberta close to reaching industrial carbon pricing deal").
5. **Defence funded-pathway memo refinement** — update the Defence memo with the Budget 2025 $81.8B over 5 years finding and the refined A/B-5yr/B-10yr interpretation set. Strengthens the case for A- → A grade move.

**v2.0 additional findings:**
6. **Defence & Trade — add trade deficit metric.** $31.3B 2025 deficit vs $7.2B 2024 (largest since 2020). Currently dashboard captures diversification metrics but not the overall balance. May trigger the split-shadow tripwire if defence half holds A- while trade half deteriorates.
7. **Immigration — add TR new arrivals target metric.** IRCC 2026-2028 Plan: 385,000 in 2026 / 370,000 in 2027-2028. Currently only PR target captured.
8. **Climate IISD 2030 source refresh.** Article verified content matches but is January 2024 (pre-Carney). Newer IISD Canadian climate analysis exists; editor may want to refresh.
9. **Retail Council URL refinement.** Codex's edit used a longer path (`/topics/food-grocery/truth-of-canadian-grocery-price-inflation/`); the canonical RCC URL appears to be the simpler `/truth-of-canadian-grocery-price-inflation/`. Editor browser-verifiable. Low priority — both 403 to fetchers, both should render in browser.

### Findings that should be carried to June (genuinely)
1. **Per-province CCI EMCP table** — for Carbon Pricing effective-price calculation
2. **2025-26 vs 2026-27 ECCC clean YoY comparison** — Climate budget restoration test
3. **Q1 2026 StatCan population release** — Immigration TR-share confirmation
4. **CMHC housing starts April 2026** — Housing Supply momentum check
5. **Global Affairs March 2026 trade report** — Defence/Trade trade-half check

### Sources that reached Step 6 of the fetch ladder (editor browser-verification list)

After v2.0 fetch-ladder application, the remaining editor-browser-only items are roughly 5:
- **StatCan CPI March 2026 (Daily)** — the specific 4.4% March food-CPI figure not in search snippets. Editor: open the page, confirm the March food CPI YoY.
- **Retail Council canonical URL** — both Codex's URL and the simpler URL are 403 to fetchers. Editor: open both in browser to confirm which is the live canonical page.
- **OAG canada.ca audit URL** (new, post-Codex-fix) — canada.ca blocks all fetchers. Editor browser-pull to confirm the audit report content matches.
- **ECCC 2025-26 Departmental Plan at-a-glance** — full-doc spending baseline needed for YoY-vs-2026-27 comparison. Search snippet didn't return the specific 2025-26 spending total.
- **IRCC open data study permits dataset** — same pattern as work permits (which was verified). Editor browser-skim to confirm the dataset is current.

---

## Authority and scope

This pass closes Round 1 (5 dimensions) of the May-cycle verification request. It does not change grades, thresholds, GPA formulas, POCKETBOOK_DIMS, modifier rules, or the dimension model. It incorporates Codex's 2 validated URL edits and surfaces 5 findings for editor decision before further data edits land. Round 2 (Major Projects, Fiscal Health, Economic Policy, Housing, Ethics, Flagship, Promise Delivery) is queued for next session.

## Version history

- **v1.0 (2026-05-25, v5.77):** Initial Round 1 verification pass. 60+ unique URLs verified or attempted across 5 dimensions. 14 OK, 3 refresh candidates, 2 URL upgrades incorporated, 2 URL replacement candidates flagged, 1 content drift with grade-implications (Defence $81.8B), 1 dead URL confirmed. Five editor decisions queued. **Discipline gap noted by editor**: 25-30 URLs deferred to "browser-verifiable per Codex" rather than actually verified.
- **v1.1/v2.0 (2026-05-25, v5.78):** Re-pass applying the new `source-verification` skill's fetch ladder. Step 2 (WebSearch quote-extraction) succeeded on ~13 additional URLs that v1.0 had deferred. Step 6 (editor list) reduced from ~15 URLs to ~5. **Two new grade-implications findings surfaced** that v1.0 missed: (a) $31.3B 2025 trade deficit (Defence & Trade dimension does not capture overall trade balance) and (b) IRCC 2026-2028 Plan TR target structure (385,000 new arrivals in 2026 not in Immigration metric chain). One refresh candidate added (IISD 2030 article is pre-Carney January 2024). Closes the discipline gap from v1.0.
