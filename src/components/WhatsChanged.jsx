import { useEffect, useState } from "react";
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

// How many entries render before the reader asks for the rest. One explicit
// button reveals everything older; no auto-load on scroll.
const PAGE_SIZE = 12;

// Item types that sit behind the per-entry "minor updates" expander when the
// "All" filter is active. "fix" rides along so recorded fixes stay readable
// instead of dropping out of the rendered history.
const QUIET_TYPES = ["docs", "minor", "fix"];

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
    <div
      id={item.anchorId}
      data-change-type="grade"
      tabIndex={item.anchorId ? -1 : undefined}
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
        scrollMarginTop: "16px",
      }}
    >
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

// Grade items carry stable anchor ids so DimensionCard / shared links can
// deep-link to them. Format matches getCurrentGradeMoves in gradeMoves.js.
function buildItems(entry) {
  return (entry.items || []).map((item, index) => ({
    ...item,
    anchorId: item.type === "grade" && item.dimensionId
      ? `change-${entry.date}-${item.dimensionId}-${index}`
      : undefined,
  }));
}

function filterMatchFor(filter) {
  return (t) => {
    if (filter === "all") return true;
    if (filter === "product") return t === "product" || t === "method";
    return t === filter;
  };
}

function entryHasVisibleItems(entry, filter) {
  if (filter === "all") return true;
  const match = filterMatchFor(filter);
  return (entry.items || []).some((i) => match(i.type));
}

// Which changelog entry (by index) holds the grade item a #change- hash
// points at. -1 when the hash is absent or targets nothing here.
function findEntryIndexForAnchor(changelog, target) {
  if (!target || !target.startsWith("change-")) return -1;
  for (let i = 0; i < changelog.length; i += 1) {
    if (buildItems(changelog[i]).some((item) => item.anchorId === target)) {
      return i;
    }
  }
  return -1;
}

