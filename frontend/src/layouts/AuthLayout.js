import React from "react";

const tickerItems = [
  { flag: "🇦🇪", country: "UAE", product: "Cotton Shirts", change: "+18%" },
  { flag: "🇺🇸", country: "USA", product: "Spices", change: "+6%" },
  { flag: "🇩🇪", country: "Germany", product: "Organic Textiles", change: "+9%" },
];

export default function AuthLayout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: 'Inter, sans-serif' }}>
      {/* Brand Panel */}
      <div style={{
        width: "50%",
        background: "#0D1B4C",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 0 0 0",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ width: "100%", padding: "3.5rem 2.5rem 0 3.5rem", zIndex: 2 }}>
          <div style={{ fontSize: "2.7rem", fontWeight: 900, letterSpacing: "-1.5px", marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontWeight: 900, fontSize: 38, letterSpacing: "-2px" }}>Export</span>
            <span style={{ color: "#4ADE80", fontWeight: 900, fontSize: 38 }}>Ready</span>
          </div>
          <div style={{ fontSize: "1.25rem", fontWeight: 500, marginBottom: "2.2rem", color: "#cbd5f5" }}>
            Make exporting easy.
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "1.08rem", lineHeight: 2.1, color: "#e0e7ef", marginBottom: "2.5rem" }}>
            <li>🌍 Discover global markets</li>
            <li>📊 AI-powered export intelligence</li>
            <li>🤝 Connect with international buyers</li>
          </ul>
        </div>
        {/* Subtle world map pattern/gradient overlay */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "radial-gradient(ellipse 80% 60% at 60% 40%, #1a2a6c 0%, #0D1B4C 100%)",
          opacity: 0.45,
          zIndex: 1
        }} />
        {/* World map SVG pattern (subtle) */}
        <svg style={{ position: "absolute", bottom: 120, left: 0, width: "100%", opacity: 0.10, zIndex: 1 }} viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="400" cy="100" rx="380" ry="80" fill="#fff" />
        </svg>
        {/* Live Ticker */}
        <div style={{ width: "100%", position: "absolute", bottom: 0, left: 0, zIndex: 3, padding: "0 0 2.2rem 0" }}>
          <div style={{ width: "100%", overflow: "hidden" }}>
            <div style={{
              display: "flex",
              gap: "2.5rem",
              animation: "ticker-scroll 22s linear infinite"
            }}>
              {[...tickerItems, ...tickerItems].map((item, idx) => (
                <span key={idx} style={{ whiteSpace: "nowrap", fontWeight: 600, fontSize: "1.08rem", color: item.change.startsWith("-") ? "#f87171" : "#4ade80" }}>
                  {item.country} – {item.product} {item.change}
                </span>
              ))}
            </div>
          </div>
        </div>
        {/* Ticker animation keyframes */}
        <style>{`
          @keyframes ticker-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>
      {/* Auth Form Panel */}
      <div style={{
        width: "50%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7fafd"
      }}>
        <div style={{
          width: "100%",
          maxWidth: 440,
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 8px 32px rgba(13,27,76,0.10)",
          padding: "2.8rem 2.2rem 2.2rem 2.2rem",
          margin: "2.5rem 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          animation: "fadein 0.7s cubic-bezier(.39,.575,.56,1)"
        }}>
          {children}
        </div>
        <style>{`
          @keyframes fadein {
            from { opacity: 0; transform: translateY(32px); }
            to { opacity: 1; transform: none; }
          }
        `}</style>
      </div>
    </div>
  );
}
