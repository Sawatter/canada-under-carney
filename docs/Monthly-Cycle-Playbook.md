# Monthly Cycle Playbook

- **Purpose:** Turn the monthly dashboard update from a "figure it out each time" exercise into a checklist. Every recurring task has a home here; cycle-specific notes go in the changelog entry.
- **Status:** Active playbook.
- **Next scheduled cycle:** first day of each month. Next cycle: 2026-09-01 (per `meta.nextUpdate` in [src/data/meta.json](../src/data/meta.json)).
- **Depends on:** [Scoring-Rubric-v1.1.md](Scoring-Rubric-v1.1.md), [QA-Gatekeeping-Rules.md](QA-Gatekeeping-Rules.md), [Canonical-Scoring-Sheets.md](Canonical-Scoring-Sheets.md), [v2-Decision-Memo-Approval-Signal.md](v2-Decision-Memo-Approval-Signal.md), [Inter-Rater-Reliability-Protocol.md](Inter-Rater-Reliability-Protocol.md).

---

## Cadence

- **Regular cycle:** first day of each month, covering the full prior calendar month's available data.
- **Hardening acceptance:** the first two completed 2026-08-29 read-only Claude reviews each ended with the literal result `VERDICT: REVISE`. A later saved response ended with `VERDICT: APPROVED`, but its bridge exit code was not recorded, so it does not count as approval. The complete worktree monitor suite passes 551 checks and parses all three workflow files. Post-fix staged checks, a completed Claude review with a recorded exit code, and hosted workflow acceptance remain open.
- **Monthly source scout:** `.github/workflows/monthly-source-scout.yml` runs on the first day of each month from the exact triggering commit on `main`. Its read-only analysis job first creates an owner-only `.identity-patterns` file and uses the pinned scanner to parse the private rules, before dependency installation, branch preparation, fetch, Tavily, or Anthropic work. It removes that file before the next step. The artifact guard later scans only the exact current live or backtest upload payload. Historical monitoring files outside that payload are out of scope for that run. A `home` or `users` path segment in a public URL that starts with `http://` or `https://` is not treated as a local-machine path. Bare, encoded, HTML-reference, and repeated-separator local paths, `file:` URLs, URL query or fragment local paths, Windows paths, and Windows network-share paths remain blocked. The analysis job may upload a privacy-cleared `NOT ACCEPTED` diagnostic artifact after failure, but artifact existence is not acceptance. Its separate publish job runs only after successful live analysis, installs no dependencies, downloads that run's guarded artifact, requires and stages five fixed monitoring paths, and exits without a PR only when that staged set is identical to `main`. Zero candidates alone do not establish no change. Before mutation it rechecks the analysis-observed PR state and pushes with a lease tied to the branch state observed during analysis: the exact SHA for an existing branch or expected absence for a new branch. Each of the three privacy checks creates the private identity-pattern file with owner-only permissions, verifies the scanner's reviewed SHA-256 hash, requires the private patterns, and removes the file before the next trust boundary. GitHub Actions performs its own hash checks. The configured local pre-commit hook also requires a gitignored, untracked `.identity-patterns` file with at least one active regular expression. The workflow never edits dashboard data, moves grades, or pushes to `main`. An invalid deterministic contract skips all candidate extraction except structurally safe IRCC CSV diagnostics. In strict mode, the first terminal or retry-exhausted target failure ends the fan-out and skips the relevance pass. The canonical workflow contract is [Source-Monitoring-System.md](Source-Monitoring-System.md).
- **Deterministic acceptance:** All four IRCC downloads must identify the expected dataset and source URL, carry the required unique columns, contain rows of consistent width with nonblank required values, use exact month tokens with matching quarters, allow only numeric totals or the official `--` marker, cover at least 12 contiguous monthly periods, and include consistent header and column metadata, period metadata, and a response hash. The latest IRCC period must use a `20xx` year, cannot be later than the cycle, and cannot trail it by more than three calendar months. Successful feeds must carry the expected publisher identity and usable items from that publisher's host with RFC 2822 or ISO publication dates. PBO publication links must use the official PBO host and remain unique after tracking-only normalization. Policy-feed `count` must equal the item count and `topic_count` must equal the item flags. Pollster and excluded-pollster `relevant_count` must equal the retained item count, while `all_count` must be positive and no smaller. Pollster `new_count` and `cited_count` must equal their item flags. A failed feed cannot inject candidate items. Cited URL matching removes known tracking keys but preserves semantic query keys. Ethics page and diff statuses must form a valid pair, and every non-success status fails acceptance cleanly. A successful Ethics page must contain recognized unique reports, its count must match the diff's current count, and it must not omit a report in the accepted cache. The workflow saves the accepted cache before fetch, and the reported prior keys must match that untouched snapshot. Strict acceptance always requires that non-empty external snapshot, even when the payload reports `priorCacheFound: false`. A strict run cannot establish its own first Ethics baseline. Reported additions must equal the exact difference between unique prior and current report keys. Any mismatch fails acceptance.
- **Monitor state safety:** A missing state file starts clean. Before parsing monitor file inputs or starting paid work, the process takes a host-local exclusive run lock keyed to the case-normalized resolved state path. A concurrent process using that state exits nonzero, and the operating system releases the lock when the owning process ends. A state path that is itself a symbolic link or has hard-link aliases is rejected before monitor work. A missing state path under a symbolic-linked parent is resolved once, and that canonical path is used for locking, markers, writes, and rollback. Any existing state is schema-checked, and invalid state stops before paid work, accepted output, state advancement, or publication instead of silently resetting deduplication. Read-only analysis may still upload a privacy-cleared `NOT ACCEPTED` diagnostic packet and invalid input. State replacement is attempted only after an accepted run with every expected tier complete. Dry runs, explicit `--no-search` or `--no-classify` runs, missing-key local diagnostics, and paid-tier failures never advance it. Raw and tracking-normalized candidate fingerprint histories are backward-compatible optional state and are capped separately at 80 entries per source. The candidate ledger is first written as not accepted. Before state replacement, the monitor creates a separate `<state-file>.recovery-pending` marker with owner-only permissions. If state persistence fails and diagnostic output can still be written, the ledger records the failure in both its acceptance and state-persistence metadata. Any monitor artifact-write failure exits nonzero and blocks publication. A failure before state replacement leaves state unchanged. If the final packet or accepted-ledger write fails after state replacement, the monitor restores the exact pre-run state bytes and mode, or removes the state file when it was initially absent, so the evidence can resurface on retry. Accepted outputs or exact rollback clear the marker. A failed rollback or marker cleanup leaves it in place, and every later run using that state stops before deterministic input or paid work. Do not remove the marker merely to unblock a run. First reconcile the prior state, packet, and ledger. Every output path must be distinct and must not overlap a configured monitor file input, including capitalization and existing hard-link aliases. Any failure before the review-branch push blocks a remote update. A failure in the post-push PR lookup or creation can leave a branch update while the job is red. `--no-deterministic` is for historical backtests only and requires a fixed window plus an isolated state file. A successful backtest may advance only that isolated file. The pre-acceptance Ethics Commissioner cache written by `fetch-data.py` is separate from accepted monitor state. Before fetch, the workflow copies the accepted cache to an untouched runner snapshot that the monitor uses to check the payload's prior keys. An unreadable or malformed existing Ethics cache, a successful page response with no recognized report links, a page/diff count mismatch, or a current listing that omits a previously accepted report fails the cycle without overwriting the accepted copy. Query and fragment variants collapse to the canonical report link before comparison.
- **Same-cycle reruns:** Exactly one matching same-repository open draft PR permits continuity restoration. A ready PR, a missing PR branch, a lookup failure, or multiple matches blocks the run. The prior monitor state, Ethics cache, source ledger, and accepted candidate ledger are required. The workflow restores the first three into the analysis checkout, copies the candidate ledger to a temporary carry-forward input, and writes a not-accepted placeholder at the normal candidate path. The monitor carries prior accepted candidates into the regenerated packet, with current-run rows winning exact collisions. It records carried fingerprints first and current-run fingerprints last, so each separate 80-entry raw and normalized fingerprint cap retains the current run rather than evicting it behind older carried rows. Publication rechecks the analysis-observed PR state and uses the branch state observed during analysis as its push lease. A missing or invalid continuity input stops the rerun before paid API work or remote mutation.
- **Manual backtests:** `surface_threshold` accepts only finite numbers from `0` through `1`, inclusive. Empty, nonnumeric, `NaN`, infinite, or out-of-range values fail before monitor work. A labeled backtest remains isolated and does not test review-branch mutation.
- **Residual repository risk:** `main` currently has no branch protection or ruleset. The source-scout workflow never pushes to `main`, but its workflow-level controls do not replace repository-level protection against other write-capable workflows or credentials. Claude classified this as a tolerable repository-level residual, not a blocker for the current candidate. Keep it recorded and consider branch protection separately from source-scout acceptance.
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
- [ ] Apply [Carry-Forward-Rules.md](v2/verification/Carry-Forward-Rules.md) and maintain an `## Exception Queue` section in the dated monthly cycle report. Record each E1-E8 category, status, resolution, or fallback in the affected source row's `Notes` in `Source-Coverage-Ledger-YYYY-MM.md`; manually add a row for a new source under review. Record the cycle-level CF1-CF5 carry-forward statement in the report. Do not close the cycle while a blocking E2 or grade-moving E4 remains unresolved.
- [ ] Watch the item mix in a changelog entry, not just its wording. The first-look briefing on a phone has a fixed height budget, and `product` and `method` items render in full while `fix`, `docs`, and `minor` fold into the quiet bucket. Two prominent items pushed the briefing controls underneath the fixed bottom navigation at 375 by 812 in v5.172, and the browser suite caught it. Run the browser suite after writing a changelog entry, not only after code changes, and do not retype an item to fit the layout unless the new type is honestly correct.
- [ ] Run `npm run source:links -- --cycle YYYY-MM --exceptions-out docs/source-recertification/source-link-exceptions-YYYY-MM.json` in the same pass, using the same cycle month in both places. The command enforces the exact `source-link-exceptions-YYYY-MM.json` filename and rejects `--limit` when writing a durable report, so a sample cannot look like a complete monthly run. The ledger check reads the ledger document only. It confirms that every row carries a disposition, and it never opens a link. Those are two different claims. In August 2026 a cycle closed 611 ledger rows clean while 17 of 18 Major Projects cohort links were already returning 404, because the Major Projects Office had moved its project pages.
- [ ] Keep the generated exception report with the cycle evidence, and commit the completed report with that evidence. It records every non-OK result in stable state and URL order, with each citation location and a pending manual-disposition field. The checker reports six states: OK, REDIRECTED, SUSPECT, BLOCKED, TIMEOUT, and DEAD. Of those link states, only DEAD makes the command exit non-zero. The other states enter the report without automatically failing the command. A soft 404 is SUSPECT because some government hosts produce false soft-404 responses under load. A deep link that settles on a bare homepage is DEAD because the cited document is gone.
- [ ] Manually disposition every exception row before closing the source cycle. Replace `manualDisposition.status: "pending"` with `confirmed-live`, `accepted-redirect`, `citation-replaced`, or `open-with-fallback`, then add the review date and a note naming what was checked or changed. Open every REDIRECTED destination and confirm it still supports the cited claim. Check SUSPECT, TIMEOUT, and BLOCKED rows in a browser or an alternate official index. Any unresolved non-DEAD row needs a named fallback action and next check. DEAD cannot be carried as clean: repair or replace the citation, then rerun plain `npm run source:links` until no DEAD remains. Keep the first report as the durable record of what the monthly run found. Then run `npm run source:links -- --check-exceptions docs/source-recertification/source-link-exceptions-YYYY-MM.json`. This separate closure gate checks the report cycle against its filename and exits nonzero for a pending or unsupported status, a missing review date, or an empty note. It does not change link-health exit rules. Do not close the cycle unless the plain link check has no DEAD and the exception closure gate passes.
- [ ] Before saying the monthly source cycle is complete, run `npm run source:ledger:check -- docs/Source-Coverage-Ledger-YYYY-MM.md --require-closed`. The cycle is not complete while any row has an empty `Result` (rows not due this month must carry the literal value `not due`), any row is still marked `not checked`, any closed row lacks `Date checked`, any cited URL is missing, any blocked row lacks a fallback action, or `Coverage level achieved` is still blank.

