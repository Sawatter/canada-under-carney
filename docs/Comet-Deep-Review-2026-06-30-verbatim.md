# Canada Under Carney: Deep Product, Methods & Architecture Review

*Skeptical senior review — product, UX, methodology, governance, data model, and v2 architecture*
*Based on: live site, `perplexity-bundle.md` (repo bundle including all src/, docs/, scripts/), and live URL inspection*

***

## Executive Verdict

This is a **disciplined, seriously-governed, one-person public accountability scorecard** that has substantially outgrown its early "loose editorial" origins. The methodology stack is genuinely impressive for a solo project: published rubric, canonical scoring sheets, tiered source authority, deconfliction rules, QA gatekeeping, shadow testing, a verification protocol, bias-resistance audit, and a corrections policy. The project has done the right work in roughly the right order.

But it has also accumulated **governance mass that is now outpacing its product clarity and maintenance realism**. A smart, skeptical first-time reader will arrive at the dashboard, see two composite scores plus an approval signal plus a promise tracker plus a change log plus a rubric tab plus an about tab — and feel a kind of administrative weight pressing on them before they've even clicked a dimension. The methodology is the project's greatest internal asset and its greatest external communication liability. The more it is documented, the less legible the product becomes to anyone who didn't build it.

The **core thesis is right**: a method-governed, source-traceable, claim-by-claim government scorecard fills a real gap. The **execution is mostly sound**. What is still weak is the gap between the methodology's internal rigour and the reader's ability to feel confident they understand what they're looking at in 90 seconds.

**Overall recommendation**: Ship v1 as-is after one targeted pass on the three issues below. Park v2. Simplify two governance layers that are now adding drag. Do not expand.

***

## Top Findings

*(Ordered by severity/leverage)*

### Finding 1 — The Composite Headline Is Still the Dashboard's Least Defensible Surface

**Why it matters**: The "Full Policy Audit" and "Household Impact" composite GPAs are the first numbers a reader sees, and they are the numbers most likely to be quoted, screenshot, and argued over. Both rest on editorial weighting choices (equal-weight vs. 4-dim double-weight) that are arbitrary in the way all composite index choices are arbitrary. The sensitivity analysis in the repo is honest about this: the Full Policy Audit comes in at 1.65 (C−), the household-weighted view at 1.45 (D), and the attribution-adjusted view at 1.68 (C−). That's a range wide enough to shift the headline by a full letter. The project knows this. The governance docs acknowledge it. The public reader does not see the problem unless they click through several layers.

**Evidence**: `docs/V2-Scoring-Architecture-Brief.md` Section 1: *"The sensitivity analysis shows the equal-weight Full Policy Audit at 1.65 C−, the household-weight view at 1.45 D, and the attribution-adjusted view at 1.68 C−. That range is too wide to treat the headline as a robust performance verdict."* The GPA math in `src/utils.js` uses ordinal letter grades as if they were interval-scale GPA points — a known limitation that even the project's own "skeptical data scientist" reflection pass acknowledged but did not resolve.

**Recommended action**: Add a single, prominent, one-sentence disclosure directly beneath the composite GPA chips: *"This average depends on weighting choices — the score math is below."* The derivation panel already exists; the problem is readers don't know they need it. Do NOT remove the composites — they are the product's value proposition. Just make the limitation legible without requiring a click.

**Confidence**: High

***

### Finding 2 — Defence Trade Is One Dimension Doing Two Jobs, and the Headline Currently Hides That

**Why it matters**: The combined A− grade currently reflects mostly a genuine defence achievement (NATO 2% confirmed) and a partially market-driven trade diversification improvement. The grade obscures the structural difference between these two constructs: defence is a binary execution milestone with high federal attribution; trade diversification is a continuous, externally influenced outcome with ~30% federal attribution. If trade diversification reverses (entirely possible if the tariff war dynamics shift), the defence A would absorb and mask the regression. The sub-score display is present, but the headline grade is what readers remember and share.

**Evidence**: `docs/Canonical-Scoring-Sheets.md`: *"Two fundamentally different constructs in one grade. Defence is a binary milestone met/not met with high federal attribution. Trade is a continuous outcome with heavy external dependence. The A− currently reflects mostly the defence achievement. If trade regresses while defence holds, the grade would hide the regression."* The split tripwire rule is inconsistently stated in three places: the v2 decision memo (≥1.0 GPA divergence for 2 consecutive cycles), `dimensions.json` (direction-or-one-notch), and `CLAUDE.md` (direction only). This inconsistency means the tripwire could be interpreted to trigger — or not trigger — on the same evidence.

