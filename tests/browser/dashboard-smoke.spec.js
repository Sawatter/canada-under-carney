import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { getCurrentGradeMoves } from "../../src/gradeMoves.js";
import { resolveNoticeState } from "../../src/sinceLastVisit.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const meta = JSON.parse(readFileSync(path.join(repoRoot, "src/data/meta.json"), "utf8"));
const changelog = JSON.parse(readFileSync(path.join(repoRoot, "src/data/changelog.json"), "utf8"));
const dimensions = JSON.parse(readFileSync(path.join(repoRoot, "src/data/dimensions.json"), "utf8"));
const currentGradeMoves = getCurrentGradeMoves(changelog, dimensions, meta);
const movedDimensionIds = new Set(currentGradeMoves.map((item) => item.dimensionId));

const views = [
  ["scorecard", "Scorecard"],
  ["promises", "Promises"],
  ["changelog", "Changes"],
  ["methodology", "Rubric"],
  ["about", "About"],
];

const viewports = [
  ["desktop", { width: 1280, height: 900 }],
  ["mobile", { width: 375, height: 812 }],
];

test.beforeEach(async ({ page }) => {
  const analyticsStub = async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/javascript",
      body: "/* goatcounter stub for deterministic browser smoke */",
    });
  };
  await page.route("http://gc.zgo.at/**", analyticsStub);
  await page.route("https://gc.zgo.at/**", analyticsStub);
  await page.route("https://fonts.googleapis.com/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/css",
      body: "/* font stub for deterministic browser smoke */",
    });
  });
  await page.route("https://carneydashboard.goatcounter.com/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ count_unique: 133 }),
    });
  });
});

function routePath({ hash = "" } = {}) {
  return hash;
}

function staleClassicPath(hash = "") {
  return `?experience=classic${hash}`;
}

async function installConsoleGuards(page) {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => {
    errors.push(error.message);
  });
  return errors;
}

async function expectNoOverflow(page) {
  await expect.poll(async () => page.evaluate(() => (
    document.documentElement.scrollWidth <= document.documentElement.clientWidth
  ))).toBe(true);
}

async function expectVisibleVersion(page) {
  // Scoped to the header: the workspace sidebar also renders the version at
  // >=1024px, so an unscoped getByText is a strict-mode violation.
  await expect(
    page.locator(".dashboard-header").getByText(`v${meta.version}`, { exact: false }),
  ).toBeVisible();
}

async function expectHeaderBadgeClear(page) {
  await expect.poll(async () => page.evaluate(() => {
    const rectOf = (selector) => {
      const node = document.querySelector(selector);
      if (!node) return null;
      const rect = node.getBoundingClientRect();
      return {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
      };
    };
    const header = rectOf(".dashboard-header");
    const toggle = rectOf(".theme-toggle");
    const kicker = rectOf(".dashboard-kicker");
    const title = rectOf(".dashboard-title");
    const kickerNode = document.querySelector(".dashboard-kicker");
    if (!header || !toggle || !kicker || !title || !kickerNode) return false;
    const before = getComputedStyle(kickerNode, "::before");
    return (
      getComputedStyle(document.querySelector(".theme-toggle")).position === "absolute"
      && kicker.top >= toggle.bottom + 8
      && kicker.left >= header.left
      && kicker.right <= header.right
      && title.top >= kicker.bottom + 6
      && Number.parseFloat(before.width) >= 28
      && Number.parseFloat(before.flexBasis) >= 28
      && before.backgroundImage.includes("radial-gradient")
    );
  })).toBe(true);
}

async function expectActiveNav(page, label) {
  await expect.poll(async () => page.locator('[aria-current="page"]').evaluateAll((nodes) => (
    nodes.map((node) => node.textContent?.trim()).filter(Boolean)
  ))).toContain(label);
}

async function expectAppShell(page) {
  await expect(page.locator(".app-shell")).toHaveCount(1);
  await expect(page.locator(".classic-shell")).toHaveCount(0);
}

