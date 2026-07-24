import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { buildFirstLookProjection } from "../src/firstLook.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const changelogPath = path.join(repoRoot, "src", "data", "changelog.json");
const summaryPath = path.join(repoRoot, "src", "data", "changelog-summary.json");

export function buildChangelogSummary(changelog) {
  if (!Array.isArray(changelog) || changelog.length === 0) {
    throw new TypeError("changelog must be a non-empty array");
  }

  return changelog.map((entry, entryIndex) => ({
    date: entry.date,
    version: entry.version,
    items: (entry.items || [])
      .map((item, itemIndex) => ({ ...item, itemIndex }))
      .filter((item) => item.type === "grade"),
    ...(entryIndex === 0
      ? { firstLook: buildFirstLookProjection(entry) }
      : {}),
  }));
}

function main() {
  const checkOnly = process.argv.includes("--check");
  const changelog = JSON.parse(fs.readFileSync(changelogPath, "utf8"));
  const summary = buildChangelogSummary(changelog);
  const output = `${JSON.stringify(summary, null, 2)}\n`;

  if (checkOnly) {
    const current = fs.existsSync(summaryPath) ? fs.readFileSync(summaryPath, "utf8") : "";
    if (current !== output) {
      console.error("changelog summary: stale - run node scripts/generate-changelog-summary.mjs");
      process.exit(1);
    }
    console.log(`changelog summary: OK (${summary.length} releases)`);
    return;
  }

  fs.writeFileSync(summaryPath, output);
  console.log(`Wrote ${summaryPath} (${summary.length} releases)`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
