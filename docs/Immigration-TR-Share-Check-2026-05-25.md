# Immigration — Temporary-Resident Share Trajectory Check

**Purpose:** Document the current temporary-resident (TR) share trajectory against the 5% federal target up-trigger ("Temporary residents reach the 5% target ahead of schedule"). Close carry-forward item #4 from `docs/Source-To-Trigger-Pass-2026-05-25.md`. Confirm whether Q1 2026 StatCan data is yet available.

**Run date:** 2026-05-25
**Dashboard state when run:** v5.72 / commit `6bd370e`
**Method:** Targeted StatCan search (The Daily, Quarterly Demographic Estimates, Population Estimates table 17-10-0009-01), IRCC Levels Plan, PBO demographic-implications analysis.
**Scope discipline:** Documentation pass. No grade, threshold, GPA-formula, POCKETBOOK_DIMS, or dimensions.json data changes.

---

## What's available

| Date | Non-permanent residents | Population | TR share | Source |
|---|---|---|---|---|
| Oct 1, 2024 | 3,149,131 | ~41.5M | ~7.6% | StatCan Daily (historical peak) |
| Jul 1, 2025 | 3,024,216 | ~41.4M | **7.3%** | [The Daily, Q3 2025 release Dec 17, 2025](https://www150.statcan.gc.ca/n1/daily-quotidien/251217/dq251217b-eng.htm) |
| Oct 1, 2025 | 2,847,737 | ~41.9M | **6.8%** | StatCan Daily Q3 2025 release |
| Jan 1, 2026 (Q4 2025 reference date) | 2,676,441 | 41,472,081 | **6.5%** (6.4536% exact) | [The Daily, Q4 2025 release Mar 18, 2026](https://www150.statcan.gc.ca/n1/daily-quotidien/260318/dq260318b-eng.htm) |

**Q1 2026 status:** **NOT YET PUBLISHED.** Q1 2026 ends April 1, 2026, and StatCan's quarterly population estimates typically release ~10-12 weeks after quarter close. Expected release window: **mid-June to mid-July 2026.**

---

## Trajectory analysis

The TR-share trajectory is **consistently downward** since the Q3 2024 peak:

- Oct 1, 2024: ~7.6% (peak)
- Jul 1, 2025: 7.3% (−0.3 pp)
- Oct 1, 2025: 6.8% (−0.5 pp)
- Jan 1, 2026: 6.5% (−0.3 pp)

**Average decline per quarter:** ~0.37 pp (most recent three quarters: −0.3, −0.5, −0.3).

**Linear projection if pace continues (~0.37 pp/quarter):**
- Apr 1, 2026 (Q1 reference): ~6.1%
- Jul 1, 2026 (Q2 reference): ~5.7%
- Oct 1, 2026 (Q3 reference): ~5.4%
- Jan 1, 2027 (Q4 reference, "end of 2026"): ~5.0%

**Government target:** TR share ≤ 5% of population by end of 2026 (some IRCC materials reference end of 2027).

**Levels Plan context:** 2026 temporary-resident admissions target reduced from 673,650 (2025) to 385,000 (2026), per [IRCC 2025-2027 Immigration Levels Plan](https://www.canada.ca/en/immigration-refugees-citizenship/news/2024/10/20252027-immigration-levels-plan.html) and [PBO Demographic Implications RP-2526-025-S](https://www.pbo-dpb.ca/en/publications/RP-2526-025-S--demographic-implications-2026-2028-immigration-levels-plan--implications-demographiques-plan-niveaux-immigration-2026-2028) (already in dimensions.json sources).

---

## Trigger evaluation

**Up-trigger:** "Temporary residents reach the 5% target ahead of schedule."

| Test | Status |
|---|---|
| Has TR share reached 5%? | NO — currently 6.5% (Jan 1, 2026 reference date). |
| Is the trajectory consistent with reaching 5% before end of 2026? | ON THE BUBBLE — linear extrapolation puts TR share at ~5.0% by Q4 2026 reference date (Jan 1, 2027), which is the target year, not "ahead of schedule." |
| Is "ahead of schedule" satisfied? | NOT YET. Target is end-of-2026; current trajectory hits 5% right around end-of-2026, not before. |
| What does PBO's *modeled* forecast say? | PBO RP-2526-025-S projects NPR share declining to just under 5% by **end of 2027** — more conservative than the linear ~end-2026 read. On PBO's model, "ahead of schedule" is even less supported. |

**Classification:** **NOT FIRED.** Trajectory is on track and arguably moving faster than required, but the up-trigger language requires actually reaching 5%, not just trending toward it. Confirmation requires Q1 2026 or later StatCan data showing TR share ≤ 5%.

---

## Grade-move implications

Immigration is currently **C+**.

- **If Q1 2026 data (expected June-July 2026) shows TR share ≤ 5%:** Up-trigger fires "ahead of schedule" (target was end of 2026). C+ → B- candidate. Requires party-symmetry check.
- **If Q1 2026 data shows TR share between 5% and 6%:** Up-trigger does NOT fire but trajectory is clearly on track. Hold C+. Update metric with new data point and note proximity to target.
- **If trajectory unexpectedly reverses (TR share rises):** Re-evaluate downside risk. Not currently the expected outcome.

**Most likely outcome:** Hold at C+ in June, with refreshed Q1 2026 data point if StatCan releases on the early end of the expected window. Up-trigger likely fires in the July or August cycle if Q1 2026 lands ≤ 5%, or September cycle if Q2 2026 is the load-bearing release.

---

## Carry-forward into the June 2026 cycle

1. **Pull Q1 2026 StatCan population estimate** when released (expected mid-June to mid-July 2026). Compute TR share = non-permanent residents / total population.
2. **Recompute trajectory** with the new data point. Update Immigration dimension metric.
3. **If TR share ≤ 5%:** Trigger the editor grade-review for C+ → B- candidate. Party-symmetry check required (compare framing to a Conservative-or-NDP government hitting the same target on the same timeline).
4. **If TR share > 5%:** No grade action; document the data point and note trajectory remains on track to hit 5% by end of 2026.
5. **Add the Jan 1, 2026 / 6.5% (6.4536% exact) data point** to Immigration metric chain as the most recent confirmed reading.

---

## Authority and scope

This check closes carry-forward item #4 from `docs/Source-To-Trigger-Pass-2026-05-25.md`. It does not change grades, thresholds, GPA formulas, POCKETBOOK_DIMS, or any data values in `src/data/dimensions.json`. All findings are documentation; grade moves require explicit editor approval and party-symmetry check per the Bias-Resistance Protocol.

## Sources

- [The Daily — Canada's population estimates, fourth quarter 2025 (March 18, 2026)](https://www150.statcan.gc.ca/n1/daily-quotidien/260318/dq260318b-eng.htm)
- [The Daily — Canada's population estimates, third quarter 2025 (December 17, 2025)](https://www150.statcan.gc.ca/n1/daily-quotidien/251217/dq251217b-eng.htm)
- [Quarterly Demographic Estimates (StatCan catalogue 91-002-X)](https://www150.statcan.gc.ca/n1/en/catalogue/91-002-X)
- [Population estimates, quarterly (StatCan table 17-10-0009-01)](https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1710000901)
- [IRCC — 2025-2027 Immigration Levels Plan](https://www.canada.ca/en/immigration-refugees-citizenship/news/2024/10/20252027-immigration-levels-plan.html)
- [PBO RP-2526-025-S — Demographic implications 2026-2028 immigration levels plan](https://www.pbo-dpb.ca/en/publications/RP-2526-025-S--demographic-implications-2026-2028-immigration-levels-plan--implications-demographiques-plan-niveaux-immigration-2026-2028)

## Version history

- **v1.0 (2026-05-25, v5.73):** Initial trajectory check. Q1 2026 not yet published; most recent confirmed data point is Jan 1, 2026 TR share = 6.4%. Trajectory downward at ~0.4 pp/quarter. Up-trigger NOT FIRED but on track to fire mid-to-late 2026. Zero grade changes.
- **v1.1 (2026-05-25, v5.74):** Corrected Jan 1, 2026 TR share from 6.4% to 6.5% (exact 6.4536% per 2,676,441 / 41,472,081). Rounding-up rule applies; previous figure used round-down. Linear projection updated: trajectory hits 5% right around the end-of-2026 target year, not "ahead of schedule." Caught in Codex independent review pass. Zero grade changes.
