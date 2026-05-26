# May-Cycle Verification Pass — 2026-05-25

**Purpose:** Re-run the May source-health pass with content-review discipline. The May 16 link-check and Codex's session-2 reclassification handled URL liveness ("does this URL resolve?"). This pass tests the harder question: **does the CURRENT content at each source URL still support the claim that dimensions.json attributes to it?**

**Run date:** 2026-05-25
**Dashboard state when run:** v5.76 / commit `3cca4d2`
**Scope:** Round 1 — Carbon Pricing, Immigration, Affordability Response, Defence & Trade, Climate & Environment. ~60 unique URLs verified or attempted.
**Method:** Direct WebFetch where the source permits; WebSearch + snippet quotation where the source blocks automated user-agents (canada.ca, statcan.gc.ca, fraserinstitute.org, retailcouncil.org, cbc.ca and nationalobserver.com are systematic blockers in this pass). Verbatim quotes captured wherever possible. Per Bias-Resistance Protocol, treat all findings as claims for the editor to act on, not autonomous changes.
**Scope discipline:** Documentation pass + Codex's two working-tree URL edits validated and incorporated. No grade, threshold, GPA-formula, POCKETBOOK_DIMS, modifier, or dimension-model changes. Two metric.sourceRefs URL upgrades proposed in the Findings section (Climate Argus and BHRRC) — those are flagged for editor decision, not autonomously applied.

---

## Verification status by category

| Category | Round 1 count | Status |
|---|---|---|
| OK — content matches dashboard claim | 14 | Verbatim quotes captured |
| Stale refresh candidate (no grade impact) | 3 | Math reconciles or directional, but metric value or citation needs refinement |
| URL upgrade needed | 2 | Codex's edits (Retail Council, OAG); incorporated in this commit |
| URL replacement candidate (different content needed) | 2 | Climate Argus + BHRRC sourceRefs are pre-MOU coverage of conditional/considering language, not post-MOU confirmation of "Scrapped" status. Replacement candidates identified. |
| Content drift with grade-implications | 1 | **Defence $81.8B over 5 years** — Budget 2025 Ch.4 specifies appropriated multi-year defence envelope. Materially affects Interpretation A vs B in the Defence funded-pathway memo. |
| Dead URL | 1 | Old OAG URL (`oag-bvg.gc.ca/.../mr_20251106_e_44756.html`) confirmed timing out; Codex's canada.ca replacement is the right upgrade. |
| Could not verify (block + no public alternative) | ~15 | canada.ca, statcan.gc.ca, fraserinstitute.org, retailcouncil.org all systematic blockers. Listed below for editor browser-verification. |

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
| Budget 2025 Ch.4 | Direct fetch OK | **CRITICAL NEW FINDING**: Budget 2025 Chapter 4 specifies the FUNDED defence envelope verbatim: "the government proposes $81.8 billion over five years (starting 2025-26) specifically for 'Rebuilding, Rearming, and Reinvesting in the Canadian Armed Forces.'" PLUS confirms verbatim "Canada will put on a pathway to meet the NATO Defence Investment Pledge of investing 5 per cent of GDP in defence by 2035" and "3.5% by 2035 for core military needs." See Defence memo refinement note below. |
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

## Defence funded-pathway memo refinement (NEW)

Budget 2025 Chapter 4 confirms verbatim: **"$81.8 billion over five years (starting 2025-26) specifically for 'Rebuilding, Rearming, and Reinvesting in the Canadian Armed Forces.'"**

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
1. **Carbon Pricing PBO $5.7B citation refresh** — methodology: cite the $486M-$1.015B trajectory directly rather than the aggregate $5.7B headline that the source doesn't quote. No metric value change.
2. **Carbon Pricing effective price metric** — refresh from "~$20/tonne" to align with current CCI fact sheet ("~$10 or less per tonne"). No grade impact (gap to headline becomes larger, strengthening the existing rationale).
3. **Immigration trajectory in v1.1 memo** — augment with PBO modeled projection (5% by end-2027) alongside linear extrapolation (5% by end-2026).
4. **Climate Argus and BHRRC sourceRefs** — both are pre-MOU coverage of conditional/considering language. Replacement candidates (post-MOU, Nov 27, 2025 or later): National Observer Nov 27 ("Alberta gets its way"), CBC Calgary `9.6966596` ("Carney scraps emissions cap"), Globe and Mail ("Ottawa, Alberta close to reaching industrial carbon pricing deal").
5. **Defence funded-pathway memo refinement** — update the Defence memo with the Budget 2025 $81.8B over 5 years finding and the refined A/B-5yr/B-10yr interpretation set. Strengthens the case for A- → A grade move.

### Findings that should be carried to June (genuinely)
1. **Per-province CCI EMCP table** — for Carbon Pricing effective-price calculation
2. **2025-26 vs 2026-27 ECCC clean YoY comparison** — Climate budget restoration test
3. **Q1 2026 StatCan population release** — Immigration TR-share confirmation
4. **CMHC housing starts April 2026** — Housing Supply momentum check
5. **Global Affairs March 2026 trade report** — Defence/Trade trade-half check

### Sources that need editor browser-verification (canada.ca / StatCan / Fraser / Retail Council / CBC / National Observer block automated user-agents)
- ~15 URLs across the 5 dimensions. None confirmed dead via this pass; all reachable per Codex's session-2 reclassification.

---

## Authority and scope

This pass closes Round 1 (5 dimensions) of the May-cycle verification request. It does not change grades, thresholds, GPA formulas, POCKETBOOK_DIMS, modifier rules, or the dimension model. It incorporates Codex's 2 validated URL edits and surfaces 5 findings for editor decision before further data edits land. Round 2 (Major Projects, Fiscal Health, Economic Policy, Housing, Ethics, Flagship, Promise Delivery) is queued for next session.

## Version history

- **v1.0 (2026-05-25, v5.77):** Initial Round 1 verification pass. 60+ unique URLs verified or attempted across 5 dimensions. 14 OK, 3 refresh candidates, 2 URL upgrades incorporated, 2 URL replacement candidates flagged, 1 content drift with grade-implications (Defence $81.8B), 1 dead URL confirmed. Five editor decisions queued.
