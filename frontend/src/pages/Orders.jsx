import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/axios";

function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await api.get("/orders/my-orders/");
        setOrders(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    getOrders();
  }, [navigate]);

  return (
    <div className="page">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div className="row" key={order.id}>
            <div>
              <h3 style={{ margin: 0 }}>Order #{order.id}</h3>
              <p className="stock">Payment: {order.payment_status}</p>
            </div>

            <p className="order-status">{order.status}</p>

            <p>₹{order.total_amount}</p>

            <Link to={`/orders/${order.id}`}>
              View Order
            </Link>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;