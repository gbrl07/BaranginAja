import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database tables...');
  
  // Clean all tables in reverse dependency order
  await prisma.activityLog.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
  await prisma.campus.deleteMany();

  console.log('Seeding initial campus data...');
  const campusData = [
    { nama_kampus: 'Universitas Airlangga (UNAIR)', kota: 'Surabaya' },
    { nama_kampus: 'Institut Teknologi Sepuluh Nopember (ITS)', kota: 'Surabaya' },
    { nama_kampus: 'Universitas Surabaya (UBAYA)', kota: 'Surabaya' },
    { nama_kampus: 'Universitas Negeri Surabaya (UNESA)', kota: 'Surabaya' },
    { nama_kampus: 'Universitas Kristen Petra', kota: 'Surabaya' },
    { nama_kampus: 'Universitas Katolik Widya Mandala Surabaya', kota: 'Surabaya' },
    { nama_kampus: 'Lainnya', kota: 'Surabaya' }
  ];

  const createdCampuses: any[] = [];
  for (const c of campusData) {
    const created = await prisma.campus.create({ data: c });
    createdCampuses.push(created);
  }

  console.log('Seeding initial product categories...');
  const categoryData = [
    'Perabotan Kos',
    'Elektronik',
    'Buku Kuliah',
    'Fashion & Pakaian',
    'Lainnya'
  ];

  const createdCategories: any[] = [];
  for (const name of categoryData) {
    const cat = await prisma.category.create({ data: { nama_kategori: name } });
    createdCategories.push(cat);
  }

  console.log('Creating Admin Account...');
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

  console.log('Creating Mahasiswa Demo Accounts...');
  const userPassword = await bcrypt.hash('user123', 10);
  const itsCampus = createdCampuses.find(c => c.nama_kampus.includes('ITS')) || createdCampuses[0];
  const unairCampus = createdCampuses.find(c => c.nama_kampus.includes('UNAIR')) || createdCampuses[0];

  // Demo user@barangin.com (Budi Mahasiswa - Belum Penjual)
  const demoUser = await prisma.user.create({
    data: {
      nama_lengkap: 'Budi Mahasiswa',
      email: 'user@barangin.com',
      password_hash: userPassword,
      no_hp: '081234567890',
      role: 'BUYER',
      is_seller: false,
      kampus_id: itsCampus.id,
      alamat_kos: 'Jl. Keputih Tegal Timur No. 12, Sukolilo, Surabaya',
      lat: -7.291,
      lng: 112.798,
      status_verifikasi: 'PENDING'
    }
  });

  // Demo seller@barangin.com
  const sellerUser = await prisma.user.create({
    data: {
      nama_lengkap: 'Budi Prasetyo',
      email: 'seller@barangin.com',
      password_hash: userPassword,
      no_hp: '081234567891',
      role: 'SELLER',
      is_seller: true,
      kampus_id: itsCampus.id,
      alamat_kos: 'Jl. Keputih Tegal Timur No. 14, Sukolilo, Surabaya',
      lat: -7.291,
      lng: 112.798,
      status_verifikasi: 'VERIFIED',
      nama_bank: 'SEABANK',
      no_rekening: '9876543210',
      nama_pemilik_rekening: 'Budi Prasetyo'
    }
  });

  // Demo buyer@barangin.com
  await prisma.user.create({
    data: {
      nama_lengkap: 'Siti Rahma',
      email: 'buyer@barangin.com',
      password_hash: userPassword,
      no_hp: '089876543210',
      role: 'BUYER',
      is_seller: false,
      kampus_id: unairCampus.id,
      alamat_kos: 'Jl. Dharmawangsa No. 25, Gubeng, Surabaya',
      lat: -7.275,
      lng: 112.754,
      status_verifikasi: 'VERIFIED'
    }
  });

  console.log('Seeding initial products...');
  const elektronikCat = createdCategories.find(c => c.nama_kategori === 'Elektronik');
  const perabotanCat = createdCategories.find(c => c.nama_kategori === 'Perabotan Kos');

  if (elektronikCat && perabotanCat) {
    const products = [
      {
        nama_barang: 'Kipas Angin Miyako (Bekas Kos)',
        kategori_id: elektronikCat.id,
        seller_id: sellerUser.id,
        deskripsi: 'Masih dingin dan berfungsi normal. Dijual karena mau pindahan kos.',
        kondisi: 'Cukup Baik',
        harga_input: 100000,
        harga_jual: 110000,
        berat_kg: 2,
        foto_urls: JSON.stringify(['https://images.unsplash.com/photo-1540574163026-643ea20d25b5?auto=format&fit=crop&w=800&q=80']),
        status: 'TERSEDIA'
      },
      {
        nama_barang: 'Rice Cooker Philips Kecil',
        kategori_id: elektronikCat.id,
        seller_id: sellerUser.id,
        deskripsi: 'Kapasitas 0.8L cocok untuk anak kos. Anti lengket.',
        kondisi: 'Baik',
        harga_input: 150000,
        harga_jual: 165000,
        berat_kg: 1.5,
        foto_urls: JSON.stringify(['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80']),
        status: 'TERSEDIA'
      },
      {
        nama_barang: 'Meja Belajar Lipat Mulus',
        kategori_id: perabotanCat.id,
        seller_id: sellerUser.id,
        deskripsi: 'Bisa dilipat hemat tempat, kayu kokoh.',
        kondisi: 'Seperti Baru',
        harga_input: 40000,
        harga_jual: 48000,
        berat_kg: 1,
        foto_urls: JSON.stringify(['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80']),
        status: 'TERSEDIA'
      },
      {
        nama_barang: 'Rak Sepatu Plastik 4 Susun',
        kategori_id: perabotanCat.id,
        seller_id: sellerUser.id,
        deskripsi: 'Muat hingga 8 pasang sepatu kos. Kondisi mulus.',
        kondisi: 'Baik',
        harga_input: 60000,
        harga_jual: 69000,
        berat_kg: 1,
        foto_urls: JSON.stringify(['https://images.unsplash.com/photo-1595514535313-0947ebf0592b?auto=format&fit=crop&w=800&q=80']),
        status: 'TERSEDIA'
      },
      {
        nama_barang: 'Kursi Belajar Ergonomis',
        kategori_id: perabotanCat.id,
        seller_id: sellerUser.id,
        deskripsi: 'Kursi kerja empuk ada roda dan hidrolik penyesuai tinggi.',
        kondisi: 'Sangat Baik',
        harga_input: 180000,
        harga_jual: 199000,
        berat_kg: 5,
        foto_urls: JSON.stringify(['https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=800&q=80']),
        status: 'TERSEDIA'
      },
      {
        nama_barang: 'Lemari Pakaian Portable 3 Pintu',
        kategori_id: perabotanCat.id,
        seller_id: sellerUser.id,
        deskripsi: 'Praktis bongkar pasang untuk kosan, rangka besi kokoh.',
        kondisi: 'Baik',
        harga_input: 85000,
        harga_jual: 95000,
        berat_kg: 2,
        foto_urls: JSON.stringify(['https://images.unsplash.com/photo-1558882224-dda166733046?auto=format&fit=crop&w=800&q=80']),
        status: 'TERSEDIA'
      }
    ];

    for (const p of products) {
      await prisma.product.create({ data: p });
    }
  }

  console.log('✅ Database seeding complete!');
  console.log('----------------------------------------------------');
  console.log('🔑 KREDENSIAL AKUN DEMO SIAP DIGUNAKAN:');
  console.log('1. ADMIN SYSTEM:');
  console.log('   - Email: admin@barangin.com | Password: admin123');
  console.log('2. DEMO MAHASISWA:');
  console.log('   - Email: user@barangin.com | Password: user123');
  console.log('   - Email: seller@barangin.com | Password: user123');
  console.log('   - Email: buyer@barangin.com | Password: user123');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
