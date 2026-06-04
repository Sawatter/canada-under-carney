# Methodology Audit — Internal Gap Map (2026-06)

**Status:** Draft for the editor. Nothing here is published or changed. No grade,
threshold, weight, modifier rule, or frozen surface was touched. This pass only
maps findings and recommends an order of work. The editor decides what changes.

**Source:** an external research pass (Comet) compared our methods to recognized
practices across nine areas and produced a gap report. Per the
[Methodology Audit Brief](Methodology-Audit-Brief.md), Comet owns the field-standard
research (cited in its report); this document checks Comet's "how we compare" call
against our actual files, because Comet worked from one-line sketches of our
approach and several of its comparisons are off as a result.

**Evidence base:** file reads on HEAD `46a1c3a` (v5.91). Each verdict cites
`file:line`. Comet's field-standard citations were not independently re-checked
(that is Comet's half of the labour); where a field claim drives a large call it is
flagged.

---

## Headline: Comet's three "top gaps", reconciled

Comet ranked its three highest-impact gaps as (1) polling, (2) inter-rater
reliability, (3) modifiers governance. Checked against the files, only the first
holds as stated.

| Comet's ranked gap | Reconciled finding | Basis |
|---|---|---|
| **#1 Polling aggregation** | **CONFIRMED.** Real and the genuine top gap. Plain sample-size-weighted mean, flat 60-day window, no recency decay, no house-effect term, no uncertainty interval. | [ApprovalSignal.jsx:3-55](../src/components/ApprovalSignal.jsx#L3), [approval-polls.json:6](../src/data/approval-polls.json#L6) |
| **#2 IRR "not operationalized / not reported"** | **OVERSTATED.** The protocol, reviewer packet, reviewer invite, and results template are all built and staged. The gap is *execution* (recruit a human rater, run it, report the number), not design. We already disclose publicly that external IRR is untested. | [Inter-Rater-Reliability-Protocol.md:4](Inter-Rater-Reliability-Protocol.md), [Current-Roadmap.md:107](Current-Roadmap.md) |
| **#3 Modifiers governance (no cap, no log)** | **NOT A GAP.** Each modifier already carries a published magnitude (±0.3 GPA; Jurisdictional caps at C+), and a per-dimension application log already exists in `activeModifiers[]`, including logged non-applications. | [Scoring-Rubric-v1.1.md:110](Scoring-Rubric-v1.1.md), [dimensions.json:296-307](../src/data/dimensions.json#L296) |

Two more of Comet's per-area recommendations are already fully implemented:

- **Area 5 (corrections policy):** Comet calls this "the one IFCN principle the
  fetch ladder does not yet address." We have a full standalone
  [Corrections-Policy.md](Corrections-Policy.md) (categories, three channels,
  7/14/30-day response timeline, changelog recording schema). Comet did not see the file.
- **Area 9 (host in a public Git repo):** already the case.
  `github.com/Sawatter/canada-under-carney`, public, 260 commits, methodology in
  `docs/` and `src/`. The recommendation is moot.

And one area Comet flagged for a *new* metric is already quantified, just stated
inconsistently (Area 8, below).

The net: Comet's field research is sound, but its picture of what we already run is
roughly two-thirds too pessimistic. The reconciliation matters more than the raw
report.

---

## Reconciled priority list (for editor decision)

### A. Real and worth doing

1. **Polling aggregation (Area 6) — highest impact, own decision session.** This is
   the one credibility exposure that is both real and public-facing. Recommend a
   phased upgrade (recency decay first, house-effect correction next), run through
   `grade-evaluation` / `grill-me` as a methodology change. It does **not** touch
   the frozen GPA math (confirmed: [utils.js](../src/utils.js) imports only
   `dimensions`; approval polling feeds `ApprovalSignal.jsx` alone), but it does
   move a published number and needs a `method` changelog entry and sign-off.

2. **Defence & Trade tripwire wording (Area 8) — cheap consistency fix.** The split
   rule is stated three different ways. Only the decision memo carries the
   quantitative threshold Comet recommends. Recommend reconciling the shipped
   guardrail and CLAUDE.md onto that existing threshold. Touches a structural rule,
   so it needs sign-off, but it invents no new math.

3. **Trigger timestamps (Area 2) — cheap, additive.** No per-trigger "date set"
   field exists today. Adding one is low-risk metadata and a genuine improvement.

4. **Tier-distribution statistic (Area 4) — additive transparency.** Per-citation
   tier tags already exist; nothing aggregates them. A small script could publish a
   per-dimension T1-T2 vs T3-T5 split.

5. **IRR execution (Area 1) — staged, needs a person.** Run the pilot that is
   already built, report the `/3` agreement score. Note our own design pre-concedes
   this is a sanity check, not a kappa/ICC coefficient, so Comet's "publish
   ICC=0.78" exceeds what an N=1, 3-item design yields without the v2 second-rater
   expansion.

6. **Politically-diverse human review (Area 3) — narrow real gap.** Every existing
   human-review path either screens political diversity out by design or is not yet
   activated. Options range from activating the perceived-bias survey to adding a
   political-diversity lens to a future inter-rater round.

### B. Already met — record so effort is not spent re-doing them

- **Area 5** corrections policy: exists ([Corrections-Policy.md](Corrections-Policy.md)).
- **Area 7** modifier caps and application log: exist (Scoring-Rubric-v1.1.md, `activeModifiers[]`).
- **Area 9** public version control: exists (public repo, 260 commits).

**Suggested sequence:** polling first as its own session; pair the two cheap wins
(#2 tripwire, #3 timestamps) in one pass; then the tier statistic (#4); IRR (#5) and
political-diversity review (#6) run on their own timelines because they need people.

---

## Per-area detail

### Area 1 — Grade Rubric / IRR
- **Comet:** MEETS; gap is IRR not operationalized or reported. Recommends a
  calibration round per cycle and a published agreement statistic.
- **Reconciled: OVERSTATED.** The `gradeBasis` band-criterion + plus/minus design is
  confirmed ([dimensions.json:791-792](../src/data/dimensions.json#L791); criteria in
  [Scoring-Rubric-v1.1.md:15-66](Scoring-Rubric-v1.1.md)). A full IRR pipeline is
  built but not run: protocol active, "first run pending a willing second reader"
  ([Inter-Rater-Reliability-Protocol.md:4](Inter-Rater-Reliability-Protocol.md)); 3
  dimensions, custom ordinal `/3` score, threshold ≥1.5/3 (`:43`, `:97-105`); the
  protocol itself states it "is not Cohen's kappa" (`:113`). The results doc is a
  blank template with an unfilled `Agreement score: [X]/3`
  ([Inter-Rater-Pilot-Results-Template-2026-05.md:129](Inter-Rater-Pilot-Results-Template-2026-05.md)).
  We already disclose this publicly: "external inter-rater reliability has not been
  tested" ([Current-Roadmap.md:107](Current-Roadmap.md)).
- **Recommendation status:** valid *execution* gap, not a design gap. Run the staged
  pilot. Comet's specific ICC target overshoots the chosen design.

### Area 2 — Grade Triggers / Falsifiability
- **Comet:** EXCEEDS; recommends per-trigger timestamps so readers can confirm a
  trigger predated the evidence it adjudicates.
- **Reconciled: VALID NEW GAP.** All 49 trigger objects carry only
  `text` / `sourceLabel` / `sourceUrl` (+ optional `internalRef` / `additionalSources`)
  ([dimensions.json:62-66](../src/data/dimensions.json#L62)). No per-trigger date
  exists anywhere. The only dates are dimension-level `lastUpdated` and source-recheck
  ledgers, neither of which establishes when a trigger was authored.
- **Recommendation status:** valid, cheap, additive.

### Area 3 — Bias Resistance
- **Comet:** MEETS; gap is no multipartisan human panel (symmetry applied by the same
  editor). Recommends a politically-different red-team reviewer on grade changes.
- **Reconciled: OVERSTATED, but the narrow concern is real.** Party-symmetry rule
  confirmed ([Bias-Resistance-Protocol.md:78](Bias-Resistance-Protocol.md)); the
  source-family balance script checks per-dimension concentration (>60% flag) and
  presence of an independent-challenge family
  ([scripts/audit-bias-resistance.mjs](../scripts/audit-bias-resistance.mjs)). An
  external independent-rater protocol exists but is not run, and explicitly screens
  political diversity *out*: "I am not asking whether you agree politically"
  ([Inter-Rater-Pilot-Reviewer-Invite-2026-05.md:16](Inter-Rater-Pilot-Reviewer-Invite-2026-05.md)).
  A reader-facing perceived-bias survey exists in methodology form but is not
  activated ([Perceived-Bias-Survey.md:3](Perceived-Bias-Survey.md)). The internal
  "Red Team" lane is an editorial role / AI personas, not a politically-different
  human.
- **Recommendation status:** the true gap is a politically-diverse *human* perspective.
  Comet's blanket "no human review" is too strong; its precise concern holds.

### Area 4 — Source-Authority Tiering
- **Comet:** MEETS/EXCEEDS; recommends a per-dimension tier-distribution statistic.
- **Reconciled: VALID NEW GAP.** T1-T5 are defined
  ([QA-Gatekeeping-Rules.md:28-32](QA-Gatekeeping-Rules.md); the Source-Authority-Map
  inherits them by reference, `:93`). No tier-distribution statistic is published. The
  closest artifact is an official/non-official family split
  ([Source-Characterization-Register.md:38-39](Source-Characterization-Register.md)),
  a different cut.
- **Recommendation status:** valid and feasible; per-citation tier tags already exist
  to aggregate.

### Area 5 — Source Verification
- **Comet:** MEETS/EXCEEDS; recommends adding a corrections policy.
- **Reconciled: ALREADY MET.** The fetch ladder is confirmed
  ([source-verification/SKILL.md:24-44](../.claude/skills/source-verification/SKILL.md),
  including the snippet-confirms-a-number-not-a-sentence rule). A full
  [Corrections-Policy.md](Corrections-Policy.md) exists (error categories `:7`,
  channels `:28-30`, 7/14/30-day timeline `:34-36`, recording schema `:45-61`),
  alongside [Right-Of-Reply.md](Right-Of-Reply.md) and
  [How-To-Challenge-A-Grade.md](How-To-Challenge-A-Grade.md).
- **Recommendation status:** none. One intrinsic note: the policy is committed in
  advance with zero correction entries logged so far (`:71`).

### Area 6 — Polling Aggregation
- **Comet:** GAP (most significant). Recommends recency decay (Phase 1), then
  house-effect correction via the 338Canada method, with methodology-transparency as
  a proxy quality weight (Phase 2).
- **Reconciled: CONFIRMED, the genuine #1.** `weightedMean()` weights by sample size
  only ([ApprovalSignal.jsx:3-15](../src/components/ApprovalSignal.jsx#L3)); a flat
  60-day window with no recency decay (`:29-34`); a recent-vs-prior two-window delta
  (`:38-55`); no house-effect term, explicitly deferred
  ([approval-polls.json:6](../src/data/approval-polls.json#L6): "explicit de-housing
  is not yet required; multi-pollster coverage remains the primary house-effect
  control"); no pollster-quality weight; no uncertainty interval. The deferral is at
  least reasoned, not accidental, but the distance from a modern aggregator is real.
- **Recommendation status:** the highest-value work. Methodology change, not a frozen
  surface. Phase 1 (recency decay) is a localized formula change; Phase 2 (house
  effects) needs an observation window and a published offset table.

### Area 7 — Modifiers
- **Comet:** MEETS; gap is no magnitude cap and no application log. Ranked #3.
- **Reconciled: NOT A GAP.** Each modifier publishes a bounded effect: External
  Constraint +0.3 GPA ([Scoring-Rubric-v1.1.md:110](Scoring-Rubric-v1.1.md)),
  Credit-Claiming Penalty -0.3 (`:124`), Jurisdictional Limits caps the grade at C+
  (`:96`), Timing Fairness has a floor and a hard 24-month expiry (`:80-82`). A
  per-dimension application log exists in `activeModifiers[]` with name, status, and
  rationale, including logged non-applications
  ([dimensions.json:1385-1391](../src/data/dimensions.json#L1385)), and the rubric
  requires modifier logging on every grade change (`:242`).
- **Recommendation status:** none required. Optional polish only: caps are stated
  per-modifier rather than as one global rule, and `activeModifiers[]` infers
  direction and cycle rather than carrying explicit fields.

### Area 8 — Composite Constructs
- **Comet:** MEETS/EXCEEDS; recommends pre-specifying a quantitative divergence metric
  for the Defence & Trade split tripwire.
- **Reconciled: PARTIAL — already quantified once, but stated three ways.** The
  decision memo already defines it quantitatively: "diverge by more than 1.0 GPA
  points (approximately one full letter grade) for two consecutive monthly cycles"
  ([v2-Decision-Memo-Defence-Trade.md:149](v2-Decision-Memo-Defence-Trade.md)), which
  is essentially Comet's proposed metric. But the shipped in-data guardrail uses a
  looser direction-or-one-notch rule
  ([dimensions.json:57](../src/data/dimensions.json#L57)) and CLAUDE.md states
  direction only. The changelog currently reads it as direction-based
  ([changelog.json:230](../src/data/changelog.json#L230)).
- **Recommendation status:** the real fix is reconciling the three statements onto the
  memo's existing threshold, not inventing a metric.

### Area 9 — Change Control
- **Comet:** MEETS; gap is unclear changelog granularity and public access. Recommends
  hosting methodology in a public Git repo.
- **Reconciled: ALREADY MET.** Public repo, 260 commits, methodology in `docs/` and
  `src/`. The changelog captures dated, versioned, typed entries; grade items carry
  from/to, delta, named drivers, and an evidence link
  ([changelog.json](../src/data/changelog.json); shape per
  [CLAUDE.md:151-159](../CLAUDE.md)). Frozen surfaces are defined at
  [CLAUDE.md:160-165](../CLAUDE.md).
- **Recommendation status:** the headline recommendation is moot. Only optional
  enhancement: there is no structured `approvedBy` field; approval is carried by Git
  authorship and the procedural "explicit approval in the turn" rule.

---

## Boundaries and self-audit

- No frozen surface, grade, threshold, weight, or modifier rule was changed by this
  pass. It is mapping only.
- The polling claim was checked from first principles: [utils.js](../src/utils.js)
  imports only `dimensions` and never reads `approval-polls.json`, so the approval
  signal sits outside the GPA. A polling change is therefore a methodology change, not
  a frozen-surface change.
- Two verdicts override Comet's ("Area 7 not a gap", "Area 5 already met"). Both rest
  on specific files the editor can spot-check: [Corrections-Policy.md](Corrections-Policy.md)
  and the `activeModifiers[]` entries plus Scoring-Rubric-v1.1.md:96,110,124.
- Comet's field-standard citations were taken as given (its half of the labour). The
  call most dependent on an unverified field claim is the polling phase plan
  (338Canada Bullseye method); it matches independent reading of how that aggregator
  works, but the editor may want it confirmed before Phase 2.

## Open decisions for the editor

1. Confirm the order of work. Recommended: polling first (own session), then the two
   cheap wins (tripwire wording, trigger timestamps), then the tier statistic, with
   IRR and political-diversity review on people-dependent timelines.
2. Polling: confirm it is handled as a methodology change through
   `grade-evaluation` / `grill-me`, and choose the Phase 1 scope (recency-decay
   half-life).
3. Area 8: approve reconciling the three tripwire statements onto the memo's
   quantitative threshold. This rewrites shipped guardrail text, so it needs explicit
   sign-off.
