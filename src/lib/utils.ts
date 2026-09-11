import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function getOrderStatusBadge(status: string) {
  switch (status.toUpperCase()) {
    case 'PENDING':
      return { label: 'Menunggu Pembayaran', bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20' };
    case 'PROCESSING':
      return { label: 'Sedang Diproses', bg: 'bg-blue-500/10 text-blue-500 border-blue-500/20' };
    case 'SHIPPED':
      return { label: 'Dalam Pengiriman', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
    case 'DELIVERED':
      return { label: 'Pesanan Selesai', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    case 'CANCELLED':
      return { label: 'Dibatalkan', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
    default:
      return { label: status, bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
  }
}
