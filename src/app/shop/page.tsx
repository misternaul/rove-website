import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getLiveSiteContent } from "@/lib/cms";
import Link from "next/link";
import Image from "next/image";

export default async function ShopPage() {
  const config = await getLiveSiteContent();
  const drops = config.drops || [];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-accent selection:text-background flex flex-col">
      <Navbar />

      <main className="flex-grow w-full relative pt-32 pb-24 max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-accent block mb-3">
            Archive & Releases
          </span>
          <h1 className="text-4xl md:text-5xl font-light font-serif tracking-tight mb-4">
            The Studio Catalog
          </h1>
          <div className="w-16 h-[1px] bg-accent mx-auto my-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {drops.map((drop) => {
            const firstColor = drop.colors[0];
            const displayImage = firstColor?.frontImage || "/images/placeholder.jpg";
            const price = firstColor?.priceFormatted || "";

            return (
              <Link key={drop.id} href={`/shop/${drop.id}`} className="group block">
                <div className="relative aspect-[3/4] w-full bg-matte overflow-hidden border border-border-subtle shadow-lg mb-6">
                  <Image
                    src={displayImage}
                    alt={drop.name}
                    fill
                    className="object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <span className="px-3 py-1.5 bg-background/90 backdrop-blur-md border border-accent/30 text-[10px] font-mono text-accent uppercase tracking-[0.2em]">
                      {drop.badge.split("—")[0].trim()}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-serif font-light tracking-wide mb-2 group-hover:text-accent transition-colors">
                  {drop.name}
                </h3>
                <div className="flex items-center justify-between font-mono text-xs text-foreground/70 uppercase tracking-widest">
                  <span>{drop.colors.length} {drop.colors.length === 1 ? 'Variant' : 'Variants'}</span>
                  <span>{price}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
