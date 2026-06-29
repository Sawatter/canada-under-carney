# Independent Trigger Re-Check — 2026-06-09

**Purpose:** An AI-assisted re-check of the six carry-forward trigger evaluations the June 2026 cycle already shipped (v5.75–v5.99), against current public evidence. Not a fresh evaluation and not a grade move. It asks one question per dimension: does current public evidence corroborate the shipped hold, or surface something the editor should still adjudicate?

**Run date:** 2026-06-09
**Dashboard state:** v5.107, `dimensions.json` data refreshed 2026-06-05 (v5.99)
**Method:** Six parallel web-research passes under a strict anti-confabulation contract (each pass had to back claims with a source URL plus a verbatim quote, or log them as "could not verify"). This note summarizes those findings and names the controlling source per claim; findings were reconciled against the current `dimensions.json` and the June cycle git history, not the stale 2026-05-17 source-to-trigger audit.
**Boundary:** No grade, threshold, scoring, modifier, or dimension-data change. Every item below is for editor adjudication. AI-assisted research is candidate signal, not a settled finding — the editor and the scheduled Codex pass confirm against primary sources.

---

## Headline

Of the six carry-forward triggers, external evidence **corroborates all six recorded holds**. For Defence & Trade, the A- hold stands under either reading of its funded-pathway trigger described below. The two earlier definitional editor decisions were adjudicated on June 12. The June 19 Housing watch is closed. The June 17 Immigration release was checked on June 20 and is closed below; no trigger fired, and Immigration holds at C+.

---

## Per-dimension

### 1. Defence & Trade — A- (hold corroborated)

- **Trigger:** "3.5% defence target gets a funded pathway" (up).
- **Shipped:** v5.89 editor grill-me decision — trigger fired on a "$81.8B over five years, Budget 2025 Ch.4" reading; grade held A- on the mixed-construct reasoning (still at the 2% floor, trade half mixed, goods deficit widened to $31.3B). Documented in `Defence-Funded-Pathway-Memo-2026-05-25.md`.
- **External evidence:** PBO finds the government "has not published supporting projection details" and DND gave no year-by-year path (PBO RP-2526-022-S). The Pentagon (May 2026 reporting) said Canada has not provided a credible plan.
- **Read:** Consistent. The editor's "funded pathway" reading (real appropriation toward defence) and the PBO/Pentagon "credible detailed pathway to 3.5% by 2035" reading are different lenses; the PBO/Pentagon skepticism is context worth a one-line note in the memo, but it does not change the A- outcome.

### 2. Affordability Response — D- (hold corroborated)

- **Trigger:** "New federal benefit >$500/household announced and funded" (up).
- **External evidence:** PBO costed the 2026 gas-tax suspension (10c/L gasoline, 4c/L diesel, Apr 20–Sep 7) at an **average $124/household** ($59 lowest quintile to $211 highest); PBO fiscal cost ~$2.1B (PBO NT-2627-005-S).
- **Read:** Up-trigger **not fired** — the per-household benefit is roughly a quarter of the $500 threshold. Hold at D- corroborated.
- **Editor note:** The separately-cited Canada Groceries and Essentials Benefit is a distinct measure; if the editor wants, confirm its per-household value is also below $500 so the up-trigger is cleanly not-fired on either measure.

### 3. Housing Supply — D (hold corroborated)

- **Trigger:** "Federal housing contribution rises above roughly 5% of the shortfall with live disbursement or construction underway" (up, setDate 2026-05-02).
- **External evidence:** Canada-Ontario partnership = $4.4B federal DCRP share over 10 years + $875M HST-offset + $1.7B provincial transfers. Bill C-26 received Royal Assent on June 18, 2026, and Ontario closed the DCRP application intake on June 19. No official project-selection or award announcement, signed transfer-payment agreement, payment, or DCRP construction evidence was found on the Ontario and federal publisher surfaces checked on June 20. Build Canada Homes (the only program with verified construction underway) is ~26,000 units, ~0.7% of the CMHC 3.5M-unit shortfall.
- **Read:** Up-trigger **not fired**. Royal Assent and the application-window close remove two preliminary gates, but the live disbursement/construction condition remains unmet and the unit share is well under 5%. Hold at D corroborated.

### 4. Immigration — C+ (hold corroborated)

