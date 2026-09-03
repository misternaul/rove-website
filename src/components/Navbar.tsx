"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, User, ShoppingBag } from "lucide-react";
import { siteContent } from "@/config/siteContent";
import { useCart } from "@/components/CartProvider";

const NAV_LINKS = [
  { name: "Shop", href: "/shop" },
  { name: "Craft", href: "/craftsmanship" },
  { name: "Lookbook", href: "/lookbook" },
  { name: "Journal", href: "/journal" },
  { name: "Community", href: "/community" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalQuantity, setIsCartOpen } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 gpu-layer ${
          isScrolled
            ? "bg-[#0D0D0D]/95 backdrop-blur-md py-4 border-b border-[#D4AF37]/10 shadow-2xl"
            : "bg-gradient-to-b from-[#0D0D0D]/80 to-transparent py-7 border-b border-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Primary Navigation - Left */}
          <nav className="hidden lg:flex items-center gap-8 w-1/3">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-[11px] font-mono uppercase tracking-[0.2em] transition-all duration-300 relative py-1 overflow-hidden group ${
                  pathname.startsWith(item.href) ? "text-[#D4AF37]" : "text-white/70 hover:text-white"
                }`}
              >
                <span>{item.name}</span>
                <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-[#D4AF37] transform transition-transform duration-500 ${
                  pathname.startsWith(item.href) ? "translate-x-0" : "-translate-x-full group-hover:translate-x-0"
                }`} />
              </Link>
            ))}
          </nav>

          {/* Logo Branding - Center */}
          <div className="flex justify-start lg:justify-center w-1/3">
            <Link
              href="/"
              onClick={(e) => {
                if (pathname === "/") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
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
                  quality={90}
                />
              </div>
              <span className="font-serif font-light text-xl md:text-2xl tracking-[0.35em] uppercase text-white group-hover:text-[#D4AF37] transition-colors duration-500">
                {siteContent.brand.logoText}
              </span>
            </Link>
          </div>

          {/* Action Icons - Right */}
          <div className="hidden lg:flex items-center justify-end gap-6 w-1/3">
            <button className="text-white/70 hover:text-[#D4AF37] transition-colors" aria-label="Search">
              <Search className="w-4 h-4" />
            </button>
            <Link href="/account" className="text-white/70 hover:text-[#D4AF37] transition-colors" aria-label="Account">
              <User className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative text-white/70 hover:text-[#D4AF37] transition-colors"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalQuantity > 0 && (
                <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-[#D4AF37] text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full font-mono">
                  {totalQuantity}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="lg:hidden flex items-center gap-5 w-2/3 justify-end">
            <button className="text-white/70 hover:text-[#D4AF37] transition-colors" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative text-white/70 hover:text-[#D4AF37] transition-colors"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalQuantity > 0 && (
                <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-[#D4AF37] text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full font-mono">
                  {totalQuantity}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#D4AF37] focus:outline-none ml-2"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Overlay Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-30 bg-[#0D0D0D] flex flex-col pt-32 pb-10 px-8 border-b border-[#D4AF37]/20"
          >
            <div className="flex-1 flex flex-col justify-center gap-8">
              {NAV_LINKS.map((item, idx) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-4xl md:text-5xl font-serif text-left font-light text-white tracking-widest hover:text-[#D4AF37] transition-colors block"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="pt-10 border-t border-white/10 flex items-center justify-between"
            >
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[#D4AF37]"
              >
                <User className="w-4 h-4" /> My Account
              </Link>
              
              <span className="text-[10px] font-mono text-[#CDBFA6]/40 tracking-[0.3em] uppercase">
                {siteContent.brand.tagline}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
