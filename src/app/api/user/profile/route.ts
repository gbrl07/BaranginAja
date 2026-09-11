import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: {
        kampus: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    // Omit password hash
    const { password_hash, ...userProfile } = user;

    // Fetch user stats
    const ordersCount = await prisma.order.count({
      where: { buyer_id: session.id },
    });

    const productsCount = await prisma.product.count({
      where: { seller_id: session.id },
    });

    const totalPayouts = await prisma.payout.aggregate({
      where: { 
        seller_id: session.id,
        status: 'DICAIRKAN'
      },
      _sum: {
        nominal: true
      }
    });

    const campuses = await prisma.campus.findMany({
      where: { aktif: true },
      orderBy: { nama_kampus: 'asc' }
    });

    return NextResponse.json({
      profile: userProfile,
      stats: {
        ordersCount,
        productsCount,
        payoutEarned: totalPayouts._sum.nominal || 0,
      },
      campuses,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { 
      nama_lengkap, 
      no_hp, 
      kampus_id, 
      alamat_kos, 
      nama_bank, 
      no_rekening, 
      nama_pemilik_rekening,
      old_password,
      new_password
    } = body;

    const existingUser = await prisma.user.findUnique({
      where: { id: session.id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    const updateData: any = {
      nama_lengkap: nama_lengkap || existingUser.nama_lengkap,
      no_hp: no_hp !== undefined ? no_hp : existingUser.no_hp,
      kampus_id: kampus_id || existingUser.kampus_id,
      alamat_kos: alamat_kos !== undefined ? alamat_kos : existingUser.alamat_kos,
      lat: body.lat !== undefined ? Number(body.lat) : existingUser.lat,
      lng: body.lng !== undefined ? Number(body.lng) : existingUser.lng,
      nama_bank: nama_bank !== undefined ? nama_bank : existingUser.nama_bank,
      no_rekening: no_rekening !== undefined ? no_rekening : existingUser.no_rekening,
      nama_pemilik_rekening: nama_pemilik_rekening !== undefined ? nama_pemilik_rekening : existingUser.nama_pemilik_rekening,
    };

    // If updating password
    if (new_password) {
      if (!old_password) {
        return NextResponse.json({ error: 'Password lama wajib diisi untuk mengubah password' }, { status: 400 });
      }

      const isPasswordValid = await bcrypt.compare(old_password, existingUser.password_hash);
      if (!isPasswordValid) {
        return NextResponse.json({ error: 'Password lama tidak sesuai' }, { status: 400 });
      }

      if (new_password.length < 6) {
        return NextResponse.json({ error: 'Password baru minimal 6 karakter' }, { status: 400 });
      }

      updateData.password_hash = await bcrypt.hash(new_password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.id },
      data: updateData,
      include: {
        kampus: true,
      },
    });

    const { password_hash, ...profileWithoutPassword } = updatedUser;

    return NextResponse.json({
      message: 'Profil berhasil diperbarui',
      profile: profileWithoutPassword,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Gagal memperbarui profil' }, { status: 500 });
  }
}
