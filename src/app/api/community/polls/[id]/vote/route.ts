import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: any }) {
  try {
    const { id: pollId } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { optionId } = await req.json();
    if (!optionId) {
      return NextResponse.json({ error: "Missing optionId" }, { status: 400 });
    }

    // Use PollVote to record the user's vote
    await prisma.pollVote.create({
      data: {
        userId: (session.user as any).id,
        optionId: optionId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Poll vote error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
