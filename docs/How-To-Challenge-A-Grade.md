# How To Challenge A Grade

**Purpose:** Give readers a plain route for checking or contesting a specific Canada Under Carney grade. The goal is not agreement. The goal is that a skeptical reader can see the rule, evidence, judgment call, and path for correction.

## Start with the card

1. Open the dashboard.
2. Click the dimension you want to check.
3. Use the **Skeptic path** links at the top of the drawer.

Walk these five parts in order:

| Step | What to check | Where it lives |
|---|---|---|
| 1 | What exactly is being graded? | **How This File Is Scored** |
| 2 | What would move the grade up or down? | **What changes this grade** |
| 3 | What metric or evidence supports the current grade? | **Key Metrics** and **Grade Rationale** |
| 4 | Which sources carry the claim? | **Sources** |
| 5 | What is the strongest contrary reading? | **Critics and defenders** |

If the grade still looks wrong after that, use the checks below.

## Four valid challenge types

### 1. Factual error

Use this when a number, date, source, link, attribution, or status is wrong.

Examples:

- A cited value is misreported.
- A URL points to the wrong source.
- A link is broken and no working canonical replacement is cited.
- The card says a program is not authorized, but a public Treasury Board or statutory record shows authorization.

Route: open a GitHub Issue with the `correction` label.

Policy: `docs/Corrections-Policy.md`.

### 2. Trigger disagreement

Use this when the published rule is being applied incorrectly.

Examples:

- The card says a down-trigger has not fired, but the cited source shows the trigger threshold was crossed.
- A grade moved even though the published trigger was not crossed.
- An event-driven trigger fired, but the new source URL was not added in the next cycle.

Route: open a GitHub Issue. Include the dimension, trigger text, current source, and the source showing the threshold was crossed or not crossed.

### 3. Missing evidence

Use this when a credible source should be considered but is absent.

Good evidence is usually one of:

- Official statistics or administrative data.
- PBO, Auditor General, Ethics Commissioner, parliamentary, or court records.
- Disclosed-methodology policy institute or academic analysis.
- Documented journalism with named facts or sourceable claims.

Route: open a GitHub Issue. Include the source, the exact claim, the dimension it affects, and whether it should be grade-moving evidence or context.

### 4. Judgment disagreement

Use this when the facts are cited correctly, but you think the editor's interpretation is wrong.

This can change the dashboard if the reply shows:

- The card is missing a stronger critic or defender argument.
- The judgment detail omits a material constraint.
- A modifier is being applied inconsistently with the rubric.
- The grade is not party-symmetric: the same evidence would be treated differently under another government.

Route: use GitHub Issues for public comments. Ministries, agencies, watchdogs, cited researchers, journalists, or parliamentary critics can use the right-of-reply process.

Policy: `docs/Right-Of-Reply.md`.

## What to include

Useful challenges include:

- Dashboard version.
- Dimension name.
- The exact line, metric, trigger, or claim.
- The source URL.
- The corrected value or alternative reading.
- Whether you think this is a factual correction, trigger issue, missing evidence, or judgment disagreement.

Citation format:

> Canada Under Carney Dashboard, Scoring Rubric v1.1, https://sawatter.github.io/canada-under-carney/, accessed [date], dashboard version [version], dimension [dimension name].

## What will not move a grade

These can be politically important, but they are outside this dashboard's scoring boundary:

- Leadership style, charisma, or tone.
- Popularity or approval polling.
- Private information without a public source.
- A preference for higher or lower spending by itself.
- A claim that a grade "feels too harsh" or "feels too generous" without a source or rule argument.

## What happens next

Challenges are reviewed against the published rubric and source record.

Possible outcomes:

- Correction issued.
- Source or URL updated.
- Critic / defender view updated.
- Judgment detail clarified.
- Held for the next monthly cycle.
- Declined with reasoning.

Grades move only when the evidence crosses a documented trigger or the current grade is shown to be inconsistent with the published methodology.
