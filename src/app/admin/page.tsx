import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, Package, ShoppingBag, Users, BarChart3 } from "lucide-react";
import AnalyticsChart from "./AnalyticsChart";

export default async function AdminDashboard() {
  const [totalOrders, totalProducts, totalUsers, allOrders] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.findMany({ select: { totalAmount: true, createdAt: true }, orderBy: { createdAt: 'asc' } })
  ]);

  const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const aov = allOrders.length > 0 ? Math.round(totalRevenue / allOrders.length) : 0;

  // Group revenue by date for the chart
  const revenueByDate = allOrders.reduce((acc: any, order) => {
    const date = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!acc[date]) acc[date] = 0;
    acc[date] += order.totalAmount;
    return acc;
  }, {});

  const chartData = Object.keys(revenueByDate).map(date => ({
    date,
    revenue: revenueByDate[date]
  }));

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif font-light mb-2">Dashboard Overview</h1>
          <p className="text-sm font-mono text-white/50 tracking-widest uppercase">Welcome back to the studio control panel</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-mono uppercase tracking-widest text-white/50">Total Revenue</p>
          <p className="text-2xl font-serif text-[#D4AF37]">Rs. {totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#141414] border border-white/10 p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center text-[#D4AF37]">
            <ShoppingBag className="w-5 h-5" />
            <span className="text-xs font-mono uppercase tracking-widest">Total Orders</span>
          </div>
          <span className="text-4xl font-serif">{totalOrders}</span>
        </div>
        
        <div className="bg-[#141414] border border-white/10 p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center text-[#D4AF37]">
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs font-mono uppercase tracking-widest">AOV</span>
          </div>
          <span className="text-4xl font-serif">Rs. {aov.toLocaleString()}</span>
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
            <span className="text-xs font-mono uppercase tracking-widest">Users</span>
          </div>
          <span className="text-4xl font-serif">{totalUsers}</span>
        </div>
      </div>

      {/* Revenue Chart */}
      <div>
        <h2 className="text-xs font-mono uppercase tracking-widest text-white/50 mb-4 border-b border-white/10 pb-2">Revenue Growth</h2>
        <AnalyticsChart data={chartData} />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4 border-b border-border pb-2">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/products" className="bg-card hover:bg-gold group transition-all p-6 border border-border flex justify-between items-center">
            <div>
              <h3 className="font-serif text-lg group-hover:text-background">Manage Products & Stock</h3>
              <p className="text-xs font-mono text-muted-foreground group-hover:text-background/80 uppercase tracking-wider mt-1">Update Prices, Discounts</p>
            </div>
            <ArrowRight className="text-gold group-hover:text-background" />
          </Link>

          <Link href="/admin/orders" className="bg-card hover:bg-gold group transition-all p-6 border border-border flex justify-between items-center">
            <div>
              <h3 className="font-serif text-lg group-hover:text-background">View Latest Orders</h3>
              <p className="text-xs font-mono text-muted-foreground group-hover:text-background/80 uppercase tracking-wider mt-1">Process shipments</p>
            </div>
            <ArrowRight className="text-gold group-hover:text-background" />
          </Link>

          <Link href="/admin/lookbook" className="bg-card hover:bg-gold group transition-all p-6 border border-border flex justify-between items-center">
            <div>
              <h3 className="font-serif text-lg group-hover:text-background">Lookbook Magazine</h3>
              <p className="text-xs font-mono text-muted-foreground group-hover:text-background/80 uppercase tracking-wider mt-1">Upload editorial images</p>
            </div>
            <ArrowRight className="text-gold group-hover:text-background" />
          </Link>
        </div>
      </div>
    </div>
  );
}
