# Continuity Quickstart — 2026-06-30

If you have to take this over cold, start by treating it as a rules-driven public scorecard, not a content site and not a vibes project. The live app is a React 19 + Vite SPA. The real product sits in the data and governance files more than the component code.

Read in this order first:

1. `AGENTS.md` or `CLAUDE.md`
   Same repo instructions. This is the operating manual. It tells you what is frozen, what must be checked before calling work done, and what not to touch casually.
2. `docs/Current-Roadmap.md`
   Best single snapshot of what is live, what just landed, what is waiting on evidence, and what is explicitly out of scope.
3. `docs/Consistency-Self-Audit-2026-05.md`
   Read this to understand the scoring logic, the deliberate exceptions, and why some dimensions are structurally weird but still live.
4. `docs/Scoring-Rubric-v1.1.md` and `docs/Source-Authority-Map.md`
   These explain the scoring boundary and what kinds of sources count for what.

After that, open the files that actually move the site:

- `src/data/dimensions.json`
  This is the heart of the product. Grades, status lines, sources, triggers, promises, judgment calls, all of it.
- `src/data/meta.json`
  Current version, update dates, next cycle date.
- `src/data/changelog.json`
  Public record of what changed and why.
- `src/utils.js`
  GPA and rollup math. Treat as dangerous.
- `src/constants.js`
  Grade constants, trend constants, and `POCKETBOOK_DIMS`. Also dangerous.

The main build path is simple. `npm run test:data` validates the live data and frozen GPA surface. `npm run build` runs the prebuild checks plus `scripts/generate-feed.mjs` and `scripts/generate-visitor-count.mjs`, then builds the SPA. `npm run preview` serves the result on port 4173. Push to `main` deploys to GitHub Pages.

Frozen surfaces are real, not advisory. Do not change these without explicit approval in the current turn:

- GPA formulas, grade-point mappings, and headline score rounding in `src/utils.js`
- `POCKETBOOK_DIMS` and grade constants in `src/constants.js`
- Thresholds in `gradeBasis`, `scoring.thresholds`, and canonical scoring docs
- Modifier rules, modifier effects, and penalty formulas
- The dimension model itself: 11 graded dimensions plus 1 tracker

If you think one of those has to move, stop and make the case first. This repo is built to change judgments and evidence more often than it changes the model.

Grade changes are gated. A grade should not move because a source exists, because a headline is loud, or because a reviewer has a hunch. The normal path is:

1. Check whether the dimension's published up/down triggers in `src/data/dimensions.json` were actually met.
2. Confirm the evidence is public and traceable. Every trigger needs a real source path: external URL, internal anchor, or an honestly labeled event-driven placeholder.
3. Keep the source band sane. The working target is usually 5 to 8 sources per graded dimension. Overloaded files should trim before they add.
4. Re-read the relevant methodology doc if the dimension is an exception case. Defence & Trade, Flagship Delivery, and Promise Delivery are not normal files.
5. Run `npm run test:data`.
6. If the change affects methodology, source-family judgment, or a new analytical source family, do a reflection pass before calling it settled. The roadmap makes that expectation explicit.

Before pushing anything live, check more than "build passed":

- For data-only work: run `npm run test:data` and report the exit status.
- For UI work: run `npm run build`, then verify the affected view at desktop and mobile widths using `docs/UI-Regression-Checklist.md`. Browser-only behavior still needs a browser-capable agent or a human.
- For methodology work: name the consistency check you applied.
- For copy: check against the voice and consulting-risk wording rules in `AGENTS.md`.
- For bugs: identify the concrete mechanism first, then fix the root cause.

Before `git push`, run `git diff --cached --check` and the staged identifier scans from `AGENTS.md`. If they hit anything, stop and look at it. Also remember that this repo may be shared. Do not revert unrelated work just to get to clean.

Last thing: when a release is user-visible, the public record has to stay coherent. That usually means updating `meta.json` version and `lastUpdated`, then adding the matching top entry in `changelog.json`. If those drift apart, the live header, changelog, and deploy state stop telling the same story.
