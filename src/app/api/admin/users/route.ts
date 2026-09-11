import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Akses ditolak.' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        nama_lengkap: true,
        email: true,
        no_hp: true,
        alamat_kos: true,
        status_verifikasi: true,
        is_seller: true,
        role: true,
        no_rekening: true,
        nama_bank: true,
        nama_pemilik_rekening: true,
        created_at: true,
        kampus: {
          select: {
            nama_kampus: true
          }
        },
        _count: {
          select: {
            products: true,
            ordersAsBuyer: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json({ error: 'Gagal mengambil data user.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Akses ditolak.' }, { status: 403 });
    }

    const { userId, role, status_verifikasi, is_seller } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID wajib diisi.' }, { status: 400 });
    }

    const updateData: any = {};
    if (role) updateData.role = role;
    if (status_verifikasi) updateData.status_verifikasi = status_verifikasi;
    if (typeof is_seller === 'boolean') updateData.is_seller = is_seller;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    await prisma.activityLog.create({
      data: {
        admin_id: session.id,
        aksi: `Update profil/akses user ${user.email} (${JSON.stringify(updateData)})`
      }
    });

    return NextResponse.json({ message: 'User berhasil diperbarui.', user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal mengupdate user.' }, { status: 500 });
  }
}
