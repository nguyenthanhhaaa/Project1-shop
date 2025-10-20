import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCheckout } from "../../context/CheckoutContext";
import useCart from "../../hooks/useCart";

function validateEmail(e) {
  return /\S+@\S+\.\S+/.test(e);
}

export default function ShippingPaymentPage() {
  const { shipping, setShipping, setCurrentStep } = useCheckout();
  const { items = [], getTotal } = useCart();
  const navigate = useNavigate();

  // form state initialised from context (persisted)
  const [form, setForm] = useState(() => ({
    fullName: shipping?.fullName || "",
    phone: shipping?.phone || "",
    email: shipping?.email || "",
    address: shipping?.address || "",
    paymentMethod: shipping?.paymentMethod || "cod",
  }));

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setCurrentStep?.(2);
    if (!items || items.length === 0) {
      navigate("/checkout", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const handleChange = (key, value) => setForm((s) => ({ ...s, [key]: value }));
  const handleBlur = (key) => setTouched((t) => ({ ...t, [key]: true }));

  const validate = () => {
    const e = {};
    if (!form.fullName || form.fullName.trim().length < 3) e.fullName = "Nhập tên (>= 3 ký tự).";
    if (form.email && !validateEmail(form.email)) e.email = "Email không hợp lệ."; // email optional in some UXs
    if (!form.phone || form.phone.trim().length < 7) e.phone = "Số điện thoại không hợp lệ.";
    if (!form.address || form.address.trim().length < 5) e.address = "Nhập địa chỉ giao hàng.";
    if (!form.paymentMethod) e.paymentMethod = "Chọn phương thức thanh toán.";
    setErrors(e);
    return e;
  };

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const totalAmount = Number(getTotal ?? 0);
  const shippingFee = 20000;
  const grandTotal = totalAmount + shippingFee;

  const handleBack = () => {
    setCurrentStep?.(1);
    navigate("/checkout", { replace: true });
  };

  const handleNext = () => {
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      address: true,
      paymentMethod: true,
    });

    const e = validate();
    if (Object.keys(e).length > 0) return;

    setSubmitting(true);
    try {
      setShipping?.(form);
      setCurrentStep?.(3);
      navigate("/checkout/confirm");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-800">Thông tin giao hàng & thanh toán</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-2">Họ và tên</label>
                <input
                  value={form.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  onBlur={() => handleBlur("fullName")}
                  placeholder="Nhập tên khách hàng"
                  aria-invalid={!!errors.fullName}
                  aria-describedby={errors.fullName ? "err-fullName" : undefined}
                  className={`w-full max-w-md rounded-full px-6 py-3 text-lg placeholder-slate-400 bg-slate-50 border ${touched.fullName && errors.fullName ? "border-red-300 ring-1 ring-red-200" : "border-transparent"} shadow-sm`}
                />
                {touched.fullName && errors.fullName && <p id="err-fullName" className="text-sm text-red-600 mt-2">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-2">Số điện thoại</label>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center px-4 py-3 rounded-full bg-white border border-slate-200 text-sm text-slate-600">(+84)</span>
                  <input
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    onBlur={() => handleBlur("phone")}
                    placeholder="Nhập số điện thoại"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "err-phone" : undefined}
                    className={`flex-1 rounded-full px-6 py-3 text-lg placeholder-slate-400 bg-slate-50 border ${touched.phone && errors.phone ? "border-red-300 ring-1 ring-red-200" : "border-transparent"} shadow-sm`}
                  />
                </div>
                {touched.phone && errors.phone && <p id="err-phone" className="text-sm text-red-600 mt-2">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-2">Email (không bắt buộc)</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  placeholder="Nhập địa chỉ email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "err-email" : undefined}
                  className={`w-full max-w-md rounded-full px-6 py-3 text-lg placeholder-slate-400 bg-slate-50 border ${touched.email && errors.email ? "border-red-300 ring-1 ring-red-200" : "border-transparent"} shadow-sm`}
                />
                {touched.email && errors.email && <p id="err-email" className="text-sm text-red-600 mt-2">{errors.email}</p>}
              </div>


              <div>
                <label className="block text-xs font-medium text-slate-600 mb-2">Địa chỉ</label>
                <input
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  onBlur={() => handleBlur("address")}
                  placeholder="Số nhà, đường, phường, quận, tỉnh"
                  aria-invalid={!!errors.address}
                  aria-describedby={errors.address ? "err-address" : undefined}
                  className={`w-full rounded-full px-6 py-3 text-lg placeholder-slate-400 bg-slate-50 border ${touched.address && errors.address ? "border-red-300 ring-1 ring-red-200" : "border-transparent"} shadow-sm`}
                />
                {touched.address && errors.address && <p id="err-address" className="text-sm text-red-600 mt-2">{errors.address}</p>}
              </div>
            </div>


            <div>
              <div className="text-sm font-medium text-slate-700 mb-2">Phương thức thanh toán</div>
              <div className="flex gap-3 flex-wrap">
                <label className={`flex items-center gap-3 px-4 py-2 rounded-full border ${form.paymentMethod === "cod" ? "bg-indigo-50 border-indigo-200" : "border-slate-200"}`}>
                  <input type="radio" name="pay" checked={form.paymentMethod === "cod"} onChange={() => handleChange("paymentMethod", "cod")} />
                  <span className="text-sm">COD — Thanh toán khi nhận hàng</span>
                </label>

                <label className={`flex items-center gap-3 px-4 py-2 rounded-full border ${form.paymentMethod === "card" ? "bg-indigo-50 border-indigo-200" : "border-slate-200"}`}>
                  <input type="radio" name="pay" checked={form.paymentMethod === "card"} onChange={() => handleChange("paymentMethod", "card")} />
                  <span className="text-sm">Thẻ (Mock)</span>
                </label>
              </div>
              {touched.paymentMethod && errors.paymentMethod && <p className="text-sm text-red-600 mt-2">{errors.paymentMethod}</p>}
            </div>

            <div className="flex items-center gap-3">
              <button type="button" onClick={handleBack} className="px-4 py-2 rounded-full border bg-white hover:bg-slate-50">Quay lại</button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!isValid || submitting}
                className={`px-6 py-3 rounded-full text-white ${(!isValid || submitting) ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
              >
                {submitting ? "Đang xử lý..." : "Tiếp tục"}
              </button>

              <div className="ml-auto text-sm text-slate-500">Các trường bắt buộc được kiểm tra</div>
            </div>
          </form>
        </div>
        <aside className="bg-white rounded-xl shadow p-5 h-fit sticky top-6">
          <h3 className="text-lg font-semibold text-slate-800">Tóm tắt đơn hàng</h3>

          <div className="mt-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-sm text-slate-500">Giỏ hàng trống</div>
            ) : (
              items.map((it) => (
                <div key={it.id} className="flex items-center gap-3">
                  <img src={it.image || "/images/placeholder.png"} alt={it.title} className="w-14 h-14 object-cover rounded" onError={(e) => (e.target.src = "/images/placeholder.png")} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{it.title}</div>
                    <div className="text-xs text-slate-500">Số lượng: {it.qty}</div>
                  </div>
                  <div className="text-sm font-semibold">{(Number(it.price || 0) * Number(it.qty || 0)).toLocaleString("vi-VN")}₫</div>
                </div>
              ))
            )}
          </div>

          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between text-sm text-slate-600">
              <div>Tạm tính</div>
              <div>{totalAmount.toLocaleString("vi-VN")}₫</div>
            </div>

            <div className="flex justify-between text-sm text-slate-600 mt-2">
              <div>Phí vận chuyển</div>
              <div>{shippingFee.toLocaleString("vi-VN")}₫</div>
            </div>

            <div className="flex justify-between text-base font-semibold mt-3">
              <div>Tổng</div>
              <div className="text-indigo-600 text-lg">{grandTotal.toLocaleString("vi-VN")}₫</div>
            </div>

            <div className="mt-4">
              <button
                onClick={handleNext}
                disabled={!isValid || submitting}
                className={`w-full px-4 py-3 rounded-full text-white ${(!isValid || submitting) ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
              >
                {submitting ? "Đang xử lý..." : "Tiếp tục tới Xác nhận"}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
