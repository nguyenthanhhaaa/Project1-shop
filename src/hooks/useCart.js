import { useEffect, useMemo, useState } from "react";

const LS_KEY = "project1_cart_v1";
const LEGACY_LS_KEY = "cart";


export default function useCart() {
  const [items, setItems] = useState(() => {
    try {
      const rawNew = localStorage.getItem(LS_KEY);
      if (rawNew) return JSON.parse(rawNew);

      const rawLegacy = localStorage.getItem(LEGACY_LS_KEY);
      if (rawLegacy) {
        try {
          const parsed = JSON.parse(rawLegacy);
          if (Array.isArray(parsed)) {
            const normalized = parsed
              .map((it) => (typeof it === "object" && it !== null ? it : null))
              .filter(Boolean);
            localStorage.setItem(LS_KEY, JSON.stringify(normalized));
            return normalized;
          }
        } catch (e) {
          // ignore invalid legacy
        }
      }
      return [];
    } catch (e) {
      console.error("useCart: failed to read localStorage", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("useCart: persist failed", e);
    }
  }, [items]);

  const addItem = (product, qty = 1) => {
    if (!product || product.id == null) {
      console.warn("useCart.addItem: invalid product", product);
      return;
    }
    setItems((prev) => {
      const pid = String(product.id);
      const found = prev.find((p) => String(p.id) === pid);
      const maxStock = (product.stock ?? found?.stock ?? Infinity);
      if (found) {
        const newQty = Math.min((Number(found.qty) || 0) + Number(qty || 0), maxStock);
        return prev.map((p) => (String(p.id) === pid ? { ...p, qty: newQty } : p));
      }
      const item = {
        id: product.id,
        title: product.title ?? product.name ?? "",
        price: Number(product.price ?? 0),
        image: product.image ?? null,
        qty: Math.max(0, Math.min(Number(qty || 0), maxStock || Number(qty || 0))),
        stock: maxStock === Infinity ? undefined : maxStock,
      };
      return [...prev, item];
    });
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((p) => String(p.id) !== String(id)));
  };

  const updateQty = (id, qty) => {
    setItems((prev) => {
      if (qty == null) return prev;
      const n = Number(qty);
      if (Number.isNaN(n)) return prev;
      if (n <= 0) return prev.filter((p) => String(p.id) !== String(id));
      return prev.map((p) =>
        String(p.id) === String(id)
          ? { ...p, qty: Math.min(n, p.stock ?? n) }
          : p
      );
    });
  };

  const clearCart = () => setItems([]);

  const getCount = useMemo(() => items.reduce((s, it) => s + (Number(it.qty) || 0), 0), [items]);

  const getTotal = useMemo(() => items.reduce((s, it) => s + (Number(it.qty || 0) * Number(it.price || 0)), 0), [items]);

  return {
    items,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    getCount,
    getTotal,
    setItems,
    cart: items,
  };
}
