/**
 * @file AdminHeader.tsx
 * @description Komponen Top Control Bar SIM Admin dengan tombol pemicu pencarian, indikator waktu, dan refresh data.
 */

import { Layers, Search, Clock, RefreshCw } from 'lucide-react';
import { TabType } from '../types/admin';

interface AdminHeaderProps {
  activeTab: TabType;
  searchQuery: string;
  setIsSearchModalOpen: (open: boolean) => void;
  currentTime: string;
  refreshAllData: () => void;
  loading: boolean;
}

export default function AdminHeader({
  activeTab,
  searchQuery,
  setIsSearchModalOpen,
  currentTime,
  refreshAllData,
  loading,
}: AdminHeaderProps) {
  return (
    <header className="h-20 px-8 bg-white/90 border-b border-[#E2E8F0] flex items-center justify-between gap-4 sticky top-0 z-30 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-black text-[#0F172A] uppercase tracking-wide flex items-center gap-2.5">
          <Layers className="w-5 h-5 text-[#0F172A]" />
          {activeTab === 'overview' && 'Ringkasan Eksekutif & KPI'}
          {activeTab === 'orders' && 'Manajemen Pesanan & Resi Pengiriman'}
          {activeTab === 'payouts' && 'Antrian Pencairan Dana Seller (Payout)'}
          {activeTab === 'products' && 'Manajemen Katalog & Calculation Tier'}
          {activeTab === 'users' && 'Manajemen Pengguna & Status Seller'}
          {activeTab === 'campuses' && 'Jaringan Kampus Surabaya (Multi-Branch)'}
          {activeTab === 'audit' && 'System Activity Audit Trail'}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Trigger Button (Opens Quick Search Modal) */}
        <button
          type="button"
          onClick={() => setIsSearchModalOpen(true)}
          title="Buka Pencarian SIM (Ctrl+K)"
          className="relative flex items-center justify-between w-44 md:w-72 bg-[#F8FAFC] hover:bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-xl pl-9 pr-3 py-2 text-xs text-left transition cursor-pointer text-[#64748B] group shadow-2xs"
        >
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] group-hover:text-[#0062FF] transition-colors" />
          <span className="truncate font-medium text-[#0F172A]">
            {searchQuery ? searchQuery : 'Cari order / user / barang...'}
          </span>
          {searchQuery && (
            <span className="w-2 h-2 rounded-full bg-[#0062FF] shrink-0 ml-2" />
          )}
        </button>

        {/* Time Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[11px] font-bold text-[#0F172A]">
          <Clock className="w-3.5 h-3.5 text-[#0062FF]" />
          <span>{currentTime}</span>
        </div>

        {/* Manual Refresh Button */}
        <button
          onClick={refreshAllData}
          disabled={loading}
          className="px-4 py-2 bg-white hover:bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] rounded-xl transition text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
          title="Refresh Data SIM"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden md:inline">Refresh</span>
        </button>
      </div>
    </header>
  );
}
