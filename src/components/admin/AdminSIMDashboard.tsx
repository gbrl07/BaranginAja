'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { formatRupiah, formatDate, getOrderStatusBadge } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  Package,
  Users,
  Building2,
  FileText,
  Search,
  RefreshCw,
  LogOut,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ShieldCheck,
  Plus,
  Edit,
  Trash2,
  X,
  Truck,
  ExternalLink,
  DollarSign,
  Filter,
  Activity,
  Layers,
  PhoneCall,
  UserCheck,
  Leaf,
  Home,
  BarChart3,
  Calendar,
  Store
} from 'lucide-react';

interface AdminSIMDashboardProps {
  initialStats: {
    totalUsers: number;
    totalProducts: number;
    pendingOrders: number;
    totalRevenue: number;
  };
  initialOrders: any[];
  initialProducts: any[];
  initialUsers: any[];
  initialPayouts: any[];
  initialCampuses: any[];
  initialActivities: any[];
}

export default function AdminSIMDashboard({
  initialStats,
  initialOrders,
  initialProducts,
  initialUsers,
  initialPayouts,
  initialCampuses,
  initialActivities,
}: AdminSIMDashboardProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'payouts' | 'products' | 'users' | 'campuses' | 'audit'
  >('overview');

  // Bottom profile admin menu state
  const [isAdminUserMenuOpen, setIsAdminUserMenuOpen] = useState(false);

  // Month & Year Filter for Profit Chart
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());

  // Real-time states
  const [stats, setStats] = useState(initialStats);
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [users, setUsers] = useState<any[]>(initialUsers);
  const [payouts, setPayouts] = useState<any[]>(initialPayouts);
  const [campuses, setCampuses] = useState<any[]>(initialCampuses);
  const [activities, setActivities] = useState<any[]>(initialActivities);

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState<string>('');

  // Order status editing state mapping
  const [savingOrderId, setSavingOrderId] = useState<string | null>(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');

  // Campus Form State
  const [isCampusModalOpen, setIsCampusModalOpen] = useState(false);
  const [newCampusName, setNewCampusName] = useState('');

  // Clock effect
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch all refreshed data
  const refreshAllData = async () => {
    setLoading(true);
    try {
      const [userRes, payoutRes, campusRes, activityRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/payouts'),
        fetch('/api/admin/campuses'),
        fetch('/api/admin/activities'),
      ]);

      if (userRes.ok) {
        const d = await userRes.json();
        setUsers(d.users || []);
      }
      if (payoutRes.ok) {
        const d = await payoutRes.json();
        setPayouts(d.payouts || []);
      }
      if (campusRes.ok) {
        const d = await campusRes.json();
        setCampuses(d.campuses || []);
      }
      if (activityRes.ok) {
        const d = await activityRes.json();
        setActivities(d.activities || []);
      }

      router.refresh();
    } catch (e) {
      console.error('Refresh Error:', e);
    } finally {
      setLoading(false);
    }
  };

  // Order status update handler
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setSavingOrderId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal update status pesanan');

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );

      alert(`Order #${orderId.substring(0, 8)} berhasil diperbarui ke status: ${newStatus}`);
      refreshAllData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSavingOrderId(null);
    }
  };

  // Payout disbursement handler
  const handleDisbursePayout = async (payoutId: string) => {
    if (!confirm('Apakah Anda yakin dana sebesar nominal sudah ditransfer ke rekening seller?')) return;
    try {
      const res = await fetch('/api/admin/payouts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payoutId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mencairkan dana');

      alert(data.message);
      refreshAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // User seller verification handler
  const handleVerifySeller = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'VERIFIED' ? 'PENDING' : 'VERIFIED';
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status_verifikasi: newStatus, is_seller: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal verifikasi user');
      refreshAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Campus addition handler
  const handleAddCampus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampusName.trim()) return;
    try {
      const res = await fetch('/api/admin/campuses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama_kampus: newCampusName.trim(), kota: 'Surabaya' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menambah kampus');

      setNewCampusName('');
      setIsCampusModalOpen(false);
      refreshAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Filtered order list based on status tab & search
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === 'ALL' || o.status === orderStatusFilter;
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.buyer?.nama_lengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.product?.nama_barang.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate Metrics
  const pendingPayoutCount = payouts.filter((p) => p.status === 'MENUNGGU_PENCAIRAN').length;
  const pendingPayoutNominal = payouts
    .filter((p) => p.status === 'MENUNGGU_PENCAIRAN')
    .reduce((acc, curr) => acc + (curr.nominal || 0), 0);

  const totalSellerCount = users.filter((u) => u.is_seller).length;

  // Platform Profit Calculations
  const paidOrders = orders.filter((o) => ['DIBAYAR', 'SELESAI'].includes(o.status));
  
  const overallMarkupProfit = paidOrders.reduce((sum, o) => {
    const hj = o.product?.harga_jual || 0;
    const hi = o.product?.harga_input || 0;
    return sum + Math.max(0, hj - hi);
  }, 0);

  const overallOngkirProfit = paidOrders.reduce((sum, o) => {
    return sum + (o.opsi_pengiriman === 'KURIR' ? (o.ongkir || 0) : 0);
  }, 0);

  const overallPlatformProfit = overallMarkupProfit + overallOngkirProfit;

  // Monthly Profit Trend Calculations
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const yearOptions = [2024, 2025, 2026, 2027];

  const dailyChartData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dayOrders = paidOrders.filter((o) => {
      const d = new Date(o.created_at);
      return d.getDate() === day && d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    });

    const markupProfit = dayOrders.reduce((sum, o) => {
      const hj = o.product?.harga_jual || 0;
      const hi = o.product?.harga_input || 0;
      return sum + Math.max(0, hj - hi);
    }, 0);

    const ongkirProfit = dayOrders.reduce((sum, o) => {
      return sum + (o.opsi_pengiriman === 'KURIR' ? (o.ongkir || 0) : 0);
    }, 0);

    const totalProfit = markupProfit + ongkirProfit;

    return {
      day,
      dayOrders,
      markupProfit,
      ongkirProfit,
      totalProfit,
    };
  });

  const monthTotalProfit = dailyChartData.reduce((acc, curr) => acc + curr.totalProfit, 0);
  const monthTotalMarkup = dailyChartData.reduce((acc, curr) => acc + curr.markupProfit, 0);
  const monthTotalOngkir = dailyChartData.reduce((acc, curr) => acc + curr.ongkirProfit, 0);

  const maxDailyProfit = Math.max(...dailyChartData.map((d) => d.totalProfit), 50000);

  const monthPaidOrders = paidOrders.filter((o) => {
    const d = new Date(o.created_at);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  return (
    <div className="min-h-screen bg-[#F9F9F8] text-base-dark flex flex-col lg:flex-row font-sans selection:bg-primary selection:text-white">
      
      {/* ========================================================================= */}
      {/* SIDEBAR NAVIGATION - Fixed to Left Edge on Desktop */}
      {/* ========================================================================= */}
      <aside className="w-full lg:w-72 lg:fixed lg:top-0 lg:bottom-0 lg:left-0 lg:h-screen bg-base-white border-r border-gray-light flex flex-col shrink-0 z-40">
        
        {/* SIM Branding Header */}
        <div className="p-6 border-b border-gray-light flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-primary group-hover:rotate-12 transition-transform">
              <Leaf className="w-7 h-7 fill-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black text-base-dark tracking-widest uppercase">
                Barangin
              </span>
              <span className="text-[9px] font-bold text-gray tracking-[0.2em] uppercase leading-none">
                SIM Control Panel
              </span>
            </div>
          </Link>
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-primary-light text-primary border border-primary/20 uppercase tracking-wide">
            Admin
          </span>
        </div>

        {/* System Region / Status Info */}
        <div className="px-6 py-3 bg-[#F5F5F3] border-b border-gray-light flex items-center justify-between text-[11px]">
          <span className="text-gray flex items-center gap-2 font-bold">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Ops Surabaya
          </span>
          <span className="text-gray-dark font-bold font-mono">SeaBank QRIS</span>
        </div>

        {/* Main SIM Modules Navigation List */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <p className="px-3 text-[10px] font-bold text-gray uppercase tracking-widest mb-3">
            Modul Manajemen
          </p>

          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-primary text-white shadow-sm'
                : 'text-base-dark/80 hover:bg-base-light hover:text-base-dark'
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4" />
              <span>Ringkasan Executive</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-primary text-white shadow-sm'
                : 'text-base-dark/80 hover:bg-base-light hover:text-base-dark'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4" />
              <span>Order &amp; Resi WA</span>
            </div>
            {stats.pendingOrders > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                {stats.pendingOrders}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('payouts')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'payouts'
                ? 'bg-primary text-white shadow-sm'
                : 'text-base-dark/80 hover:bg-base-light hover:text-base-dark'
            }`}
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4" />
              <span>Pencairan Payout</span>
            </div>
            {pendingPayoutCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {pendingPayoutCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'products'
                ? 'bg-primary text-white shadow-sm'
                : 'text-base-dark/80 hover:bg-base-light hover:text-base-dark'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4" />
              <span>Katalog &amp; Markup</span>
            </div>
            <span className="text-[10px] font-bold text-gray">{stats.totalProducts}</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'users'
                ? 'bg-primary text-white shadow-sm'
                : 'text-base-dark/80 hover:bg-base-light hover:text-base-dark'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4" />
              <span>User &amp; Verifikasi Seller</span>
            </div>
            <span className="text-[10px] font-bold text-gray">{users.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('campuses')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'campuses'
                ? 'bg-primary text-white shadow-sm'
                : 'text-base-dark/80 hover:bg-base-light hover:text-base-dark'
            }`}
          >
            <div className="flex items-center gap-3">
              <Building2 className="w-4 h-4" />
              <span>Jaringan Kampus</span>
            </div>
            <span className="text-[10px] font-bold text-gray">{campuses.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'audit'
                ? 'bg-primary text-white shadow-sm'
                : 'text-base-dark/80 hover:bg-base-light hover:text-base-dark'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4" />
              <span>Audit Trail System</span>
            </div>
          </button>
        </nav>

        {/* Admin User Footer Profile with Popover Menu */}
        <div className="p-4 border-t border-gray-light bg-[#F9F9F8] relative">
          
          <AnimatePresence>
            {isAdminUserMenuOpen && (
              <motion.div
                key="admin-user-popover-menu"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full left-4 right-4 mb-2 bg-base-white border border-gray-light rounded-2xl shadow-xl p-2 z-50 text-xs text-base-dark space-y-1"
              >
                <Link
                  href="/"
                  onClick={() => setIsAdminUserMenuOpen(false)}
                  className="flex items-center gap-2.5 p-2.5 hover:bg-base-light text-base-dark font-bold rounded-xl transition-colors"
                >
                  <Home className="w-4 h-4 text-primary" />
                  <span>Kembali ke Landing Page</span>
                </Link>

                <button
                  onClick={() => {
                    setIsAdminUserMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 p-2.5 hover:bg-red-50 text-red-600 rounded-xl transition-colors font-bold text-left cursor-pointer border-t border-gray-light/60 mt-1"
                >
                  <LogOut className="w-4 h-4 text-red-600" />
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
              <div className="w-8 h-8 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center text-xs shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-base-dark truncate">{user?.nama_lengkap || 'Admin Ops'}</span>
                <span className="text-[10px] font-semibold text-gray truncate">{user?.email || 'admin@barangin.com'}</span>
              </div>
            </div>

            <button
              onClick={() => setIsAdminUserMenuOpen(!isAdminUserMenuOpen)}
              className="p-2 text-gray hover:text-base-dark hover:bg-base-light rounded-xl transition cursor-pointer"
              title="Menu Admin"
            >
              <ChevronUp className={`w-4 h-4 transition-transform duration-200 ${isAdminUserMenuOpen ? 'rotate-180 text-primary' : ''}`} />
            </button>
          </div>

        </div>

      </aside>

      {/* ========================================================================= */}
      {/* MAIN WORKSPACE CONTENT */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#F9F9F8] lg:ml-72 min-h-screen">
        
        {/* Top Control Bar */}
        <header className="h-20 px-8 bg-base-white/90 border-b border-gray-light flex items-center justify-between gap-4 sticky top-0 z-30 backdrop-blur-md">
          
          <div className="flex items-center gap-3">
            <h1 className="text-base font-black text-base-dark uppercase tracking-wide flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-primary" />
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
            {/* Search Input */}
            <div className="relative hidden md:block w-72">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari order / user / barang..."
                className="w-full bg-[#F5F5F3] border border-gray-light rounded-full pl-9 pr-4 py-2 text-xs text-base-dark placeholder-gray focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/20 transition"
              />
            </div>

            {/* Time Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-base-light border border-gray-light rounded-full text-[11px] font-bold text-gray-dark">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>{currentTime}</span>
            </div>

            {/* Manual Refresh Button */}
            <button
              onClick={refreshAllData}
              disabled={loading}
              className="px-4 py-2 bg-base-white hover:bg-base-light text-base-dark border border-gray-light rounded-full transition text-xs font-bold flex items-center gap-2 shadow-sm"
              title="Refresh Data SIM"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Refresh</span>
            </button>
          </div>

        </header>

        {/* Content Body Area */}
        <div className="p-8 space-y-8 flex-1">

          {/* ========================================================================= */}
          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {/* ========================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Executive KPI Stats Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Card 1: Keuntungan Platform */}
                <div className="bg-base-white border border-gray-light p-6 rounded-[28px] flex flex-col justify-between h-40 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray uppercase tracking-widest">Keuntungan Platform</span>
                    <div className="w-9 h-9 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-primary">{formatRupiah(overallPlatformProfit)}</h3>
                    <p className="text-[10px] font-bold text-gray mt-1 uppercase tracking-wider">
                      Markup ({formatRupiah(overallMarkupProfit)}) + Ongkir ({formatRupiah(overallOngkirProfit)})
                    </p>
                  </div>
                </div>

                {/* Card 2: Pesanan Pending WA */}
                <div className="bg-base-white border border-gray-light p-6 rounded-[28px] flex flex-col justify-between h-40 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray uppercase tracking-widest">Pesanan Pending WA</span>
                    <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-amber-600">{stats.pendingOrders}</h3>
                    <p className="text-[10px] font-bold text-gray mt-1 uppercase tracking-wider">Perlu konfirmasi QRIS</p>
                  </div>
                </div>

                {/* Card 3: Daftar Payout Seller */}
                <div className="bg-base-white border border-gray-light p-6 rounded-[28px] flex flex-col justify-between h-40 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray uppercase tracking-widest">Daftar Payout Seller</span>
                    <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-blue-600">{pendingPayoutCount}</h3>
                    <p className="text-[10px] font-bold text-gray mt-1 uppercase tracking-wider">
                      Pending: {formatRupiah(pendingPayoutNominal)}
                    </p>
                  </div>
                </div>

                {/* Card 4: Total Seller */}
                <div className="bg-primary text-white p-6 rounded-[28px] flex flex-col justify-between h-40 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Total Seller</span>
                    <div className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center font-bold">
                      <Store className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black">{totalSellerCount}</h3>
                    <p className="text-[10px] font-bold opacity-80 mt-1 uppercase tracking-wider">
                      Dari total {users.length} mahasiswa
                    </p>
                  </div>
                </div>

              </div>

              {/* Card Grafik Tren Keuntungan Platform (Replacing Aturan Bisnis Card) */}
              <div className="bg-base-white border border-gray-light rounded-[28px] p-8 space-y-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-light pb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary-light text-primary flex items-center justify-center font-bold">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-base font-black text-base-dark uppercase tracking-wider">
                        Grafik Tren Keuntungan Platform
                      </h2>
                      <p className="text-xs text-gray font-medium mt-0.5">
                        Riwayat estimasi keuntungan dari Markup Harga &amp; Ongkir Pengiriman Kurir untuk <strong className="text-base-dark">{monthNames[selectedMonth]} {selectedYear}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Month & Year Select Filter on Top Right Corner */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="relative">
                      <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className="appearance-none bg-[#F5F5F3] border border-gray-light rounded-full pl-4 pr-8 py-2 text-xs font-bold text-base-dark focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                      >
                        {monthNames.map((m, idx) => (
                          <option key={idx} value={idx}>
                            {m}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray pointer-events-none" />
                    </div>

                    <div className="relative">
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="appearance-none bg-[#F5F5F3] border border-gray-light rounded-full pl-4 pr-8 py-2 text-xs font-bold text-base-dark focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                      >
                        {yearOptions.map((y) => (
                          <option key={y} value={y}>
                            Tahun {y}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Profit Summary Badges for Selected Month */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Total Keuntungan Bulan Ini</span>
                      <p className="text-lg font-black text-primary mt-0.5">{formatRupiah(monthTotalProfit)}</p>
                    </div>
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>

                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">Profit dari Markup Harga</span>
                      <p className="text-lg font-black text-emerald-700 mt-0.5">{formatRupiah(monthTotalMarkup)}</p>
                    </div>
                    <Package className="w-6 h-6 text-emerald-600" />
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-blue-800 uppercase tracking-widest">Profit dari Ongkir Kurir</span>
                      <p className="text-lg font-black text-blue-700 mt-0.5">{formatRupiah(monthTotalOngkir)}</p>
                    </div>
                    <Truck className="w-6 h-6 text-blue-600" />
                  </div>
                </div>

                {/* Daily Visual Bar Chart */}
                <div className="bg-[#F9F9F8] border border-gray-light rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between text-xs text-gray font-bold pb-2 border-b border-gray-light/60">
                    <span>Diagram Batang Harian ({monthNames[selectedMonth]} {selectedYear})</span>
                    <span>Maks Harian: {formatRupiah(maxDailyProfit)}</span>
                  </div>

                  <div className="h-44 flex items-end justify-between gap-1.5 pt-4 overflow-x-auto custom-scrollbar">
                    {dailyChartData.map((data) => {
                      const heightPercent = maxDailyProfit > 0 ? Math.max(12, (data.totalProfit / maxDailyProfit) * 100) : 12;
                      const hasProfit = data.totalProfit > 0;

                      return (
                        <div
                          key={data.day}
                          className="flex-1 flex flex-col items-center gap-1 group relative min-w-[20px]"
                        >
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-50">
                            <div className="bg-base-dark text-white text-[10px] p-2 rounded-xl shadow-xl whitespace-nowrap text-center space-y-0.5 font-bold">
                              <p className="text-emerald-400">Tgl {data.day} {monthNames[selectedMonth]}: {formatRupiah(data.totalProfit)}</p>
                              <p className="text-gray-300 font-normal">Markup: {formatRupiah(data.markupProfit)} • Ongkir: {formatRupiah(data.ongkirProfit)}</p>
                              <p className="text-gray-400 text-[9px] font-normal">{data.dayOrders.length} Order Selesai</p>
                            </div>
                          </div>

                          {/* Bar Element */}
                          <div className="w-full flex items-end justify-center h-full">
                            <div
                              style={{ height: `${heightPercent}%` }}
                              className={`w-full max-w-[18px] rounded-t-md transition-all duration-300 ${
                                hasProfit
                                  ? 'bg-primary group-hover:bg-primary-dark shadow-sm'
                                  : 'bg-gray-light/50 group-hover:bg-gray-light'
                              }`}
                            />
                          </div>

                          {/* Day Label */}
                          <span className={`text-[9px] font-bold ${hasProfit ? 'text-primary' : 'text-gray'}`}>
                            {data.day}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Monthly Transaction History Table */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-black text-base-dark uppercase tracking-wider">
                    Riwayat Transaksi Lolos ({monthPaidOrders.length} Order di {monthNames[selectedMonth]} {selectedYear})
                  </h3>

                  {monthPaidOrders.length === 0 ? (
                    <div className="p-6 bg-[#F9F9F8] border border-gray-light rounded-2xl text-center text-xs text-gray font-medium">
                      Tidak ada transaksi selesai pada bulan {monthNames[selectedMonth]} {selectedYear}.
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-gray-light rounded-2xl">
                      <table className="w-full text-left text-xs text-base-dark">
                        <thead className="bg-[#F5F5F3] border-b border-gray-light text-gray uppercase text-[10px] font-bold">
                          <tr>
                            <th className="p-3.5">Tanggal</th>
                            <th className="p-3.5">Order ID &amp; Barang</th>
                            <th className="p-3.5">Pembeli</th>
                            <th className="p-3.5">Profit Markup</th>
                            <th className="p-3.5">Profit Ongkir</th>
                            <th className="p-3.5 font-black text-primary">Total Keuntungan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-light">
                          {monthPaidOrders.map((ord) => {
                            const hj = ord.product?.harga_jual || 0;
                            const hi = ord.product?.harga_input || 0;
                            const markupProf = Math.max(0, hj - hi);
                            const ongkirProf = ord.opsi_pengiriman === 'KURIR' ? (ord.ongkir || 0) : 0;
                            const orderTotalProf = markupProf + ongkirProf;

                            return (
                              <tr key={ord.id} className="hover:bg-[#F9F9F8] transition">
                                <td className="p-3.5 text-gray font-medium font-mono text-[11px]">
                                  {formatDate(ord.created_at)}
                                </td>
                                <td className="p-3.5 font-bold">
                                  <span className="font-mono text-base-dark">#{ord.id.substring(0, 8)}</span>
                                  <p className="text-[11px] text-gray font-normal">{ord.product?.nama_barang}</p>
                                </td>
                                <td className="p-3.5 font-medium">{ord.buyer?.nama_lengkap}</td>
                                <td className="p-3.5 text-emerald-700 font-bold">{formatRupiah(markupProf)}</td>
                                <td className="p-3.5 text-blue-700 font-bold">{formatRupiah(ongkirProf)}</td>
                                <td className="p-3.5 font-black text-primary">{formatRupiah(orderTotalProf)}</td>
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
              <div className="bg-base-white border border-gray-light rounded-[28px] p-8 space-y-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-light pb-4">
                  <h2 className="text-sm font-black text-base-dark uppercase tracking-wider">Transaksi Terbaru Masuk</h2>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    Lihat Semua Order &rarr;
                  </button>
                </div>

                <div className="divide-y divide-gray-light">
                  {orders.slice(0, 5).map((ord) => {
                    const badge = getOrderStatusBadge(ord.status);
                    return (
                      <div key={ord.id} className="py-4 flex items-center justify-between gap-4 text-xs">
                        <div>
                          <p className="font-black text-base-dark font-mono">#{ord.id.substring(0, 8)}</p>
                          <p className="text-gray mt-0.5">
                            Pembeli: <span className="text-base-dark font-bold">{ord.buyer?.nama_lengkap}</span> • {ord.product?.nama_barang}
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 text-[10px] font-bold rounded-full border ${badge.bg}`}>
                            {badge.label}
                          </span>
                          <span className="font-black text-primary text-sm">{formatRupiah(ord.total_harga)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: MANAJEMEN ORDER & RESI WA */}
          {/* ========================================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2 border-b border-gray-light pb-4">
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
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      orderStatusFilter === st.id
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-base-white text-base-dark border border-gray-light hover:bg-base-light'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Order List Cards */}
              <div className="space-y-4">
                {filteredOrders.map((ord) => {
                  const badge = getOrderStatusBadge(ord.status);
                  const isSaving = savingOrderId === ord.id;

                  return (
                    <div
                      key={ord.id}
                      className="bg-base-white border border-gray-light rounded-[28px] p-6 space-y-4 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-light">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-black text-base-dark font-mono">#{ord.id}</span>
                            <span className={`px-3 py-0.5 text-[10px] font-bold rounded-full border ${badge.bg}`}>
                              {badge.label}
                            </span>
                            <span className="text-[10px] font-bold text-gray uppercase tracking-wider">
                              Opsi: <strong className="text-base-dark">{ord.opsi_pengiriman}</strong>
                            </span>
                          </div>
                          <p className="text-xs text-gray mt-1 font-medium">
                            Pembeli: <strong className="text-base-dark">{ord.buyer?.nama_lengkap}</strong> ({ord.buyer?.no_hp || '-'}) • Waktu: {formatDate(ord.created_at)}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-[11px] font-bold text-gray uppercase tracking-widest">Total Tagihan (Include Ongkir)</span>
                          <p className="text-xl font-black text-primary">{formatRupiah(ord.total_harga)}</p>
                        </div>
                      </div>

                      {/* Product details & Price breakdown */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-[#F5F5F3] p-4 rounded-2xl border border-gray-light">
                        <div>
                          <span className="text-[10px] font-bold text-gray uppercase tracking-widest">Detail Barang</span>
                          <p className="font-bold text-base-dark mt-0.5">{ord.product?.nama_barang}</p>
                          <p className="text-[11px] text-gray">Harga Input Penjual: {formatRupiah(ord.product?.harga_input)}</p>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-gray uppercase tracking-widest">Penjual (Seller)</span>
                          <p className="font-bold text-base-dark mt-0.5">{ord.product?.seller?.nama_lengkap || 'Seller'}</p>
                          <p className="text-[11px] text-gray">Alamat Jemput: {ord.product?.seller?.alamat_kos || '-'}</p>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-gray uppercase tracking-widest">Pengiriman &amp; Logistik</span>
                          <p className="font-bold text-base-dark mt-0.5">Jarak: {ord.jarak_km || 0} km • Ongkir: {formatRupiah(ord.ongkir || 0)}</p>
                          <p className="text-[11px] text-gray">Alamat Pembeli: {ord.buyer?.alamat_kos || '-'}</p>
                        </div>
                      </div>

                      {/* Status Control Actions */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <label className="text-xs font-bold text-base-dark shrink-0 uppercase tracking-wide">Ubah Status:</label>
                          <select
                            defaultValue={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            disabled={isSaving}
                            className="bg-base-white border border-gray-light rounded-xl px-4 py-2 text-xs text-base-dark font-bold focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
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
                            className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-2 transition"
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
          )}

          {/* ========================================================================= */}
          {/* TAB 3: PENCAIRAN PAYOUT SELLER */}
          {/* ========================================================================= */}
          {activeTab === 'payouts' && (
            <div className="space-y-6">
              
              <div className="bg-base-white border border-gray-light rounded-[28px] p-6 shadow-sm">
                <h2 className="text-sm font-black text-base-dark uppercase tracking-wider mb-1">Antrian Transfer Payout Penjual</h2>
                <p className="text-xs text-gray">
                  Sesuai PRD 9.3: Nominal yang ditransfer ke penjual adalah sebesar <strong className="text-base-dark">harga input asli penjual</strong> (sebelum markup &amp; ongkir).
                </p>
              </div>

              <div className="bg-base-white border border-gray-light rounded-[28px] overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs text-base-dark">
                  <thead className="bg-[#F5F5F3] border-b border-gray-light text-gray uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-4">Order ID &amp; Barang</th>
                      <th className="p-4">Penjual (Seller)</th>
                      <th className="p-4">Info Rekening Bank</th>
                      <th className="p-4">Nominal Transfer</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Aksi Transfer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-light">
                    {payouts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#F9F9F8] transition">
                        <td className="p-4">
                          <p className="font-bold text-base-dark font-mono">#{p.order_id?.substring(0, 8)}</p>
                          <p className="text-[11px] text-gray">{p.order?.product?.nama_barang}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-base-dark">{p.seller?.nama_lengkap}</p>
                          <p className="text-[11px] text-gray">{p.seller?.email}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-primary uppercase">{p.seller?.nama_bank || 'BCA / SeaBank'}</p>
                          <p className="font-mono text-base-dark text-xs font-bold">{p.seller?.no_rekening || '123456789'}</p>
                          <p className="text-[10px] text-gray">a.n {p.seller?.nama_pemilik_rekening || p.seller?.nama_lengkap}</p>
                        </td>
                        <td className="p-4 font-black text-primary text-sm">
                          {formatRupiah(p.nominal)}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 text-[10px] font-bold rounded-full border ${
                              p.status === 'DICAIRKAN'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {p.status === 'MENUNGGU_PENCAIRAN' ? (
                            <button
                              onClick={() => handleDisbursePayout(p.id)}
                              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-full text-xs shadow-sm transition"
                            >
                              Tandai Sudah Dicairkan
                            </button>
                          ) : (
                            <span className="text-[11px] text-gray font-mono">
                              Cair ({p.tanggal_dicairkan ? formatDate(p.tanggal_dicairkan) : 'Done'})
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: KATALOG PRODUK & MARKUP */}
          {/* ========================================================================= */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              
              <div className="bg-base-white border border-gray-light rounded-[28px] overflow-hidden shadow-sm">
                <div className="p-5 bg-[#F5F5F3] border-b border-gray-light flex items-center justify-between">
                  <span className="text-xs font-bold text-base-dark uppercase tracking-wider">Katalog Produk Tersedia</span>
                  <span className="text-xs text-gray font-bold">Total Produk: {products.length}</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-base-dark">
                    <thead className="bg-[#F5F5F3] border-b border-gray-light text-gray uppercase text-[10px] font-bold">
                      <tr>
                        <th className="p-4">Barang</th>
                        <th className="p-4">Seller</th>
                        <th className="p-4">Harga Input Seller</th>
                        <th className="p-4">Harga Jual Public (+Markup)</th>
                        <th className="p-4">Kondisi</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-light">
                      {products.map((prod) => (
                        <tr key={prod.id} className="hover:bg-[#F9F9F8] transition">
                          <td className="p-4">
                            <p className="font-bold text-base-dark">{prod.nama_barang}</p>
                            <p className="text-[10px] text-gray">Kategori: {prod.kategori?.nama_kategori || 'Umum'}</p>
                          </td>
                          <td className="p-4">
                            <p className="font-bold text-base-dark">{prod.seller?.nama_lengkap}</p>
                            <p className="text-[10px] text-gray">{prod.seller?.kampus?.nama_kampus}</p>
                          </td>
                          <td className="p-4 font-bold text-gray-dark">
                            {formatRupiah(prod.harga_input)}
                          </td>
                          <td className="p-4 font-black text-primary">
                            {formatRupiah(prod.harga_jual)}
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 bg-base-light rounded-full text-[10px] font-bold text-base-dark">
                              {prod.kondisi}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                                prod.status === 'TERSEDIA'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              {prod.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: USER & VERIFIKASI SELLER */}
          {/* ========================================================================= */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              
              <div className="bg-base-white border border-gray-light rounded-[28px] overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs text-base-dark">
                  <thead className="bg-[#F5F5F3] border-b border-gray-light text-gray uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-4">Nama &amp; Email</th>
                      <th className="p-4">Kampus (Surabaya)</th>
                      <th className="p-4">Role &amp; Seller Status</th>
                      <th className="p-4">Rekening Bank</th>
                      <th className="p-4 text-center">Status Verifikasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-light">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-[#F9F9F8] transition">
                        <td className="p-4">
                          <p className="font-bold text-base-dark">{u.nama_lengkap}</p>
                          <p className="text-[11px] text-gray">{u.email}</p>
                          <p className="text-[10px] text-gray">WA: {u.no_hp || '-'}</p>
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-base-light text-base-dark rounded-full text-[10px] font-bold border border-gray-light">
                            {u.kampus?.nama_kampus || 'Surabaya'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-amber-700">{u.role}</span>
                          {u.is_seller && <span className="ml-2 text-[10px] text-primary font-bold">(Penjual)</span>}
                        </td>
                        <td className="p-4">
                          <p className="font-mono text-base-dark font-bold text-xs">{u.no_rekening || '-'}</p>
                          <p className="text-[10px] text-gray">{u.nama_bank || '-'} a.n {u.nama_pemilik_rekening || '-'}</p>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleVerifySeller(u.id, u.status_verifikasi)}
                            className={`px-4 py-1.5 rounded-full text-[11px] font-bold border transition shadow-sm ${
                              u.status_verifikasi === 'VERIFIED'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
                            }`}
                          >
                            {u.status_verifikasi === 'VERIFIED' ? 'VERIFIED (Klik Unverify)' : 'PENDING (Klik Verifikasi)'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: JARINGAN KAMPUS SURABAYA */}
          {/* ========================================================================= */}
          {activeTab === 'campuses' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-black text-base-dark uppercase tracking-wider">Jaringan Kampus Terdaftar (Surabaya)</h2>
                  <p className="text-xs text-gray">Daftar kampus yang berhak melakukan transaksi di platform BaranginAja.</p>
                </div>
                <button
                  onClick={() => setIsCampusModalOpen(true)}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-full text-xs flex items-center gap-2 shadow-sm transition"
                >
                  <Plus className="w-4 h-4" /> Tambah Kampus Baru
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {campuses.map((c) => (
                  <div key={c.id} className="bg-base-white border border-gray-light p-6 rounded-[24px] flex items-center justify-between shadow-sm">
                    <div>
                      <h3 className="font-bold text-base-dark text-sm">{c.nama_kampus}</h3>
                      <p className="text-[11px] text-gray">Kota: {c.kota}</p>
                      <p className="text-[10px] font-bold text-primary mt-2 uppercase tracking-wide">{c._count?.users || 0} Mahasiswa Terdaftar</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold">
                      Aktif
                    </span>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 7: AUDIT LOG TRAIL */}
          {/* ========================================================================= */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              
              <div className="bg-base-white border border-gray-light rounded-[28px] p-6 shadow-sm">
                <h2 className="text-sm font-black text-base-dark uppercase tracking-wider mb-1">Audit Trail Aktivitas Admin</h2>
                <p className="text-xs text-gray">
                  Sesuai PRD 8.9 &amp; 14: Seluruh tindakan admin terkait verifikasi bayar, pencairan dana, dan pengubahan data tercatat secara permanen.
                </p>
              </div>

              <div className="bg-base-white border border-gray-light rounded-[28px] p-6 shadow-sm">
                <div className="space-y-4">
                  {activities.map((act) => (
                    <div key={act.id} className="p-4 bg-[#F9F9F8] border border-gray-light rounded-2xl flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center shrink-0">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-base-dark text-xs">{act.admin?.nama_lengkap || 'Admin'}</p>
                          <span className="text-[10px] text-gray font-mono">{formatDate(act.timestamp)}</span>
                        </div>
                        <p className="text-xs text-gray-dark mt-1 font-mono">{act.aksi}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </main>

      {/* Modal Add Campus */}
      {isCampusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base-dark/40 backdrop-blur-sm">
          <div className="bg-base-white border border-gray-light rounded-2xl p-8 max-w-md w-full text-base-dark relative shadow-2xl">
            <button
              onClick={() => setIsCampusModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-gray hover:text-base-dark rounded-full hover:bg-base-light"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-black uppercase tracking-wider mb-6">Tambah Kampus Surabaya</h3>
            <form onSubmit={handleAddCampus} className="space-y-5 text-xs">
              <div>
                <label className="block text-base-dark font-bold mb-2 uppercase tracking-wide">Nama Kampus</label>
                <input
                  type="text"
                  required
                  value={newCampusName}
                  onChange={(e) => setNewCampusName(e.target.value)}
                  placeholder="Contoh: Universitas Pembangunan Nasional (UPN) Veteran"
                  className="w-full p-3 bg-[#F5F5F3] border border-gray-light rounded-xl text-base-dark focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-full text-xs shadow-sm transition"
              >
                Simpan Kampus Baru
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
