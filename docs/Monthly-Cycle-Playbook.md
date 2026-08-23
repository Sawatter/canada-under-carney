# Monthly Cycle Playbook

- **Purpose:** Turn the monthly dashboard update from a "figure it out each time" exercise into a checklist. Every recurring task has a home here; cycle-specific notes go in the changelog entry.
- **Status:** Active playbook.
- **Next scheduled cycle:** first day of each month. Next cycle: 2026-09-01 (per `meta.nextUpdate` in [src/data/meta.json](../src/data/meta.json)).
- **Depends on:** [Scoring-Rubric-v1.1.md](Scoring-Rubric-v1.1.md), [QA-Gatekeeping-Rules.md](QA-Gatekeeping-Rules.md), [Canonical-Scoring-Sheets.md](Canonical-Scoring-Sheets.md), [v2-Decision-Memo-Approval-Signal.md](v2-Decision-Memo-Approval-Signal.md), [Inter-Rater-Reliability-Protocol.md](Inter-Rater-Reliability-Protocol.md).

---

## Cadence

- **Regular cycle:** first day of each month, covering the full prior calendar month's available data.
- **Monthly source scout:** `.github/workflows/monthly-source-scout.yml` runs on the first day of each month and prepares fetch/link-rot/source-ledger artifacts. It does not edit dashboard data, move grades, or push to `main`; it commits monitoring artifacts to a `source-monitor/<cycle>` review branch and opens a draft PR, and the editor reviews before any live update.
- **Ad-hoc updates:** triggered by major events (legislation passing, a major department release, a polling reversal, a grade-moving news story). Ad-hoc updates produce their own changelog entry outside the monthly cycle.
- **Freeze window:** the source scout runs on the first day. The live update can land after editor review; always update `meta.json` to match reality after the cycle lands.

---

## Checklist

Work the sections in order. Each checkbox is a discrete commit-worthy step.

### 0. Full source recertification gate

- [ ] Regenerate or update the monthly source ledger from the live data: `npm run source:ledger -- YYYY-MM --force` if starting a clean ledger, or manually migrate new rows into the in-progress ledger if preserving checked rows.
- [ ] Run `npm run source:ledger:check -- docs/Source-Coverage-Ledger-YYYY-MM.md` before assigning review work. This must report zero cited URLs missing from the ledger. The URL universe includes `sources[]`, grade-trigger `sourceUrl`, grade-trigger `additionalSources`, metric `sourceRefs`, project cohort URLs, promise original/status URLs, and Approval Signal poll URLs.
- [ ] Split the source work into two proofs. Exact-URL recertification follows each ledger row's stated cadence; rows that were fully recertified in the prior cycle can be marked `not due` with the last check and next due point. Publisher-site search checks the monthly and event-driven source websites or indexes for evidence in the prior-month window.
- [ ] Log negative findings. Use the `Result` value `no event observed` for an actively-checked source with nothing new; it only counts when the row's Notes name the source site, the search/index checked, and the date window searched. (Free-text phrases like "no relevant update found" are not valid `Result` values and will fail the ledger check.)
- [ ] Treat blocked rows as open until they name a fallback action, such as manual browser check, alternate official index, or editor source pull.
- [ ] Before saying the monthly source cycle is complete, run `npm run source:ledger:check -- docs/Source-Coverage-Ledger-YYYY-MM.md --require-closed`. The cycle is not complete while any row has an empty `Result` (rows not due this month must carry the literal value `not due`), any row is still marked `not checked`, any closed row lacks `Date checked`, any cited URL is missing, any blocked row lacks a fallback action, or `Coverage level achieved` is still blank.

### 1. Data review (pre-grade)

- [ ] Open the latest `monthly-source-scout-YYYY-MM` GitHub Actions artifact.
- [ ] Read `scripts/output/fetch-report.txt` and the generated `Source-Coverage-Ledger-YYYY-MM.md`.
- [ ] Treat the artifact as a scout, not a verdict: confirm current values from live source pages before editing dashboard data.
- [ ] **Statistics Canada monthly releases:** CPI (housing, food, energy sub-indices), LFS (employment rate, participation, unemployment), population estimate. Open each live source from [DATA-SOURCES.md](DATA-SOURCES.md).
- [ ] **Federal fiscal data:** PBO's latest monitor, Finance Canada's fiscal update if one landed, Fall / Spring update if the cycle falls in its wake.
- [ ] **Housing:** CMHC monthly starts + completions, Build Canada Homes status update if any.
- [ ] **Defence / Trade:** NATO secretary-general monthly notes, trade data (StatsCan), any CUSMA or trade-agreement developments.
- [ ] **Immigration:** IRCC levels plan updates, TFW stream caps, permanent resident processing times.
- [ ] **Climate / Carbon:** ECCC quarterly emissions inventory if in window, industrial carbon credit trading price, any consumer fuel charge wind-down data.
- [ ] **Ethics:** Office of the Ethics Commissioner releases, any blind trust disclosures, Commissioner opinions.
- [ ] **Major Projects Office:** MPO public updates, any ministerial announcements on project approvals.

