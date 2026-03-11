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

  return (
    <div>

      <h2>Profit Simulator</h2>

      <input
        placeholder="Product Price ($)"
        type="number"
        value={productPrice}
        onChange={(e) => setProductPrice(e.target.value)}
      />
      <br/><br/>

      <input
        placeholder="Production Cost ($)"
        type="number"
        value={productionCost}
        onChange={(e) => setProductionCost(e.target.value)}
      />
      <br/><br/>

      <input
        placeholder="Shipping Cost ($)"
        type="number"
        value={shippingCost}
        onChange={(e) => setShippingCost(e.target.value)}
      />
      <br/><br/>

      <input
        placeholder="Duty Percentage (%)"
        type="number"
        value={dutyPercentage}
        onChange={(e) => setDutyPercentage(e.target.value)}
      />
      <br/><br/>

      <button onClick={calculateProfit} disabled={loading}>
        {loading ? "Calculating..." : "Calculate Profit"}
      </button>

      {error && <p style={{color:"red",marginTop:"10px"}}>{error}</p>}

      {result && (
        <div style={{marginTop:"20px",background:"#f9f9f9",padding:"20px",borderRadius:"10px"}}>
          <h3>Simulation Results</h3>
          <p><strong>Duty Cost:</strong> ${result.duty_cost.toFixed(2)}</p>
          <p><strong>Total Cost:</strong> ${result.total_cost.toFixed(2)}</p>
          <p><strong>Profit:</strong> ${result.profit.toFixed(2)}</p>
          <p><strong>Status:</strong> {result.profitability}</p>
        </div>
      )}

    </div>
  );
}

export default ProfitSimulator;
