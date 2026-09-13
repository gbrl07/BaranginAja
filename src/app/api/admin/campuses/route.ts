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

    const { campusId, nama_kampus, kota, aktif } = await req.json();

    if (!campusId) {
      return NextResponse.json({ error: 'Campus ID wajib diisi.' }, { status: 400 });
    }

    const updateData: any = {};
    if (typeof aktif === 'boolean') updateData.aktif = aktif;
    if (nama_kampus) updateData.nama_kampus = nama_kampus;
    if (kota) updateData.kota = kota;

    const campus = await prisma.campus.update({
      where: { id: campusId },
      data: updateData
    });

    await prisma.activityLog.create({
      data: {
        admin_id: session.id,
        aksi: `Mengubah data/status kampus ${campus.nama_kampus} (Kota: ${campus.kota}, Aktif: ${campus.aktif})`
      }
    });

    return NextResponse.json({ message: 'Data kampus diperbarui.', campus });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal mengupdate kampus.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Akses ditolak.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const campusId = searchParams.get('campusId');

    if (!campusId) {
      return NextResponse.json({ error: 'Campus ID wajib diisi.' }, { status: 400 });
    }

    const campus = await prisma.campus.findUnique({
      where: { id: campusId }
    });

    if (!campus) {
      return NextResponse.json({ error: 'Kampus tidak ditemukan.' }, { status: 404 });
    }

    // Unlink users attached to this campus safely
    await prisma.user.updateMany({
      where: { kampus_id: campusId },
      data: { kampus_id: null }
    });

    await prisma.campus.delete({
      where: { id: campusId }
    });

    await prisma.activityLog.create({
      data: {
        admin_id: session.id,
        aksi: `Menghapus jaringan kampus: ${campus.nama_kampus}`
      }
    });

    return NextResponse.json({ message: 'Kampus berhasil dihapus.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal menghapus kampus.' }, { status: 500 });
  }
}
