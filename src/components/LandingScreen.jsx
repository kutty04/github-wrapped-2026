import { useState, useEffect } from "react";

export default function LandingScreen({ onSubmit, loading, progress, error }) {
  const [username, setUsername] = useState("");
  const [token, setToken] = useState(sessionStorage.getItem("gh_token") || "");
  const [year, setYear] = useState(new Date().getFullYear());
  const [backendReady, setBackendReady] = useState(false);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
    const wakeBackend = async () => {
      try {
        await fetch(`${backendUrl}/health`);
        setBackendReady(true);
      } catch {
        setTimeout(wakeBackend, 3000);
      }
    };
    wakeBackend();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (username.trim()) onSubmit(username.trim(), token.trim(), year);
  }

  function handleOAuth() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
    window.location.href = `${backendUrl}/auth/github`;
  }

  return (
    <div style={styles.root}>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes pulseBox { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
      `}</style>

      {/* Background grid */}
      <div style={styles.grid} aria-hidden />

      <div style={styles.content}>
        <div style={styles.badge}>2025 EDITION</div>

        <h1 style={styles.headline}>
          GitHub<br />
          <span style={styles.headlineAccent}>Wrapped</span>
        </h1>

        <p style={styles.sub}>
          Your entire year of code, distilled into one shareable story.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputWrap}>
            <span style={styles.at}>@</span>
            <input
              style={styles.input}
              type="text"
              placeholder="your-github-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
             <select 
               style={styles.yearSelect}
               value={year} 
               onChange={(e) => setYear(parseInt(e.target.value))}
               disabled={loading}
             >
               {[2026,2025,2024,2023,2022].map(y => (
                 <option key={y} value={y}>{y} Wrapped</option>
               ))}
             </select>
          </div>

          {!token && (
             backendReady ? (
               <button type="button" onClick={handleOAuth} style={styles.oauthBtn}>
                 Log in with GitHub (Recommended)
               </button>
             ) : (
               <button type="button" disabled style={{ ...styles.oauthBtn, opacity: 0.5, cursor: "wait", background: "transparent", border: "1px dashed rgba(255,255,255,0.2)" }}>
                 ☕ Waking up secure login server...
               </button>
             )
          )}

          {loading ? (
            <div style={styles.loaderBox}>
              <span style={styles.spinnerLg} />
              <p style={styles.progressText}>{progress || "Summoning stats..."}</p>
            </div>
          ) : (
            <button
              type="submit"
              disabled={!username.trim()}
              style={{
                ...styles.btn,
                opacity: !username.trim() ? 0.5 : 1,
                cursor: !username.trim() ? "not-allowed" : "pointer",
              }}
            >
              Generate my Wrapped →
            </button>
          )}

          {error && <p style={styles.error}>{error}</p>}
        </form>

        {!loading && (
          <p style={styles.hint}>
            No login required · Public profiles only · 100% free
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#0a0a0a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'DM Mono', 'Fira Mono', monospace",
    position: "relative",
    overflow: "hidden",
    padding: "2rem",
  },
  grid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
    backgroundSize: "40px 40px",
    pointerEvents: "none",
  },
  content: {
    position: "relative",
    zIndex: 1,
    maxWidth: 520,
    width: "100%",
  },
  badge: {
    display: "inline-block",
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.2em",
    color: "#4ade80",
    border: "1px solid rgba(74,222,128,0.3)",
    padding: "4px 12px",
    borderRadius: 4,
    marginBottom: "1.5rem",
  },
  headline: {
    fontSize: "clamp(56px, 12vw, 96px)",
    fontWeight: 700,
    lineHeight: 0.9,
    color: "#ffffff",
    margin: "0 0 1.5rem",
    fontFamily: "'Syne', 'DM Mono', monospace",
    letterSpacing: "-0.03em",
  },
  headlineAccent: {
    color: "#4ade80",
    display: "block",
  },
  sub: {
    fontSize: 16,
    color: "rgba(255,255,255,0.5)",
    margin: "0 0 2.5rem",
    lineHeight: 1.6,
    fontFamily: "'DM Mono', monospace",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },
  inputWrap: {
    display: "flex",
    alignItems: "center",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 8,
  },
  at: {
    padding: "0 12px",
    fontSize: 18,
    color: "rgba(255,255,255,0.3)",
    userSelect: "none",
  },
  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#ffffff",
    fontSize: 16,
    padding: "14px 16px 14px 0",
    fontFamily: "'DM Mono', monospace",
    caretColor: "#4ade80",
    width: "100%",
  },
  yearSelect: {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: 14,
    padding: "12px 14px",
    borderRadius: 8,
    fontFamily: "'DM Mono', monospace",
    cursor: "pointer",
    outline: "none",
  },
  oauthBtn: {
    padding: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: 8, color: "#fff", fontFamily: "'DM Mono', monospace", cursor: "pointer",
    transition: "background 0.2s", fontSize: 13, marginBottom: 8, width: "100%"
  },
  btn: {
    marginTop: 8,
    background: "#4ade80",
    color: "#0a0a0a",
    border: "none",
    borderRadius: 8,
    padding: "16px 24px",
    fontSize: 15,
    fontWeight: 700,
    fontFamily: "'DM Mono', monospace",
    letterSpacing: "0.02em",
    transition: "transform 0.1s, opacity 0.2s",
  },
  loaderBox: {
    marginTop: 16,
    padding: "24px",
    background: "rgba(74,222,128,0.05)",
    border: "1px solid rgba(74,222,128,0.15)",
    borderRadius: 12,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    animation: "pulseBox 2s infinite ease-in-out"
  },
  spinnerLg: {
    width: 24,
    height: 24,
    border: "3px solid rgba(74,222,128,0.2)",
    borderTopColor: "#4ade80",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 0.8s linear infinite",
  },
  progressText: {
    color: "#4ade80",
    fontSize: 14,
    fontFamily: "'DM Mono', monospace",
    margin: 0,
    letterSpacing: "0.04em"
  },
  error: {
    marginTop: 12,
    color: "#f87171",
    fontSize: 13,
    fontFamily: "'DM Mono', monospace",
  },
  hint: {
    marginTop: 20,
    fontSize: 11,
    color: "rgba(255,255,255,0.2)",
    letterSpacing: "0.06em",
    fontFamily: "'DM Mono', monospace",
  },
};
