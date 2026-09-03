"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Eye } from "lucide-react";
import { siteContent } from "@/config/siteContent";

export default function LookbookGallery() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -460 : 460;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section id="gallery" className="relative py-28 md:py-40 bg-[#0D0D0D] text-white border-t border-[#D4AF37]/15">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#D4AF37] block mb-2">
            {siteContent.gallery.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light font-serif tracking-tight text-white">
            {siteContent.gallery.title}
          </h2>
        </div>

        {/* Gallery Navigation Controls */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono tracking-widest text-white/50 mr-2 hidden sm:inline">
            Scroll or Drag
          </span>
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll Gallery Left"
            className="w-12 h-12 border border-white/20 hover:border-[#D4AF37] text-white hover:text-[#D4AF37] flex items-center justify-center transition-all bg-[#141414]"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll Gallery Right"
            className="w-12 h-12 border border-white/20 hover:border-[#D4AF37] text-white hover:text-[#D4AF37] flex items-center justify-center transition-all bg-[#141414]"
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
        {siteContent.gallery.images.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px", amount: 0.1 }}
            transition={{ duration: 0.85, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex-shrink-0 w-[300px] sm:w-[380px] md:w-[440px] flex flex-col group gpu-layer"
          >
            {/* Image Box */}
            <div
              className={`relative w-full ${item.aspect} bg-[#141414] border border-white/10 group-hover:border-[#D4AF37] transition-all duration-500 overflow-hidden shadow-2xl`}
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                quality={85}
                loading="lazy"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                sizes="(max-width: 640px) 300px, (max-width: 768px) 380px, 440px"
              />
              <div className="absolute top-4 left-4 px-3 py-1 bg-[#0D0D0D]/90 border border-[#D4AF37]/30">
                <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-[#D4AF37]">
                  {item.tag}
                </span>
              </div>

              {/* Interactive Inspect Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="px-5 py-2.5 bg-[#D4AF37] text-[#0D0D0D] font-mono text-[10px] tracking-[0.2em] uppercase font-semibold flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <Eye className="w-3.5 h-3.5" /> View Plate
                </div>
              </div>
            </div>

            {/* Caption & Title */}
            <div className="mt-6 flex flex-col">
              <div className="flex items-baseline justify-between border-b border-white/10 pb-3 mb-2">
                <h3 className="text-base sm:text-lg font-serif font-light text-white group-hover:text-[#D4AF37] transition-colors">
                  {item.title}
                </h3>
                <span className="text-xs font-mono text-[#D4AF37]/80 font-semibold">0{index + 1} / 05</span>
              </div>
              <p className="text-xs text-white/60 font-light tracking-wide font-sans">
                {item.caption}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom hint for touch/drag */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/10 pt-8">
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#D4AF37]/60">
          — End of Release 001 Plates —
        </span>
        <Link href="/lookbook" className="px-8 py-3 border border-white/20 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors font-mono text-xs uppercase tracking-widest flex items-center gap-2 group">
          View Complete Lookbook <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
