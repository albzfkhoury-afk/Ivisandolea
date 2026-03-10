"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OrderConfirmedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id") || "N/A";

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <div className="mb-6 text-6xl">✅</div>
      <h1 className="mb-2 text-3xl font-bold text-olive-900">
        Order Confirmed!
      </h1>
      <p className="mb-1 text-olive-600">
        Order <span className="font-mono font-bold">#{orderId}</span>
      </p>
      <p className="mb-8 max-w-sm text-olive-600">
        Your order has been received! We&apos;ll contact you shortly to confirm
        delivery details.
      </p>

      <div className="flex flex-col gap-3">
        <Link
          href="/menu"
          className="rounded-full bg-olive-800 px-8 py-3 font-semibold text-cream transition-colors hover:bg-olive-900"
        >
          Order Again
        </Link>
        <Link
          href="/"
          className="rounded-full border border-olive-300 px-8 py-3 font-medium text-olive-700 transition-colors hover:bg-olive-50"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-olive-600">Loading...</div>
        </div>
      }
    >
      <OrderConfirmedContent />
    </Suspense>
  );
}
