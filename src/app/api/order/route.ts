import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      fullName, phone, email, city, primaryAddress, 
      secondaryAddress, landmark, notes, cartItems, formattedTotalPrice 
    } = body;

    const orderNumber = `ROVE-${Math.floor(100000 + Math.random() * 900000)}`;

    // Send transactional emails via Resend (fire and forget to not block response)
    if (process.env.RESEND_API_KEY) {
      // Alert to admin
      import('resend').then(async ({ Resend }) => {
        const resend = new Resend(process.env.RESEND_API_KEY);
        try {
          await resend.emails.send({
            from: 'ROVE Studio <hello@rovepresence.com>',
            to: 'rovepresence@gmail.com',
            subject: `NEW ORDER: ${orderNumber}`,
            html: `<p>New order received for ${formattedTotalPrice} from ${fullName} (${email}).</p>`
          });
        } catch (e) {
          console.error("Resend Email Error:", e);
        }
      });
    }

    return NextResponse.json({ success: true, orderId: orderNumber, orderNumber });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
