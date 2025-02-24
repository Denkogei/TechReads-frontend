import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

const Home = () => {
  const { isAuthenticated } = useAuth0();
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
    "Ratings",
  ];

  // Sample book data with decimal ratings
  const books = [
    {
      id: 1,
      title: "JavaScript Basics",
      author: "John Doe",
      price: 4500,
      rating: 4.2,
    },
    {
      id: 2,
      title: "React Mastery",
      author: "Jane Smith",
      price: 5500,
      rating: 4.8,
    },
    {
      id: 3,
      title: "Data Science for Beginners",
      author: "Alice Brown",
      price: 3500,
      rating: 3.9,
    },
  ];

  // Sorting logic
  const sortedBooks = [...books].sort((a, b) => {
    if (sortBy === "Price: Low to High") return a.price - b.price;
    if (sortBy === "Price: High to Low") return b.price - a.price;
    if (sortBy === "Ratings") return b.rating - a.rating;
    return 0;
  });

  // Function to render stars with numeric rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? "★" : "";
    return (
      <span className="text-yellow-500 font-semibold">
        {rating.toFixed(1)} {"★".repeat(fullStars)}
        {halfStar}
        {"☆".repeat(5 - fullStars - (halfStar ? 1 : 0))}
      </span>
    );
  };

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

          {/* Categories Dropdown */}
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

          {/* Price Range */}
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

          {/* Sort By Dropdown */}
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
          {sortedBooks.map((book) => (
            <div key={book.id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="h-40 bg-gray-300 rounded-md mb-4"></div>
              <h3 className="text-lg font-semibold">{book.title}</h3>
              <p className="text-sm text-gray-600">{book.author}</p>
              <p>{renderStars(book.rating)}</p>
              <p className="text-blue-600 font-bold">
                KSh {book.price.toLocaleString()}
              </p>
              <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700">
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
