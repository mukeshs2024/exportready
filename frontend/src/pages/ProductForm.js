import { useState } from "react";
import API from "../services/api";

function ProductForm() {

  const [product, setProduct] = useState("");
  const [category, setCategory] = useState("");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitProduct = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/add-product", null, {
        params: {
          user_id: 1,
          product_name: product,
          category: category,
          production_capacity: Number(capacity),
          target_price: Number(price)
        }
      });
      console.log("API Response:", res.data);
      alert("Product Added!");
      setProduct("");
      setCategory("");
      setCapacity("");
      setPrice("");
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add Product</h2>

      <input
        placeholder="Product Name"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
      />
      <br/><br/>

      <input
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <br/><br/>

      <input
        placeholder="Production Capacity"
        type="number"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
      />
      <br/><br/>

      <input
        placeholder="Target Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <br/><br/>

      <button onClick={submitProduct} disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </button>

      {error && <p style={{color:"red",marginTop:"10px"}}>{error}</p>}

    </div>
  );
}

export default ProductForm;
