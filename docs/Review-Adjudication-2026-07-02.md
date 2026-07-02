# Review Adjudication - 2026-07-02

Claim-by-claim adjudication of two external reviews received together, per the operating loop: findings are claims to check, accepted findings become fixes or roadmap items, rejected findings get a logged reason.

**Review A - Perplexity deep product/methods/architecture review.** Based on `perplexity-bundle.md` (a repo bundle) plus attempted live inspection. **Currency caveat: the bundle predates v5.148-v5.152**, and the reviewer's URL tool could not render the SPA, so several findings describe problems that were already fixed on the live site when the review arrived. Adjudicated against live v5.152 + repo HEAD.

**Review B - Comet live app-feel review** (from the prepared v5.152 prompt). VERDICT: MIXED. Current, evidence-labeled, and mostly on target. Its own environment could not test 375px, iOS, Android, or forced-colors; those are marked UNTESTED in the review and inherited below.

---

## Review A (Perplexity) adjudication

| # | Finding | Verdict | Action |
|---|---|---|---|
| F1 | Composite headline needs a visible weighting disclosure | **Stale - already live** | "Depends on weighting choices. Score math is below." ships on both composite cards since v5.148 (ScoreboardHeader.jsx:122,153). No action. |
| F2 | Defence & Trade tripwire inconsistent across three docs | **Stale - already reconciled** | Memo, dimensions.json, and CLAUDE.md carry the identical rule (opposite directions OR >1.0 GPA, two consecutive cycles); the memo's own 2026-06 note records the reconciliation. No action. |
| F3 | Flagship probation has no defined exit | **Stale, but exposed real drift** | The exit test (4 checks) was defined and executed in the July 2026 cycle (v5.150); probation exited. HOWEVER the check found leftover probation copy still in dimensions.json ("On probation" label, "Probation ends after the July 2026 cycle", stale modifierExpiry). **Accepted as drift**: completing the editor-approved exit edit in v5.153, with the frozen-surface test proving no GPA effect. |
| F4 | Governance stack self-referentially heavy | **Accepted in part - editor decision** | Real observation. Roadmap item: consolidation candidates (Trust-and-Bias plan, Methodology Audit Brief, Validation Sprint templates) into one "How Updates Are Made" doc. Requires editor approval; queued. |
| F5 | Two-decimal GPA = false precision | **Stale - already live** | Display is one decimal (`toFixed(1)`, Dashboard.jsx:179-180); live cards show 1.8 / 1.6. The suggested limitation note is covered by the v5.148 caveat. No action. |
| F6 | Promise tracker under-surfaced; add mini distribution bar | **Accepted** | Building in v5.153: segmented status bar on the Promises card using existing STATUS_COLORS, aria-labelled, descriptive not celebratory. |
| F7 | Inspectability gap; ship the whyNotHigher/whyNotLower pilot | **Accepted** | Building in v5.153 as the spec intends: authored, validated fields (grade-token + urgency validators, like verdictLine), piloted on Affordability Response only, rendered under the live threshold row. |
| F8 | Single-editor continuity risk (bus-factor doc, red team) | **Accepted - split** | Bus-factor handoff doc: queued for the next docs pass (draftable without the editor). Red-team reviewer invite: **editor gate** (external publication); queued in roadmap Next with the template already written. |
| - | Methodology tab is links, not an explanation | **Accepted** | Roadmap: 5-sentence plain explainer + "Limits of this model" moved to the top of the tab. |
| - | About lacks a funding/affiliation one-liner | **Accepted - editor gate** | One sentence, but it is a factual claim only the editor can make. Queued with suggested wording for editor confirmation. |
| - | V2 shadow docs consuming maintenance without user value | **Accepted** | Roadmap note: v2 architecture docs are frozen as design artifacts; not maintained between cycles; the inspectability pilot (F7) is the only v2 idea promoted. |

## Review B (Comet) adjudication

| # | Finding | Verdict | Action |
|---|---|---|---|
| M1 | Sidebar nav links lack a visible focus ring | **Plausible - hardened regardless** | A global `button:focus-visible` rule exists (index.css ~1801) that the review's component-CSS read missed, so the observation may be a browser-tool artifact. Explicit `.app-workspace-sidebar-link:focus-visible` rule added anyway + a real keyboard-Tab Playwright assertion so this is settled by CI, not debate. |
| M2 | Light and system theme states visually identical | **Accepted + semantics fix** | Confirmed; also found the icons used switch-target semantics (light showed a moon). Redesigned to current-state semantics: sun=light, moon=dark, half-circle=system. |
| M3 | Card grid height variance reads webby | **Accepted** | Verdict line clamped to 2 lines on the card face (full text in drawer); next-check line single-line ellipsis (full text in title attr); grid stretch checked. |
| L1 | Set-date chip could wrap mid-date | **Accepted (preventive)** | The review itself flagged its screenshot evidence as cursor overlap, not a bug; `white-space: nowrap` added anyway + a 375px assertion. |
| L2 | Approval poll table has bare "link" anchors | **Accepted** | Descriptive accessible names from pollster + field dates (WCAG 2.4.4). |
| L3 | Hero costs a scroll on every return visit | **Deferred - editor decision** | Real for returning readers, but a collapse-on-return needs a third client storage key and hides the trust frame that the v5.130 reader complaint proved matters on first contact. Queued in roadmap Later for an editor call after the next Comet pass. |
| L4 | Next-check text inconsistently scoped | **Accepted** | Same fix as M3 (single-line ellipsis). |
| L5 | Score-math / poll panels expand inline and push content | **Accepted - deferred to polish lane** | Correct observation; converting those panels to the drawer/overlay pattern belongs with the sheet/motion work in the polish release, not a quick patch. Roadmap Later, named. |
| - | Residual UNTESTED (375px, iOS, Android, forced-colors) | **Partially answered by CI** | The Playwright suite already covers 375px (bottom nav, drawers, overflow, deep-link focus) on every deploy; v5.153 adds the set-date-nowrap and sidebar-focus assertions. Physical iOS Safari, Android Chrome, and Windows forced-colors remain the three hand-checks only the editor can run. |

## What both reviews agreed on without knowing it

Both independently identified the promise tracker as undersold and the inspectability of grade reasoning as the highest-value trust surface. That convergence is why F6 and F7 ship now rather than queue.
