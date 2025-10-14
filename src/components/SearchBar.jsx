import React from "react";

export default function SearchBar({ value, onChange, placeholder = "Tìm sản phẩm...", clearable = true }) {
  return (
    <div className="relative w-full md:max-w-md">
      <label htmlFor="product-search" className="sr-only">Tìm sản phẩm</label>

      <input
        id="product-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring focus:ring-indigo-200"
        aria-label="Tìm sản phẩm"
        autoComplete="off"
      />

      {clearable && value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Xóa tìm kiếm"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-sm opacity-70 hover:opacity-100"
        >
          <span aria-hidden="true">✕</span>
        </button>
      )}
    </div>
  );
}
