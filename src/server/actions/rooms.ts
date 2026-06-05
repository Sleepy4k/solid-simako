import { db } from "~/server/db";
import { kostProperties, rooms, propertyImages, propertyFacilities, facilities, tenants, roomImages, roomViews, propertyViews } from "~/server/db/schema";
import { eq, and, sql, like, or, desc, asc, count } from "drizzle-orm";
import { requireAuth } from "~/lib/server/auth";
import { generateSlug } from "~/lib/server/security";
import { createPropertySchema, createRoomSchema, updateRoomSchema, updatePropertySchema } from "~/lib/shared/validation";
import { getTopRecommendations } from "~/lib/shared/recommendation";
import type { RecommendedRoom, SearchParams, PaginatedResult, SearchPreviewItem, PropertyDetail, RoomDetail, RoomDetailFull } from "~/types";
import { v7 as uuidv7 } from "uuid";
import { getRequestEvent } from "solid-js/web";

export async function getRecommendedRooms(limit = 8): Promise<RecommendedRoom[]> {
  "use server";
  try {
    const rows = await db.select({
      id:            rooms.id,
      propertyId:    kostProperties.id,
      name:          kostProperties.name,
      propertySlug:  kostProperties.slug,
      roomNumber:    rooms.roomNumber,
      roomType:      rooms.type,
      description:   rooms.description,
      address:       kostProperties.address,
      city:          kostProperties.city,
      district:      kostProperties.district,
      kostType:      kostProperties.kostType,
      genderType:    kostProperties.genderType,
      pricePerMonth: sql<number>`CAST(${rooms.pricePerMonth} AS UNSIGNED)`,
      depositAmount: sql<number>`CAST(${rooms.depositAmount} AS UNSIGNED)`,
      size:          rooms.size,
      status:        rooms.status,
      viewCount:     sql<number>`CAST(${rooms.viewCount} AS UNSIGNED)`,
      avgRating:     sql<number>`CAST(${rooms.avgRating} AS DECIMAL(3,2))`,
      createdAt:     rooms.createdAt,
      thumbnail:     sql<string | null>`(SELECT \`url\` FROM \`property_images\` WHERE \`property_id\` = ${kostProperties.id} AND \`is_primary\` = 1 LIMIT 1)`,
    })
    .from(rooms)
    .innerJoin(kostProperties, eq(kostProperties.id, rooms.propertyId))
    .where(and(eq(kostProperties.isActive, true), eq(rooms.status, "available")))
    .limit(Math.max(limit * 3, 30));

    const mapped = rows.map((r) => ({
      id:             r.id,
      propertyId:     r.propertyId,
      propertySlug:   r.propertySlug ?? "",
      name:           r.name,
      slug:           r.id,
      roomNumber:     r.roomNumber,
      roomType:       r.roomType,
      description:    r.description ?? null,
      address:        r.address,
      city:           r.city,
      district:       r.district,
      kostType:       r.kostType,
      genderType:     r.genderType,
      pricePerMonth:  Number(r.pricePerMonth ?? 0),
      depositAmount:  Number(r.depositAmount ?? 0),
      size:           r.size ?? null,
      status:         r.status,
      minPrice:       Number(r.pricePerMonth ?? 0),
      maxPrice:       Number(r.pricePerMonth ?? 0),
      availableCount: 1,
      totalCount:     1,
      viewCount:      Number(r.viewCount ?? 0),
      avgRating:      Number(r.avgRating ?? 0),
      thumbnail:      r.thumbnail ?? null,
      facilities:     [],
      createdAt:      r.createdAt,
    }));
    return getTopRecommendations(mapped, limit);
  } catch {
    return [];
  }
}

