import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductDetailClient from './ProductDetailClient';

export default async function ProductPage({ params }: { params: { id: string } }) {
  // Await params based on next 15 guidelines
  const { id } = await params;
  
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      kategori: true,
      seller: {
        include: {
          kampus: true
        }
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Fetch related products in the same category or overall active products
  let relatedProducts = await prisma.product.findMany({
    where: {
      status: 'TERSEDIA',
      id: { not: product.id },
      kategori_id: product.kategori_id
    },
    include: {
      kategori: true,
      seller: {
        include: { kampus: true }
      }
    },
    take: 4
  });

  // Fallback if not enough in same category
  if (relatedProducts.length < 4) {
    const extra = await prisma.product.findMany({
      where: {
        status: 'TERSEDIA',
        id: { notIn: [product.id, ...relatedProducts.map(p => p.id)] }
      },
      include: {
        kategori: true,
        seller: {
          include: { kampus: true }
        }
      },
      take: 4 - relatedProducts.length
    });
    relatedProducts = [...relatedProducts, ...extra];
  }

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
