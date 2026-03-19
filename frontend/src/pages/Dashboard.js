import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, ArcElement,
  Title, Tooltip, Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { ComposableMap, Geographies, Geography, Line, Marker } from "react-simple-maps";
import { Globe, Sparkles, ShieldCheck, TrendingUp, BarChart3, CheckCircle, Clock, FileText, AlertCircle } from "lucide-react";
import API from "../services/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// ─── Dashboard Cards Section (Merged from Dashboard.jsx) ────────────────────
function DashboardCardsSection() {
  const [dashData, setDashData] = useState(null);
  const [dashLoading, setDashLoading] = useState(true);
  const [dashError, setDashError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fallback demo data
        const fallbackData = {
          readiness_score: 62,
          next_action: "Complete IEC Certificate",
          pending_documents: ["IEC Certificate", "GST Registration", "RCMC Certificate"],
          pending_documents_count: 3,
          completed_documents: 2,
          total_documents: 5,
        };

        // Try live API call with Supabase JWT
        const token = localStorage.getItem("sb-auth-token");
        if (token) {
          const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:8000"}/api/v1/dashboard`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const apiData = await res.json();
            setDashData(apiData);
            setDashLoading(false);
            return;
          }
        }
        // Fallback to demo data on API failure
        setDashData(fallbackData);
      } catch (err) {
        setDashError("Failed to load readiness data");
        setDashData({
          readiness_score: 62,
          next_action: "Complete IEC Certificate",
          pending_documents: ["IEC Certificate", "GST Registration", "RCMC Certificate"],
          pending_documents_count: 3,
          completed_documents: 2,
          total_documents: 5,
        });
      } finally {
        setDashLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (dashLoading) {
    return <div style={{ fontSize: "14px", color: "#94A3B8", textAlign: "center", padding: "20px" }}>Loading dashboard...</div>;
  }

  if (!dashData) {
    return null;
  }

  const safeScore = dashData.readiness_score ?? 0;
  const stats = [
    { label: "Readiness", value: `${safeScore}/100`, icon: <BarChart3 size={24} />, accent: "#2563eb" },
    { label: "Completed", value: dashData.completed_documents ?? 0, icon: <CheckCircle size={24} />, accent: "#10b981" },
    { label: "Pending", value: dashData.pending_documents_count ?? 0, icon: <Clock size={24} />, accent: "#f59e0b" },
    { label: "Total Docs", value: dashData.total_documents ?? 0, icon: <FileText size={24} />, accent: "#8b5cf6" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0px", paddingBottom: "16px", borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="aurora-card-icon" style={{ background: "rgba(37,99,235,0.12)", color: "#2563eb" }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a", margin: 0 }}>Export Readiness Overview</h3>
          </div>
        </div>
        {dashError && <span style={{ fontSize: "12px", color: "#ef4444", display: "flex", alignItems: "center", gap: "4px" }}><AlertCircle size={14} /> {dashError}</span>}
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderTop: `3px solid ${stat.accent}`,
            borderRadius: "12px",
            padding: "24px",
            textAlign: "center",
            transition: "all 0.2s ease",
            cursor: "default",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#cbd5e1";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.boxShadow = "none";
          }}>
            <div style={{ fontSize: "20px", marginBottom: "12px", color: stat.accent }}>{stat.icon}</div>
            <div style={{ fontSize: "28px", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>
              {stat.value}
            </div>
            <div style={{ fontSize: "11px", fontWeight: 500, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Next Action & Pending Docs Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Next Action Card - Primary Style */}
        {dashData.next_action && (
          <div style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            border: "1px solid #e2e8f0",
            borderLeft: "4px solid #2563eb",
            borderRadius: "12px",
            padding: "24px",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#cbd5e1";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.boxShadow = "none";
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "11px", fontWeight: 500, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Next Action</div>
                <div style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a", marginBottom: "8px" }}>{dashData.next_action}</div>
                <div style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.5" }}>Submit comprehensive product information to unlock export market analysis.</div>
              </div>
            </div>
          </div>
        )}

        {/* Pending Documents Card */}
        {dashData.pending_documents && dashData.pending_documents.length > 0 && (
          <div style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "24px",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#cbd5e1";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.boxShadow = "none";
          }}>
            <div style={{ fontSize: "11px", fontWeight: 500, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>Pending Documents</div>
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "28px", fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>
                {dashData.pending_documents_count ?? 0}
              </div>
              <div style={{ fontSize: "13px", color: "#64748b" }}>
                {dashData.completed_documents ?? 0} of {dashData.total_documents ?? 0} completed
              </div>
            </div>
            {/* Progress Bar */}
            <div style={{ height: "4px", background: "#e2e8f0", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${((dashData.completed_documents ?? 0) / (dashData.total_documents || 1)) * 100}%`,
                background: "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
                borderRadius: "2px",
                transition: "width 0.3s ease",
              }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [tradeData, setTradeData] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [opportunityLoading, setOpportunityLoading] = useState(false);
  const [heatmapData, setHeatmapData] = useState([]);
  const [heatmapLoading, setHeatmapLoading] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  const [lastScan, setLastScan] = useState({
    product: "Cotton Shirts",
    hsCode: "6205",
    region: "Global",
    productPrice: 12,
    productionCost: 6,
    shippingCost: 1.2,
    dutyPercentage: 5,
  });
  const mapRef = useRef(null);

  useEffect(() => {
    API.get("/trade-volume", { params: { product_hs: "1006" } })
      .then(res => setTradeData(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("exportready_last_scan");
      if (saved) {
        const parsed = JSON.parse(saved);
        setLastScan(prev => ({
          ...prev,
          ...parsed,
          product: parsed.product || prev.product,
          hsCode: parsed.hsCode || prev.hsCode,
          region: parsed.region || prev.region,
        }));
      }
    } catch {
      // Ignore invalid stored data.
    }
  }, []);

  useEffect(() => {
    setOpportunityLoading(true);
    API.post("/export-chat", null, {
      params: {
        question: `/scan-opportunity ${lastScan.product}`,
        product: lastScan.product,
        hs_code: lastScan.hsCode,
        target_region: lastScan.region,
        product_price: lastScan.productPrice,
        production_cost: lastScan.productionCost,
        shipping_cost: lastScan.shippingCost,
        duty_percentage: lastScan.dutyPercentage,
      }
    })
      .then(res => {
        const data = res.data?.cards?.market_opportunities || [];
        setOpportunities(data.slice(0, 6));
      })
      .catch(() => {})
      .finally(() => setOpportunityLoading(false));
  }, [lastScan.product, lastScan.hsCode, lastScan.region, lastScan.productPrice, lastScan.productionCost, lastScan.shippingCost, lastScan.dutyPercentage]);

  useEffect(() => {
    if (!lastScan.product) return;
    setHeatmapLoading(true);
    API.get("/ai/demand-heatmap", { params: { product_name: lastScan.product } })
      .then(res => setHeatmapData(res.data || []))
      .catch(() => setHeatmapData([]))
      .finally(() => setHeatmapLoading(false));
  }, [lastScan.product]);

  const insightCards = [
    { label: "Products Listed", value: "3", accent: "#2563eb" },
    { label: "Markets Analyzed", value: "7", accent: "#10b981" },
    { label: "Potential Revenue", value: "$2.4M", accent: "#f59e0b" },
    { label: "Top Market", value: "UAE", accent: "#8b5cf6" },
    { label: "Export Readiness", value: "45/100", accent: "#2563eb" },
  ];

  const routes = [
    {
      id: "uae",
      from: [77, 28],
      to: [54.4, 24.3],
      color: "#10B981",
      tooltip: "UAE\nCotton Shirts\nDemand +22%\nTariff 5%\nLogistics $0.70",
    },
    {
      id: "germany",
      from: [77, 28],
      to: [10.4, 51.2],
      color: "#2F6BFF",
      tooltip: "Germany\nOrganic Textiles\nDemand +9%\nTariff 7%\nLogistics $0.82",
    },
    {
      id: "usa",
      from: [77, 28],
      to: [-98.5, 39.8],
      color: "#F5A623",
      tooltip: "USA\nSpices\nDemand +6%\nTariff 4%\nLogistics $1.10",
    },
  ];

  const handleMarkerEnter = (event, content) => {
    const bounds = mapRef.current?.getBoundingClientRect();
    if (!bounds) return;
    setTooltip({
      x: event.clientX - bounds.left + 12,
      y: event.clientY - bounds.top + 12,
      content,
    });
  };

  const handleMarkerMove = (event) => {
    if (!tooltip || !mapRef.current) return;
    const bounds = mapRef.current.getBoundingClientRect();
    setTooltip(prev => ({
      ...prev,
      x: event.clientX - bounds.left + 12,
      y: event.clientY - bounds.top + 12,
    }));
  };

  const normalizeCountry = (name) => (name || "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");

  const countryAliases = {
    usa: "united states of america",
    uk: "united kingdom",
    uae: "united arab emirates",
  };

  const demandColor = (score) => {
    if (score >= 9) return "#dc2626";
    if (score >= 7) return "#f97316";
    if (score >= 5) return "#eab308";
    return "#16a34a";
  };

  const heatmapLookup = heatmapData.reduce((acc, row) => {
    const rawName = (row?.country || "").toLowerCase();
    const mapped = countryAliases[rawName] || row?.country;
    const key = normalizeCountry(mapped);
    if (key) {
      acc[key] = row;
    }
    return acc;
  }, {});


  const barData = {
    labels: ["UAE", "USA", "Germany", "Japan", "UK", "Singapore", "France"],
    datasets: [{
      label: "Demand",
      data: [94, 82, 77, 70, 68, 64, 58],
      backgroundColor: [
        "rgba(37,99,235,0.85)",
        "rgba(37,99,235,0.65)",
        "rgba(37,99,235,0.55)",
        "rgba(37,99,235,0.45)",
        "rgba(37,99,235,0.35)",
        "rgba(37,99,235,0.25)",
        "rgba(37,99,235,0.2)",
      ],
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, title: { display: false } },
    scales: {
      y: { ticks: { color: "#64748B", font: { size: 10 } }, grid: { color: "#E6ECF3" } },
      x: { ticks: { color: "#94A3B8", font: { size: 10 } }, grid: { display: false } },
    },
  };

  const donutData = {
    labels: ["Agricultural", "Textiles", "Electronics", "Pharma", "Engineering"],
    datasets: [{
      data: [18, 15, 22, 12, 33],
      backgroundColor: ["#10B981", "#F5A623", "#2F6BFF", "#7C3AED", "#94A3B8"],
      borderWidth: 2,
      borderColor: "#FFFFFF",
    }],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    cutout: "68%",
  };

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", paddingTop: "24px", paddingBottom: "24px" }}>
        <div className="aurora-hero">
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ fontSize: "12px", color: "#94A3B8" }}>ExportReady — Mumbai, India</div>
          <h1 className="aurora-hero-title">Discover Your Next Export Market</h1>
          <p style={{ fontSize: "14px", color: "#475569", maxWidth: "380px" }}>
            Find global demand, understand compliance,
            and estimate profits in minutes.
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="aurora-cta primary" onClick={() => navigate("/market")}>Analyze My Product</button>
            <button className="aurora-cta" onClick={() => navigate("/market")}>Explore Global Markets</button>
          </div>
        </div>

        <div className="aurora-map" ref={mapRef} onMouseMove={handleMarkerMove}>
          {tooltip && (
            <div className="aurora-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
              {tooltip.content.split("\n").map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          )}
          <ComposableMap projectionConfig={{ scale: 140 }}>
            <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
              {({ geographies }) =>
                geographies.map(geo => {
                  const isIndia = geo.properties.NAME === "India";
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isIndia ? "#F5A623" : "#D6DFEC"}
                      stroke="#E3E9F3"
                      strokeWidth={0.5}
                    />
                  );
                })
              }
            </Geographies>

            {routes.map(route => (
              <Line
                key={route.id}
                from={route.from}
                to={route.to}
                stroke={route.color}
                strokeWidth={1}
                strokeDasharray="3 3"
              />
            ))}

            {routes.map(route => (
              <Marker key={`${route.id}-dest`} coordinates={route.to}>
                <circle
                  r={4}
                  fill={route.color}
                  className="aurora-pulse-node"
                  onMouseEnter={(event) => handleMarkerEnter(event, route.tooltip)}
                  onMouseLeave={() => setTooltip(null)}
                />
              </Marker>
            ))}

            <Marker coordinates={[77, 28]}>
              <circle r={5} fill="#F5A623" />
            </Marker>
          </ComposableMap>
        </div>
      </div>

      <div className="aurora-panel">
        <DashboardCardsSection />
      </div>

      <div className="aurora-panel" style={{ position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="aurora-card-icon" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>
              <Globe size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a", margin: 0, marginBottom: "2px" }}>Export Opportunities</h3>
              <div style={{ fontSize: "12px", color: "#94a3b8" }}>Powered by AI · {opportunityLoading ? "Loading..." : "Live"}</div>
            </div>
          </div>
        </div>


        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginTop: "16px" }}>
          {(opportunities.length > 0 ? opportunities.slice(0, 4) : []).map((item) => (
            <div key={item.country} style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", background: "white", transition: "all 0.2s ease" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#cbd5e1";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.boxShadow = "none";
              }}>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a", marginBottom: "12px" }}>
                {item.country}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 500, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Opportunity</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>{item.opportunity_score ?? "-"}</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 500, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Tariff</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "#f59e0b" }}>{item.tariff ?? "-"}%</div>
                </div>
              </div>
              {Array.isArray(item.why_market) && item.why_market.length > 0 && (
                <div style={{ marginBottom: "12px", padding: "12px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                  <div style={{ fontSize: "12px", color: "#475569", lineHeight: "1.5" }}>
                    {item.why_market.slice(0, 2).join(" • ")}
                  </div>
                </div>
              )}
              <button
                className="aurora-cta"
                style={{ marginTop: "12px", width: "100%", fontSize: "13px", fontWeight: 600, padding: "10px" }}
                onClick={() => navigate("/export-plan", {
                  state: {
                    product: lastScan.product,
                    hsCode: lastScan.hsCode,
                    country: item.country,
                    productPrice: lastScan.productPrice,
                    productionCost: lastScan.productionCost,
                    shippingCost: lastScan.shippingCost,
                    dutyPercentage: lastScan.dutyPercentage,
                  }
                })}
              >
                Export Plan
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="aurora-panel">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #f1f5f9" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
              <div className="aurora-card-icon" style={{ background: "rgba(37,99,235,0.12)", color: "#2563eb" }}>
                <Globe size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a", margin: 0 }}>Global Demand Map</h3>
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginLeft: "36px", marginTop: "4px" }}>Powered by AI · Updated daily</div>
          </div>
          <div style={{ fontSize: "13px", fontWeight: 500, color: "#475569", background: "#f1f5f9", padding: "6px 12px", borderRadius: "6px" }}>
            {lastScan.product}
          </div>
        </div>

        <div style={{
          position: "relative",
          width: "100%",
          height: 340,
          overflow: "hidden",
          borderRadius: 12,
          background: "#f0f4f8",
          marginBottom: "16px",
          border: "1px solid #e2e8f0",
        }}>
          {/* World map background */}
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
            alt="World Map"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.12,
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1,
            }}
          />

          {/* Demand dots */}
          {[
            { country: "UAE", left: "62%", top: "38%", color: "#ef4444", demand: "High" },
            { country: "Germany", left: "50%", top: "25%", color: "#f97316", demand: "Medium" },
            { country: "UK", left: "47%", top: "23%", color: "#f97316", demand: "Medium" },
            { country: "USA", left: "18%", top: "30%", color: "#eab308", demand: "Growing" },
            { country: "Japan", left: "79%", top: "30%", color: "#22c55e", demand: "Emerging" },
            { country: "Singapore", left: "76%", top: "48%", color: "#22c55e", demand: "Emerging" },
          ].map((dot) => (
            <div
              key={dot.country}
              title={`${dot.country} — ${dot.demand} demand`}
              style={{
                position: "absolute",
                left: dot.left,
                top: dot.top,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: dot.color,
                border: "2px solid white",
                transform: "translate(-50%, -50%)",
                boxShadow: `0 0 12px ${dot.color}80, 0 0 4px rgba(0,0,0,0.1)`,
                cursor: "pointer",
                zIndex: 2,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.3)";
                e.currentTarget.style.boxShadow = `0 0 16px ${dot.color}ff, 0 0 8px rgba(0,0,0,0.15)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)";
                e.currentTarget.style.boxShadow = `0 0 12px ${dot.color}80, 0 0 4px rgba(0,0,0,0.1)`;
              }}
            />
          ))}
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "10px", flexWrap: "wrap", fontSize: "12px", color: "#475569" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "999px", background: "#ef4444" }} />
            High demand
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "999px", background: "#f97316" }} />
            Medium demand
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "999px", background: "#eab308" }} />
            Growing demand
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "999px", background: "#22c55e" }} />
            Emerging market
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px", marginBottom: "8px" }}>
        {insightCards.map(card => (
          <div key={card.label} style={{
            border: "1px solid #e2e8f0",
            borderTop: `3px solid ${card.accent}`,
            borderRadius: "12px",
            padding: "16px",
            background: "white",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#cbd5e1";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.boxShadow = "none";
          }}>
            <div style={{ fontSize: "11px", fontWeight: 500, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>{card.label}</div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: card.accent }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "20px" }}>
        <div className="aurora-panel" style={{ borderTop: "3px solid #10b981" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #f1f5f9" }}>
            <div className="aurora-card-icon" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>
              <Globe size={20} />
            </div>
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a", margin: 0 }}>Top Export Opportunity</h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "16px" }}>
            {[
              { label: "Country", value: "UAE" },
              { label: "Product", value: "Cotton Shirts" },
              { label: "HS Code", value: "6205" },
              { label: "Demand Growth", value: "+22%", color: "#10b981" },
              { label: "Market Size", value: "$1.3B" },
              { label: "Import Tariff", value: "5%" },
            ].map((item, idx) => (
              <div key={idx}>
                <div style={{ fontSize: "11px", fontWeight: 500, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>{item.label}</div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: item.color || "#0f172a" }}>{item.value}</div>
              </div>
            ))}
          </div>
          <div style={{ paddingTop: "16px", borderTop: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: "11px", fontWeight: 500, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Opportunity Score</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "12px" }}>
              <div style={{ flex: 1, height: "6px", background: "#e2e8f0", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: "92%", background: "linear-gradient(90deg, #10b981 0%, #06b6d4 100%)", borderRadius: "3px" }} />
              </div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", minWidth: "50px" }}>92 / 100</div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: "20px" }}>
          <div className="aurora-panel" style={{ borderTop: "3px solid #2563eb" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div className="aurora-card-icon" style={{ background: "rgba(37,99,235,0.12)", color: "#2563eb" }}>
                <ShieldCheck size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a", margin: 0 }}>Export Readiness</h3>
            </div>
            <div style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.6" }}>
              Your complete readiness assessment and required documents are shown in the <strong>Readiness Overview</strong> section above. All 5 required documents are being tracked there.
            </div>
          </div>

          <div className="aurora-panel" style={{ background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)", border: "1px solid #fcd34d", borderTop: "3px solid #f59e0b" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <div className="aurora-card-icon" style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}>
                <AlertCircle size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#92400e", margin: 0 }}>Quick Actions</h3>
            </div>
            <div style={{ display: "grid", gap: "8px", fontSize: "13px", color: "#b45309" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><span style={{ color: "#f59e0b" }}>→</span> Upload IEC certificate</div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><span style={{ color: "#f59e0b" }}>→</span> Verify UAE buyer credentials</div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><span style={{ color: "#f59e0b" }}>→</span> Check textile certification</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div className="aurora-panel">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #f1f5f9" }}>
            <div className="aurora-card-icon" style={{ background: "rgba(37,99,235,0.12)", color: "#2563eb" }}>
              <BarChart3 size={20} />
            </div>
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a", margin: 0 }}>Export Demand by Country</h3>
          </div>
          <div className="aurora-chart">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
        <div className="aurora-panel">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #f1f5f9" }}>
            <div className="aurora-card-icon" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>
              <TrendingUp size={20} />
            </div>
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a", margin: 0 }}>Profit Simulation Breakdown</h3>
          </div>
          <div className="aurora-chart">
            <Bar
              data={{
                labels: ["Production", "Shipping", "Duty", "Profit"],
                datasets: [{
                  data: [1.2, 0.7, 0.3, 2.4],
                  backgroundColor: ["#94a3b8", "#2563eb", "#f59e0b", "#10b981"],
                  borderRadius: 6,
                }],
              }}
              options={barOptions}
            />
          </div>
        </div>
        <div className="aurora-panel">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #f1f5f9" }}>
            <div className="aurora-card-icon" style={{ background: "rgba(168,85,247,0.12)", color: "#8b5cf6" }}>
              <TrendingUp size={20} />
            </div>
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a", margin: 0 }}>Export Sector Mix</h3>
          </div>
          <div className="aurora-chart" style={{ marginBottom: "24px" }}>
            <Doughnut data={donutData} options={donutOptions} />
          </div>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "space-around", padding: "16px 0", borderTop: "1px solid #f1f5f9" }}>
            {[
              { color: "#10b981", label: "Agriculture", percentage: "18%" },
              { color: "#f59e0b", label: "Textiles", percentage: "15%" },
              { color: "#2563eb", label: "Electronics", percentage: "22%" },
              { color: "#8b5cf6", label: "Pharma", percentage: "12%" },
              { color: "#94a3b8", label: "Engineering", percentage: "33%" },
            ].map((sector) => (
              <div key={sector.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: sector.color, flexShrink: 0 }} />
                <div style={{ fontSize: "13px", color: "#475569", fontWeight: 500 }}>
                  {sector.label} <span style={{ color: "#94a3b8" }}>({sector.percentage})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="aurora-panel" style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          borderLeft: "4px solid #8b5cf6",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div className="aurora-card-icon" style={{ background: "rgba(168,85,247,0.12)", color: "#8b5cf6" }}>
              <Sparkles size={20} />
            </div>
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a", margin: 0 }}>Sector Insights</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "12px" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 500, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Top Sector</div>
                <div style={{ fontSize: "28px", fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>Engineering</div>
                <div style={{ fontSize: "13px", color: "#64748b" }}>33% of total exports</div>
              </div>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 500, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Growth Leader</div>
                <div style={{ fontSize: "28px", fontWeight: 700, color: "#10b981", marginBottom: "4px" }}>+22%</div>
                <div style={{ fontSize: "13px", color: "#64748b" }}>Agriculture YoY</div>
              </div>
            </div>
            <div style={{ padding: "14px", background: "rgba(37,99,235,0.08)", borderRadius: "10px", border: "1px solid rgba(37,99,235,0.16)" }}>
              <div style={{ fontSize: "13px", color: "#0f172a", lineHeight: "1.6" }}>
                <strong>Recommendation:</strong> Diversify into Agriculture for UAE market — growing +22% YoY with 40% lower competition than Engineering.
              </div>
            </div>
          </div>
        </div>
      </div>

      {tradeData && (
        <div style={{ fontSize: "12px", color: "#94A3B8" }}>
          Live feed: {tradeData.india_export_value} · {tradeData.source}
        </div>
      )}
      </div>
    </div>
  );
}

export default Dashboard;
