import { NextResponse } from "next/server";
import { siteContent } from "@/config/siteContent";

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

    // Validate required fields for fulfillment
    if (!fullName || !phone || !city || !primaryAddress) {
      return NextResponse.json(
        { error: "Full Name, Phone Number, City, and Primary Address are required to complete your order." },
        { status: 400 }
      );
    }

    const orderId = `ROVE-${Math.floor(100000 + Math.random() * 900000)}`;
    const timestamp = new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" });

    // Construct the formatted notification text for the founder
    const orderSummaryText = `
🛍️ NEW ORDER RECEIVED: ${orderId} (Drop 001 Allocation)
===================================================================
Time: ${timestamp}
Item: ${productName || siteContent.product.name}
Color: ${selectedColor}
Size: ${selectedSize}
Price / Valuation: ${priceFormatted || siteContent.product.priceFormatted} (COD / Direct Fulfillment)

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
Please contact the customer via WhatsApp or Phone (${phone}) to verify fulfillment.
    `;

    console.log("=========================================");
    console.log("🔥 NEW ROVE ORDER LOGGED ON SERVER 🔥");
    console.log(orderSummaryText);
    console.log("=========================================");

    // ------------------------------------------------------------------------
    // RESEND EMAIL GATEWAY INTEGRATION
    // ------------------------------------------------------------------------
    // To enable instant email delivery directly to your personal inbox:
    // 1. Sign up for free at https://resend.com
    // 2. Get your free API key
    // 3. In your Vercel Project Dashboard -> Settings -> Environment Variables:
    //    Add variable Name: RESEND_API_KEY | Value: re_your_api_key_here
    //    Add variable Name: ADMIN_EMAIL    | Value: your_email@example.com
    // ------------------------------------------------------------------------
    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL || siteContent.brand.founderEmail || "orders@rovepresence.com";

    if (resendApiKey && adminEmail) {
      try {
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "ROVE Studio Orders <onboarding@resend.dev>", // Or your custom verified domain on Resend
            to: [adminEmail],
            subject: `🚨 New Order ${orderId} - ${selectedColor} (${selectedSize}) - ${priceFormatted}`,
            text: orderSummaryText,
          }),
        });

        if (!resendResponse.ok) {
          const resendError = await resendResponse.json();
          console.warn("Resend API warning (order saved locally):", resendError);
        } else {
          console.log(`Order notification successfully dispatched to ${adminEmail}`);
        }
      } catch (emailErr) {
        console.error("Failed to transmit email via Resend:", emailErr);
      }
    } else {
      console.log(
        `Notice: RESEND_API_KEY or ADMIN_EMAIL environment variables not found. Order ${orderId} stored safely in logs.`
      );
    }

    // Return success to the client interface
    return NextResponse.json({
      success: true,
      orderId,
      message: "Your allocation order has been received by ROVE Studio.",
      details: {
        orderId,
        fullName,
        phone,
        priceFormatted: priceFormatted || siteContent.product.priceFormatted,
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
