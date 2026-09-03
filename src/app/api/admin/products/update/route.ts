import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, basePrice, isDiscountActive, discountedPrice, variantStocks } = body;
    const session = await getServerSession(authOptions);
    
    // Quick security check (ensure user is admin)
    // Uncomment this for production to secure the API!
    // if (!session || (session.user as any).role !== "ADMIN") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // 1. Update Product Details
    await prisma.product.update({
      where: { id: id },
      data: {
        basePrice,
        isDiscountActive,
        discountedPrice
      }
    });

    // 2. Update Variant Stocks
    // Since variants are individual rows, we use a transaction
    if (variantStocks && typeof variantStocks === "object") {
      const operations = Object.entries(variantStocks).map(([variantId, newStock]) => {
        return prisma.productVariant.update({
          where: { id: variantId },
          data: { stock: newStock as number }
        });
      });
      await prisma.$transaction(operations);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin Product Update Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
