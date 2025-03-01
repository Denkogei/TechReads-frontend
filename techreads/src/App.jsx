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
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/wishlist" element={<WishList />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/all-books" element={<AllBooks />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/orders" element={<OrderHistory />} />
        </Routes>
      </Router>
    </Auth0Provider>
  );
}

export default App;