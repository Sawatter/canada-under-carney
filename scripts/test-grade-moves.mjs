import assert from "node:assert/strict";
import {
  getCurrentGradeMoves,
  getCurrentGradeMovesByDimension,
  getCurrentRelease,
} from "../src/gradeMoves.js";

const meta = {
  version: "5.fixture",
  lastUpdated: "2026-06-29",
};

const dimensions = [
  {
    id: "defence-trade",
    name: "Defence & Trade",
    previousGrade: "B+",
    grade: "A-",
  },
  {
    id: "promise-delivery",
    name: "Promise Delivery",
    informationalGrade: "Tracker",
    excludeFromGPA: true,
  },
];

const changelog = [
  {
    date: "2026-06-29",
    version: "5.fixture",
    items: [
      {
        type: "product",
        headline: "Leading non-grade item",
        body: "This confirms grade-note anchors use the full changelog item index.",
      },
      {
        type: "grade",
        dimensionId: "defence-trade",
        dimensionName: "Defence & Trade",
        from: "B+",
        to: "A-",
        deltaLabel: "+0.4",
        headline: "Defence moved on funded milestones",
        body: "Fixture only.",
        drivers: ["Fixture source"],
        link: {
          label: "Fixture source",
          href: "https://example.com/fixture",
        },
      },
      {
        type: "grade",
        dimensionId: "promise-delivery",
        dimensionName: "Promise Delivery",
        from: "Too Early",
        to: "Delivered",
        deltaLabel: "+1",
        headline: "Tracker should not appear",
        body: "Fixture only.",
        drivers: ["Fixture source"],
        link: {
          label: "Fixture source",
          href: "https://example.com/fixture",
        },
      },
    ],
  },
];

assert.equal(getCurrentRelease(changelog, meta), changelog[0]);
assert.equal(getCurrentRelease(changelog, { ...meta, version: "5.other" }), null);

const moves = getCurrentGradeMoves(changelog, dimensions, meta);
assert.equal(moves.length, 1);
assert.equal(moves[0].dimensionId, "defence-trade");
assert.equal(moves[0].anchorId, "change-2026-06-29-defence-trade-1");
assert.equal(moves[0].releaseVersion, "5.fixture");

const summarizedChangelog = changelog.map((entry) => ({
  ...entry,
  items: entry.items
    .map((item, itemIndex) => ({ ...item, itemIndex }))
    .filter((item) => item.type === "grade"),
}));
const summarizedMoves = getCurrentGradeMoves(summarizedChangelog, dimensions, meta);
assert.equal(summarizedMoves[0].anchorId, "change-2026-06-29-defence-trade-1");
assert.equal("itemIndex" in summarizedMoves[0], false);

const byDimension = getCurrentGradeMovesByDimension(changelog, dimensions, meta);
assert.deepEqual(byDimension.get("defence-trade")?.[0], moves[0]);
assert.equal(byDimension.has("promise-delivery"), false);

const staleDimensionState = [
  {
    id: "defence-trade",
    name: "Defence & Trade",
    previousGrade: "A-",
    grade: "A-",
  },
];
assert.deepEqual(getCurrentGradeMoves(changelog, staleDimensionState, meta), []);

console.log("OK. gradeMoves current-release helper passes.");
