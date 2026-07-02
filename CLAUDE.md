# CLAUDE.md

Conventions for Claude / Codex sessions working on this repo. Read this before suggesting code, copy, or methodology changes.

## Operating loop

Every completed task or outcome runs through the same loop. Do not end at "done."

1. **Tie back to goals.** After any outcome lands, name what it advanced in [docs/Current-Roadmap.md](docs/Current-Roadmap.md) (the goals ledger) and what it exposed or unblocked.
2. **Plan.** Convert what it exposed into concrete next items, written into the roadmap's Now / Next / Later lanes with a one-line priority reason each. Nothing lives only in chat.
3. **Prioritize by leverage.** Trust and correctness items outrank polish; anything blocking the monthly cycle outranks both.
4. **Execute with agents.** Fan work out to as many sub-agents as the task honestly needs, on file-disjoint sets. Brief each agent on what the others are changing (file-disjoint is not claim-disjoint), and the integrator runs a cross-doc/cross-file consistency pass before commit.
5. **Cross-AI review before it counts.** Every substantive output gets an adversarial review by a different AI before or immediately after landing: Codex (`codex exec`, read-only, resumable thread) for code and plans; Comet for live-site product reviews; Claude via `scripts/claude-bridge.sh` when Codex is the builder. A timeout or non-answer is never approval.
6. **Feed the review back in.** Accepted findings become fixes now or roadmap items with an owner lane; rejected findings get a logged reason. Then the loop restarts at step 1.

**Editor gates (the steps that genuinely need the human):** running external reviews under the editor's own accounts (Comet), grade / promise-status / methodology adjudication, frozen-surface changes, and any external publication beyond pushing this repo. Everything else defaults to autonomous execution under the checks in this file.

## What this is

A public scoreboard that grades the Carney federal government across 11 policy areas plus one tracker (Promise Delivery). React 19 + Vite SPA, deploys to GitHub Pages from `main`. Live at https://sawatter.github.io/canada-under-carney/. Updated roughly monthly.

The dashboard is a **public scorecard with the methodology fully visible**. It is not a poll, voting guide, forecast, or popularity measure. The scoring boundary is named explicitly on the About page. The whole product thesis is that readers can argue with the criteria because the criteria are inspectable.

## Build and deploy

- `npm run build` runs prebuild (`scripts/generate-feed.mjs` + `scripts/generate-visitor-count.mjs`) then `vite build`
- Push to `main` triggers GitHub Actions auto-deploy to Pages
- Verify deploy by checking the version string in the live header matches `meta.json`
- Local preview: `npm run preview` (port 4173)

## Voice rules — read before writing any user-facing copy

Posts and copy should sound like an individual asking for help, not like a press release. Cut the following:

**Words / phrases to avoid:**
- `shipped` — use "made", "got done", "added", "built", "did"
- `comprehensive`, `robust`, `seamless`, `world class`, `state of the art`, `best in class`
- `leverage` (verb), `delve`, `underscore`, `tapestry`, `landscape` (abstract)
- `Moreover`, `Furthermore`, `Additionally`, `Conversely`, `Subsequently`
- `In conclusion`, `Ultimately`, `To wrap up`, `In summary`
- `It is important to note`, `It's worth noting`, `Whether you're a beginner or an expert`
- `In today's fast paced world` and similar generic motivational openers

**Punctuation / structure to avoid:**
- Em dashes (—) — use periods or hyphens
- Semicolons in casual copy — break into separate sentences
- Colon-title format ("Catchy phrase: explanation")
- Rule-of-three lists ("efficient, scalable, reliable") — vary count, vary rhythm
- Both-sides hedging where no real flip side exists
- Buzzword stacking ("modern, scalable, efficient solution")

**Use instead:**
- Lowercase i sometimes, run-on commas, mixed case — natural casual register
- Specific numbers, names, dates over generic examples
- Burstiness: mix short fragments with longer sentences
- Direct opinion-having ("I think this is off") over fake balance
- Lived-experience phrases ("kept tripping on", "took me ages to figure out")
- Self-deprecation when it's actually true

## Consulting risk wording

Public copy must not create implied warranties or assurance language. Use the matrix below on Reddit posts, About copy, and any external communication. The constraint exists because the words on the left side carry implied professional-services meaning and can create unintended liability.

