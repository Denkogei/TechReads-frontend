// Navbar.js
import { FaHeart, FaShoppingCart, FaUser, FaSignOutAlt } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useGlobalState } from "./GlobalStateContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPage = location.pathname.startsWith("/admin");
  const { cart, wishlist } = useGlobalState(); 

  const [isUserAuthenticated, setIsUserAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  useEffect(() => {
    const checkAuth = () => {
      setIsUserAuthenticated(!!localStorage.getItem("token"));
    };

    checkAuth(); 
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [location.pathname]); 

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsUserAuthenticated(false);
    navigate("/login");

    setTimeout(() => window.location.reload(), 100); 
  };

  return (
    <nav className="bg-white shadow-md px-6 flex items-center justify-between h-20">
      <div className="flex items-center space-x-3">
        <Link to={isAdminPage ? "/admin" : "/"} className="flex items-center space-x-2">
          <span className="text-3xl">📖</span>
          <h1 className="text-2xl font-semibold text-gray-900 cursor-pointer hover:text-gray-700">
            TechReads
          </h1>
        </Link>
      </div>

      <div className="flex items-center space-x-5">
        {isUserAuthenticated ? (
          <>
            {!isAdminPage && (
              <>
                <Link to="/all-books" className="text-lg font-medium text-gray-800 hover:text-gray-600 transition">
                  All Books
                </Link>
                <Link to="/wishlist" className="flex items-center space-x-2 text-gray-700 hover:text-gray-600 transition">
                  <FaHeart className="text-xl" />
                  <span className="text-sm">Wishlist ({wishlist.length})</span>
                </Link>
                <Link to="/cart" className="flex items-center space-x-2 text-gray-700 hover:text-gray-600 transition">
                  <FaShoppingCart className="text-xl" />
                  <span className="text-sm">Cart ({cart.length})</span>
                </Link>
                <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-gray-600 transition">
                  <FaUser className="text-xl" />
                  <span className="text-sm">Profile & Orders</span>
                </Link>
              </>
            )}
           
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-600 transition"
            >
              <FaSignOutAlt className="text-xl" />
              <span className="text-sm">Logout</span>
            </button>
          </>
        ) : (
          !isAdminPage && (
            <>
              <Link to="/login">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                  Sign In
                </button>
              </Link>
              <Link to="/signup">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                  Sign Up
                </button>
              </Link>
            </>
          )
        )}
      </div>
    </nav>
  );
};

export default Navbar;