**Recommended action**: (1) Reconcile the tripwire definition to the memo's quantitative threshold (≥1.0 GPA divergence × 2 cycles) in all three places in a single commit. (2) Add one sentence to the visible card rationale: *"The headline grade reflects the defence achievement primarily. Trade diversification is separately tracked below."* This is a 30-minute fix with high trust payoff.

**Confidence**: High

***

### Finding 3 — Flagship Delivery Is Still Structurally Weak and Its Probation Has No Defined Exit Mechanism

**Why it matters**: Flagship Delivery grades "cross-cutting delivery capacity" by assessing five flagship files (defence, housing, major projects, climate, immigration). But those same five files are graded in their own dimensions. The Combination Rule produces a Flagship Delivery grade that is mechanically derived from information already inside the grid. If every home dimension holds, Flagship Delivery holds. If one moves, Flagship Delivery may move — in a direction that echoes what the home dimension already said. The dimension is currently C, on probation. The probation condition states it "must prove value through one real cycle using the Combination Rule mechanically" — but there is no documented pass/fail criterion for what "proving value" means, no named evaluator, and no default outcome if the cycle produces ambiguous results.

**Evidence**: `docs/Canonical-Scoring-Sheets.md` (Flagship Delivery entry): *"Probation condition: Must prove value through one real cycle using the Combination Rule mechanically. If it passes, keep. If it fails, demote in v2."* The trigger definitions use `internalRef` rather than external source URLs, meaning this dimension has zero independent source grounding for its triggers — it just points back to the other dimensions.

**Recommended action**: Either (a) define an explicit pass criterion for probation (e.g., "If the Combination Rule produces a result that differs by at least one letter from the simple average of the five home dimensions in at least one of the next two cycles, keep; otherwise demote"), or (b) demote it now to a non-scored structural indicator section with no GPA contribution. The current state — probationary but with no defined exit — is the worst option.

**Confidence**: High

***

### Finding 4 — The Governance Stack Has Become Self-Referentially Heavy

**Why it matters**: The repo contains approximately 30+ governance markdown documents — canonical scoring sheets, source authority map, commitment traceability map, QA gatekeeping rules, deconfliction matrix, measure selection rules, source verification protocol, verification gap review, trust and bias resistance plan, bias resistance audit, correction policy, right of reply, perceived bias survey, validation sprint templates, polling aggregation method, methodology audit brief, inter-rater reliability protocol, grade-change red team protocol, multiple handoff notes, multiple recertification passes, and a product thesis document. Most of these are legitimate and genuinely useful. Several are now pointing at each other in loops (e.g., the Bias-Resistance-Protocol references the audit which references the plan which references the protocol). The governance system is maintaining itself. The question is whether the governance is now adding drag greater than the product value it protects.

**Evidence**: The May source-to-trigger audit found 6 of 10 grade holds where "the cycle cannot say from its own record whether the grade is right." Despite 28 commits of methodology work in one cycle, 6 trigger surfaces were not evaluated. The governance stack did not prevent the gap — it documented the gap after the fact. The source recertification found 106 URLs checked across two passes, with institutional blocker patterns already being known for StatsCan, IISD, OECD, Ethics Commissioner PDFs. The monthly cycle playbook alone has 10 steps with multiple sub-steps each.

**Recommended action**: Audit the governance stack for documents that exist primarily to justify other governance documents. The "Trust and Bias Resistance Plan," the "Methodology Audit Brief," and the "Validation Sprint Templates" are all meta-process documents. Useful for the editor; invisible to readers; adding to cognitive load for any future maintainer. Consider collapsing these into a single "How Updates Are Made" doc. The product can afford to simplify.

**Confidence**: High

***

### Finding 5 — Score Interpretability: The GPA Decimal Number Is Adding False Precision Without Improving Understanding

