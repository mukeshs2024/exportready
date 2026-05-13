import React, { useState, useRef, useMemo } from "react";
import { ComposableMap, Geographies, Geography, Line, Marker } from "react-simple-maps";
import { Link } from "react-router-dom";
import { LineChart, Line as ChartLine, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Target, AlertTriangle, Globe, BarChart3, Clock, Zap } from 'lucide-react';
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
          id: `${i}-${geoName}`,
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

  // Get top 3 markets for highlighted cards
  const topMarkets = useMemo(() => {
    const markets = aiMarkets?.markets || [];
    return markets.slice(0, 3);
  }, [aiMarkets]);

  // Generate mock demand trend data (in production, this would come from API)
  const demandTrendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, i) => ({
      month,
      demand: 40 + Math.random() * 50,
      trend: 50 + Math.random() * 35,
    }));
  }, []);

  // Generate pricing data for top markets
  const pricingData = useMemo(() => {
    return topMarkets.map(m => ({
      country: m.country,
      price: Math.round(50 + Math.random() * 150),
      margin: Math.round(20 + Math.random() * 40),
    }));
  }, [topMarkets]);

  // Get key metrics from top market
  const getTopMetrics = () => {
    if (!aiMarkets?.markets || aiMarkets.markets.length === 0) return null;
    const top = aiMarkets.markets[0];
    const avgScore = aiMarkets.markets.reduce((sum, m) => sum + (m.demand_index || 0), 0) / aiMarkets.markets.length;
    
    // Calculate risk score (inverse of demand + competition)
    const competition = top.competition_score || 5;
    const riskScore = Math.round(10 - (top.demand_index || 5) / 10 + (competition / 10));
    
    return {
      topCountry: top.country,
      demandScore: Math.round(top.demand_index || top.demand_score || 75),
      profitPotential: Math.round(avgScore * 1.2),
      riskScore: Math.max(1, Math.min(10, riskScore)),
    };
  };

  const metrics = getTopMetrics();

  return (
    <div style={{ background: "linear-gradient(135deg, #f8f9fa 0%, #f5f7fb 100%)", minHeight: "100vh", padding: "2rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <Globe size={28} color="#F5A623" />
          <h1 style={{ color: "#0D1B4C", margin: 0, fontSize: "2rem", fontWeight: "900" }}>Market Analysis</h1>
        </div>
        <p style={{ color: "#6B7280", margin: 0, fontSize: "0.95rem" }}>AI-powered global export intelligence for your product</p>
      </div>

      {/* Search Section */}
      <div style={{ background: "white", padding: "2rem", borderRadius: "16px", boxShadow: "0 2px 8px rgba(13, 27, 76, 0.08)", marginBottom: "2rem", border: "1px solid #e5e7eb" }}>
        <label style={{ display: "block", fontWeight: "700", color: "#0D1B4C", marginBottom: "0.75rem", fontSize: "0.95rem" }}>
          What product do you want to export?
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
          <div style={{ gridColumn: "1 / 3" }}>
            <input
              placeholder="e.g., Cotton Shirts, Electronics Components, Leather Goods"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && getAIIntelligence()}
              style={{
                width: "100%",
                padding: "0.875rem 1rem",
                border: "1.5px solid #e5e7eb",
                borderRadius: "10px",
                fontSize: "0.95rem",
                fontFamily: "inherit",
                transition: "all 0.2s ease",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#F5A623";
                e.target.style.boxShadow = "0 0 0 3px rgba(245, 166, 35, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
          <button
            onClick={getAIIntelligence}
            disabled={aiLoading}
            style={{
              padding: "0.875rem 1.5rem",
              background: aiLoading ? "#9CA3AF" : "linear-gradient(135deg, #0D1B4C 0%, #1a2f5a 100%)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "0.95rem",
              fontWeight: "700",
              cursor: aiLoading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              letterSpacing: "0.3px",
            }}
            onMouseEnter={(e) => {
              if (!aiLoading) e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "none";
            }}
          >
            <Zap size={18} />
            {aiLoading ? "Analyzing..." : "Analyze with AI"}
          </button>
        </div>
        {(aiError || error) && (
          <div style={{
            marginTop: "1rem",
            padding: "0.875rem 1rem",
            background: "#FEE2E2",
            border: "1px solid #FECACA",
            borderRadius: "10px",
            color: "#991B1B",
            fontSize: "0.9rem",
            display: "flex",
            gap: "0.75rem",
            alignItems: "flex-start",
          }}>
            <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: "0.125rem" }} />
            <span>{aiError || error}</span>
          </div>
        )}
      </div>

      {/* Top Insight Cards */}
      {metrics && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
          {/* Top Country Card */}
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "1.5rem",
            boxShadow: "0 4px 12px rgba(13, 27, 76, 0.08)",
            border: "1px solid #e5e7eb",
            transition: "all 0.3s ease",
            position: "relative",
            overflow: "hidden",
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(13, 27, 76, 0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(13, 27, 76, 0.08)";
            }}
          >
            <div style={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 120,
              height: 120,
              background: "#F5A62320",
              borderRadius: "50%",
            }} />
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "#F5A623", textTransform: "uppercase", letterSpacing: "0.5px" }}>Top Market</div>
              <Globe size={20} color="#F5A623" />
            </div>
            <div style={{ fontSize: "2rem", fontWeight: "900", color: "#0D1B4C", marginBottom: "0.5rem" }}>{metrics.topCountry}</div>
            <div style={{ fontSize: "0.85rem", color: "#6B7280" }}>Most promising export destination</div>
          </div>

          {/* Demand Score Card */}
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "1.5rem",
            boxShadow: "0 4px 12px rgba(13, 27, 76, 0.08)",
            border: "1px solid #e5e7eb",
            transition: "all 0.3s ease",
            position: "relative",
            overflow: "hidden",
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(13, 27, 76, 0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(13, 27, 76, 0.08)";
            }}
          >
            <div style={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 120,
              height: 120,
              background: "#10B98120",
              borderRadius: "50%",
            }} />
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "#10B981", textTransform: "uppercase", letterSpacing: "0.5px" }}>Demand Score</div>
              <TrendingUp size={20} color="#10B981" />
            </div>
            <div style={{ fontSize: "2rem", fontWeight: "900", color: "#0D1B4C", marginBottom: "0.5rem" }}>{metrics.demandScore}<span style={{ fontSize: "1.5rem", color: "#6B7280" }}>/100</span></div>
            <div style={{ fontSize: "0.85rem", color: "#6B7280" }}>Market demand strength</div>
          </div>

          {/* Profit Potential Card */}
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "1.5rem",
            boxShadow: "0 4px 12px rgba(13, 27, 76, 0.08)",
            border: "1px solid #e5e7eb",
            transition: "all 0.3s ease",
            position: "relative",
            overflow: "hidden",
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(13, 27, 76, 0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(13, 27, 76, 0.08)";
            }}
          >
            <div style={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 120,
              height: 120,
              background: "#8B5CF620",
              borderRadius: "50%",
            }} />
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "#8B5CF6", textTransform: "uppercase", letterSpacing: "0.5px" }}>Profit Potential</div>
              <Target size={20} color="#8B5CF6" />
            </div>
            <div style={{ fontSize: "2rem", fontWeight: "900", color: "#0D1B4C", marginBottom: "0.5rem" }}>{metrics.profitPotential}%</div>
            <div style={{ fontSize: "0.85rem", color: "#6B7280" }}>Average margin opportunity</div>
          </div>

          {/* Risk Score Card */}
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "1.5rem",
            boxShadow: "0 4px 12px rgba(13, 27, 76, 0.08)",
            border: "1px solid #e5e7eb",
            transition: "all 0.3s ease",
            position: "relative",
            overflow: "hidden",
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(13, 27, 76, 0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(13, 27, 76, 0.08)";
            }}
          >
            <div style={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 120,
              height: 120,
              background: "#EF444420",
              borderRadius: "50%",
            }} />
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "#EF4444", textTransform: "uppercase", letterSpacing: "0.5px" }}>Risk Level</div>
              <AlertTriangle size={20} color="#EF4444" />
            </div>
            <div style={{ fontSize: "2rem", fontWeight: "900", color: "#0D1B4C", marginBottom: "0.5rem" }}>{metrics.riskScore}<span style={{ fontSize: "1.5rem", color: "#6B7280" }}>/10</span></div>
            <div style={{ fontSize: "0.85rem", color: "#6B7280" }}>Market volatility score</div>
          </div>
        </div>
      )}

      {/* AI Insight Explanation Box */}
      {aiMarkets && aiMarkets.markets && aiMarkets.markets.length > 0 && (
        <div style={{
          background: "linear-gradient(135deg, #7c3aed15, #7c3aed08)",
          borderRadius: "16px",
          padding: "1.5rem",
          border: "2px solid #7c3aed30",
          marginBottom: "2rem",
          boxShadow: "0 4px 12px rgba(124, 58, 237, 0.08)",
        }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#7c3aed20",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: "1.5rem",
            }}>
              ✨
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ color: "#0D1B4C", margin: "0 0 0.5rem 0", fontSize: "1rem", fontWeight: "800" }}>
                AI Market Insights for {aiMarkets.product || productName}
              </h3>
              <p style={{
                color: "#4B5563",
                margin: "0",
                fontSize: "0.95rem",
                lineHeight: "1.6",
              }}>
                Based on advanced analysis of global trade patterns, demand signals, and market trends, the AI has identified {topMarkets.length} high-potential export markets. 
                <strong> {metrics?.topCountry}</strong> emerges as your top opportunity with a demand score of <strong>{metrics?.demandScore}/100</strong>. 
                The analysis also shows strong growth potential in emerging markets with competitive advantages in key regions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard Grid: Map + Insights Panel */}
      {aiMarkets && aiMarkets.markets && aiMarkets.markets.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
          {/* Left: World Map */}
          <div style={{
            background: "white",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(13, 27, 76, 0.08)",
            border: "1px solid #e5e7eb",
            minHeight: "500px",
            display: "flex",
            flexDirection: "column",
          }}>
            <div style={{
              padding: "1.5rem",
              borderBottom: "1px solid #e5e7eb",
              background: "#f9fafb",
            }}>
              <h3 style={{ color: "#0D1B4C", margin: "0 0 0.25rem 0", fontSize: "1.1rem", fontWeight: "800" }}>
                Global Export Demand Map
              </h3>
              <p style={{ color: "#6B7280", margin: "0", fontSize: "0.85rem" }}>
                {topMarkets.length} markets highlighted | Top countries in color
              </p>
            </div>
            <div
              ref={mapRef}
              onMouseMove={handleMapTooltipMove}
              style={{
                flex: 1,
                position: "relative",
                background: "linear-gradient(180deg, #f0f4ff 0%, #e8edf8 100%)",
              }}
            >
              {/* Map hover tooltip */}
              {mapTooltip && (
                <div style={{
                  position: "absolute",
                  left: mapTooltip.x,
                  top: mapTooltip.y,
                  background: "rgba(13, 27, 76, 0.95)",
                  color: "white",
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  zIndex: 1000,
                  whiteSpace: "nowrap",
                  border: "1px solid #F5A623",
                }}>
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
                      
                      // Color coding for top 3 countries
                      let fill = "#D6DFEC";
                      let strokeColor = "#C8D4E8";
                      if (isIndia) {
                        fill = "#F5A623";
                        strokeColor = "#fff";
                      } else if (isHighlighted) {
                        const score = aiMarket.demand_index || aiMarket.demand_score || 7;
                        fill = demandColor(score);
                        strokeColor = "#fff";
                        
                        // Highlight top 3 with specific colors
                        const topIndex = topMarkets.findIndex(m => resolveGeoName(m.country) === name);
                        if (topIndex === 0) {
                          fill = "#10B981"; // Green for #1
                        } else if (topIndex === 1) {
                          fill = "#2F6BFF"; // Blue for #2
                        } else if (topIndex === 2) {
                          fill = "#F5A623"; // Gold for #3
                        }
                      }

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={fill}
                          stroke={strokeColor}
                          strokeWidth={isHighlighted || isIndia ? 1 : 0.4}
                          style={{
                            hover: { fill: isIndia ? "#e09612" : isHighlighted ? "#0D1B4C" : "#bcc8dc", outline: "none", cursor: "pointer" },
                            default: { outline: "none" },
                            pressed: { outline: "none" },
                          }}
                          onMouseEnter={isHighlighted ? (event) => {
                            const m = aiMarket;
                            const score = m.demand_index || m.demand_score || "N/A";
                            handleMapTooltipEnter(event,
                              `${name}\nDemand: ${score}/100`);
                          } : undefined}
                          onMouseLeave={isHighlighted ? () => setMapTooltip(null) : undefined}
                        />
                      );
                    })
                  }
                </Geographies>

                {/* Dynamic animated trade routes */}
                {dynamicRoutes.slice(0, 5).map(route => (
                  <Line
                    key={`line-${route.id}`}
                    from={route.from}
                    to={route.to}
                    stroke={route.color}
                    strokeWidth={1.5}
                    strokeDasharray="5 5"
                    strokeOpacity={0.6}
                  />
                ))}

                {/* Destination markers */}
                {dynamicRoutes.slice(0, 5).map(route => (
                  <Marker key={`marker-${route.id}`} coordinates={route.to}>
                    <circle
                      r={6}
                      fill={route.color}
                      stroke="white"
                      strokeWidth={2}
                      style={{ cursor: "pointer", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}
                      onMouseEnter={(event) => {
                        const m = route.market;
                        const score = m.demand_index || m.demand_score || "N/A";
                        handleMapTooltipEnter(event, `${m.country}\nDemand: ${score}/100`);
                      }}
                      onMouseLeave={() => setMapTooltip(null)}
                    />
                  </Marker>
                ))}

                {/* India origin marker */}
                <Marker coordinates={[77, 28]}>
                  <circle r={7} fill="#F5A623" stroke="white" strokeWidth={2.5} style={{ filter: "drop-shadow(0 2px 6px rgba(245, 166, 35, 0.4))" }} />
                </Marker>
              </ComposableMap>

              {/* Legend */}
              <div style={{
                position: "absolute",
                bottom: "1rem",
                left: "1rem",
                background: "rgba(255, 255, 255, 0.95)",
                borderRadius: "10px",
                padding: "0.75rem 1rem",
                fontSize: "0.8rem",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}>
                <div style={{ fontWeight: "700", color: "#0D1B4C", marginBottom: "0.5rem" }}>Top Markets</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {topMarkets.map((m, i) => {
                    const colors = ["#10B981", "#2F6BFF", "#F5A623"];
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "3px",
                          background: colors[i],
                        }} />
                        <span style={{ color: "#4B5563" }}>#{i + 1} {m.country}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Insights Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Top 3 Markets Detail Card */}
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "1.5rem",
              boxShadow: "0 4px 12px rgba(13, 27, 76, 0.08)",
              border: "1px solid #e5e7eb",
            }}>
              <h4 style={{ color: "#0D1B4C", margin: "0 0 1rem 0", fontSize: "1rem", fontWeight: "800" }}>
                Top Export Markets
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {topMarkets.map((market, i) => {
                  const colors = ["#10B981", "#2F6BFF", "#F5A623"];
                  const badgeColors = ["#d1fae5", "#dbeafe", "#fef3c7"];
                  return (
                    <div key={i} style={{
                      padding: "1rem",
                      background: badgeColors[i],
                      borderRadius: "10px",
                      border: `1px solid ${colors[i]}30`,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: colors[i],
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "800",
                            fontSize: "0.9rem",
                          }}>
                            #{i + 1}
                          </div>
                          <div>
                            <div style={{ fontSize: "0.95rem", fontWeight: "700", color: "#0D1B4C" }}>{market.country}</div>
                            <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>Demand Score: {Math.round(market.demand_index || market.demand_score || 0)}</div>
                          </div>
                        </div>
                        <TrendingUp size={16} color={colors[i]} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats Card */}
            {hsCode && (
              <div style={{
                background: "white",
                borderRadius: "16px",
                padding: "1.5rem",
                boxShadow: "0 4px 12px rgba(13, 27, 76, 0.08)",
                border: "1px solid #e5e7eb",
              }}>
                <h4 style={{ color: "#0D1B4C", margin: "0 0 1rem 0", fontSize: "1rem", fontWeight: "800" }}>
                  Product Classification
                </h4>
                <div style={{
                  background: "#f0fdf4",
                  borderLeft: "4px solid #10B981",
                  padding: "1rem",
                  borderRadius: "8px",
                }}>
                  <div style={{ fontSize: "0.8rem", color: "#6B7280", fontWeight: "600", marginBottom: "0.25rem" }}>HS Code</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "900", color: "#10B981", marginBottom: "0.5rem" }}>{hsCode.hs_code}</div>
                  <div style={{ fontSize: "0.85rem", color: "#4B5563" }}>{hsCode.description}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Charts Section */}
      {aiMarkets && aiMarkets.markets && aiMarkets.markets.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
          {/* Demand Trends Chart */}
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "1.5rem",
            boxShadow: "0 4px 12px rgba(13, 27, 76, 0.08)",
            border: "1px solid #e5e7eb",
          }}>
            <h4 style={{ color: "#0D1B4C", margin: "0 0 1.5rem 0", fontSize: "1rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <BarChart3 size={20} color="#2F6BFF" />
              Market Demand Trends
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={demandTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: "0.75rem" }} />
                <YAxis stroke="#6B7280" style={{ fontSize: "0.75rem" }} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(13, 27, 76, 0.95)",
                    border: "1px solid #F5A623",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "white" }}
                />
                <Legend />
                <ChartLine
                  type="monotone"
                  dataKey="demand"
                  stroke="#10B981"
                  dot={{ fill: "#10B981", r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Global Demand"
                  strokeWidth={2}
                />
                <ChartLine
                  type="monotone"
                  dataKey="trend"
                  stroke="#2F6BFF"
                  dot={{ fill: "#2F6BFF", r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Price Trend"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Market Pricing by Country */}
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "1.5rem",
            boxShadow: "0 4px 12px rgba(13, 27, 76, 0.08)",
            border: "1px solid #e5e7eb",
          }}>
            <h4 style={{ color: "#0D1B4C", margin: "0 0 1.5rem 0", fontSize: "1rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Target size={20} color="#8B5CF6" />
              Price vs Margin by Market
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pricingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="country" stroke="#6B7280" style={{ fontSize: "0.75rem" }} />
                <YAxis stroke="#6B7280" style={{ fontSize: "0.75rem" }} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(13, 27, 76, 0.95)",
                    border: "1px solid #F5A623",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "white" }}
                />
                <Legend />
                <Bar dataKey="price" fill="#2F6BFF" name="Avg Price ($)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="margin" fill="#10B981" name="Margin (%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* AI Market Cards Section */}
      {aiMarkets && aiMarkets.markets && aiMarkets.markets.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1.5rem",
          }}>
            <Clock size={20} color="#0D1B4C" />
            <h3 style={{
              margin: 0,
              color: "#0D1B4C",
              fontSize: "1.2rem",
              fontWeight: "800",
            }}>
              Detailed Market Analysis
            </h3>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.25rem",
          }}>
            {aiMarkets.markets.map((market, i) => (
              <MarketCard key={i} market={market} index={i} />
            ))}
          </div>
        </div>
      )}

      {noData && (
        <div style={{
          background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
          borderRadius: "16px",
          padding: "2rem",
          border: "2px solid #f59e0b",
          boxShadow: "0 4px 12px rgba(245, 158, 11, 0.12)",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⚠️</div>
          <h3 style={{
            color: "#92400e",
            margin: "0 0 0.5rem 0",
            fontSize: "1.2rem",
            fontWeight: "800",
          }}>
            No historical data found
          </h3>
          <p style={{
            color: "#78350f",
            margin: "0",
            fontSize: "0.95rem",
            lineHeight: "1.6",
          }}>
            Our AI Market Intelligence can still analyze global demand signals and suggest the best export markets for <strong>{productName}</strong>. Click "Analyze with AI" above to get insights.
          </p>
        </div>
      )}
    </div>
  );
}

export default MarketAnalysis;
