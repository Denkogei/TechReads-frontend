import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const normalizeString = (str) => (str || '').trim().toLowerCase();

function AllBooks() {
  const [books, setBooks] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('Popularity');
  const [availableCategories, setAvailableCategories] = useState([]);

  const baseCategories = [
    "Programming",
    "JavaScript",
    "Web Development",
    "Software Architecture",
    "Data Science",
    "Artificial Intelligence",
    "Cybersecurity",
    "DevOps"
  ];

  const sortOptions = ["Popularity", "Price: Low to High", "Price: High to Low"];

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    let userId;
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.sub || decodedToken.user_id;
      if (!userId) throw new Error("User ID not found in token.");
    } catch (error) {
      console.error("Error decoding token:", error);
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [booksResponse, wishlistResponse, cartResponse] = await Promise.all([
          fetch("https://techreads-backend.onrender.com/books", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://techreads-backend.onrender.com/wishlist", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`https://techreads-backend.onrender.com/cart/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!booksResponse.ok) throw new Error("Failed to fetch books");
        if (!wishlistResponse.ok) throw new Error("Failed to fetch wishlist");
        if (!cartResponse.ok) throw new Error("Failed to fetch cart");

        const booksData = await booksResponse.json();
        const wishlistData = await wishlistResponse.json();
        const cartData = await cartResponse.json();

        // Calculate dynamic price range
        const prices = booksData.map(book => book.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        // Extract categories
        const bookCategories = [
          ...new Set(
            booksData.flatMap(book => 
              (book.category || 'Uncategorized')
                .split(',')
                .map(c => normalizeString(c))
            )
          )
        ].filter(c => c);

        const mergedCategories = [
          ...new Set([...baseCategories, ...bookCategories])
        ].sort();

        setBooks(booksData);
        setAvailableCategories(mergedCategories);
        setPriceRange([minPrice, maxPrice]);
        setWishlist(wishlistData.map((item) => item.book_id || item.id));
        setCart(cartData.map((item) => item.book_id || item.id));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    setPriceRange([priceRange[0], value]);
  };

  const handleSortChange = (option) => {
    setSortBy(option);
  };

  const filteredBooks = books
    .filter(book => {
      const bookCategories = (book.category || 'Uncategorized')
        .split(',')
        .map(c => normalizeString(c));
      
      const selected = selectedCategories.map(normalizeString);
      const priceMatch = book.price >= priceRange[0] && book.price <= priceRange[1];
      
      const searchTerms = normalizeString(searchTerm)
        .split(/\s+/)
        .filter(term => term.length > 0);
      
      const searchMatch = searchTerms.length === 0 || 
        searchTerms.every(term => 
          normalizeString(book.title).includes(term)
        );

      return (
        (selected.length === 0 || selected.some(cat => 
          bookCategories.some(bc => bc.includes(cat))
        )) && 
        priceMatch && 
        searchMatch
      );
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'Price: Low to High': 
          return a.price - b.price;
        case 'Price: High to Low': 
          return b.price - a.price;
        case 'Popularity':
        default: 
          const searchTerms = normalizeString(searchTerm).split(/\s+/);
          const aMatches = searchTerms.filter(term => 
            normalizeString(a.title).includes(term)).length;
          const bMatches = searchTerms.filter(term => 
            normalizeString(b.title).includes(term)).length;
          
          return bMatches - aMatches || b.price - a.price;
      }
    });

  const addToWishlist = async (bookId) => {
    const token = getToken();
    if (!token) return navigate("/login");

    if (wishlist.includes(bookId)) return;

    try {
      const response = await fetch(`https://techreads-backend.onrender.com/wishlist/${bookId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setWishlist(prev => [...prev, bookId]);
        toast.success("Added to wishlist successfully!");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add to wishlist.");
    }
  };

  const addToCart = async (bookId) => {
    const token = getToken();
    if (!token) return navigate("/login");

    try {
      const response = await fetch(`https://techreads-backend.onrender.com/cart/${bookId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: 1 }),
      });

      const data = await response.json();
      if (response.ok) {
        setCart(prev => [...prev, bookId]);
        toast.success("Added to cart successfully!");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className="w-full md:w-64 bg-white md:bg-gray-50 p-4 md:mr-6 mb-6 md:mb-0 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Filters</h3>

        <div className="mb-6">
          <h4 className="text-sm font-medium mb-3 text-gray-600">Categories</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {availableCategories.map((category) => (
              <label 
                key={category} 
                className="flex items-center space-x-2 text-gray-700 hover:bg-gray-50 p-2 rounded cursor-pointer"
              >
                <input 
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm capitalize">{category}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium mb-3 text-gray-600">Price Range</h4>
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-500">
              <span>KSh {priceRange[0].toLocaleString()}</span>
              <span>KSh {priceRange[1].toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={priceRange[0]}
              max={priceRange[1]}
              value={priceRange[1]}
              onChange={handlePriceChange}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium mb-3 text-gray-600">Sort By</h4>
          <div className="space-y-2">
            {sortOptions.map((option) => (
              <label
                key={option}
                className="flex items-center space-x-2 text-gray-700 hover:bg-gray-50 p-2 rounded cursor-pointer"
              >
                <input
                  type="radio"
                  name="sort"
                  checked={sortBy === option}
                  onChange={() => handleSortChange(option)}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="mb-8 px-4">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">All Books</h1>
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Search book titles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-96 px-4 py-3 text-base border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center mt-8 text-lg text-gray-600">
            No books match the current filters
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="relative bg-white border border-gray-100 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 ease-out cursor-pointer"
                onClick={() => navigate(`/books/${book.id}`)}
              >
                <div className="h-72 w-full flex items-center justify-center bg-gray-50 rounded-t-xl overflow-hidden">
                  <img
                    src={book.image_url}
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-5">
                  <h2 className="font-semibold text-gray-900 text-lg line-clamp-1 mb-2">
                    {book.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    By {book.author} • {(book.category || 'Programming').split(',')[0]}
                  </p>

                  <div className="flex justify-between items-center gap-3">
                    <span className="text-lg font-bold text-blue-600">
                      Ksh {book.price?.toLocaleString() || '0'}
                    </span>
                    <div className="flex gap-3">
                      <button
                        className="py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(book.id);
                        }}
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToWishlist(book.id);
                        }}
                        className="p-2 flex items-center justify-center text-red-500 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {wishlist.includes(book.id) ? (
                          <FaHeart className="text-xl" />
                        ) : (
                          <FaRegHeart className="text-xl" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AllBooks;