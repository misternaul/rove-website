import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";

import ProductShowcase from "@/components/ProductShowcase";
import CraftDetails from "@/components/CraftDetails";
import LookbookGallery from "@/components/LookbookGallery";
import WaitlistSection from "@/components/WaitlistSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-[#D4AF37] selection:text-[#0D0D0D]">
      {/* Editorial Luxury Header & Navigation */}
      <Navbar />

      {/* Main Single-Page Scroll Storytelling Experience */}
      <main className="w-full relative">
        {/* 1. Hero Section — Editorial Framed Gallery & Brand Slogan */}
        <Hero />

        <Manifesto />

        {/* 2. Brand Manifesto — Philosophy & Values Under 80 Words */}
        

        {/* 3. Product Showcase — Interactive Color & Size Selector + Sticky Viewer */}
        <ProductShowcase />

        {/* 4. Craft & Detailing — High-Definition Closeups & Architectural Hallmarks */}
        <CraftDetails />

        {/* 5. Lookbook & Visual Compendium — Smooth Horizontal Scrolling Strip */}
        <LookbookGallery filterHome={true} />

        {/* 6. Priority Waitlist & Allocation Access Flow */}
        <WaitlistSection />
      </main>

      {/* Minimalist Footer */}
      <Footer />
    </div>
  );
}
