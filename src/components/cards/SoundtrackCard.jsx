import { useEffect, useState } from "react";

function getSoundtrack(data) {
  const { topLanguages, mostActiveTime, longestStreak } = data;
  const lang = topLanguages[0]?.name || "code";

  if (mostActiveTime === "Night") return { genre: "Midnight Synthwave", artist: "Kavinsky vibes", cover: "🌌", search: "Midnight+Synthwave" };
  if (lang === "C++" || lang === "Rust" || lang === "C") return { genre: "Heavy Doom Metal", artist: "DOOM OST", cover: "🎸", search: "Doom+Metal+OST" };
  if (lang === "Python") return { genre: "Chill Lofi Beats", artist: "Lofi Girl", cover: "☕", search: "Lofi+Beats" };
  if (lang === "HTML" || lang === "CSS" || lang === "TypeScript") return { genre: "Upbeat Indie Pop", artist: "Dayglow vibes", cover: "✨", search: "Upbeat+Indie+Pop" };
  if (longestStreak > 20) return { genre: "Trance / Hardstyle", artist: "140 BPM Focus", cover: "🌀", search: "Hardstyle+Focus" };
  
  return { genre: "Ambient Electronic", artist: "Brian Eno vibes", cover: "🎧", search: "Ambient+Electronic+Study" };
}

export default function SoundtrackCard({ data }) {
  const [visible, setVisible] = useState(false);
  const track = getSoundtrack(data);

  useEffect(() => { const t = setTimeout(() => setVisible(true), 50); return () => clearTimeout(t); }, []);

  return (
    <div style={s.card}>
      <div style={{ ...s.inner, opacity: visible ? 1:0, transform: visible ? "scale(1)":"scale(0.95)", transition: "all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}>
         <p style={s.eyebrow}>Spotify Integration</p>
         <h2 style={s.title}>Your {data.year} Soundtrack</h2>
         
         <a href={`https://open.spotify.com/search/${track.search}/playlists`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
           <div style={s.player}>
              <div style={s.cover}>{track.cover}</div>
              <div style={s.info}>
                 <p style={s.genre}>{track.genre}</p>
                 <p style={s.artist}>{track.artist}</p>
              </div>
              <div style={s.playBtn}>▶</div>
           </div>
         </a>
         
         <p style={s.desc}>We analyzed your commit frequency and tech stack to algorithmically generate your perfect coding acoustic profile.</p>
      </div>
    </div>
  );
}

const s = {
  card: { width: "100%", maxWidth: 420, height: 320, background: "#0a0c10", border: "1px solid rgba(34, 197, 94, 0.15)", borderRadius: 24, padding: "24px", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" },
  inner: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" },
  eyebrow: { margin: "0 0 8px", fontSize: 13, color: "#4ade80", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 },
  title: { margin: "0 0 24px", fontSize: 24, color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "-0.02em" },
  player: { display: "flex", alignItems: "center", gap: 16, background: "rgba(34, 197, 94, 0.05)", padding: "16px", borderRadius: 16, border: "1px solid rgba(34, 197, 94, 0.2)", cursor: "pointer", transition: "background 0.2s" },
  cover: { width: 56, height: 56, background: "rgba(34, 197, 94, 0.1)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 },
  info: { flex: 1, display: "flex", flexDirection: "column", gap: 4 },
  genre: { margin: 0, fontSize: 16, color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700 },
  artist: { margin: 0, fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Mono', monospace" },
  playBtn: { width: 40, height: 40, borderRadius: "50%", background: "#4ade80", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, cursor: "pointer", transition: "transform 0.2s" },
  desc: { margin: "24px 0 0", fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace", lineHeight: 1.5, padding: "0 8px" }
};
