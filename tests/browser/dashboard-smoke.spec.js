import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { getCurrentGradeMoves } from "../../src/gradeMoves.js";
import { resolveNoticeState } from "../../src/sinceLastVisit.js";
import {
  buildFirstLookProjection,
  resolveNextCheckTiming,
  selectPrimaryNextCheck,
} from "../../src/firstLook.js";
import {
  calculatePocketbookGPA,
  gpaToGrade,
} from "../../src/utils.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const meta = JSON.parse(readFileSync(path.join(repoRoot, "src/data/meta.json"), "utf8"));
const changelog = JSON.parse(readFileSync(path.join(repoRoot, "src/data/changelog.json"), "utf8"));
const changelogSummary = JSON.parse(
  readFileSync(path.join(repoRoot, "src/data/changelog-summary.json"), "utf8"),
);
const dimensions = JSON.parse(readFileSync(path.join(repoRoot, "src/data/dimensions.json"), "utf8"));
const dashboardStatus = JSON.parse(readFileSync(path.join(repoRoot, "src/data/status.json"), "utf8"));
const expectedPocketbookScore = calculatePocketbookGPA(dimensions).toFixed(1);
const expectedPocketbookGrade = gpaToGrade(Number(expectedPocketbookScore));
const expectedFirstLook = buildFirstLookProjection(changelog[0]);
const latestRelease = changelogSummary[0];
const primaryNextCheck = selectPrimaryNextCheck(dashboardStatus);
const primaryNextCheckTiming = resolveNextCheckTiming(
  dashboardStatus,
  primaryNextCheck,
);
const currentGradeMoves = getCurrentGradeMoves(changelog, dimensions, meta);
const movedDimensionIds = new Set(currentGradeMoves.map((item) => item.dimensionId));
const housingDimension = dimensions.find((dim) => dim.id === "housing-supply");
const defenceTradeDimension = dimensions.find((dim) => dim.id === "defence-trade");
const promiseDeliveryDimension = dimensions.find((dim) => dim.id === "promise-delivery");
const flagshipDeliveryDimension = dimensions.find((dim) => dim.id === "execution-delivery");
const ordinaryGradedDimension = dimensions.find((dim) => dim.id === "economic-policy");
const majorProjectsDimension = dimensions.find((dim) => dim.id === "major-projects");
const housingReviewedDate = housingDimension.latestReview?.date || housingDimension.lastUpdated;
const heldReviewDimensions = dimensions.filter((dim) => (
  !dim.excludeFromGPA && dim.latestReview?.outcome === "held"
));
const expectedHeldReviewIds = [
  "affordability-response",
  "carbon-pricing",
  "climate-environment",
  "defence-trade",
  "economic-policy",
  "ethics-transparency",
  "execution-delivery",
  "fiscal-health",
  "housing-supply",
  "immigration",
  "major-projects",
];

