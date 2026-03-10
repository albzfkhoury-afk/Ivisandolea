"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { PaymentMethod } from "@/lib/types";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [whishReference, setWhishReference] = useState("");

  const whishNumber = process.env.NEXT_PUBLIC_WHISH_NUMBER || "XX XXX XXX";

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <p className="mb-4 text-olive-600">Your cart is empty.</p>
        <Link
          href="/menu"
          className="rounded-full bg-olive-800 px-6 py-3 font-medium text-cream"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (paymentMethod === "whish" && !whishReference.trim()) {
      setError("Please enter your Whish payment reference.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((ci) => ({
            itemId: ci.item.id,
            quantity: ci.quantity,
          })),
          customer: {
            name: name.trim(),
            phone: phone.trim(),
            address: address.trim(),
            notes: notes.trim() || undefined,
          },
          payment: {
            method: paymentMethod,
            whishReference:
              paymentMethod === "whish" ? whishReference.trim() : undefined,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to place order. Please try again.");
        setSubmitting(false);
        return;
      }

      clearCart();
      router.push(`/order-confirmed?id=${data.orderId}`);
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="py-6">
      <h1 className="mb-6 text-2xl font-bold text-olive-900">Checkout</h1>

      {/* Order summary */}
      <div className="mb-6 rounded-lg border border-olive-200 bg-white p-4">
        <h2 className="mb-3 font-semibold text-olive-900">Order Summary</h2>
        {items.map((ci) => (
          <div
            key={ci.item.id}
            className="flex justify-between text-sm text-olive-700"
          >
            <span>
              {ci.quantity}x {ci.item.name}
            </span>
            <span>${(ci.item.price * ci.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="mt-3 border-t border-olive-100 pt-3">
          <div className="flex justify-between font-bold text-olive-900">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Delivery details */}
        <div className="rounded-lg border border-olive-200 bg-white p-4">
          <h2 className="mb-4 font-semibold text-olive-900">
            Delivery Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-olive-700">
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-olive-200 bg-cream px-3 py-2 text-olive-900 outline-none focus:border-olive-500 focus:ring-1 focus:ring-olive-500"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-olive-700">
                Phone Number *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-olive-200 bg-cream px-3 py-2 text-olive-900 outline-none focus:border-olive-500 focus:ring-1 focus:ring-olive-500"
                placeholder="+961 XX XXX XXX"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-olive-700">
                Delivery Address *
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-lg border border-olive-200 bg-cream px-3 py-2 text-olive-900 outline-none focus:border-olive-500 focus:ring-1 focus:ring-olive-500"
                placeholder="Building, street, area..."
                rows={3}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-olive-700">
                Delivery Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-lg border border-olive-200 bg-cream px-3 py-2 text-olive-900 outline-none focus:border-olive-500 focus:ring-1 focus:ring-olive-500"
                placeholder="Floor number, landmarks, special instructions..."
              />
            </div>
          </div>
        </div>

        {/* Payment method */}
        <div className="rounded-lg border border-olive-200 bg-white p-4">
          <h2 className="mb-4 font-semibold text-olive-900">Payment Method</h2>
          <div className="space-y-3">
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-olive-200 p-3 transition-colors has-[:checked]:border-olive-600 has-[:checked]:bg-olive-50">
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
                className="accent-olive-800"
              />
              <div>
                <div className="font-medium text-olive-900">
                  Cash on Delivery
                </div>
                <div className="text-sm text-olive-600">
                  Pay when your order arrives
                </div>
              </div>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-olive-200 p-3 transition-colors has-[:checked]:border-olive-600 has-[:checked]:bg-olive-50">
              <input
                type="radio"
                name="payment"
                value="whish"
                checked={paymentMethod === "whish"}
                onChange={() => setPaymentMethod("whish")}
                className="accent-olive-800"
              />
              <div>
                <div className="font-medium text-olive-900">
                  Pay with Whish
                </div>
                <div className="text-sm text-olive-600">
                  Send payment via Whish app
                </div>
              </div>
            </label>
          </div>

          {paymentMethod === "whish" && (
            <div className="mt-4 rounded-lg bg-olive-50 p-4">
              <p className="mb-2 text-sm text-olive-700">
                Please send{" "}
                <span className="font-bold">${totalPrice.toFixed(2)}</span> to:
              </p>
              <p className="mb-3 text-xl font-bold text-olive-900">
                {whishNumber}
              </p>
              <p className="mb-3 text-sm text-olive-600">
                Open your Whish app, send the amount to the number above, then
                enter the reference number below.
              </p>
              <div>
                <label className="mb-1 block text-sm font-medium text-olive-700">
                  Whish Reference Number *
                </label>
                <input
                  type="text"
                  value={whishReference}
                  onChange={(e) => setWhishReference(e.target.value)}
                  className="w-full rounded-lg border border-olive-200 bg-white px-3 py-2 text-olive-900 outline-none focus:border-olive-500 focus:ring-1 focus:ring-olive-500"
                  placeholder="Enter your Whish transaction reference"
                />
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-olive-800 py-3 text-lg font-semibold text-cream transition-colors hover:bg-olive-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