export async function searchPreview(q: string): Promise<SearchPreviewItem[]> {
  "use server";
  if (!q.trim() || q.trim().length < 2) return [];
  try {
    const term = `%${q.trim()}%`;
    const rows = await db
      .select({
        id:        kostProperties.id,
        name:      kostProperties.name,
        slug:      kostProperties.slug,
        district:  kostProperties.district,
        city:      kostProperties.city,
        kostType:  kostProperties.kostType,
        genderType:kostProperties.genderType,
        minPrice:  sql<number>`CAST(MIN(${rooms.pricePerMonth}) AS UNSIGNED)`,
        thumbnail: sql<string | null>`MAX(CASE WHEN ${propertyImages.isPrimary} = 1 THEN ${propertyImages.url} ELSE NULL END)`,
      })
      .from(kostProperties)
      .leftJoin(rooms,          eq(rooms.propertyId,          kostProperties.id))
      .leftJoin(propertyImages, eq(propertyImages.propertyId, kostProperties.id))
      .where(
        and(
          eq(kostProperties.isActive, true),
          or(
            like(kostProperties.name,     term),
            like(kostProperties.address,  term),
            like(kostProperties.district, term),
          )
        )
      )
      .groupBy(kostProperties.id)
      .limit(5);

    return rows.map((r) => ({
      id:        r.id,
      name:      r.name,
      slug:      r.slug,
      address:   `${r.district}, ${r.city}`,
      minPrice:  Number(r.minPrice ?? 0),
      kostType:  r.kostType,
      genderType:r.genderType,
      thumbnail: r.thumbnail ?? null,
    }));
  } catch {
    return [];
  }
}

export async function searchRooms(params: SearchParams): Promise<PaginatedResult<RecommendedRoom>> {
  "use server";
  const {
    q = "", type, gender, city,
    minPrice, maxPrice,
    page = 1, perPage = 12, sort = "recommended",
  } = params;

  try {
    const conditions: any[] = [
      eq(kostProperties.isActive, true),
      eq(rooms.status, "available"),
    ];
    if (q.trim()) {
      const term = `%${q.trim()}%`;
      conditions.push(
        or(
          like(kostProperties.name,     term),
          like(kostProperties.address,  term),
          like(kostProperties.district, term),
        ) as any
      );
    }
    if (type)     conditions.push(eq(kostProperties.kostType,   type));
    if (gender)   conditions.push(eq(kostProperties.genderType, gender));
    if (city)     conditions.push(or(eq(kostProperties.city, city), eq(kostProperties.district, city)) as any);
    if (minPrice) conditions.push(sql`CAST(${rooms.pricePerMonth} AS UNSIGNED) >= ${minPrice}` as any);
    if (maxPrice) conditions.push(sql`CAST(${rooms.pricePerMonth} AS UNSIGNED) <= ${maxPrice}` as any);

    let orderClause: any;
    if (sort === "price_asc")   orderClause = asc(rooms.pricePerMonth);
    else if (sort === "price_desc") orderClause = desc(rooms.pricePerMonth);
    else if (sort === "newest") orderClause = desc(rooms.createdAt);
    else                        orderClause = desc(rooms.createdAt);

    const allRows = await db
      .select({
        id:            rooms.id,
        propertyId:    kostProperties.id,
        name:          kostProperties.name,
        propertySlug:  kostProperties.slug,
        roomNumber:    rooms.roomNumber,
        roomType:      rooms.type,
        description:   rooms.description,
        address:       kostProperties.address,
        city:          kostProperties.city,
        district:      kostProperties.district,
        kostType:      kostProperties.kostType,
        genderType:    kostProperties.genderType,
        pricePerMonth: sql<number>`CAST(${rooms.pricePerMonth} AS UNSIGNED)`,
        depositAmount: sql<number>`CAST(${rooms.depositAmount} AS UNSIGNED)`,
        size:          rooms.size,
        status:        rooms.status,
        viewCount:     sql<number>`CAST(${rooms.viewCount} AS UNSIGNED)`,
        avgRating:     sql<number>`CAST(${rooms.avgRating} AS DECIMAL(3,2))`,
        createdAt:     rooms.createdAt,
        thumbnail:     sql<string | null>`(SELECT \`url\` FROM \`property_images\` WHERE \`property_id\` = ${kostProperties.id} AND \`is_primary\` = 1 LIMIT 1)`,
      })
      .from(rooms)
      .innerJoin(kostProperties, eq(kostProperties.id, rooms.propertyId))
      .where(and(...conditions))
      .orderBy(orderClause);

    let mapped: Omit<RecommendedRoom, "score">[] = allRows.map((r) => ({
      id:             r.id,
      propertyId:     r.propertyId,
      propertySlug:   r.propertySlug ?? "",
      name:           r.name,
      slug:           r.id,
      roomNumber:     r.roomNumber,
      roomType:       r.roomType,
      description:    r.description ?? null,
      address:        r.address,
      city:           r.city,
      district:       r.district,
      kostType:       r.kostType,
      genderType:     r.genderType,
      pricePerMonth:  Number(r.pricePerMonth ?? 0),
      depositAmount:  Number(r.depositAmount ?? 0),
      size:           r.size ?? null,
      status:         r.status,
      minPrice:       Number(r.pricePerMonth ?? 0),
      maxPrice:       Number(r.pricePerMonth ?? 0),
      availableCount: 1,
      totalCount:     1,
      viewCount:      Number(r.viewCount ?? 0),
      avgRating:      Number(r.avgRating ?? 0),
      thumbnail:      r.thumbnail ?? null,
      facilities:     [],
      createdAt:      r.createdAt,
    }));

    if (sort === "recommended") mapped = getTopRecommendations(mapped);

    const total      = mapped.length;
    const totalPages = Math.ceil(total / perPage) || 1;
    const data       = mapped.slice((page - 1) * perPage, page * perPage).map((r) => ({ ...r, score: (r as any).score ?? 0 }));
    return { data, total, page, perPage, totalPages };
  } catch {
    return { data: [], total: 0, page, perPage, totalPages: 1 };
  }
}

