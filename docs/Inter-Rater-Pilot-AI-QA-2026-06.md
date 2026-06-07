# Inter-Rater Pilot — AI Packet QA (2026-06)

**Status:** AI packet QA pass complete, 2026-06-03, and the resulting fixes applied
to the packet the same day (see "Fixes applied" below). This was protocol step 1
("run optional AI packet QA"), not the pilot. No grades were assigned. The
reliability test remains untested until a human rater runs the packet.

**How it was run:** a clean AI reviewer was given only the three permitted inputs
(the redacted pilot packet, the results template, and the protocol) and asked to
check for leakage, nudging, completeness, and worksheet clarity. It was not given
the live dashboard, current grades, changelog, or editor rationale, and it was
instructed not to assign grades. This matches the guardrails in
`Inter-Rater-Reliability-Protocol.md` lines 25-30.

**Headline:** the packet is ready for a human rater run after the 2026-06-06
cleanup. The redaction intent was right, but the first QA pass found several metric
lines that pre-applied a threshold test, a few trigger phrasings that telegraphed
the current position, and missing threshold math for two dimensions. The 2026-06-03
fixes addressed the main instrument issues; the 2026-06-06 cleanup removed
rater-facing links to editor-only QA/results files and replaced the unsourced tariff
scenario estimate with a sourced Canadian counter-tariff estimate.

## Fixes applied (2026-06)

All fixes below were applied to the packet on 2026-06-03:

- Worksheet: whole-letter-only now resolves in field 3; the band field asks the rater to quote the threshold text; a "Low confidence means name the gap" instruction was added; the plus/minus example was genericized.
- Added a "Resolving Split Conditions" rule (weigh indicators holistically; one strong indicator does not lift the grade above the band the others support), matching the rubric's existing "debt level does not rescue an unsustainable path" principle rather than inventing a new rule.
- De-editorialized the Fiscal Fitch line and up-trigger and the Ethics review status so they state facts without pre-applying a threshold test.
- Added the missing snapshot-valid facts: Affordability tariff household cost burden, Grocery Code status (voluntary), food-insecurity trend, a denominator-definition note for the coverage ratio, and a Fiscal debt-to-GDP trajectory pointer to the snapshot-era Budget 2025 source. The live post-snapshot Spring Economic Update figures were deliberately kept out to preserve the frozen 2026-04-30 comparison.
- Flagged the Democracy Watch URL headline as the source's own wording.

**Resolved 2026-06-06:** the tariff household cost-burden figure was replaced.
The packet now uses the Montreal Economic Institute's Canadian counter-tariff
estimate: $91.50 per household for April-May 2025, or $548.97 per household by
March 31, 2026 if that trend persisted. The packet labels this as Canadian
counter-tariffs on U.S. goods only, not as a total trade-war household-cost
estimate. The higher per-household numbers in circulation, about $1,200 (PIIE)
and a $2,200 median (Budget Lab, Yale), are U.S. household estimates and are not
used in the rater packet.

## Original QA findings (now addressed)

### Blocking — need the editor to source snapshot facts or set a rule

1. **Affordability: supply the missing threshold denominator.** Every Affordability
   band is "relief covers X% of the identified annual cost increase," but the packet
   gives a food CPI rate and a food cost level, never the cost-increase dollar
   figure, the tariff household cost-burden estimate (listed as a required minimum
   indicator), or a Grocery Code status line (mandatory/voluntary, in force or not).
   Without these a rater cannot apply any Affordability band.
2. **De-editorialize metric lines that pre-apply a test.** Fiscal's Fitch row reads
   "AA+ stable outlook, fiscal concerns noted" — give the bare rating and outlook
   and let the rater decide if it is a "material caveat." The Fiscal up-trigger
   "Fitch removes its warning" presupposes a warning exists. Ethics's "No PM-specific
   review found" reads as an editor search result. Reword these to neutral status.
3. **Add a split-condition tie-break rule.** Fiscal's bands combine several
   AND-conditions that can land in different letters (e.g., a deficit in the C band
   while PBO confidence is in the D band). The packet states no resolution rule
   (lowest-condition-governs, or weight-of-evidence), so two raters will diverge by
   construction.
4. **Supply trajectory data where bands require it.** Bands reference debt-to-GDP
   "declining" (Fiscal) and food insecurity "elevated or rising" (Affordability) but
   only point-in-time levels are given.

### Mechanical — packet wording, snapshot-independent

5. Reconcile the whole-letter-only instruction (Ethics) with worksheet field 3 so a
   rater cannot record a plus/minus on a probation dimension.
6. Add clause identifiers to the threshold tables, or instruct raters to quote the
   threshold text, so "threshold clause used" produces consistent citations.
7. Genericize the plus/minus worked example, which currently uses "C" specifically
   (protocol line 60 says give the rules without current-grade examples).
8. Add one instruction line: if confidence is Low because something was missing, name
   it in field 7 (that is the protocol-revision trigger, and the rater is not told).

### Operational

9. Confirm the human receives only the packet, never the results template (it carries
   the snapshot grades) or the protocol (it carries editor-dependency doc links).
10. The Democracy Watch source URL slug is an evaluative third-party phrase visible to
    the rater. Consider presenting the link without the raw slug, or noting it is the
    source's own characterization.

## Why the packet was not fixed in this pass

Fixing the rater instrument is editor work. The blocking fixes need snapshot facts
re-sourced and one methodology decision (the tie-break rule), and the person building
the blind packet should not be someone who has just been working with the live grades.
The fix list above is the handoff. Next steps, in protocol order: editor fixes the
packet (step 2), sends it to a human rater (step 3), compares the worksheet against
the 2026-04-30 snapshot and publishes the agreement score (step 4).

## What this changes about the IRR status

The dashboard still cannot claim a measured inter-rater agreement number. What is now
true: the instrument has had one QA pass, and we know what to fix before spending a
human rater's time on it. The "external inter-rater reliability has not been tested"
disclosure stands.
