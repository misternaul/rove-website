import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Community Poll...");
  
  // Clear existing to avoid duplicates if run multiple times
  await prisma.poll.deleteMany({});
  
  const poll = await prisma.poll.create({
    data: {
      question: "Which colorway should we prototype for Drop 002?",
      isActive: true,
      options: {
        create: [
          { text: "Arctic White" },
          { text: "Midnight Navy" },
          { text: "Olive Drab" },
          { text: "Charcoal Grey" }
        ]
      }
    }
  });
  
  console.log("Created poll:", poll.id);
  console.log("Seeding done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
