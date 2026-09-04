import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LookbookGallery from "@/components/LookbookGallery";

export default function LookbookPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-accent selection:text-background flex flex-col">
      <Navbar />

      <main className="flex-grow w-full relative pt-24 pb-12">
        <LookbookGallery filterHome={false} />
      </main>

      <Footer />
    </div>
  );
}
