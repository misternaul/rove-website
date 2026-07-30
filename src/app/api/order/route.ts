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
      isTestEmail, // Special flag from Admin Dashboard to test email delivery!
    } = body;

    if (!isTestEmail && (!fullName || !phone || !city || !primaryAddress)) {
      return NextResponse.json(
        { error: "Full Name, Phone Number, City, and Primary Address are required to complete your order." },
        { status: 400 }
      );
    }

    const orderId = isTestEmail ? `TEST-ROVE-001` : `ROVE-${Math.floor(100000 + Math.random() * 900000)}`;
    const timestamp = new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" });

    const liveConfig = await getLiveSiteContent();
    const targetEmail = process.env.ADMIN_EMAIL || liveConfig.brand.founderEmail || "orders@rovepresence.com";

    // Construct the formatted notification text for the founder
    const orderSummaryText = `
${isTestEmail ? "🧪 TEST ORDER VERIFICATION VIA STUDIO ADMIN 🧪" : "🛍️ NEW ORDER RECEIVED:"} ${orderId} (${productName || "The Rove Polo"})
===================================================================
Time: ${timestamp}
Item: ${productName || "The Rove Polo"}
Colorway: ${selectedColor || "Jet Black Obsidian"}
Size Grade & Specs: ${selectedSize || "Medium"}
Total Valuation: ${priceFormatted || "PKR 2,299"} (COD / Direct Fulfillment)

📋 CUSTOMER SHIPPING INFORMATION
-------------------------------------------------------------------
Full Name: ${fullName || "Haseeb (Test Customer)"}
Phone / WhatsApp: ${phone || "0300 1234567"}
Customer Email: ${email || "Not provided"}
City & Province: ${city || "Lahore"}
Primary Address: ${primaryAddress || "House 1, Street 1, DHA"}
2nd Address / Sector: ${secondaryAddress || "N/A"}
Nearest Landmark: ${landmark || "N/A"}

📝 Special Instructions / Notes:
${notes || "This is a verification dispatch from ROVE Admin Store Controller."}

===================================================================
👉 Customer WhatsApp Verification Direct to: ${liveConfig.brand.whatsappNumber}
    `;

    console.log("=========================================");
    console.log("🔥 NEW ROVE ORDER / TEST TRANSMITTED 🔥");
    console.log(orderSummaryText);
    console.log("=========================================");

    // ------------------------------------------------------------------------
    // RESEND EMAIL DELIVERY INTEGRATION & LIVE DIAGNOSTIC FEEDBACK
    // ------------------------------------------------------------------------
    const resendApiKey = process.env.RESEND_API_KEY;
    let emailDeliveryStatus = "NOT_ATTEMPTED";
    let emailErrorMessage = "";

    if (!resendApiKey) {
      emailDeliveryStatus = "FAILED_MISSING_API_KEY";
      emailErrorMessage =
        "RESEND_API_KEY environment variable is NOT set in Vercel! To receive emails: 1) Go to Vercel -> Settings -> Environment Variables. 2) Add RESEND_API_KEY with your Resend API Key. 3) You MUST click 'Redeploy' under Vercel Deployments after adding an env variable!";
      console.warn(`🚨 ${emailErrorMessage}`);
    } else {
      try {
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "ROVE Studio Orders <onboarding@resend.dev>",
            to: [targetEmail],
            subject: `🚨 ${isTestEmail ? "[TEST]" : ""} Order ${orderId} - ${selectedColor || "Jet Black"} (${selectedSize || "M"}) - ${priceFormatted || "PKR 2,299"}`,
            text: orderSummaryText,
          }),
        });

        const resendData = await resendResponse.json();

        if (!resendResponse.ok) {
          emailDeliveryStatus = "FAILED_RESEND_REJECTED";
          emailErrorMessage = `Resend rejected email to (${targetEmail}). EXACT ERROR FROM RESEND: "${resendData.message || JSON.stringify(resendData)}". CRITICAL NOTE: On a free Resend trial account, Resend ONLY allows sending emails TO THE EXACT SAME EMAIL ADDRESS you used when you registered on Resend.com! Make sure your Founder Order Email in Admin exactly matches your Resend login email!`;
          console.warn("🚨 Resend Delivery Error:", resendData);
        } else {
          emailDeliveryStatus = "SUCCESS";
          console.log(`✅ Order notification successfully dispatched via Resend to ${targetEmail}`);
        }
      } catch (emailErr: unknown) {
        const e = emailErr as Error;
        emailDeliveryStatus = "FAILED_NETWORK_ERROR";
        emailErrorMessage = e.message || "Network failure connecting to api.resend.com";
        console.error("❌ Failed to transmit email via Resend:", e);
      }
    }

    // If this was an explicit test request from the Admin Dashboard, return the exact diagnostic email results
    if (isTestEmail) {
      if (emailDeliveryStatus !== "SUCCESS") {
        return NextResponse.json(
          {
            success: false,
            error: emailErrorMessage,
            emailDeliveryStatus,
            targetEmail,
          },
          { status: 400 }
        );
      } else {
        return NextResponse.json({
          success: true,
          message: `✅ Verification test email successfully delivered to ${targetEmail} via Resend! Check your inbox (and spam/promotions folder).`,
          targetEmail,
        });
      }
    }

    // For standard shopper order submissions
    return NextResponse.json({
      success: true,
      orderId,
      message: "Your allocation order has been received by ROVE Studio.",
      emailDeliveryStatus,
      emailErrorMessage,
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