// Items for one entry: major items grouped as before; docs / minor / fix
// items sit behind one quiet expander per entry when the filter is "All".
function EntryItems({ entry, filter }) {
  const [minorOpen, setMinorOpen] = useState(false);
  const items = buildItems(entry);
  const match = filterMatchFor(filter);

  const grouped = {
    grade:   items.filter(i => i.type === "grade"   && match("grade")),
    event:   items.filter(i => i.type === "event"   && match("event")),
    product: items.filter(i => (i.type === "product" || i.type === "method") && match("product")),
    quiet:   filter === "all" ? items.filter(i => QUIET_TYPES.includes(i.type)) : [],
  };

  const hasMajor =
    grouped.grade.length > 0 || grouped.event.length > 0 || grouped.product.length > 0;
  const quietCount = grouped.quiet.length;

  return (
    <div>
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

      {quietCount > 0 && (
        <div style={{
          marginTop: hasMajor ? "6px" : 0,
          borderTop: hasMajor ? "1px solid #f0f0f0" : "none",
          paddingTop: hasMajor ? "4px" : 0,
        }}>
          <button
            onClick={() => setMinorOpen(!minorOpen)}
            aria-expanded={minorOpen}
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontSize: "13px",
              fontWeight: 600,
              color: "#666",
              background: "none",
              border: "none",
              padding: "6px 0",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              minHeight: "44px",
              lineHeight: 1.3,
              textAlign: "left",
            }}
          >
            {minorOpen ? "▾ Hide" : "▸ Show"} {quietCount} minor update{quietCount === 1 ? "" : "s"}
          </button>
          {minorOpen && (
            <ul style={{
              margin: "0 0 6px 0",
              paddingLeft: "18px",
              fontSize: "13px",
              color: "#444",
              lineHeight: 1.5,
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}>
              {grouped.quiet.map((it, i) => (
                <li key={i}>
                  <strong style={{ color: "#333" }}>{it.headline}.</strong>
                  {it.body && <> {it.body}</>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function EarlierEntry({ entry, filter }) {
  return (
    <div style={{ padding: "14px 0 4px", borderTop: "1px solid #f0f0f0" }}>
      <div style={{
        fontSize: "13px",
        fontWeight: 700,
        color: "#333",
        fontFamily: "'DM Mono', monospace",
        marginBottom: "4px",
      }}>
        {entry.date}
      </div>
      {entry.summary && (
        <div style={{ fontSize: "14px", color: "#333", lineHeight: 1.5, marginBottom: "8px" }}>
          {entry.summary}
        </div>
      )}
      <EntryItems entry={entry} filter={filter} />
    </div>
  );
}

export default function WhatsChanged({ changelog }) {
  const [filter, setFilter] = useState("all");

  // Pagination is component-local. If the page arrives on a #change- hash
  // that points past the first page, start expanded so the anchor can render
  // and Dashboard's scroll-to-hash finds it.
  const [showAllEntries, setShowAllEntries] = useState(() => {
    if (typeof window === "undefined") return false;
    const target = window.location.hash.replace(/^#/, "");
    return findEntryIndexForAnchor(changelog, target) >= PAGE_SIZE;
  });

  // Same rule for hash changes while this view is already mounted. A deep link
  // also resets an active named filter: the target entry might not render
  // under it (e.g. a grade anchor while the Events filter is on).
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const handleHashChange = () => {
      const target = window.location.hash.replace(/^#/, "");
      const targetIndex = findEntryIndexForAnchor(changelog, target);
      if (targetIndex >= 0) setFilter("all");
      if (targetIndex >= PAGE_SIZE) {
        setShowAllEntries(true);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [changelog]);

  const latest = changelog[0];
  if (!latest) return null;

  // Earlier entries keep their changelog index as a stable key (dates repeat).
  // Under a named filter, entries with no matching items are skipped, and the
  // page counts run over the entries that would actually render.
  const earlier = changelog
    .map((entry, index) => ({ entry, index }))
    .slice(1)
    .filter(({ entry }) => entryHasVisibleItems(entry, filter));

  const visibleEarlier = showAllEntries ? earlier : earlier.slice(0, PAGE_SIZE - 1);
  const hiddenCount = earlier.length - visibleEarlier.length;

  const latestHasMatches = entryHasVisibleItems(latest, filter);

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

      {/* Latest entry items */}
      <EntryItems entry={latest} filter={filter} />

      {filter !== "all" && !latestHasMatches && (
        <div style={{ fontSize: "14px", color: "#666", fontStyle: "italic", padding: "12px 0" }}>
          No items match that filter for this update.
        </div>
      )}

      {/* Earlier entries */}
      {visibleEarlier.length > 0 && (
        <div style={{ marginTop: "18px", borderTop: "1px solid #e0e0e0", paddingTop: "14px" }}>
          <div style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "#555",
            textTransform: "uppercase",
            letterSpacing: "0.8px",
            marginBottom: "4px",
          }}>
            Earlier updates
          </div>
          {visibleEarlier.map(({ entry, index }) => (
            <EarlierEntry key={index} entry={entry} filter={filter} />
          ))}
        </div>
      )}

      {hiddenCount > 0 && (
        <button
          onClick={() => setShowAllEntries(true)}
          style={{
            display: "block",
            width: "100%",
            marginTop: "14px",
            minHeight: "44px",
            padding: "10px 16px",
            fontSize: "14px",
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            color: "#444",
            background: "#fafafa",
            border: "1px solid #d0d0d0",
            borderRadius: "8px",
            cursor: "pointer",
            lineHeight: 1.3,
          }}
        >
          Show earlier changes ({hiddenCount} more)
        </button>
      )}

      <div
        style={{
          marginTop: "16px",
          paddingTop: "12px",
          borderTop: "1px solid var(--border-subtle)",
          fontSize: "13px",
          color: "var(--text-secondary)",
          lineHeight: 1.5,
        }}
      >
        The raw data behind these entries is in the{" "}
        <a
          href="https://github.com/Sawatter/canada-under-carney/blob/main/src/data/changelog.json"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--accent)", fontWeight: 700 }}
        >
          full changelog on GitHub &rarr;
        </a>
      </div>
    </div>
  );
}
