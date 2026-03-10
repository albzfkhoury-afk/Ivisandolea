import { MenuItem } from "./types";
import { seedMenuItems } from "./seed-menu";

// In production, use Upstash Redis. In development (no credentials), use in-memory fallback.
let inMemoryMenu: MenuItem[] | null = null;

function getRedis() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return null;
  }

  // Dynamic import to avoid errors when credentials aren't set
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Redis } = require("@upstash/redis");
  return new Redis({ url, token });
}

export async function getMenu(): Promise<MenuItem[]> {
  const redis = getRedis();

  if (!redis) {
    // Fallback to in-memory for local development
    if (!inMemoryMenu) {
      inMemoryMenu = [...seedMenuItems];
    }
    return inMemoryMenu;
  }

  const items = (await redis.get("menu:items")) as MenuItem[] | null;
  if (!items) {
    // Seed on first access
    await redis.set("menu:items", seedMenuItems);
    return seedMenuItems;
  }
  return items;
}

export async function saveMenu(items: MenuItem[]): Promise<void> {
  const redis = getRedis();

  if (!redis) {
    inMemoryMenu = items;
    return;
  }

  await redis.set("menu:items", items);
}