- **Trigger:** "Temporary residents reach the 5% target ahead of schedule" (up). "Reversal of the contraction" (down).
- **External evidence:** StatCan Q4 2025 (Jan 1, 2026): 2,676,441 non-permanent residents / 41,472,081 total = ~6.5%, down ~171K in the quarter. StatCan Q1 2026 (Apr 1, 2026; [The Daily, 2026-06-17](https://www150.statcan.gc.ca/n1/daily-quotidien/260617/dq260617a-eng.htm)): 2,558,562 non-permanent residents / 41,417,056 total = **~6.18%** (the Globe and Mail rounds it to 6.1%), with non-permanent residents down 117,879 in the quarter and a third consecutive quarterly population decline of 55,025. Target is below 5% by end of 2027 (revised from end-2026).
- **Read:** Up-trigger **not fired**. The temporary-resident share is ~6.18%, still above the 5% target with the deadline about 18 months out, though it is falling quarter over quarter (6.5% to 6.18%), consistent with the C+ "trend up, contracting" read. The "reversal of the contraction" down-trigger is **not fired** either: Q1 2026 is a third straight quarterly decline, so the contraction continues. Hold at C+ corroborated.

### 5. Carbon Pricing Policy — C (hold corroborated; one open definition)

- **Triggers:** up — "OBPS tightened, effective price above $40/t" / "formal CBAM announced with implementation plan"; down — "OBPS weakened, effective price below $15/t" / "intention to eliminate industrial pricing."
- **External evidence:** The May 15 Canada-Alberta MOU (already a grade-moving source in the live data) **weakens and delays** the industrial price trajectory rather than tightening it; Pembina cites "$130 per tonne by 2040" and a "15-year delay." No formal CBAM with an implementation plan exists (campaign pledge only; absent from Budget 2025 and the 2026 Spring Update). No announced intention to eliminate industrial pricing — the MOU continues it to 2040.
- **Read:** Both up-triggers **not fired**; the "eliminate industrial pricing" down-trigger **not fired**.
- **OPEN EDITOR DECISION (pre-existing):** The "effective price below $15/t" down-trigger is definition-dependent. Independent analysis splits between a "cost on total emissions" metric (CCI estimates under ~$10/t) and a "credit market trading price" metric (~$17–37/t). The two readings fire the trigger differently. The editor should fix which metric this trigger measures before adjudicating it.

### 6. Climate & Environment — D (hold corroborated; one threading check)

- **Triggers:** up — "replacement climate strategy published with funded measures" / "ECCC budget restored"; down — "formal withdrawal from Paris commitments" / "additional climate program eliminations."
- **External evidence:** No new funded replacement strategy after the April grade move (the Climate Competitiveness Strategy predates it, Nov 2025). ECCC budget is being reduced further, not restored (2026-27 departmental plan: ~$91M and 837 FTE reductions). Canada remains a Paris party; the Net-Zero Emissions Accountability Act is still in force.
- **Read:** Both up-triggers **not fired**; the Paris-withdrawal down-trigger **not fired**.
- **OPEN EDITOR DECISION (new this re-check):** The **May 14 2026 announced weakening of the Clean Electricity Regulations** (allowing more natural gas; the David Suzuki Foundation called it "the beginning of the end" of the CER) is a candidate "additional climate program eliminations" down-event that postdates the April move. It appears in the public record but is not obviously threaded into Climate's current evidence. Two judgment calls for the editor: (a) does an announced, in-consultation weakening (not yet gazetted) count as an "elimination," and (b) should the CER weakening be threaded as grade-moving evidence regardless of whether it moves the grade.

---

## Time-boxed watch items

- **June 17, 2026 (follow-up completed June 20).** StatCan's Q1 2026 population estimates ([The Daily, 2026-06-17](https://www150.statcan.gc.ca/n1/daily-quotidien/260617/dq260617a-eng.htm)) put the temporary-resident share at ~6.18% (down from ~6.5%), with a third consecutive quarterly population decline. The Immigration up-trigger (5% target ahead of schedule) and the contraction-reversal down-trigger both remain not fired. Hold at C+ corroborated, no grade move.
- **June 19, 2026 (follow-up completed June 20).** Ontario's live DCRP page confirms the application intake is closed, and LEGISinfo confirms Bill C-26 received Royal Assent on June 18. No official project-selection or award announcement was found. The next Housing checks are the federal-provincial funding agreement, project approvals, signed transfer-payment agreements, first payment, and construction evidence.

---

## Bias-resistance note (item #4)

`scripts/audit-bias-resistance.mjs` against the live data: 12 dimensions audited, **7 flagged** (documented baseline: 6 as of v5.66). Re-running the current script against the v5.66 `dimensions.json` in a throwaway worktree pins the delta exactly: the baseline six were Carbon Pricing, Ethics & Transparency, Flagship Delivery, Housing Supply, Immigration, and Promise Delivery. **The new seventh is Climate & Environment**, flagged because the May 15 Canada-Alberta MOU backgrounder (a PMO press release) is now threaded as grade-moving evidence. Expected drift from real source work, not a defect. The full current flag set, all documented-pattern:

- Press-release share of grade-moving sources: Carbon Pricing and Climate & Environment (the May 15 MOU backgrounder), Housing Supply (the Build Canada Homes pipeline page).
- Flagship Delivery's long-standing >60% policy-institute concentration (a meta-rollup with a thin five-source stack).
- Trigger-symmetry notes: asymmetric sourcing on Carbon Pricing, Ethics & Transparency, and Immigration (one trigger unsourced on one side while the other side is fully sourced), and numeric-threshold asymmetry on Immigration, Housing Supply, and Promise Delivery (a numeric trigger on one side paired with a qualitative one on the other).

`npm run test:data` passes clean (12 dimensions, approval-signal invariants, 56 frozen-surface assertions).

---

## Limits

- AI-assisted research is candidate signal. Each claim above names its controlling source for the editor and the scheduled Codex pass to confirm against the primary document.
- Several government pages (Finance Canada gas-tax background, IRCC levels supplementary, some ECCC/canada.ca pages) returned 403 to the headless fetcher and were confirmed through secondary sources; a browser check may be needed on those. (Closed 2026-06-12 — see Verification record.)
- This re-check reads evidence against triggers. It does not move grades, and it is not the inter-rater reliability test.

---

## Verification record

- **2026-06-29, Housing DCRP disbursement watch (docs only, no grade move).** The federal [Build Communities Strong Fund latest announcements page](https://housing-infrastructure.canada.ca/bcsf-fbcf/news-nouvelles-eng.html), modified June 26, still lists Toronto's June 23 DCRP announcement as the only post-application-close DCRP item. No later accessed federal BCSF item recorded another Ontario DCRP allocation, a signed Canada-Ontario BCSF bilateral agreement, a signed Toronto-Ontario Transfer Payment Agreement, first payment, or DCRP construction evidence. The federal [June 23 Toronto release](https://www.canada.ca/en/housing-infrastructure-communities/news/2026/06/canada-and-ontario-making-homes-more-affordable-in-toronto.html) says Toronto is receiving $1.5B through the DCRP, but it also says the listed infrastructure support is subject to the Canada-Ontario BCSF agreement and due diligence. The quick facts state that federal funding is subject to a Canada-Ontario BCSF bilateral agreement, federal review and project approval, and Toronto entering into a Transfer Payment Agreement with Ontario. [LEGISinfo for Bill C-26](https://www.parl.ca/legisinfo/en/bill/45-1/c-26) still records Royal Assent on June 18, 2026. Ontario's DCRP application page returned 403 to the headless fetcher on June 29, and the Ontario Newsroom page loaded as JavaScript-only. Canada.ca was readable and carried the operative federal/provincial conditions. Read: the Toronto allocation is material watch evidence, but it is still conditional. It is not a signed agreement, a completed federal project approval, a first payment, or construction. The Housing up-trigger remains not fired. Continue watching for signed BCSF and TPA documents, payment evidence, and construction. No grade, threshold, source stack, promise status, or dashboard data changed.
- **2026-06-25, Housing watch freshness check (docs only, no grade move).** First named municipal allocation surfaced since the June 19 application close: on June 23, 2026, Ontario and Canada announced that Toronto is receiving $1.5B through the Canada-Ontario Development Charge Reduction Program in recognition of a committed 40-60% development-charge reduction for more than three years ([Ontario Newsroom release 1007662](https://news.ontario.ca/en/release/1007662/ontario_and_canada_making_homes_more_affordable_in_toronto) and [City of Toronto release, 2026-06-23](https://www.toronto.ca/news/city-of-toronto-secures-1-5-billion-in-canada-ontario-partnership-to-build-funding-to-support-housing-and-reduce-development-charges/)). The City release says the funding is part of the DCRP, will run over 10 years, and will support projects already approved through Toronto's 10-Year Capital Plan. The Ontario release records that receipt of funding, and confirmation of approved projects, remains subject to Toronto entering into a Transfer Payment Agreement with Ontario and complying with program requirements. The [AMO program page](https://www.amo.on.ca/policy/finance-infrastructure-and-economy/canada-ontario-development-charge-reduction-program) describes the DCRP as an $8.8B application-based program for 200+ municipalities and says final transfer-payment agreements lock in the three-year development-charge reduction and secure federal/provincial funding. Against Housing's stage discipline, an announced and conditional allocation is not a signed Transfer Payment Agreement, a first payment, or construction, so the Housing up-trigger remains not fired and the file holds at D. The remaining watch items are the signed TPA(s), the first payment, and construction evidence. No grade, threshold, source, promise status, or dashboard data changed.
- **2026-06-20, Immigration June-17 watch closeout (docs only, no grade move).** StatCan's Q1 2026 population estimates ([The Daily, 2026-06-17](https://www150.statcan.gc.ca/n1/daily-quotidien/260617/dq260617a-eng.htm)) report 2,558,562 non-permanent residents against a total population of 41,417,056 on April 1, 2026, a temporary-resident share of about 6.18% (the Globe and Mail rounds it to 6.1%), down from about 6.5% the prior quarter, with non-permanent residents falling 117,879 and a third consecutive quarterly population decline of 55,025. The StatCan release does not reference the federal 5% target. Against Immigration's triggers: the "5% target ahead of schedule" up-trigger is not fired (the share is about 6.18%, above 5%, with the target scheduled for end-2027), though the falling share is consistent with the recorded C+ "trend up" read; the "reversal of the contraction" down-trigger is not fired (the contraction continues). Hold at C+ corroborated. No grade, threshold, source, promise status, or dashboard data changed.
- **2026-06-20, Housing watch closeout (docs only, no grade move).** Ontario's [Development Charge Reduction Program page](https://www.ontario.ca/page/development-charge-reduction-program) states that applications are closed and shows an update date of June 19, 2026. [LEGISinfo for Bill C-26](https://www.parl.ca/legisinfo/en/bill/45-1/c-26) records Royal Assent on June 18, 2026 (Statutes of Canada 2026, c. 21). The federal [June 1 program release](https://www.canada.ca/en/housing-infrastructure-communities/news/2026/06/canada-and-ontario-open-applications-for-new-development-charge-reduction-program0.html) still describes Canada's DCRP funding as pending an agreement under the Build Communities Strong Fund. No official DCRP project-selection or award announcement was found on the [Ontario DCRP page](https://www.ontario.ca/page/development-charge-reduction-program), [Ontario Newsroom](https://news.ontario.ca/en), or [Housing, Infrastructure and Communities Canada news listing](https://www.canada.ca/en/housing-infrastructure-communities/news.html) checked on June 20. Application close and Royal Assent do not establish a signed agreement, project approval, payment, or construction, so the Housing up-trigger remains not fired.
- **2026-06-12 — Both open editor decisions adjudicated (v5.109).** Carbon Pricing: the effective-price triggers now name their metric — the marginal compliance price (market price of compliance credits, ~$20/t), with the economy-wide average cost and the published Canada-Alberta schedule kept as context metrics; the May 15 agreement was considered against the $15/t down-trigger and did not fire it. Climate: the May 14 CER weakening was considered, not fired (announced is not done, in both directions); the trigger is armed with a pre-committed condition — a materially weakening amendment in the Canada Gazette, or repeal, returns it for adjudication.
- **2026-06-12 — Codex cross-model pass (read-only, visible browser): no findings.** Each of the six evidence chains was checked against its primary document and supports the recorded claim — including the three pages the headless fetcher could not read. Finance Canada's gas-tax backgrounder shows 10c/L gasoline and 4c/L diesel from April 20 to September 7 (~$2.4B total relief) with no per-household figure contradicting PBO's $124 average. The IRCC 2026-2028 levels supplementary page states the below-5% temporary-resident target lands at the end of 2027, with 385,000 TR arrivals planned for 2026. The PMO Canada-Alberta backgrounder states the industrial-carbon path directly: headline price $95 in 2026, $115 in 2030, $130 in 2035, $140 in 2040, with a TIER effective-price target of $130 in 2040 and a minimum credit transfer price rising from $60 in 2030 to $110 in 2040 — Claude separately re-fetched the backgrounder and matched those figures. The bias-audit delta was independently reproduced (12 audited / 7 flagged on live data; 12 / 6 on the v5.66 data with no Climate flag), and the StatCan temporary-resident share recomputed at ~6.45%. The 11-promise quarterly recert was re-checked as still open: the May ledger rows remain "not checked" with no later recertifying commit.
