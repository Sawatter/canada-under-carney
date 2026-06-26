# Bias-Resistance Audit — 2026-05 (Phase 1, operational)

**Scope:** Phase 1 operational audit per `docs/Trust-And-Bias-Resistance-Plan-2026-05.md`. Tests whether the methodology is applied consistently across dimensions. Does not address foundational questions (dimension choice, weighting, promise selection) — those move to a separate Phase 2 audit on annual cadence.

**Generated:** 2026-05-16 (revised after second-Claude critique flagged definition gaps; closed through v5.39; reconciled in v5.40)

**Raw data source:** `scripts/output/bias-audit-raw-2026-05.txt` is regenerable via `node scripts/audit-bias-resistance.mjs`. The output path is gitignored by design: the script is the authoritative artifact, and the raw text snapshot regenerates from current `dimensions.json` and `changelog.json` on demand.

**Dimensions audited:** 12 (11 graded + 1 tracker)

**Audit history:** First-pass audit flagged 10 of 12 dimensions. Second-Claude critique surfaced six definition gaps in the script. Script refactored and re-run. ChatGPT review surfaced two more reframes (thread existing challenge sources before adding new; grade-softening risk in Immigration modifier review). All four resulting fixes shipped across v5.28-v5.30. The follow-on trust artifacts shipped across v5.31-v5.39.

## Closure summary (v5.39)

All four recommended fixes shipped. Commit references:

| Fix | What landed | Version | Commit |
|---|---|---|---|
| 1b | PBO Demographic Implications threaded into Immigration grade-moving chain; PBO Major Capital Priorities threaded into Defence & Trade grade-moving chain | v5.28 | `7b4136a` |
| 2 | Defenders perspectives on 5 dimensions now name institutional sources (PBO, OECD, CCI, CER, Department of Finance, Treasury Board Secretariat, CMHC, Smart Prosperity Institute) | v5.29 | `b746abb` |
| 3 | Event-driven trigger convention documented in `docs/Scoring-Rubric-v1.1.md` as a deliberate sourcing pattern | v5.30 | `b06e9de` |
| 4 | Immigration `judgmentDetail` explicitly documents why no External Constraint modifier is applied (intentional absence per grade-softening principle) | v5.30 | `b06e9de` |

**Post-fix audit state:** 5 of 12 dimensions audit-clean. 7 dimensions carry residual flags, all categorized below as documented conventions, data-hygiene gaps in the script's domain rules, or methodology-appropriate patterns the mechanical rule can't read. No actionable Phase 1 methodology fixes remain.

**Follow-on artifacts now complete:** `docs/Bias-Resistance-Protocol.md`, public Methodology FAQ in the Rubric tab, Tier 1 challenge-enabling hygiene (`docs/Corrections-Policy.md`, `docs/Right-Of-Reply.md`, citation format), full 12-dimension language audit, Skeptic Path orientation, perceived-bias survey methodology, accessibility audit, and Phase 2 foundational audit scaffold.

**Still open after v5.39:** perceived-bias survey activation, full Skeptic Path UI restructuring beyond the orientation callout, accessibility fixes from `docs/Accessibility-Audit-2026-05.md`, axe/Lighthouse verification, and the first annual Phase 2 foundational audit pass.

## Definition limitations (read first)

The Phase 1 script tests mechanical, per-dimension patterns. It does NOT replace editorial judgment. Several limitations affect how findings should be interpreted:

1. **"Grade-moving source" definition** is now the union of (a) trigger-attached URLs in `gradeTriggers.up[].sourceUrl` / `gradeTriggers.down[].sourceUrl` and (b) metric-attached sources via the `source` field or visible `sourceRefs` links in `metrics[]`. Rationale-text source mentions are NOT counted unless also surfaced through a metric source link.

