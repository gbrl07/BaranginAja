import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Akses ditolak. Khusus Admin.' }, { status: 403 });
    }

    const { id } = await params;
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json({ error: 'Status wajib diisi' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: { product: true }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order tidak ditemukan' }, { status: 404 });
    }

    const updateData: any = { status };

    if (status === 'DIBAYAR') {
      updateData.paid_at = new Date();
      // Update product to TERJUAL
      await prisma.product.update({
        where: { id: order.product_id },
        data: { status: 'TERJUAL' }
      });
    } else if (status === 'DIBATALKAN') {
      // Revert product status back to TERSEDIA
      await prisma.product.update({
        where: { id: order.product_id },
        data: { status: 'TERSEDIA' }
      });
    }

    if (status === 'SELESAI') {
      updateData.completed_at = new Date();
      // Buat Payout jika belum ada
      const existingPayout = await prisma.payout.findFirst({
        where: { order_id: order.id }
      });

      if (!existingPayout) {
        await prisma.payout.create({
          data: {
            order_id: order.id,
            seller_id: order.product.seller_id,
            nominal: order.product.harga_input,
            status: 'MENUNGGU_PENCAIRAN'
          }
        });
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData
    });

    // Catat ActivityLog
    await prisma.activityLog.create({
      data: {
        admin_id: session.id,
        order_id: id,
        aksi: `Update status order menjadi ${status}`
      }
    });

    return NextResponse.json({ message: 'Status order berhasil diperbarui', order: updatedOrder });

  } catch (error: any) {
    console.error('Update Order Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
