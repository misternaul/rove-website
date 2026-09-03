import React from "react";
import { prisma } from "@/lib/prisma";
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
  const [products, lookbookImages] = await Promise.all([
    prisma.product.findMany({
      where: { showOnHomepage: true },
      include: { images: true, variants: true },
      orderBy: { orderIndex: 'asc' }
    }),
    prisma.lookbookImage.findMany({
      where: { showOnHomepage: true },
      orderBy: { createdAt: 'desc' }
    })
  ]);

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
