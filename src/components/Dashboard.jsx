import { Suspense, lazy, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import dimensionsSummary from "../data/dimensions-summary.json";
import meta from "../data/meta.json";
import changelogSummary from "../data/changelog-summary.json";
import {
  gpaToGrade,
  calculateOverallGPA,
  calculatePocketbookGPA,
  getOverallDerivation,
  getPocketbookDerivation,
} from "../utils";
import {
  getLoadedDimensions,
  loadDimensions,
  retryDimensionsLoad,
} from "../dimensionData";
import ScoreboardHeader from "./ScoreboardHeader";
import DimensionCard from "./DimensionCard";
import EmailSignup from "./EmailSignup";
import VisitorCount from "./VisitorCount";
import DashboardStatus from "./DashboardStatus";
import SinceLastVisit from "./SinceLastVisit";
import FollowUpdates from "./FollowUpdates";
import RouteErrorBoundary from "./RouteErrorBoundary";
import { getCurrentGradeMoves, getCurrentGradeMovesByDimension } from "../gradeMoves";
import "./AppShell.css";

// Route-level code splitting: these views are not needed for first paint of
// the scorecard, so each loads on demand as its own chunk. Chunks are
// same-origin and small. The Changes wrapper owns the full changelog import,
// so that large history stays off the scorecard's initial request path.
const WhatsChangedRoute = lazy(() => import("./WhatsChangedRoute"));
const PromiseTrackerRoute = lazy(() => import("./PromiseTrackerRoute"));
const Methodology = lazy(() => import("./Methodology"));
const About = lazy(() => import("./About"));

const dimensions = dimensionsSummary.dimensions;

function isMobileViewport() {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
}

function getDimensionIdForHashTarget(target) {
  if (!target) return null;
  const match = dimensions.find((dim) => (
    target === `dim-${dim.id}` || target.startsWith(`dim-${dim.id}-`)
  ));
  return match?.id || null;
}

function focusAndScrollToAnchor(target) {
  const destination = document.getElementById(target);
  if (!destination) return;
  destination.focus({ preventScroll: true });
  destination.scrollIntoView({
    behavior: "auto",
    block: "start",
  });
}

function dashboardSectionIcon(section) {
  const paths = {
    scorecard: (
      <>
        <rect x="3" y="3" width="6" height="6" rx="1" />
        <rect x="15" y="3" width="6" height="6" rx="1" />
        <rect x="3" y="15" width="6" height="6" rx="1" />
        <rect x="15" y="15" width="6" height="6" rx="1" />
      </>
    ),
    promises: (
      <>
        <path d="m4 6 2 2 3-4" />
        <path d="M12 6h8" />
        <path d="m4 14 2 2 3-4" />
        <path d="M12 14h8" />
        <path d="M4 21h16" />
      </>
    ),
    changelog: (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <path d="M3 3v5h5" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    methodology: (
      <>
        <path d="M5 3h14v18H5z" />
        <path d="M8 7h8" />
        <path d="M8 11h8" />
        <path d="M8 15h5" />
      </>
    ),
    about: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v6" />
        <path d="M12 7h.01" />
      </>
    ),
  };

  return (
    <svg
      className="app-bottom-nav-icon"
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[section]}
    </svg>
  );
}

