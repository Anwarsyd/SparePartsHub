import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/axios";

function Cart() {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const getCart = async () => {
    try {
      const response = await api.get("/cart/");
      setCart(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }

      setError("Failed to load cart.");
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  const updateQuantity = async (id, quantity) => {
    try {
      await api.patch(`/cart/items/${id}/`, {
        quantity,
      });

      getCart();
    } catch (error) {
      setError(error.response?.data?.error || "Update failed.");
    }
  };

  const removeItem = async (id) => {
    try {
      await api.delete(`/cart/items/${id}/remove/`);
      getCart();
    } catch (error) {
      setError("Failed to remove item.");
    }
  };

  if (error) {
    return (
      <div className="page">
        <p className="error">{error}</p>
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="page">
        <h2>Loading cart...</h2>
      </div>
    );
  }

  const total = cart.items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <div className="page">
      <h1>Your Cart</h1>

      {cart.items.length === 0 ? (
        <>
          <p>Your cart is empty.</p>
          <Link to="/products">Browse Products</Link>
        </>
      ) : (
        <>
          {cart.items.map((item) => (
            <div className="row" key={item.id}>
              <div className="row-main">
                <h3 style={{ margin: 0 }}>{item.product_name}</h3>
                <p className="stock" style={{ margin: "2px 0" }}>
                  ₹{item.price}
                </p>
              </div>

              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(
                    item.id,
                    Number(e.target.value)
                  )
                }
              />

              <p style={{ minWidth: 80, textAlign: "right" }}>
                ₹{Number(item.price) * item.quantity}
              </p>

              <button
                onClick={() => removeItem(item.id)}
                style={{
                  background: "none",
                  color: "var(--rust)",
                  border: "1px solid var(--line)",
                }}
              >
                Remove
              </button>
            </div>
          ))}

          <div className="cart-total">Total: ₹{total}</div>

          <div style={{ marginTop: 20 }}>
            <Link to="/checkout">
              <button>Proceed to Checkout</button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;