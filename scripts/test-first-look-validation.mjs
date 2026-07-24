import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const validatorPath = resolve(__dirname, "validate-first-look.mjs");
const statusValidatorPath = resolve(__dirname, "validate-status.mjs");
const temporaryRoot = mkdtempSync(join(tmpdir(), "first-look-validation-"));
const baseFixture = {
  meta: {
    version: "5.164",
    lastUpdated: "2026-08-01",
    nextUpdate: "2026-09-01",
    overallVerdictLine:
      "Execution is mixed, with progress in several files and major delivery gaps still open.",
    coveragePeriod: {
      start: "2025-03-14",
      end: "2026-07-31",
    },
  },
  changelog: [
    {
      date: "2026-08-01",
      version: "5.164",
      summary: "Updated the first-look briefing.",
      items: [
        {
          type: "product",
          headline: "First-look briefing",
          body: "The dashboard now leads with the result and its authored reason.",
        },
      ],
    },
  ],
  status: {
    schemaVersion: 2,
    generatedAt: "2026-08-01",
    lastSourceScanAt: "2026-08-01",
    nextScheduledSourceScanAt: "2026-09-01",
    lastEditorReviewedScoreCycleAt: "2026-08-01",
    coverageThrough: "2026-07-31",
    watchItemsAwaitingReviewCount: 0,
    disclaimerKey: "scan_vs_review_v1",
    nextChecks: [
      {
        id: "housing-disbursement-watch",
        label: "Housing disbursement watch",
        timingLabel: "Event-driven",
        status: "Waiting for a published agreement, payment, or construction record.",
        href: "#dim-housing-supply-evidence",
      },
    ],
  },
};

function invokeValidator(scriptPath, args) {
  const result = spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  if (result.error) throw result.error;
  return {
    output: `${result.stdout || ""}${result.stderr || ""}`,
    status: result.status,
  };
}

function writeFixture(fixture, fixtureName) {
  const fixtureDirectory = resolve(temporaryRoot, fixtureName);
  mkdirSync(fixtureDirectory);
  for (const [name, value] of Object.entries(fixture)) {
    writeFileSync(
      resolve(fixtureDirectory, `${name}.json`),
      `${JSON.stringify(value, null, 2)}\n`,
    );
  }
  return fixtureDirectory;
}

function runFirstLookValidator(fixture, fixtureName) {
  const fixtureDirectory = writeFixture(fixture, fixtureName);
  return invokeValidator(
    validatorPath,
    ["--fixture-data-dir", fixtureDirectory],
  );
}

const gradeTokenFixtures = [
  "The result held its A- footing after review.",
  "The result remains grade c after review.",
  "The result held at C after review.",
].map((overallVerdictLine, index) => ({
  name: `grade-token-${index + 1}`,
  expected: "meta.overallVerdictLine contains a grade token",
  mutate: (fixture) => {
    fixture.meta.overallVerdictLine = overallVerdictLine;
  },
}));

const urgencyFixtures = [
  ["breaking", "Breaking evidence changed the overall assessment."],
  ["urgent", "Urgent evidence changed the overall assessment."],
  ["just in", "Just in evidence changed the overall assessment."],
  ["live", "Live evidence changed the overall assessment."],
  ["real-time", "Real-time evidence changed the overall assessment."],
  ["don't miss", "Don't miss the evidence behind this assessment."],
  ["dont miss", "Dont miss the evidence behind this assessment."],
  ["come back", "Come back for the evidence behind this assessment."],
  ["check back", "Check back for the evidence behind this assessment."],
].map(([word, overallVerdictLine]) => ({
  name: `urgency-${word.replace(/[^a-z]+/g, "-")}`,
  expected:
    `meta.overallVerdictLine contains forbidden urgency/freshness wording "${word}"`,
  mutate: (fixture) => {
    fixture.meta.overallVerdictLine = overallVerdictLine;
  },
}));

