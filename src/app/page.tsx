import React from "react";
import { getLiveSiteContent } from "@/lib/cms";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import ProductShowcase from "@/components/ProductShowcase";
import CraftDetails from "@/components/CraftDetails";
import LookbookGallery from "@/components/LookbookGallery";
import WaitlistSection from "@/components/WaitlistSection";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getLiveSiteContent();
  
  // Transform static drops into the format expected by ProductShowcase
  const products = content.drops.flatMap(drop => 
    drop.colors.map((color) => ({
      id: `${drop.id}-${color.id}`,
      name: `${drop.name} - ${color.name}`,
      shortDescription: drop.shortDescription,
      basePrice: color.priceNumeric,
      images: [
        { id: `${color.id}-img-1`, url: color.frontImage, isPrimary: true },
        { id: `${color.id}-img-2`, url: color.backImage, isPrimary: false }
      ],
      variants: color.sizes.map(s => ({
        id: s.id,
        size: s.name,
        stock: s.stockQuantity
      }))
    }))
  );

  const lookbookImages = content.gallery.images.map((img, idx) => ({
    id: `static-lookbook-${idx}`,
    url: img.src,
    caption: img.caption || img.title || `Plate 0${idx + 1}`
  }));

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Editorial Luxury Header & Navigation */}
      <Navbar />

      {/* Main Single-Page Scroll Storytelling Experience */}
      <main className="w-full relative">
        {/* 1. Hero Section — Editorial Framed Gallery & Brand Slogan */}
        <Hero />

        {/* 2. Brand Manifesto — Philosophy & Values Under 80 Words */}
        <Manifesto />

        {/* 3. Product Showcase — E-Commerce Engine */}
        <ProductShowcase initialProducts={products} />

        {/* 4. Craft & Detailing — High-Definition Closeups & Architectural Hallmarks */}
        <CraftDetails />

        {/* 5. Lookbook & Visual Compendium — Smooth Horizontal Scrolling Strip */}
        <LookbookGallery images={lookbookImages} />

        {/* 6. Priority Waitlist & Allocation Access Flow */}
        <WaitlistSection />
      </main>

      {/* Minimalist Footer */}
      <Footer />
    </div>
  );
}
