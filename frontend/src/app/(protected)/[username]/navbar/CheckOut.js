"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { handleCreatePayment } from "@/fetchers";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

function CheckoutForm({ onClose }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      const amount = 1000;
      const data = await handleCreatePayment(amount);

      if (!data?.clientSecret)
        throw new Error(data?.error || "No client secret");

      const card = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card },
      });

      if (result.error) {
        alert("Payment failed: " + result.error.message);
      } else if (result.paymentIntent?.status === "succeeded") {
        alert("✅ Payment successful (test mode)!");
        onClose();
      } else {
        alert("Payment status: " + result.paymentIntent?.status);
      }
    } catch (err) {
      console.error(err);
      alert("Error: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-card w-full max-w-md rounded-2xl shadow-lg border border-border p-6 relative">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 text-muted hover:text-foreground cursor-pointer"
        disabled={loading}
      >
        <X size={20} />
      </button>

      <h2 className="text-2xl font-semibold mb-4">Subscribe</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="text-sm font-medium">Card details</label>
        <div className="border border-border p-3 rounded-md">
          <CardElement
            options={{
              hidePostalCode: true,
              style: {
                base: {
                  color: "#fff",
                  fontSize: "16px",
                  fontFamily: "inherit",
                  "::placeholder": {
                    color: "#9ca3af",
                  },
                },
                invalid: {
                  color: "#ef4444",
                },
              },
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-60 hover:bg-blue-700 transition font-medium cursor-pointer"
        >
          {loading ? "Processing..." : "Pay $10 (test)"}
        </button>
      </form>
    </div>
  );
}

export default function CheckoutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Elements stripe={stripePromise}>
        <CheckoutForm onClose={onClose} />
      </Elements>
    </div>
  );
}
