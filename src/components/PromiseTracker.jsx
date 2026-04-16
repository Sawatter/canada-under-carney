import { useState } from "react";
import { STATUS_COLORS } from "../constants";

export default function PromiseTracker({ allPromises, promiseCounts }) {
  const [expandedPromise, setExpandedPromise] = useState(null);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        border: "1px solid #e0e0e0",
        overflow: "hidden",
      }}
    >
      {/* Summary bar */}
      <div style={{ display: "flex", gap: "0", borderBottom: "1px solid #e0e0e0" }}>
        {Object.entries(STATUS_COLORS).map(([status, style]) => {
          const count = promiseCounts[status] || 0;
          if (count === 0) return null;
          return (
            <div
              key={status}
              style={{
                flex: count,
                background: style.bg,
                padding: "12px 8px",
                textAlign: "center",
                minWidth: "60px",
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
      {["Delivered", "In Progress", "Stalled", "Abandoned", "Thwarted", "Unclear", "Too Early"].map(
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
              {items.map((p, i) => {
                const key = `${status}-${i}`;
                const isOpen = expandedPromise === key;
                return (
                  <div
                    key={key}
                    onClick={() => setExpandedPromise(isOpen ? null : key)}
                    style={{
                      padding: "8px 16px",
                      borderBottom: "1px solid #f5f5f5",
                      cursor: p.evidence ? "pointer" : "default",
                      background: isOpen ? "#fafafa" : "transparent",
                      transition: "background 0.15s",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <span style={{ fontSize: "13px", color: "#333", flex: 1 }}>
                        {p.text}
                        {p.evidence && (
                          <span style={{ fontSize: "10px", color: "#bbb", marginLeft: "6px" }}>
                            {isOpen ? "\u25B2" : "\u25BC"}
                          </span>
                        )}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
                    </div>
                    {isOpen && p.evidence && (
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          marginTop: "6px",
                          paddingLeft: "10px",
                          borderLeft: `2px solid ${s.color}40`,
                          lineHeight: 1.5,
                        }}
                      >
                        {p.evidence}
                        {p.since && (
                          <div style={{ fontSize: "10px", color: "#aaa", marginTop: "4px" }}>
                            Status since: {p.since}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        }
      )}
    </div>
  );
}
