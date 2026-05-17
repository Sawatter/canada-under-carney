# Source Protocol Dry-Run Cross-Check - 2026-05

**Purpose:** Record the independent cross-check of the May 2026 source-protocol dry run before the June 2026 monthly cycle. This is a validation note only. It does not change grades, sources, or June ledger row statuses.

**Date checked:** 2026-05-17

**Inputs checked:**
- Claude dry-run report: fetch script + link-rot scan + bias-resistance audit.
- Codex / ChatGPT-side independent source checks from this session.
- Current `main` `src/data/dimensions.json` from GitHub raw.

## Verdict

**Partly verified, with discrepancies.**

The PBO feed signal, Immigration PBO source threading, three broken URLs, CBC Wayback availability, and the bias-resistance audit residual count are independently supported. The StatCan freshness flags and network-cleared claim could not be verified from this network. The two CBC link-rot flags were refuted from this network because both CBC URLs loaded live with HTTP 200.

## Confirmed

| Claim | Result | Notes |
|---|---|---|
| PBO feed works | Confirmed | Project feed is `https://www.pbo-dpb.ca/en/feed.xml`. The alternate `/en/publications/rss` URL returns 404 and should not be used in prompts. |
| PBO feed has 16 recent items not exact-URL cited in `dimensions.json` | Confirmed | Latest 20 feed items: 16 were not exact-URL cited. This does not imply they should be cited. |
| Immigration first metric has PBO Demographic Implications `sourceRefs` | Confirmed | `PR target (2026-2028)` includes the PBO Demographic Implications URL added in v5.28. |
| Bias-resistance audit residual count has not regressed | Confirmed | `node scripts/audit-bias-resistance.mjs` reported 12 dimensions audited, 7 flagged. |
| Narwhal climate rollback URL returns 404 | Confirmed | `https://thenarwhal.ca/carney-climate-rollback-oil-gas-industry/` returned 404. |
| Canada.ca clean-vehicles URL returns 404 | Confirmed | `https://www.canada.ca/en/environment-climate-change/services/managing-pollution/energy-production/transportation/clean-vehicles.html` returned 404. |
| Canada.ca oil-and-gas framework-regulations URL returns 404 | Confirmed | `https://www.canada.ca/en/environment-climate-change/news/2024/11/federal-government-releases-proposed-framework-regulations-to-reduce-greenhouse-gas-emissions-in-the-canadian-oil-and-gas-sector.html` returned 404. |
| CBC Wayback snapshots exist | Confirmed | Wayback returned available snapshots for both CBC URLs. |

## Not confirmed or disputed

| Claim | Result | Notes |
|---|---|---|
| StatCan WDS network cleared | Not confirmed | `www150.statcan.gc.ca:443` timed out from this network. Cube metadata for product IDs 17100009, 34100158, and 12100176 could not be independently checked here. |
| IRCC open-data CSV network cleared | Not confirmed | `www.ircc.canada.ca:443` timed out from this network during spot-check. |
| Ethics Commissioner investigation-report page network cleared | Not confirmed | `ciec-ccie.parl.gc.ca:443` timed out from this network during spot-check. |
| CBC environment-cuts URL returns 404 | Refuted from this network | `https://www.cbc.ca/radio/whatonearth/environment-canada-cuts-9.7073623` loaded live with HTTP 200. Treat the dry-run 404 as a false positive, transient issue, or user-agent/network-specific result unless reproduced by the project fetch script. |
| CBC Carney financial-assets URL returns 404 | Refuted from this network | `https://www.cbc.ca/news/politics/mark-carney-financial-assets-1.7583443` loaded live with HTTP 200. Treat the dry-run 404 as a false positive, transient issue, or user-agent/network-specific result unless reproduced by the project fetch script. |

## PBO feed top 10 observed

Feed used: `https://www.pbo-dpb.ca/en/feed.xml`

| # | Date | Title |
|---|---|---|
| 1 | 2026-05-15 | IR0926 - FIN |
| 2 | 2026-05-12 | Overview of Certain Federal Government Services in Rural and Urban Areas |
| 3 | 2026-05-07 | The Government's Expenditure Plan and the Main Estimates for 2026-27 |
| 4 | 2026-05-07 | PBO news release for Main Estimates 2026-27 |
| 5 | 2026-05-04 | IR0924 - DND |
| 6 | 2026-05-04 | PBO Assessment of Spring Economic Update: Economic and Fiscal Track |
| 7 | 2026-05-04 | PBO Assessment of Spring Economic Update: Fiscal Anchors and Fiscal Sustainability |
| 8 | 2026-05-04 | PBO Assessment of Spring Economic Update: Government's Major Capital Priorities |
| 9 | 2026-05-04 | PBO Assessment of Spring Economic Update: Departmental Spending and New Measures |
| 10 | 2026-05-04 | PBO Assessment of Spring Economic Update: Temporarily suspending the federal fuel excise tax |

## June-cycle implications

Do not fix sources solely from this dry run. Carry the following into the June 2026 cycle:

1. Treat the three confirmed 404s as candidate link-rot fixes if they still reproduce during the June cycle.
2. Treat the two CBC 404s as disputed. Do not replace them unless the project fetch script reproduces failure or browser access fails during the June cycle.
3. Treat StatCan cube freshness flags as unverified from this cross-check. Confirm them via GitHub Actions, a network that reaches StatCan WDS, or the project fetch script during the June cycle.
4. Treat the PBO 16-not-cited count as a review queue, not a citation requirement.

## Commands / checks used

Representative commands:

```bash
curl -fsSL https://www.pbo-dpb.ca/en/feed.xml -o /tmp/pbo-rss.xml
curl -fsSL https://raw.githubusercontent.com/Sawatter/canada-under-carney/main/src/data/dimensions.json -o /tmp/dimensions-main.json
node scripts/audit-bias-resistance.mjs
curl -L -A 'Mozilla/5.0 source-check' <candidate-url>
curl 'https://archive.org/wayback/available?url=<cbc-url>'
```

Network attempts that timed out from this session:

```bash
curl -H 'Content-Type: application/json' \
  -d '[{"productId":17100009}]' \
  https://www150.statcan.gc.ca/t1/wds/rest/getCubeMetadata

curl -I https://www.ircc.canada.ca/opendata-donneesouvertes/data/ODP-PR-Gender.csv
curl -I https://ciec-ccie.parl.gc.ca/en/investigations-enquetes/Pages/AllInvestRepAct-TousRapEnqLoi.aspx
```

## Status

This dry-run note is complete. The June cycle should still run from `docs/Source-Coverage-Ledger-2026-06.md` and the recurring checklist, not from this note.
