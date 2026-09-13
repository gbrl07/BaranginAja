'use client';

import Image from 'next/image';
import { useState, useEffect, Suspense } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import SellProductModal from '@/components/SellProductModal';
import MapLocationPickerModal, { LocationData } from '@/components/MapLocationPickerModal';

// Font Awesome icons are used via CSS classes (fa-solid, fa-regular)

function NavbarContent() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    user,
    fetchCurrentUser,
    logout,
    openAuthModal,
    isSellerModalOpen,
    closeSellerModal,
    handleStartSelling
  } = useAuthStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [clearingDb, setClearingDb] = useState(false);

  const handleClearDatabase = async () => {
    if (!confirm('Apakah Anda yakin ingin mengosongkan seluruh data transaksi & barang di database?')) {
      return;
    }
    try {
      setClearingDb(true);
      const res = await fetch('/api/admin/clear-db', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mengosongkan database');
      alert(data.message || 'Database berhasil dikosongkan!');
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setClearingDb(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Seller registration form
  const [sellerForm, setSellerForm] = useState({
    no_hp: '',
    alamat_kos: '',
    nama_bank: 'SEABANK',
    no_rekening: '',
    nama_pemilik_rekening: '',
    lat: -7.282,
    lng: 112.795,
  });
  const [submittingSeller, setSubmittingSeller] = useState(false);
  const [isSellerMapOpen, setIsSellerMapOpen] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Sync initial seller form from user data
  useEffect(() => {
    if (user) {
      setSellerForm({
        no_hp: user.no_hp || '',
        alamat_kos: user.alamat_kos || '',
        nama_bank: user.nama_bank || 'SEABANK',
        no_rekening: user.no_rekening || '',
        nama_pemilik_rekening: user.nama_pemilik_rekening || user.nama_lengkap || '',
        lat: user.lat || -7.282,
        lng: user.lng || 112.795,
      });
    }
  }, [user]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    } else {
      router.push('/products');
      setIsSearchOpen(false);
    }
  };

  const handleRegisterSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingSeller(true);
    try {
      const res = await fetch('/api/user/seller-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sellerForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mendaftar sebagai penjual');

      alert(data.message || 'Selamat! Pendaftaran penjual berhasil.');
      closeSellerModal();
      await fetchCurrentUser();
      router.push('/seller');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmittingSeller(false);
    }
  };

  return (
    <div className="w-full bg-white">
      <div className="w-full bg-white">
        {/* =========================================================================
          ROW 1: GOOGLE FONTS HEADER (LOGO + PILL TABS + CART 1 & PROFILE)
          ========================================================================= */}
        <div className="w-full bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            {/* 1. KIRI: BRAND LOGO */}
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 flex items-center justify-center transition-transform group-hover:scale-105">
                  <Image src="/logo.png" alt="BaranginAja Logo" width={32} height={32} className="object-contain w-full h-full" />
                </div>
                <span className="text-[21px] font-normal text-[#1f1f1f] tracking-tight hover:opacity-85 transition-opacity">
                  BaranginAja
                </span>
              </Link>
            </div>

            {/* 2. TENGAH: PILL TAB NAVIGATION */}
            <div className="hidden md:flex items-center justify-center flex-1 mx-2 sm:mx-4">
              <div className="flex items-center gap-1.5 sm:gap-2 text-[16px]">
                {/* Beranda */}
                <Link
                  href="/"
                  className={`px-3.5 py-1.5 rounded-full transition-all shrink-0 text-[16px] ${
                    pathname === '/'
                      ? 'font-semibold text-[#1f1f1f]'
                      : 'font-normal text-[#5f6368] hover:text-[#1f1f1f]'
                  }`}
                >
                  <span>Beranda</span>
                </Link>

                {/* Katalog */}
                <Link
                  href="/products"
                  className={`px-3.5 py-1.5 rounded-full transition-all shrink-0 text-[16px] ${
                    pathname.startsWith('/products')
                      ? 'font-semibold text-[#1f1f1f]'
                      : 'font-normal text-[#5f6368] hover:text-[#1f1f1f]'
                  }`}
                >
                  <span>Katalog</span>
                </Link>

                {/* Tentang Kami */}
                <Link
                  href="/about"
                  className={`px-3.5 py-1.5 rounded-full transition-all shrink-0 text-[16px] ${
                    pathname === '/about'
                      ? 'font-semibold text-[#1f1f1f]'
                      : 'font-normal text-[#5f6368] hover:text-[#1f1f1f]'
                  }`}
                >
                  <span>Tentang Kami</span>
                </Link>

                {/* Bantuan */}
                <a
                  href="https://wa.me/6281234567890?text=Halo%20BaranginAja%20Support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full font-normal text-[16px] text-[#5f6368] hover:text-[#1f1f1f] transition-all shrink-0"
                >
                  <span>Bantuan</span>
                </a>
              </div>
            </div>

            {/* 3. KANAN: SEARCH & PROFIL (HANYA ICON) */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Search Button (Hanya Icon) */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                title="Cari Produk"
                className="p-2 text-[#444746] hover:text-[#1f1f1f] transition-colors flex items-center justify-center cursor-pointer border-none outline-none focus:outline-none"
              >
                <i className="fa-solid fa-magnifying-glass text-[18px]" />
              </button>

              {/* Profile Dropdown (Hanya Icon) */}
              {user ? (
                <div className="relative flex items-center">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    title={user.nama_lengkap || 'Profil Akun'}
                    className="p-2 text-[#444746] hover:text-[#1f1f1f] transition-colors flex items-center justify-center cursor-pointer border-none outline-none focus:outline-none relative"
                  >
                    <i className="fa-regular fa-circle-user text-[22px]" />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setIsDropdownOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 overflow-hidden"
                        >
                          <div className="px-4 py-2.5 border-b border-slate-100">
                            <p className="text-[11px] text-slate-400 font-medium">Masuk sebagai</p>
                            <p className="text-sm font-bold text-slate-900 truncate">
                              {user.nama_lengkap || 'Pengguna'}
                            </p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                          </div>

                          <div className="py-1">
                            <Link
                              href="/profile"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-black transition-colors"
                            >
                              <i className="fa-regular fa-user text-slate-500 w-4 text-center text-xs" />
                              <span>Profil Saya</span>
                            </Link>

                            <button
                              type="button"
                              onClick={() => {
                                setIsDropdownOpen(false);
                                handleStartSelling(router);
                              }}
                              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-black transition-colors text-left cursor-pointer"
                            >
                              <i className="fa-solid fa-store text-slate-500 w-4 text-center text-xs" />
                              <span>{user.is_seller ? 'Kelola Toko' : 'Mulai Berjualan'}</span>
                            </button>

                            <Link
                              href="/orders"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-black transition-colors"
                            >
                              <i className="fa-solid fa-box-open text-slate-500 w-4 text-center text-xs" />
                              <span>Pesanan Saya</span>
                            </Link>

                            {user.role?.toUpperCase() === 'ADMIN' && (
                              <Link
                                href="/admin"
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 transition-colors font-medium"
                              >
                                <i className="fa-solid fa-shield-halved text-amber-600 w-4 text-center text-xs" />
                                <span>Dashboard Admin</span>
                              </Link>
                            )}
                          </div>

                          <div className="border-t border-slate-100 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setIsDropdownOpen(false);
                                logout();
                              }}
                              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer font-medium"
                            >
                              <i className="fa-solid fa-arrow-right-from-bracket text-red-600 w-4 text-center text-xs" />
                              <span>Keluar</span>
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  title="Masuk / Daftar"
                  className="p-2 text-[#444746] hover:text-[#1f1f1f] transition-colors flex items-center justify-center cursor-pointer border-none outline-none focus:outline-none"
                >
                  <i className="fa-regular fa-circle-user text-[22px]" />
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                suppressHydrationWarning
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-[#444746] hover:text-[#1f1f1f] transition-colors cursor-pointer flex items-center justify-center border-none outline-none focus:outline-none"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <i className="fa-solid fa-xmark text-[19px]" />
                ) : (
                  <i className="fa-solid fa-bars text-[19px]" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-slate-200 overflow-hidden bg-white px-4 py-4"
              style={{ fontSize: '14px' }}
            >
              <div className="flex flex-col gap-1 font-medium text-slate-800" style={{ fontSize: '14px', fontWeight: 500 }}>
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-3 rounded-xl transition-colors text-[16px] ${
                    pathname === '/' ? 'font-semibold text-black bg-slate-100' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span>Beranda</span>
                </Link>
                <Link
                  href="/products"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-3 rounded-xl transition-colors text-[16px] ${
                    pathname.startsWith('/products') ? 'font-semibold text-black bg-slate-100' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span>Katalog</span>
                </Link>
                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-3 rounded-xl transition-colors text-[16px] ${
                    pathname === '/about' ? 'font-semibold text-black bg-slate-100' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span>Tentang Kami</span>
                </Link>
                <a
                  href="https://wa.me/6281234567890?text=Halo%20BaranginAja%20Support"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3 hover:bg-slate-50 rounded-xl transition-colors text-[16px] text-slate-600"
                >
                  <span>Bantuan</span>
                </a>

                <div className="border-t border-slate-100 my-2 pt-2">
                  {user ? (
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-3 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-2 font-medium text-black"
                    >
                      <i className="fa-regular fa-user text-xs w-4 text-center" />
                      <span>{user.nama_lengkap || 'My Account'}</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openAuthModal('login');
                      }}
                      className="w-full p-3 hover:bg-slate-100 rounded-xl transition-colors text-left cursor-pointer font-medium flex items-center gap-2 text-black"
                    >
                      <i className="fa-regular fa-user text-xs w-4 text-center" />
                      <span>Login / Register</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Search Modal */}
        <AnimatePresence>
          {isSearchOpen && (
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSearchOpen(false)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs cursor-pointer"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-10"
              >
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                  <i className="fa-solid fa-magnifying-glass text-slate-400 ml-3 text-[15px]" />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari barang bekas, kos, elektronik..."
                    className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 text-[14px] py-2"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
                    >
                      <i className="fa-solid fa-xmark text-xs" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-black hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Cari
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* =========================================================================
          Modals (Seller Registration & Map Picker)
         ========================================================================= */}
      {mounted && createPortal(
        <AnimatePresence>
          {isSellerModalOpen && (
            <motion.div
              key="seller-registration-modal-dialog-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeSellerModal}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-md cursor-pointer"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-lg w-full text-slate-800 relative shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto z-10 my-auto custom-scrollbar"
              >
                <button
                  onClick={closeSellerModal}
                  className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 cursor-pointer flex items-center justify-center"
                >
                  <i className="fa-solid fa-xmark text-lg" />
                </button>

                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl text-emerald-400 font-bold flex items-center justify-center shrink-0"
                    style={{ backgroundColor: '#000000' }}
                  >
                    <i className="fa-solid fa-store text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Pendaftaran Penjual BaranginAja</h3>
                    <p className="text-slate-500" style={{ fontSize: '14px' }}>Lengkapi informasi penjemputan &amp; rekening pencairan dana.</p>
                  </div>
                </div>

                <form onSubmit={handleRegisterSeller} className="space-y-4" style={{ fontSize: '14px' }}>
                  <div>
                    <label className="block font-bold text-slate-800 mb-1 tracking-wide" style={{ fontSize: '14px' }}>No. WhatsApp / HP Penjual</label>
                    <input
                      type="text"
                      required
                      value={sellerForm.no_hp}
                      onChange={(e) => setSellerForm({ ...sellerForm, no_hp: e.target.value })}
                      placeholder="Contoh: 081234567890"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      style={{ fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block font-bold text-slate-800 tracking-wide" style={{ fontSize: '14px' }}>Alamat Kos Lengkap (Titik Penjemputan)</label>
                      <button
                        type="button"
                        onClick={() => setIsSellerMapOpen(true)}
                        className="px-3 py-1 text-white font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                        style={{ backgroundColor: '#047857', fontSize: '14px' }}
                      >
                        <i className="fa-solid fa-location-dot text-sm" />
                        <span>Pilih di Peta</span>
                      </button>
                    </div>
                    <textarea
                      required
                      rows={3}
                      value={sellerForm.alamat_kos}
                      onChange={(e) => setSellerForm({ ...sellerForm, alamat_kos: e.target.value })}
                      placeholder="Contoh: Jl. Keputih Tegal Timur No. 12, Sukolilo, Surabaya"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      style={{ fontSize: '14px' }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1 tracking-wide" style={{ fontSize: '14px' }}>Nama Bank / E-Wallet</label>
                      <select
                        value={sellerForm.nama_bank}
                        onChange={(e) => setSellerForm({ ...sellerForm, nama_bank: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-bold"
                        style={{ fontSize: '14px' }}
                      >
                        <option value="SEABANK">SEABANK</option>
                        <option value="BCA">BCA</option>
                        <option value="MANDIRI">MANDIRI</option>
                        <option value="BRI">BRI</option>
                        <option value="BNI">BNI</option>
                        <option value="GOPAY">GOPAY</option>
                        <option value="DANA">DANA</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1 tracking-wide" style={{ fontSize: '14px' }}>Nomor Rekening / HP</label>
                      <input
                        type="text"
                        required
                        value={sellerForm.no_rekening}
                        onChange={(e) => setSellerForm({ ...sellerForm, no_rekening: e.target.value })}
                        placeholder="Contoh: 1234567890"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono font-bold"
                        style={{ fontSize: '14px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1 tracking-wide" style={{ fontSize: '14px' }}>Nama Pemilik Rekening</label>
                    <input
                      type="text"
                      required
                      value={sellerForm.nama_pemilik_rekening}
                      onChange={(e) => setSellerForm({ ...sellerForm, nama_pemilik_rekening: e.target.value })}
                      placeholder="Nama sesuai di rekening"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-bold"
                      style={{ fontSize: '14px' }}
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submittingSeller}
                      className="w-full py-3.5 text-white font-bold rounded-full shadow-sm transition cursor-pointer"
                      style={{ backgroundColor: '#000000', fontSize: '14px' }}
                    >
                      {submittingSeller ? 'Memproses Pendaftaran...' : 'Daftar Jadi Penjual Sekarang'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Sell Product Modal */}
      <SellProductModal />

      {/* Seller Registration Map Picker Modal */}
      <MapLocationPickerModal
        isOpen={isSellerMapOpen}
        onClose={() => setIsSellerMapOpen(false)}
        initialLat={sellerForm.lat}
        initialLng={sellerForm.lng}
        initialAddress={sellerForm.alamat_kos}
        onSelectLocation={(data: LocationData) => {
          setSellerForm({
            ...sellerForm,
            lat: data.lat,
            lng: data.lng,
            alamat_kos: data.alamat_kos,
          });
        }}
      />
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white transition-all duration-300">
      <Suspense fallback={<div className="h-16 bg-white" />}>
        <NavbarContent />
      </Suspense>
    </header>
  );
}
