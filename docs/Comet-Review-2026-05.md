# Comet Review — May 2026

**Reviewer:** Comet (Perplexity)
**Run date:** 2026-05-23
**Dashboard version reviewed:** v5.56
**Method:** Bundle file upload (`tmp/perplexity-bundle.md` v2, with React components) + live dashboard at `https://sawatter.github.io/canada-under-carney/`
**Prompt source:** `docs/AI-Verification-Methodology.md` Comet-adapted variant
**Discipline:** Verbatim-quote requirement enforced; Comet cited file paths and direct quotes throughout.

**Session note:** Comet's first attempt without the bundle attached failed honestly ("I can only see the text you paste directly into the chat"). After the bundle was attached and the prompt re-issued, Comet ran 31 steps and produced sections 1 through 10. Section 10 cut off mid-sentence in the Indigenous reconciliation finding; the closing "Confidence and Limits" paragraph was not produced. The captured text below is therefore mostly complete with one partial close.

**Convergence note:** Where this review confirms prior single-model findings from the 2026-05-17 Grok probe, the finding moves to **2-of-2 convergence** per `docs/AI-Verification-Methodology.md` and is carried into June 2026 as real signal. Refinements to prior findings (e.g., the Change Log nuance on version archive) are noted.

---

## Section 1 — Bias Assessment

### (a) Rubric-design bias — what gets graded vs. what doesn't

The 11 dimensions are grounded in a defensible "kitchen-table + core federal infrastructure" framing. From `docs/Product-Thesis.md`: "Not a comprehensive indicator dashboard. It scores specific defined constructs, not every available metric." Legitimate design choice, but it creates selection-level bias risk in two places.

**Defence & Trade is a mixed-construct** combining a hard-outcome file (NATO %) and a market-driven trend (US trade share). From `src/data/dimensions.json` judgmentCall: "High grade rests on delivery; trade gains are discounted because some improvement is market-driven." Discount documented and correct, but the combined construct still inflates the grade ceiling: a government could inherit strong trade momentum and hit NATO spending through accounting reclassification while doing little active diversification work, and still sit at A-. Tilt: mild positive for a government with structural tailwinds on trade.

What would change my mind: split Defence and Trade per the tripwire rule already in CLAUDE.md ("carries a tripwire if the two halves move opposite directions for two consecutive monthly review cycles"). Until the split happens, the composite grade is not fully auditable.

**Flagship Delivery is a meta-rollup, not a peer dimension.** From `docs/Scoring-Rubric-v1.1.md`: "Flagship Delivery is a meta-rollup, not a peer dimension." Including it in the GPA while Housing, Climate, and Major Projects (three of the five inputs) are all D or C range means it adds a synthetic averaging layer that effectively double-counts bad news from those files. Tilt: negative (pulls the Full Policy Audit score lower than the 10 peer dimensions alone would).

### (b) Evidence-weighting bias — source-family balance in grade-moving chains

From `docs/Bias-Resistance-Audit-2026-05.md`: "Finding 2: Defenders cite fewer named sources than critics on 5 dimensions. Real perceived-bias surface. Shipped v5.29." That fix is real, but a structural asymmetry persists in **Climate & Environment**: up-triggers rely on CCI and IISD (both environment-aligned institutes); down-triggers rely on ECCC departmental plans and CBC/The Conversation. No right-leaning think tank or energy-sector analysis appears in the grade-moving chain. Fraser Institute is in the pool for Major Projects and Economic Policy but not for Climate. Tilt: the evidence chain reads more credibly to readers who already trust CCI than to readers who trust Macdonald-Laurier.

What would change my mind: if a right-leaning policy institute (Fraser, Macdonald-Laurier, MEI) published an analysis agreeing that no funded replacement strategy exists post-reversal, the Climate grade's credibility with skeptics would be materially stronger.

### (c) Framing bias — how grades and rationale are written

