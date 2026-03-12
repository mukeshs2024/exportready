import { useState } from "react";
import API from "../services/api";

// Status config supports both new (PASS/WARN/FAIL) and legacy (green/yellow/red) keys
const S = {
  PASS:   { icon: "🟢", label: "PASS", bg: "#f0fdf4", text: "#15803d", border: "#86efac" },
  WARN:   { icon: "🟡", label: "WARN", bg: "#fefce8", text: "#92400e", border: "#fde68a" },
  FAIL:   { icon: "🔴", label: "FAIL", bg: "#fef2f2", text: "#b91c1c", border: "#fca5a5" },
  green:  { icon: "🟢", label: "PASS", bg: "#f0fdf4", text: "#15803d", border: "#86efac" },
  yellow: { icon: "🟡", label: "WARN", bg: "#fefce8", text: "#92400e", border: "#fde68a" },
  red:    { icon: "🔴", label: "FAIL", bg: "#fef2f2", text: "#b91c1c", border: "#fca5a5" },
};

const TH = { padding: "0.85rem 1rem", textAlign: "left", color: "white", fontSize: "0.74rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" };
const TD = { padding: "0.82rem 1rem", fontSize: "0.83rem", lineHeight: "1.5" };

function ScoreCircle({ score, status }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score ?? 0));
  const dash = (pct / 100) * circ;
  const col = pct >= 80 ? "#16a34a" : pct >= 60 ? "#d97706" : pct >= 40 ? "#ea580c" : "#dc2626";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1.5rem 2rem", background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(15,30,58,0.1)", minWidth: "180px" }}>
      <div style={{ position: "relative", width: 140, height: 140 }}>
        <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="70" cy="70" r={r} fill="none" stroke="#f1f5f9" strokeWidth="12" />
          <circle cx="70" cy="70" r={r} fill="none" stroke={col} strokeWidth="12"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.8s ease" }} />
        </svg>
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: "2rem", fontWeight: "900", color: col, lineHeight: 1 }}>{pct}</div>
          <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>/ 100</div>
        </div>
      </div>
      <div style={{ marginTop: "0.75rem", background: col, color: "white", borderRadius: "20px", padding: "0.3rem 1.1rem", fontSize: "0.75rem", fontWeight: "800", letterSpacing: "0.5px", textAlign: "center" }}>
        {status ?? "—"}
      </div>
      <div style={{ marginTop: "0.4rem", fontSize: "0.72rem", color: "#94a3b8" }}>Compliance Score</div>
    </div>
  );
}

