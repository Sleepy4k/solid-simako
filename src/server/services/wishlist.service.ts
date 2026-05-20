import { prisma } from '~/server/db';

export async function toggleWishlist(userId: string, boardingHouseId: string) {
  const existing = await prisma.wishlist.findUnique({
    where: { userId_boardingHouseId: { userId, boardingHouseId } },
  });
  if (existing) {
    await prisma.wishlist.delete({
      where: { userId_boardingHouseId: { userId, boardingHouseId } },
    });
    return { saved: false };
  }
  await prisma.wishlist.create({ data: { userId, boardingHouseId } });
  return { saved: true };
}

export async function listUserWishlist(userId: string) {
  const items = await prisma.wishlist.findMany({
    where: { userId },
    include: {
      boardingHouse: {
        include: {
          kampus: { select: { singkatan: true, nama: true } },
          images: {
            where: { isCover: true },
            take: 1,
            include: { asset: { select: { url: true } } },
          },
          rooms: {
            where: { status: 'TERSEDIA' },
            select: { hargaBulan: true },
            orderBy: { hargaBulan: 'asc' },
            take: 1,
          },
          reviews: { select: { rating: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return items.map((w) => {
    const ratings = w.boardingHouse.reviews.map((r) => r.rating);
    const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
    return {
      id: w.boardingHouse.id,
      slug: w.boardingHouse.slug,
      nama: w.boardingHouse.nama,
      kota: w.boardingHouse.kota,
      jenisKelamin: w.boardingHouse.jenisKelamin,
      coverUrl: w.boardingHouse.images[0]?.asset.url ?? null,
      hargaMulai: w.boardingHouse.rooms[0]?.hargaBulan ?? null,
      rating: Number(avg.toFixed(1)),
      totalReview: ratings.length,
    };
  });
}
