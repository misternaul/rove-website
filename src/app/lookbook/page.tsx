import React from "react";


import { getLiveSiteContent } from "@/lib/cms";
import Image from "next/image";

export default async function LookbookPage() {
  const config = await getLiveSiteContent();
  const images = config.gallery?.images || [];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-accent selection:text-background flex flex-col">
      

      <main className="flex-grow w-full relative pt-32 pb-24 max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-accent block mb-3">
            {config.gallery?.badge || "Visual Compendium"}
          </span>
          <h1 className="text-4xl md:text-5xl font-light font-serif tracking-tight mb-4">
            Lookbook
          </h1>
          <div className="w-16 h-[1px] bg-accent mx-auto my-6" />
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {images.map((item, index) => {
            // Give some variety to aspect ratios based on index for a masonry feel
            const isLarge = index % 3 === 0;
            return (
              <div key={index} className="break-inside-avoid relative group overflow-hidden bg-matte shadow-md border border-border-subtle">
                <div className={`relative w-full ${isLarge ? 'aspect-[3/4]' : 'aspect-square'}`}>
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500" />
                  
                  {/* Info Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end text-left">
                    <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-accent mb-2">
                      {item.tag}
                    </span>
                    <h3 className="text-xl font-serif text-white mb-1">{item.title}</h3>
                    <p className="text-xs font-sans text-white/80">{item.caption}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      
    </div>
  );
}
