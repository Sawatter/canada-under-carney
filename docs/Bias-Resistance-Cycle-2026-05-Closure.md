# Bias-Resistance Cycle 2026-05 — Closure Memo

**Purpose:** Single authoritative reference for what shipped in the May 2026 bias-resistance + accessibility cycle. Self-contained so any future reviewer (human, Claude, ChatGPT) can read this one file and get the full state without chasing conversation history.

**Scope:** Commits `c35dec6` → `e8be26b` (v5.26 → v5.45), May 16, 2026. The bias-resistance work arc itself ends at v5.45. v5.46 is the meta-commit publishing this memo. v5.47 is the verification-layer cleanup applied after ChatGPT's review of v5.46 found six issues with the original verification commands.

**Generated:** 2026-05-16, revised 2026-05-17 (v5.47) after verification-layer findings. Read the verification commands below as referring to current repo HEAD, not to the v5.45 arc endpoint specifically.

---

## TL;DR

The dashboard's May 2026 cycle built a per-cycle bias-resistance audit script and methodology, shipped all the editorial fixes the audit surfaced, completed the Tier 1 challenge-enabling hygiene (corrections, right-of-reply, citation), added a public Methodology FAQ, completed a full 12-dimension language audit, added Skeptic Path UI orientation with anchor navigation, scaffolded a perceived-bias survey methodology, scaffolded the annual Phase 2 foundational audit framework, and ran five iterative passes of accessibility work culminating in zero axe-core violations on the live deploy (automated checks only; manual assistive-tech testing still pending and tracked as future work). 20 commits in the bias-resistance arc, version bumps v5.26 → v5.45, plus v5.46 closure memo and v5.47 verification-layer cleanup.

---

## Quick verification (paste these to confirm)

