/**
 * @file ProductsTab.tsx
 * @description Komponen Tab Katalog Produk & Tier Calculation SIM Admin.
 */

import { formatRupiah } from '@/lib/utils';
import { ProductSim } from '../../types/admin';

interface ProductsTabProps {
  products: ProductSim[];
}

export default function ProductsTab({ products }: ProductsTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
          <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
            Katalog Produk Tersedia
          </span>
          <span className="text-xs text-[#64748B] font-bold">Total Produk: {products.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#0F172A]">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase text-[10px] font-bold">
              <tr>
                <th className="p-4">Barang</th>
                <th className="p-4">Seller</th>
                <th className="p-4">Harga Input Seller</th>
                <th className="p-4">Harga Jual Public (+Markup)</th>
                <th className="p-4">Kondisi</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#64748B] font-medium text-xs">
                    Belum ada barang di katalog produk.
                  </td>
                </tr>
              ) : (
                products.map((prod: any) => (
                  <tr key={prod.id} className="hover:bg-[#F8FAFC] transition">
                    <td className="p-4">
                      <p className="font-bold text-[#0F172A] text-xs">{prod.nama_barang}</p>
                      <p className="text-[10px] text-[#64748B] font-mono">ID: #{prod.id?.substring(0, 8)}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-[#0F172A]">{prod.seller?.nama_lengkap || 'Seller'}</p>
                      <p className="text-[10px] text-[#64748B]">{prod.seller?.email}</p>
                    </td>
                    <td className="p-4 font-bold text-[#0F172A]">{formatRupiah(prod.harga_input)}</td>
                    <td className="p-4 font-black text-[#0062FF]">{formatRupiah(prod.harga_jual)}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 bg-[#F8FAFC] text-[#0F172A] font-bold text-[10px] rounded-md border border-[#E2E8F0]">
                        {prod.kondisi || 'BEKAS'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 bg-[#ECFDF5] text-[#047857] font-bold text-[10px] rounded-full border border-[#A7F3D0]">
                        {prod.status || 'AVAILABLE'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