2. **"Independent challenge"** = families 4 (watchdog), 6 (parliamentary critique), 7 (policy institute), 8 (journalism), 9 (academic / research), and 10 (international benchmark) EXCEPT when family 10 is the threshold-defining body (currently only NATO for Defence & Trade). Family 5 (procedural parliamentary records like LEGISinfo bill status) is explicitly NOT independent challenge. Family 11 (industry / sector association, added 2026-05-23) is useful challenge or context evidence, but is not independent challenge by default because sector sources have direct stakeholder interests.

3. **Family-5 / family-6 split** distinguishes procedural records from parliamentary critique. LEGISinfo bill-tracking pages are family 5 (procedural). Committee reports under ourcommons.ca or sencanada.ca are family 6 (critique). This split materially changed Major Projects' assessment (see Findings).

4. **Some metric source labels map to family 0 (unclassified)** when the label is `manual` or `editorial`. These are editorial classifications, not external sources. Excluded from the source-family count.

5. **The script does not parse `rationale` field text** for source name mentions. PBO, CD Howe, etc. mentioned in rationale prose are not counted unless they also appear as URLs or metric labels.

6. **Source-Authority-Map** (`docs/Source-Authority-Map.md`) is not consulted by the script. The script audits dimensions.json as-shipped, not the methodology docs.

These limitations mean script flags are signals, not verdicts. The recommended fixes list at the end requires manual confirmation per dimension before action.

## Executive summary (closure)

The methodology is mostly consistent. No grade math problems. No trigger language tilted in either direction. No critics-or-defenders block missing entirely. The "Judgment enters in X" framing is a strong consistency anchor across dimensions.

Above the floor, four findings were identified and all four have shipped fixes:

| # | Finding | Type | Confidence | Status |
|---|---|---|---|---|
| 1 | Grade-moving claims on 2 dimensions relied on government + procedural sources with no independent challenge | Real methodology risk | High after refactor | **Shipped v5.28** |
| 2 | Defenders cite fewer named sources than critics on 5 dimensions | Real perceived-bias surface | High | **Shipped v5.29** |
| 3 | Three dimensions have "event-driven" unsourced triggers | Real but minor | Medium | **Shipped v5.30** (convention documented) |
| 4 | Immigration has no active modifiers despite plausible External Constraint case | Real but contained | Medium | **Shipped v5.30** (intentional absence documented) |

**Resolved during this pass:** the Ethics & Transparency up-trigger for "PM proactively publishes full Brookfield accounting" previously pointed to a dead `pm.gc.ca` backgrounder. The trigger now points to the working Ethics Commissioner Annex A PDF already used in the dimension's source list. The raw audit output was regenerated after the repair.

**Resolved after ChatGPT review / Fix 1a:** Major Projects and Climate & Environment now thread already-cited independent challenge sources into the visible metric source chain. Major Projects attaches Fraser Institute and Angus Reid to the overclaiming / pre-existing-investment metric. Climate attaches CCI / IISD to the 2030 pathway metric and CBC / The Conversation to ECCC capacity cuts. No grade, threshold, formula, or source pool changed.

**Withdrawn from prior version of this doc:** "Modifier absence on Ethics & Transparency" was withdrawn after editor critique. The External Constraint modifier is conceptually wrong for Ethics & Transparency because the dimension grades the PM's own disclosure machinery — there's no available "external constraint" defense when the actor being graded IS the PM. Absence is intentional.

**Also withdrawn:** "Economic Policy Response missing independent challenge" was a script-definition artifact in the first audit pass. Its metrics cite PBO and OECD, both of which count as independent challenge under the refined definition. The flag does not survive the script refactor.

## Section 1 — Source-family distribution

### Method (revised)

Each cited source classified into one of 10 families. Two views computed per dimension: all-sources distribution and grade-moving distribution. Grade-moving sources now include trigger-attached URLs, metric-attached source labels, and visible metric `sourceRefs`. Independent-challenge logic refined per the definition above.

### Findings by dimension