The rubric's "Judgment enters in X" anchor is consistently applied — `docs/Bias-Resistance-Audit-2026-05.md` confirms: "The Judgment enters in X anchor and the 'The grade is about Y, not Z' scope-disclaimer pattern are party-symmetric devices applied uniformly." Genuine strength.

Residual framing risk: **Affordability Response** card copy reads "Grocery Code voluntary. Tariff costs add $1,450–$2,000/yr per household." Tariff cost framing is sourced and correct, but presents one interpretive lens (tariffs as federal policy failure) without equally foregrounding the structural case that tariffs were a retaliatory response to U.S. action that was not in the government's control. The judgmentCall acknowledges scope ("Grade reflects federal policy response, not global price levels"), but the card summary leads with the cost number before the caveat — which is the order a confirmation-biased reader stops at.

Fix: swap the order. Open with the scope caveat, then the evidence. Two sentences.

## Section 2 — Measure and Threshold Rigor

Three dimensions where two independent analysts would most likely diverge, ranked:

### #1 — Economic Policy Response (most operationally underspecified)

From live dashboard judgmentCall: "Low grade reflects execution status across policy levers, with inherited productivity weakness treated as context." Threshold ladder C criterion: "a real response exists and some delivery is visible." Problem: **"core levers" is never defined in a numbered list tied to the current policy environment.** Card copy says "fewer than two core levers are at authorized-or-executing stage," implying a list exists, but it's not published. Two analysts could disagree on whether, say, the Canada Growth Fund qualifies as a "core lever" or a repackaged existing commitment, and would land on D vs. C without a published lever list.

**Language to change:** `gradeBasis.bandCriterion` for Economic Policy should enumerate the levers explicitly ("from the following 6 federal productivity levers: …") with a stated threshold ("C = 2–3 levers at executing stage"). Right now "fewer than two" implies a list that isn't publicly attached to the grade.

### #2 — Ethics & Transparency (normative threshold)

From the Scorecard: "Middle grade separates incomplete disclosure machinery from any claim of proven wrongdoing." The C criterion in the rubric reads "A real response exists and some delivery is visible, but it covers only part of what was promised." Applied to ethics, **"incomplete disclosure machinery" is a judgment about what "complete" looks like — and that's nowhere defined as a bright line.** The up-trigger references a specific external event (PM publishes full Brookfield accounting), which is operational. But the band criterion for C vs D turns on the disclosure machinery overall, which is normative.

**Language to change:** add a published checklist of disclosure-machinery components (e.g., PM ethics screen, Conflict of Interest Act compliance, proactive Annex A filing) with stated threshold ("C = at least 3 of 5 components present"). Converts a normative judgment into a checklist.

### #3 — Flagship Delivery (derived grade, weighting opaque)

From the live dashboard: "Grade follows the flagship-file distribution, not a second opinion on each policy's merits." Issue: **"distribution" is not operationalized with a published formula.** If three of five flagship files are D-range and two are A/C-range, does the meta-grade average to a D+ or use median? The rubric doesn't say. The current grade is C despite Housing (D), Climate (D), and Major Projects (C) all being poor performers — implying Defence (A-) and Immigration (C+) are weighting the average upward significantly.

**Language to change:** publish the exact derivation formula in `gradeBasis.bandCriterion` for Flagship Delivery (e.g., "grade = average of the five flagship-file grades, rounded to the nearest half-letter") and show the arithmetic in the WHY THIS GRADE section.

## Section 3 — Coverage Gaps

- **Wage policy / public-sector deals:** wages are in scope as a sub-indicator under Economic Policy Response, but the dedicated labour-relations / public-sector bargaining angle is invisible. Treasury Board negotiations and PSAC/CUPE agreements are specific, federal, measurable commitments. **Verdict:** defensible as scope choice, but worth a one-sentence note in the About scoring-boundary statement.

