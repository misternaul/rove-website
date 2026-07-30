"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { SiteConfig, siteContent } from "@/config/siteContent";

export default function StudioAdminPage() {
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState("");

  const [config, setConfig] = useState<SiteConfig>(siteContent);
  const [activeTab, setActiveTab] = useState<"drops" | "brand" | "storage">("drops");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [selectedDropIndex, setSelectedDropIndex] = useState(0);

  useEffect(() => {
    // Attempt to load live CMS data from /api/cms on launch
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
    // Default PIN is rove2026 (or matching STUDIO_ADMIN_PIN on Vercel server)
    if (!pin.trim()) {
      setPinError("Please enter your Studio PIN");
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
        body: JSON.stringify({ action: "update", updatedData: config, adminSecret: pin || "rove2026" }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to commit updates to Vercel storage.");
      }
      setStatus("success");
      setStatusMessage(data.message || "Successfully deployed updates to your live storefront!");
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err: unknown) {
      const error = err as Error;
      setStatus("error");
      setStatusMessage(error.message || "Unable to save directly to cloud. Make sure Vercel Upstash Redis is connected!");
    }
  };

  const addNewDrop = () => {
    const newDrop = {
      id: `drop-00${config.drops.length + 1}`,
      badge: `Release 00${config.drops.length + 1} — Future Edition`,
      name: `New Product Release 00${config.drops.length + 1}`,
      shortDescription: "Enter product specification, fabric weight (e.g. 250 GSM), and architectural hallmarks here.",
      shippingNote: "Complimentary Express Courier Nationwide in Pakistan",
      colors: [
        {
          id: "primary-color",
          name: "Signature Dark Colorway",
          hex: "#0D0D0D",
          priceFormatted: "PKR 3,499",
          priceNumeric: 3499,
          frontImage: "/images/polo-black-front.jpg",
          backImage: "/images/polo-black-back.jpg",
          caption: "Primary colorway description.",
        },
      ],
      sizes: [
        { id: "M", name: "Medium", details: "Chest: 20\" | Length: 27.5\" | Shoulder: 17.5\"" },
        { id: "L", name: "Large", details: "Chest: 21\" | Length: 28.5\" | Shoulder: 18\"" },
      ],
      orderButtonText: "Place Direct Order",
      secondaryActionText: "Reserve Allocation Spot",
      guaranteeText: "Verified Cash on Delivery (COD) & Direct Studio Fulfillment across Pakistan.",
      accordions: config.drops[0]?.accordions || [],
    };

    setConfig({
      ...config,
      drops: [...config.drops, newDrop],
    });
    setSelectedDropIndex(config.drops.length);
  };

  const removeDrop = (index: number) => {
    if (config.drops.length <= 1) {
      alert("You must keep at least one active product release in your catalog.");
      return;
    }
    const updated = config.drops.filter((_, i) => i !== index);
    setConfig({ ...config, drops: updated });
    setSelectedDropIndex(Math.max(0, index - 1));
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center p-6 font-mono">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-[#141414] border border-[#D4AF37]/30 p-8 shadow-2xl">
          <div className="text-center mb-6">
            <Lock className="w-8 h-8 text-[#D4AF37] mx-auto mb-3 animate-pulse" />
            <span className="text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase block">Studio Control Vault</span>
            <h1 className="text-2xl font-serif text-white mt-1">ROVE Live Admin Engine</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-2">Studio Admin PIN</label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter PIN (default: rove2026)"
                className="w-full bg-[#0D0D0D] border border-white/20 px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-[#D4AF37] text-center tracking-widest"
              />
              {pinError && <span className="text-red-400 text-[11px] block mt-2">{pinError}</span>}
            </div>
            <button type="submit" className="w-full py-4 bg-[#D4AF37] text-[#0D0D0D] font-bold text-xs tracking-[0.25em] uppercase hover:bg-[#c49f27] transition-all">
              Unlock Studio Management
            </button>
          </form>
          <div className="mt-6 text-[11px] text-white/40 text-center leading-relaxed">
            Configure future product drops, adjust live PKR pricing per colorway, and control order verification settings without writing code.
          </div>
        </motion.div>
      </div>
    );
  }

  const currentDrop = config.drops[selectedDropIndex] || config.drops[0];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white font-mono pb-20">
      
      {/* Top Bar */}
      <header className="bg-[#141414] border-b border-[#D4AF37]/20 py-5 px-6 md:px-12 sticky top-0 z-50 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-[#D4AF37]" />
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] block">No-Code Live Studio</span>
            <h1 className="text-lg font-serif tracking-wide text-white">ROVE Presence — Store Controller</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a href="/" target="_blank" className="px-4 py-2 border border-white/20 hover:border-[#D4AF37] text-xs text-white/80 hover:text-white flex items-center gap-2 transition-colors">
            <span>View Live Store</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
          </a>
          <button
            onClick={handleSaveToCloud}
            disabled={status === "saving"}
            className="px-6 py-3 bg-[#D4AF37] hover:bg-[#c49f27] disabled:opacity-50 text-[#0D0D0D] font-bold text-xs tracking-[0.2em] uppercase flex items-center gap-2 shadow-lg transition-transform transform hover:-translate-y-0.5"
          >
            <Save className="w-4 h-4" />
            <span>{status === "saving" ? "Publishing..." : "Publish Live Updates"}</span>
          </button>
        </div>
      </header>

      {/* Status Banner */}
      {statusMessage && (
        <div className={`p-4 px-6 md:px-12 flex items-center gap-3 text-xs font-mono transition-all ${status === "success" ? "bg-green-950/90 text-green-300 border-b border-green-500/30" : "bg-red-950/90 text-red-300 border-b border-red-500/30"}`}>
          {status === "success" ? <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
          <span>{statusMessage}</span>
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
            <Package className="w-4 h-4" /> 1. Releases & Product Drops ({config.drops.length})
          </button>
          <button
            onClick={() => setActiveTab("brand")}
            className={`px-6 py-3 text-xs uppercase tracking-[0.2em] flex items-center gap-2 border-b-2 font-mono whitespace-nowrap transition-all ${activeTab === "brand" ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10 font-bold" : "border-transparent text-white/60 hover:text-white"}`}
          >
            <Settings className="w-4 h-4" /> 2. WhatsApp & Email Setup
          </button>
          <button
            onClick={() => setActiveTab("storage")}
            className={`px-6 py-3 text-xs uppercase tracking-[0.2em] flex items-center gap-2 border-b-2 font-mono whitespace-nowrap transition-all ${activeTab === "storage" ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10 font-bold" : "border-transparent text-white/60 hover:text-white"}`}
          >
            <HelpCircle className="w-4 h-4" /> 3. How to Add Images & Fix Emails
          </button>
        </div>

        {/* TAB 1: PRODUCT DROPS & PRICING */}
        {activeTab === "drops" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: List of Drops */}
            <div className="lg:col-span-4 bg-[#141414] border border-white/10 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37]">Active Catalog Drops</span>
                <button onClick={addNewDrop} className="px-3 py-1.5 bg-[#D4AF37] text-[#0D0D0D] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add Drop
                </button>
              </div>

              <div className="space-y-2">
                {config.drops.map((drop, idx) => (
                  <div
                    key={drop.id}
                    onClick={() => setSelectedDropIndex(idx)}
                    className={`p-4 border cursor-pointer flex items-center justify-between transition-all ${selectedDropIndex === idx ? "border-[#D4AF37] bg-[#D4AF37]/10" : "border-white/10 hover:border-white/30 bg-[#0D0D0D]"}`}
                  >
                    <div>
                      <span className="text-[10px] text-[#D4AF37] block uppercase">{drop.badge.split("—")[0]}</span>
                      <strong className="text-sm text-white font-serif tracking-wide block">{drop.name}</strong>
                      <span className="text-[10px] text-white/50">{drop.colors.length} Colorways • {drop.sizes.length} Sizes</span>
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
                  <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] block mb-1">Editing Drop Profile</span>
                  <h3 className="text-2xl font-serif text-white">{currentDrop.name}</h3>
                </div>

                {/* Drop General Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-white/70 mb-1">Drop Name / Title</label>
                    <input
                      type="text"
                      value={currentDrop.name}
                      onChange={(e) => {
                        const copy = [...config.drops];
                        copy[selectedDropIndex].name = e.target.value;
                        setConfig({ ...config, drops: copy });
                      }}
                      className="w-full bg-[#0D0D0D] border border-white/20 p-3 text-sm text-white font-mono focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-white/70 mb-1">Release Badge / Tag</label>
                    <input
                      type="text"
                      value={currentDrop.badge}
                      onChange={(e) => {
                        const copy = [...config.drops];
                        copy[selectedDropIndex].badge = e.target.value;
                        setConfig({ ...config, drops: copy });
                      }}
                      className="w-full bg-[#0D0D0D] border border-white/20 p-3 text-sm text-white font-mono focus:border-[#D4AF37]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] uppercase tracking-wider text-white/70 mb-1">Product Description</label>
                    <textarea
                      rows={2}
                      value={currentDrop.shortDescription}
                      onChange={(e) => {
                        const copy = [...config.drops];
                        copy[selectedDropIndex].shortDescription = e.target.value;
                        setConfig({ ...config, drops: copy });
                      }}
                      className="w-full bg-[#0D0D0D] border border-white/20 p-3 text-sm text-white font-mono focus:border-[#D4AF37] resize-none"
                    />
                  </div>
                </div>

                {/* Colorways & Per-Color PKR Pricing */}
                <div className="border-t border-white/10 pt-6">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] block mb-4">Colorways & Per-Color PKR Valuation</span>
                  <div className="space-y-6">
                    {currentDrop.colors.map((color, colorIdx) => (
                      <div key={color.id} className="p-4 bg-[#0D0D0D] border border-white/15 space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full border border-white/30" style={{ backgroundColor: color.hex }} />
                            <strong className="text-sm text-white">{color.name}</strong>
                          </div>
                          <span className="text-xs font-mono text-[#D4AF37] font-bold">{color.priceFormatted}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] text-white/60 mb-1">Colorway Name</label>
                            <input
                              type="text"
                              value={color.name}
                              onChange={(e) => {
                                const copy = [...config.drops];
                                copy[selectedDropIndex].colors[colorIdx].name = e.target.value;
                                setConfig({ ...config, drops: copy });
                              }}
                              className="w-full bg-[#141414] border border-white/20 p-2 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-white/60 mb-1">Price (Formatted Text)</label>
                            <input
                              type="text"
                              value={color.priceFormatted}
                              onChange={(e) => {
                                const copy = [...config.drops];
                                copy[selectedDropIndex].colors[colorIdx].priceFormatted = e.target.value;
                                setConfig({ ...config, drops: copy });
                              }}
                              placeholder="e.g. PKR 2,299"
                              className="w-full bg-[#141414] border border-white/20 p-2 text-xs text-[#D4AF37] font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-white/60 mb-1">Front Image File Path or Web URL</label>
                            <input
                              type="text"
                              value={color.frontImage}
                              onChange={(e) => {
                                const copy = [...config.drops];
                                copy[selectedDropIndex].colors[colorIdx].frontImage = e.target.value;
                                setConfig({ ...config, drops: copy });
                              }}
                              placeholder="/images/your-image.jpg"
                              className="w-full bg-[#141414] border border-white/20 p-2 text-xs text-white/80"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sizing Specifications (Medium & Large only) */}
                <div className="border-t border-white/10 pt-6">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] block mb-4">Sizing Grading & Measurements (2 Sizes Standard)</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentDrop.sizes.map((sz, szIdx) => (
                      <div key={sz.id} className="p-4 bg-[#0D0D0D] border border-white/15">
                        <strong className="text-sm text-[#D4AF37] block mb-2">{sz.name} Grade ({sz.id})</strong>
                        <label className="block text-[10px] text-white/60 mb-1">Measurements & Specifications</label>
                        <input
                          type="text"
                          value={sz.details}
                          onChange={(e) => {
                            const copy = [...config.drops];
                            copy[selectedDropIndex].sizes[szIdx].details = e.target.value;
                            setConfig({ ...config, drops: copy });
                          }}
                          className="w-full bg-[#141414] border border-white/20 p-2.5 text-xs text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* TAB 2: WHATSAPP & BRAND EMAIL SETUP */}
        {activeTab === "brand" && (
          <div className="max-w-3xl bg-[#141414] border border-white/10 p-8 space-y-8">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] block mb-2">Customer Verification & Order Dispatch</span>
              <h3 className="text-2xl font-serif text-white mb-2">WhatsApp Confirmation Button & Email Routing</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Configure your real-time notification endpoints below. In Pakistan e-commerce, instant WhatsApp COD confirmation converts significantly higher than standard automated email receipts!
              </p>
            </div>

            <div className="space-y-6 border-t border-white/10 pt-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#D4AF37] font-bold mb-2 flex items-center gap-2">
                  <Smartphone className="w-4 h-4" /> Your Studio WhatsApp Phone Number
                </label>
                <input
                  type="text"
                  value={config.brand.whatsappNumber}
                  onChange={(e) => setConfig({ ...config, brand: { ...config.brand, whatsappNumber: e.target.value } })}
                  placeholder="e.g. 923001234567"
                  className="w-full bg-[#0D0D0D] border border-[#D4AF37]/40 p-4 text-base text-white font-mono focus:border-[#D4AF37]"
                />
                <span className="text-[11px] text-white/50 block mt-2 leading-relaxed font-sans">
                  👉 <strong>Important Format:</strong> Enter your full Pakistan phone number with country code `92`, <strong>without any leading zero, plus sign (+), or spaces</strong>. For example, if your number is `0300 1234567`, enter exactly <code>923001234567</code>. When customers click "Verify via WhatsApp" on their order receipt, WhatsApp will open a live chat directly to this phone number with their order ID, name, address, and PKR total pre-filled!
                </span>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/80 mb-2">
                  Founder Order Fulfillment Email Address
                </label>
                <input
                  type="email"
                  value={config.brand.founderEmail}
                  onChange={(e) => setConfig({ ...config, brand: { ...config.brand, founderEmail: e.target.value } })}
                  placeholder="your.personal@email.com"
                  className="w-full bg-[#0D0D0D] border border-white/20 p-4 text-sm text-white font-mono"
                />
                <span className="text-[11px] text-white/50 block mt-2 leading-relaxed font-sans">
                  This is the recipient inbox where automated Resend order summaries will be delivered.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HOW TO ADD IMAGES & WHY EMAILS WERE MISSING */}
        {activeTab === "storage" && (
          <div className="max-w-4xl bg-[#141414] border border-white/10 p-8 space-y-10 text-sm font-sans leading-relaxed">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] block mb-2">Studio FAQ & Cloud Setup</span>
              <h3 className="text-2xl md:text-3xl font-serif text-white">How to Edit Images & Fix Email Delivery</h3>
            </div>

            {/* 1. Why Email Delivery Might Be Missed on Trial */}
            <div className="p-6 bg-[#0D0D0D] border-l-4 border-[#D4AF37] space-y-3">
              <h4 className="text-lg font-serif text-[#D4AF37] font-bold flex items-center gap-2">
                🚨 Why didn&apos;t I receive the order emails earlier?
              </h4>
              <p className="text-white/80">
                When sending emails through <strong>Resend</strong> using their default trial test domain (<code>onboarding@resend.dev</code>), Resend imposes a strict security policy: <strong>You can ONLY send test emails TO THE EXACT SAME EMAIL ADDRESS you used to sign up for your Resend account!</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2 text-white/70 text-xs">
                <li>
                  <strong>Quick Fix:</strong> In your Vercel Project Environment Variables (<em>Settings &rarr; Environment Variables</em>), ensure that your <code>ADMIN_EMAIL</code> variable is set to the exact same email address you used to register at Resend!
                </li>
                <li>
                  <strong>Also verify:</strong> After adding <code>RESEND_API_KEY</code> and <code>ADMIN_EMAIL</code> in Vercel, you must click <strong>&quot;Redeploy&quot;</strong> on your deployment in Vercel so the new environment variables take effect!
                </li>
                <li>
                  <strong>Ultimate Solution:</strong> Even if an email delays, your new WhatsApp confirmation button guarantees that customers can send their entire confirmed order directly to your WhatsApp with one click!
                </li>
              </ul>
            </div>

            {/* 2. How to Add and Change Images Without Coding */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h4 className="text-lg font-serif text-white font-semibold">
                📸 How do I edit or add image files without writing code?
              </h4>
              <p className="text-white/75 text-xs sm:text-sm">
                You have two effortless ways to use new photos for your upcoming releases:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="p-5 bg-[#0D0D0D] border border-white/15 space-y-2">
                  <strong className="text-xs font-mono text-[#D4AF37] uppercase block">Method 1: Direct Web Image URLs (Fastest & No-Code)</strong>
                  <p className="text-xs text-white/70">
                    Upload your photos to any image host (like Imgur, Cloudinary, Vercel Blob, or WordPress). Copy the direct image link (e.g. <code>https://your-host.com/polo-drop2.jpg</code>) and paste it straight into the Image input field in Tab 1 above!
                  </p>
                </div>
                <div className="p-5 bg-[#0D0D0D] border border-white/15 space-y-2">
                  <strong className="text-xs font-mono text-[#D4AF37] uppercase block">Method 2: GitHub Web Dashboard</strong>
                  <p className="text-xs text-white/70">
                    Open your repository on GitHub (`github.com/misternaul/rove-website`). Navigate into the folder named <code>public/images/</code>. Click <strong>Add File &rarr; Upload files</strong> to drop your pictures there. Once uploaded, refer to them as <code>/images/filename.jpg</code>!
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Vercel Cloud Data Persistence (Upstash Redis) */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <h4 className="text-lg font-serif text-white font-semibold">
                ☁️ How to Enable 1-Click Cloud Saving on Vercel
              </h4>
              <p className="text-xs text-white/70 leading-relaxed">
                By default, clicking <strong>&quot;Publish Live Updates&quot;</strong> requires Vercel Cloud Storage so that your edits stay saved forever without editing code. To turn this on:
              </p>
              <ol className="list-decimal pl-6 space-y-2 text-xs text-white/80 font-mono">
                <li>Log in to your <strong>Vercel Dashboard</strong> and open <strong>rove-website</strong>.</li>
                <li>Go to the <strong>Storage</strong> tab at the top and click <strong>Create Database</strong>.</li>
                <li>Select <strong>Upstash Redis (Key-Value)</strong> and click Continue (it is 100% free!).</li>
                <li>Click <strong>Connect to Project</strong>. Vercel automatically links the required database variables to your live site!</li>
                <li>Redeploy once. Now, anytime you visit <code>/admin</code> and click Publish, your new drops, PKR prices, and texts go live immediately!</li>
              </ol>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
