import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../services/api";

// ---------------------------------------------------------------------------
// Timeline — visual export roadmap with months and milestones
// ---------------------------------------------------------------------------
function Timeline({ product }) {
  const steps = [
    { month: "Month 1–2", step: "IEC Registration + APEDA / RCMC",      num: "01" },
    { month: "Month 3",   step: "Buyer Outreach + Send Product Samples", num: "02" },
    { month: "Month 4–5", step: "Negotiate LC Terms + Finalize Pricing", num: "03" },
    { month: "Month 6",   step: "First Shipment + Submit Shipping Bill", num: "04" },
    { month: "Month 7+",  step: "Claim RoDTEP / Duty Drawback Refund",  num: "05" },
  ];

  return (
    <div style={{ marginTop: "0" }}>
      <h3 style={{ color: "#0f1e3a", marginBottom: "1.25rem", fontSize: "1rem", fontWeight: "700" }}>
        Export Timeline Roadmap
      </h3>
      <div style={{ position: "relative", paddingLeft: "1.5rem" }}>
        {/* Vertical line */}
        <div style={{
          position: "absolute", left: "0.65rem", top: "1.5rem",
          bottom: "1.5rem", width: "2px", background: "linear-gradient(to bottom, #0f1e3a, #ca8a04)",
        }} />

        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: i < steps.length - 1 ? "1.25rem" : "0", position: "relative" }}>
            {/* Dot */}
            <div style={{
              width: "1.3rem", height: "1.3rem", borderRadius: "50%",
              background: i === 0 ? "#0f1e3a" : i === steps.length - 1 ? "#ca8a04" : "white",
              border: "2px solid " + (i === 0 ? "#0f1e3a" : "#ca8a04"),
              flexShrink: 0, zIndex: 1, marginTop: "0.2rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.5rem",
            }}>
              {i === 0 && <span style={{ color: "white", fontSize: "0.5rem" }}>●</span>}
            </div>

            <div style={{
              flex: 1, background: "white", borderRadius: "8px",
              padding: "0.85rem 1rem", border: "1px solid #e2e8f0",
              boxShadow: "0 1px 3px rgba(15,30,58,0.06)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.68rem", fontWeight: "800", color: "rgba(255,255,255,0.8)", background: "#0f1e3a", borderRadius: "4px", padding: "0.1rem 0.4rem", letterSpacing: "0.5px" }}>{s.num}</span>
                <span style={{
                  background: "#0f1e3a", color: "white", borderRadius: "4px",
                  padding: "0.15rem 0.5rem", fontSize: "0.7rem", fontWeight: "700"
                }}>
                  {s.month}
                </span>
              </div>
              <p style={{ margin: "0.4rem 0 0", color: "#1a202c", fontWeight: "600", fontSize: "0.85rem", lineHeight: "1.4" }}>
                {s.step}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SchemeCards — displays recommended government export schemes
