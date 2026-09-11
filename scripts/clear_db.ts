import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Mengosongkan isi tabel database...');

  await prisma.activityLog.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  console.log('✅ Berhasil mengosongkan tabel Produk, Pesanan, Pencairan, dan Log Aktivitas!');
}

main()
  .catch((e) => {
    console.error('Error mengosongkan DB:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
