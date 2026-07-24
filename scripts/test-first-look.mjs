import assert from "node:assert/strict";
import {
  QUIET_TYPES,
  buildFirstLookProjection,
  resolveNextCheckTiming,
  selectPrimaryNextCheck,
} from "../src/firstLook.js";
import { buildChangelogSummary } from "./generate-changelog-summary.mjs";

assert.deepEqual(
  QUIET_TYPES,
  ["docs", "minor", "fix"],
  "quiet changelog types must remain stable and shared",
);
assert.equal(
  Object.isFrozen(QUIET_TYPES),
  true,
  "quiet changelog types must not be mutable by consumers",
);

const threeGradeMoves = {
  date: "2026-08-01",
  version: "5.164",
  items: [
    { type: "product", headline: "Product update" },
    { type: "grade", headline: "First grade move" },
    { type: "fix", headline: "Quiet fix" },
    { type: "grade", headline: "Second grade move" },
    { type: "grade", headline: "Third grade move" },
  ],
};
const gradeProjection = buildFirstLookProjection(threeGradeMoves);
assert.equal(gradeProjection.mode, "grade-moves");
assert.equal(gradeProjection.gradeMoveCount, 3);
assert.deepEqual(
  gradeProjection.featuredItems.map(({ headline, itemIndex }) => ({
    headline,
    itemIndex,
  })),
  [
    { headline: "First grade move", itemIndex: 1 },
    { headline: "Second grade move", itemIndex: 3 },
  ],
  "grade mode must preserve stored order and feature no more than two moves",
);
assert.equal(
  Object.hasOwn(threeGradeMoves.items[1], "itemIndex"),
  false,
  "projection must not mutate canonical changelog items",
);

const noGradeProjection = buildFirstLookProjection({
  items: [
    { type: "docs", headline: "Quiet documentation" },
    { type: "fix", headline: "Quiet fix" },
    { type: "product", headline: "First material update" },
    { type: "event", headline: "Later event" },
  ],
});
assert.deepEqual(
  noGradeProjection,
  {
    mode: "no-grade-moves",
    gradeMoveCount: 0,
    featuredItems: [
      {
        type: "product",
        headline: "First material update",
        itemIndex: 2,
      },
    ],
  },
  "zero-grade releases must select the first non-quiet item in stored order",
);

assert.deepEqual(
  buildFirstLookProjection({
    items: [
      { type: "event", headline: "Event-only release" },
    ],
  }),
  {
    mode: "no-grade-moves",
    gradeMoveCount: 0,
    featuredItems: [
      {
        type: "event",
        headline: "Event-only release",
        itemIndex: 0,
      },
    ],
  },
  "an event-only release must select its first event",
);

assert.deepEqual(
  buildFirstLookProjection({
    items: [
      { type: "fix", headline: "Fix" },
      { type: "docs", headline: "Docs" },
      { type: "minor", headline: "Minor" },
    ],
  }),
  {
    mode: "maintenance-only",
    gradeMoveCount: 0,
    featuredItems: [],
  },
  "an all-quiet release must produce maintenance-only mode",
);

assert.throws(
  () => buildFirstLookProjection({ items: [] }),
  /must contain at least one item/,
  "an empty release must be rejected",
);

const changelogSummary = buildChangelogSummary([
  threeGradeMoves,
  {
    date: "2026-07-22",
    version: "5.163",
    items: [
      { type: "product", headline: "Older product update" },
      { type: "grade", headline: "Older grade move" },
    ],
  },
]);
assert.equal(
  Object.hasOwn(changelogSummary[0], "firstLook"),
  true,
  "only the newest summary entry must receive the first-look projection",
);
assert.equal(
  Object.hasOwn(changelogSummary[1], "firstLook"),
  false,
  "older summary entries must not receive duplicate first-look projections",
);
assert.deepEqual(
  changelogSummary[0].items.map(({ headline, itemIndex }) => ({
    headline,
    itemIndex,
  })),
  [
    { headline: "First grade move", itemIndex: 1 },
    { headline: "Second grade move", itemIndex: 3 },
    { headline: "Third grade move", itemIndex: 4 },
  ],
  "the compatibility items field must remain grade-only and complete",
);

const primaryWatch = {
  id: "published-first",
  label: "Published first",
  date: "2026-09-01",
};
const status = {
  nextChecks: [
    primaryWatch,
    {
      id: "earlier-date-but-second",
      label: "Earlier date but stored second",
      date: "2026-08-01",
    },
  ],
};
assert.equal(
  selectPrimaryNextCheck(status),
  primaryWatch,
  "the first stored next check must win without date-based reordering",
);
assert.deepEqual(
  resolveNextCheckTiming(status, primaryWatch),
  { kind: "date", value: "2026-09-01" },
  "a direct next-check date must remain a date",
);
assert.deepEqual(
  resolveNextCheckTiming(
    { nextScheduledSourceScanAt: "2026-08-01" },
    { dateSource: "nextScheduledSourceScanAt" },
  ),
  { kind: "date", value: "2026-08-01" },
  "a next-check dateSource must resolve through the status record",
);
assert.deepEqual(
  resolveNextCheckTiming(status, { timingLabel: "Event-driven" }),
  { kind: "label", value: "Event-driven" },
  "an event-driven next check must preserve its authored timing label",
);
assert.throws(
  () => resolveNextCheckTiming({}, { dateSource: "nextScheduledSourceScanAt" }),
  /did not resolve/,
  "an unresolved next-check dateSource must be rejected",
);
assert.throws(
  () => selectPrimaryNextCheck({ nextChecks: [] }),
  /must be a non-empty array/,
  "an empty watch list must be rejected",
);

console.log(
  "OK. first-look helpers preserve release order, compatibility data, primary-watch order, and timing sources.",
);
