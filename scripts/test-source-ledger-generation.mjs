#!/usr/bin/env node

import assert from "node:assert/strict";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseLedgerRows } from "./source-ledger-utils.mjs";

const scriptsDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptsDirectory, "..");
const temporaryRoot = mkdtempSync(join(tmpdir(), "source-ledger-generation-"));

function generate(cycleMonth) {
  const result = spawnSync(
    process.execPath,
    [join(temporaryRoot, "scripts", "generate-source-ledger.mjs"), cycleMonth],
    { encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return readFileSync(
    join(temporaryRoot, "docs", `Source-Coverage-Ledger-${cycleMonth}.md`),
    "utf8",
  );
}

try {
  mkdirSync(join(temporaryRoot, "scripts"), { recursive: true });
  mkdirSync(join(temporaryRoot, "src", "data"), { recursive: true });
  mkdirSync(join(temporaryRoot, "docs"), { recursive: true });

  for (const filename of [
    "generate-source-ledger.mjs",
    "source-ledger-utils.mjs",
    "validate-source-ledger.mjs",
  ]) {
    cpSync(join(scriptsDirectory, filename), join(temporaryRoot, "scripts", filename));
  }
  for (const filename of ["dimensions.json", "approval-polls.json", "meta.json"]) {
    cpSync(
      join(projectRoot, "src", "data", filename),
      join(temporaryRoot, "src", "data", filename),
    );
  }

  const septemberLedger = generate("2026-09");
  const januaryLedger = generate("2026-01");

  const validation = spawnSync(
    process.execPath,
    [join(temporaryRoot, "scripts", "validate-source-ledger.mjs"), "2026-09"],
    { encoding: "utf8" },
  );
  assert.equal(validation.status, 0, validation.stderr || validation.stdout);
  assert.match(validation.stdout, /OK\. Ledger covers \d+ unique cited URLs/);

  const missingNextDueRow =
    "| Fixture cadence row | Fixture | https://example.com/not-due | Quarterly | " +
    "2026-08-28 | not due | Deferred by cadence | Last checked 2026-07-01. |";
  writeFileSync(
    join(temporaryRoot, "docs", "Source-Coverage-Ledger-2026-09.md"),
    septemberLedger.replace("## Excluded Evidence", `${missingNextDueRow}\n\n## Excluded Evidence`),
  );
  const missingNextDueValidation = spawnSync(
    process.execPath,
    [join(temporaryRoot, "scripts", "validate-source-ledger.mjs"), "2026-09"],
    { encoding: "utf8" },
  );
  assert.equal(missingNextDueValidation.status, 1);
  assert.match(
    missingNextDueValidation.stderr,
    /Not-due row\(s\) without a next due point: 1/,
  );

  assert.match(
    septemberLedger,
    /\*\*Evidence window:\*\* 2026-08-01 through 2026-08-31/,
    "September cycle must cover the full prior calendar month",
  );
  assert.match(
    januaryLedger,
    /\*\*Evidence window:\*\* 2025-12-01 through 2025-12-31/,
    "January cycle must roll the evidence window into the prior year",
  );
  assert.match(
    septemberLedger,
    /\| Moody's Canada sovereign page \| Fiscal Health \| https:\/\/ratings\.moodys\.com\/ratings-news \|/,
    "generated ledgers must retain the official Moody's Ratings News watch surface",
  );

  for (const ledger of [septemberLedger, januaryLedger]) {
    const excludedIndex = ledger.indexOf("## Excluded Evidence");
    const biasIndex = ledger.indexOf("## Bias-Resistance Review");
    const closeoutIndex = ledger.indexOf("## Cycle Closeout");
    assert.ok(excludedIndex >= 0, "generated ledger must include Excluded Evidence");
    assert.ok(biasIndex > excludedIndex, "Bias-Resistance Review must follow Excluded Evidence");
    assert.ok(closeoutIndex > biasIndex, "governance sections must precede Cycle Closeout");
    assert.match(
      ledger,
      /\| Evidence \/ source \| Dashboard area \| Decision \| Rationale \|\n\|---\|---\|---\|---\|\n\n## Bias-Resistance Review/,
      "Excluded Evidence must start as a durable empty table",
    );
    assert.match(ledger, /\*\*Open carry-forward items:\*\*/);

    const rows = parseLedgerRows(ledger);
    const declaredCount = Number(ledger.match(/\*\*Total source rows:\*\* (\d+)/)?.[1]);
    assert.equal(rows.length, declaredCount, "governance sections must not change source-row counts");
  }

  assert.deepEqual(
    parseLedgerRows(januaryLedger),
    parseLedgerRows(septemberLedger),
    "cycle-month boundaries must not change generated row order or contents",
  );

  for (const invalidMonth of ["2026-00", "2026-13", "2026-1", "2026-9"]) {
    const invalidCycle = spawnSync(
      process.execPath,
      [join(temporaryRoot, "scripts", "generate-source-ledger.mjs"), invalidMonth],
      { encoding: "utf8" },
    );
    assert.equal(invalidCycle.status, 1, `${invalidMonth} must be rejected`);
    assert.match(invalidCycle.stderr, /Usage:/);
    assert.equal(
      existsSync(join(temporaryRoot, "docs", `Source-Coverage-Ledger-${invalidMonth}.md`)),
      false,
      `${invalidMonth} must not create a ledger`,
    );
  }
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}

console.log("Source ledger generation tests passed (evidence windows, canonical sources, governance sections, row stability).");
