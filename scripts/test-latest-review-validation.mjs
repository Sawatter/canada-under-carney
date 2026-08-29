import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const validatorPath = resolve(__dirname, "validate-dimensions.mjs");
const sourceDataDir = resolve(repoRoot, "src/data");
const baseFixture = {
  dimensions: JSON.parse(readFileSync(resolve(sourceDataDir, "dimensions.json"), "utf8")),
  changelog: JSON.parse(readFileSync(resolve(sourceDataDir, "changelog.json"), "utf8")),
  meta: JSON.parse(readFileSync(resolve(sourceDataDir, "meta.json"), "utf8")),
};
const temporaryRoot = mkdtempSync(join(tmpdir(), "latest-review-validation-"));

function dimension(fixture, id) {
  const match = fixture.dimensions.find((item) => item.id === id);
  assert.ok(match, `missing fixture dimension ${id}`);
  return match;
}

function heldReview(date) {
  return {
    date,
    outcome: "held",
    summary: "Published evidence did not cross the stated trigger.",
  };
}

function addUtcDays(date, days) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

function latestGradeMoveDate(fixture, dimensionId) {
  return fixture.changelog
    .filter((entry) => entry.items?.some((item) => (
      item.type === "grade" && item.dimensionId === dimensionId
    )))
    .map((entry) => entry.date)
    .sort()
    .at(-1);
}

function reviewedDimension(fixture) {
  const match = fixture.dimensions.find((item) => (
    !item.excludeFromGPA
    && item.latestReview
  ));
  assert.ok(match, "missing a reviewed fixture dimension");
  return match;
}

function dimensionWithLatestGradeMove(fixture) {
  const match = fixture.dimensions.find((item) => {
    const moveDate = latestGradeMoveDate(fixture, item.id);
    return !item.excludeFromGPA
      && moveDate
      && moveDate <= fixture.meta.lastUpdated;
  });
  assert.ok(match, "missing a fixture dimension with a usable latest grade move");
  return match;
}

