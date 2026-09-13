/**
 * @file CampusesTab.tsx
 * @description Komponen Tab Jaringan Kampus Surabaya (Multi-Branch) SIM Admin.
 * Mengelola pendaftaran kampus, status aktif/non-aktif, dan navigasi detail mahasiswa per kampus.
 */

import { Building2, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { KampusSim } from '../../types/admin';

interface CampusesTabProps {
  campuses: KampusSim[];
  setNewCampusForm: React.Dispatch<React.SetStateAction<{ nama_kampus: string; kota: string }>>;
  setIsCampusModalOpen: (open: boolean) => void;
  handleOpenDetailCampus: (campus: KampusSim) => void;
  handleToggleCampusStatus: (campus: KampusSim) => void;
  handleOpenEditCampus: (campus: KampusSim) => void;
  handleDeleteCampus: (campusId: string, campusName: string) => void;
}

export default function CampusesTab({
  campuses,
  setNewCampusForm,
  setIsCampusModalOpen,
  handleOpenDetailCampus,
  handleToggleCampusStatus,
  handleOpenEditCampus,
  handleDeleteCampus,
}: CampusesTabProps) {
  return (
    <div className="space-y-6">
      {/* Header section with add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-base font-black text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#0F172A]" />
            <span>Jaringan Kampus Terdaftar ({campuses.length} Kampus)</span>
          </h2>
          <p className="text-xs text-[#64748B] font-medium mt-1">
            Kelola daftar kampus mitra Surabaya, status keaktifan cabang, dan data jaringan perguruan tinggi.
          </p>
        </div>

        <button
          onClick={() => {
            setNewCampusForm({ nama_kampus: '', kota: 'Surabaya' });
            setIsCampusModalOpen(true);
          }}
          className="px-5 py-2.5 bg-[#0F172A] hover:bg-black text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kampus Baru</span>
        </button>
      </div>

      {/* Campus Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {campuses.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white border border-[#E2E8F0] rounded-2xl text-[#64748B]">
            <Building2 className="w-12 h-12 mx-auto text-[#64748B]/40 mb-3" />
            <p className="text-sm font-bold text-[#0F172A]">Belum Ada Kampus Terdaftar</p>
            <p className="text-xs">
              Klik &quot;Tambah Kampus Baru&quot; untuk menginput kampus baru ke jaringan SIM.
            </p>
          </div>
        ) : (
          campuses.map((c: any) => {
            const isAktif = typeof c.aktif === 'boolean' ? c.aktif : true;
            return (
              <div
                key={c.id}
                onClick={() => handleOpenDetailCampus(c)}
                className="bg-white border border-[#E2E8F0] hover:border-[#0062FF] p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition cursor-pointer group"
                title="Klik card untuk lihat rincian mahasiswa/user terdaftar"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#0062FF] flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleCampusStatus(c);
                      }}
                      className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase transition cursor-pointer ${
                        isAktif
                          ? 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0] hover:bg-[#D1FAE5]'
                          : 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA] hover:bg-[#FEE2E2]'
                      }`}
                      title="Klik untuk ubah status aktif/non-aktif"
                    >
                      {isAktif ? 'AKTIF' : 'NON-AKTIF'}
                    </button>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-[#0F172A] text-base group-hover:text-[#0062FF] transition-colors">
                      {c.nama_kampus}
                    </h3>
                    <p className="text-xs text-[#64748B] font-medium">
                      Kota: <strong className="text-[#0F172A]">{c.kota || 'Surabaya'}</strong>
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDetailCampus(c);
                    }}
                    className="font-bold text-[#0062FF] text-[11px] uppercase tracking-wide hover:underline cursor-pointer flex items-center gap-1"
                    title="Klik untuk lihat rincian mahasiswa/user terdaftar"
                  >
                    <span>{c._count?.users || c.user_count || 0} Mahasiswa</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetailCampus(c);
                      }}
                      className="px-3 py-1.5 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#0062FF] font-bold rounded-xl border border-[#BFDBFE] transition cursor-pointer flex items-center gap-1 text-xs"
                      title="Lihat Rincian Akun Terdaftar di Kampus Ini"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Akun ({c._count?.users || c.user_count || 0})</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditCampus(c);
                      }}
                      className="p-1.5 bg-white hover:bg-[#F8FAFC] text-[#0F172A] rounded-xl border border-[#E2E8F0] transition cursor-pointer"
                      title="Edit Data Kampus"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCampus(c.id, c.nama_kampus);
                      }}
                      className="p-1.5 bg-[#FEF2F2] hover:bg-[#FEE2E2] text-rose-600 rounded-xl border border-[#FECACA] transition cursor-pointer"
                      title="Hapus Kampus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
