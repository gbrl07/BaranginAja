'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { calculateDistanceKm, calculateOngkirRupiah } from '@/lib/distance';
import MapLocationPickerModal, { LocationData } from '@/components/MapLocationPickerModal';

import { 
  Heart, 
  Share2, 
  Truck, 
  MapPin, 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle, 
  Package,
  UserCheck,
  Navigation,
  Compass
} from 'lucide-react';

interface ProductDetailClientProps {
  product: any;
  relatedProducts?: any[];
}

export default function ProductDetailClient({ product, relatedProducts = [] }: ProductDetailClientProps) {
  const { user, openAuthModal } = useAuthStore();
  const [opsiPengiriman, setOpsiPengiriman] = useState<'AMBIL_SENDIRI' | 'KURIR'>('AMBIL_SENDIRI');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'description' | 'seller_info'>('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Buyer location & map state
  const [buyerLat, setBuyerLat] = useState<number>(user?.lat || -7.284);
  const [buyerLng, setBuyerLng] = useState<number>(user?.lng || 112.788);
  const [buyerAddress, setBuyerAddress] = useState<string>(user?.alamat_kos || 'Kos Pembeli (Surabaya)');
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Seller location
  const sellerLat = product.lat || product.seller?.lat || -7.282;
  const sellerLng = product.lng || product.seller?.lng || 112.795;

  // Real distance & Ongkir calculation
  const beratKg = product.berat_kg || 1;
  const realJarakKm = calculateDistanceKm(sellerLat, sellerLng, buyerLat, buyerLng);
  const realOngkir = calculateOngkirRupiah(realJarakKm, beratKg);

  const totalHarga = product.harga_jual + (opsiPengiriman === 'KURIR' ? realOngkir : 0);

  // Parse images array
  let images: string[] = [];
  try {
    images = product.foto_urls ? JSON.parse(product.foto_urls) : [];
  } catch (e) {
    images = [];
  }

  // Fallback images array if empty
  if (images.length === 0) {
    images = ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80'];
  }

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePesan = async () => {
    if (!user) {
      openAuthModal('login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          opsi_pengiriman: opsiPengiriman
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal membuat pesanan');

      // Redirect directly to WhatsApp Admin with prefilled template message
      if (data.waLink) {
        window.location.href = data.waLink;
      }
    } catch (err: any) {
      setError(err.message || 'Gagal membuat pesanan');
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-base-white pb-24">
      {/* Breadcrumb Navigation */}
      <div className="bg-[#F0F4F8] border-b border-[#D9E2E9] py-3.5 px-4 mb-8">
        <div className="w-[95%] sm:w-[98%] max-w-[2560px] mx-auto flex items-center gap-2 text-xs font-medium text-gray">
          <Link href="/" className="hover:text-[#0C1D32] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#0C1D32] transition-colors">Katalog</Link>
          <span>/</span>
          <Link href={`/products?category=${product.kategori_id}`} className="hover:text-[#0C1D32] transition-colors capitalize">
            {product.kategori?.nama_kategori || 'Kategori'}
          </Link>
          <span>/</span>
          <span className="text-[#0C1D32] font-semibold truncate max-w-[200px] sm:max-w-[300px]">{product.nama_barang}</span>
        </div>
      </div>

      <div className="w-[95%] sm:w-[98%] max-w-[2560px] mx-auto">
        
        {/* Main Product 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Image Gallery Carousel & Thumbnails (6 cols) */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            {/* Main Featured Image Container */}
            <div className="relative w-full aspect-[4/3] rounded-[24px] bg-[#F0F4F8] border border-[#D9E2E9] overflow-hidden flex items-center justify-center group shadow-xs">
              <img 
                src={images[selectedImageIndex]} 
                alt={product.nama_barang}
                className="w-full h-full object-cover rounded-[24px] transition-transform duration-500"
              />

              {/* Status Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                {product.kondisi && (
                  <span className="px-3.5 py-1.5 bg-[#0C1D32] text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-xs">
                    {product.kondisi}
                  </span>
                )}
                <span className="px-3.5 py-1.5 bg-white/90 backdrop-blur-md text-[#0C1D32] text-[10px] font-black uppercase tracking-wider rounded-full border border-black/5 shadow-xs">
                  {product.kategori?.nama_kategori || 'Perabotan Kos'}
                </span>
              </div>

              {/* Left / Right Carousel Controls */}
              {images.length > 1 && (
                <>
                  <button 
                    suppressHydrationWarning
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-[#0C1D32] hover:bg-[#0C1D32] hover:text-white flex items-center justify-center transition-all shadow-md"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button 
                    suppressHydrationWarning
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-[#0C1D32] hover:bg-[#0C1D32] hover:text-white flex items-center justify-center transition-all shadow-md"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip Gallery */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 mt-4 overflow-x-auto w-full py-1 scrollbar-hide">
                {images.map((imgUrl: string, idx: number) => (
                  <button
                    key={idx}
                    suppressHydrationWarning
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImageIndex === idx 
                        ? 'border-[#0C1D32] scale-105 shadow-xs' 
                        : 'border-[#D9E2E9] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Title, Pricing, Metadata Card, Delivery Options & Order Breakdown */}
          <div className="lg:col-span-6 flex flex-col justify-start">
            
            {/* 1. Title (No Rating & No Location Header) */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0C1D32] tracking-tight uppercase leading-tight mb-3">
              {product.nama_barang}
            </h1>

            {/* 2. Product Price Tag */}
            <div className="mb-5">
              <span className="text-3xl sm:text-4xl font-black text-[#0C1D32] tracking-tight">
                Rp {product.harga_jual ? product.harga_jual.toLocaleString('id-ID') : 0}
              </span>
              <span className="text-xs font-medium text-gray ml-2.5">
                (Sudah termasuk garansi transaksi aman)
              </span>
            </div>

            {/* 3. Product Metadata Card (Positioned directly below top price) */}
            <div className="bg-[#F8F9FA] p-5 rounded-2xl border border-[#D9E2E9] text-xs space-y-2.5 mb-6 shadow-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray uppercase tracking-wider text-[10px] font-bold">KATEGORI:</span>
                <span className="font-bold text-[#0C1D32]">{product.kategori?.nama_kategori || 'Perabotan Kos'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray uppercase tracking-wider text-[10px] font-bold">ESTIMASI BERAT:</span>
                <span className="font-bold text-[#0C1D32]">{beratKg} kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray uppercase tracking-wider text-[10px] font-bold">PENJUAL:</span>
                <span className="font-bold text-[#0C1D32]">{product.seller?.nama_lengkap || 'Budi Mahasiswa'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray uppercase tracking-wider text-[10px] font-bold">LOKASI KOS PENJUAL:</span>
                <span className="font-bold text-[#0C1D32] text-right max-w-[250px]">{product.seller?.alamat_kos || 'Surabaya'}</span>
              </div>
            </div>

            {/* 4. PILIH OPSI PENGIRIMAN */}
            <div className="mb-6">
              <label className="block text-xs font-extrabold text-[#0C1D32] uppercase tracking-wider mb-3">
                PILIH OPSI PENGIRIMAN:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* COD / Ambil Sendiri */}
                <button
                  suppressHydrationWarning
                  onClick={() => setOpsiPengiriman('AMBIL_SENDIRI')}
                  className={`p-4 rounded-2xl border transition-all text-left flex items-start gap-3 cursor-pointer ${
                    opsiPengiriman === 'AMBIL_SENDIRI'
                      ? 'border-[#0C1D32] bg-[#0C1D32]/5 ring-1 ring-[#0C1D32]'
                      : 'border-[#D9E2E9] bg-white hover:border-gray'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    opsiPengiriman === 'AMBIL_SENDIRI' ? 'bg-[#0C1D32] text-white' : 'bg-[#F0F4F8] text-gray'
                  }`}>
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#0C1D32] uppercase">COD / AMBIL SENDIRI</span>
                    <span className="block text-[10px] text-gray mt-0.5 font-medium">Bebas Ongkir di Kos Penjual</span>
                  </div>
                </button>

                {/* Kurir Platform */}
                <button
                  suppressHydrationWarning
                  onClick={() => setOpsiPengiriman('KURIR')}
                  className={`p-4 rounded-2xl border transition-all text-left flex items-start gap-3 cursor-pointer ${
                    opsiPengiriman === 'KURIR'
                      ? 'border-[#0C1D32] bg-[#0C1D32]/5 ring-1 ring-[#0C1D32]'
                      : 'border-[#D9E2E9] bg-white hover:border-gray'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    opsiPengiriman === 'KURIR' ? 'bg-[#0C1D32] text-white' : 'bg-[#F0F4F8] text-gray'
                  }`}>
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#0C1D32] uppercase">KURIR PLATFORM</span>
                    <span className="block text-[10px] text-gray mt-0.5 font-medium">Diantar Langsung ke Kos</span>
                  </div>
                </button>
              </div>
            </div>

            {/* 5. Price & Shipping Breakdown Card */}
            <div className="bg-[#F8F9FA] p-5 rounded-2xl border border-[#D9E2E9] text-xs mb-6 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#D9E2E9] pb-2">
                <span className="text-[10px] font-extrabold text-gray uppercase tracking-wider">
                  RINCIAN PEMESANAN &amp; HARGA:
                </span>
                {opsiPengiriman === 'KURIR' && (
                  <button
                    type="button"
                    onClick={() => setIsMapOpen(true)}
                    className="px-2.5 py-1 bg-[#007AAD] hover:bg-[#005C82] text-white text-[10px] font-extrabold rounded-lg flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Maps</span>
                  </button>
                )}
              </div>

              {/* Kurir Platform Distance Details */}
              {opsiPengiriman === 'KURIR' && (
                <div className="p-3 bg-[#0C1D32]/5 border border-[#0C1D32]/10 rounded-xl space-y-1.5 text-[11px]">
                  <div className="flex justify-between items-center text-[#0C1D32]">
                    <span className="font-bold flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5 text-[#007AAD]" /> Jarak Akurat Maps:
                    </span>
                    <span className="font-mono font-black text-[#007AAD] text-xs">{realJarakKm} km</span>
                  </div>
                  <div className="flex justify-between items-center text-gray">
                    <span className="font-semibold">Titik Kos Anda:</span>
                    <span className="font-bold text-[#0C1D32] truncate max-w-[200px]">{buyerAddress}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray">
                    <span className="font-semibold">Tarif Kurir:</span>
                    <span className="font-medium text-[#0C1D32]">Rp 2.500/km + Rp 5.000/kg ({beratKg} kg)</span>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center text-gray">
                <span className="font-semibold">Harga Produk:</span>
                <span className="font-bold text-[#0C1D32]">Rp {product.harga_jual ? product.harga_jual.toLocaleString('id-ID') : 0}</span>
              </div>

              <div className="flex justify-between items-center text-gray">
                <span className="font-semibold">
                  {opsiPengiriman === 'KURIR' 
                    ? `Ongkos Kirim Kurir (${realJarakKm} km & ${beratKg} kg):` 
                    : 'Ongkos Kirim (COD Kampus):'}
                </span>
                <span className="font-bold text-[#0C1D32]">
                  {opsiPengiriman === 'KURIR' 
                    ? `+ Rp ${realOngkir.toLocaleString('id-ID')}` 
                    : 'Rp 0 (Gratis COD)'}
                </span>
              </div>

              <div className="pt-3 border-t border-[#D9E2E9] flex justify-between items-center">
                <span className="text-xs font-black text-[#0C1D32] uppercase tracking-wide">Total Pembayaran:</span>
                <span className="text-xl font-black text-[#0C1D32]">
                  Rp {totalHarga.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Error Banner */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  key="product-detail-error-banner"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Wishlist & Share Bar */}
            <div className="flex items-center justify-between text-xs text-gray mb-6 font-bold px-1">
              <button 
                suppressHydrationWarning
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`flex items-center gap-1.5 transition-colors cursor-pointer ${isWishlisted ? 'text-red-500' : 'hover:text-[#0C1D32]'}`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
                <span>{isWishlisted ? 'Tersimpan di Wishlist' : 'Tambah ke Wishlist'}</span>
              </button>

              <button 
                suppressHydrationWarning
                onClick={handleShare}
                className="flex items-center gap-1.5 hover:text-[#0C1D32] transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>{copiedShare ? 'Link Tersalin!' : 'Bagikan Produk'}</span>
              </button>
            </div>

            {/* 6. Button PESAN SEKARANG at Very Bottom */}
            <button
              suppressHydrationWarning
              onClick={handlePesan}
              disabled={loading}
              className="w-full py-4.5 px-8 bg-[#0C1D32] hover:bg-[#007AAD] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-white" />
              <span>{loading ? 'MEMPROSES PESANAN...' : 'PESAN SEKARANG (VIA WA)'}</span>
            </button>

          </div>
        </div>

        {/* Middle Tabs Section: Description vs Seller Info */}
        <div className="mt-16 sm:mt-20">
          <div className="flex border-b border-[#D9E2E9] gap-8 justify-center mb-8">
            <button
              suppressHydrationWarning
              onClick={() => setActiveTab('description')}
              className={`pb-4 text-sm sm:text-base font-black uppercase tracking-wider transition-colors relative ${
                activeTab === 'description' ? 'text-[#0C1D32]' : 'text-gray hover:text-[#0C1D32]'
              }`}
            >
              Deskripsi Lengkap
              {activeTab === 'description' && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0C1D32]" />
              )}
            </button>

            <button
              suppressHydrationWarning
              onClick={() => setActiveTab('seller_info')}
              className={`pb-4 text-sm sm:text-base font-black uppercase tracking-wider transition-colors relative ${
                activeTab === 'seller_info' ? 'text-[#0C1D32]' : 'text-gray hover:text-[#0C1D32]'
              }`}
            >
              Detail Penjual &amp; Garansi
              {activeTab === 'seller_info' && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0C1D32]" />
              )}
            </button>
          </div>

          {/* Tab Content Box */}
          <div className="max-w-4xl mx-auto py-4">
            {activeTab === 'description' ? (
              <div className="text-xs sm:text-sm text-[#1F3047] leading-relaxed space-y-4 font-medium">
                <p>{product.deskripsi}</p>
                <p>
                  Barang kos ini dalam kondisi {product.kondisi?.toLowerCase() || 'baik'} dan siap digunakan. Dijual langsung oleh mahasiswa di sekitar kampus {product.seller?.kampus?.nama_kampus || 'Surabaya'}.
                </p>
              </div>
            ) : (
              <div className="bg-[#F0F4F8] p-6 rounded-2xl border border-[#D9E2E9] space-y-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0C1D32] text-white font-bold flex items-center justify-center">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#0C1D32] uppercase text-sm">{product.seller?.nama_lengkap || 'Budi Mahasiswa'}</h4>
                    <p className="text-gray text-[11px] font-bold uppercase">{product.seller?.kampus?.nama_kampus || 'Mahasiswa Terverifikasi'}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-[#D9E2E9] space-y-2 text-[#1F3047]">
                  <p><strong>Titik Penjemputan / Kos:</strong> {product.seller?.alamat_kos || 'Surabaya'}</p>
                  <p><strong>Sistem Keamanan BaranginAja:</strong> Pembayaran ditampung aman oleh sistem BaranginAja dan baru dicairkan ke penjual setelah pembeli mengonfirmasi barang diterima dengan baik.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Grid Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <div className="text-center mb-10">
              <h2 className="text-xl sm:text-2xl font-black text-[#0C1D32] uppercase tracking-tight mb-2">
                Related products
              </h2>
              {/* Accent line */}
              <div className="flex justify-center items-center gap-1 text-[#007AAD]">
                <span className="w-8 h-0.5 bg-[#007AAD] rounded-full inline-block" />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Map Location Picker Modal */}
      <MapLocationPickerModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        initialLat={buyerLat}
        initialLng={buyerLng}
        initialAddress={buyerAddress}
        onSelectLocation={(data: LocationData) => {
          setBuyerLat(data.lat);
          setBuyerLng(data.lng);
          setBuyerAddress(data.alamat_kos);
        }}
      />
    </div>
  );
}
