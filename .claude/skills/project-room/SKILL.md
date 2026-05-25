---
name: project-room
description: |
  Use this skill before complex Canada Under Carney work that needs context
  setup before execution. Triggers on: "build the room", "project room",
  "set up the context", "catch up", "before we write", "before we fix",
  "review this pass", "prepare handoff", "what are we missing".
when_to_use: |
  Any time the task is broad, cross-file, methodology-heavy, reviewer-driven,
  or likely to suffer from stale context. Use before drafting, coding,
  external-AI handoffs, monthly-cycle planning, or synthesizing feedback.
allowed-tools: Read Grep Glob Bash
---

# Project Room

## What this skill does
Builds the room before doing the work. It gathers the current state, relevant
files, source-of-truth docs, dirty working-tree status, recent changes, open
questions, and explicit "do not touch" boundaries.

Use it to prevent confident work from stale or partial context.

## Default procedure

### Step 1 - Establish current state
Run from the repo root:

```bash
git status --short
git log --oneline -8
```

Read:
- `AGENTS.md` or `CLAUDE.md` if present
- `src/data/meta.json`
- top 5 entries of `src/data/changelog.json`
- `docs/Current-Roadmap.md` when the task touches priorities or open work

Report the dashboard version, current branch / HEAD, dirty files, and any
untracked files that look unrelated to the task.

### Step 2 - Name the source-of-truth files
For the requested task, identify which files are authoritative and which are
secondary context.

Common source-of-truth files:
- scoring / grades: `src/data/dimensions.json`, `src/utils.js`,
  `src/constants.js`, `docs/Scoring-Rubric-v1.1.md`
- sources / bias: `docs/Source-Authority-Map.md`,
  `docs/Bias-Resistance-Protocol.md`,
  `scripts/audit-bias-resistance.mjs`
- monthly work: `docs/Recurring-Source-Checklist.md`,
  `docs/Source-Coverage-Ledger-2026-06.md`,
  `docs/Current-Roadmap.md`
- UI work: affected component files plus `src/index.css`
- external-AI handoff: relevant docs, recent commits, and the exact files the
  other AI can inspect

### Step 3 - Inventory before synthesis
Before writing conclusions, produce a short inventory:
- files read
- files not read and why
- stale or superseded docs found
- missing context or unknowns
- claims that need citation or code verification
- boundaries: what not to change

### Step 4 - Output the room
Return a compact room brief:

```markdown
## Current State
- Version / HEAD:
- Dirty files:
- Relevant recent changes:

## Source Of Truth
- Primary:
- Secondary:

## Open Questions
- ...

## Boundaries
- Do not touch:
- Needs editor approval:

## Recommended Next Move
- ...
```

## Rules
- Do not make edits during the room-building pass unless the user explicitly
  asked for implementation in the same turn.
- Do not treat external-AI feedback as fact until checked against source files.
- If the task is simple and already scoped, skip the full room and state why.
- If the task will create a handoff prompt, include exactly which file or bundle
  the other AI should read.
