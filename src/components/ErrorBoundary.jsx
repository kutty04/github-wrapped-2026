import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Catastrophic React Tree Failure:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, background: "#0a0a0a", color: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start", fontFamily: "'DM Mono', monospace" }}>
          <h1 style={{ color: "#ef4444", fontSize: 32, margin: 0, fontFamily: "'Syne', sans-serif" }}>Catastrophic Render Exception</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: 600 }}>
            The application crashed while trying to render your GitHub payload. This is almost always caused by a strict API rate-limit intercepting an inner payload array (throwing an undefined TypeError).
          </p>
          <div style={{ width: "100%", maxWidth: 800, background: "#111", padding: 24, borderRadius: 16, overflowX: "auto", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
            <pre style={{ color: "#fca5a5", fontSize: 13, margin: 0 }}>
              {this.state.error && this.state.error.toString()}
              {"\n"}
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </div>
          <button 
            onClick={() => { window.location.href = window.location.pathname; }} 
            style={{ background: "#ef4444", color: "#000", border: 'none', padding: "12px 24px", borderRadius: 8, fontWeight: 700, cursor: 'pointer', marginTop: 16 }}
          >
            Restart Engine
          </button>
        </div>
      );
    }
    return this.props.children; 
  }
}
