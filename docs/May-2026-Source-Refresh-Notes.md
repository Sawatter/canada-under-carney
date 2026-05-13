# May 2026 Source Refresh Notes

**Date:** 2026-05-13
**Scope:** Source refresh, then manual grade-review resolution. No threshold, formula, modifier rule, weighting, or dimension-count change.
**Coverage tier:** Tier 1 availability check plus targeted Tier 2 refresh. Tier 3 source recertification was not run across the full dashboard. Tier 4 deep search was limited to the dimensions touched by this pass.

See also: [Source-Coverage-Ledger-2026-05.md](Source-Coverage-Ledger-2026-05.md).

## What Ran

- Ran `python3 scripts/fetch-data.py`.
- Statistics Canada availability checks completed for the five configured tables: food CPI, labour force, population, housing starts, and trade.
- IRCC availability checks downloaded the four configured open-data CSVs: permanent residents, IMP work permits, TFWP work permits, and study permits.
- Bank of Canada FX API returned the latest CAD/USD observation.
- Generated files landed under `scripts/output/` and remain ignored scratch output.

## What This Pass Did Not Do

- It did not recertify every URL cited across all 11 graded dimensions.
- It did not recertify all 43 promise status sources.
- It did not run one-by-one deep research on every Major Projects cohort project beyond reconciling the official MPO denominator and documented advancement logic.
- It did not check rating-agency pages, Ethics Commissioner reports, think-tank publication feeds, or news sources for every untouched dimension.
- It did not search every source family named on the About page for new publications.

Those gaps are now tracked explicitly in the May source-coverage ledger so future cycles can distinguish a targeted refresh from a full source recertification.

## Clean Updates Applied

- **Approval Signal:** Added four recent approval polls from Abacus Data, Leger, and Angus Reid Institute. The 60-day sample-size-weighted display still rounds to 57% approve, 31% disapprove, net +26.
- **Fiscal Health:** Updated the FY 2025-26 projected deficit to $66.9B from the Spring Economic Update and added PBO's Spring Economic Update assessments as sources. The fiscal material is mixed: the fiscal room is partly spent on new measures, but PBO also says the two fiscal anchors are currently on track.
- **Economic Policy Response:** Updated the labour-market metric to the April 2026 Labour Force Survey: employment little changed month over month, unemployment at 6.9%, and employment down a net 112,000 over the first four months of 2026.
- **Affordability Response:** Updated food-store CPI to March 2026 at 4.4% year over year. April CPI is scheduled for release on 2026-05-19.

## Manual Grade-Review Queue

These were not automatic grade changes. They needed explicit review against the rubric before any movement.

1. **Major Projects:** Resolved 2026-05-13. The official MPO list carries 15 referred projects and separates transformative strategies from the project denominator. The live cohort now counts 15 projects, with documented advancement still 2 of 15 (~13%). Grade holds at C.
2. **Housing Supply:** Resolved 2026-05-13. CMHC March 2026 monthly SAAR was below 240K, but the six-month trend was 248,378. Because CMHC says the trend measure smooths volatile monthly SAAR readings, the dashboard does not treat the single-month dip as firing the down trigger while the trend remains above 240K. Grade holds at D.
3. **Fiscal Health:** Resolved 2026-05-13. PBO's fiscal-anchor assessment moved the file out of D: the Spring Economic Update deficit-to-GDP path is projected to decline from 2.1% to 1.4%, and the operating-balance anchor is projected to be met by 2028-29. The file stops at C because the deficit is still above the B threshold and PBO flags capital-budgeting, interest-burden, and defence-cost caveats.
4. **Affordability Response:** April CPI is not available until 2026-05-19, so this pass intentionally uses March CPI.

## Source Links

- Spring Economic Update 2026: https://budget.canada.ca/update-miseajour/2026/report-rapport/anx1-en.html
- PBO Spring Economic Update assessment: https://www.pbo-dpb.ca/en/publications/NT-2627-001-S--pbo-assessment-spring-economic-update-economic-fiscal-track--evaluation-dpb-mise-jour-economique-printemps-profil-evolution-economique-financiere
- Statistics Canada Labour Force Survey, April 2026: https://www150.statcan.gc.ca/n1/daily-quotidien/260508/dq260508a-eng.htm
- Statistics Canada CPI, March 2026: https://www150.statcan.gc.ca/n1/daily-quotidien/260420/dq260420a-eng.htm
- Major Projects Office: https://www.canada.ca/major-projects-office
