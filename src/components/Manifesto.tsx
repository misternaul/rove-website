"use client";

import React from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { siteContent } from "@/config/siteContent";

export default function Manifesto() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      id="manifesto"
      className="relative py-32 md:py-44 bg-[#0D0D0D] text-white overflow-hidden border-t border-b border-[#D4AF37]/15"
    >
      {/* Ambient center lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/4 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px", amount: 0.15 }}
          className="flex flex-col items-center gpu-layer"
        >
          {/* Subtle Icon Mark at top of Manifesto */}
          <motion.div variants={itemVariants} className="relative w-16 h-12 mb-8 opacity-90 gpu-layer">
            <Image
              src={siteContent.brand.logoIconImage}
              alt="ROVE Horizon Icon"
              fill
              className="object-contain"
            />
          </motion.div>

          <motion.span
            variants={itemVariants}
            className="text-[11px] font-mono uppercase tracking-[0.35em] text-[#D4AF37] mb-10 block gpu-layer"
          >
            {siteContent.manifesto.title}
          </motion.span>
          
          <motion.p
            variants={itemVariants}
            className="text-xl sm:text-2xl md:text-3xl font-light text-[#FFFFFF] leading-[1.6] mb-8 font-serif max-w-3xl gpu-layer"
          >
            {siteContent.manifesto.paragraph1}
          </motion.p>
          
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl font-light text-[#CDBFA6]/90 leading-relaxed mb-8 max-w-2xl font-sans gpu-layer"
          >
            {siteContent.manifesto.paragraph2}
          </motion.p>
          
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl md:text-2xl font-normal italic text-gold-gradient tracking-wide max-w-2xl font-serif gpu-layer"
          >
            {siteContent.manifesto.quote}
          </motion.p>
          
          <motion.div
            variants={itemVariants}
            className="mt-16 pt-12 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12 w-full max-w-3xl text-left sm:text-center gpu-layer"
          >
            {siteContent.manifesto.pillars.map((pillar) => (
              <div key={pillar.title}>
                <span className="block text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-medium mb-1">
                  {pillar.title}
                </span>
                <span className="text-xs text-white/60 font-light block font-sans">
                  {pillar.subtitle}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
