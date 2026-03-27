import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SplashCard from "./cards/SplashCard";
import CommitsCard from "./cards/CommitsCard";
import BentoCard from "./cards/BentoCard";
import StreakCard from "./cards/StreakCard";
import HeatmapCard from "./cards/HeatmapCard";
import PlaybackCard from "./cards/PlaybackCard";
import BadgesCard from "./cards/BadgesCard";
import AICard from "./cards/AICard";
import RoastGeneratorCard from "./cards/RoastGeneratorCard";
import TimeCapsuleCard from "./cards/TimeCapsuleCard";
import NemesisCard from "./cards/NemesisCard";
import PersonalityCard from "./cards/PersonalityCard";
import CodeSmellCard from "./cards/CodeSmellCard";
import SoundtrackCard from "./cards/SoundtrackCard";
import CommitAnalyzerCard from "./cards/CommitAnalyzerCard";
import YearComparisonCard from "./cards/YearComparisonCard";
import PredictionCard from "./cards/PredictionCard";
import CollaborationGraphCard from "./cards/CollaborationGraphCard";
import ProjectIdeasCard from "./cards/ProjectIdeasCard";
import MusicToggle from "./MusicToggle";
import CompareModal from "./CompareModal";

async function downloadCard(ref, filename) {
  if (!window.html2canvas) { alert("Download library not loaded yet, try again."); return; }
  const canvas = await window.html2canvas(ref, { scale: 3, backgroundColor: "#0f1117", useCORS: true });
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

const CARDS = [
  { id: "splash",      label: "Welcome",        Component: SplashCard },
  { id: "commits",     label: "Commits",        Component: CommitsCard },
  { id: "heatmap",     label: "Activity",       Component: HeatmapCard },
  { id: "playback",    label: "Timeline",       Component: PlaybackCard },
  { id: "streak",      label: "Streak",         Component: StreakCard },
  { id: "badges",      label: "Achievements",   Component: BadgesCard },
];

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
  exit: (dir) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0, transition: { duration: 0.22, ease: "easeIn" } }),
};

