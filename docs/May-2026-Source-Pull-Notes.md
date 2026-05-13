# May 2026 Source Pull Notes

**Date:** 2026-05-13
**Scope:** Source refresh and metric updates only. No grade, threshold, formula, modifier, weighting, promise-status, or dimension-count change.

## What Ran

- Ran `python3 scripts/fetch-data.py`.
- Statistics Canada table checks completed for food CPI, labour force, population, housing starts, and trade.
- IRCC open-data CSVs downloaded successfully for permanent residents, IMP work permits, TFWP work permits, and study permits.
- Bank of Canada FX API returned the latest CAD/USD observation.
- Generated files landed under `scripts/output/` and remain ignored scratch output.

## Clean Updates Applied

- **Approval Signal:** Added four recent approval polls from Abacus Data, Leger, and Angus Reid Institute. The 60-day sample-size-weighted display still rounds to 57% approve, 31% disapprove, net +26.
- **Fiscal Health:** Updated the FY 2025-26 projected deficit to $66.9B from the Spring Economic Update and added PBO's Spring Economic Update assessment as a source. The source update notes that PBO still sees most later fiscal room offset by new measures.
- **Economic Policy Response:** Updated the labour-market metric to the April 2026 Labour Force Survey: employment little changed month over month, unemployment at 6.9%, and employment down a net 112,000 over the first four months of 2026.
- **Affordability Response:** Updated food-store CPI to March 2026 at 4.4% year over year. April CPI is scheduled for release on 2026-05-19.

## Manual Grade-Review Queue

These are not automatic grade changes. They need explicit review against the rubric before any movement.

1. **Major Projects:** The Major Projects Office public page now describes 15 projects and 6 transformative strategies. The live dashboard currently tracks a 16-project cohort. Reconcile the public map/list with the live cohort before changing cohort counts, project stages, or the grade.
2. **Housing Supply:** CMHC March 2026 housing starts need a trigger-basis check. The monthly SAAR appears below 240K while the six-month trend remains above 240K. Decide whether the trigger reads actual annual starts, monthly SAAR, or trend before using it.
3. **Fiscal Health:** The near-term deficit projection improved from Budget 2025, but PBO says later fiscal room is mostly offset. Review the band call, but do not treat the headline deficit improvement alone as a grade move.
4. **Affordability Response:** April CPI is not available until 2026-05-19, so this pass intentionally uses March CPI.

## Source Links

- Spring Economic Update 2026: https://budget.canada.ca/update-miseajour/2026/report-rapport/anx1-en.html
- PBO Spring Economic Update assessment: https://www.pbo-dpb.ca/en/publications/NT-2627-001-S--pbo-assessment-spring-economic-update-economic-fiscal-track--evaluation-dpb-mise-jour-economique-printemps-profil-evolution-economique-financiere
- Statistics Canada Labour Force Survey, April 2026: https://www150.statcan.gc.ca/n1/daily-quotidien/260508/dq260508a-eng.htm
- Statistics Canada CPI, March 2026: https://www150.statcan.gc.ca/n1/daily-quotidien/260420/dq260420a-eng.htm
- Major Projects Office: https://www.canada.ca/major-projects-office
