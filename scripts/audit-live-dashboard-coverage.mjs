#!/usr/bin/env node
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [
  { default: dimensions },
  { default: meta },
  { default: changelog },
  { default: dashboardStatus },
] = await Promise.all([
  import("../src/data/dimensions.json", { with: { type: "json" } }),
  import("../src/data/meta.json", { with: { type: "json" } }),
  import("../src/data/changelog.json", { with: { type: "json" } }),
  import("../src/data/status.json", { with: { type: "json" } }),
]);

const baseUrl = process.env.LIVE_AUDIT_URL || "https://sawatter.github.io/canada-under-carney/";
const generatedAt = new Date();
const stamp = generatedAt.toISOString().replace(/[:.]/g, "-");
const outDir = path.join(repoRoot, "tmp", "live-coverage-audit", stamp);

const contexts = [
  { name: "desktop", width: 1366, height: 900 },
  { name: "mobile", width: 375, height: 812 },
];

const rowStatus = {
  pass: "PASS",
  issue: "ISSUE",
};

const dimensionPanels = [
  { id: "briefing", label: "Briefing" },
  { id: "evidence", label: "Evidence" },
  { id: "history", label: "History" },
  { id: "method", label: "Method" },
];

const methodGlossaryStrings = [
  "Confidence - how resistant the grade is to new data. High = direct measurement against numeric thresholds. Medium = qualitative judgment with mixed evidence. Low = sparse evidence.",
  "Attribution - what share of the outcome the federal government actually controls. Direct = at least 60% federal levers. Mixed = 30 to 60%. Mostly inherited = less than 30%.",
  "Lag - how long policy effects take to show in the metrics. Short = monthly / quarterly. Medium = 1 to 2 year cycles. Long = 5+ year structural. Event-driven = this area moves on specific disclosures or rulings rather than a fixed schedule.",
];

const rows = [];
const issues = [];

function dashboardUrl(hash = "") {
  const url = new URL(baseUrl);
  url.hash = hash;
  return url.toString();
}

function addRow({ surface, viewport, action, observed, status = rowStatus.pass, severity = "", recommendation = "" }) {
  const row = {
    "#": rows.length + 1,
    surface,
    viewport,
    action,
    observed,
    status,
    severity,
    recommendation,
  };
  rows.push(row);
  if (status === rowStatus.issue) issues.push(row);
  return row;
}

async function auditStep(step) {
  try {
    return await step();
  } catch (error) {
    addRow({
      surface: step.surface || "Unnamed audit step",
      viewport: step.viewport || "unknown",
      action: step.action || "Playwright action",
      observed: error.message,
      status: rowStatus.issue,
      severity: "P2",
      recommendation: "Reproduce this step manually and fix if it is user-visible.",
    });
    return null;
  }
}

function textSnippet(value) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, 220);
}

function yearMonth(value) {
  return String(value || "").slice(0, 7).replace("-", "/");
}

function presenceStatus(missing) {
  return {
    status: missing.length ? rowStatus.issue : rowStatus.pass,
    severity: missing.length ? "P2" : "",
    recommendation: missing.length ? `Restore or relabel missing required rendered text: ${missing.join(", ")}.` : "",
  };
}

function normalizeText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function dimensionPanelId(dimId, panelId) {
  return `dim-${dimId}-${panelId}`;
}

function collectSubstantiveStrings(value) {
  if (typeof value === "string") return value.length >= 8 ? [value] : [];
  if (Array.isArray(value)) return value.flatMap(collectSubstantiveStrings);
  if (value && typeof value === "object") {
    return Object.values(value).flatMap(collectSubstantiveStrings);
  }
  return [];
}

function uniqueStrings(values) {
  return [...new Set(values.filter(Boolean).map(normalizeText))];
}

function missingRenderedText(renderedText, expectedValues) {
  const normalizedRenderedText = normalizeText(renderedText);
  return uniqueStrings(expectedValues).filter((value) => !normalizedRenderedText.includes(value));
}

function methodStringsForDimension(dim) {
  const subScores = Object.values(dim.subScores || {}).flatMap((subScore) => [
    subScore.label,
    subScore.rationale,
    ...(subScore.thresholds || []).map((threshold) => threshold.criteria),
  ]);

  return uniqueStrings([
    dim.construct,
    dim.gradeBasis?.bandCriterion,
    dim.gradeBasis?.plusMinusRationale,
    dim.scoring?.scopeNote,
    dim.scoring?.modifierExpiry,
    ...(dim.scoring?.thresholds || []).map((threshold) => threshold.criteria),
    ...(dim.scoring?.guardrails || []),
    ...collectSubstantiveStrings(dim.scoring?.subScoreRule),
    ...subScores,
    ...collectSubstantiveStrings({
      combinationRule: dim.gradeBasis?.combinationRule,
      componentOperationalization: dim.gradeBasis?.componentOperationalization,
      componentScoreSummary: dim.gradeBasis?.componentScoreSummary,
      leverOperationalization: dim.gradeBasis?.leverOperationalization,
      leverScoreSummary: dim.gradeBasis?.leverScoreSummary,
    }),
    ...(dim.gradeBasis?.activeModifiers || []).flatMap((modifier) => [modifier.status, modifier.reason]),
    dim.inherited,
    ...(dim.scope?.inScope || []).flatMap(collectSubstantiveStrings),
    ...(dim.scope?.outOfScope || []).flatMap(collectSubstantiveStrings),
    dim.tags?.confidence,
    dim.tags?.attribution,
    dim.tags?.lag,
    ...(dim.tags ? methodGlossaryStrings : []),
  ]);
}

function methodAnchorIdsForDimension(dim) {
  const hasScopeContext = Boolean(
    dim.scoring?.scopeNote
    || dim.tags?.attribution
    || dim.tags?.lag
    || dim.gradeBasis?.activeModifiers?.length
    || dim.scope
    || dim.inherited,
  );
  return [
    `dim-${dim.id}-scoring`,
    dim.subScores && !dim.excludeFromGPA ? `dim-${dim.id}-subscores` : null,
    dim.gradeBasis?.leverOperationalization ? `dim-${dim.id}-lever-operationalization` : null,
    dim.gradeBasis?.componentOperationalization ? `dim-${dim.id}-component-operationalization` : null,
    dim.gradeBasis?.combinationRule ? `dim-${dim.id}-combination-rule` : null,
    hasScopeContext ? `dim-${dim.id}-caveats` : null,
    dim.tags ? `dim-${dim.id}-glossary` : null,
  ].filter(Boolean);
}

