"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Shield, RefreshCw, ChevronDown, ChevronUp, ShoppingBag, ArrowRight, Layers } from "lucide-react";
import { useCart } from "@/components/CartProvider";

type ProductVariant = {
  id: string;
  size: string;
  stock: number;
};

type ProductImage = {
  id: string;
  url: string;
  isPrimary: boolean;
};

type Product = {
  id: string;
  name: string;
  shortDescription: string | null;
  basePrice: number;
  images: ProductImage[];
  variants: ProductVariant[];
};

export default function ProductShowcase({ initialProducts }: { initialProducts: Product[] }) {
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | null>("materials");
  
  const { addToCart } = useCart();

  if (!initialProducts || initialProducts.length === 0) {
    return (
      <section id="showcase" className="relative py-24 md:py-40 bg-background text-foreground border-t border-border">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-serif text-muted-foreground">Products arriving soon.</h2>
        </div>
      </section>
    );
  }

  const currentProduct = initialProducts[activeProductIndex];
  
  // Sort images (primary first)
  const sortedImages = [...currentProduct.images].sort((a, b) => (a.isPrimary === b.isPrimary ? 0 : a.isPrimary ? -1 : 1));
  const sortedVariants = [...currentProduct.variants].sort((a, b) => a.size.localeCompare(b.size));
  
  const validSizeIndex = Math.min(selectedSizeIndex, Math.max(0, sortedVariants.length - 1));
  const selectedVariant = sortedVariants[validSizeIndex];

  const currentImage = sortedImages[activeImageIndex]?.url || "/placeholder.jpg";

  const handleSwitchProduct = (newIndex: number) => {
    setActiveProductIndex(newIndex);
    setActiveImageIndex(0);
    setSelectedSizeIndex(0);
  };

  const handleReserveAllocation = () => {
    const waitlistElement = document.getElementById("waitlist");
    if (waitlistElement) {
      waitlistElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="showcase" className="relative py-24 md:py-40 bg-background text-foreground border-t border-border">
      
      {/* Ambient Radial background */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-gradient-to-br from-gold/5 via-burgundy/10 to-transparent rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-gold block mb-3">
            Available Now
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-light font-serif tracking-tight text-foreground mb-4">
            {currentProduct.name}
          </h2>
          <div className="w-16 h-[1px] bg-gold mx-auto my-6" />
          <p className="text-sm md:text-base text-muted-foreground font-light max-w-xl mx-auto leading-relaxed font-sans">
            {currentProduct.shortDescription}
          </p>
        </div>

        {/* RELEASES / MULTI-PRODUCT TAB SWITCHER */}
        {initialProducts.length > 1 && (
          <div className="mb-16 flex flex-col items-center">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground mb-3 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-gold" />
              <span>Select Item</span>
            </span>
            <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-card border border-border max-w-2xl">
              {initialProducts.map((product, i) => (
                <button
                  key={product.id}
                  onClick={() => handleSwitchProduct(i)}
                  className={`px-6 py-3 text-xs font-mono uppercase tracking-[0.2em] transition-all ${
                    activeProductIndex === i
                      ? "bg-gold text-background font-bold shadow-md"
                      : "text-muted-foreground hover:text-foreground bg-transparent"
                  }`}
                >
                  {product.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Product Dual View Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT: Visual Presentation Stage (Columns 1 to 7) */}
          <div className="lg:col-span-7 lg:sticky lg:top-28 flex flex-col items-center">
            
            {/* Main Photography Canvas */}
            <div className="relative w-full max-w-xl aspect-[3/4] bg-card border border-border overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImage}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 w-full h-full"
                >
                  <Image
                    src={currentImage}
                    alt={currentProduct.name}
                    fill
                    priority
                    className="object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 600px"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Decorative Frame Overlay */}
              <div className="absolute inset-0 border-[12px] border-background/20 pointer-events-none" />
            </div>

            {/* Thumbnail Quick Switcher below image */}
            <div className="flex flex-wrap justify-center gap-3 mt-6 w-full max-w-xl">
              {sortedImages.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-24 bg-card border overflow-hidden transition-all ${
                    activeImageIndex === idx ? "border-gold ring-1 ring-gold scale-105 shadow-md" : "border-border opacity-70 hover:opacity-100 hover:border-gold"
                  }`}
                >
                  <Image src={img.url} alt={`Thumbnail ${idx+1}`} fill className="object-cover object-top" />
                </button>
              ))}
              {sortedImages.length === 0 && (
                <div className="text-xs font-mono text-muted-foreground py-4">No images uploaded for this product.</div>
              )}
            </div>
          </div>

          {/* RIGHT: Product Customizer & Direct Order Action (Columns 8 to 12) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            
            <div className="p-8 md:p-10 bg-card border border-border shadow-xl relative">
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-gold" />
              
              {/* Dynamic Pricing Display */}
              <div className="flex flex-col mb-8 pb-8 border-b border-border">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
                    Valuation
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-mono font-bold text-gold tracking-tight">
                      PKR {currentProduct.basePrice.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-sans text-muted-foreground">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span>Ships within 24 hours</span>
                </div>
              </div>

              {/* Sizing Options */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-[0.25em] text-gold font-semibold">
                    Select Sizing Grade
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {sortedVariants.map((v, idx) => {
                    const isOutOfStock = v.stock === 0;
                    const isLowStock = !isOutOfStock && v.stock < 5;

                    return (
                      <button
                        key={v.id}
                        onClick={() => !isOutOfStock && setSelectedSizeIndex(idx)}
                        disabled={isOutOfStock}
                        className={`py-4 px-3 border text-xs font-mono uppercase tracking-wider transition-all flex flex-col items-center gap-1 relative ${
                          isOutOfStock 
                            ? "border-red-900/30 bg-red-950/10 text-red-500/50 cursor-not-allowed"
                            : validSizeIndex === idx
                              ? "border-gold bg-gold/10 text-gold font-bold shadow-md"
                              : "border-border text-muted-foreground hover:border-gold hover:text-foreground bg-background"
                        }`}
                      >
                        <span className={`text-sm font-semibold ${isOutOfStock ? "line-through" : ""}`}>
                          {v.size}
                        </span>
                        {isOutOfStock && (
                          <span className="text-[9px] text-red-500 font-bold tracking-widest mt-1">SOLD OUT</span>
                        )}
                        {isLowStock && (
                          <span className="absolute -top-2.5 right-0 bg-gold text-background text-[8px] font-bold px-2 py-0.5 shadow-md">
                            ONLY {v.stock} LEFT
                          </span>
                        )}
                      </button>
                    );
                  })}
                  {sortedVariants.length === 0 && (
                    <div className="col-span-2 text-center text-xs font-mono text-muted-foreground py-4 border border-border">
                      No sizes available.
                    </div>
                  )}
                </div>
              </div>

              {/* PRIMARY ACTION: ADD TO CART */}
              <div className="space-y-4">
                <button
                  onClick={() => {
                    if (!selectedVariant) return;
                    addToCart({
                      id: `${currentProduct.id}_${selectedVariant.id}`,
                      dropId: currentProduct.id,
                      dropName: currentProduct.name,
                      colorId: currentProduct.id,
                      colorName: "Standard",
                      sizeId: selectedVariant.id,
                      sizeName: selectedVariant.size,
                      quantity: 1,
                      priceFormatted: `PKR ${currentProduct.basePrice.toLocaleString()}`,
                      priceNumeric: currentProduct.basePrice,
                      image: sortedImages[0]?.url || "/placeholder.jpg",
                      maxStock: selectedVariant.stock
                    });
                  }}
                  disabled={!selectedVariant || selectedVariant.stock === 0}
                  className="w-full py-5 bg-gold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-background font-mono font-bold text-xs tracking-[0.25em] uppercase transition-all duration-300 flex items-center justify-center gap-3 shadow-xl transform hover:-translate-y-0.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {!selectedVariant || selectedVariant.stock === 0 ? "SOLD OUT" : "Acquire Allocation"} (PKR {currentProduct.basePrice.toLocaleString()})
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleReserveAllocation}
                  className="w-full py-3.5 bg-background border border-border hover:border-gold text-muted-foreground hover:text-foreground font-mono text-[11px] tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                  <span>Reserve Priority Access</span>
                </button>
              </div>

              {/* Trust Value Propositions */}
              <div className="mt-8 pt-6 border-t border-border space-y-3">
                <div className="flex items-center gap-3 text-xs text-muted-foreground font-light">
                  <Shield className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>Authenticity Guaranteed</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground font-light">
                  <RefreshCw className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>Complimentary express shipping on all orders</span>
                </div>
              </div>

            </div>

            {/* Expandable Architectural Specification Accordion */}
            <div className="mt-8 space-y-3">
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-gold block mb-2 px-2">
                Garment Specifications & Codex
              </span>
              
              {[
                { id: "materials", title: "Material Codex", content: "Constructed from 400GSM heavyweight organic cotton jersey. Milled exclusively for this release with a dry, vintage hand-feel that drapes architecturally." },
                { id: "fit", title: "Fit Architecture", content: "Engineered with a dropped shoulder and slightly cropped hem. We recommend taking your true size for the intended boxy silhouette, or sizing up for an exaggerated drape." }
              ].map((acc) => {
                const isOpen = openAccordion === acc.id;
                return (
                  <div
                    key={acc.id}
                    className="bg-card border border-border hover:border-gold/50 transition-colors overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenAccordion(isOpen ? null : acc.id)}
                      className="w-full p-5 text-left flex items-center justify-between text-xs font-mono uppercase tracking-wider text-foreground hover:text-gold transition-colors"
                    >
                      <span>{acc.title}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-gold" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>

                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-5 pb-5 text-xs text-muted-foreground font-light leading-relaxed border-t border-border pt-3"
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
