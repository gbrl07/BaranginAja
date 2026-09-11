import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { nama_lengkap, email, password, no_hp, kampus_id, alamat_kos } = await req.json();

    if (!nama_lengkap || !email || !password || !kampus_id || !alamat_kos) {
      return NextResponse.json(
        { error: 'Semua field wajib diisi' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 }
      );
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        nama_lengkap,
        email,
        password_hash,
        no_hp,
        kampus_id,
        alamat_kos,
        role: 'BUYER', // Default role for new registrations
        status_verifikasi: 'PENDING', // Will be verified manually by admin or auto if MVP
      },
    });

    // Remove password_hash from response
    const { password_hash: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: 'Registrasi berhasil', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan internal server' },
      { status: 500 }
    );
  }
}
