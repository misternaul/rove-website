"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Send, Sparkles, AlertCircle, Lock } from "lucide-react";

export default function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [reservedProduct, setReservedProduct] = useState<{ color: string; size: string } | null>({
    color: "Jet Black Obsidian",
    size: "M / L",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleProductSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{ color: string; size: string }>;
      if (customEvent.detail) {
        setReservedProduct(customEvent.detail);
      }
    };
    window.addEventListener("rove-select-product", handleProductSelect);
    return () => window.removeEventListener("rove-select-product", handleProductSelect);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@") || !email.includes(".")) {
      setStatus("error");
      setErrorMessage("Please input a valid email address to reserve your spot.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      // POST to our serverless API route
      // TODO: connect to email service (e.g. Mailchimp, Resend, ConvertKit, or database) inside /api/waitlist for production
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          color: reservedProduct?.color || "Unspecified",
          size: reservedProduct?.size || "Unspecified",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit reservation.");
      }

      setStatus("success");
      setEmail("");
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error);
      setStatus("error");
      setErrorMessage(error.message || "A network error occurred. Please try again.");
    }
  };

  return (
    <section id="waitlist" className="relative py-32 md:py-48 bg-[#0D0D0D] text-white border-t border-[#D4AF37]/20 overflow-hidden">
      {/* Ambient Radial Highlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#D4AF37]/8 to-[#5E0E1A]/10 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#141414]/90 border border-[#D4AF37]/30 p-8 md:p-16 shadow-2xl relative"
        >
          {/* Corner decorative gold indicators */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#D4AF37]" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#D4AF37]" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#D4AF37]" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#D4AF37]" />

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0D0D0D] border border-[#D4AF37]/30 text-[10px] font-mono tracking-[0.3em] text-[#D4AF37] uppercase mb-8">
            <Sparkles className="w-3 h-3 text-[#D4AF37] animate-pulse" />
            <span>Drop 001 — Allocation Access</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light font-serif tracking-tight text-white mb-4">
            Be First to Know What&apos;s Next
          </h2>
          
          <p className="text-sm md:text-base text-[#CDBFA6]/80 font-light max-w-xl mx-auto leading-relaxed mb-8">
            Our productions are intentional and uncompromised. Enroll in our private allocation list to secure early notification before Drop 001 opens to the public.
          </p>

          {/* Reserved product indicator badge if forwarded from Product Showcase CTA */}
          {reservedProduct && (
            <div className="mb-8 p-3 bg-[#0D0D0D]/90 border border-white/15 max-w-sm mx-auto flex items-center justify-between text-xs font-mono text-left">
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37] block">Selected Allocation</span>
                <span className="text-white font-medium block mt-0.5">
                  {reservedProduct.color} • Size {reservedProduct.size}
                </span>
              </div>
              <button
                onClick={() => setReservedProduct(null)}
                className="text-[10px] text-white/40 hover:text-white uppercase underline font-sans"
              >
                Clear
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-10 bg-[#0D0D0D] border border-[#D4AF37] max-w-lg mx-auto p-6 text-center shadow-2xl"
              >
                <div className="w-12 h-12 bg-[#D4AF37]/10 border border-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4 text-[#D4AF37]">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif text-white mb-2">You Are On The List</h3>
                <p className="text-xs text-white/75 leading-relaxed font-light mb-6 font-mono">
                  Your reservation request has been secured in our records. You will receive an invitation prior to public launch.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="text-xs font-mono tracking-[0.2em] uppercase text-[#D4AF37] hover:underline"
                >
                  Register Another Address
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="max-w-lg mx-auto flex flex-col gap-4"
              >
                <div className="relative flex flex-col sm:flex-row items-stretch gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="enter.your@email.com"
                    disabled={status === "loading"}
                    className="flex-1 bg-[#0D0D0D] border border-white/20 px-5 py-4 text-sm text-white placeholder:text-white/30 font-mono focus:outline-none focus:border-[#D4AF37] transition-colors rounded-none"
                    required
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="px-8 py-4 bg-[#D4AF37] hover:bg-[#D4AF37]/90 disabled:opacity-50 text-[#0D0D0D] font-mono font-bold text-xs tracking-[0.25em] uppercase transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap shadow-lg"
                  >
                    <span>{status === "loading" ? "Securing..." : "Request Access"}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Error Message Display */}
                {status === "error" && (
                  <div className="flex items-center justify-center gap-2 text-red-400 text-xs mt-1 font-mono">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-mono text-white/40 tracking-wider">
                  <Lock className="w-3 h-3 text-[#D4AF37]" />
                  <span>Strictly zero spam. Private data architecture. Unsubscribe anytime.</span>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

        </motion.div>

      </div>
    </section>
  );
}
