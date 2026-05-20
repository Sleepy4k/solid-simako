import { action, query, reload } from '@solidjs/router';
import {
  kostFormSchema,
  roomFormSchema,
  broadcastSchema,
  ownerBankSchema,
  parseFormData,
  handleZodError,
  actionOk,
} from '~/lib/shared/validation';
import { requireRole } from '~/lib/server/session';
import {
  listOwnerKost,
  createKost,
  updateKost,
  deleteKost,
  togglePublishKost,
  listKostRooms,
  setRoomStatus,
  getOwnerKostDetail,
} from '~/server/services/kost.service';
import {
  listOwnerBookings,
  approveBooking,
  rejectBooking,
  checkoutTenant,
  listOwnerActiveTenants,
} from '~/server/services/rental.service';
import {
  listOwnerTransactions,
  ownerVerifyTransaction,
  createRenewalTransaction,
} from '~/server/services/transaction.service';
import {
  listOwnerComplaints,
  updateComplaintStatus,
} from '~/server/services/complaint.service';
import {
  getOwnerOverview,
  updateOwnerBank,
  uploadOwnerKyc,
  createBroadcast,
  listOwnerBroadcasts,
  getOwnerFinanceReport,
} from '~/server/services/owner.service';
import { prisma } from '~/server/db';
import { saveAsset } from '~/server/services/upload.service';
import type { ComplaintStatus, RoomStatus } from '@prisma/client';

// ─── Overview ──────────────────────────────────────────────────────────────

export const ownerOverviewQuery = query(async () => {
  'use server';
  const user = await requireRole('MITRA');
  return getOwnerOverview(user.id);
}, 'ownerOverview');

// ─── Kost CRUD ─────────────────────────────────────────────────────────────

export const ownerKostListQuery = query(async () => {
  'use server';
  const user = await requireRole('MITRA');
  return listOwnerKost(user.id);
}, 'ownerKostList');

export const ownerKostDetailQuery = query(async (kostId: string) => {
  'use server';
  const user = await requireRole('MITRA');
  return getOwnerKostDetail(user.id, kostId);
}, 'ownerKostDetail');

export const createKostAction = action(async (formData: FormData) => {
  'use server';
  try {
    const user = await requireRole('MITRA');
    const facIds = formData.getAll('facilities').map(Number);
    const input = kostFormSchema.parse({
      nama: formData.get('nama'),
      deskripsi: formData.get('deskripsi'),
      alamat: formData.get('alamat'),
      kota: formData.get('kota'),
      kodePos: formData.get('kodePos'),
      jenisKelamin: formData.get('jenisKelamin'),
      kampusId: formData.get('kampusId') || undefined,
      facilities: facIds,
    });
    const kost = await createKost(user.id, input);
    return actionOk({ id: kost.id, slug: kost.slug }, 'Properti berhasil ditambahkan');
  } catch (err) {
    return handleZodError(err);
  }
}, 'createKost');

export const updateKostAction = action(async (kostId: string, formData: FormData) => {
  'use server';
  try {
    const user = await requireRole('MITRA');
    const facIds = formData.getAll('facilities').map(Number);
    const input = kostFormSchema.parse({
      nama: formData.get('nama'),
      deskripsi: formData.get('deskripsi'),
      alamat: formData.get('alamat'),
      kota: formData.get('kota'),
      kodePos: formData.get('kodePos'),
      jenisKelamin: formData.get('jenisKelamin'),
      kampusId: formData.get('kampusId') || undefined,
      facilities: facIds,
    });
    await updateKost(user.id, kostId, input);
    return actionOk(undefined, 'Properti diperbarui');
  } catch (err) {
    return handleZodError(err);
  }
}, 'updateKost');

export const deleteKostAction = action(async (kostId: string) => {
  'use server';
  const user = await requireRole('MITRA');
  await deleteKost(user.id, kostId);
  throw reload({ revalidate: ownerKostListQuery.key });
}, 'deleteKost');

export const togglePublishAction = action(async (kostId: string) => {
  'use server';
  const user = await requireRole('MITRA');
  await togglePublishKost(user.id, kostId);
  throw reload({ revalidate: ownerKostListQuery.key });
}, 'togglePublish');

// ─── Rooms ─────────────────────────────────────────────────────────────────

export const ownerRoomsQuery = query(async (kostId: string) => {
  'use server';
  const user = await requireRole('MITRA');
  return listKostRooms(user.id, kostId);
}, 'ownerRooms');

export const createRoomAction = action(async (kostId: string, formData: FormData) => {
  'use server';
  try {
    const user = await requireRole('MITRA');
    await getOwnerKostDetail(user.id, kostId);
    const facIds = formData.getAll('facilities').map(Number);
    const input = roomFormSchema.parse({
      nomorKamar: formData.get('nomorKamar'),
      lantai: formData.get('lantai') || undefined,
      hargaBulan: formData.get('hargaBulan'),
      hargaTahun: formData.get('hargaTahun') || undefined,
      kapasitas: formData.get('kapasitas') || 1,
      deskripsi: formData.get('deskripsi'),
      facilities: facIds,
    });
    const room = await prisma.room.create({
      data: {
        boardingHouseId: kostId,
        nomorKamar: input.nomorKamar,
        lantai: input.lantai,
        hargaBulan: input.hargaBulan,
        hargaTahun: input.hargaTahun,
        kapasitas: input.kapasitas,
        deskripsi: input.deskripsi || null,
        facilities: input.facilities.length
          ? { createMany: { data: input.facilities.map((id) => ({ facilityId: id })) } }
          : undefined,
      },
    });
    return actionOk({ id: room.id }, 'Kamar ditambahkan');
  } catch (err) {
    return handleZodError(err);
  }
}, 'createRoom');

