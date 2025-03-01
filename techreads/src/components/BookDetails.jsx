import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:5000/books/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch book details");
        }
        return response.json();
      })
      .then((data) => {
        setBook(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching book:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [id, token, navigate]);

  const addToCart = async () => {
    try {
      const response = await fetch(`http://localhost:5000/cart/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: 1 }),
      });

      if (response.ok) {
        alert("Book added to cart!");
        setIsInCart(true);
      } else {
        const data = await response.json();
        console.error("Failed to add to cart:", data.message);
        alert("Failed to add to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Error adding book to cart.");
    }
  };

  const handleWishlist = async () => {
    try {
      const response = await fetch(`http://localhost:5000/wishlist/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.message === "Book already in Wishlist") {
        alert("This book is already in your wishlist!");
      } else {
        alert("Book added to wishlist!");
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      alert("Failed to update wishlist.");
    }
  };

  if (loading)
    return <p className="text-center mt-8">Loading book details...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
      <img
        src={book.image_url}
        alt={book.title}
        className="w-full h-96 object-cover rounded-md mb-4"
      />
      <p className="text-gray-700">By {book.author}</p>
      <p className="text-gray-500 mt-2">
        Price:{" "}
        <span className="font-semibold text-green-600">Ksh {book.price}</span>
      </p>
      <p className="text-gray-600 mt-2">Rating: ⭐ {book.rating}</p>
      <p className="text-gray-700 mt-4">{book.description}</p>
      <div className="flex gap-4 mt-6">
        <button
          onClick={addToCart}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          disabled={isInCart}
        >
          {isInCart ? "Added to Cart" : "Add to Cart"}
        </button>
        <button onClick={handleWishlist} className="text-red-500 text-2xl">
          {isWishlisted ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>
    </div>
  );
}

export default BookDetails;
