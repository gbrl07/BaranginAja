import { prisma } from '@/lib/prisma';

/**
 * Otomatis memeriksa dan membatalkan pesanan yang melebihi batas waktu hold (5 menit)
 * tanpa pembayaran/konfirmasi admin, serta mengembalikan status produk menjadi 'TERSEDIA'.
 */
export async function expireHoldOrders() {
  try {
    const now = new Date();

    // Cari semua order berstatus MENUNGGU_PEMBAYARAN yang hold_expires_at-nya sudah lewat
    const expiredOrders = await prisma.order.findMany({
      where: {
        status: 'MENUNGGU_PEMBAYARAN',
        hold_expires_at: {
          lte: now
        }
      },
      select: {
        id: true,
        product_id: true
      }
    });

    if (expiredOrders.length > 0) {
      const expiredProductIds = expiredOrders.map((o) => o.product_id);
      const expiredOrderIds = expiredOrders.map((o) => o.id);

      // Kembalikan status produk menjadi TERSEDIA
      await prisma.product.updateMany({
        where: {
          id: { in: expiredProductIds },
          status: 'DIPESAN'
        },
        data: {
          status: 'TERSEDIA'
        }
      });

      // Ubah status order menjadi DIBATALKAN
      await prisma.order.updateMany({
        where: {
          id: { in: expiredOrderIds }
        },
        data: {
          status: 'DIBATALKAN'
        }
      });
    }
  } catch (err) {
    console.error('Error expiring hold orders:', err);
  }
}