function evidenceLinksForDimension(dim) {
  const triggers = [
    ...(dim.gradeTriggers?.up || []),
    ...(dim.gradeTriggers?.down || []),
  ];
  const links = [
    ...(dim.sources || []).map((source) => ({
      kind: "source",
      label: source.label,
      url: source.url,
    })),
    ...(dim.metrics || []).flatMap((metric) => (metric.sourceRefs || []).map((source) => ({
      kind: `metric ${metric.label}`,
      label: source.label,
      url: source.url,
    }))),
    ...(dim.promises || []).flatMap((promise) => [
      {
        kind: `promise original ${promise.text}`,
        label: promise.originalSourceLabel,
        url: promise.originalSourceUrl,
      },
      {
        kind: `promise status ${promise.text}`,
        label: promise.statusSourceLabel,
        url: promise.statusSourceUrl,
      },
    ]),
    ...triggers.flatMap((trigger) => [
      {
        kind: `trigger ${trigger.text}`,
        label: trigger.sourceLabel,
        url: trigger.sourceUrl,
      },
      ...(trigger.additionalSources || []).map((source) => ({
        kind: `trigger challenge ${trigger.text}`,
        label: source.label,
        url: source.url,
      })),
    ]),
    ...(dim.projectCohort?.projects || []).map((project) => ({
      kind: `project ${project.name}`,
      label: project.sourceLabel || "Project source",
      url: project.sourceUrl,
    })),
  ].filter((link) => link.url);

  return [...new Map(links.map((link) => [`${link.kind}:${link.url}`, link])).values()];
}

function internalTriggerRoutes() {
  const routes = dimensions.flatMap((dim) => [
    ...(dim.gradeTriggers?.up || []),
    ...(dim.gradeTriggers?.down || []),
  ]
    .filter((trigger) => trigger.internalRef)
    .map((trigger) => ({ dim, trigger, ref: trigger.internalRef })));

  return [...new Map(routes.map((route) => [
    `${route.dim.id}:${JSON.stringify(route.ref)}`,
    route,
  ])).values()];
}

async function installRoutes(context) {
  const analyticsStub = async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/javascript",
      body: "/* third-party asset stubbed for deterministic audit */",
    });
  };
  await context.route("http://gc.zgo.at/**", analyticsStub);
  await context.route("https://gc.zgo.at/**", analyticsStub);
  await context.route("https://carneydashboard.goatcounter.com/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ count_unique: 133 }),
    });
  });
}

async function gotoApp(page, hash = "view-scorecard") {
  await page.goto(dashboardUrl(hash), { waitUntil: "domcontentloaded" });
  await page.locator(".app-shell").waitFor({ state: "visible", timeout: 15_000 });
  await page.getByRole("heading", { name: "Canada Under Carney", level: 1 }).waitFor({ timeout: 15_000 });
  await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => {});
}

async function revealDashboardStatusDetails(page) {
  const toggle = page.getByRole("button", { name: "Show details", exact: true });
  if (await toggle.count() > 0) await toggle.click();
  await page.locator("#dashboard-status-details").waitFor({ state: "visible", timeout: 5_000 });
}

async function expectNoHorizontalOverflow(page, viewportName, surface) {
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  if (overflow.scrollWidth > overflow.clientWidth + 1) {
    addRow({
      surface,
      viewport: viewportName,
      action: "Measure document horizontal overflow",
      observed: `scrollWidth ${overflow.scrollWidth}, clientWidth ${overflow.clientWidth}`,
      status: rowStatus.issue,
      severity: "P1",
      recommendation: "Find the widest child at this viewport and add wrapping or overflow containment.",
    });
  }
}

