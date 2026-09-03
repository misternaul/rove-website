"use client";

import React from "react";
import Link from "next/link";
import { Globe, ArrowUp, Compass } from "lucide-react";
import { siteContent } from "@/config/siteContent";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-background text-foreground border-t border-border pt-24 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-border">
          
          {/* Brand Identity & Logo Mark */}
          <div className="md:col-span-5 flex flex-col items-start">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-serif tracking-[0.35em] text-2xl uppercase text-foreground">
                {siteContent.brand.logoText}
              </span>
            </div>
            <p className="text-xs text-sand/80 font-mono uppercase tracking-[0.25em] mb-4">
              {siteContent.footer.slogan}
            </p>
            <p className="text-xs text-foreground/60 font-light max-w-xs leading-relaxed font-sans">
              {siteContent.footer.aboutText}
            </p>
          </div>

          {/* Minimal Nav Links */}
          <div className="md:col-span-4 flex flex-col sm:flex-row gap-10 sm:gap-16">
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-gold block mb-4 font-semibold">
                Navigation
              </span>
              <ul className="space-y-3 text-xs uppercase tracking-[0.2em] text-foreground/80 font-light font-mono">
                {siteContent.nav.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="hover:text-gold transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-gold block mb-4 font-semibold">
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
                className="w-11 h-11 border border-border hover:border-gold text-foreground hover:text-gold flex items-center justify-center transition-all bg-card font-mono text-[11px] tracking-wider font-semibold"
              >
                IG
              </a>
              <a
                href="#manifesto"
                aria-label="Editorial Journal"
                className="w-11 h-11 border border-border hover:border-gold text-foreground hover:text-gold flex items-center justify-center transition-all bg-card"
              >
                <Compass className="w-4 h-4" />
              </a>
              <Link
                href="/lookbook"
                aria-label="Lookbook"
                className="w-11 h-11 border border-border hover:border-gold text-foreground hover:text-gold flex items-center justify-center transition-all bg-card"
              >
                <Globe className="w-4 h-4" />
              </Link>
            </div>

            <button
              onClick={scrollToTop}
              className="mt-8 md:mt-0 group flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-gold hover:text-foreground transition-colors"
            >
              <span>Back to Top</span>
              <div className="p-1.5 border border-gold group-hover:border-foreground transition-colors">
                <ArrowUp className="w-3 h-3" />
              </div>
            </button>
          </div>

        </div>

        {/* Copyright Bottom Bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
          <span>{siteContent.footer.copyrightText}</span>
          <div className="flex items-center gap-6">
            <span className="hover:text-foreground/80 cursor-pointer">Privacy Codex</span>
            <span>•</span>
            <span className="hover:text-foreground/80 cursor-pointer">Terms of Allocation</span>
            <span>•</span>
            <span className="text-gold/80">Drop 001 ({siteContent.brand.defaultCurrency})</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
