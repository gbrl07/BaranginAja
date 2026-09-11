'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function AddProductPage() {
  const router = useRouter();
  const { user, openSellModal } = useAuthStore();

  useEffect(() => {
    if (user && user.is_seller) {
      openSellModal();
      router.push('/seller');
    } else {
      router.push('/');
    }
  }, [user, router, openSellModal]);

  return (
    <div className="min-h-screen bg-base-white flex items-center justify-center p-6">
      <div className="text-xs text-gray-500 font-bold uppercase tracking-wider animate-pulse">
        Membuka modal tambah barang...
      </div>
    </div>
  );
}
