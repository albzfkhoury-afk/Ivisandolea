import { NextRequest, NextResponse } from "next/server";
import { getMenu, saveMenu } from "@/lib/kv";
import { MenuItem } from "@/lib/types";
import { verifyAdminToken } from "@/lib/auth";

export async function GET() {
  const items = await getMenu();
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const authError = await verifyAdminToken(request);
  if (authError) return authError;

  const body = await request.json();
  const { name, description, price, category, subcategory, available } = body;

  if (!name || !description || price == null || !category) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const items = await getMenu();
  const newItem: MenuItem = {
    id: `item-${Date.now()}`,
    name,
    description,
    price: Number(price),
    category,
    subcategory: subcategory || undefined,
    available: available !== false,
  };

  items.push(newItem);
  await saveMenu(items);

  return NextResponse.json(newItem, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const authError = await verifyAdminToken(request);
  if (authError) return authError;

  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "Item ID required" }, { status: 400 });
  }

  const items = await getMenu();
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  items[index] = { ...items[index], ...updates };
  await saveMenu(items);

  return NextResponse.json(items[index]);
}

export async function DELETE(request: NextRequest) {
  const authError = await verifyAdminToken(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Item ID required" }, { status: 400 });
  }

  const items = await getMenu();
  const filtered = items.filter((item) => item.id !== id);

  if (filtered.length === items.length) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  await saveMenu(filtered);
  return NextResponse.json({ success: true });
}
