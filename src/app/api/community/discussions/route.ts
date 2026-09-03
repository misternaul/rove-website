import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const discussion = await prisma.discussion.create({
      data: {
        title,
        content,
        authorId: (session.user as any).id
      }
    });

    return NextResponse.json({ success: true, data: discussion });
  } catch (error: any) {
    console.error("Discussion create error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
