import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AllBooks() {
  const [books, setBooks] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/books")
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  const handleAddToCart = (book) => {
    console.log(`Added ${book.title} to cart`);
  };

  const toggleWishlist = (bookId) => {
    setWishlist((prevWishlist) =>
      prevWishlist.includes(bookId)
        ? prevWishlist.filter((id) => id !== bookId)
        : [...prevWishlist, bookId]
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">All Books</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {books.map((book) => (
          <div
            key={book.id}
            className="border rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105 cursor-pointer"
            onClick={() => navigate(`/books/${book.id}`)}
          >
            <img
              src={book.image_url}
              alt={book.title}
              className="w-full h-72 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold truncate">{book.title}</h2>
              <p className="text-gray-500 text-sm">By {book.author}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-green-600 text-lg font-semibold">
                  Ksh {book.price}
                </span>
              </div>
              <div
                className="flex justify-between items-center mt-4"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  onClick={() => handleAddToCart(book)}
                >
                  Add to Cart
                </button>
                <button
                  className="text-2xl"
                  onClick={() => toggleWishlist(book.id)}
                >
                  {wishlist.includes(book.id) ? "❤️" : "🤍"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllBooks;
