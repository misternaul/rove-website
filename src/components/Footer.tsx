"use client";

import React from "react";
import Image from "next/image";
import { Globe, ArrowUp, Compass } from "lucide-react";
import { siteContent } from "@/config/siteContent";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-background text-foreground border-t border-foreground/10 pt-24 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-foreground/10">
          
          {/* Brand Identity & Logo Mark */}
          <div className="md:col-span-5 flex flex-col items-start">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-12 h-10 overflow-hidden">
                <Image
                  src={siteContent.brand.logoIconImage}
                  alt="ROVE Logo Icon"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-serif tracking-[0.35em] text-2xl uppercase text-foreground">
                {siteContent.brand.logoText}
              </span>
            </div>
            <p className="text-xs text-[#CDBFA6]/80 font-mono uppercase tracking-[0.25em] mb-4">
              {siteContent.footer.slogan}
            </p>
            <p className="text-xs text-foreground/60 font-light max-w-xs leading-relaxed font-sans">
              {siteContent.footer.aboutText}
            </p>
          </div>

          {/* Minimal Nav Links */}
          <div className="md:col-span-4 flex flex-col sm:flex-row gap-10 sm:gap-16">
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#D4AF37] block mb-4 font-semibold">
                Navigation
              </span>
              <ul className="space-y-3 text-xs uppercase tracking-[0.2em] text-foreground/80 font-light font-mono">
                {siteContent.nav.links.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="hover:text-[#D4AF37] transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#D4AF37] block mb-4 font-semibold">
                Inquiries
              </span>
              <ul className="space-y-3 text-xs tracking-wider text-foreground/70 font-light font-mono">
                {siteContent.footer.inquiries.map((inq) => (
                  <li key={inq.label}>
                    <a href={`mailto:${inq.email}`} className="hover:text-foreground transition-colors">
                      {inq.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social Links & Scroll Top */}
          <div className="md:col-span-3 flex flex-col justify-between items-start md:items-end">
            <div className="flex items-center gap-3">
              <a
                href={siteContent.footer.instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-11 h-11 border border-foreground/20 hover:border-[#D4AF37] text-foreground hover:text-[#D4AF37] flex items-center justify-center transition-all bg-matte font-mono text-[11px] tracking-wider font-semibold"
              >
                IG
              </a>
              <a
                href="#manifesto"
                aria-label="Editorial Journal"
                className="w-11 h-11 border border-foreground/20 hover:border-[#D4AF37] text-foreground hover:text-[#D4AF37] flex items-center justify-center transition-all bg-matte"
              >
                <Compass className="w-4 h-4" />
              </a>
              <a
                href="/lookbook"
                aria-label="Global Stockists"
                className="w-11 h-11 border border-foreground/20 hover:border-[#D4AF37] text-foreground hover:text-[#D4AF37] flex items-center justify-center transition-all bg-matte"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>

            <button
              onClick={scrollToTop}
              className="mt-8 md:mt-0 group flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] hover:text-foreground transition-colors"
            >
              <span>Back to Top</span>
              <div className="p-1.5 border border-[#D4AF37] group-hover:border-white transition-colors">
                <ArrowUp className="w-3 h-3" />
              </div>
            </button>
          </div>

        </div>

        {/* Copyright Bottom Bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono uppercase tracking-[0.2em] text-foreground/40">
          <span>{siteContent.footer.copyrightText}</span>
          <div className="flex items-center gap-6">
            <span className="hover:text-foreground/80 cursor-pointer">Privacy Codex</span>
            <span>•</span>
            <span className="hover:text-foreground/80 cursor-pointer">Terms of Allocation</span>
            <span>•</span>
            <span className="text-[#D4AF37]/80">Current Release ({siteContent.brand.defaultCurrency})</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
