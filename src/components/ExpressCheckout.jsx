import React, { useEffect, useState } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { useUser } from "../utility/UserContext.jsx";
import apiUrl from "../utility/apiUrl"
import "../styles/ExpressCheckout.css"

const ExpressCheckout = ({ products }) => {
  const stripe = useStripe();
  const [sessionId, setSessionId] = useState(null);
  const { user } = useUser();

  // Function to create a checkout session
  const createCheckoutSession = async () => {
    const userId = user.uid
    const response = await fetch(apiUrl.postPaymentUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products, userId }),
    });

    const session = await response.json();
    setSessionId(session.sessionId);
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
    if (products && user?.uid) {
      createCheckoutSession();
    }
  }, [products, user?.uid]);

  return (
    sessionId ? (
      <button className="checkout-btn" onClick={handleCheckout}>
        Checkout with Stripe
      </button>
    ) : (
      <p className="checkout-btn">Loading...</p>
    )
  );
};

export default ExpressCheckout;
