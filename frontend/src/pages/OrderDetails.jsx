import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../api/axios";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    const getOrder = async () => {
      try {
        const response = await api.get(`/orders/${id}/`);
        setOrder(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    getOrder();
  }, [id, navigate]);

  if (!order) {
    return (
      <div className="page">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Order #{order.id}</h1>

      <p className="tag">Payment Method: {order.payment_method}</p>
      <p className="order-status">Payment Status: {order.payment_status}</p>
      <p>Status: {order.status}</p>

      <h2 style={{ marginTop: 14 }}>Total: ₹{order.total_amount}</h2>

      <h3 style={{ marginTop: 24 }}>Items</h3>

      {order.items.map((item) => (
        <div className="row" key={item.id}>
          <p style={{ margin: 0 }}>{item.product_name}</p>
          <p style={{ margin: 0 }}>Quantity: {item.quantity}</p>
          <p style={{ margin: 0 }}>Price: ₹{item.price}</p>
        </div>
      ))}
    </div>
  );
}

export default OrderDetails;