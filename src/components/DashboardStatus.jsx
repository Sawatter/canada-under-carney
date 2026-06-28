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
    </section>
  );
}
