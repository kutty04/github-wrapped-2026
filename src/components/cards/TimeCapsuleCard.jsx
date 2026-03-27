import { useEffect, useState } from "react";

export default function TimeCapsuleCard({ data }) {
  const [visible, setVisible] = useState(false);
  const [unlockedMsg, setUnlockedMsg] = useState(null);
  const [newMsg, setNewMsg] = useState("");
  const [saved, setSaved] = useState(false);

  const currentYear = data.year;
  const username = data.profile.login;
  const storageKeyCurrent = `timeCapsule_${username}_${currentYear}`;
  const storageKeyNext = `timeCapsule_${username}_${currentYear + 1}`;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    
    // Decrypt/Unlock previous year's message if it exists
    const msg = localStorage.getItem(storageKeyCurrent);
    if (msg) setUnlockedMsg(msg);
    
    // Check if they already wrote one for the upcoming year
    if (localStorage.getItem(storageKeyNext)) {
      setSaved(true);
    }
    return () => clearTimeout(t);
  }, [storageKeyCurrent, storageKeyNext]);

  function handleSave() {
    if (!newMsg.trim()) return;
    localStorage.setItem(storageKeyNext, newMsg.trim());
    setSaved(true);
  }

  return (
    <div style={s.card}>
      <div style={s.dots} aria-hidden />
      <div style={{...s.inner, opacity: visible ? 1:0, transform: visible ? "translateY(0)":"translateY(20px)", transition: "all 0.6s ease" }}>
        
        <div style={s.topLabel}>
          <img src={data.profile.avatar} alt={username} style={s.avatar} />
          <span style={s.username}>@{username}</span>
        </div>

        <div style={s.content}>
          {unlockedMsg && (
            <div style={{ marginBottom: 24 }}>
               <p style={s.eyebrow}>Time Capsule Unlocked 🔓</p>
               <h2 style={s.title}>Message from {currentYear - 1}:</h2>
               <div style={s.messageBox}>
                 <p style={s.messageText}>"{unlockedMsg}"</p>
               </div>
            </div>
          )}

          <div style={s.formWrapper}>
             <p style={s.eyebrow}>Time Capsule 🕰️</p>
             <h2 style={s.title}>Write to your {currentYear + 1} self</h2>
             
             {saved ? (
               <div style={s.successBox}>
                 <span style={{ fontSize: 28 }}>🔒</span>
                 <p style={s.successText}>Message sealed.</p>
                 <p style={s.hint}>See you in {currentYear + 1}!</p>
               </div>
             ) : (
               <div style={s.formBox}>
                 <textarea 
                   style={s.textArea} 
                   placeholder="Did I finally learn Rust?..." 
                   value={newMsg}
                   onChange={e => setNewMsg(e.target.value)}
                   maxLength={180}
                 />
                 <button onClick={handleSave} disabled={!newMsg.trim()} style={s.btn}>
                   Seal Capsule
                 </button>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  card: { width: "100%", maxWidth: 420, aspectRatio: "9 / 16", background: "#0f1117", borderRadius: 24, position: "relative", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column" },
  dots: { position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" },
  inner: { position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", padding: "28px 24px 24px" },
  topLabel: { display: "flex", alignItems: "center", gap: 8, marginBottom: 24 },
  avatar: { width: 28, height: 28, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.15)" },
  username: { fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Mono', monospace" },
  content: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", overflowY: "auto", paddingRight: 4 },
  eyebrow: { fontSize: 13, color: "#a78bfa", margin: "0 0 4px", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase" },
  title: { fontSize: 20, fontWeight: 800, lineHeight: 1.2, fontFamily: "'Syne', sans-serif", margin: "0 0 16px", color: "#fff" },
  messageBox: { background: "rgba(167, 139, 250, 0.1)", border: "1px solid rgba(167, 139, 250, 0.2)", borderRadius: 12, padding: "16px", position: "relative" },
  messageText: { fontSize: 14, color: "#ddd", fontFamily: "system-ui, sans-serif", lineHeight: 1.4, margin: 0, fontStyle: "italic" },
  formWrapper: { display: "flex", flexDirection: "column" },
  formBox: { display: "flex", flexDirection: "column", gap: 10 },
  textArea: { width: "100%", height: 80, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "12px", color: "#fff", fontSize: 13, fontFamily: "'DM Mono', monospace", resize: "none", outline: "none", lineHeight: 1.5 },
  btn: { background: "#a78bfa", color: "#000", border: "none", borderRadius: 8, padding: "12px", fontSize: 14, fontWeight: "bold", fontFamily: "'DM Mono', monospace", cursor: "pointer", transition: "opacity 0.2s" },
  successBox: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "24px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" },
  successText: { fontSize: 15, color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, margin: 0 },
  hint: { fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace", textAlign: "center", margin: 0 }
};
