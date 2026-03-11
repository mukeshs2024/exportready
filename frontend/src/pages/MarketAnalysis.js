import { useState } from "react";
import axios from "axios";
import ResultCard from "../components/ResultCard";

const API = "http://127.0.0.1:8000";

function MarketAnalysis() {
  const [productName, setProductName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await axios.get(`${API}/market-analysis`, {
        params: { product_name: productName },
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Market Analysis</h1>
      <form className="form" onSubmit={handleAnalyze}>
        <input
          placeholder="Enter product name (e.g., Cotton Shirts)"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Analyzing…" : "Analyze Market"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      <ResultCard title="Market Analysis Results" data={result} />
    </div>
  );
}

export default MarketAnalysis;
