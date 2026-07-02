// Pure helpers for the "since your last visit" line (SinceLastVisit.jsx).
// Kept in a plain .js module (like gradeMoves.js) so node test scripts can
// import them without a JSX transform.

/**
 * Parse a dashboard version string like "5.150" into [major, minor] numbers.
 * Returns null for anything that does not match, including missing values
 * (63 older changelog entries carry no version field) and corrupted
 * localStorage contents. Numeric parsing matters: string compare says
 * "5.9" > "5.150", which is wrong.
 */
export function parseVersion(version) {
  if (typeof version !== "string") return null;
  const match = /^(\d+)\.(\d+)$/.exec(version.trim());
  if (!match) return null;
  return [Number(match[1]), Number(match[2])];
}

function compareParsed(a, b) {
  if (a[0] !== b[0]) return a[0] - b[0];
  return a[1] - b[1];
}

/**
 * Count changelog items of type "grade" in entries newer than storedVersion
 * and no newer than currentVersion. Entries without a parsable version are
 * skipped. Returns 0 when either version string does not parse, so a
 * corrupted stored value can never produce a notice.
 */
export function countGradeItemsSince(changelog, storedVersion, currentVersion) {
  const stored = parseVersion(storedVersion);
  const current = parseVersion(currentVersion);
  if (!Array.isArray(changelog) || !stored || !current) return 0;

  let count = 0;
  for (const entry of changelog) {
    const entryVersion = parseVersion(entry?.version);
    if (!entryVersion) continue;
    if (compareParsed(entryVersion, stored) <= 0) continue;
    if (compareParsed(entryVersion, current) > 0) continue;
    for (const item of entry.items ?? []) {
      if (item?.type === "grade") count += 1;
    }
  }
  return count;
}