Record any **actual-reading** deltas in a scratch note; they feed the next step.

### 2. Grade review

For each of the 11 graded dimensions plus Promise Delivery:

- [ ] Open [dimensions.json](../src/data/dimensions.json) for the dim.
- [ ] Open the dim's entry in [Canonical-Scoring-Sheets.md](Canonical-Scoring-Sheets.md).
- [ ] Re-evaluate the `rationale`, `metrics`, and `gradeBasis` fields against the new data from step 1.
- [ ] Decide: **no change / grade move / plus-minus revision / modifier activation-or-deactivation**.
- [ ] Apply [QA-Gatekeeping-Rules.md](QA-Gatekeeping-Rules.md) — especially Rule 2 (carry-forward), Rule 4 (confidence revisit), Rule 5 (probation discipline), Rule 6 (same-family concentration).
- [ ] If a grade moves: update `grade`, `previousGrade`, `trend`, `gradeBasis` (`band`, `plusMinusRationale`, `activeModifiers`), and `rationale` fields together. Do not update one without the others.
- [ ] Update the dim's `lastUpdated` field to today.
- [ ] If the rubric was ambiguous enough to need editor judgment: note it in the scratch file for a future Inter-Rater-Reliability-Protocol.md candidate dim.

### 3. Promise status review

- [ ] Open [Commitment-Traceability-Map.md](Commitment-Traceability-Map.md).
- [ ] For each promise where something happened this cycle: update the `status`, `evidence`, and `history` fields. Thread any new `statusSourceUrl` that emerged.
- [ ] Check residual-status promises (stalled / abandoned / too-early) — have any moved?
- [ ] Do not retroactively edit `since` or `originalSourceUrl` unless they were wrong.

### 4. Approval Signal refresh

- [ ] Open [src/data/approval-polls.json](../src/data/approval-polls.json).
- [ ] Web-check each of the five included pollsters (Léger, Abacus Data, Ipsos, Angus Reid Institute, Innovative Research Group) for new releases since `asOf`.
- [ ] For each new poll found: append an entry with `pollster`, `fieldStart`, `fieldEnd`, `approve`, `disapprove`, `sampleSize`, `methodology`, `marginOfErrorNote`, `construct`, `sourceUrl`, `sourceLabel`.
- [ ] Update `asOf` to the cycle date.
- [ ] Re-check Pollara, Mainstreet, EKOS, Spark Insights, and Research Co. for any direct approve/disapprove release since last cycle. Research Co. stays excluded unless it surfaces a broad PM/government job-approval pair rather than a narrower issue-approval construct.
- [ ] Update the `preferredPM.polls` array with new Nanos weekly entries.
- [ ] Sanity-check the rolling aggregate after data is updated — should move with direction of the new polls.

### 5. Changelog entry

- [ ] Open [src/data/changelog.json](../src/data/changelog.json).
- [ ] Prepend a new entry with this month's `date` and a one-paragraph `summary` in *plain reader language* (no "hidden C- behind displayed C" governance jargon).
- [ ] Add `items[]` entries for every grade move, metric update, event, and launch.
- [ ] Grade moves use `type: "grade"` with `dimensionId`, `dimensionName`, `from`, `to`, `headline`, `body`, and optional `drivers[]` / `link`.
- [ ] Non-grade updates use `type: "event"`, `"product"`, `"method"`, or `"minor"` with a plain-language `headline` and `body`.

### 6. Meta bump

- [ ] Open [src/data/meta.json](../src/data/meta.json).
- [ ] Increment `version` by 0.1 (e.g., 5.5 → 5.6 for a regular cycle; 5.5 → 6.0 for a rubric revision).
- [ ] Set `lastUpdated` to today.
- [ ] Set `coveragePeriod.end` to today or the most recent material event date, whichever is later.
- [ ] Set `nextUpdate` to the next scheduled cycle date.
- [ ] Append any new entries to `milestones[]` for cycle-period events.

### 7. Build + local sanity checks

- [ ] `npm run build` — must pass without new warnings.
- [ ] Eyeball the built dashboard: the Change Log tab should show the new changelog entry; the Approval Signal should show the updated rolling window; score cards should reflect the new grades.
- [ ] Confirm `feed.xml` was regenerated by the prebuild script (contains the new changelog entry).
- [ ] Confirm the live GoatCounter visitor count is advancing (means the tracking script is still loading).

### 8. Commit + push