async function auditGlobalSurfaces(page, viewportName) {
  await auditStep(Object.assign(async () => {
    await gotoApp(page);
    const observed = await page.evaluate((expected) => {
      const text = document.body.textContent || "";
      return {
        title: document.querySelector("h1")?.textContent?.trim(),
        version: text.includes(`v${expected.version}`),
        updated: text.includes(expected.lastUpdated),
        coverage: text.includes(expected.coverageStart) && text.includes(expected.coverageEnd),
        trust: ["What this is", "What this isn", "How to check it"].every((needle) => text.includes(needle)),
        cards: ["Household Impact", "Full Policy Audit", "Promises Delivered", "Approval Signal"].every((needle) => text.includes(needle)),
      };
    }, {
      version: meta.version,
      lastUpdated: meta.lastUpdated,
      coverageStart: yearMonth(meta.coveragePeriod?.start),
      coverageEnd: yearMonth(meta.coveragePeriod?.end),
    });
    const missing = [
      observed.title === "Canada Under Carney" ? "" : "Canada Under Carney h1",
      observed.version ? "" : `v${meta.version}`,
      observed.updated ? "" : meta.lastUpdated,
      observed.coverage ? "" : "coverage period",
      observed.trust ? "" : "trust frame",
      observed.cards ? "" : "headline cards",
    ].filter(Boolean);
    addRow({
      surface: "Header, trust frame, headline cards",
      viewport: viewportName,
      action: "Load scorecard and read rendered text",
      observed: JSON.stringify(observed),
      ...presenceStatus(missing),
    });
    await expectNoHorizontalOverflow(page, viewportName, "Header, trust frame, headline cards");
  }, { surface: "Header, trust frame, headline cards", viewport: viewportName, action: "Load scorecard" }));

  await auditStep(Object.assign(async () => {
    const toggle = page.getByRole("button", { name: /Theme: .*Switch to/i });
    const labelBefore = await toggle.getAttribute("aria-label");
    const htmlBefore = await page.locator("html").getAttribute("data-theme");
    await toggle.click();
    const labelAfter = await toggle.getAttribute("aria-label");
    const htmlAfter = await page.locator("html").getAttribute("data-theme");
    const savedAfter = await page.evaluate(() => window.localStorage.getItem("ccc-theme"));
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.locator(".app-shell").waitFor({ state: "visible" });
    const labelReloaded = await page.locator(".theme-toggle").getAttribute("aria-label");
    const htmlReloaded = await page.locator("html").getAttribute("data-theme");
    const savedReloaded = await page.evaluate(() => window.localStorage.getItem("ccc-theme"));
    const failures = [];
    if (!labelAfter || labelAfter === labelBefore) failures.push("theme preference did not advance after click");
    if (!savedAfter) failures.push("theme preference was not saved");
    if (labelReloaded !== labelAfter) failures.push("theme preference label did not persist after reload");
    if (savedReloaded !== savedAfter) failures.push("saved theme preference changed after reload");
    if (!/^(light|dark)$/.test(htmlAfter || "")) failures.push("effective theme after click is invalid");
    if (!/^(light|dark)$/.test(htmlReloaded || "")) failures.push("effective theme after reload is invalid");
    addRow({
      surface: "Theme toggle and persistence",
      viewport: viewportName,
      action: "Click theme toggle, reload",
      observed: `preference ${labelBefore} -> ${labelAfter} -> ${labelReloaded}; effective ${htmlBefore} -> ${htmlAfter} -> ${htmlReloaded}; saved ${savedAfter} -> ${savedReloaded}`,
      status: failures.length ? rowStatus.issue : rowStatus.pass,
      severity: failures.length ? "P1" : "",
      recommendation: failures.length ? `Fix theme control: ${failures.join("; ")}.` : "",
    });
  }, { surface: "Theme toggle and persistence", viewport: viewportName, action: "Toggle theme" }));

  await auditStep(Object.assign(async () => {
    await gotoApp(page);
    const derivations = [
      { name: "Household Impact", button: ".scoreboard-card-household button", panel: "#score-derivation-household" },
      { name: "Full Policy Audit", button: ".scoreboard-card-overall button", panel: "#score-derivation-overall" },
    ];
    const opened = [];
    for (const derivation of derivations) {
      const button = page.locator(derivation.button);
      await button.click();
      await page.locator(derivation.panel).waitFor({ state: "visible", timeout: 5_000 });
      opened.push(derivation.name);
      await button.click();
    }
    await page.locator(".scoreboard-card-approval").click();
    await page.locator(".scoreboard-detail-approval").waitFor({ state: "visible" });
    addRow({
      surface: "Headline expanders",
      viewport: viewportName,
      action: "Open both score math panels and Approval Signal drilldown",
      observed: `opened=${opened.join(", ")}; approval detail rendered`,
      ...presenceStatus(opened.length === derivations.length ? [] : ["both headline score math panels"]),
    });
  }, { surface: "Headline expanders", viewport: viewportName, action: "Click expanders" }));

  await auditStep(Object.assign(async () => {
    await gotoApp(page);
    const statusRegion = page.locator(".dashboard-status");
    await statusRegion.waitFor({ state: "visible", timeout: 5_000 });
    await revealDashboardStatusDetails(page);
    const text = await statusRegion.textContent();
    const required = [
      "Dashboard status",
      "Evidence scan",
      "Next scheduled scan",
      "Editor-reviewed score cycle",
      "Coverage through",
      "Grade moves this release",
      "Monitor items awaiting review",
      ...dashboardStatus.nextChecks.flatMap((check) => [check.label, check.status]),
    ];
    const missing = required.filter((needle) => !text.includes(needle));
    addRow({
      surface: "Dashboard status and next checks",
      viewport: viewportName,
      action: "Read status block and next-check cards",
      observed: `present=${required.length - missing.length}/${required.length}`,
      ...presenceStatus(missing),
    });
  }, { surface: "Dashboard status and next checks", viewport: viewportName, action: "Read rendered text" }));

  await auditStep(Object.assign(async () => {
    const results = [];
    for (const check of dashboardStatus.nextChecks.filter((item) => item.href)) {
      await gotoApp(page);
      await revealDashboardStatusDetails(page);
      await page.getByRole("link", { name: `Open check path for ${check.label}` }).click();
      await page.waitForTimeout(350);
      const hash = await page.evaluate(() => window.location.hash);
      const targetId = check.href.replace(/^#/, "");
      const targetCount = await page.locator(`#${targetId}, #${targetId}-button, #${targetId}-panel`).count();
      results.push({
        label: check.label,
        expected: check.href,
        actual: hash,
        targetFound: targetCount > 0,
      });
    }
    const failures = results.filter((result) => result.actual !== result.expected || !result.targetFound);
    addRow({
      surface: "Next-check deep links",
      viewport: viewportName,
      action: "Click each data-driven Open check path link",
      observed: JSON.stringify(results),
      status: failures.length ? rowStatus.issue : rowStatus.pass,
      severity: failures.length ? "P2" : "",
      recommendation: failures.length ? "Fix nextChecks href or the corresponding rendered target." : "",
    });
  }, { surface: "Next-check deep links", viewport: viewportName, action: "Click links" }));
}

async function auditTabs(page, viewportName) {
  const tabs = [
    {
      label: "Scorecard",
      hash: "view-scorecard",
      ready: (currentPage) => currentPage.locator("#policy-grades-heading"),
      required: ["Scorecard view", "Click any card"],
    },
    {
      label: "Promises",
      hash: "view-promises",
      ready: (currentPage) => currentPage.getByLabel("Promise filters"),
      required: ["delivered", "Search", "Status", "Dimension", "Sort", "Group"],
    },
    {
      label: "Changes",
      hash: "view-changelog",
      ready: (currentPage) => currentPage.getByText("What changed since last update", { exact: true }),
      required: ["What changed since last update", "All", "Grades", "Events", "Product"],
    },
    {
      label: "Rubric",
      hash: "view-methodology",
      ready: (currentPage) => currentPage.getByRole("heading", { name: /Scoring Rubric/ }),
      required: ["Scoring Rubric", "Methodology & safeguards", "Limits of this model"],
    },
    {
      label: "About",
      hash: "view-about",
      ready: (currentPage) => currentPage.getByRole("heading", { name: "About This Dashboard" }),
      required: ["About This Dashboard", "Editor and Disclosures", "What This Scores"],
    },
  ];

  for (const tab of tabs) {
    await auditStep(Object.assign(async () => {
      await gotoApp(page, tab.hash);
      await tab.ready(page).waitFor({ state: "visible", timeout: 15_000 });
      const text = await page.locator("body").textContent();
      const present = tab.required.filter((needle) => text.includes(needle));
      const missing = tab.required.filter((needle) => !text.includes(needle));
      await expectNoHorizontalOverflow(page, viewportName, `${tab.label} tab`);
      addRow({
        surface: `${tab.label} tab load`,
        viewport: viewportName,
        action: `Navigate to #${tab.hash}`,
        observed: `required text present=${present.length}/${tab.required.length}`,
        ...presenceStatus(missing),
      });
    }, { surface: `${tab.label} tab load`, viewport: viewportName, action: `Navigate to #${tab.hash}` }));
  }
}

async function auditPromises(page, viewportName) {
  await auditStep(Object.assign(async () => {
    await gotoApp(page, "view-promises");
    await page.getByLabel("Promise filters").waitFor({ state: "visible" });
    const filterSelects = page.locator(".app-promise-filters select");
    await page.getByPlaceholder("Promise, evidence, or source").fill("housing");
    const searchCount = await page.locator(".app-promise-result-count").textContent();
    await filterSelects.nth(0).selectOption("Stalled");
    const statusCount = await page.locator(".app-promise-result-count").textContent();
    await filterSelects.nth(1).selectOption("Defence & Trade");
    await filterSelects.nth(2).selectOption("date");
    await filterSelects.nth(3).selectOption("dimension");
    await page.getByRole("button", { name: "Clear" }).first().click();
    await page.getByText("Meet NATO 2%", { exact: false }).click();
    await page.getByText("Status since:", { exact: false }).first().waitFor({ state: "visible" });
    addRow({
      surface: "Promises controls and detail expansion",
      viewport: viewportName,
      action: "Search, status filter, dimension filter, sort, group, clear, expand Details",
      observed: `search=${textSnippet(searchCount)}; stalled=${textSnippet(statusCount)}; detail opened`,
    });
  }, { surface: "Promises controls and detail expansion", viewport: viewportName, action: "Interact with controls" }));

  await auditStep(Object.assign(async () => {
    await gotoApp(page, "view-promises");
    await page.getByPlaceholder("Promise, evidence, or source").fill("__no_such_promise__");
    await page.getByText("No promises match these filters.").waitFor({ state: "visible" });
    addRow({
      surface: "Promises empty state",
      viewport: viewportName,
      action: "Search impossible query",
      observed: "Empty state rendered with Clear filters button.",
    });
  }, { surface: "Promises empty state", viewport: viewportName, action: "Search impossible query" }));
}

async function auditChangesAndDocs(page, viewportName) {
  await auditStep(Object.assign(async () => {
    await gotoApp(page, "view-changelog");
    for (const filter of ["All", "Grades", "Events", "Product"]) {
      await page.getByRole("button", { name: filter, exact: true }).click();
      await page.waitForTimeout(100);
    }
    const hasHistoryLink = await page.locator("a", { hasText: /full changelog|GitHub|history/i }).count();
    const latestDate = changelog[0]?.date || "";
    const previousDate = changelog[1]?.date || "NO_DATE";
    const hasOnlyLatest = await page.evaluate(([latest, previous]) => (
      document.body.textContent?.includes(latest) && !document.body.textContent?.includes(previous)
    ), [latestDate, previousDate]);
    addRow({
      surface: "Changes filters and historical reach",
      viewport: viewportName,
      action: "Click All, Grades, Events, Product filters and scan for older history",
      observed: `all filters clicked; historical link count=${hasHistoryLink}; only latest entry visible=${hasOnlyLatest}`,
      status: hasOnlyLatest && hasHistoryLink === 0 ? rowStatus.issue : rowStatus.pass,
      severity: hasOnlyLatest && hasHistoryLink === 0 ? "P2" : "",
      recommendation: hasOnlyLatest && hasHistoryLink === 0 ? "Add a visible link to the full changelog or older history from the Changes tab." : "",
    });
  }, { surface: "Changes filters and historical reach", viewport: viewportName, action: "Click filters" }));

  await auditStep(Object.assign(async () => {
    await gotoApp(page, "view-methodology");
    const links = await page.locator("#methodology-safeguards a").evaluateAll((nodes) => nodes.map((node) => ({
      text: node.textContent?.replace(/\s+/g, " ").trim(),
      href: node.href,
    })));
    addRow({
      surface: "Rubric methodology doc links",
      viewport: viewportName,
      action: "Collect all six safeguard links",
      observed: links.map((link) => `${link.text} -> ${link.href}`).join(" | "),
      status: links.length === 6 ? rowStatus.pass : rowStatus.issue,
      severity: links.length === 6 ? "" : "P2",
      recommendation: links.length === 6 ? "" : "Restore missing methodology/safeguards link cards.",
    });
  }, { surface: "Rubric methodology doc links", viewport: viewportName, action: "Collect links" }));
}

async function gotoDimensionPanel(page, dim, panel) {
  const panelId = dimensionPanelId(dim.id, panel.id);
  await gotoApp(page, panelId);
  await page.locator(`#dim-${dim.id}-drawer`).waitFor({ state: "visible", timeout: 10_000 });
  await page.getByRole("navigation", { name: "Policy detail sections" }).waitFor({ state: "visible", timeout: 10_000 });
  await page.locator(`#${panelId}`).waitFor({ state: "visible", timeout: 10_000 });
  return page.locator(`#${panelId}`);
}

async function openDimensionPanelFromCard(page, dim, panel) {
  await gotoApp(page, "view-scorecard");
  await page.locator(`#dim-${dim.id} .dim-card-header-button`).click();
  await page.locator(`#dim-${dim.id}-drawer`).waitFor({ state: "visible", timeout: 10_000 });
  const nav = page.getByRole("navigation", { name: "Policy detail sections" });
  await nav.waitFor({ state: "visible", timeout: 10_000 });
  if (panel.id !== "briefing") {
    await nav.getByRole("button", { name: panel.label, exact: true }).click();
  }
  const panelId = dimensionPanelId(dim.id, panel.id);
  await page.locator(`#${panelId}`).waitFor({ state: "visible", timeout: 10_000 });
  return page.locator(`#${panelId}`);
}

async function auditDimensionPanelRoute(page, dim, panel, viewportName) {
  const panelLocator = await gotoDimensionPanel(page, dim, panel);
  const nav = page.getByRole("navigation", { name: "Policy detail sections" });
  const navState = await nav.locator("button, a").evaluateAll((controls) => controls.map((control) => ({
    label: control.textContent?.replace(/\s+/g, " ").trim(),
    current: control.getAttribute("aria-current"),
  })));
  const panelState = await page.evaluate(({ dimId, panels }) => panels.map((item) => {
    const node = document.getElementById(`dim-${dimId}-${item.id}`);
    return {
      label: item.label,
      present: Boolean(node),
      visible: Boolean(node && (node.offsetWidth || node.offsetHeight || node.getClientRects().length)),
    };
  }), { dimId: dim.id, panels: dimensionPanels });
  const currentControls = navState.filter((control) => control.current);
  const visiblePanels = panelState.filter((item) => item.visible);
  const nestedDisclosureCount = await panelLocator
    .locator("details, summary, button[aria-expanded], [role='button'][aria-expanded]")
    .count();
  const hash = await page.evaluate(() => window.location.hash);
  const expectedHash = `#${dimensionPanelId(dim.id, panel.id)}`;
  const failures = [];

  if (navState.length !== dimensionPanels.length) failures.push(`navigation controls=${navState.length}`);
  if (navState.map((control) => control.label).join("|") !== dimensionPanels.map((item) => item.label).join("|")) {
    failures.push("navigation labels or order differ");
  }
  if (currentControls.length !== 1 || currentControls[0]?.label !== panel.label) {
    failures.push(`current=${currentControls.map((control) => control.label).join(",") || "none"}`);
  }
  if (visiblePanels.length !== 1 || visiblePanels[0]?.label !== panel.label) {
    failures.push(`visible=${visiblePanels.map((item) => item.label).join(",") || "none"}`);
  }
  if (hash !== expectedHash) failures.push(`hash=${hash}`);
  if (nestedDisclosureCount > 0) failures.push(`nested disclosure controls=${nestedDisclosureCount}`);

  addRow({
    surface: `${dim.name} ${panel.label} panel route`,
    viewport: viewportName,
    action: `Open ${expectedHash} and inspect four-panel workspace state`,
    observed: `controls=${navState.length}; current=${currentControls.map((control) => control.label).join(",") || "none"}; visible=${visiblePanels.map((item) => item.label).join(",") || "none"}; nested disclosures=${nestedDisclosureCount}`,
    status: failures.length ? rowStatus.issue : rowStatus.pass,
    severity: failures.length ? "P1" : "",
    recommendation: failures.length ? `Fix the sibling-panel routing contract: ${failures.join("; ")}.` : "",
  });

  return panelLocator;
}

async function auditCanonicalEvidence(page, dim, viewportName) {
  const panel = page.locator(`#${dimensionPanelId(dim.id, "evidence")}`);
  const renderedText = await panel.textContent();
  const triggers = [
    ...(dim.gradeTriggers?.up || []),
    ...(dim.gradeTriggers?.down || []),
  ];
  const expectedText = [
    ...(dim.metrics || []).flatMap((metric) => [metric.label, metric.value]),
    ...(dim.promises || []).flatMap((promise) => [promise.text, promise.status, promise.evidence]),
    ...triggers.flatMap((trigger) => [
      trigger.text,
      trigger.sourceLabel,
      ...(trigger.additionalSources || []).map((source) => source.label),
    ]),
    ...(dim.projectCohort?.projects || []).map((project) => project.name),
    dim.perspectives?.critics,
    dim.perspectives?.defenders,
  ];
  const missingText = missingRenderedText(renderedText, expectedText);
  const renderedLinkTargets = new Set(await panel.locator("a[href]").evaluateAll(
    (nodes) => nodes.map((node) => node.getAttribute("href")),
  ));
  const expectedLinks = evidenceLinksForDimension(dim);
  const missingLinks = expectedLinks
    .filter((link) => !renderedLinkTargets.has(link.url))
    .map((link) => `${link.kind}: ${link.label || link.url}`);

  const missing = [...missingText.map((value) => `text: ${value}`), ...missingLinks];
  addRow({
    surface: `${dim.name} canonical Evidence content`,
    viewport: viewportName,
    action: "Compare rendered metrics, sources, promises, triggers, project cohort, perspectives, and source targets with dimensions.json",
    observed: `metrics=${dim.metrics?.length || 0}; sources=${dim.sources?.length || 0}; promises=${dim.promises?.length || 0}; triggers=${triggers.length}; projects=${dim.projectCohort?.projects?.length || 0}; link targets=${expectedLinks.length}; missing=${missing.length}${missing.length ? ` (${textSnippet(missing.join(" | "))})` : ""}`,
    status: missing.length ? rowStatus.issue : rowStatus.pass,
    severity: missing.length ? "P1" : "",
    recommendation: missing.length ? "Restore the missing canonical record in the Evidence panel without adding another disclosure layer." : "",
  });
}

async function auditCanonicalMethod(page, dim, viewportName) {
  const panel = page.locator(`#${dimensionPanelId(dim.id, "method")}`);
  const renderedText = await panel.textContent();
  const expectedStrings = methodStringsForDimension(dim);
  const missingText = missingRenderedText(renderedText, expectedStrings);
  const expectedAnchors = methodAnchorIdsForDimension(dim);
  const missingAnchors = await panel.evaluate((node, anchorIds) => anchorIds.filter((id) => {
    const anchor = node.querySelector(`#${CSS.escape(id)}`);
    return !anchor || !(anchor.offsetWidth || anchor.offsetHeight || anchor.getClientRects().length);
  }), expectedAnchors);
  const missing = [
    ...missingText.map((value) => `text: ${value}`),
    ...missingAnchors.map((id) => `anchor: #${id}`),
  ];

  addRow({
    surface: `${dim.name} canonical Method content`,
    viewport: viewportName,
    action: "Compare rendered method, thresholds, guardrails, and operational rules with dimensions.json",
    observed: `expected strings=${expectedStrings.length}; expected anchors=${expectedAnchors.length}; missing=${missing.length}${missing.length ? ` (${textSnippet(missing.join(" | "))})` : ""}`,
    status: missing.length ? rowStatus.issue : rowStatus.pass,
    severity: missing.length ? "P1" : "",
    recommendation: missing.length ? "Restore the missing canonical scoring text in the Method panel without changing scoring values." : "",
  });
}

async function auditSourceDownload(page, dim, viewportName) {
  if (!Array.isArray(dim.sources) || dim.sources.length === 0) return;
  const link = page.locator(`#${dimensionPanelId(dim.id, "evidence")} #dim-${dim.id}-sources .dim-download-link`);
  if (await link.count() === 0) {
    addRow({
      surface: `${dim.name} source JSON download`,
      viewport: viewportName,
      action: "Find download link",
      observed: "No .dim-download-link found in the Evidence panel's Sources section.",
      status: rowStatus.issue,
      severity: "P2",
      recommendation: "Restore Download sources as JSON in the Evidence panel's Sources section.",
    });
    return;
  }

  const payload = await link.evaluate((node) => {
    const href = node.getAttribute("href") || "";
    const marker = "data:application/json;charset=utf-8,";
    let parsed = null;
    if (href.startsWith(marker)) {
      parsed = JSON.parse(decodeURIComponent(href.slice(marker.length)));
    }
    return {
      download: node.getAttribute("download"),
      hrefPrefix: href.slice(0, marker.length),
      parsed,
    };
  });
  addRow({
    surface: `${dim.name} source JSON download`,
    viewport: viewportName,
    action: "Validate Download sources as JSON href and payload",
    observed: `download=${payload.download}; payload id=${payload.parsed?.id}; sources=${payload.parsed?.sources?.length}`,
    status: payload.download === `${dim.id}-sources.json` && payload.parsed?.id === dim.id ? rowStatus.pass : rowStatus.issue,
    severity: payload.download === `${dim.id}-sources.json` && payload.parsed?.id === dim.id ? "" : "P2",
    recommendation: payload.download === `${dim.id}-sources.json` && payload.parsed?.id === dim.id ? "" : "Fix the Sources JSON download href or filename.",
  });
}

function legacyDeepLinksForDimension(dim) {
  const links = [
    { hash: `dim-${dim.id}`, panel: "briefing", target: `dim-${dim.id}-summary` },
  ];

  if (dim.gradeTriggers || dim.nextTrigger) {
    links.push({ hash: `dim-${dim.id}-triggers-section`, panel: "briefing", target: `dim-${dim.id}-triggers-section` });
  }

  if (dim.projectCohort?.projects?.length) {
    links.push({ hash: `dim-${dim.id}-cohort-table`, panel: "evidence", target: `dim-${dim.id}-cohort-table` });
  } else if (dim.sources?.length) {
    links.push({ hash: `dim-${dim.id}-sources`, panel: "evidence", target: `dim-${dim.id}-sources` });
  } else if (dim.metrics?.length) {
    links.push({ hash: `dim-${dim.id}-metrics`, panel: "evidence", target: `dim-${dim.id}-metrics` });
  }

  if (dim.latestEvidenceReview) {
    links.push({ hash: `dim-${dim.id}-latest-evidence-review`, panel: "history", target: `dim-${dim.id}-latest-evidence-review` });
  } else if (dim.latestReview) {
    links.push({ hash: `dim-${dim.id}-latest-review`, panel: "history", target: `dim-${dim.id}-latest-review` });
  }

  const methodTarget = dim.subScores
    ? "subscores"
    : dim.gradeBasis?.leverOperationalization
      ? "lever-operationalization"
      : dim.gradeBasis?.componentOperationalization
        ? "component-operationalization"
        : dim.gradeBasis?.combinationRule
          ? "combination-rule"
          : "scoring";
  links.push({ hash: `dim-${dim.id}-${methodTarget}`, panel: "method", target: `dim-${dim.id}-${methodTarget}` });

  return links;
}

async function auditLegacyDeepLinks(page, dim, viewportName) {
  for (const legacyLink of legacyDeepLinksForDimension(dim)) {
    await auditStep(Object.assign(async () => {
      await gotoApp(page, legacyLink.hash);
      const panelId = dimensionPanelId(dim.id, legacyLink.panel);
      await page.locator(`#${panelId}`).waitFor({ state: "visible", timeout: 10_000 });
      const expectedHash = `#${dimensionPanelId(dim.id, legacyLink.panel)}`;
      await page.waitForFunction(
        (canonicalHash) => window.location.hash === canonicalHash,
        expectedHash,
        { timeout: 10_000 },
      );
      const current = await page
        .getByRole("navigation", { name: "Policy detail sections" })
        .locator("[aria-current]")
        .evaluateAll((controls) => controls.map((control) => control.textContent?.replace(/\s+/g, " ").trim()));
      const hash = await page.evaluate(() => window.location.hash);
      const targetCount = await page.locator(`#${legacyLink.target}`).count();
      const expectedLabel = dimensionPanels.find((panel) => panel.id === legacyLink.panel)?.label;
      const failures = [];
      if (hash !== expectedHash) failures.push(`hash=${hash}`);
      if (current.length !== 1 || current[0] !== expectedLabel) failures.push(`current=${current.join(",") || "none"}`);
      if (targetCount === 0) failures.push(`target #${legacyLink.target} missing`);
      addRow({
        surface: `${dim.name} legacy deep link`,
        viewport: viewportName,
        action: `Open #${legacyLink.hash}`,
        observed: `panel=${current.join(",") || "none"}; target count=${targetCount}; canonical hash=${hash}`,
        status: failures.length ? rowStatus.issue : rowStatus.pass,
        severity: failures.length ? "P2" : "",
        recommendation: failures.length ? `Restore legacy anchor routing: ${failures.join("; ")}.` : "",
      });
    }, { surface: `${dim.name} legacy deep link`, viewport: viewportName, action: `Open #${legacyLink.hash}` }));
  }
}

async function auditDimensions(page, viewportName) {
  for (const dim of dimensions) {
    console.log(`[${viewportName}] ${dim.id}`);
    for (const panel of dimensionPanels) {
      await auditStep(Object.assign(async () => {
        await auditDimensionPanelRoute(page, dim, panel, viewportName);
        if (panel.id === "briefing") {
          await expectNoHorizontalOverflow(page, viewportName, `${dim.name} Briefing panel`);
        }
        if (panel.id === "evidence") {
          await auditCanonicalEvidence(page, dim, viewportName);
          await auditSourceDownload(page, dim, viewportName);
        }
        if (panel.id === "method") {
          await auditCanonicalMethod(page, dim, viewportName);
        }
      }, { surface: `${dim.name} ${panel.label} panel`, viewport: viewportName, action: `Open #${dimensionPanelId(dim.id, panel.id)}` }));
    }

    await auditLegacyDeepLinks(page, dim, viewportName);

    await auditStep(Object.assign(async () => {
      await gotoDimensionPanel(page, dim, dimensionPanels[0]);
      const closeButton = page.locator(`#dim-${dim.id}-drawer .dim-drawer-close`);
      await closeButton.click();
      await page.locator(`#dim-${dim.id}-drawer`).waitFor({ state: "detached", timeout: 10_000 }).catch(async () => {
        await page.locator(`#dim-${dim.id}-drawer`).waitFor({ state: "hidden", timeout: 5_000 });
      });
      addRow({
        surface: `${dim.name} close behavior`,
        viewport: viewportName,
        action: "Click Close from Briefing",
        observed: "Dimension workspace closed.",
      });
    }, { surface: `${dim.name} close behavior`, viewport: viewportName, action: "Close dimension workspace" }));
  }
}

async function auditInternalTriggerTargets(page, viewportName) {
  for (const route of internalTriggerRoutes()) {
    await auditStep(Object.assign(async () => {
      const panel = await openDimensionPanelFromCard(page, route.dim, dimensionPanels[1]);
      const controls = panel.locator("button.text-link-button").filter({
        hasText: route.trigger.sourceLabel,
      });
      const controlCount = await controls.count();
      if (controlCount === 0) {
        addRow({
          surface: `${route.dim.name} internal trigger target`,
          viewport: viewportName,
          action: `Follow ${route.ref.type} trigger source`,
          observed: `No internal source control found for ${route.trigger.sourceLabel}.`,
          status: rowStatus.issue,
          severity: "P1",
          recommendation: "Restore the internal trigger source control and its in-app destination.",
        });
        return;
      }

      await controls.first().click();
      const targetId = route.ref.type === "cohort"
        ? `dim-${route.dim.id}-cohort`
        : route.ref.type === "view"
          ? `view-${route.ref.target}`
          : route.ref.target;
      const expectedHash = `#${targetId}`;
      await page.waitForFunction(
        (hash) => window.location.hash === hash,
        expectedHash,
        { timeout: 10_000 },
      );
      const target = page.locator(`#${targetId}`);
      await target.waitFor({ state: "visible", timeout: 10_000 });
      await page.waitForFunction(
        (id) => document.activeElement?.id === id,
        targetId,
        { timeout: 10_000 },
      );
      const focusedId = await page.evaluate(() => document.activeElement?.id || "");
      const drawerCount = await page.locator(`#dim-${route.dim.id}-drawer`).count();
      const ownsModalEntry = await page.evaluate(() => Boolean(window.history.state?.dimModal));
      const failures = [];
      if (focusedId !== targetId) failures.push(`focused=${focusedId || "none"}`);
      if (route.ref.type !== "cohort" && drawerCount !== 0) failures.push(`drawer count=${drawerCount}`);
      if (route.ref.type !== "cohort" && ownsModalEntry) failures.push("drawer history entry still owned");

      let backReturn = "not exercised";
      if (route.ref.type === "anchor") {
        const promisesControls = page.getByRole("button", { name: "Promises", exact: true });
        let clickedPromises = false;
        for (let index = 0; index < await promisesControls.count(); index += 1) {
          const control = promisesControls.nth(index);
          if (await control.isVisible()) {
            await control.click();
            clickedPromises = true;
            break;
          }
        }
        if (!clickedPromises) {
          failures.push("visible Promises navigation control missing");
        } else {
          await page.waitForFunction(
            () => window.location.hash === "#view-promises",
            undefined,
            { timeout: 10_000 },
          );
          await page.goBack();
          await page.waitForFunction(
            (hash) => window.location.hash === hash,
            expectedHash,
            { timeout: 10_000 },
          );
          await target.waitFor({ state: "visible", timeout: 10_000 });
          await page.waitForFunction(
            (id) => document.activeElement?.id === id,
            targetId,
            { timeout: 10_000 },
          );
          backReturn = `hash=${await page.evaluate(() => window.location.hash)}; focused=${await page.evaluate(() => document.activeElement?.id || "none")}`;
        }
      }

      addRow({
        surface: `${route.dim.name} internal trigger target`,
        viewport: viewportName,
        action: `Follow ${route.ref.type} trigger source`,
        observed: `target=#${targetId}; hash=${expectedHash}; focused=${focusedId || "none"}; drawer count=${drawerCount}; owns drawer entry=${ownsModalEntry}; Back return=${backReturn}; matching controls=${controlCount}`,
        status: failures.length ? rowStatus.issue : rowStatus.pass,
        severity: failures.length ? "P2" : "",
        recommendation: failures.length ? `Restore internal target focus: ${failures.join("; ")}.` : "",
      });
    }, {
      surface: `${route.dim.name} internal trigger target`,
      viewport: viewportName,
      action: `Follow ${route.ref.type} trigger source`,
    }));
  }
}

async function auditExternalLinkSamples(page, viewportName) {
  await auditStep(Object.assign(async () => {
    await gotoApp(page, "dim-defence-trade-evidence");
    const links = await page.locator("#dim-defence-trade-evidence #dim-defence-trade-sources a[target='_blank']").evaluateAll((nodes) => {
      const unique = new Map();
      for (const node of nodes) {
        if (!unique.has(node.href)) {
          unique.set(node.href, {
            text: node.textContent?.replace(/\s+/g, " ").trim(),
            href: node.href,
          });
        }
      }
      return [...unique.values()].slice(0, 3);
    });
    const results = [];
    for (const link of links) {
      try {
        const response = await page.request.get(link.href, { timeout: 12_000, maxRedirects: 4 });
        results.push(`${link.text}: ${response.status()}`);
      } catch (error) {
        results.push(`${link.text}: ${error.message}`);
      }
    }
    addRow({
      surface: "Representative external source links",
      viewport: viewportName,
      action: "HTTP GET first three Defence & Trade source links",
      observed: results.join(" | "),
      status: results.some((item) => /\b(404|410|500|timeout|ENOTFOUND)\b/i.test(item)) ? rowStatus.issue : rowStatus.pass,
      severity: results.some((item) => /\b(404|410|500|timeout|ENOTFOUND)\b/i.test(item)) ? "P2" : "",
      recommendation: results.some((item) => /\b(404|410|500|timeout|ENOTFOUND)\b/i.test(item)) ? "Browser-check failed sampled source links and replace dead URLs if confirmed." : "",
    });
  }, { surface: "Representative external source links", viewport: viewportName, action: "Fetch sampled links" }));
}

async function auditKeyboard(page, viewportName) {
  await auditStep(Object.assign(async () => {
    await gotoApp(page, "view-promises");
    await page.locator(".app-promise-tracker").waitFor({ state: "visible", timeout: 10_000 });
    await page.waitForFunction(
      () => document.activeElement?.id === "view-promises",
      undefined,
      { timeout: 10_000 },
    );
    const skipLink = page.getByRole("link", { name: "Skip to main content" });
    await skipLink.focus();
    await page.keyboard.press("Enter");
    await page.waitForFunction(
      () => window.location.hash === "#main-content",
      undefined,
      { timeout: 10_000 },
    );
    await page.waitForFunction(
      () => document.activeElement?.id === "main-content",
      undefined,
      { timeout: 10_000 },
    );
    const state = await page.evaluate(() => ({
      hash: window.location.hash,
      focusedId: document.activeElement?.id || "",
      promisesVisible: Boolean(document.querySelector(".app-promise-tracker")?.getClientRects().length),
      activeLabels: [...document.querySelectorAll('[aria-current="page"]')]
        .map((node) => node.textContent?.replace(/\s+/g, " ").trim()),
    }));
    const failures = [];
    if (state.hash !== "#main-content") failures.push(`hash=${state.hash}`);
    if (state.focusedId !== "main-content") failures.push(`focused=${state.focusedId || "none"}`);
    if (!state.promisesVisible) failures.push("Promises view not visible");
    if (!state.activeLabels.includes("Promises")) failures.push(`active=${state.activeLabels.join(",") || "none"}`);
    addRow({
      surface: "Skip link view preservation",
      viewport: viewportName,
      action: "Activate Skip to main content from Promises",
      observed: `hash=${state.hash}; focused=${state.focusedId || "none"}; Promises visible=${state.promisesVisible}; active=${state.activeLabels.join(",") || "none"}`,
      status: failures.length ? rowStatus.issue : rowStatus.pass,
      severity: failures.length ? "P1" : "",
      recommendation: failures.length ? `Preserve the current view when routing the global skip link: ${failures.join("; ")}.` : "",
    });
  }, { surface: "Skip link view preservation", viewport: viewportName, action: "Activate skip link from Promises" }));

  await auditStep(Object.assign(async () => {
    await gotoApp(page, "view-scorecard");
    await page.keyboard.press("Tab");
    const first = await page.evaluate(() => ({
      text: document.activeElement?.textContent?.replace(/\s+/g, " ").trim().slice(0, 80),
      href: document.activeElement?.getAttribute("href"),
    }));
    if (first.href === "#main-content") {
      await page.keyboard.press("Enter");
      await page.waitForTimeout(100);
    }
    const seen = [];
    for (let i = 0; i < 120; i += 1) {
      await page.keyboard.press("Tab");
      const item = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          id: el.id || "",
          role: el.getAttribute("role") || "",
          label: el.getAttribute("aria-label") || el.textContent?.replace(/\s+/g, " ").trim().slice(0, 80) || "",
          visible: rect.width > 0 && rect.height > 0,
        };
      });
      if (item && !seen.some((existing) => JSON.stringify(existing) === JSON.stringify(item))) seen.push(item);
    }
    const invisible = seen.filter((item) => !item.visible);
    addRow({
      surface: "Keyboard sequential focus",
      viewport: viewportName,
      action: "Tab through first 120 focus moves from page start",
      observed: `first=${JSON.stringify(first)}; unique focus targets=${seen.length}; invisible=${invisible.length}`,
      status: invisible.length ? rowStatus.issue : rowStatus.pass,
      severity: invisible.length ? "P2" : "",
      recommendation: invisible.length ? "Inspect invisible focus targets and ensure they are intentionally hidden only when skipped." : "",
    });
  }, { surface: "Keyboard sequential focus", viewport: viewportName, action: "Tab traversal" }));
}

