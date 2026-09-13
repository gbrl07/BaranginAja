'use client';

/**
 * @file AdminSIMDashboard.tsx
 * @description Komponen Orchestrator Utama Sistem Informasi Manajemen (SIM) Admin BaranginAja.
 * Menggabungkan navigasi sidebar, header control bar, tampilan tab aktif, serta modal interaktif.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useAdminSIM } from './hooks/useAdminSIM';
import { AdminSIMDashboardProps } from './types/admin';

// Sub-Komponen UI Dashboard
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import OverviewTab from './components/tabs/OverviewTab';
import OrdersTab from './components/tabs/OrdersTab';
import PayoutsTab from './components/tabs/PayoutsTab';
import ProductsTab from './components/tabs/ProductsTab';
import UsersTab from './components/tabs/UsersTab';
import CampusesTab from './components/tabs/CampusesTab';
import AuditTab from './components/tabs/AuditTab';

// Sub-Komponen Modal Interaktif
import UserModals from './components/modals/UserModals';
import CampusModals from './components/modals/CampusModals';
import QuickSearchModal from './components/modals/QuickSearchModal';

export default function AdminSIMDashboard(props: AdminSIMDashboardProps) {
  const sim = useAdminSIM(props);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col lg:flex-row font-sans selection:bg-[#0062FF] selection:text-white">
      {/* Sidebar Navigasi Utama SIM */}
      <AdminSidebar
        activeTab={sim.activeTab}
        setActiveTab={sim.setActiveTab}
        stats={sim.stats}
        pendingPayoutCount={sim.pendingPayoutCount}
        usersCount={sim.users.length}
        campusesCount={sim.campuses.length}
        user={sim.user}
        logout={sim.logout}
        isAdminUserMenuOpen={sim.isAdminUserMenuOpen}
        setIsAdminUserMenuOpen={sim.setIsAdminUserMenuOpen}
      />

      {/* Workspace Main Panel */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] lg:ml-72 min-h-screen">
        {/* Top Control Header */}
        <AdminHeader
          activeTab={sim.activeTab}
          searchQuery={sim.searchQuery}
          setIsSearchModalOpen={sim.setIsSearchModalOpen}
          currentTime={sim.currentTime}
          refreshAllData={sim.refreshAllData}
          loading={sim.loading}
        />

        {/* Dynamic Tab Content Workspace */}
        <div className="p-8 space-y-8 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={sim.activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              {sim.activeTab === 'overview' && (
                <OverviewTab
                  overallPlatformProfit={sim.overallPlatformProfit}
                  overallMarkupProfit={sim.overallMarkupProfit}
                  overallOngkirProfit={sim.overallOngkirProfit}
                  stats={sim.stats}
                  pendingPayoutCount={sim.pendingPayoutCount}
                  pendingPayoutNominal={sim.pendingPayoutNominal}
                  totalSellerCount={sim.totalSellerCount}
                  users={sim.users}
                  orders={sim.orders}
                  selectedMonth={sim.selectedMonth}
                  setSelectedMonth={sim.setSelectedMonth}
                  selectedYear={sim.selectedYear}
                  setSelectedYear={sim.setSelectedYear}
                  monthTotalProfit={sim.monthTotalProfit}
                  monthTotalMarkup={sim.monthTotalMarkup}
                  monthTotalOngkir={sim.monthTotalOngkir}
                  dailyChartData={sim.dailyChartData}
                  maxDailyProfit={sim.maxDailyProfit}
                  monthPaidOrders={sim.monthPaidOrders}
                  setActiveTab={sim.setActiveTab}
                />
              )}

              {sim.activeTab === 'orders' && (
                <OrdersTab
                  orderStatusFilter={sim.orderStatusFilter}
                  setOrderStatusFilter={sim.setOrderStatusFilter}
                  filteredOrders={sim.filteredOrders}
                  savingOrderId={sim.savingOrderId}
                  handleUpdateOrderStatus={sim.handleUpdateOrderStatus}
                />
              )}

              {sim.activeTab === 'payouts' && (
                <PayoutsTab
                  payouts={sim.payouts}
                  handleDisbursePayout={sim.handleDisbursePayout}
                />
              )}

              {sim.activeTab === 'products' && (
                <ProductsTab products={sim.products} />
              )}

              {sim.activeTab === 'users' && (
                <UsersTab
                  users={sim.users}
                  filteredUsers={sim.filteredUsers}
                  userSearchQuery={sim.userSearchQuery}
                  setUserSearchQuery={sim.setUserSearchQuery}
                  userRoleFilter={sim.userRoleFilter}
                  setUserRoleFilter={sim.setUserRoleFilter}
                  userStatusFilter={sim.userStatusFilter}
                  setUserStatusFilter={sim.setUserStatusFilter}
                  setIsCreateUserModalOpen={sim.setIsCreateUserModalOpen}
                  handleOpenDetailUser={sim.handleOpenDetailUser}
                  handleOpenEditUser={sim.handleOpenEditUser}
                  handleDeleteUser={sim.handleDeleteUser}
                  handleChangeUserRole={sim.handleChangeUserRole}
                  handleVerifySeller={sim.handleVerifySeller}
                  currentAdminId={sim.user?.id}
                />
              )}

              {sim.activeTab === 'campuses' && (
                <CampusesTab
                  campuses={sim.campuses}
                  setNewCampusForm={sim.setNewCampusForm}
                  setIsCampusModalOpen={sim.setIsCampusModalOpen}
                  handleOpenDetailCampus={sim.handleOpenDetailCampus}
                  handleToggleCampusStatus={sim.handleToggleCampusStatus}
                  handleOpenEditCampus={sim.handleOpenEditCampus}
                  handleDeleteCampus={sim.handleDeleteCampus}
                />
              )}

              {sim.activeTab === 'audit' && (
                <AuditTab activities={sim.activities} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Modal Interaktif Pengguna */}
      <UserModals
        isCreateUserModalOpen={sim.isCreateUserModalOpen}
        setIsCreateUserModalOpen={sim.setIsCreateUserModalOpen}
        createUserForm={sim.createUserForm}
        setCreateUserForm={sim.setCreateUserForm}
        handleCreateUser={sim.handleCreateUser}
        createUserLoading={sim.createUserLoading}
        isEditUserModalOpen={sim.isEditUserModalOpen}
        setIsEditUserModalOpen={sim.setIsEditUserModalOpen}
        editUserForm={sim.editUserForm}
        setEditUserForm={sim.setEditUserForm}
        handleEditUserSubmit={sim.handleEditUserSubmit}
        editUserLoading={sim.editUserLoading}
        isDetailUserModalOpen={sim.isDetailUserModalOpen}
        setIsDetailUserModalOpen={sim.setIsDetailUserModalOpen}
        viewingUser={sim.viewingUser}
        userDetailTab={sim.userDetailTab}
        setUserDetailTab={sim.setUserDetailTab}
        campuses={sim.campuses}
        products={sim.products}
        orders={sim.orders}
        handleOpenEditUser={sim.handleOpenEditUser}
        handleDeleteUser={sim.handleDeleteUser}
      />

      {/* Modal Interaktif Kampus */}
      <CampusModals
        isCampusModalOpen={sim.isCampusModalOpen}
        setIsCampusModalOpen={sim.setIsCampusModalOpen}
        newCampusForm={sim.newCampusForm}
        setNewCampusForm={sim.setNewCampusForm}
        handleAddCampus={sim.handleAddCampus}
        campusLoading={sim.campusLoading}
        isEditCampusModalOpen={sim.isEditCampusModalOpen}
        setIsEditCampusModalOpen={sim.setIsEditCampusModalOpen}
        editCampusForm={sim.editCampusForm}
        setEditCampusForm={sim.setEditCampusForm}
        handleEditCampusSubmit={sim.handleEditCampusSubmit}
        isCampusDetailModalOpen={sim.isCampusDetailModalOpen}
        setIsCampusDetailModalOpen={sim.setIsCampusDetailModalOpen}
        viewingCampus={sim.viewingCampus}
        campusUserSearchQuery={sim.campusUserSearchQuery}
        setCampusUserSearchQuery={sim.setCampusUserSearchQuery}
        users={sim.users}
        handleOpenDetailUser={sim.handleOpenDetailUser}
      />

      {/* Modal Pencarian Cepat */}
      <QuickSearchModal
        isSearchModalOpen={sim.isSearchModalOpen}
        setIsSearchModalOpen={sim.setIsSearchModalOpen}
        searchQuery={sim.searchQuery}
        setSearchQuery={sim.setSearchQuery}
      />
    </div>
  );
}
