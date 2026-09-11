import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

function calculateMarkup(harga_input: number): number {
  if (harga_input < 50000) {
    return harga_input * 1.20;
  } else if (harga_input < 100000) {
    return harga_input * 1.15;
  } else {
    return harga_input * 1.10;
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('category');
    const search = searchParams.get('search');
    const status = searchParams.get('status') || 'TERSEDIA';

    const whereClause: any = {
      status,
    };

    if (categoryId) {
      whereClause.kategori_id = categoryId;
    }

    if (search) {
      whereClause.nama_barang = {
        contains: search,
      };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        kategori: true,
        seller: {
          select: {
            nama_lengkap: true,
            kampus: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Fetch Products Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || (!session.is_seller && session.role !== 'SELLER')) {
      return NextResponse.json({ error: 'Unauthorized or not a seller' }, { status: 403 });
    }

    const { 
      nama_barang, 
      kategori_id, 
      deskripsi, 
      kondisi, 
      harga_input, 
      berat_kg, 
      foto_urls 
    } = await req.json();

    if (!nama_barang || !kategori_id || !kondisi || !harga_input || !berat_kg) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    const harga_jual = Math.round(calculateMarkup(Number(harga_input)));

    // Fetch seller's coordinate
    const seller = await prisma.user.findUnique({
      where: { id: session.id }
    });

    const product = await prisma.product.create({
      data: {
        seller_id: session.id,
        kategori_id,
        nama_barang,
        deskripsi,
        kondisi,
        harga_input: Number(harga_input),
        harga_jual,
        berat_kg: Number(berat_kg),
        foto_urls: JSON.stringify(foto_urls || []),
        lat: seller?.lat,
        lng: seller?.lng,
        status: 'TERSEDIA'
      }
    });

    return NextResponse.json({ message: 'Produk berhasil ditambahkan', product }, { status: 201 });
  } catch (error) {
    console.error('Create Product Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