export default function Dashboard() {
  const appMode = true;
  const [expanded, setExpanded] = useState(null);
  const [fullDimensions, setFullDimensions] = useState(() => getLoadedDimensions());
  const [detailLoadStatus, setDetailLoadStatus] = useState(() => (
    getLoadedDimensions() ? "ready" : "idle"
  ));
  const [view, setView] = useState("scorecard");
  // Pre-applied dimension filter for the Promises view. Set when the user
  // routes in from a dimension's promises ("Open the Promises tab"); reset to
  // "All" for the Promises nav tab and hash/back-forward navigation.
  const [promiseDimensionFilter, setPromiseDimensionFilter] = useState("All");
  const [approvalExpanded, setApprovalExpanded] = useState(false);
  // Which headline-score derivation panel is open: "household", "overall", or null.
  const [derivationOpen, setDerivationOpen] = useState(null);
  const [anchorNavigation, setAnchorNavigation] = useState(null);
  const [lazyViewReadyVersion, setLazyViewReadyVersion] = useState(0);
  const [isMobile, setIsMobile] = useState(() => isMobileViewport());
  // Theme: tri-state, one of "light" | "dark" | "system". The no-flash script
  // in index.html sets the initial data-theme on <html> before React mounts;
  // here we resolve state from the same VALIDATED saved choice, defaulting to
  // "system" (follow the OS) when nothing valid is saved.
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "system";
    try {
      const saved = window.localStorage.getItem("ccc-theme");
      if (saved === "light" || saved === "dark" || saved === "system") return saved;
    } catch { /* storage blocked */ }
    return "system";
  });
  // Keep <html data-theme> in lockstep with state via an effect (idempotent, so
  // the attribute and state can never drift). In "system" mode the attribute
  // mirrors the live OS preference through a matchMedia listener (removed on
  // cleanup). Persist to localStorage ONLY when the change came from an
  // explicit user toggle (tracked by a ref set in toggleTheme), never on mount
  // — so a default is not locked in before the user chooses. Gating on the
  // user-toggle ref (rather than "after first effect run") stays correct under
  // StrictMode's development double-invocation of effects.
  const userToggledThemeRef = useRef(false);
  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    if (userToggledThemeRef.current) {
      try { window.localStorage.setItem("ccc-theme", theme); } catch { /* storage blocked */ }
    }
    if (theme !== "system") {
      document.documentElement.setAttribute("data-theme", theme);
      return undefined;
    }
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      document.documentElement.setAttribute("data-theme", "light");
      return undefined;
    }
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applySystemTheme = () => {
      document.documentElement.setAttribute("data-theme", media.matches ? "dark" : "light");
    };
    applySystemTheme();
    // Older Safari exposes addListener/removeListener only.
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", applySystemTheme);
      return () => media.removeEventListener("change", applySystemTheme);
    }
    media.addListener(applySystemTheme);
    return () => media.removeListener(applySystemTheme);
  }, [theme]);
  // Cycle order: light -> dark -> system -> light.
  const nextTheme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
  const toggleTheme = useCallback(() => {
    userToggledThemeRef.current = true;
    setTheme((current) => (current === "light" ? "dark" : current === "dark" ? "system" : "light"));
  }, []);
  const anchorRequestIdRef = useRef(0);
  const anchorTargetRef = useRef(null);
  const expandedRef = useRef(null);
  // Ownership flag for the drawer's #dim-<id> history entry. Named for its
  // mobile-only origin (the app-shell contract pins the identifier) but since
  // v5.155 click-opens on BOTH viewports own an entry, so browser/OS Back
  // closes the drawer everywhere.
  const mobileModalEntryRef = useRef(
    typeof window !== "undefined" && !!window.history.state?.dimModal,
  );
  // One-shot: a Back/Forward traversal that closes an owned drawer fires BOTH
  // popstate and hashchange. The popstate handler does the close; this flag
  // tells the hashchange handler to skip re-routing that same traversal.
  const suppressHashRouteRef = useRef(false);
  // Guards the owned-close history.back() against double activation (e.g.
  // Escape plus a close-button click before the traversal lands), which
  // would otherwise rewind two entries.
  const drawerExitInFlightRef = useRef(false);
  const pendingViewAfterDrawerExitRef = useRef(null);
  const pendingViewFocusRef = useRef(null);
  const desktopReturnScrollRef = useRef(null);
  const pendingDesktopReturnRef = useRef(null);
  const pendingDesktopFocusRef = useRef(null);
  const scoredDimensions = dimensions.filter((d) => !d.excludeFromGPA);
  const trackerDimensions = dimensions.filter((d) => d.excludeFromGPA);
  const fullDimensionById = new Map((fullDimensions || []).map((d) => [d.id, d]));
  const expandedDimension = (fullDimensions || dimensions).find((d) => d.id === expanded) || null;
  const isDesktopFocusedDetail = view === "scorecard" && !!expandedDimension && !isMobile;

  // Calculate grades and promises from the data
  const overallGPA = calculateOverallGPA(dimensions).toFixed(1);
  const pocketbookGPA = calculatePocketbookGPA(dimensions).toFixed(1);
  const overallDerivation = getOverallDerivation(dimensions);
  const pocketbookDerivation = getPocketbookDerivation(dimensions);
  const promiseCounts = dimensionsSummary.promiseCounts;
  const totalPromises = dimensionsSummary.totalPromises;
  const currentGradeMoves = getCurrentGradeMoves(changelogSummary, dimensions, meta);
  const currentGradeMovesByDimension = getCurrentGradeMovesByDimension(
    changelogSummary,
    dimensions,
    meta,
  );

  useEffect(() => {
    expandedRef.current = expanded;
  }, [expanded]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const pushModalHistoryEntry = useCallback((dimensionId) => {
    if (typeof window === "undefined") return;

    const nextUrl = `#dim-${dimensionId}`;
    const nextState = { ...(window.history.state || {}), dimModal: dimensionId };

    // Click-opens on either viewport create exactly one owned history entry
    // whose URL is the card's deep link, so Back closes the drawer and the
    // address bar names what is on screen. If an entry is already owned
    // (card-to-card switch, or StrictMode double-invoking the updater),
    // retarget it instead of stacking a second entry. Deep-link arrivals
    // (fromHash) never reach this helper.
    if (mobileModalEntryRef.current) {
      window.history.replaceState(nextState, "", nextUrl);
      return;
    }

    window.history.pushState(nextState, "", nextUrl);
    mobileModalEntryRef.current = true;
  }, []);

  const openDimension = useCallback((dimensionId, options = {}) => {
    if (
      typeof window !== "undefined"
      && !isMobileViewport()
      && expandedRef.current !== dimensionId
    ) {
      desktopReturnScrollRef.current = options.fromHash ? null : window.scrollY;
    }

    setExpanded((current) => {
      if (current === dimensionId) return current;
      if (!options.fromHash) pushModalHistoryEntry(dimensionId);
      return dimensionId;
    });
  }, [pushModalHistoryEntry]);

  const closeDimension = useCallback((dimensionId) => {
    const ownsModalEntry = mobileModalEntryRef.current;

    if (typeof window !== "undefined" && ownsModalEntry) {
      // The drawer owns a #dim-<id> entry, so leave through history: the URL
      // rewinds to whatever preceded the open. The popstate handler performs
      // the actual close (shared with the browser-Back gesture) and, on
      // desktop, queues the scroll restore and header re-focus.
      if (!drawerExitInFlightRef.current) {
        drawerExitInFlightRef.current = true;
        window.history.back();
      }
      return;
    }

    // No owned entry: the drawer arrived by deep link, so there is no prior
    // in-app entry to rewind to and history.back() would leave the site.
    // Close in place and point the URL at the scorecard instead, so it no
    // longer names a closed drawer.
    if (typeof window !== "undefined") {
      if (!isMobileViewport()) {
        pendingDesktopReturnRef.current = desktopReturnScrollRef.current ?? "grid";
        pendingDesktopFocusRef.current = dimensionId;
      }
      const nextState = { ...(window.history.state || {}) };
      delete nextState.dimModal;
      window.history.replaceState(nextState, "", "#view-scorecard");
    }

    mobileModalEntryRef.current = false;
    setExpanded(null);
  }, []);

  const closeDimensionForInternalNavigation = useCallback((options = {}) => {
    const closeDesktop = !!options.closeDesktop;

    if (typeof window === "undefined") {
      if (closeDesktop) setExpanded(null);
      return;
    }

    const isMobile = isMobileViewport();
    if (!isMobile && !closeDesktop) return;
    if (!isMobile) pendingDesktopReturnRef.current = null;

    if (mobileModalEntryRef.current) {
      // Owned drawer entry: rewind so the URL retreats with the drawer.
      // The popstate handler completes the close.
      if (!drawerExitInFlightRef.current) {
        drawerExitInFlightRef.current = true;
        window.history.back();
      }
      return;
    }

    if (window.history.state?.dimModal) {
      const nextState = { ...(window.history.state || {}) };
      delete nextState.dimModal;
      window.history.replaceState(nextState, "", window.location.href);
    }

    mobileModalEntryRef.current = false;
    setExpanded(null);
  }, []);

  const toggleDimension = useCallback((dimensionId) => {
    if (expandedRef.current === dimensionId) {
      closeDimension(dimensionId);
      return;
    }
    openDimension(dimensionId);
  }, [closeDimension, openDimension]);

  const requestAnchorNavigation = useCallback((target) => {
    if (!target) return;
    anchorTargetRef.current = target;
    anchorRequestIdRef.current += 1;
    setAnchorNavigation({ target, requestId: anchorRequestIdRef.current });
  }, []);

  useEffect(() => {
    if (!expanded || fullDimensions) return undefined;

    let cancelled = false;
    setDetailLoadStatus("loading");
    loadDimensions().then(
      (loadedDimensions) => {
        if (cancelled) return;
        setFullDimensions(loadedDimensions);
        setDetailLoadStatus("ready");

        const target = anchorTargetRef.current;
        if (getDimensionIdForHashTarget(target) === expandedRef.current) {
          requestAnchorNavigation(target);
        }
      },
      () => {
        if (!cancelled) setDetailLoadStatus("error");
      },
    );

    return () => {
      cancelled = true;
    };
  }, [expanded, fullDimensions, requestAnchorNavigation]);

  const retryDimensionDetails = useCallback(() => {
    setDetailLoadStatus("loading");
    retryDimensionsLoad().then(
      (loadedDimensions) => {
        setFullDimensions(loadedDimensions);
        setDetailLoadStatus("ready");

        const target = anchorTargetRef.current;
        if (getDimensionIdForHashTarget(target) === expandedRef.current) {
          requestAnchorNavigation(target);
        }
      },
      () => setDetailLoadStatus("error"),
    );
  }, [requestAnchorNavigation]);

  const routeDimensionToView = useCallback((target, dimension) => {
    if (!target) return;
    if (target === "promises") setPromiseDimensionFilter(dimension || "All");

    const destination = `view-${target}`;
    pendingDesktopReturnRef.current = null;
    pendingDesktopFocusRef.current = null;
    pendingViewFocusRef.current = destination;

    if (typeof window !== "undefined") {
      const owned = mobileModalEntryRef.current || window.history.state?.dimModal;
      const nextState = { ...(window.history.state || {}) };
      delete nextState.dimModal;

      if (owned) {
        window.history.replaceState(nextState, "", `#${destination}`);
      } else {
        window.history.pushState(nextState, "", `#${destination}`);
      }
    }

    mobileModalEntryRef.current = false;
    setExpanded(null);
    setView(target);
    requestAnchorNavigation(destination);
  }, [requestAnchorNavigation]);

  const leaveDrawerForHashDestination = useCallback((options = {}) => {
    if (typeof window !== "undefined" && window.history.state?.dimModal) {
      const nextState = { ...(window.history.state || {}) };
      delete nextState.dimModal;
      window.history.replaceState(nextState, "", window.location.href);
    }

    mobileModalEntryRef.current = false;
    if (!options.preserveDesktopReturn) {
      pendingDesktopReturnRef.current = null;
      pendingDesktopFocusRef.current = null;
    }
    setExpanded(null);
  }, []);

  const routeHashTarget = useCallback((target, options = {}) => {
    if (!target) return;
    requestAnchorNavigation(target);

    const dimensionId = getDimensionIdForHashTarget(target);
    if (dimensionId) {
      setView("scorecard");
      openDimension(dimensionId, { fromHash: true });
      return;
    }

    if (target.startsWith("change-")) {
      if (typeof window !== "undefined" && window.history.state?.dimModal) {
        const nextState = { ...(window.history.state || {}) };
        delete nextState.dimModal;
        window.history.replaceState(nextState, "", `#${target}`);
      }
      leaveDrawerForHashDestination();
      setView("changelog");
      return;
    }

    if (target === "methodology-safeguards") {
      leaveDrawerForHashDestination();
      setView("methodology");
      return;
    }

    if (target.startsWith("view-")) {
      const nextHashView = target.replace(/^view-/, "");
      leaveDrawerForHashDestination({
        preserveDesktopReturn: !!options.preserveDesktopReturn,
      });
      if (nextHashView === "promises") setPromiseDimensionFilter("All");
      setView(nextHashView);
      return;
    }

    closeDimensionForInternalNavigation();
  }, [
    closeDimensionForInternalNavigation,
    leaveDrawerForHashDestination,
    openDimension,
    requestAnchorNavigation,
  ]);

  const handleHashTargetNavigation = useCallback((target) => {
    if (!target) return;
    if (target.startsWith("change-")) {
      routeHashTarget(target);
      return;
    }
    if (typeof window !== "undefined") {
      window.history.replaceState(window.history.state, "", `#${target}`);
    }
    routeHashTarget(target);
  }, [routeHashTarget]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handlePopState = (event) => {
      // Every traversal starts here, so clear any one-shot flags a previous
      // traversal (or an owned close whose URL happened not to change) left.
      drawerExitInFlightRef.current = false;
      suppressHashRouteRef.current = false;

      const state = event.state || {};
      const hadOwnedEntry = mobileModalEntryRef.current;
      const destinationTarget = window.location.hash.replace(/^#/, "");
      // Landing ON an entry that carries a drawer (Forward into it) re-owns
      // it, so a later close rewinds instead of piling replaceStates.
      mobileModalEntryRef.current = !!state.dimModal;

      if (hadOwnedEntry && expandedRef.current && !state.dimModal) {
        // Backing out of an owned drawer entry: browser Back, edge swipe,
        // or the close control's history.back(). Close on both viewports;
        // desktop additionally restores scroll and re-focuses the origin
        // card via the same pending refs the close-button path used before.
        const returnsToScorecard = !destinationTarget || destinationTarget === "view-scorecard";
        if (!isMobileViewport() && returnsToScorecard) {
          pendingDesktopReturnRef.current = desktopReturnScrollRef.current ?? "grid";
          pendingDesktopFocusRef.current = expandedRef.current;
        } else {
          pendingDesktopReturnRef.current = null;
          pendingDesktopFocusRef.current = null;
        }
        // The same traversal fires hashchange (#dim-<id> vs the prior URL).
        // Apply the destination here, while drawer ownership is still known,
        // then skip the duplicate hashchange for this traversal.
        suppressHashRouteRef.current = true;

        const queuedView = pendingViewAfterDrawerExitRef.current;
        pendingViewAfterDrawerExitRef.current = null;
        if (queuedView) {
          const nextState = { ...(window.history.state || {}) };
          delete nextState.dimModal;
          window.history.pushState(nextState, "", `#view-${queuedView}`);
          if (queuedView === "promises") setPromiseDimensionFilter("All");
          pendingDesktopReturnRef.current = null;
          pendingDesktopFocusRef.current = null;
          pendingViewFocusRef.current = `view-${queuedView}`;
          setView(queuedView);
          requestAnchorNavigation(`view-${queuedView}`);
        } else if (destinationTarget) {
          routeHashTarget(destinationTarget, { preserveDesktopReturn: returnsToScorecard });
        } else {
          setExpanded(null);
          setView("scorecard");
          requestAnchorNavigation("main-content");
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [requestAnchorNavigation, routeHashTarget]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleHashChange = () => {
      if (suppressHashRouteRef.current) {
        suppressHashRouteRef.current = false;
        return;
      }
      const target = window.location.hash.replace(/^#/, "");
      if (target) {
        routeHashTarget(target);
      } else {
        closeDimensionForInternalNavigation({ closeDesktop: true });
        setView("scorecard");
        requestAnchorNavigation("main-content");
      }
    };

    const initialTarget = window.location.hash.replace(/^#/, "");
    if (initialTarget) routeHashTarget(initialTarget);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [closeDimensionForInternalNavigation, requestAnchorNavigation, routeHashTarget]);

  useEffect(() => {
    const target = anchorNavigation?.target;
    if (!target || getDimensionIdForHashTarget(target)) return undefined;
    if (typeof window === "undefined") return undefined;
    if (expanded && isMobileViewport()) return undefined;

    let frameA = null;
    let frameB = null;

    frameA = window.requestAnimationFrame(() => {
      frameB = window.requestAnimationFrame(() => {
        focusAndScrollToAnchor(target);
      });
    });

    return () => {
      if (frameA) window.cancelAnimationFrame(frameA);
      if (frameB) window.cancelAnimationFrame(frameB);
    };
  }, [anchorNavigation, expanded, lazyViewReadyVersion, view]);

  const handleLazyViewReady = useCallback(() => {
    setLazyViewReadyVersion((current) => current + 1);
    if (typeof window === "undefined") return;
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        focusAndScrollToAnchor(anchorTargetRef.current);
      });
    });
  }, []);

  const scheduleMobileScroll = (targetId) => {
    if (typeof window === "undefined") return undefined;
    if (!window.matchMedia("(max-width: 760px)").matches) return undefined;

    let frameA = null;
    let frameB = null;

    frameA = window.requestAnimationFrame(() => {
      frameB = window.requestAnimationFrame(() => {
        document.getElementById(targetId)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });

    return () => {
      if (frameA) window.cancelAnimationFrame(frameA);
      if (frameB) window.cancelAnimationFrame(frameB);
    };
  };

  // Track whether each panel was open last render so we can distinguish
  // open-events (scroll the panel into view) from close-events (scroll
  // back to the scoreboard so the reader doesn't have to manually
  // backtrack on mobile).
  const [lastDerivationOpen, setLastDerivationOpen] = useState(null);
  const [lastApprovalOpen, setLastApprovalOpen] = useState(false);

  useEffect(() => {
    let cleanup;
    if (derivationOpen) {
      cleanup = scheduleMobileScroll(`score-derivation-${derivationOpen}`);
    } else if (lastDerivationOpen) {
      cleanup = scheduleMobileScroll("scoreboard-row");
    }
    setLastDerivationOpen(derivationOpen);
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [derivationOpen]);

  useEffect(() => {
    let cleanup;
    if (approvalExpanded) {
      cleanup = scheduleMobileScroll("approval-signal-detail");
    } else if (lastApprovalOpen) {
      cleanup = scheduleMobileScroll("scoreboard-row");
    }
    setLastApprovalOpen(approvalExpanded);
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approvalExpanded]);

  // P2c: Lock body scroll on mobile when a drawer is open so the background
  // page does not scroll behind the fixed full-screen drawer.
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    document.body.style.overflow = isMobile && expanded !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [expanded, isMobile]);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (expanded !== null || view !== "scorecard" || isMobile) return undefined;
    const target = pendingDesktopReturnRef.current;
    if (target === null) return undefined;

    pendingDesktopReturnRef.current = null;
    if (target === "grid") {
      document.getElementById("scorecard-dimension-grid")?.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
    } else {
      window.scrollTo({ top: target, behavior: "auto" });
    }

    const dimensionId = pendingDesktopFocusRef.current;
    pendingDesktopFocusRef.current = null;
    const focusHeader = () => {
      document.getElementById(`dim-${dimensionId}-header`)?.focus({ preventScroll: true });
    };
    focusHeader();
    // A Back/Forward-driven close applies this focus during the traversal's
    // own task; Chromium then runs its same-document-navigation focus fixup
    // (~1ms later) and resets focus to <body>. Re-apply on a double rAF,
    // which lands after that fixup. Re-focusing an element that already
    // holds focus is a no-op, so the non-traversal close path is unaffected.
    let frameA = null;
    let frameB = null;
    frameA = window.requestAnimationFrame(() => {
      frameB = window.requestAnimationFrame(focusHeader);
    });
    return () => {
      if (frameA) window.cancelAnimationFrame(frameA);
      if (frameB) window.cancelAnimationFrame(frameB);
    };
  }, [expanded, isMobile, view]);

  useLayoutEffect(() => {
    if (typeof window === "undefined" || expanded !== null) return undefined;
    const target = pendingViewFocusRef.current;
    if (!target || target !== `view-${view}`) return undefined;

    const destination = document.getElementById(target);
    if (!destination) return undefined;
    pendingViewFocusRef.current = null;
    destination.focus({ preventScroll: true });
    return undefined;
  }, [expanded, view]);

  const handleToggleDerivation = (variant) => {
    setDerivationOpen((curr) => (curr === variant ? null : variant));
  };

  const handleToggleApproval = () => {
    setApprovalExpanded((curr) => !curr);
  };

  const handleShowSafeguards = () => {
    const target = "methodology-safeguards";
    if (typeof window !== "undefined") {
      const ownedModal = mobileModalEntryRef.current || window.history.state?.dimModal;
      const nextState = { ...(window.history.state || {}) };
      delete nextState.dimModal;
      if (ownedModal) {
        window.history.replaceState(nextState, "", `#${target}`);
      } else {
        window.history.pushState(nextState, "", `#${target}`);
      }
    }
    routeHashTarget(target);
  };

  const handleInternalRef = (ref) => {
    if (!ref) return;

    if (ref.type === "view") {
      routeDimensionToView(ref.target, ref.dimension);
      return;
    }

    if (ref.type === "anchor") {
      if (ref.view) setView(ref.view);
      const dimensionId = getDimensionIdForHashTarget(ref.target);
      if (dimensionId) {
        requestAnchorNavigation(ref.target);
        openDimension(dimensionId, { fromHash: true });
        return;
      }
      closeDimensionForInternalNavigation();
      requestAnchorNavigation(ref.target);
    }
  };

  const tabs = [
    { key: "scorecard", label: "Scorecard" },
    { key: "promises", label: "Promises" },
    { key: "changelog", label: "Changes" },
    { key: "methodology", label: "Rubric" },
    { key: "about", label: "About" },
  ];

  const selectView = (nextView) => {
    if (nextView === view) return;
    if (drawerExitInFlightRef.current) {
      pendingViewAfterDrawerExitRef.current = nextView;
      return;
    }
    if (nextView === "promises") setPromiseDimensionFilter("All");
    if (typeof window !== "undefined") {
      // If a drawer owns the top history entry, collapse it into the view
      // entry (replace) instead of pushing on top of a #dim-<id> URL —
      // pairing a pushState with a pending history.back() would race the
      // traversal. Same owned-entry rule routeDimensionToView applies.
      const ownedModal = mobileModalEntryRef.current || window.history.state?.dimModal;
      const nextState = { ...(window.history.state || {}) };
      delete nextState.dimModal;
      if (ownedModal) {
        window.history.replaceState(nextState, "", `#view-${nextView}`);
      } else {
        window.history.pushState(nextState, "", `#view-${nextView}`);
      }
      mobileModalEntryRef.current = false;
      pendingDesktopReturnRef.current = null;
      pendingDesktopFocusRef.current = null;
      requestAnchorNavigation(`view-${nextView}`);
    }
    setExpanded(null);
    setView(nextView);
  };

  return (
    <div
      className="dashboard-shell app-shell"
      data-experience="app"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        maxWidth: "1040px",
        margin: "0 auto",
        padding: "24px 16px",
        background: "#fafafa",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* Skip-to-content link (WCAG 2.4.1 Bypass Blocks). Visually
          hidden until focused via keyboard. */}
      <a
        href="#main-content"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "auto",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          background: "#1a73e8",
          color: "#fff",
          padding: "8px 16px",
          zIndex: 1000,
          textDecoration: "none",
          borderRadius: "4px",
          fontWeight: 600,
        }}
        onFocus={(e) => {
          e.currentTarget.style.left = "16px";
          e.currentTarget.style.top = "16px";
          e.currentTarget.style.width = "auto";
          e.currentTarget.style.height = "auto";
        }}
        onBlur={(e) => {
          e.currentTarget.style.left = "-9999px";
          e.currentTarget.style.top = "auto";
          e.currentTarget.style.width = "1px";
          e.currentTarget.style.height = "1px";
        }}
      >
        Skip to main content
      </a>

      {/* Desktop workspace sidebar (>=1024px only, hidden in CSS below that).
          Same five destinations as the tab rail and bottom nav. Unlike the
          tab rail, it stays visible while a dimension is open on desktop, so
          navigation never disappears during the focused-detail takeover. */}
      <aside className="app-workspace-sidebar">
        <div className="app-workspace-sidebar-brand">
          <span className="app-workspace-sidebar-title">Canada Under Carney</span>
          <span className="app-workspace-sidebar-version">v{meta.version}</span>
        </div>
        <nav className="app-workspace-sidebar-nav" aria-label="Dashboard sections">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`app-workspace-sidebar-link${view === tab.key ? " is-active" : ""}`}
              aria-current={view === tab.key ? "page" : undefined}
              onClick={() => selectView(tab.key)}
            >
              {dashboardSectionIcon(tab.key)}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
        <div className="app-workspace-sidebar-foot">
          <span>Next update: {meta.nextUpdate}</span>
          <a href="next-update.ics">Add to calendar (.ics)</a>
        </div>
      </aside>

      <div className="app-workspace-main">
      <VisitorCount />
      {/* Header */}
      <header className="dashboard-header" style={{ textAlign: "center", marginBottom: "32px" }}>
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Theme: ${theme}. Switch to ${nextTheme}.`}
          title={`Theme: ${theme}. Switch to ${nextTheme}.`}
        >
          {/* Icon shows the CURRENT mode (platform convention): light = sun, dark = moon, system = half-filled circle. */}
          {theme === "light" ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          ) : theme === "dark" ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none" />
            </svg>
          )}
        </button>
        <div
          className="dashboard-kicker"
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#8a4f12",
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginBottom: "8px",
          }}
        >
          Performance Dashboard
        </div>
        <h1
          className="dashboard-title"
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(1.75rem, 1.25rem + 2vw, 2.25rem)",
            color: "#1a1a1a",
            margin: "0 0 6px",
            lineHeight: 1.15,
          }}
        >
          Canada Under Carney
        </h1>
        <p
          className="header-clarifier"
          style={{
            fontSize: "14px",
            color: "#444",
            lineHeight: 1.5,
            margin: "0 auto 10px",
            maxWidth: "560px",
          }}
        >
          &ldquo;Canada Under Carney&rdquo; is a time-period label, like &ldquo;Canada
          under Chr&eacute;tien&rdquo; or &ldquo;Canada under Diefenbaker.&rdquo; This
          scorecard grades the Carney government&rsquo;s performance, not Canada itself.
        </p>
        <div
          className="header-subtitle"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
            fontSize: "15px",
            color: "#555",
          }}
        >
          <span>
            {meta.coveragePeriod.start.slice(0, 7).replace("-", "/")} &ndash;{" "}
            {meta.coveragePeriod.end.slice(0, 7).replace("-", "/")}
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "3px 8px",
              borderRadius: "999px",
              background: "#fff7e6",
              border: "1px solid #f0d49a",
              color: "#6b4a00",
              fontWeight: 700,
            }}
          >
            <span style={{ textTransform: "uppercase", fontSize: "12px", letterSpacing: "0.4px" }}>
              Updated
            </span>
            {meta.lastUpdated}
          </span>
          <span>v{meta.version}</span>
        </div>
      </header>

      {/* One-line orientation, above the trust frame: what this does, plainly. */}
      <p
        className="dashboard-orientation"
        style={{
          textAlign: "center",
          fontSize: "16px",
          color: "#555",
          lineHeight: 1.5,
          margin: "0 auto 16px",
          maxWidth: "720px",
          fontWeight: 500,
        }}
      >
        An evidence-based scorecard grading the Carney government on 11 policy areas. Open any card to see how it&rsquo;s graded, the sources, and the reasoning.
      </p>

      {/* Trust frame — global, sits between the title and the scoreboard so
          a reader sees what this dashboard is and is not for, regardless of
          which tab they land on. Earlier it was scoped to the Scorecard tab
          only; moving it up makes the framing tab-agnostic. */}
      <div
        className="scorecard-trust-wrap"
        style={{
          maxWidth: "820px",
          margin: "0 auto 20px",
        }}
      >
        <div
          className="scorecard-trust-frame"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            columnGap: "28px",
            rowGap: "10px",
            textAlign: "left",
            borderTop: "1px solid #e0e0e0",
            borderBottom: "1px solid #e0e0e0",
            padding: "16px 0",
            alignItems: "start",
          }}
        >
          <div className="scorecard-trust-item" style={{ fontSize: "14px", color: "#333", lineHeight: 1.5, minWidth: 0 }}>
            <strong>What this is:</strong> each grade is built from published thresholds, source links, and review dates.
          </div>
          <div className="scorecard-trust-item" style={{ fontSize: "14px", color: "#333", lineHeight: 1.5, minWidth: 0 }}>
            <strong>What this isn&rsquo;t:</strong> a forecast, voting guide, popularity measure, or claim that only measurable files matter.
          </div>
          <div className="scorecard-trust-item" style={{ fontSize: "14px", color: "#333", lineHeight: 1.5, minWidth: 0 }}>
            <div style={{ fontWeight: 700, color: "#333", marginBottom: "4px" }}>
              How to check it
            </div>
            <button
              type="button"
              onClick={handleShowSafeguards}
              className="text-link-button"
              style={{
                background: "none",
                border: "none",
                padding: 0,
                color: "#1565c0",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "14px",
                lineHeight: 1.5,
                fontWeight: 700,
                textDecoration: "underline",
                textAlign: "left",
                minWidth: 0,
                minHeight: 0,
              }}
            >
              read the safeguards
            </button>
            <span> or open any card to walk the criteria, evidence, sources, and critic /
            defender views.
            </span>
          </div>
        </div>
      </div>

      {/* Scoreboard header: overall grades + promise count + approval signal card */}
      <div id="main-content" tabIndex={-1} />
      <div id="scoreboard-row">
      <ScoreboardHeader
        overallGrade={gpaToGrade(parseFloat(overallGPA))}
        overallGPA={overallGPA}
        pocketbookGrade={gpaToGrade(parseFloat(pocketbookGPA))}
        pocketbookGPA={pocketbookGPA}
        promiseCounts={promiseCounts}
        totalPromises={totalPromises}
        onOpenPromises={() => selectView("promises")}
        approvalExpanded={approvalExpanded}
        onToggleApproval={handleToggleApproval}
        derivationOpen={derivationOpen}
        onToggleDerivation={handleToggleDerivation}
        overallDerivation={overallDerivation}
        pocketbookDerivation={pocketbookDerivation}
      />
      </div>

      <DashboardStatus gradeMoves={currentGradeMoves} />

      <SinceLastVisit onOpenChangelog={() => selectView("changelog")} />

      {/* Section navigation is a horizontally scrollable rail on narrow screens. */}
      <div className="dashboard-tabs-wrap">
      <nav
        className="dashboard-tabs dashboard-section-nav"
        aria-label="Dashboard sections"
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "20px",
          background: "#eee",
          borderRadius: "8px",
          padding: "4px",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            className="dashboard-tab"
            onClick={() => selectView(t.key)}
            aria-current={view === t.key ? "page" : undefined}
            style={{
              flex: "1 1 auto",
              minWidth: "fit-content",
              padding: "10px 14px",
              fontSize: "14px",
              fontWeight: 700,
              background: view === t.key ? "#fff" : "transparent",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              color: view === t.key ? "#1a1a1a" : "#444",
              transition: "all 0.2s",
              fontFamily: "'DM Sans', sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>
      </div>

      <span className="app-view-announcer" aria-live="polite" aria-atomic="true">
        {tabs.find((tab) => tab.key === view)?.label} view
      </span>
      <div
        id={`view-${view}`}
        tabIndex={view === "promises" ? -1 : undefined}
        className="app-shell-view"
        key={view}
        style={view === "promises" ? { scrollMarginTop: "16px" } : undefined}
      >
      {/* The scorecard is not lazy, so first paint never suspends. A route
          failure stays inside this boundary instead of blanking the shell. */}
      <RouteErrorBoundary key={view}>
      <Suspense fallback={<div className="route-loading" role="status">Loading section...</div>}>
      {/* Scorecard View */}
      {view === "scorecard" && (
        <>
        {/* Scorecard-local orientation: intro line + legend. The trust frame
            ("what this is / what this isn't") moved up to the global header
            so it shows on every tab. The legend below stays Scorecard-local
            because it documents the visual language used only in this grid. */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "16px",
            maxWidth: "820px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              color: "#1a1a1a",
              fontWeight: 700,
              lineHeight: 1.5,
              marginBottom: "8px",
            }}
          >
            11 policy areas graded A–F, updated monthly.
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "18px",
              rowGap: "6px",
              fontSize: "14px",
              color: "#444",
              fontWeight: 600,
              flexWrap: "wrap",
            }}
          >
            <span><span style={{ color: "#2e7d32", fontWeight: 700 }}>{"\u25B2"}</span> Improving</span>
            <span><span style={{ color: "#757575", fontWeight: 700 }}>{"\u25AC"}</span> Stable</span>
            <span><span style={{ color: "#c62828", fontWeight: 700 }}>{"\u25BC"}</span> Declining</span>
            <span><span style={{ color: "#c62828", fontSize: "12px", fontWeight: 600 }}>(was X)</span> Grade changed</span>
            {currentGradeMoves.length > 0 && (
              <span><span className="dim-current-grade-move-marker">Grade moved this release</span></span>
            )}
            <span style={{ color: "#666", fontWeight: 500, fontStyle: "italic" }}>
              Click any card for the reasoning.
            </span>
          </div>
        </div>
        {isDesktopFocusedDetail ? (
          <div
            id="scorecard-dimension-grid"
            className="desktop-focused-detail-wrap"
          >
            <DimensionCard
              key={`focused-${expandedDimension.id}`}
              dim={expandedDimension}
              isExpanded
              detailStatus={fullDimensions ? "ready" : detailLoadStatus}
              onRetryDetails={retryDimensionDetails}
              focusedDesktop
              onClick={() => toggleDimension(expandedDimension.id)}
              onInternalRef={handleInternalRef}
              anchorNavigation={anchorNavigation}
              onHashTarget={handleHashTargetNavigation}
              gradeMoves={currentGradeMovesByDimension.get(expandedDimension.id) || []}
              trackerStat={expandedDimension.excludeFromGPA ? {
                delivered: promiseCounts["Delivered"] || 0,
                total: totalPromises,
              } : undefined}
            />
          </div>
        ) : (
          <>
          <div
            id="scorecard-dimension-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gridAutoFlow: "dense",
              gap: "var(--space-3)",
            }}
          >
            {scoredDimensions.map((d) => (
              <DimensionCard
                key={d.id}
                dim={expanded === d.id ? (fullDimensionById.get(d.id) || d) : d}
                isExpanded={expanded === d.id}
                detailStatus={expanded === d.id && !fullDimensionById.has(d.id)
                  ? detailLoadStatus
                  : "ready"}
                onRetryDetails={retryDimensionDetails}
                onClick={() => toggleDimension(d.id)}
                onInternalRef={handleInternalRef}
                anchorNavigation={anchorNavigation}
                onHashTarget={handleHashTargetNavigation}
                gradeMoves={currentGradeMovesByDimension.get(d.id) || []}
              />
            ))}
          </div>
          {trackerDimensions.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#1a1a1a",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                marginBottom: "6px",
              }}
            >
              Accountability Tracker
            </div>
            <div
              style={{
                fontSize: "15px",
                color: "#444",
                marginBottom: "12px",
                lineHeight: 1.5,
              }}
            >
              Promise Delivery is a running count of the government&rsquo;s
              specific commitments: how many are delivered, in progress,
              stalled, or abandoned. Tracked here for accountability but
              kept separate from the 11 performance grades, because the
              same events are already scored inside those grades. The
              number beside the card is delivered / total.
            </div>
            <div
              id="accountability-tracker-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gridAutoFlow: "dense",
                gap: "12px",
              }}
            >
              {trackerDimensions.map((d) => (
                <DimensionCard
                  key={d.id}
                  dim={expanded === d.id ? (fullDimensionById.get(d.id) || d) : d}
                  isExpanded={expanded === d.id}
                  detailStatus={expanded === d.id && !fullDimensionById.has(d.id)
                    ? detailLoadStatus
                    : "ready"}
                  onRetryDetails={retryDimensionDetails}
                  onClick={() => toggleDimension(d.id)}
                  onInternalRef={handleInternalRef}
                  anchorNavigation={anchorNavigation}
                  onHashTarget={handleHashTargetNavigation}
                  gradeMoves={currentGradeMovesByDimension.get(d.id) || []}
                  trackerStat={{
                    delivered: promiseCounts["Delivered"] || 0,
                    total: totalPromises,
                  }}
                />
              ))}
            </div>
          </div>
          )}
          </>
        )}
        </>
      )}

      {/* Each deferred component signals from inside its loaded chunk, so
          anchor navigation can retry against content that now exists. */}
      {view === "promises" && (
        <div>
          <PromiseTrackerRoute
            appMode={appMode}
            initialDimensionFilter={promiseDimensionFilter}
            onReady={handleLazyViewReady}
          />
        </div>
      )}

      {view === "changelog" && <WhatsChangedRoute onReady={handleLazyViewReady} />}

      {view === "methodology" && <Methodology onReady={handleLazyViewReady} />}

      {view === "about" && <About onReady={handleLazyViewReady} />}
      </Suspense>
      </RouteErrorBoundary>
      </div>

      {/* Email signup */}
      <EmailSignup />

      {/* Footer */}
      <footer
        className="dashboard-footer"
        style={{
          textAlign: "center",
          marginTop: "32px",
          padding: "16px",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <div style={{ fontSize: "14px", color: "#555" }}>
          Canada Under Carney &middot; Data: Statistics Canada, PBO, CMHC, Bank of Canada, IRCC, ECCC, NATO, OECD, IMF, Fitch
        </div>
        <div style={{ fontSize: "14px", color: "#555", marginTop: "4px" }}>
          Monthly updates with ad-hoc revisions on major events &middot; Rubric
          v{meta.rubricVersion} &middot; Next scheduled update: {meta.nextUpdate}
        </div>
        <FollowUpdates />
      </footer>
      </div>

      {!expandedDimension && (
        <nav className="app-bottom-nav" aria-label="Dashboard sections">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`app-bottom-nav-button${view === tab.key ? " is-active" : ""}`}
              aria-current={view === tab.key ? "page" : undefined}
              onClick={() => selectView(tab.key)}
            >
              {dashboardSectionIcon(tab.key)}
              <span className="app-bottom-nav-label">{tab.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
