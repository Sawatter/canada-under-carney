import data from "../data/approval-polls.json";
import { computeApprovalSignal } from "../approvalAggregation";

function formatPct(v) {
  return v === null ? "n/a" : `${Math.round(v)}%`;
}

// Shared compute helper. Both the card and the drilldown call this so the
// displayed numbers stay consistent. The aggregate weights each poll by sample
// size and by recency (HALF_LIFE_DAYS half-life), within the rolling window.
function computeApproval() {
  return computeApprovalSignal(data);
}

const DETAIL_ID = "approval-signal-detail";

export function ApprovalCard({
  expanded,
  onToggle,
  cardClassName = "",
}) {
  const s = computeApproval();
  const netText =
    s.net == null ? "Net n/a" : s.net >= 0 ? `Net +${s.net}` : `Net ${s.net}`;
  const netClassName = s.net != null && s.net >= 0
    ? "first-look-value-positive"
    : "first-look-value-negative";
  const actionText = expanded ? "Hide poll details" : "See polls and sources";
  const accessibleLabel = [
    "Approval Signal.",
    "Public opinion outside the grades.",
    `${formatPct(s.approveNow)} approve and ${formatPct(s.disapproveNow)} disapprove.`,
    `${netText}.`,
    `${s.recent.length} polls in the ${s.windowDays}-day average.`,
    actionText,
  ].join(" ");

  return (
    <button
      type="button"
      className={`first-look-signal first-look-signal-approval ${cardClassName}`.trim()}
      aria-expanded={expanded}
      aria-controls={DETAIL_ID}
      onClick={onToggle}
      aria-label={accessibleLabel}
    >
      <span
        className="first-look-signal-title"
      >
        Approval Signal
      </span>
      <span
        className="first-look-signal-description"
      >
        Public opinion outside the grades.
      </span>
      <span className="first-look-approval-result">
        <span className="approval-stat-number first-look-approval-positive">
          {formatPct(s.approveNow)}
        </span>
        <span className="first-look-approval-negative">
          / {formatPct(s.disapproveNow)}
        </span>
      </span>
      <span className={`first-look-signal-score ${netClassName}`}>
        {netText}
      </span>
      <span className="first-look-signal-meta">
          {s.recent.length} polls &middot; {s.windowDays}-day average
      </span>
      <span className="first-look-signal-action">
        {actionText}
      </span>
    </button>
  );
}

