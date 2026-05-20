import { prisma } from '~/server/db';
import { recordAudit } from '~/lib/server/audit';

export async function createReview(
  reviewerId: string,
  data: { boardingHouseId: string; rentalId?: string; rating: number; komentar?: string },
) {
  // Hanya boleh review jika pernah/sedang menyewa di kost tersebut
  const everRented = await prisma.rental.findFirst({
    where: {
      penyewaId: reviewerId,
      room: { boardingHouseId: data.boardingHouseId },
      status: { in: ['AKTIF', 'SELESAI', 'JATUH_TEMPO'] },
    },
  });
  if (!everRented) throw new Error('Hanya penyewa yang dapat memberikan ulasan');

  const review = await prisma.review.create({
    data: {
      boardingHouseId: data.boardingHouseId,
      reviewerId,
      rentalId: data.rentalId,
      rating: data.rating,
      komentar: data.komentar || null,
    },
  });
  await recordAudit({
    userId: reviewerId,
    action: 'CREATE',
    targetModel: 'Review',
    targetId: review.id,
    after: { rating: data.rating },
  });
  return review;
}

export async function listKostReviews(boardingHouseId: string) {
  return prisma.review.findMany({
    where: { boardingHouseId, isApproved: true },
    include: {
      reviewer: {
        select: {
          email: true,
          profile: { select: { namaLengkap: true } },
          avatarAsset: { select: { url: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}
