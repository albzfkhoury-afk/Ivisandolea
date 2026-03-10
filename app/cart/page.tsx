"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import CartItemRow from "@/components/CartItem";

export default function CartPage() {
  const { items, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-4 text-6xl">🛒</div>
        <h1 className="mb-2 text-2xl font-bold text-olive-900">
          Your cart is empty
        </h1>
        <p className="mb-6 text-olive-600">
          Add some delicious items from our menu!
        </p>
        <Link
          href="/menu"
          className="rounded-full bg-olive-800 px-6 py-3 font-medium text-cream transition-colors hover:bg-olive-900"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-olive-900">Your Cart</h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:text-red-700"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-3">
        {items.map((cartItem) => (
          <CartItemRow key={cartItem.item.id} cartItem={cartItem} />
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-olive-200 bg-white p-4">
        <div className="flex items-center justify-between text-lg font-bold text-olive-900">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <Link
          href="/checkout"
          className="rounded-full bg-olive-800 py-3 text-center text-lg font-semibold text-cream transition-colors hover:bg-olive-900"
        >
          Proceed to Checkout
        </Link>
        <Link
          href="/menu"
          className="rounded-full border border-olive-300 py-3 text-center font-medium text-olive-700 transition-colors hover:bg-olive-50"
        >
          Add More Items
        </Link>
      </div>
    </div>
  );
}
