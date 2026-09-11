import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearData() {
  console.log('Clearing database dynamic content...');

  await prisma.activityLog.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  console.log('✅ Database dynamic tables (Products, Orders, Payouts, ActivityLogs) cleared successfully!');
}

clearData()
  .catch((e) => {
    console.error('Error clearing data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