function invokeValidator(args) {
  const result = spawnSync(process.execPath, [validatorPath, ...args], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  if (result.error) throw result.error;

  return {
    output: `${result.stdout || ""}${result.stderr || ""}`,
    status: result.status,
  };
}

function runValidator(fixture, fixtureName) {
  const fixtureDir = resolve(temporaryRoot, fixtureName);
  mkdirSync(fixtureDir);
  writeFileSync(resolve(fixtureDir, "dimensions.json"), JSON.stringify(fixture.dimensions));
  writeFileSync(resolve(fixtureDir, "changelog.json"), JSON.stringify(fixture.changelog));
  writeFileSync(resolve(fixtureDir, "meta.json"), JSON.stringify(fixture.meta));
  return invokeValidator(["--fixture-data-dir", fixtureDir]);
}

const gradeTokenFixtures = [
  "The file held its A- footing after review.",
  "The file remains grade c after review.",
  "The file held at C after review.",
].map((summary, index) => ({
  name: `grade-token-${index + 1}`,
  expected: "latestReview.summary contains a grade token",
  mutate: (fixture) => {
    reviewedDimension(fixture).latestReview.summary = summary;
  },
}));

const urgencyFixtures = [
  ["breaking", "Breaking evidence did not cross the trigger."],
  ["urgent", "Urgent evidence did not cross the trigger."],
  ["just in", "Just in evidence did not cross the trigger."],
  ["live", "Live evidence did not cross the trigger."],
  ["real-time", "Real-time evidence did not cross the trigger."],
  ["don't miss", "Don't miss this evidence review."],
  ["dont miss", "Dont miss this evidence review."],
  ["come back", "Come back for this evidence review."],
  ["check back", "Check back for this evidence review."],
].map(([word, summary]) => ({
  name: `urgency-${word.replace(/[^a-z]+/g, "-")}`,
  expected: `latestReview.summary contains forbidden urgency/freshness wording "${word}"`,
  mutate: (fixture) => {
    reviewedDimension(fixture).latestReview.summary = summary;
  },
}));

const invalidFixtures = [
  {
    name: "tracker-review",
    expected: "tracker must not have \"latestReview\"",
    mutate: (fixture) => {
      dimension(fixture, "promise-delivery").latestReview = heldReview(fixture.meta.lastUpdated);
    },
  },
  {
    name: "non-object-review",
    expected: "latestReview must be a plain object",
    mutate: (fixture) => {
      reviewedDimension(fixture).latestReview = [];
    },
  },
  {
    name: "unknown-key",
    expected: "latestReview has unexpected key \"extra\"",
    mutate: (fixture) => {
      reviewedDimension(fixture).latestReview.extra = true;
    },
  },
  {
    name: "invalid-date",
    expected: "latestReview.date must be a valid YYYY-MM-DD date",
    mutate: (fixture) => {
      reviewedDimension(fixture).latestReview.date = "2026-02-30";
    },
  },
  {
    name: "after-release-date",
    expected: "must not be later than meta.lastUpdated",
    mutate: (fixture) => {
      reviewedDimension(fixture).latestReview.date = addUtcDays(
        fixture.meta.lastUpdated,
        1,
      );
    },
  },
  {
    name: "before-dimension-date",
    expected: "must not predate lastUpdated",
    mutate: (fixture) => {
      const reviewed = reviewedDimension(fixture);
      reviewed.latestReview.date = addUtcDays(reviewed.lastUpdated, -1);
    },
  },
  {
    name: "not-after-grade-move",
    expected: "must be later than the latest grade move",
    mutate: (fixture) => {
      const moved = dimensionWithLatestGradeMove(fixture);
      const moveDate = latestGradeMoveDate(fixture, moved.id);
      moved.lastUpdated = moveDate;
      moved.latestReview = heldReview(moveDate);
    },
  },
  {
    name: "invalid-outcome",
    expected: "latestReview.outcome must be exactly \"held\"",
    mutate: (fixture) => {
      reviewedDimension(fixture).latestReview.outcome = "changed";
    },
  },
  {
    name: "empty-summary",
    expected: "latestReview.summary must be a non-empty string",
    mutate: (fixture) => {
      reviewedDimension(fixture).latestReview.summary = " ";
    },
  },
  {
    name: "long-summary",
    expected: "latestReview.summary is 181 chars",
    mutate: (fixture) => {
      reviewedDimension(fixture).latestReview.summary = "x".repeat(181);
    },
  },
  {
    name: "missing-review-and-move",
    expected: "graded dimension needs either latestReview or a dated grade-move record",
    mutate: (fixture) => {
      const reviewed = reviewedDimension(fixture);
      delete reviewed.latestReview;
      fixture.changelog.forEach((entry) => {
        entry.items = (entry.items || []).filter((item) => (
          item.type !== "grade" || item.dimensionId !== reviewed.id
        ));
      });
    },
  },
  {
    name: "major-projects-rationale-omits-advanced-project",
    expected: "rationale omits projects counted as post-referral advancement: Crawford Nickel Project",
    mutate: (fixture) => {
      const majorProjects = dimension(fixture, "major-projects");
      majorProjects.rationale = majorProjects.rationale.replace(
        "Crawford Nickel Project",
        "the omitted project",
      );
    },
  },
  {
    name: "major-projects-rationale-omits-red-chris",
    expected: "rationale omits projects counted as post-referral advancement: Red Chris Copper and Gold Mine",
    mutate: (fixture) => {
      const majorProjects = dimension(fixture, "major-projects");
      majorProjects.rationale = majorProjects.rationale.replace(
        "Red Chris Copper and Gold Mine",
        "the secondary omitted project",
      );
    },
  },
  ...gradeTokenFixtures,
  ...urgencyFixtures,
];

try {
  const defaultResult = invokeValidator([]);
  assert.equal(
    defaultResult.status,
    0,
    `default validation should read canonical data:\n${defaultResult.output}`,
  );

  const externalFixtureResult = invokeValidator(["--fixture-data-dir", repoRoot]);
  assert.equal(externalFixtureResult.status, 1);
  assert.ok(
    externalFixtureResult.output.includes(
      "fixture data directory must be inside the system temp directory",
    ),
    `fixture path boundary was not enforced:\n${externalFixtureResult.output}`,
  );

  const validResult = runValidator(structuredClone(baseFixture), "valid-current-data");
  assert.equal(
    validResult.status,
    0,
    `current data should pass the fixture validator:\n${validResult.output}`,
  );

  invalidFixtures.forEach((fixtureCase, index) => {
    const fixture = structuredClone(baseFixture);
    fixtureCase.mutate(fixture);
    const result = runValidator(fixture, `${String(index + 1).padStart(2, "0")}-${fixtureCase.name}`);

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
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}

console.log(
  `OK. latestReview validator accepts current data and rejects ${invalidFixtures.length} invalid fixtures.`,
);
