import { useEffect } from "react";
import { useGitHubData } from "./hooks/useGitHubData";
import LandingScreen from "./components/LandingScreen";
import WrappedViewer from "./components/WrappedViewer";

export default function App() {
  const { status, progress, data, error, load } = useGitHubData();

  // Auto-load from URL param: ?user=customuser&token=optional&year=2026
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const user = params.get("user");
    let token = params.get("token") || sessionStorage.getItem("gh_token") || "";
    if (params.get("token")) {
      sessionStorage.setItem("gh_token", params.get("token"));
      // Strip token from URL immediately for clean sharing
      const url = new URL(window.location);
      url.searchParams.delete("token");
      window.history.replaceState({}, "", url);
    }
    const year = params.get("year") ? parseInt(params.get("year"), 10) : new Date().getFullYear();

    if (user) load(user, token, year);
  }, [load]);

  function handleSubmit(username, token, year) {
    // Keep internal session token natively
    const finalToken = token || sessionStorage.getItem("gh_token") || "";
    const url = new URL(window.location);
    url.searchParams.set("user", username);
    url.searchParams.set("year", year);
    window.history.pushState({}, "", url);
    load(username, finalToken, year);
  }

  function handleReset() {
    const url = new URL(window.location);
    url.searchParams.delete("user");
    window.history.pushState({}, "", url);
    window.location.reload();
  }

  if (status === "success" && data) {
    return <WrappedViewer data={data} onReset={handleReset} />;
  }

  return (
    <LandingScreen
      onSubmit={handleSubmit}
      loading={status === "loading"}
      progress={progress}
      error={error}
    />
  );
}
