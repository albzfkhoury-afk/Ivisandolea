import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold tracking-widest text-olive-900">
          IVIS & OLEA
        </h1>
        <p className="text-lg text-olive-600">
          Beirut&apos;s Irish-inspired bar & restaurant
        </p>
      </div>

      <p className="mb-8 max-w-md text-olive-700">
        Browse our menu and order your favorite food and drinks for delivery.
        Pay with cash on delivery or via Whish.
      </p>

      <Link
        href="/menu"
        className="rounded-full bg-olive-800 px-8 py-3 text-lg font-semibold text-cream transition-colors hover:bg-olive-900"
      >
        View Menu & Order
      </Link>

      <div className="mt-12 flex gap-8 text-sm text-olive-500">
        <div className="text-center">
          <div className="mb-1 text-2xl">🍕</div>
          <div>Pizzas & Food</div>
        </div>
        <div className="text-center">
          <div className="mb-1 text-2xl">🍸</div>
          <div>Cocktails</div>
        </div>
        <div className="text-center">
          <div className="mb-1 text-2xl">🚚</div>
          <div>Delivery</div>
        </div>
      </div>
    </div>
  );
}
