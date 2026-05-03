# Inter-Rater Pilot Reviewer Invite - May 2026

- **Purpose:** Copy-ready language for recruiting one outside rater for the first v1 inter-rater reliability pilot.
- **Status:** Ready to use.
- **Packet:** [Inter-Rater-Pilot-Packet-2026-05.md](Inter-Rater-Pilot-Packet-2026-05.md)
- **Results template:** [Inter-Rater-Pilot-Results-Template-2026-05.md](Inter-Rater-Pilot-Results-Template-2026-05.md)

---

## Short Invite

I'm testing whether the Canada Under Carney dashboard's scoring rubric is reproducible by someone other than me.

Would you be willing to do a blind pilot? It should take about 60-90 minutes. I will give you a redacted packet for three policy areas. The packet includes the raw metrics, sources, scoring thresholds, deconfliction rules, and grade-movement triggers, but it hides the current published grades and my rationale.

The task is to independently assign a grade for each area using the published rules. I am not asking whether you agree politically with the dashboard. I am testing whether the rubric leads another careful reader to the same or similar grades.

Important: please do not open the live dashboard, changelog, Git history, or current dimension cards until after you send back the worksheets.

Packet: `docs/Inter-Rater-Pilot-Packet-2026-05.md`

---

## Longer Invite

I'm looking for one outside reader to help test whether my scoring system is actually reproducible.

The dashboard grades the federal Carney government's performance across policy areas using a published rubric. A fair critique is that even a transparent rubric can still depend heavily on editor judgment. To test that, I built a blind inter-rater pilot packet.

The packet covers three dimensions:

- one relatively clean evidence file
- one file where a modifier may matter
- one qualitative / ethics file where whole-letter-only grading applies

For each one, the packet gives you:

- construct definition
- raw metrics
- source links
- grade thresholds
- modifier rules
- deconfliction rules
- one-notch move triggers

It redacts:

- current published grade
- my rationale
- judgment-call notes
- active modifier selection
- critics / defenders prose
- changelog context

What I need back is the worksheet at the bottom of the packet filled out once per dimension: band pick, plus/minus treatment, active modifiers, final grade, confidence, and any notes where the rubric or evidence felt ambiguous.

This is not a partisan test. The useful feedback is: "I could / could not re-derive the grade from the packet and here is where the method was unclear."

Please do not check the live dashboard until after sending your answers.

---

## Claude / AI Review Prompt

Use this only to review the packet itself, not to replace a human rater.

```text
Please review this inter-rater pilot packet for leakage, completeness, and bias.

Goals:
1. Identify any place where the current published grade, editor rationale, judgment call, active modifier selection, or changelog context leaks into the supposedly blind packet.
2. Identify any evidence a rater would need to apply the rubric that is missing from the packet.
3. Identify any wording that nudges the rater toward the editor's likely grade rather than presenting raw evidence neutrally.
4. Identify whether the worksheet and results template are sufficient to compare the rater's grades to the published dashboard grades.

Do not grade the dimensions yourself. This is a packet QA review, not the pilot run.

Files:
- docs/Inter-Rater-Pilot-Packet-2026-05.md
- docs/Inter-Rater-Pilot-Results-Template-2026-05.md
- docs/Inter-Rater-Reliability-Protocol.md
```
