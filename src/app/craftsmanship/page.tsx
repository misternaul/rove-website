import React from "react";


import CraftDetails from "@/components/CraftDetails";

export default function CraftsmanshipPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-accent selection:text-background flex flex-col">
      

      <main className="flex-grow w-full relative pt-24 pb-12">
        <CraftDetails />
      </main>

      
    </div>
  );
}
