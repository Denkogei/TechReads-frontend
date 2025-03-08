import { Link, useNavigate } from "react-router-dom";
import { FaBook, FaClipboardList, FaChartLine, FaSignOutAlt, FaTachometerAlt, FaUserShield } from "react-icons/fa";
import { useState } from "react";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  return (
    <aside className={`w-64 bg-white p-6 flex flex-col justify-between transition-transform transform ${sidebarOpen ? "translate-x-0" : "-translate-x-64"} lg:translate-x-0 fixed lg:static h-full z-50`}>
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <FaUserShield className="text-blue-500 text-2xl" />
          <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
        </div>
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
     
    </aside>
  );
};

export default Sidebar;
