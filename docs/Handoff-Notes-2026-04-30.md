# Handoff Notes — 2026-04-30

**Purpose:** Bootstrap a fresh Claude Code (or other AI agent) session to continue the post-beta methodology hardening work without losing context. The previous session's tokens were exhausted; this doc captures the state, the immediate work, and the disciplines so the next session can pick up cleanly.

---

## 1. Where the project is

**Live:** https://sawatter.github.io/canada-under-carney/
**Repo:** https://github.com/Sawatter/canada-under-carney
**Current dashboard version:** v5.6 (per `src/data/meta.json`)
**Next monthly cycle:** 2026-05-14

The dashboard grades the federal Carney government A–F across 11 policy dimensions plus an ungraded Promise Delivery tracker. Two headline scores: **Full Policy Audit** (equal-weight across 11 dims) and **Household Impact** (double-weight on housing, cost of living, the economy, government spending). An ungraded **Approval Signal** sits in the scoreboard row showing rolling polling averages. RSS feed, email signup (Buttondown), visitor counter (GoatCounter), and a daily subscriber-count alert workflow are all live.

A focused beta-test feedback round produced a methodology hardening pass over the last two days. That pass is shipped (commits up through current `main`) and documented in [docs/Bias-Threshold-Audit-2026-04.md](Bias-Threshold-Audit-2026-04.md).

---

## 2. The work this session needs to do (priority order)

Three concrete builds came out of the most recent reviewer feedback. All three are real beta-tester-class critiques. Build them before the May 14 cycle.

### Build 1 — Household Impact derivation panel (highest priority)

**Problem.** Both headline cards (Household Impact and Full Policy Audit) show a letter grade and a numeric score. Neither shows the math. A reader sees "Household Impact: D+ · Score: 1.5" with no way to verify how 1.5 is computed. This is the same "not enough definition on measures and thresholds" critique the beta tester raised, applied at the aggregate level instead of per-dimension.

**Fix.** Add a "How is this score built?" expandable on both score cards (Household Impact and Full Policy Audit). When clicked, render the derivation:

```
Household Impact = (sum of grade-points × weight) / sum of weights

Household-weighted (×2 each):
  Housing Supply       D    (1.0)
  Cost of Living       D+   (1.3)
  Economic Policy      D    (1.0)
  Fiscal Health        D    (1.0)

Other dims (×1 each):
  Defence & Trade      A-   (3.7)
  Climate              D    (1.0)
  Carbon Pricing       C    (2.0)
  ... etc

Weighted sum: (1.0+1.3+1.0+1.0)×2 + (3.7+1.0+2.0+...)×1 = X.X + Y.Y = Z.Z
Total weights: 4×2 + 7×1 = 15
Score: Z.Z / 15 = 1.57 → rounded to 1.5 → D+
```

Implementation:
- `src/utils.js` already has `calculateOverallGPA()` and `calculatePocketbookGPA()` — they do the math but don't expose the per-dim breakdown. Add helper functions that return `{ dimensions: [{name, grade, gpa, weight, contribution}], weightedSum, totalWeight, finalScore }` so the UI can render the derivation.
- `src/components/ScoreboardHeader.jsx` is where both score cards render. Each card is a flex container with the cardBase/cardTitle/cardSubtitle/cardScoreCaption tokens. Add the expandable below the existing GradeChip + Score line.
- The expandable should follow the same chevron-toggle pattern used on dimension cards (`▸` collapsed, `▾` expanded) and the same disclosure semantics (aria-expanded, aria-controls, role="region").
- Constants: `POCKETBOOK_DIMS` lives in `src/constants.js` — that's the canonical list of the 4 household-weighted dim IDs.

**Where to put the derivation source-of-truth:** the math should be in `utils.js` (so it stays consistent with `calculateOverallGPA`), and the derivation UI should be a new component (e.g., `src/components/ScoreDerivation.jsx`) imported by ScoreboardHeader twice — once for each headline.

### Build 2 — Major Projects cohort-based rubric rewrite

