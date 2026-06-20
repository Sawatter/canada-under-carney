import Dashboard from "./components/Dashboard";
import DashboardPrototype from "./components/prototype/DashboardPrototype";

function getRequestedExperience() {
  if (typeof window === "undefined") return "classic";

  const params = new URLSearchParams(window.location.search);
  if (params.get("experience") === "app") return "app";
  if (params.get("experience") === "classic") return "classic";
  const isLocalPreview = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
  if (isLocalPreview && params.get("prototype") === "app") return "app";
  return "classic";
}

export default function App() {
  const experience = getRequestedExperience();
  if (experience === "app") return <DashboardPrototype />;
  return <Dashboard />;
}
