# UI Regression Checklist

Use this before pushing UI changes. A browser-capable agent or human has to run
it; lint and build do not count as UI verification.

- Desktop 1280px: open Major Projects, confirm the local sticky section bar is
  visible, and click Summary, Rule, Evidence, Sources, Views, and Close.
- Desktop 1280px: open `#dim-major-projects-sources` directly, confirm the card
  opens on Sources with the section bar visible and the active chip correct.
- Mobile 375px: open the same card, confirm the drawer is full-screen and flush,
  body scroll is locked, close/back work, and no desktop margin or border leaks
  into the sheet.
- Deep-link and keyboard: confirm focus lands on the opened disclosure control,
  Tab reaches the section chips and Close, Enter/Space activate controls, and
  Escape closes the mobile drawer.
- Header cards: confirm the four cards align on desktop, Approval Signal has no
  extra ungraded pill, and its poll detail toggle still opens and closes.
