import data from "../data/approval-polls.json";

function weightedMean(values, weights) {
  if (values.length === 0) return null;
  let num = 0;
  let den = 0;
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    const w = weights[i];
    if (typeof v !== "number" || typeof w !== "number" || w <= 0) continue;
    num += v * w;
    den += w;
  }
  return den > 0 ? num / den : null;
}

function formatPct(v) {
  return v === null ? "—" : `${Math.round(v)}%`;
}

function formatDelta(curr, prior) {
  if (curr === null || prior === null) return null;
  const d = curr - prior;
  const rounded = Math.round(d);
  if (rounded === 0) return "no change";
  return rounded > 0 ? `+${rounded}` : `${rounded}`;
}

function filterByWindow(polls, windowEnd, windowStart) {
  return polls.filter((p) => {
    const end = new Date(p.fieldEnd);
    return end > windowStart && end <= windowEnd;
  });
}

// Shared compute helper — both the card and the drilldown call this so the
// displayed numbers are guaranteed consistent.
function computeApproval() {
  const asOf = new Date(data.asOf);
  const windowDays = data.rollingWindowDays;
  const recentStart = new Date(asOf);
  recentStart.setDate(recentStart.getDate() - windowDays);
  const priorStart = new Date(recentStart);
  priorStart.setDate(priorStart.getDate() - windowDays);

  const recent = filterByWindow(data.polls, asOf, recentStart);
  const prior = filterByWindow(data.polls, recentStart, priorStart);

  const recentWeights = recent.map((p) => p.sampleSize || 0);
  const priorWeights = prior.map((p) => p.sampleSize || 0);

  const approveNow = weightedMean(recent.map((p) => p.approve), recentWeights);
  const disapproveNow = weightedMean(recent.map((p) => p.disapprove), recentWeights);
  const approvePrior = weightedMean(prior.map((p) => p.approve), priorWeights);
  const disapprovePrior = weightedMean(prior.map((p) => p.disapprove), priorWeights);

  const net =
    approveNow !== null && disapproveNow !== null
      ? Math.round(approveNow - disapproveNow)
      : null;

  const approveDelta = formatDelta(approveNow, approvePrior);
  const disapproveDelta = formatDelta(disapproveNow, disapprovePrior);

  const pollstersInWindow = Array.from(new Set(recent.map((p) => p.pollster)));

  return {
    asOf: data.asOf,
    windowDays,
    approveNow,
    disapproveNow,
    net,
    approveDelta,
    disapproveDelta,
    recent,
    pollstersInWindow,
  };
}

const DETAIL_ID = "approval-signal-detail";

// Compact card for the scoreboard row. Accepts shared style props from
// ScoreboardHeader so its container, title, subtitle, and caption all match
// the three grade cards exactly.
export function ApprovalCard({
  expanded,
  onToggle,
  cardStyle,
  titleStyle,
  subtitleStyle,
  captionStyle,
}) {
  const s = computeApproval();

  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  };

  const netText =
    s.net == null ? "—" : s.net >= 0 ? `Net +${s.net}` : `Net ${s.net}`;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      aria-controls={DETAIL_ID}
      onClick={onToggle}
      onKeyDown={handleKey}
      style={{
        ...cardStyle,
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <div style={titleStyle}>Approval Signal</div>
      <div style={subtitleStyle}>
        Public approval of PM Carney. Not part of the grades.
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div>
          <span
            className="approval-stat-number"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "32px",
              fontWeight: 800,
              color: "#1a7a3a",
              lineHeight: 1.1,
            }}
          >
            {formatPct(s.approveNow)}
          </span>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "18px",
              fontWeight: 700,
              color: "#888",
              marginLeft: "6px",
            }}
          >
            / {formatPct(s.disapproveNow)}
          </span>
        </div>
        <div
          style={{
            ...captionStyle,
            color: s.net != null && s.net >= 0 ? "#1a7a3a" : "#c62828",
          }}
        >
          {netText}
        </div>
        <div style={{ fontSize: "12px", color: "#555", marginTop: "4px", fontWeight: 500 }}>
          {s.recent.length} polls &middot; {s.windowDays}-day avg
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "#1a73e8",
            marginTop: "8px",
            fontWeight: 700,
          }}
        >
          {expanded ? "\u25B2 Hide poll details" : "\u25BC See polls & sources"}
        </div>
      </div>
    </div>
  );
}

// Drilldown panel — lives below the scoreboard row, visible only when the
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
        fontSize: "12px",
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
            fontSize: "13px",
            fontWeight: 700,
            color: "#333",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Approval Signal &mdash; drill-down
        </div>
        <div style={{ fontSize: "12px", color: "#999" }}>
          {s.windowDays}-day rolling avg &middot; as of {s.asOf}
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
          <span style={{ marginLeft: "6px", fontSize: "12px", color: "#777" }}>
            approve
          </span>
          {s.approveDelta && (
            <span style={{ marginLeft: "6px", fontSize: "13px", color: "#999" }}>
              ({s.approveDelta} vs prior {s.windowDays}d)
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
          <span style={{ marginLeft: "6px", fontSize: "12px", color: "#777" }}>
            disapprove
          </span>
          {s.disapproveDelta && (
            <span style={{ marginLeft: "6px", fontSize: "13px", color: "#999" }}>
              ({s.disapproveDelta} vs prior {s.windowDays}d)
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
          fontSize: "13px",
          color: "#777",
          lineHeight: 1.5,
          marginBottom: "10px",
        }}
      >
        {s.recent.length} polls in window ({s.pollstersInWindow.join(", ")}).
        Sample-size-weighted mean: a poll of n=2,000 counts twice a poll of
        n=1,000. Tracked as an ungraded signal so popularity does not
        contaminate the 11-dimension performance grades.
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
              fontSize: "13px",
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
              <span style={{ color: "#999" }}>
                {" "}
                (prior week: {prev.carney}% / {prev.poilievre}%)
              </span>
            )}
            . Different construct from approval above &mdash; a best-choice
            question, not approve/disapprove. Shown as secondary context; not
            averaged into the approval mean.
          </div>
        );
      })()}

      <div style={{ marginTop: "12px" }}>
        <div
          style={{
            fontSize: "13px",
            color: "#666",
            marginBottom: "6px",
            lineHeight: 1.5,
          }}
        >
          All polls in the {s.windowDays}-day window. Older polls in the file
          are retained for historical trend but not included in the current
          aggregate.
        </div>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13px",
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
                      {p.fieldStart}&nbsp;&ndash;&nbsp;{p.fieldEnd}
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
                        style={{ color: "#1a73e8" }}
                      >
                        link &rarr;
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
