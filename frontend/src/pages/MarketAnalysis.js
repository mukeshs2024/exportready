import { useRef, useState } from "react";
import { ComposableMap, Geographies, Geography, Line, Marker } from "react-simple-maps";
import API from "../services/api";

// ---------------------------------------------------------------------------
// MarketCard — renders a single AI-generated market intelligence card
// ---------------------------------------------------------------------------
function MarketCard({ market, index }) {
  const colors = [
    { border: "#2563eb", bg: "#eff6ff", badge: "#1d4ed8" },
    { border: "#16a34a", bg: "#f0fdf4", badge: "#15803d" },
    { border: "#ca8a04", bg: "#fefce8", badge: "#a16207" },
    { border: "#9333ea", bg: "#faf5ff", badge: "#7e22ce" },
    { border: "#dc2626", bg: "#fef2f2", badge: "#b91c1c" },
  ];
  const c = colors[index % colors.length];

  return (
    <div style={{
      border: `1.5px solid ${c.border}`,
      borderLeft: `4px solid ${c.border}`,
      background: c.bg,
      borderRadius: "10px",
      padding: "1.5rem",
      boxShadow: "0 2px 8px rgba(15,30,58,0.08)",
      display: "flex",
      flexDirection: "column",
      gap: "0.6rem",
    }}>
      {/* Country header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
        <h3 style={{ margin: 0, color: "#0f1e3a", fontSize: "1.05rem", fontWeight: "800" }}>
          {market.country}
        </h3>
        <span style={{
          background: c.badge, color: "white", borderRadius: "20px",
          padding: "0.25rem 0.75rem", fontSize: "0.75rem", fontWeight: "700"
        }}>
          Demand {market.demand_index}/100
        </span>
      </div>

      {/* Metrics grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
        <div style={{ background: "white", borderRadius: "6px", padding: "0.6rem 0.75rem", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Import Volume</div>
          <div style={{ fontSize: "0.88rem", color: "#0f1e3a", fontWeight: "700", marginTop: "0.2rem" }}>{market.import_volume}</div>
        </div>
        <div style={{ background: "white", borderRadius: "6px", padding: "0.6rem 0.75rem", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Tariff Rate</div>
          <div style={{ fontSize: "0.88rem", color: "#dc2626", fontWeight: "700", marginTop: "0.2rem" }}>{market.tariff}</div>
        </div>
      </div>

      {/* Best route */}
      <div style={{ background: "white", borderRadius: "6px", padding: "0.6rem 0.75rem", border: "1px solid #e2e8f0" }}>
        <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Best Route</div>
        <div style={{ fontSize: "0.83rem", color: "#0f1e3a", fontWeight: "600", marginTop: "0.2rem" }}>{market.best_route}</div>
      </div>

      {/* Buyers */}
      <div>
        <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.4rem" }}>
          Top Buyers
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {(market.buyers || []).map((buyer, i) => (
            <span key={i} style={{
              background: c.badge, color: "white", borderRadius: "4px",
              padding: "0.2rem 0.55rem", fontSize: "0.75rem", fontWeight: "600"
            }}>
              {buyer}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function MarketAnalysis() {

  const [productName, setProductName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // AI intelligence cards
  const [aiMarkets, setAiMarkets] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // HS Code
  const [hsCode, setHsCode] = useState(null);
  const [hsLoading, setHsLoading] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  const mapRef = useRef(null);

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

  const analyze = async () => {
    if (!productName.trim()) {
      alert("Please enter a product name");
      return;
    }

    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await API.get("/export-analysis", {
        params: { product: productName }
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getAIIntelligence = async () => {
    if (!productName.trim()) {
      alert("Please enter a product name first");
      return;
    }
    setAiError("");
    setAiMarkets(null);
    setAiLoading(true);
    setHsCode(null);
    setHsLoading(true);

    // Run both AI market analysis and HS code suggestion in parallel
    const [marketRes, hsRes] = await Promise.allSettled([
      API.post("/market-analysis-ai", null, { params: { product: productName } }),
      API.get("/hs-suggest", { params: { product: productName } }),
    ]);

    if (marketRes.status === "fulfilled") {
      setAiMarkets(marketRes.value.data);
    } else {
      setAiError(marketRes.reason?.response?.data?.detail || "AI market analysis failed");
    }

    if (hsRes.status === "fulfilled") {
      setHsCode(hsRes.value.data);
    }

    setAiLoading(false);
    setHsLoading(false);
  };

  return (
    <div style={{background: "white", padding: "3rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(15, 30, 58, 0.12)", border: "1px solid #e2e8f0"}}>
      <h2 style={{color: "#0f1e3a", marginBottom: "2.5rem", fontSize: "1.4rem", fontWeight: "800"}}><span style={{marginRight: "0.75rem"}}>◌</span>Market Analysis</h2>

      <div style={{marginBottom: "1.5rem"}}>
        <label style={{display: "block", fontWeight: "600", color: "#1a202c", marginBottom: "0.5rem", fontSize: "0.8rem"}}>
          Product Name
        </label>
        <input
          placeholder="e.g., Cotton Shirts, Electronics Components"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && analyze()}
          style={{
            width: "100%",
            padding: "0.875rem 1rem",
            border: "1.5px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "0.85rem",
            fontFamily: "inherit",
            transition: "all 0.2s ease",
            boxSizing: "border-box",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#0f1e3a";
            e.target.style.boxShadow = "0 0 0 3px rgba(15, 30, 58, 0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#e2e8f0";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>

      {/* Dual action buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0" }}>
        <button
          onClick={analyze}
          disabled={loading}
          style={{
            padding: "0.875rem 1rem",
            background: loading ? "#e2e8f0" : "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)",
            color: loading ? "#4a5568" : "white",
            border: "none", borderRadius: "8px", fontSize: "0.82rem",
            fontWeight: "600", cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s ease", textTransform: "uppercase", letterSpacing: "0.5px",
          }}
        >
          {loading ? "Analyzing..." : "📊 Database Analysis"}
        </button>

        <button
          onClick={getAIIntelligence}
          disabled={aiLoading}
          style={{
            padding: "0.875rem 1rem",
            background: aiLoading ? "#e2e8f0" : "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
            color: aiLoading ? "#4a5568" : "white",
            border: "none", borderRadius: "8px", fontSize: "0.82rem",
            fontWeight: "600", cursor: aiLoading ? "not-allowed" : "pointer",
            transition: "all 0.2s ease", textTransform: "uppercase", letterSpacing: "0.5px",
          }}
        >
          {aiLoading ? "Generating..." : "AI Market Intelligence"}
        </button>
      </div>

      {error && <p style={{color:"#dc2626",marginTop:"1.5rem",padding:"1rem",background:"#fee2e2",borderRadius:"6px",borderLeft:"3px solid #dc2626"}}>{error}</p>}
      {aiError && <p style={{color:"#7c3aed",marginTop:"1.5rem",padding:"1rem",background:"#f5f3ff",borderRadius:"6px",borderLeft:"3px solid #7c3aed"}}>{aiError}</p>}

      {/* HS Code Card */}
      {(hsLoading || hsCode) && (
        <div style={{ marginTop: "2rem", padding: "1.25rem 1.5rem", background: "#f0fdf4", borderRadius: "8px", borderLeft: "4px solid #16a34a", border: "1px solid #d1fae5" }}>
          {hsLoading ? (
            <p style={{ margin: 0, color: "#15803d", fontWeight: "600", fontSize: "0.85rem" }}>Looking up HS Code...</p>
          ) : hsCode && (
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>HS Code</div>
                <div style={{ fontSize: "1.4rem", fontWeight: "900", color: "#16a34a" }}>{hsCode.hs_code}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Description</div>
                <div style={{ fontSize: "0.88rem", color: "#0f1e3a", fontWeight: "600", marginTop: "0.1rem" }}>{hsCode.description}</div>
                {hsCode.chapter && <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.1rem" }}>{hsCode.chapter}</div>}
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Market Intelligence Cards */}
      {aiMarkets && aiMarkets.markets && aiMarkets.markets.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <h3 style={{ margin: 0, color: "#0f1e3a", fontSize: "1rem", fontWeight: "800" }}>
              AI Market Intelligence — <span style={{ color: "#7c3aed" }}>{aiMarkets.product}</span>
            </h3>
            <span style={{ background: "#7c3aed", color: "white", borderRadius: "20px", padding: "0.2rem 0.65rem", fontSize: "0.7rem", fontWeight: "700" }}>
              AI-Generated
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
            {aiMarkets.markets.map((market, i) => (
              <MarketCard key={i} market={market} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Country Opportunity Map */}
      <div style={{ marginTop: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#16a34a" }} />
          <h3 style={{ margin: 0, color: "#0f1e3a", fontSize: "1rem", fontWeight: "800" }}>Country Opportunity Map</h3>
        </div>
        <div
          className="aurora-map"
          ref={mapRef}
          onMouseMove={handleMarkerMove}
          style={{ boxShadow: "0 4px 12px rgba(15, 30, 58, 0.08)" }}
        >
          {tooltip && (
            <div className="aurora-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
              {tooltip.content.split("\n").map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          )}
          <ComposableMap projectionConfig={{ scale: 150 }}>
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

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "#475569" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10B981" }} /> High demand
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "#475569" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#2F6BFF" }} /> Rising interest
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "#475569" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#F5A623" }} /> Premium market
            </div>
          </div>
        </div>
      </div>

      {/* Divider between DB and AI results */}
      {result && aiMarkets && (
        <hr style={{ margin: "2.5rem 0", border: "none", borderTop: "2px dashed #e2e8f0" }} />
      )}

      {result && (
        <div style={{marginTop: result && !aiMarkets ? "2.5rem" : "0"}}>
          {/* Top Markets */}
          {result.top_markets && result.top_markets.length > 0 && (
            <div style={{padding:"2rem",background:"#f0fdf4",borderRadius:"8px",borderLeft:"4px solid #16a34a",marginBottom:"1.5rem"}}>
              <h3 style={{color: "#0f1e3a", marginBottom: "1.5rem", fontSize: "1rem", fontWeight: "700"}}>
                ✓ Top Export Markets for <strong>{result.product}</strong>
              </h3>
              <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem"}}>
                {result.top_markets.map((market, i) => (
                  <div key={i} style={{padding:"1.25rem",background:"white",borderRadius:"8px",border:"1px solid #d1fae5",fontWeight:"600",color:"#059669",textAlign:"center",boxShadow:"0 1px 3px rgba(15, 30, 58, 0.1)"}}>
                    <div>{market[0]}</div>
                    <div style={{fontSize:"0.75rem",color:"#6b7280",marginTop:"0.25rem"}}>Demand Score: {market[1]}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Required Documents */}
          {result.documents_required && result.documents_required.length > 0 && (
            <div style={{padding:"2rem",background:"#eff6ff",borderRadius:"8px",borderLeft:"4px solid #2563eb",marginBottom:"1.5rem"}}>
              <h3 style={{color: "#0f1e3a", marginBottom: "1rem", fontSize: "1rem", fontWeight: "700"}}>
                📄 Required Documents
              </h3>
              <ul style={{margin:0,paddingLeft:"1.25rem",listStyleType:"disc"}}>
                {result.documents_required.map((doc, i) => (
                  <li key={i} style={{padding:"0.35rem 0",color:"#1e40af",fontWeight:"500",fontSize:"0.85rem"}}>{doc[0]}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Potential Buyers */}
          {result.potential_buyers && result.potential_buyers.length > 0 && (
            <div style={{padding:"2rem",background:"#fefce8",borderRadius:"8px",borderLeft:"4px solid #ca8a04"}}>
              <h3 style={{color: "#0f1e3a", marginBottom: "1rem", fontSize: "1rem", fontWeight: "700"}}>
                🏢 Potential Buyers
              </h3>
              <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem"}}>
                {result.potential_buyers.map((buyer, i) => (
                  <div key={i} style={{padding:"1rem",background:"white",borderRadius:"8px",border:"1px solid #fde68a",fontWeight:"600",color:"#92400e",textAlign:"center",boxShadow:"0 1px 3px rgba(15, 30, 58, 0.1)"}}>
                    {buyer[0]}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MarketAnalysis;
