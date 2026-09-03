"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ShoppingBag, ShieldCheck, Truck, PhoneCall, AlertCircle, MessageCircle, Trash2, Plus, Minus } from "lucide-react";
import { siteContent } from "@/config/siteContent";
import { useCart } from "@/components/CartProvider";
import Image from "next/image";

export default function CheckoutModal() {
  const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart, clearCart, totalQuantity, totalPriceNumeric } = useCart();

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
    if (isCartOpen) {
      fetch("/api/cms")
        .then((r) => r.json())
        .then((d) => { if (d.success && d.data) setLiveConfig(d.data); })
        .catch(() => {});
    }
  }, [isCartOpen]);

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
      clearCart();
    }
    setIsCartOpen(false);
  };

  const formattedTotalPrice = `PKR ${totalPriceNumeric.toLocaleString()}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      setStatus("error");
      setErrorMessage("Your cart is empty.");
      return;
    }

    if (!fullName.trim() || !phone.trim() || !city.trim() || !primaryAddress.trim()) {
      setStatus("error");
      setErrorMessage("Please complete your Full Name, Phone Number, City, and Primary Address.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    const orderId = `ROVE-${Math.floor(100000 + Math.random() * 900000)}`;
    const timestamp = new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" });

    const cartListText = cartItems.map((item, idx) => 
      `${idx + 1}. ${item.dropName} - ${item.colorName} - Size: ${item.sizeName} | QTY: ${item.quantity} | Total: PKR ${(item.priceNumeric * item.quantity).toLocaleString()}`
    ).join("\n");

    const orderSummaryText = `
🛍️ NEW ROVE CART ORDER: ${orderId}
===================================================================
Time: ${timestamp}
Total Items: ${totalQuantity}
Total Valuation: ${formattedTotalPrice} (COD)

