'use client';

import Link from 'next/link';
import { Heart, Star } from 'lucide-react';

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  let images: string[] = [];
  try {
    images = product.foto_urls ? JSON.parse(product.foto_urls) : [];
  } catch (e) {
    images = [];
  }
  const thumbnail = images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80';

  return (
    <Link 
      href={`/products/${product.id}`}
      className="group flex flex-col h-full transform transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] w-full rounded-[20px] bg-base-light mb-4 overflow-hidden flex items-center justify-center">
        <img 
          src={thumbnail} 
          alt={product.nama_barang}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-[20px]"
        />
        
        {/* Mock Heart Icon */}
        <button 
          suppressHydrationWarning
          onClick={(e) => e.preventDefault()} 
          className="absolute top-4 right-4 p-2 rounded-full bg-white/70 backdrop-blur-md text-gray-dark hover:text-red-500 transition-colors z-10 shadow-xs"
        >
          <Heart className="w-4 h-4" />
        </button>

        {product.kondisi && (
          <div className="absolute top-4 left-4 bg-base-white/85 backdrop-blur-md px-2.5 py-1 rounded-full shadow-xs">
            <p className="text-[9px] font-bold text-gray-dark uppercase tracking-wider">{product.kondisi}</p>
          </div>
        )}
      </div>
      
      <div className="flex flex-col flex-1 px-1">
        <h3 className="text-xs font-bold text-base-dark tracking-wide uppercase line-clamp-1 mb-1">
          {product.nama_barang}
        </h3>
        <p className="text-[11px] text-gray mb-3 line-clamp-1">
          {product.seller?.kampus?.nama_kampus || 'Kampus Surabaya'}
        </p>
        
        <div className="mt-auto flex items-center gap-3">
          <p className="text-sm font-black text-base-dark">
            Rp {product.harga_jual ? product.harga_jual.toLocaleString('id-ID') : 0}
          </p>
          <div className="flex items-center gap-1 text-[10px] font-bold text-gray">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>4.8</span>
          </div>
        </div>
      </div>
    </Link>
  );
}


