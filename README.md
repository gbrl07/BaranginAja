# 📦 BaranginAja — Platform Jual Beli Barang Bekas Antar Mahasiswa Kos (Surabaya)

<p align="center">
  <img src="public/logo.png" alt="BaranginAja Logo" width="120" />
</p>

<p align="center">
  <strong>Solusi E-Commerce & Sistem Informasi Manajemen (SIM) Hyper-Local Khusus Mahasiswa Kos se-Surabaya</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3.4-black?style=for-the-badge&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Prisma-5.22.0-2D3748?style=for-the-badge&logo=prisma" alt="Prisma ORM" />
</p>

---

## 📌 Ringkasan Produk

**BaranginAja** adalah platform e-commerce dan Sistem Informasi Manajemen (SIM) yang dirancang khusus untuk memfasilitasi transaksi jual-beli barang bekas (perabotan kos, elektronik, buku kuliah, alat rumah tangga) antar mahasiswa kampus se-Surabaya.

Berbeda dari marketplace umum, BaranginAja mengusung pendekatan **hyper-local berbasis kampus** dengan sistem transaksi terstruktur yang diawasi langsung oleh **SIM Admin Operasional** (menggunakan metode pembayaran QRIS & verifikasi otomatis via WhatsApp).

### 💡 Model Bisnis & Value Proposition
1. **Harga Transparan (Markup Automatis):** Sistem secara otomatis menambahkan komisi platform (10%–20%) di atas harga input asli penjual.
2. **Fleksibilitas Pengiriman:** 
   - **Ambil Mandiri (COD Kos):** Bebas ongkir, pembeli mengambil langsung ke kos penjual.
   - **Kurir Internal Platform:** Kalkulasi ongkir otomatis berbasis jarak kilometer (km) antar kampus/kos.
3. **Proteksi Hold Stok 15 Menit:** Menghindari *double order* dengan sistem penguncian stok sementara saat pembeli memicu pesanan via WhatsApp.
4. **Pencairan Dana (Payout) Pasti:** Penjual menerima $100\%$ dari harga input asli barang setelah pesanan diverifikasi dan diselesaikan oleh admin.

---

## 🔥 Fitur Utama

### 🛒 1. Sisi Mahasiswa (Pembeli & Penjual)
* **Katalog Berbasis Jaringan Kampus:** Filter barang berdasarkan kampus terdekat di Surabaya (UNESA, UNAIR, ITS, UPN, UBAYA, dll).
* **Detail Barang & Kalkulator Ongkir:** Perhitungan harga final (termasuk markup platform) dan simulasi ongkos kirim real-time.
* **Checkout Manual via WhatsApp API:** Template pesan WA otomatis berisi rincian pesanan dan instruksi pembayaran QRIS SeaBank.
* **Dashboard Seller (Penjual):**
  - Pasang iklan barang bekas baru dengan foto, kategori, dan deskripsi.
  - Pantau status penjualan & riwayat pesanan.
  - Kelola data rekening bank pencairan dana.

### 🛡️ 2. Control Panel SIM Admin Operasional (`/admin`)
* **Executive Summary Dashboard:**
  - Grafik tren keuntungan bulanan (*Platform Profit*, *Markup Profit*, *Ongkir Profit*).
  - Ringkasan statistik realtime (Total GMV, Total User, Total Produk, Pending Orders).
* **Order & Resi WA Management:**
  - Pemantauan status transaksi: `MENUNGGU_PEMBAYARAN`, `DIBAYAR`, `DIJEMPUT_KURIR`, `DALAM_PENGIRIMAN`, `SELESAI`, `DIBATALKAN`.
  - Countdown Timer Hold WA 15 menit dengan rilis otomatis jika kadaluarsa.
* **Pencairan Saldo (Payouts):**
  - Antrian transfer dana ke rekening penjual sebesar harga input asli.
  - Verifikasi satu klik dengan tanda bukti transfer pencairan.
* **Manajemen User & Verifikasi Seller:**
  - Manajemen peran pengguna (`BUYER`, `SELLER`, `ADMIN`).
  - Verifikasi identitas seller untuk keamanan komunitas kampus.