const statusDateFormatter = new Intl.DateTimeFormat("en-CA", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

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

const mobileFirstLookViewports = [
  { width: 320, height: 568 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
];

const policyDetailSections = ["Briefing", "Evidence", "History", "Method"];

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

function policyPanel(page, dimensionId, section) {
  return page.locator(`#dim-${dimensionId}-${section.toLowerCase()}`);
}

function policyDetailNavigation(page) {
  return page.getByRole("navigation", { name: "Policy detail sections" });
}

function policySectionControl(page, section) {
  const navigation = policyDetailNavigation(page);
  return navigation.getByRole("button", { name: section, exact: true }).or(
    navigation.getByRole("link", { name: section, exact: true }),
  );
}

async function expectPolicySection(page, dimensionId, section) {
  const navigation = policyDetailNavigation(page);
  const currentControl = policySectionControl(page, section);
  const panel = policyPanel(page, dimensionId, section);

  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole("button").or(navigation.getByRole("link")))
    .toHaveCount(policyDetailSections.length);
  await expect(currentControl).toHaveAttribute("aria-current", /.+/);
  await expect(panel).toBeVisible();

  for (const otherSection of policyDetailSections.filter((label) => label !== section)) {
    await expect(policySectionControl(page, otherSection)).not.toHaveAttribute("aria-current", /.+/);
    await expect(policyPanel(page, dimensionId, otherSection)).not.toBeVisible();
  }

  return { currentControl, navigation, panel };
}

async function selectPolicySection(page, dimensionId, section) {
  await policySectionControl(page, section).click();
  await expect(page).toHaveURL(new RegExp(`#dim-${dimensionId}-${section.toLowerCase()}$`));
  return expectPolicySection(page, dimensionId, section);
}

async function expectNoNestedDisclosures(panel) {
  await expect(panel.locator("details, summary, button[aria-expanded], [role='button'][aria-expanded]"))
    .toHaveCount(0);
}

async function expectVisibleText(scope, text) {
  await expect(scope.getByText(text, { exact: false }).first()).toBeVisible();
}

function collectSubstantiveStrings(value) {
  if (typeof value === "string") return value.length >= 8 ? [value] : [];
  if (Array.isArray(value)) return value.flatMap(collectSubstantiveStrings);
  if (value && typeof value === "object") {
    return Object.values(value).flatMap(collectSubstantiveStrings);
  }
  return [];
}

const methodGlossaryStrings = [
  "Confidence - how resistant the grade is to new data. High = direct measurement against numeric thresholds. Medium = qualitative judgment with mixed evidence. Low = sparse evidence.",
  "Attribution - what share of the outcome the federal government actually controls. Direct = at least 60% federal levers. Mixed = 30 to 60%. Mostly inherited = less than 30%.",
  "Lag - how long policy effects take to show in the metrics. Short = monthly / quarterly. Medium = 1 to 2 year cycles. Long = 5+ year structural. Event-driven = this area moves on specific disclosures or rulings rather than a fixed schedule.",
];

function evidenceLinksForDimension(dim) {
  const triggers = [
    ...(dim.gradeTriggers?.up || []),
    ...(dim.gradeTriggers?.down || []),
  ];
  return [
    ...(dim.sources || []).map((source) => ({ kind: "source", url: source.url })),
    ...(dim.metrics || []).flatMap((metric) => (metric.sourceRefs || []).map((source) => ({
      kind: `metric ${metric.label}`,
      url: source.url,
    }))),
    ...(dim.promises || []).flatMap((promise) => [
      { kind: `promise original ${promise.text}`, url: promise.originalSourceUrl },
      { kind: `promise status ${promise.text}`, url: promise.statusSourceUrl },
    ]),
    ...triggers.flatMap((trigger) => [
      { kind: `trigger ${trigger.text}`, url: trigger.sourceUrl },
      ...(trigger.additionalSources || []).map((source) => ({
        kind: `trigger challenge ${trigger.text}`,
        url: source.url,
      })),
    ]),
    ...(dim.projectCohort?.projects || []).map((project) => ({
      kind: `project ${project.name}`,
      url: project.sourceUrl,
    })),
  ].filter((link) => link.url);
}

async function expectCanonicalEvidence(panel, dim) {
  for (const metric of dim.metrics || []) {
    await expectVisibleText(panel, metric.label);
    await expectVisibleText(panel, metric.value);
  }
  for (const promise of dim.promises || []) {
    await expectVisibleText(panel, promise.text);
    await expectVisibleText(panel, promise.status);
    if (promise.evidence) await expectVisibleText(panel, promise.evidence);
  }
  for (const trigger of [
    ...(dim.gradeTriggers?.up || []),
    ...(dim.gradeTriggers?.down || []),
  ]) {
    await expectVisibleText(panel, trigger.text);
    if (trigger.sourceLabel) await expectVisibleText(panel, trigger.sourceLabel);
    for (const source of trigger.additionalSources || []) {
      await expectVisibleText(panel, source.label);
    }
  }
  for (const project of dim.projectCohort?.projects || []) {
    await expectVisibleText(panel, project.name);
  }
  const renderedLinkTargets = await panel.locator("a[href]").evaluateAll(
    (nodes) => nodes.map((node) => node.getAttribute("href")),
  );
  for (const link of evidenceLinksForDimension(dim)) {
    expect(renderedLinkTargets, `missing ${link.kind} target ${link.url}`).toContain(link.url);
  }
  if (dim.perspectives?.critics) await expectVisibleText(panel, dim.perspectives.critics);
  if (dim.perspectives?.defenders) await expectVisibleText(panel, dim.perspectives.defenders);
}

async function expectCanonicalMethod(panel, dim) {
  if (dim.construct) await expectVisibleText(panel, dim.construct);
  if (dim.scoring?.scopeNote) await expectVisibleText(panel, dim.scoring.scopeNote);
  if (dim.scoring?.modifierExpiry) await expectVisibleText(panel, dim.scoring.modifierExpiry);
  for (const threshold of dim.scoring?.thresholds || []) {
    await expectVisibleText(panel, threshold.criteria);
  }
  for (const guardrail of dim.scoring?.guardrails || []) {
    await expectVisibleText(panel, guardrail);
  }
  const combinationRule = dim.gradeBasis?.combinationRule;
  const methodCombinationRule = combinationRule
    ? { ...combinationRule, currentSnapshot: undefined }
    : combinationRule;
  for (const text of collectSubstantiveStrings({
    combinationRule: methodCombinationRule,
    componentOperationalization: dim.gradeBasis?.componentOperationalization,
    componentScoreSummary: dim.gradeBasis?.componentScoreSummary,
    leverOperationalization: dim.gradeBasis?.leverOperationalization,
    leverScoreSummary: dim.gradeBasis?.leverScoreSummary,
  })) {
    await expectVisibleText(panel, text);
  }
  if (dim.tags) {
    for (const text of methodGlossaryStrings) await expectVisibleText(panel, text);
  }
}

async function expectVisibleVersion(page) {
  // Scoped to the header: the workspace sidebar also renders the version at
  // >=1024px, so an unscoped getByText is a strict-mode violation.
  await expect(
    page.locator(".dashboard-header").getByText(`v${meta.version}`, { exact: false }),
  ).toBeVisible();
}

async function expectCompactHeaderClear(page) {
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
    const isCompactMobile = window.matchMedia("(max-width: 640px)").matches;
    const kickerStyle = getComputedStyle(kickerNode);
    const before = getComputedStyle(kickerNode, "::before");
    const controlsStayInsideHeader = (
      getComputedStyle(document.querySelector(".theme-toggle")).position === "absolute"
      && toggle.top >= header.top
      && toggle.left >= header.left
      && toggle.right <= header.right
      && toggle.bottom <= header.bottom
      && title.top >= header.top
      && title.left >= header.left
      && title.right <= header.right
      && title.bottom <= header.bottom
    );
    if (isCompactMobile) {
      return controlsStayInsideHeader && kickerStyle.display === "none";
    }
    return (
      controlsStayInsideHeader
      && kickerStyle.display === "inline-flex"
      && kicker.width > 0
      && kicker.left >= header.left
      && kicker.right <= header.right
      && title.top >= kicker.bottom + 4
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

function formatStatusDate(value) {
  return statusDateFormatter.format(new Date(`${value}T00:00:00Z`));
}

function dashboardStatusRegion(page) {
  return page.getByRole("region", { name: "Dashboard status" });
}

function firstLookRegion(page) {
  return page.getByRole("region", { name: "Scorecard briefing" });
}

function releaseStateLabel(firstLook) {
  if (firstLook.mode === "grade-moves") {
    return `${firstLook.gradeMoveCount} grade ${
      firstLook.gradeMoveCount === 1 ? "move" : "moves"
    } in this release`;
  }
  if (firstLook.mode === "maintenance-only") return "Maintenance-only release";
  if (firstLook.mode === "no-grade-moves") return "No grade moves in this release";
  return latestRelease.summary;
}

async function readSignalAlignment(signalGrid) {
  return signalGrid.evaluate((grid) => (
    [...grid.querySelectorAll(":scope > .first-look-signal")].map((card) => {
      const title = card.querySelector("h4, .first-look-signal-title");
      const description = card.querySelector(
        ".first-look-signal-description, header p",
      );
      const result = card.querySelector(
        ".first-look-signal-result, .first-look-promise-result, .first-look-approval-result",
      );
      const resultContent = result.firstElementChild;
      const action = card.querySelector(
        ".first-look-derivation-toggle, .first-look-signal-action",
      );
      const cardBox = card.getBoundingClientRect();
      const actionElementBox = action.getBoundingClientRect();
      const textBox = (element) => {
        const range = document.createRange();
        range.selectNodeContents(element);
        return range.getBoundingClientRect();
      };
      const titleBox = textBox(title);
      const descriptionBox = textBox(description);
      const actionTextBox = textBox(action);
      return {
        label: title.textContent.trim(),
        titleOffset: titleBox.top - cardBox.top,
        descriptionOffset: descriptionBox.top - cardBox.top,
        resultOffset: result.getBoundingClientRect().top - cardBox.top,
        resultContentOffset:
          resultContent.getBoundingClientRect().top - cardBox.top,
        actionCenterGap: cardBox.bottom
          - ((actionTextBox.top + actionTextBox.bottom) / 2),
        actionHeight: actionElementBox.height,
        cardHeight: cardBox.height,
        overflowX: card.scrollWidth - card.clientWidth,
        overflowY: card.scrollHeight - card.clientHeight,
      };
    })
  ));
}

function expectSignalAlignment(
  signalAlignment,
  { alignResults = false, context = "secondary signals" } = {},
) {
  expect(signalAlignment).toHaveLength(3);
  const alignedKeys = {
    titleOffset: 2,
    descriptionOffset: 2,
    actionCenterGap: 2,
    cardHeight: 1,
  };
  if (alignResults) {
    alignedKeys.resultOffset = 1;
    alignedKeys.resultContentOffset = 2;
  }
  for (const [key, tolerance] of Object.entries(alignedKeys)) {
    const values = signalAlignment.map((measurement) => measurement[key]);
    const spread = Math.max(...values) - Math.min(...values);
    expect(
      spread,
      `${context}: ${key} spread ${spread}px from ${values.join(", ")}`,
    ).toBeLessThanOrEqual(tolerance);
  }
  for (const measurement of signalAlignment) {
    expect(measurement.actionHeight).toBeGreaterThanOrEqual(44);
    expect(measurement.overflowX).toBe(0);
    expect(measurement.overflowY).toBe(0);
  }
}

async function readMobileSignalStack(signalGrid) {
  return signalGrid.evaluate((grid) => {
    const gridBox = grid.getBoundingClientRect();
    return [...grid.querySelectorAll(":scope > .first-look-signal")].map((card) => {
      const cardBox = card.getBoundingClientRect();
      const description = card.querySelector(
        ".first-look-signal-description, header p",
      );
      const action = card.querySelector(
        ".first-look-derivation-toggle, .first-look-signal-action",
      );
      const contentBoxes = [
        card.querySelector("h4, .first-look-signal-title"),
        description,
        card.querySelector(
          ".first-look-signal-result, .first-look-promise-result, .first-look-approval-result",
        ),
        action,
      ].filter(Boolean).map((element) => element.getBoundingClientRect());
      const actionBox = action.getBoundingClientRect();
      return {
        actionHeight: actionBox.height,
        bottom: cardBox.bottom,
        contentInside: contentBoxes.every((box) => (
          box.top >= cardBox.top - 1
          && box.bottom <= cardBox.bottom + 1
          && box.left >= cardBox.left - 1
          && box.right <= cardBox.right + 1
        )),
        descriptionWidth: description.getBoundingClientRect().width,
        gridLeft: gridBox.left,
        gridRight: gridBox.right,
        gridWidth: gridBox.width,
        label: card.getAttribute("aria-label")
          || card.querySelector("h4, .first-look-signal-title")?.textContent?.trim(),
        left: cardBox.left,
        overflowX: card.scrollWidth - card.clientWidth,
        overflowY: card.scrollHeight - card.clientHeight,
        right: cardBox.right,
        top: cardBox.top,
        width: cardBox.width,
      };
    });
  });
}

function expectMobileSignalStack(signalStack, context) {
  expect(signalStack).toHaveLength(3);
  for (const [index, measurement] of signalStack.entries()) {
    expect(
      Math.abs(measurement.left - measurement.gridLeft),
      `${context}: ${measurement.label} must start at the signal-grid edge`,
    ).toBeLessThanOrEqual(2);
    expect(
      Math.abs(measurement.right - measurement.gridRight),
      `${context}: ${measurement.label} must finish at the signal-grid edge`,
    ).toBeLessThanOrEqual(2);
    expect(
      measurement.width,
      `${context}: ${measurement.label} must use the full signal-grid width`,
    ).toBeGreaterThanOrEqual(measurement.gridWidth - 2);
    expect(
      measurement.descriptionWidth,
      `${context}: ${measurement.label} explanation needs a readable line width`,
    ).toBeGreaterThanOrEqual(measurement.width * 0.55);
    expect(
      measurement.contentInside,
      `${context}: ${measurement.label} content must remain inside its card`,
    ).toBe(true);
    expect(
      measurement.actionHeight,
      `${context}: ${measurement.label} action must retain a 44px target`,
    ).toBeGreaterThanOrEqual(44);
    expect(
      measurement.overflowX,
      `${context}: ${measurement.label} must not clip horizontally`,
    ).toBeLessThanOrEqual(1);
    expect(
      measurement.overflowY,
      `${context}: ${measurement.label} must not clip vertically`,
    ).toBeLessThanOrEqual(1);
    if (index > 0) {
      expect(
        measurement.top,
        `${context}: ${measurement.label} must stack below the preceding signal`,
      ).toBeGreaterThanOrEqual(signalStack[index - 1].bottom - 1);
    }
  }
}

async function expectMobileBoundaryStack(boundary, context) {
  const rows = await boundary.locator(".first-look-boundary-list").evaluate((list) => {
    const listBox = list.getBoundingClientRect();
    return [...list.querySelectorAll(":scope > div")].map((row) => {
      const rowBox = row.getBoundingClientRect();
      return {
        bottom: rowBox.bottom,
        label: row.querySelector("dt")?.textContent?.trim(),
        left: rowBox.left,
        listLeft: listBox.left,
        listRight: listBox.right,
        listWidth: listBox.width,
        overflowX: row.scrollWidth - row.clientWidth,
        overflowY: row.scrollHeight - row.clientHeight,
        right: rowBox.right,
        top: rowBox.top,
        width: rowBox.width,
      };
    });
  });
  expect(rows).toHaveLength(3);
  for (const [index, row] of rows.entries()) {
    expect(
      Math.abs(row.left - row.listLeft),
      `${context}: ${row.label} boundary row must start at the list edge`,
    ).toBeLessThanOrEqual(2);
    expect(
      Math.abs(row.right - row.listRight),
      `${context}: ${row.label} boundary row must finish at the list edge`,
    ).toBeLessThanOrEqual(2);
    expect(
      row.width,
      `${context}: ${row.label} boundary row must use the full list width`,
    ).toBeGreaterThanOrEqual(row.listWidth - 2);
    expect(row.overflowX, `${context}: ${row.label} must not clip horizontally`)
      .toBeLessThanOrEqual(1);
    expect(row.overflowY, `${context}: ${row.label} must not clip vertically`)
      .toBeLessThanOrEqual(1);
    if (index > 0) {
      expect(
        row.top,
        `${context}: ${row.label} must stack below the preceding boundary row`,
      ).toBeGreaterThanOrEqual(rows[index - 1].bottom - 1);
    }
  }
}

async function expectTextFloor(region, selector, minimumPx, category) {
  const measurements = await region.locator(selector).evaluateAll((nodes) => (
    nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return {
        fontSize: Number.parseFloat(style.fontSize),
        label: (
          node.getAttribute("aria-label")
          || node.textContent
          || node.className
        ).trim().replace(/\s+/g, " ").slice(0, 90),
        visible: (
          rect.width > 0
          && rect.height > 0
          && style.display !== "none"
          && style.visibility !== "hidden"
        ),
      };
    }).filter((measurement) => measurement.visible)
  ));
  expect(
    measurements.length,
    `${category}: expected at least one visible first-look text sample`,
  ).toBeGreaterThan(0);
  for (const measurement of measurements) {
    expect(
      measurement.fontSize,
      `${category}: "${measurement.label}" is ${measurement.fontSize}px; expected at least ${minimumPx}px`,
    ).toBeGreaterThanOrEqual(minimumPx);
  }
}

async function expectMobileFirstLookTypography(region, context) {
  await expectTextFloor(
    region,
    [
      ".first-look-eyebrow",
      ".first-look-block-heading",
      ".first-look-block-meta",
      ".first-look-primary-score",
      ".first-look-signal-group > h3",
    ].join(", "),
    12,
    `${context} metadata and eyebrow`,
  );
  await expectTextFloor(
    region,
    [
      ".first-look-primary-description",
      ".first-look-overall-verdict",
      ".first-look-update-summary",
      ".first-look-update-list",
      ".first-look-next-update",
      ".first-look-primary-check p",
      ".first-look-inline-link",
      ".first-look-boundary-list dt",
      ".first-look-boundary-list dd",
      ".first-look-action",
      ".first-look-derivation-toggle",
      ".first-look-signal-description",
      ".first-look-signal-score",
      ".first-look-signal-action",
      ".first-look-promise-result > span:last-child",
    ].join(", "),
    14,
    `${context} explanations and actions`,
  );
  await expectTextFloor(
    region,
    ".first-look-signal-title, .first-look-signal h4",
    16,
    `${context} signal titles`,
  );
}

async function expectMobileFirstLookControlsReachable(page, region, context) {
  const controls = region.locator("a[href], button:not([disabled])");
  const controlCount = await controls.count();
  expect(
    controlCount,
    `${context}: expected interactive controls in the first-look briefing`,
  ).toBeGreaterThan(0);

  for (let index = 0; index < controlCount; index += 1) {
    const control = controls.nth(index);
    const label = await control.evaluate((node) => (
      node.getAttribute("aria-label")
      || node.textContent
      || `${node.tagName.toLowerCase()} ${node.getAttribute("href") || ""}`
    ).trim().replace(/\s+/g, " ").slice(0, 100));
    await control.evaluate((node) => {
      node.scrollIntoView({ behavior: "auto", block: "center", inline: "nearest" });
    });
    await expect.poll(
      async () => control.evaluate((node) => {
        const rect = node.getBoundingClientRect();
        const bottomNav = document.querySelector(".app-bottom-nav");
        const navRect = bottomNav?.getBoundingClientRect();
        const centerX = rect.left + (rect.width / 2);
        const centerY = rect.top + (rect.height / 2);
        const hit = document.elementFromPoint(centerX, centerY);
        let ancestor = node.parentElement;
        let insideClippingAncestors = true;
        while (ancestor && ancestor !== document.body) {
          const style = getComputedStyle(ancestor);
          const clipsX = /(auto|clip|hidden|scroll)/.test(style.overflowX);
          const clipsY = /(auto|clip|hidden|scroll)/.test(style.overflowY);
          if (clipsX || clipsY) {
            const ancestorRect = ancestor.getBoundingClientRect();
            if (
              (clipsX && (rect.left < ancestorRect.left - 1 || rect.right > ancestorRect.right + 1))
              || (clipsY && (rect.top < ancestorRect.top - 1 || rect.bottom > ancestorRect.bottom + 1))
            ) {
              insideClippingAncestors = false;
              break;
            }
          }
          ancestor = ancestor.parentElement;
        }
        return {
          aboveFixedNav: Boolean(navRect)
            && rect.top >= -1
            && rect.bottom <= navRect.top - 1,
          contentFits: (
            node.scrollWidth <= node.clientWidth + 1
            && node.scrollHeight <= node.clientHeight + 1
          ),
          hitTarget: node === hit || node.contains(hit),
          insideClippingAncestors,
          insideViewportWidth: rect.left >= -1 && rect.right <= window.innerWidth + 1,
          noHorizontalScroll: window.scrollX === 0,
        };
      }),
      {
        message: `${context}: "${label}" must scroll fully above the fixed navigation without clipping`,
      },
    ).toEqual({
      aboveFixedNav: true,
      contentFits: true,
      hitTarget: true,
      insideClippingAncestors: true,
      insideViewportWidth: true,
      noHorizontalScroll: true,
    });
    await expect(control, `${context}: "${label}" must remain enabled`).toBeEnabled();
    await control.click({ trial: true });
  }
}

async function expectFirstLookControlsReflowAtTextResize(page, region, context) {
  const controls = region.locator("a[href], button:not([disabled])");
  const controlCount = await controls.count();
  expect(
    controlCount,
    `${context}: expected interactive controls in the resized first-look briefing`,
  ).toBeGreaterThan(0);

  for (let index = 0; index < controlCount; index += 1) {
    const control = controls.nth(index);
    const label = await control.evaluate((node) => (
      node.getAttribute("aria-label")
      || node.textContent
      || `${node.tagName.toLowerCase()} ${node.getAttribute("href") || ""}`
    ).trim().replace(/\s+/g, " ").slice(0, 100));

    await control.evaluate((node) => {
      node.scrollIntoView({ behavior: "auto", block: "start", inline: "nearest" });
    });
    await expect.poll(
      async () => control.evaluate((node) => {
        const rect = node.getBoundingClientRect();
        return rect.top >= -1 && rect.top < window.innerHeight;
      }),
      { message: `${context}: "${label}" top edge must remain reachable` },
    ).toBe(true);

    await control.evaluate((node) => {
      node.scrollIntoView({ behavior: "auto", block: "end", inline: "nearest" });
      const bottomNav = document.querySelector(".app-bottom-nav");
      if (bottomNav) {
        window.scrollBy({
          behavior: "auto",
          left: 0,
          top: bottomNav.getBoundingClientRect().height + 8,
        });
      }
    });
    await expect.poll(
      async () => control.evaluate((node) => {
        const rect = node.getBoundingClientRect();
        const bottomNav = document.querySelector(".app-bottom-nav");
        const navRect = bottomNav?.getBoundingClientRect();
        const visibleTop = Math.max(rect.top, 0);
        const visibleBottom = Math.min(rect.bottom, navRect?.top ?? window.innerHeight);
        const hitX = rect.left + (rect.width / 2);
        const hitY = visibleTop + ((visibleBottom - visibleTop) / 2);
        const hit = visibleBottom > visibleTop
          ? document.elementFromPoint(hitX, hitY)
          : null;
        let ancestor = node.parentElement;
        let insideClippingAncestors = true;
        while (ancestor && ancestor !== document.body) {
          const style = getComputedStyle(ancestor);
          const clipsX = /(auto|clip|hidden|scroll)/.test(style.overflowX);
          if (clipsX) {
            const ancestorRect = ancestor.getBoundingClientRect();
            if (rect.left < ancestorRect.left - 1 || rect.right > ancestorRect.right + 1) {
              insideClippingAncestors = false;
              break;
            }
          }
          ancestor = ancestor.parentElement;
        }
        return {
          bottomEdgeAboveNav: Boolean(navRect) && rect.bottom <= navRect.top - 1,
          contentFitsControl: (
            node.scrollWidth <= node.clientWidth + 1
            && node.scrollHeight <= node.clientHeight + 1
          ),
          hasOperableVisibleArea: visibleBottom > visibleTop
            && (node === hit || node.contains(hit)),
          insideClippingAncestors,
          insideViewportWidth: rect.left >= -1 && rect.right <= window.innerWidth + 1,
          noHorizontalScroll: window.scrollX === 0,
        };
      }),
      {
        message: `${context}: "${label}" must reflow without clipped content or fixed-nav obstruction`,
      },
    ).toEqual({
      bottomEdgeAboveNav: true,
      contentFitsControl: true,
      hasOperableVisibleArea: true,
      insideClippingAncestors: true,
      insideViewportWidth: true,
      noHorizontalScroll: true,
    });
    await expect(control, `${context}: "${label}" must remain enabled`).toBeEnabled();
    await control.click({ trial: true });
  }
}

async function expectShellReflowAtTextResize(page, context) {
  await page.locator(".app-bottom-nav").evaluate(async (node) => {
    const finiteAnimations = node.getAnimations({ subtree: true }).filter((animation) => {
      const endTime = animation.effect?.getComputedTiming().endTime;
      return typeof endTime === "number" && Number.isFinite(endTime);
    });
    await Promise.all(finiteAnimations.map((animation) => (
      animation.finished.catch(() => undefined)
    )));
  });

  const measurements = await page.locator(".app-shell").evaluate((shell) => {
    const header = shell.querySelector(".dashboard-header");
    const bottomNav = document.querySelector(".app-bottom-nav");
    const themeToggle = header.querySelector(".theme-toggle");
    const headerItems = [
      themeToggle,
      header.querySelector(".dashboard-title"),
      header.querySelector(".header-clarifier"),
      header.querySelector(".header-subtitle"),
    ].filter(Boolean);
    const navButtons = [...bottomNav.querySelectorAll("button")];
    const navLabels = [...bottomNav.querySelectorAll(".app-bottom-nav-label")];
    const shellBox = shell.getBoundingClientRect();
    const headerBox = header.getBoundingClientRect();
    const navBox = bottomNav.getBoundingClientRect();
    const inside = (child, parent) => (
      child.top >= parent.top - 1
      && child.bottom <= parent.bottom + 1
      && child.left >= parent.left - 1
      && child.right <= parent.right + 1
    );

    return {
      bottomNavAnchored: (
        Math.abs(navBox.left) <= 1
        && Math.abs(navBox.right - window.innerWidth) <= 1
        && navBox.top >= 0
        && Math.abs(navBox.bottom - window.innerHeight) <= 1
      ),
      documentFitsWidth:
        document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      headerContentFits: headerItems.every((item) => (
        inside(item.getBoundingClientRect(), headerBox)
        && getComputedStyle(item).visibility !== "hidden"
      )),
      headerFitsWidth: (
        inside(headerBox, shellBox)
      ),
      navButtonsFit: navButtons.every((button) => {
        const box = button.getBoundingClientRect();
        return (
          inside(box, navBox)
          && box.width >= 44
          && box.height >= 44
          && button.scrollWidth <= button.clientWidth + 1
          && button.scrollHeight <= button.clientHeight + 1
        );
      }),
      navLabelsFit: navLabels.every((label) => (
        label.scrollWidth <= label.clientWidth + 1
        && label.scrollHeight <= label.clientHeight + 1
      )),
      shellFitsWidth: (
        shellBox.left >= -1
        && shellBox.right <= window.innerWidth + 1
        && shell.scrollWidth <= shell.clientWidth + 1
      ),
      themeTargetFits: (() => {
        const box = themeToggle.getBoundingClientRect();
        return box.width >= 44 && box.height >= 44 && inside(box, headerBox);
      })(),
    };
  });

  expect(measurements, `${context}: surrounding shell must remain usable`).toEqual({
    bottomNavAnchored: true,
    documentFitsWidth: true,
    headerContentFits: true,
    headerFitsWidth: true,
    navButtonsFit: true,
    navLabelsFit: true,
    shellFitsWidth: true,
    themeTargetFits: true,
  });
}

async function expectInitialFirstLookLayout(page, region, viewport) {
  await region.evaluate(async (node) => {
    const finiteAnimations = node.getAnimations({ subtree: true }).filter((animation) => {
      const endTime = animation.effect?.getComputedTiming().endTime;
      return typeof endTime === "number" && Number.isFinite(endTime);
    });
    await Promise.all(finiteAnimations.map((animation) => (
      animation.finished.catch(() => undefined)
    )));
  });
  const fit = await region.evaluate((node, expectedViewport) => {
    const selectors = [
      ".first-look-primary-wrap",
      ".first-look-update",
      ".first-look-watch",
      ".first-look-boundary",
      ".first-look-action",
      ".first-look-signal",
    ];
    const boxes = selectors.flatMap((selector) => (
      [...node.querySelectorAll(selector)].map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          bottom: rect.bottom,
          height: rect.height,
          left: rect.left,
          right: rect.right,
          width: rect.width,
        };
      })
    ));
    return {
      allHaveArea: boxes.every((box) => box.width > 0 && box.height > 0),
      allFitWidth: boxes.every((box) => (
        box.left >= -1 && box.right <= expectedViewport.width + 1
      )),
      noDocumentOverflow:
        document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    };
  }, viewport);
  expect(fit).toEqual({
    allHaveArea: true,
    allFitWidth: true,
    noDocumentOverflow: true,
  });

  if (viewport.width > 767) return;

  await expect.poll(async () => page.evaluate(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, behavior: "auto" });
    return window.scrollY;
  }))
    .toBeLessThanOrEqual(4);

  const obscuredInitialControls = await region.evaluate((node) => {
    const bottomNav = document.querySelector(".app-bottom-nav");
    if (!bottomNav) return null;
    const navRect = bottomNav.getBoundingClientRect();
    return [...node.querySelectorAll("a[href], button:not([disabled])")]
      .map((control) => {
        const rect = control.getBoundingClientRect();
        const style = getComputedStyle(control);
        return {
          bottom: rect.bottom,
          label: control.getAttribute("aria-label") || control.textContent?.trim(),
          left: rect.left,
          right: rect.right,
          top: rect.top,
          visible: (
            rect.width > 0
            && rect.height > 0
            && rect.bottom > 0
            && rect.top < window.innerHeight
            && style.display !== "none"
            && style.visibility !== "hidden"
          ),
        };
      })
      .filter((control) => (
        control.visible
        && control.bottom > navRect.top
        && control.top < navRect.bottom
        && control.right > navRect.left
        && control.left < navRect.right
      ));
  });
  expect(obscuredInitialControls).not.toBeNull();
  expect(
    obscuredInitialControls,
    "initially visible first-look controls must stay above the fixed bottom navigation",
  ).toEqual([]);

  const clippedBottomNavLabels = await page.locator(".app-bottom-nav-label")
    .evaluateAll((labels) => labels.filter((label) => (
      label.scrollWidth > label.clientWidth + 1
      || label.scrollHeight > label.clientHeight + 1
    )).map((label) => label.textContent?.trim()));
  expect(
    clippedBottomNavLabels,
    `${viewport.width}px bottom-navigation labels must not clip`,
  ).toEqual([]);
}

