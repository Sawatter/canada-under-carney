import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  buildFirstLookProjection,
  resolveNextCheckTiming,
  selectPrimaryNextCheck,
} from "../src/firstLook.js";
import {
  assertLoadedDocumentSha,
  browserAuditErrorFilename,
  deploymentIntegrityErrorFilename,
  deploymentMetadataUrl,
  fixedNavigationSafetyGap,
  isDirectCliInvocation,
  isFixedNavigationObstruction,
  parseExpectedDeployedSha,
  runBrowserAuditLifecycle,
  verifyDeployedCommit,
  writeDeploymentMetadata,
} from "./audit-live-dashboard-coverage.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

const sources = {
  app: read("src/App.jsx"),
  dashboard: read("src/components/Dashboard.jsx"),
  scoreboardHeader: read("src/components/ScoreboardHeader.jsx"),
  releaseUpdate: read("src/components/ReleaseUpdate.jsx"),
  dashboardStatus: read("src/components/DashboardStatus.jsx"),
  approvalSignal: read("src/components/ApprovalSignal.jsx"),
  promises: read("src/components/PromiseTracker.jsx"),
  promisesRoute: read("src/components/PromiseTrackerRoute.jsx"),
  whatsChangedRoute: read("src/components/WhatsChangedRoute.jsx"),
  dimension: read("src/components/DimensionCard.jsx"),
  dimensionData: read("src/dimensionData.js"),
  dimensionsSummary: read("src/data/dimensions-summary.json"),
  changelog: read("src/data/changelog.json"),
  changelogSummary: read("src/data/changelog-summary.json"),
  meta: read("src/data/meta.json"),
  status: read("src/data/status.json"),
  liveAudit: read("scripts/audit-live-dashboard-coverage.mjs"),
  liveAuditWorkflow: read(".github/workflows/live-dashboard-audit.yml"),
  deployWorkflow: read(".github/workflows/deploy.yml"),
  gradeMoves: read("src/gradeMoves.js"),
  sinceLastVisit: read("src/components/SinceLastVisit.jsx"),
  sinceLastVisitHelpers: read("src/sinceLastVisit.js"),
  css: read("src/components/AppShell.css"),
};
const publicJsPath = [
  sources.app,
  sources.dashboard,
  sources.scoreboardHeader,
  sources.releaseUpdate,
  sources.dashboardStatus,
  sources.approvalSignal,
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

function hasActiveYamlLine(source, expectedLine, indentation) {
  const expected = `${" ".repeat(indentation)}${expectedLine}`;
  return source.split("\n").some((line) => line === expected);
}

check(
  hasActiveYamlLine("    ref: fixture", "ref: fixture", 4)
    && !hasActiveYamlLine("    # ref: fixture", "ref: fixture", 4)
    && !hasActiveYamlLine("ref: fixture", "ref: fixture", 4),
  "Workflow contract checks must require active YAML at the expected indentation.",
);

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
try {
  const changelog = JSON.parse(sources.changelog);
  const changelogSummary = JSON.parse(sources.changelogSummary);
  const meta = JSON.parse(sources.meta);
  const status = JSON.parse(sources.status);
  const latestRelease = changelogSummary[0];

  check(
    latestRelease?.version === meta.version
      && latestRelease?.date === meta.lastUpdated
      && JSON.stringify(latestRelease.firstLook)
        === JSON.stringify(buildFirstLookProjection(changelog[0])),
    "The newest changelog summary must carry the canonical first-look projection for the current release.",
  );
  check(
    typeof meta.overallVerdictLine === "string"
      && meta.overallVerdictLine.trim().length > 0
      && JSON.stringify(selectPrimaryNextCheck(status))
        === JSON.stringify(status.nextChecks[0])
      && resolveNextCheckTiming(status, status.nextChecks[1]).value
        === status.nextScheduledSourceScanAt,
    "The first-look data contract must include an authored overall reason and select the first status next-check as primary.",
  );
} catch {
  check(false, "The first-look changelog, metadata, and status inputs must be valid JSON.");
}
check(
  imports(sources.dashboard, "gradeMoves") &&
    sources.dashboard.includes("getCurrentGradeMoves(changelogSummary, dimensions, meta)") &&
    sources.dashboard.includes("getCurrentGradeMovesByDimension(") &&
    sources.dashboard.includes("changelogSummary,") &&
    /<DashboardStatus\s*\/>/.test(sources.dashboard) &&
    !/<DashboardStatus\b[^>]*gradeMoves=/.test(sources.dashboard) &&
    /gradeMoves=\{currentGradeMovesByDimension\.get\(d\.id\) \|\| \[\]\}/.test(sources.dashboard),
  "Dashboard must derive current-release grade moves for policy cards without passing them into the freshness-only status surface.",
);
check(
  !sources.dashboard.includes("../data/changelog.json")
    && !sources.dimension.includes("../data/changelog.json")
    && !sources.sinceLastVisit.includes("../data/changelog.json"),
  "The scorecard path must use the small changelog summary instead of importing the full history.",
);
const firstLookRenderContract = sourceAround(
  sources.dashboard,
  "<ScoreboardHeader",
  300,
  1800,
);
check(
  imports(sources.dashboard, "changelog-summary.json")
    && imports(sources.dashboard, "firstLook")
    && sources.dashboard.includes("const latestRelease = changelogSummary[0];")
    && sources.dashboard.includes("const primaryNextCheck = selectPrimaryNextCheck(status);")
    && sources.dashboard.includes(
      "const primaryNextCheckTiming = resolveNextCheckTiming(status, primaryNextCheck);",
    )
    && firstLookRenderContract.includes("overallVerdictLine={meta.overallVerdictLine}")
    && firstLookRenderContract.includes("latestRelease={latestRelease}")
    && firstLookRenderContract.includes("nextUpdate={meta.nextUpdate}")
    && firstLookRenderContract.includes("primaryNextCheck={primaryNextCheck}")
    && firstLookRenderContract.includes(
      "primaryNextCheckTiming={primaryNextCheckTiming}",
    ),
  "Dashboard must feed ScoreboardHeader the canonical compact release projection, authored reason, next update, and primary next check.",
);
check(
  imports(sources.scoreboardHeader, "ReleaseUpdate")
    && sources.releaseUpdate.includes("latestRelease?.firstLook")
    && !sources.releaseUpdate.includes("latestRelease?.items")
    && sources.scoreboardHeader.includes("{overallVerdictLine}")
    && sources.scoreboardHeader.includes("<ReleaseUpdate latestRelease={latestRelease} />")
    && sources.scoreboardHeader.includes("primaryNextCheck={primaryNextCheck}")
    && sources.scoreboardHeader.includes(
      "primaryNextCheckTiming={primaryNextCheckTiming}",
    ),
  "ScoreboardHeader must render the authored reason and compact first-look projection without reading the full changelog entry.",
);
check(
  sources.scoreboardHeader.includes("What affects the grades")
    && sources.scoreboardHeader.includes(
      "Each of the 11 graded policy files counts equally.",
    )
    && sources.scoreboardHeader.includes("The same 11 files, with housing, cost of living")
    && sources.scoreboardHeader.includes("Promise Delivery and Approval do not affect either grade."),
  "The first-look briefing must state the Full Policy Audit, Household Impact, and context-only scoring boundaries.",
);
check(
  sources.scoreboardHeader.includes('role="group"')
    && sources.scoreboardHeader.includes('aria-labelledby="first-look-signals-heading"')
    && sources.scoreboardHeader.includes("Household Impact")
    && sources.scoreboardHeader.includes("Tracker outside the grades.")
    && sources.approvalSignal.includes("Public opinion outside the grades."),
  "The compact signal group must distinguish Household Impact from the Promise Delivery and Approval context signals.",
);
check(
  ["Evidence scan", "Next scheduled scan", "Editor-reviewed score cycle", "Coverage through"]
    .every((label) => sources.dashboardStatus.includes(label))
    && !sources.dashboardStatus.includes("gradeMoves")
    && !sources.dashboardStatus.includes("nextChecks")
    && !sources.dashboardStatus.includes("Grade moves")
    && !sources.dashboardStatus.includes("Next checks"),
  "DashboardStatus must remain a freshness-only surface without duplicate grade-move or next-check content.",
);

check(
  sources.dashboard.includes("window.history.pushState") &&
    sources.dashboard.includes("window.history.back()"),
  "App navigation must create history entries and support Back-driven detail close.",
);
const policyNavigationHelperContract = sourceAround(
  sources.dashboard,
  "function getPolicyNavigation",
  0,
  900,
);
const openDimensionContract = sourceAround(
  sources.dashboard,
  "const openDimension = useCallback",
  0,
  900,
).split("const handlePolicyNavigate = useCallback")[0];
const policyNavigationHandlerContract = sourceAround(
  sources.dashboard,
  "const handlePolicyNavigate = useCallback",
  0,
  1100,
).split("const closeDimension = useCallback")[0];
const focusedDetailPolicyContract = sourceAround(
  sources.dashboard,
  "{isDesktopFocusedDetail ? (",
  0,
  2500,
).split(") : (")[0];
const overviewPolicyContract = sourceAround(
  sources.dashboard,
  "{scoredDimensions.map((d) => (",
  0,
  1600,
);
const policyNavigationFocusContract = sourceAround(
  sources.dashboard,
  "const dimensionId = pendingPolicyNavigationFocusRef.current",
  200,
  1800,
);
const policyNavigationAnnouncementContract = sourceAround(
  sources.dashboard,
  'className="app-view-announcer app-policy-navigation-announcer"',
  100,
  400,
);
check(
  sources.dashboard.includes(
    "const scoredDimensions = dimensions.filter((d) => !d.excludeFromGPA);",
  ) &&
    sources.dashboard.includes(
      "getPolicyNavigation(scoredDimensions, expandedDimension?.id)",
    ) &&
    policyNavigationHelperContract.includes("if (currentIndex === -1") &&
    policyNavigationHelperContract.includes("return null"),
  "Desktop policy navigation must derive only from scoredDimensions and exclude the Promise Delivery tracker.",
);
check(
  policyNavigationHelperContract.includes(
    "(currentIndex - 1 + scoredPolicies.length) % scoredPolicies.length",
  ) &&
    policyNavigationHelperContract.includes(
      "(currentIndex + 1) % scoredPolicies.length",
    ),
  "Desktop policy navigation must wrap Previous and Next across the scored-policy sequence.",
);
check(
  focusedDetailPolicyContract.includes("previousPolicy={focusedPolicyNavigation?.previousPolicy}") &&
    focusedDetailPolicyContract.includes("nextPolicy={focusedPolicyNavigation?.nextPolicy}") &&
    focusedDetailPolicyContract.includes(
      "onPolicyNavigate={focusedPolicyNavigation ? handlePolicyNavigate : undefined}",
    ) &&
    !overviewPolicyContract.includes("previousPolicy=") &&
    !overviewPolicyContract.includes("nextPolicy=") &&
    !overviewPolicyContract.includes("onPolicyNavigate="),
  "Policy navigation props must be limited to the focused desktop DimensionCard, never overview/mobile cards.",
);
check(
  policyNavigationHandlerContract.includes("if (isMobileViewport()) return") &&
    policyNavigationHandlerContract.includes("anchorTargetRef.current = null") &&
    policyNavigationHandlerContract.includes("setAnchorNavigation(null)") &&
    policyNavigationHandlerContract.includes(
      "window.history.replaceState(nextState, \"\", `#dim-${dimensionId}-briefing`)",
    ) &&
    policyNavigationHandlerContract.includes(
      "if (mobileModalEntryRef.current) nextState.dimModal = dimensionId",
    ) &&
    policyNavigationHandlerContract.includes("else delete nextState.dimModal") &&
    policyNavigationHandlerContract.includes(
      "openDimension(dimensionId, { fromHash: true, preserveReturnScroll: true })",
    ) &&
    openDimensionContract.includes("!options.preserveReturnScroll") &&
    openDimensionContract.includes("pushModalHistoryEntry(dimensionId)"),
  "Policy switches must stay desktop-only, clear pending anchors, replace either owned or deep-link history in place, preserve grid return state, and route through openDimension.",
);
check(
  sourceAround(sources.dashboard, "const pushModalHistoryEntry", 0, 1100).includes(
    "if (mobileModalEntryRef.current)",
  ) &&
    sourceAround(sources.dashboard, "const pushModalHistoryEntry", 0, 1100).includes(
      "window.history.replaceState(nextState, \"\", nextUrl)",
    ),
  "Owned policy switches must retarget the existing #dim-* history entry with replaceState.",
);
check(
  policyNavigationHandlerContract.includes(
    "pendingPolicyNavigationFocusRef.current = dimensionId",
  ) &&
    policyNavigationHandlerContract.includes(
      "setPolicyNavigationAnnouncement(`${policy.name}, grade ${policy.grade}`)",
    ) &&
    policyNavigationFocusContract.includes('getElementById("scorecard-dimension-grid")') &&
    policyNavigationFocusContract.includes("scrollIntoView") &&
    (policyNavigationFocusContract.match(/requestAnimationFrame/g) || []).length >= 2 &&
    policyNavigationFocusContract.includes("getElementById(`dim-${dimensionId}-title`)") &&
    policyNavigationFocusContract.includes('setAttribute("tabindex", "-1")') &&
    policyNavigationFocusContract.includes("title.focus({ preventScroll: true })") &&
    sources.dashboard.includes("key={`focused-${expandedDimension.id}`}") &&
    policyNavigationAnnouncementContract.includes('aria-live="polite"') &&
    policyNavigationAnnouncementContract.includes("{policyNavigationAnnouncement}"),
  "Policy switches must remount at the top, focus the expanded title after render, and announce the new policy and grade.",
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
    sources.dimension.includes("initialFocus?.focus({ preventScroll: true })") &&
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
    dimensionFocusContract.includes("initialFocus?.focus"),
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
const policyJumpIndex = sources.dashboard.indexOf("Jump to the 11 policy grades");
const mainIndex = sources.dashboard.indexOf('<main id="main-content"');
const briefingIndex = sources.dashboard.indexOf("<ScoreboardHeader");
const statusIndex = sources.dashboard.indexOf("<DashboardStatus");
const sectionNavigationIndex = sources.dashboard.indexOf('className="dashboard-tabs-wrap"');
const briefingRouteContract = sourceAround(
  sources.scoreboardHeader,
  'className="first-look-actions"',
  0,
  900,
);
const policyJumpHandlerContract = sourceAround(
  sources.dashboard,
  "const handlePolicyGradesJump",
  0,
  800,
).split("const handleShowSafeguards")[0];
const safeguardsHandlerContract = sourceAround(
  sources.dashboard,
  "const handleShowSafeguards",
  0,
  900,
).split("const handleInternalRef")[0];
const anchorFocusContract = sourceAround(
  sources.dashboard,
  "function focusAndScrollToAnchor",
  0,
  500,
);
const policyHeadingContract = sourceAround(
  sources.dashboard,
  'id="policy-grades-heading"',
  100,
  500,
);
check(
  mainIndex !== -1
    && briefingIndex > mainIndex
    && statusIndex > briefingIndex
    && sectionNavigationIndex > statusIndex
    && sources.dashboard.includes('id="scoreboard-row"')
    && !sources.dashboard.includes('className="dashboard-orientation"')
    && !sources.dashboard.includes('className="scorecard-trust-wrap"')
    && policyJumpIndex === -1,
  "Dashboard must lead main content with the first-look briefing, then freshness status and section navigation, without the retired orientation/trust-frame hierarchy.",
);
check(
  briefingRouteContract.includes('href="#policy-grades-heading"')
    && briefingRouteContract.includes("Inspect the 11 policy files")
    && briefingRouteContract.includes("onClick={onPolicyGradesJump}")
    && briefingRouteContract.includes('href="#methodology-safeguards"')
    && briefingRouteContract.includes("Read the scoring method")
    && briefingRouteContract.includes("onClick={handleSafeguardsClick}"),
  "The first-look briefing must expose visible routes to the 11 policy files and scoring methodology.",
);
check(
  policyJumpHandlerContract.includes("event.preventDefault()") &&
    policyJumpHandlerContract.includes('const target = "policy-grades-heading"') &&
    policyJumpHandlerContract.includes('if (view === "scorecard")') &&
    policyJumpHandlerContract.includes("focusAndScrollToAnchor(target)") &&
    policyJumpHandlerContract.includes("handleHashTargetNavigation(target)") &&
    !policyJumpHandlerContract.includes("window.history"),
  "The policy-grade jump must focus in place on Scorecard and route other views without adding history.",
);
check(
  safeguardsHandlerContract.includes('const target = "methodology-safeguards"')
    && safeguardsHandlerContract.includes("window.history.pushState")
    && safeguardsHandlerContract.includes("routeHashTarget(target)"),
  "The first-look methodology route must create navigable history and route to the safeguards target.",
);
check(
  policyHeadingContract.includes("<h2") &&
    policyHeadingContract.includes("tabIndex={-1}") &&
    policyHeadingContract.includes("11 policy areas graded A–F, updated monthly.") &&
    anchorFocusContract.includes("focus({ preventScroll: true })") &&
    anchorFocusContract.includes('behavior: "auto"') &&
    sources.dashboard.includes('id="scorecard-dimension-grid"'),
  "The policy-grade jump must target a focusable level-two heading with auto scrolling while preserving the grid anchor.",
);
const firstLookForcedColorsContract = sourceAround(
  sources.css,
  "@media (forced-colors: active)",
  0,
  2000,
);
check(
  firstLookForcedColorsContract.includes(".app-shell .first-look-primary-wrap")
    && firstLookForcedColorsContract.includes(".app-shell .first-look-signal")
    && firstLookForcedColorsContract.includes("background: Canvas")
    && firstLookForcedColorsContract.includes(".app-shell .first-look-action:focus-visible")
    && firstLookForcedColorsContract.includes("outline: 2px solid Highlight"),
  "The first-look briefing must retain explicit forced-colors surfaces and keyboard focus treatment.",
);
const liveFirstLookFitContract = sourceAround(
  sources.liveAudit,
  "const requiredVisibleSelectors = [",
  1000,
  3000,
);
check(
  liveFirstLookFitContract.includes("const hasVisibleGeometry = (node) => {")
    && liveFirstLookFitContract.includes("node.getClientRects().length === 0")
    && liveFirstLookFitContract.includes(
      'getComputedStyle(node).visibility === "visible"',
    )
    && liveFirstLookFitContract.includes(".filter(hasVisibleGeometry)")
    && liveFirstLookFitContract.includes("return hasVisibleGeometry(node)")
    && liveFirstLookFitContract.includes(
      'a.first-look-action[href="#policy-grades-heading"]',
    )
    && liveFirstLookFitContract.includes(
      'a.first-look-action[href="#methodology-safeguards"]',
    )
    && liveFirstLookFitContract.includes("missingVisibleSelectors")
    && liveFirstLookFitContract.includes(
      "allRequiredVisible: missingVisibleSelectors.length === 0",
    ),
  "The live first-look audit must exclude ancestor-hidden alternates before geometry checks and track missing required controls.",
);
const liveFirstLookFailureContract = sourceAround(
  sources.liveAudit,
  "fit.allRequiredVisible",
  300,
  500,
);
check(
  /const\s+failures\s*=\s*\[[\s\S]*?fit\.allRequiredVisible[\s\S]*?\]\.filter\(Boolean\)/.test(
    liveFirstLookFailureContract,
  ),
  "The live first-look audit must wire allRequiredVisible into its reported failures.",
);
const livePrimaryNextCheckContract = sourceAround(
  sources.liveAudit,
  "const check = primaryNextCheck;",
  0,
  2600,
);
check(
  livePrimaryNextCheckContract.includes("if (!check.href)")
    && livePrimaryNextCheckContract.includes(
      'const briefing = page.getByRole("region", { name: "Scorecard briefing" })',
    )
    && livePrimaryNextCheckContract.includes(
      'const watch = briefing.locator(".first-look-watch")',
    )
    && livePrimaryNextCheckContract.includes("getByText(check.label, { exact: true })")
    && livePrimaryNextCheckContract.includes(
      'const matchingLinkCount = await briefing\n        .getByRole("link", { name: check.label, exact: true })',
    )
    && livePrimaryNextCheckContract.includes(
      'const link = briefing.getByRole("link", { name: check.label, exact: true })',
    )
    && livePrimaryNextCheckContract.includes("const linkCount = await link.count()")
    && livePrimaryNextCheckContract.includes("linkCount !== 1")
    && livePrimaryNextCheckContract.includes("check.href.replace"),
  "The live audit must inspect the one accessible briefing route, or accept route-less static watch text with no duplicate briefing link.",
);
check(
  sources.liveAuditWorkflow.includes("uses: actions/upload-artifact@v7")
    && !sources.liveAuditWorkflow.includes("uses: actions/upload-artifact@v4"),
  "The live audit workflow must keep the reviewed upload-artifact v7 pin.",
);
const expectedDeployShaExpression = "${{ inputs.target_commit || github.event.workflow_run.head_sha || github.sha }}";
const workflowDispatchContract = sourceAround(
  sources.liveAuditWorkflow,
  "  workflow_dispatch:",
  0,
  500,
);
check(
  hasActiveYamlLine(workflowDispatchContract, "workflow_dispatch:", 2)
    && hasActiveYamlLine(workflowDispatchContract, "inputs:", 4)
    && hasActiveYamlLine(workflowDispatchContract, "target_commit:", 6)
    && hasActiveYamlLine(workflowDispatchContract, "required: false", 8)
    && hasActiveYamlLine(workflowDispatchContract, "type: string", 8),
  "Manual live audits must expose an optional string target_commit input.",
);
const liveAuditJobContract = sourceAround(
  sources.liveAuditWorkflow,
  "  live-audit:",
  0,
  2600,
);
const checkoutStepContract = sourceAround(
  liveAuditJobContract,
  "- uses: actions/checkout@v6",
  0,
  350,
);
const auditStepContract = sourceAround(
  liveAuditJobContract,
  "- name: Audit live dashboard",
  0,
  500,
);
check(
  !/^concurrency:/m.test(sources.liveAuditWorkflow)
    && hasActiveYamlLine(liveAuditJobContract, "concurrency:", 4)
    && hasActiveYamlLine(
      liveAuditJobContract,
      `group: live-dashboard-audit-${expectedDeployShaExpression}`,
      6,
    )
    && !hasActiveYamlLine(liveAuditJobContract, "group: live-dashboard-audit", 6)
    && hasActiveYamlLine(liveAuditJobContract, "cancel-in-progress: true", 6),
  "The live audit workflow must cancel same-commit duplicates without allowing different commits to cancel each other.",
);
check(
  hasActiveYamlLine(checkoutStepContract, `ref: ${expectedDeployShaExpression}`, 10)
    && hasActiveYamlLine(
      auditStepContract,
      `EXPECTED_DEPLOY_SHA: ${expectedDeployShaExpression}`,
      10,
    ),
  "Automatic and manual live audits must use the common target SHA for checkout and EXPECTED_DEPLOY_SHA.",
);
check(
  hasActiveYamlLine(
    liveAuditJobContract,
    "if: github.event_name == 'workflow_dispatch' || github.event.workflow_run.conclusion == 'success'",
    4,
  ),
  "Automatic live audits must run only after a successful Pages workflow_run event.",
);
check(
  sources.deployWorkflow.includes("DEPLOYED_COMMIT_SHA: ${{ github.sha }}")
    && sources.deployWorkflow.includes("- run: npm run test:app-shell")
    && sources.deployWorkflow.includes(
      "node scripts/audit-live-dashboard-coverage.mjs --write-deployment-metadata dist",
    ),
  "The Pages build must use the tested deployment-metadata writer.",
);
check(
  parseExpectedDeployedSha(undefined) === null
    && parseExpectedDeployedSha("") === null
    && parseExpectedDeployedSha("a".repeat(40)) === "a".repeat(40),
  "The deployed-SHA parser must preserve direct audits while accepting exact lowercase commit SHAs.",
);
let malformedExpectedShaError = "";
try {
  parseExpectedDeployedSha("abc123");
} catch (error) {
  malformedExpectedShaError = error.message;
}
check(
  malformedExpectedShaError.includes("40-character lowercase Git commit SHA"),
  "The live audit must reject malformed expected commit SHAs.",
);
const expectedDeploymentSha = "1".repeat(40);
const otherDeploymentSha = "2".repeat(40);
const auditScriptPath = path.join(repoRoot, "scripts", "audit-live-dashboard-coverage.mjs");
const auditScriptUrl = pathToFileURL(auditScriptPath);
const cliFixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), "ccc-live-audit-cli-"));
try {
  const auditSymlinkPath = path.join(cliFixtureDir, "audit-live-symlink.mjs");
  fs.symlinkSync(auditScriptPath, auditSymlinkPath);
  check(
    isDirectCliInvocation(auditScriptUrl, auditSymlinkPath)
      && !isDirectCliInvocation(auditScriptUrl, fileURLToPath(import.meta.url)),
    "Direct CLI detection must resolve symlinks and reject an importing module.",
  );

  const directResult = spawnSync(
    process.execPath,
    [auditSymlinkPath, "--self-test-cli"],
    { cwd: repoRoot, encoding: "utf8" },
  );
  check(
    directResult.status === 0 && directResult.stdout.trim() === "DIRECT_CLI=1",
    "A symlinked CLI invocation must enter the audit command dispatcher.",
  );

  const importResult = spawnSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `await import(${JSON.stringify(auditScriptUrl.href)});`,
    ],
    { cwd: repoRoot, encoding: "utf8" },
  );
  check(
    importResult.status === 0 && importResult.stdout.trim() === "",
    "Importing the audit module must not start the CLI or emit a false success.",
  );
} finally {
  fs.rmSync(cliFixtureDir, { recursive: true, force: true });
}

const deploymentFixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), "ccc-deployment-marker-"));
let generatedDeploymentPayload;
try {
  fs.writeFileSync(
    path.join(deploymentFixtureDir, "index.html"),
    "<!doctype html><html><head><title>Fixture</title></head><body></body></html>\n",
    "utf8",
  );
  await writeDeploymentMetadata({
    commitSha: expectedDeploymentSha,
    distDir: deploymentFixtureDir,
  });
  generatedDeploymentPayload = JSON.parse(
    fs.readFileSync(path.join(deploymentFixtureDir, "deployment.json"), "utf8"),
  );
  const generatedIndex = fs.readFileSync(
    path.join(deploymentFixtureDir, "index.html"),
    "utf8",
  );
  check(
    generatedDeploymentPayload.commitSha === expectedDeploymentSha
      && generatedIndex.includes(
        `<meta name="deployed-commit-sha" content="${expectedDeploymentSha}" />`,
      ),
    "The deployment writer must stamp the same exact SHA into deployment.json and index.html.",
  );
} finally {
  fs.rmSync(deploymentFixtureDir, { recursive: true, force: true });
}

check(
  assertLoadedDocumentSha(null, null).checked === false
    && assertLoadedDocumentSha(expectedDeploymentSha, expectedDeploymentSha).checked,
  "Unbound audits must skip the document marker while bound audits accept an exact match.",
);
let missingDocumentShaError = "";
try {
  assertLoadedDocumentSha(expectedDeploymentSha, null);
} catch (error) {
  missingDocumentShaError = error.message;
}
let mismatchedDocumentShaError = "";
try {
  assertLoadedDocumentSha(expectedDeploymentSha, otherDeploymentSha);
} catch (error) {
  mismatchedDocumentShaError = error.message;
}
check(
  missingDocumentShaError.includes("loaded document has no deployed-commit-sha")
    && mismatchedDocumentShaError.includes(`loaded document exposes ${otherDeploymentSha}`),
  "A bound audit must reject missing and mismatched SHA markers from the loaded document.",
);

