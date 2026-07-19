# Review Adjudication, 2026-07-19

## Status

v5.156 was published to `main` as commit `bd01c46` on 2026-07-19 after an explicit editor instruction. GitHub Pages run `29704209449` passed its build, browser, and deploy jobs, and the production metadata reports v5.156. The blocked different-AI review and editor-only physical checks remain open post-publication gaps and are not treated as approvals.

## Scope

- Fixed point: `4c8e6eb`
- Reviewed HEAD: `de013eb`, v5.155
- Starting branch and remote state: `HEAD` and `origin/main` both pointed to `de013eb`
- Review axes: repository standards, release-spec behavior, bundle architecture, browser history, and readability meaning
- Protected surfaces: no grade, threshold, formula, weight, promise status, source stack, or dimension-model rule was approved for change

## Findings

### Standards

1. The required different-AI review had not closed for the v5.155 follow-up. Reviewer unavailability was not treated as approval.
2. The roadmap still described v5.155 as a working-branch package and said `main` remained at v5.154 after `origin/main` had moved to v5.155.
3. The July 19 readability work had no matching version and date record.
4. The v5.155 readability entry said eight dimensions, used assurance wording, and described a verifier trail that was not reproducible. The diff changed 44 lines across nine dimensions, including Flagship Delivery.
5. Two changed strings used semicolons against the public voice rules.

### Spec And Behavior

1. The initial JavaScript graph was 535,131 bytes against a 540,000-byte limit, leaving 4,869 bytes. Canonical `dimensions.json` was embedded in the entry path.
2. Four history defects were reproduced. The safeguards link bypassed browser history. A queued close and navigation replaced the Scorecard Back target. Manual `#view-*`, `#dim-*`, and `#change-*` changes could leave the URL and rendered view apart. Drawer ownership was lost after reload.
3. Readability edits changed meaning in the defence commitment timing and A- rationale, durable and material technical terms, an FTE measure, and the strength of affordability and carbon evidence.
4. Economic Policy remains internally contradictory. Its published band says fewer than two levers are authorized or executing while its ledger counts exactly two.

## Accepted Fixes

### Bundle Boundary

- The canonical policy file no longer sits in the initial JavaScript graph.
- The final build reports a 333,316-byte entry and a 345,966-byte initial graph. Canonical dimensions are emitted as a deferred 241,544-byte JSON asset.
- The existing bundle budgets were not raised.
- A deterministic summary and parity gates cover 12 dimensions, 43 promise totals and counts, GPA inputs, grade moves, and closed-card fields.

This closes the former bundle-headroom item and restores headroom before the August data cycle.

### Browser History

- The safeguards link now creates a navigable history entry.
- Queued close and navigation preserves the Scorecard Back target.
- Manual view, dimension, and change hashes reconcile URL and rendered state.
- Drawer ownership survives reload.

The three-profile browser matrix reports 117 passing tests across the default, reduced-motion, and dark Chromium profiles.

### Readability Corrections

- Defence wording again describes the $81.8 billion amount as a five-year commitment and aligns the A- rationale with the published criterion.
- Durable, material, and full-time-equivalent terms retain their technical meaning.
- Affordability and carbon wording no longer states a stronger finding than the cited evidence supports.
- Semicolon voice violations were removed.

No grade, threshold, formula, weight, promise status, source stack, or dimension-model rule changed.

## Deferred And Editor-Gated

1. Economic Policy needs editor adjudication. The editor must identify the binding criterion leg or approve a change to the frozen band wording.
2. Housing Supply, Ethics and Transparency, and Promise Delivery retain safe readability candidates. Scoring boundaries, thresholds, guardrails, modifiers, triggers, and promise-status wording remain editor-gated and must be handled separately.
3. The remaining review queue includes the Defence mixed-construct explanation, red-team invite, About funding and continuity pointer, governance-doc consolidation, and desktop tab order.
4. Physical checks remain open for iOS edge-swipe and sheet overscroll, Android pull-to-refresh, and Windows forced-colors.

## Verification Evidence

- Final build: entry 333,316 bytes
- Final build: initial JavaScript graph 345,966 bytes
- Deferred canonical dimensions asset: 241,544 bytes
- Prior initial graph: 535,131 bytes with 4,869 bytes of headroom
- Browser matrix: 117 passing tests across the default, reduced-motion, and dark Chromium profiles
- Deterministic summary parity: 12 dimensions and 43 promises, including aggregate counts, GPA inputs, grade moves, and closed-card fields
- Data validation: `npm run test:data` passed, including 56 frozen-surface assertions
- App-shell contracts: `npm run test:app-shell` passed 50 checks across 12 source files
- Final runtime review: no actionable defect found. Its Promises retry coverage gap was accepted and closed with a direct browser test
- Final standards review: its stale test count and restricted `full` wording findings were accepted, fixed, and covered by the final run
- Different-AI bridge: `bash scripts/claude-bridge.sh -f tmp/v5156-claude-review-prompt.md` was attempted and blocked by the environment's external-data policy before a review ran. This is not approval
- Production deployment: commit `bd01c46`. GitHub Pages run `29704209449` passed build, browser, and deploy jobs. Live metadata reports v5.156 dated 2026-07-19

