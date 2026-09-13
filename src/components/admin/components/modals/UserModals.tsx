/**
 * @file UserModals.tsx
 * @description Komponen Modal Tambah Akun Baru, Edit Profil & Role User, serta Detail Rincian Akun Database User.
 */

import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Users,
  FileText,
  PhoneCall,
  ExternalLink,
  Edit,
  Trash2,
  Package,
  CheckCircle2,
  ShoppingBag,
  UserCheck,
  Building2,
  CreditCard,
  DollarSign,
} from 'lucide-react';
import { formatRupiah, formatDate } from '@/lib/utils';
import { UserSim, KampusSim, ProductSim, OrderSim } from '../../types/admin';

interface UserModalsProps {
  isCreateUserModalOpen: boolean;
  setIsCreateUserModalOpen: (open: boolean) => void;
  createUserForm: any;
  setCreateUserForm: React.Dispatch<React.SetStateAction<any>>;
  handleCreateUser: (e: React.FormEvent) => void;
  createUserLoading: boolean;

  isEditUserModalOpen: boolean;
  setIsEditUserModalOpen: (open: boolean) => void;
  editUserForm: any;
  setEditUserForm: React.Dispatch<React.SetStateAction<any>>;
  handleEditUserSubmit: (e: React.FormEvent) => void;
  editUserLoading: boolean;

  isDetailUserModalOpen: boolean;
  setIsDetailUserModalOpen: (open: boolean) => void;
  viewingUser: UserSim | null;
  userDetailTab: 'profile' | 'products' | 'sold' | 'orders';
  setUserDetailTab: (tab: 'profile' | 'products' | 'sold' | 'orders') => void;

  campuses: KampusSim[];
  products: ProductSim[];
  orders: OrderSim[];
  handleOpenEditUser: (user: UserSim) => void;
  handleDeleteUser: (userId: string, userName: string) => void;
}