**Why it matters**: The dashboard displays composite scores like "1.65" and "1.45" alongside letter grades like "C−" and "D." Displaying a GPA number to two decimal places implies measurement precision that the underlying ordinal letter grades do not support. A first-time reader sees "Score 1.65" and may reasonably infer that 1.65 is meaningfully different from 1.5 or 1.8. It is not — within the epistemological limits of this scoring model. The project has taken this seriously at the per-dimension level (Ethics Transparency and Flagship Delivery were moved to whole-letter display because their evidence is too thin for plusminus), but the composite GPA still uses decimal arithmetic on top of ordinal grade inputs.

**Evidence**: `docs/V2-Scoring-Architecture-Brief.md`: *"plusminus precision is still uneven across the instrument... some parts of the model still look more numerically exact than the evidence base really supports."* `src/constants.js` maps grades to GPA points (A=4.0, A−=3.7, B=3.3 etc.) — then arithmetic is performed on these as interval data, which they are not.

**Recommended action**: Display the composite GPA number to one decimal place maximum (e.g., "1.7" not "1.65"), and add a note that this score is a converted average of letter grades, not a continuous measurement. Better: display only the letter grade as the headline and put the GPA number in the derivation panel only.

**Confidence**: Medium-High

***

### Finding 6 — The Promise Tracker Is Under-Surfaced on the Primary View

**Why it matters**: The Promise Tracker is genuinely one of the most valuable surfaces on the dashboard — it answers the democratic accountability question most readers actually have: "Is the government doing what it said it would?" But the tracker is surfaced as one of four header cards (showing just a delivered count), and it requires a tab navigation to see the full picture. The full tracker has status tags, evidence links, durability classifications, and home-dimension pointers — all of which are under-exploited in the primary reading experience. Meanwhile, the Approval Signal (which is explicitly not part of the grade and not part of the performance measurement) gets equal visual weight with a prominent card.

**Evidence**: `src/components/ScoreboardHeader.jsx` — four cards: Household Impact, Full Policy Audit, Promises Delivered (count only, navigates to Promises tab), Approval Signal. The Promises card shows only "delivered / total" with a count of abandoned/stalled below. The full tracker with statuses, evidence, and durability only appears in the tab view.

**Recommended action**: Consider making the Promise Tracker card show a mini-distribution bar (Delivered/In Progress/Stalled/Abandoned proportions) rather than just a count. This costs one line of visual math and gives the reader a substantive signal about commitment momentum at a glance — without requiring a tab click.

**Confidence**: Medium

***

### Finding 7 — The Inspectability Gap Between Methodology Docs and Card Content Is Still Real

**Why it matters**: The `Dimension Inspectability Pilot Spec` (v2 governance) correctly identifies that the current dimension card does not expose the scoring architecture — a reader can see the grade and the rationale but cannot trace: the band threshold that places this grade, the plusminus rationale, the active modifiers, or the conditions that would move the grade by one notch. The pilot spec defines five layers of scoring information, of which the current card only robustly exposes Layer 1 (grade/status) and parts of Layer 3 (rationale). The June 2026 pass improved the drawer reading order (evidence → triggers → sources → rationale), but the structured scoring object itself — band criterion, modifier effect, why not higher/why not lower — remains inside governance docs, not inside the card.

**Evidence**: `docs/v2/Dimension-Inspectability-Pilot-Spec.md` Problem Statement: *"A serious reader can infer grade direction but cannot inspect the grade specifically, cannot see the scoring object, the threshold band that places this grade, the plusminus rationale... This is a structural inspectability problem, not a copywriting problem."* The recent plain-language pass (`changelog.json`, entries ~v5.131–v5.138) improved prose but did not implement the inspectability pilot.

**Recommended action**: Implement the Affordability Response pilot from the Inspectability Spec. Start with just the "Why not higher / Why not lower" two-line block inside the drawer — this is the single highest-impact change for reader trust, requiring only a data-model field addition and two lines of JSX. Do not try to ship the full five-layer spec at once.

**Confidence**: High

***

### Finding 8 — The Single-Editor Dependency Is an Existential Continuity Risk

**Why it matters**: Every governance document, every monthly cycle, every trigger evaluation, every grade judgment, every red-team review (currently inactive), and every QA gatekeeping decision passes through one person. The Grade-Change Red Team Protocol explicitly states: *"Activation pending a willing politically-different reviewer."* The Inter-Rater Reliability Protocol has not yet been run. The V2 Continuity bus-factor doc is listed as a Tier 3 backlog item. The monthly cycle playbook is 10 steps of non-trivial judgment. A single illness, career change, or interest loss stops the project entirely.