async function expectFirstLookBriefing(page, viewport) {
  const region = firstLookRegion(page);
  const update = region.locator(".first-look-update");
  const watch = region.locator(".first-look-watch");
  const boundary = region.locator(".first-look-boundary");
  const signalGroup = region.getByRole("group", { name: "Other dashboard signals" });
  const policyRoute = region.getByRole("link", { name: "Inspect the 11 policy files" });
  const methodRoute = region.getByRole("link", { name: "Read the scoring method" });

  await expect(region).toBeVisible();
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await expect(region.getByRole("heading", { level: 2, name: "Full Policy Audit" }))
    .toBeVisible();
  await expect(region.getByText(meta.overallVerdictLine, { exact: true })).toBeVisible();

  const releaseHeading = update.locator(".first-look-block-heading");
  await expect(releaseHeading).toContainText(`v${latestRelease.version}`);
  await expect(
    releaseHeading.locator(`time[datetime="${latestRelease.date}"]`),
  ).toHaveText(formatStatusDate(latestRelease.date));
  await expect(update).toContainText(releaseStateLabel(expectedFirstLook));
  for (const item of expectedFirstLook.featuredItems) {
    await expect(update).toContainText(item.headline || item.body);
  }

  await expect(watch).toContainText(`Next score update ${formatStatusDate(meta.nextUpdate)}`);
  await expect(watch).toContainText(primaryNextCheck.label);
  await expect(watch).toContainText(primaryNextCheck.status);
  const expectedTiming = primaryNextCheckTiming.kind === "date"
    ? formatStatusDate(primaryNextCheckTiming.value)
    : primaryNextCheckTiming.value;
  await expect(watch.getByText(expectedTiming, { exact: true })).toBeVisible();
  if (primaryNextCheck.href) {
    await expect(watch.getByRole("link", { name: primaryNextCheck.label }))
      .toHaveAttribute("href", primaryNextCheck.href);
  }

  await expect(boundary.getByRole("heading", { name: "What affects the grades" }))
    .toBeVisible();
  await expect(boundary).toContainText(
    "Each of the 11 graded policy files counts equally.",
  );
  await expect(boundary).toContainText(
    "The same 11 files, with housing, cost of living, the economy, and government spending counted twice.",
  );
  await expect(boundary).toContainText(
    "Promise Delivery and Approval do not affect either grade.",
  );

  await expect(policyRoute).toBeVisible();
  await expect(policyRoute).toHaveAttribute("href", "#policy-grades-heading");
  await expect(methodRoute).toBeVisible();
  await expect(methodRoute).toHaveAttribute("href", "#methodology-safeguards");
  await expectInitialFirstLookLayout(page, region, viewport);

  const householdSignal = signalGroup.locator("button.first-look-signal-household");
  await expect(householdSignal).toBeVisible();
  await expect(householdSignal).toHaveAttribute("type", "button");
  await expect(householdSignal).toHaveAttribute("aria-expanded", "false");
  await expect(householdSignal).toHaveAttribute(
    "aria-controls",
    "score-derivation-household",
  );
  await expect(householdSignal).toHaveAccessibleName(
    `Household Impact. Grade ${expectedPocketbookGrade}. Score ${expectedPocketbookScore}. How is Household built?`,
  );
  await expect(
    householdSignal.locator(".first-look-signal-action"),
  ).toHaveText("How is Household built?");
  await expect(householdSignal.locator("button")).toHaveCount(0);
  await expect(page.locator("#score-derivation-household")).toHaveCount(0);
  await householdSignal.click();
  await expect(householdSignal).toHaveAttribute("aria-expanded", "true");
  await expect(householdSignal).toHaveAccessibleName(
    `Household Impact. Grade ${expectedPocketbookGrade}. Score ${expectedPocketbookScore}. Hide Household math`,
  );
  await expect(page.locator("#score-derivation-household")).toBeVisible();
  await householdSignal.click();
  await expect(householdSignal).toHaveAttribute("aria-expanded", "false");
  await expect(householdSignal).toHaveAccessibleName(
    `Household Impact. Grade ${expectedPocketbookGrade}. Score ${expectedPocketbookScore}. How is Household built?`,
  );
  await expect(page.locator("#score-derivation-household")).toHaveCount(0);

  if (viewport.width <= 640) {
    expectMobileSignalStack(
      await readMobileSignalStack(signalGroup.locator(".first-look-signal-grid")),
      `${viewport.width}px first-look check`,
    );
    await expectMobileBoundaryStack(
      boundary,
      `${viewport.width}px first-look check`,
    );
    await expectMobileFirstLookTypography(
      region,
      `${viewport.width}px first-look check`,
    );
  } else {
    expectSignalAlignment(await readSignalAlignment(
      signalGroup.locator(".first-look-signal-grid"),
    ), {
      context: `${viewport.width}px first-look check`,
    });
  }
  await expect(signalGroup.getByText(
    "The same 11 policies, with four pocketbook files double-weighted.",
    { exact: true },
  )).toBeVisible();
  const promiseButton = signalGroup.locator("button.first-look-signal-promises");
  await expect(promiseButton).toBeVisible();
  await expect(promiseButton).toHaveAttribute("type", "button");
  await expect(promiseButton).toHaveAccessibleName(
    /Promise Delivery.*delivered.*See \d+ promises/i,
  );
  await expect(signalGroup.getByText("Tracker outside the grades.", { exact: true }))
    .toBeVisible();
  const approvalButton = signalGroup.getByRole("button", { name: /Approval Signal/ });
  await expect(approvalButton).toBeVisible();
  await expect(approvalButton).toHaveAttribute("aria-expanded", "false");
  await expect(approvalButton).toHaveAttribute("aria-controls", "approval-signal-detail");
  await expect(approvalButton).toHaveAccessibleName(
    /Approval Signal.*\d+% approve.*\d+% disapprove.*Net.*polls.*day average.*polls and sources/i,
  );
  await expect(signalGroup.getByText("Public opinion outside the grades.", { exact: true }))
    .toBeVisible();
  await expect(page.locator("#approval-signal-detail")).toHaveCount(0);
  await approvalButton.click();
  await expect(approvalButton).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#approval-signal-detail")).toBeVisible();
  await approvalButton.click();
  await expect(approvalButton).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#approval-signal-detail")).toHaveCount(0);

  if (viewport.width <= 640) {
    await expectMobileFirstLookControlsReachable(
      page,
      region,
      `${viewport.width}px first-look check`,
    );
  }

  return { methodRoute, policyRoute, region };
}

