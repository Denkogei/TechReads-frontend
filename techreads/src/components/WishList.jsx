import React, { useEffect, useState } from "react";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Unauthorized: Please log in.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/wishlist", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 401) throw new Error("Unauthorized: Please log in.");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setWishlist(data);
        } else {
          throw new Error("Unexpected API response format");
        }
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  // Remove item from wishlist
  const removeItem = (id) => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:5000/wishlist/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to remove item.");
        setWishlist(wishlist.filter((item) => item.id !== id));
      })
      .catch((error) => setError(error.message));
  };

  // Add book to cart
  const addToCart = async (item) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Unauthorized: Please log in.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/cart/${item.book_id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: 1 }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message || "Book added to cart!");
      } else {
        const data = await response.json();
        alert(data.message || "Failed to add book to cart.");
      }
    } catch (error) {
      setError("Error adding book to cart.");
      console.error("Error adding book to cart:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-xl font-semibold text-center text-gray-800 mb-3">
        My Wishlist
      </h2>

      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && wishlist.length === 0 && !error && (
        <p className="text-center text-gray-600">No items in your wishlist.</p>
      )}

      {!loading && wishlist.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-md">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-sm">
                <th className="py-2 px-3 border">Image</th>
                <th className="py-2 px-3 border">Book Name</th>
                <th className="py-2 px-3 border">Price</th>
                <th className="py-2 px-3 border">Stock</th>
                <th className="py-2 px-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {wishlist.map((item) => (
                <tr key={item.id} className="text-center border-t text-sm">
                  <td className="py-2 px-3 border">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-12 h-12 object-cover mx-auto rounded"
                    />
                  </td>
                  <td className="py-2 px-3 border">{item.title}</td>
                  <td className="py-2 px-3 border">Ksh {item.price}</td>
                  <td className="py-2 px-3 border">{item.stock}</td>
                  <td className="py-2 px-3 border flex flex-col items-center space-y-2">
                    <button
                      className="w-28 bg-blue-600 text-white py-2 text-sm rounded-lg shadow-md hover:bg-blue-700 transition"
                      onClick={() => addToCart(item)}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="w-28 bg-red-600 text-white py-2 text-sm rounded-lg shadow-md hover:bg-red-700 transition"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