- **Alberta pipeline MOU / pipelines beyond Major Projects:** if a specific MOU is not in the MPO cohort, it wouldn't appear in Major Projects at all. The dashboard grades documented post-designation movement; pre-designation projects don't register. From `src/data/dimensions.json` Major Projects judgmentCall: "Grade rests on documented post-designation movement, not announcement count or project desirability." **Verdict:** defensible — pre-designation projects would be counting announcements, which the rubric correctly excludes. About tab should say so explicitly.

- **Indigenous reconciliation:** not graded. About tab's "what this does not grade" list includes symbolic actions, but reconciliation has measurable commitments and durable artifacts (MMIWG implementation, UNDRIP legislation, nation-to-nation agreements) that are not purely symbolic. **The most substantive gap in the coverage boundary.** No scored dimension and no explicit "reconciliation is out of scope because X" statement. **Verdict:** not fully defensible without a published rationale. Should either become a 12th dimension or appear explicitly in the About scoring-boundary section with a stated reason.

- **Healthcare federal-provincial transfers:** the CHT envelope is a specific, large, politically live commitment area that doesn't surface in published grades. May be folded into Fiscal Health. **Verdict:** partially defensible if Fiscal Health captures CHT, but should be named explicitly in the Fiscal Health construct definition.

- **Foreign policy / diplomacy beyond NATO:** Defence & Trade is bounded to NATO spending and US trade diversification. Broader diplomacy (Indo-Pacific strategy, multilateral institution engagement, 5 Eyes cooperation) is not scored. **Verdict:** defensible — those are harder to tie to specific measurable commitments — but the Defence & Trade card should say "this grades defence spending and trade diversification, not broader foreign policy posture."

## Section 4 — Source Diversity

**Right-leaning or market-oriented sources** (Fraser Institute, C.D. Howe) are concentrated in Major Projects and Fiscal Health. Neither appears as a grade-moving source in Climate & Environment or Affordability Response — the two dimensions where skeptical conservative readers would be most motivated to challenge the grade.

**Mainstream media:** Globe and Mail, CBC News, The Narwhal, National Observer. No National Post, Toronto Sun, or explicitly right-of-centre publication appears in any grade-moving chain. **Most visible source-family gap for a partisan-skeptical reader.**

**Dimensions with most-skewed grade-moving sources:**

1. **Climate & Environment** — up and down triggers both come from CCI, IISD, ECCC, CBC, The Conversation. No right-leaning or energy-sector source.
2. **Affordability Response** — StatCan/PBO for numbers, but interpretive framing leans on consumer-cost reporting (CBC, Globe) with no industry or business-group analysis.
3. **Immigration** — PBO Demographic Implications is good, but the judgment about whether the "levels correction is substantial and necessary" relies heavily on government-sourced IRCC data without an independent challenge from a pro-immigration source (Maytree, CCPA) or restrictionist source (Macdonald-Laurier).

## Section 5 — Live UX Test

**Path from skeptic to evidence — lowest grade (Affordability Response D-):**
- Click card → 1 click → drawer opens, Skeptic Path callout visible
- Click "(1) the rule" → 1 click → jumps to HOW THIS FILE IS SCORED ✅
- Click "(2) what would move the grade" → 1 click → jumps to "What changes this grade" ✅
- Rubric tab from nav bar → 1 click → full band criteria visible
- **Total: 3 clicks. Excellent for this dashboard type.**

**Skeptic Path anchor link test — Fiscal Health drawer:**
- (1) the rule → ✅ correct
- (2) what would move the grade → ✅ correct
- (3) the evidence under each metric → ✅ correct
- (4) the cited sources → **overshoots slightly. Focus lands just below the SOURCES block rather than on its heading. Minor anchor alignment bug.**
- (5) named critic and defender views → ✅ correct, opens collapsed section

**Methodology FAQ in 2 clicks from home:** ✅ confirmed working. Click "read the safeguards" in header trust frame → Rubric tab opens at Methodology Safeguards panel → scroll to FAQ inline.

