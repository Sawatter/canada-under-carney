# Climate & Environment — ECCC 2026-27 Departmental Plan + Climate Competitiveness Strategy Read

**Purpose:** Answer the three questions flagged in `docs/Source-To-Trigger-Pass-2026-05-25.md` for the Climate & Environment dimension:
1. Does the 2026-27 ECCC Departmental Plan show budget restoration vs the cumulative cuts currently captured in the dashboard?
2. Does the Climate Competitiveness Strategy (named Budget 2025 cornerstone) commit funded measures sufficient to count as a "replacement climate strategy with funded measures" per the up-trigger language?
3. What is the current status of the oil-and-gas emissions cap (the dashboard currently captures this as "Suspended")?

**Run date:** 2026-05-25
**Dashboard state when run:** v5.72 / commit `6bd370e`
**Method:** Targeted web searches against canada.ca (ECCC Departmental Plans, news releases), Climate Action Tracker, Canadian Climate Institute, and Budget 2025 analysis (Lexology, Bennett Jones, Torys, Clean Energy Canada). Direct WebFetch to canada.ca pages returned HTTP 403 (canada.ca blocks the WebFetch user-agent); evidence quoted below comes from search snippets and accessible third-party analysis.
**Scope discipline:** Documentation pass. No grade, threshold, GPA-formula, POCKETBOOK_DIMS, or dimensions.json data changes.

---

## Q1 — ECCC budget restored?

**Answer: NO. Budget is NOT restored; reductions continue through 2028-29.**

**Evidence:**
- **2026-27 ECCC planned spending:** $1,711,705,773 (~$1.71B) total (including internal services). Total planned FTEs: 7,868.
- **Forward-year FTE trajectory:** "spending reductions will involve a decrease of approximately 837 full-time equivalents by 2028-29" — a continued downward slope, not restoration.
- **Comparison baseline:** Specific 2025-26 numbers were not retrievable in this pass (the at-a-glance page returned 403). Dashboard's current Climate metric ("ECCC budget cuts (to 2030)") captures the cumulative cut narrative correctly; the 2026-27 plan does not reverse it.

