"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, ShoppingBag } from "lucide-react";
import { siteContent } from "@/config/siteContent";
import { useCart } from "@/components/CartProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalQuantity, setIsCartOpen } = useCart();

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

  const primaryPrice = siteContent.drops[0]?.colors[0]?.priceFormatted || "PKR 2,299";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 gpu-layer ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md py-4 border-b border-border-subtle shadow-lg"
            : "bg-transparent py-7 border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Logo Branding - Text Only */}
          <Link
            href="/"
            className="flex items-center group"
          >
            <span className="font-serif font-light text-xl md:text-2xl tracking-[0.35em] uppercase text-foreground group-hover:text-accent transition-colors duration-500">
              {siteContent.brand.logoText}
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-12">
            {siteContent.nav.links.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-xs font-mono uppercase tracking-[0.25em] text-foreground/80 hover:text-accent transition-all duration-300 relative py-1 overflow-hidden group"
              >
                <span>{item.name}</span>
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-foreground/80 hover:text-accent transition-colors"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalQuantity > 0 && (
                <span className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 bg-accent text-background text-[9px] font-bold px-1.5 py-0.5 rounded-full font-mono">
                  {totalQuantity}
                </span>
              )}
            </button>

            <Link
              href="/#waitlist"
              className="px-6 py-2.5 bg-matte hover:bg-accent text-accent hover:text-background border border-accent/50 hover:border-accent font-mono text-xs uppercase tracking-[0.25em] transition-all duration-500 flex items-center gap-2 group shadow-lg"
            >
              <span>{siteContent.nav.ctaText}</span>
              <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu Toggle & Actions */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-foreground/80 hover:text-accent transition-colors"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalQuantity > 0 && (
                <span className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 bg-accent text-background text-[9px] font-bold px-1.5 py-0.5 rounded-full font-mono">
                  {totalQuantity}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-accent focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Overlay Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-background/98 backdrop-blur-xl flex flex-col justify-between px-8 py-28 md:hidden border-b border-border-subtle"
          >
            <div className="flex flex-col gap-8 mt-10">
              {siteContent.nav.links.map((item, idx) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-2xl font-serif text-left font-light text-foreground tracking-[0.2em] hover:text-accent uppercase transition-colors block"
                >
                  0{idx + 1}. {item.name}
                </motion.a>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-4 bg-accent text-background font-mono text-xs uppercase tracking-[0.3em] font-bold text-center shadow-2xl block"
              >
                {siteContent.nav.ctaText} — {primaryPrice}
              </Link>
              <span className="text-[10px] font-mono text-center text-foreground/50 tracking-[0.3em] uppercase">
                {siteContent.brand.tagline}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