test.describe("dashboard route matrix", () => {
  for (const [viewportName, viewport] of viewports) {
    test(`root ${viewportName} routes stay clean`, async ({ page }, testInfo) => {
      const consoleErrors = await installConsoleGuards(page);
      await page.setViewportSize(viewport);
      if (testInfo.project.name.includes("reduced-motion")) {
        await page.emulateMedia({ reducedMotion: "reduce" });
      }

      for (const [key, label] of views) {
        await page.goto(routePath({ hash: `#view-${key}` }));
        await expectAppShell(page);
        await expectVisibleVersion(page);
        await expect(page.getByRole("heading", { name: "Next checks" })).toBeVisible();
        await expect(page.locator(".dashboard-status-row").filter({
          has: page.locator("dt", { hasText: "Grade moves this release" }),
        }).locator("dd")).toHaveText(currentGradeMoves.length === 0 ? "None" : String(currentGradeMoves.length));
        await expect(page.getByText("Housing disbursement watch", { exact: true })).toBeVisible();
        if (key === "scorecard") {
          await expectHeaderBadgeClear(page);
        }
        if (key === "about") {
          await expect(page.getByRole("link", { name: "continuity plan" })).toHaveAttribute(
            "href",
            "https://github.com/Sawatter/canada-under-carney/blob/main/docs/Continuity-Plan.md",
          );
        }
        await expectActiveNav(page, label);
        await expectNoOverflow(page);

        if (testInfo.project.name.includes("dark")) {
          await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
        }

        if (testInfo.project.name.includes("reduced-motion")) {
          await expect.poll(async () => page.evaluate(() => (
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ))).toBe(true);
          await expect(page.locator(".app-shell-view")).toHaveCSS("animation-name", "none");
        }
      }

      expect(consoleErrors).toEqual([]);
    });
  }
});

test.describe("v5.153 review follow-through", () => {
  test("sidebar links show a keyboard focus ring", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath());
    // DOM order: skip link, then the sidebar nav. Bounded Tab walk until a
    // sidebar link holds focus, then assert :focus-visible paints an outline.
    let focused = false;
    for (let i = 0; i < 10 && !focused; i += 1) {
      await page.keyboard.press("Tab");
      focused = await page.evaluate(() => (
        document.activeElement?.classList.contains("app-workspace-sidebar-link") ?? false
      ));
    }
    expect(focused).toBe(true);
    const ring = await page.evaluate(() => {
      const el = document.activeElement;
      const cs = getComputedStyle(el);
      return { matches: el.matches(":focus-visible"), style: cs.outlineStyle, width: cs.outlineWidth };
    });
    expect(ring.matches).toBe(true);
    expect(ring.style).not.toBe("none");
    expect(consoleErrors).toEqual([]);
  });

  test("why-not lines render once, in the verdict hero only", async ({ page }) => {
    const pilot = dimensions.find((d) => d.gradeBasis?.whyNotHigher);
    test.skip(!pilot, "no dimension carries the why-not pilot fields");
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    // Deep-linking #dim-<id> auto-opens the focused desktop detail (which
    // suppresses the collapsed header button), so assert against the
    // already-open drawer instead of clicking.
    await page.goto(routePath({ hash: `#dim-${pilot.id}` }));
    await expect(page.locator(".desktop-focused-detail-wrap")).toBeVisible();
    await expect(page.getByText("Why not higher:", { exact: false })).toHaveCount(1);
    await expect(page.getByText("Why not lower:", { exact: false })).toHaveCount(1);
    expect(consoleErrors).toEqual([]);
  });

  test("promise card carries the status distribution bar with a text summary", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath());
    const bar = page.locator(".scoreboard-card-promises [aria-hidden='true'][title*='delivered']");
    await expect(bar).toHaveCount(1);
    // The counts-in-words summary reaches AT via the button's accessible name
    // (visually-hidden span), not the aria-hidden visual bar.
    await expect(page.locator("button.scoreboard-card-promises"))
      .toHaveAccessibleName(/delivered/);
    expect(consoleErrors).toEqual([]);
  });

  test("provenance date chip never wraps on mobile", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(routePath());
    await page.locator(".dim-card-header-button").first().click();
    await page.locator(".dim-show-all-button").click();
    const chip = page.locator(".dim-trigger-setdate").first();
    await expect(chip).toBeVisible();
    await expect(chip).toHaveCSS("white-space", "nowrap");
    expect(consoleErrors).toEqual([]);
  });
});

