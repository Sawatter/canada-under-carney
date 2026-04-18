# AI Workflow Efficiency Protocol

- **Purpose:** Reduce time, token cost, and context bloat in AI-assisted repo work without weakening accuracy, reconciliation discipline, or review quality.
- **Status:** Active companion protocol for prompt-shaping, task routing, reflection decisions, and stage-boundary reviews.
- **Last updated:** 2026-04-18
- **Depends on:** Claude-House-Style.md, Claude-Session-Discipline.md, Current-Roadmap.md, Parking-Lot.md
- **Used by:** Codex execution, Claude reflection/review prompts, future workflow tuning

---

## What This Protocol Governs

This file governs:
- when reflection is required
- when Claude review is required
- when no second-model pass is needed
- how to keep context lean across repeated tasks
- when to stop instead of reopening the same work

This file does **not** replace:
- repo methodology docs
- scoring rules
- source-verification rules
- Claude-House-Style.md or Claude-Session-Discipline.md

It sits above them as a workflow-routing layer.

---

## Core Rule

**Use the lightest workflow that still catches the real failure mode.**

Do not add reflection, cross-model review, or repeated prompt-shaping unless they are likely to catch a concrete class of error:
- methodology drift
- cross-file inconsistency
- source-role mismatch
- prompt-scope ambiguity
- controversial editorial judgment

If the task is operational and bounded, execute it directly.

---

## Why This Exists

Recent repo work showed two opposing risks:

1. **Under-review risk**
   Real methodology contradictions, stale cross-file references, and source-role drift do get missed without disciplined review.

2. **Over-review risk**
   Small fixes were repeatedly pushed through reflection/review loops that added time and token cost without changing the answer.

This protocol is designed to hold both truths at once:
- keep cross-model critique where it materially improves reliability
- stop paying that cost on every small increment

---

## Workflow Lanes

Use one of these lanes before starting work.

| Lane | Typical work | Reflection | Claude review | Default owner |
|---|---|---|---|---|
| **A. Direct execution** | missing URL fixes, source-chain repair, wording cleanup, narrow local fix, explicit checklist cleanup | No | No | Codex |
| **B. Bounded build/fix** | scoped multi-file fix, one feature pass, source hardening within an already-approved source family, small governance cleanup | Optional only if scope is ambiguous | No by default | Codex |
| **C. Methodology / artifact work** | new governance artifact, new template, source-authority structure, workflow rule changes, major cross-file methodology cleanup | Yes, once before execution or once before final review | Yes, once at stage boundary | Codex build + Claude review |
| **D. Final review / controversial judgment** | editorial band calls, probation decisions, whole-letter normalization, certification, full-artifact review, high-risk methodology judgment | Yes | Yes, strict review | Claude |

Short version:
- `Lane A`: just do it
- `Lane B`: do it unless scope is genuinely fuzzy
- `Lane C`: reflect once, build, then review once
- `Lane D`: reflect and review on purpose

---

## Reflection Trigger Rules

### Reflection is required when:

- A task introduces a **new artifact type**
- A task creates or changes a **methodology or workflow rule**
- A task applies a new template or framework across **multiple dimensions/files**
- A task needs a **final read-only review prompt** before cross-model review
- A task introduces a **new analytical source family**
  Existing repo rule preserved: traceability fix = direct; new analytical source family = reflect + Claude review first

### Reflection is optional when:

- The task is otherwise bounded, but the scope boundary is unclear
- A mid-pass discovery changes the shape of the task
- A review prompt needs tightening because the first draft is too broad

### Reflection is not needed when:

- The work is a missing URL or source-chain repair
- The work is a wording-only amendment
- The work is an already-approved checklist-driven cleanup
- The work is continuing an already-defined stage with no new artifact or methodology decision

**Do not run a second reflection on the same task unless the scope or artifact changed.**

---

## Claude Review Trigger Rules

### Claude review is required when:

- The task is a **stage-boundary review** of a completed artifact
- The task involves **methodology, governance, or scoring judgment**
- The task needs **cross-model critique** because a single-model self-check is not enough
- The task is a **certification pass**
- The task is the first settling review after a **new analytical source family** was introduced

### Claude review is not required when:

- The task is operational and bounded
- The task is a direct traceability fix
- The task is a local implementation pass with no methodology ambiguity
- The task already passed the relevant checklist and does not change governing logic

**Claude is for disagreement risk and structure risk, not for reassurance.**

---

## Stage-Boundary Rule

**Prefer one review at the end of a meaningful stage over reviews on every small chunk.**

Good review boundaries:
- after a full artifact draft is complete
- after a source-hardening batch is complete
- after a new template is piloted
- before certification or integration

Bad review boundaries:
- after every section added to the same artifact
- after every wording tweak
- after each small cleanup inside one already-bounded pass

---

## Thread and Compaction Discipline

Use the same thread when the work is still the same workstream:
- same artifact
- same stage
- same governing decision set
- same review/fix loop

Start a fresh thread or window when:
- the task changes materially
- the current thread contains more baggage than useful context
- a completed stage is handing off into a distinct next stage
- a new workstream would otherwise require re-explaining what matters and what no longer matters

Before switching threads, preserve only the smallest useful handoff:
- repo path
- current status
- next step
- critical constraints
- must-not-touch files if any

Use compaction at natural milestones, not as a panic button:
- after a draft is complete
- after a review is complete
- after a fix batch is complete
- before beginning a distinct next phase in the same workstream

Do not compact in the middle of active reasoning if a short handoff or task completion is close.

---

## Context Discipline

Treat context as layered, not flat.

### Persistent context