let directAuditFetchCalled = false;
const directDeploymentCheck = await verifyDeployedCommit({
  liveUrl: "https://example.test/dashboard/",
  expectedSha: null,
  fetchImpl: async () => {
    directAuditFetchCalled = true;
    throw new Error("Direct audits must not fetch deployment metadata.");
  },
});
check(
  directDeploymentCheck.checked === false && directAuditFetchCalled === false,
  "A local direct audit without EXPECTED_DEPLOY_SHA must skip deployment metadata.",
);
let requestedDeploymentUrl = "";
const matchingDeploymentCheck = await verifyDeployedCommit({
  liveUrl: "https://example.test/dashboard",
  expectedSha: expectedDeploymentSha,
  attempts: 1,
  nonceFactory: () => "matching-fixture",
  fetchImpl: async (url) => {
    requestedDeploymentUrl = url;
    return {
      ok: true,
      status: 200,
      json: async () => generatedDeploymentPayload,
    };
  },
});
check(
  matchingDeploymentCheck.checked
    && matchingDeploymentCheck.deployedSha === expectedDeploymentSha
    && requestedDeploymentUrl === deploymentMetadataUrl(
      "https://example.test/dashboard",
      expectedDeploymentSha,
      "matching-fixture",
    )
    && requestedDeploymentUrl.includes(
      "/dashboard/deployment.json?expectedSha=1111111111111111111111111111111111111111&cacheBust=matching-fixture",
    )
    && deploymentMetadataUrl(
      "https://example.test/dashboard/index.html",
      expectedDeploymentSha,
      "file-url-fixture",
    ).includes("/dashboard/deployment.json?"),
  "The live audit must read cache-busted deployment metadata beneath the production base path.",
);
let retryFetchCount = 0;
const retryDelays = [];
const retriedDeploymentCheck = await verifyDeployedCommit({
  liveUrl: "https://example.test/dashboard/",
  expectedSha: expectedDeploymentSha,
  attempts: 2,
  nonceFactory: (attempt) => `retry-${attempt}`,
  retryDelayMs: 7,
  sleepImpl: async (delayMs) => {
    retryDelays.push(delayMs);
  },
  fetchImpl: async () => {
    retryFetchCount += 1;
    if (retryFetchCount === 1) return { ok: false, status: 404 };
    return {
      ok: true,
      status: 200,
      json: async () => ({ commitSha: expectedDeploymentSha }),
    };
  },
});
check(
  retriedDeploymentCheck.checked
    && retryFetchCount === 2
    && JSON.stringify(retryDelays) === JSON.stringify([7]),
  "The deployment metadata preflight must retry a propagation miss before failing.",
);
let mismatchedDeploymentError = "";
try {
  await verifyDeployedCommit({
    liveUrl: "https://example.test/dashboard/",
    expectedSha: expectedDeploymentSha,
    attempts: 1,
    fetchImpl: async () => ({
      ok: true,
      status: 200,
      json: async () => ({ commitSha: otherDeploymentSha }),
    }),
  });
} catch (error) {
  mismatchedDeploymentError = error.message;
}
check(
  mismatchedDeploymentError.includes(`expected ${expectedDeploymentSha}`)
    && mismatchedDeploymentError.includes(`production exposes ${otherDeploymentSha}`),
  "The live audit must fail when production exposes a different deployed commit SHA.",
);
let missingDeploymentMetadataError = "";
let missingDeploymentFetchCount = 0;
const missingDeploymentRetryDelays = [];
try {
  await verifyDeployedCommit({
    liveUrl: "https://example.test/dashboard/",
    expectedSha: expectedDeploymentSha,
    attempts: 3,
    retryDelayMs: 5,
    sleepImpl: async (delayMs) => {
      missingDeploymentRetryDelays.push(delayMs);
    },
    fetchImpl: async () => {
      missingDeploymentFetchCount += 1;
      return { ok: false, status: 404 };
    },
  });
} catch (error) {
  missingDeploymentMetadataError = error.message;
}
check(
  missingDeploymentMetadataError.includes(
    "Production deployment marker is missing: deployment.json returned HTTP 404",
  )
    && missingDeploymentMetadataError.includes("/dashboard/deployment.json?")
    && missingDeploymentFetchCount === 3
    && JSON.stringify(missingDeploymentRetryDelays) === JSON.stringify([5, 10]),
  "A missing deployment marker must report HTTP 404 directly after exhausting propagation retries.",
);
const deploymentErrorArtifactContract = sourceAround(
  sources.liveAudit,
  "deploymentCheck = await verifyDeployedCommit",
  0,
  900,
);
const browserLifecycleWrites = [];
let browserLifecycleAuditCalled = false;
let browserLifecycleCloseCalled = false;
let browserLaunchError = "";
try {
  await runBrowserAuditLifecycle({
    outDir: "/tmp/live-audit-fixture",
    launchBrowser: async () => {
      throw new Error("browser launch fixture failed");
    },
    auditBrowser: async () => {
      browserLifecycleAuditCalled = true;
    },
    closeBrowser: async () => {
      browserLifecycleCloseCalled = true;
    },
    writeFileImpl: async (...args) => {
      browserLifecycleWrites.push(args);
    },
  });
} catch (error) {
  browserLaunchError = error.message;
}
check(
  browserLaunchError === "browser launch fixture failed"
    && !browserLifecycleAuditCalled
    && !browserLifecycleCloseCalled
    && browserLifecycleWrites.length === 1
    && browserLifecycleWrites[0][0] === path.join(
      "/tmp/live-audit-fixture",
      browserAuditErrorFilename,
    )
    && browserLifecycleWrites[0][1] === "browser launch fixture failed\n"
    && browserLifecycleWrites[0][2] === "utf8",
  "A browser launch failure must write the browser audit error artifact before rethrowing.",
);

