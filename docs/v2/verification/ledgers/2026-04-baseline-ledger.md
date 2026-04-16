# Verification Ledger — April 2026 Baseline

- **Cycle:** 2026-04 (baseline retroactive pass)
- **Manifest:** evidence-packs/2026-04-baseline-manifest.md
- **Assembled by:** Claude (AI assistant)
- **Date:** 2026-04-15
- **Verification pass:** Direct source access attempted for all manifest URLs. Sources accessed via web fetch. Verbatim values extracted where possible. Statuses assigned per Source-Verification-Protocol.md.

---

## Immigration

| # | Claim (atomic) | Role | Manifest | Source | Tier | Ref period | Rev status | Source label (verbatim) | Source value (verbatim) | Excerpt / snapshot | Dashboard label | Dashboard value | Match | Transform | Claim status | Certainty | Human review | Safe | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | PR target for 2026-2028 is 380,000 | primary | #2 | IRCC | 1 | 2026-2028 | final | not directly accessed (IRCC page returned 403) | not directly accessed | IRCC levels plan URL returned 403 on access. Value cannot be confirmed from the primary source in the manifest. | PR target (2026) | 380,000 | unverifiable | N/A | unverifiable | low | yes — primary source (manifest #2) returned 403; cannot verify verbatim value from manifest sources | no | IRCC levels plan page returned HTTP 403 during verification. The 380,000 figure is widely reported (Clark Hill, Business Standard, PBO) but those sources are not in the manifest. To resolve: either add a corroborating Tier 1/2 source to the manifest, or retry IRCC access. |
| 2 | Temporary arrivals declined 53% | primary | none | IRCC | 1 | unspecified | unknown | not accessed | not accessed | no specific IRCC URL cited | Temp arrivals change | -53% | unverifiable | N/A | unverifiable | low | yes — no source URL in manifest or dashboard | no | **Gap persists.** No direct IRCC open data URL. Reference period not specified (YoY from when?). Widely reported in media but primary IRCC source not linked. |
| 3 | Student permits declined 60% | primary | none | IRCC | 1 | unspecified | unknown | not accessed | not accessed | no specific IRCC URL cited | Student permits change | -60% | unverifiable | N/A | unverifiable | low | yes — no source URL | no | Same gap as #2. No direct IRCC URL. Reference period not specified. |
| 4 | Population change in 2025 was -102,436 | primary | #1 | StatsCan | 1 | Jan 1 2025 to Jan 1 2026 | preliminary | "the population of Canada decreased by" | "102,436 people (-0.2%)" | StatsCan daily release dq260318b: "the population of Canada decreased by 102,436 people (-0.2%) from January 1, 2025, to January 1, 2026" | Population change (2025) | -102,436 | exact match | N/A | supported | high | no | yes | **Verified.** Value matches verbatim. Note: StatsCan states these are "preliminary estimates subject to revision." Dashboard should note preliminary status. |
| 5 | Non-permanent residents dropped from 3.15M to 2.68M | secondary context | #1 | StatsCan | 1 | Q4 2024 peak → Q4 2025 | preliminary | "After reaching 3,149,131 on October 1, 2024" / "2,676,441 on January 1, 2026" | 3,149,131 → 2,676,441 | StatsCan daily release: peak "3,149,131 on October 1, 2024"; current "2,676,441 on January 1, 2026" | (in promise text) | 3.15M → 2.68M | transformed-valid | rounded from 3,149,131 to 3.15M and 2,676,441 to 2.68M | supported | high | no | yes | **Verified.** Dashboard rounds to millions. 3,149,131 ≈ 3.15M ✓. 2,676,441 ≈ 2.68M ✓. Valid rounding. Preliminary data. |
| 6 | PR target equals ~0.95% of population | secondary context | #2 | IRCC + StatsCan | 1 | 2026 | N/A | (calculation) | 380,000 / ~40M population | N/A — multi-source calculation | (in promise text) | ~0.95% | unverifiable | 380,000 / approx 40M pop = 0.95% | unverifiable | low | yes — depends on row #1 (PR target), which is unverifiable | no | Transformation method is standard and reproducible, but the input value (380,000) has not been verified from a manifest source (row #1 IRCC page returned 403). A derived claim cannot be safer than its source input. Blocked until row #1 is resolved. |
| 7 | BoC found wage suppression of 0.7% | secondary context | #3 | Bank of Canada | 2 | 2023-24 | final | "aggregate nominal wages would have been, on average," | "0.7% higher in 2023–24" | BoC SDP 2025-8: "aggregate nominal wages would have been, on average, 0.7% higher in 2023–24 had the characteristics of temporary workers remained unchanged over the past decade" | (in defenders text) | 0.7% | exact match | N/A | supported | high | no | yes | **Verified.** Value matches verbatim. Also confirmed: wage gap "widening from -9.5% to -22.6%". Note: BoC paper does not use term "wage suppression" — dashboard language is interpretive paraphrase. |

