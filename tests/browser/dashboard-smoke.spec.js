import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const meta = JSON.parse(readFileSync(path.join(repoRoot, "src/data/meta.json"), "utf8"));

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

function routePath({ classic = false, hash = "" } = {}) {
  return `${classic ? "?experience=classic" : ""}${hash}`;
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

async function expectActiveNav(page, label) {
  await expect.poll(async () => page.locator('[aria-current="page"]').evaluateAll((nodes) => (
    nodes.map((node) => node.textContent?.trim()).filter(Boolean)
  ))).toContain(label);
}

async function expectShell(page, shell) {
  await expect(page.locator(shell === "app" ? ".app-shell" : ".classic-shell")).toHaveCount(1);
}

test.describe("dashboard route matrix", () => {
  for (const [viewportName, viewport] of viewports) {
    for (const classic of [false, true]) {
      test(`${classic ? "classic" : "root"} ${viewportName} routes stay clean`, async ({ page }, testInfo) => {
        const consoleErrors = await installConsoleGuards(page);
        await page.setViewportSize(viewport);
        if (testInfo.project.name.includes("reduced-motion")) {
          await page.emulateMedia({ reducedMotion: "reduce" });
        }

        for (const [key, label] of views) {
          await page.goto(routePath({ classic, hash: `#view-${key}` }));
          await expectShell(page, classic ? "classic" : "app");
          await expectVisibleVersion(page);
          await expect(page.getByRole("heading", { name: "Next checks" })).toBeVisible();
          await expect(page.getByText("Housing disbursement watch", { exact: true })).toBeVisible();
          await expectActiveNav(page, label);
          await expectNoOverflow(page);

          if (testInfo.project.name.includes("reduced-motion") && !classic) {
            await expect.poll(async () => page.evaluate(() => (
              window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ))).toBe(true);
            await expect(page.locator(".app-shell-view")).toHaveCSS("animation-name", "none");
          }
        }

        expect(consoleErrors).toEqual([]);
      });
    }
  }
});

test.describe("dimension evidence deep links", () => {
  for (const [viewportName, viewport] of viewports) {
    for (const classic of [false, true]) {
      test(`${classic ? "classic" : "root"} ${viewportName} Major Projects sources link opens and focuses`, async ({ page }, testInfo) => {
        const consoleErrors = await installConsoleGuards(page);
        await page.setViewportSize(viewport);
        if (testInfo.project.name.includes("reduced-motion")) {
          await page.emulateMedia({ reducedMotion: "reduce" });
        }
        await page.goto(routePath({ classic, hash: "#dim-major-projects-sources" }));

        await expectShell(page, classic ? "classic" : "app");
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
