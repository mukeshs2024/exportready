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

  return (
    <div>

      <h2>Market Analysis</h2>

      <input
        placeholder="Enter product name (e.g., Cotton Shirts)"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
      <br/><br/>

      <button onClick={analyze} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Export Markets"}
      </button>

      {error && <p style={{color:"red",marginTop:"10px"}}>{error}</p>}

      {result && (
        <div style={{marginTop:"20px"}}>
          <h3>Top Export Markets for: {result.product}</h3>
          <ul>
            {result.recommended_markets.map((country, i) => (
              <li key={i} style={{fontSize:"18px",margin:"8px 0"}}>{country}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}

export default MarketAnalysis;
