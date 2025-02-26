import { useState, useEffect } from "react";
import { FaHistory } from "react-icons/fa";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [orders] = useState([
    { id: 1, status: "Pending", date: "2025-02-15" },
    { id: 2, status: "Shipped", date: "2025-02-10" },
    { id: 3, status: "Delivered", date: "2025-02-05" },
  ]);

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/5 bg-white shadow-lg p-6 flex flex-col space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
        <nav className="space-y-4">
          <Link to="#" className="flex items-center space-x-3 text-gray-700 hover:text-blue-600">
            <FaHistory className="text-lg" />
            <span>Order History</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center mt-10">
        {/* Profile Card */}
        <div className="w-full max-w-3xl p-10 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl shadow-lg">
          <div>
            <h2 className="text-3xl font-bold">{user.name}</h2>
            <p className="text-lg">{user.email}</p>
          </div>
        </div>

        {/* Order History */}
        <div className="w-full max-w-3xl mt-8 p-6 bg-white shadow-lg rounded-2xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order History</h2>
          <ul className="space-y-4">
            {orders.map((order) => (
              <li key={order.id} className="p-4 rounded-lg flex justify-between items-center shadow-md border">
                <p className="text-gray-700 font-medium">Order #{order.id}</p>
                <p className="text-sm text-gray-500">{order.date}</p>
                <span
                  className={`px-3 py-1 rounded-full text-white text-sm ${
                    order.status === "Pending" ? "bg-yellow-500" :
                    order.status === "Shipped" ? "bg-blue-500" :
                    "bg-green-500"
                  }`}
                >
                  {order.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
