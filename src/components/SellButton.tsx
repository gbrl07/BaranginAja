'use client';

import { useAuthStore } from '@/store/useAuthStore';

export default function SellButton({ 
  className, 
  children 
}: { 
  className?: string; 
  children?: React.ReactNode 
}) {
  const { openSellModal } = useAuthStore();

  return (
    <button
      type="button"
      onClick={() => openSellModal()}
      className={className || "inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#0C1D32] hover:bg-[#007AAD] text-white text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-md"}
    >
      {children || '+ Jual Barang Baru'}
    </button>
  );
}