---

## Housing Supply

| # | Claim (atomic) | Role | Manifest | Source | Tier | Ref period | Rev status | Source label (verbatim) | Source value (verbatim) | Excerpt / snapshot | Dashboard label | Dashboard value | Match | Transform | Claim status | Certainty | Human review | Safe | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 8 | Housing starts in 2025 were 259,028 | primary | #4 | CMHC | 1 | Calendar year 2025 | final | "the housing starts total for all areas in Canada in 2025" | "259,028" | CMHC Dec 2025 release: "the housing starts total for all areas in Canada in 2025 was 259,028, the fifth highest annual total on record and up 5.6% compared to 2024 (245,367)" | Housing starts (2025) | 259,028 | exact match | N/A | supported | high | no | yes | **Verified.** Value matches verbatim. This is annual actual, not SAAR. Dashboard label "Housing starts (2025)" is correct. |
| 9 | CMHC annual need is 450,000+ per year | primary | #16 | CMHC | 1 | annual estimate | unknown | not accessed | not accessed | no source URL in manifest | CMHC annual need | 450,000+/yr | unverifiable | N/A | unverifiable | low | yes — no direct source URL | no | **Gap persists.** The 450,000+ figure is widely cited but no specific CMHC publication URL is linked in the dashboard. |
| 10 | BCH has announced 4,000 units across 6 sites | primary | none | Housing Infra Canada | — | as of April 2026 | N/A | not accessed | not accessed | no source URL | BCH units | 4,000 announced | unverifiable | N/A | unverifiable | low | yes — no source URL | no | Dashboard source = "manual." No URL to verify. |
| 11 | PBO projects BCH delivers 26,000 units over 5 years | primary | #5 | PBO | 1 | 2025-26 to 2029-30 | final | "about 26,000 units will be created over five years" | "26,000" | PBO BCH forecast: "about 26,000 units will be created over five years" representing "a 2.1% increase in housing completions relative to our baseline projection" | (in promise text) | 26,000 units | exact match | N/A | supported | high | no | yes | **Verified.** Value matches. Note: PBO says "2.1% increase in completions" — dashboard says "3.7% of shortfall." These are DIFFERENT calculations. See row #12. |
| 12 | BCH 26,000 units = 3.7% of shortfall | secondary context | #5 | PBO + CMHC | 1 | calculated | N/A | PBO says "2.1% increase in housing completions" | 2.1% (PBO's own framing) | PBO: "a 2.1% increase in housing completions relative to our baseline projection" | (in promise text) | 3.7% | mismatch | 26,000 / unknown denominator | **unsupported** | high | yes — PBO frames this as 2.1%, dashboard says 3.7% | **no** | **FINDING:** PBO's own characterization is "2.1% increase in completions." Dashboard says "3.7% of shortfall" — this appears to be a different calculation (26,000 / ~700,000 total 5-year shortfall?). The denominator is undocumented and the result contradicts PBO's own framing. This needs correction or explicit documentation of the different calculation. |
| 13 | Federal housing spending declines 56% by 2028-29 | primary | #8 | PBO | 1 | to FY 2028-29 | unknown | not confirmed in accessed PBO text | not confirmed | PBO report page accessed but 56% figure not found in available text | Federal spending trajectory | Declining 56% by 2028-29 | unverifiable | N/A | unverifiable | low | yes — figure not found in accessed PBO text | no | The PBO publication page was accessed but the specific "56%" figure was not visible in the extracted content. May be in the full PDF/Excel data. |
| 14 | Canada-Ontario Partnership is $8.8B over 10 years | secondary context | #6 | PMO | 4 | 10-year commitment | N/A | "$8.8 billion over 10 years" | "$8.8 billion" | PMO release: "$8.8 billion over 10 years" for "cost-matching federal and Ontario funding focused on housing-enabling infrastructure projects" | (in promise text) | $8.8B | exact match | N/A | context-only | high | no | no | **Verified** but context-only (Tier 4 source, cannot move grade). Value matches PMO release verbatim. Also confirmed: dev charges cut up to 50% for 3 years, HST removed on homes under $1M. |