function getViewerIp(): string | null {
  const ev = getRequestEvent() as any;
  const request = ev?.request as Request | undefined;
  const forwarded = request?.headers?.get("X-Forwarded-For")?.split(",")[0]?.trim();
  const ip =
    request?.headers?.get("CF-Connecting-IP") ??
    forwarded ??
    request?.headers?.get("X-Real-IP") ??
    null;

  return ip ? ip.slice(0, 50) : null;
}

function viewWindowStart(): Date {
  const since = new Date();
  since.setHours(since.getHours() - 24);
  return since;
}

export async function logRoomViewAction(roomId: string): Promise<void> {
  "use server";
  try {
    const ip = getViewerIp();
    if (!ip || !roomId) return;

    const existing = await db
      .select({ id: roomViews.id })
      .from(roomViews)
      .where(and(
        eq(roomViews.roomId, roomId),
        eq(roomViews.ipAddress, ip),
        sql`${roomViews.viewedAt} >= ${viewWindowStart()}`,
      ))
      .limit(1);

    if (existing.length > 0) return;

    await db.insert(roomViews).values({ roomId, ipAddress: ip });
    await db.update(rooms)
      .set({ viewCount: sql`${rooms.viewCount} + 1` })
      .where(eq(rooms.id, roomId));
  } catch {}
}

export async function logPropertyViewAction(slugOrId: string): Promise<void> {
  "use server";
  try {
    const ip = getViewerIp();
    if (!ip || !slugOrId) return;

    const [property] = await db
      .select({ id: kostProperties.id })
      .from(kostProperties)
      .where(
        and(
          eq(kostProperties.isActive, true),
          or(eq(kostProperties.slug, slugOrId), eq(kostProperties.id, slugOrId)) as any,
        )
      )
      .limit(1);

    if (!property) return;

    const existing = await db
      .select({ id: propertyViews.id })
      .from(propertyViews)
      .where(and(
        eq(propertyViews.propertyId, property.id),
        eq(propertyViews.ipAddress, ip),
        sql`${propertyViews.viewedAt} >= ${viewWindowStart()}`,
      ))
      .limit(1);

    if (existing.length > 0) return;

    await db.insert(propertyViews).values({ propertyId: property.id, ipAddress: ip });
  } catch {}
}

