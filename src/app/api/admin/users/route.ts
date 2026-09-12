import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

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
        kampus_id: true,
        lat: true,
        lng: true,
        status_verifikasi: true,
        is_seller: true,
        role: true,
        no_rekening: true,
        nama_bank: true,
        nama_pemilik_rekening: true,
        created_at: true,
        kampus: {
          select: {
            id: true,
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

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Akses ditolak.' }, { status: 403 });
    }

    const {
      nama_lengkap,
      email,
      password,
      no_hp,
      alamat_kos,
      kampus_id,
      role = 'BUYER',
      status_verifikasi = 'VERIFIED',
      is_seller = false,
      nama_bank,
      no_rekening,
      nama_pemilik_rekening
    } = await req.json();

    if (!nama_lengkap || !email || !password) {
      return NextResponse.json({ error: 'Nama lengkap, email, dan password wajib diisi.' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email sudah terdaftar.' }, { status: 400 });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        nama_lengkap,
        email,
        password_hash,
        no_hp: no_hp || null,
        alamat_kos: alamat_kos || null,
        kampus_id: kampus_id || null,
        role,
        status_verifikasi,
        is_seller,
        nama_bank: nama_bank || null,
        no_rekening: no_rekening || null,
        nama_pemilik_rekening: nama_pemilik_rekening || null
      }
    });

    await prisma.activityLog.create({
      data: {
        admin_id: session.id,
        aksi: `Menambahkan akun baru: ${user.email} (Role: ${role})`
      }
    });

    const { password_hash: _, ...userWithoutPassword } = user;
    return NextResponse.json({ message: 'Akun berhasil dibuat.', user: userWithoutPassword }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal membuat akun baru.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Akses ditolak.' }, { status: 403 });
    }

    const {
      userId,
      nama_lengkap,
      email,
      password,
      no_hp,
      alamat_kos,
      kampus_id,
      role,
      status_verifikasi,
      is_seller,
      nama_bank,
      no_rekening,
      nama_pemilik_rekening
    } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID wajib diisi.' }, { status: 400 });
    }

    const updateData: any = {};
    if (nama_lengkap !== undefined) updateData.nama_lengkap = nama_lengkap;
    if (email !== undefined) updateData.email = email;
    if (no_hp !== undefined) updateData.no_hp = no_hp;
    if (alamat_kos !== undefined) updateData.alamat_kos = alamat_kos;
    if (kampus_id !== undefined) updateData.kampus_id = kampus_id || null;
    if (role !== undefined) updateData.role = role;
    if (status_verifikasi !== undefined) updateData.status_verifikasi = status_verifikasi;
    if (typeof is_seller === 'boolean') updateData.is_seller = is_seller;
    if (nama_bank !== undefined) updateData.nama_bank = nama_bank;
    if (no_rekening !== undefined) updateData.no_rekening = no_rekening;
    if (nama_pemilik_rekening !== undefined) updateData.nama_pemilik_rekening = nama_pemilik_rekening;

    if (password && password.trim() !== '') {
      updateData.password_hash = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    await prisma.activityLog.create({
      data: {
        admin_id: session.id,
        aksi: `Memperbarui akun user ${user.email} (${Object.keys(updateData).join(', ')})`
      }
    });

    const { password_hash: _, ...userWithoutPassword } = user;
    return NextResponse.json({ message: 'Akun berhasil diperbarui.', user: userWithoutPassword });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal mengupdate user.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Akses ditolak.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID wajib diisi.' }, { status: 400 });
    }

    if (userId === session.id) {
      return NextResponse.json({ error: 'Anda tidak bisa menghapus akun Anda sendiri.' }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User tidak ditemukan.' }, { status: 404 });
    }

    await prisma.user.delete({
      where: { id: userId }
    });

    await prisma.activityLog.create({
      data: {
        admin_id: session.id,
        aksi: `Menghapus akun user ${targetUser.email} (${targetUser.nama_lengkap})`
      }
    });

    return NextResponse.json({ message: `Akun ${targetUser.nama_lengkap} berhasil dihapus.` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal menghapus user.' }, { status: 500 });
  }
}