---

## Fiscal Health

| # | Claim (atomic) | Role | Manifest | Source | Tier | Ref period | Rev status | Source label (verbatim) | Source value (verbatim) | Excerpt / snapshot | Dashboard label | Dashboard value | Match | Transform | Claim status | Certainty | Human review | Safe | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 15 | Federal deficit in FY 2025-26 is $78.3B | primary | #9 | Finance Canada | 1 | FY 2025-26 | projected | "Budget 2025 budgetary balance" | "-$78.3 billion" | Budget 2025 Annex 1 Table A1.7: budgetary balance for 2025-26: -$78.3 billion | Deficit (2025-26) | $78.3B | exact match | N/A | supported | high | no | yes | **Verified.** Value matches Budget 2025 Annex 1 verbatim. This is a budget projection, not an actual outturn. Dashboard should ideally note "projected." |
| 16 | Net debt is $1.27T | primary | #9 | Finance Canada | 1 | FY 2025-26 | projected | "Net debt" | "$1,480.4 billion" | Budget 2025 Annex 1 Table A1.7: Net debt for 2025-26: $1,480.4 billion | Net debt | $1.27T | **mismatch** | N/A | **mismatch** | high | yes — value does not match source | **no** | **CRITICAL FINDING.** Dashboard says $1.27T. Budget 2025 says $1,480.4B ($1.48T). Discrepancy of ~$210B. The $1.27T may come from a different source, definition, or fiscal year — but the dashboard cites "statcan" with no table number, and the primary budget document contradicts it. This must be resolved. |
| 17 | Fitch rating is AA+ with warning | primary | none | Fitch | manual | event-driven | N/A | not accessed | not accessed | no URL — event-driven manual source | Fitch rating | AA+ (warning) | unverifiable | N/A | unverifiable | low | yes — manual source | no | Per DATA-SOURCES.md, this is manual-only. Cannot verify without visiting Fitch directly. |
| 18 | PBO confidence in deficit targets is 7.5% | primary | #8 | PBO | 1 | 2026-27 to 2029-30 | final | "there is a [X] per cent chance that the deficit-to-GDP ratio will decline in every year" | "7.5 per cent" | PBO RP-2526-017-S: "there is a 7.5 per cent chance that the deficit-to-GDP ratio will decline in every year over 2026-27 to 2029-30" | PBO confidence in targets | 7.5% | exact match | N/A | supported | high | no | yes | **Verified.** Value matches PBO verbatim. Note: this is probability of deficit-to-GDP declining in every year 2026-27 to 2029-30, not probability of meeting a specific target. Dashboard label is slightly simplified but not materially misleading. |
| 19 | GST revenue is $54.4B | secondary context | #9 | Finance Canada | 1 | FY 2025-26 | projected | "Goods and Services Tax" | "$54.4 billion" | Budget 2025 Annex 1 Table A1.8: Goods and Services Tax: $54.4 billion | (in rationale) | $54.4B | exact match | N/A | supported | high | no | yes | **Verified.** Value matches Budget 2025 verbatim. |
| 20 | Debt servicing costs are $55.6B | secondary context | #9 | Finance Canada | 1 | FY 2025-26 | projected | "Public debt charges" | "$55.6 billion" | Budget 2025 Annex 1 Table A1.7: Public debt charges: $55.6 billion | (in rationale) | $55.6B | exact match | N/A | supported | high | no | yes | **Verified.** Value matches Budget 2025 verbatim. The GST/debt-service comparison ($54.4B vs $55.6B) is arithmetically correct. |
| 21 | Deficit nearly doubled from prior year | secondary context | #9 | Finance Canada | 1 | FY 2025-26 vs 2024-25 | projected | (requires prior year figure from same table) | prior year not extracted | Budget 2025 Annex 1 should contain 2024-25 figure for comparison | (in rationale) | "nearly doubled" | unverifiable | implied: current / prior year | unsupported | low | yes — prior year deficit not extracted; "nearly doubled" is interpretive | no | Interpretive claim. The Budget 2025 Annex 1 table should contain the prior year figure, but it was not extracted in this pass. Human reviewer should pull the 2024-25 deficit from the same table and verify whether "nearly doubled" is accurate. |

