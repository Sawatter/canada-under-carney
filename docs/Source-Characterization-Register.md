# Source Characterization Register

- **Purpose:** Canonical per-source-family record of institution type, ownership/funding, editorial independence, grounded ideological tendency (only where well-sourced), best-use boundary, and strongest SAM-role fit for every source family currently live in [src/data/dimensions.json](../src/data/dimensions.json). Replaces scattered ideological-lean labels with institutional description as the primary characterization.
- **Status:** Active — governance artifact; sits alongside SAM (per-dimension role fit) and QA-Gatekeeping-Rules (admissibility / tier discipline).
- **Last updated:** 2026-04-19
- **Depends on:** [docs/Source-Authority-Map.md](Source-Authority-Map.md), [docs/QA-Gatekeeping-Rules.md](QA-Gatekeeping-Rules.md), [docs/Product-Thesis.md](Product-Thesis.md), [docs/v2/verification/Claude-House-Style.md](v2/verification/Claude-House-Style.md)
- **Used by:** [src/components/About.jsx](../src/components/About.jsx) (Source Balance block), [README.md](../README.md) (Source Balance section), [docs/DATA-SOURCES.md](DATA-SOURCES.md) (monitoring-stack layer), SAM per-dimension Current State Deltas, QA Rule 1 per-source tier assignment.

---

## Positioning

Three governance files overlap on sources but answer different questions:

- **Source Characterization Register (this file) — per-source-family truth.** What each source family *is*: institution type, ownership, governance, editorial independence, grounded ideological tendency (where evidence supports a label), best-use boundary.
- **[Source Authority Map](Source-Authority-Map.md) — per-dimension role fit.** For each dimension's construct, which source roles (measurement / policy / execution / independent-challenge / context) are required and how well the live stack covers them.
- **[QA-Gatekeeping-Rules](QA-Gatekeeping-Rules.md) — admissibility and tier discipline.** The 5-tier system that determines whether a source can move a grade alone, move it with context, corroborate, or serve as context only.

SCR does not assign grades, verify claim entailment, or change scoring logic. It is the reference record the other files cite when they need to know what a source family is.

---

## Scope and family granularity rule

Scope: every source family with at least one live citation in a `sources` array of [src/data/dimensions.json](../src/data/dimensions.json). Families mentioned only in `sourceNote` narrative or in rationale / perspective text, without a threaded URL in a `sources` array, are not registered here.

Granularity rule:
- One entry per distinct institutional entity.
- An entity publishing multiple source types (e.g., ECCC publishes both T1 departmental data and T4 news releases) is **one family**; tier distinctions are handled per-citation, not by splitting the family.
- Sub-entities with distinct research mandates (Dalhousie Agri-Food Analytics Lab within Dalhousie University; PROOF program within University of Toronto) are treated as **their own families**.
- Branded joint labels (IRPP / Policy Options) are **one family**, reflecting the publisher's own convention.
- Citation labels are the surface presentation; families are the underlying institutions.

---

## Category summary

- **Total unique citation labels across all live `sources` arrays:** 57
- **Total source families registered below for graded dimensions:** 30 (15 official / administrative / institutional; 15 non-official)
- **Additional polling families registered for the Approval Signal (outside the GPA):** 5 (Léger, Abacus Data, Ipsos, Angus Reid Institute, Innovative Research Group). See the dedicated *Approval Signal source families* section below and [v2-Decision-Memo-Approval-Signal.md](v2-Decision-Memo-Approval-Signal.md).

| Institution-type category | Count | Families |
|---|---|---|
| Official statistics & Officers of Parliament | 4 | Statistics Canada, PBO, CMHC, Bank of Canada |
| Federal departmental data & communications | 5 | ECCC, IRCC, Finance Canada, NRCan, Global Affairs Canada |
| Other federal institutional | 1 | Office of the Ethics Commissioner |
| International official | 3 | NATO, OECD, IMF |
| Parliamentary / legislative record | 1 | Parliament of Canada / LEGISinfo |
| Context-only government communications | 1 | Prime Minister's Office |
| Public broadcaster | 1 | CBC / Radio-Canada |
| Mainstream newspaper | 1 | The Globe and Mail |
| Independent research policy institutes | 4 | C.D. Howe Institute, IRPP / Policy Options, IISD, Canadian Climate Institute |
| Market-oriented policy institute | 1 | Fraser Institute |
| Nonprofit policy commentary platform | 1 | The Hub |
| Watchdog / advocacy | 1 | Democracy Watch |
| Issue-focused nonprofit journalism | 2 | The Narwhal, Canada's National Observer |
| Academic research | 3 | Dalhousie Agri-Food Analytics, PROOF (U of T), The Conversation Canada |
| Polling (dimensions) | 1 | Angus Reid |
| Polling (Approval Signal, outside GPA) | 5 | Léger, Abacus Data, Ipsos, Angus Reid Institute, Innovative Research Group |

