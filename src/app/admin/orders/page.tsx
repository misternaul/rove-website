import { prisma } from "@/lib/prisma";
import { Search } from "lucide-react";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          variant: {
            include: { product: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center pb-6 border-b border-white/10 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-light mb-1">Orders</h1>
          <p className="text-xs font-mono text-white/50 tracking-widest uppercase">Fulfillment & Operations</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input 
            type="text" 
            placeholder="SEARCH ORDERS..." 
            className="w-full md:w-64 bg-[#141414] border border-white/20 pl-10 pr-4 py-3 text-xs font-mono text-white focus:border-[#D4AF37] outline-none transition-colors"
          />
        </div>
      </div>

      <div className="bg-[#141414] border border-white/10 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[10px] font-mono text-white/50 uppercase tracking-widest bg-black/50">
              <th className="p-4 font-normal">Order ID / Date</th>
              <th className="p-4 font-normal">Customer</th>
              <th className="p-4 font-normal">Items</th>
              <th className="p-4 font-normal">Status</th>
              <th className="p-4 font-normal text-right">Valuation</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                <td className="p-4">
                  <div className="font-mono text-[#D4AF37] font-bold text-xs">{order.orderNumber}</div>
                  <div className="text-[10px] font-mono text-white/40 mt-1">{new Date(order.createdAt).toLocaleDateString()}</div>
                </td>
                <td className="p-4">
                  <div className="font-sans text-sm text-white">{order.fullName}</div>
                  <div className="text-[10px] font-mono text-white/40 mt-1">{order.city}</div>
                </td>
                <td className="p-4">
                  <div className="text-xs font-mono text-white/70">
                    {order.items.length} items
                  </div>
                  <div className="text-[9px] font-mono text-white/30 mt-1 line-clamp-1">
                    {order.items.map(i => `${i.variant.product.name} (${i.variant.size})`).join(', ')}
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 text-[9px] font-mono uppercase tracking-wider bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-right font-mono text-xs text-white">
                  PKR {order.totalAmount.toLocaleString()}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-white/50 font-mono text-xs">No orders placed yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
