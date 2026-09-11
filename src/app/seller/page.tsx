import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import SellButton from '@/components/SellButton';
import { Package, Plus, DollarSign, Store, ChevronRight } from 'lucide-react';

export const revalidate = 0;

export default async function SellerDashboard() {
  const session = await requireRole(['SELLER']);

  const products = await prisma.product.findMany({
    where: { seller_id: session.id },
    orderBy: { created_at: 'desc' }
  });

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'TERSEDIA').length;
  const totalSales = products
    .filter(p => p.status === 'TERJUAL' || p.status === 'SELESAI')
    .reduce((acc, curr) => acc + curr.harga_input, 0);

  return (
    <div className="min-h-screen bg-base-white pb-20 pt-8">
      <div className="w-[95%] sm:w-[98%] max-w-[2560px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-gray-light pb-8">
          <div>
            <div className="inline-block px-3 py-1 bg-base-light rounded-full text-[9px] font-bold text-gray-dark uppercase tracking-wider mb-4">
              SELLER CENTER
            </div>
            <h1 className="text-3xl font-black text-base-dark tracking-tight uppercase">Dashboard Penjualan</h1>
          </div>
          <SellButton />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-base-light p-8 rounded-2xl flex flex-col justify-between h-40">
            <div className="flex items-center justify-between">
              <Package className="w-5 h-5 text-gray" />
              <p className="text-[10px] font-bold text-gray uppercase tracking-widest">Total Barang</p>
            </div>
            <p className="text-4xl font-black text-base-dark">{totalProducts}</p>
          </div>
          <div className="bg-base-light p-8 rounded-2xl flex flex-col justify-between h-40">
            <div className="flex items-center justify-between">
               <Package className="w-5 h-5 text-primary" />
               <p className="text-[10px] font-bold text-gray uppercase tracking-widest">Aktif</p>
            </div>
            <p className="text-4xl font-black text-base-dark">{activeProducts}</p>
          </div>
          <div className="bg-primary-light p-8 rounded-2xl flex flex-col justify-between h-40">
            <div className="flex items-center justify-between">
               <DollarSign className="w-5 h-5 text-primary-dark" />
               <p className="text-[10px] font-bold text-primary-dark uppercase tracking-widest">Pendapatan</p>
            </div>
            <p className="text-3xl font-black text-primary-dark truncate">{totalSales.toLocaleString('id-ID')} ₽</p>
          </div>
        </div>

        {/* Product List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-black text-base-dark uppercase tracking-widest">Daftar Barang Anda</h2>
          </div>
          
          <div className="overflow-x-auto border border-gray-light rounded-[24px]">
            <table className="w-full text-left text-sm text-base-dark">
              <thead className="bg-base-light text-[10px] text-gray uppercase font-bold tracking-widest">
                <tr>
                  <th className="px-8 py-6 rounded-tl-[24px]">Barang</th>
                  <th className="px-8 py-6">Harga Platform</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-right rounded-tr-[24px]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-light">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-12 text-center text-gray font-medium text-xs uppercase tracking-widest">
                      Belum ada barang.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-base-light/50 transition-colors">
                      <td className="px-8 py-6 font-bold uppercase text-xs">{product.nama_barang}</td>
                      <td className="px-8 py-6 font-bold text-primary">
                        {product.harga_jual.toLocaleString('id-ID')} ₽
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1.5 text-[9px] font-bold rounded-full uppercase tracking-widest ${
                          product.status === 'TERSEDIA' ? 'bg-primary-light text-primary-dark' :
                          product.status === 'DIPESAN' ? 'bg-orange-50 text-orange-600' :
                          'bg-base-light text-gray'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Link 
                          href={`/products/${product.id}`}
                          className="inline-flex items-center gap-1 text-[9px] font-bold text-base-dark hover:text-primary transition-colors uppercase tracking-widest border-b border-base-dark hover:border-primary pb-0.5"
                        >
                          Lihat Katalog
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
