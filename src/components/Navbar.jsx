import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `transition-all duration-150 px-4 py-2 rounded-md text-lg font-medium tracking-wide ${
      isActive
        ? "text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1"
        : "text-gray-700 hover:text-indigo-600"
    }`;

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-screen-xl mx-auto px-6">
        <nav className="flex justify-center items-center gap-x-10 py-6">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/products" className={linkClass}>
            Products
          </NavLink>
          <NavLink to="/cart" className={linkClass}>
            Cart
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
