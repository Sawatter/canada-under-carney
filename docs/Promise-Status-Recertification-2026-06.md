# Promise Status Recertification — June 2026

**Purpose:** Quarterly recertification of the 11 stalled / abandoned promise statuses that the May and June cycles carried as "not checked" (the open gap named in [Source-Coverage-Ledger-2026-05.md](Source-Coverage-Ledger-2026-05.md) and tracked in the June ledger). For each promise: does the cited status evidence still support the recorded status, and has anything through 2026-06-12 changed the picture.

**Run date:** 2026-06-12
**Dashboard state:** v5.108, promise statuses as recorded in `src/data/dimensions.json`
**Method:** Four parallel research passes under the anti-confabulation contract (claims need a source URL plus verbatim quote, or are logged as could-not-verify). The two status-change candidates were independently re-fetched against primary sources before entering this doc. Result vocabulary follows the ledger convention.
**Boundary:** No status, grade, threshold, or data change. The recert reads evidence against the recorded status; status moves are editor decisions.

---

## Headline

**Nine of eleven statuses hold. Two are flagged for editor adjudication** — both because the government took real, citable action after the status was set, not because the original call was wrong. No status was changed by this recert.

---

## Results table

| # | Promise (status) | Cited status source | Result | Read |
|---|---|---|---|---|
| 1 | One Project, One Review (Stalled) | LEGISinfo C-5 | new release found | **EDITOR FLAG** — see below |
| 2 | Conserve biodiversity / freshwater (Stalled) | canada.ca nature strategy | new release found | **EDITOR FLAG** — see below |
| 3 | Net-zero commitment (Stalled) | CCI "off course" | OK | Holds |
| 4 | 2030/2035 climate targets (Stalled) | CCI "off course" | OK | Holds, with a judgment note |
| 5 | 500,000 homes/year (Stalled) | CMHC Dec 2025 starts | OK | Holds |
| 6 | Full financial disclosure (Stalled) | Democracy Watch | OK | Holds, strengthened |
| 7 | Independent Ethics Commissioner review (Stalled) | Commissioner registry | blocked | Holds on negative evidence; manual check queued |
| 8 | Get big projects built quickly (Stalled) | Policy Options | OK | Holds, with Contrecoeur noted |
| 9 | Emissions cap (Abandoned) | National Observer | OK | Holds, re-confirmed |
| 10 | EV mandate (Abandoned) | The Narwhal | OK | Holds; source-upgrade candidate |
| 11 | 2 Billion Trees, halved (Abandoned) | Budget 2025 Ch.5 | OK | Holds; label note |

---

## The two editor flags

### Flag 1 — Conserve biodiversity / freshwater (Stalled)

