import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AllBooks() {
  const [books, setBooks] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5555/books")
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
    <div>
      <h1>All Books</h1>
      
    </div>
  );
}

export default AllBooks;
