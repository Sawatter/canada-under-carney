#!/usr/bin/env node
import { chromium } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const meta = JSON.parse(await readFile(path.join(repoRoot, "src/data/meta.json"), "utf8"));

const defaultBaseUrl = "https://sawatter.github.io/canada-under-carney/";
const baseUrl = process.env.REVIEW_EVIDENCE_URL || defaultBaseUrl;
const dimensionId = process.env.REVIEW_EVIDENCE_DIMENSION || "affordability-response";
const generatedAt = new Date();
const stamp = generatedAt.toISOString().replace(/[:.]/g, "-");
const outDir = path.join(repoRoot, "tmp", "review-evidence", stamp);

const viewports = {
  desktop: { width: 1366, height: 900 },
  mobile: { width: 390, height: 844 },
};

const scenarios = [
  { key: "scorecard", label: "Scorecard", hash: "view-scorecard" },
  { key: "promises", label: "Promises", hash: "view-promises" },
  { key: "changelog", label: "Change Log", hash: "view-changelog" },
  { key: "methodology", label: "Rubric", hash: "view-methodology" },
  { key: "about", label: "About", hash: "view-about" },
  {
    key: `expanded-${dimensionId}`,
    label: `Expanded dimension: ${dimensionId}`,
    hash: `dim-${dimensionId}-scoring`,
  },
];

