"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center gap-3 px-6 py-3 border border-border hover:border-gold text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
    >
      <LogOut className="w-4 h-4" /> End Session
    </button>
  );
}