**Defence & Trade (A-)** — 11 all-sources, 9 grade-moving. All-sources mix is 45% operational data, 18% international benchmark (NATO), 9% PMO, 9% department, 9% procedural parliamentary, 9% independent watchdog. Grade-moving distribution after v5.28: 33% department / press-release, 33% operational data, 22% international benchmark, 11% independent watchdog.

**Resolved by Fix 1b.** NATO still acts as the threshold-defining body for the 2% target trigger, so it does not count as independent challenge. The gap is now closed by PBO Major Capital Priorities, threaded into the grade-moving defence-capital pathway.

**Major Projects (C)** — 10 all-sources, 8 grade-moving. All-sources mix is 40% PMO, 30% procedural parliamentary, 10% department, 10% policy institute, 10% academic. Grade-moving distribution after Fix 1a: 25% PMO, 50% procedural parliamentary records, 13% policy institute, 13% academic / public-opinion research.

**Resolved by Fix 1a.** Previous audit pass classified parl.ca/legisinfo as parliamentary critique. Refactored script correctly treats it as procedural, which surfaced that Fraser Institute and Angus Reid were cited but not threaded into the grade-moving chain. Those already-cited sources are now visible under the headline-investment / credit-claiming metric.

**Fiscal Health (C)** — 9 all-sources, 7 grade-moving. All-sources mix is 44% independent watchdog (PBO), 22% operational data, 11% department, 11% policy institute, 11% international benchmark. Grade-moving: 71% PBO, 14% operational data, 14% international benchmark.

**Clean.** This dimension is the model. PBO carries the grade-moving claim.

**Economic Policy Response (D)** — 10 all-sources, 8 grade-moving (after refactor). All-sources mix: 40% department, 40% operational data, 10% parliamentary critique, 10% international benchmark. Grade-moving distribution adds metric-attached PBO + OECD that the prior audit missed.

**Clean (after refactor).** First audit pass flagged this dimension; the refactor resolved the flag by counting metric-attached sources.

**Affordability Response (D-)** — 11 all-sources, 9 grade-moving (after refactor including metric-attached PROOF, Dalhousie, PBO). All-sources mix spans 6+ families. Grade-moving distribution: well-diversified.

**Clean on family distribution.** Data hygiene flag remains: 2 unclassified URLs for canadacode.org (Canada Grocery Code site). The script's domain rules should add this; not a bias finding.

**Carbon Pricing Policy (C)** — 8 all-sources, 7 grade-moving. All-sources mix: 50% policy institute (CCI), 38% department, 13% independent watchdog (PBO). Grade-moving similarly diversified.

**Clean on family distribution.** Trigger asymmetry flag in Section 2.

**Climate & Environment (D)** — 10 all-sources, 10 grade-moving. All-sources: 40% department, 30% policy institute, 30% journalism. Grade-moving distribution after Fix 1a: 50% department press release, 10% operational data, 20% policy institute, 20% journalism.

**Resolved by Fix 1a.** CCI / IISD were already cited in the source stack and rationale, and CBC / The Conversation already supported the ECCC-capacity discussion. Those sources are now threaded into the visible metric source chain.

**Immigration (C+)** — 9 all-sources, 8 grade-moving. All-sources: 56% department, 33% operational data, 11% independent watchdog. Grade-moving distribution after v5.28: 25% department / press-release, 63% operational data, 13% independent watchdog.

**Resolved by Fix 1b.** PBO Demographic Implications of the 2026-2028 Levels Plan was added to the source stack and threaded into the grade-moving long-term-model metric. The mechanical audit no longer flags source-family concentration or missing independent challenge.

**Housing Supply (D)** — 12 all-sources, 9 grade-moving (after refactor). Source mix is balanced. Grade-moving distribution includes operational (CMHC, StatCan), independent watchdog (PBO), department, PMO.

**Flag: 1 of 9 grade-moving sources is a press release** (Build Canada Homes "thousands in pipeline" announcement). The press release IS the up-trigger source for "BCH construction begins," so it's defensible as evidence of state of play, but a non-press source would be stronger.

