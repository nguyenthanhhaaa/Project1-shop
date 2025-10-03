import { useEffect, useState } from "react";

export default function Products() {
  const [list, setList] = useState([]);
  useEffect(() => {
    fetch("http://localhost:4000/products")
      .then((res) => res.json())
      .then(setList)
      .catch((err) => console.error("fetch products error:", err));
  }, []);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Products</h1>
      <ul className="space-y-3">
        {list.map((p) => (
          <li key={p.id} className="border p-3 rounded">
            <div className="font-medium">{p.title ?? p.name}</div>
            <div className="text-sm text-gray-600">{p.category}</div>
            <div className="font-bold mt-2">{p.price?.toLocaleString?.() ?? p.price}₫</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
