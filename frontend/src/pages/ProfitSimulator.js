import { useState } from "react";
import API from "../services/api";

function ProfitSimulator() {

  const [productId, setProductId] = useState("");
  const [country, setCountry] = useState("");
  const [productionCost, setProductionCost] = useState("");
  const [shippingCost, setShippingCost] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const demoResult = {
    product: "Cotton Shirts",
    market: "UAE",
    profitPerUnit: 2.4,
    shipping: 0.7,
    duty: 5,
  };

  const calculateProfit = async () => {
    if (!productId.trim() || !country.trim() || !productionCost.trim() || !shippingCost.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await API.post("/ai/profit-simulator", null, {
        params: {
          product_id: Number(productId),
          country: country.trim(),
          production_cost: Number(productionCost),
          shipping_cost: Number(shippingCost)
        }
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{background: "white", padding: "3rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(15, 30, 58, 0.12)", border: "1px solid #e2e8f0"}}>
      <h2 style={{color: "#0f1e3a", marginBottom: "2.5rem", fontSize: "1.4rem", fontWeight: "800"}}><span style={{marginRight: "0.75rem"}}>₹</span>Profit Simulator</h2>

      <div style={{
        padding: "1.25rem 1.5rem",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        background: "linear-gradient(135deg, #fff7ed 0%, #fff1e6 100%)",
        boxShadow: "0 4px 10px rgba(15, 30, 58, 0.08)",
        marginBottom: "2rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
          <div style={{ fontSize: "0.78rem", fontWeight: "800", letterSpacing: "1px", textTransform: "uppercase", color: "#92400e" }}>
            Profit Simulator Result Card
          </div>
          <div style={{ fontSize: "0.9rem", fontWeight: "800", color: "#0f1e3a" }}>
            Estimated Profit: ${demoResult.profitPerUnit.toFixed(2)} / unit
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.75rem" }}>
          <div style={{ background: "white", borderRadius: "8px", padding: "0.75rem 1rem", border: "1px solid #fed7aa" }}>
            <div style={{ fontSize: "0.7rem", color: "#9a3412", fontWeight: "700", letterSpacing: "0.5px", textTransform: "uppercase" }}>Product</div>
            <div style={{ fontSize: "0.9rem", color: "#0f1e3a", fontWeight: "700", marginTop: "0.2rem" }}>{demoResult.product}</div>
          </div>
          <div style={{ background: "white", borderRadius: "8px", padding: "0.75rem 1rem", border: "1px solid #fed7aa" }}>
            <div style={{ fontSize: "0.7rem", color: "#9a3412", fontWeight: "700", letterSpacing: "0.5px", textTransform: "uppercase" }}>Market</div>
            <div style={{ fontSize: "0.9rem", color: "#0f1e3a", fontWeight: "700", marginTop: "0.2rem" }}>{demoResult.market}</div>
          </div>
          <div style={{ background: "white", borderRadius: "8px", padding: "0.75rem 1rem", border: "1px solid #fed7aa" }}>
            <div style={{ fontSize: "0.7rem", color: "#9a3412", fontWeight: "700", letterSpacing: "0.5px", textTransform: "uppercase" }}>Shipping</div>
            <div style={{ fontSize: "0.9rem", color: "#0f1e3a", fontWeight: "700", marginTop: "0.2rem" }}>${demoResult.shipping.toFixed(2)}</div>
          </div>
          <div style={{ background: "white", borderRadius: "8px", padding: "0.75rem 1rem", border: "1px solid #fed7aa" }}>
            <div style={{ fontSize: "0.7rem", color: "#9a3412", fontWeight: "700", letterSpacing: "0.5px", textTransform: "uppercase" }}>Duty</div>
            <div style={{ fontSize: "0.9rem", color: "#0f1e3a", fontWeight: "700", marginTop: "0.2rem" }}>{demoResult.duty}%</div>
          </div>
        </div>
      </div>

      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem"}}>
        <div>
          <label style={{display: "block", fontWeight: "600", color: "#1a202c", marginBottom: "0.5rem", fontSize: "0.8rem"}}>
            Product ID
          </label>
          <input
            placeholder="e.g., 1"
            type="number"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            style={{
              width: "100%",
              padding: "0.875rem 1rem",
              border: "1.5px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "1rem",
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

        <div>
          <label style={{display: "block", fontWeight: "600", color: "#1a202c", marginBottom: "0.5rem", fontSize: "0.95rem"}}>
            Destination Country
          </label>
          <input
            placeholder="e.g., UAE"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={{
              width: "100%",
              padding: "0.875rem 1rem",
              border: "1.5px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "1rem",
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

        <div>
          <label style={{display: "block", fontWeight: "600", color: "#1a202c", marginBottom: "0.5rem", fontSize: "0.95rem"}}>
            Production Cost ($)
          </label>
          <input
            placeholder="Cost to produce"
            type="number"
            value={productionCost}
            onChange={(e) => setProductionCost(e.target.value)}
            style={{
              width: "100%",
              padding: "0.875rem 1rem",
              border: "1.5px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "1rem",
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

        <div>
          <label style={{display: "block", fontWeight: "600", color: "#1a202c", marginBottom: "0.5rem", fontSize: "0.95rem"}}>
            Shipping Cost ($)
          </label>
          <input
            placeholder="Shipping cost"
            type="number"
            value={shippingCost}
            onChange={(e) => setShippingCost(e.target.value)}
            style={{
              width: "100%",
              padding: "0.875rem 1rem",
              border: "1.5px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "1rem",
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
      </div>

      <button onClick={calculateProfit} disabled={loading} style={{
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
        {loading ? "Calculating Profit..." : "Calculate Profit"}
      </button>

      {error && <p style={{color:"#dc2626",marginTop:"1.5rem",padding:"1rem",background:"#fee2e2",borderRadius:"6px",borderLeft:"3px solid #dc2626"}}>{error}</p>}

      {result && (
        <div style={{marginTop:"2.5rem"}}>
          {(() => {
            const totalCost = (result.production_cost || 0) + (result.shipping_cost || 0) + (result.duties || 0);
            const profitable = (result.estimated_profit || 0) > 0;

            return (
              <>
          <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1.25rem",marginBottom:"1.5rem"}}>
            <div style={{padding:"1.5rem",background:"#f0fdf4",borderRadius:"8px",border:"1px solid #d1fae5",textAlign:"center"}}>
              <div style={{fontSize:"0.85rem",color:"#166534",fontWeight:"600",marginBottom:"0.5rem"}}>DUTY COST</div>
              <div style={{fontSize:"1.4rem",fontWeight:"800",color:"#16a34a"}}>${Number(result.duties || 0).toFixed(2)}</div>
            </div>
            <div style={{padding:"1.5rem",background:"#dbeafe",borderRadius:"8px",border:"1px solid #bfdbfe",textAlign:"center"}}>
              <div style={{fontSize:"0.85rem",color:"#0c4a6e",fontWeight:"600",marginBottom:"0.5rem"}}>TOTAL COST</div>
              <div style={{fontSize:"1.4rem",fontWeight:"800",color:"#0369a1"}}>${Number(totalCost).toFixed(2)}</div>
            </div>
            <div style={{padding:"1.5rem",background:"#fef3c7",borderRadius:"8px",border:"1px solid #fde68a",textAlign:"center"}}>
              <div style={{fontSize:"0.85rem",color:"#92400e",fontWeight:"600",marginBottom:"0.5rem"}}>PROFIT</div>
              <div style={{fontSize:"1.4rem",fontWeight:"800",color:"#d4af37"}}>${Number(result.estimated_profit || 0).toFixed(2)}</div>
            </div>
          </div>

          <div style={{padding:"1.5rem",background:profitable ? "#f0fdf4" : "#fef2f2",borderRadius:"8px",border:`1px solid ${profitable ? "#d1fae5" : "#fecaca"}`,borderLeft:`4px solid ${profitable ? "#16a34a" : "#dc2626"}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:"0.9rem",fontWeight:"600",color:profitable ? "#166534" : "#7f1d1d"}}>PROFITABILITY STATUS</span>
              <span style={{fontSize:"1.3rem",fontWeight:"800",color:profitable ? "#16a34a" : "#dc2626"}}>
                {profitable ? "PROFITABLE" : "NOT PROFITABLE"}
              </span>
            </div>
          </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}

export default ProfitSimulator;
