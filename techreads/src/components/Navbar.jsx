import { FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom"; 

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 flex items-center justify-between h-24">
      
    
      <div className="flex items-center space-x-4">
        <Link to="/" className="flex items-center space-x-1">
          <span className="text-blue-900 text-4xl">📖</span> 
          <h1 className="text-2xl font-semibold cursor-pointer hover:text-blue-600">TechReads</h1>
        </Link>
        <Link to="/books" className="text-lg font-medium hover:text-blue-600">All Books</Link>
      </div>

      
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search books..."
          className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <FaHeart className="text-2xl cursor-pointer hover:text-black" />
        <FaShoppingCart className="text-2xl cursor-pointer hover:text-black" />
        <FaUser className="text-2xl cursor-pointer hover:text-black" />
      </div>
    </nav>
  );
};

export default Navbar;