export default function UserModals({
  isCreateUserModalOpen,
  setIsCreateUserModalOpen,
  createUserForm,
  setCreateUserForm,
  handleCreateUser,
  createUserLoading,
  isEditUserModalOpen,
  setIsEditUserModalOpen,
  editUserForm,
  setEditUserForm,
  handleEditUserSubmit,
  editUserLoading,
  isDetailUserModalOpen,
  setIsDetailUserModalOpen,
  viewingUser,
  userDetailTab,
  setUserDetailTab,
  campuses,
  products,
  orders,
  handleOpenEditUser,
  handleDeleteUser,
}: UserModalsProps) {
  return (
    <>
      {/* Modal Create User */}
      <AnimatePresence>
        {isCreateUserModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-sm"
              onClick={() => setIsCreateUserModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 max-w-lg w-full text-[#0F172A] relative shadow-2xl my-8 z-10"
            >
              <button
                onClick={() => setIsCreateUserModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-[#64748B] hover:text-[#0F172A] rounded-full hover:bg-[#F8FAFC] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-base font-black uppercase tracking-wider mb-1">
                Tambah Akun Pengguna Baru
              </h3>
              <p className="text-xs text-[#64748B] mb-6">
                Buat akun buyer, seller, atau admin secara manual dari SIM Control Panel.
              </p>

              <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#0F172A] font-bold mb-1.5 uppercase tracking-wide text-[10px]">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={createUserForm.nama_lengkap}
                    onChange={(e) =>
                      setCreateUserForm({ ...createUserForm, nama_lengkap: e.target.value })
                    }
                    placeholder="Contoh: Budi Santoso"
                    className="w-full p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#0062FF]/20 focus:border-[#0062FF]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#0F172A] font-bold mb-1.5 uppercase tracking-wide text-[10px]">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={createUserForm.email}
                      onChange={(e) => setCreateUserForm({ ...createUserForm, email: e.target.value })}
                      placeholder="nama@email.com"
                      className="w-full p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#0062FF]/20 focus:border-[#0062FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#0F172A] font-bold mb-1.5 uppercase tracking-wide text-[10px]">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={createUserForm.password}
                      onChange={(e) =>
                        setCreateUserForm({ ...createUserForm, password: e.target.value })
                      }
                      placeholder="******"
                      className="w-full p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#0062FF]/20 focus:border-[#0062FF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#0F172A] font-bold mb-1.5 uppercase tracking-wide text-[10px]">
                      No. WhatsApp / HP
                    </label>
                    <input
                      type="text"
                      value={createUserForm.no_hp}
                      onChange={(e) => setCreateUserForm({ ...createUserForm, no_hp: e.target.value })}
                      placeholder="081234567890"
                      className="w-full p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#0062FF]/20 focus:border-[#0062FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#0F172A] font-bold mb-1.5 uppercase tracking-wide text-[10px]">
                      Kampus (Surabaya)
                    </label>
                    <select
                      value={createUserForm.kampus_id}
                      onChange={(e) =>
                        setCreateUserForm({ ...createUserForm, kampus_id: e.target.value })
                      }
                      className="w-full p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#0062FF]/20 focus:border-[#0062FF] cursor-pointer"
                    >
                      <option value="">Pilih Kampus</option>
                      {campuses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nama_kampus}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#0F172A] font-bold mb-1.5 uppercase tracking-wide text-[10px]">
                    Alamat Kos Lengkap
                  </label>
                  <textarea
                    rows={2}
                    value={createUserForm.alamat_kos}
                    onChange={(e) =>
                      setCreateUserForm({ ...createUserForm, alamat_kos: e.target.value })
                    }
                    placeholder="Contoh: Jl. Keputih Tegal Timur No. 12, Sukolilo, Surabaya"
                    className="w-full p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#0062FF]/20 focus:border-[#0062FF]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#0F172A] font-bold mb-1.5 uppercase tracking-wide text-[10px]">
                      Role Akses
                    </label>
                    <select
                      value={createUserForm.role}
                      onChange={(e) => setCreateUserForm({ ...createUserForm, role: e.target.value })}
                      className="w-full p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#0062FF]/20 focus:border-[#0062FF] cursor-pointer"
                    >
                      <option value="BUYER">BUYER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#0F172A] font-bold mb-1.5 uppercase tracking-wide text-[10px]">
                      Status Verifikasi
                    </label>
                    <select
                      value={createUserForm.status_verifikasi}
                      onChange={(e) =>
                        setCreateUserForm({ ...createUserForm, status_verifikasi: e.target.value })
                      }
                      className="w-full p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#0062FF]/20 focus:border-[#0062FF] cursor-pointer"
                    >
                      <option value="VERIFIED">VERIFIED</option>
                      <option value="PENDING">PENDING</option>
                    </select>
                  </div>
                  <div className="flex items-end pb-2">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-xs">
                      <input
                        type="checkbox"
                        checked={createUserForm.is_seller}
                        onChange={(e) =>
                          setCreateUserForm({ ...createUserForm, is_seller: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-[#0062FF] focus:ring-[#0062FF]"
                      />
                      <span>Daftarkan Penjual</span>
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-3">
                  <p className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">
                    Info Rekening Bank (Opsional)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={createUserForm.nama_bank}
                      onChange={(e) =>
                        setCreateUserForm({ ...createUserForm, nama_bank: e.target.value })
                      }
                      placeholder="Nama Bank (BCA/SeaBank)"
                      className="p-2.5 bg-white border border-[#E2E8F0] rounded-lg font-medium focus:outline-none focus:border-[#0062FF]"
                    />
                    <input
                      type="text"
                      value={createUserForm.no_rekening}
                      onChange={(e) =>
                        setCreateUserForm({ ...createUserForm, no_rekening: e.target.value })
                      }
                      placeholder="No. Rekening"
                      className="p-2.5 bg-white border border-[#E2E8F0] rounded-lg font-medium focus:outline-none focus:border-[#0062FF]"
                    />
                    <input
                      type="text"
                      value={createUserForm.nama_pemilik_rekening}
                      onChange={(e) =>
                        setCreateUserForm({
                          ...createUserForm,
                          nama_pemilik_rekening: e.target.value,
                        })
                      }
                      placeholder="Nama Pemilik"
                      className="p-2.5 bg-white border border-[#E2E8F0] rounded-lg font-medium focus:outline-none focus:border-[#0062FF]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={createUserLoading}
                  className="w-full py-3 bg-[#0F172A] hover:bg-black text-white font-bold rounded-xl text-xs shadow-sm transition disabled:opacity-50 cursor-pointer"
                >
                  {createUserLoading ? 'Memproses...' : 'Buat Akun Baru'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Edit User */}
      <AnimatePresence>
        {isEditUserModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-sm"
              onClick={() => setIsEditUserModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 max-w-lg w-full text-[#0F172A] relative shadow-2xl my-8 z-10"
            >
              <button
                onClick={() => setIsEditUserModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-[#64748B] hover:text-[#0F172A] rounded-full hover:bg-[#F8FAFC] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-base font-extrabold uppercase tracking-wider mb-1 text-[#0F172A]">
                Edit Profil &amp; Hak Akses Akun
              </h3>
              <p className="text-xs text-[#64748B] mb-6">
                Perbarui data detail pengguna, role, atau reset password.
              </p>

              <form onSubmit={handleEditUserSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#0F172A] font-extrabold mb-1.5 uppercase tracking-wide text-[10px]">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={editUserForm.nama_lengkap}
                    onChange={(e) =>
                      setEditUserForm({ ...editUserForm, nama_lengkap: e.target.value })
                    }
                    className="w-full p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-medium focus:outline-none focus:border-[#0062FF]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#0F172A] font-extrabold mb-1.5 uppercase tracking-wide text-[10px]">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={editUserForm.email}
                      onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                      className="w-full p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-medium focus:outline-none focus:border-[#0062FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#0F172A] font-extrabold mb-1.5 uppercase tracking-wide text-[10px]">
                      Password Baru (Opsional)
                    </label>
                    <input
                      type="password"
                      value={editUserForm.password}
                      onChange={(e) =>
                        setEditUserForm({ ...editUserForm, password: e.target.value })
                      }
                      placeholder="Kosongkan jika tak diubah"
                      className="w-full p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-medium focus:outline-none focus:border-[#0062FF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#0F172A] font-extrabold mb-1.5 uppercase tracking-wide text-[10px]">
                      No. WhatsApp / HP
                    </label>
                    <input
                      type="text"
                      value={editUserForm.no_hp}
                      onChange={(e) => setEditUserForm({ ...editUserForm, no_hp: e.target.value })}
                      className="w-full p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-medium focus:outline-none focus:border-[#0062FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#0F172A] font-extrabold mb-1.5 uppercase tracking-wide text-[10px]">
                      Kampus (Surabaya)
                    </label>
                    <select
                      value={editUserForm.kampus_id}
                      onChange={(e) =>
                        setEditUserForm({ ...editUserForm, kampus_id: e.target.value })
                      }
                      className="w-full p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-bold focus:outline-none focus:border-[#0062FF] cursor-pointer"
                    >
                      <option value="">Pilih Kampus</option>
                      {campuses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nama_kampus}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#0F172A] font-extrabold mb-1.5 uppercase tracking-wide text-[10px]">
                    Alamat Kos Lengkap
                  </label>
                  <textarea
                    rows={2}
                    value={editUserForm.alamat_kos}
                    onChange={(e) =>
                      setEditUserForm({ ...editUserForm, alamat_kos: e.target.value })
                    }
                    className="w-full p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-medium focus:outline-none focus:border-[#0062FF]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#0F172A] font-extrabold mb-1.5 uppercase tracking-wide text-[10px]">
                      Role Akses
                    </label>
                    <select
                      value={editUserForm.role}
                      onChange={(e) => setEditUserForm({ ...editUserForm, role: e.target.value })}
                      className="w-full p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-bold focus:outline-none focus:border-[#0062FF] cursor-pointer"
                    >
                      <option value="BUYER">BUYER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#0F172A] font-extrabold mb-1.5 uppercase tracking-wide text-[10px]">
                      Status Verifikasi
                    </label>
                    <select
                      value={editUserForm.status_verifikasi}
                      onChange={(e) =>
                        setEditUserForm({ ...editUserForm, status_verifikasi: e.target.value })
                      }
                      className="w-full p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-bold focus:outline-none focus:border-[#0062FF] cursor-pointer"
                    >
                      <option value="VERIFIED">VERIFIED</option>
                      <option value="PENDING">PENDING</option>
                    </select>
                  </div>
                  <div className="flex items-end pb-2">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-[#0F172A]">
                      <input
                        type="checkbox"
                        checked={editUserForm.is_seller}
                        onChange={(e) =>
                          setEditUserForm({ ...editUserForm, is_seller: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-[#0062FF] focus:ring-[#0062FF]"
                      />
                      <span>Daftarkan Penjual</span>
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-3">
                  <p className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">
                    Info Rekening Bank
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={editUserForm.nama_bank}
                      onChange={(e) =>
                        setEditUserForm({ ...editUserForm, nama_bank: e.target.value })
                      }
                      placeholder="Nama Bank"
                      className="p-2.5 bg-white border border-[#E2E8F0] rounded-lg font-medium focus:outline-none focus:border-[#0062FF]"
                    />
                    <input
                      type="text"
                      value={editUserForm.no_rekening}
                      onChange={(e) =>
                        setEditUserForm({ ...editUserForm, no_rekening: e.target.value })
                      }
                      placeholder="No. Rekening"
                      className="p-2.5 bg-white border border-[#E2E8F0] rounded-lg font-medium focus:outline-none focus:border-[#0062FF]"
                    />
                    <input
                      type="text"
                      value={editUserForm.nama_pemilik_rekening}
                      onChange={(e) =>
                        setEditUserForm({ ...editUserForm, nama_pemilik_rekening: e.target.value })
                      }
                      placeholder="Nama Pemilik"
                      className="p-2.5 bg-white border border-[#E2E8F0] rounded-lg font-medium focus:outline-none focus:border-[#0062FF]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={editUserLoading}
                  className="w-full py-3 bg-[#0F172A] hover:bg-black text-white font-bold rounded-xl text-xs shadow-sm transition disabled:opacity-50 cursor-pointer"
                >
                  {editUserLoading ? 'Memperbarui...' : 'Simpan Perubahan Akun'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Detail & Rincian Akun Database */}
      <AnimatePresence>
        {isDetailUserModalOpen && viewingUser && (() => {
          const uProds =
            viewingUser.products && viewingUser.products.length > 0
              ? viewingUser.products
              : products.filter(
                  (p: any) =>
                    p.seller_id === viewingUser.id || p.seller?.email === viewingUser.email
                );
          const uSold = uProds.filter((p: any) => p.status === 'TERJUAL');
          const uOrders = orders.filter(
            (o: any) => o.buyer_id === viewingUser.id || o.buyer?.email === viewingUser.email
          );
          const totalSoldNominal = uSold.reduce(
            (acc: number, item: any) => acc + (item.harga_input || 0),
            0
          );

          const initials = (viewingUser.nama_lengkap || 'US')
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-sm"
                onClick={() => setIsDetailUserModalOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 15 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white border border-[#E2E8F0] rounded-2xl max-w-5xl w-full text-[#0F172A] relative shadow-2xl my-auto max-h-[92vh] flex flex-col overflow-hidden z-10"
              >
                {/* Modal Top Bar */}
                <div className="px-8 py-5 border-b border-[#E2E8F0] flex items-center justify-between bg-white shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-bold">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-black text-[#0F172A] uppercase tracking-wider">
                        Rincian &amp; Informasi Database Akun
                      </h2>
                      <p className="text-[11px] text-[#64748B] font-medium">
                        Akses penuh informasi data user, produk seller, dan riwayat transaksi
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsDetailUserModalOpen(false)}
                    className="p-2 text-[#64748B] hover:text-[#0F172A] rounded-full hover:bg-[#F8FAFC] transition cursor-pointer"
                    title="Tutup Modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Scrollable Content Container */}
                <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                  {/* User Profile Banner Header */}
                  <div className="bg-gradient-to-r from-[#0F172A]/5 via-[#F8FAFC] to-white p-6 rounded-2xl border border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                    <div className="flex items-center gap-4">
                      {/* User Initials Avatar */}
                      <div className="w-16 h-16 rounded-xl bg-[#0F172A] text-white flex items-center justify-center text-xl font-black shadow-md shrink-0 border-2 border-white">
                        {initials}
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xl font-black text-[#0F172A] tracking-wide">
                            {viewingUser.nama_lengkap}
                          </h3>

                          <span className="px-3 py-1 bg-[#0F172A] text-white text-[10px] font-black rounded-full uppercase tracking-wider shadow-xs">
                            {viewingUser.role}
                          </span>

                          <span
                            className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-wider border ${
                              viewingUser.status_verifikasi === 'VERIFIED'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {viewingUser.status_verifikasi}
                          </span>

                          {viewingUser.is_seller && (
                            <span className="px-3 py-1 bg-[#EFF6FF] text-[#0062FF] border border-[#0062FF]/20 font-black text-[10px] rounded-full uppercase tracking-wider">
                              SELLER TERDAFTAR
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 flex-wrap text-xs text-[#64748B] font-medium pt-0.5">
                          <span className="flex items-center gap-1.5 text-[#0F172A] font-semibold">
                            <FileText className="w-3.5 h-3.5 text-[#0F172A]" />
                            {viewingUser.email}
                          </span>

                          {viewingUser.no_hp && (
                            <a
                              href={`https://wa.me/${viewingUser.no_hp.replace(/^0/, '62')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-emerald-700 hover:underline font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200"
                            >
                              <PhoneCall className="w-3 h-3 text-emerald-600" />
                              <span>WA: {viewingUser.no_hp}</span>
                              <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                            </a>
                          )}

                          <span className="text-[#64748B]">
                            Kampus:{' '}
                            <strong className="text-[#0F172A]">
                              {viewingUser.kampus?.nama_kampus || 'Surabaya'}
                            </strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Header Actions */}
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => {
                          setIsDetailUserModalOpen(false);
                          handleOpenEditUser(viewingUser);
                        }}
                        className="px-5 py-2.5 bg-[#0F172A] text-white hover:bg-black text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit Data User</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsDetailUserModalOpen(false);
                          handleDeleteUser(viewingUser.id, viewingUser.nama_lengkap);
                        }}
                        className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                        title="Hapus User"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>

                  {/* Navigation Sub-Tabs */}
                  <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-4 overflow-x-auto custom-scrollbar text-xs font-bold">
                    <button
                      onClick={() => setUserDetailTab('profile')}
                      className={`px-4 py-2.5 rounded-full transition flex items-center gap-2 cursor-pointer ${
                        userDetailTab === 'profile'
                          ? 'bg-[#0F172A] text-white shadow-sm'
                          : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]/50'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      <span>Informasi Database</span>
                    </button>

                    <button
                      onClick={() => setUserDetailTab('products')}
                      className={`px-4 py-2.5 rounded-full transition flex items-center gap-2 cursor-pointer ${
                        userDetailTab === 'products'
                          ? 'bg-[#0F172A] text-white shadow-sm'
                          : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]/50'
                      }`}
                    >
                      <Package className="w-4 h-4" />
                      <span>Produk Upload</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          userDetailTab === 'products'
                            ? 'bg-white/20 text-white'
                            : 'bg-[#EFF6FF] text-[#0062FF]'
                        }`}
                      >
                        {uProds.length}
                      </span>
                    </button>

                    <button
                      onClick={() => setUserDetailTab('sold')}
                      className={`px-4 py-2.5 rounded-full transition flex items-center gap-2 cursor-pointer ${
                        userDetailTab === 'sold'
                          ? 'bg-[#0F172A] text-white shadow-sm'
                          : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]/50'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Produk Terjual</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          userDetailTab === 'sold'
                            ? 'bg-white/20 text-white'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {uSold.length}
                      </span>
                    </button>

                    <button
                      onClick={() => setUserDetailTab('orders')}
                      className={`px-4 py-2.5 rounded-full transition flex items-center gap-2 cursor-pointer ${
                        userDetailTab === 'orders'
                          ? 'bg-[#0F172A] text-white shadow-sm'
                          : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]/50'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Riwayat Pembelian</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          userDetailTab === 'orders'
                            ? 'bg-white/20 text-white'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {uOrders.length}
                      </span>
                    </button>
                  </div>

                  {/* TAB 1: INFORMASI DATABASE LENGKAP */}
                  {userDetailTab === 'profile' && (
                    <div className="space-y-6 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 space-y-3 shadow-xs">
                          <div className="flex items-center gap-2 text-[#0062FF] font-black uppercase text-[11px] tracking-wider pb-2 border-b border-[#E2E8F0]">
                            <UserCheck className="w-4 h-4" />
                            <span>Identitas &amp; Akun</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest block mb-0.5">
                              User ID (UUID)
                            </span>
                            <p className="font-mono text-[#0F172A] font-bold text-[11px] bg-white px-2.5 py-1 rounded-lg border border-[#E2E8F0] select-all truncate">
                              {viewingUser.id}
                            </p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest block mb-0.5">
                              Tanggal Terdaftar
                            </span>
                            <p className="font-bold text-[#0F172A]">
                              {formatDate(viewingUser.created_at || '')}
                            </p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest block mb-0.5">
                              Akses Akun
                            </span>
                            <p className="font-bold text-[#0F172A]">
                              {viewingUser.role} • {viewingUser.status_verifikasi}
                            </p>
                          </div>
                        </div>

                        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 space-y-3 shadow-xs">
                          <div className="flex items-center gap-2 text-[#0062FF] font-black uppercase text-[11px] tracking-wider pb-2 border-b border-[#E2E8F0]">
                            <Building2 className="w-4 h-4" />
                            <span>Kos &amp; Lokasi Kampus</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest block mb-0.5">
                              Kampus Utama
                            </span>
                            <p className="font-bold text-[#0F172A]">
                              {viewingUser.kampus?.nama_kampus || 'Surabaya'}
                            </p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest block mb-0.5">
                              Alamat Kos Lengkap
                            </span>
                            <p className="font-medium text-[#0F172A] leading-relaxed">
                              {viewingUser.alamat_kos || 'Belum diisi'}
                            </p>
                          </div>
                        </div>

                        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 space-y-3 shadow-xs">
                          <div className="flex items-center gap-2 text-emerald-700 font-black uppercase text-[11px] tracking-wider pb-2 border-b border-[#E2E8F0]">
                            <CreditCard className="w-4 h-4" />
                            <span>Pencairan Rekening (Payout)</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest block mb-0.5">
                              Nama Bank
                            </span>
                            <p className="font-extrabold text-[#0F172A]">
                              {viewingUser.nama_bank || '-'}
                            </p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest block mb-0.5">
                              Nomor Rekening
                            </span>
                            <p className="font-mono font-black text-emerald-800 text-sm">
                              {viewingUser.no_rekening || viewingUser.norek_bank || '-'}
                            </p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest block mb-0.5">
                              Atas Nama Pemilik
                            </span>
                            <p className="font-bold text-[#0F172A]">
                              {viewingUser.nama_pemilik_rekening || viewingUser.nama_lengkap || '-'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                        <div className="p-5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] flex items-center justify-between shadow-xs">
                          <div>
                            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                              Total Upload Produk
                            </span>
                            <p className="text-2xl font-black text-[#0062FF] mt-1">
                              {uProds.length} Barang
                            </p>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#0062FF] flex items-center justify-center font-bold">
                            <Package className="w-5 h-5" />
                          </div>
                        </div>

                        <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-200 flex items-center justify-between shadow-xs">
                          <div>
                            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                              Total Barang Terjual
                            </span>
                            <p className="text-2xl font-black text-emerald-700 mt-1">
                              {uSold.length} Barang
                            </p>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                        </div>

                        <div className="p-5 bg-[#EFF6FF] rounded-2xl border border-[#0062FF]/20 flex items-center justify-between shadow-xs">
                          <div>
                            <span className="text-[10px] font-bold text-[#0062FF] uppercase tracking-wider block">
                              Total Hasil Penjualan
                            </span>
                            <p className="text-2xl font-black text-[#0062FF] mt-1">
                              {formatRupiah(totalSoldNominal)}
                            </p>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-[#0062FF]/10 text-[#0062FF] flex items-center justify-center font-bold">
                            <DollarSign className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: PRODUK UPLOAD */}
                  {userDetailTab === 'products' && (
                    <div className="space-y-4">
                      {uProds.length === 0 ? (
                        <div className="p-12 text-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl text-[#64748B] space-y-2">
                          <Package className="w-10 h-10 mx-auto text-[#64748B]/40" />
                          <p className="text-sm font-bold text-[#0F172A]">Belum ada barang diunggah</p>
                          <p className="text-xs">User ini belum mengunggah produk barang bekas ke catalog.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
                          {uProds.map((p: any) => (
                            <div
                              key={p.id}
                              className="p-4 bg-white border border-[#E2E8F0] rounded-2xl flex items-center justify-between gap-4 hover:border-[#0062FF]/40 transition shadow-xs"
                            >
                              <div className="flex items-center gap-3.5 min-w-0">
                                <div className="w-16 h-16 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] overflow-hidden shrink-0">
                                  <img
                                    src={
                                      p.foto_urls
                                        ? typeof p.foto_urls === 'string'
                                          ? JSON.parse(p.foto_urls)[0]
                                          : p.foto_urls[0]
                                        : '/logo.png'
                                    }
                                    alt={p.nama_barang}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = '/logo.png';
                                    }}
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-extrabold text-sm text-[#0F172A] truncate">
                                    {p.nama_barang}
                                  </p>
                                  <p className="text-[11px] text-[#64748B] mt-0.5">
                                    Kondisi: {p.kondisi || 'BEKAS'}
                                  </p>
                                  <p className="text-[10px] text-[#64748B] font-mono mt-0.5">
                                    Post: {formatDate(p.created_at)}
                                  </p>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span
                                  className={`px-2.5 py-0.5 text-[9px] font-black rounded-full border uppercase ${
                                    p.status === 'TERJUAL'
                                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                                      : p.status === 'DIPESAN'
                                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  }`}
                                >
                                  {p.status || 'AVAILABLE'}
                                </span>
                                <p className="font-black text-[#0062FF] text-base mt-1">
                                  {formatRupiah(p.harga_jual)}
                                </p>
                                <p className="text-[10px] text-[#64748B] font-medium">
                                  Harga Seller: {formatRupiah(p.harga_input)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: PRODUK TERJUAL */}
                  {userDetailTab === 'sold' && (
                    <div className="space-y-4">
                      <div className="p-5 bg-gradient-to-r from-emerald-50 via-emerald-50/50 to-white border border-emerald-200 rounded-2xl flex items-center justify-between shadow-xs">
                        <div>
                          <p className="font-black text-sm text-emerald-900">
                            Total Nominal Penjualan Seller Selesai
                          </p>
                          <p className="text-xs text-emerald-700 mt-0.5">
                            Estimasi nominal murni yang siap/telah dicairkan ke rekening seller
                          </p>
                        </div>
                        <span className="text-2xl font-black text-emerald-700">
                          {formatRupiah(totalSoldNominal)}
                        </span>
                      </div>

                      {uSold.length === 0 ? (
                        <div className="p-12 text-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl text-[#64748B] space-y-2">
                          <CheckCircle2 className="w-10 h-10 mx-auto text-[#64748B]/40" />
                          <p className="text-sm font-bold text-[#0F172A]">Belum ada produk terjual</p>
                          <p className="text-xs">Belum ada barang milik seller ini yang berstatus TERJUAL.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
                          {uSold.map((p: any) => (
                            <div
                              key={p.id}
                              className="p-4 bg-white border border-[#E2E8F0] rounded-2xl flex items-center justify-between gap-4 shadow-xs"
                            >
                              <div className="flex items-center gap-3.5 min-w-0">
                                <div className="w-16 h-16 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] overflow-hidden shrink-0">
                                  <img
                                    src={
                                      p.foto_urls
                                        ? typeof p.foto_urls === 'string'
                                          ? JSON.parse(p.foto_urls)[0]
                                          : p.foto_urls[0]
                                        : '/logo.png'
                                    }
                                    alt={p.nama_barang}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = '/logo.png';
                                    }}
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-extrabold text-sm text-[#0F172A] truncate">
                                    {p.nama_barang}
                                  </p>
                                  <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 text-[9px] font-black rounded-md uppercase inline-block mt-1">
                                    TERJUAL
                                  </span>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <p className="text-[10px] text-[#64748B] uppercase font-bold">
                                  Hasil Seller
                                </p>
                                <p className="font-black text-emerald-700 text-base">
                                  {formatRupiah(p.harga_input)}
                                </p>
                                <p className="text-[10px] text-[#64748B]">
                                  Katalog: {formatRupiah(p.harga_jual)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 4: RIWAYAT PEMBELIAN */}
                  {userDetailTab === 'orders' && (
                    <div className="space-y-4">
                      {uOrders.length === 0 ? (
                        <div className="p-12 text-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl text-[#64748B] space-y-2">
                          <ShoppingBag className="w-10 h-10 mx-auto text-[#64748B]/40" />
                          <p className="text-sm font-bold text-[#0F172A]">Belum ada transaksi pembelian</p>
                          <p className="text-xs">
                            User ini belum pernah melakukan pemesanan barang sebagai buyer.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
                          {uOrders.map((o: any) => (
                            <div
                              key={o.id}
                              className="p-4 bg-white border border-[#E2E8F0] rounded-2xl flex items-center justify-between gap-4 shadow-xs hover:border-[#0062FF]/40 transition"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-xs text-[#0F172A]">
                                    #{o.id.substring(0, 8)}
                                  </span>
                                  <span className="px-2.5 py-0.5 bg-[#EFF6FF] text-[#0062FF] border border-[#0062FF]/20 text-[10px] font-black rounded-full uppercase">
                                    {o.status}
                                  </span>
                                </div>
                                <p className="font-bold text-sm text-[#0F172A]">
                                  {o.product?.nama_barang || 'Produk'}
                                </p>
                                <p className="text-[11px] text-[#64748B] font-mono">
                                  Waktu Transaksi: {formatDate(o.created_at)}
                                </p>
                              </div>

                              <div className="text-right shrink-0">
                                <p className="text-[10px] text-[#64748B] uppercase font-bold">
                                  Total Dibayar
                                </p>
                                <p className="font-black text-[#0062FF] text-base">
                                  {formatRupiah(o.total_harga)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Modal Footer Bar */}
                <div className="px-8 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between shrink-0 text-xs">
                  <span className="text-[#64748B] font-medium">
                    ID Database:{' '}
                    <strong className="font-mono text-[#0F172A] select-all">{viewingUser.id}</strong>
                  </span>

                  <button
                    onClick={() => setIsDetailUserModalOpen(false)}
                    className="px-6 py-2.5 bg-[#0F172A] hover:bg-black text-white font-bold rounded-xl transition cursor-pointer"
                  >
                    Tutup Rincian
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </>
  );
}
