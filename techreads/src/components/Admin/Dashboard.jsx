import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import { FaBars, FaShoppingBag, FaChartLine } from "react-icons/fa";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const salesData = [
    { month: "Jan", revenue: 4000 },
    { month: "Feb", revenue: 3000 },
    { month: "Mar", revenue: 5000 },
    { month: "Apr", revenue: 7000 },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`w-64 bg-white p-4 shadow-md ${sidebarOpen ? "block" : "hidden"} lg:block`}>
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <nav>
          <ul>
            <li className="p-2 hover:bg-gray-200 rounded cursor-pointer">
              <Link to="/admin/dashboard">Dashboard</Link>
            </li>
            <li className="p-2 hover:bg-gray-200 rounded cursor-pointer">
              <Link to="/admin/books">Books</Link>
            </li>
            <li className="p-2 hover:bg-gray-200 rounded cursor-pointer">
              <Link to="/admin/orders">Orders</Link>
            </li>
            <li className="p-2 hover:bg-gray-200 rounded cursor-pointer">
              <Link to="/admin/reports">Reports</Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FaBars className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="text-sm text-gray-600">Admin</div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow flex items-center">
            <FaShoppingBag className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <p className="text-lg font-semibold">150</p>
              <p className="text-sm text-gray-600">Total Books</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow flex items-center">
            <FaShoppingBag className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <p className="text-lg font-semibold">75</p>
              <p className="text-sm text-gray-600">Orders</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow flex items-center">
            <FaChartLine className="w-8 h-8 text-red-500 mr-3" />
            <div>
              <p className="text-lg font-semibold">Ksh 500,000</p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Sales Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
