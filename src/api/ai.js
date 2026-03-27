const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function fetchAIReview(data) {
  const languageStr = data.topLanguages?.map(l => l.name).join(", ") || "None";
  
  const prompt = `You are a snarky, brilliant senior developer reviewing a GitHub user's yearly stats.
Given the stats below, generate a JSON response with EXACTLY these six keys:
- "summary": A short, fun hype-summary of their programming year (2 sentences max).
- "roast": A playful but savage roast based on these coding habits (e.g. coding strictly on weekends, tech stack choices).
- "suggestions": A single plain text string (not an array) with 2-3 short recommendations for skills to learn next year, written as natural prose.
- "personality": A developer personality diagnosis title (e.g. "The Open-Source Ninja", "The Midnight Debugger").
- "commitAnalysis": A short, funny psychological evaluation based EXCLUSIVELY on reading their actual raw commit messages (e.g. "You used the word 'fix' 47 times. You sound violently stressed.").
- "projectIdeas": An array of exactly 3 highly tailored, creative side-project architecture ideas they should build next year based strictly on analyzing their top programming languages and code patterns. Each item must have a "title" string and a detailed "desc" string.

Stats:
- Total Commits: ${data.totalCommits || 0}
- Best Month: ${data.bestMonth || 'None'}
- Most Active Time: ${data.mostActiveTime || 'Unknown'}
- PRs Opened: ${data.searchStats?.prsOpened || 0}
- Issues Opened: ${data.searchStats?.issuesOpened || 0}
- Code Reviews: ${data.searchStats?.reviewComments || 0}
- Lines Added/Deleted: +${data.linesAdded || 0} / -${data.linesDeleted || 0}
- Top Languages: ${languageStr}
- Longest Streak: ${data.longestStreak || 0} days
- External Commits: ${data.externalCommits || 0}

Recent Commits Snippet:
${(data.recentCommits || []).join(" | ").slice(0, 1500)}

Return ONLY raw JSON, with no markdown code blocks or extra text.`;

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      response_format: { type: "json_object" }
    })
  });

  if (!res.ok) {
    throw new Error("Failed to fetch AI review");
  }

  const result = await res.json();
  const content = result.choices[0].message.content;
  try {
    return JSON.parse(content.trim());
  } catch (e) {
    throw new Error("Invalid AI JSON response");
  }
}