test.describe("v5.152 trust surfaces", () => {
  test("trigger provenance badges render in the opened dimension", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath());
    await page.locator(".dim-card-header-button").first().click();
    // Open all sections so the triggers panel renders its rows.
    await page.locator(".dim-show-all-button").click();
    const badges = page.locator(".dim-trigger-setdate");
    await expect(badges.first()).toBeVisible();
    await expect(badges.first()).toContainText(/condition set \d{4}-\d{2}-\d{2}/);
    expect(consoleErrors).toEqual([]);
  });

  test("since-last-visit caught-up state matches the pure resolver", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    const seeded = "5.150";
    // Data-driven oracle: the same resolver the component uses decides what
    // this seeded reader must see, so a future grade item cannot flake this.
    const expected = resolveNoticeState(seeded, meta.version, changelog);
    await page.addInitScript((value) => {
      window.localStorage.setItem("ccc-last-seen-version", value);
    }, seeded);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath());
    if (expected === "caught-up") {
      await expect(page.locator(".since-last-visit-caught-up")).toBeVisible();
      await expect(page.locator(".since-last-visit-caught-up"))
        .toContainText(`Next scheduled update: ${meta.nextUpdate}`);
    } else if (expected !== "none") {
      await expect(page.locator(".since-last-visit"))
        .toContainText(`${expected.count} grade change`);
    }
    expect(consoleErrors).toEqual([]);
  });

  test("change log throttles to twelve entries with an explicit reveal", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#view-changelog" }));
    const reveal = page.getByRole("button", { name: /Show earlier changes/ });
    await expect(reveal).toBeVisible();
    await expect(reveal).toContainText(`(${changelog.length - 12} more)`);
    await reveal.click();
    await expect(reveal).toHaveCount(0);
    expect(consoleErrors).toEqual([]);
  });

  test("theme control cycles light, dark, and system", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath());
    const toggle = page.locator(".theme-toggle");
    const html = page.locator("html");
    for (let i = 0; i < 3; i += 1) {
      await toggle.click();
      await expect(html).toHaveAttribute("data-theme", /^(light|dark)$/);
    }
    const saved = await page.evaluate(() => window.localStorage.getItem("ccc-theme"));
    expect(["light", "dark", "system"]).toContain(saved);
    await expect(toggle).toHaveAttribute("aria-label", /Switch to/);
    expect(consoleErrors).toEqual([]);
  });
});

test.describe("workspace chrome, verdict lines, and follow updates", () => {
  for (const [viewportName, viewport] of viewports) {
    test(`workspace surfaces render correctly on ${viewportName}`, async ({ page }, testInfo) => {
      const consoleErrors = await installConsoleGuards(page);
      await page.setViewportSize(viewport);
      if (testInfo.project.name.includes("reduced-motion")) {
        await page.emulateMedia({ reducedMotion: "reduce" });
      }
      await page.goto(routePath());
      await expectAppShell(page);

      const sidebar = page.locator(".app-workspace-sidebar");
      if (viewportName === "desktop") {
        // Desktop >=1024px: sidebar owns navigation, top tab rail retires.
        await expect(sidebar).toBeVisible();
        await expect(page.locator(".dashboard-tabs-wrap")).toBeHidden();
        await expect(sidebar.locator(".app-workspace-sidebar-link")).toHaveCount(views.length);
        await sidebar.getByRole("button", { name: "Promises" }).click();
        await expectActiveNav(page, "Promises");
        await sidebar.getByRole("button", { name: "Scorecard" }).click();
        await expectActiveNav(page, "Scorecard");
        // Sidebar persists while a dimension is open (workspace behaviour).
        await page.locator(".dim-card-header-button").first().click();
        await expect(page.locator(".desktop-focused-detail-wrap")).toBeVisible();
        await expect(sidebar).toBeVisible();
        await page.locator(".dim-drawer-close").click();
        await expect(page.locator("#scorecard-dimension-grid")).toBeVisible();
      } else {
        await expect(sidebar).toBeHidden();
      }

      // Authored verdict lines render on collapsed cards (data-driven).
      const verdictDims = dimensions.filter((d) => !d.excludeFromGPA && d.verdictLine);
      if (verdictDims.length > 0) {
        await expect(page.locator(`#dim-${verdictDims[0].id}`))
          .toContainText(verdictDims[0].verdictLine.slice(0, 40));
      }

      // Next-check line sourced verbatim from nextTrigger.
      await expect(page.locator(".dim-next-check-line").first()).toBeVisible();

      // Follow-updates block: calendar file + RSS, no urgency framing.
      await expect(page.locator(".follow-updates-link[href='next-update.ics']")).toBeVisible();
      await expect(page.locator(".follow-updates-link[href='feed.xml']")).toBeVisible();

      await expectNoOverflow(page);
      expect(consoleErrors).toEqual([]);
    });
  }
});

