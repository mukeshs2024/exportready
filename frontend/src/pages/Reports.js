import { useState, useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import API from "../services/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const DEMO = {
  exporter: "Rajesh Textiles Pvt Ltd",
  location: "Mumbai, Maharashtra",
  product: "Premium Cotton Apparel",
  totalRevenue: 2400000,
  shipments: 12,
  markets: "UAE 42%, USA 31%, Germany 27%",
  marketSplit: { UAE: 42, USA: 31, Germany: 27 },
  monthly: {
    labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    revenue: [180000, 165000, 210000, 195000, 240000, 220000],
  },
};

const STATIC_INSIGHTS = [
  "💡 UAE shows highest ROI — India-UAE CEPA gives 0% tariff on most cotton apparel categories",
  "📈 Germany orders grew 18% YoY — premium segment demand for Indian organic cotton is rising",
  "⚠️ USD/INR at 83.2 could compress margins 3-4% — consider forward contracts for next 2 quarters",
  "🎯 Increase UAE allocation to 50% and add Saudi Arabia as 4th market to reduce concentration risk",
];

const ALERTS = [
  { color: "#d97706", title: "Currency Risk", desc: "USD/INR at 83.2 — elevated volatility this quarter", bg: "#fef3c7", border: "#d97706" },
  { color: "#16a34a", title: "Seasonality Alert", desc: "Ramadan demand spike in UAE — stock up by Q2", bg: "#f0fdf4", border: "#16a34a" },
  { color: "#2563eb", title: "RoDTEP Available", desc: "Pending ₹1.2L in RoDTEP reimbursements on ICEGATE", bg: "#eff6ff", border: "#2563eb" },
];

function KPI({ label, value, sub, color }) {
  return (
    <div style={{ background: "white", borderRadius: "10px", padding: "1.1rem 1.4rem", border: "1px solid #e2e8f0", borderTop: `4px solid ${color}`, boxShadow: "0 1px 3px rgba(15,30,58,0.08)", flex: 1, minWidth: "130px" }}>
      <div style={{ fontSize: "1.55rem", fontWeight: "900", color, marginBottom: "0.15rem", lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: "0.78rem", fontWeight: "700", color: "#0f1e3a" }}>{label}</div>
      {sub && <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "0.2rem" }}>{sub}</div>}
    </div>
  );
}

