import { FaHeart, FaShoppingCart, FaUser, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Navbar = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <nav className="bg-white shadow-md px-6 flex items-center justify-between h-24">
      
      <div className="flex items-center space-x-6">
        <Link to="/" className="flex items-center space-x-1">
          <span className="text-blue-900 text-4xl">📖</span> 
          <h1 className="text-2xl font-semibold cursor-pointer hover:text-blue-600">
            TechReads
          </h1>
        </Link>
        <Link to="/all-books" className="text-lg font-medium text-blue-600 hover:text-blue-700 transition">
          All Books
        </Link>
      </div>

      <div className="flex items-center space-x-6">
        {isAuthenticated ? (
          <>
            <Link to="/wishlist">
              <FaHeart className="text-2xl text-blue-600 cursor-pointer hover:text-blue-700 transition" />
            </Link>
            <Link to="/cart">
              <FaShoppingCart className="text-2xl text-blue-600 cursor-pointer hover:text-blue-700 transition" />
            </Link>
            <Link to="/profile">
              <FaUser className="text-2xl text-blue-600 cursor-pointer hover:text-blue-700 transition" />
            </Link>
            <Link to="/logout">
              <FaSignOutAlt className="text-2xl text-blue-600 cursor-pointer hover:text-blue-700 transition" />
            </Link>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                Sign In
              </button>
            </Link>
            <Link to="/signup">
              <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
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
