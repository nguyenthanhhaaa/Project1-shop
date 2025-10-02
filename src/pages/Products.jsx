import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import ProductGridSkeleton from "../components/ProductGridSkeleton";
import ProductDetailModal from "../components/ProductDetailModal";
import useDebounce from "../hooks/useDebounce";
import useFetchProducts from "../hooks/useFetchProducts";
import useCart from "../hooks/useCart";
import SearchBar from "../components/SearchBar";
import { useSearchParams } from "react-router-dom";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQ = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialSort = searchParams.get("sort") || "";
  const initialPage = Number.parseInt(searchParams.get("page") || "1", 10) || 1;

  const [query, setQuery] = useState(initialQ);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);

  const debouncedQuery = useDebounce(query, 350);
  const limit = 12;

  const {
    data: products = [],
    loading,
    error,
    total = 0,
    refetch,
    page,
    setPage,
  } = useFetchProducts({
    q: debouncedQuery,
    category,
    page: initialPage,
    limit,
    sort,
  });

  const { addItem } = useCart();

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, category, sort, setPage]);

  useEffect(() => {
    const params = {};
    if (query) params.q = query;
    if (category) params.category = category;
    if (sort) params.sort = sort;
    if (page && page > 1) params.page = String(page);
    setSearchParams(params, { replace: true });
  }, [query, category, sort, page, setSearchParams]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const categories = useMemo(() => {
    const setC = new Set((products || []).map((p) => p.category).filter(Boolean));
    return Array.from(setC);
  }, [products]);

  const openDetail = (p) => {
    setSelectedProduct(p);
    setModalOpen(true);
  };
  const closeDetail = () => {
    setSelectedProduct(null);
    setModalOpen(false);
  };

  const totalPages = Math.max(1, Math.ceil((total || (products || []).length) / limit));

  const handleAddToCart = (p) => {
    try {
      if (typeof addItem === "function") {
        addItem(p, 1);
      } else {
        const raw = localStorage.getItem("cart") || "[]";
        const cart = JSON.parse(raw);
        const idx = cart.findIndex((c) => c.id === p.id);
        if (idx >= 0) cart[idx].qty += 1;
        else cart.push({ id: p.id, title: p.title, price: p.price, qty: 1 });
        localStorage.setItem("cart", JSON.stringify(cart));
      }
      const t = document.createElement("div");
      t.innerText = "Đã thêm vào giỏ";
      t.className = "fixed bottom-6 right-6 bg-indigo-600 text-white px-4 py-2 rounded shadow-lg";
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 900);
    } catch (err) {
      console.error("add to cart failed", err);
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <SearchBar
            value={query}
            onChange={(v) => {
              setQuery(v);
            }}
            placeholder="Tìm sản phẩm..."
            clearable
          />

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
            className="px-3 py-2 border rounded-lg"
            aria-label="Lọc theo danh mục"
          >
            <option value="">Tất cả</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
            }}
            className="px-3 py-2 border rounded-lg"
            aria-label="Sắp xếp"
          >
            <option value="">Mặc định</option>
            <option value="price">Giá tăng dần</option>
            <option value="-price">Giá giảm dần</option>
            <option value="title">Tên A→Z</option>
          </select>
        </div>

        <div className="text-sm text-slate-500">
          {loading ? "Đang tải..." : `${total || (products || []).length} sản phẩm`}
        </div>
      </div>

      {error && (
        <div className="text-red-600 mb-4">
          Có lỗi khi tải sản phẩm.
          <button className="ml-3 underline" onClick={() => refetch && refetch()}>
            Thử lại
          </button>
        </div>
      )}

      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : (
        <>
          <div className="max-w-screen-xl mx-auto px-6 py-8">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {(products || []).map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={() => handleAddToCart(p)}
                  onOpenDetail={() => openDetail(p)}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <div className="text-sm text-slate-600">
              Trang {page} / {totalPages}
            </div>

            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeDetail}
        onAddToCart={(prod) => {
          handleAddToCart(prod);
          closeDetail();
        }}
      />
    </section>
  );
}
