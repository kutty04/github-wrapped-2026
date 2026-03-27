import { useEffect, useState } from "react";

export default function YearComparisonCard({ data }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const cur = data.totalCommits || 0;
  const prev = data.searchStats?.lastYearCommits || 0;
  const diff = cur - prev;
  const pct = prev > 0 ? Math.round((diff / prev) * 100) : 100;
  
  const isUp = diff >= 0;
  const trendColor = isUp ? "#4ade80" : "#f43f5e";
  const bgBadge = isUp ? "rgba(74, 222, 128, 0.1)" : "rgba(244, 63, 94, 0.1)";
  const sign = isUp ? "+" : "";

  return (
    <div style={s.card}>
      <div style={{ ...s.inner, opacity: visible ? 1:0, transform: visible ? "scale(1)":"scale(0.95)", transition: "all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}>
         <p style={s.eyebrow}>Velocity Architecture</p>
         <h2 style={s.title}>{data.year} vs {data.year - 1}</h2>
         
         <div style={s.comparisonWrap}>
            <div style={s.statBox}>
               <span style={s.statLabel}>{data.year - 1}</span>
               <span style={s.statNum}>{prev.toLocaleString()}</span>
            </div>
            
            <div style={s.divider}>
               <span style={{ fontSize: 24, color: "rgba(255,255,255,0.2)" }}>VS</span>
            </div>

            <div style={s.statBox}>
               <span style={s.statLabel}>{data.year}</span>
               <span style={{...s.statNum, color: "#fff"}}>{cur.toLocaleString()}</span>
            </div>
         </div>
         
         <div style={{...s.badge, background: bgBadge, color: trendColor, border: `1px solid ${trendColor}40`}}>
            {sign}{pct}% {isUp ? "Growth" : "Decrease"} YoY
         </div>

         <p style={s.desc}>
            {isUp 
               ? "Your output actively expanded this year. The momentum is visibly compounding." 
               : "You pushed less raw volume this year—let's assume you transitioned to a senior role strictly reviewing PRs."}
         </p>
      </div>
    </div>
  );
}

const s = {
  card: { width: "100%", maxWidth: 420, height: 380, background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: "24px", display: "flex", flexDirection: "column" },
  inner: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" },
  eyebrow: { margin: "0 0 8px", fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 },
  title: { margin: "0 0 32px", fontSize: 28, color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "-0.02em" },
  comparisonWrap: { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.02)", padding: "24px 16px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)" },
  statBox: { flex: 1, display: "flex", flexDirection: "column", gap: 8 },
  statLabel: { fontSize: 14, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Mono', monospace", fontWeight: 700 },
  statNum: { fontSize: 32, color: "rgba(255,255,255,0.5)", fontFamily: "'Syne', sans-serif", fontWeight: 800 },
  divider: { padding: "0 8px" },
  badge: { marginTop: 32, padding: "8px 24px", borderRadius: 99, fontFamily: "'DM Mono', monospace", fontWeight: 800, fontSize: 16, letterSpacing: "0.05em" },
  desc: { margin: "24px 0 0", fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace", lineHeight: 1.5, padding: "0 12px" }
};