async function expectCompactDashboardStatus(page, { expanded = false } = {}) {
  const region = dashboardStatusRegion(page);
  const details = page.locator("#dashboard-status-details");
  const toggleName = expanded ? "Hide details" : "Show details";
  const toggle = region.getByRole("button", { name: toggleName });

  await expect(region).toBeVisible();
  await expect(region.getByText("Source freshness and score review are tracked separately.", {
    exact: true,
  })).toBeVisible();
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute("type", "button");
  await expect(toggle).toHaveAttribute("aria-controls", "dashboard-status-details");
  await expect(toggle).toHaveAttribute("aria-expanded", expanded ? "true" : "false");

  if (expanded) {
    await expect(details).toBeVisible();
    await expect(region.locator(".dashboard-status-row:visible")).toHaveCount(4);
  } else {
    await expect(details).toBeHidden();
    await expect(region.locator(".dashboard-status-row:visible")).toHaveCount(0);

    const visibleText = await region.innerText();
    expect(visibleText).toContain(formatStatusDate(dashboardStatus.lastSourceScanAt));
    expect(visibleText).toContain(formatStatusDate(dashboardStatus.lastEditorReviewedScoreCycleAt));
    expect(visibleText).toContain(formatStatusDate(dashboardStatus.coverageThrough));
    expect(visibleText).toMatch(/Evidence scan/i);
    expect(visibleText).toMatch(/Editor-reviewed/i);
    expect(visibleText).toMatch(/Coverage through/i);
  }
  await expect(region.getByRole("heading", { name: "Next checks" })).toHaveCount(0);
  await expect(region.getByRole("link")).toHaveCount(0);
  await expect(region).not.toContainText("Grade moves this release");
  await expect(region).not.toContainText(primaryNextCheck.label);
  await expect(region).not.toContainText(primaryNextCheck.status);

  return { details, region, toggle };
}

async function expectFullDashboardStatus(page) {
  const region = dashboardStatusRegion(page);
  const details = page.locator("#dashboard-status-details");

  await expect(region).toBeVisible();
  await expect(region.getByRole("button", { name: /details/i })).toHaveCount(0);
  await expect(details).toBeVisible();
  await expect(region.locator(".dashboard-status-row:visible")).toHaveCount(4);
  await expect(region.getByRole("heading", { name: "Next checks" })).toHaveCount(0);
  await expect(region.getByRole("link")).toHaveCount(0);
  await expect(region).not.toContainText("Grade moves this release");
  await expect(region).not.toContainText(primaryNextCheck.label);
  await expect(region).not.toContainText(primaryNextCheck.status);

  return { details, region };
}

async function expectPolicyHeadingNearViewportTop(page) {
  await expect.poll(async () => page.locator("#policy-grades-heading").evaluate((heading) => {
    const rect = heading.getBoundingClientRect();
    return rect.top >= -1 && rect.top <= 120 && rect.bottom > 0;
  })).toBe(true);
}

async function expectStatusHeadingInViewport(page) {
  await expect.poll(async () => page.locator("#dashboard-status-heading").evaluate((heading) => {
    const rect = heading.getBoundingClientRect();
    const bottomNav = document.querySelector(".app-bottom-nav");
    const bottomNavStyle = bottomNav ? window.getComputedStyle(bottomNav) : null;
    const bottomNavTop = bottomNav
      && bottomNavStyle?.display !== "none"
      && bottomNavStyle?.visibility !== "hidden"
      ? bottomNav.getBoundingClientRect().top
      : window.innerHeight;
    return rect.top >= 0 && rect.bottom <= bottomNavTop;
  })).toBe(true);
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
        if (viewportName === "mobile") {
          await expectCompactDashboardStatus(page);
        } else {
          await expectFullDashboardStatus(page);
        }

        await expect(firstLookRegion(page)).toBeVisible();
        await expect(
          firstLookRegion(page).getByRole("link", { name: "Inspect the 11 policy files" }),
        ).toBeVisible();
        await expect(
          firstLookRegion(page).getByRole("link", { name: "Read the scoring method" }),
        ).toBeVisible();
        if (key === "scorecard") {
          await expectCompactHeaderClear(page);
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

test.describe("responsive benchmark controls", () => {
  for (const [viewportName, viewport] of viewports) {
    test(`policy-file route focuses the policy heading without changing ${viewportName} history`, async ({ page }) => {
      const consoleErrors = await installConsoleGuards(page);
      await page.setViewportSize(viewport);
      await page.goto(routePath({ hash: "#view-scorecard" }));

      const jump = firstLookRegion(page).getByRole("link", {
        name: "Inspect the 11 policy files",
      });
      const heading = page.getByRole("heading", {
        level: 2,
        name: /11 policy areas graded A.F, updated monthly\./,
      });
      await expect(jump).toBeVisible();
      await expect(jump).toHaveAttribute("href", "#policy-grades-heading");
      await expect(heading).toHaveAttribute("id", "policy-grades-heading");
      await expect(heading).toHaveAttribute("tabindex", "-1");

      const targetBox = await jump.boundingBox();
      expect(targetBox).not.toBeNull();
      expect(targetBox.width).toBeGreaterThanOrEqual(44);
      expect(targetBox.height).toBeGreaterThanOrEqual(44);

      const pointerHistoryBefore = await page.evaluate(() => ({
        hash: window.location.hash,
        length: window.history.length,
        state: window.history.state,
      }));
      await jump.click();

      await expect(heading).toBeFocused();
      await expectPolicyHeadingNearViewportTop(page);
      const pointerHistoryAfter = await page.evaluate(() => ({
        hash: window.location.hash,
        length: window.history.length,
        state: window.history.state,
      }));
      expect(pointerHistoryAfter).toEqual(pointerHistoryBefore);

      await page.reload();
      await expect(jump).toBeVisible();
      const keyboardHistoryBefore = await page.evaluate(() => ({
        hash: window.location.hash,
        length: window.history.length,
        state: window.history.state,
      }));
      await jump.focus();
      await expect(jump).toBeFocused();
      await page.keyboard.press("Enter");

      await expect(heading).toBeFocused();
      await expectPolicyHeadingNearViewportTop(page);
      const keyboardHistoryAfter = await page.evaluate(() => ({
        hash: window.location.hash,
        length: window.history.length,
        state: window.history.state,
      }));
      expect(keyboardHistoryAfter).toEqual(keyboardHistoryBefore);

      await page.keyboard.press("Tab");
      const firstPolicy = page.locator("#scorecard-dimension-grid .dim-card-header-button").first();
      await expect(firstPolicy).toBeFocused();
      const firstPolicyId = await firstPolicy.getAttribute("id");
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(/#dim-[a-z-]+-briefing$/);

      if (viewportName === "mobile") {
        await expect(page.locator('[role="dialog"][aria-modal="true"]')).toBeVisible();
      } else {
        await expect(page.locator(".desktop-focused-detail-wrap")).toBeVisible();
      }

      await page.goBack();
      await expect(page).toHaveURL(/#view-scorecard$/);
      await expect(jump).toBeVisible();
      if (viewportName === "mobile") {
        await expect(page.locator('[role="dialog"][aria-modal="true"]')).toHaveCount(0);
      } else {
        await expect(page.locator(".desktop-focused-detail-wrap")).toHaveCount(0);
      }
      await expect.poll(async () => page.evaluate(() => document.activeElement?.id || ""))
        .toBe(firstPolicyId);
      await expectNoOverflow(page);
      expect(consoleErrors).toEqual([]);
    });

    test(`first-look briefing exposes canonical content and keyboard methodology routing on ${viewportName}`, async ({ page }) => {
      const consoleErrors = await installConsoleGuards(page);
      await page.setViewportSize(viewport);
      await page.goto(routePath({ hash: "#view-scorecard" }));

      expect(latestRelease.firstLook).toEqual(expectedFirstLook);
      const { methodRoute } = await expectFirstLookBriefing(page, viewport);
      await methodRoute.focus();
      await expect(methodRoute).toBeFocused();
      await page.keyboard.press("Enter");

      await expect(page).toHaveURL(/#methodology-safeguards$/);
      await expectActiveNav(page, "Rubric");
      await expect(page.locator("#methodology-safeguards")).toBeVisible();
      await expect(page.locator("#methodology-safeguards")).toBeFocused();
      await expectNoOverflow(page);
      expect(consoleErrors).toEqual([]);
    });
  }

  test("secondary signals stack on phones and stay aligned at the desktop boundary", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.addInitScript(() => {
      window.history.scrollRestoration = "manual";
    });
    const cases = [
      ...mobileFirstLookViewports,
      { width: 640, height: 812 },
      { width: 641, height: 812 },
      { width: 1280, height: 900 },
    ];
    for (const viewport of cases) {
      await page.setViewportSize(viewport);
      await page.goto(routePath({ hash: "#view-scorecard" }));
      await page.evaluate(async () => {
        window.scrollTo({ top: 0, behavior: "auto" });
        await document.fonts.ready;
      });

      const region = firstLookRegion(page);
      const signalGrid = region.locator(".first-look-signal-grid");
      const boundary = region.locator(".first-look-boundary");
      await expect(signalGrid).toBeVisible();
      const context = `${viewport.width}px width matrix`;
      if (mobileFirstLookViewports.some(({ width }) => width === viewport.width)) {
        await expectInitialFirstLookLayout(page, region, viewport);
      }
      if (viewport.width <= 640) {
        expectMobileSignalStack(
          await readMobileSignalStack(signalGrid),
          context,
        );
        await expectMobileBoundaryStack(boundary, context);
        await expectMobileFirstLookTypography(region, context);
        await expectMobileFirstLookControlsReachable(page, region, context);
      } else {
        expectSignalAlignment(await readSignalAlignment(signalGrid), { context });
      }
      await expectNoOverflow(page);
    }

    expect(consoleErrors).toEqual([]);
  });

  test("first-look reflows without clipped controls at 200% root text size", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);

    for (const viewport of mobileFirstLookViewports) {
      await page.setViewportSize(viewport);
      await page.goto(routePath({ hash: "#view-scorecard" }));
      await page.evaluate(async () => {
        document.documentElement.style.fontSize = "";
        window.scrollTo(0, 0);
        await document.fonts.ready;
      });

      const region = firstLookRegion(page);
      const signalGrid = region.locator(".first-look-signal-grid");
      const baseline = await region.evaluate((node) => ({
        height: node.getBoundingClientRect().height,
        rootFontSize: Number.parseFloat(getComputedStyle(document.documentElement).fontSize),
        signalTitleFontSize: Number.parseFloat(
          getComputedStyle(node.querySelector(".first-look-signal-title")).fontSize,
        ),
      }));
      await page.evaluate(() => {
        document.documentElement.style.fontSize = "200%";
        window.scrollTo(0, 0);
      });

      await expect.poll(async () => region.evaluate(() => (
        Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
      ))).toBeGreaterThanOrEqual(baseline.rootFontSize * 1.95);
      const resizedMeasurements = await region.evaluate((node) => ({
        height: node.getBoundingClientRect().height,
        rootFontSize: Number.parseFloat(getComputedStyle(document.documentElement).fontSize),
        signalTitleFontSize: Number.parseFloat(
          getComputedStyle(node.querySelector(".first-look-signal-title")).fontSize,
        ),
      }));
      expect(
        resizedMeasurements.rootFontSize,
        `${viewport.width}px at 200%: root text size must double`,
      ).toBeGreaterThanOrEqual(baseline.rootFontSize * 1.95);
      expect(
        resizedMeasurements.signalTitleFontSize,
        `${viewport.width}px at 200%: rem-based signal titles must follow the root size`,
      ).toBeGreaterThanOrEqual(baseline.signalTitleFontSize * 1.95);
      expect(
        resizedMeasurements.height,
        `${viewport.width}px at 200%: first-look content must reflow instead of staying fixed`,
      ).toBeGreaterThan(baseline.height);

      await expectInitialFirstLookLayout(page, region, viewport);
      await expectShellReflowAtTextResize(
        page,
        `${viewport.width}px at 200%`,
      );
      expectMobileSignalStack(
        await readMobileSignalStack(signalGrid),
        `${viewport.width}px at 200%`,
      );
      await expectMobileBoundaryStack(
        region.locator(".first-look-boundary"),
        `${viewport.width}px at 200%`,
      );
      await expectFirstLookControlsReflowAtTextResize(
        page,
        region,
        `${viewport.width}px at 200%`,
      );
      await expectNoOverflow(page);
    }

    expect(consoleErrors).toEqual([]);
  });

  for (const [viewportName, viewport] of viewports) {
    test(`policy-file route returns from another ${viewportName} view without adding history`, async ({ page }) => {
      const consoleErrors = await installConsoleGuards(page);
      await page.setViewportSize(viewport);
      await page.goto(routePath({ hash: "#view-about" }));

      const jump = firstLookRegion(page).getByRole("link", {
        name: "Inspect the 11 policy files",
      });
      await expect(page.locator("#policy-grades-heading")).toHaveCount(0);
      const historyLengthBefore = await page.evaluate(() => window.history.length);

      await jump.click();

      const heading = page.locator("#policy-grades-heading");
      await expect(page).toHaveURL(/#policy-grades-heading$/);
      await expect(heading).toBeFocused();
      await expectPolicyHeadingNearViewportTop(page);
      await expect.poll(async () => page.evaluate(() => window.history.length))
        .toBe(historyLengthBefore);
      await expectNoOverflow(page);
      expect(consoleErrors).toEqual([]);
    });
  }

  test("Dashboard Status defaults switch exactly at the 640px boundary", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    const cases = [
      { width: 375, compact: true },
      { width: 640, compact: true },
      { width: 641, compact: false },
      { width: 1280, compact: false },
    ];

    for (const { width, compact } of cases) {
      await page.setViewportSize({ width, height: width >= 1280 ? 900 : 812 });
      await page.goto(routePath({ hash: "#view-scorecard" }));
      if (compact) {
        await expectCompactDashboardStatus(page);
      } else {
        await expectFullDashboardStatus(page);
      }
      await expectNoOverflow(page);
    }

    expect(consoleErrors).toEqual([]);
  });

  test("mobile Dashboard Status disclosure supports Enter and Space without exposing hidden links", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(routePath({ hash: "#view-scorecard" }));

    const closed = await expectCompactDashboardStatus(page);
    const toggleBox = await closed.toggle.boundingBox();
    expect(toggleBox).not.toBeNull();
    expect(toggleBox.width).toBeGreaterThanOrEqual(44);
    expect(toggleBox.height).toBeGreaterThanOrEqual(44);

    await closed.toggle.focus();
    await page.keyboard.press("Enter");
    const opened = await expectCompactDashboardStatus(page, { expanded: true });
    await expect(opened.toggle).toBeFocused();

    await page.keyboard.press("Space");
    const reclosed = await expectCompactDashboardStatus(page);
    await expect(reclosed.toggle).toBeFocused();
    await page.keyboard.press("Tab");
    expect(await reclosed.details.evaluate((details) => !details.contains(document.activeElement))).toBe(true);
    await expectNoOverflow(page);
    expect(consoleErrors).toEqual([]);
  });

  test("Dashboard Status resize preserves mobile choice and repairs disappearing focus", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#view-scorecard" }));

    const desktop = await expectFullDashboardStatus(page);
    const focusedStatusRow = desktop.region.locator(".dashboard-status-row").last();
    await focusedStatusRow.evaluate((row) => {
      row.setAttribute("tabindex", "0");
      row.focus();
    });
    await expect(focusedStatusRow).toBeFocused();

    await page.setViewportSize({ width: 640, height: 812 });
    const compact = await expectCompactDashboardStatus(page);
    await expect(page.locator("#dashboard-status-heading")).toBeFocused();
    await expectStatusHeadingInViewport(page);
    await expectNoOverflow(page);

    await compact.toggle.focus();
    await expect(compact.toggle).toBeFocused();
    await page.setViewportSize({ width: 641, height: 812 });
    await expectFullDashboardStatus(page);
    await expect(page.locator("#dashboard-status-heading")).toBeFocused();
    await expectStatusHeadingInViewport(page);
    await expectNoOverflow(page);

    await page.setViewportSize({ width: 640, height: 812 });
    const compactAgain = await expectCompactDashboardStatus(page);
    await compactAgain.toggle.focus();
    await page.keyboard.press("Enter");
    const explicitlyOpen = await expectCompactDashboardStatus(page, { expanded: true });
    await expect(explicitlyOpen.toggle).toBeFocused();

    await page.setViewportSize({ width: 641, height: 812 });
    await expectFullDashboardStatus(page);
    await expect(page.locator("#dashboard-status-heading")).toBeFocused();
    await expectStatusHeadingInViewport(page);
    await expectNoOverflow(page);

    await page.setViewportSize({ width: 375, height: 812 });
    await expectCompactDashboardStatus(page, { expanded: true });
    await expect(page.locator("#dashboard-status-heading")).toBeFocused();
    await expectStatusHeadingInViewport(page);
    await expectNoOverflow(page);
    expect(consoleErrors).toEqual([]);
  });

  test("Defence and Trade sub-score ladders stack on mobile", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(routePath({ hash: "#dim-defence-trade-method" }));

    const { panel: section } = await expectPolicySection(page, "defence-trade", "Method");
    const cards = section
      .locator(".dimension-subscore-grid")
      .locator(":scope > article, :scope > section");
    await expect(section).toBeVisible();
    await expect(cards).toHaveCount(2);

    const layout = await cards.evaluateAll((nodes) => nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return {
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        width: rect.width,
      };
    }));
    expect(layout[1].top).toBeGreaterThanOrEqual(layout[0].bottom);
    expect(Math.abs(layout[0].left - layout[1].left)).toBeLessThanOrEqual(1);
    expect(Math.abs(layout[0].width - layout[1].width)).toBeLessThanOrEqual(1);
    expect(layout.every((card) => card.right <= 375)).toBe(true);
    await expectNoOverflow(page);
    expect(consoleErrors).toEqual([]);
  });
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
    await page.goto(routePath({ hash: `#dim-${pilot.id}-briefing` }));
    await expect(page.locator(".desktop-focused-detail-wrap")).toBeVisible();
    await expect(page.getByText("Why not higher:", { exact: false })).toHaveCount(1);
    await expect(page.getByText("Why not lower:", { exact: false })).toHaveCount(1);
    expect(consoleErrors).toEqual([]);
  });

  test("compact Promise Delivery signal carries the status distribution bar with a text summary", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath());
    const bar = page.locator(".first-look-signal-promises [aria-hidden='true'][title*='delivered']");
    await expect(bar).toHaveCount(1);
    await expect(page.locator("button.first-look-signal-promises"))
      .toHaveAccessibleName(/delivered/);
    expect(consoleErrors).toEqual([]);
  });

  test("provenance date chip never wraps on mobile", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(routePath({ hash: "#dim-housing-supply-evidence" }));
    const chip = policyPanel(page, "housing-supply", "Evidence")
      .locator("#dim-housing-supply-tracker-triggers time")
      .first();
    await expect(chip).toBeVisible();
    await expect(chip).toHaveCSS("white-space", "nowrap");
    expect(consoleErrors).toEqual([]);
  });
});