const invalidFixtures = [
  {
    name: "missing-verdict",
    expected: "meta.overallVerdictLine must be an authored non-empty string",
    mutate: (fixture) => {
      delete fixture.meta.overallVerdictLine;
    },
  },
  {
    name: "untrimmed-verdict",
    expected: "meta.overallVerdictLine must not have leading or trailing whitespace",
    mutate: (fixture) => {
      fixture.meta.overallVerdictLine = ` ${fixture.meta.overallVerdictLine}`;
    },
  },
  {
    name: "multiline-verdict",
    expected: "meta.overallVerdictLine must be a single line",
    mutate: (fixture) => {
      fixture.meta.overallVerdictLine = "Progress remains mixed.\nMajor delivery gaps remain open.";
    },
  },
  {
    name: "long-verdict",
    expected: "meta.overallVerdictLine is 111 chars - must be 110 or fewer",
    mutate: (fixture) => {
      fixture.meta.overallVerdictLine = "x".repeat(111);
    },
  },
  {
    name: "empty-release",
    expected: "changelog[0].items must be a non-empty array",
    mutate: (fixture) => {
      fixture.changelog[0].items = [];
    },
  },
  {
    name: "unknown-item-type",
    expected: "is not an allowed changelog type",
    mutate: (fixture) => {
      fixture.changelog[0].items[0].type = "announcement";
    },
  },
  {
    name: "version-mismatch",
    expected: "must equal meta.version",
    mutate: (fixture) => {
      fixture.changelog[0].version = "5.163";
    },
  },
  {
    name: "date-mismatch",
    expected: "must be a valid date equal to meta.lastUpdated",
    mutate: (fixture) => {
      fixture.changelog[0].date = "2026-07-31";
    },
  },
  {
    name: "invalid-next-update",
    expected: "meta.nextUpdate must be an ISO date",
    mutate: (fixture) => {
      fixture.meta.nextUpdate = "September 1";
    },
  },
  {
    name: "empty-next-checks",
    expected: "status.nextChecks must be a non-empty array",
    mutate: (fixture) => {
      fixture.status.nextChecks = [];
    },
  },
  ...gradeTokenFixtures,
  ...urgencyFixtures,
];

try {
  const validFixtureDirectory = writeFixture(
    structuredClone(baseFixture),
    "valid",
  );
  const validFirstLookResult = invokeValidator(
    validatorPath,
    ["--fixture-data-dir", validFixtureDirectory],
  );
  assert.equal(
    validFirstLookResult.status,
    0,
    `valid first-look fixture should pass:\n${validFirstLookResult.output}`,
  );

  const validStatusResult = invokeValidator(
    statusValidatorPath,
    ["--fixture-data-dir", validFixtureDirectory],
  );
  assert.equal(
    validStatusResult.status,
    0,
    `valid status fixture should pass:\n${validStatusResult.output}`,
  );

  invalidFixtures.forEach((fixtureCase, index) => {
    const fixture = structuredClone(baseFixture);
    fixtureCase.mutate(fixture);
    const result = runFirstLookValidator(
      fixture,
      `${String(index + 1).padStart(2, "0")}-${fixtureCase.name}`,
    );

    assert.equal(
      result.status,
      1,
      `${fixtureCase.name} should fail validation:\n${result.output}`,
    );
    const errorLines = result.output
      .split(/\r?\n/)
      .map((line) => line.trimStart())
      .filter((line) => line.startsWith("✗ "));
    assert.equal(
      errorLines.length,
      1,
      `${fixtureCase.name} should reach exactly one rejection path:\n${result.output}`,
    );
    assert.ok(
      errorLines[0].includes(fixtureCase.expected),
      `${fixtureCase.name} did not report ${JSON.stringify(fixtureCase.expected)}:\n${result.output}`,
    );
  });

  const emptyWatchFixture = structuredClone(baseFixture);
  emptyWatchFixture.status.nextChecks = [];
  const emptyWatchDirectory = writeFixture(
    emptyWatchFixture,
    "status-empty-next-checks",
  );
  const emptyWatchStatusResult = invokeValidator(
    statusValidatorPath,
    ["--fixture-data-dir", emptyWatchDirectory],
  );
  assert.equal(emptyWatchStatusResult.status, 1);
  assert.ok(
    emptyWatchStatusResult.output.includes("nextChecks must be a non-empty array"),
    `status validator did not reject an empty nextChecks array:\n${emptyWatchStatusResult.output}`,
  );
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}

console.log(
  `OK. first-look validation accepts valid fixtures and rejects ${invalidFixtures.length} invalid fixtures.`,
);
