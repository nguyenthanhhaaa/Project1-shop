import React from "react";
import { Link } from "react-router-dom";

export default function CheckoutStepper({ step = 1 }) {
  const steps = [
    { id: 1, label: "1. Xem giỏ", to: "/checkout" },
    { id: 2, label: "2. Thông tin & Thanh toán", to: "/checkout/shipping" },
    { id: 3, label: "3. Xác nhận", to: "/checkout/confirm" }
  ];

  const navStyle = { background: "#fff", borderRadius: 8, padding: 12, marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" };
  const listStyle = { display: "flex", gap: 12, alignItems: "center", listStyle: "none", padding: 0, margin: 0 };
  const linkBase = { display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 8, textDecoration: "none" };

  return (
    <nav aria-label="Tiến trình đặt hàng" style={navStyle}>
      <ol style={listStyle}>
        {steps.map(s => {
          const isActive = s.id === step;
          const isDone = s.id < step;
          const style = {
            ...linkBase,
            background: isActive ? "#3730A3" : isDone ? "#ECFDF5" : "#F8FAFC",
            color: isActive ? "#fff" : isDone ? "#065F46" : "#0F172A"
          };
          return (
            <li key={s.id}>
              <Link to={s.to} style={style}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{s.label}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