These are stable enough to live in standing docs and be reused:
- [Claude-House-Style.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/v2/verification/Claude-House-Style.md)
- [Claude-Session-Discipline.md](/Users/chrissawatsky/Downloads/canada-under-carney/docs/v2/verification/Claude-Session-Discipline.md)
- this protocol
- active governing methodology docs when relevant to a task

Keep standing docs lean:
- high-signal rules
- durable constraints
- file pointers to deeper material

Do not overload standing docs with long explanatory text that can live in linked companion docs instead.

### Task-specific context

These belong in the prompt for the current task:
- objective
- exact files
- exact issues
- non-goals
- report format

### Rules

- Keep stable instructions stable across related tasks
- Do not stuff repeated repo context into every prompt if a standing doc already owns it
- Prefer a small set of high-signal files over broad repo dumps
- Use the repo docs as memory; do not keep re-litigating settled decisions in chat
- Do not paste giant raw articles, transcripts, or logs into the thread when a short extracted summary will do
- If long external material matters, distill it to the actionable points first, then carry source links separately
- Trim logs to the error, the immediate surrounding context, and the specific lines needed for diagnosis

---

## Prompt Construction Rules

Prompt like a good GitHub issue, not a vague request.

Every substantial prompt should include:
- task type
- objective
- allowed files
- explicit non-goals
- exact issues or checks
- output format

Prefer:
- specific requirements
- numbered issues
- examples
- checklists
- explicit output-shape constraints when verbosity is not needed
  Examples: findings only, one-line verdict, changed section only, no explanation unless asked

Avoid:
- vague "be thorough" language when a checklist would do
- giant mixed-purpose prompts
- implicit scope

---

## Model and Review Routing

Use the strongest process only where it pays off.

| Work type | Default route |
|---|---|
| Traceability fix, URL addition, stale wording cleanup | Codex only |
| Bounded implementation or artifact build | Codex |
| Reflection / prompt shaping | Claude |
| Read-only audit or artifact review | Claude |
| High-risk methodology judgment | Claude strict review |
| New governance artifact | Codex build, then Claude review |

The cross-model pattern is intentional:
- Codex is the default executor
- Claude is the default external critic for structure, review, and methodology pressure-testing

---

## Stop Rules

Stop when the work is good enough for the lane it belongs to.

- If a review finds only **low-severity wording notes**, do not automatically open another pass
- Do not certify work in the same thread that built it
- Do not reopen a completed stage without new evidence, new scope, or a clear blocking defect
- Do not turn "while we're here" into a new task inside the same pass
- If the primary issue is fixed and residuals are low and explicitly documented, move on

---

## Minimal Metrics Log

To tune this protocol later, track only the smallest useful set of metrics:

| Field | Meaning |
|---|---|
| `task_type` | Review / Fix / Build / Certify |
| `lane` | A / B / C / D |
| `reflection_used` | yes / no |
| `claude_review_used` | yes / no |
| `minutes_to_done` | start to final pass |
| `rework_needed` | yes / no |

These two metrics matter most:
- **minutes to done** — catches over-review tax
- **rework needed** — catches under-review tax

If we later want a log file, create one. Do not create it preemptively.

---

## Quantitative Grounding

These findings are why this protocol prefers selective review over constant review:

- Reflection can consume a large share of tokens for small gains; recent reasoning-model literature reports post-candidate reflection using up to **47.8%** of generated tokens for modest accuracy gains.  
  Sources: [arXiv 2509.09677](https://arxiv.org/html/2509.09677v1), [OptimalThinkingBench](https://arxiv.org/html/2508.13141v1)

- Cross-model or multi-agent critique helps where self-reflection can stagnate or repeat the same flawed path.  
  Source: [MAR: Multi-Agent Reflexion](https://arxiv.org/abs/2512.20845)

- Prompt caching can materially reduce cost and latency when stable context is reused.  
  Sources: [Claude prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching), [OpenAI prompt caching](https://platform.openai.com/docs/guides/prompt-caching/best-practices)

- Task-based routing can produce large cost savings when routine work is not forced through the most expensive model path.  
  Sources: [Task-based LLM routing](https://portkey.ai/blog/task-based-llm-routing/), [arXiv 2502.00409](https://arxiv.org/html/2502.00409v2)

- LLM-as-judge performance is often close to inter-human agreement on structured evaluation tasks, which supports checklist-driven review passes.  
  Sources: [LLM-as-a-Judge in Software Engineering](https://arxiv.org/abs/2502.06193), [Confident AI guide](https://www.confident-ai.com/blog/why-llm-as-a-judge-is-the-best-llm-evaluation-method), [SuperAnnotate comparison](https://www.superannotate.com/blog/llm-as-a-judge-vs-human-evaluation)

- AI coding productivity gains are real, but not free enough to justify wasteful governance loops on every small change.  
  Sources: [GitHub Copilot productivity study](https://arxiv.org/abs/2302.06590), [GitHub field summary](https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/)

---

## Default Operating Sequence

1. Classify the task into Lane A, B, C, or D.
2. Decide whether reflection is required using the trigger rules above.
3. Decide whether Claude review is required using the trigger rules above.
4. Execute the build/fix/review with the smallest sufficient context.
5. If the task is Lane C or D, run the stage-boundary review before integration.
6. Fix only what the review actually surfaced.
7. Stop.

---

## Usage Note

Future prompt-shaping and workflow decisions may begin with:

> Read and follow `docs/v2/verification/AI-Workflow-Efficiency-Protocol.md` before deciding whether this task needs reflection, Claude review, or direct execution.

When this instruction appears, the model should:
- classify the task lane
- apply the reflection/review trigger rules
- keep context lean
- prefer stage-boundary reviews over per-chunk review
- apply the stop rules before reopening work
