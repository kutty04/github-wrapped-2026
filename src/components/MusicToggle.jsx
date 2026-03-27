import { useState, useRef, useEffect } from "react";

export default function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    /* Safe Creative-Commons royalty free Lo-fi fallback track */
    audioRef.current = new Audio("https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    return () => {
      audioRef.current.pause();
    };
  }, []);

  function toggle() {
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setPlaying(!playing);
  }

  return (
    <button onClick={toggle} style={s.btn} title="Toggle background music">
      <span style={{...s.icon, animation: playing ? "pulseAudio 2s infinite" : "none" }}>
        {playing ? "🔊" : "🔈"}
      </span>
      <style>{`
        @keyframes pulseAudio {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 0.8; }
        }
      `}</style>
    </button>
  );
}

const s = {
  btn: { position: "fixed", bottom: 20, right: 20, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 99, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 9999, transition: "background 0.2s" },
  icon: { fontSize: 18 }
};
