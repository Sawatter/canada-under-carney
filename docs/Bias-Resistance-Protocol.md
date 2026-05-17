# Bias-Resistance Protocol

**Purpose:** Codify the bias-resistance discipline learned in the May 2026 audit cycle into a recurring per-cycle gate. This is the operating doc, not a manifesto. Drafted after audit findings landed (per the original plan rule that the protocol reflects actual findings, not preempted speculation).

**Provenance:** This protocol distills three rounds of review (initial Phase 1 audit, second-Claude critique, ChatGPT review), the four shipped Phase 1 fixes (v5.28 / v5.29 / v5.30), and the follow-on public trust artifacts (v5.31-v5.39). Source docs: `docs/Trust-And-Bias-Resistance-Plan-2026-05.md`, `docs/Bias-Resistance-Audit-2026-05.md`.

## The decision rule

> Tools that help readers challenge the dashboard run alongside the audit. Surfaces that polish the dashboard's appearance wait until the audit produces a finding to respond to. Polish-without-testing remains the failure mode regardless of whether the test produced gaps.

That guardrail governs scope. Anything proposed in a cycle should pass through it first.

## The Skeptic Test

> A skeptical reader does not need to agree with a grade. They should be able to see how the grade was reached.

That is the operational success criterion. Fixes that improve a skeptical reader's ability to trace grade derivation are on-target. Fixes that make the dashboard look more polished without helping the reader trace derivation are off-target.

## Principles

Eleven principles. Status reflects what's built vs partial vs still pending as of v5.40.

| # | Principle | Status |
|---|---|---|
| 1 | Rule before result: every grade shows metric → threshold → judgment call → modifier → final. | **Built.** `gradeBasis`, `scoring.thresholds`, `judgmentCall`, `judgmentDetail`, `gradeTriggers` all exist in `dimensions.json`. |
| 2 | Party-symmetry test: every grade move documents "would the same evidence produce the same grade under a different governing party?" | **New.** Adopted in this cycle as a recurring rule (see "Per-grade-move checklist line" below). |
| 3 | Evidence split: each card surfaces grade-moving evidence, context evidence, critics, defenders, and what would move the grade. | **Built (partial).** Schema supports it; v5.36 added a Skeptic Path orientation callout. Fuller one-thread UI restructuring remains backlog. |
| 4 | Source coverage ledger: every cycle records what was checked, what was not, what changed, what was blocked. | **Built.** `docs/Source-Coverage-Ledger-YYYY-MM.md` per cycle. |
| 5 | Bias boundary in the UI: the dashboard plainly says what it does not grade. | **Built.** About and the Methodology FAQ name what the dashboard refuses to score and why. |
| 6 | Perceived-bias testing: real cross-party reader survey measures whether different priors can see how grades were reached. | **Methodology built, activation pending.** v5.37 added `docs/Perceived-Bias-Survey.md` and entry-point links; responses are not being collected yet. |
| 7 | Audience targeting: build for journalists, policy researchers, teachers, serious civic readers first. Advocacy groups second. | **Adopted by editorial convention.** Not a code artifact. |
| 8 | Skeptic Path: for each dimension, a reader can attack the grade with sources, rubric, triggers, last-updated, alternative interpretation, and what would change the grade. | **Orientation built, full thread pending.** v5.36 added the callout; a single unified derivation surface remains Phase 2 UI work if user testing shows the callout is not enough. |
| 9 | Source-family diversity per dimension: no dimension should have grade-moving evidence concentrated in a single family without independent challenge. | **Audited.** Phase 1 audit produced per-dimension findings; fixes shipped where flagged. |
| 10 | Source attribution discipline: defenders perspectives name their authoritative sources, not just critics. | **Audited and fixed.** v5.29 closed the five-dimension asymmetry. |
| 11 | Symmetric specificity: up-triggers and down-triggers carry parallel sourcing and threshold precision. Event-driven exceptions are documented as conventions, not hidden behind placeholder URLs. | **Audited and documented.** v5.30 added the event-driven convention to `Scoring-Rubric-v1.1.md`. |

## Three disciplines that emerged from May 2026 fixes

These become recurring rules for future cycles:

**Discipline A — Must have prior substantive view.** Any source proposed for addition must have an existing published analytical view on the specific dimension's substance. If the source has no prior substantive view on the topic, adding it is token balancing rather than evidentiary improvement.

**Discipline B — Thread existing challenge sources before adding new.** When the audit flags a "no independent challenge in grade-moving chain" finding, check first whether existing sources in `sources[]` already include challenge sources that aren't attached to triggers or metrics. Threading existing sources into the grade-moving chain is cheaper, less methodology-touchy, and avoids expanding the source pool unnecessarily. Add a new source only when no already-cited source has a published view on the specific claim.

**Discipline C — Modifiers explain what does not COUNT, not what should not HURT.** When the audit flags missing modifiers on a dimension, do not add a modifier merely because the script flagged absence. A modifier should explain what does not count against the grade under the published rules, not soften the grade because context feels hard. The Immigration absorption-strain example: prior policy conditions are real context, but the dimension grades the current government's response to those conditions, so prior conditions do not soften the assessment.

