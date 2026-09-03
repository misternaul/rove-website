import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductEditor from "./ProductEditor";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: id },
    include: {
      variants: {
        orderBy: [{ colorName: 'asc' }, { size: 'asc' }]
      }
    }
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-serif font-light mb-1">Edit Product</h1>
        <p className="text-xs font-mono text-white/50 tracking-widest uppercase">{product.name}</p>
      </div>

      <ProductEditor product={product} variants={product.variants} />
    </div>
  );
}
