export default function UpcomingFeatures() {
  const features = [
    { title: "Roast Generator", desc: "Shareable AI roasting visual cards", icon: "😈" },
    { title: "Personality Quiz", desc: "Interactive 'What dev are you?' test", icon: "🧠" },
    { title: "Team Wrapped", desc: "Aggregate entire org repositories", icon: "👥" },
    { title: "Code Smell Detector", desc: "Heuristic latency & sleep analysis", icon: "☕" },
    { title: "Collaboration Graph", desc: "Network visualizer of your peers", icon: "🌐" }
  ];

  return (
    <div style={s.card}>
      <p style={s.eyebrow}>🚀 In Development</p>
      <h3 style={s.header}>Coming in the next update</h3>
      
      <div style={s.list}>
        {features.map((f, i) => (
           <div key={i} style={s.row}>
             <div style={s.iconBox}>{f.icon}</div>
             <div style={s.textCol}>
                <p style={s.title}>{f.title}</p>
                <p style={s.desc}>{f.desc}</p>
             </div>
             <span style={s.badge}>IN DEV</span>
           </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  card: { width: "100%", maxWidth: 420, background: "rgba(255,255,255,0.02)", borderRadius: 24, padding: "24px", border: "1px solid rgba(255,255,255,0.05)" },
  eyebrow: { margin: "0 0 8px", fontSize: 12, color: "#60a5fa", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 },
  header: { margin: "0 0 24px", fontSize: 20, color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800 },
  list: { display: "flex", flexDirection: "column", gap: 16 },
  row: { display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.03)" },
  iconBox: { width: 36, height: 36, background: "rgba(255,255,255,0.05)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 },
  textCol: { flex: 1, display: "flex", flexDirection: "column", gap: 4 },
  title: { margin: 0, fontSize: 13, color: "#fff", fontFamily: "'DM Mono', monospace", fontWeight: 700 },
  desc: { margin: 0, fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace" },
  badge: { fontSize: 9, color: "#4ade80", border: "1px solid rgba(74,222,128,0.3)", background: "rgba(74,222,128,0.1)", padding: "4px 6px", borderRadius: 4, fontFamily: "'DM Mono', monospace", fontWeight: 700, letterSpacing: "0.05em" }
};
