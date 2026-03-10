import { NextRequest, NextResponse } from "next/server";
import { getMenu } from "@/lib/kv";
import { CartItem, Order } from "@/lib/types";
import { formatOrderForTelegram } from "@/lib/format-order";
import { sendTelegramMessage } from "@/lib/telegram";

interface OrderRequestItem {
  itemId: string;
  quantity: number;
}

interface OrderRequestBody {
  items: OrderRequestItem[];
  customer: {
    name: string;
    phone: string;
    address: string;
    notes?: string;
  };
  payment: {
    method: "cash" | "whish";
    whishReference?: string;
  };
}

export async function POST(request: NextRequest) {
  let body: OrderRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { items: requestItems, customer, payment } = body;

  // Validate required fields
  if (!requestItems?.length) {
    return NextResponse.json({ error: "No items in order" }, { status: 400 });
  }
  if (!customer?.name?.trim() || !customer?.phone?.trim() || !customer?.address?.trim()) {
    return NextResponse.json({ error: "Missing customer details" }, { status: 400 });
  }
  if (!payment?.method || !["cash", "whish"].includes(payment.method)) {
    return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
  }
  if (payment.method === "whish" && !payment.whishReference?.trim()) {
    return NextResponse.json({ error: "Whish reference required" }, { status: 400 });
  }

  // Resolve items from menu
  const menu = await getMenu();
  const menuMap = new Map(menu.map((item) => [item.id, item]));

  const cartItems: CartItem[] = [];
  for (const ri of requestItems) {
    const menuItem = menuMap.get(ri.itemId);
    if (!menuItem) {
      return NextResponse.json(
        { error: `Item not found: ${ri.itemId}` },
        { status: 400 }
      );
    }
    if (!menuItem.available) {
      return NextResponse.json(
        { error: `Item unavailable: ${menuItem.name}` },
        { status: 400 }
      );
    }
    if (ri.quantity < 1 || ri.quantity > 50) {
      return NextResponse.json(
        { error: `Invalid quantity for ${menuItem.name}` },
        { status: 400 }
      );
    }
    cartItems.push({ item: menuItem, quantity: ri.quantity });
  }

  // Calculate total server-side
  const total = cartItems.reduce(
    (sum, ci) => sum + ci.item.price * ci.quantity,
    0
  );

  // Generate order ID
  const orderId = `IO-${Date.now().toString(36).toUpperCase()}`;

  const order: Order = {
    id: orderId,
    items: cartItems,
    customer: {
      name: customer.name.trim(),
      phone: customer.phone.trim(),
      address: customer.address.trim(),
      notes: customer.notes?.trim() || undefined,
    },
    payment: {
      method: payment.method,
      whishReference: payment.whishReference?.trim() || undefined,
    },
    total,
    createdAt: new Date().toISOString(),
  };

  // Send to Telegram
  const message = formatOrderForTelegram(order);
  const sent = await sendTelegramMessage(message);

  if (!sent) {
    console.error("Failed to send Telegram notification for order:", orderId);
    // Still return success — the order was placed, notification just failed
  }

  return NextResponse.json({ orderId, total });
}
