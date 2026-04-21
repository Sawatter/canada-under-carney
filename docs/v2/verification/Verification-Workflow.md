# Verification Workflow

- **Purpose:** Define the step-by-step monthly verification process. This is the workflow — the sequence of operations. The rules are in Source-Verification-Protocol.md.
- **Status:** Draft — first version for pilot cycle use.
- **Last updated:** 2026-04-15
- **Depends on:** Source-Verification-Protocol.md (rules), Evidence-Pack-Manifest-Template.md (manifest structure), Verification-Ledger-Template.md (ledger structure), MONTHLY-UPDATE-GUIDE.md (v1 process), Shadow-Run-Workflow.md (v2 process)
- **Used by:** MONTHLY-UPDATE-GUIDE.md (verification integrates into the existing monthly cycle)

---

## Where verification fits in the monthly cycle

```
EXISTING v1 CYCLE                    VERIFICATION LAYER              v2 SHADOW CYCLE
─────────────────                    ──────────────────              ────────────────
Step 1: Data fetch ──────────────►   Step V1: Evidence-pack assembly
                                     Step V2: Source accessibility check
                                     Step V3: Value extraction
                                     Step V4: Claim normalization
                                     Step V5: Verification
                                     Step V6: Anti-loss check
                                     Step V7: Human review routing
                                     Step V8: Scoring-safe handoff ──►  v1 scoring
                                                                        v2 shadow scoring
Step 6: Deploy                       Step V9: Ledger close-out
```

**Key constraint:** Verification runs AFTER data fetch and BEFORE any scoring decisions. The evidence pack must be assembled and verified before grades are assigned or changed.

---

## Step V1: Evidence-Pack Assembly (7 minutes)

**When:** After running `python3 scripts/fetch-data.py` and before reviewing any evidence.

**Actions:**

1. Copy `Evidence-Pack-Manifest-Template.md` to `docs/v2/verification/evidence-packs/[YYYY-MM]-manifest.md`.
2. Set the cutoff date and time.
3. **Primary assembly — sources that MUST be checked this cycle:**
   - All sources in the fetch report (`scripts/output/fetch-report.txt`) — these are the automated data pulls that may have new values.
   - Any Tier 1 source with a known release date in this cycle's window (StatsCan scheduled releases, PBO publications, CMHC monthly).
   - Any source directly relevant to a pilot dimension (Immigration, Housing Supply, Fiscal Health, Defence, Trade Diversification).
   - Any source relevant to a dimension where a grade change is being considered.
   - Add each to the manifest's Included Sources table with all fields.
4. **Secondary scan — check only when relevant:**
   - Centre & Mainstream Press: check only if a dimension is moving or a major policy event occurred this cycle.
   - Right & Centre-Right interpretation: check only if a dimension under review lacks contradicting evidence (EFCSN requires presenting both sides for central claims).
   - Independent Policy & Academic: check only if a new publication appeared relevant to a pilot dimension.
   - Specialist Supplements: check only if their specific file moved (climate, environment, Indigenous).
   - If nothing relevant is found in a secondary scan, no manifest entry is needed. The full monitoring stack remains the UNIVERSE of possible sources, but the evidence pack for any given cycle only includes sources that are actually relevant to this cycle's scoring decisions.
5. For any source considered but excluded, add a row to the Excluded Sources table with reason.
6. Sign the manifest header.

**Output:** Completed evidence-pack manifest scoped to this cycle's actual scoring needs. No source outside this manifest is grade-moving for this cycle.

**Decision rule:** If a critical Tier 1 source is expected but has not yet been published (e.g., PBO spring report), note it in the manifest as "expected, not yet available." Do not delay the cycle. If it arrives before publication, it may be added as a post-cutoff amendment.

---

## Step V2: Source Accessibility and Link Check (5 minutes)

**When:** Immediately after evidence-pack assembly.

**Actions:**

1. For each source in the manifest, confirm the URL is accessible.
2. For each StatsCan table: confirm the table loads and the "Last updated" date matches expectations.
3. For each PDF source (PBO, CMHC reports): confirm the PDF is downloadable and the version matches the manifest entry.
4. For any broken or inaccessible URL:
   - Attempt to find an alternative URL (e.g., new location after site reorganization).
   - If found: update the manifest URL.
   - If not found: move to Excluded Sources with reason "URL inaccessible."
   - Any claim depending on an inaccessible source gets claim status = Unverifiable.

