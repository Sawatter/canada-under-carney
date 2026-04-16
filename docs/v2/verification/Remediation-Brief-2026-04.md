# Remediation Brief — April 2026 Baseline Verification

- **Purpose:** List every blocking or high-risk dashboard issue surfaced by the baseline verification pass. Recommend remediation order before the next live cycle.
- **Status:** Actionable. All items drawn from the frozen baseline ledger and manifest.
- **Last updated:** 2026-04-15
- **Source of truth:** ledgers/2026-04-baseline-ledger.md, evidence-packs/2026-04-baseline-manifest.md

---

## Summary

The baseline verification pass examined 30 claims across 5 pilot dimensions. It found:
- **1 value that does not match its source** (net debt)
- **2 claims that misrepresent their source's framing** (BCH shortfall %, trade baseline)
- **3 source-chain gaps** where grade-moving claims have no primary source URL
- **12 unverifiable claims** that need human source access to resolve

**Bottom line:** 10 of 30 claims are currently safe for scoring. The remaining 20 need fixes or human verification before the next cycle can be trusted.

---

## 1. Metric / Value Fixes

These are factual errors or mismatches between the dashboard and the cited source. **Mandatory before next scoring cycle.**

| # | Issue | Ledger row | Dimension | What's wrong | What the source says | Action |
|---|---|---|---|---|---|---|
| **M1** | **Net debt $1.27T** | #16 | Fiscal Health | Dashboard shows $1.27T. Budget 2025 Annex 1 Table A1.7 shows $1,480.4B ($1.48T). Discrepancy of ~$210B. | "$1,480.4 billion" (Budget 2025 Annex 1) | Either correct the value to $1.48T, or identify and document the actual source for $1.27T (different definition? different fiscal year?). If a different source is used, add it to the manifest with full citation. **This is the only confirmed mismatch in the dashboard.** |

---

## 2. Claim-Language Fixes

These are claims where the dashboard language does not match or misrepresents the source's own framing. **Mandatory before next scoring cycle.**

| # | Issue | Ledger row | Dimension | What's wrong | What the source says | Action |
|---|---|---|---|---|---|---|
| **C1** | **BCH "3.7% of shortfall"** | #12 | Housing Supply | Dashboard promise text says PBO projects BCH delivers "3.7% of shortfall." PBO's own framing is different. | PBO: "about 26,000 units" = "a 2.1% increase in housing completions relative to our baseline projection" | Either (a) change dashboard text to use PBO's own "2.1% increase in completions" framing, or (b) keep "3.7%" but document the calculation explicitly (numerator, denominator, source for denominator) and label it as a dashboard calculation, not a PBO finding. |
| **C2** | **Trade baseline "73%"** | #29 | Trade Diversification | Dashboard inherited context says "Trade was 73% US-dependent." Available data suggests 2024 was 76%. | CBC/StatsCan: "In 2024, 76% of Canada's merchandise exports were destined for the United States." 73% appears to be a mid-2025 monthly figure (July). | Either (a) correct to "76% US-dependent (2024)" with source, or (b) if 73% is intentionally from a different period, add the specific reference period and source. |
| **C3** | **"Deficit nearly doubled"** | #21 | Fiscal Health | Rationale text says deficit "nearly doubled from the prior year" but does not state the prior year figure. | Budget 2025 Annex 1 contains the prior year figure (not extracted in this pass). | Add the prior year deficit figure from Budget 2025 Annex 1. Verify that "nearly doubled" is arithmetically accurate. If it is, keep the language and add the prior year figure. If not, revise. |
| **C4** | **"Coast Guard reclassification"** | #24 | Defence | Rationale text mentions "accounting caveats (Coast Guard reclassification)" with no source cited. | No source found in any accessed document. | Either (a) find and cite the source for this claim, or (b) remove it from the rationale if no source can be identified. An unsourced accounting claim in the highest-graded dimension weakens credibility. |
| **C5** | **"Bottom third at exactly 2.0%"** | #25 | Defence | Rationale text says Canada "placing in NATO's bottom third at exactly 2.0%." This is an interpretive ranking claim requiring NATO comparative data. | NATO confirms all allies met 2% for first time. Canada's exact ranking requires the NATO country expenditure tables (PDF not parsed). | Either (a) verify from the NATO PDF that Canada is in the bottom third and cite the specific table, or (b) soften the language to "at exactly 2.0%, among the lowest of allies that met the target" if the ranking cannot be confirmed precisely. |

---

## 3. Source-Chain Fixes

These are cases where grade-moving claims have no primary source URL, making them unverifiable. **Mandatory before next scoring cycle for primary metrics; recommended for secondary claims.**

| # | Issue | Ledger rows | Dimension | What's missing | Action |
|---|---|---|---|---|---|
| **S1** | **IRCC temp arrivals and student permits** | #2, #3 | Immigration | Dashboard says -53% and -60% but cites no specific IRCC open data URL. Reference periods are not specified (YoY from when?). | Add specific IRCC open data URLs (manifest has entries for monthly CSVs: work permits, study permits). Specify the reference period for each figure (e.g., "YoY, Q4 2024 to Q4 2025"). |
| **S2** | **CMHC annual need** | #9 | Housing Supply | Dashboard says "450,000+/yr" as the benchmark for housing supply adequacy but cites no CMHC publication URL. | Locate the specific CMHC report (likely CMHC's "Housing Supply Report" or "Canada's Housing Supply Shortages" estimate) and add the URL, publication date, and vintage to the manifest. |
| **S3** | **BCH 4,000 units** | #10 | Housing Supply | Dashboard says "4,000 announced" with source listed as "manual." No URL. | Locate the Housing Infrastructure Canada source for the 4,000-unit figure and add to manifest. If this is from a press release, cite it and note Tier 4 status. |
| **S4** | **Net debt table number** | #16 | Fiscal Health | Dashboard cites "statcan" for net debt with no table number. Budget 2025 Annex 1 shows a different figure ($1.48T vs $1.27T). | Resolve M1 first. Then add the correct source with table number or document reference. |
| **S5** | **NATO Tier 1 citation** | #22 | Defence | Dashboard cites PMO press release (Tier 4) for the NATO 2% achievement. NATO's own report is not directly cited. | Add the NATO Secretary General Annual Report URL (already in manifest as #18) to the dashboard's Defence & Trade source list. Confirm Canada-specific figure from NATO PDF (#19). |

