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
  dashboard: read("src/components/Dashboard.jsx"),
  promises: read("src/components/PromiseTracker.jsx"),
  promisesRoute: read("src/components/PromiseTrackerRoute.jsx"),
  whatsChangedRoute: read("src/components/WhatsChangedRoute.jsx"),
  dimension: read("src/components/DimensionCard.jsx"),
  dimensionData: read("src/dimensionData.js"),
  dimensionsSummary: read("src/data/dimensions-summary.json"),
  gradeMoves: read("src/gradeMoves.js"),
  sinceLastVisit: read("src/components/SinceLastVisit.jsx"),
  sinceLastVisitHelpers: read("src/sinceLastVisit.js"),
  css: read("src/components/AppShell.css"),
};
const publicJsPath = [
  sources.app,
  sources.dashboard,
  sources.promises,
  sources.dimension,
  sources.gradeMoves,
  sources.sinceLastVisit,
  sources.sinceLastVisitHelpers,
].join("\n");
const failures = [];
let assertionCount = 0;

function check(condition, message) {
  assertionCount += 1;
  if (!condition) failures.push(message);
}

function imports(source, moduleName) {
  // A static import or a route-level React.lazy dynamic import both bind the
  // production module into the file; either satisfies the contract. The
  // paired renders() check still requires the component to be used.
  return new RegExp(`import\\s+[^;]+\\s+from\\s+["'][^"']*${moduleName}["']`).test(source)
    || new RegExp(`lazy\\(\\(\\)\\s*=>\\s*import\\(["'][^"']*${moduleName}["']\\)\\)`).test(source);
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
  imports(sources.app, "Dashboard") && renders(sources.app, "Dashboard"),
  "App.jsx must render the production Dashboard as the public app-shell entry.",
);
check(
  !sources.app.includes("import.meta.env.DEV"),
  "The app-shell route must not be guarded by import.meta.env.DEV.",
);
check(
  !sources.app.includes("DashboardPrototype") &&
    !/get\(["']experience["']\)/.test(sources.app) &&
    !sources.app.includes("experience=classic"),
  "App.jsx must not retain public experience-query routing or the classic rollback branch.",
);
check(
  !sources.dashboard.includes("classic-shell") &&
    sources.dashboard.includes('className="dashboard-shell app-shell"') &&
    sources.dashboard.includes('data-experience="app"'),
  "Dashboard must expose only the app shell, not a classic-shell branch.",
);
check(
  /function\s+Dashboard\s*\(\s*\)/.test(sources.dashboard) &&
    /const\s+appMode\s*=\s*true/.test(sources.dashboard),
  "Dashboard must use the app shell as its only public mode.",
);
check(
  /import\s+["']\.\/AppShell\.css["']/.test(sources.dashboard) &&
    sources.dashboard.includes('data-experience="app"'),
  "Dashboard must load app-shell styles and expose the active experience.",
);
check(
  !/metrics\s*\??\.\s*slice\s*\(\s*0\s*,\s*6\s*\)/.test(publicJsPath) &&
    !/slice\s*\(\s*0\s*,\s*6\s*\)/.test(publicJsPath),
  "The public app path must not retain the prototype six-metric truncation.",
);
check(
  !/sessionStorage|document\.cookie|newSinceLastVisit|lastSeenAt|changedDimensions/.test(publicJsPath) &&
    !/localStorage\.setItem\(\s*["'](?!(?:ccc-theme|ccc-last-seen-version)["'])/.test(publicJsPath),
  "The public app path must not add personalized visit tracking or storage beyond the two explicit client-only keys (ccc-theme, ccc-last-seen-version).",
);
// Variable-key writes would slip past the literal-key allowlist above, so pin
// the SinceLastVisit constant to its approved value and require every setItem
// in those files to go through it.
check(
  /const STORAGE_KEY = "ccc-last-seen-version";/.test(sources.sinceLastVisit) &&
    [sources.sinceLastVisit, sources.sinceLastVisitHelpers].every((src) => (
      (src.match(/localStorage\.setItem\(/g) || []).every(Boolean)
      && !/localStorage\.setItem\(\s*(?!STORAGE_KEY\s*,)/.test(src)
    )),
  "SinceLastVisit must write only via the pinned STORAGE_KEY constant (ccc-last-seen-version).",
);

for (const componentName of [
  "ScoreboardHeader",
  "DimensionCard",
  "PromiseTrackerRoute",
  "WhatsChangedRoute",
  "Methodology",
  "About",
]) {
  check(
    imports(sources.dashboard, componentName) && renders(sources.dashboard, componentName),
    `Dashboard must import and render the production ${componentName} surface.`,
  );
}
check(
  imports(sources.whatsChangedRoute, "changelog.json")
    && imports(sources.whatsChangedRoute, "WhatsChanged")
    && renders(sources.whatsChangedRoute, "WhatsChanged"),
  "The deferred Changes route must own the full changelog import and render WhatsChanged.",
);
check(
  ["PromiseTrackerRoute", "WhatsChangedRoute", "Methodology", "About"].every((componentName) => (
    new RegExp(`<${componentName}\\b[^>]*onReady=\\{handleLazyViewReady\\}`).test(sources.dashboard)
  )),
  "Every deferred route must signal readiness after mounting so inner anchor navigation can retry.",
);
check(
  /<PromiseTrackerRoute\b[\s\S]*?appMode=\{appMode\}/.test(sources.dashboard)
    && /<PromiseTracker\b[\s\S]*?appMode=\{appMode\}/.test(sources.promisesRoute),
  "Dashboard must pass app mode through the deferred route into PromiseTracker.",
);
check(
  imports(sources.dashboard, "dimensions-summary.json")
    && !imports(sources.dashboard, "dimensions.json")
    && imports(sources.dashboard, "dimensionData")
    && sources.dashboard.includes("loadDimensions("),
  "Dashboard must use the generated summary for first paint and load canonical dimensions on demand.",
);
check(
  imports(sources.promisesRoute, "PromiseTracker")
    && imports(sources.promisesRoute, "dimensionData")
    && sources.promisesRoute.includes("loadDimensions(")
    && sources.promisesRoute.includes("retryDimensionsLoad(")
    && renders(sources.promisesRoute, "PromiseTracker"),
  "The deferred Promises route must own canonical loading, retry, and PromiseTracker rendering.",
);
check(
  sources.dimensionData.includes('dimensions.json?url')
    && sources.dimensionData.includes("fetch(dimensionsAssetUrl")
    && sources.dimensionData.includes("export function loadDimensions(")
    && sources.dimensionData.includes("export function retryDimensionsLoad(")
    && !/from\s+["']\.\/data\/dimensions\.json["']/.test(sources.dimensionData),
  "Canonical dimensions must be a memoized, retriable same-origin JSON asset rather than a static JS import.",
);
check(
  sources.promisesRoute.includes('role="status"')
    && sources.promisesRoute.includes('role="alert"')
    && sources.promisesRoute.includes("Try again")
    && sources.promisesRoute.includes("onReady={onReady}"),
  "The deferred Promises route must expose accessible loading, contained failure, retry, and readiness states.",
);
try {
  const summary = JSON.parse(sources.dimensionsSummary);
  check(
    Array.isArray(summary.dimensions)
      && summary.dimensions.length > 0
      && Number.isInteger(summary.totalPromises)
      && summary.promiseCounts
      && summary.dimensions.every((dimension) => !(
        "metrics" in dimension || "promises" in dimension || "sources" in dimension
      )),
    "The first-paint summary must contain dimensions and aggregate promise counts without detail collections.",
  );
} catch {
  check(false, "The generated dimensions summary must be valid JSON.");
}
check(
  imports(sources.dashboard, "gradeMoves") &&
    sources.dashboard.includes("getCurrentGradeMoves(changelogSummary, dimensions, meta)") &&
    sources.dashboard.includes("getCurrentGradeMovesByDimension(") &&
    sources.dashboard.includes("changelogSummary,") &&
    /<DashboardStatus\s+gradeMoves=\{currentGradeMoves\}/.test(sources.dashboard) &&
    /gradeMoves=\{currentGradeMovesByDimension\.get\(d\.id\) \|\| \[\]\}/.test(sources.dashboard),
  "Dashboard must derive current-release grade moves from changelog grade items and pass them into status/card surfaces.",
);
check(
  !sources.dashboard.includes("../data/changelog.json")
    && !sources.dimension.includes("../data/changelog.json")
    && !sources.sinceLastVisit.includes("../data/changelog.json"),
  "The scorecard path must use the small changelog summary instead of importing the full history.",
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
  /<nav\s+[\s\S]*?className=["']dashboard-tabs dashboard-section-nav["'][\s\S]*?aria-label=["']Dashboard sections["']/.test(
    sources.dashboard,
  ),
  "Non-behavioral source contract: dashboard section tabs must retain semantic navigation with an accessible label.",
);
const bottomNavContract = sourceAround(sources.dashboard, 'className="app-bottom-nav"', 0, 1800);
check(
  bottomNavContract.includes("dashboardSectionIcon(tab.key)") &&
    bottomNavContract.includes('className="app-bottom-nav-label"') &&
    /<svg[\s\S]*?aria-hidden=["']true["']/.test(sources.dashboard),
  "Non-behavioral source contract: mobile navigation must retain decorative icons alongside visible text labels.",
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
const promiseFilterReturnContract = sourceAround(
  sources.promises,
  "const [isFilterSectionVisible",
  0,
  1200,
);
const promiseFilterReturnRenderContract = sourceAround(
  sources.promises,
  "hasActiveFilter && !isFilterSectionVisible",
  0,
  1200,
);
check(
  promiseFilterReturnContract.includes("new IntersectionObserver") &&
    promiseFilterReturnContract.includes("observer.observe(filterSection)") &&
    promiseFilterReturnContract.includes("observer.disconnect()") &&
    promiseFilterReturnRenderContract.includes('className="app-promise-filter-return-button"') &&
    promiseFilterReturnRenderContract.includes("onClick={returnToFilters}"),
  "Non-behavioral source contract: PromiseTracker must retain its observed off-screen filter-return affordance and observer cleanup.",
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
const bodyLockContract = sourceAround(
  sources.dashboard,
  "document.body.style.overflow = isMobile",
  0,
  400,
);
const modalEntryCleanupContract = sourceAround(
  sources.dashboard,
  "const closeDimension = useCallback",
  0,
  2600,
);
const dimensionToViewContract = sourceAround(
  sources.dashboard,
  "const routeDimensionToView = useCallback",
  0,
  2400,
);
const internalViewContract = sourceAround(
  sources.dashboard,
  'if (ref.type === "view")',
  0,
  500,
).split('if (ref.type === "anchor")')[0];
const viewFocusContract = sourceAround(
  sources.dashboard,
  "const target = pendingViewFocusRef.current",
  200,
  800,
);
const promiseViewRenderContract = sourceAround(
  sources.dashboard,
  'id={`view-${view}`}',
  0,
  7000,
);
check(
  bodyLockContract.includes('isMobile && expanded !== null ? "hidden" : ""') &&
    /},\s*\[expanded,\s*isMobile\]\);/.test(bodyLockContract) &&
    modalEntryCleanupContract.includes("const ownsModalEntry = mobileModalEntryRef.current") &&
    /if\s*\(typeof window !== ["']undefined["'] && ownsModalEntry\)/.test(modalEntryCleanupContract) &&
    /if\s*\(mobileModalEntryRef\.current\)/.test(modalEntryCleanupContract),
  "Non-behavioral source contract: body lock must react to isMobile, while owned modal-entry cleanup must not depend on the current viewport.",
);
check(
  dimensionToViewContract.includes(
    "const owned = mobileModalEntryRef.current || window.history.state?.dimModal",
  ) &&
    dimensionToViewContract.includes("delete nextState.dimModal") &&
    /if\s*\(owned\)\s*\{[\s\S]*?history\.replaceState[\s\S]*?\}\s*else\s*\{[\s\S]*?history\.pushState/.test(
      dimensionToViewContract,
    ),
  "Non-behavioral source contract: tracker view routing must replace owned modal history and push non-owned app history, independent of viewport.",
);
check(
  internalViewContract.includes("routeDimensionToView(ref.target, ref.dimension)") &&
    !internalViewContract.includes("closeDimensionForInternalNavigation") &&
    !internalViewContract.includes("setView(ref.target)") &&
    !dimensionToViewContract.includes("history.back"),
  "Non-behavioral source contract: internal view routing must use the scoped transition (with dimension filter) without a history.back/setView race.",
);
const changeAnchorContract = sourceAround(
  sources.dashboard,
  'target.startsWith("change-")',
  0,
  900,
);
check(
  changeAnchorContract.includes("delete nextState.dimModal") &&
    changeAnchorContract.includes("history.replaceState") &&
    changeAnchorContract.includes('setView("changelog")') &&
    !changeAnchorContract.includes("history.back"),
  "Non-behavioral source contract: grade-move changelog anchors must replace owned modal history and land on the Changes view.",
);
check(
  sources.dimension.includes("data-grade-moved-this-release") &&
    sources.dimension.includes("dim-current-grade-move-marker") &&
    sources.dimension.includes("dim-current-grade-move-callout") &&
    sources.dimension.includes("latestGradeMove.anchorId") &&
    !sourceAround(sources.dimension, 'className="dim-card-header-button"', 0, 2600).includes("<a"),
  "Dimension cards must expose a non-interactive collapsed grade-move marker and keep the actual changelog link in expanded detail.",
);
check(
  dimensionToViewContract.includes("requestAnchorNavigation(destination)") &&
    viewFocusContract.includes("document.getElementById(target)") &&
    viewFocusContract.includes("focus({ preventScroll: true })") &&
    promiseViewRenderContract.includes('tabIndex={view === "promises" ? -1 : undefined}') &&
    promiseViewRenderContract.includes('style={view === "promises" ? { scrollMarginTop: "16px" } : undefined}') &&
    !promiseViewRenderContract.includes('id={appMode ? undefined : "view-promises"}'),
  "Non-behavioral source contract: Promises must have one focusable destination that preserves anchor positioning.",
);

check(
  /@media\s*\(prefers-reduced-motion:\s*reduce\)/.test(sources.css) &&
    /\.app-shell-view\s*\{[\s\S]*?animation:\s*none/.test(sources.css),
  "App-shell motion must include a reduced-motion override.",
);
const reducedMotionContract = sourceAround(
  sources.css,
  "@media (prefers-reduced-motion: reduce)",
  0,
  600,
);
check(
  /@keyframes\s+app-bottom-nav-in/.test(sources.css) &&
    /\.app-bottom-nav\s*\{[\s\S]*?animation:\s*app-bottom-nav-in\b/.test(sources.css) &&
    /\.app-shell-view,\s*\.app-bottom-nav\s*\{[\s\S]*?animation:\s*none/.test(
      reducedMotionContract,
    ),
  "Non-behavioral source contract: bottom navigation must retain its entrance animation and reduced-motion suppression.",
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

console.log(`App-shell contract test passed (${assertionCount} checks across ${Object.keys(sources).length} source files).`);
