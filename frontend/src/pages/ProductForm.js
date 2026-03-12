import { useState } from "react";
import API from "../services/api";
import Toast from "../components/Toast";

function ProductForm() {
  const [product, setProduct] = useState("");
  const [category, setCategory] = useState("");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [minimumOrder, setMinimumOrder] = useState("");
  const [listingOnMarketplace, setListingOnMarketplace] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!product.trim()) newErrors.product = "Product name is required";
    if (!category.trim()) newErrors.category = "Category is required";
    if (!capacity || capacity <= 0) newErrors.capacity = "Capacity must be greater than 0";
    if (!price || price <= 0) newErrors.price = "Price must be greater than 0";

    if (listingOnMarketplace) {
      if (!minimumOrder || minimumOrder <= 0) newErrors.minimumOrder = "Minimum order must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setProduct("");
    setCategory("");
    setCapacity("");
    setPrice("");
    setDescription("");
    setMinimumOrder("");
    setListingOnMarketplace(false);
    setErrors({});
  };

  const submitProduct = async () => {
    setError("");
    setSuccess(false);
    setSuccessMessage("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      if (listingOnMarketplace) {
        await API.post("/add-marketplace-product", null, {
          params: {
            exporter_id: 1,
            product_name: product.trim(),
            category: category.trim(),
            price: Number(price),
            minimum_order_quantity: Number(minimumOrder),
            description: description.trim(),
            production_capacity: Number(capacity)
          }
        });

        setSuccess(true);
        setSuccessMessage("Product listed on the marketplace successfully!");
        resetForm();
        return;
      }

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
      setSuccessMessage("Product registered successfully!");
      resetForm();
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{background: "white", padding: "2.5rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(15, 30, 58, 0.12)", border: "1px solid #e2e8f0"}}>
      <h2 style={{color: "#0f1e3a", marginBottom: "1.5rem", fontSize: "1.5rem", fontWeight: "800"}}>
        <span style={{marginRight: "0.75rem"}}>+</span>
        Add New Product
      </h2>

      <div style={{marginBottom: "1.2rem"}}>
        <label style={{display: "block", fontWeight: "600", color: "#1a202c", marginBottom: "0.4rem", fontSize: "0.85rem", letterSpacing: "0.3px"}}>
          Product Name <span style={{color: "#dc2626"}}>*</span>
        </label>
        <input
          placeholder="Enter product name (e.g., Cotton Fabric)"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          style={{
            width: "100%",
            padding: "0.875rem 1rem",
            border: errors.product ? "1.5px solid #dc2626" : "1.5px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "1rem",
            fontFamily: "inherit",
            transition: "all 0.2s ease",
            backgroundColor: "white",
            color: "#1a202c"
          }}
          onFocus={(e) => {
            if (!errors.product) e.target.style.borderColor = "#0f1e3a";
            e.target.style.boxShadow = "0 0 0 3px rgba(15, 30, 58, 0.1)";
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = "none";
          }}
        />
        {errors.product && <p style={{color:"#dc2626",fontSize:"0.85rem",marginTop:"0.25rem",fontWeight:"500"}}>{errors.product}</p>}
      </div>

      <div style={{marginBottom: "1.2rem"}}>
        <label style={{display: "block", fontWeight: "600", color: "#1a202c", marginBottom: "0.4rem", fontSize: "0.85rem", letterSpacing: "0.3px"}}>
          Category <span style={{color: "#dc2626"}}>*</span>
        </label>
        <input
          placeholder="e.g., Electronics, Textiles, Agriculture"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            width: "100%",
            padding: "0.875rem 1rem",
            border: errors.category ? "1.5px solid #dc2626" : "1.5px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "1rem",
            fontFamily: "inherit",
            transition: "all 0.2s ease"
          }}
          onFocus={(e) => {
            if (!errors.category) e.target.style.borderColor = "#0f1e3a";
            e.target.style.boxShadow = "0 0 0 3px rgba(15, 30, 58, 0.1)";
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = "none";
          }}
        />
        {errors.category && <p style={{color:"#dc2626",fontSize:"0.85rem",marginTop:"0.25rem",fontWeight:"500"}}>{errors.category}</p>}
      </div>

      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.2rem"}}>
        <div>
          <label style={{display: "block", fontWeight: "600", color: "#1a202c", marginBottom: "0.4rem", fontSize: "0.85rem", letterSpacing: "0.3px"}}>
            Production Capacity (units) <span style={{color: "#dc2626"}}>*</span>
          </label>
          <input
            placeholder="Annual production capacity"
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            style={{
              width: "100%",
              padding: "0.875rem 1rem",
              border: errors.capacity ? "1.5px solid #dc2626" : "1.5px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "1rem",
              fontFamily: "inherit"
            }}
            onFocus={(e) => {
              if (!errors.capacity) e.target.style.borderColor = "#0f1e3a";
              e.target.style.boxShadow = "0 0 0 3px rgba(15, 30, 58, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = "none";
            }}
          />
          {errors.capacity && <p style={{color:"#dc2626",fontSize:"0.85rem",marginTop:"0.25rem",fontWeight:"500"}}>{errors.capacity}</p>}
        </div>

        <div>
          <label style={{display: "block", fontWeight: "600", color: "#1a202c", marginBottom: "0.4rem", fontSize: "0.85rem", letterSpacing: "0.3px"}}>
            Target Price (USD) <span style={{color: "#dc2626"}}>*</span>
          </label>
          <input
            placeholder="Price per unit in USD"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{
              width: "100%",
              padding: "0.875rem 1rem",
              border: errors.price ? "1.5px solid #dc2626" : "1.5px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "1rem",
              fontFamily: "inherit"
            }}
            onFocus={(e) => {
              if (!errors.price) e.target.style.borderColor = "#0f1e3a";
              e.target.style.boxShadow = "0 0 0 3px rgba(15, 30, 58, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = "none";
            }}
          />
          {errors.price && <p style={{color:"#dc2626",fontSize:"0.85rem",marginTop:"0.25rem",fontWeight:"500"}}>{errors.price}</p>}
        </div>
      </div>

      <div style={{marginBottom: "1.2rem"}}>
        <label style={{display: "block", fontWeight: "600", color: "#1a202c", marginBottom: "0.4rem", fontSize: "0.85rem", letterSpacing: "0.3px"}}>
          Description (optional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short product description for buyers"
          rows={3}
          style={{
            width: "100%",
            padding: "0.875rem 1rem",
            border: "1.5px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "1rem",
            fontFamily: "inherit",
            resize: "vertical"
          }}
        />
      </div>

      <div style={{display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem"}}>
        <input
          type="checkbox"
          checked={listingOnMarketplace}
          onChange={(e) => setListingOnMarketplace(e.target.checked)}
          id="list_on_marketplace"
          style={{width: "16px", height: "16px"}}
        />
        <label htmlFor="list_on_marketplace" style={{fontWeight: 600, color: "#1a202c"}}>
          List this product on the Global Trade Marketplace
        </label>
      </div>

      {listingOnMarketplace && (
        <div style={{marginBottom: "1.2rem"}}>
          <label style={{display: "block", fontWeight: "600", color: "#1a202c", marginBottom: "0.4rem", fontSize: "0.85rem", letterSpacing: "0.3px"}}>
            Minimum Order Quantity <span style={{color: "#dc2626"}}>*</span>
          </label>
          <input
            placeholder="e.g., 10"
            type="number"
            value={minimumOrder}
            onChange={(e) => setMinimumOrder(e.target.value)}
            style={{
              width: "100%",
              padding: "0.875rem 1rem",
              border: errors.minimumOrder ? "1.5px solid #dc2626" : "1.5px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "1rem",
              fontFamily: "inherit"
            }}
            onFocus={(e) => {
              if (!errors.minimumOrder) e.target.style.borderColor = "#0f1e3a";
              e.target.style.boxShadow = "0 0 0 3px rgba(15, 30, 58, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = "none";
            }}
          />
          {errors.minimumOrder && <p style={{color:"#dc2626",fontSize:"0.85rem",marginTop:"0.25rem",fontWeight:"500"}}>{errors.minimumOrder}</p>}
        </div>
      )}

      <button
        onClick={submitProduct}
        disabled={loading}
        style={{
          width: "100%",
          padding: "0.875rem 1.5rem",
          background: loading ? "#e2e8f0" : "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)",
          color: loading ? "#4a5568" : "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "1rem",
          fontWeight: "600",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          marginTop: "1rem",
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
        {loading ? "Submitting..." : listingOnMarketplace ? "List on Marketplace" : "Register Product"}
      </button>

      {error && <p style={{color:"#dc2626",marginTop:"1.5rem",padding:"1rem",background:"#fee2e2",borderRadius:"6px",borderLeft:"3px solid #dc2626"}}>{error}</p>}

      {success && (
        <Toast message={successMessage || "✓ Operation successful!"} type="success" onClose={() => setSuccess(false)} />
      )}
    </div>
  );
}

export default ProductForm;
