import { useState } from "react";
import GradeChip from "./GradeChip";

// Type chip styles — text-only, one per type, following research synthesis:
// text chips (not icons) read better and don't require redundant labelling.
const CHIP_STYLES = {
  grade:   { label: "GRADE",   bg: "#eef2ff", text: "#3730a3", border: "#c7d2fe" },
  event:   { label: "EVENT",   bg: "#fff7ed", text: "#9a3412", border: "#fed7aa" },
  product: { label: "PRODUCT", bg: "#ecfdf5", text: "#065f46", border: "#a7f3d0" },
  method:  { label: "METHOD",  bg: "#f5f3ff", text: "#5b21b6", border: "#ddd6fe" },
};

const FILTERS = [
  { key: "all",      label: "All" },
  { key: "grade",    label: "Grades" },
  { key: "event",    label: "Events" },
  { key: "product",  label: "Product" },
];

function Chip({ type }) {
  const s = CHIP_STYLES[type];
  if (!s) return null;
  return (
    <span
      aria-label={`Type: ${s.label}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.6px",
        padding: "3px 8px",
        borderRadius: "999px",
        background: s.bg,
        color: s.text,
        border: `1px solid ${s.border}`,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        height: "22px",
        lineHeight: 1,
      }}
    >
      {s.label}
    </span>
  );
}

function GradeItem({ item }) {
  const dir = gradeDelta(item.from, item.to);
  const deltaColor = dir < 0 ? "#c62828" : dir > 0 ? "#1a7a3a" : "#555";
  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
      <div style={{ paddingTop: "2px" }}>
        <Chip type="grade" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "15px", fontWeight: 700, color: "#1a1a1a", marginBottom: "4px", lineHeight: 1.35 }}>
          {item.dimensionName || "Graded dimension"}{" "}
          <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>
            <GradeChip grade={item.from} size="sm" />
            <span style={{ margin: "0 6px", color: "#666" }}>→</span>
            <GradeChip grade={item.to} size="sm" />
          </span>
          {item.deltaLabel && (
            <span style={{
              fontSize: "12px",
              fontWeight: 700,
              color: deltaColor,
              marginLeft: "8px",
              padding: "2px 6px",
              borderRadius: "4px",
              background: dir < 0 ? "#fdecea" : dir > 0 ? "#e8f5ee" : "#f0f0f0",
            }}>
              {item.deltaLabel}
            </span>
          )}
        </div>
        {item.body && (
          <div style={{ fontSize: "14px", color: "#333", lineHeight: 1.5 }}>
            {item.body}
          </div>
        )}
        {item.drivers && item.drivers.length > 0 && (
          <ul style={{
            margin: "6px 0 0 0",
            paddingLeft: "18px",
            fontSize: "13px",
            color: "#444",
            lineHeight: 1.5,
          }}>
            {item.drivers.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
        )}
        {item.link && (
          <div style={{ marginTop: "6px", fontSize: "13px" }}>
            <a href={item.link.href} style={{ color: "#1a73e8" }}>
              {item.link.label} →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function StandardItem({ item, chipType }) {
  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
      <div style={{ paddingTop: "2px" }}>
        <Chip type={chipType} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "15px", fontWeight: 700, color: "#1a1a1a", marginBottom: "4px", lineHeight: 1.35 }}>
          {item.headline}
        </div>
        {item.body && (
          <div style={{ fontSize: "14px", color: "#333", lineHeight: 1.5 }}>
            {item.body}
          </div>
        )}
        {item.affects && item.affects.length > 0 && (
          <div style={{ marginTop: "4px", fontSize: "13px", color: "#555" }}>
            <strong style={{ color: "#333" }}>Affects:</strong>{" "}
            {item.affects.join(", ")}
          </div>
        )}
        {item.link && (
          <div style={{ marginTop: "6px", fontSize: "13px" }}>
            <a
              href={item.link.href}
              target={item.link.href.startsWith("http") ? "_blank" : undefined}
              rel={item.link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              style={{ color: "#1a73e8" }}
            >
              {item.link.label} →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function gradeDelta(from, to) {
  const rank = (g) => {
    const order = ["F","D-","D","D+","C-","C","C+","B-","B","B+","A-","A","A+"];
    const idx = order.indexOf(g);
    return idx === -1 ? 0 : idx;
  };
  return rank(to) - rank(from);
}

function GroupSection({ title, children }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <div style={{
        fontSize: "12px",
        fontWeight: 700,
        color: "#555",
        textTransform: "uppercase",
        letterSpacing: "0.8px",
        marginBottom: "10px",
      }}>
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {children}
      </div>
    </div>
  );
}

export default function WhatsChanged({ changelog }) {
  const [filter, setFilter] = useState("all");
  const [minorOpen, setMinorOpen] = useState(false);

  const latest = changelog[0];
  if (!latest) return null;
  const items = latest.items || [];

  const filterMatch = (t) => {
    if (filter === "all") return true;
    if (filter === "product") return t === "product" || t === "method";
    return t === filter;
  };

  const grouped = {
    grade:   items.filter(i => i.type === "grade"   && filterMatch("grade")),
    event:   items.filter(i => i.type === "event"   && filterMatch("event")),
    product: items.filter(i => (i.type === "product" || i.type === "method") && filterMatch("product")),
    minor:   items.filter(i => i.type === "minor"),
  };

  const totalVisible =
    grouped.grade.length + grouped.event.length +
    grouped.product.length + (minorOpen ? grouped.minor.length : 0);

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        padding: "18px 22px",
        marginBottom: "24px",
        borderLeft: "4px solid #c62828",
        maxWidth: "720px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      {/* Header */}
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
            color: "#c62828",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          What changed since last update
        </div>
        <div style={{ fontSize: "13px", color: "#666" }}>
          Last updated {latest.date}
        </div>
      </div>

      {/* Summary */}
      {latest.summary && (
        <div
          style={{
            fontSize: "15px",
            color: "#333",
            fontWeight: 500,
            lineHeight: 1.5,
            marginBottom: "16px",
          }}
        >
          {latest.summary}
        </div>
      )}

      {/* Filter chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "18px" }}>
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            aria-pressed={filter === f.key}
            style={{
              fontSize: "13px",
              fontWeight: filter === f.key ? 700 : 500,
              padding: "6px 12px",
              borderRadius: "999px",
              border: `1px solid ${filter === f.key ? "#c62828" : "#d0d0d0"}`,
              background: filter === f.key ? "#fff1f0" : "#fff",
              color: filter === f.key ? "#c62828" : "#444",
              cursor: "pointer",
              lineHeight: 1.2,
              fontFamily: "'DM Sans', sans-serif",
              minHeight: "32px",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grouped items */}
      {grouped.grade.length > 0 && (
        <GroupSection title="Grade changes">
          {grouped.grade.map((it, i) => <GradeItem key={i} item={it} />)}
        </GroupSection>
      )}

      {grouped.event.length > 0 && (
        <GroupSection title="Policy events">
          {grouped.event.map((it, i) => <StandardItem key={i} item={it} chipType="event" />)}
        </GroupSection>
      )}

      {grouped.product.length > 0 && (
        <GroupSection title="Product & methodology">
          {grouped.product.map((it, i) => (
            <StandardItem key={i} item={it} chipType={it.type === "method" ? "method" : "product"} />
          ))}
        </GroupSection>
      )}

      {/* Minor updates: collapsible bucket */}
      {grouped.minor.length > 0 && filter === "all" && (
        <div style={{ marginTop: "6px", borderTop: "1px solid #f0f0f0", paddingTop: "10px" }}>
          <button
            onClick={() => setMinorOpen(!minorOpen)}
            aria-expanded={minorOpen}
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#666",
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              background: "none",
              border: "none",
              padding: "6px 0",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              minHeight: "32px",
            }}
          >
            {minorOpen ? "▾" : "▸"} Minor updates ({grouped.minor.length})
          </button>
          {minorOpen && (
            <ul style={{
              margin: "6px 0 0 0",
              paddingLeft: "18px",
              fontSize: "13px",
              color: "#444",
              lineHeight: 1.5,
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}>
              {grouped.minor.map((it, i) => (
                <li key={i}>
                  <strong style={{ color: "#333" }}>{it.headline}</strong>
                  {it.body && <> — {it.body}</>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {totalVisible === 0 && (
        <div style={{ fontSize: "14px", color: "#666", fontStyle: "italic", padding: "12px 0" }}>
          No items match that filter for this update.
        </div>
      )}
    </div>
  );
}
