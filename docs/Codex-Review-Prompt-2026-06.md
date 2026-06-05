# Codex Review Prompt - 2026-06 Methodology Pass

**Draft for the editor to send. Not yet sent.**

## What to review

Everything on `main` from the prior session's HEAD through the current HEAD:

```
git diff 46a1c3a..8647e0a
```

Current HEAD: `8647e0a`. This range covers v5.92 through v5.95 plus one docs
follow-up. It is the internal follow-through on an external methodology audit.

## How to treat this

- Verify every claim against the actual code and docs. Cite `file:line`.
- These are draft methodology changes. Do not propose specific grade, threshold,
  or weight values. The editor decides those.
- Flag real problems (a wrong calculation, a leak, an inconsistency), not style
  preferences. If something is fine, say so plainly.
- The editor will treat your findings as claims to check, not as instructions.

## Priority review targets, ranked by risk

### 1. Polling aggregation (highest risk - new math that moved a published number)

Files: `src/components/ApprovalSignal.jsx`, `src/data/approval-polls.json`, method
doc `docs/Polling-Aggregation-Method-2026-06.md`.

The Approval Signal aggregate changed from a flat sample-size-weighted 60-day mean
to: sample size times a 30-day-half-life recency weight, with a per-firm house-effect
correction subtracted before averaging. On the current window the headline moved from
57/30 (net +27) to 61/34 (net +26).

Check specifically:
- Is the math correct? `recencyWeight` (exponential, half-life), `leaveOneOutBaseline`
  (equal-firm-weighted average of OTHER firms within 45 days), `computeHouseEffects`
  (offset = mean deviation from that baseline; a firm earns an offset only with at
  least 3 comparable polls, else neutral/zero), and the apply step (offset subtracted
  per firm before the weighted mean). Separate offsets for approve and disapprove.
- Edge cases: empty window, a firm whose polls have no contemporaneous neighbors,
  division-by-zero in the weighted mean, a poll dated after the window reference.
- Is the 57/30 -> 61/34 move defensible? The recent window is Abacus-heavy and Abacus
  runs low on both approve and disapprove versus the field, so de-housing lifts both.
  Is leave-one-out the right baseline, or does it over- or under-correct here?
- Frozen-surface separation: confirm `src/utils.js` (GPA math) does not read the poll
  data, so this is a methodology change to an ungraded signal and not a frozen-surface
  change. The GPA frozen-surface test still passes (56 assertions).

### 2. Inter-rater blind-packet integrity (the packet was edited by a grade-aware party)

File: `docs/Inter-Rater-Pilot-Packet-2026-05.md`. QA record:
`docs/Inter-Rater-Pilot-AI-QA-2026-06.md`.

Important context: the packet is a blind instrument that hides the published grade,
and the edits were made by Claude, which had already seen the live grades this
session. So independent eyes are most valuable here. The packet is frozen to the
2026-04-30 snapshot; the live `dimensions.json` has since moved to the Spring
Economic Update, and those post-snapshot figures were deliberately kept OUT.

Check specifically:
- Leakage or steering: do the de-editorialized lines (Fiscal Fitch row + up-trigger,
  Ethics review status), the added facts (tariff burden, Grocery Code status,
  food-insecurity trend, debt-to-GDP pointer), or the new "Resolving Split Conditions"
  tie-break rule push a rater toward a particular grade?
- Snapshot integrity: did any post-2026-04-30 (Spring Economic Update) figure leak
  into the frozen Fiscal packet?
- Is the tie-break rule a faithful statement of existing holistic practice (see
  `docs/Scoring-Rubric-v1.1.md` "debt level does not rescue an unsustainable path"),
  or does it read as a new scoring rule?
- Known open item, do not re-flag as a bug: the tariff cost figure
  ($1,450-$2,000/yr/household) is an editor scenario estimate with no clean external
  source (sourcing was attempted, see the QA note). It is labeled as an estimate.

### 3. Defence & Trade tripwire reconciliation

The split-tripwire was stated three inconsistent ways and is now one canonical rule:
"opposite directions, or diverge by more than 1.0 GPA points (about one full letter),
for two consecutive review cycles." Check it is consistent across
`src/data/dimensions.json` (guardrail), `CLAUDE.md`, `docs/Dimension-Status-Register.md`,
`docs/v2-Shadow-Test-Plan.md`, and `docs/v2-Decision-Memo-Defence-Trade.md`, and that
no historical `changelog.json` entry was rewritten. Is the hybrid (direction OR 1.0
GPA) the right canonical choice, given the changelog shows the direction clause was a
deliberate prior tightening?

### 4. Grade-change red-team protocol

Files: `docs/Grade-Change-Red-Team-Protocol.md`,
`docs/Grade-Change-Red-Team-Reviewer-Invite-2026-06.md`, plus the wiring in
`docs/Bias-Resistance-Protocol.md` and `docs/QA-Gatekeeping-Rules.md`.

Check: is it sound and genuinely separate from the inter-rater pilot (which screens
politics out by design)? Does it stay advisory (flags, does not change grades)? Does
any wording overclaim a safeguard that has not actually run yet?

### 5. Per-trigger setDate backfill

`src/data/dimensions.json` triggers now carry a `setDate` (git-derived introduction
date), enforced by `scripts/validate-dimensions.mjs`. Spot-check a few dates against
`git log` for plausibility, and confirm the validator rule is reasonable.

### 6. Source-tier distribution

`scripts/audit-source-tiers.mjs` + `docs/Source-Tier-Distribution-2026-06.md`. The
host-to-tier mapping is editorial and published for dispute. Check the judgment calls
(industry associations, advocacy orgs, intergovernmental bodies, the canada.ca path
splits) and whether 74% T1-T2 is computed correctly from the mapping.

## Already-known open items (context, not bugs to find)

- The IRR pilot and the red-team both need a recruited human before they produce a
  result. The mechanisms are built; the runs are not done.
- Economic Policy D-to-D- is data-gated on the April 2026 GDP actual.
- The tariff figure (item 2) is an editor scenario number, flagged, not externally
  sourced.

## Output requested

Per target: a short verdict (sound / issue found), file:line evidence for any issue,
and the single highest-priority fix if there is one. A blunt "this calculation is
wrong at line X" is more useful than a list of nits.
