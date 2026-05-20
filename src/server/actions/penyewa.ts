import { action, query, redirect, reload } from '@solidjs/router';
import {
  createBookingSchema,
  uploadProofSchema,
  complaintFormSchema,
  reviewSchema,
  updateUserProfileSchema,
  chatMessageSchema,
  newChatRoomSchema,
  parseFormData,
  handleZodError,
  actionOk,
} from '~/lib/shared/validation';
import { requireUser, requireRole } from '~/lib/server/session';
import {
  createBooking,
  listUserRentals,
  getActiveRental,
} from '~/server/services/rental.service';
import {
  uploadTransactionProof,
  listUserTransactions,
} from '~/server/services/transaction.service';
import {
  toggleWishlist,
  listUserWishlist,
} from '~/server/services/wishlist.service';
import {
  createComplaint,
  listUserComplaints,
} from '~/server/services/complaint.service';
import { createReview } from '~/server/services/review.service';
import {
  updateUserProfile,
  getUserProfile,
  updateAvatar,
  updateUserSettings,
} from '~/server/services/profile.service';
import {
  listChatRooms,
  getChatMessages,
  sendChatMessage,
  startChatWithKost,
} from '~/server/services/chat.service';
import { saveAsset } from '~/server/services/upload.service';
import { ROUTES } from '~/constants/routes';

// ─── Profile ────────────────────────────────────────────────────────────────

export const userProfileQuery = query(async () => {
  'use server';
  const user = await requireUser();
  return getUserProfile(user.id);
}, 'userProfile');

export const updateProfileAction = action(async (formData: FormData) => {
  'use server';
  try {
    const user = await requireUser();
    const input = parseFormData(updateUserProfileSchema, formData);
    await updateUserProfile(user.id, {
      namaLengkap: input.namaLengkap,
      telepon: input.telepon || undefined,
      alamat: input.alamat || undefined,
      tanggalLahir: input.tanggalLahir || undefined,
      jenisKelamin: (input.jenisKelamin as 'L' | 'P' | '') || undefined,
      kampusId: input.kampusId,
    });
    return actionOk(undefined, 'Profil tersimpan');
  } catch (err) {
    return handleZodError(err);
  }
}, 'updateProfile');

export const uploadAvatarAction = action(async (formData: FormData) => {
  'use server';
  try {
    const user = await requireUser();
    const file = formData.get('file') as File | null;
    if (!file) return handleZodError(new Error('File avatar wajib diisi'));
    const asset = await saveAsset(file, 'AVATAR', user.id);
    await updateAvatar(user.id, asset.id);
    return actionOk({ url: asset.url }, 'Foto profil diperbarui');
  } catch (err) {
    return handleZodError(err);
  }
}, 'uploadAvatar');

export const updateSettingsAction = action(async (formData: FormData) => {
  'use server';
  try {
    const user = await requireUser();
    await updateUserSettings(user.id, {
      notifEmail: formData.get('notifEmail') === 'on',
      notifWhatsapp: formData.get('notifWhatsapp') === 'on',
      notifPembayaran: formData.get('notifPembayaran') === 'on',
      notifBroadcast: formData.get('notifBroadcast') === 'on',
    });
    return actionOk(undefined, 'Pengaturan disimpan');
  } catch (err) {
    return handleZodError(err);
  }
}, 'updateSettings');

// ─── Rentals (Penyewa side) ────────────────────────────────────────────────

export const userRentalsQuery = query(async () => {
  'use server';
  const user = await requireRole('PENYEWA', 'MITRA');
  return listUserRentals(user.id);
}, 'userRentals');

export const activeRentalQuery = query(async () => {
  'use server';
  const user = await requireUser();
  return getActiveRental(user.id);
}, 'activeRental');

export const createBookingAction = action(async (formData: FormData) => {
  'use server';
  try {
    const user = await requireRole('PENYEWA');
    const input = parseFormData(createBookingSchema, formData);
    const { rental, transactionId } = await createBooking(user.id, input);
    throw redirect(`${ROUTES.CHECKOUT(rental.roomId)}?trx=${transactionId}`);
  } catch (err) {
    if (err instanceof Response) throw err;
    return handleZodError(err);
  }
}, 'createBooking');

