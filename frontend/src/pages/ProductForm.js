import { useState } from "react";
import axios from "axios";
import ResultCard from "../components/ResultCard";

const API = "http://127.0.0.1:8000";

function ProductForm() {
  const [form, setForm] = useState({
    user_id: "",
    product_name: "",
    category: "",
    production_capacity: "",
    target_price: "",
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    try {
      const res = await axios.post(`${API}/add-product`, null, {
        params: {
          user_id: Number(form.user_id),
          product_name: form.product_name,
          category: form.category,
          production_capacity: form.production_capacity,
          target_price: Number(form.target_price),
        },
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    }
  };

  return (
    <div className="page">
      <h1>Add Product</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          name="user_id"
          placeholder="User ID"
          value={form.user_id}
          onChange={handleChange}
          required
        />
        <input
          name="product_name"
          placeholder="Product Name"
          value={form.product_name}
          onChange={handleChange}
          required
        />
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
        />
        <input
          name="production_capacity"
          placeholder="Production Capacity"
          value={form.production_capacity}
          onChange={handleChange}
          required
        />
        <input
          name="target_price"
          placeholder="Target Price"
          type="number"
          value={form.target_price}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Product</button>
      </form>

      {error && <p className="error">{error}</p>}
      <ResultCard title="Product Added" data={result} />
    </div>
  );
}

export default ProductForm;
