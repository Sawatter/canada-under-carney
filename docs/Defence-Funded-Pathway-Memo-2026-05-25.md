# Defence & Trade — "Funded Pathway" Methodology Memo

**Purpose:** Lay out both reasonable interpretations of the Defence & Trade up-trigger ("3.5% defence target gets a funded pathway"), with evidence for each, so the editor can make the methodology call before the June 2026 cycle. Close carry-forward item #1 from `docs/Source-To-Trigger-Pass-2026-05-25.md`.

**Run date:** 2026-05-25
**Dashboard state when run:** v5.72 / commit `6bd370e`
**Method:** Targeted web searches against NATO official texts (Hague Summit Declaration), PBO publications, Canadian government announcements, third-party defence-industrial-base analysis (Atlantic Council, IISS).
**Scope discipline:** Documentation pass. No grade, threshold, GPA-formula, POCKETBOOK_DIMS, or dimensions.json data changes.

---

## The trigger being evaluated

From `dimensions.json` for `defence-trade`:

**Up-trigger:** "3.5% defence target gets a funded pathway"
**Source label:** Budget 2025 Ch.4

Current grade: **A-** (mixed-construct dimension — defence milestone + trade outcome under one grade; carries the documented tripwire that if the two halves move in opposite directions for two consecutive monthly cycles, the split shadow promotes to a live separate file).

---

## Evidence: the three elements that exist

### 1. Head-of-government commitment (Hague Summit, June 24-25, 2025)

