import { useEffect, useState } from "react";

const COUNTER_URL =
  "https://carneydashboard.goatcounter.com/counter/TOTAL.json";
const FALLBACK_URL = `${import.meta.env.BASE_URL}visitor-count.json`;

function parseCount(data) {
  const raw = data?.count_unique ?? data?.count ?? null;
  if (raw == null) throw new Error("no count field");
  const n = parseInt(String(raw).replace(/[^0-9]/g, ""), 10);
  if (!Number.isFinite(n)) throw new Error("invalid count");
  return n;
}

export default function VisitorCount() {
  const [count, setCount] = useState(null);
  const [status, setStatus] = useState("loading");
  const [updatedAt, setUpdatedAt] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const readJson = async (url) => {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    };

    const loadCount = async () => {
      let fallbackLoaded = false;

      try {
        const cached = await readJson(FALLBACK_URL);
        if (!cancelled) {
          setCount(parseCount(cached));
          setUpdatedAt(cached?.updatedAt ?? null);
          setStatus("cached");
          fallbackLoaded = true;
        }
      } catch {
        // Ignore fallback errors; a live fetch may still succeed.
      }

      try {
        const live = await readJson(COUNTER_URL);
        if (cancelled) return;
        setCount(parseCount(live));
        setUpdatedAt(null);
        setStatus("ready");
      } catch {
        if (!cancelled && !fallbackLoaded) {
          setStatus("unavailable");
        }
      }
    };

    loadCount();

    return () => {
      cancelled = true;
    };
  }, []);

  const title =
    status === "cached" && updatedAt
      ? `Visitor count snapshot last synced ${updatedAt}. Live counter fetch may be blocked in this browser.`
      : "Total visitors tracked by GoatCounter (cookieless, privacy-friendly).";

  return (
    <div
      className="visitor-count-pill"
      style={{
        position: "absolute",
        top: "12px",
        right: "16px",
        fontSize: "13px",
        color: "#666",
        background: "#fff",
        border: "1px solid #e0e0e0",
        borderRadius: "999px",
        padding: "4px 10px",
        fontFamily: "'DM Mono', monospace",
        lineHeight: 1.2,
        textAlign: "right",
        zIndex: 10,
        maxWidth: "calc(100% - 32px)",
      }}
      title={title}
    >
      <span style={{ fontWeight: 700, color: "#1a1a1a" }}>
        {count != null ? count.toLocaleString() : "…"}
      </span>
      <span style={{ marginLeft: "4px" }}>
        {status === "unavailable" ? "visits unavailable" : "visits"}
      </span>
    </div>
  );
}
