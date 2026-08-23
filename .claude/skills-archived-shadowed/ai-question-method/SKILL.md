---
name: ai-question-method
description: |
  Use this skill when the editor asks for thoughts, judgment, strategy, critique,
  direction, or help turning a vague concern into a better AI task. Triggers
  on: "thoughts", "does this make sense", "how should we ask", "what should
  we do", "is this biased", "review this feedback", "help me prompt",
  "turn this into a prompt".
when_to_use: |
  Open-ended or judgment-heavy requests where the best next move is to clarify
  intent, data scope, boundaries, and what good looks like before executing.
allowed-tools: Read Grep Glob Bash
---

# AI Question Method

## What this skill does
Turns vague asks into sharper senior-partner questions. It keeps the agent from
jumping straight into task execution when the real work is framing the problem.

## The four-part question frame

When the request is open-ended, identify or ask for:

1. **Center**
   The working thesis or worry.
   Example: "I think the audit script may be measuring less than the UI shows."

2. **Edges**
   What to exclude, avoid, or keep bounded.
   Example: "Do not change grades. Do not rewrite the methodology."

3. **Data Scope**
   The files, sources, screenshots, commits, or reviewer passes to inspect.
   Example: "Look across dimensions.json, the audit script, and the changelog."

4. **Good Answer**
   What the answer must do to be useful.
   Example: "Return findings with file references, then say fix / defer / ignore."

## How to respond

If enough context exists, do not stop to ask questions. Briefly state the frame
you are using and proceed.

If the request is too ambiguous to execute safely, ask one concise question that
fills the biggest gap.

For strategy or review requests, include permission to disagree:

```text
I will test your thesis against the files and push back if the evidence points
somewhere else.
```

## Prompt shape to generate

When asked to write a prompt for another AI, use:

```markdown
ROLE:

OBJECTIVE:

MY THESIS:

DATA / FILES TO INSPECT:

EDGES / DO NOT DO:

QUESTIONS TO ANSWER:

OUTPUT FORMAT:

DONE WHEN:
```

## Routing rule
- If the ask needs context setup first, invoke the project-room pattern.
- If the ask is a concrete implementation request, execute normally and keep
  the question frame implicit.
- If the ask is about source or methodology quality, combine this with the
  source-audit or bias-resistance-check skill discipline.
