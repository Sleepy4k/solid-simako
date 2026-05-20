import { prisma } from '~/server/db';
import { recordAudit } from '~/lib/server/audit';

export async function getUserProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: { include: { kampus: true } },
      ownerProfile: true,
      settings: true,
      avatarAsset: { select: { url: true } },
    },
  });
}

export async function updateUserProfile(
  userId: string,
  data: {
    namaLengkap: string;
    telepon?: string;
    alamat?: string;
    tanggalLahir?: string;
    jenisKelamin?: 'L' | 'P';
    kampusId?: number;
  },
) {
  await prisma.userProfile.upsert({
    where: { userId },
    update: {
      namaLengkap: data.namaLengkap,
      telepon: data.telepon || null,
      alamat: data.alamat || null,
      tanggalLahir: data.tanggalLahir ? new Date(data.tanggalLahir) : null,
      jenisKelamin: data.jenisKelamin || null,
      kampusId: data.kampusId,
    },
    create: {
      userId,
      namaLengkap: data.namaLengkap,
      telepon: data.telepon || null,
      alamat: data.alamat || null,
      tanggalLahir: data.tanggalLahir ? new Date(data.tanggalLahir) : null,
      jenisKelamin: data.jenisKelamin || null,
      kampusId: data.kampusId,
    },
  });
  await recordAudit({ userId, action: 'UPDATE', targetModel: 'UserProfile', targetId: userId });
}

export async function updateAvatar(userId: string, avatarAssetId: string) {
  await prisma.user.update({ where: { id: userId }, data: { avatarAssetId } });
}

export async function updateUserSettings(
  userId: string,
  data: {
    notifEmail?: boolean;
    notifWhatsapp?: boolean;
    notifPembayaran?: boolean;
    notifBroadcast?: boolean;
  },
) {
  await prisma.userSettings.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
  });
}
