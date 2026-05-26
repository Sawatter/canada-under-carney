# Comet Review — Round 2 (May 23, 2026)

**Reviewer:** Comet (Perplexity)
**Panel position:** Fourth independent AI review
**Run date:** 2026-05-23 (evening, after v5.62 push)
**Dashboard version reviewed:** v5.62 (live tab showed v5.60 due to deploy lag at run time)
**Method:** Bundle upload (`tmp/perplexity-bundle.md` v5, 1.0 MB, 16,470 lines) + live URL
**Prompt source:** Bundle-attached version per `docs/AI-Verification-Methodology.md`
**Discipline:** Verbatim-quote rule enforced; Comet cited bundle file paths with publication-specific quotes throughout. No fabricated quotes detected.

**Session note:** Comet's response was cut off mid-section 7 (accessibility spot-check, at "DimensionCard keyboard"). Sections 8 (comparative benchmarking), 9 (next-level recommendations), and 10 (carry-forward confirmation) plus the closing Confidence and Limits paragraph were not produced. The captured text below is sections 1-6 complete plus section 7 partial.

**Convergence note:** Comet Round 2 reads the dashboard at v5.62 after Codex's v5.61 source threading and the v5.59 + v5.62 source-pool additions landed. Findings are sorted by whether they confirm prior reviews, refute them, or are new.

---

## Headline verdict

The v5.58 through v5.62 work is genuine and meaningful. From the bundle, `docs/Source-To-Trigger-Followup-2026-05-23.md`: *"Climate Environment now replaces generic Fraser Institute and Macdonald-Laurier source-family pages with specific EV-mandate and energy-policy analyses, then attaches them to the EV mandate and emissions-cap metrics."* That's the right discipline. The mechanical bias-audit flagged-dimension count dropped from 7 to 6.

Editor disclosure is now complete enough for a journalist to cite. The v5.58 boundary statement is "a genuine improvement over the prior state where the exclusions were listed without rationale."

What remains is the operationalization layer: the rubric language now names the right things, but the per-criterion replicability isn't always there.

## Section 1 — Bias Assessment (full)

### Rubric-design bias

**Two residual rubric-design risks:**

- **Flagship Delivery** still double-counts three files (Housing D, Climate D, Major Projects C) already in the GPA as peer dimensions. The v5.58 fix clarified the combination rule is status-count not arithmetic, but the combinatorial logic mechanically amplifies the weight of the government's worst-performing files. Direction of tilt: negative. Should be surfaced in the Flagship card's WHY THIS GRADE section so a reader can see the arithmetic.
- **Defence & Trade** composite ceiling. The tripwire rule will eventually force a split. Until it does, a government benefiting from structural trade tailwinds plus NATO accounting reclassifications can sustain A- without the two halves being independently auditable. Direction of tilt: mild positive. Unaddressed across v5.58-v5.62.

### Evidence-weighting bias

What still tilts: Climate down-triggers (formal Paris withdrawal, additional program eliminations) are event-driven and don't yet have right-leaning or energy-sector sources attached to the condition that would fire them. A conservative reader can see Fraser and MLI in the metric chain after v5.61, but the grade-change mechanism itself still relies on CCI and ECCC as the confirming sources.

**Immigration remains the dimension with the least cross-ideological source balance.** No restrictionist source (Macdonald-Laurier immigration research) and no pro-immigration advocacy source (Maytree, CCPA) in the chain. Both directions of independent challenge are absent. This dimension has not been touched across the entire v5.58-v5.62 arc.

### Framing bias

The "Judgment enters in X" pattern is applied consistently. The v5.58 Affordability fix (scope caveat before cost number) was a genuine framing improvement.

One residual: Immigration's C+ is framed as crediting "a real levels correction" while noting the long-term model is unresolved. The defenders block lists PBO Demographic Implications, which is a fiscal-impact analysis, not an immigration-policy evaluation. No organization is named as saying "the levels correction is the right call on its merits."

## Section 2 — Measure and Threshold Rigor

### Three dimensions where two analysts would diverge

**#1 — Economic Policy Response (improved but still the weakest).** The v5.58 fix enumerated five core levers, but the lever list closes "what are we counting?" without closing "how do we assess status?" Two analysts disagreeing on whether the Canada Growth Fund is "executing" vs. "authorized" still land on different grades. **Recommended language:** each of the five enumerated levers should have a one-line status criterion. E.g., "Canada Growth Fund: executing = at least one investment deployed with public announcement and dollar figure."

**#2 — Ethics & Transparency (improved but checklist not operational).** The v5.58 fix defined five disclosure-machinery components. The residual problem: the checklist defines the components but doesn't specify what "present" means for each. **Recommended language:** for each of the five components, add a one-line operationalization: "confirmed present if [specific artifact or condition]."

