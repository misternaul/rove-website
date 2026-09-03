"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { Product, ProductVariant } from "@prisma/client";

interface ProductActionsProps {
  product: Product;
  variants: ProductVariant[];
}

export default function ProductActions({ product, variants }: ProductActionsProps) {
  const [selectedColor, setSelectedColor] = useState(variants[0]?.colorName || "");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart, setIsCartOpen } = useCart();

  // Unique colors and sizes for the UI
  const colors = Array.from(new Set(variants.map(v => v.colorName))).map(colorName => {
    return variants.find(v => v.colorName === colorName)!;
  });
  
  const availableSizesForColor = variants.filter(v => v.colorName === selectedColor);
  
  const selectedVariant = variants.find(v => v.colorName === selectedColor && v.size === selectedSize);
  const isOutOfStock = selectedVariant ? selectedVariant.stock < 1 : false;

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    
    addToCart({
      id: selectedVariant.id,
      dropId: product.id,
      dropName: product.name,
      colorId: selectedColor,
      colorName: selectedColor,
      sizeId: selectedSize,
      sizeName: selectedSize,
      quantity: quantity,
      priceFormatted: `PKR ${(product.isDiscountActive && product.discountedPrice ? product.discountedPrice : product.basePrice).toLocaleString()}`,
      priceNumeric: product.isDiscountActive && product.discountedPrice ? product.discountedPrice : product.basePrice,
      image: "/images/editorial-rocks.png", // fallback image
      maxStock: selectedVariant.stock,
    });
    setIsCartOpen(true);
  };

  return (
    <div className="space-y-10">
      
      {/* Price */}
      <div>
        {product.isDiscountActive && product.discountedPrice ? (
          <div className="flex items-end gap-3">
            <span className="text-2xl font-mono text-[#D4AF37]">PKR {product.discountedPrice.toLocaleString()}</span>
            <span className="text-lg font-mono text-white/30 line-through mb-0.5">PKR {product.basePrice.toLocaleString()}</span>
          </div>
        ) : (
          <div className="text-2xl font-mono text-white">PKR {product.basePrice.toLocaleString()}</div>
        )}
      </div>

      {/* Colors */}
      {colors.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50">Color</span>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white">{selectedColor}</span>
          </div>
          <div className="flex gap-4">
            {colors.map((colorVariant) => (
              <button
                key={colorVariant.colorName}
                onClick={() => {
                  setSelectedColor(colorVariant.colorName);
                  setSelectedSize(""); // reset size on color change
                }}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  selectedColor === colorVariant.colorName ? "border-[#D4AF37] scale-110" : "border-transparent hover:border-white/30"
                }`}
                style={{ backgroundColor: colorVariant.colorHex }}
                aria-label={`Select color ${colorVariant.colorName}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {availableSizesForColor.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50">Size</span>
            <button className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 underline hover:text-white transition-colors">Size Guide</button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {availableSizesForColor.map((variant) => {
              const isAvailable = variant.stock > 0;
              return (
                <button
                  key={variant.size}
                  disabled={!isAvailable}
                  onClick={() => setSelectedSize(variant.size)}
                  className={`py-3 border text-xs font-mono transition-all ${
                    !isAvailable 
                      ? "border-white/10 text-white/20 cursor-not-allowed line-through" 
                      : selectedSize === variant.size 
                        ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10" 
                        : "border-white/20 text-white hover:border-white"
                  }`}
                >
                  {variant.size}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Add to Cart */}
      <div className="pt-6">
        <button
          onClick={handleAddToCart}
          disabled={!selectedSize || isOutOfStock}
          className={`w-full py-5 text-xs font-mono uppercase tracking-[0.3em] font-bold transition-all ${
            !selectedSize
              ? "bg-white/10 text-white/30 cursor-not-allowed"
              : isOutOfStock
              ? "bg-red-950/50 text-red-500 cursor-not-allowed"
              : "bg-white text-black hover:bg-[#D4AF37] hover:text-black shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
          }`}
        >
          {!selectedSize ? "Select Size" : isOutOfStock ? "Sold Out" : "Add to Bag"}
        </button>
        <p className="text-center text-[10px] text-white/40 font-mono tracking-widest mt-4 uppercase">Free shipping on orders over PKR 5,000</p>
      </div>

    </div>
  );
}