**Evidence**: `docs/Trust-And-Bias-Resistance-Plan-2026-05.md`: *"Continuity bus-factor doc — what a successor editor would need to pick up the cycle. Parked in Tier 3 backlog."* `docs/Grade-Change-Red-Team-Protocol.md`: *"Activation pending a willing politically-different reviewer. Until one is available, the editor-applied party-symmetry line is the interim control."* `docs/CLAUDE.md` — the project currently relies on AGENTS.md and CLAUDE.md conventions for any AI-assisted work, with explicit rules about what Claude/Codex can and cannot verify without human review.

**Recommended action**: Move the bus-factor doc from Tier 3 to the next cycle. Even a 500-word "how to hand this project to someone else" document substantially reduces existential risk. Simultaneously, activate the red-team reviewer recruitment — the invite template is already written (`docs/Grade-Change-Red-Team-Reviewer-Invite-2026-06.md`).

**Confidence**: High

***

## Surface-by-Surface Review

### Dashboard / Home View

**What works**: The four-card scorecard row (Household Impact, Full Policy Audit, Promises, Approval) is clear and scannable. The derivation panels ("How is this score built?") are genuinely excellent — a reader can trace the GPA arithmetic in one click. Dark mode, status card, and the freshness indicators are solid product decisions. The grid of dimension cards with grade chips and trend arrows reads at a glance.

**What doesn't work**:
- Two composite GPAs at the top with no immediate signal about what distinguishes them. A reader has to read the subtitle copy to understand "Household Impact" vs. "Full Policy Audit." This is not obvious.
- The Approval Signal card has equal visual prominence with the two scored composite cards, but it explicitly does not affect the grade. The dashboard conflates what is scored and what is context.
- The "Performance Dashboard" label in the header — recently recolored from red to amber — was fixed, but the label itself is debatable. "Performance Scorecard" would be more precise (a scorecard grades; a dashboard displays).
- The title clarifier ("Canada Under Carney is a time-period label") is useful but appears as small secondary copy beneath the main title. It is too small to prevent misreading on first encounter.

***

### Expanded Dimension Cards (Drawer)

**What works**: The recent June 2026 reading-order pass (verdict → evidence → triggers → sources → rationale/criteria) is a real improvement. The "source freshness cue" showing the newest dated source before the full table is smart. The close button improvement (solid dark button vs. faint outline) addressed a concrete usability pain. The MPO cohort pipeline table in Major Projects is an excellent example of domain-specific structured data replacing vague narrative.

**What doesn't work**:
- The Critics/Defenders section still feels like a disclaimer section added for governance reasons rather than a genuine reader tool. Most readers will not know how to weight it. It exists to demonstrate balance; it does not help a reader form a view.
- The Confidence/Attribution/Lag pills still require a "What do these mean?" hover to interpret. They are governance metadata surfaced into the UI without sufficient reader scaffolding, despite the Build 3 fix to add a glossary. The glossary is still expansion-only — these three terms appear on every card, every time, and the explanation is hidden.
- The "Active Modifiers" display is technically correct but UX-hostile. A reader sees "External Constraint: −0.3 applied" with no intuitive explanation of what that means for the grade they're looking at. The number looks precise. It is an editorial judgment bounded by rule.

***

### Promise Tracker

**What works**: The status taxonomy (Delivered / In Progress / Stalled / Abandoned / Thwarted / Unclear / Too Early) is one of the project's strongest design decisions. Each category is operationally defined. Durability classifications (Legislated / Program / Budget Measure / Target / Framework / Commitment) are genuinely useful for readers asking "how permanent is this?" The recertification discipline — quarterly passes with explicit "editor flag" vs. "hold" versus "change" — is good journalism practice.

**What doesn't work**:
- The tracker is visually subordinate to the scored dimensions on the main dashboard. The "Promises Delivered" card shows a number (e.g., "14 / 43") but shows no distributional signal about what the other 29 are doing. A reader doesn't know whether the 29 un-delivered are mostly In Progress or mostly Stalled without clicking through.
- "Thwarted" is a status that requires editorial judgment to distinguish from "Stalled." The Promise Coding Rules define it as requiring "documented attempt + documented external blockage." In practice, the line between "government tried and was blocked" and "government announced and stopped" is fuzzy. The rules are good. The application will always be contestable.
- There is no reader-visible promise trend line. A reader cannot see whether the delivery rate is improving, flat, or declining cycle-over-cycle without manually reading the changelog.

