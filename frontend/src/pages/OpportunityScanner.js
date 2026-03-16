import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function OpportunityScanner() {
  const [product, setProduct] = useState("");
  const [hsCode, setHsCode] = useState("");
  const [region, setRegion] = useState("Global");
  const [productPrice, setProductPrice] = useState("");
  const [productionCost, setProductionCost] = useState("");
  const [shippingCost, setShippingCost] = useState("");
  const [dutyPercentage, setDutyPercentage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const formatScore = (value) => {
    if (value === null || value === undefined) return "-";
    return Number(value).toFixed(1);
  };

  const handleScan = async () => {
    if (!product.trim()) {
      alert("Please enter a product name");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const scanPayload = {
        product: product.trim(),
        hsCode: hsCode.trim(),
        region,
        productPrice: productPrice ? Number(productPrice) : null,
        productionCost: productionCost ? Number(productionCost) : null,
        shippingCost: shippingCost ? Number(shippingCost) : null,
        dutyPercentage: dutyPercentage ? Number(dutyPercentage) : null,
      };

      localStorage.setItem("exportready_last_scan", JSON.stringify(scanPayload));

      const response = await API.get("/ai/opportunity-scanner", {
        params: {
          product_name: scanPayload.product
        }
      });
      setResult(response.data || []);
    } catch (err) {
      setError(err.response?.data?.detail || "Opportunity scan failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const opportunities = Array.isArray(result?.analysis)
    ? result.analysis
    : (Array.isArray(result) ? result : []);
  const topMarket = result && !Array.isArray(result) ? result.top_market : null;
  const aiExplanation = result && !Array.isArray(result) ? result.ai_explanation : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{
        background: "linear-gradient(135deg, #0f1e3a 0%, #1d3557 50%, #23395d 100%)",
        padding: "2.5rem",
        borderRadius: "16px",
        color: "white",
        boxShadow: "0 12px 24px rgba(15,30,58,0.25)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12), transparent 50%)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.24em", color: "#cbd5f5" }}>
            Opportunity Scanner
          </div>
          <h2 style={{ margin: "0.6rem 0 0.8rem", fontSize: "2rem", fontWeight: 800 }}>
            Export Opportunity Intelligence
          </h2>
          <p style={{ maxWidth: "640px", margin: 0, color: "#e2e8f0", fontSize: "1rem", lineHeight: 1.6 }}>
            Identify high-potential export markets using demand signals, import volumes, and compliance-driven insights.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(280px, 340px) 1fr", gap: "1.5rem" }}>
        <div style={{
          background: "white",
          borderRadius: "12px",
          padding: "1.5rem",
          border: "1px solid #e2e8f0",
          boxShadow: "0 6px 16px rgba(15,30,58,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#0f1e3a", textTransform: "uppercase", letterSpacing: "0.2em" }}>
            Input Panel
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.4rem" }}>
              Product
            </label>
            <input
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="Cotton shirts"
              style={{
                width: "100%",
                padding: "0.75rem 0.85rem",
                borderRadius: "8px",
                border: "1.5px solid #e2e8f0",
                fontSize: "0.95rem",
                fontWeight: 600,
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.4rem" }}>
              HS Code
            </label>
            <input
              value={hsCode}
              onChange={(e) => setHsCode(e.target.value)}
              placeholder="6205"
              style={{
                width: "100%",
                padding: "0.75rem 0.85rem",
                borderRadius: "8px",
                border: "1.5px solid #e2e8f0",
                fontSize: "0.95rem",
                fontWeight: 600,
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.4rem" }}>
              Target Region
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 0.85rem",
                borderRadius: "8px",
                border: "1.5px solid #e2e8f0",
                fontSize: "0.95rem",
                fontWeight: 600,
                background: "white",
              }}
            >
              <option>Global</option>
              <option>Middle East</option>
              <option>Europe</option>
              <option>North America</option>
              <option>Asia Pacific</option>
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.75rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "#475569", marginBottom: "0.35rem" }}>
                Selling Price ($)
              </label>
              <input
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                type="number"
                placeholder="12"
                style={{
                  width: "100%",
                  padding: "0.65rem 0.75rem",
                  borderRadius: "8px",
                  border: "1.5px solid #e2e8f0",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "#475569", marginBottom: "0.35rem" }}>
                Production Cost ($)
              </label>
              <input
                value={productionCost}
                onChange={(e) => setProductionCost(e.target.value)}
                type="number"
                placeholder="6"
                style={{
                  width: "100%",
                  padding: "0.65rem 0.75rem",
                  borderRadius: "8px",
                  border: "1.5px solid #e2e8f0",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "#475569", marginBottom: "0.35rem" }}>
                Shipping Cost ($)
              </label>
              <input
                value={shippingCost}
                onChange={(e) => setShippingCost(e.target.value)}
                type="number"
                placeholder="1.2"
                style={{
                  width: "100%",
                  padding: "0.65rem 0.75rem",
                  borderRadius: "8px",
                  border: "1.5px solid #e2e8f0",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "#475569", marginBottom: "0.35rem" }}>
                Import Duty (%)
              </label>
              <input
                value={dutyPercentage}
                onChange={(e) => setDutyPercentage(e.target.value)}
                type="number"
                placeholder="5"
                style={{
                  width: "100%",
                  padding: "0.65rem 0.75rem",
                  borderRadius: "8px",
                  border: "1.5px solid #e2e8f0",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                }}
              />
            </div>
          </div>

          <button
            onClick={handleScan}
            disabled={loading}
            style={{
              padding: "0.85rem",
              borderRadius: "10px",
              border: "none",
              background: loading ? "#cbd5e1" : "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)",
              color: "white",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 6px 16px rgba(15,30,58,0.2)",
            }}
          >
            {loading ? "Scanning..." : "Scan Export Opportunities"}
          </button>

          <div style={{ fontSize: "0.78rem", color: "#64748b", lineHeight: 1.5 }}>
            Scans prioritize demand signals, import value, and compliance readiness for the selected product.
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "1.25rem",
            border: "1px solid #e2e8f0",
            boxShadow: "0 6px 16px rgba(15,30,58,0.08)",
          }}>
            <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#0f1e3a", marginBottom: "0.8rem" }}>
              Top Export Opportunities
            </div>

            {topMarket && (
              <div style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "0.9rem",
                marginBottom: "1rem",
              }}>
                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.18em", color: "#64748b", fontWeight: 700 }}>
                  Top Market
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f1e3a", marginTop: "0.35rem" }}>
                  {topMarket}
                </div>
                {aiExplanation && (
                  <div style={{ marginTop: "0.5rem", color: "#0f1e3a", fontSize: "0.85rem", lineHeight: 1.6 }}>
                    {aiExplanation}
                  </div>
                )}
              </div>
            )}

            {error && (
              <div style={{ background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca", padding: "0.75rem", borderRadius: "8px", marginBottom: "1rem" }}>
                {error}
              </div>
            )}

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ textAlign: "left", color: "#64748b" }}>
                    <th style={{ padding: "0.5rem", borderBottom: "1px solid #e2e8f0" }}>Country</th>
                    <th style={{ padding: "0.5rem", borderBottom: "1px solid #e2e8f0" }}>Demand Score</th>
                    <th style={{ padding: "0.5rem", borderBottom: "1px solid #e2e8f0" }}>Competition</th>
                    <th style={{ padding: "0.5rem", borderBottom: "1px solid #e2e8f0" }}>Tariff</th>
                    <th style={{ padding: "0.5rem", borderBottom: "1px solid #e2e8f0" }}>Opportunity Score</th>
                  </tr>
                </thead>
                <tbody>
                  {(opportunities.length > 0 ? opportunities : [
                    { country: "UAE", demand_score: 9, tariff: 5, competition: "Medium", opportunity_score: 4 },
                    { country: "USA", demand_score: 8, tariff: 8, competition: "High", opportunity_score: 0 },
                    { country: "Germany", demand_score: 7, tariff: 10, competition: "High", opportunity_score: -3 },
                  ]).map((row, idx) => (
                    <tr key={`${row.country}-${idx}`} style={{ color: "#0f1e3a" }}>
                      <td style={{ padding: "0.6rem 0.5rem", borderBottom: "1px solid #f1f5f9" }}>{row.country}</td>
                      <td style={{ padding: "0.6rem 0.5rem", borderBottom: "1px solid #f1f5f9" }}>{formatScore(row.demand_score)}</td>
                      <td style={{ padding: "0.6rem 0.5rem", borderBottom: "1px solid #f1f5f9" }}>{row.competition || "Medium"}</td>
                      <td style={{ padding: "0.6rem 0.5rem", borderBottom: "1px solid #f1f5f9" }}>{row.tariff !== undefined ? `${row.tariff}%` : "-"}</td>
                      <td style={{ padding: "0.6rem 0.5rem", borderBottom: "1px solid #f1f5f9" }}>{row.opportunity_score !== undefined ? row.opportunity_score : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
            {(opportunities.length > 0 ? opportunities : [
              { country: "UAE", demand_score: 9, tariff: 5, competition: "Medium", opportunity_score: 4 },
              { country: "USA", demand_score: 8, tariff: 8, competition: "High", opportunity_score: 0 },
              { country: "Germany", demand_score: 7, tariff: 10, competition: "High", opportunity_score: -3 },
            ]).map((item, idx) => (
              <div key={`${item.country}-card-${idx}`} style={{
                background: "white",
                borderRadius: "14px",
                padding: "1.2rem",
                border: "1px solid #e2e8f0",
                boxShadow: "0 6px 18px rgba(15,30,58,0.08)",
                display: "flex",
                flexDirection: "column",
                gap: "0.7rem",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#0f1e3a" }}>{item.country}</div>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b" }}>Rank {item.rank || idx + 1}</div>
                </div>

                <div>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", marginBottom: "0.3rem" }}>Demand Score</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <div style={{ flex: 1, height: "6px", background: "#e2e8f0", borderRadius: "999px", overflow: "hidden" }}>
                      <div style={{ width: `${Math.min(100, (item.demand_score || 7) * 10)}%`, height: "100%", background: "#0f1e3a" }} />
                    </div>
                    <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0f1e3a" }}>{formatScore(item.demand_score)}</div>
                  </div>
                </div>

                <div style={{ fontSize: "0.8rem", color: "#0f1e3a" }}>
                  <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 700 }}>Competition</div>
                  <div style={{ fontWeight: 700 }}>{item.competition || "Medium"}</div>
                </div>

                <div style={{ fontSize: "0.8rem", color: "#0f1e3a" }}>
                  <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 700 }}>Tariff</div>
                  <div style={{ fontWeight: 700 }}>{item.tariff !== undefined ? `${item.tariff}%` : "-"}</div>
                </div>

                <div style={{ fontSize: "0.8rem", color: "#0f1e3a" }}>
                  <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 700 }}>Opportunity Score</div>
                  <div style={{ fontWeight: 700 }}>{item.opportunity_score !== undefined ? item.opportunity_score : "-"}</div>
                </div>

                <button
                  onClick={() => navigate("/export-plan", {
                    state: {
                      product,
                      hsCode,
                      country: item.country,
                      productPrice,
                      productionCost,
                      shippingCost,
                      dutyPercentage,
                    }
                  })}
                  style={{
                  marginTop: "0.4rem",
                  padding: "0.6rem",
                  borderRadius: "8px",
                  border: "1px solid #0f1e3a",
                  background: "white",
                  color: "#0f1e3a",
                  fontWeight: 700,
                  cursor: "pointer",
                }}>
                  Generate Export Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "1rem",
      }}>
        <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "1rem", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700 }}>Region</div>
          <div style={{ fontSize: "1rem", fontWeight: 700, color: "#0f1e3a" }}>{region}</div>
        </div>
        <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "1rem", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700 }}>HS Code</div>
          <div style={{ fontSize: "1rem", fontWeight: 700, color: "#0f1e3a" }}>{hsCode || "Not specified"}</div>
        </div>
        <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "1rem", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700 }}>Confidence</div>
          <div style={{ fontSize: "1rem", fontWeight: 700, color: "#0f1e3a" }}>{opportunities.length ? `${opportunities.length} results` : "-"}</div>
        </div>
      </div>
    </div>
  );
}

export default OpportunityScanner;
