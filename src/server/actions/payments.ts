import { db } from "~/server/db";
import {
  paymentProofs, bookings, rooms, kostProperties,
  tenants, users, notifications,
} from "~/server/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import { requireAuth } from "~/lib/server/auth";
import { v7 as uuidv7 } from "uuid";
import type { PaymentStatus } from "~/types";

export interface PaymentEntry {
  id:              string;
  bookingId:       string;
  tenantName:      string;
  roomNumber:      string;
  propertyName:    string;
  amount:          number;
  senderBank:      string;
  accountHolder:   string;
  transferDate:    string;
  status:          PaymentStatus;
  rejectionReason: string | null;
  createdAt:       Date;
  imageUrl:        string;
  notes:           string | null;
}

export async function getTenantPayments(): Promise<PaymentEntry[]> {
  "use server";
  const user = await requireAuth(["tenant"]);

  const [tenant] = await db.select({ id: tenants.id })
    .from(tenants).where(eq(tenants.userId, user.id)).limit(1);
  if (!tenant) return [];

  const propertyRows = await db.select({ id: kostProperties.id, name: kostProperties.name })
    .from(kostProperties).where(eq(kostProperties.tenantId, tenant.id));
  if (!propertyRows.length) return [];

  const propertyIds = propertyRows.map((p) => p.id);
  const propMap     = Object.fromEntries(propertyRows.map((p) => [p.id, p.name]));

  const roomRows = await db
    .select({ id: rooms.id, roomNumber: rooms.roomNumber, propertyId: rooms.propertyId })
    .from(rooms)
    .where(inArray(rooms.propertyId, propertyIds));
  if (!roomRows.length) return [];

  const roomIds = roomRows.map((r) => r.id);
  const roomMap = Object.fromEntries(roomRows.map((r) => [r.id, r]));

  const bookingRows = await db
    .select({ id: bookings.id, roomId: bookings.roomId, userId: bookings.userId })
    .from(bookings)
    .where(inArray(bookings.roomId, roomIds));
  if (!bookingRows.length) return [];

  const bookingIds = bookingRows.map((b) => b.id);
  const bookingMap = Object.fromEntries(bookingRows.map((b) => [b.id, b]));

  const userIds  = [...new Set(bookingRows.map((b) => b.userId))];
  const userRows = await db.select({ id: users.id, name: users.name })
    .from(users).where(inArray(users.id, userIds));
  const userMap  = Object.fromEntries(userRows.map((u) => [u.id, u.name]));

  const proofs = await db.select().from(paymentProofs)
    .where(inArray(paymentProofs.bookingId, bookingIds))
    .orderBy(desc(paymentProofs.createdAt));

  return proofs.map((proof) => {
    const booking  = bookingMap[proof.bookingId];
    const room     = booking ? roomMap[booking.roomId] : null;
    const propName = room ? (propMap[room.propertyId] ?? "?") : "?";

    return {
      id:              proof.id,
      bookingId:       proof.bookingId,
      tenantName:      booking ? (userMap[booking.userId] ?? "Unknown") : "Unknown",
      roomNumber:      room?.roomNumber ?? "?",
      propertyName:    propName,
      amount:          Number(proof.amount),
      senderBank:      proof.senderBank,
      accountHolder:   proof.accountHolder,
      transferDate:    proof.transferDate instanceof Date
                         ? proof.transferDate.toISOString().slice(0, 10)
                         : String(proof.transferDate),
      status:          proof.status as PaymentStatus,
      rejectionReason: proof.rejectionReason ?? null,
      createdAt:       proof.createdAt,
      imageUrl:        proof.imageUrl,
      notes:           proof.notes ?? null,
    };
  });
}

export async function approvePaymentAction(proofId: string) {
  "use server";
  const user = await requireAuth(["tenant"]);

  const [proof] = await db.select()
    .from(paymentProofs).where(eq(paymentProofs.id, proofId)).limit(1);
  if (!proof) return { error: "Bukti pembayaran tidak ditemukan" };
  if (proof.status !== "pending") return { error: "Status bukti sudah diproses" };

  await db.update(paymentProofs).set({
    status:     "approved",
    reviewedBy: user.id,
    reviewedAt: new Date(),
  }).where(eq(paymentProofs.id, proofId));

  await db.update(bookings).set({ status: "active" })
    .where(eq(bookings.id, proof.bookingId));

  const [booking] = await db.select({ userId: bookings.userId })
    .from(bookings).where(eq(bookings.id, proof.bookingId)).limit(1);
  if (booking) {
    await db.insert(notifications).values({
      id:     uuidv7(),
      userId: booking.userId,
      type:   "payment",
      title:  "Pembayaran Disetujui",
      body:   "Bukti pembayaran Anda telah diverifikasi. Selamat, booking Anda aktif!",
    });
  }

  return { success: true };
}

export async function rejectPaymentAction(proofId: string, reason: string) {
  "use server";
  const user = await requireAuth(["tenant"]);

  const [proof] = await db.select()
    .from(paymentProofs).where(eq(paymentProofs.id, proofId)).limit(1);
  if (!proof) return { error: "Bukti pembayaran tidak ditemukan" };
  if (proof.status !== "pending") return { error: "Status bukti sudah diproses" };

  const rejectionReason = reason?.trim() || "Bukti pembayaran tidak valid atau tidak sesuai";

  await db.update(paymentProofs).set({
    status:          "rejected",
    reviewedBy:      user.id,
    reviewedAt:      new Date(),
    rejectionReason,
  }).where(eq(paymentProofs.id, proofId));

  const [booking] = await db.select({ userId: bookings.userId })
    .from(bookings).where(eq(bookings.id, proof.bookingId)).limit(1);
  if (booking) {
    await db.insert(notifications).values({
      id:     uuidv7(),
      userId: booking.userId,
      type:   "payment",
      title:  "Pembayaran Ditolak",
      body:   `Bukti pembayaran Anda ditolak. Alasan: ${rejectionReason}`,
    });
  }

  return { success: true };
}
