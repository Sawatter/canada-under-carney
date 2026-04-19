import { useEffect, useState } from "react";

const COUNTER_URL =
  "https://carneydashboard.goatcounter.com/counter/TOTAL.json";

export default function VisitorCount() {
  const [count, setCount] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadCount = () => {
      if (cancelled) return;
      fetch(COUNTER_URL, { cache: "no-store" })
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        })
        .then((data) => {
          if (cancelled) return;
          const raw = data?.count_unique ?? data?.count ?? null;
          if (raw == null) throw new Error("no count field");
          const n = parseInt(String(raw).replace(/[^0-9]/g, ""), 10);
          setCount(Number.isFinite(n) ? n : null);
        })
        .catch(() => {
          if (!cancelled) setError(true);
        });
    };

    const delay = setTimeout(loadCount, 1500);

    return () => {
      cancelled = true;
      clearTimeout(delay);
    };
  }, []);

  if (error) return null;

  return (
    <div
      className="visitor-count-pill"
      style={{
        position: "absolute",
        top: "12px",
        right: "16px",
        fontSize: "10px",
        color: "#888",
        background: "#fff",
        border: "1px solid #e0e0e0",
        borderRadius: "999px",
        padding: "4px 10px",
        fontFamily: "'DM Mono', monospace",
        lineHeight: 1.2,
        textAlign: "right",
        zIndex: 10,
      }}
      title="Total visitors tracked by GoatCounter (cookieless, privacy-friendly)."
    >
      <span style={{ fontWeight: 700, color: "#1a1a1a" }}>
        {count == null ? "…" : count.toLocaleString()}
      </span>
      <span style={{ marginLeft: "4px" }}>visits</span>
    </div>
  );
}
