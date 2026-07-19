# Review Adjudication, 2026-07-19

## Status

Accepted implementation is present in an unpushed v5.156 worktree dated 2026-07-19. v5.155 remains the expected live version. This record is not publication approval. Cross-AI review of the integrated diff and editor-only physical checks remain open gates.

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

## Remaining Gates

1. A different AI must review the integrated v5.156 diff in an approved environment. The blocked July 19 bridge attempt is not approval.
2. The editor must complete the listed physical checks or explicitly decide how to record an exception.
3. Publication requires an explicit editor decision. Until then, v5.156 must not be described as live or published.
