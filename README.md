# ROVE — Less Noise. More Presence.
**Drop 001: The Essential Edition E-Commerce Platform (PKR & COD Fills)**

> An independent label dedicated to everyday essentials engineered with calm, clarity, and uncompromising distinction. Built as a cinematic, editorial scroll-driven experience in the spirit of world-class DTC design studios (Aimé Leon Dore, Our Legacy, Kith, Frame Denim).

---

## ⚡ 1. How to Instantly Edit Prices, Text, and Images (Central Studio Codex)

We engineered a **Central Studio Codex** file so you never have to hunt through individual React code files. **EVERY price, text, product variation, sizing detail, and image path on the website is controlled from a single simple configuration file:**

📁 **File Path**: [`src/config/siteContent.ts`](file:///d:/Antigravity/Rove/src/config/siteContent.ts)

### Changing Prices (PKR)
To update the product price across the entire website and order receipts, simply edit these two lines inside `src/config/siteContent.ts`:
```ts
priceFormatted: "PKR 14,500", // Change to any text, e.g. "PKR 16,000"
priceNumeric: 14500,
```

### Changing Text or Images
Open `src/config/siteContent.ts` and modify any text string (brand slogan, manifesto paragraphs, product specifications, FAQ accordions, sizing details, or image paths).

---

## 🔄 2. Will Updates be Automatic on Vercel? (YES!)

**YES!** Because your live Vercel dashboard is connected directly to your GitHub repository ([`github.com/misternaul/rove-website`](https://github.com/misternaul/rove-website)), **automatic Continuous Integration & Deployment (CI/CD) is enabled by default!**

Whenever you save changes to `siteContent.ts` (or any file) and push to GitHub:
```bash
git add .
git commit -m "update pricing to PKR 15,000 and revise product copy"
git push
```
Vercel automatically detects your push on GitHub, re-compiles the site in under 30 seconds, and immediately upgrades your live website automatically! Zero manual publishing required!

---

## 📦 3. Direct Order Placement & Email Notification System

We replaced standard static checkouts with a bespoke **Live Order Placement System** tailored specifically for high-end Pakistani DTC logistics & Cash on Delivery (COD) workflows.

### What the Customer Experience Looks Like:
When a visitor selects their preferred Colorway (*Jet Black Obsidian* or *Sand Beige Dune*) and Size (*S/M, M/L, or L/XL*) and clicks **"Place Direct Order"**, a luxury modal opens gathering:
1. **Full Name**
2. **Phone Number / WhatsApp** *(Essential for courier verification)*
3. **Email Address** *(Optional for confirmation receipt)*
4. **City & Province** *(e.g., Lahore, Karachi, Islamabad)*
5. **Primary Shipping Address** *(House #, Street #, Sector/Phase)*
6. **2nd Address / Apartment / Suite**
7. **Nearest Landmark** *(Vital for TCS / Leopards / Trax drivers in Pakistan)*
8. **Special Instructions / Notes**

Upon confirmation, the customer receives an instant reference ID (e.g., `ROVE-849201`) and an optional **"Verify On WhatsApp Now"** button to instantly transmit their formatted order directly to your WhatsApp!

### How to Receive Order Details Directly in Your Email (Resend Setup)
When an order is submitted, our serverless API route at [`src/app/api/order/route.ts`](file:///d:/Antigravity/Rove/src/app/api/order/route.ts) packages all shipping and product data and dispatches an email directly to your inbox using **Resend** (the cleanest free email engine for Next.js).

**Setup in 3 simple steps:**
1. Sign up for free at [https://resend.com](https://resend.com) (includes 3,000 free order emails/month) and generate an API Key (e.g., `re_12345678...`).
2. Go to your **Vercel Dashboard** → Select **rove-website** → **Settings** → **Environment Variables**.
3. Add these two variables:
   - Name: `RESEND_API_KEY` | Value: `re_your_secret_api_key_here`
   - Name: `ADMIN_EMAIL`    | Value: `your_personal_email@gmail.com` (or your domain email)

Click **Save** in Vercel. From that second forward, every order placed on your live website will land directly in your email inbox formatted with all customer addresses and PKR valuation ready for immediate dispatch!

---

## 🎨 Visual Architecture & Design System
- **Jet Black Obsidian**: `#0D0D0D` (Primary canvas & deep structural background)
- **Signature Gold**: `#D4AF37` (Accent borders, typography highlights, and sleeve insignia trimming)
- **Sand Beige Dune**: `#CDBFA6` (Secondary product elevation & gentle body tone contrast)
- **Ivory White**: `#FFFFFF` (Crisp typographic headlines and clean contrast copy)

---

## 🚀 Local Studio Commands

```bash
# Clone and install
git clone https://github.com/misternaul/rove-website.git
cd rove-website
npm install

# Run development studio server
npm run dev

# Test production build
npm run build
```

---
### © 2026 ROVE Presence. Crafted with intention for everyday essentials. All rights reserved.
