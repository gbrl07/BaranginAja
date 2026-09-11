'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  Truck, 
  ShieldCheck, 
  Lock,
  ArrowRight
} from 'lucide-react';

const slides = [
  {
    id: 1,
    welcome: 'SOLUSI HEMAT MAHASISWA',
    titleLine1: 'TEMUKAN BARANG KOS.',
    titleLine2: 'SIAP PAKAI KULIAH.',
    cursiveText: 'Solusi Hemat Kebutuhan Kos & Perkuliahan!',
    desc: 'Cari kasur, meja belajar, kipas angin, laptop & perabotan kos bekas layak pakai dari kakak tingkat dengan harga pas di kantong.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80',
    primaryCtaText: 'BELANJA SEKARANG',
    primaryCtaLink: '/products',
    secondaryCtaText: 'EKSPLOR KATALOG',
    secondaryCtaLink: '/products',
  },
  {
    id: 2,
    welcome: 'PASAR BEBAS KAMPUS',
    titleLine1: 'JUAL BARANG LAMA.',
    titleLine2: 'DAPATKAN CUAN.',
    cursiveText: 'Pindahan Kos Mudah, Cuan Terkumpul Sebelum Lulus!',
    desc: 'Jangan biarkan barang menumpuk di kamar kos saat wisuda. Jual langsung ke adik tingkat dengan cepat, aman, dan 100% tanpa potongan admin.',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1400&q=80',
    primaryCtaText: 'MULAI JUALAN',
    primaryCtaLink: '/seller/register',
    secondaryCtaText: 'CARA JUALAN',
    secondaryCtaLink: '/about#cara-kerja',
  },
  {
    id: 3,
    welcome: 'TENTANG PLATFORM KAMI',
    titleLine1: 'DARI MAHASISWA.',
    titleLine2: 'UNTUK MAHASISWA.',
    cursiveText: 'Kenali Misi Kami Membantu Ekosistem Kampus!',
    desc: 'BaranginAja adalah platform sirkular terlengkap tempat mahasiswa saling berbagi & bertransaksi barang bekas berkualitas secara aman dan terverifikasi.',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=80',
    primaryCtaText: 'BACA PROFIL KAMI',
    primaryCtaLink: '/about',
    secondaryCtaText: 'PELAJARI MISI',
    secondaryCtaLink: '/about',
  },
];

