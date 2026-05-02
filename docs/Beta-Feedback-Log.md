# Beta Feedback Log

Purpose: keep external trust and usability feedback traceable to concrete product or methodology changes.

Status: active public-feedback log. This is not a scoring memo and does not itself change any grade.

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

### Methodological interpretation

The dashboard cannot remove judgment from grading. The trust move is to make judgment visible, bounded, and consistently placed:

- Evidence lives in sources and metrics.
- Thresholds live in the scoring drawer.
- Editor judgment now has an explicit surface on every graded file.
- Freshness is visible globally and per dimension.
- The Scorecard view now states that measurable dimensions are not the same thing as all valuable outcomes.

### Remaining follow-ups

1. Run the inter-rater pilot in `Inter-Rater-Reliability-Protocol.md`.
2. Keep tightening threshold language when monthly-cycle evidence exposes ambiguity.
3. Watch whether the added judgment line increases trust without making the cards feel crowded.
4. Consider a later source-trail pass only if readers still miss the existing source chips inside expanded cards.
