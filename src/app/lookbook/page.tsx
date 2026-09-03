import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getLiveSiteContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Lookbook | ROVE",
  description: "The complete visual archive and lookbook for ROVE Studio's collections and drops."
};

export default async function LookbookPage() {
  const content = await getLiveSiteContent();
  const images = content.gallery.images.map((img, idx) => ({
    id: `static-lookbook-${idx}`,
    url: img.src,
    caption: img.caption || img.title || `Plate 0${idx + 1}`
  }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="pt-24 md:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 flex flex-col md:flex-row justify-between items-end gap-8 border-b border-border pb-8">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-gold mb-4 block">Editorial Archive</span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light tracking-tight">The Magazine.</h1>
          </div>
          <p className="text-muted-foreground font-light text-sm md:text-base max-w-md leading-relaxed md:text-right">
            A visual compendium of our latest releases, styled for the modern minimalist. Brutalist architecture meets fluid draping.
          </p>
        </div>

        {/* Masonry-style Grid */}
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-12 gap-4 md:gap-8">
            {images.map((img, idx) => {
              // Create an editorial masonry layout pattern
              const isLarge = idx % 6 === 0;
              const isWide = idx % 6 === 5;
              const sizeClass = isLarge ? "col-span-12 md:col-span-8" : isWide ? "col-span-12" : "col-span-12 md:col-span-4";
              const aspectClass = isLarge ? "aspect-[16/9]" : isWide ? "aspect-[21/9]" : "aspect-[3/4]";

              return (
                <div key={img.id} className={`${sizeClass} group relative overflow-hidden bg-card border border-border hover:border-gold transition-colors duration-500`}>
                  <div className={`relative w-full ${aspectClass}`}>
                    <Image 
                      src={img.url} 
                      alt={img.caption || `Lookbook Plate ${idx + 1}`} 
                      fill 
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 px-2 py-1 bg-background/80 backdrop-blur-md border border-border">
                      <span className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
                        {img.caption || `Plate 0${idx + 1}`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {images.length === 0 && (
              <div className="col-span-12 py-32 text-center text-muted-foreground font-mono uppercase tracking-widest text-sm border border-dashed border-border">
                Archive is empty.
              </div>
            )}
          </div>

          <div className="mt-20 text-center">
            <Link href="/shop" className="inline-block px-10 py-4 border border-gold text-gold hover:bg-gold hover:text-background font-mono text-xs uppercase tracking-widest transition-colors">
              Acquire The Looks
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