// ─── Transactions / proof upload ───────────────────────────────────────────

export const userTransactionsQuery = query(async () => {
  'use server';
  const user = await requireUser();
  return listUserTransactions(user.id);
}, 'userTransactions');

export const uploadProofAction = action(async (formData: FormData) => {
  'use server';
  try {
    const user = await requireUser();
    const input = parseFormData(uploadProofSchema, formData);
    const file = formData.get('file') as File | null;
    if (!file) return handleZodError(new Error('File bukti transfer wajib diunggah'));
    const asset = await saveAsset(file, 'BUKTI_BAYAR', user.id);
    await uploadTransactionProof(
      user.id,
      input.transactionId,
      asset.id,
      input.nomorReferensi || undefined,
      input.namaBank || undefined,
    );
    throw reload({ revalidate: userTransactionsQuery.key });
  } catch (err) {
    if (err instanceof Response) throw err;
    return handleZodError(err);
  }
}, 'uploadProof');

// ─── Wishlist ──────────────────────────────────────────────────────────────

export const wishlistQuery = query(async () => {
  'use server';
  const user = await requireUser();
  return listUserWishlist(user.id);
}, 'wishlist');

export const toggleWishlistAction = action(async (boardingHouseId: string) => {
  'use server';
  const user = await requireUser();
  const result = await toggleWishlist(user.id, boardingHouseId);
  return actionOk(result);
}, 'toggleWishlist');

// ─── Complaints ────────────────────────────────────────────────────────────

export const userComplaintsQuery = query(async () => {
  'use server';
  const user = await requireUser();
  return listUserComplaints(user.id);
}, 'userComplaints');

export const createComplaintAction = action(async (formData: FormData) => {
  'use server';
  try {
    const user = await requireUser();
    const input = parseFormData(complaintFormSchema, formData);
    await createComplaint(user.id, {
      boardingHouseId: input.boardingHouseId,
      judul: input.judul,
      deskripsi: input.deskripsi,
      kategori: input.kategori,
      prioritas: input.prioritas,
    });
    throw reload({ revalidate: userComplaintsQuery.key });
  } catch (err) {
    if (err instanceof Response) throw err;
    return handleZodError(err);
  }
}, 'createComplaint');

// ─── Reviews ───────────────────────────────────────────────────────────────

export const createReviewAction = action(async (formData: FormData) => {
  'use server';
  try {
    const user = await requireUser();
    const input = parseFormData(reviewSchema, formData);
    await createReview(user.id, {
      boardingHouseId: input.boardingHouseId,
      rentalId: input.rentalId,
      rating: input.rating,
      komentar: input.komentar || undefined,
    });
    return actionOk(undefined, 'Ulasan terkirim');
  } catch (err) {
    return handleZodError(err);
  }
}, 'createReview');

// ─── Chat ──────────────────────────────────────────────────────────────────

export const chatRoomsQuery = query(async () => {
  'use server';
  const user = await requireUser();
  return listChatRooms(user.id);
}, 'chatRooms');

export const chatMessagesQuery = query(async (roomId: string) => {
  'use server';
  const user = await requireUser();
  return getChatMessages(user.id, roomId);
}, 'chatMessages');

export const sendChatAction = action(async (formData: FormData) => {
  'use server';
  try {
    const user = await requireUser();
    const input = parseFormData(chatMessageSchema, formData);
    await sendChatMessage(user.id, input.chatRoomId, input.konten);
    throw reload({ revalidate: chatMessagesQuery.keyFor(input.chatRoomId) });
  } catch (err) {
    if (err instanceof Response) throw err;
    return handleZodError(err);
  }
}, 'sendChat');

export const startChatAction = action(async (formData: FormData) => {
  'use server';
  try {
    const user = await requireRole('PENYEWA');
    const input = parseFormData(newChatRoomSchema, formData);
    const room = await startChatWithKost(user.id, input.boardingHouseId, input.pesanAwal);
    throw redirect(`${ROUTES.CHAT}?room=${room.id}`);
  } catch (err) {
    if (err instanceof Response) throw err;
    return handleZodError(err);
  }
}, 'startChat');