| Avoid | Use instead |
|---|---|
| ensure, guarantee, warrant, promise, satisfy | facilitate, enable, assist, designed to, intended to |
| audit (verb), verify, validate, certify, attest, in our opinion | look at, comment on, analyze, review, assess |
| expert (noun), partner (verb), "in partnership" | experienced with, work with, collaborate, trusted advisor |
| best practices, world class, comprehensive, complete | leading practices, current standards, thorough, relevant |
| all, every, full, immediate, maximize, minimize | many, most, specific count, available, improve, reduce |

The dashboard's internal product name `Full Policy Audit` is grandfathered noun-phrase usage, not an active claim of professional assurance. External copy should never describe the project owner as "auditing" the government. Say "tracks" or "scores" or "grades".

## Architecture

```
src/
  components/
    Dashboard.jsx          ← top-level shell, view routing, scoreboard layout
    ScoreboardHeader.jsx   ← four-card row (Household / Audit / Promises / Approval)
    ScoreDerivation.jsx    ← "How is this score built?" panels
    DimensionCard.jsx      ← per-dimension card with expand drawer
    PromiseTracker.jsx     ← Promises tab list view
    ApprovalSignal.jsx     ← approval-polling card + drilldown
    TrendArrow.jsx         ← improving / stable / declining glyph + aria-label
    GradeChip.jsx          ← letter-grade pill
    Methodology.jsx        ← Rubric tab content
    About.jsx              ← About tab content
    EmailSignup.jsx        ← Kit signup
    VisitorCount.jsx       ← GoatCounter pill, same-origin fallback
    WhatsChanged.jsx       ← Change Log tab content
  data/
    dimensions.json        ← 12 dimensions (11 graded + Promise Delivery tracker)
    changelog.json         ← versioned change history, top entry is most recent
    meta.json              ← version, lastUpdated, nextUpdate, milestones
    approval-polls.json    ← rolling poll data + preferred-PM context
    history.json           ← per-cycle GPA history
  utils.js                 ← GPA calculation, derivation helpers, promise counting
  constants.js             ← GRADES, TREND, STATUS_COLORS, POCKETBOOK_DIMS
  index.css                ← design tokens + mobile overrides
docs/
  Scoring-Rubric-v1.1.md
  Source-Authority-Map.md
  Consistency-Self-Audit-2026-05.md
  Current-Roadmap.md
  Beta-Feedback-Log.md
  ...governance markdown files (~30)
```

## Data shape rules

`dimensions.json` is a list of 12 dimension objects. Invariants:

- Every dimension has: `id`, `name`, `whatThisGrades`, `gradeBasis`, `scoring`, `gradeTriggers`, `sources`, `lastUpdated`
- Graded dimensions also have: `judgmentCall`, `judgmentDetail`, `grade`, `previousGrade`, `trend`, `status`
- Graded dimensions may carry an optional `verdictLine`: one authored plain-language sentence (110 chars max, validated by `validate-dimensions.mjs`) giving the verdict gist. No grade letters, no urgency wording, never on the tracker, never synthesized at render time.
- Tracker dimensions have: `excludeFromGPA: true`, `informationalGrade` (NOT `grade`), and DO NOT need `judgmentCall` (the renderer suppresses it)
- Promise Delivery is the only current tracker

Trigger objects (in `gradeTriggers.up[]` and `down[]`) must be structured:
```json
{
  "text": "PBO confidence rises above 25%",
  "setDate": "2026-04-17",
  "sourceLabel": "PBO fiscal analysis",
  "sourceUrl": "https://..."           // present for external sources
}
```
Every trigger carries a `setDate` (the date the condition was first published, `YYYY-MM-DD`). Existing triggers were backfilled from git introduction dates; new triggers take the cycle date. The validator requires it, so a reader can confirm a trigger predated the evidence it now adjudicates.

Triggers without an external URL must either:
- Carry an `internalRef` like `{type: "cohort"}`, `{type: "anchor", view: "scorecard", target: "scorecard-dimension-grid"}`, or `{type: "view", target: "promises"}` — these render as in-app navigation
- OR be honestly labeled in the `sourceLabel` as event-driven (e.g. `"Fitch / Moody's / S&P event-driven rating source"`)

