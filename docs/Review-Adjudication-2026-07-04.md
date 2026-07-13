# Review Adjudication - 2026-07-04

Claim-by-claim adjudication of the 2026-07-04 in-house adversarial review, per the operating loop: findings are claims to check, accepted findings become fixes or roadmap items, rejected findings get a logged reason.

**Review - Claude Fable in-house adversarial pass** over the live site at v5.154 plus `origin/main`, run 2026-07-04. The July architectural WIP sat uncommitted in the working tree and was out of scope; the review covered landed state only. Adjudicated the same day. Copy and documentation fixes were prepared on July 4 and land with v5.155 on 2026-07-13; queued items are mirrored in [Current-Roadmap.md](Current-Roadmap.md) so nothing lives only in this doc.

---

## Adjudication

| # | Finding | Verdict | Action |
|---|---|---|---|
| H1 | Defence & Trade `whyNotHigher` misfires against the published ladder: it says the top grade "would need spending clearly above the 2% floor," but the published A criterion reads "at or above 2.0%," which the confirmed 2.01% already meets | **Accepted (HIGH)** | Copy fixed in v5.155. The underlying criterion tension is queued as an editor adjudication (Q1). |
| H2 | Economic Policy why-not pair is internally inconsistent: `whyNotLower` names two enacted levers (productivity super-deduction in force, internal trade legislation enacted) while the D band requires fewer than two levers clearly funded or authorized | **Accepted (HIGH)** | Copy narrowed in v5.155, and the lever summary now states the literal count honestly. The binding-leg tension remains queued for editor adjudication (Q2); v5.155 does not resolve it. |
| F1 | Ethics `whyNotLower` only half-rebuts the D band: it answers the "fewer than three disclosure pieces" leg but not D's second leg (material gaps with no independent review plus an official concern or two governance critiques) | **Accepted** | Fixed in v5.155. |
| F2 | Rubric-tab plain explainer conflicts with the whole-letter dimensions: its one-notch move framing does not hold for Ethics and Flagship, whose smallest move is a whole letter | **Accepted** | Fixed in v5.155 (Methodology.jsx wording). |
| F3 | Redundancy cluster: several why-not lines restate the adjacent threshold row nearly verbatim instead of adding the judgment that places the file in-band | **Accepted** | Copy improved in v5.155. |
| F4 | CLAUDE.md drift: the Flagship probation bullet was still future-tense after the July exit, the `gradeBasis.whyNotHigher` / `whyNotLower` data contract was undocumented, and the changelog type union omitted `"fix"` (used 11 times in changelog.json and folded quietly by WhatsChanged) | **Accepted** | Lands in v5.155: past-tense retention wording pointing at Flagship-Delivery-Rules.md, a why-not bullet mirroring the verdictLine contract, and `"fix"` added to the type union with the quiet-bucket note. |
| F5 | Roadmap hard-codes stale counts: "all 30 live source families" (the SCR registers 40 graded-dimension families plus 5 Approval Signal families) and "All 99 cited sources" in two places (live data holds 101 source entries across 97 unique labels) | **Accepted** | Lands in v5.155: the SCR category summary is named as the count of record, and the source-date sentences state the closed gate without a hard-coded count. |
| F6 | Prototype-App-Shell-Parking says "currently at v5.147" while the roadmap cites the doc as the live release record | **Accepted** | Lands in v5.155: the doc is marked as a frozen record as of 2026-07-04, with meta.json and changelog.json named for the current version and later history. |
| F7 | README Source Balance table was missing about 10 of the 40 SCR families (Macdonald-Laurier, CSLS, Signal49, Scotiabank Economics, Retail Council of Canada, CHBA, Grocery Code Office, Food Banks Canada, Maytree, Canada Energy Regulator) | **Accepted** | Lands in v5.155: trimmed to institution-type categories with counts checked against the SCR category summary, and the SCR named as the count of record so the table no longer hand-maintains family rows. |
| F8 | The v5.153 changelog entry uses the matrix word "full" ("with full text inside the opened card") | **Deferred** | Changelog history is treated as an immutable record, and the usage is descriptive rather than assurance language. Logged, not edited. |
| F9 | Rubric explainer wording nits | **Accepted** | Fixed in v5.155. |
| Q1 | Criterion tension, Defence & Trade: the published A criterion reads "at or above 2.0%," so the defence leg is already met at 2.01%; the hold at A- rests on trade-gain attribution and durability judgment the ladder does not spell out | **Queued - editor adjudication** | Either the A band gains an explicit attribution / durability clause, or the hold reasoning is re-derived from the ladder as written. Roadmap Next item 5. |
| Q2 | Criterion tension, Economic Policy Response: the enacted lever count (two) points at the C band's lever leg while the investment outcome (fifth straight quarterly decline) points at D, and the ladder does not say which leg wins | **Queued - editor adjudication** | Editor names the binding leg or amends the band wording. Roadmap Next item 5. |
| Q3 | Desktop tab order reaches the dimension cards before the sidebar | **Queued - editor think** | Whether cards-before-sidebar is the intended reading order or a focus-order defect is a product call that should precede any DOM reorder. Roadmap Next item 5. |
| Q4 | The continuity plan exists in docs but has no reader-visible pointer in the app | **Queued** | Fold a pointer into the editor-gated About funding / affiliation edit rather than making it a separate release. Roadmap Next item 5. |

## Disposition summary

Ten findings accepted, one deferred with a logged reason, and four queued. The Defence copy is re-derived from the existing trade marker. Economic Policy now states the count conflict honestly but leaves the binding-leg decision open. The queued items are mirrored in the roadmap's Next lane so this doc is a record, not the only home.
