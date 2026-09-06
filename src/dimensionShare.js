const TREND_LABELS = {
  up: "Improving",
  stable: "Stable",
  down: "Declining",
};

function buildShareText(dim, trackerStat) {
  const trend = TREND_LABELS[dim.trend] || "Not available";

  if (dim.excludeFromGPA) {
    const delivered = trackerStat?.delivered;
    const total = trackerStat?.total;
    const deliveredLine = Number.isInteger(delivered) && Number.isInteger(total)
      ? `Delivered: ${delivered} of ${total} | Tracker trend: ${trend}`
      : `Tracker trend: ${trend}`;
    return [
      "Canada Under Carney accountability tracker",
      dim.name,
      deliveredLine,
      "No letter grade. Not included in headline scores.",
      dim.lastUpdated ? `Tracker reviewed: ${dim.lastUpdated}` : null,
      "Promise-by-promise evidence:",
    ].filter(Boolean).join("\n");
  }

  const reviewedDate = dim.latestReview?.date || dim.lastUpdated;
  const exception = dim.latestReview?.outcome === "exception" ? dim.latestReview : null;

  return [
    "Canada Under Carney performance scorecard",
    dim.name,
    exception
      ? `Temporary prior grade: ${dim.grade} | Retained trend: ${trend}`
      : `Grade: ${dim.grade || "Not available"} | Trend: ${trend}`,
    exception?.summary,
    exception ? `Exception expires: ${exception.expiresOn}` : null,
    reviewedDate ? `Policy file reviewed: ${reviewedDate}` : null,
    "Evidence and grading method:",
  ].filter(Boolean).join("\n");
}

export function buildDimensionSharePayload({ dim, trackerStat, url }) {
  if (!dim?.name || !url) {
    throw new TypeError("A named dimension and URL are required to build share content.");
  }

  const text = buildShareText(dim, trackerStat);

  return {
    shareData: {
      title: `${dim.name} | Canada Under Carney`,
      text,
      url,
    },
    clipboardText: `${text}\n${url}`,
  };
}
