import type { RentalStatus } from '@prisma/client';
import { prisma } from '~/server/db';
import { recordAudit } from '~/lib/server/audit';
import type { CreateBookingInput } from '~/lib/shared/validation';

export async function createBooking(penyewaId: string, input: CreateBookingInput) {
  const room = await prisma.room.findUnique({
    where: { id: input.roomId },
    include: { boardingHouse: { select: { id: true, ownerId: true, nama: true } } },
  });
  if (!room) throw new Error('Kamar tidak ditemukan');
  if (room.status !== 'TERSEDIA') throw new Error('Kamar tidak tersedia untuk disewa');
  if (room.boardingHouse.ownerId === penyewaId) {
    throw new Error('Tidak dapat menyewa properti milik sendiri');
  }

  const tanggalMulai = new Date(input.tanggalMulai);
  const tanggalAkhir = new Date(tanggalMulai);
  tanggalAkhir.setMonth(tanggalAkhir.getMonth() + input.durasiBulan);

  const nominal = room.hargaBulan * input.durasiBulan;
  const batas = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 jam

  const result = await prisma.$transaction(async (tx) => {
    const rental = await tx.rental.create({
      data: {
        roomId: room.id,
        penyewaId,
        tanggalMulai,
        tanggalAkhir,
        hargaDisetujui: nominal,
        status: 'MENUNGGU_BAYAR',
        catatan: input.catatan || null,
      },
    });

    const trx = await tx.transaction.create({
      data: {
        rentalId: rental.id,
        tipe: 'BOOKING',
        nominal,
        periodeAwal: tanggalMulai,
        periodeAkhir: tanggalAkhir,
        batasTransfer: batas,
        status: 'MENUNGGU_BUKTI',
      },
    });

    return { rental, transactionId: trx.id };
  });

  await recordAudit({
    userId: penyewaId,
    action: 'CREATE',
    targetModel: 'Rental',
    targetId: result.rental.id,
    after: { roomId: room.id, nominal, durasi: input.durasiBulan },
  });

  return result;
}

export async function listUserRentals(penyewaId: string) {
  return prisma.rental.findMany({
    where: { penyewaId },
    include: {
      room: {
        include: {
          boardingHouse: {
            select: {
              id: true,
              nama: true,
              slug: true,
              kota: true,
              images: {
                where: { isCover: true },
                take: 1,
                include: { asset: { select: { url: true } } },
              },
            },
          },
        },
      },
      transactions: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getActiveRental(penyewaId: string) {
  return prisma.rental.findFirst({
    where: { penyewaId, status: 'AKTIF' },
    include: {
      room: {
        include: {
          boardingHouse: {
            select: {
              id: true,
              nama: true,
              slug: true,
              kota: true,
              alamat: true,
              owner: {
                select: {
                  id: true,
                  profile: { select: { namaLengkap: true, telepon: true } },
                  ownerProfile: {
                    select: { namaBank: true, rekeningNo: true, rekeningNama: true },
                  },
                },
              },
              images: {
                where: { isCover: true },
                take: 1,
                include: { asset: { select: { url: true } } },
              },
            },
          },
        },
      },
      transactions: { orderBy: { createdAt: 'desc' } },
    },
  });
}

// Owner verification list
export async function listOwnerBookings(ownerId: string, status?: RentalStatus) {
  return prisma.rental.findMany({
    where: {
      room: { boardingHouse: { ownerId } },
      ...(status && { status }),
    },
    include: {
      room: {
        include: { boardingHouse: { select: { nama: true } } },
      },
      penyewa: {
        select: {
          id: true,
          email: true,
          profile: { select: { namaLengkap: true, telepon: true } },
          avatarAsset: { select: { url: true } },
        },
      },
      transactions: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: { buktiAsset: { select: { url: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function approveBooking(ownerId: string, rentalId: string) {
  const rental = await prisma.rental.findUnique({
    where: { id: rentalId },
    include: { room: { include: { boardingHouse: true } }, transactions: true },
  });
  if (!rental || rental.room.boardingHouse.ownerId !== ownerId) {
    throw new Error('Booking tidak ditemukan');
  }
  const tx = rental.transactions[rental.transactions.length - 1];
  if (!tx || tx.status !== 'MENUNGGU_VERIF') {
    throw new Error('Tidak ada bukti transfer untuk diverifikasi');
  }

  await prisma.$transaction([
    prisma.transaction.update({
      where: { id: tx.id },
      data: { status: 'LUNAS', verifiedById: ownerId, verifiedAt: new Date() },
    }),
    prisma.rental.update({ where: { id: rentalId }, data: { status: 'AKTIF' } }),
    prisma.room.update({ where: { id: rental.roomId }, data: { status: 'TERISI' } }),
  ]);

  await recordAudit({
    userId: ownerId,
    action: 'APPROVE',
    targetModel: 'Rental',
    targetId: rentalId,
  });
}

export async function rejectBooking(ownerId: string, rentalId: string, alasan: string) {
  const rental = await prisma.rental.findUnique({
    where: { id: rentalId },
    include: { room: { include: { boardingHouse: true } }, transactions: true },
  });
  if (!rental || rental.room.boardingHouse.ownerId !== ownerId) {
    throw new Error('Booking tidak ditemukan');
  }
  const tx = rental.transactions[rental.transactions.length - 1];
  await prisma.$transaction([
    ...(tx
      ? [
          prisma.transaction.update({
            where: { id: tx.id },
            data: { status: 'DITOLAK', rejectionNote: alasan, verifiedById: ownerId },
          }),
        ]
      : []),
    prisma.rental.update({
      where: { id: rentalId },
      data: { status: 'DIBATALKAN', catatan: alasan },
    }),
  ]);

  await recordAudit({
    userId: ownerId,
    action: 'REJECT',
    targetModel: 'Rental',
    targetId: rentalId,
    after: { alasan },
  });
}

export async function checkoutTenant(ownerId: string, rentalId: string) {
  const rental = await prisma.rental.findUnique({
    where: { id: rentalId },
    include: { room: { include: { boardingHouse: true } } },
  });
  if (!rental || rental.room.boardingHouse.ownerId !== ownerId) {
    throw new Error('Sewa tidak ditemukan');
  }

  await prisma.$transaction([
    prisma.rental.update({ where: { id: rentalId }, data: { status: 'SELESAI' } }),
    prisma.room.update({ where: { id: rental.roomId }, data: { status: 'TERSEDIA' } }),
  ]);

  await recordAudit({
    userId: ownerId,
    action: 'UPDATE',
    targetModel: 'Rental',
    targetId: rentalId,
    after: { status: 'SELESAI' },
  });
}

export async function listOwnerActiveTenants(ownerId: string) {
  return prisma.rental.findMany({
    where: { room: { boardingHouse: { ownerId } }, status: 'AKTIF' },
    include: {
      room: { include: { boardingHouse: { select: { nama: true } } } },
      penyewa: {
        select: {
          id: true,
          email: true,
          profile: { select: { namaLengkap: true, telepon: true } },
        },
      },
      transactions: { where: { tipe: 'PERPANJANGAN' }, orderBy: { createdAt: 'desc' }, take: 1 },
    },
  });
}
