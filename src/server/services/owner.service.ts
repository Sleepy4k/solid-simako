import { prisma } from '~/server/db';
import { recordAudit } from '~/lib/server/audit';

export async function getOwnerOverview(ownerId: string) {
  const [totalKost, rooms, activeRentals, pendingBookings, latestRentals] = await prisma.$transaction([
    prisma.boardingHouse.count({ where: { ownerId } }),
    prisma.room.findMany({
      where: { boardingHouse: { ownerId } },
      select: { status: true },
    }),
    prisma.rental.count({ where: { room: { boardingHouse: { ownerId } }, status: 'AKTIF' } }),
    prisma.rental.count({
      where: {
        room: { boardingHouse: { ownerId } },
        status: { in: ['MENUNGGU_BAYAR', 'MENUNGGU_VERIF'] },
      },
    }),
    prisma.rental.findMany({
      where: { room: { boardingHouse: { ownerId } } },
      include: {
        room: { include: { boardingHouse: { select: { nama: true } } } },
        penyewa: { select: { profile: { select: { namaLengkap: true } }, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  const totalKamar = rooms.length;
  const kamarTerisi = rooms.filter((r) => r.status === 'TERISI').length;
  const occupancyRate = totalKamar ? (kamarTerisi / totalKamar) * 100 : 0;

  // Pendapatan bulan ini
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const monthRevenue = await prisma.transaction.aggregate({
    where: {
      rental: { room: { boardingHouse: { ownerId } } },
      status: 'LUNAS',
      verifiedAt: { gte: startOfMonth },
    },
    _sum: { nominal: true },
  });

  return {
    totalKost,
    totalKamar,
    kamarTerisi,
    kamarKosong: totalKamar - kamarTerisi,
    occupancyRate: Number(occupancyRate.toFixed(1)),
    activeRentals,
    pendingBookings,
    pendapatanBulanIni: monthRevenue._sum.nominal ?? 0,
    latestRentals,
  };
}

export async function updateOwnerBank(
  ownerId: string,
  data: { namaBank: string; rekeningNo: string; rekeningNama: string },
) {
  await prisma.ownerProfile.upsert({
    where: { userId: ownerId },
    update: data,
    create: { userId: ownerId, ...data },
  });
  await recordAudit({
    userId: ownerId,
    action: 'UPDATE',
    targetModel: 'OwnerProfile',
    targetId: ownerId,
    after: { bank: data.namaBank },
  });
}

export async function uploadOwnerKyc(ownerId: string, ktpAssetId: string) {
  await prisma.ownerProfile.upsert({
    where: { userId: ownerId },
    update: { ktpAssetId, kycStatus: 'MENUNGGU' },
    create: { userId: ownerId, ktpAssetId, kycStatus: 'MENUNGGU' },
  });
  await recordAudit({
    userId: ownerId,
    action: 'UPDATE',
    targetModel: 'OwnerProfile',
    targetId: ownerId,
    after: { kycStatus: 'MENUNGGU' },
  });
}

export async function createBroadcast(
  ownerId: string,
  data: { judul: string; konten: string; boardingHouseId?: string },
) {
  if (data.boardingHouseId) {
    const kost = await prisma.boardingHouse.findFirst({
      where: { id: data.boardingHouseId, ownerId },
    });
    if (!kost) throw new Error('Kost tidak ditemukan');
  }

  const b = await prisma.broadcast.create({
    data: {
      senderId: ownerId,
      judul: data.judul,
      konten: data.konten,
      boardingHouseId: data.boardingHouseId,
    },
  });
  await recordAudit({
    userId: ownerId,
    action: 'CREATE',
    targetModel: 'Broadcast',
    targetId: b.id,
  });
  return b;
}

export async function listOwnerBroadcasts(ownerId: string) {
  return prisma.broadcast.findMany({
    where: { senderId: ownerId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}

export async function getOwnerFinanceReport(ownerId: string, year: number) {
  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);

  const transactions = await prisma.transaction.findMany({
    where: {
      rental: { room: { boardingHouse: { ownerId } } },
      status: 'LUNAS',
      verifiedAt: { gte: start, lt: end },
    },
    select: { nominal: true, verifiedAt: true, tipe: true },
  });

  const byMonth = Array.from({ length: 12 }, () => 0);
  let total = 0;
  for (const t of transactions) {
    if (!t.verifiedAt) continue;
    byMonth[t.verifiedAt.getMonth()] += t.nominal;
    total += t.nominal;
  }
  return { byMonth, total, count: transactions.length };
}
