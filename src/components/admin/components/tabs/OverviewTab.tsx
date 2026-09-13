/**
 * @file OverviewTab.tsx
 * @description Komponen Tab Ringkasan Eksekutif & KPI Dashboard SIM Admin.
 * Menampilkan ringkasan profit, pesanan pending, payout seller, total seller, serta Grafik Tren Keuntungan Harian.
 */

import { useState } from 'react';
import { formatRupiah, formatDate, getOrderStatusBadge } from '@/lib/utils';
import {
  DollarSign,
  PhoneCall,
  CreditCard,
  Store,
  BarChart3,
  ChevronDown,
  Package,
  Truck,
} from 'lucide-react';
import { OverviewStats, OrderSim, UserSim, TabType } from '../../types/admin';
import { MONTH_NAMES } from '../../constants/adminMockData';

interface OverviewTabProps {
  overallPlatformProfit: number;
  overallMarkupProfit: number;
  overallOngkirProfit: number;
  stats: OverviewStats;
  pendingPayoutCount: number;
  pendingPayoutNominal: number;
  totalSellerCount: number;
  users: UserSim[];
  orders: OrderSim[];
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  monthTotalProfit: number;
  monthTotalMarkup: number;
  monthTotalOngkir: number;
  dailyChartData: Array<{
    day: number;
    dayOrders: any[];
    markupProfit: number;
    ongkirProfit: number;
    totalProfit: number;
  }>;
  maxDailyProfit: number;
  monthPaidOrders: OrderSim[];
  setActiveTab: (tab: TabType) => void;
}

