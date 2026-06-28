import status from "../data/status.json";

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

function formatNextCheckTiming(check) {
  if (check.date) return formatDate(check.date);
  if (check.dateSource && status[check.dateSource]) return formatDate(status[check.dateSource]);
  return check.timingLabel || "Event-driven";
}

export default function DashboardStatus() {
  const facts = [
    ["Evidence scan", formatDate(status.lastSourceScanAt)],
    ["Next scheduled scan", formatDate(status.nextScheduledSourceScanAt)],
    ["Editor-reviewed score cycle", formatDate(status.lastEditorReviewedScoreCycleAt)],
    ["Coverage through", formatDate(status.coverageThrough)],
    ["Monitor items awaiting review", String(status.watchItemsAwaitingReviewCount)],
  ];

  return (
    <section
      className="dashboard-status"
      aria-labelledby="dashboard-status-heading"
    >
      <div className="dashboard-status-head">
        <h2 id="dashboard-status-heading">Dashboard status</h2>
        <p>Source freshness and score review are tracked separately.</p>
      </div>
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
      {Array.isArray(status.nextChecks) && status.nextChecks.length > 0 && (
        <div className="dashboard-status-next" aria-labelledby="dashboard-status-next-heading">
          <h3 id="dashboard-status-next-heading">Next checks</h3>
          <ul className="dashboard-status-next-list">
            {status.nextChecks.map((check) => (
              <li key={check.id} className="dashboard-status-next-item">
                <div>
                  <strong>{check.label}</strong>
                  <span>{formatNextCheckTiming(check)}</span>
                </div>
                <p>{check.status}</p>
                {check.href && (
                  <a href={check.href} aria-label={`Open check path for ${check.label}`}>
                    Open check path
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
