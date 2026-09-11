import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateStatus() {
  console.log('Updating user@barangin.com to non-seller (BUYER)...');

  await prisma.user.updateMany({
    where: { email: 'user@barangin.com' },
    data: {
      is_seller: false,
      role: 'BUYER'
    }
  });

  console.log('✅ user@barangin.com updated to is_seller: false!');
}

updateStatus()
  .catch((e) => {
    console.error('Error updating user status:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
