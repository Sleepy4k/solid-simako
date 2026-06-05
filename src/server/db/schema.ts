import {
  mysqlTable, varchar, text, boolean, decimal,
  timestamp, date, tinyint, mysqlEnum,
  index, uniqueIndex, primaryKey,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { v7 as uuidv7 } from "uuid";

const uuid = () => varchar("id", { length: 36 }).primaryKey().$defaultFn(() => uuidv7());
const fk   = (col: string) => varchar(col, { length: 36 }).notNull();
const fkNull = (col: string) => varchar(col, { length: 36 });

export const users = mysqlTable("users", {
  id:           uuid(),
  name:         varchar("name",          { length: 100 }).notNull(),
  email:        varchar("email",         { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role:         mysqlEnum("role", ["user", "tenant", "admin"]).notNull().default("user"),
  phone:        varchar("phone",         { length: 20 }),
  avatarUrl:    varchar("avatar_url",    { length: 500 }),
  isVerified:   boolean("is_verified").notNull().default(false),
  isActive:     boolean("is_active").notNull().default(true),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
  updatedAt:    timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (t) => [
  uniqueIndex("users_email_idx").on(t.email),
  index("users_role_idx").on(t.role),
]);

export const tenants = mysqlTable("tenants", {
  id:           uuid(),
  userId:       fk("user_id").references(() => users.id, { onDelete: "cascade" }),
  businessName: varchar("business_name", { length: 150 }),
  ktpNumber:    varchar("ktp_number",    { length: 20 }),
  bankName:     varchar("bank_name",     { length: 50 }),
  bankAccount:  varchar("bank_account",  { length: 50 }),
  bankHolder:   varchar("bank_holder",   { length: 100 }),
  isApproved:   boolean("is_approved").notNull().default(false),
  approvedAt:   timestamp("approved_at"),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  uniqueIndex("tenants_user_idx").on(t.userId),
]);

export const kostProperties = mysqlTable("kost_properties", {
  id:          uuid(),
  tenantId:    fk("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  name:        varchar("name",        { length: 150 }).notNull(),
  slug:        varchar("slug",        { length: 200 }).notNull().unique(),
  description: text("description"),
  address:     varchar("address",     { length: 300 }).notNull(),
  city:        varchar("city",        { length: 100 }).notNull().default("Purwokerto"),
  district:    varchar("district",    { length: 100 }).notNull(),
  postalCode:  varchar("postal_code", { length: 10 }),
  latitude:    decimal("latitude",    { precision: 10, scale: 7 }),
  longitude:   decimal("longitude",   { precision: 10, scale: 7 }),
  rules:       text("rules"),
  kostType:    mysqlEnum("kost_type",   ["kost", "guest_house", "apartment", "kontrakan"]).notNull().default("kost"),
  genderType:  mysqlEnum("gender_type", ["male", "female", "mixed", "campus"]).notNull().default("mixed"),
  isActive:    boolean("is_active").notNull().default(true),
  createdAt:   timestamp("created_at").defaultNow().notNull(),
  updatedAt:   timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (t) => [
  uniqueIndex("kost_slug_idx").on(t.slug),
  index("kost_tenant_idx").on(t.tenantId),
  index("kost_city_idx").on(t.city),
  index("kost_gender_idx").on(t.genderType),
  index("kost_type_idx").on(t.kostType),
]);

export const rooms = mysqlTable("rooms", {
  id:            uuid(),
  propertyId:    fk("property_id").references(() => kostProperties.id, { onDelete: "cascade" }),
  roomNumber:    varchar("room_number", { length: 20 }).notNull(),
  type:          varchar("type",        { length: 100 }).notNull().default("Standard"),
  slug:          varchar("slug",        { length: 250 }).unique(),
  description:   text("description"),
  pricePerMonth: decimal("price_per_month", { precision: 12, scale: 0 }).notNull(),
  depositAmount: decimal("deposit_amount",  { precision: 12, scale: 0 }).notNull().default("0"),
  size:          varchar("size",        { length: 30 }),
  floorNumber:   tinyint("floor_number"),
  status:        mysqlEnum("status", ["available", "occupied", "maintenance"]).notNull().default("available"),
  viewCount:     decimal("view_count",  { precision: 10, scale: 0 }).notNull().default("0"),
  avgRating:     decimal("avg_rating",  { precision: 3, scale: 2 }).notNull().default("0.00"),
  createdAt:     timestamp("created_at").defaultNow().notNull(),
  updatedAt:     timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (t) => [
  index("rooms_property_idx").on(t.propertyId),
  index("rooms_status_idx").on(t.status),
]);

export const facilities = mysqlTable("facilities", {
  id:       uuid(),
  slug:     varchar("slug",     { length: 50 }).notNull().unique(),
  name:     varchar("name",     { length: 100 }).notNull(),
  icon:     varchar("icon",     { length: 50 }).notNull(),
  category: mysqlEnum("category", ["basic", "bathroom", "connectivity", "security", "parking", "kitchen", "service"]).notNull(),
}, (t) => [
  uniqueIndex("facilities_slug_idx").on(t.slug),
]);

export const propertyFacilities = mysqlTable("property_facilities", {
  propertyId: fk("property_id").references(() => kostProperties.id, { onDelete: "cascade" }),
  facilityId: fk("facility_id").references(() => facilities.id,     { onDelete: "cascade" }),
}, (t) => [
  primaryKey({ columns: [t.propertyId, t.facilityId] }),
]);

export const propertyImages = mysqlTable("property_images", {
  id:         uuid(),
  propertyId: fk("property_id").references(() => kostProperties.id, { onDelete: "cascade" }),
  url:        varchar("url",      { length: 500 }).notNull(),
  altText:    varchar("alt_text", { length: 200 }),
  sortOrder:  tinyint("sort_order").notNull().default(0),
  isPrimary:  boolean("is_primary").notNull().default(false),
}, (t) => [
  index("images_property_idx").on(t.propertyId),
]);

export const roomImages = mysqlTable("room_images", {
  id:        uuid(),
  roomId:    fk("room_id").references(() => rooms.id, { onDelete: "cascade" }),
  url:       varchar("url",      { length: 500 }).notNull(),
  altText:   varchar("alt_text", { length: 200 }),
  sortOrder: tinyint("sort_order").notNull().default(0),
  isPrimary: boolean("is_primary").notNull().default(false),
}, (t) => [index("room_images_room_idx").on(t.roomId)]);

export const roomViews = mysqlTable("room_views", {
  id:        uuid(),
  roomId:    fk("room_id").references(() => rooms.id, { onDelete: "cascade" }),
  ipAddress: varchar("ip_address", { length: 50 }).notNull(),
  viewedAt:  timestamp("viewed_at").defaultNow().notNull(),
}, (t) => [
  index("room_views_room_idx").on(t.roomId),
  index("room_views_ip_idx").on(t.ipAddress),
]);

export const propertyViews = mysqlTable("property_views", {
  id:         uuid(),
  propertyId: fk("property_id").references(() => kostProperties.id, { onDelete: "cascade" }),
  ipAddress:  varchar("ip_address", { length: 50 }).notNull(),
  viewedAt:   timestamp("viewed_at").defaultNow().notNull(),
}, (t) => [
  index("property_views_property_idx").on(t.propertyId),
  index("property_views_ip_idx").on(t.ipAddress),
]);

export const userFavorites = mysqlTable("user_favorites", {
  userId:    fk("user_id").references(() => users.id, { onDelete: "cascade" }),
  roomId:    fk("room_id").references(() => rooms.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  primaryKey({ columns: [t.userId, t.roomId] }),
  index("fav_user_idx").on(t.userId),
]);

export const bookings = mysqlTable("bookings", {
  id:             uuid(),
  userId:         fk("user_id").references(() => users.id, { onDelete: "restrict" }),
  roomId:         fk("room_id").references(() => rooms.id, { onDelete: "restrict" }),
  startDate:      date("start_date").notNull(),
  endDate:        date("end_date"),
  durationMonths: tinyint("duration_months").notNull().default(1),
  totalAmount:    decimal("total_amount",   { precision: 12, scale: 0 }).notNull(),
  depositAmount:  decimal("deposit_amount", { precision: 12, scale: 0 }).notNull().default("0"),
  status:         mysqlEnum("status", ["pending", "active", "ended", "cancelled"]).notNull().default("pending"),
  notes:          text("notes"),
  createdAt:      timestamp("created_at").defaultNow().notNull(),
  updatedAt:      timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (t) => [
  index("bookings_user_idx").on(t.userId),
  index("bookings_room_idx").on(t.roomId),
  index("bookings_status_idx").on(t.status),
]);

export const paymentProofs = mysqlTable("payment_proofs", {
  id:              uuid(),
  bookingId:       fk("booking_id").references(() => bookings.id, { onDelete: "cascade" }),
  imageUrl:        varchar("image_url",      { length: 500 }).notNull(),
  senderBank:      varchar("sender_bank",    { length: 100 }).notNull(),
  accountHolder:   varchar("account_holder", { length: 100 }).notNull(),
  transferDate:    date("transfer_date").notNull(),
  amount:          decimal("amount",         { precision: 12, scale: 0 }).notNull(),
  notes:           text("notes"),
  status:          mysqlEnum("status", ["pending", "approved", "rejected"]).notNull().default("pending"),
  reviewedBy:      fkNull("reviewed_by").references(() => users.id, { onDelete: "set null" }),
  reviewedAt:      timestamp("reviewed_at"),
  rejectionReason: text("rejection_reason"),
  createdAt:       timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("proofs_booking_idx").on(t.bookingId),
  index("proofs_status_idx").on(t.status),
]);

export const reviews = mysqlTable("reviews", {
  id:        uuid(),
  bookingId: fk("booking_id").references(() => bookings.id, { onDelete: "cascade" }).unique(),
  userId:    fk("user_id").references(() => users.id,        { onDelete: "cascade" }),
  roomId:    fk("room_id").references(() => rooms.id,        { onDelete: "cascade" }),
  rating:    tinyint("rating").notNull(),
  comment:   text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("reviews_room_idx").on(t.roomId),
  index("reviews_user_idx").on(t.userId),
]);

export const notifications = mysqlTable("notifications", {
  id:        uuid(),
  userId:    fk("user_id").references(() => users.id, { onDelete: "cascade" }),
  type:      mysqlEnum("type", ["payment", "booking", "review", "system"]).notNull(),
  title:     varchar("title", { length: 200 }).notNull(),
  body:      text("body").notNull(),
  isRead:    boolean("is_read").notNull().default(false),
  relatedId: varchar("related_id", { length: 36 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("notif_user_idx").on(t.userId),
  index("notif_read_idx").on(t.isRead),
]);

export const usersRelations = relations(users, ({ one, many }) => ({
  tenant:        one(tenants,       { fields: [users.id],    references: [tenants.userId] }),
  favorites:     many(userFavorites),
  bookings:      many(bookings),
  reviews:       many(reviews),
  notifications: many(notifications),
}));

export const tenantsRelations = relations(tenants, ({ one, many }) => ({
  user:       one(users,          { fields: [tenants.userId],     references: [users.id] }),
  properties: many(kostProperties),
}));

export const kostPropertiesRelations = relations(kostProperties, ({ one, many }) => ({
  tenant:     one(tenants,  { fields: [kostProperties.tenantId], references: [tenants.id] }),
  rooms:      many(rooms),
  facilities: many(propertyFacilities),
  images:     many(propertyImages),
  views:      many(propertyViews),
}));

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  property:   one(kostProperties, { fields: [rooms.propertyId], references: [kostProperties.id] }),
  favorites:  many(userFavorites),
  bookings:   many(bookings),
  reviews:    many(reviews),
  images:     many(roomImages),
  views:      many(roomViews),
}));

export const roomImagesRelations = relations(roomImages, ({ one }) => ({
  room: one(rooms, { fields: [roomImages.roomId], references: [rooms.id] }),
}));

export const roomViewsRelations = relations(roomViews, ({ one }) => ({
  room: one(rooms, { fields: [roomViews.roomId], references: [rooms.id] }),
}));

export const propertyViewsRelations = relations(propertyViews, ({ one }) => ({
  property: one(kostProperties, { fields: [propertyViews.propertyId], references: [kostProperties.id] }),
}));

export const propertyFacilitiesRelations = relations(propertyFacilities, ({ one }) => ({
  property: one(kostProperties, { fields: [propertyFacilities.propertyId], references: [kostProperties.id] }),
  facility: one(facilities,     { fields: [propertyFacilities.facilityId], references: [facilities.id] }),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  user:          one(users, { fields: [bookings.userId], references: [users.id] }),
  room:          one(rooms, { fields: [bookings.roomId], references: [rooms.id] }),
  paymentProofs: many(paymentProofs),
  review:        one(reviews, { fields: [bookings.id], references: [reviews.bookingId] }),
}));

export const paymentProofsRelations = relations(paymentProofs, ({ one }) => ({
  booking:    one(bookings, { fields: [paymentProofs.bookingId], references: [bookings.id] }),
  reviewedBy: one(users,    { fields: [paymentProofs.reviewedBy], references: [users.id] }),
}));