export async function getRoomDetail(roomId: string): Promise<RoomDetailFull | null> {
  "use server";
  try {
    const [room] = await db.select({
      id:            rooms.id,
      propertyId:    kostProperties.id,
      propertyName:  kostProperties.name,
      propertySlug:  kostProperties.slug,
      address:       kostProperties.address,
      city:          kostProperties.city,
      district:      kostProperties.district,
      kostType:      kostProperties.kostType,
      genderType:    kostProperties.genderType,
      rules:         kostProperties.rules,
      roomNumber:    rooms.roomNumber,
      roomType:      rooms.type,
      description:   rooms.description,
      pricePerMonth: sql<number>`CAST(${rooms.pricePerMonth} AS UNSIGNED)`,
      depositAmount: sql<number>`CAST(${rooms.depositAmount} AS UNSIGNED)`,
      size:          rooms.size,
      floorNumber:   rooms.floorNumber,
      status:        rooms.status,
      avgRating:     sql<number>`CAST(${rooms.avgRating} AS DECIMAL(3,2))`,
      viewCount:     sql<number>`CAST(${rooms.viewCount} AS UNSIGNED)`,
    })
    .from(rooms)
    .innerJoin(kostProperties, eq(kostProperties.id, rooms.propertyId))
    .where(and(eq(rooms.id, roomId), eq(kostProperties.isActive, true)))
    .limit(1);

    if (!room) return null;

    const rimgs = await db.select().from(roomImages).where(eq(roomImages.roomId, roomId)).orderBy(asc(roomImages.sortOrder));
    const pimgs = rimgs.length === 0
      ? await db.select().from(propertyImages).where(eq(propertyImages.propertyId, room.propertyId)).orderBy(asc(propertyImages.sortOrder))
      : [];

    const images = rimgs.length > 0
      ? rimgs.map((i) => ({ id: i.id, url: i.url, altText: i.altText, sortOrder: i.sortOrder, isPrimary: i.isPrimary }))
      : pimgs.map((i) => ({ id: i.id, url: i.url, altText: i.altText, sortOrder: i.sortOrder, isPrimary: i.isPrimary }));

    const facs = await db.select({
      id:       facilities.id,
      name:     facilities.name,
      icon:     facilities.icon,
      category: facilities.category,
    })
    .from(propertyFacilities)
    .innerJoin(facilities, eq(facilities.id, propertyFacilities.facilityId))
    .where(eq(propertyFacilities.propertyId, room.propertyId));

    return {
      ...room,
      pricePerMonth: Number(room.pricePerMonth),
      depositAmount: Number(room.depositAmount),
      avgRating:     Number(room.avgRating),
      viewCount:     Number(room.viewCount),
      images,
      facilities:    facs,
    };
  } catch {
    return null;
  }
}

export async function getPropertyDetail(slugOrId: string): Promise<PropertyDetail | null> {
  "use server";
  try {
    const [prop] = await db
      .select()
      .from(kostProperties)
      .where(
        and(
          eq(kostProperties.isActive, true),
          or(eq(kostProperties.slug, slugOrId), eq(kostProperties.id, slugOrId)) as any,
        )
      )
      .limit(1);

    if (!prop) return null;

    const [propertyRooms, images, facilityRows] = await Promise.all([
      db.select().from(rooms).where(eq(rooms.propertyId, prop.id)),
      db.select().from(propertyImages).where(eq(propertyImages.propertyId, prop.id)).orderBy(asc(propertyImages.sortOrder)),
      db
        .select({ id: facilities.id, name: facilities.name, icon: facilities.icon, category: facilities.category })
        .from(propertyFacilities)
        .innerJoin(facilities, eq(facilities.id, propertyFacilities.facilityId))
        .where(eq(propertyFacilities.propertyId, prop.id)),
    ]);

    return {
      id:          prop.id,
      name:        prop.name,
      slug:        prop.slug,
      description: prop.description,
      address:     prop.address,
      city:        prop.city,
      district:    prop.district,
      postalCode:  prop.postalCode,
      latitude:    prop.latitude,
      longitude:   prop.longitude,
      kostType:    prop.kostType,
      genderType:  prop.genderType,
      rules:       prop.rules,
      isActive:    prop.isActive,
      createdAt:   prop.createdAt,
      rooms: propertyRooms.map((r) => ({
        id:            r.id,
        roomNumber:    r.roomNumber,
        type:          r.type,
        pricePerMonth: Number(r.pricePerMonth),
        depositAmount: Number(r.depositAmount),
        size:          r.size,
        floorNumber:   r.floorNumber,
        status:        r.status,
        avgRating:     Number(r.avgRating),
      })),
      images: images.map((i) => ({
        id:        i.id,
        url:       i.url,
        altText:   i.altText,
        sortOrder: i.sortOrder,
        isPrimary: i.isPrimary,
      })),
      facilities: facilityRows.map((f) => ({
        id:       f.id,
        name:     f.name,
        icon:     f.icon,
        category: f.category,
      })),
    };
  } catch {
    return null;
  }
}