// Drilldown panel. Lives below the scoreboard row, visible only when the
// card is toggled open. Carries the full detail the card can't fit:
// delta-vs-prior-window breakdown, Nanos preferred-PM context, and the
// per-poll table with source links.
export function ApprovalDetail() {
  const s = computeApproval();

  return (
    <div
      id={DETAIL_ID}
      role="region"
      style={{
        background: "#fafafa",
        border: "1px dashed #c8c8c8",
        borderRadius: "10px",
        padding: "14px 18px",
        marginTop: "-8px",
        marginBottom: "16px",
        scrollMarginTop: "16px",
        fontSize: "13px",
        color: "#444",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          flexWrap: "wrap",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#333",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Approval Signal detail
        </div>
        <div style={{ fontSize: "13px", color: "#666" }}>
          {s.windowDays}-day rolling average &middot; as of {s.asOf}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "10px",
        }}
      >
        <div>
          <span
            className="approval-stat-number"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "20px",
              fontWeight: 700,
              color: "#1a7a3a",
            }}
          >
            {formatPct(s.approveNow)}
          </span>
          <span style={{ marginLeft: "6px", fontSize: "13px", color: "#777" }}>
            approve
          </span>
          {s.approveDelta && (
            <span style={{ marginLeft: "6px", fontSize: "14px", color: "#666" }}>
              ({s.approveDelta} vs previous {s.windowDays} days)
            </span>
          )}
        </div>
        <div>
          <span
            className="approval-stat-number"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "20px",
              fontWeight: 700,
              color: "#c62828",
            }}
          >
            {formatPct(s.disapproveNow)}
          </span>
          <span style={{ marginLeft: "6px", fontSize: "13px", color: "#777" }}>
            disapprove
          </span>
          {s.disapproveDelta && (
            <span style={{ marginLeft: "6px", fontSize: "14px", color: "#666" }}>
              ({s.disapproveDelta} vs previous {s.windowDays} days)
            </span>
          )}
        </div>
        {s.net !== null && (
          <div>
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "16px",
                fontWeight: 700,
                color: s.net >= 0 ? "#1a7a3a" : "#c62828",
              }}
            >
              Net {s.net >= 0 ? `+${s.net}` : s.net}
            </span>
          </div>
        )}
      </div>

      <div
        style={{
          fontSize: "14px",
          color: "#777",
          lineHeight: 1.5,
          marginBottom: "10px",
        }}
      >
        {s.recent.length} polls are inside the current window:{" "}
        {s.pollstersInWindow.join(", ")}. Bigger and newer polls count more.
        A poll loses half its weight after {s.halfLifeDays} days, and polls
        older than {s.windowDays} days do not count in the current average.
        This stays outside the grades so popularity does not affect the
        performance score.
      </div>

      {data.preferredPM && data.preferredPM.polls && data.preferredPM.polls.length > 0 && (() => {
        const sorted = data.preferredPM.polls
          .slice()
          .sort((a, b) => (a.fieldEnd < b.fieldEnd ? 1 : -1));
        const latest = sorted[0];
        const prev = sorted[1];
        return (
          <div
            style={{
              marginTop: "10px",
              paddingTop: "8px",
              borderTop: "1px dashed #d4d4d4",
              fontSize: "14px",
              color: "#666",
              lineHeight: 1.5,
            }}
          >
            <span style={{ fontWeight: 700, color: "#333" }}>
              Preferred PM (Nanos):
            </span>{" "}
            Carney {latest.carney}% &middot; Poilievre {latest.poilievre}%
            &middot; week ending {latest.fieldEnd}
            {prev && (
              <span style={{ color: "#666" }}>
                {" "}
                (previous week: {prev.carney}% / {prev.poilievre}%)
              </span>
            )}
            . This asks a different question than approval above: best choice,
            not approve or disapprove. It is shown as extra context and is
            not averaged into the approval number.
          </div>
        );
      })()}

      <div style={{ marginTop: "12px" }}>
        <div
          style={{
            fontSize: "14px",
            color: "#666",
            marginBottom: "6px",
            lineHeight: 1.5,
          }}
        >
          All polls in the {s.windowDays}-day window. Older polls are kept for
          the historical trend but are not included in the current average.
        </div>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr style={{ color: "#777", textAlign: "left" }}>
                <th style={{ padding: "4px 6px", fontWeight: 700 }}>Pollster</th>
                <th style={{ padding: "4px 6px", fontWeight: 700 }}>Field</th>
                <th style={{ padding: "4px 6px", fontWeight: 700 }}>N</th>
                <th style={{ padding: "4px 6px", fontWeight: 700 }}>Approve</th>
                <th style={{ padding: "4px 6px", fontWeight: 700 }}>Disapprove</th>
                <th style={{ padding: "4px 6px", fontWeight: 700 }}>Source</th>
              </tr>
            </thead>
            <tbody>
              {s.recent
                .slice()
                .sort((a, b) => (a.fieldEnd < b.fieldEnd ? 1 : -1))
                .map((p, i) => (
                  <tr
                    key={i}
                    style={{ borderTop: "1px solid #eee", color: "#444" }}
                  >
                    <td style={{ padding: "4px 6px" }}>{p.pollster}</td>
                    <td style={{ padding: "4px 6px", color: "#777" }}>
                      {p.fieldStart}&nbsp;-&nbsp;{p.fieldEnd}
                    </td>
                    <td style={{ padding: "4px 6px", color: "#777" }}>
                      {p.sampleSize.toLocaleString()}
                    </td>
                    <td style={{ padding: "4px 6px", fontWeight: 700 }}>
                      {p.approve}%
                    </td>
                    <td style={{ padding: "4px 6px", fontWeight: 700 }}>
                      {p.disapprove}%
                    </td>
                    <td style={{ padding: "4px 6px" }}>
                      <a
                        href={p.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${p.pollster} poll report, fielded ${p.fieldStart} to ${p.fieldEnd}`}
                        style={{ color: "#1a73e8" }}
                      >
                        report
                      </a>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Default export kept for any legacy import site; not currently used by
// Dashboard.jsx, which imports ApprovalCard + ApprovalDetail by name.
export default function ApprovalSignalLegacy() {
  return (
    <>
      <ApprovalCard expanded={true} onToggle={() => {}} />
      <ApprovalDetail />
    </>
  );
}
