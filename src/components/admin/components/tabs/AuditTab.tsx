/**
 * @file AuditTab.tsx
 * @description Komponen Tab System Activity Audit Trail SIM Admin.
 */

import { formatDate } from '@/lib/utils';
import { Activity } from 'lucide-react';
import { ActivitySim } from '../../types/admin';

interface AuditTabProps {
  activities: ActivitySim[];
}

export default function AuditTab({ activities }: AuditTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
        <h2 className="text-sm font-black text-[#0F172A] uppercase tracking-wider mb-1">
          Audit Trail Aktivitas Admin
        </h2>
        <p className="text-xs text-[#64748B]">
          Sesuai PRD 8.9 &amp; 14: Seluruh tindakan admin terkait verifikasi bayar, pencairan dana, dan pengubahan data tercatat secara permanen.
        </p>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#64748B]">Belum ada aktivitas tercatat.</div>
          ) : (
            activities.map((act: any) => (
              <div
                key={act.id}
                className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-start gap-4"
              >
                <div className="w-8 h-8 rounded-full bg-[#EFF6FF] text-[#0062FF] border border-[#BFDBFE] flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-[#0F172A] text-xs">
                      {act.admin?.nama_lengkap || act.admin_id || 'Admin'}
                    </p>
                    <span className="text-[10px] text-[#64748B] font-mono">
                      {formatDate(act.created_at || act.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1 font-mono">{act.deskripsi || act.aksi}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
