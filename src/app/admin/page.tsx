import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, Package, ShoppingBag, Users } from "lucide-react";

export default async function AdminDashboard() {
  const [totalOrders, totalProducts, totalUsers] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count(),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-serif font-light mb-2">Dashboard Overview</h1>
        <p className="text-sm font-mono text-white/50 tracking-widest uppercase">Welcome back to the studio control panel</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#141414] border border-white/10 p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center text-[#D4AF37]">
            <ShoppingBag className="w-5 h-5" />
            <span className="text-xs font-mono uppercase tracking-widest">Total Orders</span>
          </div>
          <span className="text-4xl font-serif">{totalOrders}</span>
        </div>
        
        <div className="bg-[#141414] border border-white/10 p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center text-[#D4AF37]">
            <Package className="w-5 h-5" />
            <span className="text-xs font-mono uppercase tracking-widest">Products</span>
          </div>
          <span className="text-4xl font-serif">{totalProducts}</span>
        </div>

        <div className="bg-[#141414] border border-white/10 p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center text-[#D4AF37]">
            <Users className="w-5 h-5" />
            <span className="text-xs font-mono uppercase tracking-widest">Registered Users</span>
          </div>
          <span className="text-4xl font-serif">{totalUsers}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xs font-mono uppercase tracking-widest text-white/50 mb-4 border-b border-white/10 pb-2">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/admin/products" className="bg-[#1A1A1A] hover:bg-[#D4AF37] group transition-all p-6 border border-white/5 flex justify-between items-center">
            <div>
              <h3 className="font-serif text-lg group-hover:text-black">Manage Products & Stock</h3>
              <p className="text-xs font-mono text-white/40 group-hover:text-black/60 uppercase tracking-wider mt-1">Update Prices, Discounts, Inventory</p>
            </div>
            <ArrowRight className="text-[#D4AF37] group-hover:text-black" />
          </Link>

          <Link href="/admin/orders" className="bg-[#1A1A1A] hover:bg-[#D4AF37] group transition-all p-6 border border-white/5 flex justify-between items-center">
            <div>
              <h3 className="font-serif text-lg group-hover:text-black">View Latest Orders</h3>
              <p className="text-xs font-mono text-white/40 group-hover:text-black/60 uppercase tracking-wider mt-1">Process shipments and statuses</p>
            </div>
            <ArrowRight className="text-[#D4AF37] group-hover:text-black" />
          </Link>
        </div>
      </div>
    </div>
  );
}
