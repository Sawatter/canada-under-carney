# Carbon Pricing Policy — Effective-Price Interpretation Prep

**Purpose:** Lay out evidence and the methodology question for the Carbon Pricing dimension's up-trigger 1 ("OBPS tightened with effective price rising above $40/t"), so the editor can make the methodology call on what "effective price" means in the trigger language before the June 2026 cycle. Per carry-forward item #3 from `docs/Source-To-Trigger-Pass-2026-05-25.md`.

**Run date:** 2026-05-25
**Dashboard state when run:** v5.72 / commit `6bd370e`
**Method:** Targeted web searches against canada.ca (ECCC OBPS pages, federal benchmark consultation), Canadian Climate Institute publications, International Carbon Action Partnership (ICAP) ETS map, third-party legal analysis.
**Scope discipline:** Documentation pass. No grade, threshold, GPA-formula, POCKETBOOK_DIMS, or dimensions.json data changes.

---

## The triggers being evaluated

From `dimensions.json` for `carbon-pricing-policy`:

**Up-triggers:**
1. "OBPS tightened with effective price rising above $40/t"
2. "Formal carbon border adjustment mechanism announced with implementation plan"

**Down-triggers:**
1. "OBPS further weakened with effective price below $15/t"
2. "Government announces intention to eliminate industrial pricing"

Current grade: **C**.

---

## Evidence found

### Headline vs effective price

- **OBPS excess emissions charge (2026):** **$110/tonne CAD.** This is the headline charge facilities pay for emissions above their compliance limit. ICAP and ECCC both confirm this figure.
- **Federal trajectory:** Carbon price set to increase $15/tonne annually, settling at $170/tonne in 2030 under Budget 2025 framing. As of May 15, 2026, the federal government is extending the headline trajectory to 2040 for long-term decarbonization certainty.
- **Free allocation mechanism:** Under OBPS, facilities that emit **less than** their emissions limit receive surplus credits (compliance units) for free, equal to the tCO₂e they're below the limit. Facilities above their limit pay the headline charge on the difference.

**This is the math behind "effective price":** Free allocation means most facility emissions are not facing the headline charge directly — only the marginal tonne above the benchmark is. So the **effective price** (averaged across all covered emissions) is materially lower than the $110 headline.

### CCI's effective-price benchmark

The Canadian Climate Institute publishes its own "Effective Marginal Credit Price" (EMCP) analysis:

- **CCI's EMCP target:** **$130/tonne** as the stringency benchmark identified in the MOU for what provinces should achieve, subject to progressively tightening benchmarks, price floor/ceiling that move over time, and limits on compliance pathways that dilute marginal incentives.
- CCI's January 2026 report ["Outcomes Not Optics: Canadian carbon markets need bold reform to be effective"](https://climateinstitute.ca/wp-content/uploads/2026/01/Canadian-Climate-Institute-Outcomes-Not-Optics-Canadian-carbon-markets-need-bold-reform-to-be-effective.pdf) is the load-bearing publication.
- CCI argues that **industrial carbon pricing, delivered through Large Emitter Trading Systems (LETS), remains the single most important policy lever for reducing emissions from Canada's highest-emitting sectors.**

The implication CCI is making: actual EMCP across provinces today is **below** the $130 benchmark in most jurisdictions. That's the gap CCI argues the federal benchmark review must close.

### Federal benchmark review (in progress)

