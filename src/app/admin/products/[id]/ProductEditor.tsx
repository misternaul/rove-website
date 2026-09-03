"use client";

import { useState } from "react";
import { Product, ProductVariant } from "@prisma/client";
import { Save, AlertCircle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductEditor({ product, variants }: { product: Product, variants: ProductVariant[] }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Product Fields
  const [basePrice, setBasePrice] = useState(product.basePrice.toString());
  const [isDiscountActive, setIsDiscountActive] = useState(product.isDiscountActive);
  const [discountedPrice, setDiscountedPrice] = useState(product.discountedPrice?.toString() || "");

  // Variants State
  const [stockState, setStockState] = useState<Record<string, number>>(
    variants.reduce((acc, v) => ({ ...acc, [v.id]: v.stock }), {})
  );

  const handleSave = async () => {
    setIsSaving(true);
    setStatus("idle");
    
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          basePrice: parseFloat(basePrice),
          isDiscountActive,
          discountedPrice: discountedPrice ? parseFloat(discountedPrice) : null,
          variantStocks: stockState
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update product");
      
      setStatus("success");
      router.refresh(); // Refresh server data
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Media Library / Quick Upload */}
      <div className="bg-[#141414] border border-white/10 p-6 space-y-6">
        <h2 className="text-sm font-mono uppercase tracking-widest text-[#D4AF37] border-b border-white/10 pb-2">Media Library (Vercel Blob)</h2>
        <div className="border border-dashed border-white/20 p-8 text-center flex flex-col items-center justify-center">
          <input 
            type="file" 
            id="image-upload" 
            className="hidden" 
            accept="image/*"
            onChange={async (e) => {
              if (!e.target.files?.length) return;
              const file = e.target.files[0];
              try {
                const response = await fetch(`/api/upload?filename=${file.name}`, {
                  method: 'POST',
                  body: file,
                });
                const blob = await response.json();
                if (blob.url) {
                  alert(`Image uploaded! URL: ${blob.url}\n(Copy this to use anywhere)`);
                } else {
                  alert("Upload failed.");
                }
              } catch (error) {
                alert("Upload failed: " + error);
              }
            }}
          />
          <label htmlFor="image-upload" className="cursor-pointer px-6 py-3 border border-white/20 text-white/70 hover:text-white hover:border-[#D4AF37] transition-colors font-mono text-xs uppercase tracking-widest">
            Select Image to Upload
          </label>
          <p className="mt-4 text-[10px] font-mono text-white/40">Uploads directly to Vercel Blob storage</p>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-[#141414] border border-white/10 p-6 space-y-6">
        <h2 className="text-sm font-mono uppercase tracking-widest text-[#D4AF37] border-b border-white/10 pb-2">Pricing & Discounts</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-2">Base Price (PKR)</label>
            <input 
              type="number" 
              value={basePrice}
              onChange={e => setBasePrice(e.target.value)}
              className="w-full bg-[#0D0D0D] border border-white/20 px-4 py-3 text-sm font-mono focus:border-[#D4AF37] outline-none transition-colors"
            />
          </div>
          
          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={isDiscountActive}
                onChange={e => setIsDiscountActive(e.target.checked)}
                className="w-5 h-5 accent-[#D4AF37] bg-[#0D0D0D] border-white/20"
              />
              <span className="text-xs font-mono uppercase tracking-widest">Enable Discount Sale</span>
            </label>
          </div>

          {isDiscountActive && (
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-[#D4AF37] mb-2">Discounted Sale Price (PKR)</label>
              <input 
                type="number" 
                value={discountedPrice}
                onChange={e => setDiscountedPrice(e.target.value)}
                className="w-full bg-[#0D0D0D] border border-[#D4AF37]/50 px-4 py-3 text-sm font-mono focus:border-[#D4AF37] outline-none transition-colors"
              />
            </div>
          )}
        </div>
      </div>

      {/* Inventory Section */}
      <div className="bg-[#141414] border border-white/10 p-6 space-y-6">
        <h2 className="text-sm font-mono uppercase tracking-widest text-[#D4AF37] border-b border-white/10 pb-2">Inventory Management</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-mono text-white/50 uppercase tracking-widest">
                <th className="py-3 font-normal">Color</th>
                <th className="py-3 font-normal">Size</th>
                <th className="py-3 font-normal">SKU</th>
                <th className="py-3 font-normal text-right">Available Stock</th>
              </tr>
            </thead>
            <tbody>
              {variants.map(v => (
                <tr key={v.id} className="border-b border-white/5">
                  <td className="py-3 font-mono text-xs">{v.colorName}</td>
                  <td className="py-3 font-mono text-xs">{v.size}</td>
                  <td className="py-3 font-mono text-xs text-white/50">{v.sku}</td>
                  <td className="py-3 text-right">
                    <input 
                      type="number" 
                      min="0"
                      value={stockState[v.id]}
                      onChange={(e) => setStockState({...stockState, [v.id]: parseInt(e.target.value) || 0})}
                      className="w-24 bg-[#0D0D0D] border border-white/20 px-3 py-2 text-sm font-mono text-right focus:border-[#D4AF37] outline-none"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Messages */}
      {status === "error" && (
        <div className="p-4 bg-red-950/50 border border-red-500/50 flex items-center gap-3 text-red-300 text-xs font-mono">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
      {status === "success" && (
        <div className="p-4 bg-green-950/50 border border-green-500/50 flex items-center gap-3 text-green-300 text-xs font-mono">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>Product updated successfully!</span>
        </div>
      )}

      {/* Save Action */}
      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-4 bg-[#D4AF37] hover:bg-white disabled:opacity-50 text-black font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-colors"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
