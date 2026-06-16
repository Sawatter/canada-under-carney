import { lazy, Suspense } from "react";
import Dashboard from "./components/Dashboard";

const DashboardPrototype = import.meta.env.DEV
  ? lazy(() => import("./components/prototype/DashboardPrototype"))
  : null;

export default function App() {
  const usePrototype =
    import.meta.env.DEV &&
    DashboardPrototype &&
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("prototype") === "app";

  if (usePrototype) {
    return (
      <Suspense fallback={<div style={{ padding: 24 }}>Loading prototype...</div>}>
        <DashboardPrototype />
      </Suspense>
    );
  }

  return <Dashboard />;
}
