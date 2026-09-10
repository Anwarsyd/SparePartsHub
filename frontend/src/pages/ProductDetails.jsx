import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../api/axios";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await api.get(`/products/${id}/`);
        setProduct(response.data);
      } catch (error) {
        console.log(error.response?.data);
      }
    };

    getProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await api.post("/cart/items/", {
        product: id,
        quantity,
      });

      setMessage("Product added to cart.");
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }

      setMessage(
        error.response?.data?.error || "Failed to add product."
      );
    }
  };

  if (!product) {
    return (
      <div className="page">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="detail-layout">
        <div className="thumb-large">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              width="100%"
              style={{ objectFit: "cover", borderRadius: 4 }}
            />
          ) : (
            <span className="stock">No image</span>
          )}
        </div>

        <div className="detail-info">
          <h1>{product.name}</h1>
          <p className="tag">Part: {product.part_name}</p>
          <p className="tag">Part Number: {product.part_number}</p>
          <h2 style={{ marginTop: 14 }}>₹{product.price}</h2>
          <p className="stock">Stock: {product.stock}</p>

          <div className="qty-row">
            <label htmlFor="qty">Quantity</label>
            <input
              id="qty"
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            Add to Cart
          </button>

          {message && <p className="success">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;