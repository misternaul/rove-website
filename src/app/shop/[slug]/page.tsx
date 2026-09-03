import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProductActions from "@/components/ProductActions";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) return { title: "Not Found | ROVE" };
  return { title: `${product.name} | ROVE`, description: product.shortDescription };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      images: { orderBy: { isPrimary: 'desc' } },
      variants: true
    }
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white pt-24 pb-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Column: Product Images (Editorial Style) */}
          <div className="w-full lg:w-3/5 space-y-4">
            {product.images.map((img, i) => (
              <div key={img.id} className="relative aspect-[3/4] w-full bg-[#141414]">
                <Image
                  src={img.url}
                  alt={img.alt || product.name}
                  fill
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            ))}
            {/* Fallback if no images */}
            {product.images.length === 0 && (
              <div className="relative aspect-[3/4] w-full bg-[#141414]">
                <Image src="/images/editorial-rocks.png" alt="Fallback" fill className="object-cover" />
              </div>
            )}
          </div>

          {/* Right Column: Product Details & Actions */}
          <div className="w-full lg:w-2/5 lg:sticky lg:top-32 h-fit">
            
            <div className="mb-10">
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#D4AF37] mb-4 block">
                ROVE Signature Collection
              </span>
              <h1 className="text-4xl md:text-5xl font-serif font-light mb-6">
                {product.name}
              </h1>
              {product.description && (
                <p className="text-sm text-white/70 leading-relaxed font-light">
                  {product.description}
                </p>
              )}
            </div>

            <ProductActions product={product} variants={product.variants} />

            {/* Editorial / Craftsmanship details */}
            <div className="mt-16 pt-16 border-t border-white/10 space-y-8">
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer text-xs font-mono uppercase tracking-[0.2em] pb-4 border-b border-white/5">
                  <span>Materials & Care</span>
                  <span className="text-[#D4AF37] group-open:rotate-180 transition-transform">+</span>
                </summary>
                <div className="pt-4 text-sm text-white/60 font-light leading-relaxed">
                  <p>Crafted from our signature heavy-weight premium cotton blend. Designed to maintain its structure and softness wash after wash.</p>
                  <ul className="mt-4 space-y-2 list-disc list-inside">
                    <li>Machine wash cold with like colors</li>
                    <li>Do not bleach</li>
                    <li>Lay flat to dry</li>
                    <li>Cool iron if needed</li>
                  </ul>
                </div>
              </details>

              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer text-xs font-mono uppercase tracking-[0.2em] pb-4 border-b border-white/5">
                  <span>Signature Details</span>
                  <span className="text-[#D4AF37] group-open:rotate-180 transition-transform">+</span>
                </summary>
                <div className="pt-4 text-sm text-white/60 font-light leading-relaxed">
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Gold ROVE horizon-line icon on left chest</li>
                    <li>Three parallel gold embroidered lines on right sleeve</li>
                    <li>Matte black engraved buttons</li>
                    <li>Repeating ROVE neck tape</li>
                  </ul>
                </div>
              </details>
              
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer text-xs font-mono uppercase tracking-[0.2em] pb-4 border-b border-white/5">
                  <span>Shipping & Returns</span>
                  <span className="text-[#D4AF37] group-open:rotate-180 transition-transform">+</span>
                </summary>
                <div className="pt-4 text-sm text-white/60 font-light leading-relaxed">
                  <p>Free standard shipping on all orders over PKR 5,000. Delivery typically takes 3-5 business days. We accept returns within 14 days of delivery for unworn items in perfect condition with all tags attached.</p>
                </div>
              </details>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