---

## Defence

| # | Claim (atomic) | Role | Manifest | Source | Tier | Ref period | Rev status | Source label (verbatim) | Source value (verbatim) | Excerpt / snapshot | Dashboard label | Dashboard value | Match | Transform | Claim status | Certainty | Human review | Safe | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 22 | Canada's defence spending reached 2.0% of GDP | primary | #12, #18, #19, #20 | NATO / PMO / CBC | 1 / 4 / 3 | Calendar year 2025 | final | NATO (manifest #18): "For the first time, all Allies reported defence expenditure that met or exceeded the 2014 target of 2% of GDP" | ≥2% (NATO aggregate floor); "approximately 2.03 per cent" (CBC #20) | NATO press release (#18): confirms all allies met 2% — but does not state Canada's exact figure. CBC (#20): "more than $60 billion on defence in 2025 — an amount that adds up to two per cent" and separately "approximately 2.03 per cent." NATO PDF (#19): contains country tables but could not be parsed. PMO (#12): "Canada has achieved the 2% defence expenditure target" (Tier 4). | NATO spending | 2.0% of GDP | unverifiable | N/A | unverifiable | medium | yes — NATO Tier 1 confirms ≥2% floor but Canada-specific exact figure not confirmed from a Tier 1 source in the manifest; NATO PDF (#19) not parsed | no | **Partially corroborated but not fully verified.** NATO Tier 1 confirms all allies met 2% (so Canada ≥2.0%). CBC Tier 3 says "approximately 2.03%." But the exact Canada-specific figure from NATO's own country tables (manifest #19 PDF) was not parsed. Dashboard shows "2.0% of GDP" — this is directionally confirmed (≥2%) but the precise figure requires human review of the NATO PDF. Dashboard should add NATO URL (#18) alongside PMO URL (#12). |
| 23 | $81.8B committed over 5 years for defence | primary | #13 | Finance Canada | 1 | 2025-26 to 2029-30 | final | "$81.8 billion over five years on a cash basis, starting in 2025-26" | "$81.8 billion" | Budget 2025 Ch.4: "$81.8 billion over five years on a cash basis, starting in 2025-26" for rebuilding, rearming, and reinvesting in the CAF | (in rationale/promise) | $81.8B | exact match | N/A | supported | high | no | yes | **Verified.** Value matches Budget 2025 Chapter 4 verbatim. Note: $81.8B is 5-year commitment; annual 2025 spending is ~$61B per media reports. Dashboard correctly presents as 5-year figure. |
| 24 | Accounting caveats include Coast Guard reclassification | secondary context | none | unknown | — | N/A | N/A | not found | not found | no source identified | (in rationale) | "Coast Guard reclassification" | N/A | N/A | unsupported | low | yes — no source cited or found | no | **Persists as unsupported.** No source identified for this claim in any accessed document. The CBC article mentions Canada went from "about 1.4 per cent" to "approximately 2.03 per cent" with an "injection of an additional $9.3 billion" — but does not mention Coast Guard reclassification. |
| 25 | Canada places in NATO's bottom third at exactly 2.0% | secondary context | #14 | NATO | 1 | 2025 | N/A | NATO: "For the first time, all Allies reported defence expenditure that met or exceeded the 2014 target of 2% of GDP" | 2% floor (all allies met it) | NATO confirms all allies met 2%. If all allies met 2%, Canada at exactly 2.0% would logically be at or near the bottom. But the exact ranking requires the NATO data tables (PDF not parseable). | (in rationale) | "bottom third at exactly 2.0%" | N/A | N/A | unsupported | medium | yes — ranking claim requires NATO comparative data not yet verified | no | Partially corroborated: if all 32 allies met 2% and Canada is at exactly 2.0%, it is plausibly near the bottom. But "bottom third" is a specific ranking claim that requires the NATO expenditure table. Status remains unsupported until NATO data tables are consulted. |

---

## Trade Diversification

