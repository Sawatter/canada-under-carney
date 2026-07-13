export function getCurrentRelease(changelog = [], meta = {}) {
  const current = changelog[0] || null;
  if (!current) return null;
  if (current.version !== meta.version || current.date !== meta.lastUpdated) {
    return null;
  }
  return current;
}

export function getCurrentGradeMoves(changelog = [], dimensions = [], meta = {}) {
  const current = getCurrentRelease(changelog, meta);
  if (!current) return [];

  const dimensionsById = new Map(
    dimensions
      .filter((dim) => dim && !dim.excludeFromGPA)
      .map((dim) => [dim.id, dim]),
  );

  return (current.items || [])
    .map((item, summaryIndex) => ({
      item,
      itemIndex: Number.isInteger(item?.itemIndex) ? item.itemIndex : summaryIndex,
    }))
    .filter(({ item }) => item?.type === "grade")
    .filter(({ item }) => {
      const dim = dimensionsById.get(item.dimensionId);
      if (!dim) return false;
      return item.dimensionName === dim.name
        && item.from === dim.previousGrade
        && item.to === dim.grade
        && item.from !== item.to;
    })
    .map(({ item, itemIndex }) => {
      const gradeItem = { ...item };
      delete gradeItem.itemIndex;
      return {
        ...gradeItem,
        releaseDate: current.date,
        releaseVersion: current.version,
        anchorId: `change-${current.date}-${item.dimensionId}-${itemIndex}`,
      };
    });
}

export function getCurrentGradeMovesByDimension(changelog = [], dimensions = [], meta = {}) {
  return getCurrentGradeMoves(changelog, dimensions, meta).reduce((moves, item) => {
    const existing = moves.get(item.dimensionId) || [];
    existing.push(item);
    moves.set(item.dimensionId, existing);
    return moves;
  }, new Map());
}
