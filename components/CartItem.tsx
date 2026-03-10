"use client";

import { CartItem as CartItemType } from "@/lib/types";
import { useCart } from "@/lib/cart-context";

export default function CartItemRow({ cartItem }: { cartItem: CartItemType }) {
  const { updateQuantity, removeItem } = useCart();
  const { item, quantity } = cartItem;

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-olive-200 bg-white p-4">
      <div className="flex-1">
        <h3 className="font-semibold text-olive-900">{item.name}</h3>
        <p className="text-sm text-olive-600">${item.price} each</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item.id, quantity - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-olive-300 text-olive-700 transition-colors hover:bg-olive-100"
        >
          -
        </button>
        <span className="w-8 text-center font-medium text-olive-900">
          {quantity}
        </span>
        <button
          onClick={() => updateQuantity(item.id, quantity + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-olive-300 text-olive-700 transition-colors hover:bg-olive-100"
        >
          +
        </button>
      </div>
      <div className="w-16 text-right font-bold text-olive-800">
        ${(item.price * quantity).toFixed(2)}
      </div>
      <button
        onClick={() => removeItem(item.id)}
        className="text-red-400 transition-colors hover:text-red-600"
        aria-label="Remove item"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
      </button>
    </div>
  );
}