test.describe("v5.152 trust surfaces", () => {
  test("trigger provenance badges render in the opened dimension", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#dim-housing-supply-evidence" }));
    const badges = policyPanel(page, "housing-supply", "Evidence")
      .locator("#dim-housing-supply-tracker-triggers time[datetime]");
    await expect(badges.first()).toBeVisible();
    await expect(badges.first()).toHaveAttribute("datetime", /^\d{4}-\d{2}-\d{2}$/);
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

test.describe("held policy review summaries", () => {
  for (const [viewportName, viewport] of viewports) {
    test(`held reviews stay secondary and readable on ${viewportName}`, async ({ page }, testInfo) => {
      expect(
        heldReviewDimensions.map((dim) => dim.id).sort(),
        "the release fixture must include all eleven documented held policies",
      ).toEqual(expectedHeldReviewIds);
      const consoleErrors = await installConsoleGuards(page);
      await page.setViewportSize(viewport);
      await page.goto(routePath({ hash: "#view-scorecard" }));

      await expect(page.locator(".dim-latest-review-collapsed"))
        .toHaveCount(heldReviewDimensions.length);

      for (const dim of heldReviewDimensions) {
        const card = page.locator(`#dim-${dim.id}`);
        const review = card.locator(".dim-latest-review-collapsed");
        await review.scrollIntoViewIfNeeded();
        await expect(review).toBeVisible();
        await expect(review.locator(".dim-latest-review-label")).toHaveText("This review");
        await expect(review.locator(".dim-latest-review-meta strong")).toHaveText("Grade held");
        await expect(review.locator(".dim-latest-review-copy")).toHaveText(dim.latestReview.summary);
        await expect(card.locator(".dim-last-reviewed-pill time"))
          .toHaveText(dim.latestReview.date);
        await expect(card.locator(".dim-card-header-button"))
          .toHaveAttribute(
            "aria-describedby",
            `dim-${dim.id}-latest-review dim-${dim.id}-reviewed-date`,
          );
        await expect(review.locator("a, button, [role='button']")).toHaveCount(0);
        expect(await review.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
      }

      await expect(page.locator("#dim-promise-delivery .dim-latest-review")).toHaveCount(0);
      await expectNoOverflow(page);

      if (testInfo.project.name.includes("dark")) {
        await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
      }
      expect(consoleErrors).toEqual([]);
    });
  }

  test("expanded held review renders once in Briefing and sources JSON retains it", async ({ page }) => {
    expect(heldReviewDimensions.length, "the release fixture must include a held policy review")
      .toBeGreaterThan(0);
    const consoleErrors = await installConsoleGuards(page);
    const [dim] = heldReviewDimensions;

    for (const viewport of viewports.map(([, size]) => size)) {
      await page.setViewportSize(viewport);
      await page.goto(routePath({ hash: `#dim-${dim.id}-briefing` }));

      const { panel: briefing } = await expectPolicySection(page, dim.id, "Briefing");
      await expect(page.getByText(dim.latestReview.summary, { exact: true })).toHaveCount(1);
      await expectVisibleText(briefing, "Grade held");
      await expect(briefing.locator(`time[datetime="${dim.latestReview.date}"]`).first())
        .toBeVisible();
      await expectNoNestedDisclosures(briefing);
      await expectNoOverflow(page);
    }

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: `#dim-${dim.id}-evidence` }));
    await expectPolicySection(page, dim.id, "Evidence");
    const download = page.getByRole("link", { name: "Download sources as JSON" });
    await expect(download).toBeVisible();
    const href = await download.getAttribute("href");
    const payload = JSON.parse(decodeURIComponent(href.slice(href.indexOf(",") + 1)));
    expect(payload.latestReview).toEqual(dim.latestReview);
    expect(consoleErrors).toEqual([]);
  });

  test("Housing keeps the compact hold singular and the dated evidence record in History", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#dim-housing-supply-briefing" }));

    await expectPolicySection(page, housingDimension.id, "Briefing");
    await expect(page.getByText(housingDimension.latestReview.summary, { exact: true }))
      .toHaveCount(1);
    const { panel: history } = await selectPolicySection(page, housingDimension.id, "History");
    await expect(
      history.getByText(housingDimension.latestEvidenceReview.outcome, { exact: true }),
    ).toHaveCount(1);
    await expectNoOverflow(page);
    expect(consoleErrors).toEqual([]);
  });
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

test.describe("approved dimension workspace architecture", () => {
  test("Housing Briefing is complete and its dated evidence review is available in History", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#dim-housing-supply-briefing" }));

    const { panel: briefing } = await expectPolicySection(
      page,
      housingDimension.id,
      "Briefing",
    );
    await expect(briefing.getByText(housingDimension.grade, { exact: true }).first()).toBeVisible();
    await expectVisibleText(briefing, housingDimension.verdictLine);
    await expect(page.getByText(housingDimension.latestReview.summary, { exact: true }))
      .toHaveCount(1);

    for (const metric of housingDimension.metrics.filter((item) => item.lead)) {
      await expectVisibleText(briefing, metric.label);
      await expectVisibleText(briefing, metric.value);
    }
    await expectVisibleText(briefing, housingDimension.gradeBasis.whyNotHigher);
    await expectVisibleText(briefing, housingDimension.gradeBasis.whyNotLower);
    await expectVisibleText(briefing, housingDimension.judgmentCall);

    const triggerCount = (
      housingDimension.gradeTriggers.up.length
      + housingDimension.gradeTriggers.down.length
    );
    const checkpoint = briefing.locator("#dim-housing-supply-triggers-section");
    await expect(checkpoint).toBeVisible();
    await expectVisibleText(checkpoint, housingDimension.nextTrigger);
    await expect(checkpoint).toContainText(String(triggerCount));
    const evidenceAction = checkpoint.locator("button, a")
      .filter({ hasText: new RegExp(String(triggerCount)) });
    await expect(evidenceAction).toHaveCount(1);
    await expect(evidenceAction).toContainText(/Evidence|conditions/i);
    await expect(briefing.locator(".dimension-trigger-band")).toHaveCount(0);
    for (const trigger of [
      ...housingDimension.gradeTriggers.up,
      ...housingDimension.gradeTriggers.down,
    ]) {
      await expect(briefing.getByText(trigger.text, { exact: true })).toHaveCount(0);
      await expect(
        briefing.locator(`time[datetime="${trigger.setDate}"]`),
      ).toHaveCount(0);
    }
    await expectNoNestedDisclosures(briefing);

    await evidenceAction.click();
    await expect(page).toHaveURL(/#dim-housing-supply-tracker-triggers$/);
    const { panel: evidence } = await expectPolicySection(
      page,
      housingDimension.id,
      "Evidence",
    );
    const triggerLedger = evidence.locator("#dim-housing-supply-tracker-triggers");
    await expect(triggerLedger).toBeVisible();
    await expect(triggerLedger).toBeFocused();
    for (const trigger of [
      ...housingDimension.gradeTriggers.up,
      ...housingDimension.gradeTriggers.down,
    ]) {
      await expectVisibleText(triggerLedger, trigger.text);
      await expect(
        triggerLedger.getByRole("link", { name: trigger.sourceLabel, exact: true }).first(),
      ).toHaveAttribute("href", trigger.sourceUrl);
      await expect(
        triggerLedger.locator(`time[datetime="${trigger.setDate}"]`).first(),
      ).toBeVisible();
    }
    await expectNoNestedDisclosures(evidence);

    const { panel: history } = await selectPolicySection(page, housingDimension.id, "History");
    await expectVisibleText(history, housingDimension.latestEvidenceReview.title);
    await expectVisibleText(history, housingDimension.latestEvidenceReview.triggerUnderReview);
    await expectVisibleText(history, housingDimension.latestEvidenceReview.scorecardRead);
    await expectVisibleText(history, housingDimension.latestEvidenceReview.outcome);
    for (const evidence of [
      ...housingDimension.latestEvidenceReview.evidenceEarningCredit,
      ...housingDimension.latestEvidenceReview.evidenceLimitingCredit,
    ]) {
      await expectVisibleText(history, evidence.text);
      await expect(
        history.getByRole("link", { name: evidence.sourceLabel, exact: true }).first(),
      ).toHaveAttribute("href", evidence.sourceUrl);
    }
    for (const pageChecked of housingDimension.latestEvidenceReview.pagesChecked) {
      await expect(
        history.getByRole("link", { name: pageChecked.label, exact: true }).first(),
      ).toHaveAttribute("href", pageChecked.url);
    }
    await expectNoNestedDisclosures(history);
    expect(consoleErrors).toEqual([]);
  });

  test("Defence and Trade keeps flat lead metrics and groups both sub-scores in Method", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#dim-defence-trade-method" }));

    const { panel: method } = await expectPolicySection(
      page,
      defenceTradeDimension.id,
      "Method",
    );
    const subScoreGrid = method.locator(".dimension-subscore-grid");
    const subScoreCards = subScoreGrid.locator(":scope > article, :scope > section");
    await expect(subScoreGrid).toBeVisible();
    await expect(subScoreCards).toHaveCount(Object.keys(defenceTradeDimension.subScores).length);

    for (const subScore of Object.values(defenceTradeDimension.subScores)) {
      const card = subScoreCards.filter({ hasText: subScore.label });
      await expect(card).toHaveCount(1);
      await expect(card.getByText(subScore.grade, { exact: true }).first()).toBeVisible();
      await expectVisibleText(card, subScore.rationale);
      for (const threshold of subScore.thresholds) {
        await expectVisibleText(card, threshold.criteria);
      }
    }
    await expectNoNestedDisclosures(method);

    const { panel: briefing } = await selectPolicySection(
      page,
      defenceTradeDimension.id,
      "Briefing",
    );
    for (const metric of defenceTradeDimension.metrics.filter((item) => item.lead)) {
      await expectVisibleText(briefing, metric.label);
      await expectVisibleText(briefing, metric.value);
    }
    await expect(briefing.locator(".dimension-subscore-grid")).toHaveCount(0);
    await expectNoNestedDisclosures(briefing);
    expect(consoleErrors).toEqual([]);
  });

  test("Promise Delivery follows the informational tracker path without grade-only sections", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    expect(promiseDeliveryDimension.excludeFromGPA).toBe(true);
    expect(promiseDeliveryDimension.latestEvidenceReview).toBeUndefined();
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#dim-promise-delivery-briefing" }));

    const { panel: briefing } = await expectPolicySection(
      page,
      promiseDeliveryDimension.id,
      "Briefing",
    );
    await expect(
      briefing.getByText(promiseDeliveryDimension.informationalGrade, { exact: true }).first(),
    ).toBeVisible();
    await expect(briefing).toContainText(/tracker/i);
    await expect(briefing).toContainText(/outside (?:the )?GPA|not included in headline scores/i);
    await expect(page.getByText("Why not higher:", { exact: false })).toHaveCount(0);
    await expect(page.getByText("Why not lower:", { exact: false })).toHaveCount(0);
    await expect(page.getByText("Where editor judgment enters:", { exact: false })).toHaveCount(0);
    await expectNoNestedDisclosures(briefing);

    const { panel: history } = await selectPolicySection(
      page,
      promiseDeliveryDimension.id,
      "History",
    );
    await expect(history).toBeVisible();
    await expect(history.getByRole("alert")).toHaveCount(0);
    await expectNoNestedDisclosures(history);

    const { panel: method } = await selectPolicySection(
      page,
      promiseDeliveryDimension.id,
      "Method",
    );
    for (const modifier of promiseDeliveryDimension.gradeBasis.activeModifiers) {
      await expectVisibleText(method, modifier.status);
      await expectVisibleText(method, modifier.reason);
    }
    await expectNoNestedDisclosures(method);
    expect(consoleErrors).toEqual([]);
  });

  test("Flagship Evidence owns the current snapshot while Method retains the rule, and an ordinary policy tolerates empty History", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#dim-execution-delivery-evidence" }));

    const snapshot = flagshipDeliveryDimension.gradeBasis.combinationRule.currentSnapshot;
    const { panel: flagshipEvidence } = await expectPolicySection(
      page,
      flagshipDeliveryDimension.id,
      "Evidence",
    );
    await expect(
      flagshipEvidence.getByText("Current snapshot", { exact: true }),
    ).toBeVisible();
    const snapshotTable = flagshipEvidence.locator("table")
      .filter({ hasText: snapshot[0].evidence });
    await expect(snapshotTable).toHaveCount(1);
    for (const row of snapshot) {
      const renderedRow = snapshotTable.locator("tbody tr").filter({ hasText: row.file });
      await expect(renderedRow).toHaveCount(1);
      await expect(renderedRow.getByText(row.file, { exact: true })).toBeVisible();
      await expect(renderedRow.getByText(row.status, { exact: true })).toBeVisible();
      await expect(renderedRow.getByText(row.evidence, { exact: true })).toBeVisible();
    }

    const { panel: flagshipMethod } = await selectPolicySection(
      page,
      flagshipDeliveryDimension.id,
      "Method",
    );
    await expectCanonicalMethod(flagshipMethod, flagshipDeliveryDimension);
    await expectVisibleText(flagshipMethod, flagshipDeliveryDimension.gradeBasis
      .combinationRule.currentDistribution);
    await expectVisibleText(flagshipMethod, flagshipDeliveryDimension.gradeBasis
      .combinationRule.currentGradeFromRule);
    await expect(flagshipMethod.getByText(/Combination Rule/i).first()).toBeVisible();
    await expect(
      flagshipMethod.getByText("Current snapshot", { exact: true }),
    ).toHaveCount(0);
    for (const row of snapshot) {
      await expect(
        flagshipMethod.getByText(row.evidence, { exact: true }),
      ).toHaveCount(0);
    }
    await expectNoNestedDisclosures(flagshipMethod);

    expect(ordinaryGradedDimension.latestEvidenceReview).toBeUndefined();
    await page.goto(routePath({ hash: `#dim-${ordinaryGradedDimension.id}-briefing` }));
    const { panel: ordinaryBriefing } = await expectPolicySection(
      page,
      ordinaryGradedDimension.id,
      "Briefing",
    );
    await expect(
      ordinaryBriefing.getByText(ordinaryGradedDimension.grade, { exact: true }).first(),
    ).toBeVisible();
    await expectVisibleText(ordinaryBriefing, ordinaryGradedDimension.verdictLine);
    for (const metric of ordinaryGradedDimension.metrics.filter((item) => item.lead)) {
      await expectVisibleText(ordinaryBriefing, metric.label);
    }
    const { panel: ordinaryHistory } = await selectPolicySection(
      page,
      ordinaryGradedDimension.id,
      "History",
    );
    await expect(ordinaryHistory.getByRole("alert")).toHaveCount(0);
    await expectNoNestedDisclosures(ordinaryHistory);
    const { panel: ordinaryMethod } = await selectPolicySection(
      page,
      ordinaryGradedDimension.id,
      "Method",
    );
    await expectCanonicalMethod(ordinaryMethod, ordinaryGradedDimension);
    await expectNoNestedDisclosures(ordinaryMethod);
    expect(consoleErrors).toEqual([]);
  });

  test("Evidence and Method retain canonical content without nested disclosures", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#dim-major-projects-evidence" }));

    const { panel: evidence } = await expectPolicySection(
      page,
      majorProjectsDimension.id,
      "Evidence",
    );
    await expectCanonicalEvidence(evidence, majorProjectsDimension);
    await expectNoNestedDisclosures(evidence);

    const { panel: method } = await selectPolicySection(
      page,
      majorProjectsDimension.id,
      "Method",
    );
    await expectCanonicalMethod(method, majorProjectsDimension);
    await expectNoNestedDisclosures(method);
    expect(consoleErrors).toEqual([]);
  });

  test("internal trigger sources reach cohort, scorecard, and Promises targets", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 1280, height: 900 });

    const cohortTrigger = [
      ...majorProjectsDimension.gradeTriggers.up,
      ...majorProjectsDimension.gradeTriggers.down,
    ].find((trigger) => trigger.internalRef?.type === "cohort");
    await page.goto(routePath({ hash: "#dim-major-projects-evidence" }));
    await expectPolicySection(page, majorProjectsDimension.id, "Evidence");
    const cohortControls = page.locator("#dim-major-projects-evidence button.text-link-button")
      .filter({ hasText: cohortTrigger.sourceLabel });
    expect(await cohortControls.count()).toBeGreaterThan(0);
    await cohortControls.first().click();
    await expect(page).toHaveURL(/#dim-major-projects-cohort$/);
    await expect(page.locator("#dim-major-projects-cohort")).toBeFocused();

    const anchorTrigger = [
      ...flagshipDeliveryDimension.gradeTriggers.up,
      ...flagshipDeliveryDimension.gradeTriggers.down,
    ].find((trigger) => trigger.internalRef?.type === "anchor");
    await page.goto(routePath({ hash: "#dim-execution-delivery-evidence" }));
    await expectPolicySection(page, flagshipDeliveryDimension.id, "Evidence");
    const anchorControls = page.locator("#dim-execution-delivery-evidence button.text-link-button")
      .filter({ hasText: anchorTrigger.sourceLabel });
    expect(await anchorControls.count()).toBeGreaterThan(0);
    await anchorControls.first().click();
    await expect(page).toHaveURL(/#scorecard-dimension-grid$/);
    await expect(page.locator("#scorecard-dimension-grid")).toBeFocused();
    await expect(page.locator(".desktop-focused-detail-wrap")).toHaveCount(0);

    const viewTrigger = [
      ...promiseDeliveryDimension.gradeTriggers.up,
      ...promiseDeliveryDimension.gradeTriggers.down,
    ].find((trigger) => trigger.internalRef?.type === "view");
    await page.goto(routePath({ hash: "#dim-promise-delivery-evidence" }));
    await expectPolicySection(page, promiseDeliveryDimension.id, "Evidence");
    const viewControls = page.locator("#dim-promise-delivery-evidence button.text-link-button")
      .filter({ hasText: viewTrigger.sourceLabel });
    expect(await viewControls.count()).toBeGreaterThan(0);
    await viewControls.first().click();
    await expect(page).toHaveURL(/#view-promises$/);
    await expect(page.locator("#view-promises")).toBeFocused();
    await expectNoOverflow(page);
    expect(consoleErrors).toEqual([]);
  });

  test("an internal scorecard anchor preserves its target from a card-owned history entry", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#view-scorecard" }));
    const initialHistoryLength = await page.evaluate(() => window.history.length);

    await page.locator("#dim-execution-delivery .dim-card-header-button").click();
    await expectPolicySection(page, flagshipDeliveryDimension.id, "Briefing");
    expect(await page.evaluate(() => window.history.length)).toBe(initialHistoryLength + 1);

    const { panel: evidence } = await selectPolicySection(
      page,
      flagshipDeliveryDimension.id,
      "Evidence",
    );
    const anchorTrigger = [
      ...flagshipDeliveryDimension.gradeTriggers.up,
      ...flagshipDeliveryDimension.gradeTriggers.down,
    ].find((trigger) => trigger.internalRef?.type === "anchor");
    const anchorControl = evidence.locator("button.text-link-button")
      .filter({ hasText: anchorTrigger.sourceLabel });
    expect(await anchorControl.count()).toBeGreaterThan(0);
    await anchorControl.first().click();

    await expect(page).toHaveURL(/#scorecard-dimension-grid$/);
    await expect(page.locator("#scorecard-dimension-grid")).toBeFocused();
    await expect(page.locator(".desktop-focused-detail-wrap")).toHaveCount(0);
    expect(await page.evaluate(() => window.history.state?.dimModal ?? null)).toBeNull();
    expect(await page.evaluate(() => window.history.length)).toBe(initialHistoryLength + 1);

    const sidebar = page.locator(".app-workspace-sidebar");
    await sidebar.getByRole("button", { name: "Promises" }).click();
    await expect(page).toHaveURL(/#view-promises$/);
    await expect(page.locator("#view-promises")).toBeFocused();

    await page.goBack();
    await expect(page).toHaveURL(/#scorecard-dimension-grid$/);
    await expect(page.locator("#scorecard-dimension-grid")).toBeFocused();
    await expectActiveNav(page, "Scorecard");

    await page.goBack();
    await expect(page).toHaveURL(/#view-scorecard$/);
    await expect(page.locator(".desktop-focused-detail-wrap")).toHaveCount(0);
    await expectNoOverflow(page);
    expect(consoleErrors).toEqual([]);
  });

  test("the skip link keeps a non-Scorecard view mounted", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#view-promises" }));
    await expect(page.locator(".app-promise-tracker")).toBeVisible();
    await expect(page.locator("#view-promises")).toBeFocused();
    await expectActiveNav(page, "Promises");

    const skipLink = page.getByRole("link", { name: "Skip to main content" });
    await skipLink.focus();
    await expect(skipLink).toBeFocused();
    await page.keyboard.press("Enter");

    await expect(page).toHaveURL(/#main-content$/);
    await expect(page.locator("#main-content")).toBeFocused();
    await expect(page.locator(".app-promise-tracker")).toBeVisible();
    await expectActiveNav(page, "Promises");
    expect(consoleErrors).toEqual([]);
  });

  test("forced-colors keeps the active workspace view and focus distinguishable", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.emulateMedia({ forcedColors: "active" });
    await page.goto(routePath({ hash: "#dim-housing-supply-briefing" }));

    expect(await page.evaluate(() => window.matchMedia("(forced-colors: active)").matches))
      .toBe(true);
    const currentControl = policySectionControl(page, "Briefing");
    await expect(currentControl).toHaveAttribute("aria-current", "page");
    await expect(currentControl).toBeFocused();

    const styles = await page.evaluate(() => {
      const current = document.querySelector('.dimension-workspace-tab[aria-current="page"]');
      const inactive = Array.from(document.querySelectorAll(".dimension-workspace-tab"))
        .find((control) => !control.hasAttribute("aria-current"));
      const currentStyle = getComputedStyle(current);
      const inactiveStyle = getComputedStyle(inactive);
      return {
        forcedColorAdjust: currentStyle.forcedColorAdjust,
        currentBackground: currentStyle.backgroundColor,
        inactiveBackground: inactiveStyle.backgroundColor,
        currentColor: currentStyle.color,
        inactiveColor: inactiveStyle.color,
        outlineStyle: currentStyle.outlineStyle,
        outlineWidth: currentStyle.outlineWidth,
      };
    });

    expect(styles.forcedColorAdjust).toBe("none");
    expect(styles.currentBackground).not.toBe(styles.inactiveBackground);
    expect(styles.currentColor).not.toBe(styles.inactiveColor);
    expect(styles.outlineStyle).not.toBe("none");
    expect(styles.outlineWidth).not.toBe("0px");
    await expectNoOverflow(page);
    expect(consoleErrors).toEqual([]);
  });

  test("forced-colors keeps the first-look briefing, signals, and focused route distinguishable", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.emulateMedia({ forcedColors: "active" });
    await page.goto(routePath({ hash: "#view-scorecard" }));

    expect(await page.evaluate(() => window.matchMedia("(forced-colors: active)").matches))
      .toBe(true);
    const region = firstLookRegion(page);
    const policyRoute = region.getByRole("link", { name: "Inspect the 11 policy files" });
    await expect(region).toBeVisible();
    await policyRoute.focus();
    await expect(policyRoute).toBeFocused();

    const styles = await region.evaluate((node) => {
      const primary = node.querySelector(".first-look-primary-wrap");
      const action = node.querySelector(".first-look-action-primary");
      const signal = node.querySelector(".first-look-signal");
      const primaryStyle = getComputedStyle(primary);
      const actionStyle = getComputedStyle(action);
      const signalStyle = getComputedStyle(signal);
      return {
        actionForcedColorAdjust: actionStyle.forcedColorAdjust,
        actionOutlineStyle: actionStyle.outlineStyle,
        actionOutlineWidth: actionStyle.outlineWidth,
        primaryBackground: primaryStyle.backgroundColor,
        primaryBorderStyle: primaryStyle.borderStyle,
        signalBackground: signalStyle.backgroundColor,
        signalBorderStyle: signalStyle.borderStyle,
      };
    });

    expect(styles.actionForcedColorAdjust).toBe("none");
    expect(styles.actionOutlineStyle).not.toBe("none");
    expect(styles.actionOutlineWidth).not.toBe("0px");
    expect(styles.primaryBackground).not.toBe("rgba(0, 0, 0, 0)");
    expect(styles.signalBackground).not.toBe("rgba(0, 0, 0, 0)");
    expect(styles.primaryBorderStyle).not.toBe("none");
    expect(styles.signalBorderStyle).not.toBe("none");
    await expectNoOverflow(page);
    expect(consoleErrors).toEqual([]);
  });

  test("desktop panel navigation replaces history and policy switching returns to Briefing", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    const scoredPolicies = dimensions.filter((dim) => !dim.excludeFromGPA);
    const housingIndex = scoredPolicies.findIndex((dim) => dim.id === housingDimension.id);
    const previousPolicy = scoredPolicies[(housingIndex - 1 + scoredPolicies.length) % scoredPolicies.length];
    const nextPolicy = scoredPolicies[(housingIndex + 1) % scoredPolicies.length];
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#view-scorecard" }));

    const housingHeader = page.locator("#dim-housing-supply-header");
    await housingHeader.focus();
    await housingHeader.click();
    await expect(page).toHaveURL(/#dim-housing-supply-briefing$/);
    await expect(page.locator("#dim-housing-supply-title")).toBeFocused();
    await expectPolicySection(page, housingDimension.id, "Briefing");
    const dimensionEntryLength = await page.evaluate(() => window.history.length);

    for (const section of ["Evidence", "History", "Method"]) {
      const { currentControl } = await selectPolicySection(page, housingDimension.id, section);
      await expect(currentControl).toBeFocused();
      expect(await page.evaluate(() => window.history.length)).toBe(dimensionEntryLength);
    }

    await page.goBack();
    await expect(page).toHaveURL(/#view-scorecard$/);
    await expect(page.locator("#scorecard-dimension-grid")).toBeVisible();
    await expect(housingHeader).toBeFocused();

    await housingHeader.click();
    await page.getByRole("button", { name: `Next policy: ${nextPolicy.name}` }).click();
    await expect(page).toHaveURL(new RegExp(`#dim-${nextPolicy.id}-briefing$`));
    await expect(page.locator(`#dim-${nextPolicy.id}-title`)).toBeFocused();
    await expectPolicySection(page, nextPolicy.id, "Briefing");

    await page.getByRole("button", { name: `Previous policy: ${housingDimension.name}` }).click();
    await page.getByRole("button", { name: `Previous policy: ${previousPolicy.name}` }).click();
    await expect(page).toHaveURL(new RegExp(`#dim-${previousPolicy.id}-briefing$`));
    await expectPolicySection(page, previousPolicy.id, "Briefing");
    await expectNoOverflow(page);
    expect(consoleErrors).toEqual([]);
  });

  test("mobile workspace is full-screen, locked, navigable, and exits with Escape, Close, or Back", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(routePath({ hash: "#view-scorecard" }));
    const housingHeader = page.locator("#dim-housing-supply-header");

    const openHousing = async () => {
      await housingHeader.scrollIntoViewIfNeeded();
      await housingHeader.click();
      await expect(page).toHaveURL(/#dim-housing-supply-briefing$/);
      const dialog = page.locator('[role="dialog"][aria-modal="true"]');
      await expect(dialog).toBeVisible();
      const visibleTitle = dialog.locator(".dim-drawer-title");
      await expect(visibleTitle).toHaveText(housingDimension.name);
      await expect(visibleTitle).toHaveAttribute("tabindex", "-1");
      const visibleTitleId = await visibleTitle.getAttribute("id");
      expect(visibleTitleId).toBeTruthy();
      await expect(page.locator(`#${visibleTitleId}`)).toHaveCount(1);
      await expect(dialog).toHaveAttribute("aria-labelledby", visibleTitleId);
      await expect(dialog).toHaveAccessibleName(housingDimension.name);
      await expect(visibleTitle).toBeFocused();
      await expect.poll(async () => dialog.evaluate((node) => {
        const rect = node.getBoundingClientRect();
        return (
          rect.left <= 1
          && rect.top <= 1
          && rect.right >= window.innerWidth - 1
          && rect.bottom >= window.innerHeight - 1
          && rect.right <= window.innerWidth + 1
          && rect.bottom <= window.innerHeight + 1
        );
      })).toBe(true);
      await expect.poll(async () => page.evaluate(() => (
        getComputedStyle(document.body).overflow === "hidden"
        || document.body.style.position === "fixed"
      ))).toBe(true);
      await expectPolicySection(page, housingDimension.id, "Briefing");
      await expectNoOverflow(page);
      return { dialog, visibleTitle };
    };

    await openHousing();
    await selectPolicySection(page, housingDimension.id, "Method");
    await page.keyboard.press("Escape");
    await expect(page.locator('[role="dialog"][aria-modal="true"]')).toHaveCount(0);
    await expect(page).toHaveURL(/#view-scorecard$/);
    await expect(housingHeader).toBeFocused();

    await openHousing();
    await page.getByRole("button", { name: "Close", exact: true }).click();
    await expect(page.locator('[role="dialog"][aria-modal="true"]')).toHaveCount(0);
    await expect(page).toHaveURL(/#view-scorecard$/);
    await expect(housingHeader).toBeFocused();

    await openHousing();
    const dimensionEntryLength = await page.evaluate(() => window.history.length);
    await selectPolicySection(page, housingDimension.id, "Evidence");
    expect(await page.evaluate(() => window.history.length)).toBe(dimensionEntryLength);
    await page.goBack();
    await expect(page.locator('[role="dialog"][aria-modal="true"]')).toHaveCount(0);
    await expect(page).toHaveURL(/#view-scorecard$/);
    await expect.poll(async () => page.evaluate(() => (
      getComputedStyle(document.body).overflow !== "hidden"
      && document.body.style.position !== "fixed"
    ))).toBe(true);
    await expect(housingHeader).toBeFocused();

    await page.goForward();
    await expect(page).toHaveURL(/#dim-housing-supply-evidence$/);
    const reopenedDialog = page.locator('[role="dialog"][aria-modal="true"]');
    await expect(reopenedDialog).toBeVisible();
    const reopenedTitle = reopenedDialog.locator(".dim-drawer-title");
    await expect(reopenedTitle).toHaveText(housingDimension.name);
    await expect(reopenedDialog).toHaveAccessibleName(housingDimension.name);
    const { currentControl: reopenedEvidenceControl } = await expectPolicySection(
      page,
      housingDimension.id,
      "Evidence",
    );
    await expect(reopenedEvidenceControl).toBeFocused();
    await expect(reopenedTitle).not.toBeFocused();

    await page.goBack();
    await expect(page.locator('[role="dialog"][aria-modal="true"]')).toHaveCount(0);
    await expect(page).toHaveURL(/#view-scorecard$/);
    await expect(housingHeader).toBeFocused();
    await expectNoOverflow(page);
    expect(consoleErrors).toEqual([]);
  });

  for (const legacyRoute of [
    { hash: "#dim-housing-supply", dimensionId: "housing-supply", section: "Briefing" },
    {
      hash: "#dim-housing-supply-triggers-section",
      dimensionId: "housing-supply",
      section: "Briefing",
      contentTarget: "#dim-housing-supply-triggers-section",
    },
    { hash: "#dim-defence-trade-headline-title", dimensionId: "defence-trade", section: "Briefing" },
    { hash: "#dim-major-projects-sources", dimensionId: "major-projects", section: "Evidence" },
    { hash: "#dim-major-projects-cohort-table", dimensionId: "major-projects", section: "Evidence" },
    { hash: "#dim-promise-delivery-tracker-triggers", dimensionId: "promise-delivery", section: "Evidence" },
    { hash: "#dim-defence-trade-subscores", dimensionId: "defence-trade", section: "Method" },
    { hash: "#dim-housing-supply-scoring", dimensionId: "housing-supply", section: "Method" },
  ]) {
    test(`legacy ${legacyRoute.hash} routes to ${legacyRoute.section}`, async ({ page }) => {
      const consoleErrors = await installConsoleGuards(page);
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(routePath({ hash: legacyRoute.hash }));

      await expect(page).toHaveURL(new RegExp(
        `#dim-${legacyRoute.dimensionId}-${legacyRoute.section.toLowerCase()}$`,
      ));
      const { currentControl } = await expectPolicySection(
        page,
        legacyRoute.dimensionId,
        legacyRoute.section,
      );
      if (legacyRoute.contentTarget) {
        const contentTarget = page.locator(legacyRoute.contentTarget);
        await expect(contentTarget).toBeVisible();
        await expectVisibleText(contentTarget, housingDimension.nextTrigger);
        await expect(currentControl).toBeFocused();
      }
      await expectNoOverflow(page);
      expect(consoleErrors).toEqual([]);
    });
  }

  test("a mobile legacy Evidence link canonicalizes and focuses its view control", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(routePath({ hash: "#dim-major-projects-sources" }));

    await expect(page).toHaveURL(/#dim-major-projects-evidence$/);
    const { currentControl } = await expectPolicySection(page, majorProjectsDimension.id, "Evidence");
    await expect(currentControl).toBeFocused();
    await expect(page.locator('[role="dialog"][aria-modal="true"]')).toBeVisible();
    await expectNoOverflow(page);
    expect(consoleErrors).toEqual([]);
  });
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
  await page.locator(".first-look-signal-promises").click();
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
    await page.goto(routePath({ hash: "#dim-fiscal-health-briefing" }));

    await expect(page.locator(".desktop-focused-detail-wrap")).toBeVisible();
    await expect(page.getByText("Why not higher:")).toHaveCount(1);
    await expect(page.getByText("Why not lower:")).toHaveCount(1);
    await expect(
      page.getByText("The next band up needs the deficit below 2% of the economy's size"),
    ).toHaveCount(1);
    expect(consoleErrors).toEqual([]);
  });
});

test.describe("dimension workspace history and contextual share contract", () => {
  test("Housing separates the dated evidence record from canonical evidence on desktop and mobile", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);

    for (const viewport of [
      { width: 1280, height: 900 },
      { width: 375, height: 812 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto(routePath({ hash: "#dim-housing-supply-history" }));

      const { panel: history } = await expectPolicySection(page, housingDimension.id, "History");
      await expectVisibleText(history, "Evidence earning credit");
      await expectVisibleText(history, "Evidence limiting credit");
      await expectVisibleText(history, "Still unproven");
      await expectVisibleText(history, housingDimension.latestEvidenceReview.outcome);
      for (const pageChecked of housingDimension.latestEvidenceReview.pagesChecked) {
        await expect(
          history.getByRole("link", { name: pageChecked.label, exact: true }).first(),
        ).toHaveAttribute("href", pageChecked.url);
      }
      await expectNoNestedDisclosures(history);

      const { panel: evidence } = await selectPolicySection(page, housingDimension.id, "Evidence");
      for (const source of housingDimension.sources) {
        await expect(
          evidence.getByRole("link", { name: source.label, exact: true }).first(),
        ).toHaveAttribute("href", source.url);
      }
      await expect(evidence.getByText("Tier", { exact: true })).toHaveCount(0);
      await expectNoNestedDisclosures(evidence);
      await expectNoOverflow(page);
    }

    expect(consoleErrors).toEqual([]);
  });

  test("desktop policy switching wraps without building a Back stack", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    const scoredPolicies = dimensions.filter((dim) => !dim.excludeFromGPA);
    const firstPolicy = scoredPolicies[0];
    const lastPolicy = scoredPolicies[scoredPolicies.length - 1];
    const housingIndex = scoredPolicies.findIndex((dim) => dim.id === "housing-supply");
    const nextHousingPolicy = scoredPolicies[(housingIndex + 1) % scoredPolicies.length];

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#view-scorecard" }));
    await page.locator("#dim-housing-supply-header").click();
    await page.getByRole("button", { name: `Next policy: ${nextHousingPolicy.name}` }).click();

    await expect(page).toHaveURL(new RegExp(`#dim-${nextHousingPolicy.id}-briefing$`));
    await expect(page.locator(`#dim-${nextHousingPolicy.id}-title`)).toBeFocused();
    await expect(page.locator(".app-policy-navigation-announcer"))
      .toHaveText(`${nextHousingPolicy.name}, grade ${nextHousingPolicy.grade}`);
    await expect.poll(async () => page.evaluate(() => {
      const grid = document.getElementById("scorecard-dimension-grid");
      if (!grid) return false;
      const top = grid.getBoundingClientRect().top;
      return top >= -1 && top < 120;
    })).toBe(true);

    await page.goBack();
    await expect(page.locator(".desktop-focused-detail-wrap")).toHaveCount(0);
    await expect(page).toHaveURL(/#view-scorecard$/);

    await page.goto(routePath({ hash: `#dim-${firstPolicy.id}-briefing` }));
    await page.getByRole("button", { name: `Previous policy: ${lastPolicy.name}` }).click();
    await expect(page).toHaveURL(new RegExp(`#dim-${lastPolicy.id}-briefing$`));
    await page.locator(".dim-drawer-close").click();
    await expect(page).toHaveURL(/#view-scorecard$/);

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(routePath({ hash: "#dim-housing-supply-briefing" }));
    await expect(page.locator(".dim-policy-switcher")).toHaveCount(0);
    await expectNoOverflow(page);
    expect(consoleErrors).toEqual([]);
  });

  test("mobile card open pushes a #dim entry and Back closes the sheet", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(routePath());

    const cardHeader = page.locator("#dim-housing-supply-header");
    await cardHeader.scrollIntoViewIfNeeded();
    await cardHeader.focus();
    const scrollBeforeOpen = await page.evaluate(() => window.scrollY);
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#dim-[a-z-]+-briefing$/);
    await expect(page.locator('[role="dialog"][aria-modal="true"]')).toBeVisible();

    // The back-gesture invariant: browser Back (the same history traversal an
    // iOS edge-swipe or Android back button produces) closes the sheet and
    // rewinds the URL to what preceded the open.
    await page.goBack();
    await expect(page.locator('[role="dialog"][aria-modal="true"]')).toHaveCount(0);
    await expect.poll(() => new URL(page.url()).hash).toBe("");
    await expectActiveNav(page, "Scorecard");
    await expect.poll(async () => page.evaluate(() => document.activeElement?.id || ""))
      .toBe("dim-housing-supply-header");
    const scrollAfterBack = await page.evaluate(() => window.scrollY);
    expect(scrollAfterBack).toBeCloseTo(scrollBeforeOpen, 0);
    await expect.poll(async () => page.evaluate(() => {
      const header = document.getElementById("dim-housing-supply-header");
      const bottomNav = document.querySelector(".app-bottom-nav");
      if (!header || !bottomNav) return false;
      const headerRect = header.getBoundingClientRect();
      const bottomNavTop = bottomNav.getBoundingClientRect().top;
      return headerRect.top >= 0 && headerRect.bottom <= bottomNavTop;
    })).toBe(true);
    await expectNoOverflow(page);
    expect(consoleErrors).toEqual([]);
  });

  test("desktop card open pushes a #dim entry and Back restores grid, URL, and focus", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath());

    const cardHeader = page.locator("#dim-housing-supply-header");
    await cardHeader.scrollIntoViewIfNeeded();
    await cardHeader.focus();
    const scrollBeforeOpen = await page.evaluate(() => window.scrollY);
    await cardHeader.click();
    await expect(page.locator(".desktop-focused-detail-wrap")).toBeVisible();
    await expect(page).toHaveURL(/#dim-[a-z-]+-briefing$/);

    await page.goBack();
    await expect(page.locator(".desktop-focused-detail-wrap")).toHaveCount(0);
    await expect(page.locator("#scorecard-dimension-grid")).toBeVisible();
    await expect.poll(() => new URL(page.url()).hash).toBe("");
    await expect.poll(async () => page.evaluate(() => document.activeElement?.id || ""))
      .toBe("dim-housing-supply-header");
    await expect.poll(async () => page.evaluate(() => window.scrollY))
      .toBeCloseTo(scrollBeforeOpen, 0);
    await expect.poll(async () => page.evaluate(() => {
      const header = document.getElementById("dim-housing-supply-header");
      if (!header) return false;
      const headerRect = header.getBoundingClientRect();
      return headerRect.top >= 0 && headerRect.bottom <= window.innerHeight;
    })).toBe(true);
    await expectNoOverflow(page);
    expect(consoleErrors).toEqual([]);
  });

  test("deep-link arrival close stays on the site and lands on the scorecard URL", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#dim-fiscal-health-briefing" }));

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

  test("a card reopened after a direct panel link starts on Briefing", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#dim-major-projects-evidence" }));

    await expectPolicySection(page, majorProjectsDimension.id, "Evidence");
    await page.getByRole("button", { name: "Close", exact: true }).click();
    await expect(page).toHaveURL(/#view-scorecard$/);

    await page.locator("#dim-major-projects-header").click();
    await expect(page).toHaveURL(/#dim-major-projects-briefing$/);
    await expectPolicySection(
      page,
      majorProjectsDimension.id,
      "Briefing",
    );
    await expect(page.locator("#dim-major-projects-title")).toBeFocused();
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
        Object.defineProperty(navigator, "canShare", {
          configurable: true,
          value: () => true,
        });
      } catch { /* keep the native value if the property refuses override */ }
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#view-scorecard" }));

    await page.locator("#dim-housing-supply-header").click();
    await expect(page).toHaveURL(/#dim-housing-supply-briefing$/);
    const deepLink = page.url();

    await page.getByRole("button", { name: "Share this card" }).click();
    await expect(page.getByText("Share text copied", { exact: true })).toBeVisible();
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe([
      "Canada Under Carney performance scorecard",
      "Housing Supply",
      "Grade: D | Trend: Stable",
      `Policy file reviewed: ${housingReviewedDate}`,
      "Evidence and grading method:",
      deepLink,
    ].join("\n"));
    expect(clipboardText.split("\n").at(-1)).toBe(deepLink);
    expect(consoleErrors).toEqual([]);
  });

  test("native Share receives grade, trend, review date, and the exact deep link", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "share", {
        configurable: true,
        value: async (payload) => {
          window.__dashboardSharePayload = payload;
        },
      });
      Object.defineProperty(navigator, "canShare", {
        configurable: true,
        value: () => true,
      });
    });
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(routePath({ hash: "#dim-housing-supply-briefing" }));

    await page.getByRole("button", { name: "Share this card" }).click();
    const sharePayload = await page.evaluate(() => window.__dashboardSharePayload);
    expect(sharePayload).toEqual({
      title: "Housing Supply | Canada Under Carney",
      text: [
        "Canada Under Carney performance scorecard",
        "Housing Supply",
        "Grade: D | Trend: Stable",
        `Policy file reviewed: ${housingReviewedDate}`,
        "Evidence and grading method:",
      ].join("\n"),
      url: page.url(),
    });
    expect(consoleErrors).toEqual([]);
  });

  test("native Share keeps Promise Delivery ungraded and includes its count", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "share", {
        configurable: true,
        value: async (payload) => {
          window.__dashboardSharePayload = payload;
        },
      });
      Object.defineProperty(navigator, "canShare", {
        configurable: true,
        value: () => true,
      });
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#dim-promise-delivery-briefing" }));

    await page.getByRole("button", { name: "Share this card" }).click();
    const sharePayload = await page.evaluate(() => window.__dashboardSharePayload);
    expect(sharePayload.title).toBe("Promise Delivery | Canada Under Carney");
    expect(sharePayload.text).toContain("Delivered: 14 of 43 | Tracker trend: Stable");
    expect(sharePayload.text).toContain("No letter grade. Not included in headline scores.");
    expect(sharePayload.text).not.toContain("C+");
    expect(sharePayload.url).toBe(page.url());
    expect(consoleErrors).toEqual([]);
  });

  test("canShare false skips Web Share and copies the contextual payload", async ({ page, context }) => {
    const consoleErrors = await installConsoleGuards(page);
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "share", {
        configurable: true,
        value: async () => {
          throw new Error("navigator.share must not run when canShare is false");
        },
      });
      Object.defineProperty(navigator, "canShare", {
        configurable: true,
        value: () => false,
      });
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#dim-housing-supply-briefing" }));

    await page.getByRole("button", { name: "Share this card" }).click();
    await expect(page.getByText("Share text copied", { exact: true })).toBeVisible();
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain("Grade: D | Trend: Stable");
    expect(clipboardText.split("\n").at(-1)).toBe(page.url());
    expect(consoleErrors).toEqual([]);
  });

  test("dismissing the native share sheet does not overwrite the clipboard", async ({ page, context }) => {
    const consoleErrors = await installConsoleGuards(page);
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "share", {
        configurable: true,
        value: async () => {
          const error = new Error("reader dismissed share sheet");
          error.name = "AbortError";
          throw error;
        },
      });
      Object.defineProperty(navigator, "canShare", {
        configurable: true,
        value: () => true,
      });
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#dim-housing-supply-briefing" }));
    await page.evaluate(() => navigator.clipboard.writeText("keep existing clipboard"));

    await page.getByRole("button", { name: "Share this card" }).click();
    await expect(page.getByText("Share text copied", { exact: true })).toHaveCount(0);
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("keep existing clipboard");
    expect(consoleErrors).toEqual([]);
  });

  test("clipboard rejection does not show false copied feedback", async ({ page }) => {
    const consoleErrors = await installConsoleGuards(page);
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "share", {
        configurable: true,
        value: undefined,
      });
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: async () => {
            throw new Error("clipboard denied");
          },
        },
      });
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(routePath({ hash: "#dim-housing-supply-briefing" }));

    await page.getByRole("button", { name: "Share this card" }).click();
    await expect(page.getByText("Share text copied", { exact: true })).toHaveCount(0);
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
    {
      hash: "#dim-fiscal-health-method",
      nav: "Scorecard",
      selector: "#dim-fiscal-health-method",
    },
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
    await expect(policyDetailNavigation(page)).toBeVisible();
    await expect(policySectionControl(page, "Briefing")).toHaveAttribute("aria-current", /.+/);
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

    await expect(page).toHaveURL(/#dim-major-projects-evidence$/);
    const { currentControl } = await expectPolicySection(page, "major-projects", "Evidence");
    await expect(currentControl).toBeFocused();
    expect(consoleErrors).toEqual([]);
  });

  for (const viewport of [
    { name: "desktop", width: 1280, height: 900 },
    { name: "mobile", width: 375, height: 812 },
  ]) {
    test(`a delayed policy-detail load keeps focus inside the ${viewport.name} workspace`, async ({ page }) => {
      await page.route("**/assets/dimensions-*.json", async (route) => {
        const response = await route.fetch();
        await new Promise((resolve) => setTimeout(resolve, 750));
        await route.fulfill({ response });
      });
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(routePath({ hash: "#view-scorecard" }));

      await page.locator(".dim-card-header-button").first().click();
      await expect(policyDetailNavigation(page)).toBeVisible();
      const workspace = viewport.name === "mobile"
        ? page.locator('[role="dialog"][aria-modal="true"]')
        : page.locator(".desktop-focused-detail-wrap");
      await expect.poll(async () => workspace.evaluate((node) => (
        node.contains(document.activeElement)
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
    await expect(policyDetailNavigation(page)).toBeVisible();
    await expect(policySectionControl(page, "Briefing")).toHaveAttribute("aria-current", /.+/);
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
    await firstLookRegion(page)
      .getByRole("link", { name: "Read the scoring method" })
      .click();

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
