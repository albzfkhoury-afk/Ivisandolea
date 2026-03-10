import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "IVIS & OLEA — Order Online",
  description:
    "Order food and drinks online from Ivis & Olea, Beirut. Pizzas, salads, cocktails & more. Delivery to your door.",
  openGraph: {
    title: "IVIS & OLEA — Order Online",
    description:
      "Order food and drinks online from Ivis & Olea, Beirut. Pizzas, salads, cocktails & more.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>
          <Header />
          <main className="mx-auto max-w-4xl px-4 pb-24">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
