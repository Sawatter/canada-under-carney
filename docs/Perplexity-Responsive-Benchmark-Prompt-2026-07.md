# Perplexity Responsive Benchmark Prompt

**Status:** Historical input used for the v5.158 responsive decision
**Prepared:** 2026-07-19
**Target dashboard version:** v5.157
**Different-AI review:** Claude approved after three read-only passes on 2026-07-19

## Run Setup

Use Perplexity Deep Research for the external product research. Use the open
Comet tab or the rendered evidence pack for claims about the dashboard itself.
A raw fetch of the dashboard URL is not enough because it is a React app.

Provide these inputs when available:

- Live rendered dashboard: https://sawatter.github.io/canada-under-carney/
- The newest `tmp/review-evidence/<timestamp>/review-evidence.pdf`
- The matching `tmp/review-evidence/<timestamp>/manifest.md`
- A fresh `tmp/perplexity-bundle.md` for tracked repo context

If the rendered tab and repo files show different versions, stop and report the
mismatch. Do not review an older dashboard as if it were v5.157.

## Copy And Paste Prompt

```text
ROLE:

Act as a senior product designer and information-design researcher reviewing a
public policy scorecard. Assume the editor wants disagreement, not reassurance.
Use current evidence and name uncertainty. Do not praise the product before
testing it.

OBJECTIVE:

Find the highest-value ways to make Canada Under Carney faster to understand,
easier to scan on a phone, and easier to move through on desktop without
weakening its source visibility or scoring transparency.

Start with four famous product candidates and select the two to four that earn a
distinct role. Name a preferred trio only if the evidence supports three. Each
candidate represents a different user job:

1. Apple Stocks: scan many signals quickly, then open one item for charts,
   details, and related context.
2. The New York Times: lead with the most important point, then let a reader
   move into explanation, data, and source context.
3. Airbnb: move between browse and detail views across phone and desktop while
   keeping navigation and state clear.
4. Wikipedia: navigate dense public information, move among sections, and
   inspect citations without losing reading position.

Do not claim any set is objectively the most popular. Treat Apple Stocks and
The New York Times as strong starting anchors, then test Airbnb and Wikipedia
against them. You may reject any candidate if the evidence is strong. Do not
fill a quota with a weak reference. Explain every keep and rejection.

MY THESIS:

The dashboard has enough information and trust material, but it asks readers to
cross too much introductory content before reaching the 11 policy grades. On
the live v5.157 page measured July 19, 2026:

- At 375x812, the first policy card begins about 3,370px down the page.
- At 1280x900, the first policy card begins about 1,509px down the page.
- On mobile, the four headline cards take about 1,360px and Dashboard Status
  takes about 972px.

Measurement method: the live production v5.157 page was loaded in the Codex
in-app Chromium browser on July 19, 2026. After `DOMContentLoaded`, the viewport
was set to 375x812 and then 1280x900 with `window.scrollY` at 0. The positions
were read as `Math.round(element.getBoundingClientRect().top + window.scrollY)`.
The policy start used `#scorecard-dimension-grid`; the mobile block heights used
`.scoreboard-card-row` and `.dashboard-status`. Re-run the same DOM reads before
using the figures as a design target because live content can change.

Treat those measurements as a hypothesis to check, not a conclusion to repeat.
The likely opportunity is a shorter summary-to-grade path with deeper trust
material still one clear action away.

DATA / FILES TO INSPECT:

1. The live rendered dashboard at
   https://sawatter.github.io/canada-under-carney/.
2. The rendered evidence pack at 375x812 and 1280x900. If you cannot inspect the
   live app interactively, say so and limit interaction claims to the evidence
   pack.
3. `docs/Product-Thesis.md` and `docs/Current-Roadmap.md`.
4. `src/components/Dashboard.jsx`, `ScoreboardHeader.jsx`,
   `DashboardStatus.jsx`, `DimensionCard.jsx`, and
   `src/components/AppShell.css`.
5. `src/index.css` and `docs/UI-Regression-Checklist.md`.
6. Current first-party product pages, help pages, design guidance, and recent
   screenshots for Apple Stocks, The New York Times, Airbnb, and Wikipedia.
   Prefer current mobile and desktop evidence from 2025 or 2026. Clearly date
   older material.
7. Relevant accessibility guidance from primary standards or platform
   documentation.

EDGES / DO NOT DO:

- Do not change grades, promise statuses, thresholds, formulas, weights,
  modifiers, triggers, or the 11-dimension-plus-1-tracker model.
- Do not turn the scorecard into a news feed, social product, or daily tracker.
- Do not recommend accounts, invasive personalization, push notifications, or a
  backend unless you prove they are necessary. The site is a static React 19 +
  Vite app on GitHub Pages.
- Do not hide methodology or sources to make the page look cleaner. Recommend a
  clear progressive-disclosure path instead.
- Do not copy another product's branding, colors, icons, or trade dress.
- Do not use generic advice such as "improve hierarchy" without naming the
  exact surface, current problem, proposed change, and expected reader benefit.
