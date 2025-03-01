import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";

const Home = () => {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [priceRange, setPriceRange] = useState(3500);

  const categories = [
    "Programming",
    "Software Architecture",
    "Web Development",
    "Data Science",
    "Artificial Intelligence",
    "Cybersecurity",
    "DevOps",
  ];

  const sortOptions = [
    "Popularity",
    "Price: Low to High",
    "Price: High to Low",
  ];

  // Fetch books from Flask API
  useEffect(() => {
    fetch("http://localhost:5000/books", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  // Sorting logic
  const sortedBooks = [...books].sort((a, b) => {
    if (sortBy === "Price: Low to High") return a.price - b.price;
    if (sortBy === "Price: High to Low") return b.price - a.price;
    return 0;
  });

  return (
    <div className="bg-gray-100 min-h-screen px-6 py-10">
      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search for books..."
          className="w-full max-w-xl px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Featured Books Section */}
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900">Featured Books</h2>
        <p className="text-blue-600 mt-2">
          Discover the latest and most popular tech books
        </p>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 mt-6">
        {/* Filters Sidebar */}
        <div className="bg-white p-6 shadow-md rounded-lg w-full md:w-1/4">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>
          <label className="block text-sm font-medium">Category</label>
          <select
            className="w-full border rounded-lg px-3 py-2 mb-4"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>

          <label className="block text-sm font-medium">Price Range</label>
          <p className="text-gray-700 mb-1">KSh 3,500 - 10,000</p>
          <input
            type="range"
            className="w-full mb-4"
            min="3500"
            max="10000"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          />

          <label className="block text-sm font-medium">Sort By</label>
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {sortOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Books List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {sortedBooks.slice(0, 3).map((book) => (
            <div key={book.id} className="bg-white p-4 rounded-lg shadow-md">
              <img
                src={book.image_url}
                alt={book.title}
                className="h-40 w-full object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold">{book.title}</h3>
              <p className="text-sm text-gray-600">{book.author}</p>
              <p className="text-blue-600 font-bold">
                KSh {book.price.toLocaleString()}
              </p>
              <button
                className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate("/login"); // Redirect to login if not authenticated
                  } else {
                    console.log(`Added ${book.title} to cart`);
                    // Implement add to cart logic here
                  }
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
