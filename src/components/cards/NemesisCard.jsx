import { useEffect, useState } from "react";
import { fetchProfile, fetchRepos, fetchEvents } from "../../api/github";

function calculateSimilarity(u1, u2) {
  // Lower distance is better
  const commitDiff = Math.abs(u1.totalCommits - u2.totalCommits);
  const streakDiff = Math.abs(u1.longestStreak - u2.longestStreak) * 10;
  const starsDiff = Math.abs(u1.totalStars - u2.totalStars) * 5;
  return commitDiff + streakDiff + starsDiff;
}

export default function NemesisCard({ data }) {
  const [visible, setVisible] = useState(false);
  const [nemesis, setNemesis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    async function huntNemesis() {
      try {
        const token = sessionStorage.getItem("gh_token") || "";
        const username = data.profile.login;

        // 1. Gather candidates from followers/following
        const [followersRes, followingRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}/followers?per_page=10`, {
            headers: token ? { Authorization: `token ${token}` } : {}
          }),
          fetch(`https://api.github.com/users/${username}/following?per_page=10`, {
            headers: token ? { Authorization: `token ${token}` } : {}
          })
        ]);

        let candidates = [];
        if (followersRes.ok) candidates = candidates.concat(await followersRes.json());
        if (followingRes.ok) candidates = candidates.concat(await followingRes.json());
        
        candidates = [...new Set(candidates.map(c => c.login))].filter(c => c !== username);

        // Fallback global array if account has zero network
        if (candidates.length === 0) {
          candidates = ["torvalds", "sindresorhus", "tj", "gaearon", "leerob"];
        }

        // Randomly pick up to 3 to avoid rate limits
        const shuffled = candidates.sort(() => 0.5 - Math.random()).slice(0, 3);

        // 2. Fetch lightweight stats securely for the 3 candidates
        const year = data.year;
        const candidateStats = await Promise.all(
          shuffled.map(async (login) => {
            try {
              const [profile, repos, events] = await Promise.all([
                fetchProfile(login, token),
                fetchRepos(login, token),
                fetchEvents(login, token)
              ]);

              const pushEvents = events.filter(e => e.type === "PushEvent" && new Date(e.created_at).getFullYear() === year);
              const totalCommits = pushEvents.reduce((s, e) => s + (e.payload?.size || 0), 0);
              const totalStars = repos.filter(r => !r.fork).reduce((s, r) => s + r.stargazers_count, 0);
              
              const activeDays = new Set(events.filter(e => new Date(e.created_at).getFullYear() === year).map(e => e.created_at.slice(0,10)));
              const sortedDays = Array.from(activeDays).sort();
              let longestStreak = 0; let streak = sortedDays.length > 0 ? 1 : 0;
              for (let i = 1; i < sortedDays.length; i++) {
                const diff = (new Date(sortedDays[i]) - new Date(sortedDays[i - 1])) / 86400000;
                if (diff === 1) streak++; else { longestStreak = Math.max(longestStreak, streak); streak = 1; }
              }
              longestStreak = Math.max(longestStreak, streak);

              return { login, avatar: profile.avatar_url, totalCommits, totalStars, longestStreak };
            } catch (err) {
              return null;
            }
          })
        );

        // 3. Find the closest match
        const validStats = candidateStats.filter(Boolean);
        if (validStats.length === 0) throw new Error("Could not parse rivals");

        let bestNemesis = validStats[0];
        let lowestScore = Infinity;

        for (const rival of validStats) {
          const score = calculateSimilarity(data, rival);
          if (score < lowestScore) {
            lowestScore = score;
            bestNemesis = rival;
          }
        }

        setNemesis(bestNemesis);
      } catch (e) {
        console.error("Nemesis scan failed", e);
      } finally {
        setLoading(false);
      }
    }

    huntNemesis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={s.card}>
      <div style={s.dots} aria-hidden />
      <div style={{...s.inner, opacity: visible ? 1:0, transform: visible ? "scale(1)":"scale(0.95)", transition: "all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}>
        
        <div style={s.topRow}>
          <span style={s.eyebrow}>Nemesis Mode 🥊</span>
        </div>

        {loading ? (
          <div style={s.loadingBox}>
            <div style={s.radar} />
            <p style={s.scanningText}>Locating your closest rival on GitHub...</p>
            <p style={s.hint}>Analyzing follower network telemetry</p>
          </div>
        ) : nemesis ? (
          <div style={s.content}>
            <h2 style={s.title}>Your Closest Rival 👀</h2>
            
            <div style={s.versusArena}>
              <div style={s.playerNode}>
                <img src={data.profile.avatar} alt="You" style={s.avi} />
                <span style={s.handle}>You</span>
              </div>
              <div style={s.vsText}>VS</div>
              <div style={s.playerNode}>
                <img src={nemesis.avatar} alt="Rival" style={{...s.avi, borderColor: "#ef4444"}} />
                <span style={{...s.handle, color: "#ef4444"}}>@{nemesis.login}</span>
              </div>
            </div>

            <div style={s.statsGrid}>
              <StatRow label="Commits" v1={data.totalCommits} v2={nemesis.totalCommits} />
              <StatRow label="Streak" v1={data.longestStreak} v2={nemesis.longestStreak} />
              <StatRow label="Stars" v1={data.totalStars} v2={nemesis.totalStars} />
            </div>

            <p style={s.verdict}>
              {data.totalCommits > nemesis.totalCommits 
                ? `You're crushing @${nemesis.login} by ${data.totalCommits - nemesis.totalCommits} commits!`
                : `@${nemesis.login} beat you by ${nemesis.totalCommits - data.totalCommits} commits. Time to code.`}
            </p>
          </div>
        ) : (
          <div style={s.loadingBox}>
            <p style={s.scanningText}>Nemesis evasion active.</p>
            <p style={s.hint}>No viable rivals detected on the network.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatRow({ label, v1, v2 }) {
  const winner = v1 > v2 ? 1 : v2 > v1 ? 2 : 0;
  return (
    <div style={s.statRow}>
      <span style={{...s.v1, opacity: winner === 1 ? 1 : 0.4}}>{v1}</span>
      <span style={s.statLabel}>{label}</span>
      <span style={{...s.v2, opacity: winner === 2 ? 1 : 0.4}}>{v2}</span>
    </div>
  );
}

const s = {
  card: { width: "100%", maxWidth: 420, aspectRatio: "9 / 16", background: "#110c11", borderRadius: 24, position: "relative", overflow: "hidden", border: "1px solid rgba(239, 68, 68, 0.15)", display: "flex", flexDirection: "column" },
  dots: { position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(239,68,68,0.05) 1px, transparent 1px)", backgroundSize: "20px 20px" },
  inner: { position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", padding: "28px 24px 24px" },
  topRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  eyebrow: { fontSize: 13, color: "#ef4444", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700 },
  loadingBox: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textContent: "center" },
  radar: { width: 48, height: 48, borderRadius: "50%", border: "2px solid rgba(239,68,68,0.2)", borderTopColor: "#ef4444", animation: "spin 1s linear infinite", marginBottom: 24 },
  scanningText: { fontSize: 16, color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, margin: "0 0 8px", textAlign: "center" },
  hint: { fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace", textAlign: "center" },
  content: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", paddingBottom: 12 },
  title: { fontSize: 28, fontWeight: 800, lineHeight: 1.1, fontFamily: "'Syne', sans-serif", margin: "0", color: "#fff", textAlign: "center" },
  versusArena: { display: "flex", justifyContent: "center", alignItems: "center", gap: 16, margin: "24px 0" },
  playerNode: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flex: 1 },
  avi: { width: 64, height: 64, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.15)", objectFit: "cover" },
  handle: { fontSize: 12, color: "#fff", fontFamily: "'DM Mono', monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 100 },
  vsText: { fontSize: 20, fontWeight: 800, color: "rgba(239,68,68,0.6)", fontFamily: "'Syne', sans-serif", fontStyle: "italic" },
  statsGrid: { display: "flex", flexDirection: "column", gap: 12, background: "rgba(239,68,68,0.03)", borderRadius: 16, border: "1px solid rgba(239,68,68,0.1)", padding: "16px" },
  statRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  v1: { fontSize: 18, color: "#fff", fontWeight: 700, fontFamily: "'DM Mono', monospace", flex: 1, textAlign: "left" },
  statLabel: { fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'DM Mono', monospace" },
  v2: { fontSize: 18, color: "#ef4444", fontWeight: 700, fontFamily: "'DM Mono', monospace", flex: 1, textAlign: "right" },
  verdict: { fontSize: 14, color: "rgba(239,68,68,0.8)", fontFamily: "'DM Mono', monospace", textAlign: "center", marginTop: 24, lineHeight: 1.5 }
};
