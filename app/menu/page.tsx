"use client";

import { useEffect, useState, useRef } from "react";
import { MenuItem, CATEGORIES } from "@/lib/types";
import MenuCategory from "@/components/MenuCategory";
import { useCart } from "@/lib/cart-context";
import Link from "next/link";

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const { totalItems, totalPrice } = useCart();
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const availableItems = items.filter((i) => i.available);

  // Only show categories that have available items
  const activeCategories = CATEGORIES.filter((cat) =>
    availableItems.some((item) => item.category === cat.id)
  );

  const foodCategories = activeCategories.filter((c) => c.type === "food");
  const drinkCategories = activeCategories.filter((c) => c.type === "drink");

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    const el = document.getElementById(
      `category-${categoryId}`
    );
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-olive-600">Loading menu...</div>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Category tabs */}
      <div
        ref={tabsRef}
        className="sticky top-[57px] z-40 -mx-4 mb-6 overflow-x-auto bg-cream/95 px-4 py-3 backdrop-blur-sm"
      >
        {foodCategories.length > 0 && (
          <div className="mb-2">
            <span className="mr-2 text-xs font-semibold uppercase tracking-wider text-olive-500">
              Food
            </span>
            <div className="inline-flex gap-2">
              {foodCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.id)}
                  className={`whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                    activeCategory === cat.id
                      ? "bg-olive-800 text-cream"
                      : "bg-olive-100 text-olive-700 hover:bg-olive-200"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}
        {drinkCategories.length > 0 && (
          <div>
            <span className="mr-2 text-xs font-semibold uppercase tracking-wider text-olive-500">
              Drinks
            </span>
            <div className="inline-flex gap-2">
              {drinkCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.id)}
                  className={`whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                    activeCategory === cat.id
                      ? "bg-olive-800 text-cream"
                      : "bg-olive-100 text-olive-700 hover:bg-olive-200"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Menu sections */}
      <div className="space-y-8">
        {activeCategories.map((cat) => (
          <MenuCategory
            key={cat.id}
            name={cat.name}
            items={availableItems.filter((item) => item.category === cat.id)}
          />
        ))}
      </div>

      {/* Floating cart button */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
          <Link
            href="/cart"
            className="flex items-center gap-3 rounded-full bg-olive-800 px-6 py-3 text-cream shadow-lg transition-transform hover:scale-105"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cream text-sm font-bold text-olive-800">
              {totalItems}
            </span>
            <span className="font-medium">View Cart</span>
            <span className="font-bold">${totalPrice.toFixed(2)}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
