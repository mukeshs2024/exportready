import { useState } from "react";
import axios from "axios";
import ResultCard from "../components/ResultCard";

const API = "http://127.0.0.1:8000";

function ExportPlan() {
  const [productName, setProductName] = useState("");
  const [targetCountry, setTargetCountry] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await axios.get(`${API}/export-action-plan`, {
        params: {
          product_name: productName,
          target_country: targetCountry,
        },
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
      <h1>Export Action Plan</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
        <input
          placeholder="Target Country (e.g., USA)"
          value={targetCountry}
          onChange={(e) => setTargetCountry(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Generating…" : "Generate Plan"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      <ResultCard title="Export Action Plan" data={result} />
    </div>
  );
}

export default ExportPlan;