async function runBrowserLifecycleFailureFixture({
  auditError,
  closeError,
  artifactWriteError,
}) {
  const browser = { fixture: true };
  const writes = [];
  const secondaryErrors = [];
  let closeCalls = 0;
  let thrownError;
  try {
    await runBrowserAuditLifecycle({
      outDir: "/tmp/live-audit-fixture",
      launchBrowser: async () => browser,
      auditBrowser: async (receivedBrowser) => {
        if (receivedBrowser !== browser) throw new Error("wrong browser fixture");
        if (auditError) throw auditError;
      },
      closeBrowser: async (receivedBrowser) => {
        closeCalls += 1;
        if (receivedBrowser !== browser) throw new Error("wrong close fixture");
        if (closeError) throw closeError;
      },
      writeFileImpl: async (...args) => {
        writes.push(args);
        if (artifactWriteError) throw artifactWriteError;
      },
      reportSecondaryError: async (error) => {
        secondaryErrors.push(error);
      },
    });
  } catch (error) {
    thrownError = error;
  }
  return { closeCalls, secondaryErrors, thrownError, writes };
}

const auditFailure = new Error("browser audit fixture failed");
const auditFailureResult = await runBrowserLifecycleFailureFixture({
  auditError: auditFailure,
});
check(
  auditFailureResult.thrownError === auditFailure
    && auditFailureResult.closeCalls === 1
    && auditFailureResult.writes.length === 1
    && auditFailureResult.writes[0][1] === "browser audit fixture failed\n"
    && auditFailureResult.secondaryErrors.length === 0,
  "A browser audit failure must close the browser, write its artifact, and remain the primary error.",
);

