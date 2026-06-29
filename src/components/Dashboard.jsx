import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import dimensions from "../data/dimensions.json";
import meta from "../data/meta.json";
import changelog from "../data/changelog.json";
import {
  gpaToGrade,
  calculateOverallGPA,
  calculatePocketbookGPA,
  countPromises,
  getOverallDerivation,
  getPocketbookDerivation,
} from "../utils";
import ScoreboardHeader from "./ScoreboardHeader";
import WhatsChanged from "./WhatsChanged";
import DimensionCard from "./DimensionCard";
import PromiseTracker from "./PromiseTracker";
import Methodology from "./Methodology";
import About from "./About";
import EmailSignup from "./EmailSignup";
import VisitorCount from "./VisitorCount";
import DashboardStatus from "./DashboardStatus";
import { getCurrentGradeMoves, getCurrentGradeMovesByDimension } from "../gradeMoves";
import "./AppShell.css";

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
  const [view, setView] = useState("scorecard");
  // Pre-applied dimension filter for the Promises view. Set when the user
  // routes in from a dimension's promises ("Open the Promises tab"); reset to
  // "All" for the Promises nav tab and hash/back-forward navigation.
  const [promiseDimensionFilter, setPromiseDimensionFilter] = useState("All");
  const [approvalExpanded, setApprovalExpanded] = useState(false);
  // Which headline-score derivation panel is open: "household", "overall", or null.
  const [derivationOpen, setDerivationOpen] = useState(null);
  const [anchorNavigation, setAnchorNavigation] = useState(null);
  const [isMobile, setIsMobile] = useState(() => isMobileViewport());
  // Theme: the no-flash script in index.html sets the initial data-theme on
  // <html> before React mounts; we read it back, then keep the attribute and
  // the saved choice in sync as the user toggles.
  const [theme, setTheme] = useState(() => (
    typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "dark"
      ? "dark"
      : "light"
  ));
  // Keep <html data-theme> in lockstep with state via an effect (idempotent, so
  // the attribute and state can never drift). Persist to localStorage ONLY when
  // the change came from an explicit user toggle (tracked by a ref set in
  // toggleTheme), never on mount — so an OS-derived default is not locked in and
  // keeps following the OS until the user toggles. Gating on the user-toggle ref
  // (rather than "after first effect run") stays correct under StrictMode's
  // development double-invocation of effects.
  const userToggledThemeRef = useRef(false);
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
    if (!userToggledThemeRef.current) return;
    try { window.localStorage.setItem("ccc-theme", theme); } catch { /* storage blocked */ }
  }, [theme]);
  const toggleTheme = useCallback(() => {
    userToggledThemeRef.current = true;
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);
  const anchorRequestIdRef = useRef(0);
  const expandedRef = useRef(null);
  const mobileModalEntryRef = useRef(false);
  const pendingViewFocusRef = useRef(null);
  const desktopReturnScrollRef = useRef(null);
  const pendingDesktopReturnRef = useRef(null);
  const pendingDesktopFocusRef = useRef(null);
  const scoredDimensions = dimensions.filter((d) => !d.excludeFromGPA);
  const trackerDimensions = dimensions.filter((d) => d.excludeFromGPA);
  const expandedDimension = dimensions.find((d) => d.id === expanded) || null;
  const isDesktopFocusedDetail = view === "scorecard" && !!expandedDimension && !isMobile;

  // Calculate grades and promises from the data
  const overallGPA = calculateOverallGPA(dimensions).toFixed(1);
  const pocketbookGPA = calculatePocketbookGPA(dimensions).toFixed(1);
  const overallDerivation = getOverallDerivation(dimensions);
  const pocketbookDerivation = getPocketbookDerivation(dimensions);
  const { all: allPromises, counts: promiseCounts, total: totalPromises } = countPromises(dimensions);
  const currentGradeMoves = getCurrentGradeMoves(changelog, dimensions, meta);
  const currentGradeMovesByDimension = getCurrentGradeMovesByDimension(changelog, dimensions, meta);

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

  const pushMobileModalEntry = useCallback((dimensionId) => {
    if (typeof window === "undefined") return;
    if (!isMobileViewport()) return;
    if (mobileModalEntryRef.current) return;

    window.history.pushState(
      { ...(window.history.state || {}), dimModal: dimensionId },
      "",
      window.location.href
    );
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
      if (!options.fromHash) pushMobileModalEntry(dimensionId);
      return dimensionId;
    });
  }, [pushMobileModalEntry]);

  const closeDimension = useCallback((dimensionId) => {
    const ownsModalEntry = mobileModalEntryRef.current;
    if (typeof window !== "undefined" && !isMobileViewport()) {
      pendingDesktopReturnRef.current = desktopReturnScrollRef.current ?? "grid";
      pendingDesktopFocusRef.current = dimensionId;
    }

    if (typeof window !== "undefined" && ownsModalEntry) {
      mobileModalEntryRef.current = false;
      setExpanded(null);
      window.history.back();
      return;
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
      mobileModalEntryRef.current = false;
      setExpanded(null);
      window.history.back();
      return;
    }

    if (isMobile && window.history.state?.dimModal) {
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
    anchorRequestIdRef.current += 1;
    setAnchorNavigation({ target, requestId: anchorRequestIdRef.current });
  }, []);

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

  const routeHashTarget = useCallback((target) => {
    if (!target) return;
    requestAnchorNavigation(target);

    const dimensionId = getDimensionIdForHashTarget(target);
    if (dimensionId) {
      setView("scorecard");
      openDimension(dimensionId, { fromHash: true });
      return;
    }

    if (target.startsWith("change-")) {
      if (typeof window !== "undefined") {
        const nextState = { ...(window.history.state || {}) };
        delete nextState.dimModal;
        window.history.replaceState(nextState, "", `#${target}`);
      }
      mobileModalEntryRef.current = false;
      pendingDesktopReturnRef.current = null;
      pendingDesktopFocusRef.current = null;
      setExpanded(null);
      setView("changelog");
      return;
    }

    if (target.startsWith("view-")) {
      closeDimensionForInternalNavigation({ closeDesktop: true });
      const nextHashView = target.replace(/^view-/, "");
      if (nextHashView === "promises") setPromiseDimensionFilter("All");
      setView(nextHashView);
      return;
    }

    closeDimensionForInternalNavigation();
  }, [closeDimensionForInternalNavigation, openDimension, requestAnchorNavigation]);

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
      const state = event.state || {};
      if (mobileModalEntryRef.current && expandedRef.current && !state.dimModal) {
        mobileModalEntryRef.current = false;
        setExpanded(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleHashChange = () => {
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
        document.getElementById(target)?.scrollIntoView({
          behavior: "auto",
          block: "start",
        });
      });
    });

    return () => {
      if (frameA) window.cancelAnimationFrame(frameA);
      if (frameB) window.cancelAnimationFrame(frameB);
    };
  }, [anchorNavigation, expanded, view]);

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
    document.getElementById(`dim-${dimensionId}-header`)?.focus({ preventScroll: true });
    return undefined;
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
    setView("methodology");
    requestAnchorNavigation("methodology-safeguards");
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
    if (nextView === "promises") setPromiseDimensionFilter("All");
    if (typeof window !== "undefined") {
      closeDimensionForInternalNavigation({ closeDesktop: true });
      window.history.pushState(window.history.state, "", `#view-${nextView}`);
      requestAnchorNavigation(`view-${nextView}`);
    }
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
      <VisitorCount />
      {/* Header */}
      <header className="dashboard-header" style={{ textAlign: "center", marginBottom: "32px" }}>
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        >
          {theme === "dark" ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
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
                dim={d}
                isExpanded={expanded === d.id}
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
                  dim={d}
                  isExpanded={expanded === d.id}
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

      {/* Promise Tracker View */}
      {view === "promises" && (
        <div>
          <PromiseTracker
            allPromises={allPromises}
            promiseCounts={promiseCounts}
            totalPromises={totalPromises}
            appMode={appMode}
            initialDimensionFilter={promiseDimensionFilter}
          />
        </div>
      )}

      {/* Change Log View */}
      {view === "changelog" && <WhatsChanged changelog={changelog} />}

      {/* Methodology View */}
      {view === "methodology" && <Methodology />}

      {/* About View */}
      {view === "about" && <About />}
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
        <div style={{ fontSize: "14px", color: "#555", marginTop: "8px" }}>
          <a
            href="feed.xml"
            style={{ color: "#1565c0", textDecoration: "none" }}
          >
            Subscribe via RSS &rarr;
          </a>
        </div>
      </footer>

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
