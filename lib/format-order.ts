import { Order } from "./types";

export function formatOrderForTelegram(order: Order): string {
  const itemLines = order.items
    .map((ci) => `  • ${ci.quantity}x ${ci.item.name} — $${(ci.item.price * ci.quantity).toFixed(2)}`)
    .join("\n");

  const paymentLine =
    order.payment.method === "whish"
      ? `Whish (Ref: ${order.payment.whishReference || "N/A"})`
      : "Cash on Delivery";

  const lines = [
    `🔔 <b>NEW ORDER #${order.id}</b>`,
    "",
    `👤 <b>Customer:</b> ${escapeHtml(order.customer.name)}`,
    `📞 <b>Phone:</b> ${escapeHtml(order.customer.phone)}`,
    `📍 <b>Address:</b> ${escapeHtml(order.customer.address)}`,
    "",
    `🛒 <b>Items:</b>`,
    itemLines,
    "",
    `💰 <b>Total: $${order.total.toFixed(2)}</b>`,
    `💳 <b>Payment:</b> ${paymentLine}`,
  ];

  if (order.customer.notes) {
    lines.push("", `📝 <b>Notes:</b> ${escapeHtml(order.customer.notes)}`);
  }

  return lines.join("\n");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
