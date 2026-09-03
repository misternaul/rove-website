import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Shop Collection | ROVE",
  description: "Browse the complete ROVE collection.",
};

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    include: {
      images: {
        where: { isPrimary: true },
        take: 1
      },
      variants: true
    },
    orderBy: {
      orderIndex: 'asc'
    }
  });

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white pt-32 pb-20 font-sans">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-10 mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-mono block mb-4">
              The Collection
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-light tracking-wide">
              Intentional Essentials.
            </h1>
          </div>
          
          <div className="flex items-center gap-6 text-xs font-mono uppercase tracking-widest text-white/50">
            <button className="hover:text-white transition-colors">Sort By</button>
            <button className="hover:text-white transition-colors">Filter</button>
          </div>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="py-32 text-center border border-white/5 bg-[#141414]">
            <p className="text-white/50 font-mono text-sm uppercase tracking-widest">No products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {products.map((product) => {
              const primaryImage = product.images[0]?.url || "/images/editorial-rocks.png"; // fallback
              const outOfStock = product.variants.every(v => v.stock === 0) && product.variants.length > 0;
              
              return (
                <Link key={product.id} href={`/shop/${product.slug}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#1A1A1A] mb-6">
                    <Image
                      src={primaryImage}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    {outOfStock && (
                      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1 text-[9px] font-mono uppercase tracking-widest text-white border border-white/10">
                        Sold Out
                      </div>
                    )}
                    {product.isDiscountActive && !outOfStock && (
                      <div className="absolute top-4 right-4 bg-[#D4AF37] px-3 py-1 text-[9px] font-mono uppercase tracking-widest text-black">
                        Sale
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-serif tracking-wide group-hover:text-[#D4AF37] transition-colors">
                        {product.name}
                      </h3>
                      {product.shortDescription && (
                        <p className="text-sm text-white/50 mt-1">{product.shortDescription}</p>
                      )}
                    </div>
                    <div className="text-right">
                      {product.isDiscountActive && product.discountedPrice ? (
                        <>
                          <p className="text-sm font-mono text-[#D4AF37]">PKR {product.discountedPrice.toLocaleString()}</p>
                          <p className="text-xs font-mono text-white/30 line-through mt-0.5">PKR {product.basePrice.toLocaleString()}</p>
                        </>
                      ) : (
                        <p className="text-sm font-mono text-white/80">PKR {product.basePrice.toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