test.describe("current release grade-move evidence loop", () => {
  for (const [viewportName, viewport] of viewports) {
    test(`scorecard ${viewportName} grade-move markers match current changelog`, async ({ page }, testInfo) => {
      const consoleErrors = await installConsoleGuards(page);
      await page.setViewportSize(viewport);
      await page.goto(routePath({ hash: "#view-scorecard" }));

      await expectAppShell(page);
      await expect(page.locator(".dim-card-header-button a, .dim-card-header-button button")).toHaveCount(0);

      for (const dim of dimensions) {
        const expected = movedDimensionIds.has(dim.id) ? "true" : "false";
        await expect(page.locator(`#dim-${dim.id}`)).toHaveAttribute("data-grade-moved-this-release", expected);
      }

      await expect(page.locator('[data-grade-moved-this-release="true"] .dim-current-grade-move-marker'))
        .toHaveCount(currentGradeMoves.length);
      await expectNoOverflow(page);

      if (testInfo.project.name.includes("dark")) {
        await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
      }

      expect(consoleErrors).toEqual([]);
    });
  }
});

test("grade-move callout routes to the exact change note when a current grade move exists", async ({ page }) => {
  if (currentGradeMoves.length === 0) return;

  const consoleErrors = await installConsoleGuards(page);
  const [move] = currentGradeMoves;
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(routePath({ hash: "#view-scorecard" }));
  await page.locator(`#dim-${move.dimensionId}-header`).click();
  await page.locator(`#dim-${move.dimensionId} .dim-current-grade-move-callout a`).click();

  await expect(page).toHaveURL(new RegExp(`#${move.anchorId}$`));
  await expectActiveNav(page, "Changes");
  await expect(page.locator(`#${move.anchorId}`)).toBeVisible();
  await expect(page.locator(`#${move.anchorId}`)).toHaveAttribute("data-change-type", "grade");
  await expectNoOverflow(page);
  expect(consoleErrors).toEqual([]);
});

test.describe("dimension evidence deep links", () => {
  for (const [viewportName, viewport] of viewports) {
    test(`root ${viewportName} Major Projects sources link opens and focuses`, async ({ page }, testInfo) => {
      const consoleErrors = await installConsoleGuards(page);
      await page.setViewportSize(viewport);
      if (testInfo.project.name.includes("reduced-motion")) {
        await page.emulateMedia({ reducedMotion: "reduce" });
      }
      await page.goto(routePath({ hash: "#dim-major-projects-sources" }));

      await expectAppShell(page);
      await expectVisibleVersion(page);
      await expect(page.locator("#dim-major-projects-sources-button")).toBeVisible();
      await expect.poll(async () => page.evaluate(() => document.activeElement?.id || "")).toBe(
        "dim-major-projects-sources-button",
      );
      await expect(page.locator("#dim-major-projects-title")).toBeVisible();
      await expect(page.locator("#dim-major-projects-sources-button")).toContainText("Sources");
      await expectNoOverflow(page);

      if (viewportName === "mobile") {
        await expect(page.locator('[role="dialog"][aria-modal="true"]')).toBeVisible();
      }

      expect(consoleErrors).toEqual([]);
    });
  }
});

