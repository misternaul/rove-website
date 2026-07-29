import type { Metadata } from "next";
import "./globals.css";

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
        url: "/images/editorial-rocks.jpg",
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
    images: ["/images/editorial-rocks.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#0D0D0D] text-white selection:bg-[#D4AF37] selection:text-[#0D0D0D]">
        {children}
      </body>
    </html>
  );
}
