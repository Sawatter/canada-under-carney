import { useEffect, useLayoutEffect, useRef, useState } from "react";
import status from "../data/status.json";

const MOBILE_STATUS_QUERY = "(max-width: 640px)";

const STATUS_DISCLAIMERS = {
  scan_vs_review_v1: "Scans check whether cited sources published anything new. Grades change only after editor review against the published rubric.",
};

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function formatDate(value) {
  return dateFormatter.format(new Date(`${value}T00:00:00Z`));
}

function isMobileStatusViewport() {
  return typeof window !== "undefined"
    && typeof window.matchMedia === "function"
    && window.matchMedia(MOBILE_STATUS_QUERY).matches;
}

export default function DashboardStatus() {
  const [isMobileStatus, setIsMobileStatus] = useState(isMobileStatusViewport);
  const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);
  const mobileDetailsOpenRef = useRef(false);
  const headingRef = useRef(null);
  const detailsRef = useRef(null);
  const toggleRef = useRef(null);
  const pendingFocusRepairRef = useRef(false);
  const evidenceScanDate = formatDate(status.lastSourceScanAt);
  const editorReviewedDate = formatDate(status.lastEditorReviewedScoreCycleAt);
  const coverageThroughDate = formatDate(status.coverageThrough);
  const facts = [
    ["Evidence scan", evidenceScanDate],
    ["Next scheduled scan", formatDate(status.nextScheduledSourceScanAt)],
    ["Editor-reviewed score cycle", editorReviewedDate],
    ["Coverage through", coverageThroughDate],
  ];
  const detailsVisible = !isMobileStatus || mobileDetailsOpen;

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }

    const media = window.matchMedia(MOBILE_STATUS_QUERY);
    const handleViewportChange = (event) => {
      const activeElement = document.activeElement;
      const hidesFocusedDetails = event.matches
        && !mobileDetailsOpenRef.current
        && detailsRef.current?.contains(activeElement);
      const removesFocusedToggle = !event.matches && toggleRef.current === activeElement;
      const keepsFocusedHeading = headingRef.current === activeElement;
      if (hidesFocusedDetails || removesFocusedToggle || keepsFocusedHeading) {
        pendingFocusRepairRef.current = true;
      }
      setIsMobileStatus(event.matches);
    };

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", handleViewportChange);
      return () => media.removeEventListener("change", handleViewportChange);
    }

    if (typeof media.addListener === "function") {
      media.addListener(handleViewportChange);
      return () => media.removeListener(handleViewportChange);
    }

    return undefined;
  }, []);

  useEffect(() => {
    mobileDetailsOpenRef.current = mobileDetailsOpen;
  }, [mobileDetailsOpen]);

  useLayoutEffect(() => {
    if (!pendingFocusRepairRef.current) return;
    pendingFocusRepairRef.current = false;
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.scrollIntoView({ behavior: "auto", block: "center" });
  }, [isMobileStatus]);

  const toggleMobileDetails = () => {
    setMobileDetailsOpen((isOpen) => !isOpen);
  };

  return (
    <section
      className="dashboard-status"
      aria-labelledby="dashboard-status-heading"
    >
      <div className="dashboard-status-head">
        <h2 id="dashboard-status-heading" ref={headingRef} tabIndex={-1}>Dashboard status</h2>
        <p>Source freshness and score review are tracked separately.</p>
      </div>
      {isMobileStatus && (
        <>
          <p className="dashboard-status-summary">
            <span><strong>Evidence scan</strong> {evidenceScanDate}</span>
            <span aria-hidden="true"> &middot; </span>
            <span><strong>Editor-reviewed cycle</strong> {editorReviewedDate}</span>
            <span aria-hidden="true"> &middot; </span>
            <span><strong>Coverage through</strong> {coverageThroughDate}</span>
          </p>
          <button
            ref={toggleRef}
            type="button"
            className="dashboard-status-toggle"
            aria-expanded={mobileDetailsOpen}
            aria-controls="dashboard-status-details"
            onClick={toggleMobileDetails}
          >
            {mobileDetailsOpen ? "Hide details" : "Show details"}
          </button>
        </>
      )}
      <div
        id="dashboard-status-details"
        ref={detailsRef}
        className="dashboard-status-details"
        hidden={!detailsVisible}
      >
        <dl className="dashboard-status-list">
          {facts.map(([label, value]) => (
            <div key={label} className="dashboard-status-row">
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <p className="dashboard-status-note">
          {STATUS_DISCLAIMERS[status.disclaimerKey]}
        </p>
      </div>
    </section>
  );
}
