import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Akses ditolak.' }, { status: 403 });
    }

    const campuses = await prisma.campus.findMany({
      include: {
        _count: {
          select: { users: true }
        }
      },
      orderBy: { nama_kampus: 'asc' }
    });

    return NextResponse.json({ campuses });
  } catch (error: any) {
    return NextResponse.json({ error: 'Gagal mengambil data kampus.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Akses ditolak.' }, { status: 403 });
    }

    const { nama_kampus, kota } = await req.json();

    if (!nama_kampus) {
      return NextResponse.json({ error: 'Nama kampus wajib diisi.' }, { status: 400 });
    }

    const campus = await prisma.campus.create({
      data: {
        nama_kampus,
        kota: kota || 'Surabaya',
        aktif: true
      }
    });

    await prisma.activityLog.create({
      data: {
        admin_id: session.id,
        aksi: `Menambah jaringan kampus baru: ${nama_kampus} (${campus.kota})`
      }
    });

    return NextResponse.json({ message: 'Kampus berhasil ditambahkan.', campus });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal membuat kampus baru.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Akses ditolak.' }, { status: 403 });
    }

    const { campusId, aktif, nama_kampus } = await req.json();

    if (!campusId) {
      return NextResponse.json({ error: 'Campus ID wajib diisi.' }, { status: 400 });
    }

    const updateData: any = {};
    if (typeof aktif === 'boolean') updateData.aktif = aktif;
    if (nama_kampus) updateData.nama_kampus = nama_kampus;

    const campus = await prisma.campus.update({
      where: { id: campusId },
      data: updateData
    });

    await prisma.activityLog.create({
      data: {
        admin_id: session.id,
        aksi: `Mengubah status/nama kampus ${campus.nama_kampus} (aktif=${campus.aktif})`
      }
    });

    return NextResponse.json({ message: 'Data kampus diperbarui.', campus });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal mengupdate kampus.' }, { status: 500 });
  }
}
