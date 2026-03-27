const BASE = "https://api.github.com";

function headers(token) {
  const h = { Accept: "application/vnd.github+json" };
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
}

async function get(url, token) {
  const res = await fetch(url, { headers: headers(token) });
  if (!res.ok) {
    if (res.status === 404) throw new Error("User not found");
    if (res.status === 403) throw new Error("Rate limit hit — add a GitHub token");
    throw new Error(`GitHub API error: ${res.status}`);
  }
  return res.json();
}

// Paginate through all pages of a list endpoint
async function getAll(url, token) {
  let results = [];
  let page = 1;
  while (true) {
    const sep = url.includes("?") ? "&" : "?";
    const data = await get(`${url}${sep}per_page=100&page=${page}`, token);
    if (!data.length) break;
    results = results.concat(data);
    if (data.length < 100) break;
    page++;
  }
  return results;
}

export async function fetchProfile(username, token) {
  return get(`${BASE}/users/${username}`, token);
}

export async function fetchRepos(username, token) {
  return getAll(`${BASE}/users/${username}/repos?sort=pushed`, token);
}

export async function fetchEvents(username, token) {
  // Events API only returns last 90 days, max 300 events
  return getAll(`${BASE}/users/${username}/events/public`, token);
}

export async function fetchLanguages(repoFullName, token) {
  return get(`${BASE}/repos/${repoFullName}/languages`, token);
}

export async function fetchSearch(query, token) {
  return get(`${BASE}/search/issues?q=${encodeURIComponent(query)}`, token);
}

export async function fetchSearchCommits(query, token) {
  const h = headers(token);
  const res = await fetch(`${BASE}/search/commits?q=${encodeURIComponent(query)}&per_page=1`, { headers: h });
  if (!res.ok) throw new Error(`Search commit error: ${res.status}`);
  return res.json();
}
