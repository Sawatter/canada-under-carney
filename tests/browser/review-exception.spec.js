import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

const dimensions = JSON.parse(readFileSync(new URL("../../src/data/dimensions.json", import.meta.url), "utf8"));
const affordability = dimensions.find((dim) => dim.id === "affordability-response");

for (const viewport of [
  { width: 1280, height: 900 },
  { width: 390, height: 844 },
]) {
  test(`temporary grade is disclosed with its decision and expiry at ${viewport.width}px`, async ({ page }) => {
    const review = affordability.latestReview;
    expect(review.outcome).toBe("exception");
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.setViewportSize(viewport);
    await page.goto("./#view-scorecard");

    const notice = page.locator(".first-look-exception-note");
    await expect(notice).toContainText("temporary prior grade");
    await expect(notice).toContainText(affordability.name);
    const card = page.locator(`#dim-${affordability.id}`);
    const cardReview = card.locator('[data-review-outcome="exception"]');
    await expect(cardReview).toContainText("Temporary grade display");
    await expect(cardReview).toContainText(review.summary);
    await expect(card.locator(".dim-card-header-button")).toHaveAttribute(
      "aria-describedby", `dim-${affordability.id}-latest-review dim-${affordability.id}-reviewed-date`,
    );

    await notice.getByRole("link", { name: "Read why", exact: true }).click();
    const briefing = page.locator(`#dim-${affordability.id}-briefing`);
    await expect(briefing).toBeVisible();
    await expect(briefing.locator('[data-review-outcome="exception"]')).toContainText("Temporary grade display");
    await expect(briefing.getByRole("link", { name: "Read the exception decision" })).toHaveAttribute(
      "href", `https://github.com/Sawatter/canada-under-carney/blob/main/${review.exceptionRef}`,
    );
    await expect(briefing.locator(`time[datetime="${review.expiresOn}"]`)).toBeVisible();
    await expect(briefing.getByText("Grade held", { exact: true })).toHaveCount(0);

    const navigation = page.getByRole("navigation", { name: "Policy detail sections" });
    await navigation.getByRole("button", { name: "History", exact: true })
      .or(navigation.getByRole("link", { name: "History", exact: true })).click();
    const history = page.locator(`#dim-${affordability.id}-history`);
    await expect(history.getByRole("heading", { name: "Temporary grade display", exact: true })).toBeVisible();
    await expect(history.getByRole("link", { name: "Read the exception decision" })).toBeVisible();
    await expect(history.locator(`time[datetime="${review.expiresOn}"]`)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(viewport.width <= 640
      ? notice.getByRole("link", { name: "Read why", exact: true })
      : card.locator(".dim-card-header-button")).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
    expect(pageErrors).toEqual([]);
  });
}

test("sharing a temporary grade preserves its qualification", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "canShare", { configurable: true, value: () => true });
    Object.defineProperty(navigator, "share", { configurable: true, value: async (value) => {
      window.__exceptionShare = value;
    } });
  });
  await page.goto("./#dim-affordability-response-briefing");
  await page.getByRole("button", { name: "Share this card", exact: true }).click();
  const shared = await page.evaluate(() => window.__exceptionShare);
  expect(shared.url).toBe(page.url());
  expect(shared.text).toContain("Temporary prior grade: D- | Retained trend: Declining");
  expect(shared.text).toContain(affordability.latestReview.summary);
  expect(shared.text).toContain(`Exception expires: ${affordability.latestReview.expiresOn}`);
});
