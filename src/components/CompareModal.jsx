import { useState } from "react";
import { fetchProfile, fetchEvents, fetchRepos } from "../api/github";

export default function CompareModal({ data1, onClose }) {
  const [user2, setUser2] = useState("");
  const [loading, setLoading] = useState(false);
  const [data2, setData2] = useState(null);
  const [error, setError] = useState(null);

  async function fetchStats() {
    if (!user2.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const year = data1.year;
      const profile = await fetchProfile(user2.trim(), "");
      const events = await fetchEvents(user2.trim(), "");
      const repos = await fetchRepos(user2.trim(), "");
      
      const pushEvents = events.filter(e => e.type === "PushEvent" && new Date(e.created_at).getFullYear() === year);
      const commits = pushEvents.reduce((s, e) => s + (e.payload?.size || 0), 0);
      const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
      const ownedRepos = repos.filter(r => !r.fork).length;

      setData2({
        profile: { login: profile.login, avatar: profile.avatar_url },
        commits,
        totalStars,
        ownedRepos
      });
    } catch (err) {
      setError("User not found or rate limit hit!");
    }
    setLoading(false);
  }

  return (
    <div style={s.overlay}>
      <div style={s.modal}>
        <button onClick={onClose} style={s.closeBtn}>×</button>
        <h3 style={s.title}>Compare Stats</h3>
        
        {!data2 && (
          <div style={s.inputWrap}>
            <input 
               value={user2} 
               onChange={e => setUser2(e.target.value)} 
               placeholder="Enter GitHub username..." 
               style={s.input}
            />
            <button onClick={fetchStats} disabled={loading} style={s.btn}>
               {loading ? "..." : "Compare"}
            </button>
            {error && <p style={{color:"red", fontSize: 11, marginTop: 8}}>{error}</p>}
          </div>
        )}

        {data2 && (
          <div style={s.grid}>
             {/* Header */}
             <div style={s.col}>
               <img src={data1.profile.avatar} style={s.avatar} alt="u1" />
               <p style={s.username}>@{data1.profile.login}</p>
             </div>
             <div style={s.vs}>VS</div>
             <div style={s.col}>
               <img src={data2.profile.avatar} style={s.avatar} alt="u2" />
               <p style={s.username}>@{data2.profile.login}</p>
             </div>

             {/* Commits */}
             <div style={s.statBox1}>{data1.totalCommits.toLocaleString()}</div>
             <div style={s.statName}>Commits</div>
             <div style={s.statBox2}>{data2.commits.toLocaleString()}</div>

             {/* Stars */}
             <div style={s.statBox1}>{data1.totalStars.toLocaleString()}</div>
             <div style={s.statName}>Stars</div>
             <div style={s.statBox2}>{data2.totalStars.toLocaleString()}</div>

             {/* Repos */}
             <div style={s.statBox1}>{data1.ownedRepos.toLocaleString()}</div>
             <div style={s.statName}>Repos</div>
             <div style={s.statBox2}>{data2.ownedRepos.toLocaleString()}</div>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99999, backdropFilter: "blur(4px)" },
  modal: { width: "100%", maxWidth: 360, background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 24, position: "relative" },
  closeBtn: { position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "#fff", fontSize: 24, cursor: "pointer", opacity: 0.5 },
  title: { margin: "0 0 20px", fontSize: 18, color: "#fff", fontFamily: "'Syne', sans-serif" },
  inputWrap: { display: "flex", gap: 8, flexDirection: "column" },
  input: { padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontFamily: "'DM Mono', monospace" },
  btn: { padding: "12px", background: "#4ade80", border: "none", borderRadius: 8, color: "#000", fontWeight: "bold", cursor: "pointer", fontFamily: "'DM Mono', monospace" },
  grid: { display: "grid", gridTemplateColumns: "1fr 40px 1fr", gap: "16px 8px", alignItems: "center", textAlign: "center" },
  col: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8 },
  avatar: { width: 48, height: 48, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.1)" },
  username: { fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Mono', monospace" },
  vs: { fontSize: 12, fontWeight: "bold", color: "rgba(255,255,255,0.3)" },
  statBox1: { background: "rgba(56, 189, 248, 0.1)", color: "#38bdf8", padding: "12px 0", borderRadius: 8, fontFamily: "'DM Mono', monospace", fontWeight: "bold" },
  statBox2: { background: "rgba(250, 204, 21, 0.1)", color: "#facc15", padding: "12px 0", borderRadius: 8, fontFamily: "'DM Mono', monospace", fontWeight: "bold" },
  statName: { fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em" },
};
