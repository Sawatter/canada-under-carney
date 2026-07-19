import dimensionsAssetUrl from "./data/dimensions.json?url";

let cachedDimensions = null;
let activeRequest = null;
let requestGeneration = 0;

export class DimensionsLoadError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "DimensionsLoadError";
  }
}

function assertCanonicalDimensions(value) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new DimensionsLoadError("Detailed scorecard data has an invalid format.");
  }

  const ids = new Set();
  for (const dimension of value) {
    if (!dimension || typeof dimension.id !== "string" || ids.has(dimension.id)) {
      throw new DimensionsLoadError("Detailed scorecard data has an invalid dimension list.");
    }
    ids.add(dimension.id);
  }

  return value;
}

async function fetchDimensions(generation) {
  try {
    const response = await fetch(dimensionsAssetUrl, {
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const dimensions = assertCanonicalDimensions(await response.json());
    if (generation === requestGeneration) cachedDimensions = dimensions;
    return dimensions;
  } catch (error) {
    if (error instanceof DimensionsLoadError) throw error;
    throw new DimensionsLoadError("Detailed scorecard data could not be loaded.", { cause: error });
  }
}

export function getLoadedDimensions() {
  return cachedDimensions;
}

export function loadDimensions() {
  if (cachedDimensions) return Promise.resolve(cachedDimensions);
  if (activeRequest) return activeRequest;

  const generation = requestGeneration;
  activeRequest = fetchDimensions(generation).finally(() => {
    if (generation === requestGeneration) activeRequest = null;
  });
  return activeRequest;
}

export function retryDimensionsLoad() {
  requestGeneration += 1;
  cachedDimensions = null;
  activeRequest = null;
  return loadDimensions();
}
