'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { formatRupiah, formatDate, getOrderStatusBadge } from '@/lib/utils';
import Image from 'next/image';
import { Package, Search, Truck, Clock, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

function CustomerOrdersContent() {
  const searchParams = useSearchParams();
  const { user } = useAuthStore();

  const [emailInput, setEmailInput] = useState(searchParams?.get('email') || user?.email || 'user@barangin.com');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async (targetEmail?: string) => {
    setLoading(true);
    setError('');
    try {
      const emailToUse = targetEmail || emailInput;
      const res = await fetch(`/api/orders?email=${encodeURIComponent(emailToUse)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memuat data pesanan');
      setOrders(data.orders || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email && !searchParams?.get('email')) {
      setEmailInput(user.email);
      fetchOrders(user.email);
    } else {
      fetchOrders(emailInput);
    }
  }, [user]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(emailInput);
  };

  return (
    <div className="w-[95%] sm:w-[98%] max-w-[2560px] mx-auto py-10 space-y-8">
      
      {/* Header & Email Search filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E6EAFA]">
        <div>
          <h1 className="text-2xl font-bold text-[#1D2667] flex items-center gap-2">
            <Package className="w-7 h-7 text-[#4E75F8]" /> Riwayat & Pelacakan Pesanan
          </h1>
          <p className="text-xs text-[#5C6070] mt-1">
            Pantau status proses pengiriman dan nomor resi barang belanjaan Anda
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Cari email pemesan..."
              className="pl-9 pr-3 py-2 text-xs bg-white border border-[#E6EAFA] rounded-full text-[#1F1F1F] focus:outline-none focus:border-[#4E75F8]"
            />
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#A1A7C0]" />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#4E75F8] hover:bg-[#3B62E6] text-white text-xs font-bold rounded-full flex items-center gap-1.5 transition shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Cari</span>
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#5C6070] text-xs">Memuat data pesanan...</div>
      ) : error ? (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#E6EAFA] rounded-2xl p-8 space-y-3 shadow-card">
          <Package className="w-12 h-12 text-gray mx-auto stroke-[1.5]" />
          <h2 className="text-lg font-bold text-base-dark">Belum ada transaksi</h2>
          <p className="text-gray text-xs max-w-sm mx-auto">
            Anda belum pernah membeli barang. Yuk jelajahi katalog produk mahasiswa!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const badge = getOrderStatusBadge(order.orderStatus);
            return (
              <div
                key={order.id}
                className="p-6 bg-white border border-[#E6EAFA] rounded-2xl space-y-6 shadow-card"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E6EAFA]">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-[#1D2667]">#{order.orderNumber}</span>
                      <span className={`px-3 py-0.5 text-[10px] font-bold rounded-full border ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5C6070] mt-1">
                      Waktu Pemesanan: {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-[#5C6070]">Total Pembayaran</span>
                    <p className="text-base font-black text-[#4E75F8]">{formatRupiah(order.totalAmount)}</p>
                  </div>
                </div>

                {/* Status Progression Timeline */}
                <div className="p-4 bg-[#F4F6FF] border border-[#E6EAFA] rounded-2xl">
                  <div className="flex justify-between items-center text-[11px] text-[#5C6070]">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#1D2667]" />
                      <span>Kurir: <strong className="text-[#1D2667]">{order.courier}</strong></span>
                    </div>
                    {order.trackingNumber ? (
                      <div className="flex items-center gap-1 text-[#4E75F8] font-mono font-bold bg-[#4E75F8]/10 px-2.5 py-1 rounded-full border border-[#4E75F8]/20">
                        <span>No. Resi AWB: {order.trackingNumber}</span>
                      </div>
                    ) : (
                      <span className="text-amber-600 font-semibold">Nomor resi sedang disiapkan</span>
                    )}
                  </div>
                </div>

                {/* Order Items list */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#1D2667]">Rincian Barang ({order.items.length}):</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {order.items.map((item: any, idx: number) => {
                      let imgUrl = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80';
                      try {
                        if (item.product?.images) {
                          const arr = JSON.parse(item.product.images);
                          if (Array.isArray(arr) && arr.length > 0) imgUrl = arr[0];
                        }
                      } catch (e) {}

                      return (
                        <div
                          key={idx}
                          className="p-3 bg-[#F4F6FF] border border-[#E6EAFA] rounded-2xl flex gap-3 items-center"
                        >
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white border border-[#E6EAFA] shrink-0">
                            <Image src={imgUrl} alt={item.product?.name || 'Produk'} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-[#1D2667] truncate">
                              {item.product?.name || 'Produk'}
                            </p>
                            {item.selectedVariant && (
                              <p className="text-[11px] text-[#5C6070]">Varian: {item.selectedVariant}</p>
                            )}
                            <p className="text-xs font-medium text-[#5C6070] mt-0.5">
                              {item.quantity} x {formatRupiah(item.price)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Receiver Info */}
                <div className="pt-3 border-t border-[#E6EAFA] text-xs text-[#5C6070] flex flex-wrap justify-between gap-2">
                  <span>Penerima: <strong className="text-[#1D2667]">{order.customerName}</strong> ({order.customerPhone})</span>
                  <span>Alamat: <strong className="text-[#1D2667]">{order.shippingAddress}, {order.city}</strong></span>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default function CustomerOrdersPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-[#5C6070] text-xs">Memuat halaman pesanan...</div>}>
      <CustomerOrdersContent />
    </Suspense>
  );
}
