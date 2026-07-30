import { Redis } from "@upstash/redis";
import { siteContent, SiteConfig } from "@/config/siteContent";

const REDIS_KEY = "rove_studio_content";

/**
 * Returns an Upstash Redis client instance if credentials are configured in Vercel Environment Variables.
 */
function getRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    return new Redis({ url, token });
  }
  return null;
}

/**
 * Fetches current site content and active Drops.
 * Prioritizes live dynamic edits stored in Vercel Upstash Redis, falling back to local file configuration.
 */
export async function getLiveSiteContent(): Promise<SiteConfig> {
  const redis = getRedisClient();
  if (redis) {
    try {
      const storedData = await redis.get<SiteConfig>(REDIS_KEY);
      if (storedData) {
        // Merge with defaults in case structural keys were updated
        return { ...siteContent, ...storedData };
      }
    } catch (err) {
      console.warn("Failed to retrieve live data from Upstash Redis, defaulting to siteContent.ts:", err);
    }
  }
  return siteContent;
}

/**
 * Saves live administrative edits directly to Vercel storage without re-coding or rebuilding.
 */
export async function saveLiveSiteContent(newData: SiteConfig): Promise<{ success: boolean; message: string }> {
  const redis = getRedisClient();
  if (!redis) {
    return {
      success: false,
      message: "Upstash Redis database not linked in Vercel yet. Please check Vercel Storage instructions in your Admin Dashboard to enable 1-click cloud saving.",
    };
  }

  try {
    await redis.set(REDIS_KEY, newData);
    return {
      success: true,
      message: "Live changes successfully committed to Rove Cloud Engine! Your storefront is updated.",
    };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Error writing to Upstash Redis:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred while saving to Vercel storage.",
    };
  }
}
