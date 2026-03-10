"use client";

import { MenuItem as MenuItemType } from "@/lib/types";
import MenuItemCard from "./MenuItem";

interface Props {
  name: string;
  items: MenuItemType[];
}

export default function MenuCategory({ name, items }: Props) {
  if (items.length === 0) return null;

  return (
    <section id={`category-${name.toLowerCase().replace(/\s+/g, "-")}`} className="scroll-mt-28">
      <h2 className="mb-4 text-xl font-bold tracking-wide text-olive-900 uppercase">
        {name}
      </h2>
      <div className="space-y-3">
        {items.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
