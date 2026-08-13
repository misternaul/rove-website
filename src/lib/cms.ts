import { Redis } from "@upstash/redis";
import { siteContent, SiteConfig } from "@/config/siteContent";
import fs from "fs";
import path from "path";

const REDIS_KEY = "rove_studio_content_v2";

/**
 * Automatically checks all common Vercel & Upstash environment variable conventions.
 * Whether linked via legacy Vercel KV or Upstash Marketplace integration, this finds the credentials!
 */
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

/**
 * Fetches current site content and active Drops.
 * Prioritizes live dynamic edits stored in Vercel Upstash Redis, falling back to local file codex.
 */
export async function getLiveSiteContent(): Promise<SiteConfig> {
  const redis = getRedisClient();
  if (redis) {
    try {
      const storedData = await redis.get<SiteConfig>(REDIS_KEY);
      if (storedData && storedData.drops) {
        // Merge with default structural properties in case new fields were added
        return { ...siteContent, ...storedData };
      }
    } catch (err) {
      console.warn("Notice: Could not query Upstash Redis, falling back to default siteContent:", err);
    }
  } else if (process.env.NODE_ENV === "development") {
    // In local dev without Redis, try reading from temporary cache JSON if present
    try {
      const cachePath = path.join(process.cwd(), ".next", "cms_cache.json");
      if (fs.existsSync(cachePath)) {
        const raw = fs.readFileSync(cachePath, "utf-8");
        return { ...siteContent, ...JSON.parse(raw) };
      }
    } catch {
      // Ignore cache error in dev
    }
  }
  return siteContent;
}

/**
 * Saves live administrative edits directly to Vercel storage without re-coding or rebuilding.
 */
export async function saveLiveSiteContent(newData: SiteConfig): Promise<{ success: boolean; message: string; code?: string }> {
  const redis = getRedisClient();

  if (!redis) {
    // If running locally on development studio, save to local cache so testing works immediately!
    if (process.env.NODE_ENV === "development") {
      try {
        const cacheDir = path.join(process.cwd(), ".next");
        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
        fs.writeFileSync(path.join(cacheDir, "cms_cache.json"), JSON.stringify(newData, null, 2));
        return {
          success: true,
          message: "Saved successfully to local Studio development cache! (Connect Upstash on Vercel for live domain cloud saving).",
        };
      } catch (e) {
        console.error("Dev cache write failure:", e);
      }
    }

    return {
      success: false,
      code: "NO_DATABASE_LINKED",
      message:
        "Upstash Redis is not linked in your Vercel project yet! To turn on 1-click cloud saving: 1) Go to your Vercel Dashboard -> rove-website. 2) Click the 'Storage' tab at the top -> 'Create Database' -> choose 'Upstash Redis' (100% Free). 3) Click 'Connect to Project' and hit 'Redeploy' once!",
    };
  }

  try {
    await redis.set(REDIS_KEY, newData);
    return {
      success: true,
      message: "✅ Live changes successfully broadcast to Rove Vercel Cloud! Your storefront is upgraded immediately.",
    };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Error writing to Upstash Redis:", error);
    return {
      success: false,
      code: "REDIS_WRITE_ERROR",
      message: error.message || "An error occurred while transmitting to Vercel Upstash Redis storage.",
    };
  }
}
