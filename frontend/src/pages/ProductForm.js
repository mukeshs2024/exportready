import { useState } from "react";
import API from "../services/api";
import Toast from "../components/Toast";

function ProductForm() {

  const [product, setProduct] = useState("");
  const [category, setCategory] = useState("");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!product.trim()) newErrors.product = "Product name is required";
    if (!category.trim()) newErrors.category = "Category is required";
    if (!capacity || capacity <= 0) newErrors.capacity = "Capacity must be greater than 0";
    if (!price || price <= 0) newErrors.price = "Price must be greater than 0";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitProduct = async () => {
    setError("");
    setSuccess(false);
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      const res = await API.post("/add-product", null, {
        params: {
          user_id: 1,
          product_name: product.trim(),
          category: category.trim(),
          production_capacity: Number(capacity),
          target_price: Number(price)
        }
      });
      console.log("API Response:", res.data);
      setSuccess(true);
      setProduct("");
      setCategory("");
      setCapacity("");
      setPrice("");
      setErrors({});
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (fieldName) => ({
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    border: errors[fieldName] ? "2px solid #ef4444" : "2px solid #ddd",
    borderRadius: "8px",
    fontSize: "1rem",
    fontFamily: "inherit",
    transition: "border-color 0.2s"
  });

  const containerStyle = {
    maxWidth: "500px",
    margin: "40px auto",
    padding: "30px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
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
    transition: "background 0.2s",
    marginTop: "10px"
  };

  return (
    <div style={containerStyle}>
      <h2 style={{marginBottom: "30px", color: "#0D1B4C"}}>Add New Product</h2>

      <div>
        <label style={labelStyle}>Product Name *</label>
        <input
          placeholder="Enter product name"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          style={inputStyle("product")}
        />
        {errors.product && <p style={{color:"#ef4444",fontSize:"0.85rem",marginTop:"-10px",marginBottom:"10px"}}>{errors.product}</p>}
      </div>

      <div>
        <label style={labelStyle}>Category *</label>
        <input
          placeholder="Enter category (e.g., Electronics, Textiles)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={inputStyle("category")}
        />
        {errors.category && <p style={{color:"#ef4444",fontSize:"0.85rem",marginTop:"-10px",marginBottom:"10px"}}>{errors.category}</p>}
      </div>

      <div>
        <label style={labelStyle}>Production Capacity (units) *</label>
        <input
          placeholder="Enter production capacity"
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          style={inputStyle("capacity")}
        />
        {errors.capacity && <p style={{color:"#ef4444",fontSize:"0.85rem",marginTop:"-10px",marginBottom:"10px"}}>{errors.capacity}</p>}
      </div>

      <div>
        <label style={labelStyle}>Target Price ($) *</label>
        <input
          placeholder="Enter target price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={inputStyle("price")}
        />
        {errors.price && <p style={{color:"#ef4444",fontSize:"0.85rem",marginTop:"-10px",marginBottom:"10px"}}>{errors.price}</p>}
      </div>

      <button onClick={submitProduct} disabled={loading} style={buttonStyle}>
        {loading ? "Submitting..." : "Add Product"}
      </button>

      {error && <p style={{color:"#ef4444",marginTop:"15px",padding:"12px",background:"#fee2e2",borderRadius:"6px"}}>{error}</p>}

      {success && <Toast message="✓ Product added successfully!" type="success" onClose={() => setSuccess(false)} />}
    </div>
  );
}

export default ProductForm;
