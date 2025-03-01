import React, { useEffect, useState } from "react";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    fetch(`http://localhost:5000/cart/${userId}`, {
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

    fetch(`http://localhost:5000/cart/${itemId}`, {
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

  const getDeliveryFee = () => {
    return calculateTotal() > 5000 ? 0 : 300;
  };

  const moveToWishlist = (item) => {
    fetch("http://localhost:5000/wishlist", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    })
      .then(() => deleteCartItem(item.id))
      .catch((error) => console.error("Error adding to wishlist:", error));
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
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
          <table className="min-w-full bg-white shadow-lg rounded-lg border border-gray-200">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="p-4 text-left font-semibold text-gray-700">
                  Product
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
                  <td className="p-4 flex items-center gap-4">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-16 h-16 rounded-md shadow-md"
                    />
                    <span className="text-gray-800 font-medium">
                      {item.name}
                    </span>
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
                    <button className="w-28 bg-blue-600 text-white py-2 text-sm rounded-lg shadow-md hover:bg-blue-700 transition">
                      Checkout
                    </button>
                    <button
                      className="w-28 bg-red-600 text-white py-2 text-sm rounded-lg shadow-md hover:bg-red-700 transition"
                      onClick={() => deleteCartItem(item.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="w-28 bg-yellow-500 text-white py-2 text-sm rounded-lg shadow-md hover:bg-yellow-600 transition"
                      onClick={() => moveToWishlist(item)}
                    >
                      Move to Wishlist
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right mt-4">
            <p className="text-xl font-bold text-gray-800">
              Total: Ksh {calculateTotal()}
            </p>
            <p className="text-lg text-gray-600">
              Estimated Delivery Fee: Ksh {getDeliveryFee()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
