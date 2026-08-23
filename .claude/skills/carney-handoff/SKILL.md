---
name: carney-handoff
description: |
  CARNEY DASHBOARD ONLY.
  Compress the current session into a disposable handoff doc a fresh agent (or
  a different AI like Codex) can pick up cold. Triggers on: "hand off",
  "handoff", "prepare handoff", "write a handoff", "compress this session",
  "spin this off", "pass this to another session", "close out the session",
  "pick this up fresh", "what's parked".
when_to_use: |
  End of a long session, spinning out-of-scope work into a clean session, or
  handing context to a different agent (Codex review, fresh Claude). carney-room
  opens a session; carney-handoff closes one.
allowed-tools: Read Grep Glob Bash Write
---

# Handoff

Compress the session into ONE disposable markdown file a fresh agent can
continue from. It's a cover letter, not an archive, it points at durable
artifacts (docs, commits, changelog) rather than copying them.

## Which tool
- **compact**, continue the SAME problem in one thread (clobbers detail).
- **bundle** (`npm run bundle`), full-repo snapshot for a COLD reviewer.
- **carney-room**, assemble context at the START.
- **carney-handoff**, compress at the END, pass a thin slice on. This skill.

## Hard rules
- **Disposable → tmp/.** Save to `tmp/` (gitignored), never `docs/`. If it
  deserves to persist, it's a governance doc, not a handoff.
- **Pointers, not duplication.** Link to the doc/commit/changelog; don't
  re-summarize. Longer than a screen = you're duplicating; cut to a pointer.
- **Scan before it leaves the session** (public repo, editor identity redacted):
  ```bash
  grep -nE "(/Users/[A-Za-z]|@[A-Za-z0-9._%+-]+\.[A-Za-z]{2,})" <file>
  [ -f .identity-patterns ] && grep -nEf .identity-patterns <file>
  ```
  Scrub any match (use `<editor>`, `<repo-root>`); redact keys/tokens/PII.
- **Carry boundaries forward.** Restate the frozen surfaces + "no autonomous
  grade moves" so a fresh agent (which never saw CLAUDE.md) can't move a grade.
- **Name the target** (fresh Claude / Codex / other), tone and suggested-skills
  depend on it.

## Procedure
1. **Focus**, the user's arg is what the next session is FOR; if none, ask.
2. **State as pointers**, `git log --oneline -8` + `git status --short`: version,
   HEAD, what shipped (by hash), dirty, parked.
3. **Write** the template below, tight.
4. **Scan, save to `tmp/handoff-<topic>-<date>.md`, report** path + scan result.

## Template
```markdown
# Handoff: <topic>
**For:** <fresh Claude | Codex | other>   **Focus:** <what it hands off TO>
**Written:** <date> from <version / HEAD>

## Where things stand
- Version / HEAD · Shipped this session (one line + hash each) · Dirty

## What's parked
- <item> -> pointer to the durable doc/changelog/commit, not a re-summary

## Boundaries inherited
- Frozen surfaces (GPA math, POCKETBOOK_DIMS, thresholds, modifiers, 11+1 model),
  no change without editor approval in the turn.
- No autonomous grade moves, prepare the packet, editor decides.
- Draft anything, send nothing. Treat AI feedback as claims to verify, not orders.

## Suggested skills · Pointers · Open questions for the editor
```

## Recap
Disposable. Pointers not duplication. Scan. Carry boundaries. Name the target.
Longer than a screen = archiving, not handing off.
