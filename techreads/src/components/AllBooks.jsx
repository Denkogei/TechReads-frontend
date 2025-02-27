import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

function AllBooks() {
  const [books, setBooks] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    const token = getToken();
    if (!token) {
      console.warn("User is not authenticated, redirecting to login.");
      navigate('/login');
      return;
    }

    let userId;
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.sub || decodedToken.user_id;
      if (!userId) throw new Error("User ID not found in token.");
    } catch (error) {
      console.error("Error decoding token:", error);
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [booksResponse, wishlistResponse, cartResponse] = await Promise.all([
          fetch('http://localhost:5000/books', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:5000/wishlist', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`http://localhost:5000/cart/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (!booksResponse.ok) console.error(`Failed to fetch books: ${booksResponse.status}`);
        if (!wishlistResponse.ok) console.error(`Failed to fetch wishlist: ${wishlistResponse.status}`);
        if (!cartResponse.ok) console.error(`Failed to fetch cart: ${cartResponse.status}`);

        const booksData = await booksResponse.json();
        const wishlistData = await wishlistResponse.json();
        const cartData = await cartResponse.json();

        // Sort books by price
        const sortedBooks = booksData.sort((a, b) => a.price - b.price);

        setBooks(sortedBooks);
        setWishlist(wishlistData.map(item => item.book_id || item.id));
        setCart(cartData.map(item => item.book_id || item.id));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const addToWishlist = async (bookId) => {
    const token = getToken();
    if (!token) return navigate('/login');

    if (wishlist.includes(bookId)) {
      console.log("Book is already in the wishlist, skipping addition.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/wishlist/${bookId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setWishlist((prevWishlist) => [...prevWishlist, bookId]); 
      } else {
        const errorData = await response.json();
        console.error("Failed to add to wishlist:", errorData.message || response.status);
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  const addToCart = async (bookId) => {
    const token = getToken();
    if (!token) return navigate('/login');

    try {
      const quantity = 1;  

      const response = await fetch(`http://localhost:5000/cart/${bookId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity })  
      });

      const text = await response.text();  
      console.log(text);  

      try {
        const data = JSON.parse(text); 
        console.log(data);  

        if (response.ok) {
          setCart((prevCart) => [...prevCart, bookId]);  
          alert(data.message); 
        } else {
          console.error("Failed to add to cart:", data.message || response.status);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }

    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">All Books</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900"></div>
        </div>
      ) : books.length === 0 ? (
        <div className="text-center mt-8 text-xl text-gray-600">No books available at the moment.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="border rounded-lg shadow-md bg-white overflow-hidden transition-transform transform hover:scale-105 cursor-pointer relative"
              onClick={() => navigate(`/books/${book.id}`)}
            >
              <img
                src={book.image_url}
                alt={book.title}
                className="w-full h-80 object-cover"
              />

              <div className="p-5">
                <h2 className="text-lg font-semibold truncate text-gray-900">{book.title}</h2>
                <p className="text-gray-500 text-sm mt-1">By {book.author}</p>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-yellow-500 font-semibold">⭐ {book.rating}</span>
                  <span className="text-green-600 font-bold">Ksh {book.price}</span>
                </div>

                <div className="mt-5 flex justify-between items-center">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
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
                    className="text-red-500 text-2xl"
                  >
                    {wishlist.includes(book.id) ? <FaHeart /> : <FaRegHeart />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllBooks;
