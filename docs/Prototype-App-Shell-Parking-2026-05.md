# Prototype App Shell Parking Note

**Date parked:** 2026-05-13
**Status:** saved experiment, not production
**Public source of record:** the live dashboard at `https://sawatter.github.io/canada-under-carney/`

## Why This Exists

The current live dashboard is methodologically stronger than the prototype. It has the complete evidence surface, source links, scoring drawers, project pipeline, promise tracker, changelog, About page, and production polish.

The prototype exists because the live dashboard is text-heavy and can feel hard to use on phones. The goal was to test whether the same evidence could feel more like an app:

- overview first
- evidence one tap away
- mobile list-detail flow
- desktop workspace flow
- cleaner hierarchy for long scoring files
- less sideways scrolling
- clearer place for methodology and scoring boundaries

This note parks the prototype so a future session can continue from the actual state instead of starting from scratch.

## How To Run It

The prototype is wired through the dev-only app toggle in `src/App.jsx`.

```bash
npm run dev -- --host 127.0.0.1
```

Then open:

```text
http://127.0.0.1:5173/canada-under-carney/?prototype=app
```

If Vite picks another port, use that port with the same query string, for example:

```text
http://127.0.0.1:5174/canada-under-carney/?prototype=app
```

The prototype should not appear in production because the toggle is guarded by `import.meta.env.DEV`.

## Files Involved

- `src/App.jsx` - dev-only prototype loader behind `?prototype=app`
- `src/components/prototype/DashboardPrototype.jsx` - prototype shell and prototype components
- `src/components/prototype/prototype.css` - prototype-only styles

The prototype uses live data imports from the real dashboard:

- `src/data/dimensions.json`
- `src/data/meta.json`
- `src/data/approval-polls.json`
- `src/utils.js`
- `src/constants.js`

No scoring math, threshold, modifier, or dimension-data change was intended as part of the prototype.

## Locked Prototype Decisions

- **Navigation:** four primary tabs - `Scorecard`, `Promises`, `How it works`, `About`.
- **Updates:** not a bottom-nav item. The header update pill points toward the future method/change surface.
- **Mobile model:** list first, then full-screen detail. Bottom navigation below desktop width.
- **Desktop model:** left list, right detail pane. Selecting a dimension swaps the right pane.
- **Scorecard hero:** Household Impact can lead, but must be framed as a lens, not the one true score.
- **Full Policy Audit:** stays co-equal as the equal-weight broad score.
- **Approval Signal:** can sit in the top stat stack, but must always say it is public approval and not part of the grades.
- **Visual target:** modern, civic, restrained, readable. Avoid making it feel like a campaign site or a marketing landing page.
- **Production rule:** the live dashboard remains source of record until the prototype reaches evidence parity and passes desktop/mobile checks.

## Current Prototype Scope

The prototype currently exercises five files:

- Carbon Pricing
- Major Projects
- Defence & Trade
- Flagship Delivery (`execution-delivery`)
- Promise Delivery tracker

Those were chosen because they stress different product problems:

- Carbon Pricing is the clean file.
- Major Projects is the complex evidence file with the 15-project cohort.
- Defence & Trade is a mixed-construct exception.
- Flagship Delivery is a rollup exception.
- Promise Delivery is a tracker, not a graded peer.

## What Is Built

### App Shell

- Header with update pill and version.
- Global trust frame under the header.
- Desktop sidebar navigation.
- Mobile bottom navigation.
- Four-tab structure: Scorecard, Promises, How it works, About.
- Notice surface for unfinished actions.

### Scorecard

- Household Impact hero card.
- Supporting cards for Full Policy Audit, Promises, and Approval Signal.
- Approval Signal card includes the boundary line: public approval, not part of the grades.
- Dimension list supports grouped and ranked modes.
- Dimension rows include grade/tracker marker, last-reviewed cue, short preview, quick links, and an open-detail action.

### Detail View

Detail files render these sections where data exists:

- Why
- Evidence
- Judgment
- Move
- Project pipeline for Major Projects
- Rubric
- Sources

The right-pane detail view works on desktop. The full-screen detail mode works on mobile.

### Major Projects Prototype Improvements

This is the most developed detail file.

- Evidence Snapshot splits grade-moving metrics from context metrics.
- Project Pipeline shows:
  - cohort count
  - documented advancement count
  - stage distribution
  - explanation that documented later-dated movement is the grade threshold
  - expandable full list of all 15 projects
