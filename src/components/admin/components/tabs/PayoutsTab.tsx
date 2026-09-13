/**
 * @file PayoutsTab.tsx
 * @description Komponen Tab Pencairan Saldo Seller (Payout) SIM Admin.
 * Mengelola daftar transfer dana seller sebesar harga input asli barang.
 */

import { formatRupiah, formatDate } from '@/lib/utils';
import { PayoutSim } from '../../types/admin';

interface PayoutsTabProps {
  payouts: PayoutSim[];
  handleDisbursePayout: (payoutId: string) => void;
}

export default function PayoutsTab({ payouts, handleDisbursePayout }: PayoutsTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
        <h2 className="text-sm font-black text-[#0F172A] uppercase tracking-wider mb-1">
          Antrian Transfer Payout Penjual
        </h2>
        <p className="text-xs text-[#64748B]">
          Sesuai PRD 9.3: Nominal yang ditransfer ke penjual adalah sebesar{' '}
          <strong className="text-[#0F172A]">harga input asli penjual</strong> (sebelum markup &amp; ongkir).
        </p>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs text-[#0F172A]">
          <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase text-[10px] font-bold">
            <tr>
              <th className="p-4">Order ID &amp; Barang</th>
              <th className="p-4">Penjual (Seller)</th>
              <th className="p-4">Info Rekening Bank</th>
              <th className="p-4">Nominal Transfer</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Aksi Transfer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {payouts.map((p: any) => (
              <tr key={p.id} className="hover:bg-[#F8FAFC] transition">
                <td className="p-4">
                  <p className="font-bold text-[#0F172A] font-mono">#{p.order_id?.substring(0, 8)}</p>
                  <p className="text-[11px] text-[#64748B]">{p.order?.product?.nama_barang}</p>
                </td>
                <td className="p-4">
                  <p className="font-bold text-[#0F172A]">{p.seller?.nama_lengkap}</p>
                  <p className="text-[11px] text-[#64748B]">{p.seller?.email}</p>
                </td>
                <td className="p-4">
                  <p className="font-bold text-[#0062FF] uppercase">{p.seller?.nama_bank || 'BCA / SeaBank'}</p>
                  <p className="font-mono text-[#0F172A] text-xs font-bold">
                    {p.seller?.no_rekening || p.seller?.norek_bank || '123456789'}
                  </p>
                  <p className="text-[10px] text-[#64748B]">
                    a.n {p.seller?.nama_pemilik_rekening || p.seller?.nama_lengkap}
                  </p>
                </td>
                <td className="p-4 font-black text-[#0062FF] text-sm">
                  {formatRupiah(p.nominal || p.jumlah || 0)}
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 text-[10px] font-bold rounded-full border ${
                      p.status === 'DICAIRKAN' || p.status === 'DISBURSED'
                        ? 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]'
                        : 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  {p.status === 'MENUNGGU_PENCAIRAN' || p.status === 'PENDING' ? (
                    <button
                      onClick={() => handleDisbursePayout(p.id)}
                      className="px-4 py-2 bg-[#0F172A] hover:bg-black text-white font-bold rounded-xl text-xs shadow-sm transition cursor-pointer"
                    >
                      Tandai Sudah Dicairkan
                    </button>
                  ) : (
                    <span className="text-[11px] text-[#64748B] font-mono">
                      Cair ({p.tanggal_dicairkan || p.disbursed_at ? formatDate(p.tanggal_dicairkan || p.disbursed_at) : 'Done'})
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
