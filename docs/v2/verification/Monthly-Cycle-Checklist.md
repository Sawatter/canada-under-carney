# Monthly Cycle Checklist

- **Purpose:** Step-by-step checklist for a normal monthly dashboard update. Print and check off.
- **Status:** Active — governs all cycles from May 2026 onward.
- **Last updated:** 2026-04-16
- **Depends on:** Monthly-Operations-Mode.md, Source-Verification-Protocol.md, Carry-Forward-Rules.md, Exception-Queue-Definition.md
- **Used by:** Editor (Chris) during each monthly cycle

---

## Pre-Cycle (5 min)

- [ ] Run `python3 scripts/fetch-data.py`
- [ ] Open `scripts/output/fetch-report.txt`
- [ ] Determine cycle type:
  - Did any primary metric change? → **Active cycle**
  - Did any event-driven trigger fire? → **Active cycle**
  - Are there new or escalated blocking exceptions (E2, or E4-if-grade-moving)? → **Active cycle**
  - Only low-severity carried-forward non-blocking exceptions (E1, E3, E5, E6, E7, E8) with no severity change? → **Quiet cycle** (review them during the quiet-cycle exception queue step)
  - None of the above? → **Quiet cycle**

---

## Quiet Cycle Path (20-30 min total)

### Evidence Pack (3 min)
- [ ] Create minimal manifest: `docs/v2/verification/evidence-packs/[YYYY-MM]-manifest.md`
- [ ] Note: "No new sources beyond carry-forward from [prior cycle]"
- [ ] Set cutoff date/time
- [ ] Sign header

### Changed-Source Scan (5 min)
- [ ] Spot-check 5-6 canonical source URLs (StatsCan tables, CMHC, PBO, NATO, Global Affairs)
- [ ] Confirm "last updated" dates have not changed since prior cycle
- [ ] Check for new event-driven items (Fitch, Ethics Commissioner, court decisions)
- [ ] If anything changed → **switch to Active Cycle Path**

### Exception Queue Review (3 min)
- [ ] Open Exception-Queue-Definition.md
- [ ] Review any carried-forward low-severity items from prior cycle
- [ ] For each: confirm severity is still low → carry forward with note in manifest
- [ ] If any item's severity has escalated to blocking (E2 or E4-if-grade-moving) → **switch to Active Cycle Path**
- [ ] If all items remain low-severity and non-blocking → continue quiet cycle

### Hold Confirmation (2 min)
- [ ] Editor confirms: "I have reviewed the fetch report and source scan. No dimension has new evidence that would trigger a grade change."
- [ ] Log confirmation in manifest Notes

### Dashboard Update (10 min)
- [ ] Update `src/data/meta.json` dates
- [ ] Add changelog entry (can be: "No changes this cycle. All dimensions held.")
- [ ] Add history snapshot
- [ ] Preview locally: `npm run dev`
- [ ] Verify layout and data display

### Publish (3 min)
- [ ] `git add src/data/`
- [ ] `git commit -m "[YYYY-MM] monthly update — quiet cycle, all dimensions held"`
- [ ] `git push`

---

## Active Cycle Path (45-75 min total)

### Evidence Pack Assembly (7 min)
- [ ] Create full manifest: `docs/v2/verification/evidence-packs/[YYYY-MM]-manifest.md`
- [ ] Add all new sources from fetch report
- [ ] Add any new Tier 1 sources published since last cycle
- [ ] Add sources relevant to moved dimensions
- [ ] Set cutoff date/time
- [ ] Log excluded sources with reasons

### Source Accessibility Check (3 min)
- [ ] Confirm all manifest URLs are accessible
- [ ] Flag any broken/inaccessible URLs → exception queue

### Value Extraction (10 min)
- [ ] For each changed metric: pull verbatim value from source
- [ ] Record source label, source value, reference period, revision status
- [ ] Do NOT interpret or transform at this step

### Claim Normalization (5 min)
- [ ] Break new evidence into atomic claims (one per ledger row)
- [ ] Assign evidence role: primary / secondary context / blocked
- [ ] Flag interpretive claims for two-source corroboration

### Verification (10 min)
- [ ] For each new claim: match check (source vs dashboard)
- [ ] Assign claim status: supported / unsupported / transformed-valid / context-only / contradicted / unverifiable / stale / mismatch
- [ ] Assign verification certainty: high / medium / low
- [ ] Low certainty → mandatory human review

### Anti-Loss Check (5 min)
- [ ] For any changed dashboard text: check critical qualifiers preserved
  - [ ] Revision status (preliminary / revised / final)
  - [ ] Time granularity (annual / monthly / quarterly)
  - [ ] Jurisdictional scope (federal / general government)
  - [ ] Product definition (stores vs all food, SAAR vs annual)
  - [ ] Measurement type (target vs actual, forecast vs observed)
  - [ ] Implementation stage (announced vs authorized vs implemented)
  - [ ] Seasonal adjustment (adjusted vs unadjusted)

### Exception Queue Review (5 min)
- [ ] Review any carryover items from prior cycle
- [ ] Review any new exceptions flagged during this cycle
- [ ] Resolve, carry forward, or escalate each item

### Human Review (0-10 min, if triggered)
- [ ] Resolve any mandatory human review items (low certainty, paywall, ambiguity, multi-source transform)
- [ ] Log review result in ledger

### Scoring-Safe Handoff (2 min)
- [ ] Confirm: only Supported or Transformed-valid claims enter scoring
- [ ] Confirm: all mandatory human reviews resolved
- [ ] Confirm: no blocking exceptions remain

### Score/Hold Decision (5 min)
- [ ] For each dimension with new evidence: does the evidence cross a grade threshold?
  - Yes → propose grade change with rubric citation
  - No → hold at current grade
- [ ] For held dimensions: carry forward, no new assessment needed

### V2 Shadow Scoring (if applicable, 15-30 min)
- [ ] Run v2 shadow lens scoring per Shadow-Run-Workflow.md
- [ ] Only for dimensions with new grade-moving evidence
- [ ] Produce shadow release log

### Dashboard Update (10 min)
- [ ] Update changed metrics in `src/data/dimensions.json`
- [ ] Update rationale text for changed dimensions only
- [ ] Update `src/data/meta.json` dates
- [ ] Add changelog entry
- [ ] Add history snapshot
- [ ] Preview locally

### Final Publish Gate (3 min)
- [ ] Ledger saved to `docs/v2/verification/ledgers/[YYYY-MM]-ledger.md`
- [ ] Manifest signed
- [ ] Exception queue logged (even if empty)
- [ ] Preview confirms correct display
- [ ] `git add src/data/ docs/v2/verification/`
- [ ] `git commit -m "[YYYY-MM] monthly update — [summary]"`
- [ ] `git push`

---

## Post-Publish (2 min)

- [ ] Confirm GitHub Actions deploy completed
- [ ] Spot-check live site: grades, metrics, changelog
- [ ] Log any post-publish observations for next cycle
