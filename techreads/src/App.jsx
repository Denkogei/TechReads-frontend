import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
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
import Dashboard from "./components/Admin/Dashboard";

function AppLayout() {
  const location = useLocation();

  return (
    <>
      {/* Always show Navbar, regardless of admin or user */}
      <Navbar />  

      <Routes>
        {/* User Routes */}
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

        {/* Admin Routes */}
        <Route path="/admin" element={<Dashboard />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
