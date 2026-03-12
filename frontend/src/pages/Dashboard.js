import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, ArcElement,
  Title, Tooltip, Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import API from "../services/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// ── Metric card ─────────────────────────────────────────────────
function MetricCard({ icon, label, value, sub, color, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "white", border: "1px solid #e2e8f0", borderRadius: "12px",
        padding: "1.5rem", cursor: onClick ? "pointer" : "default",
        transition: "all 0.25s ease", boxShadow: "0 1px 3px rgba(15,30,58,0.08)",
        borderTop: `3px solid ${color}`,
      }}
      onMouseEnter={e => { if (onClick) { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(15,30,58,0.12)"; } }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(15,30,58,0.08)"; }}
    >
      <div style={{ fontSize: "1.6rem", marginBottom: "0.5rem" }}>{icon}</div>
      <div style={{ fontSize: "1.5rem", fontWeight: "900", color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: "0.78rem", fontWeight: "700", color: "#0f1e3a", marginTop: "0.3rem" }}>{label}</div>
      {sub && <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "0.2rem" }}>{sub}</div>}
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tradeData, setTradeData] = useState(null);

  // Fetch India Rice export volume from UN Comtrade on mount as teaser stat
  useEffect(() => {
    API.get("/trade-volume", { params: { product_hs: "1006" } })
      .then(res => setTradeData(res.data))
      .catch(() => {});
  }, []);

  const navCards = [
    { icon: "📦", title: "Add Product",      description: "Register Rajesh Textiles products for export",   path: "/product",     color: "#0f1e3a" },
    { icon: "🌍", title: "Market Analysis",  description: "AI-powered global market intelligence",           path: "/market",      color: "#2563eb" },
    { icon: "₹",  title: "Profit Simulator", description: "Simulate FOB pricing & profitability",            path: "/profit",      color: "#16a34a" },
    { icon: "⇄",  title: "Export Plan",      description: "Timeline, schemes & compliance roadmap",          path: "/export-plan", color: "#ca8a04" },
    { icon: "✓",  title: "Compliance Check", description: "Rule-by-rule export compliance analysis",         path: "/compliance",  color: "#7c3aed" },
    { icon: "📊", title: "Readiness Score",  description: "Track your export readiness progress",            path: "/readiness",   color: "#dc2626" },
  ];

  const analyze = async () => {
    if (!productName.trim()) { alert("Please enter a product name"); return; }
    setError(""); setResult(null); setLoading(true);
    try {
      const res = await API.get("/dashboard-analysis", { params: { product: productName } });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    } finally { setLoading(false); }
  };

  const sectionCard = (bg, border, borderLeft, title, children) => (
    <div style={{ padding: "1.75rem", background: bg, borderRadius: "10px", border: `1px solid ${border}`, borderLeft: `4px solid ${borderLeft}` }}>
      <h3 style={{ color: "#0f1e3a", marginBottom: "1rem", fontSize: "1rem", fontWeight: "700" }}>{title}</h3>
      {children}
    </div>
  );

  // Chart data — India's top export market volumes (₹ Cr, illustrative)
  const barData = {
    labels: ["USA", "UAE", "Germany", "UK", "Japan", "Netherlands", "China"],
    datasets: [{
      label: "India Export Volume (₹ Crore)",
      data: [820000, 140000, 310000, 290000, 200000, 175000, 160000],
      backgroundColor: [
        "#0f1e3a", "#2563eb", "#16a34a", "#ca8a04", "#7c3aed", "#dc2626", "#0891b2"
      ],
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => `₹ ${(ctx.raw / 100000).toFixed(1)}L Cr`,
        },
      },
    },
    scales: {
      y: { ticks: { callback: v => `₹${(v / 100000).toFixed(0)}L Cr` }, grid: { color: "#f1f5f9" } },
      x: { grid: { display: false } },
    },
  };

  const donutData = {
    labels: ["Agricultural", "Textiles", "Electronics", "Pharma", "Engineering"],
    datasets: [{
      data: [18, 15, 22, 12, 33],
      backgroundColor: ["#16a34a", "#ca8a04", "#2563eb", "#7c3aed", "#0f1e3a"],
      borderWidth: 2,
      borderColor: "white",
    }],
  };

  const donutOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom", labels: { font: { size: 11 }, padding: 12 } },
    },
    cutout: "65%",
  };

  return (
    <div>
      {/* Hero ── */}
      <div style={{
        background: "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)",
        color: "white", padding: "2.5rem 3rem", borderRadius: "12px",
        marginBottom: "2rem", boxShadow: "0 4px 12px rgba(15,30,58,0.15)",
        border: "1px solid rgba(212,175,55,0.2)", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: "0.75rem", fontWeight: "700", letterSpacing: "2px", color: "#d4af37", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            Rajesh Textiles Pvt Ltd · Mumbai
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: "900", marginBottom: "0.5rem", letterSpacing: "-0.5px" }}>
            Welcome to ExportReady
          </h1>
          <p style={{ fontSize: "0.9rem", opacity: 0.9, maxWidth: "560px", lineHeight: "1.7", marginBottom: "1.5rem" }}>
            AI-powered export intelligence for Indian MSMEs. Analyze markets, simulate profits, ensure compliance — all in one platform.
          </p>
          {tradeData && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: "1rem", background: "rgba(255,255,255,0.12)", borderRadius: "8px", padding: "0.75rem 1.25rem", backdropFilter: "blur(4px)", border: "1px solid rgba(212,175,55,0.3)" }}>
              <div>
                <div style={{ fontSize: "0.65rem", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", opacity: 0.7 }}>Live Data · {tradeData.source}</div>
                <div style={{ fontSize: "1.4rem", fontWeight: "900", color: "#d4af37", lineHeight: 1.1 }}>{tradeData.india_export_value}</div>
                <div style={{ fontSize: "0.72rem", opacity: 0.8 }}>India Rice (HS 1006) Annual Exports</div>
              </div>
              <div style={{ width: "1px", height: "40px", background: "rgba(255,255,255,0.2)" }} />
              <div style={{ fontSize: "0.75rem", opacity: 0.8, maxWidth: "120px", lineHeight: "1.4" }}>
                {tradeData.live ? "🟢 Real-time" : "📊 Estimated"} trade data
              </div>
            </div>
          )}
        </div>
      </div>

      {/* KPI Metric Strip ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <MetricCard icon="📦" label="Products Listed"    value="3"     sub="Cotton Shirts, Rice, Spices" color="#0f1e3a" onClick={() => navigate("/product")} />
        <MetricCard icon="🌍" label="Markets Analyzed"  value="7"     sub="USA, UAE, Germany…"          color="#2563eb" onClick={() => navigate("/market")} />
        <MetricCard icon="📄" label="Documents Ready"   value="6"     sub="Invoice, BoL, COO…"          color="#16a34a" onClick={() => navigate("/docs")} />
        <MetricCard icon="💰" label="Potential Revenue" value="$2.4M" sub="Based on market analysis"    color="#ca8a04" />
        <MetricCard icon="📈" label="Top Market"        value="UAE"   sub="Demand index: 94/100"        color="#7c3aed" onClick={() => navigate("/market")} />
        <MetricCard icon="✓"  label="Readiness Score"   value="45/100" sub="Click to improve"           color="#dc2626" onClick={() => navigate("/readiness")} />
      </div>

      {/* Charts row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
        <div style={{ background: "white", padding: "1.75rem", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(15,30,58,0.08)" }}>
          <h3 style={{ color: "#0f1e3a", marginBottom: "1.25rem", fontSize: "1rem", fontWeight: "700" }}>📊 India Export Volume by Market</h3>
          <Bar data={barData} options={barOptions} />
        </div>
        <div style={{ background: "white", padding: "1.75rem", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(15,30,58,0.08)" }}>
          <h3 style={{ color: "#0f1e3a", marginBottom: "1.25rem", fontSize: "1rem", fontWeight: "700" }}>🥧 Export Mix by Sector</h3>
          <Doughnut data={donutData} options={donutOptions} />
        </div>
      </div>

      {/* Navigation quick-access grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        {navCards.map(card => (
          <div key={card.path} onClick={() => navigate(card.path)}
            style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "1.25rem", cursor: "pointer", transition: "all 0.25s ease", boxShadow: "0 1px 3px rgba(15,30,58,0.07)", display: "flex", alignItems: "center", gap: "1rem" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(15,30,58,0.12)"; e.currentTarget.style.borderLeft = `4px solid ${card.color}`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(15,30,58,0.07)"; e.currentTarget.style.borderLeft = "1px solid #e2e8f0"; }}
          >
            <span style={{ fontSize: "1.8rem" }}>{card.icon}</span>
            <div>
              <div style={{ fontWeight: "700", color: "#0f1e3a", fontSize: "0.9rem" }}>{card.title}</div>
              <div style={{ fontSize: "0.72rem", color: "#64748b", lineHeight: "1.4", marginTop: "0.15rem" }}>{card.description}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Analysis Section ── */}
      <div style={{ background: "white", padding: "2.5rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(15,30,58,0.12)", border: "1px solid #e2e8f0", marginBottom: "2rem" }}>
        <h2 style={{ color: "#0f1e3a", marginBottom: "1.5rem", fontSize: "1.2rem", fontWeight: "800" }}>
          🔍 Quick Product Analysis
        </h2>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
          <input
            placeholder="Enter product (e.g., Premium Cotton Shirts, Basmati Rice, Spices)"
            value={productName}
            onChange={e => setProductName(e.target.value)}
            onKeyPress={e => e.key === "Enter" && analyze()}
            style={{ flex: 1, padding: "0.875rem 1rem", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "0.85rem", fontFamily: "inherit" }}
            onFocus={e => { e.target.style.borderColor = "#0f1e3a"; e.target.style.boxShadow = "0 0 0 3px rgba(15,30,58,0.1)"; }}
            onBlur={e => { e.target.style.boxShadow = "none"; e.target.style.borderColor = "#e2e8f0"; }}
          />
          <button onClick={analyze} disabled={loading}
            style={{ padding: "0.875rem 2rem", background: loading ? "#e2e8f0" : "linear-gradient(135deg,#ca8a04 0%,#a16207 100%)", color: loading ? "#4a5568" : "white", border: "none", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {error && <p style={{ color: "#dc2626", padding: "1rem", background: "#fee2e2", borderRadius: "6px", borderLeft: "3px solid #dc2626" }}>{error}</p>}

        {result && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "1rem" }}>
            {sectionCard("#f0fdf4", "#d1fae5", "#16a34a", "✓ Top Export Markets",
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {result.top_markets.map((m, i) => (
                  <div key={i} style={{ flex: "1 1 100px", padding: "1rem", background: "white", borderRadius: "8px", border: "1px solid #d1fae5", textAlign: "center", boxShadow: "0 1px 3px rgba(15,30,58,0.1)" }}>
                    <div style={{ fontWeight: "700", color: "#059669", fontSize: "0.95rem" }}>{m[0]}</div>
                    <div style={{ fontSize: "0.7rem", color: "#6b7280", marginTop: "0.25rem" }}>Score: {m[1]}</div>
                  </div>
                ))}
              </div>
            )}
            {sectionCard("#faf5ff", "#e9d5ff", "#8b5cf6", "📈 Opportunity Scores",
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  {result.top_markets.map((m, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f3e8ff" }}>
                      <td style={{ padding: "0.6rem 0", fontWeight: "600", color: "#1a202c", fontSize: "0.85rem" }}>{m[0]}</td>
                      <td style={{ padding: "0.6rem 0", textAlign: "right" }}>
                        <span style={{ background: "#8b5cf6", color: "white", padding: "0.2rem 0.75rem", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "700" }}>{m[1]}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {sectionCard("#eff6ff", "#bfdbfe", "#2563eb", "📄 Required Documents",
              <ul style={{ margin: 0, paddingLeft: "1.25rem", listStyleType: "disc" }}>
                {result.documents_required.map((doc, i) => (
                  <li key={i} style={{ padding: "0.35rem 0", color: "#1e40af", fontWeight: "500", fontSize: "0.85rem" }}>{doc[0]}</li>
                ))}
              </ul>
            )}
            {sectionCard("#fefce8", "#fde68a", "#ca8a04", "🏢 Potential Buyers",
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {result.potential_buyers.map((b, i) => (
                  <div key={i} style={{ flex: "1 1 100px", padding: "0.85rem", background: "white", borderRadius: "8px", border: "1px solid #fde68a", fontWeight: "600", color: "#92400e", textAlign: "center", fontSize: "0.85rem", boxShadow: "0 1px 3px rgba(15,30,58,0.1)" }}>{b[0]}</div>
                ))}
              </div>
            )}
            <div style={{ gridColumn: "1 / -1" }}>
              {sectionCard("#f0fdf4", "#d1fae5", "#059669", "💰 Estimated Profit",
                <div style={{ textAlign: "center", padding: "1rem 0" }}>
                  <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "#059669" }}>{result.profit_estimation}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Impact Section ── */}
      <div style={{ background: "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)", borderRadius: "12px", padding: "2.5rem 3rem", color: "white", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "800", marginBottom: "0.5rem", color: "#d4af37" }}>ExportReady Impact</h2>
        <p style={{ opacity: 0.75, fontSize: "0.82rem", marginBottom: "2rem" }}>Why this platform matters for Indian MSMEs</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
          {[
            { stat: "63 Million", desc: "MSMEs in India eligible to export" },
            { stat: "Only 1.8%", desc: "Actually export today — massive opportunity" },
            { stat: "₹4.2L/year", desc: "Average MSME loss due to wrong HS Codes" },
            { stat: "70% fewer", desc: "Compliance errors with ExportReady" },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: "center", padding: "1.5rem 1rem", background: "rgba(255,255,255,0.07)", borderRadius: "10px", border: "1px solid rgba(212,175,55,0.15)" }}>
              <div style={{ fontSize: "1.6rem", fontWeight: "900", color: "#d4af37", lineHeight: 1.1 }}>{item.stat}</div>
              <div style={{ fontSize: "0.78rem", opacity: 0.85, marginTop: "0.5rem", lineHeight: "1.4" }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer ── */}
      <div style={{ background: "white", border: "1px solid #e2e8f0", padding: "1.25rem 1.5rem", borderRadius: "8px", textAlign: "center" }}>
        <p style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
          Enterprise-Grade Security · Global Compliance · Real-Time AI Analytics · Data: UN Comtrade 2023
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
