"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { siteContent } from "@/config/siteContent";
import type { LookbookImage } from "@prisma/client";

export default function LookbookGallery({ images }: { images: LookbookImage[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -460 : 460;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section id="gallery" className="relative py-28 md:py-40 bg-background text-foreground border-t border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-gold block mb-2">
            {siteContent.gallery.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light font-serif tracking-tight text-foreground">
            {siteContent.gallery.title}
          </h2>
        </div>

        {/* Gallery Navigation Controls */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono tracking-widest text-muted-foreground mr-2 hidden sm:inline">
            Scroll or Drag
          </span>
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll Gallery Left"
            className="w-12 h-12 border border-border hover:border-gold text-foreground hover:text-gold flex items-center justify-center transition-all bg-card"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll Gallery Right"
            className="w-12 h-12 border border-border hover:border-gold text-foreground hover:text-gold flex items-center justify-center transition-all bg-card"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Gallery Container with Lenis Prevent & Hardware Optimization */}
      <div
        ref={scrollRef}
        data-lenis-prevent="true"
        className="flex overflow-x-auto gap-8 px-6 md:px-12 max-w-7xl mx-auto no-scrollbar scroll-smooth pb-8"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", overscrollBehaviorX: "contain" }}
      >
        {images.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px", amount: 0.1 }}
            transition={{ duration: 0.85, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex-shrink-0 w-[300px] sm:w-[380px] md:w-[440px] flex flex-col group gpu-layer"
          >
            {/* Image Box */}
            <div
              className={`relative w-full aspect-[4/5] bg-card border border-border group-hover:border-gold transition-all duration-500 overflow-hidden shadow-2xl`}
            >
              <Image
                src={item.url}
                alt={item.caption || "Lookbook Editorial"}
                fill
                quality={85}
                loading="lazy"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                sizes="(max-width: 640px) 300px, (max-width: 768px) 380px, 440px"
              />
              <div className="absolute top-4 left-4 px-3 py-1 bg-background/90 border border-gold/30">
                <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-gold">
                  Editorial
                </span>
              </div>
            </div>

            {/* Caption & Title */}
            <div className="mt-6 flex flex-col">
              <div className="flex items-baseline justify-between border-b border-border pb-3 mb-2">
                <h3 className="text-base sm:text-lg font-serif font-light text-foreground group-hover:text-gold transition-colors">
                  {item.caption || "Untitled Archive"}
                </h3>
                <span className="text-xs font-mono text-gold/80 font-semibold">0{index + 1} / {images.length < 10 ? `0${images.length}` : images.length}</span>
              </div>
            </div>
          </motion.div>
        ))}
        {images.length === 0 && (
          <div className="w-full text-center py-20 text-muted-foreground font-mono uppercase tracking-widest text-xs">
            No lookbook images configured for homepage.
          </div>
        )}
      </div>

      {/* Bottom hint for touch/drag */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-border pt-8">
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
          — Editorial Archive —
        </span>
        <Link href="/lookbook" className="px-8 py-3 border border-border hover:border-gold hover:text-gold transition-colors font-mono text-xs uppercase tracking-widest flex items-center gap-2 group">
          View Complete Lookbook <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
