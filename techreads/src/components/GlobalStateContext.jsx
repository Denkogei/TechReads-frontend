// GlobalStateContext.js
import React, { createContext, useContext, useState } from "react";

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Add an item to the cart
  const addToCart = (book) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === book.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...book, quantity: 1 }];
      }
    });
  };

  // Add an item to the wishlist
  const addToWishlist = (book) => {
    setWishlist((prevWishlist) => {
      if (!prevWishlist.some((item) => item.id === book.id)) {
        return [...prevWishlist, book];
      }
      return prevWishlist;
    });
  };

  // Remove an item from the wishlist
  const removeFromWishlist = (bookId) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((item) => item.id !== bookId)
    );
  };

  return (
    <GlobalStateContext.Provider
      value={{ cart, wishlist, addToCart, addToWishlist, removeFromWishlist }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);