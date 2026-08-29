# Release-Audit Hardening Review

**Date:** 2026-08-28

**Reviewer:** Claude Opus through the read-only repository bridge

**Scope:** Release-audit hardening implementation commit
`cab562b8b32338586a2a0b58fe72e4e6e91f255d` and its roadmap closeout. The
review excluded the user-owned local change to `scripts/claude-bridge.sh`.

## Evidence Presented

- Pages run `33228763272` for commit `cab562b8b32338586a2a0b58fe72e4e6e91f255d`
- Automatic exact-commit audit run `33229128825` and artifact `9707963341`
- Manual exact-commit audit run `33229379418` and artifact `9708040440`
- Negative malformed-target run `33229384616`
- Both successful audit reports recording `362/362` passing checks
- The implementation diff and focused local regression coverage

## Review History

The first closeout review returned `VERDICT: REVISE`. It confirmed the run IDs,
artifacts, counts, implementation claims, and parked-roadmap state, then required
two documentation fixes. The older manual browser check was anchored to the
`c73ca98` user-facing release, and this tracked review record was added so the
final cross-AI result would not live only in terminal output.

## Final Response

Checks I ran, all read-only:

| Claim in the diff | How confirmed | Result |
|---|---|---|
| Pages run `33228763272` at `cab562b8b...` passed | `gh run view` | success, push event, head_sha matches |
| Auto audit run `33229128825` | `gh run view` | success, `workflow_run`, head_sha `cab562b8b...` |
| Manual audit run `33229379418` | `gh run view` + job log | success, `workflow_dispatch`, checkout `ref: cab562b8b...`, `EXPECTED_DEPLOY_SHA: cab562b8b...` |
| Artifacts `9707963341` and `9708040440` | `gh api .../artifacts` | both exist, not expired, both named `live-dashboard-audit` |
| `362/362` against the exact deployed commit | downloaded both `report.json` | each: `totalRows 362`, `pass 362`, `issue 0`, `deployedSha == expectedDeployedSha == cab562b8b...`, `deploymentShaChecked true`, `expectedVersion 5.176` |
| Negative run `33229384616` failed at checkout | `gh run view --log-failed` + step list | `ref: not-a-commit`, checkout failed, setup-node / npm ci / playwright / wait / audit all skipped |
| Earlier runs `33226290171` and `33226574585` | `gh run view` | both success at `879ffd4c1...` |
| Implementation supports the completed item | `git show cab562b` | `target_commit` input added; `inputs.target_commit || ...` drives checkout ref, concurrency group, and `EXPECTED_DEPLOY_SHA`; concurrency moved from workflow level to job level, so a skipped Pages event no longer cancels an active audit |
| Coverage claims | `git show cab562b` on the three test scripts | missing-marker (HTTP 404 after retries `[5,10]`), browser-lifecycle (`runBrowserAuditLifecycle` launch / audit / close / artifact-write failure fixtures), historical-record (`withoutHistoricalCorrectionSections`), secondary-rationale (`major-projects-rationale-omits-red-chris`), workflow-structure (dispatch input contract, job-level concurrency, no top-level `concurrency:`) |
| No user-facing / scoring / version change | `git diff --stat c73ca98 cab562b -- src/` | empty. `meta.json` still 5.176, `lastUpdated` 2026-08-26, `nextUpdate` 2026-09-01, changelog top entry unchanged |
| September cycle active, three items parked | roadmap diff and section read | Now lane keeps only the September cycle item. Major Projects, inter-rater, and combined reader study sections are untouched by the diff |
| Malformed run framed as fail-closed | roadmap text | "used a malformed target and failed at checkout as intended instead of silently auditing another commit" |
| Prior findings resolved | roadmap and review record | browser check now reads "against the `c73ca98` user-facing release"; review record exists at `docs/Release-Audit-Hardening-Review-2026-08-28.md` and is linked from the completed item |
| Style gates | grep on added lines | no em or en dashes, no assurance verbs (ensure, guarantee, verify, validate, certify) |

One non-blocking observation, no change required: `docs/Current-Roadmap.md:26`
says the later commits changed "only evidence-preparation, test, workflow, and
roadmap files." The full `c73ca98..cab562b` set also includes `package.json` and
`monitoring/ethics-reports.json`. The `package.json` change adds two test
invocations to `prebuild` and `test:data`, and the monitoring file is a
source-monitor data refresh, so both sit inside the spirit of that sentence and
neither touches `src/`. The operative claim, that nothing rendered changed, is
proven by an empty `src/` diff.

`VERDICT: APPROVED`

Next steps from the reviewer:

- Replace the pending line in this review record with the response, then commit
  both docs.
- Nothing is blocked. The one editor decision still open is the review,
  snapshot, and publication date rule in the Editor Decision lane, which is
  unrelated to this closeout.
- Optional: tighten the roadmap sentence to name `package.json` test wiring and
  the monitoring refresh. The reviewer recommended leaving it as is.