## Post-Publication Review Closure

The required different-AI review ran successfully on July 19 through `bash scripts/claude-bridge.sh -f tmp/v5156-post-publication-claude-review.md`. Claude found no blocking defect and confirmed that the v5.156 bundle boundary, parity checks, history fixes, and frozen-surface boundary held. Four optional findings were accepted for the follow-up release:

1. The loading drawer received focus, but replacing it with loaded content could drop focus to the document body. The ready-state drawer now restores focus unless a section anchor owns the pending target.
2. Desktop and mobile browser tests now delay the policy-detail response and assert that focus remains inside the loaded drawer.
3. Policy-detail retries now ignore stale success and failure callbacks by request ID.
4. The bundle sentinel normalizes escaped Unicode before checking whether canonical detail leaked into the initial graph.

This closes the different-AI gap. The automated browser matrix covers Chromium at 375px and 1280px, including delayed drawer focus. It does not convert the physical iOS edge-swipe and sheet-overscroll, Android pull-to-refresh, or Windows forced-colors checks into completed hardware checks.

## v5.157 Final Integrated Review

The full `d62e1ff..54e591f` release diff received a second read-only Claude review through `bash scripts/claude-bridge.sh -f tmp/v5157-final-claude-review.md`. The verdict was `APPROVED`: no blocking correctness, frozen-surface, factual, or release-integrity defect remained. The review confirmed the focus and retry fixes, frozen-surface boundary, exact 43-promise status counts, dated Housing hold, cross-document source corrections, generated summaries, and release metadata.

Three optional notes were adjudicated. The source totals were independently recomputed as 154 unique URLs across 322 citation surfaces and 55 domains, so no change was needed. The About continuity link uses the same inline colour pattern as the surrounding links, and lint reports it within the existing warning class; token migration remains out of scope for this release. The Housing `verdictLine` and status use different wording with the same meaning, so no tonal-only rewrite was added.

## Frozen Editor Decisions

### Economic Policy

The literal ledger has one executing lever and one authorized lever. The published D band requires fewer than two funded or authorized levers, so the current D does not satisfy that leg. The clean action-first recommendation is to revise the C and D rows together, then move the grade from D to C. C would require at least two funded or authorized levers while investment has not risen for two consecutive quarters. D would retain the fewer-than-two rule and cover declining or near-flat investment. The alternative is an explicit investment-veto rule that keeps D when investment is declining, but that would conflict with the file's action-only construct before Timing Fairness expires. Either choice changes frozen scoring text or the grade and needs editor approval, canonical-sheet sync, a grade changelog item, `npm run test:data`, and a methodology consistency pass.

### Defence And Trade

The current sub-scores, Defence A and Trade B+, average to A-. That supports the current headline. The unresolved issue is precedence: the canonical and live ladders do not say whether the equal-weight sub-score arithmetic or a conjunctive headline ladder controls. The recommended rule is to make the equal-weight sub-score arithmetic controlling and state that triggers prompt a sub-score review rather than overriding the arithmetic. The funded-pathway copy should also say that the May memo treated commitment, NATO planning, and PBO costing together as sufficient; the $81.8B five-year commitment is not sufficient by itself. These are frozen methodology changes and need explicit editor approval before any edit.

### Ethics And Transparency

Official House Report 5 is dated April 2026 and explicitly examines the Conflict of Interest Act as applied to Prime Minister Carney's divestment obligations and conflict screen. The stale 2025 date is corrected in the source metadata, but the live component still says no substantive parliamentary report exists. The editor must decide two linked questions: whether Report 5 satisfies the published-independent-review component, and whether its recommendations count with Democracy Watch toward the two-source down-trigger. The recommendation is to adjudicate both roles together rather than count the same report selectively. Any component, trigger, or grade consequence is frozen and requires an explicit decision, synchronized `componentScoreSummary` and why-not copy, a changelog item if the grade or trigger assessment moves, and `npm run test:data`.

## Remaining Gates

1. The editor must complete the listed physical checks or explicitly record an exception.
2. The Economic Policy, Defence and Trade, and Ethics decisions above require explicit editor adjudication.
3. The external red-team invite is ready but cannot be sent without a current-turn recipient and send instruction.
4. The inter-rater pilot cannot be scored until the external worksheets return.
