"use client";

import { useState } from "react";
import { MenuItem as MenuItemType } from "@/lib/types";
import { useCart } from "@/lib/cart-context";

export default function MenuItemCard({ item }: { item: MenuItemType }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 800);
  };

  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-olive-200 bg-white p-4 transition-shadow hover:shadow-md">
      <div className="flex-1">
        <h3 className="font-semibold text-olive-900">{item.name}</h3>
        <p className="mt-1 text-sm text-olive-600">{item.description}</p>
        <p className="mt-2 font-bold text-olive-800">${item.price}</p>
      </div>
      <button
        onClick={handleAdd}
        className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
          added
            ? "bg-green-600 text-white"
            : "bg-olive-800 text-cream hover:bg-olive-900"
        }`}
      >
        {added ? "Added!" : "Add"}
      </button>
    </div>
  );
}
