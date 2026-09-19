import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("haven-cart")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("haven-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart((current) => {
      const existing = current.find(
        (cartItem) =>
          cartItem.productId === item.productId &&
          cartItem.color === item.color &&
          cartItem.size === item.size
      );

      if (existing) {
        return current.map((cartItem) =>
          cartItem === existing
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }

      return [...current, item];
    });
  };

  const updateQuantity = (key, quantity) => {
    if (quantity <= 0) {
      setCart((current) => current.filter((item) => item.key !== key));
      return;
    }

    setCart((current) =>
      current.map((item) => (item.key === key ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (key) => {
    setCart((current) => current.filter((item) => item.key !== key));
  };

  const clearCart = () => setCart([]);

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const value = {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