**Ethics & Transparency (C)** — 11 all-sources, 4 grade-moving. All-sources: 64% independent watchdog, 18% journalism, 9% parliamentary critique, 9% policy institute. Grade-moving: 100% independent watchdog.

**Script flag interpreted as acceptable:** the >60% independent-watchdog concentration is expected for a process file about ethics disclosure and screening. After the Annex A trigger repair, no broken grade-moving source remains.

**Flagship Delivery (C)** — 5 all-sources (smallest source pool). 80% policy institute, 20% independent watchdog. Grade-moving via `internalRef` to other dimensions (correct for a meta-rollup).

**Flag: 80% concentration in policy institute.** Partial artifact — Flagship Delivery is a meta-rollup that uses internalRef triggers, so the 5 sources are background context not grade-moving evidence. The concentration is unusual but doesn't reflect a real bias surface.

**Promise Delivery (C+, tracker)** — 6 all-sources. 6-family spread, no concentration flag. Tracker dimension uses informationalGrade and excludeFromGPA per design.

**Clean.**

### Section 1 summary

| Dimension | All sources | Grade-moving | Flag |
|---|---|---|---|
| defence-trade | 11 | 9 | Clean after Fix 1b (PBO now threaded into the grade-moving defence-capital pathway) |
| major-projects | 10 | 8 | Clean after Fix 1a (Fraser / Angus Reid now threaded into grade-moving metric) |
| fiscal-health | 9 | 7 | Clean (model dimension) |
| economic-policy | 10 | 8 | Clean (metric-attached PBO/OECD resolves prior flag) |
| affordability-response | 11 | 9 | Clean on family; data hygiene only |
| carbon-pricing | 8 | 7 | Clean |
| climate-environment | 10 | 10 | Clean after Fix 1a (CCI / IISD / journalism now threaded into grade-moving metrics) |
| immigration | 9 | 8 | Clean after Fix 1b (PBO now threaded into the long-term-model metric) |
| housing-supply | 12 | 9 | 1 grade-mover is press release |
| ethics-transparency | 11 | 4 | Watchdog concentration acceptable for process file |
| execution-delivery | 5 | 0 (internalRef only) | 80% policy institute (partial artifact) |
| promise-delivery | 6 | 0 (tracker) | Clean |

**No dimensions still have real "no independent challenge" findings after v5.28.** Remaining Section 1 flags are residuals: Affordability's canadacode.org classifier gap, Housing's defensible press-release state-of-play trigger, Ethics' watchdog concentration, and Flagship Delivery's meta-rollup concentration.

## Section 2 — Trigger symmetry

### Findings by dimension

**Cleanly symmetric (8 dimensions):** Defence & Trade, Major Projects, Fiscal Health, Economic Policy Response, Affordability Response, Climate & Environment, Flagship Delivery. No flags.

**Carbon Pricing Policy** — Asymmetric sourcing. 1 of 2 up triggers unsourced (carbon border adjustment, labeled "event-driven"). All down sourced.

**Immigration** — Asymmetric sourcing + numeric asymmetry. 1 of 2 down triggers unsourced ("Evidence of critical service failure" — event-driven). Up has 1/2 numeric, down has 0/2 numeric.

**Ethics & Transparency** — Asymmetric sourcing. 1 of 3 down triggers unsourced ("Two or more listed governance sources publish material disclosure or screening gap finding" — event-driven). All up sourced.

**Housing Supply** — Numeric-threshold asymmetry. 2/2 up triggers numeric vs 1/2 down. "Federal spending declines further without offset" is non-numeric.

**Promise Delivery (tracker)** — Numeric-threshold asymmetry. 1/1 up numeric vs 1/2 down. "Housing and climate see no movement for another cycle" is non-numeric.

### Section 2 summary

Event-driven unsourced triggers appear on three dimensions (Carbon Pricing, Immigration, Ethics & Transparency). Honest convention but reads asymmetric. Numeric-threshold asymmetry on Housing Supply and Promise Delivery is minor; the soft-language down-triggers could be tightened to numbers where possible.