function Compliance() {
  const [product, setProduct] = useState("");
  const [country, setCountry] = useState("");
  const [hsCode, setHsCode] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const QUICK_COUNTRIES = ["USA", "UAE", "Germany", "UK", "Saudi Arabia", "Australia", "Japan"];

  const check = async () => {
    if (!product.trim() || !country.trim()) {
      alert("Please enter both a product and destination country");
      return;
    }
    setError(""); setResult(null); setLoading(true);
    try {
      const res = await API.post("/compliance-check", null, {
        params: { product, country, hs_code: hsCode }
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Compliance check failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const checks = result?.checks || result?.rules || [];
  const tally = {
    pass: checks.filter(c => c.status === "PASS" || c.status === "green").length,
    warn: checks.filter(c => c.status === "WARN" || c.status === "yellow").length,
    fail: checks.filter(c => c.status === "FAIL" || c.status === "red").length,
  };

  const inputStyle = { width: "100%", padding: "0.75rem 1rem", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "0.85rem", fontFamily: "inherit", boxSizing: "border-box" };
  const focus = e => { e.target.style.borderColor = "#0f1e3a"; e.target.style.boxShadow = "0 0 0 3px rgba(15,30,58,0.1)"; };
  const blur  = e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; };

  return (
    <div>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)", color: "white", padding: "2rem 2.5rem", borderRadius: "12px", marginBottom: "1.75rem", border: "1px solid rgba(212,175,55,0.2)" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "800", margin: 0, marginBottom: "0.35rem" }}>✓ Compliance Check</h2>
        <p style={{ opacity: 0.85, fontSize: "0.85rem", margin: 0 }}>
          AI-powered export compliance audit — enter product, destination, and HS code for a full traffic-light report with scores.
        </p>
      </div>

      {/* Input card */}
      <div style={{ background: "white", borderRadius: "12px", padding: "2rem", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(15,30,58,0.08)", marginBottom: "1.5rem" }}>
        {/* 3-col input grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
          <div>
            <label style={{ display: "block", fontWeight: "700", color: "#0f1e3a", marginBottom: "0.4rem", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Product</label>
            <input placeholder="e.g., Premium Cotton Shirts" value={product}
              onChange={e => setProduct(e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label style={{ display: "block", fontWeight: "700", color: "#0f1e3a", marginBottom: "0.4rem", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Destination Country</label>
            <input placeholder="e.g., UAE, Germany" value={country}
              onChange={e => setCountry(e.target.value)} onKeyPress={e => e.key === "Enter" && check()}
              style={inputStyle} onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label style={{ display: "block", fontWeight: "700", color: "#0f1e3a", marginBottom: "0.4rem", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              HS Code <span style={{ color: "#94a3b8", fontWeight: "400", textTransform: "none" }}>(optional)</span>
            </label>
            <input placeholder="e.g., 6205.20" value={hsCode}
              onChange={e => setHsCode(e.target.value)} onKeyPress={e => e.key === "Enter" && check()}
              style={inputStyle} onFocus={focus} onBlur={blur} />
          </div>
        </div>

        {/* Quick-country chips */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
          {QUICK_COUNTRIES.map(c => (
            <button key={c} onClick={() => setCountry(c)}
              style={{ padding: "0.3rem 0.75rem", background: country === c ? "#0f1e3a" : "#f1f5f9", color: country === c ? "white" : "#475569", border: "1px solid #e2e8f0", borderRadius: "20px", fontSize: "0.78rem", fontWeight: "600", cursor: "pointer" }}>
              {c}
            </button>
          ))}
        </div>

        <button onClick={check} disabled={loading} style={{
          width: "100%", padding: "0.9rem",
          background: loading ? "#e2e8f0" : "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)",
          color: loading ? "#4a5568" : "white", border: "none", borderRadius: "8px",
          fontSize: "0.88rem", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer",
          textTransform: "uppercase", letterSpacing: "0.5px",
          boxShadow: loading ? "none" : "0 2px 8px rgba(15,30,58,0.25)",
        }}>
          {loading ? "Running Compliance Audit..." : "🔍 Run Compliance Check"}
        </button>
      </div>

      {error && (
        <div style={{ padding: "1rem 1.25rem", background: "#fef2f2", borderRadius: "8px", borderLeft: "4px solid #dc2626", marginBottom: "1.5rem" }}>
          <span style={{ color: "#b91c1c", fontSize: "0.88rem", fontWeight: "600" }}>⚠️ {error}</span>
        </div>
      )}

      {result && (
        <div>
          {/* Score circle + tally row */}
          <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "stretch" }}>
            <ScoreCircle score={result.overallScore} status={result.overallStatus} />

            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.75rem", minWidth: "220px" }}>
              {/* Traffic light counts */}
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <div style={{ flex: 1, padding: "1rem", background: "#f0fdf4", borderRadius: "8px", textAlign: "center", border: "1px solid #86efac" }}>
                  <div style={{ fontSize: "1.9rem", fontWeight: "900", color: "#16a34a" }}>{tally.pass}</div>
                  <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "#15803d" }}>🟢 PASS</div>
                </div>
                <div style={{ flex: 1, padding: "1rem", background: "#fefce8", borderRadius: "8px", textAlign: "center", border: "1px solid #fde68a" }}>
                  <div style={{ fontSize: "1.9rem", fontWeight: "900", color: "#ca8a04" }}>{tally.warn}</div>
                  <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "#92400e" }}>🟡 WARN</div>
                </div>
                <div style={{ flex: 1, padding: "1rem", background: "#fef2f2", borderRadius: "8px", textAlign: "center", border: "1px solid #fca5a5" }}>
                  <div style={{ fontSize: "1.9rem", fontWeight: "900", color: "#dc2626" }}>{tally.fail}</div>
                  <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "#b91c1c" }}>🔴 FAIL</div>
                </div>
              </div>
              {/* Meta info */}
              <div style={{ flex: 1, padding: "0.9rem 1.1rem", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: "1.7" }}>
                  <strong style={{ color: "#0f1e3a" }}>Product:</strong> {result.product}<br />
                  <strong style={{ color: "#0f1e3a" }}>Destination:</strong> {result.country}
                  {result.hs_code && <span><br /><strong style={{ color: "#0f1e3a" }}>HS Code:</strong> {result.hs_code}</span>}
                </div>
                {result.source === "ai" && (
                  <span style={{ display: "inline-block", marginTop: "0.5rem", background: "#7c3aed", color: "white", borderRadius: "12px", padding: "0.15rem 0.6rem", fontSize: "0.7rem", fontWeight: "700" }}>
                    🤖 AI-Powered
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Checks table */}
          <div style={{ background: "white", borderRadius: "12px", overflow: "hidden", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(15,30,58,0.08)", marginBottom: "1.25rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#0f1e3a" }}>
                  <th style={{ ...TH, width: "110px" }}>Category</th>
                  <th style={TH}>Requirement</th>
                  <th style={{ ...TH, width: "105px", textAlign: "center" }}>Status</th>
                  <th style={TH}>Detail</th>
                  <th style={TH}>Recommended Action</th>
                </tr>
              </thead>
              <tbody>
                {checks.map((c, i) => {
                  const cfg = S[c.status] || S.PASS;
                  const item   = c.item || c.rule;
                  const detail = c.detail || c.explanation;
                  return (
                    <tr key={i} style={{ background: i % 2 === 0 ? "white" : "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                      <td style={TD}>
                        <span style={{ background: "#f1f5f9", padding: "0.2rem 0.55rem", borderRadius: "6px", fontSize: "0.72rem", fontWeight: "600", color: "#475569", whiteSpace: "nowrap" }}>
                          {c.category || "General"}
                        </span>
                      </td>
                      <td style={{ ...TD, fontWeight: "600", color: "#0f1e3a" }}>{item}</td>
                      <td style={{ ...TD, textAlign: "center" }}>
                        <span style={{ display: "inline-block", background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}`, borderRadius: "20px", padding: "0.25rem 0.65rem", fontSize: "0.74rem", fontWeight: "800", whiteSpace: "nowrap" }}>
                          {cfg.icon} {cfg.label}
                        </span>
                      </td>
                      <td style={{ ...TD, color: "#4a5568" }}>{detail}</td>
                      <td style={{ ...TD, fontSize: "0.78rem" }}>
                        {c.action
                          ? <span style={{ background: "#eff6ff", color: "#1d4ed8", padding: "0.2rem 0.55rem", borderRadius: "4px", fontWeight: "500" }}>{c.action}</span>
                          : <span style={{ color: "#cbd5e1" }}>—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {tally.fail > 0 && (
            <div style={{ padding: "1rem 1.25rem", background: "#fef2f2", borderRadius: "8px", borderLeft: "4px solid #dc2626" }}>
              <span style={{ fontWeight: "700", color: "#b91c1c", fontSize: "0.88rem" }}>
                🚫 {tally.fail} critical issue{tally.fail > 1 ? "s" : ""} must be resolved before export
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Compliance;

  const DEMO_COUNTRIES = ["USA", "UAE", "Germany", "UK", "Saudi Arabia", "Australia", "Japan"];

  const check = async () => {
    if (!product.trim() || !country.trim()) {
      alert("Please enter both a product and destination country");
      return;
    }
    setError(""); setResult(null); setLoading(true);
    try {
      const res = await API.post("/compliance-check", null, {
        params: { product, country }
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const summary = result
    ? {
        green:  result.rules.filter(r => r.status === "green").length,
        yellow: result.rules.filter(r => r.status === "yellow").length,
        red:    result.rules.filter(r => r.status === "red").length,
      }
    : null;

  return (
    <div style={{ background: "white", padding: "3rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(15,30,58,0.12)", border: "1px solid #e2e8f0" }}>
      <h2 style={{ color: "#0f1e3a", marginBottom: "2rem", fontSize: "1.4rem", fontWeight: "800" }}>
        ✓ Compliance Check
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
        <div>
          <label style={{ display: "block", fontWeight: "600", color: "#1a202c", marginBottom: "0.5rem", fontSize: "0.8rem" }}>Product</label>
          <input
            placeholder="e.g., Basmati Rice, Cotton Shirts, Pharmaceuticals"
            value={product}
            onChange={e => setProduct(e.target.value)}
            style={{ width: "100%", padding: "0.875rem 1rem", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "0.85rem", fontFamily: "inherit", boxSizing: "border-box" }}
            onFocus={e => { e.target.style.borderColor = "#0f1e3a"; e.target.style.boxShadow = "0 0 0 3px rgba(15,30,58,0.1)"; }}
            onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontWeight: "600", color: "#1a202c", marginBottom: "0.5rem", fontSize: "0.8rem" }}>Destination Country</label>
          <input
            placeholder="e.g., USA, UAE, Germany"
            value={country}
            onChange={e => setCountry(e.target.value)}
            onKeyPress={e => e.key === "Enter" && check()}
            style={{ width: "100%", padding: "0.875rem 1rem", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "0.85rem", fontFamily: "inherit", boxSizing: "border-box" }}
            onFocus={e => { e.target.style.borderColor = "#0f1e3a"; e.target.style.boxShadow = "0 0 0 3px rgba(15,30,58,0.1)"; }}
            onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
          />
        </div>
      </div>

      {/* Quick country buttons */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
        {DEMO_COUNTRIES.map(c => (
          <button key={c} onClick={() => setCountry(c)}
            style={{ padding: "0.3rem 0.75rem", background: country === c ? "#0f1e3a" : "#f1f5f9", color: country === c ? "white" : "#475569", border: "1px solid #e2e8f0", borderRadius: "20px", fontSize: "0.78rem", fontWeight: "600", cursor: "pointer" }}>
            {c}
          </button>
        ))}
      </div>

      <button onClick={check} disabled={loading}
        style={{ width: "100%", padding: "0.875rem", background: loading ? "#e2e8f0" : "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)", color: loading ? "#4a5568" : "white", border: "none", borderRadius: "8px", fontSize: "0.88rem", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {loading ? "Checking Compliance..." : "Run Compliance Check"}
      </button>

      {error && <p style={{ color: "#dc2626", marginTop: "1.5rem", padding: "1rem", background: "#fee2e2", borderRadius: "6px", borderLeft: "3px solid #dc2626" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: "2rem" }}>
          {/* Summary bar */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <div style={{ flex: 1, padding: "1rem", background: "#f0fdf4", borderRadius: "8px", textAlign: "center", border: "1px solid #86efac" }}>
              <div style={{ fontSize: "1.6rem", fontWeight: "900", color: "#16a34a" }}>{summary.green}</div>
              <div style={{ fontSize: "0.75rem", fontWeight: "600", color: "#15803d" }}>Compliant</div>
            </div>
            <div style={{ flex: 1, padding: "1rem", background: "#fefce8", borderRadius: "8px", textAlign: "center", border: "1px solid #fde68a" }}>
              <div style={{ fontSize: "1.6rem", fontWeight: "900", color: "#ca8a04" }}>{summary.yellow}</div>
              <div style={{ fontSize: "0.75rem", fontWeight: "600", color: "#92400e" }}>Action Needed</div>
            </div>
            <div style={{ flex: 1, padding: "1rem", background: "#fef2f2", borderRadius: "8px", textAlign: "center", border: "1px solid #fca5a5" }}>
              <div style={{ fontSize: "1.6rem", fontWeight: "900", color: "#dc2626" }}>{summary.red}</div>
              <div style={{ fontSize: "0.75rem", fontWeight: "600", color: "#b91c1c" }}>Critical Issues</div>
            </div>
          </div>

          <h3 style={{ color: "#0f1e3a", marginBottom: "1rem", fontSize: "1rem", fontWeight: "700" }}>
            Compliance Rules — <strong>{result.product}</strong> → <strong>{result.country}</strong>
            {result.source === "ai" && (
              <span style={{ marginLeft: "0.75rem", background: "#7c3aed", color: "white", borderRadius: "12px", padding: "0.15rem 0.6rem", fontSize: "0.7rem", fontWeight: "700" }}>AI-Powered</span>
            )}
          </h3>

          {/* Rules table */}
          <div style={{ border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#0f1e3a" }}>
                  <th style={{ padding: "0.85rem 1rem", textAlign: "left", color: "white", fontSize: "0.78rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>Rule / Requirement</th>
                  <th style={{ padding: "0.85rem 1rem", textAlign: "center", color: "white", fontSize: "0.78rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", width: "140px" }}>Status</th>
                  <th style={{ padding: "0.85rem 1rem", textAlign: "left", color: "white", fontSize: "0.78rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>Explanation</th>
                </tr>
              </thead>
              <tbody>
                {result.rules.map((rule, i) => {
                  const cfg = STATUS_CONFIG[rule.status] || STATUS_CONFIG.green;
                  return (
                    <tr key={i} style={{ background: i % 2 === 0 ? "white" : "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "0.9rem 1rem", fontWeight: "600", color: "#0f1e3a", fontSize: "0.85rem" }}>{rule.rule}</td>
                      <td style={{ padding: "0.9rem 1rem", textAlign: "center" }}>
                        <span style={{ display: "inline-block", background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}`, borderRadius: "20px", padding: "0.25rem 0.75rem", fontSize: "0.75rem", fontWeight: "700" }}>
                          {cfg.icon} {cfg.label}
                        </span>
                      </td>
                      <td style={{ padding: "0.9rem 1rem", color: "#4a5568", fontSize: "0.82rem", lineHeight: "1.5" }}>{rule.explanation}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {summary.red > 0 && (
            <div style={{ marginTop: "1.25rem", padding: "1rem 1.25rem", background: "#fef2f2", borderRadius: "8px", borderLeft: "4px solid #dc2626" }}>
              <span style={{ fontWeight: "700", color: "#b91c1c", fontSize: "0.88rem" }}>
                ⚠️ {summary.red} critical issue{summary.red > 1 ? "s" : ""} must be resolved before export
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Compliance;

