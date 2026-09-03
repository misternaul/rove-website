import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Edit3 } from "lucide-react";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      variants: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-serif font-light mb-1">Products</h1>
          <p className="text-xs font-mono text-white/50 tracking-widest uppercase">Manage Catalog & Inventory</p>
        </div>
        <button className="px-6 py-3 bg-[#D4AF37] text-black font-mono text-xs uppercase tracking-widest font-bold hover:bg-white transition-colors">
          Add New Product
        </button>
      </div>

      <div className="bg-[#141414] border border-white/10 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[10px] font-mono text-white/50 uppercase tracking-widest bg-black/50">
              <th className="p-4 font-normal">Product</th>
              <th className="p-4 font-normal">Price</th>
              <th className="p-4 font-normal">Status</th>
              <th className="p-4 font-normal">Stock (Total)</th>
              <th className="p-4 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const primaryImage = product.images[0]?.url || "/images/editorial-rocks.png";
              const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
              
              return (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-16 bg-black border border-white/10">
                        <Image src={primaryImage} alt={product.name} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="font-serif text-white group-hover:text-[#D4AF37] transition-colors">{product.name}</div>
                        <div className="text-[10px] font-mono text-white/40 mt-1">{product.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-xs">
                    {product.isDiscountActive && product.discountedPrice ? (
                      <div className="text-[#D4AF37]">
                        PKR {product.discountedPrice}
                        <span className="block text-white/30 line-through text-[10px] mt-1">PKR {product.basePrice}</span>
                      </div>
                    ) : (
                      <span className="text-white/80">PKR {product.basePrice}</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-[9px] font-mono uppercase tracking-wider ${
                      totalStock > 0 ? "bg-green-900/30 text-green-400 border border-green-500/30" : "bg-red-900/30 text-red-400 border border-red-500/30"
                    }`}>
                      {totalStock > 0 ? "In Stock" : "Sold Out"}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs text-white/80">
                    {totalStock} Units
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/products/${product.id}`} className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-[#D4AF37] text-white hover:text-black font-mono text-xs uppercase tracking-widest transition-colors border border-white/10 hover:border-[#D4AF37]">
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-white/50 font-mono text-xs">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
