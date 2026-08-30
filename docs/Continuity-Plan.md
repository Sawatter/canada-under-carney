# Continuity Plan

- **Purpose:** Name the single-editor continuity risk and record what a successor, a reader, or an archivist would need to know if the current editor stops maintaining the dashboard.
- **Status:** Active. Written in response to finding F8 of the July 2026 external review (see [Review-Adjudication-2026-07-02.md](Review-Adjudication-2026-07-02.md)).
- **Last updated:** 2026-08-29
- **Depends on:** [Monthly-Cycle-Playbook.md](Monthly-Cycle-Playbook.md), [Scoring-Rubric-v1.1.md](Scoring-Rubric-v1.1.md), [QA-Gatekeeping-Rules.md](QA-Gatekeeping-Rules.md), [Source-Authority-Map.md](Source-Authority-Map.md), [Continuity-Quickstart-2026-06-30.md](Continuity-Quickstart-2026-06-30.md), [CLAUDE.md](../CLAUDE.md)
- **Used by:** Any successor evaluating a takeover, any reader asking what happens if updates stop.

---

## 1. The risk, stated plainly

This dashboard has one editor. One person runs the monthly cycle, adjudicates grade changes, holds the hosting and account access, and decides what gets published. If that person stops, for any reason, the dashboard stops updating.

The July 2026 external review flagged this as a structural weakness (finding F8): the methodology is inspectable, but the operation is not redundant. That finding was accepted. This document is the response the review asked for. It is intended to make a competent takeover possible and to make a shutdown honest, not to pretend the risk is solved.

## 2. Where the canonical state lives

Everything that defines the dashboard is in the public GitHub repository. There is no private database, no CMS, and no hidden data pipeline. A successor with a clone of the repo has everything the dashboard is built from.

- `src/data/dimensions.json` is the data of record. Grades, evidence, sources, triggers, and judgment calls live here.
- `src/data/changelog.json` is the release history. User-visible changes get an entry.
- `src/data/meta.json` carries the current version and the last-updated and next-update dates that the live header displays.
- `docs/` is the governance layer: the scoring rubric, QA rules, source protocols, audits, and adjudication records.
- Git history is the audit trail. Grade moves, wording changes, and methodology decisions land as commits that can be inspected and dated.

For a cold operational start, read [Continuity-Quickstart-2026-06-30.md](Continuity-Quickstart-2026-06-30.md) first. It lists the reading order, the frozen surfaces, and the pre-push checks. This document covers the higher-level question of what continuity means. The quickstart covers what to do on day one.

## 3. What one monthly cycle requires

The monthly update is editor-run with AI assistance. No part of it publishes on its own. The checklist is [Monthly-Cycle-Playbook.md](Monthly-Cycle-Playbook.md). The short version:

1. **Section 0 of the playbook, the source-ledger recertification gate.** Cited URLs are re-checked against the claims they support before any grade review starts. The cycle is not closed until `npm run source:ledger:check -- <ledger> --require-closed` passes.
2. **Data review, grade review, promise review, approval refresh.** Grade changes must pass [QA-Gatekeeping-Rules.md](QA-Gatekeeping-Rules.md), including the source-tier minimum. The scoring boundary itself is defined in [Scoring-Rubric-v1.1.md](Scoring-Rubric-v1.1.md) and the source-role expectations in [Source-Authority-Map.md](Source-Authority-Map.md).
3. **Test gates.** `npm run test:data` checks the data files and the frozen GPA surface. `npm run build` must pass. `npm run test:browser` runs the Playwright suite for UI-affecting changes.
4. **Deploy.** A push to `main` triggers GitHub Actions, which publishes to GitHub Pages. That push is the whole deployment. There are no other release steps and no other infrastructure.

The current source-scout hardening candidate is not accepted. The first two
completed 2026-08-29 read-only Claude reviews each ended with the literal result
`VERDICT: REVISE`. A later saved response ended with `VERDICT: APPROVED`, but its
bridge exit code was not recorded, so it does not count as approval. The complete
worktree monitor suite passes 551 checks and parses all three workflow files.
Post-fix staged checks, a completed Claude review with a recorded exit code, and
hosted acceptance remain open.

Before parsing monitor inputs or starting paid work, the monitor takes a
host-local exclusive run lock keyed to the case-normalized resolved state path.
A second process using that state path exits nonzero instead of reading stale
state. The operating system releases this lock when the process ends, including
an abrupt exit.
An existing state path that is itself a symbolic link or has hard-link aliases
is rejected before monitor work. A missing state path under a symbolic-linked
parent is resolved once, and that canonical path is used for the lock, marker,
state write, and rollback.

Before replacing accepted monitor state, the scout creates a separate persistent
`<state-file>.recovery-pending` marker. Accepted outputs or an exact state
rollback clear it. A failed rollback or marker cleanup leaves it in place, and
the next monitor run stops before loading deterministic input or starting paid
work. An operator must reconcile the prior state, packet, and ledger before
removing the marker.