### 1. Data review (pre-grade)

- [ ] Open the latest live `monthly-source-scout-YYYY-MM` GitHub Actions artifact.
- [ ] Confirm the GitHub Actions run completed successfully and the `Guard current upload artifacts` step passed. An artifact from a failed run is diagnostic only.
- [ ] In `monitoring/candidates/YYYY-MM.json`, confirm `metadata.acceptance.passed` is `true` and `metadata.statePersistence.eligible` is `true` with an empty `blockers` list before treating the packet as monthly evidence.
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
- [ ] Apply [QA-Gatekeeping-Rules.md](QA-Gatekeeping-Rules.md), especially Rule 2 (carry-forward), Rule 4 (confidence revisit), Rule 5 (probation discipline), and Rule 6 (release-blocking conditions).
- [ ] If a grade moves: update `grade`, `previousGrade`, `trend`, `gradeBasis` (`band`, `plusMinusRationale`, `activeModifiers`), and `rationale` fields together. Do not update one without the others.
- [ ] Update the dim's `lastUpdated` field to today.
- [ ] If the rubric was ambiguous enough to need editor judgment: note it in the scratch file for a future Inter-Rater-Reliability-Protocol.md candidate dim.

After all 12 dimension reviews:

- [ ] Run the [Deconfliction-Matrix.md](Deconfliction-Matrix.md) check on every metric or event cited in the release. Confirm one primary scoring home, label secondary mentions as context, and treat unresolved double-counting as a release block under Rule 6 of [QA-Gatekeeping-Rules.md](QA-Gatekeeping-Rules.md).