---

## 4. Unresolved Verification Items

These claims could not be verified from manifest sources during the baseline pass. They need human source access to resolve. **Recommended before next scoring cycle; mandatory for any claim that would move a grade.**

| # | Ledger row | Claim | Dimension | Resolution path | Priority |
|---|---|---|---|---|---|
| **U1** | #1 | PR target 380,000 | Immigration | Retry IRCC levels plan URL (returned 403). If still inaccessible, add a corroborating Tier 1/2 source. | High — primary metric |
| **U2** | #6 | PR target = ~0.95% of population | Immigration | Resolves automatically when U1 resolves. | Downstream of U1 |
| **U3** | #13 | Federal spending -56% by 2028-29 | Housing Supply | Check full PBO PDF/Excel data for the 56% figure. If found, document the exact source location. If not, identify the correct source. | Medium |
| **U4** | #17 | Fitch AA+ warning | Fiscal Health | Confirm current Fitch rating at fitch.com. If unchanged, log confirmation with access date. | Medium — event-driven, unlikely to have changed |
| **U5** | #22 | NATO spending 2.0% of GDP | Defence | Open NATO PDF (manifest #19) and confirm Canada's exact % GDP from the country expenditure table. | High — primary metric for strongest dimension |
| **U6** | #26 | US export share 71.7% (2025 annual) | Trade Div. | Navigate StatsCan table 12-10-0176-01 to 2025 annual view. If 71.7% is calculated from monthly data, document the calculation method. | High — primary metric |
| **U7** | #27 | Non-US exports +17.2% | Trade Div. | Calculate from StatsCan table. Document: YoY from what base year, full 2025 vs 2024, method. | High — primary metric |
| **U8** | #28 | CETA trade $134B | Trade Div. | Verify figure from StatsCan table. Specify reference period (annual? cumulative?). | Medium |

---

## Remediation Order

### Phase 1: Fix before next scoring cycle (mandatory)

| Step | Items | Estimated effort | Why mandatory |
|---|---|---|---|
| 1 | **M1:** Resolve net debt $1.27T vs $1.48T | 15 min | Only confirmed value mismatch. Cannot score Fiscal Health with a ~$210B discrepancy on a displayed metric. |
| 2 | **S1:** Add IRCC source URLs + reference periods | 15 min | Two primary Immigration metrics have no source chain. Cannot fully verify Immigration without them. |
| 3 | **U5:** Verify NATO 2.0% from PDF | 10 min | Primary metric for the highest-graded dimension. Currently only confirmed as ≥2%, not exact figure. |
| 4 | **U6, U7:** Verify trade metrics from StatsCan | 15 min | Three primary Trade Diversification metrics are unverifiable. Cannot score Trade without them. |
| 5 | **C1:** Fix BCH "3.7%" framing | 5 min | PBO says 2.1%. Dashboard says 3.7%. One of them needs to be the cited figure. |
| 6 | **S5:** Add NATO report URL to dashboard | 5 min | Dashboard should cite the Tier 1 source, not just the Tier 4 PMO release. |

**Phase 1 total: ~65 minutes.** Resolves all confirmed errors and the highest-priority source gaps.

### Phase 2: Fix before second cycle (recommended)

| Step | Items | Estimated effort |
|---|---|---|
| 7 | **C2:** Fix trade baseline "73%" | 10 min |
| 8 | **C3:** Add prior year deficit figure | 5 min |
| 9 | **C4:** Source or remove "Coast Guard reclassification" | 10 min |
| 10 | **C5:** Verify or soften "bottom third" ranking | 10 min |
| 11 | **S2:** Add CMHC annual need source URL | 10 min |
| 12 | **S3:** Add BCH 4,000 units source URL | 10 min |
| 13 | **U1:** Retry IRCC levels plan URL | 5 min |
| 14 | **U3:** Verify federal spending -56% | 10 min |
| 15 | **U4:** Confirm Fitch rating | 5 min |
| 16 | **U8:** Verify CETA trade $134B | 5 min |

**Phase 2 total: ~80 minutes.** Resolves all remaining items. Can be spread across sessions.

---

## Which Fixes Are Mandatory Before Scoring Can Be Trusted

**Cannot score the next cycle without resolving:**
- M1 (net debt mismatch) — a displayed metric contradicts its cited source
- S1 (IRCC URLs) — two primary Immigration metrics have no source chain
- U5 (NATO exact figure) — primary Defence metric not confirmed from Tier 1 country data
- U6/U7 (trade metrics) — three primary Trade Diversification metrics are unverifiable

**Can score with caution if these are deferred:**
- C1-C5 (claim language) — these are framing issues, not value errors. The underlying data may be correct even if the characterization is imprecise.
- S2/S3 (CMHC need, BCH units) — these are benchmarks and program details, not primary scoring metrics.
- U1 (PR target) — the 380,000 figure is almost certainly correct; IRCC page access is the only blocker.
- U4 (Fitch) — event-driven, unlikely to have changed.

**If time is limited, Phase 1 alone (65 min) makes scoring defensible.** Phase 2 makes it clean.
