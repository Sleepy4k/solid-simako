import { prisma } from '~/server/db';

export async function listChatRooms(userId: string) {
  // Buyer's rooms
  const asBuyer = await prisma.chatRoom.findMany({
    where: { buyerId: userId },
    include: {
      boardingHouse: {
        select: {
          id: true,
          nama: true,
          owner: {
            select: {
              id: true,
              profile: { select: { namaLengkap: true } },
              avatarAsset: { select: { url: true } },
            },
          },
        },
      },
      messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      _count: { select: { messages: { where: { isRead: false, NOT: { senderId: userId } } } } },
    },
    orderBy: { lastMessageAt: 'desc' },
  });

  // Owner's rooms (chats yang masuk ke kost mereka)
  const asOwner = await prisma.chatRoom.findMany({
    where: { boardingHouse: { ownerId: userId } },
    include: {
      boardingHouse: { select: { id: true, nama: true } },
      buyer: {
        select: {
          id: true,
          email: true,
          profile: { select: { namaLengkap: true } },
          avatarAsset: { select: { url: true } },
        },
      },
      messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      _count: { select: { messages: { where: { isRead: false, NOT: { senderId: userId } } } } },
    },
    orderBy: { lastMessageAt: 'desc' },
  });

  return [
    ...asBuyer.map((r) => ({
      id: r.id,
      lawanNama: r.boardingHouse.owner.profile?.namaLengkap ?? 'Owner',
      lawanAvatar: r.boardingHouse.owner.avatarAsset?.url ?? null,
      lawanRole: 'Owner',
      kostNama: r.boardingHouse.nama,
      lastMessage: r.messages[0]?.konten ?? null,
      lastMessageAt: r.lastMessageAt,
      unread: r._count.messages,
      perspective: 'buyer' as const,
    })),
    ...asOwner.map((r) => ({
      id: r.id,
      lawanNama: r.buyer.profile?.namaLengkap ?? r.buyer.email,
      lawanAvatar: r.buyer.avatarAsset?.url ?? null,
      lawanRole: 'Penyewa',
      kostNama: r.boardingHouse.nama,
      lastMessage: r.messages[0]?.konten ?? null,
      lastMessageAt: r.lastMessageAt,
      unread: r._count.messages,
      perspective: 'owner' as const,
    })),
  ].sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());
}

export async function getChatMessages(userId: string, roomId: string) {
  const room = await prisma.chatRoom.findUnique({
    where: { id: roomId },
    include: { boardingHouse: { select: { ownerId: true } } },
  });
  if (!room) throw new Error('Ruang chat tidak ditemukan');
  if (room.buyerId !== userId && room.boardingHouse.ownerId !== userId) {
    throw new Error('Tidak diizinkan mengakses chat ini');
  }

  // Tandai pesan dari lawan sebagai dibaca
  await prisma.chatMessage.updateMany({
    where: { chatRoomId: roomId, isRead: false, NOT: { senderId: userId } },
    data: { isRead: true },
  });

  return prisma.chatMessage.findMany({
    where: { chatRoomId: roomId },
    orderBy: { createdAt: 'asc' },
  });
}

export async function sendChatMessage(userId: string, roomId: string, konten: string) {
  const room = await prisma.chatRoom.findUnique({
    where: { id: roomId },
    include: { boardingHouse: { select: { ownerId: true } } },
  });
  if (!room) throw new Error('Ruang chat tidak ditemukan');
  if (room.buyerId !== userId && room.boardingHouse.ownerId !== userId) {
    throw new Error('Tidak diizinkan mengirim pesan');
  }

  const [msg] = await prisma.$transaction([
    prisma.chatMessage.create({
      data: { chatRoomId: roomId, senderId: userId, konten },
    }),
    prisma.chatRoom.update({ where: { id: roomId }, data: { lastMessageAt: new Date() } }),
  ]);

  return msg;
}

export async function startChatWithKost(
  buyerId: string,
  boardingHouseId: string,
  pesanAwal: string,
) {
  const kost = await prisma.boardingHouse.findUnique({
    where: { id: boardingHouseId },
    select: { ownerId: true },
  });
  if (!kost) throw new Error('Kost tidak ditemukan');
  if (kost.ownerId === buyerId) throw new Error('Tidak bisa chat dengan diri sendiri');

  const room = await prisma.chatRoom.upsert({
    where: { boardingHouseId_buyerId: { boardingHouseId, buyerId } },
    update: { lastMessageAt: new Date() },
    create: { boardingHouseId, buyerId },
  });

  await prisma.chatMessage.create({
    data: { chatRoomId: room.id, senderId: buyerId, konten: pesanAwal },
  });

  return room;
}
