import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        nama_lengkap: true,
        email: true,
        role: true,
        is_seller: true,
        no_hp: true,
        kampus_id: true,
        kampus: true,
        alamat_kos: true,
        status_verifikasi: true,
        nama_bank: true,
        no_rekening: true,
        nama_pemilik_rekening: true,
        created_at: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}
