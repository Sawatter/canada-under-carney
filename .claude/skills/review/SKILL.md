---
name: review
description: |
  Two-axis review of the current diff against a fixed point — Standards (does
  it follow this repo's rules) and Spec (does it do what the editor asked).
  Runs the axes as parallel sub-agents so they don't mask each other. Triggers
  on: "review this", "review the diff", "review since X", "self-review before
  push", "check this against the rules", "in-house review".
when_to_use: |
  Before shipping a change, or when Codex / Comet are unavailable and you need
  an in-house second opinion. Especially for data/methodology changes, where a
  change can follow every rule but implement the wrong thing, or vice versa.
allowed-tools: Read Grep Glob Bash Agent
---

# Review

Two-axis review of the diff between HEAD and a fixed point the editor supplies
(commit, tag, `origin/main`, `HEAD~N`). The axes run as parallel sub-agents so
they don't pollute each other's context; then this skill aggregates them.

- **Standards** — does the diff follow this repo's documented rules?
- **Spec** — does the diff do what the editor actually asked for?

## Process

### 1. Sync state
Start by reading `git status --short`, `git branch --show-current`,
`git log -1 --oneline`, and `src/data/meta.json`. State the current branch,
HEAD, version, and whether the review is against a committed state or a dirty
working tree. If the tree is dirty, name the dirty files and which ones are in
scope before reviewing.

If the review involves browser-only UI behavior, say so explicitly. Codex or a
read-only reviewer can review code and deterministic checks, but scroll, focus,
responsive layout, and interactive states need a browser-capable verification
pass before the change is called done.

### 2. Pin the fixed point
Use what the editor said. If none given, ask: "review against what — origin/main,
a commit, or HEAD~N?" Capture `git diff <fixed-point>...HEAD` (three-dot) and
`git log <fixed-point>..HEAD --oneline`.

### 3. Standards sources
- CLAUDE.md / AGENTS.md (frozen surfaces, voice rules, consulting-risk wording,
  operational guardrails)
- docs/Scoring-Rubric-v1.1.md, docs/Bias-Resistance-Protocol.md,
  docs/Source-Authority-Map.md
- Note machine-enforced checks (`test:data`, identifier scan) but don't
  re-check what tooling already does.

### 4. Spec source
The originating editor request — the chat instruction, the changelog-entry
intent, or the governance doc the change implements. If there's no clear spec,
the Spec axis reports "no spec available."

### 5. Spawn both sub-agents in parallel (one message, two Agent calls)
**Standards brief:** "Read the standards docs. Read the diff. Report every place
it violates a documented rule — frozen-surface edits, voice / consulting-risk
violations, grade or threshold changes without approval, personal-identifier
leaks. Cite the rule (file + line). Separate hard violations from judgment
calls. Under 400 words."
**Spec brief:** "Read the originating request. Read the diff. Report: (a) what
was asked for that's missing or partial; (b) anything not asked for (scope
creep); (c) anything implemented but wrong. Quote the request per finding.
Under 400 words."

### 6. Aggregate
Present under `## Standards` and `## Spec`, verbatim. Do not merge or rerank —
the axes stay separate so one can't mask the other. End with a one-line
summary: findings per axis + worst single issue.

## Why two axes
A change can follow every rule but implement the wrong thing (Standards pass,
Spec fail), or do exactly what was asked while breaking the rubric (Spec pass,
Standards fail). Separating them stops one from hiding the other.

## Boundary
This skill reports. It does not fix, and it does not move grades. Findings are
claims for the editor or a fix pass to act on.
