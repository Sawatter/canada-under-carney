# v2 Decision Memo: Promise Delivery

**Question:** Should Promise Delivery remain a graded dimension in v2?

**Date:** April 2026
**Status:** Decision pending

---

## The Problem

Promise Delivery cannot identify a grade movement that is not already captured in another dimension. When NATO 2% delivers, Defence & Trade moves. When housing stalls, Housing Supply moves. When climate is reversed, Climate & Environment moves. Promise Delivery re-counts the same events through a commitment-fulfillment lens, but no independent information is added to the dashboard.

The diagnostic question — "what moves this grade that is not already captured elsewhere?" — has no clean answer.

---

## Option 1: Keep as Graded Dimension

### What it measures
The cumulative rate of commitment fulfillment (14 of 44 delivered, 12 stalled/abandoned).

### Double-counting risk
**High.** Every promise status change is mechanically linked to a home dimension. The same evidence scores twice — once as policy performance, once as promise accountability. This inflates the weight of events that happen to have been promised vs. events that were not.

### Readability
Good. "14 of 44 delivered" is instantly understandable.

### Accountability value
Real. Promise tracking is a legitimate democratic accountability function. Voters care whether the government did what it said.

### GPA integrity
**Poor.** The dimension is not independent. It is a derivative of the other 11 dimensions. Including it in the GPA means events that were promised are effectively weighted more heavily than events that were not. A government that makes fewer promises would score higher on Promise Delivery than one that makes ambitious commitments — which creates a perverse incentive.

### Monthly maintenance
Moderate. Every status change in a home dimension must be checked against Promise Delivery for consistency. This creates a coordination burden.

### Assessment
Keeping it as graded means accepting permanent double-counting and GPA contamination. The accountability value is real but the measurement integrity cost is too high for a scored dimension.

---

## Option 2: Convert to Ungraded Promise Tracker Only

### What it measures
Same information — 44 commitments tracked by status — but displayed as an accountability tool, not a GPA-contributing grade.

### Double-counting risk
**Eliminated.** The tracker exists as a reference layer. It does not feed into either the Household Impact or Full Policy Audit GPA. Events are scored once, in their home dimension.

### Readability
**Better.** The Promise Tracker tab already exists and is one of the dashboard's strongest features. "14 of 44 delivered" remains prominently displayed in the header. Nothing is lost visually.

### Accountability value
**Preserved.** The tracker still shows every promise, its status, its evidence, and its durability classification. Readers can still assess whether the government kept its word. The function is identical — only the GPA contribution is removed.

### GPA integrity
**Improved.** The dashboard drops from 12 to 11 graded dimensions. The GPA reflects only independent constructs. No derivative dimension contaminates the average.

### Monthly maintenance
**Reduced.** Status changes are tracked in the Promise Tracker but do not require a separate grade assessment, Red Team review, or release log entry. The coordination burden disappears.

### Assessment
This is the cleanest solution. It preserves 100% of the accountability value while eliminating 100% of the double-counting risk. The Promise Tracker tab is already the right vehicle.

---

## Option 3: Keep as Governance Note Outside the GPA

### What it measures
A qualitative summary of commitment fulfillment, published alongside the dashboard but not as a scored dimension or a structured tracker.

### Double-counting risk
Eliminated. Same as Option 2.

### Readability
Worse than Option 2. A governance note is less structured and less scannable than the existing Promise Tracker tab.

### Accountability value
**Reduced.** A note is easier to skip than a structured tracker with status tags, evidence, and expandable detail. The current Promise Tracker design is superior to a prose note.

### GPA integrity
Same as Option 2 — improved.

### Monthly maintenance
Lower than Option 2 but at the cost of less useful output.

### Assessment
Inferior to Option 2 on every dimension except maintenance. The Promise Tracker tab is a better product than a governance note.

---

## Recommendation

**Option 2: Convert to ungraded Promise Tracker.**

Remove Promise Delivery from the 12 graded dimensions. The dashboard becomes 11 dimensions contributing to the GPA. The Promise Tracker tab remains exactly as it is — 44 commitments, status tags, evidence, durability classifications, expandable detail. The header still shows "14/44 delivered." Nothing is lost to the reader. The GPA gains integrity.

### Strongest argument against this recommendation

The counter-argument is that removing a dimension from the GPA reduces the dashboard's ambition. Promise tracking is the feature that most distinguishes this dashboard from a simple policy scorecard. Demoting it to ungraded status could signal that accountability to commitments is less important than policy outcomes. A government could theoretically break most of its promises while scoring well on policy outcomes, and the GPA would not reflect the broken commitments.

### Response to the counter-argument

That concern is addressed by the Promise Tracker's continued prominence. It is the second tab on the dashboard. The 14/44 number is in the header next to the two GPAs. Readers can see it before they see any grades. The accountability signal is not weakened — it is decoupled from a measurement system it was contaminating. And the concern about a government scoring well on outcomes while breaking promises is actually an argument for separation: outcomes and commitment-keeping are different things, and they should not be forced into the same score.

### Timing

**Implement in v2.** Do not change the live dashboard yet. Run a shadow calculation showing the 11-dimension GPA alongside the current 12-dimension GPA for one cycle. If the difference is small (expected: minimal, since Promise Delivery at C+ is close to the current average), promote to live.

---

*Decision Memo v1.0 — April 2026*
