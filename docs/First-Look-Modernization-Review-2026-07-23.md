# First-Look Modernization Review

**Date:** 2026-07-23
**Status:** Approved research decision implemented for the v5.164 release candidate.

## Decision

Keep [Flighty](https://flighty.com/help/delay-predictions) as the broad product model: state first, explain why, show what changed, and name what happens next. The next useful modernization pass is narrower. It should make the dashboard's result understandable in the first viewport before adding another navigation layer or redesigning the policy workspace.

The core new first-look reference mix is:

1. **Robinhood Cortex Digests** for a fixed explanation structure: backdrop, main drivers, and upcoming events.
2. **Apple Health Trends** for promoting meaningful changes instead of asking readers to reread the record.
3. **Axios Smart Brevity** for a short, explicit reading hierarchy.
4. **incident.io** for pairing the latest update with a promised next update.
5. **Sentry Issue Details** for keeping state, impact, chronology, and the most relevant evidence together.

This is a presentation recommendation only. It does not change any grade, threshold, formula, weight, source order, promise status, or dimension rule.

## Implementation Decision

On July 23, the editor explicitly advanced the bounded prototype before the
August cycle. That changed the sequencing decision only. It did not displace
the August 1 monthly cycle or reopen a scoring surface.

The v5.164 candidate implements the approved contract through:

- one required, validated `meta.overallVerdictLine` authored by the editor;
- a deterministic `firstLook` projection on the newest changelog-summary entry;
- the first published `status.nextChecks` record as the primary watch;
- a dominant Full Policy Audit result, compact release and watch blocks, a
  visible scoring boundary, and direct policy-file and method routes;
- compact Household Impact, Promise Delivery, and Approval signals with their
  different scoring roles stated in the interface; and
- a freshness-only Dashboard status block so score changes and next checks are
  not repeated lower on the page.

No verdict is generated at render time. The release does not change a grade,
threshold, formula, weight, modifier, promise status, source order, trigger, or
dimension rule.

The target layouts were directly inspected at `375 x 812` and `1280 x 900`.
The mobile first screen contains the result, reason, release state, next watch,
scoring boundary, and both inspect routes above the fixed navigation. The
desktop first screen contains the complete briefing and the three secondary
signals. The original eight-person first-time-reader study has not been
performed and remains an observation task rather than a claimed release pass.

## Question Frame

**Center:** Which current app patterns would help a first-time reader answer five questions quickly: What is the overall result? Why? What changed? What is checked next? Where is the evidence?

**Edges:** The scorecard is a static, shared public record. It updates in review cycles rather than continuously. It cannot imply forecasts, personalized priorities, automatic causal judgments, or AI-generated conclusions.

**Data scope:** The live v5.163 dashboard at desktop and mobile widths, the current component and data structure, prior product decisions, reader feedback, the active roadmap, and current official publisher documentation for the reference products.

**A good answer:** One bounded first-screen prototype with measurable comprehension criteria, plus a clear list of patterns to defer or reject.

## Live Baseline

The live v5.163 policy workspace is substantially better once a policy is open. Briefing, Evidence, History, and Method are flat sibling views, and the Briefing view leads with the verdict and review decision.

The overview still has a first-use hierarchy problem:

| Viewport | Observed position | Consequence |
|---|---:|---|
| `375 x 812` | Header ends near `y=434`; orientation and trust content extend to `y=831`; headline cards begin near `y=907` | No grade, score, change state, or next checkpoint appears in the first viewport |
| `375 x 812` | Dashboard status begins near `y=2326`; policy grid begins near `y=2863` | Freshness meaning and the 11 policy files arrive after a long scroll |
| `1280 x 900` | Headline row begins near `y=639` and extends beyond the viewport | The first screen shows the product explanation and only part of the results |

The browser had returning-reader state, so this was not a clean first-visit study. That state does not affect the measured position of the initial headline row.

Three related issues follow from the hierarchy:

1. The dashboard explains what it is before showing what it currently says.
2. Four equally sized headline cards make `C-`, `C`, `14 / 43`, and `56%` look more comparable than they are.
3. The explicit distinction between last evidence scan, editor-reviewed cycle, and coverage date arrives too late for a quick reader.

The instruction to open any card is also too broad. The four headline cards do not share one interaction model, and none opens the v5.163 policy workspace.

## Core First-Look Set

| Reference | Documented pattern | Transfer to this dashboard | Do not copy |
|---|---|---|---|
| [Robinhood Cortex Digests](https://robinhood.com/us/en/support/articles/cortex-digests/) and [methodology](https://robinhood.com/us/en/support/articles/cortex-digests-methodology/) | Portfolio summaries use fixed sections for market backdrop, return drivers, top movers, and upcoming events; the methodology names inputs and limitations | Keep a fixed authored sequence: result, main drivers, what changed, watch next | AI generation, investment framing, or unsupported causal summaries |
| [Apple Health Trends](https://support.apple.com/en-gb/guide/iphone/iphe3d379c32/ios) | Surfaces significant changes with magnitude and duration, then provides deeper history | Promote only authored grade moves and review decisions from the closed cycle | A hidden significance calculation, personalization, or continuous-health metaphors |
| [Axios Smart Brevity guidance](https://www.axioshq.com/features/smart-brevity-guidance) and [Smart Brevity 101](https://www.axioshq.com/hubfs/Marketing%20Research%20and%20Tools/Smart%20Brevity%20101%20-%20How%20to%20optimize%20an%20essential%20communication.pdf) | Uses a short hierarchy such as what is new and why it matters, short paragraphs, and a one-column reading path designed to keep essential information together | Use short labels and one or two authored sentences per first-look block | Emoji labels, promotional tone, or brevity that removes caveats and source paths |
| [incident.io status updates](https://docs.incident.io/incidents/status-updates) | Couples a short status update with a reminder for the next update | Put a dated next review or condition beside the latest review result | Incident urgency, estimated resolution, or equating editor activity with public impact |
| [Sentry Issue Details](https://docs.sentry.io/product/issues/issue-details/) | Combines high-level state, impact, first and last seen, activity chronology, and a recommended event chosen for relevance | Keep result, affected scope, latest meaningful decision, and an evidence route together | Error language, automated cause claims, or treating latest activity as latest meaningful change |

## Supporting And Reconsidered Set

| Reference | Useful later pattern | Boundary |
|---|---|---|
| [Apple Sports App Store record](https://apps.apple.com/us/app/apple-sports/id6446788829) | Key Plays offers a compact catch-up after the score and state | Reconsidered from earlier research, not part of the new batch; avoid real-time urgency, betting, favourites, and matchup framing |
| [Our World in Data](https://ourworldindata.org/faqs) and [indicator example](https://ourworldindata.org/grapher/life-expectancy) | Exposes original source, processing status, unit, coverage period, update date, and citation detail | Use for a later provenance receipt, not the initial overview hierarchy; defer charts until history is deep enough |
| [Semafor Semaform](https://www.semafor.com/article/10/18/2022/what-is-a-semaform-anyway-and-why-should-you-care) | Separates news, interpretation, disagreement, other views, and notable material | Use only in policy detail to distinguish observed evidence, scorecard read, and a grounded challenge; avoid forced symmetry, personality-branded judgment, or criticism unrelated to the scoring rule |
| [Institute for Government Performance Tracker](https://www.instituteforgovernment.org.uk/publication/public-services-performance-tracker-2025) | Compares baselines and recent progress, gives a reason for ratings, and publishes chapter methodology | Use only where attribution is contested to distinguish inherited conditions, government action, observed outcome, and scoring read; avoid dense report navigation or causal certainty |

Useful supporting patterns also remain in Rootly, FireHydrant, Shop order tracking, and Apple Home. They are better fits for later evidence chronology, Promise Delivery status distribution, or policy filtering than for the immediate first-screen problem.

## Recommended Prototype

Build one **First-Look Briefing** prototype before any broader overview redesign.

On a `375 x 812` viewport, the initial screen should contain:

1. **Overall result:** Full Policy Audit grade and score, visually dominant.
2. **Why:** One editor-authored overall verdict sentence. A release implementation must store it in a separately validated authored field. Never synthesize it at render time.
3. **This release:** Read only the newest changelog entry. Start with the count of its `grade` items. If the count is non-zero, show at most the first two grade items in stored order and link to the complete entry. If the count is zero, say `No grade moves in this release` and show the first non-quiet item in stored order. If the entry contains only quiet `fix`, `docs`, or `minor` items, say `Maintenance-only release` and link to the complete entry. This makes the selection rule inspectable and avoids implying that nothing changed.
4. **Watch next:** Show `meta.nextUpdate`, then the first record in `status.nextChecks` in stored order. The authored data order is the published priority rule; the overview must not choose a different watch at render time.
5. **Trust boundary:** One visible compact block stating that Full Policy Audit weights the 11 graded policy files equally, Household Impact uses the same 11 with the four published pocketbook files double-weighted, and Promise Delivery plus Approval are context outside both grades.
6. **Inspect:** Direct routes to the policy files and to how the score is built.

On desktop, the same hierarchy should make the Full Policy Audit result and the three secondary signals visible without scrolling. Household Impact, Promises, and Approval should remain available, but their labels and geometry must make their different roles unmistakable.

Reuse existing release data and authored records apart from the required validated overall-verdict field. The prototype must not calculate a verdict, infer causes, or change a scoring surface.

## Acceptance Test

Test eight first-time readers: four at `375 x 812` and four at `1280 x 900`.

Give each reader 10 seconds without interaction, then 20 seconds of free exploration. Ask:

1. What is the overall grade?
2. Why is the overall grade at that level?
3. What does the Household grade represent?
4. Do Promises and Approval affect the grade?
5. What changed in the latest release?
6. What is checked next?
7. Where would you inspect the evidence?

Pass only if at least three of four readers at each viewport answer the first six correctly within 30 seconds and eight of eight can find an evidence route. Record first action, false clicks on headline cards, and any confusion between `Updated`, evidence coverage, and the editor-reviewed cycle.

## Defer Or Reject

- **Defer charts and trend lines.** The grade history is still too shallow and could imply continuous measurement.
- **Defer filters and custom dashboards.** They do not fix the absence of a first-screen result and would weaken the shared public frame.
- **Defer Promise Delivery distribution changes.** Shop's stage model is promising, but Promise Delivery is not the current comprehension bottleneck.
- **Reject generated summaries.** Borrow Robinhood's structure, not Cortex generation.
- **Reject opaque health, fitness, and sports scores.** WHOOP Recovery, Garmin Body Battery, Sofascore momentum, and similar synthesis conflict with inspectability.
- **Reject forecasts, countdown urgency, and automatic trigger crossing.** Policy review states remain editor-adjudicated against published rules.
- **Do not reopen the v5.163 policy workspace.** First verify the overview hierarchy independently.

## Project Room

### Source Inventory

| Source | Role | Authority and limitation |
|---|---|---|
| Live v5.163 desktop and mobile inspection | Current observed behavior | Direct observation; returning-reader state means it is not a clean first-visit usability study |
| `Dashboard.jsx`, `ScoreboardHeader.jsx`, `DashboardStatus.jsx`, `DimensionCard.jsx` | Current product structure | Primary implementation record |
| `dimensions-summary.json`, `meta.json`, `status.json`, `changelog.json` | Existing first-look data | Primary data record; some desired summary copy does not exist as an authored field |
| v5.158 and v5.163 decision records | Prior design intent and current detail architecture | Binding constraints unless a new measured problem justifies a bounded revision |
| Beta Feedback Log and Current Roadmap | Reader signal and active priorities | Directional; not a substitute for the proposed first-time reader test |
| Official reference-product pages linked above | Documented external patterns | Evidence of product structure, not evidence that the pattern will work here |

### Conflict Log

| Conflict | Resolution |
|---|---|
| v5.158 intentionally put the trust explanation before the scores; the current request asks for immediate comprehension | Keep a visible trust boundary in the first viewport, but do not require the earlier trust frame to precede the result |
| The roadmap paused dashboard framing until actual user signal | The July 23 request supplies that signal for one bounded first-look experiment |
| Consumer apps use personalization and generated summaries | Borrow fixed information structure only; keep one shared authored public record |
| Operations products emphasize urgency and active incidents | Borrow latest/next/evidence discipline, not incident severity or resolution language |
| Rich chart products make movement easy to see | Defer visualization until the August history-depth check closes |

### Missing Context

- No clean first-time-reader usability result exists yet.
- The live inspection used a browser with returning-reader state.
- Official documentation does not replace hands-on use of every signed-in or native reference product.
- No implementation design, final copy, or schema change has been approved by this research decision.

### Duplicates Report

- Flighty, Linear, Stripe, Apple Sports, Apple Weather, Apple Stocks, Maps, and earlier editorial references are already documented. They remain context but are not counted as the new batch.
- The existing since-last-visit note, changelog, latest-review records, and next-check triggers already contain most of the required raw material. A prototype should compose them rather than create another change feed.
- `CompareView.jsx` is not routed into the live dashboard and does not solve the first-screen hierarchy problem.

## Review Record

Two independent Codex agents reviewed the draft on separate axes:

- **Standards round 1: REVISE.** It found premature completion wording, missing source support for three reference claims, and undisclosed selection discretion. The record stayed provisional, added direct Flighty, Apple Sports, and Axios support, and made the latest-change and next-watch rules deterministic.
- **Specification round 1: REVISE.** It found that the overall `Why` was optional and untested, Apple Sports was incorrectly counted as new, and detail-oriented references were mixed into the first-look core. The overall verdict became required and part of the reader test; Apple Sports moved to the reconsidered set; provenance and disagreement references moved to supporting.
- **Specification round 2: APPROVED.** The four specification findings were closed.
- **Standards round 2:** The source-support and determinism findings were closed. Completion remained correctly pending until the different-AI gate finished.

Authenticated Claude review then ran read-only through `scripts/claude-bridge.sh`:

- **Claude round 1: REVISE.** The mobile contract asked readers to explain Household Impact without putting its meaning on the initial screen. The trust boundary now distinguishes the equal-weight Full Policy Audit, the pocketbook-weighted Household result, and the two context-only signals. The quiet-release fallback and `status.json` source inventory omission were also corrected.
- **Claude round 2: APPROVED.** No substantive correction remained. Its optional event-only determinism edge was accepted by broadening the fallback to the first non-quiet changelog item. Its scheduling note was accepted in the roadmap. A clean first-visit capture remains part of the prototype test rather than a claim about the current baseline.

The central official pages for Flighty, Robinhood Cortex, Apple Health, Axios, incident.io, and Sentry were re-opened on July 23 after the first Claude pass. Their documented patterns support the bounded uses stated here. No review finding changed a score, method, or frozen surface.
