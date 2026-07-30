"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ShoppingBag, ShieldCheck, Truck, PhoneCall, AlertCircle, MessageCircle } from "lucide-react";
import { siteContent } from "@/config/siteContent";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  selectedColor: string;
  selectedSize: string;
  priceFormatted: string;
  whatsappNumber: string;
}

export default function OrderModal({
  isOpen,
  onClose,
  productName,
  selectedColor,
  selectedSize,
  priceFormatted,
  whatsappNumber,
}: OrderModalProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [primaryAddress, setPrimaryAddress] = useState("");
  const [secondaryAddress, setSecondaryAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [notes, setNotes] = useState("");

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmedOrderId, setConfirmedOrderId] = useState("");
  const [liveConfig, setLiveConfig] = useState(siteContent);

  useEffect(() => {
    if (isOpen) {
      fetch("/api/cms")
        .then((r) => r.json())
        .then((d) => { if (d.success && d.data) setLiveConfig(d.data); })
        .catch(() => {});
    }
  }, [isOpen]);

  const resetForm = () => {
    setFullName("");
    setPhone("");
    setEmail("");
    setCity("");
    setPrimaryAddress("");
    setSecondaryAddress("");
    setLandmark("");
    setNotes("");
    setStatus("idle");
    setErrorMessage("");
    setConfirmedOrderId("");
  };

  const handleClose = () => {
    if (status === "success") {
      resetForm();
    }
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !city.trim() || !primaryAddress.trim()) {
      setStatus("error");
      setErrorMessage("Please complete your Full Name, Phone Number, City, and Primary Address.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    const orderId = `ROVE-${Math.floor(100000 + Math.random() * 900000)}`;
    const timestamp = new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" });

    const orderSummaryText = `
🛍️ NEW ROVE ORDER RECEIVED: ${orderId} (${productName})
===================================================================
Time: ${timestamp}
Item: ${productName}
Colorway: ${selectedColor}
Size Grade & Specs: ${selectedSize}
Total Valuation: ${priceFormatted} (COD / Direct Fulfillment)

📋 CUSTOMER SHIPPING INFORMATION
-------------------------------------------------------------------
Full Name: ${fullName.trim()}
Phone / WhatsApp: ${phone.trim()}
Customer Email: ${email.trim() || "Not provided"}
City & Province: ${city.trim()}
Primary Address: ${primaryAddress.trim()}
2nd Address / Sector: ${secondaryAddress.trim() || "N/A"}
Nearest Landmark: ${landmark.trim() || "N/A"}

📝 Special Instructions / Notes:
${notes.trim() || "None"}

===================================================================
👉 WhatsApp Confirmation Routing Available to: ${liveConfig.brand.whatsappNumber || whatsappNumber}
    `;

    try {
      const accessKey = liveConfig.brand.web3formsAccessKey || "b0a8ee37-de57-4314-acee-4c65d60c8580";
      
      // 1. Send DIRECTLY from client browser to Web3Forms to bypass Cloudflare bot detection!
      let web3FormsSuccess = false;
      if (accessKey && accessKey.trim() !== "") {
        try {
          const web3Res = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
              access_key: accessKey.trim(),
              subject: `🚨 Order ${orderId} - ${selectedColor} (${selectedSize.split(" ")[0]}) - ${priceFormatted}`,
              from_name: "ROVE Studio Order Hub",
              message: orderSummaryText,
            }),
          });
          const web3Data = await web3Res.json();
          if (web3Data.success) {
            web3FormsSuccess = true;
          }
        } catch (clientErr) {
          console.warn("Client Web3Forms delivery warning:", clientErr);
        }
      }

      // 2. Transmit to backend API for internal logging and backup Resend delivery
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          city: city.trim(),
          primaryAddress: primaryAddress.trim(),
          secondaryAddress: secondaryAddress.trim(),
          landmark: landmark.trim(),
          notes: notes.trim(),
          productName,
          selectedColor,
          selectedSize,
          priceFormatted,
          customWeb3FormsKey: accessKey,
        }),
      });

      const data = await res.json();

      if (!res.ok && !web3FormsSuccess) {
        throw new Error(data.error || "Failed to submit your order.");
      }

      setConfirmedOrderId(data.orderId || orderId);
      setStatus("success");
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error);
      setStatus("error");
      setErrorMessage(error.message || "A network error occurred. Please try again.");
    }
  };

  // Construct automated WhatsApp message for instant verification
  const openWhatsAppVerification = () => {
    const text = `Hi ROVE Studio! I just placed an order on the website.\n\n*Order ID:* ${confirmedOrderId}\n*Item:* ${productName}\n*Color:* ${selectedColor}\n*Size:* ${selectedSize}\n*Price:* ${priceFormatted} (COD)\n*Name:* ${fullName}\n*Phone:* ${phone}\n*City:* ${city}\n*Address:* ${primaryAddress} ${secondaryAddress ? `(${secondaryAddress})` : ""} ${landmark ? `[Near ${landmark}]` : ""}\n\nPlease confirm my Cash on Delivery allocation!`;
    
    const cleanNumber = (liveConfig.brand.whatsappNumber || whatsappNumber).replace(/[^0-9]/g, "").replace(/^0/, "92");
    const whatsappUrl = `https://wa.me/${cleanNumber || "923000000000"}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
        {/* Backdrop Blur & Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-[#000000]/85 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-[#141414] border border-[#D4AF37]/30 text-white shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col my-8"
        >
          {/* Header Bar */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#0D0D0D] flex-shrink-0">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] block">
                  Studio Allocation
                </span>
                <h3 className="text-lg font-serif tracking-wide text-white">
                  Direct Order Placement
                </h3>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 border border-white/20 hover:border-[#D4AF37] text-white/70 hover:text-white flex items-center justify-center transition-colors bg-[#141414]"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body Container */}
          <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-8">
            
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-6 space-y-6"
              >
                <div className="w-16 h-16 bg-[#25D366]/15 border border-[#25D366] rounded-full flex items-center justify-center mx-auto text-[#25D366] shadow-[0_0_25px_rgba(37,211,102,0.25)]">
                  <Check className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37]">
                    Order Recorded Successfully
                  </span>
                  <h4 className="text-2xl md:text-3xl font-serif text-white mt-2">
                    Thank You, {fullName}
                  </h4>
                  <p className="text-xs text-white/70 font-mono mt-2">
                    Reference ID: <span className="text-[#D4AF37] font-bold">{confirmedOrderId}</span>
                  </p>
                </div>

                <div className="p-5 bg-[#0D0D0D] border border-white/10 max-w-md mx-auto text-left font-mono text-xs space-y-3 shadow-inner">
                  <div className="flex justify-between pb-2 border-b border-white/10">
                    <span className="text-white/60">Item:</span>
                    <span className="text-white font-semibold">{productName}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-white/10">
                    <span className="text-white/60">Colorway:</span>
                    <span className="text-[#D4AF37]">{selectedColor}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-white/10">
                    <span className="text-white/60">Size Grade:</span>
                    <span className="text-white/90">{selectedSize}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-white/10">
                    <span className="text-white/60">Total Valuation:</span>
                    <span className="text-[#D4AF37] font-bold text-sm">{priceFormatted} (COD)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Shipping To:</span>
                    <span className="text-white">{city}</span>
                  </div>
                </div>

                <div className="p-4 bg-[#25D366]/10 border border-[#25D366]/40 max-w-md mx-auto text-left space-y-2">
                  <strong className="text-xs font-mono text-[#25D366] uppercase tracking-wider block flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 fill-[#25D366] text-black" /> Step 2: Instant WhatsApp Confirmation
                  </strong>
                  <p className="text-xs text-white/80 leading-relaxed font-sans font-light">
                    Click below to open WhatsApp with our fulfillment team ({liveConfig.brand.whatsappNumber || whatsappNumber}). Your order details will be automatically attached for fastest dispatch!
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={openWhatsAppVerification}
                    className="w-full sm:w-auto px-8 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-[#000000] font-mono font-bold text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-2 shadow-2xl transform hover:scale-105 transition-all"
                  >
                    <MessageCircle className="w-4 h-4 fill-black" />
                    <span>Send WhatsApp Confirmation</span>
                  </button>
                  <button
                    onClick={handleClose}
                    className="w-full sm:w-auto px-6 py-4 bg-[#0D0D0D] border border-white/20 hover:border-[#D4AF37] text-white font-mono text-xs tracking-[0.2em] uppercase transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="p-4 bg-[#0D0D0D] border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-[#D4AF37] uppercase tracking-[0.2em] block mb-1">Selected Allocation</span>
                    <span className="text-base text-white font-serif tracking-wide block">
                      {productName}
                    </span>
                    <span className="text-white/80 block mt-1 font-semibold">
                      {selectedColor} &nbsp;|&nbsp; {selectedSize.split("(")[0]}
                    </span>
                  </div>
                  <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-white/10">
                    <span className="text-[10px] text-white/50 uppercase block">Valuation</span>
                    <span className="text-xl text-[#D4AF37] font-bold tracking-wider block my-0.5">
                      {priceFormatted}
                    </span>
                    <span className="text-[10px] text-[#25D366] font-sans font-medium block">
                      ✔ Complimentary Express COD
                    </span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-2">
                  <h4 className="text-xs font-mono tracking-[0.2em] uppercase text-[#D4AF37] mb-4">
                    1. Customer Contact & Details
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-white/80 mb-2">
                        Full Name <span className="text-[#D4AF37]">*</span>
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Haseeb Naul"
                        required
                        disabled={status === "submitting"}
                        className="w-full bg-[#0D0D0D] border border-white/20 px-4 py-3 text-sm text-white placeholder:text-white/30 font-mono focus:outline-none focus:border-[#D4AF37] transition-colors rounded-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-white/80 mb-2">
                        Phone / WhatsApp <span className="text-[#D4AF37]">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 0300 1234567"
                        required
                        disabled={status === "submitting"}
                        className="w-full bg-[#0D0D0D] border border-white/20 px-4 py-3 text-sm text-white placeholder:text-white/30 font-mono focus:outline-none focus:border-[#D4AF37] transition-colors rounded-none"
                      />
                      <span className="text-[10px] text-white/40 font-mono block mt-1">
                        For courier rider & WhatsApp verification
                      </span>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-white/80 mb-2">
                        Email Address <span className="text-white/40 font-normal">(Optional for receipt)</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        disabled={status === "submitting"}
                        className="w-full bg-[#0D0D0D] border border-white/20 px-4 py-3 text-sm text-white placeholder:text-white/30 font-mono focus:outline-none focus:border-[#D4AF37] transition-colors rounded-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <h4 className="text-xs font-mono tracking-[0.2em] uppercase text-[#D4AF37] mb-4">
                    2. Pakistan Shipping Address
                  </h4>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-white/80 mb-2">
                          City / Province <span className="text-[#D4AF37]">*</span>
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Lahore, Punjab"
                          required
                          disabled={status === "submitting"}
                          className="w-full bg-[#0D0D0D] border border-white/20 px-4 py-3 text-sm text-white placeholder:text-white/30 font-mono focus:outline-none focus:border-[#D4AF37] transition-colors rounded-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-white/80 mb-2">
                          Nearest Landmark <span className="text-white/40">(Recommended)</span>
                        </label>
                        <input
                          type="text"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                          placeholder="e.g. Near Al-Fatah Mall, Phase 5"
                          disabled={status === "submitting"}
                          className="w-full bg-[#0D0D0D] border border-white/20 px-4 py-3 text-sm text-white placeholder:text-white/30 font-mono focus:outline-none focus:border-[#D4AF37] transition-colors rounded-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-white/80 mb-2">
                        Primary Address (House #, Street, Block/Phase) <span className="text-[#D4AF37]">*</span>
                      </label>
                      <input
                        type="text"
                        value={primaryAddress}
                        onChange={(e) => setPrimaryAddress(e.target.value)}
                        placeholder="e.g. House 42, Street 15, Sector Y, DHA"
                        required
                        disabled={status === "submitting"}
                        className="w-full bg-[#0D0D0D] border border-white/20 px-4 py-3 text-sm text-white placeholder:text-white/30 font-mono focus:outline-none focus:border-[#D4AF37] transition-colors rounded-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-white/80 mb-2">
                        2nd Address / Apartment / Suite <span className="text-white/40">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={secondaryAddress}
                        onChange={(e) => setSecondaryAddress(e.target.value)}
                        placeholder="e.g. Apartment 3B or Gate 2 Entrance"
                        disabled={status === "submitting"}
                        className="w-full bg-[#0D0D0D] border border-white/20 px-4 py-3 text-sm text-white placeholder:text-white/30 font-mono focus:outline-none focus:border-[#D4AF37] transition-colors rounded-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-white/80 mb-2">
                        Special Instructions / Fitting Notes <span className="text-white/40">(Optional)</span>
                      </label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Please deliver after 4 PM, or note about athletic fit."
                        disabled={status === "submitting"}
                        className="w-full bg-[#0D0D0D] border border-white/20 px-4 py-3 text-sm text-white placeholder:text-white/30 font-mono focus:outline-none focus:border-[#D4AF37] transition-colors rounded-none resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Error Banner */}
                {status === "error" && (
                  <div className="p-3 bg-red-950/80 border border-red-500/50 flex items-center gap-3 text-red-300 text-xs font-mono">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit Action Bar */}
                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-white/70 text-xs font-sans font-light">
                    <ShieldCheck className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                    <span>Verified Cash on Delivery & Direct Fulfillment</span>
                  </div>

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full sm:w-auto px-10 py-4 bg-[#D4AF37] hover:bg-[#D4AF37]/90 disabled:opacity-50 text-[#0D0D0D] font-mono font-bold text-xs tracking-[0.25em] uppercase transition-all duration-300 flex items-center justify-center gap-3 whitespace-nowrap shadow-xl"
                  >
                    <span>{status === "submitting" ? "Transmitting..." : `Confirm Order (${priceFormatted})`}</span>
                  </button>
                </div>
              </form>
            )}

          </div>

          {/* Footer Security Badge */}
          <div className="px-6 py-4 bg-[#0D0D0D] border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono text-white/40 uppercase">
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Complimentary Courier Across Pakistan</span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Direct Studio WhatsApp Verification</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
