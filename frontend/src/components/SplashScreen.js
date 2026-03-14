import { useState, useEffect, useRef } from "react";

const STEPS = [
  { text: "Connecting Global Markets",    delay: 600 },
  { text: "Loading Trade Intelligence",   delay: 1200 },
  { text: "Synchronizing Export Regulations", delay: 1900 },
  { text: "Activating AI Advisor",        delay: 2500 },
];

const WORLD_MAP_SVG = "%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%201200%20600%22%20fill%3D%22none%22%3E%3Cg%20fill%3D%22%23d4af37%22%3E%3Cellipse%20cx%3D%22220%22%20cy%3D%22260%22%20rx%3D%22170%22%20ry%3D%22110%22/%3E%3Cellipse%20cx%3D%22450%22%20cy%3D%22210%22%20rx%3D%22110%22%20ry%3D%2270%22/%3E%3Cellipse%20cx%3D%22650%22%20cy%3D%22260%22%20rx%3D%22140%22%20ry%3D%2295%22/%3E%3Cellipse%20cx%3D%22850%22%20cy%3D%22230%22%20rx%3D%22160%22%20ry%3D%22110%22/%3E%3Cellipse%20cx%3D%22960%22%20cy%3D%22360%22%20rx%3D%22130%22%20ry%3D%2280%22/%3E%3Cellipse%20cx%3D%22520%22%20cy%3D%22360%22%20rx%3D%22120%22%20ry%3D%2270%22/%3E%3C/g%3E%3C/svg%3E";

function SplashScreen({ onFinish }) {
  const [done, setDone] = useState([]);
  const [fadeOut, setFadeOut] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    STEPS.forEach((s, i) => {
      setTimeout(() => setDone(prev => (prev.includes(i) ? prev : [...prev, i])), s.delay);
    });
    const intervalId = setInterval(() => {
      setProgressValue(prev => {
        const next = Math.min(100, prev + 4);
        if (next >= 100) clearInterval(intervalId);
        return next;
      });
    }, 120);
    setTimeout(() => setFadeOut(true), 3200);
    setTimeout(() => onFinish(), 3700);
    return () => clearInterval(intervalId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const progress = Math.max((done.length / STEPS.length) * 100, progressValue);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#0b1628",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: fadeOut ? 0 : 1, transition: "opacity 0.5s ease",
    }}>
      {/* Subtle grid background */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: "linear-gradient(#d4af37 1px, transparent 1px), linear-gradient(90deg, #d4af37 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />

      {/* Faint world map overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        opacity: 0.06,
        filter: "blur(0.6px)",
        backgroundImage: `url("data:image/svg+xml;utf8,${WORLD_MAP_SVG}")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "80% auto",
        pointerEvents: "none",
      }} />

      {/* Glow */}
      <div style={{
        position: "absolute", width: "600px", height: "600px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Logo mark */}
        <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "18px", margin: "0 auto 1.5rem",
            background: "linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 100%)",
            border: "1.5px solid rgba(212,175,55,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 25px rgba(245,166,35,0.35)",
            animation: "logoPulse 2.2s ease-in-out infinite",
          }}>
            <svg className="splash-globe" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
          <h1 style={{ color: "white", fontSize: "2.25rem", fontWeight: "800", margin: "0 0 6px", letterSpacing: "-1px" }}>
            Export<span style={{ color: "#d4af37" }}>Ready</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", fontWeight: "600", margin: "0 0 0.35rem" }}>
            AI-Powered Export Intelligence for Global Trade
          </p>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.75rem", letterSpacing: "2px", textTransform: "uppercase", fontWeight: "500", margin: 0 }}>
            Global Trade Intelligence Platform
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "360px", marginBottom: "2.5rem" }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: "12px",
              opacity: done.includes(i) ? 1 : 0.2,
              transition: "opacity 0.4s ease",
            }}>
              <div style={{
                width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
                background: done.includes(i) ? "#d4af37" : "rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.4s ease",
                boxShadow: done.includes(i) ? "0 0 10px rgba(212,175,55,0.4)" : "none",
              }}>
                {done.includes(i) && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#0f1e3a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="2 6 5 9 10 3"/>
                  </svg>
                )}
              </div>
              <span style={{ color: done.includes(i) ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)", fontSize: "0.84rem", fontWeight: done.includes(i) ? "500" : "400", transition: "all 0.4s ease", flex: 1 }}>
                {s.text}
              </span>
              <span style={{ color: done.includes(i) ? "rgba(212,175,55,0.9)" : "rgba(255,255,255,0.2)", fontSize: "0.75rem", letterSpacing: "1px" }}>
                {done.includes(i) ? "✓" : "…"}
              </span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ width: "320px", height: "2px", background: "rgba(255,255,255,0.07)", borderRadius: "2px", overflow: "hidden" }}>
          <div style={{
            height: "100%",
            background: "linear-gradient(90deg, #d4af37, #f0c040)",
            borderRadius: "2px",
            width: `${progress}%`,
            transition: "width 0.4s ease",
          }} />
        </div>
        <div style={{ marginTop: "10px", fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", fontWeight: "600" }}>
          Initializing Export Intelligence Engine — {Math.round(progress)}%
        </div>
        <div style={{ marginTop: "22px", fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "1.2px" }}>
          Powered by ExportReady AI Trade Engine
        </div>
      </div>

      <style>{`
        @keyframes logoPulse {
          0% { transform: scale(1); box-shadow: 0 0 20px rgba(245,166,35,0.25); }
          50% { transform: scale(1.02); box-shadow: 0 0 30px rgba(245,166,35,0.45); }
          100% { transform: scale(1); box-shadow: 0 0 20px rgba(245,166,35,0.25); }
        }
        @keyframes globeRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .splash-globe {
          animation: globeRotate 25s linear infinite;
          transform-origin: 50% 50%;
        }
      `}</style>
    </div>
  );
}

export default SplashScreen;
