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

## Editor browser-pull required (automated fetch blocked or gated)

### OECD Economic Survey: Canada 2025 (Economic Policy Response)

- oecd.org returns HTTP 403 to automated fetch, and the Wayback archive is
  unreachable from this environment. The URL is live in a normal browser. Editor to
  capture the headline productivity / business-investment assessment verbatim.

### Signal49 - Canada's Five-Year Business Investment Outlook (Economic Policy Response)

- Gated product page ($225). Only the public summary is capturable: "Tariffs,
  ongoing tariff threats, and an uncertain trade environment weighed on Canadian
  business investment in 2025." The detailed analysis sits behind the paywall. The
  public sentence supports the source's stated role (independent confirmation of weak
  business investment), but the underlying numbers need a purchased or subscriber view.
  Worth deciding in the June cycle whether to replace it with an open source.

## Note

This was the "four browser-pull sources (OECD, CHBA, Signal49, Angus Reid one-year
card)" item parked in the prior handoff. The capture work is done where it can be done
without a browser. The two remaining are genuine browser-pulls, which is how they were
tagged, and fold naturally into the June cycle source refresh.
