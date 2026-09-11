import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Akses ditolak.' }, { status: 403 });
    }

    const payouts = await prisma.payout.findMany({
      include: {
        seller: {
          select: {
            id: true,
            nama_lengkap: true,
            email: true,
            no_hp: true,
            nama_bank: true,
            no_rekening: true,
            nama_pemilik_rekening: true
          }
        },
        order: {
          include: {
            product: true,
            buyer: {
              select: {
                nama_lengkap: true
              }
            }
          }
        },
        admin: {
          select: {
            nama_lengkap: true
          }
        }
      },
      orderBy: { id: 'desc' }
    });

    return NextResponse.json({ payouts });
  } catch (error: any) {
    return NextResponse.json({ error: 'Gagal mengambil data payout.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Akses ditolak.' }, { status: 403 });
    }

    const { payoutId } = await req.json();

    if (!payoutId) {
      return NextResponse.json({ error: 'Payout ID wajib diisi.' }, { status: 400 });
    }

    const payout = await prisma.payout.findUnique({
      where: { id: payoutId },
      include: { seller: true }
    });

    if (!payout) {
      return NextResponse.json({ error: 'Payout tidak ditemukan.' }, { status: 404 });
    }

    const updatedPayout = await prisma.payout.update({
      where: { id: payoutId },
      data: {
        status: 'DICAIRKAN',
        tanggal_dicairkan: new Date(),
        admin_id: session.id
      }
    });

    await prisma.activityLog.create({
      data: {
        admin_id: session.id,
        order_id: payout.order_id,
        aksi: `Mencairkan dana seller Rp ${payout.nominal.toLocaleString('id-ID')} ke ${payout.seller.nama_bank} (${payout.seller.no_rekening}) a.n ${payout.seller.nama_pemilik_rekening}`
      }
    });

    return NextResponse.json({ message: 'Dana berhasil ditandai sudah dicairkan.', payout: updatedPayout });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal memproses pencairan.' }, { status: 500 });
  }
}