export default function WrappedViewer({ data, onReset }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [toast, setToast] = useState(null);
  const [showCompare, setShowCompare] = useState(false);
  const cardRef = useRef(null);
  
  // Swipe detection
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  const current = CARDS[index];

  function onTouchStart(e) {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }

  function onTouchMove(e) {
    setTouchEnd(e.targetTouches[0].clientX);
  }

  function onTouchEndHandler() {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) next();
    if (isRightSwipe) prev();
  }

  function navigate(newIndex) {
    setDirection(newIndex > index ? 1 : -1);
    setIndex(newIndex);
  }
  function prev() { if (index > 0) navigate(index - 1); }
  function next() { if (index < CARDS.length - 1) navigate(index + 1); }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  async function handleDownload() {
    await downloadCard(cardRef.current, `github-wrapped-${data.profile.login}-${current.id}.png`);
    showToast("Card saved ✓");
  }

  function handleCopyLink() {
    const url = `${window.location.origin}${window.location.pathname}?user=${data.profile.login}`;
    navigator.clipboard.writeText(url).then(() => showToast("Link copied ✓")).catch(() => {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      showToast("Link copied ✓");
    });
  }

  return (
    <div style={styles.root}>
      <style>{`
        @keyframes bounceDown { 
          0%, 100% { transform: translateY(0); } 
          50% { transform: translateY(8px); } 
        }
      `}</style>
      
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            style={styles.toast}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top bar */}
      <div style={styles.topBar}>
        <button onClick={onReset} style={styles.ghostBtn}>← new search</button>
        <span style={styles.cardCounter}>{index + 1} / {CARDS.length}</span>
        <button onClick={handleDownload} style={styles.downloadBtn}>↓ save</button>
      </div>

      {/* Progress dots */}
      <div style={styles.dotsRow}>
        {CARDS.map((c, i) => (
          <button key={c.id} onClick={() => navigate(i)} style={{
            ...styles.dot,
            background: i === index ? "#4ade80" : "rgba(255,255,255,0.2)",
            width: i === index ? 20 : 6,
          }} />
        ))}
      </div>

      {/* Animated card */}
      <div 
        style={styles.cardWrap}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEndHandler}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{ width: "100%" }}
          >
            <div ref={cardRef} style={{ width: "100%" }}>
              <current.Component data={data} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div style={styles.nav}>
        <button onClick={prev} disabled={index === 0}
          style={{ ...styles.navBtn, opacity: index === 0 ? 0.2 : 1 }}>←</button>
        <span style={styles.cardLabel}>{current.label}</span>
        <button onClick={next} disabled={index === CARDS.length - 1}
          style={{ ...styles.navBtn, opacity: index === CARDS.length - 1 ? 0.2 : 1 }}>→</button>
      </div>

      {/* Share row & Actions */}
      <div style={styles.shareRow}>
        <button onClick={handleCopyLink} style={styles.shareBtn}>
          <span style={styles.shareBtnIcon}>⎘</span>
          copy share link
        </button>
        <a 
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just generated my ${data.year} GitHub Wrapped! \nI made ${data.totalCommits.toLocaleString()} commits & unlocked the ${data.badges && data.badges.length > 0 ? data.badges[0].title : 'Pro'} badge 🚀 \nGenerate yours for free at:`)}&url=${encodeURIComponent(window.location.href)}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{...styles.shareBtn, background: "#000", color: "#fff", border: "1px solid rgba(255,255,255,0.2)"}}>
          𝕏 Share
        </a>
      </div>
      
      {/* Compare Modal Toggle */}
      <button onClick={() => setShowCompare(true)} style={styles.compareBtn}>
         📊 Compare with a friend
      </button>

      <div style={{ marginTop: 64, display: "flex", flexDirection: "column", alignItems: "center", opacity: 0.4, animation: "bounceDown 2s infinite" }}>
         <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", marginBottom: 8, letterSpacing: "0.1em", textTransform: "uppercase" }}>Scroll for full report</span>
         <span style={{ fontSize: 18 }}>↓</span>
      </div>

      <div style={{ width: "100%", maxWidth: 1400, marginTop: 40, marginBottom: 32, padding: "0 16px" }}>
         <CollaborationGraphCard data={data} />
      </div>

      <div style={styles.gridSection}>
         {/* Left Column: AI & Analysis */}
         <div style={{ display: "flex", flexDirection: "column", gap: 32, flex: 1, minWidth: 280, maxWidth: 420 }}>
            <AICard data={data} />
            <ProjectIdeasCard data={data} />
            <CommitAnalyzerCard data={data} />
            <RoastGeneratorCard data={data} />
         </div>

         {/* Center Column: Core Metrics & Projections */}
         <div style={{ display: "flex", flexDirection: "column", gap: 32, flex: 1, minWidth: 280, maxWidth: 420 }}>
            <BentoCard data={data} />
            <YearComparisonCard data={data} />
            <PredictionCard data={data} />
            <TimeCapsuleCard data={data} />
         </div>

         {/* Right Column: Viral & Personality */}
         <div style={{ display: "flex", flexDirection: "column", gap: 32, flex: 1, minWidth: 280, maxWidth: 420 }}>
            <PersonalityCard data={data} />
            <CodeSmellCard data={data} />
            <NemesisCard data={data} />
            <SoundtrackCard data={data} />
         </div>
      </div>

      <MusicToggle />
      
      {showCompare && <CompareModal data1={data} onClose={() => setShowCompare(false)} />}
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh", background: "#0a0a0a", display: "flex",
    flexDirection: "column", alignItems: "center", justifyContent: "center",
    padding: "24px 16px", fontFamily: "'DM Mono', monospace", gap: 16,
    outline: "none", position: "relative",
  },
  toast: {
    position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
    background: "#4ade80", color: "#0a0a0a", fontSize: 13, fontWeight: 600,
    fontFamily: "'DM Mono', monospace", padding: "8px 20px", borderRadius: 99,
    letterSpacing: "0.04em", zIndex: 9999, whiteSpace: "nowrap", pointerEvents: "none",
  },
  topBar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    width: "100%", maxWidth: 420,
  },
  ghostBtn: {
    background: "none", border: "none", color: "rgba(255,255,255,0.3)",
    fontSize: 12, cursor: "pointer", fontFamily: "'DM Mono', monospace", padding: 0,
  },
  cardCounter: { fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" },
  downloadBtn: {
    background: "none", border: "1px solid rgba(74,222,128,0.3)", color: "#4ade80",
    fontSize: 11, cursor: "pointer", fontFamily: "'DM Mono', monospace",
    padding: "4px 10px", borderRadius: 4, letterSpacing: "0.06em",
  },
  dotsRow: { display: "flex", alignItems: "center", gap: 6 },
  dot: {
    height: 6, borderRadius: 99, border: "none", cursor: "pointer", padding: 0,
    transition: "width 0.3s ease, background 0.3s ease",
  },
  cardWrap: { width: "100%", maxWidth: 420, overflow: "hidden", position: "relative" },
  nav: { display: "flex", alignItems: "center", gap: 24 },
  navBtn: {
    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
    color: "#ffffff", width: 40, height: 40, borderRadius: 99, cursor: "pointer",
    fontSize: 16, fontFamily: "'DM Mono', monospace", transition: "opacity 0.2s",
  },
  cardLabel: {
    fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em",
    textTransform: "uppercase", minWidth: 80, textAlign: "center",
  },
  shareRow: { display: "flex", alignItems: "center", gap: 12 },
  shareBtn: {
    display: "flex", alignItems: "center", gap: 6,
    background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.25)",
    color: "#4ade80", fontSize: 11, cursor: "pointer",
    fontFamily: "'DM Mono', monospace", padding: "6px 14px", borderRadius: 6, letterSpacing: "0.06em",
  },
  shareBtnIcon: { fontSize: 14, lineHeight: 1 },
  shareUrl: { fontSize: 11, color: "rgba(255,255,255,0.2)", fontFamily: "'DM Mono', monospace" },
  compareBtn: { marginTop: 24, padding: "12px 24px", background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 99, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 13, letterSpacing: "0.04em", alignSelf: "center", display: "flex", gap: 6, alignItems: "center" },
  compareBtn: { marginTop: 24, padding: "12px 24px", background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 99, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 13, letterSpacing: "0.04em", alignSelf: "center", display: "flex", gap: 6, alignItems: "center" },
  gridSection: { width: "100%", maxWidth: 1400, marginBottom: 80, display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 32, justifyContent: "center", alignItems: "flex-start", position: "relative", zIndex: 1, padding: "0 16px" }
};
