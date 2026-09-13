/**
 * @file useAdminSIM.ts
 * @description Custom Hook yang mengelola seluruh state, perhitungan kalkulasi keuangan/profit,
 * serta handler API untuk Sistem Informasi Manajemen (SIM) Admin.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import {
  AdminSIMDashboardProps,
  TabType,
  UserSim,
  KampusSim,
  OrderSim,
  ProductSim,
  PayoutSim,
  ActivitySim,
} from '../types/admin';
import {
  INITIAL_CREATE_USER_FORM,
  INITIAL_EDIT_USER_FORM,
  INITIAL_NEW_CAMPUS_FORM,
  INITIAL_EDIT_CAMPUS_FORM,
} from '../constants/adminMockData';

export function useAdminSIM(props: AdminSIMDashboardProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Bottom profile admin menu dropdown
  const [isAdminUserMenuOpen, setIsAdminUserMenuOpen] = useState(false);

  // Month & Year Filter for Profit Chart
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());

  // Real-time Data States
  const [stats, setStats] = useState(props.initialStats);
  const [orders, setOrders] = useState<OrderSim[]>(props.initialOrders);
  const [products, setProducts] = useState<ProductSim[]>(props.initialProducts);
  const [users, setUsers] = useState<UserSim[]>(props.initialUsers);
  const [payouts, setPayouts] = useState<PayoutSim[]>(props.initialPayouts);
  const [campuses, setCampuses] = useState<KampusSim[]>(props.initialCampuses);
  const [activities, setActivities] = useState<ActivitySim[]>(props.initialActivities);

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Keyboard shortcut Ctrl+K / Cmd+K for Quick Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Order status editing state mapping
  const [savingOrderId, setSavingOrderId] = useState<string | null>(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');

  // Campus Form State
  const [isCampusModalOpen, setIsCampusModalOpen] = useState(false);
  const [newCampusForm, setNewCampusForm] = useState(INITIAL_NEW_CAMPUS_FORM);
  const [isEditCampusModalOpen, setIsEditCampusModalOpen] = useState(false);
  const [editCampusForm, setEditCampusForm] = useState(INITIAL_EDIT_CAMPUS_FORM);
  const [campusLoading, setCampusLoading] = useState(false);

  // Campus detail user list modal state
  const [isCampusDetailModalOpen, setIsCampusDetailModalOpen] = useState(false);
  const [viewingCampus, setViewingCampus] = useState<KampusSim | null>(null);
  const [campusUserSearchQuery, setCampusUserSearchQuery] = useState('');

  const handleOpenDetailCampus = (c: KampusSim) => {
    setViewingCampus(c);
    setCampusUserSearchQuery('');
    setIsCampusDetailModalOpen(true);
  };

  // User Management State
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'ALL' | 'BUYER' | 'SELLER' | 'ADMIN'>('ALL');
  const [userStatusFilter, setUserStatusFilter] = useState<'ALL' | 'VERIFIED' | 'PENDING'>('ALL');

  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [createUserForm, setCreateUserForm] = useState(INITIAL_CREATE_USER_FORM);
  const [createUserLoading, setCreateUserLoading] = useState(false);

  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [editUserForm, setEditUserForm] = useState(INITIAL_EDIT_USER_FORM);
  const [editUserLoading, setEditUserLoading] = useState(false);

  // User detail view modal state
  const [isDetailUserModalOpen, setIsDetailUserModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<UserSim | null>(null);
  const [userDetailTab, setUserDetailTab] = useState<'profile' | 'products' | 'sold' | 'orders'>('profile');

  const handleOpenDetailUser = (u: UserSim) => {
    setViewingUser(u);
    setUserDetailTab('profile');
    setIsDetailUserModalOpen(true);
  };

  // Clock Effect Updates
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

  // Fetch updated data from API endpoints
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
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o))
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
        body: JSON.stringify(createUserForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal membuat akun baru');
      setIsCreateUserModalOpen(false);
      setCreateUserForm(INITIAL_CREATE_USER_FORM);
      refreshAllData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCreateUserLoading(false);
    }
  };

  const handleOpenEditUser = (u: UserSim) => {
    setEditUserForm({
      userId: u.id,
      nama_lengkap: u.nama_lengkap || '',
      email: u.email || '',
      password: '',
      no_hp: u.no_hp || '',
      alamat_kos: u.alamat_kos || '',
      kampus_id: u.kampus_id || u.kampus?.id || '',
      role: (u.role || 'BUYER') as any,
      status_verifikasi: (u.status_verifikasi || 'VERIFIED') as any,
      is_seller: !!u.is_seller,
      nama_bank: u.nama_bank || '',
      no_rekening: u.norek_bank || '',
      nama_pemilik_rekening: u.nama_lengkap || '',
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
        body: JSON.stringify(editUserForm),
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
        method: 'DELETE',
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
        body: JSON.stringify({ userId, role: newRole }),
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
          kota: newCampusForm.kota.trim() || 'Surabaya',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menambah kampus');

      setNewCampusForm(INITIAL_NEW_CAMPUS_FORM);
      setIsCampusModalOpen(false);
      refreshAllData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCampusLoading(false);
    }
  };

  const handleOpenEditCampus = (c: KampusSim) => {
    setEditCampusForm({
      id: c.id,
      nama_kampus: c.nama_kampus || '',
      kota: c.kota || 'Surabaya',
      aktif: typeof c.aktif === 'boolean' ? c.aktif : true,
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
          aktif: editCampusForm.aktif,
        }),
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

  const handleToggleCampusStatus = async (c: KampusSim) => {
    try {
      const res = await fetch('/api/admin/campuses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campusId: c.id,
          aktif: !(typeof c.aktif === 'boolean' ? c.aktif : true),
        }),
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
        method: 'DELETE',
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
  const pendingPayoutCount = payouts.filter((p: any) => p.status === 'MENUNGGU_PENCAIRAN' || p.status === 'PENDING').length;
  const pendingPayoutNominal = payouts
    .filter((p: any) => p.status === 'MENUNGGU_PENCAIRAN' || p.status === 'PENDING')
    .reduce((acc, curr: any) => acc + (curr.nominal || curr.jumlah || 0), 0);

  const totalSellerCount = users.filter((u) => u.is_seller).length;

  // Platform Profit Calculations
  const paidOrders = orders.filter((o: any) => ['DIBAYAR', 'SELESAI', 'PAID', 'COMPLETED'].includes(o.status));
  
  const overallMarkupProfit = paidOrders.reduce((sum, o: any) => {
    const hj = o.product?.harga_jual || 0;
    const hi = o.product?.harga_input || 0;
    return sum + Math.max(0, hj - hi);
  }, 0);

  const overallOngkirProfit = paidOrders.reduce((sum, o: any) => {
    return sum + (o.opsi_pengiriman === 'KURIR' ? (o.ongkir || 0) : 0);
  }, 0);

  const overallPlatformProfit = overallMarkupProfit + overallOngkirProfit;

  // Monthly Profit Trend Calculations
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

  const dailyChartData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dayOrders = paidOrders.filter((o: any) => {
      const d = new Date(o.created_at);
      return d.getDate() === day && d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    });

    const markupProfit = dayOrders.reduce((sum, o: any) => {
      const hj = o.product?.harga_jual || 0;
      const hi = o.product?.harga_input || 0;
      return sum + Math.max(0, hj - hi);
    }, 0);

    const ongkirProfit = dayOrders.reduce((sum, o: any) => {
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

  const monthPaidOrders = paidOrders.filter((o: any) => {
    const d = new Date(o.created_at);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  return {
    user,
    logout,
    activeTab,
    setActiveTab,
    isAdminUserMenuOpen,
    setIsAdminUserMenuOpen,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    stats,
    orders,
    products,
    users,
    payouts,
    campuses,
    activities,
    loading,
    searchQuery,
    setSearchQuery,
    isSearchModalOpen,
    setIsSearchModalOpen,
    currentTime,
    savingOrderId,
    orderStatusFilter,
    setOrderStatusFilter,
    isCampusModalOpen,
    setIsCampusModalOpen,
    newCampusForm,
    setNewCampusForm,
    isEditCampusModalOpen,
    setIsEditCampusModalOpen,
    editCampusForm,
    setEditCampusForm,
    campusLoading,
    isCampusDetailModalOpen,
    setIsCampusDetailModalOpen,
    viewingCampus,
    campusUserSearchQuery,
    setCampusUserSearchQuery,
    handleOpenDetailCampus,
    userSearchQuery,
    setUserSearchQuery,
    userRoleFilter,
    setUserRoleFilter,
    userStatusFilter,
    setUserStatusFilter,
    isCreateUserModalOpen,
    setIsCreateUserModalOpen,
    createUserForm,
    setCreateUserForm,
    createUserLoading,
    isEditUserModalOpen,
    setIsEditUserModalOpen,
    editUserForm,
    setEditUserForm,
    editUserLoading,
    isDetailUserModalOpen,
    setIsDetailUserModalOpen,
    viewingUser,
    userDetailTab,
    setUserDetailTab,
    handleOpenDetailUser,
    refreshAllData,
    handleUpdateOrderStatus,
    handleDisbursePayout,
    handleVerifySeller,
    handleCreateUser,
    handleOpenEditUser,
    handleEditUserSubmit,
    handleDeleteUser,
    handleChangeUserRole,
    filteredUsers,
    handleAddCampus,
    handleOpenEditCampus,
    handleEditCampusSubmit,
    handleToggleCampusStatus,
    handleDeleteCampus,
    filteredOrders,
    pendingPayoutCount,
    pendingPayoutNominal,
    totalSellerCount,
    overallPlatformProfit,
    overallMarkupProfit,
    overallOngkirProfit,
    dailyChartData,
    monthTotalProfit,
    monthTotalMarkup,
    monthTotalOngkir,
    maxDailyProfit,
    monthPaidOrders,
  };
}