---

## Register entries

### 1. Statistics Canada

- **Live labels:** `StatsCan CPI Feb 2026`, `StatsCan GDP per capita`, `StatsCan LFS Feb 2026`, `StatsCan population Q4 2025`, `StatsCan trade data`
- **Dimensions used:** Affordability Response, Economic Policy Response, Defence & Trade, Immigration
- **Institution type:** Federal statistical agency (agent of the Crown)
- **Ownership / funding:** Government of Canada appropriation
- **Editorial independence / governance:** Legally mandated independence under the Statistics Act; Chief Statistician reports to Parliament; methodologies are published and peer-consulted
- **Grounded ideological tendency:** None; national statistical agency with legislated neutrality
- **Best-use boundary:** Grade-moving (Tier 1)
- **Strongest SAM-role fit:** Measurement truth
- **Trust flags:** None

### 2. Parliamentary Budget Officer (PBO)

- **Live labels:** `PBO — BCH 26,000 units`, `PBO carbon GST revenue`, `PBO fiscal analysis`, `PBO — $94B investment gap`
- **Dimensions used:** Housing Supply, Carbon Pricing Policy, Fiscal Health, Flagship Delivery
- **Institution type:** Officer of Parliament (independent legislative budget office)
- **Ownership / funding:** Parliamentary appropriation
- **Editorial independence / governance:** Statutory independence under the Parliament of Canada Act; reports directly to Parliament; not in the executive chain of command
- **Grounded ideological tendency:** None; non-partisan by mandate
- **Best-use boundary:** Grade-moving (Tier 1)
- **Strongest SAM-role fit:** Independent challenge truth + measurement truth
- **Trust flags:** None

### 3. CMHC (Canada Mortgage and Housing Corporation)

- **Live labels:** `CMHC 2025 starts`
- **Dimensions used:** Housing Supply
- **Institution type:** Federal Crown corporation (housing agency)
- **Ownership / funding:** Federal ownership; revenue from mortgage insurance + parliamentary appropriation for program delivery
- **Editorial independence / governance:** Board of directors appointed by federal government; operational data (starts, completions, market analysis) distinct from programmatic communications
- **Grounded ideological tendency:** None; federal housing agency
- **Best-use boundary:** Grade-moving for operational data (Tier 1); corroborator for programmatic self-reporting
- **Strongest SAM-role fit:** Measurement truth + execution truth
- **Trust flags:** CMHC programmatic reporting on its own programs (e.g., BCH pipeline) should be treated as self-reporting; use operational data independently of program narrative

### 4. Bank of Canada

- **Live labels:** `Bank of Canada wage study`
- **Dimensions used:** Immigration
- **Institution type:** Central bank; Crown corporation with statutory independence
- **Ownership / funding:** Federal Crown; operating revenue from monetary policy operations
- **Editorial independence / governance:** Statutory independence under the Bank of Canada Act; Governor appointed for 7-year term; publishes research and staff discussion papers with methodological disclosure
- **Grounded ideological tendency:** None; central bank with legislated independence
- **Best-use boundary:** Grade-moving (Tier 1)
- **Strongest SAM-role fit:** Measurement truth + independent challenge truth (on macro and wage questions)
- **Trust flags:** None

### 5. Environment and Climate Change Canada (ECCC)

- **Live labels:** `ECCC — Output-Based Pricing System`, `ECCC 2024-25 Departmental plan at a glance`, `ECCC 2025-26 Departmental plan at a glance`
- **Label note:** The live citation labelled `ECCC Arctic science cuts` is hosted on theconversation.com and characterizes ECCC from the outside; its publishing family is The Conversation Canada (see entry 27), not ECCC itself. The label is subject-based rather than publisher-based in the live data.
- **Dimensions used:** Carbon Pricing Policy, Climate & Environment
- **Institution type:** Federal department (executive branch)
- **Ownership / funding:** Government of Canada
- **Editorial independence / governance:** Executive department; departmental plans and statutory programs are public data
- **Grounded ideological tendency:** None as an institution; policy direction reflects the government of the day
- **Best-use boundary:** Grade-moving for published data / departmental plans / statutory programs (Tier 1); context only for news releases and ministerial statements (Tier 4)
- **Strongest SAM-role fit:** Measurement truth + policy truth + execution truth
- **Trust flags:** Distinguish published data and statutory programs (T1) from news releases (T4) on a per-citation basis

### 6. Immigration, Refugees and Citizenship Canada (IRCC)

