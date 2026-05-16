# Right of Reply

**Purpose:** Provide a documented channel for graded subjects (federal ministries, agencies, watchdogs) and named third-party analysts to submit critiques of the dashboard's grades, framing, or evidence. Part of the Tier 1 challenge-enabling hygiene per `docs/Trust-And-Bias-Resistance-Plan-2026-05.md`.

## What this is

The dashboard publishes monthly performance grades for the Carney federal government across 11 policy areas plus a Promise Delivery tracker. Grades follow pre-committed `gradeTriggers` documented in `src/data/dimensions.json`. The methodology is intentionally inspectable so anyone can argue with it from the published rule, not from a private one.

This right-of-reply channel is the formal route for that argument when it comes from a party with direct knowledge of the underlying file.

## Who this is for

The right-of-reply channel accepts submissions from:

- **Federal ministries, agencies, and departments** named in a dimension's evidence chain.
- **Independent watchdogs** (PBO, Auditor General, Ethics Commissioner) cited in any grade-moving claim.
- **Policy institutes, academic researchers, and journalists** whose work is cited in a dimension.
- **Opposition parliamentary critics** with shadow-portfolio jurisdiction over the relevant file.

Members of the public who want to report a factual error should use the corrections process in `docs/Corrections-Policy.md` instead.

## What this is NOT

- Not a guaranteed-publication channel. The dashboard reviews submissions and decides what to reflect.
- Not an appeals process for grades. Grades move when documented `gradeTriggers` are crossed, not because a party submitted a reply.
- Not a deletion or retraction channel. Once a cited fact is shown to be wrong, the corrections process applies. Disagreements with editor judgment do not produce retractions.

## How to submit

1. **GitHub Issue with `right-of-reply` label.** Open at `https://github.com/Sawatter/canada-under-carney/issues`. Include: dimension name, specific claim or framing in question, alternative evidence or reasoning, and identification of your role (ministry name, agency, organization, byline).
2. **Email.** Future formal channel (will be added to the dashboard contact surface).

Submissions should include:
- What in the dashboard you are responding to (link to specific dimension or claim).
- What evidence supports your reply (cited sources, your own analysis).
- Whether you want to be named or remain anonymous in the response.
- Whether you are submitting on your own behalf or on behalf of an organization.

## Review process

1. **Acknowledgment:** within 7 days.
2. **Editor review:** the editor reads the submission against the cited evidence and the dimension's methodology.
3. **Determination:** one of:
   - **Reflected as evidence update.** The submission identified a factual gap. The corrections process applies.
   - **Reflected as critic / defender perspective update.** The submission strengthens or qualifies one side of the perspectives block. The dimension's `perspectives.critics` or `perspectives.defenders` updates.
   - **Reflected as judgment-detail update.** The submission identified context the editor judged worth surfacing in `judgmentDetail` without changing the grade.
   - **Held for accumulation.** The submission is one of multiple inputs that may collectively warrant a future change. Held with a note in the cycle ledger.
   - **Declined with reasoning.** The submission's framing is acknowledged but the dashboard's published methodology produces a different conclusion. Reasoning published as a reply.
4. **Response published:** within 30 days of receipt, in the relevant cycle's source ledger or as a standalone changelog entry.

## What gets reflected publicly

For each submission, the dashboard publishes (at minimum):

- That a right-of-reply submission was received and reviewed.
- The submitter's identification (named or "anonymous" per submitter's preference).
- The determination category.
- The dashboard's reasoning if the submission was declined.

The full text of submissions is not published unless the submitter consents. Quoting from submissions in editor reasoning is done with attribution unless the submitter requests anonymity.

## What this channel does NOT do

- Does not commit to publishing all submissions verbatim.
- Does not commit to changing a grade because a party disagrees.
- Does not pause publication of upcoming cycles.
- Does not provide pre-publication notice of grades.

## Confidentiality

Submitter identification is preserved per the submitter's preference. Email submissions are kept private to the editor. GitHub Issues are public by default; submitters wanting confidentiality should use email instead.

## Limits and scope

The dashboard is an independent analytical project. It is not affiliated with any political party, government agency, or advocacy organization. The right-of-reply channel is offered as a journalism best practice, not as a legal obligation, and the dashboard reserves the right to decline submissions that:

- Make threats or personal attacks.
- Demand the dashboard adopt a non-methodological framing.
- Are submitted by parties with no connection to the file being graded.
- Are duplicative of previously addressed submissions without new evidence.

## Coverage

This policy applies to content published at `https://sawatter.github.io/canada-under-carney/` and its source repository at `https://github.com/Sawatter/canada-under-carney`.
