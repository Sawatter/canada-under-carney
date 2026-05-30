---
name: source-verification
description: |
  Use this skill to verify that the current content at each source URL in the
  Canada Under Carney dashboard still supports the claim that dimensions.json
  attributes to it. Triggers on: "verify the sources", "content check the
  sources", "do the sources still say what we claim", "did Codex actually
  read the content", "re-run the May cycle verification", "verify before we
  ship", "content drift check", "source-to-claim verification".
when_to_use: |
  Distinct from source-audit (which checks compliance with the three-component
  standard) and source-addition (which adds new sources). Use this skill when
  the question is "is the current page content at URL X consistent with the
  claim that dimensions.json says URL X supports?" This is the gap that pure
  URL-liveness passes miss.
allowed-tools: Read Grep Glob Bash WebFetch WebSearch
---

# Source Verification

## What this skill does

Closes the gap between URL-liveness ("does the URL load?") and content-claim
consistency ("does the current page still say what we cite it for?"). The
discipline this skill enforces is:

- WebFetch returning 403 or timeout is NOT permission to defer to "editor
  browser-verification." It is the start of a fetch ladder.
- "Browser-live per Codex" is NOT verification. It's URL-health.
- The deliverable is a per-URL classification, not a generic pass-count.

## When to skip

- If the task is genuinely just URL-liveness (does it 200, 4xx, 5xx?), use
  `source-audit` plus the link-rot script. This skill is heavier.
- If the task is to add a new source, use `source-addition`.
- If the task is to evaluate whether a grade should move, use
  `grade-evaluation`. This skill stops at "current content vs current claim";
  it does not move grades.

## Citation vs verification

Wayback is a verification tool only. Do not cite Wayback URLs in dimensions.json.
If the live publisher URL still exists but blocks automated fetchers, keep the
live publisher URL as the citation and use Wayback only to confirm what the
publisher page said. If the live URL is genuinely dead or moved, search the
publisher site for the relocated live URL before considering a replacement
source.

## The fetch ladder

For every URL in scope, work down this ladder until you have content or you
have exhausted every option. Do not stop at the first 403.

### Step 1 — WebFetch direct
Standard call. Many official Canadian sources block automated user-agents
(canada.ca, statcan.gc.ca, fraserinstitute.org, retailcouncil.org, cbc.ca,
nationalobserver.com, theglobeandmail.com all known blockers).

### Step 2 — WebSearch with quote-extraction query
When WebFetch returns 403 or timeout, construct a WebSearch query that
includes both the URL path slug AND the specific claim phrase the dashboard
attributes to it. Example:

> `site:canada.ca "output-based pricing" "CAD 110 per tonne" 2026`

WebSearch summarizes the live page content. Treat a search-snippet quote as
**provisional** — snippets are paraphrase or excerpt, not guaranteed source
text. Mark it as "verified via WebSearch (number confirmed, not exact
sentence)" unless the result opens to the actual source text. Do not label a
snippet-derived quote as "verbatim." When the underlying claim is a specific
number, the search confirms the number; when the claim is an exact sentence,
only direct source text or Wayback (Step 3) can confirm verbatim wording.
This is the single highest-leverage workaround for canada.ca/StatCan
blocking, but it confirms facts, not phrasing.

### Step 3 — Wayback Machine (verification only, not citation)
For URLs that fail both Step 1 and Step 2, try the Wayback Machine pattern
**to verify content only**:

> `https://web.archive.org/web/<YYYY>*/<original-url>`

Or, if the timestamp is unknown, the bare:

> `https://web.archive.org/web/*/<original-url>`

Wayback typically bypasses live-site blocking because it serves cached
snapshots. Note: Wayback content may be old; pick the snapshot date closest
to when the dashboard's claim was added.

**Critical:** Wayback URLs are read-only verification. They do not become the
citation in dimensions.json. If the live publisher URL still exists (even if
it blocks automated fetchers), the live publisher URL stays as the citation.
Wayback only confirms what that page said.

### Step 4 — Site scour for alternative URL
If steps 1-3 fail, search the source's own site for the article supporting
the same claim under a different URL pattern. Example:

> CBC `/news/politics/oil-and-gas-cap-budget-9.6966588` returns 403 →
> WebSearch finds CBC `/news/canada/calgary/carney-scraps-emissions-cap-
> danielle-smith-alberta-9.6966596` covers the same MOU, which is also
> publicly indexed.

Don't replace silently. Surface both URLs and recommend the swap.

### Step 5 — Replacement source from a different publisher
Only reach this step if the live URL is **genuinely dead or moved AND** the
publisher's own site does not host the relocated article under any URL
pattern (Step 4 exhausted). "Blocked-but-live" is not "unreachable" — for
those, the citation stays on the original publisher and verification uses
Steps 2-3.

