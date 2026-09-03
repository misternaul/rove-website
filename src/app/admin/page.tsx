import Link from "next/link";
import { Settings, FileText, LayoutTemplate } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif font-light mb-2">Studio Control Panel</h1>
          <p className="text-sm font-mono text-muted-foreground tracking-widest uppercase">System running in high-performance static mode</p>
        </div>
      </div>

      <div className="bg-card border border-border p-8">
        <h2 className="text-xl font-serif mb-4">Static Architecture Active</h2>
        <p className="text-muted-foreground mb-6 font-light max-w-2xl">
          The database has been intentionally removed per your request. ROVE Studio is now running on a lightning-fast static architecture using <code className="bg-background px-2 py-1 text-gold font-mono text-xs">src/config/siteContent.ts</code>. 
        </p>
        <p className="text-muted-foreground font-light max-w-2xl">
          To update products, prices, lookbook images, or inventory, simply edit the <code className="bg-background px-2 py-1 text-gold font-mono text-xs">siteContent.ts</code> file in your codebase. Changes will be reflected instantly upon push to Vercel.
        </p>
      </div>

      <div>
        <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4 border-b border-border pb-2">Configuration Files</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-background p-6 border border-border flex justify-between items-center group">
            <div>
              <h3 className="font-serif text-lg text-foreground">Content & Inventory</h3>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mt-1">src/config/siteContent.ts</p>
            </div>
            <FileText className="text-gold" />
          </div>

          <div className="bg-background p-6 border border-border flex justify-between items-center group">
            <div>
              <h3 className="font-serif text-lg text-foreground">Email Notifications</h3>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mt-1">src/app/api/order/route.ts</p>
            </div>
            <Settings className="text-gold" />
          </div>
        </div>
      </div>
    </div>
  );
}