## Section 3 — Critics/defenders symmetry

### Findings

**No length-imbalance flags from the script** (no dimension exceeds 2x ratio). Lengths cluster in 37-63 words per side.

**No URLs in critics or defenders blocks.** Both fields are pure prose. The script's URL-count check is uninformative.

**Source-specificity asymmetry was fixed in v5.29.** Defenders perspectives on the five flagged dimensions now name institutional sources rather than defending anonymously.

| Dimension | Critics named sources | Defenders named sources |
|---|---|---|
| Affordability Response | 2 | 5 |
| Carbon Pricing Policy | 2 | 2 |
| Climate & Environment | 4 | 4 |
| Housing Supply | 5 | 4 |
| Economic Policy Response | 6 | 5 |

**Verdict:** clean after v5.29. The original script missed the problem because its flag rule required both sides >50 words AND a 2+ vs 0 source split. The manual read caught the real perceived-bias surface, and v5.29 closed it.

## Section 4 — Language audit (full 12-dimension pass)

### Findings

Read `judgmentCall` and `judgmentDetail` on all 12 dimensions. Initial pass covered the 4 dimensions flagged in Section 1 (Defence & Trade, Economic Policy Response, Climate & Environment, Immigration). Follow-up pass extended coverage to the remaining 8: Major Projects, Fiscal Health, Affordability Response, Carbon Pricing Policy, Housing Supply, Ethics & Transparency, Flagship Delivery, Promise Delivery.

**Consistency holds across all 12 dimensions.** Each graded dimension uses the same template:
- `judgmentCall` = single sentence naming the grade and what it reflects vs what it excludes
- `judgmentDetail` = paragraph following the pattern "The [grade] is about [scope]. Judgment enters in [explicit judgment call]."

**The "Judgment enters in X" framing appears in every graded dimension.** It is the dashboard's strongest party-symmetric framing device — judgment is admitted explicitly rather than hidden behind neutral-seeming prose. No dimension deviates from this pattern.

**The "The grade is about Y, not Z" scope-disclaimer pattern** appears in most dimensions:
- Affordability Response: "scores the adequacy of federal action... not a verdict on global prices"
- Major Projects: "scores the federal delivery machinery... not whether each project is good policy"
- Ethics & Transparency: "about governance adequacy, not personal guilt"
- Flagship Delivery: "a delivery-capacity lens, not a duplicate merits grade"
- Economic Policy Response: "about the federal response, not Canada's inherited productivity level"
- Climate & Environment: "deconflicting this file from Carbon Pricing Policy"

This is a strong consistency anchor: each dimension explicitly names what it is NOT grading, which reduces the chance of misinterpretation about scope.

**Active vs passive voice check:** Active voice for measurable facts ("Defence spending clears the published NATO 2% threshold", "PBO and OECD analyses identify"). Passive or conditional voice for editorial qualifications ("trade gains are discounted because", "the D grade is driven by"). The pattern is consistent across all 12 dimensions.

**"Critics say" / "defenders argue" check:** Neither phrase appears in any dimension's judgmentCall or judgmentDetail. Perspectives go in `perspectives.critics` and `perspectives.defenders` (structurally separated), not in the judgment text. Clean separation across all 12.

**Hedging adjective check:** "Modest," "substantial," "real," "meaningful," "materially," "partially," "limited" appear across dimensions. Applied symmetrically — both for things the government did and didn't do, both for credit and discount. No one-sided pattern.

**Tracker note:** Promise Delivery's `judgmentCall` and `judgmentDetail` fields are empty by design. The dimension is a tracker with `excludeFromGPA: true`, and the renderer suppresses judgmentCall for tracker dimensions per the validate-dimensions schema rule. Not a finding.

