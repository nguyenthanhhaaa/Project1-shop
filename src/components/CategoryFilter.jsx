import React from "react";

export default function CategoryFilter({ categories = [], value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="category" className="sr-only">Lọc theo danh mục</label>
      <select
        id="category"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border rounded-lg"
        aria-label="Lọc theo danh mục"
      >
        <option value="">Tất cả</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  );
}