🛒 CART ITEMS:
${cartListText}

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
👉 WhatsApp Confirmation Routing Available to: ${liveConfig.brand.whatsappNumber}
    `;

    try {
      const accessKey = liveConfig.brand.web3formsAccessKey || "b0a8ee37-de57-4314-acee-4c65d60c8580";
      
      // 1. Send DIRECTLY from client browser to Web3Forms
      let web3FormsSuccess = false;
      if (accessKey && accessKey.trim() !== "") {
        try {
          const web3Res = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
              access_key: accessKey.trim(),
              subject: `🚨 Order ${orderId} - ${totalQuantity} Items - ${formattedTotalPrice}`,
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

      // 2. Transmit to backend API for inventory decrement and backup email!
      // Here we pass the entire `cartItems` array so the backend can decrement stock for all items
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
          cartItems, // The backend will loop this array to decrement stock!
          formattedTotalPrice,
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

  const openWhatsAppVerification = () => {
    const text = `Hi ROVE Studio! I just placed an order on the website.\n\n*Order ID:* ${confirmedOrderId}\n*Total Items:* ${totalQuantity}\n*Total Price:* ${formattedTotalPrice} (COD)\n*Name:* ${fullName}\n*Phone:* ${phone}\n*City:* ${city}\n*Address:* ${primaryAddress} ${secondaryAddress ? `(${secondaryAddress})` : ""} ${landmark ? `[Near ${landmark}]` : ""}\n\nPlease confirm my Cash on Delivery allocation!`;
    
    const cleanNumber = (liveConfig.brand.whatsappNumber).replace(/[^0-9]/g, "").replace(/^0/, "92");
    const whatsappUrl = `https://wa.me/${cleanNumber || "923000000000"}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (!isCartOpen) return null;

  // Success Screen
  if (status === "success") {
    return (
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0D0D]/95 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="w-full max-w-lg bg-[#141414] border border-[#D4AF37]/30 p-12 relative text-center"
            >
              <button
                onClick={() => setIsCartOpen(false)}
                className="absolute top-6 right-6 text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 mx-auto rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-8">
                <Check className="w-8 h-8 text-[#D4AF37]" />
              </div>

              <h2 className="text-3xl font-serif mb-4 text-[#D4AF37]">WELCOME TO ROVE.</h2>
              <p className="text-white/80 font-light mb-8 leading-relaxed">
                Your purchase makes you part of something bigger. Become a Rover and join the exclusive ROVE community for free. Participate in polls, share your stories, and access private discussions.
              </p>

              <div className="space-y-4">
                <button 
                  onClick={() => {
                    setIsCartOpen(false);
                    window.location.href = "/register"; // Direct to register
                  }}
                  className="w-full py-4 bg-[#D4AF37] text-black font-mono text-xs uppercase tracking-[0.3em] font-bold shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all"
                >
                  Join the Community
                </button>
                <button
                  onClick={handleClose}
                  className="w-full py-4 border border-white/10 text-white/70 hover:bg-white/5 hover:text-white font-mono text-xs uppercase tracking-[0.3em] transition-all"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-[#000000]/85 backdrop-blur-md transition-opacity"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-[#141414] border border-[#D4AF37]/30 text-white shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col my-8"
        >
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#0D0D0D] flex-shrink-0">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] block">
                  Studio Allocation
                </span>
                <h3 className="text-lg font-serif tracking-wide text-white">
                  Your Cart & Checkout
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

          <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-8">
            
            {cartItems.length === 0 ? (
              <div className="text-center py-12 space-y-6">
                <ShoppingBag className="w-12 h-12 text-white/20 mx-auto" />
                <div>
                  <h4 className="text-xl font-serif text-white">Your Cart is Empty</h4>
                  <p className="text-sm text-white/50 font-mono mt-2">Explore our collections and add items to your cart.</p>
                </div>
                <button
                  onClick={handleClose}
                  className="px-8 py-3 bg-[#D4AF37] text-black font-mono font-bold text-xs uppercase tracking-widest mt-4 hover:bg-white transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              <>
                {/* CART ITEMS LIST */}
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-[#0D0D0D] border border-white/10 relative group">
                      <div className="relative w-20 h-24 bg-[#141414] flex-shrink-0">
                        <Image src={item.image} alt={item.colorName} fill className="object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start gap-4">
                            <h4 className="text-sm font-serif text-white line-clamp-1">{item.dropName}</h4>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-white/40 hover:text-red-400 p-1 transition-colors flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-[10px] text-white/60 font-mono uppercase mt-1">
                            {item.colorName} | Size: {item.sizeName}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border border-white/20 bg-[#141414]">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1.5 text-white/70 hover:text-white transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-xs font-mono font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.maxStock}
                              className="p-1.5 text-white/70 hover:text-[#D4AF37] disabled:text-white/20 disabled:cursor-not-allowed transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="text-xs font-mono font-bold text-[#D4AF37]">
                            PKR {(item.priceNumeric * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                    <span className="text-xs font-mono uppercase text-white/60 tracking-widest">Total Valuation</span>
                    <span className="text-xl md:text-2xl font-mono font-bold text-[#D4AF37]">{formattedTotalPrice}</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 pt-6 border-t border-white/10">
                  <h4 className="text-xs font-mono tracking-[0.2em] uppercase text-[#D4AF37] mb-4">
                    Shipping Details
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
                        required
                        disabled={status === "submitting"}
                        className="w-full bg-[#0D0D0D] border border-white/20 px-4 py-3 text-sm text-white font-mono focus:border-[#D4AF37]"
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
                        required
                        disabled={status === "submitting"}
                        className="w-full bg-[#0D0D0D] border border-white/20 px-4 py-3 text-sm text-white font-mono focus:border-[#D4AF37]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-white/80 mb-2">
                        Email Address <span className="text-white/40">(Optional)</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={status === "submitting"}
                        className="w-full bg-[#0D0D0D] border border-white/20 px-4 py-3 text-sm text-white font-mono focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-white/80 mb-2">
                          City / Province <span className="text-[#D4AF37]">*</span>
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          required
                          disabled={status === "submitting"}
                          className="w-full bg-[#0D0D0D] border border-white/20 px-4 py-3 text-sm text-white font-mono focus:border-[#D4AF37]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-white/80 mb-2">
                          Nearest Landmark <span className="text-white/40">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                          disabled={status === "submitting"}
                          className="w-full bg-[#0D0D0D] border border-white/20 px-4 py-3 text-sm text-white font-mono focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-white/80 mb-2">
                        Primary Address (House #, Street) <span className="text-[#D4AF37]">*</span>
                      </label>
                      <input
                        type="text"
                        value={primaryAddress}
                        onChange={(e) => setPrimaryAddress(e.target.value)}
                        required
                        disabled={status === "submitting"}
                        className="w-full bg-[#0D0D0D] border border-white/20 px-4 py-3 text-sm text-white font-mono focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-white/80 mb-2">
                        2nd Address / Apartment <span className="text-white/40">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={secondaryAddress}
                        onChange={(e) => setSecondaryAddress(e.target.value)}
                        disabled={status === "submitting"}
                        className="w-full bg-[#0D0D0D] border border-white/20 px-4 py-3 text-sm text-white font-mono focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-white/80 mb-2">
                        Special Instructions <span className="text-white/40">(Optional)</span>
                      </label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        disabled={status === "submitting"}
                        className="w-full bg-[#0D0D0D] border border-white/20 px-4 py-3 text-sm text-white font-mono focus:border-[#D4AF37] resize-none"
                      />
                    </div>
                  </div>

                  {status === "error" && (
                    <div className="p-3 bg-red-950/80 border border-red-500/50 flex items-center gap-3 text-red-300 text-xs font-mono">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-white/70 text-xs font-sans font-light">
                      <ShieldCheck className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                      <span>Verified Cash on Delivery</span>
                    </div>
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="w-full sm:w-auto px-10 py-4 bg-[#D4AF37] hover:bg-[#D4AF37]/90 disabled:opacity-50 text-[#0D0D0D] font-mono font-bold text-xs tracking-[0.25em] uppercase transition-all duration-300 flex items-center justify-center shadow-xl"
                    >
                      {status === "submitting" ? "Transmitting..." : `Confirm Order (${formattedTotalPrice})`}
                    </button>
                  </div>
                </form>
              </>
            )}

          </div>

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
