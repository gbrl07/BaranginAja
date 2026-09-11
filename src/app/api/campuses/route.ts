import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const campuses = await prisma.campus.findMany({
      where: { aktif: true },
      orderBy: { nama_kampus: 'asc' }
    });
    return NextResponse.json(campuses);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
