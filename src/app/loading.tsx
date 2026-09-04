import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background text-foreground">
      <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin mb-4" />
      <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-foreground/50 animate-pulse">
        Loading...
      </span>
    </div>
  );
}
