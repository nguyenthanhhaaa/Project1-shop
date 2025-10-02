import React from "react";

export default function CartItem({ item, onChangeQty, onRemove }) {
  const { id, title, image, price = 0, qty = 0, stock } = item;

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
      <img
        src={image || "/images/placeholder.png"}
        alt={title}
        className="w-20 h-20 object-cover rounded"
        onError={(e) => { e.target.src = "/images/placeholder.png"; }}
      />
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold truncate">{title}</h3>
        <div className="text-xs text-slate-500 mt-1">
          Giá: <span className="font-medium">{Number(price).toLocaleString("vi-VN")}₫</span>
        </div>
        <div className="text-xs text-slate-400 mt-1">Còn: {stock ?? "—"}</div>
      </div>

      <div className="flex items-center gap-2">
        <button
          aria-label={`Giảm số lượng ${title}`}
          onClick={() => onChangeQty(id, Math.max(0, qty - 1))}
          className="px-2 py-1 border rounded disabled:opacity-50"
          disabled={qty <= 1}
        >
          −
        </button>

        <div className="px-3 py-1 border rounded text-sm w-12 text-center" role="status" aria-live="polite">
          {qty}
        </div>

        <button
          aria-label={`Tăng số lượng ${title}`}
          onClick={() => onChangeQty(id, Math.min(qty + 1, stock ?? qty + 1))}
          className="px-2 py-1 border rounded disabled:opacity-50"
          disabled={typeof stock === "number" && qty >= stock}
        >
          +
        </button>
      </div>

      <div className="w-28 text-right">
        <div className="text-sm font-semibold">{(Number(price) * qty).toLocaleString("vi-VN")}₫</div>
        <button onClick={() => onRemove(id)} className="text-xs text-red-600 mt-2 underline">Xóa</button>
      </div>
    </div>
  );
}
