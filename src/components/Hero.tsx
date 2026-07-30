"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import { siteContent } from "@/config/siteContent";

export default function Hero() {
  const scrollToExplore = () => {
    const section = document.getElementById("showcase");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToManifesto = () => {
    const section = document.getElementById("manifesto");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const currentDrop = siteContent.drops[0] || { name: "Drop 001", colors: [{ priceFormatted: "PKR 2,299" }] };
  const basePrice = currentDrop.colors[0]?.priceFormatted || "PKR 2,299";

  return (
    <section className="relative w-full min-h-screen bg-[#0D0D0D] text-white flex flex-col justify-between pt-24 pb-12 md:pb-20 overflow-hidden border-b border-[#D4AF37]/20">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#D4AF37]/5 via-[#5E0E1A]/10 to-transparent rounded-full blur-[160px] pointer-events-none" />

      {/* Main Studio Frame Layout */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex-1 flex flex-col justify-center my-8 md:my-16 relative z-10">
        
        {/* Top Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 mb-6 md:mb-10"
        >
          <div className="h-[1px] w-12 bg-[#D4AF37]" />
          <span className="text-[11px] md:text-xs font-mono uppercase tracking-[0.3em] text-[#D4AF37] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            {siteContent.hero.badge} — Starting at {basePrice}
          </span>
        </motion.div>

        {/* Cinematic Headline & Editorial Diptych Gallery Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Headline Title & Manifesto Pitch (Columns 1-7) */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col z-10"
          >
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-light font-serif tracking-tight leading-[0.95] mb-8 text-[#FFFFFF] font-editorial">
              <span className="block font-normal text-white hover:text-[#D4AF37] transition-colors duration-700">
                {siteContent.hero.titleLine1}
              </span>
              <span className="block font-serif italic text-gold-gradient mt-2">
                {siteContent.hero.titleLine2}
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-[#CDBFA6]/90 max-w-xl font-light leading-relaxed mb-12 tracking-wide font-sans">
              {siteContent.hero.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 max-w-md">
              <button
                onClick={scrollToExplore}
                className="px-8 py-4 bg-[#D4AF37] hover:bg-[#c49f27] text-[#0D0D0D] font-mono font-semibold text-xs tracking-[0.25em] uppercase transition-all duration-500 shadow-xl text-center"
              >
                {siteContent.hero.ctaPrimary}
              </button>
              <button
                onClick={scrollToManifesto}
                className="px-8 py-4 bg-[#141414] hover:bg-white/10 text-white border border-white/20 hover:border-[#D4AF37] font-mono text-xs tracking-[0.25em] uppercase transition-all duration-500 text-center"
              >
                {siteContent.hero.ctaSecondary}
              </button>
            </div>
          </motion.div>

          {/* Framed Split-Studio Diptych Photography (Columns 8-12) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex justify-center mt-6 lg:mt-0"
          >
            <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-lg lg:max-w-none">
              
              {/* Left Plate (Editorial Rocks) */}
              <div className="relative transform lg:-translate-y-6 group">
                <div className="relative w-full aspect-[3/4] bg-[#141414] border border-white/10 overflow-hidden shadow-2xl">
                  <Image
                    src={siteContent.hero.images.leftFramed.src}
                    alt={siteContent.hero.images.leftFramed.caption}
                    fill
                    priority
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 300px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-50" />
                </div>
                <div className="mt-3 text-[10px] font-mono text-[#D4AF37] tracking-[0.2em] uppercase">
                  {siteContent.hero.images.leftFramed.caption.split("—")[1]?.trim() || "Obsidian Edition"}
                </div>
              </div>

              {/* Right Plate (Editorial Wardrobe) */}
              <div className="relative transform lg:translate-y-6 group">
                <div className="relative w-full aspect-[3/4] bg-[#141414] border border-[#D4AF37]/30 overflow-hidden shadow-2xl">
                  <Image
                    src={siteContent.hero.images.rightFramed.src}
                    alt={siteContent.hero.images.rightFramed.caption}
                    fill
                    priority
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 300px"
                  />
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                </div>
                <div className="mt-3 text-[10px] font-mono text-white/60 tracking-[0.2em] uppercase text-right">
                  {siteContent.hero.images.rightFramed.caption.split("—")[0]?.trim() || "Sanctuary Frame"}
                </div>
              </div>

            </div>
          </motion.div>
        </div>

      </div>

      {/* Bottom Specification Bar & Scroll Indicator */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
        <div className="grid grid-cols-3 gap-6 md:gap-12 w-full sm:w-auto text-center sm:text-left">
          {siteContent.hero.specItems.map((spec) => (
            <div key={spec.label}>
              <span className="block text-[9px] md:text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
                {spec.label}
              </span>
              <span className="block text-xs md:text-sm font-light text-white/90 mt-1 font-serif">
                {spec.value}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={scrollToExplore}
          className="group flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] hover:text-white transition-colors"
        >
          <span>{siteContent.hero.scrollText}</span>
          <div className="w-8 h-8 rounded-full border border-[#D4AF37] group-hover:border-white flex items-center justify-center transition-colors">
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </div>
        </button>
      </div>
    </section>
  );
}
