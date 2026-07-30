import { NextResponse } from "next/server";
import { getLiveSiteContent, saveLiveSiteContent } from "@/lib/cms";
import { siteContent } from "@/config/siteContent";

export async function GET() {
  try {
    const data = await getLiveSiteContent();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/cms Error:", error);
    return NextResponse.json({ success: false, data: siteContent, error: "Using default file codex" }, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, updatedData, adminSecret } = body;

    // Secure Studio Admin PIN requested by founder
    const expectedPin = process.env.STUDIO_ADMIN_PIN || "rovepresence0842";
    if (!adminSecret || adminSecret !== expectedPin) {
      return NextResponse.json({ error: "Invalid Studio PIN / Authorization. Please enter rovepresence0842" }, { status: 401 });
    }

    if (action === "reset") {
      const result = await saveLiveSiteContent(siteContent);
      return NextResponse.json(result);
    }

    if (!updatedData) {
      return NextResponse.json({ error: "Missing payload to update" }, { status: 400 });
    }

    const result = await saveLiveSiteContent(updatedData);
    if (!result.success) {
      return NextResponse.json({ error: result.message, code: result.code }, { status: 503 });
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    const error = err as Error;
    console.error("POST /api/cms Error:", error);
    return NextResponse.json({ error: error.message || "Server error while updating CMS data" }, { status: 500 });
  }
}
