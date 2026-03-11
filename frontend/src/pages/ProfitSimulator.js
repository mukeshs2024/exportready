import { useState } from "react";
import axios from "axios";
import ResultCard from "../components/ResultCard";

const API = "http://127.0.0.1:8000";

function ProfitSimulator() {
  const [form, setForm] = useState({
    product_price: "",
    production_cost: "",
    shipping_cost: "",
    duty_percentage: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await axios.post(`${API}/profit-simulation`, null, {
        params: {
          product_price: Number(form.product_price),
          production_cost: Number(form.production_cost),
          shipping_cost: Number(form.shipping_cost),
          duty_percentage: Number(form.duty_percentage),
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
      <h1>Profit Simulator</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          name="product_price"
          placeholder="Product Price ($)"
          type="number"
          value={form.product_price}
          onChange={handleChange}
          required
        />
        <input
          name="production_cost"
          placeholder="Production Cost ($)"
          type="number"
          value={form.production_cost}
          onChange={handleChange}
          required
        />
        <input
          name="shipping_cost"
          placeholder="Shipping Cost ($)"
          type="number"
          value={form.shipping_cost}
          onChange={handleChange}
          required
        />
        <input
          name="duty_percentage"
          placeholder="Duty Percentage (%)"
          type="number"
          value={form.duty_percentage}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Simulating…" : "Simulate Profit"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      <ResultCard title="Profit Simulation Results" data={result} />
    </div>
  );
}

export default ProfitSimulator;
