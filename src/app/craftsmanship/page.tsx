import Image from "next/image";
import Link from "next/link";
import { siteContent } from "@/config/siteContent";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Craftsmanship | ROVE",
  description: "Discover the architectural precision, materials, and obsession behind every ROVE garment. The Studio Series 001 approach to luxury minimalism."
};

export default function CraftsmanshipPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Navbar />
      
      <main className="pt-24 md:pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 md:px-12 mb-16 text-center">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#D4AF37] mb-6 block">Our Philosophy</span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light mb-8 tracking-tight">The Art of Craft.</h1>
          <p className="text-white/60 font-light text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Every ROVE garment is an architectural endeavor. We don't just design clothing; we engineer silhouettes that stand the test of time.
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative w-full h-[60vh] md:h-[80vh] mb-20 bg-[#141414]">
          <Image 
            src="/images/craft-1.jpg" 
            alt="ROVE Craftsmanship Details" 
            fill 
            className="object-cover opacity-80"
          />
        </div>

        {/* Content Blocks */}
        <div className="max-w-3xl mx-auto px-6 md:px-12 space-y-24">
          
          <div className="space-y-6">
            <h2 className="text-2xl md:text-4xl font-serif text-[#D4AF37]">01. The Fabric Foundation</h2>
            <p className="text-white/80 font-light leading-relaxed text-lg">
              The soul of our garments begins at the loom. We source premium, heavyweight cotton blends that offer structural integrity while maintaining absolute breathability. The fabric undergoes a proprietary softening process that ensures a luxurious drape from the first wear.
            </p>
            <p className="text-white/80 font-light leading-relaxed text-lg">
              We reject the industry standard of artificial stiffeners. Instead, our weight and texture are achieved purely through high-density knitting techniques, guaranteeing the garment retains its shape across years of rotation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative aspect-square">
              <Image src="/images/craft-2.jpg" alt="Detail 1" fill className="object-cover" />
            </div>
            <div className="relative aspect-[4/5] md:mt-12">
              <Image src="/images/craft-3.jpg" alt="Detail 2" fill className="object-cover" />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl md:text-4xl font-serif text-[#D4AF37]">02. Micro-Level Precision</h2>
            <p className="text-white/80 font-light leading-relaxed text-lg">
              A minimalist aesthetic requires maximalist attention to detail. Every seam, stitch, and hem is calibrated. We utilize reinforced blind-stitching on stress points to ensure our silhouettes remain crisp and unbroken.
            </p>
            <p className="text-white/80 font-light leading-relaxed text-lg">
              The signature ROVE collar, for example, is constructed using a multi-layered fusing process. This ensures it stands perfectly under a blazer, or lies elegantly open, never losing its architectural curve.
            </p>
          </div>

          <div className="p-12 bg-[#141414] border border-white/10 text-center">
            <p className="font-serif text-2xl md:text-3xl italic text-[#D4AF37] mb-6 leading-relaxed">
              "True luxury is found in the details that only the wearer notices."
            </p>
            <Link href="/shop" className="inline-block px-8 py-3 bg-white text-black font-mono text-xs uppercase tracking-widest font-bold hover:bg-[#D4AF37] transition-colors">
              Explore The Collection
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
