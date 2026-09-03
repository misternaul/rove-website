"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { siteContent } from "@/config/siteContent";

export default function CraftDetails() {
  return (
    <section id="craft" className="relative py-28 md:py-40 bg-[#0D0D0D] text-white border-t border-[#D4AF37]/15 overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-[#D4AF37]/4 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 md:mb-28">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#D4AF37] block mb-3">
            {siteContent.craft.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light font-serif tracking-tight text-white mb-6">
            {siteContent.craft.title}
          </h2>
          <p className="text-sm md:text-base text-[#CDBFA6]/80 font-light leading-relaxed font-sans">
            {siteContent.craft.description}
          </p>
        </div>

        {/* Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {siteContent.craft.items.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px", amount: 0.15 }}
              transition={{ duration: 0.85, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className={`group bg-[#141414] border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-500 flex flex-col overflow-hidden gpu-layer ${
                idx === 0 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              {/* Image Frame */}
              <div className="relative w-full aspect-square overflow-hidden bg-[#0D0D0D]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  quality={85}
                  loading="lazy"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-60" />
                <div className="absolute top-4 right-4 px-2.5 py-1 bg-[#0D0D0D]/80 border border-[#D4AF37]/20">
                  <span className="text-[10px] font-mono text-[#D4AF37] tracking-[0.2em] uppercase">
                    0{idx + 1}
                  </span>
                </div>
              </div>

              {/* Copy Box */}
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.25em] text-[#D4AF37] uppercase block mb-2">
                    {item.subtitle}
                  </span>
                  <h3 className="text-xl font-serif font-normal text-white mb-4 tracking-tight group-hover:text-[#D4AF37] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/40 uppercase">
                  <span>Standard Drop 001</span>
                  <span className="text-[#D4AF37]">Rove Hallmark</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Editorial Callout Quote */}
        <div className="mt-20 md:mt-28 p-10 md:p-14 bg-[#141414]/60 border border-[#D4AF37]/20 text-center relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60" />
          <p className="text-base sm:text-lg md:text-xl font-serif font-light text-white italic tracking-wide max-w-3xl mx-auto">
            {siteContent.craft.quote}
          </p>
          <span className="block mt-4 mb-8 text-[11px] font-mono uppercase tracking-[0.3em] text-[#D4AF37]">
            — Rove Design Studio, Drop 001 Guidelines
          </span>
          <Link href="/craftsmanship" className="px-8 py-3 border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors font-mono text-xs uppercase tracking-widest">
            Discover The Process
          </Link>
        </div>

      </div>
    </section>
  );
}