**Source band:** aim for 5 to 8 sources per graded dimension. Don't let any one dimension drift past ~10 (kitchen-sink) or fall below 4 (under-evidenced).

**Pocketbook weighting:** `POCKETBOOK_DIMS` in `constants.js` is the four dimensions that double-weight in the Household Impact GPA. Don't change without explicit approval.

## Methodology principles

The dashboard is non-partisan by construction. When in doubt:

- **No advocacy.** The dashboard scores; it does not argue for or against any party, candidate, or policy direction.
- **Paper-trail only.** Don't grade things without public evidence. Refuses to score: leadership style, vision, symbolic politics, popularity, character.
- **Named exceptions are explicitly framed:**
  - Defence & Trade is mixed-construct (defence milestone + trade outcome under one grade) and carries a tripwire: if the defence and trade sub-scores move in opposite directions, or differ by more than 1.0 GPA points (about one full letter grade), for two consecutive monthly review cycles, queue the split for promotion to live separate files in the next version.
  - Flagship Delivery is a meta-rollup, not a peer dimension. Scoped explicitly in its `judgmentCall`. It exits probation after its first full monthly review cycle only if the Combination Rule runs unchanged, the resulting direction does not contradict the underlying file-status movement, the cycle yields at least one cross-file execution insight spanning two or more flagship files, and no unresolved deconfliction breach is found. If any part fails, demote it in v2 rather than extending probation.
  - Promise Delivery is a tracker, not part of the GPA. Has `excludeFromGPA: true` and `informationalGrade` instead of `grade`.
- **Consistency over absence-of-bias.** The credibility argument is "same rule applied across all 11 files" — not "no editor judgment exists." Judgment is admitted in `judgmentCall` and `judgmentDetail` on every graded card.
- **Traceability.** Every grade-move trigger has a one-click path to its evidence — external URL, internal anchor, or honestly-labeled event-driven placeholder.

## Operational guardrails

These rules are action checks, not vibes. If a future agent cannot produce the check, it should not claim the work is done.

**Before saying a change is complete:**
- Data change: run `npm run test:data` and report the exit status.
- UI change: run `npm run build`, then inspect the affected view at desktop and mobile widths. Use `docs/UI-Regression-Checklist.md` for dimension-card or dashboard-shell work. Name the view, viewport, and what was checked.
- Methodology change: re-read the relevant methodology doc and name the consistency check applied.
- Copy or external-message change: check against the Voice rules and Consulting risk wording above. Name any risky words removed or intentionally kept.
- Bug fix: reproduce or otherwise identify the mechanism first, then name the file and line range that caused it.

**AI review state sync:**
- Before asking another agent to review a diff, commit or stash unrelated work so the reviewer sees a coherent state. If the review must run on a dirty tree, name the dirty files and which ones are in scope.
- Start review passes by confirming the current branch, `HEAD`, `meta.json` version, and whether the live site is expected to match that version.
- Codex can plan, read, patch, and run deterministic checks. It cannot be the final verifier for browser-only UI behavior unless it has working browser access in that session. A browser-capable agent or human must verify scroll, focus, responsive layout, and interactive states.
- Claude bridge reviews from Codex must use `bash scripts/claude-bridge.sh -f <prompt-file>` or a piped prompt. Never run bare `claude`: it opens an interactive session and can hang in non-interactive Codex shells. The wrapper runs headless, read-only, and self-times-out. Exit 0 means the review is on stdout; any non-zero exit, especially 124, means no review was produced and must be reported rather than treated as approval.

**Before any `git push`:**
- Run `git diff --cached --check`.
- Run a staged personal-identifier scan. Universal patterns (absolute local
  paths + emails) are inline; the editor's name and city live in the
  gitignored `.identity-patterns` file so those literals never enter this
  public repo:
  ```bash
  # Universal: absolute local paths + email addresses
  git diff --cached -G "(/Users/[A-Za-z]|/home/[A-Za-z]|@[A-Za-z0-9._%+-]+\\.[A-Za-z]{2,})" -- '*.md' '*.js' '*.jsx' '*.json' '*.css' '*.sh'
  # Editor identity (name, city) — patterns kept local-only in .identity-patterns
  [ -f .identity-patterns ] && git diff --cached -G "$(paste -sd'|' .identity-patterns)" -- '*.md' '*.js' '*.jsx' '*.json' '*.css' '*.sh'
  ```
