---
name: project-room
description: |
  Build the room before complex Canada Under Carney work — gather state, the
  source-of-truth files, and the boundaries before executing. Triggers on:
  "build the room", "project room", "set up the context", "catch up", "before
  we write", "before we fix", "review this pass", "what are we missing".
when_to_use: |
  Any broad, cross-file, methodology-heavy, or reviewer-driven task likely to
  suffer from stale context. Use before drafting, coding, external-AI handoffs,
  monthly-cycle planning, or synthesizing feedback. project-room opens a
  session; handoff closes one.
allowed-tools: Read Grep Glob Bash
---

# Project Room

Build the room before doing the work, so confident work never rests on stale or
partial context. The first pass is never the deliverable — it is "find the
materials, inventory them, surface conflicts and gaps."

## Procedure

### 1. Establish state
`git status --short` + `git log --oneline -8`. Read CLAUDE.md, src/data/meta.json,
the top changelog entries, and docs/Current-Roadmap.md if the task touches open
work. Report version / HEAD, dirty files, unrelated untracked files.

### 2. Name the source-of-truth files
Separate authoritative from secondary. Common anchors: grades → dimensions.json,
utils.js, constants.js, Scoring-Rubric; sources/bias → Source-Authority-Map,
Bias-Resistance-Protocol, audit-bias-resistance.mjs; monthly →
Recurring-Source-Checklist + the current coverage ledger; UI → the component +
index.css.

### 3. Produce the four artifacts
Four SEPARATE outputs (not one combined inventory) — they make the agent's
judgment legible so the editor can correct it before downstream work inherits
hidden assumptions:
1. **Source inventory** — one row/file: path, type, date, authority, current vs
   superseded, what it supports, limitations, usage. Authority follows the
   Source-Authority-Map tiers (T1 official … T5 commentary).
2. **Conflict log** — disagreements, surfaced not smoothed: who disagrees, on
   what, recommended response (authoritative call or editor decides).
   Party-symmetry applies when the conflict is a grade-moving claim.
3. **Missing context** — what's referenced but not in scope (PBO reports not
   pulled, metrics with no current data point, stale trigger URLs). Often more
   important than what's present.
4. **Duplicates report** — likely dup files/URLs with confidence (high/med/low)
   + version-family guess. Don't resolve silently; the editor picks canonical.

### 4. Output the room brief
Sections: Current State · Source Inventory (table) · Conflict Log · Missing
Context · Duplicates Report · Open Questions · Boundaries (do-not-touch / needs
approval) · Recommended Next Move.

## Rules
- First pass inventories; it never writes the deliverable (grade move, source
  add, changelog, methodology change).
- List duplicates with confidence; never resolve silently — editor decides.
- No grade, threshold, or frozen-surface edits during the room pass.
- Treat external-AI feedback as claims to check against source files, not fact.
- If the task is already simple and scoped, skip the full room and say why.
- If the room produces a handoff, name exactly which file/bundle the other AI
  reads.
