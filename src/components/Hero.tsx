"use client";

import React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";

/**
 * ARCHITECTURAL NOTE FOR THE CLIENT:
 * As noted in the specifications, the source editorial photographs (editorial-rocks.jpg & editorial-wardrobe.jpg)
 * possess an inherent resolution of 768x1024px. To prevent any artifacts, blurriness, or pixel stretching on
 * wide 4K/Retina desktop viewports, we have engineered an art-directed Framed Split-Studio Hero layout rather
 * than artificially stretching a vertical portrait across a wide horizontal viewport.
 * This framing style directly mimics high-end editorial fashion houses (Aimé Leon Dore, Our Legacy, Frame Denim),
 * turning the native resolution into an intentional museum-grade gallery showcase with smooth parallax.
 */
export default function Hero() {
  const { scrollY } = useScroll();
  const yParallaxFast = useTransform(scrollY, [0, 800], [0, -120]);
  const yParallaxSlow = useTransform(scrollY, [0, 800], [0, -60]);
  const opacityFade = useTransform(scrollY, [0, 500], [1, 0]);

  const handleScrollDown = () => {
    const nextSection = document.getElementById("manifesto");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen w-full bg-[#0D0D0D] text-white overflow-hidden flex items-center pt-24 pb-16 md:py-0">
      {/* Background ambient lighting gradients */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-[500px] h-[500px] bg-[#5E0E1A]/10 rounded-full blur-[140px] pointer-events-none" />
      
      {/* Decorative vertical editorial hairline border */}
      <div className="hidden lg:block absolute top-0 bottom-0 left-12 w-[1px] bg-[#D4AF37]/15 z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full z-20 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Brand Identity & Positioning Copy */}
          <motion.div
            style={{ y: yParallaxSlow, opacity: opacityFade }}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start text-left lg:pr-8"
          >
            {/* Drop Tag / Minimal Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-none bg-[#141414] border border-[#D4AF37]/30 mb-8">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
              <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#CDBFA6]">
                Drop 001 — The Essential Edition
              </span>
            </div>

            {/* Rove Rising Horizon Logo Lockup Presentation */}
            <div className="relative w-56 md:w-64 h-24 mb-6">
              <Image
                src="/images/logo-lockup.jpg"
                alt="ROVE Logo & Horizon Line Mark"
                fill
                className="object-contain object-left"
                priority
              />
            </div>

            {/* Strong Positioning Copy / Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-[-0.02em] leading-[1.08] text-[#FFFFFF] mb-8 max-w-xl font-serif">
              Less Noise. <br />
              <span className="font-semibold text-gold-gradient italic">More Presence.</span>
            </h1>

            {/* Sub-copy / Positioning Description */}
            <p className="text-sm md:text-base text-[#FFFFFF]/75 font-light max-w-lg leading-relaxed mb-10 tracking-wide">
              An intentional pursuit of calm, clarity, and understated poise. We engineer foundational garments stripped of excess—where uncompromising craft speaks without elevating its voice.
            </p>

            {/* Hero Interactive CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <a
                href="#showcase"
                className="px-8 py-4 bg-[#D4AF37] text-[#0D0D0D] font-medium text-xs tracking-[0.25em] uppercase hover:bg-[#D4AF37]/90 transition-all duration-300 shadow-xl shadow-[#D4AF37]/15 text-center flex items-center justify-center gap-2"
              >
                <span>Explore The Polo</span>
              </a>
              <a
                href="#manifesto"
                className="px-8 py-4 border border-[#FFFFFF]/20 text-[#FFFFFF] hover:border-[#D4AF37]/60 hover:text-[#D4AF37] font-medium text-xs tracking-[0.25em] uppercase transition-all duration-300 text-center"
              >
                Our Manifesto
              </a>
            </div>

            {/* Quality Specs Highlight */}
            <div className="mt-14 pt-8 border-t border-white/10 flex items-center gap-8 w-full max-w-md">
              <div>
                <span className="block text-[10px] font-mono tracking-[0.2em] text-[#D4AF37] uppercase">Fabric</span>
                <span className="text-xs text-white/90 tracking-wider font-light mt-0.5 block">200 GSM PK Cotton</span>
              </div>
              <div className="w-[1px] h-7 bg-white/10" />
              <div>
                <span className="block text-[10px] font-mono tracking-[0.2em] text-[#D4AF37] uppercase">Detailing</span>
                <span className="text-xs text-white/90 tracking-wider font-light mt-0.5 block">Gold Sleeve Signature</span>
              </div>
              <div className="w-[1px] h-7 bg-white/10" />
              <div>
                <span className="block text-[10px] font-mono tracking-[0.2em] text-[#D4AF37] uppercase">Fit</span>
                <span className="text-xs text-white/90 tracking-wider font-light mt-0.5 block">Tailored Regular</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Art-Directed Framed Editorial Diptych */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end items-center">
            {/* Main Portrait Frame (Jet Black on Lava Rocks) */}
            <motion.div
              style={{ y: yParallaxFast }}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-sm sm:max-w-md lg:max-w-none aspect-[3/4] overflow-hidden border border-[#D4AF37]/30 shadow-2xl bg-[#141414] group"
            >
              <Image
                src="/images/editorial-rocks.jpg"
                alt="ROVE Drop 001 — Editorial Jet Black Polo on Dark Lava Rocks"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/80 via-transparent to-transparent opacity-60 pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37]">Edition 01</p>
                  <p className="text-sm font-light text-white tracking-widest uppercase mt-1">Jet Black Obsidian</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              </div>
            </motion.div>

            {/* Overlapping Secondary Framing (Wardrobe Cream/Ivory Polo) - Hidden on smallest mobile for breathability */}
            <motion.div
              initial={{ opacity: 0, x: 30, y: 30 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="hidden sm:block absolute -bottom-10 -left-10 lg:-left-20 w-48 lg:w-56 aspect-[3/4] overflow-hidden border border-white/20 shadow-2xl bg-[#141414] z-10"
            >
              <Image
                src="/images/editorial-wardrobe.jpg"
                alt="ROVE Quiet Confidence — Wardrobe Editorial"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 200px, 240px"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute top-3 left-3 px-2 py-0.5 bg-[#0D0D0D]/80 border border-[#D4AF37]/30">
                <span className="text-[8px] font-mono text-[#D4AF37] uppercase tracking-wider">Quiet Strength</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Scroll-Down Cue */}
      <motion.button
        onClick={handleScrollDown}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-white/50 hover:text-[#D4AF37] transition-colors focus:outline-none group"
        aria-label="Scroll to Manifesto"
      >
        <span className="text-[9px] uppercase tracking-[0.3em] font-mono group-hover:tracking-[0.35em] transition-all">
          Scroll To Discover
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="p-2 rounded-full border border-white/10 group-hover:border-[#D4AF37]/50 transition-colors"
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </motion.div>
      </motion.button>
    </section>
  );
}