- **Live labels:** `IRCC 2026-2028 levels plan`
- **Dimensions used:** Immigration
- **Institution type:** Federal department (executive branch)
- **Ownership / funding:** Government of Canada
- **Editorial independence / governance:** Executive department; levels plans are tabled in Parliament; operational data published via open data portal
- **Grounded ideological tendency:** None as an institution
- **Best-use boundary:** Grade-moving for published levels plan + operational data (Tier 1); context only for news releases (Tier 4)
- **Strongest SAM-role fit:** Measurement truth + policy truth + execution truth
- **Trust flags:** Same data-vs-news distinction as ECCC

### 7. Finance Canada

- **Live labels:** `Budget 2025`, `Annual Financial Report FY 2024-25`, `Canada.ca — fuel charge removal`
- **Dimensions used:** Fiscal Health, Carbon Pricing Policy
- **Institution type:** Federal department (executive branch)
- **Ownership / funding:** Government of Canada
- **Editorial independence / governance:** Executive department; budget documents and AFR are audited statutory publications; news releases are political communications
- **Grounded ideological tendency:** None as an institution
- **Best-use boundary:** Grade-moving for Budget annexes / chapters and Annual Financial Report (Tier 1); context only for news releases (Tier 4)
- **Strongest SAM-role fit:** Measurement truth + policy truth
- **Trust flags:** Budget chapters are both policy-announcement and fiscal-data documents; read as policy truth, not as outcome claim

### 8. Natural Resources Canada (NRCan)

- **Live labels:** `NRCan — critical minerals partnerships`
- **Dimensions used:** Economic Policy Response
- **Institution type:** Federal department (executive branch)
- **Ownership / funding:** Government of Canada
- **Editorial independence / governance:** Executive department
- **Grounded ideological tendency:** None
- **Best-use boundary:** Corroborator only in its current live use — the cited URL is a news release (Tier 4 announcement page)
- **Strongest SAM-role fit:** Policy truth (context only in current use)
- **Trust flags:** Live citation is a news release, not operational data. Treat as T4 context per QA Rule 1 unless paired with Treasury Board authorization or disbursement data

### 9. Global Affairs Canada (GAC)

- **Live labels:** `Global Affairs Canada Monthly Trade Report (December 2025)`
- **Dimensions used:** Defence & Trade
- **Institution type:** Federal department (executive branch)
- **Ownership / funding:** Government of Canada
- **Editorial independence / governance:** Executive department; Monthly Trade Report is a data-driven publication based on StatsCan table 12-10-0176-01
- **Grounded ideological tendency:** None
- **Best-use boundary:** Grade-moving for the Monthly Trade Report series (Tier 1, data-driven); ministerial statements would be Tier 4
- **Strongest SAM-role fit:** Measurement truth
- **Trust flags:** None for the current live use

### 10. Office of the Ethics Commissioner

- **Live labels:** `Office of the Ethics Commissioner — registry and reviews`, `PM blind-trust summary statement`, `PM Annex A public declaration of agreed measure`
- **Dimensions used:** Ethics & Transparency
- **Institution type:** Independent officer of Parliament
- **Ownership / funding:** Parliamentary appropriation
- **Editorial independence / governance:** Statutory independence under the Conflict of Interest Act and the Parliament of Canada Act
- **Grounded ideological tendency:** None; statutory independent officer
- **Best-use boundary:** Grade-moving for institutional record (Tier 1 for filings; registry record is primary evidence)
- **Strongest SAM-role fit:** Policy truth + execution truth
- **Trust flags:** Ethics & Transparency is a process construct — quantitative measurement is absent by design; the Commissioner's registry is the institutional anchor

### 11. NATO

- **Live labels:** `NATO Secretary General Annual Report 2025`
- **Dimensions used:** Defence & Trade
- **Institution type:** International intergovernmental military alliance
- **Ownership / funding:** Member-state contributions
- **Editorial independence / governance:** Institutional annual reports are approved through alliance governance
- **Grounded ideological tendency:** None directly relevant; member-state alliance
- **Best-use boundary:** Grade-moving for published NATO defence-spending figures (Tier 1)
- **Strongest SAM-role fit:** Measurement truth + independent challenge truth (third-party confirmation of national spending)
- **Trust flags:** None

### 12. OECD

- **Live labels:** `OECD Economic Surveys: Canada 2025`
- **Dimensions used:** Economic Policy Response
- **Institution type:** International intergovernmental organization
- **Ownership / funding:** Member-state contributions
- **Editorial independence / governance:** Economic Surveys are peer-reviewed by the Economic and Development Review Committee; published methodology
- **Grounded ideological tendency:** None directly; institutional orthodoxy favors market-based reform but assessments are peer-reviewed
- **Best-use boundary:** Grade-moving (Tier 1 or Tier 2 depending on use; Economic Surveys typically treated as Tier 1 for the economic analysis they publish)
- **Strongest SAM-role fit:** Independent challenge truth + measurement truth
- **Trust flags:** None

### 13. IMF

