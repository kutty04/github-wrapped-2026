/**
 * processGitHubData
 * Takes raw API responses and returns clean stats for the Wrapped cards.
 */
export function processGitHubData(profile, repos, events, allLanguages, searchStats, targetYear) {
  const year = targetYear || new Date().getFullYear();

  // ── 1. Commit count this year ──────────────────────────────────────────────
  const pushEvents = events.filter((e) => {
    if (e.type !== "PushEvent") return false;
    const eventYear = new Date(e.created_at).getFullYear();
    return eventYear === year;
  });

  const totalCommits = pushEvents.reduce(
    (sum, e) => sum + (e.payload?.size ?? 0),
    0
  );

  // ── 2. Top languages ────────────────────────────────────────────────────────
  const langTotals = {};
  for (const langMap of allLanguages) {
    for (const [lang, bytes] of Object.entries(langMap)) {
      langTotals[lang] = (langTotals[lang] ?? 0) + bytes;
    }
  }
  const totalBytes = Object.values(langTotals).reduce((a, b) => a + b, 0);
  const topLanguages = Object.entries(langTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percent: Math.round((bytes / totalBytes) * 100),
    }));

  // ── 3. Contribution streak ──────────────────────────────────────────────────
  // Build a Set of unique "YYYY-MM-DD" contribution days from all event types
  const activeDays = new Set(
    events
      .filter((e) => new Date(e.created_at).getFullYear() === year)
      .map((e) => e.created_at.slice(0, 10))
  );

  const sortedDays = Array.from(activeDays).sort();
  let currentStreak = 0;
  let longestStreak = 0;
  let streak = sortedDays.length > 0 ? 1 : 0;

  for (let i = 1; i < sortedDays.length; i++) {
    const prev = new Date(sortedDays[i - 1]);
    const curr = new Date(sortedDays[i]);
    const diff = (curr - prev) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak++;
    } else {
      longestStreak = Math.max(longestStreak, streak);
      streak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, streak);

  // Check if today is in the streak (for current streak)
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (activeDays.has(today) || activeDays.has(yesterday)) {
    currentStreak = streak;
  }

  // ── 4. Most active day of week ──────────────────────────────────────────────
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayCounts = Array(7).fill(0);
  events.forEach((e) => {
    if (new Date(e.created_at).getFullYear() === year) {
      dayCounts[new Date(e.created_at).getDay()]++;
    }
  });
  const mostActiveDay = days[dayCounts.indexOf(Math.max(...dayCounts))];
  const dayActivity = days.map((d, i) => ({ day: d, count: dayCounts[i] }));

  // ── 5. Top repos by star count ──────────────────────────────────────────────
  const topRepos = repos
    .filter((r) => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 3)
    .map((r) => ({
      name: r.name,
      stars: r.stargazers_count,
      language: r.language,
      description: r.description,
      url: r.html_url,
    }));

  // ── 6. Contribution heatmap (last 52 weeks) ─────────────────────────────────
  const heatmap = buildHeatmap(events);

  // ── 7. Total stars earned ───────────────────────────────────────────────────
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);

  // ── 8. Total repos ──────────────────────────────────────────────────────────
  const ownedRepos = repos.filter((r) => !r.fork).length;

  // ── 9. Best Month & Activity Playback ───────────────────────────────────────
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const shortNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const monthCounts = Array(12).fill(0);
  events.forEach(e => {
    if (new Date(e.created_at).getFullYear() === year) {
      monthCounts[new Date(e.created_at).getMonth()]++;
    }
  });
  const bestMonthIdx = monthCounts.indexOf(Math.max(...monthCounts));
  const bestMonth = monthCounts[bestMonthIdx] > 0 ? monthNames[bestMonthIdx] : "None";
  const monthActivity = shortNames.map((name, i) => ({ month: name, count: monthCounts[i] }));

  // ── 10. Most Active Time of Day ──────────────────────────────────────────────
  const timeBuckets = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };
  events.forEach(e => {
    if (new Date(e.created_at).getFullYear() === year) {
      const hr = new Date(e.created_at).getHours();
      if (hr >= 5 && hr < 12) timeBuckets.Morning++;
      else if (hr >= 12 && hr < 17) timeBuckets.Afternoon++;
      else if (hr >= 17 && hr < 21) timeBuckets.Evening++;
      else timeBuckets.Night++;
    }
  });
  const mostActiveTime = Object.keys(timeBuckets).reduce((a, b) => timeBuckets[a] > timeBuckets[b] ? a : b);

  // ── 11. Collaboration & Lines Added ─────────────────────────────────────────
  let externalCommits = 0;
  let linesAdded = 0;
  let linesDeleted = 0;
  events.forEach(e => {
    if (new Date(e.created_at).getFullYear() === year) {
      if (e.repo && e.repo.name && !e.repo.name.startsWith(profile.login + "/")) {
        externalCommits++;
      }
      if (e.type === "PullRequestEvent" && e.payload?.pull_request) {
        linesAdded += e.payload.pull_request.additions || 0;
        linesDeleted += e.payload.pull_request.deletions || 0;
      }
    }
  });

  // ── 12. Badges ──────────────────────────────────────────────────────────────
  const badges = [];
  if (mostActiveTime === "Night") badges.push({ id: "midnight", title: "Midnight Coder", desc: "Most active when the sun goes down", icon: "🦉" });
  if (externalCommits >= 10) badges.push({ id: "opensource", title: "Open Source Hero", desc: "Shipped heavily to external repos", icon: "🤝" });
  if (longestStreak >= 30) badges.push({ id: "streak", title: "Iron Streak", desc: "Coded 30+ days in a row", icon: "🔥" });
  if (longestStreak >= 10 && longestStreak < 30) badges.push({ id: "streak_silver", title: "Consistent", desc: "Coded 10+ days in a row", icon: "🗓️" });
  if (topLanguages.length >= 5) badges.push({ id: "polyglot", title: "Polyglot", desc: "Wrote code in 5+ languages", icon: "🌍" });
  if (totalStars >= 50) badges.push({ id: "stargazer", title: "Stargazer", desc: "Earned 50+ stars on your repos", icon: "⭐" });
  if (linesDeleted > linesAdded && linesDeleted > 1000) badges.push({ id: "deleter", title: "The Deleter", desc: "Deleted more code than you added", icon: "✂️" });
  if (badges.length === 0) badges.push({ id: "starter", title: "Journey Begun", desc: "Your first steps into the code verse", icon: "🚀" });

  // ── 13. Commits Extractor ───────────────────────────────────────────────────
  const recentCommits = [];
  events.forEach(e => {
    if (e.type === "PushEvent" && e.payload?.commits) {
      e.payload.commits.forEach(c => {
        if (c.message) recentCommits.push(c.message);
      });
    }
  });

  return {
    profile: {
      name: profile.name || profile.login,
      login: profile.login,
      avatar: profile.avatar_url,
      followers: profile.followers,
      bio: profile.bio,
    },
    year,
    totalCommits,
    topLanguages,
    longestStreak,
    currentStreak,
    mostActiveDay,
    dayActivity,
    topRepos,
    heatmap,
    totalStars,
    ownedRepos,
    searchStats,
    bestMonth,
    mostActiveTime,
    externalCommits,
    linesAdded,
    linesDeleted,
    badges,
    monthActivity,
    recentCommits: recentCommits.slice(0, 100)
  };
}

// Build a 52-week heatmap grid
function buildHeatmap(events) {
  const counts = {};
  events.forEach((e) => {
    const dateObj = new Date(e.created_at);
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, "0");
    const d = String(dateObj.getDate()).padStart(2, "0");
    const localDate = `${y}-${m}-${d}`;
    counts[localDate] = (counts[localDate] ?? 0) + 1;
  });

  const weeks = [];
  const now = new Date();
  // Go back 51 full weeks + current partial week
  const start = new Date(now);
  start.setDate(start.getDate() - 51 * 7 - start.getDay());

  for (let w = 0; w < 52; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const key = `${y}-${m}-${day}`;
      week.push({ date: key, count: counts[key] ?? 0 });
    }
    weeks.push(week);
  }
  return weeks;
}
