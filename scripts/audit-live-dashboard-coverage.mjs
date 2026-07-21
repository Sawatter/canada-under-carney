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

function hasWhySection(dim) {
  // Mirrors DimensionCard's hasWhySection. The old top-level
  // whyNotHigher/whyNotLower fields are retired (they live under gradeBasis
  // now, which the first clause already covers).
  return !!(
    dim.gradeBasis
    || dim.rationale
    || dim.judgmentDetail
    || dim.excludeFromGPA
  );
}

function hasRuleSection(dim) {
  return !!(dim.construct || dim.scoring || dim.gradeBasis);
}

function sectionChecksForDimension(dim) {
  const isTracker = !!dim.excludeFromGPA;
  return [
    { key: "summary", label: "Verdict", id: `dim-${dim.id}-summary`, required: true, button: false },
    { key: "triggers", label: isTracker ? "Tracker triggers" : "Triggers", id: isTracker ? `dim-${dim.id}-tracker-triggers` : `dim-${dim.id}-triggers-section`, required: !!dim.gradeTriggers, button: true },
    { key: "sources", label: "Sources", id: `dim-${dim.id}-sources`, required: Array.isArray(dim.sources) && dim.sources.length > 0, button: true },
    { key: "why", label: isTracker ? "Why tracker reads this way" : "Why this grade", id: `dim-${dim.id}-why`, required: hasWhySection(dim), button: true },
    { key: "rule", label: "Criteria", id: `dim-${dim.id}-scoring`, required: hasRuleSection(dim), button: true },
    { key: "subScores", label: "Sub-scores", id: `dim-${dim.id}-subscores`, required: !isTracker && !!dim.subScores, button: true },
    { key: "metrics", label: "Metrics", id: `dim-${dim.id}-metrics`, required: Array.isArray(dim.metrics) && dim.metrics.length > 0, button: true },
    { key: "projects", label: "Projects", id: `dim-${dim.id}-cohort`, required: !!dim.cohort?.projects?.length, button: true },
    { key: "promises", label: "Promises", id: `dim-${dim.id}-promises`, required: !isTracker && !!dim.promises?.length, button: true },
    { key: "perspectives", label: "Perspectives", id: `dim-${dim.id}-perspectives-section`, required: !!dim.perspectives, button: true },
    { key: "scopeContext", label: "Scope & context", id: `dim-${dim.id}-caveats`, required: !!(dim.scope || dim.inherited || dim.tags), button: true },
    { key: "glossary", label: "Glossary", id: `dim-${dim.id}-glossary`, required: !!(dim.tags?.confidence || dim.tags?.attribution || dim.tags?.lag), button: true },
    { key: "leverOperationalization", label: "Lever criteria", id: `dim-${dim.id}-lever-operationalization`, required: !!dim.gradeBasis?.leverOperationalization, button: true },
    { key: "componentOperationalization", label: "Component checklist", id: `dim-${dim.id}-component-operationalization`, required: !!dim.gradeBasis?.componentOperationalization, button: true },
    { key: "combinationRule", label: "Combination rule", id: `dim-${dim.id}-combination-rule`, required: !!dim.gradeBasis?.combinationRule, button: true },
  ].filter((item) => item.required);
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

async function openDimension(page, dim, viewportName) {
  await gotoApp(page, "view-scorecard");
  await page.locator(`#dim-${dim.id}`).scrollIntoViewIfNeeded();
  await page.locator(`#dim-${dim.id}-header`).click();
  await page.locator(`#dim-${dim.id}-drawer`).waitFor({ state: "visible", timeout: 10_000 });
  const isDialog = await page.locator(`#dim-${dim.id}-drawer[role="dialog"][aria-modal="true"]`).count();
  const bodyOverflow = await page.evaluate(() => getComputedStyle(document.body).overflow);
  addRow({
    surface: `${dim.name} opened drawer`,
    viewport: viewportName,
    action: "Click collapsed dimension card",
    observed: `drawer visible; mobile dialog=${Boolean(isDialog)}; body overflow=${bodyOverflow}`,
  });
}

async function clickDimensionSection(page, dim, section, viewportName) {
  const button = page.locator(`#${section.id}-button`);
  const buttonCount = await button.count();
  if (section.button && buttonCount === 0) {
    addRow({
      surface: `${dim.name} - ${section.label}`,
      viewport: viewportName,
      action: "Find section disclosure button",
      observed: `Expected #${section.id}-button but it was missing.`,
      status: rowStatus.issue,
      severity: "P2",
      recommendation: "Check section availability logic against rendered DOM.",
    });
    return;
  }
  if (section.button) {
    await button.scrollIntoViewIfNeeded();
    const before = await button.getAttribute("aria-expanded");
    if (before !== "true") {
      await button.click();
    }
    await page.locator(`#${section.id}-panel`).waitFor({ state: "visible", timeout: 5_000 });
    const expanded = await button.getAttribute("aria-expanded");
    const text = await page.locator(`#${section.id}-panel`).textContent();
    addRow({
      surface: `${dim.name} - ${section.label}`,
      viewport: viewportName,
      action: "Click section disclosure",
      observed: `aria-expanded=${expanded}; text=${textSnippet(text)}`,
    });
  } else {
    const visible = await page.locator(`#${section.id}`).isVisible();
    addRow({
      surface: `${dim.name} - ${section.label}`,
      viewport: viewportName,
      action: "Verify section exists",
      observed: `visible=${visible}`,
      status: visible ? rowStatus.pass : rowStatus.issue,
      severity: visible ? "" : "P2",
      recommendation: visible ? "" : "Expected always-visible verdict section is missing.",
    });
  }
}

async function auditSourceDownload(page, dim, viewportName) {
  if (!Array.isArray(dim.sources) || dim.sources.length === 0) return;
  const link = page.locator(`#dim-${dim.id}-sources-panel .dim-download-link`);
  if (await link.count() === 0) {
    addRow({
      surface: `${dim.name} source JSON download`,
      viewport: viewportName,
      action: "Find download link",
      observed: "No .dim-download-link found in sources panel.",
      status: rowStatus.issue,
      severity: "P2",
      recommendation: "Restore Download sources as JSON link in the Sources section.",
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

async function auditDimensionDeepLinks(page, dim, viewportName) {
  const navLinks = await page.locator(`#dim-${dim.id}-drawer .dim-mini-nav a`).evaluateAll((nodes) => nodes.map((node) => ({
    text: node.textContent?.replace(/\s+/g, " ").trim(),
    href: node.getAttribute("href"),
    visible: !!(node.offsetWidth || node.offsetHeight || node.getClientRects().length),
  })));
  for (const link of navLinks.slice(0, 8)) {
    if (!link.visible) continue;
    if (!link.href?.startsWith("#")) continue;
    await page.locator(`#dim-${dim.id}-drawer .dim-mini-nav a[href="${link.href}"]`).click();
    await page.waitForTimeout(100);
    const hash = await page.evaluate(() => window.location.hash);
    addRow({
      surface: `${dim.name} jump nav - ${link.text}`,
      viewport: viewportName,
      action: `Click ${link.href}`,
      observed: `hash=${hash}`,
      status: hash === link.href ? rowStatus.pass : rowStatus.issue,
      severity: hash === link.href ? "" : "P2",
      recommendation: hash === link.href ? "" : "Fix jump link hash update or scroll target.",
    });
  }
}

async function auditDimensions(page, viewportName) {
  for (const dim of dimensions) {
    console.log(`[${viewportName}] ${dim.id}`);
    await auditStep(Object.assign(async () => {
      await openDimension(page, dim, viewportName);
      for (const section of sectionChecksForDimension(dim)) {
        await clickDimensionSection(page, dim, section, viewportName);
      }
      await page.getByRole("button", { name: /Show all sections/i }).click();
      await page.waitForTimeout(150);
      addRow({
        surface: `${dim.name} show-all control`,
        viewport: viewportName,
        action: "Click Show all sections",
        observed: "Show all sections control clicked after individual section checks.",
      });
      await auditDimensionDeepLinks(page, dim, viewportName);
      await auditSourceDownload(page, dim, viewportName);
      const closeButton = page.locator(`#dim-${dim.id}-drawer .dim-drawer-close`);
      await closeButton.click();
      await page.locator(`#dim-${dim.id}-drawer`).waitFor({ state: "detached", timeout: 10_000 }).catch(async () => {
        await page.locator(`#dim-${dim.id}-drawer`).waitFor({ state: "hidden", timeout: 5_000 });
      });
      addRow({
        surface: `${dim.name} close behavior`,
        viewport: viewportName,
        action: "Click Close",
        observed: "Drawer closed.",
      });
    }, { surface: `${dim.name} drawer traversal`, viewport: viewportName, action: "Open and traverse drawer" }));
  }
}

async function auditExternalLinkSamples(page, viewportName) {
  await auditStep(Object.assign(async () => {
    await gotoApp(page, "dim-defence-trade-sources");
    const links = await page.locator("#dim-defence-trade-sources-panel a[target='_blank']").evaluateAll((nodes) => nodes.slice(0, 3).map((node) => ({
      text: node.textContent?.replace(/\s+/g, " ").trim(),
      href: node.href,
    })));
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