**Specific judgment markers — named rules within judgmentDetail:**
- Ethics & Transparency: "Judgment enters in requiring formal findings or multiple independent critiques before a downgrade." Names the evidentiary threshold for movement.
- Major Projects: "excluding same-day promoted-stage labels from the advancement count" + "applying a credit-claiming penalty where the government overstates ownership." Specific exclusion rules.
- Housing Supply: "refusing to count announced units as built homes." Specific evidence rule.

These named rules are themselves bias-resistance work — they make the judgment surface inspectable.

### Section 4 verdict

**Full 12-dimension language audit: clean.** The methodology's framing language is consistent across all graded dimensions. No asymmetric tells, no one-sided hedging, no "critics say" / "defenders argue" framing. The "Judgment enters in X" anchor and the "The grade is about Y, not Z" scope-disclaimer pattern are both party-symmetric devices applied uniformly.

No language-level fixes recommended this cycle. The audit closes Section 4 as a green pass.

## Section 5 — Modifier inventory

| Dimension | Modifier count | Modifiers |
|---|---|---|
| defence-trade | 1 | External Constraint (partly applicable) |
| major-projects | 2 | Credit-claiming penalty (applied); Timing Fairness (partially applicable) |
| fiscal-health | 1 | External Constraint (considered, not determinative) |
| economic-policy | 2 | Timing Fairness (applied); External Constraint (partly applicable) |
| affordability-response | 1 | External Constraint (applicable, not applied) |
| carbon-pricing | 1 | External Constraint (not applied) |
| climate-environment | 1 | External Constraint (partly applicable) |
| immigration | 0 | None — reviewed and documented as intentional in v5.30 |
| housing-supply | 2 | Jurisdictional limits (non-binding); Timing Fairness (partially applicable) |
| ethics-transparency | 0 | None — withdrawn from review (External Constraint conceptually wrong) |
| execution-delivery | 0 | None — meta-rollup, may be intentional |
| promise-delivery | 1 | Timing Fairness (applied) |

**Modifier vocabulary is consistent.** External Constraint, Timing Fairness, Jurisdictional limits, Credit-claiming penalty are recurring named modifiers. No one-off modifiers invented per dimension.

**Immigration modifier absence was reviewed in v5.30.** No External Constraint modifier is applied. The absorption strain that prompted the correction was inherited from prior policy decisions, but the current government's response to those conditions is what this dimension grades. Prior conditions do not soften the assessment of current action.

**Ethics & Transparency** is NOT flagged. The dimension grades the PM's own disclosure machinery. There's no available "external constraint" defense when the actor being graded IS the PM whose disclosures are being assessed. Modifier absence appears intentional and conceptually correct.

## Section 6 — Update-cadence / attention-bias

Two real grade movements ever in the changelog: fiscal-health D → C (2026-05-13) and climate-environment D+ → D (2026-04-19). All 10 other dimensions show zero recorded grade movements.

**No attention-bias flags fired** because the script's threshold rule requires at least one peer dimension with 3+ movements before zero-movement dimensions get flagged. No dimension has 3+ movements.

**The changelog audit trail is too sparse to draw conclusions** about attention bias from grade-movement counts alone.

**Recommendation:** Audit `previousGrade` vs current `grade` per dimension to detect implicit movements not recorded as `type: "grade"` entries in changelog. If movements happened without changelog entries, that's a process gap.

## Section 7 — Skeptic-path UI inventory

**Status: orientation shipped in v5.36.** Each graded dimension drawer now opens with a Skeptic Path callout naming the five ingredients a reader should walk through to challenge a grade.

- Rule chain: dimension drawer
- Sources: chips on card
- Triggers: ScoreDerivation panels
- Critics/defenders: drawer perspectives section
- Last-updated: dimension header

**Residual UI finding:** the callout orients the reader, but it does not yet restructure the drawer into a single threaded grade → rule → trigger → metric → source → critics/defenders path. Fuller threading remains a Phase 2 UI backlog item.

## Fixes shipped (ranked by impact, with commit references)

All fixes below required and received explicit per-fix user approval. Each commit captures the approval in its message.

