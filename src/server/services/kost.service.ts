import type { Prisma, RoomStatus } from '@prisma/client';
import { prisma } from '~/server/db';
import { uniqueSlug } from '~/lib/shared/slug';
import { recordAudit } from '~/lib/server/audit';
import type { KostFormInput } from '~/lib/shared/validation';

export interface KostListQuery {
  q?: string;
  kampusId?: number;
  kota?: string;
  jenisKelamin?: 'PUTRA' | 'PUTRI' | 'CAMPUR';
  hargaMin?: number;
  hargaMax?: number;
  facilities?: number[];
  sort?: 'populer' | 'termurah' | 'termahal' | 'terbaru';
  page?: number;
  limit?: number;
}

const PAGE_SIZE = 12;

export async function listPublicKost(query: KostListQuery) {
  const page = query.page ?? 1;
  const limit = query.limit ?? PAGE_SIZE;

  const where: Prisma.BoardingHouseWhereInput = {
    isPublished: true,
    isActive: true,
    isVerified: true,
    ...(query.q && {
      OR: [
        { nama: { contains: query.q } },
        { kota: { contains: query.q } },
        { alamat: { contains: query.q } },
      ],
    }),
    ...(query.kampusId && { kampusId: query.kampusId }),
    ...(query.kota && { kota: { contains: query.kota } }),
    ...(query.jenisKelamin && { jenisKelamin: query.jenisKelamin }),
    ...(query.facilities &&
      query.facilities.length > 0 && {
        facilities: { some: { facilityId: { in: query.facilities } } },
      }),
    ...((query.hargaMin || query.hargaMax) && {
      rooms: {
        some: {
          status: 'TERSEDIA',
          ...(query.hargaMin && { hargaBulan: { gte: query.hargaMin } }),
          ...(query.hargaMax && { hargaBulan: { lte: query.hargaMax } }),
        },
      },
    }),
  };

  const orderBy: Prisma.BoardingHouseOrderByWithRelationInput = {
    populer: { wishlists: { _count: 'desc' } } as Prisma.BoardingHouseOrderByWithRelationInput,
    terbaru: { createdAt: 'desc' } as Prisma.BoardingHouseOrderByWithRelationInput,
    termurah: { createdAt: 'asc' } as Prisma.BoardingHouseOrderByWithRelationInput,
    termahal: { createdAt: 'desc' } as Prisma.BoardingHouseOrderByWithRelationInput,
  }[query.sort ?? 'populer'];

  const [total, items] = await prisma.$transaction([
    prisma.boardingHouse.count({ where }),
    prisma.boardingHouse.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        kampus: { select: { nama: true, singkatan: true } },
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
        _count: { select: { rooms: true, wishlists: true } },
      },
    }),
  ]);

  return {
    page,
    total,
    pageSize: limit,
    items: items.map((k) => {
      const ratings = k.reviews.map((r) => r.rating);
      const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
      return {
        id: k.id,
        slug: k.slug,
        nama: k.nama,
        kota: k.kota,
        alamat: k.alamat,
        jenisKelamin: k.jenisKelamin,
        kampus: k.kampus,
        coverUrl: k.images[0]?.asset.url ?? null,
        hargaMulai: k.rooms[0]?.hargaBulan ?? null,
        rating: Number(avg.toFixed(1)),
        totalReview: ratings.length,
        totalKamar: k._count.rooms,
        savedCount: k._count.wishlists,
      };
    }),
  };
}

