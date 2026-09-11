import { create } from 'zustand';

export interface UserSession {
  id: string;
  nama_lengkap: string;
  email: string;
  role: string;
  is_seller: boolean;
  no_hp?: string;
  alamat_kos?: string;
  lat?: number;
  lng?: number;
  nama_bank?: string;
  no_rekening?: string;
  nama_pemilik_rekening?: string;
}

interface AuthState {
  user: UserSession | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  isSellerModalOpen: boolean;
  isSellModalOpen: boolean;
  setUser: (user: UserSession | null) => void;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  openSellerModal: () => void;
  closeSellerModal: () => void;
  openSellModal: () => void;
  closeSellModal: () => void;
  handleStartSelling: (router?: any) => void;
  fetchCurrentUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthModalOpen: false,
  authModalMode: 'login',
  isSellerModalOpen: false,
  isSellModalOpen: false,

  setUser: (user) => set({ user }),

  openAuthModal: (mode = 'login') =>
    set({ isAuthModalOpen: true, authModalMode: mode }),

  closeAuthModal: () => set({ isAuthModalOpen: false }),

  openSellerModal: () => set({ isSellerModalOpen: true }),
  closeSellerModal: () => set({ isSellerModalOpen: false }),

  openSellModal: () => set({ isSellModalOpen: true }),
  closeSellModal: () => set({ isSellModalOpen: false }),

  handleStartSelling: (router) => {
    const { user, openAuthModal } = get();
    if (!user) {
      openAuthModal('login');
      return;
    }
    if (user.is_seller) {
      set({ isSellModalOpen: true });
    } else {
      set({ isSellerModalOpen: true });
    }
  },

  fetchCurrentUser: async () => {
    try {
      set({ isLoading: true });
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      set({ user: data.user || null, isLoading: false });
    } catch (error) {
      set({ user: null, isLoading: false });
    }
  },

  logout: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      set({ user: null });
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  },
}));
