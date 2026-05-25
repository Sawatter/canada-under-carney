# Structured Brief Template

Use this when asking Codex, Claude, Comet, or another AI to do non-trivial
work. It is designed to make the request inspectable before execution.

Copy the template and fill only what matters.

---

## ROLE
You are acting as:

## OBJECTIVE
The exact outcome I need:

Done means:

## CONTEXT
Project / repo / folder:

Current version, date, or commit:

Relevant recent changes:

Why this matters:

## SOURCES / FILES TO USE
Primary sources:
-

Secondary context:
-

Do not rely on:
-

## MY THESIS
I think the issue or opportunity is:

I might be wrong about:

## QUESTIONS TO ANSWER
1.
2.
3.

## APPROACH
Before concluding:
- Check the source files directly.
- Separate facts from judgment.
- Identify missing context.
- Push back if the evidence contradicts my thesis.
- Avoid changing unrelated files.

## GUARDS
Do not:
- Change grades, thresholds, GPA math, source policy, or public methodology
  unless explicitly asked.
- Treat another AI review as fact without checking the repo.
- Mutate historical ledgers unless explicitly asked.

Must:
- Cite file paths, line numbers, URLs, or commits where possible.
- Quote source files verbatim when making source-specific claims. Do not
  paraphrase and present it as a quote.
- Say what was checked and what was not checked.
- Call out uncertainty directly.

## OUTPUT
Return:
- Findings
- Recommended action
- Files to change, if any
- Checks to run
- External-AI handoff prompt, if useful
- Confidence and limits: what you read directly, what you could not access,
  and where the assessment is weakest

## EVIDENCE / WHY THIS DESIGN
Briefly explain why your recommendation is the right next move and what tradeoff
it accepts.