// ---------------------------------------------------------------------------
function SchemeCards({ schemes }) {
  if (!schemes || schemes.length === 0) return null;
  return (
    <div>
      <h3 style={{ color: "#0f1e3a", marginBottom: "1.25rem", fontSize: "1rem", fontWeight: "700" }}>
        Applicable Government Schemes
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
        {schemes.map((scheme, i) => (
          <div key={i} style={{
            background: "white", borderRadius: "8px", padding: "1rem 1.25rem",
            border: "1px solid #d1fae5", borderLeft: "4px solid #16a34a",
            boxShadow: "0 1px 3px rgba(15,30,58,0.07)",
          }}>
            <div style={{ fontWeight: "800", color: "#0f1e3a", fontSize: "0.9rem", marginBottom: "0.3rem" }}>
              {scheme.name}
            </div>
            <div style={{ fontSize: "0.82rem", color: "#15803d", fontWeight: "600" }}>
              ✓ {scheme.benefit}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExportPlan() {

  const location = useLocation();
  const prefill = location.state || {};

  const [productName, setProductName] = useState(prefill.product || "");
  const [hsCode, setHsCode] = useState(prefill.hsCode || "");
  const [country, setCountry] = useState(prefill.country || "");
  const [productPrice, setProductPrice] = useState(prefill.productPrice || "");
  const [productionCost, setProductionCost] = useState(prefill.productionCost || "");
  const [shippingCost, setShippingCost] = useState(prefill.shippingCost || "");
  const [dutyPercentage, setDutyPercentage] = useState(prefill.dutyPercentage || "");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [schemes, setSchemes] = useState(null);

  const generatePlan = async (overrideProduct, overrideHsCode, overrideCountry) => {
    const resolvedProduct = (overrideProduct || productName).trim();
    if (!resolvedProduct) {
      alert("Please enter a product name");
      return;
    }

    setError("");
    setResult(null);
    setSchemes(null);
    setLoading(true);
    try {
      const [planRes, schemeRes] = await Promise.allSettled([
        API.post("/generate-export-plan", {
          product: resolvedProduct,
          hs_code: overrideHsCode || hsCode,
          country: overrideCountry || country,
          product_price: productPrice ? Number(productPrice) : null,
          production_cost: productionCost ? Number(productionCost) : null,
          shipping_cost: shippingCost ? Number(shippingCost) : null,
          duty_percentage: dutyPercentage ? Number(dutyPercentage) : null,
        }),
        API.get("/scheme-recommend", { params: { product: resolvedProduct } }),
      ]);

      if (planRes.status === "fulfilled") {
        setResult(planRes.value.data);
      } else {
        setError(planRes.reason?.response?.data?.detail || "Something went wrong");
      }

      if (schemeRes.status === "fulfilled") {
        setSchemes(schemeRes.value.data.schemes);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (prefill.product) {
      generatePlan(prefill.product, prefill.hsCode, prefill.country);
    }
  }, [prefill.product, prefill.hsCode, prefill.country]);

  return (
    <div style={{background: "white", padding: "3rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(15, 30, 58, 0.12)", border: "1px solid #e2e8f0"}}>
      <h2 style={{color: "#0f1e3a", marginBottom: "2.5rem", fontSize: "1.4rem", fontWeight: "800"}}><span style={{marginRight: "0.75rem"}}>⇄</span>Export Action Plan</h2>

      <div style={{marginBottom: "1.5rem"}}>
        <label style={{display: "block", fontWeight: "600", color: "#1a202c", marginBottom: "0.5rem", fontSize: "0.8rem"}}>
          Product Name
        </label>
        <input
          placeholder="e.g., Rice, Electronics, Pharmaceuticals"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && generatePlan()}
          style={{
            width: "100%",
            padding: "0.875rem 1rem",
            border: "1.5px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "0.85rem",
            fontFamily: "inherit",
            transition: "all 0.2s ease"
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#0f1e3a";
            e.target.style.boxShadow = "0 0 0 3px rgba(15, 30, 58, 0.1)";
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = "none";
          }}
        />
      </div>

      <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem"}}>
        <div>
          <label style={{display: "block", fontWeight: "600", color: "#1a202c", marginBottom: "0.5rem", fontSize: "0.8rem"}}>
            HS Code
          </label>
          <input
            placeholder="6205"
            value={hsCode}
            onChange={(e) => setHsCode(e.target.value)}
            style={{
              width: "100%",
              padding: "0.875rem 1rem",
              border: "1.5px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontFamily: "inherit",
              transition: "all 0.2s ease"
            }}
          />
        </div>
        <div>
          <label style={{display: "block", fontWeight: "600", color: "#1a202c", marginBottom: "0.5rem", fontSize: "0.8rem"}}>
            Target Country
          </label>
          <input
            placeholder="UAE"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={{
              width: "100%",
              padding: "0.875rem 1rem",
              border: "1.5px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontFamily: "inherit",
              transition: "all 0.2s ease"
            }}
          />
        </div>
      </div>

      <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem"}}>
        <div>
          <label style={{display: "block", fontWeight: "600", color: "#1a202c", marginBottom: "0.5rem", fontSize: "0.8rem"}}>
            Selling Price ($)
          </label>
          <input
            placeholder="12"
            type="number"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            style={{
              width: "100%",
              padding: "0.875rem 1rem",
              border: "1.5px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontFamily: "inherit",
              transition: "all 0.2s ease"
            }}
          />
        </div>
        <div>
          <label style={{display: "block", fontWeight: "600", color: "#1a202c", marginBottom: "0.5rem", fontSize: "0.8rem"}}>
            Production Cost ($)
          </label>
          <input
            placeholder="6"
            type="number"
            value={productionCost}
            onChange={(e) => setProductionCost(e.target.value)}
            style={{
              width: "100%",
              padding: "0.875rem 1rem",
              border: "1.5px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontFamily: "inherit",
              transition: "all 0.2s ease"
            }}
          />
        </div>
        <div>
          <label style={{display: "block", fontWeight: "600", color: "#1a202c", marginBottom: "0.5rem", fontSize: "0.8rem"}}>
            Shipping Cost ($)
          </label>
          <input
            placeholder="1.2"
            type="number"
            value={shippingCost}
            onChange={(e) => setShippingCost(e.target.value)}
            style={{
              width: "100%",
              padding: "0.875rem 1rem",
              border: "1.5px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontFamily: "inherit",
              transition: "all 0.2s ease"
            }}
          />
        </div>
        <div>
          <label style={{display: "block", fontWeight: "600", color: "#1a202c", marginBottom: "0.5rem", fontSize: "0.8rem"}}>
            Duty Percentage (%)
          </label>
          <input
            placeholder="5"
            type="number"
            value={dutyPercentage}
            onChange={(e) => setDutyPercentage(e.target.value)}
            style={{
              width: "100%",
              padding: "0.875rem 1rem",
              border: "1.5px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontFamily: "inherit",
              transition: "all 0.2s ease"
            }}
          />
        </div>
      </div>

      <button 
        onClick={() => generatePlan()} 
        disabled={loading} 
        style={{
          width: "100%",
          padding: "0.875rem 1.5rem",
          background: loading ? "#e2e8f0" : "linear-gradient(135deg, #ca8a04 0%, #a16207 100%)",
          color: loading ? "#4a5568" : "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "1rem",
          fontWeight: "600",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          boxShadow: "0 1px 3px rgba(15, 30, 58, 0.1)"
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(15, 30, 58, 0.12)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 1px 3px rgba(15, 30, 58, 0.1)";
        }}
      >
        {loading ? "Generating Plan..." : "Generate Export Plan"}
      </button>

      {error && <p style={{color:"#dc2626",marginTop:"1.5rem",padding:"1rem",background:"#fee2e2",borderRadius:"6px",borderLeft:"3px solid #dc2626"}}>{error}</p>}

      {result && (
        <div style={{marginTop:"2.5rem"}}>
          {/* Header */}
          <div style={{padding:"1.5rem",background:"#0f1e3a",borderRadius:"8px",color:"white",marginBottom:"1.5rem"}}>
            <h3 style={{margin:0,fontSize:"1.1rem",fontWeight:"700"}}>
              Export Plan: {result.product}{result.country ? ` → ${result.country}` : ""}
            </h3>
            <p style={{margin:"0.5rem 0 0",opacity:0.8,fontSize:"0.85rem"}}>HS Code: {result.hs_code || "Not specified"}</p>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))",gap:"1rem",marginBottom:"1.5rem"}}>
            <div style={{padding:"1.25rem",background:"#eff6ff",borderRadius:"10px",border:"1px solid #bfdbfe"}}>
              <h3 style={{color: "#0f1e3a", marginBottom: "0.75rem", fontSize: "0.95rem", fontWeight: "700"}}>
                Market Insight
              </h3>
              <div style={{color:"#1e40af",fontWeight:"600",fontSize:"0.85rem"}}>
                Import Value: {result.market_insight?.import_value || "-"}
              </div>
              <div style={{color:"#1e40af",fontWeight:"600",fontSize:"0.85rem",marginTop:"0.3rem"}}>
                Demand Score: {result.market_insight?.demand_score || "-"}
              </div>
            </div>

            <div style={{padding:"1.25rem",background:"#f0fdf4",borderRadius:"10px",border:"1px solid #d1fae5"}}>
              <h3 style={{color: "#0f1e3a", marginBottom: "0.75rem", fontSize: "0.95rem", fontWeight: "700"}}>
                Required Documents
              </h3>
              <ul style={{margin:"0",paddingLeft:"1.2rem",listStyleType:"disc"}}>
                {(result.compliance || []).map((doc, i) => (
                  <li key={i} style={{margin:"0.35rem 0",color:"#065f46",fontWeight:"600",fontSize:"0.85rem"}}>{doc}</li>
                ))}
              </ul>
            </div>

            <div style={{padding:"1.25rem",background:"#fef3c7",borderRadius:"10px",border:"1px solid #fde68a"}}>
              <h3 style={{color: "#0f1e3a", marginBottom: "0.75rem", fontSize: "0.95rem", fontWeight: "700"}}>
                Profit Estimate
              </h3>
              <div style={{color:"#92400e",fontWeight:"600",fontSize:"0.85rem"}}>
                Selling Price: {result.profit_estimate?.selling_price !== undefined ? `$${result.profit_estimate.selling_price}` : "-"}
              </div>
              <div style={{color:"#92400e",fontWeight:"600",fontSize:"0.85rem",marginTop:"0.3rem"}}>
                Total Cost: {result.profit_estimate?.total_cost !== undefined ? `$${result.profit_estimate.total_cost}` : "-"}
              </div>
              <div style={{color:"#92400e",fontWeight:"600",fontSize:"0.85rem",marginTop:"0.3rem"}}>
                Profit / Unit: {result.profit_estimate?.profit_per_unit !== undefined ? `$${result.profit_estimate.profit_per_unit}` : "-"}
              </div>
              <div style={{color:"#92400e",fontWeight:"600",fontSize:"0.85rem",marginTop:"0.3rem"}}>
                Margin: {result.profit_estimate?.profit_margin !== undefined ? `${result.profit_estimate.profit_margin}%` : "-"}
              </div>
            </div>
          </div>

          <div style={{padding:"1.75rem",background:"#f8fafc",borderRadius:"10px",border:"1px solid #e2e8f0",marginBottom:"1.5rem"}}>
            <h3 style={{color: "#0f1e3a", marginBottom: "1.25rem", fontSize: "1rem", fontWeight: "700"}}>
              Export Roadmap
            </h3>
            <ol style={{margin:"0",paddingLeft:"1.5rem"}}>
              {(result.roadmap || []).map((step, i) => (
                <li key={i} style={{margin:"0.75rem 0",color:"#1a202c",fontWeight:"500",lineHeight:"1.6"}}>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Timeline */}
          <div style={{padding:"1.75rem",background:"#f8fafc",borderRadius:"8px",border:"1px solid #e2e8f0",marginBottom:"1.5rem"}}>
            <Timeline product={result.product} />
          </div>

          {/* Government Schemes */}
          {schemes && schemes.length > 0 && (
            <div style={{padding:"1.75rem",background:"#f0fdf4",borderRadius:"8px",border:"1px solid #d1fae5",borderLeft:"4px solid #16a34a"}}>
              <SchemeCards schemes={schemes} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ExportPlan;
