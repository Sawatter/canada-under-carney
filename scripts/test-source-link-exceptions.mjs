import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import {
  buildExceptionReport,
  linkHealthExitCode,
  parseArgs,
  readExceptionReportClosure,
  validateExceptionReportClosure,
  writeExceptionReport,
} from "./check-source-links.mjs";

const scriptPath = join(dirname(fileURLToPath(import.meta.url)), "check-source-links.mjs");

const results = [
  {
    url: "https://example.test/ok",
    status: 200,
    finalUrl: "https://example.test/ok",
    state: "OK",
  },
  {
    url: "https://example.test/redirected",
    status: 200,
    finalUrl: "https://example.test/new-location",
    state: "REDIRECTED",
  },
  {
    url: "https://example.test/blocked",
    status: 403,
    finalUrl: "https://example.test/blocked",
    state: "BLOCKED",
  },
  {
    url: "https://example.test/timeout",
    status: 0,
    finalUrl: "https://example.test/timeout",
    state: "TIMEOUT",
    reason: "timeout",
  },
  {
    url: "https://example.test/suspect",
    status: 200,
    finalUrl: "https://example.test/errors/404.html",
    state: "SUSPECT",
    reason: "soft 404",
  },
  {
    url: "https://example.test/dead-b",
    status: 404,
    finalUrl: "https://example.test/dead-b",
    state: "DEAD",
  },
  {
    url: "https://example.test/dead-a",
    status: 404,
    finalUrl: "https://example.test/dead-a",
    state: "DEAD",
    reason: "not found",
  },
];

const citationEntries = [
  {
    normalizedUrl: "https://example.test/dead-a",
    area: "Housing",
    field: "sources[].url",
    label: "Housing: first source",
  },
  {
    normalizedUrl: "https://example.test/dead-a",
    area: "Fiscal Health",
    field: "gradeTriggers.down[].sourceUrl",
    label: "Fiscal Health: down trigger",
  },
  {
    normalizedUrl: "https://example.test/redirected",
    area: "Ethics",
    field: "sources[].url",
    label: "Ethics: declaration",
  },
];

const report = buildExceptionReport("2026-09", results, citationEntries);
assert.equal(report.schemaVersion, 1);
assert.equal(report.cycle, "2026-09");
assert.equal(report.totalChecked, 7);
assert.equal(report.exceptionCount, 6);
assert.deepEqual(report.counts, {
  DEAD: 2,
  SUSPECT: 1,
  TIMEOUT: 1,
  REDIRECTED: 1,
  BLOCKED: 1,
});
assert.deepEqual(
  report.exceptions.map(({ state, url }) => [state, url]),
  [
    ["DEAD", "https://example.test/dead-a"],
    ["DEAD", "https://example.test/dead-b"],
    ["SUSPECT", "https://example.test/suspect"],
    ["TIMEOUT", "https://example.test/timeout"],
    ["REDIRECTED", "https://example.test/redirected"],
    ["BLOCKED", "https://example.test/blocked"],
  ],
);
assert.equal(report.exceptions.some(({ state }) => state === "OK"), false);
assert.deepEqual(report.exceptions[0].references, [
  {
    area: "Fiscal Health",
    field: "gradeTriggers.down[].sourceUrl",
    label: "Fiscal Health: down trigger",
  },
  {
    area: "Housing",
    field: "sources[].url",
    label: "Housing: first source",
  },
]);
for (const exception of report.exceptions) {
  assert.deepEqual(exception.manualDisposition, {
    status: "pending",
    date: "",
    note: "",
  });
}

const reversedReport = buildExceptionReport("2026-09", [...results].reverse(), [...citationEntries].reverse());
assert.equal(JSON.stringify(reversedReport), JSON.stringify(report), "report output must be deterministic");

assert.equal(linkHealthExitCode(results), 1, "DEAD must fail the link check");
for (const state of ["SUSPECT", "TIMEOUT", "REDIRECTED", "BLOCKED", "OK"]) {
  assert.equal(
    linkHealthExitCode(results.filter((result) => result.state === state)),
    0,
    `${state} must not fail the link check`,
  );
}

