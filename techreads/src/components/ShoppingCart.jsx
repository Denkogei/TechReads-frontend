import React from 'react'

const ShoppingCart = () => {
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
  return (
    <div>ShoppingCart</div>
  )
}

export default ShoppingCart