- **Live labels:** `IMF Article IV (Jan 2026)`
- **Dimensions used:** Fiscal Health
- **Institution type:** International intergovernmental financial institution
- **Ownership / funding:** Member-state quota contributions
- **Editorial independence / governance:** Article IV consultations follow published surveillance methodology; staff reports are reviewed by the Executive Board
- **Grounded ideological tendency:** Institutional orthodoxy typically favors fiscal prudence and market-based policy; assessments are staff-authored and board-reviewed
- **Best-use boundary:** Grade-moving (Tier 1)
- **Strongest SAM-role fit:** Independent challenge truth + measurement truth
- **Trust flags:** None

### 14. Parliament of Canada / LEGISinfo

- **Live labels:** `Building Canada Act`, `Building Canada Act (Bill C-5)`
- **Dimensions used:** Major Projects, Defence & Trade
- **Institution type:** Legislative record (Parliament of Canada)
- **Ownership / funding:** Parliamentary
- **Editorial independence / governance:** Institutional record; bill text and status are official record, not interpretation
- **Grounded ideological tendency:** None
- **Best-use boundary:** Grade-moving for record of passage (Tier 1)
- **Strongest SAM-role fit:** Policy truth
- **Trust flags:** Record-of-passage only; LEGISinfo does not characterize the substance of a bill — use with independent or statutory-text analysis when claims turn on substance rather than status

### 15. Prime Minister's Office (pm.gc.ca)

- **Live labels:** `PM second tranche announcement`, `PMO NATO 2% announcement`, `Canada-Ontario Partnership`
- **Dimensions used:** Major Projects, Defence & Trade, Housing Supply
- **Institution type:** Federal government communications (political office)
- **Ownership / funding:** Government of Canada
- **Editorial independence / governance:** Political office; not an independent editorial authority
- **Grounded ideological tendency:** Reflects the sitting government of the day
- **Best-use boundary:** **Context only (Tier 4)** — cannot move a grade alone per QA Rule 1
- **Strongest SAM-role fit:** Context truth only
- **Trust flags:** All PMO citations are announcement pages and must be paired with a T1 or T2 source to be used in a grade move. Currently used as secondary citation in Major Projects, Defence & Trade, and Housing Supply — confirm each pairing remains T1/T2-anchored

### 16. CBC / Radio-Canada

- **Live labels:** `CBC — financial assets`, `CBC — ECCC job and budget cuts`
- **Dimensions used:** Ethics & Transparency, Climate & Environment
- **Institution type:** Federally chartered Crown corporation; public broadcaster
- **Ownership / funding:** Approximately C$1.2B federal parliamentary appropriation plus advertising revenue
- **Editorial independence / governance:** Statutory "journalistic, creative and programming independence" under the Broadcasting Act; CRTC-regulated; board of directors appointed by federal government; reports to Parliament through Minister of Canadian Heritage
- **Grounded ideological tendency:** Not confidently grounded. AllSides rates CBC News "Lean Left" with low confidence (July 2022 review, flagged as low or initial confidence as of April 2026). Media Bias/Fact Check rates CBC as "Left-Center." External rater Canadian coverage is thin and inconsistent. Institutional descriptor (public broadcaster / Crown corporation) is more precise than any ideological label.
- **Best-use boundary:** Corroborator (Tier 3); grade-moving only with T1 or T2 context per QA Rule 1
- **Strongest SAM-role fit:** Context truth + corroboration on execution truth; investigative desk reporting can carry additional weight for specific stories
- **Trust flags:** Public taxonomy should lead with institutional descriptor (public broadcaster / Crown corporation), not an ideological label. Reporter / desk-level trust (investigative unit, parliamentary bureau) can differ from masthead-level trust on individual stories — record on a per-citation basis when relevant.

### 17. The Globe and Mail

- **Live labels:** `Globe and Mail — ethics filing`
- **Dimensions used:** Ethics & Transparency
- **Institution type:** Privately owned national broadsheet newspaper
- **Ownership / funding:** Woodbridge Company (Thomson family)
- **Editorial independence / governance:** Privately owned; editorial independence asserted by ownership; national masthead with established parliamentary bureau
- **Grounded ideological tendency:** Not confidently grounded in a Canadian-coverage rater. Commonly characterized in Canadian media studies as centrist with centre-right fiscal / centre-left social editorial positions; editorial board positions vary by issue. Cite rater where used; otherwise describe institutionally.
- **Best-use boundary:** Corroborator (Tier 3); grade-moving only with T1 or T2 per QA Rule 1
- **Strongest SAM-role fit:** Context truth + corroboration on policy / execution
- **Trust flags:** Trust travels with specific desks (parliamentary bureau) at least as much as with the masthead. Named-reporter credibility can differ from outlet-level characterization.

### 18. Canadian Climate Institute (CCI)