***

### Approval Signal

**What works**: The methodological honesty here is exemplary. The de-housing revert (when the aggregate exceeded all input polls, it was correctly identified and pulled) is exactly the right self-discipline. The published house-effect offsets per pollster are transparent. The explicit statement that the Approval Signal is "ungraded context" and does not affect the composite is well-positioned.

**What doesn't work**:
- The card has equal visual weight with the scored composite cards. A casual reader will equate its signal with the graded scores.
- The 30-day half-life recency decay is documented in `docs/Polling-Aggregation-Method-2026-06.md` but not explained on the card itself. A reader sees "55% approve, 30-day window" without understanding that a poll from 29 days ago carries ~50% of the weight of a poll from today.
- Three firms in the current window is still thin for an aggregate. The project acknowledges this. The limitation should be more prominent on the card — something like "Based on 3 firms. More firms = more reliable estimate."

***

### Methodology Tab

**What works**: The public rubric, source authority map, commitment traceability map, and correction policy links are all real transparency assets. Linking to the actual repo docs is better than paraphrasing them on-page.

**What doesn't work**:
- The Methodology tab is, in practice, a list of links to governance documents. A first-time reader who clicks "Methodology" hoping to understand how the grades work gets a doorway to 30 documents, not an explanation.
- There is no executive summary of the methodology on the tab itself. A 5-sentence explanation of: what gets graded, how a grade is set, what moves a grade, what doesn't move a grade, and what the known limits are — none of this exists as continuous prose on the tab. It is all implied by the links.
- The "Limits of This Model" disclosure (five-bullet block) is at the bottom. First-time readers need to see it first, not last.

***

### About

**What works**: The AI involvement disclosure ("Built with AI assistance — Claude Code, ChatGPT — under human editorial direction") is honest and specific. The "What this is not" boundary-setting (not a poll, not a forecast, not a voting guide, not a popularity measure) is one of the best trust signals on the site.

