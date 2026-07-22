import assert from "node:assert/strict";
import { buildDimensionSharePayload } from "../src/dimensionShare.js";

const housingUrl = "https://example.test/canada-under-carney/#dim-housing-supply";
const housingPayload = buildDimensionSharePayload({
  dim: {
    id: "housing-supply",
    name: "Housing Supply",
    grade: "D",
    trend: "stable",
    lastUpdated: "2026-07-19",
  },
  url: housingUrl,
});

assert.deepEqual(housingPayload.shareData, {
  title: "Housing Supply | Canada Under Carney",
  text: [
    "Canada Under Carney performance scorecard",
    "Housing Supply",
    "Grade: D | Trend: Stable",
    "Policy file reviewed: 2026-07-19",
    "Evidence and grading method:",
  ].join("\n"),
  url: housingUrl,
});
assert.equal(
  housingPayload.clipboardText,
  `${housingPayload.shareData.text}\n${housingUrl}`,
  "clipboard fallback must retain the contextual text and exact deep link",
);

const trackerUrl = "https://example.test/canada-under-carney/#dim-promise-delivery";
const trackerPayload = buildDimensionSharePayload({
  dim: {
    id: "promise-delivery",
    name: "Promise Delivery",
    excludeFromGPA: true,
    informationalGrade: "C+",
    trend: "stable",
    lastUpdated: "2026-07-19",
  },
  trackerStat: { delivered: 14, total: 43 },
  url: trackerUrl,
});

assert.equal(
  trackerPayload.shareData.text,
  [
    "Canada Under Carney accountability tracker",
    "Promise Delivery",
    "Delivered: 14 of 43 | Tracker trend: Stable",
    "No letter grade. Not included in headline scores.",
    "Tracker reviewed: 2026-07-19",
    "Promise-by-promise evidence:",
  ].join("\n"),
  "tracker share text must not present its informational grade as a policy grade",
);
assert.equal(trackerPayload.shareData.title, "Promise Delivery | Canada Under Carney");
assert.equal(
  trackerPayload.clipboardText,
  `${trackerPayload.shareData.text}\n${trackerUrl}`,
  "tracker clipboard fallback must keep its ungraded context and exact deep link",
);

assert.throws(
  () => buildDimensionSharePayload({ dim: { name: "Housing Supply" }, url: "" }),
  /named dimension and URL are required/,
  "missing deep links must fail instead of producing context-free share content",
);

console.log("OK. dimension share payload preserves context for grades and the tracker.");
