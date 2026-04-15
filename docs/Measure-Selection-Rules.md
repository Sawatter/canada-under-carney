# Measure Selection Rules

**Purpose:** For each dimension with multiple valid data measures, specify exactly which measure the dashboard uses, how it is labeled, and what cannot be mixed without explanation.

**Last updated:** April 2026

---

## Affordability Response

**Primary measure:** Food purchased from stores, year-over-year % change (CPI sub-index)
**Exact label:** "Food CPI (stores, YoY)"
**Source:** StatsCan Table 18-10-0004-01, monthly CPI release (The Daily)
**Comparison window:** Year-over-year (same month prior year). Do NOT use month-over-month.

**Fallback/context measures:**
- Food purchased from restaurants (separate CPI sub-index) — context only, not grade-moving
- Overall food CPI (combined stores + restaurants) — may be referenced but must be labeled distinctly
- Average retail prices (StatsCan Table 18-10-0245-02) — different instrument, different methodology. Do NOT mix with CPI sub-index without explanation.
- Dalhousie annual food cost projections — annual context only

**What cannot be mixed:**
- CPI basket measure and average retail price measure in the same card without labeling which is which
- Year-over-year and month-over-month in the same comparison
- "Food inflation" without specifying: stores, restaurants, or combined

**Retired figures:** The "5.7%" figure used in the initial evidence sweep has no verified StatsCan CPI source. It is removed from all materials. If it originated from average retail prices (Table 18-10-0245-02), that instrument must be labeled separately and not presented alongside CPI figures as if they are the same measure.

---

## Defence & Trade

**Primary measures (two sub-constructs):**

**Defence sub-score:**
- Primary: NATO defence spending as % of GDP
- Exact label: "NATO spending (% GDP)"
- Source: NATO Secretary General's Annual Report (Tier 1 independent) + DND confirmation
- Comparison window: Annual (NATO reports annually, typically March/June)
- Fallback: DND Departmental Plan spending figures — government source, Tier 4, requires NATO corroboration for grade-moving use

**Trade sub-score:**
- Primary: US share of Canadian merchandise exports (annual average)
- Exact label: "US export share (annual avg)"
- Source: StatsCan Table 12-10-0176-01, annual average from December trade release
- Comparison window: Full-year annual average. Do NOT use a single month to claim annual trend.
- Fallback: Monthly trade data — context for direction of travel, labeled "monthly, volatile"

**What cannot be mixed:**
- Annual trade diversification figures (+17.2% non-US exports for full year 2025) alongside monthly figures (-6.5% non-US in January 2026) without clearly labeling the time window
- Government press release spending claims alongside NATO-verified figures without specifying which source
- Monthly trade balance data as evidence of structural diversification (monthly data is volatile; structural claims require annual or 12-month rolling averages)

**Retired figures:** The "+17.2% non-US exports" is a full-year 2025 retrospective. It is valid as baseline context but must not be presented alongside fresh monthly data without labeling: "Full-year 2025: +17.2%. Most recent month (January 2026): -6.5%."

---

## Fiscal Health

**Primary measure:** Federal budgetary deficit, fiscal year (PBO or Finance Canada)
**Exact label:** "Federal deficit (FY, PBO est.)" or "Federal deficit (FY, Budget)"
**Source:** PBO Economic and Fiscal Outlook (Tier 1) or Budget/Fall Economic Statement (Tier 4 government, but fiscal documents are higher quality than press releases)
**Comparison window:** Fiscal year (April 1 – March 31). Quarterly data is context.

**Fallback/context measures:**
- General government deficit (federal + provincial + local consolidated) — StatsCan Government Finance Statistics. Must be labeled "general government" not "federal"
- Debt-to-GDP ratio — annual, from PBO or Budget
- Debt servicing costs vs GST revenue — C.D. Howe comparison
- Credit rating actions — event-driven, from rating agencies directly

**What cannot be mixed:**
- Federal-only deficit and general government deficit in the same card without specifying which level
- PBO projections and Budget projections without labeling the source and date of each
- A September 2025 PBO figure as "current" in a March 2026 release without qualifying: "PBO September 2025 baseline; no updated PBO EFO available for this cycle"

**Staleness rule:** PBO projections older than 6 months must be qualified with publication date. If a newer PBO or Budget figure exists, it takes precedence.

---

## Immigration

**Primary measure:** Non-permanent resident stock (total count)
**Exact label:** "Non-permanent residents (StatsCan quarterly est.)"
**Source:** StatsCan Table 17-10-0009-01, Demographic Estimates (The Daily)
**Comparison window:** Quarterly (released ~3 months after reference date)

**Fallback/context measures:**
- Permanent resident admissions target vs actual (IRCC levels plan + operational data)
- Student permit and work permit counts (IRCC open data, monthly)
- Total population change (quarterly, StatsCan)
- IRCC application backlog (IRCC inventory dashboard, monthly)

**What cannot be mixed:**
- StatsCan population estimates (which include non-permanent resident estimates) and IRCC operational counts (which use different definitions and timing)
- Backlog "below 1 million" (headline) without noting that PR backlogs specifically hit a record high (535,300). Composition matters.
- Preliminary quarterly population estimates without noting they are subject to revision (StatsCan's standard caveat)

---

## Housing Supply

**Primary measure:** Housing starts, seasonally adjusted annual rate (SAAR)
**Exact label:** "Housing starts (SAAR, CMHC)"
**Source:** CMHC monthly housing starts release
**Comparison window:** Month-over-month SAAR for trend. Year-over-year actual starts for city-level comparisons.

**Fallback/context measures:**
- CMHC 6-month trend — smoother than monthly SAAR, labeled "CMHC trend"
- Annual actual starts (calendar year total) — for annual comparisons only
- City-level actuals (year-over-year) — labeled "actual starts, YoY"
- BCH pipeline status — manual tracking, labeled "announced / started / completed"
- Federal housing spending trajectory — PBO source

**What cannot be mixed:**
- Monthly SAAR and annual actual totals in the same comparison without labeling
- CMHC trend (-7% for Toronto) and actual starts (-28% for Toronto) without specifying methodology
- "Started" and "announced" for BCH units. Construction commencement is the threshold for "started." A press conference is not.
- Federal housing spending figures from Budget without noting the 56% decline trajectory to 2028-29

**Stage labels (mandatory for all housing actions):**
| Stage | Meaning | Example |
|---|---|---|
| Announced | Press release or speech | Ontario $8.8B partnership |
| Introduced | Bill at first reading | Bill C-26 (March 26) |
| Passed | Royal Assent | Bill C-15 (March 26) |
| Authorized | Treasury Board / Estimates | — |
| Disbursing | Funds flowing to recipients | — |
| Delivering | Units under construction | — |
| Completed | Units occupied | — |

---

*Measure Selection Rules v1.0 — April 2026*
*Apply to every monthly cycle. When in doubt, use the primary measure.*
