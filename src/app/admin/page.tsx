import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminSIMDashboard from '@/components/admin/AdminSIMDashboard';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  // Check admin role authorization
  await requireRole(['ADMIN']);

  // Aggregate Stats
  const totalUsers = await prisma.user.count();
  const totalProducts = await prisma.product.count();
  const pendingOrders = await prisma.order.count({
    where: { status: 'MENUNGGU_PEMBAYARAN' }
  });
  const totalRevenue = await prisma.order.aggregate({
    where: { status: { in: ['DIBAYAR', 'SELESAI'] } },
    _sum: { total_harga: true }
  });

  // Fetch initial collections
  const orders = await prisma.order.findMany({
    include: {
      product: {
        include: {
          seller: {
            select: {
              nama_lengkap: true,
              email: true,
              no_hp: true,
              alamat_kos: true,
              nama_bank: true,
              no_rekening: true,
              nama_pemilik_rekening: true
            }
          }
        }
      },
      buyer: {
        select: {
          nama_lengkap: true,
          email: true,
          no_hp: true,
          alamat_kos: true
        }
      }
    },
    orderBy: { created_at: 'desc' },
    take: 50
  });

  const products = await prisma.product.findMany({
    include: {
      seller: {
        select: {
          nama_lengkap: true,
          email: true,
          kampus: {
            select: {
              nama_kampus: true
            }
          }
        }
      },
      kategori: true
    },
    orderBy: { created_at: 'desc' },
    take: 50
  });

  const users = await prisma.user.findMany({
    select: {
      id: true,
      nama_lengkap: true,
      email: true,
      no_hp: true,
      alamat_kos: true,
      status_verifikasi: true,
      is_seller: true,
      role: true,
      no_rekening: true,
      nama_bank: true,
      nama_pemilik_rekening: true,
      created_at: true,
      kampus: {
        select: {
          nama_kampus: true
        }
      }
    },
    orderBy: { created_at: 'desc' }
  });

  const payouts = await prisma.payout.findMany({
    include: {
      seller: {
        select: {
          id: true,
          nama_lengkap: true,
          email: true,
          no_hp: true,
          nama_bank: true,
          no_rekening: true,
          nama_pemilik_rekening: true
        }
      },
      order: {
        include: {
          product: true,
          buyer: {
            select: {
              nama_lengkap: true
            }
          }
        }
      }
    },
    orderBy: { id: 'desc' }
  });

  const campuses = await prisma.campus.findMany({
    include: {
      _count: {
        select: { users: true }
      }
    },
    orderBy: { nama_kampus: 'asc' }
  });

  const activities = await prisma.activityLog.findMany({
    include: {
      admin: {
        select: {
          nama_lengkap: true,
          email: true
        }
      }
    },
    orderBy: { timestamp: 'desc' },
    take: 50
  });

  // Serialize JSON safe for client component props
  const serializedStats = {
    totalUsers,
    totalProducts,
    pendingOrders,
    totalRevenue: totalRevenue._sum.total_harga || 0
  };

  return (
    <AdminSIMDashboard
      initialStats={serializedStats}
      initialOrders={JSON.parse(JSON.stringify(orders))}
      initialProducts={JSON.parse(JSON.stringify(products))}
      initialUsers={JSON.parse(JSON.stringify(users))}
      initialPayouts={JSON.parse(JSON.stringify(payouts))}
      initialCampuses={JSON.parse(JSON.stringify(campuses))}
      initialActivities={JSON.parse(JSON.stringify(activities))}
    />
  );
}
