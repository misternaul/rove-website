"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Shield, RefreshCw, ChevronDown, ChevronUp, ShoppingBag, ArrowRight, Layers } from "lucide-react";
import { siteContent, DropItem, SiteConfig, SizeOption } from "@/config/siteContent";
import { useCart } from "@/components/CartProvider";

const fallbackSizes: SizeOption[] = [
  { id: "M", name: "Medium", details: 'Chest: 20" | Length: 27.5" | Shoulder: 17.5"' },
  { id: "L", name: "Large", details: 'Chest: 21" | Length: 28.5" | Shoulder: 18"' },
];

export default function ProductShowcase() {
  const [config, setConfig] = useState<SiteConfig>(siteContent);
  const [activeDropIndex, setActiveDropIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [activeView, setActiveView] = useState<"front" | "back">("front");
  const [openAccordion, setOpenAccordion] = useState<string | null>("materials");
  
  const { addToCart } = useCart();

  useEffect(() => {
    // Automatically retrieve live updates saved via /admin Studio or Vercel Upstash Redis
    fetch("/api/cms")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.data) {
          setConfig(data.data);
        }
      })
      .catch((err) => console.warn("Using default codex for product showcase:", err));
  }, []);

  const currentDrop: DropItem = config.drops[activeDropIndex] || config.drops[0] || siteContent.drops[0];
  const selectedColor = currentDrop.colors[selectedColorIndex] || currentDrop.colors[0];

  // 👉 Size options are now dynamically managed directly under EACH individual product / item!
  const availableSizes: SizeOption[] = selectedColor.sizes && selectedColor.sizes.length > 0
    ? selectedColor.sizes
    : fallbackSizes;

  const validSizeIndex = Math.min(selectedSizeIndex, Math.max(0, availableSizes.length - 1));
  const selectedSize = availableSizes[validSizeIndex] || availableSizes[0];

  const currentImage = activeView === "front" ? selectedColor.frontImage : selectedColor.backImage;

  // Reset product item and size index if switching between different product drops
  const handleSwitchDrop = (newIndex: number) => {
    setActiveDropIndex(newIndex);
    setSelectedColorIndex(0);
    setSelectedSizeIndex(0);
  };

  // Reset size selection when switching between individual product items in a drop
  const handleSwitchColor = (newIdx: number) => {
    setSelectedColorIndex(newIdx);
    setSelectedSizeIndex(0);
  };

  const handleReserveAllocation = () => {
    const waitlistElement = document.getElementById("waitlist");
    if (waitlistElement) {
      waitlistElement.scrollIntoView({ behavior: "smooth" });
      const event = new CustomEvent("rove-select-product", {
        detail: { color: selectedColor.name, size: selectedSize.id, price: selectedColor.priceFormatted, drop: currentDrop.name },
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
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#D4AF37] block mb-3">
            {currentDrop.badge}
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-light font-serif tracking-tight text-white mb-4">
            {currentDrop.name}
          </h2>
          <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto my-6" />
          <p className="text-sm md:text-base text-[#CDBFA6]/90 font-light max-w-xl mx-auto leading-relaxed font-sans">
            {currentDrop.shortDescription}
          </p>
        </div>

        {/* RELEASES / MULTI-DROP TAB SWITCHER */}
        {config.drops.length > 1 && (
          <div className="mb-16 flex flex-col items-center">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/50 mb-3 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Select Studio Release</span>
            </span>
            <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-[#141414] border border-white/15 max-w-2xl">
              {config.drops.map((drop, i) => (
                <button
                  key={drop.id}
                  onClick={() => handleSwitchDrop(i)}
                  className={`px-6 py-3 text-xs font-mono uppercase tracking-[0.2em] transition-all ${
                    activeDropIndex === i
                      ? "bg-[#D4AF37] text-[#0D0D0D] font-bold shadow-md"
                      : "text-white/70 hover:text-white bg-transparent"
                  }`}
                >
                  {drop.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Product Dual View Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT: Visual Presentation Stage (Columns 1 to 7) */}
          <div className="lg:col-span-7 lg:sticky lg:top-28 flex flex-col items-center">
            
            {/* View Selector Tabs (Image 1 / Image 2) */}
            <div className="flex items-center justify-center gap-2 mb-6 w-full max-w-md">
              <button
                onClick={() => setActiveView("front")}
                className={`flex-1 py-3 text-xs font-mono uppercase tracking-[0.2em] transition-all border ${
                  activeView === "front"
                    ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10"
                    : "border-white/15 text-white/60 hover:text-white bg-[#141414]"
                }`}
              >
                Image 1 (Front View)
              </button>
              <button
                onClick={() => setActiveView("back")}
                className={`flex-1 py-3 text-xs font-mono uppercase tracking-[0.2em] transition-all border ${
                  activeView === "back"
                    ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10"
                    : "border-white/15 text-white/60 hover:text-white bg-[#141414]"
                }`}
              >
                Image 2 (Back View)
              </button>
            </div>

            {/* Main Photography Canvas */}
            <div className="relative w-full max-w-xl aspect-[3/4] bg-[#141414] border border-white/10 overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedColor.id}-${activeView}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 w-full h-full"
                >
                  <Image
                    src={currentImage}
                    alt={`${currentDrop.name} — ${selectedColor.name} (${activeView})`}
                    fill
                    priority
                    className="object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 600px"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Decorative Frame Overlay */}
              <div className="absolute inset-0 border-[12px] border-[#0D0D0D]/40 pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
                <span className="px-3 py-1.5 bg-[#0D0D0D]/90 backdrop-blur-md border border-[#D4AF37]/30 text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.2em]">
                  {selectedColor.name}
                </span>
                <span className="px-3 py-1.5 bg-[#0D0D0D]/90 backdrop-blur-md border border-[#D4AF37]/30 text-[10px] font-mono text-white/90 uppercase tracking-[0.2em] font-semibold">
                  {selectedColor.priceFormatted}
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
                  <span className="text-[9px] font-mono tracking-wider uppercase text-white bg-black/80 px-1.5 py-0.5">Image 1</span>
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
                  <span className="text-[9px] font-mono tracking-wider uppercase text-white bg-black/80 px-1.5 py-0.5">Image 2</span>
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
              
              {/* Dynamic Pricing Display in PKR based on selected product item */}
              <div className="flex flex-col mb-8 pb-8 border-b border-white/10">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-white/50">
                    Valuation ({selectedColor.name.split(" ")[0]})
                  </span>
                  <div className="flex items-baseline gap-3">
                    {selectedColor.isDiscountActive && (
                      <span className="text-lg sm:text-xl font-mono text-white/40 line-through tracking-tight">
                        {selectedColor.priceFormatted}
                      </span>
                    )}
                    <motion.span
                      key={selectedColor.isDiscountActive ? selectedColor.discountedPriceFormatted : selectedColor.priceFormatted}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-2xl sm:text-3xl font-mono font-bold text-[#D4AF37] tracking-tight"
                    >
                      {selectedColor.isDiscountActive ? selectedColor.discountedPriceFormatted : selectedColor.priceFormatted}
                    </motion.span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-sans text-white/70">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                  <span>{currentDrop.shippingNote}</span>
                </div>
              </div>

              {/* 1. Item / Color Selection State (Supports any number of products!) */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
                    1. Select Item / Colorway
                  </span>
                  <span className="text-xs font-mono text-white/80">
                    Active: <strong className="text-white font-medium">{selectedColor.name}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentDrop.colors.map((c, i) => (
                    <button
                      key={c.id || i}
                      onClick={() => handleSwitchColor(i)}
                      className={`p-3.5 border flex flex-col gap-2 transition-all ${
                        selectedColorIndex === i
                          ? "border-[#D4AF37] bg-[#D4AF37]/15 shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                          : "border-white/15 hover:border-white/40 bg-[#0D0D0D]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 w-full">
                        <span
                          className="w-4 h-4 rounded-full border border-white/40 flex-shrink-0"
                          style={{ backgroundColor: c.hex || "#777777" }}
                        />
                        <span className="text-xs font-mono uppercase tracking-wider text-left text-white leading-tight font-semibold truncate">
                          {c.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between w-full pt-1 border-t border-white/10">
                        <span className="text-[10px] font-mono text-white/50 uppercase">Price:</span>
                        <span className="text-xs font-mono font-bold text-[#D4AF37]">
                          {c.isDiscountActive ? c.discountedPriceFormatted : c.priceFormatted}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Sizing Options Under Individual Product */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
                    2. Select Sizing Grade
                  </span>
                  <span className="text-[11px] font-mono text-white/60 hover:text-white underline cursor-pointer">
                    Tailored Fit Specs
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {availableSizes.map((s, idx) => {
                    const isOutOfStock = s.stockQuantity === 0;
                    const isLowStock = !isOutOfStock && s.stockQuantity !== undefined && s.stockQuantity < 5;

                    return (
                      <button
                        key={s.id || idx}
                        onClick={() => !isOutOfStock && setSelectedSizeIndex(idx)}
                        disabled={isOutOfStock}
                        className={`py-4 px-3 border text-xs font-mono uppercase tracking-wider transition-all flex flex-col items-center gap-1 relative ${
                          isOutOfStock 
                            ? "border-red-900/30 bg-red-950/10 text-red-500/50 cursor-not-allowed"
                            : validSizeIndex === idx
                              ? "border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37] font-bold shadow-md"
                              : "border-white/15 text-white/70 hover:border-white/50 hover:text-white bg-[#0D0D0D]"
                        }`}
                      >
                        <span className={`text-sm font-semibold ${isOutOfStock ? "line-through" : ""}`}>
                          {s.name} ({s.id})
                        </span>
                        {isOutOfStock && (
                          <span className="text-[9px] text-red-500 font-bold tracking-widest mt-1">SOLD OUT</span>
                        )}
                        {isLowStock && (
                          <span className="absolute -top-2.5 right-0 bg-[#D4AF37] text-black text-[8px] font-bold px-2 py-0.5 shadow-md">
                            ONLY {s.stockQuantity} LEFT
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Size Exact Measurements Feedback for active size */}
                <div className="mt-3 p-3.5 bg-[#0D0D0D] border border-white/10 text-xs font-mono text-white/80 text-center shadow-inner">
                  <span className="text-[#D4AF37] font-semibold">{selectedSize.name} Specs: </span>
                  <span className="text-[#FFFFFF]">{selectedSize.details}</span>
                </div>
              </div>

              {/* PRIMARY ACTION: ADD TO CART */}
              <div className="space-y-4">
                <button
                  onClick={() => {
                    addToCart({
                      id: `${currentDrop.id}_${selectedColor.id}_${selectedSize.id}`,
                      dropId: currentDrop.id,
                      dropName: currentDrop.name,
                      colorId: selectedColor.id,
                      colorName: selectedColor.name,
                      sizeId: selectedSize.id,
                      sizeName: selectedSize.name,
                      quantity: 1,
                      priceFormatted: selectedColor.isDiscountActive ? selectedColor.discountedPriceFormatted! : selectedColor.priceFormatted,
                      priceNumeric: selectedColor.isDiscountActive ? selectedColor.discountedPriceNumeric! : selectedColor.priceNumeric,
                      image: selectedColor.frontImage,
                      maxStock: selectedSize.stockQuantity ?? 50
                    });
                  }}
                  disabled={selectedSize.stockQuantity === 0}
                  className="w-full py-5 bg-[#D4AF37] hover:bg-[#c49f27] disabled:opacity-50 disabled:cursor-not-allowed text-[#0D0D0D] font-mono font-bold text-xs tracking-[0.25em] uppercase transition-all duration-300 flex items-center justify-center gap-3 shadow-xl transform hover:-translate-y-0.5"
                >
                  <ShoppingBag className="w-4 h-4 text-[#0D0D0D]" />
                  <span>
                    {selectedSize.stockQuantity === 0 ? "SOLD OUT" : currentDrop.orderButtonText} (
                    {selectedColor.isDiscountActive ? selectedColor.discountedPriceFormatted : selectedColor.priceFormatted})
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#0D0D0D]" />
                </button>

                <button
                  onClick={handleReserveAllocation}
                  className="w-full py-3.5 bg-[#0D0D0D] border border-white/20 hover:border-[#D4AF37] text-white/80 hover:text-white font-mono text-[11px] tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{currentDrop.secondaryActionText}</span>
                </button>
              </div>

              {/* Trust Value Propositions */}
              <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                <div className="flex items-center gap-3 text-xs text-white/70 font-light">
                  <Shield className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                  <span>{currentDrop.guaranteeText}</span>
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
              
              {currentDrop.accordions.map((acc) => {
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
    </section>
  );
}
