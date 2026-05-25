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

### Step 3 - Produce the four artifacts
Before any synthesis or deliverable, produce these four named artifacts.
They are separate outputs, not one combined inventory. Together they make
the agent's judgment legible so the editor can correct it before downstream
work inherits hidden assumptions.

1. **Source inventory table.** One row per file in scope. Columns: path,
   type, date, apparent authority, current vs superseded, what claims it
   supports, limitations, how to use. For Carney work, "authority" follows
   docs/Source-Authority-Map.md tiering (T1 official, T2 independent
   analysis, T3 reporting, T4 advocacy, T5 commentary).
2. **Conflict log.** Disagreements between sources. Surface them, do not
   smooth them. For each: which sources disagree, what they disagree on,
   recommended response (which is authoritative or whether the editor
   decides). For Carney work, party-symmetry check applies when the
   conflict relates to a grade-moving claim.
3. **Missing context list.** What is referenced but not in scope. PBO
   reports cited but not pulled, metrics with no current data point,
   triggers with stale source URLs. The missing material is often more
   important than the present material.
4. **Duplicates report.** Likely duplicate or near-duplicate files or
   source URLs, with a confidence rating (high / medium / low) and a
   version-family guess. Do not silently resolve. The editor decides
   which is canonical.

### Step 4 - Output the room
Return a compact room brief:

```markdown
## Current State
- Version / HEAD:
- Dirty files:
- Relevant recent changes:

## Source Inventory
| Path | Type | Date | Authority | Current/Superseded | Supports | Limitations | Usage |
|---|---|---|---|---|---|---|---|
| ... | ... | ... | ... | ... | ... | ... | ... |

## Conflict Log
- Conflict: [what disagrees]
  - Source A says: ...
  - Source B says: ...
  - Recommended response: [authoritative call OR escalate to editor]

## Missing Context
- [what's referenced or implied but not in scope]

## Duplicates Report
- [file A] ≈ [file B] (confidence: high/medium/low)
  - Likely version family: ...
  - Recommended canonical: ... (or "editor decides")

## Open Questions
- ...

## Boundaries
- Do not touch:
- Needs editor approval:

## Recommended Next Move
- ...
```

## Rules
- The first instruction is never "write the deliverable" (grade move,
  source addition, changelog entry, methodology change). It is "find the
  materials, inventory them, surface conflicts and gaps." Do not produce
  the deliverable in the first pass.
- If you find duplicates or near-duplicates (sources, metric entries,
  trigger sources), list them with confidence scores. Do not silently
  resolve them. The editor decides which is canonical.
- Do not make grade, threshold, or frozen-surface edits during the
  room-building pass under any circumstances. The CLAUDE.md frozen-surface
  rule applies first.
- Do not treat external-AI feedback as fact until checked against source
  files.
- If the task is simple and already scoped, skip the full room and state
  why.
- If the task will create a handoff prompt, include exactly which file or
  bundle the other AI should read.
