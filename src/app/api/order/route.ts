import { NextResponse } from "next/server";
import { getLiveSiteContent } from "@/lib/cms";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      phone,
      city,
      primaryAddress,
      secondaryAddress,
      landmark,
      notes,
      productName,
      selectedColor,
      selectedSize,
      priceFormatted,
      email,
    } = body;

    if (!fullName || !phone || !city || !primaryAddress) {
      return NextResponse.json(
        { error: "Full Name, Phone Number, City, and Primary Address are required to complete your order." },
        { status: 400 }
      );
    }

    const orderId = `ROVE-${Math.floor(100000 + Math.random() * 900000)}`;
    const timestamp = new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" });

    const liveConfig = await getLiveSiteContent();
    const adminEmail = process.env.ADMIN_EMAIL || liveConfig.brand.founderEmail || "orders@rovepresence.com";

    // Construct the formatted notification text for the founder
    const orderSummaryText = `
🛍️ NEW ORDER RECEIVED: ${orderId} (${productName})
===================================================================
Time: ${timestamp}
Item: ${productName}
Colorway: ${selectedColor}
Size Grade & Specs: ${selectedSize}
Total Valuation: ${priceFormatted} (COD / Direct Fulfillment)

📋 CUSTOMER SHIPPING INFORMATION
-------------------------------------------------------------------
Full Name: ${fullName}
Phone / WhatsApp: ${phone}
Customer Email: ${email || "Not provided"}
City & Province: ${city}
Primary Address: ${primaryAddress}
2nd Address / Sector: ${secondaryAddress || "N/A"}
Nearest Landmark: ${landmark || "N/A"}

📝 Special Instructions / Notes:
${notes || "None"}

===================================================================
👉 Customer can also verify instantly via WhatsApp directly to: ${liveConfig.brand.whatsappNumber}
    `;

    console.log("=========================================");
    console.log("🔥 NEW ROVE ORDER RECEIVED ON SERVER 🔥");
    console.log(orderSummaryText);
    console.log("=========================================");

    // ------------------------------------------------------------------------
    // RESEND EMAIL DELIVERY INTEGRATION & DIAGNOSTIC LOGGING
    // ------------------------------------------------------------------------
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      try {
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "ROVE Studio Orders <onboarding@resend.dev>",
            to: [adminEmail],
            subject: `🚨 Order ${orderId} - ${selectedColor} (${selectedSize}) - ${priceFormatted}`,
            text: orderSummaryText,
          }),
        });

        const resendData = await resendResponse.json();

        if (!resendResponse.ok) {
          console.warn(
            "🚨 Resend API rejected email delivery. Note: On Resend Free trial, you can ONLY send emails TO THE EXACT EMAIL used when registering your Resend account. Ensure ADMIN_EMAIL matches your signup email in Vercel!",
            resendData
          );
        } else {
          console.log(`✅ Order notification successfully dispatched via Resend to ${adminEmail}`);
        }
      } catch (emailErr) {
        console.error("❌ Failed to transmit email via Resend:", emailErr);
      }
    } else {
      console.log(
        `ℹ️ Notice: RESEND_API_KEY environment variable not found on Vercel. Order ${orderId} logged safely above. Customer WhatsApp confirmation workflow remains active.`
      );
    }

    return NextResponse.json({
      success: true,
      orderId,
      message: "Your allocation order has been received by ROVE Studio.",
      details: {
        orderId,
        fullName,
        phone,
        priceFormatted,
        selectedColor,
        selectedSize,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error processing order:", err);
    return NextResponse.json(
      { error: "An unexpected network error occurred while submitting your order. Please try again." },
      { status: 500 }
    );
  }
}
