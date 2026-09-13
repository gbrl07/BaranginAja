/**
 * @file admin.ts
 * @description Modul Tipe Data & Interface untuk Sistem Informasi Manajemen (SIM) Admin BaranginAja.
 * Menyediakan definisi tipe TypeScript terpusat dengan dokumentasi lengkap dalam Bahasa Indonesia.
 */

/**
 * Interface data Kampus yang terdaftar di platform BaranginAja.
 */
export interface KampusSim {
  id: string;
  nama_kampus: string;
  slug?: string;
  kota?: string;
  aktif?: boolean;
  user_count?: number;
  _count?: {
    users?: number;
  };
  created_at?: string;
}

/**
 * Interface data Pengguna (User) yang mencakup Peran (BUYER, SELLER, ADMIN).
 */
export interface UserSim {
  id: string;
  nama_lengkap: string;
  email: string;
  no_hp?: string;
  nim_ktp?: string;
  alamat_kos?: string;
  lat?: number;
  lng?: number;
  kampus_id?: string;
  kampus?: KampusSim;
  role: 'BUYER' | 'SELLER' | 'ADMIN';
  status_verifikasi: 'VERIFIED' | 'PENDING' | 'REJECTED';
  is_seller?: boolean;
  nama_toko?: string;
  no_rekening?: string;
  norek_bank?: string;
  nama_bank?: string;
  nama_pemilik_rekening?: string;
  products?: ProductSim[];
  created_at?: string;
}

/**
 * Interface Produk milik Seller yang terdaftar di katalog.
 */
export interface ProductSim {
  id: string;
  nama_barang: string;
  harga_input: number;
  harga_jual: number;
  margin?: number;
  foto_urls?: string | string[];
  kondisi?: string;
  kategori?: string | { nama_kategori?: string };
  stok?: number;
  status?: string;
  seller_id?: string;
  seller?: UserSim;
  created_at?: string;
}

/**
 * Interface Pesanan (Order) transaksi di platform.
 */
export interface OrderSim {
  id: string;
  created_at: string;
  total_harga: number;
  margin_admin?: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED' | string;
  buyer_id?: string;
  buyer?: UserSim;
  product_id?: string;
  product?: ProductSim;
  catatan?: string;
  opsi_pengiriman?: string;
  jarak_km?: number;
  ongkir?: number;
  hold_expires_at?: string;
}

/**
 * Interface Pencairan Saldo (Payout) Seller oleh Admin.
 */
export interface PayoutSim {
  id: string;
  seller_id: string;
  seller?: UserSim;
  jumlah?: number;
  nominal?: number;
  bank?: string;
  no_rekening?: string;
  pemilik_rekening?: string;
  status: 'PENDING' | 'DISBURSED' | 'REJECTED' | 'MENUNGGU_PENCAIRAN' | 'DICAIRKAN' | string;
  created_at: string;
  disbursed_at?: string;
  tanggal_dicairkan?: string;
  order_id?: string;
  order?: OrderSim;
}

/**
 * Interface Log Aktivitas Sistem (Audit Trail).
 */
export interface ActivitySim {
  id: string;
  tipe?: string;
  aksi?: string;
  deskripsi?: string;
  created_at?: string;
  timestamp?: string;
  admin_id?: string;
  admin?: UserSim;
}

/**
 * Ringkasan Statistik Eksekutif Platform.
 */
export interface OverviewStats {
  totalUsers: number;
  totalProducts: number;
  pendingOrders: number;
  totalRevenue: number;
}

/**
 * Jenis Tab Navigasi Utama Dashboard Admin.
 */
export type TabType = 'overview' | 'orders' | 'payouts' | 'products' | 'users' | 'campuses' | 'audit';

/**
 * Props Komponen Utama Dashboard Admin SIM.
 */
export interface AdminSIMDashboardProps {
  initialStats: OverviewStats;
  initialOrders: OrderSim[];
  initialProducts: ProductSim[];
  initialUsers: UserSim[];
  initialPayouts: PayoutSim[];
  initialCampuses: KampusSim[];
  initialActivities: ActivitySim[];
}
