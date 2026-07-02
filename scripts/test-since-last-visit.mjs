import assert from "node:assert/strict";
import {
  countGradeItemsSince,
  parseVersion,
  resolveNoticeState,
} from "../src/sinceLastVisit.js";

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

// 7. resolveNoticeState: first visit (no stored value) renders nothing.
assert.equal(
  resolveNoticeState(null, "5.150", changelog),
  "none",
  "first visit (null stored) must resolve to none",
);

// 8. Corrupted stored value renders nothing (never a notice, never caught-up).
assert.equal(
  resolveNoticeState("garbage", "5.150", changelog),
  "none",
  "unparsable stored value must resolve to none",
);

// 9. Same version renders nothing.
assert.equal(
  resolveNoticeState("5.150", "5.150", changelog),
  "none",
  "stored === current must resolve to none",
);

// 10. Version crossing with grade items resolves to the notice payload.
assert.deepEqual(
  resolveNoticeState("5.149", "5.150", changelog),
  { sinceVersion: "5.149", count: 1 },
  "a crossing with grade items must resolve to { sinceVersion, count }",
);

// 11. Version crossing with zero grade items resolves to the quiet
// caught-up state (5.149 in the fixture carries only a product item).
assert.equal(
  resolveNoticeState("5.148", "5.149", changelog),
  "caught-up",
  "a crossing with no grade items must resolve to caught-up",
);

// 12. Stored newer than current (rollback / stale preview) must resolve to
// "none" - saying "caught up" there would be false copy. The component's
// storage sync still self-heals stored back to current.
assert.equal(
  resolveNoticeState("5.151", "5.150", changelog),
  "none",
  "stored newer than current must resolve to none (no false caught-up copy)",
);

console.log("OK. sinceLastVisit helpers pass (countGradeItemsSince, parseVersion, resolveNoticeState).");
