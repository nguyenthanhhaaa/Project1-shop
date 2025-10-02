import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function formatCurrency(v) {
  return Number(v || 0).toLocaleString("vi-VN") + "₫";
}

export default function SuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (id) {
      axios.get(`http://localhost:4000/orders/${id}`)
        .then(res => { if (mounted) setOrder(res.data); })
        .catch(() => { if (mounted) setOrder(null); })
        .finally(() => { if (mounted) setLoading(false); });
    } else {
      setLoading(false);
    }
    return () => { mounted = false; };
  }, [id]);

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <h1 className="text-2xl font-bold mb-2">Cảm ơn bạn! Đơn hàng đã được gửi</h1>
        {loading ? (
          <p className="text-sm text-slate-600">Đang tải thông tin đơn hàng…</p>
        ) : order ? (
          <>
            <p className="mb-2 text-slate-700">Mã đơn: <strong>{order.id}</strong></p>
            <p className="mb-4 text-slate-700">Tổng: <strong>{formatCurrency(order.total)}</strong></p>
            <p className="text-sm text-slate-500 mb-6">Một email xác nhận đã được gửi tới <strong>{order.shipping?.email}</strong> (demo).</p>

            <div className="flex justify-center gap-3">
              <Link to="/products" className="px-4 py-2 bg-indigo-600 text-white rounded">Tiếp tục mua sắm</Link>
              <Link to="/orders" className="px-4 py-2 border rounded">Xem đơn hàng</Link>
            </div>
          </>
        ) : (
          <>
            <p className="mb-4 text-slate-600">Không tìm thấy chi tiết đơn hàng. Bạn có thể quay lại trang sản phẩm.</p>
            <Link to="/products" className="px-4 py-2 bg-indigo-600 text-white rounded">Tiếp tục mua sắm</Link>
          </>
        )}
      </div>
    </section>
  );
}
