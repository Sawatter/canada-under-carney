# Source monitoring system

Each monthly run checks the enabled deterministic and search tiers for new
dimension-relevant material, then classifies the candidates it can. Coverage is
recorded by tier and source result. A registered source is not described as
surveyed when its tier was skipped or failed. The workflow separates read-only
analysis from review-branch publication. `source-analysis` may upload a
privacy-cleared diagnostic artifact after a failed run, but that artifact is
not accepted output. `publish-review` runs only after successful live analysis.
It stages five fixed monitoring files and exits without a PR only when that
staged set is identical to `main`. It never moves a grade, threshold, status,
or any dashboard data, and it never pushes to `main`. Everything it produces
is a candidate for the editor to look at.

This is the relevance and triage layer on top of the deterministic pullers that
already live in `scripts/fetch-data.py`. It does not replace them and it does not
re-implement them. It reads their output.

## Current hardening review

Commit `d1c49f72fd2739ffe9777ec82d0e21d9359c6cbe` was pushed to `main`
on 2026-08-30 after the final read-only Claude review exited 0 with the literal
result `VERDICT: APPROVED`. Hosted acceptance remains open. Opened on
2026-09-05: the fresh hosted backtest again received Anthropic's low-credit
error for the repository's configured API key. Its account ownership and
balance were not inspected. The editor declined paid API use, then approved
manual review for September and pausing the hosted scout. Opened: GitHub now
reports `monthly-source-scout.yml` as `disabled_manually`. Paid retries and
credential changes were held after the no-payment decision. The renewed
2026-09-06 instruction authorizes completion using existing credit, including
a single classifier preflight after reviewed publication. That request ran on
commit `dab895a34fb121ef56fb40ff21edb989c1a785b6` and again failed for low API
credit. Search and the monitor backtest never started. The workflow is paused
again. No API credit purchase, top-up, or credential replacement is authorized.
The earlier review sequence follows.

1. Claude reproduced a scanner defect: an unanchored local-path rule treated
   ordinary public URL pathnames containing `home` or `users` segments as local
   machine paths. The working-tree scanner now exempts such a match only when it
   lies in the pathname of a public web URL that starts with `http://` or
   `https://` and has a non-empty host. Bare Unix-style paths, `file:` URLs,
   local paths in a URL query or fragment, hostless URL forms, Windows paths,
   Windows network-share paths, HTML character references, repeated path
   separators, and encoded or double-encoded local-path text outside a valid
   public URL pathname remain blocked.
2. Claude raised job-level empty values for `ETHICS_PRIOR_CACHE` and
   `CARRY_FORWARD_LEDGER` as a possible shadowing defect. The claimed precedence
   mechanism was rejected against the official GitHub Actions runner code. The
   working-tree workflow still removes those redundant declarations to remove
   ambiguity. The steps that create the Ethics snapshot and carry-forward file
   publish their paths through `$GITHUB_ENV`, and the live monitor reads the
   resulting values and fails if the required Ethics path is empty.
3. Claude classified the late `PRIVACY_IDENTITY_PATTERNS` check as tolerable,
   not mandatory. The working-tree workflow now creates an owner-only
   `.identity-patterns` file before dependency installation, branch preparation,
   source fetch, Tavily, or Anthropic work. The pinned scanner parses the private
   rules while scanning its own file, then removes the private file before the
   next step.
4. Claude round 2 exited 0 and ended with `VERDICT: REVISE`. It found an
   incorrect operator step name and a seen-ledger rule that could suppress
   evidence when acceptance passed but state persistence failed. Both were
   corrected. Parallel retry and race reviews then required exact rollback after
   final-output failure, a persistent recovery marker after failed rollback or
   cleanup, an exclusive same-state run lock, alias collision checks, and one
   resolved state path for locking, marker placement, snapshots, state I/O, and
   rollback. Existing symbolic-link and hard-link state leaves are rejected. A
   missing state beneath a symbolic-linked parent is resolved once.
5. A later saved Claude response ended with `VERDICT: APPROVED`, but its bridge
   exit code was not recorded. Under the acceptance rules, that response does not
   count as approval. Its three tolerable findings were still accepted as
   defense-in-depth fixes. The bootstrap trusted scanner hash now names the
   approved scanner instead of an older internal snapshot, the configured local
   hook requires a non-empty private identity-rule file, and this review sequence
   is recorded in the repository. The subsequent post-fix review exited 0 with
   the final line `VERDICT: APPROVED` and approved the exact committed patch.

The approved patch SHA-256 is
`44be95ff15ac0d7058eda297a757a141bf2183b77095e425ab599c2d215fef6a`.
The monitor suite passed 551 checks and parsed all three workflow files.
Post-fix staged checks, outgoing-file privacy checks, and the pre-push data
and browser gates passed. These close the local release gates, not hosted
source-monitor acceptance.

### Hosted acceptance, 2026-08-30

