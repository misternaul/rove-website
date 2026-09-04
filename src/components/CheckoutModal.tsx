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
      `${idx + 1}. ${item.dropName} - ${item.colorName} - Size: ${item.sizeName} | QTY: ${item.quantity} | Total: PKR ${((item.priceNumeric || parseInt((item.priceFormatted || "").replace(/\D/g, ""), 10) || 0) * item.quantity).toLocaleString()}`
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto" data-lenis-prevent="true">
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
          className="relative w-full max-w-2xl bg-matte border border-[#D4AF37]/30 text-foreground shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col my-8"
        >
          <div className="p-6 border-b border-foreground/10 flex items-center justify-between bg-background flex-shrink-0">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] block">
                  Studio Allocation
                </span>
                <h3 className="text-lg font-serif tracking-wide text-foreground">
                  Your Cart & Checkout
                </h3>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 border border-foreground/20 hover:border-[#D4AF37] text-foreground/70 hover:text-foreground flex items-center justify-center transition-colors bg-matte"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

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
                  <h4 className="text-2xl md:text-3xl font-serif text-foreground mt-2">
                    Thank You, {fullName}
                  </h4>
                  <p className="text-xs text-foreground/70 font-mono mt-2">
                    Reference ID: <span className="text-[#D4AF37] font-bold">{confirmedOrderId}</span>
                  </p>
                </div>
                <div className="p-5 bg-background border border-foreground/10 max-w-md mx-auto text-left font-mono text-xs space-y-3 shadow-inner">
                  <div className="flex justify-between pb-2 border-b border-foreground/10">
                    <span className="text-foreground/60">Total Items:</span>
                    <span className="text-foreground font-semibold">{totalQuantity}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-foreground/10">
                    <span className="text-foreground/60">Total Valuation:</span>
                    <span className="text-[#D4AF37] font-bold text-sm">{formattedTotalPrice} (COD)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Shipping To:</span>
                    <span className="text-foreground">{city}</span>
                  </div>
                </div>
                <div className="p-4 bg-[#25D366]/10 border border-[#25D366]/40 max-w-md mx-auto text-left space-y-2">
                  <strong className="text-xs font-mono text-[#25D366] uppercase tracking-wider block flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 fill-[#25D366] text-black" /> Step 2: Instant WhatsApp Confirmation
                  </strong>
                  <p className="text-xs text-foreground/80 leading-relaxed font-sans font-light">
                    Click below to open WhatsApp with our fulfillment team. Your order details will be automatically attached for fastest dispatch!
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
                    className="w-full sm:w-auto px-6 py-4 bg-background border border-foreground/20 hover:border-[#D4AF37] text-foreground font-mono text-xs tracking-[0.2em] uppercase transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-12 space-y-6">
                <ShoppingBag className="w-12 h-12 text-foreground/20 mx-auto" />
                <div>
                  <h4 className="text-xl font-serif text-foreground">Your Cart is Empty</h4>
                  <p className="text-sm text-foreground/50 font-mono mt-2">Explore our collections and add items to your cart.</p>
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
                    <div key={item.id} className="flex gap-4 p-4 bg-background border border-foreground/10 relative group">
                      <div className="relative w-20 h-24 bg-matte flex-shrink-0">
                        <Image src={item.image} alt={item.colorName} fill className="object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start gap-4">
                            <h4 className="text-sm font-serif text-foreground line-clamp-1">{item.dropName}</h4>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-foreground/40 hover:text-red-400 p-1 transition-colors flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-[10px] text-foreground/60 font-mono uppercase mt-1">
                            {item.colorName} | Size: {item.sizeName}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border border-foreground/20 bg-matte">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1.5 text-foreground/70 hover:text-foreground transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-xs font-mono font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.maxStock}
                              className="p-1.5 text-foreground/70 hover:text-[#D4AF37] disabled:text-foreground/20 disabled:cursor-not-allowed transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="text-xs font-mono font-bold text-[#D4AF37]">
                            PKR {((item.priceNumeric || parseInt((item.priceFormatted || "").replace(/\D/g, ""), 10) || 0) * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-foreground/10 flex justify-between items-end">
                    <span className="text-xs font-mono uppercase text-foreground/60 tracking-widest">Total Valuation</span>
                    <span className="text-xl md:text-2xl font-mono font-bold text-[#D4AF37]">{formattedTotalPrice}</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 pt-6 border-t border-foreground/10">
                  <h4 className="text-xs font-mono tracking-[0.2em] uppercase text-[#D4AF37] mb-4">
                    Shipping Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-foreground/80 mb-2">
                        Full Name <span className="text-[#D4AF37]">*</span>
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        disabled={status === "submitting"}
                        className="w-full bg-background border border-foreground/20 px-4 py-3 text-sm text-foreground font-mono focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-foreground/80 mb-2">
                        Phone / WhatsApp <span className="text-[#D4AF37]">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        disabled={status === "submitting"}
                        className="w-full bg-background border border-foreground/20 px-4 py-3 text-sm text-foreground font-mono focus:border-[#D4AF37]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-foreground/80 mb-2">
                        Email Address <span className="text-foreground/40">(Optional)</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={status === "submitting"}
                        className="w-full bg-background border border-foreground/20 px-4 py-3 text-sm text-foreground font-mono focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-foreground/80 mb-2">
                          City / Province <span className="text-[#D4AF37]">*</span>
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          required
                          disabled={status === "submitting"}
                          className="w-full bg-background border border-foreground/20 px-4 py-3 text-sm text-foreground font-mono focus:border-[#D4AF37]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-foreground/80 mb-2">
                          Nearest Landmark <span className="text-foreground/40">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                          disabled={status === "submitting"}
                          className="w-full bg-background border border-foreground/20 px-4 py-3 text-sm text-foreground font-mono focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-foreground/80 mb-2">
                        Primary Address (House #, Street) <span className="text-[#D4AF37]">*</span>
                      </label>
                      <input
                        type="text"
                        value={primaryAddress}
                        onChange={(e) => setPrimaryAddress(e.target.value)}
                        required
                        disabled={status === "submitting"}
                        className="w-full bg-background border border-foreground/20 px-4 py-3 text-sm text-foreground font-mono focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-foreground/80 mb-2">
                        2nd Address / Apartment <span className="text-foreground/40">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={secondaryAddress}
                        onChange={(e) => setSecondaryAddress(e.target.value)}
                        disabled={status === "submitting"}
                        className="w-full bg-background border border-foreground/20 px-4 py-3 text-sm text-foreground font-mono focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-foreground/80 mb-2">
                        Special Instructions <span className="text-foreground/40">(Optional)</span>
                      </label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        disabled={status === "submitting"}
                        className="w-full bg-background border border-foreground/20 px-4 py-3 text-sm text-foreground font-mono focus:border-[#D4AF37] resize-none"
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
                    <div className="flex items-center gap-3 text-foreground/70 text-xs font-sans font-light">
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

          <div className="px-6 py-4 bg-background border-t border-foreground/10 flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono text-foreground/40 uppercase">
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
