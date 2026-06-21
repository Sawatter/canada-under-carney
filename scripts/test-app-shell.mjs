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
const experienceResolver = sources.app.slice(
  sources.app.indexOf("function getRequestedExperience"),
  sources.app.indexOf("export default function App"),
);
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

function sourceAround(source, marker, before = 0, after = 2000) {
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) return "";
  return source.slice(Math.max(0, markerIndex - before), markerIndex + marker.length + after);
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
  "App.jsx must retain ?experience=classic as an explicit classic rollback.",
);
check(
  /typeof\s+window\s*===\s*["']undefined["']\)\s*return\s+["']app["']/.test(
    experienceResolver,
  ) && /return\s+["']app["'];?\s*}$/.test(experienceResolver.trim()),
  "App.jsx must default the bare root to the app shell.",
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

// These are coarse, non-behavioral source contracts. They catch removed focus
// plumbing, but only the keyboard walkthrough can assess focus behavior.
const dimensionFocusContract = sourceAround(
  sources.dimension,
  "const handleKeyDown",
  1800,
  4200,
);
const tabbableQueryContract = sourceAround(
  dimensionFocusContract,
  "querySelectorAll",
  0,
  500,
);
const desktopReturnContract = sourceAround(
  sources.dashboard,
  "const target = pendingDesktopReturnRef.current",
  100,
  2400,
);
const gridScrollIndex = desktopReturnContract.indexOf("scrollIntoView");
const savedScrollIndex = desktopReturnContract.indexOf("window.scrollTo");
const headerLookupIndex = desktopReturnContract.search(
  /getElementById\(\s*`dim-\$\{[^}]+\}-header`\s*\)/,
);
const desktopFocusIndex = headerLookupIndex === -1
  ? -1
  : desktopReturnContract.indexOf(".focus", headerLookupIndex);

check(
  sources.dimension.includes("previousFocusRef") &&
    sources.dimension.includes("drawerRef.current?.focus") &&
    /previousFocus\.focus\s*\(/.test(sources.dimension),
  "Non-behavioral source contract: dimension detail must retain focus-in and mobile focus-restore plumbing.",
);
check(
  /event\.key\s*!==\s*["']Escape["']/.test(sources.dimension) &&
    /role=\{isMobileDialog\s*\?\s*["']dialog["']/.test(sources.dimension),
  "Non-behavioral source contract: dimension detail must retain dialog and Escape-close plumbing.",
);
check(
  dimensionFocusContract.includes("isFocusedDesktop") &&
    dimensionFocusContract.includes("isMobileDialog") &&
    dimensionFocusContract.includes("drawerRef.current?.focus"),
  "Non-behavioral source contract: the dimension focus effect must cover focused desktop detail.",
);
check(
  /event\.key\s*(?:===|!==)\s*["']Tab["']/.test(dimensionFocusContract) &&
    dimensionFocusContract.includes("isMobileDialog") &&
    tabbableQueryContract.includes("summary"),
  "Non-behavioral source contract: the mobile-only Tab-trap branch must query native summary controls.",
);
check(
  /id=\{`dim-\$\{dim\.id\}-header`\}/.test(sources.dimension),
  "Non-behavioral source contract: grid card headers must expose a stable dimension-specific id.",
);
check(
  (sources.dashboard.match(/pendingDesktopFocusRef\.current\s*=/g) || []).length >= 2 &&
    /pendingDesktopFocusRef\.current\s*=\s*(?!null\b)[A-Za-z_$]/.test(sources.dashboard) &&
    gridScrollIndex !== -1 &&
    savedScrollIndex !== -1 &&
    desktopFocusIndex > gridScrollIndex &&
    desktopFocusIndex > savedScrollIndex &&
    !desktopReturnContract.slice(gridScrollIndex, desktopFocusIndex).includes("return undefined"),
  "Non-behavioral source contract: Dashboard must restore pending desktop focus after either scroll path.",
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
