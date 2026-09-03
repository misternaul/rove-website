import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "The Journal | ROVE",
  description: "Editorial articles, style guides, and thoughts on minimalist living."
};

export default async function JournalPage() {
  const articles = await prisma.article.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Navbar />
      
      <main className="pt-24 md:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 border-b border-white/10 pb-8">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#D4AF37] mb-4 block">Editorial</span>
          <h1 className="text-4xl md:text-6xl font-serif font-light tracking-tight">The Journal.</h1>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link key={article.id} href={`/journal/${article.slug}`} className="group block">
                  <div className="relative w-full aspect-[4/3] bg-[#141414] mb-6 overflow-hidden border border-white/10 group-hover:border-[#D4AF37]/50 transition-colors">
                    {article.featuredImage && (
                      <Image 
                        src={article.featuredImage} 
                        alt={article.title} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest">{article.category || "Editorial"}</span>
                    <span className="text-[10px] font-mono text-white/30 tracking-widest">
                      {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-serif text-white group-hover:text-[#D4AF37] transition-colors mb-3 line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-sm font-light text-white/60 font-sans line-clamp-3">
                    {article.introduction}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-white/50 font-mono text-xs uppercase tracking-widest">No articles published yet.</p>
              <p className="text-white/30 font-serif italic mt-4">Return soon for our first editorial piece.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
