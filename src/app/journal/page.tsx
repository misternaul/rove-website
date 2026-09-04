import React from "react";


import { getLiveSiteContent } from "@/lib/cms";
import Link from "next/link";
import Image from "next/image";

export default async function JournalPage() {
  const config = await getLiveSiteContent();
  const posts = config.journal?.posts || [];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-accent selection:text-background flex flex-col">
      

      <main className="flex-grow w-full relative pt-32 pb-24 max-w-4xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-accent block mb-3">
            {config.journal?.badge || "ROVE Journal"}
          </span>
          <h1 className="text-4xl md:text-5xl font-light font-serif tracking-tight mb-4">
            {config.journal?.title || "Design Philosophy & Studio Notes"}
          </h1>
          <div className="w-16 h-[1px] bg-accent mx-auto my-6" />
        </div>

        <div className="space-y-16">
          {posts.map((post) => (
            <Link key={post.slug} href={`/journal/${post.slug}`} className="group block">
              <article className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border border-border-subtle bg-matte p-6 shadow-md transition-all hover:border-accent">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={post.coverImage || "/images/placeholder.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-[10px] font-mono tracking-widest text-accent uppercase mb-3 block">
                    {post.date}
                  </span>
                  <h2 className="text-2xl font-serif font-light tracking-wide mb-4 group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-foreground/70 leading-relaxed mb-6 line-clamp-3">
                    {post.seoDescription}
                  </p>
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-foreground border-b border-foreground/30 self-start pb-1 group-hover:border-accent group-hover:text-accent transition-all">
                    Read Article
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </main>

      
    </div>
  );
}
