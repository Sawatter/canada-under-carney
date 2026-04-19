# Current Roadmap

**Purpose:** Keep the next steps explicit so new ideas do not have to live in memory.

**Status:** Active working roadmap for the live dashboard.

**Last updated:** 2026-04-19

---

## Current State

- Inspectability structure is live across the dashboard.
- Ethics & Transparency is normalized to a true whole-letter `C` with GPA `2.0`.
- Flagship Delivery is normalized to a true whole-letter `C` with GPA `2.0`.
- Stale whole-letter scoring references have been cleaned up in current-state docs.
- Cross-dimension drift audit of the 9 non-probationary graded dimensions passed with minor notes.
- Source sufficiency audit across the 11 graded live dimensions is complete.
- The weakest current source stacks are Climate & Environment, Flagship Delivery, and Economic Policy Response.
- Hard rule adopted for source edits: missing URL / source-chain fixes can be added directly, but any new analytical source family must go through a reflection pass and Claude review before it is treated as settled.
- AI workflow efficiency protocol is now adopted to make reflection/review escalation explicit and reduce over-reflection on bounded tasks.
- Source hardening pass for the weakest dimensions is complete.
- Confidence calibration check is complete; no rescore was required after hardening.
- Source Authority Map is active and integrated into the governance layer.
- Source Characterization Register is active as the canonical per-source-family record (institution type, ownership/funding, editorial independence, grounded ideological tendency, best-use boundary, strongest SAM-role fit, trust flags) across all 30 live source families in dimensions.json.
- Tiny audit-fix pack is complete: Ethics is correctly marked as probationary in the register, and `meta.json` now reflects the live package update date.
- QA-Gatekeeping-Rules.md has been amended to cover grade holds with source-stack change, confidence revisits, whole-letter probationary precision, Combination-Rule-driven changes, new analytical source-family additions (new Rule 8), same-family concentration (Rule 6 addition), symmetric confidence revisit (Rule 4 expansion), tier-nuance on government-data vs press-release and advocacy-with-methodology (Rule 1 edge-case notes), and navigation cross-references to SVP, Carry-Forward-Rules, PMDR, Deconfliction-Matrix, and SAM.
- Ethics source chain strengthened — Office of the Ethics Commissioner and PM blind-trust summary statement added to the live Ethics `sources` array as Tier 1 anchors (traceability fix under the new-analytical-source-family hard rule).
- Ethics anchored indicator landed — the live Ethics entry now carries an official-status anchor set (Commissioner review status, blind trust status, agreed measure filing, declared screen scope, independent governance review status) anchored to direct official filings and the Commissioner registry.
- Live review pass of the dashboard is complete; minor copy-staleness in About and the Dashboard footer was corrected in pass.
- SAM Current State Delta fields reconciled for Ethics, Flagship Delivery, and Climate & Environment after source threading landed.
- Pre-cycle readiness guardrails refreshed in the live data for the most failure-prone files: announcement-bias wording tightened in Economic Policy Response, scope/trigger discipline sharpened in Affordability Response, Carbon Pricing / Climate deconfliction cues made more explicit, and Housing stage language now distinguishes announced from not started.
- Independent methods review is complete; methods hold with targeted amendments and no structural defect blocks another full cycle.
- Commitment Traceability Map is active as a governance join layer across 36 commitments in 11 graded dimensions.
- The Major Projects / Flagship Delivery overlap on the MPO two-year-timeline commitment is resolved. Major Projects remains the sole home; Flagship now carries it only as derivative delivery evidence.
- Dimension cards show grade, rationale, scope, metrics, perspectives, and sources on expansion; confidence / attribution / lag metadata lives in dimensions.json and docs but is no longer rendered as on-card pills (pills were removed 2026-04-19 as not self-explanatory to general readers).

---

## Recently Completed

