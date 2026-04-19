# Fraser Institute Concentration Audit

- **Purpose:** Close the Source Characterization Register's open residual flagging Fraser Institute concentration on independent-challenge role across three graded dimensions. This audit names the specific claim each Fraser citation carries, identifies candidate T2 non-official alternatives that could corroborate or substitute, and documents the path to adding any new analytical source family (QA Rule 8).
- **Status:** Audit complete. Substitutions not yet made — QA Rule 8 requires a reflection pass + Claude review before any new analytical source family is accepted as settled.
- **Last updated:** 2026-04-19
- **Depends on:** [Source-Characterization-Register.md](Source-Characterization-Register.md), [Source-Authority-Map.md](Source-Authority-Map.md), [QA-Gatekeeping-Rules.md](QA-Gatekeeping-Rules.md) (Rule 6 same-family concentration, Rule 8 new analytical source family)

---

## The problem (from the SCR residuals)

> "Fraser Institute concentration risk on independent-challenge role across Economic Policy Response, Major Projects, and Promise Delivery. QA Rule 6.7 applies for grade moves anchored to Fraser alone in those dimensions."

In each of those three dimensions, Fraser is the sole non-official independent-challenge source. That means a grade movement in any of them that leans on Fraser alone hits the Rule 6 same-family concentration blocker. Adding a second independent-challenge voice removes the blocker and strengthens the grade's defensibility.

Fraser's inclusion is not the problem. Fraser's solo position is.

---

## Current Fraser citations, per dimension

| Dimension | Citation label | URL | What claim Fraser is carrying |
|---|---|---|---|
| Major Projects | Fraser Institute — MPO assessment | https://www.fraserinstitute.org/article/does-canadas-major-projects-office-actually-do-anything | Skeptical read on the Major Projects Office's actual output vs. its mandate — a non-official challenge to the government's own MPO progress claims. |
| Economic Policy Response | Fraser Institute — Ugly Growth | https://www.fraserinstitute.org/studies/canadas-ugly-growth-experience-2020-2024-why-gdp-per-capita-declined-while-overall-economy-grew | Analysis of the GDP-per-capita decline framing that the government's economic policy response must overcome. Non-official challenge to the "economic growth is back" frame. |
| Promise Delivery | Fraser Institute — policy corrections | https://www.fraserinstitute.org/article/carney-government-takes-some-steps-in-right-direction | Independent assessment acknowledging some Carney-government policy corrections while calling out others as inadequate. Mixed-verdict non-official challenge. |

In all three cases Fraser is doing useful work — providing an analytical voice that is institutionally distinct from government departments and from the dashboard's own editorial frame. The question is not whether Fraser belongs; it is whether Fraser should be the *only* such voice.

---

## Candidate T2 alternatives — what to use, not what to replace

Each dimension gets 2–3 candidates ranked by institutional distance from Fraser (so that a reader sees a diverse analytical stack rather than a single ideological orientation filtered through two names), and by topical fit (so each alternative actually covers the claim area).

### Economic Policy Response

Currently live in the non-official stack: Fraser alone.

| Candidate | Institutional tendency (per SCR / external raters) | Topical fit | Why add it |
|---|---|---|---|
| **C.D. Howe Institute** (already live in Flagship Delivery, Fiscal Health) | Centrist / market-friendly, research-grade reports | Strong on productivity, growth, capital formation | Already in the dashboard's stack, already SCR-registered, would corroborate Fraser's growth-decline critique from a less ideologically-flagged frame |
| **Institute of Fiscal Studies and Democracy (IFSD)** (already live in Fiscal Health) | Academic, centrist, public-sector-leaning | Fiscal policy, intergenerational cost analysis | Adds a non-Fraser voice on whether specific spending choices move GDP-per-capita vs. growth-through-spending |
| **IRPP / Policy Options** (already live in Affordability Response, Economic Policy) | Centrist, academic-leaning journal + institute | Broad policy-response critique | Already registered; would provide a third distinct analytical voice beyond Fraser + C.D. Howe |

**Recommendation:** Add C.D. Howe's most relevant recent piece on post-2020 productivity or GDP-per-capita as a second non-official voice. Already in the SCR, already Tier-admissible, removes the Fraser-alone concentration without a new source family.

