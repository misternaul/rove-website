import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { getLiveSiteContent, saveLiveSiteContent } from "@/lib/cms";
import { revalidatePath } from "next/cache";

const OLD_ORDERS_KEY = "rove_orders_list";
const ORDERS_HASH_KEY = "rove_orders";

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

    // Migration Logic: Check if the old list exists
    const oldOrders = await redis.lrange(OLD_ORDERS_KEY, 0, -1);
    if (oldOrders && oldOrders.length > 0) {
      console.log(`Migrating ${oldOrders.length} orders to new Hash schema...`);
      for (const rawOrder of oldOrders) {
        const parsed = typeof rawOrder === 'string' ? JSON.parse(rawOrder) : rawOrder;
        if (parsed && parsed.orderId) {
          parsed.status = "pending";
          await redis.hset(ORDERS_HASH_KEY, { [parsed.orderId]: parsed });
        }
      }
      await redis.del(OLD_ORDERS_KEY);
      console.log("Migration complete.");
    }

    // Fetch all orders from the hash
    const allOrdersHash = await redis.hgetall(ORDERS_HASH_KEY);
    
    // Convert hash values to array and parse if needed
    const ordersArray = allOrdersHash ? Object.values(allOrdersHash).map(val => typeof val === 'string' ? JSON.parse(val) : val) : [];

    // Sort by timestamp descending (newest first)
    ordersArray.sort((a: any, b: any) => {
      // Very basic date parsing fallback in case string formats differ
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
    
    return NextResponse.json({ success: true, data: ordersArray });
  } catch (error: unknown) {
    console.error("GET /api/orders Error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { action, orderId, adminSecret, newStatus } = body;

    const expectedPin = process.env.STUDIO_ADMIN_PIN || "rovepresence0842";
    if (!adminSecret || adminSecret !== expectedPin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const redis = getRedisClient();
    if (!redis) {
      return NextResponse.json({ error: "No Database linked" }, { status: 503 });
    }

    if (action === "clear_all") {
      await redis.del(ORDERS_HASH_KEY);
      return NextResponse.json({ success: true, message: "All orders cleared" });
    }

    if (action === "update_status" && orderId && newStatus) {
      const rawOrder = await redis.hget(ORDERS_HASH_KEY, orderId);
      if (!rawOrder) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      const orderData = typeof rawOrder === 'string' ? JSON.parse(rawOrder) : rawOrder;
      const oldStatus = orderData.status;
      orderData.status = newStatus;

      await redis.hset(ORDERS_HASH_KEY, { [orderId]: orderData });

      // If order is canceled, refund inventory!
      if (newStatus === "canceled" && oldStatus !== "canceled") {
        const liveConfig = await getLiveSiteContent();
        let stockRefunded = false;

        orderData.items.forEach((item: any) => {
          const dropIdx = liveConfig.drops.findIndex((d: any) => d.id === item.dropId);
          if (dropIdx !== -1) {
            const colorIdx = liveConfig.drops[dropIdx].colors.findIndex((c: any) => c.id === item.colorId);
            if (colorIdx !== -1) {
              const sizeIdx = liveConfig.drops[dropIdx].colors[colorIdx].sizes.findIndex((s: any) => s.id === item.sizeId);
              if (sizeIdx !== -1) {
                const sizeData = liveConfig.drops[dropIdx].colors[colorIdx].sizes[sizeIdx];
                sizeData.stockQuantity = (sizeData.stockQuantity || 0) + item.quantity;
                stockRefunded = true;
              }
            }
          }
        });

        if (stockRefunded) {
          await saveLiveSiteContent(liveConfig);
          revalidatePath("/", "layout");
          console.log(`Refunded inventory for canceled order ${orderId}`);
        }
      }

      return NextResponse.json({ success: true, message: `Order updated to ${newStatus}` });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    console.error("PUT /api/orders Error:", error);
    return NextResponse.json({ error: "Failed to process order action" }, { status: 500 });
  }
}