export async function getAllPropertySlugs(): Promise<{ slug: string; updatedAt: Date }[]> {
  "use server";
  try {
    const rows = await db
      .select({ slug: kostProperties.slug, updatedAt: kostProperties.updatedAt })
      .from(kostProperties)
      .where(eq(kostProperties.isActive, true));
    return rows;
  } catch {
    return [];
  }
}

export async function getTenantStats(): Promise<{
  total: number; available: number; occupied: number; pendingPayments: number;
}> {
  "use server";
  const user = await requireAuth(["tenant"]);
  try {
    const [tenant] = await db
      .select({ id: tenants.id })
      .from(tenants)
      .where(eq(tenants.userId, user.id))
      .limit(1);
    if (!tenant) return { total: 0, available: 0, occupied: 0, pendingPayments: 0 };

    const propertyRows = await db
      .select({ id: kostProperties.id })
      .from(kostProperties)
      .where(eq(kostProperties.tenantId, tenant.id));

    if (!propertyRows.length) return { total: 0, available: 0, occupied: 0, pendingPayments: 0 };

    const propertyIds = propertyRows.map((p) => p.id);
    const roomRows = await db
      .select({ status: rooms.status })
      .from(rooms)
      .where(sql`${rooms.propertyId} IN (${sql.join(propertyIds.map((id) => sql`${id}`), sql`, `)})`);

    const total     = roomRows.length;
    const available = roomRows.filter((r) => r.status === "available").length;
    const occupied  = roomRows.filter((r) => r.status === "occupied").length;

    return { total, available, occupied, pendingPayments: 0 };
  } catch {
    return { total: 0, available: 0, occupied: 0, pendingPayments: 0 };
  }
}

export async function getTenantRooms() {
  "use server";
  const user = await requireAuth(["tenant"]);
  try {
    const [tenant] = await db
      .select({ id: tenants.id })
      .from(tenants)
      .where(eq(tenants.userId, user.id))
      .limit(1);
    if (!tenant) return { properties: [] };

    const props = await db
      .select({
        id:        kostProperties.id,
        name:      kostProperties.name,
        slug:      kostProperties.slug,
        district:  kostProperties.district,
        kostType:  kostProperties.kostType,
        genderType:kostProperties.genderType,
        isActive:  kostProperties.isActive,
        createdAt: kostProperties.createdAt,
        roomTotal:     sql<number>`COUNT(DISTINCT ${rooms.id})`,
        roomAvailable: sql<number>`SUM(CASE WHEN ${rooms.status} = 'available' THEN 1 ELSE 0 END)`,
        minPrice:      sql<number>`CAST(MIN(${rooms.pricePerMonth}) AS UNSIGNED)`,
      })
      .from(kostProperties)
      .leftJoin(rooms, eq(rooms.propertyId, kostProperties.id))
      .where(eq(kostProperties.tenantId, tenant.id))
      .groupBy(kostProperties.id)
      .orderBy(desc(kostProperties.createdAt));

    return {
      properties: props.map((p) => ({
        id:            p.id,
        name:          p.name,
        slug:          p.slug,
        district:      p.district,
        kostType:      p.kostType,
        genderType:    p.genderType,
        isActive:      p.isActive,
        createdAt:     p.createdAt,
        roomTotal:     Number(p.roomTotal ?? 0),
        roomAvailable: Number(p.roomAvailable ?? 0),
        minPrice:      Number(p.minPrice ?? 0),
      })),
    };
  } catch {
    return { properties: [] };
  }
}

