// GlobalStateContext.js
import React, { createContext, useContext, useRef, useState, useCallback } from "react";

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const cart = useRef([]);
  const wishlist = useRef([]);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const forceUpdate = useCallback(() => setUpdateTrigger(prev => prev + 1), []);

  const addToCart = useCallback((book) => {
    const existingItem = cart.current.find((item) => item.id === book.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.current.push({ ...book, quantity: 1 });
    }
    forceUpdate();
  }, [forceUpdate]);

  const addToWishlist = useCallback((book) => {
    if (!wishlist.current.some((item) => item.id === book.id)) {
      wishlist.current.push(book);
      forceUpdate();
    }
  }, [forceUpdate]);

  const removeFromWishlist = useCallback((bookId) => {
    const index = wishlist.current.findIndex((item) => item.id === bookId);
    if (index !== -1) {
      wishlist.current.splice(index, 1);
      forceUpdate();
    }
  }, [forceUpdate]);

  return (
    <GlobalStateContext.Provider
      value={{
        cart: cart.current,
        wishlist: wishlist.current,
        updateTrigger,
        addToCart,
        addToWishlist,
        removeFromWishlist
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);