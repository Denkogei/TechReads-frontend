import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 

const Cart = () => 
  {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized: No token found.");
      setLoading(false);
      return;
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
      setError("Invalid token: Unable to extract user ID.");
      setLoading(false);
      return;
    }

    fetch(`https://techreads-backend.onrender.com/cart/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setCartItems(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const getUserIdFromToken = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decodedData = JSON.parse(atob(base64));
      return decodedData.user_id || decodedData.sub;
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  };

  const deleteCartItem = (itemId) => {
    const token = localStorage.getItem("token");

    fetch(`https://techreads-backend.onrender.com/cart/${itemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          setCartItems((prevItems) =>
            prevItems.filter((item) => item.id !== itemId)
          );
        } else {
          return response.json().then((data) => {
            throw new Error(data.message || "Error deleting item");
          });
        }
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
        setError(error.message);
      });
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Returns 0 if subtotal >= 5000, else returns 300.
  const getDeliveryFee = (subtotal) => {
    return subtotal >= 5000 ? 0 : 1;
  };

  const moveToWishlist = (item) => {
    const bookId = item.book_id || item.id;
    fetch(`https://techreads-backend.onrender.com/wishlist/${bookId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error moving item to wishlist.");
        }
        // On success, remove the item from the cart.
        deleteCartItem(item.id);
      })
      .catch((error) => console.error("Error adding to wishlist:", error));
  };

  // Global checkout: calculates totals and navigates to the checkout page with all cart items.
  const handleCheckoutAll = () => {
    const subtotal = calculateTotal();
    const deliveryFee = getDeliveryFee(subtotal);
    const finalAmount = subtotal + deliveryFee;
    // Save the final amount in localStorage if needed.
    localStorage.setItem("finalAmount", finalAmount);
    navigate("/checkout", {
      state: {
        cartItems: cartItems,
        subtotal,
        deliveryFee,
        finalAmount,
      },
    });
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Shopping Cart
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-xl rounded-xl border border-gray-300">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="p-4 text-center font-semibold text-gray-700">
                  Image
                </th>
                <th className="p-4 text-left font-semibold text-gray-700">
                  Book Name
                </th>
                <th className="p-4 text-center font-semibold text-gray-700">
                  Price
                </th>
                <th className="p-4 text-center font-semibold text-gray-700">
                  Quantity
                </th>
                <th className="p-4 text-center font-semibold text-gray-700">
                  Subtotal
                </th>
                <th className="p-4 text-center font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr
                  key={item.id}
                  className={`border-b border-gray-200 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition`}
                >
                  <td className="p-4 text-center">
                    <img
                      src={item.image_url}
                      alt={item.book_title}
                      className="w-16 h-16 rounded-md shadow-md"
                    />
                  </td>
                  <td className="p-4 text-left text-gray-800 font-medium">
                    {item.book_title || item.title || item.name || "No Title"}
                  </td>
                  <td className="p-4 text-center text-gray-600">
                    Ksh {item.price}
                  </td>
                  <td className="p-4 text-center text-gray-600">
                    {item.quantity}
                  </td>
                  <td className="p-4 text-center text-gray-800 font-semibold">
                    Ksh {item.price * item.quantity}
                  </td>
                  <td className="p-4 flex flex-col items-center gap-2">
                    <button
                      className="w-32 bg-red-600 text-white py-2 text-sm rounded-lg shadow-md hover:bg-red-700 transition"
                      onClick={() => deleteCartItem(item.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="w-32 bg-yellow-500 text-white py-2 text-sm rounded-lg shadow-md hover:bg-yellow-600 transition"
                      onClick={() => moveToWishlist(item)}
                    >
                      Move to Wishlist
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right mt-6">
            {(() => {
              const subtotal = calculateTotal();
              const deliveryFee = getDeliveryFee(subtotal);
              const total = subtotal + deliveryFee;
              return (
                <>
                  <p className="text-lg text-gray-600">
                    Subtotal: Ksh {subtotal}
                  </p>
                  <p className="text-lg text-gray-600">
                    Delivery Fee: Ksh {deliveryFee}
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    Total: Ksh {total}
                  </p>
                </>
              );
            })()}
          </div>
          <div className="text-right mt-4">
            <button
              className="w-40 bg-blue-600 text-white py-3 rounded-lg shadow-lg hover:bg-blue-700 transition"
              onClick={handleCheckoutAll}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
