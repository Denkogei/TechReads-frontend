import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaBook, FaClipboardList, FaChartLine, FaSignOutAlt, FaTachometerAlt, FaUserShield, FaUserCircle } from "react-icons/fa";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const salesData = [
    { month: "Jan", revenue: 4000 },
    { month: "Feb", revenue: 3000 },
    { month: "Mar", revenue: 5000 },
    { month: "Apr", revenue: 7000 },
    { month: "May", revenue: 6000 },
    { month: "Jun", revenue: 8000 },
    { month: "Jul", revenue: 7500 },
    { month: "Aug", revenue: 7200 },
    { month: "Sep", revenue: 6800 },
    { month: "Oct", revenue: 7900 },
    { month: "Nov", revenue: 8500 },
    { month: "Dec", revenue: 9000 },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload(); // Refresh page to reflect logout
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className={`w-64 bg-white p-6 flex flex-col justify-between transition-transform transform ${sidebarOpen ? "translate-x-0" : "-translate-x-64"} lg:translate-x-0 fixed lg:static h-full z-50`}>
        <div>
          {/* Admin Panel Title with Icon */}
          <div className="flex items-center space-x-3 mb-6">
            <FaUserShield className="text-blue-500 text-2xl" />
            <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
          </div>

          {/* Navigation */}
          <nav>
            <ul className="space-y-4">
              <li className="p-3 flex items-center space-x-3 rounded-lg cursor-pointer hover:bg-gray-200 transition">
                <FaTachometerAlt className="text-blue-500" />
                <Link to="/admin">Dashboard</Link>
              </li>
              <li className="p-3 flex items-center space-x-3 rounded-lg cursor-pointer hover:bg-gray-200 transition">
                <FaBook className="text-green-500" />
                <Link to="/admin/books">Books</Link>
              </li>
              <li className="p-3 flex items-center space-x-3 rounded-lg cursor-pointer hover:bg-gray-200 transition">
                <FaClipboardList className="text-orange-500" />
                <Link to="/admin/orders">Orders</Link>
              </li>
              <li className="p-3 flex items-center space-x-3 rounded-lg cursor-pointer hover:bg-gray-200 transition">
                <FaChartLine className="text-red-500" />
                <Link to="/admin/reports">Reports</Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="p-3 flex items-center justify-center bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          <FaSignOutAlt className="text-xl mr-2" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg">
          <button className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FaBars className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

          {/* Admin with Icon */}
          <div className="flex items-center space-x-2 text-gray-600 text-lg font-semibold">
            <FaUserCircle className="text-blue-500 text-2xl" />
            <span>Admin</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg flex items-center space-x-4">
            <FaBook className="w-10 h-10 text-blue-500" />
            <div>
              <p className="text-2xl font-semibold">150</p>
              <p className="text-gray-600">Total Books</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg flex items-center space-x-4">
            <FaClipboardList className="w-10 h-10 text-green-500" />
            <div>
              <p className="text-2xl font-semibold">75</p>
              <p className="text-gray-600">Orders</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg flex items-center space-x-4">
            <FaChartLine className="w-10 h-10 text-red-500" />
            <div>
              <p className="text-2xl font-semibold">Ksh 500,000</p>
              <p className="text-gray-600">Total Revenue</p>
            </div>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="bg-white p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Sales Overview</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="month" stroke="#4b5563" />
              <YAxis stroke="#4b5563" />
              <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "5px" }} />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
