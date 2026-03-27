import { useEffect, useState } from "react";

function getCodeSmell(data) {
  const { mostActiveTime, mostActiveDay, totalCommits, linesDeleted } = data;
  
  if (mostActiveTime === "Night" && (mostActiveDay === "Fri" || mostActiveDay === "Sat")) {
    return { title: "Vampire Mode 🦇", desc: "You push code entirely in the dark. Are you okay?" };
  }
  if (mostActiveTime === "Morning") {
    return { title: "Caffeine Driven ☕", desc: "You code best heavily caffeinated. 80% of your complex PRs happen before 10 AM." };
  }
  if (linesDeleted > totalCommits * 50) {
    return { title: "The Grim Reaper 🪓", desc: "You brutally deleted massive chunks of code this year. Refactoring champion." };
  }
  if (totalCommits > 1000) {
    return { title: "Sweat & Tears 💦", desc: "Your mechanical keyboard desperately needs a vacation." };
  }
  
  return { title: "Clean & Tidy 🧼", desc: "No obvious heuristic smells detected in your commit history. Boring, but highly employable." };
}

export default function CodeSmellCard({ data }) {
  const [visible, setVisible] = useState(false);
  const smell = getCodeSmell(data);

  useEffect(() => { const t = setTimeout(() => setVisible(true), 50); return () => clearTimeout(t); }, []);

  return (
    <div style={{ ...s.card, opacity: visible ? 1:0, transform: visible ? "scale(1)":"scale(0.95)", transition: "all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}>
      <p style={s.eyebrow}>Telemetry Insight</p>
      <h3 style={s.header}>Code Smell Detector</h3>
      <div style={s.smellWrap}>
         <span style={s.emoji}>{smell.title.slice(-2)}</span>
         <h2 style={s.title}>{smell.title.slice(0, -2)}</h2>
         <p style={s.desc}>{smell.desc}</p>
      </div>
    </div>
  );
}

const s = {
  card: { width: "100%", maxWidth: 420, height: 320, background: "rgba(234, 179, 8, 0.03)", border: "1px solid rgba(234, 179, 8, 0.2)", borderRadius: 24, padding: "24px", display: "flex", flexDirection: "column" },
  eyebrow: { margin: "0 0 8px", fontSize: 13, color: "#facc15", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 },
  header: { margin: "0 0 24px", fontSize: 22, color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800 },
  smellWrap: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 16, background: "rgba(234, 179, 8, 0.05)", padding: "24px", borderRadius: 16, border: "1px solid rgba(234, 179, 8, 0.08)" },
  emoji: { fontSize: 56, lineHeight: 1 },
  title: { fontSize: 24, color: "#facc15", fontFamily: "'Syne', sans-serif", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" },
  desc: { fontSize: 14, color: "rgba(255,255,255,0.6)", fontFamily: "'DM Mono', monospace", margin: 0, lineHeight: 1.5 }
};
