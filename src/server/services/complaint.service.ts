import type { ComplaintStatus } from '@prisma/client';
import { prisma } from '~/server/db';
import { recordAudit } from '~/lib/server/audit';

export async function createComplaint(
  pelaporId: string,
  data: {
    boardingHouseId?: string;
    judul: string;
    deskripsi: string;
    kategori: string;
    prioritas: 'RENDAH' | 'SEDANG' | 'TINGGI' | 'KRITIS';
  },
) {
  const c = await prisma.complaint.create({
    data: {
      pelaporId,
      boardingHouseId: data.boardingHouseId,
      judul: data.judul,
      deskripsi: data.deskripsi,
      kategori: data.kategori,
      prioritas: data.prioritas,
    },
  });
  await recordAudit({
    userId: pelaporId,
    action: 'CREATE',
    targetModel: 'Complaint',
    targetId: c.id,
  });
  return c;
}

export async function listUserComplaints(pelaporId: string) {
  return prisma.complaint.findMany({
    where: { pelaporId },
    include: { boardingHouse: { select: { nama: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function listOwnerComplaints(ownerId: string, status?: ComplaintStatus) {
  return prisma.complaint.findMany({
    where: { boardingHouse: { ownerId }, ...(status && { status }) },
    include: {
      pelapor: {
        select: { email: true, profile: { select: { namaLengkap: true } } },
      },
      boardingHouse: { select: { nama: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateComplaintStatus(
  actorId: string,
  complaintId: string,
  status: ComplaintStatus,
  resolusi?: string,
) {
  await prisma.complaint.update({
    where: { id: complaintId },
    data: {
      status,
      resolusi: resolusi || undefined,
      resolvedAt: status === 'SELESAI' || status === 'DITUTUP' ? new Date() : null,
    },
  });
  await recordAudit({
    userId: actorId,
    action: 'UPDATE',
    targetModel: 'Complaint',
    targetId: complaintId,
    after: { status },
  });
}

export async function listAdminDisputes(status?: ComplaintStatus) {
  return prisma.complaint.findMany({
    where: { ...(status && { status }) },
    include: {
      pelapor: {
        select: {
          email: true,
          profile: { select: { namaLengkap: true } },
          avatarAsset: { select: { url: true } },
        },
      },
      boardingHouse: {
        select: {
          nama: true,
          owner: { select: { profile: { select: { namaLengkap: true } } } },
        },
      },
    },
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
  });
}
