'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import MapLocationPickerModal, { LocationData } from '@/components/MapLocationPickerModal';

import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  CreditCard, 
  Lock, 
  ShieldCheck, 
  Store, 
  Package, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  LogOut,
  Camera,
  ArrowUpRight,
  Sparkles,
  ShoppingBag,
  Wallet
} from 'lucide-react';

function ProfilePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: sessionUser, setUser, logout, handleStartSelling, openSellModal, isSellModalOpen } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'pribadi' | 'seller' | 'rekening' | 'keamanan'>('pribadi');
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Form states
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ ordersCount: 0, productsCount: 0, payoutEarned: 0 });
  const [campuses, setCampuses] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    nama_lengkap: '',
    no_hp: '',
    kampus_id: '',
    alamat_kos: '',
    lat: -7.282,
    lng: 112.795,
    nama_bank: 'SEABANK',
    no_rekening: '',
    nama_pemilik_rekening: '',
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'seller') {
      setActiveTab('seller');
    } else if (tabParam === 'rekening') {
      setActiveTab('rekening');
    } else if (tabParam === 'keamanan') {
      setActiveTab('keamanan');
    } else if (tabParam === 'pribadi') {
      setActiveTab('pribadi');
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProfile();
  }, [isSellModalOpen]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/user/profile');
      if (res.status === 401) {
        router.push('/');
        return;
      }

      const data = await res.json();
      if (data.profile) {
        setProfile(data.profile);
        setStats(data.stats || { ordersCount: 0, productsCount: 0, payoutEarned: 0 });
        setCampuses(data.campuses || []);

        setFormData({
          nama_lengkap: data.profile.nama_lengkap || '',
          no_hp: data.profile.no_hp || '',
          kampus_id: data.profile.kampus_id || '',
          alamat_kos: data.profile.alamat_kos || '',
          lat: data.profile.lat || -7.282,
          lng: data.profile.lng || 112.795,
          nama_bank: data.profile.nama_bank || 'SEABANK',
          no_rekening: data.profile.no_rekening || '',
          nama_pemilik_rekening: data.profile.nama_pemilik_rekening || '',
          old_password: '',
          new_password: '',
          confirm_password: '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      showToast('error', 'Gagal memuat profil');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'keamanan') {
      if (!formData.old_password) {
        showToast('error', 'Masukkan password saat ini');
        return;
      }
      if (formData.new_password !== formData.confirm_password) {
        showToast('error', 'Konfirmasi password baru tidak cocok');
        return;
      }
      if (formData.new_password.length < 6) {
        showToast('error', 'Password baru minimal 6 karakter');
        return;
      }
    }

    try {
      setSaving(true);
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama_lengkap: formData.nama_lengkap,
          no_hp: formData.no_hp,
          kampus_id: formData.kampus_id,
          alamat_kos: formData.alamat_kos,
          lat: formData.lat,
          lng: formData.lng,
          nama_bank: formData.nama_bank,
          no_rekening: formData.no_rekening,
          nama_pemilik_rekening: formData.nama_pemilik_rekening,
          old_password: formData.old_password || undefined,
          new_password: formData.new_password || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast('error', data.error || 'Gagal menyimpan perubahan');
        return;
      }

      showToast('success', 'Profil berhasil disimpan!');
      
      setFormData(prev => ({
        ...prev,
        old_password: '',
        new_password: '',
        confirm_password: ''
      }));

      if (data.profile) {
        setProfile(data.profile);
        setUser(data.profile);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('error', 'Gagal memperbarui profil');
    } finally {
      setSaving(false);
    }
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-base-white py-20 px-4 flex items-center justify-center">
        <div className="text-xs text-gray-400 font-bold uppercase tracking-wider animate-pulse">Memuat profil akun...</div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-base-white py-20 px-4 text-center">
        <div className="max-w-xs mx-auto space-y-4">
          <p className="text-xs text-gray-500 font-medium">Silakan login untuk mengakses profil akun Anda.</p>
          <Link href="/" className="px-6 py-3 bg-[#0C1D32] text-white text-xs font-bold uppercase tracking-wider rounded-full inline-block shadow-sm">
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    );
  }

  const initialAvatar = profile.nama_lengkap ? profile.nama_lengkap.charAt(0).toUpperCase() : 'U';

  return (
    <main className="min-h-screen bg-base-white text-base-dark pb-24 pt-4 sm:pt-6">
      
      {/* Outer Container matching left/right boundaries of the rest of the application */}
      <div className="w-[95%] sm:w-[98%] max-w-[2560px] mx-auto space-y-6 sm:space-y-8">

        {/* 1. Header Banner Box */}
        <div className="bg-[#F8F7F3] rounded-2xl border border-[#EAE7DF] p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#007AAD]/10 text-[#007AAD] rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.2em] mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-[#007AAD]" /> PENGATURAN PROFIL MAHASISWA
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0C1D32] tracking-tight uppercase">
              PENGATURAN PROFIL &amp; AKUN
            </h1>
            <p className="text-xs sm:text-sm text-[#1F3047] font-semibold mt-1 max-w-xl">
              Kelola informasi pribadi, titik jemput kos kurir, dan akun rekening bank pencairan cuan Anda.
            </p>
          </div>
        </div>

        {/* Toast Alert Notification */}
        {toast && (
          <div className={`p-4 rounded-xl border text-xs font-bold flex items-center justify-between shadow-xs ${
            toast.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-red-50 text-red-900 border-red-200'
          }`}>
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />}
              <span>{toast.message}</span>
            </div>
          </div>
        )}

        {/* 2. Main 2-Column Dashboard Grid Layout */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">

          {/* LEFT SIDEBAR CARD (Refined UI) */}
          <div className="w-full lg:w-80 xl:w-96 bg-white rounded-2xl border border-[#EAE7DF] shadow-xs p-6 sm:p-8 space-y-6 shrink-0">
            
            {/* User Profile Avatar Box */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#0C1D32] text-white font-black text-3xl sm:text-4xl flex items-center justify-center shadow-md border-4 border-white ring-2 ring-[#0C1D32]/10">
                  {initialAvatar}
                </div>
                <button
                  type="button"
                  title="Ubah Foto Profil"
                  className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[#007AAD] text-white flex items-center justify-center shadow-md border-2 border-white hover:bg-[#005C82] transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <h2 className="text-base sm:text-lg font-black text-[#0C1D32] tracking-tight">{profile.nama_lengkap}</h2>
              
              <div className="flex items-center gap-1.5 text-xs text-gray mt-0.5 font-medium">
                <Mail className="w-3.5 h-3.5 text-gray shrink-0" />
                <span className="truncate max-w-[200px]">{profile.email}</span>
              </div>

              {profile.kampus && (
                <div className="flex items-center gap-1.5 text-[11px] text-[#007AAD] font-bold mt-1">
                  <Building2 className="w-3.5 h-3.5 shrink-0 text-[#007AAD]" />
                  <span>{profile.kampus.nama_kampus}</span>
                </div>
              )}
              
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{profile.role} • {profile.status_verifikasi === 'VERIFIED' ? 'Verified NIM' : 'Mahasiswa'}</span>
              </div>
            </div>

            <div className="border-t border-[#EAE7DF]" />

            {/* Account Metrics List */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-3 rounded-xl bg-[#F8F7F3] border border-[#EAE7DF]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#007AAD]/10 flex items-center justify-center text-[#007AAD]">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <span className="text-[#1F3047] font-bold">Transaksi Pembelian</span>
                </div>
                <span className="font-extrabold text-[#0C1D32] font-mono text-xs">
                  {stats.ordersCount}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-[#F8F7F3] border border-[#EAE7DF]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#0C1D32]/10 flex items-center justify-center text-[#0C1D32]">
                    <Store className="w-4 h-4" />
                  </div>
                  <span className="text-[#1F3047] font-bold">Barang Dijual</span>
                </div>
                <span className="font-extrabold text-[#0C1D32] font-mono text-xs">
                  {stats.productsCount}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-[#F8F7F3] border border-[#EAE7DF]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#007AAD]/10 flex items-center justify-center text-[#007AAD]">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <span className="text-[#1F3047] font-bold">Pencairan Cuan</span>
                </div>
                <span className="font-extrabold text-[#007AAD] font-mono text-xs">
                  {formatRupiah(stats.payoutEarned)}
                </span>
              </div>
            </div>

            <div className="border-t border-[#EAE7DF]" />

            {/* Quick Actions */}
            <div className="space-y-2.5">
              {profile.is_seller ? (
                <button 
                  onClick={() => setActiveTab('seller')} 
                  className={`w-full py-3 px-4 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
                    activeTab === 'seller' ? 'bg-[#007AAD] text-white' : 'bg-[#0C1D32] hover:bg-[#007AAD] text-white'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>Dashboard Penjualan</span>
                </button>
              ) : profile.role !== 'ADMIN' ? (
                <button 
                  onClick={() => handleStartSelling(router)} 
                  className="w-full py-3.5 px-4 bg-[#007AAD] hover:bg-[#005C82] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
                >
                  <Store className="w-4 h-4" />
                  <span>Daftar Jadi Penjual</span>
                </button>
              ) : null}

              <button 
                onClick={() => logout()} 
                className="w-full py-3 px-4 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar (Logout)</span>
              </button>
            </div>

          </div>

          {/* RIGHT MAIN CONTENT CARD (Matching Reference Layout) */}
          <div className="flex-1 w-full bg-white rounded-2xl border border-[#EAE7DF] shadow-xs p-6 sm:p-10 flex flex-col justify-between min-h-[580px]">
            
            <div>
              {/* Top Navigation Tabs Header */}
              <div className="flex items-center gap-6 border-b border-[#EAE7DF] pb-3 text-xs sm:text-sm font-extrabold uppercase tracking-wider overflow-x-auto scrollbar-hide">
                <button
                  type="button"
                  onClick={() => setActiveTab('pribadi')}
                  className={`relative pb-3 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                    activeTab === 'pribadi' 
                      ? 'text-[#0C1D32] font-black' 
                      : 'text-gray hover:text-[#0C1D32]'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Pengaturan Akun</span>
                  {activeTab === 'pribadi' && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#007AAD] rounded-full" />
                  )}
                </button>

                {profile.is_seller && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('seller')}
                    className={`relative pb-3 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                      activeTab === 'seller' 
                        ? 'text-[#0C1D32] font-black' 
                        : 'text-gray hover:text-[#0C1D32]'
                    }`}
                  >
                    <Store className="w-4 h-4 text-[#007AAD]" />
                    <span>Dashboard Penjualan</span>
                    {activeTab === 'seller' && (
                      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#007AAD] rounded-full" />
                    )}
                  </button>
                )}

                {profile.is_seller && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('rekening')}
                    className={`relative pb-3 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                      activeTab === 'rekening' 
                        ? 'text-[#0C1D32] font-black' 
                        : 'text-gray hover:text-[#0C1D32]'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Rekening Bank</span>
                    {activeTab === 'rekening' && (
                      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#007AAD] rounded-full" />
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setActiveTab('keamanan')}
                  className={`relative pb-3 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                    activeTab === 'keamanan' 
                      ? 'text-[#0C1D32] font-black' 
                      : 'text-gray hover:text-[#0C1D32]'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>Keamanan</span>
                  {activeTab === 'keamanan' && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#007AAD] rounded-full" />
                  )}
                </button>

                <Link
                  href="/orders"
                  className="pb-3 text-gray hover:text-[#0C1D32] transition-colors ml-auto flex items-center gap-1.5 shrink-0 font-extrabold uppercase tracking-wider"
                >
                  <Package className="w-4 h-4 text-gray" />
                  <span>Riwayat Pesanan</span>
                  <ArrowUpRight className="w-4 h-4 opacity-70" />
                </Link>
              </div>

              {/* Form Content Area */}
              <form id="profile-form" onSubmit={handleSaveProfile} className="py-6 sm:py-8 space-y-6">

                {/* TAB 1: PENGATURAN AKUN */}
                {activeTab === 'pribadi' && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                      <div>
                        <label className="block text-[10px] font-extrabold text-[#0C1D32] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#007AAD]" />
                          <span>Nama Lengkap</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.nama_lengkap}
                          onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })}
                          className="w-full p-3.5 bg-[#F5F5F3] hover:bg-[#EFEFEA] focus:bg-white border border-[#EAE7DF] rounded-xl text-xs font-bold text-[#0C1D32] focus:outline-none focus:ring-1 focus:ring-[#0C1D32] focus:border-[#0C1D32] transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-[#0C1D32] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-gray" />
                          <span>Alamat Email (Akun)</span>
                        </label>
                        <input
                          type="email"
                          disabled
                          value={profile.email}
                          className="w-full p-3.5 bg-[#EAE7DF]/50 border border-[#EAE7DF] rounded-xl text-xs font-semibold text-gray cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                      <div>
                        <label className="block text-[10px] font-extrabold text-[#0C1D32] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#007AAD]" />
                          <span>No. WhatsApp / Telepon</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.no_hp}
                          onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                          placeholder="Contoh: 081234567890"
                          className="w-full p-3.5 bg-[#F5F5F3] hover:bg-[#EFEFEA] focus:bg-white border border-[#EAE7DF] rounded-xl text-xs font-mono font-bold text-[#0C1D32] focus:outline-none focus:ring-1 focus:ring-[#0C1D32] focus:border-[#0C1D32] transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-[#0C1D32] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-[#007AAD]" />
                          <span>Kampus Surabaya</span>
                        </label>
                        <select
                          value={formData.kampus_id}
                          onChange={(e) => setFormData({ ...formData, kampus_id: e.target.value })}
                          className="w-full p-3.5 bg-[#F5F5F3] hover:bg-[#EFEFEA] focus:bg-white border border-[#EAE7DF] rounded-xl text-xs font-bold text-[#0C1D32] focus:outline-none focus:ring-1 focus:ring-[#0C1D32] focus:border-[#0C1D32] transition-all"
                        >
                          <option value="">Pilih Kampus Anda</option>
                          {campuses.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.nama_kampus}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-[10px] font-extrabold text-[#0C1D32] uppercase tracking-wider flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#007AAD]" />
                          <span>Alamat Kos Lengkap (Titik Penjemputan Kurir)</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsMapOpen(true)}
                          className="px-2.5 py-1 bg-[#007AAD] hover:bg-[#005C82] text-white text-[10px] font-extrabold rounded-lg flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Maps</span>
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={formData.alamat_kos}
                        onChange={(e) => setFormData({ ...formData, alamat_kos: e.target.value })}
                        placeholder="Contoh: Jl. Keputih Tegal Timur No. 12, Sukolilo, Surabaya"
                        className="w-full p-3.5 bg-[#F5F5F3] hover:bg-[#EFEFEA] focus:bg-white border border-[#EAE7DF] rounded-xl text-xs font-bold text-[#0C1D32] focus:outline-none focus:ring-1 focus:ring-[#0C1D32] focus:border-[#0C1D32] transition-all"
                      />
                      <div className="flex items-center justify-between text-[10px] text-gray font-semibold mt-1">
                        <span>*Alamat kos ini digunakan kurir platform BaranginAja untuk penjemputan barang &amp; hitung jarak ongkir.</span>
                        <span className="font-mono text-[#007AAD] font-bold">GPS: {formData.lat.toFixed(4)}, {formData.lng.toFixed(4)}</span>
                      </div>
                    </div>

                    {!profile.is_seller && (
                      <div className="mt-8 p-6 bg-[#0C1D32] text-white rounded-2xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                        <div className="space-y-1">
                          <span className="px-2.5 py-0.5 bg-[#007AAD] text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                            Peluang Cuan Mahasiswa
                          </span>
                          <h4 className="text-base font-black tracking-tight">Punya barang bekas kos tak terpakai?</h4>
                          <p className="text-xs text-gray-300">Dapatkan uang tambahan dengan menjualnya ke sesama mahasiswa di Surabaya. Penjemputan kurir gratis!</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleStartSelling(router)}
                          className="px-6 py-3 bg-[#007AAD] hover:bg-[#005C82] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0 flex items-center gap-2 cursor-pointer"
                        >
                          <Store className="w-4 h-4" />
                          <span>Daftar Jadi Penjual Sekarang</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB: DASHBOARD PENJUALAN (Only for sellers) */}
                {activeTab === 'seller' && profile.is_seller && (
                  <div className="space-y-6">
                    {/* Status Card */}
                    <div className="bg-[#0C1D32] text-white p-6 sm:p-8 rounded-2xl relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Penjual Terverifikasi
                        </div>
                        <h3 className="text-xl font-black tracking-tight">Hub &amp; Dashboard Penjualan</h3>
                        <p className="text-xs text-gray-300">Kelola barang bekas kos yang Anda jual dan pantau transaksi pembeli.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => openSellModal()}
                        className="px-5 py-3 bg-[#007AAD] hover:bg-[#005C82] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0 flex items-center gap-2 cursor-pointer"
                      >
                        <Store className="w-4 h-4" />
                        <span>+ Jual Barang Baru</span>
                      </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-5 bg-[#F8F7F3] border border-[#EAE7DF] rounded-xl space-y-1">
                        <p className="text-[10px] font-extrabold text-gray uppercase tracking-wider">Total Barang Dijual</p>
                        <p className="text-2xl font-black text-[#0C1D32]">{stats.productsCount} Barang</p>
                      </div>

                      <div className="p-5 bg-[#F8F7F3] border border-[#EAE7DF] rounded-xl space-y-1">
                        <p className="text-[10px] font-extrabold text-gray uppercase tracking-wider">Pencairan Dana / Cuan</p>
                        <p className="text-2xl font-black text-[#007AAD]">{formatRupiah(stats.payoutEarned)}</p>
                      </div>

                      <div className="p-5 bg-[#F8F7F3] border border-[#EAE7DF] rounded-xl space-y-1">
                        <p className="text-[10px] font-extrabold text-gray uppercase tracking-wider">Status Rekening Bank</p>
                        <p className="text-xs font-bold text-[#0C1D32] truncate mt-1">
                          {formData.no_rekening ? `${formData.nama_bank} - ${formData.no_rekening}` : 'Belum Diatur'}
                        </p>
                      </div>
                    </div>

                    {/* Quick Action Navigation Buttons */}
                    <div className="flex flex-wrap gap-3 pt-2">
                      <Link
                        href="/seller"
                        className="px-6 py-3 bg-[#0C1D32] hover:bg-[#007AAD] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2"
                      >
                        <Store className="w-4 h-4" />
                        <span>Kelola Semua Produk Penjualan</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => setActiveTab('rekening')}
                        className="px-6 py-3 bg-[#F5F5F3] hover:bg-[#EFEFEA] border border-[#EAE7DF] text-[#0C1D32] text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <CreditCard className="w-4 h-4 text-[#007AAD]" />
                        <span>Pengaturan Rekening Bank</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 2: REKENING BANK (Only for sellers) */}
                {activeTab === 'rekening' && profile.is_seller && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                      <div>
                        <label className="block text-[10px] font-extrabold text-[#0C1D32] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-[#007AAD]" />
                          <span>Nama Bank / E-Wallet</span>
                        </label>
                        <select
                          value={formData.nama_bank}
                          onChange={(e) => setFormData({ ...formData, nama_bank: e.target.value })}
                          className="w-full p-3.5 bg-[#F5F5F3] hover:bg-[#EFEFEA] focus:bg-white border border-[#EAE7DF] rounded-xl text-xs font-bold text-[#0C1D32] focus:outline-none focus:ring-1 focus:ring-[#0C1D32] focus:border-[#0C1D32] transition-all"
                        >
                          <option value="SEABANK">SEABANK</option>
                          <option value="BCA">BCA</option>
                          <option value="MANDIRI">MANDIRI</option>
                          <option value="BRI">BRI</option>
                          <option value="BNI">BNI</option>
                          <option value="GOPAY">GOPAY</option>
                          <option value="DANA">DANA</option>
                          <option value="SHOPEEPAY">SHOPEEPAY</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-[#0C1D32] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-[#007AAD]" />
                          <span>Nomor Rekening / HP E-Wallet</span>
                        </label>
                        <input
                          type="text"
                          value={formData.no_rekening}
                          onChange={(e) => setFormData({ ...formData, no_rekening: e.target.value })}
                          placeholder="Contoh: 1234567890"
                          className="w-full p-3.5 bg-[#F5F5F3] hover:bg-[#EFEFEA] focus:bg-white border border-[#EAE7DF] rounded-xl text-xs font-mono font-bold text-[#0C1D32] focus:outline-none focus:ring-1 focus:ring-[#0C1D32] focus:border-[#0C1D32] transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-[#0C1D32] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#007AAD]" />
                        <span>Nama Pemilik Rekening (Sesuai Buku Tabungan)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.nama_pemilik_rekening}
                        onChange={(e) => setFormData({ ...formData, nama_pemilik_rekening: e.target.value })}
                        placeholder="Nama sesuai di buku rekening / e-wallet"
                        className="w-full p-3.5 bg-[#F5F5F3] hover:bg-[#EFEFEA] focus:bg-white border border-[#EAE7DF] rounded-xl text-xs font-bold text-[#0C1D32] focus:outline-none focus:ring-1 focus:ring-[#0C1D32] focus:border-[#0C1D32] transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 3: KEAMANAN */}
                {activeTab === 'keamanan' && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-[10px] font-extrabold text-[#0C1D32] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-[#007AAD]" />
                        <span>Password Saat Ini</span>
                      </label>
                      <input
                        type="password"
                        value={formData.old_password}
                        onChange={(e) => setFormData({ ...formData, old_password: e.target.value })}
                        placeholder="Masukkan password saat ini"
                        className="w-full p-3.5 bg-[#F5F5F3] hover:bg-[#EFEFEA] focus:bg-white border border-[#EAE7DF] rounded-xl text-xs font-bold text-[#0C1D32] focus:outline-none focus:ring-1 focus:ring-[#0C1D32] focus:border-[#0C1D32] transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                      <div>
                        <label className="block text-[10px] font-extrabold text-[#0C1D32] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-[#007AAD]" />
                          <span>Password Baru</span>
                        </label>
                        <input
                          type="password"
                          value={formData.new_password}
                          onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                          placeholder="Minimal 6 karakter"
                          className="w-full p-3.5 bg-[#F5F5F3] hover:bg-[#EFEFEA] focus:bg-white border border-[#EAE7DF] rounded-xl text-xs font-bold text-[#0C1D32] focus:outline-none focus:ring-1 focus:ring-[#0C1D32] focus:border-[#0C1D32] transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-[#0C1D32] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-[#007AAD]" />
                          <span>Konfirmasi Password Baru</span>
                        </label>
                        <input
                          type="password"
                          value={formData.confirm_password}
                          onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                          placeholder="Ulangi password baru"
                          className="w-full p-3.5 bg-[#F5F5F3] hover:bg-[#EFEFEA] focus:bg-white border border-[#EAE7DF] rounded-xl text-xs font-bold text-[#0C1D32] focus:outline-none focus:ring-1 focus:ring-[#0C1D32] focus:border-[#0C1D32] transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

              </form>
            </div>

            {/* Bottom Update Action Button */}
            {activeTab !== 'seller' && (
              <div className="pt-6 border-t border-[#EAE7DF]">
                <button
                  type="submit"
                  form="profile-form"
                  disabled={saving}
                  className="px-8 py-3.5 bg-[#0C1D32] hover:bg-[#007AAD] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center gap-2.5 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'MEMPROSES...' : 'SIMPAN PERUBAHAN'}</span>
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Map Location Picker Modal */}
      <MapLocationPickerModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        initialLat={formData.lat}
        initialLng={formData.lng}
        initialAddress={formData.alamat_kos}
        onSelectLocation={(data: LocationData) => {
          setFormData((prev) => ({
            ...prev,
            lat: data.lat,
            lng: data.lng,
            alamat_kos: data.alamat_kos,
          }));
        }}
      />
    </main>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-base-white py-20 text-center font-bold text-xs text-gray animate-pulse">Memuat halaman profil...</div>}>
      <ProfilePageContent />
    </Suspense>
  );
}
