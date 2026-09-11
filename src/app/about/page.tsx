'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  HeartHandshake,
  Sparkles,
  ShoppingBag,
  Store,
  HelpCircle,
  Award,
  Globe
} from 'lucide-react';

export default function AboutPage() {
  const router = useRouter();
  const { handleStartSelling } = useAuthStore();

  return (
    <main className="min-h-screen bg-base-white pb-24">
      
      {/* 1. Hero Header Section with High-Res Visual */}
      <section className="w-[95%] sm:w-[98%] max-w-[2560px] mx-auto pt-4 md:pt-8">
        <div className="bg-[#F8F7F3] rounded-2xl border border-[#EAE7DF] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between">
          
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#5A624E_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Left Text Content */}
          <div className="p-8 sm:p-14 lg:p-18 lg:w-[55%] relative z-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#EFECE3] text-[#7A664D] rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-4 border border-[#E2DDD0]">
              <Sparkles className="w-3.5 h-3.5 text-[#8C6A3D]" /> TENTANG BARANGINAJA
            </span>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#0C1D32] tracking-tight leading-[1.05] uppercase mb-4">
              MEMBERDAYAKAN MAHASISWA DENGAN EKOSISTEM SIRKULAR.
            </h1>

            <p className="font-cursive text-2xl sm:text-3xl lg:text-4xl text-[#007AAD] font-normal mb-6 transform -rotate-1">
              Solusi Cerdas &amp; Ramah Kantong untuk Kehidupan Kampus!
            </p>

            <p className="text-xs sm:text-sm md:text-base text-[#4E5446] leading-relaxed font-semibold max-w-2xl">
              BaranginAja lahir dari pemahaman mendalam atas dinamika kehidupan perkuliahan. Dari kebutuhan melengkapi kamar kos hingga momen pindahan wisuda, kami menyediakan pasar sirkular khusus mahasiswa yang aman, tepercaya, dan bebas biaya tersembunyi.
            </p>
          </div>

          {/* Right Image Showcase */}
          <div className="w-full lg:w-[45%] h-[320px] lg:h-[500px] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#F8F7F3] via-transparent to-transparent z-10 pointer-events-none" />
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
              alt="Mahasiswa Kampus"
              className="w-full h-full object-cover filter contrast-[1.02]"
            />
          </div>

        </div>
      </section>

      {/* 2. Key Metrics & Impact Stats Grid */}
      <section className="w-[95%] sm:w-[98%] max-w-[2560px] mx-auto mt-6 md:mt-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { number: '10.000+', label: 'Barang Kos Terdistribusi', desc: 'Kasur, meja, elektronik & buku bekas' },
            { number: '15+', label: 'Kampus Terintegrasi', desc: 'Jaringan mahasiswa antar fakultas' },
            { number: '100%', label: 'Bebas Komisi Admin', desc: 'Hasil jualan utuh diterima penjual' },
            { number: '4.9 / 5.0', label: 'Kepuasan Pengguna', desc: 'Ulasan positif dari ribuan mahasiswa' },
          ].map((stat, i) => (
            <div 
              key={i} 
              className="bg-[#F8F7F3] p-6 sm:p-8 rounded-xl border border-[#EAE7DF] hover:border-[#D9D6CA] transition-all hover:shadow-md group"
            >
              <div className="text-2xl sm:text-4xl font-black text-[#1F241A] tracking-tight mb-1.5 group-hover:text-primary transition-colors">
                {stat.number}
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#1F241A] uppercase tracking-wide mb-1">
                {stat.label}
              </div>
              <div className="text-[11px] text-[#6B7260] font-medium leading-relaxed">
                {stat.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Our Story & Values (Bento Cards Layout) */}
      <section className="w-[95%] sm:w-[98%] max-w-[2560px] mx-auto mt-16 md:mt-24">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] font-bold text-[#8A785D] uppercase tracking-[0.2em] block mb-2">
            NILAI UTAMA KAMI
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#1F241A] uppercase tracking-tight">
            MENGAPA MEMILIH BARANGINAJA?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-[#F8F7F3] p-8 rounded-2xl border border-[#EAE7DF] flex flex-col justify-between hover:shadow-lg transition-all group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#1F241A] uppercase tracking-wide mb-3">
                COD Area Kampus
              </h3>
              <p className="text-xs sm:text-sm text-[#4E5446] leading-relaxed font-semibold">
                Hemat 100% ongkir. Pengguna dapat langsung menjadwalkan ketemuan aman di kantin, perpustakaan, atau gedung fakultas pilihan.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[#EAE7DF] text-[11px] font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-primary" /> Hemat Biaya & Praktis
            </div>
          </div>

          {/* Card 2 - Dark Accent Card */}
          <div className="bg-[#0C1D32] text-base-white p-8 rounded-2xl flex flex-col justify-between shadow-xl relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#007AAD]/20 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#007AAD] mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-wide mb-3">
                Komunitas Terverifikasi
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-semibold">
                Setiap akun penjual dan pembeli terhubung dengan email instansi kampus atau NIM resmi untuk menjaga rasa aman dan saling percaya.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/10 text-[11px] font-bold text-[#007AAD] flex items-center gap-1.5 uppercase tracking-wider relative z-10">
              <CheckCircle2 className="w-4 h-4 text-[#007AAD]" /> 100% Bebas Penipuan
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#F8F7F3] p-8 rounded-2xl border border-[#EAE7DF] flex flex-col justify-between hover:shadow-lg transition-all group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#1F241A] uppercase tracking-wide mb-3">
                Gaya Hidup Sirkular
              </h3>
              <p className="text-xs sm:text-sm text-[#4E5446] leading-relaxed font-semibold">
                Kurangi sampah elektronik & perabotan kos. Barang yang masih sangat layak pakai diteruskan ke generasi mahasiswa berikutnya.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[#EAE7DF] text-[11px] font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-primary" /> Ramah Lingkungan
            </div>
          </div>

        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="cara-kerja" className="w-[95%] sm:w-[98%] max-w-[2560px] mx-auto mt-20 md:mt-28">
        <div className="bg-[#F8F7F3] rounded-2xl border border-[#EAE7DF] p-8 sm:p-14 lg:p-16">
          
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-[10px] font-bold text-[#8A785D] uppercase tracking-[0.2em] block mb-2">
              ALUR TRANSAKSI
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#1F241A] uppercase tracking-tight">
              BAGAIMANA CARA KERJANYA?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
            
            {/* Left: Pembeli */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-base-white rounded-full text-xs font-bold uppercase tracking-wider mb-2 shadow-xs">
                <ShoppingBag className="w-4 h-4" /> Untuk Pembeli
              </div>

              {[
                { step: '01', title: 'Cari Barang Bekas', desc: 'Gunakan fitur pencarian atau filter kategori untuk menemukan barang kos di kampus Anda.' },
                { step: '02', title: 'Hubungi Penjual', desc: 'Gunakan tombol WhatsApp / Chat untuk menanyakan kondisi & menyepakati tempat COD.' },
                { step: '03', title: 'Cek Barang & Bayar', desc: 'Periksa fisik barang secara langsung di lokasi ketemuan sebelum melakukan pembayaran.' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-base-white border border-[#EAE7DF] shadow-xs hover:shadow-md transition-shadow">
                  <span className="text-lg font-black text-[#9E7B4E] font-mono">{item.step}</span>
                  <div>
                    <h4 className="text-sm font-bold text-[#1F241A] uppercase tracking-wide">{item.title}</h4>
                    <p className="text-xs text-[#4E5446] font-semibold mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Penjual */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1F241A] text-base-white rounded-full text-xs font-bold uppercase tracking-wider mb-2 shadow-xs">
                <Store className="w-4 h-4" /> Untuk Penjual
              </div>

              {[
                { step: '01', title: 'Unggah Produk Gratis', desc: 'Foto barang kos Anda, tulis deskripsi honest, dan tentukan harga jual yang ramah di kantong.' },
                { step: '02', title: 'Sepakati Ketemuan', desc: 'Balas pesan dari calon pembeli dan tentukan waktu serta tempat COD aman di area kampus.' },
                { step: '03', title: 'Terima Uang Utuh', desc: 'Dapatkan pembayaran langsung secara tunai/transfer tanpa potongan komisi admin sedikitpun.' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-base-white border border-[#EAE7DF] shadow-xs hover:shadow-md transition-shadow">
                  <span className="text-lg font-black text-[#9E7B4E] font-mono">{item.step}</span>
                  <div>
                    <h4 className="text-sm font-bold text-[#1F241A] uppercase tracking-wide">{item.title}</h4>
                    <p className="text-xs text-[#4E5446] font-semibold mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 5. Frequently Asked Questions (FAQ) Section */}
      <section className="w-[95%] sm:w-[98%] max-w-[2560px] mx-auto mt-20 md:mt-28">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] font-bold text-[#8A785D] uppercase tracking-[0.2em] block mb-2">
              PERTANYAAN UMUM
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#1F241A] uppercase tracking-tight">
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Apakah ada biaya komisi penjualan di BaranginAja?',
                a: 'Tidak ada sama sekali! BaranginAja 100% bebas biaya komisi. Hasil penjualan sepenuhnya diterima oleh penjual.'
              },
              {
                q: 'Bagaimana cara menentukan lokasi COD yang aman?',
                a: 'Disarankan menyepakati lokasi umum dan ramai di area kampus, seperti kantin perpustakaan, gazebo fakultas, atau pos satpam utama kampus.'
              },
              {
                q: 'Siapa saja yang bisa mendaftar di BaranginAja?',
                a: 'Seluruh mahasiswa aktif dari perguruan tinggi di Indonesia. Verifikasi dapat dilakukan menggunakan Email Instansi Kampus atau NIM Mahasiswa.'
              },
              {
                q: 'Apa yang harus dilakukan jika kondisi barang tidak sesuai?',
                a: 'Karena sistem COD, pastikan Anda memeriksa fisik dan fungsi barang secara langsung di lokasi pertemuan sebelum menyerahkan pembayaran.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-[#F8F7F3] p-6 rounded-2xl border border-[#EAE7DF]">
                <h4 className="text-sm font-bold text-[#1F241A] flex items-center gap-2 mb-2">
                  <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                  {faq.q}
                </h4>
                <p className="text-xs text-[#4E5446] font-semibold leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Big CTA Join Banner */}
      <section className="w-[95%] sm:w-[98%] max-w-[2560px] mx-auto mt-20 md:mt-28">
        <div className="bg-[#0C1D32] rounded-2xl p-10 sm:p-16 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left shadow-xl border border-[#0C1D32]">
          
          {/* Subtle Graphic Glow */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#007AAD]/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <span className="text-[10px] font-bold text-[#007AAD] uppercase tracking-[0.2em] block mb-3">
              SIAP MULAI BERTRANSAKSI?
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-base-white uppercase tracking-tight mb-3">
              BERGABUNGLAH DENGAN KOMUNITAS KAMPUS KAMI
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 font-medium leading-relaxed">
              Jual barang kos yang sudah tidak terpakai atau temukan perlengkapan kos hemat untuk semester baru Anda.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 shrink-0">
            <Link 
              href="/products" 
              className="px-8 py-4 bg-[#007AAD] hover:bg-[#005C82] text-base-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-2 shadow-lg"
            >
              Belanja Sekarang <ArrowRight className="w-4 h-4" />
            </Link>

            <button 
              onClick={() => handleStartSelling(router)} 
              className="px-8 py-4 bg-base-white hover:bg-gray-100 text-[#0C1D32] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors inline-block cursor-pointer"
            >
              Mulai Jualan
            </button>
          </div>

        </div>
      </section>

    </main>
  );
}
