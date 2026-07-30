"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Shield, RefreshCw, ChevronDown, ChevronUp, ShoppingBag, ArrowRight } from "lucide-react";
import { siteContent } from "@/config/siteContent";
import OrderModal from "@/components/OrderModal";

export default function ProductShowcase() {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(1); // Default to M / L
  const [activeView, setActiveView] = useState<"front" | "back">("front");
  const [openAccordion, setOpenAccordion] = useState<string | null>("materials");
  
  // Order Modal State
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const selectedColor = siteContent.product.colors[selectedColorIndex];
  const selectedSize = siteContent.product.sizes[selectedSizeIndex];

  const currentImage = activeView === "front" ? selectedColor.frontImage : selectedColor.backImage;

  // Secondary waitlist scrolling action
  const handleReserveAllocation = () => {
    const waitlistElement = document.getElementById("waitlist");
    if (waitlistElement) {
      waitlistElement.scrollIntoView({ behavior: "smooth" });
      const event = new CustomEvent("rove-select-product", {
        detail: { color: selectedColor.name, size: selectedSize.id },
      });
      window.dispatchEvent(event);
    }
  };

  return (
    <section id="showcase" className="relative py-24 md:py-40 bg-[#0D0D0D] text-white border-t border-[#D4AF37]/15">
      
      {/* Ambient Radial background */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-gradient-to-br from-[#D4AF37]/5 via-[#5E0E1A]/10 to-transparent rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#D4AF37] block mb-3">
            {siteContent.product.badge}
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-light font-serif tracking-tight text-white mb-4">
            {siteContent.product.name}
          </h2>
          <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto my-6" />
          <p className="text-sm md:text-base text-[#CDBFA6]/90 font-light max-w-xl mx-auto leading-relaxed font-sans">
            {siteContent.product.shortDescription}
          </p>
        </div>

        {/* Main Product Dual View Grid (Sticky Showcase Architecture) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT: Sticky Visual Presentation Stage (Columns 1 to 7) */}
          <div className="lg:col-span-7 lg:sticky lg:top-28 flex flex-col items-center">
            
            {/* View Selector Tabs (Front / Back) */}
            <div className="flex items-center justify-center gap-2 mb-6 w-full max-w-md">
              <button
                onClick={() => setActiveView("front")}
                className={`flex-1 py-3 text-xs font-mono uppercase tracking-[0.2em] transition-all border ${
                  activeView === "front"
                    ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10"
                    : "border-white/15 text-white/60 hover:text-white bg-[#141414]"
                }`}
              >
                Front View
              </button>
              <button
                onClick={() => setActiveView("back")}
                className={`flex-1 py-3 text-xs font-mono uppercase tracking-[0.2em] transition-all border ${
                  activeView === "back"
                    ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10"
                    : "border-white/15 text-white/60 hover:text-white bg-[#141414]"
                }`}
              >
                Back Elevation
              </button>
            </div>

            {/* Main Photography Canvas */}
            <div className="relative w-full max-w-xl aspect-[3/4] bg-[#141414] border border-white/10 overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              
              {/* Animated image transition on color / view change */}
              <motion.div
                key={`${selectedColor.id}-${activeView}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={currentImage}
                  alt={`${siteContent.product.name} — ${selectedColor.name} (${activeView})`}
                  fill
                  priority
                  className="object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 600px"
                />
              </motion.div>

              {/* Decorative Frame Overlay */}
              <div className="absolute inset-0 border-[12px] border-[#0D0D0D]/40 pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
                <span className="px-3 py-1.5 bg-[#0D0D0D]/90 backdrop-blur-md border border-[#D4AF37]/30 text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.2em]">
                  {selectedColor.name}
                </span>
                <span className="px-3 py-1.5 bg-[#0D0D0D]/90 backdrop-blur-md border border-[#D4AF37]/30 text-[10px] font-mono text-white/80 uppercase tracking-[0.2em]">
                  {activeView.toUpperCase()} PLATE
                </span>
              </div>
            </div>

            {/* Thumbnail Quick Switcher below image */}
            <div className="grid grid-cols-2 gap-4 mt-4 w-full max-w-xl">
              <button
                onClick={() => setActiveView("front")}
                className={`relative h-20 bg-[#141414] border overflow-hidden transition-all ${
                  activeView === "front" ? "border-[#D4AF37] ring-1 ring-[#D4AF37]" : "border-white/15 opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={selectedColor.frontImage} alt="Front Thumbnail" fill className="object-cover object-top" />
                <div className="absolute inset-0 bg-black/30 flex items-end p-1.5">
                  <span className="text-[9px] font-mono tracking-wider uppercase text-white bg-black/80 px-1.5 py-0.5">Front</span>
                </div>
              </button>
              <button
                onClick={() => setActiveView("back")}
                className={`relative h-20 bg-[#141414] border overflow-hidden transition-all ${
                  activeView === "back" ? "border-[#D4AF37] ring-1 ring-[#D4AF37]" : "border-white/15 opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={selectedColor.backImage} alt="Back Thumbnail" fill className="object-cover object-top" />
                <div className="absolute inset-0 bg-black/30 flex items-end p-1.5">
                  <span className="text-[9px] font-mono tracking-wider uppercase text-white bg-black/80 px-1.5 py-0.5">Back</span>
                </div>
              </button>
            </div>

            <p className="mt-4 text-xs text-white/50 font-mono italic text-center max-w-md">
              &ldquo;{selectedColor.caption}&rdquo;
            </p>
          </div>

          {/* RIGHT: Product Customizer & Direct Order Action (Columns 8 to 12) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            
            <div className="p-8 md:p-10 bg-[#141414] border border-white/10 shadow-2xl relative">
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37]" />
              
              {/* Pricing Display in PKR */}
              <div className="flex flex-col mb-8 pb-8 border-b border-white/10">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-white/50">
                    Valuation
                  </span>
                  <span className="text-2xl sm:text-3xl font-mono font-medium text-[#D4AF37] tracking-tight">
                    {siteContent.product.priceFormatted}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-sans text-white/70">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                  <span>{siteContent.product.shippingNote}</span>
                </div>
              </div>

              {/* 1. Color Selection State */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
                    1. Colorway
                  </span>
                  <span className="text-xs font-mono text-white/80">
                    Selected: <strong className="text-white font-medium">{selectedColor.name}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {siteContent.product.colors.map((c, i) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedColorIndex(i)}
                      className={`p-3 border flex items-center gap-3 transition-all ${
                        selectedColorIndex === i
                          ? "border-[#D4AF37] bg-[#D4AF37]/10"
                          : "border-white/15 hover:border-white/40 bg-[#0D0D0D]"
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-white/30 flex-shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-xs font-mono uppercase tracking-wider text-left text-white leading-tight">
                        {c.name.split(" ")[0]} {c.name.split(" ")[1]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Size Selection State */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
                    2. Sizing Grade
                  </span>
                  <span className="text-[11px] font-mono text-white/60 hover:text-white underline cursor-pointer">
                    View Size Codex
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {siteContent.product.sizes.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSizeIndex(idx)}
                      className={`py-3 px-2 border text-xs font-mono uppercase tracking-wider transition-all ${
                        selectedSizeIndex === idx
                          ? "border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37] font-bold"
                          : "border-white/15 text-white/70 hover:border-white/50 hover:text-white bg-[#0D0D0D]"
                      }`}
                    >
                      {s.id}
                    </button>
                  ))}
                </div>

                {/* Size Specs Feedback */}
                <div className="mt-3 p-3 bg-[#0D0D0D] border border-white/10 text-[11px] font-mono text-white/60 text-center">
                  <span>{selectedSize.name}: </span>
                  <span className="text-[#CDBFA6]">{selectedSize.details}</span>
                </div>
              </div>

              {/* PRIMARY ACTION: DIRECT ORDER PLACEMENT MODAL */}
              <div className="space-y-4">
                <button
                  onClick={() => setIsOrderModalOpen(true)}
                  className="w-full py-5 bg-[#D4AF37] hover:bg-[#c49f27] text-[#0D0D0D] font-mono font-bold text-xs tracking-[0.25em] uppercase transition-all duration-300 flex items-center justify-center gap-3 shadow-xl transform hover:-translate-y-0.5"
                >
                  <ShoppingBag className="w-4 h-4 text-[#0D0D0D]" />
                  <span>{siteContent.product.orderButtonText} ({siteContent.product.priceFormatted})</span>
                  <ArrowRight className="w-4 h-4 text-[#0D0D0D]" />
                </button>

                <button
                  onClick={handleReserveAllocation}
                  className="w-full py-3.5 bg-[#0D0D0D] border border-white/20 hover:border-[#D4AF37] text-white/80 hover:text-white font-mono text-[11px] tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{siteContent.product.secondaryActionText}</span>
                </button>
              </div>

              {/* Trust Value Propositions */}
              <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                <div className="flex items-center gap-3 text-xs text-white/70 font-light">
                  <Shield className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                  <span>{siteContent.product.guaranteeText}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/70 font-light">
                  <RefreshCw className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                  <span>Bespoke 3-line sleeve embroidery standard on every garment</span>
                </div>
              </div>

            </div>

            {/* Expandable Architectural Specification Accordion */}
            <div className="mt-8 space-y-3">
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#D4AF37] block mb-2 px-2">
                Garment Specifications & Codex
              </span>
              
              {siteContent.product.accordions.map((acc) => {
                const isOpen = openAccordion === acc.id;
                return (
                  <div
                    key={acc.id}
                    className="bg-[#141414] border border-white/10 hover:border-white/20 transition-colors overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenAccordion(isOpen ? null : acc.id)}
                      className="w-full p-5 text-left flex items-center justify-between text-xs font-mono uppercase tracking-wider text-white hover:text-[#D4AF37] transition-colors"
                    >
                      <span>{acc.title}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#D4AF37]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-white/50" />
                      )}
                    </button>

                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-5 pb-5 text-xs text-white/70 font-light leading-relaxed border-t border-white/5 pt-3"
                      >
                        {acc.content}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>

      {/* Order Placement Modal Triggered via Button */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        selectedColor={selectedColor.name}
        selectedSize={selectedSize.id}
      />
    </section>
  );
}
