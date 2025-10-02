import React from "react";
import { useNavigate } from "react-router-dom";
import useCart from "../../hooks/useCart";
import CartItem from "../../components/CartItem";
import { useCheckout } from "../../context/CheckoutContext";

export default function ReviewCartPage() {
  const { items, updateQty, removeItem, getTotal } = useCart();
  const navigate = useNavigate();
  const { setCurrentStep } = useCheckout();

  const handleNext = () => {
    if (!items || items.length === 0) {
      alert("Giỏ hàng rỗng — thêm sản phẩm trước khi tiếp tục.");
      return;
    }
    setCurrentStep(2);
    navigate("/checkout/shipping");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Xem lại giỏ hàng</h2>

      {items.length === 0 ? (
        <div className="bg-white p-6 rounded text-center">
          <p className="mb-4">Giỏ hàng của bạn đang trống.</p>
          <button onClick={() => navigate("/products")} className="px-4 py-2 bg-indigo-600 text-white rounded">Tiếp tục mua sắm</button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map(item => (
              <CartItem key={item.id} item={item} onChangeQty={updateQty} onRemove={removeItem} />
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="text-lg">Tổng: <span className="font-bold">{Number(getTotal).toLocaleString('vi-VN')}₫</span></div>
            <div className="flex gap-3">
              <button onClick={() => navigate("/products")} className="px-4 py-2 border rounded">Tiếp tục mua sắm</button>
              <button onClick={handleNext} className="px-4 py-2 bg-indigo-600 text-white rounded">Tiếp tục</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
