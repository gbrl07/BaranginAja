'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { ArrowRight, ShoppingBag, Store, ShieldCheck, Truck, QrCode, Wallet, MapPin, MessageSquare, Package } from 'lucide-react';

interface StepItem {
  id: number;
  title: string;
  desc: string;
  image: string;
  tagText: string;
  linkHref?: string;
  icon?: any;
}

const buySteps: StepItem[] = [
  {
    id: 1,
    title: 'Cari & Pilih Barang',
    desc: 'Jelajahi katalog barang kos bekas dari mahasiswa di sekitar kampus Surabaya. Filter berdasarkan kampus & kategori yang kamu butuhkan.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
    tagText: 'Eksplor Katalog',
    linkHref: '/products',
    icon: ShoppingBag
  },
  {
    id: 2,
    title: 'Pilih Opsi Pengiriman',
    desc: 'Pilih opsi COD / Ambil Sendiri (bebas ongkir di lokasi kos penjual) atau Kurir Platform BaranginAja dengan hitung ongkir otomatis.',
    image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=600&q=80',
    tagText: 'COD / Kurir Express',
    icon: MapPin
  },
  {
    id: 3,
    title: 'Pesan via WhatsApp',
    desc: 'Klik "Pesan Sekarang". Stok barang dikunci otomatis (pending), dan kamu langsung terhubung ke Chat WA Admin dengan format pesanan resmi.',
    image: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&w=600&q=80',
    tagText: 'Otomatis & Quick WA',
    linkHref: '/products',
    icon: MessageSquare
  },
  {
    id: 4,
    title: 'Bayar via QRIS / Transfer',
    desc: 'Admin mengirimkan QRIS/Rekening resmi SeaBank di chat WhatsApp. Lakukan pembayaran aman & kirim screenshot bukti transfer.',
    image: 'https://images.unsplash.com/photo-1556742031-c6961e8560b0?auto=format&fit=crop&w=600&q=80',
    tagText: 'Verifikasi Fast Track',
    icon: QrCode
  },
  {
    id: 5,
    title: 'Terima Barang',
    desc: 'Ketemuan langsung dengan penjual di lokasi kos/kampus (COD) atau terima paket barang kosmu diantarkan kurir BaranginAja.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
    tagText: 'Garansi Sampai',
    icon: Truck
  }
];

const sellSteps: StepItem[] = [
  {
    id: 1,
    title: 'Daftar Akun Penjual',
    desc: 'Masuk ke profil, klik "Daftar Jadi Penjual", dan isi rekening bank (SeaBank, BCA, dll) sebagai penampung dana hasil jualanmu.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
    tagText: 'Daftar Gratis 1 Menit',
    linkHref: '/seller/register',
    icon: Wallet
  },
  {
    id: 2,
    title: 'Post Barang & Pasang Harga',
    desc: 'Upload foto barang kosmu, tentukan harga input murni yang ingin kamu dapatkan, estimasi berat, dan detail kondisi barang.',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
    tagText: 'Form Simpel',
    linkHref: '/seller/products/new',
    icon: Package
  },
  {
    id: 3,
    title: 'Tentukan Titik Jemput',
    desc: 'Atur lokasi titik jemput kamar kosmu di Surabaya agar kurir platform bisa langsung menjemput barang saat terjual.',
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80',
    tagText: 'Penjemputan Kos',
    icon: MapPin
  },
  {
    id: 4,
    title: 'Sistem Hitung & Tayang',
    desc: 'Sistem otomatis menghitung harga jual publik (+markup platform 10-20%). Barangmu langsung tampil di katalog mahasiswa se-Surabaya!',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    tagText: 'Tanpa Nego',
    icon: ShieldCheck
  },
  {
    id: 5,
    title: 'Terima Cuan 100% Utuh',
    desc: 'Setelah pembeli bayar & barang diterima, Admin langsung mentransfer 100% harga aslimu ke rekening tanpa potongan admin!',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80',
    tagText: 'Cairan 100% Full',
    icon: Wallet
  }
];

export default function HowItWorksSection() {
  const router = useRouter();
  const { handleStartSelling } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');

  const currentSteps = activeTab === 'buy' ? buySteps : sellSteps;

  return (
    <section className="w-[95%] sm:w-[98%] max-w-[2560px] mx-auto mt-20 sm:mt-24 py-12 sm:py-16 px-4 sm:px-8 bg-[#F0F4F8] rounded-2xl border border-[#D9E2E9] shadow-xs">
      {/* Top Accent Line */}
      <div className="w-14 h-1.5 bg-[#007AAD] rounded-full mx-auto mb-4" />

      {/* Main Title */}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-center text-[#0C1D32] uppercase tracking-tight mb-8">
        Cara Jual & Beli di BaranginAja
      </h2>

      {/* Interactive Tabs Bar */}
      <div className="flex justify-center items-center gap-6 sm:gap-10 border-b border-[#D9E2E9] pb-1 mb-10 max-w-md mx-auto">
        <button
          suppressHydrationWarning
          onClick={() => setActiveTab('buy')}
          className={`relative pb-3 text-sm sm:text-base font-black uppercase tracking-wider transition-colors ${
            activeTab === 'buy' ? 'text-[#0C1D32]' : 'text-gray hover:text-[#0C1D32]'
          }`}
        >
          Cara Membeli
          {activeTab === 'buy' && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#007AAD] rounded-full transition-all" />
          )}
        </button>

        <button
          suppressHydrationWarning
          onClick={() => setActiveTab('sell')}
          className={`relative pb-3 text-sm sm:text-base font-black uppercase tracking-wider transition-colors ${
            activeTab === 'sell' ? 'text-[#0C1D32]' : 'text-gray hover:text-[#0C1D32]'
          }`}
        >
          Cara Menjual
          {activeTab === 'sell' && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#007AAD] rounded-full transition-all" />
          )}
        </button>
      </div>

      {/* Step Cards Grid - 5 Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {currentSteps.map((step) => {
          const IconComp = step.icon;
          return (
            <div
              key={step.id}
              className="bg-[#FFFBFC] rounded-xl border border-[#D9E2E9] shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full group"
            >
              {/* Top Image with Badge */}
              <div className="relative h-40 sm:h-44 w-full overflow-hidden bg-[#F0F4F8]">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Step Number Badge */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-[#0C1D32] text-white font-black text-xs flex items-center justify-center shadow-md border border-white/20">
                  {step.id}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-sm font-black text-[#0C1D32] mb-2 tracking-tight flex items-center gap-1.5 leading-snug">
                    {IconComp && <IconComp className="w-4 h-4 text-[#007AAD] shrink-0" />}
                    <span>{step.title}</span>
                  </h3>
                  <p className="text-[11px] text-[#1F3047] font-medium leading-relaxed mb-4">
                    {step.desc}
                  </p>
                </div>

                {/* Bottom Tag / Link */}
                <div className="pt-3 border-t border-[#D9E2E9] flex items-center justify-between mt-auto">
                  <span className="text-[9px] font-extrabold text-[#007AAD] uppercase tracking-wider">
                    {step.tagText}
                  </span>
                  {step.linkHref === '/seller/register' ? (
                    <button
                      onClick={() => handleStartSelling(router)}
                      className="text-[10px] font-black text-[#007AAD] hover:text-[#005C82] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                    >
                      <span>Daftar</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ) : step.linkHref ? (
                    <Link
                      href={step.linkHref}
                      className="text-[10px] font-black text-[#007AAD] hover:text-[#005C82] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Lihat</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-[#007AAD]/30" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
