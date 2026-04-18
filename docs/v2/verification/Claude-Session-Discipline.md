# Claude Session Discipline

- **Purpose:** Governs how Claude sessions are scoped and restarted so context stays lean, threads stay bounded, and the cleanup loops that plagued the March 2026 remediation pass are not repeated.
- **Status:** Active — companion to Claude-House-Style.md.
- **Last updated:** 2026-04-18

---

## Core Rule

**New task type = new Claude thread. One bounded task per thread whenever possible.**

If you finish a fix pass and want to do a review pass, start a new thread. If you finish a build pass and want to certify it, start a new thread. The cost of restarting is low. The cost of context drift in a long mixed thread is high.

For whether a task needs reflection, external review, or direct execution, consult:

- [AI-Workflow-Efficiency-Protocol.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/v2/verification/AI-Workflow-Efficiency-Protocol.md)

This file governs thread shape. The efficiency protocol governs escalation and review routing.

---

## Approved Thread Types

| Type | Definition |
|---|---|
| **Review** | Read files and report findings. No edits. |
| **Fix** | Correct specific listed issues. Edits only within stated scope. |
| **Build** | Create new files or content. Scope defined by what is being created. |
| **Certify** | Confirm that existing files meet a stated standard. Strict mode required. |

---

## Session Rules

- **Start a fresh thread when the topic changes.** Don't bolt a UI fix onto a verification architecture thread.
- **Do not mix review + implementation + certification in one thread** unless the task is trivially small (under ~5 edits).
- **Do not open a new Claude thread just because work feels important.** Open one because the task falls into a lane that actually needs reflection or external review per the efficiency protocol.
- **Keep prompts narrow.** "Fix these 3 issues in these 2 files" is better than "clean up the dashboard."
- **Provide only the files and context needed.** Don't dump the full repo context for a single metric fix.
- **Prefer exact issues over open-ended asks.** "Line 19 says E1/E3/E5/E6 but should include E7/E8" is better than "review the exception logic for consistency."
- **Use the house style as the standing instruction.** Start prompts with: `Read and follow docs/v2/verification/Claude-House-Style.md before making edits.`
- **After a long or messy thread, write a handoff summary and start fresh.** Don't keep pushing corrections into a thread that has already drifted.
- **If a pass is complete, stop.** Do not continue polishing. The next improvement belongs in the next thread.

---

## Recommended Handoff Format

When moving from one Claude thread to the next, provide:

```
Objective: [one sentence]
Allowed files: [list]
Non-goals: [what not to do]
Exact issues: [numbered list]
Current state: [2-3 sentences on what was just completed]
Report-back format: per house style
```

This gives the new thread everything it needs without replaying the prior thread's history.

---

## When to Restart Instead of Continue

Restart when any of these are true:

- **Task type changed.** You finished a fix pass and now want a review or certification.
- **Thread is long.** More than ~15-20 back-and-forth exchanges usually means context is bloated and corrections are stacking.
- **Repeated follow-up corrections.** If you're on the third "also fix this" message, the thread has become a cleanup loop. Summarize and restart.
- **Summary and file state keep drifting apart.** If the report-back no longer matches what's actually in the files, a fresh thread with a clean read will be more reliable.
- **A clean certification pass is needed.** Never certify work in the same thread that produced it. A fresh thread reads the files without the prior thread's assumptions.

---

## Anti-Patterns

Avoid these:

- **Giant mixed-purpose threads.** A thread that does architecture design, then data cleanup, then UI fixes, then verification, then deploys is guaranteed to accumulate stale references and drifting summaries.
- **Repeated "also fix this" stacking.** Each bolt-on correction increases the chance that prior fixes get partially undone or that reconciliation is missed.
- **Asking for whole-document rewrites when only one section changed.** Specify the section. The rest carries forward.
- **Asking Claude to certify its own broad work without a bounded review task.** Self-certification in the same thread is unreliable. Use a separate certify thread.
- **Continuing a thread after the primary objective is done.** "While you're at it" is how scope creep happens. The next task belongs in the next thread.

---

## Minimal Session Checklist

Before starting a Claude thread:

- [ ] What is the task type? (Review / Fix / Build / Certify)
- [ ] What files may change?
- [ ] What must NOT change?
- [ ] Is this a new thread or a continuation?
- [ ] Is the ask narrow enough to close cleanly?
- [ ] What does "done" mean for this task?

---

## Usage Note

Future prompts may begin with:

> Read and follow `docs/v2/verification/Claude-House-Style.md`, `docs/v2/verification/Claude-Session-Discipline.md`, and `docs/v2/verification/AI-Workflow-Efficiency-Protocol.md` before making edits.

Use the efficiency protocol when deciding whether a new thread needs:
- reflection first
- Claude review
- or no Claude pass at all