[Run 33341015470](https://github.com/Sawatter/canada-under-carney/actions/runs/33341015470),
attempt 1, used the exact commit above with label
`2026-08-hardening-acceptance-d1c49f7`, window `2026-08-01` through
`2026-08-29`, threshold `0.08`, the same commit as `registry_ref`, and no
seen ledger. This is an isolated backtest, not the September monthly cycle.

The private-rule preflight passed. Search completed, but Anthropic returned
HTTP 400 with `Your credit balance is too low to access the Anthropic API.`
The monitor step exited 1. Its diagnostic ledger contains 244 unclassified
candidates and records `acceptance.required: true`, `acceptance.passed: false`,
and `statePersistence.eligible: false`. The isolated state was not advanced.
The upload privacy guard passed and retained diagnostic artifact `9740571212`.
The review-branch publication job was skipped, as required for a labelled
backtest. This does not test the live publication gate. The artifact is not
accepted evidence and must not be used as a successful seen ledger.

### Hosted acceptance retry, 2026-09-05

Opened: [run 33341015470, attempt 2](https://github.com/Sawatter/canada-under-carney/actions/runs/33341015470/attempts/2)
used exact commit `d1c49f72fd2739ffe9777ec82d0e21d9359c6cbe` and retained
the original labelled-backtest inputs above. The rerun request exited 0.
`gh run watch 33341015470 --repo Sawatter/canada-under-carney --exit-status`
exited 1, matching the hosted `source-analysis` failure.
`gh run view 33341015470 --repo Sawatter/canada-under-carney --attempt 2 --log-failed`
exited 0 and returned the literal Anthropic HTTP 400 error at
`2026-09-05T23:27:54Z`:

> Your credit balance is too low to access the Anthropic API.

The downloaded ledger records completed search, failed classification,
`acceptance.required: true`, `acceptance.passed: false`, and
`statePersistence.eligible: false`. No candidate was classified and the
isolated state did not advance. The private-rule preflight, upload privacy
guard, and diagnostic upload passed. The retained artifact is
`monthly-source-scout-2026-08-hardening-acceptance-d1c49f7-33341015470-2`,
artifact ID `9978834926`. It remains diagnostic only and cannot suppress a
later retry as an accepted seen ledger. `publish-review` was skipped, as
required for this isolated backtest. This result does not test live publication.

Opened: `gh secret list --repo Sawatter/canada-under-carney --json name,updatedAt`
exited 0 and reports that repository secret `ANTHROPIC_API_KEY` was last
updated at `2026-06-14T01:29:49Z`. Both the live and backtest steps bind that
same repository secret. Its value was not accessed or changed. Secret metadata
does not identify its Anthropic account or organization, so funding another
account cannot be assumed to resolve this failure. No further paid search run
was started against the unchanged failing configuration.

After this failure, the editor stated that they will not pay for API use.
The later request to restore successful hosted monitoring reopens acceptance
preparation. The 2026-09-06 instruction authorized the single existing-credit
preflight recorded below. It failed before source search and the workflow was
paused again. No purchase or credential change occurred. Hosted acceptance
remains uncompleted.

Under the renewed instruction to finish using existing credit, the acceptance criteria
remain unchanged: real classified candidates, completed search and
classification, true acceptance and state-persistence fields, and successful
artifact guards. An empty success does not prove usable classification credit.
The live monthly workflow would also have to establish
live deterministic fetching, Ethics continuity, source-ledger preservation,
completed search and classification, state persistence, guarded artifact upload,
and guarded draft review-branch publication. These remain open. The live
search window ends on the execution date and looks back from each source's
`lastSuccessfulCheck`; it is not a fixed August-only search. Keep evidence
published after the September cycle's `2026-08-31` cutoff separate from the
August review, and do not describe current endpoint responses as historical
August snapshots.

### Existing-credit preflight, 2026-09-06

Opened: the latest hosted attempt still reports the literal low-credit error.
Repository secret metadata does not show a changed `ANTHROPIC_API_KEY` since
the earlier check. The local process has no configured API key. The existing
Claude subscription login does not establish funded access for the repository's
API credential. No credential values were read or changed.

Opened: Anthropic's [Opus 4.8 model reference](https://platform.claude.com/docs/fr/models/opus-4-8/overview)
lists `claude-opus-4-8` as a still-available Claude API model. That matches
`DEFAULT_MODEL`. The observed failure names credit, not an unknown model.

The new `python3 scripts/monitor_sources.py --classifier-preflight` mode calls
the existing classifier with one fixed public Statistics Canada Consumer Price
Index table item and an Affordability context about household food prices.
It contains no grade, live dashboard data, personal data or search results.
It requires a complete valid classified response and keeps the editor-review
and no-automatic-grade flags. It reads no monitor inputs, creates no lock,
writes no files or accepted state, and makes no Tavily call. Automatic SDK
retries are disabled for this request. It accepts only an optional `--model`
override; mixing it with monitor flags fails before API work.

The workflow invokes this mode after the private-rule and backtest-input checks,
before source search. Failure stops later steps. The low-credit diagnosis is
preserved as a fixed error string; other provider errors and model-authored
text are not copied into the preflight log. Success logs the selected model,
candidate ID, classification and safety flags, then explicitly reports
`VERDICT: CLASSIFIER PREFLIGHT PASSED; FULL MONITOR ACCEPTANCE NOT TESTED`.
It cannot stand in for the backtest or live acceptance fields. Those later
runs still require their complete tiers, persistence and publication guards.

Opened: [recovery run 34017049937](https://github.com/Sawatter/canada-under-carney/actions/runs/34017049937)
used exact execution commit `dab895a34fb121ef56fb40ff21edb989c1a785b6`.
The dispatch command was:

```bash
gh workflow run monthly-source-scout.yml --repo Sawatter/canada-under-carney --ref main \
  -f label=2026-08-recovery-2026-09-06 \
  -f window_start=2026-08-01 -f window_end=2026-08-29 \
  -f surface_threshold=0.08 \
  -f registry_ref=d1c49f72fd2739ffe9777ec82d0e21d9359c6cbe
```

It exited 0 and returned the run URL. No seen ledger was supplied. These inputs
preserve the earlier backtest's search window and registry snapshot. They do
not widen the August review or substitute current responses for old evidence.
`gh run watch 34017049937 --repo Sawatter/canada-under-carney --exit-status`
exited 1. The `Test classifier access before source search` step failed with
process exit 1 at `2026-09-06T06:39:44.9337297Z`, reporting:

> ERROR: classifier preflight failed: Your credit balance is too low to access the Anthropic API.

`gh run view 34017049937 --repo Sawatter/canada-under-carney --log-failed`
exited 0 and returned that literal error. The private identity preflight and
backtest-input checks passed. Review-branch preparation, deterministic fetch,
ledger generation and validation, both full monitor steps, and backtest registry
reconstruction were skipped. No Tavily search or full classification pass ran.
The `publish-review` job was skipped.

The current-upload guard passed, but the backtest upload step failed because
the preflight had produced no files. Its log states `No artifacts will be
uploaded.` The GitHub artifacts query exited 0 and returned no artifacts.
This is not a privacy-cleared diagnostic candidate packet and provides no
accepted ledger, persisted state, or proof of successful live publication.
Read-only repository checks found no September monitor review branch or PR.
The remote accepted state and Ethics-cache blob IDs matched the tested commit.

`gh workflow disable monthly-source-scout.yml --repo Sawatter/canada-under-carney`
exited 0. The follow-up workflow API query exited 0 and reported
`state: disabled_manually`, with `updated_at: 2026-09-06T00:40:13.000-06:00`.
No monthly scan or further paid retry was dispatched. The current API-credit
failure is a concrete external blocker. Do not retry this unchanged
configuration. No API purchase or top-up is authorized.

### Current deterministic input blockers, 2026-09-05

A fresh run of the existing fetch script in an isolated checkout exited 0.
Its payload did not pass the monitor's deterministic contract. Accepted
monitoring state and the Ethics cache remained unchanged. Fixing the API
credit issue alone will not resolve these input failures.

- Opened: the Ethics listing is paginated. The existing fetch reads its first
  page only. Carson Report remains on the next page, so the current
  `suspicious_removal` result reflects an incomplete listing. The existing
  no-removal guard must remain in place while pagination handling is corrected.
  Historical reports first observed on later pages must not be described as
  newly published reports.
- The MPO comparison emits unmatched project names as strings, while the
  monitor validator requires objects containing `display` and `tokens`.
  A current name mismatch exposes that contract disagreement. The repair must
  preserve the matcher threshold and tracked cohort, and describe a name
  mismatch as needing editor comparison rather than proof of a new project.

The reopened work adds local repairs to `scripts/fetch-data.py` and
`scripts/monitor_sources.py`. The Ethics fetch now traverses the advertised
numbered listing, verifies each response's official host, path, investigation
filter and page identity, and rejects incomplete, repeated or inconsistent
pagination. Traversal is bounded. The accepted-cache no-removal rule is
unchanged. MPO validation accepts the producer's non-empty name strings and
the existing valid object shape. Its matcher and cohort remain unchanged.
Candidate wording asks for project identity comparison and distinguishes a
first-observed Ethics listing entry from a newly published report.

The local `npm run test:monitor` exited 0 with `all 591 checks passed` and
`all 3 workflow YAML file(s) parsed`. Before the fixture refresh, the same
patched scripts passed those checks against an isolated copy of the exact
hosted source data. The refreshed offline fixture changes only synthetic
source-URL coverage to match the final September data selection. Its `live`
sample statuses are test inputs, not evidence of actual link availability.

Known-answer qualification uses saved official listing pages and the separate
previously accepted cache. An independent HTML anchor reader supplies the
expected title/URL parts, which were inspected before running the new helper.
The local reproduction matches those parts and the unchanged prior-cache
subset. The cold Opus 4.8 reproduction exited 0 with `VERDICT: EXTRACTED`.
The first response omitted its full result array and was not accepted. After an
output-only prompt repair, the explicit array matched the independent reference:
73 title/URL pairs, no missing or unexpected entries, no duplicates, and all 30
previously accepted entries retained. The requested page sequence also matched.
The comparison exited 0 with `VERDICT: KNOWN ANSWER MATCHED; DELEGATE WITH REVIEW`.
The final read-only Opus code review exited 0 with `VERDICT: APPROVED`, limited
to the prepared local changes. This bounded source sample does not
establish that every future listing layout will work. No scoring or
promise-status change is authorized by the parser repair.

The same repair is isolated on `codex/source-monitor-recovery` from the freshly
checked remote main commit `d1c49f72fd2739ffe9777ec82d0e21d9359c6cbe`.
It contains only the fetcher, monitor and monitor-test scripts. It excludes the
unpublished September data and its fixture membership changes. Its
`npm run test:monitor` exited 0 with `all 591 checks passed` and
`all 3 workflow YAML file(s) parsed`. Staged whitespace and identifier checks
passed. Publication has not occurred. Because the workflow requires the main
ref, rerunning the old failed run would not test this repaired code.

PBO is a separate source exception. Opened: its official RSS feed contains an
empty title within the default fetch limit, so the existing parser rejects the
feed. The linked Public debt charges calculator page supplies an official
heading, while the other feed advertised by the homepage also omits the title.
The monitor records this failed source as an access failure. It does not make
the deterministic tier fail when the payload contract otherwise passes. Keep
the failure visible and use manual official-page evidence for the cycle.
Optional title recovery remains deferred and is not required for automated
acceptance while the source failure remains explicit.

### Approved manual September operation, 2026-09-05

The editor chose: "Use manual review for September and pause the hosted scout."
The September evidence review covers publications from `2026-08-01` through
`2026-08-31`. Later publications remain separate cycle context. This decision
allows the manual evidence cycle to proceed and leaves hosted acceptance open.

Opened: `gh workflow disable monthly-source-scout.yml --repo Sawatter/canada-under-carney`
exited 0. The follow-up command
`gh api repos/Sawatter/canada-under-carney/actions/workflows/monthly-source-scout.yml --jq '{id,name,path,state,updated_at}'`
also exited 0 and returned workflow ID `290946053`, path
`.github/workflows/monthly-source-scout.yml`, and state `disabled_manually`,
with `updated_at: 2026-09-05T18:36:24.000-06:00`. The state before the action
was `active`. This pauses the existing hosted workflow. It creates no new
schedule and does not change its YAML, accepted monitoring state, or secrets.

The existing `scripts/fetch-data.py` can pull public source data and write local
draft reports without Anthropic or Tavily keys. The approved September process
uses those source results, direct official-page
checks, source-ledger entries, and explicit scoring decisions. A failed source
must retain its exception until the manual review records a supported outcome.
Use an isolated copy of the accepted Ethics cache for diagnostic pulls.

The existing signed-in Claude bridge can assist a local evidence review using
the editor-requested model and the editor's account access. That is a manual
review step. It does not meet the hosted monitor's paid-tier acceptance contract
or create a replacement scheduled classifier. Current account usage limits
still apply.

The existing `--no-search` and `--no-classify` options are diagnostic paths.
They intentionally prevent durable monitoring-state advancement. Do not remove
those guards or describe a local manual review as successful hosted acceptance.
The hosted scout is paused again after the existing-credit preflight failed.
The reviewed Ethics and MPO repairs are published in the tested commit, but
the credit failure prevents their hosted acceptance.
PBO title recovery remains a deferred source exception. Manual cycle closure
does not close any of these automated acceptance requirements.

## Why this exists

The locked requirement: look at the data we pull every time we run the source
pull, not twice a year, and search each cited source's site for newer
dimension-relevant content. Before this, a deep search for new evidence ran only
twice a year, and no source carried a last-reviewed date. See
`docs/Recurring-Source-Checklist.md` for the tiered cadence this slots into.

## The three tiers

1. **Deterministic tier.** `fetch-data.py` already pulls RSS (PBO, pollsters,
   policy and journalism feeds), StatCan WDS cube metadata, IRCC open data, the
   Bank of Canada Valet API, LEGISinfo bill status, the Major Projects Office
   page, the Ethics Commissioner report listing, and a link-rot scan. The
   monitor reads those results and turns the meaningful signals into candidates:
   new feed items not already cited, StatCan releases newer than the cited
   period, projects on the MPO page that are not in the cohort, new Ethics
   listings, and cited URLs that went dead or blocked.

2. **Search fan-out tier (Tavily).** Many surfaces have no feed, render with
   JavaScript, block command-line fetchers, or sit behind a paywall. For those
   the monitor runs domain-restricted, time-windowed Tavily queries. Results are
   provisional discovery only. A snippet is never citation-ready. Anything
   grade-relevant needs a browser pull and editor verification before it touches
   the dashboard.

3. **Relevance pass (Claude `claude-opus-4-8`).** The model routes each
   candidate to an editor queue: metric update, trigger watch, promise status,
   source balance, context, manual browser pull, or irrelevant. It is given each
   dimension's purpose, metric labels, trigger texts, and promise texts. It is
   not given the current grade, so it routes on purpose and evidence rather than
   on the standing score. The model only routes. It does not decide a grade, and
   the no-auto-grade flags on every candidate are set in code, not by the model.

## What gets written

The dashboard data is never touched. The monitor writes to a separate area:

- `monitoring/sources.json` - the source registry (watch list), built from the
  cited URLs in `dimensions.json` and `approval-polls.json`.
- `monitoring/state.json` - per-source state: last checked, last successful
  check, content hash / etag / last-modified where available, last surfaced
  candidate id, stable candidate fingerprints used to avoid repeating unchanged
  items, and any access issue. `lastSuccessfulCheck` only advances on a
  successful fetch. This is the accepted live monitor state.
  `monitor_sources.py` advances it only when a live run passes acceptance,
  every expected tier completes, and no diagnostic or explicit skip mode is
  active. Dry runs, `--no-search`, `--no-classify`, local missing-key
  diagnostics, and paid-tier failures can produce diagnostic artifacts but
  never advance this file. State replacement uses a same-directory temporary
  file and `os.replace`, so a process-level write failure does not expose
  partial JSON. It does not claim power-loss durability for the directory
  rename. A missing state file starts clean. An existing state file must be
  valid UTF-8 JSON with `schemaVersion: 1`, `lastRun` present as `null` or a
  non-empty string, and `sources` as an object. Each source entry must be an
  object with `surfacedFingerprints` as a list of non-empty strings. The optional
  `surfacedNormalizedFingerprints` field is a list of SHA-256 strings. State
  written before that field was added remains valid. The raw and normalized
  lists are each capped at 80 entries per source. A normalized fingerprint
  hashes the source id, discovery type, tracking-normalized URL, title, and
  snippet. Known text fields must be `null` or strings. Invalid existing state
  stops before paid work, accepted output, or state changes. It is never
  silently replaced with empty deduplication state. The analysis job may still
  upload a privacy-cleared `NOT ACCEPTED` diagnostic placeholder and invalid
  input for diagnosis, but the publish job does not run.

  Before any monitor file input is parsed or paid work starts, the process takes
  a host-local exclusive run lock keyed to the case-normalized resolved state
  path. A concurrent process using that state path exits nonzero before monitor
  work. The operating system releases the lock when the owning process ends,
  including an abrupt exit. A state path that is itself a symbolic link or has
  hard-link aliases is
  rejected before monitor work. A missing state path under a symbolic-linked
  parent is resolved once, and that canonical path is used for locking, markers,
  state writes, and rollback. This process lock is separate from transaction
  recovery.

  The candidate ledger is first written as not accepted. Before state
  replacement, the monitor atomically creates
  `<state-file>.recovery-pending` with owner-only permissions. If state
  replacement fails and diagnostic output can still be written, both acceptance
  and state-persistence metadata record that failure. Any artifact-write failure
  exits nonzero and blocks the PR. A failure before state replacement leaves
  state unchanged. If the final packet or accepted-ledger write fails after
  state replacement, the monitor restores the exact pre-run state bytes and
  mode, or removes a state file that did not exist before the run. Accepted
  outputs or exact rollback clear the marker. A failed rollback or marker
  cleanup leaves it in place. Any later monitor invocation using that state path
  stops before deterministic input or paid work while the marker exists. The
  operator must reconcile the prior state, packet, and ledger before removing
  the marker. Every monitor output path must be distinct, and an output path
  that overlaps any configured monitor file input, including capitalization or
  an existing hard-link alias, fails before input parsing or paid work.
- `monitoring/ethics-reports.json` - the Ethics Commissioner diff cache.
  Before `fetch-data.py` can write the runner copy, the workflow saves the last
  accepted cache to a private runner snapshot. `monitor_sources.py` compares the
  payload's prior report keys with that untouched snapshot before accepting the
  diff. An accepted review branch carries the new cache into its next rerun.
  `monitoring/state.json` may start clean. The Ethics cache may not. Strict
  acceptance always requires a non-empty external snapshot of a previously
  accepted Ethics cache, even when the payload reports `priorCacheFound: false`.
  A strict run cannot establish its own first Ethics baseline.
  Failures before the review-branch push do not publish the changed cache. A
  later PR lookup or creation failure can leave an orphan branch or update an
  existing PR while the job is red. The next run restores that cache only when
  exactly one matching open same-repository PR exists. With no match, it resets
  from `main`. This cache is not accepted monitor state. An unreadable,
  malformed, or structurally invalid
  existing cache, a successful page response with no recognized report links,
  or a current listing that omits a previously accepted report fails the cycle
  without being overwritten. The successful page result count must match the
  diff result's `currentCount`. Query and fragment variants collapse to the
  canonical report link before comparison.
- `monitoring/candidates/YYYY-MM.json` - the structured candidate ledger.
- `docs/Source-Monitoring-Candidates-YYYY-MM.md` - the editor-readable packet.

The candidate ledger, packet, state, and recovery marker paths must resolve to
four distinct files. Any output overlap with another output or configured
monitor input stops before input parsing or paid work.

## How it runs in CI

`.github/workflows/monthly-source-scout.yml` is configured for the first of
each month when enabled. It is currently paused under the approved September
manual-review decision above and the failed existing-credit recovery test.
The following describes its retained automated contract.

Live runs share one concurrency group, so only one can change the review branch
at a time. Backtests with the same label are also serialized.

Both jobs run only for `refs/heads/main`, check out the exact triggering
`github.sha`, and do not persist checkout credentials. Third-party actions are
pinned to reviewed commit SHAs. The analysis job has read-only repository and
pull-request permissions. The publish job has write permissions. Its checkout
does not persist credentials, and the private identity-pattern file is removed
before the authenticated shell mutation step. `GH_TOKEN` is explicitly placed
in that step's environment only then. GitHub still creates the job token, which
can be available through the `github.token` context, so the control does not
claim that no token exists during earlier publish steps.

Backtest labels are checked against the path-safe label grammar before they are
exported into any artifact path. The manual `surface_threshold` input must be a
finite number from `0` through `1`, inclusive. Empty, nonnumeric, non-finite, or
out-of-range values fail before monitor work.

1. After Python setup, `source-analysis` writes
   `PRIVACY_IDENTITY_PATTERNS` to an owner-only `.identity-patterns` file. The
   pinned scanner requires and parses at least one active valid regex while
   scanning its own file. This happens before dependency installation, branch
   preparation, live fetch, and either paid tier. The preflight removes the
   private file before the next step.
2. The read-only `source-analysis` job runs
   `fetch-data.py --link-rot --json-out scripts/output/fetch-results.json`,
   `generate-source-ledger.mjs`, and
   `monitor_sources.py --cycle YYYY-MM --fetch-results ...`.
3. An `always()` guard builds the exact upload payload for the current run. The
   live payload is `scripts/output/fetch-report.txt`,
   `scripts/output/fetch-results.json`,
   `scripts/output/draft-changelog-entry.json`,
   `scripts/output/draft-dimensions.json`,
   `docs/Source-Coverage-Ledger-<cycle>.md`,
   `docs/Source-Monitoring-Candidates-<cycle>.md`,
   `monitoring/candidates/<cycle>.json`,
   `monitoring/ethics-reports.json`, and `monitoring/state.json`. The backtest
   payload is `docs/Source-Monitoring-Backtest-<label>.md`,
   `monitoring/backtest/<label>.json`,
   `monitoring/backtest/state-<label>.json`, and
   `monitoring/backtest/sources-<label>.json`. Files from historical monitoring
   runs that are not in the current payload are out of scope for that run. The
   guard does not recursively scan `monitoring/`.
   When prior steps succeeded, every declared payload file must be a regular
   file. The artifact scanner reads complete file bytes and checks local-machine
   paths, non-allowlisted email addresses, and the required private identity
   patterns.
   The scanner normalizes Unicode, decodes up to four URL, HTML character
   reference, and common JSON path-escape layers, and checks original,
   separator-spaced, and
   separator-joined views. It catches paths split by null or line-separator
   characters, including null-separated ASCII path bytes commonly produced by
   UTF-16. Another pending transformation at the depth limit fails closed. A
   `home` or `users` path-segment match is exempt only inside the pathname of a valid
   public web URL that starts with `http://` or `https://` and has a non-empty
   host. URL query and fragment values do not receive that exemption. Artifact
   filenames are checked too. Missing,
   unreadable, symbolic-link, or out-of-repository paths passed to the scanner
   fail closed. Required live publish-file presence is enforced separately by
   the publish job.
4. The guard creates `.identity-patterns` with owner-only permissions only inside
   the scan step, verifies the scanner against the reviewed SHA-256 hash,
   requires the private identity patterns, and removes the file before the step
   exits.
5. Artifact upload runs only when that guard succeeds. A privacy-cleared live
   diagnostic artifact may upload even when analysis failed. It remains
   explicitly `NOT ACCEPTED`, cannot advance the review branch, and is not
   acceptance evidence. Live artifacts include the fetch outputs, source
   ledger, candidate packet and ledger, Ethics cache, and live monitor state.
6. Backtests upload only the backtest packet, ledger, isolated state, and
   reconstructed source registry. They do not upload live state or live fetch
   outputs.
7. `publish-review` runs only after successful live analysis. It checks out the
   same exact `github.sha`, downloads that run's named guarded artifact, and
   installs no dependencies. It
   requires five regular files: monitor state, Ethics cache, cycle candidate
   ledger, cycle source ledger, and cycle candidate packet. It stages only
   those paths. If their staged set is identical to `main`, it exits without a
   commit or PR update. Zero candidates alone do not establish no change.
8. The publish guard creates the private pattern file with owner-only
   permissions only inside the scan step, verifies the scanner hash, runs staged
   mode with required identity patterns, checks the staged diff, and removes the
   private file before any write-token step. CI performs this explicit hash
   check itself. The configured local
   pre-commit hook supplies the equivalent reviewed-scanner transition check
   only for local commits.
9. Before mutation, the publish job rechecks the analysis-observed PR state. An
   existing matching PR must still be the same open draft; when analysis found
   no matching PR, none may have appeared. The push lease is tied to the branch
   state observed during analysis: the exact observed SHA for an existing branch
   or expected absence for a new branch. It then updates the existing draft PR
   or creates a new draft PR. A pre-push failure leaves the remote branch
   unchanged. A post-push lookup or creation failure can leave a branch update
   while the job is red. The workflow never pushes to `main`.

A same-cycle rerun starts from the exact triggering SHA on `main`. Only an open
draft PR whose head branch belongs to this repository and whose base is `main`
counts. Fork PRs with the same branch name are ignored. An existing review
branch with exactly one matching draft PR can restore continuity state. A
matching PR that is no longer a draft, a PR whose branch is missing, a failed
lookup, or more than one matching PR stops the run. A branch with no matching
open PR restarts cleanly without restoring continuity, which recovers a branch
left by a failed PR lookup or creation. The prior monitor state,
pre-acceptance Ethics cache, source ledger, and accepted candidate ledger are
required. The workflow restores the first three into the working tree, copies
the candidate ledger to a temporary carry-forward input, and writes a
not-accepted placeholder at the normal candidate path. A missing or invalid
continuity input stops the rerun before paid API work, a commit, a push, or any
remote review-branch update. The regenerated packet retains earlier candidates
while adding new ones. Current-run rows win exact fingerprint or URL
collisions. This prevents restored state from silently removing candidates from
the open PR. When an accepted run updates state after this merge, carried rows
are remembered first and current-run rows last. Because each source retains at
most 80 raw fingerprints and 80 normalized fingerprints, this ordering keeps
current-run fingerprints from being evicted behind older carried rows. The
publish job rechecks the analysis-observed PR state and uses the branch state
observed during analysis as its push lease, so a changed existing branch, a
newly appeared branch, or changed PR state blocks publication.

The workflow does not declare empty job-level values for `ETHICS_PRIOR_CACHE` or
`CARRY_FORWARD_LEDGER`. The fetch step writes the accepted Ethics snapshot path
to `$GITHUB_ENV`. Branch preparation writes the carry-forward path only for an
eligible same-cycle rerun. The live monitor reads both values with empty-safe
shell defaults, requires the Ethics path, and adds the carry-forward argument
only when that path exists.

### Secrets

Set these as repository secrets:

- `ANTHROPIC_API_KEY` - for the relevance pass.
- `TAVILY_API_KEY` - for the search fan-out.
- `PRIVACY_IDENTITY_PATTERNS` - for the private identity rules applied by the
  early preflight, the artifact scan, and the staged review-branch scan.

The analysis job validates `PRIVACY_IDENTITY_PATTERNS` before dependency
installation, fetch, or paid-tier work. That preflight creates an owner-only
private file, runs the pinned scanner against its own file to parse the rules,
and removes the private file before the next step. Each later scan step creates
the same owner-only file, runs its scoped scan, and removes it.

The live workflow uses `--require-keys` and `--require-complete`. A missing key
or incomplete tier fails analysis and prevents the publish job from running.
The packet and ledger may upload as privacy-cleared diagnostic artifacts and
must retain `NOT ACCEPTED` metadata. Artifact existence alone is not acceptance.
A local run without strict key enforcement may
record a missing paid tier as a diagnostic result, but that run cannot advance
`monitoring/state.json`. A paid-tier runtime failure has the same state
restriction.

Deterministic input fails closed whenever deterministic fetching is enabled. A
missing, unreadable, or contract-invalid fetch-results payload fails acceptance.
When the payload contract is invalid, candidate extraction stops entirely. The
monitor retains only safe IRCC failure diagnostics from that payload and does
not extract candidates from any other result family.
The four required IRCC downloads, permanent resident admissions, IMP work
permits, TFWP work permits, and study permits, must each return a well-formed
success result. Each result must identify the expected dataset and source URL,
carry a unique header with the required common and dataset-specific columns,
contain rows of consistent width with nonblank required values, use exact
official month tokens with matching quarters, accept only numeric totals or the
   official `--` suppression marker, and cover at least 12 contiguous monthly
   periods. The latest period must use a `20xx` year, cannot be later than the
   requested cycle, and cannot trail that cycle by more than three calendar
   months. The result must also carry matching header and column metadata,
   earliest and latest period values, a positive row count, and a SHA-256
   response hash. A missing, unsuccessful, stale, future, or contract-invalid
   IRCC result fails acceptance even outside strict workflow mode.

Deterministic feed success also requires evidence that the expected publisher
returned usable content. Feed identities cannot be duplicated or relabelled.
Successful items need a title, publisher-host link, and publication date that
parses as RFC 2822 or ISO format. Policy-feed `count` must equal the item count
and `topic_count` must equal the item flags. Pollster and excluded-pollster
`relevant_count` must equal the retained item count, while `all_count` must be
positive and no smaller. Pollster `new_count` and `cited_count` must equal their
item flags.
A failed feed result cannot carry items into candidate extraction. An empty or
malformed feed item cannot pass as successful content. Cited URL matching
removes only known tracking keys such as `utm_*`, `fbclid`, `gclid`, `mc_cid`,
and `mc_eid`. Semantic query keys remain part of the URL. PBO success also
requires every publication link to use the official PBO host and remain unique
after tracking-only URL normalization. Ethics results must use a valid page and
diff status pair. A failed page must pair with the same failed diff status. A
successful page may pair structurally with `success`, `invalid_cache`,
`malformed_data`, or `suspicious_removal`, but every non-success status still
fails acceptance cleanly. Ethics success requires a non-empty recognized report
list, consistent page and diff current counts, and no omission from the accepted
cache. The diff carries unique prior and current report keys, its prior keys
must match the saved accepted-cache snapshot, and its additions must equal that
exact set difference.

With `--require-complete`, the search tier stops after the first target reaches
a terminal failure or exhausts its retries. Classification is then skipped.
A non-strict diagnostic run may continue through the remaining search targets
to record more failures, but it cannot advance `monitoring/state.json`.

### Live prerequisites

The workflow jobs run only when the triggering ref is `refs/heads/main`, and
both use the exact triggering commit. A dispatch from another ref skips both
jobs before analysis or publication. The live repository must keep all four
prerequisites in place:

1. Set the `ANTHROPIC_API_KEY` and `TAVILY_API_KEY` repository secrets. The live
   workflow fails before opening or updating its review PR when either key is
   missing.
2. Keep the repository setting "Allow GitHub Actions to create and approve pull
   requests" on, or the `gh pr create` step fails.
3. Keep a non-empty, accepted `monitoring/ethics-reports.json` cache. The live
   workflow fails before fetch when it is missing, unreadable, or not a regular
   file.
4. Set the `PRIVACY_IDENTITY_PATTERNS` repository secret to the same non-empty
   regex list used by the local `.identity-patterns` file. The early preflight
   rejects a missing, blank, comment-only, or invalid rule set before fetch or
   paid-tier work. Each privacy check creates the private file with owner-only
   permissions and removes it before the step exits.

A blank-label `workflow_dispatch` is a mutating live run for the current UTC
month. A labeled backtest is isolated but does not test review-branch mutation.
Reserve blank-label dispatch for an intentional live cycle.

### Residual repository risk

The repository does not currently have branch protection or a ruleset configured
for `main`. This workflow never targets `main`, and its exact-SHA checkout,
separate publish job, draft-PR checks, and observed-SHA lease constrain its own
review-branch mutation. Those controls do not replace repository-level
protection against another write-capable workflow or credential. Claude
classified missing `main` protection as a tolerable repository-level residual,
not a blocker for this candidate. Record it and consider repository protection
separately, but do not hold source-monitor acceptance on it. Do not describe the
workflow controls as protecting `main` at the repository level.

## Running it locally

The paid acceptance example below is retained for authorized resumption after
reviewed publication and a successful existing-credit preflight. It is not part
of the approved manual September procedure. API credit purchases and key
changes remain outside the authorization. The offline fixture dry-run remains
available without API keys.

Installing the repository hook with `npm run setup:hooks` also makes the local
privacy tripwire mandatory. Each contributor must keep a gitignored, untracked
`.identity-patterns` file with at least one active regular expression for their
own private identity values. Missing, blank, comment-only, invalid, or tracked
configuration blocks configured local commits instead of silently dropping the
private checks. A clean clone does not activate the repository hook by itself.

```bash
# rebuild the registry after the cited source base changes
npm run monitor:registry

# offline dry-run against the fixture (no network, no API keys)
npm run monitor:dryrun

CYCLE=$(python3 -c 'from datetime import date; print(date.today().strftime("%Y-%m"))')
ETHICS_PRIOR_CACHE=$(mktemp)
trap 'rm -f "$ETHICS_PRIOR_CACHE"' EXIT
cp monitoring/ethics-reports.json "$ETHICS_PRIOR_CACHE"

# a real local monthly acceptance run: save the prior cache, then fetch
python3 scripts/fetch-data.py --link-rot --json-out scripts/output/fetch-results.json
ANTHROPIC_API_KEY=... TAVILY_API_KEY=... \
  python3 scripts/monitor_sources.py --cycle "$CYCLE" \
  --fetch-results scripts/output/fetch-results.json \
  --ethics-prior-cache "$ETHICS_PRIOR_CACHE" \
  --require-keys --require-complete
```

`--dry-run` skips both the search and relevance tiers. `--no-search` and
`--no-classify` skip one each. `--require-keys` makes a missing key a hard error
instead of a skip. `--require-complete` requires the search and classification
tiers as well as deterministic sources. When deterministic fetching is enabled,
each of the four required IRCC downloads must return a well-formed success
result under the schema and 12-month coverage contract above. A missing,
unsuccessful, or contract-invalid IRCC result exits nonzero and does not advance
`monitoring/state.json`, even when `--require-complete` is omitted. The positive
raw-feed and Ethics page/diff consistency rules also apply to local runs.

A contract-invalid deterministic payload produces no extracted candidates.
Only safe IRCC failure diagnostics are retained. In strict
`--require-complete` mode, search stops after the first terminal or exhausted
target failure and classification is skipped. Non-strict diagnostics may
continue through later search targets.

`npm run monitor:dryrun` uses the separate complete deterministic fixture
`scripts/fixtures/fetch-results-dryrun.json` and the empty state fixture
`scripts/fixtures/monitor-state-empty.json`. The independent accepted Ethics
snapshot is `scripts/fixtures/ethics-reports-prior.json`. It writes its packet
and ledger under `tmp/`. The dry run never advances either the fixture or
`monitoring/state.json`.

Dry runs, explicit `--no-search` or `--no-classify` runs, missing-key local
diagnostics, and paid-tier failures never advance durable monitor state. They
may still write a packet and ledger so the failure or skipped tier is visible.

`--no-deterministic` is reserved for historical backtests. It requires a fixed
`--window-start` and `--window-end` plus an explicit isolated `--state-file`.
A successful isolated backtest may advance only that isolated state file. It
never advances `monitoring/state.json`.

When `--seen-ledger` is supplied, candidate fingerprints and normalized URLs
act as suppression keys only when `metadata.acceptance.passed` is `true`. When
modern state-persistence metadata is present, `eligible` must also be `true`
with an empty blockers list. A non-persistent diagnostic ledger contributes no
suppression keys. Acceptance-only ledgers from the earlier schema remain
eligible, and a legacy ledger may suppress only when both `metadata.acceptance`
and `metadata.statePersistence` are absent. `statePersistence` without
`acceptance` is invalid. Explicit failed acceptance contributes no suppression
keys, so a corrected retry can resurface the same candidates. The monitor does
not infer acceptance from tier text. Missing, unreadable, invalid UTF-8,
malformed, or structurally invalid input fails before paid work, artifacts, or
state changes.

`--carry-forward-ledger` has a different purpose. It retains candidates from an
accepted same-cycle ledger when a live review branch is rerun. A current ledger
must match the requested cycle, have `metadata.acceptance.passed` set to `true`,
have `metadata.statePersistence.eligible` set to `true`, and have an empty
persistence blockers list. A legacy carry-forward ledger is allowed only when
both metadata fields are absent. Every affected dimension must be a current
dashboard dimension id. Invalid carry-forward input fails before paid work,
artifacts, or state changes. Generated carry metadata may itself be carried
through later reruns, so repeated same-cycle runs remain cumulative.

## What stays manual

- The editor adjudicates every candidate. Nothing is auto-applied.
- Blocked, paywalled, and JavaScript-rendered surfaces need a browser pull to
  read the actual content. The monitor flags these as `manual_browser_pull`.
- Grade moves, threshold changes, and any edit to `dimensions.json` stay an
  editor decision, made through the normal cycle.

## Tests

- `npm run test:monitor` runs `scripts/test_monitor_sources.py` and
  `scripts/validate_workflow_yaml.py`. No network, no keys. It locks the registry
  shape, the deterministic parser behavior (new material surfaces,
  already-cited material is filtered), per-source state honesty, the
  no-auto-grade invariants, and the monthly workflow YAML structure.
- `scripts/fixtures/fetch-results-sample.json` retains the known-answer parser
  and discovery cases used by the tests.
- `scripts/fixtures/fetch-results-dryrun.json` is the separate complete input
  for `npm run monitor:dryrun`. That command pairs it with
  `scripts/fixtures/monitor-state-empty.json` and
  `scripts/fixtures/ethics-reports-prior.json`, then writes only to `tmp/` paths.
  The fixture intentionally covers the current cited URL and bill universe.
  A source-universe change must update this fixture in the same change;
  `npm run test:monitor` fails until they match.

## The one hard rule

The monitor produces candidates. It does not move grades, statuses, thresholds,
scoring, or dashboard data. That line is enforced in code (the safety flags are
set server-side, not by the model) and stated in every packet.
