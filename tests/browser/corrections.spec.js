import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

const changelog = JSON.parse(readFileSync(new URL("../../src/data/changelog.json", import.meta.url), "utf8"));
const latestCorrection = changelog.flatMap(entry => entry.items || [])
  .find(item => item.type === "correction");

for (const viewport of [
  { width: 1280, height: 900 },
  { width: 390, height: 844 },
]) {
  test(`published corrections can be reached from About at ${viewport.width}px`, async ({ page }) => {
    expect(latestCorrection, "The first correction release must contain a correction record").toBeTruthy();
    const pageErrors = [];
    page.on("pageerror", error => pageErrors.push(error.message));
    await page.setViewportSize(viewport);
    await page.goto("./#view-about");
    await page.getByRole("link", { name: "Read published corrections", exact: true }).click();
    await expect(page).toHaveURL(/#change-corrections$/);
    await expect(page.getByRole("button", { name: "Corrections", exact: true })).toHaveAttribute("aria-pressed", "true");
    const correction = page.locator('[data-change-type="correction"]')
      .filter({ hasText: latestCorrection.headline }).first();
    await expect(correction).toBeVisible();
    await expect(correction).toContainText(latestCorrection.previousValue);
    await expect(correction).toContainText(latestCorrection.correctedValue);
    await expect(correction.getByText("Previously reported", { exact: true })).toBeVisible();
    await expect(correction.getByText("Corrected explanation", { exact: true })).toBeVisible();
    await expect(page.locator('[data-change-type="grade"]')).toHaveCount(0);
    const hasPageOverflow = await page.evaluate(() => (
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    ));
    expect(hasPageOverflow).toBe(false);
    expect(pageErrors).toEqual([]);
  });
}