- If either scan returns anything, stop and surface the matches before pushing. Some location words may be legitimate policy content, but they still need a human look. (The pre-commit hook and scope-guard run these same checks automatically.)

**Frozen surfaces - never change without explicit user approval in the current turn:**
- GPA formulas, grade-point mappings, and headline-score rounding in `src/utils.js`
- `POCKETBOOK_DIMS` and grade constants in `src/constants.js`
- Threshold values in `gradeBasis`, `scoring.thresholds`, or canonical scoring docs
- Modifier rules, modifier effects, and penalty formulas
- The dimension model: currently 11 graded dimensions plus 1 tracker

**External communication:**
- Draft Reddit posts, comments, DMs, GitHub support notes, and outreach copy freely when asked.
- Do not send, paste, post, submit, or click a final external action without an explicit current-turn ask.
- The line is: draft anything, send nothing.

**Feedback handling:**
- Treat Claude, Codex, Reddit, and beta feedback as claims to check, not orders to obey.
- If feedback says "X is broken", read the code or live UI and confirm the break with evidence before fixing it.
- If feedback proposes a solution, confirm the underlying problem first.
- Reddit comments from likely product-promo accounts are low-trust. Check `docs/Beta-Feedback-Log.md` before treating them as product direction.

**Bug handling** (applies to data/methodology anomalies too, not just code):
- Reproduce or characterize the symptom.
- Minimise before hypothesising — isolate the smallest input, file, or step that still shows the anomaly before guessing the cause. (E.g. when the bias audit flags an unexpected count, find the single source/metric responsible before changing anything.)
- Trace it to a concrete mechanism in code or data.
- Fix the root cause, not only the visible symptom.
- Re-run the relevant check to confirm the fix and catch recurrence: `npm run test:data`, `node scripts/audit-bias-resistance.mjs`, or the frozen-surface test, whichever covers the surface you touched.
- Do not add broad try/catch blocks, defensive guards, or "just in case" rewrites without naming what failure they catch and why.

## Versioning and changelog

- `meta.json` `version` is a string of the form `"5.X"`. Bump for any user-visible change.
- Bump `lastUpdated` in the same edit.
- Add a new entry at the top of `changelog.json` with the same date.
- Changelog entry shape:
  ```json
  {
    "date": "YYYY-MM-DD",
    "summary": "One sentence on what landed.",
    "items": [
      { "type": "product"|"method"|"docs"|"event"|"grade"|"minor",
        "headline": "Short noun-phrase headline",
        "body": "1-3 sentences." }
    ]
  }
  ```
- Most recent entry sits at index 0.
- Grade changes get `type: "grade"` items with `dimensionId`, `dimensionName`, `from`, `to`, `deltaLabel`, `headline`, `body`, `drivers`, `link`.

## Common mistakes to avoid

- Don't run `bd init` (Beads). Conflicts with markdown governance.
- Don't add tests inside `src/data/`. Put tests in a separate location.
- Don't commit the `tmp/` folder. It's untracked dev scratch.
- Don't change grade math (GPA weights, threshold values) without explicit user approval.
- Don't add nominal features like a Print/Export button that doesn't actually produce useful output. Either build the feature properly or don't advertise it.
- Don't use `dim.grade` on tracker dimensions. Use `dim.informationalGrade` or check `dim.excludeFromGPA` first.
- Don't introduce TypeScript piecemeal. The project is JS; a TS migration is a separate refactor decision.
- Don't reply to shill accounts (`Competitive-Tiger457` / Leadline, `Glad-Professional598` / Runable). They run engagement playbooks across many subs.
- Don't post r/canada (Substack/fringe-media rule risk), r/onguardforthee (audience reads partisan no matter framing), r/datajournalism or r/metacanada (restricted).

## When in doubt

Read `docs/Current-Roadmap.md` for active threads, `docs/Consistency-Self-Audit-2026-05.md` for the methodology rationale, and `docs/Beta-Feedback-Log.md` for what real readers have actually pushed back on.