**Problem.** Major Projects' current threshold ladder (in `docs/Canonical-Scoring-Sheets.md` around line 335) grades on event triggers ("at least one project completes a full MPO cycle"). It doesn't define the project universe and doesn't grade cohort progress. A reader could reasonably ask "how many projects are there, and what's the score based on?" and get no answer. The fix is to define the universe, define stage gates, and grade by % of cohort at each stage.

**Fix.**

(a) **Add the project universe** to the dimension. Pull the canonical list of MPO-designated projects from public sources (Major Projects Office published lists; Building Canada Act designations). Likely 10-15 projects as of April 2026. Add to `src/data/dimensions.json` under the `major-projects` dim as a new field, e.g.:

```json
"projectCohort": {
  "asOf": "2026-04-30",
  "projects": [
    {"name": "...", "stage": "approved", "stageDate": "...", "sourceUrl": "..."},
    ...
  ],
  "stageGates": ["designated", "reviewed", "approved", "permitted", "under_construction", "completed"]
}
```

(b) **Rewrite the threshold ladder** in CSS to grade by cohort progress, not first-event:

```
A: ≥50% of designated projects have moved ≥2 stages forward AND median approval time beats the 2-year MPO target
B: ≥30% have moved ≥1 stage forward AND median approval time meets the target
C: Pipeline exists, <30% have advanced, median approval time unchanged
D: Pipeline exists but no documented advancement OR median approval time worsens
F: No functional MPO process at all
```

(c) **Render the cohort on the dimension card.** Add a "Project pipeline" section showing the project list with current stage. Could be a small table or stage-bar visualization. Source URLs per project so a reader can click through.

(d) **Update SAM** ([Source-Authority-Map.md](Source-Authority-Map.md)) for the Major Projects entry to reflect that the project list and stage tracking are now live grade-moving fields, not just narrative.

**Watch:** the same critique applies to other implementation-type dimensions (Flagship Delivery, possibly Promise Delivery — though Promise Delivery is already cohort-based). Don't expand to those yet; finish Major Projects first as a pattern, then assess.

### Build 3 — Confidence / Attribution / Lag glossary in the scoring drawer

**Problem.** The scoring drawer renders three pills (Confidence / Attribution / Lag) pulled from `dim.tags`. They appear without explanation. Casual readers see jargon. They're real internal-governance fields that serious readers benefit from but they need a one-time definition.

**Fix.** Add a small "What do these mean?" inline element inside the scoring drawer, below the three pills, that expands to:

- **Confidence** — how robust the editor thinks this grade is to new data. *High* = direct measurement against numeric thresholds. *Medium* = qualitative judgment with mixed evidence. *Low* = sparse evidence.
- **Attribution** — what share of the outcome the federal government actually controls. *Direct* = ≥60% federal levers. *Mixed* = 30-60%. *Mostly inherited* = <30%.
- **Lag** — how long policy effects take to show in the metrics. *Short* = monthly/quarterly. *Medium* = 1-2 year cycles. *Long* = 5+ year structural.

Keep it brief — 3 sentences total (one per concept). Hidden by default behind a "What do these mean?" link styled like the other small drawer-internal links.

---

## 3. Disciplines that must not be broken

These are project-wide rules the previous session enforced. Don't violate them in the new session.

### Memory & task tracking

- **Markdown is the persistent memory layer.** [docs/Current-Roadmap.md](Current-Roadmap.md), [docs/Parking-Lot.md](Parking-Lot.md), the decision memos, this handoff doc, the Monthly Cycle Playbook, and per-commit `git log` are how state survives across sessions. Read them at session start.
- **Beads (`bd`) is installed but NOT initialized in this repo.** A previous session evaluated Beads and decided not to adopt it for this project because it conflicts with the markdown governance. Do not run `bd init` in this repo. If you find a `CLAUDE.md` or `.claude/settings.json` claiming Beads should own task tracking, that's a Beads-init artifact that shouldn't be there — flag it, don't follow it.
- **Do not use TodoWrite as the persistent task list.** It's session-scoped only. Anything that should outlive the session goes into Roadmap or Parking-Lot.

### Honesty disclosure