- [ ] Commit messages follow repo style — sentence-case imperative, descriptive, no Conventional Commits prefixes.
- [ ] One commit per logical concern or one bundled cycle commit — your choice, but keep changelog + meta + dimensions together in a single commit so a reader looking at `git log` sees the whole cycle as one movement.
- [ ] Push to `main` after editor-approved data, source, and grade decisions are reflected. The deploy workflow fires automatically.
- [ ] Watch the Pages deploy — ~30 seconds. Live URL should reflect the update within a minute.
- [ ] Confirm the live header version matches `src/data/meta.json` before trusting live-tab, bundle, evidence-pack, or `audit:live` findings.

### 9. Final live desktop/mobile sanity pass

Run this after the live GitHub Pages deployment, not only against local preview. The goal is to catch the small UX mismatches that only show up when a real reader hits the public site.

Check both desktop and mobile widths:

- [ ] Header: trust frame is visible under the title; visitor counter does not overlap title or tabs.
- [ ] Scoreboard: Household Impact, Full Policy Audit, Promises Delivered, and Approval Signal cards align cleanly.
- [ ] Score drill-downs: opening and closing Household Impact / Full Policy Audit score math keeps the detail near the tapped card on mobile and returns the reader to the scoreboard on close.
- [ ] Approval Signal: poll detail opens near the card on mobile, closes cleanly, and source links are visible.
- [ ] Scorecard grid: open at least one high-density dimension (Major Projects) and one normal dimension; no card text clips or overlaps.
- [ ] Major Projects pipeline: mobile view shows the scroll cue; scrolling right reveals stage date and source links.
- [ ] Trigger evidence links: external sources, internal evidence jumps, and event-driven labels are visually consistent and understandable.
- [ ] Promises tab: open at least one promise with both source links; source/status evidence wraps instead of clipping on mobile.
- [ ] Tab rail: on narrow mobile, the right-edge fade indicates more tabs are available.
- [ ] About / Methodology: scoring-boundary and model-limit language is readable on mobile.
- [ ] Change Log: newest entry appears first and is legible on mobile.
- [ ] No horizontal page-level scroll appears except inside intentional scroll containers like the project pipeline table.
- [ ] Run `npm run audit:live` after the Pages deploy and version match. Review `tmp/live-coverage-audit/<stamp>/report.md`; treat failures as release-review evidence, not automatic pre-deploy blockers. The post-deploy GitHub Action also runs this check and saves the report as an artifact.

If any item fails, fix it before treating the cycle as shipped.

### 10. Post-cycle

- [ ] Update this playbook if any step felt wrong or a new step appeared.
- [ ] Update the [Current-Roadmap.md](Current-Roadmap.md) Recently Completed section with the cycle's landing note.
- [ ] Close the loop on any one-line items in [Parking-Lot.md](Parking-Lot.md) that this cycle addressed.

---

## What's different about cycle 2 (May 14, 2026)

First full monthly cycle after the April 19 "ship-readiness" burst. Specific cycle-2 tasks:

- **Approval Signal v2 first production data-add.** The polls file currently runs through March 30, 2026. The May 14 cycle is the first pull that extends past the April 19 signal snapshot. Expect the rolling window to shift forward cleanly — the weighted-mean code already handles it, but spot-check the math once the new polls land.
- **Ethics & Flagship Delivery probation review.** Both dims are on whole-letter probation per [Scoring-Rubric-v1.1.md](Scoring-Rubric-v1.1.md). The May 14 cycle is a good moment to reassess whether the evidence base has thickened enough to move either dim off probation.
- **Post-majority-government read.** The April 13 majority-government formation may materially change the execution-feasibility picture for several dims. Worth a specific review of Flagship Delivery, Fiscal Health, and Promise Delivery with that lens.
- **Promise status-source watch list.** All 43 tracked promises now have original-source links, and 42 have `statusSourceUrl`. Keep watching the remaining gap — Carbon Border Adjustment Mechanism — and add a status-evidence link only when a clean official or Tier 2 document appears.
- **Candidate inter-rater reliability pilot.** Per [Inter-Rater-Reliability-Protocol.md](Inter-Rater-Reliability-Protocol.md), cycle 2 or cycle 3 is a reasonable moment for a first v1 rater test. Two-to-three-dim pilot, 2–3 hours of volunteer time.

---

## Emergency / ad-hoc updates

Events that can trigger an ad-hoc update outside the monthly cycle:

- A bill passes or fails a critical vote (e.g., supply, confidence, or a flagship bill).
- A minister resigns, is shuffled, or publicly breaks with the government.
- A major dataset release lands outside the normal schedule (e.g., census cycle, Budget tabled outside March, Fall Economic Statement).
- A major independent report lands that materially changes the evidence stack for a dimension (PBO major assessment, Auditor General report, Commissioner of the Environment report).
- Trade-war or external-shock events that activate or deactivate the External Constraint modifier.

Ad-hoc updates still follow the same checklist above but scope down: only the affected dims get the grade-review treatment, and the changelog entry notes "ad-hoc" in the summary.
