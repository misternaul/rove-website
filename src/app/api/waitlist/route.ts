import { NextResponse } from "next/server";
import { getLiveSiteContent } from "@/lib/cms";

const waitlistStorage: { email: string; drop?: string; size?: string; color?: string; price?: string; createdAt: string }[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, drop, size, color, price } = body;

    if (!email || typeof email !== "string" || !email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const cleanedEmail = email.trim().toLowerCase();

    const existing = waitlistStorage.find((entry) => entry.email === cleanedEmail);
    if (!existing) {
      waitlistStorage.push({
        email: cleanedEmail,
        drop: drop || "Drop 001",
        size: size || "Unspecified",
        color: color || "Unspecified",
        price: price || "Unspecified",
        createdAt: new Date().toISOString(),
      });
    }

    console.log(`[ROVE Waitlist New Entry]: ${cleanedEmail} | Drop: ${drop || "N/A"} | Color: ${color || "N/A"} | Size: ${size || "N/A"}`);

    // Transmit email alert to founder inbox (rovepresence@gmail.com) via dual Web3Forms + Resend engine!
    try {
      const liveConfig = await getLiveSiteContent();
      const targetEmail = process.env.ADMIN_EMAIL || liveConfig.brand.founderEmail || "rovepresence@gmail.com";
      const web3formsKey = process.env.WEB3FORMS_ACCESS_KEY || liveConfig.brand.web3formsAccessKey;
      const resendApiKey = process.env.RESEND_API_KEY;

      const waitlistText = `
🌟 NEW ROVE STUDIO WAITLIST & ALLOCATION RESERVATION 🌟
===================================================================
Customer Email Address: ${cleanedEmail}
Target Release / Drop: ${drop || "Drop 001: The Rove Polo"}
Requested Colorway: ${color || "Unspecified"}
Requested Size Grade: ${size || "Unspecified"}
Estimated Valuation: ${price || "PKR 2,299"}
Timestamp: ${new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" })}

👉 Reach out to this client prior to public commercial release to secure their order!
      `;

      let sentViaWeb3 = false;
      if (web3formsKey && web3formsKey.trim() !== "") {
        const w3Res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: web3formsKey.trim(),
            subject: `🌟 New Rove Waitlist Reservation: ${cleanedEmail} (${color || "Item"}, Size ${size || "M"})`,
            from_name: "ROVE Studio Allocation Hub",
            message: waitlistText,
          }),
        });
        const w3Data = await w3Res.json();
        if (w3Data.success) sentViaWeb3 = true;
      }

      if (!sentViaWeb3 && resendApiKey) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "ROVE Studio Allocations <onboarding@resend.dev>",
            to: [targetEmail],
            subject: `🌟 New Rove Waitlist Reservation: ${cleanedEmail} (${color || "Item"}, Size ${size || "M"})`,
            text: waitlistText,
          }),
        });
      }
    } catch (e) {
      console.warn("Could not dispatch waitlist notification email:", e);
    }

    return NextResponse.json(
      {
        success: true,
        message: "You have been added to the priority studio records.",
        entryCount: waitlistStorage.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing waitlist submission:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
