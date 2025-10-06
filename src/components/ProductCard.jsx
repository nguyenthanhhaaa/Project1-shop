import React from "react";

export default function ProductCard({ product = {}, onAddToCart = () => {}, onOpenDetail = () => {} }) {
  const { id, title, price, category, image, stock, description } = product;
  const safePrice = Number(price || 0);

  return (
    <article className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-200">
      {/* Media */}
      <button
        type="button"
        onClick={() => onOpenDetail(product)}
        className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100"
        aria-label={`Xem chi tiết ${title || id}`}
      >
        <img
          src={image || "/images/placeholder.png"}
          alt={title ?? `Product ${id}`}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-500 transform hover:scale-105"
          onError={(e) => { e.target.onerror = null; e.target.src = "/images/placeholder.png"; }}
        />

        {/* category badge */}
        <div className="absolute left-3 top-3 bg-white/90 text-xs font-medium px-3 py-1 rounded-full shadow">
          {category ?? "—"}
        </div>

        {/* stock badge */}
        { (stock || 0) <= 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-semibold">
            Hết hàng
          </div>
        ) }
      </button>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm md:text-base font-semibold text-slate-900 truncate">
              {title ?? `Product ${id}`}
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{description ?? ""}</p>
          </div>

          <div className="text-right flex-shrink-0">
            <div className="text-sm font-bold text-indigo-600">{safePrice.toLocaleString("vi-VN")}₫</div>
            <div className="text-xs text-slate-400 mt-1">{(stock || 0) > 0 ? `Còn ${stock}` : "Hết hàng"}</div>
          </div>
        </div>

        <div className="mt-auto flex gap-3">
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            disabled={(stock || 0) <= 0}
            className="flex-1 rounded-lg bg-indigo-600 text-white text-sm font-medium py-2 hover:bg-indigo-700 active:scale-95 transition"
          >
            Thêm vào giỏ
          </button>

          <button
            type="button"
            onClick={() => onOpenDetail(product)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition"
          >
            Xem
          </button>
        </div>
      </div>
    </article>
  );
}
