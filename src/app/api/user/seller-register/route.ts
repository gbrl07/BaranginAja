import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Harap login terlebih dahulu.' }, { status: 401 });
    }

    const { no_hp, alamat_kos, nama_bank, no_rekening, nama_pemilik_rekening } = await req.json();

    if (!no_hp || !alamat_kos || !nama_bank || !no_rekening || !nama_pemilik_rekening) {
      return NextResponse.json({ error: 'Semua rincian pendaftaran seller wajib diisi.' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.id },
      data: {
        is_seller: true,
        role: session.role === 'ADMIN' ? 'ADMIN' : 'SELLER',
        no_hp,
        alamat_kos,
        nama_bank,
        no_rekening,
        nama_pemilik_rekening,
        status_verifikasi: 'VERIFIED'
      },
      select: {
        id: true,
        nama_lengkap: true,
        email: true,
        role: true,
        is_seller: true,
        no_hp: true,
        alamat_kos: true,
        nama_bank: true,
        no_rekening: true,
        nama_pemilik_rekening: true
      }
    });

    return NextResponse.json({
      message: 'Selamat! Pendaftaran penjual berhasil. Anda sekarang dapat menjual barang bekas di BaranginAja.',
      user: updatedUser
    });
  } catch (error: any) {
    console.error('Seller Register Error:', error);
    return NextResponse.json({ error: error.message || 'Gagal mendaftar sebagai seller.' }, { status: 500 });
  }
}
