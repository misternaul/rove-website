import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { LogOut, Package, Shield, Settings, Heart } from "lucide-react";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      orders: true,
      savedItems: true,
    }
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white pt-24 pb-20 font-sans">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-10 mb-12 gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-mono block mb-3">
              {user.role === "ROVER" ? "Verified Rover" : "Customer Portal"}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif">Welcome, {user.name?.split(" ")[0] || "User"}</h1>
          </div>
          
          <Link href="/api/auth/signout" className="text-xs uppercase tracking-widest font-mono text-white/50 hover:text-white flex items-center gap-2 transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 space-y-2 font-mono text-xs uppercase tracking-wider">
            <button className="w-full text-left px-4 py-3 bg-white/5 text-white border-l-2 border-[#D4AF37] flex items-center gap-3">
              <Package className="w-4 h-4" /> Order History
            </button>
            <button className="w-full text-left px-4 py-3 text-white/50 hover:bg-white/5 hover:text-white border-l-2 border-transparent transition-all flex items-center gap-3">
              <Heart className="w-4 h-4" /> Saved Items
            </button>
            <button className="w-full text-left px-4 py-3 text-white/50 hover:bg-white/5 hover:text-white border-l-2 border-transparent transition-all flex items-center gap-3">
              <Settings className="w-4 h-4" /> Account Details
            </button>
            
            {user.role === "ADMIN" && (
              <Link href="/admin" className="w-full mt-8 text-left px-4 py-3 text-[#D4AF37] hover:bg-[#D4AF37]/10 border-l-2 border-transparent transition-all flex items-center gap-3">
                <Shield className="w-4 h-4" /> Admin Dashboard
              </Link>
            )}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <h2 className="text-xl font-serif mb-6">Recent Orders</h2>
            
            {user.orders.length === 0 ? (
              <div className="bg-[#141414] border border-white/5 p-12 text-center">
                <p className="text-white/50 text-sm mb-6">You have not placed any orders yet.</p>
                <Link href="/shop" className="px-6 py-3 bg-white text-black text-xs font-mono uppercase tracking-widest hover:bg-gray-200 transition-colors inline-block">
                  Explore Collection
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {user.orders.map(order => (
                  <div key={order.id} className="bg-[#141414] border border-white/10 p-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono text-[#D4AF37] mb-1">{order.orderNumber}</p>
                      <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()} &middot; PKR {order.totalAmount.toLocaleString()}</p>
                    </div>
                    <div className="px-3 py-1 bg-white/5 border border-white/10 text-xs font-mono uppercase text-white/70">
                      {order.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Rover Invitation Section */}
            {user.role === "CUSTOMER" && user.orders.length > 0 && (
              <div className="mt-12 p-8 border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50" />
                <h3 className="text-2xl font-serif text-[#D4AF37] mb-3">Become a Rover</h3>
                <p className="text-sm text-white/80 max-w-lg mx-auto mb-6 leading-relaxed">
                  Your purchase makes you part of something bigger. Join the exclusive ROVE community to share stories, vote on future releases, and access private discussions.
                </p>
                <button className="px-6 py-3 bg-[#D4AF37] text-black text-xs font-mono font-bold uppercase tracking-widest hover:bg-[#c9a633] transition-colors inline-block">
                  Join the Community
                </button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