**Output:** All manifest URLs confirmed accessible, or inaccessible sources flagged and excluded.

---

## Step V3: Value Extraction (10 minutes)

**When:** After source accessibility is confirmed.

**Actions:**

For each source in the manifest that serves a pilot dimension or a dimension with new evidence:

1. Navigate to the source URL.
2. Locate the specific metric value.
3. Record VERBATIM in the verification ledger:
   - **Source label** — copy-paste the exact label from the source. Do not paraphrase.
   - **Source value** — copy-paste the exact numeric value with unit. Do not round or transform.
   - **Reference period** — the exact time period the value covers.
   - **Revision status** — preliminary / revised / final / unknown.
4. Record the access date.

**Critical rule: Do not interpret, transform, or summarize at this step.** This step is pure extraction. Interpretation and transformation happen later.

**For automated data (StatsCan API, IRCC CSV):**
- The fetch script extracts values automatically. Verify the extracted value matches the source table by spot-checking at least the primary metric for each pilot dimension.

**For manual data (ratings, Ethics Commissioner, OBPS rate):**
- Navigate to the source directly. Extract and record the verbatim value.

**Output:** Verification ledger populated with verbatim source labels, values, reference periods, and revision statuses for all relevant claims.

---

## Step V4: Claim Normalization (10 minutes)

**When:** After value extraction.

**Actions:**

1. Review each piece of evidence and break it into atomic, verifiable claims.
   - One claim per ledger row.
   - Each claim must be self-sufficient (understandable standalone).
   - Each claim must contain exactly one verifiable assertion.
   - See Verification-Ledger-Template.md "Claim Normalization Guide" for split/don't-split examples.

2. For each atomic claim, assign an evidence role:
   - `primary` — this claim is grade-moving for a specific dimension and lens.
   - `secondary context` — this claim provides context but does not directly move a grade.
   - `blocked` — this claim is excluded from a dimension per deconfliction rules or lens assignment.

3. For interpretive claims (comparisons, characterizations, superlatives, causal attributions):
   - Flag as requiring two-source corroboration per Source-Verification-Protocol.md Section 5b.
   - If only one source supports the claim, status = Unsupported until a second source is found or the language is revised.

**Output:** Ledger populated with atomic, normalized claims, each tagged with an evidence role.

---

## Step V5: Verification (10 minutes)

**When:** After claim normalization.

**Actions:**

For each atomic claim in the ledger:

### 5a. Match check

Compare the source value (verbatim) against the dashboard value:

```
Source label matches dashboard label?
├── Yes → Source value matches dashboard value?
│         ├── Yes → Match status = exact match
│         └── No → Is there a documented transformation?
│                   ├── Yes, reproducible → Match status = transformed-valid
│                   └── No → Match status = mismatch → BLOCKED
└── No → Is the difference substantive?
          ├── No (minor formatting) → Acceptable, note in ledger
          └── Yes (different concept) → Match status = mismatch → BLOCKED
```

### 5b. Claim status assignment

```
Match status = mismatch?
├── Yes → Claim status = Mismatch → BLOCKED
└── No → Is the source accessible?
          ├── No → Claim status = Unverifiable → BLOCKED
          └── Yes → Is the source stale?
                    ├── Yes, newer exists → Claim status = Stale → BLOCKED
                    ├── Yes, no newer exists → Claim status = Supported (with staleness note)
                    └── No → Does the claim go beyond what the source says?
                              ├── Yes (overclaim, causal leap, dropped qualifier)
                              │   → Claim status = Unsupported → BLOCKED
                              ├── No, but contradicts source
                              │   → Claim status = Contradicted → BLOCKED
                              └── No, fully entailed
                                  → Is this grade-moving for this dimension?
                                    ├── Yes → Claim status = Supported
                                    └── No (deconflicted or context)
                                        → Claim status = Context-only
```

### 5c. Verification certainty assignment

After assigning match status and claim status, assign a verification certainty for each claim:

| Certainty | Assign when | Human review? |
|---|---|---|
| **High** | Source is canonical (StatsCan table, PBO report with ID, NATO annual report). Value is unambiguous. Label matches cleanly. | No |
| **Medium** | Source is clear but label requires interpretation, value required a documented transformation, or the claim is interpretive with two supporting sources. | No |
| **Low** | Source is ambiguous, label match is uncertain, multiple valid readings exist, or the verifier is unsure whether the claim is fully entailed. | **Yes — mandatory human review triggered** |

