import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Akses ditolak.' }, { status: 403 });
    }

    const activities = await prisma.activityLog.findMany({
      include: {
        admin: {
          select: {
            nama_lengkap: true,
            email: true
          }
        },
        order: {
          select: {
            id: true,
            status: true
          }
        }
      },
      orderBy: { timestamp: 'desc' },
      take: 50
    });

    return NextResponse.json({ activities });
  } catch (error: any) {
    return NextResponse.json({ error: 'Gagal mengambil log aktivitas.' }, { status: 500 });
  }
}