**#3 — Flagship Delivery (partially improved).** The v5.58 fix clarified status-count combination rule, but the exact combination rule (how many D-range files produce a D grade vs. C grade) is still not published. **Recommended language:** publish the combination rule in full: "D = 3+ of 5 flagship files at D or below; C = 2 of 5 at D or below with 1+ at B or above; B = 1 of 5 at D or below..." That's simple enough to fit in one paragraph.

## Section 3 — Coverage Gaps

The v5.58 About boundary statement is "a genuine improvement." From the bundle, `src/components/About.jsx`: the rationale for excluded areas is "defensible and honest" because it explains why each excluded area isn't currently gradeable at a monthly cadence rather than treating it as unimportant.

**Two things still missing from the boundary statement:**

- **Wage policy / public-sector bargaining** is named but the rationale only notes it "feeds into Fiscal Health through the workforce-reduction commitment." That's incomplete. Treasury Board bargaining affects multiple dimensions (Fiscal Health, Economic Policy, Immigration through workforce planning). The current one-line treatment undersells the complexity.
- **Defence procurement** is a specific federal file with measurable commitments (fighter jets, naval vessels, Arctic surveillance) that doesn't fit the current Defence & Trade construct, which focuses on NATO % and trade diversification. Major defence procurement decisions are post-designation events with public timelines — they'd fit the Major Projects model better than the current framing. Not in the boundary statement at all, probably should be.

## Section 4 — Source Diversity

**What closed:** Climate and Affordability now have visible market-oriented challenge evidence in the metric chain. The bias-audit flagged-dimension count dropped from 7 to 6.

**What still tilts:**

- **Climate up/down triggers** still rely on CCI and ECCC as the confirming sources. Fraser and MLI are in the metric chain (v5.61) but not the trigger-firing mechanism. A reader who traces "what would actually move this grade" still ends up at environment-aligned sources. CER specifically would close this, blocked by the 10-source ceiling.
- **Affordability triggers** still point to PBO as the confirming source. Conference Board or Food Banks Canada threaded into trigger chains would make the grade-change mechanism cross-ideological.
- **Immigration** still has no right-leaning restrictionist source and no pro-immigration advocacy source in either metric chain or triggers. **Only dimension where the source balance problem hasn't been touched across the entire v5.58-v5.62 arc.**

## Section 5 — Live UX Test

**Lowest grade path (Affordability D-):** 3 clicks from home to rubric criterion. The v5.58 scope-caveat-first fix is working correctly — card opens with framing before evidence.

**Highest grade path (Defence & Trade A-):** Judgment call visible at zero clicks on card face.

**Skeptic Path anchor links (Fiscal Health drawer, prior session):**
- (1) the rule ✅
- (2) what would move the grade ✅
- (3) the evidence under each metric ✅
- (4) the cited sources — **minor overshoot still present.** The v5.58 `scrollMarginTop` fix improved this but the anchor lands slightly below the SOURCES heading rather than on it. Not broken, but not clean.
- (5) named critic and defender views ✅

**4 of 5 Skeptic Path links land cleanly.** Anchor #4 overshoot is the remaining UX bug.

**Editor disclosure:** From the bundle, `src/components/About.jsx`: editor role declared (independent business and operations consultant), political affiliation declared (none), professional conflicts declared (none currently), funding declared (unfunded), AI assistance disclosed. Complete enough for journalism citation. **One refinement worth shipping:** a formal recusal policy commitment (e.g., "dimensions where a conflict emerges will be flagged in the changelog with the nature of the conflict and the editorial response") would close the last gap.

## Section 6 — Code Review

**DimensionCard.jsx — timing-based scroll still open.** The ResizeObserver fix recommended by Comet's prior review was not shipped. The anchor #4 overshoot observed live is consistent with the timing-dependent scroll mechanism. From the bundle, `docs/Comet-Review-2026-05.md`: *"Fix for June: replace timing-based scroll with a ResizeObserver or useEffect that fires only after the drawer's DOM height has settled, not after a fixed delay."* **Most actionable code-quality item** — root cause of the one remaining UX bug.

**utils.js frozen surface — no tests yet.** The FROZEN SURFACE comment block and Vitest/Jest test guarding the GPA output were recommended and not shipped. A future AI agent editing utils.js would have no programmatic signal that the GPA formula is frozen. Low-probability but high-impact risk.

**POCKETBOOK_DIMS / excludeFromGPA sync — no test yet.** Same gap. Governance rule exists in CLAUDE.md; code check doesn't. Two unit tests together would probably take 2-3 hours.

**Inline hex color drift prevention — no lint rule yet.** A one-line ESLint rule flagging hex color literals in `.jsx` files is a 30-minute fix that eliminates a whole class of future accessibility regressions.

**Positive note:** `test:data` script validating dimensions.json invariants is the right pattern. The gap is that it validates shape, not values.

## Section 7 — Accessibility Spot-Check (partial — session cut off here)

