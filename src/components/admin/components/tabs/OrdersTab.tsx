/**
 * @file OrdersTab.tsx
 * @description Komponen Tab Manajemen Pesanan & Resi Pengiriman SIM Admin.
 * Memungkinkan admin memfilter status order, memperbarui status, dan menghubungi buyer via WA.
 */

import { formatRupiah, formatDate, getOrderStatusBadge } from '@/lib/utils';
import { PhoneCall, Clock } from 'lucide-react';
import { OrderSim } from '../../types/admin';

interface OrdersTabProps {
  orderStatusFilter: string;
  setOrderStatusFilter: (status: string) => void;
  filteredOrders: OrderSim[];
  savingOrderId: string | null;
  handleUpdateOrderStatus: (orderId: string, newStatus: string) => void;
}

export default function OrdersTab({
  orderStatusFilter,
  setOrderStatusFilter,
  filteredOrders,
  savingOrderId,
  handleUpdateOrderStatus,
}: OrdersTabProps) {
  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E2E8F0] pb-4">
        {[
          { id: 'ALL', label: 'Semua Status' },
          { id: 'MENUNGGU_PEMBAYARAN', label: 'Menunggu QRIS (Pending)' },
          { id: 'DIBAYAR', label: 'Dibayar' },
          { id: 'DIJEMPUT_KURIR', label: 'Dijemput Kurir' },
          { id: 'DALAM_PENGIRIMAN', label: 'Dalam Pengiriman' },
          { id: 'SELESAI', label: 'Selesai' },
          { id: 'DIBATALKAN', label: 'Dibatalkan' },
        ].map((st) => (
          <button
            key={st.id}
            onClick={() => setOrderStatusFilter(st.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              orderStatusFilter === st.id
                ? 'bg-[#0F172A] text-white shadow-sm border border-[#0F172A]'
                : 'bg-white text-[#0F172A] border border-[#E2E8F0] hover:bg-[#F8FAFC]'
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* Order List Cards */}
      <div className="space-y-4">
        {filteredOrders.map((ord: any) => {
          const badge = getOrderStatusBadge(ord.status);
          const isSaving = savingOrderId === ord.id;

          return (
            <div
              key={ord.id}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-black text-[#0F172A] font-mono">#{ord.id}</span>
                    <span className={`px-3 py-0.5 text-[10px] font-bold rounded-full border ${badge.bg}`}>
                      {badge.label}
                    </span>
                    {ord.status === 'MENUNGGU_PEMBAYARAN' && ord.hold_expires_at && (() => {
                      const expireTime = new Date(ord.hold_expires_at).getTime();
                      const diffMs = expireTime - Date.now();
                      const totalSeconds = Math.floor(diffMs / 1000);

                      if (totalSeconds <= 0) {
                        return (
                          <span className="px-3 py-0.5 text-[10px] font-extrabold rounded-full bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA] flex items-center gap-1 shadow-xs">
                            <Clock className="w-3 h-3 text-[#B91C1C]" />
                            <span>Hold Expired (Rilis Otomatis)</span>
                          </span>
                        );
                      }

                      const mins = Math.floor(totalSeconds / 60);
                      const secs = totalSeconds % 60;
                      const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

                      return (
                        <span className="px-3 py-0.5 text-[10px] font-extrabold rounded-full bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A] flex items-center gap-1 shadow-xs animate-pulse">
                          <Clock className="w-3 h-3 text-[#B45309]" />
                          <span>Timer Hold WA: {formatted}</span>
                        </span>
                      );
                    })()}
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                      Opsi: <strong className="text-[#0F172A]">{ord.opsi_pengiriman}</strong>
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1 font-medium">
                    Pembeli: <strong className="text-[#0F172A]">{ord.buyer?.nama_lengkap}</strong> (
                    {ord.buyer?.no_hp || '-'}) • Waktu: {formatDate(ord.created_at)}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest">
                    Total Tagihan (Include Ongkir)
                  </span>
                  <p className="text-xl font-black text-[#0062FF]">{formatRupiah(ord.total_harga)}</p>
                </div>
              </div>

              {/* Product details & Price breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
                <div>
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">
                    Detail Barang
                  </span>
                  <p className="font-bold text-[#0F172A] mt-0.5">{ord.product?.nama_barang}</p>
                  <p className="text-[11px] text-[#64748B]">
                    Harga Input Penjual: {formatRupiah(ord.product?.harga_input)}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">
                    Penjual (Seller)
                  </span>
                  <p className="font-bold text-[#0F172A] mt-0.5">
                    {ord.product?.seller?.nama_lengkap || 'Seller'}
                  </p>
                  <p className="text-[11px] text-[#64748B]">
                    Alamat Jemput: {ord.product?.seller?.alamat_kos || '-'}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">
                    Pengiriman &amp; Logistik
                  </span>
                  <p className="font-bold text-[#0F172A] mt-0.5">
                    Jarak: {ord.jarak_km || 0} km • Ongkir: {formatRupiah(ord.ongkir || 0)}
                  </p>
                  <p className="text-[11px] text-[#64748B]">
                    Alamat Pembeli: {ord.buyer?.alamat_kos || '-'}
                  </p>
                </div>
              </div>

              {/* Status Control Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <label className="text-xs font-bold text-[#0F172A] shrink-0 uppercase tracking-wide">
                    Ubah Status:
                  </label>
                  <select
                    defaultValue={ord.status}
                    onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                    disabled={isSaving}
                    className="bg-white border border-[#E2E8F0] rounded-xl px-4 py-2 text-xs text-[#0F172A] font-bold focus:outline-none focus:ring-2 focus:ring-[#0062FF]/20 focus:border-[#0062FF] cursor-pointer"
                  >
                    <option value="MENUNGGU_PEMBAYARAN">MENUNGGU_PEMBAYARAN (Pending QRIS)</option>
                    <option value="DIBAYAR">DIBAYAR (Verifikasi Dana Lolos)</option>
                    <option value="DIJEMPUT_KURIR">DIJEMPUT_KURIR</option>
                    <option value="DALAM_PENGIRIMAN">DALAM_PENGIRIMAN</option>
                    <option value="SELESAI">SELESAI (Transaksi Closed)</option>
                    <option value="DIBATALKAN">DIBATALKAN</option>
                  </select>
                </div>

                {/* Contact WhatsApp Action */}
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${ord.buyer?.no_hp?.replace(/^0/, '62')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#ECFDF5] text-[#047857] hover:bg-[#D1FAE5] border border-[#A7F3D0] rounded-full text-xs font-bold flex items-center gap-2 transition"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Chat Buyer WA</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
