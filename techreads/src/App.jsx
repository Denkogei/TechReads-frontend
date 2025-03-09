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
import AllBooks from "./components/AllBooks";
import Dashboard from "./components/Admin/Dashboard";
import BookManagement from "./components/Admin/BooksManagment";
import Footer from "./components/Footer";
import Orders from "./components/Admin/Orders";
import { GlobalStateProvider } from "./components/GlobalStateContext";
import Reports from "./components/Admin/Reports";

function AppLayout() {
  const location = useLocation(); // This will work because AppLayout is rendered inside <Router>

  return (
    <>
      <Navbar />
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/all-books" element={<AllBooks />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/wishlist" element={<WishList />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/books" element={<BookManagement />} />
        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/admin/reports" element={<Reports />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <GlobalStateProvider> {/* Wrap the entire app with GlobalStateProvider */}
        <AppLayout />
      </GlobalStateProvider>
    </Router>
  );
}

export default App;