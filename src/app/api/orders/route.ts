import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const ORDERS_REDIS_KEY = "rove_orders_list";

function getRedisClient(): Redis | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL ||
    process.env.REDIS_REST_API_URL ||
    process.env.REDIS_URL;

  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    process.env.REDIS_REST_API_TOKEN ||
    process.env.REDIS_TOKEN;

  if (url && token && url.startsWith("http")) {
    try {
      return new Redis({ url, token });
    } catch (e) {
      console.warn("Could not initialize Upstash Redis client with provided env vars:", e);
      return null;
    }
  }
  return null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminSecret = searchParams.get("adminSecret");
    const expectedPin = process.env.STUDIO_ADMIN_PIN || "rovepresence0842";

    if (!adminSecret || adminSecret !== expectedPin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const redis = getRedisClient();
    if (!redis) {
      return NextResponse.json({ success: true, data: [] });
    }

    // Get all orders from the list
    const orders = await redis.lrange(ORDERS_REDIS_KEY, 0, -1);
    
    return NextResponse.json({ success: true, data: orders });
  } catch (error: unknown) {
    console.error("GET /api/orders Error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { action, orderId, adminSecret } = body;

    const expectedPin = process.env.STUDIO_ADMIN_PIN || "rovepresence0842";
    if (!adminSecret || adminSecret !== expectedPin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const redis = getRedisClient();
    if (!redis) {
      return NextResponse.json({ error: "No Database linked" }, { status: 503 });
    }

    if (action === "clear_all") {
      await redis.del(ORDERS_REDIS_KEY);
      return NextResponse.json({ success: true, message: "All orders cleared" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    return NextResponse.json({ error: "Failed to process order action" }, { status: 500 });
  }
}
