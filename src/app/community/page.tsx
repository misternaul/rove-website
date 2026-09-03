import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Lock } from "lucide-react";

export const metadata = { title: "Community | ROVE" };

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-32 pb-20">
        <Lock className="w-12 h-12 text-gold mb-8" />
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-gold mb-6">Restricted Area</span>
        <h1 className="text-4xl md:text-6xl font-serif font-light mb-6 tracking-tight">The Inner Circle.</h1>
        <p className="text-foreground/60 font-light max-w-lg mx-auto mb-10 text-lg">
          An exclusive enclave for verified ROVE clientele. Our private community hub is currently undergoing architectural maintenance and will re-open shortly.
        </p>
        <div className="flex gap-4">
          <Link href="/" className="px-8 py-3 bg-card border border-border hover:border-gold text-foreground font-mono text-xs uppercase tracking-widest transition-colors">
            Return to Studio
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
