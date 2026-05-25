# Source Recertification - 2026-05-25

**Purpose:** Retrospective May source-health pass after the v5.65-v5.69 source and source-skill work. This checks the current source surface for live links, source-family audit status, exact-source discipline, and May-data freshness candidates.

**Scope:** Current `src/data/dimensions.json` at v5.69/v5.70. This is not a June grade cycle and does not rewrite the original May 13 source ledger.

**Rules applied:**
- No grade changes.
- No threshold changes.
- No GPA formula or weighting changes.
- Broken source links may be replaced with equivalent exact live sources.
- Newer data is logged as a June-cycle candidate, not silently folded into May grades.

## Room and Task Map

The project-room pass identified this as an effort and coordination task: the hard part was checking all source surfaces and separating link health from grade-moving freshness.

Primary source-of-truth files:
- `src/data/dimensions.json`
- `scripts/fetch-data.py`
- `scripts/audit-bias-resistance.mjs`
- `docs/Bias-Resistance-Protocol.md`
- `docs/Source-To-Trigger-Followup-2026-05-23.md`

## Commands Run

```bash
node scripts/audit-bias-resistance.mjs
python3 scripts/fetch-data.py --link-rot
npm run test:data
```

The second full `python3 scripts/fetch-data.py --link-rot` attempt after fixes hung on slow URL probes, so the final post-fix check used a targeted live check for every URL changed plus a short-timeout all-URL scan across citation surfaces.

## Results

### Bias audit

- Dimensions audited: 12
- Dimensions flagged: 6
- Result: baseline unchanged.

The remaining 6 flags are the known May baseline flags, not new source-family regressions.

### Fetch / freshness signals

The fetch pass found newer data exists for several May-cited data families:

- StatCan Food CPI: April 2026 data released 2026-05-19. June candidate for Affordability Response.
- StatCan population estimates: 2026 Q1 data exists. June candidate for Immigration.
- StatCan / CMHC housing starts: April 2026 data released 2026-05-19. June candidate for Housing Supply.
- StatCan trade: March 2026 table data exists. June candidate for Defence & Trade trade metrics.
- PBO RSS: 17 recent items not yet cited. The May 4 fuel-excise-tax note is especially relevant to the Affordability gas-tax trigger.
- Approval polling RSS: new Abacus and Angus Reid items surfaced. These are June Approval Signal candidates.

No grade or metric value was changed in this pass.

### Link health before fixes

The first full link-rot scan checked 106 cited URLs:

- Live: 95
- Broken: 7
- Blocked: 4
- Errors: 0

Broken or stale URLs included IRCC Open Data `/en/` dataset paths, a generic Maytree research page, generic Conference Board insights pages, The Narwhal climate rollback page, and two ECCC climate-promise URLs.

### Source fixes made

These replacements were made in `src/data/dimensions.json`:

| Area | Old issue | Replacement |
|---|---|---|
| Economic Policy Response | Generic / stale Conference Board insights URL | Signal49 business-investment outlook |
| Affordability Response | Generic / stale Conference Board insights URL | Signal49 CPI-growth analysis |
| Immigration | Broken Open Canada `/en/` dataset paths | Live Open Canada dataset paths without `/en/` |
| Immigration | Generic Maytree policy listing page | Exact Maytree refugee-shelter publication already threaded as challenge evidence |
| Promise Delivery | Broken Narwhal climate rollback article | Live Narwhal Carney climate-change explainer |
| Promise Delivery | Broken ECCC emissions-cap news URL | Live ECCC oil-and-gas cap regulatory-framework page |
| Promise Delivery | Broken ECCC clean-vehicles service URL | Live ECCC Electric Vehicle Availability Standard backgrounder |

Targeted post-fix checks returned HTTP 200 for all replacement URLs.

## Remaining Link-Health Notes

The short all-URL scan checked 240 URL rows / 109 unique URLs and returned:

- Live: 90
- Blocked: 5
- Error / timeout: 14

These are not all confirmed broken. Several were known institutional sites that loaded in the earlier full scan or are common shell-probe blockers (StatCan, Canada.ca, Ethics Commissioner PDFs, IISD, OECD, IMF). Treat them as browser-check candidates during the June cycle, not as immediate replacements.

Known blocked / manual-browser-check candidates:
- Retail Council grocery page
- IISD carbon-pricing and 2030-target pages
- OECD Economic Surveys: Canada 2025
- IMF Article IV page

## June Carry-Forward

For the June cycle, evaluate:

1. April 2026 Food CPI against Affordability Response.
2. April 2026 housing starts against Housing Supply.
3. March 2026 trade data against Defence & Trade.
4. 2026 Q1 population data against Immigration.
5. PBO fuel-excise-tax note against the Affordability gas-tax trigger.
6. New approval polling releases for the Approval Signal window.
7. Browser-check blocked institutional URLs before replacing them.

## Bottom Line

The current source surface is healthier after the URL cleanup. The source-family audit remains at the expected May baseline. The fetch pass surfaced real June-cycle data candidates, but this pass did not change grades, thresholds, GPA math, or metric values.
