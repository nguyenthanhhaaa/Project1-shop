import React, { createContext, useContext, useState, useEffect } from "react";

const CheckoutContext = createContext(null);

export function CheckoutProvider({ children }) {
  const [shipping, setShipping] = useState(() => {
    try {
      const raw = localStorage.getItem("checkout_shipping_v1");
      return raw ? JSON.parse(raw) : { fullName: "", email: "", phone: "", address: "", paymentMethod: "cod" };
    } catch (e) {
      return { fullName: "", email: "", phone: "", address: "", paymentMethod: "cod" };
    }
  });

  const [notes, setNotes] = useState(() => {
    try {
      return localStorage.getItem("checkout_notes_v1") || "";
    } catch (e) {
      return "";
    }
  });

  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    try { localStorage.setItem("checkout_shipping_v1", JSON.stringify(shipping)); } catch(e){}
  }, [shipping]);

  useEffect(() => {
    try { localStorage.setItem("checkout_notes_v1", notes); } catch(e){}
  }, [notes]);

  return (
    <CheckoutContext.Provider value={{ shipping, setShipping, notes, setNotes, currentStep, setCurrentStep }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used within CheckoutProvider");
  return ctx;
}
