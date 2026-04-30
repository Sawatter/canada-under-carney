# Claude Review Prompt — May 2026 Build Pass

**Purpose:** Paste this into a separate Claude window after the post-third-review build pass ships, so a fresh Claude session can stress-test the work and return a punch list. Pattern follows the structured review prompts used in earlier rounds: surface specific issues with severity + recommended rewrite + fix location (docs / data / UI).

The prompt is self-contained — the reviewer Claude does not see this conversation, so it must brief the reviewer cold.

---

## Paste this into a fresh Claude Code window pointed at the canada-under-carney repo

```text
You are reviewing the post-third-review build pass on the Canada Under Carney
dashboard. Live URL: https://sawatter.github.io/canada-under-carney/.
Repo: https://github.com/Sawatter/canada-under-carney. Working at
<repo root>.

This is an independent stress-test pass. Do not implement fixes. Read the
shipped work, look for problems, and return a punch list.

---

WHAT JUST SHIPPED (commit on main: "Ship post-third-review build pass:
derivation panel, MPO cohort grading, drawer glossary")

Three builds, all responding to the beta-tester critique that the dashboard
had "tons of bias baked into it" and "not nearly enough definition on
measures and thresholds":

1. Headline-score derivation panel.
   Both the Household Impact and Full Policy Audit scoreboard cards now
   carry a "How is this score built?" toggle. Clicking either opens a
   panel below the row showing the per-dim grade, points, weight,
   contribution, group subtotals, weighted sum, total weights, and the
   arithmetic that produces the displayed score and letter grade.
   Files: src/utils.js (new getOverallDerivation / getPocketbookDerivation
   helpers, calculateOverallGPA / calculatePocketbookGPA refactored to
   call into them), src/components/ScoreDerivation.jsx (new),
   src/components/ScoreboardHeader.jsx, src/components/Dashboard.jsx.

2. Major Projects regraded on cohort progress, not first-event triggers.
   The dimension now defines the project universe (16 MPO-cohort projects
   across 3 tranches as of April 2026) and grades on % of cohort that
   has advanced ≥1 stage from designated. The dimension card renders a
   "Project pipeline" section with the cohort summary and a collapsible
   per-project table sorted by stage.
   Files: src/data/dimensions.json (new projectCohort field with
   stageGates + 16 projects), docs/Canonical-Scoring-Sheets.md (section
   8 rewritten — new threshold ladder, new stage table, new triggers),
   docs/Source-Authority-Map.md (Major Projects Current State Delta
   updated — project list and stage tracking now marked as grade-moving
   fields, new tranche / groundbreaking sources threaded in),
   src/components/DimensionCard.jsx (new ProjectCohortSection helper).
   As of 2026-04-30, 4 of 16 (~25%) have advanced; file holds C with
   credit-claiming penalty still applied.

3. Confidence / Attribution / Lag glossary in the scoring drawer.
   Each dimension card's drawer pills now sit above a "What do these
   mean?" expandable. One-sentence definitions for each, with the level
   cutoffs spelled out (High/Medium/Low; Direct/Mixed/Mostly inherited;
   Short/Medium/Long).
   Files: src/components/DimensionCard.jsx (glossaryOpen state +
   inline expandable inside the existing scoring drawer block).

Meta bumped 5.6 → 5.7. New top changelog entry dated 2026-05-01-equivalent.
Bias-Threshold-Audit-2026-04.md gains a "What shipped in the
post-third-review build pass" section. Current-Roadmap.md Recently
Completed and Last updated refreshed.

---

REVIEW QUESTIONS

Please return a structured punch list. For each finding give: issue, why it
matters, severity (high / medium / low), exact rewrite (text or code), and
fix location (docs / data / UI / multiple). Then a short summary
classifying whether the build pass closes the inspectability gaps it
claimed to close.

Focus on:

(A) Does Build 1 — the derivation panel — make the headline scores
materially more reproducible than the prior "score with no math" state?
Is the math right? Does the panel's framing read as transparent
methodology rather than as a defensive disclosure? Anything important
the panel still hides?

(B) Is Build 2 — Major Projects cohort — reproducible from the dimension
card alone? Does the new threshold ladder match what the card actually
shows? Does the cohort universe look canonical, or is the project list
arguable / incomplete / stale? Does the threshold language hold up to
party-symmetry stress-testing — would a different government with the
same cohort distribution receive the same grade? Are stage attributions
defensible per the cited sources?

(C) Does Build 3 — the glossary — close the jargon-without-explanation
gap, or does the wording introduce new opacity? Are the level cutoffs
(≥60% / 30-60% / <30% etc) calibrated against the actual dimensions
they're applied to, or are they generic-sounding?

(D) Cross-cutting: any value-loaded language that crept back in
anywhere in the shipped surface? Any new inspectability gaps the pass
opens (e.g., a reader can verify the math but can't verify a different
upstream judgment that feeds the math)? Any data / docs / UI drift
between the three artifacts (e.g., dimensions.json says one thing, the
Canonical Scoring Sheet says another)?

(E) The scope check: are there obvious scope creep issues — e.g.,
should the derivation panel surface attribution / lag context too, or
would that overload it? Are there obvious next builds that follow
naturally from this pass (e.g., the same cohort-grading pattern applied
to other implementation-type dimensions like Flagship Delivery)?

Return findings under explicit sub-headings A, B, C, D, E. Each finding
gets its own bullet with the issue / why / severity / rewrite / location
fields. No need to be exhaustive — better to return 6-10 sharp findings
than 20 vague ones. End with a one-paragraph summary call: does the
pass close the gap it claimed to close?

Read these files first before forming opinions:
  src/utils.js
  src/components/ScoreDerivation.jsx
  src/components/ScoreboardHeader.jsx
  src/components/Dashboard.jsx
  src/components/DimensionCard.jsx (Major Projects-specific helper at
    bottom; glossary expandable inside the scoring drawer block)
  src/data/dimensions.json (Major Projects entry around line 242 onward)
  docs/Canonical-Scoring-Sheets.md (section 8)
  docs/Source-Authority-Map.md (Major Projects entry)
  docs/Bias-Threshold-Audit-2026-04.md (post-third-review build pass section)
  docs/Current-Roadmap.md (top entry under Recently Completed)
  src/data/meta.json (version + lastUpdated)
  src/data/changelog.json (top entry)

Disciplines you must respect while reviewing (these are project-wide rules
that the previous session enforced — don't propose breaking them):
- Markdown is the persistent memory layer. Do NOT run `bd init`.
- The About page's honesty disclosure is deliberate — do not propose
  reintroducing claims that "every grade is human editorial judgment."
- Party-symmetry is a stress test, not audience-pleasing.
- Multi-source rule for Ethics critique-driven downgrades.
- Build via `npm run build`. GitHub Pages auto-deploys on push to main.
```

---

## Notes on this prompt (for the user, not for the reviewer Claude)

The prompt is structured to (1) give the reviewer enough context to act cold without dumping the entire repo on them, (2) point at specific files first, and (3) ask for findings in a structured punch-list format that's easy to triage. The five sub-headings (A–E) ensure the review covers each build plus cross-cutting concerns rather than over-indexing on one. Severity ratings let you pick which findings to action before lunch with the beta tester.

If the reviewer flags drift between dimensions.json and Canonical-Scoring-Sheets section 8, that's a real risk worth checking — the cohort numbers and threshold thresholds are duplicated across both, and any future edit to one needs to update the other. Worth wiring into the Monthly Cycle Playbook if the pattern recurs.

Once you have the reviewer's punch list back, the natural next move is to fold the actionable findings into the May 14 monthly cycle as targeted edits, plus parking any architectural critiques in Parking-Lot.md. Don't try to address all findings in one window — pick the highest-severity items first.
