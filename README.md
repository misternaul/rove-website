# ROVE — Less Noise. More Presence.
**Drop 001: The Essential Edition E-Commerce Platform**

> An independent label dedicated to everyday essentials engineered with calm, clarity, and uncompromising distinction. Built as a cinematic, editorial scroll-driven experience in the spirit of world-class DTC design studios (Aimé Leon Dore, Our Legacy, Kith, Frame Denim).

---

## 🎨 Visual Architecture & Design System

The ROVE experience operates on a strict single-page, long-scrolling narrative that prioritizes generous breathing room, editorial framing, and tactile micro-interactions.

### Brand Color Palette (Verified strictly against Specification Guides)
- **Jet Black Obsidian**: `#0D0D0D` (Primary canvas & deep structural background)
- **Signature Gold**: `#D4AF37` (Accent borders, typography highlights, and sleeve insignia trimming)
- **Sand Beige Dune**: `#CDBFA6` (Secondary product elevation & gentle body tone contrast)
- **Ivory White**: `#FFFFFF` (Crisp typographic headlines and clean contrast copy)
- **Burgundy & Matte Charcoal**: `#5E0E1A` / `#141414` (Subtle ambient light diffusion and structured cards)

### Typography Direction
- **Satoshi (Fontshare)**: Imported directly via Fontshare API, matching the canonical brand guidelines (Tracking: 300 for brand marks). Used across both editorial serif-style display weight and clean high-contrast sans body copy.

---

## 📐 Architectural Note: Hero & Editorial Photography Resolution

> **Notice on 768×1024 Asset Framing:**
> The original editorial campaign imagery provided (`editorial-rocks.jpg` and `editorial-wardrobe.jpg`) is authored at a high-definition vertical resolution of **768×1024px**. Rather than stretching or resampling these portrait photographs across wide 1920px–2560px 4K desktop monitors (which causes severe blurriness and interpolation artifacts), we engineered an art-directed **Framed Split-Studio Diptych**. 
> On desktop viewports, the native resolution is transformed into a museum-grade gallery presentation alongside bold positioning typography and smooth decelerated parallax (`[0.16, 1, 0.3, 1]` bezier easing). On mobile (<768px), the photography dynamically fills the complete screen width seamlessly.

---

## 🛠️ Tech Stack & Features

- **Framework**: Next.js 16 (App Router) + TypeScript + React
- **Styling**: Tailwind CSS v4 (with customized `@theme inline` tokens for Rove brand standards)
- **Animations**: Framer Motion (Scroll-triggered reveals, pinned/sticky image presentation, decelerated easing)
- **Icons & UI Detail**: Lucide React + custom asset cropping via Node `sharp` engine
- **SEO & Social Graph**: Fully configured Open Graph, Twitter Cards, and canonical favicon derivation (`/favicon.png`)
- **Serverless Backend**: Built-in simple Next.js API route at `/api/waitlist` for capturing allocation requests with comprehensive frontend feedback states.

---

## 🚀 Running the Project Locally

### 1. Prerequisites
- Node.js (v18.17 or higher recommended)
- npm, pnpm, or yarn

### 2. Installation & Development Server
Clone the repository and install the dependencies:

```bash
# Clone the repository
git clone https://github.com/mstrnaul/rove-website.git
cd rove-website

# Install dependencies
npm install

# Start the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 3. Production Build & Validation
To test an optimized, static-rendered production build locally:

```bash
npm run build
npm run start
```

---

## 🌐 Deploying Directly to Vercel (Zero-Configuration Live Hosting)

Because this project is built with standard **Next.js App Router** guidelines, deploying it live via **Vercel** (Next.js's native hosting platform) takes under 2 minutes:

1. **Push to GitHub**: Ensure your latest changes are committed and pushed to `https://github.com/mstrnaul/rove-website`.
2. **Import to Vercel**:
   - Log in to your [Vercel Dashboard](https://vercel.com/new).
   - Click **"Add New..."** → **"Project"**.
   - Select the `mstrnaul/rove-website` repository from your imported GitHub account and click **Import**.
3. **Deploy**:
   - Vercel automatically detects Next.js, configures build settings (`npm run build`), and sets up the serverless API endpoints.
   - Click **Deploy**. Within seconds, your live production URL will be ready!

---

## 🧩 Future E-Commerce Checkout & Email Integration (TODOs)

The frontend currently features complete state management for selecting between **Jet Black Obsidian** (`#0D0D0D`) and **Sand Beige Dune** (`#CDBFA6`) across **S / M** and **M / L** sizes, channeling customers directly into a priority waitlist flow.

- **Email Service Integration**: Located in `src/app/api/waitlist/route.ts`. Replace the simulation log with your SDK call for **Mailchimp**, **Resend**, or **ConvertKit** where noted by `// TODO: connect to email service`.
- **Live Payment Processing**: Located in `src/components/ProductShowcase.tsx` inside the `handleNotifyMe()` handler. Once ready for commercial release, uncomment the checkout routing logic where noted by `// TODO: connect to real checkout (Stripe Payment Links... or Shopify)`.

---

### © 2026 ROVE Presence. Crafted with intention for everyday essentials. All rights reserved.
