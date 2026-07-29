"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Manifesto", href: "#manifesto" },
    { name: "The Polo", href: "#showcase" },
    { name: "Craft & Detail", href: "#craft" },
    { name: "Lookbook", href: "#gallery" },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "bg-[#0D0D0D]/90 backdrop-blur-md py-4 border-b border-[#D4AF37]/15 shadow-2xl shadow-black/80"
          : "bg-gradient-to-b from-[#0D0D0D]/90 via-[#0D0D0D]/40 to-transparent py-7"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="group flex items-center gap-3 text-white transition-opacity duration-300 hover:opacity-80"
        >
          <div className="relative w-10 h-8 overflow-hidden">
            <Image
              src="/images/logo-icon.jpg"
              alt="ROVE Logo Icon"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold tracking-[0.3em] text-lg leading-none uppercase text-white font-serif">
              ROVE
            </span>
            <span className="text-[9px] tracking-[0.22em] text-[#D4AF37] uppercase font-mono mt-1 font-light opacity-90">
              Drop 001
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="text-xs uppercase tracking-[0.25em] text-[#FFFFFF]/80 hover:text-[#D4AF37] transition-colors duration-300 font-medium py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#D4AF37] hover:after:w-full after:transition-all after:duration-300"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action CTA Button */}
        <div className="hidden md:flex items-center">
          <a
            href="#waitlist"
            onClick={(e) => handleScrollTo(e, "#waitlist")}
            className="group relative px-6 py-2.5 text-xs font-medium tracking-[0.2em] uppercase text-[#D4AF37] overflow-hidden rounded-none border border-[#D4AF37]/40 hover:border-[#D4AF37] transition-all duration-500 bg-transparent hover:bg-[#D4AF37]/10"
          >
            <span className="relative z-10 flex items-center gap-2">
              Join Priority
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
            </span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white hover:text-[#D4AF37] p-2 focus:outline-none transition-colors"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-[#0D0D0D] border-b border-[#D4AF37]/20 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className="text-sm uppercase tracking-[0.25em] text-[#FFFFFF]/90 hover:text-[#D4AF37] transition-colors font-medium py-2 border-b border-white/5"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#waitlist"
                onClick={(e) => handleScrollTo(e, "#waitlist")}
                className="mt-2 w-full py-3.5 text-center text-xs font-medium tracking-[0.2em] uppercase text-[#0D0D0D] bg-[#D4AF37] hover:bg-[#D4AF37]/90 transition-colors"
              >
                Join Priority Waitlist
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