**Sources:**
- [ECCC 2026-27 Departmental Plan](https://www.canada.ca/en/environment-climate-change/corporate/transparency/priorities-management/departmental-plans/2026-2027.html) — direct fetch returned 403; figures from search snippet
- [ECCC 2025-26 Departmental Plan at a glance](https://www.canada.ca/en/environment-climate-change/corporate/transparency/priorities-management/departmental-plans/2025-2026/dp-at-glance.html) — currently cited in dimensions.json

**Classification:** Up-trigger 2 ("ECCC budget restored") **NOT FIRED.**

---

## Q2 — Climate Competitiveness Strategy = "replacement strategy with funded measures"?

**Answer: ARGUABLY FIRED under a literal reading. Editor methodology call required on what threshold the trigger expects.**

**Evidence — the Climate Competitiveness Strategy IS published and IS the named replacement framework:**
- Named in Budget 2025 (November 4, 2025) as the cornerstone of Canada's climate-economy plan.
- ECCC publicly outlined it via the November 2025 [Ministers Dabrusin and Hodgson announcement](https://www.canada.ca/en/environment-climate-change/news/2025/11/ministers-dabrusin-and-hodgson-outline-budget-2025s-new-climate-competitiveness-strategy.html).
- Referenced as a coordinating framework in subsequent federal communications (e.g., the December 2025 [federal benchmark discussion paper](https://www.canada.ca/en/environment-climate-change/corporate/transparency/consultations/comment-driving-effective-carbon-markets/discussion-paper.html) and the [Spring Economic Update 2026 Chapter 1](https://budget.canada.ca/update-miseajour/2026/report-rapport/chap1-en.html)).
- Climate Action Tracker explicitly notes the Strategy postdates their analysis ("Our analysis was published before the release of Canada's Climate Competitiveness Strategy and the Canada-Alberta Memorandum of Understanding") and remains to be integrated into formal projection assessment.

**Evidence — funded measures attached to the Strategy:**
- **Critical Minerals — over $2B over 5 years** through a new Critical Minerals Sovereign Fund, the First and Last Mile Fund, and expanded eligibility for the Critical Mineral Exploration Tax Credit
- **First and Last Mile Fund — $371.8M over 4 years** starting 2026-27 (already in fiscal pipeline)
- **15% Clean Electricity Investment Tax Credit** — covers 15% of capital costs for eligible low-emitting generation, storage, and interjurisdictional transmission
- **30% Clean Technology Manufacturing Investment Tax Credit** — expanded list of eligible critical minerals (bismuth, cesium, chromium, fluorspar, germanium, indium, manganese, molybdenum, niobium, tantalum, tin, tungsten)
- **Methane regulations (December 2025)** — projected 75% cut in oil-and-gas methane emissions by 2035; $36.3B in climate-related damages prevented through 2040
- **Methane reduction tech funding** — ~$16M
- **Federal benchmark carbon pricing review** — Dec 19, 2025 discussion paper, Jan 30, 2026 close, updated benchmark expected later in 2026
- **Sustainable investment taxonomy** — federal-government supported, targeted for 2026 (defines "green" vs "transition" investments)
- **Catalytic ambition** — Budget 2025 frames the Strategy as catalysing over $1 trillion in investment over 5 years in nuclear, hydro, wind, storage, and grid infrastructure

**Evidence — what the Strategy DOES NOT do:**
- Does NOT restore the consumer carbon price (eliminated April 2025).
- Does NOT preserve the oil-and-gas emissions cap (see Q3).
- Does NOT close the projection gap to the 2030 target: current-policy projection shows ~21% reduction below 2005 by 2030, vs the 40-45% target. Prime Minister Carney has publicly admitted Canada will miss both the 2030 and 2035 targets.
- Does NOT restore ECCC operational budget (see Q1).

**Editor methodology question:** The up-trigger text is "Replacement climate strategy **published with funded measures**." The literal read is the test the trigger sets. Two reasonable interpretations:

| Interpretation | Trigger status | Reasoning |
|---|---|---|
| **A — Literal (any meaningful funded measures attached)** | **FIRES** | $2B+ critical minerals + ITCs + methane regs + carbon pricing review + taxonomy = a substantive funded package. Strategy is published, named, and operational. |
| **B — Stringent (funded sufficient to close target gap)** | NOT FIRED | Strategy does not move projection from ~21% toward 40-45%. Carney himself admits miss. ECCC budget continues to shrink. |

The trigger as written does not specify gap-closure sufficiency; it specifies "with funded measures." Under the written language, **Interpretation A is the more defensible literal read.**

Recommended editor action: explicitly publish the interpretation under a `judgmentDetail` note on the Climate dimension. If Interpretation A is adopted, document the funded-measure threshold so future passes apply the same rule consistently. If Interpretation B is adopted, amend the trigger text to read "with funded measures sufficient to close the projection gap" so the test is legible.

**Classification:** Up-trigger 1 ("Replacement climate strategy published with funded measures") **ARGUABLY FIRED** pending editor methodology call.

---

## Q3 — Oil-and-gas emissions cap status

**Answer: SCRAPPED, not suspended. Dashboard captures this as "Suspended" — language is now stale.**

**Evidence:**
- The proposed Oil and Gas Sector Greenhouse Gas Emissions Cap Regulations were announced November 4, 2024.
- Final regulations were never implemented.
- The November 2025 Carney–Smith MOU (already in dashboard milestones as "Alberta pipeline MOU; Guilbeault resigns cabinet") included dropping the proposed cap.
- The Government of Canada concluded that "effective" carbon pricing, enhanced methane regulations, and carbon capture deployment "would create the circumstances whereby the oil and gas emissions cap would no longer be required."
- Multiple sources confirm elimination, not pause: [Argus](https://www.argusmedia.com/en/news-and-insights/latest-market-news/2750001-canada-set-to-scrap-oil-and-gas-emissions-cap), [CBC](https://www.cbc.ca/news/politics/oil-and-gas-cap-budget-9.6966588), [Business & Human Rights Resource Centre](https://www.business-humanrights.org/en/latest-news/canada-federal-government-considers-scrapping-emissions-cap-on-the-oil-and-gas-sector-as-part-of-climate-competitiveness-strategy/).

**Implication for the dashboard:** The "Suspended" labelling in the Climate metric for oil-and-gas emissions cap should be updated to "Scrapped" or "Eliminated" in the June cycle to keep the metric language honest. This is a description correction, not a grade move.

**Grade-move implication:** None directly. The cap was already cited as part of the policy-rollback narrative supporting the D grade. Updating the label keeps the metric current.

---

## Roll-up

| Question | Finding | Trigger implication |
|---|---|---|
| Q1: ECCC budget restored? | NO — 837 FTE reduction by 2028-29 | Up-trigger 2 NOT FIRED |
| Q2: Replacement strategy with funded measures? | YES under literal read (multiple $-attached measures); NOT under stringent gap-closure read | Up-trigger 1 ARGUABLY FIRED — editor methodology call needed |
| Q3: Oil-and-gas cap status | Scrapped (not suspended) | Metric language correction only; no grade move |

**Grade-move implications:**
- Climate & Environment is currently **D**.
- If editor adopts Interpretation A (literal): one up-trigger fires (replacement strategy), one up-trigger does not fire (ECCC budget). Mixed signal. Most conservative read is D → D+ candidate. Per Bias-Resistance Protocol, any move requires party-symmetry check.
- If editor adopts Interpretation B (stringent): neither up-trigger fires. Hold at D.
- Recommended posture: document the methodology call before deciding the grade move. The trigger-text ambiguity is the load-bearing question.

## Carry-forward into the June 2026 cycle

1. **Editor methodology decision** on what "funded measures" means in Climate up-trigger 1. Document in `judgmentDetail`. If Interpretation A, weigh whether one-of-two up-triggers firing justifies a D → D+ move on a dimension where the second up-trigger (budget) clearly continues in the wrong direction.
2. **Update oil-and-gas cap metric language** from "Suspended" to "Scrapped" or "Eliminated." Add the Carney–Smith MOU date as the action source.
3. **Refresh ECCC source citation** in Climate dimension from 2025-26 plan to 2026-27 plan as the current authoritative ECCC source.
4. **Add Climate Competitiveness Strategy as a source** in Climate dimension if grade or judgment changes. Use the ECCC Ministers' announcement page as the labeled-source URL.
5. **Pull exact 2025-26 vs 2026-27 ECCC spending** for a clean year-over-year comparison (today's pass was blocked by canada.ca returning 403 to WebFetch). Direct browser pull by editor recommended.

## Authority and scope

This read closes the highest-priority June carry-forward item from `docs/Source-To-Trigger-Pass-2026-05-25.md`. It does not change grades, thresholds, GPA formulas, POCKETBOOK_DIMS, or any data values in `src/data/dimensions.json`. All findings are documentation; grade and metric-language moves require explicit editor approval and party-symmetry check per the Bias-Resistance Protocol.

## Sources

- [ECCC 2026-27 Departmental Plan](https://www.canada.ca/en/environment-climate-change/corporate/transparency/priorities-management/departmental-plans/2026-2027.html)
- [ECCC 2025-26 Departmental Plan at a glance](https://www.canada.ca/en/environment-climate-change/corporate/transparency/priorities-management/departmental-plans/2025-2026/dp-at-glance.html)
- [Ministers Dabrusin and Hodgson outline Budget 2025's new Climate Competitiveness Strategy](https://www.canada.ca/en/environment-climate-change/news/2025/11/ministers-dabrusin-and-hodgson-outline-budget-2025s-new-climate-competitiveness-strategy.html)
- [Budget 2025: Canada's Climate Competitiveness Strategy (Lexology)](https://www.lexology.com/library/detail.aspx?g=85c04dd8-0e1c-4bdb-9927-52f126c5d6e6)
- [Bennett Jones — Climate Competitiveness Strategy analysis](https://www.bennettjones.com/Insights/Blogs/Canadas-Budget-2025-Canadas-Climate-Competitiveness-Strategy)
- [Discussion paper: Driving effective carbon markets in Canada (Dec 2025)](https://www.canada.ca/en/environment-climate-change/corporate/transparency/consultations/comment-driving-effective-carbon-markets/discussion-paper.html)
- [Carbon Credits — Mark Carney admits Canada will miss 2030 and 2035 climate targets](https://carboncredits.com/mark-carney-admits-canada-will-miss-2030-and-2035-climate-targets-as-policy-rollbacks-slow-progress/)
- [Climate Action Tracker — Canada](https://climateactiontracker.org/countries/canada/)
- [Argus — Canada set to scrap oil and gas emissions cap](https://www.argusmedia.com/en/news-and-insights/latest-market-news/2750001-canada-set-to-scrap-oil-and-gas-emissions-cap)
- [CBC — Goodbye oil and gas cap?](https://www.cbc.ca/news/politics/oil-and-gas-cap-budget-9.6966588)
- [Methane regulations announcement, December 2025](https://www.canada.ca/en/environment-climate-change/news/2025/12/government-of-canada-delivers-on-climate-competitiveness-strategy-commitment-to-lower-methane-emissions-from-major-sources.html)

## Version history

- **v1.0 (2026-05-25, v5.73):** Initial read closing the highest-priority Climate carry-forward. Q1 answered NO (budget not restored). Q2 answered ARGUABLY YES under literal trigger-text read, NOT under stringent gap-closure read — editor methodology call required. Q3 answered SCRAPPED (label update needed in June cycle). Zero grade changes.