- **Live labels:** `CCI — industrial pricing`, `CCI — Canada off course`, `CCI — industrial pricing gaps`
- **Dimensions used:** Carbon Pricing Policy, Climate & Environment
- **Institution type:** Nonprofit research institute; arm's-length federal-funded
- **Ownership / funding:** **Federal government is a major funder** — Environment and Climate Change Canada provided approximately C$6.96M in the fiscal year ending 2024-03-31, with additional federal and provincial funding (Open Government Canada grants and contributions record). Funding also from philanthropic funders, corporate event sponsors, and individual donors.
- **Editorial independence / governance:** Operates at arm's length; 11-member board includes former Clerk of the Privy Council (Mel Cappe), former CAPP president (Dave Collyer), academic economist (Christopher Ragan), and others spanning industry, finance, philanthropy, academia, and Indigenous communities. Institute publicly states it "retains full control over its research, findings, and policy recommendations." Selected by federal government to lead arm's-length development of Canada's sustainable finance taxonomy (Budget 2025 reconfirmed).
- **Grounded ideological tendency:** Self-describes as non-partisan; multi-partisan board by design. Federal funding source is a legitimate context flag that public framing must not hide.
- **Best-use boundary:** Grade-moving (Tier 2 — independent analysis with disclosed methodology)
- **Strongest SAM-role fit:** Independent challenge truth + policy truth (on climate and carbon pricing)
- **Trust flags:** **Federal funding must be disclosed in public-facing characterization.** Currently used 3 times across Carbon Pricing Policy + Climate & Environment, and is the concentrated T2 challenge voice in Climate & Environment — flag for same-family concentration review (QA Rule 6.7) on Climate.

### 19. International Institute for Sustainable Development (IISD)

- **Live labels:** `IISD — Canadian Carbon Pricing Systems: 2025 Review`, `IISD — Canada's 2030 climate target`
- **Dimensions used:** Carbon Pricing Policy, Climate & Environment
- **Institution type:** International nonprofit research institute; headquartered in Winnipeg
- **Ownership / funding:** Multilateral funding from governments (including Canada), foundations, and international organizations; publicly disclosed
- **Editorial independence / governance:** Independent board; peer-reviewed research publications; published methodology
- **Grounded ideological tendency:** Environmental-policy-oriented mandate; non-partisan by governance
- **Best-use boundary:** Grade-moving (Tier 2)
- **Strongest SAM-role fit:** Independent challenge truth + policy truth (environmental policy)
- **Trust flags:** Well-established; no material flags in current use

### 20. C.D. Howe Institute

- **Live labels:** `C.D. Howe analysis`, `C.D. Howe — public service ratio`
- **Dimensions used:** Fiscal Health, Flagship Delivery
- **Institution type:** Independent nonprofit policy research institute; registered Canadian charity
- **Ownership / funding:** Individual donors, corporate sponsors, foundations (disclosed in annual report)
- **Editorial independence / governance:** Independent nonprofit board; peer-reviewed commentary program; published methodology; research fellows network includes academic economists
- **Grounded ideological tendency:** Generally characterized as market-oriented / centre-right on fiscal and economic policy questions. Institutional peer-review discipline is its strongest feature; ideological description should be treated as a secondary institutional tendency rather than a per-publication label. External rater Canadian coverage is thin.
- **Best-use boundary:** Grade-moving (Tier 2)
- **Strongest SAM-role fit:** Independent challenge truth + policy truth (fiscal and economic policy)
- **Trust flags:** In Fiscal Health the Institute is the only T2 domestic non-official independent-challenge source (IMF is international T2) — acceptable given IMF diversification, but flag if a second domestic voice becomes material

### 21. Fraser Institute

- **Live labels:** `Fraser Institute — Ugly Growth`, `Fraser Institute — MPO assessment`, `Fraser Institute — policy corrections`
- **Dimensions used:** Economic Policy Response, Major Projects, Promise Delivery
- **Institution type:** Independent nonprofit policy research institute; registered Canadian charity
- **Ownership / funding:** Individual donors, foundations, corporate sponsors; public annual reports; charitable status
- **Editorial independence / governance:** Independent nonprofit board; publishes methodology with most studies; disclosed research standards
- **Grounded ideological tendency:** **Explicit free-market / classical-liberal institutional orientation** — self-described mission and research program are structured around market-based policy analysis. Widely characterized across Canadian academic references and media studies as right-of-centre. Unlike C.D. Howe, the ideological orientation is more structurally built into the research program than on a per-publication basis.
- **Best-use boundary:** Grade-moving (Tier 2) **with institutional counterweight**. Same-family concentration without a second-family T2 voice should be flagged under QA Rule 6.7.
- **Strongest SAM-role fit:** Independent challenge truth (where counterweight exists)
- **Trust flags:** **Over-concentration risk.** Fraser is the only non-official T2 challenge source in Major Projects and Promise Delivery and is the lead non-official challenge in Economic Policy Response. QA Rule 6.7 (same-family concentration blocking condition on grade-moving claims) is in scope for grade moves anchored to Fraser alone. Flag for independent-challenge diversification.

