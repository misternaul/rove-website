import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Lookbook | ROVE",
  description: "The complete visual archive and lookbook for ROVE Studio's collections and drops."
};

const LOOKBOOK_IMAGES = [
  { src: "/images/lookbook-1.jpg", size: "col-span-12 md:col-span-8", aspect: "aspect-[16/9]" },
  { src: "/images/lookbook-2.jpg", size: "col-span-12 md:col-span-4", aspect: "aspect-[3/4]" },
  { src: "/images/lookbook-3.jpg", size: "col-span-12 md:col-span-4", aspect: "aspect-[3/4]" },
  { src: "/images/lookbook-4.jpg", size: "col-span-12 md:col-span-4", aspect: "aspect-[3/4]" },
  { src: "/images/lookbook-5.jpg", size: "col-span-12 md:col-span-4", aspect: "aspect-[3/4]" },
  { src: "/images/lookbook-6.jpg", size: "col-span-12", aspect: "aspect-[21/9]" },
];

export default function LookbookPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Navbar />
      
      <main className="pt-24 md:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/10 pb-8">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#D4AF37] mb-4 block">Archive 001</span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light tracking-tight">The Lookbook.</h1>
          </div>
          <p className="text-white/60 font-light text-sm md:text-base max-w-md leading-relaxed md:text-right">
            A visual compendium of our latest releases, styled for the modern minimalist. Brutalist architecture meets fluid draping.
          </p>
        </div>

        {/* Masonry-style Grid */}
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-12 gap-4 md:gap-8">
            {LOOKBOOK_IMAGES.map((img, idx) => (
              <div key={idx} className={`${img.size} group relative overflow-hidden bg-[#141414]`}>
                <div className={`relative w-full ${img.aspect}`}>
                  <Image 
                    src={img.src} 
                    alt={`Lookbook Plate ${idx + 1}`} 
                    fill 
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 px-2 py-1 bg-black/80 backdrop-blur-md border border-white/10">
                    <span className="text-[10px] font-mono text-white/50 tracking-widest uppercase">
                      Plate 0{idx + 1}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <Link href="/shop" className="inline-block px-10 py-4 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-mono text-xs uppercase tracking-widest transition-colors">
              Acquire The Looks
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