test.describe("retired classic route", () => {
  for (const [viewportName, viewport] of viewports) {
    test(`stale classic query renders app shell on ${viewportName}`, async ({ page }) => {
      const consoleErrors = await installConsoleGuards(page);
      await page.setViewportSize(viewport);
      await page.goto(staleClassicPath("#view-scorecard"));

      await expectAppShell(page);
      await expectVisibleVersion(page);
      await expectActiveNav(page, "Scorecard");
      await expectNoOverflow(page);
      expect(consoleErrors).toEqual([]);
    });
  }
});

test("app mode pushes Promises into history and Back returns to Scorecard", async ({ page }) => {
  const consoleErrors = await installConsoleGuards(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(routePath({ hash: "#view-scorecard" }));
  await page.locator(".scoreboard-card-promises").click();
  await expect(page).toHaveURL(/#view-promises$/);
  await expectActiveNav(page, "Promises");

  await page.goBack();
  await expect(page).toHaveURL(/#view-scorecard$/);
  await expectActiveNav(page, "Scorecard");
  await expectNoOverflow(page);
  expect(consoleErrors).toEqual([]);
});

test.describe("v5.154 legibility wave", () => {
  test("Rubric tab opens with the plain explainer, then the limits block", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#view-methodology" }));

    await expectAppShell(page);
    const explainer = page.getByText("How the scoring works, in plain terms");
    await expect(explainer).toBeVisible();
    const limits = page.getByText("Limits of this model");
    await expect(limits).toHaveCount(1);
    // The explainer must sit above the limits block, and both above the
    // grade-range mechanics that used to open the tab.
    const explainerBox = await explainer.boundingBox();
    const limitsBox = await limits.boundingBox();
    expect(explainerBox.y).toBeLessThan(limitsBox.y);
    await expectNoOverflow(page);
    expect(consoleErrors).toEqual([]);
  });

  test("why-not lines render once on a non-pilot dimension", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#dim-fiscal-health" }));

    await expect(page.locator(".desktop-focused-detail-wrap")).toBeVisible();
    await expect(page.getByText("Why not higher:")).toHaveCount(1);
    await expect(page.getByText("Why not lower:")).toHaveCount(1);
    await expect(
      page.getByText("The next band up needs the deficit below 2% of the economy's size"),
    ).toHaveCount(1);
    expect(consoleErrors).toEqual([]);
  });
});

test.describe("v5.155 drawer history contract", () => {
  test("mobile card open pushes a #dim entry and Back closes the sheet", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(routePath({ hash: "#view-scorecard" }));

    await page.locator(".dim-card-header-button").first().click();
    await expect(page).toHaveURL(/#dim-[a-z-]+$/);
    await expect(page.locator('[role="dialog"][aria-modal="true"]')).toBeVisible();

    // The back-gesture invariant: browser Back (the same history traversal an
    // iOS edge-swipe or Android back button produces) closes the sheet and
    // rewinds the URL to what preceded the open.
    await page.goBack();
    await expect(page.locator('[role="dialog"][aria-modal="true"]')).toHaveCount(0);
    await expect(page).toHaveURL(/#view-scorecard$/);
    await expectActiveNav(page, "Scorecard");
    await expectNoOverflow(page);
    expect(consoleErrors).toEqual([]);
  });

  test("desktop card open pushes a #dim entry and Back restores grid, URL, and focus", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#view-scorecard" }));

    const firstHeader = page.locator(".dim-card-header-button").first();
    const headerId = await firstHeader.getAttribute("id");
    await firstHeader.click();
    await expect(page.locator(".desktop-focused-detail-wrap")).toBeVisible();
    await expect(page).toHaveURL(/#dim-[a-z-]+$/);

    await page.goBack();
    await expect(page.locator(".desktop-focused-detail-wrap")).toHaveCount(0);
    await expect(page.locator("#scorecard-dimension-grid")).toBeVisible();
    await expect(page).toHaveURL(/#view-scorecard$/);
    await expect.poll(async () => page.evaluate(() => document.activeElement?.id || ""))
      .toBe(headerId);
    await expectNoOverflow(page);
    expect(consoleErrors).toEqual([]);
  });

  test("deep-link arrival close stays on the site and lands on the scorecard URL", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#dim-fiscal-health" }));

    await expect(page.locator(".desktop-focused-detail-wrap")).toBeVisible();
    // No in-app entry precedes a deep-link arrival, so the close control must
    // not call history.back() (that would leave the site). It replaces the
    // URL so it no longer names a closed drawer.
    await page.locator(".dim-drawer-close").click();
    await expect(page.locator(".desktop-focused-detail-wrap")).toHaveCount(0);
    await expectAppShell(page);
    await expect(page).toHaveURL(/#view-scorecard$/);
    await expectActiveNav(page, "Scorecard");
    await expectNoOverflow(page);
    expect(consoleErrors).toEqual([]);
  });

  test("share falls back to the #dim clipboard link when Web Share fails", async ({ page, context }) => {
    const consoleErrors = await installConsoleGuards(page);
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    // A real Web Share failure should fall back to clipboard. AbortError is
    // intentionally excluded because it means the reader dismissed the sheet.
    await page.addInitScript(() => {
      try {
        Object.defineProperty(navigator, "share", {
          configurable: true,
          value: async () => {
            const error = new Error("share unavailable");
            error.name = "NotAllowedError";
            throw error;
          },
        });
      } catch { /* keep the native value if the property refuses override */ }
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#view-scorecard" }));

    await page.locator(".dim-card-header-button").first().click();
    await expect(page).toHaveURL(/#dim-[a-z-]+$/);
    const deepLink = page.url();

    await page.getByRole("button", { name: "Share this card" }).click();
    await expect(page.getByText("Link copied", { exact: true })).toBeVisible();
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe(deepLink);
    expect(clipboardText).toMatch(/#dim-[a-z-]+$/);
    expect(consoleErrors).toEqual([]);
  });

  test("a view click during drawer Back completes at the requested destination", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#view-scorecard" }));

    await page.locator(".dim-card-header-button").first().click();
    await expect(page.locator(".desktop-focused-detail-wrap")).toBeVisible();
    await page.locator(".dim-drawer-close").evaluate((button) => {
      button.click();
      const destination = [...document.querySelectorAll(".app-workspace-sidebar-link")]
        .find((candidate) => candidate.textContent.trim() === "Promises");
      destination?.click();
    });

    await expect(page).toHaveURL(/#view-promises$/);
    await expectActiveNav(page, "Promises");
    await expect(page.locator(".app-promise-tracker")).toBeVisible();

    await page.goBack();
    await expect(page).toHaveURL(/#view-scorecard$/);
    await expectActiveNav(page, "Scorecard");
    await page.goForward();
    await expect(page).toHaveURL(/#view-promises$/);
    await expectActiveNav(page, "Promises");
    await expect(page.locator(".app-promise-tracker")).toBeVisible();
    expect(consoleErrors).toEqual([]);
  });

  for (const destination of [
    { hash: "#view-promises", nav: "Promises", selector: ".app-promise-tracker" },
    { hash: "#dim-fiscal-health", nav: "Scorecard", selector: "#dim-fiscal-health-title" },
    {
      hash: "#change-2026-05-13-fiscal-health-0",
      nav: "Changes",
      selector: "#change-2026-05-13-fiscal-health-0",
    },
  ]) {
    test(`a manual ${destination.hash} edit reconciles the drawer and survives Back and Forward`, async ({ page }) => {
      const consoleErrors = await installConsoleGuards(page);
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(routePath({ hash: "#view-scorecard" }));

      await page.locator(".dim-card-header-button").first().click();
      const originalDrawerHash = new URL(page.url()).hash;
      await expect(page.locator(".desktop-focused-detail-wrap")).toBeVisible();

      await page.evaluate((hash) => {
        window.location.hash = hash;
      }, destination.hash);
      await expect(page).toHaveURL(new RegExp(`${destination.hash.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`));
      await expectActiveNav(page, destination.nav);
      await expect(page.locator(destination.selector)).toBeVisible();

      await page.goBack();
      await expect(page).toHaveURL(new RegExp(`${originalDrawerHash}$`));
      await expect(page.locator(".desktop-focused-detail-wrap")).toBeVisible();

      await page.goForward();
      await expect(page).toHaveURL(new RegExp(`${destination.hash.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`));
      await expectActiveNav(page, destination.nav);
      await expect(page.locator(destination.selector)).toBeVisible();
      expect(consoleErrors).toEqual([]);
    });
  }

  test("reload restores drawer ownership so close and Forward retain their history contract", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#view-scorecard" }));

    await page.locator(".dim-card-header-button").first().click();
    const drawerHash = new URL(page.url()).hash;
    await page.reload();
    await expect(page).toHaveURL(new RegExp(`${drawerHash}$`));
    await expect(page.locator(".desktop-focused-detail-wrap")).toBeVisible();

    await page.locator(".dim-drawer-close").click();
    await expect(page).toHaveURL(/#view-scorecard$/);
    await expect(page.locator(".desktop-focused-detail-wrap")).toHaveCount(0);

    await page.goForward();
    await expect(page).toHaveURL(new RegExp(`${drawerHash}$`));
    await expect(page.locator(".desktop-focused-detail-wrap")).toBeVisible();
    expect(consoleErrors).toEqual([]);
  });
});

test.describe("v5.155 deferred route integrity", () => {
  test("canonical policy details stay off startup and load with the first drawer", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    const detailRequests = [];
    page.on("request", (request) => {
      if (/\/assets\/dimensions-[^/]+\.json$/.test(new URL(request.url()).pathname)) {
        detailRequests.push(request.url());
      }
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#view-scorecard" }));
    await expectAppShell(page);
    expect(detailRequests).toHaveLength(0);

    await page.locator(".dim-card-header-button").first().click();
    await expect(page.locator(".dim-evidence-panel")).toBeVisible();
    expect(detailRequests).toHaveLength(1);
    expect(consoleErrors).toEqual([]);
  });

  test("a delayed policy-detail deep link opens its section and restores focus", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.route("**/assets/dimensions-*.json", async (route) => {
      const response = await route.fetch();
      await new Promise((resolve) => setTimeout(resolve, 750));
      await route.fulfill({ response });
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#dim-major-projects-sources" }));

    await expect(page.locator("#dim-major-projects-sources-button")).toBeVisible();
    await expect.poll(async () => page.evaluate(() => document.activeElement?.id || ""))
      .toBe("dim-major-projects-sources-button");
    expect(consoleErrors).toEqual([]);
  });

  for (const viewport of [
    { name: "desktop", width: 1280, height: 900 },
    { name: "mobile", width: 375, height: 812 },
  ]) {
    test(`a delayed policy-detail load keeps focus inside the ${viewport.name} drawer`, async ({ page }) => {
      await page.route("**/assets/dimensions-*.json", async (route) => {
        const response = await route.fetch();
        await new Promise((resolve) => setTimeout(resolve, 750));
        await route.fulfill({ response });
      });
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(routePath({ hash: "#view-scorecard" }));

      await page.locator(".dim-card-header-button").first().click();
      await expect(page.locator(".dim-evidence-panel")).toBeVisible();
      await expect.poll(async () => page.evaluate(() => (
        document.activeElement?.classList.contains("dim-drawer") || false
      ))).toBe(true);
    });
  }

  test("a failed policy-detail request stays contained and can retry", async ({ page }) => {
    const dimensionsPattern = "**/assets/dimensions-*.json";
    const failDetails = async (route) => route.abort();
    await page.route(dimensionsPattern, failDetails);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#view-scorecard" }));

    await page.locator(".dim-card-header-button").first().click();
    await expect(page.locator(".dashboard-shell")).toBeVisible();
    await expect(page.getByRole("alert")).toContainText("Policy details did not load.");

    await page.unroute(dimensionsPattern, failDetails);
    await page.getByRole("button", { name: "Try again" }).click();
    await expect(page.locator(".dim-evidence-panel")).toBeVisible();
  });

  test("a failed Promises data request stays contained and can retry", async ({ page }) => {
    const dimensionsPattern = "**/assets/dimensions-*.json";
    const failDetails = async (route) => route.abort();
    await page.route(dimensionsPattern, failDetails);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#view-scorecard" }));

    const sidebar = page.locator(".app-workspace-sidebar");
    await sidebar.getByRole("button", { name: "Promises" }).click();
    await expect(page.locator(".dashboard-shell")).toBeVisible();
    await expect(page.getByRole("alert")).toContainText("Promise details did not load.");

    await page.unroute(dimensionsPattern, failDetails);
    await page.getByRole("button", { name: "Try again" }).click();
    await expect(page.locator(".app-promise-tracker")).toBeVisible();
  });

  test("the full changelog stays off scorecard startup and loads with Changes", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    const requestedScripts = [];
    page.on("request", (request) => {
      if (request.resourceType() === "script") requestedScripts.push(request.url());
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#view-scorecard" }));
    await expectAppShell(page);
    expect(requestedScripts.some((url) => url.includes("WhatsChangedRoute-"))).toBe(false);

    const sidebar = page.locator(".app-workspace-sidebar");
    await sidebar.getByRole("button", { name: "Changes" }).click();
    await expect(page.getByText("What changed since last update", { exact: true })).toBeVisible();
    expect(requestedScripts.some((url) => url.includes("WhatsChangedRoute-"))).toBe(true);
    expect(consoleErrors).toEqual([]);
  });

  test("a cold Change Log deep link scrolls after its lazy route mounts", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.route("**/assets/WhatsChangedRoute-*.js", async (route) => {
      const response = await route.fetch();
      await new Promise((resolve) => setTimeout(resolve, 750));
      await route.fulfill({ response });
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#change-2026-05-13-fiscal-health-0" }));

    const target = page.locator("#change-2026-05-13-fiscal-health-0");
    await expect(target).toBeVisible();
    await expect.poll(async () => target.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    })).toBe(true);
    expect(consoleErrors).toEqual([]);
  });

  test("the safeguards link reaches its target after the lazy Rubric route mounts", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.route("**/assets/Methodology-*.js", async (route) => {
      const response = await route.fetch();
      await new Promise((resolve) => setTimeout(resolve, 750));
      await route.fulfill({ response });
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#view-scorecard" }));
    await page.getByRole("button", { name: "read the safeguards" }).click();

    const target = page.locator("#methodology-safeguards");
    await expect(page).toHaveURL(/#methodology-safeguards$/);
    await expectActiveNav(page, "Rubric");
    await expect(target).toBeVisible();
    await expect.poll(async () => target.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    })).toBe(true);
    await expect.poll(async () => page.evaluate(() => document.activeElement?.id || ""))
      .toBe("methodology-safeguards");

    await page.goBack();
    await expect(page).toHaveURL(/#view-scorecard$/);
    await expectActiveNav(page, "Scorecard");

    await page.goForward();
    await expect(page).toHaveURL(/#methodology-safeguards$/);
    await expectActiveNav(page, "Rubric");
    await expect(target).toBeVisible();
    await expect.poll(async () => page.evaluate(() => document.activeElement?.id || ""))
      .toBe("methodology-safeguards");
    expect(consoleErrors).toEqual([]);
  });

  test("a failed lazy route leaves the shell and a reload action available", async ({ page }) => {
    await page.route("**/assets/PromiseTrackerRoute-*.js", async (route) => route.abort());
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#view-scorecard" }));

    const sidebar = page.locator(".app-workspace-sidebar");
    await sidebar.getByRole("button", { name: "Promises" }).click();
    await expect(page.locator(".dashboard-shell")).toBeVisible();
    await expect(page.getByRole("alert")).toContainText("This section did not load.");
    await expect(page.getByRole("button", { name: "Reload this page" })).toBeVisible();
  });
});