- Mobile project list uses stacked cards.
- Desktop project list uses a table.
- Move triggers with internal `cohort` refs open the Project Pipeline section.
- Scoring adjustments, timing rule, guardrails, critics/defenders, scope, inherited context, confidence/attribution/lag, and source links are partially restored from production.

### How It Works

Prototype tab explains:

- what gets scored
- what stays outside the score
- how to inspect a grade
- the planned human re-grade reliability test

### About

Prototype About page clarifies that this is only a local shell experiment and not a new score.

## What Is Not Done

These are the blockers before this can replace production:

1. **Promises tab redesign**
   The Promises tab is currently a planning surface, not a real replacement for the production promise tracker.

2. **All 11 graded dimensions**
   Only five representative files are in the prototype. The rest need to be added and checked.

3. **Evidence parity**
   Every production evidence surface has to map somewhere:
   - confidence / attribution / lag
   - glossary
   - scope note
   - where judgment enters
   - timing rules
   - scoring adjustments
   - guardrails
   - sub-scores
   - key metrics
   - promises summary
   - critics and defenders
   - in scope / out of scope
   - inherited context
   - sources

4. **Change Log**
   Updates are only stubbed through the header pill / notice. The real changelog is not integrated.

5. **Approval Signal drilldown**
   The card exists, but the production poll-source drilldown is not wired in.

6. **Score derivation math**
   The live dashboard's "How is this score built?" panels are not recreated in the prototype.

7. **URL routing**
   Deep links are deferred. Before production cutover, dimension detail views should be shareable and browser Back should behave predictably.

8. **Palette decision**
   The prototype uses a civic restrained look, but no final color comparison has been made.

9. **Accessibility pass**
   The direction is good, but semantic summary-card structure and keyboard behavior need a proper pass before production.

10. **Final live parity pass**
   Before replacing production, compare every production tab and expanded scoring file against the prototype so no trust/evidence surface disappears.

## Research And Design References

Useful references gathered during the design research pass:

- Linear 2024 UI redesign - keep structural patterns, improve visual hierarchy, alignment, density, and restrained color.
- GOV.UK Summary Cards - useful model for grouped fact summaries with header/body/action anatomy.
- Material Design 3 navigation bar - 3 to 5 primary destinations is acceptable; four tabs is defensible here.
- NN/g dashboard guidance - dashboards compress information; exploration belongs in drilldown.
- NN/g progressive disclosure - supports quick preview into detail flow.
- CMS Care Compare - closest public scorecard analog: official data, public comparison, methodology disclosure.
- USWDS typography and civic design guidance - useful for readable government/civic interfaces.
- Master-detail responsive pattern - stack on phones, split pane on desktop.

## Feedback Already Incorporated

The prototype was shaped by prior external feedback:

- "Trust is the product."
- Make source trails close to the grade.
- Show where judgment enters.
- Freshness matters.
- Clarify whether this is information or vote influence.
- Avoid acting like measurable equals valuable.
- Mobile verification has to be easy.
- Cards need more breathing room on phones.

The live dashboard already responded to most of this feedback. The prototype tries to make the same response feel easier to use.

## Restart Point

When this work resumes, do not start by redesigning everything.

Start here:

1. Run the prototype locally with `?prototype=app`.
2. Open Major Projects on mobile and desktop.
3. Compare it against the live Major Projects card.
4. Confirm whether the prototype still has all evidence now visible in production `v5.20`.
5. Then do the Promises tab redesign. That is the biggest unfinished tab.

Good first continuation task:

```text
Continue the parked app-shell prototype. Keep production unchanged. Start by redesigning the Promises tab inside the prototype shell, using the production PromiseTracker data and preserving source/status evidence links on mobile.
```

## Production Cutover Conditions

Do not replace the live dashboard with the prototype until all of these are true:

- `npm run test:data` passes.
- `npm run lint` passes.
- `npm run build` passes.
- Desktop and mobile checks pass with no horizontal overflow.
- Major Projects full project list is readable on mobile.
- Promises tab preserves all source and status-evidence links.
- Approval Signal still says it is not part of the grades.
- Household Impact and Full Policy Audit score derivations are reachable.
- Every grade still has a one-click route to evidence.
- The prototype has been checked against `docs/Beta-Feedback-Log.md`.
- The live dashboard remains public source of record until cutover is explicit.

## Do Not Change During Prototype Work

Keep these frozen unless the user explicitly approves it in the current turn:

- GPA formulas
- grade-point mapping
- headline-score rounding
- `POCKETBOOK_DIMS`
- threshold values
- modifier rules or effects
- dimension count
- current grades
- promise statuses

The prototype is a presentation and interaction experiment. It is not a scoring-methodology change.
