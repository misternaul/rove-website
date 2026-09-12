"use client";

import React, { useEffect, useState } from "react";
import { Package, MapPin, Phone, Mail, Clock, RefreshCw } from "lucide-react";

interface Order {
  orderId: string;
  timestamp: string;
  customer: {
    fullName: string;
    phone: string;
    email: string;
    city: string;
    primaryAddress: string;
    secondaryAddress?: string;
    landmark?: string;
    notes?: string;
  };
  items: any[];
  totalQuantity: number;
  formattedTotalPrice: string;
}

export default function OrdersView({ adminPin }: { adminPin: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?adminSecret=${adminPin}`);
      const data = await res.json();
      if (data.success && data.data) {
        setOrders(data.data.map((item: string | object) => typeof item === "string" ? JSON.parse(item) : item));
      } else {
        setError(data.error || "Failed to fetch orders.");
      }
    } catch (err) {
      setError("Network error fetching orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [adminPin]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#D4AF37]">
        <RefreshCw className="w-8 h-8 animate-spin mb-4" />
        <p className="font-mono text-xs uppercase tracking-widest text-white/50">Syncing Orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-950/20 border border-red-900/50 p-6">
        <p className="text-red-400 font-mono text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif text-white">Orders Database</h2>
          <p className="text-sm text-white/60 mt-1">Live feed of all customer purchases.</p>
        </div>
        <button onClick={fetchOrders} className="px-4 py-2 border border-white/10 hover:bg-white/5 text-xs font-mono uppercase tracking-widest flex items-center gap-2 transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="p-12 text-center border border-white/10 bg-[#141414]">
          <Package className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/50 font-mono text-sm uppercase tracking-widest">No orders found yet</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order, idx) => (
            <div key={idx} className="bg-[#141414] border border-white/10 p-6 flex flex-col md:flex-row gap-8">
              
              {/* Order Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[#D4AF37] font-mono font-bold">{order.orderId}</span>
                    <div className="text-xs text-white/50 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" /> {order.timestamp}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg text-white font-serif">{order.formattedTotalPrice}</div>
                    <div className="text-xs text-white/50 font-mono">{order.totalQuantity} Items (COD)</div>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  <h4 className="text-[10px] uppercase font-mono tracking-widest text-white/40">Purchased Items</h4>
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 text-sm font-mono bg-black/40 p-3 border border-white/5">
                      <img src={item.image} alt="product" className="w-10 h-10 object-cover rounded" />
                      <div className="flex-1">
                        <div className="text-white">{item.dropName}</div>
                        <div className="text-white/60 text-xs">{item.colorName} - Size: {item.sizeName}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white/40 text-xs">Qty: {item.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div className="w-full md:w-72 bg-black/50 p-5 border border-white/5 space-y-4">
                <h4 className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37]">Customer Details</h4>
                
                <div>
                  <div className="text-white font-bold">{order.customer.fullName}</div>
                  <div className="text-white/70 text-sm mt-1 flex items-center gap-2">
                    <Phone className="w-3 h-3 text-white/40" /> {order.customer.phone}
                  </div>
                  {order.customer.email && (
                    <div className="text-white/70 text-sm mt-1 flex items-center gap-2">
                      <Mail className="w-3 h-3 text-white/40" /> {order.customer.email}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10 text-sm text-white/80 space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                    <div>
                      <div>{order.customer.primaryAddress}</div>
                      {order.customer.secondaryAddress && <div>{order.customer.secondaryAddress}</div>}
                      <div className="text-[#D4AF37]">{order.customer.city}</div>
                    </div>
                  </div>
                </div>

                {order.customer.notes && (
                  <div className="pt-4 border-t border-white/10">
                    <h4 className="text-[10px] uppercase font-mono tracking-widest text-white/40 mb-1">Notes</h4>
                    <p className="text-xs text-white/70 italic">{order.customer.notes}</p>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
