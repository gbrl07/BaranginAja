/**
 * @file UsersTab.tsx
 * @description Komponen Tab Manajemen Pengguna (Users) SIM Admin.
 * Mengelola daftar akun buyer, seller, dan admin, verifikasi seller, perancangan role, dan aksi CRUD.
 */

import { Search, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { UserSim } from '../../types/admin';

interface UsersTabProps {
  users: UserSim[];
  filteredUsers: UserSim[];
  userSearchQuery: string;
  setUserSearchQuery: (query: string) => void;
  userRoleFilter: 'ALL' | 'BUYER' | 'SELLER' | 'ADMIN';
  setUserRoleFilter: (role: 'ALL' | 'BUYER' | 'SELLER' | 'ADMIN') => void;
  userStatusFilter: 'ALL' | 'VERIFIED' | 'PENDING';
  setUserStatusFilter: (status: 'ALL' | 'VERIFIED' | 'PENDING') => void;
  setIsCreateUserModalOpen: (open: boolean) => void;
  handleOpenDetailUser: (user: UserSim) => void;
  handleOpenEditUser: (user: UserSim) => void;
  handleDeleteUser: (userId: string, userName: string) => void;
  handleChangeUserRole: (userId: string, newRole: string) => void;
  handleVerifySeller: (userId: string, currentStatus: string) => void;
  currentAdminId?: string;
}

export default function UsersTab({
  users,
  filteredUsers,
  userSearchQuery,
  setUserSearchQuery,
  userRoleFilter,
  setUserRoleFilter,
  userStatusFilter,
  setUserStatusFilter,
  setIsCreateUserModalOpen,
  handleOpenDetailUser,
  handleOpenEditUser,
  handleDeleteUser,
  handleChangeUserRole,
  handleVerifySeller,
  currentAdminId,
}: UsersTabProps) {
  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-base font-black text-[#0F172A] uppercase tracking-wider">
            Manajemen Akun Pengguna ({users.length} Akun)
          </h2>
          <p className="text-xs text-[#64748B]">
            Kelola profil user, verifikasi status seller, atur role admin, dan buat akun baru.
          </p>
        </div>
        <button
          onClick={() => setIsCreateUserModalOpen(true)}
          className="px-5 py-2.5 bg-[#0F172A] hover:bg-black text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Tambah Akun Baru
        </button>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-xs">
          <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Total Pengguna</p>
          <p className="text-xl font-black text-[#0F172A] mt-1">{users.length}</p>
        </div>
        <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-xs">
          <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Penjual (Seller)</p>
          <p className="text-xl font-black text-[#0062FF] mt-1">
            {users.filter((u) => u.is_seller).length}
          </p>
        </div>
        <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-xs">
          <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Pending Verifikasi</p>
          <p className="text-xl font-black text-[#B45309] mt-1">
            {users.filter((u) => u.status_verifikasi === 'PENDING').length}
          </p>
        </div>
        <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-xs">
          <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Administrator</p>
          <p className="text-xl font-black text-rose-600 mt-1">
            {users.filter((u) => u.role === 'ADMIN').length}
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            value={userSearchQuery}
            onChange={(e) => setUserSearchQuery(e.target.value)}
            placeholder="Cari nama, email, no HP, atau kampus..."
            className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0062FF]/20 focus:border-[#0062FF]"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={userRoleFilter}
            onChange={(e: any) => setUserRoleFilter(e.target.value)}
            className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0062FF]/20 focus:border-[#0062FF] cursor-pointer"
          >
            <option value="ALL">Semua Role</option>
            <option value="BUYER">Buyer / Mahasiswa</option>
            <option value="SELLER">Seller / Penjual</option>
            <option value="ADMIN">Admin</option>
          </select>
          <select
            value={userStatusFilter}
            onChange={(e: any) => setUserStatusFilter(e.target.value)}
            className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0062FF]/20 focus:border-[#0062FF] cursor-pointer"
          >
            <option value="ALL">Semua Status</option>
            <option value="VERIFIED">VERIFIED</option>
            <option value="PENDING">PENDING</option>
          </select>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#0F172A]">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase text-[10px] font-bold">
              <tr>
                <th className="p-4">Pengguna</th>
                <th className="p-4">Kampus &amp; Alamat</th>
                <th className="p-4">Role Akses</th>
                <th className="p-4">Rekening Bank</th>
                <th className="p-4 text-center">Status Verifikasi</th>
                <th className="p-4 text-center">Kelola / Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#64748B] font-medium text-xs">
                    Tidak ada akun pengguna yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u: any) => (
                  <tr key={u.id} className="hover:bg-[#F8FAFC] transition">
                    <td className="p-4">
                      <button
                        onClick={() => handleOpenDetailUser(u)}
                        className="font-bold text-[#0F172A] hover:text-[#0062FF] hover:underline text-left cursor-pointer block"
                      >
                        {u.nama_lengkap}
                      </button>
                      <p className="text-[11px] text-[#64748B]">{u.email}</p>
                      <p className="text-[10px] text-[#64748B] font-mono">WA: {u.no_hp || '-'}</p>
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2.5 py-0.5 bg-[#F8FAFC] text-[#0F172A] rounded-full text-[10px] font-bold border border-[#E2E8F0] mb-1">
                        {u.kampus?.nama_kampus || 'Surabaya'}
                      </span>
                      <p
                        className="text-[10px] text-[#64748B] line-clamp-1 max-w-[200px]"
                        title={u.alamat_kos || ''}
                      >
                        {u.alamat_kos || '-'}
                      </p>
                    </td>
                    <td className="p-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleChangeUserRole(u.id, e.target.value)}
                        className="px-2 py-1 bg-white border border-[#E2E8F0] rounded-lg text-[11px] font-bold text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0062FF] cursor-pointer"
                      >
                        <option value="BUYER">BUYER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                      {u.is_seller && (
                        <span className="ml-2 inline-block px-2 py-0.5 bg-[#EFF6FF] text-[#0062FF] font-extrabold text-[9px] rounded-md border border-[#BFDBFE]">
                          PENJUAL
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <p className="font-mono text-[#0F172A] font-bold text-xs">
                        {u.no_rekening || u.norek_bank || '-'}
                      </p>
                      <p className="text-[10px] text-[#64748B]">
                        {u.nama_bank || '-'} a.n {u.nama_pemilik_rekening || u.nama_lengkap || '-'}
                      </p>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleVerifySeller(u.id, u.status_verifikasi)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold border transition shadow-xs cursor-pointer ${
                          u.status_verifikasi === 'VERIFIED'
                            ? 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0] hover:bg-[#FEF2F2] hover:text-[#B91C1C]'
                            : 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A] hover:bg-[#ECFDF5] hover:text-[#047857]'
                        }`}
                      >
                        {u.status_verifikasi === 'VERIFIED' ? 'VERIFIED' : 'PENDING'}
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenDetailUser(u)}
                          title="Lihat Rincian Akun & Produk Seller"
                          className="p-1.5 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#0062FF] rounded-lg border border-[#BFDBFE] transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEditUser(u)}
                          title="Edit Detail Akun"
                          className="p-1.5 bg-white hover:bg-[#F8FAFC] text-[#0F172A] rounded-lg border border-[#E2E8F0] transition cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id, u.nama_lengkap)}
                          title="Hapus Akun"
                          disabled={u.id === currentAdminId}
                          className="p-1.5 bg-[#FEF2F2] hover:bg-[#FEE2E2] text-rose-600 rounded-lg border border-[#FECACA] transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