Record the certainty in the ledger's `Verification certainty` field. If certainty is `low`, set `Human review = yes — low certainty`.

### 5d. Transformation verification (if applicable)

If match status is transformed-valid:
1. Record the transformation method in the ledger.
2. Verify the calculation is reproducible (can a third party get the same result from the source value?).
3. If the transformation combines 2+ sources: flag for mandatory human review (Step V7).

**Output:** Every claim has a match status and claim status. Blocked claims are identified.

---

## Step V6: Anti-Loss Check (5 minutes)

**When:** After verification, before human review routing.

**Actions:**

For every claim with status Supported or Transformed-valid that will enter scoring:

1. Compare the dashboard text (rationale, card text, metrics display) against the source.
2. Check for dropped critical qualifiers using this checklist:

- [ ] Revision status preserved? (preliminary / revised / final)
- [ ] Time granularity preserved? (annual / monthly / quarterly)
- [ ] Jurisdictional scope preserved? (federal / general government / all levels)
- [ ] Product definition preserved? (stores vs all food, SAAR vs annual actual, etc.)
- [ ] Measurement type preserved? (target vs actual, forecast vs observed)
- [ ] Implementation stage preserved? (announced vs authorized vs implemented)
- [ ] Seasonal adjustment preserved? (adjusted vs unadjusted)

3. If any critical qualifier is dropped in the dashboard text or scoring rationale:
   - The claim is **blocked** until the text is corrected to restore the qualifier.
   - Assign the specific claim status based on the nature of the loss (per Source-Verification-Protocol.md Section 12):
     - Meaning changed (target → actual, forecast → observed) → **Contradicted**
     - Scope or unit changed (monthly → annual, stores → all food, federal → general government) → **Mismatch**
     - Precision weakened without changing meaning (dropped "preliminary") → **Unsupported**
   - Note which qualifier was dropped and which status was assigned.

**Output:** All surviving Supported/Transformed-valid claims confirmed to preserve critical qualifiers.

---

## Step V7: Human Review Routing (variable — 0-15 minutes)

**When:** After anti-loss check.

**Actions:**

1. Scan the ledger for all rows where `Human review = yes`.
2. For each flagged claim, apply the specific review procedure from Source-Verification-Protocol.md Section 13:

| Trigger | Review action |
|---|---|
| Paywalled source | Reviewer accesses source and confirms value. Logs confirmation. |
| Label/value mismatch on primary metric | Reviewer determines if mismatch is genuine error or acceptable variation. Logs resolution. |
| Ambiguous policy text | Reviewer selects the most defensible reading. Logs selected and alternative readings with reasoning. |
| Multi-source transformation | Reviewer confirms source compatibility and transformation validity. Logs confirmation. |
| Contradiction with dashboard | Reviewer determines whether dashboard needs correction or source is anomalous. Logs resolution. |
| Dynamic page, no versioning | Reviewer confirms content snapshot is adequate. Logs confirmation. |
| Verification certainty = `low` | Reviewer examines the specific ambiguity (label match, value interpretation, or multiple valid readings). Confirms or corrects claim status. Upgrades certainty to `high` or `medium`, or blocks the claim. Logs resolution. |

3. For each reviewed claim, update:
   - Claim status (if changed by reviewer)
   - Safe for scoring (if changed by reviewer)
   - Notes (log the review result with date and reviewer name)

4. **If the reviewer disagrees with the model's assessment:** The reviewer's judgment overrides. Log the disagreement and reason.

**Output:** All human-review items resolved. Ledger updated with review results.

---

## Step V8: Scoring-Safe Handoff (2 minutes)

**When:** After all verification steps are complete, before any scoring begins.

**Actions:**

1. Filter the ledger to claims where `Safe for scoring = yes`:
   - These are the ONLY facts that may enter v1 scoring or v2 shadow scoring.
   - Claims with any other status are excluded from grade decisions.

2. Verify the handoff:
   - [ ] Every primary claim for a pilot dimension has a completed ledger row.
   - [ ] No claim with status Blocked/Unsupported/Contradicted/Unverifiable/Stale/Mismatch is being used for scoring.
   - [ ] All mandatory human reviews are resolved.
   - [ ] The evidence-pack manifest is signed.

3. Proceed to v1 scoring (MONTHLY-UPDATE-GUIDE.md Step 3) and v2 shadow scoring (Shadow-Run-Workflow.md Step 3).

