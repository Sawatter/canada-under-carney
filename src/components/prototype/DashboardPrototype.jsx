import { useMemo, useState } from "react";
import dimensions from "../../data/dimensions.json";
import meta from "../../data/meta.json";
import approvalPolls from "../../data/approval-polls.json";
import { STATUS_COLORS } from "../../constants";
import {
  calculateOverallGPA,
  calculatePocketbookGPA,
  countPromises,
  gpaToGrade,
} from "../../utils";
import "./prototype.css";

const TABS = [
  { key: "scorecard", label: "Scorecard" },
  { key: "promises", label: "Promises" },
  { key: "method", label: "How it works" },
  { key: "about", label: "About" },
];

const STATUS_ORDER = [
  "Delivered",
  "In Progress",
  "Stalled",
  "Abandoned",
  "Thwarted",
  "Unclear",
  "Too Early",
];

function formatDate(value) {
  if (!value) return "No date";
  return value;
}

function linkChip(href, label, tone) {
  if (!href) return null;
  return (
    <a
      className={`proto-link-chip proto-link-chip-${tone}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
    </a>
  );
}

function PrototypeHeader({ tab, setTab }) {
  return (
    <header className="proto-header">
      <div>
        <p className="proto-kicker">Dev-only app-shell prototype</p>
        <h1>Canada Under Carney</h1>
        <p className="proto-subtitle">
          A local interaction experiment. The live dashboard remains the public source of
          record.
        </p>
      </div>
      <div className="proto-meta-stack" aria-label="Prototype metadata">
        <span>v{meta.version}</span>
        <span>Updated {meta.lastUpdated}</span>
      </div>
      <nav className="proto-tabs" aria-label="Prototype sections">
        {TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={tab === item.key ? "is-active" : ""}
            onClick={() => setTab(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

function ScorecardPane({ setTab }) {
  const overall = calculateOverallGPA(dimensions);
  const household = calculatePocketbookGPA(dimensions);
  const { counts, total } = countPromises(dimensions);
  const graded = dimensions.filter((dim) => !dim.excludeFromGPA);
  const approval = approvalPolls.summary;

  return (
    <main className="proto-main">
      <section className="proto-stat-grid" aria-label="Prototype score summary">
        <article className="proto-stat-card">
          <p>Household Impact</p>
          <strong>{gpaToGrade(household)}</strong>
          <span>Score {household.toFixed(1)}</span>
        </article>
        <article className="proto-stat-card">
          <p>Full Policy Audit</p>
          <strong>{gpaToGrade(overall)}</strong>
          <span>Score {overall.toFixed(1)}</span>
        </article>
        <article className="proto-stat-card">
          <p>Promises Delivered</p>
          <strong>{counts.Delivered || 0}/{total}</strong>
          <span>{counts.Stalled || 0} stalled / {counts.Abandoned || 0} abandoned</span>
        </article>
        <article className="proto-stat-card proto-stat-card-signal">
          <p>Approval Signal</p>
          <strong>{approval.approve}%</strong>
          <span>Not part of the grades</span>
        </article>
      </section>

      <section className="proto-panel">
        <div className="proto-panel-head">
          <div>
            <h2>Scorecard files</h2>
            <p>Compact list only. Production cards remain the evidence source.</p>
          </div>
          <button type="button" onClick={() => setTab("promises")}>
            Open promises
          </button>
        </div>
        <div className="proto-dimension-list">
          {graded.map((dim) => (
            <article key={dim.id} className="proto-dimension-row">
              <div>
                <h3>{dim.name}</h3>
                <p>{dim.whatThisGrades || dim.status}</p>
              </div>
              <span>{dim.grade}</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function PromiseCard({ promise }) {
  const style = STATUS_COLORS[promise.status] || STATUS_COLORS.Unclear;

  return (
    <article className="proto-promise-card">
      <div className="proto-promise-topline">
        <span
          className="proto-status-pill"
          style={{ background: style.bg, color: style.color }}
        >
          {promise.status}
        </span>
        <span>{promise.dimension}</span>
      </div>
      <h3>{promise.text}</h3>
      <dl className="proto-promise-facts">
        <div>
          <dt>Status since</dt>
          <dd>{formatDate(promise.since)}</dd>
        </div>
        <div>
          <dt>Durability</dt>
          <dd>{promise.durability || "Not specified"}</dd>
        </div>
      </dl>
      {promise.evidence && <p className="proto-evidence">{promise.evidence}</p>}
      <div className="proto-source-row">
        {linkChip(
          promise.originalSourceUrl,
          `Original source: ${promise.originalSourceLabel || "link"}`,
          "source"
        )}
        {linkChip(
          promise.statusSourceUrl,
          `Status evidence: ${promise.statusSourceLabel || "link"}`,
          "status"
        )}
        {!promise.originalSourceUrl && !promise.statusSourceUrl && (
          <span className="proto-missing-link">No source link on this row yet</span>
        )}
      </div>
    </article>
  );
}

function PromisesPane() {
  const { all, counts, total } = useMemo(() => countPromises(dimensions), []);
  const [statusFilter, setStatusFilter] = useState("All");
  const [dimensionFilter, setDimensionFilter] = useState("All");
  const [query, setQuery] = useState("");

  const dimensionsWithPromises = useMemo(() => {
    const names = [...new Set(all.map((promise) => promise.dimension))];
    return ["All", ...names];
  }, [all]);

  const filteredPromises = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return all.filter((promise) => {
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
  }, [all, dimensionFilter, query, statusFilter]);

  return (
    <main className="proto-main">
      <section className="proto-panel proto-promises-hero">
        <div>
          <p className="proto-kicker">Promise Delivery prototype</p>
          <h2>{counts.Delivered || 0} of {total} delivered</h2>
          <p>
            This tab tests a cleaner promise-review surface while preserving the
            original-source and status-evidence links from the production tracker.
          </p>
        </div>
        <div className="proto-promise-counts" aria-label="Promise status counts">
          {STATUS_ORDER.map((status) => {
            const count = counts[status] || 0;
            if (!count) return null;
            const style = STATUS_COLORS[status];
            return (
              <button
                key={status}
                type="button"
                className={statusFilter === status ? "is-active" : ""}
                style={{ "--status-color": style.color, "--status-bg": style.bg }}
                onClick={() => setStatusFilter(status)}
              >
                <strong>{count}</strong>
                <span>{status}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="proto-panel proto-filters" aria-label="Promise filters">
        <label>
          Search
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Promise, evidence, or source"
          />
        </label>
        <label>
          Status
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option>All</option>
            {STATUS_ORDER.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
        <label>
          Dimension
          <select
            value={dimensionFilter}
            onChange={(event) => setDimensionFilter(event.target.value)}
          >
            {dimensionsWithPromises.map((dimension) => (
              <option key={dimension}>{dimension}</option>
            ))}
          </select>
        </label>
        {(statusFilter !== "All" || dimensionFilter !== "All" || query) && (
          <button
            type="button"
            className="proto-clear-button"
            onClick={() => {
              setStatusFilter("All");
              setDimensionFilter("All");
              setQuery("");
            }}
          >
            Clear
          </button>
        )}
      </section>

      <section className="proto-promise-results" aria-label="Promise results">
        <div className="proto-result-count">
          Showing {filteredPromises.length} of {total} tracked promises
        </div>
        {filteredPromises.map((promise) => (
          <PromiseCard
            key={`${promise.dimension}-${promise.text}-${promise.since || "no-date"}`}
            promise={promise}
          />
        ))}
      </section>
    </main>
  );
}

function MethodPane() {
  return (
    <main className="proto-main">
      <section className="proto-panel">
        <h2>What this prototype is testing</h2>
        <p>
          The question is whether the same evidence can feel more like an app without
          hiding the rubric. Nothing here changes grades, thresholds, statuses, or the
          production scorecard.
        </p>
        <ul className="proto-bullets">
          <li>Overview first, details one tap away.</li>
          <li>Source and status evidence links stay attached to each promise.</li>
          <li>The live dashboard remains the public version until an explicit cutover.</li>
        </ul>
      </section>
    </main>
  );
}

function AboutPane() {
  return (
    <main className="proto-main">
      <section className="proto-panel">
        <h2>About this local shell</h2>
        <p>
          This is a dev-only prototype reached with <code>?prototype=app</code>. It is for
          interaction testing, especially the Promises tab. The production dashboard is
          still the source of record for readers.
        </p>
      </section>
    </main>
  );
}

export default function DashboardPrototype() {
  const [tab, setTab] = useState("promises");

  return (
    <div className="proto-shell">
      <PrototypeHeader tab={tab} setTab={setTab} />
      {tab === "scorecard" && <ScorecardPane setTab={setTab} />}
      {tab === "promises" && <PromisesPane />}
      {tab === "method" && <MethodPane />}
      {tab === "about" && <AboutPane />}
    </div>
  );
}