On **2026-03-31** the government launched **"A Force of Nature: Canada's Strategy to Protect Nature"** — a **$3.8 billion** strategy committing to 30% land and water protection by 2030, "at least 1.6 million km² of lands," "up to 700,000 km² of oceans," up to 14 new marine protected areas, at least 10 new national parks, 10 marine conservation areas, and 15 urban parks (PMO release, confirmed directly: https://www.pm.gc.ca/en/news/news-releases/2026/03/31/prime-minister-carney-launches-new-nature-strategy-protect-canadas).

The counterweight: the Auditor General found Canada missed the 25%-by-2025 milestone and had "not planned effectively to deliver 30×30"; conservation funding stepped down from $953M (2025-26) to $366M (2026-27) before the new money; and the strategy is weeks old with no delivery milestones yet.

**Editor decision:** does an announced, funded strategy move this from Stalled toward In Progress, or does Stalled hold pending actual delivery (the dashboard's announced ≠ started discipline)? Note the cited status source (canada.ca nature-strategy page) returns 403 to headless fetchers — confirm content in a browser.

### Flag 2 — One Project, One Review within 6 months (Stalled)

The basis under the cited source has shifted: Bill C-5 received Royal Assent **2025-06-26** (LEGISinfo, live), and federal-provincial cooperation agreements now exist with **seven provinces** — Alberta signed 2026-04-02 (Bennett Jones: framework signed, "implementation details remain to be developed"), Ontario 2025-12-18, plus BC, MB, NB, NS, PEI. The 2026 Spring Economic Update's own language, confirmed directly: *"The Government of Canada is advancing efforts to realise 'one project, one review' by working with provinces and territories to establish cooperation agreements."* A further consultation on accelerating approvals for all major projects ran to June 2026 (a new bill is contemplated), and no project has yet completed a full single-assessment cycle under the new regime.

**Editor decision:** the promise was "within 6 months" — long lapsed — but the machinery is now law plus signed frameworks. Does Stalled still describe this, or has it moved to In Progress / Partial? (Also note the original 6-month deadline framing may warrant a `judgmentDetail` line either way.)

---

## Holds — notes worth keeping

- **Net-zero commitment.** NZEAA still in force (laws-lois current to 2026-05-26, no repeal). CCI (2026-02-13, live): "Canada is not on track to meet any of its climate goals, including its 2035 target and net zero emissions by 2050." No funded replacement plan; the May 14 electricity strategy was noncommittal on targets.
- **2030/2035 targets.** Neither target formally rescinded; 2035 NDC (45-50%) stands, rated "Highly insufficient" by Climate Action Tracker. PM Carney's reported May 14 position: emission targets to be updated "in due course," with reporting that he acknowledged targets would be missed "unless policies change." Judgment note for the editor: the gap between "stalled" and a harder characterization is narrowing; a `judgmentDetail` line could record that.
- **500,000 homes/year.** CMHC: 2025 actual 259,028 starts (~52% of target); 2026 outlook 247,000 — the gap is widening, not closing. April 2026 SAAR 279,317 with CMHC itself citing "month-to-month volatility"; six-month trend 256,777. Next data: June 15 release.
- **Full financial disclosure.** Democracy Watch critique live and supporting. New and strengthening: the House ETHI committee's 79-page report (tabled 2026-04-23) recommending PMs divest controlled assets within 60 days rather than use blind trusts; government response window (120 days) open as of this recert. A newer Democracy Watch post (2025-10-16) on the ethics screens is a candidate source addition.
- **Ethics Commissioner review.** Registry (ciec-ccie.parl.gc.ca) returned 503 to headless fetches — could not verify directly. Negative evidence is consistent across CBC/Democracy Watch/targeted searches: no formal examination of the PM opened or published through 2026-06-12. Commissioner testimony to ETHI (unaware of several Carney-Brookfield meetings) is committee evidence, not an examination. Manual browser check queued for the Codex pass.
- **Get big projects built quickly.** Policy Options critique live and supporting. Noted for the record: **Contrecoeur Terminal broke ground 2026-04-09** — the first MPO-cohort construction start, "less than seven months after the referral... after a $1.16 billion financing commitment from the Canada Infrastructure Bank" (Spring Economic Update, confirmed directly). One construction start among the 15-project cohort; April analyst commentary (EnergyNow) criticized MPO transparency.
- **Emissions cap.** Re-confirmed dead post-April: Environmental Defence (2026-05-15) — "PM Carney scrapped the planned cap on emissions from the oil and gas industry" — in the Canada-Alberta implementation agreement context. No revival signals. Cited National Observer page is live but 403s headless (paywall/bot block).
- **EV mandate.** Status holds and is now *better* supported than when set: the September 2025 pause hardened into formal repeal of the EV Availability Standard on **2026-02-05** (Electric Autonomy: "Prime Minister Mark Carney today announced the end of the Electric Vehicle Availability Standard"; corroborated by ESG Today and Global News), replaced by a voluntary 75%-by-2035 target plus $2.3B in rebates. **Maintenance candidate:** repoint `statusSourceUrl` from the Narwhal pause explainer to the February repeal coverage.
- **2 Billion Trees (halved).** Budget 2025 Ch.5, live, confirmed: "The government will wind down the 2 Billion Trees program. Existing contribution agreements and commitments will be honoured." NRCan program page: "no longer accepting applications." May 2026 BC project announcements are pre-wind-down agreement fulfillment, not revival. **Label note:** the promise label says "halved"; the Budget language is full wind-down of new commitments (the program was tracking near ~1B of 2B trees when cut). Editor may want to confirm the "halved" framing's source or relabel.

---

## Pages blocked to headless fetching (Codex visible-browser list)

- https://www.canada.ca/en/services/environment/nature/nature-strategy.html (403) — biodiversity status source
- https://www.nationalobserver.com/2026/03/17/news/mark-carney-fossil-fuels-climate-policy (403/paywall) — emissions-cap status source
- https://ciec-ccie.parl.gc.ca/en/ and the examinations page (503) — Ethics Commissioner registry
- https://prciec-rpccie.parl.gc.ca (503) — public registry (PM filing)
- https://www.cbc.ca/news/politics/mark-carney-ethics-blind-trust-9.7174747 (403) — ETHI report coverage

---

## Limits

- AI-assisted research is candidate signal; each claim names its controlling source for the editor and the Codex pass to confirm. The two editor flags were independently re-fetched against primary documents (PMO release; Spring Economic Update) before recording — including correcting one search-summary paraphrase ("still endeavouring") to the document's actual words ("advancing efforts to realise").
- This recert does not move statuses or grades, and it is not the monthly cycle.

## Verification record

- (pending) Codex cross-model pass — scheduled when tokens allow; see tmp/CODEX-RECERT-REVIEW-PROMPT.md.
