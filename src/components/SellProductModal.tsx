'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  X, 
  Store, 
  Upload, 
  AlertCircle, 
  CheckCircle2, 
  Tag, 
  Weight, 
  DollarSign, 
  FileText, 
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';

const MOCK_PRESET_IMAGES = [
  { name: 'Kipas Angin Kos', url: 'https://images.unsplash.com/photo-1618941709602-92849f611320?auto=format&fit=crop&w=800&q=80' },
  { name: 'Meja Belajar Lipat', url: 'https://images.unsplash.com/photo-1540574163026-643ea20d25b5?auto=format&fit=crop&w=800&q=80' },
  { name: 'Lampu Belajar LED', url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80' },
  { name: 'Rak Buku Minimalis', url: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=800&q=80' },
  { name: 'Kasur Busa Single', url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80' },
];

export default function SellProductModal({ onProductCreated }: { onProductCreated?: () => void }) {
  const { user, isSellModalOpen, closeSellModal } = useAuthStore();

  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  // Form fields
  const [nama_barang, setNamaBarang] = useState('');
  const [kategori_id, setKategoriId] = useState('');
  const [kondisi, setKondisi] = useState('Baik');
  const [deskripsi, setDeskripsi] = useState('');
  const [harga_input, setHargaInput] = useState('');
  const [berat_kg, setBeratKg] = useState('');
  const [foto_url, setFotoUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data || []);
      }
    } catch (e) {
      console.error('Failed to fetch categories:', e);
    }
  };

  if (!mounted || !user) return null;

  const calculatePublicPrice = (priceStr: string) => {
    const val = Number(priceStr) || 0;
    if (val <= 0) return 0;
    if (val < 50000) return Math.round(val * 1.20);
    if (val < 100000) return Math.round(val * 1.15);
    return Math.round(val * 1.10);
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const finalImage = foto_url.trim() || MOCK_PRESET_IMAGES[0].url;

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama_barang,
          kategori_id,
          kondisi,
          deskripsi,
          harga_input: Number(harga_input),
          berat_kg: Number(berat_kg),
          foto_urls: [finalImage]
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal menambahkan barang');
      }

      setSuccess(true);

      // Reset form
      setNamaBarang('');
      setKategoriId('');
      setKondisi('Baik');
      setDeskripsi('');
      setHargaInput('');
      setBeratKg('');
      setFotoUrl('');

      if (onProductCreated) {
        onProductCreated();
      }

      setTimeout(() => {
        setSuccess(false);
        closeSellModal();
      }, 1200);

    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const currentPreviewImage = foto_url.trim() || MOCK_PRESET_IMAGES[0].url;

  return createPortal(
    <AnimatePresence>
      {isSellModalOpen && (
        <motion.div 
          key="sell-product-modal-dialog-container" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSellModal}
            className="fixed inset-0 bg-[#0C1D32]/60 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-white border border-[#EAE7DF] rounded-2xl max-w-2xl w-full text-[#0C1D32] relative shadow-2xl overflow-hidden z-10 my-auto max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-6 bg-[#0C1D32] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#007AAD] text-white flex items-center justify-center font-bold shrink-0 shadow-md">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black tracking-tight uppercase">Jual Barang Bekas Kos</h2>
                  <p className="text-xs text-gray-300">Isi formulir barang untuk ditayangkan di katalog BaranginAja.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeSellModal}
                className="p-2 text-gray-300 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-bold flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Barang Anda berhasil dipublikasikan ke katalog!</span>
                </div>
              )}

              <form id="sell-product-form" onSubmit={handleSubmit} className="space-y-5 text-xs">

                {/* 1. GAMBAR BARANG */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#0C1D32] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#007AAD]" />
                    <span>Gambar / Foto Barang</span>
                  </label>

                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    {/* Live Image Preview Thumbnail */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-[#F5F5F3] border border-[#EAE7DF] overflow-hidden shrink-0 relative flex items-center justify-center shadow-xs">
                      {currentPreviewImage ? (
                        <img 
                          src={currentPreviewImage} 
                          alt="Preview Barang" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = MOCK_PRESET_IMAGES[0].url;
                          }}
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      )}
                    </div>

                    {/* Image URL & Presets Selection */}
                    <div className="flex-1 space-y-2.5 w-full">
                      <input
                        type="url"
                        value={foto_url}
                        onChange={(e) => setFotoUrl(e.target.value)}
                        placeholder="Tempelkan URL Gambar (atau pilih contoh di bawah)"
                        className="w-full p-3 bg-[#F5F5F3] hover:bg-[#EFEFEA] focus:bg-white border border-[#EAE7DF] rounded-xl text-xs font-semibold text-[#0C1D32] focus:outline-none focus:ring-1 focus:ring-[#0C1D32] transition-all"
                      />
                      
                      <div>
                        <span className="text-[10px] text-gray font-bold uppercase tracking-wider block mb-1.5">Pilih Foto Contoh Cepat:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {MOCK_PRESET_IMAGES.map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setFotoUrl(preset.url)}
                              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                                foto_url === preset.url
                                  ? 'bg-[#007AAD] text-white border-[#007AAD]'
                                  : 'bg-[#F5F5F3] hover:bg-[#EFEFEA] text-[#0C1D32] border-[#EAE7DF]'
                              }`}
                            >
                              {preset.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. NAMA BARANG */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#0C1D32] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#007AAD]" />
                    <span>Nama Barang Bekas</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nama_barang}
                    onChange={(e) => setNamaBarang(e.target.value)}
                    placeholder="Contoh: Kipas Angin Cosmos Bekas Kos Stand Fan"
                    className="w-full p-3.5 bg-[#F5F5F3] hover:bg-[#EFEFEA] focus:bg-white border border-[#EAE7DF] rounded-xl text-xs font-bold text-[#0C1D32] focus:outline-none focus:ring-1 focus:ring-[#0C1D32] transition-all"
                  />
                </div>

                {/* 3. KATEGORI & KONDISI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-[#0C1D32] uppercase tracking-wider mb-1.5">
                      Kategori Barang
                    </label>
                    <select
                      required
                      value={kategori_id}
                      onChange={(e) => setKategoriId(e.target.value)}
                      className="w-full p-3.5 bg-[#F5F5F3] hover:bg-[#EFEFEA] focus:bg-white border border-[#EAE7DF] rounded-xl text-xs font-bold text-[#0C1D32] focus:outline-none focus:ring-1 focus:ring-[#0C1D32] transition-all"
                    >
                      <option value="">Pilih Kategori</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nama_kategori}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-[#0C1D32] uppercase tracking-wider mb-1.5">
                      Kondisi Barang
                    </label>
                    <select
                      required
                      value={kondisi}
                      onChange={(e) => setKondisi(e.target.value)}
                      className="w-full p-3.5 bg-[#F5F5F3] hover:bg-[#EFEFEA] focus:bg-white border border-[#EAE7DF] rounded-xl text-xs font-bold text-[#0C1D32] focus:outline-none focus:ring-1 focus:ring-[#0C1D32] transition-all"
                    >
                      <option value="Sangat Bagus">Sangat Bagus (Seperti Baru)</option>
                      <option value="Baik">Baik (Pemakaian Wajar Kos)</option>
                      <option value="Cukup Baik">Cukup Baik (Ada Minus Pemakaian)</option>
                    </select>
                  </div>
                </div>

                {/* 4. ESTIMASI BERAT & HARGA JUAL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-[#0C1D32] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Weight className="w-3.5 h-3.5 text-[#007AAD]" />
                      <span>Estimasi Berat (KG)</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      required
                      value={berat_kg}
                      onChange={(e) => setBeratKg(e.target.value)}
                      placeholder="Contoh: 1.5"
                      className="w-full p-3.5 bg-[#F5F5F3] hover:bg-[#EFEFEA] focus:bg-white border border-[#EAE7DF] rounded-xl text-xs font-bold font-mono text-[#0C1D32] focus:outline-none focus:ring-1 focus:ring-[#0C1D32] transition-all"
                    />
                    <p className="text-[10px] text-gray font-medium mt-1">
                      *Guna kalkulasi kurir jemput barang.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-[#0C1D32] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-[#007AAD]" />
                      <span>Harga Bersih Penjual (Rp)</span>
                    </label>
                    <input
                      type="number"
                      min="1000"
                      required
                      value={harga_input}
                      onChange={(e) => setHargaInput(e.target.value)}
                      placeholder="Contoh: 75000"
                      className="w-full p-3.5 bg-[#F5F5F3] hover:bg-[#EFEFEA] focus:bg-white border border-[#EAE7DF] rounded-xl text-xs font-bold font-mono text-[#0C1D32] focus:outline-none focus:ring-1 focus:ring-[#0C1D32] transition-all"
                    />
                    {Number(harga_input) > 0 && (
                      <div className="mt-1.5 p-2 bg-[#007AAD]/10 rounded-lg text-[10px] text-[#007AAD] font-extrabold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 shrink-0" />
                        <span>Harga Katalog Publik: {formatRupiah(calculatePublicPrice(harga_input))}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. DESKRIPSI BARANG */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#0C1D32] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#007AAD]" />
                    <span>Deskripsi Lengkap Barang</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    placeholder="Jelaskan kondisi barang, durasi pemakaian, alasan dijual, atau perlengkapan yang didapat..."
                    className="w-full p-3.5 bg-[#F5F5F3] hover:bg-[#EFEFEA] focus:bg-white border border-[#EAE7DF] rounded-xl text-xs font-bold text-[#0C1D32] focus:outline-none focus:ring-1 focus:ring-[#0C1D32] transition-all"
                  />
                </div>

              </form>
            </div>

            {/* Modal Footer / Action Button */}
            <div className="p-4 sm:p-6 bg-[#F8F7F3] border-t border-[#EAE7DF] flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={closeSellModal}
                className="px-5 py-2.5 bg-white border border-[#EAE7DF] text-xs font-bold text-gray hover:text-[#0C1D32] rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
              
              <button
                type="submit"
                form="sell-product-form"
                disabled={loading}
                className="px-7 py-2.5 bg-[#0C1D32] hover:bg-[#007AAD] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>{loading ? 'MENERBITKAN...' : 'TAYANGKAN BARANG'}</span>
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
