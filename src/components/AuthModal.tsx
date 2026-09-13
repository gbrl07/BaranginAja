'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User, ShieldCheck, CheckCircle2, AlertCircle, MapPin, Building2, ChevronRight } from 'lucide-react';
import MapLocationPickerModal, { LocationData } from '@/components/MapLocationPickerModal';


export default function AuthModal() {
  const { isAuthModalOpen, authModalMode, closeAuthModal, setUser } = useAuthStore();
  const [isLogin, setIsLogin] = useState(authModalMode === 'login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [nama_lengkap, setNamaLengkap] = useState('');
  const [no_hp, setNoHp] = useState('');
  const [kampus_id, setKampusId] = useState('');
  const [alamat_kos, setAlamatKos] = useState('');
  const [lat, setLat] = useState<number>(-7.282);
  const [lng, setLng] = useState<number>(112.795);
  const [isMapOpen, setIsMapOpen] = useState(false);
  
  const [campuses, setCampuses] = useState<any[]>([]);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setIsLogin(authModalMode === 'login');
  }, [authModalMode]);

  useEffect(() => {
    if (isAuthModalOpen && !isLogin) {
      fetch('/api/campuses')
        .then((res) => res.json())
        .then((data) => setCampuses(data.campuses || []))
        .catch((err) => console.error(err));
    }
  }, [isAuthModalOpen, isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin 
      ? { email, password } 
      : { nama_lengkap, email, password, no_hp, kampus_id, alamat_kos, lat, lng };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Terjadi kesalahan');
      }

      if (isLogin) {
        setUser(data.user);
        const isAdmin = data.user?.role?.toUpperCase() === 'ADMIN';
        if (isAdmin) {
          setSuccessMsg('Berhasil masuk. Mengalihkan ke Dashboard Admin...');
          setTimeout(() => {
            closeAuthModal();
            window.location.href = '/admin';
          }, 600);
        } else {
          setSuccessMsg('Berhasil masuk.');
          setTimeout(() => closeAuthModal(), 1000);
        }
      } else {
        setSuccessMsg('Pendaftaran berhasil.');
        setTimeout(() => {
          setIsLogin(true);
          setPassword('');
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: demoPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal');

      setUser(data.user);
      const isAdmin = data.user?.role?.toUpperCase() === 'ADMIN';
      if (isAdmin) {
        setSuccessMsg('Masuk. Mengalihkan ke Dashboard Admin...');
        setTimeout(() => {
          closeAuthModal();
          window.location.href = '/admin';
        }, 500);
      } else {
        setSuccessMsg('Masuk...');
        setTimeout(() => closeAuthModal(), 900);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isAuthModalOpen && (
          <motion.div
            key="auth-modal-dialog-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeAuthModal}
              className="absolute inset-0 bg-base-white/60 backdrop-blur-xl"
            />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-[400px] bg-base-white rounded-2xl shadow-premium overflow-hidden border border-gray-light max-h-[90vh] overflow-y-auto custom-scrollbar z-10"
          >
            <button
              onClick={closeAuthModal}
              className="absolute top-6 right-6 p-2 rounded-full text-gray hover:text-base-dark transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 md:p-10">
              <div className="flex justify-center mb-8">
                 <div className="w-12 h-12 flex items-center justify-center">
                  <Image src="/logo.png" alt="BaranginAja Logo" width={48} height={48} className="object-contain w-full h-full" />
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-black text-base-dark tracking-wide uppercase mb-2">
                  {isLogin ? 'Masuk' : 'Daftar'}
                </h2>
                <p className="text-[10px] text-gray uppercase tracking-widest font-bold">
                  {isLogin ? 'Lanjutkan perjalanan Anda' : 'Bergabunglah dengan kami'}
                </p>
              </div>

              {isLogin && (
                <div className="mb-6 grid grid-cols-3 gap-2">
                  <button
                    suppressHydrationWarning
                    type="button"
                    onClick={() => handleQuickLogin('user@barangin.com', 'user123')}
                    className="py-2.5 px-1 bg-base-light text-base-dark text-[9px] uppercase font-bold tracking-wider rounded-xl hover:bg-gray-light transition-colors text-center"
                    title="Demo Pembeli (Belum Penjual)"
                  >
                    Demo Pembeli
                  </button>
                  <button
                    suppressHydrationWarning
                    type="button"
                    onClick={() => handleQuickLogin('seller@barangin.com', 'user123')}
                    className="py-2.5 px-1 bg-base-light text-base-dark text-[9px] uppercase font-bold tracking-wider rounded-xl hover:bg-gray-light transition-colors text-center"
                    title="Demo Penjual (Sudah Mendaftar Penjual)"
                  >
                    Demo Penjual
                  </button>
                  <button
                    suppressHydrationWarning
                    type="button"
                    onClick={() => handleQuickLogin('admin@barangin.com', 'admin123')}
                    className="py-2.5 px-1 bg-base-light text-base-dark text-[9px] uppercase font-bold tracking-wider rounded-xl hover:bg-gray-light transition-colors text-center"
                    title="Demo System Admin"
                  >
                    Demo Admin
                  </button>
                </div>
              )}

              {error && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-6 text-center text-red-500 text-[10px] uppercase font-bold tracking-wider"
                >
                  {error}
                </motion.div>
              )}

              {successMsg && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-6 text-center text-primary text-[10px] uppercase font-bold tracking-wider"
                >
                  {successMsg}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div>
                      <input
                        type="text"
                        required
                        value={nama_lengkap}
                        onChange={(e) => setNamaLengkap(e.target.value)}
                        placeholder="NAMA LENGKAP"
                        className="w-full bg-transparent border-b border-gray-light py-3 text-xs focus:outline-none focus:border-base-dark transition-colors text-base-dark placeholder-gray uppercase tracking-widest"
                      />
                    </div>
                    
                    <div>
                      <select
                        required
                        value={kampus_id}
                        onChange={(e) => setKampusId(e.target.value)}
                        className="w-full bg-transparent border-b border-gray-light py-3 text-xs focus:outline-none focus:border-base-dark transition-colors text-base-dark appearance-none uppercase tracking-widest"
                      >
                        <option value="">PILIH KAMPUS</option>
                        {campuses.map(c => (
                          <option key={c.id} value={c.id}>{c.nama_kampus}</option>
                        ))}
                      </select>
                    </div>

                    <div className="relative flex items-center border-b border-gray-light focus-within:border-base-dark transition-colors">
                      <input
                        type="text"
                        required
                        value={alamat_kos}
                        onChange={(e) => setAlamatKos(e.target.value)}
                        placeholder="ALAMAT LENGKAP KOS"
                        className="w-full bg-transparent py-3 pr-24 text-xs focus:outline-none text-base-dark placeholder-gray uppercase tracking-widest"
                      />
                      <button
                        type="button"
                        onClick={() => setIsMapOpen(true)}
                        className="absolute right-0 px-2.5 py-1 bg-[#007AAD] hover:bg-[#005C82] text-white text-[10px] font-extrabold rounded-lg flex items-center gap-1 transition-colors cursor-pointer shadow-xs shrink-0"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Maps</span>
                      </button>
                    </div>

                    <div>
                      <input
                        type="text"
                        required
                        value={no_hp}
                        onChange={(e) => setNoHp(e.target.value)}
                        placeholder="NO. WHATSAPP"
                        className="w-full bg-transparent border-b border-gray-light py-3 text-xs focus:outline-none focus:border-base-dark transition-colors text-base-dark placeholder-gray uppercase tracking-widest"
                      />
                    </div>
                  </motion.div>
                )}

                <div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="EMAIL"
                    className="w-full bg-transparent border-b border-gray-light py-3 text-xs focus:outline-none focus:border-base-dark transition-colors text-base-dark placeholder-gray uppercase tracking-widest"
                  />
                </div>

                <div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="PASSWORD"
                    className="w-full bg-transparent border-b border-gray-light py-3 text-xs focus:outline-none focus:border-base-dark transition-colors text-base-dark placeholder-gray uppercase tracking-widest"
                  />
                </div>

                <button
                  suppressHydrationWarning
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 mt-8 bg-primary hover:bg-primary-dark text-base-white text-xs font-bold uppercase tracking-widest rounded-full transition-colors disabled:opacity-50"
                >
                  {loading ? 'MEMPROSES...' : isLogin ? 'MASUK' : 'DAFTAR'}
                </button>
              </form>

              <div className="mt-8 text-center">
                <button
                  suppressHydrationWarning
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }}
                  className="text-[10px] font-bold text-gray hover:text-base-dark transition-colors uppercase tracking-widest border-b border-transparent hover:border-base-dark pb-0.5"
                >
                  {isLogin ? 'BUAT AKUN BARU' : 'KEMBALI KE LOGIN'}
                </button>
              </div>
            </div>
          </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Location Picker Modal */}
      <MapLocationPickerModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        initialLat={lat}
        initialLng={lng}
        initialAddress={alamat_kos}
        onSelectLocation={(data) => {
          setLat(data.lat);
          setLng(data.lng);
          setAlamatKos(data.alamat_kos);
        }}
      />
    </>
  );
}
