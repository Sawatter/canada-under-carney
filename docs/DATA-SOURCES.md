# Data Sources

> **Status (2026-04-19):** This file is a monitoring and source-guide document. The **canonical per-source-family characterization** (institution type, ownership/funding, editorial independence, tier, best-use boundary) now lives in the [Source Characterization Register](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Source-Characterization-Register.md). Portions of the lean-based taxonomy and source lists below are out of sync with the live stack in [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json) and are being realigned to point at the SCR and the live source families actually in use. Treat the SCR as authoritative where the two documents disagree.

Every metric in the dashboard is mapped to a specific source. This document lists them all, organized by type and political lean.

---

## Monthly Source Monitoring Stack (20 sources)

### Official & Non-Partisan Backbone (check on release dates)

| # | Source | Best for | Frequency |
|---|--------|----------|-----------|
| 1 | **Statistics Canada** | GDP, productivity, CPI, labour, trade, population | Monthly releases |
| 2 | **PBO** (Parliamentary Budget Officer) | Fiscal health, costing, promise realism | Monthly/periodic |
| 3 | **CMHC** | Housing starts, completions, supply forecasts | Monthly |
| 4 | **Bank of Canada** | Inflation, rates, macro context | Monthly |
| 5 | **IRCC** | Immigration flows, permits, category changes | Monthly |
| 6 | **PMO + Finance Canada** | Announcements, budget updates, new commitments | Weekly skim |

### Centre & Mainstream Press (weekly skim)

| # | Source | Lean | Best for |
|---|--------|------|----------|
| 7 | **CBC News** | Centre / centre-left | Broad federal coverage, policy rollout, accountability |
| 8 | **Globe and Mail** | Centre / centre-right | Fiscal, business, federal politics, major projects |
| 9 | **La Presse** | Quebec mainstream | Quebec reaction, federal legitimacy, energy/language politics |
| 10 | **Toronto Star** | Centre-left | Affordability, housing, social policy, urban perspective |

### Right & Centre-Right Interpretation (weekly skim, monthly deep read)

| # | Source | Lean | Best for |
|---|--------|------|----------|
| 11 | **C.D. Howe Institute** | Centre-right fiscal | Fiscal, productivity, housing, tax, institutional reform |
| 12 | **The Hub** | Centre-right policy | Federal strategy, political economy, elite debate |
| 13 | **National Post** | Right | Scrutiny of reversals, carbon, ethics, politics |

### Independent Policy & Academic (monthly)

| # | Source | Lean | Best for |
|---|--------|------|----------|
| 14 | **Policy Options / IRPP** | Independent policy | Cross-file synthesis, institutions, federalism, implementation |
| 15 | **The Conversation Canada** | Academic explainer | Issue briefs, context, researcher analysis |
| 16 | **IFSD** (Institute of Fiscal Studies and Democracy) | Non-partisan institutional | Fiscal health, budget credibility, state capacity |
| 17 | **Canadian Climate Institute** | Non-partisan climate policy | Climate, carbon, competitiveness, transition trade-offs |

### Specialist Supplements (check when relevant file moves)

| # | Source | Lean | Check when |
|---|--------|------|------------|
| 18 | **Canada's National Observer** | Centre-left environmental | Climate or energy file moves |
| 19 | **The Narwhal** | Environmental / left | Environment, projects, land use, Indigenous dimension |
| 20 | **One pollster + one bank economist** | Non-partisan | Use Nanos or Leger for political durability; RBC or BMO Economics for macro |

### Left-Leaning Supplements (check when relevant)

| Source | Lean | Check when |
|--------|------|------------|
| **CCPA** | Left | Affordability, inequality, social programs |
| **The Tyee** | Left / BC | Housing or BC-specific developments |
| **Broadbent Institute** | Social democratic | Affordability, labour, inequality data |
| **Parkland Institute** | Alberta left | Energy policy, Alberta-specific |

---

## Source Balance Assessment

| Lean | Monthly Core | Supplements | Total |
|------|-------------|-------------|-------|
| Official / non-partisan | 6 | — | 6 |
| Centre | 4 | — | 4 |
| Right / centre-right | 3 | — | 3 |
| Left / centre-left | 1 (Star) | 4 (CCPA, Narwhal, Observer, Tyee) | 5 |
| Independent policy / academic | 4 | — | 4 |
| Polling + bank econ | 2 | — | 2 |