### 22. IRPP / Policy Options

- **Live labels:** `Policy Options — federalism failure`, `Policy Options — DM shuffle`, `Policy Options — real estate trap`
- **Dimensions used:** Flagship Delivery, Housing Supply
- **Institution type:** Independent nonprofit policy research institute (Institute for Research on Public Policy) and its policy journal
- **Ownership / funding:** Foundation and endowment funding; individual and corporate donors; published in annual report
- **Editorial independence / governance:** Independent board; non-partisan by mandate; Policy Options articles are editor-reviewed
- **Grounded ideological tendency:** Non-partisan by mandate; widely regarded as centrist with issue-by-issue variation
- **Best-use boundary:** Grade-moving (Tier 2) for peer-reviewed IRPP research; Tier 2–3 for Policy Options articles depending on the article's research basis
- **Strongest SAM-role fit:** Independent challenge truth + policy truth + context
- **Trust flags:** Flagship Delivery currently cites Policy Options twice — same-family concentration is partial but mitigated by PBO, C.D. Howe, and The Hub also being present as challenge voices

### 23. The Hub

- **Live labels:** `The Hub — $94B gap`
- **Dimensions used:** Flagship Delivery
- **Institution type:** Not-for-profit digital policy commentary platform
- **Ownership / funding:** Advertising, paid subscriptions, and Centre for Civic Engagement research support
- **Editorial independence / governance:** Co-founded by Rudyard Griffiths (publisher) and Sean Speer (editor-at-large); both carry right-of-centre policy and commentary backgrounds; explicitly opposes federal media subsidies as an editorial stance; self-describes as "independent analysis and spirited debate about Canada's past, present and future"
- **Grounded ideological tendency:** **Right-of-centre** — matches self-descriptive framing, editorial stance on media subsidies, and external characterization (Media Bias/Fact Check). Institutional descriptor ("nonprofit policy commentary platform, right-of-centre") is stronger than a raw ideological label because it combines form and orientation.
- **Best-use boundary:** Corroborator (Tier 3) — not on its own sufficient for a grade move
- **Strongest SAM-role fit:** Context truth + independent challenge where paired with T1 or T2
- **Trust flags:** Currently used once in Flagship Delivery alongside PBO, C.D. Howe, and IRPP — appropriately corroborative. Not a research institute; treat as commentary, not disclosed-method research.

### 24. Democracy Watch

- **Live labels:** `Democracy Watch critique`
- **Dimensions used:** Ethics & Transparency
- **Institution type:** Nonprofit watchdog / advocacy organization
- **Ownership / funding:** Donor-supported
- **Editorial independence / governance:** Founder-led (Duff Conacher); advocacy mandate focused on government accountability, ethics, and democratic reform; not a neutral research institution
- **Grounded ideological tendency:** Advocacy-oriented rather than ideologically placed; focus is on governance reform and ethics accountability
- **Best-use boundary:** Corroborator (Tier 3) on advocacy claims; context for ethics framework adequacy
- **Strongest SAM-role fit:** Independent challenge truth — with the caveat that the challenge is advocacy-framed, not methodologically neutral analysis
- **Trust flags:** Appropriately used as advocacy-framed challenge voice in Ethics & Transparency. Public characterization should name it as a watchdog / advocacy organization, not a neutral research body. Adding an academic governance scholar (e.g., Donald Savoie, Lori Turnbull) would strengthen the challenge stack.

### 25. The Narwhal

- **Live labels:** `The Narwhal — climate rollback analysis`
- **Dimensions used:** Promise Delivery
- **Institution type:** Independent nonprofit investigative journalism
- **Ownership / funding:** Foundation grants + reader donations; disclosed in annual report
- **Editorial independence / governance:** Editorially independent; issue focus: environment, land-use, Indigenous rights, resource development
- **Grounded ideological tendency:** Editorial orientation aligned with environmental and Indigenous-rights advocacy framing; MBFC characterization generally left-of-centre; external Canadian-coverage rater depth is limited. Institutional descriptor (issue-focused nonprofit environmental journalism) is more precise than an ideological label.
- **Best-use boundary:** Context / corroborator (Tier 3)
- **Strongest SAM-role fit:** Context truth + independent challenge on environmental / Indigenous files
- **Trust flags:** Should not be the sole non-official T3 source for environment-related grade moves; pair with a T2 source (CCI, IISD) or with Canada's National Observer for corroboration

### 26. Canada's National Observer