### 3. Promise status review

- [ ] Open [Commitment-Traceability-Map.md](Commitment-Traceability-Map.md).
- [ ] For each promise where something happened this cycle: update the `status`, `evidence`, and `history` fields. Thread any new `statusSourceUrl` that emerged.
- [ ] Check residual-status promises (stalled / abandoned / too-early), have any moved?
- [ ] Do not retroactively edit `since` or `originalSourceUrl` unless they were wrong.

### 4. Approval Signal refresh

- [ ] Open [src/data/approval-polls.json](../src/data/approval-polls.json).
- [ ] Web-check each of the five included pollsters (Léger, Abacus Data, Ipsos, Angus Reid Institute, Innovative Research Group) for new releases since `asOf`.
- [ ] For each new poll found: append an entry with `pollster`, `fieldStart`, `fieldEnd`, `approve`, `disapprove`, `sampleSize`, `methodology`, `marginOfErrorNote`, `construct`, `sourceUrl`, `sourceLabel`.
- [ ] Update `asOf` to the cycle date.
- [ ] Re-check Pollara, Mainstreet, EKOS, Spark Insights, and Research Co. for any direct approve/disapprove release since last cycle. Research Co. stays excluded unless it surfaces a broad PM/government job-approval pair rather than a narrower issue-approval construct.
- [ ] Update the `preferredPM.polls` array with new Nanos weekly entries.
- [ ] Sanity-check the rolling aggregate after data is updated, should move with direction of the new polls.

