import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Memulai pembersihan seluruh data tabel database...');

  // Delete all data in reverse dependency order
  await prisma.activityLog.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
  await prisma.campus.deleteMany();

  console.log('✅ Seluruh tabel database (orders, products, users, payouts, activity logs, categories, campuses) telah dikosongkan!');

  // Re-create initial Admin user so admin login remains functional
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      nama_lengkap: 'Admin BaranginAja',
      email: 'admin@barangin.com',
      password_hash: adminPassword,
      role: 'ADMIN',
      status_verifikasi: 'VERIFIED'
    }
  });

  console.log('🔑 Akun Admin awal berhasil dibuat: admin@barangin.com (Password: admin123)');
}

main()
  .catch((e) => {
    console.error('Error saat membersihkan database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