export default function OverviewTab({
  overallPlatformProfit,
  overallMarkupProfit,
  overallOngkirProfit,
  stats,
  pendingPayoutCount,
  pendingPayoutNominal,
  totalSellerCount,
  users,
  orders,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  monthTotalProfit,
  monthTotalMarkup,
  monthTotalOngkir,
  dailyChartData,
  maxDailyProfit,
  monthPaidOrders,
  setActiveTab,
}: OverviewTabProps) {
  const yearOptions = [2024, 2025, 2026, 2027];

  return (
    <div className="space-y-8">
      {/* Executive KPI Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Keuntungan Platform */}
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl flex flex-col justify-between h-40 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">
              Keuntungan Platform
            </span>
            <div className="w-9 h-9 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-bold shadow-xs">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-[#0F172A]">{formatRupiah(overallPlatformProfit)}</h3>
            <p className="text-[10px] font-bold text-[#64748B] mt-1 uppercase tracking-wider">
              Markup ({formatRupiah(overallMarkupProfit)}) + Ongkir ({formatRupiah(overallOngkirProfit)})
            </p>
          </div>
        </div>

        {/* Card 2: Pesanan Pending WA */}
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl flex flex-col justify-between h-40 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">
              Pesanan Pending WA
            </span>
            <div className="w-9 h-9 rounded-full bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A] flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-[#B45309]">{stats.pendingOrders}</h3>
            <p className="text-[10px] font-bold text-[#64748B] mt-1 uppercase tracking-wider">
              Perlu Konfirmasi WA (Hold 5 Mnt)
            </p>
          </div>
        </div>

        {/* Card 3: Daftar Payout Seller */}
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl flex flex-col justify-between h-40 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">
              Daftar Payout Seller
            </span>
            <div className="w-9 h-9 rounded-full bg-[#EFF6FF] text-[#0062FF] border border-[#BFDBFE] flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-[#0F172A]">{pendingPayoutCount}</h3>
            <p className="text-[10px] font-bold text-[#64748B] mt-1 uppercase tracking-wider">
              Pending: {formatRupiah(pendingPayoutNominal)}
            </p>
          </div>
        </div>

        {/* Card 4: Total Seller */}
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl flex flex-col justify-between h-40 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">
              Total Seller
            </span>
            <div className="w-9 h-9 rounded-full bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] flex items-center justify-center font-bold">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-[#047857]">{totalSellerCount}</h3>
            <p className="text-[10px] font-bold text-[#64748B] mt-1 uppercase tracking-wider">
              Dari total {users.length} mahasiswa
            </p>
          </div>
        </div>
      </div>

      {/* Card Grafik Tren Keuntungan Platform */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-bold">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#0F172A] uppercase tracking-wider">
                Grafik Tren Keuntungan Platform
              </h2>
              <p className="text-xs text-[#64748B] font-medium mt-0.5">
                Riwayat estimasi keuntungan dari Markup Harga &amp; Ongkir Pengiriman Kurir untuk{' '}
                <strong className="text-[#0F172A]">
                  {MONTH_NAMES[selectedMonth]} {selectedYear}
                </strong>
              </p>
            </div>
          </div>

          {/* Month & Year Select Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="appearance-none bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-4 pr-8 py-2 text-xs font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0062FF]/20 focus:border-[#0062FF] cursor-pointer"
              >
                {MONTH_NAMES.map((m, idx) => (
                  <option key={idx} value={idx}>
                    {m}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="appearance-none bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-4 pr-8 py-2 text-xs font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0062FF]/20 focus:border-[#0062FF] cursor-pointer"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    Tahun {y}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Profit Summary Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">
                Total Keuntungan Bulan Ini
              </span>
              <p className="text-lg font-black text-[#0F172A] mt-0.5">{formatRupiah(monthTotalProfit)}</p>
            </div>
            <DollarSign className="w-6 h-6 text-[#0F172A]" />
          </div>

          <div className="p-4 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#047857] uppercase tracking-widest">
                Profit dari Markup Harga
              </span>
              <p className="text-lg font-black text-[#047857] mt-0.5">{formatRupiah(monthTotalMarkup)}</p>
            </div>
            <Package className="w-6 h-6 text-[#047857]" />
          </div>

          <div className="p-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#0062FF] uppercase tracking-widest">
                Profit dari Ongkir Kurir
              </span>
              <p className="text-lg font-black text-[#0062FF] mt-0.5">{formatRupiah(monthTotalOngkir)}</p>
            </div>
            <Truck className="w-6 h-6 text-[#0062FF]" />
          </div>
        </div>

        {/* Daily Visual Bar Chart */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-[#64748B] font-bold pb-2 border-b border-[#E2E8F0]">
            <span>
              Diagram Batang Harian ({MONTH_NAMES[selectedMonth]} {selectedYear})
            </span>
            <span>Maks Harian: {formatRupiah(maxDailyProfit)}</span>
          </div>

          <div className="h-44 flex items-end justify-between gap-1.5 pt-4 overflow-x-auto custom-scrollbar">
            {dailyChartData.map((data) => {
              const heightPercent =
                maxDailyProfit > 0 ? Math.max(12, (data.totalProfit / maxDailyProfit) * 100) : 12;
              const hasProfit = data.totalProfit > 0;

              return (
                <div
                  key={data.day}
                  className="flex-1 flex flex-col items-center gap-1 group relative min-w-[20px]"
                >
                  <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-50">
                    <div className="bg-[#0F172A] text-white text-[10px] p-2 rounded-xl shadow-xl whitespace-nowrap text-center space-y-0.5 font-bold">
                      <p className="text-emerald-400">
                        Tgl {data.day} {MONTH_NAMES[selectedMonth]}: {formatRupiah(data.totalProfit)}
                      </p>
                      <p className="text-slate-300 font-normal">
                        Markup: {formatRupiah(data.markupProfit)} • Ongkir: {formatRupiah(data.ongkirProfit)}
                      </p>
                      <p className="text-slate-400 text-[9px] font-normal">
                        {data.dayOrders.length} Order Selesai
                      </p>
                    </div>
                  </div>

                  <div className="w-full flex items-end justify-center h-full">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[18px] rounded-t-md transition-all duration-300 ${
                        hasProfit
                          ? 'bg-[#0F172A] group-hover:bg-black shadow-sm'
                          : 'bg-[#E2E8F0] group-hover:bg-[#CBD5E1]'
                      }`}
                    />
                  </div>

                  <span className={`text-[9px] font-bold ${hasProfit ? 'text-[#0F172A]' : 'text-[#64748B]'}`}>
                    {data.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Transaction History Table */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
            Riwayat Transaksi Lolos ({monthPaidOrders.length} Order di {MONTH_NAMES[selectedMonth]}{' '}
            {selectedYear})
          </h3>

          {monthPaidOrders.length === 0 ? (
            <div className="p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-center text-xs text-[#64748B] font-medium">
              Tidak ada transaksi selesai pada bulan {MONTH_NAMES[selectedMonth]} {selectedYear}.
            </div>
          ) : (
            <div className="overflow-x-auto border border-[#E2E8F0] rounded-xl">
              <table className="w-full text-left text-xs text-[#0F172A]">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3.5">Tanggal</th>
                    <th className="p-3.5">Order ID &amp; Barang</th>
                    <th className="p-3.5">Pembeli</th>
                    <th className="p-3.5">Profit Markup</th>
                    <th className="p-3.5">Profit Ongkir</th>
                    <th className="p-3.5 font-black text-[#0F172A]">Total Keuntungan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {monthPaidOrders.map((ord: any) => {
                    const hj = ord.product?.harga_jual || 0;
                    const hi = ord.product?.harga_input || 0;
                    const markupProf = Math.max(0, hj - hi);
                    const ongkirProf = ord.opsi_pengiriman === 'KURIR' ? ord.ongkir || 0 : 0;
                    const orderTotalProf = markupProf + ongkirProf;

                    return (
                      <tr key={ord.id} className="hover:bg-[#F8FAFC] transition">
                        <td className="p-3.5 text-[#64748B] font-medium font-mono text-[11px]">
                          {formatDate(ord.created_at)}
                        </td>
                        <td className="p-3.5 font-bold">
                          <span className="font-mono text-[#0F172A]">#{ord.id.substring(0, 8)}</span>
                          <p className="text-[11px] text-[#64748B] font-normal">{ord.product?.nama_barang}</p>
                        </td>
                        <td className="p-3.5 font-medium">{ord.buyer?.nama_lengkap}</td>
                        <td className="p-3.5 text-emerald-700 font-bold">{formatRupiah(markupProf)}</td>
                        <td className="p-3.5 text-blue-700 font-bold">{formatRupiah(ongkirProf)}</td>
                        <td className="p-3.5 font-black text-[#0F172A]">{formatRupiah(orderTotalProf)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
          <h2 className="text-sm font-black text-[#0F172A] uppercase tracking-wider">
            Transaksi Terbaru Masuk
          </h2>
          <button
            onClick={() => setActiveTab('orders')}
            className="text-xs font-bold text-[#0062FF] hover:underline flex items-center gap-1 cursor-pointer"
          >
            Lihat Semua Order &rarr;
          </button>
        </div>

        <div className="divide-y divide-[#E2E8F0]">
          {orders.slice(0, 5).map((ord: any) => {
            const badge = getOrderStatusBadge(ord.status);
            return (
              <div key={ord.id} className="py-4 flex items-center justify-between gap-4 text-xs">
                <div>
                  <p className="font-black text-[#0F172A] font-mono">#{ord.id.substring(0, 8)}</p>
                  <p className="text-[#64748B] mt-0.5">
                    Pembeli: <span className="text-[#0F172A] font-bold">{ord.buyer?.nama_lengkap}</span> •{' '}
                    {ord.product?.nama_barang}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 text-[10px] font-bold rounded-full border ${badge.bg}`}>
                    {badge.label}
                  </span>
                  <span className="font-black text-[#0F172A] text-sm">{formatRupiah(ord.total_harga)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
