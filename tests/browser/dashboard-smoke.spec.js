import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { getCurrentGradeMoves } from "../../src/gradeMoves.js";

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
  await expect(page.getByText(`v${meta.version}`, { exact: false })).toBeVisible();
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
