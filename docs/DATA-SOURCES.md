# Data Sources

> **Status (2026-07-02):** This file is a monitoring and source-guide document. The **canonical per-source-family characterization** (institution type, ownership/funding, editorial independence, tier, best-use boundary) lives in the [Source Characterization Register](Source-Characterization-Register.md). Counts below were recomputed 2026-07-02 from the live data files using `scripts/source-ledger-utils.mjs` (the same extraction the ledger check uses). Content reflects the live stack in [src/data/dimensions.json](../src/data/dimensions.json) and distinguishes live sources from the monitoring watchlist. Treat the SCR as authoritative for per-source characterization. The July 2026 doc-sync backfilled the 10 `sources[]` families the full-source recertification found missing; remaining August register candidates are named below.

Every metric in the live dashboard is sourced to a specific citation in [src/data/dimensions.json](../src/data/dimensions.json). This file describes the monitoring and source-guide stack that sits around that live use: which families are currently cited in the live `sources` arrays, which are supplementary monitoring sources that may be consulted when a file moves, and which data pipelines feed specific metrics.

For the canonical per-source-family characterization (institution type, ownership / funding, editorial independence, tier, best-use boundary, grounded ideological tendency where sourced), see [docs/Source-Characterization-Register.md](Source-Characterization-Register.md). This file does not duplicate that record.

---

## Live source stack (currently cited in dimensions.json)

Grouped by institution type. See SCR for per-family detail and trust flags. As of 2026-07-02 (dashboard v5.152), machine extraction finds **153 unique cited URLs across 322 citation surfaces and 54 distinct domains** in [dimensions.json](../src/data/dimensions.json) plus the Approval Signal poll data. The SCR now registers 40 graded-dimension source families, including the 10 families backfilled after the July recertification. The enumeration below also names remaining entrants the August register update should cover, marked *(not yet in SCR)*.

### Official / administrative / institutional

- **Official statistics & Officers of Parliament:** Statistics Canada, Parliamentary Budget Officer (PBO), CMHC, Bank of Canada
- **Federal departmental data & communications:** Environment and Climate Change Canada (ECCC), Immigration, Refugees and Citizenship Canada (IRCC), Finance Canada, Natural Resources Canada (NRCan), Global Affairs Canada, Innovation, Science and Economic Development Canada (ISED), Treasury Board Secretariat, Canada Revenue Agency, Housing Infrastructure Canada, Privy Council Office (Major Projects Office and the internal-trade file)
- **Other federal institutional:** Office of the Ethics Commissioner (including the public declarations registry), Office of the Auditor General, Canada Energy Regulator
- **International official:** NATO, OECD, IMF
- **Parliamentary / legislative record:** Parliament of Canada / LEGISinfo, House of Commons committee reports (ETHI)
- **Context-only government communications (Tier 4):** Prime Minister's Office (pm.gc.ca) - never moves a grade alone per QA Rule 1
- **Promise-record only:** Justice Laws consolidated statutes (laws-lois.justice.gc.ca) and Transport Canada appear only on promise original/status links, not in `sources[]` arrays

The federal entrants that are visible in the July live stack but still need fuller SCR treatment (ISED, Treasury Board Secretariat, Canada Revenue Agency, Housing Infrastructure Canada, Privy Council Office / MPO, Office of the Auditor General, House committee reports) are queued for SCR registration in the August cycle.

### Non-official

