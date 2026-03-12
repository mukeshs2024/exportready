import { useState } from "react";
import API from "../services/api";

function MarketAnalysis() {

  const [productName, setProductName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await API.get("/market-analysis", {
        params: { product_name: productName }
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "30px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "2px solid #ddd",
    borderRadius: "8px",
    fontSize: "1rem",
    fontFamily: "inherit"
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    background: loading ? "#9ca3af" : "#F5A623",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: loading ? "not-allowed" : "pointer",
    transition: "background 0.2s"
  };

  return (
    <div style={containerStyle}>
      <h2 style={{color: "#0D1B4C", marginBottom: "25px"}}>🌍 Market Analysis</h2>

      <input
        placeholder="Enter product name (e.g., Cotton Shirts)"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        style={inputStyle}
      />

      <button onClick={analyze} disabled={loading} style={buttonStyle}>
        {loading ? "Analyzing..." : "Analyze Export Markets"}
      </button>

      {error && <p style={{color:"#ef4444",marginTop:"15px",padding:"12px",background:"#fee2e2",borderRadius:"6px"}}>{error}</p>}

      {result && (
        <div style={{marginTop:"25px",padding:"20px",background:"#f0fdf4",borderRadius:"8px",borderLeft:"4px solid #10b981"}}>
          <h3 style={{color: "#0D1B4C", marginBottom: "15px"}}>✓ Top Export Markets for: <strong>{result.product}</strong></h3>
          <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px"}}>
            {result.recommended_markets.map((country, i) => (
              <div key={i} style={{padding:"12px",background:"white",borderRadius:"6px",border:"1px solid #d1fae5",fontWeight:"600",color:"#059669"}}>🎯 {country}</div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default MarketAnalysis;
