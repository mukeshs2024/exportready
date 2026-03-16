import { useRef, useState, useMemo } from "react";
import { ComposableMap, Geographies, Geography, Line, Marker } from "react-simple-maps";
import API from "../services/api";

// ---------------------------------------------------------------------------
// Map helpers — normalise AI country names to GeoJSON property names
// ---------------------------------------------------------------------------
const COUNTRY_NAME_MAP = {
  "UAE": "United Arab Emirates",
  "United Arab Emirates": "United Arab Emirates",
  "USA": "United States of America",
  "United States": "United States of America",
  "UK": "United Kingdom",
  "United Kingdom": "United Kingdom",
  "South Korea": "South Korea",
  "Korea": "South Korea",
  "Russia": "Russia",
  "Iran": "Iran",
  "Saudi Arabia": "Saudi Arabia",
  "Turkey": "Turkey",
};

// Country centroid coordinates [lon, lat] for route lines
const COUNTRY_COORDS = {
  "United Arab Emirates": [54.4, 24.3],
  "United States of America": [-98.5, 39.8],
  "United Kingdom": [-1.5, 53.0],
  "Germany": [10.4, 51.2],
  "Japan": [138, 36],
  "China": [104, 35],
  "Singapore": [103.8, 1.35],
  "Australia": [134, -25],
  "Canada": [-96, 60],
  "Saudi Arabia": [45, 24],
  "South Korea": [128, 36],
  "Brazil": [-51, -14],
  "France": [2.2, 46.2],
  "Netherlands": [5.3, 52.1],
  "Italy": [12.6, 42],
  "Spain": [-3.7, 40.4],
  "Turkey": [35, 39],
  "Russia": [105, 61],
  "Nigeria": [8.7, 9.1],
  "Kenya": [37.9, 0.5],
  "Egypt": [30, 26],
  "Indonesia": [117, -3],
  "Vietnam": [108, 14],
  "Thailand": [101, 15],
  "Malaysia": [110, 4],
  "Philippines": [122, 12],
  "Bangladesh": [90, 23.7],
  "Pakistan": [69, 30],
  "Iran": [53, 32],
  "Mexico": [-102, 23],
  "Argentina": [-64, -34],
  "South Africa": [25, -29],
};

function resolveGeoName(country) {
  return COUNTRY_NAME_MAP[country] || country;
}

// Returns a gold colour scaled by demand score (0–10)
function demandColor(score) {
  const t = Math.min(1, Math.max(0, (score || 5) / 10));
  // low score → pale amber, high score → rich gold
  const r = Math.round(180 + t * 65);
  const g = Math.round(130 + t * 36);
  const b = Math.round(20 + t * 15);
  return `rgb(${r},${g},${b})`;
}