The dashboard does not use git tags; refer to commits by hash. The version field in `meta.json` reflects current HEAD, which may be later than v5.45 if subsequent commits landed (e.g., this memo's own publication at v5.46 and the verification-fix at v5.47).

```bash
# Repo state — the 20-commit bias-resistance arc
cd /Users/chrissawatsky/Downloads/canada-under-carney
git log --oneline c35dec6^..e8be26b               # inclusive 20-commit arc (c35dec6 IS included)
git log --oneline c35dec6^..e8be26b | wc -l       # expect 20
git show e8be26b --stat                           # see final arc commit's file impact
git show cfe675d --stat                           # see closure-memo commit's file impact

# Closure artifacts exist
ls docs/Bias-Resistance-Cycle-2026-05-Closure.md
ls docs/Bias-Resistance-Audit-2026-05.md docs/Bias-Resistance-Protocol.md
ls docs/Trust-And-Bias-Resistance-Plan-2026-05.md
ls docs/Corrections-Policy.md docs/Right-Of-Reply.md docs/Perceived-Bias-Survey.md
ls docs/Accessibility-Audit-2026-05.md docs/accessibility/axe-v5.46.json
ls docs/Foundational-Methodology-Audit-2026.md

# Repo version (will reflect HEAD; expect 5.46 or later)
node -e "console.log(require('./src/data/meta.json').version)"

# Build verification
npm run test:data                                 # dimension schema invariants
npm run build                                     # production build
node scripts/audit-bias-resistance.mjs            # re-run audit; expect 7 of 12 flagged with documented residuals

# Live deploy version verification
# The dashboard is a React SPA; the version is in the JS bundle, not the static HTML.
# Easiest: open https://sawatter.github.io/canada-under-carney/ in a browser and look
# near the top of the page header. Or run the JS bundle URL extraction:
HOMEPAGE=$(curl -s https://sawatter.github.io/canada-under-carney/)
BUNDLE_PATH=$(echo "$HOMEPAGE" | grep -oE 'assets/index-[^"]*\.js' | head -1)
curl -s "https://sawatter.github.io/canada-under-carney/$BUNDLE_PATH" | grep -oE '"version":"5\.[0-9]+"' | head -1
# expect "version":"5.46" (or whatever is currently deployed)

# Live accessibility verification
# Saved snapshot: docs/accessibility/axe-v5.46.json (0 violations, 24 passes, 1 incomplete)
# To reproduce live, follow howToReproduce in that JSON file.
cat docs/accessibility/axe-v5.46.json | head -20
```

---

## Commit log (full arc)

| Commit | Version | Date | Scope |
|---|---|---|---|
| `c35dec6` | v5.26 | 2026-05-16 | Add bias-resistance audit and source-check automation |
| `55eb842` | v5.27 | 2026-05-16 | Thread challenge sources into Major and Climate metrics (Fix 1a) |
| `7b4136a` | v5.28 | 2026-05-16 | Add PBO challenge sources to Immigration and Defence & Trade (Fix 1b + 1c) |
| `b746abb` | v5.29 | 2026-05-16 | Attribute defender perspectives to named sources on five dimensions (Fix 3) |
| `b06e9de` | v5.30 | 2026-05-16 | Surface event-driven trigger convention; document Immigration modifier absence (Fix 4 + 5) |
| `e5099b1` | v5.31 | 2026-05-16 | Close out bias-resistance audit doc and untrack raw output |
| `b583e8c` | v5.32 | 2026-05-16 | Draft Bias-Resistance Protocol v1.0 |
| `607161b` | v5.33 | 2026-05-16 | Ship Tier 1 challenge-enabling hygiene: corrections, right of reply, citation format |
| `4ff8f82` | v5.34 | 2026-05-16 | Add Methodology FAQ to the Rubric tab |
| `ab4853b` | v5.35 | 2026-05-16 | Complete full 12-dimension language audit |
| `edbf0a7` | v5.36 | 2026-05-16 | Add Skeptic Path orientation to dimension drawers |
| `ae0c09c` | v5.37 | 2026-05-16 | Draft perceived-bias survey methodology and link from About + FAQ |
| `e179a8d` | v5.38 | 2026-05-16 | Add Phase 1 accessibility audit (code-inspection pass) |
| `29d8f47` | v5.39 | 2026-05-16 | Scaffold Phase 2 foundational methodology audit framework |
| `7b5edc7` | v5.40 | 2026-05-16 | Reconcile bias docs and fix keyboard access (DimensionCard) |
| `c729576` | v5.41 | 2026-05-16 | Accessibility audit Phase 2: contrast fix, skip-link, drawer-focus clarification |
| `4b34f10` | v5.42 | 2026-05-16 | Codify viewport-check rule in Bias-Resistance Protocol |
| `e95d38f` | v5.43 | 2026-05-16 | Align inline text colors to WCAG AA tokens after axe-core run |
| `aabb6fa` | v5.44 | 2026-05-16 | Skeptic Path orientation gains anchor-jump navigation |
| `e8be26b` | v5.45 | 2026-05-16 | Final contrast cleanup after v5.44 deploy verification |

20 commits total.

---

## What shipped per track

### Track 1 — Bias-resistance audit (operational)

- `scripts/audit-bias-resistance.mjs` (new in v5.26, refactored across cycle). Mechanical Phase 1 audit covering source-family distribution, trigger symmetry, critics/defenders symmetry, modifier inventory, attention-bias. 10-bucket source-family taxonomy with family-10 threshold-source exception. Counts metric-attached sources as grade-moving (not just trigger-attached).
- `docs/Bias-Resistance-Audit-2026-05.md` (new in v5.26, reconciled in v5.31, v5.40). Per-cycle audit doc. Currently a closure memo with all 4 Phase 1 fixes shipped + per-finding tagging real-risk vs script-artifact + next-steps reframed to follow-on work.
- Five named fixes across four approval groups shipped (the audit doc's renumbering grouped Fix 1b + 1c as related source additions, and Fix 4 + 5 shipped together in v5.30):
  - **Fix 1a** (v5.27): threaded existing Fraser/Angus Reid challenge into Major Projects metrics; CCI/IISD/CBC/Conversation into Climate & Environment metrics.
  - **Fix 1b + 1c** (v5.28, one commit): added PBO Demographic Implications to Immigration grade-moving chain; added PBO Major Capital Priorities to Defence & Trade grade-moving chain.
  - **Fix 3** (v5.29): attributed defender perspectives to named institutional sources on 5 dimensions (PBO, OECD, CCI, CER, Department of Finance, Treasury Board Secretariat, CMHC, Smart Prosperity Institute).
  - **Fix 4 + 5** (v5.30, one commit): documented event-driven trigger convention in Scoring-Rubric-v1.1.md (Fix 4); documented Immigration's modifier absence as intentional per the grade-softening principle (Fix 5, conservative direction).

### Track 2 — Methodology infrastructure

- `docs/Trust-And-Bias-Resistance-Plan-2026-05.md` — planning floor doc, drafted before any fix shipped, revised iteratively as discipline emerged.
- `docs/Bias-Resistance-Protocol.md` (new in v5.32, augmented in v5.41 and v5.42). Operational rules:
  - The decision rule (challenge-enabling vs polish guardrail)
  - The Skeptic Test as operational success criterion
  - 11 principles with built/partial/new status
  - 3 emergent disciplines: must-have-prior-substantive-view, thread-existing-first, modifiers-don't-soften
  - Pre-cycle checklist (now includes drift-check from v5.41 and viewport-check from v5.42)
  - Per-grade-move party-symmetry checklist line
  - Public-surface backlog
  - Audit re-run cadence
- `docs/Foundational-Methodology-Audit-2026.md` (new in v5.39). Annual-cadence framework scaffolded. Three foundational questions (dimension choice, POCKETBOOK weighting, promise selection) framed for first scheduled pass (2026 Q4 / 2027 Q1).

### Track 3 — Tier 1 challenge-enabling hygiene

- `docs/Corrections-Policy.md` (new in v5.33). What gets corrected vs re-graded, `type: "correction"` changelog schema, response timeline, what corrections do NOT do.
- `docs/Right-Of-Reply.md` (new in v5.33). Channel for ministries / agencies / watchdogs / named third-party analysts cited in any dimension's evidence chain. Review process, what gets reflected publicly, limits and scope.
- About.jsx (modified in v5.33). Cite As block + structured Corrections and Right of Reply block replacing old one-line GitHub Issues note.

### Track 4 — Public surfaces

- Methodology FAQ inline in `src/components/Methodology.jsx` (new in v5.34). 8 common bias-related questions preempted with published-rule answers.
- Skeptic Path orientation callout in `src/components/DimensionCard.jsx` (new in v5.36, upgraded in v5.44 with smooth-scroll anchor jumps to 5 drawer sections).
- `docs/Perceived-Bias-Survey.md` (new in v5.37). Two-question survey methodology (comprehension test + party self-ID), pass criteria, mechanism options. Activation editor-only.

### Track 5 — Accessibility audit (full arc)

Iterative tightening across 5 commits as each pass found things the previous missed:

- v5.38 (`docs/Accessibility-Audit-2026-05.md`): code-inspection pass identified 7 findings.
- v5.40: DimensionCard wrapper keyboard fix (Finding 1, high-severity); audit-doc reconciliation found Findings 3 and 5 already fixed in code; mobile scoreboard overflow caught during viewport check.
- v5.41: computed contrast ratios for all grade chips; 7 of 12 failed AA; darkened foregrounds in `src/constants.js` GRADES. Added skip-to-content link to Dashboard.jsx. Clarified Finding 4 per WAI-ARIA disclosure pattern (no code change needed).
- v5.43: live axe-core 4.10 run against deployed v5.41 surfaced 8 additional contrast violations in inline-styled components. Aligned inline text colors to documented --text-muted token (#666). Updated link blue #1a73e8 → #1565c0. Caught the OLD C-range #e68a00 in two hardcoded uses (ScoreboardHeader Promises conditional + About Evaluation Period header).
- v5.45: post-v5.44 axe-core run on deployed v5.44 found one remaining #888 violation in ApprovalSignal.jsx (the '/ X%' disapproval span). Fixed plus three more #999/#aaa instances surfaced during the follow-up grep.

**Live axe-core result on v5.46 (reproducible artifact):** 0 violations, 24 passes, 1 incomplete, 37 inapplicable. The incomplete category contains 15 TrendArrow glyph spans correctly carrying aria-label / role="img" / title (axe limitation for pure-glyph content, not a real violation). Full snapshot saved at [`docs/accessibility/axe-v5.46.json`](accessibility/axe-v5.46.json) including reproduction instructions. v5.45 produced the same numerical result; this saved artifact uses v5.46 because that was the deploy state when the snapshot was captured.

**Important caveat:** the axe-core result reflects automated accessibility checks only. Manual assistive-tech testing (screen readers — NVDA, JAWS, VoiceOver — and real keyboard-only navigation by a user with motor disabilities) has not been done. Closing axe-core does not equal closing the accessibility track. Real assistive-tech testing remains future work and is tracked in `docs/Accessibility-Audit-2026-05.md` recommendations.

### Track 6 — Source automation (predecessor work, May 13)

Shipped before the bias-resistance arc began but tied to the same cycle. Five commits: pollster RSS scrapers (Abacus / Léger / Angus Reid), excluded-pollster RSS, policy/journalism RSS, recurring source checklist updates, and nine broken-URL repairs from the link-rot scan. Closed automation backlog items 5 and 7 from `docs/Recurring-Source-Checklist.md`.

---

## Current state matrix

| Item | Status | Detail |
|---|---|---|
| Bias-resistance audit script | DONE | `scripts/audit-bias-resistance.mjs`, re-runnable |
| Audit doc + closure memo | DONE | `docs/Bias-Resistance-Audit-2026-05.md` |
| Bias-Resistance Protocol v1.0 | DONE | `docs/Bias-Resistance-Protocol.md` |
| All 5 named Phase 1 audit fixes across 4 approval groups | DONE | v5.27–v5.30 |
| Corrections Policy | DONE | `docs/Corrections-Policy.md` |
| Right-of-Reply | DONE | `docs/Right-Of-Reply.md` |
| Citation format | DONE | About.jsx Cite As block |
| Methodology FAQ | DONE | Inline in Methodology.jsx Rubric tab |
| Full 12-dimension language audit | DONE | Section 4 of audit doc, clean pass |
| Skeptic Path orientation | DONE | Drawer callout + smooth-scroll anchor jumps |
| Accessibility audit | DONE (automated) | 0 axe-core violations on live deploy; manual assistive-tech testing pending |
| Perceived-bias survey methodology | DONE | `docs/Perceived-Bias-Survey.md` + About / FAQ entry points |
| Phase 2 foundational audit | SCAFFOLDED | `docs/Foundational-Methodology-Audit-2026.md`, annual cadence |
| Perceived-bias survey activation | OPEN (editor-only) | Requires GitHub Discussions enable OR Buttondown form setup |
| Phase 2 first substantive pass | OPEN (annual) | 2026 Q4 / 2027 Q1 |
| Single-pane Skeptic Path UI restructure | OPEN (future) | Annotation approach (v5.36 + v5.44) is the minimum-viable closure |
| Full WCAG-AA conformance statement doc | OPEN (Tier 3) | All actionable a11y items closed; statement doc deferred |

---

## What requires editor action (cannot be shipped by Claude/Codex autonomously)

1. **Perceived-bias survey activation.** Enable GitHub Discussions on the repo OR create a Buttondown survey form. Methodology + entry points are shipped (v5.37); the activation is repo-settings or external-service work.
2. **Phase 2 first foundational audit.** Annual cadence. Three questions need editor reflection with reference to original methodology design intent. Framework scaffolded (v5.39).
3. **June 2026 monthly cycle.** Regular dashboard maintenance: run fetch script, run audit script, pull StatCan/IRCC values, review new PBO/policy/journalism RSS, apply pre-cycle checklist (now includes v5.41 drift-check and v5.42 viewport-check rules).

---

## What ChatGPT (or any reviewer) can verify directly

| Claim | How to verify |
|---|---|
| 20 commits shipped | `git log --oneline c35dec6..e8be26b` |
| Each commit's file impact | `git show <hash> --stat` |
| `docs/Bias-Resistance-Protocol.md` exists with 11 principles | Read the file or `grep "^| " docs/Bias-Resistance-Protocol.md \| wc -l` |
| Each new doc exists | `ls docs/Bias-Resistance*.md docs/Corrections-Policy.md docs/Right-Of-Reply.md docs/Perceived-Bias-Survey.md docs/Accessibility-Audit-2026-05.md docs/Foundational-Methodology-Audit-2026.md docs/Trust-And-Bias-Resistance-Plan-2026-05.md` |
| Methodology FAQ rendered | View [https://sawatter.github.io/canada-under-carney/](https://sawatter.github.io/canada-under-carney/), click Rubric tab, scroll to "Methodology FAQ" |
| Skeptic Path callout + anchor jumps | View same URL, click any dimension card to expand, see blue-bordered callout at top of drawer with 5 underlined links |
| Skip-to-content link | Tab once on the live page from a cold load, see "Skip to main content" link appear top-left |
| Grade chip contrast | Inspect any grade chip; computed colors documented inline in `src/constants.js` with ratios |
| Live deploy version | Open the live URL in a browser and look at the header; OR extract the JS bundle hash from the HTML and grep its version field (see Quick verification block above). The static HTML does NOT contain the version string. |
| Accessibility status | Saved snapshot at `docs/accessibility/axe-v5.46.json`; reproduction instructions inside that file. Last automated run: 0 violations, 24 passes, 1 incomplete (TrendArrow glyph false-positive). |
| All 4 Phase 1 audit fixes landed | Per-commit messages name the fix; `git show 7b4136a b746abb b06e9de` |

## What ChatGPT cannot verify directly without tools

- The actual accessibility experience for screen reader / keyboard / low-vision users (requires real assistive-tech testing).
- Whether the methodology FAQ answers will resonate with a real partisan-leaning reader (the perceived-bias survey is the test for this, not yet activated).
- Whether the Phase 2 foundational questions have defensible answers (annual cadence, requires editor reflection).
- Whether the dashboard's grades are correct (that's the methodology applied to evidence, not a bias-resistance question).

---

## ChatGPT closure-review prompt (ready to paste)

```
Please review the May 2026 bias-resistance + accessibility cycle closure. The full closure memo is in docs/Bias-Resistance-Cycle-2026-05-Closure.md in the canada-under-carney repo, also pasted below.

20 commits shipped (c35dec6 through e8be26b, v5.26 through v5.45). The closure memo includes:
- Quick verification commands you can run
- Full commit log with hashes and dates
- Per-track summary (audit / methodology / hygiene / public surfaces / accessibility / source automation)
- Current state matrix
- What requires editor action vs what's done
- What you can verify directly vs what needs tools

Please critique:

1. Is anything in the closure memo overstated or understated relative to what actually shipped? Pick at least one specific commit hash and verify its claim against the linked file or GitHub state.

2. The accessibility track took five passes (v5.38 audit → v5.40 keyboard fix → v5.41 contrast + skip-link → v5.43 broader contrast cleanup → v5.45 final cleanup). Each pass found things the previous missed. Is this iterative tightening healthy, or does it indicate the audit script should have shipped with a programmatic axe-core integration from the start?

3. The Skeptic Path got two passes (v5.36 prose orientation + v5.44 anchor jumps). The closure marks this as DONE with a "single-pane restructure remains future work" caveat. Is annotation enough, or does the original Section 7 finding require structural restructure to truly close?

4. Three open items are flagged "editor-only" or "annual cadence" — survey activation, Phase 2 first pass, June 2026 cycle. Of these, is the Phase 2 first pass appropriately deferred to 2026 Q4 / 2027 Q1, or should it run sooner given how active the methodology review has been this cycle?

5. The "what ChatGPT cannot verify" section names four categories. Is anything missing from that list? Particularly: things you'd want to verify but the dashboard's architecture or your tools prevent it.

6. June 2026 will be the first cycle running under the new Bias-Resistance Protocol with its updated pre-cycle checklist (drift-check + viewport-check rules added this cycle). Is there any cycle-1-of-the-new-protocol risk worth pre-flagging?

Constraint: critique the closure. Do not write new artifacts. After your review, the editor decides whether to ship any follow-on commits this cycle vs hold until June.
```

---

## Process notes

- This closure memo is the durable artifact. Future reviewers (Claude, ChatGPT, human) reading the repo cold should read this one file first, then drill into individual docs only as needed.
- The bias-resistance audit script is re-runnable any time: `node scripts/audit-bias-resistance.mjs`. Output is gitignored but reproducible from current `dimensions.json` and `changelog.json`.
- The next cycle's closure memo (`docs/Bias-Resistance-Cycle-2026-06-Closure.md`) should reference this one as the prior baseline and document what changed.
- Versioning: this doc lives at v1.0 as of v5.46 commit. If material updates land, bump to v1.x with notes.

## Version history

- **v1.0 (2026-05-16, v5.46):** Initial closure memo for the May 2026 bias-resistance + accessibility cycle. Covers commits c35dec6 → e8be26b (v5.26 → v5.45). 20 commits, 6 new docs, 1 new script, 5 component patterns. Automated axe-core checks clean on live; manual assistive-tech testing remains future work.
- **v1.1 (2026-05-17, v5.47):** Verification-layer cleanup after ChatGPT review of v1.0 found six issues. Fixed: inclusive git log range syntax (`c35dec6^..e8be26b` not `c35dec6..e8be26b`); removed broken v5.* tag references (no git tags exist); corrected live-version verification (SPA version is in JS bundle, not static HTML — switched to a bundle-grep approach); saved axe-core JSON snapshot to `docs/accessibility/axe-v5.46.json` so the accessibility claim is now reproducible from the repo; fixed TL;DR "two passes" → "five iterative passes" of accessibility work; clarified "4 Phase 1 fixes" → "five named fixes across four approval groups"; softened "WCAG AA aligned across dashboard" to "automated axe-core checks clean; manual assistive-tech testing pending."
