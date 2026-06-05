import { db } from "~/server/db";
import { userFavorites, notifications, users, rooms, kostProperties, bookings, paymentProofs } from "~/server/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import { requireAuth } from "~/lib/server/auth";
import type { Notification, BookingSummary, BookingStatus } from "~/types";

export interface FavoriteEntry {
  roomId:       string;
  roomNumber:   string;
  pricePerMonth:number;
  status:       string;
  propertyName: string;
  district:     string;
  kostType:     string;
  genderType:   string;
  slug:         string;
  addedAt:      Date;
}

export async function getUserFavorites(): Promise<{ favorites: FavoriteEntry[]; total: number }> {
  "use server";
  const user = await requireAuth(["user"]);

  const favRows = await db
    .select({
      roomId:       userFavorites.roomId,
      createdAt:    userFavorites.createdAt,
      roomNumber:   rooms.roomNumber,
      pricePerMonth:rooms.pricePerMonth,
      status:       rooms.status,
      propertyName: kostProperties.name,
      district:     kostProperties.district,
      kostType:     kostProperties.kostType,
      genderType:   kostProperties.genderType,
      slug:         kostProperties.slug,
    })
    .from(userFavorites)
    .innerJoin(rooms,          eq(rooms.id,          userFavorites.roomId))
    .innerJoin(kostProperties, eq(kostProperties.id, rooms.propertyId))
    .where(eq(userFavorites.userId, user.id))
    .orderBy(desc(userFavorites.createdAt));

  const favorites: FavoriteEntry[] = favRows.map((f) => ({
    roomId:        f.roomId,
    roomNumber:    f.roomNumber,
    pricePerMonth: Number(f.pricePerMonth),
    status:        f.status,
    propertyName:  f.propertyName,
    district:      f.district,
    kostType:      f.kostType,
    genderType:    f.genderType,
    slug:          f.slug,
    addedAt:       f.createdAt,
  }));

  return { favorites, total: favorites.length };
}

export async function toggleFavoriteAction(roomId: string) {
  "use server";
  const user = await requireAuth(["user"]);
  const [existing] = await db
    .select()
    .from(userFavorites)
    .where(and(eq(userFavorites.userId, user.id), eq(userFavorites.roomId, roomId)))
    .limit(1);
  if (existing) {
    await db.delete(userFavorites).where(
      and(eq(userFavorites.userId, user.id), eq(userFavorites.roomId, roomId))
    );
    return { isFavorite: false };
  }
  await db.insert(userFavorites).values({ userId: user.id, roomId });
  return { isFavorite: true };
}

export async function getNotifications(): Promise<Notification[]> {
  "use server";
  const user = await requireAuth();
  const rows = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, user.id))
    .orderBy(desc(notifications.createdAt))
    .limit(20);
  return rows.map((n) => ({
    id:        n.id,
    type:      n.type,
    title:     n.title,
    body:      n.body,
    isRead:    n.isRead,
    relatedId: n.relatedId ?? null,
    createdAt: n.createdAt,
  }));
}

export async function markNotificationsRead() {
  "use server";
  const user = await requireAuth();
  await db
    .update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.userId, user.id), eq(notifications.isRead, false)));
  return { success: true };
}

export async function getRentalHistory(): Promise<BookingSummary[]> {
  "use server";
  const user = await requireAuth(["user"]);

  const rows = await db
    .select({
      id:          bookings.id,
      startDate:   bookings.startDate,
      endDate:     bookings.endDate,
      totalAmount: bookings.totalAmount,
      status:      bookings.status,
      createdAt:   bookings.createdAt,
      roomNumber:  rooms.roomNumber,
      propertyName:kostProperties.name,
    })
    .from(bookings)
    .innerJoin(rooms,          eq(rooms.id,          bookings.roomId))
    .innerJoin(kostProperties, eq(kostProperties.id, rooms.propertyId))
    .where(eq(bookings.userId, user.id))
    .orderBy(desc(bookings.createdAt));

  if (!rows.length) return [];

  const bookingIds   = rows.map((r) => r.id);
  const latestProofs = await db
    .select({ bookingId: paymentProofs.bookingId, status: paymentProofs.status })
    .from(paymentProofs)
    .where(inArray(paymentProofs.bookingId, bookingIds))
    .orderBy(desc(paymentProofs.createdAt));

  const proofMap = Object.fromEntries(latestProofs.map((p) => [p.bookingId, p.status]));

  return rows.map((r) => ({
    id:            r.id,
    propertyName:  r.propertyName,
    roomNumber:    r.roomNumber,
    startDate:     r.startDate instanceof Date ? r.startDate : new Date(r.startDate),
    endDate:       r.endDate ? (r.endDate instanceof Date ? r.endDate : new Date(r.endDate)) : null,
    totalAmount:   Number(r.totalAmount),
    status:        r.status as BookingStatus,
    paymentStatus: (proofMap[r.id] as any) ?? null,
    createdAt:     r.createdAt,
  }));
}

export async function updateProfileAction(formData: FormData) {
  "use server";
  const user  = await requireAuth();
  const name  = formData.get("name")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim() || null;
  if (!name || name.length < 2) return { error: "Nama minimal 2 karakter" };
  await db.update(users).set({ name, phone }).where(eq(users.id, user.id));
  return { success: true };
}
