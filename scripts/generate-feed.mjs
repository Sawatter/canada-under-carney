#!/usr/bin/env node
// Generates public/feed.xml from src/data/changelog.json and src/data/meta.json.
// Runs on every `npm run build` (via the prebuild hook in package.json).

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

const changelog = JSON.parse(
  readFileSync(resolve(repoRoot, "src/data/changelog.json"), "utf8")
);
const meta = JSON.parse(
  readFileSync(resolve(repoRoot, "src/data/meta.json"), "utf8")
);

const SITE_URL = "https://sawatter.github.io/canada-under-carney/";
const FEED_URL = `${SITE_URL}feed.xml`;

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function pubDate(isoDate) {
  const d = new Date(`${isoDate}T12:00:00Z`);
  return d.toUTCString();
}

const TYPE_LABELS = {
  grade:   "Grade change",
  event:   "Policy event",
  product: "Product update",
  method:  "Methodology",
  minor:   "Minor update",
};

function renderItem(it) {
  if (it.type === "grade") {
    const dim = it.dimensionName || it.dimensionId || "Graded dimension";
    const tail = it.body ? `. ${it.body}` : "";
    const delta = it.deltaLabel ? ` (${it.deltaLabel})` : "";
    return `<strong>[${TYPE_LABELS.grade}] ${xmlEscape(dim)}</strong>: ${xmlEscape(
      it.from
    )} → ${xmlEscape(it.to)}${xmlEscape(delta)}${xmlEscape(tail)}`;
  }
  const label = TYPE_LABELS[it.type] || "Update";
  const head = it.headline ? `<strong>[${label}] ${xmlEscape(it.headline)}</strong>` : `<strong>[${label}]</strong>`;
  const body = it.body ? `. ${xmlEscape(it.body)}` : "";
  return `${head}${body}`;
}

function renderItemDescription(entry) {
  const summary = entry.summary ? `<p>${xmlEscape(entry.summary)}</p>` : "";
  const list = (entry.items || entry.changes || []);
  const bullets = list
    .map((it) => `<li>${renderItem(it)}</li>`)
    .filter((li) => li !== "<li></li>")
    .join("");
  const block = bullets ? `<ul>${bullets}</ul>` : "";
  return `${summary}${block}`.trim();
}

const items = changelog
  .map((entry) => {
    const title = `Update ${entry.date} — ${
      entry.summary
        ? entry.summary.slice(0, 80) + (entry.summary.length > 80 ? "…" : "")
        : "Dashboard update"
    }`;
    const description = renderItemDescription(entry);
    const guid = `${SITE_URL}#update-${entry.date}`;
    return `
    <item>
      <title>${xmlEscape(title)}</title>
      <link>${xmlEscape(SITE_URL)}</link>
      <guid isPermaLink="false">${xmlEscape(guid)}</guid>
      <pubDate>${pubDate(entry.date)}</pubDate>
      <description><![CDATA[${description}]]></description>
    </item>`;
  })
  .join("");

const lastBuild = new Date().toUTCString();

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="feed.xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Canada Under Carney — Dashboard Updates</title>
    <link>${xmlEscape(SITE_URL)}</link>
    <atom:link href="${xmlEscape(FEED_URL)}" rel="self" type="application/rss+xml" />
    <description>Monthly updates to the Canada Under Carney performance dashboard: grade changes, major policy events, and readability passes. Version ${xmlEscape(
      meta.version
    )}, rubric v${xmlEscape(meta.rubricVersion)}.</description>
    <language>en-ca</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <generator>scripts/generate-feed.mjs</generator>
    ${items}
  </channel>
</rss>
`;

const outPath = resolve(repoRoot, "public/feed.xml");
writeFileSync(outPath, xml, "utf8");
console.log(`Wrote ${outPath} (${changelog.length} items)`);