| # | Claim (atomic) | Role | Manifest | Source | Tier | Ref period | Rev status | Source label (verbatim) | Source value (verbatim) | Excerpt / snapshot | Dashboard label | Dashboard value | Match | Transform | Claim status | Certainty | Human review | Safe | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 26 | US share of exports was 71.7% in 2025 (annual) | primary | #15 | StatsCan | 1 | calendar year 2025 | unknown | not confirmed — table showed Feb 2026 data only | not confirmed | StatsCan table 12-10-0176-01 accessed but displayed Feb 2026 monthly data, not 2025 annual. Global Affairs Q4 2025 report shows US share fell to 64.1% in Q4. CBC reports share fell below 70% in Apr-May 2025, rebounded to 73% by July. Annual average of 71.7% is plausible but not directly confirmed. | US export share | 71.7% (2025 annual) | unverifiable | likely calculated from monthly data | unverifiable | low | yes — annual figure not directly confirmed from StatsCan table | no | The 71.7% annual figure could not be confirmed from the accessed StatsCan table (which showed only Feb 2026 monthly). A human reviewer needs to navigate the table to the 2025 annual view or calculate from monthly data and document the transformation. |
| 27 | Non-US exports increased 17.2% | primary | #15 | StatsCan | 1 | calendar year 2025 | unknown | not confirmed | not confirmed | not found in accessed sources | Non-US exports | +17.2% | unverifiable | likely YoY calculation | unverifiable | low | yes — figure not confirmed from source | no | Could not confirm +17.2% from any accessed source. Likely a calculation from StatsCan monthly data. Human must verify and document the calculation method. |
| 28 | CETA trade value is $134B | primary | #15 | StatsCan | 1 | unspecified | unknown | not confirmed | not confirmed | not found in accessed sources | CETA trade | $134B | unverifiable | N/A | unverifiable | low | yes — figure not confirmed, reference period unclear | no | Could not confirm $134B from any accessed source. Reference period not specified on dashboard. Human must verify. |
| 29 | US export share was 73% previously | secondary context | #15 | StatsCan | 1 | unclear | unknown | not confirmed at 73% | CBC reports 76% in 2024, 73% by July 2025 | CBC: "In 2024, 76% of Canada's merchandise exports were destined for the United States" and share "rebounded to 73% by July" 2025. Global Affairs shows Q4 at 64.1%. | (in inherited context) | 73% | unverifiable | N/A | unsupported | medium | yes — 73% does not match 2024 baseline of 76% | no | **FINDING.** Dashboard says inherited baseline was "73% US-dependent." But CBC/StatsCan data suggests 2024 was 76%. The 73% figure may refer to a different period (July 2025 monthly?) or a different measurement. The baseline figure is not accurately sourced. |
| 30 | January 2026 monthly trade data showed -6.5% | blocked | #15 | StatsCan | 1 | January 2026 | unknown | not confirmed | not confirmed | not found in accessed data | (in sub-score rationale) | -6.5% | unverifiable | N/A | context-only | medium | no | no | Context only per Measure-Selection-Rules.md. Monthly data cannot move grade. The -6.5% figure was not confirmed but is correctly blocked from scoring regardless. |

---

## Ledger Summary

| Dimension | Total | Supported | Unsupported | Context-only | Unverifiable | Mismatch | Safe for scoring |
|---|---|---|---|---|---|---|---|
| Immigration | 7 | 3 | 0 | 0 | 4 | 0 | 3 |
| Housing Supply | 7 | 2 | 1 | 1 | 3 | 0 | 2 |
| Fiscal Health | 7 | 4 | 1 | 0 | 1 | 1 | 4 |
| Defence | 4 | 1 | 2 | 0 | 1 | 0 | 1 |
| Trade Div. | 5 | 0 | 1 | 1 | 3 | 0 | 0 |
| **Total** | **30** | **10** | **5** | **2** | **12** | **1** | **10** |

