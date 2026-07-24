export const QUIET_TYPES = Object.freeze(["docs", "minor", "fix"]);

const QUIET_TYPE_SET = new Set(QUIET_TYPES);

function indexedItem(item, itemIndex) {
  return { ...item, itemIndex };
}

export function buildFirstLookProjection(entry) {
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
    throw new TypeError("first-look release entry must be an object");
  }
  if (!Array.isArray(entry.items) || entry.items.length === 0) {
    throw new TypeError("first-look release entry must contain at least one item");
  }

  const indexedItems = entry.items.map(indexedItem);
  const gradeItems = indexedItems.filter((item) => item.type === "grade");

  if (gradeItems.length > 0) {
    return {
      mode: "grade-moves",
      gradeMoveCount: gradeItems.length,
      featuredItems: gradeItems.slice(0, 2),
    };
  }

  const firstNonQuietItem = indexedItems.find(
    (item) => !QUIET_TYPE_SET.has(item.type),
  );
  if (firstNonQuietItem) {
    return {
      mode: "no-grade-moves",
      gradeMoveCount: 0,
      featuredItems: [firstNonQuietItem],
    };
  }

  return {
    mode: "maintenance-only",
    gradeMoveCount: 0,
    featuredItems: [],
  };
}

export function selectPrimaryNextCheck(status) {
  if (!status || typeof status !== "object" || Array.isArray(status)) {
    throw new TypeError("status must be an object");
  }
  if (!Array.isArray(status.nextChecks) || status.nextChecks.length === 0) {
    throw new TypeError("status.nextChecks must be a non-empty array");
  }

  const primary = status.nextChecks[0];
  if (!primary || typeof primary !== "object" || Array.isArray(primary)) {
    throw new TypeError("status.nextChecks[0] must be an object");
  }
  return primary;
}

export function resolveNextCheckTiming(status, check) {
  if (!status || typeof status !== "object" || Array.isArray(status)) {
    throw new TypeError("status must be an object");
  }
  if (!check || typeof check !== "object" || Array.isArray(check)) {
    throw new TypeError("next check must be an object");
  }

  if (typeof check.date === "string" && check.date.trim()) {
    return { kind: "date", value: check.date };
  }

  if (typeof check.dateSource === "string" && check.dateSource.trim()) {
    const resolvedDate = status[check.dateSource];
    if (typeof resolvedDate !== "string" || !resolvedDate.trim()) {
      throw new TypeError(`next check dateSource ${check.dateSource} did not resolve`);
    }
    return { kind: "date", value: resolvedDate };
  }

  if (typeof check.timingLabel === "string" && check.timingLabel.trim()) {
    return { kind: "label", value: check.timingLabel };
  }

  throw new TypeError("next check must include date, dateSource, or timingLabel");
}