**Citation format in About tab:** copy-paste ready for URL and rubric version, but **the instruction to get the version "from meta.json" requires visiting GitHub.** The header already shows "v5.56" and "UPDATED 2026-05-17". Citation block should just say "version v5.56" inline rather than sending the reader to meta.json.

**Keyboard navigation:** Tab key moves focus sequentially through nav tabs with clearly visible blue outline focus ring. DimensionCard keyboard fix (v5.40) confirmed: dimension cards are reachable by keyboard.

**Mobile layout (~390px):** could not directly resize in this session. Bundle attests (v5.42 viewport-check rule, closure memo) that desktop 1024px and phone 414px smoke checks confirmed clean stacking. Noted as bundle-attested rather than directly observed.

## Section 6 — Code Review

**DimensionCard.jsx — Skeptic Path scroll timing fragility.** The v5.44 jump-handler "waits for React state updates" before scrolling. That phrase is a maintenance-risk signal: typically a setTimeout or useEffect delay is used to let the drawer expand before scrolling, which is fragile. If animation duration changes or the component re-renders faster on a faster device, the scroll fires before the target element exists. **The fact that anchor #4 (sources) already overshoots is consistent with timing-dependent scroll.**

Fix for June: replace timing-based scroll with a ResizeObserver or useEffect that fires only after the drawer's DOM height has settled, not after a fixed delay.

**`src/data/dimensions.json` as single source of truth.** No automated test verifies that `POCKETBOOK_DIMS` in constants.js and `excludeFromGPA` in dimensions.json stay in sync. CLAUDE.md mandates "Don't change grade math without explicit user approval" as a governance guardrail, but not a code check. A small unit test asserting that every entry in POCKETBOOK_DIMS exists as a dimension id and that exactly one dimension has `excludeFromGPA: true` would catch drift before it ships.

**`utils.js` GPA calculation.** Frozen surface per CLAUDE.md, but no tests guard it. A future agent could edit utils.js without realizing it's frozen. Add a `// FROZEN SURFACE — do not modify without explicit editor approval` comment block at the top, plus a Vitest/Jest test that asserts the GPA output for a known set of inputs matches expected values.

**ScoreboardHeader.jsx — inline color drift.** Bundle records that v5.43 found the old C-range #e68a00 was hardcoded in two places (ScoreboardHeader, Promises conditional) and replaced with #8d5a00. The fix was correct, but **no lint rule or CI check prevents this class of drift from recurring.** A simple ESLint rule or grep-in-CI that flags hex color literals in .jsx files would prevent it.

**Missing tests around grade math.** The `npm run test:data` script validates data shape but not numerical output of the GPA formula. A rounding change, weight change, or new dimension could silently produce a wrong headline score.

## Section 7 — Accessibility Spot-Check

**Bundle attests** (from `docs/Accessibility-Audit-2026-05.md` and the closure memo):
- Automated axe-core 4.10 on live v5.46: 0 violations, 24 passes, 1 incomplete, 37 inapplicable.
- 15 TrendArrow glyph spans correctly carrying aria-label, role=img, title — axe limitation for pure-glyph content, not a real violation.
- Skip-to-content link added v5.41.
- All 12 grade chip colors verified WCAG AA, minimum 4.51:1.

**Two carry-forward items confirmed for June:**
1. **Event badge contrast.** #e65100 on #fff3e0, ratio 3.45:1 — fails AA. Fix: darken foreground to ~#c43d00 or change background to white.
2. **Nested-interactive flag on DimensionCard wrapper** when drawer is open — axe flags inner buttons rendered inside an element with role="button". Fix: restructure so the outer wrapper is role="region" or remove role from wrapper when drawer is open.

