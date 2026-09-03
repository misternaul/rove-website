import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.rovepresence.com"),
  title: "ROVE — Less Noise. More Presence. | Drop 001",
  description:
    "ROVE is built on the belief that less is more. Uncompromised comfort, durability, and understated elegance for everyday essentials. Explore Drop 001: The Premium Polo.",
  keywords: ["Rove", "luxury apparel", "premium polo", "minimalist fashion", "DTC fashion", "less noise more presence"],
  authors: [{ name: "ROVE Design Studio" }],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "ROVE — Less Noise. More Presence.",
    description:
      "Every piece is crafted with intention to deliver comfort, durability and understated elegance for everyday essentials.",
    url: "https://www.rovepresence.com",
    siteName: "ROVE Presence",
    images: [
      {
        url: "/images/editorial-rocks.png",
        width: 768,
        height: 1024,
        alt: "ROVE Drop 001 — Jet Black Premium Polo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ROVE — Less Noise. More Presence.",
    description:
      "Every piece is crafted with intention to deliver comfort, durability and understated elegance for everyday essentials.",
    images: ["/images/editorial-rocks.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CartProvider } from "@/components/CartProvider";
import { AuthProvider } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import CheckoutModal from "@/components/CheckoutModal";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased scroll-smooth">
      <body className="antialiased min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground transition-colors duration-500">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-1 w-full">
                <SmoothScrollProvider>
                  {children}
                </SmoothScrollProvider>
              </main>
              <CheckoutModal />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
        
        {/* Vercel Advanced Analytics (Not AI) */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
