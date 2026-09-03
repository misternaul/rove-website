import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LogOut, Package, User as UserIcon } from "lucide-react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export const metadata = { title: "My Account | ROVE" };

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-32">
        <Navbar />
        <div className="max-w-md mx-auto px-6 text-center">
          <h1 className="text-3xl font-serif mb-4">Please Log In</h1>
          <Link href="/login" className="px-8 py-3 bg-card border border-border inline-block">
            Login
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20 max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="mb-12 border-b border-border pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-gold mb-4 block">
              Client Profile
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-light tracking-tight">
              Welcome, {session.user.name || 'Client'}.
            </h1>
          </div>
          <LogoutButton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 bg-card border border-border p-6 h-fit space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-background border border-gold flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="font-serif text-lg">{session.user.name}</p>
                <p className="text-xs font-mono text-muted-foreground">{session.user.email}</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-8">
            <h2 className="text-xl font-serif border-b border-border pb-4">Recent Allocations</h2>
            <div className="bg-card border border-border p-12 flex flex-col items-center justify-center text-center">
              <Package className="w-8 h-8 text-muted-foreground mb-4 opacity-50" />
              <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground mb-2">Order History Archived</p>
              <p className="text-sm font-light text-muted-foreground max-w-sm">
                Your past orders are maintained securely in our internal studio records. For updates on recent allocations, please check your email.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