**Blocking rule:** If the handoff checklist has any unchecked items, scoring cannot proceed. Resolve the open items first.

**Output:** Clean separation between verified-safe facts (enter scoring) and everything else (context or blocked).

---

## Step V9: Ledger Close-Out (5 minutes)

**When:** After scoring is complete and before publication.

**Actions:**

1. Review the ledger for completeness:
   - [ ] Every grade-moving claim has a completed row.
   - [ ] Every claim status is assigned.
   - [ ] Every human review is resolved.
   - [ ] Match status is recorded for all primary claims.

2. Check for post-scoring corrections:
   - If any source was revised during the scoring process, log the revision as a post-cutoff amendment in the manifest.
   - If the revision changes a score, treat as a correction per Source-Verification-Protocol.md Section 14.

3. Save the completed ledger to `docs/v2/verification/ledgers/[YYYY-MM]-ledger.md`.

4. Save the completed manifest (with any post-cutoff amendments) to `docs/v2/verification/evidence-packs/[YYYY-MM]-manifest.md`.

**Output:** Completed audit trail for this cycle. Manifest + ledger are the permanent record.

---

## Handling Stale but Valid Lower-Frequency Data

Some sources publish less frequently than monthly. These require special handling:

| Source frequency | Example | Staleness rule | Handling |
|---|---|---|---|
| **Quarterly** | StatsCan population (17-10-0009-01), GDP per capita | Valid for 2 quarters after publication | Use with reference period noted. Carry forward from prior cycle if no new release. Flag as "carried forward, no new data" in ledger. |
| **Annual** | R&D spending, emissions, food insecurity, CMHC annual need | Valid for 18 months after publication | Use with reference period noted. Qualify as annual data in dashboard text. Flag as "annual data, last updated [date]" in ledger. |
| **Event-driven** | Credit ratings, Ethics Commissioner | Valid until superseded | Use until a new event occurs. No staleness flag needed unless the absence of events itself becomes informative. |

**Key rule:** Lower-frequency data that is the most recent available is NOT stale. It is valid with a frequency qualifier. Stale status is only assigned when a newer release exists and was not used.

---

## Connecting Verification to v1 and v2 Scoring

### v1 integration

The verification workflow replaces the informal source-checking in MONTHLY-UPDATE-GUIDE.md Steps 2-3. Instead of:
- "Visit the source URLs listed in the fetch report. If the number changed, update the value."

It becomes:
- "Run the verification workflow (Steps V1-V8). Only update values that pass verification. Log all changes in the ledger."

The rest of the v1 process (copy to live data, preview, deploy) is unchanged.

### v2 integration

The v2 shadow cycle (Shadow-Run-Workflow.md) starts at Step 3 (lens scoring). The verification workflow provides the input: a set of verified, claim-status-tagged, evidence-role-tagged facts that are safe for scoring.

The v2 shadow release log should reference the verification ledger for evidence provenance.

---

## Time Burden Estimate

| Step | Full verification (dimensions with new evidence) | Lighter review (held dimensions) |
|---|---|---|
| V1: Evidence-pack assembly | 7 min (scoped to relevant sources) | 3 min (confirm no new sources) |
| V2: Source accessibility check | 5 min | 2 min (spot-check) |
| V3: Value extraction | 10 min | 0 min (no new values) |
| V4: Claim normalization | 10 min | 0 min |
| V5: Verification | 10 min | 3 min (confirm prior claims still valid) |
| V6: Anti-loss check | 5 min | 0 min |
| V7: Human review routing | 0-15 min | 0 min |
| V8: Scoring-safe handoff | 2 min | 1 min |
| V9: Ledger close-out | 5 min | 2 min |
| **Total** | **54-69 min** | **11 min** |

### Minimum viable first-cycle scope

If the full verification process exceeds the 60-minute target:

**Must do (non-negotiable):**
- Evidence-pack manifest for all sources used
- Full verification for all grade-moving claims on pilot dimensions
- Full verification for any metric whose value changed
- Anti-loss check on dashboard text for changed claims
- Human review for any triggered mandatory cases

**Can defer to next cycle:**
- Full verification of held dimensions (lighter review is acceptable)
- Verification of context-only claims
- Verification of Promise Tracker entries (unless a promise status changed)
- Link check on non-pilot dimension sources

**Estimated time for minimum viable scope:** 35-45 minutes additional to the existing v1 + v2 workflow.
