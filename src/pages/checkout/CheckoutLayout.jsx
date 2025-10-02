import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import CheckoutStepper from "../../components/CheckoutStepper";
import { useCheckout } from "../../context/CheckoutContext";

export default function CheckoutLayout() {
  const { setCurrentStep } = useCheckout();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("/checkout/review")) setCurrentStep(1);
    else if (location.pathname.includes("/checkout/shipping")) setCurrentStep(2);
    else if (location.pathname.includes("/checkout/confirm")) setCurrentStep(3);
  }, [location.pathname]);

  const step = location.pathname.includes("/checkout/shipping")
    ? 2
    : location.pathname.includes("/checkout/confirm")
    ? 3
    : 1;

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <CheckoutStepper step={step} />
      <Outlet />
    </section>
  );
}