function Reports() {
  const [insights, setInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const reportRef = useRef(null);

  useEffect(() => {
    const fetch = async () => {
      setInsightsLoading(true);
      try {
        const res = await API.post("/export-insights", null, {
          params: { product: DEMO.product, revenue: "$2.4M", markets: DEMO.markets, shipments: DEMO.shipments },
        });
        setInsights(res.data.insights);
      } catch {
        setInsights(STATIC_INSIGHTS);
      } finally {
        setInsightsLoading(false);
      }
    };
    fetch();
  }, []);

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    setPdfLoading(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 1.5, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const w = pdf.internal.pageSize.getWidth();
      const h = (canvas.height * w) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, w, Math.min(h, 297));
      pdf.save("ExportReady_Performance_Report.pdf");
    } finally {
      setPdfLoading(false);
    }
  };

  const barData = {
    labels: DEMO.monthly.labels,
    datasets: [{
      label: "Revenue (USD)",
      data: DEMO.monthly.revenue,
      backgroundColor: "rgba(15, 30, 58, 0.85)",
      hoverBackgroundColor: "#d4af37",
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => `$${(ctx.raw / 1000).toFixed(0)}K` } },
    },
    scales: {
      y: { ticks: { callback: v => `$${v / 1000}K`, font: { size: 11 } }, grid: { color: "#f1f5f9" } },
      x: { grid: { display: false } },
    },
  };

  const doughnutData = {
    labels: Object.keys(DEMO.marketSplit),
    datasets: [{
      data: Object.values(DEMO.marketSplit),
      backgroundColor: ["#0f1e3a", "#d4af37", "#3b82f6"],
      borderWidth: 2,
      borderColor: "white",
      hoverOffset: 8,
    }],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom", labels: { padding: 14, font: { size: 12 }, usePointStyle: true } },
      tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}%` } },
    },
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ color: "#0f1e3a", fontSize: "1.5rem", fontWeight: "800", margin: 0, marginBottom: "0.25rem" }}>
            📊 Export Performance Report
          </h2>
          <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0 }}>
            {DEMO.exporter} · {DEMO.location} · {DEMO.product}
          </p>
        </div>
        <button onClick={downloadPDF} disabled={pdfLoading} style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          padding: "0.7rem 1.5rem",
          background: pdfLoading ? "#e2e8f0" : "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)",
          color: pdfLoading ? "#475569" : "white", border: "none", borderRadius: "8px",
          fontSize: "0.82rem", fontWeight: "600", cursor: pdfLoading ? "not-allowed" : "pointer",
          boxShadow: "0 2px 8px rgba(15,30,58,0.2)",
        }}>
          {pdfLoading ? "Generating..." : "📥 Download PDF"}
        </button>
      </div>

      <div ref={reportRef}>
        {/* KPI Strip */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.75rem" }}>
          <KPI label="Total Revenue"  value="$2.4M"  sub="FY 2025-26"      color="#0f1e3a" />
          <KPI label="Shipments"      value="12"     sub="Last 6 months"   color="#d4af37" />
          <KPI label="Top Market"     value="UAE"    sub="42% share"       color="#059669" />
          <KPI label="YoY Growth"     value="+23%"   sub="vs last year"    color="#2563eb" />
          <KPI label="Avg Shipment"   value="$200K"  sub="per invoice"     color="#7c3aed" />
        </div>

        {/* Charts row */}
        <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.75rem", flexWrap: "wrap" }}>
          <div style={{ flex: 2, minWidth: "280px", background: "white", borderRadius: "12px", padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(15,30,58,0.08)" }}>
            <h3 style={{ color: "#0f1e3a", fontSize: "0.95rem", fontWeight: "700", marginBottom: "1.25rem", marginTop: 0 }}>
              Monthly Revenue (USD)
            </h3>
            <Bar data={barData} options={barOptions} />
          </div>
          <div style={{ flex: 1, minWidth: "230px", background: "white", borderRadius: "12px", padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(15,30,58,0.08)" }}>
            <h3 style={{ color: "#0f1e3a", fontSize: "0.95rem", fontWeight: "700", marginBottom: "1.25rem", marginTop: 0 }}>
              Export Market Split
            </h3>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

        {/* Insights + Alerts row */}
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          {/* AI Insights */}
          <div style={{ flex: 2, minWidth: "280px", background: "white", borderRadius: "12px", padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(15,30,58,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
              <h3 style={{ color: "#0f1e3a", fontSize: "0.95rem", fontWeight: "700", margin: 0 }}>AI Performance Insights</h3>
              <span style={{ background: "#7c3aed", color: "white", borderRadius: "12px", padding: "0.15rem 0.6rem", fontSize: "0.7rem", fontWeight: "700" }}>AI</span>
            </div>
            {insightsLoading ? (
              <div style={{ color: "#94a3b8", fontSize: "0.85rem", padding: "0.5rem 0" }}>Generating AI insights...</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                {(insights || STATIC_INSIGHTS).map((ins, i) => (
                  <div key={i} style={{
                    padding: "0.85rem 1rem",
                    background: ["#f0f7ff", "#fafaf0", "#fff5f5", "#f0fdf4"][i % 4],
                    borderRadius: "8px",
                    borderLeft: `3px solid ${["#0f1e3a", "#d4af37", "#dc2626", "#059669"][i % 4]}`,
                    fontSize: "0.85rem", color: "#1e293b", lineHeight: "1.5",
                  }}>
                    {ins}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Alerts */}
          <div style={{ flex: 1, minWidth: "230px", background: "white", borderRadius: "12px", padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(15,30,58,0.08)" }}>
            <h3 style={{ color: "#0f1e3a", fontSize: "0.95rem", fontWeight: "700", marginBottom: "1.25rem", marginTop: 0 }}>
              Trade Alerts
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {ALERTS.map((a, i) => (
                <div key={i} style={{ padding: "0.85rem 1rem", background: a.bg, borderRadius: "8px", borderLeft: `3px solid ${a.border}`, display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: a.color, flexShrink: 0, marginTop: "4px", display: "inline-block" }} />
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "0.82rem", color: "#0f1e3a", marginBottom: "0.2rem" }}>{a.title}</div>
                    <div style={{ fontSize: "0.77rem", color: "#4a5568" }}>{a.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: "1.5rem", background: "#f8fafc", borderRadius: "8px", padding: "0.85rem 1.25rem", border: "1px solid #e2e8f0", textAlign: "center" }}>
          <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: 0 }}>
            ExportReady · Data: UN Comtrade 2023–24 · AI: Claude claude-3-haiku-20240307 · Generated {new Date().toLocaleDateString("en-IN")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Reports;

