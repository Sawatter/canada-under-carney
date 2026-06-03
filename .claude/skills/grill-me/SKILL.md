---
name: grill-me
description: |
  Interrogate the editor one question at a time to resolve a decision before
  acting — methodology calls, grade-move judgment, scope, source choices.
  Triggers on: "grill me", "interrogate me", "stress-test this", "walk me
  through the decision", "help me decide", "grill me on this".
when_to_use: |
  When a decision tree needs resolving before work proceeds — especially the
  editor methodology calls this project defers (funded-pathway interpretation,
  effective-price definition, whether a trigger fired, a grade-move judgment).
  Pairs with grade-evaluation: grill-me resolves the judgment, grade-evaluation
  prepares the packet.
allowed-tools: Read Grep Glob Bash
---

# Grill Me

Interview the editor relentlessly about the decision until every branch is
resolved. Walk the decision tree one node at a time, resolving dependencies in
order. For each question, give your recommended answer and the reason.

Ask one question at a time. Wait for the answer before the next.

## Rules for this repo
- If a question can be answered by reading `dimensions.json`, the docs, the
  rubric, or git history, READ IT instead of asking. Only ask the editor what
  genuinely needs editor judgment.
- Never grill toward a grade change as if you can make it. Grade moves are the
  editor's call (frozen-surface rule). Grilling resolves the *judgment*; the
  move still goes through grade-evaluation and explicit approval.
- Surface party-symmetry on any branch that could move a grade: "would this
  resolve the same way under a different governing party?"
- Keep standing constraints in view: paper-trail only, no advocacy,
  draft-not-send.
- When the tree is resolved, summarize the resolved decisions in order and name
  the next concrete action (usually: invoke grade-evaluation, or ship a metric
  refresh).

## Good grilling
- One question, one recommended answer, one reason. Not a wall of questions.
- Resolve the upstream decision before the ones that hinge on it.
- Push back if the editor's answer contradicts evidence you just read.
