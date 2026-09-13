"use client";

import React, { useEffect, useState } from "react";
import { Package, MapPin, Phone, Mail, Clock, RefreshCw, Printer, AlertTriangle } from "lucide-react";

interface Order {
  orderId: string;
  timestamp: string;
  status?: string;
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
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [printingId, setPrintingId] = useState<string | null>(null);

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

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    if (newStatus === "canceled") {
      if (!confirm("Are you sure you want to cancel this order? This will restock the inventory automatically.")) {
        return;
      }
    }
    
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_status",
          orderId,
          newStatus,
          adminSecret: adminPin
        })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o));
      } else {
        alert("Failed to update order: " + data.error);
      }
    } catch (e) {
      alert("Network error updating status.");
    }
    setUpdatingId(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "text-blue-400 border-blue-900/50 bg-blue-950/20";
      case "delivering": return "text-orange-400 border-orange-900/50 bg-orange-950/20";
      case "delivered": return "text-green-400 border-green-900/50 bg-green-950/20";
      case "canceled": return "text-red-400 border-red-900/50 bg-red-950/20 line-through opacity-70";
      default: return "text-yellow-400 border-yellow-900/50 bg-yellow-950/20"; // pending
    }
  };

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
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden; }
          .print-active, .print-active * { visibility: visible !important; }
          .print-active {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 40px;
            box-sizing: border-box;
          }
          .no-print { display: none !important; }
          .print-logo { color: black !important; border-bottom: 2px solid black; padding-bottom: 20px; margin-bottom: 20px; font-weight: bold; font-size: 24px;}
          .print-border { border: 1px solid #ccc !important; }
        }
      `}} />

      <div className="flex items-center justify-between no-print">
        <div>
          <h2 className="text-2xl font-serif text-white">Orders Database</h2>
          <p className="text-sm text-white/60 mt-1">Live feed of all customer purchases.</p>
        </div>
        <button onClick={fetchOrders} className="px-4 py-2 border border-white/10 hover:bg-white/5 text-xs font-mono uppercase tracking-widest flex items-center gap-2 transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="p-12 text-center border border-white/10 bg-[#141414] no-print">
          <Package className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/50 font-mono text-sm uppercase tracking-widest">No orders found yet</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order, idx) => {
            const currentStatus = order.status || "pending";
            return (
            <div key={idx} className={`bg-[#141414] border border-white/10 p-6 flex flex-col md:flex-row gap-8 relative overflow-hidden ${printingId === order.orderId ? "print-active" : "no-print"}`}>
              
              {/* PRINT ONLY HEADER */}
              <div className="hidden print:block print-logo font-serif w-full text-center">
                ROVE STUDIO - OFFICIAL INVOICE
              </div>

              {/* Order Info */}
              <div className="flex-1 space-y-4 print:w-full">
                <div className="flex items-center justify-between border-b border-white/10 print:border-black/20 pb-4">
                  <div>
                    <span className="text-[#D4AF37] print:text-black font-mono font-bold text-lg">Order #{order.orderId}</span>
                    <div className="text-xs text-white/50 print:text-black/70 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" /> {order.timestamp}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl text-white print:text-black font-serif font-bold">{order.formattedTotalPrice}</div>
                    <div className="text-xs text-white/50 print:text-black/70 font-mono">{order.totalQuantity} Items (COD)</div>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  <h4 className="text-[10px] uppercase font-mono tracking-widest text-white/40 print:text-black">Purchased Items</h4>
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 text-sm font-mono bg-black/40 print:bg-transparent p-3 border border-white/5 print:border-black/20 print-border">
                      <img src={item.image} alt="product" className="w-10 h-10 object-cover rounded print:hidden" />
                      <div className="flex-1">
                        <div className="text-white print:text-black font-bold">{item.dropName}</div>
                        <div className="text-white/60 print:text-black/80 text-xs">{item.colorName} - Size: {item.sizeName}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white/40 print:text-black/80 text-xs">Qty: {item.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions (Hidden in Print) */}
                <div className="pt-4 flex items-center gap-4 no-print border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase text-white/40">Status:</span>
                    <select 
                      disabled={updatingId === order.orderId}
                      value={currentStatus}
                      onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                      className={`text-xs font-mono uppercase font-bold px-3 py-1.5 border appearance-none cursor-pointer outline-none ${getStatusColor(currentStatus)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="delivering">Delivering</option>
                      <option value="delivered">Delivered</option>
                      <option value="canceled">Canceled</option>
                    </select>
                    {updatingId === order.orderId && <RefreshCw className="w-3 h-3 animate-spin text-white/50" />}
                  </div>

                  <button 
                    onClick={() => {
                      // Hacky way to print just this section: we add a global class to body that hides other sections
                      // but CSS handles it nicely if we just trigger print. (In reality, a real app might open a new window, but this works well enough with CSS specificity)
                      setPrintingId(order.orderId);
                      setTimeout(() => {
                        window.print();
                        setPrintingId(null);
                      }, 100);
                    }}
                    className="ml-auto px-4 py-1.5 bg-[#D4AF37] hover:bg-white text-black text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
                  >
                    <Printer className="w-3 h-3" /> Export PDF
                  </button>
                </div>

              </div>

              {/* Customer Info */}
              <div className="w-full md:w-72 bg-black/50 print:bg-transparent p-5 border border-white/5 print:border-black/20 print-border space-y-4">
                <h4 className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37] print:text-black">Customer Details</h4>
                
                <div>
                  <div className="text-white print:text-black font-bold text-lg">{order.customer.fullName}</div>
                  <div className="text-white/70 print:text-black/80 text-sm mt-1 flex items-center gap-2">
                    <Phone className="w-3 h-3 text-white/40 print:text-black/50" /> {order.customer.phone}
                  </div>
                  {order.customer.email && (
                    <div className="text-white/70 print:text-black/80 text-sm mt-1 flex items-center gap-2">
                      <Mail className="w-3 h-3 text-white/40 print:text-black/50" /> {order.customer.email}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10 print:border-black/20 text-sm text-white/80 print:text-black space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-white/40 print:text-black/50 shrink-0 mt-0.5" />
                    <div>
                      <div>{order.customer.primaryAddress}</div>
                      {order.customer.secondaryAddress && <div>{order.customer.secondaryAddress}</div>}
                      <div className="text-[#D4AF37] print:text-black font-bold">{order.customer.city}</div>
                      {order.customer.landmark && <div className="text-xs text-white/50 print:text-black/60 italic mt-1">Near: {order.customer.landmark}</div>}
                    </div>
                  </div>
                </div>

                {order.customer.notes && (
                  <div className="pt-4 border-t border-white/10 print:border-black/20">
                    <h4 className="text-[10px] uppercase font-mono tracking-widest text-white/40 print:text-black mb-1">Notes</h4>
                    <p className="text-xs text-white/70 print:text-black italic">{order.customer.notes}</p>
                  </div>
                )}
              </div>

            </div>
          )})}
        </div>
      )}
    </div>
  );
}