export async function getKostBySlug(slug: string, currentUserId?: string | null) {
  const k = await prisma.boardingHouse.findUnique({
    where: { slug },
    include: {
      owner: {
        select: {
          id: true,
          email: true,
          profile: { select: { namaLengkap: true, telepon: true } },
          ownerProfile: { select: { namaUsaha: true, kycStatus: true } },
          avatarAsset: { select: { url: true } },
        },
      },
      kampus: { select: { nama: true, singkatan: true, kota: true } },
      images: {
        include: { asset: { select: { url: true } } },
        orderBy: { urutan: 'asc' },
      },
      facilities: {
        include: { facility: { select: { id: true, nama: true, icon: true, kategori: true } } },
      },
      rooms: {
        include: {
          facilities: {
            include: { facility: { select: { id: true, nama: true, icon: true } } },
          },
          images: {
            include: { asset: { select: { url: true } } },
            orderBy: { urutan: 'asc' },
            take: 3,
          },
        },
        orderBy: { hargaBulan: 'asc' },
      },
      reviews: {
        where: { isApproved: true },
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
        take: 10,
      },
      _count: { select: { wishlists: true, reviews: true } },
    },
  });

  if (!k) return null;

  let isWishlisted = false;
  if (currentUserId) {
    const w = await prisma.wishlist.findUnique({
      where: { userId_boardingHouseId: { userId: currentUserId, boardingHouseId: k.id } },
    });
    isWishlisted = !!w;
  }

  const ratings = k.reviews.map((r) => r.rating);
  const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

  return {
    id: k.id,
    slug: k.slug,
    nama: k.nama,
    deskripsi: k.deskripsi,
    alamat: k.alamat,
    kota: k.kota,
    kodePos: k.kodePos,
    latitude: k.latitude?.toNumber() ?? null,
    longitude: k.longitude?.toNumber() ?? null,
    jenisKelamin: k.jenisKelamin,
    isVerified: k.isVerified,
    owner: {
      id: k.owner.id,
      nama: k.owner.profile?.namaLengkap ?? k.owner.email,
      avatarUrl: k.owner.avatarAsset?.url ?? null,
      namaUsaha: k.owner.ownerProfile?.namaUsaha ?? null,
      verified: k.owner.ownerProfile?.kycStatus === 'DISETUJUI',
    },
    kampus: k.kampus,
    images: k.images.map((img) => ({ id: img.id, url: img.asset.url, caption: img.caption })),
    facilities: k.facilities.map((f) => f.facility),
    rooms: k.rooms.map((r) => ({
      id: r.id,
      nomorKamar: r.nomorKamar,
      lantai: r.lantai,
      hargaBulan: r.hargaBulan,
      hargaTahun: r.hargaTahun,
      kapasitas: r.kapasitas,
      status: r.status,
      deskripsi: r.deskripsi,
      luasM2: r.luasM2?.toNumber() ?? null,
      facilities: r.facilities.map((f) => f.facility),
      images: r.images.map((i) => i.asset.url),
    })),
    reviews: k.reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      komentar: r.komentar,
      tanggal: r.createdAt,
      reviewer: {
        nama: r.reviewer.profile?.namaLengkap ?? r.reviewer.email,
        avatarUrl: r.reviewer.avatarAsset?.url ?? null,
      },
    })),
    stats: {
      ratingAvg: Number(avg.toFixed(1)),
      totalReview: ratings.length,
      savedCount: k._count.wishlists,
      kamarTersedia: k.rooms.filter((r) => r.status === 'TERSEDIA').length,
      kamarTotal: k.rooms.length,
    },
    isWishlisted,
  };
}

export async function getPopularKost(limit = 6) {
  return listPublicKost({ sort: 'populer', page: 1, limit });
}

