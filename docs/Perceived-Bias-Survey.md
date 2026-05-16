# Perceived-Bias Survey

**Purpose:** Document the survey mechanism for testing whether readers from different political priors can see how a grade was reached. Required by the Bias-Resistance Protocol's principle 6 ("perceived-bias testing") and named in the public-surface backlog of `docs/Bias-Resistance-Protocol.md`.

## What the survey tests

The Skeptic Test:

> A skeptical reader does not need to agree with a grade. They should be able to see how the grade was reached.

The survey tests whether the dashboard meets that bar in practice, not just in theory. A reader who self-identifies with any major Canadian political party should be able to describe how a specific grade was derived from the published rubric, even if they disagree with the grade.

## What the survey does NOT test

- Agreement with grades. Readers are explicitly NOT asked whether they think a grade is correct.
- Approval of the project. The survey is about methodology comprehension, not satisfaction.
- Demographic data. The only self-ID question is political-party affinity, used for the cross-party label test.

## Survey format

Two questions per dimension reviewed:

**Q1 — Comprehension test (free text)**

> Looking at the [dimension name] grade ([letter]) and the materials in the dashboard drawer, describe in your own words how this grade was reached. (3-4 sentences.)

The answer is evaluated against the dashboard's actual derivation chain: rule (`gradeBasis.bandCriterion`), threshold values, judgment call (`judgmentCall`), modifier list (`gradeBasis.activeModifiers`), and final band. A reader's description should map to at least three of the five derivation elements.

**Q2 — Self-ID for cross-party label test (single choice)**

> Which Canadian federal political party are you closest to? (Conservative / Liberal / NDP / Bloc Québécois / Green / People's Party / None / Prefer not to say.)

Self-ID is used to aggregate comprehension results by stated affinity. The dashboard does not store identifying information beyond party affinity and survey responses.

## Pass / fail criteria

Adapted from the LaunchSims simulation analog (per `docs/Bias-Resistance-Audit-2026-05.md` and `docs/Bias-Resistance-Protocol.md`):

- **Pass:** Less than 25% of respondents from each major party (Conservative, Liberal, NDP) describe the grade derivation as biased rather than as following from the rule. Strong pass: 70%+ of respondents from each party can map their description to at least three of the five derivation elements.
- **Conditional pass:** Cross-party imbalance: a single major party labels the grade biased at a rate 20+ percentage points higher than other parties. Investigate whether the dimension's framing has a specific bias surface.
- **Fail:** More than 50% from any major party labels the grade biased. The dimension's framing or derivation needs review.

## How the survey will run

The survey is offered through the dashboard's About page and Methodology FAQ. Mechanism options:

1. **GitHub Discussions** (preferred for openness). Each dimension gets a discussion thread where readers post their derivation description + self-ID. Public, inspectable, low-overhead. The dashboard repository will enable Discussions when this survey goes live.
2. **Buttondown form** (preferred for privacy). The dashboard's existing Buttondown account hosts a survey form. Responses are private to the editor; aggregated results are published.
3. **Google Forms** (fallback). Free, well-tooled, but adds a third-party dependency.

Initial cycle uses GitHub Discussions for transparency. If response volume warrants, switching to Buttondown gives more structured analysis.

## How results are published

Aggregated survey results are published in the relevant cycle's source-coverage ledger and (when material) in the changelog. Published results include:

- Number of respondents per major party affinity bucket.
- Distribution of comprehension scores (how many mapped to 3+ derivation elements).
- Whether the cross-party label test passed / conditionally passed / failed.
- The dashboard's response if the test failed (typically: dimension framing review, methodology FAQ update, or both).

Individual responses are not published unless the respondent consents.

## Limits

- The survey is voluntary; respondents are self-selected. The dashboard publishes the methodology and lets readers come find it, rather than push-recruiting respondents from balanced party samples. Results are signal, not statistically representative of Canadian opinion.
- A "comprehension fail" does not mean the grade is wrong. It means the dashboard's derivation surface is not legible to that respondent. The fix is methodology-FAQ or UI improvement, not grade change.
- A "bias label" from a respondent who did not read the derivation surface is treated separately from a "bias label" from a respondent who DID read it. The two-question format helps distinguish.

## Versioning

The survey methodology itself is versioned. Changes to questions, scoring, or pass-criteria get a `type: "method"` changelog entry. The schema may evolve as we see what data the first cycle produces.

## Authority and scope

This survey methodology applies to the Canada Under Carney dashboard at `https://sawatter.github.io/canada-under-carney/`. It is offered as a journalism / civic-data best practice, not as a legal obligation. The dashboard reserves the right to decline submissions that contain personal attacks, threats, or off-topic content.