**Bundle-attested state:**
- Automated axe-core 4.10 on live v5.46: 0 violations, 24 passes, 1 incomplete (TrendArrow glyph spans — not a real violation).
- All 12 grade chip colors verified WCAG AA (minimum 4.51:1) after v5.41 darkening pass.
- Skip-to-content link added v5.41.
- DimensionCard keyboard [session cut off here — sections 7 close, 8, 9, 10 not produced]

---

## Convergence with prior reviews

### 2-of-2 confirmed and now addressed by v5.58-v5.62

- **Editor disclosure surface** (Grok + Comet R1 + Perplexity + Comet R2). Closed in v5.59. Comet R2: "complete enough for a journalist to cite."
- **Excluded coverage rationale** (Comet R1 + Comet R2). Closed in v5.59. Comet R2: "defensible and honest."
- **Skeptic Path anchor link reliability** (Comet R1 + Comet R2). Mostly closed in v5.58 (4 of 5 links land cleanly); anchor #4 overshoot remains and is traceable to the underlying timing-based scroll.
- **Source diversity in Climate metric chain** (Comet R1 + Perplexity + Comet R2). Closed in v5.61 metric threading.

### Still open, surfaced again by Comet R2

- **Flagship Delivery combination rule publication** (Comet R1 + Comet R2). Recommend publishing the exact arithmetic in `gradeBasis.bandCriterion` so a reader can reproduce the C grade.
- **Per-lever status criteria for Economic Policy** (Comet R2 new). The lever list closes "what are we counting?" but not "how do we assess status?"
- **Per-component operationalization for Ethics disclosure-machinery checklist** (Comet R2 new). Each of the five components needs a one-line "confirmed present if X."
- **DimensionCard ResizeObserver fix** (Comet R1 + Comet R2). Root cause of anchor #4 overshoot.
- **utils.js FROZEN SURFACE comment + GPA frozen-surface test** (Comet R1 + Comet R2).
- **POCKETBOOK_DIMS / excludeFromGPA sync test** (Comet R1 + Comet R2).
- **Inline hex color ESLint rule** (Comet R1 + Comet R2).
- **Defence & Trade tripwire enforcement** (Comet R2 new in this round). Composite grade ceiling inflation risk persists until split happens.
- **Immigration source diversity** (Comet R2 new in this round). Only dimension untouched across the v5.58-v5.62 arc. Missing both restrictionist and pro-immigration advocacy sources.
- **Defence procurement carve-out in About boundary** (Comet R2 new).
- **Wage policy rationale refinement in About** (Comet R2 new).
- **Editor recusal policy refinement on About** (Comet R2 new).
- **Threading v5.62 sources into grade-moving triggers** (Perplexity + Comet R2). CSLS, Food Banks Canada, Conference Board now in pools; not yet in triggers.

## What v5.63 ships (safe autonomous items)

- Defence procurement carve-out added to the About boundary statement list and rationale.
- Wage policy rationale expanded to acknowledge cross-dimension footprint (Fiscal Health workforce + Economic Policy wages + Immigration workforce planning).
- Editor recusal policy line added to the editor-disclosure section on About.
- utils.js FROZEN SURFACE comment block added.

## Surfaced for editor decision (not autonomously shipped)

These touch `gradeBasis` (frozen surface per CLAUDE.md) or require larger code changes:

- Per-lever status criteria for Economic Policy Response gradeBasis
- Per-component "confirmed present if X" for Ethics & Transparency gradeBasis
- Flagship Delivery exact combination rule arithmetic published in gradeBasis
- DimensionCard ResizeObserver fix replacing timing-based scroll
- ESLint rule against inline hex color literals in `.jsx` files
- POCKETBOOK_DIMS / excludeFromGPA sync test + GPA frozen-surface Vitest test
- Threading v5.62 sources (CSLS, Food Banks Canada, Conference Board) into specific grade-moving up/down triggers under Bias-Resistance Discipline B
- Immigration source diversity expansion (Macdonald-Laurier immigration research as restrictionist; Maytree or CCPA as pro-immigration advocacy)
- Climate trigger chain restructuring so Fraser/MLI move from metric chain into the trigger-firing sources

## Authority and scope

This review applies to Canada Under Carney at `https://sawatter.github.io/canada-under-carney/`. Comet (Perplexity) is an external AI reviewer; this doc captures the review as one input among others, not as a methodology change in itself.

## Version history

- **v1.0 (2026-05-23, v5.63):** Comet's fourth-AI review captured. Confirms editor disclosure, excluded-coverage rationale, and source-diversity work as genuine improvements. Identifies operationalization layer (per-lever status criteria, per-component checklists, Flagship combination arithmetic) as the next-tier rigor work. Surfaces Immigration as the only dimension untouched across v5.58-v5.62. Session cut off mid-section 7; sections 8-10 not produced.