- **Discussion paper:** [Driving Effective Carbon Markets in Canada](https://www.canada.ca/en/environment-climate-change/corporate/transparency/consultations/comment-driving-effective-carbon-markets/discussion-paper.html), published December 19, 2025.
- **Consultation window:** Open Dec 19, 2025 — Close January 30, 2026.
- **Technical webinar:** January 6, 2026.
- **Updated federal benchmark expected:** Later in 2026 (specific publication date not announced).
- **Scope options under consideration:** Two thresholds for coverage of large emitters — 10kt CO₂e/year (Option 1A) or 25kt CO₂e/year (Option 1B).
- **Framing:** Federal benchmark review is explicitly part of the Climate Competitiveness Strategy and pitched as a strengthening exercise — strengthening industrial carbon pricing, providing clear and complementary GHG regulations, mobilizing capital to net-zero.

---

## The methodology question

The trigger text reads: "OBPS tightened **with effective price rising above $40/t**."

"Effective price" is not defined in `dimensions.json`. Three reasonable interpretations exist:

| Interpretation | Test | Current status |
|---|---|---|
| **A — Headline charge** | Is the $/tonne charge for excess emissions above $40? | **FIRES** — headline is $110 in 2026. |
| **B — CCI's Effective Marginal Credit Price (EMCP)** | Is the EMCP after compliance pathways and free allocation above $40? | **MIXED** — CCI's $130 stringency target is above $40, but actual EMCP across provinces today is materially below the $130 benchmark and may be below $40 in some jurisdictions. Requires direct CCI EMCP-per-province table. |
| **C — System-wide average effective price** | (Headline × emissions above benchmark + $0 × emissions at-or-below benchmark) / total covered emissions | **LIKELY BELOW $40** — most covered emissions sit at or below their benchmark and pay $0. System-wide effective price is well below headline. |

### Which interpretation is most defensible?

- **Interpretation A** is the easiest to verify but inconsistent with how carbon-pricing analysis is normally conducted — the headline price is not the effective price. The CCI report exists specifically because A is misleading.
- **Interpretation B** matches how CCI, ECCC's own discussion paper, and most academic literature talk about industrial pricing strength. It's the most defensible read but requires per-province data.
- **Interpretation C** is the strictest read and would generally produce the lowest number. It is also defensible but is harder to source consistently across provinces.

**Recommended editor methodology call:** Adopt Interpretation B (CCI EMCP) as the operational meaning of "effective price" in this trigger, **document it in `judgmentDetail`**, and update the source label to point to the CCI EMCP publication as the authoritative number. If the federal benchmark review concludes with a target EMCP above $40, the up-trigger fires; if not, it doesn't.

### Trigger status conclusions (provisional)

- **Up-trigger 1 ("effective price above $40/t"):** **DEPENDS ON METHODOLOGY CALL.** Likely FIRES under Interpretation A or B-aspirational (CCI's $130 target). May or may not fire under Interpretation B-actual or C.
- **Up-trigger 2 ("CBAM with implementation plan"):** **NOT FIRED.** No carbon border adjustment mechanism has been formally announced in Canada. Federal benchmark review explicitly addresses domestic stringency, not borders.
- **Down-trigger 1 ("effective price below $15/t"):** **NOT FIRED** under any interpretation. Headline is $110; even the most aggressive free-allocation netting does not get below $15 on a system-wide basis.
- **Down-trigger 2 ("government announces intention to eliminate industrial pricing"):** **NOT FIRED — and trending opposite.** The federal benchmark review and Climate Competitiveness Strategy are explicit strengthening exercises. The dashboard should record this as a clear "not fired, negative-direction" finding.

---

## Grade-move implications

Carbon Pricing Policy is currently **C**.

| Scenario | Grade implication |
|---|---|
| Interpretation A adopted | Up-trigger 1 fires. C → C+ candidate. Requires party-symmetry check. |
| Interpretation B adopted, EMCP today is < $40 | No trigger fires. Hold at C. Revisit when federal benchmark review publishes the new EMCP. |
| Interpretation B adopted, EMCP today is > $40 | Up-trigger 1 fires. C → C+ candidate. Requires party-symmetry check. |
| Interpretation C adopted | Up-trigger 1 likely doesn't fire. Hold at C. |
| Federal benchmark review concludes with $130 EMCP target adopted across provinces | Up-trigger 1 fires under B. C → C+ candidate. Note this is forward-looking, not current. |

**Most likely outcome (Interpretation B, current EMCP data):** Hold at C in June. Revisit when the federal benchmark review publishes updated EMCP (later 2026).

---

## Carry-forward into the June 2026 cycle

1. **Editor methodology call:** adopt Interpretation A, B, or C as the operational meaning of "effective price." Document in `judgmentDetail`. Recommend B.
2. **Pull CCI EMCP-per-province table** from the January 2026 CCI report. Compute average EMCP across covered emissions for comparison against the $40 trigger threshold.
3. **Add the CCI January 2026 report** as a `gradeTriggers.up[].additionalSources` entry on the Carbon Pricing dimension to give the trigger an externally-defensible source.
4. **Add the December 2025 federal benchmark discussion paper** as a Carbon Pricing dimension source. Currently not cited.
5. **Watch for the federal benchmark update** (expected later in 2026). When published, re-evaluate the trigger.

---

## Authority and scope

This prep closes carry-forward item #3 from `docs/Source-To-Trigger-Pass-2026-05-25.md`. It does not change grades, thresholds, GPA formulas, POCKETBOOK_DIMS, or any data values in `src/data/dimensions.json`. All findings are documentation; trigger interpretations and grade moves require explicit editor approval and party-symmetry check per the Bias-Resistance Protocol.

## Sources

- [ECCC — Output-Based Pricing System (Canada.ca)](https://www.canada.ca/en/environment-climate-change/services/climate-change/pricing-pollution-how-it-will-work/output-based-pricing-system.html)
- [ECCC — Industrial carbon pricing in Canada](https://www.canada.ca/en/environment-climate-change/services/climate-change/pricing-pollution-how-it-will-work/putting-price-on-carbon-pollution/industry.html)
- [ECCC — The federal carbon pollution pricing benchmark](https://www.canada.ca/en/environment-climate-change/services/climate-change/pricing-pollution-how-it-will-work/carbon-pollution-pricing-federal-benchmark-information.html)
- [Discussion paper: Driving effective carbon markets in Canada (Dec 19, 2025)](https://www.canada.ca/en/environment-climate-change/corporate/transparency/consultations/comment-driving-effective-carbon-markets/discussion-paper.html)
- [Canadian Climate Institute — Outcomes Not Optics report (Jan 2026)](https://climateinstitute.ca/wp-content/uploads/2026/01/Canadian-Climate-Institute-Outcomes-Not-Optics-Canadian-carbon-markets-need-bold-reform-to-be-effective.pdf)
- [Canadian Climate Institute — Fact Sheet: Industrial carbon pricing in Canada](https://climateinstitute.ca/news/fact-sheet-canada-industrial-carbon-pricing-systems/)
- [ICAP — Canada Federal Output-Based Pricing System ETS Map](https://icapcarbonaction.com/en/ets/canada-federal-output-based-pricing-system)
- [Resilient LLP — ECCC publishes discussion paper and launches consultation on effective carbon markets](https://resilientllp.com/2025/12/19/eccc-publishes-discussion-paper-and-launches-consultation-on-effective-carbon-markets/)
- [ClearBlue Markets — Navigating Canada's Carbon Markets Ahead of the 2026 Federal Benchmark Review](https://www.clearbluemarkets.com/knowledge-base/navigating-canadas-carbon-markets-ahead-of-the-2026-federal-benchmark-review)

## Version history

- **v1.0 (2026-05-25, v5.73):** Initial prep doc. Headline OBPS charge confirmed at $110/t. CCI EMCP benchmark of $130 identified as the most defensible "effective price" reference. Trigger outcome depends on editor methodology call. Zero grade changes.
