import type { KycStatus, UserRole } from '@prisma/client';
import { prisma } from '~/server/db';
import { recordAudit } from '~/lib/server/audit';

export async function getAdminOverview() {
  const [
    totalUsers,
    totalOwners,
    totalKost,
    activeRentals,
    pendingKyc,
    openDisputes,
  ] = await prisma.$transaction([
    prisma.user.count({ where: { role: { name: 'PENYEWA' } } }),
    prisma.user.count({ where: { role: { name: 'MITRA' } } }),
    prisma.boardingHouse.count({ where: { isActive: true } }),
    prisma.rental.count({ where: { status: 'AKTIF' } }),
    prisma.ownerProfile.count({ where: { kycStatus: 'MENUNGGU' } }),
    prisma.complaint.count({ where: { status: { in: ['TERBUKA', 'DIPROSES'] } } }),
  ]);

  // GMV bulanan 6 bulan terakhir
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const transactions = await prisma.transaction.findMany({
    where: { status: 'LUNAS', verifiedAt: { gte: sixMonthsAgo } },
    select: { nominal: true, verifiedAt: true },
  });

  const gmvPerMonth = new Map<string, number>();
  for (const t of transactions) {
    if (!t.verifiedAt) continue;
    const key = `${t.verifiedAt.getFullYear()}-${String(t.verifiedAt.getMonth() + 1).padStart(2, '0')}`;
    gmvPerMonth.set(key, (gmvPerMonth.get(key) ?? 0) + t.nominal);
  }

  return {
    totalUsers,
    totalOwners,
    totalKost,
    activeRentals,
    pendingKyc,
    openDisputes,
    gmvSeries: Array.from(gmvPerMonth.entries())
      .sort()
      .map(([key, val]) => ({ key, nominal: val })),
  };
}

export async function listPendingKyc(status: KycStatus = 'MENUNGGU') {
  return prisma.ownerProfile.findMany({
    where: { kycStatus: status },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          createdAt: true,
          profile: { select: { namaLengkap: true, telepon: true, alamat: true } },
          avatarAsset: { select: { url: true } },
        },
      },
      ktpAsset: { select: { url: true, originalName: true } },
    },
    orderBy: { updatedAt: 'asc' },
  });
}

export async function decideKyc(
  adminId: string,
  ownerProfileId: string,
  approve: boolean,
  catatan?: string,
) {
  const updated = await prisma.ownerProfile.update({
    where: { id: ownerProfileId },
    data: {
      kycStatus: approve ? 'DISETUJUI' : 'DITOLAK',
      kycNote: catatan || null,
      kycVerifiedAt: new Date(),
    },
  });

  if (approve) {
    await prisma.user.update({ where: { id: updated.userId }, data: { isVerified: true } });
  }

  await recordAudit({
    userId: adminId,
    action: approve ? 'APPROVE' : 'REJECT',
    targetModel: 'OwnerProfile',
    targetId: ownerProfileId,
    after: { kycStatus: updated.kycStatus, catatan },
  });
}

export async function listAllUsers(filter?: {
  role?: UserRole;
  q?: string;
  suspended?: boolean;
}) {
  return prisma.user.findMany({
    where: {
      ...(filter?.role && { role: { name: filter.role } }),
      ...(filter?.suspended !== undefined && { isSuspended: filter.suspended }),
      ...(filter?.q && {
        OR: [
          { email: { contains: filter.q } },
          { profile: { namaLengkap: { contains: filter.q } } },
        ],
      }),
    },
    include: {
      role: { select: { name: true, label: true } },
      profile: { select: { namaLengkap: true, telepon: true } },
      avatarAsset: { select: { url: true } },
      _count: { select: { boardingHouses: true, rentals: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
}

export async function suspendUser(adminId: string, userId: string, alasan: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { isSuspended: true, suspendedAt: new Date(), suspendNote: alasan },
  });
  await recordAudit({
    userId: adminId,
    action: 'SUSPEND',
    targetModel: 'User',
    targetId: userId,
    after: { alasan },
  });
}

export async function unsuspendUser(adminId: string, userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { isSuspended: false, suspendedAt: null, suspendNote: null },
  });
  await recordAudit({
    userId: adminId,
    action: 'UPDATE',
    targetModel: 'User',
    targetId: userId,
    after: { isSuspended: false },
  });
}

export async function listAuditLogs(limit = 100) {
  return prisma.auditLog.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { email: true, profile: { select: { namaLengkap: true } } },
      },
    },
  });
}

export async function listAllProperties() {
  return prisma.boardingHouse.findMany({
    include: {
      owner: { select: { profile: { select: { namaLengkap: true } }, email: true } },
      _count: { select: { rooms: true, wishlists: true } },
      rooms: { select: { status: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
}

export async function listAllTransactions() {
  return prisma.transaction.findMany({
    include: {
      rental: {
        include: {
          penyewa: { select: { profile: { select: { namaLengkap: true } }, email: true } },
          room: { include: { boardingHouse: { select: { nama: true } } } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
}
