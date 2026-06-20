import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

const sources = {
  app: read("src/App.jsx"),
  prototype: read("src/components/prototype/DashboardPrototype.jsx"),
  dashboard: read("src/components/Dashboard.jsx"),
  promises: read("src/components/PromiseTracker.jsx"),
  dimension: read("src/components/DimensionCard.jsx"),
  css: read("src/components/AppShell.css"),
};
const publicJsPath = [
  sources.app,
  sources.prototype,
  sources.dashboard,
  sources.promises,
  sources.dimension,
].join("\n");
const failures = [];
let assertionCount = 0;

function check(condition, message) {
  assertionCount += 1;
  if (!condition) failures.push(message);
}

function imports(source, moduleName) {
  return new RegExp(`import\\s+[^;]+\\s+from\\s+["'][^"']*${moduleName}["']`).test(source);
}

function renders(source, componentName) {
  return new RegExp(`<${componentName}\\b`).test(source);
}

check(
  imports(sources.app, "components/prototype/DashboardPrototype"),
  "App.jsx must import the public app-shell entry.",
);
check(
  !sources.app.includes("import.meta.env.DEV") && !sources.prototype.includes("import.meta.env.DEV"),
  "The app-shell route must not be guarded by import.meta.env.DEV.",
);
check(
  /get\(["']experience["']\)\s*===\s*["']app["']/.test(sources.app) &&
    /experience\s*===\s*["']app["']/.test(sources.app) &&
    renders(sources.app, "DashboardPrototype"),
  "App.jsx must select DashboardPrototype for ?experience=app.",
);
check(
  /get\(["']experience["']\)\s*===\s*["']classic["']/.test(sources.app) &&
    renders(sources.app, "Dashboard"),
  "App.jsx must retain an explicit ?experience=classic route and classic fallback.",
);

check(
  imports(sources.prototype, "Dashboard") &&
    /<Dashboard\s+experience=["']app["']\s*\/>/.test(sources.prototype),
  "DashboardPrototype must delegate to the production Dashboard in app mode.",
);
check(
  /function\s+Dashboard\s*\(\s*\{\s*experience\s*=\s*["']classic["']/.test(sources.dashboard) &&
    /experience\s*===\s*["']app["']/.test(sources.dashboard),
  "Dashboard must keep classic as its default and derive an explicit app mode.",
);
check(
  /import\s+["']\.\/AppShell\.css["']/.test(sources.dashboard) &&
    sources.dashboard.includes('data-experience={experience}'),
  "Dashboard must load app-shell styles and expose the active experience.",
);
check(
  !/metrics\s*\??\.\s*slice\s*\(\s*0\s*,\s*6\s*\)/.test(publicJsPath) &&
    !/slice\s*\(\s*0\s*,\s*6\s*\)/.test(publicJsPath),
  "The public app path must not retain the prototype six-metric truncation.",
);

for (const componentName of [
  "ScoreboardHeader",
  "DimensionCard",
  "PromiseTracker",
  "WhatsChanged",
  "Methodology",
  "About",
]) {
  check(
    imports(sources.dashboard, componentName) && renders(sources.dashboard, componentName),
    `Dashboard must import and render the production ${componentName} surface.`,
  );
}
check(
  /<PromiseTracker\b[\s\S]*?appMode=\{appMode\}/.test(sources.dashboard),
  "Dashboard must pass app mode into the production PromiseTracker.",
);

check(
  sources.dashboard.includes("window.history.pushState") &&
    sources.dashboard.includes("window.history.back()"),
  "App navigation must create history entries and support Back-driven detail close.",
);
check(
  sources.dashboard.includes('addEventListener("popstate"') &&
    sources.dashboard.includes('removeEventListener("popstate"'),
  "Dashboard must install and remove its browser Back and Forward listener.",
);
check(
  sources.dashboard.includes("aria-current") && sources.dashboard.includes("app-bottom-nav"),
  "Desktop and mobile app navigation must expose current-page semantics.",
);
check(
  sources.dashboard.includes('className="app-view-announcer"') &&
    sources.dashboard.includes('aria-live="polite"'),
  "App view changes must be announced through a polite live region.",
);
check(
  sources.promises.includes("app-promise-result-count") &&
    sources.promises.includes('aria-live="polite"'),
  "Filtered promise-result counts must be announced through a polite live region.",
);

check(
  sources.dimension.includes("previousFocusRef") &&
    sources.dimension.includes("drawerRef.current?.focus") &&
    /previousFocus\.focus\s*\(/.test(sources.dimension),
  "Dimension detail must move focus into the drawer and restore prior focus on close.",
);
check(
  /event\.key\s*!==\s*["']Escape["']/.test(sources.dimension) &&
    /role=\{isMobileDialog\s*\?\s*["']dialog["']/.test(sources.dimension),
  "Mobile dimension detail must retain dialog semantics and Escape close behavior.",
);
check(
  sources.dashboard.includes('href="#main-content"') &&
    sources.dashboard.includes('id="main-content"') &&
    sources.dashboard.includes("tabIndex={-1}"),
  "Dashboard must retain a skip link and focusable main-content target.",
);

check(
  /@media\s*\(prefers-reduced-motion:\s*reduce\)/.test(sources.css) &&
    /\.app-shell-view\s*\{[\s\S]*?animation:\s*none/.test(sources.css),
  "App-shell motion must include a reduced-motion override.",
);
check(
  /\.app-bottom-nav\s+button\s*\{[\s\S]*?min-height:\s*(?:4[4-9]|[5-9]\d)px/.test(sources.css),
  "Mobile bottom-nav controls must have a minimum target height of at least 44px.",
);
check(
  (sources.css.match(/env\(safe-area-inset-bottom/g) || []).length >= 2 &&
    sources.css.includes(".app-bottom-nav") && sources.css.includes(".app-shell"),
  "Mobile shell clearance and bottom navigation must account for the bottom safe area.",
);

if (failures.length > 0) {
  console.error(`App-shell contract test failed (${failures.length}/${assertionCount} checks):`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`App-shell contract test passed (${assertionCount} checks across 6 source files).`);
