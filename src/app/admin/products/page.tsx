'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { formatRupiah } from '@/lib/utils';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  X,
  Search,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    stock: '15',
    categoryId: '',
    imageUrl: '',
    isFeatured: false,
    isFlashSale: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
      ]);

      const prodData = await prodRes.json();
      const catData = await catRes.json();

      setProducts(prodData.products || []);
      setCategories(catData.categories || []);
      if (catData.categories && catData.categories.length > 0) {
        setFormData((prev) => ({ ...prev, categoryId: catData.categories[0].id }));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      stock: '15',
      categoryId: categories[0]?.id || '',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
      isFlashSale: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setEditingId(p.id);
    let img = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';
    try {
      const arr = JSON.parse(p.images);
      if (Array.isArray(arr) && arr.length > 0) img = arr[0];
    } catch (e) {}

    setFormData({
      name: p.name,
      description: p.description,
      price: p.price.toString(),
      originalPrice: p.originalPrice ? p.originalPrice.toString() : '',
      stock: p.stock.toString(),
      categoryId: p.categoryId,
      imageUrl: img,
      isFeatured: p.isFeatured,
      isFlashSale: p.isFlashSale,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        stock: parseInt(formData.stock),
        categoryId: formData.categoryId,
        images: [formData.imageUrl],
        isFeatured: formData.isFeatured,
        isFlashSale: formData.isFlashSale,
      };

      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan produk');

      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini dari katalog?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus produk');
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="w-[95%] sm:w-[98%] max-w-[2560px] mx-auto py-10 space-y-8"
    >
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E6EAFA]">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 bg-white border border-[#E6EAFA] rounded-full text-[#5C6070] hover:text-[#1F1F1F] shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#1D2667] flex items-center gap-2">
              <Package className="w-6 h-6 text-[#4E75F8]" /> Manajemen Katalog Produk (CRUD)
            </h1>
            <p className="text-xs text-[#5C6070]">Tambah, ubah, dan hapus stok barang penjualan</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari produk admin..."
              className="pl-9 pr-3 py-2 text-xs bg-white border border-[#E6EAFA] rounded-full text-[#1F1F1F] focus:outline-none focus:border-[#4E75F8]"
            />
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#A1A7C0]" />
          </div>

          <button
            onClick={openAddModal}
            className="px-5 py-2.5 bg-[#4E75F8] hover:bg-[#3B62E6] text-white font-bold text-xs rounded-full shadow-md shadow-[#4E75F8]/25 flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" /> Tambah Produk Baru
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#5C6070] text-xs">Memuat katalog produk...</div>
      ) : (
        <div className="bg-white border border-[#E6EAFA] rounded-3xl overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1F1F1F]">
              <thead className="bg-[#F4F6FF] border-b border-[#E6EAFA] text-[#5C6070] uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-4">Produk</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Harga</th>
                  <th className="p-4">Stok</th>
                  <th className="p-4">Terjual</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6EAFA]">
                {filteredProducts.map((p) => {
                  let imgUrl = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80';
                  try {
                    const arr = JSON.parse(p.images);
                    if (Array.isArray(arr) && arr.length > 0) imgUrl = arr[0];
                  } catch (e) {}

                  return (
                    <tr key={p.id} className="hover:bg-[#F4F6FF] transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#F4F6FF] border border-[#E6EAFA] shrink-0">
                            <Image src={imgUrl} alt={p.name} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-[#1D2667] max-w-xs truncate">{p.name}</p>
                            <p className="text-[10px] text-[#A1A7C0] font-mono">Slug: {p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-[#4E75F8]/10 text-[#4E75F8] border border-[#4E75F8]/20 rounded-full text-[10px] font-bold">
                          {p.category?.name || 'Umum'}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-[#4E75F8]">
                        {formatRupiah(p.price)}
                        {p.discountPercent > 0 && (
                          <span className="ml-1 text-[10px] text-rose-500 font-normal">(-{p.discountPercent}%)</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`font-bold ${p.stock <= 5 ? 'text-amber-600' : 'text-[#1F1F1F]'}`}>
                          {p.stock} pcs
                        </span>
                      </td>
                      <td className="p-4 text-[#5C6070]">{p.salesCount} unit</td>
                      <td className="p-4 text-center space-x-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-2 bg-[#4E75F8]/10 text-[#4E75F8] border border-[#4E75F8]/20 hover:bg-[#4E75F8] hover:text-white rounded-xl transition shadow-sm"
                          title="Edit Produk"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white rounded-xl transition shadow-sm"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#1D2667]/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white border border-[#E6EAFA] rounded-3xl p-6 md:p-8 max-w-xl w-full text-[#1F1F1F] relative shadow-2xl overflow-y-auto max-h-[90vh] z-10"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-[#5C6070] hover:text-[#1F1F1F] rounded-full hover:bg-[#F4F6FF]"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold text-[#1D2667] mb-6">
                {editingId ? 'Edit Produk Katalog' : 'Tambah Produk Baru'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#1D2667] font-semibold mb-1">Nama Produk</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Sony WH-1000XM5 Wireless"
                    className="w-full p-2.5 bg-[#F4F6FF] border border-[#E6EAFA] rounded-xl text-[#1F1F1F] focus:outline-none focus:border-[#4E75F8]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#1D2667] font-semibold mb-1">Kategori</label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full p-2.5 bg-[#F4F6FF] border border-[#E6EAFA] rounded-xl text-[#1F1F1F] focus:outline-none focus:border-[#4E75F8]"
                    >
                      <option value="">Pilih Kategori</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#1D2667] font-semibold mb-1">Stok Tersedia</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full p-2.5 bg-[#F4F6FF] border border-[#E6EAFA] rounded-xl text-[#1F1F1F] focus:outline-none focus:border-[#4E75F8]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#1D2667] font-semibold mb-1">Harga Jual (Rp)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="150000"
                      className="w-full p-2.5 bg-[#F4F6FF] border border-[#E6EAFA] rounded-xl text-[#1F1F1F] focus:outline-none focus:border-[#4E75F8]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#1D2667] font-semibold mb-1">Harga Coret/Awal (Rp)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      placeholder="200000"
                      className="w-full p-2.5 bg-[#F4F6FF] border border-[#E6EAFA] rounded-xl text-[#1F1F1F] focus:outline-none focus:border-[#4E75F8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#1D2667] font-semibold mb-1">URL Gambar Produk</label>
                  <input
                    type="url"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-2.5 bg-[#F4F6FF] border border-[#E6EAFA] rounded-xl text-[#1F1F1F] focus:outline-none focus:border-[#4E75F8]"
                  />
                </div>

                <div>
                  <label className="block text-[#1D2667] font-semibold mb-1">Deskripsi Lengkap</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Tuliskan spesifikasi dan kondisi barang..."
                    className="w-full p-2.5 bg-[#F4F6FF] border border-[#E6EAFA] rounded-xl text-[#1F1F1F] focus:outline-none focus:border-[#4E75F8]"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded text-[#4E75F8] focus:ring-[#4E75F8]"
                    />
                    Produk Unggulan
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFlashSale}
                      onChange={(e) => setFormData({ ...formData, isFlashSale: e.target.checked })}
                      className="w-4 h-4 rounded text-[#4E75F8] focus:ring-[#4E75F8]"
                    />
                    Flash Sale
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#4E75F8] hover:bg-[#3B62E6] text-white font-bold text-xs rounded-full shadow-md shadow-[#4E75F8]/30 transition mt-4"
                >
                  {submitting ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah Produk Sekarang'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
