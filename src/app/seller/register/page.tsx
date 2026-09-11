'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Store, ShieldCheck, UserCheck, ArrowRight, AlertCircle, MapPin } from 'lucide-react';
import Link from 'next/link';
import MapLocationPickerModal, { LocationData } from '@/components/MapLocationPickerModal';

export default function SellerRegisterPage() {
  const router = useRouter();
  const { user, fetchCurrentUser, openAuthModal } = useAuthStore();

  const [sellerForm, setSellerForm] = useState({
    no_hp: '',
    alamat_kos: '',
    nama_bank: 'SEABANK',
    no_rekening: '',
    nama_pemilik_rekening: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [lat, setLat] = useState<number>(-7.282);
  const [lng, setLng] = useState<number>(112.795);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  useEffect(() => {
    if (user) {
      setSellerForm({
        no_hp: user.no_hp || '',
        alamat_kos: user.alamat_kos || '',
        nama_bank: user.nama_bank || 'SEABANK',
        no_rekening: user.no_rekening || '',
        nama_pemilik_rekening: user.nama_pemilik_rekening || user.nama_lengkap || '',
      });

      // If user is already seller, redirect to /seller
      if (user.is_seller) {
        router.push('/seller');
      }
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      openAuthModal('login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/user/seller-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sellerForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mendaftar sebagai penjual');

      alert(data.message || 'Selamat! Pendaftaran penjual berhasil.');
      await fetchCurrentUser();
      router.push('/seller');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F3] py-12 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">
        <div className="bg-white border border-[#D9E2E9] rounded-2xl p-8 sm:p-10 shadow-sm space-y-6">
          
          <div className="flex items-center gap-4 border-b border-[#D9E2E9] pb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#0C1D32] text-white flex items-center justify-center shrink-0">
              <Store className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#0C1D32] uppercase tracking-tight">
                Pendaftaran Penjual BaranginAja
              </h1>
              <p className="text-xs text-gray mt-1 font-medium">
                Mulai jualan barang kos bekas ke ribuan mahasiswa se-Surabaya tanpa komisi admin!
              </p>
            </div>
          </div>

          {!user ? (
            <div className="bg-[#F0F4F8] p-6 rounded-2xl border border-[#D9E2E9] text-center space-y-4">
              <p className="text-xs font-bold text-[#0C1D32]">Anda perlu masuk ke akun mahasiswa terlebih dahulu untuk mendaftar penjual.</p>
              <button
                onClick={() => openAuthModal('login')}
                className="px-6 py-3 bg-[#0C1D32] hover:bg-[#007AAD] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all"
              >
                Masuk / Login Akun
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block font-extrabold text-[#0C1D32] mb-1.5 uppercase tracking-wider text-[10px]">
                  No. WhatsApp / HP Penjual
                </label>
                <input
                  type="text"
                  required
                  value={sellerForm.no_hp}
                  onChange={(e) => setSellerForm({ ...sellerForm, no_hp: e.target.value })}
                  placeholder="Contoh: 081234567890"
                  className="w-full p-3.5 bg-[#F5F5F3] border border-[#D9E2E9] rounded-xl text-[#0C1D32] font-semibold focus:outline-none focus:ring-1 focus:ring-[#0C1D32]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-extrabold text-[#0C1D32] uppercase tracking-wider text-[10px]">
                    Alamat Kos Lengkap (Titik Penjemputan Kurir)
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
                  required
                  rows={3}
                  value={sellerForm.alamat_kos}
                  onChange={(e) => setSellerForm({ ...sellerForm, alamat_kos: e.target.value })}
                  placeholder="Contoh: Jl. Keputih Tegal Timur No. 12, Sukolilo, Surabaya"
                  className="w-full p-3.5 bg-[#F5F5F3] border border-[#D9E2E9] rounded-xl text-[#0C1D32] font-semibold focus:outline-none focus:ring-1 focus:ring-[#0C1D32]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-extrabold text-[#0C1D32] mb-1.5 uppercase tracking-wider text-[10px]">
                    Nama Bank / E-Wallet
                  </label>
                  <select
                    value={sellerForm.nama_bank}
                    onChange={(e) => setSellerForm({ ...sellerForm, nama_bank: e.target.value })}
                    className="w-full p-3.5 bg-[#F5F5F3] border border-[#D9E2E9] rounded-xl text-[#0C1D32] font-bold focus:outline-none focus:ring-1 focus:ring-[#0C1D32]"
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
                  <label className="block font-extrabold text-[#0C1D32] mb-1.5 uppercase tracking-wider text-[10px]">
                    Nomor Rekening / HP
                  </label>
                  <input
                    type="text"
                    required
                    value={sellerForm.no_rekening}
                    onChange={(e) => setSellerForm({ ...sellerForm, no_rekening: e.target.value })}
                    placeholder="Contoh: 1234567890"
                    className="w-full p-3.5 bg-[#F5F5F3] border border-[#D9E2E9] rounded-xl text-[#0C1D32] font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#0C1D32]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-extrabold text-[#0C1D32] mb-1.5 uppercase tracking-wider text-[10px]">
                  Nama Pemilik Rekening
                </label>
                <input
                  type="text"
                  required
                  value={sellerForm.nama_pemilik_rekening}
                  onChange={(e) => setSellerForm({ ...sellerForm, nama_pemilik_rekening: e.target.value })}
                  placeholder="Nama sesuai buku tabungan"
                  className="w-full p-3.5 bg-[#F5F5F3] border border-[#D9E2E9] rounded-xl text-[#0C1D32] font-bold focus:outline-none focus:ring-1 focus:ring-[#0C1D32]"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#0C1D32] hover:bg-[#007AAD] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{loading ? 'MEMPROSES PENDAFTARAN...' : 'DAFTAR JADI PENJUAL SEKARANG'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          )}

        </div>
      </div>

      {/* Map Location Picker Modal */}
      <MapLocationPickerModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        initialLat={lat}
        initialLng={lng}
        initialAddress={sellerForm.alamat_kos}
        onSelectLocation={(data: LocationData) => {
          setLat(data.lat);
          setLng(data.lng);
          setSellerForm({ ...sellerForm, alamat_kos: data.alamat_kos });
        }}
      />
    </div>
  );
}
