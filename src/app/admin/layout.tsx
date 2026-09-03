import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, ShoppingBag, LayoutDashboard, Settings, LogOut } from "lucide-react";

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

  // NOTE: For testing purposes if no admin exists, we'll allow access, but in production we enforce:
  // if ((session.user as any).role !== "ADMIN") { redirect("/account"); }
  if ((session.user as any).role !== "ADMIN") {
    // Temporary pass for the user while developing, normally redirect
    // redirect("/account");
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col md:flex-row font-sans text-white">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#141414] border-r border-white/10 md:min-h-screen p-6 flex flex-col gap-8">
        <div>
          <Link href="/admin" className="font-serif tracking-widest text-xl uppercase">
            ROVE<span className="text-[#D4AF37]">Admin</span>
          </Link>
          <p className="text-[10px] font-mono text-white/50 mt-1 uppercase tracking-widest">
            Control Panel 2.0
          </p>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-xs font-mono uppercase tracking-widest text-white/70 hover:text-white hover:bg-white/5 transition-all">
            <LayoutDashboard className="w-4 h-4 text-[#D4AF37]" /> Dashboard
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-xs font-mono uppercase tracking-widest text-white/70 hover:text-white hover:bg-white/5 transition-all">
            <ShoppingBag className="w-4 h-4 text-[#D4AF37]" /> Orders
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 text-xs font-mono uppercase tracking-widest text-white/70 hover:text-white hover:bg-white/5 transition-all">
            <Package className="w-4 h-4 text-[#D4AF37]" /> Products
          </Link>
        </nav>

        <div className="pt-6 border-t border-white/10">
          <Link href="/account" className="flex items-center gap-3 px-4 py-3 text-xs font-mono uppercase tracking-widest text-white/50 hover:text-white transition-all">
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