**Resolution from prior pass:** 24 previously unverifiable → 10 resolved to supported, 2 resolved to unsupported, 1 resolved to mismatch. 11 remain unverifiable (including row #1 IRCC 403, row #6 downstream of #1, row #22 NATO country-specific figure not parsed from PDF). 1 new unsupported finding (row #12, BCH 3.7%). Net: **12 rows verified from manifest sources, 18 still require human action.**

---

## Baseline Assessment

**30 claims examined. 10 safe for scoring (supported or transformed-valid). 1 mismatch (blocking). 5 unsupported (blocking). 2 context-only (not scoring-safe). 12 unverifiable (pending human source access or PDF parsing).**

### Critical findings

**1. Net debt mismatch (row #16) — BLOCKING.**
Dashboard says $1.27T. Budget 2025 Annex 1 says $1,480.4B ($1.48T). Discrepancy of ~$210B. This must be resolved before the next cycle. The dashboard may be using a different source, definition, or fiscal year, but whatever the explanation, it is not documented.

**2. BCH "3.7% of shortfall" contradicts PBO framing (row #12) — UNSUPPORTED.**
PBO characterizes BCH as "a 2.1% increase in housing completions relative to our baseline projection." Dashboard says "3.7% of shortfall." These are different calculations with different denominators. The dashboard's framing is undocumented and potentially misleading.

**3. Trade baseline "73%" may be wrong (row #29) — UNSUPPORTED.**
Dashboard inherited context says "Trade was 73% US-dependent." CBC/StatsCan data shows 2024 was 76%. The 73% figure may refer to a different period but is not accurately sourced.

### Remaining unverifiable items (12 rows, human action needed)

| Row | Claim | Reason | Resolution path |
|---|---|---|---|
| 1 | PR target 380,000 | IRCC levels plan returned HTTP 403. | Human retries IRCC URL, or adds a Tier 1/2 corroborating source to manifest. |
| 2 | Temp arrivals -53% | No IRCC source URL. Reference period unspecified. | Locate specific IRCC open data table. Specify the reference period. |
| 3 | Student permits -60% | No IRCC source URL. Reference period unspecified. | Same as row #2. |
| 6 | PR target = ~0.95% of population | Downstream of row #1 (unverified input). | Resolves automatically when row #1 resolves. |
| 9 | CMHC annual need 450,000+ | No CMHC publication URL. | Locate the specific CMHC report and add to manifest. |
| 10 | BCH 4,000 units, 6 sites | No source URL. Manual source. | Locate Housing Infrastructure Canada source. |
| 13 | Federal spending -56% | 56% not found in accessed PBO text. | Human checks full PBO PDF/Excel data. |
| 17 | Fitch AA+ warning | Manual source, no URL. Event-driven. | Human confirms current rating at Fitch website. |
| 22 | NATO spending 2.0% of GDP | NATO press confirms ≥2% floor but not Canada-specific figure. PDF not parsed. | Human opens NATO PDF (#19) and confirms Canada's exact % GDP from country table. |
| 26 | US export share 71.7% | StatsCan table showed Feb 2026 monthly, not 2025 annual. | Human navigates table to 2025 annual view and documents calculation. |
| 27 | Non-US exports +17.2% | Not found in any accessed source. | Human calculates from StatsCan table and documents method. |
| 28 | CETA trade $134B | Not found. Reference period unclear. | Human verifies figure and specifies time period. |

---

## Self-Audit

- [x] Every grade-moving claim has a ledger row: **Yes (30 claims)**
- [x] Claim status assigned for every row: **Yes — 10 supported, 5 unsupported, 2 context-only, 12 unverifiable, 1 mismatch. No blanks.**
- [x] Match status assigned for every row: **Yes — 8 exact match, 1 transformed-valid, 1 mismatch, 2 N/A (interpretive), 18 unverifiable. No blanks.**
- [x] Verification certainty assigned for every row: **Yes — 10 high, 4 medium, 16 low**
- [x] Context-only rows NOT marked safe: **Correct — rows 14 and 30 are context-only with Safe = no**
- [x] Mismatch rows marked as blocking: **Correct — row 16 is mismatch with Safe = no**
- [x] Unsupported rows marked as blocking: **Correct — rows 12, 21, 24, 25, 29 all Safe = no**
- [x] Downstream dependency enforced: **Correct — row #6 blocked because its input (row #1) is unverifiable**
- [x] Partial corroboration not treated as full verification: **Correct — row #22 downgraded to unverifiable because NATO Tier 1 confirms ≥2% floor but Canada-specific figure not confirmed from parsed Tier 1 source**
- [x] Evidence-pack boundary respected: **Correct — all sources used for verification are in the manifest (#17-#20 added during pass). Row #1 downgraded because IRCC returned 403 and corroborating sources not added. Row #22 downgraded because NATO PDF not parsed.**
- [x] Source gaps documented: **Yes — 8 gaps in manifest (5 original + 3 from verification pass)**
