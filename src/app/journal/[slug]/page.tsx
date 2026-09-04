import React from "react";


import { getLiveSiteContent } from "@/lib/cms";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const config = await getLiveSiteContent();
  const post = config.journal?.posts?.find(p => p.slug === resolvedParams.slug);
  
  if (!post) return { title: "Post Not Found" };
  
  return {
    title: `${post.title} | ROVE Journal`,
    description: post.seoDescription,
    openGraph: {
      images: [post.coverImage],
    }
  };
}

export default async function JournalPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const config = await getLiveSiteContent();
  const post = config.journal?.posts?.find(p => p.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-accent selection:text-background flex flex-col">
      

      <main className="flex-grow w-full relative pt-32 pb-24 max-w-3xl mx-auto px-6 md:px-12">
        
        <Link href="/journal" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-foreground/50 hover:text-accent transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to Journal
        </Link>

        <article>
          <header className="mb-12">
            <span className="text-[10px] font-mono tracking-widest text-accent uppercase mb-4 block">
              {post.date}
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-light tracking-tight leading-tight mb-8">
              {post.title}
            </h1>
            <div className="relative w-full aspect-[16/9] overflow-hidden mb-12 border border-border-subtle shadow-xl">
              <Image
                src={post.coverImage || "/images/placeholder.jpg"}
                alt={post.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          </header>

          <div className="prose prose-invert prose-lg max-w-none font-sans font-light leading-relaxed text-foreground/80 whitespace-pre-wrap">
            {post.content}
          </div>
        </article>

      </main>

      
    </div>
  );
}
