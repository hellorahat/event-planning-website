import React, { useEffect, useState } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import apiUrl from "../utility/apiUrl"

const ExpressCheckout = ({ products, amount }) => {
  const stripe = useStripe();
  const [sessionId, setSessionId] = useState(null);

  // Function to create a checkout session
  const createCheckoutSession = async () => {
    const response = await fetch(apiUrl.postPaymentUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products }),
    });

    const session = await response.json();
    setSessionId(session.id);
  };

  // Handle button click to redirect to Stripe Checkout
  const handleCheckout = async () => {
    if (sessionId && stripe) {
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        console.error("Error redirecting to checkout: ", error);
      }
    }
  };

  // When the session ID is ready, enable the checkout button
  useEffect(() => {
    if (amount) {
      createCheckoutSession();
    }
  }, [amount]);

  return (
    sessionId ? (
      <button onClick={handleCheckout}>
        Checkout with Stripe
      </button>
    ) : (
      <p>Loading...</p>
    )
  );
};

export default ExpressCheckout;
