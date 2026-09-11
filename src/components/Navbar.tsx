'use client';

import { useState, useEffect, Suspense } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import SellProductModal from '@/components/SellProductModal';
import MapLocationPickerModal, { LocationData } from '@/components/MapLocationPickerModal';

import {
  User,
  ShieldCheck,
  Package,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Store,
  Leaf,
  Search,
  Building2,
  CreditCard,
  MapPin,
  Phone,
  Trash2
} from 'lucide-react';

function NavbarContent() {
  const router = useRouter();
  const pathname = usePathname();
  const { 
    user, 
    fetchCurrentUser, 
    logout, 
    openAuthModal, 
    isSellerModalOpen, 
    openSellerModal, 
    closeSellerModal,
    handleStartSelling
  } = useAuthStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  // Modals state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/products');
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
    <div className="w-[95%] sm:w-[98%] max-w-[2560px] mx-auto">
      <div className="flex items-center justify-between h-20 gap-4 lg:gap-8">
        
        {/* Brand Logo - Left */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-primary transition-transform group-hover:rotate-12">
            <Leaf className="w-7 h-7 fill-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black text-base-dark tracking-widest uppercase">
              Barangin
            </span>
            <span className="text-[9px] font-bold text-gray tracking-[0.2em] uppercase leading-none">
              Move Ahead
            </span>
          </div>
        </Link>

        {/* Navigation Links - Positioned Right next to Search Bar */}
        <nav className="hidden lg:flex flex-1 justify-end items-center gap-6 lg:gap-8 mr-2 text-[11px] font-bold text-base-dark tracking-wide uppercase">
          <Link href="/products" className="hover:text-primary transition-colors">
            Katalog
          </Link>
          <Link href="/about" className="hover:text-primary transition-colors">
            Tentang Kami
          </Link>
          {user && (
            <Link href="/orders" className="hover:text-primary transition-colors">
              Pesanan
            </Link>
          )}

          {user && user.is_seller && (
            <Link 
              href="/profile?tab=seller" 
              className="hover:text-[#007AAD] text-[#007AAD] transition-colors flex items-center gap-1.5 font-extrabold"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
          )}
        </nav>

        {/* Right Section: Search Bar & Account Menu */}
        <div className="flex items-center justify-end gap-3 sm:gap-4 shrink-0">
          
          {/* Quick Database Clear Button */}
          <button
            suppressHydrationWarning
            type="button"
            onClick={handleClearDatabase}
            disabled={clearingDb}
            title="Kosongkan Tabel Database (Reset)"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>{clearingDb ? 'Clearing...' : 'Kosongkan DB'}</span>
          </button>

          {/* Search Bar - Right Side near Account */}
          <div className="hidden sm:flex items-center w-48 md:w-56 lg:w-64">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray pointer-events-none" />
              <input 
                suppressHydrationWarning
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari barang kos..."
                className="w-full bg-[#F5F5F3] hover:bg-[#EFEFEA] focus:bg-white rounded-full pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-base-dark placeholder-gray transition-all border border-transparent focus:border-primary/20"
              />
            </form>
          </div>
          
          {user ? (
            <div className="relative">
              <button
                suppressHydrationWarning
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-3.5 border border-primary bg-primary hover:bg-primary-dark text-white rounded-full transition-all text-xs font-bold shadow-sm"
              >
                <span className="hidden sm:inline-block max-w-[90px] truncate">{user.nama_lengkap}</span>
                <div className="w-8 h-8 rounded-full bg-white/20 text-white font-bold flex items-center justify-center text-sm">
                  <User className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div 
                    key="user-dropdown-menu"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-64 bg-base-white border border-gray-light rounded-2xl shadow-premium p-2 z-50 text-xs text-base-dark"
                  >
                    <div className="p-3 bg-primary/10 rounded-xl mb-1">
                      <p className="font-bold text-base-dark truncate">{user.nama_lengkap}</p>
                      <p className="text-[11px] text-gray truncate mt-0.5">{user.email}</p>
                    </div>

                    <div className="py-1">
                      {user.role === 'ADMIN' ? (
                        <>
                          <Link
                            href="/admin"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-2.5 p-2.5 hover:bg-base-light text-base-dark font-bold rounded-xl transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-primary" />
                            <span>Dashboard Admin</span>
                          </Link>

                          <button
                            onClick={() => {
                              setIsDropdownOpen(false);
                              logout();
                            }}
                            className="w-full flex items-center gap-2.5 p-2.5 hover:bg-red-50 text-red-600 rounded-xl transition-colors font-bold text-left mt-1 border-t border-gray-light cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Keluar (Logout)</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/profile"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-2.5 p-2.5 hover:bg-base-light text-base-dark font-bold rounded-xl transition-colors text-left cursor-pointer"
                          >
                            <User className="w-4 h-4 text-primary" />
                            <span>Profil Saya</span>
                          </Link>

                          <button
                            onClick={() => {
                              setIsDropdownOpen(false);
                              logout();
                            }}
                            className="w-full flex items-center gap-2.5 p-2.5 hover:bg-red-50 text-red-600 rounded-xl transition-colors font-bold text-left mt-1 border-t border-gray-light cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Keluar (Logout)</span>
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.button
              suppressHydrationWarning
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openAuthModal('login')}
              className="px-6 py-2.5 border border-primary bg-primary hover:bg-primary-dark text-white font-bold text-[11px] tracking-wide uppercase rounded-full transition-all flex items-center gap-2 shadow-sm"
            >
              <User className="w-4 h-4 text-white" />
              <span>Masuk</span>
            </motion.button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            suppressHydrationWarning
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-base-dark bg-base-light rounded-full"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden"
          >
            <div className="py-4 border-t border-gray-light flex flex-col gap-3">
              <form onSubmit={handleSearchSubmit} className="relative w-full px-2">
                <Search className="w-4 h-4 absolute left-6 top-1/2 -translate-y-1/2 text-gray pointer-events-none" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari barang kos..."
                  className="w-full bg-[#F5F5F3] rounded-full pl-11 pr-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-base-dark placeholder-gray"
                />
              </form>

              <div className="flex flex-col gap-1 text-[11px] font-bold text-base-dark tracking-wide uppercase">
                <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="p-4 hover:bg-base-light rounded-xl transition-colors">
                  Katalog
                </Link>
                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="p-4 hover:bg-base-light rounded-xl transition-colors">
                  Tentang Kami
                </Link>
                {user && (
                  <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="p-4 hover:bg-base-light rounded-xl transition-colors">
                    Pesanan Saya
                  </Link>
                )}
                {user && user.is_seller && (
                  <Link href="/profile?tab=seller" onClick={() => setIsMobileMenuOpen(false)} className="p-4 hover:bg-base-light rounded-xl transition-colors text-[#007AAD] flex items-center gap-2 font-extrabold">
                    <Store className="w-4 h-4" />
                    <span>Dashboard Penjualan</span>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleClearDatabase();
                  }}
                  className="p-4 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left font-extrabold flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Kosongkan DB (Reset)</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Seller Registration Modal */}
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
                className="fixed inset-0 bg-[#0C1D32]/60 backdrop-blur-md cursor-pointer"
              />

              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-base-white border border-gray-light rounded-2xl p-6 sm:p-8 max-w-lg w-full text-base-dark relative shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto z-10 my-auto custom-scrollbar"
              >
                <button
                  onClick={closeSellerModal}
                  className="absolute top-6 right-6 p-2 text-gray hover:text-base-dark rounded-full hover:bg-base-light cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#0C1D32] text-white font-bold flex items-center justify-center shrink-0">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-base-dark">Pendaftaran Penjual BaranginAja</h3>
                    <p className="text-xs text-gray">Lengkapi informasi titik penjemputan &amp; rekening pencairan dana.</p>
                  </div>
                </div>

                <form onSubmit={handleRegisterSeller} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-base-dark mb-1 uppercase tracking-wide text-[10px]">No. WhatsApp / HP Penjual</label>
                    <input
                      type="text"
                      required
                      value={sellerForm.no_hp}
                      onChange={(e) => setSellerForm({ ...sellerForm, no_hp: e.target.value })}
                      placeholder="Contoh: 081234567890"
                      className="w-full p-3 bg-[#F5F5F3] border border-gray-light rounded-xl text-base-dark focus:outline-none focus:ring-1 focus:ring-[#0C1D32]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block font-bold text-base-dark uppercase tracking-wide text-[10px]">Alamat Kos Lengkap (Titik Penjemputan Kurir)</label>
                      <button
                        type="button"
                        onClick={() => setIsSellerMapOpen(true)}
                        className="px-2.5 py-1 bg-[#007AAD] hover:bg-[#005C82] text-white text-[10px] font-extrabold rounded-lg flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Maps</span>
                      </button>
                    </div>
                    <textarea
                      required
                      rows={3}
                      value={sellerForm.alamat_kos}
                      onChange={(e) => setSellerForm({ ...sellerForm, alamat_kos: e.target.value })}
                      placeholder="Contoh: Jl. Keputih Tegal Timur No. 12, Sukolilo, Surabaya"
                      className="w-full p-3 bg-[#F5F5F3] border border-gray-light rounded-xl text-base-dark focus:outline-none focus:ring-1 focus:ring-[#0C1D32]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-base-dark mb-1 uppercase tracking-wide text-[10px]">Nama Bank / E-Wallet</label>
                      <select
                        value={sellerForm.nama_bank}
                        onChange={(e) => setSellerForm({ ...sellerForm, nama_bank: e.target.value })}
                        className="w-full p-3 bg-[#F5F5F3] border border-gray-light rounded-xl text-base-dark focus:outline-none focus:ring-1 focus:ring-[#0C1D32] font-bold"
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
                      <label className="block font-bold text-base-dark mb-1 uppercase tracking-wide text-[10px]">Nomor Rekening / HP</label>
                      <input
                        type="text"
                        required
                        value={sellerForm.no_rekening}
                        onChange={(e) => setSellerForm({ ...sellerForm, no_rekening: e.target.value })}
                        placeholder="Contoh: 1234567890"
                        className="w-full p-3 bg-[#F5F5F3] border border-gray-light rounded-xl text-base-dark focus:outline-none focus:ring-1 focus:ring-[#0C1D32] font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-base-dark mb-1 uppercase tracking-wide text-[10px]">Nama Pemilik Rekening</label>
                    <input
                      type="text"
                      required
                      value={sellerForm.nama_pemilik_rekening}
                      onChange={(e) => setSellerForm({ ...sellerForm, nama_pemilik_rekening: e.target.value })}
                      placeholder="Nama sesuai di buku tabungan / rekening"
                      className="w-full p-3 bg-[#F5F5F3] border border-gray-light rounded-xl text-base-dark focus:outline-none focus:ring-1 focus:ring-[#0C1D32] font-bold"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submittingSeller}
                      className="w-full py-3.5 bg-[#0C1D32] hover:bg-[#007AAD] text-white font-bold rounded-full text-xs shadow-sm transition cursor-pointer"
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
  return (
    <header className="sticky top-0 z-40 bg-base-white/90 backdrop-blur-md transition-all duration-300">
      <Suspense fallback={<div className="h-20 bg-base-white" />}>
        <NavbarContent />
      </Suspense>
    </header>
  );
}