- Per-Dimension Source Authority Map — built across all 11 graded dimensions, full review complete, integrated 2026-04-18. See [docs/Source-Authority-Map.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Source-Authority-Map.md).
- QA-Gatekeeping-Rules.md amendments — Rule 1 edge-case notes, Rule 2 carry-forward cross-reference, Rule 4 symmetric confidence revisit, Rule 5 probationary cross-reference, Rule 6 same-family concentration blocking condition, new Rule 8 for analytical source-family additions, and a Companion References section. See [docs/QA-Gatekeeping-Rules.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/QA-Gatekeeping-Rules.md).
- Ethics source-chain strengthening — Office of the Ethics Commissioner and PM blind-trust summary statement added to the Ethics entry's `sources` array in [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json). No grade, GPA, or confidence change.
- Ethics anchored-indicator build — official-status anchor added to the live Ethics entry in [src/data/dimensions.json](/Users/chrissawatsky/Downloads/canada-under-carney/src/data/dimensions.json). No grade, GPA, confidence, or rubric change.
- Orphan-threading and SAM reconciliation bundle — C.D. Howe threaded into Flagship Delivery critics perspective; SAM Ethics, Flagship, and Climate Current State Deltas brought current; Carbon Pricing rationale/sourceNote wording consistency confirmed.
- Live review pass — code-level pass over main cards, CompareView, Methodology, ScoreboardHeader, PromiseTracker, WhatsChanged, and About; copy-staleness in About ("12 policy dimensions", Official source list, Independent policy list) and the Dashboard footer source list corrected.
- Pre-cycle readiness guardrail refresh — Economic Policy Response now warns more explicitly against announcement bias, Affordability Response carries a concrete next-trigger, Carbon Pricing / Climate deconfliction cues were tightened, and Housing Supply now labels BCH as announced / not started pending actual construction.
- Commitment Traceability Map — built, pilot-reviewed, full-built, and accepted as a published governance join layer. See [docs/Commitment-Traceability-Map.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Commitment-Traceability-Map.md).
- MPO timeline overlap cleanup — removed the duplicate Flagship Delivery promise so the Major Projects two-year-timeline commitment now has a single primary home, consistent with overlap-prevention discipline.
- Headline GPA display precision reduced from two decimals to one on the live dashboard and README (1.70 → 1.7, 1.49 → 1.5). Underlying math, grade bands, sensitivity analysis, and shadow-log methodology retain full precision; the change is display-only and removes false precision the methodology cannot actually support.
- Card metadata surfacing — live DimensionCards now show confidence, attribution, and lag tags directly on-card using the existing dimension metadata.
- Compare tab removed from the live nav. The feature is now parked as a future analyst tool only if it can justify itself beyond duplicating two expanded cards.
- CTM-T1 durability-tag hygiene pass — seven commitments re-tagged in dimensions.json to match PCR tier examples (HOUSING-001 Commitment → Target; HOUSING-002 Commitment → Program; CARBON-002 Commitment → Legislated; MPROJ-001 Commitment → Legislated; AFFORD-002 Commitment → Framework; AFFORD-003 Commitment → Framework; ECONPOL-001 Framework → Program). CTM body notes reconciled and CTM-T1 residual closed. No grade, GPA, or confidence change (durability is display-only metadata).
- Carbon Pricing Policy source-chain hardening — ECCC Output-Based Pricing System landing page threaded into the live Carbon Pricing Policy `sources` array, closing the CARBON-002 direct-source gap flagged by U10 and CTM-T2. Readers clicking into Carbon Pricing Policy now see the statutory OBPS page alongside the existing CCI / IISD challenge sources. No grade, GPA, or confidence change.
- CTM-T2 partial thread pass — single clean in-repo match threaded: Bill C-5 LEGISinfo URL (already cited in Major Projects for MPROJ-001) added to Defence & Trade `sources` array, closing DEFTRADE-002's direct-legislative-source gap. The remaining 22 CTM-T2 items genuinely require external research (original platform URLs, program announcement pages, specific policy framework documents) and are left as explicit residuals. SAM Defence & Trade Current State Delta reconciled. No grade, GPA, or confidence change.
- Source Characterization Register built — 30-family register with institution type, ownership/funding, editorial independence, grounded ideological tendency (only where sourced in external raters or self-description), best-use boundary, strongest SAM-role fit, and trust flags. Closes the source-characterization reflection + deep-research workstream and provides the canonical record that About/README/DATA-SOURCES source-balance views now point to. Flags Fraser Institute concentration on independent-challenge role across three dimensions, Canadian Climate Institute federal-funding disclosure requirement, and CBC institutional descriptor (public broadcaster / Crown corporation) as stronger than any ideological label. No grade, GPA, or confidence change. See [docs/Source-Characterization-Register.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/Source-Characterization-Register.md).
- Household Impact / "Why two grades?" explainer rewrite — plain-language wording replaces the prior methodology-heavy block across the live dashboard (ScoreboardHeader), About, and README. Leads with motivation, names the four household-weighted dimensions in household-experience terms (housing, cost of living, the economy, government spending), notes Promise Delivery is tracked separately, and closes with the divergence signal. One-line subtitles added under "Full Policy Audit" and "Household Impact" score boxes so each explains itself without requiring the reader to read the full paragraph. No grade, GPA, confidence, weighting, or methodology change.
- "Why two grades?" explainer moved off the live dashboard header and parked in the About tab (plus README for GitHub readers). Score-box subtitles remain on the dashboard so each grade card still answers "what is this?" at first glance; the fuller explanation is now one click away in About rather than a block of text under the score row.
- Card metadata pill removal — Confidence, Attribution, and Lag pills were removed from the live DimensionCard on 2026-04-19. The labels were not self-explanatory to general readers and added cognitive load without clearly clarifying the concepts. Underlying metadata remains in dimensions.json and in governance docs; it simply no longer renders as on-card chips. Re-add only if a user-tested treatment meaningfully clarifies the concepts rather than repeating the same pill model.
- Expanded-dimension readability pass — DimensionCard expansion simplified on 2026-04-19 to cut density. The nested Promise Tracker (previously per-promise text + durability + status pill + evidence blurb inside every dimension card) was replaced with a one-line summary pointing readers to the dedicated Promises tab for item-level detail. Scope and "What Was Inherited" are now collapsed behind disclosure toggles inside the expanded state so default expansion shows only the grade-logic content. The repeated italic methodology disclaimer in the Perspectives section was removed; substantive Critics / Defenders content preserved. Core hierarchy retained: Why This Grade → What Would Change This Grade → Sub-Scores (where applicable) → Key Metrics → Perspectives → Promises (summary) → Sources → optional disclosures (Scope, What Was Inherited). No grade, GPA, confidence, source-array, rubric, SAM, CTM, or schema change.
- Promise Tracker link-model pass — on 2026-04-19 the promise schema in `src/data/dimensions.json` was extended with four optional fields per promise: `originalSourceUrl`, `originalSourceLabel`, `statusSourceUrl`, `statusSourceLabel`. The dedicated Promises tab (PromiseTracker) now renders up to two small link chips on each expanded promise row: a blue "Source →" chip pointing to where the promise was originally made, and an amber "Status evidence →" chip pointing to the document that justifies the current status. Durability tag rendering was also restored on the Promises tab row (previously only on the dimension card's nested tracker, which was removed in the readability pass). Schema seeded opportunistically from CTM source_document URLs and from URLs already present in the live sources arrays — 22 of 43 promises received at least one link chip; 21 remain blank where no clean in-repo match exists. No grade, GPA, confidence, promise status, rubric, SAM, CTM methodology, or SCR change.
- DimensionCard hierarchy pass — on 2026-04-19 the default-expanded dimension card was restructured around the customer's first question ("why is this graded X?") by prioritizing a headline triad. The case-specific rationale now leads the Why This Grade block (regardless of plus/minus vs whole-letter-only dimensions), with the band criterion demoted to a smaller subtitle and active modifiers kept visible but compact. What Would Change This Grade and Interpretive Perspectives were moved behind the same disclosure-toggle pattern already used for Scope and What Was Inherited — both collapsed by default. The methodology-jargon `Construct:` line was removed from the card header; the plain-language status one-liner remains. Core remaining hierarchy: Why This Grade → Key Metrics → Sources → Promises summary → collapsed What Would Change → collapsed Perspectives → collapsed Scope → collapsed What Was Inherited. No grade, GPA, confidence, source-array, rubric, SAM, CTM, dimensions.json, or PromiseTracker change.
- DimensionCard label cleanup — on 2026-04-19 three methodology-flavored labels on the card were renamed to plain English to match the rest of the card's tone: "Interpretive Perspectives" → "Critics and defenders"; "Modifiers:" (inside Why This Grade) → "Adjustments:"; band subtitle "**{band}** band — {bandCriterion}" → "**{band}** means: {bandCriterion}". No structural change, no content change, no methodology change. Copy-only.
- Accessibility pass on disclosure semantics — all four DimensionCard disclosure toggles (Scope, What Would Change This Grade, Critics and defenders, What Was Inherited) now carry `aria-expanded` and `aria-controls`; each revealed content region has a matching `id` and `role="region"`. Disclosure buttons were given `minHeight: 24px` + small vertical padding to meet WCAG 2.5.8 minimum touch-target size. On the Promises tab, each expandable promise row now exposes `role="button"`, `tabIndex={0}`, `aria-expanded`, `aria-controls`, and keyboard Enter/Space handling; the detail region carries a matching `id` and `role="region"`. No visual hierarchy or content change.
- DimensionCard `whatThisGrades` subtitle — on 2026-04-19 a new optional `whatThisGrades` plain-language string field was added to each of the 11 graded dimensions in `src/data/dimensions.json`. The subtitle renders as small italic grey text directly beneath the dimension name and above the status one-liner on both collapsed and expanded card states. Each subtitle is 12-13 words, jargon-free, and stable over time (distinct from the monthly-updated status line). Promise Delivery (ungraded tracker) is not populated. Closes the comprehension gap left by the earlier removal of the methodology-jargon `Construct:` line — readers can now see what each dimension is grading at first glance without having to open Scope or leave the card for the Methodology tab. No grade, GPA, confidence, rubric, or methodology change.
- Subtitle cleanup follow-on — Flagship Delivery's `whatThisGrades` rewritten to explicitly name the five flagship files (defence, housing, major projects, climate, immigration) per Flagship-Delivery-Rules.md, closing the "which five?" ambiguity. Promise Delivery added a parallel tracker-scoped `whatThisGrades` line so every dimension card now has the same name → subtitle → status visual pattern. Two-string edit in dimensions.json; no component code changes required.
- Probation-dimension status-line cleanup — Ethics & Transparency and Flagship Delivery `status` strings trimmed to remove methodology-tail language (leading `PROBATION.` prefix and trailing `Whole-letter grade only — plus/minus precision not supported by evidence` / `Whole-letter grade only — combination rule determines grade mechanically` clauses). Substantive reader-facing state preserved. Methodology context about whole-letter probation and combination-rule mechanics continues to live in Scoring-Rubric-v1.1 and Flagship-Delivery-Rules where it belongs. Effectively closes the dimension-card readability lane — structural work, hierarchy work, label cleanup, subtitle addition, accessibility semantics, subtitle follow-on, and status-line methodology-tail cleanup are all landed. Data-only edit; no code changes.
- Hybrid GPA/score language pass — reader-facing surfaces now use `Score` for the aggregate numeric value and `Grade` for the letter grade; `GPA` is retained only in methodology contexts (Methodology tab, Scoring-Rubric-v1.1, governance docs) and in internal code identifiers (`calculateOverallGPA`, `gpaValue`, `excludeFromGPA`). Specific changes: ScoreboardHeader's two score cards show `Score: 1.7` / `Score: 1.5` instead of `GPA:`; DimensionCard's Promise Delivery pill reads `Tracker · Not scored` instead of `Tracker · Not in GPA`; README's Current Grades table header now reads `Grade Type | Grade | Score` instead of `Grade Type | Score | GPA`. About.jsx was already clean from the prior "Why two grades?" rewrite. No math, schema, methodology, or internal code changes.
- Final first-time-reader framing pass — two tiny additions to close the last onboarding gaps found in the whole-dashboard smoke-check: (1) a one-line italic intro above the Scorecard grid reads "11 policy areas graded A–F across the federal government, updated monthly. Click any card to see the reasoning behind its grade."; (2) a compact italic pointer below the three-card ScoreboardHeader row reads "Two grades, same 11 dimensions. Why? See the About tab." No structural, methodological, or schema changes. The dashboard-framing / dimension-card lane is now paused — further changes should wait for actual user signal rather than another speculative pass.

---

## Now

No immediate work pending. The product cleanup loop is caught up. Next items are triggered by the next monthly cycle or by a new explicit methodology decision.

---

## Next

These are on deck awaiting their triggers.

1. Next-cycle readiness pass
   Focus on operational discipline, not redesign:
   - Economic Policy Response: no movement on announcements alone
   - Affordability Response: scope boundary holds
   - Carbon Pricing / Climate: deconfliction holds
   - Housing Supply: announced != started != completed
   - Major Projects: credit-claiming penalty remains explicit
   This item is cycle-triggered — runs when the next monthly update is being assembled.
---

## Later

These are valid, but not active now.

1. Decide whether Flagship Delivery stays on probation after one real cycle.
2. Reassess whether Promise Delivery should remain purely an ungraded tracker.
3. Consider whether the `gpaValue` override mechanism in [src/utils.js](/Users/chrissawatsky/Downloads/canada-under-carney/src/utils.js) should be retired if it has no live use.
4. Revisit the need for small rubric maintenance only if later audits surface repeated failure patterns.

---

## Not Now

Do not reopen these unless a later audit forces it.

- Full rubric rewrite
- v2 architecture redesign
- Defence & Trade full split
- Carbon Pricing / Climate merge
- Promise Delivery redesign
- New governance/process docs unless they solve a concrete active problem
