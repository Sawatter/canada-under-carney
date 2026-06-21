import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { STATUS_COLORS } from "../constants";

const STATUS_ORDER = [
  "Delivered",
  "In Progress",
  "Stalled",
  "Abandoned",
  "Thwarted",
  "Unclear",
  "Too Early",
];

function getPromiseKey(promise, index) {
  return `${promise.dimension}-${promise.text}-${promise.since || "no-date"}-${index}`;
}

function PromiseRow({ promise, promiseKey, expandedPromise, setExpandedPromise, appMode }) {
  const statusStyle = STATUS_COLORS[promise.status] || STATUS_COLORS.Unclear;
  const isOpen = expandedPromise === promiseKey;
  const hasExpandContent = Boolean(promise.evidence)
    || Boolean(promise.originalSourceUrl)
    || Boolean(promise.statusSourceUrl);
  const detailId = `promise-${promiseKey.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-detail`;
  const toggle = () => setExpandedPromise(isOpen ? null : promiseKey);
  const handleKeyDown = (event) => {
    if (!hasExpandContent) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle();
    }
  };

  return (
    <div
      className={appMode ? "app-promise-row" : undefined}
      onClick={hasExpandContent ? toggle : undefined}
      onKeyDown={handleKeyDown}
      role={hasExpandContent ? "button" : undefined}
      tabIndex={hasExpandContent ? 0 : undefined}
      aria-expanded={hasExpandContent ? isOpen : undefined}
      aria-controls={hasExpandContent ? detailId : undefined}
      style={{
        padding: appMode ? "14px 16px" : "8px 16px",
        borderBottom: appMode ? "1px solid #f0f2ef" : "1px solid #f5f5f5",
        cursor: hasExpandContent ? "pointer" : "default",
        background: isOpen ? (appMode ? "#f6f8f5" : "#fafafa") : "transparent",
        transition: "background 0.15s",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <span style={{ fontSize: "15px", color: "#333", flex: 1 }}>
          {appMode && (
            <span
              className="app-promise-status"
              style={{ background: statusStyle.bg, color: statusStyle.color }}
            >
              {promise.status}
            </span>
          )}
          <span className={appMode ? "app-promise-text" : undefined}>{promise.text}</span>
          {promise.durability && (
            <span
              style={{
                fontSize: "13px",
                color: "#666",
                marginLeft: "6px",
                fontStyle: "italic",
              }}
            >
              {promise.durability}
            </span>
          )}
          {hasExpandContent && (
            <span
              aria-hidden="true"
              style={{
                fontSize: "13px",
                color: isOpen ? (appMode ? "#174f3d" : "#1a73e8") : "#666",
                marginLeft: "6px",
                fontWeight: 700,
              }}
            >
              {isOpen ? "\u25BE Hide" : "\u25B8 Details"}
            </span>
          )}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontSize: "14px",
              color: "#666",
              whiteSpace: "nowrap",
              fontStyle: "italic",
            }}
          >
            {promise.dimension}
          </span>
        </div>
      </div>
      {isOpen && hasExpandContent && (
        <div
          id={detailId}
          role="region"
          aria-label={`Evidence for ${promise.text}`}
          style={{
            fontSize: "13px",
            color: "#666",
            marginTop: appMode ? "8px" : "6px",
            paddingLeft: "10px",
            borderLeft: `2px solid ${statusStyle.color}40`,
            lineHeight: 1.5,
          }}
        >
          {promise.evidence && <div>{promise.evidence}</div>}
          {promise.since && (
            <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>
              Status since: {promise.since}
            </div>
          )}
          {(promise.originalSourceUrl || promise.statusSourceUrl) && (
            <div
              className={appMode ? "app-promise-links" : undefined}
              style={appMode ? undefined : {
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
                marginTop: "8px",
              }}
            >
              {promise.originalSourceUrl && (
                <a
                  href={promise.originalSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className={appMode ? "app-promise-link app-promise-link-source" : undefined}
                  style={appMode ? undefined : {
                    fontSize: "14px",
                    color: "#1565c0",
                    textDecoration: "none",
                    background: "#e8f0fe",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    lineHeight: 1.4,
                  }}
                >
                  <strong>Source:</strong> {promise.originalSourceLabel || "link"} &rarr;
                </a>
              )}
              {promise.statusSourceUrl && (
                <a
                  href={promise.statusSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className={appMode ? "app-promise-link app-promise-link-status" : undefined}
                  style={appMode ? undefined : {
                    fontSize: "14px",
                    color: "#b26a00",
                    textDecoration: "none",
                    background: "#fff3e0",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    lineHeight: 1.4,
                  }}
                >
                  <strong>Status evidence:</strong> {promise.statusSourceLabel || "link"} &rarr;
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ClassicSummary({ promiseCounts }) {
  return (
    <div
      className="promise-summary-bar"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      {Object.entries(STATUS_COLORS).map(([status, style]) => {
        const count = promiseCounts[status] || 0;
        if (count === 0) return null;
        return (
          <div
            key={status}
            className="promise-summary-item"
            style={{
              flex: `${count} 1 112px`,
              background: style.bg,
              padding: "12px 8px",
              textAlign: "center",
              minWidth: "112px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.6)",
            }}
          >
            <div style={{ fontSize: "20px", fontWeight: 800, color: style.color, fontFamily: "'DM Mono', monospace" }}>
              {count}
            </div>
            <div
              style={{
                fontSize: "13px",
                color: style.color,
                fontWeight: 600,
                whiteSpace: "normal",
                wordBreak: "keep-all",
                overflowWrap: "normal",
                lineHeight: 1.2,
              }}
            >
              {status}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function PromiseTracker({ allPromises, promiseCounts, totalPromises, appMode = false }) {
  const [expandedPromise, setExpandedPromise] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [dimensionFilter, setDimensionFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("status");
  const [groupBy, setGroupBy] = useState("status");
  const [isFilterSectionVisible, setIsFilterSectionVisible] = useState(true);
  const filterSectionRef = useRef(null);
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    const filterSection = filterSectionRef.current;
    if (!appMode || !filterSection || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsFilterSectionVisible(entry.isIntersecting);
    });
    observer.observe(filterSection);

    return () => observer.disconnect();
  }, [appMode]);

  const dimensionsWithPromises = useMemo(() => (
    ["All", ...new Set(allPromises.map((promise) => promise.dimension))]
  ), [allPromises]);

  const indexedPromises = useMemo(() => (
    allPromises.map((promise, index) => ({
      promise,
      key: getPromiseKey(promise, index),
    }))
  ), [allPromises]);

  const filteredPromises = useMemo(() => {
    if (!appMode) return indexedPromises;
    const normalized = deferredQuery.trim().toLowerCase();
    return indexedPromises.filter(({ promise }) => {
      if (statusFilter !== "All" && promise.status !== statusFilter) return false;
      if (dimensionFilter !== "All" && promise.dimension !== dimensionFilter) return false;
      if (!normalized) return true;
      return [
        promise.text,
        promise.evidence,
        promise.dimension,
        promise.originalSourceLabel,
        promise.statusSourceLabel,
      ].some((value) => String(value || "").toLowerCase().includes(normalized));
    });
  }, [appMode, deferredQuery, dimensionFilter, indexedPromises, statusFilter]);

  const sortedPromises = useMemo(() => {
    const sorted = [...filteredPromises];
    if (!appMode || sortBy === "status") {
      sorted.sort((a, b) => STATUS_ORDER.indexOf(a.promise.status) - STATUS_ORDER.indexOf(b.promise.status));
    } else if (sortBy === "dimension") {
      sorted.sort((a, b) => a.promise.dimension.localeCompare(b.promise.dimension));
    } else if (sortBy === "date") {
      sorted.sort((a, b) => String(b.promise.since || "").localeCompare(String(a.promise.since || "")));
    }
    return sorted;
  }, [appMode, filteredPromises, sortBy]);

  const groups = useMemo(() => {
    const activeGroup = appMode ? groupBy : "status";
    if (activeGroup === "none") return [{ key: null, items: sortedPromises }];

    const grouped = new Map();
    sortedPromises.forEach((item) => {
      const key = activeGroup === "dimension" ? item.promise.dimension : item.promise.status;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(item);
    });

    if (activeGroup === "status") {
      return STATUS_ORDER
        .filter((status) => grouped.has(status))
        .map((status) => ({ key: status, items: grouped.get(status) }));
    }

    return [...grouped.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, items]) => ({ key, items }));
  }, [appMode, groupBy, sortedPromises]);

  const clearFilters = () => {
    setStatusFilter("All");
    setDimensionFilter("All");
    setQuery("");
  };
  const activeFilterCount = Number(statusFilter !== "All")
    + Number(dimensionFilter !== "All")
    + Number(Boolean(query));
  const hasActiveFilter = activeFilterCount > 0;
  const returnToFilters = () => {
    const filterSection = filterSectionRef.current;
    if (!filterSection) return;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    filterSection.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    filterSection.focus({ preventScroll: true });
  };

  return (
    <div className={appMode ? "app-promise-tracker" : undefined} style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e0e0e0", overflow: appMode ? "visible" : "hidden" }}>
      {appMode ? (
        <>
          <section className="app-promise-hero" aria-labelledby="promise-tracker-title">
            <div>
              <div className="app-section-kicker">Promise Delivery</div>
              <h2 id="promise-tracker-title">{promiseCounts.Delivered || 0} of {totalPromises} delivered</h2>
              <p>Search, sort, and group commitments without losing the original source or status evidence.</p>
            </div>
            <div className="app-promise-counts" role="group" aria-label="Filter promises by status">
              {STATUS_ORDER.map((status) => {
                const count = promiseCounts[status] || 0;
                if (!count) return null;
                const style = STATUS_COLORS[status];
                return (
                  <button
                    key={status}
                    type="button"
                    aria-pressed={statusFilter === status}
                    className={statusFilter === status ? "is-active" : undefined}
                    style={{ "--status-color": style.color, "--status-bg": style.bg }}
                    onClick={() => setStatusFilter((current) => current === status ? "All" : status)}
                  >
                    <strong>{count}</strong>
                    <span>{status}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section
            ref={filterSectionRef}
            className="app-promise-filters"
            aria-label="Promise filters"
            tabIndex={-1}
          >
            <label className="app-promise-search">
              Search
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Promise, evidence, or source" />
            </label>
            <label>
              Status
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option>All</option>
                {STATUS_ORDER.map((status) => <option key={status}>{status}</option>)}
              </select>
            </label>
            <label>
              Dimension
              <select value={dimensionFilter} onChange={(event) => setDimensionFilter(event.target.value)}>
                {dimensionsWithPromises.map((dimension) => <option key={dimension}>{dimension}</option>)}
              </select>
            </label>
            <label>
              Sort
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="status">By status</option>
                <option value="dimension">By dimension</option>
                <option value="date">Most recent</option>
              </select>
            </label>
            <label>
              Group
              <select value={groupBy} onChange={(event) => setGroupBy(event.target.value)}>
                <option value="none">None</option>
                <option value="dimension">By dimension</option>
                <option value="status">By status</option>
              </select>
            </label>
            {hasActiveFilter && <button type="button" className="app-clear-filters" onClick={clearFilters}>Clear</button>}
          </section>
          {hasActiveFilter && !isFilterSectionVisible && (
            <div className="app-promise-filter-return" role="region" aria-label="Active promise filters">
              <button
                type="button"
                className="app-promise-filter-return-button"
                onClick={returnToFilters}
              >
                <span className="app-promise-filter-return-summary">
                  {activeFilterCount} active {activeFilterCount === 1 ? "filter" : "filters"}
                </span>
                <span aria-hidden="true">View</span>
              </button>
              <button
                type="button"
                className="app-promise-filter-return-clear"
                onClick={clearFilters}
              >
                Clear
              </button>
            </div>
          )}
        </>
      ) : (
        <ClassicSummary promiseCounts={promiseCounts} />
      )}

      <section className={appMode ? "app-promise-results" : undefined} aria-label="Promise results">
        {appMode && (
          <div className="app-promise-result-count" aria-live="polite" aria-atomic="true">
            Showing {sortedPromises.length} of {totalPromises} tracked promises
          </div>
        )}
        {appMode && sortedPromises.length === 0 ? (
          <div className="app-promise-empty">
            <p>No promises match these filters.</p>
            <button type="button" className="app-clear-filters" onClick={clearFilters}>Clear filters</button>
          </div>
        ) : groups.map((group) => {
          const groupStyle = STATUS_COLORS[group.key];
          return (
            <div key={group.key || "all"} className={appMode ? "app-promise-group" : undefined}>
              {group.key && (
                <div
                  className={appMode ? "app-promise-group-heading" : undefined}
                  style={appMode ? undefined : {
                    padding: "12px 16px 4px",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: groupStyle?.color || "#333",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    background: groupStyle ? `${groupStyle.bg}44` : "#f5f5f5",
                  }}
                >
                  {groupStyle?.label || group.key} ({group.items.length})
                </div>
              )}
              {group.items.map(({ promise, key }) => (
                <PromiseRow
                  key={key}
                  promise={promise}
                  promiseKey={key}
                  expandedPromise={expandedPromise}
                  setExpandedPromise={setExpandedPromise}
                  appMode={appMode}
                />
              ))}
            </div>
          );
        })}
      </section>
    </div>
  );
}
