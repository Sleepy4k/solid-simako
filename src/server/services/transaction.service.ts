import type { TransactionStatus } from '@prisma/client';
import { prisma } from '~/server/db';
import { recordAudit } from '~/lib/server/audit';

export async function uploadTransactionProof(
  penyewaId: string,
  transactionId: string,
  assetId: string,
  nomorReferensi?: string,
  namaBank?: string,
) {
  const trx = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: { rental: true },
  });
  if (!trx || trx.rental.penyewaId !== penyewaId) throw new Error('Transaksi tidak ditemukan');
  if (trx.status === 'LUNAS') throw new Error('Transaksi sudah lunas');

  await prisma.$transaction([
    prisma.transaction.update({
      where: { id: transactionId },
      data: {
        buktiAssetId: assetId,
        nomorReferensi: nomorReferensi || null,
        namaBank: namaBank || null,
        status: 'MENUNGGU_VERIF',
      },
    }),
    prisma.rental.update({
      where: { id: trx.rentalId },
      data: { status: 'MENUNGGU_VERIF' },
    }),
  ]);

  await recordAudit({
    userId: penyewaId,
    action: 'UPDATE',
    targetModel: 'Transaction',
    targetId: transactionId,
    after: { status: 'MENUNGGU_VERIF' },
  });
}

export async function listUserTransactions(penyewaId: string) {
  return prisma.transaction.findMany({
    where: { rental: { penyewaId } },
    include: {
      rental: {
        include: {
          room: { include: { boardingHouse: { select: { nama: true, slug: true } } } },
        },
      },
      buktiAsset: { select: { url: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function listOwnerTransactions(ownerId: string, status?: TransactionStatus) {
  return prisma.transaction.findMany({
    where: {
      rental: { room: { boardingHouse: { ownerId } } },
      ...(status && { status }),
    },
    include: {
      rental: {
        include: {
          penyewa: { select: { email: true, profile: { select: { namaLengkap: true } } } },
          room: { include: { boardingHouse: { select: { nama: true } } } },
        },
      },
      buktiAsset: { select: { url: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function ownerVerifyTransaction(
  ownerId: string,
  transactionId: string,
  approve: boolean,
  rejectionNote?: string,
) {
  const trx = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: { rental: { include: { room: { include: { boardingHouse: true } } } } },
  });
  if (!trx || trx.rental.room.boardingHouse.ownerId !== ownerId) {
    throw new Error('Transaksi tidak ditemukan');
  }

  if (approve) {
    await prisma.$transaction([
      prisma.transaction.update({
        where: { id: transactionId },
        data: { status: 'LUNAS', verifiedById: ownerId, verifiedAt: new Date() },
      }),
      ...(trx.tipe === 'BOOKING'
        ? [
            prisma.rental.update({ where: { id: trx.rentalId }, data: { status: 'AKTIF' } }),
            prisma.room.update({
              where: { id: trx.rental.roomId },
              data: { status: 'TERISI' },
            }),
          ]
        : []),
    ]);
  } else {
    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: 'DITOLAK',
        verifiedById: ownerId,
        verifiedAt: new Date(),
        rejectionNote: rejectionNote || 'Bukti tidak valid',
      },
    });
  }

  await recordAudit({
    userId: ownerId,
    action: approve ? 'APPROVE' : 'REJECT',
    targetModel: 'Transaction',
    targetId: transactionId,
  });
}

export async function createRenewalTransaction(ownerId: string, rentalId: string, nominal: number) {
  const rental = await prisma.rental.findUnique({
    where: { id: rentalId },
    include: { room: { include: { boardingHouse: true } } },
  });
  if (!rental || rental.room.boardingHouse.ownerId !== ownerId) {
    throw new Error('Sewa tidak ditemukan');
  }

  const periodeAwal = new Date();
  const periodeAkhir = new Date(periodeAwal);
  periodeAkhir.setMonth(periodeAkhir.getMonth() + 1);

  await prisma.transaction.create({
    data: {
      rentalId,
      tipe: 'PERPANJANGAN',
      nominal,
      periodeAwal,
      periodeAkhir,
      batasTransfer: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      status: 'MENUNGGU_BUKTI',
    },
  });

  await recordAudit({
    userId: ownerId,
    action: 'CREATE',
    targetModel: 'Transaction',
    targetId: rentalId,
  });
}