**Design principle:** Balance is achieved through *function*, not ideology alone. Every perspective has at least one voice in the monthly core. The official/academic backbone ensures the interpretive layer cannot skew the underlying data.

---

## Automated Data APIs

| Metric | Source | Table/Endpoint | Frequency | URL |
|--------|--------|---------------|-----------|-----|
| Food CPI | Statistics Canada | 18-10-0004-01 | Monthly | [Link](https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1810000401) |
| Employment/Unemployment | Statistics Canada | 14-10-0287-01 | Monthly | [Link](https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1410028701) |
| Population estimates | Statistics Canada | 17-10-0009-01 | Quarterly | [Link](https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1710000901) |
| Housing starts | CMHC via StatCan | 34-10-0158-01 | Monthly | [Link](https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=3410015801) |
| Trade by country | Statistics Canada | 12-10-0176-01 | Monthly | [Link](https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1210017601) |
| GDP per capita | Statistics Canada | 36-10-0104-01 | Quarterly | [Link](https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=3610010401) |
| R&D spending | Statistics Canada | 27-10-0273-01 | Annual | [Link](https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=2710027301) |
| PR admissions | IRCC Open Data | Monthly CSV | Monthly | [Link](https://open.canada.ca/data/en/dataset/f7e5498e-0ad8-4417-85c9-9b8aff9b9eda) |
| Work permits | IRCC Open Data | Monthly CSV | Monthly | [Link](https://open.canada.ca/data/en/dataset/360024f2-17e9-4558-bfc1-3616485d65b9) |
| Study permits | IRCC Open Data | Monthly CSV | Monthly | [Link](https://open.canada.ca/data/en/dataset/90115b00-f9b8-49e8-afa3-b4cff8facaee) |
| Exchange rate | Bank of Canada | Valet API | Daily | [Link](https://www.bankofcanada.ca/valet/observations/FXCADUSD/json?recent=1) |
| Military spending % GDP | World Bank | MS.MIL.XPND.GD.ZS | Annual | [Link](https://api.worldbank.org/v2/country/CAN/indicator/MS.MIL.XPND.GD.ZS?format=json&date=2020:2026) |

## Semi-Automatable Sources

| Metric | Source | Format | Frequency |
|--------|--------|--------|-----------|
| Federal deficit/debt | Dept of Finance Fiscal Monitor | HTML/PDF | Monthly |
| PBO fiscal outlook | PBO | PDF + Excel | 2-3x/year |
| CMHC housing need estimate | CMHC | PDF reports | Annual |
| Build Canada Homes units | Housing Infrastructure Canada | Web | Periodic |
| GHG emissions | ECCC Open Data | CSV/XLSX | Annual |
| ECCC budget | GC InfoBase | GitHub data | Annual |
| Bills passed | LEGISinfo | Web | Ongoing |
| Climate policy analysis | Canadian Climate Institute | PDF/web | Quarterly |
| Fiscal institutional analysis | IFSD | PDF/web | Periodic |

## Manual Only

| Metric | Source | Frequency | Notes |
|--------|--------|-----------|-------|
| Fitch/Moody's/S&P ratings | Agency websites | Event-driven | Changes are rare |
| Ethics Commissioner review | Office of Ethics Commissioner | Event-driven | ciec-ccie.parl.gc.ca |
| Carney approval ratings | Angus Reid, Leger, Nanos, Abacus | Monthly | No API |
| OBPS carbon price | ECCC legislated schedule | Annual | $95/t in 2025, +$15/year |
| Food insecurity | PROOF (U of T) | Annual | proof.utoronto.ca |
| Dalhousie food cost | Canada Food Price Report | Annual | dal.ca/agri-food |
| All grades | Editorial judgment per rubric | Monthly | Always human decision |
| All trend arrows | Editorial judgment | Monthly | Always human decision |
| All status summaries | Editorial judgment | Monthly | Always human decision |
| All promise statuses | Editorial judgment | Monthly | Always human decision |