### Major Projects

Currently live in the non-official stack: Fraser alone.

| Candidate | Institutional tendency | Topical fit | Why add it |
|---|---|---|---|
| **Canada West Foundation** | Regional, pro-resource-development, centrist-to-right | Infrastructure / major-projects policy in western Canada | Provides a distinct regional analytical voice on MPO impact; institutionally different from Fraser |
| **Public Policy Forum** (not currently live) | Centrist, nonpartisan, convenes industry/gov/academic | Infrastructure and productivity convening work | New analytical family — would require QA Rule 8 reflection + Claude review before admission |
| **Infrastructure Institute (University of Toronto)** (not currently live) | Academic, applied-research | MPO process critique from infrastructure academia | New analytical family — would require QA Rule 8 |

**Recommendation:** Canada West Foundation or Public Policy Forum as the second voice. Canada West is mainly a regional-economic think tank, institutionally distinct from Fraser, and has covered the MPO's role in western-Canada project approvals. Adding it would require a new SCR entry; triggers QA Rule 8.

### Promise Delivery

Currently live in the non-official stack: Fraser alone. Note: Promise Delivery is a tracker (ungraded), so concentration risk is softer here — no grade movement is at stake — but the reader-trust argument for diversification still holds.

| Candidate | Institutional tendency | Topical fit | Why add it |
|---|---|---|---|
| **Polimeter / Poltext (Université Laval)** (not currently live) | Academic, nonpartisan | Canadian political commitment tracking — exactly Promise Delivery's domain | Purpose-built for this role. Adding it would require a new SCR entry; triggers QA Rule 8. Strongest topical fit of any candidate in this audit. |
| **Public Policy Forum** (as above) | Centrist, convening | Broad policy-implementation tracking | Adds a second institutional voice |
| **IRPP / Policy Options** (already live elsewhere) | Centrist, journal | Individual policy commentary | Already in the stack; loose topical fit but available without Rule 8 |

**Recommendation:** Polimeter as a second voice. It is the closest Canadian equivalent to a purpose-built promise-tracker, which would strengthen the tracker's credibility more than any generic think-tank voice. Adding it triggers QA Rule 8 — so the path is: reflection pass on Polimeter's methodology and trust flags, Claude review, SCR entry, then admission.

---

## Path to actually landing the change

For C.D. Howe on Economic Policy Response and IRPP or Public Policy Forum on Major Projects — **no new source family**, so these can be added as source-chain hardening under QA Rule 8's "traceability fix" carve-out. Minimum work:
1. Identify the specific C.D. Howe / PPF paper that corroborates Fraser's claim.
2. Add it to the dimension's `sources` array with a clear label.
3. Note in the dimension's SAM Current-State-Delta that the non-official stack now covers ≥2 institutional voices.
4. No SCR entry needed (C.D. Howe and IRPP are already registered; PPF is not, so if PPF is chosen it triggers Rule 8).

For **Polimeter** on Promise Delivery and **Canada West Foundation** on Major Projects — these are new analytical source families. Rule 8 applies:
1. Reflection pass on the new family's institutional description (institution type, ownership/funding, editorial independence, grounded ideological tendency, best-use boundary, strongest SAM-role fit, trust flags).
2. Claude review of the reflection.
3. SCR entry added under the relevant category.
4. Then, and only then, the family becomes admissible to the dimension's sources array.

Neither Polimeter nor Canada West Foundation should be added as a grade-moving source inside a single editing pass — they need the reflection + review step first.

---

## What this audit does NOT do

- It does not commit the dashboard to adopting any specific alternative. It names candidates so the editor has an informed choice.
- It does not remove Fraser from the three dimensions. Fraser remains the analytical voice it is; this audit argues for adding a second voice alongside, not substituting.
- It does not re-assess whether Fraser's own institutional description in the SCR is accurate. That is its own pass.

---

## Open residuals after this audit

- **Defence & Trade** and **Immigration** — both dimensions still have *no* T2 non-official independent-challenge source per the SCR register-level residuals. Different problem (no source at all, rather than concentration on Fraser). Not covered by this audit; remains open as a separate backlog item.
