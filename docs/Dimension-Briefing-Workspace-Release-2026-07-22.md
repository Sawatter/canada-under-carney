# Dimension Briefing Workspace Release

**Status:** Release gates and independent review passed; publication pending<br>
**Publication evidence:** Pending<br>
**Prepared:** 2026-07-22<br>
**Comparison baseline:** live v5.162<br>
**Frozen surfaces:** no grade, threshold, formula, weight, modifier, promise status, source stack, trigger, or dimension-model change

## Problem

The opened policy surface had accumulated many drawers and sub-drawers. It
contained the evidence needed to inspect a grade, but readers had to understand
the internal data structure before they could answer basic questions: what is
the verdict, why does it sit there, what changed, what happens next, and where
is the underlying record?

The v5.161 Housing brief and v5.162 held-review treatment improved individual
answers. They did not solve the navigation cost across the policy as a whole.
Adding another disclosure would have made that problem worse.

## Product Decision

v5.163 keeps the existing policy-detail workspace and replaces its nested
reading stack with four flat sibling views. The closed card remains the teaser.
Opening it leads to Briefing, with Evidence, History, and Method one action away.
The views organize existing authored data. They do not synthesize new judgments
or infer relationships the data does not encode.

### Briefing

Briefing answers the first-read questions. It contains the verdict, authored
lead metrics, why-not-higher and why-not-lower explanations, the complete up and
down trigger band, visible judgment, and the latest review. The trigger band is
atomic: moving it behind another disclosure would recreate the problem this
release is intended to fix.

### Evidence

Evidence is the canonical record view. It carries the policy's available
metrics, sources, promises, triggers, projects, and supporting or contrary
perspectives. Optional record types disappear when absent rather than leaving
empty panels. Source labels and targets remain the traceability path.

### History

History presents one dated sequence for the policy rather than several competing
timelines. Grade moves and review events share that sequence. Housing also shows
its dated evidence-review detail here, linked to the same evidence boundary,
without duplicating the sequence or turning the review into a grade event.

### Method

Method holds the published thresholds, scoring bands, construct and combination
rules, operationalization, scope, caveats, and glossary material available for
the policy. It exposes how the grade is built without asking the reader to open
another layer.

## Special-Case Contract

- Defence & Trade keeps its Defence and Trade sub-scores distinct. Flat lead
  metrics are not assigned to either sub-score unless the data explicitly
  supplies that relationship.
- Promise Delivery remains an ungraded tracker. It uses its informational status
  and does not gain graded-policy judgment copy or enter GPA treatment.
- Flagship Delivery keeps the published Combination Rule visible in Method, its
  underlying records in Evidence, and its dated retention review in the shared
  review path.
- Housing keeps the detailed July 22 evidence review in History and its concise
  decision context in Briefing without duplicate timelines.
- An ordinary graded dimension follows the same four-view order and omits only
  record types it does not carry.

## Navigation And Accessibility Contract

- The view controls are semantic navigation buttons with `aria-current`, not an
  ARIA tab widget.
- Briefing, Evidence, History, and Method have direct policy-scoped links.
- Existing policy-detail links map to the appropriate new view rather than
  failing or opening a blank state.
- Opening from a card focuses the policy title. Changing views keeps focus on
  the activated view control, while direct and legacy links focus the selected
  view control. None of these paths adds a nested back-button loop. Closing the
  policy restores the originating card and scroll position.
- Desktop keeps the focused workspace. Mobile keeps the full-screen sheet, body
  scroll lock, Close and Back behavior, and a four-view control row that remains
  reachable at 375px.
- Each view stays flat. It does not contain another local disclosure hierarchy.

## Evidence And Method Boundary

This is a presentation and navigation release. It does not change policy data,
grade claims, thresholds, trigger conditions, grade math, source order, promise
status, weights, modifiers, or the 11-graded-dimension plus one-tracker model.
Authored lead flags and existing review records control what appears in the
Briefing. The UI does not create new drivers, sub-score membership, or history
events from labels.

## Acceptance Record

Completed locally on July 22:

- `npm run test:data` passed, including 12 dimension shape checks, 43 promise
  records, and 56 frozen-surface assertions across 9 groups.
- The bias-resistance audit completed across 12 dimensions and retained the
  existing 8 documented flags. No scoring or data edit was made in response.
- App-shell passed 59 checks across 12 source files. Review-handoff passed, the
  changed-file lint pass reported zero errors, and the full lint run reported
  zero errors with the existing 313-warning baseline.
- The production build passed. The entry bundle was 336,017 bytes and the
  initial JavaScript graph was 348,667 bytes, both within budget.
- All 231 listed browser cases passed in 39 fresh-process batches across normal,
  dark, and reduced-motion projects. The batching retained the same matrix while
  avoiding setup timeouts in long-lived local Playwright workers. Coverage
  includes the Promise Delivery methodology record and forced-colors emulation.
- Direct inspection passed at desktop `1280x900` and mobile `375x812` for
  Briefing, Evidence, History, and Method. The mobile sheet was flush, body
  scroll was locked, the four controls fit without horizontal clipping, and
  the selected view control received focus.
- Browser coverage passed deep links, legacy canonicalization, focus, keyboard,
  Escape, Close, Back, scroll lock, focus restore, overflow, contextual Share,
  and the Housing, Defence & Trade, Promise Delivery, Flagship Delivery, and
  ordinary-policy cases.
- The local rendered-content audit passed 348 rows with zero issues across all
  four routes for all 12 dimensions at desktop and mobile widths.

Independent review completed on the staged candidate:

- Standards and Spec review both ended `VERDICT: APPROVED`. Their accepted
  findings produced the card-owned anchor fix, Back-to-anchor view restoration,
  global skip-link preservation, exact glossary assertions, internal-reference
  coverage, corrected legacy mappings, and stale-panel-state coverage.
- The authenticated Claude review ended `VERDICT: APPROVED` after tracing the
  final popstate, hashchange, view ownership, and focus paths.
- Claude's unused-selector finding was accepted and fixed. Its proposed tracker
  modifier guard was rejected after a browser failure confirmed that Promise
  Delivery has authored modifier material that belongs in Method. The trigger
  band remains in Briefing and Evidence intentionally: decision context first,
  canonical record second.

Still required before this release can be called live:

- GitHub Pages deployment, live v5.163 header confirmation, and the production
  rendered-content audit.

A timeout, missing environment, or unperformed check is not approval.

## Physical Device Boundary

Physical iOS edge-swipe and sheet overscroll, Android pull-to-refresh, and
Windows forced-colors device checks are not part of this change. The host did
not previously have those physical environments, and this record does not turn
their absence into a pass. Browser forced-colors emulation belongs to the normal
release checks. A physical Windows result must be named separately if one is
later performed.

## Roadmap Outcome

This package advances the inspectability goal by replacing schema-shaped drawer
work with a stable answer-first reading path. It also exposes the next questions
without pretending they are resolved: whether readers can still locate the
canonical record quickly, whether one dated sequence remains clear as more
cycles arrive, and whether Defence & Trade ever needs explicit metric-to-subscore
provenance in the data.

The August observation pass should test those questions before another panel,
chart, event type, or animation is added. Trust and monthly-cycle correctness
remain higher priority than polish.
