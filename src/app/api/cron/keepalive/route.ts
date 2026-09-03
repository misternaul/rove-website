import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // A simple, lightweight query to wake up / keep the database alive
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ success: true, message: "Database is awake." });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to ping database." }, { status: 500 });
  }
}