**Directly confirmed on live:**
- Skip-to-content link: ✅ present at top of page
- Focus ring: ✅ clearly visible blue outline on tab elements
- Tab order: ✅ logical — moves left to right through nav tabs, then into page content
- Grade chip colors: ✅ rendered correctly

## Section 8 — Comparative Benchmarking

**What Canada Under Carney does that comparators don't:**

1. **Published, versioned rubric attached to grades.** Politifact's Truth-O-Meter uses prose methodology without numeric threshold ladders. GovTrack has no interpretive grades. The threshold ladder here is more operationalized than any comparable tool.
2. **Explicit judgment-call disclosure on every card.** USAFacts and ProPublica present data without interpretive grades. FullFact UK rates individual claims but doesn't aggregate into a policy scorecard. The named-judgment pattern here is stronger.
3. **Dimension-level critics and defenders.** Both the strongest case for the grade and the strongest case against it appear in the same drawer. A meaningful epistemological step beyond fact-check format.
4. **Separation of approval signal from performance grades.** "Public approval of PM Carney. Not part of the grades." Polling and performance are routinely conflated in other dashboards; this one enforces the separation.

**What comparators do that this dashboard doesn't yet:**

1. **Historical grade charts.** GovTrack, USAFacts, even Politifact's promise meters show time series. This dashboard has a Change Log and `history.json` but no visible per-dimension grade-history sparkline in the UI.
2. **Public contributor / verification layer.** FullFact UK has a public fact-check submission process and names individual fact-checkers per article. Politifact names the author of each rating. This dashboard names "the human editor" but not by name, affiliation, or credential.
3. **Machine-readable data export.** USAFacts and ProPublica publish APIs or CSVs. `dimensions.json` is in the public repo but there's no documented stable API endpoint or download link surfaced in the UI.

## Section 9 — Next-Level Recommendations for June 2026

Prioritized for moving from "solid solo civic project" to "citable in journalism and policy work."

### 1. Editor identity disclosure on About (0.5 days — highest-leverage, lowest-effort)

For journalism citability, the About tab needs a name, short bio, and stated conflict-of-interest declaration. One paragraph, two to four sentences. Example: "Canada Under Carney is edited by [Name], a [role/background]. [Name] has no financial interest in any graded policy area and no current affiliation with any federal political party. Corrections and right-of-reply submissions are reviewed independently." Closes the most commonly cited barrier to journalistic citation. Flagged by both prior AI reviews.

### 2. Per-dimension grade history sparkline in the drawer (3 to 5 days)

`history.json` exists per CLAUDE.md. Rendering a small 6-to-12-month grade-trend sparkline inside each dimension drawer (simple SVG path or minimal chart) would make the dashboard substantially more citable. A reporter could reference "Housing Supply has held at D for four consecutive cycles" with a visual anchor. Single biggest UX gap relative to Politifact's promise meters or GovTrack's vote history.

### 3. Publish the Flagship Delivery derivation formula (0.5 days)

In `gradeBasis.bandCriterion` for Flagship Delivery, write the exact arithmetic (e.g., "grade = average of the five flagship-file grades, rounded to the nearest half-letter"). Show the arithmetic in the card's WHY THIS GRADE section. Removes the most operationally underspecified grade derivation.

### 4. Indigenous reconciliation boundary statement or new dimension (1 day for statement; 2-3 weeks for a full dimension)

Most substantive unexplained coverage gap. For June: add a named paragraph in the About scoring-boundary section explaining why reconciliation is not currently graded. Removes a legitimate criticism from any reader who asks. A full dimension is a longer project — scope for Q4 foundational audit.

### 5. Anchor link #4 scroll overshoot + Event badge contrast (1 day combined)