export default function HeroCarousel() {
  const router = useRouter();
  const { handleStartSelling } = useAuthStore();
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [nextSlide, isAutoPlaying]);

  const activeSlide = slides[current];

  return (
    <section className="w-[95%] sm:w-[98%] max-w-[2560px] mx-auto pt-3 md:pt-5">
      <div 
        className="bg-[#F8F7F3] rounded-2xl relative overflow-hidden min-h-[520px] md:min-h-[580px] lg:min-h-[620px] border border-[#EAE7DF] shadow-xs flex"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >

        {/* Side Navigation Arrow Buttons */}
        <button 
          suppressHydrationWarning
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-base-dark hover:bg-primary hover:text-white transition-all shadow-md hover:scale-105"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button 
          suppressHydrationWarning
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-base-dark hover:bg-primary hover:text-white transition-all shadow-md hover:scale-105"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Floating Slide Dots Navigation Overlay */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md rounded-full border border-white/50 shadow-xs">
          {slides.map((_, idx) => (
            <button
              key={idx}
              suppressHydrationWarning
              onClick={() => setCurrent(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`rounded-full transition-all duration-300 ${
                current === idx 
                  ? 'w-6 h-2 bg-[#0C1D32]' 
                  : 'w-2 h-2 bg-black/30 hover:bg-black/60'
              }`}
            />
          ))}
        </div>

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative flex flex-col lg:flex-row w-full h-full min-h-[520px] md:min-h-[580px] lg:min-h-[620px]"
          >
            {/* Left Content Side (~1/3 ratio focus) */}
            <div className="w-full lg:w-[38%] xl:w-[34%] flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:p-14 pb-12 sm:pb-14 z-20 shrink-0 relative">
              <div>
                
                {/* Subtitle Label */}
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-[10px] sm:text-xs font-extrabold text-[#007AAD] uppercase tracking-[0.22em] mb-2 sm:mb-3"
                >
                  {activeSlide.welcome}
                </motion.p>
                
                {/* Bold Headline */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[52px] font-black text-[#0C1D32] tracking-tight leading-[1.05] uppercase"
                >
                  <div>{activeSlide.titleLine1}</div>
                  <div>{activeSlide.titleLine2}</div>
                </motion.div>

                {/* Elegant Cursive Script Accent */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="font-cursive text-2xl sm:text-3xl lg:text-4xl text-[#007AAD] font-normal my-2 sm:my-3 transform -rotate-1 drop-shadow-xs"
                >
                  {activeSlide.cursiveText}
                </motion.div>
                
                {/* Description Paragraph */}
                <motion.p 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-xs sm:text-sm text-[#1F3047] max-w-md mb-6 sm:mb-8 leading-relaxed font-semibold"
                >
                  {activeSlide.desc}
                </motion.p>
                
                {/* Action Buttons */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8 sm:mb-10"
                >
                  {activeSlide.primaryCtaLink === '/seller/register' ? (
                    <button
                      onClick={() => handleStartSelling(router)}
                      className="group px-7 sm:px-8 py-3.5 sm:py-4 bg-[#0C1D32] hover:bg-[#007AAD] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 flex items-center gap-2.5 shadow-md hover:shadow-lg cursor-pointer"
                    >
                      <span>{activeSlide.primaryCtaText}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <Link 
                      href={activeSlide.primaryCtaLink} 
                      className="group px-7 sm:px-8 py-3.5 sm:py-4 bg-[#0C1D32] hover:bg-[#007AAD] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 flex items-center gap-2.5 shadow-md hover:shadow-lg"
                    >
                      <span>{activeSlide.primaryCtaText}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}

                  <Link 
                    href={activeSlide.secondaryCtaLink} 
                    className="px-6 sm:px-7 py-3.5 sm:py-4 bg-white/80 backdrop-blur-xs hover:bg-white text-[#0C1D32] text-xs font-bold uppercase tracking-wider rounded-lg border-2 border-[#0C1D32] transition-all duration-300 shadow-xs"
                  >
                    {activeSlide.secondaryCtaText}
                  </Link>
                </motion.div>

              </div>

              {/* Bottom 3 Features Bar */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="grid grid-cols-3 gap-2 sm:gap-3 pt-5 border-t border-[#D9E2E9]"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#D9E2E9]/60 flex items-center justify-center text-[#0C1D32] shrink-0 border border-black/5">
                    <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-[11px] font-black text-[#0C1D32] uppercase leading-tight">COD KAMPUS</p>
                    <p className="text-[9px] text-[#6B7C96] hidden sm:block leading-tight mt-0.5 font-medium">Tanpa ongkir</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#D9E2E9]/60 flex items-center justify-center text-[#0C1D32] shrink-0 border border-black/5">
                    <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-[11px] font-black text-[#0C1D32] uppercase leading-tight">VERIFIKASI</p>
                    <p className="text-[9px] text-[#6B7C96] hidden sm:block leading-tight mt-0.5 font-medium">Email NIM</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#D9E2E9]/60 flex items-center justify-center text-[#0C1D32] shrink-0 border border-black/5">
                    <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-[11px] font-black text-[#0C1D32] uppercase leading-tight">100% AMAN</p>
                    <p className="text-[9px] text-[#6B7C96] hidden sm:block leading-tight mt-0.5 font-medium">Bebas admin</p>
                  </div>
                </div>
              </motion.div>

            </div>

            {/* Right 2/3 Image Showcase - Absolute Full Height Top-to-Bottom */}
            <div className="absolute inset-y-0 right-0 w-full lg:w-[68%] xl:w-[70%] h-full overflow-hidden pointer-events-none z-10">
              
              {/* Left-Only Soft Gradient Fade for smooth blending with text section */}
              <div className="absolute inset-y-0 left-0 w-full sm:w-3/4 lg:w-1/2 bg-gradient-to-r from-[#F8F7F3] via-[#F8F7F3]/85 via-35% to-transparent z-10" />

              {/* Full Height Edge-to-Edge Image */}
              <div className="w-full h-full relative lg:[mask-image:linear-gradient(to_right,transparent_0%,black_25%,black_100%)]">
                <img 
                  src={activeSlide.image} 
                  alt="Product composition"
                  className="w-full h-full object-cover object-center filter contrast-[1.02] brightness-[0.98]"
                />
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}






