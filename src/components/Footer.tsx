"use client";

import React from "react";
import Image from "next/image";
import { Globe, Bookmark, ArrowUp, Compass } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0D0D0D] text-white border-t border-white/10 pt-24 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          
          {/* Brand Identity & Logo Mark */}
          <div className="md:col-span-5 flex flex-col items-start">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-12 h-10 overflow-hidden">
                <Image
                  src="/images/logo-icon.jpg"
                  alt="ROVE Logo Icon"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-serif tracking-[0.35em] text-2xl uppercase text-white">
                ROVE
              </span>
            </div>
            <p className="text-xs text-[#CDBFA6]/80 font-mono uppercase tracking-[0.25em] mb-4">
              Less Noise. More Presence.
            </p>
            <p className="text-xs text-white/60 font-light max-w-xs leading-relaxed">
              An independent label dedicated to everyday essentials engineered with calm, clarity, and uncompromising distinction.
            </p>
          </div>

          {/* Minimal Nav Links */}
          <div className="md:col-span-4 flex flex-col sm:flex-row gap-10 sm:gap-16">
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#D4AF37] block mb-4 font-semibold">
                Navigation
              </span>
              <ul className="space-y-3 text-xs uppercase tracking-[0.2em] text-white/80 font-light">
                <li><a href="#manifesto" className="hover:text-[#D4AF37] transition-colors">Manifesto</a></li>
                <li><a href="#showcase" className="hover:text-[#D4AF37] transition-colors">The Polo</a></li>
                <li><a href="#craft" className="hover:text-[#D4AF37] transition-colors">Craftsmanship</a></li>
                <li><a href="#gallery" className="hover:text-[#D4AF37] transition-colors">Lookbook</a></li>
                <li><a href="#waitlist" className="hover:text-[#D4AF37] transition-colors">Allocation List</a></li>
              </ul>
            </div>

            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#D4AF37] block mb-4 font-semibold">
                Inquiries
              </span>
              <ul className="space-y-3 text-xs tracking-wider text-white/70 font-light font-mono">
                <li><a href="#waitlist" className="hover:text-white transition-colors">Press & Editorial</a></li>
                <li><a href="#waitlist" className="hover:text-white transition-colors">Client Services</a></li>
                <li><a href="#waitlist" className="hover:text-white transition-colors">Bespoke Fitting</a></li>
              </ul>
            </div>
          </div>

          {/* Social Links & Scroll Top */}
          <div className="md:col-span-3 flex flex-col justify-between items-start md:items-end">
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-11 h-11 border border-white/20 hover:border-[#D4AF37] text-white hover:text-[#D4AF37] flex items-center justify-center transition-all bg-[#141414] font-mono text-[11px] tracking-wider font-semibold"
              >
                IG
              </a>
              <a
                href="#manifesto"
                aria-label="Editorial Journal"
                className="w-11 h-11 border border-white/20 hover:border-[#D4AF37] text-white hover:text-[#D4AF37] flex items-center justify-center transition-all bg-[#141414]"
              >
                <Compass className="w-4 h-4" />
              </a>
              <a
                href="#gallery"
                aria-label="Global Stockists"
                className="w-11 h-11 border border-white/20 hover:border-[#D4AF37] text-white hover:text-[#D4AF37] flex items-center justify-center transition-all bg-[#141414]"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>

            <button
              onClick={scrollToTop}
              className="mt-8 md:mt-0 group flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] hover:text-white transition-colors"
            >
              <span>Back to Top</span>
              <div className="p-1.5 border border-[#D4AF37] group-hover:border-white transition-colors">
                <ArrowUp className="w-3 h-3" />
              </div>
            </button>
          </div>

        </div>

        {/* Copyright Bottom Bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
          <span>&copy; {new Date().getFullYear()} ROVE Presence. All Rights Reserved.</span>
          <div className="flex items-center gap-6">
            <span className="hover:text-white/80 cursor-pointer">Privacy Codex</span>
            <span>•</span>
            <span className="hover:text-white/80 cursor-pointer">Terms of Allocation</span>
            <span>•</span>
            <span className="text-[#D4AF37]/80">Drop 001 Release</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
