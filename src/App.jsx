import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Confirm from "./pages/Confirm";
import ProductDetailPage from "./pages/ProductDetailPage";
import { CheckoutProvider } from "./context/CheckoutContext";
import CheckoutLayout from "./pages/checkout/CheckoutLayout";
import ShippingPaymentPage from "./pages/checkout/ShippingPayment";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main className="max-w-screen-xl mx-auto px-6 py-8">
        <CheckoutProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<CheckoutLayout />}>
              <Route index element={<Checkout />} />
              <Route path="shipping" element={<ShippingPaymentPage />} />
              <Route path="confirm" element={<Confirm />} />
            </Route>
          </Routes>
        </CheckoutProvider>
      </main>
    </BrowserRouter>
  );
}
