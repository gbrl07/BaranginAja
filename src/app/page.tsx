import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import HeroCarousel from '@/components/HeroCarousel';
import HowItWorksSection from '@/components/HowItWorksSection';
import HomeFaq from '@/components/HomeFaq';
import Link from 'next/link';
import { ChevronRight, Package, Armchair, Laptop, BookOpen, Shirt } from 'lucide-react';

export const revalidate = 0;

export default async function Home() {
  let recentProducts: any[] = [];
  try {
    recentProducts = await prisma.product.findMany({
      where: { status: 'TERSEDIA' },
      include: { 
        kategori: true,
        seller: {
          include: { kampus: true }
        }
      },
      orderBy: { created_at: 'desc' },
      take: 5
    });
  } catch (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <main className="min-h-screen bg-base-white pb-20">
      
      <HeroCarousel />

      {/* Categories Pills Bar */}
      <section className="w-[95%] sm:w-[98%] max-w-[2560px] mx-auto mt-8">
        <div className="overflow-x-auto scrollbar-hide w-full">
          <div className="flex gap-2.5 min-w-max">
            {[
              { name: 'Semua Kategori', href: '/products', icon: <Package className="w-4 h-4" /> },
              { name: 'Perabotan', href: '/products?category=perabotan', icon: <Armchair className="w-4 h-4" /> },
              { name: 'Elektronik', href: '/products?category=elektronik', icon: <Laptop className="w-4 h-4" /> },
              { name: 'Buku', href: '/products?category=buku', icon: <BookOpen className="w-4 h-4" /> },
              { name: 'Fashion', href: '/products?category=fashion', icon: <Shirt className="w-4 h-4" /> },
            ].map((cat, i) => (
              <Link 
                key={cat.name}
                href={cat.href}
                className={`px-5 py-3 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 border transition-all ${
                  i === 0 ? 'bg-[#0C1D32] border-[#0C1D32] text-white' : 'bg-base-white border-gray-light text-gray-dark hover:border-gray hover:text-base-dark'
                }`}
              >
                <span className="opacity-80 flex items-center">{cat.icon}</span>
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Grid */}
      <section className="w-[95%] sm:w-[98%] max-w-[2560px] mx-auto mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-sm font-black text-base-dark uppercase tracking-widest">Barang Pilihan</h2>
          <Link href="/products" className="text-[10px] font-bold text-gray hover:text-base-dark uppercase tracking-widest flex items-center gap-1">
            Lihat Semua <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {recentProducts.length === 0 ? (
          <div className="text-center py-20 bg-base-light rounded-2xl">
            <p className="text-gray-dark font-bold">Belum ada barang bekas yang dijual.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Large Category Banners (Bento Style) */}
      <section className="w-[95%] sm:w-[98%] max-w-[2560px] mx-auto mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/products?category=elektronik" className="relative h-[320px] rounded-2xl overflow-hidden group border border-gray-light shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=80" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
              alt="Elektronik"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-base-white/95 via-base-white/80 to-transparent p-10 flex flex-col justify-center">
              <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest mb-1">Paling Dicari</span>
              <h3 className="text-3xl font-black text-base-dark uppercase tracking-tight mb-2">Elektronik Kos</h3>
              <p className="text-[11px] text-gray-dark uppercase font-bold tracking-widest max-w-[220px] leading-relaxed">
                Kipas, Rice Cooker, lampu belajar & peralatan elektronik kos.
              </p>
              <div className="mt-6 text-[11px] font-extrabold flex items-center gap-2 uppercase tracking-widest text-primary group-hover:translate-x-1 transition-transform">
                Eksplor Elektronik <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          <Link href="/products?category=perabotan" className="relative h-[320px] rounded-2xl overflow-hidden group border border-gray-light shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
              alt="Perabotan Kos"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-base-white/95 via-base-white/80 to-transparent p-10 flex flex-col justify-center">
              <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest mb-1">Kategori Favorit Kos</span>
              <h3 className="text-3xl font-black text-base-dark uppercase tracking-tight mb-2">Perabotan Kos</h3>
              <p className="text-[11px] text-gray-dark uppercase font-bold tracking-widest max-w-[220px] leading-relaxed">
                Meja belajar, rak sepatu, kursi ergonomic, & lemari praktis kos.
              </p>
              <div className="mt-6 text-[11px] font-extrabold flex items-center gap-2 uppercase tracking-widest text-primary group-hover:translate-x-1 transition-transform">
                Eksplor Perabotan <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* How It Works Section (Cara Jual & Beli) */}
      <HowItWorksSection />

      {/* FAQ Section */}
      <HomeFaq />

    </main>
  );
}


