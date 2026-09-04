import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CraftDetails from "@/components/CraftDetails";

export default function CraftsmanshipPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-accent selection:text-background flex flex-col">
      <Navbar />

      <main className="flex-grow w-full relative pt-24 pb-12">
        <CraftDetails />
      </main>

      <Footer />
    </div>
  );
}
