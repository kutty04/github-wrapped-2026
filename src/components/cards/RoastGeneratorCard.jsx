import { useEffect, useState, useRef } from "react";

export default function RoastGeneratorCard({ data }) {
  const [visible, setVisible] = useState(false);
  const posterRef = useRef(null);

  useEffect(() => { const t = setTimeout(() => setVisible(true), 50); return () => clearTimeout(t); }, []);

  async function handleDownload() {
    if (!window.html2canvas || !posterRef.current) return;
    const canvas = await window.html2canvas(posterRef.current, { scale: 3, backgroundColor: "#0a0a0a", useCORS: true });
    const link = document.createElement("a");
    link.download = `roast-${data.profile.login}-${data.year}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  // Fallback if AI roast failed to generate or bypass via limits
  const roastText = data.ai?.roast || "You commit like it's a group project — last minute and completely untested 💀";

  return (
    <div style={s.card}>
      <div style={s.dots} aria-hidden />
      <div style={{...s.inner, opacity: visible ? 1:0, transform: visible ? "scale(1)":"scale(0.95)", transition: "all 0.6s ease" }}>
        
        {/* The Shareable Poster Area */}
        <div ref={posterRef} style={s.poster}>
           <div style={s.posterTop}>
              <img src={data.profile.avatar} alt="avi" style={s.posterAvi} />
              <span style={s.posterUser}>@{data.profile.login}'s {data.year} Roast</span>
           </div>
           
           <h1 style={s.roastText}>"{roastText}"</h1>
           
           <div style={s.posterBot}>
              <span style={s.brand}>GitHub Wrapped</span>
           </div>
        </div>

        <button onClick={handleDownload} style={s.btn}>
           📸 Save Roast as Poster
        </button>

      </div>
    </div>
  );
}

const s = {
  card: { width: "100%", maxWidth: 420, aspectRatio: "9 / 16", background: "#0a0c10", borderRadius: 24, position: "relative", overflow: "hidden", border: "1px solid rgba(239,68,68,0.07)", display: "flex", flexDirection: "column" },
  dots: { position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(239,68,68,0.03) 1px, transparent 1px)", backgroundSize: "20px 20px" },
  inner: { position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", padding: "24px", justifyContent: "center", gap: 24 },
  poster: { width: "100%", background: "#050505", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 16, padding: "32px 24px", display: "flex", flexDirection: "column", gap: 32, boxShadow: "0 20px 40px -10px rgba(239,68,68,0.1)", position: "relative", overflow: "hidden" },
  posterTop: { display: "flex", alignItems: "center", gap: 12 },
  posterAvi: { width: 32, height: 32, borderRadius: "50%", border: "2px solid #ef4444" },
  posterUser: { fontSize: 12, color: "#ef4444", fontFamily: "'DM Mono', monospace", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" },
  roastText: { fontSize: 22, color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, margin: 0, lineHeight: 1.35, fontStyle: "italic" },
  posterBot: { display: "flex", justifyContent: "flex-end" },
  brand: { fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em" },
  btn: { width: "100%", background: "linear-gradient(90deg, #ef4444, #f97316)", color: "#000", border: "none", borderRadius: 12, padding: "16px", fontSize: 15, fontWeight: 800, fontFamily: "'Syne', sans-serif", cursor: "pointer", transition: "opacity 0.2s" }
};
