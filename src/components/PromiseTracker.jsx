import { STATUS_COLORS } from "../constants";
import PromiseTag from "./PromiseTag";

export default function PromiseTracker({ allPromises, promiseCounts, totalPromises }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        border: "1px solid #e0e0e0",
        overflow: "hidden",
      }}
    >
      {/* Summary bar — proportional width per status */}
      <div style={{ display: "flex", gap: "0", borderBottom: "1px solid #e0e0e0" }}>
        {Object.entries(STATUS_COLORS).map(([status, style]) => {
          const count = promiseCounts[status] || 0;
          return (
            <div
              key={status}
              style={{
                flex: count,
                background: style.bg,
                padding: "12px 8px",
                textAlign: "center",
                minWidth: count > 0 ? "60px" : "0",
              }}
            >
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: style.color,
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {count}
              </div>
              <div style={{ fontSize: "10px", color: style.color, fontWeight: 600 }}>
                {status}
              </div>
            </div>
          );
        })}
      </div>

      {/* Promise list grouped by status */}
      {["Delivered", "In Progress", "Stalled", "Abandoned", "Too Early"].map(
        (status) => {
          const items = allPromises.filter((p) => p.status === status);
          if (items.length === 0) return null;
          const s = STATUS_COLORS[status];
          return (
            <div key={status}>
              <div
                style={{
                  padding: "12px 16px 4px",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: s.color,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  background: s.bg + "44",
                }}
              >
                {s.label} ({items.length})
              </div>
              {items.map((p, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 16px",
                    borderBottom: "1px solid #f5f5f5",
                    gap: "12px",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#333" }}>{p.text}</span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#999",
                      whiteSpace: "nowrap",
                      fontStyle: "italic",
                    }}
                  >
                    {p.dimension}
                  </span>
                </div>
              ))}
            </div>
          );
        }
      )}
    </div>
  );
}
