import { useEffect, useState } from "react";

export default function BentoCard({ data }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 50); return () => clearTimeout(t); }, []);

  const totalPRs = data.searchStats?.prsOpened || 0 + data.searchStats?.prsMerged || 0;
  const totalIssues = data.searchStats?.issuesOpened || 0 + data.searchStats?.issuesClosed || 0;

  return (
    <div style={s.card}>
      <div style={s.dots} aria-hidden />
      <div style={{...s.inner, opacity: visible ? 1:0, transform: visible ? "scale(1)":"scale(0.95)", transition: "all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}>
        
        <div style={s.topLabel}>
          <img src={data.profile.avatar} alt="Avi" style={s.avatar} />
          <span style={s.username}>@{data.profile.login}</span><span style={s.yearBadge}>{data.year}</span>
        </div>
        <p style={s.eyebrow}>The Developer Bento</p>

        <div style={s.grid}>
          
          {/* Box 1: Languages (Col 1-2, Row 1) */}
          <div style={{...s.box, gridColumn: "span 2", background: "rgba(59, 130, 246, 0.05)", border: "1px solid rgba(59, 130, 246, 0.2)"}}>
             <p style={s.boxTitle}>Top Stack</p>
             <div style={s.langBars}>
               {data.topLanguages.slice(0,3).map((l, i) => (
                 <div key={l.name} style={{...s.langRow, transitionDelay: `${i*100}ms`, opacity: visible ? 1:0, transform: visible ? "translateX(0)":"translateX(-10px)", transition: "all 0.4s ease"}}>
                   <span style={s.langName}>{l.name}</span>
                   <div style={s.barWrap}>
                     <div style={{...s.barFill, width: visible ? `${l.percent}%` : "0%", transition: "width 1s cubic-bezier(0.25, 1, 0.5, 1) 0.3s"}} />
                   </div>
                   <span style={s.langPct}>{l.percent}%</span>
                 </div>
               ))}
               {data.topLanguages.length === 0 && <span style={s.boxSub}>No lang data parsed</span>}
             </div>
          </div>

          {/* Box 2: Time (Col 1, Row 2) */}
          <div style={{...s.box, gridColumn: "span 1", background: "rgba(168, 85, 247, 0.05)", border: "1px solid rgba(168, 85, 247, 0.2)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "20px 16px"}}>
            <span style={{ fontSize: 32 }}>{data.mostActiveTime === "Night" ? "🦉" : data.mostActiveTime === "Morning" ? "🌅" : "☀️"}</span>
            <p style={{...s.boxTitle, margin: "12px 0 0", textAlign: "center", color: "#e879f9"}}>{data.mostActiveTime}</p>
            <p style={{...s.boxSub, textAlign: "center"}}>Coder</p>
          </div>

          {/* Box 3: Day (Col 2, Row 2) */}
          <div style={{...s.box, gridColumn: "span 1", background: "rgba(234, 179, 8, 0.05)", border: "1px solid rgba(234, 179, 8, 0.2)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "20px 16px"}}>
            <span style={{ fontSize: 24, color: "#facc15", fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>{data.mostActiveDay}</span>
            <p style={{...s.boxTitle, margin: "12px 0 0", textAlign: "center", color: "#fef08a"}}>Peak Day</p>
          </div>

          {/* Box 4: PRs & Issues (Col 1, Row 3) */}
          <div style={{...s.box, gridColumn: "span 1", background: "rgba(34, 197, 94, 0.05)", border: "1px solid rgba(34, 197, 94, 0.2)", padding: "16px"}}>
            <p style={{...s.boxTitle, color: "#4ade80"}}>Ship It</p>
            <div style={{ marginTop: 12 }}>
               <h3 style={{ margin: 0, fontSize: 18, color: "#fff", fontFamily: "'Syne', sans-serif" }}>{totalPRs}</h3>
               <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace" }}>Pull Requests</p>
            </div>
            <div style={{ marginTop: 12 }}>
               <h3 style={{ margin: 0, fontSize: 18, color: "#fff", fontFamily: "'Syne', sans-serif" }}>{totalIssues}</h3>
               <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace" }}>Issues Tracked</p>
            </div>
          </div>

          {/* Box 5: Collab / Code (Col 2, Row 3) */}
          <div style={{...s.box, gridColumn: "span 1", background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.2)", padding: "16px"}}>
            <p style={{...s.boxTitle, color: "#f87171"}}>Trimmings</p>
            <div style={{ marginTop: 12 }}>
               <h3 style={{ margin: 0, fontSize: 18, color: "#4ade80", fontFamily: "'Syne', sans-serif" }}>+{data.linesAdded > 9999 ? "99k" : data.linesAdded}</h3>
               <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace" }}>Lines Added</p>
            </div>
            <div style={{ marginTop: 12 }}>
               <h3 style={{ margin: 0, fontSize: 18, color: "#f87171", fontFamily: "'Syne', sans-serif" }}>-{data.linesDeleted > 9999 ? "99k" : data.linesDeleted}</h3>
               <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace" }}>Deleted</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const s = {
  card: { width: "100%", maxWidth: 420, aspectRatio: "9 / 16", background: "#0a0c10", borderRadius: 24, position: "relative", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column" },
  dots: { position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" },
  inner: { position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", padding: "28px 20px 24px" },
  topLabel: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12 },
  avatar: { width: 24, height: 24, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.15)" },
  username: { fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Mono', monospace" },
  yearBadge: { fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace", marginLeft: "auto" },
  eyebrow: { fontSize: 14, color: "#fbbf24", margin: "0 0 16px", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700 },
  grid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, flex: 1 },
  box: { borderRadius: 16, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" },
  boxTitle: { margin: 0, fontSize: 11, color: "rgba(255,255,255,0.6)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 },
  boxSub: { margin: 0, fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace", marginTop: 4 },
  langBars: { marginTop: 12, display: "flex", flexDirection: "column", gap: 10 },
  langRow: { display: "flex", alignItems: "center", gap: 12 },
  langName: { flexShrink: 0, width: 65, fontSize: 11, color: "#fff", fontFamily: "'DM Mono', monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  barWrap: { flex: 1, height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" },
  barFill: { height: "100%", background: "linear-gradient(90deg, #3b82f6, #60a5fa)", borderRadius: 3 },
  langPct: { fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace", width: 24, textAlign: "right", letterSpacing: "-0.04em" }
};
