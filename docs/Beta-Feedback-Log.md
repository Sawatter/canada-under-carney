# Beta Feedback Log

Purpose: keep external trust and usability feedback traceable to concrete product or methodology changes.

Status: active public-feedback log. This is not a scoring memo and does not itself change any grade.

## 2026-06-12 Reddit source-balance and framing feedback

### Signal received

A reader who had initially found the dashboard interesting came back after a closer look at the source registration and offered a more trust-focused critique:

- Source selections could be expanded within categories, and the project may need more source categories.
- Where a source like Fraser Institute appears, the reader expected a clearly visible alternate perspective or analytical counterweight, such as environmental or watchdog analysis.
- The reader asked who decides the parameters and whether the dashboard is mainly the editor's reference tool or something fleshed out enough for broader public use.
- The title `Canada Under Carney` read as more loaded than intended to this reader: Carney as all government, Canada below or subject to Carney, or a name attached to a feeling.
- The reader did not see enough accounting for the past six years of disruption or factors outside the current government's control.

### Methodological interpretation

This is useful reader-perception feedback, not a grade or source-change instruction. It points to four trust surfaces:

- **Source-role visibility:** balance is not only whether the source stack contains varied families. Readers need to see why a given source is present and what counterweight exists nearby.
- **Rubric ownership:** the dashboard is a transparent solo scorecard, not a neutral public institution. The editor sets the parameters; the safeguard is that thresholds, sources, judgment calls, and triggers are public and can be challenged.
- **Title framing:** `Canada Under Carney` was intended as period framing, meaning during the Carney government. At least one reader heard a more loaded meaning. This may need softer surrounding copy rather than an immediate rename.
- **External-control clarity:** the model should keep distinguishing government performance from background conditions outside federal control. Where this is already handled through scope notes, deconfliction rules, or context-only metrics, the UI may need to make that easier to find.

### Remaining follow-ups

1. Do not add sources reactively from this comment alone; handle source-stack changes through the monthly source-band / source-role process.
2. Consider a later About or Methodology FAQ entry: "Who sets the rubric?"
3. Consider whether first-viewport or About-page copy should clarify that the title means "during the Carney government."
4. During the July data cycle, watch whether source-role labels and context/confounder notes are visible enough for readers who do not open every fold.

## 2026-05-02 Reddit trust-feedback wave

### Signal received

External feedback split into two useful layers:

- A beta tester said the dashboard had "tons of bias baked into it" and not enough definition around measures and thresholds.
- Reddit feedback was more specific: trust is the product; make the source trail impossible to miss; show exactly where judgment enters the grade; be consistent rather than pretending no one will call it biased; avoid rewarding only what is measurable; make freshness more obvious; clarify what the dashboard is and is not for.

Thread signal by venue:

- `r/SideProject`: useful feedback on trust, inline sources, consistency, and purpose.
- `r/vibecoding`: useful warning about measurable vs valuable.
- `r/TestMyApp`: quiet.
- `r/opensource`: removed.

### Product response shipped in v5.11

- Added a compact "What this is / What this isn't" note at the top of the Scorecard view.
- Made global freshness harder to miss by styling the header `Updated` date as a visible badge.
- Made per-dimension freshness harder to miss by strengthening each card's `Last reviewed` treatment.
- Added a one-sentence `Judgment call` line on each graded dimension card.
- Added a longer `Where judgment enters` explanation inside each graded dimension's scoring drawer.
- Tightened mobile rendering so the Scorecard framing remains visible, `Last reviewed` pills have stronger contrast, and the Promises summary no longer clips status labels.
- Added a reader-facing changelog entry for the trust-feedback pass.
- Follow-up in v5.17 made the measurable-vs-valuable boundary explicit on the About and Methodology pages: the dashboard scores sourceable federal action and observable evidence, not every politically valuable quality.

### Methodological interpretation

The dashboard cannot remove judgment from grading. The trust move is to make judgment visible, bounded, and consistently placed:

- Evidence lives in sources and metrics.
- Thresholds live in the scoring drawer.
- Editor judgment now has an explicit surface on every graded file.
- Freshness is visible globally and per dimension.
- The global frame and About page now state that measurable dimensions are not the same thing as all valuable outcomes.

### Remaining follow-ups

1. Run the inter-rater pilot in `Inter-Rater-Reliability-Protocol.md`.
2. Keep tightening threshold language when monthly-cycle evidence exposes ambiguity.
3. Watch whether the added judgment line increases trust without making the cards feel crowded.
4. Consider a later source-trail pass only if readers still miss the existing source chips inside expanded cards.

## 2026-05-02 Consistency and traceability follow-on

### Signal received

After the Reddit trust-feedback wave, the next outside-method read sharpened the problem:

- the most important remaining issue is not generic "bias" language but **consistency**
- the strongest reader standard is **traceability**: grade -> trigger -> evidence -> source
- some dimensions behave like structural exceptions and should be named that way
- the trigger system was still free-text only, which meant sources could sit nearby without actually being tied to the move condition

### Product and data response shipped in v5.12

- Converted `gradeTriggers` from plain strings into structured objects that can carry trigger text plus a source label and source URL.
- Updated the dimension-card scoring drawer so each one-notch trigger now renders with its own supporting source directly underneath it.
- Strengthened thin source stacks where the audit said traceability was weak:
  - Affordability Response now includes PBO benefit-costing plus operational Grocery Benefit / Grocery Code sources.
  - Housing Supply now includes direct Build Canada Homes, PBO housing-outlook, and CMHC housing-gap sources.
  - Promise Delivery now uses a more representative mix of official/home-dimension sources instead of leaning as heavily on Fraser.
- Rebalanced the one overloaded source stack:
  - Economic Policy Response was thinned back to a tighter 8-source band so the public source trail no longer reads like a kitchen-sink exception.
- Tightened exception-file framing:
  - Defence & Trade scope note now explains why the mixed file still exists as one grade.
  - Flagship Delivery now identifies itself more clearly as a derived rollup across home dimensions.
- Added the consistency self-audit in `docs/Consistency-Self-Audit-2026-05.md`.

### Methodological interpretation

This pass does not change any live grade. It changes what a reader can verify:

- triggers no longer read like unsupported editorial text
- source proximity now has a specific object to attach to
- derivative or mixed files are framed more honestly as exceptions

### Remaining follow-ups

1. Promise Delivery tracker framing is resolved in the live app; keep watching for stale docs or UI copy that revives grade language.
2. Consider a later UI pass for inline metric-level source threading once the trigger-level traceability pattern proves useful.
