/**
 * @file AdminSidebar.tsx
 * @description Komponen Navigasi Sidebar SIM Admin dengan aksen Monokrom Utama (#0F172A).
 */

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  Package,
  Users,
  Building2,
  FileText,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ShieldCheck,
  Home,
  LogOut,
} from 'lucide-react';
import { TabType, UserSim, OverviewStats } from '../types/admin';

interface AdminSidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  stats: OverviewStats;
  pendingPayoutCount: number;
  usersCount: number;
  campusesCount: number;
  user: any;
  logout: () => void;
  isAdminUserMenuOpen: boolean;
  setIsAdminUserMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  stats,
  pendingPayoutCount,
  usersCount,
  campusesCount,
  user,
  logout,
  isAdminUserMenuOpen,
  setIsAdminUserMenuOpen,
}: AdminSidebarProps) {
  return (
    <aside className="w-full lg:w-72 lg:fixed lg:top-0 lg:bottom-0 lg:left-0 lg:h-screen bg-white border-r border-[#E2E8F0] flex flex-col shrink-0 z-40">
      {/* SIM Branding Header */}
      <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Image
              src="/logo.png"
              alt="BaranginAja Logo"
              width={36}
              height={36}
              className="object-contain w-full h-full"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black text-[#0F172A] tracking-widest uppercase">
              Barangin
            </span>
            <span className="text-[9px] font-bold text-[#64748B] tracking-[0.2em] uppercase leading-none">
              SIM Control Panel
            </span>
          </div>
        </Link>
        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#EFF6FF] text-[#0062FF] border border-[#BFDBFE] uppercase tracking-wide">
          Admin
        </span>
      </div>

      {/* Main SIM Modules Navigation List */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {/* Modul Utama */}
        <div className="mb-4">
          <p className="px-3 text-[10px] font-extrabold text-[#94A3B8] uppercase tracking-widest mb-2">
            Modul Utama
          </p>
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#0F172A] text-white shadow-sm shadow-[#0F172A]/10'
                : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4" />
              <span>Summary</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>
        </div>

        {/* Modul Transaksi */}
        <div className="pt-3 mt-3 border-t border-[#E2E8F0]/70 mb-4 space-y-1">
          <p className="px-3 text-[10px] font-extrabold text-[#94A3B8] uppercase tracking-widest mb-2">
            Modul Transaksi
          </p>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#0F172A] text-white shadow-sm shadow-[#0F172A]/10'
                : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4" />
              <span>Order</span>
            </div>
            {stats.pendingOrders > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
                {stats.pendingOrders}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('payouts')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'payouts'
                ? 'bg-[#0F172A] text-white shadow-sm shadow-[#0F172A]/10'
                : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
            }`}
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4" />
              <span>Payout</span>
            </div>
            {pendingPayoutCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">
                {pendingPayoutCount}
              </span>
            )}
          </button>
        </div>

        {/* Modul Manajemen */}
        <div className="pt-3 mt-3 border-t border-[#E2E8F0]/70 space-y-1">
          <p className="px-3 text-[10px] font-extrabold text-[#94A3B8] uppercase tracking-widest mb-2">
            Modul Manajemen
          </p>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#0F172A] text-white shadow-sm shadow-[#0F172A]/10'
                : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4" />
              <span>Manajemen Katalog</span>
            </div>
            <span className="text-[10px] font-bold text-[#64748B]">{stats.totalProducts}</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-[#0F172A] text-white shadow-sm shadow-[#0F172A]/10'
                : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4" />
              <span>Manajemen User</span>
            </div>
            <span className="text-[10px] font-bold text-[#64748B]">{usersCount}</span>
          </button>

          <button
            onClick={() => setActiveTab('campuses')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'campuses'
                ? 'bg-[#0F172A] text-white shadow-sm shadow-[#0F172A]/10'
                : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Building2 className="w-4 h-4" />
              <span>Manajemen Kampus</span>
            </div>
            <span className="text-[10px] font-bold text-[#64748B]">{campusesCount}</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-[#0F172A] text-white shadow-sm shadow-[#0F172A]/10'
                : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4" />
              <span>Audit Trail</span>
            </div>
          </button>
        </div>
      </nav>

      {/* Admin User Footer Profile with Popover Menu */}
      <div className="p-4 border-t border-[#E2E8F0] bg-white relative">
        <AnimatePresence>
          {isAdminUserMenuOpen && (
            <motion.div
              key="admin-user-popover-menu"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl p-2 z-50 text-xs text-[#0F172A] space-y-1"
            >
              <Link
                href="/"
                onClick={() => setIsAdminUserMenuOpen(false)}
                className="flex items-center gap-2.5 p-2.5 hover:bg-[#F8FAFC] text-[#0F172A] font-bold rounded-xl transition-colors"
              >
                <Home className="w-4 h-4 text-[#0062FF]" />
                <span>Kembali ke Landing Page</span>
              </Link>

              <button
                onClick={() => {
                  setIsAdminUserMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 p-2.5 hover:bg-rose-50 text-rose-600 rounded-xl transition-colors font-bold text-left cursor-pointer border-t border-[#E2E8F0] mt-1"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Keluar (Logout)</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between">
          <div
            onClick={() => setIsAdminUserMenuOpen(!isAdminUserMenuOpen)}
            className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
          >
            <div className="w-8 h-8 rounded-full bg-[#EFF6FF] text-[#0062FF] font-bold flex items-center justify-center text-xs shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[#0F172A] truncate">
                {user?.nama_lengkap || 'Admin Ops'}
              </span>
              <span className="text-[10px] font-semibold text-[#64748B] truncate">
                {user?.email || 'admin@barangin.com'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsAdminUserMenuOpen(!isAdminUserMenuOpen)}
            className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-lg transition cursor-pointer ml-1"
            title="Menu Akun"
          >
            {isAdminUserMenuOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
