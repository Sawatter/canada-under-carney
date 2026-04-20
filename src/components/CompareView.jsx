import { useState } from "react";
import dimensions from "../data/dimensions.json";
import { GRADES } from "../constants";
import GradeChip from "./GradeChip";
import TrendArrow from "./TrendArrow";
import PromiseTag from "./PromiseTag";

function DimColumn({ dim }) {
  const g = GRADES[dim.grade];
  const subScoreSummary = dim.subScores
    ? Object.values(dim.subScores)
        .map((score) => `${score.label} ${score.grade}`)
        .join(" · ")
    : null;

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      {/* Grade header */}
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <GradeChip grade={dim.grade} size="lg" />
        {subScoreSummary && (
          <div style={{ marginTop: "8px", fontSize: "13px", color: "#666", fontWeight: 600 }}>
            {subScoreSummary}
          </div>
        )}
        <div style={{ marginTop: "6px" }}>
          <TrendArrow trend={dim.trend} />
          {dim.previousGrade && (
            <span style={{ fontSize: "12px", color: "#c62828", marginLeft: "4px" }}>
              was {dim.previousGrade}
            </span>
          )}
        </div>
      </div>

      {/* Status */}
      <div
        style={{
          fontSize: "12px",
          color: "#555",
          lineHeight: 1.5,
          marginBottom: "14px",
          background: "#fafafa",
          padding: "10px",
          borderRadius: "6px",
          borderLeft: `3px solid ${g.color}`,
        }}
      >
        {dim.rationale || dim.status}
      </div>

      {/* Metrics */}
      <div style={{ marginBottom: "14px" }}>
        <div style={{ fontSize: "13px", fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
          Metrics
        </div>
        {dim.metrics.map((m, i) => (
          <div key={i} style={{ fontSize: "12px", color: "#444", padding: "2px 0", fontFamily: "'DM Mono', monospace" }}>
            {m.label}: {m.value}
          </div>
        ))}
      </div>

      {/* Promises */}
      <div>
        <div style={{ fontSize: "13px", fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
          Promises ({dim.promises.length})
        </div>
        {dim.promises.map((p, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", gap: "6px" }}>
            <span style={{ fontSize: "13px", color: "#444", flex: 1 }}>{p.text}</span>
            <PromiseTag status={p.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CompareView() {
  // CompareView stays focused on the 11 graded dimensions; Promise Delivery
  // remains visible elsewhere as a separate tracker and is not part of GPA comparison.
  const comparableDimensions = dimensions.filter((d) => !d.excludeFromGPA);
  const [leftId, setLeftId] = useState(comparableDimensions[0].id);
  const [rightId, setRightId] = useState(comparableDimensions[3].id);

  const left = comparableDimensions.find((d) => d.id === leftId) || comparableDimensions[0];
  const right = comparableDimensions.find((d) => d.id === rightId) || comparableDimensions[3];

  const selectStyle = {
    padding: "8px 12px",
    fontSize: "13px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    background: "#fff",
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    flex: 1,
    minWidth: 0,
  };

  return (
    <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e0e0e0", padding: "24px" }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "22px", margin: "0 0 16px", color: "#1a1a1a" }}>
        Compare Dimensions
      </h2>
      <p style={{ fontSize: "12px", color: "#888", marginBottom: "16px" }}>
        Select two graded policy dimensions to compare side by side.
      </p>

      {/* Selectors */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
        <select value={leftId} onChange={(e) => setLeftId(e.target.value)} style={selectStyle}>
          {comparableDimensions.map((d) => (
            <option key={d.id} value={d.id}>{d.name} ({d.grade})</option>
          ))}
        </select>
        <span style={{ fontSize: "14px", color: "#999", alignSelf: "center", fontWeight: 700 }}>vs</span>
        <select value={rightId} onChange={(e) => setRightId(e.target.value)} style={selectStyle}>
          {comparableDimensions.map((d) => (
            <option key={d.id} value={d.id}>{d.name} ({d.grade})</option>
          ))}
        </select>
      </div>

      {/* Comparison columns */}
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        <DimColumn dim={left} />
        <div style={{ width: "1px", background: "#e0e0e0", alignSelf: "stretch", flexShrink: 0 }} />
        <DimColumn dim={right} />
      </div>
    </div>
  );
}
