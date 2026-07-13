import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const changelogPath = path.join(repoRoot, "src", "data", "changelog.json");
const summaryPath = path.join(repoRoot, "src", "data", "changelog-summary.json");
const checkOnly = process.argv.includes("--check");

const changelog = JSON.parse(fs.readFileSync(changelogPath, "utf8"));
const summary = changelog.map((entry) => ({
  date: entry.date,
  version: entry.version,
  items: (entry.items || [])
    .map((item, itemIndex) => ({ ...item, itemIndex }))
    .filter((item) => item.type === "grade"),
}));
const output = `${JSON.stringify(summary, null, 2)}\n`;

if (checkOnly) {
  const current = fs.existsSync(summaryPath) ? fs.readFileSync(summaryPath, "utf8") : "";
  if (current !== output) {
    console.error("changelog summary: stale - run node scripts/generate-changelog-summary.mjs");
    process.exit(1);
  }
  console.log(`changelog summary: OK (${summary.length} releases)`);
  process.exit(0);
}

fs.writeFileSync(summaryPath, output);
console.log(`Wrote ${summaryPath} (${summary.length} releases)`);
