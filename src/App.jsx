import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Confirm from "./pages/Confirm";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main className="max-w-screen-xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout/*" element={<Checkout />} />
          <Route path="/confirm" element={<Confirm />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
