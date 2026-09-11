import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export const revalidate = 0;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.search as string;
  const categoryId = resolvedParams.category as string;

  let whereClause: any = { status: 'TERSEDIA' };
  
  if (q) {
    whereClause.nama_barang = { contains: q };
  }
  
  if (categoryId) {
    whereClause.kategori_id = categoryId;
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      kategori: true,
      seller: {
        include: { kampus: true }
      }
    },
    orderBy: { created_at: 'desc' }
  });

  const categories = await prisma.category.findMany();

  return (
    <div className="min-h-screen bg-base-light pb-20 pt-8">
      <div className="w-[95%] sm:w-[98%] max-w-[2560px] mx-auto">
        
        {/* Header Area */}
        <div className="mb-8 p-8 bg-base-white rounded-2xl border border-gray-light shadow-sm">
          <h1 className="text-3xl font-black text-base-dark mb-2 tracking-tight">Katalog Barang Bekas</h1>
          <p className="text-gray text-sm font-medium">Temukan barang kebutuhan kos dari mahasiswa di sekitar Anda.</p>
          
          <div className="flex gap-2 overflow-x-auto pt-6 mt-6 border-t border-gray-light scrollbar-hide">
            <Link 
              href="/products" 
              className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                !categoryId 
                  ? 'bg-primary text-base-white shadow-premium' 
                  : 'bg-base-light text-gray-dark hover:bg-gray-light hover:text-base-dark'
              }`}
            >
              Semua Kategori
            </Link>
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}${q ? `&search=${q}` : ''}`}
                className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  categoryId === cat.id 
                    ? 'bg-primary text-base-white shadow-premium' 
                    : 'bg-base-light text-gray-dark hover:bg-gray-light hover:text-base-dark'
                }`}
              >
                {cat.nama_kategori}
              </Link>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="py-20 text-center border border-gray-light rounded-2xl bg-base-white">
            <p className="text-primary-dark font-bold">Barang tidak ditemukan</p>
            <p className="text-gray text-xs mt-2 font-medium">Coba gunakan kata kunci lain atau pilih kategori yang berbeda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
