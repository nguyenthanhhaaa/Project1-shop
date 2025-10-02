import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";
import CartItem from "../components/CartItem";

function formatCurrency(v) {
  return Number(v).toLocaleString('vi-VN') + '₫';
}

export default function CartPage() {
  const { items, updateQty, removeItem, clearCart, getTotal, getCount } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Giỏ hàng</h1>

      {items.length === 0 ? (
        <div className="bg-white p-8 rounded text-center">
          <p className="text-lg mb-4">Giỏ hàng trống</p>
          <Link to="/products" className="px-4 py-2 bg-indigo-600 text-white rounded">Tiếp tục mua sắm</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <CartItem
                key={String(item.id)}
                item={item}
                onChangeQty={(id, qty) => updateQty(id, qty)}
                onRemove={(id) => removeItem(id)}
              />
            ))}
            <div className="flex justify-between mt-4">
              <button onClick={() => clearCart()} className="px-4 py-2 border rounded text-sm">Xóa toàn bộ</button>
              <div className="text-sm text-slate-500">Số mặt hàng: {getCount}</div>
            </div>
          </div>

          <aside className="bg-white rounded-lg p-4 shadow">
            <div className="mb-4">
              <div className="text-sm text-slate-500">Tạm tính</div>
              <div className="text-2xl font-bold">{formatCurrency(getTotal)}</div>
            </div>

            <div className="space-y-2">
              <button onClick={handleCheckout} className="w-full px-4 py-2 bg-indigo-600 text-white rounded">Tiến hành thanh toán</button>
              <button onClick={() => navigate("/products")} className="w-full px-4 py-2 border rounded">Tiếp tục mua sắm</button>
            </div>

            <div className="text-xs text-slate-400 mt-4">
              Lưu ý: Giá hiển thị chưa bao gồm phí vận chuyển. Số lượng sẽ được kiểm tra tại bước Xác nhận.
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
