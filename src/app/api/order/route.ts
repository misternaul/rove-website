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
      isTestEmail,
      customWeb3FormsKey, // Directly test whatever key is currently typed in the admin textbox!
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
    const targetEmail = process.env.ADMIN_EMAIL || liveConfig.brand.founderEmail || "rovepresence@gmail.com";

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

    let emailDeliveryStatus = "NOT_ATTEMPTED";
    let emailErrorMessage = "";
    const resendApiKey = process.env.RESEND_API_KEY;
    const web3formsKey = customWeb3FormsKey || process.env.WEB3FORMS_ACCESS_KEY || liveConfig.brand.web3formsAccessKey;

    // ------------------------------------------------------------------------
    // OPTION A: WEB3FORMS (Zero-Config, Bypass Resend Gmail Sandbox & Suppression)
    // ------------------------------------------------------------------------
    if (web3formsKey && typeof web3formsKey === "string" && web3formsKey.trim() !== "") {
      try {
        const web3Res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: web3formsKey.trim(),
            subject: `🚨 ${isTestEmail ? "[TEST]" : ""} Order ${orderId} - ${selectedColor || "Jet Black"} (${selectedSize || "M"}) - ${priceFormatted || "PKR 2,299"}`,
            from_name: "ROVE Studio Order Hub",
            message: orderSummaryText,
          }),
        });
        const web3Data = await web3Res.json();
        if (web3Data && web3Data.success) {
          emailDeliveryStatus = "SUCCESS_WEB3FORMS";
          console.log("✅ Order notification successfully dispatched via Web3Forms!");
        } else {
          console.warn("⚠️ Web3Forms delivery unsuccessful:", web3Data);
          emailErrorMessage += `Web3Forms Server Rejected Key: "${web3Data?.message || "Invalid Access Key or server error"}". Please make sure your Web3Forms key is copied exactly without extra spaces! `;
        }
      } catch (e: unknown) {
        const err = e as Error;
        console.error("❌ Web3Forms network exception:", err);
        emailErrorMessage += `Web3Forms Network Exception: ${err.message}. `;
      }
    }

    // ------------------------------------------------------------------------
    // OPTION B: RESEND API (Attempt if Web3Forms was not used or failed)
    // ------------------------------------------------------------------------
    if (emailDeliveryStatus !== "SUCCESS_WEB3FORMS") {
      if (!resendApiKey) {
        emailDeliveryStatus = "FAILED_MISSING_CREDENTIALS";
        if (!web3formsKey || web3formsKey.trim() === "") {
          emailErrorMessage +=
            "No Web3Forms key detected and RESEND_API_KEY is missing! To test email delivery immediately: Paste your Web3Forms access key into the box in Tab #2 and click Test again!";
        }
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
            emailErrorMessage += `Resend API rejected transmission to (${targetEmail}): "${resendData.message || JSON.stringify(resendData)}". SOLUTION: Resend blocked delivery because onboarding@resend.dev is a sandbox domain. Use Web3Forms by pasting your access key into Tab #2 to bypass this completely!`;
            console.warn("🚨 Resend Delivery Error:", resendData);
          } else {
            emailDeliveryStatus = "SUCCESS_RESEND";
            console.log(`✅ Order notification accepted into Resend queue for ${targetEmail}`);
          }
        } catch (emailErr: unknown) {
          const e = emailErr as Error;
          emailDeliveryStatus = "FAILED_NETWORK_ERROR";
          emailErrorMessage += `Resend network exception: ${e.message}`;
          console.error("❌ Failed to transmit email via Resend:", e);
        }
      }
    }

    // If this was an explicit test request from the Admin Dashboard, return the exact diagnostic results
    if (isTestEmail) {
      if (!emailDeliveryStatus.startsWith("SUCCESS")) {
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
          message: `✅ SUCCESS! Your test order email was instantly delivered via ${emailDeliveryStatus === "SUCCESS_WEB3FORMS" ? "Web3Forms" : "Resend"}! Please check your inbox at ${targetEmail} right now (IMPORTANT: Also check your Spam, Junk, or Promotions tab!)`,
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
