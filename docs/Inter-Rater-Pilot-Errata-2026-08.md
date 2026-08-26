# Inter-Rater Pilot: Editor-Side Errata (2026-08)

**Status:** Editor-only. Do NOT send to the rater. Written 2026-08-01, before any
worksheets were received, after a four-way staleness check of the packet against
the current repo state (rules, sources, git history, and source-fix records).

**Purpose:** the packet was frozen 2026-06-07 and the dashboard has moved since.
This sheet records, in advance of results, which divergences are instrument
defects, which are rule drift, and how each affects scoring the rater's
worksheets against `Inter-Rater-Pilot-Results-Template-2026-05.md`. Writing this
down before the worksheets arrive is the point: it prevents post-hoc scoring
choices.

**Communication record:** the final packet was sent 2026-06-07 and the rater
acknowledged it 2026-07-24. The repo does not establish whether the later
clarification described below was sent or whether a return date was agreed.

**Headline verdict from the staleness check:** the frozen comparison is still
valid. No packet metric was ever found wrong-at-the-time (every later
re-verification matched: $78.3B, $17,572, ~10M, Fitch AA+/stable). Fiscal and
Affordability rules are substantively unchanged since the packet was sent.
Ethics rules changed twice after the snapshot, but both rule versions produce C
on the frozen evidence and the target grade is unchanged. No rebuild. No rule
updates to the rater (that would unblind the 2026-07-21 adjudication).

**Rater packet version confirmed:** the rater quoted the packet back in her
2026-07-24 email and it contains the "Do not substitute U.S. household
tariff-cost estimates" instruction, which only exists in the final ef1ea80
(2026-06-07) revision. She holds the final version. (The results template's
"Date packet sent" field was never filled; it is 2026-06-07.)

---

## 1. Affordability: known instrument defect on the coverage denominator

**The defect.** The 2026-06-06 QA cleanup replaced the unsourced tariff burden
figure with the MEI Canadian counter-tariff estimate ($548.97 by 2026-03-31 /
$91.50 for Apr-May 2025) but the coverage arithmetic was never re-derived.

- Packet-instructed arithmetic: $307 relief / (~$700 food-cost increase +
  ~$549 counter-tariff) = roughly 24-25% coverage = **C band** (20-40%).
- Snapshot-grade arithmetic (still in live `gradeBasis.activeModifiers`
  reasoning): $307 / $1,450-2,000 tariff burden = 11-14% = **D band**.
  Snapshot target grade: **D-**.

**Scoring rule, decided now:** if the rater returns C on Affordability with the
packet's arithmetic shown, score it as **instrument divergence, not rater
disagreement**. It does not count against rule-followability; it counts as a
packet-construction finding (the same class as her "no link in the packet"
finding). If she returns D/D-, note that she either used different arithmetic or
weighed the D-band's qualitative conditions; read field 7 before concluding.

## 2. Ethics: packet teaches the pre-July-21 rules, and contains the ambiguity that was later adjudicated

- The packet's C band says "no independent review has been published" while the
  packet's own metrics table records "ETHI report published; no Commissioner
  review". That tension is real, was in the packet at send time, and was
  resolved on 2026-07-21 (`Frozen-Rule-Adjudication-2026-07-21.md`): ETHI
  Report 5 counts as the published independent-review component, C band re-cut
  to "no PM-specific Ethics Commissioner review has found the screen adequate".
- Both old and new wording produce **C** on the frozen evidence (B requires a
  published Commissioner review finding adequate screening, which does not
  exist in the packet evidence).

**Scoring rule, decided now:** a rater who flags the C-band/ETHI tension in
field 7, or who quotes the packet's old D-row or down-trigger wording, is
applying the packet correctly. Expect a possible B/C/D deadlock note; treat it
as a known packet defect, already adjudicated in the direction that yields C.
Any Ethics agreement claims validation of the **snapshot-era** rubric text, not
the current component model.

## 3. Snapshot boundary: three releases landed inside the window but outside the snapshot

"Frozen to 2026-04-30" means the dashboard state as reviewed on that date, not
all evidence public by that date. Three releases were public inside the window
but not yet incorporated:

| Release | Public | In snapshot? | Band impact |
|---|---|---|---|
| Spring Economic Update ($66.9B deficit) | 2026-04-28 | No (incorporated 2026-05-13) | None: $78.3B → ~2.7% and $66.9B → ~2.3% both sit in the C deficit clause |
| PROOF 2025 (9.8M, a decline) | 2026-04-29 | No | None: 9.8M is still "elevated" |
| March food CPI 4.4% | 2026-04-20 | No | None |

Note: `Inter-Rater-Pilot-AI-QA-2026-06.md` line 30 mischaracterizes the SEU as
"post-snapshot"; it was inside the window. Stale-at-snapshot, not
wrong-at-snapshot. If the rater finds any of these by navigating source sites
and uses them, read field 7; the grades should not flip, but her citations may
differ from the packet's values.

## 4. Small live-link and figure caveats

- The CRA benefit page (modified 2026-06-08) now shows post-snapshot program
  news ("Starts July 2026... a 25% increase"). A later clarification was drafted
  with this line: if a live page shows different numbers than the packet, use
  the packet's. The repo does not establish that the clarification was sent.
- The $307/household grocery-benefit figure does not appear verbatim on the
  cited PBO HTML page (only the $12.4B aggregate); it is costing-derived.
  Re-certified with caveat in the July ledger.
- Budget 2025 itself states the deficit at 2.5% of GDP; the packet's computed
  working figure is ~2.7% from its own $2.94T denominator. Same C clause, but a
  rater who opens Budget 2025 may cite 2.5%.
- The packet-only MEI counter-tariff figure has never been re-verified since
  its 2026-06-06 insertion and sits outside the dashboard's recertification
  universe. Add to the monitoring surface if the packet is ever reused.
- The packet's fiscal one-notch triggers are the snapshot-era set; live
  triggers were rewritten (anchor-based) on 2026-05-13. Harmless: the
  worksheet never asks the rater to adjudicate triggers.
- Packet-vs-canon deltas present at send time (relevant only to clause-citation
  scoring): the packet's plus rule adds "and sits above the floor of that
  band"; its minus list carries a fourth condition ("negligible share of
  identified need") that canonically lives in the rubric's D- band.

## 5. What the packet's first real-world finding already is

The rater's 2026-07-24 email reported she could not find the dashboard link
"unless I'm missing something in the md file, which is a finding in itself."
The packet lists six things not to open but never states "this packet is
everything you need; no dashboard access is required or expected." Add that
line to any future packet revision. Logged here so it survives even if the
worksheets never arrive.

## 6. Comparison discipline

- Compare against `Inter-Rater-Pilot-Results-Template-2026-05.md` (Fiscal D,
  Affordability D-, Ethics C). Never against the live dashboard (Fiscal is now
  C after the 2026-05-13 move; both July reviews were holds on the other two).
- Temporal contamination is expected (the rater has lived through May-July
  news). The mitigation is the packet's own "use only this packet" rule plus
  the snapshot line drafted for the later clarification.
