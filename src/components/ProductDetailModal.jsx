import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

export default function ProductDetailModal({ product, isOpen, onClose, onAddToCart }) {
  const overlayRef = useRef(null);
  const closeBtnRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    previouslyFocused.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const focusable = overlayRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      // restore focus
      previouslyFocused.current?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-title"
      aria-describedby="product-desc"
    >
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl mx-4 overflow-hidden z-10">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-4">
            <img
              src={product.image || "/images/placeholder.png"}
              alt={product.title}
              className="w-full h-72 md:h-[420px] object-cover rounded-md"
              onError={(e) => (e.target.src = "/images/placeholder.png")}
            />
          </div>

          <div className="p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <h2 id="product-title" className="text-xl font-bold">{product.title}</h2>
              <div className="text-lg font-semibold">{(product.price ?? 0).toLocaleString("vi-VN")}₫</div>
            </div>

            <p id="product-desc" className="text-sm text-slate-600">{product.description}</p>

            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm text-slate-500">Category: {product.category}</span>
              <span className="text-sm text-slate-400">|</span>
              <span className="text-sm">{(product.stock ?? 0) > 0 ? `Còn ${product.stock}` : "Hết hàng"}</span>
            </div>

            <div className="mt-auto flex gap-3">
              <button
                onClick={() => { onAddToCart(product); }}
                disabled={(product.stock ?? 0) <= 0}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                Thêm vào giỏ
              </button>

              <button onClick={onClose} className="px-4 py-2 rounded-lg border" ref={closeBtnRef}>
                Đóng
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-3 right-3 rounded-full w-9 h-9 grid place-items-center bg-white shadow"
        >
          ✕
        </button>
      </div>
    </div>,
    document.body
  );
}
