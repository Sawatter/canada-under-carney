---
name: carney-write-a-skill
description: |
  CARNEY DASHBOARD ONLY.
  Create or tighten an agent skill with proper structure, a trigger-rich
  description, and this project's house conventions. Triggers on: "write a
  skill", "create a skill", "new skill", "build a skill", "improve this skill",
  "tighten this skill".
when_to_use: |
  When adding a repeatable workflow to the skill set, or tightening an existing
  one. Encodes the house style so skills stay consistent and don't drift as the
  set grows.
allowed-tools: Read Grep Glob Write
---

# Write a Skill

## Process
1. **Scope it.** What task, what trigger phrases, scripts or just instructions,
   and which existing skills does it border (and must not duplicate)?
2. **Draft SKILL.md** in the house format below. Keep it tight.
3. **Review with the editor** before wiring it in.

## House format
```
---
name: skill-name
description: |
  First line: what it does. Then literal trigger phrases ("Triggers on: ...").
when_to_use: |
  When to reach for it, and which neighbouring skill it pairs with or defers to.
allowed-tools: Read Grep Glob Bash [Write] [Agent]
---

# Title
## What it does (one short paragraph)
## Procedure (numbered: concrete)
## Rules / boundary
```

## House rules
- **Under ~100 lines.** Longer means split detail into a REFERENCE.md or cut to
  pointers. Short skills fire more reliably and read faster.
- **Description carries the triggers.** It is the only thing the agent sees when
  choosing a skill. First sentence = what; then the literal trigger phrases.
- **Name the boundary.** Any skill that could touch grades, thresholds, or GPA
  math must restate: no autonomous grade moves; frozen surfaces need editor
  approval in the turn.
- **Scan if it emits a handoff doc.** Any skill that writes a doc meant to leave
  the session must run the project's personal-identifier scan (defined in
  CLAUDE.md) before it ships, so the editor's name, location, and local paths
  can't leak. Reference the scan; don't re-spell the patterns into new files.
- **Defer, don't duplicate.** If a neighbouring skill owns part of the job, say
  "defer to X" instead of re-implementing it.
- **Three locations when general:** `.claude/skills/<name>/` (Carney-local,
  committed), `~/.claude/skills/<name>/` and `~/.codex/skills/<name>/` (global).
  Local overrides global, put Carney specifics local, keep globals generic.

## Checklist before shipping
- [ ] Description has "Triggers on:" phrases
- [ ] Under ~100 lines
- [ ] No time-sensitive facts baked in
- [ ] Boundary stated if grade/threshold-adjacent
- [ ] Identifier-scan step if it emits a handoff doc
- [ ] Defers to neighbours instead of duplicating them