### Fix 1b — Thread independent challenge into Defence & Trade and Immigration grade-moving chains ✓ Shipped v5.28 (`7b4136a`)

**Dimensions:** Defence & Trade, Immigration.

(Economic Policy Response was removed after the script refactor resolved the finding via metric-attached PBO + OECD. Major Projects and Climate & Environment were resolved by approved Fix 1a.)

**Problem:** The remaining two dimensions have grade-moving sources concentrated in government data / messaging or threshold bodies. No PBO, OAG, opposition critique, policy institute, journalism, or academic source is attached to the grade-moving chain.

**Discipline (must apply before any source addition):** Thread existing cited challenge sources into grade-moving claims first. Add a new source only if no already-cited source has a published analytical view on the specific dimension's substance. If a proposed source has no prior substantive view on the topic, adding it is token balancing rather than evidentiary improvement.

**Per-dimension proposed actions (each requires manual confirmation against metrics, rationale, and Source-Authority-Map before action):**

- **Defence & Trade:** Senate Defence Committee reports + CGAI / CDA Institute analyses on Canadian defence procurement and posture. Both have substantive published positions. Family 6 + family 7 challenge.
- **Immigration:** PBO Demographic Implications of the 2026-2028 Levels Plan report (Feb 26, 2026, surfaced in May fetch) appears genuinely missing from the dimension. If manual review confirms it directly supports the long-term-model or population-correction claim, add it and attach it to the relevant trigger or metric.

**Effort:** ~30-45 min per dimension. 2 dimensions = ~1-1.5 hours.

**Constraint:** Source-array changes touch frozen-surface rules. Requires explicit user approval per dimension fix.

### Fix 2 — Close defenders/critics source-specificity asymmetry on five dimensions ✓ Shipped v5.29 (`b746abb`)

**Dimensions:** Affordability Response, Carbon Pricing Policy, Climate & Environment, Housing Supply, Economic Policy Response.

**Problem:** Critics cite multiple named sources (PBO, CD Howe, CCI, etc.); defenders cite zero or fewer. Critics attributed, defenders anonymous.

**Proposed fix:** Add at least one named source per `defenders` block where appropriate. Many defensive positions already implicitly cite authoritative sources (PBO "on track," IMF Article IV, OECD economic survey) — bringing names into the block closes the gap without changing substance.

**Effort:** ~15-20 min per dimension. 5 dimensions = ~1.5 hours.

### Fix 3 — Surface event-driven trigger convention to readers ✓ Shipped v5.30 (`b06e9de`)

**Problem:** Carbon Pricing, Immigration, Ethics & Transparency each have triggers labeled "event-driven" without sourceUrl. Honest convention but reads asymmetric when paired against URL-bearing triggers.

**Proposed fix:** Add methodology note (in About or in the trigger panel) explaining that "event-driven" triggers are deliberate placeholders for source-families whose specific URLs vary by event.

**Effort:** ~30-45 min.

**NOT recommended:** Converting event-driven labels to structured placeholder URLs (e.g., NATO press-releases page) would hide the convention rather than name it. The honest version is to surface the convention.

### Fix 4 — Document the Immigration modifier decision ✓ Shipped v5.30 (`b06e9de`)

**Problem:** Immigration has no active modifiers despite a plausible External Constraint case (absorption strain inherited from prior levels + global migration shifts).

**Proposed fix:** Editor reviews whether the absence is intentional and documents the reasoning. Do not add a modifier merely because the script flagged absence. A modifier should explain what does not count against the grade under the published rules, not soften the grade because context feels hard.

**Effort:** ~20 min.

**Note: Ethics & Transparency was previously listed here in error.** Withdrawn. External Constraint is conceptually wrong for a dimension grading the PM's own disclosure machinery.

## Per-finding tagging: real risks vs script artifacts

