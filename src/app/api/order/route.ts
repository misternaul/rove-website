import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { cartItems, fullName, phone, email, city, primaryAddress, secondaryAddress, notes, formattedTotalPrice } = body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Process the entire order in a Prisma Transaction
    const order = await prisma.$transaction(async (tx) => {
      
      // 1. Validate stock and prepare order items
      const orderItemsToCreate = [];
      
      for (const item of cartItems) {
        // Here, item.id is the ProductVariant ID
        const variant = await tx.productVariant.findUnique({
          where: { id: item.id },
          include: { product: true }
        });

        if (!variant) {
          throw new Error(`Variant not found: ${item.color} ${item.size}`);
        }

        if (variant.stock < item.quantity) {
          throw new Error(`Not enough stock for ${variant.product.name} (${variant.colorName}, ${variant.size})`);
        }

        // Decrement stock
        await tx.productVariant.update({
          where: { id: variant.id },
          data: { stock: { decrement: item.quantity } }
        });

        orderItemsToCreate.push({
          quantity: item.quantity,
          priceAtBuy: item.priceNumeric, // item.priceNumeric not item.price
          variantId: variant.id,
        });
      }

      // 2. Create the Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber: `ROVE-${Math.floor(10000 + Math.random() * 90000)}`,
          totalAmount: parseFloat(formattedTotalPrice.replace(/[^0-9.-]+/g,"")), // Quick parse of the total string
          status: 'PENDING',
          email: email,
          phone: phone,
          fullName: fullName,
          address: primaryAddress + (secondaryAddress ? `, ${secondaryAddress}` : ''),
          city: city,
          province: '',
          postalCode: null,
          notes: notes || null,
          userId: session?.user?.email ? (await tx.user.findUnique({ where: { email: session.user.email } }))?.id : null,
          items: {
            create: orderItemsToCreate
          }
        },
      });

      // 3. If user is logged in but not a ROVER yet, we could trigger rover status here,
      // but the instructions said "Whenever a customer successfully purchases a product, show a beautiful post-purchase invitation". 
      // We'll handle the Rover upgrade in the UI/client flow.

      return newOrder;
    });

    return NextResponse.json({ success: true, orderId: order.id, orderNumber: order.orderNumber });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process checkout' }, { status: 500 });
  }
}
