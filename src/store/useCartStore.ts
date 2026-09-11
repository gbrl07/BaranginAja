import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  images: string;
  stock: number;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
  selectedVariant?: string;
}

interface AppliedVoucher {
  code: string;
  discountType: string;
  discountValue: number;
  discountAmount: number;
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  wishlist: string[];
  appliedVoucher: AppliedVoucher | null;
  
  // Actions
  addItem: (product: CartProduct, quantity?: number, selectedVariant?: string) => void;
  removeItem: (productId: string, selectedVariant?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedVariant?: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  applyVoucher: (voucher: AppliedVoucher) => void;
  removeVoucher: () => void;
  
  // Computed helpers
  getSubtotal: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      wishlist: [],
      appliedVoucher: null,

      addItem: (product, quantity = 1, selectedVariant) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              item.selectedVariant === selectedVariant
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const newQty = Math.min(
              product.stock,
              updatedItems[existingIndex].quantity + quantity
            );
            updatedItems[existingIndex].quantity = newQty;
            return { items: updatedItems, isCartOpen: true };
          } else {
            return {
              items: [
                ...state.items,
                { product, quantity: Math.min(product.stock, quantity), selectedVariant },
              ],
              isCartOpen: true,
            };
          }
        });
      },

      removeItem: (productId, selectedVariant) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.product.id === productId && item.selectedVariant === selectedVariant)
          ),
        }));
      },

      updateQuantity: (productId, quantity, selectedVariant) => {
        if (quantity <= 0) {
          get().removeItem(productId, selectedVariant);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.product.id === productId && item.selectedVariant === selectedVariant) {
              return { ...item, quantity: Math.min(item.product.stock, quantity) };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ items: [], appliedVoucher: null }),
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      toggleWishlist: (productId) => {
        set((state) => {
          const exists = state.wishlist.includes(productId);
          if (exists) {
            return { wishlist: state.wishlist.filter((id) => id !== productId) };
          } else {
            return { wishlist: [...state.wishlist, productId] };
          }
        });
      },

      isInWishlist: (productId) => get().wishlist.includes(productId),

      applyVoucher: (voucher) => set({ appliedVoucher: voucher }),
      removeVoucher: () => set({ appliedVoucher: null }),

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'barangin-cart-storage',
      partialize: (state) => ({ items: state.items, wishlist: state.wishlist, appliedVoucher: state.appliedVoucher }),
    }
  )
);
