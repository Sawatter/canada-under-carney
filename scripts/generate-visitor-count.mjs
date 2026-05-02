#!/usr/bin/env node
// Writes public/visitor-count.json with the latest GoatCounter total so the
// site can fall back to a same-origin snapshot when third-party requests are
// blocked by browser extensions.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const outPath = resolve(repoRoot, "public/visitor-count.json");
const COUNTER_URL = "https://carneydashboard.goatcounter.com/counter/TOTAL.json";

function parseCount(data) {
  const raw = data?.count_unique ?? data?.count ?? null;
  if (raw == null) throw new Error("no count field");
  const n = parseInt(String(raw).replace(/[^0-9]/g, ""), 10);
  if (!Number.isFinite(n)) throw new Error("invalid count");
  return n;
}

async function main() {
  const now = new Date().toISOString();
  let payload = {
    count: null,
    updatedAt: now,
    source: "unavailable",
  };

  try {
    const response = await fetch(COUNTER_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    payload = {
      count: parseCount(data),
      updatedAt: now,
      source: "goatcounter",
    };
  } catch (error) {
    if (existsSync(outPath)) {
      const prior = JSON.parse(readFileSync(outPath, "utf8"));
      if (Number.isFinite(prior?.count)) {
        payload = {
          count: prior.count,
          updatedAt: prior.updatedAt ?? now,
          source: "cached",
        };
      }
    }
    console.warn(
      `Visitor counter refresh failed; preserving cached value when available. (${error.message})`
    );
  }

  writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Wrote ${outPath} (${payload.count ?? "no"} visits, source: ${payload.source})`);
}

await main();
