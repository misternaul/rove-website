"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Send, Sparkles, AlertCircle, Lock } from "lucide-react";
import { siteContent } from "@/config/siteContent";

export default function WaitlistSection() {
  const [email, setEmail] = useState("");
  const primaryDrop = siteContent.drops[0];
  const defaultColor = primaryDrop?.colors[0]?.name || "Jet Black Obsidian";
  const defaultSize = primaryDrop?.colors[0]?.sizes?.[0]?.id || "M";
  const defaultPrice = primaryDrop?.colors[0]?.priceFormatted || "PKR 2,299";

  const [reservedProduct, setReservedProduct] = useState<{ color: string; size: string; price?: string; drop?: string } | null>({
    color: defaultColor,
    size: defaultSize,
    price: defaultPrice,
    drop: primaryDrop?.name || "Drop 001",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [liveConfig, setLiveConfig] = useState(siteContent);

  useEffect(() => {
    fetch("/api/cms")
      .then((r) => r.json())
      .then((d) => { if (d.success && d.data) setLiveConfig(d.data); })
      .catch(() => {});

    const handleProductSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{ color: string; size: string; price?: string; drop?: string }>;
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
      setErrorMessage("Please input a valid email address to reserve your allocation spot.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const accessKey = liveConfig.brand.web3formsAccessKey || "b0a8ee37-de57-4314-acee-4c65d60c8580";

      // 1. Send DIRECTLY from client-side browser to Web3Forms to avoid Cloudflare bot blocking!
      let web3Success = false;
      if (accessKey && accessKey.trim() !== "") {
        try {
          const wRes = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
              access_key: accessKey.trim(),
              subject: `🌟 Rove Waitlist Reservation: ${email.trim()} (${reservedProduct?.color || "Item"}, Size ${reservedProduct?.size || "M"})`,
              from_name: "ROVE Studio Allocation Hub",
              message: `New studio priority waitlist registration!\n\nClient Email: ${email.trim()}\nTarget Release: ${reservedProduct?.drop || "Drop 001"}\nColorway: ${reservedProduct?.color || "Unspecified"}\nSize Grade: ${reservedProduct?.size || "Unspecified"}\nValuation: ${reservedProduct?.price || defaultPrice}\nTimestamp: ${new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" })}`,
            }),
          });
          const wData = await wRes.json();
          if (wData && wData.success) web3Success = true;
        } catch (clientErr) {
          console.warn("Client Web3Forms waitlist notice warning:", clientErr);
        }
      }

      // 2. Transmit to backend API for internal logging
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          drop: reservedProduct?.drop || "Unspecified Release",
          color: reservedProduct?.color || "Unspecified",
          size: reservedProduct?.size || "Unspecified",
          price: reservedProduct?.price || defaultPrice,
        }),
      });

      const data = await response.json();

      if (!response.ok && !web3Success) {
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
    <section id="waitlist" className="relative py-32 md:py-48 bg-background text-foreground border-t border-[#D4AF37]/20 overflow-hidden">
      {/* Ambient Radial Highlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#D4AF37]/8 to-[#5E0E1A]/10 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px", amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="bg-matte/90 border border-[#D4AF37]/30 p-8 md:p-16 shadow-2xl relative gpu-layer"
        >
          {/* Corner decorative gold indicators */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#D4AF37]" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#D4AF37]" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#D4AF37]" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#D4AF37]" />

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-background border border-[#D4AF37]/30 text-[10px] font-mono tracking-[0.3em] text-[#D4AF37] uppercase mb-8">
            <Sparkles className="w-3 h-3 text-[#D4AF37] animate-pulse" />
            <span>{siteContent.waitlist.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light font-serif tracking-tight text-foreground mb-4">
            {siteContent.waitlist.title}
          </h2>
          
          <p className="text-sm md:text-base text-[#CDBFA6]/80 font-light max-w-xl mx-auto leading-relaxed mb-8 font-sans">
            {siteContent.waitlist.description}
          </p>

          {/* Reserved product indicator badge if forwarded from Product Showcase CTA */}
          {reservedProduct && (
            <div className="mb-8 p-4 bg-background/90 border border-foreground/15 max-w-sm mx-auto flex items-center justify-between text-xs font-mono text-left">
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37] block">{reservedProduct.drop || "Studio Release"}</span>
                <span className="text-foreground font-medium block mt-0.5">
                  {reservedProduct.color} • Size {reservedProduct.size}
                </span>
                <span className="text-[#D4AF37] text-[11px] font-bold block mt-0.5">
                  Valuation: {reservedProduct.price || defaultPrice}
                </span>
              </div>
              <button
                onClick={() => setReservedProduct(null)}
                className="text-[10px] text-foreground/40 hover:text-foreground uppercase underline font-sans"
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
                className="py-10 bg-background border border-[#D4AF37] max-w-lg mx-auto p-6 text-center shadow-2xl"
              >
                <div className="w-12 h-12 bg-[#D4AF37]/10 border border-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4 text-[#D4AF37]">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif text-foreground mb-2">You Are On The List</h3>
                <p className="text-xs text-foreground/75 leading-relaxed font-light mb-6 font-mono">
                  Your allocation priority has been logged in our studio records. You will receive private notice prior to public commercial release.
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
                    className="flex-1 bg-background border border-foreground/20 px-5 py-4 text-sm text-foreground placeholder:text-foreground/30 font-mono focus:outline-none focus:border-[#D4AF37] transition-colors rounded-none"
                    required
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="px-8 py-4 bg-[#D4AF37] hover:bg-[#D4AF37]/90 disabled:opacity-50 text-[#0D0D0D] font-mono font-bold text-xs tracking-[0.25em] uppercase transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap shadow-lg"
                  >
                    <span>{status === "loading" ? "Securing..." : siteContent.waitlist.buttonText}</span>
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

                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-mono text-foreground/40 tracking-wider">
                  <Lock className="w-3 h-3 text-[#D4AF37]" />
                  <span>{siteContent.waitlist.privacyNote}</span>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

        </motion.div>

      </div>
    </section>
  );
}
