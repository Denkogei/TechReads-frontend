import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import mpesaLogo from "../assets/mpesa-logo.png";

const Checkout = () => {
  const location = useLocation();
  // Destructure properties from router state:
  // - finalAmount is passed from the Cart component (subtotal + delivery fee)
  // - selectedProduct is for a single product checkout, and cartItems for a cart checkout.
  const { selectedProduct, cartItems, finalAmount } = location.state || {};
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (finalAmount !== undefined) {
      // Use the finalAmount passed from Cart (includes delivery fee)
      setTotalAmount(finalAmount);
    } else if (selectedProduct) {
      // For single product checkout: price * quantity (defaulting quantity to 1 if missing)
      setTotalAmount(selectedProduct.price * (selectedProduct.quantity || 1));
    } else if (cartItems && cartItems.length) {
      // For cart checkout: calculate subtotal then add a delivery fee (0 if subtotal >= 5000, else 300)
      const calculateSubtotal = () =>
        cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
      const subtotal = calculateSubtotal();
      const deliveryFee = subtotal >= 5000 ? 0 : 300;
      setTotalAmount(subtotal + deliveryFee);
    } else {
      // Default to 0 if no data is provided.
      setTotalAmount(0);
    }
  }, [selectedProduct, cartItems, finalAmount]);

  const handlePhoneChange = (e) => {
    const input = e.target.value;
    setPhoneNumber(input);
    // Validate Safaricom phone number format: supports formats with or without country code.
    const safaricomRegex = /^(?:254|0)?7[0-9]{8}$/;
    setIsValid(safaricomRegex.test(input));
  };

  const handlePlaceOrder = () => {
    if (!isValid) return;
    alert(`Order placed for KES ${totalAmount} with phone: ${phoneNumber}`);
    // Here you can add additional logic to process the payment
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-2xl p-8 rounded-2xl border border-gray-200 mt-12">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 text-black text-2xl font-bold flex items-center hover:underline"
      >
        <span className="mr-3">&#8592;</span> Back
      </button>

      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex justify-between">
        Checkout <span className="text-green-600">KES {totalAmount}</span>
      </h2>

      <div className="bg-gray-100 p-6 rounded-xl mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Payment Method</h3>
        <img src={mpesaLogo} alt="Lipa na M-Pesa" className="w-48 mx-auto" />
      </div>

      <div className="bg-gray-100 p-6 rounded-xl mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Billing Details</h3>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Phone Number *
        </label>
        <input
          type="text"
          placeholder="07712 345 678"
          value={phoneNumber}
          onChange={handlePhoneChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
        />
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={!isValid}
        className={`w-full py-3 rounded-lg text-white font-semibold transition-colors duration-300 shadow-md ${
          isValid
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Place Order
      </button>
    </div>
  );
};

export default Checkout;
