import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
  try {
    // Delete in correct relational dependency order
    await prisma.activityLog.deleteMany({});
    await prisma.payout.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.product.deleteMany({});

    return NextResponse.json({ 
      success: true, 
      message: 'Seluruh data transaksi, pesanan, pencairan, dan produk berhasil dikosongkan.' 
    });
  } catch (error: any) {
    console.error('Clear Database Error:', error);
    return NextResponse.json({ 
      error: error.message || 'Gagal mengosongkan database' 
    }, { status: 500 });
  }
}