- The dashboard's About page **explicitly discloses AI involvement.** The Principles line is: *"Every grade is anchored to the published rubric and documented evidence, with the reasoning shown on every card. Any reader can apply the rubric to the evidence themselves and reach their own conclusion."* The Built By line is: *"Built with AI assistance (Claude Code + ChatGPT) under human editorial direction. The rubric, evidence sources, and per-grade reasoning are all public so any grade can be checked against its evidence."*
- Do not reintroduce claims that "every grade is a human editorial judgment" or "all editorial judgments made by the human editor." Those overclaims were removed deliberately. The honest framing is reviewability of the rubric + evidence + reasoning, not human authorship.

### Methodology disciplines

- **Party-symmetry as a stress test, not audience-pleasing.** When testing whether a rubric or indicator stack contains hidden bias, the question is "would the same rule apply to a different government doing the equivalent thing?" — not "does this satisfy a specific political faction." Frame discussions as methodological symmetry, not as political-audience checks.
- **Multi-source rule for Ethics critique-driven downgrades.** Per [docs/Source-Authority-Map.md](Source-Authority-Map.md) line 282 area: any D-band move on Ethics that's driven by independent governance critique (rather than an official adverse finding) requires ≥2 independent governance critics in the live source stack. Currently the live stack has Democracy Watch + the House ETHI report — that satisfies the rule. Don't move Ethics to D on a single critique source.
- **QA Rule 8 for new analytical source families.** Adding a new analytical source family (e.g., a new think tank to the source stack) requires a reflection pass + Claude review before treating it as settled. Per-cycle URL additions and traceability fixes are direct edits and don't need this; new families do.
- **Three-lane QA pattern for grade moves.** Analyst draft → Red-Team review → Referee call. Documented in `docs/QA-Gatekeeping-Rules.md`. Most relevant during cycle work; less relevant during UI polish.

### Build / commit / push

- Build: `npm run build` (must pass without warnings)
- The prebuild script `scripts/generate-feed.mjs` generates `public/feed.xml` from the changelog. This runs automatically.
- GitHub Pages auto-deploys on every push to `main` via `.github/workflows/deploy.yml`. Live URL updates within ~30 seconds.
- Commit message style: sentence-case imperative, descriptive, no Conventional Commits prefixes. Examples in `git log --oneline -10`.
- Co-author trailer on every commit:
  ```
  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
  ```
- A daily GitHub Actions workflow polls Buttondown subscriber count and emails the repo owner if count ≥ 95. Don't break this.

---

## 4. Files to read first (bootstrap order)

In order. Each file is essential for one specific reason.

1. **This file** — you're reading it.
2. [docs/Current-Roadmap.md](Current-Roadmap.md) — current state + Recently Completed log. Tells you what's been done.
3. [docs/Parking-Lot.md](Parking-Lot.md) — backlog + working rules.
4. [docs/Bias-Threshold-Audit-2026-04.md](Bias-Threshold-Audit-2026-04.md) — what the most recent methodology pass changed and what's still open.
5. [docs/Scoring-Rubric-v1.1.md](Scoring-Rubric-v1.1.md) — the rubric that anchors every grade.
6. [docs/Canonical-Scoring-Sheets.md](Canonical-Scoring-Sheets.md) — per-dimension rubrics. Long file. Read the Major Projects entry (around line 319) before doing Build 2.
7. [docs/Monthly-Cycle-Playbook.md](Monthly-Cycle-Playbook.md) — recurring monthly task discipline. Relevant before May 14 cycle.
8. `src/data/meta.json` — version, dates, milestones.
9. `src/data/changelog.json` — what's been shipped, in user-facing language.
10. `src/data/dimensions.json` — the 12 dimensions' live data. Skim the structure on at least one graded dim and on Promise Delivery (the tracker).
11. `src/utils.js` — the scoring math. Critical for Build 1.
12. `src/components/ScoreboardHeader.jsx` — where both headline cards render. Critical for Build 1.
13. `src/components/DimensionCard.jsx` — the single biggest component. Critical for Build 2 (cohort UI) and Build 3 (drawer glossary).