export async function createPropertyAction(formData: FormData) {
  "use server";
  const user   = await requireAuth(["tenant"]);
  const raw    = Object.fromEntries(formData);
  const parsed = createPropertySchema.safeParse(raw);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  try {
    const [tenant] = await db
      .select({ id: tenants.id })
      .from(tenants)
      .where(eq(tenants.userId, user.id))
      .limit(1);
    if (!tenant) return { error: "Profil pemilik kos tidak ditemukan" };

    const slug = generateSlug(parsed.data.name);
    const id   = uuidv7();
    await db.insert(kostProperties).values({
      id,
      tenantId:    tenant.id,
      name:        parsed.data.name,
      slug,
      description: parsed.data.description ?? null,
      address:     parsed.data.address,
      city:        parsed.data.city ?? "Purwokerto",
      district:    parsed.data.district,
      kostType:    parsed.data.kostType as any,
      genderType:  parsed.data.genderType as any,
      rules:       parsed.data.rules ?? null,
    });

    return { success: true, slug, id };
  } catch {
    return { error: "Gagal menyimpan data. Coba lagi." };
  }
}

async function getTenantForUser(userId: string) {
  const [t] = await db.select({ id: tenants.id })
    .from(tenants).where(eq(tenants.userId, userId)).limit(1);
  return t ?? null;
}

async function verifyPropertyOwner(propertyId: string, tenantId: string) {
  const [p] = await db.select({ id: kostProperties.id })
    .from(kostProperties)
    .where(and(eq(kostProperties.id, propertyId), eq(kostProperties.tenantId, tenantId)))
    .limit(1);
  return p ?? null;
}

export async function getPropertyRooms(propertyId: string): Promise<{ property: any; rooms: RoomDetail[] }> {
  "use server";
  const user   = await requireAuth(["tenant"]);
  const tenant = await getTenantForUser(user.id);
  if (!tenant) return { property: null, rooms: [] };

  const property = await verifyPropertyOwner(propertyId, tenant.id);
  if (!property) return { property: null, rooms: [] };

  const [prop] = await db.select().from(kostProperties)
    .where(eq(kostProperties.id, propertyId)).limit(1);

  const propertyRooms = await db.select().from(rooms)
    .where(eq(rooms.propertyId, propertyId))
    .orderBy(asc(rooms.roomNumber));

  return {
    property: prop ? {
      id:          prop.id,
      name:        prop.name,
      slug:        prop.slug,
      description: prop.description,
      address:     prop.address,
      city:        prop.city,
      district:    prop.district,
      postalCode:  prop.postalCode,
      kostType:    prop.kostType,
      genderType:  prop.genderType,
      rules:       prop.rules,
      isActive:    prop.isActive,
      createdAt:   prop.createdAt,
    } : null,
    rooms: propertyRooms.map((r) => ({
      id:            r.id,
      roomNumber:    r.roomNumber,
      type:          r.type,
      pricePerMonth: Number(r.pricePerMonth),
      depositAmount: Number(r.depositAmount),
      size:          r.size,
      floorNumber:   r.floorNumber,
      status:        r.status as any,
      avgRating:     Number(r.avgRating),
    })),
  };
}

export async function createRoomAction(formData: FormData) {
  "use server";
  const user   = await requireAuth(["tenant"]);
  const raw    = Object.fromEntries(formData);
  const parsed = createRoomSchema.safeParse(raw);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const tenant = await getTenantForUser(user.id);
  if (!tenant) return { error: "Profil pemilik kos tidak ditemukan" };

  const property = await verifyPropertyOwner(parsed.data.propertyId, tenant.id);
  if (!property) return { error: "Properti tidak ditemukan atau bukan milik Anda" };

  const id = uuidv7();
  await db.insert(rooms).values({
    id,
    propertyId:    parsed.data.propertyId,
    roomNumber:    parsed.data.roomNumber,
    type:          parsed.data.type,
    pricePerMonth: parsed.data.pricePerMonth.toString(),
    depositAmount: (parsed.data.depositAmount ?? 0).toString(),
    size:          parsed.data.size || null,
    floorNumber:   parsed.data.floorNumber ?? null,
    status:        (parsed.data.status ?? "available") as any,
  });
  return { success: true, id };
}

