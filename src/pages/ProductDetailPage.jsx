// src/pages/ProductDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:4000/products/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => setProduct(data))
      .catch((e) => setErr(e.message || "Lỗi"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="max-w-4xl mx-auto p-6">Loading...</div>;
  if (err) return <div className="max-w-4xl mx-auto p-6 text-red-600">Lỗi: {err}</div>;
  if (!product) return <div className="max-w-4xl mx-auto p-6">Không tìm thấy sản phẩm.</div>;

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img src={product.image || "/images/placeholder.png"} alt={product.title} className="w-full h-96 object-cover rounded-lg" />
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          <div className="text-xl text-indigo-600 font-semibold mb-4">{(product.price ?? 0).toLocaleString("vi-VN")}₫</div>
          <p className="text-sm text-slate-600 mb-4">{product.description}</p>
          <div className="mb-4 text-sm">Category: {product.category}</div>
          <div className="mb-4 text-sm">{(product.stock ?? 0) > 0 ? `Còn ${product.stock}` : "Hết hàng"}</div>

          <div className="flex gap-3">
            <button className="px-4 py-2 rounded bg-indigo-600 text-white">Thêm vào giỏ</button>
            <button className="px-4 py-2 rounded border">Mua ngay</button>
          </div>
        </div>
      </div>
    </main>
  );
}