- **Live labels:** `National Observer — fossil fuel course`
- **Dimensions used:** Climate & Environment
- **Institution type:** Independent nonprofit investigative journalism
- **Ownership / funding:** Founder-led (Linda Solomon Wood); foundation grants + reader donations
- **Editorial independence / governance:** Editorially independent; issue focus: environment, climate, federal politics
- **Grounded ideological tendency:** Editorial orientation aligned with climate-policy advocacy framing; external rater depth for Canadian outlets is limited. Institutional descriptor is more precise than an ideological label.
- **Best-use boundary:** Context / corroborator (Tier 3)
- **Strongest SAM-role fit:** Context truth + independent challenge on environmental files
- **Trust flags:** Appropriately corroborative in Climate & Environment; over-reliance as sole non-official environmental voice would be a concentration risk if paired only with The Narwhal — the live stack mitigates this by also citing CCI and IISD at T2

### 27. The Conversation Canada

- **Live labels:** `ECCC Arctic science cuts` (author-contributed article on theconversation.com)
- **Dimensions used:** Climate & Environment
- **Institution type:** Academic-authored journalism platform; Canadian edition of The Conversation global network
- **Ownership / funding:** Partnership with Canadian universities; nonprofit funding model; university-affiliated authors
- **Editorial independence / governance:** Editorially independent; authors are academics writing in their research areas; articles go through an editorial review process
- **Grounded ideological tendency:** No institutional ideological orientation; per-article variation reflects individual academic authors
- **Best-use boundary:** Corroborator / context (Tier 3)
- **Strongest SAM-role fit:** Context truth + academic explainer
- **Trust flags:** Trust on a Conversation article rests primarily on the individual academic author's credentials and research area, not on the platform. Record author-level credibility in internal notes when the article is grade-adjacent.

### 28. Dalhousie Agri-Food Analytics Lab

- **Live labels:** `Dalhousie Food Price Report`
- **Dimensions used:** Affordability Response
- **Institution type:** Academic research unit within Dalhousie University
- **Ownership / funding:** University + research grants; Canada Food Price Report is an annual multi-university collaboration
- **Editorial independence / governance:** Academic research unit; methodology published annually; peer review through university research standards
- **Grounded ideological tendency:** None; academic research
- **Best-use boundary:** Grade-moving (Tier 2) for data-driven food-price forecasting and analysis
- **Strongest SAM-role fit:** Measurement truth + context truth
- **Trust flags:** None

### 29. PROOF (University of Toronto)

- **Live labels:** `PROOF food insecurity 2024`
- **Dimensions used:** Affordability Response
- **Institution type:** Academic research program at the University of Toronto (food insecurity research)
- **Ownership / funding:** University + research grants
- **Editorial independence / governance:** Academic research program; methodology published; principal investigators publish in peer-reviewed journals
- **Grounded ideological tendency:** None; academic research
- **Best-use boundary:** Grade-moving (Tier 2) for food insecurity measurement
- **Strongest SAM-role fit:** Measurement truth
- **Trust flags:** None

### 30. Angus Reid

- **Live labels:** `Angus Reid — major projects reaction`, `Angus Reid — Carney government report card`
- **Dimensions used:** Major Projects, Promise Delivery
- **Institution type:** Private Canadian market research and polling firm
- **Ownership / funding:** Privately owned commercial research firm
- **Editorial independence / governance:** Commercial market research; published methodology for panels and weighting
- **Grounded ideological tendency:** Non-partisan by commercial mandate
- **Best-use boundary:** Grade-moving (Tier 2) **for public-opinion claims only**; Tier 3 for any editorial analysis Angus Reid publishes alongside polling data
- **Strongest SAM-role fit:** Context truth (reader / public sentiment) — not measurement of government performance itself
- **Trust flags:** Polling is evidence of public sentiment, not evidence of government performance. Should not be used to carry performance claims; in the current use (Major Projects reaction, Promise Delivery report card) it is appropriately positioned as public-sentiment context.

---

## Approval Signal source families (outside GPA)

These five polling families feed the ungraded Approval Signal at the top of the dashboard. They are listed separately because the signal sits outside the scoring model — see [v2-Decision-Memo-Approval-Signal.md](v2-Decision-Memo-Approval-Signal.md). None of them can move a graded dimension; their trust boundary is "public-opinion context only." Angus Reid Institute appears twice in the register because its Public Interest Research arm (live in the Approval Signal) is institutionally distinct from the Vision Critical / Angus Reid commercial polling business (live in graded dimensions above).

### S1. Léger

- **Live usage:** Approval Signal (PM / government approval)
- **Institution type:** Private Canadian market research firm; oldest continuously operating Canadian-owned polling firm
- **Ownership / funding:** Privately held (Léger family); CRIC member
- **Editorial independence / governance:** Commercial market research; publishes methodology and weighting; maintains LEO opt-in online panel
- **Grounded ideological tendency:** None established; non-partisan commercial mandate
- **Best-use boundary:** Approval Signal only (outside GPA). Not grade-moving for any performance dimension.
- **Strongest SAM-role fit:** Context truth (public sentiment)
- **Trust flags:** Online non-probability panel — MoE is reported as a comparable-probability-sample equivalent, not a true probability-sample MoE. Flagged in the signal's methodology disclosure.