export const setRoomStatusAction = action(
  async (roomId: string, status: RoomStatus) => {
    'use server';
    const user = await requireRole('MITRA');
    await setRoomStatus(user.id, roomId, status);
    return actionOk(undefined);
  },
  'setRoomStatus',
);

// ─── Booking verification ──────────────────────────────────────────────────

export const ownerBookingsQuery = query(async () => {
  'use server';
  const user = await requireRole('MITRA');
  return listOwnerBookings(user.id);
}, 'ownerBookings');

export const approveBookingAction = action(async (rentalId: string) => {
  'use server';
  const user = await requireRole('MITRA');
  await approveBooking(user.id, rentalId);
  throw reload({ revalidate: ownerBookingsQuery.key });
}, 'approveBooking');

export const rejectBookingAction = action(async (rentalId: string, alasan: string) => {
  'use server';
  const user = await requireRole('MITRA');
  await rejectBooking(user.id, rentalId, alasan);
  throw reload({ revalidate: ownerBookingsQuery.key });
}, 'rejectBooking');

// ─── Tenants ───────────────────────────────────────────────────────────────

export const ownerTenantsQuery = query(async () => {
  'use server';
  const user = await requireRole('MITRA');
  return listOwnerActiveTenants(user.id);
}, 'ownerTenants');

export const checkoutTenantAction = action(async (rentalId: string) => {
  'use server';
  const user = await requireRole('MITRA');
  await checkoutTenant(user.id, rentalId);
  throw reload({ revalidate: ownerTenantsQuery.key });
}, 'checkoutTenant');

// ─── Finance / Transactions ────────────────────────────────────────────────

export const ownerTransactionsQuery = query(async () => {
  'use server';
  const user = await requireRole('MITRA');
  return listOwnerTransactions(user.id);
}, 'ownerTransactions');

export const ownerFinanceQuery = query(async (year?: number) => {
  'use server';
  const user = await requireRole('MITRA');
  return getOwnerFinanceReport(user.id, year ?? new Date().getFullYear());
}, 'ownerFinance');

export const verifyTransactionAction = action(
  async (transactionId: string, approve: boolean, rejectionNote?: string) => {
    'use server';
    const user = await requireRole('MITRA');
    await ownerVerifyTransaction(user.id, transactionId, approve, rejectionNote);
    throw reload({ revalidate: ownerTransactionsQuery.key });
  },
  'verifyTransaction',
);

export const createRenewalAction = action(async (rentalId: string, nominal: number) => {
  'use server';
  const user = await requireRole('MITRA');
  await createRenewalTransaction(user.id, rentalId, nominal);
  return actionOk(undefined, 'Tagihan dibuat');
}, 'createRenewal');

// ─── Complaints (Owner side) ───────────────────────────────────────────────

export const ownerComplaintsQuery = query(async () => {
  'use server';
  const user = await requireRole('MITRA');
  return listOwnerComplaints(user.id);
}, 'ownerComplaints');

export const respondComplaintAction = action(
  async (complaintId: string, status: ComplaintStatus, resolusi?: string) => {
    'use server';
    const user = await requireRole('MITRA');
    await updateComplaintStatus(user.id, complaintId, status, resolusi);
    throw reload({ revalidate: ownerComplaintsQuery.key });
  },
  'respondComplaint',
);

// ─── Broadcast ─────────────────────────────────────────────────────────────

export const ownerBroadcastsQuery = query(async () => {
  'use server';
  const user = await requireRole('MITRA');
  return listOwnerBroadcasts(user.id);
}, 'ownerBroadcasts');

export const createBroadcastAction = action(async (formData: FormData) => {
  'use server';
  try {
    const user = await requireRole('MITRA');
    const input = parseFormData(broadcastSchema, formData);
    await createBroadcast(user.id, input);
    throw reload({ revalidate: ownerBroadcastsQuery.key });
  } catch (err) {
    if (err instanceof Response) throw err;
    return handleZodError(err);
  }
}, 'createBroadcast');

// ─── Bank account & KYC ────────────────────────────────────────────────────

export const updateBankAction = action(async (formData: FormData) => {
  'use server';
  try {
    const user = await requireRole('MITRA');
    const input = parseFormData(ownerBankSchema, formData);
    await updateOwnerBank(user.id, input);
    return actionOk(undefined, 'Rekening tersimpan');
  } catch (err) {
    return handleZodError(err);
  }
}, 'updateBank');

export const uploadKtpAction = action(async (formData: FormData) => {
  'use server';
  try {
    const user = await requireRole('MITRA');
    const file = formData.get('file') as File | null;
    if (!file) return handleZodError(new Error('File KTP wajib diunggah'));
    const asset = await saveAsset(file, 'KTP', user.id);
    await uploadOwnerKyc(user.id, asset.id);
    return actionOk(undefined, 'KTP terunggah. Menunggu verifikasi admin.');
  } catch (err) {
    return handleZodError(err);
  }
}, 'uploadKtp');
