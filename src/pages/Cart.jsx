import React from "react";
import useCart from "../hooks/useCart";
import CartItem from "../components/CartItem";
import { Link } from "react-router-dom";

export default function CartPage() {
  const { items = [], updateQty, removeItem, clearCart, getCount, getTotal } = useCart();

  return (
    <section className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Giỏ hàng</h1>

      {items.length === 0 ? (
        <div className="p-6 bg-white rounded shadow text-center">
          Giỏ hàng trống. <Link to="/products" className="text-indigo-600 underline">Tiếp tục mua sắm</Link>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {items.map((it) => (
              <CartItem
                key={String(it.id)}
                item={it}
                onChangeQty={(id, qty) => updateQty(id, qty)}
                onRemove={(id) => removeItem(id)}
              />
            ))}
          </div>

          <div className="flex items-center justify-between bg-white p-4 rounded shadow">
            <div>
              <div className="text-sm">Tổng {getCount} sản phẩm</div>
              <div className="text-lg font-semibold">{getTotal.toLocaleString("vi-VN")}₫</div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => clearCart()} className="px-3 py-2 border rounded text-sm">
                Xóa toàn bộ
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded">Thanh toán</button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
