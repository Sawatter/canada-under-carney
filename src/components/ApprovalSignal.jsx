import { useState } from "react";
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

export default function ApprovalSignal() {
  const [expanded, setExpanded] = useState(false);

  const asOf = new Date(data.asOf);
  const windowDays = data.rollingWindowDays;

  const recentStart = new Date(asOf);
  recentStart.setDate(recentStart.getDate() - windowDays);
  const priorStart = new Date(recentStart);
  priorStart.setDate(priorStart.getDate() - windowDays);

  const recent = filterByWindow(data.polls, asOf, recentStart);
  const prior = filterByWindow(data.polls, recentStart, priorStart);

  // Sample-size weighted mean: a poll of n=2,000 carries twice the weight of
  // one at n=1,000. This is the standard "inverse-variance-approximating"
  // weighting for equal-methodology polls; house effects across CRIC members
  // are small enough for this to be defensible without explicit de-housing.
  const recentWeights = recent.map((p) => p.sampleSize || 0);
  const priorWeights = prior.map((p) => p.sampleSize || 0);
  const approveNow = weightedMean(recent.map((p) => p.approve), recentWeights);
  const disapproveNow = weightedMean(recent.map((p) => p.disapprove), recentWeights);
  const approvePrior = weightedMean(prior.map((p) => p.approve), priorWeights);
  const disapprovePrior = weightedMean(prior.map((p) => p.disapprove), priorWeights);

  const net = approveNow !== null && disapproveNow !== null
    ? Math.round(approveNow - disapproveNow)
    : null;

  const approveDelta = formatDelta(approveNow, approvePrior);
  const disapproveDelta = formatDelta(disapproveNow, disapprovePrior);

  const pollstersInWindow = Array.from(new Set(recent.map((p) => p.pollster)));
  const regionId = "approval-signal-detail";

  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setExpanded(!expanded);
    }
  };

  return (
    <div
      style={{
        background: "#fafafa",
        border: "1px dashed #c8c8c8",
        borderRadius: "10px",
        padding: "12px 16px",
        marginBottom: "16px",
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
        }}
      >
        <div
          style={{
            fontSize: "10px",
            fontWeight: 700,
            color: "#888",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Approval Signal &middot; Not part of the scorecard
        </div>
        <div style={{ fontSize: "11px", color: "#999" }}>
          {windowDays}-day rolling avg &middot; as of {data.asOf}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          flexWrap: "wrap",
          gap: "16px",
          marginTop: "6px",
        }}
      >
        <div>
          <span
            className="approval-stat-number"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "22px",
              fontWeight: 700,
              color: "#1a7a3a",
            }}
          >
            {formatPct(approveNow)}
          </span>
          <span style={{ marginLeft: "6px", fontSize: "12px", color: "#777" }}>
            approve
          </span>
          {approveDelta && (
            <span style={{ marginLeft: "6px", fontSize: "11px", color: "#999" }}>
              ({approveDelta} vs prior {windowDays}d)
            </span>
          )}
        </div>

        <div>
          <span
            className="approval-stat-number"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "22px",
              fontWeight: 700,
              color: "#c62828",
            }}
          >
            {formatPct(disapproveNow)}
          </span>
          <span style={{ marginLeft: "6px", fontSize: "12px", color: "#777" }}>
            disapprove
          </span>

          {disapproveDelta && (
            <span style={{ marginLeft: "6px", fontSize: "11px", color: "#999" }}>
              ({disapproveDelta} vs prior {windowDays}d)
            </span>
          )}
        </div>

        {net !== null && (
          <div>
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "16px",
                fontWeight: 700,
                color: net >= 0 ? "#1a7a3a" : "#c62828",
              }}
            >
              Net {net >= 0 ? `+${net}` : net}
            </span>
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: "6px",
          fontSize: "11px",
          color: "#777",
          lineHeight: 1.5,
        }}
      >
        {recent.length} polls in window ({pollstersInWindow.join(", ")}).
        Sample-size-weighted mean: a poll of n=2,000 counts twice a poll of
        n=1,000. Tracked as an ungraded signal so popularity does not
        contaminate the 11-dimension performance grades.
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded(!expanded)}
        onKeyDown={handleKey}
        aria-expanded={expanded}
        aria-controls={regionId}
        style={{
          marginTop: "8px",
          minHeight: "24px",
          padding: "4px 0",
          display: "inline-block",
          fontSize: "11px",
          color: "#1a73e8",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        {expanded ? "\u25BC Hide underlying polls" : "\u25B6 Show underlying polls"}
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
              fontSize: "11px",
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

      {expanded && (
        <div
          id={regionId}
          role="region"
          style={{
            marginTop: "8px",
            borderTop: "1px solid #e0e0e0",
            paddingTop: "8px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "#666",
              marginBottom: "6px",
              lineHeight: 1.5,
            }}
          >
            All polls in the {windowDays}-day window. Older polls in the file
            are retained for historical trend but not included in the current
            aggregate.
          </div>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "11px",
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
                {recent
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
      )}
    </div>
  );
}