If the original publisher's content is genuinely removed AND the claim is
load-bearing, find a different publisher whose article supports the same
specific claim. Verify the replacement's authority tier matches or exceeds
the original's per `docs/Source-Authority-Map.md`. Note: replacing a T1
official primary (canada.ca, statcan.gc.ca) with a T3 reporting source
weakens source authority and should be a last resort.

### Step 6 — Last-resort editor verification list
Only after steps 1-5 have all failed for a specific URL, add it to the
editor verification list with:

- The URL
- The specific dimension and metric/trigger it supports
- The exact quote or figure the dashboard attributes to it
- The fetch ladder steps already attempted (so the editor knows what didn't
  work)

This list is the editor's manual browser-pull task. It should be small —
ten URLs maximum across a single round.

## Verification discipline per URL

For each URL, regardless of which fetch-ladder step succeeded:

1. **Identify the claim.** Read dimensions.json. What metric, trigger,
   sourceNote, status text, rationale, or other field does this URL
   support? Quote the dashboard claim verbatim.
2. **Read the source content.** Capture a verbatim quote from the source
   that either supports, modifies, or contradicts the dashboard claim.
3. **Classify the finding.** One of:
   - **OK** — source content supports dashboard claim. Quote captured.
   - **Stale refresh candidate** — source content has updated values that
     should refresh the dashboard. No grade impact under current
     methodology. Editor decision required for the refresh.
   - **URL upgrade** — source publisher moved the article; URL needs swap
     but the underlying claim and authority tier are unchanged. Auto-apply
     after sanity check.
   - **URL replacement candidate** — current URL covers a different claim
     or date than what the dashboard attributes to it. Different URL from
     same or different publisher better supports the claim. Editor
     decision.
   - **Content drift, grade-implications** — current source content is
     materially different in a way that could move a grade trigger. Do
     not move the grade. Flag for editor methodology review.
   - **Dead** — no live or cached version exists at any URL on the
     publisher's site. Needs replacement source from a different
     publisher.
4. **Document.** Per-URL line in the verification doc with URL, claim,
   verbatim quote, classification, recommended action.

## Output

Produce a verification doc at `docs/<scope>-Verification-<YYYY-MM-DD>.md`
with:

- Header: purpose, run date, dashboard state at run time, fetch-ladder
  steps used, scope discipline (no grade moves, etc.)
- Verification status table — count by classification
- Per-dimension findings tables — one row per URL with verbatim quotes
- Roll-up: findings that ship this commit, findings queued for editor
  decision, findings queued for the next monthly cycle
- Authority and scope footer

## Rules

- **No "browser-verifiable per Codex" deferrals.** That phrase indicates
  the discipline was skipped. Either work the fetch ladder all the way to
  Step 6 or admit the URL was not verified in this pass.
- **No "not re-fetched in this pass" entries** unless explicitly justified
  (e.g., a metadata-stable open-data catalog page that was verified in the
  previous cycle).
- **No silent URL replacements.** Every URL change must appear in the
  verification doc with the reason and the verbatim content comparison.
- **No Wayback URLs in dimensions.json.** Wayback is a verification tool,
  not a citation surface. If the live publisher URL still exists (even
  blocking fetchers), keep the live URL as the citation. If the live URL
  is genuinely dead, search the publisher's own site for the relocated
  article before considering a different-publisher replacement.
- **No grade moves during a verification pass.** This skill stops at
  content-vs-claim. Grade decisions go through `grade-evaluation` with
  party-symmetry check.
- **No new sources without `source-addition` discipline.** If verification
  surfaces a replacement candidate from a different publisher, that's a
  source addition that goes through that skill's protocol.
- **No frozen-surface edits.** GPA formulas, POCKETBOOK_DIMS, thresholds,
  modifiers, dimension model — all off-limits during verification.

## When the fetch ladder still fails

Some sources will resist every step. PDF binaries that WebFetch can't
parse, sites that block all known automated user-agents and aren't in
Wayback. These get the last-resort editor-list treatment.

The verification doc should be explicit: "These N URLs reached Step 6 of
the fetch ladder. Editor browser-verification with the specific quote
each one should support is the only remaining path."

Do not claim verification was performed on those URLs.

## Codex cross-check

After the verification pass is written but before ship, optionally hand
the doc plus the dashboard bundle to Codex for verbatim-quote cross-check.
Codex's role here is independent verification of the quotes Claude
captured, not to do the verification work itself. Use the structured
prompt pattern from `docs/AI-Verification-Methodology.md`.

## Example invocation

> "Verify Round 1 of the May cycle — Carbon Pricing, Immigration,
> Affordability, Defence, Climate. Run the full fetch ladder on every
> URL. No 'browser-verifiable per Codex' deferrals. Produce
> docs/May-Cycle-Verification-Pass-2026-05-25.md v2.0 with per-URL
> verbatim quotes."
