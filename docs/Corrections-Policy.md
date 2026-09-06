# Corrections Policy

**Purpose:** Document how the Canada Under Carney dashboard handles errors in published content. Required by basic journalism standards. Part of the Tier 1 challenge-enabling hygiene per `docs/Trust-And-Bias-Resistance-Plan-2026-05.md`.

## What gets corrected

A correction is issued when published content on the dashboard contains an error that affects what a reader would conclude. Examples:

- **Factual errors.** A cited statistic was misreported (wrong number, wrong year, wrong source).
- **Quotation or attribution errors.** A source was quoted incorrectly or attributed to the wrong author / agency.
- **Broken or wrong citation URLs.** A trigger or metric points to a URL that returns 404 or to the wrong page.
- **Internal contradictions.** Two parts of the dashboard cite incompatible values for the same metric.
- **Schema or data integrity errors.** A grade, trend, or status field was written incorrectly relative to the methodology's rules.

## What is NOT a correction

These get handled differently:

- **Grade movements.** When new evidence crosses a documented `gradeTrigger`, the grade moves under the methodology. This is a `type: "grade"` changelog entry, not a correction.
- **Methodology updates.** When the scoring rubric is updated (e.g., a new modifier added, a threshold redefined), the rubric version bumps and the changelog notes the methodology change. This is a `type: "method"` changelog entry, not a correction.
- **Source replacements when the original is still substantively correct.** If a URL changes (e.g., a government page moves) but the underlying claim is unchanged, the URL is updated as a `type: "minor"` changelog entry, not a correction.
- **Editor judgment calls.** If a reader disagrees with a `judgmentCall` or `judgmentDetail` but the editor's reasoning is published and the evidence is correctly cited, that is a disagreement, not an error. Use the right-of-reply channel for these.

## How to report a correction

Three channels, in order of preference:

1. **GitHub Issue.** Open an issue at `https://github.com/Sawatter/canada-under-carney/issues` with the label `correction`. Include: dimension name, specific claim or value in question, citation showing the correct information, and your name + role if you want to be credited.
2. **GitHub Pull Request.** If you can identify the specific file and line, a PR is faster. The dashboard reviews and either merges, requests changes, or replies with reasoning if the proposed correction does not hold.
3. **Email.** Future channel (see `docs/Right-Of-Reply.md` for formal-reply process).

## Response timeline

- **Acknowledgment:** within 7 days of receipt.
- **Initial determination:** within 14 days (correction issued, declined with reasoning, or held pending investigation).
- **Held investigations:** updated at least every 30 days until resolved.

The dashboard updates roughly monthly, so corrections may land in the next cycle rather than as standalone edits.

## How corrections are recorded

When a correction is issued, the following happens:

1. The affected content is updated in the source file (typically `src/data/dimensions.json` or a docs/ markdown file).
2. A new `changelog.json` entry is added with:
   - `date`: the date the correction was issued.
   - `summary`: one-sentence description.
   - One or more `items` with `type: "correction"`:
     ```json
     {
       "type": "correction",
       "headline": "Short noun-phrase summary",
       "body": "What was wrong. What it now says. Why the change was made. Who reported the error (if they consented to credit).",
       "affectedDimension": "<dimension-id>",
       "previousValue": "<what was published>",
       "correctedValue": "<what is now published>",
       "reportedBy": "<name or 'anonymous'>"
     }
     ```
3. The `meta.json` version bumps.
4. The corrections are linked from the About page so a reader can scan recent corrections.

## What corrections do NOT do

- Corrections do not retroactively rewrite history. Previous changelog entries remain as published.
- Corrections do not silently update content. Every correction has a visible `changelog.json` entry.
- Corrections do not erase good-faith disagreements with editor judgment. Those go to right-of-reply.

## Versioning the corrections schema itself

The September 2026 draft uses the existing `type: "correction"` schema above for its first correction records. Those records remain subject to the cycle's release gates. If the schema needs to evolve, that itself becomes a `type: "method"` changelog entry.

## Authority and scope

This policy applies to all published content on `https://sawatter.github.io/canada-under-carney/` and to its source repository at `https://github.com/Sawatter/canada-under-carney`. Forks and derived works are not covered.