### S2. Abacus Data

- **Live usage:** Approval Signal (federal government approval)
- **Institution type:** Private Canadian market research firm, founded 2010
- **Ownership / funding:** Privately held; CRIC member
- **Editorial independence / governance:** Commercial market research; publishes methodology and writes public-facing analysis on its own blog
- **Grounded ideological tendency:** None established by external raters; David Coletto (CEO) publishes commentary that is sometimes read as sympathetic to centre-left frames. Commercial polling work remains cross-partisan.
- **Best-use boundary:** Approval Signal only (outside GPA). Abacus's editorial commentary posts are not admissible even as Tier 3 context for the graded dimensions.
- **Strongest SAM-role fit:** Context truth (public sentiment)
- **Trust flags:** Online non-probability panel. Abacus's frequent publication cadence gives heavy weight to its numbers in any equal-weighted mean — mitigation in v1 is multi-pollster coverage (diversified sample). If Abacus publishes 3+ polls in a window and other pollsters publish 0, note the concentration.

### S3. Ipsos

- **Live usage:** Approval Signal (PM approval)
- **Institution type:** Multinational market research firm (HQ Paris, Canadian operations long-established); CRIC member
- **Ownership / funding:** Publicly traded (Euronext Paris)
- **Editorial independence / governance:** Commercial market research; publishes methodology; conducts work for government, corporate, and media clients across partisan lines
- **Grounded ideological tendency:** None; non-partisan by commercial mandate
- **Best-use boundary:** Approval Signal only (outside GPA)
- **Strongest SAM-role fit:** Context truth (public sentiment)
- **Trust flags:** Online non-probability panel — MoE reported as probability-sample equivalent. Sample sizes typically smaller (n≈1,000) than the Canadian-only firms.

### S4. Angus Reid Institute (public-interest polling arm)

- **Live usage:** Approval Signal (PM approval). Institutionally distinct from Angus Reid commercial market research firm (family entry #30) — the Institute is a non-profit arm doing public-interest polling, run by Shachi Kurl. Same founder lineage as the Forum panel but separate governance.
- **Institution type:** Registered Canadian non-profit (Angus Reid Institute)
- **Ownership / funding:** Non-profit foundation funded by donations; CRIC member
- **Editorial independence / governance:** Non-profit governance; publishes methodology, full cross-tabs, and commentary
- **Grounded ideological tendency:** None established; non-partisan non-profit mandate
- **Best-use boundary:** Approval Signal only (outside GPA). Distinct from commercial Angus Reid entry (#30) which is admissible to specific dimensions as Tier 2 public-opinion context.
- **Strongest SAM-role fit:** Context truth (public sentiment)
- **Trust flags:** Shares the Angus Reid Forum online panel with the commercial firm; the two entities are separately governed but their panel is the same instrument. Panel is opt-in, not probability-sampled.

### S5. Innovative Research Group

- **Live usage:** Approval Signal (federal government approval)
- **Institution type:** Private Canadian public affairs research firm; CRIC member
- **Ownership / funding:** Privately held; Canadian
- **Editorial independence / governance:** Commercial public affairs research; publishes Canada 20/20 syndicated tracking methodology
- **Grounded ideological tendency:** None established
- **Best-use boundary:** Approval Signal only (outside GPA)
- **Strongest SAM-role fit:** Context truth (public sentiment)
- **Trust flags:** Lower publication frequency than Abacus / Léger — can contribute 0–1 polls to a 60-day window. Sample size typically n≈1,000, smaller than Léger's typical n≈1,600.

---

## Open register-level residuals

These do not block use of the SCR but are explicitly flagged for future passes:

- **Fraser Institute concentration risk** on independent-challenge role across Economic Policy Response, Major Projects, and Promise Delivery. QA Rule 6.7 applies for grade moves anchored to Fraser alone in those dimensions.
- **Canadian Climate Institute concentration** on independent-challenge role in Climate & Environment (3 of 8 citations; also live in Carbon Pricing Policy). Same-family concentration partially mitigated by IISD also being present.
- **No T2 non-official independent-challenge source live** in Defence & Trade or Immigration. Sufficient given T1 official coverage but flag for future research if grade moves require non-official corroboration.
- **External rater Canadian coverage is thin and low-confidence.** AllSides and Media Bias/Fact Check have limited Canadian outlet ratings and explicitly disclose low confidence on several of them. Ideological labels in this register cite raters where available and describe institutionally where rater coverage is weak.
- **Reporter / desk-level credibility** (Globe parliamentary bureau, CBC investigative unit, etc.) is noted narratively per family but is not tracked per-citation. Future enhancement if per-story trust assessment becomes load-bearing.
