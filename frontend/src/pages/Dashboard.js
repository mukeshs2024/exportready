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

// ── SVG icons ──────────────────────────────────────────────────────────────
const Ic = {
  box: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  globe: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  doc: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  money: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  trendUp: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  shield: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
  bar: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  pie: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>,
  search: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  check: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  users: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  rocket: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  profit: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  route: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
};

// ── Metric card ─────────────────────────────────────────────────
function MetricCard({ icon, label, value, sub, color, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "white", border: "1px solid #e8ecf0", borderRadius: "10px",
        padding: "1.25rem", cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease", boxShadow: "0 1px 2px rgba(15,30,58,0.05)",
        borderLeft: `3px solid ${color}`,
      }}
      onMouseEnter={e => { if (onClick) { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(15,30,58,0.10)"; } }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 2px rgba(15,30,58,0.05)"; }}
    >
      <div style={{ color, marginBottom: "0.75rem", display: "flex", alignItems: "center" }}>{icon}</div>
      <div style={{ fontSize: "1.4rem", fontWeight: "800", color: "#0f1e3a", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: "0.76rem", fontWeight: "600", color: "#374151", marginTop: "0.3rem" }}>{label}</div>
      {sub && <div style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: "0.2rem" }}>{sub}</div>}
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

  useEffect(() => {
    API.get("/trade-volume", { params: { product_hs: "1006" } })
      .then(res => setTradeData(res.data))
      .catch(() => {});
  }, []);

  const navCards = [
    { icon: Ic.box,     title: "Add Product",      description: "Register products for export",               path: "/product",     color: "#0f1e3a" },
    { icon: Ic.globe,   title: "Market Analysis",  description: "AI-powered global market intelligence",      path: "/market",      color: "#2563eb" },
    { icon: Ic.profit,  title: "Profit Simulator", description: "Simulate FOB pricing & profitability",       path: "/profit",      color: "#16a34a" },
    { icon: Ic.route,   title: "Export Plan",       description: "Timeline, schemes & compliance roadmap",    path: "/export-plan", color: "#ca8a04" },
    { icon: Ic.shield,  title: "Compliance Check", description: "Rule-by-rule export compliance analysis",    path: "/compliance",  color: "#7c3aed" },
    { icon: Ic.bar,     title: "Readiness Score",  description: "Track your export readiness progress",       path: "/readiness",   color: "#dc2626" },
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
        background: "#0f1e3a",
        color: "white", padding: "2rem 2.5rem", borderRadius: "10px",
        marginBottom: "1.5rem", boxShadow: "0 2px 8px rgba(15,30,58,0.12)",
        border: "1px solid rgba(212,175,55,0.15)", position: "relative", overflow: "hidden",
      }}>
        {/* subtle grid */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.02, backgroundImage: "linear-gradient(#d4af37 1px, transparent 1px), linear-gradient(90deg, #d4af37 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: "0.68rem", fontWeight: "700", letterSpacing: "2px", color: "#d4af37", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            Rajesh Textiles Pvt Ltd · Mumbai
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "800", marginBottom: "0.4rem", letterSpacing: "-0.5px", lineHeight: 1.2 }}>
            Welcome to ExportReady
          </h1>
          <p style={{ fontSize: "0.85rem", opacity: 0.75, maxWidth: "520px", lineHeight: "1.7", marginBottom: "1.25rem" }}>
            AI-powered export intelligence for Indian MSMEs. Analyze markets, simulate profits, ensure compliance — all in one platform.
          </p>

          {/* ── Export Opportunities strip ────────────────────── */}
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.63rem", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(212,175,55,0.7)", marginBottom: "0.6rem" }}>
              🌍 Live Export Opportunities
            </div>
            <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
              {[
                { flag: "🇩🇪", country: "Germany",   product: "Cotton Shirts",    demand: "+12%", color: "#60a5fa" },
                { flag: "🇦🇪", country: "UAE",        product: "Basmati Rice",     demand: "+22%", color: "#4ade80" },
                { flag: "🇺🇸", country: "USA",        product: "Spices & Herbs",   demand: "+8%",  color: "#fbbf24" },
                { flag: "🇯🇵", country: "Japan",      product: "Organic Textiles", demand: "+15%", color: "#c084fc" },
                { flag: "🇬🇧", country: "UK",         product: "Leather Goods",   demand: "+10%", color: "#fb923c" },
              ].map(opp => (
                <div key={opp.country}
                  onClick={() => navigate("/market")}
                  style={{ flex: "1 1 120px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "0.625rem 0.875rem", cursor: "pointer", transition: "all 0.2s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.11)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.35)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "3px" }}>
                    <span style={{ fontSize: "0.85rem" }}>{opp.flag} <span style={{ fontWeight: "700", fontSize: "0.78rem" }}>{opp.country}</span></span>
                    <span style={{ color: "#4ade80", fontSize: "0.72rem", fontWeight: "800" }}>{opp.demand}</span>
                  </div>
                  <div style={{ fontSize: "0.7rem", opacity: 0.55 }}>{opp.product}</div>
                  <div style={{ fontSize: "0.62rem", color: opp.color, marginTop: "3px", opacity: 0.85, fontWeight: "600" }}>Demand ↑</div>
                </div>
              ))}
            </div>
          </div>

          {/* Live trade data pill (when backend is active) */}
          {tradeData && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: "1rem", background: "rgba(255,255,255,0.08)", borderRadius: "8px", padding: "0.75rem 1.25rem", border: "1px solid rgba(212,175,55,0.2)" }}>
              <div>
                <div style={{ fontSize: "0.62rem", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", opacity: 0.6 }}>Live · {tradeData.source}</div>
                <div style={{ fontSize: "1.25rem", fontWeight: "800", color: "#d4af37", lineHeight: 1.1 }}>{tradeData.india_export_value}</div>
                <div style={{ fontSize: "0.7rem", opacity: 0.7 }}>India Rice (HS 1006) Annual Exports</div>
              </div>
              <div style={{ width: "1px", height: "36px", background: "rgba(255,255,255,0.15)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: tradeData.live ? "#22c55e" : "#d4af37", boxShadow: tradeData.live ? "0 0 6px rgba(34,197,94,0.6)" : "none" }} />
                <span style={{ fontSize: "0.72rem", opacity: 0.75 }}>{tradeData.live ? "Real-time" : "Estimated"}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* KPI Metric Strip ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <MetricCard icon={Ic.box}     label="Products Listed"    value="3"      sub="Cotton Shirts, Rice, Spices" color="#0f1e3a" onClick={() => navigate("/product")} />
        <MetricCard icon={Ic.globe}   label="Markets Analyzed"   value="7"      sub="USA, UAE, Germany…"          color="#2563eb" onClick={() => navigate("/market")} />
        <MetricCard icon={Ic.doc}     label="Documents Ready"    value="6"      sub="Invoice, BoL, COO…"          color="#16a34a" onClick={() => navigate("/docs")} />
        <MetricCard icon={Ic.money}   label="Potential Revenue"  value="$2.4M"  sub="Based on market analysis"   color="#ca8a04" />
        <MetricCard icon={Ic.trendUp} label="Top Market"         value="UAE"    sub="Demand index: 94/100"        color="#7c3aed" onClick={() => navigate("/market")} />
        <MetricCard icon={Ic.shield}  label="Readiness Score"    value="45/100" sub="Click to improve"            color="#dc2626" onClick={() => navigate("/readiness")} />
      </div>

      {/* Charts row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
        <div style={{ background: "white", padding: "1.75rem", borderRadius: "10px", border: "1px solid #e8ecf0", boxShadow: "0 1px 2px rgba(15,30,58,0.05)" }}>
          <h3 style={{ color: "#0f1e3a", marginBottom: "1.25rem", fontSize: "0.9rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#2563eb" }}>{Ic.bar}</span> India Export Volume by Market
          </h3>
          <Bar data={barData} options={barOptions} />
        </div>
        <div style={{ background: "white", padding: "1.75rem", borderRadius: "10px", border: "1px solid #e8ecf0", boxShadow: "0 1px 2px rgba(15,30,58,0.05)" }}>
          <h3 style={{ color: "#0f1e3a", marginBottom: "1.25rem", fontSize: "0.9rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#7c3aed" }}>{Ic.pie}</span> Export Mix by Sector
          </h3>
          <Doughnut data={donutData} options={donutOptions} />
        </div>
      </div>

      {/* Navigation quick-access grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        {navCards.map(card => (
          <div key={card.path} onClick={() => navigate(card.path)}
            style={{ background: "white", border: "1px solid #e8ecf0", borderRadius: "10px", padding: "1.125rem", cursor: "pointer", transition: "all 0.2s ease", boxShadow: "0 1px 2px rgba(15,30,58,0.05)", display: "flex", alignItems: "center", gap: "0.875rem" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(15,30,58,0.10)"; e.currentTarget.style.borderLeft = `3px solid ${card.color}`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 2px rgba(15,30,58,0.05)"; e.currentTarget.style.borderLeft = "1px solid #e8ecf0"; }}
          >
            <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: `${card.color}12`, display: "flex", alignItems: "center", justifyContent: "center", color: card.color, flexShrink: 0 }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontWeight: "600", color: "#0f1e3a", fontSize: "0.87rem" }}>{card.title}</div>
              <div style={{ fontSize: "0.71rem", color: "#9ca3af", lineHeight: "1.4", marginTop: "0.1rem" }}>{card.description}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Analysis Section ── */}
      <div style={{ background: "white", padding: "2rem", borderRadius: "10px", boxShadow: "0 1px 2px rgba(15,30,58,0.05)", border: "1px solid #e8ecf0", marginBottom: "2rem" }}>
        <h2 style={{ color: "#0f1e3a", marginBottom: "1.25rem", fontSize: "1.05rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#2563eb" }}>{Ic.search}</span> Quick Product Analysis
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
            {sectionCard("#f0fdf4", "#d1fae5", "#16a34a", "Top Export Markets",
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {result.top_markets.map((m, i) => (
                  <div key={i} style={{ flex: "1 1 100px", padding: "1rem", background: "white", borderRadius: "8px", border: "1px solid #d1fae5", textAlign: "center", boxShadow: "0 1px 3px rgba(15,30,58,0.1)" }}>
                    <div style={{ fontWeight: "700", color: "#059669", fontSize: "0.95rem" }}>{m[0]}</div>
                    <div style={{ fontSize: "0.7rem", color: "#6b7280", marginTop: "0.25rem" }}>Score: {m[1]}</div>
                  </div>
                ))}
              </div>
            )}
            {sectionCard("#faf5ff", "#e9d5ff", "#8b5cf6", "Opportunity Scores",
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
            {sectionCard("#eff6ff", "#bfdbfe", "#2563eb", "Required Documents",
              <ul style={{ margin: 0, paddingLeft: "1.25rem", listStyleType: "disc" }}>
                {result.documents_required.map((doc, i) => (
                  <li key={i} style={{ padding: "0.35rem 0", color: "#1e40af", fontWeight: "500", fontSize: "0.85rem" }}>{doc[0]}</li>
                ))}
              </ul>
            )}
            {sectionCard("#fefce8", "#fde68a", "#ca8a04", "Potential Buyers",
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {result.potential_buyers.map((b, i) => (
                  <div key={i} style={{ flex: "1 1 100px", padding: "0.85rem", background: "white", borderRadius: "8px", border: "1px solid #fde68a", fontWeight: "600", color: "#92400e", textAlign: "center", fontSize: "0.85rem", boxShadow: "0 1px 3px rgba(15,30,58,0.1)" }}>{b[0]}</div>
                ))}
              </div>
            )}
            <div style={{ gridColumn: "1 / -1" }}>
              {sectionCard("#f0fdf4", "#d1fae5", "#059669", "Estimated Profit",
                <div style={{ textAlign: "center", padding: "1rem 0" }}>
                  <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "#059669" }}>{result.profit_estimation}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Impact Section ── */}
      <div style={{ background: "#0f1e3a", borderRadius: "10px", padding: "2rem 2.5rem", color: "white", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.05rem", fontWeight: "700", marginBottom: "0.35rem", color: "#d4af37" }}>ExportReady Impact</h2>
        <p style={{ opacity: 0.5, fontSize: "0.78rem", marginBottom: "1.75rem" }}>Why this platform matters for Indian MSMEs</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1.25rem" }}>
          {[
            { stat: "63 Million", desc: "MSMEs in India eligible to export" },
            { stat: "Only 1.8%", desc: "Actually export today — massive opportunity" },
            { stat: "₹4.2L/year", desc: "Average MSME loss due to wrong HS Codes" },
            { stat: "70% fewer", desc: "Compliance errors with ExportReady" },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: "center", padding: "1.25rem 1rem", background: "rgba(255,255,255,0.05)", borderRadius: "8px", border: "1px solid rgba(212,175,55,0.12)" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#d4af37", lineHeight: 1.1 }}>{item.stat}</div>
              <div style={{ fontSize: "0.75rem", opacity: 0.7, marginTop: "0.4rem", lineHeight: "1.5" }}>{item.desc}</div>
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