**What doesn't work**:
- The "Canada Under Carney" title clarifier note (it's a time-period label, not a loaded phrase) appeared in v5.130 in response to a reader complaint. It is now on the home screen, which is correct. But the About page could reinforce this more directly with a brief historical-analogy sentence.
- The funding/affiliation disclosure is still listed as a Tier 3 backlog item. For a project making credibility claims, the absence of even a one-line statement ("This project has no commercial or political funding") is a visible gap to a skeptical reader. It costs one sentence.

***

### Change Log

**What works**: The changelog is one of the project's genuine standout features. Typed entries (grade / event / product / method / minor), versioned, dated, with grade items carrying `from`, `to`, `deltaLabel`, `drivers`, and `link` — this is genuinely excellent provenance. The filter chips (Grade changes / Policy events / Product & methodology / Minor) are smart UX.

**What doesn't work**:
- Minor updates are collapsed by default, which is correct — but the collapsible bucket label says "Minor updates (N)" with no hint of content. A reader doesn't know if those are typo fixes or meaningful methodology adjustments.
- The changelog is implicitly a trust signal ("look how disciplined this project is") but it is also a maintenance cost. At v5.147, there are roughly 147 versioned changes. This level of changelog density is impressive internally and nearly unnavigable externally. A reader looking for "what's changed in the last month" has to know to look at the top entry only.
- Grade change entries link to a `link` field but the link destination is not always immediately obvious from the copy.

***

### Status / Freshness

**What works**: The Dashboard Status card (last evidence scan, next scheduled scan, editor-reviewed score cycle, coverage date, monitor items) is a clean solution to a real problem — distinguishing "the data was checked" from "the grades were reviewed." The validator that checks date alignment and blocks urgency language is a good example of automated governance.

**What doesn't work**:
- The status card is at the bottom of the page. Freshness is one of the first questions a skeptical reader will have ("when was this last updated?"). The `meta.json` version string in the header is the current primary freshness signal, but most readers don't know that a version number implies freshness.
- "Monitor items awaiting review" is a status card field that exposes editorial process to a reader who has no context for what a "monitor item" is. This is insider language leaking into the reader-facing surface.

***

### Data Model / Repo Architecture

**What works**: The `dimensions.json` schema is genuinely well-thought-out. Mandatory fields, tracker-vs-graded distinction, `gradeTriggers` with `setDate` for pre-commitment traceability, `activeModifiers`, `gradeBasis`, `sources` with tier metadata, `projectCohort` for Major Projects — this is solid. The frozen-surface tests (`scripts/test-gpa-frozen-surface.mjs`) that catch silent drift in the GPA math are excellent. The `audit-bias-resistance.mjs` script that checks per-dimension concentration and trigger symmetry mechanically is rare for a project of this scale.

**What doesn't work**:
- `dimensions.json` is doing too much work. It contains the live grade data, the governance metadata (modifiers, confidence, attribution), the methodology prose (rationale, judgmentCall, judgmentDetail), the source stack, the trigger definitions, the project cohort list, and the promise statuses — all in one flat file. As the project grows, this becomes brittle. A single malformed JSON entry breaks the entire dashboard.
- The `gpaValue` override field (allows a direct numeric override of the letter-grade-derived GPA point) is documented but is a potential source of silent inconsistency. There is no automated check that a `gpaValue` and a `grade` field are consistent.
- Source recertification passes are documented in multiple separate files (`Source-Coverage-Ledger-2026-05.md`, `Source-Recertification-2026-05-16.md`, `Source-Recertification-2026-05-25.md`, `Source-Coverage-Ledger-2026-06.md`) rather than a single append-only ledger. Cross-referencing these when reviewing grade justifications is non-trivial.

***

### Governance Docs

**What works**: The QA Gatekeeping Rules (especially Rule 2 — the announcement-vs-implementation ladder — and Rule 5 — multi-notch move requiring 2 independent T1 sources and Referee approval) are high-value methodology controls. The Deconfliction Matrix (which dimension "owns" which metric) is well-designed and prevents double-counting. The Canonical Scoring Sheets with explicit band thresholds, modifier rules, one-notch move triggers, biggest confounders, deconfliction rules, and rater notes are the backbone of the project's credibility claims.

**What doesn't work**:
- The governance stack is now roughly 30 documents. Several of these reference each other in loops that make it difficult to determine which document is the canonical source of truth for a given rule.
- The "Foundational Methodology Audit" (annual cadence) has been documented as a plan but there is no evidence it has been run. The annual cadence means it may not have been due yet — but it is worth noting.
- The Grade-Change Red Team Protocol mechanism is fully designed, the invite template is written, but "activation pending a willing politically-different reviewer" means the most important external validation mechanism is not operational.
- The Inter-Rater Reliability pilot has been designed and documented but not run. These two gaps (red team, IRR) are the most visible weaknesses in the credibility argument to an outside methodologist.

***

### V2 Architecture Direction

**What works**: The V2 Architecture Brief's central argument — that the current model blends commitment, execution, and outcome into single dimension grades — is analytically correct and well-argued. The triaging of dimensions by lens suitability (Immigration as the strongest tri-lens candidate; Ethics Transparency as the clearest non-KPI dimension) is sound. The "parallel performance layer above the current model" (Option B) is the right architectural framing. Preserving v1 while running v2 in shadow is the correct sequencing.

**What doesn't work** (and this is structural):
- The v2 architecture is documented at a level of detail that exceeds what is warranted for something that isn't being built yet. There are now: a V2 Architecture Brief, a Core Tri-Lens Architecture document, a Dimension Applicability Matrix, a Shadow Run Workflow, Open Design Decisions, Pilot Templates, v2 Decision Memos (Defence Trade, Promise Delivery), a v2 Shadow Test Plan, a Dimension Inspectability Pilot Spec, and an AI Workflow Efficiency Protocol. This is approximately 10 architecture documents for a feature that has been explicitly parked. They are maintained, updated, and cross-referenced — which means they are consuming editorial attention without producing user-facing value.
- The tri-lens schema adds three scoring dimensions per graded dimension. For 11 dimensions, that's potentially 33 lens scores plus 11 composites plus 2 headline GPAs. This is a massive complexity increase even if some dimensions only use 1 lens. The user experience implication has not been worked through.

***

## Strongest Decisions

1. **Removing Promise Delivery from the GPA.** This was the right call, done for the right reason (it's derivative and creates double-counting), documented honestly, and executed cleanly. The tracker retains its value; the composite gains validity.

2. **Pre-committed grade triggers with `setDate`.** Every trigger carries the date it was first published, so a reader can verify that the trigger predated the evidence it adjudicates. This is pre-registration discipline applied to a public scorecard. It is genuinely rare in this domain.

3. **The MPO cohort pipeline for Major Projects.** Moving from event-trigger thresholds ("first project completes an MPO cycle") to cohort-progress thresholds ("% of projects advancing through defined stage gates") is a major construct improvement. The six-stage ladder, the project list with referral dates and stage tracking, and the credit-claiming penalty for pre-existing projects are all correct design choices.

4. **The QA Rule 2 implementation ladder (Announced → Legislated → Authorized → Implemented → Outcome).** This is the single most important bias-resistance control in the project. It prevents announcement bias, which is the primary failure mode in government performance scorecards. The Trigger-Verification documents show it operating correctly in practice.

5. **The Deconfliction Matrix.** Explicitly assigning metric "primary homes" across dimensions prevents the same fact from scoring twice. The Carbon Pricing / Climate split (instrument vs. framework) and the Flagship Delivery / home dimensions split (delivery vs. outcome) are well-drawn.

6. **The `gpaToGrade` frozen-surface test.** Automatically catching silent drift in the GPA math is a lightweight but high-value quality control that many comparable projects skip entirely.

7. **Reversion of the house-effect de-housing when it pushed the aggregate above all input polls.** This is correct scientific self-discipline. The project caught and documented a methodological overcorrection before it became a credibility problem.

8. **The Source Tier Distribution document.** Publishing the T1–T5 tier breakdown per dimension (including calling out Major Projects as the most government-page-reliant at 38% T1–T2) is genuine transparency. It makes the evidence asymmetries legible rather than hiding them.

***

## Weakest Decisions

1. **Flagship Delivery on open-ended probation.** Probation without a defined exit criterion is not probation — it's limbo with extra paperwork. The dimension either earns its place by a defined test or it doesn't. Currently it earns its place by not failing.

2. **The Confidence/Attribution/Lag pills displayed on every card without default explanations.** These are governance metadata that the editor needs; they are friction that the reader encounters. Three unlabeled pills appearing on every dimension card, requiring a hidden "What do these mean?" expansion to interpret, is the clearest example of internal governance vocabulary leaking into reader-facing product.

3. **The composite GPA displayed to two decimal places.** The false precision implied by "Score 1.65" vs. "Score 1.45" is not supported by the ordinal measurement model underneath it. This is the most visible signal to a quantitatively literate reader that the project is claiming more precision than it has.

4. **The Approval Signal card given equal visual weight with the two scored composites.** The Approval Signal is explicitly not a performance score. Its visual equality with Household Impact and Full Policy Audit implies a symmetry that the methodology explicitly rejects.

5. **The v2 architecture documented at implementation depth while explicitly parked.** Approximately 10 architecture documents for a feature not being built is documentation accruing governance debt. Every future cycle that touches a governance doc will need to check whether the v2 architecture is still valid for that doc. The shadow docs are a maintenance surface that currently produces zero user-facing value.

6. **Single-editor operations with no active redundancy mechanism.** The Red Team protocol designed but un-activated, the IRR pilot designed but un-run, the bus-factor doc parked in Tier 3 — these are collectively the project's highest operational risk.

7. **"Critics / Defenders" as a governance balance mechanism surfaced as a reader tool.** The critics/defenders section exists to satisfy the bias-resistance requirement. It reads as a legal disclaimer rather than as genuine reader guidance. A well-written one-sentence bottom-line (e.g., "The strongest contrary reading is X") would serve the reader better than the current symmetrical display of opposing quotes.

***

## V2 Recommendation

**Park v2, but with one specific exception.**

The full tri-lens architecture should remain parked. The reasoning in the V2 Architecture Brief is sound, but the implementation cost — 10 documents already produced, 33 potential lens scores across 11 dimensions, 2 additional open design decisions, an unresolved composite weighting question, and a shadow run workflow that has not yet been executed — substantially exceeds the user-facing value at this stage. Running v2 before v1 has proven stable and found an audience is premature.

**The one exception**: The Dimension Inspectability Pilot (the "Why not higher / Why not lower" structured block for Affordability Response) should proceed as described. It does not require v2 architecture changes. It works within the current schema by adding two data fields and two lines of JSX per dimension. It is the minimum viable version of the most valuable v2 idea: making the scoring object visible without requiring a governance document reader. Pilot it on one dimension (Affordability Response), assess whether readers engage with it, and extend to others only if it works.

The Defence/Trade split tripwire should be reconciled to a consistent definition and monitored, but the actual split should not be executed until the tripwire fires on live data.

The tri-lens architecture should remain as internal design artifacts. They should not be maintained between cycles — the cost of maintenance is now exceeding the option value they preserve.

***

## Next 3 Moves

### Move 1 — Two-Sentence Composite Disclaimer + One-Decimal GPA Display

**What**: Add one sentence immediately below both composite GPA chips: *"Score reflects editorial weighting choices — see math below."* Change displayed GPA from two decimal places to one (e.g., "1.65" → "1.7"). Both changes are one CSS/JSX edit and one `utils.js` rounding change.

**Why this first**: The composite GPA is the most-shared and most-misread surface. This is a 30-minute change with the highest per-minute trust payoff. It does not require methodology changes, governance doc updates, or schema changes.

***

### Move 2 — Implement the Affordability Response Inspectability Pilot

**What**: Add two data fields to `dimensions.json` for the Affordability Response entry: `whyNotHigher` ("At C, relief would cover 20–40% of cost increase. Current estimate: ~15%.") and `whyNotLower` ("At F, there would be no federal response. The Grocery Benefit and Grocery Code exist."). Render these as two short labeled lines in the dimension drawer, below the scoring band statement.

**Why this second**: This is the single highest-impact change for reader trust in the dimension detail view. It directly answers the question every skeptical reader has ("why isn't this graded higher/lower?") without requiring them to read the governance docs. The spec is already written. The work is schema + two lines of JSX + two data fields per dimension. Start with Affordability, assess, extend.

***

### Move 3 — Activate the Red Team Reviewer and Produce the Bus-Factor Doc

**What**: (a) Send the Grade-Change Red Team Reviewer invite (the template is already in `docs/Grade-Change-Red-Team-Reviewer-Invite-2026-06.md`). Recruit one willing politically-different reader. (b) Write the bus-factor handoff doc in 500 words: what the monthly cycle requires, which docs to read first, where the frozen surfaces are, and how to run the key scripts.

**Why this third**: These are the two highest-existential-risk items in the project. The Red Team reviewer closes the most important external-validation gap in the bias-resistance argument. The bus-factor doc converts a single-person knowledge dependency into a transferable process. Neither requires new code, new methodology, or governance changes. The Red Team invite is already written and takes 10 minutes to send.

***

## Appendix: Missing Access / Limits

**What was accessible**:
- Full `perplexity-bundle.md` repo bundle including all `src/components/`, `src/data/`, `src/utils.js`, `src/constants.js`, `docs/` (all named governance files), `scripts/`, `.github/workflows/`, `CLAUDE.md`, `AGENTS.md`, `src/index.css` references

**What was not accessible**:
- The live website (`https://sawatter.github.io/canada-under-carney/`) returned no content via the URL content tool. The site is a React SPA that requires JavaScript execution to render — the URL fetcher retrieved an empty shell. All UI analysis therefore depends on component source code (`Dashboard.jsx`, `DimensionCard.jsx`, `ScoreboardHeader.jsx`, etc.) rather than on direct visual inspection of the rendered application.
- This means the review cannot comment on: actual rendered layout and spacing on mobile vs. desktop, real animation behavior, the exact visual reading order a first-time visitor experiences, or any rendering quirks that only appear in the browser. All UI findings are based on JSX source code and described behavior in docs and changelogs.
- `src/index.css` was referenced but not fully excerpted in the bundle — design token values and mobile breakpoint overrides were inferred from component inline styles.
- `history.json` (per-cycle GPA history for trend charts) was not surfaced in the search results — trend visualization analysis is therefore limited.
- The actual live `approval-polls.json` content was partially available (JSON structure and several poll entries visible) but the full rolling window aggregate calculation result could not be independently verified without live JS execution.