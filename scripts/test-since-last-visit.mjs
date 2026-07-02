import assert from "node:assert/strict";
import { countGradeItemsSince, parseVersion } from "../src/sinceLastVisit.js";

// Fixture mirrors the real changelog shape: newest first, some entries with
// grade items, one older entry with no version field at all (63 real entries
// are versionless), and one unpublished draft newer than the live version.
const changelog = [
  {
    date: "2026-08-01",
    version: "5.151",
    items: [{ type: "grade", headline: "Unpublished draft grade move" }],
  },
  {
    date: "2026-07-01",
    version: "5.150",
    items: [
      { type: "grade", headline: "Fixture grade move" },
      { type: "product", headline: "Fixture product item" },
    ],
  },
  {
    date: "2026-07-01",
    version: "5.149",
    items: [{ type: "product", headline: "No grade items here" }],
  },
  {
    date: "2026-06-30",
    version: "5.148",
    items: [
      { type: "grade", headline: "Fixture grade move A" },
      { type: "grade", headline: "Fixture grade move B" },
    ],
  },
  {
    date: "2026-05-01",
    items: [{ type: "grade", headline: "Versionless legacy entry, skipped" }],
  },
];

// 1. Basic window: entries after 5.148 up to 5.150 hold exactly one grade item.
assert.equal(
  countGradeItemsSince(changelog, "5.148", "5.150"),
  1,
  "expected 1 grade item between 5.148 (exclusive) and 5.150 (inclusive)",
);

// 2. Numeric compare, not string compare: "5.9" < "5.150" numerically, so
// 5.148 (2), 5.149 (0), and 5.150 (1) all count. String compare would say
// "5.148" < "5.9" and return 0.
assert.equal(
  countGradeItemsSince(changelog, "5.9", "5.150"),
  3,
  "version compare must be numeric ([5,9] < [5,148]), not lexicographic",
);

// 3. Up to date: stored === current reports nothing.
assert.equal(
  countGradeItemsSince(changelog, "5.150", "5.150"),
  0,
  "stored === current must count 0",
);

// 4. Versionless legacy entries are skipped, and entries newer than the
// current version (the 5.151 draft) do not count either: from 5.0 the total
// is 3, not 5.
assert.equal(
  countGradeItemsSince(changelog, "5.0", "5.150"),
  3,
  "versionless entries and entries above currentVersion must be skipped",
);

// 5. Corrupted stored value can never produce a notice.
assert.equal(
  countGradeItemsSince(changelog, "garbage", "5.150"),
  0,
  "unparsable storedVersion must count 0",
);

// 6. parseVersion contract used by the component's first-visit branch.
assert.deepEqual(parseVersion("5.150"), [5, 150]);
assert.equal(parseVersion("v5.150"), null);
assert.equal(parseVersion(null), null);

console.log("OK. sinceLastVisit helpers pass (countGradeItemsSince, parseVersion).");
