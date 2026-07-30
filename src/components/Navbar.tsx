"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { siteContent } from "@/config/siteContent";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const primaryPrice = siteContent.drops[0]?.colors[0]?.priceFormatted || "PKR 2,299";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 ${
          isScrolled
            ? "bg-[#0D0D0D]/95 backdrop-blur-md py-4 border-b border-[#D4AF37]/20 shadow-2xl"
            : "bg-transparent py-7 border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Logo Branding */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-3 group"
          >
            <div className="relative w-8 h-8 md:w-10 md:h-10 overflow-hidden transition-transform duration-500 group-hover:scale-105">
              <Image
                src={siteContent.brand.logoIconImage}
                alt={`${siteContent.brand.name} Icon`}
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-serif font-light text-xl md:text-2xl tracking-[0.35em] uppercase text-white group-hover:text-[#D4AF37] transition-colors duration-500">
              {siteContent.brand.logoText}
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-12">
            {siteContent.nav.links.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-xs font-mono uppercase tracking-[0.25em] text-[#FFFFFF]/80 hover:text-[#D4AF37] transition-all duration-300 relative py-1 overflow-hidden group"
              >
                <span>{item.name}</span>
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#D4AF37] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              </button>
            ))}
          </nav>

          {/* Action Button */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => scrollToSection("#showcase")}
              className="px-6 py-2.5 bg-[#141414] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#0D0D0D] border border-[#D4AF37]/50 hover:border-[#D4AF37] font-mono text-xs uppercase tracking-[0.25em] transition-all duration-500 flex items-center gap-2 group shadow-lg"
            >
              <span>{siteContent.nav.ctaText}</span>
              <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#D4AF37] focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Overlay Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 z-30 bg-[#0D0D0D]/98 backdrop-blur-xl flex flex-col justify-between px-8 py-28 md:hidden border-b border-[#D4AF37]/20"
        >
          <div className="flex flex-col gap-8 mt-10">
            {siteContent.nav.links.map((item, idx) => (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => scrollToSection(item.href)}
                className="text-2xl font-serif text-left font-light text-white tracking-[0.2em] hover:text-[#D4AF37] uppercase transition-colors"
              >
                0{idx + 1}. {item.name}
              </motion.button>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => scrollToSection("#showcase")}
              className="w-full py-4 bg-[#D4AF37] text-[#0D0D0D] font-mono text-xs uppercase tracking-[0.3em] font-bold text-center shadow-2xl"
            >
              {siteContent.nav.ctaText} — {primaryPrice}
            </button>
            <span className="text-[10px] font-mono text-center text-[#CDBFA6]/60 tracking-[0.3em] uppercase">
              {siteContent.brand.tagline}
            </span>
          </div>
        </motion.div>
      )}
    </>
  );
}