export async function updateRoomAction(formData: FormData) {
  "use server";
  const user   = await requireAuth(["tenant"]);
  const raw    = Object.fromEntries(formData);
  const parsed = updateRoomSchema.safeParse(raw);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const tenant = await getTenantForUser(user.id);
  if (!tenant) return { error: "Profil pemilik kos tidak ditemukan" };

  const property = await verifyPropertyOwner(parsed.data.propertyId, tenant.id);
  if (!property) return { error: "Properti tidak ditemukan atau bukan milik Anda" };

  await db.update(rooms).set({
    roomNumber:    parsed.data.roomNumber,
    type:          parsed.data.type,
    pricePerMonth: parsed.data.pricePerMonth.toString(),
    depositAmount: (parsed.data.depositAmount ?? 0).toString(),
    size:          parsed.data.size || null,
    floorNumber:   parsed.data.floorNumber ?? null,
    status:        (parsed.data.status ?? "available") as any,
  }).where(eq(rooms.id, parsed.data.roomId));

  return { success: true };
}

export async function deleteRoomAction(roomId: string) {
  "use server";
  const user   = await requireAuth(["tenant"]);
  const tenant = await getTenantForUser(user.id);
  if (!tenant) return { error: "Profil pemilik kos tidak ditemukan" };

  const [room] = await db.select({ id: rooms.id, propertyId: rooms.propertyId })
    .from(rooms).where(eq(rooms.id, roomId)).limit(1);
  if (!room) return { error: "Kamar tidak ditemukan" };

  const property = await verifyPropertyOwner(room.propertyId, tenant.id);
  if (!property) return { error: "Akses ditolak" };

  await db.delete(rooms).where(eq(rooms.id, roomId));
  return { success: true };
}

export async function updatePropertyAction(formData: FormData) {
  "use server";
  const user   = await requireAuth(["tenant"]);
  const raw    = Object.fromEntries(formData);
  const parsed = updatePropertySchema.safeParse(raw);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const tenant = await getTenantForUser(user.id);
  if (!tenant) return { error: "Profil pemilik kos tidak ditemukan" };

  const property = await verifyPropertyOwner(parsed.data.propertyId, tenant.id);
  if (!property) return { error: "Properti tidak ditemukan atau bukan milik Anda" };

  await db.update(kostProperties).set({
    name:        parsed.data.name,
    description: parsed.data.description ?? null,
    address:     parsed.data.address,
    city:        parsed.data.city ?? "Purwokerto",
    district:    parsed.data.district,
    kostType:    parsed.data.kostType as any,
    genderType:  parsed.data.genderType as any,
    rules:       parsed.data.rules ?? null,
  }).where(eq(kostProperties.id, parsed.data.propertyId));

  return { success: true };
}

export async function togglePropertyActiveAction(propertyId: string) {
  "use server";
  const user   = await requireAuth(["tenant"]);
  const tenant = await getTenantForUser(user.id);
  if (!tenant) return { error: "Profil pemilik kos tidak ditemukan" };

  const [prop] = await db.select({ id: kostProperties.id, isActive: kostProperties.isActive })
    .from(kostProperties)
    .where(and(eq(kostProperties.id, propertyId), eq(kostProperties.tenantId, tenant.id)))
    .limit(1);
  if (!prop) return { error: "Properti tidak ditemukan" };

  await db.update(kostProperties).set({ isActive: !prop.isActive })
    .where(eq(kostProperties.id, propertyId));

  return { success: true, isActive: !prop.isActive };
}

export async function deletePropertyAction(propertyId: string) {
  "use server";
  const user   = await requireAuth(["tenant"]);
  const tenant = await getTenantForUser(user.id);
  if (!tenant) return { error: "Profil pemilik kos tidak ditemukan" };

  const property = await verifyPropertyOwner(propertyId, tenant.id);
  if (!property) return { error: "Properti tidak ditemukan atau bukan milik Anda" };

  await db.delete(kostProperties).where(eq(kostProperties.id, propertyId));
  return { success: true };
}

export async function getAdminStats() {
  "use server";
  await requireAuth(["admin"]);
  try {
    const [userCount] = await db.select({ count: count() }).from(kostProperties);
    return {
      totalUsers:     0,
      activeTenants:  0,
      totalRooms:     Number(userCount?.count ?? 0),
      pendingTenants: 0,
    };
  } catch {
    return { totalUsers: 0, activeTenants: 0, totalRooms: 0, pendingTenants: 0 };
  }
}
