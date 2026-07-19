import { useEffect, useRef, useState } from "react";
import { loadDimensions, retryDimensionsLoad } from "../dimensionData";
import { countPromises } from "../utils";
import PromiseTracker from "./PromiseTracker";

export default function PromiseTrackerRoute({
  appMode = false,
  initialDimensionFilter = "All",
  onReady,
}) {
  const [state, setState] = useState({ status: "loading", dimensions: null });
  const requestIdRef = useRef(0);

  useEffect(() => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    loadDimensions().then(
      (dimensions) => {
        if (requestIdRef.current === requestId) {
          setState({ status: "ready", dimensions });
        }
      },
      () => {
        if (requestIdRef.current === requestId) {
          setState({ status: "error", dimensions: null });
        }
      },
    );
    return () => {
      requestIdRef.current += 1;
    };
  }, []);

  const retry = () => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setState({ status: "loading", dimensions: null });
    retryDimensionsLoad().then(
      (dimensions) => {
        if (requestIdRef.current === requestId) {
          setState({ status: "ready", dimensions });
        }
      },
      () => {
        if (requestIdRef.current === requestId) {
          setState({ status: "error", dimensions: null });
        }
      },
    );
  };

  if (state.status === "error") {
    return (
      <div className="route-load-error" role="alert">
        <strong>Promise details did not load.</strong>
        <span>The rest of the dashboard is still available.</span>
        <button type="button" onClick={retry}>
          Try again
        </button>
      </div>
    );
  }

  if (state.status !== "ready") {
    return (
      <div className="route-loading" role="status" aria-live="polite">
        Loading promise details...
      </div>
    );
  }

  const { all, counts, total } = countPromises(state.dimensions);
  return (
    <PromiseTracker
      allPromises={all}
      promiseCounts={counts}
      totalPromises={total}
      appMode={appMode}
      initialDimensionFilter={initialDimensionFilter}
      onReady={onReady}
    />
  );
}
