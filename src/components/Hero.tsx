"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { siteContent } from "@/config/siteContent";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen bg-background text-foreground flex flex-col justify-between pt-24 pb-12 md:pb-20 overflow-hidden border-b border-border">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-gold/5 via-burgundy/10 to-transparent rounded-full blur-[160px] pointer-events-none" />

      {/* Main Studio Frame Layout */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex-1 flex flex-col justify-center my-8 md:my-16 relative z-10">

        {/* Cinematic Headline & Editorial Diptych Gallery Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Headline Title & Manifesto Pitch (Columns 1-7) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col z-10 gpu-layer"
          >
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-light font-serif tracking-tight leading-[0.95] mb-8 text-foreground">
              <span className="block font-normal text-foreground hover:text-gold transition-colors duration-700">
                {siteContent.hero.titleLine1}
              </span>
              <span className="block font-serif italic text-gold mt-2">
                {siteContent.hero.titleLine2}
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-foreground/90 max-w-xl font-light leading-relaxed mb-12 tracking-wide font-sans">
              {siteContent.hero.subtitle}
            </p>

            {/* Action Buttons with Anchor Gliding */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 max-w-md">
              <a
                href="#showcase"
                className="px-8 py-4 bg-gold hover:opacity-90 text-background font-mono font-semibold text-xs tracking-[0.25em] uppercase transition-all duration-500 shadow-xl text-center block"
              >
                {siteContent.hero.ctaPrimary}
              </a>
              <a
                href="#manifesto"
                className="px-8 py-4 bg-card hover:bg-card/50 text-foreground border border-border hover:border-gold font-mono text-xs tracking-[0.25em] uppercase transition-all duration-500 text-center block"
              >
                {siteContent.hero.ctaSecondary}
              </a>
            </div>
          </motion.div>

          {/* Framed Split-Studio Diptych Photography (Columns 8-12) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.3, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex justify-center mt-6 lg:mt-0 gpu-layer"
          >
            <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-lg lg:max-w-none">
              
              {/* Left Plate (Editorial Rocks) */}
              <div className="relative transform lg:-translate-y-6 group">
                <div className="relative w-full aspect-[3/4] bg-card border border-border overflow-hidden shadow-2xl">
                  <Image
                    src={siteContent.hero.images.leftFramed.src}
                    alt={siteContent.hero.images.leftFramed.caption}
                    fill
                    priority
                    quality={90}
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 300px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-50" />
                </div>
                <div className="mt-3 text-[10px] font-mono text-gold tracking-[0.2em] uppercase">
                  {siteContent.hero.images.leftFramed.caption.split("—")[1]?.trim() || "Obsidian Edition"}
                </div>
              </div>

              {/* Right Plate (Editorial Wardrobe) */}
              <div className="relative transform lg:translate-y-6 group">
                <div className="relative w-full aspect-[3/4] bg-card border border-gold/30 overflow-hidden shadow-2xl">
                  <Image
                    src={siteContent.hero.images.rightFramed.src}
                    alt={siteContent.hero.images.rightFramed.caption}
                    fill
                    priority
                    quality={90}
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 300px"
                  />
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-gold animate-pulse" />
                </div>
                <div className="mt-3 text-[10px] font-mono text-muted-foreground tracking-[0.2em] uppercase text-right">
                  {siteContent.hero.images.rightFramed.caption.split("—")[0]?.trim() || "Sanctuary Frame"}
                </div>
              </div>

            </div>
          </motion.div>
        </div>

      </div>

      {/* Bottom Specification Bar & Scroll Indicator */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
        <div className="grid grid-cols-3 gap-6 md:gap-12 w-full sm:w-auto text-center sm:text-left">
          {siteContent.hero.specItems.map((spec) => (
            <div key={spec.label}>
              <span className="block text-[9px] md:text-[10px] font-mono uppercase tracking-[0.25em] text-gold">
                {spec.label}
              </span>
              <span className="block text-xs md:text-sm font-light text-foreground/90 mt-1 font-serif">
                {spec.value}
              </span>
            </div>
          ))}
        </div>

        <a
          href="#showcase"
          className="group flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-gold hover:text-foreground transition-colors"
        >
          <span>{siteContent.hero.scrollText}</span>
          <div className="w-8 h-8 rounded-full border border-gold group-hover:border-foreground flex items-center justify-center transition-colors">
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </div>
        </a>
      </div>
    </section>
  );
}
