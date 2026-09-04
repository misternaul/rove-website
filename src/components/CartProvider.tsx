"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string; // unique combo: dropId_colorId_sizeId
  dropId: string;
  dropName: string;
  colorId: string;
  colorName: string;
  sizeId: string;
  sizeName: string;
  quantity: number;
  priceFormatted: string;
  priceNumeric: number;
  image: string;
  maxStock: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalQuantity: number;
  totalPriceNumeric: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load cart from local storage on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    const savedCart = localStorage.getItem("rove_cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save cart to local storage on change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("rove_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isMounted]);

  const addToCart = (newItem: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === newItem.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + newItem.quantity, existing.maxStock);
        return prev.map((item) => (item.id === newItem.id ? { ...item, quantity: newQty } : item));
      }
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: Math.min(qty, item.maxStock) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const getSafeNumericPrice = (item: CartItem) => {
    if (item.priceNumeric && !isNaN(item.priceNumeric)) return item.priceNumeric;
    if (item.priceFormatted) {
      const parsed = parseInt(item.priceFormatted.replace(/\D/g, ""), 10);
      if (!isNaN(parsed)) return parsed;
    }
    return 0;
  };

  const totalPriceNumeric = cartItems.reduce((acc, item) => acc + getSafeNumericPrice(item) * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        isCartOpen,
        setIsCartOpen,
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalQuantity,
        totalPriceNumeric,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
