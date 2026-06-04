# Grade-Change Red-Team Protocol

- **Purpose:** Bring a politically-different outside perspective to bear on a grade
  change before it publishes. The reviewer independently checks whether the same
  evidence would yield the same grade, and whether the move reads as
  party-symmetric from a prior that is not the editor's.
- **Status:** Mechanism built (2026-06). Activation pending a willing
  politically-different reviewer. Until one is available, the editor-applied
  party-symmetry line is the interim control (see Bias-Resistance-Protocol.md).
- **Closes:** the 2026-06 methodology audit's area 3 gap. The party-symmetry rule
  was real but applied by the same editor who set the grade. This adds the missing
  outside, politically-different human check.

## Why this exists

The dashboard's bias defence is consistency: the same rule applied across all 11
files, with a party-symmetry test on every grade move ("would the same evidence
produce the same grade under a different governing party?"). That test is strong,
but until now it has been applied by the editor who set the grade. A reviewer with
different political priors is the cheapest way to test whether the symmetry claim
holds from the outside.

This is distinct from the Inter-Rater Reliability pilot. That pilot deliberately
screens political agreement out, because it tests whether the rubric is reproducible
by any careful reader. This protocol does the opposite: it deliberately recruits a
different political prior, because it tests whether the grade reads as fair across
priors. The two are complementary and must not be merged, or each confounds the
other. It also pairs with the reader-facing Perceived-Bias Survey
(Perceived-Bias-Survey.md), which asks the same fairness question of readers rather
than of a single reviewer.

## When it fires

Lightweight by design: only on a cycle that changes a published `grade` value, not
every cycle. This matches the existing party-symmetry-line requirement. A larger or
multi-notch move is the highest priority for a red-team pass.

## Reviewer recruitment

- Recruit one reviewer whose self-identified political prior differs from the
  editor's. Capture the self-identified leaning (in general terms) so the diversity
  is real and recorded, not assumed.
- One reviewer is enough for the lightweight check. A move that the red-teamer and
  editor read very differently is the signal, not a vote count.
- The reviewer is not asked to agree with the dashboard's existence or framing. They
  are asked to apply the published rule to the evidence and say whether the grade
  follows.

## What the reviewer gets

To avoid leading the reviewer, give them only:

- the evidence links for the change,
- the dimension's `gradeBasis` (band criterion and plus/minus rationale),
- the relevant rubric bands and modifier rules,
- the party-symmetry question.

Do not give them the editor's `judgmentDetail`, the rationale prose, the
perspectives field, or the changelog narrative for the move. Those carry the
editor's interpretation and would steer the check. This mirrors the redaction
discipline in the inter-rater packet.

## The reviewer's task

For the changed dimension, the reviewer records:

1. The band they independently place the dimension in, citing the threshold text.
2. Plus / flat / minus / whole-letter-only, with the rule used.
3. Party-symmetry verdict: would this same evidence produce this grade under a
   different governing party? Yes / No / Explain.
4. Any place the grade reads as politically motivated rather than evidence-driven.
5. Confidence: Low / Medium / High, and what (if anything) they needed but did not
   have.

## Output and what happens on divergence

- The result is a short red-team note attached to the grade-change changelog item:
  the reviewer's independent band, the symmetry verdict, and any flagged asymmetry.
- If the reviewer reaches a materially different grade (a different letter band) or
  answers the symmetry question anything other than an unqualified Yes, the editor
  must address it in `judgmentDetail` before publishing, or hold the move.
- The red-team does not change grades. It flags; the editor decides and documents.
  This keeps the no-autonomous-grade-move rule intact.

## Interim operation until a reviewer is recruited

Until a politically-different reviewer is available, grade changes proceed under the
existing interim control: the editor applies the party-symmetry line, and the
grade-change changelog notes that external red-team review was not yet available.
When a reviewer is recruited, grade changes get the red-team pass before publishing,
and the Methodology tab's limits block is updated to say so.

## What this does and does not prove

- It tests whether one outside reader with different priors reaches the same grade
  on the same evidence. It does not establish statistical agreement (that is the
  inter-rater pilot's job, at scale).
- It does not validate that the rubric is correct about what counts as, say, an
  adequate housing response. It tests whether the grade is applied symmetrically.
- It does not verify the evidence. Source verification is a separate pass.

## Related

- [Grade-Change-Red-Team-Reviewer-Invite-2026-06.md](Grade-Change-Red-Team-Reviewer-Invite-2026-06.md)
  — copy-ready recruitment language for the politically-different reviewer.
- [Bias-Resistance-Protocol.md](Bias-Resistance-Protocol.md) — the party-symmetry
  rule this externalizes.
- [Inter-Rater-Reliability-Protocol.md](Inter-Rater-Reliability-Protocol.md) — the
  reproducibility test, which screens political agreement out by design.
- [Perceived-Bias-Survey.md](Perceived-Bias-Survey.md) — the reader-facing version
  of the same fairness question.
- [QA-Gatekeeping-Rules.md](QA-Gatekeeping-Rules.md) — the grade-change gate whose
  Red Team lane this protocol escalates for published grade changes.
