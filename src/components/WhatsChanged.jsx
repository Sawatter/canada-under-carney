import GradeChip from "./GradeChip";

export default function WhatsChanged({ changelog }) {
  // Show the most recent month's changes
  const latest = changelog[0];
  if (!latest || (!latest.summary && latest.changes.length === 0)) return null;

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        padding: "16px 20px",
        marginBottom: "24px",
        borderLeft: "4px solid #c62828",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#c62828",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          What Changed Since Last Update
        </div>
        <div style={{ fontSize: "11px", color: "#999" }}>{latest.date}</div>
      </div>

      <div
        style={{
          fontSize: "13px",
          color: "#333",
          fontWeight: 500,
          marginBottom: latest.changes.length > 0 ? "10px" : "0",
        }}
      >
        {latest.summary}
      </div>

      {latest.changes.map((c, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "4px 0",
            fontSize: "12px",
            color: "#555",
          }}
        >
          {/* Grade change: show before → after chips */}
          {c.type === "grade_change" && (
            <>
              <GradeChip grade={c.from} size="sm" />
              <span style={{ color: "#999" }}>&rarr;</span>
              <GradeChip grade={c.to} size="sm" />
              <span>{c.reason}</span>
            </>
          )}

          {/* Metric update */}
          {c.type === "metric_update" && (
            <span>
              <strong>{c.metric}:</strong> {c.from} &rarr; {c.to} &mdash;{" "}
              {c.reason}
            </span>
          )}

          {/* Generic event or launch */}
          {(c.type === "event" || c.type === "launch") && (
            <span>{c.text}</span>
          )}
        </div>
      ))}
    </div>
  );
}
