import { FaHeart, FaShoppingCart, FaUser, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { user: auth0User, isAuthenticated: isAuth0Authenticated, logout } = useAuth0();
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsUserAuthenticated(!!token || isAuth0Authenticated);
  }, [isAuth0Authenticated]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (isAuth0Authenticated) {
      logout({ logoutParams: { returnTo: window.location.origin } });
    }
    setIsUserAuthenticated(false);
  };

  return (
    <nav className="bg-white shadow-md px-6 flex items-center justify-between h-20">
      <div className="flex items-center space-x-3">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-3xl">📖</span>
          <h1 className="text-2xl font-semibold text-gray-900 cursor-pointer hover:text-gray-700">
            TechReads
          </h1>
        </Link>

        {isUserAuthenticated && (
          <Link to="/all-books" className="text-lg font-medium text-gray-800 hover:text-gray-600 transition ml-6">
            All Books
          </Link>
        )}
      </div>

      <div className="flex items-center space-x-5">
        {isUserAuthenticated ? (
          <>
            <Link to="/wishlist" className="flex items-center space-x-2 text-gray-700 hover:text-gray-600 transition">
              <FaHeart className="text-xl" />
              <span className="text-sm">Wishlist</span>
            </Link>
            <Link to="/cart" className="flex items-center space-x-2 text-gray-700 hover:text-gray-600 transition">
              <FaShoppingCart className="text-xl" />
              <span className="text-sm">Cart</span>
            </Link>
            <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-gray-600 transition">
              <FaUser className="text-xl" />
              <span className="text-sm">Profile</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-600 transition"
            >
              <FaSignOutAlt className="text-xl" />
              <span className="text-sm">Logout</span>
            </button>
          </>
        ) : (
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
        )}
      </div>
    </nav>
  );
};

export default Navbar;