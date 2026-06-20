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
import { computeApprovalSignal } from "../../approvalAggregation";
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

const TREND_GLYPH = { up: "▲", stable: "▬", down: "▼" };

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

function PrototypeHeader({ tab, setTab, detailOpen }) {
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
            className={!detailOpen && tab === item.key ? "is-active" : ""}
            onClick={() => setTab(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

function ScorecardPane({ onOpenDim }) {
  const overall = calculateOverallGPA(dimensions);
  const household = calculatePocketbookGPA(dimensions);
  const { counts, total } = countPromises(dimensions);
  const graded = dimensions.filter((dim) => !dim.excludeFromGPA);
  const tracker = dimensions.find((dim) => dim.excludeFromGPA);
  const approval = computeApprovalSignal(approvalPolls);

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
          <strong>{approval.approveNow != null ? `${Math.round(approval.approveNow)}%` : "n/a"}</strong>
          <span>Not part of the grades</span>
        </article>
      </section>

      <section className="proto-panel">
        <div className="proto-panel-head">
          <div>
            <h2>Scorecard files</h2>
            <p>Tap a file to read the verdict, the reasoning, and the evidence.</p>
          </div>
        </div>
        <div className="proto-dimension-list">
          {graded.map((dim) => (
            <button
              key={dim.id}
              type="button"
              className="proto-dimension-row proto-dimension-row-button"
              onClick={() => onOpenDim(dim.id)}
            >
              <div>
                <h3>{dim.name}</h3>
                <p>{dim.whatThisGrades || dim.status}</p>
              </div>
              <span>{dim.grade}</span>
            </button>
          ))}
          {tracker && (
            <button
              type="button"
              className="proto-dimension-row proto-dimension-row-button proto-dimension-row-tracker"
              onClick={() => onOpenDim(tracker.id)}
            >
              <div>
                <h3>{tracker.name}</h3>
                <p>{tracker.whatThisGrades || tracker.status}</p>
              </div>
              <span>{tracker.informationalGrade}</span>
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

function triggerText(trigger) {
  if (typeof trigger === "string") return trigger;
  return trigger?.text || "";
}

function TriggerItems({ items, keyPrefix }) {
  return (
    <ul>
      {items.map((t, i) => (
        <li key={`${keyPrefix}-${i}`}>
          {triggerText(t)}
          {t?.sourceUrl && (
            <>
              {" "}
              <a href={t.sourceUrl} target="_blank" rel="noopener noreferrer">
                ({t.sourceLabel || "source"})
              </a>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

function DetailSection({ title, children }) {
  return (
    <section className="proto-panel proto-detail-section">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function DimensionDetailPane({ dim, onBack }) {
  const isTracker = !!dim.excludeFromGPA;
  const grade = isTracker ? dim.informationalGrade : dim.grade;
  const triggers = dim.gradeTriggers || {};
  const up = triggers.up || [];
  const down = triggers.down || [];
  const thresholds = dim.scoring?.thresholds || [];

  return (
    <main className="proto-main proto-detail">
      <button type="button" className="proto-back" onClick={onBack}>
        ← All files
      </button>

      <section className="proto-panel proto-verdict">
        <div className="proto-verdict-head">
          <div>
            <p className="proto-kicker">
              {isTracker ? "Tracker snapshot · outside the GPA" : "Verdict"}
            </p>
            <h2>{dim.name}</h2>
            {dim.whatThisGrades && <p>{dim.whatThisGrades}</p>}
          </div>
          <div className="proto-verdict-grade">
            <strong>{grade}</strong>
            <span>
              {TREND_GLYPH[dim.trend] || ""}
              {isTracker
                ? " informational"
                : dim.previousGrade
                ? ` was ${dim.previousGrade}`
                : ""}
            </span>
          </div>
        </div>
        {dim.status && <p className="proto-verdict-summary">{dim.status}</p>}
      </section>

      {(dim.judgmentCall || dim.rationale || dim.gradeBasis?.bandCriterion) && (
        <DetailSection title="Why this grade">
          {dim.judgmentCall && (
            <p className="proto-judgment">
              <strong>Judgment call:</strong> {dim.judgmentCall}
            </p>
          )}
          {dim.rationale && <p>{dim.rationale}</p>}
          {dim.gradeBasis?.bandCriterion && (
            <p className="proto-band-note">
              <strong>{dim.gradeBasis.band || grade} means:</strong>{" "}
              {dim.gradeBasis.bandCriterion}
            </p>
          )}
          {dim.gradeBasis?.plusMinusRationale && <p>{dim.gradeBasis.plusMinusRationale}</p>}
        </DetailSection>
      )}

      {(up.length > 0 || down.length > 0) && (
        <DetailSection title="What would change this grade">
          {up.length > 0 && (
            <div className="proto-trigger-group">
              <h4>Moves it up</h4>
              <TriggerItems items={up} keyPrefix="up" />
            </div>
          )}
          {down.length > 0 && (
            <div className="proto-trigger-group">
              <h4>Moves it down</h4>
              <TriggerItems items={down} keyPrefix="down" />
            </div>
          )}
        </DetailSection>
      )}

      {dim.metrics?.length > 0 && (
        <DetailSection title="Key metrics">
          <div className="proto-metric-list">
            {dim.metrics.slice(0, 6).map((m, i) => (
              <div key={`m-${i}`} className="proto-metric">
                <span className="proto-metric-label">{m.label}</span>
                <span className="proto-metric-value">{String(m.value ?? "")}</span>
                {m.sourceNote && <p>{m.sourceNote}</p>}
              </div>
            ))}
          </div>
        </DetailSection>
      )}

      {dim.sources?.length > 0 && (
        <DetailSection title={`Sources (${dim.sources.length})`}>
          <ul className="proto-source-list">
            {dim.sources.map((s, i) => (
              <li key={`s-${i}`}>
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                ) : (
                  s.label
                )}
                {s.date && (
                  <span className="proto-source-date">
                    {s.dateKind === "as-of" ? "as of " : ""}
                    {s.date}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </DetailSection>
      )}

      {thresholds.length > 0 && (
        <DetailSection title="Rule">
          <table className="proto-rule-table">
            <thead>
              <tr>
                <th>Grade</th>
                <th>Criteria</th>
              </tr>
            </thead>
            <tbody>
              {thresholds.map((row, i) => (
                <tr key={`t-${i}`} className={row.grade === grade ? "is-active" : ""}>
                  <td>{row.grade}</td>
                  <td>{row.criteria}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {dim.scoring?.scopeNote && (
            <p>
              <strong>Scope:</strong> {dim.scoring.scopeNote}
            </p>
          )}
        </DetailSection>
      )}
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
  const [sortBy, setSortBy] = useState("status");
  const [groupBy, setGroupBy] = useState("none");

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

  const sorted = useMemo(() => {
    const arr = [...filteredPromises];
    if (sortBy === "status") {
      arr.sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status));
    } else if (sortBy === "dimension") {
      arr.sort((a, b) => String(a.dimension).localeCompare(String(b.dimension)));
    } else if (sortBy === "date") {
      arr.sort((a, b) => String(b.since || "").localeCompare(String(a.since || "")));
    }
    return arr;
  }, [filteredPromises, sortBy]);

  const groups = useMemo(() => {
    if (groupBy === "none") return [{ key: null, items: sorted }];
    const map = new Map();
    for (const promise of sorted) {
      const key = groupBy === "dimension" ? promise.dimension : promise.status;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(promise);
    }
    if (groupBy === "status") {
      return STATUS_ORDER.filter((s) => map.has(s)).map((s) => ({ key: s, items: map.get(s) }));
    }
    return [...map.entries()]
      .sort((a, b) => String(a[0]).localeCompare(String(b[0])))
      .map(([key, items]) => ({ key, items }));
  }, [sorted, groupBy]);

  const hasActiveFilter = statusFilter !== "All" || dimensionFilter !== "All" || query;

  const clearFilters = () => {
    setStatusFilter("All");
    setDimensionFilter("All");
    setQuery("");
  };

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
                onClick={() =>
                  setStatusFilter((current) => (current === status ? "All" : status))
                }
              >
                <strong>{count}</strong>
                <span>{status}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section
        className="proto-panel proto-filters proto-filters-sticky"
        aria-label="Promise filters"
      >
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
        {hasActiveFilter && (
          <button type="button" className="proto-clear-button" onClick={clearFilters}>
            Clear
          </button>
        )}
      </section>

      <section className="proto-promise-results" aria-label="Promise results">
        <div className="proto-result-count">
          Showing {sorted.length} of {total} tracked promises
        </div>
        {sorted.length === 0 ? (
          <div className="proto-empty">
            <p>No promises match these filters.</p>
            <button type="button" className="proto-clear-button" onClick={clearFilters}>
              Clear filters
            </button>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.key || "all"} className="proto-promise-group">
              {group.key && (
                <h3 className="proto-group-heading">
                  {group.key} <span>({group.items.length})</span>
                </h3>
              )}
              {group.items.map((promise) => (
                <PromiseCard
                  key={`${promise.dimension}-${promise.text}-${promise.since || "no-date"}`}
                  promise={promise}
                />
              ))}
            </div>
          ))
        )}
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
          hiding the rubric. Nothing here changes grades, thresholds, statuses, scoring, or
          the production scorecard. It reads the live data the public dashboard uses, and
          only the layout and interaction differ.
        </p>
        <h3>The shape it tries</h3>
        <ul className="proto-bullets">
          <li>Overview first: scores, promise tally, and approval up top.</li>
          <li>
            Details one tap away: tap any file to read the verdict, why, what would move it,
            the metrics, the sources, and the rule.
          </li>
          <li>
            Promises stay searchable, sortable, and groupable, with the original-source and
            status-evidence links attached to each row.
          </li>
          <li>The rule stays visible. The grade band and the threshold table are in every file, not buried.</li>
        </ul>
        <h3>What it deliberately keeps</h3>
        <ul className="proto-bullets">
          <li>The methodology is inspectable, the same as the live dashboard.</li>
          <li>Every grade move and promise status traces to a dated source.</li>
          <li>No grade, score, or threshold is computed differently here.</li>
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
          This is a dev-only prototype reached with <code>?prototype=app</code> while running
          the dev server. It does not ship to the public site. The production dashboard is the
          source of record for readers.
        </p>
        <h3>What is built</h3>
        <ul className="proto-bullets">
          <li>
            Scorecard overview with tap-through dimension detail (verdict, why, triggers,
            metrics, sources, rule).
          </li>
          <li>
            Promises tab with search, status and dimension filters, sort, and group views,
            preserving all source and status-evidence links.
          </li>
          <li>
            An app-style shell: tab nav, a mobile bottom bar, sticky filters, and section
            transitions.
          </li>
        </ul>
        <h3>What is not done</h3>
        <ul className="proto-bullets">
          <li>It reuses the production look only loosely. It is an interaction test, not a final visual design.</li>
          <li>No deep links, no per-section anchors, no scroll restore yet.</li>
          <li>It is not wired to anything the public site renders.</li>
        </ul>
        <h3>Cutover conditions</h3>
        <p>
          Promoting any of this to production needs explicit editor sign-off, a parity check
          that no evidence link is lost, and the same review gates the live dashboard uses.
          Until then this stays a prototype lane.
        </p>
      </section>
    </main>
  );
}

export default function DashboardPrototype() {
  const [tab, setTab] = useState("scorecard");
  const [openDimId, setOpenDimId] = useState(null);

  const openDim = openDimId ? dimensions.find((dim) => dim.id === openDimId) : null;

  const selectTab = (next) => {
    setOpenDimId(null);
    setTab(next);
  };

  return (
    <div className="proto-shell">
      <PrototypeHeader tab={tab} setTab={selectTab} detailOpen={!!openDim} />
      <div className="proto-view" key={openDim ? `detail-${openDim.id}` : tab}>
        {openDim ? (
          <DimensionDetailPane dim={openDim} onBack={() => setOpenDimId(null)} />
        ) : tab === "scorecard" ? (
          <ScorecardPane onOpenDim={setOpenDimId} />
        ) : tab === "promises" ? (
          <PromisesPane />
        ) : tab === "method" ? (
          <MethodPane />
        ) : (
          <AboutPane />
        )}
      </div>
      <nav className="proto-bottom-nav" aria-label="Sections">
        {TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={!openDim && tab === item.key ? "is-active" : ""}
            onClick={() => selectTab(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
