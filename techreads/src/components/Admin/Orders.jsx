import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/orders", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(
            `Failed to fetch orders: ${response.status} - ${
              errorData.message || "Unknown error"
            }`
          );
          return;
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Error fetching orders. Check console.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errData = await response.json();
        setError(
          `Failed to update status: ${response.status} - ${
            errData.message || "unknown error"
          }`
        );
        return;
      }

      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      alert(
        `Your order ${orderId} status updated to ${newStatus}.  A confirmation email has been sent!`
      );
    } catch (err) {
      console.error("Error updating status: ", err);
      setError("Error updating status. Check console.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="p-6 w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Orders</h2>

        {loading && <p className="text-blue-500">Loading orders...</p>}
        {error && (
          <p className="text-red-500 bg-red-100 p-2 rounded">{error}</p>
        )}

        {orders.length === 0 && !loading ? (
          <p className="text-gray-600 text-lg">No orders found.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition duration-300"
              >
                <p className="text-gray-700 font-semibold">
                  Order ID: {order.id}
                </p>
                <p className="text-gray-500">Status: {order.status}</p>

                <select
                  value={order.status}
                  onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                  className="mt-3 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
