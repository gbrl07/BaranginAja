'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatRupiah, formatDate, getOrderStatusBadge } from '@/lib/utils';
import {
  ShoppingBag,
  ArrowLeft,
  Search,
  Truck,
  CheckCircle2,
  Save,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // Editing state mapping { orderId: { status, trackingNumber } }
  const [editingMap, setEditingMap] = useState<Record<string, { orderStatus: string; trackingNumber: string }>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memuat pesanan');
      setOrders(data.orders || []);

      const map: Record<string, { orderStatus: string; trackingNumber: string }> = {};
      (data.orders || []).forEach((o: any) => {
        map[o.id] = {
          orderStatus: o.orderStatus,
          trackingNumber: o.trackingNumber || '',
        };
      });
      setEditingMap(map);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = (id: string, status: string) => {
    setEditingMap((prev) => ({
      ...prev,
      [id]: { ...prev[id], orderStatus: status },
    }));
  };

  const handleTrackingChange = (id: string, tracking: string) => {
    setEditingMap((prev) => ({
      ...prev,
      [id]: { ...prev[id], trackingNumber: tracking },
    }));
  };

  const handleSave = async (id: string) => {
    setSavingId(id);
    const item = editingMap[id];
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderStatus: item.orderStatus,
          trackingNumber: item.trackingNumber,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memperbarui pesanan');
      fetchOrders();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSavingId(null);
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="w-[95%] sm:w-[98%] max-w-[2560px] mx-auto py-10 space-y-8"
    >
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E6EAFA]">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 bg-white border border-[#E6EAFA] rounded-full text-[#5C6070] hover:text-[#1F1F1F] shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#1D2667] flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-[#4E75F8]" /> Manajemen Pesanan & No. Resi AWB
            </h1>
            <p className="text-xs text-[#5C6070]">Proses status pesanan masuk dan berikan nomor resi pengiriman</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari no. pesanan / nama..."
              className="pl-9 pr-3 py-2 text-xs bg-white border border-[#E6EAFA] rounded-full text-[#1F1F1F] focus:outline-none focus:border-[#4E75F8]"
            />
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#A1A7C0]" />
          </div>

          <button
            onClick={fetchOrders}
            className="p-2.5 bg-white hover:bg-[#F4F6FF] text-[#5C6070] border border-[#E6EAFA] rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#5C6070] text-xs">Memuat daftar pesanan admin...</div>
      ) : error ? (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-xs">
          Akses ditolak: {error}. Silakan login sebagai <strong>admin@barangin.com</strong>.
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((ord) => {
            const badge = getOrderStatusBadge(ord.orderStatus);
            const currentEdit = editingMap[ord.id] || {
              orderStatus: ord.orderStatus,
              trackingNumber: ord.trackingNumber || '',
            };

            return (
              <div
                key={ord.id}
                className="p-6 bg-white border border-[#E6EAFA] rounded-3xl space-y-4 shadow-card"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E6EAFA]">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-black text-[#1D2667]">#{ord.orderNumber}</span>
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5C6070] mt-1">
                      Pembeli: <strong className="text-[#1D2667]">{ord.customerName}</strong> ({ord.customerEmail}) • Waktu: {formatDate(ord.createdAt)}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-[#5C6070]">Total Tagihan</span>
                    <p className="text-base font-black text-[#4E75F8]">{formatRupiah(ord.totalAmount)}</p>
                  </div>
                </div>

                {/* Processing Controls Form */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#F4F6FF] p-4 rounded-2xl border border-[#E6EAFA]">
                  
                  <div className="md:col-span-4">
                    <label className="block text-[11px] font-semibold text-[#1D2667] mb-1">Ubah Status Pesanan</label>
                    <select
                      value={currentEdit.orderStatus}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                      className="w-full p-2 text-xs bg-white border border-[#E6EAFA] rounded-xl text-[#1F1F1F] font-bold focus:outline-none focus:border-[#4E75F8]"
                    >
                      <option value="PROCESSING">Sedang Diproses (PROCESSING)</option>
                      <option value="SHIPPED">Dalam Pengiriman (SHIPPED)</option>
                      <option value="DELIVERED">Selesai Diterima (DELIVERED)</option>
                      <option value="CANCELLED">Dibatalkan (CANCELLED)</option>
                    </select>
                  </div>

                  <div className="md:col-span-5">
                    <label className="block text-[11px] font-semibold text-[#1D2667] mb-1">Nomor Resi / AWB Ekspedisi</label>
                    <div className="relative">
                      <Truck className="w-4 h-4 absolute left-3 top-2.5 text-[#A1A7C0]" />
                      <input
                        type="text"
                        value={currentEdit.trackingNumber}
                        onChange={(e) => handleTrackingChange(ord.id, e.target.value)}
                        placeholder="Contoh: SOC-9823471029"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E6EAFA] rounded-xl text-[#1F1F1F] focus:outline-none focus:border-[#4E75F8] font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-3 pt-4 md:pt-0">
                    <button
                      onClick={() => handleSave(ord.id)}
                      disabled={savingId === ord.id}
                      className="w-full py-2.5 px-3 bg-[#4E75F8] hover:bg-[#3B62E6] text-white font-bold text-xs rounded-full shadow-md shadow-[#4E75F8]/30 flex items-center justify-center gap-1.5 transition"
                    >
                      <Save className="w-4 h-4" />
                      <span>{savingId === ord.id ? 'Menyimpan...' : 'Simpan Update'}</span>
                    </button>
                  </div>

                </div>

                {/* Items & Shipping Address details */}
                <div className="text-xs text-[#5C6070] flex flex-wrap justify-between gap-2 pt-2">
                  <span>Kurir: <strong className="text-[#1D2667]">{ord.courier}</strong></span>
                  <span>Alamat: <strong className="text-[#1D2667]">{ord.shippingAddress}, {ord.city}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </motion.div>
  );
}