Two small carry-forwards. Adjust the scroll target ID for the sources anchor so it lands on the SOURCES heading, not below it. Fix Event badge contrast (#e65100 on #fff3e0, ratio 3.45:1) by changing foreground to ~#c43d00 or background to white. One-cycle bugs that cost credibility disproportionate to fix effort.

## Section 10 — Prior-Review Gap Confirmation (partial — session cut off)

1. **"No editor disclosure surface"** — **Confirmed real gap.** About tab says "All grading decisions are made by the human editor" but names no one. The closure memo explicitly lists this as requiring editor action. **2-of-2 convergence with Grok 2026-05-17.**

2. **"No reader-facing version archive"** — **Partially confirmed, partially refuted.** The Change Log tab is live and contains versioned entries with dates, grade changes, and rationale. What doesn't exist is a **browseable snapshot archive** — a reader can see what changed and when, but can't load the dashboard as it looked on, say, 2026-03-01. The Change Log satisfies "what changed" but not "show me the full dashboard state at cycle X." **Both prior reviews were right that a snapshot archive doesn't exist; they were wrong to call the Change Log itself absent.**

3. **"Indigenous reconciliation not graded"** — **Confirmed.** [Section cut off here — Comet's session hit its tool-call limit before completing this finding and producing the closing Confidence and Limits paragraph.]

---

## Findings synthesis (added 2026-05-23 after Comet run)

### 2-of-2 convergence with prior Grok probe (act on in June)

- **Editor disclosure surface** — no editor name, bio, or COI declaration. Confirmed real gap.
- **Version archive** — refined: Change Log exists; reader-facing full-state snapshot archive does not.

### New Comet findings worth acting on in June

**Methodology rigor:**
- Economic Policy Response — enumerate the "core levers" list publicly
- Ethics & Transparency — publish a disclosure-machinery components checklist
- Flagship Delivery — publish the exact derivation arithmetic in `gradeBasis.bandCriterion`

**Coverage:**
- Indigenous reconciliation — needs either a 12th dimension or an explicit boundary statement on About
- Healthcare federal-provincial transfers — name explicitly in Fiscal Health construct or carve out
- Foreign policy beyond NATO — add a one-line scope caveat on Defence & Trade card
- Wage policy — add a one-line note in About boundary statement

**Source diversity:**
- Climate & Environment — no right-leaning or energy-sector source in grade-moving chain
- Affordability Response — no industry or business-group analysis
- Immigration — no pro-immigration or restrictionist independent challenge

**Framing:**
- Affordability Response card — swap order: scope caveat before the cost number

**UX bugs:**
- Skeptic Path anchor #4 (sources) overshoots scroll target by ~one card height
- Citation block in About sends reader to `meta.json` for version; should show version inline

**Code quality:**
- DimensionCard timing-based scroll is fragile; replace with ResizeObserver or settled-DOM useEffect
- No automated test for `POCKETBOOK_DIMS` ↔ `excludeFromGPA` consistency
- No test guarding the GPA frozen-surface in utils.js; add comment block + Vitest test
- No lint rule preventing inline hex color literals in .jsx files
- No tests around the numerical output of GPA derivation

**Comparative gaps (longer-term):**
- Per-dimension grade-history sparkline (3-5 days)
- Public contributor / verification layer (named editor, fact-checker-style attribution)
- Documented machine-readable data export endpoint

### Defensible positions Comet didn't flag as problems

- The "kitchen-table + core federal infrastructure" framing of which 11 dimensions are scored
- The Promise Delivery tracker separation from the 11 graded files
- The "Judgment enters in X" anchor pattern (called "genuine strength")
- The critics-and-defenders pattern (called "meaningful epistemological step beyond fact-check format")
- The bias-resistance audit and the v5.29 defender-citation fix
- The accessibility work through v5.46

### Session limit note

Comet's run completed sections 1-9 fully and section 10 partially (2-of-3 prior-review findings confirmed; the Indigenous reconciliation finding cut off mid-sentence; closing Confidence and Limits paragraph not produced). Subsequent runs should either chunk the prompt into smaller passes or expect the same limit. The bundle approach worked as designed — Comet read the actual files and quoted them, with no fabricated citations detected.
