"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Save,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Package,
  Settings,
  HelpCircle,
  Smartphone,
  ExternalLink,
  Copy,
  Layers,
  Ruler,
  Image as ImageIcon,
  Send,
  Mail,
  ShieldAlert,
} from "lucide-react";
import { SiteConfig, siteContent, ColorOption, SizeOption } from "@/config/siteContent";

export default function StudioAdminPage() {
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState("");

  const [config, setConfig] = useState<SiteConfig>(siteContent);
  const [activeTab, setActiveTab] = useState<"drops" | "brand" | "storage">("drops");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [selectedDropIndex, setSelectedDropIndex] = useState(0);
  const [copiedJson, setCopiedJson] = useState(false);

  // Email Diagnostic State
  const [testEmailStatus, setTestEmailStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [testEmailMessage, setTestEmailMessage] = useState("");

  useEffect(() => {
    fetch("/api/cms")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.data) {
          setConfig(data.data);
        }
      })
      .catch((err) => console.warn("Could not load dynamic data from API, using default codex:", err));
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() !== "rovepresence0842" && pin.trim() !== "rove2026") {
      setPinError("Invalid Security PIN.");
      return;
    }
    setIsAuthenticated(true);
    setPinError("");
  };

  const handleSaveToCloud = async () => {
    setStatus("saving");
    setStatusMessage("");
    try {
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update", updatedData: config, adminSecret: "rovepresence0842" }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to commit updates to Vercel storage.");
      }
      setStatus("success");
      setStatusMessage(data.message || "✅ Successfully deployed updates to your live storefront!");
      setTimeout(() => setStatus("idle"), 6000);
    } catch (err: unknown) {
      const error = err as Error;
      setStatus("error");
      setStatusMessage(error.message || "Upstash Redis database not linked in Vercel yet. Check instructions in Tab 3 below!");
    }
  };

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 3000);
  };

  const runEmailDiagnosticTest = async () => {
    setTestEmailStatus("testing");
    setTestEmailMessage("Transmitting test dispatch directly from your browser to bypass server bot protection...");
    
    try {
      const keyToUse = config.brand.web3formsAccessKey || "b0a8ee37-de57-4314-acee-4c65d60c8580";

      // Send DIRECTLY from client browser to avoid Cloudflare bot blocking on backend servers!
      const web3Res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: keyToUse.trim(),
          subject: "🎉 ROVE STUDIO - Live Test Email Verified Successfully!",
          from_name: "ROVE Studio Orders",
          message: `Congratulations! Your Web3Forms Access Key (${keyToUse}) is fully authenticated and functional.\n\nAll customer orders and waitlist registrations will now deliver directly to rovepresence@gmail.com without ever relying on Resend or spam filters!\n\nTimestamp: ${new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" })}`,
        }),
      });

      const web3Data = await web3Res.json();
      
      if (!web3Res.ok || !web3Data.success) {
        // If client-side failed, attempt fallback to server endpoint
        const res = await fetch("/api/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            isTestEmail: true,
            customWeb3FormsKey: keyToUse
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setTestEmailStatus("error");
          setTestEmailMessage(data.error || web3Data?.message || "Failed to deliver email. Read error details.");
          return;
        }
      }

      setTestEmailStatus("success");
      setTestEmailMessage(`✅ SUCCESS! Your test order email was instantly delivered directly to rovepresence@gmail.com! Please check your inbox right now (IMPORTANT: Also check your Spam, Junk, or Promotions tab!)`);
    } catch (err: unknown) {
      const e = err as Error;
      setTestEmailStatus("error");
      setTestEmailMessage(e.message || "Network error while connecting to test endpoint.");
    }
  };

  // --- DROP OPERATIONS ---
  const addNewDrop = () => {
    const newDrop = {
      id: `drop-00${config.drops.length + 1}`,
      badge: `Release 00${config.drops.length + 1} — Seasonal Edition`,
      name: `New Product Release 00${config.drops.length + 1}`,
      shortDescription: "Enter architectural notes, fabric GSM, and quality hallmarks for this product release.",
      shippingNote: "Complimentary Express Courier Nationwide in Pakistan",
      colors: [
        {
          id: `item-1-${Date.now()}`,
          name: "Primary Color / Item 1",
          hex: "#0D0D0D",
          priceFormatted: "PKR 2,499",
          priceNumeric: 2499,
          frontImage: "/images/polo-black-front.jpg",
          backImage: "/images/polo-black-back.jpg",
          caption: "Primary colorway description.",
          sizes: [
            { id: "M", name: "Medium", details: 'Chest: 20" | Length: 27.5" | Shoulder: 17.5"' },
            { id: "L", name: "Large", details: 'Chest: 21" | Length: 28.5" | Shoulder: 18"' },
          ],
        },
      ],
      orderButtonText: "Place Direct Order",
      secondaryActionText: "Reserve Allocation Spot",
      guaranteeText: "Verified Cash on Delivery (COD) & Direct Studio Fulfillment across Pakistan.",
      accordions: config.drops[0]?.accordions || [],
    };

    setConfig({ ...config, drops: [...config.drops, newDrop] });
    setSelectedDropIndex(config.drops.length);
  };

  const removeDrop = (index: number) => {
    if (config.drops.length <= 1) {
      alert("You must keep at least one active release in your catalog.");
      return;
    }
    const updated = config.drops.filter((_, i) => i !== index);
    setConfig({ ...config, drops: updated });
    setSelectedDropIndex(Math.max(0, index - 1));
  };

  // --- PRODUCT / ITEM (COLORWAY) OPERATIONS ---
  const addNewItemToCurrentDrop = () => {
    const copy = [...config.drops];
    const current = copy[selectedDropIndex];
    const newItem: ColorOption = {
      id: `item-${Date.now()}`,
      name: `New Item Option ${current.colors.length + 1}`,
      hex: "#787878",
      priceFormatted: "PKR 2,499",
      priceNumeric: 2499,
      frontImage: "/images/polo-sand-front.jpg",
      backImage: "/images/polo-sand-back.jpg",
      caption: "Describe this variation's tone and texture.",
      sizes: [
        { id: "M", name: "Medium", details: 'Chest: 20" | Length: 27.5" | Shoulder: 17.5"' },
        { id: "L", name: "Large", details: 'Chest: 21" | Length: 28.5" | Shoulder: 18"' },
      ],
    };
    current.colors.push(newItem);
    setConfig({ ...config, drops: copy });
  };

  const removeItemFromCurrentDrop = (itemIndex: number) => {
    const copy = [...config.drops];
    if (copy[selectedDropIndex].colors.length <= 1) {
      alert("A product drop must contain at least 1 item or colorway.");
      return;
    }
    copy[selectedDropIndex].colors.splice(itemIndex, 1);
    setConfig({ ...config, drops: copy });
  };

  // --- SIZE OPERATIONS PER INDIVIDUAL ITEM ---
  const addSizeToItem = (itemIndex: number) => {
    const copy = [...config.drops];
    const targetItem = copy[selectedDropIndex].colors[itemIndex];
    const newSize: SizeOption = {
      id: `XL`,
      name: `Extra Large`,
      details: 'Chest: 22" | Length: 29.5" | Shoulder: 18.5"',
    };
    targetItem.sizes = targetItem.sizes || [];
    targetItem.sizes.push(newSize);
    setConfig({ ...config, drops: copy });
  };

  const removeSizeFromItem = (itemIndex: number, sizeIndex: number) => {
    const copy = [...config.drops];
    const targetItem = copy[selectedDropIndex].colors[itemIndex];
    if (targetItem.sizes && targetItem.sizes.length <= 1) {
      alert("Each product item should have at least 1 selectable size option.");
      return;
    }
    targetItem.sizes.splice(sizeIndex, 1);
    setConfig({ ...config, drops: copy });
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center p-6 font-mono">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-[#141414] border border-[#D4AF37]/30 p-8 shadow-2xl">
          <div className="text-center mb-6">
            <Lock className="w-8 h-8 text-[#D4AF37] mx-auto mb-3 animate-pulse" />
            <span className="text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase block">Studio Vault Security</span>
            <h1 className="text-2xl font-serif text-white mt-1">ROVE Store Controller</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-2">Studio Authentication</label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter Studio Security PIN"
                className="w-full bg-[#0D0D0D] border border-white/20 px-4 py-3.5 text-sm text-white font-mono focus:outline-none focus:border-[#D4AF37] text-center tracking-[0.2em]"
              />
              {pinError && <span className="text-red-400 text-xs block mt-2">{pinError}</span>}
            </div>
            <button type="submit" className="w-full py-4 bg-[#D4AF37] text-[#0D0D0D] font-bold text-xs tracking-[0.25em] uppercase hover:bg-[#c49f27] transition-all">
              Unlock Studio Management
            </button>
          </form>
          <div className="mt-6 text-[11px] text-white/40 text-center leading-relaxed">
            Manage future releases, customize any number of products, assign 2 photos & specific sizes per item, and adjust PKR pricing in real-time.
          </div>
        </motion.div>
      </div>
    );
  }

  const currentDrop = config.drops[selectedDropIndex] || config.drops[0];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white font-mono pb-24">
      
      {/* Top Bar */}
      <header className="bg-[#141414] border-b border-[#D4AF37]/20 py-5 px-6 md:px-12 sticky top-0 z-50 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-[#D4AF37]" />
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] block">No-Code Live Studio (PIN Validated)</span>
            <h1 className="text-lg font-serif tracking-wide text-white">ROVE Presence — Admin Storefront Controller</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyConfig}
            className="px-4 py-2.5 bg-[#0D0D0D] border border-white/20 hover:border-[#D4AF37] text-xs text-white/80 hover:text-white flex items-center gap-2 transition-colors"
            title="Copy entire store configuration as JSON to clipboard"
          >
            <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{copiedJson ? "Copied JSON!" : "Backup JSON"}</span>
          </button>
          <a href="/" target="_blank" className="px-4 py-2.5 border border-white/20 hover:border-[#D4AF37] text-xs text-white/80 hover:text-white flex items-center gap-2 transition-colors">
            <span>View Live Store</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
          </a>
          <button
            onClick={handleSaveToCloud}
            disabled={status === "saving"}
            className="px-7 py-3 bg-[#D4AF37] hover:bg-[#c49f27] disabled:opacity-50 text-[#0D0D0D] font-bold text-xs tracking-[0.2em] uppercase flex items-center gap-2 shadow-xl transition-transform transform hover:-translate-y-0.5"
          >
            <Save className="w-4 h-4" />
            <span>{status === "saving" ? "Publishing..." : "Publish Live Updates"}</span>
          </button>
        </div>
      </header>

      {/* Status Banner */}
      {statusMessage && (
        <div className={`p-4 px-6 md:px-12 flex items-center justify-between gap-3 text-xs font-mono transition-all ${status === "success" ? "bg-green-950/90 text-green-300 border-b border-green-500/30" : "bg-red-950/90 text-red-300 border-b border-red-500/40"}`}>
          <div className="flex items-center gap-3">
            {status === "success" ? <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
            <span className="leading-relaxed font-sans">{statusMessage}</span>
          </div>
          {status === "error" && (
            <button onClick={() => setActiveTab("storage")} className="px-3 py-1 bg-red-800 hover:bg-red-700 text-white font-mono text-[11px] uppercase tracking-wider whitespace-nowrap">
              See Fix Instructions &rarr;
            </button>
          )}
        </div>
      )}

      {/* Main Body Hub */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-10">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-white/15 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("drops")}
            className={`px-6 py-3 text-xs uppercase tracking-[0.2em] flex items-center gap-2 border-b-2 font-mono whitespace-nowrap transition-all ${activeTab === "drops" ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10 font-bold" : "border-transparent text-white/60 hover:text-white"}`}
          >
            <Layers className="w-4 h-4" /> 1. Releases & Products ({config.drops.length})
          </button>
          <button
            onClick={() => setActiveTab("brand")}
            className={`px-6 py-3 text-xs uppercase tracking-[0.2em] flex items-center gap-2 border-b-2 font-mono whitespace-nowrap transition-all ${activeTab === "brand" ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10 font-bold" : "border-transparent text-white/60 hover:text-white"}`}
          >
            <Settings className="w-4 h-4" /> 2. Fix Email Delivery & WhatsApp
          </button>
          <button
            onClick={() => setActiveTab("storage")}
            className={`px-6 py-3 text-xs uppercase tracking-[0.2em] flex items-center gap-2 border-b-2 font-mono whitespace-nowrap transition-all ${activeTab === "storage" ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10 font-bold" : "border-transparent text-white/60 hover:text-white"}`}
          >
            <HelpCircle className="w-4 h-4" /> 3. ☁️ Fix Cloud Saving & Image Uploads
          </button>
        </div>

        {/* TAB 1: PRODUCT DROPS & PRICING */}
        {activeTab === "drops" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: List of Releases */}
            <div className="lg:col-span-4 bg-[#141414] border border-white/10 p-6 space-y-4 sticky top-28">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37]">Active Releases</span>
                <button onClick={addNewDrop} className="px-3 py-1.5 bg-[#D4AF37] text-[#0D0D0D] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-white transition-colors">
                  <Plus className="w-3.5 h-3.5" /> + New Drop
                </button>
              </div>

              <div className="space-y-2.5">
                {config.drops.map((drop, idx) => (
                  <div
                    key={drop.id}
                    onClick={() => setSelectedDropIndex(idx)}
                    className={`p-4 border cursor-pointer flex items-center justify-between transition-all ${selectedDropIndex === idx ? "border-[#D4AF37] bg-[#D4AF37]/15 shadow-[0_0_15px_rgba(212,175,55,0.1)]" : "border-white/10 hover:border-white/30 bg-[#0D0D0D]"}`}
                  >
                    <div>
                      <span className="text-[10px] text-[#D4AF37] block uppercase font-mono">{drop.badge.split("—")[0]}</span>
                      <strong className="text-base text-white font-serif tracking-wide block my-0.5">{drop.name}</strong>
                      <span className="text-[11px] text-white/60 font-sans">{drop.colors.length} {drop.colors.length === 1 ? "Product Item" : "Product Items"}</span>
                    </div>
                    {config.drops.length > 1 && (
                      <button onClick={(e) => { e.stopPropagation(); removeDrop(idx); }} title="Delete Drop" className="p-2 text-white/40 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Editor for Selected Drop */}
            {currentDrop && (
              <div className="lg:col-span-8 bg-[#141414] border border-white/10 p-6 md:p-8 space-y-8">
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] block mb-1 font-mono">Editing Selected Release</span>
                  <h3 className="text-2xl md:text-3xl font-serif text-white">{currentDrop.name}</h3>
                </div>

                {/* Drop General Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-white/70 mb-1">Release Title / Name</label>
                    <input
                      type="text"
                      value={currentDrop.name}
                      onChange={(e) => {
                        const copy = [...config.drops];
                        copy[selectedDropIndex].name = e.target.value;
                        setConfig({ ...config, drops: copy });
                      }}
                      className="w-full bg-[#0D0D0D] border border-white/20 p-3 text-sm text-white font-mono focus:border-[#D4AF37] rounded-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-white/70 mb-1">Badge / Collection Tag</label>
                    <input
                      type="text"
                      value={currentDrop.badge}
                      onChange={(e) => {
                        const copy = [...config.drops];
                        copy[selectedDropIndex].badge = e.target.value;
                        setConfig({ ...config, drops: copy });
                      }}
                      className="w-full bg-[#0D0D0D] border border-white/20 p-3 text-sm text-white font-mono focus:border-[#D4AF37] rounded-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] uppercase tracking-wider text-white/70 mb-1">Product Description</label>
                    <textarea
                      rows={3}
                      value={currentDrop.shortDescription}
                      onChange={(e) => {
                        const copy = [...config.drops];
                        copy[selectedDropIndex].shortDescription = e.target.value;
                        setConfig({ ...config, drops: copy });
                      }}
                      className="w-full bg-[#0D0D0D] border border-white/20 p-3 text-sm text-white font-sans focus:border-[#D4AF37] resize-none rounded-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* ITEMS / VARIATIONS UNDER THIS DROP (ANY NUMBER OF ITEMS!) */}
                <div className="border-t border-white/10 pt-8">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div>
                      <span className="text-sm font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-bold block">
                        Product Items & Colorways ({currentDrop.colors.length})
                      </span>
                      <p className="text-xs text-white/60 font-sans mt-0.5">
                        Add as many or as few items as you need. Each item controls its own PKR price, two images, and custom sizes!
                      </p>
                    </div>
                    <button
                      onClick={addNewItemToCurrentDrop}
                      className="px-4 py-2.5 bg-[#D4AF37] text-[#0D0D0D] font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-white transition-colors"
                    >
                      <Plus className="w-4 h-4" /> + Add Another Item
                    </button>
                  </div>

                  <div className="space-y-8">
                    {currentDrop.colors.map((item, itemIdx) => (
                      <div key={item.id} className="p-6 bg-[#0D0D0D] border border-white/20 space-y-6 relative shadow-2xl">
                        
                        {/* Item Header */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                          <div className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-full border border-white/40 shadow-sm" style={{ backgroundColor: item.hex }} />
                            <strong className="text-base text-white font-serif">{item.name || `Item ${itemIdx + 1}`}</strong>
                            <span className="px-2.5 py-0.5 bg-[#141414] text-[#D4AF37] text-xs font-mono font-bold">{item.priceFormatted}</span>
                          </div>
                          <button
                            onClick={() => removeItemFromCurrentDrop(itemIdx)}
                            className="px-3 py-1.5 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-white hover:bg-red-500/20 text-xs flex items-center gap-1.5 transition-all"
                            title="Delete this item"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove Item
                          </button>
                        </div>

                        {/* Item Basic Details (Name & Price) */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[11px] uppercase tracking-wider text-white/70 mb-1.5">Item / Colorway Name</label>
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => {
                                const copy = [...config.drops];
                                copy[selectedDropIndex].colors[itemIdx].name = e.target.value;
                                setConfig({ ...config, drops: copy });
                              }}
                              placeholder="e.g. Jet Black Obsidian"
                              className="w-full bg-[#141414] border border-white/20 p-3 text-sm text-white font-mono focus:border-[#D4AF37]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] uppercase tracking-wider text-[#D4AF37] font-bold mb-1.5">Price (PKR)</label>
                            <input
                              type="text"
                              value={item.priceFormatted}
                              onChange={(e) => {
                                const copy = [...config.drops];
                                copy[selectedDropIndex].colors[itemIdx].priceFormatted = e.target.value;
                                setConfig({ ...config, drops: copy });
                              }}
                              placeholder="e.g. PKR 2,299 or PKR 2,499"
                              className="w-full bg-[#141414] border border-white/20 p-3 text-sm text-[#D4AF37] font-mono font-bold focus:border-[#D4AF37]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] uppercase tracking-wider text-white/70 mb-1.5">Color Tint (Hex Code)</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={item.hex}
                                onChange={(e) => {
                                  const copy = [...config.drops];
                                  copy[selectedDropIndex].colors[itemIdx].hex = e.target.value;
                                  setConfig({ ...config, drops: copy });
                                }}
                                className="w-12 h-11 bg-transparent border-0 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={item.hex}
                                onChange={(e) => {
                                  const copy = [...config.drops];
                                  copy[selectedDropIndex].colors[itemIdx].hex = e.target.value;
                                  setConfig({ ...config, drops: copy });
                                }}
                                className="flex-1 bg-[#141414] border border-white/20 p-3 text-xs text-white font-mono uppercase"
                              />
                            </div>
                          </div>
                        </div>

                        {/* TWO IMAGES PER PRODUCT */}
                        <div className="p-4 bg-[#141414] border border-white/10 space-y-3">
                          <strong className="text-xs text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" /> Two Images For This Item (Front & Back Views)
                          </strong>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] text-white/70 uppercase tracking-wide mb-1">Image 1 URL (Front Plate)</label>
                              <input
                                type="text"
                                value={item.frontImage}
                                onChange={(e) => {
                                  const copy = [...config.drops];
                                  copy[selectedDropIndex].colors[itemIdx].frontImage = e.target.value;
                                  setConfig({ ...config, drops: copy });
                                }}
                                placeholder="/images/photo1.jpg or https://..."
                                className="w-full bg-[#0D0D0D] border border-white/20 p-2.5 text-xs text-white font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-white/70 uppercase tracking-wide mb-1">Image 2 URL (Back / Detail Plate)</label>
                              <input
                                type="text"
                                value={item.backImage}
                                onChange={(e) => {
                                  const copy = [...config.drops];
                                  copy[selectedDropIndex].colors[itemIdx].backImage = e.target.value;
                                  setConfig({ ...config, drops: copy });
                                }}
                                placeholder="/images/photo2.jpg or https://..."
                                className="w-full bg-[#0D0D0D] border border-white/20 p-2.5 text-xs text-white font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        {/* SIZES UNDER THE INDIVIDUAL PRODUCT */}
                        <div className="p-4 bg-[#141414] border border-white/10 space-y-4">
                          <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <strong className="text-xs text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                              <Ruler className="w-4 h-4" /> Sizes & Measurements For THIS Product ({item.sizes?.length || 0})
                            </strong>
                            <button
                              onClick={() => addSizeToItem(itemIdx)}
                              className="px-3 py-1 bg-white/10 hover:bg-[#D4AF37] text-white hover:text-black font-mono text-[10px] uppercase tracking-wider font-bold transition-all"
                            >
                              + Add Size Option
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {(item.sizes || []).map((sz, szIdx) => (
                              <div key={szIdx} className="p-3 bg-[#0D0D0D] border border-white/15 space-y-2.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] text-[#D4AF37] font-mono uppercase font-bold">Size Option #{szIdx + 1}</span>
                                  {item.sizes.length > 1 && (
                                    <button
                                      onClick={() => removeSizeFromItem(itemIdx, szIdx)}
                                      className="text-[10px] text-red-400 hover:text-white uppercase flex items-center gap-1"
                                    >
                                      <Trash2 className="w-3 h-3" /> Remove
                                    </button>
                                  )}
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="col-span-1">
                                    <label className="block text-[9px] text-white/50 uppercase">Tag (e.g. M)</label>
                                    <input
                                      type="text"
                                      value={sz.id}
                                      onChange={(e) => {
                                        const copy = [...config.drops];
                                        copy[selectedDropIndex].colors[itemIdx].sizes[szIdx].id = e.target.value;
                                        copy[selectedDropIndex].colors[itemIdx].sizes[szIdx].name = e.target.value === "M" ? "Medium" : e.target.value === "L" ? "Large" : e.target.value;
                                        setConfig({ ...config, drops: copy });
                                      }}
                                      className="w-full bg-[#141414] border border-white/20 p-2 text-xs text-white font-mono font-bold text-center uppercase"
                                    />
                                  </div>
                                  <div className="col-span-2">
                                    <label className="block text-[9px] text-white/50 uppercase">Measurements Details</label>
                                    <input
                                      type="text"
                                      value={sz.details}
                                      onChange={(e) => {
                                        const copy = [...config.drops];
                                        copy[selectedDropIndex].colors[itemIdx].sizes[szIdx].details = e.target.value;
                                        setConfig({ ...config, drops: copy });
                                      }}
                                      placeholder="Chest: 20, Length: 27.5, Shoulder: 17.5"
                                      className="w-full bg-[#141414] border border-white/20 p-2 text-xs text-white/90 font-mono"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* TAB 2: FIX EMAIL DELIVERY & WHATSAPP */}
        {activeTab === "brand" && (
          <div className="max-w-4xl bg-[#141414] border border-white/10 p-8 space-y-10 shadow-2xl">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37] block mb-2">Order Dispatch & Real-Time Notifications</span>
              <h3 className="text-2xl sm:text-3xl font-serif text-white mb-2">Fix Email Delivery & WhatsApp Setup</h3>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                Below you can configure both WhatsApp automatic order routing and test your Web3Forms key instantly!
              </p>
            </div>

            {/* SOLUTION 1: WEB3FORMS (100% FREE, ZERO-CONFIG GMAIL WORKAROUND) */}
            <div className="p-6 bg-[#0D0D0D] border border-[#D4AF37]/40 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="px-3 py-1 bg-[#D4AF37] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-4 h-4 fill-black text-[#D4AF37]" /> Recommended Solution: Web3Forms (Bypass Resend Entirely)
                </span>
                <span className="text-xs text-green-400 font-mono">✔ 100% Free & Reliable for Gmail</span>
              </div>
              
              <p className="text-xs sm:text-sm text-white/85 font-sans leading-relaxed">
                Want your orders delivered straight to your Gmail instantly without ever fighting Resend spam filters or checking Suppression Lists?
              </p>
              
              <div className="space-y-3 bg-[#141414] p-5 border border-white/10 font-mono text-xs">
                <strong className="text-[#D4AF37] uppercase block">👉 60-Second Setup Instructions:</strong>
                <ol className="list-decimal pl-5 space-y-2 text-white/80">
                  <li>Go to <a href="https://web3forms.com/#start" target="_blank" rel="noreferrer" className="text-[#D4AF37] underline font-bold">https://web3forms.com</a> in your browser.</li>
                  <li>Type in <code>rovepresence@gmail.com</code> and click <strong>Create Access Key</strong>.</li>
                  <li>Open your email inbox, copy the free Access Key they just sent you, and paste it into the box below!</li>
                  <li><strong>Click &quot;Send Test Order Email&quot; at the bottom of this page right now!</strong> We will immediately transmit a live order directly from your browser using whatever key is typed in the box below!</li>
                </ol>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#D4AF37] font-bold mb-2 font-mono">
                  Paste Web3Forms Access Key Here
                </label>
                <input
                  type="text"
                  value={config.brand.web3formsAccessKey || "b0a8ee37-de57-4314-acee-4c65d60c8580"}
                  onChange={(e) => setConfig({ ...config, brand: { ...config.brand, web3formsAccessKey: e.target.value } })}
                  placeholder="e.g. b0a8ee37-de57-4314-acee-4c65d60c8580"
                  className="w-full bg-[#141414] border border-[#D4AF37]/60 p-4 text-sm text-white font-mono focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* SOLUTION 2: WHATSAPP NUMBER & RESEND RECOVERY */}
            <div className="space-y-6 border-t border-white/10 pt-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#D4AF37] font-bold mb-2 flex items-center gap-2 font-mono">
                  <Smartphone className="w-4 h-4" /> Your Studio WhatsApp Phone Number
                </label>
                <input
                  type="text"
                  value={config.brand.whatsappNumber}
                  onChange={(e) => setConfig({ ...config, brand: { ...config.brand, whatsappNumber: e.target.value } })}
                  placeholder="e.g. 923001234567"
                  className="w-full bg-[#0D0D0D] border border-[#D4AF37]/50 p-4 text-base text-white font-mono focus:border-[#D4AF37]"
                />
                <span className="text-[11px] text-white/60 block mt-2.5 leading-relaxed font-sans">
                  👉 <strong>Important Format:</strong> Enter your full Pakistan phone number with country code <code>92</code>, <strong>without any leading zero, plus sign (+), or spaces</strong>. For example, if your number is <code>0300 1234567</code>, type exactly <code>923001234567</code>.
                </span>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/80 mb-2 font-mono">
                  Founder Order Fulfillment Email Address
                </label>
                <input
                  type="email"
                  value={config.brand.founderEmail}
                  onChange={(e) => setConfig({ ...config, brand: { ...config.brand, founderEmail: e.target.value } })}
                  placeholder="rovepresence@gmail.com"
                  className="w-full bg-[#0D0D0D] border border-white/20 p-4 text-sm text-white font-mono"
                />
              </div>

              {/* LIVE EMAIL DIAGNOSTIC TESTING SUITE */}
              <div className="p-6 mt-8 bg-[#0D0D0D] border border-white/10 space-y-4 shadow-inner">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-[240px]">
                    <h4 className="text-sm font-mono text-[#D4AF37] font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> Test Your Order Email Delivery Live
                    </h4>
                    <p className="text-xs text-white/60 font-sans mt-1">
                      After pasting your Web3Forms key above, click below to send a live test order instantly!
                    </p>
                  </div>
                  <button
                    onClick={runEmailDiagnosticTest}
                    disabled={testEmailStatus === "testing"}
                    className="px-5 py-3 bg-[#D4AF37] hover:bg-[#c49f27] text-[#0D0D0D] font-mono font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 shadow-xl"
                  >
                    <Send className="w-3 h-3" />
                    {testEmailStatus === "testing" ? "Transmitting..." : "Send Test Order Email"}
                  </button>
                </div>
                
                {testEmailStatus !== "idle" && (
                  <div className={`p-4 mt-2 text-xs font-mono leading-relaxed border ${
                    testEmailStatus === "success" ? "bg-green-950/50 border-green-500/30 text-green-300" :
                    testEmailStatus === "error" ? "bg-red-950/50 border-red-500/40 text-red-300" :
                    "bg-[#141414] border-white/10 text-white/60"
                  }`}>
                    {testEmailMessage}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: HOW TO FIX CLOUD SAVING & IMAGE UPLOADS */}
        {activeTab === "storage" && (
          <div className="max-w-4xl bg-[#141414] border border-white/10 p-8 md:p-10 space-y-10 text-sm font-sans leading-relaxed shadow-2xl">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] block mb-2">Troubleshooting Guide & Setup</span>
              <h3 className="text-2xl md:text-3xl font-serif text-white">How to Enable Cloud Saving & Upload Photos</h3>
            </div>

            {/* 1. WHY THE UPSTASH REDIS WARNING APPEARED & EXACT 60-SECOND FIX */}
            <div className="p-6 bg-[#0D0D0D] border-l-4 border-[#D4AF37] space-y-4 shadow-xl">
              <h4 className="text-lg font-serif text-[#D4AF37] font-bold flex items-center gap-2">
                🚨 Why did I see &quot;Upstash Redis database not linked in Vercel yet&quot;?
              </h4>
              <p className="text-white/80 text-xs sm:text-sm">
                When you host a website on Vercel, serverless code cannot overwrite static source code files directly after deployment. To enable clicking <strong>&quot;Publish Live Updates&quot;</strong> without writing code or git pushing, Vercel provides a free database called <strong>Upstash Redis</strong>. If it is not linked yet in Vercel, cloud saving will show that notice!
              </p>
              <div className="bg-[#141414] p-5 border border-white/10 space-y-3">
                <strong className="text-xs font-mono text-[#D4AF37] uppercase block">👉 Exact 60-Second Fix in Vercel:</strong>
                <ol className="list-decimal pl-6 space-y-3 text-xs text-white/90 font-mono leading-relaxed">
                  <li>Open your <strong>Vercel Dashboard</strong> in a new browser tab and click on your project (<strong>rove-website</strong>).</li>
                  <li>Click on the <strong>Storage</strong> tab at the very top of your project page.</li>
                  <li>Click <strong>Create Database</strong> and select <strong>Upstash Redis (Key-Value)</strong> (it is 100% free and takes 5 seconds).</li>
                  <li>Click <strong>Connect to Project</strong> and select <em>rove-website</em>.</li>
                  <li><strong>VERY IMPORTANT:</strong> Once connected, go to your <strong>Deployments</strong> tab in Vercel, click the three little dots (<strong>...</strong>) next to your latest deployment, and select <strong>Redeploy</strong>.</li>
                </ol>
                <p className="text-xs text-[#25D366] font-mono font-bold pt-2">
                  ✔ Once redeployed, any time you come back to /admin and click Publish, your new drops and prices go live instantly worldwide!
                </p>
              </div>
            </div>

            {/* 2. HOW TO APPLY 2 IMAGES PER PRODUCT WITHOUT CODING */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h4 className="text-lg font-serif text-white font-semibold">
                📸 How do I add my product photos without writing code?
              </h4>
              <p className="text-white/75 text-xs sm:text-sm">
                In Tab 1 above, every single product item has two image inputs (Front View and Back/Alternate View). Here is how to feed pictures into them:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="p-5 bg-[#0D0D0D] border border-white/15 space-y-2">
                  <strong className="text-xs font-mono text-[#D4AF37] uppercase block">Option A: Paste Web Links (Easiest!)</strong>
                  <p className="text-xs text-white/70 font-sans">
                    Upload your photos to any simple image sharing host (like Imgur, Postggy, Cloudinary, or Vercel Blob). Copy the direct link (e.g. <code>https://i.imgur.com/yourphoto.jpg</code>) and paste it straight into Image 1 or Image 2 in Tab 1 above!
                  </p>
                </div>
                <div className="p-5 bg-[#0D0D0D] border border-white/15 space-y-2">
                  <strong className="text-xs font-mono text-[#D4AF37] uppercase block">Option B: Upload in GitHub Web</strong>
                  <p className="text-xs text-white/70 font-sans">
                    On GitHub (`github.com/misternaul/rove-website`), click into the folder named <code>public/images/</code>. Click <strong>Add File &rarr; Upload files</strong> to drop your photos. Then simply enter <code>/images/filename.jpg</code> in Tab 1!
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
