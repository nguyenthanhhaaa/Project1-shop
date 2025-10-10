import React from "react";

export default function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-sm p-4">
          <div className="h-40 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-md mb-4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded mb-2 w-3/4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded mb-3 w-1/2 animate-pulse" />
          <div className="flex gap-2">
            <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded w-20 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
