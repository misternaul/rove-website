import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const images = await prisma.lookbookImage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url, caption } = await req.json();
    const image = await prisma.lookbookImage.create({
      data: { url, caption },
    });
    return NextResponse.json(image);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create image" }, { status: 500 });
  }
}
