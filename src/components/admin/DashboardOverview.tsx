import React, { useState, useEffect } from "react";
import { Package, TrendingUp, DollarSign, Box, Clock, Truck, CheckCircle, XCircle } from "lucide-react";
import { SiteConfig } from "@/config/siteContent";

export default function DashboardOverview({ config, adminPin }: { config: SiteConfig; adminPin: string }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [adminPin]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/orders?adminSecret=${adminPin}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch orders for dashboard:", err);
    }
    setIsLoading(false);
  };

  // Calculate Metrics
  const activeOrders = orders.filter((o) => o.status !== "canceled");
  
  const totalRevenue = activeOrders.reduce((sum, order) => {
    const numericStr = order.formattedTotalPrice?.replace(/\D/g, "") || "0";
    return sum + parseInt(numericStr, 10);
  }, 0);

  const totalProductsSold = activeOrders.reduce((sum, order) => sum + (order.totalQuantity || 0), 0);

  let totalAvailableInventory = 0;
  config.drops?.forEach((drop) => {
    drop.colors?.forEach((color) => {
      color.sizes?.forEach((size) => {
        totalAvailableInventory += size.stockQuantity || 0;
      });
    });
  });

  const pipeline = {
    pending: orders.filter((o) => o.status === "pending" || !o.status).length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    delivering: orders.filter((o) => o.status === "delivering").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    canceled: orders.filter((o) => o.status === "canceled").length,
  };

  if (isLoading) {
    return <div className="text-white/50 text-sm font-mono animate-pulse">Loading Analytics...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] block mb-1 font-mono">
          Executive Summary
        </span>
        <h2 className="text-3xl font-serif text-white">Business Analytics</h2>
        <p className="text-sm text-white/60 mt-2">
          High-level overview of sales performance, inventory health, and order fulfillment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1: Revenue */}
        <div className="bg-[#141414] border border-white/10 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/70 text-xs font-mono uppercase tracking-widest">Total Valuation</h3>
            <DollarSign className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div className="text-3xl font-serif text-white">PKR {totalRevenue.toLocaleString()}</div>
          <div className="text-[10px] text-white/40 font-mono mt-2 uppercase">Excludes canceled orders</div>
        </div>

        {/* Metric 2: Products Sold */}
        <div className="bg-[#141414] border border-white/10 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/70 text-xs font-mono uppercase tracking-widest">Units Sold</h3>
            <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div className="text-3xl font-serif text-white">{totalProductsSold}</div>
          <div className="text-[10px] text-white/40 font-mono mt-2 uppercase">Across {activeOrders.length} orders</div>
        </div>

        {/* Metric 3: Available Inventory */}
        <div className="bg-[#141414] border border-white/10 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/70 text-xs font-mono uppercase tracking-widest">Available Stock</h3>
            <Box className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div className="text-3xl font-serif text-white">{totalAvailableInventory}</div>
          <div className="text-[10px] text-white/40 font-mono mt-2 uppercase">Ready to ship units</div>
        </div>

        {/* Metric 4: Total Orders */}
        <div className="bg-[#141414] border border-white/10 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/70 text-xs font-mono uppercase tracking-widest">Total Orders</h3>
            <Package className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div className="text-3xl font-serif text-white">{orders.length}</div>
          <div className="text-[10px] text-white/40 font-mono mt-2 uppercase">Lifetime order count</div>
        </div>
      </div>

      {/* Order Pipeline */}
      <div className="bg-[#141414] border border-white/10 p-8">
        <h3 className="text-white text-lg font-serif mb-6">Fulfillment Pipeline</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="border border-white/5 bg-[#0D0D0D] p-4 text-center">
            <Clock className="w-6 h-6 text-yellow-500 mx-auto mb-3" />
            <div className="text-2xl font-serif text-white">{pipeline.pending}</div>
            <div className="text-[10px] uppercase font-mono text-white/50 mt-1">Pending</div>
          </div>
          <div className="border border-white/5 bg-[#0D0D0D] p-4 text-center">
            <CheckCircle className="w-6 h-6 text-blue-500 mx-auto mb-3" />
            <div className="text-2xl font-serif text-white">{pipeline.confirmed}</div>
            <div className="text-[10px] uppercase font-mono text-white/50 mt-1">Confirmed</div>
          </div>
          <div className="border border-white/5 bg-[#0D0D0D] p-4 text-center">
            <Truck className="w-6 h-6 text-orange-500 mx-auto mb-3" />
            <div className="text-2xl font-serif text-white">{pipeline.delivering}</div>
            <div className="text-[10px] uppercase font-mono text-white/50 mt-1">Delivering</div>
          </div>
          <div className="border border-white/5 bg-[#0D0D0D] p-4 text-center">
            <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-3" />
            <div className="text-2xl font-serif text-white">{pipeline.delivered}</div>
            <div className="text-[10px] uppercase font-mono text-white/50 mt-1">Delivered</div>
          </div>
          <div className="border border-white/5 bg-[#0D0D0D] p-4 text-center">
            <XCircle className="w-6 h-6 text-red-500 mx-auto mb-3" />
            <div className="text-2xl font-serif text-white">{pipeline.canceled}</div>
            <div className="text-[10px] uppercase font-mono text-white/50 mt-1">Canceled</div>
          </div>
        </div>
      </div>
    </div>
  );
}