The one scheduled automation, the monthly source scout, cannot publish dashboard
data or push to `main`. Its read-only analysis job runs from the exact triggering
commit on `main`. It may upload a privacy-cleared `NOT ACCEPTED` diagnostic
artifact after failure, but a diagnostic artifact cannot update the review
branch. Its separate publish job runs only after successful live analysis,
installs no dependencies, downloads that run's guarded artifact, stages five
fixed monitoring paths, and rechecks the analysis-observed PR state before
pushing. Its lease uses the exact observed SHA for an existing review branch or
expected absence for a new branch. If the staged monitoring set is identical to
`main`, it makes no commit or PR update. Zero candidates alone do not establish
no change.

The analysis job writes the private-rule secret to an owner-only file before
dependency installation, branch preparation, fetch, Tavily, or Anthropic work.
The pinned scanner parses those rules while scanning its own file, then removes
the file before the next step. The artifact guard later scans only the exact
files declared for the current live or backtest upload. Historical
monitoring files outside that payload are out of scope for that run. Within
scanned content, an ordinary `home` or `users` path segment in a public URL that
starts with `http://` or `https://` is not a local-machine path. Bare,
`file:` URL, encoded, HTML-reference, repeated-separator, URL query or fragment,
Windows, and Windows network-share local-path forms remain blocked. All three
privacy checks verify the scanner hash,
require the private identity patterns, create the private file with owner-only
permissions only inside the scan step, and remove it before the next trust
boundary. The publish checkout does not persist credentials, and `GH_TOKEN` is
explicitly added only to the authenticated shell mutation step after the scan.
GitHub still creates a job token that can be available through `github.token`;
these controls do not claim that no token exists during earlier publish steps.
A successor must configure `ANTHROPIC_API_KEY`, `TAVILY_API_KEY`, and
`PRIVACY_IDENTITY_PATTERNS`, keep GitHub Actions PR creation enabled, and treat a
green analysis job plus accepted ledger metadata as the minimum evidence for
publication. Artifact existence alone is not acceptance.

The repository currently has no branch protection or ruleset for `main`. The
source-scout workflow never pushes to `main`, but that workflow rule does not
protect the branch from another write-capable workflow or credential. Claude
classified this as a tolerable repository-level residual, not a blocker for the
current candidate. A successor should record it and consider branch protection
separately, without treating it as a source-scout acceptance prerequisite.

The canonical deterministic-source, state, continuity, privacy, and
review-branch contracts are maintained in
[Source-Monitoring-System.md](Source-Monitoring-System.md). The operator gates,
including the accepted-ledger checks, are maintained in
[Monthly-Cycle-Playbook.md](Monthly-Cycle-Playbook.md). Those documents, not this
continuity summary, govern the implementation details.

## 4. What happens if updates stop

The site is designed to fail honestly. The header shows the last-updated date and the next scheduled update date from `meta.json`. If the editor stops, those dates go stale in plain view. No policy, grade, date, or score content generates itself: no feeds rewrite themselves, no dates auto-advance, no grades drift without a commit behind them. The one live number is the visitor counter, which reads an analytics total and says nothing about content freshness.

A reader can answer "when did a human last stand behind this?" by looking at the header date, and can confirm it against the changelog and the git history. A dashboard that silently stopped updating in one month and still looked current the next would be worse than no dashboard. This one cannot do that.

## 5. What is transferable and what is not

**Transferable.** The methodology documents, the data files, the build and validation scripts, and the git history are public under the repository's terms. Anyone can fork the repo, run the same checks, and continue or adapt the scorecard. The scoring rules are written to be applied by someone other than their author. That was the point of writing them down.

**Not automatically transferable.**

- **The editor's judgment calls.** Each graded dimension carries a `judgmentCall` field admitting where discretion was applied. A successor inherits the documented reasoning but not the person who made it. Grade continuity across a handover should be treated as a methodological event and disclosed in the changelog, not smoothed over.
- **Grade adjudication authority.** The current model gives one named role, the editor, final say over grade moves, promise status, and methodology changes. That authority does not pass with the files. A fork is a new editorial voice and should say so.
- **Hosting and account access.** The GitHub account that owns the repository, the Pages deployment, the analytics account, and the email-signup account are personal accounts. A successor would republish under their own accounts rather than inherit these. Since the site is a static build from public data, republishing is a build-and-host exercise, not a migration.

## 6. Orderly wind-down option

If maintenance ends without a successor, the intended shutdown is a final update, not silence:

1. A last changelog entry stating that maintenance has stopped, with the date.
2. A visible note on the site saying the same, so no reader mistakes the archive for a current assessment.
3. The repository left public, with its history intact, so the record stays inspectable indefinitely.

A frozen, clearly-labeled archive preserves most of the project's value: the record of how one government's first years were graded under a fixed, published method. What it must not become is a stale page that still reads as live.

## 7. Honest limit

This document reduces continuity risk. It does not remove it. No successor is arranged today, no second editor has authority, and no organization stands behind the project. What exists is an inspectable public record, a written method, a repeatable cycle, and this plan. That is a real improvement over undocumented dependence on one person, and it is also the extent of the claim.
