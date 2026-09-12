import React from "react";
import { SiteConfig } from "@/config/siteContent";

export default function SettingsView({ config, setConfig }: { config: SiteConfig, setConfig: any }) {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-serif text-white mb-2">Settings & Configuration</h2>
        <p className="text-sm text-white/60">Manage your WhatsApp dispatch number and brand details.</p>
      </div>

      <div className="bg-[#141414] border border-white/10 p-6 max-w-2xl">
        <h3 className="text-xs uppercase font-mono tracking-widest text-[#D4AF37] mb-6">Order Notifications</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-2">
              WhatsApp Number for Order Verification
            </label>
            <input
              type="text"
              value={config.brand.whatsappNumber}
              onChange={(e) => setConfig({ ...config, brand: { ...config.brand, whatsappNumber: e.target.value } })}
              className="w-full bg-black border border-white/10 px-4 py-3 text-sm font-mono text-white focus:border-[#D4AF37] transition-colors"
              placeholder="+92 300 0000000"
            />
            <p className="text-[10px] text-white/40 mt-2">
              This number is displayed on the success page for customers to contact you.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-2">
              Web3Forms Access Key (Email Notifications)
            </label>
            <input
              type="text"
              value={config.brand.web3formsAccessKey || ""}
              onChange={(e) => setConfig({ ...config, brand: { ...config.brand, web3formsAccessKey: e.target.value } })}
              className="w-full bg-black border border-white/10 px-4 py-3 text-sm font-mono text-white focus:border-[#D4AF37] transition-colors"
              placeholder="e.g. 1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