// Calculate an aggregate Export Opportunity Score from AI market data
function calcOpportunityScore(markets) {
  if (!markets || markets.length === 0) return null;
  const scores = markets.map(m => m.demand_index || m.demand_score || 7);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  // Blend: avg demand → 0–100 score
  const raw = Math.round((avg / 10) * 100);
  const strength = raw >= 80 ? "High" : raw >= 60 ? "Medium" : "Low";
  const stability = markets.length >= 4 ? "High" : markets.length >= 2 ? "Medium" : "Low";
  const profit = raw >= 75 ? "High" : raw >= 55 ? "Medium" : "Low";
  return { score: Math.min(99, raw), strength, stability, profit };
}

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
  const score = market.export_score;
  const hasScore = score != null;
  const scoreColor = hasScore
    ? (score >= 80 ? "#16a34a" : score >= 60 ? "#d97706" : "#dc2626")
    : c.badge;

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem" }}>
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

      {/* Export Opportunity Score bar */}
      {hasScore && (
        <div style={{ marginBottom: "0.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
            <span style={{
              fontSize: "0.68rem", color: "#64748b", fontWeight: "700",
              textTransform: "uppercase", letterSpacing: "0.5px"
            }}>📈 Export Opportunity Score</span>
            <span style={{ fontSize: "0.88rem", fontWeight: "900", color: scoreColor }}>{score}%</span>
          </div>
          <div style={{ background: "#e2e8f0", borderRadius: "999px", height: "8px", overflow: "hidden" }}>
            <div style={{
              width: `${score}%`,
              height: "100%",
              borderRadius: "999px",
              background: `linear-gradient(90deg, ${scoreColor}88, ${scoreColor})`,
              transition: "width 0.7s ease"
            }} />
          </div>
        </div>
      )}

      {/* Metrics grid — demand breakdown + trade data */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
        <div style={{ background: "white", borderRadius: "6px", padding: "0.6rem 0.75rem", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Import Volume</div>
          <div style={{ fontSize: "0.88rem", color: "#0f1e3a", fontWeight: "700", marginTop: "0.2rem" }}>{market.import_volume || "N/A"}</div>
        </div>
        <div style={{ background: "white", borderRadius: "6px", padding: "0.6rem 0.75rem", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Tariff Rate</div>
          <div style={{ fontSize: "0.88rem", color: "#dc2626", fontWeight: "700", marginTop: "0.2rem" }}>{market.tariff || "N/A"}</div>
        </div>
        {market.growth_score != null && (
          <div style={{ background: "white", borderRadius: "6px", padding: "0.6rem 0.75rem", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Market Growth</div>
            <div style={{ fontSize: "0.88rem", color: "#16a34a", fontWeight: "700", marginTop: "0.2rem" }}>{market.growth_score}/10</div>
          </div>
        )}
        {market.competition_score != null && (
          <div style={{ background: "white", borderRadius: "6px", padding: "0.6rem 0.75rem", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Competition</div>
            <div style={{ fontSize: "0.88rem", color: "#7c3aed", fontWeight: "700", marginTop: "0.2rem" }}>{market.competition_score}/10</div>
          </div>
        )}
      </div>

      {/* Best route */}
      {market.best_route && (
        <div style={{ background: "white", borderRadius: "6px", padding: "0.6rem 0.75rem", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Best Route</div>
          <div style={{ fontSize: "0.83rem", color: "#0f1e3a", fontWeight: "600", marginTop: "0.2rem" }}>{market.best_route}</div>
        </div>
      )}

      {/* Buyers */}
      {market.buyers && market.buyers.length > 0 && (
        <div>
          <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.4rem" }}>
            Top Buyers
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {market.buyers.map((buyer, i) => (
              <span key={i} style={{
                background: c.badge, color: "white", borderRadius: "4px",
                padding: "0.2rem 0.55rem", fontSize: "0.75rem", fontWeight: "600"
              }}>
                {buyer}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MarketAnalysis() {

  const [productName, setProductName] = useState("");
  const [result, setResult] = useState(null);
  const [noData, setNoData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // AI intelligence cards
  const [aiMarkets, setAiMarkets] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // HS Code
  const [hsCode, setHsCode] = useState(null);
  const [hsLoading, setHsLoading] = useState(false);
  const [mapTooltip, setMapTooltip] = useState(null);
  const mapRef = useRef(null);

  // Build a lookup: resolved geo name → market data, from AI results
  const aiHighlightMap = useMemo(() => {
    const map = {};
    const markets = aiMarkets?.markets || [];
    markets.forEach(m => {
      const geoName = resolveGeoName(m.country);
      map[geoName] = m;
    });
    return map;
  }, [aiMarkets]);

  // Dynamic trade routes from India → each AI-recommended country
  const dynamicRoutes = useMemo(() => {
    const markets = aiMarkets?.markets || [];
    return markets
      .map((m, i) => {
        const geoName = resolveGeoName(m.country);
        const coords = COUNTRY_COORDS[geoName] || COUNTRY_COORDS[m.country];
        if (!coords) return null;
        const colors = ["#10B981", "#2F6BFF", "#F5A623", "#e879f9", "#f97316"];
        return {
          id: m.country,
          from: [77, 28],
          to: coords,
          color: colors[i % colors.length],
          market: m,
        };
      })
      .filter(Boolean);
  }, [aiMarkets]);

  const handleMapTooltipEnter = (event, content) => {
    const bounds = mapRef.current?.getBoundingClientRect();
    if (!bounds) return;
    setMapTooltip({
      x: event.clientX - bounds.left + 12,
      y: event.clientY - bounds.top + 12,
      content,
    });
  };

  const handleMapTooltipMove = (event) => {
    if (!mapTooltip || !mapRef.current) return;
    const bounds = mapRef.current.getBoundingClientRect();
    setMapTooltip(prev => ({
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
    setNoData(false);
    setLoading(true);
    try {
      const res = await API.get("/ai/market-analysis", {
        params: { product_name: productName }
      });
      if (res.data?.status === "no_data") {
        setNoData(true);
      } else {
        setResult({
          product: productName,
          top_markets: res.data?.data || [],
          documents_required: [],
          potential_buyers: []
        });
      }
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
      const data = marketRes.value.data;
      setAiMarkets(data);

      // 🔖 Save top result to export history (fire-and-forget — never blocks UI)
      try {
        const markets = data?.markets || [];
        if (markets.length > 0) {
          const top = markets[0];
          API.post("/export-reports", {
            product: productName,
            top_market: top.country,
            export_score: top.export_score ?? 0,
            demand_index: top.demand_index ?? null,
            growth_score: top.growth_score ?? null,
            competition_score: top.competition_score ?? null,
          }).catch(() => { }); // silently swallow any save error
        }
      } catch (_) { }
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
    <div style={{ background: "white", padding: "3rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(15, 30, 58, 0.12)", border: "1px solid #e2e8f0" }}>
      <h2 style={{ color: "#0f1e3a", marginBottom: "2.5rem", fontSize: "1.4rem", fontWeight: "800" }}><span style={{ marginRight: "0.75rem" }}>◌</span>Market Analysis</h2>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", fontWeight: "600", color: "#1a202c", marginBottom: "0.5rem", fontSize: "0.8rem" }}>
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

      {error && <p style={{ color: "#dc2626", marginTop: "1.5rem", padding: "1rem", background: "#fee2e2", borderRadius: "6px", borderLeft: "3px solid #dc2626" }}>{error}</p>}
      {aiError && <p style={{ color: "#7c3aed", marginTop: "1.5rem", padding: "1rem", background: "#f5f3ff", borderRadius: "6px", borderLeft: "3px solid #7c3aed" }}>{aiError}</p>}

      {/* Smart No-Data Fallback Banner */}
      {noData && (
        <div style={{
          marginTop: "1.75rem",
          padding: "1.5rem 1.75rem",
          background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
          border: "1.5px solid #f59e0b",
          borderLeft: "5px solid #d97706",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(217, 119, 6, 0.12)",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem" }}>
            <span style={{ fontSize: "1.5rem", lineHeight: 1 }}>⚠️</span>
            <div style={{ flex: 1 }}>
              <p style={{
                margin: "0 0 0.35rem 0",
                fontWeight: "800",
                color: "#92400e",
                fontSize: "0.95rem"
              }}>
                No historical trade data found in database
              </p>
              <p style={{
                margin: "0 0 1rem 0",
                color: "#78350f",
                fontSize: "0.83rem",
                lineHeight: "1.55"
              }}>
                Don't worry — our <strong>AI Market Intelligence</strong> can still analyze global
                demand signals and suggest the best export markets for{" "}
                <strong>{productName}</strong>.
              </p>
              <button
                onClick={getAIIntelligence}
                disabled={aiLoading}
                style={{
                  padding: "0.6rem 1.2rem",
                  background: aiLoading
                    ? "#e2e8f0"
                    : "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
                  color: aiLoading ? "#4a5568" : "white",
                  border: "none",
                  borderRadius: "7px",
                  fontSize: "0.82rem",
                  fontWeight: "700",
                  cursor: aiLoading ? "not-allowed" : "pointer",
                  letterSpacing: "0.4px",
                  boxShadow: "0 2px 6px rgba(124, 58, 237, 0.35)",
                  transition: "all 0.2s ease",
                }}
              >
                {aiLoading ? "Generating..." : "✨ Try AI Market Intelligence"}
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* ============================================================
          Global Export Demand Map — dynamic AI-driven country highlights
          ============================================================ */}
      <div style={{ marginTop: "2.5rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#16a34a" }} />
            <h3 style={{ margin: 0, color: "#0f1e3a", fontSize: "1rem", fontWeight: "800" }}>
              Global Export Demand Visualization
            </h3>
          </div>
          <p style={{ margin: "0.2rem 0 0 1.2rem", fontSize: "0.73rem", color: "#64748b", fontWeight: "500" }}>
            Powered by AI + Trade Signals
            {aiMarkets?.markets?.length > 0 && (
              <span style={{
                marginLeft: "0.5rem", background: "#7c3aed", color: "white",
                borderRadius: "10px", padding: "0.1rem 0.5rem", fontSize: "0.68rem", fontWeight: "700"
              }}>
                {aiMarkets.markets.length} markets highlighted
              </span>
            )}
          </p>
        </div>

        {/* Map container */}
        <div
          className="aurora-map"
          ref={mapRef}
          onMouseMove={handleMapTooltipMove}
          style={{
            boxShadow: "0 4px 20px rgba(15, 30, 58, 0.1)", borderRadius: "10px", overflow: "hidden",
            background: "linear-gradient(180deg, #f0f4ff 0%, #e8edf8 100%)"
          }}
        >
          {/* Map hover tooltip */}
          {mapTooltip && (
            <div className="aurora-tooltip" style={{ left: mapTooltip.x, top: mapTooltip.y, maxWidth: "180px" }}>
              {mapTooltip.content.split("\n").map((line, index) => (
                <div key={index} style={{ fontWeight: index === 0 ? "800" : "500" }}>{line}</div>
              ))}
            </div>
          )}

          <ComposableMap projectionConfig={{ scale: 150 }}>
            <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
              {({ geographies }) =>
                geographies.map(geo => {
                  const name = geo.properties.NAME;
                  const isIndia = name === "India";
                  const aiMarket = aiHighlightMap[name];
                  const isHighlighted = !!aiMarket;
                  let fill = "#D6DFEC";
                  if (isIndia) fill = "#F5A623";
                  else if (isHighlighted) {
                    const score = aiMarket.demand_index || aiMarket.demand_score || 7;
                    fill = demandColor(score);
                  }
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fill}
                      stroke={isHighlighted || isIndia ? "#fff" : "#C8D4E8"}
                      strokeWidth={isHighlighted || isIndia ? 0.8 : 0.4}
                      style={{
                        hover: { fill: isIndia ? "#e09612" : isHighlighted ? "#0D1B4C" : "#bcc8dc", outline: "none" },
                        default: { outline: "none" },
                        pressed: { outline: "none" },
                      }}
                      onMouseEnter={isHighlighted ? (event) => {
                        const m = aiMarket;
                        const score = m.demand_index || m.demand_score || "N/A";
                        handleMapTooltipEnter(event,
                          `${name}\nDemand: ${score}/100\n${m.import_volume ? `Import Vol: ${m.import_volume}` : ""}\n${m.tariff ? `Tariff: ${m.tariff}` : ""}`);
                      } : undefined}
                      onMouseLeave={isHighlighted ? () => setMapTooltip(null) : undefined}
                    />
                  );
                })
              }
            </Geographies>

            {/* Dynamic animated trade routes from India → AI markets */}
            {dynamicRoutes.map(route => (
              <Line
                key={`line-${route.id}`}
                from={route.from}
                to={route.to}
                stroke={route.color}
                strokeWidth={1.2}
                strokeDasharray="4 4"
                strokeOpacity={0.75}
              />
            ))}

            {/* Destination markers for each AI market */}
            {dynamicRoutes.map(route => (
              <Marker key={`marker-${route.id}`} coordinates={route.to}>
                <circle
                  r={5}
                  fill={route.color}
                  stroke="white"
                  strokeWidth={1.5}
                  className="aurora-pulse-node"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(event) => {
                    const m = route.market;
                    const score = m.demand_index || m.demand_score || "N/A";
                    handleMapTooltipEnter(event,
                      `${m.country}\nDemand: ${score}/100\n${m.import_volume ? `Vol: ${m.import_volume}` : ""}`);
                  }}
                  onMouseLeave={() => setMapTooltip(null)}
                />
              </Marker>
            ))}

            {/* India origin marker */}
            <Marker coordinates={[77, 28]}>
              <circle r={6} fill="#F5A623" stroke="white" strokeWidth={2} />
              <text textAnchor="middle" y={-10} style={{
                fontFamily: "inherit", fontSize: "7px",
                fontWeight: "800", fill: "#0f1e3a"
              }}>🇮🇳 India</text>
            </Marker>
          </ComposableMap>

          {/* Legend */}
          <div style={{
            display: "flex", gap: "1.25rem", flexWrap: "wrap",
            padding: "0.6rem 1rem", borderTop: "1px solid #e2e8f0"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.72rem", color: "#475569" }}>
              <span style={{
                width: "12px", height: "12px", borderRadius: "2px",
                background: "linear-gradient(90deg, #c8820a, #f5b942)"
              }} />
              AI-highlighted market
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.72rem", color: "#475569" }}>
              <span style={{ width: "12px", height: "12px", borderRadius: "2px", background: "#F5A623" }} />
              India (origin)
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.72rem", color: "#475569" }}>
              <span style={{ width: "12px", height: "12px", borderRadius: "2px", background: "#D6DFEC" }} />
              No data
            </div>
            {aiMarkets?.markets?.length > 0 && (
              <div style={{ marginLeft: "auto", fontSize: "0.7rem", color: "#7c3aed", fontWeight: "600" }}>
                Darker gold = Higher demand
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================
          Export Opportunity Score Engine — shown after AI results
          ============================================================ */}
      {aiMarkets?.markets?.length > 0 && (() => {
        const opp = calcOpportunityScore(aiMarkets.markets);
        if (!opp) return null;
        const scoreColor = opp.score >= 80 ? "#16a34a" : opp.score >= 60 ? "#d97706" : "#dc2626";
        const scoreBg = opp.score >= 80 ? "#f0fdf4" : opp.score >= 60 ? "#fffbeb" : "#fef2f2";
        const pillColor = (level) => level === "High" ? "#16a34a" : level === "Medium" ? "#d97706" : "#dc2626";
        const pillBg = (level) => level === "High" ? "#dcfce7" : level === "Medium" ? "#fef3c7" : "#fee2e2";
        return (
          <div style={{
            marginTop: "2rem", padding: "1.75rem",
            background: scoreBg, borderRadius: "12px",
            border: `1.5px solid ${scoreColor}30`, borderLeft: `5px solid ${scoreColor}`,
            boxShadow: `0 4px 16px ${scoreColor}18`
          }}>
            {/* Score header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem"
            }}>
              <div>
                <div style={{
                  fontSize: "0.7rem", color: "#64748b", fontWeight: "700",
                  textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.2rem"
                }}>
                  📈 Export Opportunity Score
                </div>
                <div style={{ fontSize: "0.82rem", color: "#374151" }}>
                  Based on AI demand signals for <strong>{aiMarkets.product || productName}</strong>
                </div>
              </div>
              {/* Big score badge */}
              <div style={{ textAlign: "center" }}>
                <div style={{
                  fontSize: "3rem", fontWeight: "900", color: scoreColor,
                  lineHeight: 1, fontVariantNumeric: "tabular-nums"
                }}>
                  {opp.score}%
                </div>
                <div style={{ fontSize: "0.72rem", color: scoreColor, fontWeight: "700", marginTop: "0.1rem" }}>
                  {opp.score >= 80 ? "Strong Opportunity" : opp.score >= 60 ? "Moderate Opportunity" : "Developing Market"}
                </div>
              </div>
            </div>

            {/* Score progress bar */}
            <div style={{
              background: "#e2e8f0", borderRadius: "999px", height: "8px",
              marginBottom: "1.5rem", overflow: "hidden"
            }}>
              <div style={{
                width: `${opp.score}%`, height: "100%", borderRadius: "999px",
                background: `linear-gradient(90deg, ${scoreColor}88, ${scoreColor})`,
                transition: "width 0.8s ease"
              }} />
            </div>

            {/* Three metric pills */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
              {[
                { label: "Demand Strength", value: opp.strength, icon: "📊" },
                { label: "Market Stability", value: opp.stability, icon: "🏛️" },
                { label: "Profit Potential", value: opp.profit, icon: "💰" },
              ].map(({ label, value, icon }) => (
                <div key={label} style={{
                  background: "white", borderRadius: "8px",
                  padding: "0.9rem", border: "1px solid #e2e8f0", textAlign: "center",
                  boxShadow: "0 1px 4px rgba(15,30,58,0.06)"
                }}>
                  <div style={{ fontSize: "1.1rem", marginBottom: "0.3rem" }}>{icon}</div>
                  <div style={{
                    fontSize: "0.68rem", color: "#64748b", fontWeight: "600",
                    textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "0.35rem"
                  }}>
                    {label}
                  </div>
                  <span style={{
                    background: pillBg(value), color: pillColor(value),
                    borderRadius: "20px", padding: "0.2rem 0.7rem",
                    fontSize: "0.78rem", fontWeight: "800"
                  }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Divider between DB and AI results */}
      {result && aiMarkets && (
        <hr style={{ margin: "2.5rem 0", border: "none", borderTop: "2px dashed #e2e8f0" }} />
      )}

      {result && (
        <div style={{ marginTop: result && !aiMarkets ? "2.5rem" : "0" }}>
          {/* Top Markets */}
          {result.top_markets && result.top_markets.length > 0 && (
            <div style={{ padding: "2rem", background: "#f0fdf4", borderRadius: "8px", borderLeft: "4px solid #16a34a", marginBottom: "1.5rem" }}>
              <h3 style={{ color: "#0f1e3a", marginBottom: "1.5rem", fontSize: "1rem", fontWeight: "700" }}>
                ✓ Top Export Markets for <strong>{result.product}</strong>
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
                {result.top_markets.map((market, i) => (
                  <div key={i} style={{ padding: "1.25rem", background: "white", borderRadius: "8px", border: "1px solid #d1fae5", fontWeight: "600", color: "#059669", textAlign: "center", boxShadow: "0 1px 3px rgba(15, 30, 58, 0.1)" }}>
                    <div>{market.country || market[0]}</div>
                    <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>
                      Demand Score: {market.demand_score ?? market[1]}
                    </div>
                    {market.market_size && (
                      <div style={{ fontSize: "0.72rem", color: "#6b7280", marginTop: "0.2rem" }}>
                        Market Size: {market.market_size}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Required Documents */}
          {result.documents_required && result.documents_required.length > 0 && (
            <div style={{ padding: "2rem", background: "#eff6ff", borderRadius: "8px", borderLeft: "4px solid #2563eb", marginBottom: "1.5rem" }}>
              <h3 style={{ color: "#0f1e3a", marginBottom: "1rem", fontSize: "1rem", fontWeight: "700" }}>
                📄 Required Documents
              </h3>
              <ul style={{ margin: 0, paddingLeft: "1.25rem", listStyleType: "disc" }}>
                {result.documents_required.map((doc, i) => (
                  <li key={i} style={{ padding: "0.35rem 0", color: "#1e40af", fontWeight: "500", fontSize: "0.85rem" }}>{doc[0]}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Potential Buyers */}
          {result.potential_buyers && result.potential_buyers.length > 0 && (
            <div style={{ padding: "2rem", background: "#fefce8", borderRadius: "8px", borderLeft: "4px solid #ca8a04" }}>
              <h3 style={{ color: "#0f1e3a", marginBottom: "1rem", fontSize: "1rem", fontWeight: "700" }}>
                🏢 Potential Buyers
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
                {result.potential_buyers.map((buyer, i) => (
                  <div key={i} style={{ padding: "1rem", background: "white", borderRadius: "8px", border: "1px solid #fde68a", fontWeight: "600", color: "#92400e", textAlign: "center", boxShadow: "0 1px 3px rgba(15, 30, 58, 0.1)" }}>
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