Optional but useful:
- [docs/Source-Authority-Map.md](Source-Authority-Map.md) — per-dim required source roles. Read the Ethics entry around line 220 to understand the multi-source rule.
- [docs/Inter-Rater-Reliability-Protocol.md](Inter-Rater-Reliability-Protocol.md) — the protocol for testing whether two readers converge on the same grade. Becomes relevant if a beta tester offers to do an independent grading pass.
- [docs/v2-Decision-Memo-Approval-Signal.md](v2-Decision-Memo-Approval-Signal.md) — explains why the Approval Signal is ungraded.

---

## 5. The beta-tester context (why this work matters)

A first beta tester gave structural feedback that the dashboard had:
- *"tons of bias baked into it"*
- *"not nearly enough definition on measures and thresholds"*

Three review passes have shipped in response (audit memo documents them). The remaining work is what came out of the third review:

1. The dashboard's headline scores (Household Impact, Full Policy Audit) aren't reproducible from the card alone — Build 1 fixes this.
2. Major Projects has a brittle event-trigger threshold ladder — Build 2 fixes this with cohort-based grading.
3. The Confidence/Attribution/Lag pills appear without definition — Build 3 fixes this.

The user offered the tester lunch to discuss specifics. Lunch is the venue where the remaining vague critiques ("tons of bias" without examples) get converted into actionable specifics. The current build pass should ship before lunch so the user can demonstrate seriousness.

---

## 6. After the three builds: write a Claude review prompt

After shipping all three, the user wants a prompt that can be pasted into another Claude session (separate window) so that Claude can review the work and poke holes in it. The prompt should:

- Briefly state what's been built (the three items above)
- Point at the changed files
- Ask the same kind of stress-test questions previous review passes used:
  - Is the Household Impact derivation panel materially clearer than the prior "score with no math" state?
  - Is the Major Projects cohort rubric reproducible from the card?
  - Does the glossary close the jargon-without-explanation gap?
  - Any remaining inspectability gaps?
  - Any value-loaded language that crept back in?
- Ask for a punch list with severity + recommended rewrite + fix location (docs / data / UI)

Pattern to follow: the recent review prompts in this conversation's history were structured like *"Please review X. Focus on Y. Return: issue, why it matters, severity, exact rewrite, whether the fix belongs in docs, data, or UI."*

---

## 7. Honest self-audit going in

Things that will probably come up during this work:

- **Build 1 (derivation panel) is straightforward**, ~1 hour. Most of the complexity is in adding helper functions to utils.js cleanly without breaking the existing tests/uses. The UI piece is one expandable on each of two cards.

- **Build 2 (Major Projects cohort)** is the heaviest. Pulling the canonical project list from public sources will require web research. The MPO publishes its referrals; the Building Canada Act designations are published. Allow ~2-3 hours including the rubric rewrite, the dimensions.json schema addition, the SAM update, and the dimension card cohort visualization.

- **Build 3 (glossary)** is the smallest, ~30 minutes. A small inline expandable inside the scoring drawer.

- **All three changes ripple into the changelog** ([src/data/changelog.json](../src/data/changelog.json)), the [Bias-Threshold-Audit-2026-04.md](Bias-Threshold-Audit-2026-04.md) memo (add a "What shipped in the May 1 pass" section), and the Roadmap ([docs/Current-Roadmap.md](Current-Roadmap.md)) Recently Completed list.

- **`meta.json` should bump from 5.6 → 5.7** when this work ships.

---

## 8. What "done" looks like

Before this session ends, the following should be true:

- All three builds shipped to `main`, deployed to GitHub Pages, verified live.
- Changelog has a new top entry dated 2026-05-01 (or the current date) describing what landed.
- `meta.json` version bumped + lastUpdated set to today.
- [Bias-Threshold-Audit-2026-04.md](Bias-Threshold-Audit-2026-04.md) updated with a new "post-third-review build pass" section.
- A Claude-review prompt drafted and saved (either in this handoff doc as an appendix, or in a new file `docs/Claude-Review-Prompt-2026-05.md`).

If the new session also runs out of tokens partway through, this same handoff doc should be updated with the partial state so the next-next session can pick up.

---

*Handoff written 2026-04-30. Update this doc if state changes materially.*
