import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCart from "../../hooks/useCart";
import { useCheckout } from "../../context/CheckoutContext";
import { createOrder, createEmail } from "../../api/orderApi";

function formatCurrency(v) {
  return Number(v || 0).toLocaleString("vi-VN") + "₫";
}

export default function ConfirmPage() {
  const { items, getTotal, clearCart } = useCart();
  const { shipping, notes } = useCheckout();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePlaceOrder = async () => {
    setError(null);
    if (!items || items.length === 0) {
      setError("Giỏ hàng rỗng. Không thể đặt hàng.");
      return;
    }

    setLoading(true);
    const payload = {
      items: items.map((i) => ({ id: i.id, title: i.title, price: i.price, qty: i.qty })),
      shipping: shipping || {},
      notes: notes || "",
      total: getTotal,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const created = await createOrder(payload);

      try {
        await createEmail({
          to: shipping?.email || "unknown@example.com",
          subject: `Xác nhận đơn hàng #${created.id}`,
          body: `Cám ơn ${shipping?.fullName || ""}. Đơn hàng ${created.id} đã được tiếp nhận.`,
          sentAt: new Date().toISOString(),
          orderId: created.id,
        });
      } catch (e) {}

      clearCart();
      navigate(`/checkout/success/${created.id}`, { replace: true });
    } catch (err) {
      setError(err?.message || "Có lỗi khi gửi đơn. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-semibold">Xác nhận đặt hàng</h1>
        <p className="text-sm text-slate-500 mt-1">Kiểm tra lại thông tin giao hàng và đơn hàng trước khi đặt.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-medium mb-3">Thông tin giao hàng</h2>
            <div className="text-sm text-slate-700">
              <div className="font-semibold">{shipping?.fullName || "—"}</div>
              <div className="mt-1 text-sm text-slate-600">{shipping?.email || "—"} — {shipping?.phone || "—"}</div>
              <div className="mt-2 text-sm">{shipping?.address || "—"}</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-medium mb-4">Sản phẩm</h2>

            <ul className="divide-y">
              {items.map((it) => (
                <li key={it.id} className="py-4 flex gap-4 items-center">
                  <img
                    src={it.image || "/images/placeholder.png"}
                    alt={it.title}
                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-cover rounded border"
                    onError={(e) => (e.target.src = "/images/placeholder.png")}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{it.title}</div>
                    <div className="text-xs text-slate-500 mt-1">Số lượng: {it.qty} × {formatCurrency(it.price)}</div>
                  </div>
                  <div className="text-sm font-medium">{formatCurrency(it.qty * it.price)}</div>
                </li>
              ))}
            </ul>

            {notes && (
              <div className="mt-4 bg-slate-50 p-3 rounded text-sm">
                <strong>Ghi chú:</strong> <span className="ml-2">{notes}</span>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded text-sm">
              {error}
            </div>
          )}
        </div>

        <aside className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-2">Tóm tắt đơn hàng</h3>

          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <div>Số mặt hàng</div>
            <div>{items.length}</div>
          </div>

          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <div>Tạm tính</div>
            <div className="font-medium">{formatCurrency(getTotal)}</div>
          </div>

          <div className="flex justify-between text-sm text-slate-600 mb-4">
            <div>Phí vận chuyển</div>
            <div className="font-medium">0₫</div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-end mb-4">
              <div className="text-sm text-slate-600">Thành tiền</div>
              <div className="text-2xl font-bold text-indigo-600">{formatCurrency(getTotal)}</div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow"
                aria-live="polite"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="opacity-75" />
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  "Đặt hàng"
                )}
              </button>

              <button
                onClick={() => navigate("/products")}
                className="w-full px-4 py-2 border rounded-md text-sm"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