### 5. Changelog entry

- [ ] Open [src/data/changelog.json](../src/data/changelog.json).
- [ ] Prepend a new entry with this month's `date` and a one-paragraph `summary` in *plain reader language* (no "hidden C- behind displayed C" governance jargon).
- [ ] Add `items[]` entries for every grade move, metric update, event, and launch.
- [ ] Grade moves use `type: "grade"` with `dimensionId`, `dimensionName`, `from`, `to`, `headline`, `body`, and optional `drivers[]` / `link`.
- [ ] Non-grade updates use `type: "event"`, `"product"`, `"method"`, `"fix"`, `"docs"`, or `"minor"` with a plain-language `headline` and `body`.

### 6. Meta bump

- [ ] Open [src/data/meta.json](../src/data/meta.json).
- [ ] Advance `version` to the next unused value in the current release sequence, for example from 5.175 to 5.176. A major methodology revision and any corresponding major version change require explicit editor approval.
- [ ] Set `lastUpdated` to today.
- [ ] Set `coveragePeriod.end` to today or the most recent material event date, whichever is later.
- [ ] Set `nextUpdate` to the next scheduled cycle date.
- [ ] Append any new entries to `milestones[]` for cycle-period events.

### 7. Build + local sanity checks

- [ ] `npm run build`, must pass without new warnings.
- [ ] Eyeball the built dashboard: the Change Log tab should show the new changelog entry; the Approval Signal should show the updated rolling window; score cards should reflect the new grades.
- [ ] Confirm `feed.xml` was regenerated by the prebuild script (contains the new changelog entry).
- [ ] Confirm the live GoatCounter visitor count is advancing (means the tracking script is still loading).