// Owner-scoped operations
export async function listOwnerKost(ownerId: string) {
  const items = await prisma.boardingHouse.findMany({
    where: { ownerId },
    include: {
      kampus: { select: { nama: true, singkatan: true } },
      images: {
        where: { isCover: true },
        take: 1,
        include: { asset: { select: { url: true } } },
      },
      _count: { select: { rooms: true } },
      rooms: { select: { status: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return items.map((k) => ({
    id: k.id,
    nama: k.nama,
    slug: k.slug,
    kota: k.kota,
    alamat: k.alamat,
    jenisKelamin: k.jenisKelamin,
    isPublished: k.isPublished,
    isVerified: k.isVerified,
    isActive: k.isActive,
    coverUrl: k.images[0]?.asset.url ?? null,
    totalKamar: k._count.rooms,
    kamarTerisi: k.rooms.filter((r) => r.status === 'TERISI').length,
  }));
}

export async function getOwnerKostDetail(ownerId: string, kostId: string) {
  const k = await prisma.boardingHouse.findFirst({
    where: { id: kostId, ownerId },
    include: {
      facilities: { include: { facility: true } },
      images: { include: { asset: true }, orderBy: { urutan: 'asc' } },
      rooms: {
        orderBy: { nomorKamar: 'asc' },
        include: { _count: { select: { rentals: true } } },
      },
    },
  });
  if (!k) throw new Error('Kost tidak ditemukan');
  return k;
}

export async function createKost(ownerId: string, input: KostFormInput) {
  const slug = uniqueSlug(input.nama);
  const kost = await prisma.boardingHouse.create({
    data: {
      ownerId,
      nama: input.nama,
      slug,
      deskripsi: input.deskripsi || null,
      alamat: input.alamat,
      kota: input.kota,
      kodePos: input.kodePos || null,
      jenisKelamin: input.jenisKelamin,
      kampusId: input.kampusId,
      facilities:
        input.facilities && input.facilities.length
          ? { createMany: { data: input.facilities.map((id) => ({ facilityId: id })) } }
          : undefined,
    },
  });
  await recordAudit({
    userId: ownerId,
    action: 'CREATE',
    targetModel: 'BoardingHouse',
    targetId: kost.id,
    after: { nama: kost.nama, kota: kost.kota },
  });
  return kost;
}

export async function updateKost(ownerId: string, kostId: string, input: KostFormInput) {
  const existing = await prisma.boardingHouse.findFirst({ where: { id: kostId, ownerId } });
  if (!existing) throw new Error('Kost tidak ditemukan');

  const updated = await prisma.$transaction(async (tx) => {
    await tx.boardingHouseFacility.deleteMany({ where: { boardingHouseId: kostId } });
    if (input.facilities && input.facilities.length) {
      await tx.boardingHouseFacility.createMany({
        data: input.facilities.map((id) => ({ boardingHouseId: kostId, facilityId: id })),
      });
    }
    return tx.boardingHouse.update({
      where: { id: kostId },
      data: {
        nama: input.nama,
        deskripsi: input.deskripsi || null,
        alamat: input.alamat,
        kota: input.kota,
        kodePos: input.kodePos || null,
        jenisKelamin: input.jenisKelamin,
        kampusId: input.kampusId,
      },
    });
  });

  await recordAudit({
    userId: ownerId,
    action: 'UPDATE',
    targetModel: 'BoardingHouse',
    targetId: kostId,
    before: existing,
    after: updated,
  });
  return updated;
}

export async function deleteKost(ownerId: string, kostId: string) {
  const existing = await prisma.boardingHouse.findFirst({ where: { id: kostId, ownerId } });
  if (!existing) throw new Error('Kost tidak ditemukan');
  await prisma.boardingHouse.delete({ where: { id: kostId } });
  await recordAudit({
    userId: ownerId,
    action: 'DELETE',
    targetModel: 'BoardingHouse',
    targetId: kostId,
    before: existing,
  });
}

export async function togglePublishKost(ownerId: string, kostId: string) {
  const existing = await prisma.boardingHouse.findFirst({ where: { id: kostId, ownerId } });
  if (!existing) throw new Error('Kost tidak ditemukan');
  const updated = await prisma.boardingHouse.update({
    where: { id: kostId },
    data: { isPublished: !existing.isPublished },
  });
  await recordAudit({
    userId: ownerId,
    action: 'UPDATE',
    targetModel: 'BoardingHouse',
    targetId: kostId,
    after: { isPublished: updated.isPublished },
  });
  return updated;
}

// Room operations (owner-scoped)
export async function listKostRooms(ownerId: string, kostId: string) {
  await getOwnerKostDetail(ownerId, kostId); // ownership check
  return prisma.room.findMany({
    where: { boardingHouseId: kostId },
    orderBy: { nomorKamar: 'asc' },
    include: {
      facilities: { include: { facility: true } },
      rentals: {
        where: { status: 'AKTIF' },
        include: { penyewa: { select: { profile: { select: { namaLengkap: true } } } } },
        take: 1,
      },
    },
  });
}

export async function setRoomStatus(ownerId: string, roomId: string, status: RoomStatus) {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: { boardingHouse: true },
  });
  if (!room || room.boardingHouse.ownerId !== ownerId) throw new Error('Kamar tidak ditemukan');
  await prisma.room.update({ where: { id: roomId }, data: { status } });
  await recordAudit({
    userId: ownerId,
    action: 'UPDATE',
    targetModel: 'Room',
    targetId: roomId,
    after: { status },
  });
}