| Finding | Type |
|---|---|
| Defence & Trade no indep challenge | **Resolved by Fix 1b** — PBO Major Capital Priorities now attached to grade-moving defence-capital pathway |
| Major Projects no indep challenge | **Resolved by Fix 1a** — existing Fraser / Angus Reid challenge now attached to visible metric sourceRefs |
| Climate & Environment no indep challenge | **Resolved by Fix 1a** — existing CCI / IISD / journalism challenge now attached to visible metric sourceRefs |
| Immigration >60% concentration + no indep challenge | **Resolved by Fix 1b** — PBO Demographic Implications now attached to grade-moving long-term-model metric |
| Ethics & Transparency broken pm.gc.ca URL | **Resolved during this pass** — trigger now points to the working Ethics Commissioner Annex A PDF |
| Defenders cite fewer named sources (5 dimensions) | **Resolved by Fix 2** — defenders now name institutional sources |
| Event-driven unsourced triggers (3 dimensions) | **Documented by Fix 3** — honest convention now explained in Scoring-Rubric-v1.1 |
| Housing Supply 1 press release grade-mover | **Real but mixed** — defensible as state-of-play evidence |
| Numeric-threshold asymmetry (Housing, Promise) | **Real but minor** |
| Immigration modifier absence | **Resolved by Fix 4** — absence reviewed and documented as intentional |
| Ethics & Transparency modifier absence | **Withdrawn** (External Constraint conceptually wrong) |
| Economic Policy Response no indep challenge | **Script artifact (resolved)** — metric-attached PBO/OECD count |
| Affordability Response unclassified canadacode.org | **Data hygiene, not bias** — script's domain rules need updating |
| Flagship Delivery 80% policy institute | **Partial artifact** — meta-rollup uses internalRef, source diversity less load-bearing |
| Major Projects 100% parliamentary critique (old finding) | **Script artifact (resolved)** — LEGISinfo now correctly procedural |

## Findings NOT in scope for Phase 1

Three foundational-bias questions move to Phase 2 (annual cadence):
- Why these 11 graded dimensions?
- Why these 4 in POCKETBOOK_DIMS?
- How were 43 promises selected?

Phase 2 framework doc: `docs/Foundational-Methodology-Audit-2026.md` (scaffolded in v5.39; first substantive pass remains annual-cadence work).

Excluded-evidence log becomes recurring practice in monthly source-coverage ledgers (not an audit artifact).

## Next steps (post-v5.40)

The May bias-resistance cycle now has the protocol, FAQ, challenge-enabling hygiene, full language audit, Skeptic Path orientation, survey methodology, accessibility audit, and Phase 2 scaffold in place. Remaining work is operational follow-through, not another methodology layer:

1. **Activate the perceived-bias survey** (GitHub Discussions, Kit form, or other selected mechanism).
2. **Run axe-core or Lighthouse** against the deployed site to quantify contrast and focus findings.
3. **Continue accessibility fixes** from `docs/Accessibility-Audit-2026-05.md`: contrast verification, drawer focus management if testing shows confusion, and skip-to-content.
4. **Run the first substantive Phase 2 foundational audit** on annual cadence, or if the rubric moves to a major new version.
5. **Consider fuller Skeptic Path UI restructuring** only if user testing shows the orientation callout is not enough.

## Process notes

- Audit script is `scripts/audit-bias-resistance.mjs`. Reusable for subsequent cycles.
- Raw output is regenerable via `node scripts/audit-bias-resistance.mjs`; the path `scripts/output/bias-audit-raw-2026-05.txt` is gitignored by design — the script is authoritative, the raw text is a working artifact.
- Script taxonomy refined 2026-05-16 to split procedural parliamentary records from critique, and to count metric-attached sources as grade-moving.
- Section 4 (language) extended to full 12-dimension coverage in v5.35; verdict is clean.
- Section 7 orientation shipped in v5.36; fuller UI restructuring remains a user-testing-driven backlog item.
- The "must have prior substantive view," "thread existing challenge sources before adding new," and "modifiers explain what does not COUNT" principles are now codified in `docs/Bias-Resistance-Protocol.md`.
