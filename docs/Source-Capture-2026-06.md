# Source Verbatim Capture - June 2026

**Status:** Closes the four parked "browser-pull" sources from the prior handoff.
Two are now verbatim-confirmed; two genuinely need an editor browser-pull because
automated fetch is blocked or the content is gated.

## Captured (verbatim confirmed)

### CHBA Q1 2026 Housing Market Index (Housing Supply)

- Claim backed: single-family HMI 20.9, multi-family 13.4 (record low).
- Verbatim (chba.ca, 2026-04-21): "The 2026 Q1 single-family index fell 5.5 points
  to 20.9, which is just 1.3 points above the all-time record low. The multi-family
  index reached a third consecutive new record low and now sits at just 13.4."
- Result: claim confirmed. Matches the `sourceNote` on the Housing Supply
  "Housing starts (Mar 2026 trend / SAAR)" metric.

### Angus Reid one-year report card (one-year / report-card context)

- Claim backed: Carney one-year approval near 58/35, plus the report-card splits.
- Verbatim (angusreid.org): "Three-in-five (58%) say they approve of Carney's
  performance as prime minister"; "one-third (35%) of Canadians say they disapprove."
  Report card: met or exceeded on "improving Canada's international reputation (64%)
  and diversifying Canada's trade partners (57%)"; "fell short on addressing housing
  affordability (67%) and the high cost of living (70%)"; on promises, "Two-in-five
  (41%) believe the PM has fallen short; two-in-five (41%) say the Liberals have
  delivered."
- Result: claim confirmed. The 58/35 also matches the Angus Reid Institute
  "Election +365" entry already in `approval-polls.json`.

## Resolved via Chrome browser (2026-06-04)

A connected Chrome session (a real browser, not the headless fetcher) read the pages
that return 403 to automated fetch.

### OECD Economic Survey: Canada 2025 (Economic Policy Response) — captured

- Live. Verbatim, on the productivity / business-investment angle it is cited for:
  "Canada's labour productivity performance lags its peers." "Business investment per
  worker remains weak in Canada compared to other OECD countries." Business R&D is
  "low, representing only 1% of GDP compared to the OECD average of 2%." Claim confirmed.

### Signal49 — Canada's Five-Year Business Investment Outlook (Economic Policy Response) — still gated

- Confirmed gated in-browser too ($225 product page; "Read the online experience for
  the full analysis"). Only the public summary is visible: "Tariffs, ongoing tariff
  threats, and an uncertain trade environment weighed on Canadian business investment
  in 2025." Note: Signal49 is the former Conference Board of Canada (the licence ended
  2026-01-26), which is why dimension sourceNotes read "Conference Board / Signal49."
  The detailed numbers need a subscriber view; consider replacing with an open source
  in the June cycle.

### Roadmap "three dead links" — all verified LIVE

- The roadmap's "Next #2" listed three confirmed 404s (Narwhal climate rollback, ECCC
  emissions-cap framework, ECCC clean-vehicles/EV standard). All three are live in a
  browser. They were never 404; they return 403 to the headless fetcher, and the
  roadmap's May call was stale. No replacement was needed.
- The v5.97 change still stands as a correctness improvement: the Emissions cap and EV
  mandate promises are "Abandoned," so their statusSourceUrl now cites live independent
  abandonment evidence (National Observer; The Narwhal) rather than the original ECCC
  program page. The original ECCC pages remain as originalSourceUrl (live, correct).

## Note

This closes the "four browser-pull sources" item and the roadmap's Promise Delivery
dead-link item. The only thing still out of reach is Signal49's paid detail, which
needs a subscription or an open-source swap. Everything else is verified live.
