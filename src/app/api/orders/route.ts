import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '@/lib/auth';
import { calculateDistanceKm, calculateOngkirRupiah } from '@/lib/distance';
import { expireHoldOrders } from '@/lib/orderCleanup';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    
    // Otomatis bersihkan order hold yang sudah lewat batas waktu (30 menit)
    await expireHoldOrders();

    const { product_id, opsi_pengiriman } = await req.json();

    if (!product_id || !opsi_pengiriman) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    // Ambil data produk
    const product = await prisma.product.findUnique({
      where: { id: product_id },
      include: { seller: true }
    });

    if (!product || product.status !== 'TERSEDIA') {
      return NextResponse.json({ error: 'Barang tidak tersedia atau sudah dipesan' }, { status: 400 });
    }

    // Ambil data pembeli
    const buyer = await prisma.user.findUnique({
      where: { id: session.id }
    });

    let jarak_km = 0;
    let ongkir = 0;

    if (opsi_pengiriman === 'KURIR') {
      // Calculate real distance using seller & buyer GPS coordinates
      const sellerLat = product.lat || product.seller?.lat || -7.282;
      const sellerLng = product.lng || product.seller?.lng || 112.795;
      const buyerLat = buyer?.lat || -7.284;
      const buyerLng = buyer?.lng || 112.788;

      jarak_km = calculateDistanceKm(sellerLat, sellerLng, buyerLat, buyerLng);
      ongkir = calculateOngkirRupiah(jarak_km, product.berat_kg);
    }

    const total_harga = product.harga_jual + ongkir;

    // Lock the product for 5 mins
    const hold_expires_at = new Date(Date.now() + 5 * 60000);

    // Update status produk
    await prisma.product.update({
      where: { id: product.id },
      data: { status: 'DIPESAN' }
    });

    // Buat order
    const order = await prisma.order.create({
      data: {
        product_id,
        buyer_id: session.id,
        opsi_pengiriman,
        jarak_km: opsi_pengiriman === 'KURIR' ? jarak_km : null,
        ongkir: opsi_pengiriman === 'KURIR' ? ongkir : null,
        total_harga,
        status: 'MENUNGGU_PEMBAYARAN',
        hold_expires_at,
      }
    });

    // Generate teks WhatsApp Template
    const waText = `Halo Admin BaranginAja 👋

Saya ingin memesan barang berikut:

🛍️ Nama Barang: ${product.nama_barang}
🆔 ID Barang: ${product.id}
👤 Penjual: ${product.seller.nama_lengkap} (ID Seller: ${product.seller.id})
🚚 Opsi Pengiriman: ${opsi_pengiriman}
💰 Total Harga: Rp ${total_harga}
🔖 ID Pesanan: ${order.id}

Mohon diproses ya, terima kasih!`;

    const encodedWaText = encodeURIComponent(waText);
    const adminPhone = process.env.ADMIN_PHONE || '6281234567890'; // fallback
    const waLink = `https://wa.me/${adminPhone}?text=${encodedWaText}`;

    return NextResponse.json({ 
      message: 'Pesanan berhasil dibuat', 
      order, 
      waLink 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create Order Error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Harap login terlebih dahulu' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
