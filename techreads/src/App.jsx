import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import Navbar from "./components/Navbar";
import ShoppingCart from "./components/ShoppingCart";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Homepage from "./components/Homepage";
import BookDetails from "./components/BookDetails";
import WishList from "./components/WishList";
import Checkout from "./components/Checkout";
import UserProfile from "./components/UserProfile";
import OrderHistory from "./components/OrderHistory";
import Logout from "./components/Logout";
import Categories from "./components/Categories";
import AllBooks from "./components/AllBooks";
import ProtectedRoute from "./components/ProtectedRoute";

const domain = "dev-yp43fewqn4xgjq06.us.auth0.com";
const clientId = "ODsajv0GFDnBM8IPowpYz9aTLgJ3UYkP";

function App() {
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{ redirect_uri: window.location.origin }}
      cacheLocation="localstorage" 
      useRefreshTokens={true}       
    >
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/cart" element={<ShoppingCart />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/wishlist" element={<WishList />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/logout" element={<Logout />} />

          
         

          {/* 🔒 Protect sensitive routes */}
          <Route path="/all-books" element={<ProtectedRoute><AllBooks /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
        </Routes>
      </Router>
    </Auth0Provider>
  );
}

export default App;
