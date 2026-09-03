import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getLiveSiteContent } from "@/lib/cms";
import { ShoppingBag } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Shop | ROVE" };

export default async function ShopPage() {
  const content = await getLiveSiteContent();
  
  // Transform static drops into products
  const products = content.drops.flatMap(drop => 
    drop.colors.map(color => ({
      id: `${drop.id}-${color.id}`,
      slug: color.id,
      name: `${drop.name} - ${color.name}`,
      shortDescription: drop.shortDescription,
      basePrice: color.priceNumeric,
      primaryImage: color.frontImage
    }))
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-24 max-w-7xl mx-auto px-6 md:px-12 w-full">
        <h1 className="text-4xl md:text-5xl font-serif font-light mb-4">The Collection.</h1>
        <p className="text-muted-foreground font-light mb-16 max-w-xl">
          Core architectural pieces engineered for everyday structural integrity. Limited allocation runs.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(product => (
            <Link key={product.id} href={`/shop/${product.slug}`} className="group block">
              <div className="aspect-[3/4] relative bg-card border border-border overflow-hidden mb-4">
                <Image 
                  src={product.primaryImage} 
                  alt={product.name} 
                  fill 
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                />
              </div>
              <h2 className="font-serif text-xl group-hover:text-gold transition-colors">{product.name}</h2>
              <div className="flex items-center gap-4 mt-2">
                <span className="font-mono text-xs text-muted-foreground">PKR {product.basePrice.toLocaleString()}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
