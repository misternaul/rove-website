import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: "Filename is required" }, { status: 400 });
  }

  if (!request.body) {
    return NextResponse.json({ error: "Request body is required" }, { status: 400 });
  }

  try {
    const blob = await put(filename, request.body, {
      access: 'public',
    });

    return NextResponse.json(blob);
  } catch (error: any) {
    console.error("Vercel Blob Upload Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