assert.deepEqual(
  parseArgs([
    "--json",
    "--cycle",
    "2026-09",
    "--exceptions-out",
    "docs/source-recertification/source-link-exceptions-2026-09.json",
  ]),
  {
    asJson: true,
    checkExceptions: null,
    cycle: "2026-09",
    exceptionsOut: "docs/source-recertification/source-link-exceptions-2026-09.json",
    limit: Infinity,
  },
);
assert.deepEqual(parseArgs([]), {
  asJson: false,
  checkExceptions: null,
  cycle: null,
  exceptionsOut: null,
  limit: Infinity,
});
assert.deepEqual(
  parseArgs(["--check-exceptions", "docs/source-recertification/source-link-exceptions-2026-09.json"]),
  {
    asJson: false,
    checkExceptions: "docs/source-recertification/source-link-exceptions-2026-09.json",
    cycle: null,
    exceptionsOut: null,
    limit: Infinity,
  },
);
assert.throws(() => parseArgs(["--exceptions-out", "report.json"]), /requires --cycle/);
assert.throws(() => parseArgs(["--cycle", "2026-09"]), /requires --exceptions-out/);
assert.throws(
  () => parseArgs([
    "--limit",
    "25",
    "--cycle",
    "2026-09",
    "--exceptions-out",
    "docs/source-recertification/source-link-exceptions-2026-09.json",
  ]),
  /durable reports require a full run/,
);
assert.throws(
  () => parseArgs(["--cycle", "2026-13", "--exceptions-out", "report.json"]),
  /must use YYYY-MM/,
);
assert.throws(
  () => parseArgs([
    "--cycle",
    "2026-09",
    "--exceptions-out",
    "docs/source-recertification/source-link-exceptions-2026-08.json",
  ]),
  /filename must be source-link-exceptions-2026-09\.json/,
);
assert.throws(
  () => parseArgs(["--check-exceptions", "report.json", "--limit", "1"]),
  /cannot be combined/,
);

const temporaryRoot = mkdtempSync(join(tmpdir(), "source-link-exceptions-"));
try {
  const outputPath = "nested/source-link-exceptions-2026-09.json";
  const absolutePath = writeExceptionReport(outputPath, report, temporaryRoot);
  assert.equal(
    readFileSync(absolutePath, "utf8"),
    `${JSON.stringify(report, null, 2)}\n`,
  );

  const partialOutputPath = join(temporaryRoot, "source-link-exceptions-2026-10.json");
  const partialCli = spawnSync(process.execPath, [
    scriptPath,
    "--limit",
    "1",
    "--cycle",
    "2026-10",
    "--exceptions-out",
    partialOutputPath,
  ], { encoding: "utf8" });
  assert.equal(partialCli.status, 1, "partial durable output must be rejected");
  assert.match(partialCli.stderr, /durable reports require a full run/);
  assert.equal(existsSync(partialOutputPath), false, "rejected partial output must not create a report");

  assert.match(
    validateExceptionReportClosure(report, absolutePath)[0],
    /manualDisposition\.status is pending/,
  );
  const pendingCli = spawnSync(process.execPath, [scriptPath, "--check-exceptions", absolutePath], {
    encoding: "utf8",
  });
  assert.equal(pendingCli.status, 1, "pending dispositions must fail the closure gate");
  assert.match(pendingCli.stdout, /source-link exception closure: OPEN/);

  const closedReport = structuredClone(report);
  for (const exception of closedReport.exceptions) {
    exception.manualDisposition = {
      status: exception.state === "REDIRECTED" ? "accepted-redirect" : "confirmed-live",
      date: "2026-09-03",
      note: "Checked in a browser against the cited claim.",
    };
  }
  assert.deepEqual(validateExceptionReportClosure(closedReport, absolutePath), []);
  writeFileSync(absolutePath, `${JSON.stringify(closedReport, null, 2)}\n`, "utf8");
  assert.deepEqual(readExceptionReportClosure(absolutePath).issues, []);
  const closedCli = spawnSync(process.execPath, [scriptPath, "--check-exceptions", absolutePath], {
    encoding: "utf8",
  });
  assert.equal(closedCli.status, 0, "completed dispositions must pass the closure gate");
  assert.match(closedCli.stdout, /source-link exception closure: CLOSED/);

  const malformedReport = structuredClone(closedReport);
  malformedReport.exceptions[0].manualDisposition = {
    status: "confirmed-live",
    date: "",
    note: "",
  };
  assert.deepEqual(
    validateExceptionReportClosure(malformedReport, absolutePath).slice(-2),
    [
      "exceptions[0] (https://example.test/dead-a) manualDisposition.date must use YYYY-MM-DD",
      "exceptions[0] (https://example.test/dead-a) manualDisposition.note is required",
    ],
  );

  const mismatchedPath = join(temporaryRoot, "source-link-exceptions-2026-08.json");
  writeFileSync(mismatchedPath, `${JSON.stringify(closedReport, null, 2)}\n`, "utf8");
  assert.match(
    readExceptionReportClosure(mismatchedPath).issues[0],
    /filename must be source-link-exceptions-2026-09\.json/,
  );
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}

console.log("Source-link exception report tests passed (full-run output, cycle naming, closure, and exit semantics).");