function routeFor(hash) {
  const url = new URL(baseUrl);
  url.hash = hash;
  return url.toString();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function stubAnalytics(context) {
  const analyticsStub = async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/javascript",
      body: "/* analytics stubbed for review evidence capture */",
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

async function waitForRenderedDashboard(page, scenario) {
  await page.goto(routeFor(scenario.hash), { waitUntil: "domcontentloaded" });
  await page.locator(".app-shell").waitFor({ state: "visible", timeout: 15_000 });
  await page.getByRole("heading", { name: "Canada Under Carney", level: 1 }).waitFor({ timeout: 15_000 });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await page.waitForTimeout(450);
}

async function getRenderedState(page) {
  return page.evaluate(() => {
    const activeNav = Array.from(document.querySelectorAll('[aria-current="page"]'))
      .map((node) => node.textContent?.trim())
      .filter(Boolean);
    const expanded = document.querySelector("[data-expanded='true']")?.id || "";
    const h1 = document.querySelector("h1")?.textContent?.trim() || "";
    const versionText = Array.from(document.querySelectorAll("body *"))
      .map((node) => node.textContent?.trim())
      .find((text) => /^v\d+\.\d+$/.test(text || "")) || "";
    return {
      title: h1,
      activeNav,
      expanded,
      versionText,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        scrollWidth: document.documentElement.scrollWidth,
      },
    };
  });
}

async function imageDataUrl(filePath) {
  const image = await readFile(filePath);
  return `data:image/png;base64,${image.toString("base64")}`;
}

function contactSheetHtml(captures) {
  const cards = captures.map((capture) => `
    <section class="capture">
      <h2>${escapeHtml(capture.label)} - ${escapeHtml(capture.viewportName)}</h2>
      <p>${escapeHtml(capture.url)}</p>
      <img src="${capture.dataUrl}" alt="${escapeHtml(capture.label)} ${escapeHtml(capture.viewportName)} screenshot" />
    </section>
  `).join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Canada Under Carney Review Evidence</title>
  <style>
    @page { margin: 18mm; }
    body {
      color: #1f2933;
      font-family: Arial, sans-serif;
      margin: 0;
    }
    h1 {
      font-size: 22px;
      margin: 0 0 6px;
    }
    h2 {
      font-size: 16px;
      margin: 0 0 4px;
    }
    p {
      color: #52606d;
      font-size: 10px;
      margin: 0 0 12px;
      word-break: break-all;
    }
    .cover {
      border-bottom: 1px solid #d9e2ec;
      margin-bottom: 18px;
      padding-bottom: 12px;
    }
    .capture {
      break-inside: avoid;
      page-break-inside: avoid;
      margin-bottom: 22px;
    }
    img {
      border: 1px solid #d9e2ec;
      display: block;
      max-width: 100%;
    }
  </style>
</head>
<body>
  <section class="cover">
    <h1>Canada Under Carney review evidence</h1>
    <p>Generated ${escapeHtml(generatedAt.toISOString())} from ${escapeHtml(baseUrl)}. Repo meta version v${escapeHtml(meta.version)}, last updated ${escapeHtml(meta.lastUpdated)}.</p>
  </section>
  ${cards}
</body>
</html>`;
}

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext();
await stubAnalytics(context);

const captures = [];

try {
  for (const [viewportName, viewport] of Object.entries(viewports)) {
    const page = await context.newPage();
    await page.setViewportSize(viewport);

    for (const scenario of scenarios) {
      await waitForRenderedDashboard(page, scenario);
      const fileName = `${scenario.key}-${viewportName}.png`;
      const filePath = path.join(outDir, fileName);
      await page.screenshot({ path: filePath, fullPage: true });
      captures.push({
        ...scenario,
        viewportName,
        viewport,
        fileName,
        filePath,
        url: routeFor(scenario.hash),
        state: await getRenderedState(page),
      });
      console.log(`captured ${fileName}`);
    }

    await page.close();
  }

  for (const capture of captures) {
    capture.dataUrl = await imageDataUrl(capture.filePath);
  }

  const contactSheetPath = path.join(outDir, "review-evidence.html");
  await writeFile(contactSheetPath, contactSheetHtml(captures), "utf8");

  const pdfPage = await context.newPage();
  await pdfPage.setContent(contactSheetHtml(captures), { waitUntil: "load" });
  const pdfPath = path.join(outDir, "review-evidence.pdf");
  await pdfPage.pdf({
    path: pdfPath,
    format: "Letter",
    printBackground: true,
  });
  await pdfPage.close();

  const manifest = [
    "# Canada Under Carney Review Evidence",
    "",
    `Generated: ${generatedAt.toISOString()}`,
    `Source URL: ${baseUrl}`,
    `Repo meta version: v${meta.version}`,
    `Repo lastUpdated: ${meta.lastUpdated}`,
    `Expanded dimension: ${dimensionId}`,
    "",
    "## Attach To Reviewer",
    "",
    "- `review-evidence.pdf` for one-file visual review.",
    "- `manifest.md` for capture details.",
    "- Individual PNGs only if the reviewer needs to zoom into a specific view.",
    "",
    "## Review Prompt Snippet",
    "",
    "```text",
    "Use the attached review-evidence.pdf as rendered-browser evidence for the live dashboard. Treat layout, hierarchy, mobile wrapping, and interaction comments as visual findings only when they are visible in the screenshots. Use the tracked-file repo bundle or individually attached files for code, methodology, and source-chain claims. Clearly label each finding as rendered evidence, repo inference, or needs live interaction.",
    "```",
    "",
    "## Captures",
    "",
    ...captures.flatMap((capture) => [
      `- ${capture.fileName}`,
      `  - View: ${capture.label}`,
      `  - Viewport: ${capture.viewportName} ${capture.viewport.width}x${capture.viewport.height}`,
      `  - URL: ${capture.url}`,
      `  - Active nav: ${capture.state.activeNav.join(", ") || "none"}`,
      `  - Rendered version text: ${capture.state.versionText || "not detected"}`,
      `  - Horizontal overflow: ${capture.state.viewport.scrollWidth > capture.state.viewport.width ? "yes" : "no"}`,
    ]),
    "",
  ].join("\n");

  await writeFile(path.join(outDir, "manifest.md"), manifest, "utf8");

  console.log("");
  console.log(`review evidence written to ${outDir}`);
  console.log(`attach ${pdfPath}`);
} finally {
  await browser.close();
}
