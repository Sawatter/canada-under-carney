# Prototype App Shell Parking Note

**Date parked:** 2026-05-13
**Reconciled:** 2026-06-16
**Status:** dev-only experiment, not production
**Public source of record:** the live dashboard at `https://sawatter.github.io/canada-under-carney/`

## Why This Exists

The live dashboard is the public product. It has the complete evidence surface, source links, scoring drawers, project pipeline, promise tracker, changelog, About page, and production checks.

The prototype exists for one narrower reason: to test whether the same evidence can feel more app-like without weakening traceability. It is a local interaction lane for layout ideas, not a scoring or methodology lane.

## Current State

The original parking note described prototype files that were not present on `main`. The lane was restored on 2026-06-16 as a small dev-only shell behind `?prototype=app`.

Current prototype files:

- `src/App.jsx` - dev-only prototype loader behind `?prototype=app`
- `src/components/prototype/DashboardPrototype.jsx` - prototype shell and prototype Promises tab
- `src/components/prototype/prototype.css` - prototype-only styles

The prototype imports live data from the real dashboard:

- `src/data/dimensions.json`
- `src/data/meta.json`
- `src/data/approval-polls.json`
- `src/utils.js`
- `src/constants.js`

No scoring math, threshold, modifier, grade, promise-status, or dimension-data change belongs in this lane.

## How To Run It

```bash
npm run dev -- --host 127.0.0.1
```

Then open:

```text
http://127.0.0.1:5173/canada-under-carney/?prototype=app
```

If Vite picks another port, use that port with the same query string.

The prototype should not appear in production because the toggle is guarded by `import.meta.env.DEV`.

## What Is Built Now

### App Shell

- Header with version and update date.
- Four primary tabs: `Scorecard`, `Promises`, `How it works`, `About`.
- Desktop and mobile responsive layout.
- Clear local-only framing so it is not confused with the public dashboard.

### Scorecard Sketch

- Compact cards for Household Impact, Full Policy Audit, Promises Delivered, and Approval Signal.
- Compact list of graded dimensions.
- Approval Signal explicitly says it is not part of the grades.

This is a sketch only. Production dimension cards remain the source of record.

### Promises Tab V1

The parked continuation task was to redesign the Promises tab first. That is now done as a prototype v1:

- Uses the production promise data via `countPromises(dimensions)`.
- Preserves original-source links and status-evidence links on each promise card.
- Shows status counts as filter controls.
- Adds search, status filter, and dimension filter.
- Uses mobile-friendly cards rather than a wide table.
- Keeps the production statuses and counts unchanged.

## What Is Not Done

These block any production cutover:

1. **Evidence parity for dimension detail**
   The prototype does not recreate the full production dimension drawer, source stacks, evidence timeline, source roles, project-pipeline details, trigger links, or critic/defender views.

2. **Production-grade routing**
   Deep links and browser Back behavior are not specified for the prototype.

3. **Approval Signal drilldown**
   The production poll-source detail table is not recreated.

4. **Score derivation panels**
   The live dashboard's "How is this score built?" panels are not recreated.

5. **Change Log**
   The real changelog is not integrated.

6. **Accessibility pass**
   The prototype needs a focused keyboard, focus-order, heading, and screen-reader pass before any cutover discussion.

7. **Final parity review**
   Every production tab and expanded scoring file would need to be compared against the prototype so no trust/evidence surface disappears.

## Locked Prototype Decisions

- **Production rule:** the live dashboard remains source of record until cutover is explicit.
- **Scope:** the prototype is a presentation and interaction experiment.
- **Navigation:** four primary tabs are enough for this lane.
- **Promises first:** keep improving the Promises tab before reopening the rest of the shell.
- **Visual target:** civic, restrained, readable. It should not feel like a campaign site or marketing page.
- **Approval Signal:** always label it as public approval and outside the grades.

## Restart Point

When this work resumes:

1. Run the prototype locally with `?prototype=app`.
2. Open the Promises tab on desktop and mobile.
3. Compare every promise card against the production Promises tab for source-link parity.
4. Decide whether the next prototype task is:
   - a better dimension-detail sketch, or
   - Approval Signal drilldown parity, or
   - keyboard/accessibility cleanup on the promise cards.

Good next task:

```text
Continue the parked app-shell prototype. Keep production unchanged. Do not touch grades or data. Start by checking the prototype Promises tab against the production Promises tab for source/status-evidence link parity, then pick the smallest missing interaction.
```

## Production Cutover Conditions

Do not replace the live dashboard with the prototype until all of these are true:

- `npm run test:data` passes.
- `npm run lint` passes.
- `npm run build` passes.
- Desktop and mobile checks pass with no horizontal overflow.
- Promises tab preserves all source and status-evidence links.
- Approval Signal still says it is not part of the grades.
- Household Impact and Full Policy Audit score derivations are reachable.
- Every grade still has a one-click route to evidence.
- The prototype has been checked against `docs/Beta-Feedback-Log.md`.
- The editor explicitly approves a production cutover.

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
