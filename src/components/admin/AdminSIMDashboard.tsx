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
  Store,
  Eye
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
  const [newCampusForm, setNewCampusForm] = useState({ nama_kampus: '', kota: 'Surabaya' });
  const [isEditCampusModalOpen, setIsEditCampusModalOpen] = useState(false);
  const [editCampusForm, setEditCampusForm] = useState({ id: '', nama_kampus: '', kota: 'Surabaya', aktif: true });
  const [campusLoading, setCampusLoading] = useState(false);

  // Campus detail user list modal state
  const [isCampusDetailModalOpen, setIsCampusDetailModalOpen] = useState(false);
  const [viewingCampus, setViewingCampus] = useState<any | null>(null);
  const [campusUserSearchQuery, setCampusUserSearchQuery] = useState('');

  const handleOpenDetailCampus = (c: any) => {
    setViewingCampus(c);
    setCampusUserSearchQuery('');
    setIsCampusDetailModalOpen(true);
  };

  // User Management State
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'ALL' | 'BUYER' | 'SELLER' | 'ADMIN'>('ALL');
  const [userStatusFilter, setUserStatusFilter] = useState<'ALL' | 'VERIFIED' | 'PENDING'>('ALL');

  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [createUserForm, setCreateUserForm] = useState({
    nama_lengkap: '',
    email: '',
    password: '',
    no_hp: '',
    alamat_kos: '',
    kampus_id: '',
    role: 'BUYER',
    status_verifikasi: 'VERIFIED',
    is_seller: false,
    nama_bank: '',
    no_rekening: '',
    nama_pemilik_rekening: ''
  });
  const [createUserLoading, setCreateUserLoading] = useState(false);

  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [editUserForm, setEditUserForm] = useState<any>({
    userId: '',
    nama_lengkap: '',
    email: '',
    password: '',
    no_hp: '',
    alamat_kos: '',
    kampus_id: '',
    role: 'BUYER',
    status_verifikasi: 'VERIFIED',
    is_seller: false,
    nama_bank: '',
    no_rekening: '',
    nama_pemilik_rekening: ''
  });
  const [editUserLoading, setEditUserLoading] = useState(false);

  // User detail view modal state
  const [isDetailUserModalOpen, setIsDetailUserModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<any | null>(null);
  const [userDetailTab, setUserDetailTab] = useState<'profile' | 'products' | 'sold' | 'orders'>('profile');

  const handleOpenDetailUser = (u: any) => {
    setViewingUser(u);
    setUserDetailTab('profile');
    setIsDetailUserModalOpen(true);
  };

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

  // User management handlers
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createUserForm.nama_lengkap || !createUserForm.email || !createUserForm.password) {
      alert('Nama lengkap, email, dan password wajib diisi.');
      return;
    }
    setCreateUserLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createUserForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal membuat akun baru');
      setIsCreateUserModalOpen(false);
      setCreateUserForm({
        nama_lengkap: '',
        email: '',
        password: '',
        no_hp: '',
        alamat_kos: '',
        kampus_id: '',
        role: 'BUYER',
        status_verifikasi: 'VERIFIED',
        is_seller: false,
        nama_bank: '',
        no_rekening: '',
        nama_pemilik_rekening: ''
      });
      refreshAllData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCreateUserLoading(false);
    }
  };

  const handleOpenEditUser = (u: any) => {
    setEditUserForm({
      userId: u.id,
      nama_lengkap: u.nama_lengkap || '',
      email: u.email || '',
      password: '',
      no_hp: u.no_hp || '',
      alamat_kos: u.alamat_kos || '',
      kampus_id: u.kampus_id || u.kampus?.id || '',
      role: u.role || 'BUYER',
      status_verifikasi: u.status_verifikasi || 'VERIFIED',
      is_seller: !!u.is_seller,
      nama_bank: u.nama_bank || '',
      no_rekening: u.no_rekening || '',
      nama_pemilik_rekening: u.nama_pemilik_rekening || ''
    });
    setIsEditUserModalOpen(true);
  };

  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditUserLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editUserForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memperbarui akun');
      setIsEditUserModalOpen(false);
      refreshAllData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setEditUserLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus akun ${userName}? Tindakan ini tidak dapat dibatalkan.`)) return;
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menghapus user');
      refreshAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleChangeUserRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mengubah role');
      refreshAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = userSearchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      u.nama_lengkap?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.no_hp?.toLowerCase().includes(q) ||
      u.kampus?.nama_kampus?.toLowerCase().includes(q);

    const matchRole =
      userRoleFilter === 'ALL'
        ? true
        : userRoleFilter === 'SELLER'
        ? u.is_seller
        : u.role === userRoleFilter;

    const matchStatus =
      userStatusFilter === 'ALL' || u.status_verifikasi === userStatusFilter;

    return matchQuery && matchRole && matchStatus;
  });

  // Campus management handlers
  const handleAddCampus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampusForm.nama_kampus.trim()) return;
    setCampusLoading(true);
    try {
      const res = await fetch('/api/admin/campuses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama_kampus: newCampusForm.nama_kampus.trim(),
          kota: newCampusForm.kota.trim() || 'Surabaya'
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menambah kampus');

      setNewCampusForm({ nama_kampus: '', kota: 'Surabaya' });
      setIsCampusModalOpen(false);
      refreshAllData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCampusLoading(false);
    }
  };

  const handleOpenEditCampus = (c: any) => {
    setEditCampusForm({
      id: c.id,
      nama_kampus: c.nama_kampus || '',
      kota: c.kota || 'Surabaya',
      aktif: typeof c.aktif === 'boolean' ? c.aktif : true
    });
    setIsEditCampusModalOpen(true);
  };

  const handleEditCampusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCampusForm.nama_kampus.trim()) return;
    setCampusLoading(true);
    try {
      const res = await fetch('/api/admin/campuses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campusId: editCampusForm.id,
          nama_kampus: editCampusForm.nama_kampus.trim(),
          kota: editCampusForm.kota.trim(),
          aktif: editCampusForm.aktif
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memperbarui kampus');

      setIsEditCampusModalOpen(false);
      refreshAllData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCampusLoading(false);
    }
  };

  const handleToggleCampusStatus = async (c: any) => {
    try {
      const res = await fetch('/api/admin/campuses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campusId: c.id,
          aktif: !(typeof c.aktif === 'boolean' ? c.aktif : true)
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mengubah status kampus');
      refreshAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteCampus = async (campusId: string, campusName: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus jaringan kampus "${campusName}"? Seluruh user terkait akan di-unlink.`)) return;
    try {
      const res = await fetch(`/api/admin/campuses?campusId=${campusId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menghapus kampus');

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
            <div className="w-9 h-9 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Image src="/logo.png" alt="BaranginAja Logo" width={36} height={36} className="object-contain w-full h-full" />
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
                    <p className="text-[10px] font-bold text-gray mt-1 uppercase tracking-wider">Perlu Konfirmasi WA (Hold 5 Mnt)</p>
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
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-sm font-black text-base-dark font-mono">#{ord.id}</span>
                            <span className={`px-3 py-0.5 text-[10px] font-bold rounded-full border ${badge.bg}`}>
                              {badge.label}
                            </span>
                            {ord.status === 'MENUNGGU_PEMBAYARAN' && ord.hold_expires_at && (() => {
                              const expireTime = new Date(ord.hold_expires_at).getTime();
                              const diffMs = expireTime - Date.now();
                              const totalSeconds = Math.floor(diffMs / 1000);

                              if (totalSeconds <= 0) {
                                return (
                                  <span className="px-3 py-0.5 text-[10px] font-extrabold rounded-full bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1 shadow-xs">
                                    <Clock className="w-3 h-3 text-rose-600" />
                                    <span>Hold Expired (Rilis Otomatis)</span>
                                  </span>
                                );
                              }

                              const mins = Math.floor(totalSeconds / 60);
                              const secs = totalSeconds % 60;
                              const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

                              return (
                                <span className="px-3 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 shadow-xs animate-pulse">
                                  <Clock className="w-3 h-3 text-amber-700" />
                                  <span>Timer Hold WA: {formatted}</span>
                                </span>
                              );
                            })()}
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
          {/* TAB 5: MANAJEMEN AKUN & VERIFIKASI PENGGUNA */}
          {/* ========================================================================= */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              
              {/* Header section with Action Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-base-white border border-gray-light p-6 rounded-[28px] shadow-sm">
                <div>
                  <h2 className="text-sm font-black text-base-dark uppercase tracking-wider">Manajemen Akun &amp; Hak Akses Pengguna</h2>
                  <p className="text-xs text-gray">Kelola profil user, verifikasi status seller, atur role admin, dan buat akun baru.</p>
                </div>
                <button
                  onClick={() => setIsCreateUserModalOpen(true)}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-full text-xs flex items-center gap-2 shadow-sm transition shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Tambah Akun Baru
                </button>
              </div>

              {/* Summary Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-base-white border border-gray-light p-5 rounded-[24px] shadow-xs">
                  <p className="text-[10px] font-bold text-gray uppercase tracking-wider">Total Pengguna</p>
                  <p className="text-xl font-black text-base-dark mt-1">{users.length}</p>
                </div>
                <div className="bg-base-white border border-gray-light p-5 rounded-[24px] shadow-xs">
                  <p className="text-[10px] font-bold text-gray uppercase tracking-wider">Penjual (Seller)</p>
                  <p className="text-xl font-black text-[#007AAD] mt-1">{users.filter((u) => u.is_seller).length}</p>
                </div>
                <div className="bg-base-white border border-gray-light p-5 rounded-[24px] shadow-xs">
                  <p className="text-[10px] font-bold text-gray uppercase tracking-wider">Pending Verifikasi</p>
                  <p className="text-xl font-black text-amber-600 mt-1">{users.filter((u) => u.status_verifikasi === 'PENDING').length}</p>
                </div>
                <div className="bg-base-white border border-gray-light p-5 rounded-[24px] shadow-xs">
                  <p className="text-[10px] font-bold text-gray uppercase tracking-wider">Administrator</p>
                  <p className="text-xl font-black text-rose-600 mt-1">{users.filter((u) => u.role === 'ADMIN').length}</p>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="bg-base-white border border-gray-light p-4 rounded-[24px] flex flex-col sm:flex-row items-center gap-3 shadow-sm">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray" />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Cari nama, email, no HP, atau kampus..."
                    className="w-full pl-10 pr-4 py-2 bg-[#F5F5F3] border border-gray-light rounded-xl text-xs font-semibold text-base-dark focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={userRoleFilter}
                    onChange={(e: any) => setUserRoleFilter(e.target.value)}
                    className="p-2 bg-[#F5F5F3] border border-gray-light rounded-xl text-xs font-bold text-base-dark focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value="ALL">Semua Role</option>
                    <option value="BUYER">Buyer / Mahasiswa</option>
                    <option value="SELLER">Seller / Penjual</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <select
                    value={userStatusFilter}
                    onChange={(e: any) => setUserStatusFilter(e.target.value)}
                    className="p-2 bg-[#F5F5F3] border border-gray-light rounded-xl text-xs font-bold text-base-dark focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value="ALL">Semua Status</option>
                    <option value="VERIFIED">VERIFIED</option>
                    <option value="PENDING">PENDING</option>
                  </select>
                </div>
              </div>

              {/* Accounts Table */}
              <div className="bg-base-white border border-gray-light rounded-[28px] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-base-dark">
                    <thead className="bg-[#F5F5F3] border-b border-gray-light text-gray uppercase text-[10px] font-bold">
                      <tr>
                        <th className="p-4">Pengguna</th>
                        <th className="p-4">Kampus &amp; Alamat</th>
                        <th className="p-4">Role Akses</th>
                        <th className="p-4">Rekening Bank</th>
                        <th className="p-4 text-center">Status Verifikasi</th>
                        <th className="p-4 text-center">Kelola / Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-light">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray font-medium text-xs">
                            Tidak ada akun pengguna yang sesuai dengan filter.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-[#F9F9F8] transition">
                            <td className="p-4">
                              <button
                                onClick={() => handleOpenDetailUser(u)}
                                className="font-bold text-base-dark hover:text-[#007AAD] hover:underline text-left cursor-pointer block"
                              >
                                {u.nama_lengkap}
                              </button>
                              <p className="text-[11px] text-gray">{u.email}</p>
                              <p className="text-[10px] text-gray font-mono">WA: {u.no_hp || '-'}</p>
                            </td>
                            <td className="p-4">
                              <span className="inline-block px-2.5 py-0.5 bg-base-light text-base-dark rounded-full text-[10px] font-bold border border-gray-light mb-1">
                                {u.kampus?.nama_kampus || 'Surabaya'}
                              </span>
                              <p className="text-[10px] text-gray line-clamp-1 max-w-[200px]" title={u.alamat_kos || ''}>
                                {u.alamat_kos || '-'}
                              </p>
                            </td>
                            <td className="p-4">
                              <select
                                value={u.role}
                                onChange={(e) => handleChangeUserRole(u.id, e.target.value)}
                                className="px-2 py-1 bg-white border border-gray-light rounded-lg text-[11px] font-bold text-base-dark focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                              >
                                <option value="BUYER">BUYER</option>
                                <option value="ADMIN">ADMIN</option>
                              </select>
                              {u.is_seller && (
                                <span className="ml-2 inline-block px-2 py-0.5 bg-[#007AAD]/10 text-[#007AAD] font-extrabold text-[9px] rounded-md">
                                  PENJUAL
                                </span>
                              )}
                            </td>
                            <td className="p-4">
                              <p className="font-mono text-base-dark font-bold text-xs">{u.no_rekening || '-'}</p>
                              <p className="text-[10px] text-gray">{u.nama_bank || '-'} a.n {u.nama_pemilik_rekening || '-'}</p>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => handleVerifySeller(u.id, u.status_verifikasi)}
                                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition shadow-xs cursor-pointer ${
                                  u.status_verifikasi === 'VERIFIED'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-rose-50 hover:text-rose-700'
                                    : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-emerald-50 hover:text-emerald-700'
                                }`}
                              >
                                {u.status_verifikasi === 'VERIFIED' ? 'VERIFIED' : 'PENDING'}
                              </button>
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => handleOpenDetailUser(u)}
                                  title="Lihat Rincian Akun & Produk Seller"
                                  className="p-1.5 bg-[#007AAD]/10 hover:bg-[#007AAD]/20 text-[#007AAD] rounded-lg border border-[#007AAD]/20 transition cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleOpenEditUser(u)}
                                  title="Edit Detail Akun"
                                  className="p-1.5 bg-base-light hover:bg-gray-light text-base-dark rounded-lg border border-gray-light transition cursor-pointer"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(u.id, u.nama_lengkap)}
                                  title="Hapus Akun"
                                  disabled={u.id === user?.id}
                                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-200 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: JARINGAN KAMPUS SURABAYA (CRUD) */}
          {/* ========================================================================= */}
          {activeTab === 'campuses' && (
            <div className="space-y-6">
              
              {/* Header section with add button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-base-white border border-gray-light p-6 rounded-[28px] shadow-sm">
                <div>
                  <h2 className="text-base font-black text-base-dark uppercase tracking-wider flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    <span>Jaringan Kampus Terdaftar ({campuses.length} Kampus)</span>
                  </h2>
                  <p className="text-xs text-gray font-medium mt-1">
                    Kelola daftar kampus mitra Surabaya, status keaktifan cabang, dan data jaringan perguruan tinggi.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setNewCampusForm({ nama_kampus: '', kota: 'Surabaya' });
                    setIsCampusModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-full text-xs flex items-center gap-2 shadow-sm transition shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Kampus Baru</span>
                </button>
              </div>

              {/* Campus Grid Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {campuses.length === 0 ? (
                  <div className="col-span-full p-12 text-center bg-base-white border border-gray-light rounded-[28px] text-gray">
                    <Building2 className="w-12 h-12 mx-auto text-gray/40 mb-3" />
                    <p className="text-sm font-bold text-base-dark">Belum Ada Kampus Terdaftar</p>
                    <p className="text-xs">Klik &quot;Tambah Kampus Baru&quot; untuk menginput kampus baru ke jaringan SIM.</p>
                  </div>
                ) : (
                  campuses.map((c) => {
                    const isAktif = typeof c.aktif === 'boolean' ? c.aktif : true;
                    return (
                      <div
                        key={c.id}
                        className="bg-base-white border border-gray-light p-6 rounded-[28px] flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-primary-light text-primary flex items-center justify-center font-bold shrink-0">
                              <Building2 className="w-5 h-5" />
                            </div>
                            <button
                              onClick={() => handleToggleCampusStatus(c)}
                              className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase transition cursor-pointer ${
                                isAktif
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                              }`}
                              title="Klik untuk ubah status aktif/non-aktif"
                            >
                              {isAktif ? 'AKTIF' : 'NON-AKTIF'}
                            </button>
                          </div>

                          <div>
                            <h3 className="font-extrabold text-base-dark text-base">{c.nama_kampus}</h3>
                            <p className="text-xs text-gray font-medium">Kota: <strong className="text-base-dark">{c.kota || 'Surabaya'}</strong></p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-gray-light/60 flex items-center justify-between text-xs">
                          <button
                            onClick={() => handleOpenDetailCampus(c)}
                            className="font-bold text-primary text-[11px] uppercase tracking-wide hover:underline cursor-pointer flex items-center gap-1"
                            title="Klik untuk lihat rincian mahasiswa/user terdaftar"
                          >
                            <span>{c._count?.users || 0} Mahasiswa</span>
                          </button>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenDetailCampus(c)}
                              className="px-3 py-1.5 bg-[#007AAD]/10 hover:bg-[#007AAD]/20 text-[#007AAD] font-bold rounded-xl border border-[#007AAD]/20 transition cursor-pointer flex items-center gap-1 text-xs"
                              title="Lihat Rincian Akun Terdaftar di Kampus Ini"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Akun ({c._count?.users || 0})</span>
                            </button>

                            <button
                              onClick={() => handleOpenEditCampus(c)}
                              className="p-1.5 bg-base-light hover:bg-gray-light text-base-dark rounded-xl border border-gray-light transition cursor-pointer"
                              title="Edit Data Kampus"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCampus(c.id, c.nama_kampus)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl border border-rose-200 transition cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base-dark/50 backdrop-blur-sm">
          <div className="bg-base-white border border-gray-light rounded-3xl p-8 max-w-md w-full text-base-dark relative shadow-2xl">
            <button
              onClick={() => setIsCampusModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-gray hover:text-base-dark rounded-full hover:bg-base-light cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-black uppercase tracking-wider mb-1">Tambah Kampus Baru</h3>
            <p className="text-xs text-gray mb-6">Daftarkan perguruan tinggi mitra baru ke dalam sistem BaranginAja.</p>

            <form onSubmit={handleAddCampus} className="space-y-4 text-xs">
              <div>
                <label className="block text-base-dark font-bold mb-1.5 uppercase tracking-wide text-[10px]">Nama Kampus *</label>
                <input
                  type="text"
                  required
                  value={newCampusForm.nama_kampus}
                  onChange={(e) => setNewCampusForm({ ...newCampusForm, nama_kampus: e.target.value })}
                  placeholder="Contoh: UPN Veteran Jawa Timur"
                  className="w-full p-3 bg-[#F5F5F3] border border-gray-light rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-base-dark font-bold mb-1.5 uppercase tracking-wide text-[10px]">Kota Lokasi *</label>
                <input
                  type="text"
                  required
                  value={newCampusForm.kota}
                  onChange={(e) => setNewCampusForm({ ...newCampusForm, kota: e.target.value })}
                  placeholder="Surabaya"
                  className="w-full p-3 bg-[#F5F5F3] border border-gray-light rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                disabled={campusLoading}
                className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-full text-xs shadow-sm transition disabled:opacity-50 cursor-pointer"
              >
                {campusLoading ? 'Menyimpan...' : 'Simpan Kampus Baru'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Campus */}
      {isEditCampusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base-dark/50 backdrop-blur-sm">
          <div className="bg-base-white border border-gray-light rounded-3xl p-8 max-w-md w-full text-base-dark relative shadow-2xl">
            <button
              onClick={() => setIsEditCampusModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-gray hover:text-base-dark rounded-full hover:bg-base-light cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-black uppercase tracking-wider mb-1">Edit Data Kampus</h3>
            <p className="text-xs text-gray mb-6">Perbarui nama, kota, atau status aktif jaringan kampus.</p>

            <form onSubmit={handleEditCampusSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-base-dark font-bold mb-1.5 uppercase tracking-wide text-[10px]">Nama Kampus *</label>
                <input
                  type="text"
                  required
                  value={editCampusForm.nama_kampus}
                  onChange={(e) => setEditCampusForm({ ...editCampusForm, nama_kampus: e.target.value })}
                  className="w-full p-3 bg-[#F5F5F3] border border-gray-light rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-base-dark font-bold mb-1.5 uppercase tracking-wide text-[10px]">Kota Lokasi *</label>
                <input
                  type="text"
                  required
                  value={editCampusForm.kota}
                  onChange={(e) => setEditCampusForm({ ...editCampusForm, kota: e.target.value })}
                  className="w-full p-3 bg-[#F5F5F3] border border-gray-light rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-base-dark font-bold mb-1.5 uppercase tracking-wide text-[10px]">Status Keaktifan</label>
                <select
                  value={editCampusForm.aktif ? 'true' : 'false'}
                  onChange={(e) => setEditCampusForm({ ...editCampusForm, aktif: e.target.value === 'true' })}
                  className="w-full p-3 bg-[#F5F5F3] border border-gray-light rounded-xl font-bold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value="true">AKTIF (Dapat Digunakan Mahasiswa)</option>
                  <option value="false">NON-AKTIF (Diarsipkan)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={campusLoading}
                className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-full text-xs shadow-sm transition disabled:opacity-50 cursor-pointer"
              >
                {campusLoading ? 'Memperbarui...' : 'Simpan Perubahan Kampus'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Create User */}
      {isCreateUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base-dark/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-base-white border border-gray-light rounded-3xl p-6 sm:p-8 max-w-lg w-full text-base-dark relative shadow-2xl my-8">
            <button
              onClick={() => setIsCreateUserModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-gray hover:text-base-dark rounded-full hover:bg-base-light cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-black uppercase tracking-wider mb-1">Tambah Akun Pengguna Baru</h3>
            <p className="text-xs text-gray mb-6">Buat akun buyer, seller, atau admin secara manual dari SIM Control Panel.</p>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-base-dark font-bold mb-1.5 uppercase tracking-wide text-[10px]">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={createUserForm.nama_lengkap}
                  onChange={(e) => setCreateUserForm({ ...createUserForm, nama_lengkap: e.target.value })}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full p-3 bg-[#F5F5F3] border border-gray-light rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-base-dark font-bold mb-1.5 uppercase tracking-wide text-[10px]">Email *</label>
                  <input
                    type="email"
                    required
                    value={createUserForm.email}
                    onChange={(e) => setCreateUserForm({ ...createUserForm, email: e.target.value })}
                    placeholder="nama@email.com"
                    className="w-full p-3 bg-[#F5F5F3] border border-gray-light rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-base-dark font-bold mb-1.5 uppercase tracking-wide text-[10px]">Password *</label>
                  <input
                    type="password"
                    required
                    value={createUserForm.password}
                    onChange={(e) => setCreateUserForm({ ...createUserForm, password: e.target.value })}
                    placeholder="******"
                    className="w-full p-3 bg-[#F5F5F3] border border-gray-light rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-base-dark font-bold mb-1.5 uppercase tracking-wide text-[10px]">No. WhatsApp / HP</label>
                  <input
                    type="text"
                    value={createUserForm.no_hp}
                    onChange={(e) => setCreateUserForm({ ...createUserForm, no_hp: e.target.value })}
                    placeholder="081234567890"
                    className="w-full p-3 bg-[#F5F5F3] border border-gray-light rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-base-dark font-bold mb-1.5 uppercase tracking-wide text-[10px]">Kampus (Surabaya)</label>
                  <select
                    value={createUserForm.kampus_id}
                    onChange={(e) => setCreateUserForm({ ...createUserForm, kampus_id: e.target.value })}
                    className="w-full p-3 bg-[#F5F5F3] border border-gray-light rounded-xl font-bold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value="">Pilih Kampus</option>
                    {campuses.map((c) => (
                      <option key={c.id} value={c.id}>{c.nama_kampus}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-base-dark font-bold mb-1.5 uppercase tracking-wide text-[10px]">Alamat Kos Lengkap</label>
                <textarea
                  rows={2}
                  value={createUserForm.alamat_kos}
                  onChange={(e) => setCreateUserForm({ ...createUserForm, alamat_kos: e.target.value })}
                  placeholder="Contoh: Jl. Keputih Tegal Timur No. 12, Sukolilo, Surabaya"
                  className="w-full p-3 bg-[#F5F5F3] border border-gray-light rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-base-dark font-bold mb-1.5 uppercase tracking-wide text-[10px]">Role Akses</label>
                  <select
                    value={createUserForm.role}
                    onChange={(e) => setCreateUserForm({ ...createUserForm, role: e.target.value })}
                    className="w-full p-3 bg-[#F5F5F3] border border-gray-light rounded-xl font-bold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value="BUYER">BUYER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                <div>
                  <label className="block text-base-dark font-bold mb-1.5 uppercase tracking-wide text-[10px]">Status Verifikasi</label>
                  <select
                    value={createUserForm.status_verifikasi}
                    onChange={(e) => setCreateUserForm({ ...createUserForm, status_verifikasi: e.target.value })}
                    className="w-full p-3 bg-[#F5F5F3] border border-gray-light rounded-xl font-bold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value="VERIFIED">VERIFIED</option>
                    <option value="PENDING">PENDING</option>
                  </select>
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs">
                    <input
                      type="checkbox"
                      checked={createUserForm.is_seller}
                      onChange={(e) => setCreateUserForm({ ...createUserForm, is_seller: e.target.checked })}
                      className="w-4 h-4 rounded text-primary focus:ring-primary"
                    />
                    <span>Daftarkan Penjual</span>
                  </label>
                </div>
              </div>

              <div className="p-4 bg-[#F5F5F3] border border-gray-light rounded-2xl space-y-3">
                <p className="text-[10px] font-extrabold uppercase text-gray tracking-wider">Info Rekening Bank (Opsional)</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={createUserForm.nama_bank}
                    onChange={(e) => setCreateUserForm({ ...createUserForm, nama_bank: e.target.value })}
                    placeholder="Nama Bank (BCA/SeaBank)"
                    className="p-2.5 bg-white border border-gray-light rounded-lg font-medium focus:outline-none"
                  />
                  <input
                    type="text"
                    value={createUserForm.no_rekening}
                    onChange={(e) => setCreateUserForm({ ...createUserForm, no_rekening: e.target.value })}
                    placeholder="No. Rekening"
                    className="p-2.5 bg-white border border-gray-light rounded-lg font-medium focus:outline-none"
                  />
                  <input
                    type="text"
                    value={createUserForm.nama_pemilik_rekening}
                    onChange={(e) => setCreateUserForm({ ...createUserForm, nama_pemilik_rekening: e.target.value })}
                    placeholder="Nama Pemilik"
                    className="p-2.5 bg-white border border-gray-light rounded-lg font-medium focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={createUserLoading}
                className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-full text-xs shadow-sm transition disabled:opacity-50 cursor-pointer"
              >
                {createUserLoading ? 'Memproses...' : 'Buat Akun Baru'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit User */}
      {isEditUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base-dark/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-base-white border border-gray-light rounded-3xl p-6 sm:p-8 max-w-lg w-full text-base-dark relative shadow-2xl my-8">
            <button
              onClick={() => setIsEditUserModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-gray hover:text-base-dark rounded-full hover:bg-base-light cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-black uppercase tracking-wider mb-1">Edit Profil &amp; Hak Akses Akun</h3>
            <p className="text-xs text-gray mb-6">Perbarui data detail pengguna, role, atau reset password.</p>

            <form onSubmit={handleEditUserSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-base-dark font-bold mb-1.5 uppercase tracking-wide text-[10px]">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={editUserForm.nama_lengkap}
                  onChange={(e) => setEditUserForm({ ...editUserForm, nama_lengkap: e.target.value })}
                  className="w-full p-3 bg-[#F5F5F3] border border-gray-light rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-base-dark font-bold mb-1.5 uppercase tracking-wide text-[10px]">Email</label>
                  <input
                    type="email"
                    required
                    value={editUserForm.email}
                    onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                    className="w-full p-3 bg-[#F5F5F3] border border-gray-light rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-base-dark font-bold mb-1.5 uppercase tracking-wide text-[10px]">Password Baru (Opsional)</label>
                  <input
                    type="password"
                    value={editUserForm.password}
                    onChange={(e) => setEditUserForm({ ...editUserForm, password: e.target.value })}
                    placeholder="Kosongkan jika tak diubah"
                    className="w-full p-3 bg-[#F5F5F3] border border-gray-light rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-base-dark font-bold mb-1.5 uppercase tracking-wide text-[10px]">No. WhatsApp / HP</label>
                  <input
                    type="text"
                    value={editUserForm.no_hp}
                    onChange={(e) => setEditUserForm({ ...editUserForm, no_hp: e.target.value })}
                    className="w-full p-3 bg-[#F5F5F3] border border-gray-light rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-base-dark font-bold mb-1.5 uppercase tracking-wide text-[10px]">Kampus (Surabaya)</label>
                  <select
                    value={editUserForm.kampus_id}
                    onChange={(e) => setEditUserForm({ ...editUserForm, kampus_id: e.target.value })}
                    className="w-full p-3 bg-[#F5F5F3] border border-gray-light rounded-xl font-bold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value="">Pilih Kampus</option>
                    {campuses.map((c) => (
                      <option key={c.id} value={c.id}>{c.nama_kampus}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-base-dark font-bold mb-1.5 uppercase tracking-wide text-[10px]">Alamat Kos Lengkap</label>
                <textarea
                  rows={2}
                  value={editUserForm.alamat_kos}
                  onChange={(e) => setEditUserForm({ ...editUserForm, alamat_kos: e.target.value })}
                  className="w-full p-3 bg-[#F5F5F3] border border-gray-light rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-base-dark font-bold mb-1.5 uppercase tracking-wide text-[10px]">Role Akses</label>
                  <select
                    value={editUserForm.role}
                    onChange={(e) => setEditUserForm({ ...editUserForm, role: e.target.value })}
                    className="w-full p-3 bg-[#F5F5F3] border border-gray-light rounded-xl font-bold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value="BUYER">BUYER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                <div>
                  <label className="block text-base-dark font-bold mb-1.5 uppercase tracking-wide text-[10px]">Status Verifikasi</label>
                  <select
                    value={editUserForm.status_verifikasi}
                    onChange={(e) => setEditUserForm({ ...editUserForm, status_verifikasi: e.target.value })}
                    className="w-full p-3 bg-[#F5F5F3] border border-gray-light rounded-xl font-bold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value="VERIFIED">VERIFIED</option>
                    <option value="PENDING">PENDING</option>
                  </select>
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs">
                    <input
                      type="checkbox"
                      checked={editUserForm.is_seller}
                      onChange={(e) => setEditUserForm({ ...editUserForm, is_seller: e.target.checked })}
                      className="w-4 h-4 rounded text-primary focus:ring-primary"
                    />
                    <span>Daftarkan Penjual</span>
                  </label>
                </div>
              </div>

              <div className="p-4 bg-[#F5F5F3] border border-gray-light rounded-2xl space-y-3">
                <p className="text-[10px] font-extrabold uppercase text-gray tracking-wider">Info Rekening Bank</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={editUserForm.nama_bank}
                    onChange={(e) => setEditUserForm({ ...editUserForm, nama_bank: e.target.value })}
                    placeholder="Nama Bank"
                    className="p-2.5 bg-white border border-gray-light rounded-lg font-medium focus:outline-none"
                  />
                  <input
                    type="text"
                    value={editUserForm.no_rekening}
                    onChange={(e) => setEditUserForm({ ...editUserForm, no_rekening: e.target.value })}
                    placeholder="No. Rekening"
                    className="p-2.5 bg-white border border-gray-light rounded-lg font-medium focus:outline-none"
                  />
                  <input
                    type="text"
                    value={editUserForm.nama_pemilik_rekening}
                    onChange={(e) => setEditUserForm({ ...editUserForm, nama_pemilik_rekening: e.target.value })}
                    placeholder="Nama Pemilik"
                    className="p-2.5 bg-white border border-gray-light rounded-lg font-medium focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={editUserLoading}
                className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-full text-xs shadow-sm transition disabled:opacity-50 cursor-pointer"
              >
                {editUserLoading ? 'Memperbarui...' : 'Simpan Perubahan Akun'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail & Rincian Akun Database */}
      {isDetailUserModalOpen && viewingUser && (() => {
        const uProds = viewingUser.products && viewingUser.products.length > 0
          ? viewingUser.products
          : products.filter((p) => p.seller_id === viewingUser.id || p.seller?.email === viewingUser.email);
        const uSold = uProds.filter((p: any) => p.status === 'TERJUAL');
        const uOrders = orders.filter((o) => o.buyer_id === viewingUser.id || o.buyer?.email === viewingUser.email);
        const totalSoldNominal = uSold.reduce((acc: number, item: any) => acc + (item.harga_input || 0), 0);

        const initials = (viewingUser.nama_lengkap || 'US')
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase();

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-base-dark/60 backdrop-blur-md overflow-y-auto">
            <div className="bg-base-white border border-gray-light rounded-[32px] max-w-5xl w-full text-base-dark relative shadow-2xl my-auto max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              
              {/* Modal Top Bar */}
              <div className="px-8 py-5 border-b border-gray-light flex items-center justify-between bg-base-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-primary-light text-primary flex items-center justify-center font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-base-dark uppercase tracking-wider">
                      Rincian &amp; Informasi Database Akun
                    </h2>
                    <p className="text-[11px] text-gray font-medium">
                      Akses penuh informasi data user, produk seller, dan riwayat transaksi
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsDetailUserModalOpen(false)}
                  className="p-2 text-gray hover:text-base-dark rounded-full hover:bg-base-light transition cursor-pointer"
                  title="Tutup Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content Container */}
              <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                
                {/* User Profile Banner Header */}
                <div className="bg-gradient-to-r from-primary/5 via-[#F5F5F3] to-base-white p-6 rounded-3xl border border-primary/10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                  
                  <div className="flex items-center gap-4">
                    {/* User Initials Avatar */}
                    <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center text-xl font-black shadow-md shrink-0 border-2 border-white">
                      {initials}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xl font-black text-base-dark tracking-wide">{viewingUser.nama_lengkap}</h3>
                        
                        <span className="px-3 py-1 bg-primary text-white text-[10px] font-black rounded-full uppercase tracking-wider shadow-xs">
                          {viewingUser.role}
                        </span>

                        <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-wider border ${
                          viewingUser.status_verifikasi === 'VERIFIED'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border-amber-200'
                        }`}>
                          {viewingUser.status_verifikasi}
                        </span>

                        {viewingUser.is_seller && (
                          <span className="px-3 py-1 bg-[#007AAD]/10 text-[#007AAD] border border-[#007AAD]/20 font-black text-[10px] rounded-full uppercase tracking-wider">
                            SELLER TERDAFTAR
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 flex-wrap text-xs text-gray font-medium pt-0.5">
                        <span className="flex items-center gap-1.5 text-base-dark font-semibold">
                          <FileText className="w-3.5 h-3.5 text-primary" />
                          {viewingUser.email}
                        </span>

                        {viewingUser.no_hp && (
                          <a
                            href={`https://wa.me/${viewingUser.no_hp.replace(/^0/, '62')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-emerald-700 hover:underline font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200"
                          >
                            <PhoneCall className="w-3 h-3 text-emerald-600" />
                            <span>WA: {viewingUser.no_hp}</span>
                            <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                          </a>
                        )}

                        <span className="text-gray-dark">
                          Kampus: <strong className="text-base-dark">{viewingUser.kampus?.nama_kampus || 'Surabaya'}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Header Actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => {
                        setIsDetailUserModalOpen(false);
                        handleOpenEditUser(viewingUser);
                      }}
                      className="px-5 py-2.5 bg-primary text-white hover:bg-primary-dark text-xs font-bold rounded-2xl shadow-sm transition flex items-center gap-2 cursor-pointer"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit Data User</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsDetailUserModalOpen(false);
                        handleDeleteUser(viewingUser.id, viewingUser.nama_lengkap);
                      }}
                      className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold rounded-2xl transition flex items-center gap-1.5 cursor-pointer"
                      title="Hapus User"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Hapus</span>
                    </button>
                  </div>

                </div>

                {/* Navigation Sub-Tabs (Pill Buttons Style) */}
                <div className="flex items-center gap-2 border-b border-gray-light pb-4 overflow-x-auto custom-scrollbar text-xs font-bold">
                  <button
                    onClick={() => setUserDetailTab('profile')}
                    className={`px-4 py-2.5 rounded-2xl transition flex items-center gap-2 cursor-pointer ${
                      userDetailTab === 'profile'
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-[#F5F5F3] text-gray hover:text-base-dark hover:bg-base-light'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Informasi Database</span>
                  </button>

                  <button
                    onClick={() => setUserDetailTab('products')}
                    className={`px-4 py-2.5 rounded-2xl transition flex items-center gap-2 cursor-pointer ${
                      userDetailTab === 'products'
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-[#F5F5F3] text-gray hover:text-base-dark hover:bg-base-light'
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    <span>Produk Upload</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      userDetailTab === 'products' ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                    }`}>
                      {uProds.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setUserDetailTab('sold')}
                    className={`px-4 py-2.5 rounded-2xl transition flex items-center gap-2 cursor-pointer ${
                      userDetailTab === 'sold'
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-[#F5F5F3] text-gray hover:text-base-dark hover:bg-base-light'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Produk Terjual</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      userDetailTab === 'sold' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {uSold.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setUserDetailTab('orders')}
                    className={`px-4 py-2.5 rounded-2xl transition flex items-center gap-2 cursor-pointer ${
                      userDetailTab === 'orders'
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-[#F5F5F3] text-gray hover:text-base-dark hover:bg-base-light'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Riwayat Pembelian</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      userDetailTab === 'orders' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {uOrders.length}
                    </span>
                  </button>
                </div>

                {/* TAB 1: INFORMASI DATABASE LENGKAP */}
                {userDetailTab === 'profile' && (
                  <div className="space-y-6 text-xs">
                    
                    {/* Grid 3 Kolom Data Utama */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Box 1: Identitas & Akun */}
                      <div className="bg-[#F9F9F8] border border-gray-light rounded-3xl p-5 space-y-3 shadow-2xs">
                        <div className="flex items-center gap-2 text-primary font-black uppercase text-[11px] tracking-wider pb-2 border-b border-gray-light/60">
                          <UserCheck className="w-4 h-4" />
                          <span>Identitas &amp; Akun</span>
                        </div>
                        
                        <div>
                          <span className="text-[10px] font-bold text-gray uppercase tracking-widest block mb-0.5">User ID (UUID)</span>
                          <p className="font-mono text-base-dark font-bold text-[11px] bg-base-white px-2.5 py-1 rounded-lg border border-gray-light select-all truncate">
                            {viewingUser.id}
                          </p>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-gray uppercase tracking-widest block mb-0.5">NIM / No. KTP Identitas</span>
                          <p className="font-bold text-base-dark">{viewingUser.nim_ktp || '-'}</p>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-gray uppercase tracking-widest block mb-0.5">Tanggal Terdaftar</span>
                          <p className="font-bold text-base-dark">{formatDate(viewingUser.created_at)}</p>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-gray uppercase tracking-widest block mb-0.5">Akses Akun</span>
                          <p className="font-bold text-base-dark">{viewingUser.role} • {viewingUser.status_verifikasi}</p>
                        </div>
                      </div>

                      {/* Box 2: Alamat Kos & GPS Surabaya */}
                      <div className="bg-[#F9F9F8] border border-gray-light rounded-3xl p-5 space-y-3 shadow-2xs">
                        <div className="flex items-center gap-2 text-[#007AAD] font-black uppercase text-[11px] tracking-wider pb-2 border-b border-gray-light/60">
                          <Building2 className="w-4 h-4" />
                          <span>Kos &amp; Lokasi Kampus</span>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-gray uppercase tracking-widest block mb-0.5">Kampus Utama</span>
                          <p className="font-bold text-base-dark">{viewingUser.kampus?.nama_kampus || 'Surabaya'}</p>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-gray uppercase tracking-widest block mb-0.5">Alamat Kos Lengkap</span>
                          <p className="font-medium text-base-dark leading-relaxed">{viewingUser.alamat_kos || 'Belum diisi'}</p>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-gray uppercase tracking-widest block mb-0.5">Koordinat GPS Leaflet</span>
                          {viewingUser.lat ? (
                            <a
                              href={`https://maps.google.com/?q=${viewingUser.lat},${viewingUser.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono font-bold text-[#007AAD] hover:underline flex items-center gap-1"
                            >
                              <span>{viewingUser.lat.toFixed(5)}, {viewingUser.lng.toFixed(5)}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <p className="text-gray font-medium">Belum diset pada peta</p>
                          )}
                        </div>
                      </div>

                      {/* Box 3: Rekening Bank Seller (Untuk Payout) */}
                      <div className="bg-[#F9F9F8] border border-gray-light rounded-3xl p-5 space-y-3 shadow-2xs">
                        <div className="flex items-center gap-2 text-emerald-700 font-black uppercase text-[11px] tracking-wider pb-2 border-b border-gray-light/60">
                          <CreditCard className="w-4 h-4" />
                          <span>Pencairan Rekening (Payout)</span>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-gray uppercase tracking-widest block mb-0.5">Nama Bank</span>
                          <p className="font-extrabold text-base-dark">{viewingUser.nama_bank || '-'}</p>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-gray uppercase tracking-widest block mb-0.5">Nomor Rekening</span>
                          <p className="font-mono font-black text-emerald-800 text-sm">{viewingUser.no_rekening || '-'}</p>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-gray uppercase tracking-widest block mb-0.5">Atas Nama Pemilik</span>
                          <p className="font-bold text-base-dark">{viewingUser.nama_pemilik_rekening || '-'}</p>
                        </div>
                      </div>

                    </div>

                    {/* KPI Highlight Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div className="p-5 bg-base-light rounded-3xl border border-gray-light flex items-center justify-between shadow-2xs">
                        <div>
                          <span className="text-[10px] font-bold text-gray uppercase tracking-wider block">Total Upload Produk</span>
                          <p className="text-2xl font-black text-primary mt-1">{uProds.length} Barang</p>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-primary-light text-primary flex items-center justify-center font-bold">
                          <Package className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-200 flex items-center justify-between shadow-2xs">
                        <div>
                          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Total Barang Terjual</span>
                          <p className="text-2xl font-black text-emerald-700 mt-1">{uSold.length} Barang</p>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="p-5 bg-blue-50 rounded-3xl border border-blue-200 flex items-center justify-between shadow-2xs">
                        <div>
                          <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">Total Hasil Penjualan</span>
                          <p className="text-2xl font-black text-blue-700 mt-1">{formatRupiah(totalSoldNominal)}</p>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                          <DollarSign className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* TAB 2: PRODUK UPLOAD */}
                {userDetailTab === 'products' && (
                  <div className="space-y-4">
                    {uProds.length === 0 ? (
                      <div className="p-12 text-center bg-[#F9F9F8] border border-gray-light rounded-3xl text-gray space-y-2">
                        <Package className="w-10 h-10 mx-auto text-gray/40" />
                        <p className="text-sm font-bold text-base-dark">Belum ada barang diunggah</p>
                        <p className="text-xs">User ini belum mengunggah produk barang bekas ke catalog.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
                        {uProds.map((p: any) => (
                          <div
                            key={p.id}
                            className="p-4 bg-base-white border border-gray-light rounded-2xl flex items-center justify-between gap-4 hover:border-primary/40 transition shadow-2xs"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div className="w-16 h-16 rounded-2xl bg-gray-light/40 border border-gray-light overflow-hidden shrink-0">
                                <img
                                  src={
                                    p.foto_urls
                                      ? (typeof p.foto_urls === 'string' ? JSON.parse(p.foto_urls)[0] : p.foto_urls[0])
                                      : '/logo.png'
                                  }
                                  alt={p.nama_barang}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="font-extrabold text-sm text-base-dark truncate">{p.nama_barang}</p>
                                <p className="text-[11px] text-gray mt-0.5">
                                  Kategori: <strong className="text-base-dark">{p.kategori?.nama_kategori || 'Umum'}</strong> • Kondisi: {p.kondisi}
                                </p>
                                <p className="text-[10px] text-gray font-mono mt-0.5">
                                  Post: {formatDate(p.created_at)}
                                </p>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className={`px-2.5 py-0.5 text-[9px] font-black rounded-full border uppercase ${
                                p.status === 'TERJUAL'
                                  ? 'bg-rose-100 text-rose-800 border-rose-200'
                                  : p.status === 'DIPESAN'
                                  ? 'bg-amber-100 text-amber-800 border-amber-200'
                                  : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              }`}>
                                {p.status}
                              </span>
                              <p className="font-black text-primary text-base mt-1">{formatRupiah(p.harga_jual)}</p>
                              <p className="text-[10px] text-gray font-medium">Harga Seller: {formatRupiah(p.harga_input)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: PRODUK TERJUAL */}
                {userDetailTab === 'sold' && (
                  <div className="space-y-4">
                    <div className="p-5 bg-gradient-to-r from-emerald-50 via-emerald-50/50 to-base-white border border-emerald-200 rounded-3xl flex items-center justify-between shadow-2xs">
                      <div>
                        <p className="font-black text-sm text-emerald-900">Total Nominal Penjualan Seller Selesai</p>
                        <p className="text-xs text-emerald-700 mt-0.5">Estimasi nominal murni yang siap/telah dicairkan ke rekening seller</p>
                      </div>
                      <span className="text-2xl font-black text-emerald-700">{formatRupiah(totalSoldNominal)}</span>
                    </div>

                    {uSold.length === 0 ? (
                      <div className="p-12 text-center bg-[#F9F9F8] border border-gray-light rounded-3xl text-gray space-y-2">
                        <CheckCircle2 className="w-10 h-10 mx-auto text-gray/40" />
                        <p className="text-sm font-bold text-base-dark">Belum ada produk terjual</p>
                        <p className="text-xs">Belum ada barang milik seller ini yang berstatus TERJUAL.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
                        {uSold.map((p: any) => (
                          <div
                            key={p.id}
                            className="p-4 bg-base-white border border-gray-light rounded-2xl flex items-center justify-between gap-4 shadow-2xs"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div className="w-16 h-16 rounded-2xl bg-gray-light/40 border border-gray-light overflow-hidden shrink-0">
                                <img
                                  src={
                                    p.foto_urls
                                      ? (typeof p.foto_urls === 'string' ? JSON.parse(p.foto_urls)[0] : p.foto_urls[0])
                                      : '/logo.png'
                                  }
                                  alt={p.nama_barang}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="font-extrabold text-sm text-base-dark truncate">{p.nama_barang}</p>
                                <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[9px] font-black rounded-md uppercase inline-block mt-1">
                                  TERJUAL
                                </span>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <p className="text-[10px] text-gray uppercase font-bold">Hasil Seller</p>
                              <p className="font-black text-emerald-700 text-base">{formatRupiah(p.harga_input)}</p>
                              <p className="text-[10px] text-gray">Katalog: {formatRupiah(p.harga_jual)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 4: RIWAYAT PEMBELIAN */}
                {userDetailTab === 'orders' && (
                  <div className="space-y-4">
                    {uOrders.length === 0 ? (
                      <div className="p-12 text-center bg-[#F9F9F8] border border-gray-light rounded-3xl text-gray space-y-2">
                        <ShoppingBag className="w-10 h-10 mx-auto text-gray/40" />
                        <p className="text-sm font-bold text-base-dark">Belum ada transaksi pembelian</p>
                        <p className="text-xs">User ini belum pernah melakukan pemesanan barang sebagai buyer.</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
                        {uOrders.map((o: any) => (
                          <div
                            key={o.id}
                            className="p-4 bg-base-white border border-gray-light rounded-2xl flex items-center justify-between gap-4 shadow-2xs hover:border-primary/40 transition"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-xs text-base-dark">#{o.id.substring(0, 8)}</span>
                                <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase">
                                  {o.status}
                                </span>
                              </div>
                              <p className="font-bold text-sm text-base-dark">{o.product?.nama_barang || 'Produk'}</p>
                              <p className="text-[11px] text-gray font-mono">Waktu Transaksi: {formatDate(o.created_at)}</p>
                            </div>

                            <div className="text-right shrink-0">
                              <p className="text-[10px] text-gray uppercase font-bold">Total Dibayar</p>
                              <p className="font-black text-primary text-base">{formatRupiah(o.total_harga)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Modal Footer Bar */}
              <div className="px-8 py-4 bg-[#F9F9F8] border-t border-gray-light flex items-center justify-between shrink-0 text-xs">
                <span className="text-gray font-medium">
                  ID Database: <strong className="font-mono text-base-dark select-all">{viewingUser.id}</strong>
                </span>

                <button
                  onClick={() => setIsDetailUserModalOpen(false)}
                  className="px-6 py-2.5 bg-base-dark hover:bg-black text-white font-bold rounded-2xl transition cursor-pointer"
                >
                  Tutup Rincian
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* Modal Detail Akun Terdaftar di Kampus */}
      {isCampusDetailModalOpen && viewingCampus && (() => {
        const campusUsers = users.filter(
          (u) => u.kampus_id === viewingCampus.id || u.kampus?.id === viewingCampus.id || u.kampus?.nama_kampus === viewingCampus.nama_kampus
        );
        const filteredCampusUsers = campusUsers.filter((u) => {
          const q = campusUserSearchQuery.toLowerCase().trim();
          return (
            !q ||
            u.nama_lengkap?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q) ||
            u.no_hp?.toLowerCase().includes(q) ||
            u.role?.toLowerCase().includes(q)
          );
        });

        const sellerCount = campusUsers.filter((u) => u.is_seller).length;
        const buyerCount = campusUsers.filter((u) => u.role === 'BUYER').length;
        const adminCount = campusUsers.filter((u) => u.role === 'ADMIN').length;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-base-dark/60 backdrop-blur-md overflow-y-auto">
            <div className="bg-base-white border border-gray-light rounded-[32px] max-w-4xl w-full text-base-dark relative shadow-2xl my-auto max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              
              {/* Header Banner Modal */}
              <div className="p-6 sm:p-8 bg-gradient-to-r from-primary/5 via-[#F5F5F3] to-base-white border-b border-gray-light flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-bold shadow-md shrink-0">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-black text-base-dark tracking-wide">{viewingCampus.nama_kampus}</h2>
                      <span className={`px-2.5 py-0.5 text-[9px] font-black rounded-full uppercase border ${
                        viewingCampus.aktif !== false
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-rose-100 text-rose-800 border-rose-200'
                      }`}>
                        {viewingCampus.aktif !== false ? 'AKTIF' : 'NON-AKTIF'}
                      </span>
                    </div>
                    <p className="text-xs text-gray font-medium mt-0.5">
                      Kota: <strong className="text-base-dark">{viewingCampus.kota || 'Surabaya'}</strong> • ID: <span className="font-mono">{viewingCampus.id.substring(0, 8)}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsCampusDetailModalOpen(false)}
                  className="p-2 text-gray hover:text-base-dark rounded-full hover:bg-base-light transition cursor-pointer self-start sm:self-auto"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sub-Header Stats & Search Bar */}
              <div className="p-6 border-b border-gray-light bg-base-white space-y-4 shrink-0">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <div className="px-3.5 py-1.5 bg-primary/10 text-primary font-black rounded-2xl border border-primary/20">
                      Total {campusUsers.length} Akun Terdaftar
                    </div>
                    <div className="px-3 py-1.5 bg-[#007AAD]/10 text-[#007AAD] font-black rounded-2xl border border-[#007AAD]/20">
                      {sellerCount} Penjual (Seller)
                    </div>
                    <div className="px-3 py-1.5 bg-blue-50 text-blue-700 font-black rounded-2xl border border-blue-200">
                      {buyerCount} Pembeli (Buyer)
                    </div>
                    {adminCount > 0 && (
                      <div className="px-3 py-1.5 bg-purple-50 text-purple-700 font-black rounded-2xl border border-purple-200">
                        {adminCount} Admin
                      </div>
                    )}
                  </div>

                  {/* Search input for campus users */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray" />
                    <input
                      type="text"
                      value={campusUserSearchQuery}
                      onChange={(e) => setCampusUserSearchQuery(e.target.value)}
                      placeholder="Cari nama / email / WA..."
                      className="w-full bg-[#F5F5F3] border border-gray-light rounded-full pl-9 pr-4 py-2 text-xs text-base-dark placeholder-gray focus:outline-none focus:ring-1 focus:ring-primary transition"
                    />
                  </div>
                </div>
              </div>

              {/* Users List Container */}
              <div className="p-6 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                {filteredCampusUsers.length === 0 ? (
                  <div className="p-12 text-center text-gray space-y-2">
                    <Users className="w-10 h-10 mx-auto text-gray/40" />
                    <p className="text-sm font-bold text-base-dark">Tidak Ada Akun Ditemukan</p>
                    <p className="text-xs">
                      {campusUserSearchQuery
                        ? 'Tidak ada mahasiswa yang cocok dengan pencarian.'
                        : 'Belum ada akun user yang terhubung dengan kampus ini.'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-gray-light rounded-2xl">
                    <table className="w-full text-left text-xs text-base-dark">
                      <thead className="bg-[#F5F5F3] border-b border-gray-light text-gray uppercase text-[10px] font-bold">
                        <tr>
                          <th className="p-3.5">Nama &amp; Kontak User</th>
                          <th className="p-3.5">Role &amp; Status</th>
                          <th className="p-3.5">Alamat Kos</th>
                          <th className="p-3.5 text-center">Aksi Rincian</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-light/60">
                        {filteredCampusUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-base-light/50 transition">
                            <td className="p-3.5">
                              <p className="font-extrabold text-base-dark">{u.nama_lengkap}</p>
                              <p className="text-[11px] text-gray">{u.email}</p>
                              {u.no_hp && (
                                <a
                                  href={`https://wa.me/${u.no_hp.replace(/^0/, '62')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-emerald-700 font-bold hover:underline inline-flex items-center gap-1 mt-0.5"
                                >
                                  <PhoneCall className="w-3 h-3 text-emerald-600" />
                                  <span>WA: {u.no_hp}</span>
                                </a>
                              )}
                            </td>
                            <td className="p-3.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="px-2.5 py-0.5 bg-primary text-white text-[9px] font-black rounded-md uppercase">
                                  {u.role}
                                </span>
                                <span className={`px-2 py-0.5 text-[9px] font-black rounded-md uppercase ${
                                  u.status_verifikasi === 'VERIFIED'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {u.status_verifikasi}
                                </span>
                                {u.is_seller && (
                                  <span className="px-2 py-0.5 bg-[#007AAD]/10 text-[#007AAD] font-black text-[9px] rounded-md uppercase">
                                    PENJUAL
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-3.5">
                              <p className="text-[11px] text-base-dark line-clamp-1 max-w-[220px]" title={u.alamat_kos || ''}>
                                {u.alamat_kos || '-'}
                              </p>
                            </td>
                            <td className="p-3.5 text-center">
                              <button
                                onClick={() => {
                                  setIsCampusDetailModalOpen(false);
                                  handleOpenDetailUser(u);
                                }}
                                className="px-3 py-1.5 bg-[#007AAD]/10 hover:bg-[#007AAD]/20 text-[#007AAD] font-bold rounded-xl border border-[#007AAD]/20 transition flex items-center gap-1.5 mx-auto cursor-pointer"
                                title="Lihat Rincian Akun & Produk Seller"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Lihat Akun</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-4 bg-[#F9F9F8] border-t border-gray-light flex items-center justify-between shrink-0 text-xs">
                <span className="text-gray font-medium">
                  Menampilkan <strong className="text-base-dark">{filteredCampusUsers.length}</strong> dari {campusUsers.length} akun terdaftar di {viewingCampus.nama_kampus}
                </span>

                <button
                  onClick={() => setIsCampusDetailModalOpen(false)}
                  className="px-6 py-2.5 bg-base-dark hover:bg-black text-white font-bold rounded-2xl transition cursor-pointer"
                >
                  Tutup
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}