### 8. Commit + push

- [ ] Recheck the monthly cycle report's `Exception Queue` after data and grade review. Confirm each open item is reflected in the affected source row's `Notes`, and do not push while a blocking E2 or grade-moving E4 remains unresolved.
- [ ] Commit messages follow repo style, sentence-case imperative, descriptive, no Conventional Commits prefixes.
- [ ] One commit per logical concern or one bundled cycle commit, your choice, but keep changelog + meta + dimensions together in a single commit so a reader looking at `git log` sees the whole cycle as one movement.
- [ ] Push to `main` after editor-approved data, source, and grade decisions are reflected. The deploy workflow fires automatically.
- [ ] Watch the Pages deploy, ~30 seconds. Live URL should reflect the update within a minute.
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

## Historical record: cycle 2 (May 14, 2026)

This was the first full monthly cycle after the April 19 ship-readiness work. The notes below record cycle-specific work and outcomes. They are not instructions for the next cycle, which is scheduled for 2026-09-01 in the front matter above.

- **Approval Signal v2 first production data-add:** Completed in the May cycle. Four newer polls were added and the weighted rolling window was checked. See [May-2026-Source-Refresh-Notes.md](May-2026-Source-Refresh-Notes.md).
- **Ethics & Flagship Delivery probation review:** The May record does not prove this review happened. Ethics remains on probation. Flagship Delivery later passed its first full monthly retention check on July 1 under [Flagship-Delivery-Rules.md](Flagship-Delivery-Rules.md).
- **Post-majority-government read:** The April 13 majority-government formation was planned as a May-specific review lens for Flagship Delivery, Fiscal Health, and Promise Delivery. The record does not establish whether that lens was applied, so this is retained as historical context only.
- **Promise status-source watch list:** At the May 16 snapshot, all 43 tracked promises had original-source links and 40 had status-evidence links. Subsequent source work reduced those three gaps to one current gap, Carbon Border Adjustment Mechanism.
- **Candidate inter-rater reliability pilot:** The editor communication record says the final packet was sent on 2026-06-07 and acknowledged on 2026-07-24. Tracked repository artifacts independently prove the final packet was frozen on June 7 and record the July 24 acknowledgement, while the results template's send-date field remains blank. The later clarification send and return date are unproved and parked. No completed external worksheet is recorded. Current communication status is in [Inter-Rater-Pilot-Errata-2026-08.md](Inter-Rater-Pilot-Errata-2026-08.md), and the review method remains in [Inter-Rater-Reliability-Protocol.md](Inter-Rater-Reliability-Protocol.md).

---

## Emergency / ad-hoc updates

Events that can trigger an ad-hoc update outside the monthly cycle:

- A bill passes or fails a critical vote (e.g., supply, confidence, or a flagship bill).
- A minister resigns, is shuffled, or publicly breaks with the government.
- A major dataset release lands outside the normal schedule (e.g., census cycle, Budget tabled outside March, Fall Economic Statement).
- A major independent report lands that materially changes the evidence stack for a dimension (PBO major assessment, Auditor General report, Commissioner of the Environment report).
- Trade-war or external-shock events that activate or deactivate the External Constraint modifier.

Ad-hoc updates still follow the same checklist above but scope down: only the affected dims get the grade-review treatment, and the changelog entry notes "ad-hoc" in the summary.
