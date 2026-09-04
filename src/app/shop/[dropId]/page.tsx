import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductShowcase from "@/components/ProductShowcase";
import { getLiveSiteContent } from "@/lib/cms";
import { notFound } from "next/navigation";

export default async function DropPage({ params }: { params: { dropId: string } }) {
  const config = await getLiveSiteContent();
  const drop = config.drops.find(d => d.id === params.dropId);

  if (!drop) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-accent selection:text-background flex flex-col">
      <Navbar />

      <main className="flex-grow w-full relative">
        <ProductShowcase initialDropId={params.dropId} hideSwitcher={true} />
      </main>

      <Footer />
    </div>
  );
}
