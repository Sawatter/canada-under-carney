# Cycle Integration Rules

## Cycle ledger minimum

Every monthly cycle needs one ledger artifact under docs/ with:
- cycle date and coverage period
- fetch commands run
- link-rot findings
- source-to-trigger findings by dimension
- grade review outcomes by dimension
- source additions, trims, or threading decisions
- bias-resistance audit count before and after
- build and viewport verification notes
- version and changelog summary

## No hidden grade movement

A grade cannot move unless the ledger names:
- the trigger or threshold crossed
- the source supporting the move
- any active modifier applied
- the party-symmetry check
- explicit editor approval

## Carry-forward handling

If a source is skipped because of ceiling, timing, or weak fit, add it to the
next-cycle carry-forward section. Do not bury it in prose.

## Deferred items

Use one of these labels:
- June candidate source
- method backlog
- UI backlog
- data hygiene
- external activation
- annual Phase 2

## Ledger closeout

Before declaring the cycle complete:
1. `(cd "${CLAUDE_SKILL_DIR}/../../.." && npm run test:data)` must pass.
2. `node "${CLAUDE_SKILL_DIR}/../../../scripts/audit-bias-resistance.mjs"` must run and the flagged count must be explained.
3. `(cd "${CLAUDE_SKILL_DIR}/../../.." && npm run build)` must pass.
4. Any UI change must have desktop and phone viewport checks.
5. Changelog and meta version must match.
6. Scope guard must be run before push.
