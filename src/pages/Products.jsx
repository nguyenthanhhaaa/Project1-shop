import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import ProductGridSkeleton from "../components/ProductGridSkeleton";
import ProductDetailModal from "../components/ProductDetailModal";

export default function Products() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:4000/products")
      .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
      .then(data => setList(Array.isArray(data) ? data : []))
      .catch(err => { console.error(err); setError(err.message || "Lỗi"); setList([]); })
      .finally(() => setLoading(false));
  }, []);

  function handleAddToCart(p) {
    const raw = localStorage.getItem("cart") || "[]";
    const cart = JSON.parse(raw);
    const idx = cart.findIndex(c => c.id === p.id);
    if (idx >= 0) cart[idx].qty += 1;
    else cart.push({ id: p.id, title: p.title, price: p.price, qty: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));

    // quick toast
    const el = document.createElement("div");
    el.textContent = "Đã thêm vào giỏ";
    el.className = "fixed bottom-6 right-6 bg-indigo-600 text-white px-4 py-2 rounded shadow-lg";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 900);
  }

  function openDetail(p) {
    alert(`${p.title}\n\n${p.description ?? ""}`);
  }

  if (loading) return <div className="max-w-screen-xl mx-auto px-6 py-8"><ProductGridSkeleton count={8} /></div>;
  if (error) return <div className="max-w-screen-xl mx-auto px-6 py-12 text-center text-red-600">{error}</div>;
  if (!list.length) return <div className="max-w-screen-xl mx-auto px-6 py-12 text-center text-gray-500">Không có sản phẩm.</div>;

  return (
    <section className="max-w-screen-xl mx-auto px-6 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Products</h1>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">{list.length} items</div>

          {/* Filter / sort placeholders */}
          <select className="border rounded px-3 py-1 text-sm">
            <option value="">All categories</option>
            <option>Clothes</option>
            <option>Shoes</option>
            <option>Accessories</option>
          </select>
        </div>
      </div>

      <div id="products-grid" className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map(p => (
          <ProductCard key={p.id} product={{ ...p, price: p.price ?? 0 }} onAddToCart={handleAddToCart} onOpenDetail={openDetail} />
        ))}
      </div>
    </section>
  );
}
