import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleCheckout = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/orders/", {
        payment_method: paymentMethod,
      });

      const order = response.data;

      if (paymentMethod === "MOCK") {
        await api.post(`/orders/${order.id}/pay/`);
      }

      navigate(`/orders/${order.id}`);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.error ||
        "Checkout failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Checkout</h1>

      <h3>Select Payment Method</h3>

      <label
        className={`pay-option${paymentMethod === "COD" ? " selected" : ""}`}
      >
        <input
          type="radio"
          value="COD"
          checked={paymentMethod === "COD"}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        Cash on Delivery
      </label>

      <label
        className={`pay-option${paymentMethod === "MOCK" ? " selected" : ""}`}
      >
        <input
          type="radio"
          value="MOCK"
          checked={paymentMethod === "MOCK"}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        Mock Online Payment
      </label>

      <div style={{ marginTop: 16 }}>
        <button
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? "Processing..." : "Place Order"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Checkout;