import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaHistory } from "react-icons/fa";


const OrderHistory = ({ orders, loading, error }) => {
  if (loading) return <p className="text-gray-600">Loading orders...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!orders.length) return <p className="text-gray-600">No orders found.</p>;

  return (
    <ul className="space-y-4">
      {orders.map((order) => (
        <li
          key={order.id}
          className="p-4 rounded-lg flex justify-between items-center shadow-md border transition transform duration-300 ease-in-out hover:scale-105"
        >
          <div>
            <p className="text-gray-700 font-medium">Order #{order.id}</p>
            <p className="text-sm text-gray-500">
              {new Date(order.datetime).toLocaleDateString()}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-white text-sm ${
              order.status === "Pending"
                ? "bg-yellow-500"
                : order.status === "Shipped"
                ? "bg-blue-500"
                : "bg-green-500"
            }`}
          >
            {order.status}
          </span>
        </li>
      ))}
    </ul>
  );
};

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem("token");

 
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

 
  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const response = await fetch("https://techreads-backend.onrender.com/orders", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          setError(`Failed to fetch orders: ${response.status}`);
          return;
        }
        const data = await response.json();
        console.log("Fetched orders:", data);
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Error fetching orders. See console for details.");
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white shadow p-6">
        <h2 className="text-xl font-bold mb-4">My Order History</h2>
        <nav className="flex flex-col space-y-4">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center space-x-2 ${
              activeTab === "profile" ? "text-blue-600 font-bold" : "text-gray-600"
            }`}
          >
            <FaUser />
            <span>Profile</span>
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center space-x-2 ${
              activeTab === "orders" ? "text-blue-600 font-bold" : "text-gray-600"
            }`}
          >
            <FaHistory />
            <span>Order History</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6">
        {activeTab === "profile" && (
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-10 rounded-2xl shadow-lg max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold">{user.name}</h2>
            <p className="text-lg">{user.email}</p>
          </div>
        )}
        {activeTab === "orders" && (
          <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Order History
            </h2>
            <OrderHistory orders={orders} loading={loadingOrders} error={error} />
          </div>
        )}
      </main>
    </div>
  );
};

export default UserProfile;
