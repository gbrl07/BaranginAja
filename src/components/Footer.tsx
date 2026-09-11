'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, ShieldCheck, Truck, CreditCard, Headphones, Globe, Mail, Phone } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }
  return (
    <footer className="bg-base-white pt-14 pb-8 border-t border-gray-light">
      <div className="w-[95%] sm:w-[98%] max-w-[2560px] mx-auto">

        {/* Value Proposition Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pb-14 border-b border-gray-light">
          <div className="flex items-center justify-center gap-4 p-3 rounded-2xl">
            <div className="w-13 h-13 sm:w-14 sm:h-14 bg-base-white border-2 border-gray-light text-base-dark rounded-full flex items-center justify-center shrink-0 shadow-xs">
              <Truck className="w-6 h-6 sm:w-7 sm:h-7 text-gray" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-base-dark uppercase tracking-wider">Pengiriman Fleksibel</h4>
              <p className="text-xs text-gray mt-0.5 font-medium">COD Kampus / Kurir Express</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 p-3 rounded-2xl">
            <div className="w-13 h-13 sm:w-14 sm:h-14 bg-base-white border-2 border-gray-light text-base-dark rounded-full flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-gray" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-base-dark uppercase tracking-wider">Aman &amp; Terpercaya</h4>
              <p className="text-xs text-gray mt-0.5 font-medium">Penjual Terverifikasi NIM</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 p-3 rounded-2xl">
            <div className="w-13 h-13 sm:w-14 sm:h-14 bg-base-white border-2 border-gray-light text-base-dark rounded-full flex items-center justify-center shrink-0 shadow-xs">
              <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 text-gray" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-base-dark uppercase tracking-wider">Bayar Mudah</h4>
              <p className="text-xs text-gray mt-0.5 font-medium">QRIS / Transfer / COD</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 p-3 rounded-2xl">
            <div className="w-13 h-13 sm:w-14 sm:h-14 bg-base-white border-2 border-gray-light text-base-dark rounded-full flex items-center justify-center shrink-0 shadow-xs">
              <Headphones className="w-6 h-6 sm:w-7 sm:h-7 text-gray" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-base-dark uppercase tracking-wider">Dukungan 24/7</h4>
              <p className="text-xs text-gray mt-0.5 font-medium">Bantuan Kendala Kos</p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-primary">
                <Leaf className="w-6 h-6 fill-primary" />
              </div>
              <span className="text-sm font-black text-base-dark tracking-widest uppercase">Barangin</span>
            </div>
            <p className="text-xs leading-relaxed text-gray font-medium mb-6">
              Platform barang bekas mahasiswa dengan gaya ultra-minimalis, ramah lingkungan, dan mendukung keberlanjutan kampus.
            </p>
            <div className="flex items-center gap-4 text-base-dark">
              <a href="#" className="hover:text-primary transition-colors"><Globe className="w-4 h-4" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Mail className="w-4 h-4" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Phone className="w-4 h-4" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-base-dark uppercase tracking-widest mb-6">Katalog Utama</h4>
            <ul className="space-y-4 text-[10px] uppercase tracking-widest font-bold text-gray">
              <li><Link href="/products?category=elektronik" className="hover:text-primary transition-colors">Elektronik Kos</Link></li>
              <li><Link href="/products?category=perabotan" className="hover:text-primary transition-colors">Perabotan & Mebel</Link></li>
              <li><Link href="/products?category=buku" className="hover:text-primary transition-colors">Buku & Catatan</Link></li>
              <li><Link href="/products?category=fashion" className="hover:text-primary transition-colors">Pakaian Pria/Wanita</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-base-dark uppercase tracking-widest mb-6">Informasi</h4>
            <ul className="space-y-4 text-[10px] uppercase tracking-widest font-bold text-gray">
              <li><Link href="#" className="hover:text-primary transition-colors">Tentang Kami</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link href="/admin" className="hover:text-primary text-gray transition-colors">Pusat Bantuan</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-base-dark uppercase tracking-widest mb-6">Kontak Cepat</h4>
            <ul className="space-y-4 text-[10px] uppercase tracking-widest font-bold text-gray">
              <li>0 800 123-45-67</li>
              <li>support@barangin.com</li>
              <li>Jl. Surabaya, Jawa Timur</li>
              <li className="opacity-70">Tiap Hari 09:00 - 21:00</li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-gray-light flex flex-col md:flex-row items-center justify-between gap-4 text-[9px] uppercase tracking-widest font-bold text-gray">
          <p>© 2026 BARANGIN AJA. HAK CIPTA DILINDUNGI.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-base-dark transition-colors">KEBIJAKAN PRIVASI</Link>
            <Link href="#" className="hover:text-base-dark transition-colors">SYARAT PENGGUNAAN</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