- Do not treat motion as modernization by itself. Respect reduced motion and
  keyboard access.
- Do not re-propose the v5.120 mobile navigation icons, active-filter return,
  bottom-navigation re-entry motion, or viewport body-lock and history fixes
  unless current rendered evidence shows that one has regressed.
- Do not raise the 530,000-byte entry budget or 540,000-byte initial-JS-graph
  budget enforced by `scripts/check-bundle-budget.mjs`.
- Do not synthesize verdict or why-not copy at render time. Preserve the
  authored and validator-checked `verdictLine`, `gradeBasis.whyNotHigher`, and
  `gradeBasis.whyNotLower` model.
- Do not generalize a mobile finding to desktop or a desktop finding to mobile.
- Do not recommend a carousel for essential information unless you address
  discoverability, keyboard use, and hidden-item risk.
- Preserve the product's non-partisan voice and its primary job: a skeptical
  reader can trace a grade from summary to evidence and source.

QUESTIONS TO ANSWER:

1. Which two to four of Apple Stocks, The New York Times, Airbnb, and Wikipedia
   form the best benchmark set for this product? Name a preferred trio only if
   three distinct references earn their place. Explain every keep and rejection.
2. What exact pattern from each product is useful here on mobile? What exact
   pattern is useful on desktop?
3. What should Canada Under Carney explicitly not copy from each product?
4. Where does the current page make a first-time reader work too hard before
   seeing the policy grades?
5. Where does the current page make a returning reader repeat work, and how can
   that work be reduced without hiding the trust frame a first-time reader
   needs?
6. Which trust information must stay visible, and which can move behind a clear
   disclosure without reducing credibility?
7. Should the four headline cards remain four full cards on mobile, become a
   compact 2x2 summary, or use another structure? Compare the options.
8. Should Dashboard Status remain fully open, become a compact summary with
   details, or move elsewhere? Compare the options.
9. Does a small jump-to-policy control help readers reach one of the 11 policy
   areas, or would it add more navigation clutter? Compare it with a shorter
   path to the policy grid.
10. Does the opened policy view present too many competing section and evidence
    controls? Identify the smallest navigation model that keeps the grade easy
    to check without hiding the supporting material.
11. How should list-to-detail behavior differ at 375px, tablet widths, and
   1280px?
12. Which changes would improve scan speed without making the scorecard feel
    shallow or partisan?
13. Which recommendations create accessibility, performance, history, focus,
    or deep-link risks in the current implementation?
14. What is the smallest coherent first implementation that can prove the
    direction before a larger visual pass?

OUTPUT FORMAT:

1. Access and evidence statement
   - Dashboard version inspected
   - Live interaction available: yes or no
   - Viewports inspected
   - External product versions and dates inspected

2. Benchmark verdict
   - Keep or reject each candidate and name the final set
   - Name a preferred trio only if three distinct references earn their place
   - One distinct lesson per product
   - One thing not to copy per product
   - Direct citations beside every external-product claim

3. Current dashboard findings
   - Rank no more than seven findings
   - For each: viewport, current evidence, user cost, and affected surface
   - Separate observed facts from inferences

4. Pattern translation matrix
   - Rows: proposed dashboard changes
   - Columns: reference pattern, mobile behavior, desktop behavior, trust
     effect, accessibility risk, performance risk, and implementation area

5. Copy / adapt / reject table
   - Copy the underlying interaction principle only
   - Adapt it to this scorecard
   - Reject patterns that conflict with the product thesis

6. Ranked recommendation
   - P0, P1, or P2
   - Expected reader benefit
   - Effort: small, medium, or large
   - Main risk
   - What evidence would prove the recommendation worked

7. First prototype specification
   - One bounded responsive change, not a full redesign
   - Exact behavior at 375x812 and 1280x900
   - Information that stays visible
   - Information that moves behind disclosure
   - Keyboard, focus, Back/Forward, deep-link, reduced-motion, and dark-theme
     acceptance criteria
   - Mobile body-scroll lock, full-screen drawer containment, and no desktop
     margin or border leaking into the mobile sheet
   - Existing files likely affected
   - Tests and live checks required

8. Rejected ideas and open questions
   - Name attractive ideas that should not be built
   - Name anything the available evidence cannot settle

DONE WHEN:

- Every recommendation is tied to current dashboard evidence and a cited
  reference pattern.
- Mobile and desktop recommendations are separate and concrete.
- The response identifies one smallest coherent prototype to build first.
- No recommendation changes a frozen scoring or methodology surface.
- The response makes clear what not to copy.
- Unsupported interaction claims are labeled as untested rather than stated as
  fact.
- The recommendation is tested against three reader tasks: find a policy grade,
  trace it to evidence, and find what changed since the previous visit.
```

## Expected Follow-Up

Treat the research as input, not an instruction list. Check each finding against
the live UI and repo before accepting it. Record accepted items in a short
decision memo, including a fresh run of the baseline DOM measurements. Reject
weak findings with reasons, then implement only the first bounded prototype and
review it at 375x812 and 1280x900 before continuing.
