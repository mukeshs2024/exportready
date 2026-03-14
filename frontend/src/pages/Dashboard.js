import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, ArcElement,
  Title, Tooltip, Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { ComposableMap, Geographies, Geography, Line, Marker } from "react-simple-maps";
import { Globe, Sparkles, ShieldCheck, TrendingUp } from "lucide-react";
import API from "../services/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

function Dashboard() {
  const navigate = useNavigate();
  const [tradeData, setTradeData] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    API.get("/trade-volume", { params: { product_hs: "1006" } })
      .then(res => setTradeData(res.data))
      .catch(() => {});
  }, []);

  const insightCards = [
    { label: "Products Listed", value: "3", accent: "#2F6BFF" },
    { label: "Markets Analyzed", value: "7", accent: "#10B981" },
    { label: "Potential Revenue", value: "$2.4M", accent: "#F5A623" },
    { label: "Top Market", value: "UAE", accent: "#7C3AED" },
    { label: "Export Readiness", value: "45/100", accent: "#2F6BFF" },
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

  const barData = {
    labels: ["UAE", "USA", "Germany", "Japan", "UK", "Singapore", "France"],
    datasets: [{
      label: "Demand",
      data: [94, 82, 77, 70, 68, 64, 58],
      backgroundColor: [
        "rgba(47,107,255,0.85)",
        "rgba(47,107,255,0.65)",
        "rgba(47,107,255,0.55)",
        "rgba(47,107,255,0.45)",
        "rgba(47,107,255,0.35)",
        "rgba(47,107,255,0.25)",
        "rgba(47,107,255,0.2)",
      ],
      borderRadius: 6,
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
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
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

      <div className="aurora-card-grid">
        {insightCards.map(card => (
          <div key={card.label} className="aurora-card">
            <div className="aurora-card-top" style={{ background: card.accent }} />
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div className="aurora-icon-badge" style={{ background: `${card.accent}14`, color: card.accent }}>
                <TrendingUp size={16} />
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#94A3B8" }}>{card.label}</div>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#0F172A", marginTop: "4px" }}>{card.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "12px" }}>
        <div className="aurora-panel">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <div className="aurora-card-icon" style={{ background: "rgba(16,185,129,0.12)", color: "#10B981" }}>
              <Globe size={18} />
            </div>
            <h3 className="aurora-section-title">Top Export Opportunity</h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "12px" }}>
            <div>
              <div style={{ fontSize: "12px", color: "#94A3B8" }}>Country</div>
              <div style={{ fontSize: "14px", fontWeight: 600 }}>UAE</div>
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#94A3B8" }}>Product</div>
              <div style={{ fontSize: "14px", fontWeight: 600 }}>Cotton Shirts</div>
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#94A3B8" }}>HS Code</div>
              <div style={{ fontSize: "14px", fontWeight: 600 }}>6205</div>
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#94A3B8" }}>Demand Growth</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#10B981" }}>+22%</div>
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#94A3B8" }}>Market Size</div>
              <div style={{ fontSize: "14px", fontWeight: 600 }}>$1.3B</div>
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#94A3B8" }}>Import Tariff</div>
              <div style={{ fontSize: "14px", fontWeight: 600 }}>5%</div>
            </div>
          </div>
          <div style={{ fontSize: "12px", color: "#94A3B8", marginBottom: "6px" }}>Opportunity Score</div>
          <div className="aurora-progress-track">
            <div className="aurora-progress-fill" />
          </div>
          <div style={{ fontSize: "12px", color: "#475569", marginTop: "6px" }}>92 / 100</div>
        </div>

        <div style={{ display: "grid", gap: "12px" }}>
          <div className="aurora-panel">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <div className="aurora-card-icon" style={{ background: "rgba(47,107,255,0.12)", color: "#2F6BFF" }}>
                <ShieldCheck size={18} />
              </div>
              <h3 className="aurora-section-title">Export Readiness</h3>
            </div>
            <div style={{ fontSize: "24px", fontWeight: 700, marginBottom: "6px" }}>45 / 100</div>
            <div style={{ fontSize: "12px", color: "#94A3B8", marginBottom: "6px" }}>Next Step</div>
            <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>Upload IEC Certificate</div>
            <div className="aurora-progress-track">
              <div className="aurora-progress-fill" style={{ width: "45%" }} />
            </div>
          </div>

          <div className="aurora-panel">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <div className="aurora-card-icon" style={{ background: "rgba(245,166,35,0.12)", color: "#F5A623" }}>
                <Sparkles size={18} />
              </div>
              <h3 className="aurora-section-title">AI Recommended Actions</h3>
            </div>
            <div style={{ display: "grid", gap: "8px", fontSize: "13px" }}>
              <div>Upload IEC certificate</div>
              <div>Verify UAE buyer credentials</div>
              <div>Check textile certification</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div className="aurora-panel">
          <div className="aurora-section-title">Export Demand by Country</div>
          <div className="aurora-chart">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
        <div className="aurora-panel">
          <div className="aurora-section-title">Profit Simulation Breakdown</div>
          <div className="aurora-chart">
            <Bar
              data={{
                labels: ["Production", "Shipping", "Duty", "Profit"],
                datasets: [{
                  data: [1.2, 0.7, 0.3, 2.4],
                  backgroundColor: ["#94A3B8", "#2F6BFF", "#F5A623", "#10B981"],
                  borderRadius: 6,
                }],
              }}
              options={barOptions}
            />
          </div>
        </div>
        <div className="aurora-panel">
          <div className="aurora-section-title">Export Sector Mix</div>
          <div className="aurora-chart">
            <Doughnut data={donutData} options={donutOptions} />
          </div>
        </div>
      </div>

      {tradeData && (
        <div style={{ fontSize: "12px", color: "#94A3B8" }}>
          Live feed: {tradeData.india_export_value} · {tradeData.source}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
