/**
 * @file CampusModals.tsx
 * @description Komponen Modal Tambah Kampus Baru, Edit Data Kampus, dan Detail Akun Mahasiswa Terdaftar di Kampus.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, Users, Store, ShieldCheck, Search, PhoneCall, Eye } from 'lucide-react';
import { KampusSim, UserSim } from '../../types/admin';

interface CampusModalsProps {
  isCampusModalOpen: boolean;
  setIsCampusModalOpen: (open: boolean) => void;
  newCampusForm: { nama_kampus: string; kota: string };
  setNewCampusForm: React.Dispatch<React.SetStateAction<{ nama_kampus: string; kota: string }>>;
  handleAddCampus: (e: React.FormEvent) => void;
  campusLoading: boolean;

  isEditCampusModalOpen: boolean;
  setIsEditCampusModalOpen: (open: boolean) => void;
  editCampusForm: { id: string; nama_kampus: string; kota: string; aktif: boolean };
  setEditCampusForm: React.Dispatch<
    React.SetStateAction<{ id: string; nama_kampus: string; kota: string; aktif: boolean }>
  >;
  handleEditCampusSubmit: (e: React.FormEvent) => void;

  isCampusDetailModalOpen: boolean;
  setIsCampusDetailModalOpen: (open: boolean) => void;
  viewingCampus: KampusSim | null;
  campusUserSearchQuery: string;
  setCampusUserSearchQuery: (query: string) => void;
  users: UserSim[];
  handleOpenDetailUser: (user: UserSim) => void;
}

export default function CampusModals({
  isCampusModalOpen,
  setIsCampusModalOpen,
  newCampusForm,
  setNewCampusForm,
  handleAddCampus,
  campusLoading,
  isEditCampusModalOpen,
  setIsEditCampusModalOpen,
  editCampusForm,
  setEditCampusForm,
  handleEditCampusSubmit,
  isCampusDetailModalOpen,
  setIsCampusDetailModalOpen,
  viewingCampus,
  campusUserSearchQuery,
  setCampusUserSearchQuery,
  users,
  handleOpenDetailUser,
}: CampusModalsProps) {
  return (
    <>
      {/* Modal Add Campus */}
      <AnimatePresence>
        {isCampusModalOpen && (
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
              onClick={() => setIsCampusModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-8 max-w-md w-full text-[#0F172A] relative shadow-2xl z-10"
            >
              <button
                onClick={() => setIsCampusModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-[#64748B] hover:text-[#0F172A] rounded-full hover:bg-[#F8FAFC] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-base font-black uppercase tracking-wider mb-1">
                Tambah Kampus Baru
              </h3>
              <p className="text-xs text-[#64748B] mb-6">
                Daftarkan perguruan tinggi mitra baru ke dalam sistem BaranginAja.
              </p>

              <form onSubmit={handleAddCampus} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#0F172A] font-bold mb-1.5 uppercase tracking-wide text-[10px]">
                    Nama Kampus *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCampusForm.nama_kampus}
                    onChange={(e) =>
                      setNewCampusForm({ ...newCampusForm, nama_kampus: e.target.value })
                    }
                    placeholder="Contoh: UPN Veteran Jawa Timur"
                    className="w-full p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#0062FF]/20 focus:border-[#0062FF]"
                  />
                </div>

                <div>
                  <label className="block text-[#0F172A] font-bold mb-1.5 uppercase tracking-wide text-[10px]">
                    Kota Lokasi *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCampusForm.kota}
                    onChange={(e) =>
                      setNewCampusForm({ ...newCampusForm, kota: e.target.value })
                    }
                    placeholder="Surabaya"
                    className="w-full p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#0062FF]/20 focus:border-[#0062FF]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={campusLoading}
                  className="w-full py-3 bg-[#0F172A] hover:bg-black text-white font-bold rounded-xl text-xs shadow-sm transition disabled:opacity-50 cursor-pointer"
                >
                  {campusLoading ? 'Menyimpan...' : 'Simpan Kampus Baru'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Edit Campus */}
      <AnimatePresence>
        {isEditCampusModalOpen && (
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
              onClick={() => setIsEditCampusModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-8 max-w-md w-full text-[#0F172A] relative shadow-2xl z-10"
            >
              <button
                onClick={() => setIsEditCampusModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-[#64748B] hover:text-[#0F172A] rounded-full hover:bg-[#F8FAFC] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-base font-black uppercase tracking-wider mb-1">
                Edit Data Kampus
              </h3>
              <p className="text-xs text-[#64748B] mb-6">
                Perbarui nama, kota, atau status aktif jaringan kampus.
              </p>

              <form onSubmit={handleEditCampusSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#0F172A] font-bold mb-1.5 uppercase tracking-wide text-[10px]">
                    Nama Kampus *
                  </label>
                  <input
                    type="text"
                    required
                    value={editCampusForm.nama_kampus}
                    onChange={(e) =>
                      setEditCampusForm({ ...editCampusForm, nama_kampus: e.target.value })
                    }
                    className="w-full p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#0062FF]/20 focus:border-[#0062FF]"
                  />
                </div>

                <div>
                  <label className="block text-[#0F172A] font-bold mb-1.5 uppercase tracking-wide text-[10px]">
                    Kota Lokasi *
                  </label>
                  <input
                    type="text"
                    required
                    value={editCampusForm.kota}
                    onChange={(e) =>
                      setEditCampusForm({ ...editCampusForm, kota: e.target.value })
                    }
                    className="w-full p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#0062FF]/20 focus:border-[#0062FF]"
                  />
                </div>

                <div>
                  <label className="block text-[#0F172A] font-bold mb-1.5 uppercase tracking-wide text-[10px]">
                    Status Keaktifan
                  </label>
                  <select
                    value={editCampusForm.aktif ? 'true' : 'false'}
                    onChange={(e) =>
                      setEditCampusForm({ ...editCampusForm, aktif: e.target.value === 'true' })
                    }
                    className="w-full p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#0062FF]/20 focus:border-[#0062FF] cursor-pointer"
                  >
                    <option value="true">AKTIF (Dapat Digunakan Mahasiswa)</option>
                    <option value="false">NON-AKTIF (Diarsipkan)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={campusLoading}
                  className="w-full py-3 bg-[#0F172A] hover:bg-black text-white font-bold rounded-xl text-xs shadow-sm transition disabled:opacity-50 cursor-pointer"
                >
                  {campusLoading ? 'Memperbarui...' : 'Simpan Perubahan Kampus'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Detail Akun Terdaftar di Kampus */}
      <AnimatePresence>
        {isCampusDetailModalOpen && viewingCampus && (() => {
          const campusUsers = users.filter(
            (u) =>
              u.kampus_id === viewingCampus.id ||
              u.kampus?.id === viewingCampus.id ||
              u.kampus?.nama_kampus === viewingCampus.nama_kampus
          );
          const filteredCampusUsers = campusUsers.filter((u) => {
            const q = campusUserSearchQuery.toLowerCase().trim();
            return (
              !q ||
              u.nama_lengkap?.toLowerCase().includes(q) ||
              u.email?.toLowerCase().includes(q) ||
              u.no_hp?.toLowerCase().includes(q) ||
              u.role?.toLowerCase().includes(q)
            );
          });

          const sellerCount = campusUsers.filter((u) => u.is_seller).length;
          const buyerCount = campusUsers.filter((u) => u.role === 'BUYER').length;
          const adminCount = campusUsers.filter((u) => u.role === 'ADMIN').length;

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
                onClick={() => setIsCampusDetailModalOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 15 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white border border-[#E2E8F0] rounded-2xl max-w-4xl w-full text-[#0F172A] relative shadow-2xl my-auto max-h-[90vh] flex flex-col overflow-hidden z-10"
              >
                {/* Header Banner Modal */}
                <div className="p-6 sm:p-8 bg-gradient-to-r from-[#0F172A]/5 via-[#F8FAFC] to-white border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-bold shadow-md shrink-0">
                      <Building2 className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-lg font-black text-[#0F172A] tracking-wide">
                          {viewingCampus.nama_kampus}
                        </h2>
                        <span
                          className={`px-2.5 py-0.5 text-[9px] font-black rounded-full uppercase border ${
                            viewingCampus.aktif !== false
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {viewingCampus.aktif !== false ? 'AKTIF' : 'NON-AKTIF'}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] font-medium mt-0.5">
                        Kota: <strong className="text-[#0F172A]">{viewingCampus.kota || 'Surabaya'}</strong> •
                        ID: <span className="font-mono">{viewingCampus.id.substring(0, 8)}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsCampusDetailModalOpen(false)}
                    className="p-2 text-[#64748B] hover:text-[#0F172A] rounded-full hover:bg-[#F8FAFC] transition cursor-pointer self-start sm:self-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body Content Area */}
                <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
                  {/* Summary Metric Chips */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0F172A]/10 text-[#0F172A] flex items-center justify-center font-bold">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[#64748B] uppercase">Total Akun Kampus</p>
                        <p className="text-base font-black text-[#0F172A]">{campusUsers.length} Mahasiswa</p>
                      </div>
                    </div>

                    <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-emerald-700 uppercase">Status Penjual (Seller)</p>
                        <p className="text-base font-black text-emerald-900">{sellerCount} Penjual Terverifikasi</p>
                      </div>
                    </div>

                    <div className="p-4 bg-[#EFF6FF] border border-[#0062FF]/20 rounded-xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0062FF] text-white flex items-center justify-center font-bold">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[#0062FF] uppercase">Buyer &amp; Admin</p>
                        <p className="text-base font-black text-[#0062FF]">{buyerCount} Buyer • {adminCount} Admin</p>
                      </div>
                    </div>
                  </div>

                  {/* Search Bar for Campus Users */}
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                    <input
                      type="text"
                      value={campusUserSearchQuery}
                      onChange={(e) => setCampusUserSearchQuery(e.target.value)}
                      placeholder={`Cari nama / email mahasiswa di ${viewingCampus.nama_kampus}...`}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:border-[#0062FF] focus:ring-2 focus:ring-[#0062FF]/20"
                    />
                  </div>

                  {/* Table of Campus Users */}
                  {filteredCampusUsers.length === 0 ? (
                    <div className="p-10 text-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#64748B] space-y-2">
                      <Users className="w-8 h-8 mx-auto text-[#64748B]/40" />
                      <p className="text-xs">
                        {campusUserSearchQuery
                          ? 'Tidak ada mahasiswa yang cocok dengan pencarian.'
                          : 'Belum ada akun user yang terhubung dengan kampus ini.'}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-[#E2E8F0] rounded-xl">
                      <table className="w-full text-left text-xs text-[#0F172A]">
                        <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase text-[10px] font-bold">
                          <tr>
                            <th className="p-3.5">Nama &amp; Kontak User</th>
                            <th className="p-3.5">Role &amp; Status</th>
                            <th className="p-3.5">Alamat Kos</th>
                            <th className="p-3.5 text-center">Aksi Rincian</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E8F0]">
                          {filteredCampusUsers.map((u) => (
                            <tr key={u.id} className="hover:bg-[#F8FAFC] transition">
                              <td className="p-3.5">
                                <p className="font-extrabold text-[#0F172A]">{u.nama_lengkap}</p>
                                <p className="text-[11px] text-[#64748B]">{u.email}</p>
                                {u.no_hp && (
                                  <a
                                    href={`https://wa.me/${u.no_hp.replace(/^0/, '62')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] text-emerald-700 font-bold hover:underline inline-flex items-center gap-1 mt-0.5"
                                  >
                                    <PhoneCall className="w-3 h-3 text-emerald-600" />
                                    <span>WA: {u.no_hp}</span>
                                  </a>
                                )}
                              </td>
                              <td className="p-3.5">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="px-2.5 py-0.5 bg-[#0F172A] text-white text-[9px] font-black rounded-md uppercase">
                                    {u.role}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 text-[9px] font-black rounded-md uppercase border ${
                                      u.status_verifikasi === 'VERIFIED'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : 'bg-amber-50 text-amber-700 border-amber-200'
                                    }`}
                                  >
                                    {u.status_verifikasi}
                                  </span>
                                  {u.is_seller && (
                                    <span className="px-2 py-0.5 bg-[#EFF6FF] text-[#0062FF] border border-[#0062FF]/20 font-black text-[9px] rounded-md uppercase">
                                      PENJUAL
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="p-3.5">
                                <p
                                  className="text-[11px] text-[#0F172A] line-clamp-1 max-w-[220px]"
                                  title={u.alamat_kos || ''}
                                >
                                  {u.alamat_kos || '-'}
                                </p>
                              </td>
                              <td className="p-3.5 text-center">
                                <button
                                  onClick={() => {
                                    setIsCampusDetailModalOpen(false);
                                    handleOpenDetailUser(u);
                                  }}
                                  className="px-3 py-1.5 bg-[#EFF6FF] hover:bg-[#0062FF]/15 text-[#0062FF] font-bold rounded-xl border border-[#0062FF]/20 transition flex items-center gap-1.5 mx-auto cursor-pointer"
                                  title="Lihat Rincian Akun & Produk Seller"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Lihat Akun</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="px-8 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between shrink-0 text-xs">
                  <span className="text-[#64748B] font-medium">
                    Menampilkan <strong className="text-[#0F172A]">{filteredCampusUsers.length}</strong> dari{' '}
                    {campusUsers.length} akun terdaftar di {viewingCampus.nama_kampus}
                  </span>

                  <button
                    onClick={() => setIsCampusDetailModalOpen(false)}
                    className="px-6 py-2.5 bg-[#0F172A] hover:bg-black text-white font-bold rounded-xl transition cursor-pointer"
                  >
                    Tutup
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
