"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Lock, CheckCircle, Sparkles } from "lucide-react";
import { siteContent } from "@/config/siteContent";

export default function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [targetProduct, setTargetProduct] = useState("");

  useEffect(() => {
    const handleSelectProduct = (e: any) => {
      if (e.detail) {
        setTargetProduct(`${e.detail.drop} - ${e.detail.color} (${e.detail.size})`);
      }
    };
    window.addEventListener("rove-select-product", handleSelectProduct as any);
    return () => window.removeEventListener("rove-select-product", handleSelectProduct as any);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1500);
  };

  return (
    <section id="waitlist" className="relative py-32 md:py-48 bg-background text-foreground border-t border-border overflow-hidden">
      
      {/* Dynamic Background Noise & Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 md:px-12 relative z-10 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-card border border-border p-8 md:p-14 shadow-2xl relative gpu-layer"
        >
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gold" />

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-background border border-gold/30 text-[10px] font-mono tracking-[0.3em] text-gold uppercase mb-8">
            <Sparkles className="w-3 h-3 text-gold animate-pulse" />
            <span>{siteContent.waitlist.badge}</span>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-light font-serif tracking-tight text-foreground mb-4">
              {siteContent.waitlist.title}
            </h2>
            <p className="text-sm text-muted-foreground font-light max-w-md mx-auto leading-relaxed">
              {siteContent.waitlist.description}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
            {targetProduct && (
              <div className="text-xs font-mono text-gold mb-2 text-left">
                Target Allocation: {targetProduct}
              </div>
            )}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                disabled={status === "success" || status === "loading"}
                className="w-full bg-background border border-border text-foreground px-12 py-4 font-mono text-xs focus:outline-none focus:border-gold transition-colors disabled:opacity-50"
              />
            </div>
            
            <button
              type="submit"
              disabled={status === "success" || status === "loading"}
              className="w-full py-4 bg-foreground text-background hover:bg-gold border border-foreground hover:border-gold font-mono text-xs uppercase tracking-widest transition-all disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {status === "loading" ? "Processing..." : siteContent.waitlist.buttonText}
              {status !== "loading" && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </form>

          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-gold/10 border border-gold/30 flex items-center justify-center gap-3 text-gold"
            >
              <CheckCircle className="w-4 h-4" />
              <span className="font-mono text-xs uppercase tracking-widest">Allocation secured. Codex sent.</span>
            </motion.div>
          )}

          <div className="mt-8 text-center border-t border-border pt-6">
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
              Limited Edition • Guaranteed Authenticity
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
