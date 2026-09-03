import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding ROVE Database...");

  // 1. Create the initial Drop 001 Product
  const polo = await prisma.product.upsert({
    where: { slug: 'horizon-polo' },
    update: {},
    create: {
      name: 'Rove Horizon Polo',
      slug: 'horizon-polo',
      shortDescription: 'The Premium Minimalist Polo',
      description: 'The Rove Horizon Polo redefines the classic silhouette. Designed for the modern man, it offers an athletic yet tailored fit, utilizing premium stretch-cotton that breathes and moves with you. Less noise. More presence.',
      isFeatured: true,
      showOnHomepage: true,
      basePrice: 2299,
      isDiscountActive: false,
      images: {
        create: [
          { url: '/images/editorial-rocks.png', isPrimary: true },
          { url: '/images/editorial-chair.jpg', isPrimary: false },
          { url: '/images/editorial-window.jpg', isPrimary: false },
        ]
      },
      variants: {
        create: [
          // Jet Black
          { colorName: 'Jet Black', colorHex: '#0D0D0D', size: 'S', sku: 'POLO-BLK-S', stock: 50 },
          { colorName: 'Jet Black', colorHex: '#0D0D0D', size: 'M', sku: 'POLO-BLK-M', stock: 100 },
          { colorName: 'Jet Black', colorHex: '#0D0D0D', size: 'L', sku: 'POLO-BLK-L', stock: 75 },
          { colorName: 'Jet Black', colorHex: '#0D0D0D', size: 'XL', sku: 'POLO-BLK-XL', stock: 20 },
          // Oxford Navy
          { colorName: 'Oxford Navy', colorHex: '#1A233A', size: 'S', sku: 'POLO-NVY-S', stock: 30 },
          { colorName: 'Oxford Navy', colorHex: '#1A233A', size: 'M', sku: 'POLO-NVY-M', stock: 60 },
          { colorName: 'Oxford Navy', colorHex: '#1A233A', size: 'L', sku: 'POLO-NVY-L', stock: 45 },
          { colorName: 'Oxford Navy', colorHex: '#1A233A', size: 'XL', sku: 'POLO-NVY-XL', stock: 15 },
          // Arctic White
          { colorName: 'Arctic White', colorHex: '#F0F0F0', size: 'S', sku: 'POLO-WHT-S', stock: 40 },
          { colorName: 'Arctic White', colorHex: '#F0F0F0', size: 'M', sku: 'POLO-WHT-M', stock: 80 },
          { colorName: 'Arctic White', colorHex: '#F0F0F0', size: 'L', sku: 'POLO-WHT-L', stock: 60 },
          { colorName: 'Arctic White', colorHex: '#F0F0F0', size: 'XL', sku: 'POLO-WHT-XL', stock: 25 },
        ]
      }
    }
  });

  console.log(`Created product: ${polo.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