- **Public broadcaster:** CBC / Radio-Canada *(federally chartered Crown corporation; statutory editorial independence under the Broadcasting Act)*
- **Mainstream newspaper:** The Globe and Mail
- **Independent research policy institutes:** C.D. Howe Institute, IRPP / Policy Options, IISD, Canadian Climate Institute *(federally arm's-length; ECCC is a major federal funder - see SCR entry 18 for disclosure)*
- **Market-oriented policy institutes:** Fraser Institute, Macdonald-Laurier Institute
- **Nonprofit policy commentary platform:** The Hub *(right-of-centre orientation; see SCR entry 23)*
- **Watchdog / advocacy:** Democracy Watch *(advocacy organization, not neutral research)*, Transparency International Canada *(not yet in SCR)*
- **Issue-focused nonprofit journalism:** The Narwhal, Canada's National Observer
- **Academic / economic research:** Dalhousie Agri-Food Analytics Lab, PROOF (University of Toronto), The Conversation Canada, Centre for the Study of Living Standards (CSLS)
- **Nonprofit social-policy research:** Maytree
- **Private research firm:** Signal49 Research
- **Bank economics:** Scotiabank Economics *(moved from the watchlist; cited on Housing Supply)*
- **Industry associations:** Canadian Home Builders' Association (CHBA), Retail Council of Canada
- **Sector nonprofit:** Food Banks Canada (Hunger Count)
- **Industry code office:** Office of the Grocery Sector Code of Conduct (canadacode.org)
- **Polling (dimension stack):** Angus Reid
- **Party platform (promise wording baseline):** Liberal Party of Canada 2025 platform (Canada Strong) - promise-text provenance in the Promise Delivery tracker, not grade evidence
- **Promise-record only journalism:** CKOM (Saskatoon radio news) and Electric Autonomy Canada appear only on promise status links, not in `sources[]` arrays

### Approval Signal source stack (outside dimensions.json and outside the scores)

The ungraded Approval Signal uses pollster data from `src/data/approval-polls.json`, not the graded dimension `sources` arrays. Current included approval pollsters: Léger, Abacus Data, Ipsos, Angus Reid Institute, and Innovative Research Group. Nanos preferred-PM is shown as secondary context only and is not averaged into the approval mean. Some earlier waves cite Wikipedia's 46th-federal-election opinion-polling aggregation page as the public pointer where no direct pollster release is linked; the included pollster set is unchanged by this. Research Co.'s June 2026 public pair remains excluded because it is a tariff-handling approval question rather than a broad PM/government job-approval item; see [v2-Decision-Memo-Approval-Signal.md](v2-Decision-Memo-Approval-Signal.md) for the construct boundary.

---

## Monitoring watchlist (not currently live in dimensions.json)

Families that may be consulted when a file moves, but do not currently carry a live citation in a `sources` array. Introducing any of these into the live stack requires a reflection + review pass per the hard source-edit rule in [docs/Parking-Lot.md](Parking-Lot.md) (traceability fix = direct; new analytical source family = reflect + Claude review first).

- **Mainstream reporting:** La Presse, Toronto Star, National Post
- **Other polling firms:** Pollara, Mainstreet, EKOS, Spark Insights (approval signal watchlist); Nanos remains preferred-PM context only
- **Bank economics:** RBC Economics, BMO Economics, TD Economics *(Scotiabank Economics moved to the live stack; see Housing Supply)*
- **Policy and fiscal institutes:** IFSD (Institute of Fiscal Studies and Democracy — referenced narratively in Fiscal Health rationale but not currently in the live `sources` array)
- **Left-oriented policy organizations:** CCPA, Broadbent Institute, Parkland Institute, The Tyee
- **Rating agencies:** Fitch, Moody's, S&P (event-driven)

Inclusion here is not an endorsement; it is a record of families that have been discussed as potential future additions, appeared in earlier drafts, or are consulted as context. The live `sources` arrays in [dimensions.json](../src/data/dimensions.json) are the authority on what is actually in use.

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
| Carney approval ratings | `src/data/approval-polls.json` (Léger, Abacus Data, Ipsos, Angus Reid Institute, Innovative Research Group); Nanos preferred-PM context | Monthly | No API |
| OBPS carbon price | ECCC legislated schedule | Annual | $95/t in 2026; trajectory to $115 by 2030 |
| Food insecurity | PROOF (U of T) | Annual | proof.utoronto.ca |
| Dalhousie food cost | Canada Food Price Report | Annual | dal.ca/agri-food |
| All grades | Editorial judgment per rubric | Monthly | Always human decision |
| All trend arrows | Editorial judgment | Monthly | Always human decision |
| All status summaries | Editorial judgment | Monthly | Always human decision |
| All promise statuses | Editorial judgment | Monthly | Always human decision |
