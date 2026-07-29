"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShieldCheck, Truck, Sparkles, ChevronDown } from "lucide-react";

// Product configuration based strictly on brand spec sheets
const POLO_COLORS = [
  {
    id: "black",
    name: "Jet Black Obsidian",
    hex: "#0D0D0D",
    accent: "#D4AF37",
    frontImage: "/images/polo-black-front.jpg",
    backImage: "/images/polo-black-back.jpg",
    tagline: "Deep matte black with signature gold embroidery and shoulder piping.",
  },
  {
    id: "sand",
    name: "Sand Beige Dune",
    hex: "#CDBFA6",
    accent: "#0D0D0D",
    frontImage: "/images/polo-sand-front.jpg",
    backImage: "/images/polo-sand-back.jpg",
    tagline: "Subtle dune texture inspired by shifting desert landscapes, trimmed in gold.",
  },
];

// [PLACEHOLDER]: Defaulting to sensible neutral sizing S/M and M/L as requested in specifications. Please confirm final size grading before production.
const POLO_SIZES = [
  { label: "S / M", description: "Tailored Regular Fit (Chest 38-41\")" },
  { label: "M / L", description: "Standard Relaxed Fit (Chest 42-45\")" },
];

export default function ProductShowcase() {
  const [selectedColor, setSelectedColor] = useState(POLO_COLORS[0]);
  const [selectedSize, setSelectedSize] = useState(POLO_SIZES[1]); // Default to M/L
  const [activeView, setActiveView] = useState<"front" | "back">("front");
  const [openAccordion, setOpenAccordion] = useState<string | null>("specifications");

  const handleNotifyMe = () => {
    // Dispatch selected product state to window so the waitlist section can display targeted reservation details
    if (typeof window !== "undefined") {
      const event = new CustomEvent("rove-select-product", {
        detail: { color: selectedColor.name, size: selectedSize.label },
      });
      window.dispatchEvent(event);
    }

    // Smooth scroll to the email waitlist capture section
    const waitlistEl = document.getElementById("waitlist");
    if (waitlistEl) {
      waitlistEl.scrollIntoView({ behavior: "smooth" });
    }

    // TODO: connect to real checkout (Stripe Payment Links is the fastest no-backend option, or Shopify if we want full commerce) once we're ready to sell
    // e.g., if (isReadyToSell) { window.location.href = `https://buy.stripe.com/checkout?color=${selectedColor.id}&size=${selectedSize.label}`; }
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <section id="showcase" className="relative py-28 md:py-40 bg-[#0D0D0D] text-white">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#141414]/80 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="mb-16 md:mb-24 text-left border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs uppercase font-mono tracking-[0.3em] text-[#D4AF37] block mb-2">
              Drop 001 Centerpiece
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light font-serif tracking-tight text-white">
              The Essential Polo
            </h2>
          </div>
          <p className="text-sm text-[#CDBFA6]/80 max-w-md font-light tracking-wide">
            Less noise, more presence. Crafted from 200 GSM PK Cotton with gold hallmark detailing. Built to be impossible to ignore.
          </p>
        </div>

        {/* Product Showcase Grid with Sticky Image Viewer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Sticky Product Image Presentation */}
          <div className="lg:col-span-7 lg:sticky lg:top-32 flex flex-col">
            <div className="relative w-full aspect-[4/5] bg-[#141414] border border-[#D4AF37]/25 overflow-hidden shadow-2xl group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedColor.id}-${activeView}`}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 w-full h-full flex items-center justify-center p-6 md:p-10"
                >
                  <div className="relative w-full h-full max-h-[600px]">
                    <Image
                      src={activeView === "front" ? selectedColor.frontImage : selectedColor.backImage}
                      alt={`ROVE Premium Polo in ${selectedColor.name} — ${activeView.toUpperCase()} View`}
                      fill
                      className="object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)]"
                      priority
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* View toggle floating tags */}
              <div className="absolute top-6 right-6 z-10 flex gap-2">
                <button
                  onClick={() => setActiveView("front")}
                  className={`px-4 py-2 text-[10px] font-mono uppercase tracking-[0.2em] transition-all duration-300 border ${
                    activeView === "front"
                      ? "bg-[#D4AF37] text-[#0D0D0D] border-[#D4AF37] font-semibold shadow-lg"
                      : "bg-[#0D0D0D]/80 text-white/80 border-white/20 hover:border-[#D4AF37]"
                  }`}
                >
                  Front View
                </button>
                <button
                  onClick={() => setActiveView("back")}
                  className={`px-4 py-2 text-[10px] font-mono uppercase tracking-[0.2em] transition-all duration-300 border ${
                    activeView === "back"
                      ? "bg-[#D4AF37] text-[#0D0D0D] border-[#D4AF37] font-semibold shadow-lg"
                      : "bg-[#0D0D0D]/80 text-white/80 border-white/20 hover:border-[#D4AF37]"
                  }`}
                >
                  Back View
                </button>
              </div>

              {/* Bottom Info Bar in Picture Frame */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
                <div className="bg-[#0D0D0D]/90 backdrop-blur-sm border border-white/10 px-4 py-2">
                  <span className="text-[10px] font-mono tracking-[0.25em] text-[#D4AF37] uppercase block">
                    {selectedColor.name}
                  </span>
                </div>
                <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
                  Hover to Inspect
                </span>
              </div>
            </div>

            {/* Thumbnail Selection Preview beneath viewer */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div
                onClick={() => setActiveView("front")}
                className={`cursor-pointer aspect-[16/9] bg-[#141414] border p-2 flex items-center justify-center transition-all ${
                  activeView === "front" ? "border-[#D4AF37] shadow-lg" : "border-white/10 hover:border-white/30 opacity-70"
                }`}
              >
                <span className="text-xs uppercase font-mono tracking-widest text-white/90">Front Elevation</span>
              </div>
              <div
                onClick={() => setActiveView("back")}
                className={`cursor-pointer aspect-[16/9] bg-[#141414] border p-2 flex items-center justify-center transition-all ${
                  activeView === "back" ? "border-[#D4AF37] shadow-lg" : "border-white/10 hover:border-white/30 opacity-70"
                }`}
              >
                <span className="text-xs uppercase font-mono tracking-widest text-white/90">Back Profile</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Configuration, Copy & Action */}
          <div className="lg:col-span-5 flex flex-col">
            
            {/* Title & Price Header */}
            <div className="border-b border-white/10 pb-6 mb-8">
              <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] mb-2">
                <span>Drop 001 Signature</span>
                <span>•</span>
                <span>Limited Quantities</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-light tracking-tight text-white mb-3">
                The Rove Polo
              </h3>
              
              {/* [PLACEHOLDER]: Realistic premium pricing ($185 USD). Please confirm final retail price tag. */}
              <div className="flex items-baseline gap-3">
                <span className="text-xl sm:text-2xl font-light text-white font-mono tracking-wider">$185 USD</span>
                <span className="text-xs text-[#D4AF37] uppercase tracking-[0.15em] font-mono border border-[#D4AF37]/40 px-2 py-0.5">
                  Pre-Release Reservation
                </span>
              </div>
            </div>

            {/* [PLACEHOLDER]: Editorial product description copy based on spec guidelines */}
            <p className="text-sm md:text-base text-white/80 font-light leading-relaxed mb-8">
              The canonical Rove foundation piece. Engineered from ultra-breathable 200 GSM PK Cotton, tailored with an impeccable regular fit that holds its structure through daily movement. Distinguished by our signature three-line gold embroidery on the right sleeve, matte black hardware engraved with ROVE, and subtle gold shoulder piping.
            </p>

            {/* COLOR SELECTOR (2 COLORS) */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-white">
                  Color: <span className="text-[#D4AF37] font-semibold">{selectedColor.name}</span>
                </span>
                <span className="text-[11px] font-mono text-[#CDBFA6]/70 uppercase tracking-widest">
                  2 Available Tones
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {POLO_COLORS.map((color) => {
                  const isSelected = selectedColor.id === color.id;
                  return (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color)}
                      className={`group relative p-4 text-left border transition-all duration-300 flex items-center gap-3.5 ${
                        isSelected
                          ? "bg-[#141414] border-[#D4AF37] shadow-xl gold-glow"
                          : "bg-[#0D0D0D] border-white/15 hover:border-white/40"
                      }`}
                    >
                      <span
                        className="w-6 h-6 rounded-full border-2 border-[#D4AF37]/50 block flex-shrink-0 relative shadow-md"
                        style={{ backgroundColor: color.hex }}
                      >
                        {isSelected && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-[#D4AF37] drop-shadow-[0_1px_2px_rgba(0,0,0,1)]" />
                          </span>
                        )}
                      </span>
                      <div>
                        <span className="block text-xs font-mono tracking-widest uppercase text-white font-medium">
                          {color.name.split(" ")[0]} {color.name.split(" ")[1]}
                        </span>
                        <span className="text-[9px] font-mono text-[#D4AF37]/80 uppercase tracking-wider block mt-0.5">
                          {color.id === "black" ? "#0D0D0D / Gold" : "#CDBFA6 / Dune"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-[#CDBFA6]/80 font-light mt-3 italic">
                {selectedColor.tagline}
              </p>
            </div>

            {/* SIZE SELECTOR (2 SIZES) */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-white">
                  Size: <span className="text-[#D4AF37] font-semibold">{selectedSize.label}</span>
                </span>
                <button
                  onClick={() => alert("Size Guide Placeholder:\n\nS/M: Chest 38-41\" | Length 28\" | Sleeve 9.5\"\nM/L: Chest 42-45\" | Length 29.5\" | Sleeve 10.2\"\n\nFit is Regular Tailored. If between sizes, size up for a relaxed studio drape.")}
                  className="text-[11px] font-mono text-[#D4AF37] hover:underline uppercase tracking-wider"
                >
                  Size & Fit Guide
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {POLO_SIZES.map((size) => {
                  const isSelected = selectedSize.label === size.label;
                  return (
                    <button
                      key={size.label}
                      onClick={() => setSelectedSize(size)}
                      className={`p-4 text-center border transition-all duration-300 ${
                        isSelected
                          ? "bg-[#D4AF37] text-[#0D0D0D] border-[#D4AF37] font-semibold shadow-lg"
                          : "bg-[#0D0D0D] text-white border-white/15 hover:border-white/40"
                      }`}
                    >
                      <span className="block text-sm font-mono tracking-[0.2em] uppercase mb-1">
                        {size.label}
                      </span>
                      <span
                        className={`text-[10px] font-sans tracking-wide block ${
                          isSelected ? "text-[#0D0D0D]/80" : "text-white/60"
                        }`}
                      >
                        {size.description.split(" (")[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PRIMARY CTA: NOTIFY ME WHEN AVAILABLE (WAITLIST FLOW) */}
            <div className="mb-12">
              <button
                onClick={handleNotifyMe}
                className="w-full py-5 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#0D0D0D] font-mono font-bold text-xs tracking-[0.3em] uppercase transition-all duration-300 shadow-2xl shadow-[#D4AF37]/20 flex items-center justify-center gap-3 group"
              >
                <span>Notify Me When Available</span>
                <Sparkles className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
              </button>
              <div className="mt-3 flex items-center justify-center gap-6 text-[11px] font-mono text-white/60 tracking-wider">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> No immediate charge
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#D4AF37]" /> Priority Drop 001 Notification
                </span>
              </div>
            </div>

            {/* EXPANDABLE SPECIFICATIONS & CRAFT ACCORDION */}
            <div className="border-t border-white/10 divide-y divide-white/10">
              
              {/* Accordion Item 1: Specifications */}
              <div>
                <button
                  onClick={() => toggleAccordion("specifications")}
                  className="w-full py-5 flex items-center justify-between text-left focus:outline-none group"
                >
                  <span className="text-xs uppercase font-mono tracking-[0.2em] text-white group-hover:text-[#D4AF37] transition-colors">
                    01. Garment Specifications
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#D4AF37] transition-transform duration-300 ${
                      openAccordion === "specifications" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openAccordion === "specifications" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 text-xs text-white/70 font-light leading-relaxed space-y-2 font-mono">
                        <div className="flex justify-between border-b border-white/5 py-1">
                          <span className="text-[#CDBFA6]">Fabric Composition:</span>
                          <span className="text-white">200 GSM PK Cotton (100% Premium)</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 py-1">
                          <span className="text-[#CDBFA6]">Fit Silhouette:</span>
                          <span className="text-white">Regular Tailored (No excessive sag)</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 py-1">
                          <span className="text-[#CDBFA6]">Hardware:</span>
                          <span className="text-white">Matte Black ROVE Engraved Button</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-[#CDBFA6]">Signature Mark:</span>
                          <span className="text-white">3-Line Gold Embroidery (Right Sleeve Only)</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Accordion Item 2: Architectural Details */}
              <div>
                <button
                  onClick={() => toggleAccordion("details")}
                  className="w-full py-5 flex items-center justify-between text-left focus:outline-none group"
                >
                  <span className="text-xs uppercase font-mono tracking-[0.2em] text-white group-hover:text-[#D4AF37] transition-colors">
                    02. Architectural Detailing
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#D4AF37] transition-transform duration-300 ${
                      openAccordion === "details" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openAccordion === "details" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-xs text-white/75 font-light leading-relaxed">
                        Every Rove Polo is built with gold shoulder piping extending from collar to sleeve for an elevated edge. Built with reinforced side slits for fluid mobility and lined with custom woven neck tape that prevents collar stretching or fading over prolonged wear.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Accordion Item 3: Care & Maintenance */}
              <div>
                <button
                  onClick={() => toggleAccordion("care")}
                  className="w-full py-5 flex items-center justify-between text-left focus:outline-none group"
                >
                  <span className="text-xs uppercase font-mono tracking-[0.2em] text-white group-hover:text-[#D4AF37] transition-colors">
                    03. Care & Preservation
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#D4AF37] transition-transform duration-300 ${
                      openAccordion === "care" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openAccordion === "care" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-xs text-white/75 font-light leading-relaxed">
                        Machine wash gentle with cold water and gentle neutral detergents. Wash inside out to protect gold thread embroidery. Hang dry or lay flat on towel—do not tumble dry on high heat. Iron on cool setting on reverse side if needed.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