function markdownTable(items) {
  const header = "| # | Surface | Viewport | Action | Observed | Status | Severity | Recommendation |\n|---:|---|---|---|---|---|---|---|";
  const lines = items.map((row) => `| ${row["#"]} | ${escapePipe(row.surface)} | ${escapePipe(row.viewport)} | ${escapePipe(row.action)} | ${escapePipe(row.observed)} | ${row.status} | ${escapePipe(row.severity || "-")} | ${escapePipe(row.recommendation || "-")} |`);
  return [header, ...lines].join("\n");
}

function escapePipe(value) {
  return String(value ?? "")
    .replaceAll("|", "\\|")
    .replace(/\s+/g, " ")
    .trim();
}

async function run() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch();
  try {
    for (const ctx of contexts) {
      console.log(`Starting ${ctx.name} audit (${ctx.width}x${ctx.height})`);
      const context = await browser.newContext({
        viewport: { width: ctx.width, height: ctx.height },
        acceptDownloads: true,
        colorScheme: "light",
      });
      await installRoutes(context);
      const page = await context.newPage();

      await auditGlobalSurfaces(page, ctx.name);
      await auditTabs(page, ctx.name);
      await auditPromises(page, ctx.name);
      await auditChangesAndDocs(page, ctx.name);
      await auditDimensions(page, ctx.name);
      await auditInternalTriggerTargets(page, ctx.name);
      await auditExternalLinkSamples(page, ctx.name);
      await auditKeyboard(page, ctx.name);

      await context.close();
    }
  } finally {
    await browser.close();
  }

  const summary = {
    generatedAt: generatedAt.toISOString(),
    baseUrl,
    expectedVersion: meta.version,
    latestChangelogDate: changelog[0]?.date,
    totalRows: rows.length,
    pass: rows.filter((row) => row.status === rowStatus.pass).length,
    issue: issues.length,
  };

  const report = [
    "# Live Dashboard Content And Interaction Audit",
    "",
    `Generated: ${summary.generatedAt}`,
    `URL: ${baseUrl}`,
    `Expected version: v${summary.expectedVersion}`,
    `Latest changelog date: ${summary.latestChangelogDate}`,
    "",
    "This is a targeted rendered-content and interaction smoke audit. A PASS means the scripted checks found the expected rendered text, controls, navigation, and sampled links. It is not a substitute for human visual review, user testing, or full assistive-technology testing.",
    "",
    "## Summary",
    "",
    `- PASS: ${summary.pass}`,
    `- ISSUE: ${summary.issue}`,
    `- Total rows: ${summary.totalRows}`,
    "",
    "## Issues",
    "",
    issues.length ? markdownTable(issues) : "No issues recorded.",
    "",
    "## Full Matrix",
    "",
    markdownTable(rows),
    "",
  ].join("\n");

  await writeFile(path.join(outDir, "report.md"), report, "utf8");
  await writeFile(path.join(outDir, "report.json"), JSON.stringify({ summary, rows }, null, 2), "utf8");

  console.log(`Live coverage audit written to ${outDir}`);
  console.log(`PASS=${summary.pass} ISSUE=${summary.issue} TOTAL=${summary.totalRows}`);
  if (issues.length > 0) process.exitCode = 1;
}

await run();
