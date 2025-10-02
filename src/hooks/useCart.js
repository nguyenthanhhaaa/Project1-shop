import { useState, useEffect } from "react";

export default function useCart() {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem("cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart:", e);
    }
  }, [cart]);

  function addItem(product, qty = 1) {
    setCart((prev) => {
      const idx = prev.findIndex((i) => String(i.id) === String(product.id));
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: (copy[idx].qty || 0) + qty };
        return copy;
      }
      return [...prev, { id: product.id, title: product.title, price: product.price, qty }];
    });
  }

  function removeItem(id) {
    setCart((prev) => prev.filter((i) => String(i.id) !== String(id)));
  }

  function clearCart() {
    setCart([]);
  }

  return { cart, addItem, removeItem, clearCart };
}
