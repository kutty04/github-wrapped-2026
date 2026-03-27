import { useEffect, useState } from "react";

function getPersonality(data, answers = []) {
  const { totalCommits, longestStreak, topLanguages, mostActiveDay, ownedRepos } = data;
  const topLang = topLanguages[0]?.name || "code";

  const isHacker = answers.includes("hacker");
  const isNight = answers.includes("night") || ["Fri", "Sat", "Sun"].includes(mostActiveDay);
  const isOrder = answers.includes("order");
  const isChaos = answers.includes("chaos");

  if (isHacker && totalCommits > 100) {
    return { title: "The Terminal Wizard", subtitle: "Neovim open. Deep commits. You haven't touched your mouse since 2017.", color: "#4ade80", emoji: "🪄", stat: "Vim · High Committer" };
  }
  if (isNight && (topLang === "JavaScript" || topLang === "TypeScript")) {
    return { title: "The Midnight JS Dev", subtitle: "Dark mode only. You fix weird async bugs at 2 AM and push straight to main.", color: "#f7df1e", emoji: "🌙", stat: `Night Owl · JS Core` };
  }
  if ((topLang === "HTML" || topLang === "CSS") && isOrder) {
    return { title: "The UI Architect", subtitle: "Pixel perfect spacing. You care deeply about how your flexboxes align.", color: "#f472b6", emoji: "✨", stat: `Frontend · Detail Oriented` };
  }
  if (totalCommits > 300 && longestStreak > 14) {
    return { title: "The 10x Machine", subtitle: "You literally don't stop. Weekends, holidays — the terminal is always blazing.", color: "#f97316", emoji: "🔥", stat: `${totalCommits} commits · ${longestStreak} day streak` };
  }
  if (topLang === "Python" || topLang === "Jupyter Notebook") {
    return { title: "The Automator", subtitle: "If it takes 2 minutes manually, you'll spend 5 hours writing a Python script for it.", color: "#60a5fa", emoji: "🤖", stat: `Python · Scripting` };
  }
  if (totalCommits < 40 && ownedRepos > 4) {
    return { title: "The Idea Generator", subtitle: "You have 57 repositories with exactly 1 initial commit each. We respect the vision.", color: "#a78bfa", emoji: "💡", stat: `${ownedRepos} repos · Starting up` };
  }
  if (isChaos && longestStreak < 5) {
    return { title: "The Weekend Warrior", subtitle: "Tabs strictly. You don't code every day, but when you do, it's absolute chaos.", color: "#fb923c", emoji: "🌪️", stat: "Chaotic Good" };
  }
  
  return { title: "The Curious Builder", subtitle: "You try things, break things, and occasionally reading the docs. That's the game.", color: "#34d399", emoji: "🛠", stat: `${topLang} Explorer` };
}

const QUIZ_QUESTIONS = [
  { q: "Tabs or Spaces?", a: { label: "Tabs 🚀", trait: "chaos" }, b: { label: "Spaces 🕊️", trait: "order" } },
  { q: "IDE of choice?", a: { label: "VS Code 💻", trait: "modern" }, b: { label: "Neovim 🦇", trait: "hacker" } },
  { q: "When do you code?", a: { label: "2 AM 🦉", trait: "night" }, b: { label: "9 AM ☕", trait: "day" } }
];

