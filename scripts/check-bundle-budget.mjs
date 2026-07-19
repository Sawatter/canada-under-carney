// Bundle architecture gate. It reads Vite's manifest so it can distinguish
// the entry graph from deferred routes instead of checking only the largest
// anonymous file in dist/assets/.
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(repoRoot, "dist");
const manifestPath = path.join(distDir, ".vite", "manifest.json");
const fontLicensePath = path.join(distDir, "assets", "fonts", "OFL.txt");
const canonicalDimensionsPath = path.join(repoRoot, "src", "data", "dimensions.json");
const ENTRY_BUDGET_BYTES = 530000;
const INITIAL_GRAPH_BUDGET_BYTES = 540000;
const DEFERRED_ROUTE_KEYS = [
  "src/components/WhatsChangedRoute.jsx",
  "src/components/PromiseTrackerRoute.jsx",
  "src/components/Methodology.jsx",
  "src/components/About.jsx",
];

let manifest;
try {
  manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
} catch {
  console.error(`bundle budget: cannot read ${manifestPath} - enable Vite's build manifest and run vite build first.`);
  process.exit(1);
}

const manifestEntries = Object.entries(manifest);
const entryPair = manifestEntries.find(([, record]) => record.isEntry);
if (!entryPair) {
  console.error("bundle budget: no entry record found in the Vite manifest.");
  process.exit(1);
}

const [entryKey, entryRecord] = entryPair;
const keyByFile = new Map(manifestEntries.map(([key, record]) => [record.file, key]));
const initialKeys = new Set();

function visitInitial(key) {
  if (!key || initialKeys.has(key)) return;
  const record = manifest[key];
  if (!record) return;
  initialKeys.add(key);
  for (const importedFile of record.imports || []) {
    visitInitial(keyByFile.get(importedFile) || importedFile);
  }
}

function recordBytes(record) {
  return statSync(path.join(distDir, record.file)).size;
}

visitInitial(entryKey);
const entryBytes = recordBytes(entryRecord);
const initialBytes = [...initialKeys]
  .map((key) => manifest[key])
  .filter(Boolean)
  .reduce((total, record) => total + recordBytes(record), 0);
const initialSource = [...initialKeys]
  .map((key) => manifest[key])
  .filter((record) => record?.file.endsWith(".js"))
  .map((record) => readFileSync(path.join(distDir, record.file), "utf8"))
  .join("\n");

const errors = [];
const canonicalDimensions = JSON.parse(readFileSync(canonicalDimensionsPath, "utf8"));
const canonicalJson = JSON.stringify(canonicalDimensions);
const dimensionsAssets = readdirSync(path.join(distDir, "assets"))
  .filter((file) => file.endsWith(".json"))
  .filter((file) => {
    try {
      const builtData = JSON.parse(readFileSync(path.join(distDir, "assets", file), "utf8"));
      return JSON.stringify(builtData) === canonicalJson;
    } catch {
      return false;
    }
  });

if (dimensionsAssets.length !== 1) {
  errors.push(
    `expected one emitted canonical dimensions JSON asset, found ${dimensionsAssets.length}`,
  );
}

// The summary deliberately excludes these authored detail strings. Finding
// one in the initial JS graph means canonical data was embedded by a static
// import instead of remaining behind the on-demand asset loader.
const detailSentinels = canonicalDimensions.flatMap((dimension) => [
  dimension.judgmentDetail,
  dimension.rationale,
]).filter((value) => typeof value === "string" && value.length >= 200);
const embeddedDetail = detailSentinels.find((value) => initialSource.includes(value));
if (embeddedDetail) {
  errors.push("canonical dimension detail is embedded in the initial JS graph");
}

try {
  if (!readFileSync(fontLicensePath, "utf8").includes("SIL OPEN FONT LICENSE Version 1.1")) {
    errors.push("built font license does not contain the expected SIL OFL text");
  }
} catch {
  errors.push("missing redistributed font license: dist/assets/fonts/OFL.txt");
}
if (entryBytes > ENTRY_BUDGET_BYTES) {
  errors.push(`entry ${entryRecord.file} is ${entryBytes.toLocaleString("en-CA")} bytes (budget ${ENTRY_BUDGET_BYTES.toLocaleString("en-CA")})`);
}
if (initialBytes > INITIAL_GRAPH_BUDGET_BYTES) {
  errors.push(`initial JS graph is ${initialBytes.toLocaleString("en-CA")} bytes (budget ${INITIAL_GRAPH_BUDGET_BYTES.toLocaleString("en-CA")})`);
}

for (const key of DEFERRED_ROUTE_KEYS) {
  const record = manifest[key];
  if (!record) {
    errors.push(`missing deferred route manifest entry: ${key}`);
    continue;
  }
  if (!record.isDynamicEntry || initialKeys.has(key)) {
    errors.push(`${key} is not isolated as a deferred dynamic entry`);
  }
}

if (errors.length > 0) {
  console.error(`bundle budget: FAIL\n${errors.map((error) => `  - ${error}`).join("\n")}`);
  process.exit(1);
}

console.log(
  `bundle budget: OK - entry ${entryBytes.toLocaleString("en-CA")} bytes; initial JS graph ${initialBytes.toLocaleString("en-CA")} bytes.`,
);
const dimensionsAsset = dimensionsAssets[0];
console.log(
  `  deferred ${dimensionsAsset}  ${statSync(path.join(distDir, "assets", dimensionsAsset)).size.toLocaleString("en-CA")} bytes`,
);
for (const key of DEFERRED_ROUTE_KEYS) {
  const record = manifest[key];
  console.log(`  deferred ${record.file}  ${recordBytes(record).toLocaleString("en-CA")} bytes`);
}
