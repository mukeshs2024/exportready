import { useState } from "react";

const MARKETS = ["USA", "UAE", "Germany", "UK", "Japan", "Australia", "Saudi Arabia", "France", "Canada", "Netherlands"];

function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ product: "", hasIEC: "", markets: [] });

  const toggleMarket = (m) =>
    setData(d => ({
      ...d,
      markets: d.markets.includes(m) ? d.markets.filter(x => x !== m) : [...d.markets, m],
    }));

  const next = () => {
    if (step === 0 && !data.product.trim()) { alert("Please enter your product"); return; }
    if (step < 2) { setStep(s => s + 1); return; }
    // Done — save to localStorage and notify parent
    localStorage.setItem("er_onboarding", JSON.stringify({ ...data, done: true }));
    onComplete(data);
  };

  const pct = Math.round(((step + 1) / 3) * 100);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 8000, background: "rgba(15,30,58,0.8)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
    }}>
      <div style={{ background: "white", borderRadius: "16px", padding: "2.5rem", width: "100%", maxWidth: "500px", boxShadow: "0 20px 60px rgba(15,30,58,0.3)" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.5rem" }}>
            Step {step + 1} of 3
          </div>
          <div style={{ height: "4px", background: "#f1f5f9", borderRadius: "2px", marginBottom: "1.5rem" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#0f1e3a,#d4af37)", borderRadius: "2px", transition: "width 0.4s ease" }} />
          </div>
          <h2 style={{ color: "#0f1e3a", fontSize: "1.3rem", fontWeight: "800", margin: 0 }}>
            {step === 0 && "What do you export?"}
            {step === 1 && "Do you have an IEC?"}
            {step === 2 && "Preferred Export Markets"}
          </h2>
          <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "0.4rem", marginBottom: 0 }}>
            {step === 0 && "Tell us your main export product to personalise your dashboard."}
            {step === 1 && "Import Export Code (IEC) from DGFT — needed to export from India."}
            {step === 2 && "Select the markets you're targeting. We'll prioritise intelligence for these."}
          </p>
        </div>

        {/* Step content */}
        {step === 0 && (
          <input
            autoFocus
            placeholder="e.g., Premium Cotton Shirts, Basmati Rice, Spices"
            value={data.product}
            onChange={e => setData(d => ({ ...d, product: e.target.value }))}
            onKeyPress={e => e.key === "Enter" && next()}
            style={{ width: "100%", padding: "1rem", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "inherit", boxSizing: "border-box" }}
            onFocus={e => { e.target.style.borderColor = "#0f1e3a"; e.target.style.boxShadow = "0 0 0 3px rgba(15,30,58,0.1)"; }}
            onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
          />
        )}

        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {["Yes, I have IEC", "No, not yet", "Not sure"].map(opt => (
              <div key={opt} onClick={() => setData(d => ({ ...d, hasIEC: opt }))}
                style={{ padding: "1rem 1.25rem", border: `2px solid ${data.hasIEC === opt ? "#0f1e3a" : "#e2e8f0"}`, borderRadius: "8px", cursor: "pointer", background: data.hasIEC === opt ? "#f1f5f9" : "white", fontWeight: data.hasIEC === opt ? "700" : "500", color: "#0f1e3a", transition: "all 0.15s ease" }}>
                {data.hasIEC === opt ? "✓ " : ""}{opt}
              </div>
            ))}
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
            {MARKETS.map(m => (
              <div key={m} onClick={() => toggleMarket(m)}
                style={{ padding: "0.5rem 1rem", border: `2px solid ${data.markets.includes(m) ? "#0f1e3a" : "#e2e8f0"}`, borderRadius: "20px", cursor: "pointer", background: data.markets.includes(m) ? "#0f1e3a" : "white", color: data.markets.includes(m) ? "white" : "#0f1e3a", fontWeight: "600", fontSize: "0.85rem", transition: "all 0.15s ease" }}>
                {m}
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <button onClick={next}
          style={{ marginTop: "2rem", width: "100%", padding: "1rem", background: "linear-gradient(135deg,#0f1e3a 0%,#1a2f5a 100%)", color: "white", border: "none", borderRadius: "8px", fontSize: "0.95rem", fontWeight: "700", cursor: "pointer", letterSpacing: "0.5px" }}>
          {step < 2 ? "Continue →" : "Start Using ExportReady 🚀"}
        </button>
      </div>
    </div>
  );
}

export default Onboarding;
