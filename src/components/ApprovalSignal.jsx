import data from "../data/approval-polls.json";

const DAY_MS = 1000 * 60 * 60 * 24;

// Tunables read from the data file so the published methodology and the math
// stay in sync. Fallbacks match the documented defaults.
const HALF_LIFE_DAYS = data.halfLifeDays || 30;
const HE_MIN_POLLS = (data.houseEffect && data.houseEffect.minPolls) || 3;
const HE_NEIGHBORHOOD_DAYS =
  (data.houseEffect && data.houseEffect.neighborhoodDays) || 45;

function mean(values) {
  const nums = values.filter((v) => typeof v === "number");
  if (nums.length === 0) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

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

// Exponential recency weight: a poll loses half its weight every
// HALF_LIFE_DAYS, measured from a window's reference (newest) date.
function recencyWeight(poll, refDate) {
  const ageDays =
    (refDate.getTime() - new Date(poll.fieldEnd).getTime()) / DAY_MS;
  if (!(ageDays >= 0)) return 1; // at/after the reference keeps full weight
  return Math.pow(0.5, ageDays / HALF_LIFE_DAYS);
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

// Signed one-decimal offset for the house-effect table.
function formatOffset(v) {
  if (v == null) return "—";
  const r = Math.round(v * 10) / 10;
  return r > 0 ? `+${r.toFixed(1)}` : r.toFixed(1);
}

function filterByWindow(polls, windowEnd, windowStart) {
  return polls.filter((p) => {
    const end = new Date(p.fieldEnd);
    return end > windowStart && end <= windowEnd;
  });
}

// Leave-one-pollster-out contemporaneous baseline for one poll and field
// ("approve" | "disapprove"). Averages OTHER pollsters' polls within
// HE_NEIGHBORHOOD_DAYS, giving each other pollster equal weight so the most
// frequent pollster cannot define its own baseline. Null if no comparison.
function leaveOneOutBaseline(target, allPolls, field) {
  const t = new Date(target.fieldEnd).getTime();
  const byPollster = {};
  for (const p of allPolls) {
    if (p.pollster === target.pollster) continue;
    if (typeof p[field] !== "number") continue;
    const age = Math.abs(new Date(p.fieldEnd).getTime() - t) / DAY_MS;
    if (age > HE_NEIGHBORHOOD_DAYS) continue;
    (byPollster[p.pollster] = byPollster[p.pollster] || []).push(p[field]);
  }
  const pollsterMeans = Object.values(byPollster).map((vals) => mean(vals));
  return pollsterMeans.length ? mean(pollsterMeans) : null;
}

// Per-pollster house effect over the full poll set. A firm earns an offset
// only with at least HE_MIN_POLLS computable deviations; otherwise it is
// neutral (zero). Offsets are deviations from the contemporaneous field, so
// subtracting them de-houses each firm toward cross-pollster consensus.
function computeHouseEffects(allPolls) {
  const byPollster = {};
  for (const p of allPolls) {
    (byPollster[p.pollster] = byPollster[p.pollster] || []).push(p);
  }
  const effects = {};
  for (const [pollster, polls] of Object.entries(byPollster)) {
    const devA = [];
    const devD = [];
    for (const p of polls) {
      const baseA = leaveOneOutBaseline(p, allPolls, "approve");
      const baseD = leaveOneOutBaseline(p, allPolls, "disapprove");
      if (baseA != null && typeof p.approve === "number")
        devA.push(p.approve - baseA);
      if (baseD != null && typeof p.disapprove === "number")
        devD.push(p.disapprove - baseD);
    }
    const approveApplied = devA.length >= HE_MIN_POLLS;
    const disapproveApplied = devD.length >= HE_MIN_POLLS;
    effects[pollster] = {
      pollster,
      n: polls.length,
      nComparable: devA.length,
      approveApplied,
      disapproveApplied,
      approve: approveApplied ? mean(devA) : 0,
      disapprove: disapproveApplied ? mean(devD) : 0,
    };
  }
  return effects;
}

function adjustedValue(poll, field, effects) {
  const e = effects[poll.pollster];
  // Each field's offset is already 0 when that field is below the poll-count
  // threshold (see computeHouseEffects), so the approve and disapprove
  // corrections apply independently rather than being coupled by one flag.
  const offset = e ? e[field] || 0 : 0;
  return typeof poll[field] === "number" ? poll[field] - offset : null;
}

// De-housed, recency-and-sample-weighted mean for one field over a poll set.
function adjustedWeightedMean(polls, field, effects, refDate) {
  const values = polls.map((p) => adjustedValue(p, field, effects));
  const weights = polls.map(
    (p) => (p.sampleSize || 0) * recencyWeight(p, refDate)
  );
  return weightedMean(values, weights);
}

// Shared compute helper — both the card and the drilldown call this so the
// displayed numbers are guaranteed consistent. The aggregate weights each poll
// by sample size and by recency (HALF_LIFE_DAYS half-life), and subtracts each
// firm's house effect before averaging.
function computeApproval() {
  const asOf = new Date(data.asOf);
  const windowDays = data.rollingWindowDays;
  const recentStart = new Date(asOf);
  recentStart.setDate(recentStart.getDate() - windowDays);
  const priorStart = new Date(recentStart);
  priorStart.setDate(priorStart.getDate() - windowDays);

  const recent = filterByWindow(data.polls, asOf, recentStart);
  const prior = filterByWindow(data.polls, recentStart, priorStart);

  const effects = computeHouseEffects(data.polls);

  const approveNow = adjustedWeightedMean(recent, "approve", effects, asOf);
  const disapproveNow = adjustedWeightedMean(recent, "disapprove", effects, asOf);
  const approvePrior = adjustedWeightedMean(prior, "approve", effects, recentStart);
  const disapprovePrior = adjustedWeightedMean(prior, "disapprove", effects, recentStart);

  const net =
    approveNow !== null && disapproveNow !== null
      ? Math.round(approveNow - disapproveNow)
      : null;

  const approveDelta = formatDelta(approveNow, approvePrior);
  const disapproveDelta = formatDelta(disapproveNow, disapprovePrior);

  const pollstersInWindow = Array.from(new Set(recent.map((p) => p.pollster)));

  // House-effect rows (all firms, most-polled first) for the drilldown table.
  const houseEffectRows = Object.values(effects).sort((a, b) => b.n - a.n);

  return {
    asOf: data.asOf,
    windowDays,
    halfLifeDays: HALF_LIFE_DAYS,
    minPolls: HE_MIN_POLLS,
    approveNow,
    disapproveNow,
    net,
    approveDelta,
    disapproveDelta,
    recent,
    pollstersInWindow,
    houseEffectRows,
  };
}

const DETAIL_ID = "approval-signal-detail";

// Compact card for the scoreboard row. Accepts shared style props from
// ScoreboardHeader so its container, title, subtitle, and caption all match
// the three grade cards exactly.
export function ApprovalCard({
  expanded,
  onToggle,
  cardClassName = "",
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
      className={`scoreboard-card ${cardClassName}`.trim()}
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
        border: "1.5px dashed #9ab8d8",
        background: "#f7fbff",
      }}
    >
      {/* QW5: External-signal label */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          fontSize: "11px",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          color: "#2d6a9f",
          background: "#ddeeff",
          border: "1px solid #9ab8d8",
          borderRadius: "999px",
          padding: "2px 8px",
          marginBottom: "6px",
        }}
      >
        External signal · Ungraded
      </div>
      <div className="scoreboard-card-title" style={titleStyle}>Approval Signal</div>
      <div className="scoreboard-card-subtitle" style={subtitleStyle}>
        Public approval of PM Carney. Not part of the grades.
      </div>
      <div
        className="scoreboard-card-main"
        style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
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
              color: "#666",
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
        <div style={{ fontSize: "13px", color: "#555", marginTop: "4px", fontWeight: 500 }}>
          {s.recent.length} polls &middot; {s.windowDays}-day avg
        </div>
      </div>
      {/* Footer slot: matches the derivation toggles on the two grade cards
          so all four scoreboard cards land their action affordance at the
          same y-position. */}
      <div className="scoreboard-card-footer">
        <span
          style={{
            fontSize: "13px",
            color: "#1a73e8",
            fontWeight: 700,
          }}
        >
          {expanded ? "\u25BE Hide poll details" : "\u25B8 See polls & sources"}
        </span>
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
          Approval Signal &mdash; drill-down
        </div>
        <div style={{ fontSize: "13px", color: "#666" }}>
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
          <span style={{ marginLeft: "6px", fontSize: "13px", color: "#777" }}>
            approve
          </span>
          {s.approveDelta && (
            <span style={{ marginLeft: "6px", fontSize: "14px", color: "#666" }}>
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
          <span style={{ marginLeft: "6px", fontSize: "13px", color: "#777" }}>
            disapprove
          </span>
          {s.disapproveDelta && (
            <span style={{ marginLeft: "6px", fontSize: "14px", color: "#666" }}>
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
          fontSize: "14px",
          color: "#777",
          lineHeight: 1.5,
          marginBottom: "10px",
        }}
      >
        {s.recent.length} polls in window ({s.pollstersInWindow.join(", ")}).
        The average weights each poll by sample size and by recency, on a{" "}
        {s.halfLifeDays}-day half-life, so a poll loses half its weight every{" "}
        {s.halfLifeDays} days. It also corrects for house effects, subtracting
        each firm's standing lean versus other firms polling the same weeks, for
        firms with at least {s.minPolls} polls on record (table below). Tracked
        as an ungraded signal so popularity does not feed the 11-dimension
        performance grades.
      </div>

      <div style={{ marginTop: "12px" }}>
        <div
          style={{
            fontSize: "14px",
            color: "#666",
            marginBottom: "6px",
            lineHeight: 1.5,
          }}
        >
          House-effect correction. Each firm's standing lean versus other firms
          polling the same weeks, subtracted from that firm's polls before the
          average. Firms with fewer than {s.minPolls} polls on record are left
          neutral. A positive lean means the firm runs higher than the field on
          that measure.
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
                <th style={{ padding: "4px 6px", fontWeight: 700 }}>Polls</th>
                <th style={{ padding: "4px 6px", fontWeight: 700 }}>
                  Approve lean
                </th>
                <th style={{ padding: "4px 6px", fontWeight: 700 }}>
                  Disapprove lean
                </th>
                <th style={{ padding: "4px 6px", fontWeight: 700 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {s.houseEffectRows.map((h, i) => (
                <tr
                  key={i}
                  style={{ borderTop: "1px solid #eee", color: "#444" }}
                >
                  <td style={{ padding: "4px 6px" }}>{h.pollster}</td>
                  <td style={{ padding: "4px 6px", color: "#777" }}>{h.n}</td>
                  <td style={{ padding: "4px 6px", fontWeight: 700 }}>
                    {h.approveApplied ? formatOffset(h.approve) : "—"}
                  </td>
                  <td style={{ padding: "4px 6px", fontWeight: 700 }}>
                    {h.disapproveApplied ? formatOffset(h.disapprove) : "—"}
                  </td>
                  <td style={{ padding: "4px 6px", color: "#777" }}>
                    {h.approveApplied && h.disapproveApplied
                      ? "applied"
                      : h.approveApplied || h.disapproveApplied
                        ? "partial"
                        : `neutral (n<${s.minPolls})`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
            fontSize: "14px",
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
