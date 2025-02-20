

import Navbar from "./components/Navbar"
import ShoppingCart from "./components/ShoppingCart"
import Signup from "./components/Signup"
import Login from "./components/Login"
import Homepage from "./components/Homepage"
import BookDetails from "./components/BookDetails"
import WishList from "./components/WishList"
import Checkout from "./components/Checkout"
import UserProfile from "./components/UserProfile"
import OrderHistory from "./components/OrderHistory"
import Logout from "./components/Logout"
import Categories from "./components/Categories"


function App() {
  return (
    <>
      <Navbar />
      <ShoppingCart />
      <Signup />
      <Login />
      <Homepage />
      <BookDetails />
      <WishList />
      <Checkout />
      <UserProfile />
      <OrderHistory />
      <Logout />
      <Categories />
    </>
  )
}

export default App