- **Pledge:** All NATO Allies, including Canada, agreed to a Defence Investment Pledge of **5% of GDP by 2035**, structured as **3.5% core defence + 1.5% security-related**.
- **Quote from the Declaration:** "Allies will allocate at least 3.5% of GDP annually based on the agreed definition of NATO defence expenditure by 2035 to resource core defence requirements, and to meet the NATO Capability Targets. Allies agree to submit **annual plans** showing a credible, incremental path to reach this goal."
- **Canadian framing:** Per Canada's NATO Defence Investment Pledge announcement, "as part of this 5 per cent pledge, Canada will invest 3.5 per cent of GDP for core military capabilities, expanding on our recent investments."
- **Source:** [The Hague Summit Declaration (NATO official text)](https://www.nato.int/en/about-us/official-texts-and-resources/official-texts/2025/06/25/the-hague-summit-declaration); [Canada joins new NATO Defence Investment Pledge](https://www.newswire.ca/news-releases/canada-joins-new-nato-defence-investment-pledge-869816082.html).

### 2. Required formal mechanism (annual plans)

- The Hague Declaration **requires** each Ally to submit annual plans showing credible, incremental progress toward 3.5% core defence.
- This is not optional. It is the NATO-binding mechanism that turns the 2035 pledge into a multi-year planning requirement.
- The first Canadian annual plan under this mechanism is due in the NATO planning cycle following the Hague Summit; specific Canadian filing details are not in this pass's search results and would need direct DND or NATO Secretary General office confirmation.

### 3. Independent fiscal costing (PBO)

- **PBO costing:** [Meeting NATO's 5% target would require $159 billion in core defence spending by 2035](https://www.pbo-dpb.ca/en/news-releases--communiques-de-presse/meeting-natos-5-target-would-require-159-billion-in-core-defence-spending-by-2035-says-pbo-lobjectif-de-5-fixe-par-lotan-necessiterait-159-milliards-de-dollars-en-depenses-militaires-de-base-dici-2035-selon-le-dpb) and the underlying report [Fiscal Implications of Meeting NATO's 5% Commitment (RP-2526-022-S)](https://www.pbo-dpb.ca/en/publications/RP-2526-022-S--fiscal-implications-meeting-nato-5-commitment--repercussions-financieres-atteinte-cible-5-otan).
- **$159B = annual core defence spending in 2035-36 (the level, not cumulative).** This is what Canada would spend on core defence in that single fiscal year, on a cash basis, under the PBO scenario.
- **$33.5B/year = average annual additional spending** above the current baseline, over the 2025-2035 ramp-up.
- **$334B = cumulative additional core defence spending** over the decade ($33.5B × 10).
- **$63B in 2035-36 = deficit impact** of the 5% pledge in the peak year (1.4 percentage points of GDP). PBO also estimates the federal debt-to-GDP ratio rises by 6.3 percentage points.
- The PBO costing is independent, public, and operationally specific. Published February 2026.

---

## The methodology question

The up-trigger text says "3.5% defence target gets a **funded pathway**." "Funded pathway" is not defined in `dimensions.json`. Two interpretations are reasonable:

### Interpretation A — "Funded" = committed + planned + costed (federal-credit reading)

**Test:** Has Canada (a) committed to the 3.5%, (b) been required to file an annual plan toward it, AND (c) been provided an independent costing of the cash trajectory?

**Status today:**
- (a) Commitment: ✅ (Hague Summit Declaration, June 25, 2025)
- (b) Planning requirement: ✅ (NATO-binding annual plans)
- (c) Independent costing: ✅ (PBO $159B by 2035)

**Trigger fires under Interpretation A.** All three elements are present and on the public record.

### Interpretation B — "Funded" = legislated multi-year budget allocation (skeptic reading)

**Test:** Has the Government of Canada legislated multi-year budget allocations sufficient to reach 3.5% of GDP by 2035 on a credible incremental path?

**Status today:**
- Budget 2025 (November 4, 2025): Recent announced defence investments included, but no multi-year allocation explicitly anchored to the 3.5% trajectory has been confirmed in this pass.
- 2026-2027 federal budget cycle: Not yet tabled (June 2026 is the typical window).
- Multi-year defence funding envelope sufficient to credibly reach 3.5% by 2035 ($33.5B/year incremental): Not legislated. The cash for the trajectory does not yet appear as a multi-year line item in approved estimates.

**Trigger does NOT fire under Interpretation B.** Commitment + plan + costing exist, but legislated budget allocation does not.

### Which interpretation is more defensible?

- **Interpretation A** is consistent with how NATO measures progress against the 5% pledge (commitment + annual planning + monitoring). It is also consistent with how grading systems normally evaluate "funded" — a publicly committed and independently costed plan with a binding mechanism. Most international defence-economics literature uses this reading.
- **Interpretation B** is the legislative/audit reading. It is stricter and more conservative. It would not be unreasonable in a fiscal-accountability framework. But it sets a bar that no NATO Ally other than perhaps Poland would currently meet, which makes the trigger functionally unfireable until the 2030s, undermining its analytical value.
- **The dashboard's general posture is "paper-trail evidence."** Interpretation A is supported by paper trail (Declaration text, PBO costing, annual-plan requirement). Interpretation B requires absence of evidence ("no legislated budget") which is harder to verify positively today since the 2026-27 budget cycle hasn't completed.

**Operational definition required either way.** Interpretation A is defensible only if "funded pathway" is read as **commitment + NATO-binding annual plan + PBO-costed trajectory**. If "funded" is read instead as **appropriated multi-year fiscal framework**, Interpretation B is the safer call and the trigger does not fire. The editor must publish whichever operational definition is adopted in `judgmentDetail` so future passes apply the same test consistently.

**Recommended editor methodology call:** Adopt Interpretation A and document the operational definition in `judgmentDetail` on the Defence & Trade dimension. Under Interpretation A, the up-trigger fires.

---

## Grade-move implications

Defence & Trade is currently **A-**.

| Scenario | Grade implication |
|---|---|
| Interpretation A adopted, up-trigger fires | A- → A candidate. Requires party-symmetry check per Bias-Resistance Protocol. |
| Interpretation B adopted, up-trigger does not fire | Hold at A-. Trigger remains live for future budget cycle. |
| Pentagon pressure produces formal Canadian roadmap with legislated multi-year allocation (per [CBC Pentagon report](https://www.cbc.ca/news/politics/us-canada-defence-board-spending-politics-9.7207835)) | Strengthens Interpretation A; could promote firing under either interpretation. |

**Party-symmetry check (under Interpretation A, before any grade move):**
- Hypothetical: a Conservative government had agreed to the Hague pledge with the same PBO costing and the same annual-plan requirement but no legislated multi-year budget. Would the dashboard fire the up-trigger? Yes — the elements would be identical. Under the same evidence, the same grade move applies.
- Hypothetical: an NDP-led coalition had announced the commitment with the same elements. Would the dashboard fire? Yes — same evidence, same call.
- Conclusion: Interpretation A passes party-symmetry. No partisan favoring.

**Mixed-construct caveat:** Defence & Trade currently grades both defence milestone AND trade outcome under one grade. The defence half firing this trigger does not automatically move the grade if the trade half is moving differently. The dimension's documented tripwire (split shadow if the two halves diverge for two consecutive cycles) should be re-checked in June. If the trade half is stable or improving with the defence half firing, A- → A is a clean candidate. If the trade half is declining, the split-shadow tripwire becomes the priority.

---

## Carry-forward into the June 2026 cycle

1. **Editor methodology decision** on Interpretation A vs B for "funded pathway." Document in `judgmentDetail`. Recommend A with the supporting reasoning above.
2. **Verify the Hague Declaration paragraph** is in the cited Budget 2025 Ch.4 source. If not, add the Hague Declaration as the labeled source (`{label: "NATO Hague Summit Declaration", url: "https://www.nato.int/en/about-us/official-texts-and-resources/official-texts/2025/06/25/the-hague-summit-declaration"}`). Update sourceLabel if needed.
3. **Add PBO $159B costing** as a `gradeTriggers.up[].additionalSources` entry on the Defence & Trade dimension. Currently the trigger references only Budget 2025 Ch.4.
4. **Check Canadian annual plan filing status** (NATO planning cycle). If a Canadian annual plan toward 3.5% has been filed and is public, add it as a source. If not yet filed but a date is confirmed, flag for future cycles.
5. **Run the split-shadow tripwire check** for Defence & Trade in the June review (defence half vs trade half over the previous two cycles).
6. **If grade move proceeds (A- → A):** publish in changelog with type `grade`, full `dimensionId`, `dimensionName`, `from`, `to`, `deltaLabel`, `headline`, `body`, `drivers`, `link` shape.

---

## Authority and scope

This memo closes carry-forward item #1 from `docs/Source-To-Trigger-Pass-2026-05-25.md`. It does not change grades, thresholds, GPA formulas, POCKETBOOK_DIMS, or any data values in `src/data/dimensions.json`. All findings are documentation; grade moves require explicit editor approval and party-symmetry check per the Bias-Resistance Protocol.

## Sources

- [The Hague Summit Declaration (NATO official, June 25, 2025)](https://www.nato.int/en/about-us/official-texts-and-resources/official-texts/2025/06/25/the-hague-summit-declaration)
- [Canada joins new NATO Defence Investment Pledge](https://www.newswire.ca/news-releases/canada-joins-new-nato-defence-investment-pledge-869816082.html)
- [PBO — Meeting NATO's 5% target would require $159B in core defence spending by 2035](https://www.pbo-dpb.ca/en/news-releases--communiques-de-presse/meeting-natos-5-target-would-require-159-billion-in-core-defence-spending-by-2035-says-pbo-lobjectif-de-5-fixe-par-lotan-necessiterait-159-milliards-de-dollars-en-depenses-militaires-de-base-dici-2035-selon-le-dpb)
- [Atlantic Council — How to equip Canada's defence industrial base to meet NATO's Hague summit commitments](https://www.atlanticcouncil.org/in-depth-research-reports/issue-brief/how-to-equip-canadas-defense-industrial-base-to-meet-natos-hague-summit-commitments/)
- [Atlantic Council — Experts react: NATO allies agreed to a 5 percent defence spending target](https://www.atlanticcouncil.org/blogs/new-atlanticist/experts-react/nato-allies-agreed-to-a-5-percent-defense-spending-target-in-a-low-drama-summit-now-what/)
- [CBC News — Pentagon demands NATO spending roadmap from Canada](https://www.cbc.ca/news/politics/us-canada-defence-board-spending-politics-9.7207835)
- [IISS — NATO agrees on investment pledge](https://www.iiss.org/online-analysis/military-balance/2025/062/nato-agrees-on-investment-pledge/)
- [NATO Secretary General's 2025 Annual Report (USNI News, March 31, 2026)](https://news.usni.org/2026/03/31/nato-secretary-generals-2025-annual-report)

## Version history

- **v1.0 (2026-05-25, v5.73):** Initial methodology memo. Three elements present (Hague commitment, NATO-binding annual-plan requirement, PBO $159B costing). Two interpretations laid out: A (commitment + plan + costing = fires); B (requires legislated multi-year budget = does not fire). Recommended A with party-symmetry rationale. Zero grade changes.
- **v1.1 (2026-05-25, v5.74):** Clarified PBO framing per Codex review: $159B is the 2035-36 ANNUAL core defence spending level (not cumulative); $33.5B/year is the AVERAGE ANNUAL ADDITIONAL spending above baseline (not "cumulative per year" — that was nonsense phrasing); $334B is the cumulative additional over the decade; $63B is the 2035-36 deficit impact in the peak year. Added sentence on operational-definition discipline before the recommended editor call. Zero grade changes.