## Pre-cycle checklist

Run before the monthly cycle ledger is drafted. Each item is a yes/no question.

- [ ] Has the monthly source-coverage ledger been started? (`docs/Source-Coverage-Ledger-YYYY-MM.md` exists for the cycle)
- [ ] Has the link-rot scan run? (`python3 scripts/fetch-data.py --link-rot`)
- [ ] Has the fetch script run? (`python3 scripts/fetch-data.py`)
- [ ] Has the bias-resistance audit script run? (`node scripts/audit-bias-resistance.mjs`)
- [ ] Are there any new flags in the audit output that did not appear last cycle?
- [ ] If yes: do the new flags reflect real methodology risks or script-definition artifacts? (Apply the per-finding tagging from the May audit's "real risks vs script artifacts" section as a model.)
- [ ] Has any cited grade-moving URL gone to 404 since last cycle? (Captured in link-rot scan.)
- [ ] Is the excluded-evidence log started? (New section in the cycle ledger.)
- [ ] If running a language, accessibility, or source audit: verify each finding against current code state, not against historical drift. (Added v5.41 after the v5.40 audit-doc reconciliation found that two accessibility findings had already been fixed in code before the audit doc was written. Code-inspection passes need to cross-check current state, not assume prior state from grep output.)

## Post-cycle review template

For each cycle, the cycle ledger gains a "Bias-resistance review" section with these fields:

- **Audit script run date and dimensions flagged count.** Compare to previous cycle.
- **New flags surfaced this cycle.** List per dimension with finding category (real risk / documented convention / data hygiene / script artifact).
- **Fixes shipped this cycle.** List with commit references and the principle each closed against.
- **Party-symmetry line for any grade move in this cycle.** Use the template below.
- **Excluded evidence this cycle.** What was considered for inclusion and not included, with rationale.
- **Open carry-forward items.** Anything flagged but not actioned this cycle, with reason for deferral.

## Per-grade-move checklist line

Every cycle that changes a `grade` value on any dimension must include this line in the changelog item for the grade move:

> Party-symmetry check: Would the same evidence produce the same grade under a different governing party (Liberal / Conservative / NDP / Bloc / non-incumbent)? Yes / No / Explain.

If the answer is anything other than an unqualified "Yes," the grade move requires extra documentation in `judgmentDetail` explaining why the evidence is being read the way it is and whether a hypothetical alternative-party reading would arrive at the same band.

## Public-surface status

These are the reader-facing trust artifacts that follow this protocol. Status is current as of v5.40:

1. **Methodology FAQ** (Tier 2.6): built in v5.34 inside the Rubric tab.
2. **Skeptic Path UI threading:** orientation built in v5.36; fuller one-thread UI remains backlog.
3. **Corrections policy:** built in v5.33 at `docs/Corrections-Policy.md`.
4. **Right-of-reply / feedback channel:** built in v5.33 at `docs/Right-Of-Reply.md`.
5. **Citation format:** built in v5.33 in the About surface.
6. **Accessibility audit pass:** built in v5.38 at `docs/Accessibility-Audit-2026-05.md`; first keyboard-access fix shipped in v5.40.
7. **Perceived-bias survey mechanism:** methodology and links built in v5.37; activation pending.

## Audit re-run cadence

- **Phase 1 operational audit** (this protocol's scope): per major dashboard update (typically monthly cycles). The script is fast (~1 second). Findings interpretation takes a human pass.
- **Phase 2 foundational audit** (`docs/Foundational-Methodology-Audit-2026.md`, scaffolded in v5.39): annually, or when the scoring rubric major version changes (current: v1.1).
- **Script refinement** (taxonomy updates, threshold tuning, new patterns): when audit findings reveal script-definition artifacts. The May 2026 cycle refined the script three times (family 5/6 split, family 10 threshold exception, metric-attached source extraction).

## What this protocol does NOT do

- It does not replace editorial judgment. The audit script surfaces patterns; the editor decides what they mean.
- It does not eliminate bias. It tests whether the system is bias-resistant, traceable, and party-symmetric.
- It does not bind future grade movements. Pre-committed triggers do that. This protocol governs the audit and fix discipline around the triggers.
- It does not require a clean audit before publication. It requires that every flag be either (a) addressed by a shipped fix, (b) categorized as a documented convention, (c) tagged as a data-hygiene gap, or (d) explicitly carry-forwarded to a future cycle with reason.

## Version history

- **v1.0 (2026-05-16):** Initial protocol drafted from May 2026 audit findings and three shipped fix cycles (v5.28 / v5.29 / v5.30). Codifies eleven principles, three emergent disciplines, pre/post-cycle checklists, and the public-surface backlog.
- **v1.1 (2026-05-16):** Reconciled after v5.34-v5.40 public trust work. Marks Methodology FAQ, challenge-enabling hygiene, accessibility audit, survey methodology, Skeptic Path orientation, and Phase 2 scaffold as built, with activation / fuller UI / remaining accessibility fixes carried forward.
