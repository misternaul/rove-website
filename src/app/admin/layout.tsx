import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, LogOut } from "lucide-react";

export const metadata = {
  title: "ROVE Admin Dashboard",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Check if user is logged in and is an ADMIN
  if (!session) {
    redirect("/login");
  }

  if ((session.user as any).role !== "ADMIN") {
    redirect("/account");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-sans text-foreground">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-card border-r border-border md:min-h-screen p-6 flex flex-col gap-8">
        <div>
          <Link href="/admin" className="font-serif tracking-widest text-xl uppercase">
            ROVE<span className="text-gold">Admin</span>
          </Link>
          <p className="text-[10px] font-mono text-muted-foreground mt-1 uppercase tracking-widest">
            Control Panel
          </p>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-xs font-mono uppercase tracking-widest text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-all">
            <LayoutDashboard className="w-4 h-4 text-gold" /> Dashboard
          </Link>
        </nav>

        <div className="pt-6 border-t border-border">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">
            <LogOut className="w-4 h-4" /> Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
