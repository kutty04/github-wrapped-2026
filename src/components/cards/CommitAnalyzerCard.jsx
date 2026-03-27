import { useEffect, useState } from "react";

export default function CommitAnalyzerCard({ data }) {
  const [visible, setVisible] = useState(false);
  const analysis = data.ai?.commitAnalysis || "You just type 'update' and press Enter. A true minimalist.";

  useEffect(() => { const t = setTimeout(() => setVisible(true), 50); return () => clearTimeout(t); }, []);

  return (
    <div style={{ ...s.card, opacity: visible ? 1:0, transform: visible ? "scale(1)":"scale(0.95)", transition: "all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}>
      <p style={s.eyebrow}>AI Commit Analyzer</p>
      <h3 style={s.header}>Psychological Profiling</h3>
      <div style={s.analysisWrap}>
         <span style={s.icon}>🧠</span>
         <p style={s.analysisText}>"{analysis}"</p>
      </div>
      <div style={s.commitSample}>
         <p style={s.sampleHeader}>RECENT SAMPLES</p>
         <div style={s.sampleFeed}>
            {(data.recentCommits || []).slice(0, 4).map((msg, i) => (
               <div key={i} style={s.sampleRow}>
                  <span style={s.hash}>{Math.random().toString(16).slice(2, 9)}</span>
                  <span style={s.msg}>{msg.length > 35 ? msg.slice(0,35)+"..." : msg}</span>
               </div>
            ))}
            {(!data.recentCommits || data.recentCommits.length === 0) && (
               <span style={s.msg}>No recent commit messages found in cache...</span>
            )}
         </div>
      </div>
    </div>
  );
}

const s = {
  card: { width: "100%", maxWidth: 420, height: 420, background: "#0a0c10", border: "1px solid rgba(168, 85, 247, 0.2)", borderRadius: 24, padding: "24px", display: "flex", flexDirection: "column" },
  eyebrow: { margin: "0 0 8px", fontSize: 13, color: "#a855f7", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 },
  header: { margin: "0 0 24px", fontSize: 22, color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800 },
  analysisWrap: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 16, background: "rgba(168, 85, 247, 0.05)", padding: "24px", borderRadius: 16, border: "1px solid rgba(168, 85, 247, 0.08)" },
  icon: { fontSize: 40, filter: "drop-shadow(0 0 12px rgba(168,85,247,0.5))" },
  analysisText: { fontSize: 16, color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, margin: 0, lineHeight: 1.4, fontStyle: "italic" },
  commitSample: { marginTop: 16, background: "rgba(255,255,255,0.02)", borderRadius: 12, padding: "16px" },
  sampleHeader: { margin: "0 0 12px", fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.05em" },
  sampleFeed: { display: "flex", flexDirection: "column", gap: 8 },
  sampleRow: { display: "flex", gap: 12, fontSize: 12, fontFamily: "'DM Mono', monospace" },
  hash: { color: "#a855f7" },
  msg: { color: "rgba(255,255,255,0.6)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }
};
