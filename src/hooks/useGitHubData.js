import { useState, useCallback } from "react";
import {
  fetchProfile,
  fetchRepos,
  fetchEvents,
  fetchLanguages,
  fetchSearch,
  fetchSearchCommits,
} from "../api/github";
import { processGitHubData } from "../utils/processor";

export function useGitHubData() {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [progress, setProgress] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async (username, token = "", yearParam = new Date().getFullYear()) => {
    if (!username.trim()) return;
    setStatus("loading");
    setError(null);
    setData(null);

    try {
      setProgress("Fetching profile...");
      const profile = await fetchProfile(username.trim(), token);

      setProgress("Fetching repositories...");
      const repos = await fetchRepos(username.trim(), token);

      setProgress("Fetching activity events...");
      const events = await fetchEvents(username.trim(), token);

      setProgress("Fetching year-in-review stats...");
      const year = yearParam;
      const lastYear = year - 1;
      const [
        prsOpened, prsMerged, issuesOpened, issuesClosed, reviewComments, firstCommitData, lastYearCommitData
      ] = await Promise.all([
        fetchSearch(`author:${username.trim()} type:pr created:${year}-01-01..${year}-12-31`, token).catch(()=>({total_count:0})),
        fetchSearch(`author:${username.trim()} type:pr is:merged created:${year}-01-01..${year}-12-31`, token).catch(()=>({total_count:0})),
        fetchSearch(`author:${username.trim()} type:issue created:${year}-01-01..${year}-12-31`, token).catch(()=>({total_count:0})),
        fetchSearch(`author:${username.trim()} type:issue is:closed created:${year}-01-01..${year}-12-31`, token).catch(()=>({total_count:0})),
        fetchSearch(`commenter:${username.trim()} type:pr created:${year}-01-01..${year}-12-31`, token).catch(()=>({total_count:0})),
        fetchSearchCommits(`author:${username.trim()} committer-date:${year}-01-01..${year}-12-31 sort:committer-date-asc`, token).catch(()=>({items:[]})),
        fetchSearchCommits(`author:${username.trim()} committer-date:${lastYear}-01-01..${lastYear}-12-31`, token).catch(()=>({total_count:0}))
      ]);

      const searchStats = {
        prsOpened: prsOpened.total_count || 0,
        prsMerged: prsMerged.total_count || 0,
        issuesOpened: issuesOpened.total_count || 0,
        issuesClosed: issuesClosed.total_count || 0,
        reviewComments: reviewComments.total_count || 0,
        firstCommitDate: firstCommitData.items?.[0]?.commit?.committer?.date || null,
        lastYearCommits: lastYearCommitData.total_count || 0
      };

      // Fetch languages for top 10 non-fork repos to avoid too many requests
      setProgress("Analysing languages...");
      const topRepos = repos.filter((r) => !r.fork).slice(0, 10);
      const allLanguages = await Promise.all(
        topRepos.map((r) => fetchLanguages(r.full_name, token).catch(() => ({})))
      );

      setProgress("Crunching numbers...");
      const processed = processGitHubData(profile, repos, events, allLanguages, searchStats, year);

      setProgress("Consulting the AI Oracle...");
      try {
        const { fetchAIReview } = await import("../api/ai.js");
        const aiData = await fetchAIReview(processed);
        processed.ai = aiData;
      } catch (e) {
        console.error("AI Review failed:", e);
        processed.ai = null;
      }

      setData(processed);
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }, []);

  return { status, progress, data, error, load };
}
