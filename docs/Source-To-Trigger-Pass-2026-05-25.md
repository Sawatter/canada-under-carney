# Source-to-Trigger Pass — May 25, 2026

**Purpose:** Pick up the six deferred trigger evaluations carried forward from the May 2026 cycle per `docs/Source-To-Trigger-Audit-2026-05.md`. For each, surface current evidence against the published trigger condition and classify the result. **No grade changes.** Findings either confirm hold-with-rationale, surface fired-but-needs-editor-review, or document remaining source gaps for the June cycle ledger.

**Run date:** 2026-05-25
**Dashboard state when run:** v5.70 / commit `9fc6262`
**Method:** One targeted web search per trigger, evaluated against the trigger condition language and sourceLabel in `src/data/dimensions.json`. No fabricated quotes; URLs cited where evidence came from.
**Pattern:** Trigger fired / considered and not fired / source partially checked, editor judgment needed

---

## 1. Defence & Trade — 3.5% funded defence pathway

**Up-trigger text:** "3.5% defence target gets a funded pathway"
**Source label:** Budget 2025 Ch.4
**Original audit verdict:** Not evaluated in May; flagged as carry-forward after 2026-03-26 NATO 2% confirmation.

**Evidence found:**
- At the [2025 NATO Hague Summit](https://www.nato.int/en/news-and-events/articles/news/2026/03/26/nato-secretary-generals-annual-report-shows-significant-increase-in-defence-investment-from-europe-and-canada), Canada and NATO Allies agreed to a new Defence Investment Pledge of 5% of GDP by 2035, structured as 3.5% core defence + 1.5% security-related.
- Annual plans are required from each Ally showing a credible incremental path.
- [PBO has costed](https://www.pbo-dpb.ca/en/news-releases--communiques-de-presse/meeting-natos-5-target-would-require-159-billion-in-core-defence-spending-by-2035-says-pbo-lobjectif-de-5-fixe-par-lotan-necessiterait-159-milliards-de-dollars-en-depenses-militaires-de-base-dici-2035-selon-le-dpb) the 5% pledge at $159B by 2035 with an average $33.5B/year in additional cash expenditures.

**Classification:** **Trigger arguably FIRED, editor methodology judgment needed.** The commitment exists at the head-of-government level (Hague Summit), the dollar pathway is independently costed (PBO), and annual plans are required. Whether this qualifies as a "funded pathway" depends on what the editor reads "funded" to mean: committed-and-costed-but-not-fully-budgeted, vs legislated-in-future-budgets. Recommend explicit editor read before June grade review, with a `judgmentDetail` note documenting whichever interpretation prevails.

**Grade-move implication if fired:** Defence & Trade is currently A-. If the up-trigger fires, an A- → A move would need party-symmetry check and grade-review approval per the Bias-Resistance Protocol.

---

## 2. Affordability Response — gas tax suspension vs $500/household threshold

**Up-trigger text:** "New federal benefit >$500/household announced and funded"
**Source label:** PBO — Canada Groceries and Essentials Benefit (the precedent benefit; this trigger looks for the next one)
**Original audit verdict:** Not evaluated in May; flagged as carry-forward for the 2026-04-14 gas tax suspension.

**Evidence found:**
- [PBO Assessment NT-2627-005-S](https://www.pbo-dpb.ca/en/publications/NT-2627-005-S--pbo-assessment-spring-economic-update-temporarily-suspending-federal-fuel-excise-tax--evaluation-dpb-mise-jour-economique-printemps-suspendre-temporairement-taxe-accise-federale-carburan): suspension costs $2.1B in 2026-27 and yields an average **$124 per household** in savings.
- Range by income quintile: $59 (lowest) to $211 (highest).
- Suspension runs April 20 — September 7, 2026 (temporary, not permanent).

**Classification:** **Considered and NOT fired.** Average per-household benefit ($124) and highest-quintile benefit ($211) are both well below the $500 up-trigger threshold. The suspension is also temporary, not a permanent funded benefit.

**Grade-move implication:** None. Affordability Response stays at D-.

---

## 3. Housing Supply — Canada-Ontario Partnership vs 5%-of-shortfall threshold

**Up-trigger text:** "Federal housing contribution rises above roughly 5% of the shortfall with live disbursement or construction underway"
**Source label:** PBO — housing program outlook
**Original audit verdict:** Not evaluated in May; flagged as carry-forward for the 2026-03-30 Canada-Ontario partnership.

**Evidence found:**
- The [Canada-Ontario Partnership to Build](https://www.pm.gc.ca/en/news/news-releases/2026/03/30/prime-minister-carney-secures-new-partnership-ontario-cut-taxes) is $8.8B over 10 years, **cost-matched** between federal and Ontario. Federal share is approximately $4.4B over 10 years = ~$440M/year.
- Primary instrument is municipal-development-charge reduction (up to 50% reduction for 3 years for participating municipalities) plus HST removal on new homes under $1M.
- Ontario estimates this delivers ~8,000 additional starts in the first year.
- CMHC's documented national shortfall is 3.45M units. 5% of that = 172,500 units. Build Canada Homes target is 26,000 units total over 5 years (PBO RP-2526-020-S).
- No PBO assessment of the Canada-Ontario partnership's contribution to closing the shortfall is yet available (new PBO Annette Ryan appointed 2026-04-22, post-announcement).

**Classification:** **Considered and NOT fired.** Federal share of the partnership (~$440M/year) does not move federal housing contribution above 5% of the national shortfall. The "live disbursement or construction underway" qualifier is also not yet satisfied (the agreement was signed in late March; PBO assessment pending). Ontario's 8,000 incremental starts estimate is province-specific, not a national-shortfall mover.

**Grade-move implication:** None. Housing Supply stays at D.

---

## 4. Climate & Environment — event-driven sources

**Up-triggers:** "Replacement climate strategy published with funded measures" and "ECCC budget restored"
**Source labels:** Government of Canada replacement climate strategy (event-driven), ECCC departmental plan
**Original audit verdict:** Source family not checked since the 2026-04-19 D+ → D move.

**Evidence found:**
- [ECCC 2026-27 Departmental Plan](https://www.canada.ca/en/environment-climate-change/corporate/transparency/priorities-management/departmental-plans/2026-2027.html) exists. (Current dashboard cites the 2025-26 plan as Climate sourceRef.)
- A "Climate Competitiveness Strategy" is mentioned as a cornerstone in current government framing — whether it constitutes the "replacement strategy with funded measures" referenced in the up-trigger requires direct read.
- December 2024 announcement reaffirmed 2035 target of 45-50% reduction below 2005 levels.
- Oil and gas emissions cap regulations were intended to be enacted in 2025 with reporting effective 2026; current dashboard metric shows the emissions cap as "Suspended."

**Classification:** **Source partially checked, editor read of 2026-27 ECCC plan needed.** The 2026-27 ECCC Departmental Plan is the load-bearing source for both up-triggers. Reading it determines whether (a) the Climate Competitiveness Strategy or any equivalent counts as a "funded replacement strategy" and (b) whether ECCC budget shows restoration versus the $1.3B cumulative cuts currently captured. June cycle should open the 2026-27 plan directly. This is the highest-priority editor read in this pass.

**Grade-move implication if up-trigger fires:** Climate & Environment is currently D. If a funded replacement strategy is confirmed, D → D+ would be the conservative read; up to C if multiple funded measures and ECCC budget restoration both land.

---

## 5. Carbon Pricing Policy — OBPS effective price + federal benchmark review

**Up-triggers:** "OBPS tightened with effective price rising above $40/t" and "Formal carbon border adjustment mechanism announced with implementation plan"
**Down-triggers:** "OBPS further weakened with effective price below $15/t" and "Government announces intention to eliminate industrial pricing"
**Source labels:** CCI industrial pricing, ECCC OBPS pages
**Original audit verdict:** Not checked in May.

**Evidence found:**
- 2026 OBPS excess emissions charge is **$110/tonne (CAD)** per the [Output-Based Pricing System page](https://www.canada.ca/en/environment-climate-change/services/climate-change/pricing-pollution-how-it-will-work/output-based-pricing-system.html) and [Quantification Methods v2.0](https://icapcarbonaction.com/en/ets/canada-federal-output-based-pricing-system) (published December 2025).
- [Federal benchmark review in progress](https://www.canada.ca/en/environment-climate-change/services/climate-change/pricing-pollution-how-it-will-work.html): December 2025 discussion paper "Driving Effective Carbon Markets in Canada", winter 2026 engagement, full updated benchmark to publish later in 2026.
- As of May 15, 2026, federal government is extending the headline price trajectory to 2040 for long-term decarbonization certainty.

**Classification:** **Source checked, methodology judgment needed on "effective price."** The $110 headline charge is well above the $40 up-trigger and the $15 down-trigger floor. However, "effective price" in carbon-pricing analysis usually means headline charge × the fraction of emissions facing the charge (after free allocation). Effective price calculation requires the current free-allocation rate per facility, which the OBPS publishes per quantification method. The CCI source needs separate read for their effective-price interpretation. Federal benchmark review is in progress with no down-direction signals.

**Grade-move implication:** Likely none. Carbon Pricing Policy stays at C unless the editor's effective-price judgment crosses $40, in which case C → C+ becomes a candidate.

---

## 6. Immigration — 5% temporary-resident target ahead of schedule

**Up-trigger text:** "Temporary residents reach the 5% target ahead of schedule"
**Source label:** StatsCan population Q4 2025
**Original audit verdict:** StatCan population API was queried by the fetch script in May (result "OK") but no specific evaluation against the 5% target was logged.

**Evidence found:**
- Government target: 5% TR share of population by end of 2026 (some materials reference end of 2027).
- 2026 temporary-resident admissions target reduced from 673,650 (2025) to 385,000 (2026), per [Levels Plan](https://www.canada.ca/en/immigration-refugees-citizenship/news/2024/10/20252027-immigration-levels-plan.html) and [PBO Demographic Implications RP-2526-025-S](https://www.pbo-dpb.ca/en/publications/RP-2526-025-S--demographic-implications-2026-2028-immigration-levels-plan--implications-demographiques-plan-niveaux-immigration-2026-2028) (already in dimensions.json sources).
- Q1 2025 saw decline of 61K non-permanent residents (Statistics Canada). Q1 2026 StatCan data not surfaced in this search.
- 2025 Annual Report to Parliament on Immigration is the most recent comprehensive read.

**Classification:** **Considered and NOT fired.** The TR-share trajectory is downward per all confirmed evidence, but "ahead of schedule" requires reaching 5% before end of 2026. With current data we cannot confirm early arrival. Q1 2026 StatCan population data is the load-bearing source to check in June (already on the v5.70 carry-forward list per `Source-Recertification-2026-05-25.md`).

**Grade-move implication:** None. Immigration stays at C+ unless the Q1 2026 data confirms the 5% target was reached early.

---

## Roll-up

| # | Dimension | Status | Editor action |
|---|---|---|---|
| 1 | Defence & Trade | Trigger arguably FIRED | Methodology judgment on "funded pathway" definition needed before June grade review |
| 2 | Affordability Response | Considered, NOT fired ($124 << $500) | No action |
| 3 | Housing Supply | Considered, NOT fired ($4.4B/10yr << 5% of shortfall) | No action |
| 4 | Climate & Environment | Source partially checked, 2026-27 ECCC plan needs editor read | Highest-priority June editor read |
| 5 | Carbon Pricing Policy | Source checked; effective-price methodology judgment needed | Editor read of CCI effective-price interpretation |
| 6 | Immigration | Considered, NOT fired; Q1 2026 StatCan pending | June: pull Q1 2026 StatCan population, recompute TR share |

**Summary:**
- 0 grades changed by this pass (per design)
- 1 trigger arguably fired and needs editor methodology call (Defence 3.5%)
- 3 triggers considered and not fired with evidence (Affordability, Housing, Immigration)
- 2 triggers need editor source-read in June (Climate, Carbon Pricing)

## Carry-forward into the June 2026 cycle

1. Defence & Trade up-trigger: editor decision on whether NATO 2035 5% pledge + PBO costing + required annual plans qualify as a "funded pathway." Document the call in `judgmentDetail`.
2. Climate & Environment: open the [ECCC 2026-27 Departmental Plan](https://www.canada.ca/en/environment-climate-change/corporate/transparency/priorities-management/departmental-plans/2026-2027.html) directly. Compare line items against the 2025-26 plan to determine whether ECCC budget shows restoration. Check whether the Climate Competitiveness Strategy counts as a "replacement strategy with funded measures."
3. Carbon Pricing Policy: open the December 2025 federal benchmark discussion paper and CCI industrial pricing publication. Compute effective price after free allocation. Decide whether $110 headline + free-allocation math crosses the $40 effective up-trigger.
4. Immigration: pull Q1 2026 StatCan population once published. Recompute TR share. Compare to 5% target schedule.

## Authority and scope

This pass picks up the six carry-forward items from `docs/Source-To-Trigger-Audit-2026-05.md`. It does not change grades, thresholds, GPA formulas, POCKETBOOK_DIMS, or any data values in `src/data/dimensions.json`. All findings are documentation; any grade move requires explicit editor approval and party-symmetry check per the Bias-Resistance Protocol.

## Version history

- **v1.0 (2026-05-25, v5.71):** Initial pass through the six May carry-forward trigger evaluations. Four classified directly (1 arguably fired, 3 considered-and-not-fired). Two flagged as needing direct editor source-read (Climate ECCC plan, Carbon Pricing effective-price interpretation). Zero grade changes.
