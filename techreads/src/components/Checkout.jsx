import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import mpesaLogo from "../assets/mpesa-logo.png";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedProduct, cartItems, finalAmount } = location.state || {};

  const [deliveryDetails, setDeliveryDetails] = useState({
    amount: "",
    phone_number: "",
    email: "",
    address: "",
  });
  const [isValid, setIsValid] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (finalAmount !== undefined) {
      setTotalAmount(finalAmount);
    } else if (selectedProduct) {
      setTotalAmount(selectedProduct.price * (selectedProduct.quantity || 1));
    } else if (cartItems?.length) {
      const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
      const deliveryFee = subtotal >= 5000 ? 0 : 300;
      setTotalAmount(subtotal + deliveryFee);
    }
  }, [selectedProduct, cartItems, finalAmount]);

  useEffect(() => {
    if (paymentSuccess) {
      const timer = setTimeout(() => {
        navigate("/all-books");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [paymentSuccess, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryDetails((prev) => ({ ...prev, [name]: value }));

    if (name === "phone_number") {
      const safaricomRegex = /^(?:\+254|254|0)7\d{8}$/;
      setIsValid(safaricomRegex.test(value.trim()));
    }
  };

  const handlePlaceOrder = async () => {
    if (!isValid || !deliveryDetails.name) {
        alert("Please fill in all required fields correctly.");
        return;
    }

    setIsProcessing(true);

    try {
        const response = await fetch("https://techreads-backend.onrender.com/mpesa/stkpush", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                phone_number: deliveryDetails.phone_number.startsWith("254")
                    ? deliveryDetails.phone_number
                    : "254" + deliveryDetails.phone_number.slice(1),
                amount: totalAmount,
                order_id: Date.now().toString(),
            }),
        });

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            if (data.error) {
                alert("Payment failed: " + data.error);
            } else {
                setPaymentSuccess(true);
            }
        } else {
            const textData = await response.text();
            alert("Received non-JSON response: " + textData);
        }
    } catch (error) {
        console.error("Payment error:", error);
        alert("An error occurred while processing your order.");
    } finally {
        setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-8 bg-white shadow-lg rounded-2xl border border-green-200 text-center">
        <div className="text-green-600 text-6xl mb-4 animate-bounce">✓</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Order Placed Successfully!
        </h2>
        <p className="text-gray-600 mb-6">
          Redirecting to all books...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-white shadow-lg rounded-2xl border border-gray-200">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-gray-700 hover:text-gray-900 transition"
      >
        <span className="mr-2 text-xl">&#8592;</span> Back
      </button>

      <h2 className="text-3xl font-bold text-gray-800 flex justify-between">
        Checkout <span className="text-green-600">KES {totalAmount}</span>
      </h2>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-100 p-6 rounded-xl mt-6 flex items-center justify-center"
      >
        <img src={mpesaLogo} alt="Lipa na M-Pesa" className="w-32" />
      </motion.div>

      <div className="bg-gray-100 p-6 rounded-xl mt-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Billing Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: " Name", name: "name", type: "text", placeholder: "John Doe" },
            { label: "Phone Number", name: "phone_number", type: "text", placeholder: "07XX XXX XXX" },
            { label: "Email", name: "email", type: "email", placeholder: "example@mail.com" },
            { label: "Delivery Address", name: "address", type: "text", placeholder: "1234 Street, City" },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-600">{label} *</label>
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={deliveryDetails[name]}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={!isValid || isProcessing}
        className={`w-full mt-6 py-3 rounded-lg text-white font-semibold transition-all duration-300 ${
          isValid ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
        } flex items-center justify-center`}
      >
        {isProcessing ? (
          <span className="animate-spin mr-2">⏳</span>
        ) : (
          "Place Order"
        )}
      </button>
    </div>
  );
};

export default Checkout;