* **Manajemen Jaringan Kampus & Katalog:**
  - Pengelolaan multi-branch kampus se-Surabaya.
  - Kontrol listing produk aktif/nonaktif.
* **Audit Trail System:**
  - Catatan log permanen aktivitas admin untuk transparansi dan akuntabilitas sistem.

---

## 🛠️ Tech Stack & Arsitektur

| Layer | Teknologi |
|---|---|
| **Framework Frontend** | [Next.js 16](https://nextjs.org/) (App Router + Turbopack) |
| **UI & Styling** | [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) |
| **Icons & Visual** | [Lucide React](https://lucide.dev/), [FontAwesome](https://fontawesome.com/) |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) |
| **Database & ORM** | [Prisma ORM 5.22](https://www.prisma.io/), SQLite / PostgreSQL |
| **Autentikasi & Keamanan** | JWT (JSON Web Token), BcryptJS |
| **Maps & Pengukuran Jarak** | [Leaflet.js](https://leafletjs.com/) |

---

## 📁 Struktur Proyek

```text
BaranginAja/
├── prisma/
│   ├── schema.prisma        # Skema Database (User, Product, Order, Payout, Campus, ActivityLog)
│   └── seed.ts              # Data Awal Demo (Admin, Users, Products, Campuses)
├── public/                  # Asset Gambar, Logo, & Icon
├── src/
│   ├── app/                 # Next.js App Router (Pages & API Routes)
│   │   ├── admin/           # Halaman Dashboard SIM Admin
│   │   ├── api/             # API Endpoints (Auth, Orders, Products, Admin, Payouts)
│   │   ├── orders/          # Halaman Pesanan Saya (Buyer)
│   │   ├── products/        # Halaman Detail & Katalog Produk
│   │   ├── seller/          # Dashboard Penjual & Tambah Produk
│   │   ├── layout.tsx       # Main Root Layout
│   │   └── page.tsx         # Landing Page Utama
│   ├── components/          # Komponen UI Reusable
│   │   ├── admin/           # Komponen SIM Admin (Sidebar, Header, Tabs, Modals)
│   │   ├── Navbar.tsx       # Navbar Utama Client
│   │   ├── Footer.tsx       # Footer Platform
│   │   └── ProductCard.tsx  # Card Listing Produk
│   ├── lib/                 # Utility, Auth, Formatters, & Prisma Client
│   └── store/               # State Management Zustand (useAuthStore)
├── PRD BaranginAja.md       # Product Requirements Document
├── README.md                # Dokumentasi Proyek
└── package.json             # Dependensi Proyek
```

---

## 🚀 Panduan Memulai (Getting Started)

### 1. Prasyarat
Pastikan komputer kamu sudah terinstal:
- [Node.js](https://nodejs.org/) v18.0.0 atau lebih baru
- `npm` atau `pnpm`

### 2. Kloning Repository & Instalasi Dependensi
```bash
git clone https://github.com/gbrl07/BaranginAja.git
cd BaranginAja
npm install
```

### 3. Konfigurasi Environment Variable (`.env`)
Buat file `.env` di root direktori project:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="super-secret-barangin-key-2026"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Setup & Migrasi Database
Jalankan migrasi Prisma dan seed data awal (Admin, Kampus, & Sampel Produk):
```bash
npx prisma db push
npx prisma db seed
```

### 5. Jalankan Development Server
```bash
npm run dev
```
Buka browser dan akses **`http://localhost:3000`**.

---

## 🔐 Akun Pengujian Demo (Default Credentials)

Untuk menguji fitur-fitur platform, gunakan akun demo yang sudah disiapkan:

| Peran (Role) | Email | Password | Akses URL |
|---|---|---|---|
| **Admin Operasional** | `admin@barangin.com` | `admin123` | `http://localhost:3000/admin` |
| **Penjual (Seller)** | `seller@barangin.com` | `seller123` | `http://localhost:3000/seller` |
| **Pembeli (Buyer)** | `buyer@barangin.com` | `buyer123` | `http://localhost:3000/products` |

---

## 🤝 Lisensi & Hak Cipta

Dikembangkan oleh **Tim BaranginAja** © 2026. Hak cipta dilindungi undang-undang.  
Bebas digunakan untuk keperluan pembelajaran dan pengembangan internal kampus.
