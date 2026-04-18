# Claude House Style

- **Purpose:** Operating instruction file for how Claude performs bounded repo edit tasks. Ensures work closes cleanly, avoids stale contradictions, and reports residual issues honestly.
- **Status:** Active — governs all future Claude edit tasks in this repo.
- **Last updated:** 2026-04-18

---

## When to Use This Style

**Normal mode:** Applies to all repo edit tasks by default.

**Strict mode:** Required for high-risk work where accuracy and cross-file consistency matter more than speed. High-risk work includes:
- Methodology changes (rubric, scoring sheets, pilot templates, deconfliction, measure selection)
- Verification rules (protocol, workflow, exception queue, carry-forward rules)
- Source-chain corrections (sourceNote, source attribution, metric label/value/URL changes)
- Scoring logic (grade thresholds, modifier application, composite calculations, GPA arithmetic)
- Dashboard-factual corrections (any change to a displayed metric value, rationale, or claim)
- Cross-file consistency fixes (any change that must propagate to dependent files)

If unsure whether strict mode applies, use strict mode.

---

## Core Operating Principles

1. **Solve only the requested task.** Do not silently broaden scope. If the prompt says "fix X," fix X. If fixing X reveals Y, report Y but do not fix Y unless it is directly adjacent and trivially small.

2. **Prefer minimal edits that fully close the issue.** The best edit is the smallest one that resolves the problem and leaves no stale references behind. Do not rewrite sections that are not broken.

3. **Do not claim completion if dependent references remain unreconciled.** If you changed a metric name in one file, check every file that references that metric. If you cannot confirm they are all updated, say so.

4. **If something is only partially resolved, say so explicitly.** Use the words "partially resolved" and explain what remains. Do not use "done" or "complete" when residuals exist.

5. **Treat summaries as subordinate to file truth.** If a summary table, status line, or report-back conflicts with the actual file content, the file content governs. Fix the summary to match the file, not the other way around.

6. **Do not manufacture certainty.** If a source is unverified, say "unverified." If a figure is a government-stated number, say "government-stated." If a metric is editorial, label it "editorial." Never upgrade the certainty of a claim beyond what the evidence supports.

7. **Do not invent evidence.** If you cannot find a source, do not fabricate one. If you cannot verify a value, do not confirm it. Say what you checked and what you could not check.

---

## Source-of-Truth Hierarchy

When files conflict, resolve in this order:

1. **Governing methodology docs** — Scoring-Rubric-v1.1.md, Canonical-Scoring-Sheets.md, QA-Gatekeeping-Rules.md, Deconfliction-Matrix.md, Measure-Selection-Rules.md, Pilot-Templates.md
2. **Governing verification/workflow docs** — Source-Verification-Protocol.md, Verification-Workflow.md, Monthly-Operations-Mode.md, Exception-Queue-Definition.md, Carry-Forward-Rules.md
3. **Live implementation files** — src/data/dimensions.json, src/data/meta.json, src/data/changelog.json
4. **Prior summaries or handoff notes** — Go-NoGo notes, remediation briefs, shadow release logs, ledgers

If the live dashboard contradicts the methodology, the methodology governs. Fix the dashboard, not the methodology — unless the methodology itself is being intentionally changed by the current task.

---

## Pre-Edit Checklist

Before making any edit, identify:

- [ ] **Exact files that must change** — list them
- [ ] **Directly dependent files/sections that may need reconciliation** — list them
- [ ] **Explicit non-goals** — what this task is NOT doing
- [ ] **Task type** — one of:
  - **Build:** creating new content
  - **Fix:** correcting an error or inconsistency
  - **Review:** reading and reporting without editing
  - **Certify:** confirming that existing content meets a standard

---

## Required Reconciliation Pass

**This is the most important section.**

After completing the primary edit, search the edited files AND their direct dependents for:

| Check | What to look for |
|---|---|
| **Stale wording** | Text that describes the old state after you changed the current state |
| **Old labels** | Prior metric label names that should have been updated |
| **Old row references** | Ledger row IDs (e.g., "M8") that were renumbered |
| **Old metric names** | Prior metric concepts that were replaced (e.g., "CETA utilization" after the EU exports substitution) |
| **Outdated "pending verification" language** | Claims that were verified but still carry "pending" qualifiers |
| **Summary/file mismatch** | Summary tables, status lines, or counts that no longer match the actual file contents |
| **Methodology/live-dashboard drift** | dimensions.json metric or wording that no longer matches the governing methodology doc |
| **Vocabulary drift** | Inconsistent use of status names, match labels, exception categories, verification tiers, or workflow terms across files |
| **Wording stronger than evidence** | Claims, rationale text, or status lines that are more certain than the verified evidence supports |

**If the reconciliation pass finds issues:** Fix them in the same edit. If they are outside the current task's scope, report them as residuals.

---

## Definition of Done

A task is done only when ALL of these are true:

1. The primary issue is fixed
2. Directly dependent references are reconciled
3. No stale contradictory wording remains in the edited scope
4. Residual issues are explicitly listed and severity-labeled (high / medium / low)
5. The report-back matches the actual file state — not an aspirational description of what should be true, but what IS true in the files right now

**If any of these fail, the task is not done.** Use "partially reconciled" in the verdict.

---

## Required Report-Back Format

Every edit task must end with this structure:

```
1. Files changed
   [list]

2. Exact fields / sections changed
   [table or list]

3. What was fully resolved
   [list]

4. What was partially resolved
   [list, with explanation of what remains]

5. Residual issues still remaining
   [list, with severity: high / medium / low]

6. One-line verdict
   [one of:]
   - fully reconciled
   - reconciled with low-severity residuals
   - partially reconciled
```

**Do not skip sections.** If a section is empty (e.g., no residuals), write "None."

---

## Strict Mode

Strict mode applies when accuracy and cross-file consistency matter more than speed. It is required for all high-risk work listed in "When to Use This Style."

**Strict mode adds these requirements:**

1. **Explicit non-goals.** State what the task is NOT doing before starting edits. This prevents scope creep.

2. **Exact issue list.** Before editing, list every specific issue to be fixed. Number them. Track resolution against the list.

3. **No "complete" language if contradictions remain.** If any cross-file inconsistency exists in the edited scope and is not resolved, the verdict must be "partially reconciled." No exceptions.

4. **Final reconciliation sweep before reporting back.** After all edits are made, re-read every edited section and search for the items in the reconciliation checklist above. Only then write the report-back.

5. **Computation verification (if applicable).** If the task involves scores, composites, GPA values, or arithmetic: recompute from first principles, verify displayed grades match the documented rounding rule, and confirm all summary tables match the underlying calculations. Per project rule: separate drafting from verification.

---

## Prompt Wrapper Templates

### Build Pass

```
Read and follow docs/v2/verification/Claude-House-Style.md.
Task type: Build.
Create: [files to create]
Non-goals: [what not to do]
When finished, report back per house style.
```

### Fix Pass

```
Read and follow docs/v2/verification/Claude-House-Style.md.
Task type: Fix. Strict mode: [yes/no].
Fix these issues: [numbered list]
Files to edit: [list]
Non-goals: [what not to do]
When finished, report back per house style.
```

### Review Pass

```
Read and follow docs/v2/verification/Claude-House-Style.md.
Task type: Review. Do not edit files.
Review: [what to review]
Report: [what to report on]
When finished, report back per house style.
```

### Certification Pass

```
Read and follow docs/v2/verification/Claude-House-Style.md.
Task type: Certify. Strict mode: yes.
Certify that: [specific standard to check against]
Files to check: [list]
Report: pass / fail / pass with residuals
When finished, report back per house style.
```

---

## Failure Patterns This Style Is Designed to Prevent

These are recurring issues from this repo's work history. Each one has happened at least once.

| # | Pattern | What goes wrong | Prevention rule |
|---|---|---|---|
| 1 | **Main issue fixed, stale references left behind** | A metric is corrected in dimensions.json but the Go-NoGo note, ledger summary, or rationale text still uses the old value or label. | Required reconciliation pass. |
| 2 | **Summary stronger than file truth** | The report-back says "all metrics verified" but the ledger still has unverifiable rows. | Definition of done: report must match actual file state. |
| 3 | **Metric changed without dependent docs changing** | A trade metric is replaced (CETA → EU exports) but Canonical-Scoring-Sheets.md and Pilot-Templates.md still reference the old metric. | Pre-edit checklist: identify dependent files. |
| 4 | **Methodology/live mismatch** | dimensions.json uses a metric concept not blessed by the governing methodology. | Source-of-truth hierarchy: methodology governs live data. |
| 5 | **Status vocabulary drift** | One file says "unverifiable," another says "pending verification," a third says "not yet confirmed." All mean the same thing but the inconsistency erodes trust. | Reconciliation pass: check vocabulary consistency. |
| 6 | **Overclaimed completion** | Report says "done" when two dependent files still contain contradictory wording. | Definition of done: all five conditions must be met. Strict mode: no "complete" if contradictions remain. |
| 7 | **Downstream dependency not enforced** | A derived claim is marked "supported" while its input claim is still "unverifiable." | Verification protocol rule: a derived claim cannot be safer than its source input. |
| 8 | **Arithmetic not verified** | Shadow scoring composite is reported as a headline finding but the math is wrong. | Strict mode: recompute from first principles before reporting. |

---

## Usage Note

Future prompts may begin with:

> Read and follow `docs/v2/verification/Claude-House-Style.md` before making edits.

When this instruction appears, Claude must read this file and apply all operating principles, the reconciliation checklist, the definition of done, and the report-back format before starting work. If strict mode is indicated (explicitly or by task type), apply strict mode requirements as well.

When the task involves reflection, review routing, or deciding whether Claude is needed at all, also consult:

> `docs/v2/verification/AI-Workflow-Efficiency-Protocol.md`

That companion file governs:
- when reflection is required
- when stage-boundary review is required
- when direct execution is preferred
