import { useState } from "react";
import API from "../services/api";

function ProfitSimulator() {

  const [productPrice, setProductPrice] = useState("");
  const [productionCost, setProductionCost] = useState("");
  const [shippingCost, setShippingCost] = useState("");
  const [dutyPercentage, setDutyPercentage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const calculateProfit = async () => {
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await API.post("/profit-simulation", null, {
        params: {
          product_price: Number(productPrice),
          production_cost: Number(productionCost),
          shipping_cost: Number(shippingCost),
          duty_percentage: Number(dutyPercentage)
        }
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "30px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    border: "2px solid #ddd",
    borderRadius: "8px",
    fontSize: "1rem",
    fontFamily: "inherit"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
    color: "#1a1a2e",
    fontSize: "0.95rem"
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    background: loading ? "#9ca3af" : "#0D1B4C",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: loading ? "not-allowed" : "pointer",
    marginTop: "10px"
  };

  return (
    <div style={containerStyle}>
      <h2 style={{color: "#0D1B4C", marginBottom: "25px"}}>💰 Profit Simulator</h2>

      <label style={labelStyle}>Product Price ($)</label>
      <input
        placeholder="Enter product selling price"
        type="number"
        value={productPrice}
        onChange={(e) => setProductPrice(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Production Cost ($)</label>
      <input
        placeholder="Enter production cost"
        type="number"
        value={productionCost}
        onChange={(e) => setProductionCost(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Shipping Cost ($)</label>
      <input
        placeholder="Enter shipping cost"
        type="number"
        value={shippingCost}
        onChange={(e) => setShippingCost(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Duty Percentage (%)</label>
      <input
        placeholder="Enter duty percentage"
        type="number"
        value={dutyPercentage}
        onChange={(e) => setDutyPercentage(e.target.value)}
        style={inputStyle}
      />

      <button onClick={calculateProfit} disabled={loading} style={buttonStyle}>
        {loading ? "Calculating..." : "Calculate Profit"}
      </button>

      {error && <p style={{color:"#ef4444",marginTop:"15px",padding:"12px",background:"#fee2e2",borderRadius:"6px"}}>{error}</p>}

      {result && (
        <div style={{marginTop:"25px",padding:"20px",background:result.profitability === "Profitable" ? "#f0fdf4" : "#fef2f2",borderRadius:"8px",borderLeft:`4px solid ${result.profitability === "Profitable" ? "#10b981" : "#ef4444"}`}}>
          <h3 style={{color: "#0D1B4C", marginBottom: "15px"}}>✓ Profit Analysis Results</h3>
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px"}}>
            <div style={{padding:"12px",background:"white",borderRadius:"6px"}}>
              <p style={{fontSize:"0.9rem",color:"#6b7280",marginBottom:"5px"}}>Duty Cost</p>
              <p style={{fontSize:"1.4rem",fontWeight:"700",color:"#0D1B4C"}}>${result.duty_cost.toFixed(2)}</p>
            </div>
            <div style={{padding:"12px",background:"white",borderRadius:"6px"}}>
              <p style={{fontSize:"0.9rem",color:"#6b7280",marginBottom:"5px"}}>Total Cost</p>
              <p style={{fontSize:"1.4rem",fontWeight:"700",color:"#0D1B4C"}}>${result.total_cost.toFixed(2)}</p>
            </div>
            <div style={{padding:"12px",background:"white",borderRadius:"6px",gridColumn:"1 / -1"}}>
              <p style={{fontSize:"0.9rem",color:"#6b7280",marginBottom:"5px"}}>Expected Profit</p>
              <p style={{fontSize:"1.6rem",fontWeight:"700",color:result.profitability === "Profitable" ? "#10b981" : "#ef4444"}}>${result.profit.toFixed(2)}</p>
            </div>
            <div style={{padding:"12px",background:"white",borderRadius:"6px",gridColumn:"1 / -1"}}>
              <p style={{fontSize:"0.9rem",color:"#6b7280",marginBottom:"5px"}}>Status</p>
              <p style={{fontSize:"1.1rem",fontWeight:"700",color:result.profitability === "Profitable" ? "#10b981" : "#ef4444"}}>📈 {result.profitability}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ProfitSimulator;