const closeFailure = new Error("browser close fixture failed");
const closeFailureResult = await runBrowserLifecycleFailureFixture({
  closeError: closeFailure,
});
check(
  closeFailureResult.thrownError === closeFailure
    && closeFailureResult.closeCalls === 1
    && closeFailureResult.writes.length === 1
    && closeFailureResult.writes[0][1] === "browser close fixture failed\n",
  "A browser close failure must write its artifact and remain the primary error.",
);

const combinedAuditFailure = new Error("combined audit fixture failed");
const combinedCloseFailure = new Error("combined close fixture failed");
const combinedFailureResult = await runBrowserLifecycleFailureFixture({
  auditError: combinedAuditFailure,
  closeError: combinedCloseFailure,
});
check(
  combinedFailureResult.thrownError === combinedAuditFailure
    && combinedFailureResult.closeCalls === 1
    && combinedFailureResult.writes.length === 1
    && combinedFailureResult.writes[0][1]
      === "combined audit fixture failed\ncombined close fixture failed\n",
  "Combined audit and close failures must keep the audit error primary and record both messages.",
);

const artifactRootFailure = new Error("artifact write fixture failed");
const preservedAuditFailure = new Error("preserved audit fixture failed");
const artifactFailureResult = await runBrowserLifecycleFailureFixture({
  auditError: preservedAuditFailure,
  artifactWriteError: artifactRootFailure,
});
check(
  artifactFailureResult.thrownError === preservedAuditFailure
    && artifactFailureResult.closeCalls === 1
    && artifactFailureResult.writes.length === 1
    && artifactFailureResult.secondaryErrors.length === 1
    && artifactFailureResult.secondaryErrors[0] === artifactRootFailure,
  "An artifact-write failure must be reported secondarily without masking the browser failure.",
);
const browserErrorArtifactContract = sourceAround(
  sources.liveAudit,
  "export async function runBrowserAuditLifecycle",
  0,
  1800,
);
const browserLifecycleInvocationContract = sourceAround(
  sources.liveAudit,
  "await runBrowserAuditLifecycle({",
  0,
  7000,
);
check(
  deploymentIntegrityErrorFilename === "deployment-integrity-error.txt"
    && browserAuditErrorFilename === "browser-audit-error.txt"
    && deploymentIntegrityErrorFilename !== browserAuditErrorFilename
    && deploymentErrorArtifactContract.includes("deploymentIntegrityErrorFilename")
    && !deploymentErrorArtifactContract.includes("browserAuditErrorFilename")
    && browserErrorArtifactContract.includes("browserAuditErrorFilename")
    && !browserErrorArtifactContract.includes("deploymentIntegrityErrorFilename")
    && browserLifecycleInvocationContract.includes(
      "launchBrowser: () => chromium.launch()",
    )
    && browserLifecycleInvocationContract.includes("auditBrowser: async (browser)"),
  "Deployment preflight and browser/runtime failures must write distinct, accurately named artifacts.",
);
const malformedMetadataCases = [
  {
    label: "invalid JSON",
    response: {
      ok: true,
      status: 200,
      json: async () => {
        throw new SyntaxError("fixture JSON failure");
      },
    },
    expectedMessage: "not valid JSON",
  },
  {
    label: "missing commitSha",
    response: { ok: true, status: 200, json: async () => ({}) },
    expectedMessage: "no valid commitSha",
  },
  {
    label: "uppercase commitSha",
    response: {
      ok: true,
      status: 200,
      json: async () => ({ commitSha: "A".repeat(40) }),
    },
    expectedMessage: "no valid commitSha",
  },
];
for (const fixture of malformedMetadataCases) {
  let message = "";
  try {
    await verifyDeployedCommit({
      liveUrl: "https://example.test/dashboard/",
      expectedSha: expectedDeploymentSha,
      attempts: 1,
      fetchImpl: async () => fixture.response,
    });
  } catch (error) {
    message = error.message;
  }
  check(
    message.includes(fixture.expectedMessage),
    `The deployment metadata preflight must reject ${fixture.label}.`,
  );
}
check(
  fixedNavigationSafetyGap === 8
    && !isFixedNavigationObstruction(
      { top: 400, bottom: 412, left: 20, right: 100 },
      { top: 420, bottom: 500, left: 0, right: 320 },
    )
    && isFixedNavigationObstruction(
      { top: 400, bottom: 413, left: 20, right: 100 },
      { top: 420, bottom: 500, left: 0, right: 320 },
    )
    && !isFixedNavigationObstruction(
      { top: 400, bottom: 430, left: 321, right: 400 },
      { top: 420, bottom: 500, left: 0, right: 320 },
    ),
  "The live obstruction predicate must enforce the 8px safety zone only where controls cross the fixed navigation.",
);
check(
  [
    '{ name: "mobile-320", width: 320, height: 568 }',
    '{ name: "mobile-421", width: 421, height: 812 }',
    '{ name: "mobile-640", width: 640, height: 812 }',
  ].every((contract) => sources.liveAudit.includes(contract))
    && sources.liveAudit.includes(".app-bottom-nav")
    && sources.liveAudit.includes("auditFirstLookFixedNavigation(page, ctx)")
    && sources.liveAudit.includes('node.scrollIntoView({ behavior: "auto", block: "center"')
    && sources.liveAudit.includes("totalControlCount")
    && sources.liveAudit.includes("unreachableControls")
    && sources.liveAudit.includes('reducedMotion: "reduce"'),
  "The live audit must find and scroll-check first-look controls above fixed navigation at 320x568, 421x812, and 640x812.",
);
check(
  sources.liveAudit.includes('meta[name="deployed-commit-sha"]')
    && sources.liveAudit.includes("assertLoadedDocumentSha")
    && sources.liveAudit.includes("await assertPageDocumentSha(page)")
    && sources.liveAudit.includes('url.searchParams.set("liveAuditRun"'),
  "Every bound browser navigation must be cache-busted and verify the loaded document SHA marker.",
);
const reloadDocumentShaContract = sourceAround(
  sources.liveAudit,
  'await page.reload({ waitUntil: "domcontentloaded" })',
  0,
  240,
);
check(
  reloadDocumentShaContract.includes("await assertPageDocumentSha(page)"),
  "A bound audit must recheck the loaded document SHA after an in-audit page reload.",
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
