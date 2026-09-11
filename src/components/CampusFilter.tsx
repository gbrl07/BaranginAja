'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Building2, Sparkles, ChevronRight } from 'lucide-react';

const CAMPUSES = [
  { id: 'all', name: 'Semua Kampus', code: 'ALL', icon: '🎓' },
  { id: 'unair', name: 'UNAIR', fullName: 'Universitas Airlangga', code: 'UNAIR', icon: '🏛️' },
  { id: 'its', name: 'ITS', fullName: 'Institut Teknologi Sepuluh Nopember', code: 'ITS', icon: '⚙️' },
  { id: 'unesa', name: 'UNESA', fullName: 'Universitas Negeri Surabaya', code: 'UNESA', icon: '🎨' },
  { id: 'ubaya', name: 'UBAYA', fullName: 'Universitas Surabaya', code: 'UBAYA', icon: '🌱' },
  { id: 'petra', name: 'UK Petra', fullName: 'Universitas Kristen Petra', code: 'PETRA', icon: '📐' },
  { id: 'upn', name: 'UPN Jatim', fullName: 'UPN Veteran Jawa Timur', code: 'UPN', icon: '💼' },
];

export default function CampusFilter() {
  const [selected, setSelected] = useState('all');

  return (
    <div className="w-full bg-[#0C1D32] text-white py-10 px-4 sm:px-8 rounded-2xl shadow-xl my-8 relative overflow-hidden border border-[#0C1D32]">
      {/* Background Decor */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#007AAD]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#007AAD] text-xs font-bold uppercase tracking-wider mb-2 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" /> Filter Lokasi Kampus Surabaya
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Cari Barang Bekas Dekat Kampusmu
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-xl">
              Pilih lokasi kampus kosmu untuk menemukan perabotan &amp; elektronik second dari sesama mahasiswa sekitarmu!
            </p>
          </div>

          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 text-xs font-bold text-[#007AAD] hover:text-white transition-colors uppercase tracking-wider group"
          >
            Lihat Semua Produk <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Campus Pills */}
        <div className="overflow-x-auto scrollbar-hide -mx-2 px-2 py-1">
          <div className="flex items-center gap-2.5 min-w-max">
            {CAMPUSES.map((campus) => {
              const isSelected = selected === campus.id;
              const href = campus.id === 'all' 
                ? '/products' 
                : `/products?campus=${encodeURIComponent(campus.name)}`;

              return (
                <Link
                  key={campus.id}
                  href={href}
                  onClick={() => setSelected(campus.id)}
                  className={`group px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-2.5 border backdrop-blur-md ${
                    isSelected
                      ? 'bg-white text-[#0C1D32] border-white shadow-lg scale-102'
                      : 'bg-white/10 text-gray-200 border-white/10 hover:bg-white/20 hover:border-white/30'
                  }`}
                >
                  <span className="text-base">{campus.icon}</span>
                  <div className="flex flex-col text-left">
                    <span className="leading-tight font-extrabold">{campus.name}</span>
                    <span className={`text-[10px] ${isSelected ? 'text-gray-500' : 'text-gray-400 font-normal'}`}>
                      {campus.id === 'all' ? 'Se-Surabaya' : 'Area Kampus'}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
