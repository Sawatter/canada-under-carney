---
name: source-verification
description: |
  Verify that the CURRENT content at each source URL still supports the claim
  dimensions.json attributes to it, the gap URL-liveness passes miss. Triggers
  on: "verify the sources", "content check the sources", "do the sources still
  say what we claim", "did Codex actually read the content", "re-run the cycle
  verification", "verify before we ship", "content drift check",
  "source-to-claim verification".
when_to_use: |
  When the question is "does URL X's current page still back the claim we cite
  it for?" Distinct from source-audit (three-component compliance) and
  source-addition (adding sources). Stops at content-vs-claim; does not move
  grades.
allowed-tools: Read Grep Glob Bash WebFetch WebSearch
---

# Source Verification

A 403/timeout is NOT permission to defer to "editor browser-verification," and
"browser-live per Codex" is URL-health, not verification. The deliverable is a
per-URL classification with captured quotes, not a pass-count.

## The fetch ladder
Work down it per URL until you have content or have exhausted every rung. Many
official sites block fetchers (canada.ca, statcan.gc.ca, fraserinstitute.org,
cbc.ca, nationalobserver.com).

1. **WebFetch direct.**
2. **WebSearch quote-extraction**, query the URL slug + the exact claim phrase
   (e.g. `site:canada.ca "output-based pricing" "CAD 110 per tonne"`). A snippet
   is PROVISIONAL: it can confirm a number ("confirmed via search") but never an
   exact sentence. Never label a snippet-only quote "verbatim" or a row
   "VERIFIED … OK"; mark "exact text not captured, editor pull pending."
3. **Wayback** (`web.archive.org/web/*/<url>`), verification ONLY; a Wayback
   URL never becomes the citation.
4. **Site scour**, if the live URL is dead, search the publisher's own site for
   the relocated article. Surface both URLs; never replace silently.
5. **Replacement publisher**, only if the live URL is genuinely dead AND the
   publisher dropped it (Step 4 exhausted). Match/exceed the authority tier
   (docs/Source-Authority-Map.md); replacing a T1 official with a T3 report
   weakens authority, last resort.
6. **Editor list**, after 1-5 fail: record the URL, the dimension/metric it
   backs, the exact quote needed, and the steps tried. Keep it small (≤10/round).

## Citation vs verification
If the live publisher URL exists but blocks fetchers, KEEP it as the citation
and use Steps 2-3 only to confirm what it said ("blocked-but-live" ≠ dead).
Wayback URLs are never cited. Only a genuinely-dead URL triggers Step 4 → 5.

## Per URL
1. **Identify the claim**, which metric/trigger/note/status it backs; quote the
   dashboard claim.
2. **Read the source**, capture a quote that supports / modifies / contradicts it.
3. **Classify:** OK · stale-refresh-candidate (editor decides) · URL-upgrade
   (auto after sanity check) · URL-replacement-candidate (editor decides) ·
   content-drift-with-grade-implications (flag, don't move grade) · dead.
4. **Document**, one row: URL, claim, quote, classification, recommended action.

## Output
`docs/<scope>-Verification-<date>.md`: header (purpose, dashboard state, ladder
steps used, scope discipline) · status table by classification · per-dimension
findings tables with quotes · roll-up (ship now / editor-decision / next-cycle)
· authority + scope footer.

## Rules
- No "browser-verifiable per Codex" deferrals, work the ladder to Step 6 or
  admit the URL wasn't verified.
- No silent URL replacements, every change goes in the doc with the comparison.
- No Wayback URLs in dimensions.json.
- No grade moves (→ grade-evaluation) and no new sources (→ source-addition)
  inside a verification pass.
- No frozen-surface edits (GPA math, POCKETBOOK_DIMS, thresholds, modifiers,
  dimension model).

## Codex cross-check (optional)
Before ship, hand the doc + bundle to Codex for verbatim-quote cross-check only,
it verifies your captured quotes, it doesn't redo the pass.
