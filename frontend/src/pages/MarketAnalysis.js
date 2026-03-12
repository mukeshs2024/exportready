import { useState } from "react";
import API from "../services/api";

function MarketAnalysis() {

  const [productName, setProductName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!productName.trim()) {
      alert("Please enter a product name");
      return;
    }

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

  return (
    <div style={{background: "white", padding: "2.5rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(15, 30, 58, 0.12)", border: "1px solid #e2e8f0"}}>
      <h2 style={{color: "#0f1e3a", marginBottom: "2.5rem", fontSize: "1.4rem", fontWeight: "800"}}><span style={{marginRight: "0.75rem"}}>◌</span>Market Analysis</h2>

      <div style={{marginBottom: "1.5rem"}}>
        <label style={{display: "block", fontWeight: "600", color: "#1a202c", marginBottom: "0.5rem", fontSize: "0.9rem"}}>
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
            fontSize: "0.9rem",
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

      <button 
        onClick={analyze} 
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
        {loading ? "Analyzing Markets..." : "Analyze Export Markets"}
      </button>

      {error && <p style={{color:"#dc2626",marginTop:"1.5rem",padding:"1rem",background:"#fee2e2",borderRadius:"6px",borderLeft:"3px solid #dc2626"}}>{error}</p>}

      {result && (
        <div style={{marginTop:"2.5rem",padding:"2rem",background:"#f0fdf4",borderRadius:"8px",borderLeft:"4px solid #16a34a"}}>
          <h3 style={{color: "#0f1e3a", marginBottom: "1.5rem", fontSize: "1rem", fontWeight: "700"}}>
            ✓ Top Export Markets for <strong>{result.product}</strong>
          </h3>
          <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem"}}>
            {result.recommended_markets.map((country, i) => (
              <div key={i} style={{padding:"1.25rem",background:"white",borderRadius:"8px",border:"1px solid #d1fae5",fontWeight:"600",color:"#059669",textAlign:"center",boxShadow:"0 1px 3px rgba(15, 30, 58, 0.1)"}}>
                {country}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MarketAnalysis;