export default function PersonalityCard({ data }) {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [pulse, setPulse] = useState(false);
  const [answers, setAnswers] = useState([]);

  // Generate conditional persona safely if step exceeds questions
  const persona = step >= QUIZ_QUESTIONS.length ? getPersonality(data, answers) : null;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (step >= QUIZ_QUESTIONS.length) {
      const t2 = setTimeout(() => setPulse(true), 800);
      return () => clearTimeout(t2);
    }
  }, [step]);

  function handleAnswer(trait) {
    setAnswers(prev => [...prev, trait]);
    setStep(s => s + 1);
  }

  return (
    <div style={{ ...s.card, borderColor: step >= QUIZ_QUESTIONS.length ? persona?.color + "30" : "rgba(167, 139, 250, 0.2)" }}>
      <div style={s.dots} aria-hidden />

      {step >= QUIZ_QUESTIONS.length && persona && (
        <div style={{ position: "absolute", inset: 0, zIndex: 0, background: `radial-gradient(ellipse at 50% 60%, ${persona.color}12 0%, transparent 70%)`, pointerEvents: "none" }} />
      )}

      <div style={{ ...s.inner, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
        
        <div style={s.topLabel}>
          <img src={data.profile.avatar} alt="avi" style={s.avatar} />
          <span style={s.username}>@{data.profile.login}</span><span style={s.yearBadge}>{data.year}</span>
        </div>

        {step < QUIZ_QUESTIONS.length ? (
           <div style={s.quizBox}>
              <p style={s.quizEyebrow}>Developer Diagnostics</p>
              <div style={s.questionWrap}>
                 <span style={s.stepCounter}>Q{step + 1} / {QUIZ_QUESTIONS.length}</span>
                 <h2 style={s.questionTitle}>{QUIZ_QUESTIONS[step].q}</h2>
              </div>
              <div style={s.optionsGrid}>
                 <button onClick={() => handleAnswer(QUIZ_QUESTIONS[step].a.trait)} style={s.quizBtn}>{QUIZ_QUESTIONS[step].a.label}</button>
                 <button onClick={() => handleAnswer(QUIZ_QUESTIONS[step].b.trait)} style={s.quizBtn}>{QUIZ_QUESTIONS[step].b.label}</button>
              </div>
           </div>
         ) : persona ? (
           <div style={{...s.center, animation: "fadeInUp 0.8s ease forwards"}}>
             <style>{`
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
             `}</style>
             <div style={{ ...s.emojiCircle, background: persona.color + "15", border: `2px solid ${persona.color}40`, transform: pulse ? "scale(1.08)" : "scale(1)", transition: "transform 0.4s ease" }}>
               <span style={s.emoji}>{persona.emoji}</span>
             </div>
             <p style={s.yourType}>your developer type</p>
             <h2 style={{ ...s.title, color: persona.color }}>{persona.title}</h2>
             <p style={s.subtitle}>{persona.subtitle}</p>
             <div style={{ ...s.statPill, background: persona.color + "10", border: `1px solid ${persona.color}30` }}>
               <span style={{ ...s.statText, color: persona.color }}>{persona.stat}</span>
             </div>
           </div>
         ) : null}

        {step >= QUIZ_QUESTIONS.length && (
          <div style={s.sharePrompt}>
            <p style={s.shareText}>github wrapped · {data.year}</p>
            <p style={s.shareUrl}>github-wrapped.vercel.app</p>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  card: { width: "100%", maxWidth: 420, aspectRatio: "9 / 16", background: "#0a0c10", borderRadius: 24, position: "relative", overflow: "hidden", border: "1px solid", display: "flex", flexDirection: "column" },
  dots: { position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" },
  inner: { position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", padding: "28px" },
  topLabel: { display: "flex", alignItems: "center", gap: 8, marginBottom: 0, flexShrink: 0 },
  avatar: { width: 28, height: 28, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.15)" },
  username: { fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Mono', monospace", flex: 1 },
  yearBadge: { fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace" },
  
  quizBox: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32 },
  quizEyebrow: { fontSize: 12, color: "#a78bfa", margin: 0, fontFamily: "'DM Mono', monospace", letterSpacing: "0.15em", textTransform: "uppercase", textAlign: "center", fontWeight: 800 },
  questionWrap: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 16 },
  stepCounter: { fontSize: 11, color: "#d8b4fe", fontFamily: "'DM Mono', monospace", letterSpacing: "0.2em", fontWeight: 700, background: "rgba(167,139,250,0.15)", padding: "4px 12px", borderRadius: 99, border: "1px solid rgba(167,139,250,0.3)" },
  questionTitle: { fontSize: 32, color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, margin: 0, lineHeight: 1.2, letterSpacing: "-0.02em" },
  optionsGrid: { display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 280 },
  quizBtn: { background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.3)", color: "#fff", padding: "16px 24px", borderRadius: 99, fontSize: 15, fontFamily: "'Syne', sans-serif", fontWeight: 800, cursor: "pointer", transition: "all 0.2s ease" },

  center: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 0 },
  emojiCircle: { width: 88, height: 88, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" },
  emoji: { fontSize: 40, lineHeight: 1 },
  yourType: { fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 12px", fontWeight: 700 },
  title: { fontSize: 36, fontWeight: 800, fontFamily: "'Syne', sans-serif", letterSpacing: "-0.03em", margin: "0 0 16px", lineHeight: 1 },
  subtitle: { fontSize: 15, color: "rgba(255,255,255,0.7)", fontFamily: "'Syne', sans-serif", lineHeight: 1.5, margin: "0 0 32px", maxWidth: 260, fontWeight: 600 },
  statPill: { padding: "10px 24px", borderRadius: 99, marginTop: 0 },
  statText: { fontSize: 12, fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", fontWeight: 700 },
  sharePrompt: { textAlign: "center", paddingTop: 16 },
  shareText: { fontSize: 11, color: "rgba(255,255,255,0.2)", fontFamily: "'DM Mono', monospace", margin: "0 0 2px" },
  shareUrl: { fontSize: 10, color: "rgba(255,255,255,0.15)", fontFamily: "'DM Mono', monospace", margin: 0 }
};
